import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  shipping_address: any;
  payment_method: string;
  created_at: string;
  items?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost/coffee-php';

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  // Place a new order
  placeOrder(shippingAddress: any, paymentMethod: string): Observable<any> {
    const userId = this.authService.getUserId();
    
    return this.cartService.getCart().pipe(
      tap(cartItems => {
        if (!cartItems || cartItems.length === 0) {
          throw new Error('Cannot place order with empty cart');
        }
      }),
      switchMap(cartItems => {
        // Create order object
        const orderData = {
          user_id: userId,
          items: cartItems,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          status: 'pending'
        };
        
        // Send order to server
        return this.http.post(`${this.apiUrl}/checkout.php`, orderData).pipe(
          tap(() => this.cartService.clearCart()),
          catchError(error => {
            console.error('Error placing order:', error);
            return throwError(() => new Error('Failed to place order. Please try again.'));
          })
        );
      })
    );
  }

  // Get orders for current user
  getUserOrders(): Observable<Order[]> {
    const userId = this.authService.getUserId();
    return this.http.get<Order[]>(`${this.apiUrl}/orders.php?user_id=${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(() => new Error('Failed to fetch orders. Please try again.'));
      })
    );
  }

  // Get a specific order by ID
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders.php?id=${orderId}`).pipe(
      catchError(error => {
        console.error(`Error fetching order ${orderId}:`, error);
        return throwError(() => new Error('Failed to fetch order details. Please try again.'));
      })
    );
  }

  // Get order items for a specific order
  getOrderItems(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/order_items.php?order_id=${orderId}`).pipe(
      catchError(error => {
        console.error(`Error fetching order items for order ${orderId}:`, error);
        return throwError(() => new Error('Failed to fetch order items. Please try again.'));
      })
    );
  }
}