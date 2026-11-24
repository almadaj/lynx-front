
import { Component, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { finalize, takeUntil } from 'rxjs'
import { Subject } from 'rxjs'
import { AuthService } from '../../../services/api-services/auth.service'
import { MatIcon } from '@angular/material/icon'

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatIcon, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  loginForm
  isLoading = signal(false)
  errorMessage = signal('')
  showPassword = signal<boolean>(false)

  private destroy$ = new Subject<void>()

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.errorMessage.set(''))
  }

  changePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword())
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    const { email, password } = this.loginForm.getRawValue()

    if (!email || !password) return

    this.isLoading.set(true)

    this.authService.login({ email, password })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          this.errorMessage.set('E-mail ou senha incorretos.')
          console.error('Erro ao realizar login:', err)
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
