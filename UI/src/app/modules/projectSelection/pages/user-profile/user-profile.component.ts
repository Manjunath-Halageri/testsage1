import { Component, OnInit } from "@angular/core";
import { UserProfileServiceComponent  } from "../../../../core/services/user-profile.service";


@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: [
    "./user-profile.component.css",
    "../../../../layout/css/parent.css",
    "../../../../layout/css/table.css",
  ],
})
export class UserProfileComponent implements OnInit {
  newUserId: any;
  userName: any;
  password: any;
  organizationName: any;
  email: any;
  inputClickedUserName: boolean;
  inputClickedEmail: boolean;
  inputClickedPassword: boolean;

  constructor(
    private userProfileService: UserProfileServiceComponent,
  ) {}

  dataChange = [];

  ngOnInit() {
    this.newUserId = sessionStorage.getItem("newUserId");
    this.inputClickedUserName = true;
    this.inputClickedEmail = true;
    this.inputClickedPassword = true;

    this.userProfileService.getUserDetails(this.newUserId)
      .subscribe((result) => {
        console.log(result);
        this.userName = result[0].userName;
        this.password = result[0].password;
        this.organizationName = result[0].Organization;
        this.email = result[0].Email;
      });
  }

  userProfile() {
    this.userProfileService.getUserDetails(this.newUserId)
      .subscribe((result) => {
        console.log(result);
      });
  }

  updateUserDetails(userName, email) {
    console.log(userName, email);
    let obj = {
      userName: userName,
      email: email,
      userId: this.newUserId,
    };
    this.inputClickedUserName = true;
    this.inputClickedEmail = true;
    this.inputClickedPassword = true;
    this.userProfileService.updateUserDetails(obj).subscribe((result) => {
      console.log(result);
    });
  }

  clickEditUserName() {
    this.inputClickedUserName = false;
  }
  clickEditEmail() {
    this.inputClickedEmail = false;
  }
  clickEditPassword() {
    this.inputClickedPassword = false;
  }
  clearAll() {
    this.inputClickedUserName = true;
    this.inputClickedEmail = true;
    this.inputClickedPassword = true;
  }

  updatePassword(currentPass, newPass, confirmPass) {
    console.log(currentPass, newPass, confirmPass)
    let obj = {
      currentPassword: currentPass,
      newPass: newPass,
      confirmPass: confirmPass,
      userId: this.newUserId,
    };
    if (newPass == confirmPass) {
      this.userProfileService.updatePass(obj).subscribe((result) => {
        console.log(result);
      });
    } else {
      alert("Passwords are not matched");
    }
  }

}
