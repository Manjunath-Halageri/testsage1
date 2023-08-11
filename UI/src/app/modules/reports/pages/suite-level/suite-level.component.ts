import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ChartReadyEvent, ChartErrorEvent, ChartSelectEvent,
  ChartMouseOverEvent, ChartMouseOutEvent
} from 'ng2-google-charts';

import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
// import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { Post } from '../../../../post';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { GraphReportService } from '../../../../core/services/graph-report.service';
import { ProjectSelectionServiceComponent } from '../../../../core/services/projectSelection.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { CreateService } from '../../../../core/services/release-create.service';
import { ExecutionService } from '../../../../core/services/execution.service';
import { MatTableDataSource } from '@angular/material/table';
import { I } from '@angular/cdk/keycodes';
import { DialogService } from '../../../../core/services/dialog.service';


declare var $: any;
declare var google: any;

@Component({
  selector: 'app-suite-level',
  templateUrl: './suite-level.component.html',
  styleUrls: ['./suite-level.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [ProjectDetailServiceComponent, ExecutionService, apiServiceComponent, GraphReportService, ProjectSelectionServiceComponent]
})
export class SuitelevelComponent implements OnInit, OnDestroy {

  projectName: any;
  project1: any;
  suites: any;
  dbData: any;
  dbArray = [];
  fromDate: any;
  toDate: any;
  suiteName: any;
  pID: any;
  pieArray = [];
  activatePie = 0;
  pieTotalCount = [];
  dateWiseData: any;
  suiteData: any;
  navSuite: any;
  navModule: any
  executedAt: any;
  totalScripts: any;
  totalPass: any;
  totalFail: any;
  totalSkipped: any;
  moduleLevel1: any;
  activateStacked: any;
  run: any;
  moduleDataDisplay = [];
  newPieArray = [];
  selectedModule: any;
  reportNumbers: Post[];
  title: Post[];
  specificResult: Post[];
  moduleLevel: Post[];
  Charts: any;
  selected: any;
  newSchedules = []
  scheduleDisplay: boolean;
  Manual: any;
  Automation: any;
  exceptionOption: any;
  fromBackPage: any;
  pageActiveStatus: any;
  selectedRunCount: string;
  selectedDatesData: string;
  fDate: any;
  tDate: any;
  manual: string;
  previousSuite: string;
  selectedRun: any;
  previousExcepOption: any;
  newSelected: any;
  selectedScheduleName: any;
  nodata: boolean;
  manualReportFetch: any;
  manualExeReportData: any;
  manualActive: number;
  releaseSelected: any;
  activeReleaseVer: any;
  selectedProject: any;
  projectidRelease: any;
  runRouter: any;
  NewFromDate: any;
  NewToDate: any;
  ModuleName: any;
  module: string;

  releaseclicked: boolean = false;
  executedBy: any;
  timing: string;
  reportNumber: any;
  radioValues: any;
  constructor(private router: Router,
    private data5: ProjectDetailServiceComponent, private api: apiServiceComponent, private graphreport: GraphReportService,
    private pSelection: ProjectSelectionServiceComponent, private executionService: ExecutionService,
    private CreateService: CreateService, private dialogService: DialogService,) {

  }

  ngOnInit() {
    // window.sessionStorage.setItem('pageStatus',JSON.stringify(false));
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.selectedProject = JSON.parse(this.selectedProject)
    this.projectidRelease = this.selectedProject.projectId;
    let runNumber = JSON.parse(sessionStorage.getItem('executedRunNum'))
    this.runRouter = JSON.parse(sessionStorage.getItem('reportStatus'))
    let runRoute = this.runRouter
    let routeProjectId = this.projectidRelease
    this.routeRun(runNumber, routeProjectId, runRoute);

    /// this.suiteName = JSON.parse(sessionStorage.getItem('suite'));
    /*this.fromDate = '';
    this.toDate = '';
    this.suiteName = '';
    this.executedAt = '';
    this.run = '';
    this.selectedModule = '';
    this.navSuite = 0;
    this.navModule = 0;
    this.activateStacked = 0;
    var reportNumbers;
    //this.scheduleDisplay = false
    this.pieArray = [];
    this.dbArray = [];*/
    this.releaseSelected = "Select Release"

    // this.pSelection.getprojectId(this.projectName).subscribe(result => {
    //   this.pID = result;
    //   console.log(this.pID)
    // });
    this.projectName = this.data5.selectedProject();
    this.selected = sessionStorage.getItem('tabs')
    this.graphreport.getprojectId(this.projectName).subscribe(result => {
      console.log(result)
      this.pID = result;

    })
    console.log(this.router.url)
    //this.clearReports();
    this.newSelected = window.sessionStorage.getItem('selectedRunCount');
    window.sessionStorage.setItem('newRun', this.newSelected);
    this.pageActiveStatus = JSON.parse(window.sessionStorage.getItem('pageStatus'));
    if (this.pageActiveStatus == true) {
      this.getBackData()
    } else {
      this.fromDate = '';
      this.toDate = '';
      this.suiteName = '';
      this.executedAt = '';
      this.run = '';
      this.selectedModule = '';
      this.navSuite = 0;
      this.navModule = 0;
      this.activateStacked = 0;
      var reportNumbers;
      //this.scheduleDisplay = false
      this.pieArray = [];
      this.dbArray = [];
      this.reportNumber = '';
    }

    this.getReleaseVersion()
  }
  ngOnDestroy() {
    // clearReports(){
    console.log("ENTERED into ngOnDestroy", this.router.url)
    if (this.router.url != "/projectdetail/reports/suitelevel" && this.router.url != "/projectdetail/reports/suitelevel/featurelevel" &&
      this.router.url != "/projectdetail/reports/suitelevel/featurelevel/scriptlevel" && this.router.url != "/projectdetail/reports/suitelevel/featurelevel/scriptlevel/steplevel") {
      console.log("ENTERED into IFF", this.router.url)
      this.fromDate = '';
      this.toDate = '';
      this.suiteName = '';
      this.executedAt = '';
      this.run = '';
      this.selectedModule = '';
      this.navSuite = 0;
      this.navModule = 0;
      this.activateStacked = 0;
      var reportNumbers;
      //this.scheduleDisplay = false
      this.pieArray = [];
      this.dbArray = [];
      this.exceptionOption, this.previousExcepOption = false;
      window.sessionStorage.setItem('exceptionOption', JSON.stringify(false));
      window.sessionStorage.setItem('previousexcepOption', JSON.stringify(false));
      window.sessionStorage.removeItem('runType');
      window.sessionStorage.removeItem('tabs');
      window.sessionStorage.removeItem('executedRunNum');
      window.sessionStorage.removeItem('pageStatus');
      this.reportNumber = '';
    }
    //}
  }


  getReleaseVersion() {
    this.graphreport.getAllReleaseVer(this.projectidRelease)
      .subscribe(data => {
        console.log(data)
        this.activeReleaseVer = data;
        this.activeReleaseVer.sort((a, b) => a.releaseVersion.localeCompare(b.releaseVersion))
      })
  }

  selectedSchedule(sName) {
    // alert(sName);
    this.selectedScheduleName = sName;
  }

  selectedRelease(releaseversion) {
    this.releaseSelected = releaseversion
    console.log(this.releaseSelected)

  }
  getBackData() {
    console.log(window.sessionStorage.getItem('fDate'), window.sessionStorage.getItem('tDate'))
    //alert("sssssssss")
    this.navSuite = 1;
    this.pieArray = [];
    this.dbArray = [];
    this.run = "";
    this.selectedRunCount = window.sessionStorage.getItem('selectedRunCount');
    this.suiteName = sessionStorage.getItem('suite');
    var newRun = this.selectedRunCount.split('_');
    if (this.selectedRunCount == '') {
      this.selectedRunCount = window.sessionStorage.getItem("run");
    }
    console.log(this.selectedRunCount);

    this.executedAt = window.sessionStorage.getItem('timing');
    this.previousExcepOption = JSON.parse(window.sessionStorage.getItem('previousexcepOption'));
    this.exceptionOption = JSON.parse(window.sessionStorage.getItem('exceptionOption'));
    console.log(this.exceptionOption, this.previousExcepOption)
    var datesData = {
      'fDate': this.fromDate,
      'tDate': this.toDate,
      'manual': this.manual,
      'schedule': this.scheduleDisplay
    }
    if (this.previousExcepOption == false) {
      this.run = window.sessionStorage.getItem("run");
      window.sessionStorage.setItem('newRun', null);
      var fetchModule = {
        'pId': this.pID,
        'suiteName': this.suiteName,
        'startedAt': this.executedAt,
        "Run": this.run
      }

      var fetchObject = {
        'run': this.run,
        "exceptionOption": this.previousExcepOption
      }
      console.log(this.exceptionOption, this.previousExcepOption)
      console.log(fetchModule)
      console.log(fetchObject)
      this.graphreport.fetchReportNumbers(fetchObject).subscribe(
        reportNumbers => {
          // this.reportNumbers=reportNumbers
          console.log(reportNumbers, Object.keys(reportNumbers).length)
          this.executedBy = reportNumbers.executedBy;
          this.reportNumbers = reportNumbers.completeNumbers;
          console.log(this.executedBy, this.reportNumbers)
          let x = this.reportNumbers
          var y = x.filter((v, i) => x.indexOf(v) === i)
          console.log(y);
          this.title = y;
          this.pieChart = Object.create(this.pieChart);
        })

      this.graphreport.fetchModules(fetchModule).subscribe(
        mData => {
          this.moduleLevel = mData;
          this.reuseModule(this.moduleLevel)
        });
      window.sessionStorage.removeItem('runType');
    }
    else {

      this.getClicked(this.selectedRunCount)
      var fetchReportObject = {
        'run': newRun[0],
        "exceptionOption": this.previousExcepOption
      }

      let fetchModule = {
        "Run": this.selectedRun
      }


      this.graphreport.fetchReportNumbers(fetchReportObject).subscribe(
        reportNumbers => {
          console.log(reportNumbers, Object.keys(reportNumbers).length)
          this.executedBy = reportNumbers.executedBy;
          this.reportNumbers = reportNumbers.completeNumbers;
          console.log(this.executedBy, this.reportNumbers)
          // this.reportNumbers = reportNumbers;
          let x = this.reportNumbers
          var y = x.filter((v, i) => x.indexOf(v) === i)
          this.title = y;
          console.log(this.title);
          this.pieChart = Object.create(this.pieChart);
        })

    }

  }

  // featurelevel() {
  //   this.router.navigate(['featurelevel']);
  // }
  checked() {
    //  alert("schedule")
    console.log("Schedule")
    this.fetchSchedule(this.pID)
    this.manualReportFetch = false;
    this.Manual = false;
    this.scheduleDisplay = true;
    this.jenkinsDisplay = false;
    this.Automation = false;
    window.sessionStorage.setItem('manualAutomation', JSON.stringify(this.manualReportFetch));
    window.sessionStorage.setItem('manual', this.Manual);
    window.sessionStorage.setItem("schedule", JSON.stringify(this.scheduleDisplay));
    window.sessionStorage.setItem('pageStatus', null);
    window.sessionStorage.setItem('selectedRunCount', null);
    window.sessionStorage.setItem('selectedtime', null);
    window.sessionStorage.setItem('newRun', null);
    window.sessionStorage.setItem('moduleName', null);
    window.sessionStorage.setItem('manualAutomation', this.manualReportFetch);
    window.sessionStorage.setItem('Automation', this.Automation);
    this.ngOnInit();
    this.scheduleDisplay = true;
    this.pieArray = [];
    this.dbArray = [];

    // if (this.scheduleDisplay == true) {
    //   this.fetchSchedule()
    // }
  }
  jenkinsDisplay: any;
  jenkinsChecked(e) {
    // console.log(e)
    // console.log(e.value)
    // if(e.target.checked)
    console.log("jenkinsChecked")
    this.scheduleDisplay = false;
    this.jenkinsDisplay = true;
    this.Automation = false;
    this.Manual = false;
    this.newSchedules = [];

    this.manualReportFetch = false;

    window.sessionStorage.setItem('manualAutomation', JSON.stringify(this.manualReportFetch));
    window.sessionStorage.setItem('manual', this.Manual);
    window.sessionStorage.setItem("schedule", JSON.stringify(this.scheduleDisplay));
    window.sessionStorage.setItem('pageStatus', null);
    window.sessionStorage.setItem('selectedRunCount', null);
    window.sessionStorage.setItem('selectedtime', null);
    window.sessionStorage.setItem('newRun', null);
    window.sessionStorage.setItem('manualAutomation', this.manualReportFetch);
    window.sessionStorage.setItem('Automation', this.Automation);
    this.ngOnInit();
  }
  unChecked() {
    //  alert("manual")
    console.log("Automation")
    this.newSchedules = [];
    this.Automation = true;
    this.Manual = false;
    this.scheduleDisplay = false;
    this.manualReportFetch = false;
    this.jenkinsDisplay = false;
    window.sessionStorage.setItem('manualAutomation', JSON.stringify(this.manualReportFetch));
    window.sessionStorage.setItem('manual', this.Manual);
    window.sessionStorage.setItem("schedule", JSON.stringify(this.scheduleDisplay));
    window.sessionStorage.setItem('pageStatus', null);
    window.sessionStorage.setItem('selectedRunCount', null);
    window.sessionStorage.setItem('selectedtime', null);
    window.sessionStorage.setItem('newRun', null);
    window.sessionStorage.setItem('manualAutomation', this.manualReportFetch);
    window.sessionStorage.setItem('Automation', this.Automation);
    this.ngOnInit();
  }

  manualReport() {
    // alert('3')
    console.log("manualReport")
    this.newSchedules = [];
    this.Manual = true;
    this.manualReportFetch = true;
    this.manualActive = 1;
    this.jenkinsDisplay = false;
    this.Automation = false;
    window.sessionStorage.setItem('manualAutomation', JSON.stringify(this.manualReportFetch));
    this.scheduleDisplay = false;
    window.sessionStorage.setItem('manual', JSON.stringify(this.manualReportFetch));
    window.sessionStorage.setItem("schedule", JSON.stringify(this.scheduleDisplay));
    window.sessionStorage.setItem('pageStatus', null);
    window.sessionStorage.setItem('selectedRunCount', null);
    window.sessionStorage.setItem('selectedtime', null);
    window.sessionStorage.setItem('newRun', null);
    window.sessionStorage.setItem('Automation', this.Automation);
    this.ngOnInit();

  }

  spliceDefault() {
    this.releaseclicked = true;
    console.log(this.releaseSelected);

  }

  addDefault() {
    console.log(this.releaseSelected);
    if (this.releaseSelected == "Select Release") {
      this.releaseclicked = false;
    }
  }

  // function for gathering data for stacked graph
  // console.log()
  charts(x) {
    //  alert("called me");
    this.activateStacked = 1;
    this.dbData = x;
    var B = [];
    console.log(x)
    B.push('Modules');
    B.push('Pass');
    B.push('Fail');
    B.push('Skipped');
    this.dbArray.push(B);
    console.log(this.dbArray)
    for (let j = 0; j < this.dbData.length; j++) {
      var A = [];
      A.push(this.dbData[j].moduleName);
      A.push(this.dbData[j].passed);
      A.push(this.dbData[j].failed);
      A.push(this.dbData[j].skipped);
      this.dbArray.push(A);
      this.stackedColumnChart.dataTable = this.dbArray;
      // console.log(this.dbArray)
    }

  }

  // this.charts = Object.create(this.charts);
  // console.log(this.charts);
  public stackedColumnChart = {
    chartType: 'ColumnChart',

    dataTable: this.dbArray,

    options: {
      width: 200,
      height: 200,
      backgroundColor: '#fcfcfc',
      legend: { position: 'Top' },
      bar: { groupWidth: '40%' },
      isStacked: true,
      vAxis: {
        gridlines: {
          count: 0
        }
      },
      colors: ['green', 'red', 'orange'],

    },
  } //end

  //function for drawing pie chart in ui don't remove commented lines,
  public pieChart = {
    chartType: 'PieChart',
    dataTable: this.pieArray,
    backgroundColor: 'red',
    options: {
      width: 180,
      height: 180,
      legend: { position: 'bottom' },
      colors: ['green', 'red', 'orange'],
      slices: {
        0: { offset: 0.1 },
        1: { offset: 0.1 }
      },
      // pieStartAngle: 0,
      is3D: true,
      // pieHole: 0,
      // sliceVisibilityThreshold: 0,
      // pieSliceText: 'label',
    }
  }
  //end

  inputBox(x) {
    console.log(x.target.value)
    var invalidChars = [
      "-",
      "+",
      "e",
      "."
    ];
    if (invalidChars.includes(x.key)) {
      x.preventDefault();
    }
  }

  //function for searching the suites
  searchReport(x, y) {
    // if(this.manualReportFetch !== true){
    console.log(this.reportNumber)
    this.dateWiseData = [];
    var dateObject = {};
    window.sessionStorage.removeItem('tabs');
    this.selected = '';
    this.fromBackPage = false;
    window.sessionStorage.setItem('pageStatus', JSON.stringify(false));
    window.sessionStorage.setItem('pageNavigated', this.fromBackPage)
    // this.fromDate = x;
    // this.toDate = y;
    console.log(x, y, this.fromDate, this.toDate, this.releaseSelected)
    var a = "T00:00:00Z";
    var b = "T23:59:59Z";

    if (x != '' && x != undefined && y != '' && y != undefined) {
      this.fDate = x + a;
      this.tDate = y + b;
    } else {
      this.fDate = undefined;
      this.tDate = undefined;
    }
    if (x != '') {
      if (y == '') {
        return this.dialogService.openAlert('Please select toDate..')
      }
    }
    else if (y != '') {
      if (x == '') {
        return this.dialogService.openAlert('Please select fromDate..')
      }
    }
    window.sessionStorage.setItem('fDate', this.fDate);
    window.sessionStorage.setItem('tDate', this.tDate);
    //  alert(this.Manual+","+this.scheduleDisplay);
    dateObject = {
      "fDate": this.fDate,
      "tDate": this.tDate,
      // "pId": this.pID,
      //"releaseVersion": this.releaseSelected,
      "manual": this.Manual,
      "Automation": this.Automation,
      "schedule": this.scheduleDisplay,
      "scheduleName": this.selectedScheduleName,
      'jenkins': this.jenkinsDisplay,
      'Run': this.reportNumber
    };
    dateObject["Run"] = this.reportNumber;
    if (this.releaseSelected == "Select Release") { dateObject["releaseVersion"] = undefined }
    else {
      dateObject["releaseVersion"] = this.releaseSelected;
    }
    if (this.reportNumber == ""||this.reportNumber == undefined||this.reportNumber == null) 
    { dateObject["Run"] = undefined }
    else {
      dateObject["Run"] = this.reportNumber;
    }
    if ( dateObject["manual"] == false) { dateObject["manual"] = undefined }
    if ( dateObject["Automation"] == false) { dateObject["Automation"] = undefined }
    if ( dateObject["schedule"] == false) { dateObject["schedule"] = undefined }
    if ( dateObject["jenkins"] == false) { dateObject["jenkins"] = undefined }
    this.nodata = false;
    console.log(this.reportNumber, dateObject)
    var arrayUn = [];
    var arrayUn1 = [];
    Object.values(dateObject).forEach((ele) => {
      if (ele != undefined || ele == true) arrayUn.push(ele)
      //  if ( ele == false) arrayUn1.push(ele)

    })
    console.log(arrayUn)
    if (arrayUn.length == 0) {
      return this.dialogService.openAlert('Please give at least one input..')
    } 
    // if (arrayUn1.length == 4) {
    //   return this.dialogService.openAlert('Please give at least one input..')
    // } 
    else {
      dateObject["pId"] = this.pID
      this.fetchSuites(dateObject);
    }
    // }
    // else{
    //   // alert("manual"+ x +" , "+y)
    //   this.fromDate = x;
    //   this.toDate = y;
    //   var a = "T00:00:00Z";
    //   var b = "T23:59:59Z";
    //   this.fromDate= this.fromDate+a;
    //   this.toDate=this.toDate+b;
    //   let dateObject1 = {
    //     "fDate": this.fromDate,
    //     "tDate": this.toDate,
    //     "pId": this.pID,
    //   };
    //   console.log(dateObject1);
    //   this.graphreport.manualReportFetchCall(dateObject1).subscribe(
    //     result =>{
    //         this.manualExeReportData = result;
    //         console.log(this.manualExeReportData);
    //         // this.dateWiseData = this.manualExeReportData;
    //     }
    //   );
    // }

  } //end

  routeRun(Run, routeProjectId, runRoute) {
    console.log(this.runRouter)

    if (this.runRouter == true) {
      this.runRouter = false;
      this.fetchNewExecuted(Run, routeProjectId, runRoute)
      // alert(runRoute)
      this.runRouter = false
      sessionStorage.setItem("reportStatus", JSON.stringify(this.runRouter))
    }

  }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Run No', 'Suite', 'Date', 'Time'];

  fetchNewExecuted(Run, routeProjectId, runRoute) {
    let dataRoute = {
      "run": Run,
      "projectId": routeProjectId,
    }
    this.Manual = true
    this.scheduleDisplay = false
    this.graphreport.fetchNewReport(dataRoute).subscribe(
      result => {
        this.dateWiseData = result
        this.NewFromDate = this.dateWiseData.startedAt
        this.NewToDate = this.dateWiseData.endedAt
        window.sessionStorage.setItem('fDate', this.NewFromDate);
        window.sessionStorage.setItem('tDate', this.NewToDate);
        window.sessionStorage.setItem('manual', this.Manual);
        window.sessionStorage.setItem("schedule", JSON.stringify(this.scheduleDisplay));
        window.sessionStorage.setItem('manualAutomation', this.manualReportFetch);
        window.sessionStorage.setItem('Automation', this.Automation);
        console.log(this.dateWiseData)
      });
  }

  fetchSuites(dateObject) {
    console.log(dateObject);
    // if (dateObject.fDate == undefined || dateObject.tDate == undefined) {
    //   alert("Please select Dates");
    //   return;
    // }
    if (dateObject.fDate > dateObject.tDate) {
      alert("FromDate should be less then ToDate");
      return;
    } else {
      window.sessionStorage.setItem('fDate', this.fDate);
      window.sessionStorage.setItem('tDate', this.tDate);
      // if (dateObject["fDate"]!=undefined&&dateObject["tDate"]!=undefined&&dateObject["manual"]!=undefined&&dateObject["manual"]!=false&&dateObject["Automation"]!=undefined
      // &&dateObject["Automation"]!=false&&dateObject["schedule"]!=undefined&&dateObject["schedule"]!=false&&dateObject["jenkins"]!=undefined&&dateObject["jenkins"]!=false) 
      // { 
      //   dateObject["Run"] = '';
      //   this.reportNumber='';     
      //  }else{
      //   dateObject["Run"] = this.reportNumber;
      //  }
      if (dateObject["Run"] != '' && dateObject["Run"] != undefined) {
        this.Manual = false;
        this.scheduleDisplay = false;
        this.jenkinsDisplay = false;
        this.Automation = false;
        this.selectedScheduleName = undefined;
        this.newSchedules = [];
        this.releaseSelected = "Select Release";
        this.fromDate = '';
        this.toDate = '';
        dateObject["fDate"] = undefined;
        dateObject["tDate"] = undefined;
        dateObject["manual"] = false;
        dateObject["Automation"] = false;
        dateObject["schedule"] = false;
        dateObject["scheduleName"] = undefined;
        dateObject["jenkins"] = false;
        dateObject["releaseVersion"] = undefined
      }
      this.graphreport.fetchSuites(dateObject).subscribe(datedata => {
        //this.dateWiseData = datedata;
        this.moduleDataDisplay=[];
        this.suiteName = '';
      this.executedAt = '';
      this.run = '';
      this.selectedModule = '';
      this.navSuite = 0;
      this.navModule = 0;
      this.activateStacked = 0;
      this.pieArray = [];
      this.dbArray = [];
        console.log(datedata);
        if (datedata.length == 0) {
          return this.dialogService.openAlert('No Data Available..')
        } else {
          this.dateWiseData = datedata.sort((a, b) => {
            // const aDate = new Date(a._id.startedAt).setHours(a._id.startedAt.split("T")[1].split(":")[0],
            //   a._id.startedAt.split("T")[1].split(":")[1], a._id.startedAt.split("T")[1].split(":")[1].split(":")[0])
            // const bDate = new Date(b._id.startedAt).setHours(b._id.startedAt.split("T")[1].split(":")[0],
            //   b._id.startedAt.split("T")[1].split(":")[1], b._id.startedAt.split("T")[1].split(":")[1].split(":")[0])
            const aDate = new Date(a._id.startedAt).setHours(a._id.startedAt.split("T")[1].split(":")[0],
            a._id.startedAt.split("T")[1].split(":")[1], a._id.startedAt.split("T")[1].split(":")[2].split("Z")[0])
          const bDate = new Date(b._id.startedAt).setHours(b._id.startedAt.split("T")[1].split(":")[0],
            b._id.startedAt.split("T")[1].split(":")[1], b._id.startedAt.split("T")[1].split(":")[2].split("Z")[0])
            return bDate - aDate
          })
          console.log(this.dateWiseData);
        }

      });

    }
  }
  index2: any;
  //function for fetching the module based on selected suite
  selectedSuite(suite, data, index) {
    // if (this.run == data.Run.toString()) {
    //   return;
    // }
    this.index2 = index
    console.log(data, index);
    this.navSuite = 1;
    this.executedAt = data.startedAt;
    this.timing = data.startedAt;
    window.sessionStorage.setItem('timing', data.startedAt);
    this.suiteName = suite;
    window.sessionStorage.setItem('suite', this.suiteName);
    window.sessionStorage.setItem('executed', this.executedAt);
    // window.sessionStorage.setItem('second',this.pageActiveStatus);
    this.run = data.Run.toString();
    window.sessionStorage.setItem('run', this.run);
    var fetchModule = {
      'pId': this.pID,
      'suiteName': this.suiteName,
      'startedAt': this.executedAt,
      "Run": this.run
    }
    this.exceptionOption = data.exceptionOption;
    this.previousExcepOption = data.exceptionOption;
    window.sessionStorage.setItem('exceptionOption', JSON.stringify(data.exceptionOption));
    var fetchObject = {
      'run': this.run,
      "exceptionOption": data.exceptionOption
    }
    console.log(this.exceptionOption, this.previousExcepOption)
    console.log(fetchModule)
    console.log(fetchObject)
    this.graphreport.fetchReportNumbers(fetchObject).subscribe(
      reportNumbers => {
        // this.reportNumbers=reportNumbers
        console.log(reportNumbers, Object.keys(reportNumbers).length)
        this.executedBy = reportNumbers.executedBy;
        this.reportNumbers = reportNumbers.completeNumbers;
        console.log(this.executedBy, this.reportNumbers)
        let x = this.reportNumbers
        var y = x.filter((v, i) => x.indexOf(v) === i)
        console.log(y);
        this.title = y;
        this.pieChart = Object.create(this.pieChart);
        if (data.exceptionOption) {
          this.onSelect(this.title[0]);
          this.getClicked(this.title[0]);
        }
      })

    this.graphreport.fetchModules(fetchModule).subscribe(
      mData => {
        this.moduleLevel = mData;
        this.moduleLevel.sort((a, b) => a._id.localeCompare(b._id))
        this.reuseModule(this.moduleLevel)
      });

    window.sessionStorage.removeItem('runType');
  }  //end

  suiteLevelTable: string[] = ['Sl.No', 'Module', 'Total Testcases', 'Pass', 'Fail', 'Skipped'];

  reuseModule(x) {
    console.log(x);
    this.moduleLevel1 = x;
    var moduleName;
    var moduleScriptCount;
    var passed = 0;
    var failed = 0;
    var skipped = 0;
    var moduleDisplay = [];
    this.moduleLevel1.forEach(function (e) {
      // console.log(e.status);
      moduleName = e._id;
      moduleScriptCount = e.totalStepsCount;
      e.status.forEach(function (script) {
        //  console.log(script);
        if (script.scriptStatus == 'Fail') {
          failed = script.count;
        }
        if (script.scriptStatus == 'Pass') {
          passed = script.count
        }
        if (script.scriptStatus == 'Skipped') {
          skipped = script.count;
        }

      })

      var moduleData = {
        'moduleName': moduleName,
        'moduleScriptCount': moduleScriptCount,
        'failed': failed,
        'passed': passed,
        'skipped': skipped
      }
      moduleDisplay.push(moduleData)

    })
    this.moduleDataDisplay = moduleDisplay;
    // this.moduleDataDisplay.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
    console.log(this.moduleDataDisplay)
    this.charts(this.moduleDataDisplay);
    this.pieChart = Object.create(this.pieChart);
    this.stackedColumnChart = Object.create(this.stackedColumnChart)
    this.forPieChartData(this.moduleDataDisplay);
  }
  //function for gathering the data for pie chart
  pieChartData(x) {

    this.pieArray = []
    this.dbArray = []
    console.log(x)
    this.activatePie = 1;
    var data = x;
    var pArray = ['suitelevel', 'TotalNumber'];
    var pArray1 = ['Pass'];
    var pArray2 = ['Fail'];
    var pArray3 = ['skipped'];
    this.pieArray.push(pArray);
    pArray1.push(data[0]);
    pArray2.push(data[1]);
    pArray3.push(data[2]);
    this.pieArray.push(pArray1, pArray2, pArray3);
    console.log(this.pieArray);
    this.pieChart.dataTable = this.pieArray;

  } //end

  //function for displaying the table of total scripts

  forPieChartData(data) {
    this.newPieArray = [];
    this.totalScripts = 0;
    this.totalPass = 0;
    this.totalFail = 0;
    this.totalSkipped = 0;
    console.log(data)
    var tScript = 0;
    var tPass = 0;
    var tFail = 0;
    var tSkipped = 0;

    data.forEach(function (e) {
      tScript += e.moduleScriptCount;
      tPass += e.passed;
      tFail += e.failed;
      tSkipped += e.skipped;

    })
    this.totalScripts = tScript;
    this.totalPass = tPass;
    this.totalFail = tFail;
    this.totalSkipped = tSkipped;
    this.newPieArray.push(this.totalPass);
    this.newPieArray.push(this.totalFail);
    this.newPieArray.push(this.totalSkipped);

    this.pieChartData(this.newPieArray);


  } //end

  //function to pass the selected module name to next page
  getModuleName(x) {
    this.selectedModule = x;
    window.sessionStorage.setItem('moduleName', this.selectedModule);
    window.sessionStorage.setItem('module', this.selectedModule);
    window.sessionStorage.setItem('tabs', this.selected);
    window.sessionStorage.setItem('pageStatus', JSON.stringify(true));
    window.sessionStorage.setItem('selectedRunCount', this.selected);
    window.sessionStorage.setItem('previousexcepOption', JSON.stringify(this.exceptionOption));
    console.log(this.exceptionOption)
    window.sessionStorage.setItem('selectedtime', this.timing);
  }

  onSelect(t): void {
    this.selected = t;

  }
  //getting the clciked number
  getClicked(number) {
    console.log(number)
    window.sessionStorage.setItem('runType', number);
    window.sessionStorage.setItem('tabs', number);
    window.sessionStorage.setItem('newRun', number);
    this.graphreport.getSpecificReport(number).subscribe(
      specific => {
        console.log(specific);
        this.specificResult = specific;
        this.activatePie = 0;
        this.pieArray = [];
        this.dbArray = [];
        this.reuseModule(this.specificResult)
      })

  }

  fetchSchedule(pid) {
    // alert("schedule name ");
    this.graphreport.fetchSchedules(pid).subscribe(result => {
      console.log(result);

      this.newSchedules = result;
    })
  }


}
