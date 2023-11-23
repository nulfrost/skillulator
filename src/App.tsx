import clsx from "clsx";
import lzstring from "lz-string";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTreeStore } from "./stores/treeStore";
import { getJobByName, encodeSkills, decodeSkills } from "./utils/index";
import Skill from "./components/Skill";

function App() {
  const { tree, createPreloadedSkillTree } = useTreeStore();
  let params = useParams<{ class: string }>();
  const navigate = useNavigate();
  const skills = getJobByName(params.class!, tree)?.skills;
  const [copied, setCopied] = useState(false);

  const jobId = getJobByName(params.class!, tree)?.id;

  const copyToClipboard = useCallback(async () => {
    let treeCode = `${window.location.origin}/c/${params.class}`;
    if (jobId) {
      const skillMap = encodeSkills(skills!);
      const encondedTree = lzstring.compressToEncodedURIComponent(skillMap!);
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
  }, [params.class, copied, jobId]);

  useEffect(() => {
    document.title = `Skillulator | ${params.class} skill tree`;
    const code = new URLSearchParams(window.location.search).get("tree") ?? "";
    if (!code) return;
    const decompressedCode = lzstring.decompressFromEncodedURIComponent(code);
    if (!decompressedCode) {
      alert("Error: Invalid tree code!");
      navigate(`/c/${params.class}`);
      return;
    }
    const untangledSkillMap = decodeSkills(decompressedCode);

    createPreloadedSkillTree(jobId!, untangledSkillMap);
  }, []);

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
          {/* <button
            className="px-4 py-1.5 bg-red-100 text-red-900 rounded-md border border-red-300 hover:bg-red-200 duration-150"
            onClick={resetSkillTree}
          >
            Reset skill tree
          </button> */}
        </div>
      </div>
      <div
        className={clsx(
          "md:gap-1 md:grid md:grid-cols-5 w-full space-y-1 md:space-y-0",
          params.class
        )}
      >
        {skills
          ?.sort((a, b) => a.level - b.level)
          .map((skill) => {
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
