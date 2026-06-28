import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Projects } from '../projects/projects';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [RouterLink, Projects],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPageComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Projects — Shubham Kalwar');
    this.meta.updateTag({
      name: 'description',
      content: 'Full-stack and AI/ML projects by Shubham Kalwar — Angular front-ends, Spring Boot APIs, machine learning pipelines, and more.',
    });
  }
}
