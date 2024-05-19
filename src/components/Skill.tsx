import { getLanguageForSkill } from "../utils";
import { useTreeStore, State } from "../zustand/treeStore";
import clsx from "clsx";
import { languages } from "../utils/index";

interface SkillProps {
  skill: State["jobTree"][0]["skills"][0];
  jobId: number | undefined;
  skillId: number;
  hasMinLevelRequirements: boolean;
  isMaxed: boolean;
  lang: string
}

export default function Skill(props: SkillProps) {
  const { decreaseSkillPoint, increaseSkillToMax, increaseSkillPoint } =
    useTreeStore();

  // this is so bad
  const translatedSkillLocale = getLanguageForSkill(languages, props.lang);

  return (
    <div
      data-skill={props.skill.name.en.replaceAll(" ", "").replace(/'/, "")}
      className="relative flex flex-col items-center flex-1 py-2 bg-white border border-gray-300 rounded-md basis-1/2"
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
        className="flex flex-col items-center disabled:cursor-not-allowed"
      >
        <span
          className={clsx(
            "font-bold block uppercase",
            props.hasMinLevelRequirements ? "text-gray-900" : "text-gray-300"
          )}
        >
          {props.isMaxed ? "max" : `${props.skill.skillLevel}`}
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
          {props.skill.name[translatedSkillLocale!]}
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
      <div>
        <button
          className={clsx(
            "absolute px-4 py-1 text-xs font-bold text-indigo-900 uppercase bg-indigo-100 border border-indigo-200 rounded-sm top-2 left-2 disabled:cursor-not-allowed md:hidden",
            props.skill.skillLevel === 0 ? "grayscale" : "grayscale-0"
          )}
          disabled={props.skill.skillLevel === 0}
          onClick={(event) => {
            event.preventDefault();
            if (event.type === "click") {
              decreaseSkillPoint(props.jobId!, props.skill.id);
            }
          }}
        >
          lvl down
        </button>
        <button
          disabled={!props.hasMinLevelRequirements || props.isMaxed}
          className={clsx(
            "absolute px-4 py-1 text-xs font-bold text-indigo-900 uppercase bg-indigo-100 border border-indigo-200 rounded-sm right-2 top-2 disabled:cursor-not-allowed",
            props.hasMinLevelRequirements && !props.isMaxed
              ? "grayscale-0"
              : "grayscale"
          )}
          onClick={() => increaseSkillToMax(props.skillId, props.jobId!)}
        >
          max
        </button>
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
