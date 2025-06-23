import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  options?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartTotalSubject = new BehaviorSubject<number>(0);
  private cartQuantitySubject = new BehaviorSubject<number>(0);
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Load cart from local storage if exists and we're in a browser environment
    if (this.isBrowser) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        this.updateCart();
      }
    }
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartTotal(): Observable<number> {
    return this.cartTotalSubject.asObservable();
  }
  
  getCartQuantity(): Observable<number> {
    return this.cartQuantitySubject.asObservable();
  }

  addToCart(product: any, quantity: number = 1, options: any = {}): void {
    // Look for an existing item with the same options
    const existingItem = this.cartItems.find(item => 
      item.id === product.id && 
      JSON.stringify(item.options || {}) === JSON.stringify(options)
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Create a normalized product object
      const normalizedProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: this.normalizeImageUrl(product),
        quantity: quantity,
        options: options
      };
      
      this.cartItems.push(normalizedProduct);
    }
    
    this.updateCart();
    // Show success message or navigate to cart
  }
  
  // Helper method to normalize image URL from different sources
  private normalizeImageUrl(product: any): string {
    if (product.imageUrl) return product.imageUrl;
    if (product.image_url) return product.image_url;
    if (product.img_url) return product.img_url;
    return 'assets/images/default-product.jpg';
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.updateCart();
  }

  updateQuantity(index: number, quantity: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems[index].quantity = quantity;
      if (this.cartItems[index].quantity <= 0) {
        this.removeFromCart(index);
      } else {
        this.updateCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }
  
  navigateToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    
    const total = this.cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const quantity = this.cartItems.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
    
    this.cartTotalSubject.next(total);
    this.cartQuantitySubject.next(quantity);
    
    // Only save to localStorage if we're in a browser environment
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }
}