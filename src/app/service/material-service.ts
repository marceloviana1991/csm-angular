import { Injectable } from '@angular/core';
import { environment } from './environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface MaterialCadastro {
  nome: string;
  grupoId: number;
  preco: number;
  quantidadeEmEstoque: number;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private endpointUrl = `${environment.apiUrl}/materiais`; 

  constructor(private http: HttpClient) { }

  public postMaterial(materialCadastro: MaterialCadastro, imagem: File | null): Observable<void> {
    const formData = new FormData();
    if (imagem) {
      formData.append('imagem', imagem, imagem.name);
    }
    formData.append('requestDto', new Blob([JSON.stringify(materialCadastro)], { type: "application/json" }));
    return this.http.post<void>(this.endpointUrl, formData)
  }

  
}
