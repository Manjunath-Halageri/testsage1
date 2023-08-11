import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import 'rxjs/add/operator/map';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../../../../post';
import { roleService } from '../../../../core/services/roleService';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { ApiComponentCommunicationService } from '../../../../core/services/api-component-communication.service';
import { SpreedSheetService } from '../../../../core/services/spreed-sheet.service';
import { HttpClient } from '@angular/common/http';
import { TestdataService } from '../../../../core/services/testdata.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { DialogService } from '../../../../core/services/dialog.service';
import mocker from 'mocker-data-generator';
import * as XLSX from 'xlsx';
import { ApiComponentCoreServiceService } from '../../../../core/services/api-component-core-service.service';


@Component({
  selector: 'app-rest-api-tree-structure',
  templateUrl: './rest-api-tree-structure.component.html',
  styleUrls: ['./rest-api-tree-structure.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class RestApiTreeStructureComponent implements OnInit {
  selectSpreedSheet: any;
  excelFilesToUpload: any;
  mainArray = [];
  [x: string]: any;
  spreedSheetName: any;
  spreedSheetViewShow: boolean;
  excelFileNameCTC: any;
  spreedSheetOnlyView: any;
  viewFileNameUI: String;
  spreedSheetEditShow: boolean = false;
  spreedAuditDisplay: boolean = false;
  igotSpreedSeetEditStatus: any;
  myUsername: string;
  displayTestData: boolean;
  displayModuleForTree: Post[];
  clickedModule: any;
  items: { label: string; command: (event: any) => any; }[];
  clickedFeature: any;
  clickedScript: any;
  clickedScriptId: any;
  hideManualStepBtn: any;
  video: boolean;
  pageRoles: Object = {}
  projectDetails: string;
  projectFramework: any;
  projectId: string;
  pageName: any;
  newRole: any;
  newUserId: any;
  activeFeature: any;
  spreedSheetForm: FormGroup;
  spreedSheetAuditComments: FormGroup;
  spreedSheetGenerate: FormGroup;
  spreedAcess: boolean;
  completepath: any;
  spreedView: any;
  spreedSheetAuditInfo: any;
  spreedModifiedTime: any;
  spreedModifiedDate: any;
  spreedAuthor: any;
  spreedPropOut: any;
  editedToDisplay: any;
  tableName: any;
  formTableTrue: any;
  tableHeader: any;
  typeColumnNames: any = [];
  editedColumnNames: any;
  editedAuthor: any;
  spreedCreatedTime: any;
  spreedCreatedDate: any;

  crumbitems: any;
  editedFileName: any;
  autoGenerate = [];
  autoGenForm: any;
  index: any;
  typeDropdown: any;
  autoGenerate5 = [];
  todate: any;
  todayTime: any;
  clickedModuleId: any;
  clickedFeatureId: any;

  constructor(private roles: roleService, private http: HttpClient,
    private api: apiServiceComponent, private router: Router,
    private data: ProjectDetailServiceComponent, private data1: ApiComponentCommunicationService,
    private spreed: SpreedSheetService, private fb: FormBuilder, private ActivatedRoute: ActivatedRoute,
    private testdataService: TestdataService, private decoratorServiceKey: DecoratorService,
    private dialogService: DialogService,
    private apiCore: ApiComponentCoreServiceService
  ) {

    this.spreedSheetAuditComments = fb.group({
      'spreedComment': ['', Validators.required]
    })

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

    this.autoGenForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      inputReq: new FormControl('', [Validators.required]),
    })

    this.displayTestData = false;
  }

  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
  @ViewChild('tableForm', { static: false }) tableForm;
  @ViewChild('genDataForm', { static: false }) genDataForm;

  ngOnInit() {
    this.projectDetails = this.data.selectedProject();
    let UserName1 = sessionStorage.getItem('importedDetails');
    let parsedUserName1 = JSON.parse(UserName1);
    this.myUsername = parsedUserName1[0].userName;

    this.http.get(this.api.apiData + '/getProjctFrameWork' + this.projectDetails)
      .map(response => { return response as any })
      .subscribe(result => {
        this.projectFramework = result;
        this.projectId = this.projectFramework[0].projectId;

        this.pageRoles = {
          projectNew: this.projectId
        }
        this.getTreeModules();
        this.excelCallCTC();
      });
    this.testdataService.getTestDataType().subscribe(data => {
      this.typeDropdown = data[0].testDataType;
      console.log(this.typeDropdown)
    })
    this.value = 1;
    this.todate = new Date().toISOString().substr(0, 10);
    var today = new Date();
    this.todayTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.EditSpreeSheet = undefined;
    this.unexpectedUserCall();
  }

   /*logic description:when creating the module, adding the object and routing to apiModFeatScript component
   */
  landModulePage() {
    this.data1.enableModuleOpenValue({ 'flag': true });
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure/apiModFeatScript']);
  }

  /*logic description:when creating the feature, adding the object and routing to apiModFeatScript component
   */
  landFeaturePage() {
    this.data1.enableFeatureOpenValue({ 'flag': true, 'clickedModule': this.clickedModule })
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure/apiModFeatScript']);
  }

/*logic description:when creating the script, adding the object and routing to apiModFeatScript component
   */
  landScriptPage() {
    this.data1.enableScriptOpenValue({
      'flag': true, 'clickedModule': this.clickedModule,
      'clickedFeature': this.clickedFeature
    })
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure/apiModFeatScript']);
  }

/*logic description:when click on script open, adding the object and routing to apiModFeatScript component
   */
  landNLPPage() {
    this.data1.enableManualView({
      'flag': true,
      'clickedModule': this.clickedModule,
      'clickedModuleId': this.clickedModuleId,
      'clickedFeature': this.clickedFeature,
      'clickedFeatureId': this.clickedFeatureId,
      'clickedScript': this.clickedScript,
      'clickedScriptId': this.clickedScriptId
    })
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure/restApiManualSteps', this.clickedScriptId]);
    this.data1.currentCrumbItems.subscribe(value => {
      this.crumbitems = value;
    });
    console.log(this.crumbitems);
    // else {
    //   this.data1.enableManualView(false)
    //   this.router.navigate(['/projectdetail/restAssured/apiTreeStructure/restApiManualSteps', this.clickedScriptId]);
    // }

  }

  /*logic description:when click on edit script, adding the object and routing to apiModFeatScript component
   */
  landEditScriptPage() {
    this.data1.enablescriptEditValue({
      'flag': true,
      'clickedModule': this.clickedModule,
      'clickedModuleId': this.clickedModuleId,
      'clickedFeature': this.clickedFeature,
      'clickedFeatureId': this.clickedFeatureId,
      'clickedScript': this.clickedScript,
      'clickedScriptId': this.clickedScriptId
    })
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure/apiModFeatScript']);
  }

/*logic description:fetching the modules, features, testcases
   */
  getTreeModules() {
    this.displayTestData = false;
    var files = [];
    this.roles.getMyModules(this.pageRoles).subscribe(
      data => {
        this.displayModuleForTree = data;
        console.log(this.displayModuleForTree);
        this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
        this.sortFeatures();
      })
  }

  /*logic description:sorting the features, testcases
   */
  sortFeatures() {
    for (var i = 0; i < this.displayModuleForTree.length; i++) {
      if (this.displayModuleForTree[i].children.length !== 0) {
        this.displayModuleForTree[i].children.sort((a, b) => a.label.localeCompare(b.label))
        this.displayModuleForTree[i].children.forEach(e => {
          if (e.children.length !== 0) {
            e.children.sort((a, b) => a.label.localeCompare(b.label))
          }
        })
      }
    }
  }

  /*logic description:displaying options when right click of module, feature, testcase
   */
  async nodeSelect(file) {
    this.displayTestData = false;
    this.unexpectedUserCall();
    if (file.node != undefined) {
      if (file.node.data == "module") {
        this.clickedModule = file.node.label;
        this.clickedModuleId = file.node.moduleId;
        for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
          if (file.node.label === this.displayModuleForTree[index]['label']) {
            this.openFeatureMenu(this.clickedModule, index);
            break;
          }

        }
        this.items = [
          { label: 'Create new feature', command: (event) => this.landFeaturePage() },
          { label: 'Edit', command: (event) => this.editModulePage() },
          { label: 'Delete', command: (event) => this.deleteModulePage() },

        ];
      }
      else if (file.node.data == "feature") {
        let children = file.node.parent.children
        this.clickedModule = file.node.parent.label;
        this.clickedModuleId = file.node.parent.moduleId;
        this.clickedFeature = file.node.label;
        this.clickedFeatureId = file.node.featureId;
        for (let index = 0; index < children.length; index++) {//for loop here is to find index of selected or clicked feature
          if (file.node.label === children[index]['label']) {
            this.openScriptMenu(this.clickedFeature, index)
            break;
          }

        }
        this.items = [

          { label: 'Create New Test Case', command: (event) => this.landScriptPage() },
          // { label: 'Import', command: (event) => this.imortTestCase() },
          { label: 'Edit', command: (event) => this.editFeaturePage() },
          { label: 'Delete', command: (event) => this.deleteFeaturePage() },

        ]
      }
      else if (file.node.data == "script") {
        console.log(file.node.scriptId, 'jerei')
        this.clickedModule = file.node.parent.parent.label;
        this.clickedModuleId = file.node.parent.moduleId;
        this.clickedFeature = file.node.parent.featureName;
        this.clickedFeatureId = file.node.parent.featureId;
        this.clickedScript = file.node.label;
        this.clickedScriptId = file.node.scriptId;
        this.landNLPPage();
        this.items = [
          // { label: 'Manual Steps', command: (event) => { this.landNLPPage("Generate") } },
          { label: 'Edit', command: (event) => { this.landEditScriptPage() } },
          { label: 'Delete', command: (event) => this.deleteScriptPage() },
        ]
        return;
      }
    }
    else {
      console.log(file.node);
      return;
    }
  }

  /*logic description:when click on feature
   */
  openFeatureMenu(selectedModule, i) {
    console.log(selectedModule, i)
  }

  /*logic description:when click on script
   */
  openScriptMenu(selectedFeature, j) {
    console.log(selectedFeature, j);
    this.activeFeature = selectedFeature;
  }

  /*logic description:not using
   */
  selectedScript(testScriptName) {
    return new Promise((reslove, reject) => {
      this.clickedScript = testScriptName;
    })
  }

  /*logic description: calling the when click on TestData but no use
   */
  enableTestData() {
    document.getElementById('testData').style.color = '#31B0D5';
  }
/*logic description:when import excel option
   */
  importSpreedSheet() {
    return document.getElementById("importSpreedSheet").click();
  }

  /*logic description:checking the file name is duplicate or not in generate testdata modal
   */
  checkForDuplicateFiles(fileName) {
    console.log(fileName)
    this.testdataService.checkForDuplicateExcelFile(fileName, this.projectDetails)
      .subscribe((res) => {
        return this.removeFileName(res)
      })
  }

/*logic description:alerting when duplicate filename on generate testdata modal
   */
  removeFileName(res) {
    if (res !== "Success") {
      alert(res)
      this.editedFileName = ''
    }
  }

/*logic description:validating the generate sheet when click on form table
   */
  formTableButton() {
    if (this.spreedSheetGenerate.invalid) {
      return;
    }
    this.tableForm.resetForm();
  }

  /*

   Logic Description: Used to create dynamic table on User Demand function need some parameters like
   table name and field names seperated by comma
   
   */
  formTable() {
    this.tableName = this.spreedSheetGenerate.value.tableName;
    this.formTableTrue = true;
    this.tableHeader = [];
    this.mainArray = [];
    var tableData = [];
    this.typeColumnNames = [];
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
        // console.log( this.mainArray);
      }
    });
  }

  /*logic description:Displaying table for when click on generate testdata
   */
  generateSpreedSheet() {
    this.editedColumnNames = '';
    return document.getElementById("generateSpreedSheet").click();
  }

  /*logic description:validating the generate sheet in form table
   */
  generateData() { // check whether form is valid or not
    if (this.autoGenForm.invalid) { // if invalid retun
      return;
    }
    this.genDataForm.resetForm(); // if valid then clear all fields
  }

  /*logic description:adding the columns when selecting the checkboxes of columns
   */
  unchecked = [];
  getcheckedIndex(e, checkedIndex) {
    // alert(checkedIndex)
    this.checked = e.target.checked;
    if (this.checked == false) {
      this.index = checkedIndex + 1;
      this.unchecked.push(this.index)
      const names = this.unchecked;
      let x = (names) => names.filter((v, i) => names.indexOf(v) === i)
      this.unchecked = x(names)
      // console.log(this.unchecked)
      // console.log(this.autoGenerate)
    }
    else {
      this.index = checkedIndex + 2;
      // alert(this.index)
      // console.log(this.unchecked)
      for (var i = 0; i < this.unchecked.length; i++) {
        if (this.unchecked[i] === this.index - 1) {
          this.unchecked.splice(i, 1);
        }
      }
      // console.log(this.unchecked)
    }
  }

  /*logic description:select what type of data to generate in each column
   */
  typeObject: string;
  typeDropdownSelected(typeObject: string, index: number) {
    console.log(index, typeObject)
    this.typeColumnNames.forEach((value, ind, arr) => {
      if (ind === index)
        value.typeObject = typeObject;
    });
  }

  inputBox(x) {
    console.log(x.target.value)
    var invalidChars = [
      "-",
      "+",
      "e",
      "."
    ];
    if (invalidChars.includes(x.key)) {
      x.preventDefault();
    }
  }

  /*logic description:Generating the some random data from mocker api/library
   */
  value: number = 1;
  autoGenerateData(value: number) { // for generating auto data 
    let merged = {}
    console.log(this.typeColumnNames, this.unchecked)
    for (let i = 0; i < this.typeColumnNames.length; i++) {
      for (let j = 0; j < this.unchecked.length; j++) {
        // alert(this.unchecked[j])
        // console.log(this.unchecked[j] - 1)
        // alert('plll')
        // alert(i + 1)
        if (this.unchecked[j] == i + 1) {
          let obj3 = {
            [i + 1]: {
              faker: undefined
            }
          }
          merged = { ...merged, ...obj3 }
          // console.log(merged);                
          delete merged[this.unchecked[j]]
          // console.log(merged);
        }

      }
      let obj4 = {
        [i + 1]: {
          faker: this.typeColumnNames[i].typeObject
        }
      }
      if (this.typeColumnNames[i].typeObject == undefined || this.typeColumnNames[i].typeObject == "") {
        // alert('pending')
        // alert(i)
        delete obj4[i + 1]
        merged = { ...merged, ...obj4 }
        // console.log(merged)
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
            newArr.unshift(this.mainArray.length)
            this.mainArray.push(newArr)
          }
        },
        err => console.error(err)
      )
  }

  userObject = [];
  assignValues(i, data) { // assigning values the new array than used to compare 
    console.log(data.users[i])
    Object.keys(data.users[i]).forEach(key => {
      this.userObject.push(parseInt(key));
      let filterObject = (userObject) => this.userObject.filter((v, i) => this.userObject.indexOf(v) === i)
      console.log(filterObject(this.userObject))

    });
    // console.log(this.unchecked)
    const arr1 = this.userObject;
    const arr2 = this.unchecked;
    this.compare(arr1, arr2) // comparing unchecked array with userobject

    return this.typeColumnNames.map((element, index) => {
      // alert(index)
      for (var k = 0; k <= this.emptyColumns.length; k++) {
        data.users[i][this.emptyColumns[k]] = "";
      }
      return data.users[i][index + 1];
    })
  }


  resetColmnForEdit() { // clear fields after completion of edit
    this.autoGenerate5 = [];
  }

  compare(arr1, arr2) {
    // alert("compare")
    const finalarray = [];

    arr1.forEach((e1) => arr2.forEach((e2) => {
      if (e1 === e2) {
        finalarray.push(e1)
      }
    }

    ))
    // console.log(finalarray)
    let x = (finalarray) => finalarray.filter((v, i) => finalarray.indexOf(v) === i)
    // console.log(x(finalarray))
    this.emptyColumns = x(finalarray)
    console.log(this.emptyColumns)
  }

  /*logic description:adding a  row on Add row button in autogenerate
   */
  addTestData() {
    var localArray = [];
    this.tableHeader.forEach((element, index, arr) => {
      localArray.push("")
      if (index == 0) {
        localArray[0] = this.mainArray.length
      }

      // console.log(element)
      if (index == arr.length - 1) {
        this.mainArray.push(localArray)
      }
    });
  }

  /*logic description:deleting a  row on Delete row button in autogenerate
   */
  spreedSheetId: number;
  deleteSpreedSheetNew() {
    if (this.spreedSheetId !== undefined) {
      if (this.spreedSheetId !== 0) {
        this.mainArray.splice(this.spreedSheetId, 1)
        // for (let i = this.spreedSheetId; i < this.mainArray.length; i++) {
        //   this.mainArray[i][0] = i;
        // }
        return this.spreedSheetId = undefined;
      }
      else alert("Sorry...!!! Table Column Header Can Not Be Deleted")
    }
    else return alert("Sorry...!!! Please Select Row To Delete");
  }//deleteSpreedSheetNew

   /*logic description:when click on a row assining the row index
   */
  highLightSpreedSheet(sId) {
    this.spreedSheetId = sId;
  }

  /* 
      Logic Description: handels all the test data save call
      */
  generateSpreedSheetDataAdd() {
    var testDataFileName = `${this.tableName}.xlsx`;
    var elt = document.getElementById('data-table-new');
    var spreedMode = "NEW";
    return this.generateSpreedSheetDataCommonCall(testDataFileName, elt, spreedMode);
  }//generateSpreedSheetDataAdd


  /*
  Logic Description: Used to edit the test data file
  */

  generateSpreedSheetDataEdit() {
    var testDataFileName = `${this.viewFileNameUI}.xlsx`;
    var elt = document.getElementById('data-table-edit');
    var spreedMode = "EDIT";
    return this.generateSpreedSheetDataCommonCall(testDataFileName, elt, spreedMode)
  }//generateSpreedSheetDataEdit


  /* 
     Logic Description: Common or a reusable function which handel the request of  Save and Edit  Excel call 
     */
  generateSpreedSheetDataCommonCall(testDataFileName, elt, spreedMode) {
    // alert(this.projectFramework[0].exportConfigInfo)
    let spreedAudit = {}
    spreedAudit["spreedUser"] = this.myUsername
    spreedAudit["spreedDate"] = this.todate
    spreedAudit["spreedTime"] = this.todayTime
    spreedAudit["spreedMode"] = spreedMode
    spreedAudit["comments"] = this.spreedSheetAuditComments.value
    var wb = XLSX.utils.table_to_book(elt);
    this.testdataService.writeFromHtmlForRestApi(wb, this.projectDetails, testDataFileName, spreedAudit, this.projectFramework[0].exportConfigInfo).
      subscribe(res => {
        if (res == "Duplicate Files Are Not Allowed") { alert(res) }
        this.formTableTrue = false;
        this.spreedSheetGenerate.reset()
        this.spreedSheetAuditComments.reset();
        this.excelCallCTC();
        this.autoGenerate = [], this.autoGenerate5 = [], this.mainArray = []
        this.genDataForm.resetForm();
        this.value = 1;
        if (spreedMode == "NEW") {
          this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
        } else {
          this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'save-snackbar')
        }

        // this.spreedSheetEditShow = false;
      })
  }//generateSpreedSheetDataCommonCall

  resetTable() { // reset table after close
    this.mainArray = [];
    this.formTableTrue = false;
    this.autoGenerate = [];
    this.value = 1;
  }

  excelCallCTC() {
    this.testdataService.getExcelForRestApi(this.projectDetails)
      .subscribe(result => {
        this.excelFileNameCTC = result;
      });
  }

  /* Logic Description:  Used to save all the User data in Excel folder under project name*/
  spreedSheetView(viewFile) {
    this.spreedSheetViewShow = true;
    this.spreedSheetEditShow = false;
    this.spreedAuditDisplay = false;
    return this.commonCallForSpreedVE(viewFile, '')

  }

  EditSpreeSheet: string;
  /* Logic Description:  Used to Edit all the User data in Excel folder under project name*/
  spreedSheetEdit(viewFile) {
    this.EditSpreeSheet = viewFile;
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
          this.testdataService.spreedSheetDeleteServiceForRestApi(deleteSpreedSheet.label, this.projectDetails).
            subscribe(resp => {
              this.decoratorServiceKey.saveSnackbar('Deleted Successfully', '', 'save-snackbar')
              console.log(resp)
              // alert(resp)
              // this.dialogService.dockerDialog(resp).afterClosed().subscribe(res => { })
              this.excelCallCTC();
              this.closeSpreed();
              this.mainArray = [];
            })
        }
      })
  }

   /*Logic Description: Releasing the spreed sheet when click on close of any option of excel page
     */
  closeSpreed() {
    this.displayTestData = false;
    document.getElementById('ptree').style.background = 'pink'
    this.spreedView = [];
    if (this.spreedSheetEditShow == true) {
      this.testdataService.spreedSheetReleaseForApi(this.EditSpreeSheet, this.projectDetails, this.myUsername).subscribe(res => {
        console.log(res);
        this.EditSpreeSheet = undefined;
      })
    }
  }

  /*Logic Description: Function which diplay side menu for test data,
     option like: view,edit,audit,delete 
     */
  async spreedSheetNode(file) {
    if (file.node !== undefined) {
      this.testdataService.updateSpreedSheetActiveStatus(file.node.label, this.myUsername, this.projectDetails).
        subscribe(async resp => {
          this.igotSpreedSeetEditStatus = await resp;
          this.selectSpreedSheet = file.node;
          if ((this.igotSpreedSeetEditStatus[0].usedStatus.usedStatus && this.igotSpreedSeetEditStatus[0].usedStatus.assignedTo != this.myUsername)) {
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

  /* Logic Description: Common or a reusable function which handel the request of  View and Audit Excel call  */
  commonCallForSpreedVE(viewFile, operationMode) {
    this.testdataService.spreedSheetViewServiceForRestApi(viewFile.label, this.projectDetails, operationMode, this.myUsername).
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

        } else {
          this.spreedSheetAuditInfo = [];
        }

        this.spreedView = this.spreedPropOut.spreedView;
        // this.spreedView[0].unshift('SL:NO')
        this.editedColumnNames = this.spreedView[0]
        this.editedColumnNames.forEach((ele, index, arr) => {
          this.typeColumnNames.push({});
          this.autoGenerate5.push({ "columnName": ele })

        })

        this.displayTestData = true;
        // document.getElementById("viewSpreedSheet").click();

      })
  }//commonCallForSpreedVE

  autoGenModal() { // passing the object when user click on auto generate in edit option
    this.autoGenerate5 = [];
    if (typeof (this.editedColumnNames) == "string") {
      this.editedColumnNames.split(',').forEach((ele, index, arr) => {
        this.typeColumnNames.push({});
        this.autoGenerate5.push({ "columnName": ele })
        const names = this.autoGenerate5;
        let x = (names) => names.filter((v, i) => names.indexOf(v) === i)
        this.autoGenerate5 = x(names)
      })
    } else {
      this.editedColumnNames.forEach((ele, index, arr) => {
        this.typeColumnNames.push({});
        this.autoGenerate5.push({ "columnName": ele })
        const names = this.autoGenerate5;
        let x = (names) => names.filter((v, i) => names.indexOf(v) === i)
        this.autoGenerate5 = x(names)
      })
    }

  }

  /*logic Description:
    Used to add the column to test data file
     */
  addSpreedSheetColumn(spreedSheetCol) {
    alert(spreedSheetCol)
    if (typeof (spreedSheetCol) == "string") {
      var emptyArray = []
      this.tempTableHeader = [];
      spreedSheetCol.split(',').forEach((element, index, array) => {
        this.tempTableHeader.push(element);
      })
      this.spreedView.splice(0, 1, this.tempTableHeader)
      this.spreedView.forEach((e, i, a) => {
        if (i < 1) return;
        return e.push('')
      });
    } else {
      var emptyArray = []
      this.tempTableHeader = [];
      spreedSheetCol.forEach((element, index, array) => {
        this.tempTableHeader.push(element);
      })
      this.spreedView.splice(0, 1, this.tempTableHeader)
      this.spreedView.forEach((e, i, a) => {
        if (i < 1) return;
        return e.push('')
      });
    }
  }

  /*logic Description:
    Used to add the row to test data file
     */
  addTestDataForEdit(editedColumnNames) {
    console.log(editedColumnNames)
    var localArray = [];
    if (typeof (editedColumnNames) == "string") {
      editedColumnNames.split(',').forEach((element, index, arr) => {
        localArray.push("")
        if (index == arr.length - 1) {
          this.spreedView.push(localArray)
        }
      });
    } else {
      editedColumnNames.forEach((element, index, arr) => {
        localArray.push("")
        if (index == arr.length - 1) {
          this.spreedView.push(localArray)
        }
      });
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

  /**
     Logic Decription: Used to delete table column
     */
  deleteSpreedSheet() {
    if (this.spreedSheetId !== undefined) {
      if (this.spreedSheetId !== 0) {
        this.spreedView.splice(this.spreedSheetId, 1)
        return this.spreedSheetId = undefined;
      }
      else alert("Sorry...!!! Table Column Header Can Not Be Deleted ")
    }
    else return alert("Sorry...!!! Please Select Row To Delete")
  }//deleteSpreedSheetNew

  /*logic Description: when edit module
    Used to adding object and route to apiModFeatScript component
     */
  editModulePage() {
    console.log("editModulePage");
    this.data1.enableModuleEditValue({
      'flag': true,
      'clickedModule': this.clickedModule,
      'clickedModuleId': this.clickedModuleId,
    })
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure/apiModFeatScript']);
  }

  /*logic Description: when edit feature
    Used to adding object and route to apiModFeatScript component
     */
  editFeaturePage() {
    console.log("editFeaturePage");
    this.data1.enablefeatureEditValue({
      'flag': true,
      'clickedModule': this.clickedModule,
      'clickedModuleId': this.clickedModuleId,
      'clickedFeature': this.clickedFeature,
      'clickedFeatureId': this.clickedFeatureId
    })
    this.router.navigate(['/projectdetail/restAssured/apiTreeStructure/apiModFeatScript']);
  }

  /*logic Description: when delete script
    Used to adding object and route to apiModFeatScript component
     */
  deleteScriptPage() {
    this.dialogService.openConfirmDialog('Are you sure to delete this Script ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.apiCore.deleteScript(this.clickedScript, this.clickedScriptId, this.clickedFeatureId, this.projectId, this.projectDetails, this.clickedModuleId)
            .subscribe(result => {
              this.router.navigate(['/projectdetail/restAssured/apiTreeStructure']);
              this.getTreeModules();
            });
        }
      })
  }

  /*logic Description: when delete module
    Used to adding object and route to apiModFeatScript component
     */
  deleteFeaturePage() {
    this.dialogService.openConfirmDialog('Are you sure to delete this Feature ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.apiCore.deleteFeature(this.clickedFeature, this.clickedFeatureId, this.projectId, this.projectDetails, this.clickedModule, this.clickedModuleId)
            .subscribe(result => {
              this.router.navigate(['/projectdetail/restAssured/apiTreeStructure']);
              this.getTreeModules();
            });
        }
      })
  }

  /*logic Description: when delete module
    Used to adding object and route to apiModFeatScript component
     */
  deleteModulePage() {
    this.dialogService.openConfirmDialog('Are you sure to delete this Module ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.apiCore.deleteModule(this.clickedModule, this.clickedModuleId, this.projectId, this.projectDetails)
            .subscribe(result => {
              this.router.navigate(['/projectdetail/restAssured/apiTreeStructure']);
              this.getTreeModules();
            });
        }
      })
  }

  /*logic Description: adding array of files object to a varable
     */
  validateExcel(fileInput: any) {
    this.excelFilesToUpload = <Array<File>>fileInput.target.files;
  }

  /*logic Description: not using
     */
  imortTestCase() {
    throw new Error("Method not implemented.");
  }

/*logic Description: when click on upload excel file
    and checking duplicates
     */
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
      alert(res)
    }
  }

  /*logic Description: not using
     */
  fileChangeEvent(fileInput: any) {
    this.excelFilesToUpload = <Array<File>>fileInput.target.files;
  }

  /*Logic Description: Used to upload the excel file under project folder inside Excel*/
  upload() {
    this.testdataService.uploadExcelFileForRestApi(this.excelFilesToUpload, this.projectDetails)
      .subscribe((result) => {
        if (result != 0) {
          this.completepath = result[0].path;
          this.myInputVariable.nativeElement.value = '';
          this.testdataService.saveImportedFileInfo(result[0], this.myUsername).
            subscribe(res => {
              // alert(res)
              // this.dialogService.dockerDialog(res).afterClosed().subscribe(res => { })
              this.excelCallCTC();
              this.decoratorServiceKey.saveSnackbar('Uploaded Successfully', '', 'save-snackbar')
              document.getElementById('importModal').click();
              return this.spreedSheetForm.reset();
            })
        }
      }, (error) => {
        alert("Error Occurred" + error)
      });

  }

  /*logic Description: when close of upload modal and reset the form
     */
  closeUpload() {
    this.myInputVariable.nativeElement.value = '';
    return this.spreedSheetForm.reset();
  }

/*logic Description: setting assigned to null and usedstatus to false
     */
  unexpectedUserCall() {
    this.testdataService.unexpectedUserAction(this.projectDetails, this.myUsername).
      subscribe(res => {
      })
  }

  /*logic Description: not using*/
  uploadExcelFile(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append(this.projectDetails, files[i], files[i].name);
      }
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
    /*logic Description: not using*/
  testCaseForEdit() {
    throw new Error("Method not implemented.");
  }
    /*logic Description: not using*/
  editScriptPage() {
    throw new Error("Method not implemented.");
  }
    /*logic Description: not using*/
  testCaseForNlpEdit() {
    throw new Error("Method not implemented.");
  }
  /*logic Description: not using*/
  openFullscreen() {
    var elem = document.getElementById("myvideo");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }

  }
    /*logic Description: not using*/
  closeFullscreen() {
    this.video = false;
  }
}
