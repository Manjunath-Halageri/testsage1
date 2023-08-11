import { Component, OnDestroy, OnInit } from '@angular/core';
import { sechduleService } from '../../../../core/services/sechdularService';
import { ExecutionService } from '../../../../core/services/execution.service';
//import { Http, Response } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';


import { apiServiceComponent } from '../../../../core/services/apiService';
import { Router } from '@angular/router';

import { Post } from '../../../../post';

import { NgModel } from '@angular/forms';
import { DialogService } from '../../../../core/services/dialog.service';
import { roleService } from '../../../../core/services/roleService';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { WebExecutionService } from '../../../../core/services/web-execution.service';
import { DatePipe } from '@angular/common';
import { DecoratorService } from '../../../../core/services/decorator.service';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [sechduleService, ExecutionService, apiServiceComponent, roleService,WebExecutionService,DatePipe],
})
export class SchedulerListComponent implements OnInit, OnDestroy {

  AllSchedule = [];
  AllInpgressSchedule = [];
  AllCompletedSchedule = [];
  EditingSchedule = [];
  scheduleDetails = [];
  WeeklyDetails = [];
  hourlyDetails = [];
  name: any;
  startTime: boolean;
  endTime: boolean;
  week: boolean;
  hourly: boolean;
  weekEnd: boolean;

  startTime1: boolean;
  endTime1: boolean;
  week1: boolean;
  hourly1: boolean;
  weekEnd1: boolean;

  projectDetails: string;
  schedule: any;
  [x: string]: any;
  oldpname: any;
  newRole: any;
  pageRoles: Object = {}
  pageName: any;
  newUserName: any;
  newUserId: any;
  projectName: any;
  selectedProject: any;
  spid: any;
  AllInpgressScheduleSelect = [];
  obj: Object = {};
  activeReleaseVer: any;
  input: any;
  filter: any;
  table: any;
  tr: any;
  td: any;
  txtValue: any;
  scheduleObject: Object = {};
  angForm123: FormGroup;
  checkboxValue: any;
  update:boolean=true;
  dated: string;

  constructor(private roles: roleService, private dialogService: DialogService,
    private api: apiServiceComponent, private router: Router,private _snackBar: MatSnackBar,
    private sechdle: sechduleService, private executionService: ExecutionService,public datepipe: DatePipe, private decoratorServiceKey: DecoratorService,
    private fb: FormBuilder, private webService: WebExecutionService,) { }


  ngOnInit() {

    this.pageName = "schedulerListPage"
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    console.log(this.newUserName)
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.selectedProject = JSON.parse(this.selectedProject)
    this.spid = this.selectedProject.projectId
    console.log(this.spid)
    this.projectName = sessionStorage.getItem('key')
    console.log(this.projectName)

    this.pageRoles = {
      pageName: this.pageName,
      roleName: this.newRole,
      userId: this.newUserId
    }
    this.getRolesPermissions()

    this.obj = { 'projectId': this.spid }
    this.inchec();
    this.createForm()
    this.createObject();
    this.getSchedules();
    this.getHourly(); 
    this.interval();
    var dat = new Date();
        this.dated = dat.toISOString().split("T")[0];

    // this.sechdle.getInprogress(this.obj).subscribe(allData => { this.AllSchedule = allData; console.log(this.AllSchedule); });
    // this.sechdle.getyetToStart(this.obj).subscribe(allData => {
    //   this.AllInpgressSchedule = allData;
    //   this.AllInpgressScheduleSelect = allData;
    //   console.log(this.AllInpgressSchedule)
    // });
    // this.sechdle.getsComplted(this.obj).subscribe(allData => {
    //    this.AllCompletedSchedule = allData; 
    //    console.log(this.AllCompletedSchedule)
    //    });

    this.startTime = false
    this.endTime = false;
    this.week = false;
    this.hourly = false;
    this.weekEnd = false;
    this.checkboxValue = 0;

    this.startTime1 = false
    this.endTime1 = false;
    this.week1 = false;
    this.hourly1 = false;
    this.weekEnd1 = false;
  }//End of ngOnInt

  createForm() {
    this.angForm123 = this.fb.group({
      scheduleName: [' ', [Validators.required, ValidationserviceService.suitecreate, Validators.minLength(1), Validators.maxLength(20)]],
      desc: ['', Validators.required],
      scheduleType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      givenTime: ['', Validators.required],
      weekName: ['', Validators.required],
      hourly: ['', Validators.required],
      selectedSuite: ['', Validators.required],
      weekEnd: ['', Validators.required],
    });
  }

  createObject() {
    this.scheduleObject = {
      "_id":"1234567890",
      "scheduleName": "scheduleName",
      "desc": "description",
      "testSuite": "testSuite",
      "scheduleType": "scheduleType",
      "status": [
        {
          "startDate": new Date("01-01-2000"),
          "time": "Na"
        }
      ],
      "weekName": "Monday",
      "hourly": "1 Hourly",
      "weekend": false,
      "type":"schedule"
    }
  }

  getSchedules() {
    this.webService.getSchedulesTypes()
        .subscribe(result => {
            this.scheduleDetails = result.map((value)=>value.scheduleName)
            console.log(this.scheduleDetails)
        })
}

getHourly() {
  this.webService.getHourlyTypes()
      .subscribe(result => {
          this.hourlyDetails = result.map((value)=>value.hour+" Hour")
          console.log(this.hourlyDetails)
      })
}

  intervalUpdate: any;
  inchec() {
    this.sechdle.getInprogress(this.obj).subscribe(allData => { this.AllSchedule = allData; console.log(this.AllSchedule); });
    this.sechdle.getyetToStart(this.obj).subscribe(allData => {
      this.AllInpgressSchedule = allData;
      console.log(this.AllInpgressSchedule)
    });
    this.sechdle.getsComplted(this.obj).subscribe(allData => { this.AllCompletedSchedule = allData;
      console.log(this.AllCompletedSchedule) 
    // var sorted=  this.AllCompletedSchedule.sort((a, b) => {
    //  // return a.status.startDate ==b.status.startDate?b.status.time.localeCompare(a.status.time):b.status.startDate.localeCompare(a.status.startDate)
    //    return b.status.startDate.localeCompare(a.status.startDate)
    //   })

  const finalSorted =  this.AllCompletedSchedule.sort((a, b) => {
    const aDate = new Date(a.status.startDate).setHours(a.status.time.split(":")[0],a.status.time.split(":")[1])
    const bDate = new Date(b.status.startDate).setHours(b.status.time.split(":")[0],b.status.time.split(":")[1])
    
    return bDate - aDate
  })
  console.log(finalSorted) 
    this.AllCompletedSchedule=finalSorted;
      });
  }

  interval() {
    var startExecuteTime;
    this.intervalUpdate = setInterval(() => {
      this.sechdle.getInprogress(this.obj).subscribe(allData => { this.AllSchedule = allData; console.log(this.AllSchedule); });
      this.sechdle.getyetToStart(this.obj).subscribe(allData => {
        this.AllInpgressSchedule = allData;
         console.log(this.AllInpgressSchedule)
      });
      this.sechdle.getsComplted(this.obj).subscribe(allData => { this.AllCompletedSchedule = allData; 
        const finalSorted =  this.AllCompletedSchedule.sort((a, b) => {
          const aDate = new Date(a.status.startDate).setHours(a.status.time.split(":")[0],a.status.time.split(":")[1])
          const bDate = new Date(b.status.startDate).setHours(b.status.time.split(":")[0],b.status.time.split(":")[1])
          
          return bDate - aDate
        })
    this.AllCompletedSchedule=finalSorted;
        console.log(this.AllCompletedSchedule) });
      var date = new Date();
      var myDate = date.toISOString().split("T")[0];
      console.log(myDate)
       startExecuteTime = date.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: false })
      console.log(this.scheduleObject["status"].time,startExecuteTime,this.scheduleObject["status"].time==startExecuteTime)
    }, 2000);
    setInterval(() => {
      if (this.router.url != "/projectdetail/testExecution/Schedulerlist") {
        clearInterval(this.intervalUpdate)
      }
      // if(this.scheduleObject["status"].time==startExecuteTime)
      // {
      //   this.update=true;
      // }else{
      //   this.update=false;
      // }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalUpdate)
  }
  viewSechdule(selectedSechdule) {
    this.scheduleObject = selectedSechdule;
    this.scheduleObject["status"].startDate = this.scheduleObject["status"].startDate.split("T")[0];
    if (this.scheduleObject["endDate"] != null) {
      this.scheduleObject["endDate"] = this.scheduleObject["endDate"].split("T")[0];
    }
    if (selectedSechdule.scheduleType == "Once") {
      this.startTime = true;
      this.endTime = false;
      this.week = false;
      this.hourly = false;
      this.weekEnd = false;
    }
    else if (selectedSechdule.scheduleType == "Daily") {
      this.week = false;
      this.hourly = false;
      this.weekEnd = true;
      this.startTime = true;
      this.endTime = true;
    }
    else if (selectedSechdule.scheduleType == "Weekly") {
      this.startTime = true;
      this.endTime = true;
      this.hourly = false;
      this.weekEnd = false;
      this.week = true;
    }
    else if (selectedSechdule.scheduleType == "Monthly") {
      this.hourly = false;
      this.weekEnd = false;
      this.week = false;
      this.startTime = true;
      this.endTime = true;
    }
    else {
      this.weekEnd = false;
      this.week = false;
      this.startTime = true;
      this.endTime = true;
      this.hourly = true;
    }

  }

  startDate:any;
  time:any;
  sc:boolean;
  editSechdule(selectedSechdule) {
   // alert(selectedSechdule._id);
    //this.scheduleObject={};
    this.WeeklyDetails=[];
    this.scheduleDetails=[];
    this.hourlyDetails=[];
    this.scheduleObject =  _.cloneDeep(selectedSechdule);
    this.scheduleDetails.push(selectedSechdule.scheduleType);
    this.hourlyDetails.push(selectedSechdule.hourly)
    if(!this.checkEditAndDelete(selectedSechdule)){
      return   alert("unable to edit Schedule due to ready for execution");
    }
   this.startDate= this.scheduleObject["status"].startDate;
   this.time= this.scheduleObject["status"].time;
    this.scheduleObject["status"].startDate =  this.datepipe.transform(this.scheduleObject["status"].startDate.split("T")[0], 'yyyy-MM-dd');
    if (this.scheduleObject["endDate"] != null) {
      this.scheduleObject["endDate"] =  this.datepipe.transform(this.scheduleObject["endDate"].split("T")[0], 'yyyy-MM-dd');
    }
    this.WeeklyDetails=this.getDaysOfWeekBetweenDates(this.scheduleObject["status"].startDate, this.scheduleObject["endDate"])
    console.log(this.WeeklyDetails, this.scheduleObject ,selectedSechdule)
    if (selectedSechdule.scheduleType == "Once") {
      this.startTime1 = true;
      this.endTime1 = false;
      this.week1 = false;
      this.hourly1 = false;
      this.weekEnd1 = false;
    }
    else if (selectedSechdule.scheduleType == "Daily") {
      this.week1 = false;
      this.hourly1 = false;
      this.weekEnd1 = true;
      this.startTime1 = true;
      this.endTime1 = true;
    }
    else if (selectedSechdule.scheduleType == "Weekly") {
      this.startTime1 = true;
      this.endTime1 = true;
      this.hourly1 = false;
      this.weekEnd1 = false;
      this.week1 = true;
    }
    else if (selectedSechdule.scheduleType == "Monthly") {
      this.hourly1 = false;
      this.weekEnd1 = false;
      this.week1 = false;
      this.startTime1 = true;
      this.endTime1 = true;
    }
    else {
      this.weekEnd1 = false;
      this.week1 = false;
      this.startTime1 = true;
      this.endTime1 = true;
      this.hourly1 = true;
    }
    // this.sechdle.editInprogress(selectedSechdule._id).subscribe(allData => {
    //   this.EditingSchedule = allData;
    //   console.log(this.EditingSchedule)

    // });

  }

  checkEditAndDelete(selectedSechdule){
    var date = new Date();
    var newTime = date.getHours() + ":" + date.getMinutes()
    var d2 = new Date(0, 0, 0,date.getHours(), date.getMinutes()).getTime();
    var d1 = new Date(0, 0, 0,selectedSechdule["status"].time.split(":")[0],selectedSechdule["status"].time.split(":")[1]).getTime();
    console.log(selectedSechdule["status"].startDate.split("T")[0]  ,date.toISOString().split("T")[0],selectedSechdule["status"].time == newTime,d1,d2,d1 == d2)
    if (selectedSechdule["status"].startDate.split("T")[0] == date.toISOString().split("T")[0]) {
      if (d1==d2) {
        return this.sc=false;
      }
      else{
       return this.sc=true;
      }
  }else{
   return this.sc=true;
  }
  }

  checkStartDate(startDate, endDate, name,givenTime) {
    console.log(startDate, endDate, name)
    var date = new Date()
    var enteredDate = new Date(startDate).getDate();
    if (name == "Once") {
        if (startDate < date.toISOString().split("T")[0]) {
            alert("Start date should be greater than Current date");
            this.WeeklyDetails = [];
        } else {
         return this.checkTime(givenTime, name, startDate)
            // return true;
        }
    } else {
        if (startDate < date.toISOString().split("T")[0]) {
            alert("Start date should be greaterthan or equal to Current date");
            this.WeeklyDetails = [];
        } else if (startDate > endDate) {
            alert("start Date should be lessthan or equal to End date");
            this.WeeklyDetails = [];
        } else {
            if (startDate && endDate) {
                this.WeeklyDetails = this.getDaysOfWeekBetweenDates(startDate, endDate)
                console.log(this.WeeklyDetails)
            }
          return  this.checkTime(givenTime, name, startDate)
            //return true;
        }
    }
}

checkEndDate(fromDate, toDate) {
    console.log(fromDate, toDate)
    this.WeeklyDetails = [];
    if (fromDate && toDate) {
        this.WeeklyDetails = this.getDaysOfWeekBetweenDates(fromDate, toDate)
        console.log(this.WeeklyDetails)
    }
    // if (fromDate > toDate) {
    //     alert("FromDate should be less then ToDate");
    // }
}


checkTime(givenTime, name, startDate) {
    var date = new Date()
    var newTime = date.getHours() + ":" + date.getMinutes()
    var d2 = new Date(0, 0, 0,date.getHours(), date.getMinutes());
    var d1 = new Date(0, 0, 0,givenTime.split(":")[0],givenTime.split(":")[1]);
    console.log(givenTime, name, startDate, newTime,startDate == date.toISOString().split("T")[0],startDate < date.toISOString().split("T")[0],
    givenTime <= newTime,d1,d2,d1 <= d2);
    // var date1 = new Date(givenTime)
    // var min = date1.getMinutes() < 10 ? "0" + date1.getMinutes() : date1.getMinutes();
    // givenTime = date1.getHours() + ":" + min
    // console.log(givenTime, newTime);
    // console.log(startDate,name);

    if (name == null || name == undefined || name == "undefined") {
        alert("  Please select Schedule type..");
        this.angForm123.controls["startDate"].reset();
        this.angForm123.controls["givenTime"].reset();
    }
    else{
    if (startDate == null || startDate == undefined || startDate == "undefined") {
        alert(" Please select start date..");
        this.angForm123.controls["givenTime"].reset();
    }
//   else  if (name == "Once") {
        else  if (startDate == date.toISOString().split("T")[0]) {
                if (d1 <= d2) {
                    alert(" Selected Time should greaterthan current time");
                    this.angForm123.controls["givenTime"].reset();
                }
                else{
                  return true;
                }
            }
           else if (startDate < date.toISOString().split("T")[0]) {
                alert(" Start date should be greaterthan or equal to Current date");
                this.angForm123.controls["givenTime"].reset();
            }else{
              return true;
            }
    // }
}
// this.scheduleObject["givenTime"]=givenTime;
}


getscheduleName(scheduleName) {
    this.angForm123.controls["startDate"].reset();
    this.angForm123.controls["endDate"].reset();
    this.angForm123.controls["givenTime"].reset();
    this.angForm123.controls["weekName"].reset();
    this.angForm123.controls["hourly"].reset();
    this.WeeklyDetails = [];
    this.checkboxValue = 0;
    if (scheduleName == "Once") {
        this.startTime1 = true;
        this.endTime1 = false;
        this.week1 = false;
        this.hourly1 = false;
        this.weekEnd1 = false;
    }
    else if (scheduleName == "Daily") {
        this.week1 = false;
        this.hourly1 = false;
        this.weekEnd1 = true;
        this.startTime1 = true;
        this.endTime1 = true;
    }
    else if (scheduleName == "Weekly") {
        this.startTime1 = true;
        this.endTime1 = true;
        this.hourly1 = false;
        this.weekEnd1 = false;
        this.week1 = true;
    }
    else if (scheduleName == "Monthly") {
        this.hourly1 = false;
        this.weekEnd1 = false;
        this.week1 = false;
        this.startTime1 = true;
        this.endTime1 = true;
    }
    else {
        this.weekEnd1 = false;
        this.week1 = false;
        this.startTime1 = true;
        this.endTime1 = true;
        this.hourly1 = true;
    }
}

getCheck(event) {
    if (event.target.checked) {
        this.checkboxValue = 1;
    } else {
        this.checkboxValue = 0;
    }
}

getDaysOfWeekBetweenDates(sDate, eDate) {
  const startDate = new Date(sDate)
  const endDate = new Date(eDate);

  endDate.setDate(endDate.getDate() + 1);

  const daysOfWeek = [];

  let i = 0;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // add this at the top
  while (i < 7 && startDate < endDate) {

      daysOfWeek.push(dayNames[startDate.getDay()]); // modify this inside while loop

      //daysOfWeek.push(startDate.getDay());
      startDate.setDate(startDate.getDate() + 1);
      i++;
  }

  return daysOfWeek;
};

allData: Object = {};
scriptsSeleted = [];
updateSchedule() {
  console.log(this.scheduleObject["scheduleType"], this.scheduleObject["status"].startDate)
  console.log(this.angForm123)
  // if (this.checkboxValue == 1) {
  //     this.weekend = true;
  // } else {
  //     this.weekend = false;
  // }
  this.scheduleObject["createdBy"]=this.newUserName;
  if (this.scheduleObject["scheduleType"]) {
    if(!this.checkEditAndDelete(this.scheduleObject))
    {
      alert("unable to edit Schedule due to ready for execution");
    }
    else{
      if (this.scheduleObject["scheduleType"] == 'Once') {
          if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
              this.angForm123.controls["givenTime"].valid) {
              var booleanResult = this.checkStartDate(this.scheduleObject["status"].startDate, this.scheduleObject["endDate"], this.scheduleObject["scheduleType"],
              this.scheduleObject["status"].time  )
              console.log(booleanResult)
              if (booleanResult) {
                  
                      this.allData = {
                          data: this.scheduleObject,
                          "type": "ReSchedule",
                          "startDate":this.startDate,
                          "time":this.time
                      }
                      this.sechdle.updateSchedule(this.allData).subscribe(result => {
                        console.log(result)
                          // if (result == "duplicates") {
                          //     this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                          // } else {
                              this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'save-snackbar')
                              document.getElementById("cancelSched").click();
                              this.sechdle.getyetToStart(this.obj).subscribe(allData => {
                                this.AllInpgressSchedule = allData;
                                 console.log(this.AllInpgressSchedule)
                              });
                         // }
                      })
              }
          } else {
              alert("Please fill *(mark) mandatory fields")
          }
      }
      else if (this.scheduleObject["scheduleType"] == 'Daily') {
          if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
              this.angForm123.controls["endDate"].valid && this.angForm123.controls["givenTime"].valid) {
              var booleanResult = this.checkStartDate(this.scheduleObject["status"].startDate, this.scheduleObject["endDate"], this.scheduleObject["scheduleType"],
              this.scheduleObject["status"].time)
              console.log(booleanResult)
              if (booleanResult) {
                 
                this.allData = {
                  data: this.scheduleObject,
                  "type": "ReSchedule",
                  "startDate":this.startDate,
                  "time":this.time
              }
              this.sechdle.updateSchedule(this.allData).subscribe(result => {
                console.log(result)
                  // if (result == "duplicates") {
                  //     this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                  // } else {
                      this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'save-snackbar')
                      document.getElementById("cancelSched").click();
                      this.sechdle.getyetToStart(this.obj).subscribe(allData => {
                        this.AllInpgressSchedule = allData;
                         console.log(this.AllInpgressSchedule)
                      });
                 // }
              })
              }
          } else {
              alert("Please fill *(mark) mandatory fields")
          }
      }
      else if (this.scheduleObject["scheduleType"] == 'Weekly') {
          if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
              this.angForm123.controls["endDate"].valid && this.angForm123.controls["givenTime"].valid && this.angForm123.controls["weekName"].valid) {
              var booleanResult = this.checkStartDate(this.scheduleObject["status"].startDate, this.scheduleObject["endDate"], this.scheduleObject["scheduleType"],
              this.scheduleObject["status"].time)
              console.log(booleanResult)
              if (booleanResult) {
                  
                this.allData = {
                  data: this.scheduleObject,
                  "type": "ReSchedule",
                  "startDate":this.startDate,
                  "time":this.time
              }
              this.sechdle.updateSchedule(this.allData).subscribe(result => {
                console.log(result)
                  // if (result == "duplicates") {
                  //     this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                  // } else {
                      this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'save-snackbar')
                      document.getElementById("cancelSched").click();
                      this.sechdle.getyetToStart(this.obj).subscribe(allData => {
                        this.AllInpgressSchedule = allData;
                         console.log(this.AllInpgressSchedule)
                      });
                 // }
              })
              }
          } else {
              alert("Please fill *(mark) mandatory fields")
          }
      }
      else if (this.scheduleObject["scheduleType"] == 'Monthly') {
          if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
              this.angForm123.controls["endDate"].valid && this.angForm123.controls["givenTime"].valid) {
              var booleanResult = this.checkStartDate(this.scheduleObject["status"].startDate, this.scheduleObject["endDate"], this.scheduleObject["scheduleType"],
              this.scheduleObject["status"].time)
              console.log(booleanResult)
              if (booleanResult) {
                 
                this.allData = {
                  data: this.scheduleObject,
                  "type": "ReSchedule",
                  "startDate":this.startDate,
                  "time":this.time
              }
              this.sechdle.updateSchedule(this.allData).subscribe(result => {
                console.log(result)
                  // if (result == "duplicates") {
                  //     this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                  // } else {
                      this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'save-snackbar')
                      document.getElementById("cancelSched").click();
                      this.sechdle.getyetToStart(this.obj).subscribe(allData => {
                        this.AllInpgressSchedule = allData;
                         console.log(this.AllInpgressSchedule)
                      });
                 // }
              })
              }
          } else {
              alert("Please fill *(mark) mandatory fields")
          }
      }
      else if (this.scheduleObject["scheduleType"] == 'Hourly') {
          if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
              this.angForm123.controls["endDate"].valid && this.angForm123.controls["givenTime"].valid && this.angForm123.controls["hourly"].valid) {
              var booleanResult = this.checkStartDate(this.scheduleObject["status"].startDate, this.scheduleObject["endDate"], this.scheduleObject["scheduleType"],
              this.scheduleObject["status"].time)
              console.log(booleanResult)
              if (booleanResult) {
                  
                this.allData = {
                  data: this.scheduleObject,
                  "type": "ReSchedule",
                  "startDate":this.startDate,
                  "time":this.time
              }
              this.sechdle.updateSchedule(this.allData).subscribe(result => {
                console.log(result)
                  // if (result == "duplicates") {
                  //     this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                  // } else {
                      this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'save-snackbar')
                      document.getElementById("cancelSched").click();
                      this.sechdle.getyetToStart(this.obj).subscribe(allData => {
                        this.AllInpgressSchedule = allData;
                         console.log(this.AllInpgressSchedule)
                      });
                 // }
              })
              }
          } else {
              alert("Please fill *(mark) mandatory fields")
          }
      }
    }
  } else {
      alert("Please fill *(mark) mandatory fields")
  }

}

cancel() {
  this.startTime = false
  this.endTime = false;
  this.week = false;
  this.hourly = false;
  this.weekEnd = false
  // this.checkboxValue = 0;
  // this.scheduleObject = {};
  // this.angForm123.reset();
}

  deleteSechdule(SechduleDelete) {
    this.scheduleObject =  _.cloneDeep(SechduleDelete);
    if(this.checkEditAndDelete(SechduleDelete)){
      this.dialogService.scheduleDialog('Are you sure to delete schedule ?')
      .afterClosed().subscribe(res => {
        console.log(res)
        if (res) {
          if(!this.checkEditAndDelete(this.scheduleObject))
          {
            alert("unable to edit Schedule due to ready for execution");
          }else{
          this.sechdle.deletesechdule(SechduleDelete).subscribe(result => {
            this._snackBar.open("Deleted Successfully", "CANCEL", {
              duration: 3000,
            });
            this.sechdle.getyetToStart(this.obj).subscribe(allData => {
              this.AllInpgressSchedule = allData;
              console.log(this.AllInpgressSchedule)
            });
          })
        }
        }
      })
    }else{
      alert("unable to delete Schedule due to ready for execution");
    }
  }

  updateall(editedDetails) {
    console.log(editedDetails)
    this.schedule.updateEditData(editedDetails).subscribe(data => {
      this.sechdle.getyetToStart(this.obj).subscribe(allData => { this.AllInpgressSchedule = allData; console.log(this.AllInpgressSchedule) });
    });
  }

  permissions = [];
  edit: boolean
  read: boolean
  delete: boolean
  create: boolean;

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
      })
  }


  getSchedule(ScheduleName) {
    alert(ScheduleName);
    if (ScheduleName != undefined) {
      // this.http.get(this.api.apiData + '/getSelectedSchedule' + ScheduleName, {})
      //   .map((response: Response) => <Post[]>response.json())
      //   .subscribe(result1 => {
      //     this.AllInpgressSchedule = result1;

      //     console.log(this.AllInpgressSchedule);


      //   });
    }
    else {
      alert("PLEASE SELECT AND SEARCH")
    }
  }

  myFunction() {
    let i;
    this.input = document.getElementById("myInput");
    this.filter = this.input.value.toUpperCase();
    this.table = document.getElementById("myTable");
    this.tr = this.table.getElementsByTagName("tr");
    for (i = 0; i < this.tr.length; i++) {
      this.td = this.tr[i].getElementsByTagName("td")[0];
      if (this.td) {
        this.txtValue = this.td.textContent || this.td.innerText;
        if (this.txtValue.toUpperCase().indexOf(this.filter) > -1) {
          this.tr[i].style.display = "";
        } else {
          this.tr[i].style.display = "none";
        }
      }
    }
  }

}

