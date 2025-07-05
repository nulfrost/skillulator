export interface Job {
	name: string;
	image: string;
	id: number;
}

export const JOBS: Job[] = [
	{
		name: "blade",
		image: "blade.png",
		id: 2246,
	},
	{
		name: "knight",
		image: "knight.png",
		id: 5330,
	},
	{
		name: "elementor",
		image: "elementor.png",
		id: 9150,
	},
	{
		name: "psykeeper",
		image: "psychikeeper.png",
		id: 5709,
	},
	{
		name: "billposter",
		image: "billposter.png",
		id: 7424,
	},
	{
		name: "ringmaster",
		image: "ringmaster.png",
		id: 9389,
	},
	{
		name: "ranger",
		image: "ranger.png",
		id: 9295,
	},
	{
		name: "jester",
		image: "jester.png",
		id: 3545,
	},
];

export const DEFAULT_CHARACTER_LEVEL = 15;
export const MAX_CHARACTER_LEVEL = 165;
export const MIN_CHARACTER_LEVEL = 15;

export const COPY_TIMEOUT_MS = 3000;
