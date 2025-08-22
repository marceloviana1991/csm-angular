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

export interface MaterialEdicao {
  nome: string;
  preco: number;
  quantidadeEmEstoque: number;
}

export interface Material {
  id: number;
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

  public putMaterial(id: number, materialEdicao: MaterialEdicao): Observable<void> {
    return this.http.put<void>(`${this.endpointUrl}/${id}`, materialEdicao)
  }

  public getMateriaisByGrupo(grupoId: number): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.endpointUrl}/grupos/${grupoId}`)
  }

  public getImagemByMaterial(id: number): Observable<Blob> {
    return this.http.get(`${this.endpointUrl}/imagem/${id}`, { responseType: 'blob' })
  }

  public putImagemByMaterial(id: number, imagem: File): Observable<void> {
    const formData = new FormData();
    formData.append('imagem', imagem, imagem.name);
    return this.http.put<void>(`${this.endpointUrl}/imagem/${id}`, formData);
  }
  
}
