import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Post } from '../../post';
import { apiServiceComponent } from './apiService';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TestExecutionServiceComponent {
    testScriptsData: any;
    constructor(public http: HttpClient, private api: apiServiceComponent) {
    }
    getProjectSelectionDetails(): Observable<Post[]> {
        return this.http.get(this.api.apiData + "/selectionProject")
            .map(response => { return response as any });

    }
    allDetails: Object = {};
    testScriptDetails(ss): Observable<Post[]> {
        return this.http.get(this.api.apiData + '/getTestScriptDetails' + ss)
            .map(response => { return response as any });
    }

    testScriptDetailsAtExecution(ss): Observable<Post[]> {
        return this.http.get(this.api.apiData + '/TestScriptDetailsAtExecution' + ss)
            .map(response => { return response as any });
    }
    projectDetai(pp): Observable<Post[]> {
        return this.http.get(this.api.apiData + '/getModuleData' + pp)
            .map(response => { return response as any });
    }
    rahulDetails(rah): Observable<Post[]> {
        return this.http.get(this.api.apiData + "/rahuldetails" + rah)
            .map(response => { return response as any });
    }

    showDetails(vv): Observable<Post[]> {
        return this.http.get(this.api.apiData + "/testScript")
            .map(response => { return response as any });
    }



    childModuleDetails(index): Observable<Post[]> {
        return this.http.get(this.api.apiData + '/getFeatureName' + index)
            .map(response => { return response as any });
    }

    totadeytails(vj) {
        var allDetails = []
        allDetails = vj;
    }

    allrahul() {
        return this.allDetails;
    }

    getModule(obj): Observable<Post[]> {
        return this.http.get(this.api.apiData + '/getmodulebasedonrelease' + obj)
            .map(response => { return response as any });
    }

    getModule1(obj1): Observable<Post[]> {
        return this.http.get(this.api.apiData + '/rrrrrrrrrrrrrrrrrr' + obj1)
            .map(response => { return response as any });
    }
    getModule2(obj2): Observable<Post[]> {
        return this.http.get(this.api.apiData + '/ssssss' + obj2)
            .map(response => { return response as any });
    }

    getModule3(obj2): Observable<Post[]> {
        console.log(obj2)
        return this.http.get(this.api.apiData + '/getSuiteModules' + obj2)
            .map(response => { return response as any });
    }

    getlatest(obj2): Observable<Post[]> {
        console.log(obj2)
        return this.http.get(this.api.apiData + '/getlatestTestData' + obj2)
            .map(response => { return response as any });
    }



    getTesters(obj2): Observable<Post[]> {
        console.log(obj2)
        return this.http.get(this.api.apiData + '/getTestersName' + obj2)
            .map(response => { return response as any });
    }

}
