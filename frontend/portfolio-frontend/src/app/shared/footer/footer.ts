import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly GITHUB_URL = 'https://github.com/Shubham-Kalwar';
  readonly LINKEDIN_URL = 'https://linkedin.com/in/shubham-kalwar';
  readonly YEAR = new Date().getFullYear();
}
