import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment as env } from '../../../environments/environment';

const url = env.serverUrl1;
@Injectable({
  providedIn: 'root'
})
export class HttpcallService {
  constructor(private http: HttpClient) { }
  httpCaller(request) {
    if (request.method === 'get') {
      return this.http.get(url + request.path, { params: request.params })
        .map(response => { return response as any });
    } else if (request.method === 'put') {
      return this.http.put(url + request.path, request.params)
        .map(response => { return response as any });

    } else if (request.method === 'post') {
      console.log(request.params)
      return this.http.post(url + request.path, request.params)
        .map(response => { return response as any });

    } else if (request.method === 'delete') {
      return this.http.delete(url + request.path, { params: request.params })
        .map(response => { return response as any });
    }
  }
}
