import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginRequestDto, LoginService } from '../service/login-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  login: string | null = null
  senha: string | null = null

  constructor(
    private loginService: LoginService,
    private snakbar: MatSnackBar,
    private router: Router,
  ) {}

  onSubmit() {
    const loginRequestDto: LoginRequestDto = {
      login: this.login!,
      password: this.senha!
    }
    this.loginService.postLogin(loginRequestDto).subscribe({
      next: (response) => {
        console.log(response)
        this.openSnackBar('Autenticação realizada com sucesso!');
        sessionStorage.setItem('token', response.token);
        this.router.navigate(['/listar']);
      },
      error: () => {
        this.openSnackBar('Falha na autenticação!');
      }
    })
  }

  openSnackBar(mensagem: string) {
    this.snakbar.open(mensagem, 'Fechar', {
      duration: 3000
    });
  }

}
