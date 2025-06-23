import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loginError: string = '';
  registerError: string = '';
  registerSuccess: string = '';
  isLoading: boolean = false;
  activeTab: string = 'login'; // Track active tab

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Check if we should show register tab based on query param
    this.route.queryParams.subscribe(params => {
      if (params['register'] === 'true') {
        this.activeTab = 'register';
      }
    });
  }

  // Set active tab
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    // Clear error messages when switching tabs
    this.loginError = '';
    this.registerError = '';
    this.registerSuccess = '';
  }

  // Custom validator for password matching
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      // If passwords match, remove the mismatch error
      if (confirmPassword.errors) {
        delete confirmPassword.errors['mismatch'];
        if (!Object.keys(confirmPassword.errors).length) {
          confirmPassword.setErrors(null);
        }
      }
      return null;
    }
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isLoading = true;
    this.loginError = '';
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Check if there's a return URL stored in session
        const returnUrl = sessionStorage.getItem('returnUrl') || '/';
        sessionStorage.removeItem('returnUrl');
        this.router.navigateByUrl(returnUrl); // Redirect to stored URL or home
      },
      error: (error) => {
        this.isLoading = false;
        this.loginError = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isLoading = true;
    this.registerError = '';
    this.registerSuccess = '';
    
    const { name, email, password } = this.registerForm.value;
    
    this.authService.register(name, email, password).subscribe({
      next: (response) => {
        if (response.success) {
          this.registerSuccess = 'Registration successful! Logging you in...';
          
          // Auto login after successful registration
          setTimeout(() => {
            this.authService.login(email, password).subscribe({
              next: () => {
                this.isLoading = false;
                // Check if there's a return URL stored in session
                const returnUrl = sessionStorage.getItem('returnUrl') || '/';
                sessionStorage.removeItem('returnUrl');
                this.router.navigateByUrl(returnUrl); // Redirect to stored URL or home
              },
              error: (loginError) => {
                this.isLoading = false;
                this.registerError = 'Registration was successful, but there was an error logging in. Please try logging in manually.';
              }
            });
          }, 1500); // Show success message for 1.5 seconds before redirecting
        } else {
          this.isLoading = false;
          this.registerError = response.message || 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.registerError = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}