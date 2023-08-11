import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { Post } from '../../../../post';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { GraphReportService } from '../../../../core/services/graph-report.service';
import { ProjectSelectionServiceComponent } from '../../../../core/services/projectSelection.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;
declare var google: any;

@Component({
    selector: 'app-feature-level',
    templateUrl: './feature-level.component.html',
    styleUrls: ['./feature-level.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
    providers: [ProjectDetailServiceComponent, apiServiceComponent, GraphReportService, ProjectSelectionServiceComponent],
})
export class FeatureLevelComponent implements OnInit,OnDestroy {
    projectName: any;
    suites: any;
    dbData: any;
    dbArray = [];
    dbArray1 = [];
    selectedSuite: any;
    moduleName: any;
    fDate: any;
    tDate: any;
    searchedSuites: any;
    run: any;
    featureData: any;
    featureArray = [];
    ModuleScript: any;
    Passed: any;
    Failed: any;
    Skipped: any;
    pieArray = [];
    featurePie = [];
    executedAt: any;
    featureSelected: any;
    runNum: number;
    invokeGraphs: any;
    reportNumbers: Post[];
    title: Post[];
    newFeatureData: Post[];
    selected: any;
    manual: string;
    scheduleDisplay: string;
    exceptionOption: any;
    pageStatus: string;
    pageStatusActive: any;
    datesData: any;
    timing: string;
    second11: string;
    mynum: string;
    newBackData: Post[];
    selectedProject: any;
    module: string;
    executedBy: any;
    Automation: any;
    selectedScheduleName: any;
    jenkinsDisplay: any;
    Manual: any;

    // totalScript:number;
    constructor(private route: ActivatedRoute, private data5: ProjectDetailServiceComponent, private router: Router,private graphreport: GraphReportService) {

    }

    ngOnInit() {

        this.featureSelected = '';
         this.projectName = this.data5.selectedProject();
        this.selectedProject = sessionStorage.getItem('selectedProject')

        this.selectedSuite = window.sessionStorage.getItem('suite');
        this.moduleName = window.sessionStorage.getItem('moduleName');
        this.module = window.sessionStorage.getItem('module');
        console.log(this.module)
        // alert(this.moduleName);
        this.fDate = window.sessionStorage.getItem('fDate');
        this.tDate = window.sessionStorage.getItem('tDate');
        this.run = window.sessionStorage.getItem("run");
        this.executedAt = window.sessionStorage.getItem("executed");
        this.manual = JSON.parse(window.sessionStorage.getItem("manual"));
        this.scheduleDisplay = JSON.parse(window.sessionStorage.getItem('schedule'));
        this.exceptionOption = JSON.parse(window.sessionStorage.getItem('exceptionOption'));
        this.pageStatus = window.sessionStorage.getItem('pageNavigated');
        this.timing = window.sessionStorage.getItem('timing');
        // this.second11 = window.sessionStorage.getItem('selectedRNumber');
        this.mynum = window.sessionStorage.getItem('newRun');
        this.Manual= this.manual
        this.Automation = JSON.parse(window.sessionStorage.getItem("Automation"));
        this.jenkinsDisplay = JSON.parse(window.sessionStorage.getItem("jenkins"));
        //   alert(this.mynum +" nnnn");
        // this.runNum = this.mynum ;
        this.invokeGraphs = 0;
        var Num = this.run;
        console.log(this.run)
        this.runNum = Num;
        var Dates = {
            'fDate': this.fDate,
            'tDate': this.tDate,
           // 'manual': this.manual,
           // 'schedule': this.scheduleDisplay,
            "manual": this.Manual,
            "Automation": this.Automation,
            "schedule": this.scheduleDisplay,
           // "scheduleName": this.selectedScheduleName,
            'jenkins': this.jenkinsDisplay
        }
        
        this.datesData = Dates;
        // this.graphreport.fetchSuites(Dates).subscribe(
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
                this.executedBy=reportNumbers.executedBy;
                this.reportNumbers = reportNumbers.completeNumbers;
                console.log(this.executedBy,this.reportNumbers)
               // this.reportNumbers = reportNumbers;
                let x = this.reportNumbers
                var y = x.filter((v, i) => x.indexOf(v) === i)
                //  console.log(y);
                this.title = y;
            }
        )
        console.log(this.mynum)
        if (this.mynum != 'null') {
            //   alert("1st aaaa "+ this.mynum)
            this.SumManFeature(this.mynum, this.module, this.selectedSuite)
        } else {
            // alert("2nd bbbb"+this.mynum);
            // window.sessionStorage.setItem('newRun',null);
            this.searchFeatures(this.runNum, this.module, this.selectedSuite)
        }
        this.selected = sessionStorage.getItem('tabs')

    }

    SumManFeature(x, y, z) {
        // alert(x+" , "+y+" , "+z)
        var run = x;
        var backObject = {
            'run': x,
            'moduleName': y,
            'suiteName': z
        }

        this.graphreport.backFreature(backObject).subscribe(result => {
            this.newBackData = result;
            console.log(this.newBackData);
            this.featureDisplay(this.newBackData)
        })

    }

    searchFeatures(x, y, z) {
        //  alert(y);
        var module = {
            'runNo': x,
            'moduleName': y,
            'suiteName': z
        }
        console.log(module);
        this.graphreport.fetchFeature(module).subscribe(
            feature => {
                this.featureData = feature;
                console.log(this.featureData);
                this.featureDisplay(this.featureData)
            });

    }
    dataSource: MatTableDataSource<any>;
    suiteLevelTable: string[] = ['Sl.No', 'Feature', 'Total Testcases', 'Pass', 'Fail', 'Skipped'];

    featureDisplay(x) {
        var featureName;
        var totalScript1 = 0;
        var totalScript = 0;
        var passed = 0;
        var failed = 0;
        var skipped = 0;
        var featureDisplay1 = [];
        // 
        console.log(this.ModuleScript);
        console.log(x);
        //  alert(x[0].totalStepsCount);
        x.forEach(function (e) {
            console.log(e.totalStepsCount)
            // this.ModuleScript =+ e.totalStepsCount;
            featureName = e._id;

            // console.log(totalScript);
            totalScript = e.totalStepsCount;
            // alert(totalScript);
            e.status.forEach(function (script) {
                totalScript1 += parseInt(script.count);
                //  alert(totalScript);
                if (script.scriptStatus == 'Fail') {

                    failed = script.count;
                    // passed = 0;
                    // skipped = 0;
                }
                if (script.scriptStatus == 'Pass') {
                    passed = script.count;
                    // skipped = 0;
                    // failed = 0;
                }
                if (script.scriptStatus == 'Skipped') {
                    skipped = script.count;
                    // passed = 0;
                    // failed = 0;
                }
            });
            var featureObject = {
                'featureName': featureName,
                'totalScript': totalScript,
                'passed': passed,
                'failed': failed,
                'skipped': skipped
            };
            featureDisplay1.push(featureObject);
        })
        this.ModuleScript = totalScript1;
        this.featureArray = featureDisplay1;
        this.featureArray.sort((a, b) => a.featureName.localeCompare(b.featureName))
        this.pieChart = Object.create(this.pieChart);
        this.stackedColumnChart = Object.create(this.stackedColumnChart)
        //  console.log(this.featureArray)
        this.featurePieChartData(featureDisplay1);
        this.charts(featureDisplay1);
    }

    //for stacked graph
    charts(x) {
        this.dbData = x;
        var B = [];
        B.push('Modules');
        B.push('Pass');
        B.push('Fail');
        B.push('Skipped');
        // B.push('');
        this.dbArray1.push(B);
        for (let j = 0; j < this.dbData.length; j++) {
            var A = [];
            A.push(this.dbData[j].featureName);
            A.push(this.dbData[j].passed);
            A.push(this.dbData[j].failed);
            A.push(this.dbData[j].skipped);
            // A.push('');
            this.dbArray1.push(A);
            this.stackedColumnChart.dataTable = this.dbArray1;
        }
        if (this.dbArray1.length != 0) {
            this.invokeGraphs = 1;
        }
    }

    public stackedColumnChart = {
        chartType: 'ColumnChart',

        dataTable: this.dbArray1,

        options: {
            width: 200,
            height: 200,
            legend: { position: 'Top' },
            bar: { groupWidth: '40%' },
            isStacked: true,
            vAxis: {
                gridlines: {
                    count: 0
                }
            },
            colors: ['green', 'red', 'orange']
        }
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
            width: 150,
            height: 150,
            legend: { position: 'bottom' },
            colors: ['green', 'red', 'orange']
            // slices: {
            // 0: {offset: 0.3},
            // 1: {offset: 0.2}
            // }
        }
    };

    featurePieChartData(data) {

        // var totalModuleScripts = 0;
        var modulePassed = 0;
        var moduleFailed = 0;
        var moduleSkipped = 0;
        data.forEach(function (e) {
            //  totalModuleScripts += e.totalScript;

            modulePassed += e.passed;
            moduleFailed += e.failed;
            moduleSkipped += e.skipped;
        })
        //  this.ModuleScript = totalModuleScripts;
        this.Passed = modulePassed;
        this.Failed = moduleFailed;
        this.Skipped = moduleSkipped;
        this.featurePie.push(this.Passed);
        this.featurePie.push(this.Failed);
        this.featurePie.push(this.Skipped);
        console.log(this.featurePie);
        this.pieChartData(this.featurePie);
    }

    selectedFeature(x) {

        this.featureSelected = x;
        window.sessionStorage.setItem("featureName", this.featureSelected);
    }

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

}