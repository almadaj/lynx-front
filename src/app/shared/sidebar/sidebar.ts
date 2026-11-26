import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { AuthService } from '../../services/api-services/auth.service';
import { NotificationService } from '../../services/api-services/notification.service';
import { Role } from '../enum/role.enum';


interface MenuItem {
  label: string
  icon?: string
  route?: string
  children?: MenuItem[],
  role?: Role[]
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterModule, MatIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  constructor(
    private router: Router,
  ) { }
  isOpen = signal<boolean>(true)
  private readonly notificationService = inject(NotificationService)
  private readonly authService = inject(AuthService)

  readonly user = this.authService.user
  readonly unreadCount = this.notificationService.unreadCount

  get initials(): string {
    const name = this.user()?.name?.trim()

    if (!name) {
      return '?'
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }

  menu = signal<MenuItem[]>([
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Acadêmico',
      route: '/academy',
      icon: 'school',
      role: [Role.STUDENT],
      children: [
        //   { label: 'Turmas', route: '/dashboard/turmas' },
        //   { label: 'Disciplinas', route: '/dashboard/disciplinas' },
        //   { label: 'Avaliações', route: '/dashboard/avaliacoes' }
        //   { label: 'Questões', route: '/question' }
      ]
    },
    {
      label: "Minha Instituição",
      route: "/my-company",
      icon: 'store',
      role: [Role.STUDENT]
    },
    {
      label: "Turmas",
      route: "/classes",
      icon: 'book',
      role: [Role.STUDENT]
    },
    {
      label: "Questões",
      route: "/question",
      icon: 'poll',
      role: [Role.TEACHER]
    },
  ]);

  hasAccess(roles?: Role[]): boolean {
    return !roles || roles.some(role => this.authService.hasPermission(role))
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
  }
}
