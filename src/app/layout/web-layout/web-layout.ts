import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdminRoutingModule } from "../../admin/admin-routing-module";

@Component({
  selector: 'app-web-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './web-layout.html',
  styleUrl: './web-layout.scss'
})
export class WebLayout {

}
