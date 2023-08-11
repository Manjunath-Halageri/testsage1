import { ForgotPasswordServiceComponent } from './../../../../core/services/forgotPassword.service';
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { DecoratorService } from '../../../../core/services/decorator.service';


@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  email: any;
  userName: any;
  newpwd: any;
  default: boolean;
  step1Verification: boolean;
  step2Verification: boolean;
  verifyEmail: any;
  _cnfrmpwd: any;
  wrongCredetials: boolean;
  wrongOtp: boolean;
  wrongPassNew: boolean;
  unablePassupdate: boolean;
  constructor(
    private forgotPasswordService: ForgotPasswordServiceComponent,
    private router: Router,
    private decoratorKey: DecoratorService,
  ) {}

  ngOnInit() {
    this.default = true;
    this.step1Verification = false;
    this.step2Verification = false;
    this.wrongCredetials = false;
    this.wrongOtp =  false;
    this.wrongPassNew = false;
    this.unablePassupdate = false;

  }

  forgotPassword(email, name) {
    alert(".ts")
    let obj = {
      userName: name,
      email: email,
    };
    this.verifyEmail = email;
    this.forgotPasswordService.checkEmail(obj)
    .subscribe((result) => {
      console.log(result);
      if (result.length > 0) {
        this.forgotPasswordService.sendOTP({ email: email })
          .subscribe((_res) => {
            this.step1Verification = true;
            this.step2Verification = false;
            this.default = false;
            this.wrongCredetials = false;

          });
      } else {
        this.step1Verification = false;
        this.wrongCredetials = true;

      }
    });
  }

  verifyEmailOtp(enterOtp) {
    let _obj = {
      email: this.verifyEmail,
      otp: enterOtp,
    };
    this.forgotPasswordService.verifyEmailOtpService(_obj)
      .subscribe((resOtp) => {
        console.log(resOtp);
        if (resOtp.length > 0) {
          this.default = false;
          this.step2Verification = true;
          this.step1Verification = false;
          this.wrongOtp =  false;

        } else {
          this.step2Verification = false;
          this.wrongOtp =  true;

        }
      });
  }

  updateNewPassword(_newpwd, _cnfrmpwd) {
    let updatePbj = {
      newPassword: _newpwd,
      email: this.verifyEmail,
    };
    if (_newpwd === _cnfrmpwd) {
      this.forgotPasswordService.updateNewPasswordService(updatePbj)
        .subscribe((resOtp) => {
          console.log(resOtp, "resOtp");
          this.wrongPassNew = false;

          if (resOtp.success) {
            this.unablePassupdate = false;
            this.decoratorKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
            this.router.navigate(['/']);
          } else {
            this.unablePassupdate = true;

          }
        });
    } else {
      this.newpwd = "";
      this.wrongPassNew = true;

    }
  }
}
