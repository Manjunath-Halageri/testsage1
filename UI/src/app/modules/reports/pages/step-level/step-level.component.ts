import { Component, OnInit, Input } from '@angular/core';
import {
    ChartReadyEvent, ChartErrorEvent, ChartSelectEvent,
    ChartMouseOverEvent, ChartMouseOutEvent
} from 'ng2-google-charts';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
// import { Http, Response } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { Post } from '../../../../post';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { GraphReportService } from '../../../../core/services/graph-report.service';
import { ProjectSelectionServiceComponent } from '../../../../core/services/projectSelection.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';

declare var $: any;
declare var google: any;


@Component({
  selector: 'app-step-level',
  templateUrl: './step-level.component.html',
  styleUrls: ['./step-level.component.css','../../../../layout/css/parent.css','../../../../layout/css/table.css'],
  providers: [ProjectDetailServiceComponent, apiServiceComponent, GraphReportService, ProjectSelectionServiceComponent]

})
export class StepLevelComponent implements OnInit {
    @Input() image: 'string';

    projectName: any;
    suites: any;
    dbData: any;
    dbArray = [];
    fDate: any;
    tDate: any;
    selectedSuite: any;
    searchedSuites: any;
    suiteName: any;
    moduleName: any;
    featureName: any;
    scriptName: any;
    stepLevelData: any;
    onlySteps: any;
    pass = 0;
    fail = 0;
    skipped = 0;
    totalStepArray = [];
    totalSteps: any;
    activatePie: number;
    pieArray = [];
    startedAt: any;
    endedAt: any;
    duration: any;
    eachStepDuration = 0;
    totalDuration;
    completeStatus: any;
    run: any;
    runNum: number;
    logData: any;
    screenShotPath: any;
    screenShotPath1: any;
    invokeGraph: any;
    browserName: any;
    browserVersion: any;
    videoFullPath: any;
    videoPath: any;
    scriptData: any;
    reportNumbers: Post[];
    title: Post[];
    stepLevelData1: any;
    selected: any;
    manual: any;
    scheduleDisplay: any;
    exceptionOption: any;
    pageStatus: string;
    timing: string;
    mynum: string;
    backStepsResult: Post[];
    completeScriptStatus: any; 
     startedAt1: any;
    startedAt2: any;
    endedAt2: any;
    endedAt1: any;
    stepStartedAt: any;
    stepEndedAt: any;
    stepName: any;
    stepStatus: any;
    stepDuration: any;
    allStepSData=[]
    manualAutomation: any;
    manualStepVideo: any;
    manualAutomation1: any;
    module: string;

    constructor( private data5: ProjectDetailServiceComponent, private api: apiServiceComponent,
        private graphreport: GraphReportService,private router: Router) {
    }

    ngOnInit() {
        this.activatePie = 0;
        this.projectName = this.data5.selectedProject();
        this.moduleName = window.sessionStorage.getItem('moduleName');
        console.log(this.moduleName)
        this.module = window.sessionStorage.getItem('module');
        console.log(this.module)
        this.featureName = window.sessionStorage.getItem("featureName");
        this.scriptName = window.sessionStorage.getItem('scriptName');
        this.run = window.sessionStorage.getItem("run");
        this.fDate = window.sessionStorage.getItem('fDate');
        this.tDate = window.sessionStorage.getItem('tDate');
        this.suiteName = window.sessionStorage.getItem('suite');
        this.manual = JSON.parse(window.sessionStorage.getItem("manual"));
        this.scheduleDisplay = JSON.parse(window.sessionStorage.getItem('schedule'));
        this.exceptionOption = JSON.parse(window.sessionStorage.getItem('exceptionOption'));
        this.pageStatus = window.sessionStorage.getItem('pageNavigated');
        this.timing = window.sessionStorage.getItem('timing');
        this.mynum = window.sessionStorage.getItem('newRun');
        this.manualAutomation = JSON.parse(window.sessionStorage.getItem('manualAutomation'));
       // alert(this.manualAutomation +" 55555555 "+typeof(this.manualAutomation));
        this.invokeGraph = 0;
        var runNumber = this.run;
        this.runNum = runNumber;
        var dates = {
            'fDate': this.fDate,
            'tDate': this.tDate,
            'manual': this.manual,
            'schedule': this.scheduleDisplay
        }

        if (this.mynum == 'null') {
            // alert("hiiiii "+this.mynum)
            var stepObject = {
                'suiteName': this.suiteName,
                'moduleName': this.module,
                'featureName': this.featureName,
                'scriptName': this.scriptName,
                'runCount': this.runNum
            }
            this.graphreport.fetchSteps(stepObject).subscribe(
                steps => {
                    this.stepLevelData = steps;
                    this.displaySteps(this.stepLevelData)
                });

        } else {
            var searchNewScript = {
                'suiteName': this.suiteName,
                'moduleName': this.module,
                'featureName': this.featureName,
                'scriptName': this.scriptName,
                'runCount': this.mynum
            }
            this.backSteps(searchNewScript)
        }


        // this.graphreport.fetchSuites(dates).subscribe(
        //     dates => {
        //         this.searchedSuites = dates;
        //     });


        var fetchObject = {
            'run': this.run,
            'exceptionOption': this.exceptionOption
        }
        this.graphreport.fetchReportNumbers(fetchObject).subscribe(
            reportNumbers => {
                console.log(reportNumbers,Object.keys(reportNumbers).length)
                // this.executedBy=reportNumbers.executedBy;
                this.reportNumbers = reportNumbers.completeNumbers;
                // console.log(this.executedBy,this.reportNumbers)
               // this.reportNumbers = reportNumbers;

                let x = this.reportNumbers
                var y = x.filter((v, i) => x.indexOf(v) === i)

                this.title = y;

                this.pieChart = Object.create(this.pieChart);
            }
        )
        this.selected = sessionStorage.getItem('tabs')
    } //ngOnit()

    backSteps(data) {
        // alert("help");
        console.log(data);
        this.graphreport.backSteps12(data).subscribe(result => {
            this.backStepsResult = result;
            this.displaySteps(this.backStepsResult)
        })


    }

    // steptLevelTable: string[] = ['Sl.No', 'Step Name', 'Status', 'Screenshot', 'Download','Start Time','End Time','Video','Duration(ms)'];
    stepLevelTable: string[] = ['position','name']
    displaySteps(stepsDdata) {
        console.log(stepsDdata);
        this.stepLevelData1 = stepsDdata
        if (this.mynum == 'null') {
            this.completeStatus = this.stepLevelData1[0].summary;
        } else {
            if (this.mynum.includes('_Summary')) {
                this.completeStatus = this.stepLevelData1[0].summary;
            }
            else if (this.mynum.includes('_')) {
                this.completeStatus = this.stepLevelData1[0].exception;
            } else {
                this.completeStatus = this.stepLevelData1[0].manual;
            }
        }

        // console.log(this.completeStatus);
        this.completeStatus.forEach(e => {
            if (e.Testcase === this.scriptName) {
                this.scriptData = e;
            }
        })
        // console.log(this.scriptData.scriptStatus);
        this.completeScriptStatus = this.scriptData.scriptStatus;
        this.onlySteps = this.scriptData.scriptDetails;
        // console.log(this.onlySteps);
        for (let i = 0; i < this.onlySteps.length; i++) {
            if (i == 0) {
                this.startedAt = this.onlySteps[i]["started-at"];
                // this.startedAt1 = this.onlySteps[i]["started-at"];
                // this.startedAt2 = this.startedAt1.split('T')[1];
                // this.startedAt = this.startedAt2;
                // alert(this.startedAt);
                console.log(this.onlySteps[i]['reporter-output'])
                var deatils = this.onlySteps[i]['reporter-output'];
                var dataBrowser = deatils.line;
                if(deatils!=''){
                    var dataBrowser = deatils.line;
                console.log(dataBrowser);
                console.log(dataBrowser)
                this.browserName = dataBrowser[0];
                this.browserVersion = dataBrowser[1];
                }
            }
            console.log(this.onlySteps[i].status);
            if (this.onlySteps[i].status == 'PASS') {

                this.pass++;
            }
            else if (this.onlySteps[i].status == 'FAIL') {

                this.fail++;
            }
            else {
                this.skipped++;
            }
            if (i == this.onlySteps.length - 1) {
                this.endedAt = this.onlySteps[i]["finished-at"];

                // this.endedAt1 = this.onlySteps[i]["finished-at"];
                // this.endedAt2 =  this.endedAt1.split('T')[1];
                // this.endedAt = this.endedAt2;
                // alert(this.endedAt)
            }
            // this.stepStartedAt =  this.onlySteps[i]["started-at"].split('T')[1];
            // this.stepEndedAt = this.onlySteps[i]["finished-at"].split('T')[1];
            this.stepStartedAt =  this.onlySteps[i]["started-at"]
            this.stepEndedAt = this.onlySteps[i]["finished-at"]
            this.stepName = this.onlySteps[i].name;
            this.stepStatus = this.onlySteps[i].status;
            this.stepDuration = this.onlySteps[i]['duration-ms'];
            var stepData = {
                'name':this.stepName,
                'status':this.stepStatus,
                'startedAt': this.stepStartedAt,
                'endedAt':this.stepEndedAt,
                'duration':this.stepDuration
            }
            this.eachStepDuration += this.onlySteps[i]['duration-ms'];
            this.allStepSData.push(stepData)
        }//for loop
        
        // alert(this.allStepSData);
        console.log(this.allStepSData)
        this.totalDuration = this.eachStepDuration;
        this.totalSteps = this.pass + this.fail + this.skipped;

        this.totalStepArray.push(this.pass)
        this.totalStepArray.push(this.fail)
        this.totalStepArray.push(this.skipped);
        // alert("hello");
        console.log(this.totalStepArray);
        this.pieChartData(this.totalStepArray)
        if (this.totalStepArray.length != 0) {
            this.invokeGraph = 1;
        }


    }//End of displaySteps

    public pieChart = {
        chartType: 'PieChart',
        dataTable: this.pieArray,
        options: {
            height: 200,
            width: 200,
            legend: { position: 'bottom' },
            colors: ['green', 'red', 'orange']
            // slices: {
            // 0: {offset: 0.3},
            // 1: {offset: 0.2}
            // }
        }
    };

    pieChartData(x) {
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

    }

    //for getting the log data
    getLogs() {
        var completeData = {
            ['runNo']: this.runNum,
            ['moduleName']: this.module,
            ['featureName']: this.featureName,
            ['scriptName']: this.scriptName,
            ['suiteName']: this.suiteName
        }
console.log(completeData)
        this.graphreport.fetchLogs(completeData).subscribe(
            data => {
                console.log(data)
                this.logData = data;

            });
    }

    displayScreen(steps) {
        // alert("hi")
        this.screenShotPath,this.screenShotPath1=''
        var reportType;
        var runType = window.sessionStorage.getItem('runType');
        console.log(runType)
        if(runType==null){
            reportType="Summary";
        }
        else{
            var data= runType.split('_');
            console.log(data[0])
            console.log(data[1])
            if(data[1]==undefined){
                reportType="manual";
               }
               else if(data[1]=='1'){
                reportType='exception'
               }else{
                reportType='Summary'
               }
        }

        console.log(steps)
        var reqOfScreen = {
            ['runCount']: this.runNum,
            ['projectName']: this.projectName,
            ['suiteName']: this.suiteName,
            ['scriptName']: this.scriptName,
            ['moduleName']: this.module,
            ['featureName']: this.featureName,
            ['stepName']: steps.name,
            ['stepStatus']: steps.status,
            ['reportType']:reportType
        }
        this.graphreport.fetchScreenShot(reqOfScreen).subscribe(
            screenPath => {
                console.log(screenPath);
                this.screenShotPath = screenPath;
                console.log(this.screenShotPath)
                // alert(this.screenShotPath)
                this.screenShotPath1 = this.screenShotPath;
                // this.screenShotPath1 = "../server/manualScreenShots/23-1.png"
            });
    }

    deleteImage(){
       var  userId= sessionStorage.getItem('newUserId');
        var obj={
            userId: userId,
        }
        this.graphreport.deleteScreenShot(obj).subscribe(
            result => {
                console.log(result);
            });
    }

    // getVideo() {
    //     var reqOfVideo = {
    //         ['runCount']: this.runNum,
    //         ['projectName']: this.projectName,
    //         ['suiteName']: this.suiteName,
    //         ['scriptName']: this.scriptName,
    //         ['moduleName']: this.moduleName,
    //         ['featureName']: this.featureName
    //     }

    //     this.graphreport.fetchVideo(reqOfVideo).subscribe(
    //         videoFullPath => {

    //             this.videoPath = videoFullPath;
    //             console.log(this.videoPath);

    //         }

    //     );
    // }


    onSelect(t): void {

        this.selected = t;
        window.sessionStorage.setItem('tabs', this.selected);
        window.sessionStorage.setItem('pageStatus', JSON.stringify(true));
        window.sessionStorage.setItem('selectedRunCount', this.selected);
        window.sessionStorage.setItem('previousexcepOption', JSON.stringify(this.exceptionOption));
        console.log(this.exceptionOption)
        window.sessionStorage.setItem('selectedtime', this.timing);
    }

    ngOnDestroy() {
        // clearReports(){
          console.log("ENTERED into ngOnDestroy",this.router.url)
          if (this.router.url != "/projectdetail/reports/suitelevel"&&this.router.url != "/projectdetail/reports/suitelevel/featurelevel"&&
          this.router.url != "/projectdetail/reports/suitelevel/featurelevel/scriptlevel"&&this.router.url != "/projectdetail/reports/suitelevel/featurelevel/scriptlevel/steplevel") {
            console.log("ENTERED into IFF",this.router.url)
            
            var reportNumbers;
            //this.scheduleDisplay = false
            this.pieArray = [];
            this.dbArray = [];
            window.sessionStorage.setItem('exceptionOption', JSON.stringify(false));
            window.sessionStorage.setItem('previousexcepOption', JSON.stringify(false));
            window.sessionStorage.removeItem('runType');
            window.sessionStorage.removeItem('tabs');
            window.sessionStorage.removeItem('executedRunNum');
            window.sessionStorage.removeItem('pageStatus');
    
        }
        //}
      }
    //for playing the specific step video
    // stepVideo(data,index){
    //     // alert(index + " , "+this.scriptName + " , "+this.suiteName);
    //     console.log(data);
    //     data['scriptname'] = this.scriptName;
    //     data['suiteName'] = this.suiteName;
    //     this.graphreport.fetchManualVideo(data).subscribe(result=>{
    //         this.manualStepVideo = result; 
    //         this.videoPath = this.manualStepVideo;
    //         console.log(this.videoPath)
    //     });
    // }

    //   dataSource: MatTableDataSource<any>;
    //   displayedColumns: string[] = ['Step Name', 'Status', 'Screenshot', 'Download', 'Start Time','End Time'];

}