import {
    Component,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/api-services/company.service';
import { UserResponseDTO } from '../../models/user.model';

@Component({
    selector: 'app-members',
    standalone: true,
    imports: [
        FormsModule
    ],
    templateUrl: './members.html',
    styleUrl: './members.scss'
})
export class Members implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly companyService = inject(CompanyService);
    readonly companyId = signal<string>('');
    readonly loading = signal(false);
    readonly search = signal('');
    readonly isAddModalOpen = signal(false);
    readonly members = signal<UserResponseDTO[]>([]);
    readonly error = signal('')

    readonly filteredMembers = computed(() => {
        const search = this.search().trim().toLowerCase();

        if (!search) {
            return this.members();
        }

        return this.members().filter(member =>
            member.name.toLowerCase().includes(search) ||
            member.email.toLowerCase().includes(search)
        );

    });

    ngOnInit(): void {
        const companyId = this.route.snapshot.paramMap.get('companyId');

        if (companyId) {
            this.companyId.set(companyId);
            this.loadMembers();
        }

    }

    loadMembers(): void {
        this.loading.set(true);
        this.companyService.getAllTeachersByCompany(this.companyId()).subscribe({
            next: (data) => {
                this.members.set(data)
                console.log(data)
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

    editMember(member: Member): void {
        console.log(member);
    }

    removeMember(member: Member): void {
        console.log(member);
    }

}

interface Member {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'PRINCIPAL' | 'HEADTEACHER' | 'TEACHER' | 'STUDENT';
}