import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class RequirementmoduleService {

  constructor(private httpCall: HttpcallService) { }

  getAllModuledata(data) {

    var obj = {
      "projectNew": data.projectId,
      "projectName": data.projectName

    }
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/requirementModule/getTreeStructureData'
    }
    return this.httpCall.httpCaller(request);

  }

  showModuleWiseData(data) {
    let obj = {
       moduleData : data
    }
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/requirementModule/showModuleWise'
    }
    return this.httpCall.httpCaller(request);

  }

  showFeatureWiseData(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/requirementModule/showFeatureWise'
    }
    return this.httpCall.httpCaller(request);

  }

  
  testScriptDetails(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/requirementModule/getRequirementDetails'
    }
    return this.httpCall.httpCaller(request);

  }

  displayAllModuleData(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/requirementModule/displayAllModuleData'
    }
    return this.httpCall.httpCaller(request);

  }
}

