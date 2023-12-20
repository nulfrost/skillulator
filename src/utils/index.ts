import { State } from "../zustand/treeStore";

export function getJobById(jobId: number, jobs: State["jobTree"]) {
  return jobs.find((job) => job.id === jobId);
}

export function getSkillById(
  skillId: number,
  skills: State["jobTree"][number]["skills"]
) {
  return skills.find((skill) => skill.id === skillId);
}

export function getJobByName(jobName: string, jobs: State["jobTree"]) {
  return jobs.find(
    (job) => job.name.en.toLowerCase() === jobName.toLowerCase()
  );
}

export function encodeTree(
  skills: State["jobTree"][number]["skills"],
  characterLevel: number
) {
  return (
    skills?.map((skill) => `${skill.id}:${skill.skillLevel}`).join(",") +
    `#${characterLevel}`
  );
}

export function decodeTree(encodedSkills: string) {
  const characterLevel = encodedSkills.split("#").at(1);
  const decodedTree = encodedSkills.split("#").at(0);
  return {
    untangledSkillMap: decodedTree!
      .split(",")
      .map((skill) => skill.split(":"))
      .map((s) => ({ skill: +s[0], level: +s[1] })),
    characterLevel,
  };
}

export function getSkillPointsForLevel(characterLevel: number) {
  switch (true) {
    case characterLevel >= 15 && characterLevel <= 20:
      return characterLevel * 2;
    case characterLevel > 20 && characterLevel <= 40:
      return (characterLevel - 20) * 3 + 20 * 2;
    case characterLevel > 40 && characterLevel <= 60:
      return (characterLevel - 40) * 4 + 20 * 3 + 20 * 2;
    case characterLevel > 60 && characterLevel <= 80:
      return (characterLevel - 60) * 5 + 20 * 4 + 20 * 3 + 20 * 2;
    case characterLevel > 80 && characterLevel <= 100:
      return (characterLevel - 80) * 6 + 20 * 5 + 20 * 4 + 20 * 3 + 20 * 2;
    case characterLevel > 100 && characterLevel <= 120:
      return (
        (characterLevel - 100) * 7 + 20 * 6 + 20 * 5 + 20 * 4 + 20 * 3 + 20 * 2
      );
    case characterLevel > 120 && characterLevel <= 140:
      return (
        (characterLevel - 120) * 8 +
        20 * 7 +
        20 * 6 +
        20 * 5 +
        20 * 4 +
        20 * 3 +
        20 * 2
      );
    case characterLevel > 140 && characterLevel <= 150:
      return (
        (characterLevel - 140) * 1 +
        20 * 8 +
        20 * 7 +
        20 * 6 +
        20 * 5 +
        20 * 4 +
        20 * 3 +
        20 * 2
      );
    case characterLevel > 150 && characterLevel <= 160:
      return (
        (characterLevel - 150) * 2 +
        20 * 1 +
        20 * 8 +
        20 * 7 +
        20 * 6 +
        20 * 5 +
        20 * 4 +
        20 * 3 +
        20 * 2
      );
    default:
      return 0;
  }
}

// eh this could be named better lol
export const classSkillPoints = {
  // elementor
  9150: {
    firstJobSP: 90,
    secondJobSP: 300,
  },
  //psykeeper
  5709: {
    firstJobSP: 90,
    secondJobSP: 90,
  },
  // blade
  2246: {
    firstJobSP: 60,
    secondJobSP: 80,
  },
  // knight
  5330: {
    firstJobSP: 60,
    secondJobSP: 80,
  },
  // billposter
  7424: {
    firstJobSP: 60,
    secondJobSP: 120,
  },
  // ringmaster
  9389: {
    firstJobSP: 60,
    secondJobSP: 100,
  },
  // ranger
  9295: {
    firstJobSP: 50,
    secondJobSP: 100,
  },
  // jester
  3545: {
    firstJobSP: 50,
    secondJobSP: 100,
  },
};

export function getJobTotalSkillPoints(
  jobMap: typeof classSkillPoints,
  jobId: number,
  characterLevel: number
) {
  if (characterLevel >= 60) {
    return (
      getSkillPointsForLevel(characterLevel) +
      jobMap[jobId].firstJobSP +
      jobMap[jobId].secondJobSP
    );
  }

  return getSkillPointsForLevel(characterLevel) + jobMap[jobId].firstJobSP;
}

export const languages = [
  {
    label: "en",
    value: "en",
  },
  {
    label: "pt-BR",
    value: "br",
    locale: "pt-BR",
  },
  {
    label: "zh",
    value: "cns",
    locale: "zh-CN",
  },
  {
    label: "ja",
    value: "jp",
  },
  {
    label: "ko",
    value: "kr",
  },
  {
    label: "es",
    value: "sp",
  },
  {
    label: "ru",
    value: "ru",
  },
  {
    label: "de",
    value: "de",
  },
  {
    label: "fi",
    value: "fi",
  },
  {
    label: "id",
    value: "id",
  },
  {
    label: "it",
    value: "it",
  },
  {
    label: "nl",
    value: "nl",
  },
  {
    label: "pl",
    value: "pl",
  },
];

export function getLanguageForSkill(
  langs: typeof languages,
  appLanguage: string
) {
  return langs.find((lang) => lang.label === appLanguage)?.value;
}
