import { Component, inject, OnInit, signal } from '@angular/core';
import { SucursalesService } from '../../../services/sucursal-service';

@Component({
  selector: 'app-sucursal-component',
  standalone: false,
  templateUrl: './sucursal-component.html',
  styleUrl: './sucursal-component.scss'
})
export class SucursalComponent implements OnInit {
  sucursalService = inject(SucursalesService)
  sucursales = signal([]);
  ngOnInit(): void {
    this.getsucursales()
  }

  getsucursales(){
    this.sucursalService.funListar().subscribe(
      (res: any) => {
        this.sucursales.set(res);
      }
    )
  }

}
