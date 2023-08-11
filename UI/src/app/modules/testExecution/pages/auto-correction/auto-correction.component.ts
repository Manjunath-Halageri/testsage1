import { Component, OnInit } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { Post } from '../../../../post';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { ProjectSelectionServiceComponent } from '../../../../core/services/projectSelection.service';
//import { ProjectSelectionServiceComponent } from 'src/app/core/services/projectSelection.service';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { AutoCorrectionService } from '../../../../core/services/auto-correction.service';
import { roleService } from '../../../../core/services/roleService';
//import { ProjectDetailServiceComponent } from 'src/app/core/services/pDetail.service';
@Component({
  selector: 'app-auto-correction',
  templateUrl: './auto-correction.component.html',
  styleUrls: ['./auto-correction.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [apiServiceComponent,roleService],
})
export class AutoCorrectionComponent implements OnInit {

  runArray: Post[];
  passedData: Post[];
  completeData: any;
  selectedArray1: any[];
  scriptName: any;
  DisplayData = []
  mergedResult: any;
  mergeStatus: string;
  projectDetails: any;
  spid: any;
  selectedProject: any;
  run:any;
  merge:any;
  pageName: string;
  newRole: string;
  newUserId: string;
  newUserName: string;
  pageRoles: { };
  constructor(private api: apiServiceComponent,
    //  private http: Http,
     private autocorrection: AutoCorrectionService,
     private roles: roleService) { }

  ngOnInit() {
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.selectedProject = JSON.parse(this.selectedProject)
    this.spid = this.selectedProject.projectId
    console.log(this.selectedProject)
    console.log(this.selectedProject.projectName)
    console.log(this.selectedProject.projectId)
    // alert(this.spid)
    console.log(this.spid)
    this.fetchExceptionSuites();
    this.pageName = "autoCorrectionPage"
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    this.pageRoles = {
      pageName: this.pageName,
      roleName: this.newRole,
      userId: this.newUserId,
      userName: this.newUserName
  }
  this.getRolesPermissions();
  }

  permissions = [];
  edit: boolean
  read: boolean
  deletePage: boolean
  create: boolean;
  getRolesPermissions() {
      this.roles.getPermissions(this.pageRoles).subscribe(
          Data => {
              this.permissions = Data; console.log(this.permissions);
              this.edit = this.permissions[0].edit;
              this.read = this.permissions[0].read
              this.deletePage = this.permissions[0].delete
              this.create = this.permissions[0].create
              console.log(this.permissions);
          })
  }

  fetchExceptionSuites() {
    this.autocorrection.fetchExceptionSuites(this.spid).subscribe(res => {
      console.log(res)
      this.displayModuleForTree = res;
    })
  }
  openMenuData(a, b) {
    this.mergeStatus='';
    console.log(b.label)
    this.merge=false;
    this.getScripts(b.label)
  }

  displayModuleForTree = [];
  items: { label: string; command: (event: any) => void; }[];
  async nodeSelect(file) {
    if (file.node != undefined) {

      if (file.node.data == "release") {
        // this.pageName = file.node.label;
        for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
          if (file.node.label === this.displayModuleForTree[index]['label']) {
            break;
          }

        }   //   this.openFMenu(this.pageName);
        this.items = [
          // { label: 'Edit Release', command: (event) => this.editSelectedRelease(file.node.label) },
          // { label: 'Edit', command: (event) => this.editPage1() }

        ];
      }

    }
  }

  showTableData: boolean;
  getScripts(run) {
    this.showTableData = true;
    this.autocorrection.fetchFixedScripts(run).subscribe(passedResult => {
      console.log(passedResult)
      if (passedResult == undefined) {
        console.log("errror")
      }
      else {
        this.completeData = passedResult.passed;
        this.completeData.exeptionObjectData = passedResult.exeptionObjectData;
        this.completeData.forEach(function (e) {
          e['checkStatus'] = ''
        })
        this.fecthDataToTable(this.completeData)
      }
    })
  }

  completeDisplayData1 = [];
  fecthDataToTable(data) {
    console.log("for arranging the data for the table");
    console.log(data);
    let exceptionReason = data.exeptionObjectData
    console.log(data.exeptionObjectData)
    var DisplayData1 = []
    data.forEach(function (d, dindex, darray) {
      data[0].exceptionDetails.forEach(function (e, eindex, earray) {
        console.log(data[0].Testcase)
        if (d.Testcase === e.scriptName) {
          var maindata = {
            'scriptName': e.scriptName,
            'failReason': e.exceptionName,
            'solution': "Id = " + " " + exceptionReason.correctValue + " " + "has changed",
            'objectId': exceptionReason.objectName
          }
          DisplayData1.push(maindata);
        }
      })
    })
    this.passedData = DisplayData1;

  }

  selectedScript(selected, index, data) {
    this.merge=selected;
    console.log(this.merge)
    this.completeData.forEach(function (e, eindex) {
      data.forEach(function (f, findex) {
        if (e.Testcase == f.scriptName) {
          e['checkStatus'] = selected;
        }
      })
    })
    console.log(data)
  }

  mergeScripts() {
    console.log(this.merge)
    // alert("clicked to merge the scripts back to the the project and suite level's");
    if(!this.merge){
      alert('Please check the checkbox to merge')
      return
    }
    console.log(this.completeData)
    this.mergeStatus = 'Please wait....';
    this.autocorrection.mergeScripts(this.completeData).subscribe(result => {
      this.mergedResult = result;
     
      if (this.mergedResult == true) {
        this.mergeStatus = 'Completed the merging';
      }
      else {
        this.mergeStatus = 'Failed to merge';
      }
    })
  }



}
