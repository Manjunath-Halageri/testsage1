import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
import { Observable } from 'rxjs';
import { Post } from '../../post';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ImportServiceComponent {
   constructor(public http: HttpClient, private api: apiServiceComponent) {
   }

   getTypeDetails(): Observable<Post[]> {
      return this.http.get(this.api.apiData + '/importType')
         .map(response => { return response as any });
   }
   getPriorityDetails(): Observable<Post[]> {
      return this.http.get(this.api.apiData + '/importPriority')
         .map(response => { return response as any });
   }
   featureDetails(): Observable<Post[]> {
      return this.http.get(this.api.apiData + '/featureName')
         .map(response => { return response as any });
   }
}