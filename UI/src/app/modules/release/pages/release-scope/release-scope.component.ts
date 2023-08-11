import { Component, OnInit } from '@angular/core';
import { TestExecutionServiceComponent } from '../../../../core/services/testExecution.service';
import { Post } from '../../../../post'
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { ProjectSelectionServiceComponent } from '../../../../core/services/projectSelection.service';
import { CreateService } from '../../../../core/services/release-create.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { roleService } from '../../../../core/services/roleService';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-release-scope',
    templateUrl: './release-scope.component.html',
    styleUrls: ['./release-scope.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
    providers: [TestExecutionServiceComponent, ProjectDetailServiceComponent, DialogService, ProjectSelectionServiceComponent]
})
export class ReleaseScopeComponent implements OnInit {
    pageRoles: Object = {}
    selProjectName: string;
    projectName: string;
    allData: any;
    searchButton: boolean;
    testScriptsData: Post[];
    noData: boolean;
    i: number;
    tests: any;
    scripts = [];
    value: any;
    moduleNames = [];
    featureNames: any[];
    typeArray = [];
    priorityArray = [];
    datas = [];
    releaseData: any[];
    moduleId: any = "All";
    moduleName: string;
    featureId: any = 'All';
    selectedType: string;
    selectedPriority: string;
    projectDetails: any;
    projectidRelease: any;
    selectedProject: any;
    pageName: any;
    newRole: any;
    newUserId: any;
    newUserName: any;
    lineNu: any;
    getmodule: any;
    activeReleaseVer;
    selectedname: any;
    releaseId: any;
    completeobject: Object = {};
    newscripts = [];
    srch: boolean;
    disable: any;
    hidden: boolean;

    constructor(private dialogService: DialogService,
        private CreateService: CreateService,
        private decoratorKey: DecoratorService,
        private data: TestExecutionServiceComponent,
        private roles: roleService) {
        this.srch = false;
        this.noData = false;
    }

    ngOnInit() {
        this.disable = true;
        this.hidden = true;
        this.pageName = "manageReleasePage"
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
        this.selectedProject = sessionStorage.getItem('selectedProject')
        this.selectedProject = JSON.parse(this.selectedProject)
        this.projectidRelease = this.selectedProject.projectId;
        let dataFromProjectSelectionDropdown = sessionStorage.getItem('key');
        this.projectName = dataFromProjectSelectionDropdown;
        this.CreateService.typeDetails().subscribe(Data => {
            console.log(Data)
            this.typeArray = Data;
            this.typeArray.sort((a, b) => a.typeName.localeCompare(b.typeName))// soeting the types 
        });

        this.CreateService.priorityDetails()
            .subscribe(Data => {
                console.log(Data)
                this.priorityArray = Data;
                this.priorityArray.sort((a, b) => a.priorityId.localeCompare(b.priorityId))// sorting the priorities
            });
        this.activeRelease();
        this.displayModules();
        this.moduleNames = [];
        this.featureNames = [];
        this.featureId = 'All';
        this.moduleId = 'All';
        this.featureNames = [{ featureId: 'All', featureName: "All" }]
        this.moduleNames = [{ moduleId: 'All', moduleName: "All" }]
        console.log(this.featureNames, this.moduleNames)
    }

    /*Logic Description: get active releases
  */
    activeRelease() {
        this.CreateService.getAllReleases(this.projectidRelease)
            .subscribe(data => {
                console.log(data)
                this.activeReleaseVer = data;
                this.displayModuleForTree = data;
                this.displayModuleForTree.sort((a, b) => a.label.localeCompare(b.label))//sorting the releases
            })
    }

    ///////////////////////////////////////// Tree Structure code starts ////////////////////////////////////
    activeModule: any;
    clickIndex: any;
    clickedModule: any;
    openFeatureMenu(selectedModule, i) {
        console.log(selectedModule, i)
        this.activeModule = selectedModule;
        this.clickIndex = i
        this.clickedModule = selectedModule
    }

    displayModuleForTree: Post[];
    releseId: any;
    items: { label: string; command: (event: any) => void; }[];
    async nodeSelect(file) {
        // this.displayTestData = false;
        if (file.node != undefined) {
            if (file.node.data == "release") {
                this.addRelease = false;
                this.viewRelease = false;
                this.moduleId = '';
                this.moduleNames = [];
                this.featureId = '';
                this.featureNames = [];
                this.scripts = [];
                this.testScriptsData = [];
                this.disable = true;
                this.hidden = true;
                this.noData = false;
                this.pageName = file.node.label;
                this.releaseId = file.node.releaseId;
                console.log(file.node.releaseId)
                for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
                    if (file.node.label === this.displayModuleForTree[index]['label']) {
                        // this.openFeatureMenu(this.pageName, index);
                        break;
                    }
                }
                this.viewReleases(file.node.releaseVersion)
                // this.items = [
                //     { label: 'View Release', command: (event) => this.viewReleases(file.node.label, file.node.releaseVersion) },
                //     { label: 'Add To Release', command: (event) => this.addToRelease(file.node.label, file.node.releaseId) }
                // ];
            }
        }
    }
    
    addRelease: boolean;
    viewRelease: boolean;
    /*Logic Description: this will called when click on add to release to get selection page fro scripts 
  */
    addToRelease() {
        this.allData = "";
        this.noData = false;
        this.addRelease = true;
        this.viewRelease = false;
        this.disable = true;
        this.hidden = true;
        this.displayModules();
    }

    /*Logic Description:this function will on view release to see added scripts
  */
    viewReleases(b) {
        this.noData = false;
        this.allData = "";
        //console.log(b)
        this.viewRelease = true;
        this.addRelease = false;
        this.releaseWiseSearch(b);
    }
    ///////////////////////////////////////// End of Tree Structure /////////////////////////////////////////

    displayModules() {
        // this.moduleId = '';
        // this.moduleNames = [];
        // this.featureId = '';
        // this.featureNames = [];
        this.moduleNames = [];
        this.featureNames = [];
        this.featureNames = [{ featureId: 'All', featureName: "All" }]
        this.featureId = 'All';
        this.scripts = [];
        this.testScriptsData = [];

        let obj = { 'projectId': this.projectidRelease }
        this.CreateService.getModules(obj)
            .subscribe(result => {
                this.moduleNames = result;
                this.moduleNames.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
                console.log(this.moduleNames);
                this.moduleNames.unshift({ moduleId: 'All', moduleName: "All" })// place the object to firts position in array
                this.moduleId = 'All';
                //console.log(this.moduleNames)
            });
    }

/*Logic Description: when module dropdown changes
  */
    moduleIndex(moduleId) {
        // this.featureId = '';
        this.featureNames = [];
        this.scripts = [];
        this.testScriptsData = [];
        this.disable = true;
        this.hidden = true;
        if (moduleId == undefined || moduleId == '') {
            moduleId = 'All'
        }
        let obj = { 'projectId': this.projectidRelease, 'moduleId': moduleId }
        if (moduleId != "All") {
            this.CreateService.getFeatures(obj)
                .subscribe(Data => {
                    this.featureNames = Data;
                    console.log(this.featureNames);
                    this.featureNames.sort((a, b) => a.featureName.localeCompare(b.featureName))
                    this.featureNames.unshift({ featureId: 'All', featureName: "All" })
                    // console.log(this.featureNames)
                    this.featureId = 'All';
                });
        } else {
            this.featureNames = [{ featureId: 'All', featureName: "All" }]
            this.featureId = 'All';
        }
    }

    /*Logic Description:get the scripts based on search filters of dropdowns
  */
    search(moduleId, featureId, type, priority) {

        if (moduleId == 'All') {
            moduleId = 'undefined'
        }
        if (featureId == 'All') {
            featureId = 'undefined'
        }
        if (type == 'All') {
            type = 'undefined'
        }
        if (priority == 'All') {
            priority = 'undefined'
        }
        this.allData = ""
        this.srch = true;
        // if (moduleId == undefined && featureId == undefined && this.projectName == undefined && type == undefined && priority == undefined) {
        //     alert("Please Fill Madatory Fields")
        // }
        this.searchButton = true;
        this.lineNu = moduleId + ',' + featureId + ',' + type + ',' + priority + ',' + this.projectidRelease + ',' + 'undefined'
        console.log(this.lineNu)
        this.data.testScriptDetails(this.lineNu).subscribe(async (result) => {
            // this.testScriptsData = result;
            var script = await this.sortScript(result)
            var feature = await this.sortFeature(script)
            var module = await this.sortModule(feature)
            this.testScriptsData = module;
            if (this.testScriptsData.length > 0) {
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

    sortModule(data) {
        return data.sort((a, b) => a.moduleName.localeCompare(b.moduleName))// sort the modulenames
    }
    sortFeature(data) {
        return data.sort((a, b) => a.featureName.localeCompare(b.featureName))// sort the featurenames
    }

    sortScript(data) {
        return data.sort((a, b) => a.scriptName.localeCompare(b.scriptName))// sort the scriptnames
    }

    // to display alert text based on 0 or more scripts in release
    displayAllData(display) {
        this.noData = true;
        if (display.length == 0) {
            this.allData = "No Data Available";
            // this.dialogService.dockerDialog(`No Data Available.`)
            //     .afterClosed().subscribe(res => {
            //     })
        }
        else {
            this.allData = "";
            this.noData = false;
        }
    }

    chekss = [];
    checked: boolean;
    checkd: boolean;
     /*Logic Description: when selecting the checkbox of all scripts in table header
  */
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

 /*Logic Description: this call when select script checkbox
  */
    copy(i, test, value) {
        this.i = i;
        console.log(this.i, value)

        this.tests = test;
        this.value = value;
        var selectedscripts: object = {};
        selectedscripts["featureId"] = test.featureId;
        selectedscripts["moduleId"] = test.moduleId;
        selectedscripts["typeId"] = test.typeId;
        selectedscripts["priorityId"] = test.priorityId;

        selectedscripts["moduleName"] = test.moduleName;
        selectedscripts["featureName"] = test.featureName;
        selectedscripts["scriptName"] = test.scriptName;
        selectedscripts["type"] = test.type;
        selectedscripts["scriptId"] = test.scriptId;
        selectedscripts["priority"] = test.priority;
        selectedscripts["checkbox"] = this.value;
        console.log(selectedscripts)
        if (this.value == true) {

            //this.scripts.push(selectedscripts);

        } else {
            var selectedscripts: object = {};
        }
    }

    releaseDataAdded: any;
 /*Logic Description:when click on add to release to add selected scripts to release
  */
    saveRelease(testScriptsData) {
        console.log(this.releaseId)
        this.newscripts = [];

        if (this.releaseId != undefined) {
            let releaseInfo = {
                //releaseData: this.scripts,
                releaseId: this.releaseId,
                projectId: this.projectidRelease
            }
            console.log(this.scripts)
            for (let i = 0; i <= this.testScriptsData.length - 1; i++) {
                if (testScriptsData[i].checkbox != false) {

                    this.newscripts.push(testScriptsData[i]);

                }
            }
            console.log(this.newscripts)
            releaseInfo["releaseData"] = this.newscripts
            console.log(releaseInfo)
            this.completeobject["scripts"] = this.newscripts;
            if (this.newscripts.length != 0) {
                // this.releaseDataAdded = this.newscripts
                this.CreateService.saveReleaseVersion(releaseInfo)
                    .subscribe(result => {
                        // this.findReleaseData(this.releaseId)
                        this.decoratorKey.saveSnackbar('Save Successfully', '', 'save-snackbar')
                        this.newscripts = [];
                        this.disable = true;
                        this.hidden = true;
                    });
            }

            else {
                this.dialogService.test_executionDialog('Please select the Script')
                this.scripts = [];
            }
        }
        else {
            console.log("release undefined")
            // this.dialogService.test_executionDialog('Please select Release Name')

        }

    }//savescripts
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['Sl.No', 'Module', 'Feature', 'Testcase', 'Type', 'Priority'];
 /*Logic Description:displaying the added scripts in release on view release
  */
    releaseWiseSearch(rel) {
        this.releaseDataAdded = [];
        console.log(rel)
        let obj = {
            "releaseVersion": rel,
            "projectId": this.projectidRelease
        }
        this.searchButton = true;
        this.CreateService.releaseWiseSearch(obj)
            .subscribe(async (result) => {
                console.log(result[0].releaseData, result[0].releaseData == undefined)

                if (result[0].releaseData != undefined) {
                    var script = await this.sortScript(result[0].releaseData)
                    var feature = await this.sortFeature(script)
                    var module = await this.sortModule(feature)
                    this.releaseDataAdded = module
                    console.log(this.releaseDataAdded, this.releaseDataAdded.length)
                    // this.releaseDataAdded.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
                    this.noData = false;
                    this.allData = "";
                } else {
                    this.noData = true;
                    this.allData = "No Data Available";
                    // this.dialogService.dockerDialog(`No Data Available.`)
                    //     .afterClosed().subscribe(res => {
                    //     })
                }
            });
    }
    releaseBasedData: any;
 /*Logic Description:when changing the feature dropdown
  */
    findReleaseData(releaseId) {
        this.searchButton = true;
        this.CreateService.findRelease(releaseId)
            .subscribe(result => {
                console.log(result)
                // this.releaseBasedData = result;
                // this.releaseDataAdded = this.releaseBasedData[0].releaseData;
            });
    }

    permissions = [];
    edit: boolean
    read: boolean
    delete: boolean
    create: boolean;
    disableButton: boolean;


    getRolesPermissions() {
        this.roles.getPermissions(this.pageRoles).subscribe(Data => {
            this.permissions = Data;
            this.edit = this.permissions[0].edit;
            this.read = this.permissions[0].read
            this.delete = this.permissions[0].delete
            this.create = this.permissions[0].create
            this.disableButton = this.permissions[0].disableButton
        })
    }


}