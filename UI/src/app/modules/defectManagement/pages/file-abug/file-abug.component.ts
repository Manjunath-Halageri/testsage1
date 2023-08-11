import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { roleService } from '../../../../core/services/roleService';
import { DefectManagementModuleService } from '../../../../core/services/defectManagement-Module.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-file-abug',
  templateUrl: './file-abug.component.html',
  styleUrls: ['./file-abug.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class FileABugComponent implements OnInit {
  @ViewChild('dfForm', { static: false }) dfForm;
  @ViewChild('screen', { static: false }) myScreenVariable: ElementRef;
  @ViewChild('vdo', { static: false }) myVdoVariable: ElementRef;
  pageRoles: Object = {}
  confirmation: boolean;
  form: boolean;
  browserName: any;
  status: any;
  priority: any;
  device: any;
  os: any;
  severity: any;
  releaseVer: any;
  assign: any;
  contactTo: any;
  showForm: boolean = false;
  selProjectName: string;
  allModule: any;
  featureNames: any;
  scriptNames: any;
  defectForm: FormGroup;
  projectId: any;
  defectId: any = {};
  activeScreenUpload: number = 0;
  activeVideoUpload: number = 0;
  imageToUpload: File[];
  videoToUpload: File[];
  screenvideor: boolean;
  manualscreenShot: string;
  videoPath: any;
  screenShotPath: any;
  input: any;
  pageName: any;
  newRole: any;
  newUserId: any;
  newUserName: any;
  selectedProject: any;
  fc: any;

  uploadVideoForm: any;
  uploadImageForm: any;
  constructor(private roles: roleService,
    private defectManagementService: DefectManagementModuleService,
    private _snackbar: MatSnackBar, private fb: FormBuilder,
    private SpinnerService: NgxSpinnerService
  ) {
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
    this.pageName = "fileDefectPage"
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

    this.defectForm = new FormGroup({ //defect form validation
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

    this.getRolesPermissions();

    this.fc = new FormGroup({
      moduleId: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      featureId: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      scriptId: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      date: new FormControl('', [Validators.required]),
      priorityId: new FormControl('', [Validators.required]),
      severityId: new FormControl('', [Validators.required]),
      statusId: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
      releaseId: new FormControl('', [Validators.required]),
      summary: new FormControl('', [Validators.required, Validators.maxLength(300)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(300)]),
      deviceId: new FormControl('', [Validators.required]),
      browserName: new FormControl('', [Validators.required]),
      assignedTo: new FormControl('', [Validators.required]),
      osId: new FormControl('', [Validators.required]),
      browserVersion: new FormControl('', [Validators.required]),
      qaContact: new FormControl('', [Validators.required]),
    })

    this.form = true;
    this.confirmation = false;

    this.selProjectName = sessionStorage.getItem('key'); // getting projectName here
    /*logic description: fetching the modules*/
    this.defectManagementService.getAllModuledata(this.selProjectName).subscribe(result => {
      this.projectId = result[0].projectId
      result.sort((a, b) => a.moduleName.localeCompare(b.moduleName)) //Sorting mdules based on moduleName
      this.allModule = result;
    })

    /*logic description: fetching the browsers along with versions*/
    this.defectManagementService.getbrowserFields().subscribe(result => {
      console.log(result)
      this.browserName = result;
    })

    /*logic description:fetching the defect config details*/
    this.defectManagementService.getDefectConfigDetails().subscribe(data => {
      if (data && data[0]) {
        this.status = data[0].status;
        this.priority = data[0].defectPriority;
        this.device = data[0].device;
        this.os = data[0].os;
        this.severity = data[0].severity;
        this.assign = data[0].assignedTo;
        this.contactTo = data[0].qaContact;
      }
    })

    /*logic description:fetching the active releases*/
    this.defectManagementService.getReleaseDetails(this.selProjectName).subscribe(result => {
      this.releaseVer = result;
    })

    this.showForm = true;

    this.getDefectID();
    this.version = [];
    this.SpinnerService.hide();
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

  /*logic description:fetching the latest defectId*/
  getDefectID() {
    this.defectManagementService.getDefectID().subscribe((res) => {
      console.log(res);
      this.defectId.defectId = res;
    })
  }

  /*logic description:updating the defect*/
  updateDefectDetails() {
    var AllNames = this.getNames(this.defectForm.value)
    this.defectManagementService.updateDefect(this.defectForm.value, this.projectId, this.defectId.defectId, this.videoPath, this.screenShotPath, AllNames).
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

  ///////////////// for creating new defect //////////////////////////////

  /*logic description:reseting the all field and fetch new defectId after update or new Defect*/
  newDefect() {
    this.form = true;
    this.confirmation = false;
    this.defectId = {};
    this.videoPath = null;
    this.screenShotPath = null;
    this.myVdoVariable.nativeElement.value = '';
    this.myScreenVariable.nativeElement.value = '';
    this.dfForm.resetForm();
    this.activeVideoUpload = 0;
    this.activeScreenUpload = 0;
    this.featureNames = [];
    this.scriptNames = [];
    this.getDefectID();
  }

  ///////////////// for creating new defect ends here //////////////////////////////


  ///////////////// geting module , feature , script //////////////////////////////

  /*logic description:fetching the features based on selected module*/
  moduleIndex(moduleId) {
    let obj = {
      projectId: this.projectId,
      moduleId: moduleId
    }
    this.featureNames = [];
    this.scriptNames = [];
    this.defectForm.patchValue({ featureId: undefined, scriptId: undefined })
    this.defectManagementService.searchModule(obj).
      subscribe(res => {
        this.featureNames = res;
        this.featureNames.sort((a, b) => a.featureName.localeCompare(b.featureName))
      })
  }

  /*logic description:fetching the scripts based on module and feature selected*/
  featureIndex(moduleId, featureId) {
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

  ///////////////// geting module , feature , script ends here //////////////////////////////

  // Not Using
  onSubmitDefectDetails() { // checks whether form is valid or not
    if (this.defectForm.invalid) { // if not returns
      return;
    }

    this.dfForm.resetForm(); // if valid than clear the all input/reset the form 
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
  onSelectFile(image: any) { // 
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

  /*logic description:uploading the screenshot */
  uploadScreenShot() {
    // this.screenvideor = true;
    // let imageFormat = this.imageToUpload[0].name.split('.')
    // if (imageFormat[1] == "jpg" || imageFormat[1] == "png") {
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    var uploadDetails = `${orgId},${this.projectId},${this.selProjectName},${this.defectId.defectId}`
    console.log(this.imageToUpload);
    this.defectManagementService.uploadImage(this.imageToUpload, uploadDetails).subscribe((res) => {
      console.log(res)
      this.screenShotPath = res[0].path;
      if (res != 0) {
        this._snackbar.open("Image uploaded successfully", "CANCEL", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
        });
        this.activeScreenUpload = 0;
      }
    })
    // } else {
    //   alert("Please select video of format .mp4 or .ogg");
    // }
  }

  /*logic description: uploading the video */
  uploadvideo() {
    // this.screenvideor = true;
    console.log(this.videoToUpload[0].name)
    // var videoFormat = this.videoToUpload[0].name.split('.');
    // if (videoFormat[1] === 'mp4' || videoFormat[2] === 'mp4' || videoFormat[1] === 'ogg') {
    let orgId = JSON.parse(sessionStorage.getItem('loginDetails')).orgId
    var uploadDetails = `${orgId},${this.projectId},${this.selProjectName},${this.defectId.defectId}`
    //  this.videoToUpload[0]["Details"]=uploadDetails;
    console.log(this.videoToUpload);
    this.SpinnerService.show();
    this.defectManagementService.uploadVideo(this.videoToUpload, uploadDetails).subscribe((res) => {
      this.SpinnerService.hide();
      console.log(res);
      this.videoPath = res[0].path;
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
    // } else {
    //   alert("Please select video of format .mp4 or .ogg");
    // }
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

  /*logic description:for submit the form along with defectId projectid , videoPath , screenshotPath, AllNames Object to defectManagementService*/
  submit(defectForm) {
    this.confirmation = true;
    this.form = false;
    this.projectId = this.allModule[0].projectId;
    var AllNames = this.getNames(defectForm.value)
    this.defectManagementService.submitDefectDetails(defectForm.value, this.defectId.defectId, this.projectId, this.videoPath, this.screenShotPath, AllNames).
      subscribe(res => {
        this._snackbar.open("Defect saved Sucessfully", "CANCEL", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
        });
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

  // Not Using
  FormValidate(defectForm) {
    console.log(defectForm)
  }

}



