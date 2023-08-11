import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Post } from '../../post';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ObjectServiceComponent {
  objectSelectdata: string
  clearObjectData: string;
  constructor(public http: HttpClient, private api: apiServiceComponent) { }

  getObjectDetails(projectId): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/getObject" + projectId)
      .map(response => { return response as any });
  }

  getPageDetails(parameters): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/getPageDetails" + parameters)
      .map(response => { return response as any });
  }

  objectShowData(data) {
    this.objectSelectdata = data
    console.log(data)
    this.clearObjectData = undefined
  }

  clickObject() {
    return this.objectSelectdata
  }

  clearOD(clear) {
    this.clearObjectData = clear
  }

  clearTable() {
    return this.clearObjectData
  }

  objectNameDetails(data): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/objectNameDetails" + data)
      .map(response => { return response as any });
  }

  pageNameDetails(pageName): Observable<Post[]> {
    var extraData = pageName;

    return this.http.get(this.api.apiData + "/pageNameDetails" + extraData)
      .map(response => { return response as any });
  }

  getORDetails(pageName): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/getORDetails" + pageName)
      .map(response => { return response as any });
  }

  getLocators(): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/getLocators")
      .map(response => { return response as any });
  }
}