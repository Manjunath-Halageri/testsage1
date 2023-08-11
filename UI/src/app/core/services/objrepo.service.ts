import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
import { HttpClient } from '@angular/common/http';
import { MatConfirmDialogComponent } from '../mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { HttpcallService } from './httpcall.service';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class ObjrepoService {

  constructor(private api: apiServiceComponent, private http: HttpClient, private dialog: MatDialog,
    private httpCall: HttpcallService) { }
    
getObjectDetails(obj){
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'get',
    'path': '/objRepo/getObject'
  });
}
getPageDetails(obj){
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'get',
    'path': '/objRepo/getPageDetails'
  });
}

checkIfPageContainsObj(obj){
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'get',
    'path': '/objRepo/checkIfPageContainsObj'
  });
}

deletePage(obj) {
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'delete',
    'path': '/objRepo/deletePage'
  });
}

duplicatePage(obj) {
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'get',
    'path': '/objRepo/checkDuplicatePage'
  });
}

methodCreate(obj) {
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'post',
    'path': '/objRepo/createObjRepo'
  });

}

unique(saved, name, seq) {
  let res = {};
  res['state'] = false;
  res['name'] = false;
  res['seq'] = false;
  if (saved.length != 0) {//to check if object is being created for first time, if yes then there is no point in running for loop.
    saved.forEach(element => {
      if (element['objectSequence'] === seq) {//checking for match
        res['state'] = true;//if match found 
        res['seq'] = true;
      }
    });
    saved.forEach(element => {
      if (element['objectName'] === name) {//checking for match
        res['state'] = true;//if match found
        res['name'] = true;
      }
    });

  }
  return res
}

savePageObject(obj) {
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'post',
    'path': '/objRepo/savePageObj'
  }); 
}

updatePageObject(obj) {
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'put',
    'path': '/objRepo/updatePageObj'
  }); 
}

checkIfObjBeingUsedInScripts(obj){
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'get',
    'path': '/objRepo/checkIfObjBeingUsedInScripts'
  }); 

}

deleteObj(obj) {
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'delete',
    'path': '/objRepo/deleteObj'
  });
}

updatePageDetail(obj) {
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'post',
    'path': '/objRepo/updateObjrepo'
  });
}

sendCapturedMultiobjectToBackend(obj){
  return this.httpCall.httpCaller({
    'params': obj,
    'method': 'post',
    'path': '/objRepo/multiObjInfoImp'
  });
}

sendMultiObjSaveFinalToBackend(obj,sPage,proId,exportConfigInfo){
  let finalObj={
    "pageName":sPage,
    "projectId":proId,
    "exportConfigInfo":exportConfigInfo,
    "Arr":obj
  }
  return this.httpCall.httpCaller({
    'params': finalObj,
    'method': 'post',
    'path': '/objRepo/multiObjInfoImpSaveDbPom'
  });
}

deleteConfirm(msg) {
  return this.dialog.open(MatConfirmDialogComponent, {
    width: '400px',
    height: '130px',
    panelClass: 'confirm-dialog-container',
    disableClose: true,
    data: {
      message: msg,
    }
  });
}

warningMsg(msg){
  return this.dialog.open(MatConfirmDialogComponent, {
    width: '400px',
    height: '140px',
    panelClass: 'confirm-dialog-container',
    disableClose: true,
    data: {
      message: msg,
    }
  });
}


checkingUniqueWhileUpdating(saved, name, seq, pname, pseq) {
  let res = {};
  res['state'] = false;
  res['name'] = false;
  res['seq'] = false;
  if (seq === pseq) { } else {
    saved.forEach(element => {
      if (element['objectSequence'] === seq) {//checking for match
        res['state'] = true;//if match found 
        res['seq'] = true;
      }
    });
  }
  if(name===pname){

  }else{
  saved.forEach(element => {
    if (element['objectName'] === name) {//checking for match
      res['state'] = true;//if match found
      res['name'] = true;
    }
  });
  }
  return res

}

checkingDuplicatePageWhileUpdating(savedPom, upObj) {
  let state = true;
  if (upObj.oldName === upObj.pageName) {

  } else {
    savedPom.forEach(ele => {
      if (ele.label === upObj.pageName) {
        state = false;
      }
    })
  }
  return state;


}

tagsSelected=[];
  captureSelectedTags(e){
    if (e.target.checked) {
      //Here we add selected tags to the 'tagsSelected' array
			this.tagsSelected.push(e.target.value);
		} else {
      //Here we remove any deselected tags from 'tagsSelected' array
			var index = this.tagsSelected.indexOf(e.target.value);
			if (index !== -1) {
				this.tagsSelected.splice(index, 1);
			}
    }
  }

  captureAllTags(event, multiObjCheckBox) {
    if(!event.target.checked) {
      console.log("test")
      this.tagsSelected = []
    }
    else{
      multiObjCheckBox.forEach(e => {
        this.tagsSelected.push(e.nativeElement.value);
      });
    }
  }

  selectedTags() {
    var inputAttr = [];
    this.tagsSelected.forEach((element)=>{
      if(element == "TextField"){
        inputAttr.push('text')
      }
      else if(element == "RadioButton") {
        inputAttr.push('radio')
      }
      else if(element == "CheckBox"){
        inputAttr.push('checkbox')
      }
    })
    inputAttr=Array.from(new Set(inputAttr))
    return inputAttr;
  }

  filterSelectedTags(){
    var tempArr=[];
    this.tagsSelected.forEach((element,i,arr) => {
      if(element==="TextField"||element==="RadioButton"||element==="CheckBox"){
        tempArr.push("input");
      }
      else if(element==="Button"){
        tempArr.push("button");
      }
      else if(element==="DropDown"){
        tempArr.push("select");
      }
      else if(element==="Image"){
        tempArr.push("img");
      }
      else{
        tempArr.push("a");
      }
    });
    tempArr=Array.from(new Set(tempArr))//to remove duplicate elements,we convert array to set and then back to array
    this.tagsSelected=[];
    return tempArr;
    
  }

  /////////////////////////////////////compare object starts///////////////////////////////////////

  sendCapturedCompareobjectToBackend(obj){
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/objRepo/compareObj'
    });
  }

  sendfinalUltimateArrToBackend(obj){
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/objRepo/compareObjDbAndPomChanges'
    });
  }


  processToGetChangedProperties(obj){
    let jNewArr=obj.newObj.attributes.concat(obj.newObj.xpath);
		let jOldArr=obj.oldObj.attributes.concat(obj.oldObj.xpath);
		let tempToStoreResult=[];
		obj.changedProperties.forEach(ele => {
			let dummyObj={};
			dummyObj["Prop"]=ele;
			for (const iterator of jNewArr) {
				if (iterator.locators==ele) {
					dummyObj["newValue"]=iterator.value;
				}	
			}
			for (const iterator of jOldArr) {
				if (iterator.locators==ele) {
					dummyObj["oldValue"]=iterator.value;
				}	
			}
			tempToStoreResult.push(dummyObj);
			
    });
    return tempToStoreResult;
  }

/////////////////////////////////////compare object ends///////////////////////////////////////////

}
