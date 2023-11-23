import { TreeState } from "../stores/treeStore";

export function getJobById(jobId: number, jobs: TreeState["tree"]) {
  return jobs.find((job) => job.id === jobId);
}

export function getSkillById(
  skillId: number,
  skills: TreeState["tree"][number]["skills"]
) {
  return skills.find((skill) => skill.id === skillId);
}

export function getJobByName(jobName: string, jobs: TreeState["tree"]) {
  // @ts-ignore
  return jobs.find(
    (job) => job.name.en.toLowerCase() === jobName.toLowerCase()
  );
}

export function encodeSkills(skills: TreeState["tree"][number]["skills"]) {
  return skills?.map((skill) => `${skill.id}:${skill.skillLevel}`).join(",");
}

export function decodeSkills(encodedSkills: string) {
  return encodedSkills
    .split(",")
    .map((skill) => skill.split(":"))
    .map((s) => ({ skill: +s[0], level: +s[1] }));
}
