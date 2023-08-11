import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-module-level',
  templateUrl: './module-level.component.html',
  styleUrls: ['./module-level.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class ModuleLevelComponent implements OnInit {
  selProjectName: string;
  obj: any;
  allProData: any;
  projectId: any;
  AllProData: any;
  displayAllData: any;
  activateStacked: number;
  dbData: any;
  dbArray = [];
  selectedModule: any;
  getAllReleasesVersions: any;
  releaseVersion: string;

  constructor(private fb: FormBuilder, private dashboardservice: DashboardService, private router: Router) { }

  ngOnInit() {
    console.log(window.sessionStorage);
    this.releaseVersion = localStorage.getItem('releaseVersion');
    console.log(this.releaseVersion)
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
        this.searchData(this.projectId)
        this.getAllReleases(this.projectId)
      })

    this.dbArray = [];
  }

  ngOnDestroy() {
    if (this.router.url == "/projectdetail/dashboard/detailedreports") {
      this.dashboardservice.releaseVersionn.emit(undefined)
    }
  }

  fetchFeatureOnMod(moduleName) {
    // alert(moduleName)
    console.log(moduleName)
    localStorage.setItem('moduleName', moduleName);
    this.dashboardservice.moduleNamee.emit(moduleName)
  }

  // fn = function() {
  //   console.log('hello');
  // };

  searchData(projectId) {
    console.log(projectId)
    // this.router.navigate(['/featurereports']);

    // this.moduleHide = true;
    // this.featureDisplay = false;

    // var a = `${startDate}T00:00:00Z`;
    // var b = `${endDate}T23:59:59Z`;
    var obj = {
      "releaseVersion": this.releaseVersion,
      // "projectId": projectId,
      // "startedAt": a,
      // "endedAt": b,
    }
    this.dashboardservice.searcModuelLevel(obj)
      .subscribe((data) => {
        this.AllProData = data;
        console.log(this.AllProData);
        this.displayAllData = this.AllProData;
        this.displayAllData.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
        this.charts(this.displayAllData)

      })
  }
  dataSource: MatTableDataSource<any>;
  detailedReport: string[] = ['Sl.No', 'Module', 'Testcase Count', 'Executed', 'Pass', 'Fail', 'Pass Percentage'];
  charts(x) {
    console.log(x)
    this.activateStacked = 1;
    this.dbData = x;
    console.log(this.dbData)
    var B = [];
    B.push('Modules');
    B.push('Executed');
    B.push('Pass');
    B.push('Fail');

    console.log(B)
    this.dbArray.push(B);
    console.log(this.dbArray)
    for (let j = 0; j < this.dbData.length; j++) {
      var A = [];


      A.push(this.dbData[j].moduleName);
      A.push(this.dbData[j].executedCount);
      A.push(this.dbData[j].pass);
      A.push(this.dbData[j].fail);

      this.dbArray.push(A);
      this.stackedColumnChart.dataTable = this.dbArray;
      console.log(this.dbArray)
      console.log(this.stackedColumnChart.dataTable)

    }

  }
  getAllReleases(projectId) {
    var obj = {
      "projectId": projectId
    }
    this.dashboardservice.getAllRelease(obj)
      .subscribe((data) => {
        console.log(data);
        this.getAllReleasesVersions = data;

      })

  }

  public stackedColumnChart = {
    chartType: 'ColumnChart',

    dataTable: this.dbArray,

    options: {
      width: "100%",
      height: 250,
      //  "displayExactValues": true,
      title: 'Module Level Graphs',
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
      colors: ['orange', 'green', 'red']
    }
  }

}
