import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../../../../core/services/tracking.service';
import { roleService } from '../../../../core/services/roleService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class TrackingComponent implements OnInit {
  Names: any;
  times: any;
  settime: any;
  timetaken: string;
  stoptime: any;
  EstimatedTime: string;
  selectedProject: any;
  saveEnable: boolean;
  thresholdFailPercentage: any;
  thresholdminimumScripts: any;
  ExitFailurePercentage: any;
  exitData: boolean;
  userName: string;
  pageName: string;
  newRole: string;
  newUserId: string;
  newUserName: string;
  pageRoles: {};
  suiteName: any;
  emailArray: any;
  RunNo: any;

  constructor(
    private trackingService: TrackingService, private roles: roleService, private router: Router
  ) { }

  ngOnInit() {
    //this.saveEnable = true
    this.exitData == false
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.selectedProject = JSON.parse(this.selectedProject)
    this.userName = sessionStorage.getItem('userName')
    this.track()
    this.thresholdPercentage()
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    this.pageName = "trackingPage"
    this.pageRoles = {
      pageName: this.pageName,
      roleName: this.newRole,
      userId: this.newUserId,
      userName: this.newUserName
    }
    this.getRolesPermissions();
  }

  /* logic Description: fetch the roles and permissions based on user role
  */
  permissions = [];
  edit: boolean
  read: boolean
  deletePage: boolean
  create: boolean;
  getRolesPermissions() {
    console.log(this.pageRoles);
    this.roles.getPermissions(this.pageRoles).subscribe(
      Data => {
        this.permissions = Data; console.log(this.permissions);
        this.edit = this.permissions[0].edit;
        this.read = this.permissions[0].read
        this.deletePage = this.permissions[0].delete
        this.create = this.permissions[0].create
        console.log(this.permissions);
      })
  }

  /* logic Description: fetch failPercentage and minimumScripts of fail
  */
  thresholdPercentage() {
    this.trackingService.thresholdPercentageCall()
      .subscribe((res) => {
        console.log(res)
        this.thresholdFailPercentage = res[0].failurePercentage
        this.thresholdminimumScripts = res[0].minimumScripts
      })
  }

  /* logic Description: fetching the track details for every 1sec until no suites are executing
     and display some details in UI
  */
  calls: any;
  calltime: any;
  track() {

    this.calls = setInterval(() => {
      let projectId = this.selectedProject.projectId;
      let obj = {
        "projectId": projectId,
        "userId": this.newUserId,
        "roleName": this.newRole,
      }
      this.trackingService.getTrackDetails(obj)
        .subscribe(Data => {
          // if(this.exitData == true){
          //   this.Names = null
          // }
          // else{
          this.Names = Data;
          console.log(this.Names)
          // }
          if (this.router.url != "/projectdetail/testExecution/Tracking") {
            clearInterval(this.calls)
            this.Names = null
          } else {
            if (this.Names != 'fail') {
              this.Names.sort((a, b) => a.RunNo.localeCompare(b.RunNo))
              // this.ExitFailurePercentage = this.Names[0].failPercentage
              // if(this.Names[0].TotalTestcases >= this.thresholdminimumScripts && this.Names[0].failPercentage > this.thresholdFailPercentage)
              // {
              //   this.saveEnable = false;
              // }
              this.Names.forEach(element => {
                element.stopEnable = false;
                if (element.TotalTestcases >= this.thresholdminimumScripts && element.failPercentage > this.thresholdFailPercentage) {
                  element.stopEnable = true;
                }
                // if (element.pendingCount == 0) {

                //   element.FailCount = ''
                //   clearInterval(this.calls)

                //   this.stoptime = true
                //   this.Names = null
                // }

              });
              console.log(this.Names)
            }
            else {
              clearInterval(this.calls)
              this.Names = null
            }
          }
        });

    }, 1000);
    let date = new Date();
    let hours2 = date.getHours()
    let minutes2 = date.getMinutes()
    let seconds2 = date.getSeconds()
    let projectId1 = this.selectedProject.projectId
    let obj1 = {
      "projectId": projectId1
    }
    this.trackingService.getTrackDetails(obj1)
      .subscribe(Data => {
        this.settime = Data;
        if (this.settime != 'fail') {
          this.settime.forEach(element => {

            let timew = element.TimeTaken
            let estimatedtaken = element.estimated
            let totalDate = element.totalDate
            let estimatedHours = Math.floor(estimatedtaken / 3600)
            let estimatedMinute = Math.floor((estimatedtaken - (estimatedHours * 3600)) / 60)
            let estimatedMinutes = estimatedMinute - 1
            let estimatedSeconds = 60
            let timeq = timew.split("-")
            let hours1 = timeq[0]
            let minutes1 = timeq[1]
            let seconds1 = timeq[2]
            let hours = hours2 - hours1
            let minutes = Math.abs(minutes2 - minutes1)
            let seconds = Math.abs(seconds2 - seconds1)
            let days = totalDate
            this.calltime = setInterval(() => {
              estimatedSeconds--
              seconds++
              if (estimatedHours == 0 && estimatedMinutes == 0 && estimatedSeconds == 0) {
                estimatedHours = 0
                estimatedMinutes = 0
                estimatedSeconds = 0
              }
              if (estimatedSeconds == 0) {
                estimatedSeconds = 60
                estimatedMinutes--
              }
              if (estimatedMinutes == 0 && estimatedHours != 0) {
                estimatedMinutes = 60
                estimatedHours--
              }

              if (seconds == 60) {
                seconds = 0
                minutes++
              }
              if (minutes == 60) {
                minutes = 0
                hours++
              }
              if (hours == 25) {
                hours = 1
                days++
              }
              this.EstimatedTime = totalDate + "d:" + estimatedHours + "h:" + estimatedMinutes + "m:" + estimatedSeconds + "s"
              this.timetaken = days + "d:" + hours + "h:" + minutes + "m:" + seconds + "s"
              if (this.stoptime == true) {
                clearInterval(this.calltime)
                hours = 0
                minutes = 0
                seconds = 0
                estimatedHours = 0
                estimatedMinutes = 0
                estimatedSeconds = 0
                this.timetaken = ''
                this.EstimatedTime = ''
              }
            }, 1000);
          });
        }
      });
  }

   /* logic Description:when user click on stop button on any suite row
  */
  displayModal(data,i){
     console.log(data,i);
     this.ExitFailurePercentage = data.failPercentage
     this.RunNo=data.RunNo;
     this.suiteName=data.SuiteName;
     this.emailArray=data.email[0]
  }

   /* logic Description: when user click on stop button on stop modal, 
    then stops the suite execution and remove from tracking DB
  */
  thresholdExit() {
    // this.saveEnable = true
    this.exitData = true;
    this.timetaken = ''
    this.EstimatedTime = ''

    // clearInterval(this.calls)
    // clearInterval(this.calltime)

    let obj = {
      "RunNo": this.RunNo,
      "projectId": this.selectedProject.projectId,
      "emailArray": this.emailArray,
      "userName": this.userName,
      "suiteName": this.suiteName
    }
    console.log(obj)
    this.trackingService.thresholdExitCall(obj)
      .subscribe((res) => {
        // alert(res)
        console.log(res)
        //this.Names = null
      })
  }


}
