import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, SkillsGrouped, Experience, ContactRequest, ContactResponse, Certificate } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects`);
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects/featured`);
  }

  getSkills(): Observable<SkillsGrouped> {
    return this.http.get<SkillsGrouped>(`${this.apiUrl}/api/skills`);
  }

  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.apiUrl}/api/experience`);
  }

  getCertificatesByCategory(category: string): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/api/certificates/${category}`);
  }

  sendContact(data: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiUrl}/api/contact`, data);
  }
}
