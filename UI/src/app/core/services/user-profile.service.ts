import { Injectable } from '@angular/core';
import { HttpcallService } from "./httpcall.service";
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';
import { apiServiceComponent } from "./apiService";

@Injectable({
  providedIn: 'root'
})
export class UserProfileServiceComponent {

  constructor(
    private http: HttpClient,
    private api: apiServiceComponent,
    private httpCall: HttpcallService
  ) { }


  getUserDetails(uid) {
    let obj = {
      userId: uid,
    };
    let request = {
      params: obj,
      method: "get",
      path: "/userProfile/getUserDetails",
    };
    return this.httpCall.httpCaller(request);
  }

  updateUserDetails(obj) {
    let request = {
      params: obj,
      method: "post",
      path: "/userProfile/updateUserDetails",
    };
    return this.httpCall.httpCaller(request);
  }

  updatePass(obj) {
    let request = {
      params: obj,
      method: "post",
      path: "/userProfile/updateUserPassword",
    };
    return this.httpCall.httpCaller(request);
  }

}
