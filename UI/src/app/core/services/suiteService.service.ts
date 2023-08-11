import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
// import { Http, Response } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import { Post } from '../../post';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class SuiteService {

  constructor( private api: apiServiceComponent,
     private httpCall: HttpcallService) { }

  getBrowsers(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/getBrowsersDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getVersions(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/getVersionDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getSuite(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/getSuiteDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  defaultConfig(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/getDefaultConfigDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getFramework(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/getFrameworkDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getActiveRelease(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/getReleaseDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  popUpEdit(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/popUpEditDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  suiteConfigCreate(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/suiteConfigDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  suitesFetchException(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/fetchExceptionsuitesDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  suiteEdit(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/editSuiteDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  createApiSuiteNew(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/suiteCreate/createApiSuite'
    }
    return this.httpCall.httpCaller(request);
  }

  createWebSuiteNew(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/suiteCreate/createWebSuite'
    }
    return this.httpCall.httpCaller(request);
  }

  suiteDelete(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/suiteCreate/DeleteSuite'
    }
    return this.httpCall.httpCaller(request);
  }

  copyFromSuite(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/suiteCreate/copyFromSuiteDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  suiteUpdate(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'put',
      'path': '/suiteCreate/updateSuite'
    }
    return this.httpCall.httpCaller(request);
  }

  updateSuiteName(obj){
    console.log(obj);
 let request = {
      'params': obj,
      'method': 'put',
      'path': '/suiteCreate/suiteUpdate'
    }
    return this.httpCall.httpCaller(request);
  }

  checkIfSuiteLocked(obj){
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/suiteCreate/checkIfSuiteLocked'
    });
  }
}