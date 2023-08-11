import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiServiceComponent } from './apiService';
import { Post } from '../../post'
import 'rxjs/add/operator/map';
import { HttpcallService } from './httpcall.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProjectSelectionServiceComponent {
  constructor(private http: HttpClient, private api: apiServiceComponent, private httpCall: HttpcallService) { }
 
  projectDetails: any;

  getFrameWorks() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/projectSelection/getFrameWorks'
    }
    return this.httpCall.httpCaller(request);
  }
  getProjectNames() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/projectSelection/getProjectNames'
    }
    return this.httpCall.httpCaller(request);
  }

  getbrowser(){
    let request = {
      'params': '',
      'method': 'get',
      'path': '/projectSelection/getbrowser'
    }
    return this.httpCall.httpCaller(request);
  }

  getdefaultConfig() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/projectSelection/getdefaultConfig'
    }
    return this.httpCall.httpCaller(request);
  }


  createNewProject(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/projectSelection/createNewProject'
    }
    return this.httpCall.httpCaller(request);
  }
  projectdelete(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/projectSelection/projectdelete'
    }
    return this.httpCall.httpCaller(request);
  }

  getProject(data) {
    let obj = {
      projectID: data
    }
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/projectSelection/getProject'
    }
    return this.httpCall.httpCaller(request);
  }

  editselectedProject(obj) {
    let request = {
      'params': obj,
      'method': 'put',
      'path': '/projectSelection/editselectedProject'
    }
    return this.httpCall.httpCaller(request);
  }

  createApiProject(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/projectSelection/createApiProject'
    }
    return this.httpCall.httpCaller(request);
  }

  getProjectSelectionDetails(): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/selectionProject")
      .map(response => { return response as any });
  }

  getprojectId(pname): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/selectedProjectID" + pname, {})
      .map(response => { return response as any });
  }


  getDetailsOfProject() {
    console.log(this.projectDetails);
    return this.projectDetails;
  }

  getProjectIdDetails(dataSelected, allProjects) {
    for (const dataInLoop in allProjects) {
      if (allProjects[dataInLoop].projectSelection == dataSelected) {
        this.projectDetails = {
          "projectId": allProjects[dataInLoop].projectId,
          "projectName": allProjects[dataInLoop].projectSelection,
          "frameworkId": allProjects[dataInLoop].frameworkId
        }
        return this.projectDetails;
      }
    }
  }
}