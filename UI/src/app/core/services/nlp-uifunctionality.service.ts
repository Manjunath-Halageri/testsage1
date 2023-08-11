import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NlpUIFunctionalityService {
  constructor() { }
  highLightNlpEditServiceCall(nlpIndex) {
    return nlpIndex;
  }
  highLightManualEditServiceCall(manualIndex) {
    return manualIndex;
  }
  nlpAddServiceCall(nlpSelectedForEdit) {
    if (nlpSelectedForEdit === 0) {
      document.getElementById("openModalButtonNlp").click();
    }
    return;
  }
  manualAddServiceCall(manualSelectedForEdit) {
    if (manualSelectedForEdit === 0) {
      document.getElementById("openModalButton").click();
    }
    return;
  }

  userAlert() {
    alert("Please Select Row");
    return;
  }
}
