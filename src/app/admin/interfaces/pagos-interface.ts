import { UserInterface } from './user-interface';

export interface PagosInterface {
  id_pago: string;
  contrato: string;              // id del contrato
  monto: number;
  metodo: string;                // efectivo, qr, transferencia, online
  tipo: string;                  // adelanto, saldo, extra
  referencia?: string | null;
  fecha_pago: string;            // timestamp
  registrado_por: UserInterface;
}