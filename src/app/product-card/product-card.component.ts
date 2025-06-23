import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: false
})
export class ProductCardComponent {
  @Input() product: any;
  isFavorite = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
  
  // Method to handle the Order Now button click
onOrderNowClick(): void {
  // Check if user is logged in
  this.authService.isLoggedIn().subscribe(isLoggedIn => {
    if (isLoggedIn) {
      // User is logged in, navigate to the product detail or order page
      this.router.navigate(['/product', this.product.id]);
    } else {
      // Store the current URL to redirect back after login
      sessionStorage.setItem('returnUrl', `/product/${this.product.id}`);
      // User is not logged in, redirect to login page
      this.router.navigate(['/login']);
    }
  });
}
}