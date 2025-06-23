import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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

  constructor(
    private authService: AuthService,
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