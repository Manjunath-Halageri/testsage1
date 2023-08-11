import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { apiServiceComponent } from './apiService'
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class ShowExecutionReportService {

  constructor(private http: HttpClient, private api: apiServiceComponent,private httpCall: HttpcallService) { }

  deletePreviousXml(projectName) {
    return this.http.get(this.api.apiData + '/createTestCase/deletePreviousXml' + '/' + projectName);
  }

  checkNewlyCreatedXmlExists(projectName){
    return this.http.get(this.api.apiData + '/createTestCase/checkNewlyCreatedXmlExixts' + '/' + projectName);
  }

  convertXmlToJson(object){ 
    const request = {
      'params': object,
      'method': 'get',
      'path': '/createTestCase/convertXmlToJson'
    }
    return this.httpCall.httpCaller(request);
  }

  extractInfoFromJson(projectName,projectId,scriptName){
    return this.http.get(this.api.apiData + '/createTestCase/extractInfoFromJson' + '/' + projectName+ '/' + projectId+ '/' + scriptName);
  }
}
