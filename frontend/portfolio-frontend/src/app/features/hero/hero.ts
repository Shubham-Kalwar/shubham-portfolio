import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  private static readonly ROLES = [
    'Full-Stack Developer',
    'ML Engineer',
    'Java Backend Developer',
    'Angular Specialist',
  ];

  /** The currently displayed typewriter text */
  readonly typewriterText = signal('');

  /** Whether the blinking cursor should show */
  readonly showCursor = signal(true);

  /** Whether the hero content has been revealed (after boot) */
  readonly revealed = signal(false);

  private roleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Reveal hero after boot sequence completes (~2.2s)
    setTimeout(() => {
      this.revealed.set(true);
    }, 2200);

    // Start typewriter after reveal
    setTimeout(() => {
      this.typeLoop();
    }, 2600);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  scrollToProjects(): void {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  downloadResume(): void {
    const a = document.createElement('a');
    a.href = '/assets/resume.pdf';
    a.download = 'Shubham_Kalwar_Resume.pdf';
    a.click();
  }

  private typeLoop(): void {
    const currentRole = Hero.ROLES[this.roleIndex];

    if (!this.isDeleting) {
      // Typing forward
      this.charIndex++;
      this.typewriterText.set(currentRole.substring(0, this.charIndex));

      if (this.charIndex === currentRole.length) {
        // Finished typing — pause then delete
        this.isDeleting = true;
        this.timeoutId = setTimeout(() => this.typeLoop(), 1200);
        return;
      }

      this.timeoutId = setTimeout(() => this.typeLoop(), 70);
    } else {
      // Deleting
      this.charIndex--;
      this.typewriterText.set(currentRole.substring(0, this.charIndex));

      if (this.charIndex === 0) {
        // Finished deleting — move to next role
        this.isDeleting = false;
        this.roleIndex = (this.roleIndex + 1) % Hero.ROLES.length;
        this.timeoutId = setTimeout(() => this.typeLoop(), 300);
        return;
      }

      this.timeoutId = setTimeout(() => this.typeLoop(), 40);
    }
  }
}
