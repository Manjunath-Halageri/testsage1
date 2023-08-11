import { Component, OnInit } from "@angular/core";
import { apiServiceComponent } from "../../../../core/services/apiService";
import { Router } from "@angular/router";
import { LoginServiceComponent } from "../../../../core/services/login.service";
import { roleService } from "../../../../core/services/roleService";
import { DockerService } from "../../../../core/services/dockerService";
import "rxjs/add/operator/map";


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css", "../../../../layout/css/parent.css"],
})
export class LoginComponent implements OnInit {
  userNameDetails: string;
  passwordDetails: string;
  loginUserDetails: any;
  wrongCredential: boolean;
  empty: boolean;
  show: boolean;
  loginDockerObject: any;
  userNameDetailsValid: boolean;
  passwordDetailsValid: boolean;
  projectDetails: any;
  invalidAttempt: boolean;

  constructor(
    private roles: roleService,
    private getData: LoginServiceComponent,
    private router: Router,
    private api: apiServiceComponent,
    private Docker: DockerService
  ) {
    this.wrongCredential = false;
    this.empty = false;
    this.show = false;
    this.userNameDetailsValid = false;
    this.passwordDetailsValid = false;
    this.invalidAttempt = false;
  }

  ngOnInit() {
    this.userNameDetails = "";
    this.passwordDetails = "";
  }

  loginDocker(userNameDetails, passwordDetails) {
    this.loginDockerObject = {
      userName: userNameDetails,
      password: passwordDetails,
    };
  }

  checkLoginDetails(userNameDetails, passwordDetails) {
 
    console.log(userNameDetails, passwordDetails)
    if (userNameDetails != "" && passwordDetails != "") {
      this.getData.getUserNamePassword(userNameDetails, passwordDetails)
        .subscribe((result) => {
          console.log(result);
          if (result == "Fail") {
            this.wrongCredential = true;
            this.empty = false;
            this.passwordDetailsValid = false;
            this.userNameDetailsValid = false;
            this.invalidAttempt = false;
            this.ngOnInit();
          } 
          else if(result == "Wait") {
            this.invalidAttempt = true;
            this.wrongCredential = false;
            this.empty = false;
            this.passwordDetailsValid = false;
            this.userNameDetailsValid = false;
            this.ngOnInit();
          }
          else {
            if (result.message) {
              return alert(result.message);
            }
            this.loginUserDetails = result;
            if (this.loginUserDetails.length != 0) {
              
              
              sessionStorage.setItem(
                "importedDetails",
                JSON.stringify(this.loginUserDetails)
              );
              sessionStorage.setItem(
                "newRoleName",
                this.loginUserDetails[0].roleName
              );
              sessionStorage.setItem(
                "newUserId",
                this.loginUserDetails[0].userId
              );
              sessionStorage.setItem(
                "userName",
                this.loginUserDetails[0].userName
              );
              sessionStorage.setItem(
                "OrganizationName",
                this.loginUserDetails[0].Organization
              );
              sessionStorage.setItem(
                "features",
                JSON.stringify(result[0].features)
              );
              
              sessionStorage.setItem("userId", this.loginUserDetails[0].userId);
              sessionStorage.setItem("orgId", this.loginUserDetails[0].orgId);
              localStorage.setItem("token", this.loginUserDetails[0].auth);
              this.roles.sendRoles(this.loginUserDetails[0].roleName);
              if (userNameDetails == this.loginUserDetails[0].userName) {
                this.loginDocker(userNameDetails, passwordDetails);
                if (this.loginUserDetails[0].roleName == "superAdmin") {
                  this.router.navigate(["/OrganizationCreation"]);
                } else if (this.loginUserDetails[0].roleName == "Owner") {
                  this.router.navigate(["/CreateProject"]);
                } else if (
                  this.loginUserDetails[0].roleName == "Project Admin"
                ) {
                  this.router.navigate(["/ProjectList"]);
                } else {
                  let obj1 = {
                    userName: userNameDetails
                  }
                    this.getData.getUserFrame(obj1)
                    .subscribe(result1 => {
                      console.log(result1)
                      this.projectDetails = {
                        projectId: result1[0].projectId,
                        projectName: result1[0].projectSelection,
                        frameworkId: result1[0].frameworkId,
                      };
                      sessionStorage.setItem('key', result1[0].projectSelection);
                      sessionStorage.setItem("selectedProject",  JSON.stringify(this.projectDetails));
                  this.router.navigate(["/projectdetail"]);
                  const obj = {
                    userId: result[0]._id,
                    orgId: result[0].orgId,
                  };
                  this.Docker.startFirstMachine(obj).subscribe(
                    (finalResult) => {
                      sessionStorage.setItem(
                        "machine",
                        finalResult[0].machineName
                      );
                      sessionStorage.setItem(
                        "defaultBrowser",
                        finalResult[0].scriptConfigdata.defaultBrowser
                      );
                      sessionStorage.setItem(
                        "url",
                        finalResult[0].machineDetails[0].url
                      ); //null
                      sessionStorage.setItem("_id", finalResult[0]._id); //_id
                      sessionStorage.setItem(
                        "loginDetails",
                        JSON.stringify({
                          userId: result[0]._id, //work here because docker machine id is sitting her not users id [change variable result to output]
                          orgId: result[0].orgId,
                          features: JSON.stringify(result[0].features),
                          licenseId: finalResult[0]._id,
                          url: finalResult[0].machineDetails[0].url,
                          defaultBrowser:
                            finalResult[0].scriptConfigdata.defaultBrowser,
                          defaultVersion:
                            finalResult[0].scriptConfigdata.defaultVersion,
                          _idLicenseDocker: finalResult[0]._id,
                        })
                      );
                    }
                  );
                });
                }
                
              }
            }
          }
        });
    } else {
      if (userNameDetails == "" && passwordDetails == "") {
        this.empty = true;
        this.wrongCredential = false;
        this.passwordDetailsValid = false;
        this.userNameDetailsValid = false;
        this.invalidAttempt = false;
        this.ngOnInit();
      } else if (userNameDetails == "") {
        this.userNameDetailsValid = true;
        this.passwordDetailsValid = false;
        this.empty = false;
        this.wrongCredential = false;
        this.invalidAttempt = false;
        this.ngOnInit();
      } else if (passwordDetails == "") {
        this.passwordDetailsValid = true;
        this.userNameDetailsValid = false;
        this.empty = false;
        this.wrongCredential = false;
        this.invalidAttempt = false;
        this.ngOnInit();
      }
    }
  
  }


  password() {
    this.show = !this.show;
  }
}
