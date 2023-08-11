import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
import { Observable } from 'rxjs';
import { Post } from '../../post'
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ModuleServiceComponent {
  constructor(public http: HttpClient, private api: apiServiceComponent) {
  }

  idDetails(): Observable<Post[]> {
    return this.http.get(this.api.apiData + "/idModule")
      .map(response => { return response as any });
  }
}