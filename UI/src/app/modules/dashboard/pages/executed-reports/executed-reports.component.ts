import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { roleService } from '../../../../core/services/roleService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-executed-reports',
  templateUrl: './executed-reports.component.html',
  styleUrls: ['./executed-reports.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class ExecutedReportsComponent implements OnInit {
  pageRoles: Object = {}
  selProjectName: string;
  allProData: any;
  projectid: any;
  allProjectData: any;
  AllProDataPass: any;
  AllProDataFail: any;
  displayAllData = []
  obj: any;
  projectId: any;
  allData: string;
  noData: boolean;
  getAllReleasesVersions: any;
  pageName: any;
  newRole: any;
  newUserId: any;
  newUserName: any;
  selectedProject: any;
  releaseVersionForm: FormGroup;
  tableData:boolean;
  constructor(private dashboardservice: DashboardService, private roles: roleService, private fb: FormBuilder) { }

  ngOnInit() {



    this.pageName = "testCaseReportPage"
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.selectedProject = JSON.parse(this.selectedProject)
    this.tableData = false;
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
    this.dashboardservice.getModuleFields(this.obj)
      .subscribe((data) => {
        this.allProData = data;
        this.projectId = this.allProData.projectId
        console.log(this.projectId)
        this.getAllReleases(this.projectId)
      })
  }
  AllProData: any;

  releasevalidation() {
    this.releaseVersionForm = this.fb.group({
      'releaseVersion': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    });//For release form validation
  }
  searchData(releaseVersion, startDate, endDate) {
    this.tableData = true;
    var element = document.getElementById("heightAuto")
    // element.scrollTop = 0 ; 
    this.allData = ""
    // var a = `${startDate}T00:00:00Z`;
    // var b = `${endDate}T23:59:59Z`;
    var obj = {
      "releaseVersion": releaseVersion,
      "projectId": this.projectId,
      // "startedAt": a,
      // "endedAt": b,
    }
    this.dashboardservice.searcReportData(obj)
      .subscribe((data) => {
        this.AllProData = data;
        console.log(this.AllProData);
        this.displayAllData = this.AllProData;
        this.displayAllData.sort((a, b) => a.testCaseName.localeCompare(b.testCaseName))
        this.displayAll(this.displayAllData)
        this.mycall(this.displayAllData)
      })
  }
  mycall(displayAllData) {
    this.passedArray = [];
    this.failArray = [];
    this.passArray = [];
    this.displayAllData.forEach(ele => {
      console.log(ele)
      this.passedArray.push(parseInt(ele.testCaseCount));
      this.passArray.push(parseInt(ele.pass));
      this.failArray.push(parseInt(ele.fail));
      // this.passedArray.push(parseInt(ele.testCaseCount));
      console.log(this.passedArray)
    });

    var totalExecuted = 0;
    for (let i = 0; i < this.passedArray.length; i++) {
      totalExecuted += this.passedArray[i]
    }
    this.totalExecutedCount = totalExecuted;
    console.log(totalExecuted)
    var totalPass = 0;
    for (let i = 0; i < this.passArray.length; i++) {
      totalPass += this.passArray[i]

    }
    this.totalPassCount = totalPass;
    console.log(totalPass);
    var totalArray = 0;
    for (let i = 0; i < this.failArray.length; i++) {
      totalArray += this.failArray[i]
    }
    this.totalFailCount = totalArray
    console.log(totalArray)

  }
  totalExecutedCount
  totalPassCount;
  totalFailCount
  totalExecuted;
  totalPass;
  totalArray;
  passedArray = [];
  failArray = [];
  passArray = [];
  displayAll(display) {
    this.noData = true;
    console.log("enetrtttttt" + display.length)
    if (display.length == 0) {
      console.log("jjjkkkkk")
      this.allData = "No Data Available";
    }
    else {
      this.noData = false;
    }
  }
  getAllReleases(projectId) {
    var obj = {
      "projectId": projectId
    }
    this.dashboardservice.getAllRelease(obj)
      .subscribe((data) => {
        this.getAllReleasesVersions = data;
        this.getAllReleasesVersions.sort((a, b) => a.releaseVersion.localeCompare(b.releaseVersion))
      })

  }
  permissions = [];
  edit: boolean
  read: boolean
  delete: boolean
  create: boolean;
  disableButton: boolean;

  dataSource: MatTableDataSource<any>;
  executedreports: string[] = ['Sl.No', 'Testcase', 'Executed', 'Pass', 'Fail', 'Pass Percentage'];

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
