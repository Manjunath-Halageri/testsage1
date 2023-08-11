import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiComponentCoreServiceService } from '../../../../core/services/api-component-core-service.service';

@Component({
  selector: 'app-response-validation',
  templateUrl: './response-validation.component.html',
  styleUrls: ['./response-validation.component.css']
})
export class ResponseValidationComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  valueCtrl = new FormControl();
  filteredtype4Values: Observable<string[]>;
  type4Value: string[] = [];
  type4DataList: string[] = [];
  methods: any = [];
  iterativeMethods: any = [];

  responseValidationData: any = {
    "type": 1,
    "not": false
  };

  iterativeDataList: any = [{
    "requestIterativeMethod": '',
    "value": '',
    "not": false,
    "type": 1
  }]
  validationEdit: Number;


  @Output() validationValuesEvent = new EventEmitter();
  @Input() validationsList: any = [];
  @Input() displayResponseValidation:any;
  @Input() displayResponseHeaderValid:any;
  @Input() displayResponseTimeValid:any;

  @ViewChild('type4Input', { static: false }) type4Input: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  negateType:boolean=true;

  constructor(private apiCoreService: ApiComponentCoreServiceService) {
    this.filteredtype4Values = this.valueCtrl.valueChanges.pipe(
      startWith(null),
      map((value1: string | null) => value1 ? this._filter(value1) : this.type4DataList.slice()));
  }

  ngOnInit() {
    console.log(this.displayResponseValidation,this.displayResponseHeaderValid,this.displayResponseTimeValid)
    this.getValidationMethods();
  }

  /*logic description: fetching the responsevalidation methods in responseValidationMethods collection 
  and returning only requested validation type based on Header, type and Name.
   */
  getValidationMethods() {
    this.apiCoreService.getRequestValidations().subscribe(methods => {
      // this.methods = methods;
      if(this.displayResponseHeaderValid){
        this.methods=methods.filter(obj => {
        //  if(obj.type == 1) {
        //   if(obj.methodName!="lessThan"&&obj.methodName!=="lessThanOrEqualTo"&&obj.methodName!=="greaterThan"&&obj.methodName!=="greaterThanOrEqualTo"){
        //     return obj;
        //   }
        //  }else 
         if(obj.type !== 4) {
          return obj;
        }
        });
      }
     else if(this.displayResponseTimeValid){
        this.methods=methods.filter(obj => {
         if(obj.type == 1) {
          if(obj.methodName=="lessThan"||obj.methodName=="lessThanOrEqualTo"||obj.methodName=="greaterThan"||obj.methodName=="greaterThanOrEqualTo"||obj.methodName=="equalTo"||obj.methodName=="emptyString"){
            return obj;
          }
         }else if(obj.type !== 4&&obj.type !==3) {
          return obj;
        }
        });
      }
      else{
      this.methods = methods;
      }
      //||obj.methodName!=="lessThan"||obj.methodName!=="lessThanOrEqualTo"||obj.methodName!=="greaterThan"||obj.methodName!=="greaterThanOrEqualTo"
      this.methods.sort((a, b) => a.methodName.localeCompare(b.methodName));
      console.log(this.methods)
      this.setIterativeMethods();
    });
  }

  /*logic description: pushing the values into array only type matching
   */
  setIterativeMethods() {
    for (var m of this.methods) {
      if (m.type == 1 || m.type == 3) {
        this.iterativeMethods.push(m);
      }
    }
  }

  /*logic description: send the added assertion in validation to parent component 
  when click on add/update of validation and calling close function
   */
  addValidationToList(values) {
    console.log(values)
    // console.log(this.isEdit,this.responseValidationData)
    // if (!this.isEdit) {
    //   this.validationsList.push({ ...this.responseValidationData });
    // }
    // else {
    //   this.validationsList.splice(this.validationEdit, 1, { ...this.responseValidationData });
    //   this.validationEdit = undefined;
    // }
    // console.log(this.validationsList)
    // this.validationValuesEvent.emit(this.validationsList);
    console.log(this.isEdit,this.responseValidationData)
    // if(this.responseValidationData.type==2){
    //   this.responseValidationData.values.forEach((e,i,arr)=>{
    //     if(e.type!=3&&e.requestIterativeMethod==""&&e.value==""){
    //       this.responseValidationData.values.splice(i,1)
    //     }
    //     if(i==arr.length-1){
    //       console.log("type 2",this.responseValidationData)
    //     }
    //   });
    // }
    if (!this.isEdit) {
      this.validationsList.push({ ...this.responseValidationData });
    }
    else {
      this.validationsList.splice(this.validationEdit, 1, { ...this.responseValidationData });
      this.validationEdit = undefined;
    }
    console.log(this.validationsList)
    this.validationValuesEvent.emit(this.validationsList);
    this.responseValidationData.requestMethod = '';
    this.responseValidationData.jsonPath = '';
    // this.responseValidationData.values = '';
    this.CloseResponseModal();
    this.responseValidationData.values = [{
      "requestIterativeMethod": '',
      "value": '',
      "type": 1,
      "not": false
    }];
    this.iterativeDataList = [{
      "requestIterativeMethod": '',
      "value": '',
      "not": false,
      "type": 1
    }];
    this.type4Value = [];
    this.type4DataList = [];
    sessionStorage.removeItem('responseValidationData');
  }

  /*logic description: splicing/removing the clicked validation when click on 'X' icon
   */
  removeValidation(index) {
    this.validationsList.splice(index, 1);
  }

  /*logic description: edit the validation when click on edit icon and setting the values in sessioStorage for 
    further use.
   */
  stroreHasValues=[];
  editValidationList(list, index) {
    this.stroreHasValues=[];
    console.log("editValidationList",this.stroreHasValues)
    this.responseValidationData = { ...list };
    this.validationEdit = index;
    if(this.responseValidationData.type==4){
      this.type4Value=this.responseValidationData.values;
      this.stroreHasValues=this.type4Value;
      sessionStorage.setItem('HasValues',  JSON.stringify(this.stroreHasValues));
    }
    if(this.responseValidationData.type==2){
      this.stroreHasValues=this.responseValidationData.values;
      sessionStorage.setItem('IterativeValues',  JSON.stringify(this.stroreHasValues));
      this.negateType=false;
    }
    // if(this.responseValidationData.type==1||this.responseValidationData.type==3){
      console.log(this.responseValidationData)
      sessionStorage.setItem('responseValidationData',  JSON.stringify(this.responseValidationData));
    // }
  }

  /*logic description: adding the object and properties when changing the assertion methood
   */
  setMethodValues() {
    for (let i = 0; i < this.methods.length; i++) {
      if (this.methods[i].methodName === this.responseValidationData.requestMethod) {
        this.responseValidationData.type = this.methods[i].type;
        this.responseValidationData.positiveNlpData = this.methods[i].positiveNlpData;
        this.responseValidationData.negativeNlpData = this.methods[i].negativeNlpData;
        if (this.responseValidationData.type === 2 || this.responseValidationData.type === 4) {
          this.responseValidationData.values = [{
            "requestIterativeMethod": '',
            "value": '',
            "type": 1,
            "not": false
          }];
          // this.responseValidationData.values = [];
          this.type4Value = [];
        }
        else {
          this.responseValidationData.values = '';
        }
        if (this.responseValidationData.type === 2){
          this.negateType=false;
        }else{
          this.negateType=true;
        }
        this.responseValidationData.not=false;
      }
    }
  }

  /*logic description: adding an object to array when click on '+' icon
   */
  addIterativeValuesToList() {
    this.iterativeDataList.push({
      "requestIterativeMethod": '',
      "value": '',
      "type": 1,
      "not": false
    })
    // this.responseValidationData.values = this.iterativeDataList;
    this.responseValidationData.values.push({
      "requestIterativeMethod": '',
      "value": '',
      "type": 1,
      "not": false
    });

  }

  /*logic description: checking each method in loop that it has negation or not and display in UI
   */
  getListMethods(listItem){
    console.log(listItem)
    if(listItem.not){
      return listItem.negativeNlpData;
    }
    else{
      return listItem.positiveNlpData;
    }
  }

  /*logic description: checkong each method type and creating and adding statements to UI
   */
  getListValues(listItem) {
    console.log(listItem)
    if (listItem.type === 1) {
      return listItem.values;
    }
    else if (listItem.type === 4) {
      // let values1 = '( ';
      let values1 = '';
      if(Array.isArray(listItem.values)){
        values1 = '( ';
        for (var i = 0; i < listItem.values.length; i++) {
        values1 += `${listItem.values[i]}`;
        if (i < listItem.values.length - 1) {
          values1 += `, `
        }
      }
      values1 += ' )';
      }
      // for (var i = 0; i < listItem.values.length; i++) {
      //   values1 += `${listItem.values[i]}`;
      //   if (i < listItem.values.length - 1) {
      //     values1 += `, `
      //   }
      // }
      // values1 += ' )';
    console.log(values1)
      return values1;
    }
    else {
      let values1 = '';
      if(Array.isArray(listItem.values)){
      for (var i = 0; i < listItem.values.length; i++) {
        values1 += `${listItem.values[i].requestIterativeMethod} ${listItem.values[i].value} `;
      }
    }
      // for (var i = 0; i < listItem.values.length; i++) {
      //   values1 += `${listItem.values[i].requestIterativeMethod} ${listItem.values[i].value} `;
      // }
      console.log(values1)
      return values1;
    }
  }

  /*logic description: calling this when click on ',' or enter keys that add value into chip
   */
  add(event: MatChipInputEvent): void {
    console.log("add",event.input,event.value )
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.type4Value.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.valueCtrl.setValue(null);
    console.log("add",this.type4Value )
  }

   /*logic description: calling this when click on 'X' of a chip and removing the value
   */
  remove(fruit: string): void {
    const index = this.type4Value.indexOf(fruit);
    if (index >= 0) {
      this.type4Value.splice(index, 1);
    }
  }

   /*logic description: not using
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.type4Value.push(event.option.viewValue);
    this.type4Input.nativeElement.value = '';
    this.valueCtrl.setValue(null);
  }

   /*logic description: calling this on componet loading in condition but no appropriate use of this.
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.type4DataList.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

   /*logic description: calling this when selecting the iterative methods under request method
   */
  checkType2Method(iterativeMethod,index) {
    for (let i = 0; i < this.methods.length; i++) {
      if (this.methods[i].methodName === iterativeMethod.requestIterativeMethod) {
        console.log(iterativeMethod,index)
        // this.responseValidationData.values[index] iterativeMethod.type = this.methods[i].type;
        // iterativeMethod.positiveNlpData=this.methods[i].positiveNlpData;
        // iterativeMethod.negativeNlpData=this.methods[i].negativeNlpData
        this.responseValidationData.values[index].type = this.methods[i].type;
        this.responseValidationData.values[index].positiveNlpData=this.methods[i].positiveNlpData;
        this.responseValidationData.values[index].negativeNlpData=this.methods[i].negativeNlpData;
        this.responseValidationData.values[index].value="";
      }
    }
  }

   /*logic description: calling this when click on ',' or enter keys that add value into chip
   and adding into main array
   */
  addType4ValueToList() {
    console.log("addType4ValueToList",this.type4Value )
    this.responseValidationData.values = this.type4Value;
  }

   /*logic description: getter is calling automatically for validating the form is valid/invalid
   */
  get isFormValid() {
    if (this.responseValidationData.type == 1) {
      if(this.displayResponseTimeValid){
      return (this.responseValidationData.requestMethod
              && this.responseValidationData.values);
      }else{
        return (this.responseValidationData.requestMethod
          && this.responseValidationData.values &&
          this.responseValidationData.jsonPath);
      }
      // return (this.responseValidationData.requestMethod
      //   && this.responseValidationData.values &&
      //   this.responseValidationData.jsonPath);
    }
    else if (this.responseValidationData.type == 4) {
      if(this.displayResponseTimeValid){
        // if(Array.isArray(this.responseValidationData.values)){
        //   return (this.responseValidationData.requestMethod
        //     && this.responseValidationData.values.length > 1)
        // }else{
        //   return (this.responseValidationData.requestMethod
        //     && this.responseValidationData.values!=null)
        // }
        return (this.responseValidationData.requestMethod
           && this.responseValidationData.values.length > 1)
        }else{

          return (this.responseValidationData.requestMethod
            && this.responseValidationData.jsonPath && this.responseValidationData.values.length > 1)
        }
      // return (this.responseValidationData.requestMethod
      //   && this.responseValidationData.jsonPath && this.responseValidationData.values.length > 1)
    }
    else if (this.responseValidationData.type == 2) {
      var flag;
      console.log(this.responseValidationData)
      if(this.displayResponseTimeValid){
        if (this.responseValidationData.requestMethod &&
           (this.responseValidationData.values.length >= 1)){
            for (let i = 0; i < this.responseValidationData.values.length; i++) {
              console.log(this.responseValidationData.values[i].requestIterativeMethod,this.responseValidationData.values[i].value)
              if(this.responseValidationData.values[i].type==1){
              if(this.responseValidationData.values[i].requestIterativeMethod!=""&&this.responseValidationData.values[i].value!="")
              {
                flag=true;
                if(i==this.responseValidationData.values.length-1){
                  return flag;
                }
              }else{
                flag=false;
                return flag;
              }
            }
            else{
              if(this.responseValidationData.values[i].requestIterativeMethod!="")
              {
                flag=true;
                if(i==this.responseValidationData.values.length-1){
                  return flag;
                }
              }else{
                flag=false;
                return flag;
              }
            }
            }
           }else{
            return false;
           }
        }else{
          if (this.responseValidationData.requestMethod
            && this.responseValidationData.jsonPath &&
             (this.responseValidationData.values.length >= 1)){
              for (let i = 0; i < this.responseValidationData.values.length; i++) {
                console.log(this.responseValidationData.values[i].requestIterativeMethod,this.responseValidationData.values[i].value)
                if(this.responseValidationData.values[i].type==1){
                if(this.responseValidationData.values[i].requestIterativeMethod!=""&&this.responseValidationData.values[i].value!="")
                {
                  flag=true;
                  if(i==this.responseValidationData.values.length-1){
                    return flag;
                  }
                }else{
                  flag=false;
                  return flag;
                }
              }
              else{
                if(this.responseValidationData.values[i].requestIterativeMethod!="")
                {
                  flag=true;
                  if(i==this.responseValidationData.values.length-1){
                    return flag;
                  }
                }else{
                  flag=false;
                  return flag;
                }
              }
              }
             }else{
              return false;
             }
        }
    //  if (this.responseValidationData.requestMethod
    //     && this.responseValidationData.jsonPath &&
    //      (this.responseValidationData.values.length >= 1)){
    //       for (let i = 0; i < this.responseValidationData.values.length; i++) {
    //         console.log(this.responseValidationData.values[i].requestIterativeMethod,this.responseValidationData.values[i].value)
    //         if(this.responseValidationData.values[i].type==1){
    //         if(this.responseValidationData.values[i].requestIterativeMethod!=""&&this.responseValidationData.values[i].value!="")
    //         {
    //           flag=true;
    //           if(i==this.responseValidationData.values.length-1){
    //             return flag;
    //           }
    //         }else{
    //           flag=false;
    //           return flag;
    //         }
    //       }
    //       else{
    //         if(this.responseValidationData.values[i].requestIterativeMethod!="")
    //         {
    //           flag=true;
    //           if(i==this.responseValidationData.values.length-1){
    //             return flag;
    //           }
    //         }else{
    //           flag=false;
    //           return flag;
    //         }
    //       }
    //       }
    //      }else{
    //       return false;
    //      }
    }
    else if (this.responseValidationData.type == 3) {
      if(this.displayResponseTimeValid){
        return (this.responseValidationData.requestMethod)
        }else{
          return (this.responseValidationData.requestMethod
            && this.responseValidationData.jsonPath)
        }
      // return (this.responseValidationData.requestMethod
      //   && this.responseValidationData.jsonPath)
    }
  }

   /*logic description: checking that is editing or new one
   */
  get isEdit() {
    return (typeof this.validationEdit != 'undefined');
  }

  // @Input()OpenModal:boolean=false;
  OpenResponseModal(mode?:string){
    // this.OpenModal=true;
    console.log(mode);
    this.responseValidationData.requestMethod = '';
    this.responseValidationData.jsonPath = '';
    this.responseValidationData.type =1;
    this.responseValidationData.not =false;
    this.responseValidationData.values = [];
    this.iterativeDataList = [{
      "requestIterativeMethod": '',
      "value": '',
      "not": false,
      "type": 1
    }];
    this.type4Value = [];
    this.type4DataList = [];
    this.validationEdit = undefined;
    if(mode=='open'){
      return document.getElementById("generateResponseModal").click();
    }
    // return document.getElementById("generateResponseModal").click();
  }

  CloseResponseModal(){
    // this.OpenModal=true;
    return document.getElementById("closeResponseModal").click();
  }
  
   /*logic description: calling this when click on close modal, checking that edit/newly added,
      removing the values when close the validation modal and removing the validation list and sessionStorage vales
   */
  closeResModal(){
    console.log("closeResModal",JSON.parse(sessionStorage.getItem('HasValues')),
    JSON.parse(sessionStorage.getItem('IterativeValues')),JSON.parse(sessionStorage.getItem('responseValidationData')))
    if(!this.isEdit){
      this.OpenResponseModal();
    }else{
      console.log(this.responseValidationData.type)
    if(this.responseValidationData.type==4){
      if(JSON.parse(sessionStorage.getItem('responseValidationData'))!=null){
        this.responseValidationData=JSON.parse(sessionStorage.getItem('responseValidationData'));
        console.log(this.validationEdit)
        this.validationsList.splice(this.validationEdit, 1, { ...this.responseValidationData });
        this.validationEdit = undefined;
        sessionStorage.removeItem('responseValidationData')
      }else{
      this.responseValidationData.values=JSON.parse(sessionStorage.getItem('HasValues'));
      this.validationsList.splice(this.validationEdit, 1, { ...this.responseValidationData });
      this.validationEdit = undefined;
      sessionStorage.removeItem('HasValues')
      }
    }
    if(this.responseValidationData.type==2){
      if(JSON.parse(sessionStorage.getItem('responseValidationData'))!=null){
        this.responseValidationData=JSON.parse(sessionStorage.getItem('responseValidationData'));
        console.log(this.validationEdit)
        this.validationsList.splice(this.validationEdit, 1, { ...this.responseValidationData });
        this.validationEdit = undefined;
        sessionStorage.removeItem('responseValidationData')
      }else{
      this.responseValidationData.values.forEach((e,i,arr)=>{
        if(e.type!=3&&e.requestIterativeMethod==""&&e.value==""){
          this.responseValidationData.values.splice(i,1)
        }
        // if(i==arr.length-1){
          console.log("last",i)
          this.responseValidationData.values.forEach((f,j,Arr)=>{
          if(f.type!=3&&f.requestIterativeMethod==""&&f.value==""){
            this.responseValidationData.values.splice(j,1)
          }
        })
          console.log("type 2",this.responseValidationData)
        // }
      });
    
      this.responseValidationData.values=JSON.parse(sessionStorage.getItem('IterativeValues'));
      this.validationsList.splice(this.validationEdit, 1, { ...this.responseValidationData });
      this.validationEdit = undefined;
      sessionStorage.removeItem('IterativeValues')
    }
    }
    // sessionStorage.removeItem('HasValues')
    // sessionStorage.removeItem('IterativeValues')
    // sessionStorage.removeItem('responseValidationData')

    // if(this.responseValidationData.type==1||this.responseValidationData.type==3){
    //   this.responseValidationData=JSON.parse(sessionStorage.getItem('responseValidationData'));
    //   console.log(this.validationEdit)
    //   this.validationsList.splice(this.validationEdit, 1, { ...this.responseValidationData });
    //   this.validationEdit = undefined;
    //   sessionStorage.removeItem('responseValidationData')
    // }

  }
  }

 /*logic description: calling this when click on 'X' of iterative method and removing the object from array
   */
  removeIterative(i){
    if(this.responseValidationData.values.length>1){
      this.responseValidationData.values.splice(i,1);
    }
    console.log(i,this.responseValidationData.values);
  }

}
