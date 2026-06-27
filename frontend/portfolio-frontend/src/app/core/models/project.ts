export interface Project {
  id?: number;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  techStackList: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlightBadge?: string;
  displayOrder: number;
  featured: boolean;
}
