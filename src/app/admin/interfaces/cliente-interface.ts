import { PersonaInterface } from "./persona-interface";
import { UserInterface } from "./user-interface";

export interface ClientInterface {
  id: string;
  persona: PersonaInterface;

  tipo_cliente: string;           // individual | empresa
  origen_registro: string;        // web | admin | bot
  categoria: string;              // normal | vip | frecuente

  preferencia_contacto?: string | null; // whatsapp | email | telefono

  registrado_por?: UserInterface | null;

  estado: 'activo' | 'inactivo';
  creado_en: string;
  actualizado_en: string;
}