import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
    ChartReadyEvent, ChartErrorEvent, ChartSelectEvent,
    ChartMouseOverEvent, ChartMouseOutEvent
} from 'ng2-google-charts';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import 'rxjs/add/operator/map';
import { Post } from '../../../../post';
import { GraphReportService } from '../../../../core/services/graph-report.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { Router } from '@angular/router';

declare var $: any;
declare var google: any;

@Component({
    selector: 'app-script-level',
    templateUrl: './script-level.component.html',
    styleUrls: ['./script-level.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
    providers: [ GraphReportService],
})
export class ScriptLevelComponent implements OnInit,OnDestroy {

    projectName: any;
    suites: any;
    dbData: any;
    dbArray = [];
    selectedSuite: any;
    moduleName: any;
    fDate: any;
    tDate: any;
    run: any;
    executedAt: any;
    searchedSuites: any;
    featureName: any;
    scriptData: any;
    dataOfScripts = [];
    stepsDetails: any;
    allStepsTotal: any;
    stepsPassed: any;
    stepsFailed: any;
    stepsSkipped: any;
    stepsArray = [];
    pieArray = [];
    scriptSelected: any;
    runNum: number;
    invokeGraphs: any;
    reportNumbers: Post[];
    title: Post[];
    myScriptData: Post[];
    selected: any;
    manual: any;
    scheduleDisplay: any;
    exceptionOption: any;
    pageStatus: string;
    timing: string;
    mynum: string;
    backScriptData: Post[];
    module: string;
    executedBy: any;
    constructor(private graphreport: GraphReportService, private data5: ProjectDetailServiceComponent,
        private router: Router) { }

    ngOnInit() {
        this.scriptSelected = '';
         this.projectName = this.data5.selectedProject();
        // alert("hello")
        this.selectedSuite = window.sessionStorage.getItem('suite');
        this.moduleName = window.sessionStorage.getItem('moduleName');
        this.module = window.sessionStorage.getItem('module');
        console.log(this.module)
        this.fDate = window.sessionStorage.getItem('fDate');
        this.tDate = window.sessionStorage.getItem('tDate');
        // alert(this.tDate + " this.tDate ")
        this.run = window.sessionStorage.getItem("run");
        this.executedAt = window.sessionStorage.getItem("executed");
        // alert(this.executedAt +" this.executedAt")
        this.featureName = window.sessionStorage.getItem("featureName");
        this.manual = JSON.parse(window.sessionStorage.getItem("manual"));
        this.scheduleDisplay = JSON.parse(window.sessionStorage.getItem('schedule'));
        this.scheduleDisplay = JSON.parse(window.sessionStorage.getItem('schedule'));
        this.exceptionOption = JSON.parse(window.sessionStorage.getItem('exceptionOption'));
        this.pageStatus = window.sessionStorage.getItem('pageNavigated');
        this.timing = window.sessionStorage.getItem('timing');
        this.mynum = window.sessionStorage.getItem('newRun');
        //  alert(this.mynum +" 55555555");
        //  alert(typeof(this.mynum) +" 666666 ");
        this.invokeGraphs = 0;
        var runNumber = this.run;
        this.runNum = runNumber;
        // alert(this.runNum+" summary i am expecting")
        if (this.mynum != 'null') {
            // alert(this.mynum)
            var scriptFetchData1 = {
                'runNo': this.mynum,
                'moduleName': this.module,
                'featureName': this.featureName,
                'suiteName': this.selectedSuite
            }
            this.specificRunScripts(scriptFetchData1)

        } else {
            // alert("hello")
            window.sessionStorage.setItem('newRun', null);
            var scriptFetchData = {
                'runNo': this.runNum,
                'moduleName': this.module,
                'featureName': this.featureName,
                'suiteName': this.selectedSuite
            }
            this.scriptRequest(scriptFetchData)
        }

        var Dates = {
            'fDate': this.fDate,
            'tDate': this.tDate,
            'manual': this.manual,
            'schedule': this.scheduleDisplay
        }
        // this.graphreport.fetchSuites(Dates).subscribe(
        //     dates => {
        //         this.searchedSuites = dates;
        //         console.log(this.searchedSuites);
        //     });


        var fetchObject = {
            'run': this.run,
            'exceptionOption': this.exceptionOption
        }
        this.graphreport.fetchReportNumbers(fetchObject).subscribe(
            reportNumbers => {
                console.log(reportNumbers,Object.keys(reportNumbers).length)
                this.executedBy=reportNumbers.executedBy;
                this.reportNumbers = reportNumbers.completeNumbers;
                console.log(this.executedBy,this.reportNumbers)
               // this.reportNumbers = reportNumbers;
                let x = this.reportNumbers
                var y = x.filter((v, i) => x.indexOf(v) === i)
                console.log(y);
                this.title = y;
                this.pieChart = Object.create(this.pieChart);
            }
        )
        this.selected = sessionStorage.getItem('tabs')
    } //ngOnit()

    specificRunScripts(details) {
        // alert("fetching the run scripts");
        console.log(details);
        this.graphreport.backScripts(details).subscribe(result => {
            this.backScriptData = result;
            console.log(this.backScriptData);
            console.log(this.backScriptData.length);
            this.scriptDisplay(this.backScriptData)
        })

    }

    scriptRequest(data) {
        // alert("for summary");
        this.graphreport.fetchScripts(data).subscribe(
            scripts => {
                this.scriptData = scripts;
                console.log(this.scriptData);
                this.scriptDisplay(this.scriptData);
            });
    }

    dataSource: MatTableDataSource<any>;
    scriptLevelTable: string[] = ['Sl.No', 'Testcase', 'Total TestSteps', 'Browser', 'Version', 'Result', 'Start Time', 'Duration(sec)'];
    scriptDisplay(data) {
        console.log(data);
        var scriptName;
        var status;
        var totalScriptSteps;
        var duration;
        var startTime;
        var browser = '';
        var version = '';
        var scriptData = [];
        var totalSteps = 0;
        var scriptPass = 0;
        var scriptFail = 0;
        var scriptSkipped = 0;
        var statusFailCount = 0;
        var statusPassCount = 0;
        var statusSkippedCount = 0;
        var totalPass;
        var totalFail;
        var totalSkipped;
        var stepDuration;
        var totalDuration = 0;
        var totalScripts = 0;
        var browserIncorrect;
        var versionIncorrect;
        totalScripts = data.length;
        data.forEach(function (e) {
            console.log(e);
            scriptName = e.Module;
            scriptPass = 0;
            scriptFail = 0;
            scriptSkipped = 0;
            // e.status.forEach(function (other) {
            if (e.scriptStatus === 'Fail') {
                statusFailCount++;
            } else if (e.scriptStatus === 'Pass') {
                statusPassCount++;
            } else {
                statusSkippedCount++;
            }

            status = e.scriptStatus;

            startTime = e.startedAt;
            totalScriptSteps = e.scriptDetails.length;
            e.scriptDetails.forEach(function (s, index) {
                var z = 0;
                stepDuration = s["duration-ms"];
                totalDuration += stepDuration;
                var browserDetails = s['reporter-output'];
                // var dataArray = browserDetails.line;
                var dataArray = s['reporter-output'].line;
                console.log("details browser")
                console.log(dataArray);
                console.log(index);
                if (dataArray != undefined) {
                    browser = dataArray[z];
                    z++;
                    version = dataArray[z];
                } else {
                    console.log("empty array");
                }

                console.log(browser);
                console.log(version);

            })

            // })
            totalSteps += totalScriptSteps;

            var scriptDetails = {
                "scriptName": scriptName,
                "Duration": totalDuration,
                'status': status,
                'startTime': startTime,
                'totalScriptSteps': totalScriptSteps,
                "browser": browser,
                'version': version
            }
            scriptData.push(scriptDetails)
        })
        totalPass = scriptPass;
        totalFail = scriptFail;
        totalSkipped = scriptSkipped;

        this.stepsPassed = statusPassCount;
        this.stepsFailed = statusFailCount;
        this.stepsSkipped = statusSkippedCount;
        this.stepsArray.push(this.stepsPassed);
        this.stepsArray.push(this.stepsFailed);
        this.stepsArray.push(this.stepsSkipped);
        this.pieChart = Object.create(this.pieChart);
        // this.stackedColumnChart = Object.create(this.stackedColumnChart)
        this.pieChartData(this.stepsArray);
        if (this.stepsArray.length != 0) {
            this.invokeGraphs = 1;
        }
        this.allStepsTotal = totalScripts;
        this.dataOfScripts = scriptData;
        this.dataOfScripts.sort((a, b) => a.scriptName.localeCompare(b.scriptName))
        console.log('data of scripts is as follows')
        console.log(this.dataOfScripts);
        // alert(this.dataOfScripts[0].startTime)
    }

    //function for gathering the data for pie chart
    pieChartData(x) {

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


    public pieChart = {
        chartType: 'PieChart',
        dataTable: this.pieArray,
        options: {
            width: 200,
            height: 200,
            legend: { position: 'top' },
            colors: ['green', 'red', 'orange']
            // slices: {
            // 0: {offset: 0.3},
            // 1: {offset: 0.2}
            // }
        }
    };

    selectedScript(script) {
        this.scriptSelected = script;

        window.sessionStorage.setItem('scriptName', this.scriptSelected)
    }

    onSelect(t): void {
        // alert(t);
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
}