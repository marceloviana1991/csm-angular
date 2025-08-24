import { HttpInterceptorFn } from '@angular/common/http';
import { LoginService } from '../service/login-service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const login = inject(LoginService)

  if (login.estaAutenticado()) {
    const newReq = req.clone({
      setHeaders: {Authorization: `Bearer ${login.getToken()}`}
    })
    return next(newReq);
  }

  return next(req);
};
