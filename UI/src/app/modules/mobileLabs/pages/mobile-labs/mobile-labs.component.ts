import { Component, OnInit } from '@angular/core';
import { apiServiceComponent } from '../../../../core/services/apiService';
import { Post } from '../../../../post';
import { MobileService } from '../../../../core/services/mobile.service';

@Component({
  selector: 'app-mobile-labs',
  templateUrl: './mobile-labs.component.html',
  styleUrls: ['./mobile-labs.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css'],
  providers: [apiServiceComponent, MobileService]
})
export class MobileLabsComponent implements OnInit {

  devicesName: String;
  devicesId: String;
  dvc: boolean;
  result: Post[];
  deviceslength: string;
  DeviceId: String;
  fulldeviceslist: String[];
  detailObj = [];
  rowSelected: boolean;
  checkBox = [];
  selectedrow: string;
  idSelectedVote: string;
  indexx: number;
  yashwanth: string;
  deviceDetails: Object = {};
  devicesFun: Function;
  apkPath: Object = {};
  filesToUpload: Array<File>;
  devicesDetails: any;
  completepath: any;
  todaydate: any;
  currentTime: any;
  toTime: string;
  gotBlockedDevice: any;
  blockToTime: boolean;
  blockTdData: boolean;
  time: any;
  data: any;
  deviceAvailable: boolean;
  alwaysBlock: boolean;
  event: any;
  timeList: { StartingTime: string }[];
  filtered: any;
  loginDetails: any;
  selectBookedDevices: any;
  bookedSlot: boolean;
  blockInstall: boolean;
  constructor(private mobileApps: MobileService) {
    this.dvc = false;
    this.filesToUpload = [];
  }

  ngOnInit() {
    let UserName = sessionStorage.getItem('importedDetails');
    let parsedUserName = JSON.parse(UserName);
    this.loginDetails = parsedUserName;
    this.todaydate = new Date().toISOString().substr(0, 10)
    this.bookedSlot = false;
    var HH = new Date().getHours();
    var MM = "00";
    this.currentTime = HH + ":" + MM;
    this.toTime = HH + ":" + MM;
    this.unBlockFun(this.loginDetails, this.currentTime, this.todaydate)
    this.blockTdData = true;
    this.blockInstall = true;
    this.timeList = [
      { StartingTime: "01:00" }, { StartingTime: "02:00" }, { StartingTime: "03:00" },
      { StartingTime: "04:00" }, { StartingTime: "05:00" }, { StartingTime: "06:00" },
      { StartingTime: "07:00" }, { StartingTime: "08:00" }, { StartingTime: "09:00" },
      { StartingTime: "10:00" }, { StartingTime: "11:00" }, { StartingTime: "12:00" },
      { StartingTime: "13:00" }, { StartingTime: "14:00" }, { StartingTime: "15:00" },
      { StartingTime: "16:00" }, { StartingTime: "17:00" }, { StartingTime: "18:00" },
      { StartingTime: "19:00" }, { StartingTime: "20:00" }, { StartingTime: "21:00" },
      { StartingTime: "22:00" }, { StartingTime: "23:00" }, { StartingTime: "24:00" }
    ]
  }
  uploadedApkName: any;
  /*Logic Description: Function used to upload the Apk */
  upload() {
    this.mobileApps.makeFileRequest(this.filesToUpload)
      .subscribe((result) => {
        console.log(result);
        if (result != 0) {
          console.log(result[0].path);
          this.completepath = result[0].path;
          console.log(this.completepath + "this.completepath");
          this.uploadedApkName = result[0].filename;
          console.log(result[0].filename)
          alert(result[0].filename + " Installed in" + this.completepath);

        }
      }, (error) => {
        console.error(error);
      });
  }

  /*Logic Description: select the apk */

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  /*Logic Description: takes all the connected devices and updates the information to devices collection*/

  connect() {
    this.mobileApps.captureLabServiceDetails()
      .subscribe((result) => {
        this.dvc = true;
        this.mobileDetails = result;
        console.log(result)
      })
  }


  mobileDetails: any;
  /*Logic Description:for displaying the connected devices to User*/
  getMobileDevice() {
    this.dvc = true;
    this.mobileApps.mobileAppDetails()
      .subscribe((res) => {
        this.mobileDetails = res;
        console.log(this.mobileDetails)
      })
  }
  setClickedRow = function (i) {
    this.selectedRownew = i;
  }
  bookClickedRow(devices) {
    this.selectBookedDevices = devices;

  }


  /*Logic Description:Function which is used to block the connected devcie on hour basis 
  it takes devicesId,current date and current time
  */

  blockDevices(DevicesId, todaydate, StartingTime, endTime) {
    if (endTime > StartingTime) {
      var userId = this.loginDetails[0].userId
      var userName = this.loginDetails[0].userName
      var blockDeviceData = {
        'DeviceId': DevicesId,
        'todayDate': todaydate,
        'FromTime': StartingTime,
        'ToTime': endTime,
        'UserId': userId,
        'UserName': userName
      }
      this.mobileApps.blockDevice(blockDeviceData)
        .subscribe(result => {
          this.gotBlockedDevice = result
          alert("Devices is Blocked");
          this.deviceAvailable = false;
          this.blockTdData = false;
        });
    }
    else {
      alert("End Time Should be Greater than the Starting Time")
    }
  }


  /*Logic Description: Shows the time slot of checked devices*/

  somethingChanged = function (currentTime, toTime, DevicesId, todaydate) {
    console.log(currentTime)
    console.log(toTime)
    // location.reload();
    if (currentTime <= toTime) {
      this.blockToTime = false;
      var blockeDtails = {
        'DeviceId': DevicesId,
        'todayDate': todaydate
      }
      this.mobileApps.checkBlockedDevice(blockeDtails)
        .subscribe(result => {
          this.final = DevicesId;
          console.log(result);
          console.log(this.timeList);
          this.filtered = this.timeList.filter(function (a) {
            var HH = new Date().getHours();
            var MM = "00";
            var presentTime = HH + ":" + MM;
            return a.StartingTime > presentTime;
          });
          for (let l = 0; l < this.filtered.length; l++) {
            for (let m = 0; m < result.length; m++) {
              if (this.filtered[l].StartingTime == result[m].FromTime) {
                this.filtered.splice(l, 1);
              }
            }
          }
          console.log(this.filtered)
        })
    }
    else {
      this.blockToTime = true;
      this.blockTdData = false;
    }
  }




  /*Logic Description: Displays the blocked devices list when user logins in his time slots*/
  unBlockFun = function (loginDetails, currentTime, todaydate) {
    var unblockDetail = {
      'UserId': loginDetails[0].userId,
      'Time': currentTime,
      'Date': todaydate
    }
    this.mobileApps.unBlockApi(unblockDetail)
      .subscribe(result => {
        console.log(result)
        for (let t = 0; t < result.length; t++) {
          var multiupleDetail = {
            'DeviceId': result[t].DeviceId,
            'currentTime': currentTime,
            'UserId': loginDetails[0].userId
          }
          console.log(multiupleDetail)
          this.mobileApps.multipleDevUnblock(multiupleDetail)
            .subscribe(result9 => {
              this.bookedslot009 = result9;
              console.log(this.bookedslot009)
              if (result9.length != 0) {
                this.bookedSlot = true;
              }
              else {
                this.bookedSlot = false;
              }
            })
        }
      })
  }

  checkFun(devicesId, value) {
    this.rowSelected = true;
    var numbers = {};
    numbers["devicesid"] = devicesId;
    this.detailObj.push(numbers);
    this.fulldeviceslist = this.detailObj;
    this.blockInstall = false;
  }

  /*Logic Description: used to install the APK to the selected devices*/

  installApk() {
    var deviceslength = this.fulldeviceslist.length;
    this.devicesFun = function(y) {
      if (y < deviceslength) {
        var obj77 = {};
        obj77["deviceId"] = this.fulldeviceslist[y].devicesid;
        obj77["apkPath"] = this.completepath;
        obj77["uplodedApkName"] = this.uploadedApkName;
        this.mobileApps.installApk(obj77)
          .subscribe(result => {
            console.log(result)
            alert("Apk Successfully Installed")
          });
        this.devicesFun(y + 1)
      }//ifclosingsfun
    }//closingsfun
    this.devicesFun(0);
  }

}
