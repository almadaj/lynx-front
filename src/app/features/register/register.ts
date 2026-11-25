
import { Component, computed, inject, signal } from '@angular/core'
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from '@angular/forms'
import { RouterLink, Router } from '@angular/router'
import { RegisterRequestDTO } from '../../models/auth.model'
import { AuthService } from '../../services/api-services/auth.service'

type UserType = 'STUDENT' | 'TEACHER'

type RegisterStep =
    | 'profile'
    | 'name'
    | 'birth'
    | 'email'
    | 'password'
    | 'confirmPassword'
    | 'institution'
    | 'review'

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class Register {
    private router = inject(Router)
    private fb = inject(FormBuilder)
    private authService = inject(AuthService)

    currentStep = signal(0)
    selectedUserType = signal<UserType | null>(null)
    profileImage = signal<File | null>(null)
    profileImagePreview = signal<string | null>(null)
    registrationSuccess = signal(false)
    readonly maxBirthDate = new Date().toISOString().split('T')[0]

    readonly steps = computed<RegisterStep[]>(() => {
        const commonSteps: RegisterStep[] = [
            'profile',
            'name',
            'birth',
            'email',
            'password',
            'confirmPassword'
        ]

        commonSteps.push('review')

        return commonSteps
    })

    readonly currentStepName = computed(
        () => this.steps()[this.currentStep()]
    )

    readonly progress = computed(() => {
        const totalSteps = this.steps().length

        if (totalSteps <= 1) return 0

        return (this.currentStep() / (totalSteps - 1)) * 100
    })

    registerForm = this.fb.group(
        {
            fullName: ['', [
                Validators.required,
                Validators.minLength(3)
            ]],

            email: ['', [
                Validators.required,
                Validators.email
            ]],

            password: ['', [
                Validators.required,
                Validators.minLength(8),
            ]],

            confirmPassword: ['', [
                Validators.required
            ]],

            birth: ['', [
                Validators.required
            ]],
        },
        {
            validators: (control: AbstractControl): ValidationErrors | null => {
                const password = control.get('password')?.value
                const confirmation = control.get('confirmPassword')?.value

                if (!confirmation || password === confirmation) {
                    return null
                }

                return { passwordMismatch: true }
            }
        }
    )

    selectUserType(type: UserType): void {
        this.selectedUserType.set(type)
        this.currentStep.set(1)
    }

    next(): void {
        const step = this.currentStepName()

        if (!step || !this.validateCurrentStep(step)) {
            return
        }

        this.currentStep.update(current => current + 1)
    }

    previous(): void {
        if (this.currentStep() > 0) {
            this.currentStep.update(current => current - 1)
        }
    }

    changeUserType(): void {
        this.selectedUserType.set(null)
        this.currentStep.set(0)
    }

    onProfileImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement
        const file = input.files?.[0]

        if (!file) return

        if (!file.type.startsWith('image/')) return

        if (file.size > 5 * 1024 * 1024) {
            return
        }

        this.profileImage.set(file)

        const reader = new FileReader()

        reader.onload = () => {
            this.profileImagePreview.set(reader.result as string)
        }

        reader.readAsDataURL(file)
    }

    private validateCurrentStep(step: RegisterStep): boolean {
        switch (step) {
            case 'name':
                return this.validateField('fullName')

            case 'birth':
                return this.validateField('birth')

            case 'email':
                return this.validateField('email')

            case 'password':
                return this.validateField('password')

            case 'confirmPassword':
                return this.validateField('confirmPassword')
                    && !this.registerForm.hasError('passwordMismatch')

            case 'institution':
                return this.validateField('institutionName')

            default:
                return true
        }
    }

    submitRegistration(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched()
            return
        }

        const formValue = this.registerForm.getRawValue()

        const payload: RegisterRequestDTO = {
            name: formValue.fullName!,
            email: formValue.email!,
            password: formValue.password!,
            birth: formValue.birth!
        }

        this.authService.register(payload).subscribe({
            next: () => {
                this.registrationSuccess.set(true)
            },
            error: (error) => {
                console.error('Erro ao cadastrar usuário', error)
            }
        })
    }

    continueAfterProfile(): void {
        // Se for professor, depois iremos direcionar
        // para a escolha de vínculo institucional.

        if (this.selectedUserType() === 'TEACHER') {
            console.log('Direcionar para vínculo institucional')
            return
        }

        // Aluno segue para o dashboard.
        this.router.navigate(['/dashboard'])
    }

    private validateField(fieldName: string): boolean {
        const control = this.registerForm.get(fieldName)

        if (!control) return false

        control.markAsTouched()

        return control.valid
    }

    get passwordMismatch(): boolean {
        return this.registerForm.hasError('passwordMismatch')
            && this.registerForm.controls.confirmPassword.touched
    }
}
