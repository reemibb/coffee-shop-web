import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-testimonial-card',
  templateUrl: './testimonial-card.component.html',
  styleUrls: ['./testimonial-card.component.css'],
  standalone: false
})
export class TestimonialCardComponent {
  @Input() testimonial: any;
  
  // Method to generate star rating array
  get stars(): number[] {
    return Array(this.testimonial?.rating || 5).fill(0).map((_, i) => i + 1);
  }
}