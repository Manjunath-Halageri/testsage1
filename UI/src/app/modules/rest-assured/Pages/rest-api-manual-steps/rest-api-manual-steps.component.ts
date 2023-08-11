import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ApiComponentCoreServiceService } from '../../../../core/services/api-component-core-service.service';
import { ApiComponentCommunicationService } from '../../../../core/services/api-component-communication.service';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { ConnectToServerService } from '../../../../core/services/connect-to-server.service';
import * as _ from 'lodash';
import { DialogService } from '../../../../core/services/dialog.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ComponentCanDeactivate } from '../../../../../guard/pending-changes.guard';
import { HostListener } from '@angular/core';
import { Observable, Subscription, interval, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DecoratorService } from '../../../../core/services/decorator.service';

const RESPONSEVALIDATION = 'responseValidation';
const RESPONSEHEADERVAIDATION = 'responseHeaderValidation';
const RESPONSETIMEVAIDATION = 'responseTimeValidation';
import { browserRefresh } from '../../../../app.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { TestdataService } from '../../../../core/services/testdata.service';

// export let crumbitems=[];
@Component({
  selector: 'app-rest-api-manual-steps',
  templateUrl: './rest-api-manual-steps.component.html',
  styleUrls: ['./rest-api-manual-steps.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})

export class RestApiManualStepsComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  itISOnlyNLPUI: boolean;
  shouldRefresh = true;
  disableButton: boolean;
  hideDataList: boolean;
  excelFileNameCTC: any;
  projectDetails: any;
  ExcelAddPara = []
  projectFramework: any;
  projectId: any;
  frameId: any;
  displayNlpGrammarToUi: any;
  nlpObject = {
    "Groups": '',
    "ActionList": '',
    "Action": '',
    "ReturnsValue": '',
    "nlpData": '',
    "Object": '',
    "ClassObject": '',
    "Input2": '',
    "Input3": '',
    "Excel": '',
    "VersionID": ''
  }
  validationsList: any = [];
  assignToNlpObject: any;
  displayNlp: boolean;
  displayResponseValidation: boolean;
  displayResponseHeaderValid: boolean;
  displayResponseTimeValid: boolean;
  xx: any;
  dataFromTheService: any;

  @ViewChild('myDiv', { static: false }) myDiv: ElementRef;
  displayNlpArrayData = [];
  clickedModule: any;
  iamAddingExcel: any;
  clickedFeature: any;
  clickedScript: any;
  clickedScriptId: any;
  excelParamFormValidation: FormGroup;
  todate: string;
  toDisableViewReport: boolean;
  stepsResult: any;
  scriptLock: boolean;
  msg: string;
  showExcelParamDiv: boolean = false;
  runDisable: boolean;
  updateDisable: boolean;
  saveDisable: boolean;
  showSaveBtn: boolean;
  showUpdateBtn: boolean;
  nlpSelectedForEdit: any;
  addNlpDataInBetweenRow: any;
  disableAddBtn: boolean;
  addRowAboveOnly: boolean;
  addRowBelowOnly: boolean;
  iamEditingTheData: boolean;
  itsOnlyForUpdate: number;
  sameAsActionLIst: any;
  disableUpdateBtn: boolean;
  makeNlpEditCaseG: any;

  // OpenModal:boolean=false;
  displayClear: boolean = false;
  public browserRefresh: boolean;
  spinnerVal: any;
  crumbitems = [];
  clickedModuleId: any;
  clickedFeatureId: any;

  private subscription: Subscription

  unSavedChangesExits: boolean = false;
  compareNLPData = [];

  constructor(private data1: ApiComponentCommunicationService, private fb: FormBuilder,
    private apiCore: ApiComponentCoreServiceService,
    private connect: ConnectToServerService,
    private data: ProjectDetailServiceComponent,
    private dialogService: DialogService,
    private http: HttpClient, private api: apiServiceComponent, private router: Router,
    private ActiveRoute: ActivatedRoute, private SpinnerService: NgxSpinnerService,
    private decoratorService: DecoratorService,
    private testdataService: TestdataService,) {
    this.excelParamFormValidation = fb.group({
      'excelParaFile': ['', Validators.required],
      'excelParaRow': ['', Validators.required],
      'excelParaColumn': ['', Validators.required],
    })
    this.disableButton = false;//user roles future purpose.
    this.hideDataList = false;// To display Datalist 
  }

  /*logic Description: checking if page is refreshed or not
  if page if refreshing route to apitrestructure component 
  or else body will execute*/
  ngOnInit() {
    this.browserRefresh = browserRefresh;
    console.log('refreshed?:', browserRefresh);
    if (browserRefresh) {
      this.router.navigate(['/projectdetail/restAssured/apiTreeStructure']);
    } else {
      this.SpinnerService.show();
      console.log(this.router.url, this.ActiveRoute.snapshot.paramMap.get('id'))
      this.openNlpUI()

      console.log(this.scriptLock, 'script lock')
      this.toDisableViewReport = true;
      this.runDisable = false;
      this.updateDisable = false;
      this.saveDisable = false;
      this.iamAddingExcel = "notExcel";
      this.todate = new Date().toISOString();
      this.todate = new Date().toISOString().substr(0, 10);
      this.projectDetails = this.data.selectedProject();
      this.createDummyProject();
      this.http.get(this.api.apiData + '/getProjctFrameWork' + this.projectDetails)
        .map(response => { return response as any })
        .subscribe(result => {
          console.log(result.status)
          this.projectFramework = result;
          this.projectId = this.projectFramework[0].projectId;
          this.frameId = this.projectFramework[0].frameworkId;
          this.getRestApiNlpGrammer();
          this.excelCallCTC();

        });
      this.msg = '';
      this.spinnerVal = '';
    }
    this.iamEditingTheData = false;
    // this.OpenModal=false;
  }

  /*logic Description: when this page or component is closing */
  ngOnDestroy() {
    this.data1.setCrumbItems([]);
    this.SpinnerService.hide();
    let obj = {
      "projectName": this.projectDetails,
      "userName": sessionStorage.getItem('userName')
    }
    this.apiCore.deleteApiDummyProject(obj).subscribe((data) => {
      console.log('dummy project deleted', data)
    })
    let obj1 = {
      "userId": sessionStorage.getItem('userId'),
      "scriptId": this.clickedScriptId
    }
    this.apiCore.clearScript(obj1).subscribe((data) => {
      console.log("script cleared", data)
    })
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /*logic Description: not using */
  reCallFunction() {
    this.shouldRefresh = true;
    console.log(this.scriptLock, 'script lock')
    this.toDisableViewReport = true;
    this.runDisable = false;
    this.updateDisable = false;
    this.saveDisable = false;
    this.iamAddingExcel = "notExcel";
    this.todate = new Date().toISOString();
    this.todate = new Date().toISOString().substr(0, 10);
    this.projectDetails = this.data.selectedProject();
    this.http.get(this.api.apiData + '/getProjctFrameWork' + this.projectDetails)
      .map(response => { return response as any })
      .subscribe(result => {

        this.projectFramework = result;
        this.projectId = this.projectFramework[0].projectId;
        this.frameId = this.projectFramework[0].frameworkId;
        this.getRestApiNlpGrammer();
      });
  }

  /*logic Description: checking whether script is opening or not */
  openNlpUI() {
    this.subscription = this.data1.currentStateManual.subscribe(value => {
      console.log(value, "subscription", this.shouldRefresh)

      setTimeout(() => {

        // this.reCallFunction();
        if (this.shouldRefresh) {
          this.setLoadData(value);
        }
      }, 2000);

    })
  }

  /*logic Description: showing or hiding the spinner when script is opening */
  setRefreshView(refresh: boolean) {
    console.log("setRefreshView", refresh)
    // if(refresh){
    //   this.reCallFunction();
    // }
    this.shouldRefresh = refresh;
    if (this.shouldRefresh) {
      this.SpinnerService.show();
    } else {
      this.SpinnerService.hide();
    }
  }

  /*logic Description: fetching the script availability, steps present or not, 
  if steps are there adding the serial numbers 
   */
  setLoadData(value: any) {
    this.msg = '';
    this.toDisableViewReport = true;
    this.itISOnlyNLPUI = value['flag'];
    this.clickedModule = value['clickedModule'];
    this.clickedModuleId = value['clickedModuleId'];
    this.clickedFeature = value['clickedFeature'];
    this.clickedFeatureId = value['clickedFeatureId'];
    this.clickedScript = value['clickedScript'];
    this.clickedScriptId = value['clickedScriptId']
    console.log(this.itISOnlyNLPUI, '12ew', this.clickedModule, 'ferfe', this.clickedFeature, 'dcccdc', this.clickedScript, 'cdscsdc', this.clickedScriptId, 'cwedwd')
    // this.crumbitems[0] = this.clickedModule;
    // this.crumbitems[1] = this.clickedFeature;
    // this.crumbitems[2] = this.clickedScript;
    this.crumbitems[0] = `${this.clickedModule}(${this.clickedModuleId})`;
    this.crumbitems[1] = `${this.clickedFeature}(${this.clickedFeatureId})`;
    this.crumbitems[2] = `${this.clickedScript}(${this.clickedScriptId})`;
    this.data1.setCrumbItems(this.crumbitems);
    this.checkScriptAvailablity();
    // If we dont provide Below 'IF' condition ,If block code will be Executed everytime the
    //component is loaded which we dont require. So when we click Manual steps in tree structure,
    //then only 'If' condition evaluates to true.
    if (value['flag'] == true) {
      this.projectDetails = this.data.selectedProject();
      this.http.get(this.api.apiData + '/getProjctFrameWork' + this.projectDetails)
        .map(response => { return response as any })
        .subscribe(result => {
          this.projectFramework = result;
          this.projectId = this.projectFramework[0].projectId;
          this.frameId = this.projectFramework[0].frameworkId;
          let obj = {
            "projectId": this.projectId,
            "frameId": this.frameId,
            "scriptName": this.clickedScript,
            "scriptId": this.clickedScriptId
          }
          this.apiCore.checkIfScriptGenerated(obj).subscribe((data) => {
            this.SpinnerService.hide();
            if (data[0].compeleteArray.length !== 0) {
              this.displayNlpArrayData = data[0].compeleteArray[0].allObjectData.allActitons;
               sessionStorage.setItem("ALLData", JSON.stringify(data));
              this.setSlNo();
              this.runDisable = false;//Since Script is present. Enabling run button.
              this.showSaveBtn = false;//In order to show Update btn, we are not showing save btn
              this.showUpdateBtn = true;//To show Update btn.
              this.updateDisable = true;
              this.saveDisable = true;
            } else {
              sessionStorage.setItem("ALLData", null);
              this.displayNlpArrayData = [];//Clearing Array
              this.compareNLPData = [];
              this.runDisable = true;//Since No Script is present.Run button is of no use .
              this.showSaveBtn = true;//To show Save btn .
              this.showUpdateBtn = false;//Update btn not required.
              this.updateDisable = true;
              this.saveDisable = true;
            }
          })
        });
    }
    this.shouldRefresh = false;

  }

  /*logic Description: return this object when component is closing */
  getUnsavedChangesPayload() {
    return {
      "scriptId": this.clickedScriptId,
      "allActions": this.displayNlpArrayData
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeDeactivate(event: any) {

  }

  /*logic Description: if changes are not saved in script, alerting before script closing */
  openConfirmDialog() {
    let r = confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
    return r;
  }

  /*logic Description: it will call before component is changing */
  // canDeactivate(): boolean | Observable<boolean>| Promise<boolean> | boolean {
  //   let payload = {
  //     "scriptId": this.clickedScriptId,
  //     "allActions": this.displayNlpArrayData
  //   };
  //   console.log('this is component')
  //   return this.apiCore.checkUnsavedChanges(payload);
  // }

  unSavedChangesExistsReuse() {
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

  /*logic Description: check whether script has any steps or not
      */
  checkIfScriptHasActions(returnedScripts) {
    return !!(returnedScripts && returnedScripts[0] && returnedScripts[0].compeleteArray &&
      returnedScripts[0].compeleteArray[0].allObjectData &&
      returnedScripts[0].compeleteArray[0].allObjectData.allActitons);
  }

  /*logic Description: check whether difference in steps in database and stepts in UI 
    */
  checkUnsavedChanges() {
    // var subject = new Subject<boolean>();
    this.compareNLPData=JSON.parse(sessionStorage.getItem("ALLData"));
    if (this.compareNLPData) {
      console.log(this.checkIfScriptHasActions(this.compareNLPData))
      if (this.checkIfScriptHasActions(this.compareNLPData)) {
        // Check if Actions in DB is equal to Actions to compare
        var allActionsDb = this.compareNLPData[0].compeleteArray[0].allObjectData.allActitons;
        var changeFlag = false;
        console.log(this.displayNlpArrayData.length === allActionsDb.length)
        if (this.displayNlpArrayData.length === allActionsDb.length) {
          for (var i = 0; i < allActionsDb.length; i++) {
            var uiObj = this.displayNlpArrayData[i];
            if (allActionsDb[i].nlpData !== uiObj.nlpData) {
              changeFlag = true;
            }
          }
        } else {
          changeFlag = true
        }
        console.log(changeFlag)
        return (changeFlag);
      } else {
        // Check if new actions are added
        // return true if new actions are added from the UI
        if (this.displayNlpArrayData.length) {
          return (true);
        } else {
          return (false);
        }
      }

    } 
    if (this.displayNlpArrayData.length) {
      return (true);
    } else {
      return (false);
    }
    // else {
    //   return (false);
    // }
    // return subject.asObservable();
  }

  canDeactivate() {
    console.log(this.checkUnsavedChanges())
    if (!this.checkUnsavedChanges()) {
      return true;
    } else {
      return false;
    }

  }

  /*logic Description: creating the project in projectToRun folder */
  createDummyProject() {
    console.log("dummy project initiated")
    let obj = {
      "projectName": this.projectDetails,
      "userName": sessionStorage.getItem('userName')
    }
    this.apiCore.createApiDummyProject(obj).subscribe((data) => {
      console.log('dummy project created', data)
    })
  }

  /*logic Description: checking if script is free or using */
  checkScriptAvailablity() {
    let obj = {
      "scriptId": this.clickedScriptId,
      "userId": sessionStorage.getItem('userId')
    }
    console.log(obj, 'jafk')
    this.apiCore.checkApiScriptAvailablity(obj).subscribe((data) => {
      console.log('response from availablity', data)
      if (data === "free" || data === sessionStorage.getItem('userId')) {
        console.log("in if block script lock")
        this.scriptLock = false;
      }
      else {
        console.log("in else block script lock")
        this.scriptLock = true;
      }
    })
  }

  /*logic Description: adding serial numbers to prerequisite block */
  setSlNo() {
    this.globalSlNo = 1;
    for (let i = 0; i < this.displayNlpArrayData.length; i++) {
      if (this.displayNlpArrayData[i].Action === "given") {
        console.log("given", this.displayNlpArrayData)
        this.displayNlpArrayData[i].slNo = this.globalSlNo;
        ++this.globalSlNo;
      }
    }
    console.log("setSlNo", this.displayNlpArrayData)
  }

  /*logic Description: storing row indexes when click on step */
  highLightNlpEdit(nlpIndex) {
    this.nlpSelectedForEdit = this.apiCore.highLightNlpEditServiceCall(nlpIndex);
    this.addNlpDataInBetweenRow = this.nlpSelectedForEdit;
    if (this.addRowBelowOnly == true) {
      this.addNlpDataInBetweenRow = 1;
    }
    console.log("highLightNlpEdit", this.nlpSelectedForEdit, this.addNlpDataInBetweenRow)
  }

  /*logic Description: storing row indexes when click on step */
  index2: any;
  row(index) {
    this.index2 = index
  }

  /*logic Description: add an empty step if not firts row, else display alert to 
  select before or after first row when click on add row */
  nlpAdd() {
    if (this.nlpSelectedForEdit !== '' && this.nlpSelectedForEdit !== undefined) {
      this.disableAddBtn = true;
      this.displayClear = true;
      this.addNlpDataInBetweenRow = this.nlpSelectedForEdit + 1;
      this.apiCore.nlpAddServiceCall(this.nlpSelectedForEdit);
      if (this.nlpSelectedForEdit !== 0) {
        this.displayNlpArrayData.splice(this.nlpSelectedForEdit + 1, 0, {
        });
      }
      this.nlpSelectedForEdit = '';
    }
    else { return this.apiCore.userAlert() };
    console.log("nlpAdd", this.nlpSelectedForEdit, this.displayNlpArrayData, this.addNlpDataInBetweenRow)
  }

  /*logic Description: add a row above the first row */
  addrowAboveNlp() {
    this.addRowAboveOnly = true;
    this.addNlpDataInBetweenRow = 0;
    this.displayNlpArrayData.splice(0, 0, {});
  }

  /*logic Description: add a row below the first row */
  addrowBelowNlp() {
    this.addRowBelowOnly = true;
    this.addNlpDataInBetweenRow = 1;
    this.displayNlpArrayData.splice(1, 0, {});
  }

  /*logic Description: when select row is edit creating row details to an array  */
  excelName: any;
  excelRow: any;
  excelColumn: any;
  nlpEditTestCase() {
    this.excelCallCTC();
    this.displayResponseValidation = false;
    this.displayResponseHeaderValid = false;
    this.displayResponseTimeValid = false;
    if (this.nlpSelectedForEdit !== '' && this.nlpSelectedForEdit !== undefined) {
      if (!_.isEmpty(this.displayNlpArrayData[this.nlpSelectedForEdit])) {

        if (this.displayNlpArrayData[this.nlpSelectedForEdit].Action === RESPONSEVALIDATION) {
          this.validationsList = JSON.parse(this.displayNlpArrayData[this.nlpSelectedForEdit].Input2);
          this.displayResponseValidation = true;
          this.disableUpdateBtn = true;
          this.hideDataList = true;
          this.iamEditingTheData = true;
        }
        else if (this.displayNlpArrayData[this.nlpSelectedForEdit].Action === RESPONSEHEADERVAIDATION) {
          this.validationsList = JSON.parse(this.displayNlpArrayData[this.nlpSelectedForEdit].Input2);
          this.displayResponseHeaderValid = true;
          this.disableUpdateBtn = true;
          this.hideDataList = true;
          this.iamEditingTheData = true;
        }
        else if (this.displayNlpArrayData[this.nlpSelectedForEdit].Action === RESPONSETIMEVAIDATION) {
          this.validationsList = JSON.parse(this.displayNlpArrayData[this.nlpSelectedForEdit].Input2);
          this.displayResponseTimeValid = true;
          this.disableUpdateBtn = true;
          this.hideDataList = true;
          this.iamEditingTheData = true;
        }
        else {
          var yashwanthNlp = _.clone(this.displayNlpArrayData[this.nlpSelectedForEdit]);
          this.disableUpdateBtn = true;
          this.displayNlp = true;
          this.hideDataList = true;
          this.iamEditingTheData = true;
          this.makeNlpEditCaseG = yashwanthNlp;
          console.log(yashwanthNlp)
          // this.iamAddingExcel=yashwanthNlp.Excel;
          this.xx = this.apiCore.nlpKeyworDispaly(yashwanthNlp.nlpDataToCompare, yashwanthNlp.Groups, yashwanthNlp.Object, this.iamEditingTheData, yashwanthNlp.Input2, yashwanthNlp.Input3, '', '', '', yashwanthNlp);
          this.nlpObject.nlpData = yashwanthNlp.nlpData;
          this.nlpObject = yashwanthNlp;
          if (this.nlpObject.Excel == 'yesExcel') {
            this.displayExcel();
            this.excelName = this.nlpObject.Input2.split(',')[0]
            this.excelRow = this.nlpObject.Input2.split(',')[2].split('[')[1].split(']')[0]
            this.excelColumn = this.nlpObject.Input2.split(',')[3].split('[')[1].split(']')[0]
            this.excelParamFormValidation.get('excelParaFile').setValue(this.excelName);
            this.excelParamFormValidation.get('excelParaRow').setValue(this.excelRow);
            this.excelParamFormValidation.get('excelParaColumn').setValue(this.excelColumn);
            console.log(this.excelName)
          }
          if (yashwanthNlp.ActionList == "get" || yashwanthNlp.ActionList == "post" || yashwanthNlp.ActionList == "put" || yashwanthNlp.ActionList == "delete"
            || yashwanthNlp.ActionList == "statusCode" || yashwanthNlp.ActionList == "statusLine" || yashwanthNlp.ActionList == "contentType" || yashwanthNlp.ActionList == "body") {
            this.nlpObject.Object = undefined;
          } else {
            this.nlpObject.Object = '';
          }
          this.sameAsActionLIst = this.displayNlpArrayData[this.nlpSelectedForEdit].ActionList;
          this.itsOnlyForUpdate = this.nlpSelectedForEdit;
        }
      }
      else {
        this.hideDataList = false;
        this.disableAddBtn = true;
        this.displayClear = true;
      }
    }
    else { return this.apiCore.userAlert() };
  }

  /*logic Description: update the step when click on update of row */
  updateNlpTestCaseAfterEdit(inputFromUserAfter) {
    // this.OpenModal=false;
    this.updateDisable = false;
    this.saveDisable = false;
    console.log(this.displayResponseValidation, this.displayResponseHeaderValid, this.displayResponseTimeValid)
    if (!this.displayResponseValidation && !this.displayResponseHeaderValid && !this.displayResponseTimeValid) {
      var updateNlpGrammar = _.clone(this.displayNlpArrayData[this.nlpSelectedForEdit]);
      this.dataFromTheService = this.apiCore.nlpArraySeperate(inputFromUserAfter, updateNlpGrammar.nlpDataToCompare);
      updateNlpGrammar.nlpData = inputFromUserAfter.nativeElement.innerText;
      updateNlpGrammar.Input2 = this.dataFromTheService.nlpInput2;
      updateNlpGrammar.Input3 = this.dataFromTheService.nlpInput3;
      updateNlpGrammar.Excel = this.iamAddingExcel;
      return this.updateToArray(updateNlpGrammar)
    } else {
      this.parseResponseValidation(true);
    }
  }

  /*logic Description: setting properties false, reseting */
  updateToArray(updateNlpGrammar) {
    console.log(this.nlpSelectedForEdit, updateNlpGrammar)
    this.displayNlpArrayData.splice(this.nlpSelectedForEdit, 1, updateNlpGrammar)
    this.nlpObject.nlpData = '';
    this.iamEditingTheData = false;
    this.displayNlp = false;
    this.hideDataList = false;
    this.nlpSelectedForEdit = null;
    this.disableUpdateBtn = false;
    this.displayClear = false;
    console.log(this.displayNlpArrayData)
    this.excelParamFormValidation.reset();
    this.showExcelParamDiv = false;
    this.iamAddingExcel = 'notExcel';
  }

  /*logic Description: if any row is deleting */
  nlpDelet() {
    if (this.nlpSelectedForEdit !== '' && this.nlpSelectedForEdit !== undefined) {
      this.dialogService.nlpDialog('Do You Want To Delete This Entry ?')
        .afterClosed().subscribe(res => {
          if (res) {
            this.saveDisable = false;
            this.updateDisable = false;
            this.displayNlpArrayData.splice(this.nlpSelectedForEdit, 1);
            this.setSlNo();
            this.nlpSelectedForEdit = '';
          }
        })
    }
    else { return this.apiCore.userAlert() }
  }

  /*logic Description: sorting the nlp's */
  getRestApiNlpGrammer() {
    this.apiCore.getRestApiGrammer({ 'frameId': this.frameId }).subscribe((data) => {
      this.displayNlpGrammarToUi = data;
      this.displayNlpGrammarToUi.sort((a, b) => a.nlpGrammar.localeCompare(b.nlpGrammar))
      console.log(this.displayNlpGrammarToUi)
    })
  }

  /*logic Description: selecting any nlp */
  getDocOnNlp(selectedNlpFromUser, nlpObject) {
    this.displayNlpGrammarToUi.forEach(element => {
      if (element.nlpGrammar === selectedNlpFromUser) {
        this.assignToNlpObject = element;
        console.log(element.nlpGrammar, selectedNlpFromUser)
        if (this.assignToNlpObject.groupId == "group14" || this.assignToNlpObject.actionList == "statusCode"
          || this.assignToNlpObject.actionList == "statusLine" || this.assignToNlpObject.actionList == "contentType" || this.assignToNlpObject.actionList == "body") {
          this.nlpObject.Object = undefined;
        } else {
          this.nlpObject.Object = '';
        }
        this.nlpCallFunction(selectedNlpFromUser, this.assignToNlpObject, nlpObject);
      }
    });
  }

  /*logic Description: when selecting any nlp display appropriate modals */
  nlpCallFunction(iGetNlpData, groupInfo, nlpObject) {
    console.log(iGetNlpData, groupInfo, nlpObject)
    this.displayNlp = true;
    if (iGetNlpData == "Response Validation") {
      this.displayResponseValidation = true;
      this.displayResponseHeaderValid = false;
      this.displayResponseTimeValid = false;
    }
    else if (iGetNlpData == "Response HeaderValidation") {
      this.displayResponseValidation = false;
      this.displayResponseHeaderValid = true;
      this.displayResponseTimeValid = false;
    }
    else if (iGetNlpData == "Response TimeValidation") {
      this.displayResponseValidation = false;
      this.displayResponseHeaderValid = false;
      this.displayResponseTimeValid = true;
    }
    else {
      this.displayResponseValidation = false;
      this.displayResponseHeaderValid = false;
      this.displayResponseTimeValid = false;
    }
    this.hideDataList = true;
    let localNlp = this.apiCore.nlpKeyworDispaly(iGetNlpData, groupInfo.result.groupName, nlpObject, false, '', '', '', '', '', groupInfo);
    this.xx = localNlp;
    localNlp = '';
    // console.log(this.displayResponseValidation, this.displayResponseHeaderValid, this.displayResponseTimeValid)
  }

  /*logic Description: reset properties when on clear */
  nlpClear() {
    this.displayNlp = false;
    this.hideDataList = false;
    this.nlpObject.nlpData = undefined;
    this.displayResponseValidation = false;
    this.displayResponseHeaderValid = false;
    this.displayResponseTimeValid = false;
  }

  /*logic Description: fetching required step value when saving or updating the step */
  nlpArraySeperate(inputFromUser, nlpDataValueToClear, nlpObjectToClear) {
    // this.OpenModal=false;
    this.updateDisable = false;
    this.saveDisable = false;
    console.log("nlpArraySeperate", this.displayResponseValidation, this.displayResponseHeaderValid, this.displayResponseTimeValid)
    if (!this.displayResponseValidation && !this.displayResponseHeaderValid && !this.displayResponseTimeValid) {
      this.dataFromTheService = this.apiCore.nlpArraySeperate(inputFromUser, nlpDataValueToClear);
      this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear);
    } else {
      this.parseResponseValidation();
    }
  }

  /*logic Description: creating step when any validations are selected */
  parseResponseValidation(isEdit?) {
    console.log(isEdit, this.validationsList, this.nlpSelectedForEdit, this.displayResponseHeaderValid, this.displayResponseTimeValid, this.displayResponseValidation)
    let nlpData = '';
    if (this.displayResponseHeaderValid) {
      nlpData = 'Verify the Response Header ';
    }
    else if (this.displayResponseValidation) {
      nlpData = 'Verify the Response Body ';
    }
    else if (this.displayResponseTimeValid) {
      nlpData = 'Verify the Response Time ';
    }
    if (this.validationsList.length > 0) {
      nlpData += 'that ';
      for (let key = 0; key < this.validationsList.length; key++) {
        if (this.validationsList[key].type === 1) {
          nlpData += `${this.validationsList[key].jsonPath} `;
          if (this.validationsList[key].not) {
            nlpData += `${this.validationsList[key].negativeNlpData} `
          }
          else {
            nlpData += `${this.validationsList[key].positiveNlpData} `
          }
          nlpData += `${this.validationsList[key].values}`;
        }
        else if (this.validationsList[key].type === 2) {
          nlpData += `${this.validationsList[key].jsonPath} `;
          for (let i = 0; i < this.validationsList[key].values.length; i++) {
            console.log(this.validationsList[key].values[i].not)
            if (this.validationsList[key].values[i].not) {
              nlpData += `${this.validationsList[key].values[i].negativeNlpData} `;
            }
            else {
              nlpData += `${this.validationsList[key].values[i].positiveNlpData} `;
            }
            nlpData += `${this.validationsList[key].values[i].value} `
            if (i !== this.validationsList[key].values.length - 1) {
              if (this.validationsList[key].requestMethod == "allOf" || this.validationsList[key].requestMethod == "everyItem")
                nlpData += ' and '
              else if (this.validationsList[key].requestMethod == "anyOf")
                nlpData += ' or '
              else
                nlpData += ' , '
            }
          }
          console.log(nlpData)
        }
        else if (this.validationsList[key].type === 4) {
          nlpData += `${this.validationsList[key].jsonPath} `
          if (this.validationsList[key].not) {
            nlpData += `${this.validationsList[key].negativeNlpData} `
          }
          else {
            nlpData += `${this.validationsList[key].positiveNlpData} `
          }
          for (let i = 0; i < this.validationsList[key].values.length; i++) {
            nlpData += `${this.validationsList[key].values[i]}`
            if (i < this.validationsList[key].values.length - 1) {
              nlpData += `, `
            }
          }
        }
        else {
          nlpData += `${this.validationsList[key].jsonPath} `;
          if (this.validationsList[key].not) {
            nlpData += `${this.validationsList[key].negativeNlpData}`;
          }
          else {
            nlpData += `${this.validationsList[key].positiveNlpData}`
          }
        }
        if (key !== this.validationsList.length - 1) {
          nlpData += ' and '
        }
      }
    }
    var nlpActionListRowData = {};
    if (isEdit == "addRowInBetweenForNlp") {
      this.updateDisable = false;
      this.saveDisable = false;
      nlpActionListRowData["Groups"] = this.assignToNlpObject.result.groupName;
      nlpActionListRowData["ActionList"] = this.assignToNlpObject.actionList;
      nlpActionListRowData["Action"] = this.assignToNlpObject.actionList;
      nlpActionListRowData["nlpDataToCompare"] = '';
      nlpActionListRowData["nlpData"] = nlpData;
      nlpActionListRowData["Input2"] = JSON.stringify(this.validationsList);
      nlpActionListRowData["Input3"] = '';

      console.log("nlpActionListRowData", nlpActionListRowData)

      // nlpActionListRowData = this.displayNlpArrayData[this.addNlpDataInBetweenRow+1];
      // nlpActionListRowData["nlpData"] = nlpData;
      // nlpActionListRowData["Input2"] = JSON.stringify(this.validationsList);
      // this.displayNlpArrayData[this.addNlpDataInBetweenRow+1] = nlpActionListRowData;
      this.disableUpdateBtn = false;
      if (this.addNlpDataInBetweenRow === 0 && this.addRowAboveOnly === true) {
        this.displayNlpArrayData.splice(0, 1, nlpActionListRowData);
      }
      else if (this.addNlpDataInBetweenRow !== 0 && this.addRowBelowOnly === true) {
        this.displayNlpArrayData.splice(1, 1, nlpActionListRowData);
      }
      else {
        this.displayNlpArrayData.splice(this.addNlpDataInBetweenRow, 1, nlpActionListRowData)
      }
    } else {

      if (!isEdit) {
        console.log("isEdit IF")
        nlpActionListRowData["Groups"] = this.assignToNlpObject.result.groupName;
        nlpActionListRowData["ActionList"] = this.assignToNlpObject.actionList;
        nlpActionListRowData["Action"] = this.assignToNlpObject.actionList;
        nlpActionListRowData["nlpDataToCompare"] = '';
        nlpActionListRowData["nlpData"] = nlpData;
        nlpActionListRowData["Input2"] = JSON.stringify(this.validationsList);
        nlpActionListRowData["Input3"] = '';
        this.displayNlpArrayData.push(nlpActionListRowData);
      } else {
        console.log("isEdit else")
        nlpActionListRowData = this.displayNlpArrayData[this.nlpSelectedForEdit];
        nlpActionListRowData["nlpData"] = nlpData;
        nlpActionListRowData["Input2"] = JSON.stringify(this.validationsList);
        this.displayNlpArrayData[this.nlpSelectedForEdit] = nlpActionListRowData;
        this.disableUpdateBtn = false;
      }

    }
    console.log(nlpData, this.displayNlpArrayData)
    this.resetNlp();
  }

  /*logic Description: reset the values after adding or updating the step */
  resetNlp(nlpObjectToClear?: any, inputFromUser?: any) {
    console.log("resetNlp")
    // this.OpenModal=false;
    this.assignToNlpObject = [];
    this.disableAddBtn = false;
    this.disableUpdateBtn = false;
    this.disableButton = false;
    this.displayResponseValidation = false;
    this.displayResponseHeaderValid = false;
    this.displayResponseTimeValid = false;
    this.displayNlp = false;
    this.hideDataList = false;
    this.dataFromTheService = '';
    this.validationsList = [];
    this.nlpObject.nlpData = '';
    if (inputFromUser) {
      inputFromUser.nativeElement.innerText = '';
    }

    if (nlpObjectToClear) {
      nlpObjectToClear = '';
    }
    this.displayClear = false;
    this.excelParamFormValidation.reset();
    this.showExcelParamDiv = false;
    this.iamAddingExcel = 'notExcel';
  }

  /*logic Description: fetching the validations when add of validations from child compoment of response validation */
  setValidationListData(validations) {
    this.validationsList = validations;
    console.log(this.validationsList)
  }

  /*logic Description: adding the an object to array, adding step numbers and reset the values */
  globalSlNo: number = 0;
  async nlpAddToTable(inputFromUser, dataFromTheService, nlpObjectToClear, nlpDataValueToCompare) {

    var nlpActionListRowData = {};
    nlpActionListRowData["Groups"] = this.assignToNlpObject.result.groupName;
    nlpActionListRowData["ActionList"] = this.assignToNlpObject.actionList;
    nlpActionListRowData["Action"] = this.assignToNlpObject.actionList;
    nlpActionListRowData["nlpDataToCompare"] = nlpDataValueToCompare;
    nlpActionListRowData["nlpData"] = inputFromUser.nativeElement.innerText;
    nlpActionListRowData["Input2"] = dataFromTheService.nlpInput2;
    nlpActionListRowData["Input3"] = dataFromTheService.nlpInput3;
    nlpActionListRowData["Excel"] = this.iamAddingExcel;
    this.displayNlpArrayData.push(nlpActionListRowData);//This is for nlp 
    console.log("nlpAddToTable", this.displayNlpArrayData)
    this.setSlNo();
    this.resetNlp(nlpObjectToClear, inputFromUser);
  }

  /*logic Description: if we want to add excel data by adding file, row and column */
  displayExcel() {
    this.excelCallCTC();
    if (this.excelFileNameCTC === undefined) {
      this.dialogService.dockerDialog("Test Data Is Empty").afterClosed().subscribe(res => { })
    }
    else {
      this.iamAddingExcel = "yesExcel";
      this.showExcelParamDiv = true;
      this.ExcelAddPara = this.excelFileNameCTC;
      return
    }
  }

  /*logic Description: fetching the excel files in this project */
  excelCallCTC() {
    this.testdataService.getExcelForRestApi(this.projectDetails)
      .subscribe(result => {
        this.excelFileNameCTC = result;
      });
  }

  /*logic Description: for adding step with excel row, column and excel file name */
  addExcelParam(excelNlpObject) {
    console.log(excelNlpObject)
    let reslovedExcel = this.connect.excelAddParaToTable(this.nlpObject.nlpData, this.excelParamFormValidation)
    console.log(reslovedExcel)
    if (this.iamEditingTheData == true) {
      // alert("if")
      this.xx = this.apiCore.nlpKeyworDispaly(this.makeNlpEditCaseG.nlpDataToCompare, this.makeNlpEditCaseG.Groups, this.makeNlpEditCaseG.Object, this.iamEditingTheData, reslovedExcel, this.makeNlpEditCaseG.Input3, '', 'FromExcel', '', '',);
      console.log(this.xx)
      return this.xx;
    }
    else {
      console.log(this.nlpObject.nlpData)
      // if (this.nlpObject.nlpData === "Launch URL") {
      this.xx = this.apiCore.nlpKeyworDispaly(this.nlpObject.nlpData, this.assignToNlpObject.result.groupName, excelNlpObject, false, reslovedExcel, '', '', 'FromExcel', '', '');
      console.log(this.xx)
      return this.xx;
    }
  }

  /*logic Description: saving or updating the script in testcase and database */
  actionSave() {
    var result = this.displayNlpArrayData.filter(obj => _.isEmpty(obj))
    console.log(result)
    if (!_.isEmpty(result)) {
      this.dialogService.openAlert(`Empty entries is not allowed`).afterClosed().subscribe(res => { })
    } else {
      // this.dialogService.openAlert(`No Empty entry/step`).afterClosed().subscribe(res => { })

      let objectData = {};
      objectData["moduleName"] = this.clickedModule;
      objectData["ModuleId"] = this.clickedModuleId;
      objectData["featureName"] = this.clickedFeature;
      objectData["FeatureId"] = this.clickedFeatureId;
      objectData["scriptName"] = this.clickedScript;
      objectData["scriptId"] = this.clickedScriptId;
      objectData["projectName"] = this.projectDetails;
      objectData["projectId"] = this.projectId;
      objectData["frameId"] = this.frameId;
      objectData["userName"] = sessionStorage.getItem('userName');


      let sendPostObj = [];
      sendPostObj.push(objectData);

      let finalObj = {
        allVariablesForScript: null,
        allObjectData: {
          versionId: 1,
          allActitons: this.displayNlpArrayData
        },
        moduleName: this.clickedModule,
        featureName: this.clickedFeature,
        fileName: this.clickedScript,
        editDate: this.todate,
        projectName: this.projectDetails,
        framework: this.projectFramework[0].framework,
      }
      sendPostObj.push(finalObj);
      console.log(sendPostObj[1].allObjectData.allActitons);
      let obj = {
        "scriptName": this.clickedScript,
        "scriptId": this.clickedScriptId,
        "projectId": this.projectId,
        "steps": sendPostObj[1].allObjectData
      }
      this.apiCore.insertExcelFilesArray(obj).subscribe((data) => { console.log("filterArr", data) })

      this.apiCore.sendActionSaveData(sendPostObj).subscribe((data) => {
        this.runDisable = false;//To enable Run btn after saving.
        if (this.showSaveBtn) {
          this.saveDisable = true;
          this.decoratorService.saveSnackbar('Saved Successfully', '', 'save-snackbar')
        } else if (this.showUpdateBtn) {
          this.updateDisable = true;
          this.decoratorService.saveSnackbar('Updated Successfully', '', 'save-snackbar')
        }
      })
    }

  }

  /*logic Description: if want to add nlpstep to an empty row*/
  addRowInBetweenForNlp(inputFromUser, nlpDataValueToClear) {
    console.log(inputFromUser, "addRowInBetweenForNlp", this.displayResponseValidation, nlpDataValueToClear,
      this.addNlpDataInBetweenRow, this.addRowBelowOnly, this.displayResponseHeaderValid, this.displayResponseTimeValid)
    // if(inputFromUser=="undefined"||inputFromUser==undefined){
    if (nlpDataValueToClear == "") {
      this.dialogService.openAlert(`Please select a nlp`).afterClosed().subscribe(res => { })
    }
    else {
      if (!this.displayResponseValidation && !this.displayResponseHeaderValid && !this.displayResponseTimeValid) {

        this.disableAddBtn = false;
        var nlpAddDataOnIndexBased = _.clone(this.nlpObject);
        this.dataFromTheService = this.apiCore.nlpArraySeperate(inputFromUser, nlpDataValueToClear);
        nlpAddDataOnIndexBased["Groups"] = this.assignToNlpObject.result.groupName;
        nlpAddDataOnIndexBased["ActionList"] = this.assignToNlpObject.actionList;
        nlpAddDataOnIndexBased["Action"] = this.assignToNlpObject.actionList;

        nlpAddDataOnIndexBased["nlpDataToCompare"] = nlpDataValueToClear;
        nlpAddDataOnIndexBased["nlpData"] = inputFromUser.nativeElement.innerText;
        nlpAddDataOnIndexBased["Input2"] = this.dataFromTheService.nlpInput2;
        nlpAddDataOnIndexBased["Input3"] = this.dataFromTheService.nlpInput3;
        nlpAddDataOnIndexBased["Excel"] = this.iamAddingExcel;
        console.log(this.nlpObject, "if", this.dataFromTheService, this.addNlpDataInBetweenRow, nlpAddDataOnIndexBased)
        console.log("IFF", this.displayNlpArrayData[this.addNlpDataInBetweenRow])
        if (this.addNlpDataInBetweenRow === 0 && this.addRowAboveOnly === true) {
          this.displayNlpArrayData.splice(0, 1, nlpAddDataOnIndexBased);
        }
        else if (this.addNlpDataInBetweenRow !== 0 && this.addRowBelowOnly === true) {
          this.displayNlpArrayData.splice(1, 1, nlpAddDataOnIndexBased);
        }
        else {
          if (_.isEmpty(this.displayNlpArrayData[this.addNlpDataInBetweenRow])) {
            this.displayNlpArrayData.splice(this.addNlpDataInBetweenRow, 1, nlpAddDataOnIndexBased)
          } else {
            this.displayNlpArrayData.splice(this.addNlpDataInBetweenRow, 1, nlpAddDataOnIndexBased)
          }
        }
        this.setSlNo();
        this.displayNlp = false;
        this.hideDataList = false;
        this.nlpObject.nlpData = '';
        this.addNlpDataInBetweenRow = '';
        this.addRowAboveOnly = false;
        this.addRowBelowOnly = false;
        this.updateDisable = false;
        this.saveDisable = false;
        this.displayClear = false;
        this.excelParamFormValidation.reset();
        this.showExcelParamDiv = false;
        this.iamAddingExcel = 'notExcel';
      } else {
        this.parseResponseValidation("addRowInBetweenForNlp");
      }
    }

  }

  /*logic Description: when click on execute button
  1. check no step or empty row
  2. execute the script, check that having compilation errors or not
  3. fetching the result from report.json file and asign to variable.
   */
  typeofError;
  triggerExecution() {
    console.log(_.isEmpty(this.displayNlpArrayData))
    var result = this.displayNlpArrayData.filter(obj => _.isEmpty(obj))
    console.log(result)
    //  if(!_.isEmpty(result)){
    //   this.dialogService.openAlert(`Empty entries is not allowed`).afterClosed().subscribe(res => { })
    //  }
    if (_.isEmpty(this.displayNlpArrayData)) {
      this.dialogService.openAlert(`Please add a step`).afterClosed().subscribe(res => { })
    }
    else if (!_.isEmpty(result)) {
      this.dialogService.openAlert(`Empty entries is not allowed`).afterClosed().subscribe(res => { })
    }
    else {
      this.spinnerVal = 'Executing Testcase';
      this.SpinnerService.show();
      // this.dialogService.openAlert(`No Empty entry/step`).afterClosed().subscribe(res => { })
      this.runDisable = true
      this.updateDisable = true;
      this.saveDisable = true;
      this.toDisableViewReport = true;
      this.msg = ""
      // this.msg = "Executing Testcase......"
      let objectData = {};
      objectData["moduleName"] = this.clickedModule;
      objectData["ModuleId"] = this.clickedModuleId;
      objectData["featureName"] = this.clickedFeature;
      objectData["FeatureId"] = this.clickedFeatureId;
      objectData["scriptName"] = this.clickedScript;
      objectData["projectName"] = this.projectDetails;
      objectData["projectId"] = this.projectId;
      objectData["userName"] = sessionStorage.getItem('userName');
      objectData["scriptId"] = this.clickedScriptId;
      this.apiCore.apiRunCall(objectData).subscribe((data) => {

        let mvnExecutionResult = data
        // if (mvnExecutionResult == "Pass" || mvnExecutionResult == "Fail") {
        //   this.apiCore.checkTestngResult(objectData).subscribe((result) => {
        //     this.apiCore.deleteScriptAfterExceution(objectData).subscribe(() => { })
        //     this.spinnerVal='';
        //     this.SpinnerService.hide();
        //     this.stepsResult = result.data
        //     if (result.message == "Pass") {
        //       this.msg = "Execution completed"
        //       this.toDisableViewReport = false;
        //       this.runDisable = false;
        //     }
        //     if (result.message == "Fail") {
        //       this.msg = "Execution failed";
        //       this.toDisableViewReport = true;
        //       this.runDisable = false;
        //     }
        //   })
        // }
        this.apiCore.deleteScriptAfterExceution(objectData).subscribe(() => { })
        if (mvnExecutionResult == "Pass") {
          this.spinnerVal = 'Generating Report';
          this.apiCore.checkTestngResult(objectData).subscribe((result) => {
            this.typeofError = true;
            this.spinnerVal = '';
            this.SpinnerService.hide();
            this.stepsResult = result.data
            if (result.message == "Pass") {
              this.msg = "Execution completed"
              this.toDisableViewReport = false;
              this.runDisable = false;
            }
            if (result.message == "Fail") {
              this.msg = "Execution failed";
              this.toDisableViewReport = true;
              this.runDisable = false;
            }
          })
        } else if (mvnExecutionResult == "compilationError") {
          this.apiCore.compilationErrLogic(objectData).subscribe((data) => {
            this.stepsResult = data;
            this.typeofError = false;
            this.toDisableViewReport = false;// To enable view report button
            this.runDisable = false;
            this.spinnerVal = '';
            this.SpinnerService.hide();
            this.dialogService.openAlert('Script Failed due to Compilation Error. To View Execution Report,Click On View Report Button').afterClosed().subscribe(res => {
            })
          })
        }
      })
    }
  }

}