import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { DefectDashboardService } from '../../../../core/services/defect-dashboard.service';
import { DashboardService } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-defect-progress-graph',
  templateUrl: './defect-progress-graph.component.html',
  styleUrls: ['./defect-progress-graph.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class DefectProgressGraphComponent implements OnInit {

  lineGraphForm: any;
  fromDate: any;
  toDate: string;
  releaseVersion: any;
  reportData: any;
  obj: any;
  getallData: any;
  displayTestData: boolean;
  displatgraphData: boolean;
  toppings = new FormControl();
  toppingList: string[] = ['totalPriority','P1','P2','P3','P4'];
  selProjectName: string;
  allProData: any;
  mydata: any;
  golbalReportDataLength: any;
  displayDataToGraph = [];
  projectId: any;
  reportDataGolbalArray = [];
  p1Array = [];
  p2Array = [];
  p3Array = [];
  p4Array = [];
  totalPriorityArray = [];
  p1Array1 = []
  totalPriorityArray1 = []
  p2Array1 = [];
  p3Array1 = [];
  p4Array1 = []
  highcharts = Highcharts;
  chartOptions;
  chartsData = []
  sideCol3: boolean;
   fromDatea: boolean;
   toDatea: boolean;
   reportDisable: { id: string; name: string; }[];
   fromDatedisable: { id: string; name: string; }[];
   toDatedisable: { id: string; name: string; }[];
   getAllReleasesVersions: any;

  constructor(private fb: FormBuilder, private defectdashboardService: DefectDashboardService,private dashboardservice: DashboardService) {
     this.lineGraphForm = fb.group({
      'releaseVersion': ['', Validators.required],
        'releaseField': ['', Validators.required],
        'reportField': ['', Validators.required],
        'startdate': ['', Validators.required],
        'enddate': ['', Validators.required]
     });
     
  }

  ngOnInit() {
   this.selProjectName = sessionStorage.getItem('key');
   this.obj = {
      "projectSelection": this.selProjectName
   }
   // console.log(this.selProjectName)
   this.dashboardservice.getModuleFields(this.obj)
      .subscribe((data) => {
         this.allProData = data;
         this.projectId = this.allProData.projectId
         console.log(this.projectId);
         this.getAllReleases(this.projectId)
      })
  }
  allProjectData(event) {
   //   alert(event);
     console.log(event)

       if (event != 'totalPriority' || "P1" || "P2" || "P3" || "p4") {
         //   this.lineGraphForm.get('state').reset();
           this.lineGraphForm.get('startdate').disable();
           this.lineGraphForm.get('enddate').disable(); 
       }
        else if(event = '' || null || undefined || "" || []){
           alert("els if")
         this.lineGraphForm.get('startdate').enable();
         this.lineGraphForm.get('enddate').enable();
         this.lineGraphForm.reset()
       }
       else
       return
  }

  reportDataFun: (y: any) => void;

  fetchLineData(releaseVersion, reportData, startDate, endDate) {
     console.log(releaseVersion)
     this.sideCol3 = true;
     this.golbalReportDataLength = [];
     this.reportDataGolbalArray = [];
     this.p1Array = [];
     this.p2Array = [];
     this.p3Array = [];
     this.p4Array = [];
     this.totalPriorityArray = [];
     this.displatgraphData = true;
     var a = `${startDate}T00:00:00Z`;
     var b = `${endDate}T23:59:59Z`;
     this.golbalReportDataLength = reportData.length;
     this.reportDataFun = function (y) {

        if (y < this.golbalReportDataLength) {

        
           this.defectdashboardService.searchPriorityReport( {
              "reportData": reportData[y],
              "startedAt": a,
              "endedAt": b,
            //   "projectId": this.projectId,
              "releaseVersion" : releaseVersion
           })
              .subscribe(async (doc) => {
                 // console.log(doc[0].count)
                 await this.golbalCallToPushReportData(doc)
                 console.log(doc)
                 this.lineGraphForm.get('startdate').enable();
                this.lineGraphForm.get('enddate').enable();
               this.lineGraphForm.reset()
              })
           this.reportDataFun(y + 1)
        }
     }
     this.reportDataFun(0);
  }

  golbalCallToPushReportData(value) {
     console.log(value)
     this.reportDataGolbalArray.push(value)
     if (this.golbalReportDataLength === this.reportDataGolbalArray.length) {
        this.displayDataToGraph = this.reportDataGolbalArray;
        console.log(this.displayDataToGraph[0])
        this.loopIt(this.displayDataToGraph)

     }

  }

  loopIt(data) {
     console.log(data)
     data.forEach(e => {
        e.forEach(ele => {
           if (ele.testcaseStatus === "P1") {
              this.p1Array.push(parseInt(ele.count))
              this.p1Array1.push(ele.date)
           }
           else if (ele.testcaseStatus === "totalPriority") {
              this.totalPriorityArray.push(parseInt(ele.count))
              this.totalPriorityArray1.push(ele.date)
           }
           else if (ele.testcaseStatus === "P2") {
              this.p2Array.push(parseInt(ele.count))
              this.p2Array1.push(ele.date)
           }
           else if (ele.testcaseStatus === "P3") {
            this.p3Array.push(parseInt(ele.count))
            this.p3Array1.push(ele.date)
         }
         else if (ele.testcaseStatus === "P4") {
          this.p4Array.push(parseInt(ele.count))
          this.p4Array1.push(ele.date)
       }
           else { return; }
        });
        this.itsDoneJustDisplay(this.displayDataToGraph)
     });

  }

  itsDoneJustDisplay(displayDataToGraph) {
     console.log(displayDataToGraph)
     this.chartsData.push(this.displayDataToGraph)
     console.log( this.chartsData)
   console.log(this.totalPriorityArray1)
   console.log(this.totalPriorityArray)
     this.chartOptions = {
        chart: {
           type: "spline"
        },
        title: {
           text: "Priority bugs list datewise"
        },

        xAxis: {
           title: {
              text: "Datewise priority bugs"
           },
           categories: this.totalPriorityArray1
        },
        yAxis: {
           title: {
              text: "Priority-wise bugs count"
           },
        },

        series: [
           {
              name: "TotalPriority",
              data: this.totalPriorityArray, color: 'blue'
           },
           {
              name: "P1",
              data: this.p1Array, color: 'green'
           },
           {
              name: "P2",
              data: this.p2Array, color: 'red'
           },
           {
            name: "P3",
            data: this.p3Array, color: 'black'
         },
         {
          name: "P4",
          data: this.p4Array, color: 'orange'
       }
        ]
     };
  }

  getAllReleases(projectId){
     console.log(projectId)
   var obj = {
     "projectId": projectId
   }
   this.defectdashboardService.getAllReleaseVersions(obj)
   .subscribe((data) => {
      console.log(data)
     this.getAllReleasesVersions = data;
 
   })
 
  }
}
