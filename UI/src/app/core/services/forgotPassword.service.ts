import { Injectable } from '@angular/core';
import { HttpcallService } from "./httpcall.service";
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';
import { apiServiceComponent } from "./apiService";
import { Post } from '../../post'




@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordServiceComponent {
  constructor(
        private http: HttpClient,
        private api: apiServiceComponent,
        private httpCall: HttpcallService) {}

        checkEmail(obj) {
          alert("service")
            let request = {
              params: obj,
              method: "post",
              path: "/forgotPassword/getEmail",
            };
            return this.httpCall.httpCaller(request);
          }

          sendOTP(obj) {
            let request = {
              params: obj,
              method: "post",
              path: "/forgotPassword/sendOTP",
            };
            return this.httpCall.httpCaller(request);
          }
        
          verifyEmailOtpService(verifyObj) {
            let request = {
              params: verifyObj,
              method: "post",
              path: "/forgotPassword/verifyEmailOtpApiCall",
            };
            return this.httpCall.httpCaller(request);
          }
        
          updateNewPasswordService(updatePwd) {
            let request = {
              params: updatePwd,
              method: "post",
              path: "/forgotPassword/updateNewPasswordServiceApiCall",
            };
            return this.httpCall.httpCaller(request);
          }
        
}