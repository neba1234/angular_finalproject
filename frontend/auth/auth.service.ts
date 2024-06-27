import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';


export interface State{
  _id:string,
  fullname:string
  email:string
  jwt?:string

}

export interface User{
  _id: string, fullname: string, email: string, password: string
}

export let initialstate={

  _id:'',
  fullname:'Guest',
  email:'',
  jwt:''
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   

  state=signal<State>(initialstate)

  readonly http=inject(HttpClient)

  navigation=inject(Router)

  signup(user_detail:User){
    return this.http.post<{success:boolean,data:User}>(environment.BACKEND_SERVER+'/users/signup',user_detail)
  }

  signin(credential:{email:string,password:string}){
    return this.http.post<{success:boolean,data:string}>(environment.BACKEND_SERVER+'/users/signin',credential)
  }


  is_logged_in(){
    return this.state()._id? true:false
  }

 
   signOut() {
    this.state.set(initialstate);
    this.navigation.navigate(['']);
  }

  constructor(){

    effect(()=>{
      localStorage.setItem('key',JSON.stringify(this.state()))
    })
  }

 
}
