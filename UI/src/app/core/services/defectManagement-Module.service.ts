import { Injectable } from '@angular/core';
import { HttpcallService } from './httpcall.service';

@Injectable({
    providedIn: 'root'
})
export class DefectManagementModuleService {

    constructor(private httpCall: HttpcallService) { }

    getDefectID(){
        let request={
            'params':'',
            'method':'get',
            'path':'/defectmanagementModule/getDefectId'
        }
        return this.httpCall.httpCaller(request);
    }

    getAllModuledata(data) {
        console.log(data)
        let obj = {
            pName: data
        }
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/defectmanagementModule/getAllModuleData'
        }
        return this.httpCall.httpCaller(request);

    }
    getbrowserFields() {
        let request = {
            'params': '',
            'method': 'get',
            'path': '/defectmanagementModule/getbrowserFields'
        }
        return this.httpCall.httpCaller(request);

    }

    getDefectConfigDetails() {
        let request = {
            'params': '',
            'method': 'get',
            'path': '/defectmanagementModule/getDefectConfigDetails'
        }
        return this.httpCall.httpCaller(request);
    }

    getReleaseDetails(data) {
        let obj = {
            pName: data
        }
        console.log(obj)
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/defectmanagementModule/getReleaseDetails'
        }
        return this.httpCall.httpCaller(request);
    }

    updateDefect(defectForm, projectId, defectId, videoPath, screenShotPath,AllNames) {
        let obj = {
            defectForm: defectForm,
            projectId: projectId,
            defectId: defectId,
            videoPath: videoPath,
            screenShotPath: screenShotPath,
            AllNames:AllNames
        }
        console.log(obj)
        let request = {
            'params': obj,
            'method': 'post',
            'path': '/defectmanagementModule/updateDefect'
        }
        return this.httpCall.httpCaller(request);
    }

    submitDefectDetails(defectForm,defectId, projectId, videoPath, screenShotPath,AllNames) {
        let obj = {
            defectForm: defectForm,
            defectId:defectId,
            projectId: projectId,
            videoPath: videoPath,
            screenShotPath: screenShotPath,
            AllNames:AllNames
        }
        let request = {
            'params': obj,
            'method': 'post',
            'path': '/defectmanagementModule/submitDefectDetails'
        }
        return this.httpCall.httpCaller(request);
    }

    searchModule(obj) {
        console.log(obj)
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/defectmanagementModule/searchModule'
        }
        return this.httpCall.httpCaller(request);
    }

    searchFeaturesData(obj) {
        console.log(obj)
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/defectmanagementModule/searchFeaturesData'
        }
        return this.httpCall.httpCaller(request);
    }

    uploadImage(filesToUpload: Array<File>, projectDetails) {
        let formData = new FormData();
        // console.log(filesToUpload.length)
        for (var i = 0; i < filesToUpload.length; i++) {
            // console.log(filesToUpload[i], filesToUpload[i].name)
            // formData.append("uploads[]", filesToUpload[i], filesToUpload[i].name)
            formData.append(projectDetails, filesToUpload[i], filesToUpload[i].name);
        }

        // console.log(formData.getAll('uploads[]'));
        console.log(formData)
        let request = {
            'params': formData,
            'method': 'post',
            'path': '/defectmanagementModule/uploadImageFile'
        }
        return this.httpCall.httpCaller(request);
    }

    uploadVideo(filesToUpload: Array<File>, projectDetails) {
        let formData = new FormData();
        // console.log(filesToUpload.length)
        for (var i = 0; i < filesToUpload.length; i++) {
            // console.log(filesToUpload[i], filesToUpload[i].name)
            // formData.append("uploads[]", filesToUpload[i], filesToUpload[i].name)
            formData.append(projectDetails, filesToUpload[i], filesToUpload[i].name);
        }
        // console.log(formData.getAll('uploads[]'));
         console.log(formData)
        let request = {
            'params': formData,
            'method': 'post',
            'path': '/defectmanagementModule/uploadVideoFile'
        }
        return this.httpCall.httpCaller(request);
    }


    // //////////////////////////////// Search a defect code starts ///////////////////////////////////
    testScriptDetails(data) {
        console.log(data)
        let obj = {
            searchData: data
        }
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/defectmanagementModule/testScriptDetails'
        }
        return this.httpCall.httpCaller(request);

    }
    singleDefectDetail(obj) {
        let request = {
            'params': obj,
            'method': 'get',
            'path': '/defectmanagementModule/singleDefectDetail'
        }
        return this.httpCall.httpCaller(request);

    }

    editDefectDetail(data) {
        let request = {
            'params': data,
            'method': 'get',
            'path': '/defectmanagementModule/editDefectDetail'
        }
        return this.httpCall.httpCaller(request);
    }

    checkUploads(data) {
        let request = {
            'params': data,
            'method': 'post',
            'path': '/defectmanagementModule/checkUploads'
        }
        return this.httpCall.httpCaller(request);
    }
    
    removeUIUploads(data) {
        let request = {
            'params': data,
            'method': 'delete',
            'path': '/defectmanagementModule/removeUIUploads'
        }
        return this.httpCall.httpCaller(request);
    }
}






