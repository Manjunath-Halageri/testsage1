import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
// import { Post } from 'src/app/post';
import { HttpcallService } from './httpcall.service';




@Injectable({
  providedIn: 'root'
})

export class GraphReportService {


  constructor(private httpCall: HttpcallService) { }

  /////////////////////////// Suite servic code starts //////////////////////////////////
  getprojectId(data) {
    console.log(data)
    let obj = {
      projectName: data
    }
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/reportsModule/getprojectId'
    }
    return this.httpCall.httpCaller(request);

  }

  fetchReportNumbers(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/fetchReportNumbers'
    }
    return this.httpCall.httpCaller(request);
  }

  fetchNewReport(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/fetchNewReport'
    }
    return this.httpCall.httpCaller(request);
  }

  fetchSuites(dates) {
    console.log(dates)
    // if (dates.fDate == undefined || dates.tDate == undefined) {
    //   alert("Please select Dates");
    //   return;
    // }
    // if (dates.fDate > dates.tDate) {
    //   alert("FromDate should be less then ToDate");
    //   return;
    // }

    // else {
      let request = {
        'params': dates,
        'method': 'post',
        'path': '/reportsModule/dateWise'
      }
      return this.httpCall.httpCaller(request);
    // }
  }

  fetchModules(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/fetchModules'
    }
    return this.httpCall.httpCaller(request);
  }

  getSpecificReport(number) {
    let obj = {
      number: number
    }
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/reportsModule/getSpecificReport'
    }
    return this.httpCall.httpCaller(request);
  }

  fetchSchedules(pid) {
    console.log(pid)
    let obj = {
      projectId: pid
    }
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/reportsModule/fetchSchedules'
    }
    return this.httpCall.httpCaller(request);
  }

  getAllReleaseVer(obj) {
    let object = {
      releaseProjectId: obj
    }
    let request = {
      'params': object,
      'method': 'get',
      'path': '/reportsModule/getAllReleaseVer'
    }
    return this.httpCall.httpCaller(request)
  }

  ///////////////////////////////////// Suite service code Ends //////////////////////////////////
  backFreature(obj) {

    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/getselectedFeatutre'
    }
    return this.httpCall.httpCaller(request);
  }

  fetchFeature(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/getFeaturesOfModule'
    }
    return this.httpCall.httpCaller(request);
  }
  //////////////////////////////////// Feature-level service code Ends //////////////////////////////////


  //////////////////////////////////// script-level service code starts //////////////////////////////////
  backScripts(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/getRunScriptsData'
    }
    return this.httpCall.httpCaller(request);
  }
  fetchScripts(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/getScripts'
    }
    return this.httpCall.httpCaller(request);
  }

  
  //////////////////////////////////// script-level service code Ends //////////////////////////////////

  //////////////////////////////////// step-level service code starts //////////////////////////////////
  fetchSteps(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/getSteps'
    }
    return this.httpCall.httpCaller(request);
  }
  
  backSteps12(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/getSelectedStep'
    }
    return this.httpCall.httpCaller(request);
  }

  fetchLogs(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/getLogs'
    }
    return this.httpCall.httpCaller(request);
  }
  fetchScreenShot(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/getScreen'
    }
    return this.httpCall.httpCaller(request);
  }
 
  deleteScreenShot(obj) {
    console.log(obj)
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/reportsModule/deleteScreenShot'
    }
    return this.httpCall.httpCaller(request);
  }
  //////////////////////////////////// step-level service code Ends //////////////////////////////////





  // backFreature(data): Observable<Post[]> {
  //   // alert("2nd");
  //   console.log(data);
  //   return this.http.post(this.api.apiData + '/getselectedFeatutre', data)
  //     .map((response: Response) => <Post[]>response.json());

  // }
  // fetchSuites(dates): Observable<Post[]> {
  //   console.log(dates.fDate);
  //   console.log(dates.tDate);
  //   if (dates.fDate == undefined || dates.tDate == undefined) {
  //     alert("Please select Dates");
  //     return;
  //   }
  //   if (dates.fDate > dates.tDate) {
  //     alert("FromDate should be less then ToDate");
  //     return;
  //   }

  //   else {
  //     return this.http.post(this.api.apiData + "/dateWise", dates)
  //       .map((response: Response) => <Post[]>response.json());
  //   }
  // }

  // fetchNewReport(dataRoute): Observable<Post[]> {

  //   console.log(dataRoute)
  //     return this.http.post(this.api.apiData + "/NewReport", dataRoute)
  //       .map((response: Response) => <Post[]>response.json());

  // }
  // fetchModules(moduleData): Observable<Post[]> {
  //   return this.http.post(this.api.apiData + '/getModules', moduleData)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  // fetchSteps(scriptData): Observable<Post[]> {
  //   //  alert("hi")
  //   console.log(scriptData);
  //   return this.http.post(this.api.apiData + "/getSteps", scriptData)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  //for fetching the features under module
  // fetchFeature(module): Observable<Post[]> {
  //   // alert("1st");
  //   return this.http.post(this.api.apiData + "/getFeaturesOfModule", module)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  //for fetching the scripts
  // fetchScripts(script): Observable<Post[]> {

  //   return this.http.post(this.api.apiData + "/getScripts", script)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  // fetchLogs(complete): Observable<Post[]> {

  //   return this.http.post(this.api.apiData + "/getLogs", complete)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  //for fetching the screenshot of step
  // fetchScreenShot(screenData): Observable<Post[]> {
  //   // alert("hello")
  //   // console.log(screenData);
  //   return this.http.post(this.api.apiData + "/getScreen", screenData)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  //for fecthing the video for script
  // fetchVideo(videoData): Observable<Post[]> {
  //   console.log(videoData);
  //   return this.http.post(this.api.apiData + "/getVideo", videoData)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  // //for fetching other related reports number
  // fetchReportNumbers(reportNum): Observable<Post[]> {
  //   // alert("called me to search the reportnumbers");
  //   console.log(reportNum);
  //   return this.http.post(this.api.apiData + "/fetchReportNumbers", reportNum)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  // getSpecificReport(number): Observable<Post[]> {
  //   console.log(number);
  //   return this.http.get(this.api.apiData + "/getSpecificReport" + number)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  // getSpecificFeatureReport(number):Observable<Post[]>{
  //   console.log(number);
  //   // alert(number);
  //   return this.http.get(this.api.apiData+"/getSpecificFeature"+number)
  //   .map((response: Response)=><Post[]>response.json());
  // }

  // getSpecificScriptReport(runNum):Observable<Post[]>{
  //   console.log(runNum);
  //   // alert(runNum);
  //   return this.http.get(this.api.apiData+"/getSpecificScript"+runNum)
  //   .map((response: Response) => <Post[]>response.json());
  // }

  // getSpecificScriptSteps(reportNum):Observable<Post[]>{
  //   console.log(reportNum);
  //   return this.http.get(this.api.apiData+"/getSpecificScriptSteps"+reportNum)
  //   .map((response: Response) => <Post[]>response.json());
  // }


  // getAllSchedule(): Observable<Post[]> {

  //   return this.http.get(this.api.apiData + "/getSchedules")
  //     .map((response: Response) => <Post[]>response.json());

  // }

  // getSelectedExecution():Observable<Post[]>{
  //   return this.http.get(this.api.apiData+'/selectedExecution',{})
  //   .map((response:Response)=><Post[]>response.json());
  // }

  // backFreature(data): Observable<Post[]> {
  //   // alert("2nd");
  //   console.log(data);
  //   return this.http.post(this.api.apiData + '/getselectedFeatutre', data)
  //     .map((response: Response) => <Post[]>response.json());

  // }

  // backScripts(data1): Observable<Post[]> {
  //   console.log(data1);
  //   // alert("hello1234")
  //   return this.http.post(this.api.apiData + "/getRunScripts1234", data1)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  // backSteps12(data2): Observable<Post[]> {
  //   // alert("get steps");
  //   console.log(data2);
  //   return this.http.post(this.api.apiData + '/getSelectedStep', data2)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  // fetchSchedules() {
  //   return this.http.get(this.api.apiData + "/fetchSchedule", {})
  //     .map((response: Response) => <Post[]>response.json());
  // }

  // manualReportFetchCall(data) {
  //   // alert("hi")
  //   console.log(data);
  //   var myManual = data;
  //   return this.http.post(this.api.apiData + "/fetchManual", myManual)
  //     .map((response: Response) => <Post[]>response.json());
  // }

  // fetchManualVideo(data) {
  //   // console.log(data);
  //   return this.http.post(this.api.apiData + "/fecthManualVideo", data)
  //     .map((response: Response) => <Post[]>response.json());
  // }
}
