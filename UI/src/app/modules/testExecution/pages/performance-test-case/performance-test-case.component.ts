import { Component, OnInit, ViewChild, AfterViewInit,ElementRef  } from '@angular/core';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { PerformanceService } from '../../../../core/services/performance.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { Post } from '../../../../post';
import * as _ from 'lodash';
import { PerformanceObjectsService } from '../../../../core/services/performanceObjects.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestCaseCommonService } from '../../../../core/services/test-case-common.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import tableDragger from 'table-dragger';

import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Subscription, interval,Observable} from 'rxjs';

export interface ReportElements {
  Sl_No: any;
  jmxFileName: any;
  jmxReportId: any;
  status: any;
  date: any;
  time: any;
  Delete: any;
}

export interface TreeElements {
  Sl_No: any;
  jmxFileName: any;
  jmxReportId: any;
  date: any;
  time: any;
  Delete: any;
}

const performanceReportdetails: ReportElements[] = [];
const performanceTreedetails: TreeElements[] = [];

@Component({
  selector: 'app-performance-test-case',
  templateUrl: './performance-test-case.component.html',
  styleUrls: ['./performance-test-case.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class PerformanceTestCaseComponent implements OnInit, AfterViewInit {
  performanceReportsTable: string[] = ['Sl_No', 'jmxFileName', 'jmxReportId', 'status', 'date', 'time', 'Delete'];
  dataSource = new MatTableDataSource(performanceReportdetails);

  performanceTreeTable: string[] = ['Sl_No', 'jmxFileName', 'jmxReportId', 'date', 'time', 'Delete'];
  treeDataSource = new MatTableDataSource(performanceTreedetails);

  uploadDetails: any;
  projectId: any;
  projectDetails: any;
  displayModuleForTree: Post[];
  items: { label: string; command: (event: any) => void; }[];
  showForm1: any;
  showForm2: any;
  showForm3: any;
  showForm4: any;
  showForm5: any;
  uploadForm: any;
  uploadCSV: any;
  filesToUpload: any;
  selectedModuleForUpload: any;
  selectedFeatureForUpload: any;
  jmxModuleId: any;
  jmxFeatureId: any;
  jmxFileId: any;
  displayEditPage: any;
  moduleName: any;
  featureName: any;
  scriptName: any;
  features: any;
  threadGroup: any;
  userVariables: any;
  headerManager: any;
  DNSCache: any;
  clearCache: any;
  clearCookie: any;
  requestDefaults: any;
  transactionController = [];
  viewResultTree: any;
  resultTreeBool: any;
  httpRequests = [];
  uniformTimers = [];
  httpRequest: any;
  fileUploads: any;
  httpHeader: any;
  controllerRow: any;
  headerRow: any;
  uniformTimer: any;
  constantTimer: any;
  updateModal: any;
  arrayPos: any;
  csvFiles = [];
  userName: any;
  csvFileNames = []
  newUserName: string;
  mastersData: any;
  slavesData: any;
  removedArray: any[];
  resultmsgActual: string;
  dockerStart: any;
  masterData: any;
  trailStatus: any;
  displayUploadPage: any;
  spinnerVal: any;
  dockerPath09: SafeUrl;
  spinnerPercent: any;
  controllerName: any;
  performanceReportdetails: any;
  performanceTreedetails:any;
  selectedDate: any;
  selectedDate1:any;
  openTree: any;
  testResult: any;
  samplerResult: any;
  listenerName: any;
  treeStatus: any;
  threadGroupAssertions = [];
  controllerResult: any;
  assertionObj: any;
  reqHeader: any;
  regExObj: any;
  infinityLoop: any;
  infinitycheck: any;
  executeTime: any;
  ExeTime: boolean;

  private subscription: Subscription
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;
  consoleLog: any;
  logFile:any;
  unSavedChangesExits: boolean = false;

  constructor(private fb: FormBuilder,
    private api: apiServiceComponent,
    private decoratorServiceKey: DecoratorService,
    private performanceservice: PerformanceService,
    private dashboardservice: DashboardService,
    private SpinnerService: NgxSpinnerService,
    private dialogService: DialogService,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private performanceObj: PerformanceObjectsService,
    private servicekey: TestCaseCommonService,
    private _liveAnnouncer: LiveAnnouncer) {
    this.uploadForm = fb.group({
      'importFile': ['', Validators.compose([
        Validators.required
      ])
      ]
    })
    this.uploadCSV = fb.group({
      'importFile1': ['', Validators.compose([
        Validators.required
      ])
      ]
    })
  }

  threadGroupForm = new FormGroup({
    users: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{0,4}$')]),
    ramp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,10}$')]),
    //loop: new FormControl('', [Validators.pattern('^[-1-9][0-9]{0,10}$')]),

    duration: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{0,10}$')]),
    delay: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,10}$')])
  })

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  @ViewChild('myInput', {static: false})
  InputVar: ElementRef;
  ngOnInit() {
    this.getModulesToDisplay();
    this.resetForm();
    this.projectDetails = JSON.parse(sessionStorage.getItem('selectedProject')).projectName;
    this.userName = sessionStorage.getItem('userName') + sessionStorage.getItem('userId');
    this.displayEditPage = false;
    this.scriptName = "";
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    this.newUserName = sessionStorage.getItem('userName')
    this.getUserMasterDetails(orgId)
    this.getUserSlaveDetails(orgId)
    this.displayUploadPage = false;
    this.spinnerVal = "Loading..."
    this.spinnerPercent = '';
    this.controllerName = 'Transaction Controller';
    this.selectedDate = '';
    this.resultTreeBool = false;
    this.openTree = false;
    this.listenerName = 'View Result Tree';
    this.SpinnerService.hide();
    this.infinityLoop = false;
    this.copyCon = false;
    this.copySam = false;
    this.ExeTime = false;
    this.Rtime = false;
    this.actualTree='';
  }

  // This will call before closing component..
canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
  if (!this.unSavedChangesExists()) {
      return true;
  } else {
      return false;
  }

}

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  resetForm() {
    this.showForm1 = false;
    this.showForm2 = false;
    this.showForm3 = false;
    this.showForm4 = false;
    this.showForm5 = false;
    this.csvFiles = [];
    this.csvFileNames = [];
    this.transactionController = [];
    this.threadGroupAssertions = [];
    this.resultTreeBool = false;
    this.openTree = false;
    this.httpRequest = this.performanceObj.httpRequest
    this.fileUploads = this.performanceObj.fileUploads
    this.httpHeader = this.performanceObj.httpHeader
    this.samplerResult = this.performanceObj.samplerResult
    this.controllerResult = _.cloneDeep(this.performanceObj.samplerResult)
    this.responseAssertionObj = _.cloneDeep(this.performanceObj.responseAssertion)
    this.uniformTimer = _.cloneDeep(this.performanceObj.uniformTimer)
    this.reqHeader = _.cloneDeep(this.performanceObj.reqHeader2)
    this.controllerRow = 0;
    this.headerRow = 0;
    this.constantTimer = _.cloneDeep(this.performanceObj.constantTimer)
    this.assertionObj = _.cloneDeep(this.performanceObj.assertionObj)
    this.regExObj = _.cloneDeep(this.performanceObj.regExObj)
  }

  /*fetching the modules, features, testcases under the project
  sort the modules, features, testcases
  */
  getModulesToDisplay() {
    this.projectId = JSON.parse(sessionStorage.getItem('selectedProject')).projectId;
    this.performanceservice.getModulesToDisplay(this.projectId).subscribe((res) => {
      console.log(res)
      res.sort( this.sortModules );
      for(let i=0;i<res.length;i++){//Result array
        for(let j=0;j<res[i]['children'].length;j++){//modules of children of features
          res[i]['children'].sort( this.sortModules );
          for(let k=0;k<res[i]['children'][j]['children'].length;k++){//children of features of children of scripts
            res[i]['children'][j]['children'].sort( this.sortModules );
          }
        }
      }
      console.log(res)
      this.displayModuleForTree = res
    })
  }

  sortModules( a, b ) {
    if ( a.label.toLowerCase() < b.label.toLowerCase() ){
      return -1;
    }
    if ( a.label.toLowerCase() > b.label.toLowerCase() ){
      return 1;
    }
    return 0;
  }

  /*when click on any node(module, feature, testcase) on condition the items options will change
  1. upload JMX file, removeJMX file, open jMX file, remove JMX module.
  */
  async nodeSelect(file) {
    if (this.unSavedChangesExists()) {
      return;
  }
    if (file.node != undefined) {
      console.log(file.node)
      if (file.node.data == "feature") {
        this.items = [
          { label: 'Upload JMX File', command: (event) => this.uploadJmxFile() }
        ]
        this.selectedModuleForUpload = file.node.moduleId;
        this.selectedFeatureForUpload = file.node.featureId;
        this.moduleName = file.node.parent.label;
        this.featureName = file.node.featureName;
        this.displayEditPage = false;
      }
      else if (file.node.data == "script") {
      //   if (this.unSavedChangesExists()) {
      //     return;
      // }
      this.items = [
        { label: 'Delete', command: (event) => this.removeJmxFile() }
      ]
        this.jmxFileId = file.node.jmxFileId;
        this.jmxFeatureId = file.node.featureId;
        this.jmxModuleId = file.node.moduleId;
        this.moduleName = file.node.parent.parent.label;
        this.featureName = file.node.parent.featureName;
        this.showEditPage();
        this.spinnerVal = "Loading..."
        this.spinnerPercent='';
        this.SpinnerService.show();
        this.actualTree='';
      }
      else {
        this.items = [
          { label: 'Delete', command: (event) => this.removeJmxModule() }
        ]
        this.jmxModuleId = file.node.moduleId;
        this.moduleName = file.node.label;
        this.displayEditPage = false;
      }
    }
    else {
      this.displayEditPage = false;
      console.log(file.node);
      return;
    }
  }

  /* click on uploadJmx file, hiding the script edit page and displaying the upload JMX form
  */
  uploadJmxFile() {
    this.displayUploadPage = true;
    this.displayEditPage = false;
    //return document.getElementById("importJmx").click();
  }

/* if select any jmx file or csv file on upload of jmx or csv files
  */
  validateUpload(fileInput) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload)
    if (fileInput.target.files && fileInput.target.files.length > 0) {
      const file = (fileInput.target.files[0] as File);
      this.uploadForm.get('importFile').setValue(file);
      console.log(this.uploadForm.get('importFile').value);
    }else{
      this.uploadForm.get('importFile').setValue(null);
    }
  }

  /* click on upload of Jmx file, validating the type of file selected
  1. check the duplicates in the jmxFiles db
  2. check tha Jmeter users machine is Stopped or Starting.
  3. extracting the hubPort,nodeName,masterName and assign to login user , popout the hubPort,masterContainers from below.
  4.upload the jmxfile in jmxfileId/trail_test folder, conver from jmx to json form and check the data on two conditions that it is saved or not saved from jmeter tool.
  5. delete the jmxfileId folder if it from saved tool or else display a modal for trail test.
  6. if closed the modal the delete jmxfileId folder  or call the trailExecution().
  */
  uploadFileName: any;
  jCount:any;
  uploadImportedFile(filePath) {
    let userId = JSON.parse(sessionStorage.getItem('loginDetails')).userId
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    var name1 = filePath.importFile.name
    this.uploadDetails = `${this.projectId},${this.projectDetails},${this.selectedModuleForUpload},${this.selectedFeatureForUpload},${this.moduleName},${this.featureName}`
    console.log(this.uploadDetails)
    if (name1.split('.'[1]) !== 'jmx') {
      this.uploadFileName = filePath.importFile.name.split('.')[0];
      let obj = {
        jmxFileName: filePath.importFile.name.split('.')[0],
        projectId: this.projectId,
        moduleId: this.selectedModuleForUpload,
        featureId: this.selectedFeatureForUpload,
        moduleName: this.moduleName,
        featureName: this.featureName,
        userName: this.userName,
        projectName: this.projectDetails,
        userId: userId,
        orgId: orgId,
      }
      console.log(obj)
      this.uploadForm.get('importFile').setValue(null);
      let data1 = {
        "orgId": sessionStorage.getItem('orgId'),
        'organizationName': sessionStorage.getItem('OrganizationName'),
        "userId": sessionStorage.getItem('userId')

      }
      this.performanceservice.checkForDuplicate(obj).subscribe((res) => {
        console.log(res)
        if (res == 'success') {
          this.servicekey.checkJMachine(data1).subscribe(res => {
            if (res[0].machineStatus == "Stopped") {
              this.dialogService.openAlert("please start the Jmeter Users Machine")
            }
            else if (res[0].machineStatus == "Starting") {
              this.dialogService.openAlert("please wait until the machine is started")
            }
            else {
              this.spinnerVal = "Uploading..."
              this.SpinnerService.show();
              this.servicekey.assignContainers(data1).subscribe(res => {
                this.performanceservice.uploadFile(this.filesToUpload, this.uploadDetails)
                  .subscribe((result) => {
                    console.log(result)
                    obj["jmxFileId"]=result[0].jmxFileId;
                    obj["jCount"]=result[0].jCount;
                    this.jmxFileId=result[0].jmxFileId;
                    this.jCount=result[0].jCount;
                    this.performanceservice.jsonConversionAndValidate(obj).subscribe((result1) => {
                      this.SpinnerService.hide();
                      if(result1=="SavedTool"){
                        this.deleteTrailFolder();
                        this.dialogService.openAlert("This jmx file is saved in jmeter tool!")
                      }else{
                        this._snackBar.open("Uploaded Successfully", "CANCEL", {
                          duration: 5000,
                        });
                        document.getElementById('trailTest').click();
                      }
                    })
                  }, (error) => {
                    this.SpinnerService.hide();
                    this.dialogService.openAlert("Error Occurred" + error)
                  });
              });
            }
          })
        }
        else {
          this.dialogService.openAlert('Duplicates are not allowed')
        }
      })
    }
  }

  /*
  1. copy the jmxfile to master container.
  2. execute the jmx file and generate results in csv file.
  3. copy the csv file to trail_test folder.
  4. delete the jmx file and csv file in master container.
  5. convert the csv to json and extract the data in csv file to display results in modal.
  6. copy the jmx file from trail_test folder to actual_test folder 
  7. copy the scriptId.json file data to respective document into feaures object.
  */
  trailResult = [];
  trailExecution() {
    let userId = JSON.parse(sessionStorage.getItem('loginDetails')).userId
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let obj = {
      projectId: this.projectId,
      moduleId: this.selectedModuleForUpload,
      featureId: this.selectedFeatureForUpload,
      moduleName: this.moduleName,
      featureName: this.featureName,
      userName: this.userName,
      projectName: this.projectDetails,
      userId: userId,
      orgId: orgId,
      jmxFileName: this.uploadFileName,
      scriptId:this.jmxFileId,
      jCount:this.jCount,
      uploadedJMX: true
    }
    this.spinnerPercent = 0 + '%';
    this.spinnerVal = "Executing Trail Test.."
    this.SpinnerService.show();
    this.performanceservice.copyScriptsToMaster(obj).subscribe(res => {
      this.spinnerPercent = 20 + '%';
      this.performanceservice.trailCallExecution(obj).subscribe(res => {
        this.spinnerPercent = 40 + '%';
        this.performanceservice.copyResultsToLocal(obj).subscribe(res => {
          this.spinnerPercent = 60 + '%';
          this.performanceservice.deleteInDocker(obj).subscribe(res => {
            this.spinnerPercent = 80 + '%';
            this.performanceservice.convertCsvToJson(obj).subscribe(res => {
              this.spinnerPercent = 100 + '%';
              this.trailResult = [];
              res.resultData.forEach((element, index) => {
                if (index !== res.resultData.length - 1)
                  this.trailResult.push(element)
              });
              this.performanceservice.jsonConversion(obj).subscribe((result1) => {
                  this._snackBar.open("Trail Run Successful", "CANCEL", {
                    duration: 5000,
                  });
                  this.getModulesToDisplay();
                  this.SpinnerService.hide();
                  this.displayUploadPage = false;
                  this.displayEditPage = false;
                  document.getElementById('reportDisplay').click();
              })
              // if (res.status == "FAIL") {
              //   this.deleteTrailFolder();
              //   this._snackBar.open("Trail Run Failed", "CANCEL", {
              //     duration: 5000,
              //   });
              //   this.SpinnerService.hide();
              //   this.displayUploadPage = false;
              //   this.displayEditPage = false;
              //   document.getElementById('reportDisplay').click();
              // }
              // else {
              //   this.performanceservice.jsonConversion(obj).subscribe((result1) => {
              //     this._snackBar.open("Trail Run Successful", "CANCEL", {
              //       duration: 5000,
              //     });
              //     this.getModulesToDisplay();
              //     this.SpinnerService.hide();
              //     this.displayUploadPage = false;
              //     this.displayEditPage = false;
              //     document.getElementById('reportDisplay').click();
              //   })
              // }

            })
          })
        })
      })
    })
  }

  /*
  delete the jmxFileId folder
  */
  deleteTrailFolder() {
    let obj = {
      moduleName: this.moduleName,
      moduleId: this.selectedModuleForUpload,
        featureId: this.selectedFeatureForUpload,
      featureName: this.featureName,
      userName: this.userName,
      projectName: this.projectDetails,
      jmxFileName: this.uploadFileName,
      jmxFileId:this.jmxFileId
    }
    this.InputVar.nativeElement.value = "";
    this.performanceservice.deleteTrailFolder(obj).subscribe((data) => {
      console.log(data);
    })
  }

  /* converting the json data of script into required object use to display in UI.
  1.  fetching the data from DB and assigning data to respective variables.
  2. Read the latest generated json file if View Resul Tree(listener) is added and saved at actual execution.
  3. parsing the string form of boolean values to acual booleans. 
  */
  showEditPage() {
    this.resetForm();
    let obj = {
      jmxFileId: this.jmxFileId,
      featureId: this.jmxFeatureId,
      moduleId: this.jmxModuleId,
      projectId: this.projectId
    }
    this.performanceservice.getJmxData(obj).subscribe((res) => {
      console.log(res)
      this.features = res[0].features;
      this.scriptName = res[0].jmxFileName;
      this.trailStatus = res[0].status;
      this.treeStatus = res[0].Listener
      this.getThread();
      this.getRequests();
      this.getCSVFiles();
      this.userVariables = this.features.jmeterTestPlan.hashTree.hashTree.hashTree[1]['#item'].Arguments.collectionProp.elementProp;
      this.headerManager = this.features.jmeterTestPlan.hashTree.hashTree.HeaderManager.collectionProp.elementProp;
      this.DNSCache = JSON.parse(this.features.jmeterTestPlan.hashTree.hashTree.hashTree[5]['#item'].DNSCacheManager.boolProp['#text']);
      this.clearCookie = JSON.parse(this.features.jmeterTestPlan.hashTree.hashTree.hashTree[9]['#item'].CookieManager.boolProp['#text']);
      this.clearCache = JSON.parse(this.features.jmeterTestPlan.hashTree.hashTree.hashTree[11]['#item'].CacheManager.boolProp[0]['#text']);
      this.requestDefaults = this.features.jmeterTestPlan.hashTree.hashTree.hashTree[3]['#item'].ConfigTestElement;
      /////////
      if (this.treeStatus == 'executed') {
        let obj1 = {
          jmxFileId: this.jmxFileId,
          featureId: this.jmxFeatureId,
          moduleId: this.jmxModuleId,
          projectId: this.projectId,
          jmxFileName: this.scriptName,
          projectName: this.projectDetails,
          moduleName: this.moduleName,
          featureName: this.featureName
        }
        this.readJsonFile(obj1);
      }else{
        this.SpinnerService.hide();
      }
      //////////
    })
    this.displayEditPage = true;
    this.displayUploadPage = false;
    this.uploadForm.get('importFile').setValue(null);
  }

  /* copy or clone the threadGroup object to variable.
    parsing the string form of boolean values to acual booleans.
    checking the infityLoop checkbox is checked or not. 
  */
 getThread() {
    this.threadGroup = _.cloneDeep(this.features.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup);
    this.threadGroup.boolProp[0]['#text'] = JSON.parse(this.threadGroup.boolProp[0]['#text']);
    this.threadGroup.boolProp[1]['#text'] = JSON.parse(this.threadGroup.boolProp[1]['#text']);
    this.threadGroup.boolProp[2]['#text'] = JSON.parse(this.threadGroup.boolProp[2]['#text']);
    //this.infinityLoop = this.threadGroup.elementProp.stringProp['#text'];
    this.infinityLoop = Number(this.threadGroup.elementProp.stringProp['#text']);
    console.log(this.infinityLoop)
    if (this.infinityLoop == -1) {
      this.infinitycheck = true;
      this.threadGroup.elementProp.stringProp['#text'] = '';
    } else {
      this.infinitycheck = false;
    }
  }

  /*if infityLoop checkbox is checked or not and updating the values.
  */
  updateLoop(event) {
    if (event.target.checked) {
      this.threadGroup.elementProp.stringProp['#text'] = '';
      this.infinitycheck = true;
      this.threadGroup.elementProp.boolProp['#text'] = 'true';
    }
    else {
      this.infinitycheck = false;
      this.threadGroup.elementProp.stringProp['#text'] = '';
      this.threadGroup.elementProp.boolProp['#text'] = 'false';
    }
    console.log(this.threadGroup.elementProp.stringProp['#text'])
  }

  /*checking there is any csv files are added a or not and pusing the csv filnames.
  */
  getCSVFiles() {
    this.csvFiles = [];
    this.csvFileNames = [];
    for (var i = 15; i < this.features.jmeterTestPlan.hashTree.hashTree.hashTree.length; i = i + 2) {
      this.csvFiles.push(this.features.jmeterTestPlan.hashTree.hashTree.hashTree[i])
      var name = this.features.jmeterTestPlan.hashTree.hashTree.hashTree[i]['#item'].CSVDataSet.stringProp[0]['#text']
      var name1 = name.split('/')[1]
      var name2 = name1.split('.')[0]
      this.csvFileNames.push(name2)
    }
  }

  /*1. copying the TransactionController array to variable into objects.
    2. each TransactionController of all requests are stored to requests array.
    3.  each request having header manager if not we are creating the header manager object.
    4. each requests may contain one uniform random timer, one constant timer and have multiple Response Assertion and Regular expression extractor.
    5. display as boolean that controller os opened or closed.
    6. each having TransactionController one view result tree and multiple Response Assertion in controllerAssertions array.
    7. rowSelectedForEdit used for highlighting the selected http sample.
    8. timer1 is uniform random timer and timer2 is constant timer.
  */
  getRequests() {
    this.transactionController = [];
    this.threadGroupAssertions = [];
    let data = this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController;
    let obj = {
      "controllerName": "",
      "requests": [],
      "timers": [],
      "display": false,
      "rowSelectedForEdit": undefined,
      "controllerAssertions": []
    }
    for (var i = 0; i < data.length; i = i + 2) {
      obj.controllerName = data[i]['-testname']
      let val = data[i + 1]['#item'].hashTree[0].HTTPSamplerProxy;
      let httpRequests = [];
      let uniformTimers = [];
      let assertions = [];
      for (var j = 0; j < val.length; j = j + 2) {
        httpRequests.push(val[j])
      }
      for (var k = 1; k < val.length; k = k + 2) {
        uniformTimers.push(val[k])
      }


      uniformTimers.forEach((e, index) => {
        if (e['#item'].hashTree.length == undefined) {
          var ele = _.cloneDeep(e['#item'].hashTree)
          e['#item'].hashTree = [];
          e['#item'].hashTree.push(_.cloneDeep(ele))
          ele = {};
        }
        if (e['#item'].hashTree[0].HeaderManager == undefined) { //IF Header Manager is not present by default we aer adding the Header and making the necessary alterations to the object
          console.log("kkkkkk")
          if (e['#item'].hashTree[0].UniformRandomTimer !== undefined) {
            var uniformTimer = {
              "#item": {
                "UniformRandomTimer": _.cloneDeep(e['#item'].hashTree[0].UniformRandomTimer)
              }
            }
            var obj = _.cloneDeep(e['#item'].hashTree[0].hashTree)
            delete e['#item'].hashTree[0].hashTree;
            delete e['#item'].hashTree[0].UniformRandomTimer;
            e['#item'].hashTree[0].HeaderManager = _.cloneDeep(this.reqHeader.HeaderManager)
            e['#item'].hashTree[0].hashTree = []
            e['#item'].hashTree[0].hashTree.push(obj)
            e['#item'].hashTree[0].hashTree.push(uniformTimer)
            e['#item'].hashTree[0].hashTree.push(obj)
            if (index !== 0) {
              var reference = `../../../HTTPSamplerProxy[${index + 1}]/elementProp[2]/collectionProp`
              e['#item'].hashTree[0].HeaderManager.collectionProp['-reference'] = reference;
            }
            //making changes to the current request 
            var element = _.cloneDeep(httpRequests[index].elementProp)
            httpRequests[index].elementProp = [];
            var bool = {
              "#item": {
                "boolProp": _.cloneDeep(httpRequests[index].boolProp)
              }
            }
            var stringPro = {
              "#item": {
                "stringProp": _.cloneDeep(httpRequests[index].stringProp)
              }
            }
            delete httpRequests[index].boolProp
            delete httpRequests[index].stringProp
            httpRequests[index].elementProp.push(element)
            httpRequests[index].elementProp.push(bool)
            httpRequests[index].elementProp.push(stringPro)
            httpRequests[index].elementProp.push(this.performanceObj.reqHeader1)
          }
        }
      })

      console.log(uniformTimers)

      uniformTimers.forEach((e, index) => {
        e['#item'].assertions = [];
        e['#item'].regEx = [];
        if (e['#item'].hashTree[0].hashTree.length == undefined) {
          var obj = _.cloneDeep(e['#item'].hashTree[0].hashTree)
          delete e['#item'].hashTree[0].hashTree;
          e['#item'].hashTree[0].hashTree = []
          e['#item'].hashTree[0].hashTree.push(obj)
          e['#item'].timer1 = false;
          e['#item'].timer2 = false;
        }
        else {
          if (e['#item'].hashTree[0].hashTree.length == 1) {
            e['#item'].timer1 = false;
            e['#item'].timer2 = false;
          }
          else {
            e['#item'].timer1 = false;
            e['#item'].timer2 = false;
            var temp = {};
            for (var j = e['#item'].hashTree[0].hashTree.length - 1; j > 0; j--) {
              console.log(j)
              if (e['#item'].hashTree[0].hashTree[j]['#item'] !== undefined) {
                if (e['#item'].hashTree[0].hashTree[j]['#item'].UniformRandomTimer !== undefined) {
                  e['#item'].timer1 = true;
                }
                if (e['#item'].hashTree[0].hashTree[j]['#item'].ConstantTimer !== undefined) {
                  e['#item'].timer2 = true;
                }
                if (e['#item'].hashTree[0].hashTree[j]['#item'].ResponseAssertion !== undefined) {
                  temp = e['#item'].hashTree[0].hashTree.splice(j, 1)
                  e['#item'].assertions.push(temp[0])
                  e['#item'].hashTree[0].hashTree.splice(j, 1)
                }
                else if (e['#item'].hashTree[0].hashTree[j]['#item'].RegexExtractor !== undefined) {
                  temp = e['#item'].hashTree[0].hashTree.splice(j, 1)
                  e['#item'].regEx.push(temp[0])
                  e['#item'].hashTree[0].hashTree.splice(j, 1)
                }
              }
            }

          }
        }
        if (e['#item'].hashTree.length > 1) {
          for (var i = 1; i < e['#item'].hashTree.length; i++) {
            if (e['#item'].hashTree[i]['#item'] !== undefined)
              assertions.push(e['#item'].hashTree[i])
          }
          e['#item'].hashTree.splice(1, e['#item'].hashTree.length - 1)
        }
      })


      obj.timers = uniformTimers;
      obj.controllerAssertions = assertions;

      httpRequests.forEach((e, index) => {
        if (e.elementProp[0].collectionProp.elementProp == undefined) {
          e.elementProp[0].collectionProp.elementProp = [];
        }
      })
      obj.requests = httpRequests;
      this.transactionController.push(_.cloneDeep(obj))
      console.log(data[i + 1]['#item'].hashTree.length)
      if (data[i + 1]['#item'].hashTree.length > 2) {
        for (var l = 1; l < data[i + 1]['#item'].hashTree.length; l++) {
          if (data[i + 1]['#item'].hashTree[l]['#item'] !== undefined) {
            if (data[i + 1]['#item'].hashTree[l]['#item'].ResultCollector !== undefined) {//view Result Tree
              this.viewResultTree = data[i + 1]['#item'].hashTree[l]
              this.listenerName = this.viewResultTree['#item'].ResultCollector['-testname']
              this.resultTreeBool = true;
            }
            else {//Response Assertion
              this.threadGroupAssertions.push(data[i + 1]['#item'].hashTree[l])
            }
          }
        }
        data[i + 1]['#item'].hashTree.splice(1, data[i + 1]['#item'].hashTree.length - 1)

      }
      console.log(this.transactionController)
      console.log(this.features)
      console.log(this.viewResultTree)
      console.log(this.threadGroupAssertions)
    }

  }

  /*when open the Threa Group remaining will be closed
  */
  openForm1() {
    if (this.showForm1 == true) {
      this.showForm1 = false;
    }
    else {
      this.showForm1 = true;
      this.showForm2 = false;
      this.showForm3 = false;
      this.showForm4 = false;
      this.showForm5 = false;
    }
  }

  /*when open the User defined variables remaining will be closed
  */
  openForm2() {
    if (this.showForm2 == true) {
      this.showForm2 = false;
    }
    else {
      this.showForm1 = false;
      this.showForm2 = true;
      this.showForm3 = false;
      this.showForm4 = false;
      this.showForm5 = false;
    }
  }

  /*when open the Header Manager remaining will be closed
  */
  openForm3() {
    if (this.showForm3 == true) {
      this.showForm3 = false;
    }
    else {
      this.showForm1 = false;
      this.showForm2 = false;
      this.showForm4 = false;
      this.showForm3 = true;
      this.showForm5 = false;
    }
  }

  /*when open the Config Elements remaining will be closed
  */
  openForm4() {
    if (this.showForm4 == true) {
      this.showForm4 = false;
    }
    else {
      this.showForm1 = false;
      this.showForm2 = false;
      this.showForm3 = false;
      this.showForm4 = true;
      this.showForm5 = false;
    }
  }

  /*when open the HTTP Requests remaining will be closed
  */
  openForm5() {
    if (this.showForm5 == true) {
      this.showForm5 = false;
    }
    else {
      this.showForm1 = false;
      this.showForm2 = false;
      this.showForm3 = false;
      this.showForm4 = false;
      this.showForm5 = true;
    }
  }

  /*add a object into userVariables array when click on Add in User defined variables.
  */
  addVariable() {
    let userVar = {
      "-name": "",
      "-elementType": "Argument",
      "stringProp": [
        {
          "-name": "Argument.name",
          "#text": ""
        },
        {
          "-name": "Argument.value",
          "#text": ""
        }
      ]
    }
    this.userVariables.push(userVar)
    this.unSavedChangesExits = true;
  }

  /* when user enter a value in Name field of User defined variables, updates the value.
  */
  addVarName(i) {
    console.log(i)
    this.userVariables[i]['-name'] = this.userVariables[i].stringProp[0]['#text'];
  }

  /*remove the object in User defined variables when click on 'X' icon.
  */
  deleteVariable(i) {
    this.userVariables.splice(i, 1)
    this.unSavedChangesExits = true;
  }

/*add a object into headerManager array when click on Add in any Http sample of Header Manager.
  */
  addHeader() {
    let header = {
      "-name": "",
      "-elementType": "Header",
      "stringProp": [
        {
          "-name": "Header.name",
          "#text": ""
        },
        {
          "-name": "Header.value",
          "#text": ""
        }
      ]
    }
    this.headerManager.push(header)
    this.unSavedChangesExits = true;
    console.log(this.headerManager)
  }

  /* when user enter a value in Name field of any Http sample of Header Manager, updates the value.
  */
  addHeaderName(i) {
    this.headerManager[i]['-name'] = this.headerManager[i].stringProp[0]['#text'];
  }

  /*remove the object in any Http sample of Header Manager when click on 'X' icon.
  */
  deleteHeader(i) {
    this.headerManager.splice(i, 1)
    this.unSavedChangesExits = true;
  }

  /*updating the boolean value if any transactionController is opened or closed.
  */
  openController(j) {
    if (this.transactionController[j].display == true) {
      this.transactionController[j].display = false;
    }
    else {
      this.transactionController[j].display = true;
    }
  }

   /*when user click on any http sample Request the modal will open with respective values of request.
  */
  openHTTPModal(i, j) {
    this.headerRow = i;
    this.controllerRow = j;
    this.updateModal = true;
    this.httpRequest = _.cloneDeep(this.transactionController[j].requests[i])
    this.httpRequest.elementProp[1]['#item'].boolProp[1]['#text'] = JSON.parse(this.httpRequest.elementProp[1]['#item'].boolProp[1]['#text'])

    return document.getElementById("openHTTP").click();
  }

  /*add a object into opened http sample request array when click on Add in any Http sample request.
  */
  addReqParams() {
    this.unSavedChangesExits=true;
    var reqParam = {
      "-name": "",
      "-elementType": "HTTPArgument",
      "boolProp": {
        "-name": "HTTPArgument.always_encode",
        "#text": "false"
      },
      "stringProp": [
        {
          "-name": "Argument.name",
          "#text": ""
        },
        {
          "-name": "Argument.value",
          "#text": ""
        },
        {
          "-name": "Argument.metadata",
          "#text": "="
        }
      ]
    }
    this.httpRequest.elementProp[0].collectionProp.elementProp.push(reqParam);
    var element = document.getElementById('scrollDown');
    element.scrollTop = element.scrollHeight;
  }

   /*remove the object of property & avlue in any Http sample request when click on 'X' icon.
  */
  deleteReqParam(i) {
    this.unSavedChangesExits=true;
    this.httpRequest.elementProp[0].collectionProp.elementProp.splice(i, 1);
  }

  /* when user enter a value in Name field of any Http sample request, updates the value.
  */
  addParamName(i) {
    this.httpRequest.elementProp[0].collectionProp.elementProp[i]['-name'] = this.httpRequest.elementProp[0].collectionProp.elementProp[i].stringProp[0]['#text'];
    console.log(this.httpRequest.elementProp[2]['#item'].stringProp[4]['#text'])
  }

  /* when user creates new Http sample request it will save or else it will update.
  */
  saveRequest() {  
    if (!this.updateModal) {
      this.transactionController[this.controllerRow].requests.splice(this.controllerIndex, 0, _.cloneDeep(this.httpRequest))
      this.transactionController[this.controllerRow].timers.splice(this.controllerIndex, 0, _.cloneDeep(this.performanceObj.reqTimer))
      this.transactionController[this.controllerRow].rowSelectedForEdit = undefined;
      var element = document.getElementById('scrollDown1');
      element.scrollTop = element.scrollHeight;
      this.unSavedChangesExits=true;
    }
    else {
      this.transactionController[this.controllerRow].requests[this.headerRow] = this.httpRequest
      this.updateModal = false;
    }
    console.log(this.features)
    console.log(this.transactionController)

  }

  /* Not Using
  */
  getNewRequests() {
    console.log(this.controllerRow)
    let val = this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController[this.controllerRow * 2 + 1]['#item'].hashTree.HTTPSamplerProxy;
    let httpRequests = [];
    let uniformTimers = [];

    for (var i = 0; i < val.length; i = i + 2) {
      httpRequests.push(val[i])
    }
    for (var i = 1; i < val.length; i = i + 2) {
      uniformTimers.push(val[i])
    }
    uniformTimers[uniformTimers.length - 1]['#item'].timer1 = false;
    uniformTimers[uniformTimers.length - 1]['#item'].timer2 = false;
    this.transactionController[this.controllerRow].requests = httpRequests;
    this.transactionController[this.controllerRow].timers = uniformTimers;
  }

  /* when user click on any Header Manager a modal will open with respective values.
  */
  openHeaderManager(i, j) {
    this.headerRow = i;
    this.controllerRow = j;
    this.httpHeader = _.cloneDeep(this.transactionController[this.controllerRow].requests[i].elementProp[3])

    if (this.httpHeader.collectionProp.elementProp.length == undefined) {//If it contains only one Header
      var val = _.cloneDeep(this.httpHeader.collectionProp.elementProp);
      delete this.httpHeader.collectionProp.elementProp
      this.httpHeader.collectionProp['elementProp'] = [];
      this.httpHeader.collectionProp.elementProp.push(val)
    }
    return document.getElementById('openHeader').click();
  }

  /* removing the main Header Manager values of Name & value.
  */
  deleteHTTPHeader(i) {
    this.unSavedChangesExits=true;
    this.httpHeader.collectionProp.elementProp.splice(i, 1)
  }

   /*add a object into main Header Manager when click on Add.
  */
  addHTTPHeader() {
    this.unSavedChangesExits=true;
    var HTTPHeader = {
      "-name": "",
      "-elementType": "Header",
      "stringProp": [
        {
          "-name": "Header.name",
          "#text": ""
        },
        {
          "-name": "Header.value",
          "#text": ""
        }
      ]
    }
    this.httpHeader.collectionProp.elementProp.push(HTTPHeader)
    var element = document.getElementById('scrollDown1');
    element.scrollTop = element.scrollHeight;
  }

  /* when user enter a value in Name field of main Header Manager, updates the value.
  */
  addHTTPHeaderName(i) {
    this.unSavedChangesExits=true;
    this.httpHeader.collectionProp.elementProp[i]['-name'] = this.httpHeader.collectionProp.elementProp[i].stringProp[0]['#text'];
  }

/* when user selects to add unformTimer to any Http sample, it will display unformTimer modal.
  */
  addUniformTimer(i, j) {
    this.updateModal = false;
    this.headerRow = i;
    this.controllerRow = j;
    this.uniformTimer = _.cloneDeep(this.performanceObj.uniformTimer)
    return document.getElementById('openUniformTimer').click();
  }

  /* when user selects  any unformTimer of any Http sample, it will display unformTimer modal with respective values.
  */
  openUniformTimer(i, k) {
    this.headerRow = i;
    this.controllerRow = k;
    this.updateModal = true;
    for (var j = 1; j < this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree.length; j = j + 2) {
      if (this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree[j]['#item'].UniformRandomTimer) {
        this.uniformTimer = _.cloneDeep(this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree[j])
        this.arrayPos = j;
      }
    }

    return document.getElementById('openUniformTimer').click();
  }

  /* when user saves the new or update the unformTimer modal with respective values.
  */
  saveUniformTimer() {
    if (this.updateModal) {
      this.transactionController[this.controllerRow].timers[this.headerRow]['#item'].hashTree[0].hashTree[this.arrayPos] = this.uniformTimer;
      this.updateModal = false;
    }
    else {
    this.unSavedChangesExits=true;
      this.transactionController[this.controllerRow].timers[this.headerRow]['#item'].hashTree[0].hashTree.push(this.uniformTimer)
      this.transactionController[this.controllerRow].timers[this.headerRow]['#item'].hashTree[0].hashTree.push({ "-self-closing": "true" })
      this.transactionController[this.controllerRow].timers[this.headerRow]['#item'].timer1 = true;
    }
    this.uniformTimer = _.cloneDeep(this.performanceObj.uniformTimer)
  }

  /* when user selects to add constantTimer to any Http sample, it will display constantTimer modal.
  */
  addConstantTimer(i, j) {
    this.updateModal = false;
    this.headerRow = i;
    this.controllerRow = j;
    this.constantTimer = _.cloneDeep(this.performanceObj.constantTimer)
    return document.getElementById('openConstantTimer').click();
  }

/* when user saves the new or update the constantTimer modal with respective values.
  */
  saveConstantTimer() {
    if (this.updateModal) {
      this.transactionController[this.controllerRow].timers[this.headerRow]['#item'].hashTree[0].hashTree[this.arrayPos] = this.constantTimer
      this.updateModal = false;
    }
    else {
    this.unSavedChangesExits=true;
      this.transactionController[this.controllerRow].timers[this.headerRow]['#item'].hashTree[0].hashTree.push(this.constantTimer)
      this.transactionController[this.controllerRow].timers[this.headerRow]['#item'].hashTree[0].hashTree.push({ "-self-closing": "true" })
      this.transactionController[this.controllerRow].timers[this.headerRow]['#item'].timer2 = true;
    }
    this.constantTimer = _.cloneDeep(this.performanceObj.constantTimer)
  }

  /* when user selects  any constantTimer of any Http sample, it will display constantTimer modal with respective values.
  */
  openConstantTimer(i, k) {
    this.headerRow = i;
    this.controllerRow = k;
    this.updateModal = true;
    for (var j = 1; j < this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree.length; j = j + 2) {
      if (this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree[j]['#item'].ConstantTimer) {
        this.constantTimer = _.cloneDeep(this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree[j])
        this.arrayPos = j;
      }
    }
    return document.getElementById('openConstantTimer').click();
  }

  /* when user selects delete any UniformRandomTimer of any Http sample, it will remove object and update the values.
  */
  deleteUniformTimer(i, k) {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.unSavedChangesExits=true;
          for (var j = 1; j < this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree.length; j = j + 2) {
            if (this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree[j]['#item'].UniformRandomTimer) {
              this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree.splice(j, 2)
              this.transactionController[k].timers[i]['#item'].timer1 = false;
            }
          }
        }
      })
  }

  /* when user selects delete any ConstantTimer of any Http sample, it will remove object and update the values.
  */
  deleteConstantTimer(i, k) {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.unSavedChangesExits=true;
          for (var j = 1; j < this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree.length; j = j + 2) {
            if (this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree[j]['#item'].ConstantTimer) {
              this.transactionController[k].timers[i]['#item'].hashTree[0].hashTree.splice(j, 2)
              this.transactionController[k].timers[i]['#item'].timer2 = false;
            }
          }
        }
      })
  }

  /* Not using.
  */
  deleteReqHeader(i, j) {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          var obj = _.cloneDeep(this.transactionController[j].timers[i]['#item'].hashTree.hashTree)
          delete this.transactionController[j].timers[i]['#item'].hashTree
          this.transactionController[j].timers[i]['#item'].hashTree = _.cloneDeep(obj)
          this.transactionController[j].requests[i].elementProp.splice(3, 1)
        }
      })
  }

  /* Not Using.
  */
  addReqHeader(i, j) {
    this.updateModal = false;
    this.headerRow = i;
    this.controllerRow = j;
    this.httpHeader = _.cloneDeep(this.performanceObj.reqHeader1)
    return document.getElementById('openHeader').click();
  }

  /* when user selects any Header Manager of any Http sample, click on Save then update the values.
  */
  saveHTTPHeader() {
    this.unSavedChangesExits = true;
    this.transactionController[this.controllerRow].requests[this.headerRow].elementProp[3] = this.httpHeader
  }

/* when user selects Remove of any TransactionController, it will remove object from below arrays.
  */
  removeController(i) {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.unSavedChangesExits=true;
          this.transactionController.splice(i, 1)
          this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController.splice(i * 2, 2)
        }
      })
  }

  /* when user selects Edit of any TransactionController, it will open modal to edit controller Name.
  */
  editController(i) {
    this.controllerRow = i;
    this.updateModal = true;
    this.controllerName = this.transactionController[i].controllerName
    return document.getElementById('controllerEdit').click();
  }

  /* when user selects Add TransactionController at Main Request, it will open modal with default controller Name.
  */
  addController() {
    this.controllerName = 'Transaction Controller'
    this.updateModal = false;
    return document.getElementById('controllerEdit').click();
  }

  /* when user click on Save of TransactionController modal, it will add below object into the TransactionController array.
  */
  saveController() {
    this.unSavedChangesExits = true;
    if (this.updateModal == false) {
      let obj = {
        "controllerName": this.controllerName,
        "requests": [],
        "timers": [],
        "display": false,
        "rowSelectedForEdit": undefined,
        "controllerAssertions": []
      }
      let obj2 = this.performanceObj.transactionController1
      obj2['-testname'] = this.controllerName;
      this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController.push(obj2)
      this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController.push(this.performanceObj.transactionController2)
      this.transactionController.push(obj)
    }
    else {
      this.transactionController[this.controllerRow].controllerName = this.controllerName
    }
  }

   /* when selects to add Http sampler by right click of any sample request, a Http sample request modal will open.
  */
  addSampler() {
    this.updateModal = false;
    this.httpRequest = _.cloneDeep(this.performanceObj.httpRequest)
    return document.getElementById('openHTTP').click();
  }

   /* when selects to remove of Http sampler by right click of any sample request, it will remove the object from below arrays.
  */
  removeHTTP(i, j) {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.unSavedChangesExits = true;
          this.transactionController[j].requests.splice(i, 1)
          this.transactionController[j].timers.splice(i, 1)
          this.transactionController[j].rowSelectedForEdit = undefined;
        }
      })
  }

  /* when selects to remove of any uploaded csv file .
  1. delete csv filename from DB and delete csv file from csv folder and remove object from below array
  */
  removeCSV(i) {
    var name = this.csvFiles[i]['#item'].CSVDataSet.stringProp[0]['#text']
    var name1 = name.split('/')[1]
    var fileName = name1.split('.')[0]
    var obj = {
      projectId: this.projectId,
      projectName: this.projectDetails,
      moduleId: this.jmxModuleId,
      featureId: this.jmxFeatureId,
      moduleName: this.moduleName,
      featureName: this.featureName,
      jmxFileName: this.scriptName,
      jmxFileId:this.jmxFileId,
      CSVFileName: fileName
    }
    this.performanceservice.deleteCSVFile(obj).subscribe(res => {
      if (res) {
        this.unSavedChangesExits = true;
        this.csvFiles.splice(i, 1)
        this.features.jmeterTestPlan.hashTree.hashTree.hashTree.splice(15 + i, 2)
        this.csvFileNames.splice(i, 1)
      }
    })
    console.log(this.features)
  }

  /* when selects to add CSV file, it will open a modal to upload csv file.
  */
  addCSVFile() {
    return document.getElementById('uploadCSV').click();
  }

  /* when click on upload button of upload csv file modal.
  1. checks the duplicates from DB
  2. uploads the csv file into csv folder
  3. updates the main features object
  */
  uploadCSVFile(filePath) {
    var name1 = filePath.split('\\')[2]
    var name = name1.split('.')[0]

    if (name1.split('.'[1]) !== 'csv') {
      let obj = {
        projectId: this.projectId,
        moduleId: this.jmxModuleId,
        featureId: this.jmxFeatureId,
        moduleName: this.moduleName,
        featureName: this.featureName,
        userName: this.userName,
        projectName: this.projectDetails,
        CSVFileName: name,
        jmxFileName: this.scriptName
      }
      console.log(obj)
      this.performanceservice.checkForDuplicateCSV(obj).subscribe((res) => {
        console.log(res)
        if (res == 'success') {
          this.uploadDetails = `${this.projectId},${this.projectDetails},${this.jmxModuleId},${this.jmxFeatureId},${this.moduleName},${this.featureName},${this.jmxFileId},${this.scriptName}`
          this.performanceservice.uploadCSV(this.filesToUpload, this.uploadDetails)
            .subscribe((result) => {
              this.unSavedChangesExits = true;
              console.log(result)
              var obj = _.cloneDeep(this.performanceObj.csvFile)
              obj['#item'].CSVDataSet.stringProp[0]['#text'] = `csv/${name1}`;
              this.features.jmeterTestPlan.hashTree.hashTree.hashTree.push(obj)
              this.features.jmeterTestPlan.hashTree.hashTree.hashTree.push({ "-self-closing": "true" })
              this.getCSVFiles();
              console.log(this.features)
              console.log(this.csvFiles)
            }, (error) => {
              alert("Error Occurred" + error)
            });
        }
        else {
          alert("Duplicates not allowed")
        }
      })
    }
  }

  /* when click on save button on top of page to save jmx file, below some functions will called.
  1. update the featues object into DB, update the scriptId.json file and convert to jmx form.
  */
  saveJMXFile() {
    this.setThreadGroup();
    this.setConfig();
    this.setAssertions();
    //this.setCSVFiles();
    this.setHTTPRequest();
    let obj = {
      "projectName": this.projectDetails,
      "projectId": this.projectId,
      "jmxFileId": this.jmxFileId,
      "jmxFileName": this.scriptName,
      "moduleId": this.jmxModuleId,
      "featureId": this.jmxFeatureId,
      "moduleName": this.moduleName,
      "featureName": this.featureName,
      "userName": this.userName,
      "features": this.features,
      "csvFileNames": this.csvFileNames,
      "resultTree": this.resultTreeBool
    }
    console.log(this.features)
    this.spinnerPercent = '';
    this.spinnerVal = "Saving..."
    this.SpinnerService.show();
    this.performanceservice.saveData(obj).subscribe(res => {
      this.unSavedChangesExits = false;
      console.log(res)
      this.getRequests();
      this.SpinnerService.hide();
      this._snackBar.open("Saved Sucessfully", "CANCEL", {
        duration: 5000,
      });
    })
  }

  /* updates the ThreadGroup object.
  */
  setThreadGroup() {
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup = _.cloneDeep(this.threadGroup);
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.boolProp[0]['#text'] = this.threadGroup.boolProp[0]['#text'].toString();
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.boolProp[1]['#text'] = this.threadGroup.boolProp[1]['#text'].toString();
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.boolProp[2]['#text'] = this.threadGroup.boolProp[2]['#text'].toString();
    if (this.infinitycheck == true) {
      this.threadGroup.elementProp.stringProp['#text'] = '-1';
    }
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.elementProp.stringProp['#text'] = this.threadGroup.elementProp.stringProp['#text'].toString();

    console.log(this.features.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup)
  }

   /* updates the DNSCacheManager,CookieManager, CacheManager boolean values.
  */
  setConfig() {
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[5]['#item'].DNSCacheManager.boolProp['#text'] = this.DNSCache.toString();
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[9]['#item'].CookieManager.boolProp['#text'] = this.clearCookie.toString();
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[11]['#item'].CacheManager.boolProp[0]['#text'] = this.clearCache.toString();
  }

  /* not using.
  */
  setCSVFiles() {
    console.log(this.csvFiles)
    if (this.csvFiles.length !== 0) {
      for (var i = 0; i < this.csvFiles.length; i++) {
        this.features.jmeterTestPlan.hashTree.hashTree.hashTree.push(_.cloneDeep(this.csvFiles[i]))
      }
    }
  }

  /* updating the added Response Assertions and View Result Tree(Listner) at Main Http Request.
  */
  setAssertions() {
    var length = this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController.length;
    var obj = {
      "-self-closing": "true"
    }
    if (this.threadGroupAssertions.length > 0) {
      this.threadGroupAssertions.forEach((e, i) => {
        this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController[length - 1]['#item'].hashTree.push(e)
        this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController[length - 1]['#item'].hashTree.push(obj)
      })
    }
    if (this.resultTreeBool) {
      this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController[length - 1]['#item'].hashTree.push(this.viewResultTree)
      this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController[length - 1]['#item'].hashTree.push(obj)
    }

  }

  /* updating the HTTPSamplerProxy array.
  1. updating the -reference of each http sampler of HeaderManager.
  2. updating the assertions, regEx of each http sampler and deleting the arrays.
  3. updating the -self-closing at transactionController[i].requests
  4. updating the transactionController[i].timers.
  5. merging two arrays of transactionController[i].requests, transactionController[i].timers into single array ofHTTPSamplerProxy
  */
  setHTTPRequest() {
    var obj = {
      "-self-closing": "true"
    }
    var length = 0;
    for (var i = 0; i < this.transactionController.length; i++) {
      this.transactionController[i].timers.forEach((e, i) => {

        if (i == 0) {
          e['#item'].hashTree[0].HeaderManager.collectionProp['-reference'] = `../../../HTTPSamplerProxy/elementProp[2]/collectionProp`
        }
        else {
          e['#item'].hashTree[0].HeaderManager.collectionProp['-reference'] = `../../../HTTPSamplerProxy[${i + 1}]/elementProp[2]/collectionProp`
        }

        if (e['#item'].assertions.length > 0) {
          e['#item'].assertions.forEach(element => {
            e['#item'].hashTree[0].hashTree.push(element)
            e['#item'].hashTree[0].hashTree.push(obj)
          });
        }
        if (e['#item'].regEx.length > 0) {
          e['#item'].regEx.forEach(element => {
            e['#item'].hashTree[0].hashTree.push(element)
            e['#item'].hashTree[0].hashTree.push(obj)
          });
        }
        delete e['#item'].timer1
        delete e['#item'].timer2
        delete e['#item'].assertions
        delete e['#item'].regEx
      })
      this.transactionController[i].requests.forEach(e => {
        if (e.elementProp[0].collectionProp.elementProp.length == 0) {
          delete e.elementProp[0].collectionProp.elementProp
          e.elementProp[0].collectionProp['-self-closing'] = 'true'
        }
        else {
          delete e.elementProp[0].collectionProp['-self-closing']
        }
      })

      if (this.transactionController[i].controllerAssertions.length > 0) {
        length = this.transactionController[i].timers.length - 1;
        this.transactionController[i].controllerAssertions.forEach(element => {
          this.transactionController[i].timers[length]['#item'].hashTree.push(element)
          this.transactionController[i].timers[length]['#item'].hashTree.push(obj)
        });
      }

      //merging two arrays into single array
      this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController[i * 2 + 1]['#item'].hashTree[0].HTTPSamplerProxy = []
      for (var j = 0; j < this.transactionController[i].requests.length; j++) {
        this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController[i * 2 + 1]['#item'].hashTree[0].HTTPSamplerProxy.push(this.transactionController[i].requests[j])
        this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController[i * 2 + 1]['#item'].hashTree[0].HTTPSamplerProxy.push(this.transactionController[i].timers[j])
      }
    }
    console.log(this.transactionController)
    console.log(this.features)

  }

  /* when click on execute button at top of page to execute actual test
  1. checking atleast one Master and Slaves containers are stared and blocked.
  */
  execution() {
    if (this.mastersData.length == 0 && this.slavesData == 0) {
      this.resultmsgActual = "Please Start Master and Slaves"
    }
    else if (this.mastersData.length == 0) {
      this.resultmsgActual = "Please Start Master Container"
    }
    else if (this.slavesData.length == 0) {
      this.resultmsgActual = "Please Start Slave Containers"
    }
    else if (this.mastersData1.length == 0 && this.slavesData1.length == 0) {
      this.resultmsgActual = "Please go to Browser Selection and Block the required Master & Slave Containers"
    }
    else if (this.mastersData1.length == 0) {
      this.resultmsgActual = "Please go to Browser Selection and Block the Master Container"
    }
    else if (this.slavesData1.length == 0) {
      this.resultmsgActual = "Please go to Browser Selection and Block the required Slave Containers"
    }
    return document.getElementById('execute').click();
  }

  /* fecthing the master containers data blocked by this user.
  */
  mastersData1: any;
  getUserMasterDetails(orgId) {
    this.mastersData = [];
    this.mastersData1 = [];
    let obj = { 'orgId': orgId, "userName": this.newUserName, "type": "master" }
    this.performanceservice.execMasterDetails(obj)
      .subscribe(async (result) => {
        this.mastersData = result
        this.mastersData.forEach(element => {
          if (element.userName == this.newUserName) {
            this.mastersData1.push(element)
          }
        });
        console.log(this.mastersData)
        console.log(this.mastersData1)
      })
  }

  /*  fecthing the slave containers data blocked by this user.
  */
  slavesData1: any;
  getUserSlaveDetails(orgId) {
    this.slavesData = [];
    this.slavesData1 = [];
    let obj = { 'orgId': orgId, "userName": this.newUserName, "type": "slave" }
    this.performanceservice.execSlaveDetails(obj)
      .subscribe(async (result) => {
        this.slavesData = result
        this.slavesData.forEach((element, index) => {
          if (element.userName == this.newUserName) {
            this.slavesData1.push(element)
          }
        });
        this.slavesData1.forEach(element => {
          element.check=false;
        });
      })
  }

  /* when any master is slected from dropdown, update to masterDetails.
  */
  masterDetails;
  masterFunction(master) {
    this.masterDetails = master;
  }

   /* when any slave is check or uncheck , update to slavesData1.
  */
  slaveFunction(index, slave, slavesData1) {
    this.removedArray = [...slavesData1];
    for (let i = 0; i < this.removedArray.length; i++) {
      if (index == i) {
        console.log(this.slavesData1, 'jjjjj')
        if (this.slavesData1[i].check == true) {
          console.log(this.slavesData1, 'hhhhhhh')
          this.slavesData1[i].check = false;
        }
        else if (this.slavesData1[i].check == false) {
          this.slavesData1[i].check = true;
          console.log(this.slavesData1, 'ggggggg')
        }
        else { }
        this.removedArray.splice(i, 1);
      }
    }
  }

  /* when click on proceed of execute modal.
  1. checking the script is falied in trail test or not done trail run .
  2. not selected any master and slaves container and jmeterexecution machine is stopped or not.
  3. containers are blocked or running.
  */
  slaveDetails
  nextFUnction
  jmeterExecuteCall() {
    if (this.trailStatus == 'FAIL') {
      this.resultmsgActual = "Script Failed in Trail Test"
    }
    else if (this.trailStatus == 'jmxGenerated') {
      this.resultmsgActual = "Please Complete the Trail Run"
    }
    else {
      this.slaveDetails = []
      this.nextFUnction = false
      this.slavesData1.forEach(element => {
        if (element.check == true) {
          this.slaveDetails.push(element)
        }
      });
      if (this.masterDetails == undefined && this.slaveDetails.length == 0) {
        return this.resultmsgActual = "Please select master and slaves container"
      } else {
        if (this.slaveDetails.length == 0) {
          return this.resultmsgActual = "Please select slaves container"
        } else {
          if (this.masterDetails == undefined) {
            return this.resultmsgActual = "Please select master container"
          } else {
            this.resultmsgActual = ''
          }
        }
      }
      let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
      let obj = { 'orgId': orgId }
      this.performanceservice.checkDocker(obj)
        .subscribe(async (result) => {
          console.log(result)
          this.dockerStart = result
          if (this.dockerStart[0].state === "Running") {
            // this.tableData = this.dockerStart[0].jmeterData
            this.masterData = this.masterDetails
            // this.slaveData = this.dockerStart[0].jmeterData[0].slaves
            if (this.masterData.state === "Running") {
              if (this.masterData.status === "Blocked") {
                this.slaveDetails.forEach(element => {
                  if (element.state == "Stopped") {
                    this.nextFUnction = true
                  }
                });
                if (this.nextFUnction == false) {
                  this.checkCall()
                }
                else {
                  return this.resultmsgActual = "Please start slaves container"
                }
              } else {
                return this.resultmsgActual = "Master container is not free"
              }
            }
            else {
              return this.resultmsgActual = "Please start master container"
            }
          }
          else {
            return this.resultmsgActual = "Please start docker Machine"
          }
        })
    }

  }

  /*checking each slave container is free or not then call copycall() function
  */
  nextFUnctionOne
  checkCall() {
    this.nextFUnctionOne = false
    this.slaveDetails.forEach(element => {
      if (element.status == "Running") {
        this.nextFUnctionOne = true
      }
    });
    if (this.nextFUnctionOne == false) {
      this.resultmsgActual = ""
      this.copycall()
    }
    else {
      return this.resultmsgActual = "salve containers are not free"
    }
  }

  /*1. updating the selected containers status in DB.
    2. copy script to MasterContainer and displaying the start time
    3. displaying the difference time thread life time of duration and infinity loop is true as Remaining Time left: until execution
    4. displaying the logs for every 20 secs and stops execution is done 
    5. generates a csv results file, log.txt file, html reports file.
    6. copy csv results file, script.xml(Listner) and convert to json form, results Html folder.
    7. delete csv results file, script.xml(Listner), results Html folder in the master container.
    8. change to blocked status of selected master and slave containers.
    9. fetching the json(listner) data and alert to save in ViewResultTree folder and update date, time and ReportId or close the Lister result. 
    10. adding Listener data to testResult.httpSample array
  */
  Rtime: any;
  dDay: any;
  stopbutton: any;
  resultExe1: any;
  copycall() {
    this.consoleLog='';
    this.Rtime = false;
    this.resultExe1 = "Pass"
    this.spinnerPercent = 0 + '%';
    this.spinnerVal = "Executing Actual Test..."
    this.SpinnerService.show();
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let obj = {
      "orgId": orgId,
      "masterDetails": this.masterDetails,
      "slaveDetails": this.slaveDetails,
      "projectName": this.projectDetails,
      "jmxFileId": this.jmxFileId,
      "jmxFileName": this.scriptName,
      "moduleName": this.moduleName,
      "featureName": this.featureName,
      "projectId": this.projectId,
      "moduleId": this.jmxModuleId,
      "featureId": this.jmxFeatureId,
      "userName": this.userName
    }
    this.performanceservice.changeToRunningStatus(obj)
      .subscribe(result => {
        this.spinnerPercent = 15 + '%';
        this.performanceservice.copyScriptsToMasterContainer(obj)
          .subscribe(result => {
            this.spinnerPercent = 30 + '%';
            if (result == "Pass") {
              this.stopbutton = true;
              this.ExeTime = true;
              var time = new Date();
              this.executeTime = time.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true })
              var hr = this.executeTime.split(":")[0]
              if (this.executeTime.split(":")[0] < 10) {
                hr = "0" + hr;
              }
              this.executeTime = hr + ":" + this.executeTime.split(":")[1];
              // console.log(this.executeTime);
              obj["time"] = this.executeTime;
              // console.log(obj);
              console.log(this.threadGroup.longProp[0]['#text'])
              if (this.threadGroup.longProp[0]['#text'] > 0&&this.infinitycheck==true) {
                this.timeDifference='';
                 this.secondsToDday='';
                  this.minutesToDday='';
                   this.hoursToDday='';
                   this.daysToDday='';
              this.Rtime = true;
                this.dDay = new Date()
                this.dDay.setMilliseconds(this.threadGroup.longProp[0]['#text'] * 1000)
                this.getTimeDifference();
                this.subscription = interval(1000)
                  .subscribe(x => { this.getTimeDifference(); });
              }
              this.logFile = setInterval(() => {
                this.performanceservice.readLogs(obj)
                  .subscribe(resultLogs => {
                    //console.log(resultLogs)
                    this.consoleLog = resultLogs.capturedFinal;
                    if (resultLogs.endRun) {
                      clearInterval(this.logFile)
                    }
                  })
              }, 1000 * 20)
              this.performanceservice.actualCallExecution(obj)
                .subscribe(resultExe => {
                  this.spinnerPercent = 45 + '%';
                  console.log(resultExe)
                  if(this.Rtime==true){
                    this.Rtime = false;
                    this.subscription.unsubscribe();
                  }
                  if (resultExe == "Pass") {
                    this.stopbutton = false;
                    this.performanceservice.copyResultsToLocalMachine(obj)
                      .subscribe(copyResult => {
                        this.spinnerPercent = 60 + '%';
                        if (copyResult == "Pass") {
                          this.performanceservice.copyHTMLResultsToLocalMachine(obj)
                            .subscribe(copyHTML => {
                              this.spinnerPercent = 75 + '%';
                              if (copyHTML == "Pass") {
                                this.performanceservice.deleteInDockerContainer(obj)
                                  .subscribe(result => {
                                    this.spinnerPercent = 80 + '%';
                                this.performanceservice.changeToBlockedStatus(obj)
                                  .subscribe(result => {
                                    this.spinnerPercent = 90 + '%';
                                    this.performanceservice.convertActualCsvToJson(obj)
                                      .subscribe(result => {
                                        if (result.Listener == 'executed') {
                                          this.actualTree = '';
                                          this.spinnerPercent = 95 + '%';
                                          this.performanceservice.readJsonFile(obj)
                                            .subscribe(result1 => {
                                              this.spinnerPercent = 100 + '%';
                                              this.SpinnerService.hide();
                                              document.getElementById('close').click();
                                              document.getElementById('saveResult').click();
                                              this.ExeTime = false;
                                               this.testResult = result1.testResults
                                               this.treeStatus = result.Listener
                                               if (this.testResult.httpSample.length == undefined) {
                                                 var val = this.testResult.httpSample
                                                 this.testResult.httpSample = [];
                                                 this.testResult.httpSample.push(val)
                                               }
                                               for (var i = 0; i < this.testResult.httpSample.length; i++) {
                                                 if (this.testResult.httpSample[i].assertionResult !== undefined) {
                                                   if (this.testResult.httpSample[i].assertionResult.length == undefined) { //creating assertionresult array in threadgroup level
                                                     var obj = this.testResult.httpSample[i].assertionResult;
                                                     this.testResult.httpSample[i].assertionResult = [];
                                                     this.testResult.httpSample[i].assertionResult.push(obj)
                                                     this.testResult.httpSample[i].openAssertions = false;
                                                   }
                                                 }
                                                 if (this.testResult.httpSample[i].httpSample !== undefined) {
                                                   this.testResult.httpSample[i].openSubSample = false;
                                                   for (var j = 0; j < this.testResult.httpSample[i].httpSample.length; j++) {
                                                     if (this.testResult.httpSample[i].httpSample[j].assertionResult !== undefined) {
                                                       if (this.testResult.httpSample[i].httpSample[j].assertionResult.length == undefined) {
                                                         var obj2 = this.testResult.httpSample[i].httpSample[j].assertionResult;
                                                         this.testResult.httpSample[i].httpSample[j].assertionResult = [];
                                                         this.testResult.httpSample[i].httpSample[j].assertionResult.push(obj2)
                                                       }
                                                       this.testResult.httpSample[i].httpSample[j].openAssertions = false;
                                                     }
                                                   }
                                                 }
 
                                               }
                                               if (this.testResult.sample.length == undefined) {
                                                 var temp = _.cloneDeep(this.testResult.sample);
                                                 this.testResult.sample = [];
                                                 this.testResult.sample.push(temp)
                                               }
                                             })
                                         }
                                         else{
                                           this.spinnerPercent = 100 + '%';
                                           document.getElementById('close').click();
                                           this.SpinnerService.hide();
                                           this.ExeTime = false;
                                           clearInterval(this.logFile)
                                           if (this.resultExe1 == 'Fail') {
                                             this.dialogService.openAlert("Execution Stopped..")
                                           } else {
                                             this.dialogService.openAlert("Execution Completed. To View Exceution Report,Click On Open Report Button")
                                           }
                                         }
                                        
                                         console.log(result)
                                      })
                                  })
                                })
                              }
                              else {
                                this.performanceservice.changeToBlockedStatus(obj)
                                  .subscribe(result => {
                                    this.performanceservice.deleteInDockerContainer(obj)
                                      .subscribe(result => {
                                        this.performanceservice.removeFolderDb(obj)
                                          .subscribe(result => {
                                            this.ExeTime = false;
                                            clearInterval(this.logFile)
                                            this.Rtime = false;
                                          })
                                      })
                                    this.SpinnerService.hide();
                                    document.getElementById('close').click();
                                  })
                                this.dialogService.openAlert("Execution Failed")
                              }
                            })
                        }
                        else {
                          this.performanceservice.changeToBlockedStatus(obj)
                                  .subscribe(result => {
                                    this.performanceservice.deleteInDockerContainer(obj)
                                      .subscribe(result => {
                                        this.performanceservice.removeFolderDb(obj)
                                          .subscribe(result => {
                                            this.ExeTime = false;
                                            clearInterval(this.logFile)
                                            this.Rtime = false;
                                          })
                                      })
                                    this.SpinnerService.hide();
                                    document.getElementById('close').click();
                                  })
                                this.dialogService.openAlert("Execution Failed")
                        }
                      })
                  }
                  else {
                    this.stopbutton = false;
                    this.performanceservice.changeToBlockedStatus(obj)
                      .subscribe(result => {
                        this.ExeTime = false;
                        clearInterval(this.logFile)
                        this.Rtime = false;
                        this.SpinnerService.hide();
                        document.getElementById('close').click();
                      })
                    this.dialogService.openAlert("Execution Failed")
                  }
                })
            }
            else {
              this.stopbutton = false;
              this.performanceservice.changeToBlockedStatus(obj)
                .subscribe(result => {
                  this.ExeTime = false;
                  clearInterval(this.logFile)
                  this.Rtime = false;
                  this.SpinnerService.hide();
                  document.getElementById('close').click();
                })
              this.dialogService.openAlert("Execution Failed")
            }
          })
      })
  }

  /* get the difference time between delay time and current time and displaying the difference in days,hoursm minutes and seconds.
  */
  getTimeDifference() {
    // console.log(this.dDay, new Date(), this.dDay.getTime() - new Date().getTime())
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    if(this.secondsToDday<0){
      this.subscription.unsubscribe();
      this.Rtime=false;
    }
    // console.log(timeDifference, this.secondsToDday, this.minutesToDday, this.hoursToDday, this.daysToDday)
  }

  /* fetch all the Html reports generated and display in reports Modal
  */
  openReport() {
    document.getElementById("searchReport").click();
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let obj = {
      "orgId": orgId,
      "projectId": this.projectId,
      "moduleId": this.jmxModuleId,
      "featureId": this.jmxFeatureId,
      "projectName": this.projectDetails,
      "jmxFileId": this.jmxFileId,
      "jmxFileName": this.scriptName,
      "moduleName": this.moduleName,
      "featureName": this.featureName,
      "date": 'false'
    }
    this.performanceservice.getjmxReportDetails(obj)
      .subscribe(result => {
        console.log(result)
        if (result.length == 0) {
          this.resultmsgActual = 'No Reports available';
        } else {
          this.resultmsgActual = '';
        }
        this.performanceReportdetails = result;
        this.dataSource = new MatTableDataSource(this.performanceReportdetails);
        this.ngAfterViewInit();
      })
  }

  /* if click on Stop button in the middle of execution
  */
  stopExecution() {
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let obj = {
      "orgId": orgId,
      "masterDetails": this.masterDetails,
      "slaveDetails": this.slaveDetails,
      "projectName": this.projectDetails,
      "jmxFileId": this.jmxFileId,
      "jmxFileName": this.scriptName,
      "moduleName": this.moduleName,
      "featureName": this.featureName,
      "projectId": this.projectId,
      "moduleId": this.jmxModuleId,
      "featureId": this.jmxFeatureId,
      "userName": this.userName
    }
    this.dialogService.nlpDialog('Are You Sure...? You Want To Stop Execution. ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.stopbutton = false;
          this.resultExe1 = 'Fail';
          this.spinnerVal = "Execution Stopping..."
          this.performanceservice.stopExecution(obj).subscribe((result) => {
            console.log(result);
          })
        }
      })
  }

  /* click on execution modal fetch masterdetails and slavedetails
  */
  closeExecutionModal() {
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    this.getUserMasterDetails(orgId);
    this.getUserSlaveDetails(orgId);
    this.masterDetails = [];
    this.slaveDetails = [];
    this.resultmsgActual = '';
  }

  /* click on fullscreen icon enlarging the iframe screen
  */
  openFullscreen() {
    // alert("Enter")
    var elem = document.getElementById("myvideo");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  /* if click on close of opened report modal then delete the opened report copied in UI
    call  reopenReports() to fetch Html reports
  */
  removeUserFolder() {
    let obj = {
      "userName": this.userName
    }
    document.getElementById("searchReport").click();
    this.reopenReports();
    this.performanceservice.removeUserFolder(obj).subscribe((res) => {

    })
  }

   /* select any http sampler row, it will be highlighted
  */
  highLightRow(i, j) {
    this.transactionController[j].rowSelectedForEdit = i;
  }

  /* select any http sampler to Add HTTP Sampler
  display modal if selected is first sampler where to add above or below
  */
  addRow(i, j) {
    if (this.transactionController[j].requests.length == 0) {
      this.controllerIndex = 0;
      this.controllerRow = j;
      this.addSampler();
    }
    else {
      this.controllerRow = j;
      if (i == 0) {
        return document.getElementById('rowSelect').click();
      }
      else {
        this.controllerIndex = i + 1;
        this.addSampler();
      }
    }
  }

  /* if copy any http sampler that is stored in variable
  */
  copySample = [];
  copySam: any
  copyHTTP(i, j) {
    this.copySample = [];
    this.copyCont = [];
    let obj = {
      "requests": [],
      "timers": []
    }
    this.copySam = true;
    this.copyCon = false;
    console.log(this.transactionController[j])
    obj.requests = _.cloneDeep(this.transactionController[j].requests[i]);
    console.log(this.transactionController[j].timers[i])
    obj.timers = _.cloneDeep(this.transactionController[j].timers[i]);
    this.copySample.push(obj);
    console.log(this.copySample)
    this._snackBar.open("Copied Successfully", "CANCEL", {
      duration: 3000,
    });
  }

  /* paste the copied http sampler in any transactionController.
  */
  pasteHTTP(j) {
    this.unSavedChangesExits=true;
    this.controllerRow = j;
    this.controllerIndex = this.transactionController[j].requests.length;
    this.transactionController[this.controllerRow].requests[this.controllerIndex] = _.cloneDeep(this.copySample[0].requests)
    this.transactionController[this.controllerRow].timers.push(_.cloneDeep(this.copySample[0].timers))
    console.log(this.transactionController[j])
    // this.copySam = false;
    // this.copyCon=false;
    this._snackBar.open("Pasted Successfully", "CANCEL", {
      duration: 3000,
    });
  }

  /* paste the copied http sampler in any Http sampler it will add below not first row or else display modal where to paste.
  */
  pasteHTTPSample(i, j) {
    this.controllerRow = j;
    if (i == 0) {
      return document.getElementById('pasteRow').click();
    }
    else {
      this.controllerIndex = i + 1;
      this.HttpSamplePaste()
    }
  }

  /* paste the copied http sampler in any Http sampler.
  */
  HttpSamplePaste() {
    this.unSavedChangesExits=true;
    this.transactionController[this.controllerRow].requests.splice(this.controllerIndex, 0, _.cloneDeep(this.copySample[0].requests))
    this.transactionController[this.controllerRow].timers.splice(this.controllerIndex, 0, _.cloneDeep(this.copySample[0].timers))
    // this.transactionController[this.controllerRow].requests[this.controllerIndex]=_.cloneDeep(this.copySample[0].requests)
    // this.transactionController[this.controllerRow].timers[this.controllerIndex]=_.cloneDeep(this.copySample[0].timers)
    console.log(this.transactionController[this.controllerRow])
    //  this.copySam = false;
    //  this.copyCon=false;
    this._snackBar.open("Pasted Successfully", "CANCEL", {
      duration: 3000,
    });
  }

  /* if pasted in above of http sampler in any Http sampler.
  */
  pasteAbove() {
    this.controllerIndex = 0;
    this.HttpSamplePaste()
  }

  /*  if pasted in below of http sampler in any Http sampler.
  */
  pasteBelow() {
    this.controllerIndex = 1;
    this.HttpSamplePaste()
  }

  /* if copy any transactionController that is stored in variable
  */
  copyCont = [];
  copyCon: any;
  copyController(j) {
    this.copyCont = [];
    this.copySample = [];
    this.copyCon = true;
    this.copySam = false;
    console.log(this.transactionController[j])
    this.copyCont.push(_.cloneDeep(this.transactionController[j]))
    console.log(this.copyCont)
    this._snackBar.open("Copied Successfully", "CANCEL", {
      duration: 1000,
    });
  }

  /* paste the copied transactionController at Main Http Request
  */
  pasteController() {
    this.unSavedChangesExits = true;
    let obj2 = this.performanceObj.transactionController1
    obj2['-testname'] = this.controllerName;
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController.push(obj2)
    this.features.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController.push(this.performanceObj.transactionController2)
    this.transactionController.push(_.cloneDeep(this.copyCont[0]));
    // this.copyCon=false;
    // this.copySam = false;
    console.log(this.transactionController)
    this._snackBar.open("Pasted Successfully", "CANCEL", {
      duration: 1000,
    });
  }

   /* Add HTTP Sampler when right click of transactionController
  */
  addNewSampler(j) {
    this.updateModal = false;
    this.controllerRow = j;
    this.controllerIndex = this.transactionController[j].requests.length;
    this.httpRequest = _.cloneDeep(this.performanceObj.httpRequest)
    return document.getElementById('openHTTP').click();
  }

  /* select any http sampler to Add HTTP Sampler
  display modal if selected is first sampler and click on above buton
  */
  controllerIndex;
  addSamplerAbove() {
    this.controllerIndex = 0;
    this.addSampler();
  }

  /* select any http sampler to Add HTTP Sampler
  display modal if selected is first sampler and click on below buton
  */
  addSamplerBelow() {
    this.controllerIndex = 1;
    this.addSampler();
  }

  /* click on search button on reports modal and fetch all reports and date wise deports
  */
  searchCall() {
    console.log(this.selectedDate)
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let obj = {
      "orgId": orgId,
      "projectId": this.projectId,
      "moduleId": this.jmxModuleId,
      "featureId": this.jmxFeatureId,
      "projectName": this.projectDetails,
      "jmxFileId": this.jmxFileId,
      "jmxFileName": this.scriptName,
      "moduleName": this.moduleName,
      "featureName": this.featureName,
      "date": this.selectedDate
    }
    if (this.selectedDate != '') {
      this.performanceservice.getjmxReportDetails(obj)
        .subscribe(result => {
          console.log(result)
          if (result.length == 0) {
            this.resultmsgActual = 'No Reports available';
          } else {
            this.resultmsgActual = '';
          }
          this.performanceReportdetails = result;
          this.dataSource = new MatTableDataSource(this.performanceReportdetails);
          this.ngAfterViewInit();
        })
    }
    else {
      this.reopenReports()
    }

  }

  /* open Html Report of selected Report
  */
  actualReport: any;
  reportSearch(element, i) {
    console.log(element, i)
    this.spinnerPercent = '';
    this.spinnerVal = "Opening Report..."
    element.userName = this.userName;
    this.actualReport = element.jmxReportId;
    this.SpinnerService.show();
    this.performanceservice.checkHtml(element)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log(result)
        if (result !== "PASS") {
          this.dialogService.openAlert('Please Execute the Script To See the Result')
        }
        else {
          document.getElementById('reportClose').click();
          // let url = "./uploads/performanceResults/" + this.userName + "/" + this.scriptName + "/index.html"
          let url = "./uploads/performanceResults/" + this.userName + "/" + element.jmxFileId + "/index.html"
          console.log(url)
          this.dockerPath09 = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          document.getElementById("popReport").click();
        }
      })
  }

  /* when close Reports Modal
  */
  closeReports() {
    //this.performanceReportdetails=[];
    this.dataSource = undefined;
    this.resultmsgActual = '';
    this.selectedDate = '';
  }

  /* when close any report the reopen the Reports modals
  */
  reopenReports() {
    if (this.selectedDate != '') {
      this.searchCall();
    } else {
      let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
      let obj = {
        "orgId": orgId,
        "projectId": this.projectId,
        "moduleId": this.jmxModuleId,
        "featureId": this.jmxFeatureId,
        "projectName": this.projectDetails,
        "jmxFileId": this.jmxFileId,
        "jmxFileName": this.scriptName,
        "moduleName": this.moduleName,
        "featureName": this.featureName,
        "date": 'false'
      }
      this.performanceservice.getjmxReportDetails(obj)
        .subscribe(result => {
          console.log(result)
          if (result.length == 0) {
            this.resultmsgActual = 'No Reports available';
          } else {
            this.resultmsgActual = '';
          }
          this.performanceReportdetails = result;
          this.dataSource = new MatTableDataSource(this.performanceReportdetails);
          this.ngAfterViewInit();
        })
    }
  }

  /* when remove Jmx file delete from DB and folder
  */
  removeJmxReport(element, i) {
    console.log(element, i)
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          element.userName = this.userName;
          this.performanceservice.removeJmxReport(element).subscribe((result) => {
            console.log(result);
            //this.performanceReportdetails.splice(i, 1);
            this.reopenReports();
          })
        }
      })

  }

  /* display a modal when click on add Listner
  */
  listenerEdit: any = false;
  addResultTree() {
    this.listenerEdit = false;
    return document.getElementById('listenerModal').click();
  }

  /* when save new Listener then adding the below details 
  */
  saveListener() {
    this.unSavedChangesExits = true;
    var listenerObj = _.cloneDeep(this.performanceObj.listenerObj)
    listenerObj['#item'].ResultCollector['-testname'] = this.listenerName
    listenerObj['#item'].ResultCollector.stringProp['#text'] = "jmeter/apache-jmeter-3.3/bin/" + this.jmxFileId + ".xml";
    this.viewResultTree = listenerObj;
    this.resultTreeBool = true;
  }

/* delete the Listner
  */
  deleteListener() {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.unSavedChangesExits = true;
          this.resultTreeBool = false;
          this.treeStatus = 'notcreated';
        }
      })
  }

  /* clearing the Lister data
  */
  clearListener() {
    this.treeStatus = 'notcreated';
  }

  /* when click on Listner the data will display
  */
  openResultTree() {
    if (this.openTree == true) {
      this.openTree = false;
    }
    else {
      this.openTree = true;
    }
  }

  /* display subsamples under main sample
  */
  displaySubSample(i) {
    this.testResult.httpSample[i].openSubSample = true;
  }

  /* close the main sample
  */
  closeSubSample(i) {
    this.testResult.httpSample[i].openSubSample = false;
  }

  /* display any assertion result are available
  */
  displayAssertions(i, j) {
    this.testResult.httpSample[i].httpSample[j].openAssertions = true;
  }

  /* close the display any assertion result are available
  */
  closeAssertions(i, j) {
    this.testResult.httpSample[i].httpSample[j].openAssertions = false;
  }

  /* display any main sample data available and opens a View Result modal
  */
  openSampleResult(i) {
    this.samplerResult = this.testResult.httpSample[i];

    //////Unix MilliSeconds to Time Stamp////////////
    var d = new Date(this.samplerResult.ts);
    this.samplerResult.date = d.toISOString().split("T")[0];
    this.samplerResult.date += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " IST"

    return document.getElementById('openSampleResult1').click();
  }

  /* display any sun sample data available and opens a View Result modal
  */
  openSubSampleResult(i, j) {
    this.samplerResult = this.testResult.httpSample[i].httpSample[j];

    //////Unix MilliSeconds to Time Stamp////////////
    var d = new Date(this.samplerResult.ts);
    this.samplerResult.date = d.toISOString().split("T")[0];
    this.samplerResult.date += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " IST"
    return document.getElementById('openSampleResult1').click();
  }

/* display any controller data available and opens a View Result modal
  */
  openControllerResult(j) {
    this.controllerResult = this.testResult.sample[j];

    var d = new Date(this.controllerResult.ts);
    this.controllerResult.date = d.toISOString().split("T")[0];
    this.controllerResult.date += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " IST"
    return document.getElementById('openSampleResult2').click();
  }

  /* save the Response Assertion at request, controller, Http Request levels
  */
  assertionName: any;
  matchingRules: any;
  responseAssertionObj: any;
  objValue: any;
  saveAssertion() {
    this.unSavedChangesExits = true;
    this.responseAssertionObj['#item'].ResponseAssertion.intProp['#text'] = this.patternValue;
    if (this.assertionLevel == "request") {
      this.transactionController[this.assertionDetails.j].timers[this.assertionDetails.i]['#item'].assertions[this.assertionDetails.p] = _.cloneDeep(this.responseAssertionObj)
    }
    else if (this.assertionLevel == 'controller') {
      this.transactionController[this.assertionDetails.j].controllerAssertions[this.assertionDetails.i] = _.cloneDeep(this.responseAssertionObj)
    }
    else {
      this.threadGroupAssertions[this.assertionDetails.p] = _.cloneDeep(this.responseAssertionObj)
    }
    console.log(this.features)
  }

   /* add Request parameters in Response Assertion modal,
  */
  resName: number = 0;
  addResParams() {
    this.unSavedChangesExits = true;
    if (this.responseAssertionObj['#item'].ResponseAssertion.collectionProp.hasOwnProperty("-self-closing")) {
      delete this.responseAssertionObj['#item'].ResponseAssertion.collectionProp["-self-closing"]
    }
    this.resName++;
    var resParams = {
      '-name': this.resName.toString(),
      '#text': ""
    }
    this.responseAssertionObj['#item'].ResponseAssertion.collectionProp.stringProp.push(resParams);
    console.log(this.responseAssertionObj)
    var element = document.getElementById('scrollDown1');
    element.scrollTop = element.scrollHeight;
  }

  /* removed the added Request parameters in Response Assertion modal,
  */
  deleteResParam(i) {
    this.unSavedChangesExits = true;
    this.responseAssertionObj['#item'].ResponseAssertion.collectionProp.stringProp.splice(i, 1);
    if (this.resName > 0) {
      this.resName--;
    }
    if (this.responseAssertionObj['#item'].ResponseAssertion.collectionProp.stringProp.length == 0) {
      this.responseAssertionObj['#item'].ResponseAssertion.collectionProp["-self-closing"] = true.toString();
    }
    console.log(this.responseAssertionObj)
  }

  /* Add Response Assertion at Main Http request level,
  */
  addAssertion() {
    this.assertionDetails.p = this.threadGroupAssertions.length;
    this.assertionLevel = "threadGroup"
    this.responseAssertionObj = _.cloneDeep(this.performanceObj.responseAssertion)
    this.patternValue = this.responseAssertionObj['#item'].ResponseAssertion.intProp['#text']
    return document.getElementById('openAssertion').click();
  }

  /* Add Response Assertion at selected transactionController level,
  */
  addControllerAssertion(j) {
    this.assertionDetails.i = this.transactionController[j].controllerAssertions.length;
    this.assertionDetails.j = j;
    this.assertionLevel = "controller";
    this.responseAssertionObj = _.cloneDeep(this.performanceObj.responseAssertion)
    this.patternValue = this.responseAssertionObj['#item'].ResponseAssertion.intProp['#text']
    return document.getElementById('openAssertion').click();
  }

  /* Add Response Assertion at selected Http sampler level,
  */
  addHTTPResponseAssertion(i, j) {
    console.log("test")
    this.assertionDetails.i = i;
    this.assertionDetails.j = j;
    this.assertionDetails.p = this.transactionController[j].timers[i]['#item'].assertions.length;
    this.assertionLevel = 'request';
    this.responseAssertionObj = _.cloneDeep(this.performanceObj.responseAssertion)
    console.log(this.responseAssertionObj)
    this.patternValue = this.responseAssertionObj['#item'].ResponseAssertion.intProp['#text']
    return document.getElementById('openAssertion').click();
  }

  /* Remove Response Assertion at Main Http request level,
  */
  deleteThreadGroupAssertion(k) {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.unSavedChangesExits=true;
          console.log(this.threadGroupAssertions[k])
          this.threadGroupAssertions.splice(k, 1);
        }
      })
  }

  /* Remove Response Assertion at any transactionController,
  */
  deleteControllerAssertion(i, j) {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.unSavedChangesExits=true;
          console.log(this.transactionController[j].controllerAssertions[i])
          this.transactionController[j].controllerAssertions.splice(i, 1);
        }
      })
  }

  /* Remove Response Assertion at any selected Http sampler level,
  */
  deleteHTTPResponseAssertion(i, j, p) {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.unSavedChangesExits=true;
          console.log(this.transactionController[j].timers[i]['#item'].assertions[p])
          this.transactionController[j].timers[i]['#item'].assertions.splice(p, 1);
        }
      })
  }

  /* Ignore status checkbox in ResponseAssertion,
  */
  updateCheckBox(event) {
    if (event.target.checked == true) {
      this.responseAssertionObj['#item'].ResponseAssertion.boolProp['#text'] = "true"
    }
    else {
      this.responseAssertionObj['#item'].ResponseAssertion.boolProp['#text'] = "false"
    }
  }

  /* when select radio's of Pattern Matching Rules in ResponseAssertion modal,
  */
  patternValue = '16';
  patternOr = 0;
  patternNot = 0;
  updatePatternValue(event) {
    this.patternValue = event.target.value;
    var val = Number(this.patternValue);
    val = val + this.patternNot + this.patternOr
    this.patternValue = val.toString();
    console.log(this.patternValue)
  }

  /* when select checkbox of Not of Pattern Matching Rules in ResponseAssertion modal,
  */
  updatePatternNot(event) {
    if (event.target.checked) {
      this.patternNot = 4;
      var val = Number(this.patternValue);
      val = val + this.patternNot
      this.patternValue = val.toString();
    }
    else {
      this.patternNot = 0;
      var val = Number(this.patternValue);
      val = val - 4
      this.patternValue = val.toString();
    }
  }

/* when select checkbox of Or of Pattern Matching Rules in ResponseAssertion modal,
  */
  updatePatternOr(event) {
    if (event.target.checked) {
      this.patternOr = 32;
      var val = Number(this.patternValue);
      val = val + this.patternOr
      this.patternValue = val.toString();
    }
    else {
      this.patternOr = 0;
      var val = Number(this.patternValue);
      val = val - 32
      this.patternValue = val.toString();
    }
  }

  assertionDetails = {
    'i': 0,
    'j': 0,
    'p': 0
  }

  /* click on any ResponseAssertion at Http sampler level, display ResponseAssertion modal ,
  */
  assertionLevel: any;
  displayHTTPResponseAssertion(i, j, p) {
    this.assertionDetails.i = i;
    this.assertionDetails.j = j;
    this.assertionDetails.p = p;
    this.assertionLevel = 'request';
    this.responseAssertionObj = _.cloneDeep(this.transactionController[j].timers[i]['#item'].assertions[p])
    this.patternValue = this.responseAssertionObj['#item'].ResponseAssertion.intProp['#text']
    this.patternNot = 0;
    this.patternOr = 0;
    return document.getElementById('openAssertion').click();
  }

  /* click on any ResponseAssertion at transactionController, display ResponseAssertion modal ,
  */
  displayControllerAssertion(i, j) {
    this.assertionDetails.i = i;
    this.assertionDetails.j = j;
    this.assertionLevel = "controller";
    this.responseAssertionObj = _.cloneDeep(this.transactionController[j].controllerAssertions[i])
    this.patternValue = this.responseAssertionObj['#item'].ResponseAssertion.intProp['#text']
    this.patternNot = 0;
    this.patternOr = 0;
    return document.getElementById('openAssertion').click();
  }

  /* click on any ResponseAssertion at Main Http Request, display ResponseAssertion modal ,
  */
  displayThreadGroupAssertion(k) {
    this.assertionDetails.p = k;
    this.assertionLevel = "threadGroup"
    this.responseAssertionObj = _.cloneDeep(this.threadGroupAssertions[k])
    this.patternValue = this.responseAssertionObj['#item'].ResponseAssertion.intProp['#text']
    this.patternNot = 0;
    this.patternOr = 0;
    return document.getElementById('openAssertion').click();
  }

  /* click on any ResponseAssertion at Main Http Request in Listner result, 
  */
  openThreadGroupAssertion(i, p) {
    this.assertionObj = this.testResult.httpSample[i].assertionResult[p]
    return document.getElementById('assertionModal').click();
  }

  /* click on any ResponseAssertion at sub-sample in Listner result, 
  */
  openSubSampleAssertion(i, j, k) {
    this.assertionObj = this.testResult.httpSample[i].httpSample[j].assertionResult[k]
    return document.getElementById('assertionModal').click();
  }

  regExDetails = {
    'i': 0,
    'j': 0,
    'p': 0
  }

  /* click on any regularExpression at any http sample, display regularExpression modal
  */
  openRegEx(i, j, p) {
    this.regExDetails.i = i;
    this.regExDetails.j = j;
    this.regExDetails.p = p;
    this.regExObj = _.cloneDeep(this.transactionController[j].timers[i]['#item'].regEx[p])
    return document.getElementById('openRegEx').click();
  }

  /* save the regularExpression modal, 
  */
  saveRegEx() {
    this.unSavedChangesExits=true;
    this.transactionController[this.regExDetails.j].timers[this.regExDetails.i]['#item'].regEx[this.regExDetails.p] = _.cloneDeep(this.regExObj)
  }

   /* save the regularExpression modal, 
  */
  addRegEx(i, j) {
    this.regExDetails.i = i;
    this.regExDetails.j = j;
    this.regExDetails.p = this.transactionController[j].timers[i]['#item'].regEx.length;
    this.regExObj = _.cloneDeep(this.performanceObj.regExObj)
    return document.getElementById('openRegEx').click();
  }

  /* delete the regularExpression modal, 
  */
  deleteRegEx(i, j, p) {
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.unSavedChangesExits=true;
          this.transactionController[j].timers[i]['#item'].regEx.splice(p, 1);
        }
      })
  }

   /* open the Http Request defaults
  */
  displayRequestDefaults = false;
  openRequestDefaults() {
    if (this.displayRequestDefaults == false) {
      this.displayRequestDefaults = true;
    }
    else {
      this.displayRequestDefaults = false;
    }
  }

   /* validate the threadGroup before saving the Jmx file, 
  */
  validateThreadGroup() {
    if (this.threadGroup.intProp[0]['#text'] <= 0) {
      this.dialogService.openAlert("Please Enter Valid Details in Thread Group")
    }
    else if (this.threadGroup.intProp[1]['#text'] < 0 || this.threadGroup.intProp[1]['#text'] == null) {
      this.dialogService.openAlert("Please Enter Valid Details in Thread Group")
    }
    else if (this.threadGroup.longProp[0]['#text'] == null) {
      this.dialogService.openAlert("Please Enter Valid Details in Thread Group")
    }
    else if (this.threadGroup.longProp[1]['#text'] == null) {
      this.dialogService.openAlert("Please Enter Valid Details in Thread Group")
    }
    else if (this.threadGroup.elementProp.boolProp['#text'] == 'false') {
      
      if (this.threadGroup.elementProp.stringProp['#text'] == 0 || this.threadGroup.elementProp.stringProp['#text'] == null) {
        this.dialogService.openAlert("Please Enter Valid Details in Thread Group")
      }
      else if (this.threadGroup.boolProp[0]['#text']) {
        if (this.threadGroup.longProp[0]['#text'] <= 0) {
          this.dialogService.openAlert("Please Enter Valid Details in Thread Group")
        }
        else {
          this.saveJMXFile();
        }
      }
      else {
        this.saveJMXFile();
      }
    }
    else if (this.threadGroup.boolProp[0]['#text']) {
      if (this.threadGroup.longProp[0]['#text'] <= 0) {
        this.dialogService.openAlert("Please Enter Valid Details in Thread Group")
      }
      else{
      this.saveJMXFile();
      }
    }
    else {
      this.saveJMXFile();
    }
  }

   /* alert the user to save or cancel the generated Listner result, 
   if save means stores in file and DB
  */
  saveResultTree(){
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let obj = {
      "orgId": orgId,
      "projectName": this.projectDetails,
      "jmxFileId": this.jmxFileId,
      "jmxFileName": this.scriptName,
      "moduleName": this.moduleName,
      "featureName": this.featureName,
      "projectId": this.projectId,
      "moduleId": this.jmxModuleId,
      "featureId": this.jmxFeatureId,
      "userName": this.userName
    }
    this.performanceservice.saveResultData(obj)
                .subscribe(result => {
                  console.log(result)
                  this.ExeTime = false;
                  clearInterval(this.logFile)
                  if (this.resultExe1 == 'Fail') {
                    this.dialogService.openAlert("Execution Stopped..")
                  } else {
                    this.dialogService.openAlert("Execution Completed. To View Exceution Report,Click On Open Report Button")
                  }
                })
  }
  
  /* alert the user to save or cancel the generated Listner result, 
   if cancel means stops the logs interval
  */
  cancelResultTree(){
                  this.ExeTime = false;
                  clearInterval(this.logFile)
                  if (this.resultExe1 == 'Fail') {
                    this.dialogService.openAlert("Execution Stopped..")
                  } else {
                    this.dialogService.openAlert("Execution Completed. To View Exceution Report,Click On Open Report Button")
                  }
  }

   /* click on Open ViewResultTree button, display ViewResultTree modal with saved Listner results
  */
  openViewResults(){
    document.getElementById("searchViewResults").click();
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let obj = {
      "orgId": orgId,
      "projectId": this.projectId,
      "moduleId": this.jmxModuleId,
      "featureId": this.jmxFeatureId,
      "projectName": this.projectDetails,
      "jmxFileId": this.jmxFileId,
      "jmxFileName": this.scriptName,
      "moduleName": this.moduleName,
      "featureName": this.featureName,
      "date": 'false'
    }
    this.performanceservice.getViewReultDetails(obj)
      .subscribe(result => {
        console.log(result)
        if (result.length == 0) {
          this.resultmsgActual = 'No Reports available';
        } else {
          this.resultmsgActual = '';
        }
        this.performanceTreedetails = result;
        this.treeDataSource =this.performanceTreedetails
      })
  }

   /* click on search button ViewResultTree modal, fetch all or datewise results
  */
  searchViewCall() {
    console.log(this.selectedDate1)
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let obj = {
      "orgId": orgId,
      "projectId": this.projectId,
      "moduleId": this.jmxModuleId,
      "featureId": this.jmxFeatureId,
      "projectName": this.projectDetails,
      "jmxFileId": this.jmxFileId,
      "jmxFileName": this.scriptName,
      "moduleName": this.moduleName,
      "featureName": this.featureName,
      "date": this.selectedDate1
    }
    if (this.selectedDate1 != '') {
      this.performanceservice.getViewReultDetails(obj)
        .subscribe(result => {
          console.log(result)
          if (result.length == 0) {
            this.resultmsgActual = 'No Reports available';
          } else {
            this.resultmsgActual = '';
          }
          this.performanceReportdetails = result;
          this.treeDataSource = this.performanceReportdetails;
          // this.treeDataSource = new MatTableDataSource(this.performanceReportdetails);
          // this.ngAfterViewInit();
        })
    }
    else {
      obj["date"]='false';
      this.performanceservice.getViewReultDetails(obj)
      .subscribe(result => {
        console.log(result)
        if (result.length == 0) {
          this.resultmsgActual = 'No Reports available';
        } else {
          this.resultmsgActual = '';
        }
        this.performanceReportdetails = result;
        this.treeDataSource = this.performanceReportdetails;
      })
    }

  }

  /* click on any ViewResultTree result, fetch the json data and will display while lodaing the page and delete any listner in table
  */
  readJsonFile(obj1){
    this.performanceservice.readJsonFile(obj1)
    .subscribe(result1 => {
      this.SpinnerService.hide();
      this.testResult = result1.testResults
      if (this.testResult.httpSample.length == undefined) {
        let val = this.testResult.httpSample
        this.testResult.httpSample = [];
        this.testResult.httpSample.push(val)
      }
      for (var i = 0; i < this.testResult.httpSample.length; i++) {
        if (this.testResult.httpSample[i].assertionResult !== undefined) {
          if (this.testResult.httpSample[i].assertionResult.length == undefined) { //creating assertionresult array in threadgroup level
            var obj = this.testResult.httpSample[i].assertionResult;
            this.testResult.httpSample[i].assertionResult = [];
            this.testResult.httpSample[i].assertionResult.push(obj)
            this.testResult.httpSample[i].openAssertions = false;
          }
        }
        if (this.testResult.httpSample[i].httpSample !== undefined) {
          this.testResult.httpSample[i].openSubSample = false;
          for (var j = 0; j < this.testResult.httpSample[i].httpSample.length; j++) {
            if (this.testResult.httpSample[i].httpSample[j].assertionResult !== undefined) {
              if (this.testResult.httpSample[i].httpSample[j].assertionResult.length == undefined) {
                var obj2 = this.testResult.httpSample[i].httpSample[j].assertionResult;
                this.testResult.httpSample[i].httpSample[j].assertionResult = [];
                this.testResult.httpSample[i].httpSample[j].assertionResult.push(obj2)
              }
              this.testResult.httpSample[i].httpSample[j].openAssertions = false;
            }
          }
        }

      }
      if (this.testResult.sample.length == undefined) {
        var temp = _.cloneDeep(this.testResult.sample);
        this.testResult.sample = [];
        this.testResult.sample.push(temp)
      }

    })
  }

  /* click on any ViewResultTree result, fetch the json data and will display
  */
  actualTree: any;
  resultSearch(element,i) {
     console.log(element, i)
     element.userName = this.userName;
     this.actualTree = element.jmxReportId;
     let obj1 = {
       jmxFileId: this.jmxFileId,
       featureId: this.jmxFeatureId,
       moduleId: this.jmxModuleId,
       projectId: this.projectId,
       jmxFileName: this.scriptName,
       projectName: this.projectDetails,
       moduleName: this.moduleName,
       featureName: this.featureName,
       reportId:element.jmxReportId,
       date:element.date,
       time:element.time
     }
     this.spinnerPercent = '';
    this.spinnerVal = "Please wait..."
     document.getElementById('viewResultClose').click();
     this.performanceservice.readTreeJsonFile(obj1)
       .subscribe(result1 => {
        this.SpinnerService.hide();
         if(result1!=='Fail'){
           this.testResult = result1.testResults
           if (this.testResult.httpSample.length == undefined) {
             let val = this.testResult.httpSample
             this.testResult.httpSample = [];
             this.testResult.httpSample.push(val)
           }
           for (var i = 0; i < this.testResult.httpSample.length; i++) {
             if (this.testResult.httpSample[i].assertionResult !== undefined) {
               if (this.testResult.httpSample[i].assertionResult.length == undefined) { //creating assertionresult array in threadgroup level
                 var obj = this.testResult.httpSample[i].assertionResult;
                 this.testResult.httpSample[i].assertionResult = [];
                 this.testResult.httpSample[i].assertionResult.push(obj)
                 this.testResult.httpSample[i].openAssertions = false;
               }
             }
             if (this.testResult.httpSample[i].httpSample !== undefined) {
               this.testResult.httpSample[i].openSubSample = false;
               for (var j = 0; j < this.testResult.httpSample[i].httpSample.length; j++) {
                 if (this.testResult.httpSample[i].httpSample[j].assertionResult !== undefined) {
                   if (this.testResult.httpSample[i].httpSample[j].assertionResult.length == undefined) {
                     var obj2 = this.testResult.httpSample[i].httpSample[j].assertionResult;
                     this.testResult.httpSample[i].httpSample[j].assertionResult = [];
                     this.testResult.httpSample[i].httpSample[j].assertionResult.push(obj2)
                   }
                   this.testResult.httpSample[i].httpSample[j].openAssertions = false;
                 }
               }
             }
   
           }
           if (this.testResult.sample.length == undefined) {
             var temp = _.cloneDeep(this.testResult.sample);
             this.testResult.sample = [];
             this.testResult.sample.push(temp)
           }
         }else{
           console.log(result1)
         }
       })
   }

   /* click on close ViewResultTree modal
  */
   closeViewResult() {
    //this.performanceReportdetails=[];
    this.treeDataSource = undefined;
    this.resultmsgActual = '';
    this.selectedDate1 = '';
  }

   /* click on trash icon of any ViewResultTree results in table
   remove the viewResultTree/ folder of scriptId.json file as ViewResultTree data and remove from DB
  */
  removeTreeReport(element, i) {
    console.log(element, i)
    this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
      .afterClosed().subscribe(res => {
        if (res) {
          let obj1 = {
            jmxFileId: this.jmxFileId,
            featureId: this.jmxFeatureId,
            moduleId: this.jmxModuleId,
            projectId: this.projectId,
            jmxFileName: this.scriptName,
            projectName: this.projectDetails,
            moduleName: this.moduleName,
            featureName: this.featureName,
            reportId:element.jmxReportId,
            date:element.date,
            time:element.time
          }
          this.performanceservice.removeTreeReport(obj1).subscribe((result) => {
            console.log(result);
            this.searchViewCall();
            console.log(this.actualTree,element.jmxReportId)
            if(this.actualTree == element.jmxReportId){
              this.readJsonFile(obj1)
              this.actualTree='';
            }
          })
        }
      })
  }

/* alert the user before closing the script if any changes are made 
  */
  unSavedChangesExists() {
    if (this.unSavedChangesExits) {
        if (!confirm(`There are unsaved changes! Are you sure?`)) {
            return true;
        }
        else {
            this.unSavedChangesExits = false;
            return false;
        }
    } else {
        return false;
    }
}

/* if any changes happen this will update
  */
changedSomething(){
  this.unSavedChangesExits = true;
}

/* click on removeJmx file, remove from Db and delete the ScriptId folder
  */
removeJmxFile(){
  let obj = {
    jmxFileId: this.jmxFileId,
    featureId: this.jmxFeatureId,
    moduleId: this.jmxModuleId,
    projectId: this.projectId,
    jmxFileName: this.scriptName,
    projectName: this.projectDetails,
    moduleName: this.moduleName,
    featureName: this.featureName
  }
  this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
  .afterClosed().subscribe(res => {
    if (res) {
      this.performanceservice.removeJmxFile(obj).subscribe((result) => {
        console.log(result);
        // this.ngOnInit();
        this.getModulesToDisplay();
        this.displayUploadPage = false;
        this.displayEditPage = false;
        this._snackBar.open("Deleted Successfully", "CANCEL", {
          duration: 3000,
        });
      })
    }
})
}

/* click on removeJmx module, remove from Db and delete the moduleId folder
  */
removeJmxModule(){
  let obj = {
    moduleId: this.jmxModuleId,
    projectId: this.projectId,
    projectName: this.projectDetails,
    moduleName: this.moduleName
  }
  this.dialogService.nlpDialog('Are You Sure...? You Want To Delete ?')
  .afterClosed().subscribe(res => {
    if (res) {
      this.performanceservice.removeJmxModule(obj).subscribe((result) => {
        console.log(result);
        // this.ngOnInit();
        this.getModulesToDisplay();
        this.displayUploadPage = false;
        this.displayEditPage = false;
        this._snackBar.open("Deleted Successfully", "CANCEL", {
          duration: 3000,
        });
      })
    }
})
}

}