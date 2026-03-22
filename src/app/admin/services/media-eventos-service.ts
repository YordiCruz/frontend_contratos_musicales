import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { MediaEventosInterface } from "../interfaces/media-eventos-interface";

@Injectable({ providedIn: 'root' })
export class MediaEventosService {

  private baseUrl = environment.url_production;

  constructor(private http: HttpClient) {}

  listar(id_evento: string) {
    return this.http.get<MediaEventosInterface[]>(
      `${this.baseUrl}/media/evento/${id_evento}`
    );
  }

  subirGaleria(id_evento: string, files: File[]) {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file);
    });

    return this.http.post(
      `${this.baseUrl}/media/${id_evento}`,
      formData
    );
  }

  cambiarVisibilidad(id_media: string, visible: boolean) {
    return this.http.patch(
      `${this.baseUrl}/media/visibilidad/${id_media}`,
      { visible }
    );
  }

  eliminar(id_media: string) {
    return this.http.delete(
      `${this.baseUrl}/media/${id_media}`
    );
  }
}