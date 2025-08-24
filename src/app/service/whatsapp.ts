import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  enviarMensagem(numero: string, mensagem: string): void {
    const mensagemCodificada = encodeURIComponent(mensagem);

    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${mensagemCodificada}`;

    window.open(url, '_blank');
  }
}
