import { Component, OnInit } from '@angular/core';
import { DefectDashboardService } from '../../../../core/services/defect-dashboard.service';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { collectExternalReferences } from '@angular/compiler';

@Component({
  selector: 'app-defect-module-level',
  templateUrl: './defect-module-level.component.html',
  styleUrls: ['./defect-module-level.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class DefectModuleLevelComponent implements OnInit {
  prioritymodule: boolean;
  severitymodule: boolean;
  statusmodule: boolean;
  bugWise: string;
  releaseVersion: string;
  allPriorityData: any;
  displayAllData: any;
  activateStacked: number;
  dbData: any;
  dbArray = [];
  selProjectName: string;
  obj: any;
  allProData: any;
  projectId: any;
  displayAllPriorityData: any;
  dbSeverityArray = [];
  allSeverityData: any;
  displayAllSeverityData: any;
  dbSeverityData: any;
  dbStatusArray = [];
  allStatusData: any;
  displayAllStatusData: any;
  dbStatusData: any;

  constructor(private defectdashboardService: DefectDashboardService, private dashboardservice: DashboardService) { }

  ngOnInit() {
    this.dbArray = [];
    this.releaseVersion = localStorage.getItem('releaseVersion');
    this.bugWise = localStorage.getItem('bugWise');
    console.log(this.releaseVersion, this.bugWise)
    this.selProjectName = sessionStorage.getItem('key');
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
        this.search(this.projectId)
        // this.getAllReleases(this.projectId)
      })

  }

  fetchFeatureOnMod(moduleID) {
    // alert(moduleName)
    console.log(moduleID)
    localStorage.setItem('moduleID', moduleID);
  }

  search(projectId) {
    if (this.bugWise == "Priority") {
      console.log("priority")
      this.prioritymoduleGraph()
    }
    else if (this.bugWise == "Severity") {
      this.severitymoduleGraph()
      console.log("Severity")

    }
    else if (this.bugWise == "Status") {
      this.statusmoduleGraph()
      console.log("Status")

    }
    else {
      return alert("No data")
    }
  }

  dataSource: MatTableDataSource<any>;
  priorityReport: string[] = ['Sl.No', 'Module','Total Priority', 'P1', 'P2', 'P3', 'P4'];
  prioritymoduleGraph() {
    console.log(this.projectId)
    this.prioritymodule = true;
    // alert("priority")
    var obj = {
      "releaseVersion": this.releaseVersion,
      "projectId": this.projectId
    }
    this.defectdashboardService.searcPriorityBugs(obj)
      .subscribe((data) => {
        this.allPriorityData = data;
        console.log(this.allPriorityData);
        this.displayAllPriorityData = this.allPriorityData;
        this.prioritycharts(this.displayAllPriorityData)

      })

  }

  prioritycharts(x) {
    console.log(x)
    this.activateStacked = 1;
    this.dbData = x;
    console.log(this.dbData)
    var B = [];
    B.push('Modules');
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


      A.push(this.dbData[j].moduleName);
      A.push(this.dbData[j].totalPriority);
      A.push(this.dbData[j].P1);
      A.push(this.dbData[j].P2);
      A.push(this.dbData[j].P3);
      A.push(this.dbData[j].P4);

      this.dbArray.push(A);
      this.priorityColumnChart.dataTable = this.dbArray;
      console.log(this.dbArray)
      console.log(this.priorityColumnChart.dataTable)

    }

  }

  public priorityColumnChart = {
    chartType: 'ColumnChart',
    dataTable: this.dbArray,
    options: {
      width: "100%",
      height: 250,
      //  "displayExactValues": true,
      title: 'Module Level Priority Graphs',
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
  severityReport: string[] = ['Sl.No', 'Module','Total Severity', 'Blocker', 'Critical', 'Major', 'Minor','Normal','Trivial','Enhancement'];

  severitymoduleGraph() {
    // alert("severity")
    this.severitymodule = true;
    console.log(this.projectId)

    var obj = {
      "releaseVersion": this.releaseVersion,
      "projectId": this.projectId
    }
    this.defectdashboardService.searhSeverityBugs(obj)
      .subscribe((data) => {
        this.allSeverityData = data;
        console.log(this.allSeverityData);
        this.displayAllSeverityData = this.allSeverityData;
        this.SeverityDatacharts(this.displayAllSeverityData)

      })
  }

  SeverityDatacharts(x) {
    console.log(x)
    this.activateStacked = 1;
    this.dbSeverityData = x;
    console.log(this.dbSeverityData)
    var B = [];
    B.push('Modules');
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


      A.push(this.dbSeverityData[j].moduleName);
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
      title: 'Module Level Severity Graphs',
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

  statusReport: string[] = ['Sl.No', 'Module','Total Status', 'Open', 'Fixed','Ready for testing','Closed','Reopen'];

  statusmoduleGraph() {
    this.statusmodule = true;
    console.log(this.projectId)

    var obj = {
      "releaseVersion": this.releaseVersion,
      "projectId": this.projectId
    }
    this.defectdashboardService.searhStatusBugs(obj)
      .subscribe((data) => {
        this.allStatusData = data;
        console.log(this.allStatusData);
        this.displayAllStatusData = this.allStatusData;
        this.statusDatacharts(this.displayAllStatusData)

      })

  }

  statusDatacharts(x) {
    console.log(x)
    this.activateStacked = 1;
    this.dbStatusData = x;
    console.log(this.dbStatusData)
    var B = [];
    B.push('Modules');
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


      A.push(this.dbStatusData[j].moduleName);
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
      title: 'Module Level Status Graphs',
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
