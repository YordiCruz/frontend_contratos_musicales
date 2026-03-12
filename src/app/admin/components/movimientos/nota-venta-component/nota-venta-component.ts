import { Component, inject, signal, Signal } from '@angular/core';
import { ProductoService } from '../../../services/producto-service';
import { AlmacenesService } from '../../../services/almacen-service';
 
   interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
  }
@Component({
  selector: 'app-nota-venta-component',
  standalone: false,
  templateUrl: './nota-venta-component.html',
  styleUrl: './nota-venta-component.scss'
})
export class NotaVentaComponent {

sucursales = signal([])
almacenes = signal([])
selectedSucursal = signal(-1)
selectedAlmacen = signal(-1)
buscar = signal("")
  products = signal([])
  total = signal([])
  totalRecords = signal(0)
  loading = signal(false)
   cols!: Column[]

  carrito = signal([{
    nombre: "teclado",
    precio: 30,
    cantidad: 1
  },
  {
    nombre: "mouse",
    precio: 20,
    cantidad: 1
  }
  ]);

  visible = signal(false)

  productoService = inject(ProductoService)
  almacenService = inject(AlmacenesService)

  showDialogCliente(){
      this.visible.set(true)
  }

   cargarDatos(event: any){
    let page = event.first / event.rows + 1;

    this.funGetProductos(page, event.rows);
  }

    funGetProductos(page: number = 1, limit: number = 5){ 
    this.loading.set(true);

    this.productoService.funListar("1", page, limit, this.buscar()).subscribe(
      (res: any) => {
        console.log(res.data);
        this.products.set(res.data);
        
        this.totalRecords.set(res.total);
        this.loading.set(false);
      },
      (err) => {
      console.error('Error al cargar productos:', err);
      this.products.set([]);
      this.totalRecords.set(0);
      this.loading.set(false);
      // Opcional: mostrar mensaje de error al usuario
    }
    )
   
  
}


addCarrito(prod : any){
  this.carrito().push({nombre: prod.nombre, precio: prod.precio_venta_actual, cantidad: 1})
}

   funGetAlmacenes() {
   
  }



}
