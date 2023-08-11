import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/map';
import { FormsModule, FormControl } from '@angular/forms';
import mocker from 'mocker-data-generator';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { TestCaseCommonService } from '../../../../core/services/test-case-common.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { TestdataService } from '../../../../core/services/testdata.service';
import { TestComponent } from './create';
import { Post } from '../../../../post';
import { Observable } from 'rxjs';
import { apiServiceComponent } from '../../../../core/services/apiService';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { roleService } from '../../../../core/services/roleService';
import * as _ from 'lodash';
import { ConnectToServerService } from '../../../../core/services/connect-to-server.service';
import { NlpUIFunctionalityService } from '../../../../core/services/nlp-uifunctionality.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { OperationOnScriptService } from '../../../../core/services/operation-on-script.service';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { CtcValidationService } from '../../../../core/services/ctc-validation.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { ManagerequirementService } from '../../../../core/services/managerequirement.service';
import tableDragger from 'table-dragger';
import { NgxSpinnerService } from 'ngx-spinner';
import { PerformanceService } from '../../../../core/services/performance.service';

@Component({
    selector: 'app-create-test-case',
    templateUrl: './create-test-case.component.html',
    styleUrls: ['./create-test-case.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
    providers: [roleService, TestCaseCommonService, ProjectDetailServiceComponent, TestComponent, apiServiceComponent, FormsModule, ConnectToServerService]
})

export class CreateTestCaseComponent implements OnInit, OnDestroy {
    addManualDataInBetweenRow: any;
    displayActionArray: any[];
    methodDataType: any;
    variableDatatype: any;
    rForm: FormGroup;
    featForm: FormGroup;
    spreedSheetGenerate: FormGroup;
    commentSection: FormGroup;
    scriptForm: FormGroup;
    spreedSheetForm: FormGroup;
    spreedSheetAuditComments: FormGroup;
    excelParamFormValidation: FormGroup;
    devicesFun: (y: any) => void;
    toDisableRunBtn: boolean;
    items: { label: string; command: (event: any) => void; }[];
    displayModuleForTree: Post[];
    [x: string]: any;
    checked: boolean;
    emptyColumns: any;
    tableName: any;
    spreedView: any;
    spreedModifiedTime: any;
    spreedModifiedDate: any;
    editedAuthor: any;
    spreedCreatedTime: any;
    spreedCreatedDate: any;
    spreedAuthor: any;
    editedFileName: any;
    ipAddress: any;
    statusUpdates: any;
    typeDropdown: any;
    autoGenForm: any;

    //////////// variable declaration starts/////
    date1: any;
    date2: any;
    runNumber: Post[];
    moduleChild: Post[];
    javaKeyWords: any;
    index: any;
    number099: number;
    moduleName: any;
    featureName: any;
    projectName: string;
    indexvalue: number;
    comExcelValueCTC: any;
    dockerPath09: SafeUrl;
    message: string;
    sMN: string;
    validMn: string;
    ind: number;
    importMessage: any;
    spreedAcess: boolean;
    everyTime: any;
    selectedMod: Post[];
    waitMessage: any;
    wM: string;
    modd: any
    indU: any;
    feat: any;
    type: Post[];
    priority: Post[];
    scriptId: any;
    scriptName: any;
    typeId: any;
    priorityId: any;
    ids: any;
    id: string;
    typeName: any;
    checkPath: any;
    script: any;
    hideManualStepBtn: any;
    testcase: any;
    templatePath: any;
    disableGenerateAfterAdd: boolean;
    resulttypes: Post[];
    resulttypes09: Post[];
    updateTCResult: any;
    myUsername: string;
    alltest: Object = {};
    enough: Object = {};
    newObject: Object = {};
    objectTestCase = [];
    projectDetails: string;
    classObject: any;
    classFile: any;
    clickedScript: any;
    showExcelDataCTC: any;
    excelFileNameCTC: any;
    testCaseEditedValue: Object = {};
    from: any;
    todate: any;
    projectFramework: any;
    projectId: string
    getPageName: any;
    locatorsName: any;
    objectValue: any;
    objectLocators: any;
    testNgKey: any;
    excelOpalCTC: Object = {};
    versionId: any;
    iGotScriptID: any;// Contains id of Script Which is clicked in tree Sturture.
    hideForNow: boolean;
    reusableVar: any;
    variableObjectDeclr = [];
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
    addTestCaseDataToTable =
        {
            "Groups": '',
            "ActionList": '',
            "Action": '',
            "ReturnsValue": '',
            "Page": '',
            "Object": '',
            "PomObject": '',
            "ClassObject": '',
            "Input2": '',
            "Input3": '',
            "nlpData": 'itsFromAutomation',
            "Excel": '',
            "VersionID": ''
        };
    commentsSecvar = { commentChecked: false }
    commentsecure = { commentChecked: false }
    variablObjectForStrore: Object = {};
    projectConfig: any;
    time: any;
    defaultBrowser: any;
    defaultVersion: any;
    modal1: any;
    activeModule: string;
    activeFeature: any;
    activeTestScript: any; //Contains Name of Script Whose content is being displayed in the UI.
    displayTestData: boolean;
    allowToSave: boolean;
    allowToSaveVariable: boolean;
    newRole: any;
    pageRoles: Object = {}
    pageName: any
    newUserId: any
    uiProjectFrameWork: any;
    itIsOnlyForEdit: boolean;
    multiDropDown: boolean;
    todayTime: any;
    crumbitems = [];
    releaseHeaderBtn: boolean;
    releaseHeaderDelete: boolean;
    scriptStatusArray: String[] = ['Manual', 'Automated'];
    scriptStatus;
    toppings = new FormControl();
    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
    projectConfig1: any
    time1: any
    defaultBrowser1: any
    defaultVersion1: any
    selectedProject1: any
    selectedProject2: any
    enableDefaultIP: boolean = false;
    requirementName = '';
    disableScriptStatus: boolean;
    unSavedChangesExits: boolean = false;
    toDisableViewReport: boolean;
    configValue: boolean;
    spinnerVal: any;
    generateJmxFile: any;
    securityTest:any;
    moduleId: any;
    featureId: any;
    spinnerPercent: any;
    /////////////// variable declaration ends///////


    constructor(
        private decoratorServiceKey: DecoratorService,
        private roles: roleService,
        private fb: FormBuilder,
        private api: apiServiceComponent,
        private testdataService: TestdataService,
        private servicekey: TestCaseCommonService, private data: ProjectDetailServiceComponent,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private nlpUIFun: NlpUIFunctionalityService,
        private dialogService: DialogService,
        private connect: ConnectToServerService,
        private objectAddingKey: OperationOnScriptService,
        private ctcvalid: CtcValidationService,
        private SpinnerService: NgxSpinnerService,
        private requirenentservice: ManagerequirementService,
        private performanceService: PerformanceService) {
        this.hideDataList = false;
        this.stopExecution = true;
        this.hideManualStepBtn = false;
        this.createForm();
        this.itISOnlyNLPUI = false;
        this.content = "Launch URL";
        this.nlpComObject = '';
        this.nlpEditTestCaseBasedOnVersion = false;
        this.multiDropDown = false;
        this.disableGenerateAfterAdd = true;
        this.displayTestData = false;
        this.toDisableViewReport = true;
        this.releaseHeaderBtn = false;
        this.releaseHeaderDelete = false;
        this.enableDragger = false;
        this.readyForAutomatoion = false;
        this.allowToSave = false;
        this.allowToSaveVariable = false;
        this.disableScriptStatus = true;
        this.configValue = false;
        this.reusableVar = [];
        this.generateJmxFile = false;

        this.rForm = fb.group({
            'modName': ['yash', Validators.compose([Validators.required, ValidationserviceService.ctc_Name, Validators.minLength(1), Validators.maxLength(20)])]
        });

        this.featForm = fb.group({
            'featName': ['', Validators.compose([Validators.required, ValidationserviceService.ctc_Name, Validators.minLength(1), Validators.maxLength(20)])]
        });//For Feature Name validation

        this.scriptForm = fb.group({
            'scrName': ['', Validators.compose([Validators.required, ValidationserviceService.ctc_Name, Validators.minLength(1), Validators.maxLength(20)])],
            'prio': ['', Validators.required],
            'typeSelect': ['', Validators.required],
            'description': ['', Validators.required],
            'scriptStatus': ['', Validators.required],
            'requirementSelect': ['']

        });//For Script form validation

        this.autoGenForm = new FormGroup({
            type: new FormControl('', [Validators.required]),
            inputReq: new FormControl('', [Validators.required]),
        })

        this.spreedSheetForm = fb.group({
            'importFile': ['', Validators.compose([
                Validators.required
            ])
            ]
        })


        this.commentSection = this.fb.group({
            commentsSec: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(249)]
            ]
        })

        this.spreedSheetGenerate = new FormGroup({
            tableName: new FormControl('', [Validators.required]),
            columnNames: new FormControl('', [Validators.required]),
        })

        this.spreedSheetAuditComments = fb.group({
            'spreedComment': ['', Validators.required]
        })
        this.excelParamFormValidation = fb.group({
            'excelParaFile': ['', Validators.required],
            'excelParaRow': ['', Validators.required],
            'excelParaColumn': ['', Validators.required],
        })


    }
    @ViewChild('myDiv', { static: false }) myDiv: ElementRef;
    @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
    @ViewChild('tableForm', { static: false }) tableForm;
    @ViewChild('genDataForm', { static: false }) genDataForm;


    ngOnInit() {

        this.createUserNameFolder();//This function will create folder for each user inside project folder alongside MainProject folder.
        this.selectedProject1 = sessionStorage.getItem('selectedProject')
        this.selectedProject1 = JSON.parse(this.selectedProject1)
        this.selectedProject2 = this.selectedProject1.projectId
        this.getGrouprsAutoCall();
        this.itIsOnlyForEdit = false;
        this.displayForReturnReuse = false;
        this.disableUpdateBtn = false;
        this.iamAddingExcel = "notExcel";
        this.classObject = '';
        this.hideForNow = false;
        this.iamEditingTheData = false;
        this.iamEditingThePomObject = false;
        this.getBrowser();
        this.priortyFetch();
        this.typeFetch();
        this.itisEditedScript = false;
        let UserName1 = sessionStorage.getItem('importedDetails');
        let parsedUserName1 = JSON.parse(UserName1)
        this.myUsername = parsedUserName1[0].userName
        this.newRole = parsedUserName1[0].roleName
        this.pageName = "creatTestCase"
        this.newRole = sessionStorage.getItem('newRoleName');
        this.newUserId = sessionStorage.getItem('newUserId');
        this.testdataService.getTestDataType().subscribe(data => {
            this.typeDropdown = data[0].testDataType;
            console.log(this.typeDropdown)
        })

        var today = new Date();
        this.todate = new Date().toISOString();
        this.todayTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let UserName = sessionStorage.getItem('importedDetails');
        let parsedUserName = JSON.parse(UserName)
        this.myUsername = parsedUserName[0].userName
        let dataFromProjectSelectionDropdown = sessionStorage.getItem('key');
        this.projectName = dataFromProjectSelectionDropdown;
        this.from = new Date().toISOString().substr(0, 10);
        this.todate = new Date().toISOString().substr(0, 10);
        this.projectDetails = this.data.selectedProject();
        this.servicekey.getProjctFrameWork({ "projectName": this.projectDetails }).subscribe((result) => {
            this.projectFramework = result;
            this.enableDefaultIP = this.projectFramework[0].exportConfigInfo;
            this.projectId = this.projectFramework[0].projectId;
            this.uiProjectFrameWork = this.projectFramework[0].framework;
            if (this.uiProjectFrameWork === 'Appium') {
                this.getUploadedApkName();
            }

            this.pageRoles = {
                pageName: this.pageName,
                roleName: this.newRole,
                projectNew: this.projectId,
                userId: this.newUserId
            }
            this.pass();
            this.getRolesPermissions();
        })
        this.testcase = false;
        this.excelCallCTC();
        this.unexpectedUserCall();
    }


    //////////////////////////// ngOnInit ends////////////////////////////


    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.unSavedChangesExistsReuse()) {
            return true;
        } else {
            return false;
        }

    }

    ngOnDestroy() {
        let obj = {
            "userName": sessionStorage.getItem('userName'),
            "projectName": this.projectDetails,
            "projectId": this.projectId
        }
        this.servicekey.destroyDummyProjectToRun(obj).subscribe((data) => {
            console.log("deleteDummy:", data);
        })
        this.servicekey.resetLockNUnlockParameters(obj).subscribe((data) => {
            console.log(data);
        })
    }

    /////////////////////////////////tree Structure///////////////////////

    displayNewObject = []
    action: string
    object: string
    account: string

    editModule = false
    assaignModule = []
    editModulePage() {
        if (this.unSavedChangesExistsReuse()) {
            return;
        }
        this.editModule = true
        this.showScriptData = false;
        this.showFeatureData = false;
        this.showmoduleData = false;
        this.editScript = false;
        this.showEditData = false
        this.showTestCase = false;
        this.itISOnlyForSave = false;
        this.itIsOnlyForEdit = false;
        this.itISOnlyNLPUI = false;
        this.nlpEditTestCaseBasedOnVersion = false;
        this.showManageTestCaseUpdate = false;
        this.showEditData = false;
        this.servicekey.displayModulePage(this.clickedModule)
            .subscribe(result => {
                this.assaignModule = result;
                this.moduleData = this.assaignModule[0].moduleName;
            });
    }

    editFeaturePage() {
        if (this.unSavedChangesExistsReuse()) {
            return;
        }
        this.editModule = false;
        this.showScriptData = false;
        this.showFeatureData = false;
        this.showmoduleData = false;
        this.editScript = false;
        this.showEditData = false
        this.showTestCase = false;
        this.itISOnlyForSave = false;
        this.itIsOnlyForEdit = false;
        this.itISOnlyNLPUI = false;
        this.nlpEditTestCaseBasedOnVersion = false;
        this.showManageTestCaseUpdate = false;
        this.showEditData = false;
        this.editFeature = true;
        this.servicekey.displayFeaturePage(this.clickedFeature)
            .subscribe(result => {
                this.assaignModule = result;
                this.featureData = this.assaignModule[0].featureName;
            });
    }

    deleteScriptPage() {
        this.dialogService.openConfirmDialog('Are you sure to delete this Script ?')
            .afterClosed().subscribe(res => {
                if (res) {
                    this.editFeature = false;
                    this.itISOnlyForSave = false;
                    this.itIsOnlyForEdit = false;
                    this.itISOnlyNLPUI = false;
                    this.nlpEditTestCaseBasedOnVersion = false;
                    this.showEditData = false;
                    this.showManageTestCaseUpdate = false;
                    this.servicekey.deleteScript(this.clickedScript, this.clickedFeature, this.projectId, this.projectDetails, this.clickedModule)
                        .subscribe(result => {
                            this.pass();
                        });
                }
            })
    }

    deleteFeaturePage() {
        if (this.unSavedChangesExistsReuse()) {
            return;
        }
        this.dialogService.openConfirmDialog('Are you sure to delete this Feature ?')
            .afterClosed().subscribe(res => {
                if (res) {
                    this.editFeature = false;
                    this.itISOnlyForSave = false;
                    this.itIsOnlyForEdit = false;
                    this.itISOnlyNLPUI = false;
                    this.nlpEditTestCaseBasedOnVersion = false;
                    this.showEditData = false;
                    this.showManageTestCaseUpdate = false;
                    this.servicekey.deleteFeature(this.clickedFeature, this.projectId, this.projectDetails, this.clickedModule)
                        .subscribe(result => {
                            this.openFeatureMenu(this.clickedModule, this.clickIndex)
                            this.pass();
                        });
                }
            })
    }

    deleteModulePage() {
        if (this.unSavedChangesExistsReuse()) {
            return;
        }
        this.dialogService.openConfirmDialog('Are you sure to delete this Module ?')//by shivakumar
            .afterClosed().subscribe(res => {
                if (res) {
                    this.editModule = false;
                    this.itISOnlyForSave = false;
                    this.itIsOnlyForEdit = false;
                    this.itISOnlyNLPUI = false;
                    this.nlpEditTestCaseBasedOnVersion = false;
                    this.showEditData = false;
                    this.showManageTestCaseUpdate = false;
                    this.servicekey.deleteModule(this.clickedModule, this.projectId, this.projectDetails)
                        .subscribe(result => {
                            this.pass();
                        });
                }
            })
    }
    editFeature = false


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
    // disableDragger() {
    //     // alert("callldisableDragger"+"First")
    //     console.log(this.dragger)
    //     var el = document.getElementById('dragTable');
    //     var dragdragger = tableDragger(el, {
    //         mode: '',
    //         onlyBody: '',
    //         animation: ''
    //     });
    //     dragdragger.dragging = false;
    //     dragdragger.destroy;
    //     return this.dragger = {};
    // }
    showManageTestCaseUpdate: boolean = false;

    manageTestCaseUpdate() {
        if (this.unSavedChangesExistsReuse()) {
            return;
        }
        this.nlpArrayTemp = [];
        this.showmoduleData = false;
        this.showFeatureData = false;
        this.showScriptData = false;
        this.editModule = false;
        this.showEditData = false;
        this.showTestCase = false;
        this.itISOnlyForSave = false;
        this.itIsOnlyForEdit = false;
        this.itISOnlyNLPUI = false;
        this.nlpEditTestCaseBasedOnVersion = false;
        this.showEditData = false;
        this.showManageTestCaseUpdate = true;
    }

    iGotUpdatedObject: any;
    pageUpdateList: any;
    checkObjectUpdates() {
        this.servicekey.checkPageUpdates(this.projectId)
            .subscribe(res => {
                this.pageUpdateList = res;
            })
        // this.servicekey.checkObjectUpdates('','')
        // .subscribe(res=>{
        //     this.iGotUpdatedObject = res;
        //     console.log(this.iGotUpdatedObject)
        //     this.golbalObjectOfMultiStep  = this.iGotUpdatedObject.map(obj=>{return obj.objectName})
        //     // this.selectMultiple('')
        // })
    }
    iGotUpdatedObjectUiDisplay;
    selectForStepsUpdate(data) {
        this.servicekey.checkObjectUpdates(data.projectId, data.pageName)
            .subscribe(res => {
                this.iGotUpdatedObject = res;
                this.iGotUpdatedObjectUiDisplay = this.iGotUpdatedObject.map(obj => { return obj.objectName })
                this.pageUsed(data)
            })
    }
    displayUsedScript: any;
    pageUsed(data) {
        this.servicekey.pageUsedCall(data.projectId, data.pageName)
            .subscribe(res => {
                this.displayUsedScript = res;
            })
    }
    completeListToUpdate = []
    checkForScriptUpdates(list, index, e) {
        if (e.target.checked === true) {
            this.completeListToUpdate.push(list)
        }
        else if (e.target.checked === false) {
            this.completeListToUpdate.splice(index, 1)
        } else { return; }
    }

    addToScripts() {
        this.servicekey.addToStepsCall(this.completeListToUpdate, this.nlpArrayTemp)
            .subscribe(res => {
                this.statusUpdates = res;
                this.decoratorServiceKey.saveSnackbar(this.statusUpdates, '', 'save-snackbar')
                this.completeListToUpdate = [];
                this.displayUsedScript = [];
                this.manualSelectedForEdit = '';
                this.nlpArrayTemp = [];
                this.pageUpdateList = [];
                this.iGotUpdatedObjectUiDisplay = [];
            })
    }
    notAllowed: boolean = true;
    selectMultiple(multipleData) {
        //document.getElementById("generateBtn").setAttribute("disabled", "disabled");
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

    selectMultipleUpdate(multipleData) {
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


        let value = await this.objectAddingKey.nlpObjectCreationFunction(multiStepAction[0], multiObjectProp, multiStepGeneration)
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



    editScript = false
    priorityData: string
    typeData: string
    showEditData = false;
    editScriptPage() {
        this.showEditData = true;
        this.editScript = false
        this.editModule = false
        this.nlpEditTestCaseBasedOnVersion = false;
        this.showTestCase = false;
        this.itISOnlyNLPUI = false;
        this.itIsOnlyForEdit = false;
        this.itISOnlyForSave = false;
        this.showmoduleData = false;
        this.showFeatureData = false;
        this.showScriptData = false;
        this.showManageTestCaseUpdate = false;
        this.scriptForm.controls.scriptStatus.enable();//To enable Testcase Status field .
        // this.moduleMenu = false;
        // this.featureMenu = false;
        // this.scriptMenu = false;
        this.showTestCase = false;
        this.servicekey.displayScriptPage(this.iGotScriptID)
            .subscribe(result => {
                // this.requirementFetch(this.conditionFeatureName)
                this.assaignModule = result;
                this.scriptData = this.assaignModule[0];
                this.priorityData = this.assaignModule[6];
                this.typeData = this.assaignModule[5];
                this.description = this.assaignModule[1]
                this.scriptStatus = this.assaignModule[2]
                this.requirementName = this.assaignModule[3];
                this.ipAddress = this.assaignModule[4].ipAddress;
                this.time = this.assaignModule[4].time;
                this.defaultBrowser = this.assaignModule[4].defaultBrowser;
                this.defaultVersion = this.assaignModule[4].defaultVersion;
            })
    }
    description: any;

    updateScriptData() {
        let formObj = {
            "projectId": this.projectId,
            'updateName': this.scriptData,
            'scriptName': this.clickedScript,
            'priority': this.priorityData,
            'type': this.typeData,
            'requirementName': this.requirementName,
            'requirementId': this.displayRequirementdataID[0].requirementId,
            'description': this.description,
            'scriptStatus': this.scriptStatus,
            'time': this.time,
            'defaultBrowser': this.defaultBrowser,
            'defaultVersion': this.defaultVersion,
            'ipAddress': this.ipAddress,
            'projectName': this.projectName,
            'moduleName': this.clickedModule,
            'featureName': this.clickedFeature,
            'exportConfig': this.projectFramework[0].exportConfigInfo,
            'scriptId': this.iGotScriptID
        }
        console.log(this.displayRequirementdataID)

        this.scriptData = '';
        this.priorityData = '';
        this.typeData = '';
        this.description = '';
        this.scriptStatus = '';
        this.requirementName = '';
        this.configValue = false;
        this.servicekey.updateScriptData(formObj)
            .subscribe(data => {
                this.openScriptMenu(this.clickedFeature, this.featureId)
                // this.scriptForm.reset()
                this.showEditData = false;
                this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'update-snackbar')//by shivakumar
                this.pass();
            });
    }

    showmoduleData: boolean
    showFeatureData: boolean
    showScriptData: boolean

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


    landModulePage() {
        if (this.unSavedChangesExistsReuse()) {
            return;
        }
        this.showFeatureData = false;
        this.showScriptData = false;
        this.editModule = false;
        this.showEditData = false;
        this.showTestCase = false;
        this.itISOnlyForSave = false;
        this.itIsOnlyForEdit = false;
        this.showEditData = false;
        this.showManageTestCaseUpdate = false;
        this.showmoduleData = true;
        this.itISOnlyNLPUI = false;
        this.nlpEditTestCaseBasedOnVersion = false;
    }

    showdetails: boolean = false;
    itISOnlyForSave: boolean = false;
    landCreatePage() {
        // alert("You Selected "+ this.clickedScript +" Script For Operation")
        this.itISOnlyForSave = true;
        this.showmoduleData = false;
        this.showFeatureData = false;
        this.showScriptData = false;
        this.showEditData = false;
        this.editModule = false;
        this.showEditData = false;
        this.showTestCase = false;
        this.itISOnlyNLPUI = false;
        this.nlpEditTestCaseBasedOnVersion = false;
        this.showManageTestCaseUpdate = false;
        this.itIsOnlyForEdit = false;
        // alert(this.itIsOnlyForEdit);
        // this.getGrouprsAutoCall();
        // this.getPageNameByDefault(this.projectId);
        // this.getVaraiableByDefault();
    }
    itisEditedScript: boolean;

    // clickForEditTestCase() {
    //     this.showmoduleData = false;
    //     this.showFeatureData = false;
    //     this.showScriptData = false;
    //     this.editModule = false;
    //     this.showEditData = false
    //     this.itIsOnlyForEdit = true;
    //     this.showTestCase = false;

    // }
    landFeaturePage() {
        if (this.unSavedChangesExistsReuse()) {
            return;
        }
        this.showFeatureData = true;
        this.showmoduleData = false;
        this.showScriptData = false;
        this.editModule = false;
        this.showEditData = false;
        this.showTestCase = false;
        this.itISOnlyForSave = false;
        this.itIsOnlyForEdit = false;
        this.itISOnlyNLPUI = false;
        this.nlpEditTestCaseBasedOnVersion = false;
        this.showManageTestCaseUpdate = false;
        this.showEditData = false;
    }
    landScriptPage() {
        if (this.unSavedChangesExistsReuse()) {
            return;
        }
        this.itISOnlyForSave = false;
        this.showFeatureData = false;
        this.showmoduleData = false;
        this.editModule = false;
        this.showTestCase = false;
        this.itISOnlyForSave = false;
        this.itISOnlyNLPUI = false;
        this.nlpEditTestCaseBasedOnVersion = false;
        this.showEditData = false;
        this.showScriptData = true;
        this.showManageTestCaseUpdate = false;
        this.itIsOnlyForEdit = false;
        this.scriptForm.controls.scriptStatus.disable();//To disable Testcase Status field.

        //To clear Text fields.
        this.scriptData = ""
        this.priority = []
        this.type = []
        this.description = "";
        this.scriptStatus = '';
        this.requirementName = '';
        //To clear Text fields.
        this.scriptForm.reset()

        this.priortyFetch();
        this.typeFetch();
        this.scriptStatus = 'Manual';


    }
    moduleData: string
    saveModuleData(moduleData) {
        if (this.moduleData == "" || this.moduleData == undefined) {
            alert("Please Fill Mandatory Fields")
        }
        else {
            this.moduleData = ""
            let moduleObject = {
                'moduleName': moduleData,
                'projectId': this.projectId,
                'projectName': this.projectName,
                'exportConfig': this.projectFramework[0].exportConfigInfo
            }
            this.servicekey.allModuleData(moduleObject)
                .subscribe(data => {
                    if (data[0].duplicate) {
                        this.decoratorServiceKey.duplicate_Snackbar('Duplicates not allowed', '', 'duplicate-snackbar')

                    } else {
                        this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')//by shivakumar
                        this.pass();
                        this.showmoduleData = false;
                    }
                });
        }
    }

    updateModuleData(moduleData) {
        if (this.moduleData == "" || this.moduleData == undefined) {
            alert("Please Fill Mandatory Fields")
        }
        else {
            this.moduleData = ""
            let moduleObject = {
                'updateName': moduleData,
                'moduleName': this.clickedModule,
                'projectId': this.projectId,
                'moduleId': this.moduleId
            }
            this.servicekey.updateModule(moduleObject)
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
            let obj = {
                'updateName': featureData,
                'featureName': this.clickedFeature,
                'featureId': this.featureId,
                'projectId': this.projectId
            }
            this.servicekey.updateFeature(obj)
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
            this.featureData = ""
            let featureObject = {
                'moduleName': this.clickedModule,
                'featureName': featureData,
                'projectId': this.projectId,
                'projectName': this.projectName,
                'exportConfig': this.projectFramework[0].exportConfigInfo
            }
            this.servicekey.allFeatureData(featureObject)
                .subscribe(data => {
                    this.priortyFetch();
                    this.typeFetch();
                    this.openFeatureMenu(this.clickedModule, this.clickIndex)
                    console.log(data)
                    if (data[0].duplicate) {
                        this.decoratorServiceKey.duplicate_Snackbar('Duplicates not allowed', '', 'duplicate-snackbar')
                    } else {
                        this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')//by shivakumar
                        this.showFeatureData = false;
                        this.pass();
                    }
                });
        }
    }

    scriptData: string
    saveScriptData(scriptData, priority, type, time, defaultBrowser, defaultVersion, requirementName, description, scriptStatus, ipAddress) {
        if (time == undefined || defaultBrowser == undefined || defaultVersion == undefined) {
            time = this.time1
            defaultVersion = this.defaultVersion1
            defaultBrowser = this.defaultBrowser1
            ipAddress = this.ipAddress1
        }
        this.clickedScript = scriptData;
        if (this.scriptData == "" || this.scriptData == undefined) {
            alert("Please Fill Mandatory Fields")
        }
        else {
            this.scriptData = ""
            this.priority = []
            this.type = []
            this.description = "";
            this.scriptStatus = '';
            this.requirementName = '';
            let localRequirement;

            if (requirementName == undefined || requirementName == null || requirementName == "") {
                localRequirement = null
            }
            else {
                localRequirement = this.displayRequirementdataID[0].requirementId;
            }

            let postObj = {
                'scriptName': scriptData,
                'projectId': this.projectId,
                'projectName': this.projectName,
                'moduleName': this.clickedModule,
                'featureName': this.clickedFeature,
                'description': description,
                'priority': priority,
                'type': type,
                'requiremantName': requirementName,
                'time': time,
                'defaultBrowser': defaultBrowser,
                'defaultVersion': defaultVersion,
                'requirementId': localRequirement,
                'scriptStatus': scriptStatus,
                'lastAutomatedExecutionStatus': 'NotExecuted',
                'exportConfig': this.projectFramework[0].exportConfigInfo,
                'ipAddress': ipAddress
            }
            this.servicekey.allScriptData(postObj)
                .subscribe(data => {
                    this.priortyFetch();
                    this.typeFetch();
                    this.openScriptMenu(this.clickedFeature, this.featureId);
                    if (data[0].duplicate) {
                        this.decoratorServiceKey.duplicate_Snackbar('Duplicates not allowed', '', 'duplicate-snackbar')
                    }
                    else {
                        this.showScriptData = false;//to close UI
                        this.configValue = false;
                        this.scriptForm.reset();
                        this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')//by shivakumar  
                        this.pass();
                        this.clickedScript = scriptData;
                        this.iGotScriptID = data[0].scriptId;
                        this.testCaseForNlpEdit();
                    }
                });
        }
    }

    clickedModule: string
    displayFeatureName = []
    clickIndex: number
    dbModuleName: string
    displayFeatures = []
    openFeatureMenu(selectedModule, i) {
        //this.activeModule = selectedModule;
        this.clickIndex = i
        this.clickedModule = selectedModule
        this.editModule = false;
        this.displayScripts = [];
        // this.crumbitems[0] = this.activeModule;
        // this.crumbitems.splice(1, 1);
        // this.crumbitems.splice(2, 1);

        this.servicekey.getModuleFromDb(selectedModule)
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
    openScriptMenu(selectedFeature, featureId) {
        //this.activeFeature = selectedFeature;
        // this.clickFeatureIndex = j
        this.clickedFeature = selectedFeature;
        // this.crumbitems[1] = this.activeFeature;
        // this.crumbitems.splice(2, 1);
        this.servicekey.getFeatureFromDb(selectedFeature, featureId)
            .subscribe(result => {
                this.conditionFeatureName = result;
                this.dbFeatureName = this.conditionFeatureName[0].featureName;
                return this.requirementFetch(this.conditionFeatureName)
            });
    }

    selectedScript(testScriptName) {
        return new Promise((reslove, reject) => {
            // this.activeTestScript = testScriptName;
            this.clickedScript = testScriptName;
            // this.crumbitems[2] = this.activeTestScript;
            this.servicekey.getScriptId(this.clickedScript)
                .subscribe(result => {
                    this.iGotScriptID = result[0].scriptId
                    this.servicekey.checkForNlp(this.iGotScriptID)
                        .subscribe((res) => {
                            this.callNext(res, reslove, reject)
                        })
                })
        })
    }//getScriptIdBasedonScriptName

    callNext(localCheck, reslove, reject) {
        if (localCheck == "Generated From NLP") {
            reslove(this.hideManualStepBtn = false)
        }
        else {
            reslove(this.hideManualStepBtn = true)
        }
    }
    dbrowsers: any;
    resultOfObjectUI: any;
    resultOfGroupsUI: any;
    resultOfActionListUI: any;
    actionListMatchingMethod: any;
    resultOfPageNameUI: any;
    displayActionArrayData = [];
    sameAsActionLIst: any;
    actionTestNgKey: any;
    addDataInBetweenIndex: number;
    addNlpDataInBetweenRow;
    addRowAboveOnly: boolean;

    // sendValueToReusableComponent() {
    //     this.spreed.sendToOtherComp("i am Yashwanth")
    // }

    private content: string;
    public query: string;
    typeFetch() {
        this.servicekey.typeDetails()
            .subscribe(typeData => {
                this.type = typeData; console.log(this.type)
            });
    }
    priortyFetch() {
        this.servicekey.priorityDetails()
            .subscribe(priorityData => {
                this.priority = priorityData;
                console.log(this.priority)
            });
    }

    hidedataListTag;

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

    formTableButton() {
        if (this.spreedSheetGenerate.invalid) {
            return;
        }
        this.tableForm.resetForm();
    }

    addData() {
        if (this.manualSelectedForEdit !== undefined && this.manualSelectedForEdit !== '') {
            this.disableAddBtn = true;
            this.hideForNow = true;
            this.disableUpdateBtn = false;

            this.addDataInBetweenIndex = this.manualSelectedForEdit;
            if (this.manualSelectedForEdit === 0) {
                document.getElementById("openModalButton").click();
            }
            else if (this.manualSelectedForEdit != 0) {
                this.displayActionArrayData.splice(this.manualSelectedForEdit + 1, 0, {
                });
            }
            this.manualSelectedForEdit = '';
        }
        else {
            return this.nlpUIFun.userAlert()
        }

    }////adding default row 

    addrowAboveNlp() {
        this.addRowAboveOnly = true;
        this.displayNlpArrayData.splice(0, 0, {});
    }
    addrowBelowNlp() {
        this.displayNlpArrayData.splice(1, 0, {});
    }

    addrowAbove() {
        this.addRowAboveOnly = true;
        this.displayActionArrayData.splice(0, 0, {});

    }//addrowAbove
    addrowBelow() {
        this.displayActionArrayData.splice(1, 0, {});
    }//addrowBelow

    addRowInBetween(addRowBetweenData) {
        this.disableAddBtn = false;
        var addDataOnIndexBased = _.clone(addRowBetweenData);
        addDataOnIndexBased["Action"] = addDataOnIndexBased.ActionList;
        addDataOnIndexBased["Excel"] = this.iamAddingExcel;
        addDataOnIndexBased["PomObject"] = this.pomObject;
        if (this.addDataInBetweenIndex === 0 && this.addRowAboveOnly === true) {
            this.displayActionArrayData.splice(0, 1, addDataOnIndexBased)
        }
        else {
            this.displayActionArrayData.splice(this.addDataInBetweenIndex + 1, 1, addDataOnIndexBased)
        }
        addRowBetweenData.Groups = '';
        addRowBetweenData.PomObject = ''
        addRowBetweenData.Object = '';
        addRowBetweenData.ActionList = '';
        addRowBetweenData.Page = '';
        addRowBetweenData.Input2 = '';
        addRowBetweenData.Input3 = '';
        addRowBetweenData.ReturnsValue = '';
        this.sameAsActionLIst = '';
        this.addRowAboveOnly = false;
        this.iamAddingExcel = "notExcel";
    }

    disableAddBtn: boolean;
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
        nlpAddDataOnIndexBased["Object"] = this.nlpComObject.objectName;
        nlpAddDataOnIndexBased["PomObject"] = this.nlpComObject.pomObject;
        nlpAddDataOnIndexBased["ClassObject"] = this.classObject;
        nlpAddDataOnIndexBased["nlpDataToCompare"] = nlpDataValueToClear;
        nlpAddDataOnIndexBased["nlpData"] = inputFromUser.nativeElement.innerText;
        nlpAddDataOnIndexBased["Input2"] = this.dataFromTheService.nlpInput2;
        nlpAddDataOnIndexBased["Input3"] = this.dataFromTheService.nlpInput3;
        nlpAddDataOnIndexBased["Excel"] = this.iamAddingExcel;


        if (this.addNlpDataInBetweenRow === 0 && this.addRowAboveOnly === true) {
            this.displayNlpArrayData.splice(0, 1, nlpAddDataOnIndexBased);
            this.displayActionArrayData = this.displayNlpArrayData;
        }
        else {
            this.displayNlpArrayData.splice(this.addNlpDataInBetweenRow + 1, 1, nlpAddDataOnIndexBased)
            this.displayActionArrayData = this.displayNlpArrayData;
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
    /*Logic Description: Not used */
    excelCallCTC() {
        this.testdataService.getExcel(this.projectDetails)
            .subscribe(result => {
                this.excelFileNameCTC = result;
            });
    }
    /*Logic Description: Not used */

    excelOpalFunCall(modalValue) {
        if ((modalValue.excelRow && modalValue.excelFile && modalValue.excelSheet && modalValue.excelCell) != undefined) {
            this.addTestCaseDataToTable.Input2 = modalValue.excelFile + "," + modalValue.excelSheet + "," +
                modalValue.excelRow + "," + modalValue.excelCell;
        }
    }
    iamAddingExcel;
    excelFunction() {
        this.iamAddingExcel = "yesExcel";
    }
    clearExcelValue(modalValue, excelInput) {
        modalValue.excelFile = "";
        modalValue.excelRow = "";
        modalValue.excelSheet = "";
        modalValue.excelCell = "";
        excelInput = "";
    }

    delete(i) {
        alert("Are You Sure...? You Want To Delete This Entry")
        this.displayActionArrayData.splice(i, 1)
    }
    index2: any;
    row(index) {
        this.index2 = index
    }

    disableUpdateBtn: boolean;
    itsOnlyForUpdate: number;
    disableInputFieldOpal: String;
    disableReturnOpal: String;
    disableObjectOpal: String;
    disableInputField3Opal: String;
    iamEditingTheData: boolean;
    makeNlpEditCaseG: any;
    addingNlp: boolean = false;

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
            console.log(this.nlpObject)
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
            this.sameAsActionLIst = this.displayNlpArrayData[this.nlpSelectedForEdit].ActionList;
            this.itsOnlyForUpdate = this.nlpSelectedForEdit;
            this.displayObjectNameOnPage(yashwanthNlp.Page)
        }
        else { return this.nlpUIFun.userAlert() };
    }
    excelName: any;
    excelRow: any;
    excelColumn: any;
    /*Logic Description: Used to edit the Automation Steps*/
    editTestCase(valueForEdit, just, indexForEdit) {
        if (this.manualSelectedForEdit !== undefined && this.manualSelectedForEdit !== '') {
            var yashwanth = _.clone(this.displayActionArrayData[this.manualSelectedForEdit]);
            this.iamEditingTheData = true;
            this.addTestCaseDataToTable = yashwanth;
            this.sameAsActionLIst = this.displayActionArrayData[this.manualSelectedForEdit].ActionList;
            this.itsOnlyForUpdate = this.manualSelectedForEdit;
            this.displayingActionListForUserEdit(yashwanth);
            this.disablingTheButtonOnActionList(yashwanth);
            this.displayObjectNameOnPage(yashwanth.Page)
            if (yashwanth.Groups == "Validation") {
                this.variableDatatype = yashwanth.VariableDataType;
                this.methodDataType = yashwanth.InputType;
                this.filterVariableForValidation()
            }
            this.disableUpdateBtn = true;
            this.disableAddBtn = false;
            this.manualSelectedForEdit = '';
        }
        else { return this.nlpUIFun.userAlert() }
    }

    displayingActionListForUserEdit(editedActionList) {
        this.resultOfGroupsUI.forEach(element => {
            if (element.groupName === editedActionList.Groups) {
                var obj = {
                    'groupId': element.groupId,
                    'projectId': this.projectId
                }
                this.servicekey.getActionListOnGroupIdServiceCall(obj).subscribe(
                    resultOfActionList => {
                        this.resultOfActionListUI = resultOfActionList;
                    })
            }
        });
    }

    hideDataList;
    itsForDisplayNlp;
    displayNlp;
    xx;
    a1;
    a2;
    itISOnlyNLPUI;
    datalistCom;
    yashwanthSelect;
    // content;

    /*Logic Description: Used to display the selected Test grammar */
    nlpCallFunction(iGetNlpData, groupInfo, nlpObject) {
        this.displayNlp = true
        this.hideDataList = true;
        this.itsForDisplayNlp = iGetNlpData;
        let localNlp = this.connect.nlpKeyworDispaly(iGetNlpData, groupInfo.result.groupName, nlpObject, this.iamEditingTheData, '', '', '', '', '', groupInfo);
        this.yashwanthSelect = this.connect.checkForOption()
        this.xx = localNlp;
        localNlp = '';
    }

    disablingTheButtonOnActionList(yashwanth) {
        if (yashwanth.Input2 != undefined && yashwanth.Input2 != '') {
            this.disableInputField2 = "yes";
        }
        else {
            this.disableInputField2 = "no";
        }
        // block Scope End
        if (yashwanth.Object != undefined && yashwanth.Object != '') {
            this.disableObject = "yes";
        }
        else {
            this.disableObject = "no";
        }
        // block Scope End
        if (yashwanth.Input3 != undefined && yashwanth.Input3 != '') {
            this.disableInputField3 = "yes";
        }
        else {
            this.disableInputField3 = "no";
        }
        // block Scope End
        if (yashwanth.ReturnsValue != undefined && yashwanth.ReturnsValue != '') {
            this.disableReturn = "yes";
        }
        else {
            this.disableReturn = "no";
        }
        // block Scope End
    }

    /*Logic Description:Used to Update the test grammar after edition is completed */
    updateNlpTestCaseAfterEdit(inputFromUserAfter) {
        var updateNlpGrammar = _.clone(this.displayNlpArrayData[this.nlpSelectedForEdit]);
        this.dataFromTheService = this.connect.nlpArraySeperate(inputFromUserAfter, updateNlpGrammar.nlpDataToCompare, updateNlpGrammar, this.iamEditingTheData);
        console.log(this.dataFromTheService)
        if (this.iamEditingThePomObject === true) {
            updateNlpGrammar.Page = this.nlpPage
            updateNlpGrammar.Object = this.nlpComObject.objectName
            updateNlpGrammar.PomObject = this.nlpComObject.pomObject
        }
        if (this.displayNlpArrayData[this.nlpSelectedForEdit].MultiStep === true) {
            //    if(this.displayNlpArrayData[this.nlpSelectedForEdit].Input2.includes("Sheet1") == false){
            updateNlpGrammar.Excel = this.iamAddingExcel;
            //  }
        }
        updateNlpGrammar.Excel = this.iamAddingExcel;
        updateNlpGrammar.nlpData = inputFromUserAfter.nativeElement.innerText;
        updateNlpGrammar.ReturnsValue = this.dataFromTheService.nlpReturnValue;
        updateNlpGrammar.Input2 = this.dataFromTheService.nlpInput2;
        updateNlpGrammar.Input3 = this.dataFromTheService.nlpInput3;
        updateNlpGrammar.params = this.dataFromTheService.params
        // updateNlpGrammar.MultiStep = false;
        // updateNlpGrammar["Excel"] = this.iamAddingExcel; 
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
        this.displayActionArrayData = this.displayNlpArrayData;
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

    updateTestCaseAfterEdit(a) {
        this.hideForNow = true;
        var newName = _.clone(a);
        if (this.iamEditingThePomObject === true) {
            newName["PomObject"] = this.pomObject
        }
        newName["Excel"] = this.iamAddingExcel
        newName["Action"] = a.ActionList;
        this.displayActionArrayData.splice(this.itsOnlyForUpdate, 1, newName)
        this.sameAsActionLIst = '';
        this.disableUpdateBtn = false;
        this.iamEditingTheData = false;
        this.iamEditingThePomObject = false;
        this.iamAddingExcel = "notExcel";
        a.Groups = '';
        a.ActionList = '';
        a.Action = '';
        a.ReturnsValue = '';
        a.Page = '';
        a.Object = '';
        a.PomObject = '';
        a.Input2 = '';
        a.Input3 = '';
        a.Excel = '';
        // b ='';
    }

    /*Logic Description: Used to check the duplicates variable, fucntion does not allow to declare the variable of same name */
    checkVariableDup(variableFromUi, variableIndex) {
        let keywordMatch = this.ctcvalid.javaKeyWords.includes(variableFromUi);
        if (keywordMatch) {
            this.allowToSaveVariable = true;
            // this.validationMessage = `Java Keywords are Not Allowed`;
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
                        // this.validationMessage = `Duplicate Variables are Not Allowed`;
                        this.hideValidation('Duplicate Variables are Not Allowed');
                        return this.variableObjectDeclr[variableIndex].variableAddFun = '';
                    }
                }
            })
        }
    }//checkVariableDup

    variableAddFun() {
        this.variableObjectDeclr.push({})
    }

    deleteVariable(indexOfVariable) {
        this.variableObjectDeclr.splice(indexOfVariable, 1)
    }

    openpopup(scriptData, priorityData, typeData) {
        if (scriptData == undefined || scriptData == '') {
            alert("please Enter Script Name");
            this.modal1 = 0;
            return;
        }
        if (priorityData == undefined) {
            alert("please Select Priority");
            this.modal1 = 0;
            return;
        }
        if (typeData == undefined || typeData == '') {
            alert("please Select Type");
            this.modal1 = 0;
            return;
        }
        if (typeData != undefined && scriptData != undefined && priorityData != '' && priorityData != undefined) {
            this.modal1 = 1;
            this.createTestConfig(this.modal1, scriptData)
        }
    }// validating the popup while creating the config in testCase

    createTestConfig(modalvalidating, scriptData) {
        if (modalvalidating === 1) {
            this.servicekey.getTestScriptconfigScriptLevel(this.projectId, scriptData)
                .subscribe(result => {
                    if (result) {
                        this.time = result[0].scriptConfigdata.time;
                        this.defaultBrowser = result[0].scriptConfigdata.defaultBrowser;
                        this.defaultVersion = result[0].scriptConfigdata.defaultVersion;
                        this.ipAddress = `http://192.168.99.100:4444`
                    } else {
                        this.servicekey.getprojectconfigScriptLevel(this.projectId)
                            .subscribe(result => {
                                this.projectConfig = result;
                                this.time = this.projectConfig.settimeOut;
                                this.defaultBrowser = this.projectConfig.defaultBrowser;
                                this.defaultVersion = this.projectConfig.defaultVersion;
                                this.ipAddress = `http://192.168.99.100:4444`
                            });
                    }
                    this.configValue = true;
                });
        }
    }// creating the config file

    getBrowser() {
        this.servicekey.getBrowserInfo()
            .subscribe(result => {
                this.dbrowsers = result;
            });
    }// getting the browser 

    allversions: any;
    selectionversion: any
    getversion(browser) {
        this.servicekey.versions(browser)
            .subscribe(result => {
                this.allversions = result;
                this.selectionversion = this.allversions[0].version;
            });
    }// getting the version on selecting the browserName

    igotUploadedApkInfo: any;
    /*Logic Description: Used to get the installed APk name which is required to run the appium Scripts*/
    getUploadedApkName() {
        this.servicekey.getUploadedApkName()
            .subscribe((resp) => {
                this.igotUploadedApkInfo = resp;
            })
    }

    /*Logic Description: Used to save the variable that are required to  script execution*/
    savevariable() {
        let res: object
        res = this.ctcvalid.varDeclareValid(this.variableObjectDeclr);
        if (res['state']) {
            document.getElementById('dismissBTN').click();
            this.variablObjectForStrore = {
                allVaraiableInfo: this.variableObjectDeclr,
                scriptIdForVariableSave: this.activeTestScriptId,
                ifrequiredUse: this.conditionFeatureName
            }
            this.servicekey.saveVariableServiceCall(this.variablObjectForStrore)
                .subscribe(
                    () => this.filterVariableForValidation()
                );
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


    // openVariableModal(){
    //     this.dialog.open(VariableModalComponent)
    // }
    resultOfVariableData: any;
    toCheckTheArrayVariable;

    getVaraiableByDefault() {
        console.log(this.activeTestScriptId)
        this.servicekey.getVaraiableByDefaultServiceCall(this.activeTestScriptId)
            .subscribe(variableData => {
                if (variableData[0].scriptVariableArray != null || variableData[0].scriptVariableArray != undefined) {
                    this.variableObjectDeclr = variableData[0].scriptVariableArray;
                }
                else {
                    this.variableObjectDeclr = [];
                }
            })
    }//getVaraiableByDefault

    loginDetails: any;
    todaydate: any;
    currentTime: any;
    apkNameToFetch;
    userApkInfo;
    dispalyResToUiTable;
    dbmachine2;
    video: boolean;
    executionStatus: boolean = false;
    /*Logic Description: Fetch the details of docker which are required to script execution;
    if the framework is appium the function displays the blocked devices list 
    else it will gives details of docker like vnc port number 
    */
    dockerIpPort() {
        
        if (this.uiProjectFrameWork === 'Appium') {
            this.displayActionArrayData.forEach((element) => {
                if (element.Action === "OpenApplication") {
                    this.apkNameToFetch = element.Input2;
                }
            })
            let UserName = sessionStorage.getItem('importedDetails');
            let parsedUserName = JSON.parse(UserName);
            this.loginDetails = parsedUserName;
            this.todaydate = new Date().toISOString().substr(0, 10)
            var HH = new Date().getHours();
            var MM = "00";
            this.currentTime = HH + ":" + MM;
            this.servicekey.displayDevicesInfoForExce(this.loginDetails[0].userId, this.currentTime, this.todaydate, "meeHappyDevelopemnt.apk")
                .subscribe((result) => {
                    console.log(result)
                    if (result.length === 0) {
                        alert("No devices Found")
                    }
                    else {
                        document.getElementById("appiumScriptRunConfig").click();
                        this.userApkInfo = result;
                        this.dispalyResToUiTable = this.userApkInfo[0].result;
                        this.toDisableRunBtn = false;
                        this.toDisableViewReport = false;// To enable view report button
                    }
                })

        }
        else if (this.uiProjectFrameWork === 'Test NG') {
            this.video = true;
            let licenseId = JSON.parse(sessionStorage.getItem('loginDetails')).licenseId
            let userId = JSON.parse(sessionStorage.getItem('loginDetails')).userId
            let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
            let objectData = {};
            objectData["moduleName"] = this.activeModule;
            objectData["featureName"] = this.activeFeature;
            objectData["scriptName"] = this.activeTestScript;
            objectData["moduleId"] = this.moduleId;
            objectData["featureId"] = this.featureId;
            objectData["scriptId"] = this.iGotScriptID;
            objectData["projectName"] = this.projectDetails;
            objectData["userName"] = sessionStorage.getItem('userName');
            objectData["exportConfig"] = this.projectFramework[0].exportConfigInfo;
            objectData["generateJmxFile"] = false;
            objectData["userId"] = userId;
            objectData["licenseId"] = licenseId;
            objectData["orgId"] = orgId;

            this.executionStatus = true;

            // this.http.post(this.api.apiData + '/ipForNewCreateTestCase', objectData)
            //     .map((response: Response) => <Post[]>response.json())

            this.servicekey.generateBatchNXmlFile(objectData)
                .subscribe(result => {
                    this.dbmachine2 = result;
                    //user story 3 VNC port concept start here by ANIL


                    var objDocker = {};
                    objDocker["userId"] = userId;
                    objDocker["projectName"] = this.projectDetails;
                    objDocker["moduleName"] = this.activeModule;
                    objDocker["featureName"] = this.activeFeature;
                    objDocker["scriptName"] = this.activeTestScript;
                    objDocker["moduleId"] = this.moduleId;
                    objDocker["featureId"] = this.featureId;
                    objDocker["scriptId"] = this.iGotScriptID;

                    objDocker["userName"] = sessionStorage.getItem('userName');
                    // objDocker["vncPort"] = result[0].port; 
                    //objDocker["vncPort"] = "32768";
                    objDocker["licenseId"] = licenseId;
                    objDocker["orgId"] = orgId;
                    this.servicekey.dockerIpPortServiceCall(objDocker).subscribe(
                        result => {
                            console.log("YASHWANTH")
                            // let url = "/../serverSide/uploads/dockerExcecutionDependency/vnc.html";
                            let url = "/uploads/dockerExcecutionDependency/vnc.html";
                            console.log(url);
                            this.dockerPath09 = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                            // console.log(this.dockerPath09,"!@#$%^&*");
                            document.getElementById("activateDockerButton").click();

                            let tempObj = {
                                "userName": sessionStorage.getItem('userName'),
                                "projectName": this.projectDetails,
                                "scriptName": this.activeTestScript,
                                "projectId": this.projectId,
                                "scriptId":this.iGotScriptID
                            }
                            //this.openFullscreen();
                            this.servicekey.startScriptExecutionServiceCall(tempObj).subscribe((data) => {
                                this.closeFullscreen();
                                this.spinnerPercent = '';
                                this.spinnerVal = "Generating Report..."
                                this.SpinnerService.show();
                                document.getElementById("runBtn").innerHTML = 'Run'
                                this.servicekey.viewConsoleLogic(tempObj).subscribe((result)=>{
                                    this.consoleData=result;
                                })
                                this.servicekey.deleteScriptAfterExceution(tempObj).subscribe(() => { })
                                if (data == "compilationError") {
                                    this.servicekey.compilationErrLogic(tempObj).subscribe((data) => {
                                        this.completeTrackReport = data;
                                        this.typeofError = false;
                                        this.toDisableRunBtn = false;
                                        this.toDisableViewReport = false;// To enable view report button
                                        this.executionStatus = false;
                                        this.SpinnerService.hide();
                                        this.dialogService.dockerDialog('Script Failed due to Compilation Error. To View Exceution Report,Click On View Report Button').afterClosed().subscribe(res => {
                                        })
                                    })
                                } else {
                                    this.convertXmlToJsonFile()//to Extract script execution report and display to user .
                                }
                            })
                        });
                }); //this.http
        }
        else { }
    }//dockerIpPor

    timeLeft: number = 25;
    interval;
    stopExecution: boolean;
    startTimer() {
        this.stopExecution = true;
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                if (this.timeLeft == 0) {
                    // document.getElementById("activateDockerButton").click();
                    return this.pauseTimer()
                }
            } else {
                this.timeLeft = 25;
            }
        }, 1000)
    }

    pauseTimer() {
        clearInterval(this.interval);
        this.timeLeft = 25;
        this.stopExecution = false;
    }
    devicesIdForExcecution;
    //    editTestCase;
    editTestCase1: any;
    versionID: any;
    iGotVersionIdEasily: any;
    latestVersionId: any;
    iamCapturingCompleteResult: any;
    // itISOnlyForEdit: boolean;
    // showManual:boolean;
    nlpEditTestCaseBasedOnVersion;
    activeTestScriptId;// //Contains Id of Script Whose content is being displayed in the UI.
    activeJmxStatus: any;
    
    testCaseForNlpEdit() {
        console.log('3')
        this.nlpEditTestCaseBasedOnVersion = true;
        this.itIsOnlyForEdit = false;
        this.showEditData = false;
        this.itISOnlyForSave = false;
        this.showTestCase = false;
        this.itISOnlyNLPUI = false;
        this.showmoduleData = false;
        this.showFeatureData = false;
        this.showScriptData = false;
        this.showManageTestCaseUpdate = false;
        this.editModule = false;

        this.activeJmxStatus = this.jmxStatus;
        this.activeTestScriptId = this.iGotScriptID;
        this.activeTestScript = this.clickedScript
        this.activeModule = this.clickedModule;
        this.activeFeature = this.clickedFeature;
        this.crumbitems[0] = `${this.activeModule}(${this.moduleId})`;
        this.crumbitems[1] = `${this.activeFeature}(${this.featureId})`;
        this.crumbitems[2] = `${this.activeTestScript}(${this.iGotScriptID})`;
        // this.testCaseForEdit();
        this.addingNlp = false;
        this.closeFullscreen();
        this.toDisableViewReport = true;
        
        //this.nlpClear();
        //if(this.securityTest == true){
        //this.getZapNlpGrammer();
        //}
        //else{
         //   this.getNlpGrammer();
        //}
        this.getPageNameByDefault(this.projectId);
        this.getVaraiableByDefault();
        if (this.multiDropDown == true) {
            const ele1 = document.getElementById("checkMulti") as HTMLInputElement;
            ele1.checked = false;
            this.multiDropDown = false;
        }
        return this.getEditTestCaseValueCommon();
    }

    checkIfScriptLocked(mode: string) {
        console.log('1')
        if (this.unSavedChangesExistsReuse()) {
            this.SpinnerService.hide();
            return;
        }
        this.scriptData = '';
        this.priorityData = '';
        this.typeData = '';
        this.description = '';
        this.scriptStatus = '';
        this.requirementName = '';

        let obj = {
            "projectId": this.projectId,
            "scriptId": this.iGotScriptID,
            "userName": sessionStorage.getItem('userName'),
            "userId": sessionStorage.getItem('userId')
        }

        this.servicekey.checkIfScriptLockedService(obj).subscribe((result) => {
            if (result["beingUsedBy"] == "lockedNow") {
                console.log('2')
                if (mode == "Manual Steps") {
                    this.testCaseForNlpEdit();
                    this.SpinnerService.hide();
                }
                else {
                    this.editScriptPage();
                }
            } else {
                this.itISOnlyNLPUI = false;
                this.nlpEditTestCaseBasedOnVersion = false;
                this.showScriptData = false;
                this.showEditData = false;
                this.SpinnerService.hide();
                this.crumbitems.splice(2, 1);
                this.dialogService.dockerDialog(`${result["beingUsedBy"]} is working on it, Script will be available as soon as current user releases it `)
                    .afterClosed().subscribe(res => {
                        this.activeTestScriptId = undefined;
                        this.activeTestScript = undefined;
                    })
            }
        })
    }

    testCaseForEdit() {
        this.itIsOnlyForEdit = true;
        this.nlpEditTestCaseBasedOnVersion = false;
        this.itISOnlyForSave = false;
        this.itISOnlyNLPUI = false;
        this.itISOnlyForSave = false;
        this.showEditData = false;
        this.showmoduleData = false;
        this.showFeatureData = false;
        this.showScriptData = false;
        this.activeTestScriptId = this.iGotScriptID;

        this.getGrouprsAutoCall();
        this.getPageNameByDefault(this.projectId);
        this.getVaraiableByDefault();
        return this.getEditTestCaseValueCommon();
    }

    jmxFile: any;
    newVersionId: any;
    getEditTestCaseValueCommon() {
        console.log('4')
        this.variableObjectDeclr = [];
        this.servicekey.getTestCaseForEdit(this.activeTestScriptId)
            .subscribe(result => {
                console.log(result)
                
                this.dataOfData = result[0]
                this.jmxFile = result[0].jmxFile;
                if(result[0].compeleteArray !== undefined && result[0].compeleteArray[result[0].compeleteArray.length-1].securityTesting == true){
                    console.log('4.1')
                    this.commentsecure.commentChecked = true;
                    this.getZapNlpGrammer();

                }
                else{
                    console.log('4.2')
                    this.commentsecure.commentChecked = false;
                    this.getNlpGrammer();
                }
                // if(this.dataOfData.scriptStatus === 'Automated'){this.readyForAutomatoion = true; }
                // else this.readyForAutomatoion = false

                if (result[0].compeleteArray !== undefined) {
                    // this.variableObjectDeclr = result[0].scriptVariableArray;
                    this.iamCapturingCompleteResult = result;
                    this.iGotVersionIdEasily = result[0].compeleteArray;

                    result[0].compeleteArray.forEach((myArray, index, arr) => {
                        if (this.itIsOnlyForEdit == true) {
                            this.displayActionArrayData = myArray.allObjectData.allActitons;
                            this.itIsOnlyForEdit = true;
                        }
                        if (this.nlpEditTestCaseBasedOnVersion == true) {

                            if (myArray.allObjectData.allActitons[0].nlpData !== 'itsFromAutomation') {
                                this.nlpEditTestCaseBasedOnVersion = true;
                                this.displayNlpArrayData = myArray.allObjectData.allActitons;
                                if (this.displayNlpArrayData.length >= 2) {
                                    if (index == arr.length - 1) {
                                        this.enableDragger = true;
                                        //  this.dragTable(this.displayNlpArrayData);
                                    }
                                } else this.enableDragger = false;
                            }
                            else {
                                return this.displayNlpArrayData = [];
                            }
                        }
                    });
                    for (let h = 0; h < result[0].compeleteArray.length; h++) {
                        if (result[0].compeleteArray[result[0].compeleteArray.length - 1]) {
                            this.latestVersionId = result[0].compeleteArray[result[0].compeleteArray.length - 1].allObjectData.versionId;
                        }
                    }
                    this.newVersion = true;
                    this.newVersionId = this.latestVersionId
                }
                else {
                    // alert("Script are Not Generated")
                    this.displayActionArrayData = [];
                    this.enableDragger = false;
                    this.latestVersionId = '';
                    this.iGotVersionIdEasily = [];
                    this.displayNlpArrayData = []
                    this.toDisableRunBtn = true; //used to disable run button
                    if (this.itIsOnlyForEdit == true) {
                        this.itISOnlyForSave = true;
                        this.itIsOnlyForEdit = false;
                    }
                    if (this.nlpEditTestCaseBasedOnVersion) {
                        this.itISOnlyNLPUI = true;
                        this.nlpEditTestCaseBasedOnVersion = false;
                    }
                }
                this.SpinnerService.hide();
            })
    }

    newVersion: boolean = true;
    getScriptByVersionIDForNLP(getScriptByVersionID) {
        let actionDetails = this.iamCapturingCompleteResult[0].compeleteArray.filter(feature => feature.allObjectData.versionId === parseInt(getScriptByVersionID));
        this.displayNlpArrayData = actionDetails[0].allObjectData.allActitons;
        if (getScriptByVersionID == this.newVersionId) {
            this.newVersion = true;
        }
        else {
            this.newVersion = false;
        }
    }

    getScriptByVersionIDAuto(getScriptByVersionIDAuto) {
        let actionDetails = this.iamCapturingCompleteResult[0].compeleteArray.filter(feature => feature.allObjectData.versionId === parseInt(getScriptByVersionIDAuto));
        this.displayActionArrayData = actionDetails[0].allObjectData.allActitons;

    }

    generateTestNgForAppium(mobileId) {
        this.devicesIdForExcecution = mobileId;
    }

    startAppiumExcecution() {
        // alert("startAppiumExcecution")
        let objectData = {};
        let combinedObj = {}

        objectData["moduleName"] = this.moduleId;
        objectData["featureName"] = this.featureId;
        objectData["scriptName"] = this.iGotScriptID;
        objectData["projectName"] = this.projectDetails;
        objectData["userName"] = sessionStorage.getItem('userName')
        
        this.userApkInfo.forEach(element => {
            if (element.DeviceId === this.devicesIdForExcecution) {
                combinedObj["appiumProject"] = objectData;
                combinedObj["testNgXmlData"] = element;

                console.log(combinedObj)
                this.servicekey.generateTestNgForAppium(combinedObj)
                    .subscribe((resp) => {

                    })
            }

        })

    }

    validateExcel(fileInput: any) {
        this.excelFilesToUpload = <Array<File>>fileInput.target.files;
    }

    uploadImporetdFile(filePath) {
        console.log(filePath)
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
    /*Logic Description: Used to upload the excel file under project folder inside Excel*/
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
                            this.decoratorServiceKey.saveSnackbar('Uploaded Successfully', '', 'save-snackbar')
                            document.getElementById('importModal').click();
                            return this.spreedSheetForm.reset();
                        })
                }
            }, (error) => {
                alert("Error Occurred" + error)
            });

    }
    excelFilesToUpload;

    fileChangeEvent(fileInput: any) {
        this.excelFilesToUpload = <Array<File>>fileInput.target.files;
    }


    // upload excel end
    /*Logic Description: Fetches the Page name by deafault when the page loads */
    getPageNameByDefault(projectIdForPageFetch) {
        // let proid=this.projectId
        this.servicekey.getPageNameByDefaultServiceCall(projectIdForPageFetch).subscribe(
            resultOfPageName => {
                this.resultOfPageNameUI = resultOfPageName;
                this.resultOfPageNameUI.sort((a, b) => a.pageName.localeCompare(b.pageName))
            })
    }//getPageNameByDefault
    displayNlpGrammarToUi;
    browserNlpGrammar = [];
    objectNlpGrammar = [];
    keyNlpGrammar = [];
    /*Logic Description: Fetches all the grammar Present in actionList collection */
    getNlpGrammer() {
       this.browserNlpGrammar = [];
       this.objectNlpGrammar = [];
       this.keyNlpGrammar = [];
        this.servicekey.getNlpGrammar(this.projectId)
            .subscribe((res) => {
                console.log(res)
                this.displayNlpGrammarToUi = res;
                res.forEach(element => {
                    if (element.groupId == "group01") {
                        this.browserNlpGrammar.push(element)
                    }
                    else if (element.groupId == "group02") {
                        this.objectNlpGrammar.push(element)
                    }
                    else if (element.groupId == 'group03') {
                        this.keyNlpGrammar.push(element)
                    }
                })
                console.log(this.browserNlpGrammar)
                console.log(this.objectNlpGrammar)
            })
    }
    getZapNlpGrammer() {
        this.browserNlpGrammar = [];
        this.objectNlpGrammar = [];
        this.keyNlpGrammar = [];
        this.servicekey.getZapNlpGrammar(this.projectId)
            .subscribe((res) => {
                console.log(res)
                this.displayNlpGrammarToUi = res;
                res.forEach(element => {
                    if (element.groupId == "group01") {
                        this.browserNlpGrammar.push(element)
                    }
                    else if (element.groupId == "group02") {
                        this.objectNlpGrammar.push(element)
                    }
                    else if (element.groupId == 'group03') {
                        this.keyNlpGrammar.push(element)
                    }
                })
                console.log(this.browserNlpGrammar)
                console.log(this.objectNlpGrammar)
            })
    }
    assignToNlpObject;
    validationMessage: any;

    /*Logic Description: lconsits of logic required to display the Selected Grammar With edit and color code  */
    getDocOnNlp(nlpForUser, nlpObject) {
        console.log("hahah")
        console.log(nlpForUser)
        console.log(nlpObject)
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
        console.log("hahahbb")
        this.nlpObject.nlpData = ''
    }

    hideValidation(validationMessage: String) {
        this.validationMessage = validationMessage;
        setTimeout(() => {
            this.allowToSave = false;
            this.allowToSaveVariable = false;
        }, 3000)
    }

    getGrouprsAutoCall() {
        this.servicekey.getGrouprsAutoServiceCall().subscribe(
            resultOfGroups => {
                this.resultOfGroupsUI = resultOfGroups;
            })
    }//getGrouprsAutoCall

    getActionListOnGroupId(groupIdforActionList) {
        if (this.iamEditingTheData === true) {
            this.clearUiValue();
        }
        this.resultOfGroupsUI.forEach(element => {
            // this.notToRemoveGroup();
            if (element.groupName === groupIdforActionList) {
                var obj = {
                    'groupId': element.groupId,
                    'projectId': this.projectId
                }
                this.servicekey.getActionListOnGroupIdServiceCall(obj).subscribe(
                    resultOfActionList => {
                        this.resultOfActionListUI = resultOfActionList;
                    })
            }
        });
    }//getActionListOnGroupId
    nlpPage;
    displayObjectNameOnPage(newPage) {
        this.nlpPage = newPage;
        this.resultOfPageNameUI.forEach(pageObj => {
            if (pageObj.pageName === newPage) {
                this.resultOfObjectUI = pageObj.objectName;
            }
        });
    }//displayObjectNameOnPage
    iamEditingThePomObject: boolean;
    yashwanth: boolean;
    nlpComObject;
    getPomObjectOnObject(objectForPom) {
        if (this.iamEditingTheData === true) {
            this.iamEditingThePomObject = true;
        }

        this.resultOfObjectUI.forEach(forPom => {
            if (forPom.objectName === objectForPom) {
                this.pomObject = forPom.pomObject;
                this.nlpComObject = forPom;
                return this.nlpPomChangesCall(this.nlpComObject)
            }
        });
    }

    nlpPomChangesCall(nlpPomObject) {

        var pomChanged = _.clone(this.displayNlpArrayData[this.nlpSelectedForEdit]);
        // this.xx = this.connect.nlpPomChangeFun(pomChanged,nlpPomObject)
        // // console.log(pomChanged)
        // // console.log(nlpPomObject)
        this.xx = this.connect.nlpKeyworDispaly(pomChanged.nlpDataToCompare, pomChanged.Groups, pomChanged.Object, this.iamEditingTheData, pomChanged.Input2, pomChanged.Input3, pomChanged.ReturnsValue, '', nlpPomObject.objectName, '')

    }
    disableReturn: any;
    disableObject: any;
    disableInputField3: any
    disableInputField2: any
    newArray = [];
    onlyReturnReuseFunc = [];
    displayForReturnReuse: boolean;
    requiredStepValid;

    displayActionMethodNameOnActionList(displayActionMethodName, actionGroupName) {
        this.addTestCaseDataToTable.ReturnsValue = '';
        this.displayForReturnReuse = false;
        if (this.iamEditingTheData === true) {
            this.addTestCaseDataToTable.Input2 = '';
            this.addTestCaseDataToTable.Excel = '';
            this.addTestCaseDataToTable.Input3 = '';
            this.addTestCaseDataToTable.Object = '';
            this.addTestCaseDataToTable.Page = '';
            this.addTestCaseDataToTable.PomObject = '';
            this.addTestCaseDataToTable.ReturnsValue = '';

        }
        if (actionGroupName !== "User Function") {
            this.servicekey.getActionMethodOnActionListServiceCall(displayActionMethodName).subscribe(
                resultOfActionMethod => {
                    this.requiredStepValid = resultOfActionMethod // required for validating Each step created
                    this.disableReturn = resultOfActionMethod[0].returnValue;
                    this.disableObject = resultOfActionMethod[0].object;
                    this.disableInputField2 = resultOfActionMethod[0].inputField2;
                    this.disableInputField3 = resultOfActionMethod[0].inputField3;
                    this.sameAsActionLIst = resultOfActionMethod[0].actionList;
                    this.actionTestNgKey = resultOfActionMethod[0].testNgKey;
                    this.actionListMatchingMethod = resultOfActionMethod[0].matchingMethodName;
                    this.variableDatatype = resultOfActionMethod[0].datatype;
                    this.methodDataType = resultOfActionMethod[0].inputType;
                    if (actionGroupName === "Validation") {
                        this.filterVariableForValidation();
                    }
                })
        }
        else if (actionGroupName === "User Function") {
            this.newArray = [];
            this.resultOfActionListUI.forEach(e => {
                if (e.actionList === displayActionMethodName) {
                    if (e.reuseableData.returnType !== '' && e.reuseableData.checkBoxValue !== '') {
                        this.disableReturn = 'yes';
                        e.reuseableData.returnType;
                        this.onlyReturnReuseFunc = _.clone(this.variableObjectDeclr);
                        this.onlyReturnReuseFunc.forEach((ele) => {
                            if (ele.variableType === e.reuseableData.returnType) {
                                this.displayForReturnReuse = true;
                                var obj0099 = {}
                                obj0099["variableAddFun"] = ele.variableAddFun;
                                this.newArray.push(obj0099);
                                this.onlyReturnReuseFunc = this.newArray;
                            }
                        })
                    }
                    else {
                        this.disableReturn = 'no';
                        this.displayForReturnReuse = false;
                    }
                    if (e.reuseableData.reuseAbleParameters !== '') {
                        this.disableInputField2 = 'yes';
                    }
                    else {
                        this.disableInputField2 = 'no';
                    }
                    this.sameAsActionLIst = displayActionMethodName;
                    this.addTestCaseDataToTable.Input2 = e.reuseableData.reuseAbleParameters;
                    this.classObject = e.reuseFileName;
                }
            });
        }
        else { }
    }//displayActionMethodNameOnActionList

    displayNlpArrayData = [];
    nlpAdd() {
        if (this.nlpSelectedForEdit !== '' && this.nlpSelectedForEdit !== undefined) {
            this.disableAddBtn = true;
            this.releaseHeaderBtn = true;
            this.enableDragger = false;
            this.addingNlp = true;
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

    nlpDelet() {
        if (this.nlpSelectedForEdit !== '' && this.nlpSelectedForEdit !== undefined) {
            // this.releaseHeaderBtn = true;
            this.dialogService.nlpDialog('Are You Sure...? You Want To Delete This Entry ?')
                .afterClosed().subscribe(res => {
                    console.log(res)
                    if (res) {
                        this.displayNlpArrayData.splice(this.nlpSelectedForEdit, 1);
                        this.nlpSelectedForEdit = '';
                        this.displayActionArrayData = this.displayNlpArrayData;
                        this.releaseHeaderBtn = false;
                        this.addingNlp = false;
                        this.disableAddBtn = false;
                        if (this.displayNlpArrayData.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
                        this.unSavedChangesExits = true;
                    }
                    else {
                        this.nlpSelectedForEdit = '';
                    }
                })
        }
        else { return this.nlpUIFun.userAlert() }
        // alert("Are You Sure...? You Want To Delete This Entry")
    }
    nlpSelectedForEdit;
    highLightNlpEdit(nlpIndex) {
        this.nlpSelectedForEdit = this.nlpUIFun.highLightNlpEditServiceCall(nlpIndex);
    }

    manualSelectedForEdit;
    highLightManualEdit(manualIndex) {
        this.manualSelectedForEdit = this.nlpUIFun.highLightManualEditServiceCall(manualIndex);
    }

    nlpInput2;
    dataFromTheService;

    /*Logic Description: Captures the input,object value from the UI and frames the Input1,Input2,Input3 and 
    pass the call to addNlpData function to display the data to UI*/
    nlpArraySeperate(inputFromUser, nlpDataValueToClear, nlpObjectToClear) {
        console.log('Create from nlpArraySeperate')
        if (this.assignToNlpObject.result.groupName === "User Function") {
            this.classObject = `${this.assignToNlpObject.actionList}Class`;
        }
        this.dataFromTheService = this.connect.nlpArraySeperate(inputFromUser, nlpDataValueToClear, this.assignToNlpObject, this.iamEditingTheData);
        console.log(this.dataFromTheService)
        console.log(this.assignToNlpObject)

        if (this.assignToNlpObject.groupId == "group11") {
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
        else if (this.assignToNlpObject.returnValue !== 'no' || this.assignToNlpObject.actionList === 'If-Start' || this.assignToNlpObject.actionList === 'ElseIf-Start') {
            this.returnValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear)
        }
        else if (this.assignToNlpObject.inputField2 !== 'no' && this.assignToNlpObject.groupId !== "group11") {
            if(this.assignToNlpObject.actionList === 'PrintVariable'){
                this.returnValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear)
            }
            else{
            console.log('h3')
            console.log(inputFromUser)
            console.log(nlpDataValueToClear)
            console.log(nlpObjectToClear)
            this.returnInputValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear)
            }
        }
        else {
            return this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear)
        }
    }

    /*Logic Description: Validation Block which checks and comfirms the Variable is declared or not and throughs the Error Message */

    returnValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear) {
        if (this.variableObjectDeclr.length !== 0) {
            this.variableObjectDeclr.forEach(e => {
                if (e.variableAddFun !== this.dataFromTheService.nlpReturnValue && e.variableAddFun !== this.dataFromTheService.nlpInput2) {
                    this.allowToSave = true;
                    return this.hideValidation('Please Declare Variable');
                }
                else if (e.variableType !== this.assignToNlpObject.datatype && this.assignToNlpObject.datatype !== undefined) {
                    this.allowToSave = true;
                    return this.hideValidation('Please Declare Variable Of Same DataType');
                }
                else {
                    return this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear)
                    // else alert("jai")
                }
            });
        }
        else {
            this.allowToSave = true;
            return this.hideValidation('Please Declare Variable');
        }
    }
    syntaxOP: any;

    /*Logic Description: Validation Block which checks and confirms the Input  is present or not and throughs the Error Message */
    returnInputValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear) {
        if (this.assignToNlpObject.actionList == 'For-Start') {
            this.syntaxOP = this.ctcvalid.forLoopSyntax(this.dataFromTheService.nlpInput2);
            console.log(this.syntaxOP)
            if (this.syntaxOP.Status === true) {
                if (this.variableObjectDeclr.length !== 0) {
                    this.variableObjectDeclr.forEach(e => {
                        if (e.variableAddFun !== this.syntaxOP.variable) {
                            this.allowToSave = true;
                            return this.hideValidation('Please Declare Variable');
                        }
                        else if (e.variableType !== "int") {
                            this.allowToSave = true;
                            return this.hideValidation('Please Declare Variable Of Same DataType');
                        }
                        else {
                            return this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear)
                            // else alert("jai")
                        }
                    });
                }
                else {
                    this.allowToSave = true;
                    return this.hideValidation('Please Declare Variable');
                }
                return this.returnValidation(inputFromUser, nlpDataValueToClear, nlpObjectToClear)
                // return this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear)
            }
            else {
                this.allowToSave = true;
                return this.hideValidation(this.syntaxOP);
            }
        }
        else {
            if (this.dataFromTheService == 'invalid') {
                this.allowToSave = true;
                return this.hideValidation('Please Enter only Numbers');
            }
            else {
                return this.nlpAddToTable(inputFromUser, this.dataFromTheService, nlpObjectToClear, nlpDataValueToClear)
            }
        }
    }
    checkObjeLocallay: any;


    /*Logic Description: its a main  function which is used to add the data to dispaly table after crossing all the 
    validation block this code will executes  */
    async nlpAddToTable(inputFromUser, dataFromTheService, nlpObjectToClear, nlpDataValueToCompare) {
        console.log(this.iamAddingExcel)
        this.checkObjeLocallay = await this.objectAddingKey.crossCheckObj(this.assignToNlpObject, this.nlpPage, this.nlpComObject, this.assignToNlpObject)
        var nlpActionListRowData = {};
        nlpActionListRowData["Groups"] = this.assignToNlpObject.result.groupName;
        nlpActionListRowData["ActionList"] = this.assignToNlpObject.actionList;
        nlpActionListRowData["Action"] = this.assignToNlpObject.actionList;
        nlpActionListRowData["ReturnsValue"] = dataFromTheService.nlpReturnValue;
        nlpActionListRowData["Page"] = this.checkObjeLocallay.Page;
        nlpActionListRowData["Object"] = this.checkObjeLocallay.Object;
        nlpActionListRowData["PomObject"] = this.checkObjeLocallay.PomObject;
        nlpActionListRowData["ClassObject"] = this.classObject;
        nlpActionListRowData["nlpDataToCompare"] = nlpDataValueToCompare;
        nlpActionListRowData["nlpData"] = inputFromUser.nativeElement.innerText;
        nlpActionListRowData["Input2"] = dataFromTheService.nlpInput2;
        nlpActionListRowData["params"] = dataFromTheService.params;
        nlpActionListRowData["Input3"] = dataFromTheService.nlpInput3;
        nlpActionListRowData["Excel"] = this.iamAddingExcel;
        this.displayNlpArrayData.push(nlpActionListRowData);
        this.displayActionArrayData = this.displayNlpArrayData;
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
        console.log(this.displayActionArrayData)
    }

    cancelModule() {
        this.showmoduleData = false;
        this.editModule = false;
        this.showScriptData = false;
        this.showEditData = false;
        this.showFeatureData = false;
        this.editFeature = false;
        this.configValue = false;
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

    /*Logic Description: its a main  function which is used to add the data to dispaly table data  */

    addDataToTable(actionData) {
        console.log('Create from addDataToTable(')
        let res = this.ctcvalid.createStepValidate(this.requiredStepValid, actionData);
        if (res.state) {
            this.hideForNow = true;
            var actionListRowData = {};
            actionListRowData["Groups"] = actionData.Groups;
            actionListRowData["ActionList"] = actionData.ActionList;
            actionListRowData["Action"] = actionData.ActionList;
            actionListRowData["ReturnsValue"] = actionData.ReturnsValue;
            actionListRowData["Page"] = actionData.Page;
            actionListRowData["Object"] = actionData.Object;
            actionListRowData["PomObject"] = this.pomObject;
            actionListRowData["ClassObject"] = this.classObject;
            actionListRowData["InputType"] = this.methodDataType;
            actionListRowData["VariableDataType"] = this.variableDatatype;
            actionListRowData["Input2"] = actionData.Input2;
            actionListRowData["Input3"] = actionData.Input3;
            actionListRowData["nlpData"] = 'itsFromAutomation';
            actionListRowData["Excel"] = this.iamAddingExcel;
            this.displayActionArrayData.push(actionListRowData);

            actionData.Groups = '';
            this.pomObject = ''
            actionData.Object = '';
            actionData.ActionList = '';
            this.actionListMatchingMethod = '';
            actionData.Page = '';
            actionData.Input2 = '';
            actionData.Input3 = '';
            this.actionTestNgKey = '';
            this.sameAsActionLIst = '';
            actionData.ReturnsValue = '';
            this.iamAddingExcel = 'notExcel';
            this.classObject = '';
        } else {
        }

    }

    manualDelete() {
        if (this.manualSelectedForEdit !== undefined && this.manualSelectedForEdit !== '') {
            this.dialogService.nlpDialog('Are You Sure...? You Want To Delete This Entry ?')
                .afterClosed().subscribe(res => {
                    this.displayActionArrayData.splice(this.index2, 1)
                })
            this.manualSelectedForEdit = '';
        }
        else { return this.nlpUIFun.userAlert() }
    }


    allAct: any;
    alAction: Object = {}
    editCTCase: any;
    completeArray = [];
    versionIdCount: any;
    addToNewVersionGlobal: boolean = false;


    addToNewVersion(e, newVersion) {
        alert(newVersion)
        if (e) {
            this.addToNewVersionGlobal = newVersion;
            document.getElementById("commentsSection").click()
        }
        else
            this.addToNewVersionGlobal = newVersion;
    }

    /*Logic Description: api call to get a version from the testScript collection.
    if there is data in completeArray increment version Id by 1 with the length else set it to 1

    Global Variable: this.clickedScript 
    */
    //    get f() { return this.commentSection.controls; }

    modalSave() {
        console.log(this.commentSection.controls.commentsSec.errors)
    }
    actionSave() {
        this.displayActionArrayData = this.displayNlpArrayData;
        if (this.enableDragger) {
            this.enableDragger = false;
        }
        if (this.displayActionArrayData.length !== 0) {//to check whether we have atleast one test step to save
            if (this.activeTestScript === null || this.activeTestScript === undefined || this.activeTestScript === '') {
                alert("Please Select The Script")
                return;
            }
            for (var i = 0; i < this.displayActionArrayData.length; i++) {//to check whether any of the test step is empty
                if (Object.keys(this.displayActionArrayData[i]).length === 0) {
                    alert("Test Step Cannot Be Empty")
                    this.displayActionArrayData.splice(i, 1)
                    this.releaseHeaderBtn = false;
                    if (this.displayNlpArrayData.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
                    return;
                }
            }
            this.servicekey.getServiceVersionIdCount(this.activeTestScript).subscribe(
                resultOfgetServiceVersionIdCount => {
                    this.versionIdCount = resultOfgetServiceVersionIdCount;
                    if (this.versionIdCount != 0) {
                        this.versionIdCount[0].compeleteArray.length;
                        if (this.addToNewVersionGlobal) {
                            this.versionIdCount = (this.versionIdCount[0].compeleteArray.length) + 1;
                        }
                        else { this.versionIdCount = (this.versionIdCount[0].compeleteArray.length) }
                        this.blockScopeValidation(this.versionIdCount)
                        // this.dataPostCall(this.versionIdCount)
                    }
                    else {
                        this.versionIdCount = 1;
                        // this.dataPostCall(this.versionIdCount)
                        this.blockScopeValidation(this.versionIdCount)
                    }
                })
        } else {
            alert('Atleast one Test step is required')
            // this.blockScopeValidation(this.versionIdCount)
        }

    }// getting the version count

    /**Logic Desc: Get the Project Details,version count, allActionArray and
     *  push it to one global Array called this.alAction and pass to createTestpostAllActionsServiceCall function
     * if the call come from create test case i am assgning allAction to dispalyActionArrayData
     * else call from the NLP assgning allAction to displayNlpArrayData
     * i am leaving else block empty for future purpose
     * here i am using two api call which will trigger on framework
     * 
     * Global Variable: alAction,
     */
    versionData: any;
    viewHistory() {
        this.servicekey.viewVersionHistory(this.activeTestScriptId, this.projectId).
            subscribe(res => {
                this.versionData = res;
                document.getElementById('viewHistory').click()

            })
    }//viewHistory end

    blockLevelStatus;

    /**
     Logic Description: Used to validate the if and For blocks, display errror message in case of block errors 
     */
    blockScopeValidation(versionIdCount) {
        var ifCount = 0;
        var forCount = 0;
        // var ifSloved = false;
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
                // alert("if not closed")
                this.allowToSave = true;
                return this.hideValidation(`Sorry Block Error...!!! If Block is not Closed Properly`);
            }
            else if (forCount !== forEndCount) {
                // alert("for not closed")
                this.allowToSave = true;
                return this.hideValidation(`Sorry Block Error...!!! For Block is not Closed Properly`);
            }
            else {
                this.dataPostCall(versionIdCount)
            }
        }
    }

    /*Logic Description: final and common call for all the operation like automation,nlp operation whhich takes the data
    from the User and updates the array of data with version count and display the responses
    */

    dataOfData: any;
    appiumSuccessMessage: any;

    dataPostCall(versionIdCount) {
        if (this.itIsOnlyForEdit === true || this.itISOnlyForSave === true) {
            this.editCTCase = {
                versionId: versionIdCount,
                allActitons: this.displayActionArrayData
            }
        }
        else if (this.itISOnlyNLPUI == true || this.nlpEditTestCaseBasedOnVersion == true) {
            this.editCTCase = {
                versionId: versionIdCount,
                allActitons: this.displayNlpArrayData
            }
        }
        else {
            alert("else")
        }


        let obj = {
            "scriptName": this.activeTestScript,
            "projectId": this.projectId,
            "steps": this.editCTCase
        }
        this.servicekey.insertExcelFilesArray(obj).subscribe((data) => { console.log("filterArr", data) })


        this.editCTCase.allActitons.forEach(obj => { if (obj.ObjectUpdate === true) { delete obj.ObjectUpdate } })
        this.alAction = {
            allVariablesForScript: this.variableObjectDeclr,
            allObjectData: this.editCTCase,
            moduleId: this.moduleId,
            featureId: this.featureId,
            scriptId: this.iGotScriptID,
            moduleName: this.activeModule,
            featureName: this.activeFeature,
            fileName: this.activeTestScript,
            editComments: this.commentSection.value.commentsSec,
            editDate: this.todate,
            editorName: this.myUsername,
            projectId: this.projectId,
            projectName: this.projectDetails,
            framework: this.projectFramework[0].framework,
            exportConfig: this.projectFramework[0].exportConfigInfo,
            addToNewVersion: this.addToNewVersionGlobal,
            reusableVar: this.reusableVar,
            generateJmxFile: false,
            securityTesting:this.securityTest
        }
        console.log(this.myUsername)
        this.completeArray.push(this.alAction);
        console.log(this.generateJmxFile)
        if (this.projectFramework[0].framework == "Test NG") {
            this.servicekey.createTestpostAllActionsServiceCall(this.completeArray).subscribe(
                data => {
                    console.log(this.generateJmxFile)
                    if (this.generateJmxFile) {
                        this.createJmxScriptForAutomation();
                    }
                    this.addToNewVersionGlobal = false;
                    this.dataOfData = data;
                    if (!this.executionStatus) {
                        this.toDisableRunBtn = false;
                    }
                    this.clearCommentSection()
                    // if(this.dataOfData.scriptStatus === 'Automated'){
                    //     this.readyForAutomatoion = true;
                    // }
                    // else {this.readyForAutomatoion = false;}
                    // this.dialogService.dockerDialog(this.dataOfData.Status)
                    //     .afterClosed().subscribe(res => {
                    //     })
                    this.decoratorServiceKey.saveSnackbar(this.dataOfData.Status, '', 'save-snackbar')

                    // alert("after pop up")
                    this.getEditTestCaseValueCommon();
                    this.getVaraiableByDefault();
                    this.completeArray = [];
                },
                error => {
                    this.dialogService.dockerDialog(error)
                        .afterClosed().subscribe(res => {
                        })
                }
            )
        }
        else if (this.projectFramework[0].framework == "Appium") {
            this.servicekey.createTestpostAllActionsServiceCall(this.completeArray).subscribe(
                resultOfcreateTestAppiumPostAllActions => {
                    this.appiumSuccessMessage = resultOfcreateTestAppiumPostAllActions
                    this.decoratorServiceKey.saveSnackbar(this.appiumSuccessMessage.Status, '', 'save-snackbar')
                    this.toDisableRunBtn = false;
                })
        }

        this.unSavedChangesExits = false;//Resetting the value
    }// gnerating the script and updating the testCase value in db


    /*
    Logic Description: Used to clear the UI Values after Successfuly 
    */

    clearUiValue() {
        this.addTestCaseDataToTable.ActionList = '';
        this.addTestCaseDataToTable.Action = '';
        this.addTestCaseDataToTable.Input2 = '';
        this.addTestCaseDataToTable.Excel = '';
        this.addTestCaseDataToTable.Input3 = '';
        this.addTestCaseDataToTable.Object = '';
        this.addTestCaseDataToTable.Page = '';
        this.addTestCaseDataToTable.PomObject = '';
        this.addTestCaseDataToTable.ReturnsValue = '';
        this.sameAsActionLIst = '';
        // this.commentsSecvar.commentChecked = false;
        // this.addToVersion = false;
    }//clearUiValue

    // spreedSheetCode Start//

    clearCommentSection() {
        this.commentSection.reset();
        this.commentsSecvar.commentChecked = false;
        this.addToNewVersionGlobal = false;
    }

    enableTestData() {
        document.getElementById('testData').style.color = '#31B0D5';

    }

    importSpreedSheet() {
        return document.getElementById("importSpreedSheet").click();
    }
    editedColumnNames: any;
    generateSpreedSheet() {
        this.editedColumnNames = '';
        return document.getElementById("generateSpreedSheet").click();
    }
    spreedSheetId: number;

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


    highLightSpreedSheet(sId) {
        this.spreedSheetId = sId;
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
    }//deleteSpreedSheetNew

    spreedSheetName: any;
    selectSpreedSheet: any;
    igotSpreedSeetEditStatus: any;


    /*Logic Description: Function which diplay side menu for test data,
    option like: view,edit,audit,delete 
    */
    async spreedSheetNode(file) {
        if (file.node !== undefined) {
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
    editedToDisplay: any;
    spreedPropOut: any;
    spreedSheetAuditInfo: any;
    autoGenerate5 = [];


    /* Logic Description: Common or a reusable function which handel the request of  View and Audit Excel call  */
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
    closeSpreed() {
        this.displayTestData = false;
        document.getElementById('ptree').style.background = 'pink'
        this.spreedView = [];
    }

    tableHeader = [];
    mainArray = [];
    formTableTrue: boolean;
    typeColumnNames = [];
    autoGenerate = [];

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
        this.testdataService.writeFromHtml(wb, this.projectDetails, testDataFileName, spreedAudit, this.projectFramework[0].exportConfigInfo).
            subscribe(res => {
                if (res == "Duplicate Files Are Not Allowed") { alert(res) }
                this.formTableTrue = false;
                this.spreedSheetGenerate.reset()
                this.spreedSheetAuditComments.reset();
                this.excelCallCTC();
                this.autoGenerate = [], this.autoGenerate5 = [], this.mainArray = []
                this.genDataForm.resetForm();
                // this.spreedSheetEditShow = false;
            })
    }//generateSpreedSheetDataCommonCall

    addTestDataForEdit(editedColumnNames) {
        var localArray = [];
        editedColumnNames.forEach((element, index, arr) => {
            localArray.push("")
            if (index == arr.length - 1) {
                this.spreedView.push(localArray)
            }
        });
    }


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
    tempTableHeader = [];

    /*logic Description:
   Used to add the column to test data file
    */
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
    showExcelParamDiv: boolean = false;
    ExcelAddPara = []

    /*logic Description:
    dispaly all the test data file under that project
    */
    displayExcel() {
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

    /*logic Description:
    addExcelParam is method which  helps to pass test data to test sage grammar
    */
    addExcelParam(excelNlpObject) {
        let reslovedExcel = this.testdataService.excelAddParaToTable(this.nlpObject.nlpData, this.excelParamFormValidation)
        if (this.iamEditingTheData == true) {
            // alert("if")
            return this.xx = this.connect.nlpKeyworDispaly(this.makeNlpEditCaseG.nlpDataToCompare, this.makeNlpEditCaseG.Groups, this.makeNlpEditCaseG.Object, this.iamEditingTheData, reslovedExcel, this.makeNlpEditCaseG.Input3, this.makeNlpEditCaseG.ReturnsValue, 'FromExcel', '', '');
        }
        else {
            if (this.nlpObject.nlpData === "Launch URL") {
                return this.xx = this.connect.nlpKeyworDispaly(this.nlpObject.nlpData, "Browser Specific", excelNlpObject, this.iamEditingTheData, reslovedExcel, '', '', 'FromExcel', '', '')
            }
            else if (this.nlpObject.nlpData !== "Read table cell Data1 and store into variable V1") {
                //   alert("iff")
                return this.xx = this.connect.nlpKeyworDispaly(this.nlpObject.nlpData, "KeyBoard & Mouse", excelNlpObject, this.iamEditingTheData, reslovedExcel, '', '', 'FromExcel', '', '')
            }
            else {
                // alert("else in Componnt")
                return this.xx = this.connect.nlpKeyworDispaly(this.nlpObject.nlpData, "Java Function", excelNlpObject, this.iamEditingTheData, reslovedExcel, '', '', 'FromExcel', '', '')
            }
        }

        // this.xx = ii;
        // this.nlpObject.nlpData = ii;
    }

    unexpectedUserCall() {
        this.testdataService.unexpectedUserAction(this.projectDetails, this.myUsername).
            subscribe(res => {
            })
    }

    // spreedSheetCode Ends//
    ///////////////////////////////////////yashwanth code ends/////////////////

    ////////////////////////////////////// SHIVANAND STRTS HERE/////////////////////////////

    testCaseManual: any
    filesToUpload: any;
    completepath: any;
    importedData: any;
    showTestCase: boolean;
    angForm: FormGroup;

    imortTestCase() {
        if (this.unSavedChangesExistsReuse()) {
            return;
        }
        this.showTestCase = true;
        this.showScriptData = false;
        this.showFeatureData = false;
        this.showmoduleData = false;
        // this.moduleMenu = false;s
        // this.featureMenu = false;
        // this.scriptMenu = false;
        this.editModule = false;
        this.itISOnlyForSave = false;
        this.itIsOnlyForEdit = false;
        this.itISOnlyNLPUI = false;
        this.nlpEditTestCaseBasedOnVersion = false;
        this.showEditData = false;
    }
    inputExcel: Object = {};

    createForm() {
        this.angForm = this.fb.group({
            name: ['', Validators.required],
            testValue: ['', Validators.required],
            value: ['', Validators.required],
            testStep: ['', Validators.required],
            testData: ['', Validators.required],
            headers: ['', Validators.required]
        });
    }

    allTestInputs: any;
    scriptName1: any;
    allKnownSteps: any;
    scriptNameValue: any;
    testDataHead: any;
    testStepsHead: any;
    testeee: any

    fileReadEvent(event) {
        let file = event.target.files[0];
        this.filesToUpload = <Array<File>>event.target.files;
    }

    uploadFile() {
        this.servicekey.makeFileRequest(this.filesToUpload)
            .subscribe((result) => {
                if (result != 0) {
                    this.completepath = result[0].path;
                    this.excelInputs(result);
                }
            }, (error) => {
                console.error(error);
            });
    }


    excelInputs(result) {
        var obj = {};
        obj["resultRows"] = result;
        obj["inputExcel"] = this.inputExcel,
            obj["projectId"] = this.projectId,
            obj["featureId"] = this.conditionFeatureName[0].featureId
        obj["moduleId"] = this.displayFeatureName[0].moduleId
        obj["projectName"] = this.projectName
        obj["moduleName"] = this.clickedModule
        obj["featureName"] = this.clickedFeature;
        this.servicekey.getprojectconfigScriptLevel(this.projectId)
            .subscribe(result => {
                console.log(result)
                this.projectConfig = result;
                obj["projectConfig"] = this.projectConfig;
                // alert("excel call")
                this.servicekey.allInputs(obj)
                    .subscribe(result => {
                        this.allTestInputs = result;
                    });
            });
    }

    permissions = [];
    edit: boolean
    read: boolean
    deletePage: boolean
    create: boolean;
    disableButton: boolean;
    readyForAutomatoion: boolean;
    getRolesPermissions() {
        //  alert(this.pageRoles);
        this.roles.getPermissions(this.pageRoles).subscribe(
            Data => {
                this.permissions = Data; console.log(this.permissions);
                console.log(this.permissions);

                this.edit = this.permissions[0].edit;
                this.read = this.permissions[0].read
                this.deletePage = this.permissions[0].delete
                this.create = this.permissions[0].create
                this.disableButton = this.permissions[0].disableButton
            })
    }
    displayModuleName123 = [];
    variableForValidation = []
    filterVariableForValidation() {
        this.variableForValidation = [];
        if (this.variableObjectDeclr.length === 0) {
        }
        else {
            this.variableObjectDeclr.forEach(element => {
                if (element.variableType === this.variableDatatype) {
                    this.variableForValidation.push(element.variableAddFun);
                }
            });
            console.log(this.variableForValidation);
        }

    }
    validateInput3(e) {
        if (this.variableDatatype == "boolean") {
            if (e === "true" || e === "false") {

            } else {
                // alert("Enter valid boolean value")
                this.addTestCaseDataToTable.Input3 = "";
            }
        }
    }

    //////////////////////////////// Vicky code for tree structure //////////////////////////////
    pass() {
        this.unexpectedUserCall();
        this.displayTestData = false;
        this.roles.getMyModules(this.pageRoles).subscribe(
            data => {
                this.displayModuleForTree = data;
                console.log(this.displayModuleForTree)
                this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
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

    jmxStatus: any;
    async nodeSelect(file) {
        this.unexpectedUserCall();
        this.displayTestData = false;
        if (file.node != undefined) {
            if (file.node.data == "module") {
                console.log(file.node)
                this.clickedModule = file.node.label;
                this.moduleId = file.node.moduleId;
                console.log(this.moduleId)
                for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
                    if (file.node.label === this.displayModuleForTree[index]['label']) {
                        this.openFeatureMenu(this.clickedModule, index);
                        break;
                    }

                }
                if (this.newRole == 'Automation Engineer') {
                    this.items = [
                        { label: 'Create new feature', command: (event) => this.landFeaturePage() },
                        { label: 'Edit', command: (event) => this.editModulePage() },
                    ];
                }
                else if (this.newRole == 'Lead') {
                    this.items = [
                        { label: 'Create new feature', command: (event) => this.landFeaturePage() },
                        { label: 'Edit', command: (event) => this.editModulePage() },
                        { label: 'Delete', command: (event) => this.deleteModulePage() },

                    ];
                }
                else {
                    this.items = [];
                }
            }
            else if (file.node.data == "feature") {
                let children = file.node.parent.children
                this.clickedModule = file.node.parent.label;
                this.clickedFeature = file.node.label;
                this.moduleId = file.node.parent.moduleId;
                this.featureId = file.node.featureId;
                console.log(this.moduleId)
                console.log(this.featureId)
                console.log(this.clickedModule)
                console.log(this.clickedFeature)
                for (let index = 0; index < children.length; index++) {//for loop here is to find index of selected or clicked feature
                    if (file.node.label === children[index]['label']) {
                        this.openScriptMenu(this.clickedFeature, this.featureId)
                        break;
                    }

                }
                if (this.newRole == 'Automation Engineer') {
                    this.items = [
                        { label: 'Create New Testcase', command: (event) => this.landScriptPage() },
                        //{ label: 'Import', command: (event) => this.imortTestCase() },
                        { label: 'Edit', command: (event) => this.editFeaturePage() }

                    ]
                }
                else if (this.newRole == 'Lead') {
                    this.items = [
                        { label: 'Create New Testcase', command: (event) => this.landScriptPage() },
                        //{ label: 'Import', command: (event) => this.imortTestCase() },
                        { label: 'Edit', command: (event) => this.editFeaturePage() },
                        { label: 'Delete', command: (event) => this.deleteFeaturePage() }

                    ]
                }
                else {
                    this.items = [];
                }
            }
            else if (file.node.data == "script") {
                this.spinnerVal = "Opening the Script"
                this.SpinnerService.show();
                console.log(file.node)
                this.clickedModule = file.node.parent.parent.label;
                this.clickedFeature = file.node.parent.featureName;
                this.clickedScript = file.node.label;
                this.moduleId = file.node.parent.moduleId;
                this.featureId = file.node.parent.featureId;
                this.hideManualStepBtn = await this.selectedScript(this.clickedScript);
                this.openScriptMenu(this.clickedFeature, this.featureId)
                this.iGotScriptID = file.node.scriptId;
                this.jmxStatus = file.node.status;
                this.checkIfScriptLocked('Manual Steps')

                if (this.newRole == 'Automation Engineer') {
                    if (this.hideManualStepBtn === true) {
                        this.items = [
                            { label: 'Automation Steps', command: (event) => { this.landCreatePage(), this.testCaseForEdit() } },
                            { label: 'Details', command: (event) => this.editScriptPage() },

                        ]
                        return;
                    }
                    else if (this.hideManualStepBtn === false) {
                        this.items = [
                            // { label: 'Automation Steps', command: (event) => { this.landCreatePage(), this.testCaseForEdit() } },
                            //{ label: 'Manual Steps', command: (event) => { this.checkIfScriptLocked('Manual Steps') } },
                            { label: 'Details', command: (event) => this.checkIfScriptLocked('Details') }

                        ]
                        return;
                    }
                }
                else if (this.newRole == 'Lead') {
                    if (this.hideManualStepBtn === true) {
                        this.items = [
                            { label: 'Automation Steps', command: (event) => { this.landCreatePage(), this.testCaseForEdit() } },
                            { label: 'Details', command: (event) => this.editScriptPage() },

                        ]
                        return;
                    }
                    else if (this.hideManualStepBtn === false) {
                        this.items = [
                            // { label: 'Automation Steps', command: (event) => { this.landCreatePage(), this.testCaseForEdit() } },
                            //{ label: 'Manual Steps', command: (event) => { this.checkIfScriptLocked('Manual Steps') } },
                            { label: 'Details', command: (event) => this.checkIfScriptLocked('Details') },
                            { label: 'Delete', command: (event) => this.deleteScriptPage() },

                        ]
                        return;
                    }
                }
                else {
                    this.items = [
                        { label: 'Details', command: (event) => this.checkIfScriptLocked('Details') },
                    ];
                }
            }

        }
        else {
            console.log(file.node);
            return;
        }
    }

    openFullscreen() {
        // alert("Enter")
        var elem = document.getElementById("myvideo");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    }

    closeFullscreen() {
        this.video = false;
    }

    convertXmlToJsonFile() {
        let idLicenseDocker = JSON.parse(sessionStorage.getItem('loginDetails'))._idLicenseDocker;
        let userId = JSON.parse(sessionStorage.getItem('loginDetails')).userId;
        let licenseId = JSON.parse(sessionStorage.getItem('loginDetails')).licenseId;
        let object = {
            "userId": userId,
            "licenseId": licenseId,
            "projectName": this.projectName,
            "idLicenseDocker": idLicenseDocker,
            "userName": sessionStorage.getItem('userName')
        }
        this.servicekey.convertXmlToJson(object).subscribe((data) => {
            if (data['status'] === 'pass') {
                this.extractInfoFromJsonFile();
            }
        })
    }
    completeTrackReport;
    typeofError;
    extractInfoFromJsonFile() {
        let userName = sessionStorage.getItem('userName');
        this.servicekey.extractInfoFromJson(this.projectName, this.projectId, this.activeTestScript, userName).subscribe((data) => {
            this.SpinnerService.hide();
            this.toDisableViewReport = false;
            this.toDisableRunBtn = false;
            this.executionStatus = false;
            this.completeTrackReport = data;
            this.typeofError = true;
            this.dialogService.openAlert('Execution Completed. To View Exceution Report,Click On View Report Button').afterClosed().subscribe(res => {
            })
            // alert('Execution Completed. To View Exceution Report,Click On View Report Button');
        })
    }

    /////////////Execution tracking and failure reporting code by abhishek Ends Here /////////////

    ////////////////////////////////// madhu code starts/////////////////////////////////////

    displayRequirementdata: any;
    displayRequirementdataID: any;
    requirementFetch(requirementGetData) {
        console.log(requirementGetData)
        this.requirenentservice.getrequirementNames(requirementGetData).
            subscribe(
                data => {
                    this.displayRequirementdata = data;
                })
    }
    requirementIdChange(requirementName) {
        this.displayRequirementdataID = this.displayRequirementdata.filter(function (value) {
            return value.requirementName == requirementName;
        })
        console.log(this.displayRequirementdataID)
    }


    ////////////////////////////////// madhu code ends/////////////////////////////////////

    ////////////////////////////////// vicky code starts //////////////////////////////////
    generateData() { // check whether form is valid or not
        if (this.autoGenForm.invalid) { // if invalid retun
            return;
        }
        this.genDataForm.resetForm(); // if valid then clear all fields
    }

    autoGenerateData(value: number) { // for generating auto data 
        let merged = {}
        // console.log(this.unchecked)
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

    unchecked = [];
    getcheckedIndex(e, checkedIndex) {
        alert(checkedIndex)
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

    typeObject: string;
    typeDropdownSelected(typeObject: string, index: number) {
        console.log(index, typeObject)
        this.typeColumnNames.forEach((value, ind, arr) => {
            if (ind === index)
                value.typeObject = typeObject;
        });
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

    resetTable() { // reset table after close
        this.mainArray = [];
        this.formTableTrue = false;
        this.autoGenerate = [];
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

    resetColmnForEdit() { // clear fields after completion of edit
        this.autoGenerate5 = [];
    }

    ////////////////////// vicky code ends here /////////////////////////////////////////////////////////

    createUserNameFolder() {
        let obj = {
            "userName": sessionStorage.getItem('userName'),
            "projectName": sessionStorage.getItem('key')
        }
        this.servicekey.createFolderForEachUser(obj).subscribe((data) => {
            if (data == "fail") {
                this.servicekey.createFolderForEachUser(obj).subscribe((data) => {
                    if (data == "fail") {
                        alert("Something went wrong while setting up project for user")
                    } else {
                        console.log("yes done")
                    }
                })
            } else {
                console.log("yes done")
            }
        })
    }

    preRunOperations() {

        let data1 = {
            "orgId": sessionStorage.getItem('orgId'),
            'organizationName': sessionStorage.getItem('OrganizationName')
        }
        console.log(this.uiProjectFrameWork)
        if (this.uiProjectFrameWork == "Test NG") {
            this.toDisableRunBtn = true;
            this.servicekey.checkMachine(data1).subscribe((res) => {
                if (res[0].state === 'Running') {
                    document.getElementById("runBtn").setAttribute("disabled", "disabled");
                    let data2 = {
                        "orgId": sessionStorage.getItem('orgId'),
                        "userId": sessionStorage.getItem('userId')
                    }
                    this.spinnerPercent = '';
                    this.spinnerVal = "Setting Up Browser..."
                    this.SpinnerService.show();
                    this.servicekey.startContainer(data2).subscribe((result) => {
                        this.SpinnerService.hide();
                        let obj = {
                            "userName": sessionStorage.getItem('userName'),
                            "moduleName": this.activeModule,
                            "featureName": this.activeFeature,
                            "scriptName": this.activeTestScript,
                            "moduleId": this.moduleId,
                            "featureId": this.featureId,
                            "scriptId": this.iGotScriptID,
                            "projectName": this.projectDetails,
                            "projectId": this.projectId
                        }

                        this.servicekey.preRunOps(obj).subscribe((data) => {
                            this.toDisableRunBtn = true;
                            this.toDisableViewReport = true;// To disable view report button
                            this.dockerIpPort();
                            // this.triggerViewReport();
                        })
                    })
                }
                else {
                    this.toDisableRunBtn = false;
                    this.dialogService.openAlert("Please Wait Until The Users Machine is Started")
                }
            })
        }
        else {
            let obj = {
                "userName": sessionStorage.getItem('userName'),
                "moduleName": this.activeModule,
                "featureName": this.activeFeature,
                "scriptName": this.activeTestScript,
                "moduleId": this.moduleId,
                "featureId": this.featureId,
                "scriptId": this.iGotScriptID,
                "projectName": this.projectDetails,
                "projectId": this.projectId
            }

            this.servicekey.preRunOps(obj).subscribe((data) => {
                this.toDisableRunBtn = true;
                this.toDisableViewReport = true;// To disable view report button
                this.dockerIpPort();
                // this.triggerViewReport();
            })
        }


    }

    validateSave() {
        console.log(this.jmxFile)
        if (this.jmxFile) {
            document.getElementById("saveWarning").click();
        }
        else {
            this.actionSave();
        }
    }

    saveAndRemoveJmx() {
        let obj = {
            "orgId": sessionStorage.getItem('orgId'),
            "projectName": this.projectDetails,
            "scriptName": this.activeTestScript,
            'projectId': this.projectId,
            'moduleName': this.activeModule,
            'featureName': this.activeFeature,
            'moduleId': this.moduleId,
            'featureId': this.featureId,
            'jmxFileName': this.activeTestScript,
            'scriptId': this.activeTestScriptId
        }
        this.servicekey.removeJmxScript(obj).subscribe(res => {
            this.actionSave();
            this.roles.getMyModules(this.pageRoles).subscribe(
                data => {
                    this.displayModuleForTree = data;
                    this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label));
                    this.sortFeatures();
                })
        })
    }
    addSecurityNlpgrammers(){
        
        if(this.commentsecure.commentChecked==true){
            console.log('getZapNlpGrammer')
            this.securityTest = true;
            this.nlpClear()
            this.getZapNlpGrammer();
            this.unSavedChangesExits = true;
        }
        else{
            alert("Before execution need to remove security test steps from action list");
            console.log('getNlpGrammer')
            this.securityTest = false;
            this.nlpClear()
            this.getNlpGrammer();
            this.unSavedChangesExits = true
        }

    }
    generateJmx() {
        if (this.unSavedChangesExits == true) {
            this.spinnerVal = "Creating Automation Script..."
            this.generateJmxFile = true;
            this.actionSave()
        }
        else if (this.activeJmxStatus == 'jmxGenerated') {
            document.getElementById("trailTest").click();
        }
        else {
            this.spinnerVal = "Creating Automation Script..."
            this.generateJmxFile = true;
            this.createJmxScriptForAutomation();
        }

    }

    editCTC: any;
    allAction: any;
    completeArrayForJMX = [];
    nlpArray: any;
    createJmxScriptForAutomation() {
        this.nlpArray = this.displayNlpArrayData;
        if (this.nlpArray.length !== 0) {//to check whether we have atleast one test step to save
            if (this.activeTestScript === null || this.activeTestScript === undefined || this.activeTestScript === '') {
                alert("Please Select The Script")
                return;
            }
            for (var i = 0; i < this.nlpArray.length; i++) {//to check whether any of the test step is empty
                if (Object.keys(this.nlpArray[i]).length === 0) {
                    alert("Test Step Cannot Be Empty")
                    this.nlpArray.splice(i, 1)
                    this.releaseHeaderBtn = false;
                    if (this.nlpArray.length >= 2) { this.enableDragger = true } else this.enableDragger = false;
                    return;
                }
            }
            this.editCTC = {
                allActitons: this.displayNlpArrayData
            }

            this.editCTC.allActitons.forEach(obj => { if (obj.ObjectUpdate === true) { delete obj.ObjectUpdate } })
            this.allAction = {
                allVariablesForScript: this.variableObjectDeclr,
                allObjectData: this.editCTC,
                moduleName: this.activeModule,
                featureName: this.activeFeature,
                fileName: this.activeTestScript,
                editComments: this.commentSection.value.commentsSec,
                editDate: this.todate,
                editorName: this.myUsername,
                projectId: this.projectId,
                projectName: this.projectDetails,
                framework: this.projectFramework[0].framework,
                exportConfig: this.projectFramework[0].exportConfigInfo,
                addToNewVersion: this.addToNewVersionGlobal,
                reusableVar: this.reusableVar,
                generateJmxFile: this.generateJmxFile,
                moduleId: this.moduleId,
                featureId: this.featureId,
                scriptId: this.iGotScriptID
            }
            this.completeArrayForJMX.push(this.allAction);
            this.servicekey.createTestpostAllActionsServiceCall(this.completeArrayForJMX).subscribe(
                data => {
                    this.completeArrayForJMX = [];
                    //this.generateJmxFile = false;
                    this.startExecutingScript();
                },
                error => {
                    this.dialogService.dockerDialog(error)
                        .afterClosed().subscribe(res => {
                        })
                }
            )
        } else {
            alert('Atleast one Test step is required')
            // this.blockScopeValidation(this.versionIdCount)
        }

    }
    startExecutingScript() {
        this.spinnerPercent = '';
        this.SpinnerService.show();
        let data1 = {
            "orgId": sessionStorage.getItem('orgId'),
            'organizationName': sessionStorage.getItem('OrganizationName'),
            "userId": sessionStorage.getItem('userId')

        }
        this.servicekey.checkJMachine(data1).subscribe(res => {
            if (res[0].machineStatus == "Stopped") {
                this.SpinnerService.hide();
                this.dialogService.openAlert("please start the Jmeter Users Machine")
            }
            else if (res[0].machineStatus == "Starting") {
                this.SpinnerService.hide();
                this.dialogService.openAlert("please wait until the machine is started")
            }
            else {
                this.servicekey.assignContainers(data1).subscribe(res => {
                    let obj = {
                        "userName": sessionStorage.getItem('userName'),
                        "moduleId": this.moduleId,
                        "featureId": this.featureId,
                        "scriptId": this.iGotScriptID,
                        "moduleName": this.activeModule,
                        "featureName": this.activeFeature,
                        "scriptName": this.activeTestScript,
                        "projectName": this.projectDetails,
                        "projectId": this.projectId,
                        jmxGen: true
                    }
                    this.servicekey.preRunOps(obj).subscribe((data) => {
                        let licenseId = JSON.parse(sessionStorage.getItem('loginDetails')).licenseId
                        let userId = JSON.parse(sessionStorage.getItem('loginDetails')).userId
                        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
                        let objectData = {};
                        objectData["moduleName"] = this.activeModule;
                        objectData["featureName"] = this.activeFeature;
                        objectData["scriptName"] = this.activeTestScript;
                        objectData["moduleId"] = this.moduleId;
                        objectData["featureId"] = this.featureId;
                        objectData["scriptId"] = this.iGotScriptID;
                        objectData["projectName"] = this.projectDetails;
                        objectData["userName"] = sessionStorage.getItem('userName');
                        objectData["exportConfig"] = this.projectFramework[0].exportConfigInfo;
                        objectData["generateJmxFile"] = this.generateJmxFile;
                        objectData["userId"] = userId;
                        objectData["orgId"] = orgId;

                        this.servicekey.generateBatchNXmlFile(objectData)
                            .subscribe(result => {
                                let tempObj = {
                                    "userName": sessionStorage.getItem('userName'),
                                    "projectName": this.projectDetails,
                                    "scriptName": this.activeTestScript,
                                    "projectId": this.projectId,
                                    "jmxGen": true,
                                    "moduleName": this.activeModule,
                                    "featureName": this.activeFeature,
                                    "moduleId": this.moduleId,
                                    "featureId": this.featureId,
                                    "scriptId": this.iGotScriptID
                                }
                                this.spinnerVal = "Generating JMX File..."
                                this.spinnerPercent = 20 + '%';
                                this.servicekey.startScriptExecutionServiceCall(tempObj).subscribe((res1) => {
                                    this.spinnerPercent = 30 + '%';
                                    this.servicekey.deleteScriptAfterExceution(tempObj).subscribe(() => {
                                        this.spinnerPercent = 50 + '%';
                                        if (res1 == "compilationError") {
                                            this.SpinnerService.hide();
                                            this.dialogService.openAlert("Compilation Error");
                                        }
                                        else {
                                            let data2 = {
                                                "orgId": sessionStorage.getItem('orgId'),
                                                "projectName": this.projectDetails,
                                                "scriptName": this.activeTestScript,
                                                "userId": sessionStorage.getItem('userId'),
                                                "userName": sessionStorage.getItem('userName'),
                                                'projectId': this.projectId,
                                                'moduleName': this.activeModule,
                                                'featureName': this.activeFeature,
                                                'moduleId': this.moduleId,
                                                'featureId': this.featureId,
                                                'jmxFileName': this.activeTestScript,
                                                'scriptId': this.iGotScriptID
                                            }
                                            this.spinnerVal = "Extracting The JMX File..."
                                            this.servicekey.getTheFile(data2).subscribe((resultData) => {
                                                this.spinnerPercent = 80 + '%';
                                                console.log(resultData)
                                                if (resultData == 'pass') {
                                                    this.servicekey.jsonConversion(data2).subscribe(() => {
                                                        this.generateJmxFile = false;
                                                        this.SpinnerService.hide();
                                                        document.getElementById('trailTest').click();
                                                    })
                                                }
                                                else {
                                                    this.generateJmxFile = false;
                                                    this.SpinnerService.hide();
                                                    this.dialogService.openAlert("Failed to execute script")
                                                }

                                            })
                                        }

                                    })
                                })
                            })
                    })
                })

            }
        })

    }
    trailResult = [];
    trailRun() {
        let userId = JSON.parse(sessionStorage.getItem('loginDetails')).userId
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        let obj = {
            "projectName": this.projectDetails,
            'moduleName': this.activeModule,
            'featureName': this.activeFeature,
            'jmxFileName': this.activeTestScript,
            'userId': userId,
            'orgId': orgId,
            'moduleId': this.moduleId,
            'featureId': this.featureId,
            'projectId': this.projectId,
            'scriptId': this.activeTestScriptId
        }
        this.spinnerPercent = 0 + '%';
        this.spinnerVal = "Executing Trail Test...."
        this.SpinnerService.show();
        this.performanceService.copyScriptsToMaster(obj).subscribe(res => {
            this.spinnerPercent = 20 + '%';
            this.performanceService.trailCallExecution(obj).subscribe(res => {
                this.spinnerPercent = 40 + '%';
                this.performanceService.copyResultsToLocal(obj).subscribe(res => {
                    this.spinnerPercent = 60 + '%';
                    this.performanceService.deleteInDocker(obj).subscribe(res => {
                        this.spinnerPercent = 80 + '%';
                        this.performanceService.convertCsvToJson(obj).subscribe(res => {
                            this.spinnerPercent = 100 + '%';
                            this.trailResult = [];
                            res.forEach((element, index) => {
                                if (index !== res.length - 1)
                                    this.trailResult.push(element)
                            });
                            this.SpinnerService.hide();
                            document.getElementById('reportDisplay').click();
                            this.roles.getMyModules(this.pageRoles).subscribe(
                                data => {
                                    this.displayModuleForTree = data;
                                    this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label));
                                    this.sortFeatures();
                                })
                            console.log(this.trailResult)
                        })
                    })
                })
            })
        })
    }

}
