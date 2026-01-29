import { Component } from '@angular/core';
import { Sidebar } from './sidebar';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Sidebar],
  template: `
    <div class="layout">
      <app-sidebar />
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './sidebar.scss',
})
export class DashboardLayout {

}
