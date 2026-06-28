import {
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Projects } from '../projects/projects';
import { Achievements } from '../achievements/achievements';
import { ExperienceSection } from '../experience/experience';
import { Contact } from '../contact/contact';
import { NavigationIntentService } from '../../core/services/navigation-intent.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Hero, About, Projects, Achievements, ExperienceSection, Contact],
  template: `
    <section id="home"><app-hero /></section>
    <section id="about"><app-about /></section>
    <section id="projects"><app-projects mode="featured" /></section>
    <section id="achievements"><app-achievements /></section>

    <!-- Certifications teaser -->
    <div class="home-certs-teaser">
      <span class="home-certs-teaser__text">+ 9 certifications &amp; ongoing learning</span>
      <a class="home-certs-teaser__arrow" routerLink="/certifications" data-cursor-interactive>-&gt;</a>
    </div>

    <section id="experience"><app-experience /></section>
    <section id="contact"><app-contact /></section>
  `,
  styles: [`
    .home-certs-teaser {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      padding: 1.25rem 1.5rem 2rem;
      background: var(--bg-base);
    }
    .home-certs-teaser__text {
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      color: var(--text-muted);
      letter-spacing: 0.02em;
    }
    .home-certs-teaser__arrow {
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      color: var(--accent-green);
      text-decoration: none;
      letter-spacing: 0.02em;
      transition: opacity 150ms ease-out;
    }
    .home-certs-teaser__arrow:hover {
      opacity: 0.7;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly navIntent = inject(NavigationIntentService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Shubham Kalwar | Full-Stack Developer & ML Engineer');
    this.meta.updateTag({
      name: 'description',
      content: 'Terminal-themed portfolio of Shubham Kalwar — Full-Stack Developer & ML Engineer based in Mumbai. Projects, experience, certifications, and contact.',
    });

    if (!isPlatformBrowser(this.platformId)) return;

    const target = this.navIntent.consumePendingScroll();
    if (target) {
      // Wait for sections to render, then scroll
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }
}
