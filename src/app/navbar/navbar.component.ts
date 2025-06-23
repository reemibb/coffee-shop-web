import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { FavoriteService } from '../favorite.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;
  isDropdownOpen = false;
  cartQuantity = 0;

  constructor(
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the authentication status
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });

    // Subscribe to user data
    this.authService.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.cartService.getCartQuantity().subscribe(quantity => {
    this.cartQuantity = quantity;
  });
  }

  // Method to handle user logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  toggleDropdown(): void {
  this.isDropdownOpen = !this.isDropdownOpen;
}
}