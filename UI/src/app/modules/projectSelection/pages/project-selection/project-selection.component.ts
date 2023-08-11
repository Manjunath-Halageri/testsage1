import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { ProjectSelectionServiceComponent } from '../../../../core/services/projectSelection.service';
import { Post } from '../../../../post';
import 'rxjs/add/operator/map';
import { roleService } from '../../../../core/services/roleService';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { DecoratorService } from '../../../../core/services/decorator.service';
import { LoginServiceComponent } from '../../../../core/services/login.service'
import { DialogService } from '../../../../core/services/dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project-selection',
  templateUrl: './project-selection.component.html',
  styleUrls: ['./project-selection.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class ProjectSelectionComponent implements OnInit, OnChanges {
  theFiles: any;
  relativePath: any;
  datas: Post[];
  selectedDropdown: string;
  child: string
  projectSelectionData = [];
  currentFile: any;
  projectName: string;
  Folder: any;
  sucess: any;
  moduleSelected: any;
  pomFile: any;
  testFile: any;
  createNewProject09: boolean;
  createdData: Response;
  Allprojects: any;
  pedit: any;
  newProjectFrame: any;
  selectedPname: any;
  newProjectName: any;
  disable: any;
  browser: any;
  dbrowsers: any;
  selectedBrowser: any;
  selectedId: any;
  allversions: any;
  version: any;
  selectionversion: any;
  time: any;
  newpname: string;
  configdata: Object = {};
  editconfigdata: Object = {};
  modal1: any;
  newProjectDetails: Object = {};
  editProjectDetails: Object = {};
  editpname: any;
  pdata: any;
  pconfigdata: any;
  defaultBrowser: any;
  defaultVersion: any;
  versionName: any;
  oldpname: any;
  newRole: any;
  pageRoles: Object = {}
  pageName: any;
  newUserName: any;
  newUserId: any;
  names: Object = {};
  userForm: any;
  userForm1: any;
  userForm3: any;
  loginDockerObject: any;
  framework: any;
  exportCondition: boolean;
  apiFrameworkId: any;
  defaultConfigs: any;
  disablebutton: boolean;

  constructor(private decoratorServiceKey: DecoratorService,
    private postData: LoginServiceComponent,
    private formBuilder: FormBuilder,
    public _snackbar: MatSnackBar,
    private dialogService: DialogService,
    private roles: roleService,
    private projectSelectionService: ProjectSelectionServiceComponent,
    private router: Router,
    private http: HttpClient,
    private api: apiServiceComponent) {
    this.theFiles = [];
  }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Sl.No', 'Project Name', 'ConfigFile', 'Edit', 'Delete'];

  showSnackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'start',
      panelClass: [className]
    });
  }

  show_Snackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'start',
      panelClass: [className]
    });
  }

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Countries",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
    this.disablebutton = true;
    let allProject = sessionStorage.getItem('selectedProject');
    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
        let token = localStorage.getItem('jwt_token');
        if (token == undefined) { 
          this.router.navigate(['/']);
        }
      }
    }, false);

    this.createNewProject09 = false;
    this.disable = 0;
    this.pedit = 0;
    this.projectSelectionvalidation();
    this.pageName = "projectSelection"
    const features = JSON.parse(sessionStorage.getItem('features'));
    this.exportCondition = features.filter(feature => feature.name === "export")[0].condition;
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    /** this is added to get frameworks from backend */
    this.projectSelectionService.getFrameWorks().subscribe(result => {
      this.framework = result.framework;
    })
    this.projectSelectionService.getbrowser().subscribe(result => {
      this.browser = result;
      this.dbrowsers = this.browser;
    })
    this.pageRoles = {
      pageName: this.pageName,
      roleName: this.newRole,
      userId: this.newUserId,
      userName: this.newUserName,
      planId: 2
    }
    this.getProjects()
    this.getRolesPermissions()
    this.defaultConfig();
    this.projectSelectionService.getProjectNames()
      .subscribe(result => {
        this.Allprojects = result;
      });
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }

  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  onDeSelectAll(items: any) {
    console.log(items);
  }

  defaultConfig() {
    this.projectSelectionService.getdefaultConfig().subscribe(result => {
      this.defaultConfigs = result;
    })
  }

  projectSelectionvalidation() {
    this.userForm = this.formBuilder.group({
      'ProjectNameNew': ['', [Validators.required, ValidationserviceService.Project_Name, Validators.minLength(1),
      Validators.maxLength(30)]],
      'fname': ['', [Validators.required]]
    });

    this.userForm1 = this.formBuilder.group({
      'timenew': ['', [Validators.required, ValidationserviceService.timevalid, Validators.minLength(1),
      Validators.maxLength(4)]],
      'browser': ['', [Validators.required]],
      'VersionNew': ['', [Validators.required]],

    });
    this.userForm3 = this.formBuilder.group({
      'editpagename': ['', [Validators.required, ValidationserviceService.Project_Name, Validators.minLength(1),
      Validators.maxLength(30)]]
    });
  }


  dropdownData(dataSelected) {
    console.log(dataSelected.projectSelection)
    console.log(this.Allprojects)
    sessionStorage.setItem('key', dataSelected.projectSelection);
    sessionStorage.setItem('selectedProject', JSON.stringify(this.projectSelectionService.getProjectIdDetails(dataSelected.projectSelection, this.Allprojects)));
    this.router.navigate(['/projectdetail']);

  }
  createProject() {
    this.router.navigate(['/createProject']);
  }

  ngOnChanges() { }
  createNewProject() {
    this.createNewProject09 = true;
  }

  createDataCall(ProjectName, ProjectFrame, config, exportConfig) {
    this.newProjectDetails["pname"] = this.userForm.value.ProjectNameNew;
    this.newProjectDetails["pframe"] = ProjectFrame;
    this.newProjectDetails["pFrameId"] = this.apiFrameworkId;
    this.newProjectDetails["exportConfig"] = exportConfig;
    this.newProjectDetails["exportProjectName"] = ProjectName;
    config.Ip = "http://192.168.99.100:4444";
    this.newProjectDetails["config"] = config;
    this.projectSelectionService.createNewProject(this.newProjectDetails).subscribe(result => {
      if (result[0].status == "Pass") {
        this.ngOnInit();
        this.time = null;
        this.defaultBrowser = '';
        this.defaultVersion = '';
        this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
      }
      else {
        alert("Duplicate Project for same Framework not allowed");
        //  location.reload();
        this.cancelProject()
      }
    });
  }

  cancelProject() {
    this.createNewProject09 = false;
    this.disable = 0;
    this.ngOnInit();
    this.newProjectName = '';
    this.newProjectFrame = '';
    this.time = null;
    this.defaultBrowser = '';
    this.defaultVersion = '';
    this.disableConfigForApi = false;
  }

  deleteProject(index, data, pname) {
    this.dialogService.openConfirmDialog('Are you sure to delete this project ?')
      .afterClosed().subscribe(res => {
        if (res === '') {
          console.log('cancelled the operation');
        } else {
          this.projectSelectionService.projectdelete(data)
            .subscribe(result => {
              console.log(result)
              this.ngOnInit()
            })
        }
      })

  }//deleteProject()

  /** mainly changed to display in dropdown and backend send same as prev, without impacting the old logic */
  frameWorkTypeToframeWork(frameWorkType) {
    return this.framework.filter(framework => framework.frameworkType === frameWorkType)[0].framework;
  }

  frameWorkToframeWorkType(givenframeWork) {
    return this.framework.filter(framework => framework.framework === givenframeWork)[0].frameworkType;
  }

  editProject(index, pname, pframe, pdata) {
    this.time = pdata.projectConfigdata.settimeOut;
    this.defaultBrowser = pdata.projectConfigdata.defaultBrowser;
    this.defaultVersion = pdata.projectConfigdata.defaultVersion;
    this.pedit = 1;
    this.selectedId = pdata._id;
    this.createNewProject09 = true;
    this.oldpname = pname;
    this.newProjectName = pname;
    this.disable = 1;
    this.newProjectFrame = pframe;
    this.projectSelectionService.getProject(this.selectedId)
      .subscribe(result => {
        this.pdata = result[0];
        this.pconfigdata = this.pdata.projectConfigdata;
      });

  }

  editPopUp(pname) {
    this.defaultBrowser;
    this.editpname = pname;
    this.modal1 = 1;
  }
  updateProject(pname, time, browser, version) {
    this.editconfigdata["settimeOut"] = time;
    this.editconfigdata["defaultBrowser"] = browser;
    this.editconfigdata["defaultVersion"] = version;
    this.editProjectDetails["pid"] = this.selectedId;
    this.editProjectDetails["oldpname"] = this.oldpname;
    this.editProjectDetails["pname"] = pname;
    this.editProjectDetails["config"] = this.editconfigdata;
    this.projectSelectionService.editselectedProject(this.editProjectDetails)
      .subscribe(result => {
        this.ngOnInit()
        this.pedit = 0;
        this.disable = 0;
        this.cancelProject();
      });
  }

  createConfig(time, browser, version) {
    let exportItOrNot
    if (time == undefined || browser == undefined || version == undefined) {
      time = this.defaultConfigs.settimeOut
      browser = this.defaultConfigs.defaultBrowser
      version = this.defaultConfigs.defaultVersion
    }
    this.time = time;
    this.browser = browser;
    this.version = version;
    this.newProjectName = this.userForm.value.ProjectNameNew;
    this.configdata["settimeOut"] = this.time;
    this.configdata["defaultBrowser"] = this.browser;
    this.configdata["defaultVersion"] = this.version;
    alert(this.exportCondition)
    if (this.exportCondition) {
      exportItOrNot = `exportYes`
    }
    else {
      exportItOrNot = `exportNo`
    }
    this.createDataCall(this.newProjectName, this.frameWorkTypeToframeWork(this.newProjectFrame.frameworkType), this.configdata, exportItOrNot);
  }

  getversion(browser) {
    this.selectedBrowser = browser;
    this.http.get(this.api.apiData + '/versions' + this.selectedBrowser)
      .map(response => { return response as any })
      .subscribe(result => {
        this.allversions = result;
        this.selectionversion = this.allversions[0].version;
      });
  }

  openpopup() {
    this.modal1 = 1;
    this.disablebutton = false;
  }
  allProjects = [];
  permissions = [];
  edit: boolean
  read: boolean
  delete: boolean
  create: boolean;
  disableButton: boolean;

  getProjects() {
    this.roles.getallProjects(this.pageRoles).subscribe(
      data => {
        this.allProjects = data;
      })
  }

  getRolesPermissions() {
    this.roles.getPermissions(this.pageRoles).subscribe(
      Data => {
        this.permissions = Data;
        this.edit = this.permissions[0].edit;
        this.read = this.permissions[0].read
        this.delete = this.permissions[0].delete
        this.create = this.permissions[0].create
        this.disableButton = this.permissions[0].disableButton
      })
  }

  //////////////////////////////////////Abhi code for Api//////////////////////////////////////
  disableConfigForApi: boolean = false;

  frameChange(newProjectFrame) {
    this.apiFrameworkId = newProjectFrame.frameworkId;
    if (newProjectFrame.frameworkType === "Api") {
      this.disableConfigForApi = true;
    } else {
      this.disableConfigForApi = false;
    }
  }


  createApiProject() {
    let Obj = {};
    Obj["projectName"] = this.userForm.value.ProjectNameNew;
    Obj["pFrame"] = this.frameWorkTypeToframeWork(this.newProjectFrame.frameworkType);
    Obj["pFrameId"] = this.apiFrameworkId;
    this.projectSelectionService.createApiProject(Obj)
      .subscribe(result => {
        this.createNewProject09 = false;
        this.decoratorServiceKey.saveSnackbar('Saved Successfully', '', 'save-snackbar')
        this.ngOnInit()
      })
  }

  // userProfile() {
  //   this.projectSelectionService.getUserDetails().subscribe(result => {
  //     console.log(result)
  //   })
  // }
  //////////////////////////////////Abhi code for Api ends here///////////////////////////////////

  //Anil logout function starts here
  logoutDocker() {
    let loginDetails = JSON.parse(sessionStorage.getItem('loginDetails'));
    this.postData.getUserDetails(loginDetails).subscribe(result => {
      localStorage.clear();
      sessionStorage.clear();
      console.log(result)
    })
  }
}