import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { FavoriteService } from '../favorite.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  quantity: number = 1;
  isFavorite: boolean = false;
  isLoading: boolean = true;
  selectedOptions: any = {};
  error: string = '';
  
  private favoriteSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.isLoading = true;
      const productId = +params['id'];
      
      this.productService.getProductById(productId).subscribe(
        product => {
          this.product = product;
          this.isLoading = false;
          
          // Check if product is favorited
          this.checkIfFavorited();
    
          // Subscribe to favorites changes
          this.favoriteSubscription = this.favoriteService.favorites.subscribe(() => {
            this.checkIfFavorited();
          });
        },
        error => {
          this.isLoading = false;
          this.error = 'Unable to load product details. Please try again later.';
          console.error('Error loading product:', error);
        }
      );
    });
  }
  
  ngOnDestroy(): void {
    if (this.favoriteSubscription) {
      this.favoriteSubscription.unsubscribe();
    }
  }

  checkIfFavorited(): void {
    if (this.product && this.product.id) {
      this.favoriteService.isFavorite(this.product.id).subscribe(isFavorited => {
        this.isFavorite = isFavorited;
      });
    }
  }

  toggleFavorite(): void {
    if (!this.product) return;
    
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.favoriteService.toggleFavorite(this.product.id).subscribe(isFavorited => {
          this.isFavorite = isFavorited;
        });
      } else {
        sessionStorage.setItem('returnUrl', this.router.url);
        this.router.navigate(['/login']);
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedOptions);
      
      // Use browser notification API if available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Added to Cart', {
          body: `${this.quantity} x ${this.product.name} added to your cart`,
          icon: this.product.imageUrl
        });
      }
      
      // Optionally navigate to cart or show a toast
      // this.router.navigate(['/cart']);
    }
  }
  
  buyNow(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedOptions);
      this.router.navigate(['/cart']);
    }
  }
  
  increaseQuantity(): void {
    this.quantity++;
  }
  
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}