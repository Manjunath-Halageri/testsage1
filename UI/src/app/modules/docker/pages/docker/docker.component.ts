import { Component, OnInit } from '@angular/core';

// import 'rxjs/add/operator/map';
import { DockerService } from '../../../../core/services/dockerService'
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from '../../../../core/services/dialog.service'



import { apiServiceComponent } from '../../../../core/services/apiService';
import { roleService } from '../../../../core/services/roleService';
import { count } from 'rxjs/operators';


@Component({
  selector: 'app-docker',
  templateUrl: './docker.component.html',
  styleUrls: ['./docker.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [apiServiceComponent, roleService],
})
export class DockerComponent implements OnInit {


  // machine: any;
  // dbmachine: any;
  // dockerObject: Object = {}
  // newRole: any;
  // pageRoles: Object = {}
  // pageName: any;
  // newUserName: any;
  // newUserId: any;
  // userForm: any;
  // stopppp:boolean;
  // playy1:boolean;
  // machineStatus2:any;

  // waitingObject: { "machineName": any; };
  // dbmachine2: Post[];

  enableCreateBtn: boolean;
  browsersLength: any;

  displayedColumns: string[] = ['Slno', 'OrganizationName', 'OrganizationID', 'MachineType', 'Browsers', 'Start', 'Stop', 'Status', 'Edit'];//,'Timer'
  displayVersions: string[] = ['Slno', 'Name'];
  displayedJmeterColumns: string[] = ['Slno', 'OrganizationName', 'OrganizationID', 'MachineType', 'Browsers', 'Start', 'Stop', 'Status'];
  constructor(private infrastructureServices: DockerService,
    private _snackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private dialogService: DialogService) {
    this.enableCreateBtn = false;
    this.browsersLength = 0;
  }//,private SpinnerService: NgxSpinnerService 


  ngOnInit() {

    // this.userNAME();
    // this.pageName = "dokerPage"
    // this.newRole = sessionStorage.getItem('newRoleName');
    // this.newUserId = sessionStorage.getItem('newUserId');
    // this.newUserName = sessionStorage.getItem('userName')
    // this.showingMachineTable();

    // this.pageRoles = {
    //   pageName: this.pageName,
    //   roleName: this.newRole,
    //   userId: this.newUserId

    // }


    // this.getRolesPermissions()

    this.load();
    this.jLoad();
  }

  tempData: any;
  updateId: any;
  tableData: any;
  selectedValue: string;
  machineName: string;
  machineType: string;
  orgId: number;
  organizationName: string;
  maxBrowser: number;
  browserData: any;
  organization: string;
  planType: any;
  expiryDtae: Date;
  _id: Number;
  dockerObject = [];
  browser1 = "Chrome";
  browser2 = "Firefox";
  _full: Number = 0;
  _max: Number = 0;
  _remaning: Number = 0;
  disableUser: boolean;
  disableExecution: boolean;
  check: any;
  myGreeting: any;
  tableJmeterData: any;

  filterMachineType=[];

  /* logic description: get the available machines in organization
  */
  load() {
    this.tableData = [];
    this.tempData = [];

    let obj = {
      orgId: Number(sessionStorage.getItem('orgId'))
    }
    console.log("The org ID may be ", obj)
    this.infrastructureServices.getMachines(obj).subscribe(result => {
      this.tableData = result;
      this.tempData = result;
      console.log(this.tableData);
      this.filterMachineType=this.tableData.filter((obj)=>obj.machineType=="jmeterExecutionMachine")
      console.log("USER MACHINE STATUS", result[0].state,this.filterMachineType);
      console.log("EXECUTION MACHINE STATUS", result[1].state);

    })

  }

  /* logic description: get the jmeter container available Jmetermachines in organization
  */
  jLoad() {
    this.tableJmeterData = [];
    let obj = {
      orgId: Number(sessionStorage.getItem('orgId'))
    }
    // this.num=Number(sessionStorage.getItem('orgId'));
    console.log("The org ID is ", obj)
    this.infrastructureServices.getJMachines(obj).subscribe(result => {
      this.tableJmeterData = result;
      console.log(this.tableJmeterData);
    })

  }

  /* logic description: start the machines
  */
  rowStart(i: any) {
    let machineType = this.tableData[i].machineType;
    console.log(this.tableData[i])
    let object = Object.assign({}, this.tableData[i]);
    if (machineType == 'jmeterExecutionMachine' || machineType == 'jmeterUsersMachine') {
      this.SpinnerService.show();
      this.infrastructureServices.startJMachine(object).subscribe(result => {
        this.load();
        this.jLoad();
        this.SpinnerService.hide();
        this._snackBar.open("Started Sucessfully", "CANCEL", {
          duration: 5000
        })
      })
    }
    else {
      this.SpinnerService.show();
      this.infrastructureServices.machineStart(object).subscribe(result => {
        console.log("Result", result)
        this.load();
        this.jLoad();
        this.SpinnerService.hide();
        this._snackBar.open("Started Sucessfully", "CANCEL", {
          duration: 5000,
        });
        // this.check = setInterval(() => {
        //   console.log("INSIDE INTERVAL");
        //   // this.load()
        //   var isRunning = checkRunning(object);
        // }, 30000);

      })

      // this.orgId = this.tableData[i].orgId;
      // var checkRunning = (object) => {
      //   console.log("INSIDE INTERVAL function")
      //   this.infrastructureServices.checkInDb(object).subscribe(result => {
      //     console.log("Result", result);
      //     if (result[0].state == "Running") {
      //       this.load();
      //       clearInterval(this.check);
      //     }
      //   })
      // }
      //callSettimeOut();
    }

/* logic description: not used (stopping the machine is not using within 20mins)
  */
    function callSettimeOut() {
      if (machineType !== "usersMachine") {

        setTimeout(function () {
          console.log("INSIDE SET TIMEOUTTTTTTTTTTTtt")
          callStop(object);

        }, 1200 * 1000)//1200*1000= 20 Min

      }
    }
    var callStop = (object) => {
      this.infrastructureServices.autoStop(object).subscribe(result => {
        console.log("Result", result);
        if (result == "Fail") {
          this.load();
          callSettimeOut(); //call settimeout once again
        }
        else {
          this.load();
        }
      });
    }
  }

/* logic description: stop the machine
  */
  rowStop(i: any) {
    this.dialogService.nlpDialog("Are You Sure...?")
      .afterClosed().subscribe((res) => {
        if (res) {
          console.log(this.tableData[i])
          let object = Object.assign({}, this.tableData[i]);
          this.SpinnerService.show();
          this.infrastructureServices.machineStop(object).subscribe(result => {
            console.log("Result", result)
            this.load();
            this.jLoad();
            this.SpinnerService.hide();
            this._snackBar.open("Stopped Sucessfully", "CANCEL", {
              duration: 5000,
            });
            // this.check = setInterval(() => {
            //   console.log("INSIDE INTERVAL");
            //   // this.load()
            //   var isRunning = checkRunning(object);
            // }, 30000);
          })
          // var checkRunning = (object) => {
          //   console.log("INSIDE INTERVAL function")
          //   this.infrastructureServices.checkInDb(object).subscribe(result => {
          //     console.log("Result", result);
          //     if (result[0].state == "Stopped") {
          //       this.load();
          //       clearInterval(this.check);
          //     }
          //   })
          // }
        }
      })
  }
/* logic description: when click on edit of execution machine of containers
  */
  editModal(i: any) {
    if (this.tableData[i].machineType !== "usersMachine") {
      this.row(i);
    }
  }

  row(i: any) {
    this.browsersLength = this.tableData[i].machineDetails[0].allConatinerName.length;
    this.dockerObject = [];
    this.orgId = this.tableData[i].orgId;
    var cid = this.tableData[i]._id;
    let obj = {
      orgId: Number(this.orgId),
      collectionId: cid
    }
    this.infrastructureServices.getOrgDetails(obj).subscribe(result => {
      console.log(result);
      this.planType = result[0].planType.planName;
      this.expiryDtae = result[0].planType.endDate;
      this._max = result[1];
      this._full = this._max;
      this._remaning = this.maxBrowser - Number(this._max);
      console.log(this._remaning)
    })
    this.machineName = this.tableData[i].machineName;
    this.machineType = this.tableData[i].machineType;
    this.maxBrowser = this.tableData[i].maxBrowser;
    this.browserData = this.tableData[i].machineDetails[0].browsers;
    this.organization = this.tableData[i].organizationName;
    this.updateId = this.tableData[i]._id;
    this.enableCreateBtn = false;
    document.getElementById("hideUserMachine").click();


    // this.SpinnerService.show()
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.SpinnerService.hide();
    // }, 6000);
  }

  /* logic description: removing the browsers in execution machine
  */
  delete(id: any, name: any) {
    console.log(id);
    console.log(name)
    console.log(this.updateId)
    console.log(this.machineName)
    this.dialogService.nlpDialog("Are you sure you want to Delete..? ")
      .afterClosed().subscribe(res => {
        if (res) {
          let obj = {
            collectionID: this.updateId,
            imageName: name,
            imageID: id,
            machine: this.machineName
          }

          this.SpinnerService.show()
          this.infrastructureServices.removeContainer(obj).subscribe(result => {
            if (result.length != 0) {
              document.getElementById("cancelBtn").click();
              this.SpinnerService.hide();
              this.load();
              console.log("End Result", result)
              this.dockerObject = [];
              this.browserData = result[0].machineDetails[0].browsers;
              this._max = result[1];
              this._full = this._max;

              this._remaning = this.maxBrowser - Number(this._max);
              this._snackBar.open("Removed Sucessfully", "CANCEL", {
                duration: 5000,
              });
            }
          })
        }
      })
  }

  //not using
  clear() {
    this.selectedValue = '';
    this.tableData = this.tempData;
  }

  /* logic description: validating the browsers count
  */
  validateInput(count, i) {
    if (count > 0) {
      var sum = 0;
      for (var k = 0; k < this.dockerObject.length; k++) {
        sum = sum + this.dockerObject[k].count;
      }
      for (var j = 0; j < this.dockerObject.length; j++) {
        if (this.dockerObject[j].count == 0)
          return
      }
      this.enableCreateBtn = true;
    }
    else {
      this.enableCreateBtn = false;
    }
    if (sum > this.maxBrowser - this.browsersLength) {
      this.enableCreateBtn = false;
      this.dockerObject[i].count = 0;
      alert("Cannot have more than " + this.maxBrowser + " Browsers")
    }
  }

  /* logic description: function for enabling and disabling the add button based on count!=10 and pusing an object
  */
  browserName() {
    this.enableCreateBtn = false;
    if (this._full != this.maxBrowser) {
      this.dockerObject.push({
        count: 0
      })
      var count = 0;
      for (let i = 0; i < this.dockerObject.length - 1; i++) {
        if (i < this.dockerObject.length - 1) {
          count = this.dockerObject[i].count;
        }
      }
      this._remaning = Math.abs(Number(this._remaning) - Number(count));
      this._full = Number(this._full) + Number(count);
      console.log(this.dockerObject);
    }
    else {
      alert("FULL")
    }
  }

/* logic description: removing the object and reducing the count when click on trash icon 
  */
  deleteVariable(indexOfVariable: any) {
    this.dockerObject.splice(indexOfVariable, 1);
    var sum = 0;
    var count = 0;
    this.enableCreateBtn = true;
    if (this.dockerObject.length == 0) {
      this.enableCreateBtn = false;
    }
    else {
      for (var j = 0; j < this.dockerObject.length; j++) {
        if (this.dockerObject[j].count == 0)
          this.enableCreateBtn = false;
      }
    }
    for (let i = 0; i < this.dockerObject.length - 1; i++) {
      sum = sum + this.dockerObject[i].count
    }
    count = Math.abs(Number(this._max) + sum);
    this._remaning = Math.abs(this.maxBrowser - count);
    this._full = this.maxBrowser - Math.abs(Number(this._remaning))
  }

/* logic description: create the browsers containers in execution machine
  */
  createNew() {

    var sum = 0;
    for (var k = 0; k < this.dockerObject.length; k++) {
      sum = sum + this.dockerObject[k].count;
    }
    if (sum > this.maxBrowser - this.browsersLength) {
      this.enableCreateBtn = false;
      alert("Cannot have more than " + this.maxBrowser + " Browsers")
    }

    else {
      console.log(this.updateId)
      var obj = {
        collectionId: this.updateId,
        userArray: this.dockerObject,
      }
      this.SpinnerService.show()
      this.infrastructureServices.createMany(obj).subscribe(result => {
        console.log(result)
        if (result.length != 0) {
          this.load();
          document.getElementById("cancelBtn").click();
          this.browserData = result[0].machineDetails[0].browsers;
          this._max = result[1];
          this._full = this._max;
          this._remaning = this.maxBrowser - Number(this._max);
          this.SpinnerService.hide();
          this._snackBar.open("New Browser Added Sucessfully", "CANCEL", {
            duration: 5000,
          });
        }
      })

    }
  }


/* logic description: starting the jmeter container
  */
  jmeterRowStart(i: any) {
    console.log(i, this.tableJmeterData[i])
    this.SpinnerService.show()
    this.infrastructureServices.startJmeterContainer(this.tableJmeterData[i]).subscribe(result => {
    console.log(result)
    this.jLoad();
    this.SpinnerService.hide();
    this._snackBar.open("Started Sucessfully", "CANCEL", {
      duration: 5000,
    });
    })
  }

/* logic description: stopping the jmeter container
  */
  jmeterRowStop(i: any) {
    console.log(i, this.tableJmeterData[i])
    this.SpinnerService.show()
    this.infrastructureServices.stopJmeterContainer(this.tableJmeterData[i]).subscribe(result => {
      console.log(result)
    this.jLoad();
    this.SpinnerService.hide();
    this._snackBar.open("Stopped Sucessfully", "CANCEL", {
      duration: 5000,
    });
    })
  }



}
