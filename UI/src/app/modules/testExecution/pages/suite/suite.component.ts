import { Component, OnInit } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { apiServiceComponent } from '../../../../core/services/apiService';
// import { URLSearchParams } from '@angular/http';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { Post } from '../../../../post';
import { roleService } from '../../../../core/services/roleService';
import { DialogService } from '../../../../core/services/dialog.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { FormBuilder, FormGroup, Validators, RequiredValidator } from '@angular/forms';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { ThrowStmt } from '@angular/compiler';
import { SuiteService } from '../../../../core/services/suiteService.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebExecutionService } from '../../../../core/services/web-execution.service';

@Component({
    selector: 'app-suite',
    templateUrl: './suite.component.html',
    styleUrls: ['./suite.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
    providers: [ProjectDetailServiceComponent, apiServiceComponent, roleService, SuiteService, WebExecutionService]
})


export class SuiteComponent implements OnInit {
    suite: any;
    desc: any
    suitedata: any;
    projectDetails: any;
    pid: any;
    slectedproject: any;
    projectID: any;
    editdata: any;
    suiteupdate: any;
    opinion: any;
    suiteId: any;
    _id: any;
    pedit: any;
    browser: any;
    dbrowsers: any;
    editsuite: any;
    editconfig: any;
    esuite: any;
    edesc: any;
    time: any;
    defaultBrowser: any;
    defaultVersion: any;
    selectedBrowser: any;
    allversions: any;
    version: any;
    updatedConfig: Object = {};
    updatedArray: Object = {};
    suiteConfig: Object = {};
    suiteArray: Object = {};
    oldsuite: any;
    editmodal: any;
    suiteconfig: any;
    projectConfig: any;
    IsmodelShow: any;
    newRole: any;
    pageRoles: Object = {}
    pageName: any;
    userForm: FormGroup;
    userForm1: FormGroup;
    selectedProject: any;
    projectidRelease: any;
    activeReleaseVer: any;
    releaseId: any;
    nonEdit: boolean;
    projectframework: any;
    apiConfig: boolean;
    time1: any;
    defaultBrowser1: any;
    defaultVersion1: any;
    projectConfig1: any;
    copyFrom: boolean;
    copyFroms: boolean;
    deleteArray: Object = {};;
    frameworkId: any;
    resp: any;
    suiteSave: any;
    spinnerVal: any;
    copySuite: any;

    suiteCreate: boolean;
    displaySuitesTable: boolean;
    releaseclicked: boolean = false;

    constructor(private roles: roleService,
        private dialogService: DialogService,
        // private http: Http,
        private data: ProjectDetailServiceComponent,
        private api: apiServiceComponent,
        private decoratorServiceKey: DecoratorService,
        private suiteService: SuiteService,
        private formBuilder: FormBuilder, private SpinnerService: NgxSpinnerService,
        private webService: WebExecutionService) {
        this.nonEdit = false;
    }


    ngOnInit() {
        this.projectDetails = this.data.selectedProject();
        this.slectedproject = this.projectDetails;
        this.pedit = 0;
        this.selectedProject = sessionStorage.getItem('selectedProject')
        this.selectedProject = JSON.parse(this.selectedProject)
        this.projectidRelease = this.selectedProject.projectId;
        this.frameworkId = this.selectedProject.frameworkId;
        this.suiteconfig = 1;
        this.pageName = "CreatSuite"
        this.newRole = sessionStorage.getItem('newRoleName');
        this.pageRoles = {
            pageName: this.pageName,
            roleName: this.newRole
        }
        this.apiConfig = true;
        this.getRolesPermissions()
        this.validationstart();
        this.framework()
        this.getBrowser();
        this.getSuites();
        this.defaultConfig();
        this.releaseV()
        this.fetchExceptionSuites()
        this.spinnerVal = '';
        this.time = 10;
        this.defaultVersion = '56.0.2924.87';
        this.selct = false;
        this.suiteSave = true;
        this.copySuite = '';
        this.SpinnerService.hide();
        this.releaseclicked = false;

    }

    // when select release dropdown
  spliceDefault(releaseId) {
        this.releaseclicked = true;
        console.log(releaseId);
    }

    // when close the dropdown
    addDefault(releaseId) {
        if (this.releaseId == "Select Release") {
            this.releaseclicked = false;
        }
        console.log(releaseId);
    }

    /*logic description: creating suite form
   */
    validationstart() {
        this.userForm = this.formBuilder.group({
            'Suitecreation': ['', [Validators.required, ValidationserviceService.suitecreate, Validators.minLength(1),
            Validators.maxLength(20)]],
            'Description': ['', [Validators.required, ValidationserviceService.desccreate, Validators.minLength(1),
            Validators.maxLength(300)]],
            'releaseId': ['', [Validators.required]],
            'copySuite': ['']
        });
        this.userForm1 = this.formBuilder.group({
            'createtime': ['', [Validators.required, Validators.min(10),
            Validators.max(25)]],
            'createbrowser': ['', [Validators.required]],
            'createversion': ['', [Validators.required]],
        });
    }

    //*logic description: when user releasing the pressed key up
    onKeyUp(x) {
        console.log(x.target.value)
        this.time = x.target.value.replace(/[e\+\-\.]/gi, "");
    }

    /*logic description: when user pressing any key down
   */
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

/*logic description: fetching the framework from database on projectId
   */
    framework() {
        let obj = { 'projectId': this.projectidRelease }
        this.suiteService.getFramework(obj)
            .subscribe(async (doc) => {
                console.log(doc)
                this.projectframework = doc[0].framework;
                if (this.projectframework == 'Api') {
                    this.apiConfig = false;
                }
            })
    }

    /*logic description: fetching the suites available under the project
   */
    getSuites() {
        this.suite = '';
        this.desc = '';
        let obj = { 'projectId': this.projectidRelease }
        this.suiteService.getSuite(obj)
            .subscribe(async (doc) => {
                console.log(doc)
                this.editdata = doc;
                this.editdata.sort((a, b) => a.testsuitename.localeCompare(b.testsuitename))
            })

    }

    /*logic description: fetching the releases under the project
   */
    releaseV() {
        let obj = { 'projectId': this.projectidRelease }
        this.suiteService.getActiveRelease(obj)
            .subscribe(async (doc) => {
                console.log(doc)
                this.activeReleaseVer = doc;
                this.activeReleaseVer.sort((a, b) => a.releaseVersion.localeCompare(b.releaseVersion))
            })
    }

    /*logic description: fetching the browsers under this organization
   */
    getBrowser() {
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        let obj = { 'orgId': orgId }
        this.suiteService.getBrowsers(obj)
            .subscribe(async (doc) => {
                console.log(doc)
                this.dbrowsers = doc;
            })
    }

    /*logic description: fetching the versions on selecting the browser
   */
    getversion(browser) {
        // this.version=[];
        // this.defaultVersion='';
        this.selectedBrowser = browser;
        let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
        let obj = { 'browser': this.selectedBrowser, 'orgId': orgId }
        this.suiteService.getVersions(obj)
            .subscribe(async (doc) => {
                this.allversions = doc;
                console.log(this.allversions)
                if (this.allversions.length == 0) {
                    return false;
                }
                this.version = this.allversions[0].version;
            })

    }

    /* not using
   */
    selct: boolean = false;
    versionFun() {
        this.selct = true;
    }

    /*logic description: fetching the default configurations under projectselection collection
   */
    defaultConfig() {
        let obj = { 'projectId': this.projectidRelease }
        this.suiteService.defaultConfig(obj)
            .subscribe(async (doc) => {
                console.log(doc)
                this.projectConfig1 = doc;
                console.log(this.projectConfig1)
                this.time1 = this.projectConfig1.settimeOut;
                this.defaultBrowser1 = this.projectConfig1.defaultBrowser;
                this.defaultVersion1 = this.projectConfig1.defaultVersion;

            })
    }

/*logic description:using for api suite
   */
    apitestSuite(suite, desc, releaseId) {
        if (releaseId == null) {
            this.releaseId = "null"
        } else {
            this.releaseId = releaseId;
        }
        this.suiteArray['pname'] = this.projectDetails;
        this.suiteArray['pid'] = this.projectidRelease;
        this.suiteArray['suite'] = this.suite;
        this.suiteArray['desc'] = this.desc;
        this.suiteArray['releaseId'] = this.releaseId;
        this.suiteArray['apiRunNumber'] = 1
        this.suiteService.createApiSuiteNew(this.suiteArray)
            .subscribe(result => {
                if (result[0].status == "Pass") {
                    console.log(this.suite, this.desc);
                    this.getSuites();
                    this.cancel(this.suite, this.desc);
                    this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
                    this.userForm.reset();
                } else {
                    alert("Duplicate Suite name not allowed in the same project");
                    this.getSuites();
                    this.cancel(this.suite, this.desc);
                    this.userForm.reset();
                }
            })
    }

/*logic description: creating a web suite in testsuite collection and in suite folder
   */
    saveSuite: boolean = false;
    testSuite(suite, desc, time, browser, version, releaseId) {
        if (time == undefined || browser == undefined || version == undefined) {
            time = this.time1
            browser = this.defaultBrowser1
            version = this.defaultVersion1
        }
        this.saveSuite = true;
        this.suite = suite;
        this.desc = desc;
        if (releaseId == null) {
            this.releaseId = "null"
        } else {
            this.releaseId = releaseId;
        }
        this.suiteConfig['settimeOut'] = time;
        this.suiteConfig['defaultBrowser'] = browser;
        this.suiteConfig['defaultVersion'] = version;
        this.suiteConfig['Ip'] = "http://192.168.99.100:4444";
        this.suiteArray['pname'] = this.projectDetails;
        this.suiteArray['pid'] = this.projectidRelease;
        this.suiteArray['suite'] = this.suite;
        this.suiteArray['desc'] = this.desc;
        this.suiteArray['releaseId'] = this.releaseId;
        this.suiteArray["config"] = this.suiteConfig;
        this.SpinnerService.show();
        this.spinnerVal = 'Saving Suite..'
        this.suiteService.createWebSuiteNew(this.suiteArray)
            .subscribe(result => {
                console.log(result)
                this.SpinnerService.hide();
                if (result == "pass") {
                    console.log(this.suite, this.desc);
                    this.getSuites();
                    this.cancel(this.suite, this.desc);
                    this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
                    this.userForm.reset();
                    this.fetchExceptionSuites()

                } else if (result == "fail") {
                    this.getSuites();
                    this.cancel(this.suite, this.desc);
                    this.userForm.reset();
                } else {
                    alert("Duplicate Suite name not allowed in the same project");
                    this.getSuites();
                    this.cancel(this.suite, this.desc);
                    this.userForm.reset();
                }
                this.suiteSave = false;
            })
    }

    /*logic description: checking whether the suite is locked by other user or free
        if it is free suite will locked by user or else aler will display
   */
    checkIfSuiteLocked(): Observable<boolean> {
        var subject = new Subject<boolean>();
        let userName = sessionStorage.getItem('userName');
        let userId = sessionStorage.getItem('newUserId');
        let obj = {
            "projectId": this.projectidRelease,
            "suiteName": this.selectedname,
            "suiteId": this.selectedSuiteID,
            "userName": userName,
            "userId": userId
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
        //                 if(userName==result1["beingUsedBy"]){
        //                     this.dialogService.dockerDialog(`${result1["suiteName"]} is executing Please wait until the exection is completed`)
        //                     .afterClosed().subscribe(res => { })
        //                     subject.next(false);
        //                 }else{
        //                     this.dialogService.dockerDialog(`${result1["beingUsedBy"]} is executing this suite, ${result1["suiteName"]} will be available as soon as execution is completed`)
        //                     .afterClosed().subscribe(res => { })
        //                 subject.next(false);
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
                if (userName == result1["beingUsedBy"]) {
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

/*logic description: delete selected suite if it is free or else alert will display
   */
    deleteselectedsuite(suitename) {
        this.suiteupdate = false;
        this.suiteCreate = false;
        this.displaySuitesTable = false;
        this.checkIfSuiteLocked().subscribe(result => {
            console.log(result);
            if (result) {
                // let userName = sessionStorage.getItem('userName');
                // let userId = sessionStorage.getItem('newUserId');
                // let obj1 = {
                //     "projectId": this.projectidRelease,
                //     "suiteName": suitename,
                //     "userName": userName,
                //     "userId": userId
                // }
                // console.log(obj1);
                // this.suiteService.checkIfSuiteLocked(obj1).subscribe((result) => {
                //     console.log(result)
                // if (result == "free") {
                this.dialogService.openConfirmDialog('Are you sure to delete suite ?')
                    .afterClosed().subscribe(res => {
                        console.log(res)
                        if (res) {
                            this.deleteArray['suite'] = suitename;
                            this.deleteArray['projectName'] = this.projectDetails;
                            this.suiteService.suiteDelete(this.deleteArray)
                                .subscribe(result => {
                                    this.userForm.reset();
                                    this.cancel(this.suite, this.desc);
                                    this.decoratorServiceKey.saveSnackbar('Deleted Successfully', '', 'save-snackbar')
                                    this.getSuites();
                                    this.fetchExceptionSuites()
                                })
                        }
                    })
                // }
                //     else {
                //         this.dialogService.dockerDialog(`${result["beingUsedBy"]} is working on it, Suite will be available as soon as user releases it `)
                //             .afterClosed().subscribe(res => {

                //             })
                //     }
                // })
            } else {
                return;
            }
        })

    }

/*logic description: updating the suite configurations into Database and if suite name
   */
    updateSuite(suitename, description, time, browser, version) {
        this.nonEdit = false;
        console.log(this.suite1, suitename)
        if (this.suite1 === suitename) {
            this.updatedArray['compare'] = false;
        } else {
            this.updatedArray['compare'] = true;
        }
        this.updatedArray['suite'] = suitename;
        this.updatedArray['_Id'] = this._id;
        this.updatedConfig['settimeOut'] = time;
        this.updatedConfig['defaultBrowser'] = browser;
        this.updatedConfig['defaultVersion'] = version;
        this.updatedArray['desc'] = description;
        this.updatedArray['sId'] = this.suiteId;
        this.updatedArray['oldsuite'] = this.suite1;
        this.updatedArray['config'] = this.updatedConfig;
        this.updatedArray['pname'] = this.slectedproject;
        this.updatedArray['frameworkId'] = this.frameworkId;
        this.updatedArray['pid'] = this.projectidRelease;
        console.log(this.updatedArray)
        this.suiteService.suiteUpdate(this.updatedArray)
            .subscribe(result => {
                console.log(result)
                this.resp = result;
                console.log(this.resp)
                let Fail = new String("Fail");
                // this.getSuites();
                //     this.suiteupdate = 0;
                //     this.suiteconfig = 1;
                //     this.userForm.reset();
                //     this.fetchExceptionSuites()
                if (this.resp == Fail) {
                    this.decoratorServiceKey.saveSnackbar(' Suite  not Updated..', '', 'save-snackbar')
                    //  this.getSuites();
                    this.defaultConfig()
                    this.userForm.reset();
                    this.cancel(suitename, description);
                    this.fetchExceptionSuites()
                }
                else if (this.resp == "duplicates") {
                    this.decoratorServiceKey.duplicate_Snackbar(' Duplicates not allowed.', '', 'save-snackbar')
                    //  this.getSuites();
                    // this.defaultConfig()
                    // this.userForm.reset();
                    // this.cancel(suitename, description);
                    // this.fetchExceptionSuites()
                }
                else {
                    this.getSuites();
                    this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'save-snackbar')
                    this.fetchExceptionSuites()
                    this.userForm.reset();
                    this.cancel(this.suite, this.desc);
                    this.defaultConfig()
                }
                this.suiteSave = false;
            })

        // this.http.put(this.api.apiData + '/updatesuite', this.updatedArray)
        //     .subscribe(result => {
        //         this.getSuites();
        //         this.suiteupdate = 0;
        //         this.suiteconfig = 1;
        //         this.userForm.reset();
        //         this.fetchExceptionSuites()
        //     })

    }

/*logic description: when click on cancel button it will reset form
   */
    cancel(suite, des) {
        this.suite = '';
        this.desc = '';
        //this.ngOnInit();
        this.suiteCreate = false;
        this.suiteupdate = 0;
        this.nonEdit = false;
        this.copyFroms = false;
        this.suiteSave = false;
        this.userForm.reset();
    }

    /*logic description:when click on EditConfigLink
   */
    editPopUp(suite, desc) {
        console.log(this.defaultVersion)
        console.log(this.userForm1)
        // this.esuite = suite;
        // this.edesc = desc;
        // this.editmodal = 1;
        // this.editmodal = 0;
        // //this.suiteSave=true;
        // this.selct=false;
        // let obj = { 'esuite': this.esuite, 'edesc': this.edesc, 'suiteId': this.suiteId }
        // this.suiteService.popUpEdit(obj)
        //     .subscribe(result => {
        //         this.editconfig = result;
        //         console.log(this.editconfig);
        //         this.time = this.editconfig.settimeOut;
        //         console.log(this.time)
        //         this.defaultBrowser = this.editconfig.defaultBrowser;
        //         //this.getversion(this.defaultBrowser);
        //         this.defaultVersion = this.editconfig.defaultVersion;
        //     })
    }

    /*logic description: when click on SuiteConfigLink
   */
    createSuiteConfig(suite, desc) {
        console.log(this.defaultVersion)
        console.log(this.userForm1)
        this.saveSuite = false;
        this.esuite = suite;
        this.edesc = desc;
        this.editmodal = 0;
        this.suiteupdate = 0;
        //this.suiteSave=true;
        this.selct = false;
        let obj = { 'projectName': this.projectDetails }
        this.suiteService.suiteConfigCreate(obj)
            .subscribe(result => {
                console.log(result)
                this.projectConfig = result;
                console.log(this.projectConfig);
                this.time = this.projectConfig.settimeOut;
                this.defaultBrowser = this.projectConfig.defaultBrowser;
                this.defaultVersion = this.projectConfig.defaultVersion;
            })
    }

/*logic description: fetching the permissions
   */
    permissions = [];
    edit: boolean
    read: boolean
    delete: boolean
    create: boolean;
    getRolesPermissions() {
        this.roles.getPermissions(this.pageRoles).subscribe(
            Data => {
                this.permissions = Data; console.log(this.permissions);
                console.log(this.permissions);
                this.edit = this.permissions[0].edit;
                this.read = this.permissions[0].read
                this.delete = this.permissions[0].delete
                this.create = this.permissions[0].create

            })


    }

/*logic description: fecting the suites under this project
   */
    fetchExceptionSuites() {
        let obj = { 'projectId': this.projectidRelease }
        this.suiteService.suitesFetchException(obj)
            .subscribe(result => {
                console.log(result)
                this.displayModuleForTree = result;
                this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))
            })
    }

    /*logic description: when right click on any suite edit and delete options will display
   */
    displayModuleForTree = [];
    items: { label: string; command: (event: any) => void; }[];
    selectedSuiteID: any;
    selectedname: any;
    async nodeSelect(file) {
        console.log(file.node.data)
        if (file.node != undefined) {
            if (file.node.data == "suites") {
                this.displaySuitesTable = false;
                this.suiteupdate = false;
                this.suiteCreate = false;
                for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
                    if (file.node.label === this.displayModuleForTree[index]['label']) {
                        break;
                    }
                }
                console.log(file.node.label)
                this.selectedSuiteID = file.node.suiteID
                this.selectedname = file.node.label;
                if (this.edit == true) {
                    this.items = [
                        { label: 'Edit suite', command: (event) => this.editSuite(file.node.label) }
                        // { label: 'Delete Suite', command: (event) => this.deleteselectedsuite(file.node.label) }
                    ];
                }
                if (this.delete == true) {
                    this.items.push({ label: 'Delete Suite', command: (event) => this.deleteselectedsuite(file.node.label) })
                }
                else if (this.edit == false && this.delete == false) {
                    this.items = [];
                }

            } else {
                this.items = [];
            }
        } else {
            console.log(file.node);
            return;
        }
    }

/*logic description: when click on Create Suite link
   */
    createSuites() {
        //this.fetchExceptionSuites()
        this.userForm.reset();
        this.userForm.controls.releaseId.enable();
        this.suiteconfig = 1;
        this.suite = '';
        this.desc = '';
        this.releaseId = '';
        this.copySuite = '';
        this.nonEdit = false;
        this.copyFrom = true
        this.suiteCreate = true;
        this.displaySuitesTable = false;
        this.suiteupdate = false;
        console.log(this.userForm)
        this.createSuiteConfig(this.suite, this.desc)
        this.releaseclicked = false;
    }

    /*logic description: when click on show All Suite link
   */
    createsuiteTable() {
        this.suiteCreate = false;
        this.displaySuitesTable = true;
        this.suiteupdate = false;
    }

    /*logic description: when click on edit suite option it will open form with suite details from DB
   */
    suite1: any;
    desc1: any;
    suiteId1: any;
    check: any;
    lineData: any;
    getallDataToEdit: any;
    editSuite(suiteName) {
        let userName = sessionStorage.getItem('userName');
        let userId = sessionStorage.getItem('newUserId');
        // let obj1 = {
        //     "projectId": this.projectidRelease,
        //     "suiteName": suiteName,
        //     "userName": userName,
        //     "userId": userId
        // }
        // console.log(obj1);
        // this.suiteService.checkIfSuiteLocked(obj1).subscribe((result) => {
        //     console.log(result)
        //     if (result == "free") {
            this.checkIfSuiteLocked().subscribe(result => {
                console.log(result);
                if (result) {
                this.userForm.controls.releaseId.disable();
                console.log(suiteName)
                this.suiteupdate = true;
                this.suiteCreate = false;
                this.suiteconfig = 0;
                this.displaySuitesTable = false;
                this.nonEdit = true;
                this.lineData = this.projectidRelease + "," + suiteName
                let obj = { 'projectId': this.projectidRelease, 'suiteName': suiteName }
                this.releaseclicked = true;
                this.releaseId ="";
                this.suiteService.suiteEdit(obj)
                    .subscribe(result => {
                        console.log(result);
                        this.getallDataToEdit = result;
                        this.suite = this.getallDataToEdit[0].testsuitename;
                        this.suite1 = this.getallDataToEdit[0].testsuitename;
                        this.desc = this.getallDataToEdit[0].Description;
                        this.desc1 = this.getallDataToEdit[0].Description;
                        this._id = this.getallDataToEdit[0]._id;
                        this.suiteId = this.getallDataToEdit[0].suiteId;
                        this.time = this.getallDataToEdit[0].suiteConfigdata.settimeOut;
                        this.defaultBrowser = this.getallDataToEdit[0].suiteConfigdata.defaultBrowser;
                        this.defaultVersion = this.getallDataToEdit[0].suiteConfigdata.defaultVersion;
                        this.releaseId = this.getallDataToEdit[0].releaseVersion;
                        //this.editPopUp(this.suite, this.desc)
                    })
                }
            })
        //     } else {
        //         this.dialogService.dockerDialog(`${result["beingUsedBy"]} is working on it, Suite will be available as soon as user releases it `)
        //             .afterClosed().subscribe(res => {

        //             })
        //     }
        // })
        // this.userForm.controls.releaseId.disable();
        // console.log(suiteName)
        // this.suiteupdate = true;
        // this.suiteCreate = false;
        // this.suiteconfig = 0;
        // this.displaySuitesTable = false;
        // this.nonEdit = true;
        // this.lineData = this.projectidRelease + "," + suiteName
        // let obj = { 'projectId': this.projectidRelease, 'suiteName': suiteName }
        // this.suiteService.suiteEdit(obj)
        //     .subscribe(result => {
        //         console.log(result);
        //         this.getallDataToEdit = result;
        //         this.suite = this.getallDataToEdit[0].testsuitename;
        //     this.suite1=this.getallDataToEdit[0].testsuitename;
        //   this.desc = this.getallDataToEdit[0].Description;
        //   this.desc1 = this.getallDataToEdit[0].Description;
        //   this.suiteId = this.getallDataToEdit[0]._id;
        //   this.suiteId1 = this.getallDataToEdit[0].suiteId;
        //     this.time = this.getallDataToEdit[0].suiteConfigdata.settimeOut;
        //     this.defaultBrowser = this.getallDataToEdit[0].suiteConfigdata.defaultBrowser;
        //     this.defaultVersion = this.getallDataToEdit[0].suiteConfigdata.defaultVersion;
        //   //this.editPopUp(this.suite, this.desc)
        //     })
    }

    /*logic description: when click on update API suites
   */
    updatesuites(suite, desc) {
        this.check = null;
        this.suiteArray['pname'] = this.projectDetails;
        this.suiteArray['pid'] = this.projectidRelease;
        this.suiteArray['suite'] = this.suite;
        this.suiteArray['desc'] = this.desc;
        this.suiteArray['apiRunNumber'] = 1;
        this.suiteArray['suite1'] = this.suite1;
        this.suiteArray['desc1'] = this.desc1;
        this.suiteArray['suiteId1'] = this.suiteId;
        this.suiteArray['frameworkId'] = this.frameworkId;
        console.log(this.suiteArray)
        let obj = { 'data': this.suiteArray }
        this.suiteService.updateSuiteName(this.suiteArray)
            .subscribe(result => {
                console.log(result)
                this.check = result;
                console.log(this.check._body)
                var Fail = '"' + "Fail" + '"';
                if (this.check._body == Fail) {
                    this.decoratorServiceKey.saveSnackbar(' Suite  not Updated..', '', 'save-snackbar')
                    //  this.getSuites();
                    this.userForm.reset();
                    this.cancel(this.suite, this.desc);
                    // alert("Suite  not Updated..");

                }
                else {
                    console.log(this.suite, this.desc);
                    this.getSuites();
                    this.decoratorServiceKey.saveSnackbar('Updated Successfully', '', 'save-snackbar')
                    //  this.ngOnInit();
                    this.fetchExceptionSuites()
                    this.userForm.reset();
                    this.cancel(this.suite, this.desc);
                }
            });
    }//Update API Suites

    /*logic description: when select any suite in Copy Suite from dropdown
   */
    fromToSuite(emptySelect) {
        if (emptySelect == "undefined") {
            this.copyFrom = true
            this.copyFroms = false
            this.nonEdit = false;
        }
        else {
            this.nonEdit = true;
            this.copyFrom = false
            this.copyFroms = true
        }
    }

/*logic description: after selecting any suite in copy suite from dropdown, 
    it will create new suite and copy scripts from that suite to new suite
   */
    copytestSuite(suite, suiteName, des) {
        let obj = {
            "suite": suite,
            "suiteName": suiteName,
            "projectidRelease": this.projectidRelease,
            "des": des,
            "framework": this.projectframework
        }
        this.suiteService.copyFromSuite(obj)
            .subscribe(result => {
                console.log(result)
                if (result[0].status == "Pass") {
                    this.getSuites();
                    this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
                    this.userForm.reset();
                    this.cancel(this.suite, this.desc);
                    this.fetchExceptionSuites()
                } else {
                    alert("Duplicate Suite name not allowed in the same project");
                    this.getSuites();
                    this.cancel(this.suite, this.desc);
                    this.userForm.reset();
                }
            })
        this.suiteSave = false;
    }

    /*logic description: when click on save on configurations modal
   */
    saveConfig() {
        this.suiteSave = false;
    }

}