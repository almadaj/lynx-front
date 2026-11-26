import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/api-services/auth.service';
import { Role } from '../../../shared/enum/role.enum';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

type OnboardingAction = 'join' | 'create' | null

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule,
    MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})

export class Dashboard {
  readonly Role = Role
  protected authService = inject(AuthService)

  readonly hasCompanies = computed(
    () => this.authService.companies().length > 0
  )

  activeAction = signal<OnboardingAction>(null)

  institutionCode = signal('')
  errorMessage = signal<string | null>(null)

  toggleAction(action: Exclude<OnboardingAction, null>): void {
    this.activeAction.update(current =>
      current === action ? null : action
    )

    this.errorMessage.set(null)
  }

  onInstitutionCodeChange(value: string): void {
    this.institutionCode.set(value.toUpperCase().trim())
    this.errorMessage.set(null)
  }

  linkInstitution(): void {
    if (!this.institutionCode().trim()) {
      this.errorMessage.set('Informe o código da instituição.')
      return
    }

    console.log('Código informado:', this.institutionCode())
  }

  createInstitution(): void {
    console.log('Iniciar criação de instituição')
  }
}
