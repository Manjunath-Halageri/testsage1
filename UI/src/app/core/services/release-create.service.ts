import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})

export class CreateService {
  constructor(private httpCall: HttpcallService) { }
  create() {
    throw new Error("Method not implemented.");
  }

   getModules(obj) {
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/getModules'
    }
    return this.httpCall.httpCaller(request);

  }

  getFeatures(obj) {
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/getFeatures'
    }
    return this.httpCall.httpCaller(request);

  }


  getActiveReleaseVer(obj) {
    let object = {
      releaseProjectId: obj
    }
    let request = {
      'params': object,
      'method': 'get',
      'path': '/release/getActiveReleaseVer'
    }
    return this.httpCall.httpCaller(request)
  }

  saveReleaseVersion(obj) {

    let request = {
      'params': obj,
      'method': 'post',
      'path': '/release/releaseVersion'
    }
    return this.httpCall.httpCaller(request);

  }
  findRelease(obj) {
    let object = {
      releaseId: obj
    }
    let request = {
      'params': object,
      'method': 'get',
      'path': '/release/findReleaseData'
    }
    return this.httpCall.httpCaller(request);
  }

  releaseWiseSearch(obj) {
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/searchReleaseWiseData'
    }
    return this.httpCall.httpCaller(request);
  }


  createRelease(createReleaseVersion) {
    let request = {
      'params': createReleaseVersion,
      'method': 'post',
      'path': '/release/releaseCreate'
    }
    return this.httpCall.httpCaller(request);
  }


  dispRelease(projectId) {
    let obj = {
      "projectId": projectId
    }
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/releaseDisplay'
    }
    return this.httpCall.httpCaller(request);
  }

  updateRelease(obj) {
    let request = {
      'params': obj,
      'method': 'put',
      'path': '/release/releaseUpdate'
    }
    return this.httpCall.httpCaller(request);
  }

  getReleaseToEdit(obj) {
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/editRelease'
    }
    return this.httpCall.httpCaller(request);
  }

  getAllReleases(projectId) {
    let obj = {
      "projectId": projectId
    }
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/displayAllRelease'
    }
    return this.httpCall.httpCaller(request);
  }

  displayClosedReleases(projectId) {
    let obj = {
      "projectId": projectId
    }
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/displayClosedReleases'
    }
    return this.httpCall.httpCaller(request);
  }

  displayAllClosedRelease(projectId) {
    let obj = {
      "projectId": projectId
    }
    console.log(projectId)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/displayAllClosedRelease'
    }
    return this.httpCall.httpCaller(request);
  }

  testScriptDetails(data) {
    let obj = {
      searchData: data
    }
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/getTestScriptDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getModuleDetails(data) {
    let obj = {
      projectId: data
    }
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/release/getModuleData'
    }
    return this.httpCall.httpCaller(request);
  }

  typeDetails() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/release/importType'
    }
    return this.httpCall.httpCaller(request);
  }

  priorityDetails() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/release/importPriority'
    }
    return this.httpCall.httpCaller(request);
  }

}
