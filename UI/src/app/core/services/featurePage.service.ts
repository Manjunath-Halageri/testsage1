import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../post'

@Injectable()
export class FeatureServiceComponent {
  constructor(public http: HttpClient, private api: apiServiceComponent) {
  }
  getMId(selectedValue): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/mId" + selectedValue)
      .map(response => { return response as any });

  }
  idFDetails(): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/idFeature")
      .map(response => { return response as any });

  }
}