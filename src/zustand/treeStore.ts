import { create } from "zustand";
import { tree as jobTree } from "../../data/tree";
import {
  getJobById,
  getSkillById,
  getJobTotalSkillPoints,
  classSkillPoints,
} from "../utils";
import { produce } from "immer";
// import { immer } from "zustand/middleware/immer";
// import { persist, StateStorage } from "zustand/middleware";

// function getUrlSearch() {
//   return window.location.search.slice(1);
// }

// const persistentStorage: StateStorage = {
//   getItem: (key): string => {
//     const searchParams = new URLSearchParams(getUrlSearch());
//     const storedValue = searchParams.get(key) as string;
//     return JSON.parse(storedValue);
//   },
//   setItem: (key, newValue): void => {
//     const searchParams = new URLSearchParams(getUrlSearch());
//     searchParams.set(key, JSON.stringify(newValue));
//     window.history.replaceState(null, "", `?${searchParams.toString()}`);
//   },
// };

// for some reason when building, it's reading the json file instead of the new tree in memory
// need to figure out a way to copy

export type State = {
  jobTree: typeof jobTree;
  skillPoints: number;
  classSkillPoints: typeof classSkillPoints;
};

type Actions = {
  increaseSkillPoint: (jobId: number, skillId: number) => void;
  increaseSkillToMax: (jobId: number, skillId: number) => void;
  decreaseSkillPoint: (jobId: number, skillId: number) => void;
  setSkillPoints: (jobId: number, characterLevel: number) => void;

  createPreloadedSkillTree: (
    jobId: number,
    skills: Array<Record<string, unknown>>
  ) => void;
  resetSkillTree: (jobId: number) => void;
};

const initialState: State = {
  jobTree,
  classSkillPoints,
  skillPoints: 0,
};

export const useTreeStore = create<State & Actions>()((set, get) => ({
  jobTree,
  classSkillPoints,
  skillPoints: 0,
  setSkillPoints: (jobId: number, characterLevel: number) =>
    set(
      produce((state: State) => {
        // need to figure out how many skill points are already spent and subtract it
        let skillPoints = getJobTotalSkillPoints(
          state.classSkillPoints,
          jobId,
          characterLevel
        );

        let skillPointsToSubtract = 0;
        const job = getJobById(jobId, state.jobTree);
        job?.skills.forEach((s) => {
          skillPointsToSubtract += s.skillLevel * s.skillPoints;
        });
        let remainingSkillPoints = skillPoints - skillPointsToSubtract;

        state.skillPoints = remainingSkillPoints;
        // console.log(skillPoints - (job?.skills[0].skillLevel * job?.skills[0].skillPoints))
        // return {
        //   ...state,
        //   skillPoints: state.skillPoints,
        // };
        return state;
      })
    ),
  increaseSkillPoint: (jobId: number, skillId: number) =>
    set(
      produce((state: State) => {
        // find the job
        const job = getJobById(jobId, state.jobTree);
        // find skill
        const skill = getSkillById(skillId, job?.skills!);
        if (skill!.skillLevel === skill!.levels.length) return state;
        if (skill!.skillPoints > state.skillPoints) return state;
        skill!.skillLevel += 1;
        state.skillPoints -= skill!.skillPoints;

        // find all required skills
        // if it's the min level, switch hasMinLevel to true
        job?.skills.forEach((s) => {
          const foundSkill = s.requirements.find((sz) => sz.skill === skillId);
          const skillIndex = s.requirements.findIndex(
            (sx) => sx.skill === skillId
          );
          if (
            typeof foundSkill !== "undefined" &&
            foundSkill.level === skill!.skillLevel
          ) {
            s.requirements[skillIndex].hasMinLevel = true;
          }
        });
        return state;
      })
    ),
  decreaseSkillPoint: (jobId: number, skillId: number) =>
    set((state: State) => {
      // find the job
      const job = getJobById(jobId, state.jobTree);
      // find skill
      const skill = getSkillById(skillId, job?.skills!);
      if (skill?.skillLevel === 0) return state;
      skill!.skillLevel -= 1;
      state.skillPoints += skill!.skillPoints;
      // find all required skills
      // if the skillLevel is less than the required skills required level switch to false
      job?.skills.forEach((s) => {
        const foundSkill = s.requirements.find((sz) => sz.skill === skillId);
        const skillIndex = s.requirements.findIndex(
          (sx) => sx.skill === skillId
        );
        if (
          typeof foundSkill !== "undefined" &&
          skill!.skillLevel < foundSkill.level
        ) {
          s.requirements[skillIndex].hasMinLevel = false;
        }
      });
      return {
        ...state,
        jobTree: [...state.jobTree],
      };
    }),
  createPreloadedSkillTree: (
    jobId: number,
    predefinedSkills: Array<Record<string, unknown>>
  ) =>
    set(
      produce((state: State) => {
        // we map over the pre-defined skills
        // we check the skill id and level and update the skillLevel accordingly
        // we also need to do the check to see if the skill is the min level
        const job = getJobById(jobId, state.jobTree);
        job?.skills.forEach((originalTreeSkill) => {
          predefinedSkills.forEach((predefinedTreeSkill) => {
            if (originalTreeSkill.id === predefinedTreeSkill.skill) {
              originalTreeSkill.skillLevel = predefinedTreeSkill.level;
            }
          });

          const skill = getSkillById(originalTreeSkill.id, job?.skills!);

          job?.skills.forEach((s) => {
            const foundSkill = s.requirements.find(
              (sz) => sz.skill === originalTreeSkill.id
            );
            const skillIndex = s.requirements.findIndex(
              (sx) => sx.skill === originalTreeSkill.id
            );
            if (
              typeof foundSkill !== "undefined" &&
              foundSkill.level <= skill!.skillLevel
            ) {
              s.requirements[skillIndex].hasMinLevel = true;
            }
          });
        });
      })
    ),
  increaseSkillToMax: (skillId: number, jobId: number) =>
    set(
      produce((state: State) => {
        const job = getJobById(jobId, state.jobTree);
        const skill = getSkillById(skillId, job?.skills!);
        if (skill!.levels.length * skill!.skillLevel < state.skillPoints) {
          skill!.skillLevel =
            state.skillPoints / skill!.skillPoints > skill!.levels.length
              ? skill!.levels.length
              : state.skillPoints / skill!.skillPoints;
          state.skillPoints -= skill!.skillLevel * skill!.skillPoints;
        }

        // refactor this block of code
        job?.skills.forEach((s) => {
          const foundSkill = s.requirements.find((sz) => sz.skill === skillId);
          const skillIndex = s.requirements.findIndex(
            (sx) => sx.skill === skillId
          );
          if (
            typeof foundSkill !== "undefined" &&
            (foundSkill.level < skill!.skillLevel ||
              foundSkill.level === skill!.skillLevel)
          ) {
            s.requirements[skillIndex].hasMinLevel = true;
          }
        });
      })
    ),
  resetSkillTree: (jobId: number) =>
    set((state: State) => {
      let skillPoints = getJobTotalSkillPoints(
        state.classSkillPoints,
        jobId,
        15
      );

      return {
        ...initialState,
        skillPoints,
      };
    }),
}));
