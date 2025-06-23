import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/coffee-php';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Check if user is already logged in - only in browser environment
    if (this.isBrowser) {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (user && token) {
        this.isLoggedInSubject.next(true);
        this.userSubject.next(JSON.parse(user));
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth.php`, { email, password, action: 'login' })
      .pipe(
        tap(response => {
          if (response.success && this.isBrowser) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.isLoggedInSubject.next(true);
            this.userSubject.next(response.user);
          }
        })
      );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth.php`, { name, email, password, action: 'register' });
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.isLoggedInSubject.next(false);
    this.userSubject.next(null);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }
  getUserId(): number | null {
  if (this.isBrowser) {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
  }
  return null;
}
}