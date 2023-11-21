import "./App.css";
import treeJson from "./data/tree.json";
import { create } from "zustand";

interface TreeState {
  tree: typeof treeJson;
  increaseSkillPoint: (jobId: number, skillId: number) => void;
}

const useTreeStore = create<TreeState>()((set) => ({
  tree: treeJson,
  increaseSkillPoint: (jobId: number, skillId: number) =>
    set((state) => {
      // find the job
      const job = state.tree.find((j) => j.id === jobId);
      // find skill
      const skill = job?.skills.find((s) => s.id === skillId);
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
}));

function App() {
  // every time we level up a skill
  // we need to check if it meets the min level for the
  // skills it it needed for
  const increaseSkillPoint = useTreeStore((state) => state.increaseSkillPoint);
  const tree = useTreeStore((state) => state.tree);

  function logRequirements(skillId: number, skills: any[]) {
    // on the current skill, look through the current tree skills
    // find where the skill is a requirement and log the skill name that is dependant
    console.log(skills);
    const reqSkills = skills.filter((skill) =>
      skill.requirements.find((s: any) => s.skill === skillId)
    );

    return reqSkills;
  }

  return (
    <div className="eleGrid gap-1 p-10">
      {tree[5].skills
        // .sort((a, b) => a.level - b.level)
        .map((skill) => {
          const hasMinLevelRequirements = skill.requirements.every(
            (req) => req.hasMinLevel === true
          );
          const isMaxed = skill.skillLevel === skill.levels.length;
          return (
            <div
              key={skill.id}
              data-skill={skill.name.en.replaceAll(" ", "")}
              className="flex border border-gray-300 rounded-md"
            >
              <button
                onClick={() => increaseSkillPoint(9150, skill.id)}
                disabled={!hasMinLevelRequirements || isMaxed}
                className="w-full flex flex-col items-center py-2"
              >
                <span
                  className={`font-bold block ${
                    hasMinLevelRequirements ? "text-gray-900" : "text-gray-300"
                  }`}
                >
                  {isMaxed ? "MAX" : `${skill.skillLevel}`}
                </span>
                <img
                  style={{
                    height: "48px",
                    width: "48px",
                    filter: `grayscale(${hasMinLevelRequirements ? "0" : "1"})`,
                  }}
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
                {logRequirements(skill.id, tree[5].skills).map((req) => (
                  <span>{req.name.en}</span>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default App;
