import { Component } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css'],
  standalone: false
})
export class NewsletterComponent {
  email: string = '';
  
  subscribe() {
    // In a real application, you would call a service to handle the subscription
    if (this.email && this.validateEmail(this.email)) {
      console.log('Subscribing with email:', this.email);
      alert('Thank you for subscribing!');
      this.email = '';
    } else {
      alert('Please enter a valid email address');
    }
  }
  
  private validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.toLowerCase());
  }
}