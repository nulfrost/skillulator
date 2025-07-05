import type { State } from "../zustand/treeStore";

export interface SkillRequirement {
	skill: number;
	level: number;
	hasMinLevel: boolean;
}

export function updateSkillRequirements(
	job: State["jobTree"][0],
	skillId: number,
	newSkillLevel: number,
): void {
	if (!job) return;

	for (const skill of job.skills) {
		const requirement = skill.requirements.find((req) => req.skill === skillId);
		if (!requirement) continue;

		const requirementIndex = skill.requirements.findIndex(
			(req) => req.skill === skillId,
		);

		// Update hasMinLevel based on whether the skill meets the requirement
		const meetsRequirement = newSkillLevel >= requirement.level;
		skill.requirements[requirementIndex].hasMinLevel = meetsRequirement;
	}
}

export function checkSkillRequirements(
	skill: State["jobTree"][0]["skills"][0],
): boolean {
	return skill.requirements.every((req) => req.hasMinLevel);
}

export function isSkillMaxed(skill: State["jobTree"][0]["skills"][0]): boolean {
	return skill.skillLevel === skill.levels.length;
}
