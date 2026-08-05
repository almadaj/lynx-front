import { Component, computed, effect, EventEmitter, input, Input, Output, signal, SimpleChanges } from "@angular/core";
import { CommonModal } from "../../../shared/common-modal/common-modal";
import { UserCompanyResponse, UserResponseDTO } from "../../../models/user.model";
import { UserService } from "../../../services/api-services/user.service";
import { inject } from '@angular/core';
import { BidiModule } from "@angular/cdk/bidi";
import { CompanyService } from "../../../services/api-services/company.service";
import { Role } from "../../../shared/enum/role.enum";

@Component({
    selector: 'app-student-modal',
    imports: [CommonModal, BidiModule],
    templateUrl: './student-modal.html',
    styleUrls: ['./student-modal.scss'],
})
export class StudentModal {
    isOpenSignal = signal<boolean>(false)
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    email = signal('');
    company = signal<UserCompanyResponse | null>(null);
    isConfirm = signal<boolean>(false)
    errorMessage = signal('');
    autorizedCompanies = input<UserCompanyResponse[]>([]);

    foundUser = signal<UserResponseDTO | null>(null);
    step = signal<'form' | 'confirm'>('form');

    private readonly userService = inject(UserService);
    private readonly companyService = inject(CompanyService);

    readonly principalCompanies = computed(() =>
        this.autorizedCompanies().filter(
            company => company.role === Role.PRINCIPAL
        )
    );

    selectedCompany = computed(() =>
        this.autorizedCompanies().find(
            c => c.companyId === this.company()!.toString()
        )
    );

    constructor() {
        effect(() => {
            const companies = this.principalCompanies();

            if (companies.length > 0) {
                this.company.set(companies[0]);
            } else {
                this.company.set(null);
            }
        });
    }

    closeModal(): void {
        this.email.set("")
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
        this.companyService
            .addNewStudentToCompany(this.selectedCompany()!.companyId, this.foundUser()!.email)
            .subscribe({
                next: (response) => {
                    this.close.emit();
                },
                error: (err) => {
                    console.error(err);
                    if (err.status === 409) { this.errorMessage.set("Usuário já pertence a essa instituição"); }
                    else { this.errorMessage.set("Erro ao vincular estudante"); }

                }
            });
    }
}