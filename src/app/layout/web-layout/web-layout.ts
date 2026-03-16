import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdminRoutingModule } from "../../admin/admin-routing-module";
import { CommonModule } from '@angular/common';
import { ClientAuthService } from '../../core/services/client-auth';

@Component({
  selector: 'app-web-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './web-layout.html',
  styleUrl: './web-layout.scss'
})
export class WebLayout {

  authService = inject(ClientAuthService);

}
