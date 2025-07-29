import { Component, inject, OnInit, signal } from '@angular/core';
import { AlmacenesService } from '../../../services/almacen-service';
import { SucursalesService } from '../../../services/sucursal-service';

@Component({
  selector: 'app-almacen-component',
  standalone: false,
  templateUrl: './almacen-component.html',
  styleUrl: './almacen-component.scss'
})
export class AlmacenComponent implements OnInit {

  almacenes = signal([])
  sucursales = signal([])
  selectedSucursal = signal(-1)
  almacenService = inject(AlmacenesService)
  sucursalService = inject(SucursalesService)

  ngOnInit(): void {
    this.funGetAlmacenes()
    this.getsucursales()
  }

  funGetAlmacenes() {
    this.almacenService.funListar(this.selectedSucursal()).subscribe(
       (res: any) => {
        this.almacenes.set(res);
      },
       (err) => {
        this.almacenes.set([]);
      }
    );
  }

  getsucursales() {
    this.sucursalService.funListar().subscribe(
      (res: any) => {
        this.sucursales.set(res);
      },
      (err) => {
        this.sucursales.set([]);
      }
    );
  }



}
