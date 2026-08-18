import {
    Component,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../services/api-services/company.service';
import { UserResponseDTO } from '../../../models/user.model';
import { ToastService } from '../../../shared/toaster/toast.service';
import { AuthService } from '../../../services/api-services/auth.service';
import { Role, RoleHelper } from '../../../shared/enum/role.enum';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DateFormatter } from '../../../shared/common-functions/shared.functions';
import { CommonModal } from '../../../shared/common-modal/common-modal';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';


@Component({
    selector: 'app-edit-member',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatMenuModule,
        CommonModal,
    ],
    templateUrl: './edit-member.html',
    styleUrls: ['./edit-member.scss']
})
export class EditMember implements OnInit {
    protected readonly authService = inject(AuthService);
    protected readonly Role = Role;
    protected readonly RoleHelper = RoleHelper;
    private readonly companyService = inject(CompanyService);
    userCompanyId: string | null = null;
    companyId: string | null = null;
    isModalOpen = signal<boolean>(false)
    isRoleModalOpen = signal<boolean>(false);
    readonly loading = signal<boolean>(false);
    readonly user = signal<UserResponseDTO | null>(null);
    readonly DateFormatter = DateFormatter;
    selectedRole: Role = Role.TEACHER; //TODO: retornar a role correta do usuário

    readonly availableRoles = [
        Role.TEACHER,
        Role.HEADTEACHER,
        Role.PRINCIPAL
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toast: ToastService
    ) { }

    ngOnInit(): void {
        this.userCompanyId = this.route.snapshot.paramMap.get('userCompanyId');
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        if (this.companyId && this.userCompanyId) {
            this.loadMemberInfo()
        }
    }

    loadMemberInfo(): void {
        this.loading.set(true);
        this.companyService.getMemberById(this.companyId!, this.userCompanyId!).subscribe({
            next: (data) => {
                this.user.set(data)
                this.loading.set(false)
            },
            error: (err) => {
                this.toast.error('Erro ao buscar membro')
                this.loading.set(false);
                this.handleBackButton()
            }
        })
    }

    toggleModalStatus(): void { this.isModalOpen.set(!this.isModalOpen()) }

    changeUserStatus(userStatus: boolean): void {
        if (this.companyId && this.userCompanyId) {
            this.companyService.changeStatus(this.companyId, {
                userCompanyId: this.userCompanyId.toString(),
                status: !userStatus,
            }).pipe(finalize(() => this.isModalOpen.set(false)))
                .subscribe({
                    next: () => {
                        this.toast.success("Status de usuário alterado")
                    },
                    error: (err: HttpErrorResponse) => {
                        console.log(err)
                        this.toast.error(err.error.error)
                    }
                })
        }
    }

    changeRole(role: Role): void {
        console.log('Nova role:', role);

        this.isRoleModalOpen.set(false);
    }

    handleBackButton(): void {
        this.router.navigate([`/company/${this.companyId}/member`]);
    }

    toggleRoleModal(): void {
        this.isRoleModalOpen.set(!this.isRoleModalOpen());
    }

    closeRoleModal(): void {
        this.isRoleModalOpen.set(false);
    }

    confirmRoleModal(): void {
        const dto = ({
            userId: this.user()?.id!,
            role: this.selectedRole!
        })
        this.companyService.promoteUser(this.companyId!, dto)
            .pipe(finalize(() => this.toggleRoleModal()))
            .subscribe({
                next: () => {
                    this.toast.success("Alterado com sucesso")
                    this.toggleRoleModal()
                    this.loadMemberInfo()
                },

                error: (err: HttpErrorResponse) => {
                    console.log(err)
                    this.toast.error(err.error.error)
                }
            })
    }
}
