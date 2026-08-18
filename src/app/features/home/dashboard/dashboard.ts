import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/api-services/auth.service';
import { Role } from '../../../shared/enum/role.enum';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly authService = inject(AuthService);
  protected readonly Role = Role;

}
