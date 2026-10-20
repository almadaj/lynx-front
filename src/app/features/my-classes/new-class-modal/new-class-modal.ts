import { Component, computed, DestroyRef, effect, EventEmitter, input, Input, Output, signal, untracked } from "@angular/core";
import { CommonModal } from "../../../shared/common-modal/common-modal";
import { UserCompanyResponse, UserResponseDTO } from "../../../models/user.model";
import { inject } from '@angular/core';
import { BidiModule } from "@angular/cdk/bidi";
import { CompanyService } from "../../../services/api-services/company.service";
import { Role } from "../../../shared/enum/role.enum";
import { NewCourseClassDTO } from "../../../models/courseClass.model";
import { catchError, EMPTY } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Language, LanguageLevel } from "../../../models/language.model";
import { CourseClassService } from "../../../services/api-services/courseClass.service";
import { ToastService } from "../../../shared/toaster/toast.service";

@Component({
    selector: 'app-new-class-modal',
    imports: [CommonModal, BidiModule],
    templateUrl: './new-class-modal.html',
    styleUrls: ['./new-class-modal.scss'],
})
export class NewClassModal {
    private readonly destroyRef = inject(DestroyRef);
    isOpenSignal = signal<boolean>(false)
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    newClass = signal<NewCourseClassDTO | null>(null);
    company = signal<UserCompanyResponse | null>(null);
    teacher = signal<UserResponseDTO[]>([]);
    selectedTeacher = signal<UserResponseDTO | null>(null);
    language = Object.values(Language)
    level = Object.values(LanguageLevel)
    isConfirm = signal<boolean>(false)
    errorMessage = signal('');
    autorizedCompanies = input<UserCompanyResponse[]>([]);

    foundUser = signal<UserResponseDTO | null>(null);
    step = signal<'form-one' | 'form-two' | 'confirm'>('form-one');

    private readonly companyService = inject(CompanyService);
    private readonly courseClassService = inject(CourseClassService);
    private readonly toast = inject(ToastService)

    readonly principalCompanies = computed(() =>
        this.autorizedCompanies().filter(
            company => company.role === Role.PRINCIPAL || Role.ADMIN
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

        effect(() => {
            const companies = this.principalCompanies();
            const selectedCompany = companies[0] ?? null;

            untracked(() => {
                this.company.set(selectedCompany);
                if (selectedCompany) {
                    this.loadTeachers(selectedCompany.companyId);
                } else {
                    this.teacher.set([]);
                }
            });
        });
    }

    private loadTeachers(companyId: string): void {
        this.teacher.set([]);
        this.errorMessage.set('');

        this.companyService.getAllTeachersByCompany(companyId)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError(() => {
                    this.errorMessage.set(
                        'Não foi possível buscar os professores da instituição.'
                    );
                    return EMPTY
                })
            )
            .subscribe(teachers => {
                return this.teacher.set(teachers);
            });
    }

    closeModal(): void {
        this.newClass.set(null);
        this.errorMessage.set("");
        this.step.set('form-one')
        this.close.emit();
    }

    backStep(): void {
        switch (this.step()) {
            case 'form-one':
                this.closeModal()
                break

            case 'form-two':
                this.step.set('form-one')
                break

            case 'confirm':
                this.step.set('form-two')
                break
        }
    }

    nextStep(): void {
        switch (this.step()) {
            case 'form-one':
                this.step.set('form-two')
                break

            case 'form-two':
                this.step.set('confirm')
                break

            case 'confirm':
                this.confirmAssociation()
        }
    }

    confirmAssociation(): void {
        const newClass = this.newClass()
        if (
            !newClass ||
            !newClass.name?.trim() ||
            !newClass.teacherId ||
            !newClass.companyId ||
            !newClass.startDate ||
            newClass.maxStudents < 1
        ) {
            this.toast.error('Preencha o restante do formulário.')
            return
        }

        const payload = {
            ...newClass,
            maxStudents: newClass.maxStudents ?? 1,
            startDate: `${newClass.startDate}T00:00:00`,
            endDate: `${newClass.endDate}T00:00:00`
        }

        this.courseClassService.create(payload).subscribe({
            next: () => {
                this.toast.success('Turma criada com sucesso.')
                this.closeModal()
            },
            error: (err) => {
                console.error(err)
                this.toast.error('Não foi possível criar nova turma.')
                this.closeModal()
            },
        })
    }
    onMaxStudentsChange(event: Event): void {
        const input = event.target as HTMLInputElement
        const maxStudents = Number(input.value)

        this.newClass.update(current =>
            current
                ? { ...current, maxStudents }
                : current
        )
    }
}
