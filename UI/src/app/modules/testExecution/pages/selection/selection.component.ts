import { Component, OnInit } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//import { URLSearchParams } from '@angular/http';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { Post } from '../../../../post';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
import { DialogService } from '../../../../core/services/dialog.service';
import { roleService } from '../../../../core/services/roleService';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { MatSnackBar } from '@angular/material';
import { SelectionService } from '../../../../core/services/selectionService.service';


@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
    providers: [roleService, ProjectDetailServiceComponent, apiServiceComponent, SelectionService]
})


export class SelectionComponent implements OnInit {
    selected = 'option2';
    showloader: boolean;
    timeRemaining: any;
    obj2: any;
    runn = [];
    moduleNames: any[];
    featureNames: any[];
    typeArray = [];
    datas = [];
    priorityArray = [];
    testScriptsData: Post[];
    projectIds: Post[]
    demoArrayaData: String = "";
    moduleId: any = "All";
    moduleName: string;
    featureId: any = "All";
    featureName: string;
    lineNum: string;
    scriptName: string;
    projectId: string;
    srch: boolean;
    test: any;
    var2_featureName: any;
    projectName: string;
    vjData: any = [];
    mData: any = [];
    check: any;
    a: any;
    $http: any;
    c: Object = {};
    projectSelection: any;
    index2: any;
    mName: any;
    fName: any;
    sName: any;
    lNum: any;
    pSelection: any;
    mod = [];
    feat = [];
    lin = [];
    scri = [];
    pro = [];
    moduleDetails = [];
    featureDetails = [];
    featureDetails1 = [];
    featureDetails2 = [];
    featureDetails3 = [];
    featureData: any[];
    fea: any[];
    mo: any[];
    lineNumDetails = [];
    lineData: any[];
    scripttData: any[];
    scriptDetails = [];
    aMN: string;
    aFN: string;
    aSN: string;
    ind: number;
    indU: number;
    indUU: number;
    allData: any;
    displayStatus: any;
    suites: any;
    i: number;
    tests: any;
    scripts = [];
    testsuitename: any;
    inserted: any;
    copyscript: any;
    scripts2 = [];
    noData: boolean;
    private subscription: Subscription;
    selectedType: string;
    selectedPriority: string;
    value: any;
    oldpname: any;
    newRole: any;
    pageRoles: Object = {}
    pageName: any;
    newUserName: any;
    newUserId: any;
    activeReleaseVer: any;
    projectidRelease: any;
    selectedProject: any;
    releaseSelected: any;
    projectframework: any;
    lineNu: string;
    disable: any;
    hidden: boolean;
    disData: number = 0;
    releaseId: any;
    releaseclicked: boolean = false;

    constructor(public _snackbar: MatSnackBar,
        private decoratorServiceKey: DecoratorService,
        private roles: roleService,
        private dialogService: DialogService,
        public type: ProjectDetailServiceComponent,
        private data11: ProjectDetailServiceComponent,
        //private http: Http,
        private api: apiServiceComponent,
        private selectionService: SelectionService) {
        this.srch = false;
        this.noData = false;
    }


    ngOnInit() {
        this.pageName = "SelectionPage"
        this.newRole = sessionStorage.getItem('newRoleName');
        this.newUserId = sessionStorage.getItem('newUserId');
        this.newUserName = sessionStorage.getItem('userName')
        this.selectedProject = sessionStorage.getItem('selectedProject')
        this.selectedProject = JSON.parse(this.selectedProject)
        this.projectidRelease = this.selectedProject.projectId;
        this.pageRoles = {
            pageName: this.pageName,
            roleName: this.newRole,
            userId: this.newUserId
        }
        this.releaseV()
        this.getRolesPermissions()
        this.typeData()
        this.priorityData()
        this.projectName = this.data11.selectedProject();
        let dataFromProjectSelectionDropdown = sessionStorage.getItem('key');
        this.projectName = dataFromProjectSelectionDropdown;
        //this.demoArrayaData = this.moduleNames[1];
        this.framework()
        this.allSuites()
        this.disable = true;
        this.hidden = true;
        this.moduleNames = [];
        this.featureNames = [];
        this.featureId = 'All';
        this.moduleId = 'All';
        this.featureNames = [{ featureId: 'All', featureName: "All" }]
        this.moduleNames = [{ moduleId: 'All', moduleName: "All" }]
        console.log(this.featureNames, this.moduleNames)
        this.activeReleaseVer = [];
        // this.activeReleaseVer = [{ releaseVersion: 'Select Release' }]
        // this.releaseId = 'Select Release';
        this.releaseclicked = false;
    }

    showSnackbar(message: string, action: string, className: string) {
        this._snackbar.open(message, action, {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'start',
            panelClass: [className]
        });
    }

    /* logic Description: fetching the active releases and sort them
    */
    releaseV() {
        this.activeReleaseVer = [];
        let obj = { 'projectId': this.projectidRelease }
        this.selectionService.getActiveRelease(obj)
            .subscribe(async (doc) => {
                console.log(doc)
                this.activeReleaseVer = doc;
                this.activeReleaseVer.sort((a, b) => a.releaseVersion.localeCompare(b.releaseVersion))
                // this.activeReleaseVer.unshift({ releaseVersion: 'Select Release' })
                // this.releaseId = 'Select Release';
            })
    }

    /* logic Description: fetching the type data and sort them and add 'All' as first option
    */
    typeData() {
        let obj = { 'projectId': this.projectidRelease }
        this.selectionService.typeDetails(obj)
            .subscribe(Data => {
                this.typeArray = Data;
                this.typeArray.sort((a, b) => a.typeName.localeCompare(b.typeName))
                this.typeArray.unshift({ typeId: 'All', typeName: "All" })
                this.selectedType = 'All';
                console.log(this.typeArray)
            });
    }

    /* logic Description: fetching the priority data and sort them and add 'All' as first option
    */
    priorityData() {
        let obj = { 'projectId': this.projectidRelease }
        this.selectionService.priorityDetails(obj)
            .subscribe(Data => {
                this.priorityArray = Data
                this.priorityArray.sort((a, b) => a.priorityName.localeCompare(b.priorityName))
                this.priorityArray.unshift({ priorityId: 'All', priorityName: "All" })
                this.selectedPriority = 'All';
                console.log(this.priorityArray)
            });
    }

    /* logic Description: fetching the framework
    */
    framework() {
        let obj = { 'projectId': this.projectidRelease }
        this.selectionService.projectFramework(obj)
            .subscribe(result => {
                this.projectframework = result[0].framework;
                console.log(this.projectframework)
            });
    }

    /* logic Description: fetching the suites available under the project
    */
    allSuites() {
        let obj = { 'projectId': this.projectidRelease }
        this.selectionService.allSuitesData(obj)
            .subscribe(result => {
                this.suites = result;
                console.log(this.suites);
            });
    }

/* logic Description: checking whether release is selected or not
    */
    releasearray = []
    releasearray1 = []
    releasebased() {
        if (this.releaseSelected == undefined) {
            console.log('ghjhgh')
            this.releaseSelected = 'undefined'
        }
        if (this.releaseSelected == 'undefined' || this.releaseSelected == '') {
            this.suites.forEach(element => {
                if (element.releaseVersion == 'null') {
                    this.releasearray.push(element)
                }
            });
        }
        else {
            this.suites.forEach(element => {
                if (element.releaseVersion == this.releaseSelected) {
                    this.releasearray.push(element)
                }
            });
        }
        this.releasearray1 = this.releasearray;
        this.releasearray = [];
    }

    /* logic Description: when close the release dropdown
    */
    spliceDefault(releaseId) {
        this.releaseclicked = true;
        console.log(releaseId, this.releaseSelected);
        // if (this.activeReleaseVer.length > 1 && this.activeReleaseVer[0].releaseVersion == "Select Release") {
        //     this.activeReleaseVer.splice(0, 1)
        //     console.log(this.activeReleaseVer);
        // }
        console.log(this.releaseId);
    }

    /* logic Description: fetching the suites available under the project
    */
    addDefault(releaseId) {
        console.log(releaseId, this.releaseSelected);
        if (this.releaseId == "Select Release") {
            this.releaseclicked = false;
            //  this.activeReleaseVer.unshift({ releaseVersion: 'Select Release' })
            // this.releaseV()
        }
        console.log(this.activeReleaseVer);
    }

    /* logic Description: when user select any release fetch the modules under that release
    */
    selectedRelease(releaseId) {
        // this.moduleId='';
        // this.moduleNames = [];
        // this.featureId = '';
        // this.featureNames = [];
        this.moduleNames = [];
        this.featureNames = [];
        this.featureId = 'All';
        this.moduleId = 'All';
        this.featureNames = [{ featureId: 'All', featureName: "All" }]
        this.moduleNames = [{ moduleId: 'All', moduleName: "All" }]
        this.scripts = [];
        this.testScriptsData = [];
        this.disable = true;
        this.hidden = true;
        // this.typeArray=[];
        // this.priorityArray=[];
        console.log(releaseId, this.releaseSelected);
        this.releaseSelected = releaseId
        if (releaseId == undefined || releaseId == '') {
            releaseId = 'undefined'
        }
        let obj = { 'projectId': this.projectidRelease, 'releaseId': releaseId }
        this.selectionService.getReleaseModules(obj)
            .subscribe(result => {
                this.moduleNames = result;
                this.moduleNames.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
                this.moduleNames.unshift({ moduleId: 'All', moduleName: "All" })
                this.moduleId = 'All';
                console.log(this.moduleNames);
            });
    }


/* logic Description: when user select module fetch the features under that module
    */
    moduleIndex(moduleId, releaseId) {
        //this.featureId = '';
        this.featureNames = [];
        this.scripts = [];
        this.testScriptsData = [];
        this.disable = true;
        this.hidden = true;
        // this.typeArray=[];
        // this.priorityArray=[];
        console.log(moduleId, releaseId)
        if (releaseId == undefined || releaseId == '') {
            releaseId = 'undefined'
        }
        if (moduleId == undefined || moduleId == '') {
            moduleId = 'All'
        }
        let obj = { 'projectId': this.projectidRelease, 'moduleId': moduleId }
        let obj1 = { 'projectId': this.projectidRelease, 'releaseId': releaseId, 'moduleId': moduleId }
        if (releaseId == 'undefined' || releaseId == '') {
            this.selectionService.getFeatures(obj)
                .subscribe(Data => {
                    this.featureNames = Data;
                    this.featureNames.sort((a, b) => a.featureName.localeCompare(b.featureName))
                    console.log(this.featureNames)
                });
        }
        else {
            if (moduleId != "All") {
                this.selectionService.getReleaseFeatures(obj1)
                    .subscribe(Data => {
                        this.featureNames = Data;
                        this.featureNames.sort((a, b) => a.featureName.localeCompare(b.featureName))
                        this.featureNames.unshift({ featureId: 'All', featureName: "All" })
                        console.log(this.featureNames)
                        this.featureId = 'All';
                    });
            } else {
                this.featureNames = [{ featureId: 'All', featureName: "All" }]
                this.featureId = 'All';
            }
        }
    }

/* logic Description: when user click on search fetch the scripts based on options selected and sort them
    */
    search(releaseId, moduleId, featureId, type, priority) {
        // if (releaseId == '') {
        //     releaseId = 'undefined'
        // }
        console.log(releaseId, moduleId, featureId, type, priority);
        if (releaseId == '' || releaseId == undefined || releaseId == 'Select Release') {
            return this.dialogService.openAlert('Please select release..')
        }
        if (moduleId == 'All') {
            moduleId = 'undefined'
        }
        if (featureId == 'All') {
            featureId = 'undefined'
        }
        if (type == ''||type == 'All') {
            type = 'undefined'
        }
        if (priority == ''||priority == 'All') {
            priority = 'undefined'
        }

        this.allData = ""
        this.srch = true;
        this.lineNu = moduleId + ',' + featureId + ',' + type + ',' + priority + ',' + this.projectidRelease + ',' + releaseId + ',' + this.projectframework
        this.selectionService.testScriptDetails(this.lineNu)
            .subscribe(async (result) => {
                var script = await this.sortScript(result)
                var feature = await this.sortFeature(script)
                var module = await this.sortModule(feature)
                this.testScriptsData = module;
                this.disData = this.testScriptsData.length;
                console.log(this.testScriptsData);
                if (this.disData > 0) {
                    this.disable = false;
                    this.hidden = false;
                } else {
                    this.disable = true;
                    this.hidden = true;
                }
                this.testScriptsData.forEach(function (s, sindex, sarray) {
                    s['checkbox'] = '';
                })
                this.displayAllData(this.testScriptsData)
            });
    }

    /* logic Description: sort the modules
    */
    sortModule(data) {
        return data.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
    }
     /* logic Description: sort the features
    */
    sortFeature(data) {
        return data.sort((a, b) => a.featureName.localeCompare(b.featureName))
    }
 /* logic Description: sort the scripts
    */
    sortScript(data) {
        return data.sort((a, b) => a.scriptName.localeCompare(b.scriptName))
    }
 /* logic Description: check whether scripts are there or not in that features
    */
    displayAllData(display) {
        this.noData = true;
        if (display.length == 0) {
            this.allData = "No Data Available";
        }
        else {
            this.noData = false;
        }
    }

     /* logic Description: when user checks the table header checkbox to select all scripts
    */
    chekss = [];
    checked: boolean;
    checkd: boolean;
    checks(testScriptsData, event) {
        var checkf
        this.chekss = [];
        checkf = event.target.checked
        console.log(checkf)
        console.log(testScriptsData.length)
        if (checkf == true) {
            this.checkd = true;
            for (let c = 0; c < this.testScriptsData.length; c++) {
                console.log(this.checkd)
                // this.copy(c,this.testScriptsData[c],checkf)
                testScriptsData[c].checkbox = true;
            }
        }
        else if (checkf == false) {
            this.checkd = false;
            console.log(this.checkd)
            for (let c = 0; c < this.testScriptsData.length; c++) {
                // this.copy(c,this.testScriptsData[c],checkf)
                testScriptsData[c].checkbox = false;
            }

        }
        console.log(this.testScriptsData);
    }//end of checks

     /* logic Description: click on copy suite button below object will create
    */
    copy(i, test, value) {
        this.i = i;
        this.tests = test;
        this.value = value;
        var selectedscripts: object = {};
        selectedscripts["moduleName"] = this.tests.moduleName;
        selectedscripts["moduleId"] = this.tests.moduleId;
        selectedscripts["fetaureName"] = this.tests.featureName;
        selectedscripts["featureId"] = this.tests.featureId;
        selectedscripts["scriptName"] = this.tests.scriptName;
        selectedscripts["type"] = this.tests.type;
        selectedscripts["typeId"] = this.tests.typeId;
        selectedscripts["scriptId"] = this.tests.scriptId;
        selectedscripts["priority"] = this.tests.priorityId;
        selectedscripts["priorityId"] = this.tests.priority;
        selectedscripts["checkbox"] = this.value;
        selectedscripts["requirementName"] = this.tests.requiremantName;
        selectedscripts["requirementId"] = this.tests.requirementId;
        selectedscripts["manualStepDetails"] = this.tests.manualStepDetails;
        selectedscripts["scriptStatus"] = "NotExecuted";
        selectedscripts["testcaseStatus"] = this.tests.testcaseStatus;
        selectedscripts["testcaseType"] = this.tests.testcaseType;

        if (this.value == true) {
            this.scripts.push(selectedscripts);
        } else {

            for (let j = 0; j <= this.scripts.length - 1; j++) {
                if (this.i == j) {
                    this.scripts[i].checkbox = false;
                    this.scripts.splice(i, 1)
                }
            }

        }

        console.log(this.scripts)
    }

 /* logic Description: when user clicks on save button then selected scripts will pushed into testsuite collection
    */
    selectedname: any;
    completeobject: Object = {};
    newscripts = [];
    saveScripts(selectedname, testScriptsData) {
        this.newscripts = [];
        console.log(selectedname);
        console.log(testScriptsData);
        if (this.selectedname != undefined&&this.selectedname != '') {
            this.completeobject["testsuitename1"] = this.selectedname;
            for (let i = 0; i <= this.testScriptsData.length - 1; i++) {
                if (testScriptsData[i].checkbox != false) {
                    testScriptsData[i].scriptStatus = "NotExecuted";
                    this.newscripts.push(testScriptsData[i]);
                }
            }
            console.log(this.newscripts);
            this.completeobject["scripts"] = this.newscripts;
            this.completeobject["pname"] = this.projectName;
            this.completeobject["framework"] = this.projectframework
            if (this.newscripts.length != 0) {
                this.selectionService.insertScripts(this.completeobject)
                    .subscribe(result => {
                        this.selectedname = '';
                        this.moduleId = 'All';
                        this.featureId = 'All';
                        // this.typeArray.unshift({ typeId: 'All', typeName: "All" })
                        this.selectedType = 'All';
                        this.selectedPriority = 'All';
                        this.scripts = [];
                        this.testScriptsData = [];
                        console.log(result)
                        //alert('qwqwqwqwwqw')
                        this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
                        this.disable = true;
                        this.hidden = true;
                    });
            } else {
                this.dialogService.test_executionDialog('Please select script to copy')
                this.scripts = [];
                this.selectedname = '';
            }
        }
        else {
            this.dialogService.test_executionDialog('Please select the testsuite name to copy the scripts')
        }
    }

/* logic Description: fetch the roles and permissions based on user roles
    */
    permissions = [];
    edit: boolean
    read: boolean
    delete: boolean
    create: boolean;
    disableButton: boolean

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
    // no use
    tick(test, check) {
        console.log(test.scriptName, test.checkbox, check)
    }
}





