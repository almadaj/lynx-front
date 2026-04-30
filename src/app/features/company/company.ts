import { Component, OnInit, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CompanyService } from '../../services/api-services/company.service';
import { CompanyResponseDTO } from '../../models/company.model';
import { UserResponseDTO } from '../../models/user.model';
import { UserService } from '../../services/api-services/user.service';

@Component({
  selector: 'app-company',
  imports: [MatIcon],
  templateUrl: './company.html',
  styleUrls: ['./company.scss'],
})
export class Company implements OnInit {
  company = signal<CompanyResponseDTO | null>(null);
  principal = signal<UserResponseDTO | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private companyService: CompanyService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.fetchCompanyInfo('e219b846-804f-44a3-8bbb-237b9c2c5ef0')
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
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao buscar empresa');
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
}
