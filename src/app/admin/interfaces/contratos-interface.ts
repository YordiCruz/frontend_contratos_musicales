import { ClientInterface } from "./cliente-interface";
import { ContratoEspecialidad } from "./contratos-especialidades-interface";
import { ContratosIntegrante } from "./contratos-integrantes-interface";
import { ContratoReemplazo } from "./contratos-reemplazos-interface";
import { EventosInterface } from "./eventos-interface";
import { PagosInterface } from "./pagos-interface";
import { UbicacionInterface } from "./ubicacion-interface";

export interface ContratosInterface {
  id_contrato: string;
  cliente: ClientInterface;
  evento: EventosInterface;
  ubicacion: UbicacionInterface;
  fecha_evento: string;
  bloque: 'mañana' | 'noche';
  hora_inicio?: string | null;
  hora_fin?: string | null;
  tipo_servicio: string;
  horas_contratadas: number;
  admin_aprobacion: boolean;
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'inactivo';
  motivo_cancelacion?: string | null;
  creado_en: string;
  integrantes?: ContratosIntegrante[];
  reemplazos?: ContratoReemplazo[];
  especialidades?: ContratoEspecialidad[];
  pagos?: PagosInterface[];
}

export interface ContratoConCalculos extends ContratosInterface {
  monto_total?: number;
  descuento?: number;
  precio_base?: number;
  recargo?: number;
}
