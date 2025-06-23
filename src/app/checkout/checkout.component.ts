import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../cart.service';
import { OrderService } from '../order.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  checkoutForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  paymentMethods = ['Credit Card', 'Cash on Delivery'];
  
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      paymentMethod: ['Cash on Delivery', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Verify user is logged in
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        sessionStorage.setItem('returnUrl', '/checkout');
        this.router.navigate(['/login']);
        return;
      }
      
      // Get cart items
      this.cartService.getCart().subscribe(items => {
        this.cartItems = items;
        if (items.length === 0) {
          this.router.navigate(['/cart']);
        }
      });
      
      // Get cart total
      this.cartService.getCartTotal().subscribe(total => {
        this.cartTotal = total;
      });
      
      // Pre-fill form with user details if available
      this.authService.getUser().subscribe(user => {
        if (user) {
          this.checkoutForm.patchValue({
            fullName: user.name || '',
            email: user.email || ''
          });
        }
      });
    });
  }
  
  get f() {
    return this.checkoutForm.controls;
  }
  
  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    // Prepare shipping address object
    const shippingAddress = {
      fullName: this.f['fullName'].value,
      email: this.f['email'].value,
      phone: this.f['phone'].value,
      address: this.f['address'].value,
      city: this.f['city'].value,
      zip: this.f['zip'].value
    };
    
    // Place order
    this.orderService.placeOrder(shippingAddress, this.f['paymentMethod'].value)
      .subscribe({
        next: (response) => {
          // Order placed successfully, navigate to confirmation page
          this.router.navigate(['/order-confirmation', response.order_id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message || 'An error occurred while placing your order. Please try again.';
        }
      });
  }
  
  backToCart(): void {
    this.router.navigate(['/cart']);
  }
}