import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { BrowserSelectionService } from '../../../../core/services/browser-selection.service';
import { roleService } from '../../../../core/services/roleService';
import { DockerService } from '../../../../core/services/dockerService'


@Component({
  selector: 'app-browser-selection',
  templateUrl: './browser-selection.component.html',
  styleUrls: ['./browser-selection.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [BrowserSelectionService, roleService]
})
export class BrowserSelectionComponent implements OnInit {

  tabledetails = [];
  newRole: string;
  newUserId: string;
  newUserName: string;
  orgId: any;
  performanceTabledetails: any;
  performanceMasterdetails: any;
  performanceSlavedetails: any;
  button: any;
  button1: any;
  pageName: string;
  pageRoles: {};
  constructor(public browserSelectionService: BrowserSelectionService, private decoratorServiceKey: DecoratorService,
    private roles: roleService, private infrastructureServices: DockerService) { }

  ngOnInit() {
    this.executionMachine = [{ machineName: "" }];
    this.JexecutionMachine = [{ machineName: "" }];
    this.getMachines();
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    this.orgId = sessionStorage.getItem('orgId');
    console.log(this.newUserName, this.orgId)
    this.tableData()
    this.performanceTableData()
    this.pageName = "browserSelection"
    this.pageRoles = {
      pageName: this.pageName,
      roleName: this.newRole,
      userId: this.newUserId,
      userName: this.newUserName
    }
    this.getRolesPermissions();
  }


  dataSource: MatTableDataSource<any>;
  executedreports: string[] = ['Sl.No', 'Browser Type', 'Browser Version', 'Assigned To', 'Status', 'Execution Type'];
  performanceTable: string[] = ['Sl.No', 'Browser Type', 'Browser Version', 'Assigned To', 'Status'];

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

  /*logic description: feteching the machines under this organization 
   */
  executionMachine = [];
  JexecutionMachine = [];
  getMachines() {
    let obj = {
      orgId: Number(sessionStorage.getItem('orgId'))
    }
    this.infrastructureServices.getMachines(obj).subscribe(result => {
      console.log(result);
      this.executionMachine = result.filter((obj) => obj.machineType == "executionMachine")
      this.JexecutionMachine = result.filter((obj) => obj.machineType == "jmeterExecutionMachine")
    })
  }

  /*logic description: feteching the browsers under execution machine
     */
  tableData() {
    this.tabledetails = [];
    let obj = { 'orgId': this.orgId }
    this.browserSelectionService.getTableDetails(obj).subscribe(
      result => {
        console.log(result);
        this.tabledetails = result;
        if (this.tabledetails.length == 0) {
          this.button1 = true
        } else {
          this.button1 = false
        }
        this.tabledetails.forEach(element => {

          // element.userName.forEach(e => {
          //   if (e == this.newUserName) { 
          //     count++;
          //   }
          //   else {
          //   }
          // });

          // if(count==0){
          //   element.check = true
          //   element.checks = true

          // }else{
          //   element.check = false
          //   element.checks = false
          // }
          if (element.userName == this.newUserName || element.userName == "") {
            element.check = true
            element.checks = false
          } else {
            element.check = false
            element.checks = false
          }

        });
        // console.log(count)
        //count=0;
        console.log(this.tabledetails);
      })
  }

  /*logic description: feteching jmeter containers under jmeterExecution machine
   */
  performanceTableData() {
    let obj = { 'orgId': this.orgId }
    this.browserSelectionService.getPerformanceTableDetails(obj).subscribe(
      result => {
        console.log(result);
        this.performanceTabledetails = result;
        if (this.performanceTabledetails.length == 0) {
          this.button = true
        } else {
          this.button = false
        }
        this.performanceTabledetails.forEach(element => {
          if (element.userName == this.newUserName || element.userName == "") {
            element.check = true
            element.checks = true

          } else {
            element.check = false
            element.checks = false
          }
          // element.orgId = this.orgId
        });
        console.log(this.performanceTabledetails);
      })
  }

  /*logic description: checking and unchecking all checkboxes in table header checkbox in execution machine
   */
  copy(test, i) {
    //  console.log(i)
    for (let c = 0; c < this.tabledetails.length; c++) {
      if (i == c) {
        if (this.tabledetails[i].checks == true) {
          this.tabledetails[i].checks = false

        }
        else if (this.tabledetails[i].checks == false) {
          this.tabledetails[i].checks = true
        }
        console.log(this.tabledetails[i])
      }
    }

    // console.log(this.tabledetails)
    //  console.log()
  }

  /*logic description: checking and unchecking all checkboxes in table header checkbox in JeterExecution machine
   */
  performanceCopy(test, i) {
    //  console.log(i)
    for (let c = 0; c < this.performanceTabledetails.length; c++) {
      if (i == c) {
        if (this.performanceTabledetails[i].checks == true) {
          this.performanceTabledetails[i].checks = false

        }
        else if (this.performanceTabledetails[i].checks == false) {
          this.performanceTabledetails[i].checks = true
        }
      }
    }

    console.log(this.performanceTabledetails)
    //  console.log()
  }

  /*logic description: blocking the browsers under Execution machine
   */
  dataArray = []
  blockBrowsers() {
    console.log(this.tabledetails)
    this.dataArray = []
    this.tabledetails.forEach(element => {
      if (element.checks == true) {
        element.userName = this.newUserName;
        this.dataArray.push(element)
      }

    });
    console.log(this.dataArray)
    // let obj = {
    //   "orgId": 52
    // }
    if (this.dataArray.length !== 0) {
      this.browserSelectionService.browsersBlock(this.dataArray).subscribe(
        result => {
          console.log(result)
          this.tableData()
          this.decoratorServiceKey.saveSnackbar('Blocked browsers Successfully', '', 'save-snackbar')

        })
    }
    else {
      this.decoratorServiceKey.duplicate_Snackbar('please select browser', '', 'duplicate-snackbar')
    }

  }

  /*logic description: Releasing browsers under Execution machine
   */
  arrayData
  releaseBrowsers() {
    console.log(this.tabledetails)
    this.arrayData = []
    // this.tabledetails.forEach(element => {
    //   console.log(element)
    //   if (element.check == true && element.checked == true && element.checks == false) {
    //     this.arrayData.push(element)
    //   }
    // });
    this.tabledetails.forEach(element => {
      if (element.checks == true) {
        element.userName = this.newUserName;
        this.arrayData.push(element)
      }

    });
    console.log(this.arrayData)
    if (this.arrayData.length !== 0) {
      this.browserSelectionService.releaseBlock(this.arrayData).subscribe(
        result => {
          console.log(result)
          this.tableData()

          this.decoratorServiceKey.saveSnackbar('Relased browsers Successfully', '', 'save-snackbar')

        })
    }
    else {
      this.decoratorServiceKey.duplicate_Snackbar('please select browser', '', 'duplicate-snackbar')
    }
  }

  /*logic description: Blocking the containers in JeterExecution machine
   */
  performanceDataArr
  blockContainers() {
    this.performanceDataArr = []
    this.performanceTabledetails.forEach(element => {
      if (element.checks == true) {
        element.userName = this.newUserName
        this.performanceDataArr.push(element)
      }

    });
    console.log(this.performanceDataArr)
    if (this.performanceDataArr.length !== 0) {
      this.browserSelectionService.containersBlock(this.performanceDataArr).subscribe(
        result => {
          console.log(result)
          //this.ngOnInit()

          if (result == "blocked") {
            console.log("Test")
            this.performanceTableData()
            this.decoratorServiceKey.saveSnackbar('Blocked containers Successfully', '', 'save-snackbar')
          }
        })
    }
  }

  /*logic description: Releasing the container in JeterExecution machine
   */
  performanceArrData
  releaseContainers() {
    console.log(this.performanceTabledetails)
    this.performanceArrData = []
    this.performanceTabledetails.forEach(element => {
      console.log(element)
      if (element.check == true && element.checked == true && element.checks == false) {
        this.performanceArrData.push(element)
      }
    });
    console.log(this.performanceArrData)

    if (this.performanceArrData.length !== 0) {
      this.browserSelectionService.containersRelease(this.performanceArrData).subscribe(
        result => {
          console.log(result)
          //this.ngOnInit()
          if (result == "released") {
            console.log("Test")
            this.performanceTableData()
            this.decoratorServiceKey.saveSnackbar('Relased containers Successfully', '', 'save-snackbar')
          }
        })
    }
    else {
      this.decoratorServiceKey.saveSnackbar('please uncckeck containers', '', 'save-snackbar')

    }

  }

}
