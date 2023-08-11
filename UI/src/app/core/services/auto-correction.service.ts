import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class AutoCorrectionService {

  constructor(private httpCall: HttpcallService) { }

  fetchExceptionSuites(data) {
    let obj = {
      spid: data
    }
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/autoCorrection/fetchExceptionSuites'

    }
    return this.httpCall.httpCaller(request);
  }
  fetchFixedScripts(data) {
    let obj = {
      run: data
    }
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/autoCorrection/fetchFixedScripts'

    }
    return this.httpCall.httpCaller(request);
  }

  mergeScripts(data) {
    let obj = {
      completeData: data
    }
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/autoCorrection/mergeScripts'

    }
    return this.httpCall.httpCaller(request);
  }
}
