import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ApiComponentCommunicationService {

  constructor() { }
  ////////////////// Not Using Start /////////////////
  private defaultView = new BehaviorSubject<boolean>(false);
  currentState = this.defaultView.asObservable();
  enableModuleView(viewState) {
    this.defaultView.next(viewState)
  }

  private moduleEdit = new BehaviorSubject<Object>({});
  currentModuleEdit = this.moduleEdit.asObservable();
  enableModuleEdit(viewState) {
    this.moduleEdit.next(viewState)
  }

  private defaultViewFearure = new BehaviorSubject<Object>({});
  currentStateFeature = this.defaultViewFearure.asObservable();
  enableFeatureView(viewState) {
    this.defaultViewFearure.next(viewState)
  }

  private featureEdit = new BehaviorSubject<Object>({});
  currentFeatureEdit = this.featureEdit.asObservable();
  enableFeatureEdit(viewState) {
    this.featureEdit.next(viewState)
  }

  private defaultViewScript = new BehaviorSubject<Object>({});
  currentStateScript = this.defaultViewScript.asObservable();
  enableScriptView(viewState) {
    this.defaultViewScript.next(viewState)
  }

  private defaultViewScriptEdit = new BehaviorSubject<Object>({});
  currentStateScriptEdit = this.defaultViewScriptEdit.asObservable();
  enableEditScriptView(viewState) {
    this.defaultViewScriptEdit.next(viewState)
  }

  ////////////////// Not Using END /////////////////

  /* logic description: setting the defaultViewManual object for opening script
 */
  private defaultViewManual = new BehaviorSubject<Object>({});
  currentStateManual = this.defaultViewManual.asObservable();
  enableManualView(viewState) {
    this.defaultViewManual.next(viewState)
  }

  /* logic description: setting the defaultCrumbItems object while opening script setting names and Id's
    */
  private defaultCrumbItems = new BehaviorSubject<Object>([]);
  currentCrumbItems = this.defaultCrumbItems.asObservable();
  setCrumbItems(viewState) {
    this.defaultCrumbItems.next(viewState)
  }

  ////////////////////////////////////// NEW Code Start /////////////////////////////////////

  /* logic description: setting the ModuleValue object for open create module
  */
  public moduleViewValue: any;
  enableModuleOpenValue(moduleValue) {
    this.moduleViewValue = moduleValue;
    this.featureViewValue = { "flag": true };
    this.scriptOpenValue = { "flag": true };
  }

  /* logic description: setting the FeatureValue object for open create feature
 */
  public featureViewValue: any;
  enableFeatureOpenValue(featureValue) {
    this.featureViewValue = featureValue;
    this.moduleViewValue = { "flag": false };
    this.scriptOpenValue = { "flag": true };
  }

  /* logic description: setting the ScriptValue object for open script feature
 */
  public scriptOpenValue: any;
  enableScriptOpenValue(scriptValue) {
    this.scriptOpenValue = scriptValue;
    this.moduleViewValue = { "flag": false };
    this.featureViewValue = { "flag": false };
  }

  /* logic description: setting the mEditValue object for edit module
 */
  public moduleEditValue: any;
  enableModuleEditValue(mEditValue) {
    this.moduleEditValue = mEditValue;
    this.moduleViewValue = { "flag": false };
    this.featureViewValue = { "flag": false };
    this.scriptOpenValue = { "flag": false };
  }

  /* logic description: setting the eEditValue object for edit feature
 */
  public featureEditValue: any;
  enablefeatureEditValue(fEditValue) {
    this.featureEditValue = fEditValue;
    this.moduleViewValue = { "flag": false };
    this.featureViewValue = { "flag": false };
    this.scriptOpenValue = { "flag": false };
    this.moduleEditValue = { "flag": false };
  }

  /* logic description: setting the ScriptValue object for edit script
 */
  public scriptEditValue: any;
  enablescriptEditValue(sEditValue) {
    this.scriptEditValue = sEditValue;
    this.moduleViewValue = { "flag": false };
    this.featureViewValue = { "flag": false };
    this.scriptOpenValue = { "flag": false };
    this.moduleEditValue = { "flag": false };
    this.featureEditValue = { "flag": false };
  }

  //////////////////////// End of New Code ////////////////////////////////////

}
