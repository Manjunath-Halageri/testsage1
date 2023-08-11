import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class BrowserSelectionService {

  constructor(private httpCall: HttpcallService) { }

  getTableDetails(obj){
    console.log(obj);
    let request = {
      'params' : obj,
      'method' : 'get',
      'path'   : '/browserselection/getTableData'

    }
    return this.httpCall.httpCaller(request);

  }

  getPerformanceTableDetails(obj){
    console.log(obj);
    let request = {
      'params' : obj,
      'method' : 'get',
      'path'   : '/browserselection/getPerformanceTableData'

    }
    return this.httpCall.httpCaller(request);

  }

  checkBrowsersStatus(obj){
    console.log(obj);
    let request = {
      'params' : obj,
      'method' : 'post',
      'path'   : '/browserselection/checkStatusBrowsers'

    }
    return this.httpCall.httpCaller(request);

  }

  browsersBlock(obj){
    console.log(obj);
    let request = {
      'params' : obj,
      'method' : 'post',
      'path'   : '/browserselection/insertBlockDetails'

    }
    return this.httpCall.httpCaller(request);

  }

  containersBlock(obj){
    console.log(obj);
    let request = {
      'params' : obj,
      'method' : 'post',
      'path'   : '/browserselection/containersBlockDetails'

    }
    return this.httpCall.httpCaller(request);

  }

  containersRelease(obj){
    console.log(obj);
    let request = {
      'params' : obj,
      'method' : 'post',
      'path'   : '/browserselection/containersReleaseDetails'

    }
    return this.httpCall.httpCaller(request);

  }
  releaseBlock(obj){
    console.log(obj);
    let request = {
      'params' : obj,
      'method' : 'post',
      'path'   : '/browserselection/releaseBlockBrowsers'

    }
    return this.httpCall.httpCaller(request);

  }


}
