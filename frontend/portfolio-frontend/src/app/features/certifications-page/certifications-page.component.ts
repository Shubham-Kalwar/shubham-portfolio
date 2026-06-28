import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
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
export class CertificationsPageComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Certifications — Shubham Kalwar');
    this.meta.updateTag({
      name: 'description',
      content: 'Certifications earned by Shubham Kalwar in cloud computing, backend development, and machine learning — demonstrating expertise and continuous learning.',
    });
  }
}
