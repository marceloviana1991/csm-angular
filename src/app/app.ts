import { LayoutModule } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from './service/login-service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatTabsModule,
    RouterModule,
    LayoutModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected title = 'csm';

  constructor(
    public loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginService.getTelefone().subscribe( response => {
      sessionStorage.setItem('telefone', response.telefone)
    })
  }

  logout() {
    this.loginService.logout()
    this.router.navigate(['/vender']);
  }
}
