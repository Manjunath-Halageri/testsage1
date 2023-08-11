import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})

export class TrackingService {
  create(ownerForm: any) {
    throw new Error("Method not implemented.");
  }

  constructor(private httpCall: HttpcallService) { }

  getTrackDetails(obj) {
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/tracking/getTracking'
    }
    return this.httpCall.httpCaller(request);

  }

  thresholdExitCall(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/tracking/thresholdCall'
    }
    return this.httpCall.httpCaller(request);

  }


  thresholdPercentageCall() {
    let request = {

      'method': 'get',
      'path': '/tracking/getThresholdPercentage'
    }
    return this.httpCall.httpCaller(request);

  }

  getAllReleaseData(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/tracking/treeStructureReleaseAndSuite'
    }
    return this.httpCall.httpCaller(request);

  }
}