import { create } from "zustand";
import { tree as jobTree } from "../../data/tree";
import {
	getJobById,
	getSkillById,
	getJobTotalSkillPoints,
	classSkillPoints,
} from "../utils";
import { updateSkillRequirements } from "../utils/skillRequirements";
import { produce } from "immer";

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
		skills: Array<Record<string, unknown>>,
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
				const totalSkillPoints = getJobTotalSkillPoints(
					state.classSkillPoints,
					jobId,
					characterLevel,
				);

				const job = getJobById(jobId, state.jobTree);
				if (!job) return state;

				const spentSkillPoints = job.skills.reduce(
					(total, skill) => total + skill.skillLevel * skill.skillPoints,
					0,
				);

				state.skillPoints = totalSkillPoints - spentSkillPoints;
				return state;
			}),
		),
	increaseSkillPoint: (jobId: number, skillId: number) =>
		set(
			produce((state: State) => {
				const job = getJobById(jobId, state.jobTree);
				if (!job) return state;

				const skill = getSkillById(skillId, job.skills);
				if (!skill) return state;

				if (skill.skillLevel === skill.levels.length) return state;
				if (skill.skillPoints > state.skillPoints) return state;

				skill.skillLevel += 1;
				state.skillPoints -= skill.skillPoints;

				// Update skill requirements using the utility function
				updateSkillRequirements(job, skillId, skill.skillLevel);
				return state;
			}),
		),
	decreaseSkillPoint: (jobId: number, skillId: number) =>
		set(
			produce((state: State) => {
				const job = getJobById(jobId, state.jobTree);
				if (!job) return state;

				const skill = getSkillById(skillId, job.skills);
				if (!skill || skill.skillLevel === 0) return state;

				skill.skillLevel -= 1;
				state.skillPoints += skill.skillPoints;

				// Update skill requirements using the utility function
				updateSkillRequirements(job, skillId, skill.skillLevel);
				return state;
			}),
		),
	createPreloadedSkillTree: (
		jobId: number,
		predefinedSkills: Array<Record<string, unknown>>,
	) =>
		set(
			produce((state: State) => {
				const job = getJobById(jobId, state.jobTree);
				if (!job) return state;

				for (const originalTreeSkill of job.skills) {
					for (const predefinedTreeSkill of predefinedSkills) {
						if (originalTreeSkill.id === predefinedTreeSkill.skill) {
							originalTreeSkill.skillLevel =
								predefinedTreeSkill.level as number;
						}
					}

					const skill = getSkillById(originalTreeSkill.id, job.skills);
					if (skill) {
						updateSkillRequirements(
							job,
							originalTreeSkill.id,
							skill.skillLevel,
						);
					}
				}
				return state;
			}),
		),
	increaseSkillToMax: (skillId: number, jobId: number) =>
		set(
			produce((state: State) => {
				const job = getJobById(jobId, state.jobTree);
				if (!job) return state;

				const skill = getSkillById(skillId, job.skills);
				if (!skill) return state;

				if (skill.levels.length === skill.skillLevel) return state;

				const maxPossibleLevel = Math.min(
					skill.levels.length,
					Math.floor(state.skillPoints / skill.skillPoints),
				);

				if (maxPossibleLevel > skill.skillLevel) {
					const levelsToAdd = maxPossibleLevel - skill.skillLevel;
					skill.skillLevel = maxPossibleLevel;
					state.skillPoints -= levelsToAdd * skill.skillPoints;
				}

				// Update skill requirements using the utility function
				updateSkillRequirements(job, skillId, skill.skillLevel);
				return state;
			}),
		),
	resetSkillTree: (jobId: number) =>
		set((state: State) => {
			const skillPoints = getJobTotalSkillPoints(
				state.classSkillPoints,
				jobId,
				15,
			);

			return {
				...initialState,
				skillPoints,
			};
		}),
}));
