import { Component, effect, EventEmitter, input, Input, Output, signal, SimpleChanges } from "@angular/core";
import { CommonModal } from "../../../shared/common-modal/common-modal";
import { UserCompanyResponse, UserResponseDTO } from "../../../models/user.model";
import { UserService } from "../../../services/api-services/user.service";
import { inject } from '@angular/core';

@Component({
    selector: 'app-teacher-modal',
    imports: [CommonModal],
    templateUrl: './teacher-modal.html',
    styleUrls: ['./teacher-modal.scss'],
})
export class TeacherModal {
    isOpenSignal = signal<boolean>(false)
    @Input() isOpen = false;
    roleList = signal([
        { value: 'TEACHER', label: 'Professor' },
        { value: 'HEADTEACHER', label: 'Coordenador' }
    ]);
    @Output() close = new EventEmitter<void>();
    email = signal('');
    company = signal<UserCompanyResponse | null>(null);
    role = signal('');
    isConfirm = signal<boolean>(false)
    errorMessage = signal('');
    autorizedCompanies = input<UserCompanyResponse[]>([]);

    foundUser = signal<UserResponseDTO | null>(null);
    step = signal<'form' | 'confirm'>('form');

    private readonly userService = inject(UserService);

    constructor() {
        effect(() => {
            const companies = this.autorizedCompanies();

            if (companies.length > 0) {
                this.company.set(companies[0]);
            }
        });
    }

    closeModal(): void {
        this.email.set("")
        this.role.set("")
        this.errorMessage.set("");
        this.step.set('form')
        this.close.emit();
    }

    confirmModal(): void {
        this.userService.findByEmail(this.email()).subscribe({
            next: (data) => {
                this.foundUser.set(data)
                this.step.set('confirm')
                this.isConfirm.set(true)
            },
            error: (err) => {
                console.error(err);
                this.errorMessage.set("Usuário inválido");
            }
        });
    }

    confirmAssociation(): void {

    }
}