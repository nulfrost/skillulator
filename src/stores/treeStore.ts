import treeJson from "../data/tree.json";
import { create } from "zustand";
import { getJobById, getSkillById } from "../utils";

export interface TreeState {
  tree: typeof treeJson;
  increaseSkillPoint: (jobId: number, skillId: number) => void;
  decreaseSkillPoint: (jobId: number, skillId: number) => void;
  createPreloadedSkillTree: (
    jobId: number,
    skills: Array<Record<string, unknown>>
  ) => void;
}

export const useTreeStore = create<TreeState>()((set) => ({
  tree: treeJson,
  increaseSkillPoint: (jobId: number, skillId: number) =>
    set((state) => {
      // find the job
      const job = getJobById(jobId, state.tree);
      // find skill
      const skill = getSkillById(skillId, job?.skills!);
      if (skill!.skillLevel === skill!.levels.length) return state;
      skill!.skillLevel += 1;
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

      return {
        ...state,
        tree: [...state.tree],
      };
    }),
  decreaseSkillPoint: (jobId: number, skillId: number) =>
    set((state) => {
      // find the job
      const job = getJobById(jobId, state.tree);
      // find skill
      const skill = getSkillById(skillId, job?.skills!);
      if (skill?.skillLevel === 0) return state;
      skill!.skillLevel -= 1;
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
        tree: [...state.tree],
      };
    }),
  createPreloadedSkillTree: (
    jobId: number,
    predefinedSkills: Array<Record<string, unknown>>
  ) =>
    set((state) => {
      // we map over the pre-defined skills
      // we check the skill id and level and update the skillLevel accordingly
      // we also need to do the check to see if the skill is the min level
      const job = getJobById(jobId, state.tree);
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
      return {
        ...state,
        tree: [...state.tree],
      };
    }),
}));
