export interface Skill {
  id?: number;
  name: string;
  category: string;
  displayOrder: number;
}

export interface SkillsGrouped {
  LANGUAGE?: Skill[];
  FRONTEND?: Skill[];
  BACKEND?: Skill[];
  DATABASE?: Skill[];
  DEVOPS?: Skill[];
  TOOLS?: Skill[];
  [category: string]: Skill[] | undefined;
}
