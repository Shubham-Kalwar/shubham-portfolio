export interface Experience {
  id?: number;
  title: string;
  company: string;
  period: string;
  type: 'INTERNSHIP' | 'ACHIEVEMENT';
  bulletList: string[];
  highlight: boolean;
  displayOrder: number;
}
