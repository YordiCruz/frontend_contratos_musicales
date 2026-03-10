import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { PrimengModule } from '../../../primeng/primeng-module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { ChatService } from '../../services/chat-service';

@Component({
  selector: 'app-chat-bot',
  imports: [PrimengModule, FormsModule],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.scss'
})

export class ChatBot {
  userInput: string = '';
  messages: any[] = [];
  chatVisible = false;
  isLoading = false; // 👈 NUEVO

  constructor(
    private http: HttpClient,
    private chatService: ChatService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone 
  ) {}

  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }

 
 async sendMessage(event?: Event) {
  event?.preventDefault();

  if (!this.userInput.trim()) return;

  this.messages.push({ role: 'user', content: this.userInput });
  this.isLoading = true;

  try {
    const res = await lastValueFrom(this.chatService.sendMessage(this.userInput));

    // 👇 Cambios dentro del ciclo de Angular para evitar errores
   this.ngZone.run(() => {
  this.messages.push({
    role: 'assistant',
    content: res?.response ?? 'No se recibió respuesta del servidor.'
  });
 console.log(this.messages );
 
  // Marca la bandera en el siguiente ciclo para evitar errores de expresión cambiada
setTimeout(() => {
  this.ngZone.run(() => {
    this.isLoading = false;
    this.userInput = '';
    this.cd.detectChanges(); // ← fuerza actualización
  });
});

});



  } catch (error) {
    this.ngZone.run(() => {
      this.messages.push({
        role: 'assistant',
        content: 'Error en la comunicación con el servidor.'
      });
      this.isLoading = false;
    });
  }
}




}
