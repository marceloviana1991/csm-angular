import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequestDto {
  login: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
}

export interface TelefoneResponseDto {
  telefone: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  

  private endpointUrl = `${environment.apiUrl}/login`; 
  
    constructor(private http: HttpClient) { }

  public postLogin(loginRequestDto: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(this.endpointUrl, loginRequestDto);
  }

  public getTelefone(): Observable<TelefoneResponseDto> {
    return this.http.get<TelefoneResponseDto>(this.endpointUrl);
  }

  public estaAutenticado(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) return false;
    return true;
  }

  public getToken(): string {
    const token = sessionStorage.getItem('token');
    if (!token) return '';
    return token;
  }

  public logout() {
    sessionStorage.removeItem('token')
  }

}
