import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/api-services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string>('')

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set("Email/senha inválidos");
      return;
    }

    const { email, password } = this.loginForm.value;

    this.isLoading.set(true);

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        sessionStorage.setItem('token', res.token);
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.errorMessage.set("Credenciais inválidas");
        console.error(err);
        this.isLoading.set(false)
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
