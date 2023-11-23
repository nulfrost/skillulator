import clsx from "clsx";
import lzstring from "lz-string";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTreeStore } from "./stores/treeStore";
import { getJobByName } from "./utils/index";
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
      const skillMap = skills
        ?.map((skill) => `${skill.id}:${skill.skillLevel}`)
        .join(",");
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
    const untangledSkillMap = decompressedCode
      .split(",")
      .map((skill) => skill.split(":"))
      .map((s) => ({ skill: +s[0], level: +s[1] }));

    createPreloadedSkillTree(jobId!, untangledSkillMap);
  }, []);

  return (
    <div className="p-10">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold capitalize">{params.class}</h1>
        <button
          type="button"
          disabled={copied}
          onClick={copyToClipboard}
          className={clsx(
            "bg-indigo-500 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-indigo-600 duration-150",
            copied ? "disabled:bg-green-500" : undefined
          )}
        >
          {copied ? "Copied code to clipboard!" : "Copy skill tree"}
        </button>
      </div>
      <div className={clsx("gap-1 grid grid-cols-5 w-full", params.class)}>
        {skills?.map((skill) => {
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
