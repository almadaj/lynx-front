import { Component, OnInit, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CompanyService } from '../../services/api-services/company.service';
import { CompanyResponseDTO } from '../../models/company.model';
import { UserResponseDTO } from '../../models/user.model';
import { UserService } from '../../services/api-services/user.service';
import { CommonModal } from '../../shared/common-modal/common-modal';

@Component({
  selector: 'app-company',
  imports: [MatIcon, CommonModal],
  templateUrl: './company.html',
  styleUrls: ['./company.scss'],
})
export class Company implements OnInit {
  readonly modalAction = signal<'social' | 'teacher' | null>(null);
  company = signal<CompanyResponseDTO | null>(null);
  principal = signal<UserResponseDTO | null>(null);
  staff = signal<UserResponseDTO[]>([]);
  isPrincipal = signal<boolean>(false);
  loading = signal(false);
  error = signal<string | null>(null);
  isModalOpen = signal(false);
  modalTitle = signal('Adicionar');
  modalContent = signal('');

  constructor(
    private companyService: CompanyService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.fetchCompanyInfo('e219b846-804f-44a3-8bbb-237b9c2c5ef0')
    this.fetchTeachStaff('e219b846-804f-44a3-8bbb-237b9c2c5ef0')
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

  fetchCompanyInfo(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.companyService.findById(id).subscribe({
      next: (data) => {
        this.company.set(data);
        this.principal.set(data.principalTeacher);
        this.fetchMyProfile(data.principalTeacher?.id);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao buscar empresa');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  fetchTeachStaff(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.companyService.getAllTeachersByCompany(id).subscribe({
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
    this.modalAction.set('teacher');
    this.modalTitle.set('Adicionar professor');
    this.modalContent.set('Em breve voce podera cadastrar um novo professor por aqui.');
    this.isModalOpen.set(true);
  }

  openSocialModal(): void {
    this.modalAction.set('social');
    this.modalTitle.set('Adicionar rede social');
    this.modalContent.set('Em breve voce podera cadastrar uma nova rede social da instituicao.');
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.modalAction.set(null);
  }

  confirmModal(): void {
    if (this.modalAction() === 'teacher') {
      console.log('Abrir fluxo de cadastro de professor');
    }

    if (this.modalAction() === 'social') {
      console.log('Abrir fluxo de cadastro de rede social');
    }

    this.closeModal();
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
}
