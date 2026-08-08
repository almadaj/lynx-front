import { Component, effect, OnInit, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CompanyService } from '../../services/api-services/company.service';
import { CompanyResponseDTO } from '../../models/company.model';
import { UserCompanyResponse, UserResponseDTO } from '../../models/user.model';
import { UserService } from '../../services/api-services/user.service';
import { SocialNetworkModal } from './social-network-modal/social-network-modal';
import { CnpjFormatter } from '../../shared/common-functions/shared.functions';
import { TeacherModal } from './teacher-modal/teacher-modal';
import { Role, RoleHelper } from '../../shared/enum/role.enum';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company',
  imports: [MatIcon, SocialNetworkModal, TeacherModal, MatIcon,
    SocialNetworkModal,
    TeacherModal,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,],
  templateUrl: './company.html',
  styleUrls: ['./company.scss'],
})
export class Company implements OnInit {
  protected readonly CnpjFormatter = CnpjFormatter;
  readonly modalAction = signal<'social' | 'teacher' | null>(null);
  company = signal<CompanyResponseDTO | null>(null);
  principal = signal<UserResponseDTO | null>(null);
  staff = signal<UserResponseDTO[]>([]);
  isPrincipal = signal<boolean>(false);
  loading = signal(false);
  error = signal<string | null>(null);
  isModalOpen = signal(false);
  isTeacherModalOpen = signal(false);
  userCompanies = signal<UserCompanyResponse[]>([])
  readonly selectedCompany = signal<UserCompanyResponse | null>(null);
  modalTitle = signal('Adicionar');
  modalContent = signal('');

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private router: Router,
  ) {
    effect(() => {

      const company = this.selectedCompany();

      if (!company) return;

      this.loadCompany(company);

    });
  }

  ngOnInit(): void {
    this.fetchCompanyInfo()
  }

  formatUrl(url: string): string {
    if (!url) return '';

    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  }

  getUsername(url: string): string {
    try {
      const formatted = url.startsWith('http') ? url : `https://${url}`;
      const parsed = new URL(formatted);

      const path = parsed.pathname.split('/').filter(Boolean);

      return '@' + path.pop() || '';
    } catch {
      return '';
    }
  }

  fetchCompanyInfo(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.findMyInfo().subscribe({
      next: (user) => {

        this.userCompanies.set(user.companies);

        if (user.companies.length > 0) {
          this.selectedCompany.set(user.companies[0]);
        } else {
          this.loading.set(false);
        }

      },
      error: (err) => {
        this.error.set('Erro ao buscar informações do usuário');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  fetchPrincipalUser(userId: string) {
    this.userService.findById(userId).subscribe({
      next: (data) => {
        this.principal.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private loadCompany(company: UserCompanyResponse): void {
    this.loading.set(true);
    this.isPrincipal.set(
      RoleHelper.hasPermission(company.role, Role.PRINCIPAL)
    );

    forkJoin({
      company: this.companyService.findById(company.companyId),
      teachers: this.companyService.getAllTeachersByCompany(company.companyId)
    }).subscribe({
      next: ({ company, teachers }) => {
        this.company.set(company);
        this.staff.set(teachers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar empresa');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  changeCompany(companyId: string) {
    const company = this.userCompanies()
      .find(c => c.companyId === companyId);

    if (company) {
      this.selectedCompany.set(company);
    }
  }

  openTeacherModal(): void {
    this.isTeacherModalOpen.set(true);
  }

  openSocialModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false)
    this.isTeacherModalOpen.set(false);
  }

  handleSaveSocial(): void {
    console.log("Olar")
  }

  seeAllMembers(companyId: string) {
    this.router.navigate([`company/${companyId}/member`])
  }

  onSocialConfirm() {
    this.isModalOpen.set(false);
  }
}
