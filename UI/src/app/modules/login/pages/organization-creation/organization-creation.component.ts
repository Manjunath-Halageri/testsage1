import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { UserRolesService } from '../../../../core/services/user-roles.service';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { OrganizationService } from '../../../../core/services/organization.service';
@Component({
  selector: 'app-organization-creation',
  templateUrl: './organization-creation.component.html',
  styleUrls: ['./organization-creation.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [apiServiceComponent],
})
export class OrganizationCreationComponent implements OnInit {
  newUserName: any;
  registerForm: FormGroup;
  registerFormAdmin: FormGroup;
  submitted = false;
  submitAdmin = false;
  CreateOrg: boolean;
  CreateOrgAdmin: boolean;
  OrganizationObject = {};
  newOrgName: any;
  OrganizationDetails = {}
  checkedValue: any = "1";
  updateValue: any = "1";
  allOrgWithAdmin = [];
  allOrgWithAdminSearch = [];
  userForm: any;
  loginDockerObject: any;
  orgAdminForm: FormGroup;
  constructor(private organizationService: OrganizationService, private formBuilder: FormBuilder, private api: apiServiceComponent, private userRolesService: UserRolesService) {

  }

  ngOnInit() {
    this.CreateOrg = true;
    this.CreateOrgAdmin = false;
    this.newUserName = sessionStorage.getItem('userName');
    this.registerForm = this.formBuilder.group({
      Organization: ['', [Validators.required, ValidationserviceService.onlychar, Validators.minLength(3),
      Validators.maxLength(15)]],
      OfficeAddress: ['', [Validators.required, ValidationserviceService.Namevalid, Validators.minLength(3),
      Validators.maxLength(15)]],
      ContactPerson: ['', [Validators.required, ValidationserviceService.onlychar, Validators.minLength(3),
      Validators.maxLength(15)]],
      PhoneNumber: ['', [Validators.required, ValidationserviceService.check_phone, Validators.minLength(1),
      Validators.maxLength(13)]],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      email: ['', [Validators.required, ValidationserviceService.emailValidator, Validators.minLength(1),
      Validators.maxLength(30)]],
    })
    this.registerFormAdmin = this.formBuilder.group({
      OrganizationName: ['', Validators.required],
      Username: ['', [Validators.required, ValidationserviceService.Namevalid, Validators.minLength(3),
      Validators.maxLength(15)]],
      Password: ['', [Validators.required, ValidationserviceService.passwordValidator, Validators.minLength(1),
      Validators.maxLength(30)]],
      WorkEmail: ['', [Validators.required, ValidationserviceService.emailValidator, Validators.minLength(1),
      Validators.maxLength(30)]],

    })
    this.orgAdminForm = this.formBuilder.group({
      adminNameOrg: ['', Validators.required],
      adminPasswordOrg: ['', Validators.required]
    })

    this.getOrgTable() //THIS FUNCTION IS USING FOR VIEW ON TABLE(find) 
    this.organizationService.getAllOrgnizationForSearch().subscribe(result => {
      this.allOrgWithAdminSearch = result;
      console.log(this.allOrgWithAdminSearch);
    })
  }

  Username: String
  Password: String
  WorkEmail: String
  Organization: string
  OfficeAddress: string
  ContactPerson: string;
  PhoneNumber: string;
  email: string;
  StartDate: string;
  EndDate: string;
  newEntry() {
    // alert("kkkk")
    this.Username = '';
    this.Password = '';
    this.Username = '';
    this.Organization = '';
    this.OfficeAddress = ''
    this.ContactPerson = '';
    this.PhoneNumber = '';
    this.email = '';
    this.StartDate = '';
    this.EndDate = '';
  }
  get f() { return this.registerForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.newOrgName = this.registerForm.value.Organization
    this.CreateOrg = false;
    this.CreateOrgAdmin = true;
    this.checkedValue = "2";
    console.log()
  }
  get adminForm() { return this.registerFormAdmin.controls; } //ADMIN VALIDATION

  getOrgTable() {
    this.userRolesService.find({
      type: 'organization'
    })
      .subscribe(result => {
        this.allOrgWithAdmin = result;
        console.log(this.allOrgWithAdmin);
      });
  }
  onSubmit1() {
    this.submitAdmin = true;
    if (this.registerFormAdmin.invalid) {
      return;
    }
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerFormAdmin.value))
  }

  LicOrgAdmin(userDetails) {
    console.log(userDetails)
    console.log(userDetails.orgId)
    this.orgName = userDetails.Organization;
    this.orgId = userDetails.orgId;
    this.orgRole = userDetails.userRole;
  }
  orgName: any;
  orgId: any;
  orgRole: any;

  SaveLicAdmin(adminName, adminPassword) {
    console.log(this.orgRole)
    var obj = {
      "adminName": adminName,
      "adminPassword": adminPassword,
      "orgName": this.orgName,
      "orgId": this.orgId,
      "orgRole": this.orgRole
    }
    this.organizationService.orgAdminDetails(obj)
      .subscribe(result => {
        console.log(result)
        this.getOrgTable()
      });
  }

  CreateOrganization() {
    this.CreateOrg = true;
    this.CreateOrgAdmin = false;
  }
  uf: boolean
  CreateAdmin(Organization) {
    if (Organization.length == 0) {
      this.checkedValue = "1";
      this.uf = false;
    }
    else {
      this.CreateOrg = false;
      this.CreateOrgAdmin = true;
      console.log(this.registerForm.value.Organization)
    }

  }

  CreateAdmin1() {
    this.CreateOrg = false;
    this.CreateOrgAdmin = true;
    console.log(this.registerForm.value.Organization)
  }

  clearFileds() {

    this.OrganizationDetails = {};
  }

  // SaveOrganization() {

  //   this.http.post(this.api.apiData + '/createOrgnization', this.registerForm.value)
  //     .map(res => res.json())
  //     .subscribe(result => {
  //       console.log(result)

  //     });

  // }
  /////////////////////////////////THIS FUNCTION IS USING FOR CREATING ORGANIZATION & ORGAIZATION_ADMIN(create)//////////////////////////////////////////

  // saveAdminWithOrganization() {

  //   console.log(this.registerForm.value)
  //   console.log(this.registerFormAdmin.value)
  //   this.userRolesService.create({
  //     type: 'saveAdminWithOrgAdmin',
  //     orgnizationValue: this.registerForm.value,
  //     orgnizationAdminValue: this.registerFormAdmin.value,
  //   })
  //     .subscribe(result => {

  //       ////////////////////////////THIS FUNCTION IS USING FOR VIEW ON TABLE(find)//////////////////////////////////////////////////////

  //       this.userRolesService.find({
  //         type: 'organization'
  //       })
  //         .subscribe(result1 => {
  //           this.allOrgWithAdmin = result1;
  //           console.log(this.allOrgWithAdmin);
  //           this.Username = "";
  //           this.Password = "";
  //           this.WorkEmail = "";
  //           this.CreateOrgAdmin = false;
  //           this.CreateOrg = true;
  //           this.checkedValue = "1"


  //           this.http.get(this.api.apiData + '/getAllOrgnizationForSearch')
  //             .map((response: Response) => <Post[]>response.json())
  //             .subscribe(result2 => {
  //               this.allOrgWithAdminSearch = result2;
  //               console.log(this.allOrgWithAdminSearch);
  //               this.OrganizationDetails = {}


  //             });

  //         });

  //     });

  // }

  oneOrganization = [];
  oneAdmin = [];
  editOrgAdmin(adminDetails) {
    console.log(adminDetails)
    this.organizationService.getOneOrgnization(adminDetails.Organization)
      .subscribe(result1 => {
        this.oneOrganization = result1;
        console.log(this.oneOrganization);
        this.organizationService.getOneAdmin(adminDetails.Organization)
          .subscribe(result2 => {
            this.oneAdmin = result2;
            console.log(this.oneAdmin);

          });
      });
  }

  updateOrganization(Org) { //THIS FUNCTION IS USING FOR UPADATE THE ORGANIZATION & ORGANIZATION_ADMIN(update)
    alert("First update")
    let obj = {
      type: 'organization',
      updateOrg: 'Org'
    }
    var consolidatedObj = {
      "updatedData": Org,
      "checkRoleCondition": obj
    }

    this.userRolesService.update(consolidatedObj)
      .subscribe(result => {
        console.log(result)
        this.updateValue = "2"
        this.CreateOrg = false;
        this.CreateOrgAdmin = true;
      });
  }

  updateAdmin(organizationAdmin) {
    let obj = {
      type: 'organizationAdmin',
      updateOrg: 'Org'
    }
    console.log(organizationAdmin);
    var consolidatedObj = {
      "updatedData": organizationAdmin,
      "checkRoleCondition": obj
    }

    this.userRolesService.update(consolidatedObj)
      .subscribe(result => {
        console.log(result)
        this.userRolesService.find({ //THIS FUNCTION IS USING FOR DISPLAY ON TABLE(find)
          type: 'organization'
        })
          .subscribe(result => {
            this.allOrgWithAdmin = result;
            console.log(this.allOrgWithAdmin);
          });
      });
  }

  deleteOrgAdmin(adminDetail) { //THIS FUNCTION IS USING FOR DELETE THE ORGANIZATION & ORGANIZATION_ADMIN(delete)
    this.userRolesService.delete({
      type: 'organizationAdminDetail',
      admId: adminDetail._id,
    }).subscribe(result => {  //THIS FUNCTION IS USING FOR DISPLAY ON TABLE(find)
      this.userRolesService.find({
        type: 'organization'
      }).subscribe(result => {
        this.allOrgWithAdmin = result;
        console.log(this.allOrgWithAdmin);
      });
    });
  }

  searchOrgName(orgName) {
    console.log(orgName)
    if (orgName != undefined) {
      this.organizationService.getSelectedOrgnization(orgName)
        .subscribe(result1 => {
          this.allOrgWithAdmin = result1;
          console.log(this.allOrgWithAdmin);
        });
    }
    else {
      alert("PLEASE Enter the Organization Name")
    }
  }

  logoutDocker() {
    this.loginDockerObject = {
      "userName": "Admin",
      "password": "Admin"

    }
  }
}

