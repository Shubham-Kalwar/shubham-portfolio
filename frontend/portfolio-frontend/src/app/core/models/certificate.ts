export interface Certificate {
  id?: number;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string | null;
  credentialUrl?: string | null;
  category: 'CERTIFICATION' | 'ACHIEVEMENT';
  displayOrder: number;
}
