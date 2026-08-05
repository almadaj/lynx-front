import { Component, effect, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CourseClassResponseDTO } from '../../models/courseClass.model';
import { CourseClassService } from '../../services/api-services/courseClass.service';
import { UserCompanyResponse } from '../../models/user.model';
import { StudentModal } from './student-modal/student-modal';
import { UserService } from '../../services/api-services/user.service';
import { Role, RoleHelper } from '../../shared/enum/role.enum';

@Component({
  selector: 'app-my-classes',
  imports: [MatIcon, StudentModal],
  templateUrl: './my-classes.html',
  styleUrl: './my-classes.scss',
})
export class MyClasses implements OnInit {
  isModalNovaTurmaOpen = signal(false)
  isModalNovoAlunoOpen = signal(false)
  isPrincipal = signal<boolean>(false)
  userCompanies = signal<UserCompanyResponse[]>([])
  readonly modalAction = signal<'student' | 'class' | null>(null);
  readonly selectedCompany = signal<UserCompanyResponse | null>(null);
  isLoading = signal(false)
  currentDate = signal<number>(0)
  courses = signal<CourseClassResponseDTO[]>([])
  error = signal<string | null>(null)

  constructor(
    private courseService: CourseClassService,
    private userService: UserService,
  ) {
    effect(() => {
      const company = this.selectedCompany();
      if (!company) return;

      this.isPrincipal.set(
        RoleHelper.hasPermission(company.role, Role.PRINCIPAL)
      );
      console.log(this.isPrincipal())
    });
  }

  ngOnInit(): void {
    this.fetchMyCourses();
    this.fetchCompanyInfo()
  }

  isCourseActive(endDate?: string | Date): boolean {
    if (!endDate) return true;

    const today = new Date();
    const courseEndDate = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    courseEndDate.setHours(0, 0, 0, 0);

    return courseEndDate > today;
  }

  handleModalNovaTurma(): void {
    this.modalAction.set('class');
  }

  handleModalNovoAluno(): void {
    this.modalAction.set('student');
  }

  openStudentModal(): void {
    this.isModalNovoAlunoOpen.set(true);
  }

  closeModal(): void {
    this.isModalNovaTurmaOpen.set(false)
    this.isModalNovoAlunoOpen.set(false);
  }

  fetchCompanyInfo(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.findMyInfo().subscribe({
      next: (user) => {
        this.userCompanies.set(user.companies);

        if (user.companies.length > 0) {
          this.selectedCompany.set(user.companies[0]);
        } else {
          this.isLoading.set(false);
        }

      },
      error: (err) => {
        this.error.set('Erro ao buscar informações do usuário');
        this.isLoading.set(false);
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

  fetchMyCourses(): void {
    this.isLoading.set(true);

    this.courseService.getMyCourseClasses().subscribe({
      next: (data) => {
        this.courses.set(data);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
