import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-script-level',
  templateUrl: './script-level.component.html',
  styleUrls: ['./script-level.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class ScriptLevelComponent implements OnInit {
  selProjectName: string;
  obj: any;
  allProData: any;
  projectId: any;
  dbArray: any[];
  AllProData: any;
  displayAllData: any;
  featureName: string;
  releaseVersion: string;

  constructor(private fb: FormBuilder,private dashboardservice: DashboardService,private router:Router) { }

  ngOnInit() {
    this.featureName = localStorage.getItem('featureName');
    console.log( this.featureName)
    this.releaseVersion = localStorage.getItem('releaseVersion');
    console.log( this.releaseVersion)
    console.log(window.sessionStorage);
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
            this.searchData(this.projectId)
         })
         
         this.dbArray = [];
  }

  ngOnDestroy() {
    if(this.router.url=="/projectdetail/dashboard/detailedreports") {
      this.dashboardservice.moduleNamee.emit(undefined)
      this.dashboardservice.featureNamee.emit(undefined)
      this.dashboardservice.releaseVersionn.emit(undefined)
    }
    else if(this.router.url=="/projectdetail/dashboard/detailedreports/modulereports"){
      this.dashboardservice.moduleNamee.emit(undefined)
      this.dashboardservice.featureNamee.emit(undefined)
    }
    else if(this.router.url=="/projectdetail/dashboard/detailedreports/modulereports/featurereports"){
      this.dashboardservice.featureNamee.emit(undefined)
    }
  }

  dataSource: MatTableDataSource<any>;
  detailedReport: string[] = ['Sl.No', 'Testcase', 'Executed', 'Pass', 'Fail', 'Pass Percentage'];

  searchData(projectId) {
console.log(projectId)
    // this.router.navigate(['/featurereports']);

    // this.moduleHide = true;
    // this.featureDisplay = false;
    
    // var a = `${startDate}T00:00:00Z`;
    // var b = `${endDate}T23:59:59Z`;
    console.log(this.featureName)
    var obj = {
      "releaseVersion": this.releaseVersion,
      // "projectId": this.releaseVersion,
      "featureName" :  this.featureName
      // "startedAt": a,
      // "endedAt": b,
    }
    console.log(obj)
    this.dashboardservice.searcSuiteLevel(obj)
      .subscribe((data) => {
        this.AllProData = data;
        console.log(this.AllProData);
        this.displayAllData = this.AllProData;
        this.displayAllData.sort((a, b) => a.testcaseName.localeCompare(b.testcaseName))
      })
  }

}
