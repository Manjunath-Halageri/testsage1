import { Component, OnInit } from '@angular/core';
import { roleService } from '../../../../core/services/roleService';
import { Post } from '../../../../post';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { TestCaseCommonService } from '../../../../core/services/test-case-common.service';
import { ManagerequirementService } from '../../../../core/services/managerequirement.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { ConnectToServerService } from '../../../../core/services/connect-to-server.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { HttpClient } from '@angular/common/http';
import { DefectDashboardService } from '../../../../core/services/defect-dashboard.service';

@Component({
  selector: 'app-manage-requirement',
  templateUrl: './manage-requirement.component.html',
  styleUrls: ['./manage-requirement.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [ManagerequirementService, ValidationserviceService, roleService, TestCaseCommonService, ProjectDetailServiceComponent, apiServiceComponent, ConnectToServerService]
})
export class ManageRequirementComponent implements OnInit {

  addManualDataInBetweenRow: any;
  displayActionArray: any[];
  methodDataType: any;
  variableDatatype: any;
  rForm: any;
  featForm: FormGroup;
  RequirementForm: any;
  jiraForm: any;
  spreedSheetForm: FormGroup;
  devicesFun: (y: any) => void;
  toDisableRunBtn: boolean;
  items: { label: string; command: (event: any) => void; }[];
  displayModuleForTree: Post[];
  [x: string]: any;

  //////////// variable declaration starts/////

  date1: any;
  date2: any;
  runNumber: Post[];
  moduleChild: Post[];
  index: Post[];
  number099: number;
  moduleName: any;
  featureName: any;
  projectName: string;
  projectId: string
  indexvalue: number;
  comExcelValueCTC: any;
  crumbitems = [];
  StatusName = [];
  PriorityName = [];
  TypeName = [];
  Assigned = ['Madhu', 'Shivu', 'abhi', 'anil', 'Ravi'];
  getAllReleasesVersions: any;
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  pageRoles: any
  hideManualStepBtn: any;
  displayTestData: boolean;
  products = [];
  requirementassigned: any;
  requirementtype: any;
  requirementpriority: any;
  requirementstatus: any;
  descriptiondata: any;
  clickedScript: any;
  activeFeature: any;
  activeModule: any;
  itIsOnlyForEdit: any;
  showTestCase: any;
  itISOnlyNLPUI: any;
  testcase: any;
  projectFramework: any;
  todate: any;
  projectDetails: any;
  from: any;
  myUsername: any;
  iamAddingExcel: any;
  classObject: any;
  displayForReturnReuse: any;
  hideForNow: any;
  newRole: any;
  pageName: any;
  disableUpdateBtn: any;
  iamEditingTheData: any;
  dataa: any;
  jsonContent: any;
  newUserId: any;
  newUserName: any;
  selectedProject: any;
  iamEditingThePomObject: any;
  scriptDatad: boolean;
  moduleId: any;
  featureId: any;

  constructor(
    private decoratorServiceKey: DecoratorService,
    private roles: roleService,
    private fb: FormBuilder,
    private api: apiServiceComponent,
    private http: HttpClient,
    private servicekey: TestCaseCommonService,
    private dialogService: DialogService,
    private requirenentservice: ManagerequirementService,
    private defectdashboardService: DefectDashboardService,) {
    this.displayTestData = false;
    this.hideManualStepBtn = false;
  }

  getData(event) {
    this.http.post(this.api.apiData + '/XMLscriptData', event).subscribe(data => {
    })
  }

  ngOnInit() {
    this.pageName = "manageRequirementPage"
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
    this.requirementvalidation();
    this.requirementdatafields();
    this.editorConfig;
    this.itIsOnlyForEdit = false;
    this.displayForReturnReuse = false;
    this.disableUpdateBtn = false;
    this.iamAddingExcel = "notExcel";
    this.classObject = '';
    this.hideForNow = false;
    this.iamEditingTheData = false;
    this.iamEditingThePomObject = false;
    this.itisEditedScript = false;
    let UserName1 = sessionStorage.getItem('importedDetails');
    let parsedUserName1 = JSON.parse(UserName1)
    this.myUsername = parsedUserName1[0].userName
    this.newRole = parsedUserName1[0].roleName
    this.pageName = "Managerequirement"
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.todate = new Date().toISOString();
    let UserName = sessionStorage.getItem('importedDetails');
    let parsedUserName = JSON.parse(UserName)
    this.myUsername = parsedUserName[0].userName
    let dataFromProjectSelectionDropdown = sessionStorage.getItem('key');
    this.projectName = dataFromProjectSelectionDropdown;
    this.from = new Date().toISOString().substr(0, 10);
    this.todate = new Date().toISOString().substr(0, 10);
    this.projectDetails = sessionStorage.getItem('key');
    this.http.get(this.api.apiData + '/getProjectId' + this.projectDetails)
      .map(response => { return response as any })
      .subscribe(result => {
        this.projectFramework = result;
        this.projectId = this.projectFramework[0].projectId;
        this.pageRoles = {
          pageName: this.pageName,
          roleName: this.newRole,
          projectNew: this.projectId,
          userId: this.newUserId
        }
        this.getAllReleases(this.projectId)
        this.pass();
      });
    this.testcase = false;
  }

  displayNewObject = []
  action: string
  object: string
  account: string
  editModule = false
  assaignModule = []
  jiraIdForm: any;

  requirementvalidation() {
    this.RequirementForm = this.fb.group({
      'RequirementNameField': ['', [Validators.required, Validators.minLength(1),
      Validators.maxLength(100)]],
      'statusField': ['', Validators.required],
      'priorityField': ['', Validators.required],
      'typeField': ['', Validators.required],
      'assignedField': ['', Validators.required],
      'descriptionField': ['', Validators.required],
      'releaseField': ['', Validators.required]
    });//For requirement form validation


    this.jiraIdForm = this.fb.group({
      'RequirementId': ['', Validators.required]
    })

    this.rForm = this.fb.group({
      'modName': ['', [Validators.required, ValidationserviceService.ctc_Name, Validators.minLength(1), Validators.maxLength(20)]]

    });//for Module Name validation

    this.featForm = this.fb.group({
      'featName': ['', [Validators.required, ValidationserviceService.ctc_Name, Validators.minLength(1), Validators.maxLength(20)]]
    });//For Feature Name validation


  }
  closeModule() {
    this.showmoduleData = false;
    this.editModule = false;
    this.rForm.controls['modName'].reset()
  }
  closeFeature() {
    this.showFeatureData = false;
    this.editFeature = false;
    this.featForm.controls['featName'].reset()
  }

  closeRequirement() {
    this.showScriptData = false;
    this.showEditData = false;
    this.RequirementForm.reset()
  }
  editModulePage() {
    this.editModule = true;
    this.editFeature = false;
    this.showScriptData = false;
    this.showFeatureData = false;
    this.showmoduleData = false;
    this.editScript = false;
    this.showEditData = false;
    this.showTestCase = false;
    this.itISOnlyForSave = false;
    this.itIsOnlyForEdit = false;
    this.itISOnlyNLPUI = false;
    this.http.get(this.api.apiData + '/displayModulePage' + this.clickedModule)
      .map(response => { return response as any })
      .subscribe(result => {
        this.assaignModule = result;
        this.moduleData = this.assaignModule[0].moduleName;
      });
  }

  checkmappedReq;

  checkingCallToDeleteReq() {
    this.requirenentservice.checkTestcaseMappedToRelease(this.clickedScript)
      .subscribe(result => {
        this.checkmappedReq = result
        console.log(this.checkmappedReq.length)
        if (this.checkmappedReq.length >= 1) {
          this.decoratorServiceKey.saveSnackbar('Requirement is mapped to testcase, Delete testcase first', '', 'update-snackbar')
        }
        else {
          this.dialogService.openConfirmDialog('Are you sure to delete this Module ?')
            .afterClosed().subscribe(res => {
              console.log(res)
              if (res === '') {
                console.log('cancelled the operation');
              } else {
                console.log('The user has confirmed the delete operation');
                this.editModule = false;
                this.itISOnlyForSave = false;
                this.itIsOnlyForEdit = false;
                this.showEditData = false;
                console.log(this.clickedScript)
                this.http.delete(this.api.apiData + '/deleterequirement' + this.clickedScript)
                  .map(response => { return response as any })
                  .subscribe(result => {
                    this.pass()
                  });
              }
            })
        }
      })

  }
  checkingCallToDeleteModule() {
    this.requirenentservice.checkingModuleHavingFeature(this.clickedModule)
      .subscribe(result => {
        this.checkmappedReq = result
        console.log(this.checkmappedReq.length)
        if (this.checkmappedReq.length >= 1) {
          this.decoratorServiceKey.saveSnackbar('Module having Features, Delete Features first', '', 'update-snackbar')

        }
        else {
          this.dialogService.openConfirmDialog('Are you sure to delete this Module ?')//by shivakumar
            .afterClosed().subscribe(res => {
              if (res) {
                this.editModule = false;
                this.itISOnlyForSave = false;
                this.itIsOnlyForEdit = false;
                this.showEditData = false;
                this.servicekey.deleteModule(this.clickedModule, this.projectId, this.projectDetails)
                  .subscribe(result => {
                    this.pass();
                  });
              }
            })
        }
      })
  }
  checkingCallToDeleteFeature() {
    this.requirenentservice.checkingFeatureHavingRequirement(this.clickedFeature)
      .subscribe(result => {
        this.checkmappedReq = result
        console.log(this.checkmappedReq.length)
        if (this.checkmappedReq.length >= 1) {
          this.decoratorServiceKey.saveSnackbar('Feature having requirements, Delete requirements first', '', 'update-snackbar')
        }
        else {
          this.dialogService.openConfirmDialog('Are you sure to delete this Feature ?')
            .afterClosed().subscribe(res => {
              if (res) {
                this.editFeature = false;
                this.itISOnlyForSave = false;
                this.itIsOnlyForEdit = false;
                this.showEditData = false;
                this.servicekey.deleteFeature(this.clickedFeature, this.projectId, this.projectDetails, this.clickedModule)
                  .subscribe(result => {
                    this.openFeatureMenu(this.clickedModule, this.clickIndex)
                    this.pass();
                  });
              }
            })
        }
      })
  }

  editFeature = false
  editFeaturePage() {
    this.editFeature = true
    this.editModule = false
    this.showScriptData = false;
    this.showFeatureData = false;
    this.showmoduleData = false;
    this.editScript = false;
    this.showEditData = false
    this.showTestCase = false;
    this.http.get(this.api.apiData + '/displayFeaturePage' + this.clickedFeature)
      .map(response => { return response as any })
      .subscribe(result => {
        this.assaignModule = result;
        this.featureData = this.assaignModule[0].featureName
      });
  }
  editScript = false
  priorityData: string
  typeData: string
  showEditData = false;

  requireUpdateObj = {
    "requirementName": '',
    "requirementstatus": '',
    "requirementpriority": '',
    "requirementtype": '',
    "requirementrelease": '',
    "requirementassigned": '',
    "descriptiondata": ''

  };

  editRequirementPage(moduleId, featureId, scriptId) {
    this.showEditData = true;
    this.editScript = false;
    this.editModule = false
    this.showTestCase = false;
    this.itIsOnlyForEdit = false;
    this.itISOnlyForSave = false;
    this.showmoduleData = false;
    this.showFeatureData = false;
    this.showScriptData = false;
    this.showTestCase = false;
    let editrequirementParam = `${moduleId},${featureId},${scriptId}`;
    this.http.get(this.api.apiData + '/displayrequirementPage' + editrequirementParam)
      .map(response => { return response as any })
      .subscribe(result => {
        this.assaignModule = result;
        console.log(this.assaignModule);
        this.requireUpdateObj = this.assaignModule[0];
        this.requireUpdateObj.requirementstatus = this.assaignModule[0].status;
        this.requireUpdateObj.requirementpriority = this.assaignModule[0].priority;
        this.requireUpdateObj.requirementtype = this.assaignModule[0].type;
        this.requireUpdateObj.requirementrelease = this.assaignModule[0].Release;
        this.requireUpdateObj.requirementassigned = this.assaignModule[0].Assigned;
        this.requireUpdateObj.descriptiondata = this.assaignModule[0].description;
      })

  }
  updateRequirementPage() {

    console.log(this.requireUpdateObj)
    return this.http.put(this.api.apiData + '/updateRequirementData', this.requireUpdateObj)
      .map(response => { return response as any })
      .subscribe(data => {
        console.log(data);
        this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'update-snackbar')
        this.RequirementForm.reset()
        this.pass()
      });
  }

  showmoduleData: boolean
  showFeatureData: boolean
  showScriptData: boolean


  landModulePage() {
    this.showmoduleData = true;
    this.showFeatureData = false;
    this.showScriptData = false;
    this.editModule = false;
    this.showEditData = false;
    this.showTestCase = false;
    this.itISOnlyForSave = false;
    this.itIsOnlyForEdit = false;
    this.editFeature = false;
    this.showJiraData = false;
  }

  showdetails: boolean = false;
  itISOnlyForSave: boolean = false;
  landCreatePage() {
    this.editScript = false;
    this.itISOnlyForSave = false;
    this.showmoduleData = false;
    this.showFeatureData = false;
    this.showScriptData = false;
    this.showEditData = true;
    this.editModule = false;
    this.showTestCase = false;
    this.itIsOnlyForEdit = false;
    this.editFeature = false;
    this.showJiraData = false;
  }
  itisEditedScript: boolean;

  landFeaturePage() {
    this.showFeatureData = true;
    this.showmoduleData = false;
    this.showScriptData = false;
    this.editModule = false;
    this.showEditData = false;
    this.showTestCase = false;
    this.itISOnlyForSave = false;
    this.itIsOnlyForEdit = false;
    this.editFeature = false;
    this.showJiraData = false;

  }
  landScriptPage() {
    this.itISOnlyForSave = false;
    this.showFeatureData = false;
    this.showmoduleData = false;
    this.editModule = false;
    this.showTestCase = false;
    this.itISOnlyForSave = false;
    this.showEditData = false;
    this.showEditData = false;
    this.showScriptData = true;
    this.itIsOnlyForEdit = false;
    this.editFeature = false;
    this.showJiraData = false;
  }
  showJiraData: boolean;

  landJiraPage() {
    this.itISOnlyForSave = false;
    this.showFeatureData = false;
    this.showmoduleData = false;
    this.editModule = false;
    this.showTestCase = false;
    this.itISOnlyForSave = false;
    this.showEditData = false;
    this.showEditData = false;
    this.showScriptData = false;
    this.itIsOnlyForEdit = false;
    this.editFeature = false;
    this.showJiraData = true;
  }

  updateModuleData(moduleData) {
    if (this.moduleData == "" || this.moduleData == undefined) {
      alert("Please Fill Mandatory Fields")
    }
    else {
      this.moduleData = "";
      let urlSearchParams = {
        'updateName': moduleData,
        'moduleName': this.clickedModule,
        'projectName': this.projectName,
        'moduleId': this.moduleId
      };
      this.servicekey.updateModule(urlSearchParams)
        .subscribe(data => {
          this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'update-snackbar')//by shivakumar
          this.pass();
          this.editModule = false;
        });
    }
  }
  updateFeatureData(featureData) {
    if (this.featureData == "" || this.featureData == undefined) {
      alert("Please Fill Mandatory Fields")
    }
    else {
      this.featureData = "";
      let urlSearchParams = {
        'updateName': featureData,
        'featureName': this.clickedFeature,
        'projectName': this.projectName,
        'moduleName': this.clickedModule,
        'featureId': this.featureId,
        'projectId': this.projectId
      };
      this.servicekey.updateFeature(urlSearchParams)
        .subscribe(data => {
          this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'update-snackbar')//by shivakumar
          this.pass();
          this.editFeature = false;
        });
    }
  }

  featureData: string
  saveFeatureData(featureData) {
    if (this.featureData == "" || this.featureData == undefined) {
      alert("Please Fill Mandatory Fields")
    }
    else {
      this.featureData = "";
      let urlSearchParams = {
        'featureName': featureData,
        'projectName': this.projectName,
        'moduleName': this.clickedModule,
        'projectId': this.projectId,
        'exportConfig': this.projectFramework[0].exportConfigInfo
      };
      this.servicekey.allFeatureData(urlSearchParams)
        .subscribe(data => {
          this.openFeatureMenu(this.clickedModule, this.clickIndex)
          if (data[0].duplicate) {
            this.decoratorServiceKey.duplicate_Snackbar('Duplicates not allowed', '', 'duplicate-snackbar')
          } else {
            this.openFeatureMenu(this.clickedModule, this.clickIndex)
            this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')//by shivakumar
            this.showFeatureData = false;
            this.pass();
          }
        });
    }
  }


  scriptData: string
  clickedModule: string
  displayFeatureName = []
  clickIndex: number
  dbModuleName: string
  displayFeatures = []
  openFeatureMenu(selectedModule, i) {
    console.log(selectedModule, i)
    this.activeModule = selectedModule;
    this.clickIndex = i
    this.clickedModule = selectedModule;
    this.editModule = false;
    this.displayScripts = [];
    this.crumbitems[0] = this.activeModule;
    this.crumbitems.splice(1, 1);
    this.crumbitems.splice(2, 1);
    this.http.get(this.api.apiData + '/getFeatureFromDb' + selectedModule)
      .map(response => { return response as any })
      .subscribe(result => {
        this.displayFeatures = result;
      });
    this.http.get(this.api.apiData + '/etModuleDb' + selectedModule)
      .map(response => { return response as any })
      .subscribe(result => {
        this.displayFeatureName = result; console.log(this.displayFeatureName)
        this.dbModuleName = this.displayFeatureName[0].moduleName;
      });

  }
  clickedFeature: string
  displayScripts = []
  dbFeatureName: string
  clickFeatureIndex: number
  conditionFeatureName = []
  pomObject: any;
  openScriptMenu(selectedFeature, j) {
    this.activeFeature = selectedFeature;
    this.editModule = false;
    this.clickFeatureIndex = j
    this.clickedFeature = selectedFeature;
    this.crumbitems[1] = this.activeFeature;
    this.crumbitems.splice(2, 1);
    this.http.get(this.api.apiData + '/getScriptFromDb' + selectedFeature)
      .map(response => { return response as any })
      .subscribe(result => {
        this.displayScripts = result;
      });
    this.http.get(this.api.apiData + '/conditionFeatureTree' + selectedFeature)
      .map(response => { return response as any })
      .subscribe(result => {
        this.conditionFeatureName = result;
        this.RequirementForm.reset();
        this.dbFeatureName = this.conditionFeatureName[0].featureName;
      });

  }
  callNext(localCheck, reslove, reject) {
    if (localCheck == "Generated From NLP") {
      reslove(this.hideManualStepBtn = false)
    }
    else {
      reslove(this.hideManualStepBtn = true)
    }
  }

  //////////////////////////////// tree structure //////////////////////////////
  pass() {
    this.displayTestData = false;
    console.log(this.pageRoles)
    this.requirenentservice.getMyModules(this.pageRoles).subscribe(
      data => {
        this.displayModuleForTree = data;
        this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
        console.log(data);
        this.sortFeatures();
      })
  }

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

  async nodeSelect(file) {
    this.displayTestData = false;
    if (file.node != undefined) {
      if (file.node.data == "module") {
        this.clickedModule = file.node.label;
        this.moduleId = file.node.moduleId;
        console.log(this.clickedModule)
        for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
          if (file.node.label === this.displayModuleForTree[index]['label']) {
            this.openFeatureMenu(this.clickedModule, index);
            break;
          }

        }
        if (!this.create) {     //shiva
          this.items = []
        }
        // else if (this.create && this.pageRoles.roleName == 'Manager') {
        //   // alert("Manager")
        //   this.items = [
        //     { label: 'Create new feature', command: (event) => this.landFeaturePage() }

        //   ]

        // }
        else {
          // alert(this.create)
          this.items = [
            { label: 'Create new feature', command: (event) => this.landFeaturePage() },
            { label: 'Edit', command: (event) => this.editModulePage() },
            { label: 'Delete', command: (event) => this.checkingCallToDeleteModule() },

          ];
        }
      }
      else if (file.node.data == "feature") {
        let children = file.node.parent.children
        this.clickedModule = file.node.parent.label;
        this.clickedFeature = file.node.label;
        this.moduleId = file.node.moduleId;
        this.featureId = file.node.featureId;
        for (let index = 0; index < children.length; index++) {//for loop here is to find index of selected or clicked feature
          if (file.node.label === children[index]['label']) {
            this.openScriptMenu(this.clickedFeature, index)
            break;
          }

        }
        if (!this.create) {
          this.items = []
        }
        // else if (this.create && this.pageRoles.roleName == 'Manager') {
        //   // alert("Manager")
        //   this.items = [
        //     { label: 'Create New Requirement', command: (event) => this.landScriptPage() },


        //   ]

        // }
        else {
          this.items = [
            { label: 'Create New Requirement', command: (event) => this.landScriptPage() },
            { label: 'Edit', command: (event) => this.editFeaturePage() },
            { label: 'Delete', command: (event) => this.checkingCallToDeleteFeature() },

          ]
        }
      }
      else if (file.node.data == "script") {
        this.clickedModule = file.node.parent.parent.label;
        this.clickedFeature = file.node.parent.featureName;
        this.clickedScript = file.node.label;
        this.moduleId = file.node.parent.moduleId;
        this.featureId = file.node.parent.featureId;
        console.log(file.node)
        console.log(this.clickedScript)
        if (!this.edit) {
          this.items = [
            { label: 'Details', command: (event) => { this.landCreatePage(), this.editRequirementPage(this.clickedModule, this.clickedFeature, this.clickedScript) } },
          ]
        }
        else {
          this.items = [
            { label: 'Details', command: (event) => { this.landCreatePage(), this.editRequirementPage(this.clickedModule, this.clickedFeature, this.clickedScript) } },
            { label: 'Delete', command: (event) => this.checkingCallToDeleteReq() },

          ]
          return;

        }
      }
    }
    else {
      console.log(file.node);
      return;
    }
  }

  openFullscreen() {
    var elem = document.getElementById("myvideo");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }

  }
  //////////////////////////////////////////////Text Editor////////////////////////////////////////////////
  editorConfig: AngularEditorConfig = {

    editable: true,
    spellcheck: true,
    height: '120px',
    minHeight: '0',
    maxHeight: '500px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: 'sans-serif',
    defaultFontSize: '1px',
    sanitize: true,
    toolbarPosition: 'top',
  };

  /////////////////////////create description////////////////////

  cleardata() {
    this.descriptiondata = '';
    this.requirementstatus = '';
    this.requirementpriority = '';
    this.requirementtype = '';
    this.requirementassigned = '';
  }

  moduleData: string
  saveModuleData(moduleData) {
    if (this.moduleData == "" || this.moduleData == undefined) {
      alert("Please Fill Mandatory Fields")
    }
    else {
      this.moduleData = "";
      let urlSearchParams = {
        'moduleName': moduleData,
        'projectId': this.projectId,
        'projectName': this.projectName,
        'exportConfig': this.projectFramework[0].exportConfigInfo
      }
      this.servicekey.allModuleData(urlSearchParams)
        .subscribe(data => {
          console.log(data)
          if (data[0].duplicate) {
            this.decoratorServiceKey.duplicate_Snackbar('Duplicates not allowed', '', 'duplicate-snackbar')
            // data; this.openContextMenu()
          } else {
            this.pass()
            this.rForm.reset()
            this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
            this.showmoduleData = false;
          }
        });
    }
  }

  requirementId: any;
  issueId: any;

  CreateRequirement() {
    var vobja = {
      'moduleName': this.clickedModule,
      'featureName': this.clickedFeature,
      'projectName': this.projectName,
      'requirementstatus': this.requireUpdateObj.requirementstatus,
      "requirementpriority": this.requireUpdateObj.requirementpriority,
      "requirementtype": this.requireUpdateObj.requirementtype,
      "requirementassigned": this.requireUpdateObj.requirementassigned,
      "descriptiondata": this.requireUpdateObj.descriptiondata,
      "requirementName": this.requireUpdateObj.requirementName,
      "requirementrelease": this.requireUpdateObj.requirementrelease,
      "issueId": this.issueId,
      "projectId": this.projectId
    }
    return this.http.post(this.api.apiData + '/DescriptionDatatodb', vobja)
      .map(response => { return response as any })
      .subscribe(data => {
        if (data[0].duplicate) {
          this.decoratorServiceKey.duplicate_Snackbar('Duplicates not allowed', '', 'duplicate-snackbar')
        } else {
          this.openScriptMenu(this.clickedFeature, this.clickFeatureIndex);
          this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')//by shivakumar 
          this.openScriptMenu(this.clickedFeature, this.clickFeatureIndex);
          this.RequirementForm.reset()
          this.pass()
        }
      })
  }

  requirementName: string
  requirementdatafields() {
    this.http.get(this.api.apiData + '/getRequirementFields').subscribe(data => {
      this.StatusName = data[0].Status;
      this.PriorityName = data[0].Priority;
      this.TypeName = data[0].Type;
    })
  }

  getAllReleases(projectId) {
    console.log(projectId)
    var obj = {
      "projectId": projectId
    }
    this.defectdashboardService.getAllReleaseVersions(obj)
      .subscribe((data) => {
        console.log(data)
        this.getAllReleasesVersions = data;
      })
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
        this.edit = this.permissions[0].edit;
        this.read = this.permissions[0].read
        this.delete = this.permissions[0].delete
        this.create = this.permissions[0].create
        this.disableButton = this.permissions[0].disableButton
      })
  }
  editJsonData: any;

}
