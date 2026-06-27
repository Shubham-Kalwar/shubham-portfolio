import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects-page/projects-page.component').then(
        (m) => m.ProjectsPageComponent
      ),
  },
  {
    path: 'certifications',
    loadComponent: () =>
      import('./features/certifications-page/certifications-page.component').then(
        (m) => m.CertificationsPageComponent
      ),
  },
  // Wildcard → home
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
