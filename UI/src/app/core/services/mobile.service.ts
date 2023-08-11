import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiServiceComponent } from './apiService';
import { HttpcallService } from './httpcall.service'

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  constructor(private http: HttpClient, private api: apiServiceComponent, private httpCall: HttpcallService) { }

  mobileAppDetails() {
    return this.http.get(this.api.apiData + '/mobileAppsDetails')
  }

  makeFileRequest(files: Array<File>) {
    var formData: any = new FormData();
    for (var i = 0; i < files.length; i++) {
      console.log(files[i].name)
      formData.append("uploads[]", files[i], files[i].name);
    }
    return this.httpCall.httpCaller({
      'params': formData,
      'method': 'post',
      'path': '/mobileLabs/uploadapk'
    });
  }

  unBlockApi(unblockDetail) {
    return this.httpCall.httpCaller({
      'params': unblockDetail,
      'method': 'get',
      'path': '/mobileLabs/unBlockApi'
    });
  }

  multipleDevUnblock(multiupleDetail) {
    return this.httpCall.httpCaller({
      'params': multiupleDetail,
      'method': 'get',
      'path': '/mobileLabs/multipleDevUnblock'
    });
  }

  checkBlockedDevice(blockeDtails) {
    return this.httpCall.httpCaller({
      'params': blockeDtails,
      'method': 'get',
      'path': '/mobileLabs/checkBlockedDevice'
    });
  }

  blockDevice(blockDeviceData) {
    return this.httpCall.httpCaller({
      'params': blockDeviceData,
      'method': 'post',
      'path': '/mobileLabs/blockDevice'
    });
  }

  captureLabServiceDetails() {
    return this.httpCall.httpCaller({
      'params': '',
      'method': 'post',
      'path': '/mobileLabs/postDevicesName'
    });
  }

  installApk(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/mobileLabs/installApk'
    });
  }
}
