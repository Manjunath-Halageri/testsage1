import { Component, OnInit } from '@angular/core';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { ApiExecutionService } from '../../../../core/services/api-execution.service';
import { ExecutionService } from '../../../../core/services/execution.service';
import { CreateService } from '../../../../core/services/release-create.service';
import { TestExecutionServiceComponent } from '../../../../core/services/testExecution.service';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import 'rxjs/add/operator/map';
import { Post } from '../../../../post';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TrackingService } from '../../../../core/services/tracking.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { DecoratorService } from '../../../../core/services/decorator.service';

@Component({
  selector: 'app-api-execution',
  templateUrl: './api-execution.component.html',
  styleUrls: ['./api-execution.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [TestExecutionServiceComponent, TestExecutionServiceComponent, apiServiceComponent, ExecutionService, TrackingService]
})

export class ApiExecutionComponent implements OnInit {
  testScriptsData: any;
  Suites: any;
  selectedProject: any;
  apiProjectId: any;
  ReleaseVersions: any;
  allScripts: any;
  scriptsData: any;
  removedArray: any;
  apiProjectName: any;
  selectedSuite: any;
  selectedRelease: any;
  msg: any;
  checkReportstatus: any;
  reportroute: boolean;
  checkReportPresent: boolean;
  angForm123: FormGroup;
  scheduleDetails: any;
  scheduleObject: Object = {};
  weekEnd: boolean;
  week: boolean;
  endTime: boolean;
  hourly: boolean;
  data1: any;
  scriptsNew: any;
  checkboxValue: boolean;
  WeeklyDetails: any;
  hourlyDetails: any;
  projectframework: any;
  moduleNames: any;
  featureNames: Post[];
  typeArray: Post[];
  priorityArray: Post[];
  toppingList: string[] = ['Pass', 'Fail', 'NotExecuted'];
  searchParams: string;
  newRole: string;
  assignButton: boolean;
  testers: Post[];
  newUserName: string;
  checke: boolean;
  typeExecution: string;
  latestTestData: Post[];
  fetchedScripts: any;
  deleteData: any;
  newArray: any;
  pageRoles: object = {};
  newUserId: any;

  constructor(
    private fb: FormBuilder,
    private apiexecutionService: ApiExecutionService,
    private dialogService: DialogService,
    private getAllreleases: TrackingService,
    private decoratorServiceKey: DecoratorService) { }
  displayedColumns: string[] = ['tool', 'check', 'ModuleName', 'FeatureName', 'PriorityName', 'TypeName', 'TestcaseName', 'StatusName', 'Assigned', 'Delete'];

  ngOnInit() {
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    this.selectedProject = JSON.parse(this.selectedProject)
    console.log(this.selectedProject)
    this.pageRoles = {
      roleName: this.newRole,
      userId: this.newUserId,
      userName: this.newUserName
    }
    this.apiProjectName = this.selectedProject.projectName
    this.apiProjectId = this.selectedProject.projectId
    this.endTime = true;
    this.week = true;
    this.hourly = true;
    this.weekEnd = true
    this.checkboxValue = false;
    this.assignButton = false
    this.getReleases()
    this.getSuites()
    this.createForm();
    this.scheduleTypes()
    this.weeklyData()
    this.hourlyData()
    this.framework()
    this.getType()
    this.getPriority()
  }


  allModules() {
    // let obj2 = this.apiProjectId + ',' + this.selectedSuite
    let obj = { 'projectId': this.apiProjectId, 'suiteName': this.selectedSuite }
    this.apiexecutionService.getModule(obj)
      .subscribe(Data => {
        this.moduleNames = Data;
        console.log(this.moduleNames)
      });
  }

  searchCall(statusExe, moduleId, featureId, priorityId, typeId) {
    this.selectedSuite = sessionStorage.getItem('SlSt');
    console.log(statusExe)
    if (moduleId == null) {
      moduleId = "All"
    }
    if (featureId == null) {
      featureId = "All"
    }
    if (priorityId == null) {
      priorityId = "All"
    }
    if (typeId == null) {
      typeId = "All"
    }
    this.typeExecution = 'apiAutomated';
    this.searchParams = moduleId + ',' + featureId + ',' + typeId + ',' + priorityId +
      ',' + this.apiProjectId + ',' + this.selectedSuite + ',' + this.projectframework
      + ',' + this.newRole + ',' + this.newUserName + ',' + this.typeExecution + ',' + statusExe
    console.log(this.searchParams)
    this.apiexecutionService.searchTestcases(this.searchParams)
      .subscribe(result => {
        this.testScriptsData = result;
        this.scriptsData = this.testScriptsData
        console.log(this.testScriptsData);
      });
  }

  moduleIndex(moduleId) {
    console.log(moduleId)
    // let obj = moduleId + ',' + this.apiProjectId
    let obj = { 'projectId': this.apiProjectId, 'moduleId': moduleId }
    this.apiexecutionService.getModuleFeatures(obj)
      .subscribe(Data => {
        this.featureNames = Data;
        console.log(this.featureNames)
      });
  }

  getType() {
    this.apiexecutionService.getTypesData()
      .subscribe(result => {
        this.typeArray = result
        console.log(this.typeArray)
      })
  }

  getPriority() {
    this.apiexecutionService.getPriorityData()
      .subscribe(result => {
        this.priorityArray = result
        console.log(this.priorityArray)
      })
  }

  getReleases() {
    if (this.newRole == "Lead") {
      this.assignButton = true;
      let obj = { 'projectId': this.apiProjectId, 'role': this.newRole }
      this.apiexecutionService.getTesters(obj)
        .subscribe(Data => {
          this.testers = Data;
        })
    }

  }

  getSuites() {
    let obj = { 'projectId': this.apiProjectId }
    this.apiexecutionService.getApiNullReleaseSuites(obj)
      .subscribe(data => {
        console.log(data)
        this.Suites = data;
      })
  }
  scheduleTypes() {
    this.apiexecutionService.getScheduleTypes()
      .subscribe(data => {
        this.scheduleDetails = data;
        console.log(this.scheduleDetails)
      })
  }

  weeklyData() {
    this.apiexecutionService.getWeeklySelectionDetails()
      .subscribe(data => {
        this.WeeklyDetails = data;
        console.log(this.WeeklyDetails)
      })
  }

  hourlyData() {
    this.apiexecutionService.getHourlySelectionDetails()
      .subscribe(data => {
        this.hourlyDetails = data;
        console.log(this.hourlyDetails)
      })
  }

  uncheck(index) {
    this.removedArray = [...this.scriptsData];
    for (let i = 0; i < this.removedArray.length; i++) {
      if (index == i) {
        if (this.scriptsData[i].check == 'true') {
          this.scriptsData[i].check = "false";
        }
        else if (this.scriptsData[i].check == "false") {
          this.scriptsData[i].check = 'true';
        }
        else { }
        this.removedArray.splice(i, 1);
      }
    }
    console.log(this.scriptsData)
  }

  framework() {

    let obj = { 'projectId': this.apiProjectId }
    this.apiexecutionService.frameworkType(obj)
      .subscribe(result => {
        this.projectframework = result[0].framework;
        console.log(this.projectframework)
      })
  }


  completeobject: Object = {};
  getData(scriptsData) {
    this.msg='';
    this.checkReportstatus ='';
    console.log(scriptsData)
    if(scriptsData==''){
      alert('No scripts available')
      return false;
    }
    this.completeobject["testsuitename1"] = this.selectedSuite;
    this.completeobject["pname"] = this.apiProjectName;
    this.completeobject["framework"] = this.projectframework;
    this.completeobject["scripts"] = scriptsData;
    this.apiexecutionService.insertScriptsIntoSuiteFolder(this.completeobject)
      .subscribe(result => {
        console.log(result)
        this.getDataOne(scriptsData)
      })
  }


  data = [];
  getDataOne(scriptsData) {
    this.data = [];
    console.log(scriptsData)
    for (let i = 0; i < scriptsData.length; i++) {
      if (scriptsData[i].check != "false") {
        scriptsData[i].projectname = this.apiProjectName;
        this.scriptsData[i].prid = this.apiProjectId;
        scriptsData[i].suite = this.selectedSuite;
        this.scriptsData[i].type = 'execution';
        this.scriptsData[i].selectedRelease = this.selectedRelease;
        this.scriptsData[i].Run = null
        scriptsData[i].Roles = this.pageRoles;
        this.data.push(scriptsData[i]);
      }
    }
    console.log(this.data)
    if (this.data.length !== 0) {
      this.msg = "Execution started ....."
      this.apiexecutionService.completeApiData(this.data)
        .subscribe(data => {
          console.log(data)
          if (data.split(',')[0] === `Pass` || data.split(',')[0] === `Fail`) {
            this.msg = "Generating Reports please wait...."

            this.data[0].Run = data.split(',')[1];

          }
          if(data.split(',')[0] === `Pass`|| data.split(',')[0] === `Fail` ){
             console.log(this.data)
          this.apiexecutionService.checkReportCall(this.data)
            .subscribe(res => {
              this.checkReportPresent = true;
              this.checkReportstatus = data.split(',')[1]
              this.reportroute = true
              sessionStorage.setItem("executedRunNum", JSON.stringify(this.checkReportstatus))
              sessionStorage.setItem("reportStatus", JSON.stringify(this.reportroute))
              this.msg = "Execution Completed please check report "
            })
          }
         
        })
    }
    else {
      alert('please select scripts')
    }
  }
  createForm() {
    this.angForm123 = this.fb.group({
      scheduleName: [' ', Validators.required],
      desc: ['', Validators.required],
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      givenTime: ['', Validators.required],
      weeks: ['', Validators.required],
      hourl: ['', Validators.required],
      selectedSuite: ['', Validators.required],
      weekEnd: ['', Validators.required],
    });


  }
  getscheduleName(scheduleName) {

    if (scheduleName == "Once") {
      this.endTime = false;
      this.week = false;
      this.hourly = false;
      this.weekEnd = false;
    }
    else if (scheduleName == "Daily") {
      this.week = false;
      this.hourly = false;
      this.weekEnd = true;
      this.endTime = true;
    }
    else if (scheduleName == "Weekly") {
      this.hourly = false;
      this.weekEnd = false;
      this.week = true;
    }
    else if (scheduleName == "Monthly") {
      this.hourly = false;
      this.weekEnd = false;
      this.week = false;
      this.endTime = true;
    }
    else {
      this.weekEnd = false;
      this.week = false;
      this.endTime = true;
      this.hourly = true;
    }
  }

  sc: boolean;
  checkAvail = []
  getData123(scriptsData) {
    console.log(this.scriptsData);
    this.data1 = [];
    this.checkAvail = []
    if(scriptsData=='')
        {
            alert("There are no scripts")
            return
        }
      this.scriptsData.forEach(element => {
          if (element.check == "true") {
            let obj1 = {
              "browser": element.browser,
              "Version": element.Version
              }
              console.log(element.check)
              this.checkAvail.push(obj1)
              console.log(this.checkAvail)
          }
      })
      console.log(this.checkAvail)
      if(this.checkAvail.length==0){
        this.sc = false
        confirm("Please select script to Run")
    }
  else if (this.selectedSuite == undefined) {
      alert("Please select the Suite & Scripts ")
      this.sc = false
    }
    else if (this.scriptsData.length !== 0) {
      this.sc = true
      console.log(scriptsData);
     
      for (let c = 0; c < scriptsData.length; c++) {
        if (scriptsData[c].check != "false") {
          scriptsData[c].projectname = this.apiProjectName;
          scriptsData[c].suite = this.selectedSuite;
          this.scriptsData[c].prid = this.apiProjectId;
          this.data1.push(scriptsData[c]);
          console.log(this.data1);
        }

      }
    }
    else {
      alert("Please select the scripts")
      this.sc = false

    }

  }
  getCheck() {

    this.checkboxValue = true

  }

  allData: Object = {};
  scriptsSeleted = [];
  allScheduleSave(selectedSuite) {
    console.log(this.scheduleObject)
    console.log(this.data1)
    let obj = { 'suiteName': selectedSuite }
    this.apiexecutionService.getScripts(obj)
      .subscribe(result => {
        this.scriptsSeleted = result
        console.log(this.scheduleObject);
        console.log(this.data1);
        this.allData = {
          data: this.scheduleObject,
          allData: this.data1,
          projectName: this.apiProjectName,
          "suiteName": selectedSuite,
          "weekend": this.checkboxValue,
          "scripts": this.scriptsSeleted,
          "type": "apiSchedule",
          "releaseName": this.selectedRelease

        }
        //alert("HI")
        console.log(this.allData)
        this.apiexecutionService.scheduleSave(this.allData)
          .subscribe(result => {
            this.decoratorServiceKey.saveSnackbar('Scheduled Successfully', '', 'save-snackbar')
                    console.log(result)
            this.scheduleObject = {};

          })
          this.angForm123.reset();
          this.scriptsData=[];
      })
  }



  

  dataTest
  TestersCall(selectedTester) {
    this.dataTest = [];
    this.scriptsData.forEach(element => {
      if (element.check === "true") {
        console.log(this.apiProjectId)
        element.tester = selectedTester
        element.suitename = this.selectedSuite
        element.projectId = this.apiProjectId
        element.role = "Execution Engineer"
        this.dataTest.push(element)
      }
    })
    this.apiexecutionService.insertTesters(this.dataTest).subscribe(
      result => {
        console.log(result)
      });
    console.log(this.scriptsNew)
  }

  chekss = [];
  checks(scriptsData, event) {
    console.log(this.scriptsData)
    console.log(event)
    // checks(scriptsNew, event) {
    if (this.scriptsData == null) {
      alert("there are no scripts")
      event.target.checked = false
    }
    else {
      var checkf
      this.chekss = [];
      checkf = event.target.checked
      console.log(checkf)
      if (checkf == true) {
        this.checke = true;
        for (let c = 0; c < this.scriptsData.length; c++) {
          console.log(this.scriptsData[c].scriptStatus)
          if (this.scriptsData[c].testcaseStatus == "Pass") {
            this.scriptsData[c].check = 'true';
          }
          else {
            this.scriptsData[c].check = 'false'
          }
        }
      }
      else if (checkf == false) {
        this.checke = false;
        for (let c = 0; c < this.scriptsData.length; c++) {
          this.scriptsData[c].check = 'false';
          // this.chekss.push(scriptsNew[c])
        }
      }
      // }
      console.log(this.scriptsData)
    }

  }

  delete(index, scriptsData, scriptName, moduleName, featureName) {
    this.dialogService.openConfirmDialog('Are you sure to delete?')
      .afterClosed().subscribe(res => {
        console.log(res)
        if (res === '') {
          console.log('cancelled the operation');
        } else {
          console.log('The user has confirmed the operation');
          this.fetchedScripts = scriptsData;

          for (let i = 0; i <= this.fetchedScripts.length - 1; i++) {
            if (index == i) {

              this.deleteData = scriptName + "," + this.selectedSuite
                + "," + this.apiProjectName + "," + this.selectedRelease + "," + moduleName + "," + featureName;
              console.log(this.deleteData)
              this.scriptsData[i].check = "false";
              this.fetchedScripts.splice(i, 1);
              let obj = { 'deleteData': this.deleteData }
              console.log(obj);
              this.apiexecutionService.deletescript(obj)

                .subscribe(result => {
                  console.log(result)
                  if (result == "FAIL") {
                    this.decoratorServiceKey.saveSnackbar('script not available in suite', '', 'save-snackbar')
                  }
                  else {
                    this.newArray = this.fetchedScripts.splice(i, 1);
                    this.decoratorServiceKey.saveSnackbar('Deleted Succesufully', '', 'save-snackbar')

                  }
                });

            }
            console.log(this.newArray)
            console.log(this.scriptsData)
          }
        }
      })
  }
  /////////////////////////////////// Tree Structure code Starts ////////////////////////////////////////

  getTreeStructureAllReleases() {
    let obj = {
      "projectId": this.apiProjectId
    }
    this.getAllreleases.getAllReleaseData(obj).subscribe(res => {
      this.displayModuleForTree = res;
    })
  }

  openWhenClic: boolean;
  selectedname: any;
  releaseName: any;
  openMenuData(pageName, bb) {
    if (bb.parent !== undefined) {
      this.openWhenClic = true;
      this.selectedRelease = bb.parent.label
      console.log(this.selectedRelease)
      this.selectedSuite = bb.label;
      console.log(this.selectedSuite)
      sessionStorage.setItem("SlSt", this.selectedSuite)
      this.latestupdate()
      this.allModules()
      this.scriptsData=[];
      this.checke=false;
      this.msg='';
      this.checkReportstatus ='';
    }
  }

  latestupdate() {
    //let obj = this.apiProjectId + ',' + this.selectedSuite
    let obj = { 'projectId': this.apiProjectId, 'suiteName': this.selectedSuite }
    this.apiexecutionService.getlatest(obj)
      .subscribe(Data => {
        this.latestTestData = Data;
        console.log(this.latestTestData)
        this.callLatestUpdate(this.latestTestData)
      });


  }

  callLatestUpdate(Data) {
    console.log(Data)
    this.apiexecutionService.updateLatestCall(Data)
      .subscribe(result => {
        console.log(result)
      })
  }
  displayModuleForTree: Post[];
  items: { label: string; command: (event: any) => void; }[];
  async nodeSelect(file) {
    if (file.node != undefined) {

      if (file.node.data == "release") {
        for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
          if (file.node.label === this.displayModuleForTree[index]['label']) {
            break;
          }
        }
      }
    }
  }
}

