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
      data-skill={props.skill.name.en.replaceAll(" ", "")}
      className="flex border border-gray-300 rounded-md flex-col items-center py-2 bg-white"
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
          } else if (event.type === "contextmenu") {
            decreaseSkillPoint(props.jobId!, props.skill.id);
          }
        }}
        disabled={!props.hasMinLevelRequirements}
        className="w-full flex flex-col items-center"
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
