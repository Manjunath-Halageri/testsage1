import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { UserRolesService } from '../../../../core/services/user-roles.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [apiServiceComponent]
})
export class ProjectListComponent implements OnInit {

  newUserName: any;
  newRole: any;
  orgId: any;
  OrganizationName: any;
  userId: any;
  allWithProjects = [];
  projectName: any
  userDetails: {};
  projDetail: {};
  allUsersProjects = [];
  allUsersSeleted = [];
  allWithProjectsID = [];
  registerForm: FormGroup;
  submitted = false;
  userForm: any;
  loginDockerObject: any;
  userRolesForUI = []

  constructor(private api: apiServiceComponent, private http: HttpClient, private formBuilder: FormBuilder, private userRolesService: UserRolesService) {
    this.userRolesForUI = ['Manager', 'Lead', 'Automation Engineer', 'Reviewer Execution', 'Execution Engineer']
  }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      rolesName: ['', Validators.required],
      userName: ['', [Validators.required, ValidationserviceService.Namevalid, Validators.minLength(3),
      Validators.maxLength(15)]],
      email: ['', [Validators.required, ValidationserviceService.emailValidator, Validators.minLength(1),
      Validators.maxLength(30)]],
      password: ['', [Validators.required, ValidationserviceService.passwordValidator, Validators.minLength(1),
      Validators.maxLength(30)]],
    });

    this.newUserName = sessionStorage.getItem('userName');
    this.newRole = sessionStorage.getItem('newRoleName');
    console.log(this.newRole)
    this.OrganizationName = sessionStorage.getItem('OrganizationName');
    this.userId = sessionStorage.getItem('newUserId');
    this.orgId = sessionStorage.getItem('orgId');
    console.log(this.userId);

    ///////////////////////////////////THIS FUNCTION WE ARE USING FOR DISPLAY ON TABLE VIEW(find)////////////////////////////////
    let obj = {
      type: 'projectById',
      uId: this.userId
    }
    this.userRolesService.find(obj).subscribe(result => {
      this.allWithProjects = result;
      console.log(this.allWithProjects);
      console.log(this.allWithProjects[0].projectId);
    });
    this.userRolesService.getProjectsUsersData().subscribe(result => {
      this.allUsersSeleted = result;
      console.log(result)
    });
  }

  email: any;
  cancelFileds() {
    this.userRolesService.getProjectsUsers(this.projDetail)
      .subscribe(result => {
        console.log(result);
        this.allUsersProjects = result;
        this.rolesName = ""
        this.userName = ""
        this.email = ""
        this.password = ""
      });
  }
  noData: any;
  saveProjectList(projectName) {
    this.http.get(this.api.apiData + '/findPlanwiseCreateUsers' + '/' + this.orgId + '/' + projectName, {})
      .map(response => { return response as any })
      .subscribe(result => {
        this.allWithProjectsID = result;
        this.noData = result;
        if (this.noData === "Users Limit Reached as per Plan Type") {
          alert("Users Limit Reached as per Plan Type")
        }
        else {
          this.userDetails = {
            DetailsUser: this.registerForm.value,
            OrganizationName: this.OrganizationName,
            newUserName: this.newUserName,
            projectId: this.allWithProjectsID[0].projectId
          }
          ////IN THIS FUNCTION WE ARE CREATING UserRoles DETAILS(create)////
          this.userRolesService.create({
            type: 'storeUser',
            DetailsUser: this.registerForm.value,
            OrganizationName: this.OrganizationName,
            newUserName: this.newUserName,
            projectId: this.allWithProjectsID[0].projectId,
            OrgId: this.orgId
          }).subscribe(result2 => {
            this.rolesName = ""
            this.userName = ""
            this.email = ""
            this.password = ""
            console.log(result2);
            this.selectProject(projectName)
          });
        }
      })
  }


  get f() { return this.registerForm.controls; }


  selectProject(project) {
    this.projectName = project;
    this.projDetail = {
      newRole: this.newRole,
      OrganizationName: this.OrganizationName,
      projectName: this.projectName,
      OrgId: this.orgId
    }
    console.log(this.projDetail);
    this.userRolesService.getProjectsUsers(this.projDetail)
      .subscribe(result => {
        console.log(result);
        this.allUsersProjects = result;

      });
  }


  password: any;
  mail: any
  allUse = {}
  selUser(oldUser) {
    this.allUse = {
      newrole: this.newRole,
      oldUser: oldUser
    }
    this.userRolesService.getProjectuserRole(this.allUse)
      .subscribe(result => {
        console.log(result);
        if (result.length != 0) {
          alert("Name is already  Exist")
        }
      });
  }///////////////This Function is for checking Duplicates UserNames


  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    console.log(this.registerForm.value.projectName)
  }
  rolesName: any;
  userName: any
  id: any

  editUserRoles(users) {
    console.log(users);
    this.projectName = users.projectNames;
    this.rolesName = users.roleName;
    this.userName = users.userName;
    this.password = users.password;
    this.mail = users.Email;
    this.id = users._id;


  }
  /////////////////THIS FUNCTION WE ARE USING FOR UPDATE THE PROJECTNAME & UserRole_Details////////////////////////

  updateusers(projectName, rolesName, userName, password, mail) {
    console.log(rolesName, userName, password, mail)
    let obj = {
      type: "projectName"
    }
    var consolidatedObj = {
      "updatedData": {
        id: this.id,
        uRname: rolesName,
        uUname: userName,
        uPas: password,
        uMail: mail
      },
      "checkRoleCondition": obj
    }
    console.log(consolidatedObj)
    this.userRolesService.update(consolidatedObj)
      .subscribe(result => {
        console.log(result)
        this.selectProject(projectName)
      });
  }

  /////////////////////////THIS FUNCTION WE ARE USING FOR DELETE THE DATA/////////////////////////////////////

  deleteUserRole(userSDetail, projectName) {
    console.log(userSDetail)
    let obj = {
      type: "usersDetails",
      udId: userSDetail._id,
      orgId: this.orgId
    }
    this.userRolesService.delete(obj).subscribe(result => {
      console.log(result)
      this.selectProject(projectName)
    });
  }

  logoutDocker() {
    this.loginDockerObject = {
      "userName": "Admin",
      "password": "Admin"
    }
  }
}
