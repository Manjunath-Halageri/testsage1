import { Component, OnInit } from '@angular/core';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { Router } from '@angular/router';
import { ProjectSelectionServiceComponent } from '../../../../core/services/projectSelection.service';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { roleService } from '../../../../core/services/roleService';
import { Post } from '../../../../post';
import { LoginServiceComponent } from '../../../../core/services/login.service';
import { HttpClient } from '@angular/common/http';
import { CreateService } from '../../../../core/services/release-create.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [ProjectDetailServiceComponent, apiServiceComponent, roleService]
})
export class ProjectDetailsComponent implements OnInit {

  date1: any;
  date2: any;
  runNumber: Post[];
  moduleChild: Post[];
  index: Post[];
  moduleName: any;
  featureName: any;
  projectName: string;
  indexvalue: number;
  message: string;
  show: boolean;
  mo: boolean;
  execute: boolean;
  con: boolean;
  testExecution: boolean;
  displayModule: boolean;
  displayFeature: boolean;
  displayImport: boolean;
  sMN: string;
  validMn: string;
  ind: number;
  importMessage: any;
  valid: boolean
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
  script: any;
  testcase: any;
  templatePath: any;
  ed: boolean;
  report: boolean;
  resulttypes: Post[];
  updateTCResult: any;
  myUsername: string;
  reports: boolean;
  newUserName: string;
  loginDockerObject: any;
  Api: string;
  allProject: any;
  apiFrameworkId: any;
  apiCondition: boolean;
  apiOther: boolean;

  constructor(private ata: ProjectSelectionServiceComponent, private postData: LoginServiceComponent,
    private roles: roleService, private router: Router, private api: apiServiceComponent,
    private data: ProjectDetailServiceComponent, private http: HttpClient,
    private createService: CreateService) {
    this.show = false;
    this.mo = false;
    this.execute = false;
    this.testExecution = false;
    this.displayModule = false;
    this.displayFeature = false;
    this.displayImport = false;
    this.ed = false;
    this.report = false;
    this.reports = false;
  }

  from: any;
  todate: any;
  roleName: any;
  exportCondition: boolean;
  allProjects = [];

  ngOnInit() {
    this.maticondown = true;
    this.maticonright = false;
    let UserName = sessionStorage.getItem('importedDetails')
    let parsedUserName = JSON.parse(UserName)
    this.myUsername = parsedUserName[0].userName
    this.roleName = parsedUserName[0].roleName
    this.newUserName = sessionStorage.getItem('userName')
    this.getRole()
    let dataFromProjectSelectionDropdown = sessionStorage.getItem('key');
    this.projectName = dataFromProjectSelectionDropdown;
    let allProject = sessionStorage.getItem('selectedProject');
    let framework = JSON.parse(allProject);
    this.apiFrameworkId = framework.frameworkId;
    this.createService.typeDetails().subscribe(typeData => this.type = typeData);
    this.createService.priorityDetails().subscribe(priorityData => this.priority = priorityData);
    this.data.getActions().subscribe(typeData1 => this.resulttypes = typeData1);
    this.from = new Date().toISOString().substr(0, 10);
    this.todate = new Date().toISOString().substr(0, 10);
    this.testcase = false;
    this.data.takeProjectName(this.projectName);
    window.sessionStorage.setItem('pageStatus', null);
    window.sessionStorage.setItem('selectedRunCount', null);
    window.sessionStorage.setItem('selectedtime', null);
    window.sessionStorage.setItem('newRun', null);
    window.sessionStorage.setItem('moduleName', null);
    const features = JSON.parse(sessionStorage.getItem('features'));
    this.exportCondition = features.filter(feature => feature.name === "export")[0].condition;

    return this.http.get(this.api.apiData + '/projectnames', {})
      .map(response => { return response as any })
      .subscribe(result => {
        this.Allprojects = result;

      });
  }
  Allprojects: any;
  // dropdownData(dataSelected) {
  //   sessionStorage.setItem('key', dataSelected);
  //   sessionStorage.setItem('selectedProject', JSON.stringify(this.ata.getProjectIdDetails(dataSelected, this.Allprojects)));
  //   this.router.navigate(['/projectdetail']);
  // }

  showDropDown: boolean;

  manualtoggle(clickModule, index) {
    this.sMN = clickModule;
    this.ind = index;
    this.data.moId(clickModule).subscribe(moduleData => {
      this.selectedMod = moduleData; this.verificationModule(this.selectedMod)
        ; this.index = this.selectedMod[0].unitedFM
    });


    this.data.childModuleDetails(index)
      .subscribe(moduleData => {
        this.moduleChild = moduleData;
        this.indexvalue = this.moduleChild[0].moduleId;
      });
  }

  verificationModule(vMF) {
    this.validMn = vMF[0].moduleName;
  }

  ngOnDestroy() {
    console.log("destroy")
    clearInterval(this.everyTime);
  }

  signOutFun() {
    this.router.navigate(['logincomponent']);
    location.reload();
  }


  changeShowStatus() {
    if (this.valid != true) {
      this.show = true;
      this.testExecution = false;
      this.mo = false;
      this.execute = false;
      this.report = false;
    }

  }

  showTestExecution(folderName) {
    this.data.getProjectDir(this.projectName)
      .subscribe(moduleData => {
        this.importMessage = moduleData;
        this.importData(this.importMessage);
      });
    this.data.createFolder(folderName)
      .subscribe(moduleData => {
        this.importMessage = moduleData;
        this.importData(this.importMessage);
      });
    this.show = false;
    this.testExecution = true;
    this.mo = false;
    this.execute = false;
    this.report = false;
  }

  importData(data) {
    this.valid = true;
    if (data === "Please Wait Files Are Synchronizing") {
      this.importMessage = data;
    }
    else if (data === "Synchronized Done") {
      this.importMessage = data
      this.valid = false;
    }
  }

  goCreateModule() {
    this.everyTime = setInterval(() => {
      this.ngOnInit();

    }, 1000);
    this.displayModule = true;
    this.displayFeature = false;
    this.displayImport = false;
  }

  goCreateFeature() {
    this.displayFeature = true;
    this.displayModule = false;
    this.displayImport = false;
  }

  goImport() {
    this.displayImport = true;
    this.displayModule = false;
    this.displayFeature = false;
    this.ed = false;
  }

  mobile() {
    this.mo = true;
    this.execute = false;
    this.show = false;
  }

  execution() {
    this.execute = true;
    this.mo = false;
    this.show = false;
  }

  connect() {
    this.con = true;
  }

  clickModulee(a, index) {
    var mod = a;
    this.ind = index;
    return this.http.post(this.api.apiData, mod)
      .map(response => { return response as any })
      .subscribe(result => this.modd = result);
  }

  clickFeature(b, index) {
    this.indU = index;
    return this.http.post(this.api.apiData, b)
      .map(response => { return response as any })
      .subscribe(result => { this.feat = result; });
  }


  save() {
    for (var i = 0; i < this.feat.length; i++) {
      this.id = this.feat[i].scriptName + ',' + this.feat[i].typeName + ',' + this.feat[i].priorityName + ',' + this.feat[i].time + ',' + this.feat[i].projectId;
      this.data.idDetails(this.id).subscribe(result => { this.ids = result; });
    }
  }

  changeShowReport() {
    if (this.valid != true) {
      this.report = true;
      this.show = false;

      this.testExecution = false;
      this.mo = false;
      this.execute = false;
    }
  }

  runNumberSearch(fromDate, toDate) {
    this.date1 = fromDate;
    this.date2 = toDate;
    let runDate = fromDate + ',' + toDate;
    this.http.get('http://localhost:2111/sarechDate' + runDate, {})
      .map(response => { return response as any })
      .subscribe(result => {
        this.runNumber = result;
      })
  }
  index1: any;
  fetchRunDetails(run, i) {
    this.data.reportDetails(run).subscribe(typeData => this.resulttypes = typeData);
    this.index1 = i;
  }
  mergeTestLink(test) {
    var testcaseLength = test.length;
    this.updateTCResult = function (n) {
      if (n < testcaseLength) {
        var obj07 = {};
        var user = "Admin";
        var testplanid = "10";
        var buildid = "1";
        var notes = "Demo For Vijay";
        var overwrite = "true";
        if (test[n].Result == "Pass") { var Result = "p"; }
        else if (test[n].Result == "Fail") { var Result = "f"; }
        else { Result = null; }
        obj07["user"] = user;
        obj07["testplanid"] = testplanid;
        obj07["buildid"] = buildid;
        obj07["testcaseexternalid"] = test[n].TestCase;
        obj07["notes"] = notes;
        obj07["status"] = Result;
        obj07["overwrite"] = overwrite;
        this.http.post('http://localhost:2111/testLinkTCUpdateCall', obj07, {})
          .map(response => { return response as any })
          .subscribe(result => {
            console.log(result)
          });
        this.updateTCResult(n + 1)
      }
    }
    this.updateTCResult(0);
  }

  import() {
    this.displayImport = true;
    this.ed = false;
  }

  edit() {
    this.ed = true;
    this.displayImport = false;

  }

  showError(errorMessage) {
    alert(errorMessage);
  }
  onNavigate(screenshot) {
    window.open(screenshot, "_blank");
  }

  onClickVideo(videoPath) {
    window.open(videoPath, "_blank");
  }

  testCase() {
    this.testcase = true;
    this.ed = false;
    this.displayImport = false;


  }
  Case234 = [];
  addCase() {

    this.Case234.push({
      'actions': "",
      'object': "",
      'input': "",
      "templatePath": ""
    })


  }
  getPath(action) {
    this.Case234[0].templatePath = action.appiumPath;
  }

  allAct: any;
  alAction: Object = {}

  actionSave(filename) {
    var date234 = new Date();
    this.alAction = {

      allActitons: this.Case234,
      Date: date234,
      fileName: filename
    }
  }

  /////////////////////////////////START BY SHIVANAND/////////////////////////


  allModules = [];
  appPermissions = [];
  createTest: boolean;
  manageReusableFunction: boolean;
  objectRepo: boolean;
  testPlanning: boolean;
  testExecutionPart: boolean;
  selection: boolean;
  createSuite: boolean;
  excecution: boolean;
  SchedulerList: boolean;
  AutoCorrection: boolean;
  docker: boolean;
  mobileLab: boolean;
  release: boolean;
  manageReleasePage: boolean;
  releaseScopePage: boolean;
  requirement: boolean;
  manageRequirementPage: boolean;
  traceabilityPage: boolean;
  dashboard: boolean;
  testExecutionProgressPage: boolean;
  testCaseReportPage: boolean;
  hierarchyTestExecutionPage: boolean;
  defectProgressPage: boolean;
  defectHierarchyPage: boolean;
  defectManagement: boolean
  fileDefectPage: boolean;
  searchDefectPage: boolean;
  Search:boolean;

  getRole() {

    this.roles.getModules(this.roleName).subscribe(
      Data => {
        this.allModules = Data;
        this.testPlanning = this.allModules[0].mainFunctions[0].testPlanning;
        this.testExecutionPart = this.allModules[0].mainFunctions[1].testExecution;
        this.reports = this.allModules[0].mainFunctions[2].reports;
        this.docker = this.allModules[0].mainFunctions[3].docker;
        this.mobileLab = this.allModules[0].mainFunctions[4].MobileLab;
        this.release = this.allModules[0].mainFunctions[5].release;
        this.requirement = this.allModules[0].mainFunctions[6].requirement;
        this.dashboard = this.allModules[0].mainFunctions[7].dashboard;
        this.defectManagement = this.allModules[0].mainFunctions[8].defectManagement;
        console.log(this.allModules[0].mainFunctions[9].release)
        this.Search = this.allModules[0].mainFunctions[9].Search;
      })
  }


  getAllPages(newNavPage) {
    for (var i = 0; i <= this.allModules[0].mainFunctions.length - 1; i++) {

      if (this.allModules[0].mainFunctions[i].modules == newNavPage && this.allModules[0].mainFunctions[i].value == true) {
        if (newNavPage == "testPlanning") {

          this.createTest = this.allModules[0].mainFunctions[i].mainPages[0].creatTestCase;
          this.manageReusableFunction = this.allModules[0].mainFunctions[i].mainPages[0].manageReusableFunction;
          this.objectRepo = this.allModules[0].mainFunctions[i].mainPages[0].ObjectRepository;
        }
        else if (newNavPage == "release") {

          this.manageReleasePage = this.allModules[0].mainFunctions[i].mainPages[0].manageRelease;
          this.releaseScopePage = this.allModules[0].mainFunctions[i].mainPages[0].releaseScope;
        }
        else if (newNavPage == "requirement") {

          this.manageRequirementPage = this.allModules[0].mainFunctions[i].mainPages[0].manageRequirement;
          this.traceabilityPage = this.allModules[0].mainFunctions[i].mainPages[0].traceability;
        }
        else if (newNavPage === "testExecution") {

          this.selection = this.allModules[0].mainFunctions[i].mainPages[0].selection;
          this.createSuite = this.allModules[0].mainFunctions[i].mainPages[0].createSuite;
          this.excecution = this.allModules[0].mainFunctions[i].mainPages[0].excecution;
          this.SchedulerList = this.allModules[0].mainFunctions[i].mainPages[0].SchedulerList;
          this.AutoCorrection = this.allModules[0].mainFunctions[i].mainPages[0].AutoCorrection;

        }
        else if (newNavPage === "dashboard") {
          // alert(newNavPage)

          this.testExecutionProgressPage = this.allModules[0].mainFunctions[i].mainPages[0].testExecutionProgress;
          this.testCaseReportPage = this.allModules[0].mainFunctions[i].mainPages[0].testCaseReport;
          this.hierarchyTestExecutionPage = this.allModules[0].mainFunctions[i].mainPages[0].hierarchyTestExecution;
          this.defectProgressPage = this.allModules[0].mainFunctions[i].mainPages[0].defectProgress;
          this.defectHierarchyPage = this.allModules[0].mainFunctions[i].mainPages[0].defectHierarchy;

        }
        else if (newNavPage === "defectManagement") {
          // alert(newNavPage)
          this.fileDefectPage = this.allModules[0].mainFunctions[i].mainPages[0].fileDefect;
          this.searchDefectPage = this.allModules[0].mainFunctions[i].mainPages[0].searchDefect;

        }
      }
    }
  }


  //Anil logout function starts here
  logoutDocker() {
    let loginDetails = JSON.parse(sessionStorage.getItem('loginDetails'));
    this.postData.getUserDetails(loginDetails).subscribe(result => {
      localStorage.clear();
      sessionStorage.clear();
      console.log(result)
    })
  }


  opened: boolean;
  showMenu1 = false;
  showMenu2 = false;
  showMenu3 = false;
  showMenu4 = false;
  showMenu5 = false;
  showMenu6 = false;
  toggleMenu1() {
    this.showMenu1 = !this.showMenu1;
    this.showMenu3 = false;
    this.showMenu2 = false;
    this.showMenu5 = false;
    this.showMenu4 = false;
    this.showMenu6 = false;
  }
  toggleMenu2() {
    this.showMenu2 = !this.showMenu2;
    this.showMenu3 = false;
    this.showMenu1 = false;
    this.showMenu5 = false;
    this.showMenu4 = false;
    this.showMenu6 = false;
  }

  toggleMenu3() {
    this.showMenu3 = !this.showMenu3;
    this.showMenu2 = false;
    this.showMenu1 = false;
    this.showMenu5 = false;
    this.showMenu4 = false;
    this.showMenu6 = false;
  }
  toggleMenu4() {
    this.showMenu4 = !this.showMenu4;
    this.showMenu2 = false;
    this.showMenu1 = false;
    this.showMenu3 = false;
    this.showMenu5 = false;
    this.showMenu6 = false;
  }
  toggleMenu6() {
    this.showMenu6 = !this.showMenu6;
    this.showMenu2 = false;
    this.showMenu1 = false;
    this.showMenu4 = false;
    this.showMenu3 = false;
  }
  showMenu7: boolean;
  toggleMenu7() {
    this.showMenu7 = !this.showMenu7;
    this.showMenu2 = false;
    this.showMenu1 = false;
    this.showMenu4 = false;
    this.showMenu3 = false;
    this.showMenu6 = false;
  }

  maticondown: boolean
  title = 'AngularMaterialGettingStarted';

  isMenuOpen = true;
  contentMargin = 275;
  navcontainer: any;
  maticonright: boolean;
  
  onToolbarMenuToggle() {
    console.log('On toolbar toggled', this.isMenuOpen);
    this.isMenuOpen = !this.isMenuOpen;

    if (!this.isMenuOpen) {
      this.contentMargin = 56;
      this.maticondown = false;
      this.maticonright = true;
    } else {
      this.contentMargin = 255;
      this.maticondown = true;
      this.maticonright = false;
    }
  }
}