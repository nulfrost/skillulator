import treeJson from "./data/tree.json";
import { create } from "zustand";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import { Fragment, useCallback, useState } from "react";
import lzstring from "lz-string";

interface TreeState {
  tree: typeof treeJson;
  increaseSkillPoint: (jobId: number, skillId: number) => void;
  decreaseSkillPoint: (jobId: number, skillId: number) => void;
}

function getJobById(jobId: number, jobs: typeof treeJson) {
  return jobs.find((job) => job.id === jobId);
}

function getSkillById(
  skillId: number,
  skills: (typeof treeJson)[number]["skills"]
) {
  return skills.find((skill) => skill.id === skillId);
}

const useTreeStore = create<TreeState>()((set) => ({
  tree: treeJson,
  increaseSkillPoint: (jobId: number, skillId: number) =>
    set((state) => {
      // find the job
      const job = getJobById(jobId, state.tree);
      // find skill
      const skill = getSkillById(skillId, job?.skills!);
      if (skill!.skillLevel === skill!.levels.length) return state;
      skill!.skillLevel += 1;
      // find all required skills
      // if it's the min level, switch hasMinLevel to true
      job?.skills.forEach((s) => {
        const foundSkill = s.requirements.find((sz) => sz.skill === skillId);
        const skillIndex = s.requirements.findIndex(
          (sx) => sx.skill === skillId
        );
        if (
          typeof foundSkill !== "undefined" &&
          foundSkill.level === skill!.skillLevel
        ) {
          s.requirements[skillIndex].hasMinLevel = true;
        }
      });

      return {
        ...state,
        tree: [...state.tree],
      };
    }),
  decreaseSkillPoint: (jobId: number, skillId: number) =>
    set((state) => {
      // find the job
      const job = getJobById(jobId, state.tree);
      // find skill
      const skill = getSkillById(skillId, job?.skills!);
      if (skill?.skillLevel === 0) return state;
      skill!.skillLevel -= 1;
      // find all required skills
      // if the skillLevel is less than the required skills required level switch to false
      job?.skills.forEach((s) => {
        const foundSkill = s.requirements.find((sz) => sz.skill === skillId);
        const skillIndex = s.requirements.findIndex(
          (sx) => sx.skill === skillId
        );
        if (
          typeof foundSkill !== "undefined" &&
          skill!.skillLevel < foundSkill.level
        ) {
          s.requirements[skillIndex].hasMinLevel = false;
        }
      });

      return {
        ...state,
        tree: [...state.tree],
      };
    }),
}));

function getJobByName(jobName: string, jobs: any) {
  return jobs.find(
    (job: any) => job.name.en.toLowerCase() === jobName.toLowerCase()
  );
}

function App() {
  const increaseSkillPoint = useTreeStore((state) => state.increaseSkillPoint);
  const decreaseSkillPoint = useTreeStore((state) => state.decreaseSkillPoint);
  const tree = useTreeStore((state) => state.tree);
  let params = useParams<{ class: string }>();
  const skills = getJobByName(params.class!, tree).skills;
  const [copied, setCopied] = useState(false);
  const [skillTree, setSkillTree] = useState(skills);

  const jobId = getJobByName(params.class!, tree).id;

  const copyToClipboard = useCallback(async () => {
    let treeCode = "";
    if (jobId) {
      const compressedCode = lzstring.compressToBase64(JSON.stringify(skills));
      treeCode += `${compressedCode}`;
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
          onClick={copyToClipboard}
          className="bg-indigo-500 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-indigo-600 duration-150"
        >
          Copy skill tree
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
          className="border border-gray-300 rounded-md w-full px-2 py-3"
          rows={5}
        />
      </div>
      <div className={clsx("gap-1 grid grid-cols-5 w-full", params.class)}>
        {skillTree.map((skill: any) => {
          const hasMinLevelRequirements = skill.requirements.every(
            (req: any) => req.hasMinLevel === true
          );
          const isMaxed = skill.skillLevel === skill.levels.length;
          return (
            <Fragment key={skill.id}>
              <div
                data-skill={skill.name.en.replaceAll(" ", "")}
                className="flex border border-gray-300 rounded-md flex-col items-center py-2 bg-white"
              >
                <button
                  onKeyDown={(event) => {
                    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
                      event.preventDefault();
                      if (event.key === "ArrowDown") {
                        decreaseSkillPoint(jobId, skill.id);
                      } else if (event.key === "ArrowUp") {
                        increaseSkillPoint(jobId, skill.id);
                      }
                    }
                  }}
                  onClick={(event) => {
                    if (event.type === "click") {
                      increaseSkillPoint(jobId, skill.id);
                    } else if (event.type === "contextmenu") {
                      decreaseSkillPoint(jobId, skill.id);
                    }
                  }}
                  disabled={!hasMinLevelRequirements}
                  className="w-full flex flex-col items-center"
                >
                  <span
                    className={clsx(
                      "font-bold block",
                      hasMinLevelRequirements
                        ? "text-gray-900"
                        : "text-gray-300"
                    )}
                  >
                    {isMaxed ? "MAX" : `${skill.skillLevel}`}
                  </span>
                  <img
                    className={clsx(
                      "h-12 w-12",
                      hasMinLevelRequirements ? "grayscale-0" : "grayscale"
                    )}
                    src={`https://api.flyff.com/image/skill/colored/${skill.icon}`}
                  />
                  <span
                    className={clsx(
                      "inline-block font-bold",
                      hasMinLevelRequirements
                        ? "text-blue-500"
                        : "text-gray-300"
                    )}
                  >
                    {skill.name.en}
                  </span>
                </button>
                <div>
                  {skill.requirements.map((skill: any, index: number) => (
                    <span
                      key={JSON.stringify({ skill, index })}
                      className={clsx(
                        "block text-sm text-center",
                        hasMinLevelRequirements
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {skill.name} level {skill.level} is required
                    </span>
                  ))}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default App;
