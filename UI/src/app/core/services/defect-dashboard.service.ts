import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})

export class DefectDashboardService {
  constructor(private httpCall: HttpcallService) { }

  searchPriorityReport(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searchPriorityGraphData'

    }
    return this.httpCall.httpCaller(request);

  }
  getAllReleaseVersions(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/getAllReleaseVersionsFromRelease'
    }
    return this.httpCall.httpCaller(request);

  }
  searcPriorityBugs(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searchPriorityWiseBugs'
    }
    return this.httpCall.httpCaller(request);
  }

  searhSeverityBugs(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searchSeverityWiseBugs'
    }
    return this.httpCall.httpCaller(request);
  }

  searhStatusBugs(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searchStatusWiseBugs'

    }
    return this.httpCall.httpCaller(request);

  }

  searcPriorityFeatureBugs(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searcPriorityFeature'

    }
    return this.httpCall.httpCaller(request);

  }
  searchSeverityFeatureBugs(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searchSeverityFeature'

    }
    return this.httpCall.httpCaller(request);
  }

  searchStatusFeatureBugs(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searchStatusFeature'

    }
    return this.httpCall.httpCaller(request);
  }
  //////////////////////////////////Requirement coverage Report starts///////////////////////////////// 
  searchRequirements(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searchRequirementData'
    }
    return this.httpCall.httpCaller(request);
  }

  searchRequirementstwo(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searchRequirementDatatwo'
    }
    return this.httpCall.httpCaller(request);
  }

  searchRequirementsthree(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/searchRequirementsthree'
    }
    return this.httpCall.httpCaller(request);
  }

  mainSubGraph(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/mainSubGraph'
    }
    return this.httpCall.httpCaller(request);
  }

  mainSubChartTwoData(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/mainSubChartTwo'
    }
    return this.httpCall.httpCaller(request);
  }

  subchartMadhu1(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/subchartMadhu1'
    }
    return this.httpCall.httpCaller(request);
  }

  subchartMadhu2(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/defectdashboard/subchartMadhu2'
    }
    return this.httpCall.httpCaller(request);
  }

}
