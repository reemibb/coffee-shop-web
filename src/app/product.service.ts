import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

// Define interfaces for your data types
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
}

interface Testimonial {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost/coffee-php';

  constructor(private http: HttpClient) { }

  // Methods to get data from API with error handling
  getSpecialCoffees(): Observable<Product[]> {
    console.log('Calling API:', `${this.apiUrl}/products-coffee.php`);
    return this.http.get<Product[]>(`${this.apiUrl}/products-coffee.php`).pipe(
      tap(data => console.log('Special coffees data received:', data)),
      catchError(error => {
        console.error('Error fetching special coffees:', error);
        return of([]);
      })
    );
  }

  getSpecialDesserts(): Observable<Product[]> {
    console.log('Calling API:', `${this.apiUrl}/products-desserts.php`);
    return this.http.get<Product[]>(`${this.apiUrl}/products-desserts.php`).pipe(
      tap(data => console.log('Special desserts data received:', data)),
      catchError(error => {
        console.error('Error fetching special desserts:', error);
        return of([]);
      })
    );
  }

  getCoffeeProducts(): Observable<Product[]> {
    console.log('Calling API:', `${this.apiUrl}/products.php?category=coffee`);
    return this.http.get<Product[]>(`${this.apiUrl}/products.php?category=coffee`).pipe(
      tap(data => console.log('Coffee products data received:', data)),
      catchError(error => {
        console.error('Error fetching coffee products:', error);
        return of([]);
      })
    );
  }

  getDessertProducts(): Observable<Product[]> {
    console.log('Calling API:', `${this.apiUrl}/products.php?category=dessert`);
    return this.http.get<Product[]>(`${this.apiUrl}/products.php?category=dessert`).pipe(
      tap(data => console.log('Dessert products data received:', data)),
      catchError(error => {
        console.error('Error fetching dessert products:', error);
        return of([]);
      })
    );
  }

  getTestimonials(): Observable<Testimonial[]> {
    console.log('Calling API:', `${this.apiUrl}/testimonials.php`);
    return this.http.get<Testimonial[]>(`${this.apiUrl}/testimonials.php`).pipe(
      tap(data => console.log('Testimonials data received:', data)),
      catchError(error => {
        console.error('Error fetching testimonials:', error);
        return of([]);
      })
    );
  }

  // Additional methods to interact with the backend
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product.php?id=${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching product ${id}:`, error);
        return of({} as Product); // Cast the empty object to Product
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    console.log('Searching products with query:', query);
    return this.http.get<Product[]>(`${this.apiUrl}/search.php?q=${encodeURIComponent(query)}`).pipe(
      tap(data => console.log('Search results:', data)),
      catchError(error => {
        console.error('Error searching products:', error);
        return of([]);
      })
    );
  }
}