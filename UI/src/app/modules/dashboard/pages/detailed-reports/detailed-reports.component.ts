import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { roleService } from '../../../../core/services/roleService';
import { release } from 'os';

@Component({
  selector: 'app-detailed-reports',
  templateUrl: './detailed-reports.component.html',
  styleUrls: ['./detailed-reports.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class DetailedReportsComponent implements OnInit {
  pageRoles: Object = {}

  selProjectName: string;
  obj: any;
  allProData: any;
  projectId: any;
  AllProData: any;
  releaseVersionForm: FormGroup;
  getAllReleasesVersions: any;
  pageName: any;
  newRole: any;
  newUserId: any;
  newUserName: any;
  selectedProject: any;
  moduleName: any;
  featureName:any;
  releaseVersionn:any;

  constructor(private fb: FormBuilder, private dashboardservice: DashboardService, private router: Router, private roles: roleService) {
    this.dashboardservice.moduleNamee.subscribe((res)=>{
      console.log(res)
      this.moduleName = res;
    })
    this.dashboardservice.featureNamee.subscribe((res)=>{
      this.featureName = res;
    })
    this.dashboardservice.releaseVersionn.subscribe((res)=>{
      this.releaseVersionn = res;
    })
  }

  ngOnInit() {

    this.pageName = "hierarchyTestExecutionPage"
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

    this.releasevalidation()
    this.selProjectName = sessionStorage.getItem('key');
    this.obj = {
      "projectSelection": this.selProjectName
    }
    // console.log(this.selProjectName)
    this.dashboardservice.getModuleFields(this.obj)
      .subscribe((data) => {
        this.allProData = data;
        this.projectId = this.allProData.projectId
        console.log(this.projectId)
        this.getAllReleases(this.projectId)
      })
      this.moduleName=undefined;
  }

  ngOnDestroy() {
    console.log("MEEEEEE",this.router.url)
  }

  releasevalidation() {
    this.releaseVersionForm = this.fb.group({
      'releaseVersion': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    });//For release form validation

  }
  searchData(releaseVersion) {
    localStorage.setItem('releaseVersion', releaseVersion);
    this.releaseVersionn = releaseVersion;
    if (releaseVersion === undefined) {
      alert("select release")
    } else {
      this.router.navigate(['/projectdetail/dashboard/detailedreports/modulereports']);
    }
  }
  getAllReleases(projectId) {
    var obj = {
      "projectId": projectId
    }
    this.dashboardservice.getAllRelease(obj)
      .subscribe((data) => {
        this.getAllReleasesVersions = data;

      })

  }
  permissions = [];
  edit: boolean
  read: boolean
  delete: boolean
  create: boolean;
  disableButton: boolean;


  getRolesPermissions() {
    console.log(this.pageRoles);
    this.roles.getPermissions(this.pageRoles).subscribe(
      Data => {
        this.permissions = Data; console.log(this.permissions);
        console.log(this.permissions);

        this.edit = this.permissions[0].edit;
        this.read = this.permissions[0].read
        this.delete = this.permissions[0].delete
        this.create = this.permissions[0].create
        this.disableButton = this.permissions[0].disableButton

      })


  }
}
