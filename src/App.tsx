import clsx from "clsx";
import lzstring from "lz-string";
import { ChangeEvent, Suspense, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Skill from "./components/Skill";
import { decodeTree, encodeTree, getJobByName } from "./utils/index";
import { useTreeStore } from "./zustand/treeStore";
import { t } from "i18next";

function App() {
  const jobTree = useTreeStore((state) => state.jobTree);
  const createPreloadedSkillTree = useTreeStore(
    (state) => state.createPreloadedSkillTree,
  );
  const setSkillPoints = useTreeStore((state) => state.setSkillPoints);
  const skillPoints = useTreeStore((state) => state.skillPoints);
  const resetSkillTree = useTreeStore((state) => state.resetSkillTree);

  let params = useParams() as { class: string; lang: string };
  const navigate = useNavigate();
  const skills = getJobByName(
    params.class!,
    useTreeStore.getState().jobTree,
  )?.skills;

  const [copied, setCopied] = useState(false);
  const [level, setLevel] = useState(15);

  const jobId = getJobByName(params.class!, jobTree)?.id;

  const handleLevelChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSkillPoints(jobId!, +event.target.value);
      setLevel(+event.target.value);
    },
    [],
  );

  const copyToClipboard = useCallback(async () => {
    let treeCode = `${window.location.origin}/c/${params.class}`;
    if (jobId) {
      const treeMap = encodeTree(skills!, level);
      const encondedTree = lzstring.compressToEncodedURIComponent(treeMap!);
      treeCode += `?tree=${encondedTree}`;
    }

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

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("tree") ?? "";
    if (!code) {
      setSkillPoints(jobId!, level);
      return;
    }

    const decompressedCode = lzstring.decompressFromEncodedURIComponent(code);
    if (!decompressedCode) {
      alert("Error: Invalid tree code!");
      navigate(`/c/${params.class}`);
      return;
    }
    const { untangledSkillMap, characterLevel } = decodeTree(decompressedCode);
    setLevel(+characterLevel!);

    createPreloadedSkillTree(jobId!, untangledSkillMap);

    setSkillPoints(jobId!, +characterLevel!);
  }, []);

  const { i18n } = useTranslation();

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
                    max={160}
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
                className="h-min w-full self-end rounded-md border border-red-300 bg-red-100 px-4 py-1.5 text-red-900 duration-150 hover:bg-red-200 md:w-max a11y-focus"
                onClick={() => {
                  resetSkillTree(jobId!);
                  setLevel(15);
                }}
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
            {skills
              ?.toSorted((a, b) => a.level - b.level)
              ?.map((skill) => {
                const hasMinLevelRequirements = skill.requirements.every(
                  (req: any) => req.hasMinLevel === true,
                );
                const isMaxed = skill.skillLevel === skill.levels.length;
                return (
                  <Skill
                    lang={i18n.language}
                    key={skill.id}
                    hasMinLevelRequirements={hasMinLevelRequirements}
                    isMaxed={isMaxed}
                    skill={skill}
                    skillId={skill.id}
                    jobId={jobId}
                  />
                );
              })}
          </div>
        </div>
      </Suspense>
    </>
  );
}

export default App;
