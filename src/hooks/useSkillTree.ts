import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import lzstring from "lz-string";
import { useTreeStore } from "../zustand/treeStore";
import { decodeTree, encodeTree, getJobByName } from "../utils";
import {
	checkSkillRequirements,
	isSkillMaxed,
} from "../utils/skillRequirements";

export function useSkillTree() {
	const { i18n } = useTranslation();
	const params = useParams({ from: "/c/$class" });
	const navigate = useNavigate();

	const [copied, setCopied] = useState(false);
	const [level, setLevel] = useState(15);

	const jobTree = useTreeStore((state) => state.jobTree);
	const createPreloadedSkillTree = useTreeStore(
		(state) => state.createPreloadedSkillTree,
	);
	const setSkillPoints = useTreeStore((state) => state.setSkillPoints);
	const skillPoints = useTreeStore((state) => state.skillPoints);
	const resetSkillTree = useTreeStore((state) => state.resetSkillTree);

	const job = getJobByName(params.class, jobTree);
	const jobId = job?.id;
	const skills = job?.skills;

	const handleLevelChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (!jobId) return;
			const newLevel = +event.target.value;
			setSkillPoints(jobId, newLevel);
			setLevel(newLevel);
		},
		[jobId, setSkillPoints],
	);

	const copyToClipboard = useCallback(async () => {
		if (!jobId || !skills) return;

		let treeCode = `${window.location.origin}/c/${params.class}`;
		const treeMap = encodeTree(skills, level);
		const encodedTree = lzstring.compressToEncodedURIComponent(treeMap);
		treeCode += `?tree=${encodedTree}`;

		try {
			if (navigator.clipboard && !copied) {
				await navigator.clipboard.writeText(treeCode);
				setCopied(true);
				window.setTimeout(() => setCopied(false), 3000);
			}
		} catch (e) {
			console.error("copyToClipboard", e);
			setCopied(false);
		}
	}, [params.class, copied, jobId, level, skills]);

	const handleReset = useCallback(() => {
		if (!jobId) return;
		resetSkillTree(jobId);
		setLevel(15);
	}, [jobId, resetSkillTree]);

	useEffect(() => {
		if (!jobId) return;

		const code = new URLSearchParams(window.location.search).get("tree") ?? "";
		if (!code) {
			setSkillPoints(jobId, level);
			return;
		}

		const decompressedCode = lzstring.decompressFromEncodedURIComponent(code);
		if (!decompressedCode) {
			alert("Error: Invalid tree code!");
			navigate({ to: `/c/${params.class}` });
			return;
		}

		const { untangledSkillMap, characterLevel } = decodeTree(decompressedCode);
		setLevel(+characterLevel);
		createPreloadedSkillTree(jobId, untangledSkillMap);
		setSkillPoints(jobId, +characterLevel);
	}, [
		jobId,
		level,
		setSkillPoints,
		createPreloadedSkillTree,
		navigate,
		params.class,
	]);

	const processedSkills = skills
		?.toSorted((a, b) => a.level - b.level)
		.map((skill) => ({
			...skill,
			hasMinLevelRequirements: checkSkillRequirements(skill),
			isMaxed: isSkillMaxed(skill),
		}));

	return {
		job,
		jobId,
		skills: processedSkills,
		level,
		skillPoints,
		copied,
		language: i18n.language,
		handleLevelChange,
		copyToClipboard,
		handleReset,
	};
}
