import clsx from "clsx";
import lzstring from "lz-string";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTreeStore } from "./zustand/treeStore";
import { getJobByName, encodeTree, decodeTree } from "./utils/index";
import Skill from "./components/Skill";

function App() {
  const jobTree = useTreeStore((state) => state.jobTree);
  const createPreloadedSkillTree = useTreeStore(
    (state) => state.createPreloadedSkillTree
  );
  const setSkillPoints = useTreeStore((state) => state.setSkillPoints);
  const skillPoints = useTreeStore((state) => state.skillPoints);
  const resetSkillTree = useTreeStore((state) => state.resetSkillTree);

  let params = useParams<{ class: string }>();
  const navigate = useNavigate();
  const skills = getJobByName(
    params.class!,
    useTreeStore.getState().jobTree
  )?.skills;

  const [copied, setCopied] = useState(false);
  const [level, setLevel] = useState(15);

  const jobId = getJobByName(params.class!, jobTree)?.id;

  const handleLevelChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSkillPoints(jobId!, +event.target.value);
      setLevel(+event.target.value);
    },
    []
  );

  const copyToClipboard = useCallback(async () => {
    let treeCode = `${window.location.origin}/c/${params.class}`;
    if (jobId) {
      console.log(skills);
      const treeMap = encodeTree(skills!, level);
      console.log(treeMap, skills);
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
    document.title = `Skillulator | ${params.class} skill tree`;
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

  console.log(skills);

  return (
    <div className="p-2 mx-auto lg:p-5 2xl:max-w-[1920px]">
      <div className="flex flex-col justify-between mb-2 md:flex-row">
        <div className="flex flex-col-reverse">
          <h1 className="text-2xl font-bold capitalize">{params.class}</h1>
          <Link to="/" className="mb-2 text-indigo-600 md:mb-4 hover:underline">
            {" "}
            &larr; Back to class selection
          </Link>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex justify-between gap-2">
            <div className="self-end h-min">
              <p>Available skill points</p>
              <span className="font-bold">{skillPoints}</span>
            </div>
            <div className="flex flex-col self-end h-min">
              <label htmlFor="characterLevel" className="text-sm">
                Character Level
              </label>
              <input
                type="number"
                className="px-4 py-1.5 border border-gray-300 rounded-md"
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
              "bg-indigo-500 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-indigo-600 duration-150 h-min self-end w-full md:w-max",
              copied ? "disabled:bg-green-500" : undefined
            )}
          >
            {copied ? "Copied code to clipboard!" : "Copy skill tree"}
          </button>
          <button
            className="px-4 py-1.5 bg-red-100 text-red-900 rounded-md border border-red-300 hover:bg-red-200 duration-150 h-min self-end w-full md:w-max"
            onClick={() => {
              resetSkillTree(jobId!);
              setLevel(15);
            }}
          >
            Reset skill tree
          </button>
        </div>
      </div>
      <div
        className={clsx(
          "md:gap-1 md:grid md:grid-cols-5 w-full space-y-1 md:space-y-0",
          params.class
        )}
      >
        {skills
          ?.toSorted((a, b) => a.level - b.level)
          ?.map((skill) => {
            const hasMinLevelRequirements = skill.requirements.every(
              (req: any) => req.hasMinLevel === true
            );
            const isMaxed = skill.skillLevel === skill.levels.length;
            return (
              <Skill
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
  );
}

export default App;
