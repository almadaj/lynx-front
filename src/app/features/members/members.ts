import {
    Component,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/api-services/company.service';
import { UserResponseDTO } from '../../models/user.model';
import { Role, ROLE_LABELS } from '../../shared/enum/role.enum';
import { AuthService } from '../../services/api-services/auth.service';

@Component({
    selector: 'app-members',
    standalone: true,
    imports: [
        FormsModule,
    ],
    templateUrl: './members.html',
    styleUrl: './members.scss'
})
export class Members implements OnInit {
    protected readonly authService = inject(AuthService);
    protected readonly Role = Role;
    private readonly route = inject(ActivatedRoute);
    private readonly companyService = inject(CompanyService);
    protected readonly ROLE_LABELS = ROLE_LABELS;
    readonly companyId = signal<string>('');
    readonly selectedTab = signal<'teachers' | 'students'>('teachers');
    readonly loading = signal(false);
    readonly search = signal('');
    readonly isAddModalOpen = signal(false);
    readonly teachers = signal<UserResponseDTO[]>([]);
    readonly students = signal<UserResponseDTO[]>([]);
    readonly error = signal('')

    constructor(
        private router: Router
    ) { }

    displayedMembers = computed(() =>
        this.selectedTab() === 'teachers'
            ? this.teachers()
            : this.students()
    );

    readonly filteredMembers = computed(() => {
        const search = this.search().trim().toLowerCase();

        if (!search) {
            return this.teachers();
        }

        return this.teachers().filter(teacher =>
            teacher.name.toLowerCase().includes(search) ||
            teacher.email.toLowerCase().includes(search)
        );

    });

    ngOnInit(): void {
        const companyId = this.route.snapshot.paramMap.get('companyId');

        if (companyId) {
            this.companyId.set(companyId);
            this.loadTeachers();
            this.loadStudents();
        }
    }

    loadTeachers(): void {
        this.loading.set(true);
        this.companyService.getAllTeachersByCompany(this.companyId()).subscribe({
            next: (data) => {
                this.teachers.set(data)
                this.loading.set(false)
            },
            error: (err) => {
                this.error.set('Erro ao buscar empresa');
                this.loading.set(false);
                console.error(err);
            }
        })
    }

    loadStudents(): void {
        this.loading.set(true);
        this.companyService.getAllStudentsByCompany(this.companyId()).subscribe({
            next: (data) => {
                this.students.set(data)
                this.loading.set(false)
            },
            error: (err) => {
                this.error.set('Erro ao buscar empresa');
                this.loading.set(false);
                console.error(err);
            }
        })
    }

    onSearch(value: string): void {
        this.search.set(value);
    }

    openAddMemberModal(): void {
        this.isAddModalOpen.set(true);
    }

    closeAddMemberModal(): void {
        this.isAddModalOpen.set(false);
    }

    editMember(member: UserResponseDTO): void {
        this.router.navigate(['/company', this.companyId(), 'edit-member', member.companies[0].userCompanyId]);
    }
}