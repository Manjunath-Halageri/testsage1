import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { roleService } from '../../../../core/services/roleService';
import { DefectManagementModuleService } from '../../../../core/services/defectManagement-Module.service';
import { ValidationserviceService } from '../../../../shared/services/validation.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-search-adefect',
  templateUrl: './search-adefect.component.html',
  styleUrls: ['./search-adefect.component.css', '../../../../layout/css/table.css', '../../../../layout/css/parent.css']
})
export class SearchADefectComponent implements OnInit {
  @ViewChild('dfForm', { static: false }) dfForm;
  @ViewChild('screen', { static: false }) myScreenVariable: ElementRef;
  @ViewChild('vdo', { static: false }) myVdoVariable: ElementRef;

  displayedColumns: string[] = ['defectId', 'summary', 'priority', 'severity', 'status', 'raised by']; // table header
  dataSource: MatTableDataSource<any>;
  pageRoles: Object = {}
  status: any;
  priority: any;
  severity: any;
  allModule: any;
  selProjectName: string;
  featureNames: any;
  scriptNames: any;
  defectData: any;
  allData: string;
  srch: boolean;
  lineNu: string;
  projectName: string;
  tableData: any;
  noData: boolean;
  confirmation: boolean;
  form: boolean;
  defectId: any;
  // summary: (summary: any) => any;
  summary: any;
  releaseVer: any;
  browserName: any;
  device: any;
  os: any;
  assign: any;
  contactTo: any;
  description: any;
  defectForm: FormGroup;
  allDefectData: Object = {
    'defectId': '',
    'moduleId': '',
    'featureId': '',
    'scriptId': '',
    'date': '',
    'priorityId': '',
    'severityId': '',
    'statusId': '',
    'time': '',
    'releaseId': '',
    'summary': '',
    'description': '',
    'deviceId': '',
    'browserName': '',
    'assignedTo': '',
    'osId': '',
    'browserVersion': '',
    'qaContact': ''
  };
  mod: any;
  projectId: any;
  videoPath: any;
  screenshotPath: any;
  activeScreenUpload: number = 0;
  activeVideoUpload: number = 0;
  imageToUpload: File[];
  screenvideor: boolean;
  screenShotPath: any;
  videoToUpload: File[];
  index: number;
  screenPath: any;
  scIndex: number;
  selectedScreenshot: any;
  watchVideo: any;
  watchScreenshot: any;
  pageName: any;
  newRole: any;
  newUserId: any;
  newUserName: any;
  selectedProject: any;
  moduleId: any;
  featureId: any;
  scriptId: any;
  priorityId: any;
  severityId: any;
  statusId: any;
  searchForm: any;
  uploadVideoForm: any;
  uploadImageForm: any;
  spinnerVal: any;

  constructor(private https: HttpClient,
    private roles: roleService,
    private defectManagementService: DefectManagementModuleService,
    private fb: FormBuilder,
    private SpinnerService: NgxSpinnerService,
    private _snackbar: MatSnackBar,
    private sanitizer: DomSanitizer) {
    this.noData = false;
    this.uploadVideoForm = fb.group({
      'importVideo': ['', Validators.compose([
        Validators.required
      ])
      ]
    })
    this.uploadImageForm = fb.group({
      'importImage': ['', Validators.compose([
        Validators.required
      ])
      ]
    })
  }

  ngOnInit() {
    this.allData = "";
    this.pageName = "searchDefectPage"
    this.newRole = sessionStorage.getItem('newRoleName');
    this.newUserId = sessionStorage.getItem('newUserId');
    this.newUserName = sessionStorage.getItem('userName')
    this.selectedProject = sessionStorage.getItem('selectedProject')
    this.selectedProject = JSON.parse(this.selectedProject)
    this.spinnerVal = "Loading..."
    this.pageRoles = {
      pageName: this.pageName,
      roleName: this.newRole,
      userId: this.newUserId
    }

    this.searchForm = this.fb.group({
      'quickForm': ['', [Validators.required, ValidationserviceService.defectIDValidator]]
    });

    this.getRolesPermissions();

    this.selProjectName = sessionStorage.getItem('key');
    console.log(this.selProjectName);

    this.defectForm = new FormGroup({ //defect form validation
      defectId: new FormControl({ value: '', disabled: true }),
      moduleId: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      featureId: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      scriptId: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      date: new FormControl('', [Validators.required]),
      priorityId: new FormControl('', [Validators.required]),
      severityId: new FormControl('', [Validators.required]),
      statusId: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
      releaseId: new FormControl('', [Validators.required]),
      summary: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(300)]),
      deviceId: new FormControl('', [Validators.required]),
      browserName: new FormControl('', [Validators.required]),
      assignedTo: new FormControl('', [Validators.required]),
      osId: new FormControl('', [Validators.required]),
      browserVersion: new FormControl('', [Validators.required]),
      qaContact: new FormControl('', [Validators.required]),
    })


    this.selProjectName = sessionStorage.getItem('key');
    this.projectId = this.selectedProject.projectId;
    this.form = true;

    // this.allModule = [];
    // this.featureNames = [];
    // this.featureId = 'All';
    // this.moduleId = 'All';
    // this.scriptId = 'All';
    // this.featureNames = [{ featureId: 'All', featureName: "All" }]
    // this.allModule = [{ moduleId: 'All', moduleName: "All" }]
    // this.scriptNames = [{ scriptId: 'All', scriptName: "All" }]

    /*logic description: fetching the browsers along with versions*/
    this.defectManagementService.getbrowserFields().subscribe(result => {
      console.log(result)
      this.browserName = result;
    })
    console.log(this.featureNames, this.allModule, this.scriptId)
    /*
        this.defectManagementService.getAllModuledata(this.selProjectName).subscribe(result => {
          console.log(result)
          result.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
          this.allModule = result;
          // this.allModule.unshift({ moduleId: 'All', moduleName: "All" })
                    this.moduleId = 'All';
                    console.log(this.allModule);
        })
    
        
    
        this.defectManagementService.getDefectConfigDetails().subscribe(data => {
          this.status = data[0].status;
          this.priority = data[0].defectPriority;
          this.device = data[0].device;
          this.os = data[0].os;
          this.severity = data[0].severity;
          this.assign = data[0].assignedTo;
          this.contactTo = data[0].qaContact;
    
          // this.priority.sort((a, b) => a.priorityName.localeCompare(b.priorityName))
          // this.priority.unshift({ priorityId: 'All', priorityName: "All" })
          // this.priorityId = 'All';
          // console.log(this.priority)
    
          // this.severity.sort((a, b) => a.severityName.localeCompare(b.severityName))
          // this.severity.unshift({ severityId: 'All', severityName: "All" })
          // this.severityId = 'All';
          // console.log(this.severity)
    
          // this.status.sort((a, b) => a.status.localeCompare(b.status))
          // this.status.unshift({ statusId: 'All', status: "All" })
          // this.statusId = 'All';
          // console.log(this.status)
          this.DefaultDropDowns();
        })
    */
    this.onLoadData();
    /*logic description:fetching the active releases*/
    this.defectManagementService.getReleaseDetails(this.selProjectName).subscribe(result => {
      console.log(result)
      this.releaseVer = result;
    })
    this.watchVideo = this.sanitizer.bypassSecurityTrustResourceUrl('');
    this.watchScreenshot = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  /*logic description: fetching the modules and defect config details*/
  onLoadData() {
    this.defectManagementService.getAllModuledata(this.selProjectName).subscribe(result => {
      console.log(result)
      result.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
      this.allModule = result;
      this.allModule.unshift({ moduleId: 'All', moduleName: "All" })
      this.moduleId = 'All';
      console.log(this.allModule);
    })
    this.defectManagementService.getDefectConfigDetails().subscribe(data => {
      this.status = data[0].status;
      this.priority = data[0].defectPriority;
      this.device = data[0].device;
      this.os = data[0].os;
      this.severity = data[0].severity;
      this.assign = data[0].assignedTo;
      this.contactTo = data[0].qaContact;
      this.DefaultDropDowns();
    })
  }

  /*logic description:setting the default options to dropdowns*/
  DefaultDropDowns() {
    // this.allModule = [];
    this.featureNames = [];
    this.scriptNames = [];
    this.featureId = 'All';
    // this.moduleId = 'All';
    this.scriptId = 'All';
    this.featureNames = [{ featureId: 'All', featureName: "All" }]

    this.scriptNames = [{ scriptId: 'All', scriptName: "All" }]
    // this.allModule.unshift({ moduleId: 'All', moduleName: "All" })
    this.priority.sort((a, b) => a.priorityName.localeCompare(b.priorityName))
    this.priority.unshift({ priorityId: 'All', priorityName: "All" })
    this.priorityId = 'All';
    console.log(this.priority)
    this.severity.unshift({ severityId: 'All', severityName: "All" })
    this.severityId = 'All';
    console.log(this.severity)
    this.status.unshift({ statusId: 'All', status: "All" })
    this.statusId = 'All';
    console.log(this.status)
  }

  ///////////////// geting module , feature , script //////////////////////////////

  /*logic description:fetching the features based on selected module*/
  moduleIndex(moduleId) {
    let obj = {
      projectId: this.projectId,
      moduleId: moduleId
    }
    this.featureNames = [];
    this.scriptNames = [];
    if (moduleId != "All") {
      this.defectManagementService.searchModule(obj).
        subscribe(res => {
          this.featureNames = res;
          this.featureNames.sort((a, b) => a.featureName.localeCompare(b.featureName))
          this.featureNames.unshift({ featureId: 'All', featureName: "All" })
          this.featureId = 'All';
          console.log(this.featureNames)
          this.scriptId = 'All';
          this.scriptNames = [{ scriptId: 'All', scriptName: "All" }]
        })
    } else {
      this.featureNames = [{ featureId: 'All', featureName: "All" }]
      this.featureId = 'All';
      this.scriptId = 'All';
      this.scriptNames = [{ scriptId: 'All', scriptName: "All" }]
    }
  }

  /*logic description:fetching the scripts based on module and feature selected*/
  featureIndex(moduleId, featureId) {
    let obj = {
      projectId: this.projectId,
      moduleId: moduleId,
      featureId: featureId
    }
    this.scriptNames = [];
    if (moduleId != "All" && featureId != "All") {
      this.defectManagementService.searchFeaturesData(obj).
        subscribe(res => {
          console.log(res)
          this.scriptNames = res;
          this.scriptNames.sort((a, b) => a.scriptName.localeCompare(b.scriptName))
          this.scriptNames.unshift({ scriptId: 'All', scriptName: "All" })
          this.scriptId = 'All';
        })
    } else {
      this.scriptNames = [{ scriptId: 'All', scriptName: "All" }]
      this.scriptId = 'All';
    }
  }
  ///////////////// geting module , feature , script ends here //////////////////////////////

  /*logic description: quick search for single defect , passing with defect id */
  // Statusvalue = [];
  singleDefectDetail(value: string) {  // 
    let obj = {
      defectId: value,
      projectId: this.projectId
    }
    if (value == undefined || null || "") {
      console.log(value)
      alert("Please enter the defect Id")
    } else {
      this.DefaultDropDowns();
      this.defectManagementService.singleDefectDetail(obj).
        subscribe(data => {
          console.log(data)
          //   if(data.length!=0){
          //   if (data[0].screenshot == null) {
          //     console.log("no screenshot")
          //   }
          //   else {
          //     this.screenPath = data[0].screenshot.split('\\');
          //     this.scIndex = this.screenPath.length - 1;
          //     this.selectedScreenshot = this.screenPath[this.scIndex]
          //     console.log(this.selectedScreenshot)
          //     this.watchScreenshot = "/uploads/opal/defectScreenshots" + "/" + this.selectedScreenshot;
          //   }
          //   if (data[0].video == null) {
          //     console.log("no video")
          //   }
          //   else {
          //     this.videoPath = data[0].video.split('\\');
          //     this.index = this.videoPath.length - 1;
          //   }
          // }

          this.tableData = data;
          this.displayAllData(this.tableData);
        })
    }

  }

  /*logic description:  search defects based on given inputs fields */
  search(moduleId, featureId, scriptId, priorityId, severityId, statusId) {
    console.log(moduleId, featureId, scriptId, priorityId, severityId, statusId)
    if (moduleId == 'All') {
      moduleId = 'undefined'
    }
    if (featureId == 'All') {
      featureId = 'undefined'
    }
    if (scriptId == 'All') {
      scriptId = 'undefined'
    }
    if (priorityId == 'All') {
      priorityId = 'undefined'
    }
    if (severityId == 'All') {
      severityId = 'undefined'
    }
    if (statusId == 'All') {
      statusId = 'undefined'
    }
    this.allData = ""
    this.srch = true;
    this.lineNu = moduleId + ',' + featureId + ',' + scriptId + ',' + this.projectId + ',' + priorityId + ',' + severityId + ',' + statusId
    // console.log(this.lineNu);
    let obj = {
      proId: this.projectId,
      modId: moduleId,
      featureId: featureId,
      priorityId: priorityId,
      severityId: severityId,
      statusId: statusId
    }
    this.searchForm.reset();
    this.defectManagementService.testScriptDetails(this.lineNu)
      .subscribe(result => {
        this.tableData = result;
        console.log(this.tableData);
        this.displayAllData(this.tableData);
      });
  }

  /*logic description:  displaying the below text if defects on defect Id or search input */
  displayAllData(display) {
    this.noData = true;
    if (display.length == 0) {
      this.allData = "No Data Available";
    }
    else {
      this.noData = false;
    }
  }

  /*logic description:  to navigate based on selecting defect id */
  selectedVideo: any;
  def(value) {
    this.confirmation = true;
    this.form = false;

    let obj = {
      defectId: value,
      projectId: this.projectId
    }
    this.allModule = [];
    this.featureNames = [];
    this.scriptNames = [];
    // this.allModule.splice(0,1);
    this.getModules();
    this.priority.splice(0, 1);
    this.severity.splice(0, 1);
    this.status.splice(0, 1);
    this.defectManagementService.editDefectDetail(obj).
      subscribe(data => {
        console.log(data)
        if (data.length != 0) {
          this.allDefectData = data[0];
          if (data[0].screenshot == null) {
            console.log("no screenshot")
            this.selectedScreenshot = '';
          }

          else {
            this.screenShotPath = data[0].screenshot;
            this.screenPath = data[0].screenshot.split('\\');
            this.scIndex = this.screenPath.length - 1;
            this.selectedScreenshot = this.screenPath[this.scIndex]
            console.log(this.selectedScreenshot)
            // this.myScreenVariable.nativeElement.value=this.selectedScreenshot;
          }

          if (data[0].video == null) {
            console.log("no video")
            this.selectedVideo = '';
          }
          else {
            this.videoPath = data[0].video;
            // this.videoPath = data[0].video.split('\\');
            this.index = data[0].video.split('\\').length - 1;
            this.selectedVideo = data[0].video.split('\\')[this.index];
            console.log(this.videoPath, this.selectedVideo, this.index, data[0].video.split('\\'))
            // this.myVdoVariable.nativeElement.files[0]['name'] =this.selectedVideo;
          }
          // this.allModule = [{ moduleId: data[0].moduleId, moduleName: data[0].moduleName }]
          this.featureNames = [{ featureId: data[0].featureId, featureName: data[0].featureName }]
          this.scriptNames = [{ scriptId: data[0].scriptId, scriptName: data[0].scriptName }]
          console.log(this.allDefectData)
          console.log(this.selectedScreenshot)
          console.log(this.videoPath)
          this.version = this.browserName.filter((obj, index, arr) => {
            if (obj.browserName == data[0].browserName) {
              return obj.version;
            }
          })
          this.version = this.version[0].version;
        }
      })
  }

  /*logic description: fetching the modules*/
  getModules() {
    this.defectManagementService.getAllModuledata(this.selProjectName).subscribe(result => {
      console.log(result)
      result.sort((a, b) => a.moduleName.localeCompare(b.moduleName))
      this.allModule = result;
      console.log(this.allModule);
    })
  }

  /*logic description: fetching the features*/
  getFeatures(moduleId) {
    let obj = {
      projectId: this.projectId,
      moduleId: moduleId
    }
    this.defectForm.patchValue({ featureId: undefined, scriptId: undefined })
    this.defectManagementService.searchModule(obj).
      subscribe(res => {
        this.featureNames = res;
        this.featureNames.sort((a, b) => a.featureName.localeCompare(b.featureName))
      })
  }

  /*logic description: fetching the scripts*/
  getScripts(moduleId, featureId) {
    let obj = {
      projectId: this.projectId,
      moduleId: moduleId,
      featureId: featureId
    }
    this.scriptNames = [];
    this.defectForm.patchValue({ scriptId: undefined })
    this.defectManagementService.searchFeaturesData(obj).
      subscribe(res => {
        console.log(res)
        this.scriptNames = res;
        this.scriptNames.sort((a, b) => a.scriptName.localeCompare(b.scriptName))
      })
  }

  /*logic description:filtering the browser versions from selected browser*/
  version: any = [];
  getVersions(browsername) {
    console.log(browsername);
    this.version = [];
    this.defectForm.patchValue({ browserVersion: undefined })
    this.version = this.browserName.filter((obj, index, arr) => {
      if (obj.browserName == browsername) {
        return obj.version;
      }
    })
    console.log(this.version);
    this.version = this.version[0].version;
    console.log(this.version);
  }

  /*logic description:Loading the video file to modal when click on Watch video */
  playVideo() {
    // this.videoPath = this.videoPath[this.index];
    console.log(this.selectedVideo)
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let username = sessionStorage.getItem('userName') + sessionStorage.getItem('userId');
    let obj = {
      orgId: orgId,
      projectId: this.projectId,
      defectId: this.allDefectData["defectId"],
      userName: username,
      mode: 'video'
    }
    this.spinnerVal = "Loading.."
    this.SpinnerService.show();
    this.defectManagementService.checkUploads(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log(result)
        if (result !== "PASS") {
        }
        else {
          document.getElementById('openVideo').click();
          let url = "./uploads/defectResults/" + username + "/" + this.allDefectData["defectId"] + "/" + this.selectedVideo;
          console.log(url)
          this.watchVideo = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
      })
  }

  //   pauseOrPlay(){
  //     var myVideo: any = document.getElementById("my_video_1");
  //     if (myVideo.paused) myVideo.play();
  //     else myVideo.pause();
  // }

  /*logic description:stop the video playing when close the video modal*/
  pause() {
    var myVideo: any = document.getElementById("my_video_1");
    myVideo.pause();
  }

  /*logic description:remove Uploaded video or Image */
  removeUIuploads() {
    let username = sessionStorage.getItem('userName') + sessionStorage.getItem('userId');
    let obj = {
      userName: username
    }
    this.defectManagementService.removeUIUploads(obj)
      .subscribe(result => {
        console.log(result);
      })
  }

  /*logic description:Loading the image file to modal when click on Watch image*/
  viewImage() {
    console.log(this.selectedScreenshot)
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let username = sessionStorage.getItem('userName') + sessionStorage.getItem('userId');
    let obj = {
      orgId: orgId,
      projectId: this.projectId,
      defectId: this.allDefectData["defectId"],
      userName: username,
      mode: 'image'
    }
    this.spinnerVal = "Loading..."
    this.SpinnerService.show();
    this.defectManagementService.checkUploads(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log(result)
        if (result !== "PASS") {
        }
        else {
          document.getElementById('openImage').click();
          let url = "./uploads/defectResults/" + username + "/" + this.allDefectData["defectId"] + "/" + this.selectedScreenshot;
          console.log(url)
          this.watchScreenshot = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
      })
  }

  /*logic description: get the Names from selected Id's from thier arrays ans return as object*/
  getNames(defectFormValue) {
    var module = this.allModule.filter((obj) => obj.moduleId == defectFormValue.moduleId);
    var feature = this.featureNames.filter((obj) => obj.featureId == defectFormValue.featureId);
    var script = this.scriptNames.filter((obj) => obj.scriptId == defectFormValue.scriptId);
    var priority = this.priority.filter((obj) => obj.priorityId == defectFormValue.priorityId);
    var severity = this.severity.filter((obj) => obj.severityId == defectFormValue.severityId);
    var status = this.status.filter((obj) => obj.statusId == defectFormValue.statusId);
    var device = this.device.filter((obj) => obj.deviceId == defectFormValue.deviceId);
    var os = this.os.filter((obj) => obj.osId == defectFormValue.osId);
    var releaseVer = this.releaseVer.filter((obj) => obj.releaseId == defectFormValue.releaseId);

    console.log(module, feature, script, priority, severity, status)
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    let Names = {
      orgId: orgId,
      projectName: this.selProjectName,
      moduleName: module[0].moduleName,
      featureName: feature[0].featureName,
      scriptName: script[0].scriptName,
      priorityName: priority[0].priorityName,
      severityName: severity[0].severityName,
      status: status[0].status,
      deviceName: device[0].deviceName,
      osName: os[0].osName,
      releaseVersion: releaseVer[0].releaseVersion,
    }
    console.log(Names)
    return Names;
  }

  /*logic description:updating the defect*/
  updateDefectDetails(defectForm, defectId) { // update defect details based on defectForm , projectId , screenShotPath , videoPath, AllNames
    var AllNames = this.getNames(this.defectForm.value)
    this.defectManagementService.updateDefect(this.defectForm.value, this.projectId, defectId, this.videoPath, this.screenShotPath, AllNames).
      subscribe(res => {
        console.log(res)
        this._snackbar.open("Defect updated Sucessfully", "CANCEL", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
        });
        this.newDefect();
      })
  }

  /*logic description:Not using*/
  onSubmitDefectDetails() { // check whether defect form is valid or not
    if (this.defectForm.invalid) {
      return;
    }

    this.dfForm.resetForm(); // if valid than clear all fields/ reset the form 
  }

  /*logic description:reseting the all field and fetch new defectId after update or new Defect*/
  newDefect() { // display condition
    this.form = true;
    this.confirmation = false;
    // this.defectId.defectId = "";
    this.videoPath = null;
    this.screenShotPath = null;
    this.myVdoVariable.nativeElement.value = '';
    this.myScreenVariable.nativeElement.value = '';
    this.dfForm.resetForm(); // when user clicks on new defect button the form fields should clear
    this.activeVideoUpload = 0;
    this.activeScreenUpload = 0;
    this.onLoadData();
    // this.tableData=[];
    this.searchForm.reset();
  }

  // onSelectFile(fileInput: any) { // select screenshotPath
  //   // alert("hi2")
  //   this.activeScreenUpload = 1;
  //   this.imageToUpload = <Array<File>>fileInput.target.files;
  //   console.log(this.imageToUpload)
  // }

  // uploadScreenShot() { // upload screenshot 
  //   this.screenvideor = true;
  //   let imageFormat = this.imageToUpload[0].name.split('.')
  //   if (imageFormat[1] == "jpg" || imageFormat[1] == "png") {
  //     this.defectManagementService.uploadImage(this.imageToUpload,this.screenvideor).subscribe((res) => {
  //       console.log(res)
  //       this.screenShotPath = res[0].path;
  //       if (res != 0) {
  //         console.log("saved the video locally");
  //         alert("video uploaded successfully");
  //       }
  //     })
  //   } else {
  //     alert("Please select video of format .mp4 or .ogg");
  //   }
  // }

  // videoFileSave(video: any) { // select video 
  //   // alert("hi1")
  //   this.activeVideoUpload = 1;
  //   this.videoToUpload = <Array<File>>video.target.files;
  //   console.log(this.videoToUpload);
  // }

  /*logic description:uploading the screenshot */
  uploadScreenShot() {
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    var uploadDetails = `${orgId},${this.projectId},${this.selProjectName},${this.allDefectData["defectId"]}`
    console.log(this.imageToUpload);
    this.defectManagementService.uploadImage(this.imageToUpload, uploadDetails).subscribe((res) => {
      console.log(res)
      this.screenShotPath = res[0].path;
      this.selectedScreenshot = res[0].filename;
      if (res != 0) {
        this._snackbar.open("Image uploaded successfully", "CANCEL", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
        });
        this.activeScreenUpload = 0;
      }
    })
  }


  imageTypes = [
    "image/apng",
    "image/jpeg",
    "image/png"
  ];
  /*logic description:validating selected image file type*/
  validImageType(file) {
    return this.imageTypes.includes(file.type);
  }
  /*logic description:checking the image file not greaterthan 2MB*/
  returnImgFileSize(number) {
    if (number < 1024) {
      return `${number} bytes`;
    } else if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
      if (Number((number / 1048576).toFixed(1)) > 2) {
        return false;
      }
      return `${(number / 1048576).toFixed(1)} MB`;
    }
  }
  /*logic description:checking the image file type and size on selecting screenshot */
  onSelectFile(image: any) { // for selecting screenshot 
    this.activeScreenUpload = 1;
    console.log(this.screenShotPath);
    this.imageToUpload = <Array<File>>image.target.files;
    console.log(this.imageToUpload)
    if (image.target.files && image.target.files.length > 0) {
      if (this.validImageType(this.imageToUpload[0])) {
        console.log(this.returnImgFileSize(this.imageToUpload[0].size));
        if (!this.returnImgFileSize(this.imageToUpload[0].size)) {
          this.uploadImageForm.get('importImage').setValue(null);
          this.myScreenVariable.nativeElement.value = '';
          alert("upload image size limit upto 2 MB!");
        } else {
          console.log("Everything is OK!!");
          const file = (image.target.files[0] as File);
          this.uploadImageForm.get('importImage').setValue(file);
          console.log(this.uploadImageForm.get('importImage').value);

        }
      } else {
        this.uploadImageForm.get('importImage').setValue(null);
        this.myScreenVariable.nativeElement.value = '';
        alert("Please select Image formats of .jpg, jpeg, .png !");
      }
    } else {
      this.screenShotPath = null;
      this.myScreenVariable.nativeElement.value = '';
      this.uploadImageForm.get('importImage').setValue(null);
    }
  }

  /*logic description:checking the video file type and size on selecting video */
  videoFileSave(video: any) { // select video
    // console.log(video)
    console.log(this.videoPath);
    this.activeVideoUpload = 1;
    this.videoToUpload = <Array<File>>video.target.files;
    console.log(this.videoToUpload)
    if (video.target.files && video.target.files.length > 0) {
      if (this.validVideoType(this.videoToUpload[0])) {
        console.log(this.returnVidFileSize(this.videoToUpload[0].size));
        if (!this.returnVidFileSize(this.videoToUpload[0].size)) {
          this.uploadVideoForm.get('importVideo').setValue(null);
          this.myVdoVariable.nativeElement.value = '';
          alert("upload video size limit upto 100 MB!");
        } else {
          console.log("Everything is OK!!");

          const file = (video.target.files[0] as File);
          this.uploadVideoForm.get('importVideo').setValue(file);
          console.log(this.uploadVideoForm.get('importVideo').value);

        }
      } else {
        this.uploadVideoForm.get('importVideo').setValue(null);
        this.myVdoVariable.nativeElement.value = '';
        alert("Please select video formats of .mp4 or .3gp !");
      }
    } else {
      this.videoPath = null;
      this.myVdoVariable.nativeElement.value = '';
      this.uploadVideoForm.get('importVideo').setValue(null);
    }
  }

  videoTypes = [
    "video/x-flv",
    "video/mp4",
    "video/3gpp",
    "video/quicktime",
    "video/x-msvideo"
  ];
  /*logic description:validating selected video file type*/
  validVideoType(file) {
    return this.videoTypes.includes(file.type);
  }
  /*logic description:checking the video file not greaterthan 100MB*/
  returnVidFileSize(number) {
    if (number < 1024) {
      return `${number} bytes`;
    } else if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
      if (Number((number / 1048576).toFixed(1)) > 100) {
        return false;
      }
      return `${(number / 1048576).toFixed(1)} MB`;
    }
  }

  /*logic description: uploading the video */
  uploadvideo() {
    console.log(this.videoToUpload[0].name)
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    var uploadDetails = `${orgId},${this.projectId},${this.selProjectName},${this.allDefectData["defectId"]}`
    console.log(this.videoToUpload);
    this.spinnerVal = "Uploading..."
    this.SpinnerService.show();
    this.defectManagementService.uploadVideo(this.videoToUpload, uploadDetails).subscribe((res) => {
      this.SpinnerService.hide();
      console.log(res);
      this.videoPath = res[0].path;
      this.selectedVideo = res[0].filename;
      console.log(this.videoPath)
      if (res != 0) {
        this._snackbar.open("video uploaded successfully", "CANCEL", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
        });
        this.activeVideoUpload = 0;
      }
    })
  }


  // uploadvideo() { // upload video function
  //   this.screenvideor = true;
  //   console.log(this.videoToUpload[0].name)
  //   var videoFormat = this.videoToUpload[0].name.split('.');
  //   if (videoFormat[1] === 'mp4' || videoFormat[2] === 'mp4' || videoFormat[1] === 'ogg') {
  //     this.defectManagementService.uploadVideo(this.videoToUpload,this.screenvideor).subscribe((res) => {
  //       console.log(res);
  //       this.videoPath = res[0].path;
  //       console.log(this.videoPath)
  //       if (res != 0) {
  //         console.log("saved the video locally");
  //         alert("video uploaded successfully");
  //       }
  //     })
  //   } else {
  //     alert("Please select video of format .mp4 or .ogg");
  //     // this.manualVideo = '';

  //   }
  // }

  permissions = [];
  edit: boolean
  read: boolean
  delete: boolean
  create: boolean;
  disableButton: boolean;
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
      });
  }
  /*logic description: set to null when click on delete video */
  deleteVideo() {
    this.selectedVideo = '';
    this.videoPath = null;
  }
  /*logic description: set to null when click on delete image */
  deleteImage() {
    this.selectedScreenshot = '';
    this.screenShotPath = null;
  }

  FormValidate(defectForm) {
    console.log(defectForm)
  }
}
