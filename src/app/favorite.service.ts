import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost/coffee-php';
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  public favorites = this.favoritesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load favorites when service initializes
    this.loadUserFavorites();
    
    // Update favorites when user logs in or out
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadUserFavorites();
      } else {
        this.favoritesSubject.next([]);
      }
    });
  }

  // Load user favorites from the database
  loadUserFavorites(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const userId = this.authService.getUserId();
        
        this.http.get<{product_id: number}[]>(`${this.apiUrl}/favorites.php?user_id=${userId}`)
          .pipe(
            map(favorites => favorites.map(fav => fav.product_id)),
            catchError(error => {
              console.error('Error loading favorites:', error);
              return of([]);
            })
          )
          .subscribe(productIds => {
            this.favoritesSubject.next(productIds);
          });
      }
    });
  }

  // Check if a product is favorited
  isFavorite(productId: number): Observable<boolean> {
    return this.favorites.pipe(
      map(favorites => favorites.includes(productId))
    );
  }

  // Toggle product favorite status
  toggleFavorite(productId: number): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          return false;
        }
        
        const userId = this.authService.getUserId();
        const currentFavorites = this.favoritesSubject.value;
        const isFavorited = currentFavorites.includes(productId);
        
        // Optimistic update (update UI first)
        if (isFavorited) {
          this.favoritesSubject.next(currentFavorites.filter(id => id !== productId));
        } else {
          this.favoritesSubject.next([...currentFavorites, productId]);
        }
        
        // Send update to the server
        const endpoint = isFavorited ? 'remove_favorite.php' : 'add_favorite.php';
        this.http.post(`${this.apiUrl}/${endpoint}`, { user_id: userId, product_id: productId })
          .pipe(
            catchError(error => {
              console.error('Error updating favorite status:', error);
              // Revert the optimistic update on error
              this.favoritesSubject.next(currentFavorites);
              return of(false);
            })
          )
          .subscribe();
        
        // Return the new status
        return !isFavorited;
      })
    );
  }

  // Get all favorite products
  getFavoriteProducts(): Observable<any[]> {
    return this.authService.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          return of([]);
        }
        
        const userId = this.authService.getUserId();
        return this.http.get<any[]>(`${this.apiUrl}/favorite_products.php?user_id=${userId}`)
          .pipe(
            catchError(error => {
              console.error('Error fetching favorite products:', error);
              return of([]);
            })
          );
      })
    );
  }
}