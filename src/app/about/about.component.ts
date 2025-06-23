import { Component, OnInit } from '@angular/core';
import { AboutService, AboutContent } from '../about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: false
})
export class AboutComponent implements OnInit {
  aboutContent: AboutContent = {
    title: 'Loading...',
    paragraphs: []
  };
  loading = true;
  error = false;

  constructor(private aboutService: AboutService) { }

  ngOnInit(): void {
    this.loadAboutContent();
  }

  loadAboutContent(): void {
    this.aboutService.getAboutContent()
      .subscribe({
        next: (data) => {
          this.aboutContent = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading about page content:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }
}