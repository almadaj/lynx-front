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
import { ToastComponent } from '../../../shared/toaster/toast';
import { ToastService } from '../../../shared/toaster/toast.service';


@Component({
    selector: 'app-edit-member',
    standalone: true,
    imports: [
        FormsModule,
    ],
    templateUrl: './edit-member.html',
    styleUrls: ['./edit-member.scss']
})
export class EditMember implements OnInit {
    private readonly companyService = inject(CompanyService);
    userCompanyId: string | null = null;
    companyId: string | null = null;
    readonly loading = signal<boolean>(false);
    readonly user = signal<UserResponseDTO | null>(null);


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toast: ToastService
    ) { }

    // TODO: atenção aqui, acredito q o ideal seja renderizar userCompanyId,
    // já q role não está no usuário,
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

    handleBackButton(): void {
        this.router.navigate([`/company/${this.companyId}/member`]);
    }
}
