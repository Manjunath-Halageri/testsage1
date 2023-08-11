import { J } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CtcValidationService {
  javaKeyWords: any;
  dataType: any;

  constructor() {
    this.javaKeyWords = ['abstract', 'assert', 'boolean', 'break',
      'byte', 'case', 'catch', 'char',
      'class', 'const', 'continue', 'default',
      'do', 'double', 'else', 'enum',
      'extends', 'final', 'finally', 'float',
      'for', 'goto', 'if', 'implements',
      'import', 'instanceof', 'int', 'interface',
      'long', 'native', 'new', 'package',
      'private', 'protected', 'public', 'return',
      'short', 'static', 'strictfp', 'super',
      'switch', 'synchronized', 'this', 'throw',
      'throws', 'transient', 'try', 'void',
      'volatile', 'while', 'true', 'false',
      'null', 'count']

    this.dataType = ['String', 'int', 'float', 'boolean']
  }

  varDeclareValid(varObj): object { //This function is for validating variable declarations
    let flag = {
      'vName': [],
      'dValue': [],
      'state': true
    };
    varObj.forEach((element, index) => {
      if (element.variableAddFun === '' || element.variableAddFun === undefined) {
        alert('Please Enter Variable Name')
        flag.state = false
      } else {
        let regexp = /^[a-zA-Z_$][A-Za-z0-9_]*$/  //checking variable name as per variable declaration rules in java
        if (!regexp.test(element.variableAddFun)) {
          alert('Enter valid variable name');
          flag['vName'].push(index);
          flag['state'] = false
        }
      }
      if (flag.state && (element.variableType === '' || element.variableType === undefined)) {
        alert('Please select variable type ')
        flag.state = false
      } else if ((element.variableType !== '' || element.variableType !== undefined) &&
        (element.variableDefaultValue !== undefined)) {
        if (element.variableType === 'int') {
          if (element.variableDefaultValue.match(/[^0-9]/)) { //validating default value for int type
            alert('Default value must match variable type')
            flag['dValue'].push(index);
            flag['state'] = false
          }
        } else if (element.variableType === 'boolean') { // validating default value for boolean type
          if (!(element.variableDefaultValue === 'true' || element.variableDefaultValue === 'false')) {
            alert('Default value must match variable type')
            flag['dValue'].push(index);
            flag['state'] = false;
          }
        }
      }
      else { }

    });
    console.log(flag);
    return flag

  }

  createStepValidate(validator, stepObj) {
    console.log(validator);
    console.log(stepObj);
    let flag = {
      'state': true,
    }
    if (stepObj.Groups !== "User Function") {
      if (stepObj.Groups === '' || stepObj.Groups === undefined) {
        alert('Please select Group')
        flag.state = false
      } else if (stepObj.ActionList === '' || stepObj.ActionList === undefined) {
        alert('Please select Action From Actionlist')
        flag.state = false
      } else if (validator[0].returnValue === 'yes') {
        if (stepObj.ReturnsValue === '' || stepObj.ReturnsValue === undefined) {
          alert('Please Select Return value')
          flag.state = false
        }
      } else { }

      if (flag.state && validator[0].object === 'yes') {
        if (stepObj.Page === '' || stepObj.Page === undefined) {
          alert('Please select Page and Object ')
          flag.state = false
        }
      }

      if (flag.state && validator[0].inputField2 === 'yes') {
        if (stepObj.Input2 === '' || stepObj.Input2 === undefined) {
          alert('Please select or Enter value in input2 ')
          flag.state = false
        }
      }

      if (flag.state && validator[0].inputField3 === 'yes') {
        if (stepObj.Input3 === '' || stepObj.Input3 === undefined) {
          alert('Please select or Enter value in input3 ')
          flag.state = false
        }
      }

      return flag
    }
    else {
      return flag;
    }
  }


  servicedisplayActionArrayData = [];
  mainCall(displayActionArrayData) {
    console.log("main calll")
    this.servicedisplayActionArrayData = displayActionArrayData;
    var ifCount = 0;
    var forCount = 0;
    // var ifSloved = false;
    var ifIndex = 0;
    var forIndex = 0;
    var ifEndCount = 0;
    var forEndCount = 0;
    var allowForLoop;
    var allForIfCond;
    var fromIfBlock;
    var formForBlock;
    displayActionArrayData.forEach((e, i, a) => {
      ifCount = 0 === e.Action.indexOf('If-Start') ? ++ifCount : ifCount;
      ifEndCount = 0 === e.Action.indexOf('If-End') ? ++ifEndCount : ifEndCount;
      forCount = 0 === e.Action.indexOf('For-Start') ? ++forCount : forCount;
      forEndCount = 0 === e.Action.indexOf('For-End') ? ++forEndCount : forEndCount;
      if (e.Action.indexOf('If-Start') === 0) {
        alert("if")
        // fromIfBlock = this.ifblock();
        return fromIfBlock
      }
      else if (e.Action.indexOf('For-Start') === 0) {
        alert("else if")
        //  this.forLoop()
        return false
      }
      // else{
      //   alert("else")
      //   return;
      // }
    })
    if (ifCount !== ifEndCount) {
      console.log("Please Close If Block Properly")
    }
    if (forCount !== forEndCount) {
      console.log("Please Close For Block Properly")
    }
    // console.log(forCount , forEndCount)
    // console.log(fromIfBlock,formForBlock)
  }

  forLoop(displayActionArrayData) {
    var vcheckForOther = false
    var ifEndBlock = {
      forStarts: 0,
      forEnds: 0,
      invalidStarts: 0,

    };

    // this.tempArray.push(obj1,obj2,obj3,obj4,obj5,obj6)
    // displayActionArrayData = this.tempArray;
    displayActionArrayData.forEach((e, i, a) => {
      ifEndBlock.forStarts = 0 === e.Action.indexOf('For-Start') ? +1 : ifEndBlock.forStarts;
      if (ifEndBlock.forStarts) {
        ifEndBlock.forEnds = 0 === e.Action.indexOf('For-End') ? +1 : ifEndBlock.forEnds;
      }
      if (ifEndBlock.forStarts === ifEndBlock.forEnds) {
        ifEndBlock.forStarts = ifEndBlock.forEnds = 0;
      }
    });
    if ((ifEndBlock.forStarts === ifEndBlock.forEnds)) {
      return true;
    }
    else {
      if (ifEndBlock.forStarts !== ifEndBlock.forEnds) {
        return (`Sorry Block Error...!!! For Block is not Closed Properly`)

      }
    }

  }


  ifblock(displayActionArrayData) {
    //  var displayActionArrayData = []
    var checkForOther = false;
    var ifEndBlock = {
      starts: 0,
      ends: 0,
      elseIfStarts: 0,
      elseIfEnds: 0,
      elseStarts: 0,
      elseEnds: 0,
      forStarts: 0,
      forEnds: 0,
      invalidStarts: 0,
      // checkForOther: Boolean = false
    };

    // this.tempArray.push(obj1,obj2,obj3,obj4,obj5,obj6)
    // displayActionArrayData = this.servicedisplayActionArrayData;

    displayActionArrayData.forEach((e, i, a) => {
      ifEndBlock.starts = 0 === e.Action.indexOf('If-Start') ? +1 : ifEndBlock.starts;
      ifEndBlock.ends = 0 === e.Action.indexOf('If-End') ? +1 : ifEndBlock.ends;
      if (displayActionArrayData[i].Action === 'If-End') {
        if (i !== displayActionArrayData.length - 1) {
          ifEndBlock.elseIfStarts = 0 === displayActionArrayData[i + 1].Action.indexOf('ElseIf-Start') ? +1 : ifEndBlock.elseIfStarts
          ifEndBlock.elseStarts = 0 === displayActionArrayData[i + 1].Action.indexOf('Else-Start') ? +1 : ifEndBlock.elseStarts
          if (!(!displayActionArrayData[i + 1].Action.indexOf('ElseIf-Start') || !displayActionArrayData[i + 1].Action.indexOf('Else-Start'))) {
            checkForOther = true;
          }
        }
      }
      if (ifEndBlock.starts) {
        if (e.Action.indexOf('For-Start') === 0) {
          // console.log("inside for start")
          if (this.forLoop(displayActionArrayData)) { ifEndBlock.ends = 0 === e.Action.indexOf('If-End') ? +1 : ifEndBlock.ends }
        }
        else {
          ifEndBlock.ends = 0 === e.Action.indexOf('If-End') ? +1 : ifEndBlock.ends;
        }
      }
      // console.log(ifEndBlock.elseIfStarts+"ifEndBlock.elseIfStarts")
      if (ifEndBlock.elseIfStarts) {
        if (e.Action.indexOf('For-Start') === 0) {
          if (this.forLoop(displayActionArrayData)) { ifEndBlock.elseIfEnds = 0 === e.Action.indexOf('ElseIf-End') ? +1 : ifEndBlock.elseIfEnds }
        }
        else {
          ifEndBlock.elseIfEnds = 0 === e.Action.indexOf('ElseIf-End') ? +1 : ifEndBlock.elseIfEnds;
        }

      }
      if (ifEndBlock.elseIfEnds) {
        if (i !== displayActionArrayData.length - 1) {
          ifEndBlock.elseStarts = 0 === displayActionArrayData[i + 1].Action.indexOf('Else-Start') ? +1 : ifEndBlock.elseStarts
        }
      }
      if (ifEndBlock.elseStarts) {
        if (e.Action.indexOf('For-Start') === 0) {
          if (this.forLoop(displayActionArrayData)) { ifEndBlock.elseEnds = 0 === e.Action.indexOf('Else-End') ? +1 : ifEndBlock.elseEnds; }
        }
        else {
          ifEndBlock.elseEnds = 0 === e.Action.indexOf('Else-End') ? +1 : ifEndBlock.elseEnds;
        }


      }
      if (checkForOther) {
        // console.log("illegal start")
        ifEndBlock.invalidStarts = 0 === e.Action.indexOf('ElseIf-Start') ? +1 : ifEndBlock.invalidStarts;
        ifEndBlock.invalidStarts = 0 === e.Action.indexOf('Else-Start') ? +1 : ifEndBlock.invalidStarts;
        // console.log(ifEndBlock.invalidStarts)
      }
      if ((ifEndBlock.starts === ifEndBlock.ends) && (ifEndBlock.starts === ifEndBlock.elseStarts) && (ifEndBlock.elseIfStarts === ifEndBlock.elseIfEnds) && (ifEndBlock.elseStarts === ifEndBlock.elseEnds) && (ifEndBlock.invalidStarts !== 1)) {
        ifEndBlock.starts = ifEndBlock.ends = 0;
        ifEndBlock.elseIfStarts = ifEndBlock.elseIfEnds = 0;
        ifEndBlock.elseStarts = ifEndBlock.elseEnds = 0
      }
    });
    
    if ((ifEndBlock.starts === ifEndBlock.ends) && (ifEndBlock.starts === ifEndBlock.elseStarts) &&(ifEndBlock.elseIfStarts === ifEndBlock.elseIfEnds) && (ifEndBlock.elseStarts === ifEndBlock.elseEnds) && (ifEndBlock.invalidStarts !== 1)) {
      // console.log("If Block is Valid")
      return true;
    }
    else {
      if (ifEndBlock.starts !== ifEndBlock.ends) {
        return `Sorry Block Error...!!! If Block is not Closed Properly`;
        // return false;
      }
      if (ifEndBlock.elseIfStarts !== ifEndBlock.elseIfEnds) {
        return `Sorry Block Error...!!! Else-If Block is not Closed Properly`;
        //  return false;
      }
      if (ifEndBlock.elseStarts !== ifEndBlock.elseEnds) {
        return `Sorry Block Error...!!! Else Block is not Closed Properly`;
        // return false;
      }
      if (ifEndBlock.starts !== ifEndBlock.elseStarts) {
        return `Sorry Block Error...!!! Else Block is not Present`;
        // return false;
      }
      if (ifEndBlock.invalidStarts === 1) {
        return `Sorry Block Error...!!! Illegal Start of Else-If or Else Block`;
        //  return false;
      }
    }

  }

  conditionalBlcokValidation(displayActionArrayData) {
    var checkForOther: boolean = false;
    var ifEndBlock = {
      starts: 0,
      ends: 0,
      elseIfStarts: 0,
      elseIfEnds: 0,
      elseStarts: 0,
      elseEnds: 0,
      forStarts: 0,
      forEnds: 0,
      invalidStarts: 0
    };
    displayActionArrayData = this.servicedisplayActionArrayData;

    displayActionArrayData.forEach((e, i, a) => {
      ifEndBlock.starts = 0 === e.Action.indexOf('If-Start') ? +1 : ifEndBlock.starts;
      ifEndBlock.ends = 0 === e.Action.indexOf('If-End') ? +1 : ifEndBlock.ends;
      if (displayActionArrayData[i].Action === 'If-End') {
        if (i !== displayActionArrayData.length - 1) {
          ifEndBlock.elseIfStarts = 0 === displayActionArrayData[i + 1].Action.indexOf('ElseIf-Start') ? +1 : ifEndBlock.elseIfStarts
          ifEndBlock.elseStarts = 0 === displayActionArrayData[i + 1].Action.indexOf('Else-Start') ? +1 : ifEndBlock.elseStarts
          if (!(!displayActionArrayData[i + 1].Action.indexOf('ElseIf-Start') || !displayActionArrayData[i + 1].Action.indexOf('Else-Start'))) {
            checkForOther = true;
          }
        }
      }
      if (ifEndBlock.elseIfStarts) {
        ifEndBlock.elseIfEnds = 0 === e.Action.indexOf('ElseIf-End') ? +1 : ifEndBlock.elseIfEnds;
      }
      if (ifEndBlock.elseIfEnds) {
        if (i !== displayActionArrayData.length - 1) {
          ifEndBlock.elseStarts = 0 === displayActionArrayData[i + 1].Action.indexOf('Else-Start') ? +1 : ifEndBlock.elseStarts
        }
      }
      if (ifEndBlock.elseStarts) {
        ifEndBlock.elseEnds = 0 === e.Action.indexOf('Else-End') ? +1 : ifEndBlock.elseEnds;

      }
      if (checkForOther) {
        ifEndBlock.invalidStarts = 0 === e.Action.indexOf('ElseIf-Start') ? +1 : ifEndBlock.invalidStarts;
        ifEndBlock.invalidStarts = 0 === e.Action.indexOf('Else-Start') ? +1 : ifEndBlock.invalidStarts;
      }
      if ((ifEndBlock.starts === ifEndBlock.ends) && (ifEndBlock.elseIfStarts === ifEndBlock.elseIfEnds) && (ifEndBlock.elseStarts === ifEndBlock.elseEnds) && (ifEndBlock.invalidStarts !== 1)) {
        ifEndBlock.starts = ifEndBlock.ends = 0;
        ifEndBlock.elseIfStarts = ifEndBlock.elseIfEnds = 0;
        ifEndBlock.elseStarts = ifEndBlock.elseEnds = 0
      }
    });
    if ((ifEndBlock.starts === ifEndBlock.ends) && (ifEndBlock.elseIfStarts === ifEndBlock.elseIfEnds) && (ifEndBlock.elseStarts === ifEndBlock.elseEnds) && (ifEndBlock.invalidStarts !== 1)) {
      return true;
    }
    else {
      if (ifEndBlock.starts !== ifEndBlock.ends) {
        return `Sorry Block Error...!!! If Block is not Closed Properly`;
      }
      if (ifEndBlock.elseIfStarts !== ifEndBlock.elseIfEnds) {
        return `Sorry Block Error...!!! Else-If Block is not Closed Properly`;
      }
      if (ifEndBlock.elseStarts !== ifEndBlock.elseEnds) {
        return `Sorry Block Error...!!! Else Block is not Closed Properly`;
      }
      if (ifEndBlock.invalidStarts === 1) {
        return `Sorry Block Error...!!! Improper Use of Else-If or Else Block`;
      }
    }
  }

  intializedVar: any;
  forLoopSyntax(str) {
    let arr = [3];
    let semicolon = 0, flag = 0;
    let i;
    for (i = 0; i < 3; i++)
      arr[i] = str[i];
    while (i != (str.length)) {
      let ch = str[i++];
      if (ch == ';') {
        semicolon++;
      }
      else continue;
    }
    if (semicolon != 2) {
      flag++;
      return "Sorry Syntax Error...!!! Semicolon Miss Matching";

    }

    if (flag == 0)
      return this.intializationBlockCheck(str);

  }
  intializationBlockCheck(str) {
    if (str.split(';')[0].includes('=')) {
      this.intializedVar = str.split(';')[0].split('=')[0];
      if (isNaN(str.split(';')[0].split('=')[1])) {
        return `Sorry Intialization Error...!!! Please intialize Variable with Numbers only`
      }
    }
    else { return `Sorry Intialization Error...!!! Please Use Assigment Operators Only` }
    return this.declarationBlockCheck(str);
  }
  declarationBlockCheck(str) {
    var conditionCheck = str.split(';')[1];
    if (conditionCheck.includes('<') || conditionCheck.includes('>') || conditionCheck.includes('=') || conditionCheck.includes('!')) {
      return this.incrementDecrementCheck(str);
    }
    else {
      return `Sorry Declaration Error...!!! Please Use Comparsion Operators Only`
    }
  }
  incrementDecrementCheck(str) {
    var validationObj = {};
    var conditionCheck = str.split(';')[2];
    if (conditionCheck.includes('+') || conditionCheck.includes('-')) {
      var varCheck: any;
      if (conditionCheck.includes('+')) { varCheck = conditionCheck.split('+')[0] }
      else if (conditionCheck.includes('-')) { varCheck = conditionCheck.split('-')[0] }
      if (varCheck === this.intializedVar) {
        validationObj['Status'] = true;
        validationObj['variable'] = this.intializedVar;

        return validationObj;
      }
      else { return `Sorry Variable Error...!!! Intialized and Increment Or Decerement variable Should be Same` }
    }
    else {
      return `Sorry Increment Or Decrement Error...!!! Please Use Increment and Decrement  Operators Only`
    }
  }

  reusableFunctionValidation(reuseParams, object) {
    if (object.inputField2 !== 'no') { var reusableData = reuseParams.nlpInput2.split(','); }
    var flag = "true";
    if (object.inputField2 !== 'no') {
      if (reusableData.length === object.finalData.reuseableParameterLength && reusableData !== undefined) {
        object.finalData.reuseableData.reuseAbleParameters.split(',').forEach((e, i, a) => {
          let param = e.trim();
          if (param.split(' ')[0] === `String`) {
            if ((param.split(' ')[0].toUpperCase() === (typeof reusableData[i]).toUpperCase()) &&
              !isNaN(reusableData[i])) return flag = `Sorry Parameter Error...!!! Data Type Mis Match`;
          }
          else if (param.split(' ')[0] === `int`) {
            if (isNaN(reusableData[i])) return flag = `Sorry Parameter Error...!!! Data Type Mis Match`;

          }
          else {
            return flag = `Sorry Some Other Error`;
          }
        });
      }
      else { return flag = `Sorry Parameter Error...!!! Parameter Length Mis Match`; }
      return flag;
    }
    else {
      return flag;
    }
  }

  editReturnValidation(data, variableList) {
    var status;
    if (data.Action !== `If-Start` && data.Action !== `ElseIf-Start`) {
      var varFound = !!variableList.find(x => x.variableAddFun === data.ReturnsValue);
    }
    else if (data.Action === `If-Start` || data.Action === `ElseIf-Start`) {
      var varFound = !!variableList.find(x => x.variableAddFun === data.Input2);
    }
    else { return; }


    console.log(variableList)
    //  var varDataType = !!variableList.find(x => x.variableType === (typeof data.ReturnsValue));
    console.log(varFound)
    //  console.log( typeof data.ReturnsValue)
    // variableList.forEach(ele => {
    if (!varFound) {
      return status = `Please Declare Variable`
    }
    // else if( ele.variableType.toUpperCase() !== (typeof data.ReturnsValue).toUpperCase() ){
    //   return status = `Please Declare Variable Of Same Data Type`;
    // }
    else {
      return status = true;
    }
    // });
    return status;

  }

  dataTypes = [];
  variableNames = [];

  validateMethodName(reuseMethodName) {
    const pattern = /^[a-z][a-zA-Z0-9_]*$/g;
    var result = pattern.test(reuseMethodName)
    if (result === false)
      return "Method name should always start with lower case alphabet with no special characters.";
  }


  validateParameters(reusableParameters) {
    this.variableNames = []
    this.dataTypes = []
    let parameters = reusableParameters.split(',')
    for (var i = 0; i < parameters.length; i++) {
      let parameter1 = parameters[i].trim();
      let variable = parameter1.split(' ')
      console.log(variable)
      if (variable.length === 2) {
        this.dataTypes.push(variable[0])
        this.variableNames.push(variable[1])
        const pattern = /^[a-z_$][a-zA-Z0-9_]*$/g;
        var result = pattern.test(variable[1])
        if (result === false) {
          return "Variable Names Should not Start with a Digit or Capital Letter And It Should Not Have Any Special Characters"
        }
      }
      else {
        return "Invalid Parameters!!";
      }
    }
    return this.checkForDupVariables();
  }

  checkForDupVariables() {
    for (let j = 0; j < this.dataTypes.length; j++) {
      if (!this.dataType.includes(this.dataTypes[j])) {
        return "Invalid Data Type \'"+this.dataTypes[j]+"\'"
      }
    }
    for (let i = 0; i < this.variableNames.length; i++) {
      let keywordMatch = this.javaKeyWords.includes(this.variableNames[i]);
      console.log(keywordMatch)
      if (keywordMatch) {
        return "Java Keywords Cannot Be Used as Variable Names"
      }
    }
    var set = new Set(this.variableNames)
    if (set.size !== this.variableNames.length) {
      console.log(set)
      console.log(this.variableNames.length)
      set.clear
      return "Duplicate Variable Names Are Not Allowed"
    }
  }


  // forLoopSyntax(str){
  //  let arr = [3]; 
  //  let semicolon = 0, flag = 0; 
  //  let i; 
  //   for (i = 0; i < 3; i++) 
  //       arr[i] = str[i]; 
  //      while(i != (str.length)) 
  //   { 
  //      let ch = str[i++];  
  //        if(ch == ';') 
  //       { 
  //         semicolon ++; 
  //       } 
  //       else continue; 
  //   } 
  //   if(semicolon != 2) 
  //   {  
  //      flag++; 
  //      return "Semicolon Error"; 

  //   } 

  //   if(flag == 0) 
  //   return true;

  // }

}

// forLoopSyntax(str){
//   let arr = [3]; 
//      //semicolon, bracket1, bracket2 are used  
//        //to count frequencies of 
//    //';', '(', and ')' respectively 
//    //flag is set to 1 when an error is found, else no error 
//   let semicolon = 0, bracket1 = 0, bracket2 = 0, flag = 0; 

//    let i; 
//    for (i = 0; i < 3; i++) 
//        arr[i] = str[i]; 
//       while(i != (str.length)) 
//    { 
//        console.log(i)
//        console.log(str.length)
//       let ch = str[i++]; 
//        if(ch == '(') 
//        { 
//            //opening parenthesis count 
//            bracket1 ++; 
//        } 
//        else if(ch == ')') 
//        { 
//            //closing parenthesis count 
//            bracket2 ++; 

//        } 
//         if(ch == ';') 
//        { 
//            //semicolon count 
//            semicolon ++; 
//        } 
//        else continue; 

//    } 

//    //check number of semicolons 
//    if(semicolon != 2) 
//    {  
//        alert("\nSemicolon Error"); 
//        flag++; 
//    } 

//    check closing Parenthesis 
//    else if(str[(str.length) - 1] != ')') 
//    {  
//        alert("\nClosing parenthesis absent at end"); 
//        flag++; 
//    } 

//    check opening parenthesis 
//    else if(str[3] == ' ' && str[4] != '(' ) 
//    {  
//        alert("\nOpening parenthesis absent after for keyword"); 
//        flag++; 
//    } 

//    check parentheses count 
//    else if(bracket1 != 1 || bracket2 != 1 || bracket1 != bracket2) 
//    {  
//        alert("\nParentheses Count Error"); 
//        flag++; 
//    } 

//    no error  
//    if(flag == 0) 
//        alert("\nNo error"); 

//  }