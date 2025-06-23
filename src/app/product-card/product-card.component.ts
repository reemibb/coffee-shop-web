import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FavoriteService } from '../favorite.service';
import { CartService } from '../cart.service';
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
    private cartService: CartService,
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
    // Simply add to cart with default options
    this.cartService.addToCart(this.product, 1);
    
    // Show a quick notification using alert (you might want to replace with a toast)
    alert(`${this.product.name} added to cart!`);
    
    // Alternatively, navigate to the product detail page
    // this.router.navigate(['/product', this.product.id]);
    
    // Or navigate directly to cart
    // this.cartService.navigateToCheckout();
  }
  
  viewProductDetails(): void {
    this.router.navigate(['/product', this.product.id]);
  }
}