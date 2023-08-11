import { Component, OnInit } from '@angular/core';
import { TestExecutionServiceComponent } from '../../../../core/services/testExecution.service';
import { Post } from '../../../../post';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { roleService } from '../../../../core/services/roleService';
import { MatSnackBar } from '@angular/material';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { MatTableDataSource } from '@angular/material/table';
import { RequirementmoduleService } from '../../../../core/services/requirementmodule.service';
import { DialogService } from '../../../../core/services/dialog.service';

@Component({
  selector: 'app-traceability',
  templateUrl: './traceability.component.html',
  styleUrls: ['./traceability.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [roleService, TestExecutionServiceComponent, ProjectDetailServiceComponent, apiServiceComponent]
})
export class TraceabilityComponent implements OnInit {
  allData: string;
  projectName: string;
  pageName: string;
  newRole: string;
  newUserId: string;
  newUserName: string;
  pageRoles: Object = {}
  moduleNames = [];
  datas: any;
  demoArrayaData: any;
  moduleId: string;
  moduleName: string;
  featureId: string;
  featureName: string;
  displayscripts: any;
  selectedProject: any;
  displayTestData: boolean;
  clickedModule: any;
  clickedFeature: any;
  clickedScript: any;
  selectedname: any;
  showAllModules: boolean;
  allowModulewisePage: boolean;
  allowFeatureWisePage: boolean;
  moduleIdmm: any;
  testScriptsDat: any;
  permissions = [];
  edit: boolean
  read: boolean
  delete: boolean
  create: boolean;
  disableButton: boolean;

  constructor(public _snackbar: MatSnackBar,
    private roles: roleService,
    private dialogService: DialogService,
    private requirementmoduleService: RequirementmoduleService) { }

  ngOnInit() {
    this.pageName = "traceabilityPage"
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.selectedProject = JSON.parse(this.selectedProject);
    this.pageRoles = {
      pageName: this.pageName,
      roleName: this.newRole,
      userId: this.newUserId
    }
    this.getAllModules();
    this.getRolesPermissions();
  }


  myscripts(test) {
    this.displayscripts = test.scripts;
  }

  getRolesPermissions() {
    console.log(this.pageRoles);
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

  ////////////////////////////////////Tree structure code starts //////////////////////////////////////////
  getAllModules() {
    this.displayTestData = false;
    var files = [];
    console.log(this.selectedProject)
    this.requirementmoduleService.getAllModuledata(this.selectedProject).subscribe(
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

  displayModuleForTree: Post[];
  items: { label: string; command: (event: any) => void; }[];

  async nodeSelect(file) {
    this.displayTestData = false;
    if (file.node != undefined) {
      if (file.node.data == "module") {
        this.clickedModule = file.node.label;
        for (let index = 0; index < this.displayModuleForTree.length; index++) {//for loop here is to find index of selected or clicked module
          if (file.node.label === this.displayModuleForTree[index]['label']) {
            // this.openFeatureMenu(this.clickedModule, index);
            break;
          }

        }
        this.items = [
              { label: 'View Module wise', command: (event) => this.displayModuleWise(file.node.label) }
            ]
        // if (!this.create) {     //shiva
        //   this.items = []
        // }
        // else if (this.create && this.pageRoles == 'Manager') {
        //   // alert("Manager")
        //   console.log(this.clickedModule, file.node.label)
        //   this.items = [
        //     { label: 'View Module wise', command: (event) => this.displayModuleWise(file.node.label) }
        //   ]

        // }
        // else {
        //   console.log(file.node.label)
        //   this.items = [
        //     { label: 'View Module wise', command: (event) => this.displayModuleWise(file.node.label) }

        //   ];
        // }
        this.displayModuleWise(file.node)
      }
      else if (file.node.data == "feature") {
        let children = file.node.parent.children
        this.clickedModule = file.node.parent.label;
        this.clickedFeature = file.node.label;
        console.log(this.clickedModule)
        console.log(this.clickedFeature)
        for (let index = 0; index < children.length; index++) {//for loop here is to find index of selected or clicked feature
          if (file.node.label === children[index]['label']) {
            // this.openScriptMenu(this.clickedFeature, index)
            break;
          }

        }
        this.items = [
              { label: 'View Feature wise', command: (event) => this.displayFeatureWise(file.node.label) }
  
            ]
        // if (!this.create) {         //shiva
        //   this.items = []
        // }
        // else if (this.create && this.pageRoles == 'Manager') {
        //   console.log(this.clickedModule)
        //   this.items = [
        //     { label: 'View Feature wise', command: (event) => this.displayFeatureWise(file.node.label) }

        //   ]

        // }
        // else {
        //   console.log(this.clickedModule)
        //   this.items = [
        //     { label: 'View Feature wise', command: (event) => this.displayFeatureWise(file.node.label) }

        //   ]
        // }
        this.displayFeatureWise(file.node.label)
      }
      else if (file.node.data == "script") {
        this.clickedModule = file.node.parent.parent.label;
        this.clickedFeature = file.node.parent.featureName;
        this.clickedScript = file.node.label;
        console.log(file.node)
        console.log(this.clickedScript)
      }
    }
    else {
      console.log(file.node);
      return;
    }
  }
  // deleteRequirement(x){
  //   console.log("sssss",x)
  // }
  //////////////////////////////// tree structure ends //////////////////////////////

  openMenuData(pageName, bb) {
    if (bb.parent !== undefined) {
      console.log(bb)
      this.selectedname = bb.label;
      console.log(bb.label, bb.parent.label)
      this.displayFeatureWise(bb.label)
    }
    else {
      console.log(bb)
      this.displayModuleWise(bb)
    }

  }
  testScriptsAll: any;
  landModulePage() {
    // alert("hai")
    this.showAllModules = true;
    this.allowModulewisePage = false;
    this.allowFeatureWisePage = false;
    let obj = {
      proId: this.selectedProject.projectId
    }
    this.requirementmoduleService.displayAllModuleData(obj).subscribe(result => {
      console.log(result)
      this.testScriptsAll=this.sortAllModules(result)
      this.displayAllModules()

    })
  }

  sortAllModules(testData){
    testData.sort((a, b) => a.testcaseData.requirementName.localeCompare(b.testcaseData.requirementName))
    testData.sort((a, b) => a.featureData.featureName.localeCompare(b.featureData.featureName))
    testData.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
    return testData;
  }

  sortModules(testData){
    testData.sort((a, b) => a.requirementName.localeCompare(b.requirementName))
    testData.sort((a, b) => a.featureName.localeCompare(b.featureName))
    testData.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
    return testData;
  }
  displayModuleWise(modules) {
    console.log(modules.label)
    this.showAllModules = false;
    this.allowModulewisePage = true;
    this.allowFeatureWisePage = false;
    console.log(modules.label)
    this.showModuleWiseData(modules.label)
  }
  displayFeatureWise(features) {
    console.log(features)
    this.showAllModules = false;
    this.allowModulewisePage = false;
    this.allowFeatureWisePage = true;
    let obj = {
      feaId: features
    }
    this.showFeatureWiseData(obj)
  }

  displayAllModules() {
    this.moduleIdmm = this.selectedProject.projectId

  }

  showModuleWiseData(modules) {
    console.log(modules)
    this.requirementmoduleService.showModuleWiseData(modules)
      .subscribe(result => {
        console.log(result)
        this.moduleIdmm = this.selectedProject.projectId + ',' + result[0].moduleId;
        let obj = {
          proId: this.selectedProject.projectId,
          modId: result[0].moduleId
        }
        this.searchmmm(obj)
      });
  }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Sl.No', 'Module', 'Feature', 'Requirement', 'Count'];

  displayedColumns1: string[] = ['Sl.No', 'Testcase'];
  searchmmm(modules) {
    this.requirementmoduleService.testScriptDetails(modules)
      .subscribe(result => {
        this.testScriptsDat = this.sortModules(result)
        console.log(this.testScriptsDat);
        if (this.testScriptsDat.length == 0) {
          this.allowModulewisePage = false;
          this.allowFeatureWisePage = false;
          this.showAllModules = false;
          this.dialogService.openAlert('Data is Not Present').afterClosed().subscribe(res => {
          })
        }
      });
  }

  showFeatureWiseData(feature) {
    console.log(feature)
    this.requirementmoduleService.showFeatureWiseData(feature)
      .subscribe(result => {
        let modId = result[0].moduleId
        if (result[0].moduleId !== null) {
          let obj = {
            proId: this.selectedProject.projectId,
            modId: result[0].moduleId,
            freId: result[0].featureId
          }
          this.searchmmm(obj)


        }
        else {
          let obj = {
            proId: this.selectedProject.projectId,
            modId: modId,
            freId: result[0].featureId
          }
          this.searchmmm(obj)
        }


      });
  }

}
