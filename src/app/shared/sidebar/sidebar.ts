import { Component, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { sign } from 'node:crypto';


interface MenuItem {
  label: string
  icon?: string
  route?: string
  children?: MenuItem[]
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  isOpen = signal<boolean>(true)
  menu = signal<MenuItem[]>([
    {
      label: 'Dashboard',
      route: '/dashboard'
    },
    {
      label: 'Acadêmico',
      // children: [
      //   { label: 'Turmas', route: '/dashboard/turmas' },
      //   { label: 'Disciplinas', route: '/dashboard/disciplinas' },
      //   { label: 'Avaliações', route: '/dashboard/avaliacoes' }
      // ]
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
}
