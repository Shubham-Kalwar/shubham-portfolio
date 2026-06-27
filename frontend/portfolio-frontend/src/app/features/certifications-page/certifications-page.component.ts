import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Certifications } from '../certifications/certifications';

@Component({
  selector: 'app-certifications-page',
  standalone: true,
  imports: [RouterLink, Certifications],
  templateUrl: './certifications-page.component.html',
  styleUrl: './certifications-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificationsPageComponent {}
