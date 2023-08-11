import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-feature-level',
  templateUrl: './feature-level.component.html',
  styleUrls: ['./feature-level.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class FeatureLevelComponent implements OnInit {

  selProjectName: string;
  obj: any;
  allProData: any;
  projectId: any;
  AllProData: any;
  displayAllData: any;
  activateStacked: number;
  dbData: any;
  dbArray = [];
  featureSelected: any;
  moduleNames: string;
  releaseVersion: string;

  constructor(private fb: FormBuilder,private dashboardservice: DashboardService,private router:Router) { }

  ngOnInit() {
    console.log(window.sessionStorage);
    this.moduleNames = localStorage.getItem('moduleName');
    this.releaseVersion = localStorage.getItem('releaseVersion');
    console.log( this.releaseVersion)
    // console.log( this.moduleNames)
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
      this.dashboardservice.releaseVersionn.emit(undefined)
    }
    else if(this.router.url=="/projectdetail/dashboard/detailedreports/modulereports"){
      this.dashboardservice.moduleNamee.emit(undefined)
    }
  }

  fetchSuiteName(featureName){
    localStorage.setItem('featureName', featureName);
    this.dashboardservice.featureNamee.emit(featureName)
  }
  searchData(projectId) {
console.log(projectId)
    // this.router.navigate(['/featurereports']);

    // this.moduleHide = true;
    // this.featureDisplay = false;
    
    // var a = `${startDate}T00:00:00Z`;
    // var b = `${endDate}T23:59:59Z`;
    // alert(this.moduleNames)
    var obj = {
       "releaseVersion": this.releaseVersion,
      // "projectId": projectId,
      "moduleName" : this.moduleNames 
      // "startedAt": a,
      // "endedAt": b,
    }
    this.dashboardservice.searcFeatureLevel(obj)
      .subscribe((data) => {
        this.AllProData = data;
        console.log(this.AllProData.length);
        this.displayAllData = this.AllProData;
        this.displayAllData.sort((a, b) => a.featureName.localeCompare(b.featureName))
        this.charts( this.displayAllData)
        
      })


  }
  dataSource: MatTableDataSource<any>;
  detailedReport: string[] = ['Sl.No', 'Feature','Testcase Count', 'Executed', 'Pass', 'Fail', 'Pass Percentage'];

  charts(x) {
    console.log(x)
   this.activateStacked = 1;
   this.dbData = x;
   console.log(this.dbData)
   var B = [];
   B.push('Feature');
   B.push('Executed');
   B.push('Pass');
   B.push('Fail');
   
   console.log(B)
   this.dbArray.push(B);
   console.log( this.dbArray)
   for (let j = 0; j < this.dbData.length; j++) {
     var A = [];
     A.push(this.dbData[j].featureName);
     A.push(this.dbData[j].executedCount);
     A.push(this.dbData[j].pass);
     A.push(this.dbData[j].fail);
     
     this.dbArray.push(A);
     this.stackedColumnChart.dataTable = this.dbArray;
     console.log(this.dbArray)
     console.log(this.stackedColumnChart.dataTable)

   }

 }

 public stackedColumnChart = {
   chartType: 'ColumnChart',
   
   dataTable: this.dbArray,

   options: {
     width: "100%",
     height: 250,
    //  "displayExactValues": true,
     title: 'Feature Level Graphs',
     legend: { position: 'Top' },
     bar: { groupWidth: '30%' },
     animation: {
      duration: 1000,
      easing: 'out',
      startup: true
    },
    //  isStacked: true,
     vAxis: {
       gridlines: {
         count: 0
       }
     },
     colors: ['orange','green', 'red']
   }
 }
}