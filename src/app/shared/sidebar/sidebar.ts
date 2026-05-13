import { Component, Inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { AuthService } from '../../services/api-services/auth.service';


interface MenuItem {
  label: string
  icon?: string
  route?: string
  children?: MenuItem[]
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
    @Inject(AuthService) private authService: AuthService
  ) { }
  isOpen = signal<boolean>(true)

  menu = signal<MenuItem[]>([
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Acadêmico',
      route: '/academy',
      icon: 'school'
      // children: [
      //   { label: 'Turmas', route: '/dashboard/turmas' },
      //   { label: 'Disciplinas', route: '/dashboard/disciplinas' },
      //   { label: 'Avaliações', route: '/dashboard/avaliacoes' }
      // ]
    },
    {
      label: "Minha Instituição",
      route: "/my-company",
      icon: 'store'
    },
    {
      label: "Turmas",
      route: "/classes",
      icon: 'book'
    }
  ]);


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
