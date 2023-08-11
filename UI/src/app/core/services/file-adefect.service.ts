import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { apiServiceComponent } from './apiService';
import { Post } from '../../post';
import { Observable } from 'rxjs/Observable';
@Injectable({
  providedIn: 'root'
})
export class FileADefectService {

  constructor(public http: HttpClient, private api: apiServiceComponent) { }

  submitDefectDetails(defectForm, projectId, videoPath, screenShotPath) {
    defectForm.projectId = projectId;
    defectForm.videoPath = videoPath;
    defectForm.screenShotPath = screenShotPath;
    console.log(defectForm)

    return this.http.post(this.api.apiData + '/defectDetails', defectForm)
      .map(response => { return response as any });
  }

  singleDefectDetail(value) {
    return this.http.get(this.api.apiData + "/defectDetailQuick" + value)
      .map(response => { return response as any });
  }

  editDefectDetail(value) {
    return this.http.get(this.api.apiData + "/editDefectDetail" + value)
      .map(response => { return response as any });
  }

  searchScriptDetails(xxx): Observable<Post[]> {
    return this.http.get(this.api.apiData + '/ScriptDetails' + xxx)
      .map(response => { return response as any });;
  }
  mycall(data): Observable<Post[]> {
    return this.http.post(this.api.apiData + '/saveScreenShots', data)
      .map(response => { return response as any });;
  }
}
