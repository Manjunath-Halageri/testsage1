import 'rxjs/add/operator/map';
import { Component, OnInit } from '@angular/core';
import { ProjectDetailServiceComponent } from '../../../../core/services/pDetail.service';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { DialogService } from '../../../../core/services/dialog.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-docker-machine-name',
  templateUrl: './docker-machine-name.component.html',
  styleUrls: ['./docker-machine-name.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class DockerMachineNameComponent implements OnInit {

  machine: any;
  dbmachine: any;
  dockerObject: Object = {};
  machineDetail: any;
  machineImages: any;
  machineContainer: any;
  currentMachine: string;
  waitingObject: Object = {}
  userForm: any;
  machineStatus2: any;


  constructor(private formBuilder: FormBuilder, private dialogService: DialogService, private http: HttpClient, private data: ProjectDetailServiceComponent,
    private api: apiServiceComponent) {

  }

  ngOnInit() {
    var name = window.sessionStorage.getItem('machineName');
    this.currentMachine = window.sessionStorage.getItem('machineName');
    this.show(name);
    this.userForm = this.formBuilder.group({
      'imagename': ['', [Validators.required]],

    });
  }

  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Create',
    spinnerSize: 25,
    raised: true,
    stroked: false,
    spinnerColor: 'primary',
    fullWidth: false,
    disabled: true,
    mode: 'indeterminate',
  }

  checkFormValues() {
    console.log(this.userForm)
    if (this.userForm.status === "VALID") {
      console.log(this.userForm.value.name)
      return this.spinnerButtonOptions.disabled = false
    }
    else {
      return this.spinnerButtonOptions.disabled = true;
    }
  }


  show(name) {
    this.machineDetails(name);
  }

  machineDetails(name) {
    this.dockerObject = {
      "machineName": name
    }

    this.machineDetail = this.dockerObject;
    this.http.post(this.api.apiData + '/showingOnlyMachineDetails', this.machineDetail)
      .map((response: Response) => response.json())
      .subscribe(result => {
        this.dbmachine = result;
        console.log(this.dbmachine);
        this.machineImages = this.dbmachine[0].image;
        this.machineContainer = this.dbmachine[0].container;
      });
  }

  cancelUploadImage(name) {
    var tempName;
    alert(name + ',' + this.dbmachine[0].machine)
    if (name == "Chrome_Version_75.0") {
      name = "selenium/node-chrome-debug:3.141";
      tempName = "selenium/node-chrome-debug"
    }
    if (name == "Chrome_Version_56.0") {
      name = "selenium/node-chrome-debug:3.0.1";
      tempName = "selenium/node-chrome-debug"

    }
    if (name == "Firefox_version_51.0.1") {
      name = "selenium/node-firefox-debug:3.0.1";
      tempName = "selenium/node-firefox-debug";

    }
    if (name == "Firefox_version_58.0.2") {
      name = "selenium/node-firefox-debug:3.10.0";
      tempName = "selenium/node-firefox-debug";

    }

    this.dockerObject = {
      "machineName": this.dbmachine[0].machine,
      "imageName": name,
      "tempName": tempName
    }

    this.http.post(this.api.apiData + '/cancelUploadImage', this.dockerObject)
      .map((response: Response) => response.json())
      .subscribe(result => {
      });

  }



  pullImages(name) {
    var tempName;
    alert(name + ',' + this.dbmachine[0].machine)
    if (name == "selenium/hub") {
      tempName = "selenium/hub"
    }
    if (name == "Chrome_Version_75.0") {
      name = "selenium/node-chrome-debug:3.141";
      tempName = "selenium/node-chrome-debug"
    }
    if (name == "Chrome_Version_56.0") {
      name = "selenium/node-chrome-debug:3.0.1";
      tempName = "selenium/node-chrome-debug"

    }
    if (name == "Firefox_version_51.0.1") {
      name = "selenium/node-firefox-debug:3.0.1";
      tempName = "selenium/node-firefox-debug";

    }
    if (name == "Firefox_version_58.0.2") {
      name = "selenium/node-firefox-debug:3.10.0";
      tempName = "selenium/node-firefox-debug";

    }

    this.dockerObject = {
      "machineName": this.dbmachine[0].machine,
      "imageName": name,
      "tempName": tempName
    }



    this.http.post(this.api.apiData + '/pullImageForMachine', this.dockerObject)
      .map((response: Response) => response.json())
      .subscribe();
    this.imageWaiting(this.dbmachine[0].machine, name);
  }
  imageWaiting(machineName1: any, imageName1: any) {

    this.waitingObject = {
      "machineName": machineName1,
      "imageName": imageName1
    }
    this.spinnerButtonOptions.active = true;

    var stopInterval = setInterval(() => {
      this.http.post(this.api.apiData + '/waitingImage', this.waitingObject)
        .map((response: Response) => response.json())
        .subscribe(res => {
          this.machineStatus2 = res;
          if (this.machineStatus2.status == "unexpectedError") {
            alert(this.machineStatus2.status + "please cancel it")
          }
          if (this.machineStatus2.status == "pulling") { }
          else if (this.machineStatus2.status == "pulled") {
            this.spinnerButtonOptions.active = false;
            clearInterval(stopInterval);
          }
          else {
            console.log("created.......we are in loop check..pulling image");
          }
        });
    }, 10000)
  }

  deleteImage(data) {
    this.dialogService.dockerDialog('Are you sure to delete  ?')
      .afterClosed().subscribe(res => {
        console.log(res)
      })
    this.dockerObject = {
      "machineName": this.currentMachine,
      "imageName": data.name,

    }
    this.http.post(this.api.apiData + '/deleteImage', this.dockerObject)
      .map((response: Response) => response.json())
      .subscribe(result => {
        this.dbmachine = result;

      });
  }
  runImage2(data) {

    alert("run okkkkk now " + this.currentMachine + "  " + data.name)

    this.dockerObject = {
      "machineName": this.dbmachine[0].machine,
      "imageName": data.name,

    }

    this.http.post(this.api.apiData + '/runImageForMachineJustForNow', this.dockerObject)
      .map((response: Response) => response.json())
      .subscribe(result => {
        this.dbmachine = result;
      });
  }


  containerStart(i, name) {
    alert(this.dbmachine[0].machine + "," + name)
    this.dockerObject = {
      "machineName": this.dbmachine[0].machine,
      "containerName": name
    }
    this.http.post(this.api.apiData + '/startContainer', this.dockerObject)
      .map((response: Response) => response.json())
      .subscribe(result => {
        this.dbmachine = result;
        alert("container started")
      });

  }


  containerStop(i, name) {
    if (name != "hubContainer") {
      this.dockerObject = {
        "machineName": this.dbmachine[0].machine,
        "containerName": name
      }
      this.http.post(this.api.apiData + '/stopContainer', this.dockerObject)
        .map((response: Response) => response.json())
        .subscribe(result => {
          this.dbmachine = result;
        });
    }
    else {
      alert("can't stop, other conatiner might dependent on it")
    }
  }

  containerDelete(i, name) {
    if (name != "hubContainer") {
      this.dialogService.dockerDialog('Are you sure to delete  ?')
        .afterClosed().subscribe(res => {
          console.log(res)
        })
      alert(this.dbmachine[0].machine + "," + name)

      this.dockerObject = {
        "machineName": this.dbmachine[0].machine,
        "containerName": name
      }
      this.http.post(this.api.apiData + '/deleteContainer', this.dockerObject)
        .map((response: Response) => response.json())
        .subscribe(result => {
          this.dbmachine = result;
        });

    }
    else {
      alert("can't stop, other conatiner might dependent on it")
    }
  }

  runImages(data) {
    alert(data.name)
    this.dockerObject = {
      "machineName": data.name,
    }

    this.http.post(this.api.apiData + '/runImageForMachine', this.dockerObject)
      .map((response: Response) => response.json())
      .subscribe(result => {
        this.dbmachine = result;
      });
  }
}

