import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})

export class ValidationserviceService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': 'Required',
      'invalidCreditCard': 'Is invalid credit card number',
      'invalidEmailAddress': 'Invalid email address',
      'specialcharacters': 'special characters Not Allowed',
      'specialcharacters&numbers': 'Special char and Numbers not Allowed',
      'Digits': 'Only digits are allowed',
      'Version': 'Enter valid version',
      'date_format': 'Enter valid date',
      'time_format': 'Enter valid time',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'maxlength': `Maximum length ${validatorValue.requiredLength}`,
      'phoneNumber': 'Enter Numbers',
      'Number':'Number should between 10 to 25',
      'initial':'Initial character should be alphabet',
      'defectId':'Invalid defectID format'
    };

    return config[validatorName];
  }

  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return { 'invalidCreditCard': true };
    }
  }
  /////////////obj-repo///////////// (/^[a-zA-Z0-9][a-zA-Z0-9]*$/)
  static objrepoCreatePage(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/^[^~!@#$%^&*()_+{}[\];:'",.<>?\/`0-9\s][a-zA-Z0-9]*$/)) {
      return null;
    } 
    else if ((control.value.match(/^[0-9]/))) {
      return { 'initial': true };
    }
    else  {
      return { 'specialcharacters': true };
    }
  }
  ///////////obj-repo end//////////////////////////
  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }
  static Project_Name(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/^[a-zA-Z0-9][a-zA-Z0-9 ]*$/)) {
      return null;
    } else {
      return { 'specialcharacters': true };
    }
  }
   // ///////////////////create test case//////////////////////code.match(/^[^0-9\s][a-zA-Z0-9]*$/))
   static ctc_Name(control) {
    var code = control.value;
    if (control.value !== undefined || control.value !== null) {
      if (((typeof code) === 'string') && code.match(/^[^~!@#$%^&*()_+{}[\];:'",.<>?\/`0-9\s][a-zA-Z0-9]*$/)) {
        return null;
      }else if (((typeof code) === 'string') && code.match(/^[0-9]/)) {
        return { 'initial': true };
      }
      else {
        return { 'specialcharacters': true };
      }
    }else{
      return null
    }
  }
  ///////////////////////////////////////////////////////////////////////
  static suitecreate(control) {
    // RFC 2822 compliant regex
    // console.log(control.value)
    var code = control.value;
    if (control.value !== undefined || control.value !== null) {
      if (((typeof code) === 'string') && code.match(/^[^~!@#$%^&*()_+{}[\];:'",.<>?\/`\s][a-zA-Z0-9]*$/)) {
         return null;
      }
      else {
        return { 'specialcharacters': true };
      }
    }else{
      return null
    }
    // if (control.value !== null) {
    //   if (control.value.match(/^[a-zA-Z][a-zA-Z]*$/)) {
    //     return null;
    //   } else {
    //     return { 'specialcharacters': true };
    //   }
    // }
  }

  static scheduleCreate(control) {
    // RFC 2822 compliant regex
    // console.log(control.value)
    var code = control.value;
    console.log(code)
    if (control.value !== undefined || control.value !== null) {
    console.log(((typeof code) === 'string') && code.match(/^[^~!@#$%^&*()_+{}[\];:'",.<>?\/`\s][a-zA-Z0-9]*$/))
      if (((typeof code) === 'string') && code.match(/^[^~!@#$%^&*()_+{}[\];:'",.<>?\/`\s][a-zA-Z0-9]*$/)) {
        return null;
      }
      else {
        return { 'specialcharacters': true };
      }
    }else{
      return null
    }
    // if (control.value !== null) {
    //   if (control.value.match(/^[a-zA-Z][a-zA-Z]*$/)) {
    //     return null;
    //   } else {
    //     return { 'specialcharacters': true };
    //   }
    // }
  }

  static desccreate(control) {
    // RFC 2822 compliant regex
    // console.log(control.value)
    if (control.value !== null) {
      if (control.value.match(/^[a-zA-Z0-9][a-zA-Z0-9 ]*$/)) {
        return null;
      } else {
        return { 'specialcharacters': true };
      }
    }
  }

  static timecreate(control) {
    // RFC 2822 compliant regex
   // console.log(control.value)
    if (control.value.match(/^1\d|2[0-5]/)) {
      return null;
    }
     else{
      return { 'Number': true };
    }
  
  }
  // /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  static Namevalid(control) {
    // RFC 2822 compliant regex   code-----(/^[a-zA-Z0-9!@#$%^&*()]+$/)
    if (control.value.match(/^[a-zA-Z0-9]+$/)) {
      return null;
    } else {
      return { 'specialcharacters': true };
    }
  }
  static userFormvalidation(control) {
    if (control.value !== undefined) {
      if (control.value.match(/^[1-9][0-9]*$/)) {
        return null;
      } else {
        return { 'Digits': true };
      }
    }
  }

  static onlychar(control) {
    if (control.value.match(/^[a-zA-Z]+$/)) {
      return true;
    } else {
      return { 'specialcharacters&numbers': true };
    }
  }
  static Numvalid(control) {
    if (control.value !== undefined) {
      if (control.value.match(/^[1-9][0-9]*$/)) {
        return null;
      } else {
        return { 'Digits': true };
      }
    }
  }

  //////////////////////////////////////////////////////////////////////

  static requirementName(control) {
    // RFC 2822 compliant regex   code-----(/^[a-zA-Z0-9!@#$%^&*()]+$/)
    console.log(control.value)
    if (control.value !== null) {
      if (control.value.match(/^[a-zA-Z][a-zA-Z ]+$/)) {
        return null;
      } else {
        return { 'specialcharacters': true };
      }
    }
  }


  /////////////////////////////////////////////////////////////////////////


  static releaseVers(control) {
    // RFC 2822 compliant regex   code-----(/^[a-zA-Z0-9!@#$%^&*()]+$/)
    var code = control.value;
    if (control.value !== undefined || control.value !== null) {
      if (((typeof code) === 'string') && code.match(/^[^~!@#$%^&*()_+{}[\];:'",<>?\/`\s][a-zA-Z0-9.]*$/)) {
        return null;
      }
      else {
        return { 'specialcharacters': true };
      }
    }else{
      return null
    }
    // if (control.value !== undefined || control.value !== null) {
    //   if (((typeof code) === 'string') && code.match(/^[a-zA-Z0-9][a-zA-Z0-9 .]+$/)) {
    //     return null;
    //   } else {
    //     return { 'specialcharacters': true };
    //   }
    // }
  }
  
  static mycall(x,y) {
    console.log(x,y)
  }
  static Version(control) {
    if (control.value !== null) {
      if (control.value.match(/[0-9]+.[0-9]+\.[0-9]+$/)) {
        return null;
      } else {
        return { 'Version': true };
      }
    }
  }

  /////////////project select////////////////
  static timevalid(control) {
    if (control.value !== null) {
      if (control.value.match(/^[1-9][0-9]*$/)) {
        return null;
      } else {
        return { 'Digits': true };
      }
    }
  }

  static date(control) {
    // RFC 2822 compliant regex
    if (control.value.match(
      "^((2000|2400|2800|(19|2[0-9](0[48]|[2468][048]|[13579][26])))-02-29)$"
      + "|^(((19|2[0-9])[0-9]{2})-02-(0[1-9]|1[0-9]|2[0-8]))$"
      + "|^(((19|2[0-9])[0-9]{2})-(0[13578]|10|12)-(0[1-9]|[12][0-9]|3[01]))$"
      + "|^(((19|2[0-9])[0-9]{2})-(0[469]|11)-(0[1-9]|[12][0-9]|30))$")) {
      return null;
    } else {
      return { 'date_format': true };
    }
  }

  static check_phone(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/^[1-9+][0-9]*$/)) {
      return true;
    } else {
      return { 'phoneNumber': true };
    }
  }


  static time(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/^[0-9\+]{1,}[0-9\-]{3,15}$/)) {
      return null;
    } else {
      return { 'time_format': true };
    }
  }


  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9! @#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }

  static defectIDValidator(control){
    var code = control.value;
    // console.log(code)
    if (control.value !== undefined || control.value !== null) {
      if (((typeof code) === 'string') && code.match(/^dID+\d/)) {
        return null;
      }
      else {
        return { 'defectId': true };
      }
    }
    // else{
    //   return null
    // }
  }

}

