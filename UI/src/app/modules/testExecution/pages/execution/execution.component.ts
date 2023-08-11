import { Component, OnInit, KeyValueDiffers, ViewChild, ElementRef, OnDestroy } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { BrowserSelectionService } from '../../../../core/services/browser-selection.service';
import { Subject, Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//import { URLSearchParams } from '@angular/http';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { TestExecutionServiceComponent } from '../../../../core/services/testExecution.service';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { Post } from '../../../../post';
import { ExecutionService } from '../../../../core/services/execution.service';
import { roleService } from '../../../../core/services/roleService';
import { ProjectSelectionServiceComponent } from '../../../../core/services/projectSelection.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { CreateService } from '../../../../core/services/release-create.service';
import { Router } from '@angular/router';
import { TrackingService } from '../../../../core/services/tracking.service';
//import { Z_BLOCK } from 'zlib';
import { forEach } from '@angular/router/src/utils/collection';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../../../../core/services/dialog.service';
import { WebExecutionService } from '../../../../core/services/web-execution.service';
import { MatOption, MatSelect } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-execution',
    templateUrl: './execution.component.html',
    styleUrls: ['./execution.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
    providers: [ProjectDetailServiceComponent, WebExecutionService, BrowserSelectionService, TestExecutionServiceComponent, apiServiceComponent, ExecutionService, roleService]
})
export class ExecutionComponent implements OnInit, OnDestroy {
    //   user: any = { email: "" };
    userEmail: any;
    //   @ViewChild('emailRef', { static: false }) emailRef: ElementRef;

    allArray = [];
    lDate: boolean;
    showtestsuite: boolean;
    radio: boolean = false;
    scriptsNew: any;
    selectedSuite: any;
    allScripts: any;
    machineId: any;
    defaultBrowserName: string;
    defaultVersionName: string;
    divAS: number;
    splitArray = [];
    browserName: string;
    versionName: string;
    splitBrowserArray: any;
    groupLength: number;
    newScriptsLength: any;
    remainder: number;
    scriptsLength: any;
    splitDisArray: any;
    exceptionStatus: any;
    exceptionOption: any;
    xmlResult: any;
    reportJsonResult: any;
    xmlResult12: any;
    xmlPresentResult: any;
    spid: Post[];
    manualExe: boolean;
    normalExe: boolean;
    myScripts: any;
    len: any;
    scriptsNew1: any;
    manualStatus: any;
    multiselectCheck: any;
    manualStepStartTime: string;
    startedAt: string;
    filesToUpload: File[];
    stepEnded: string;
    videoToUpload: File[];
    activeScreenUpload: number = 0;
    activeVideoUpload: number = 0;
    comment: string;
    manualscreenShot: string;
    manualVideo: string;
    manualReportResult: any;
    myData1: any;
    yashwant: any;
    manualScriptId: any;
    activeOpenFields: any;
    checkd: boolean;
    checkr: any;
    resultDisplayNew: string;
    selectedProject: any;
    selectedRelease: void;
    activeReleaseVer: any;
    releaseVer: any;
    checkReportPresent: boolean;
    checkReportstatus: any;
    reportroute: boolean;
    releaseName: any;
    projectframework: any;
    typeArray: any;
    priorityArray: any;
    type: any;
    featureNames: any[];
    moduleNames: any[];
    statusExe: any;
    searchParams: string;
    testScriptsData: any;
    checke: boolean;
    toppingList: string[] = ['Pass', 'Fail', 'NotExecuted'];
    typeTestsList: string[] = ['Manual', 'Automated'];
    timestart: boolean;
    assignButton: boolean;
    testers: any;
    latestTestData: Post[];
    typeExecution: string;
    dockerStart: any;
    dockerstat: any;
    multipleData: any;
    sched: boolean;
    emailArray = [];
    subject: any;
    dated: string;
    completeTrackReport: any;
    weekend: boolean;
    versions: any;
    manualMulticheck: boolean;
    uploadDetails: any;
    manualScreenPath: any;

    constructor(private fb: FormBuilder,
        private data: ProjectDetailServiceComponent,
        private datadrop: TestExecutionServiceComponent,
        private api: apiServiceComponent, private executionService: ExecutionService, private router: Router,
        private browserService: BrowserSelectionService,
        private dialogService: DialogService,
        private decoratorServiceKey: DecoratorService,
        private webService: WebExecutionService,
        private roles: roleService, private CreateService: CreateService, private getAllreleases: TrackingService,
        private SpinnerService: NgxSpinnerService) {
        this.yashwant = [1, 2];
    }

    clickdocker: boolean;
    suites: any;
    releaseSuites: any;
    allscripts: any;
    getsuitedata: any;
    scriptsnew: any;
    fetchedScripts = [];
    newArray = [];
    arrayitems: any;
    removedArray = [];
    statusremovedArray = [];
    uncheckedarray = [];
    browser: any;
    bnames: any;
    dbrowsers: any;
    dversions: any;
    selectedbrowser: any;
    allVersions: any;
    version = [];
    b: Object = {};
    solvedVersion: any;
    index: any;
    selectedrow: any;
    result111: any;
    deleteData: any;
    deleteres: any;
    afteruncheck = [];
    position: number;
    projectDetails: any;
    selectedsuite: any;
    suiteSelected: any;
    psuite: any;
    defaults: any;
    getsuiteData: any;
    selectedBrowser: any;
    selectedRow: any;
    splitBrowser: any;
    splitVersion: any;
    divAS1: any;
    activeClick: any;
    scheduleDetails = [];
    WeeklyDetails = [];
    hourlyDetails = [];
    scheduleObject: Object = {};
    angForm123: FormGroup;
    endTime: boolean;
    startTime: boolean;
    week: boolean;
    hourly: boolean;
    weekEnd: boolean;
    selectedDetails: any;
    checkboxValue: any;
    newRole: any;
    pageRoles: Object = {}
    pageName: any;
    newUserName: any;
    newUserId: any;
    manualStepData: any;
    manualScriptStatus: any;
    nlpStepDetails: any;
    selectedStepStatus: any = "";
    selectedStepIndex: any;
    stepUpdateResult: any;
    stopEditing: any = false;
    allowReport: any;
    savestat: any;
    screenvideor: boolean;
    mreportno: any;
    parallelExecution: boolean;
    // emailForm:FormGroup;
    // emailForm:NgForm;
    @ViewChild('emailForm', null) emailForm: NgForm;
    token: any;
    multiVersions: any;
    verss: any;
    Version: any;
    usersData: any;
    Execution: boolean;
    totalTestcases: any;
    selectedTestcases: any;

    navSuite:boolean=false;

    @ViewChild('myInput', { static: false }) InputVar: ElementRef;
    ngOnInit() {
        this.Execution = true;
        this.userEmail = '';
        this.jenkinsbutton1 = true;
        this.openWhenClic = false;
        this.parallelExecution = false;
        this.normalExe = true
        this.allowReport = true;
        this.savestat = true;
        this.timestart = false
        this.assignButton = false
        this.typeExecution = "Automated"
        this.pageName = "ExecutionPage"
        this.token = localStorage.getItem('token');
        this.newRole = sessionStorage.getItem('newRoleName');
        this.newUserId = sessionStorage.getItem('newUserId');
        this.newUserName = sessionStorage.getItem('userName')
        this.selectedProject = sessionStorage.getItem('selectedProject')
        this.selectedProject = JSON.parse(this.selectedProject)
        this.spid = this.selectedProject.projectId
        this.pageRoles = {
            pageName: this.pageName,
            roleName: this.newRole,
            userId: this.newUserId,
            userName: this.newUserName
        }
        this.projectDetails = this.data.selectedProject();
        this.exceptionOption = false;
        this.divAS = 0;
        this.divAS1 = 0;
        this.startTime = false
        this.endTime = false;
        this.week = false;
        this.hourly = false;
        this.weekEnd = false
        let selectedDetails = sessionStorage.getItem('seletedScripts');
        let parsedUserName1 = JSON.parse(selectedDetails);
        this.selectedDetails = parsedUserName1
        this.checkboxValue = 0;
        this.weekend = false;
        this.SpinnerService.show();
        this.getRolesPermissions()
        this.getBrowser();
        this.getSuites();
        this.createForm();
        this.framework()
        this.getSchedules()
        this.getWeekly()
        this.getHourly()
        this.getType()
        this.getPriority()
        this.getStatus();
        this.multiselectStatus();
        this.releaseV();
        this.ForTreeStructureAllReleases();
        //this.angForm123.reset();
        var dat = new Date();
        this.dated = dat.toISOString().split("T")[0];
        console.log(this.dated)
        this.manualscreenShot = '';
        // this.SpinnerService.hide();
        this.getUsersEmails();
        // this.emailForm=this.fb.group({
        //     email:["",[Validators.required,Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
        // })
        //clearInterval(this.exceptStatus);
        // this.featureId='All';
        this.featureNames = [{ featureId: 'All', featureName: "All" }]
        this.moduleNames = [{ moduleId: 'All', moduleName: "All" }]
        console.log(this.featureNames, this.moduleNames)
        this.totalTestcases = '';
        this.selectedTestcases = '';
        this.checkr = false;
        this.manualMulticheck = false;
        this.navSuite=false;
    }

    getUsersEmails() {
        let obj = {
            "projectId": this.spid
        }
        this.webService.getUsersEmails(obj).subscribe(result => {
            console.log(result)
            this.usersData = result;
        })
    }

    ///////////Shiva Jenkins start///////////////////////////////
    lineData: any;
    password: any;
    url: any;
    jenkinsUrl: any;
    callURL() {
        console.log("nameeeeeeeeeeeeeee", this.newUserName)
        this.spid;
        this.newUserId
        // this.lineData = this.spid + ',' + this.newUserId
        console.log(this.newUserId)
        let obj = {
            "projectId": this.spid,
            "suiteId": this.newUserId
        }
        console.log(this.spid)
        console.log(this.selectedSuiteID)
        this.webService.getUrlinfo(obj).subscribe(result => {
            this.SpinnerService.hide();
            // this.manualStepData = result;
            console.log(result[0].password)
            this.password = result[0].password;
            this.url = 'http://52.207.147.36:2111/jenkinsApi/Api:opal' + ',' + this.spid + ',' + this.newUserName + ',' + this.password + ',' + this.selectedSuiteID
                + "," + this.token;
            this.jenkinsUrl = this.url;
            // console.log(url)    
        });

    }

    jenkinsbutton1: boolean;
    jenkinsbutton: boolean;
    jenCheckAvail: any
    nextjenFunction
    //completeobjectOne: Object = {};
    jenkinsData: any = [];
    jenUrl(scriptsNew, jenEmail) {
        console.log("jenUrl", scriptsNew)
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        this.jenCheckAvail = [];
        this.jenkinsData = [];
        this.nextFUnction = false
        let broVer = 0;
        if (scriptsNew == undefined) {
            return alert("There are no scripts")
        }
        scriptsNew.forEach(element => {
            if (element.check === "true") {
                console.log(element.check)
                let obj1 = {
                    "browser": element.browser,
                    "Version": element.Version,
                    "versionCodeName": element.versionCodeName,
                    "versionStatus": element.versionStatus,
                    "orgId": orgId
                }
                console.log(element.Version, typeof (element.Version), element.Version instanceof Object, element.Version.length)
                if (element.browser == "") {
                    broVer = 1;
                } else if (element.Version == "" || element.Version instanceof Object) {
                    broVer = 2
                }
                this.jenCheckAvail.push(obj1)
                console.log(this.jenCheckAvail)
            }
        })
        if (this.jenCheckAvail.length == 0) {
            this.jenkinsbutton = false
            confirm("Please select script")
        } else if (jenEmail == null || jenEmail == ' ' || jenEmail == undefined || this.emailForm.invalid) {
            this.jenkinsbutton = false
            confirm("Please enter a valid Email Id")
        } else if (broVer == 1) {
            this.jenkinsbutton = false
            confirm("Please select browser")
        } else if (broVer == 2) {
            this.jenkinsbutton = false
            confirm("Please select browser Version")
        }
        else {
            var emailArray = [];
            emailArray = jenEmail.split(',')
            console.log(emailArray)
            let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
            console.log(orgId)
            let obj1 = {
                "orgId": orgId
            }
            //this.jenCheckAvail = []
            //this.nextjenFunction = false
            this.webService.dataByOrgId(obj1).subscribe(res => {
                console.log(res)
                console.log(this.scriptsNew)
                console.log(res[0].machineDetails[0].url)
                //this.jenkinsbutton1 = false;
                this.jenkinsbutton = true;
                this.jenkinsUrl = this.url;
                console.log(this.url, this.jenkinsUrl)
                for (let c = 0; c < this.scriptsNew.length; c++) {
                    if (this.scriptsNew[c].check != "false") {
                        if (this.scriptsNew[c].bName != "" && this.scriptsNew[c].Version != "") {
                            this.scriptsNew[c].projectName = this.projectDetails;
                            this.scriptsNew[c].testSuite = this.selectedSuite;
                            this.scriptsNew[c].type = 'jenkins';
                            // this.scriptsNew[c].exceptionOption = this.exceptionOption;
                            this.scriptsNew[c].projectId = this.spid;
                            // this.scriptsNew[c].parallelExecution = this.parallelExecution;
                            // this.scriptsNew[c].noOfBrowsers = noOfBrowsers;
                            this.scriptsNew[c].selectedRelease = this.releaseName;
                            this.scriptsNew[c].IPAddress = res[0].machineDetails[0].url;
                            this.scriptsNew[c].createdBy = this.newUserName;
                            // this.scriptsNew[c].emailArray = emailArray
                            // this.scriptsNew[c].sendMailOrNot = this.enableEmailInput;
                            // this.scriptsNew[c].requirementName = this.scriptsNew[c].requirementName
                            // this.scriptsNew[c].requirementId = this.scriptsNew[c].requirementId,
                            // this.scriptsNew[c].details = loginDetails;
                            this.jenkinsData.push(this.scriptsNew[c]);
                        } else {
                            this.jenkinsData = [];
                            alert("please enter the browser name and version ");
                            // this.data1 = [];
                            // return;
                        }
                    }
                }
                let obj = {
                    projectName: this.selectedProject.projectName,
                    projectId: this.spid,
                    releseVersion: this.activeReleaseVer[0].releaseVersion,
                    releseId: this.activeReleaseVer[0].releaseId,
                    suiteName: this.selectedSuite,
                    suiteId: this.selectedSuiteID,
                    url: res[0].machineDetails[0].url,
                    scriptData: this.jenkinsData,
                    orgId: orgId,
                    "email": emailArray,
                    token: this.token,
                }
                console.log(obj, "ObjObjObjObjObjObjObj")


                let obj2 = {
                    "projectId": this.spid,
                    "suiteId": this.selectedSuiteID,
                    "suiteName": this.selectedSuite
                }
                console.log(obj2, "OBJ@OBJ@OBJ@OBJ@@@@@@@@@@")
                this.webService.getJenkinsDetails(obj2).subscribe(res => {
                    console.log(res)
                    if (res == 'Pass') {
                        console.log(this.scriptsNew)
                        this.webService.jenkinsDatastoreToDb(obj).subscribe(res => {
                            console.log(res)
                        })
                    }
                })
            })
        }

    }

    copyInputMessage(inputElement) {
        // this.inpuxtext=false;
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.decoratorServiceKey.copySnackbar('Copied Successfully', '', 'save-snackbar')
        //this.copyDissmiss()
    }
    copyDissmiss() {
        this.jenkinsbutton = false
    }
    ///////////Shiva Jenkins end///////////////////////////////


    @ViewChild('checkBoxSe', { static: false }) checkBoxSe: ElementRef;
    @ViewChild('matRef', { static: false }) matRef: MatSelect;

    selectManualType() {
        this.scriptsNew = []
        this.filterArr = [];
        this.manualExe = true;
        this.normalExe = false;
        this.typeExecution = "Manual"
        this.checke = false;
        this.totalTestcases = '';
        this.selectedTestcases = '';
        this.resultDisplayNew = '';
        this.resultDisplay = '';
        this.checkReportstatus = '';
        this.mreportno = '';
        this.checkReportPresent = false;
        this.jenkinsbutton = false
    }
    selectExeType() {
        this.scriptsNew = [];
        this.filterArr = [];
        this.checke = false;
        this.normalExe = true;
        this.manualExe = false;
        this.checkd = false
        this.typeExecution = "Automated"
        this.matRef.options.forEach((data: MatOption) => data.deselect());
        this.totalTestcases = '';
        this.selectedTestcases = '';
        this.resultDisplayNew = '';
        this.resultDisplay = '';
        this.checkReportstatus = '';
        this.mreportno = '';
        this.checkReportPresent = false;
        this.jenkinsbutton = false
    }


    getBrowser() {
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        let obj = { 'orgId': orgId, 'userName': this.newUserName }
        this.webService.getBrowsers(obj)
            .subscribe(result => {
                console.log(result);
                this.browser = result;
                console.log(this.browser);
                this.dbrowsers = this.browser;
            })
    }

    displayErrorMessage() {
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId;
        let obj = { 'orgId': orgId }
        this.webService.checkDockerRunning(obj).subscribe((result) => {
            if (result[0].state === "Stopped") {
                this.dialogService.openAlert(`Please start the Execution machine and block the browsers`)
                    .afterClosed().subscribe(res => {
                    })
            }
            else if (this.browser.length == 0) {
                this.dialogService.openAlert(`Please block the browsers`)
                    .afterClosed().subscribe(res => {
                    })
            }
        })
    }

    getSuites() {
        let obj = { 'projectId': this.spid }
        this.webService.getSuitesData(obj)
            .subscribe(result => {
                this.suites = result;
                console.log(this.suites);
            })
    }

    framework() {
        let obj = { 'projectId': this.spid }
        this.webService.getframework(obj)
            .subscribe(result => {
                this.projectframework = result[0].framework;
                console.log(this.projectframework)
            })
    }

    getSchedules() {
        this.webService.getSchedulesTypes()
            .subscribe(result => {
                this.scheduleDetails = result
                console.log(this.scheduleDetails)
            })
    }

    getWeekly() {
        this.webService.getWeeklyTypes()
            .subscribe(result => {
                // this.WeeklyDetails = result
                // console.log(this.WeeklyDetails)
            })
    }

    getHourly() {
        this.webService.getHourlyTypes()
            .subscribe(result => {
                this.hourlyDetails = result
                console.log(this.hourlyDetails)
            })
    }

    getType() {
        this.webService.getTypesData()
            .subscribe(result => {
                this.typeArray = result
                console.log(this.typeArray)
            })
    }

    getPriority() {
        this.webService.getPriorityData()
            .subscribe(result => {
                this.priorityArray = result
                console.log(this.priorityArray)
            })
    }

    getStatus() {
        this.webService.getmanualStatus()
            .subscribe(result => {
                this.manualStatus = result;
                console.log(this.manualStatus);
            })
    }

    multiselectStatus() {
        this.webService.getmultiselectStatus()
            .subscribe(result => {
                this.multiselectCheck = result;
                console.log(this.multiselectCheck);
            })
    }

    releaseV() {
        let obj = { 'projectId': this.spid }
        this.webService.getActiveRelease(obj)
            .subscribe(result => {
                console.log(result)
                this.activeReleaseVer = result;
            })
    }

    //functiuon for fetching the npl and inserting the data at testscript in db
    fetchNLP() { //see
        this.scriptsNew = []
        var data = {
            suite: this.selectedSuite,
            pId: this.spid
        }
        //  this.executionService.fecthScriptData(data).subscribe(result => {
        // this.manualStepData = result;
        // // alert("sdsdsdsdsdsddsdsssd");
        // console.log("manual steps data");
        // console.log(this.manualStepData);
        // this.scriptsNew = this.manualStepData[0].manualScriptDetails;

        // });

    }


    selectedReleaseV(releaseId) {
        console.log(releaseId)
        this.releaseVer = releaseId
    }


    allmodules() {
        this.moduleNames = [];
        this.featureNames = [];
        this.featureNames = [{ featureId: 'All', featureName: "All" }]
        this.featureId = 'All';
        this.suiteSelected = 1
        this.selectedSuite = this.selectedname
        if (this.newRole == "Lead") {
            this.assignButton = true
            let obj = { 'projectId': this.spid, 'userRole': this.newRole }
            this.webService.getTesters(obj)
                .subscribe(result => {
                    this.testers = result;
                    console.log(this.testers)
                })
        }
        let obj = { 'projectId': this.spid, 'suiteName': this.selectedname }
        this.webService.getModule(obj)
            .subscribe(result => {
                this.moduleNames = result;
                this.moduleNames.unshift({ moduleId: 'All', moduleName: "All" })
                this.moduleId = 'All';
                console.log(this.moduleNames)
            })
    }

    featureId: any = "All";
    moduleId: any = "All";
    moduleIndex(moduleId) {
        this.featureNames = [];
        let obj = { 'projectId': this.spid, 'moduleId': moduleId }
        if (moduleId != "All") {
            this.webService.getModuleFeatures(obj)
                .subscribe(result => {
                    this.featureNames = result;
                    this.featureNames.unshift({ featureId: 'All', featureName: "All" })
                    console.log(this.featureNames)
                    this.featureId = 'All';
                })
        } else {
            this.featureNames = [{ featureId: 'All', featureName: "All" }]
            this.featureId = 'All';
        }

    }


    stepDetails: any
    typeTestcases: any;
    priorityId: any;
    typeId: any;
    searchCall(typeTestcases, statusExe, moduleId, featureId, priorityId, typeId) {
        this.jenkinsbutton = false
        this.stepsStatus = [];
        this.scriptsNew = [];
        ////////////
        this.verss = [];
        ////////////
        this.testScriptsData = [];
        this.multiBrowser.browserName = {
            browserName: "", version: []
        };
        this.multiBrowser.versionName = { versionName: {} };
        this.checkd = false;
        this.checke = false;
        this.filterArr = [];
        var resttest
        this.resultDisplayNew = '';
        this.resultDisplay = '';
        this.checkReportstatus = '';
        this.mreportno = '';
        this.checkReportPresent = false;
        if (this.typeExecution == "Manual") {
            if (typeTestcases == undefined) {
                resttest = "undefined"
            }
            else if (typeTestcases.length == '1') {
                resttest = typeTestcases[0]
            }
            else if (typeTestcases.length == '2') {
                resttest = "undefined"
            }
        }
        else if (this.typeExecution == "Automated") {
            resttest = "Automated"
        }
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
        this.typeTestcases = typeTestcases;
        this.statusExe = statusExe;
        this.moduleId = moduleId;
        this.featureId = featureId;
        this.priorityId = priorityId;
        this.typeId = typeId;
        this.searchParams = moduleId + ',' + featureId + ',' + typeId + ',' + priorityId +
            ',' + this.spid + ',' + this.selectedname + ',' + this.projectframework
            + ',' + this.newRole + ',' + this.newUserName + ',' + resttest + ',' + statusExe
        console.log(this.searchParams)
        // let obj = {
        //     "projectId": this.spid,
        //     "suiteName": this.selectedname,
        //     "userName": this.newUserName,
        //     "userId": this.newUserId
        // }
        // console.log(obj);
        // this.webService.checkIfSuiteLockedService(obj).subscribe((result) => {
        //     console.log(result)
        // if (result["beingUsedBy"] == "lockedNow") {
            this.SpinnerService.show();
        this.webService.searchTestcases(this.searchParams)
            .subscribe(async (result) => {
                this.SpinnerService.hide();
                this.testScriptsData = result;
                var script = await this.sortScript(result)
                var feature = await this.sortFeature(script)
                var module = await this.sortModule(feature)
                console.log(module);

                console.log(this.testScriptsData);
                this.scriptsNew = module
                ////////////
                this.scriptsNew.forEach((val, i, array) => {
                    this.version[i] = [];
                    val['checkr'] = false;
                    this.stepsStatus.push(false)
                    val.manualStepDetails.forEach(element => {
                        element.status = 'NotExecuted';
                        element.check = 'false';
                    })
                });
                /////////////
                this.totalTestcases = this.testScriptsData.length;
                this.selectedTestcases = '';
                if (this.testScriptsData.length == 0) {
                    this.dialogService.openAlert(`No Data Available.`)
                        .afterClosed().subscribe(res => {
                        })
                }
            })
        // } else {
        //     this.dialogService.dockerDialog(`${result["beingUsedBy"]} is working on it, Suite will be available as soon as current user releases it `)
        //         .afterClosed().subscribe(res => {

        //         })
        // }
        // })

    }

    sortModule(data) {
        return data.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
    }
    sortFeature(data) {
        return data.sort((a, b) => a.fetaureName.localeCompare(b.fetaureName))
    }

    sortScript(data) {
        return data.sort((a, b) => a.scriptName.localeCompare(b.scriptName))
    }

    searchUpdate() {
        // this.multiBrowser.browserName = '';
        // this.multiBrowser.versionName = '';
        // this.checkd = false;
        // this.checke = false;
        // this.filterArr = [];
        var resttest
        // this.resultDisplayNew = '';
        // this.resultDisplay = '';
        // this.checkReportstatus = '';
        // this.mreportno = '';
        // this.checkReportPresent = false;
        if (this.typeExecution == "Manual") {
            if (this.typeTestcases == undefined) {
                resttest = "undefined"
            }
            else if (this.typeTestcases.length == '1') {
                resttest = this.typeTestcases[0]
            }
            else if (this.typeTestcases.length == '2') {
                resttest = "undefined"
            }
        }
        else if (this.typeExecution == "Automated") {
            resttest = "Automated"
        }

        this.searchParams = this.moduleId + ',' + this.featureId + ',' + this.typeId + ',' + this.priorityId +
            ',' + this.spid + ',' + this.selectedname + ',' + this.projectframework
            + ',' + this.newRole + ',' + this.newUserName + ',' + resttest + ',' + this.statusExe
        console.log(this.searchParams)
        // let obj = {
        //     "projectId": this.spid,
        //     "suiteName": this.selectedname,
        //     "suiteId": this.selectedSuiteID,
        //     "userName": this.newUserName,
        //     "userId": this.newUserId
        // }
        // console.log(obj);
        // this.webService.checkIfSuiteLockedService(obj).subscribe((result) => {
        //     console.log(result)
        //     if (result["beingUsedBy"] == "lockedNow") {
        this.webService.searchTestcases(this.searchParams)
            .subscribe(result => {
                this.testScriptsData = result;
                console.log(this.testScriptsData);
                this.scriptsNew.forEach(val => {
                    if (val.check == 'true') {
                        this.testScriptsData.forEach(element => {
                            if (val.scriptId == element.scriptId) {
                                val.scriptStatus = element.scriptStatus;
                                val.executionType = element.executionType;
                            }
                        })
                    }
                });
                console.log(this.scriptsNew);
                if (this.testScriptsData.length == 0) {
                    this.selectedTestcases = 0;
                    this.totalTestcases = 0;
                    this.dialogService.openAlert(`No Data Available.`)
                        .afterClosed().subscribe(res => {
                        })
                }
            })

        // } else {
        //     this.dialogService.dockerDialog(`${result["beingUsedBy"]} is working on it, Suite will be available as soon as current user releases it `)
        //         .afterClosed().subscribe(res => {

        //         })
        // }
        // })

    }

    ngOnDestroy() {
        if (this.Execution) {
            let obj = {
                "userName": this.newUserName,
                "projectName": this.projectDetails,
                "projectId": this.spid,
                "suiteId": this.selectedSuiteID,
                "suiteName": this.selectedname,
                "userId": this.newUserId,
                "mode":"ngOnDestroy"
            }
            console.log(obj);
            this.webService.resetLockNUnlockParameters(obj).subscribe((data) => {
                console.log(data);
            })
        }
        //clearInterval(this.exceptStatus);
    }

    releaseSuite() {
        let obj = {
            "userName": this.newUserName,
            "projectName": this.projectDetails,
            "projectId": this.spid,
            "suiteId": this.selectedSuiteID,
            "suiteName": this.selectedname,
            "userId": this.newUserId,
            "mode":"releaseSuite"
        }
        console.log(obj);
        this.webService.resetLockNUnlockParameters(obj).subscribe((data) => {
            console.log(data);
        })
    }

    checkNormalExe(scriptsNew, event) {
        if (this.scriptsNew == null) {
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
                for (let c = 0; c < this.scriptsNew.length; c++) {
                    console.log(this.scriptsNew[c].scriptStatus)
                    // if (this.scriptsNew[c].testcaseStatus == "Pass") {
                    //     this.scriptsNew[c].check = 'true';
                    // }
                    // else {
                    //     this.scriptsNew[c].check = 'false'
                    // }
                    this.scriptsNew[c].check = 'true';
                    this.selectedTestcases = this.totalTestcases;
                }
            }
            else if (checkf == false) {
                this.checke = false;
                for (let c = 0; c < this.scriptsNew.length; c++) {
                    this.scriptsNew[c].check = 'false';
                    this.selectedTestcases = 0;
                }
            }
            console.log(this.scriptsNew)
            this.filterArr = this.scriptsNew.filter((value) => value["check"] == "true");
            console.log(this.filterArr, this.totalTestcases, this.selectedTestcases)
        }

    }

    SelectedStep(status, index) {
        this.nlpStepDetails.forEach(function (s, sindex, sarray) {
            if (sindex == index) {
                s['status'] = status;
            }
        })
    }


    closeStatus(a, b, selectedname) {
        console.log(this.stepsStatus)
        if (this.stepsStatus[this.manualScriptId] == false) {
            console.log(this.stepsStatus, this.storeStepDetails)
            var seeindex = this.manualScriptId
            this.scriptsNew.forEach(function (m, mindex, marray) {
                if (mindex == seeindex) {
                    m.checkr = false;
                    m.manualStatus = '';
                    m.manualStepDetails.forEach(function (r, rindex, rarray) {
                        r.check = 'false'
                        r.status = "NotExecuted"
                        r["started-at"] = '';
                        r["finished-at"] = '';
                    });
                }
            });
        }
        console.log(this.scriptsNew)
        this.multi.status = '';
        this.clearstat = '';
        this.checkr = false;
        this.checkBoxSe.nativeElement.checked = false;
        // var element = document.getElementById("asd");
        // console.log(element.scrollTop)
        // console.log(element.offsetTop)
        // element.scrollTop = 0;
        // a = "";
        // b = '';

        // console.log(b)
    }


    SaveStatus(a, b, nlpStepDetails) {
        this.stepsStatus[this.manualScriptId] = true;
        this.timestart = true
        var seeindex = this.manualScriptId
        this.scriptsNew.forEach(function (m, mindex, marray) {
            if (mindex == seeindex) {
                m.manualStepDetails.forEach(function (r, rindex, rarray) {
                    if (r.check == 'true') {
                        if (r.status == 'FAIL' || r.status == "NotExecuted") {
                            m.scriptStatus = "Fail"
                        }
                        else {
                            m.scriptStatus = "Pass"
                        }
                    } else {
                        r.status = "NotExecuted"
                    }
                    let endTime = new Date();
                    endTime.setMinutes(endTime.getMinutes() + 330);
                    let n = endTime.toISOString().replace(/\.[0-9]{2,3}/, '');
                    r["started-at"] = n
                    r["finished-at"] = n

                    // if (r.status == 'FAIL' || r.status == "NotExecuted") {
                    //     m.scriptStatus = "Fail"
                    // }
                    // else {
                    //     m.scriptStatus = "Pass"
                    // }
                });
            }
        });
        console.log(this.scriptsNew)

        this.scriptsNew.forEach(element => {
            element.projectId = this.spid
            element.suiteName = this.selectedSuite
        });
        this.uncheckInSaveBtn = '';
        this.multi.status = ''
        this.checkr = false;
        this.checkBoxSe.nativeElement.checked = false;
        // var element = document.getElementById("asd");
        // console.log(element.scrollTop)
        // console.log(element.offsetTop)
        // element.scrollTop = 0;
        var index
        // console.log(b)
        // a = "";
        // b = '';
        // console.log(b)

    }

    uploadDisable: any;
    upload() {
        this.screenvideor = true;
        console.log(this.filesToUpload, this.filesToUpload[0].name);
        var imageFormat = this.filesToUpload[0].name;
        var image1 = imageFormat.split('.');
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        if (image1[1] === 'png' || image1[1] === 'jpg' || image1[1] === 'PNG' || image1[1] === 'JPG') {
            this.uploadDetails = `${orgId},${this.spid},${this.newUserId},${this.selectedSuiteID},${this.scriptsNew[this.manualScriptId].moduleId},${this.scriptsNew[this.manualScriptId].featureId},${this.scriptsNew[this.manualScriptId].scriptId},${this.scriptsNew[this.manualScriptId].manualStepDetails[this.selectedStepIndex].name},${this.projectDetails}`
            console.log(this.uploadDetails)
            this.webService.makeFileRequest(this.filesToUpload, this.uploadDetails).subscribe((result) => {
                console.log(result);
                if (result != 0) {
                    console.log("saved the screenshot locally");
                    this.filesToUpload = [];
                    this.uploadDisable = true;
                    this.manualScreenPath = result[0].path.toString().split("backend\\")[1];
                    console.log(this.manualScreenPath);
                    this.manualScreenPath = this.manualScreenPath.replace(/\\/g, "/");
                    console.log(this.manualScreenPath);
                    alert("screenshot uploaded successfully");
                }
            }, (error) => {
                console.error(error);
            });
        } else {
            alert("please select image only of format .png or .jpg");
            this.activeScreenUpload = 0;
            this.manualscreenShot = '';
            this.filesToUpload = [];
            this.uploadDisable = true;
        }
    }

    fileChangeEvent(fileInput: any) {
        this.activeScreenUpload = 1;
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload)
        this.manualscreenShot = this.filesToUpload[0].name;
        this.uploadDisable = false;
    }


    /* videoFileSave(video: any) {
         this.activeVideoUpload = 1;
         this.videoToUpload = <Array<File>>video.target.files;
         console.log(this.videoToUpload);
     }*/


    /*  uploadvideo() {
          this.screenvideor = true;
          console.log(this.videoToUpload[0].name)
          var videoFormat = this.videoToUpload[0].name.split('.');
          if (videoFormat[1] === 'mp4' || videoFormat[1] === 'ogg') {
              this.webService.makeVideoRequest(this.videoToUpload).subscribe((result) => {
                  console.log(result);
                  if (result != 0) {
                      console.log("saved the video locally");
                      alert("video uploaded successfully");
                  }
              }, (error) => {
                  console.error(error);
              });
          } else {
              alert("Please select video of format .mp4 or .ogg");
              this.manualVideo = '';
          }
      }*/

    ActivateTime(index, step) {
        this.manualscreenShot = '';
        this.activeScreenUpload = 0;
        this.activeOpenFields = 0;
        this.selectedStepIndex = index;
        this.comment = step.comment;
        this.uploadDisable = false;
        console.log(step.screenShot)
        this.filesToUpload = [];
        this.uploadDisable = false;
        // this.InputVar.nativeElement.value=null;
        // console.log(this.InputVar.nativeElement)
        this.InputVar.nativeElement.innerHTML = '';
        this.InputVar.nativeElement.value = '';
        if (step.screenShot != '') {
            this.activeOpenFields = 1;
            this.uploadDisable = true;
            this.activeScreenUpload = 1
            this.manualscreenShot = step.screenShot.split('/')[2];
            this.InputVar.nativeElement.innerHTML = this.manualscreenShot;
            this.InputVar.nativeElement.value = this.manualscreenShot;
            console.log(this.manualscreenShot)
        }
    }

    ActiveData(index) {

        let mcomment;
        let mscreen;
        let mvideo;
        var activeOpen;
        var scriptNo = this.manualScriptId;
    }

    getExceptionOption(x) {
        this.exceptionOption = x;
        // x?this.sched=true:this.sched=false;
        console.log(x)
    }


    enableEmailInput: boolean = false;
    sendEmail(e, emailForm: NgForm) {
        if (e.target.checked) {
            this.enableEmailInput = true;
        }
        else {
            this.enableEmailInput = false;
            // this.emailForm.reset();
            emailForm.resetForm();
        }
    }
    emailRef: any;
    focusOutFunction(clientEmail, suiteInfo) {
        console.log(clientEmail, suiteInfo, this.emailForm.valid)

        var emailObj = {};
        emailObj["projectId"] = suiteInfo.PID,
            emailObj["suiteId"] = suiteInfo.suiteId,
            emailObj["emailConfiguration"] = clientEmail
        // this.http.post(this.api.apiData + '/sendEmailConfiguration', emailObj)
        //     .map((response: Response) => <Post[]>response.json())
        //     .subscribe(result => {
        //         console.log(result)
        //     })
    }


    selectedSuiteAbc: any;
    clientEmailId: any;
    // getScripts(selectedname, releaseVersion) {
    //     console.log(selectedname, releaseVersion)
    //     this.clientEmailId = selectedname.emailConfiguration
    //     if (this.manualExe != true) {
    //         this.suiteSelected = 1;
    //         this.scriptsNew = [];
    //         this.selectedSuite = selectedname;
    //         this.selectedRelease = releaseVersion;
    //         var getsuiteData = this.selectedSuite + "," + this.spid;
    //         this.position = 1;
    //         this.http.get(this.api.apiData + '/getting' + getsuiteData, {})
    //             .map((response: Response) => response.json())
    //             .subscribe(result => {
    //                 if (result[0].status != 'Error') {
    //                     this.allScripts = result;
    //                     console.log(this.allScripts)
    //                     console.log(this.scriptsNew)
    //                     this.scriptsNew = this.allScripts[0].SelectedScripts;
    //                     console.log(this.scriptsNew);
    //                     if (this.scriptsNew != 0) {
    //                         this.getBrowser();
    //                     }
    //                 } else {
    //                     alert("Suite does not contain scripts");
    //                 }
    //             });
    //     }
    // }

    delete(index, scriptsNew, selectedname) {
        this.checkIfSuiteLocked().subscribe(result => {
            console.log(result);
            if (result) {
                this.dialogService.openConfirmDialog('Are you sure to delete?')
                    .afterClosed().subscribe(res => {
                        console.log(res)
                        if (res === '') {
                            console.log('cancelled the operation');
                        } else {
                            console.log('The user has confirmed the operation');
                            this.fetchedScripts = scriptsNew;
                            for (let i = 0; i <= this.fetchedScripts.length - 1; i++) {
                                if (index == i) {
                                    console.log(this.fetchedScripts[i])
                                    // this.deleteData = this.fetchedScripts[i].scriptName;
                                    // this.scriptsNew[i].check = "false";
                                    if (this.scriptsNew[i].check == "true") this.selectedTestcases--;
                                    let obj = {
                                        'scriptName': this.fetchedScripts[i].scriptName, 'suitename': selectedname, "projectName": this.projectDetails,
                                        "projectId": this.spid, "moduleId": this.fetchedScripts[i].moduleId, "featureId": this.fetchedScripts[i].featureId,
                                        "scriptId": this.fetchedScripts[i].scriptId, "suiteId": this.selectedSuiteID
                                    }
                                    this.newArray = this.scriptsNew.splice(i, 1);
                                    console.log(this.scriptsNew)
                                    this.webService.deletescript(obj)
                                        .subscribe(result => {
                                            console.log(result)
                                            this.searchUpdate();
                                            if (this.scriptsNew.length == 0) { this.filterArr = []; this.checke = false; }
                                            else this.totalTestcases--;
                                            this.decoratorServiceKey.saveSnackbar('Deleted Successfully', '', 'save-snackbar')
                                        })
                                }
                            }

                        }
                    })
            } else {
                return;
            }
        })

    }
    filterArr: any;
    uncheck(index, scriptsNew, module, event) {
        console.log(this.scriptsNew, this.multiBrowser.browserName, this.multiBrowser.versionName)
        console.log(this.multiBrowser.browserName["browserName"])
        console.log(this.multiBrowser.versionName["versionName"], typeof(this.multiBrowser.versionName["versionName"]))
        console.log(this.multiBrowser.browserName.version.length, Object.keys(this.multiBrowser.versionName.versionName).length)

        this.removedArray = [...scriptsNew];
        for (let i = 0; i < this.removedArray.length; i++) {
            if (index == i) {
                if (this.scriptsNew[i].check == 'true') {
                    this.scriptsNew[i].check = "false";
                    this.selectedTestcases--;
                }
                else if (this.scriptsNew[i].check == "false") {
                    this.scriptsNew[i].check = 'true';
                    this.selectedTestcases++;
                    if (this.multiBrowser.browserName["browserName"] != '') {
                        this.scriptsNew[i].browser = this.multiBrowser.browserName["browserName"];
                        this.version[i] = this.allVersions[0].version;
                    }
                    if (this.multiBrowser.versionName["versionName"] != 'object') {
                        this.scriptsNew[i].Version = this.multiBrowser.versionName["versionName"];
                        this.scriptsNew[i].versions = this.multiBrowser.versionName;
                        this.scriptsNew[i].versionCodeName = this.multiBrowser.versionName["versionCodeName"];
                        this.scriptsNew[i].versionStatus = this.multiBrowser.versionName["status"];
                    }
                }
                else { }
                this.removedArray.splice(i, 1);
            }
        }
        this.filterArr = this.scriptsNew.filter((value) => value["check"] == "true");
        console.log(this.filterArr, this.totalTestcases, this.selectedTestcases)
        console.log(this.scriptsNew, this.multiBrowser)
        if (this.filterArr.length == 0) this.checke = false;
    }


    getversion(index, selectedBrowser) {
        console.log(selectedBrowser)
        //this.version=[];
        this.version[index] = [];
        // if(selectedBrowser=="FireFox"){
        //     for (let s = 0; s < this.scriptsNew.length; s++) {
        //         if (index == s) {
        //             this.scriptsNew[s].Version = '';
        //             console.log(this.scriptsNew);
        //         }
        //     }
        //     return false;
        // }
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        this.selectedBrowser = selectedBrowser;
        let obj = { 'browser': this.selectedBrowser, 'orgId': orgId, 'userName': this.newUserName }
        this.webService.getVersions(obj)
            .subscribe((result) => {
                this.allVersions = result;
                console.log(this.allVersions)
                if (this.allVersions.length == 0) {
                    for (let s = 0; s < this.scriptsNew.length; s++) {
                        if (index == s) {
                            this.scriptsNew[s].Version = '';
                            console.log(this.scriptsNew);
                        }
                    }
                    return false;
                }
                this.version[index] = this.allVersions[0].version;
                console.log(this.version[index])
                for (let s = 0; s < this.scriptsNew.length; s++) {
                    if (index == s) {
                        this.scriptsNew[s].browser = selectedBrowser;
                        this.scriptsNew[s].Version = '';
                        console.log(this.scriptsNew);
                    }
                }
            })
    }

    getVersions(browser) {
        this.verss = [];
        console.log(browser);
        console.log(browser.browserName);
        // if(browser.browserName=="FireFox"){
        //     return false;
        // }
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        let obj = { 'browser': browser.browserName, 'orgId': orgId, 'userName': this.newUserName }
        this.webService.getVersions(obj)
            .subscribe(async (result) => {
                this.allVersions = result;
                console.log(this.allVersions)
                if (this.allVersions.length == 0) {
                    return false;
                }
                console.log(this.allVersions[0].version);
                this.verss = this.allVersions[0].version;

                this.scriptsNew.forEach((element, elementIndex) => {
                    if (element.check == 'true') {
                        // element.browser = "";
                        // this.version[elementIndex] = [];
                        element.browser = browser.browserName;
                        this.version[elementIndex] = this.allVersions[0].version;
                        element.Version = '';
                    }
                });
            })
        console.log(this.scriptsNew)
    }

    suite: boolean = false;
    suiteclick() {
        this.suite = true;
    }

    suiteclicks() {
        this.divAS = 0;
        this.suite = false;
    }

    insertversion(index, version) {
        console.log(version)
        console.log(index + " " + version.versionName, version.versionCodeName, version.status);
        for (let s = 0; s < this.scriptsNew.length; s++) {
            if (index == s) {
                this.scriptsNew[s].Version = version.versionName;
                this.scriptsNew[s].versionCodeName = version.versionCodeName;
                this.scriptsNew[s].versionStatus = version.status;
            }
        }
        console.log(this.scriptsNew);
    }

    insertMultiVersions(version) {
        console.log(version.versionName, version.versionCodeName, version.status);
        for (let s = 0; s < this.scriptsNew.length; s++) {
            if (this.scriptsNew[s].check == 'true') {
                this.scriptsNew[s].versions = version;
                this.scriptsNew[s].Version = version.versionName;
                this.scriptsNew[s].versionCodeName = version.versionCodeName;
                this.scriptsNew[s].versionStatus = version.status;
            }
        }
        console.log(this.scriptsNew);
    }

    normalex() {
        this.parallelExecution = false;
        console.log(this.parallelExecution)
    }

    parallel(noOfBrowsers) {
        this.parallelExecution = true;
        console.log(noOfBrowsers)
        console.log(this.parallelExecution)
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

    checkAvail = []
    nextFUnction;
    ExecutionData: any = [];
    checkBrowsers(scriptsNew, clientEmailId, noOfBrowsers, btn) {
        this.ExecutionData = [];
        console.log(btn)
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        console.log(scriptsNew)
        this.checkAvail = []
        this.nextFUnction = false
        let broVer = 0;
        if (scriptsNew == undefined) {
            return alert("There are no scripts")
        }
        scriptsNew.forEach(element => {
            if (element.check === "true") {
                console.log(element.check)
                let obj1 = {
                    "browser": element.browser,
                    "Version": element.Version,
                    "versionCodeName": element.versionCodeName,
                    "versionStatus": element.versionStatus,
                    "orgId": orgId
                }
                console.log(element.Version, typeof (element.Version), element.Version instanceof Object, element.Version.length)
                if (element.browser == "") {
                    broVer = 1;
                } else if (element.Version == "" || element.Version instanceof Object) {
                    broVer = 2
                }
                this.checkAvail.push(obj1)
                console.log(this.checkAvail)
                this.ExecutionData.push(element);
            }
        })
        if (this.checkAvail.length == 0) {
            this.sc = false
            confirm("Please select script")
        } else if (clientEmailId == null || clientEmailId == ' ' || clientEmailId == undefined || this.emailForm.invalid) {
            this.sc = false
            confirm("Please enter a valid Email Id")
        } else if (broVer == 1) {
            this.sc = false
            confirm("Please select browser")
        } else if (broVer == 2) {
            this.sc = false
            confirm("Please select browser Version")
        }
        else {
            this.resultDisplayNew = '';
            this.resultDisplay = '';
            this.checkReportstatus = '';
            this.mreportno = '';
            this.checkReportPresent = false;
            if (btn == 'proceed') {
                //  this. checkBrowsersStatus(scriptsNew, noOfBrowsers, clientEmailId)

                //  this.checkDocker(scriptsNew, noOfBrowsers, clientEmailId)
                this.checkIfSuiteLocked().subscribe(result => {
                    console.log(result);
                    if (result) {
                        this.proceedExecution(this.ExecutionData, noOfBrowsers, orgId, clientEmailId);
                    } else {
                        return;
                    }
                })
            }
            else {
                this.getData123(scriptsNew, clientEmailId)
            }
            // this.webService.checkBrowsersStatus(this.checkAvail).subscribe(result => {
            //     console.log(result)
            //     let totalResultarray = result[0]
            //     console.log(totalResultarray)
            //     totalResultarray.forEach(element => {
            //          console.log(element.status)
            //         if (element.status === "Running") {
            //             this.nextFUnction = true
            //         }
            //     });
            //    console.log(this.nextFUnction)
            //     if (this.nextFUnction === false) {
            //         this.updateBrowserStatus(scriptsNew, noOfBrowsers, clientEmailId)
            //     }
            //     else {
            //         this.resultDisplayNew = " the browsers are already in use please check"
            //     }
            // })
        }


    }
    checkDocker(scriptsNew, noOfBrowsers, clientEmailId) {
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        let obj = { 'orgId': orgId }
        this.emailArray = clientEmailId.split(',')
        console.log(this.emailArray)
        this.webService.checkDocker(obj).subscribe(async (result) => {
            console.log(result)
            this.dockerStart = result;
            console.log(this.dockerStart[0].machineStatus)
            if (this.dockerStart[0].machineStatus == "Started" && this.dockerStart[0].state === "Running") {
                console.log("inside 1 if")
                this.Execution = false;
                this.resultDisplayNew = "Executing Please wait ...";
                this.checkBrowsersStatus(scriptsNew, noOfBrowsers, clientEmailId)
            }
            else {
                this.Execution = true;
                alert("Execution Machine is not Running!");
                console.log("inside 1 else")
                this.resultDisplayNew = " Please Start " + this.dockerStart[0].machineName + " Docker Machine";
                this.subject = "check the Docker Machine status";
                this.sendEmailService(this.emailArray, this.subject, this.resultDisplayNew);
            }
        })

    }



    checkBrowsersStatus(scriptsNew, noOfBrowsers, clientEmailId) {
        this.emailArray = clientEmailId.split(',')
        console.log(this.emailArray)
        this.webService.checkBrowsersStatus(this.checkAvail).subscribe(result => {
            console.log(result)
            let totalResultarray = result[0]
            console.log(totalResultarray)
            totalResultarray.forEach(element => {
                console.log(element.status)
                if (element.status === "Running") {
                    this.nextFUnction = true
                }
            });
            console.log(this.nextFUnction)
            if (this.nextFUnction === false) {
                this.Execution = false;
                this.getData(scriptsNew, noOfBrowsers, clientEmailId)
            }
            else {
                this.Execution = true;
                alert(" the browsers are already in use please check");
                this.resultDisplayNew = " the browsers are already in use please check";
                this.subject = "check browsers status";
                this.sendEmailService(this.emailArray, this.subject, this.resultDisplayNew);
            }
        })
    }

    updateBrowsersData
    updateBrowserStatus(scriptsNew, noOfBrowsers, clientEmailId) {
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        this.updateBrowsersData = []
        scriptsNew.forEach(element => {
            let objupdate = {}
            if (element.check === "true") {
                let objupdate = {
                    "browser": element.browser,
                    "Version": element.Version,
                    "versionCodeName": element.versionCodeName,
                    "versionStatus": element.versionStatus,
                    "orgId": orgId
                }
                this.updateBrowsersData.push(objupdate)
                console.log(this.updateBrowsersData)
            }
        });
        this.webService.updateStatusBrowser(this.updateBrowsersData)
            .subscribe(async (result) => {
                console.log(result)
                this.getDataOne(scriptsNew, noOfBrowsers, clientEmailId)
            })
    }

    completeobject: Object = {};
    dataData = [];
    datascriptId = [];
    scriptsNotExist: [];
    getData(scriptsNew, noOfBrowsers, email) {
        this.scriptsNotExist = []
        console.log(scriptsNew)
        this.dataData = []
        scriptsNew.forEach(element => {
            if (element.check === "true") {
                console.log(element.check)
                this.datascriptId.push(element.scriptId)
                this.dataData.push(element)
                console.log(this.datascriptId)
                console.log(this.dataData)
            }
        });
        let obj = { 'projectId': this.spid, 'dataCheck': this.datascriptId }
        this.webService.checkScriptAtProjectLevel(obj)
            .subscribe(async (result) => {
                console.log(result)
                this.scriptsNotExist = result
                if (this.scriptsNotExist.length !== 0) {
                    console.log(this.scriptsNotExist)
                    this.Execution = true;
                    alert("the scripts " + this.scriptsNotExist + " are not availabe at project level");
                    this.resultDisplayNew = "the scripts " + this.scriptsNotExist + " are not availabe at project level"
                }
                else {
                    this.Execution = false;
                    this.completeobject["testsuitename1"] = this.selectedSuite;
                    this.completeobject["pname"] = this.projectDetails;
                    this.completeobject["framework"] = this.projectframework
                    this.completeobject["scripts"] = this.dataData
                    let obj = { 'test': this.completeobject }
                    console.log(this.completeobject)
                    this.webService.insertScriptsIntoSuite(obj)
                        .subscribe(async (result) => {
                            console.log(result)
                            this.updateBrowserStatus(scriptsNew, noOfBrowsers, email)
                        })
                }
            })
    }


    data1 = [];
    dataobject: Object = {};
    xmlresult: any;
    resultDisplay: any;
    statusObject: any;
    executionObject: any;
    copiedResult: any;

    getDataOne(scriptsNew, noOfBrowsers, email) {
        let loginDetails = JSON.parse(sessionStorage.getItem('loginDetails'));

        if (this.parallelExecution == false) {
            noOfBrowsers = 1;
        }
        console.log(noOfBrowsers);
        this.data1 = [];
        for (let c = 0; c < scriptsNew.length; c++) {
            if (scriptsNew[c].check != "false") {
                if (scriptsNew[c].bName != "" && scriptsNew[c].Version != "") {
                    scriptsNew[c].projectname = this.projectDetails;
                    scriptsNew[c].suite = this.selectedSuite;
                    this.scriptsNew[c].type = 'execution';
                    this.scriptsNew[c].exceptionOption = this.exceptionOption;
                    this.scriptsNew[c].prid = this.spid;
                    this.scriptsNew[c].parallelExecution = this.parallelExecution;
                    this.scriptsNew[c].noOfBrowsers = noOfBrowsers;
                    this.scriptsNew[c].selectedRelease = this.releaseName;
                    this.scriptsNew[c].emailArray = this.emailArray
                    this.scriptsNew[c].sendMailOrNot = this.enableEmailInput;
                    this.scriptsNew[c].requirementName = scriptsNew[c].requirementName
                    this.scriptsNew[c].requirementId = scriptsNew[c].requirementId,
                        this.scriptsNew[c].details = loginDetails;
                    this.scriptsNew[c].Roles = this.pageRoles;
                    this.data1.push(scriptsNew[c]);
                } else {
                    this.resultDisplayNew = "please enter the browser name and version ";
                    alert("please enter the browser name and version ");
                    this.data1 = [];
                    return;
                }
            }
        }
        if (this.data1.length !== 0) {
            console.log(this.data1)
            let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
            let obj = { 'orgId': orgId }
            // this.webService.checkDocker(obj).subscribe(async (result) => {
            //                 console.log(result)
            //                 this.dockerStart = result
            //Commented  if (this.dockerStart[0].machineStatus === "Started") {
            console.log("inside 1 if")
            // var dockerInterval = setInterval(() => {
            this.webService.checkDockerRunning(obj).subscribe(async (result) => {
                console.log(result)
                this.dockerstat = result
                if (this.dockerstat[0].state === "Running") {
                    this.Execution = false;
                    this.SpinnerService.show();
                    this.resultDisplayNew = "Executing Please wait ...";
                    // clearInterval(dockerInterval);
                    let obj1 = { 'scriptDetails': this.data1, 'dockerDetails': this.dockerstat }
                    this.webService.insertRunNo(obj1).subscribe(result => {
                        this.multipleData = result;
                        console.log(this.multipleData)
                        this.webService.createTestNgXml(this.multipleData).subscribe(result => {
                            console.log(result)
                            this.statusObject = result;
                            this.multipleData[0].mvnStatusId = result.id;
                            this.multipleData[0].result = result.result;
                            console.log(this.multipleData[0].mvnStatusId)
                            runAndCheckReport(this.multipleData);

                        })
                    })
                }
                else {
                    this.Execution = true;
                    this.resultDisplayNew = "Execution Machine is not Running!";
                    alert("Execution Machine is not Running!");
                    console.log("inside  else")

                }
            })
            //}, 1000 * 10);

            //  Commented
            //  } else {
            //         this.resultDisplayNew = " Please Start Docker Machine";
            //         this.subject="check the Docker Machine status";
            //         this.sendEmailService(this.emailArray,this.subject,this.resultDisplayNew);
            //     }
            //   })

            var refreshData;
            var checkVar = 0;
            const runAndCheckReport = (data) => {
                //refreshData = false;
                var completeScriptData = data;
                this.webService.checkTestNgReport(data).subscribe(result1 => {
                    if (result1 === "Pass1") {
                        this.Execution = false;
                        this.resultDisplayNew = "Generating report please wait...";
                        //refreshData = true;
                        //    this.removeTracking(data);
                        //return refreshData;
                        reportCall(completeScriptData)
                    } else if (result1 === "compilationError") {
                        this.SpinnerService.hide();
                        this.updateBrowserBlocked(data);
                        // this.resultDisplayNew = "Compilation Error please check the script or respective page and objects";
                        //refreshData = "compilationError";
                        this.removeTracking(data);
                        this.webService.compilationErrLogic(data).subscribe((res) => {
                            this.resultDisplayNew = '';
                            this.resultDisplay = '';
                            this.checkReportstatus = '';
                            this.mreportno = '';
                            this.checkReportPresent = false;
                            this.completeTrackReport = res;
                            this.searchUpdate();
                            document.getElementById("openCompilation").click();
                            this.Execution = true;
                            if (this.router.url != "/projectdetail/testExecution/executionComponent") {
                                this.releaseSuite();
                            }
                            // this.dialogService.dockerDialog('Script Failed due to Compilation Error.\n'+res).afterClosed().subscribe(res => {
                            // })
                        })
                        // return refreshData;
                    }
                    // else {
                    //     this.resultDisplayNew = " Executing Please wait ...";
                    //     // refreshData = false;
                    //     // return refreshData;
                    // }
                })
                //    var refreshId = setInterval(() => {
                //         var data = checkCall(completeScriptData);
                //         console.log(refreshData)
                //         if (refreshData === true) {
                //             console.log("properID true   " + refreshData)
                //             reportCall(completeScriptData)
                //            // clearInterval(refreshId);
                //         } else if (refreshData === "compilationError") {
                //             //clearInterval(refreshId);
                //         }
                //    }, 500);
            }

            const reportCall = (data) => {
                this.webService.convertXmlToJson(data).subscribe(jsonResult => {
                    this.reportJsonResult = jsonResult;
                    if (this.reportJsonResult == 'Pass') {
                        // this.executionService.reports(data).subscribe(result1 => {
                        this.webService.insertIntoReports(data).subscribe(result1 => {
                            console.log(result1)
                            this.SpinnerService.hide();
                            this.resultDisplay = " check report # " + result1.reportNumber
                            if (result1.status != undefined) {

                                if (this.exceptionOption == true) {
                                    this.resultDisplay = " Auto Healing for report Number " + data[0].runNumber + ' please wait ...';
                                    var reportNumber = result1.reportNumber
                                    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
                                    var exceptionReq = {
                                        'projectname': this.projectDetails,
                                        "projectId": this.spid,
                                        'run': reportNumber,
                                        'orgId': orgId
                                    }
                                    this.SpinnerService.hide();
                                    this.resultDisplayNew = " Auto Healing  for report Number " + data[0].runNumber + ' please wait ...';
                                    setTimeout(() => {
                                        this.exceptionHandler(exceptionReq, this.resultDisplayNew, data);
                                    }, 4000);
                                } else {
                                    this.Execution = true;
                                    this.updateBrowserBlocked(data);
                                    this.removeTracking(data);
                                    this.checkReportPresent = true;
                                    this.checkReportstatus = data[0].runNumber
                                    this.reportroute = true
                                    //this.emailForm.reset();
                                    console.log(this.router.url)
                                    if (this.router.url != "/projectdetail/testExecution/executionComponent") {
                                        this.releaseSuite();
                                    }
                                    this.resultDisplayNew = "Execution completed check the report Number   ";
                                    sessionStorage.setItem("executedRunNum", JSON.stringify(this.checkReportstatus))
                                    sessionStorage.setItem("reportStatus", JSON.stringify(this.reportroute))
                                    this.searchUpdate()
                                }
                            }
                        })
                    }
                    else {
                        if (this.router.url != "/projectdetail/testExecution/executionComponent") {
                            this.releaseSuite();
                        }
                        this.Execution = true;
                        this.updateBrowserBlocked(data);
                        this.removeTracking(data);
                        this.resultDisplayNew = "Failed to convert the xml to Json Please run again";
                    }
                })
            }
        }
        else {
            alert("please select script to execute");
        }
    }
    updateBrowserBlocked(data) {
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        this.updateBrowsersData = []
        data.forEach(element => {
            let objupdate = {}
            if (element.check === "true") {
                let objupdate = {
                    "browser": element.browser,
                    "Version": element.Version,
                    "versionCodeName": element.versionCodeName,
                    "versionStatus": element.versionStatus,
                    "orgId": orgId
                }
                this.updateBrowsersData.push(objupdate)
                console.log(this.updateBrowsersData)
            }
        });
        this.webService.updateBrowserBlocked(this.updateBrowsersData)
            .subscribe(async (result) => {
                console.log(result)
            })
    }


    default(sname) {
        this.selectedSuite = sname;
        this.psuite = this.selectedSuite + "," + this.projectDetails;
        this.divAS = 0;
        if (this.selectedSuite == undefined) {
            alert("please select the suite name first");
        } else {
            for (let i = 0; i <= this.scriptsNew.length - 1; i++) {
                this.scriptsNew[i].browser = '';
                this.scriptsNew[i].Version = '';
                this.defaultBrowserName = '';
                this.defaultVersionName = '';
            }
            // this.http.get(this.api.apiData + '/getDefaultValues' + this.psuite, {})
            //     .map(res => res.json())
            //     .subscribe(result => {
            let obj = { 'suiteName': this.selectedSuite, 'projectId': this.spid }
            this.webService.getDefaultValues(obj).subscribe(result => {
                this.defaults = result;
                this.defaultBrowserName = this.defaults.defaultBrowser
                this.defaultVersionName = this.defaults.defaultVersion;
                for (let i = 0; i <= this.scriptsNew.length - 1; i++) {
                    this.scriptsNew[i].browser = this.defaults.defaultBrowser;
                    this.scriptsNew[i].Version = this.defaults.defaultVersion;
                };
            });
        }
    }

    split() {
        this.divAS = 1;
        for (let i = 0; i <= this.scriptsNew.length - 1; i++) {
            this.scriptsNew[i].browser = '';
            this.scriptsNew[i].Version = '';
            this.defaultBrowserName = '';
            this.defaultVersionName = '';
        }
    }

    splitAdd(browser, version) {
        var splitObject = {};
        if (browser == undefined || browser == '') {
            alert("please select the browser");
            return;
        }
        if (version == undefined || version == '') {
            alert("please select the version");
            return;
        }
        splitObject["browser"] = browser.browserName;
        splitObject["version"] = version;
        console.log(splitObject);
        this.splitArray.push(splitObject);
        this.browserName = '';
        this.versionName = '';
    }

    splitClear(browser, version) {
        this.browserName = '';
        this.versionName = '';
    }

    deleteSplit(index) {
        for (let i = 0; i <= this.splitArray.length - 1; i++) {
            if (i == index) {
                this.splitArray.splice(index, 1);
            }
        }
    }

    applySplit() {

        var originalGroupLen;
        this.splitBrowserArray = this.splitArray;
        var count = 0;
        if (this.scriptsNew.length < this.splitBrowserArray.length) {
            alert("you can't give browser combination more than Number of test scripts");
        }
        else {
            if (this.scriptsNew.length % this.splitBrowserArray.length == 0) {
                this.groupLength = (this.scriptsNew.length / this.splitBrowserArray.length);
                this.newScriptsLength = this.scriptsNew.length;
                originalGroupLen = this.groupLength;
            } else {
                this.remainder = (this.scriptsNew.length % this.splitBrowserArray.length);
                this.scriptsLength = this.scriptsNew.length;
                this.newScriptsLength = this.scriptsLength - this.remainder;
                this.groupLength = (this.newScriptsLength / this.splitBrowserArray.length);
                originalGroupLen = this.groupLength;
            }
            var j = 0;
            for (let i = 0; i <= this.scriptsNew.length - 1; i++) {
                if (i < this.newScriptsLength) {
                    if (i < this.groupLength) {
                        this.scriptsNew[i].browser = this.splitArray[j].browser;
                        this.scriptsNew[i].Version = this.splitArray[j].version;
                        if (i == this.groupLength - 1) {
                            j++;
                            if (this.groupLength < this.scriptsNew.length) {
                                this.groupLength = (originalGroupLen + this.groupLength);
                            }
                        }
                    }
                }
                else {
                    if (count == 0) {
                        j = 0;
                        this.scriptsNew[i].browser = this.splitArray[j].browser;
                        this.scriptsNew[i].Version = this.splitArray[j].version;
                        count++;
                    } else {
                        j = j + 1;
                        this.scriptsNew[i].browser = this.splitArray[j].browser;
                        this.scriptsNew[i].Version = this.splitArray[j].version;
                        count++;
                    }
                }
            }
        }
        this.displaySplit();
    }


    displaySplit() {
        this.splitDisArray = this.splitArray;
    }

    exceptStatus: any;
    exceptionHandler(exceptionReq, resultDisplay, data) {
        var exceptionData;
        exceptionData = exceptionReq;
        setTimeout(() => {
            this.webService.exceptionHandlingCall(exceptionData).subscribe(result => {
                // this.http.post(this.api.apiData + '/exceptionHandlingCall', exceptionData)
                //     .map(res => res.json())
                //     .subscribe(result => {
                console.log(result)
                if (result.status == "NoSuchElementException") {
                    let obj = {
                        'reportNum': exceptionData.run,
                        'projectName': this.projectDetails,
                        'exceptionStatusId': result.exceptionStatusId

                    }
                    this.exceptStatus = setInterval(() => {
                        console.log(obj)
                        this.resultDisplayNew = resultDisplay;
                        this.webService.exceptionStatusCall(obj).subscribe(result1 => {
                            // this.http.get(this.api.apiData + '/exceptionStatusCall', { params: obj })
                            //     .map(res => res.json())
                            //     .subscribe(result1 => {
                            if (result1.status == 'pass') {
                                if (result1.message != null) {
                                    // this.updateBrowserBlocked(data);
                                    // this.removeTracking(data);
                                    this.resultDisplayNew = result1.message + '# ' + exceptionData.run;
                                } else {
                                    this.Execution = false;
                                    if (this.router.url != "/projectdetail/testExecution/executionComponent") {
                                        this.releaseSuite();
                                    }
                                    this.checkReportPresent = true;
                                    this.checkReportstatus = exceptionData.run
                                    this.reportroute = true
                                    //this.emailForm.reset();
                                    sessionStorage.setItem("executedRunNum", JSON.stringify(this.checkReportstatus))
                                    sessionStorage.setItem("reportStatus", JSON.stringify(this.reportroute))
                                    // this.emailForm.reset();
                                    this.resultDisplayNew = "Auto Healing completed for report Number";
                                }
                                this.Execution = true;
                                clearInterval(this.exceptStatus);
                                this.updateBrowserBlocked(data);
                                this.removeTracking(data);
                            } else if (result1.status == 'fail') {
                                this.Execution = true;
                                if (this.router.url != "/projectdetail/testExecution/executionComponent") {
                                    this.releaseSuite();
                                }
                                this.updateBrowserBlocked(data);
                                this.removeTracking(data);
                                this.resultDisplayNew = "Auto Healing failed for report Number" + exceptionData.run;
                                clearInterval(this.exceptStatus);
                            } else if (result1.status == 'inProgress') {
                                this.resultDisplayNew = result1.message + '# ' + exceptionData.run;
                                clearInterval(this.exceptStatus);
                            } else {
                                this.resultDisplayNew = "Auto Healing for report Number " + exceptionData.run + ' please wait...';
                            }
                        })
                    }, 10000);
                } else {
                    this.resultDisplay = result.status;
                    this.Execution = true;
                    if (this.router.url != "/projectdetail/testExecution/executionComponent") {
                        this.releaseSuite();
                    }
                    this.updateBrowserBlocked(data);
                    this.removeTracking(data);
                    this.resultDisplayNew = "Auto Healing failed for report Number  " + exceptionData.run + "  " + result.status;
                    clearInterval(this.exceptStatus);
                }
                // if (result.status == 'pass') {
                //     this.resultDisplay = "Auto Healing for report Number  yhyhyhuh " + exceptionData.run + 'please wait';
                // }
                // else {
                //     this.resultDisplay = result.exception;
                // }
                this.exceptionStatus = result;
                console.log(this.exceptionStatus);
            })
        }, 1000)
    }


    ///////////////////////////////////////////SHIVANAND START HERE//////////////////////////
    createForm() {
        this.angForm123 = this.fb.group({
            scheduleName: ['', [Validators.required, ValidationserviceService.scheduleCreate, Validators.minLength(1), Validators.maxLength(20)]],
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

    checkStartDate(startDate, endDate, name) {
        console.log(startDate, endDate, name)
        var date = new Date()
        var enteredDate = new Date(startDate).getDate();
        if (name == "Once") {
            if (startDate < date.toISOString().split("T")[0]) {
                alert("Start date should be greater than Current date");
                this.WeeklyDetails = [];
            } else {
                return true;
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
                return true;
            }
        }

        // var obj = {}
        // const monthNames = ["January", "February", "March", "April", "May", "June",
        //     "July", "August", "September", "October", "November", "December"
        // ];
        // var date = new Date()
        // var enteredDate = new Date(fromDate).getDate();
        // if (fromDate < date.toISOString().split("T")[0]) {
        //     alert("FromDate should be greter then ToDate");
        // }
        // else if (enteredDate == 31 && name == "Monthly") {
        //     var myDate = new Date(fromDate)
        //     for (let i = 1; i < 5; i++) {
        //         var obj = {};
        //         var nextDate = new Date(myDate.getFullYear(), myDate.getMonth() + i, 0);
        //         var nextWeeek = monthNames[nextDate.getMonth()];
        //         obj["nextDate"] = nextDate;
        //         obj["nextWeeek"] = nextWeeek;
        //         this.allArray.push(obj)
        //         if (i == 4) {
        //             this.lDate = true
        //         }
        //     }
        // }
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

    timeChangeHandler(event: Event) {
        console.log(event);
    }

    checkTime(givenTime, name, startDate) {
        var date = new Date()
        var newTime = date.getHours() + ":" + date.getMinutes()
        var d2 = new Date(0, 0, 0, date.getHours(), date.getMinutes());
        var d1 = new Date(0, 0, 0, givenTime.split(":")[0], givenTime.split(":")[1]);
        console.log(givenTime, newTime, d1, d2, d1 <= d2);
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
        else {
            if (startDate == null || startDate == undefined || startDate == "undefined") {
                alert(" Please select start date..");
                this.angForm123.controls["givenTime"].reset();
            }
            //   else  if (name == "Once") {
            else if (startDate == date.toISOString().split("T")[0]) {
                if (d1 <= d2) {
                    alert(" Selected Time should greaterthan current time");
                    this.angForm123.controls["givenTime"].reset();
                }
            }
            else if (startDate < date.toISOString().split("T")[0]) {
                alert(" Start date should be greaterthan or equal to Current date");
                this.angForm123.controls["givenTime"].reset();
            }
            // }
        }
        // this.scheduleObject["givenTime"]=givenTime;
    }

    getscheduleName(scheduleName) {
        this.angForm123.controls["startDate"].reset();
        this.angForm123.controls["endDate"].reset();
        this.angForm123.controls["givenTime"].reset();
        this.angForm123.controls["weeks"].reset();
        this.angForm123.controls["hourl"].reset();
        this.WeeklyDetails = [];
        this.checkboxValue = 0;
        if (scheduleName == "Once") {
            this.startTime = true;
            this.endTime = false;
            this.week = false;
            this.hourly = false;
            this.weekEnd = false;
        }
        else if (scheduleName == "Daily") {
            this.week = false;
            this.hourly = false;
            this.weekEnd = true;
            this.startTime = true;
            this.endTime = true;
        }
        else if (scheduleName == "Weekly") {
            this.startTime = true;
            this.endTime = true;
            this.hourly = false;
            this.weekEnd = false;
            this.week = true;
        }
        else if (scheduleName == "Monthly") {
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

    getCheck(event) {
        if (event.target.checked) {
            this.checkboxValue = 1;
        } else {
            this.checkboxValue = 0;
        }
    }

    sc: boolean;
    getData123(scriptsNew, email) {
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        this.selectedSuite = this.selectedname
        console.log(email, scriptsNew)
        var emailArray = [];
        emailArray = email.split(',')
        let loginDetails = JSON.parse(sessionStorage.getItem('loginDetails'));
        this.data1 = [];
        if (this.scriptsNew.length !== 0) {

            for (let c = 0; c < scriptsNew.length; c++) {
                if (scriptsNew[c].check != "false") {
                    if (scriptsNew[c].bName != "" && scriptsNew[c].Version != "") {
                        this.sc = true
                        scriptsNew[c].projectName = this.projectDetails;
                        scriptsNew[c].suite = this.selectedSuite;
                        this.scriptsNew[c].prid = this.spid;
                        this.scriptsNew[c].emailArray = emailArray
                        this.scriptsNew[c].details = loginDetails;
                        this.scriptsNew[c].sendMailOrNot = this.enableEmailInput;

                        scriptsNew[c].type = 'schedule';
                        scriptsNew[c].orgId = orgId;
                        scriptsNew[c].exceptionOption = this.exceptionOption;
                        scriptsNew[c].selectedRelease = this.releaseName;
                        // scriptsNew[c].requirementName = scriptsNew[c].requirementName
                        // scriptsNew[c].requirementId = scriptsNew[c].requirementId,
                        scriptsNew[c].suiteId = this.selectedSuiteID,
                        scriptsNew[c].Roles = this.pageRoles;
                        this.data1.push(scriptsNew[c]);
                    }
                }
            }

        }
        console.log(this.data1)
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
    allScheduleSave(selectedSuite) {
        console.log(this.scheduleObject["type"], this.checkboxValue)
        console.log(this.angForm123)
        if (this.checkboxValue == 1) {
            this.weekend = true;
        } else {
            this.weekend = false;
        }
        this.scheduleObject["createdBy"] = this.newUserName;
        if (this.scheduleObject["type"]) {
            if (this.scheduleObject["type"] == 'Once') {
                if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
                    this.angForm123.controls["givenTime"].valid) {
                    var booleanResult = this.checkStartDate(this.scheduleObject["startDate"], this.scheduleObject["endDate"], this.scheduleObject["type"])
                    console.log(booleanResult)
                    if (booleanResult) {
                        let obj = {
                            'selectedSuite': selectedSuite,
                            "projectId": this.spid,
                        }
                        console.log(selectedSuite)
                        // this.webService.getScriptsToAdd(obj).subscribe(result => {
                        //     this.scriptsSeleted = result
                            this.allData = {
                                data: this.scheduleObject,
                                // allData: this.data1,
                                projectName: this.projectDetails,
                                "DetailsScripts": this.selectedDetails,
                                "suiteName": selectedSuite,
                                "weekend": this.weekend,
                                // "scripts": this.scriptsSeleted,
                                "scripts":this.data1,
                                "type": "schedule",
                                "exceptionOption": this.exceptionOption,
                                "releaseName": this.releaseName
                            }
                            this.webService.callForScheduleSave(this.allData).subscribe(result => {
                                if (result == "duplicates") {
                                    this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                                } else {
                                    this.decoratorServiceKey.saveSnackbar('Scheduled Successfully', '', 'save-snackbar')
                                    console.log(result)
                                    document.getElementById("cancelSched").click();
                                    this.scheduleObject = {};
                                    this.angForm123.reset();
                                    this.scriptsNew = [];
                                    this.filterArr = [];
                                }
                            })
                        // })
                    }
                } else {
                    alert("Please fill *(mark) mandatory fields")
                }
            }
            else if (this.scheduleObject["type"] == 'Daily') {
                if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
                    this.angForm123.controls["endDate"].valid && this.angForm123.controls["givenTime"].valid) {
                    var booleanResult = this.checkStartDate(this.scheduleObject["startDate"], this.scheduleObject["endDate"], this.scheduleObject["type"])
                    console.log(booleanResult)
                    if (booleanResult) {
                        let obj = {
                            'selectedSuite': selectedSuite,
                            "projectId": this.spid,
                        }
                        console.log(selectedSuite)
                        // this.webService.getScriptsToAdd(obj).subscribe(result => {
                        //     this.scriptsSeleted = result
                            this.allData = {
                                data: this.scheduleObject,
                                // allData: this.data1,
                                projectName: this.projectDetails,
                                "DetailsScripts": this.selectedDetails,
                                "suiteName": selectedSuite,
                                "weekend": this.weekend,
                                // "scripts": this.scriptsSeleted,
                                "scripts":this.data1,
                                "type": "schedule",
                                "exceptionOption": this.exceptionOption,
                                "releaseName": this.releaseName
                            }
                            this.webService.callForScheduleSave(this.allData).subscribe(result => {
                                if (result == "duplicates") {
                                    this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                                } else {
                                    this.decoratorServiceKey.saveSnackbar('Scheduled Successfully', '', 'save-snackbar')
                                    console.log(result)
                                    document.getElementById("cancelSched").click();
                                    this.scheduleObject = {};
                                    this.angForm123.reset();
                                    this.scriptsNew = [];
                                    this.filterArr = [];
                                }
                            })
                        // })
                    }
                } else {
                    alert("Please fill *(mark) mandatory fields")
                }
            }
            else if (this.scheduleObject["type"] == 'Weekly') {
                if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
                    this.angForm123.controls["endDate"].valid && this.angForm123.controls["givenTime"].valid && this.angForm123.controls["weeks"].valid) {
                    var booleanResult = this.checkStartDate(this.scheduleObject["startDate"], this.scheduleObject["endDate"], this.scheduleObject["type"])
                    console.log(booleanResult)
                    if (booleanResult) {
                        let obj = {
                            'selectedSuite': selectedSuite,
                            "projectId": this.spid,
                        }
                        console.log(selectedSuite)
                        // this.webService.getScriptsToAdd(obj).subscribe(result => {
                        //     this.scriptsSeleted = result
                            this.allData = {
                                data: this.scheduleObject,
                                // allData: this.data1,
                                projectName: this.projectDetails,
                                "DetailsScripts": this.selectedDetails,
                                "suiteName": selectedSuite,
                                "weekend": this.weekend,
                                // "scripts": this.scriptsSeleted,
                                "scripts":this.data1,
                                "type": "schedule",
                                "exceptionOption": this.exceptionOption,
                                "releaseName": this.releaseName
                            }
                            this.webService.callForScheduleSave(this.allData).subscribe(result => {
                                if (result == "duplicates") {
                                    this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                                } else {
                                    this.decoratorServiceKey.saveSnackbar('Scheduled Successfully', '', 'save-snackbar')
                                    console.log(result)
                                    document.getElementById("cancelSched").click();
                                    this.scheduleObject = {};
                                    this.angForm123.reset();
                                    this.scriptsNew = [];
                                    this.filterArr = [];
                                }
                            })
                        // })
                    }
                } else {
                    alert("Please fill *(mark) mandatory fields")
                }
            }
            else if (this.scheduleObject["type"] == 'Monthly') {
                if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
                    this.angForm123.controls["endDate"].valid && this.angForm123.controls["givenTime"].valid) {
                    var booleanResult = this.checkStartDate(this.scheduleObject["startDate"], this.scheduleObject["endDate"], this.scheduleObject["type"])
                    console.log(booleanResult)
                    if (booleanResult) {
                        let obj = {
                            'selectedSuite': selectedSuite,
                            "projectId": this.spid,
                        }
                        console.log(selectedSuite)
                        // this.webService.getScriptsToAdd(obj).subscribe(result => {
                        //     this.scriptsSeleted = result
                            this.allData = {
                                data: this.scheduleObject,
                                // allData: this.data1,
                                projectName: this.projectDetails,
                                "DetailsScripts": this.selectedDetails,
                                "suiteName": selectedSuite,
                                "weekend": this.weekend,
                                // "scripts": this.scriptsSeleted,
                                "scripts":this.data1,
                                "type": "schedule",
                                "exceptionOption": this.exceptionOption,
                                "releaseName": this.releaseName
                            }
                            this.webService.callForScheduleSave(this.allData).subscribe(result => {
                                if (result == "duplicates") {
                                    this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                                } else {
                                    this.decoratorServiceKey.saveSnackbar('Scheduled Successfully', '', 'save-snackbar')
                                    console.log(result)
                                    document.getElementById("cancelSched").click();
                                    this.scheduleObject = {};
                                    this.angForm123.reset();
                                    this.scriptsNew = [];
                                    this.filterArr = [];
                                }
                            })
                        // })
                    }
                } else {
                    alert("Please fill *(mark) mandatory fields")
                }
            }
            else if (this.scheduleObject["type"] == 'Hourly') {
                if (this.angForm123.controls["scheduleName"].valid && this.angForm123.controls["desc"].valid && this.angForm123.controls["startDate"].valid &&
                    this.angForm123.controls["endDate"].valid && this.angForm123.controls["givenTime"].valid && this.angForm123.controls["hourl"].valid) {
                    var booleanResult = this.checkStartDate(this.scheduleObject["startDate"], this.scheduleObject["endDate"], this.scheduleObject["type"])
                    console.log(booleanResult)
                    if (booleanResult) {
                        let obj = {
                            'selectedSuite': selectedSuite,
                            "projectId": this.spid,
                        }
                        console.log(selectedSuite)
                        // this.webService.getScriptsToAdd(obj).subscribe(result => {
                        //     this.scriptsSeleted = result
                            this.allData = {
                                data: this.scheduleObject,
                                // allData: this.data1,
                                projectName: this.projectDetails,
                                "DetailsScripts": this.selectedDetails,
                                "suiteName": selectedSuite,
                                "weekend": this.weekend,
                                // "scripts": this.scriptsSeleted,
                                "scripts":this.data1,
                                "type": "schedule",
                                "exceptionOption": this.exceptionOption,
                                "releaseName": this.releaseName
                            }
                            this.webService.callForScheduleSave(this.allData).subscribe(result => {
                                if (result == "duplicates") {
                                    this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                                } else {
                                    this.decoratorServiceKey.saveSnackbar('Scheduled Successfully', '', 'save-snackbar')
                                    console.log(result)
                                    document.getElementById("cancelSched").click();
                                    this.scheduleObject = {};
                                    this.angForm123.reset();
                                    this.scriptsNew = [];
                                    this.filterArr = [];
                                }
                            })
                        // })
                    }
                } else {
                    alert("Please fill *(mark) mandatory fields")
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
        this.checkboxValue = 0;
        this.scheduleObject = {};
        this.angForm123.reset();
    }

    //////////////////////////////////////////////////SHIVANAND END HERE/////////////////////
    permissions = [];
    edit: boolean
    read: boolean
    deletePage: boolean
    create: boolean;
    getRolesPermissions() {
        this.roles.getPermissions(this.pageRoles).subscribe(
            Data => {
                this.permissions = Data; console.log(this.permissions);
                this.edit = this.permissions[0].edit;
                this.read = this.permissions[0].read
                this.deletePage = this.permissions[0].delete
                console.log(this.deletePage);
                this.create = this.permissions[0].create
            })
    }

    storeStepDetails: any;
    stepsStatus = [];
    fetchScriptNlpData(data, index) {
        var datamy;
        this.manualScriptId = index;
        console.log(this.scriptsNew)
        console.log(this.checkr, index)
        for (let c = 0; c < this.scriptsNew.length; c++) {
            if (index == c) {
                if (this.scriptsNew[c].checkr == false) {
                    this.checkr = false;
                }
                else {
                    this.checkr = true;
                }
                this.multi.status = this.scriptsNew[c].manualStatus;
                // datamy = e.manualStepDetails;
                // console.log(e.checkr)
                // console.log(this.manualMulticheck)
            }
        }
        this.scriptsNew.forEach(function (e, eindex, earray) {
            let startedAt = new Date();
            startedAt.setMinutes(startedAt.getMinutes() + 330);
            let finalstartedAt = startedAt.toISOString().replace(/\.[0-9]{2,3}/, '');
            e['startedAt'] = finalstartedAt;
            if (index === eindex) {
                // if(e.checkr==false){
                //     this.checkr=false;
                // }
                // else{
                //     this.checkr=true;
                // }
                datamy = e.manualStepDetails;
                // console.log(e.checkr)
            }
        })
        console.log(this.checkr)
        this.nlpStepDetails = datamy;
        this.storeStepDetails = datamy;
        //document.getElementById('seeSteps').click();
        console.log(this.nlpStepDetails)
    }

    SaveStepData1(comment, screenShot, video) {
        var stepId = this.selectedStepIndex
        let line = [];
        let manualscreenShot;
        let maunalbrowserName = "chrome";
        let manualbrowserVersion = "74.66";
        console.log(screenShot)
        if (screenShot != '') {
            // var checkScreen = screenShot.split('\\');
            // console.log(checkScreen)
            //this.manualscreenShot=screenShot;
            // var checkVideo = video.split('\\');
            // manualscreenShot = `uploads/manualScreenShots/${checkScreen[2]}`;
            manualscreenShot = this.manualScreenPath;
        } else {
            this.manualscreenShot = '';
            manualscreenShot = '';
        }
        // let manualvideo = `../uploads/opal/manualVideos/${checkVideo[2]}`;
        line.push(maunalbrowserName, manualbrowserVersion, manualscreenShot);
        let reporter = {
            "line": line
        }
        this.nlpStepDetails.forEach(function (r, rindex, rarray) {
            if (stepId == rindex) {
                r["comment"] = comment;
                r["reporter-output"] = reporter;
                r["screenShot"] = manualscreenShot
                // r["video"] = manualvideo
            }
        })
        console.log(this.nlpStepDetails)
    }


    generateDataArray = []
    GenerateManualReportOne() {
        this.resultDisplayNew = '';
        this.resultDisplay = '';
        this.checkReportstatus = '';
        this.mreportno = '';
        this.checkReportPresent = false;
        this.generateDataArray = []
        this.scriptsNew.forEach(element => {
            if (element.check == "true") {
                this.generateDataArray.push(element)
            }
        });
        console.log(this.generateDataArray.length)
        if (this.generateDataArray.length == 0) {
            confirm("Please select script")
            return false;
        } else {
            this.generateDataArray.forEach(element => {
                element.PID = this.spid
                element.testsuitename = this.selectedname
                element.executedBy = this.newUserName
                element.releaseVersion = this.releaseName
                if (this.timestart == false) {
                    element.manualStepDetails.forEach(function (r, rindex, rarray) {
                        let endTime = new Date();
                        endTime.setMinutes(endTime.getMinutes() + 330);
                        let n = endTime.toISOString().replace(/\.[0-9]{2,3}/, '');
                        r["started-at"] = n
                        r["finished-at"] = n
                    });
                }
                // element.manualStepDetails.forEach(function (r, rindex, rarray) {
                //     if(r.check=='false'){
                //         console.log(r.check,rindex)
                //         rarray.splice(rindex,1);
                //     }
                // })
            })
            // this.executionService.manualReportGeneratorOne(this.generateDataArray).subscribe(
            //     result => {
            console.log(this.generateDataArray)
            this.webService.manualReportGenerator(this.generateDataArray).subscribe(result => {
                // this.stepsStatus=false;
                this.manualReportResult = result;
                this.mreportno = this.manualReportResult.message + " " + this.manualReportResult.run
            });
        }
    }


    // GenerateManualReport() {
    //     console.log(this.scriptsNew)
    //     var checkgene
    //     var checkcheck
    //     var checkchecks
    //     var i = 0;
    //     this.generateDataArray = []
    //     var status
    //     var index
    //     var video
    //     this.SelectedStep(status, index)
    //     let endedAt = new Date()
    //     endedAt.setMinutes(endedAt.getMinutes() + 330);
    //     let finalendedAt = endedAt.toISOString().replace(/\.[0-9]{2,3}/, '');
    //     let selectedCheckBox = [];
    //     let generateReportData = [];
    //     generateReportData[0] = {
    //         endedAt: finalendedAt,
    //         suiteName: this.selectedSuite,
    //         projectName: this.projectDetails,
    //         projectId: this.spid

    //     };
    //     this.manualStepData[0].manualScriptDetails.forEach((element, index) => {
    //         console.log(index)
    //         checkcheck = element.check;
    //         checkchecks = element.scriptStatus
    //         if (checkcheck === 'true' || checkchecks != 'NotExecuted') {
    //             selectedCheckBox.push(this.manualStepData[0].manualScriptDetails[index])
    //             generateReportData[0].manualScriptDetails = selectedCheckBox;
    //         }
    //     })
    //     this.executionService.manualReportGenerator(this.generateDataArray).subscribe(
    //         result => {
    //             this.manualReportResult = result;
    //             this.allowReport = true;
    //             this.mreportno = this.manualReportResult.message + " " + this.manualReportResult.run
    //         });
    // }

    chekss = [];
    checks(scriptsNew, event) {

        var checkf
        this.chekss = [];
        checkf = event.target.checked
        console.log(checkf)
        this.scriptsNew.generatecheck = checkf;
        if (checkf == true) {
            this.checkd = true;
            for (let c = 0; c < this.scriptsNew.length; c++) {
                this.scriptsNew[c].check = 'true';
                this.selectedTestcases = this.totalTestcases;
            }
        }
        else if (checkf == false) {
            this.checkd = false;
            for (let c = 0; c < this.scriptsNew.length; c++) {
                this.scriptsNew[c].check = 'false';
                this.selectedTestcases = 0;
            }
        }
    }

    arraypush(index, scriptsNew) {
        for (let i = 0; i < this.scriptsNew.length; i++) {
            if (index == i) {
                if (this.scriptsNew[i].check == 'true') {
                    this.scriptsNew[i].check = "false";
                    this.selectedTestcases--;
                }
                else if (this.scriptsNew[i].check == 'false') {
                    this.scriptsNew[i].check = 'true';
                    this.selectedTestcases++;
                }
                else { }
            }
        }
        // this.scriptsNew.forEach(element => {
        //     // if (element.check == 'false') {
        //     element.scriptStatus = 'NotExecuted';
        //     element.manualStepDetails.forEach(element => {
        //         element.status = 'NotExecuted';
        //     })
        //     // }
        // });
    }

    saveScriptStatus(status, index) {
        this.scriptsNew.forEach(element => {
            if (element.check == 'true') {
                if (status == 'PASS') {
                    element.scriptStatus = 'Pass';
                }
                else {
                    element.scriptStatus = status;
                }
                element.manualStepDetails.forEach(element => {
                    element.status = status;
                })
            }
        });
        console.log(this.scriptsNew)
    }


    uncheckInSaveBtn: any;
    globalCheck: boolean;
    schecks(nlpStepDetails, event) {
        //this.checkr = true;
        var checkt;
        checkt = event.target.checked;
        this.uncheckInSaveBtn = checkt;
        console.log(checkt)
        if (checkt == true) {
            this.checkr = true;
            this.scriptsNew[this.manualScriptId].checkr = true;
            for (let c = 0; c < this.nlpStepDetails.length; c++) {
                this.nlpStepDetails[c].check = 'true';
            }
        }
        else if (checkt == false) {
            this.checkr = false;
            this.scriptsNew[this.manualScriptId].checkr = false;
            for (let c = 0; c < this.nlpStepDetails.length; c++) {
                this.nlpStepDetails[c].check = 'false';
            }
        }
    }

    arraypushs(nlpStepDetails, index) {
        for (let i = 0; i < this.nlpStepDetails.length; i++) {
            if (index == i) {
                if (this.nlpStepDetails[i].check == 'true') {
                    this.nlpStepDetails[i].check = "false";
                }
                else if (this.nlpStepDetails[i].check == 'false') {
                    this.nlpStepDetails[i].check = 'true';
                }
                else { }
            }
        }
        this.nlpStepDetails.forEach(element => {
            if (element.check == 'false') {
                element.status = 'NotExecuted';
            }
        });
    }


    clearstat: any;
    multi = {
        "status": ''
    };

    multiBrowser = {
        "browserName": {
            "browserName": "",
            "version": []
        },
        "versionName": {
            "versionName": {}
        }
    };

    selectedstepdetailss(status) {
        this.clearstat = status;
        this.scriptsNew[this.manualScriptId].manualStatus = status;
        this.nlpStepDetails.forEach(element => {
            if (element.check == 'true') {
                element.status = status;
            }
        });
        this.nlpStepDetails.forEach(element => {
            if (element.status == 'NotExecuted') {
                this.savestat = true;
            }
            else {
                this.savestat = false;
            }
        });
        console.log(status, this.nlpStepDetails)
        console.log(this.scriptsNew)
    }


    ForTreeStructureAllReleases() {
        let obj = {
            "projectId": this.spid
        }
        this.getAllreleases.getAllReleaseData(obj).subscribe(res => {
            this.SpinnerService.hide();
            this.displayModuleForTree = res;
            console.log(this.displayModuleForTree)
            this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
            this.sortSuites();
            this.pageName = res;
        });
    }

    sortSuites() {
        for (var i = 0; i < this.displayModuleForTree.length; i++) {
            if (this.displayModuleForTree[i].children.length !== 0) {
                this.displayModuleForTree[i].children.sort((a, b) => a.label.localeCompare(b.label))
            }
        }
    }

    openWhenClic: boolean;
    selectedname: any;
    selectedSuiteID: any;
    openMenuData(pageName, bb) {
        console.log(bb)

        if (bb.parent !== undefined) {
            this.selectedSuiteID = bb.suiteID
            this.openWhenClic = true;
            this.releaseName = bb.parent.label
            this.selectedname = bb.label;
            console.log(this.selectedname)
            this.latestupdate()
            this.allmodules()
            this.callURL()
            this.scriptsNew = [];
            this.filterArr = [];
            this.checke = false;
            this.verss = [];
            this.checkd = false
        }


    }

    latestupdate() {
        let obj = { 'projectId': this.spid, 'suiteName': this.selectedname }
        this.webService.getlatest(obj)
            .subscribe(Data => {
                this.latestTestData = Data;
                console.log(Data)
                this.callLatestUpdate(this.latestTestData)
            });
    }

    callLatestUpdate(Data) {
        console.log(Data)
        // this.http.post(this.api.apiData + '/callForUpdateLatest', Data)
        //     .map(res => res.json())
        //     .subscribe(result => {
        this.webService.callForUpdateLatest(Data).subscribe(result => {
            console.log(result)
        })
    }


    displayModuleForTree: Post[];
    items: { label: string; command: (event: any) => void; }[];
    async nodeSelect(file) {
        console.log(file.node)
        if (file.node != undefined) {
            if (file.node.data == "release") {
                this.pageName = file.node.label;
                for (let index = 0; index < this.displayModuleForTree.length; index++) {
                    if (file.node.label === this.displayModuleForTree[index]['label']) {
                        break;
                    }
                }
            } else if (file.node.data == "suite") {
                this.selectedSuiteID = file.node.suiteID
                this.releaseName = file.node.parent.label
                this.selectedname = file.node.label;
                console.log(this.selectedname)
                // this.latestupdate()
                // this.allmodules()
                // this.callURL()
                this.scriptsNew = [];
                this.filterArr = [];
                this.checke = false;
                this.verss = [];
                this.checkd = false;
                this.featureNames = [];
                this.featureNames = [{ featureId: 'All', featureName: "All" }]
                // let obj = {
                //     "projectId": this.spid,
                //     "suiteName": this.selectedname,
                //     "userName": this.newUserName,
                //     "userId": this.newUserId
                // }
                // console.log(obj);
                this.totalTestcases = '';
                this.selectedTestcases = '';
                this.resultDisplayNew = '';
                this.resultDisplay = '';
                this.checkReportstatus = '';
                this.mreportno = '';
                this.checkReportPresent = false;
                this.jenkinsbutton = false
                // console.log(this.checkIfSuiteLocked());
                this.SpinnerService.show();
                this.releaseSuite();
                this.checkIfSuiteLocked().subscribe(result => {
                    console.log(result);
                    if (result) {
                        this.openWhenClic = true;
                        this.latestupdate()
                        this.allmodules()
                        this.callURL()
                        this.navSuite=true;
                    } else {
                         this.SpinnerService.hide();
                        this.navSuite=false;
                        this.openWhenClic = false;
                    }
                })

                // this.webService.checkIfSuiteLockedService(obj).subscribe((result) => {
                //     console.log(result)
                //     if (result["beingUsedBy"] == "lockedNow") {
                //         this.openWhenClic = true;
                //     } else {
                //         this.dialogService.dockerDialog(`${result["beingUsedBy"]} is working on it, Suite will be available as soon as current user releases it`)
                //             .afterClosed().subscribe(res => {
                //                 this.openWhenClic = false;
                //             })
                //     }
                // })
            } else {
                this.items = [];
            }
        } else {
            console.log(file.node);
            return;
        }
    }


    checkIfSuiteLocked(): Observable<boolean> {
        var subject = new Subject<boolean>();
        let obj = {
            "projectId": this.spid,
            "suiteName": this.selectedname,
            "suiteId": this.selectedSuiteID,
            "userName": this.newUserName,
            "userId": this.newUserId
        }
        console.log(obj);
        // this.webService.checkIfSuiteLockedService(obj).subscribe((result) => {
        //     console.log(result)
        //     if (result["beingUsedBy"] == "lockedNow") {
        //         this.webService.checkIfSuiteRunning(obj).subscribe((result1) => {
        //             console.log(result1)
        //             if (result1["beingUsedBy"] == "lockNow") {
        //                 subject.next(true);
        //             }
        //             else {
        //                 if (this.newUserName == result1["beingUsedBy"]) {
        //                     this.dialogService.dockerDialog(`${result1["suiteName"]} is executing Please wait until the exection is completed`)
        //                         .afterClosed().subscribe(res => { })
        //                     subject.next(false);
        //                 } else {
        //                     this.dialogService.dockerDialog(`${result1["beingUsedBy"]} is executing this suite, ${result1["suiteName"]} will be available as soon as execution is completed`)
        //                         .afterClosed().subscribe(res => { })
        //                     subject.next(false);
        //                 }
        //             }
        //         })
        //     } else {
        //         this.dialogService.dockerDialog(`${result["beingUsedBy"]} is working on it, ${result["suiteName"]} will be available as soon as current user releases it`)
        //             .afterClosed().subscribe(res => { })
        //         subject.next(false);
        //     }
        // })

        this.webService.checkIfSuiteRunning(obj).subscribe((result1) => {
            console.log(result1)
            if (result1["beingUsedBy"] == "lockNow") {
                this.webService.checkIfSuiteLockedService(obj).subscribe((result) => {
                    console.log(result)
                    if (result["beingUsedBy"] == "lockedNow") {
                        subject.next(true);
                    } else {
                        this.dialogService.openAlert(`${result["beingUsedBy"]} is working on it, ${result["suiteName"]} will be available as soon as current user releases it`)
                            .afterClosed().subscribe(res => { })
                        subject.next(false);
                    }
                })
            }
            else {
                if (this.newUserName == result1["beingUsedBy"]) {
                    this.dialogService.openAlert(`${result1["suiteName"]} is executing Please wait until the exection is completed`)
                        .afterClosed().subscribe(res => { })
                    subject.next(false);
                } else {
                    this.dialogService.openAlert(`${result1["beingUsedBy"]} is executing this suite, ${result1["suiteName"]} will be available as soon as execution is completed`)
                        .afterClosed().subscribe(res => { })
                    subject.next(false);
                }
            }
        })
        return subject.asObservable();
    }

    dataTest
    TestersCall(selectedTester) {
        var tester = 0
        this.dataTest = []
        if (this.scriptsNew == undefined || this.scriptsNew.length == 0) {
            alert("There are no scripts")
            return
        }
        this.scriptsNew.forEach(element => {
            if (element.check === "true") {
                element.tester = selectedTester
                element.suitename = this.selectedSuite
                element.projectId = this.spid
                element.role = "Execution Engineer"
                this.dataTest.push(element)
                tester++;
            }
        })
        if (tester == 0) {
            alert("Please select atleast one scripts")
            return
        }
        this.webService.insertTesters(this.dataTest).subscribe(
            result => {
                this.decoratorServiceKey.saveSnackbar('Assigned Successfully', '', 'save-snackbar')
                console.log(result)
            });
    }

    removeTracking(data) {
        let obj = {
            "RunNo": data[0].runNumber,
            "projectId": data[0].prid
        }
        this.webService.removeData(obj)
            .subscribe((res) => {
                console.log(res)
            })
    }

    sendEmailService(email, subject, message) {
        console.log(email[0], subject, message)
        let obj = {
            'emailArray': email[0],
            'message': message,
            'subject': subject
        }
        this.webService.sendEmail(obj).
            subscribe((res) => {
                console.log(res)
            })
    }

    finalData: any = [];
    proceedExecution(scriptsNew, noOfBrowsers, orgId, clientEmailId) {
        this.finalData = [];
        var obj = {};
        if (this.parallelExecution == false) {
            noOfBrowsers = 1;
        }
        let loginDetails = JSON.parse(sessionStorage.getItem('loginDetails'));
        console.log(scriptsNew)
        for (let c = 0; c < scriptsNew.length; c++) {
            scriptsNew[c].orgId = orgId;
            scriptsNew[c].projectname = this.projectDetails;
            scriptsNew[c].suite = this.selectedSuite;
            scriptsNew[c].exceptionOption = this.exceptionOption;
            scriptsNew[c].type = 'execution';
            scriptsNew[c].prid = this.spid;
            scriptsNew[c].parallelExecution = this.parallelExecution;
            scriptsNew[c].noOfBrowsers = noOfBrowsers;
            scriptsNew[c].selectedRelease = this.releaseName;
            scriptsNew[c].emailArray = clientEmailId.split(',');
            scriptsNew[c].sendMailOrNot = this.enableEmailInput;
            scriptsNew[c].requirementName = scriptsNew[c].requirementName
            scriptsNew[c].requirementId = scriptsNew[c].requirementId,
                scriptsNew[c].suiteId = this.selectedSuiteID,
                scriptsNew[c].details = loginDetails;
            scriptsNew[c].Roles = this.pageRoles;
            this.finalData.push(scriptsNew[c]);
        }
        console.log(this.finalData)
        obj = {
            "data": this.finalData
        }
        console.log(obj)
        this.decoratorServiceKey.saveSnackbar('Suite Intialized sucessfully', '', 'save-snackbar')
        this.webService.startExecution(obj).subscribe((response) => {
            console.log(response)
        })
    }

}




