import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { Suspense } from "react";
import { Link, useParams } from "@tanstack/react-router";
import Skill from "../components/Skill";
import { useSkillTree } from "../hooks/useSkillTree";
import { t } from "i18next";

export const Route = createFileRoute("/c/$class")({
	component: SkillTree,
});

function SkillTree() {
	const {
		job,
		skills,
		level,
		skillPoints,
		copied,
		language,
		handleLevelChange,
		copyToClipboard,
		handleReset,
	} = useSkillTree();

	const params = useParams({ from: "/c/$class" });

	return (
		<>
			<Suspense>
				<div className="px-5 2xl:px-20 my-10">
					<div className="flex flex-col justify-between mb-2 md:flex-row">
						<div className="flex flex-col-reverse">
							<h1 className="text-2xl font-bold capitalize">{params.class}</h1>
							<Link
								to="/"
								className="mb-2 text-indigo-600 hover:underline md:mb-4 a11y-focus"
							>
								{" "}
								&larr; {t("classSelectionLink")}
							</Link>
						</div>
						<div className="flex flex-col gap-2 md:flex-row">
							<div className="flex justify-between gap-2">
								<div className="self-end h-min">
									<p>{t("availSkillPoints")}</p>
									<span className="font-bold">{skillPoints}</span>
								</div>
								<div className="flex flex-col self-end h-min">
									<label htmlFor="characterLevel" className="text-sm">
										{t("charLevel")}
									</label>
									<input
										type="number"
										className="rounded-md border border-gray-300 px-4 py-1.5 a11y-focus"
										inputMode="numeric"
										pattern="[0-9]*"
										value={level}
										onChange={handleLevelChange}
										min={15}
										max={165}
									/>
								</div>
							</div>
							<button
								type="button"
								disabled={copied}
								onClick={copyToClipboard}
								className={clsx(
									"h-min w-full self-end rounded-md bg-indigo-500 px-4 py-1.5 font-semibold text-white duration-150 hover:bg-indigo-600 md:w-max a11y-focus",
									copied ? "disabled:bg-green-500" : undefined,
								)}
							>
								{copied ? t("copiedText") : t("copyText")}
							</button>
							<button
								type="button"
								className="h-min w-full self-end rounded-md border border-red-300 bg-red-100 px-4 py-1.5 text-red-900 duration-150 hover:bg-red-200 md:w-max a11y-focus"
								onClick={handleReset}
							>
								{t("resetText")}
							</button>
						</div>
					</div>
					<div
						className={clsx(
							"w-full space-y-1 md:grid md:grid-cols-5 md:gap-1 md:space-y-0",
							params.class,
						)}
					>
						{skills?.map((skill) => (
							<Skill
								lang={language}
								key={skill.id}
								hasMinLevelRequirements={skill.hasMinLevelRequirements}
								isMaxed={skill.isMaxed}
								skill={skill}
								skillId={skill.id}
								jobId={job?.id}
							/>
						))}
					</div>
				</div>
			</Suspense>
		</>
	);
}
