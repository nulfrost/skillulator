import clsx from "clsx";
import lzstring from "lz-string";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useTreeStore } from "./stores/treeStore";
import { getJobByName } from "./utils/index";
import Skill from "./components/Skill";

function App() {
  const tree = useTreeStore((state) => state.tree);
  let params = useParams<{ class: string }>();
  const skills = getJobByName(params.class!, tree)?.skills;
  const [copied, setCopied] = useState(false);
  const [skillTree, setSkillTree] = useState(skills);

  const jobId = getJobByName(params.class!, tree)?.id;

  const copyToClipboard = useCallback(async () => {
    let treeCode = "";
    if (jobId) {
      const compressedCode = lzstring.compressToBase64(JSON.stringify(skills));
      treeCode += `${compressedCode.trim()}`;
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
      <div>
        <textarea
          onBlur={(event) => {
            const code = event.target.value;
            if (!code) return;
            const decompressedCode = lzstring.decompressFromBase64(code);
            const decompressedSkillTree = JSON.parse(decompressedCode);
            setSkillTree(decompressedSkillTree);
          }}
          placeholder="Input tree code"
          className="border border-gray-300 rounded-md w-full px-2 py-3 resize-none"
          rows={5}
        />
      </div>
      <div className={clsx("gap-1 grid grid-cols-5 w-full", params.class)}>
        {skillTree?.map((skill) => {
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
