import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private httpCall: HttpcallService) {


  }
  getAllOrgnizationForSearch() {

    const request = {
      'params': "",
      'method': 'get',
      'path': '/organization/getAllOrganization'
    }
    return this.httpCall.httpCaller(request);
  }

  orgAdminDetails(obj) {
    alert("s")
    const request = {
      'params': obj,
      'method': 'post',
      'path': '/organization/orgAdminDetails'
    }
    return this.httpCall.httpCaller(request);
  }
  getOneOrgnization(data) {
    let obj = {
      "orgName": data
    }
    const request = {
      'params': obj,
      'method': 'get',
      'path': '/organization/getOneOrgnization'
    }
    return this.httpCall.httpCaller(request);
  }
  getOneAdmin(data) {
    let obj = {
      "orgName": data
    }
    const request = {
      'params': obj,
      'method': 'get',
      'path': '/organization/getOneAdmin'
    }
    return this.httpCall.httpCaller(request);
  }

  getSelectedOrgnization(data) {
    let obj = {
      "orgName": data
    }
    const request = {
      'params': obj,
      'method': 'get',
      'path': '/organization/getSelectedOrgnization'
    }
    return this.httpCall.httpCaller(request);
  }
}
