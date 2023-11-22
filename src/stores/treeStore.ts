import treeJson from "../data/tree.json";
import { create } from "zustand";
import { getJobById, getSkillById } from "../utils";

export interface TreeState {
  tree: typeof treeJson;
  increaseSkillPoint: (jobId: number, skillId: number) => void;
  decreaseSkillPoint: (jobId: number, skillId: number) => void;
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
}));
