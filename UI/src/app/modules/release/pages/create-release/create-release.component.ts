// import { Component, OnInit,AfterViewInit, } from '@angular/core';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CreateService } from '../../../../core/services/release-create.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { ProjectSelectionServiceComponent } from '../../../../core/services/projectSelection.service';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { roleService } from '../../../../core/services/roleService';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-release',
  templateUrl: './create-release.component.html',
  styleUrls: ['./create-release.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [DatePipe]
})
export class CreateReleaseComponent implements OnInit {
  pageRoles: Object = {}
  createReleaseInfo;
  createReleaseVersion;
  createForm: any;
  updateForm: any;

  update = {
    "releaseVersion": "",
    "planStartDate": " ",
    "planEndDate": " ",
    "status": " ",
    "actualStartDate": " ",
    "actualEndDate": " ",
    "projectId": " "

  }
  projectDetails: any;
  projectidRelease: any;
  nonEdit: any;
  pageName: any;
  newRole: any;
  newUserId: any;
  newUserName: any;
  selectedProject: any;
  displayReleaseDataToUI = [];


  minDate: Date;
  dataSource: MatTableDataSource<any>;

  constructor(private createService: CreateService,
    private formBuilder: FormBuilder,
    private data: ProjectDetailServiceComponent,
    private releaseProjectid: ProjectSelectionServiceComponent,
    private decoratorKey: DecoratorService,
    private roles: roleService, public datepipe: DatePipe) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
  }

  ngOnInit() {
    this.pageName = "manageReleasePage"
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.selectedProject = JSON.parse(this.selectedProject)

    this.pageRoles = {
      pageName: this.pageName,
      roleName: this.newRole,
      userId: this.newUserId

    }

    this.getRolesPermissions();

    this.nonEdit = false
    this.createUser();
    this.updateUser();


    this.projectDetails = this.data.selectedProject();  ////projectName

    this.releaseProjectid.getprojectId(this.projectDetails)
      .subscribe(result => {
        this.projectidRelease = result;
        //this.displayReleaseCommanFunc();
        this.releaseTreeStructure();
        this.displayClosedRelease()
      })

    this.activeDisableDates()
  }




  dataClose() {
    this.createForm.reset();
    this.editReleaseData = false;
    this.createRelease = false;
    this.showAllClosedRelease = false;
  }
  cancelEditPage() {
    this.editReleaseData = false;
    this.createRelease = false;
    this.showAllClosedRelease = false;
    this.updateForm.reset();
    this.updateForm.controls['actualStartDate'].reset()
    this.updateForm.controls['actualEndDate'].reset()
  }
  blur() {
    this.nonEdit = true
  }

  activeDisableDates() {
    this.updateForm.get('actualStartDate').disable();
    this.updateForm.get('actualEndDate').disable();
  }
  onSearchChange(searchValue: string): void {
    if (searchValue == "Close") {
      this.updateForm.get('actualStartDate').enable();
      this.updateForm.get('actualEndDate').enable();
    } else {
      this.updateForm.get('actualStartDate').disable();
      this.updateForm.get('actualEndDate').disable();

    }
  }

  createUser() {
    this.createForm = this.formBuilder.group({
      'releaseVersion': ['', [Validators.required, ValidationserviceService.releaseVers, Validators.minLength(3),
      Validators.maxLength(20)]],
      'planStartDate': ['', [Validators.required]],
      'planEndDate': ['', [Validators.required]],
      'status': ['', [Validators.required]],
      'description': ['', [Validators.required, Validators.minLength(3),
      Validators.maxLength(100)]]
    }, { validator: [this.dateLessThan('planStartDate', 'planEndDate')] });
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return { notValid: true }
      }
      return {};
    }
  }

  updateUser() {
    this.updateForm = this.formBuilder.group({
      'releaseVersion': ['', [Validators.required,]],
      'planStartDate': ['', [Validators.required]],
      'planEndDate': ['', [Validators.required]],
      'status': ['', [Validators.required]],
      'actualStartDate': ['', [Validators.required]],
      'actualEndDate': ['', [Validators.required]],
      'description': ['', [Validators.required]],
    }, { validator: [this.updatedateLessThan('actualStartDate', 'actualEndDate')] });
  }
  updatedateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return { notValid: true }
      }
      return {};
    }
  }

  saverelease(releaseVersion, planStartDate, planEndDate, status, description) {
    var createReleaseVersion = {
      "releaseVersion": releaseVersion,
      "planStartDate": this.datepipe.transform(planStartDate, 'yyyy-MM-dd'),
      "planEndDate": this.datepipe.transform(planEndDate, 'yyyy-MM-dd'),
      "status": status,
      "description": description,
      "projectId": this.projectidRelease
    }


    this.createService.createRelease(createReleaseVersion)
      .subscribe((doc) => {
        if (doc.Error !== undefined) {
          this.decoratorKey.duplicate_Snackbar('Duplicate are not allowed', '', 'duplicate-snackbar')
          this.createForm.reset();

        }
        else {
          this.createRelease = false;
          this.decoratorKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')

          // this.displayReleaseCommanFunc();
          this.releaseTreeStructure()

          this.createForm.reset();
        }
      })
  }

  editrelease(data, i) {
    this.update = data[i];
    console.log(this.update)
    document.getElementById("myEdit").click();
  }

/*Logic Description: not used  */
  displayReleaseCommanFunc() {
    this.createService.dispRelease(this.projectidRelease)
      .subscribe((res) => {
        this.displayReleaseDataToUI = res;
        console.log(this.displayReleaseDataToUI)
      })

  }

/*Logic Description: update the release details
  */
  updaterelease(releaseVersion, planStartDate, planEndDate, status, actualStartDate, actualEndDate, description) {

    let obj = {
      "releaseVersion": releaseVersion,
      "planStartDate": planStartDate,
      "planEndDate": planEndDate,
      "status": status,
      "ActualStartDate": this.datepipe.transform(actualStartDate.startAt, 'yyyy-MM-dd'),
      "ActualEndDate": this.datepipe.transform(actualEndDate.startAt, 'yyyy-MM-dd'),
      "Description": description,
      "id": this.clickedrelease
    }

    this.createService.updateRelease(obj)
      .subscribe((doc) => {
        console.log(doc)
        this.decoratorKey.saveSnackbar('Updated Successfully', '', 'update-snackbar')
        this.displayClosedRelease()
        this.updateForm.reset()
        this.editReleaseData = false;
        this.createRelease = false;
        this.showAllClosedRelease = false;
        //this.displayReleaseCommanFunc();
        this.releaseTreeStructure()
      })
  }

  permissions = [];
  edit: boolean
  read: boolean
  delete: boolean
  create: boolean;
  disableButton: boolean;

 // to get userRoles 
  getRolesPermissions() {
    this.roles.getPermissions(this.pageRoles).subscribe(
      Data => {
        this.permissions = Data;
        this.edit = this.permissions[0].edit;
        this.read = this.permissions[0].read
        this.delete = this.permissions[0].delete
        this.create = this.permissions[0].create
        this.disableButton = this.permissions[0].disableButton
        console.log(this.permissions)
      })


  }


  /////////////////////////////Tree struture code by madhu/////////////////////////////////
  editReleaseData: boolean;
  selectedRelease: any;
  releaseVersion: any;
  planStartDate: any;
  planEndDate: any;
  status: any;
  clickedrelease: any;
  description: any;

  /*Logic Description: get the particular details to display in edit modal 
  */
  editSelectedRelease(selectedRelease) {
    this.editReleaseData = true;
    this.createRelease = false;
    this.showAllClosedRelease = false;
    this.createForm.reset();
    this.updateForm.reset();
    console.log(selectedRelease)
    let obj = {
      "releaseVersion": selectedRelease,
      "projectId": this.projectidRelease
    }

    this.createService.getReleaseToEdit(obj).subscribe(res => {
      console.log(res)
      this.selectedRelease = res;

      console.log(this.selectedRelease[0]._id)
      this.clickedrelease = this.selectedRelease[0]._id
      this.releaseVersion = this.selectedRelease[0].releaseVersion;
      this.planStartDate = this.selectedRelease[0].planStartDate;
      this.planEndDate = this.selectedRelease[0].planEndDate;
      this.status = this.selectedRelease[0].status;
      this.description = this.selectedRelease[0].description;

      // console.log(this.selectedRelease[0].planStartDate.slice(0,10))
    });

  }
  // description:any;
  createRelease: boolean;
  landModulePage() {
    this.createForm.reset();
    this.updateForm.reset();
    this.status = "Active"
    this.createRelease = true;
    this.editReleaseData = false;
    this.showAllClosedRelease = false;
  }

    /*Logic Description: get all Active releases to display in treestructure
  */
  releaseTreeStructure() {
    console.log(this.projectidRelease)
    this.createService.getAllReleases(this.projectidRelease)
      .subscribe(res => {
        console.log(res)
        this.displayModuleForTree = res;
        this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
      });
  }

  displayModuleForTree = [];
  items: { label: string; command: (event: any) => void; }[];
  async nodeSelect(file) {
    if (file.node != undefined) {

      if (file.node.data == "release") {
        this.pageName = file.node.label;
        for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
          if (file.node.label === this.displayModuleForTree[index]['label']) {
            break;
          }

        }   //   this.openFMenu(this.pageName);
        if (this.edit) {
          this.items = [
            { label: 'Edit Release', command: (event) => this.editSelectedRelease(file.node.label) },
            // { label: 'Edit', command: (event) => this.editPage1() }
          ];
        } else {
          this.items = [];
        }

      }

    }
  }

  /*Logic Description: get closed releases
  */
  displayClosedRelease() {
    console.log(this.projectidRelease)
    this.createService.displayClosedReleases(this.projectidRelease)
      .subscribe(res => {
        console.log(res)
        this.closedReleases = res;
        this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
      });

  }
  closedReleases = [];
  closedRelease: { label: string; command: (event: any) => void; }[];
  async closedReleaseNode(file) {
    if (file.node != undefined) {

      if (file.node.data == "closedrelease") {
        this.pageName = file.node.label;
        for (let index = 0; index < this.closedReleases.length; index++) {//for loop here is to find index of selected or clicked module
          if (file.node.label === this.closedReleases[index]['label']) {
            break;
          }

        }
        // this.closedRelease = [
        //   { label: 'Edit Release', command: (event) => this.editSelectedRelease(file.node.label) }
        // ];
      }

    }
  }
  displayAllClosedReleases = [];
  showAllClosedRelease: boolean;
  showClosedReleases() {
    this.showAllClosedRelease = true;
    this.createRelease = false;
    this.editReleaseData = false;
    console.log(this.projectidRelease)
    this.createService.displayAllClosedRelease(this.projectidRelease).subscribe(res => {
      console.log(res)
      this.displayAllClosedReleases = res;
      this.displayAllClosedReleases.sort((a, b) => a.releaseVersion.localeCompare(b.releaseVersion))
      //this.displayReleaseCommanFunc()
    });

  }
  displayedColumns: string[] = ['Sl.No', 'Release Version', 'Plan StartDate', 'Plan EndDate', 'Status', 'Actual StartDate', 'Actual EndDate'];


}


