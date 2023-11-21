import treeJson from "./data/tree.json";
import { create } from "zustand";
import { useParams } from "react-router-dom";

interface TreeState {
  tree: typeof treeJson;
  increaseSkillPoint: (jobId: number, skillId: number) => void;
  decreaseSkillPoint: (jobId: number, skillId: number) => void;
}

const useTreeStore = create<TreeState>()((set) => ({
  tree: treeJson,
  increaseSkillPoint: (jobId: number, skillId: number) =>
    set((state) => {
      // find the job
      const job = state.tree.find((j) => j.id === jobId);
      // find skill
      const skill = job?.skills.find((s) => s.id === skillId);
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
      const job = state.tree.find((j) => j.id === jobId);
      // find skill
      const skill = job?.skills.find((s) => s.id === skillId);
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

function getJob(jobName: string, jobs: any) {
  return jobs.find(
    (job: any) => job.name.en.toLowerCase() === jobName.toLowerCase()
  );
}

function App() {
  const increaseSkillPoint = useTreeStore((state) => state.increaseSkillPoint);
  const decreaseSkillPoint = useTreeStore((state) => state.decreaseSkillPoint);
  const tree = useTreeStore((state) => state.tree);
  let params = useParams<{ class: string }>();

  const jobId = getJob(params.class!, tree).id;

  return (
    <div className="eleGrid gap-1 p-10">
      {getJob(params.class!, tree).skills.map((skill: any) => {
        const hasMinLevelRequirements = skill.requirements.every(
          (req: any) => req.hasMinLevel === true
        );
        const isMaxed = skill.skillLevel === skill.levels.length;
        return (
          <>
            <div
              key={skill.id}
              data-skill={skill.name.en.replaceAll(" ", "")}
              className="flex border border-gray-300 rounded-md flex-col items-center py-2"
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
                  className={`font-bold block ${
                    hasMinLevelRequirements ? "text-gray-900" : "text-gray-300"
                  }`}
                >
                  {isMaxed ? "MAX" : `${skill.skillLevel}`}
                </span>
                <img
                  className={`h-12 w-12 ${
                    hasMinLevelRequirements ? "grayscale-0" : "grayscale"
                  }`}
                  src={`https://api.flyff.com/image/skill/colored/${skill.icon}`}
                />
                <span
                  className={`inline-block font-bold ${
                    hasMinLevelRequirements ? "text-blue-500" : "text-gray-300"
                  }`}
                >
                  {skill.name.en}
                </span>
              </button>
              <div>
                {skill.requirements.map((skill: any) => (
                  <span
                    className={`block text-sm text-center ${
                      hasMinLevelRequirements
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {skill.name} level {skill.level} is required
                  </span>
                ))}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}

export default App;
