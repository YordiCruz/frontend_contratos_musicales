import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private backendUrl = `${environment.url_production}/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    const body = { message };
    // Si necesitas headers como API KEY o JSON content-type, agregalos aquí
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<{ response: string }>(this.backendUrl, body, { headers });
  }
}
