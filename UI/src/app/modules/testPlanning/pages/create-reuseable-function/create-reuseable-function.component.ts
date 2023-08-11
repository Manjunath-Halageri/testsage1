import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import * as XLSX from 'xlsx';
import mocker from 'mocker-data-generator';
import tableDragger from 'table-dragger';
import { TestComponent } from '../create-test-case/create';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { TestCaseCommonService } from '../../../../core/services/test-case-common.service';
import { ConnectToServerService } from '../../../../core/services/connect-to-server.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { roleService } from '../../../../core/services/roleService';
import * as _ from 'lodash';
import { OperationOnScriptService } from '../../../../core/services/operation-on-script.service';
import { TestdataService } from '../../../../core/services/testdata.service';
import { CtcValidationService } from '../../../../core/services/ctc-validation.service';
import { NlpUIFunctionalityService } from '../../../../core/services/nlp-uifunctionality.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-reuseable-function',
  templateUrl: './create-reuseable-function.component.html',
  styleUrls: ['./create-reuseable-function.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [OperationOnScriptService, ConnectToServerService, TestCaseCommonService, ProjectDetailServiceComponent, TestComponent, apiServiceComponent, FormsModule]

})
export class CreateReuseableFunctionComponent implements OnInit {
  reusable = {
    "reuseAbleClass": '',
    "reuseAbleMethod": '',
    "reuseAbleParameters": '',
    "returnType": '',
    "returnVariable": '',
    "checkBoxValue": false
  };
  [x: string]: any;
  showExcelData: any;
  mongoObjectId: any;
  excelFileNameCTC: any;
  projectDetails: string;
  projectFramework: any;
  reuseBtnToSave: boolean;
  excelOpalReuseable =
    {
      "excelFile": '',
      "excelSheet": '',
      "excelRow": '',
      "excelCell": '',
      "checkBoxValue": false
    };
  resultOfPageNameUI: any;
  resultOfObjectUI: any;
  allReuseData: Object = {};
  variableObjectDeclr = [];
  iamEditingTheData: boolean;
  disableUpdateBtn: boolean;
  enableTheReturn: boolean;
  reusableFuncationName: any;
  pomObject: any;
  todate: any;
  iamAddingExcel: String;
  addRowAboveOnly: boolean;
  iamEditingThePomObject: boolean;
  selectedRowForOpet: any = "Not Assigned";
  reuseFunctionEdit: any;
  excelFileNameReuse: any;
  variableForReturnFunction = [];
  activateMethodName: String;
  pageRoles: Object = {};
  pageName: any;
  newRole: any;
  newUserName: any;
  newUserId: any;
  disable: any;
  pedit: any;
  createNewProject09: boolean;
  previousMethodNameforupdate;
  multiDropDown: boolean;
  hideDataList;
  spreedSheetForm: FormGroup;
  completepath: any;
  myUsername: any;
  spreedSheetGenerate: FormGroup;
  excelParamFormValidation: FormGroup;
  todayTime: string;
  spreedSheetId: any;
  tableName: any;
  spreedSheetAuditComments: FormGroup;
  spreedAuthor: any;
  spreedCreatedDate: any;
  spreedCreatedTime: any;
  editedAuthor: any;
  spreedModifiedDate: any;
  spreedModifiedTime: any;
  spreedView: any;
  displayTestData: boolean;
  index: any;
  checked: any;
  emptyColumns: any;
  tempTableHeader: any;
  releaseHeaderDelete: any;
  releaseHeaderBtn: any;
  displayActionArrayData: any;
  editedFileName: any;
  typeDropdown: any;
  autoGenForm: any;
  unSavedChangesExits: boolean = false;
  reusableVar: any;
  disableGenerateAfterAdd: boolean;
  functionId: any;
  actionId: any;

  ///////////////////////////////// variable Declaration Section Ends///////////////////////////////////////////////


  constructor(
    private dialogService: DialogService,
    private servicekey: TestCaseCommonService,
    private fb: FormBuilder,
    private decoratorServiceKey: DecoratorService,
    private testdataService: TestdataService,
    private api: apiServiceComponent,
    private data: ProjectDetailServiceComponent,
    private roles: roleService,
    private scriptOperation: OperationOnScriptService,
    private connect: ConnectToServerService,
    private ctcvalid: CtcValidationService,
    private nlpUIFun: NlpUIFunctionalityService) {
    this.reuseBtnToSave = true;
    this.multiDropDown = false;
    this.hideDataList = false;
    this.allowToSave = false;
    this.allowToSaveVariable = false;
    this.displayNlp = false;
    this.enableDragger = false;
    this.displayTestData = false;
    this.reusableVar = [];
    this.disableGenerateAfterAdd = true;
    this.spreedSheetForm = fb.group({
      'importFile': ['', Validators.compose([
        Validators.required
      ])
      ]
    })

    this.spreedSheetGenerate = new FormGroup({
      tableName: new FormControl('', [Validators.required]),
      columnNames: new FormControl('', [Validators.required]),
    })

    this.excelParamFormValidation = fb.group({
      'excelParaFile': ['', Validators.required],
      'excelParaRow': ['', Validators.required],
      'excelParaColumn': ['', Validators.required],
    })

    this.spreedSheetAuditComments = fb.group({
      'spreedComment': ['', Validators.required]
    })

    this.autoGenForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      inputReq: new FormControl('', [Validators.required]),
    })

  }
  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
  @ViewChild('tableForm', { static: false }) tableForm;
  @ViewChild('genDataForm', { static: false }) genDataForm;


  ngOnInit() {

    this.disableUpdateBtn = false;
    this.iamEditingThePomObject = false;
    this.iamEditingTheData = false;//To indicate whether we are in edit mode or creating for first time.
    this.classObject = '';
    this.projectDetails = this.data.selectedProject();
    this.showExcelData = false;
    this.servicekey.getProjctFrameWork({ "projectName": this.projectDetails }).subscribe((result) => {
      this.projectFramework = result;
      this.getPageNameByDefault(this.projectFramework[0].projectId);
      this.getReusableFunctionNames();
      this.getNlpGrammer();
    })
    this.iamAddingExcel = "notExcel";
    this.createNewProject09 = false;
    this.disable = 0;
    this.pedit = 0;
    let UserName1 = sessionStorage.getItem('importedDetails');
    let parsedUserName1 = JSON.parse(UserName1)
    this.myUsername = parsedUserName1[0].userName
    this.pageName = "manageReusableFunction"
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')

    this.testdataService.getTestDataType().subscribe(data => {
      this.typeDropdown = data[0].testDataType;
    })

    this.pageRoles = {
      pageName: this.pageName,
      roleName: this.newRole,
      userId: this.newUserId,
      userName: this.newUserName

    }
     this.getRolesPermissions()
    this.excelCallCTC();
    var today = new Date();
    this.todate = new Date().toISOString();
    this.todate = new Date().toISOString().substr(0, 10);
    this.todayTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.unSavedChangesExistsReuse()) {
      return true;
    } else {
      return false;
    }
  }

  addrowAbove() {
    this.addRowAboveOnly = true;
    let addrowAboveReturendVal = this.scriptOperation.addrowAboveService()
    this.displayActionArrayData.splice(addrowAboveReturendVal, 0, {});
    return this.selectedRowForOpet = '';
  }//addrowAbove

  addrowBelow() {
    let addrowBelowReturnedVal = this.scriptOperation.addrowBelowService()
    this.displayActionArrayData.splice(addrowBelowReturnedVal, 0, {});
    return this.selectedRowForOpet = '';
  }

  getPageNameByDefault(reuseProjectPageName) {
    this.servicekey.getPageNameByDefaultServiceCall(reuseProjectPageName).subscribe(
      resultOfPageName => {
        this.resultOfPageNameUI = resultOfPageName;
        this.resultOfPageNameUI.sort((a, b) => a.pageName.localeCompare(b.pageName))
      }
    )
  }//getPageNameByDefault

  nlpPage;
  displayObjectNameOnPage(newPage) {

    this.nlpPage = newPage;//Making a copy of selected page .
    this.resultOfPageNameUI.forEach(pageObj => {
      if (pageObj.pageName === newPage) {
        this.resultOfObjectUI = pageObj.objectName;
      }
    });
  }//displayObjectNameOnPage

  getReusableFunctionList() {
    this.servicekey.getReusableFunctionListServiceCall(this.projectFramework[0].projectId).subscribe(
      res => {
        this.reusableFuncationName = res;
      })
  }
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
  // ----------------------------tree structure Starts -----------------------------------------------------(
  openToCreate: boolean;
  openReusableSection() {
    this.displayNlpArrayData = [];
    this.variableObjectDeclr = [];
    this.reusable.returnType = '';
    this.reusable.returnVariable = '';
    this.reusable.reuseAbleClass = '';
    this.reusable.reuseAbleMethod = '';
    this.reusable.reuseAbleParameters = '';
    this.reusable.checkBoxValue = false;
    this.reuseBtnToSave = true;
    this.openToCreate = true;
  }

  getReusableFunctionNames() {
    this.servicekey.getReusableFunctionNames(this.projectFramework[0].projectId).subscribe(
      res => {
        this.reusableFuncationName = res;
        this.displayModuleForTree = res;
        this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
        this.getReusableFunctionList()
      })

  }

  openWhenClic: boolean;
  selectedname: any;
  openMenuData(bb) {
    if (this.unSavedChangesExistsReuse()) {
      return;
    }
    this.servicekey.getReuseId(bb.label, this.projectFramework[0].projectId).subscribe((res) => {
      console.log(res)
      this.functionId = res[0].finalData._id
      this.actionId = res[0]._id
      console.log(this.functionId)
      console.log(this.actionId)
    })
    this.nlpSelectedForEdit = ''
    this.addingNlp = false;
    this.nlpClear();
    this.openToCreate = true;
    this.selectedname = bb.label;
    console.log(this.selectedname)
    this.selectedReusableMethod(this.selectedname)
    if (this.multiDropDown == true) {
      const ele1 = document.getElementById("checkMulti") as HTMLInputElement;
      ele1.checked = false;
      this.multiDropDown = false;
    }
  }

  displayModuleForTree = [];
  items: { label: string; command: (event: any) => void; }[];
  async nodeSelect(file) {
    this.displayTestData = false;
    if (file.node != undefined) {

      if (file.node.data == "ReusableFun") {
        for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
          if (file.node.label === this.displayModuleForTree[index]['label']) {
            break;
          }

        }
        if (this.newRole == 'Lead') {
          this.items = [
            { label: 'Delete', command: (event) => this.triggerDelete() }
  
          ];
        }
        else {
          this.items = [];
        }
      }

    }
  }

  checkForDuplicateFiles(fileName) {
    console.log(fileName)
    this.testdataService.checkForDuplicateExcelFile(fileName, this.projectDetails)
      .subscribe((res) => {
        return this.removeFileName(res)
      })
  }

  removeFileName(res) {
    if (res !== "Success") {
      alert(res)
      this.editedFileName = ''
    }
  }
  /*Logic Description: Function is used to check the duplicates function Name
  */
  checkForDuplicateMethod(reuseMethodName) {
    this.unSavedChangesExits = true;
    var result = this.ctcvalid.validateMethodName(reuseMethodName)
    if (result) {
      this.dialogService.openAlert("Invalid Method Name!!" + result + "\n" + "Example:" + "\n" + "run();" + "\n" + "getBackground();")
      this.reusable.reuseAbleMethod = ''
    }
    else if (this.reuseBtnToSave) {
      this.servicekey.checkForDuplicateMethodServiceCall(reuseMethodName, this.projectFramework[0].projectId).subscribe(
        result => {
          return this.removeClassName(result)
        }
      )
    }
    else {
      this.servicekey.checkForDuplicateMethod2ServiceCall(reuseMethodName, this.projectFramework[0].projectId, this.functionId).subscribe(
        result => {
          return this.removeClassName(result)
        }
      )
    }
  }

  removeClassName(res) {
    if (res !== "Succeess") {
      this.dialogService.openAlert(res)
      this.reusable.reuseAbleMethod = ''
    }
  }

  checkForValidParameters(reusableParameters) {
    this.unSavedChangesExits = true;
    if (reusableParameters.length !== 0) {
      var test2 = "url";
      var result = this.ctcvalid.validateParameters(reusableParameters)
      if (result) {
        this.dialogService.openAlert(result)
        this.reusable.reuseAbleParameters = ''
      }
    }
  }

  getParams(reusableParameters) {
    this.reusableVar = [];
    let parameters = reusableParameters.split(',')
    for (var i = 0; i < parameters.length; i++) {
      let parameter1 = parameters[i].trim();
      let variable = parameter1.split(' ')
      if (variable.length === 2) {
        this.reusableVar.push(variable[1])
      }
    }
  }


  selectedReusableMethod(selectedReusableMethod) {
    this.activateMethodName = selectedReusableMethod;
    this.previousMethodNameforupdate = selectedReusableMethod;
    this.reuseBtnToSave = false;
    return this.displayReuseMethodForEditing(selectedReusableMethod)
  }




  deleteSelectedReusableFun() {
    this.servicekey.deleteReusableFunction(this.projectFramework[0].projectId, this.projectFramework[0].projectSelection, this.activateMethodName)
      .subscribe((res) => {
        this.clearvalueAfterSave();
        // this.hideForNow = false;
        // this.disableForEdit = false;
        this.activateMethodName = '';
        this.reuseBtnToSave = true;
        this.getReusableFunctionNames()

      })

  }


  displayReuseMethodForEditing(methodNameToEdit) {
    var localArray = [];
    console.log(this.reusableFuncationName)
    this.reusableFuncationName.forEach(element => {
      if (element.reuseableData.reuseAbleMethod === methodNameToEdit) {
        this.mongoObjectId = element._id;
        this.variableObjectDeclr = element.reuseableScriptVariables;
        this.reusable = { ...element.reuseableData }//To make deep copy,we make use of ...(spread operator) 
        localArray = element.reuseableCompleteArray[0].allActitons;
        this.displayNlpArrayData = _.cloneDeep(localArray);
        if (this.displayNlpArrayData.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
        this.enableTheReturnType('', element.reuseableData.checkBoxValue)
        this.returnTypeOfFunction(element.reuseableData.returnType, '', '');
      }

    });

  }

  nlpComObject = {};
  getPomObjectOnObject(objectForPom) {
    if (this.iamEditingTheData === true) {
      this.iamEditingThePomObject = true;
    }
    this.resultOfObjectUI.forEach(forPom => {
      if (forPom.objectName === objectForPom) {
        this.pomObject = forPom.pomObject;
        this.nlpComObject = forPom;//nlpComObject contains complete info of selected object
        return this.nlpPomChangesCall(this.nlpComObject)
      }
    });
  }//getPomObjectOnObject

  //Logic: The below nlpPomChangesCall() is required in edit mode, where when user changes object on which user wants 
  // to perform action, it should reflect in nlp grammar selected for edit.
  nlpPomChangesCall(nlpPomObject) {
    var pomChanged = _.clone(this.displayNlpArrayData[this.nlpSelectedForEdit]);
    this.xx = this.connect.nlpKeyworDispaly(pomChanged.nlpDataToCompare, pomChanged.Groups, pomChanged.Object, this.iamEditingTheData, pomChanged.Input2, pomChanged.Input3, pomChanged.ReturnsValue, '', nlpPomObject.objectName, '')
    console.log(this.xx);
  }


  excelCallCTC() {
    this.testdataService.getExcel(this.projectDetails)
      .subscribe(result => {
        this.excelFileNameReuse = result;
      });
  }//excelCallCTC

  enableTheReturnType(e, check) {
    if (check === true) {
      this.enableTheReturn = true;
    }
    else {
      this.enableTheReturn = false;
      this.reusable.returnType = '';
      this.reusable.returnVariable = '';
    }

  }

  returnTypeOfFunction(typeOfSelection, varaibleList, reusable) {
    this.variableForReturnFunction = [];
    if (this.variableObjectDeclr.length === 0) {
      return;
    }
    else {
      this.variableObjectDeclr.forEach(element => {
        if (element.variableType === typeOfSelection) {
          this.variableForReturnFunction.push(element.variableAddFun);
        }
      });
    }

  }//returnTypeOfFunction

  allReuseSave() {

    this.displayActionArrayData = this.displayNlpArrayData;
    if (this.enableDragger) {
      this.enableDragger = false;
    }

    if (this.reusable.reuseAbleMethod.length !== 0) {

      if (this.displayNlpArrayData.length !== 0) {

        for (var i = 0; i < this.displayActionArrayData.length; i++) {//to check whether any of the test step is empty
          if (Object.keys(this.displayActionArrayData[i]).length === 0) {
            this.dialogService.openAlert("Test Step Cannot Be Empty")
            this.displayActionArrayData.splice(i, 1)
            if (this.displayNlpArrayData.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
            this.releaseHeaderBtn = false;
            this.releaseHeaderDelete = false;
            this.disableAddBtn = false;
            return;
          }
        }
        if (this.reuseBtnToSave === true) {
          this.servicekey.checkForDuplicateMethodServiceCall(this.reusable.reuseAbleMethod, this.projectFramework[0].projectId).subscribe((res) => {
            if (res == "Succeess") {
              this.blockScopeValidation();
            }
            else {
              this.dialogService.openAlert(res)
              this.reusable.reuseAbleMethod = ''
            }
          })
        }
        else {
          this.servicekey.checkForDuplicateMethod2ServiceCall(this.reusable.reuseAbleMethod, this.projectFramework[0].projectId, this.functionId).subscribe((res) => {
            if (res == "Succeess") {
              this.blockScopeValidation();
            }
            else {
              this.dialogService.openAlert(res)
              this.reusable.reuseAbleMethod = ''
            }
          })
        }

      }
      else {
        this.dialogService.openAlert("Atleast One Test Step is required")
      }

    }
    else {
      this.dialogService.openAlert("Please Enter Method Name")
    }

  }//allReuseSave


  blockScopeValidation() {
    var ifCount = 0;
    var forCount = 0;
    var ifIndex = 0;
    var forIndex = 0;
    var ifEndCount = 0;
    var forEndCount = 0;
    var allowForLoop: boolean = true;
    var allForIfCond: boolean = true;
    var fromIfBlock;
    var formForBlock;
    this.displayActionArrayData.forEach((e, i, a) => {
      ifCount = 0 === e.Action.indexOf('If-Start') ? ++ifCount : ifCount;
      ifEndCount = 0 === e.Action.indexOf('If-End') ? ++ifEndCount : ifEndCount;
      forCount = 0 === e.Action.indexOf('For-Start') ? ++forCount : forCount;
      forEndCount = 0 === e.Action.indexOf('For-End') ? ++forEndCount : forEndCount;
      if (e.Action.indexOf('If-Start') === 0) {
        fromIfBlock = this.ctcvalid.ifblock(this.displayActionArrayData)
        if (fromIfBlock !== true) {
          this.allowToSave = true;
          allForIfCond = false;
          return this.hideValidation(fromIfBlock);
        }

      }
      else if (e.Action.indexOf('For-Start') === 0) {
        formForBlock = this.ctcvalid.forLoop(this.displayActionArrayData);
        if (formForBlock !== true) {
          this.allowToSave = true;
          allowForLoop = false;
          return this.hideValidation(formForBlock);
        }
      }
    })

    if (allForIfCond && allowForLoop) {
      if (ifCount !== ifEndCount) {
        this.allowToSave = true;
        return this.hideValidation(`Sorry Block Error...!!! If Block is not Closed Properly`);
      }
      else if (forCount !== forEndCount) {
        this.allowToSave = true;
        return this.hideValidation(`Sorry Block Error...!!! For Block is not Closed Properly`);
      }
      else {
        this.dataPostCall()
      }
    }


  }

  dataPostCall() {

    var completeReuseableArray = [];
    this.reuseFunctionEdit = {
      versionId: "0",
      allActitons: this.displayNlpArrayData
    }
    this.getParams(this.reusable.reuseAbleParameters);
    this.allReuseData = {
      allVariablesForScript: this.variableObjectDeclr,
      allObjectData: this.reuseFunctionEdit,
      reusable: this.reusable,
      reusableParameterLength: this.reusable.reuseAbleParameters.split(',').length,
      typeOfFunction: "reusableFunction",
      mongoObjectId: this.mongoObjectId,
      projectName: this.projectFramework[0].projectSelection,
      projectid: this.projectFramework[0].projectId,
      framework: this.projectFramework[0].framework,
      fileName: `${this.reusable.reuseAbleMethod}Class`,
      exportConfig: this.projectFramework[0].exportConfigInfo,
      saveOrUpdate: this.reuseBtnToSave,
      previousMethodNameforupdate: this.previousMethodNameforupdate,
      reusableVar: this.reusableVar,
      actionId: this.actionId
    }
    completeReuseableArray.push(this.allReuseData)

    if (this.reuseBtnToSave) {//new Reuse function save part
      this.triggerSaveOrUpdate(completeReuseableArray)
    } else {
      //So before we update we are deleting previous reusable script and then updating the reuse function.In other
      //words, we delete and create new reuse function on Script part,and usaul update on database part.
      this.servicekey.deletePreviousReuseMethodScript(this.projectFramework[0].projectSelection, this.functionId)
        .subscribe(() => {
          this.triggerSaveOrUpdate(completeReuseableArray);
        })
    }
    this.unSavedChangesExits = false;

  }

  ScriptsUsingEditedReusableFunctionList = [];
  triggerSaveOrUpdate(completeReuseableArray) {
    console.log("Art and machine", completeReuseableArray);
    this.servicekey.createTestpostAllActionsServiceCall(completeReuseableArray).subscribe(
      resultOfcreateTestpostAllActionsServiceCall => {
        console.log(resultOfcreateTestpostAllActionsServiceCall)
        if (resultOfcreateTestpostAllActionsServiceCall["needToNotifyUser"]) {
          this.ScriptsUsingEditedReusableFunctionList = resultOfcreateTestpostAllActionsServiceCall["scriptList"];
          document.getElementById("notifyUser").click();
        }
        if (this.reuseBtnToSave) {
          this.decoratorServiceKey.saveSnackbar("Script Generated Successfully", '', 'save-snackbar')
        }
        else {
          this.decoratorServiceKey.saveSnackbar("Script Updated Successfully", '', 'save-snackbar')
        }
        this.servicekey.getReusableFunctionNames(this.projectFramework[0].projectId).subscribe(
          res => {
            this.displayModuleForTree = res;
            this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
            this.servicekey.getReusableFunctionListServiceCall(this.projectFramework[0].projectId).subscribe(
              res1 => {
                this.reusableFuncationName = res1;
                this.openMenuData1(this.reusable.reuseAbleMethod);
              })
          })
      })
  }

  openMenuData1(name) {
    this.servicekey.getReuseId(name, this.projectFramework[0].projectId).subscribe((res) => {
      this.functionId = res[0].finalData._id
      this.actionId = res[0]._id
    })
    this.nlpSelectedForEdit = ''
    this.addingNlp = false;
    this.nlpClear();
    this.openToCreate = true;
    this.selectedname = name;
    this.selectedReusableMethod(this.selectedname)
    if (this.multiDropDown == true) {
      const ele1 = document.getElementById("checkMulti") as HTMLInputElement;
      ele1.checked = false;
      this.multiDropDown = false;
    }
  }


  variableAddFun() {
    this.variableObjectDeclr.push({})
    console.log(this.variableObjectDeclr);
  }//variableAddFun

  clearvalueAfterSave() {
    this.displayNlpArrayData = [];
    this.variableObjectDeclr = [];
    this.reusable.returnType = '';
    this.reusable.returnVariable = '';
    this.reusable.reuseAbleClass = '';
    this.reusable.reuseAbleMethod = '';
    this.reusable.reuseAbleParameters = '';
    this.reusable.checkBoxValue = false;
    this.enableTheReturnType('', this.reusable.checkBoxValue);
  }

  permissions = [];
  edit: boolean
  read: boolean
  delete: boolean
  create: boolean;
  disableButton: boolean;


  getRolesPermissions() {
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

  ScriptsUsingReusableFunctionList = [];
  triggerDelete() {
    this.servicekey.checkIfReusefuncBeingUsedInScriptsBeforeDelete(this.projectFramework[0].projectId, this.activateMethodName)
      .subscribe((data) => {
        console.log(data);
        if (data["scrList"].length == 0) {
          this.dialogService.openConfirmDialog("Are you sure? Do you want to delete Reusable Function?")
            .afterClosed().subscribe(res => {
              if (res) {
                this.deleteSelectedReusableFun()
              }
            })
        } else {
          this.ScriptsUsingReusableFunctionList = data["scrList"]
          document.getElementById("notifyUserTheScriptsUsingRFuncBeforeDelete").click();
          this.getReusableFunctionNames()
        }

      })


  }


  //////////////////////////////////////Nlp Grammar code starts////////////////////////////////////////

  allowToSave: boolean;//It is used to display validation error messages UI depending on true or false.
  allowToSaveVariable: boolean;//It is used to display variable configuration validation error messages UI depending on true or false.
  validationMessage: any;
  assignToNlpObject;//This Variable contains user selected nlp grammar and its info.
  displayNlp;//This flag is used to display <p> tag containing certain part of nlp grammar editable and highlighted.
  showExcelParamDiv: boolean = false;//For displaying input from excel Ui.
  classObject: any;
  dataFromTheService;//
  syntaxOP: any;
  displayNlpArrayData = [];//Array to display steps in UI

  nlpObject = {
    "Groups": '',
    "ActionList": '',
    "Action": '',
    "ReturnsValue": '',
    "nlpData": '',
    "Page": '',
    "Object": '',
    "PomObject": '',
    "ClassObject": '',
    "Input2": '',
    "Input3": '',
    "Excel": '',
    "VersionID": ''
  }

  @ViewChild('myDiv', { static: false }) myDiv: ElementRef;

  displayNlpGrammarToUi;
  /*Logic Description: Fetches all the grammar Present in actionList collection */
  getNlpGrammer() {
    this.servicekey.getNlpGrammar(this.projectFramework[0].projectId)
      .subscribe((res) => {
        this.displayNlpGrammarToUi = res;
      })
  }

  /*Logic Description: lconsits of logic required to display the Selected Grammar With edit and color code  */
  getDocOnNlp(nlpForUser, nlpObject) {
    this.displayNlpGrammarToUi.forEach(element => {
      if (element.nlpGrammar === nlpForUser) {
        this.assignToNlpObject = element;
        if (element.object === 'yes') {
          if (nlpObject === undefined || nlpObject === '') {
            this.allowToSave = true;
            // this.validationMessage = `Please select the Page and Object`;
            this.hideValidation('Please select the Page and Object')
            this.nlpClear()
          }
          else { this.nlpCallFunction(nlpForUser, this.assignToNlpObject, nlpObject) }
        }
        else { this.nlpCallFunction(nlpForUser, this.assignToNlpObject, nlpObject); }

      }
    });
  }
  change() {
    this.nlpObject.nlpData = ''
  }

  hideValidation(validationMessage: String) {
    this.validationMessage = validationMessage;
    setTimeout(() => {
      this.allowToSave = false;
      this.allowToSaveVariable = false;
    }, 3000)
  }

  nlpClear() {
    this.displayNlp = false;
    this.hideDataList = false;
    this.nlpObject.Object = '';
    this.nlpObject.Page = '';
    this.excelParamFormValidation.reset();
    this.showExcelParamDiv = false;
    this.iamAddingExcel = 'notExcel';
    this.iamEditingTheData = false;
    this.nlpObject.nlpData = undefined;

    if (!this.addingNlp) {
      this.releaseHeaderBtn = false;
      this.disableAddBtn = false;
      if (this.displayNlpArrayData.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
    }
    this.disableUpdateBtn = false;
    this.releaseHeaderDelete = false;
    this.nlpSelectedForEdit = '';

  }

  itsForDisplayNlp;
  yashwanthSelect;
  xx;
  /*Logic Description: Used to display the selected Test grammar */
  nlpCallFunction(iGetNlpData, groupInfo, nlpObject) {
    this.displayNlp = true
    this.hideDataList = true;
    this.itsForDisplayNlp = iGetNlpData;
    console.log(groupInfo)
    console.log("qaz", this.iamEditingTheData)
    let localNlp = this.connect.nlpKeyworDispaly(iGetNlpData, groupInfo.result.groupName, nlpObject, this.iamEditingTheData, '', '', '', '', '', groupInfo);
    this.yashwanthSelect = this.connect.checkForOption()
    this.xx = localNlp;
    localNlp = '';
  }


  /*Logic Description: Captures the input,object value from the UI and frames the Input1,Input2,Input3 and 
      pass the call to addNlpData function to display the data to UI*/
  // inputFromUser:Contains p tag element complete info including nlp grammar edited info,edited by user.
  // nlpDataValueToClear:Contains original nlp grammar selected by user before editing it.
  // nlpObjectToClear: nlpObject Object declared initially for capturing info regarding each step.

  nlpArraySeperate(inputFromUser, nlpDataValueToClear, nlpObjectToClear) {
    if (this.assignToNlpObject.result.groupName === "User Function") {
      this.classObject = `${this.assignToNlpObject.actionList}Class`;
    }
    this.dataFromTheService = this.connect.nlpArraySeperate(inputFromUser, nlpDataValueToClear, this.assignToNlpObject, this.iamEditingTheData);
    if (this.assignToNlpObject.returnValue !== 'no' || this.assignToNlpObject.actionList === 'If-Start' || this.assignToNlpObject.actionList === 'ElseIf-Start') {
      this.returnValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear)
    }
    else if (this.assignToNlpObject.inputField2 !== 'no' && this.assignToNlpObject.groupId !== "group11") {
      this.returnInputValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear)
    }
    else if (this.assignToNlpObject.groupId == "group11") {
      let functionRes = this.ctcvalid.reusableFunctionValidation(this.dataFromTheService, this.assignToNlpObject)
      if (functionRes !== 'true') {
        this.allowToSave = true;
        return this.hideValidation(functionRes);
      }
      else if (this.assignToNlpObject.returnValue !== 'no') {
        this.returnValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear)
      }
      else return this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear)
    }
    else {
      return this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear)
    }

  }


  /*Logic Description: Validation Block which checks and comfirms the Variable is declared or not and throws the Error Message */

  returnValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear) {
    if (this.variableObjectDeclr.length !== 0) {
      this.variableObjectDeclr.forEach(e => {
        if (e.variableAddFun !== this.dataFromTheService.nlpReturnValue && e.variableAddFun !== this.dataFromTheService.nlpInput2) {
          this.allowToSave = true;
          return this.hideValidation('Please Declare Variable');
        }
        else if (e.variableType !== this.assignToNlpObject.datatype) {
          this.allowToSave = true;
          return this.hideValidation('Please Declare Variable Of Same DataType');
        }
        else {
          return this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear)
        }
      });
    }
    else {
      this.allowToSave = true;
      return this.hideValidation('Please Declare Variable');
    }
  }

  /*Logic Description: Validation Block which checks and confirms the Input  is present or not and throughs the Error Message */
  returnInputValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear) {
    if (this.assignToNlpObject.actionList == 'For-Start') {
      this.syntaxOP = this.ctcvalid.forLoopSyntax(this.dataFromTheService.nlpInput2);
      console.log(this.syntaxOP)
      if (this.syntaxOP.Status === true) {
        console.log(this.dataFromTheService.nlpReturnValue = this.syntaxOP.variable)
        return this.returnValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear)
      }
      else {
        this.allowToSave = true;
        return this.hideValidation(this.syntaxOP);
      }
    }
    else {
      return this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear)
    }
  }

  checkObjeLocallay: any;
  /*Logic Description: its a main  function which is used to add the data to dispaly table after crossing all the 
      validation block this code will executes  */
  async nlpAddToTable(inputFromUser, dataFromTheService, nlpObjectToClear, nlpDataValueToCompare) {
    this.checkObjeLocallay = await this.scriptOperation.crossCheckObj(this.assignToNlpObject.result.groupName, this.nlpPage, this.nlpComObject, this.assignToNlpObject)
    var nlpActionListRowData = {};
    nlpActionListRowData["Groups"] = this.assignToNlpObject.result.groupName;
    nlpActionListRowData["ActionList"] = this.assignToNlpObject.actionList;
    nlpActionListRowData["Action"] = this.assignToNlpObject.actionList;
    nlpActionListRowData["ReturnsValue"] = dataFromTheService.nlpReturnValue;
    nlpActionListRowData["Page"] = this.checkObjeLocallay.Page;
    nlpActionListRowData["Object"] = this.checkObjeLocallay.Object;
    nlpActionListRowData["PomObject"] = this.checkObjeLocallay.PomObject;
    nlpActionListRowData["ClassObject"] = this.classObject;
    nlpActionListRowData["nlpDataToCompare"] = nlpDataValueToCompare; //Contains Original Selected nlp grammar without user edit.
    nlpActionListRowData["nlpData"] = inputFromUser.nativeElement.innerText;//Contains Selected nlp grammar with user edit.
    nlpActionListRowData["Input2"] = dataFromTheService.nlpInput2;
    nlpActionListRowData["Input3"] = dataFromTheService.nlpInput3;
    nlpActionListRowData["Excel"] = this.iamAddingExcel;
    this.displayNlpArrayData.push(nlpActionListRowData);
    console.log(this.displayNlpArrayData)
    if (this.displayNlpArrayData.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
    this.assignToNlpObject = [];
    inputFromUser.nativeElement.innerText = '';
    this.displayNlp = false;
    this.hideDataList = false;
    this.pomObject = '';
    this.dataFromTheService = '';
    nlpObjectToClear = '';
    this.nlpObject.nlpData = '';
    this.nlpObject.Object = '';
    this.excelParamFormValidation.reset();
    this.showExcelParamDiv = false;
    this.iamAddingExcel = 'notExcel';
    this.classObject = '';
    this.allowToSave = false;
    this.unSavedChangesExits = true;
  }



  /*Logic Description: Used to check the duplicates variable, fucntion does not allow to declare the variable of same name */
  checkVariableDup(variableFromUi, variableIndex) {
    let keywordMatch = this.ctcvalid.javaKeyWords.includes(variableFromUi);
    if (keywordMatch) {
      this.allowToSaveVariable = true;
      this.hideValidation('Java Keywords are Not Allowed');
      return this.variableObjectDeclr[variableIndex].variableAddFun = '';
    }
    else {
      this.variableObjectDeclr.forEach((element, index, array) => {
        if (index === array.length - 1) {
          return false;
        }
        else {
          if (element.variableAddFun === variableFromUi) {
            this.allowToSaveVariable = true;
            this.hideValidation('Duplicate Variables are Not Allowed');
            return this.variableObjectDeclr[variableIndex].variableAddFun = '';
          }
        }
      })

    }

  }//checkVariableDup

  deleteVariable(indexOfVariable) {
    this.variableObjectDeclr.splice(indexOfVariable, 1)
  }//To delete Variable .


  // In savevariable() below, we are not saving variable as the function name suggest. we are just doing some
  // validation.Variable saving happens in allReuseSave() function.
  savevariable() {
    let res: object
    res = this.ctcvalid.varDeclareValid(this.variableObjectDeclr);
    if (res['state']) {
      document.getElementById('dismissBTN').click();
      this.unSavedChangesExits = true;
    } else {
      if (res['dValue'].length != 0) {
        res['dValue'].forEach((ele) => {
          this.variableObjectDeclr[ele].variableDefaultValue = '';
        })
      } else if (res['vName'].length != 0) {
        res['vName'].forEach((ele) => {
          this.variableObjectDeclr[ele].variableAddFun = '';
        })
      } else { }
    }

  }//savevariable

  index2: any; // contains selected nlp step index .
  row(index) {
    this.index2 = index
  }

  nlpSelectedForEdit;//Contains Selected nlp step index.
  highLightNlpEdit(nlpIndex) {
    this.nlpSelectedForEdit = this.nlpUIFun.highLightNlpEditServiceCall(nlpIndex);
  }

  disableAddBtn: boolean;//To display Add button in place of Create button.
  addNlpDataInBetweenRow;// Copy of selected nlp step index.

  addingNlp = false;
  nlpAdd() {
    if (this.nlpSelectedForEdit !== '' && this.nlpSelectedForEdit !== undefined) {
      this.disableAddBtn = true;

      this.addingNlp = true;
      this.releaseHeaderBtn = true;
      this.enableDragger = false;
      this.addNlpDataInBetweenRow = this.nlpSelectedForEdit;
      this.nlpUIFun.nlpAddServiceCall(this.nlpSelectedForEdit);
      if (this.nlpSelectedForEdit !== 0) {
        this.displayNlpArrayData.splice(this.nlpSelectedForEdit + 1, 0, {
        });
      }
      this.nlpSelectedForEdit = '';
    }
    else { return this.nlpUIFun.userAlert() };

  }

  addrowAboveNlp() {
    this.addRowAboveOnly = true;
    this.displayNlpArrayData.splice(0, 0, {});
  }

  addrowBelowNlp() {
    this.displayNlpArrayData.splice(1, 0, {});

  }

  /*Logic Description: used to add the data in between the test sage grammar
      */
  addRowInBetweenForNlp(inputFromUser, nlpDataValueToClear, addNlpObjectData) {
    this.disableAddBtn = false;
    var nlpAddDataOnIndexBased = _.clone(this.nlpObject);
    this.dataFromTheService = this.connect.nlpArraySeperate(inputFromUser, nlpDataValueToClear, '', this.iamEditingTheData);
    nlpAddDataOnIndexBased["Groups"] = this.assignToNlpObject.result.groupName;
    nlpAddDataOnIndexBased["ActionList"] = this.assignToNlpObject.actionList;
    nlpAddDataOnIndexBased["ReturnsValue"] = this.dataFromTheService.nlpReturnValue;
    nlpAddDataOnIndexBased["Page"] = this.nlpPage;
    nlpAddDataOnIndexBased["Object"] = this.nlpComObject["objectName"];
    nlpAddDataOnIndexBased["PomObject"] = this.nlpComObject["pomObject"];
    nlpAddDataOnIndexBased["ClassObject"] = this.classObject;
    nlpAddDataOnIndexBased["nlpDataToCompare"] = nlpDataValueToClear;
    nlpAddDataOnIndexBased["nlpData"] = inputFromUser.nativeElement.innerText;
    nlpAddDataOnIndexBased["Input2"] = this.dataFromTheService.nlpInput2;
    nlpAddDataOnIndexBased["Input3"] = this.dataFromTheService.nlpInput3;
    nlpAddDataOnIndexBased["Excel"] = this.iamAddingExcel;


    if (this.addNlpDataInBetweenRow === 0 && this.addRowAboveOnly === true) {
      this.displayNlpArrayData.splice(0, 1, nlpAddDataOnIndexBased)
    }
    else {
      this.displayNlpArrayData.splice(this.addNlpDataInBetweenRow + 1, 1, nlpAddDataOnIndexBased)
    }

    this.displayNlp = false;
    this.hideDataList = false;
    this.nlpObject.nlpData = '';
    this.nlpObject.Object = '';
    this.nlpObject.Page = '';
    this.addNlpDataInBetweenRow = '';
    this.addRowAboveOnly = false;
    this.releaseHeaderBtn = false;
    this.unSavedChangesExits = true;
    if (this.displayNlpArrayData.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
  }

  nlpDelet() {
    if (this.nlpSelectedForEdit !== '' && this.nlpSelectedForEdit !== undefined) {
      this.dialogService.nlpDialog('Are You Sure...? You Want To Delete This Entry ?')
        .afterClosed().subscribe(res => {
          if (res) {
            this.displayNlpArrayData.splice(this.nlpSelectedForEdit, 1);
            this.nlpSelectedForEdit = '';
            this.displayActionArrayData = this.displayNlpArrayData;
            this.releaseHeaderBtn = false;
            this.disableAddBtn = false;
            this.addingNlp = false;
            this.unSavedChangesExits = true;
            if (this.displayNlpArrayData.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
          }
          else {
            this.nlpSelectedForEdit = '';
          }
        })
    }
    else { return this.nlpUIFun.userAlert() }
  }


  enableDragger: boolean;
  // This function is used for drag and drop of data in the table
  dragTable(data) {
    // if length of the table is gratherthen 1 it enable to do drag and drop
    if (data.length >= 2) {
      this.enableDragger = true;
      var el = document.getElementById('dragTable');
      var dragger = tableDragger(el, {
        mode: 'row',
        onlyBody: true,
        animation: 300
      });
      dragger.on('drop', (from, to) => {
        let cutOut = data.splice(from, 1)[0]; // cut the element at index 'from'
        data.splice(to, 0, cutOut);
        if (from != to) {
          this.unSavedChangesExits = true;
        }
      });
    }
    else {
      this.enableDragger = false;
      return;
    }

  }

  makeNlpEditCaseG: any;
  /*Logic Description: Used to edit the Test sage grammar */
  nlpEditTestCase() {
    if (this.nlpSelectedForEdit !== '' && this.nlpSelectedForEdit !== undefined) {

      this.releaseHeaderBtn = true;
      this.releaseHeaderDelete = true;
      this.enableDragger = false;
      this.addingNlp = false;
      var yashwanthNlp = _.clone(this.displayNlpArrayData[this.nlpSelectedForEdit]);
      this.disableUpdateBtn = true;
      this.displayNlp = true;
      this.hideDataList = true;
      this.iamEditingTheData = true;
      this.makeNlpEditCaseG = yashwanthNlp;
      this.xx = this.connect.nlpKeyworDispaly(yashwanthNlp.nlpDataToCompare, yashwanthNlp.Groups, yashwanthNlp.Object, this.iamEditingTheData, yashwanthNlp.Input2, yashwanthNlp.Input3, yashwanthNlp.ReturnsValue, '', yashwanthNlp.Object, yashwanthNlp);
      this.nlpObject.nlpData = yashwanthNlp.nlpData;
      this.nlpObject = yashwanthNlp;
      this.displayObjectNameOnPage(yashwanthNlp.Page)
    }
    else { return this.nlpUIFun.userAlert() };
  }

  /*Logic Description:Used to Update the test grammar after edition is completed */
  updateNlpTestCaseAfterEdit(inputFromUserAfter) {

    var updateNlpGrammar = _.clone(this.displayNlpArrayData[this.nlpSelectedForEdit]);
    this.dataFromTheService = this.connect.nlpArraySeperate(inputFromUserAfter, updateNlpGrammar.nlpDataToCompare, updateNlpGrammar, this.iamEditingTheData);
    if (this.iamEditingThePomObject === true) {
      updateNlpGrammar.Page = this.nlpPage
      updateNlpGrammar.Object = this.nlpComObject["objectName"]
      updateNlpGrammar.PomObject = this.nlpComObject["pomObject"]
    }
    if (this.displayNlpArrayData[this.nlpSelectedForEdit].MultiStep === true) {
      updateNlpGrammar.Excel = this.iamAddingExcel;
    }
    updateNlpGrammar.Excel = this.iamAddingExcel;
    updateNlpGrammar.nlpData = inputFromUserAfter.nativeElement.innerText;
    updateNlpGrammar.ReturnsValue = this.dataFromTheService.nlpReturnValue;
    updateNlpGrammar.Input2 = this.dataFromTheService.nlpInput2;
    updateNlpGrammar.Input3 = this.dataFromTheService.nlpInput3;
    if (updateNlpGrammar.ReturnsValue !== undefined || updateNlpGrammar.Action === `If-Start` || updateNlpGrammar.Action === `ElseIf-Start`) {
      let validaStatus = this.ctcvalid.editReturnValidation(updateNlpGrammar, this.variableObjectDeclr)
      if (validaStatus !== true) {
        this.allowToSave = true;
        return this.hideValidation(validaStatus);
      }
      else { return this.updateToArray(updateNlpGrammar) }
    }//if -end
    else if (updateNlpGrammar.Input2 !== undefined && updateNlpGrammar.Action !== 'For-Start') {
      return this.updateToArray(updateNlpGrammar)
    }//elseif-end
    else if (updateNlpGrammar.Action === 'For-Start') {
      this.syntaxOP = this.ctcvalid.forLoopSyntax(updateNlpGrammar.Input2);
      if (this.syntaxOP.Status === true) {
        updateNlpGrammar.ReturnsValue = this.syntaxOP.variable
        let fromVar = this.ctcvalid.editReturnValidation(updateNlpGrammar, this.variableObjectDeclr)
        if (fromVar !== true) {
          this.allowToSave = true;
          return this.hideValidation(fromVar);
        }
        else { return this.updateToArray(updateNlpGrammar) }
      }
      else {
        this.allowToSave = true;
        return this.hideValidation(this.syntaxOP);
      }
    }//elseif-end
    else {
      return this.updateToArray(updateNlpGrammar)
    }//else
  }//updateNlpTestCaseAfterEdit

  updateToArray(updateNlpGrammar) {
    this.displayNlpArrayData.splice(this.nlpSelectedForEdit, 1, updateNlpGrammar)
    this.nlpObject.nlpData = '';
    this.nlpObject.Object = '';
    this.iamEditingTheData = false;
    this.displayNlp = false;
    this.hideDataList = false;
    this.excelParamFormValidation.reset();
    this.showExcelParamDiv = false;
    this.iamAddingExcel = 'notExcel';
    this.nlpSelectedForEdit = null;
    this.releaseHeaderBtn = false;
    this.releaseHeaderDelete = false;
    this.disableUpdateBtn = false;
    this.unSavedChangesExits = true;
    if (this.displayNlpArrayData.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
  }

  //////////////////////////////////////Nlp Grammar code Ends////////////////////////////////////////

  /* Excel Code starts*/

  enableTestData() {
    document.getElementById('testData').style.color = 'red';

  }

  importSpreedSheet() {
    return document.getElementById("importSpreedSheet").click();
  }

  validateExcel(fileInput: any) {
    this.excelFilesToUpload = <Array<File>>fileInput.target.files;
  }

  uploadImporetdFile(filePath) {
    var name1 = filePath.split('\\')[2]
    var name = name1.split('.')[0]
    this.testdataService.checkForDuplicateExcelFile(name, this.projectDetails)
      .subscribe((res) => {
        return this.removeFile(res)
      })
  }

  removeFile(res) {
    if (res === "Success") {
      return this.upload();
    }
    else {
      this.dialogService.openAlert(res)
    }
  }

  upload() {
    this.testdataService.uploadExcelFile(this.excelFilesToUpload, this.projectDetails)
      .subscribe((result) => {
        if (result != 0) {
          this.completepath = result[0].path;
          this.myInputVariable.nativeElement.value = '';
          this.testdataService.saveImportedFileInfo(result[0], this.myUsername).
            subscribe(res => {
              // alert(res)
              // this.dialogService.dockerDialog(res).afterClosed().subscribe(res => { })
              this.excelCallCTC();
              return this.spreedSheetForm.reset();
            })
        }
      }, (error) => {
        alert("Error Occurred" + error)
      });

  }

  excelFilesToUpload;

  uploadExcelFile(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append(this.projectDetails, files[i], files[i].name);
      }
      console.log(formData)
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  editedColumnNames: any;
  generateSpreedSheet() {
    this.editedColumnNames = '';
    return document.getElementById("generateSpreedSheet").click();
  }

  ExcelAddPara = []

  displayExcel() {
    if (this.excelFileNameReuse === undefined) {
      this.dialogService.dockerDialog("Test Data Is Empty").afterClosed().subscribe(res => { })
    }
    else {
      this.iamAddingExcel = "yesExcel";
      this.showExcelParamDiv = true;
      this.ExcelAddPara = this.excelFileNameReuse;
      return
    }
  }

  addExcelParam(excelNlpObject) {
    let reslovedExcel = this.testdataService.excelAddParaToTable(this.nlpObject.nlpData, this.excelParamFormValidation)
    if (this.iamEditingTheData == true) {

      return this.xx = this.connect.nlpKeyworDispaly(this.makeNlpEditCaseG.nlpDataToCompare, this.makeNlpEditCaseG.Groups, this.makeNlpEditCaseG.Object, this.iamEditingTheData, reslovedExcel, this.makeNlpEditCaseG.Input3, this.makeNlpEditCaseG.ReturnsValue, 'FromExcel', '', '');
    }
    else {
      if (this.nlpObject.nlpData === "Launch URL") {
        return this.xx = this.connect.nlpKeyworDispaly(this.nlpObject.nlpData, "Browser Specific", excelNlpObject, this.iamEditingTheData, reslovedExcel, '', '', 'FromExcel', '', '')
      }
      else if (this.nlpObject.nlpData !== "Read table cell Data1 and store into variable V1") {
        return this.xx = this.connect.nlpKeyworDispaly(this.nlpObject.nlpData, "KeyBoard & Mouse", excelNlpObject, this.iamEditingTheData, reslovedExcel, '', '', 'FromExcel', '', '')
      }
      else {
        return this.xx = this.connect.nlpKeyworDispaly(this.nlpObject.nlpData, "Java Function", excelNlpObject, this.iamEditingTheData, reslovedExcel, '', '', 'FromExcel', '', '')
      }
    }
  }

  formTableButton() {
    if (this.spreedSheetGenerate.invalid) {
      return;
    }
    this.tableForm.resetForm();
  }


  tableHeader = [];
  mainArray = [];
  formTableTrue: boolean;
  typeColumnNames = [];
  autoGenerate = [];

  formTable() {
    this.tableName = this.spreedSheetGenerate.value.tableName;
    this.tableHeader = [];
    this.mainArray = [];
    var tableData = [];
    this.typeColumnNames = [];
    this.formTableTrue = true;
    this.spreedSheetGenerate.value.columnNames.split(',').forEach((ele, index, arr) => {
      this.tableHeader.push(ele)
      tableData.push("");
      if (index === 0) {
        tableData.unshift('1')
      }
      this.typeColumnNames.push({});
      this.autoGenerate.push({ "columnName": ele })
      if (index == arr.length - 1) {
        this.tableHeader.unshift('SL:NO')
        this.mainArray.push(this.tableHeader);
        this.mainArray.push(tableData);
      }
    });
  }
  highLightSpreedSheet(sId) {
    this.spreedSheetId = sId;
  }

  generateSpreedSheetDataAdd() {
    var testDataFileName = `${this.tableName}.xlsx`;
    var elt = document.getElementById('data-table-new');
    var spreedMode = "NEW";
    return this.generateSpreedSheetDataCommonCall(testDataFileName, elt, spreedMode);
  }

  /* 
     Logic Description: Common or a reusable function which handel the request of  Save and Edit  Excel call 
     */
  generateSpreedSheetDataCommonCall(testDataFileName, elt, spreedMode) {
    let spreedAudit = {}
    spreedAudit["spreedUser"] = this.myUsername
    spreedAudit["spreedDate"] = this.todate
    spreedAudit["spreedTime"] = this.todayTime
    spreedAudit["spreedMode"] = spreedMode
    spreedAudit["comments"] = this.spreedSheetAuditComments.value
    var wb = XLSX.utils.table_to_book(elt);
    this.testdataService.writeFromHtml(wb, this.projectDetails, testDataFileName, spreedAudit, this.projectFramework[0].exportConfigInfo).
      subscribe(res => {
        this.formTableTrue = false;
        this.spreedSheetGenerate.reset()
        this.spreedSheetAuditComments.reset();
        this.excelCallCTC();
        this.autoGenerate = [], this.autoGenerate5 = [], this.mainArray = []
        this.genDataForm.resetForm();
      })
  }//generateSpreedSheetDataCommonCall

  resetTable() { // reset table after close
    this.mainArray = [];
    this.formTableTrue = false;
    this.autoGenerate = [];
  }

  addTestData() {
    var localArray = [];
    this.tableHeader.forEach((element, index, arr) => {
      localArray.push("")
      if (index == 0) {
        localArray[0] = this.mainArray.length
      }

      if (index == arr.length - 1) {
        this.mainArray.push(localArray)
      }
    });
  }

  deleteSpreedSheetNew() {
    if (this.spreedSheetId !== undefined) {
      if (this.spreedSheetId !== 0) {
        this.mainArray.splice(this.spreedSheetId, 1)
        for (let i = this.spreedSheetId; i < this.mainArray.length; i++) {
          this.mainArray[i][0] = i;
        }
        return this.spreedSheetId = undefined;
      }
      else alert("Sorry...!!! Table Column Header Can Not Be Deleted")
    }
    else return alert("Sorry...!!! Please Select Row To Delete");
  }

  async spreedSheetNode(file) {
    if (file.node !== undefined) {
      console.log(file)
      this.testdataService.updateSpreedSheetActiveStatus(file.node.label, this.myUsername, this.projectDetails).
        subscribe(async resp => {
          this.igotSpreedSeetEditStatus = await resp;
          this.selectSpreedSheet = file.node;
          if (this.igotSpreedSeetEditStatus[0].usedStatus.usedStatus) {
            this.spreedSheetName = [
              { label: 'View', command: (event) => { this.spreedSheetView(file.node) } },
              { label: 'Edit', disabled: 'true', command: (event) => { this.spreedSheetEdit(file.node) } },
              { label: 'Audit', command: (event) => { this.spreedSheetAudit(file.node) } },
              { label: 'Delete', disabled: 'true', command: (event) => { this.spreedSheetDelete(file.node) } }


            ];
          }
          else {
            this.spreedSheetName = [
              { label: 'View', command: (event) => { this.spreedSheetView(file.node) } },
              { label: 'Edit', command: (event) => { this.spreedSheetEdit(file.node) } },
              { label: 'Audit', command: (event) => { this.spreedSheetAudit(file.node) } },
              { label: 'Delete', command: (event) => { this.spreedSheetDelete(file.node) } }


            ];
          }
        })
    }
    else { return; }

  }//spreedSheetNode

  spreedSheetName: any;
  selectSpreedSheet: any;
  igotSpreedSeetEditStatus: any;

  spreedSheetViewShow: boolean;
  spreedSheetOnlyView: any;
  viewFileNameUI: String;
  spreedSheetEditShow: boolean = false;
  spreedAuditDisplay: boolean = false;

  /* Logic Description:  Used to save all the User data in Excel folder under project name*/
  spreedSheetView(viewFile) {
    this.spreedSheetViewShow = true;
    this.spreedSheetEditShow = false;
    this.spreedAuditDisplay = false;
    return this.commonCallForSpreedVE(viewFile, '')

  }
  /* Logic Description:  Used to Edit all the User data in Excel folder under project name*/
  spreedSheetEdit(viewFile) {
    this.spreedSheetViewShow = false;
    this.spreedAuditDisplay = false;
    this.spreedSheetEditShow = true;
    return this.commonCallForSpreedVE(viewFile, "EDIT")
  }
  /* Logic Description:  Used to Display all the edited information of a Excel data file*/
  spreedSheetAudit(viewFile) {
    this.spreedSheetViewShow = false;
    this.spreedSheetEditShow = false;
    this.spreedAuditDisplay = true;
    return this.commonCallForSpreedVE(viewFile, '')
  }

  /* Logic Description:  Used to Delete Excel file */
  spreedSheetDelete(deleteSpreedSheet) {
    this.dialogService.openConfirmDialog('Are you sure to delete  ?')
      .afterClosed().subscribe(res => {
        console.log(res)
        if (res) {
          this.spreedAuditDisplay = false;
          this.spreedSheetViewShow = false;
          this.spreedSheetEditShow = false;
          this.testdataService.spreedSheetDeleteService(deleteSpreedSheet.label, this.projectDetails).
            subscribe(resp => {
              this.excelCallCTC();
              this.closeSpreed();
              this.mainArray = [];
            })
        }
      })
  }

  closeSpreed() {
    this.displayTestData = false;
    document.getElementById('ptree').style.background = 'pink'
    this.spreedView = [];
  }

  editedToDisplay: any;
  spreedPropOut: any;
  spreedSheetAuditInfo: any;
  autoGenerate5 = [];

  commonCallForSpreedVE(viewFile, operationMode) {
    this.testdataService.spreedSheetViewService(viewFile.label, this.projectDetails, operationMode, this.myUsername).
      subscribe(async resp => {
        this.editedToDisplay = resp;
        this.spreedSheetOnlyView = this.editedToDisplay.spreedSheet;
        this.spreedPropOut = await this.testdataService.spreedSheetProps(this.editedToDisplay.spreedSheet, viewFile.label, this.editedToDisplay)
        this.viewFileNameUI = this.spreedPropOut.fileName;
        // new Data///
        this.spreedAuthor = this.editedToDisplay.SpreedSheetInfo.createdInfo.spreedUser;
        this.spreedCreatedDate = this.editedToDisplay.SpreedSheetInfo.createdInfo.spreedDate;
        this.spreedCreatedTime = this.editedToDisplay.SpreedSheetInfo.createdInfo.spreedTime;
        // edited Data///
        if (this.spreedPropOut.editedDet !== undefined) {
          this.editedAuthor = this.spreedPropOut.editedDet.spreedUser;
          this.spreedModifiedDate = this.spreedPropOut.editedDet.spreedDate;
          this.spreedModifiedTime = this.spreedPropOut.editedDet.spreedTime;
          this.spreedSheetAuditInfo = this.spreedPropOut.auditInfo;

        }

        this.spreedView = this.spreedPropOut.spreedView;
        this.editedColumnNames = this.spreedView[0]
        this.editedColumnNames.forEach((ele, index, arr) => {
          this.typeColumnNames.push({});
          this.autoGenerate5.push({ "columnName": ele })

        })
        this.displayTestData = true;
      })
  }//commonCallForSpreedVE

  addTestDataForEdit(editedColumnNames) {
    var localArray = [];
    editedColumnNames.forEach((element, index, arr) => {
      localArray.push("")
      if (index == arr.length - 1) {
        this.spreedView.push(localArray)
      }
    });
  }

  addSpreedSheetColumn(spreedSheetCol) {
    alert(spreedSheetCol)
    var emptyArray = []
    this.tempTableHeader = [];
    spreedSheetCol.split(',').forEach((element, index, array) => {
      this.tempTableHeader.push(element)
    })
    this.spreedView.splice(0, 1, this.tempTableHeader)
    this.spreedView.forEach((e, i, a) => {
      if (i < 1) return;
      return e.push('')
    });
  }

  deleteSpreedSheet() {
    if (this.spreedSheetId !== undefined) {
      if (this.spreedSheetId !== 0) {
        this.spreedView.splice(this.spreedSheetId, 1)
        return this.spreedSheetId = undefined;
      }
      else alert("Sorry...!!! Table Column Header Can Not Be Deleted ")
    }
    else return alert("Sorry...!!! Please Select Row To Delete")
  }

  generateSpreedSheetDataEdit() {
    var testDataFileName = `${this.viewFileNameUI}.xlsx`;
    var elt = document.getElementById('data-table-edit');
    var spreedMode = "EDIT";
    this.generateSpreedSheetDataCommonCall(testDataFileName, elt, spreedMode)
    this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'save-snackbar')
    this.displayTestData = false;
  }//generateSpreedSheetDataEdit

  typeDropdownSelected(typeObject: string, index: number) {
    console.log(index, typeObject)
    this.typeColumnNames.forEach((value, ind, arr) => {
      if (ind === index)
        value.typeObject = typeObject;
    });
    console.log(this.typeColumnNames)
  }

  autoGenerateData(value: number) { // for generating auto data 
    let merged = {}
    for (let i = 0; i < this.typeColumnNames.length; i++) {
      for (let j = 0; j < this.unchecked.length; j++) {
        if (this.unchecked[j] == i + 1) {
          let obj3 = {
            [i + 1]: {
              faker: undefined
            }
          }
          merged = { ...merged, ...obj3 }
          delete merged[this.unchecked[j]]
        }

      }
      let obj4 = {
        [i + 1]: {
          faker: this.typeColumnNames[i].typeObject
        }
      }
      if (this.typeColumnNames[i].typeObject == undefined || this.typeColumnNames[i].typeObject == "") {
        delete obj4[i + 1]
        merged = { ...merged, ...obj4 }
      }
      merged = { ...merged, ...obj4 }
    }


    mocker().schema('users', merged, value)
      .build()
      .then(
        data => {
          if (this.mainArray[1][1] === '')
            this.mainArray.splice(1, 1)
          for (var i = 0; i < data.users.length; i++) {
            var newArr = this.assignValues(i, data)
            console.log(newArr)
            newArr.unshift(this.mainArray.length)
            this.mainArray.push(newArr)
          }
        },
        err => console.error(err)
      )
  }

  userObject = [];
  unchecked = [];
  assignValues(i, data) { // assigning values the new array than used to compare 
    console.log(data.users[i])
    Object.keys(data.users[i]).forEach(key => {
      this.userObject.push(parseInt(key));
      let filterObject = (userObject) => this.userObject.filter((v, i) => this.userObject.indexOf(v) === i)
      console.log(filterObject(this.userObject))

    });
    console.log(this.userObject)
    const arr1 = this.userObject;
    const arr2 = this.unchecked;
    this.compare(arr1, arr2) // comparing unchecked array with userobject

    return this.typeColumnNames.map((element, index) => {
      for (var k = 0; k <= this.emptyColumns.length; k++) {
        data.users[i][this.emptyColumns[k]] = "";
      }
      return data.users[i][index + 1];
    })
  }

  compare(arr1, arr2) {
    const finalarray = [];

    arr1.forEach((e1) => arr2.forEach((e2) => {
      if (e1 === e2) {
        finalarray.push(e1)
      }
    }

    ))
    let x = (finalarray) => finalarray.filter((v, i) => finalarray.indexOf(v) === i)
    this.emptyColumns = x(finalarray)
    console.log(this.emptyColumns)
  }
  generateData() { // check whether form is valid or not
    if (this.autoGenForm.invalid) { // if invalid retun
      return;
    }
    this.genDataForm.resetForm(); // if valid then clear all fields
  }

  autoGenModal() { // passing the object when user click on auto generate in edit option
    this.autoGenerate5 = [];
    this.editedColumnNames.forEach((ele, index, arr) => {
      this.typeColumnNames.push({});
      this.autoGenerate5.push({ "columnName": ele })
      const names = this.autoGenerate5;
      let x = (names) => names.filter((v, i) => names.indexOf(v) === i)
      this.autoGenerate5 = x(names)
    })
  }

  getcheckedIndex(e, checkedIndex) {
    alert(checkedIndex)
    this.checked = e.target.checked;
    if (this.checked == false) {
      this.index = checkedIndex + 1;
      this.unchecked.push(this.index)
      const names = this.unchecked;
      let x = (names) => names.filter((v, i) => names.indexOf(v) === i)
      this.unchecked = x(names);
    }
    else {
      this.index = checkedIndex + 2;
      for (var i = 0; i < this.unchecked.length; i++) {
        if (this.unchecked[i] === this.index - 1) {
          this.unchecked.splice(i, 1);
        }
      }
    }
  }


  autoGenerateEdit(value) { // autoGenerate for edit 
    let merged2 = {}
    console.log(this.editedColumnNames)
    for (let i = 0; i < this.editedColumnNames.length; i++) {
      let obj3 = {
        [i + 1]: {
          faker: this.typeColumnNames[i].typeObject
        }
      }
      merged2 = { ...merged2, ...obj3 }
      console.log(merged2);
    }

    mocker().schema('users', merged2, value)
      .build()
      .then(
        data => {
          console.log(data)
          for (var i = 0; i < data.users.length; i++) {
            var newArr = this.assignValues(i, data)
            newArr = newArr.filter((e) => { return e !== undefined });
            this.spreedView.push(newArr)
          }
        },
        err => console.error(err)
      )
  }

  resetColmnForEdit() { // clear fields after completion of edit
    this.autoGenerate5 = [];
  }

  multiDropDownFunction(event) {
    if (this.nlpPage !== undefined && this.nlpObject.Page !== '') {
      if (event.target.checked === true) {
        return this.multiDropDown = true;
      }
      else {
        return this.multiDropDown = false;
      }
    }
    else {
      this.allowToSave = true;
      this.hideValidation('Please select the Page');
      return event.target.checked = false;
    }
  }

  golbalObjectOfMultiStep: [];

  fecthMultiStepData(event, localObject) {
    console.log(localObject);
    this.golbalObjectOfMultiStep = localObject;
    console.log(this.golbalObjectOfMultiStep)
    if (this.golbalObjectOfMultiStep.length !== 0) {
      this.disableGenerateAfterAdd = false;
    }
    else {
      this.disableGenerateAfterAdd = true;
    }

  }

  selectMultiple(multipleData) {
    document.getElementById("generateBtn").setAttribute("disabled", "disabled");
    var deviceslength = this.golbalObjectOfMultiStep.length;
    console.log(this.golbalObjectOfMultiStep)
    this.devicesFun = function (y) {
      if (y < deviceslength) {
        this.servicekey.fetchMultipleStepDataServiceCall(this.golbalObjectOfMultiStep[y].objectType)
          .subscribe(async (response) => {
            await this.iamCallingDependencyFunction(response, this.golbalObjectOfMultiStep[y])
          })
        this.devicesFun(y + 1)
      }//ifclosingsfun
    }//closingsfun
    this.devicesFun(0);
    this.enableDragger = true;
    this.unSavedChangesExits = true;
    const ele1 = document.getElementById("checkMulti") as HTMLInputElement;
    ele1.checked = false;
    this.multiDropDown = false;
  }

  nlpArrayTemp = [];

  async iamCallingDependencyFunction(multiStepAction, multiObjectProp) {
    let multiStepActionValue = await this.connect.multiStepGenerationServiceFun(multiStepAction[0], multiObjectProp)

    let multiStepInput2 = undefined;
    let multiStepReturnValue = undefined;
    if (multiStepAction[0].inputField2 !== "no") { multiStepInput2 = `${multiObjectProp.objectName}Value` }
    if (multiStepAction[0].returnValue !== "no") { multiStepReturnValue = `${multiObjectProp.objectName}VariableName` };

    var multiStepGeneration = {};
    multiStepGeneration["nlpData"] = multiStepActionValue;
    multiStepGeneration["Input2"] = multiStepInput2;
    multiStepGeneration["ReturnsValue"] = multiStepReturnValue;
    multiStepGeneration["ExcelValue"] = this.iamAddingExcel;
    multiStepGeneration["nlpPage"] = this.nlpPage;
    multiStepGeneration["multiStep"] = true;
    if (this.showManageTestCaseUpdate)
      multiStepGeneration["objectUpdate"] = true;
    else
      multiStepGeneration["objectUpdate"] = false;


    let value = await this.scriptOperation.nlpObjectCreationFunction(multiStepAction[0], multiObjectProp, multiStepGeneration)
    this.nlpArrayTemp.splice(multiObjectProp.objectSequence - 1, 0, value);

    if (this.golbalObjectOfMultiStep.length === this.nlpArrayTemp.length) {
      this.nlpArrayTemp = _.sortBy(this.nlpArrayTemp, ['ObjectSequence'])
      if (!this.showManageTestCaseUpdate) return this.multiArrayPushCall();

    }


  }

  multiArrayPushCall() {
    if (this.displayNlpArrayData.length === 0) {
      this.displayNlpArrayData = this.nlpArrayTemp;
      this.displayActionArrayData = this.displayNlpArrayData;
      this.nlpArrayTemp = [];
    }
    else {
      this.displayNlpArrayData = this.displayNlpArrayData.concat(this.nlpArrayTemp)
      this.displayActionArrayData = this.displayNlpArrayData;
      this.nlpArrayTemp = [];
    }

    this.nlpObject.Object = "";
    this.disableGenerateAfterAdd = true;

  }

}

