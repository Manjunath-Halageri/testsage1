import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { UserRolesService } from '../../../../core/services/user-roles.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [apiServiceComponent]
})
export class CreateProjectComponent implements OnInit {

  Username: any;
  Password: any;
  WorkEmail: any
  newUserName: any;
  registerForm: FormGroup;
  registerFormAdmin: FormGroup;
  submitted = false;
  submitAdmin = false;
  CreateOrg: boolean;

  CreateOrgAdmin: boolean;
  CreateOrgEdit: boolean;
  CreateOrgAdminEdit: boolean;

  OrganizationObject = {};
  newOrgName: any;
  projectDetails = {}
  checkedValue: any = "1";
  checkedEditValue: any = "1";
  allOrgWithProjects = [];
  SelProjects = [];
  allProjectDetails = {};
  browser: any;
  dbrowsers: any;
  selectedBrowser: any;
  selectedId: any;
  allversions: any;

  selectionversion: any;
  newRole: any;
  OrganizationName: any;
  p: number = 1;
  proBrowsrName: any;
  GlobalProject: any;
  newProId: any;
  userForm: any;
  loginDockerObject: any;
  framework: any;
  orgId: any;

  constructor(private formBuilder: FormBuilder, private api: apiServiceComponent, private http: HttpClient, private userRolesService: UserRolesService) {


  }

  ngOnInit() {

    this.CreateOrg = true;
    this.CreateOrgAdmin = false;
    this.CreateOrgEdit = true;
    this.CreateOrgAdminEdit = false;
    this.getBrowser();
    this.newUserName = sessionStorage.getItem('userName');
    this.newRole = sessionStorage.getItem('newRoleName');
    this.OrganizationName = sessionStorage.getItem('OrganizationName');
    this.orgId = sessionStorage.getItem('orgId');
    console.log(this.OrganizationName);
    this.registerForm = this.formBuilder.group({

      ProjectNameNew: ['', [Validators.required, ValidationserviceService.Namevalid, Validators.minLength(3),
      Validators.maxLength(15)]],
      description: ['', [Validators.required, ValidationserviceService.Namevalid, Validators.minLength(3),
      Validators.maxLength(15)]],
      framework: ['', Validators.required],
      type: ['', Validators.required],
      setOut: ['', [Validators.required, ValidationserviceService.Numvalid, Validators.minLength(1),
      Validators.maxLength(5)]],
      defaultBrowser: ['', Validators.required],
      defaultVersion: ['', Validators.required],
    })

    this.registerFormAdmin = this.formBuilder.group({

      ProjectName: ['', Validators.required],
      Username: ['', [Validators.required, ValidationserviceService.Namevalid, Validators.minLength(3),
      Validators.maxLength(15)]],
      Password: ['', [Validators.required, ValidationserviceService.passwordValidator, Validators.minLength(1),
      Validators.maxLength(30)]],
      WorkEmail: ['', [Validators.required, ValidationserviceService.emailValidator, Validators.minLength(1),
      Validators.maxLength(30)]],

    })
    this.userRolesService.getFrameWorks()
      .subscribe(result => {

        this.framework = result.framework;
        console.log(this.framework)
      });

    this.getTheProjectDetails();
  }
  /////////////////////////////THIS FUNCTION WE ARE USING FOR VIEW ON TABLE(find)////////////////////////////////////////

  getTheProjectDetails() {

    this.userRolesService.find({
      type: 'project',
      orgName: this.OrganizationName
    })
      .subscribe(result => {
        this.allOrgWithProjects = result;
        this.SelProjects = result;
      });
  }

  getBrowser() {
    this.http.get(this.api.apiData + '/getbrowser')
      .map(response => { return response as any })
      .subscribe(result => {
        this.browser = result;
        this.dbrowsers = this.browser;
        console.log(this.browser, 'manu', this.dbrowsers, 'shivu')
      });
  }

  getversion(browser) {

    this.selectedBrowser = browser;
    this.http.get(this.api.apiData + '/versions' + this.selectedBrowser)
      .map(response => { return response as any })
      .subscribe(result => {
        this.allversions = result;
        console.log(this.allversions);
        this.selectionversion = this.allversions[0].version;

      });

  }

  get f() { return this.registerForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.newOrgName = this.registerForm.value.ProjectNameNew
    this.CreateOrg = false;
    this.CreateOrgAdmin = true;
    this.checkedValue = "2";
  }
  get adminForm() { return this.registerFormAdmin.controls; }


  onSubmit1() {
    this.submitAdmin = true;

    // stop here if form is invalid
    if (this.registerFormAdmin.invalid) {
      return;
    }
  }
  CreateOrganization() {
    this.CreateOrg = true;
    this.CreateOrgAdmin = false;
  }
  CreateOrganizationEdit() {
    this.CreateOrgEdit = true;
    this.CreateOrgAdminEdit = false;
  }
  CreateAdmin() {
    if (this.registerForm.value.ProjectNameNew == undefined) {
      this.checkedValue = "1";

      alert("Please Create the Project")
    }
    else {

      this.CreateOrg = false;
      this.CreateOrgAdmin = true;
    }

  }
  CreateAdminEdit() {
    this.CreateOrgEdit = false;
    this.CreateOrgAdminEdit = true;
    this.checkedEditValue = "2";
  }
  //////////////////////THIS FUNCTION ARE USING FOR CREATING PROJECT AND PROJECT_ADMIN(create)////////////////////

  saveAdminWithProjects() {
    alert("function calling bro")
    console.log(this.registerForm.value)

    const features = JSON.parse(sessionStorage.getItem('features'));
    let exportCondition: boolean = features.filter(feature => feature.name === "export")[0].condition;
    let exportConfig = '';
    if (exportCondition) {
      exportConfig = 'exportYes';
    }
    this.userRolesService.create({
      type: 'saveAdminWithPro',
      orgnizationValue: this.registerForm.value,
      orgnizationAdminValue: this.registerFormAdmin.value,
      OrganizationName: this.OrganizationName,
      OrgId: this.orgId,
      exportConfig: exportConfig
    }
    )
      .subscribe(result => {
        console.log(result);
        this.userRolesService.find({
          type: 'organization'
        })

          .subscribe(result => {
            this.allOrgWithProjects = result;
            this.SelProjects = result
            console.log(this.allOrgWithProjects);
            this.addNewUSER()
          });
      });
  }

  cancel() {
    this.userRolesService.getAllProjects(this.OrganizationName)
      .subscribe(result => {
        this.allOrgWithProjects = result;
        this.SelProjects = result;
        console.log(this.allOrgWithProjects);
      });
  }
  newUser: any;
  newPassword: any;
  newEmail: any;
  addNewUSER() {
    this.newUser = "";
    this.newPassword = "";
    this.newEmail = ""
  }

  clearFileds() {

    this.projectDetails = {};
    this.editProjectDetails = [];
  }

  selUser(oldUser) {
    this.userRolesService.getOneUserDetails(oldUser)
      .subscribe(result => {
        console.log(result);
        this.newPassword = result[0].password
        console.log(this.newPassword)
        this.newEmail = result[0].Email
      });
  }
  editProjectDetails = [];
  projectAdmins = [];
  editProjects(ProjDetails) {
    this.editProjectDetails = [];
    console.log(ProjDetails);
    this.editProjectDetails.push(ProjDetails);
    console.log(this.editProjectDetails);
    this.GlobalProject = this.editProjectDetails[0].projectSelection;
    this.proBrowsrName = this.editProjectDetails[0].projectConfigdata.defaultBrowser;
    this.userRolesService.addNew(ProjDetails)
      // this.http.get(this.api.apiData + '/addNew', ProjDetails)
      //   .map(res => res.json())

      .subscribe(result => {
        console.log(result);
        this.projectAdmins = result;
      });
  }

  //////////////////////THIS FUNCTION ARE USING FOR UPDATING PROJECT & PROJECT_ADMIN DETAILS(update)/////////////////////////////

  updateProjects(project) {
    this.newProId = project._id;
    let obj = {
      type: 'project',
      updateProject: 'project'
    }

    var consolidatedObj = {
      "updateProject": project,
      "checkRoleCondition": obj
    }

    this.userRolesService.update(consolidatedObj)
      .subscribe(result => {
        console.log(result)
        console.log("llllllllllllllllllpooooooooo")
        this.CreateOrgEdit = false;
        this.CreateOrgAdminEdit = true;
        this.checkedEditValue = "2";
        console.log(this.CreateOrgEdit)
        console.log(this.CreateOrgAdminEdit)
      });
  }
  updateWithProjects(ProjectAdmin) {

    console.log(ProjectAdmin)
    let obj = {
      type: 'ProjectAdmin',
      newProId: this.newProId,
      ProjetAdmin: 'ProjetAdmin'
    }
    console.log(obj)
    var consolidatedObj = {
      "updateProject": ProjectAdmin,
      "checkRoleCondition": obj
    }
    console.log(ProjectAdmin);
    console.log(this.newProId);

    this.userRolesService.update(consolidatedObj)
      .subscribe(result => {
        console.log(result)
        this.getTheProjectDetails();
      });
  }

  ///////////////////THIS FUNCTION ARE USING FOR DELETE THE PROJECT & PROJECT_ADMIN DETAILS(delete)/////////////////////////////////////

  deleteProjects(adminDetail) {
    this.userRolesService.delete({
      type: 'projectAdmin',
      padmId: adminDetail._id,

    })
      .subscribe(result => {
        return this.getTheProjectDetails();
      });

  }

  getProject(SelProject) {

    if (SelProject != undefined) {
      this.userRolesService.getSelectedProject(SelProject)
        // this.http.get(this.api.apiData + '/getSelectedProject' + SelProject, {})
        //   .map((response: Response) => <Post[]>response.json())
        .subscribe(result1 => {
          console.log(result1)
          this.allOrgWithProjects = result1;


        });
    }
    else {
      alert("PLEASE SELECT PROJECT AND SEARCH")
    }
  }


  logoutDocker() {
    //alert("logoutDocker is calling")

    this.loginDockerObject = {
      "userName": "Admin",
      "password": "Admin"

    }

  }

  transform(): any {
    return this.SelProjects.filter((val) => {
      let rVal = (val.projectSelection.toLocaleLowerCase()) || (val.projectType.toLocaleLowerCase()) || (val.projectAdmin.toLocaleLowerCase());
      return this.SelProjects= rVal
    })

  }

}
