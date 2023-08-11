import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DefectDashboardService } from '../../../../core/services/defect-dashboard.service';

@Component({
  selector: 'app-defect-feature-level',
  templateUrl: './defect-feature-level.component.html',
  styleUrls: ['./defect-feature-level.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class DefectFeatureLevelComponent implements OnInit {
  selProjectName: string;
  obj: any;
  allProData: any;
  projectId: any;
  moduleID: string;
  bugWise: string;
  priorityFeature: boolean;
  severityFeature: boolean;
  statusFeature: boolean;
  releaseVersion: string;
  allPriorityFeature: any;
  displayAllPriorityFeature: any;
  activateStacked: number;
  dbData: any;
  dbArray = [];

  dbSeverityArray= []
  allSeverityFeature: any;
  displayAllSeverityFeature: any;
  dbSeverityData: any;

  dbStatusArray =[]
  allStatusFeature: any;
  displayAllStatusFeature: any;
  dbStatusData: any;

  constructor(private defectdashboardService: DefectDashboardService, private dashboardservice: DashboardService) { }

  ngOnInit() {
    this.releaseVersion = localStorage.getItem('releaseVersion');
    this.selProjectName = sessionStorage.getItem('key');
    this.moduleID = localStorage.getItem('moduleID');
    this.bugWise = localStorage.getItem('bugWise');
    console.log(this.moduleID)
    sessionStorage.setItem('moduleName', null);
    this.obj = {
      "projectSelection": this.selProjectName
    }
    // console.log(this.selProjectName)
    this.dashboardservice.getModuleFields(this.obj)
      .subscribe((data) => {
        this.allProData = data;
        this.projectId = this.allProData.projectId
        console.log(this.projectId)
        this.searchFeature(this.projectId)
        // this.getAllReleases(this.projectId)
      })
  }

  searchFeature(projectId) {
    if (this.bugWise == "Priority") {
      this.priorityFeatureGraph()
    }
    else if (this.bugWise == "Severity") {
      this.severityFeatureGraph()
    }
    else if (this.bugWise == "Status") {
      this.statusFeatureGraph()
    }
    else {
      return alert("No data")
    }
  }

  dataSource: MatTableDataSource<any>;
  featurePriorityReport: string[] = ['Sl.No', 'Feature','Total Priority', 'P1', 'P2', 'P3', 'P4'];

  priorityFeatureGraph(){
    // alert("priority")
    this.priorityFeature = true;
    var obj = {
      "releaseVersion": this.releaseVersion,
      "projectId": this.projectId,
      "moduleID" :  this.moduleID
    }
    this.defectdashboardService.searcPriorityFeatureBugs(obj)
      .subscribe((data) => {
        this.allPriorityFeature = data;
        console.log(this.allPriorityFeature);
        this.displayAllPriorityFeature = this.allPriorityFeature;
        this.priorityFeaturecharts(this.displayAllPriorityFeature)

      })

  }

  priorityFeaturecharts(x) {
    console.log(x)
    this.activateStacked = 1;
    this.dbData = x;
    console.log(this.dbData)
    var B = [];
    B.push('Feature');
    B.push('TotalPriority');
    B.push('P1');
    B.push('P2');
    B.push('P3');
    B.push('P4');

    console.log(B)
    this.dbArray.push(B);
    console.log(this.dbArray)
    for (let j = 0; j < this.dbData.length; j++) {
      var A = [];


      A.push(this.dbData[j].featureName);
      A.push(this.dbData[j].totalPriority);
      A.push(this.dbData[j].P1);
      A.push(this.dbData[j].P2);
      A.push(this.dbData[j].P3);
      A.push(this.dbData[j].P4);

      this.dbArray.push(A);
      this.priorityFeatureColumnChart.dataTable = this.dbArray;
      console.log(this.dbArray)
      console.log(this.priorityFeatureColumnChart.dataTable)

    }

  }

  public priorityFeatureColumnChart = {
    chartType: 'ColumnChart',

    dataTable: this.dbArray,

    options: {
      width: "100%",
      height: 250,
      //  "displayExactValues": true,
      title: 'Feature Level Priority Bugs Graphs',
      legend: { position: 'Top' },
      bar: { groupWidth: '40%' },
      animation: {
        duration: 3000,
        easing: 'out',
        startup: true
      },
      //  isStacked: true,
      vAxis: {
        gridlines: {
          count: 0,
        }
      },
      //  colors: ['blue','#00FF00', '#FF5722'],
      colors: ['#5DADE2', '#00CC66', 'red', 'blue', 'magenta', 'slateblue']
    }
  }
  FeatureseverityReport: string[] = ['Sl.No', 'Feature','Total Severity', 'Blocker', 'Critical', 'Major', 'Minor','Normal','Trivial','Enhancement'];

  severityFeatureGraph(){
    this.severityFeature = true;
    var obj = {
      "releaseVersion": this.releaseVersion,
      "projectId": this.projectId,
      "moduleId" :  this.moduleID
    }
    this.defectdashboardService.searchSeverityFeatureBugs(obj)
      .subscribe((data) => {
        this.allSeverityFeature = data;
        console.log(this.allSeverityFeature);
        this.displayAllSeverityFeature = this.allSeverityFeature;
        this.severityFeaturecharts(this.displayAllSeverityFeature)

      })
  }
    severityFeaturecharts(x) {
      console.log(x)
      this.activateStacked = 1;
      this.dbSeverityData = x;
      console.log(this.dbSeverityData)
      var B = [];
      B.push('Feature');
      B.push('TotalSeverity');
      B.push('Blocker');
      B.push('Critical');
      B.push('Major');
      B.push('Minor');
      B.push('Normal');
      B.push('Trivial');
      B.push('Enhancement');
  
      console.log(B)
      this.dbSeverityArray.push(B);
      console.log(this.dbSeverityArray)
      for (let j = 0; j < this.dbSeverityData.length; j++) {
        var A = [];
  
  
        A.push(this.dbSeverityData[j].featureName);
        A.push(this.dbSeverityData[j].totalSeverity);
        A.push(this.dbSeverityData[j].Blocker);
        A.push(this.dbSeverityData[j].Critical);
        A.push(this.dbSeverityData[j].Major);
        A.push(this.dbSeverityData[j].Minor);
        A.push(this.dbSeverityData[j].Normal);
        A.push(this.dbSeverityData[j].Trivial);
        A.push(this.dbSeverityData[j].Enhancement);
  
        this.dbSeverityArray.push(A);
        this.severityColumnChart.dataTable = this.dbSeverityArray;
        console.log(this.dbSeverityArray)
        console.log(this.severityColumnChart.dataTable)
  
      }
  
    }
  
    public severityColumnChart = {
      chartType: 'ColumnChart',
      dataTable: this.dbSeverityArray,
      options: {
        width: "100%",
        height: 250,
        //  "displayExactValues": true,
        title: 'Feature Level Severity Graphs',
        legend: { position: 'Top' },
        bar: { groupWidth: '40%' },
        animation: {
          duration: 3000,
          easing: 'out',
          startup: true
        },
        //  isStacked: true,
        vAxis: {
          gridlines: {
            count: 0,
          }
        },
        //  colors: ['blue','#00FF00', '#FF5722'],
        colors: ['#5DADE2', '#00CC66', 'red', 'blue', 'magenta', 'slateblue','Olive','black']
      }
    }

  featureStatusReport: string[] = ['Sl.No', 'Feature','Total Status', 'Open', 'Fixed','Ready for testing','Closed','Reopen'];

  statusFeatureGraph(){
    this.statusFeature = true;
    var obj = {
      "releaseVersion": this.releaseVersion,
      "projectId": this.projectId,
      "moduleId" :  this.moduleID
    }
    this.defectdashboardService.searchStatusFeatureBugs(obj)
      .subscribe((data) => {
        this.allStatusFeature = data;
        console.log(this.allStatusFeature);
        this.displayAllStatusFeature = this.allStatusFeature;
        this.statusFeaturecharts(this.displayAllStatusFeature)

      })
  }
  statusFeaturecharts(x) {
    console.log(x)
    this.activateStacked = 1;
    this.dbStatusData = x;
    console.log(this.dbStatusData)
    var B = [];
    B.push('Feature');
    B.push('TotalStatus');
    B.push('Open');
    B.push('Fixed');
    B.push('Ready For Testing');
    B.push('Closed');
    B.push('Reopen');

    console.log(B)
    this.dbStatusArray.push(B);
    console.log(this.dbStatusArray)
    for (let j = 0; j < this.dbStatusData.length; j++) {
      var A = [];


      A.push(this.dbStatusData[j].featureName);
      A.push(this.dbStatusData[j].totalStatus);
      A.push(this.dbStatusData[j].open);
      A.push(this.dbStatusData[j].fixed);
      A.push(this.dbStatusData[j].readyForTesting);
      A.push(this.dbStatusData[j].closed);
      A.push(this.dbStatusData[j].reopen);

      this.dbStatusArray.push(A);
      this.statusColumnChart.dataTable = this.dbStatusArray;
      console.log(this.dbStatusArray)
      console.log(this.statusColumnChart.dataTable)

    }

  }

  public statusColumnChart = {
    chartType: 'ColumnChart',
    dataTable: this.dbStatusArray,
    options: {
      width: "100%",
      height: 250,
      //  "displayExactValues": true,
      title: 'Feature Level Status Graphs',
      legend: { position: 'Top' },
      bar: { groupWidth: '40%' },
      animation: {
        duration: 3000,
        easing: 'out',
        startup: true
      },
      //  isStacked: true,
      vAxis: {
        gridlines: {
          count: 0,
        }
      },
      //  colors: ['blue','#00FF00', '#FF5722'],
      colors: ['#5DADE2', '#00CC66', 'red', 'blue', 'magenta', 'slateblue']
    }
  }

}
