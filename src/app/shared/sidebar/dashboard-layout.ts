import { Component } from '@angular/core';
import { Sidebar } from './sidebar';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Sidebar, MatIconModule],
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
