import type { State } from "../zustand/treeStore";

export function getJobById(jobId: number, jobs: State["jobTree"]) {
	return jobs.find((job) => job.id === jobId);
}

export function getSkillById(
	skillId: number,
	skills: State["jobTree"][number]["skills"],
) {
	return skills.find((skill) => skill.id === skillId);
}

export function getJobByName(jobName: string, jobs: State["jobTree"]) {
	return jobs.find(
		(job) => job.name.en.toLowerCase() === jobName.toLowerCase(),
	);
}

export function encodeTree(
	skills: State["jobTree"][number]["skills"],
	characterLevel: number,
) {
	return `${skills?.map((skill) => `${skill.id}:${skill.skillLevel}`).join(",")}#${characterLevel}`;
}

export function decodeTree(encodedSkills: string) {
	const parts = encodedSkills.split("#");
	const characterLevel = parts[1];
	const decodedTree = parts[0];

	if (!decodedTree) {
		throw new Error("Invalid encoded skills format");
	}

	return {
		untangledSkillMap: decodedTree
			.split(",")
			.map((skill) => skill.split(":"))
			.map((s) => ({ skill: +s[0], level: +s[1] })),
		characterLevel,
	};
}

interface LevelRange {
	min: number;
	max: number;
	pointsPerLevel: number;
	basePoints: number;
}

/**
 * Skill point calculation ranges for character levels
 * Each range defines the points per level and accumulated base points from previous ranges
 *
 * Example for level 160:
 * - Base points from previous ranges: 720
 * - Points for levels 151-160: (160 - 151) * 2 = 18
 * - Total base skill points: 720 + 18 = 738
 * - Final total includes job-specific points (varies by class)
 *   - Blade: 738 + 60 + 80 = 878
 *   - Elementor: 738 + 90 + 300 = 1128
 */
const LEVEL_RANGES: LevelRange[] = [
	{ min: 15, max: 20, pointsPerLevel: 2, basePoints: 0 },
	{ min: 21, max: 40, pointsPerLevel: 3, basePoints: 20 * 2 },
	{ min: 41, max: 60, pointsPerLevel: 4, basePoints: 20 * 3 + 20 * 2 },
	{ min: 61, max: 80, pointsPerLevel: 5, basePoints: 20 * 4 + 20 * 3 + 20 * 2 },
	{
		min: 81,
		max: 100,
		pointsPerLevel: 6,
		basePoints: 20 * 5 + 20 * 4 + 20 * 3 + 20 * 2,
	},
	{
		min: 101,
		max: 120,
		pointsPerLevel: 7,
		basePoints: 20 * 6 + 20 * 5 + 20 * 4 + 20 * 3 + 20 * 2,
	},
	{
		min: 121,
		max: 140,
		pointsPerLevel: 8,
		basePoints: 20 * 7 + 20 * 6 + 20 * 5 + 20 * 4 + 20 * 3 + 20 * 2,
	},
	{
		min: 141,
		max: 150,
		pointsPerLevel: 1,
		basePoints: 20 * 8 + 20 * 7 + 20 * 6 + 20 * 5 + 20 * 4 + 20 * 3 + 20 * 2,
	},
	{
		min: 151,
		max: 160,
		pointsPerLevel: 2,
		basePoints:
			20 * 1 + 20 * 8 + 20 * 7 + 20 * 6 + 20 * 5 + 20 * 4 + 20 * 3 + 20 * 2,
	},
	{
		min: 161,
		max: 165,
		pointsPerLevel: 2,
		basePoints:
			20 * 1 +
			20 * 8 +
			20 * 7 +
			20 * 6 +
			20 * 5 +
			20 * 4 +
			20 * 3 +
			20 * 2 +
			20 * 2,
	},
];

/**
 * Calculate base skill points for a given character level
 * This only includes level-based skill points, not job-specific bonuses
 *
 * @param characterLevel - The character's level (15-160)
 * @returns Base skill points for the level
 */
export function getSkillPointsForLevel(characterLevel: number): number {
	const range = LEVEL_RANGES.find(
		(r) => characterLevel >= r.min && characterLevel <= r.max,
	);

	if (!range) {
		return 0;
	}

	return range.basePoints + (characterLevel - range.min) * range.pointsPerLevel;
}

// eh this could be named better lol
export const classSkillPoints = {
	// elementor
	9150: {
		firstJobSP: 90,
		secondJobSP: 300,
	},
	//psykeeper
	5709: {
		firstJobSP: 90,
		secondJobSP: 90,
	},
	// blade
	2246: {
		firstJobSP: 60,
		secondJobSP: 80,
	},
	// knight
	5330: {
		firstJobSP: 60,
		secondJobSP: 80,
	},
	// billposter
	7424: {
		firstJobSP: 60,
		secondJobSP: 120,
	},
	// ringmaster
	9389: {
		firstJobSP: 60,
		secondJobSP: 100,
	},
	// ranger
	9295: {
		firstJobSP: 50,
		secondJobSP: 100,
	},
	// jester
	3545: {
		firstJobSP: 50,
		secondJobSP: 100,
	},
};

/**
 * Calculate total skill points including job-specific bonuses
 *
 * @param jobMap - Job skill point configuration
 * @param jobId - The job ID
 * @param characterLevel - The character's level
 * @returns Total skill points (base + job bonuses)
 */
export function getJobTotalSkillPoints(
	jobMap: typeof classSkillPoints,
	jobId: number,
	characterLevel: number,
) {
	const baseSkillPoints = getSkillPointsForLevel(characterLevel);

	if (characterLevel >= 60) {
		return (
			baseSkillPoints + jobMap[jobId].firstJobSP + jobMap[jobId].secondJobSP
		);
	}

	return baseSkillPoints + jobMap[jobId].firstJobSP;
}

export const languages = [
	{
		label: "en",
		value: "en",
		language: "English",
	},
	{
		label: "pt-BR",
		value: "br",
		locale: "pt-BR",
		language: "Português",
	},
	{
		label: "zh",
		value: "cns",
		locale: "zh-CN",
		language: "Chinese",
	},
	{
		label: "ja",
		value: "jp",
		language: "Japanese",
	},
	{
		label: "ko",
		value: "kr",
		language: "Korean",
	},
	{
		label: "es",
		value: "sp",
		language: "Spanish",
	},
	{
		label: "ru",
		value: "ru",
		language: "Russian",
	},
	{
		label: "de",
		value: "de",
		language: "German",
	},
	{
		label: "fi",
		value: "fi",
		language: "Finnish",
	},
	{
		label: "id",
		value: "id",
		language: "Indonesian",
	},
	{
		label: "it",
		value: "it",
		language: "Italian",
	},
	{
		label: "nl",
		value: "nl",
		language: "Dutch",
	},
	{
		label: "pl",
		value: "pl",
		language: "Polish",
	},
];

export function getLanguageForSkill(
	langs: typeof languages,
	appLanguage: string,
) {
	return langs.find((lang) => lang.label === appLanguage)?.value;
}
