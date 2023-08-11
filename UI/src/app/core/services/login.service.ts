import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable()

export class LoginServiceComponent {
  constructor(private httpCall: HttpcallService) {
  }


  getUserFrame(obj) {
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/login/getAllDetails'
    }
    return this.httpCall.httpCaller(request);
  }
  
  getUserNamePassword(userNameDetails, passwordDetails) {
    const credetials = {
      userName: userNameDetails,
      password: passwordDetails
    }
    const request = {
      'params': credetials,
      'method': 'post',
      'path': '/login/loginDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getUserDetails(loginDetails) {
    const request = {
      'params': loginDetails,
      'method': 'post',
      'path': '/login/logOut'
    }
    //localStorage.clear();
    //sessionStorage.clear();
    return this.httpCall.httpCaller(request);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

