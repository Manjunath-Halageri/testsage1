import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { roleService } from '../../../../core/services/roleService';

@Component({
   selector: 'app-progress-graph',
   templateUrl: './progress-graph.component.html',
   styleUrls: ['./progress-graph.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class ProgressGraphComponent implements OnInit {
   pageRoles: Object = {}
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
   toppingList: string[] = ['Executed', 'Pass', 'Fail'];
   selProjectName: string;
   allProData: any;
   mydata: any;
   golbalReportDataLength: any;
   displayDataToGraph = [];
   projectId: any;
   reportDataGolbalArray = [];
   passedArray = [];
   failedArray = [];
   executedArray = [];
   passedArray1 = []
   executedArray1 = []
   failedArray1 = []
   highcharts = Highcharts;
   chartOptions;
   chartsData = []
   sideCol3: boolean;
   getAllReleasesVersions: any;
   pageName: any;
   newRole: any;
   newUserId: any;
   newUserName: any;
   selectedProject: any;

   constructor(private fb: FormBuilder, private api: apiServiceComponent,
      private dashboardservice: DashboardService,
      private roles: roleService) {
      this.lineGraphForm = fb.group({
         'releaseField': ['', Validators.required],
         'reportField': ['', Validators.required],
         'startdate': ['', Validators.required],
         'enddate': ['', Validators.required]
      });
   }

   ngOnInit() {
      this.pageName = "testExecutionProgressPage"
      this.newRole = sessionStorage.getItem('newRoleName');
      this.newUserId = sessionStorage.getItem('newUserId');
      this.newUserName = sessionStorage.getItem('userName')
      this.selectedProject = sessionStorage.getItem('selectedProject')
      this.selectedProject = JSON.parse(this.selectedProject)

      this.pageRoles = {
         pageName: this.pageName,
         roleName: this.newRole,
         userId: this.newUserId

      }

      this.getRolesPermissions();

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
            this.getAllReleases(this.projectId)
         })
   }
   allProjectData(allProjectData: any) {
      throw new Error("Method not implemented.");
   }

   createPageDetails(projectId) {

      // console.log(projectId);
      this.dashboardservice.searchReportData(this.projectId)
         .subscribe((data) => {
            // console.log(data);
            this.getallData = data;

         })
   }
   reportDataFun: (y: any) => void;
   fetchLineGraphData(releaseVersion, reportData, startDate, endDate) {
      this.sideCol3 = true;
      this.golbalReportDataLength = [];
      this.reportDataGolbalArray = [];
      this.passedArray = [];
      this.failedArray = [];
      this.executedArray = [];
      this.displatgraphData = true;
      var a = `${startDate}T00:00:00Z`;
      var b = `${endDate}T23:59:59Z`;
      this.golbalReportDataLength = reportData.length;
      this.reportDataFun = function (y) {

         if (y < this.golbalReportDataLength) {
            this.dashboardservice.searchLineGraphData({
               "releaseVersion": releaseVersion,
               "reportData": reportData[y],
               "startedAt": a,
               "endedAt": b,
               "projectId": this.projectId
            })
               .subscribe(async (doc) => {
                  await this.golbalCallToPushReportData(doc)
               })
            this.reportDataFun(y + 1)
         }
      }
      this.reportDataFun(0);
   }

   golbalCallToPushReportData(value) {
      this.reportDataGolbalArray.push(value)
      if (this.golbalReportDataLength === this.reportDataGolbalArray.length) {
         this.displayDataToGraph = this.reportDataGolbalArray;
         // console.log(this.displayDataToGraph[0])
         this.loopIt(this.displayDataToGraph)

      }

   }

   loopIt(data) {
      data.forEach(e => {
         e.forEach(ele => {
            if (ele.testcaseStatus === "Pass") {
               this.passedArray.push(parseInt(ele.count))
               this.passedArray1.push(ele.date)
            }
            else if (ele.testcaseStatus === "Executed") {
               this.executedArray.push(parseInt(ele.count))
               this.executedArray1.push(ele.date)
               // console.log(this.executedArray)
            }
            else if (ele.testcaseStatus === "Fail") {
               this.failedArray.push(parseInt(ele.count))
               this.failedArray1.push(ele.date)
            }
            else { return; }
         });
         this.itsDoneJustDisplay(this.displayDataToGraph)
      });

   }

   itsDoneJustDisplay(displayDataToGraph) {
      // console.log("check")
      this.chartsData.push(this.displayDataToGraph)
      console.log(this.executedArray)
      this.chartOptions = {
         chart: {
            type: "spline",
            style: {
               fontFamily: 'sans-serif',
               fontSize:'15px'
           }
         },
         credits: {
            enabled: false
         },
         title: {
            text: "Testcase Reports",
            style: {
               fontFamily: 'sans-serif',
               fontSize:'16px',
               fontWeight: 'bold'
           }
         },

         xAxis: {
            title: {
               text: "Total Testcase Pass",
               style: {
                  fontFamily: 'sans-serif',
                  fontSize:'14px',
              }
            },
            categories: this.executedArray1
         },
         yAxis: {
            title: {
               text: "Testcase count",
               style: {
                  fontFamily: 'sans-serif',
                  fontSize:'14px',
              }
            },
         },

         series: [
            {
               name: "Executed",
               data: this.executedArray, color: 'blue'
            },
            {
               name: "Pass",
               data: this.passedArray, color: 'green'
            },
            {
               name: "Fail",
               data: this.failedArray, color: 'red'
            }
         ]
      };
   }
   getAllReleases(projectId) {
      var obj = {
         "projectId": projectId
      }
      this.dashboardservice.getAllRelease(obj)
         .subscribe((data) => {
            this.getAllReleasesVersions = data;
            this.getAllReleasesVersions.sort((a, b) => a.releaseVersion.localeCompare(b.releaseVersion))
         })

   }

   permissions = [];
   edit: boolean
   read: boolean
   delete: boolean
   create: boolean;
   disableButton: boolean;


   getRolesPermissions() {
      console.log(this.pageRoles);
      this.roles.getPermissions(this.pageRoles).subscribe(
         Data => {
            this.permissions = Data; console.log(this.permissions);
            console.log(this.permissions);

            this.edit = this.permissions[0].edit;
            this.read = this.permissions[0].read
            this.delete = this.permissions[0].delete
            this.create = this.permissions[0].create
            this.disableButton = this.permissions[0].disableButton

         })


   }
}
