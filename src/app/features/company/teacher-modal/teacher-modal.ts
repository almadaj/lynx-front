import { Component, effect, EventEmitter, input, Input, Output, signal, SimpleChanges } from "@angular/core";
import { CommonModal } from "../../../shared/common-modal/common-modal";
import { UserCompanyResponse } from "../../../models/user.model";

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

    name = signal('');
    email = signal('');
    company = signal<UserCompanyResponse | null>(null);
    role = signal('');

    autorizedCompanies = input<UserCompanyResponse[]>([]);

    constructor() {
        effect(() => {
            const companies = this.autorizedCompanies();

            if (companies.length > 0) {
                this.company.set(companies[0]);
            }
        });
    }

    closeModal(): void {
        this.close.emit();
    }

    confirmModal(): void {
        const request = {
            email: this.email(),
            company: this.company(),
            role: this.role()
        };
        console.log(request)
        this.close.emit();
    }
}