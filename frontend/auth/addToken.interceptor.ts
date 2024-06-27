import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {

  let auth= inject(AuthService);
  if(auth.is_logged_in()){
    let reqwithtoken=req.clone({
      headers:req.headers.set('Authorization',`Bearer ${auth.state().jwt}`)
    })

    return next(reqwithtoken)
  }else{

    return next(req);

  }
  
};
