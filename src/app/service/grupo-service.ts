import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Grupo {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private endpointUrl = `${environment.apiUrl}/grupos`; 

  constructor(private http: HttpClient) { }

  public getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.endpointUrl);
  }
  
}
