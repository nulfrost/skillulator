import { useTreeStore, TreeState } from "../stores/treeStore";
import clsx from "clsx";

interface SkillProps {
  skill: TreeState["tree"][0]["skills"][0];
  jobId: number | undefined;
  skillId: number;
  hasMinLevelRequirements: boolean;
  isMaxed: boolean;
}

export default function Skill(props: SkillProps) {
  const increaseSkillPoint = useTreeStore((state) => state.increaseSkillPoint);
  const decreaseSkillPoint = useTreeStore((state) => state.decreaseSkillPoint);
  return (
    <div
      data-skill={props.skill.name.en.replaceAll(" ", "").replace(/'/, "")}
      className="flex flex-col items-center flex-auto py-2 bg-white border border-gray-300 rounded-md"
    >
      <button
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp"].includes(event.key)) {
            event.preventDefault();
            if (event.key === "ArrowDown") {
              decreaseSkillPoint(props.jobId!, props.skill.id);
            } else if (event.key === "ArrowUp") {
              increaseSkillPoint(props.jobId!, props.skill.id);
            }
          }
        }}
        onClick={(event) => {
          event.preventDefault();
          if (event.type === "click") {
            increaseSkillPoint(props.jobId!, props.skill.id);
          }
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          decreaseSkillPoint(props.jobId!, props.skill.id);
        }}
        disabled={!props.hasMinLevelRequirements}
        className="flex flex-col items-center w-full"
      >
        <span
          className={clsx(
            "font-bold block",
            props.hasMinLevelRequirements ? "text-gray-900" : "text-gray-300"
          )}
        >
          {props.isMaxed ? "MAX" : `${props.skill.skillLevel}`}
        </span>
        <img
          className={clsx(
            "h-12 w-12",
            props.hasMinLevelRequirements ? "grayscale-0" : "grayscale"
          )}
          src={`https://api.flyff.com/image/skill/colored/${props.skill.icon}`}
        />
        <span
          className={clsx(
            "inline-block font-bold",
            props.hasMinLevelRequirements ? "text-blue-500" : "text-gray-300"
          )}
        >
          {props.skill.name.en}
        </span>
      </button>
      <div>
        {props.skill.requirements.map((skill, index: number) => (
          <Requirements
            key={JSON.stringify({ skill, index })}
            hasMinLevelRequirements={skill.hasMinLevel}
            skill={{ level: skill.level, name: skill.name }}
          />
        ))}
      </div>
    </div>
  );
}

interface RequirementsProps {
  skill: {
    name: string;
    level: number;
  };
  hasMinLevelRequirements: boolean;
}

function Requirements(props: RequirementsProps) {
  return (
    <span
      className={clsx(
        "block text-sm text-center",
        props.hasMinLevelRequirements ? "text-green-500" : "text-red-500"
      )}
    >
      {props.skill.name} level {props.skill.level} is required
    </span>
  );
}
