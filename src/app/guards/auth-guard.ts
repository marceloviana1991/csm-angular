import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../service/login-service';

export const authGuard: CanActivateFn = (route, state) => {
  const login = inject(LoginService)
  return login.estaAutenticado();
};
