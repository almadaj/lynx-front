import {
    Component,
    inject,
    input,
    Input,
    OnInit,
    output,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModal } from '../../shared/common-modal/common-modal';
import { Role, RoleHelper } from '../../shared/enum/role.enum';
import { ToastService } from '../../shared/toaster/toast.service';
import { CompanyService } from '../../services/api-services/company.service';
import { AuthService } from '../../services/api-services/auth.service';
import { UserResponseDTO } from '../../models/user.model';


@Component({
    selector: 'app-edit-role-modal',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatMenuModule,
        CommonModal
    ],
    templateUrl: './edit-role-modal.html',
    styleUrls: ['./edit-role-modal.scss']
})
export class EditMemberModal implements OnInit {
    protected readonly authService = inject(AuthService);
    protected readonly Role = Role;
    protected readonly RoleHelper = RoleHelper;
    private readonly companyService = inject(CompanyService);
    userCompanyId: string | null = null;
    companyId: string | null = null;
    isModalOpen = signal<boolean>(false)
    readonly loading = signal<boolean>(false);
    readonly user = signal<UserResponseDTO | null>(null);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toast: ToastService
    ) { }

    ngOnInit(): void {
    }

    isOpen = input(false);

    close = output<void>();
    confirm = output<Role>();

    readonly availableRoles = [
        Role.STUDENT,
        Role.TEACHER,
        Role.HEADTEACHER,
        Role.PRINCIPAL
    ];

    socialNetwork = '';
    socialUrl = '';
    selectedRole: Role = Role.STUDENT;

    confirmModal(): void {
        console.log({
            socialNetwork: this.socialNetwork,
            socialUrl: this.socialUrl,
            role: this.selectedRole
        });
    }

    closeModal(): void {
        this.close.emit();
    }
}
