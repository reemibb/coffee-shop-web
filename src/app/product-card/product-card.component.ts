import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FavoriteService } from '../favorite.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: false
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  isFavorite = false;
  private favoriteSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if product is favorited when component initializes
    this.checkIfFavorited();
    
    // Re-check favorite status when favorites list changes
    this.favoriteSubscription = this.favoriteService.favorites.subscribe(() => {
      this.checkIfFavorited();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.favoriteSubscription) {
      this.favoriteSubscription.unsubscribe();
    }
  }

  checkIfFavorited(): void {
    this.favoriteService.isFavorite(this.product.id).subscribe(isFavorited => {
      this.isFavorite = isFavorited;
    });
  }

  toggleFavorite(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        // User is logged in, toggle favorite status
        this.favoriteService.toggleFavorite(this.product.id).subscribe(isFavorited => {
          this.isFavorite = isFavorited;
        });
      } else {
        // User is not logged in, redirect to login page
        sessionStorage.setItem('returnUrl', this.router.url);
        this.router.navigate(['/login']);
      }
    });
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