import { Component, OnInit, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CompanyService } from '../../services/api-services/company.service';
import { CompanyResponseDTO } from '../../models/company.model';
import { UserResponseDTO } from '../../models/user.model';
import { UserService } from '../../services/api-services/user.service';
import { SocialNetworkModal } from './social-network-modal/social-network-modal';
import { CnpjFormatter } from '../../shared/common-functions/shared.functions';
import { TeacherModal } from './teacher-modal/teacher-modal';

@Component({
  selector: 'app-company',
  imports: [MatIcon, SocialNetworkModal, TeacherModal],
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
  modalTitle = signal('Adicionar');
  modalContent = signal('');

  constructor(
    private companyService: CompanyService,
    private userService: UserService
  ) { }

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

  fetchCompanyInfo() {
    this.loading.set(true);
    this.error.set(null);

    this.userService.findMyInfo().subscribe({
      next: (data) => {
        this.companyService.findById(data.companies[0].companyId).subscribe({
          next: (fetchedCompany) => {
            this.company.set(fetchedCompany);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set('Erro ao buscar empresa');
            this.loading.set(false);
            console.error(err);
          }
        });
        this.companyService.getAllTeachersByCompany(data.companies[0].companyId).subscribe({
          next: (data) => {
            this.staff.set(data)
            this.loading.set(false)
          },
          error: (err) => {
            this.error.set('Erro ao buscar empresa');
            this.loading.set(false);
            console.error(err);
          }
        })
      },
      error: (err) => {
        this.error.set('Erro ao buscar empresa');
        this.loading.set(false);
        console.error(err);
      },
    })

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

  //TODO: transformar em global
  fetchMyProfile(principalTeacherId?: string) {
    const companyPrincipalId = principalTeacherId ?? this.company()?.principalTeacher?.id;

    if (!companyPrincipalId) {
      this.isPrincipal.set(false);
      return;
    }

    this.userService.findMyInfo().subscribe({
      next: (data) => {
        this.isPrincipal.set(data.id === companyPrincipalId);
      },
      error: (err) => {
        this.isPrincipal.set(false);
        console.error(err);
      }
    });
  }

  onSocialConfirm() {
    this.isModalOpen.set(false);
  }
}
