const EventEmitter = require('events');

class MainClass extends EventEmitter {

    mainMethod(data,templatePath,scriptPath){
        const init = `@Test(priority=`
        const startBlockAppium = `@Test
	    @Parameters({"deviceName","devicePlatform", "DeviceID","platformVersion","serverAddress","appPackage","appActivity"})
        public void step_`;
        const  startBlock = `
        public void step_`;
        const  exceptionBlock = `() throws Exception
        {
        try
        {`;
        const  exceptionBlockAppium = `(String deviceName, String devicePlatform,String DeviceUDID,String platformVersion, String serverAddress, String appPackage, String appActivity ) throws Exception
        {
        try
        {`;
        const commonBlock = `String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();
        actions.CaptureScreenShotAtEachStep(path,methodName,screenshotOption);
        `;
        const lastBlock = `
        actions.CloseCurrentTab();   
        actions.AssertAll(); 
        driver.get().quit();`;
        const catchBlock = `}
        catch(Exception e)
        {
        String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();     
        actions.CaptureOnFailure(path1,methodName,failScreenshotoption);
        e.printStackTrace();
        actions.CloseCurrentTab();
        driver.get().quit();
        throw e;
        } 
        };\n` ;
  
        var LineByLineReader = require('line-by-line');
        var fs = require('fs');
        var actionArrayForScript=[];
        const fName = "className";
        var  totalArrayLength = 0;
        var path = require("path");
        lr = new LineByLineReader(templatePath);
        lr.on('error', function(err) {});
        lr.on('line', function(line) {
        if (line.includes(fName)) 
        {
            var oldLine = line;
            var changeString = "className";
            var NewLine = oldLine.replace(changeString, data.fileName)
            fs.appendFileSync(scriptPath, "\n" + NewLine);
        }//classNameReplace
        else if(line.includes("StartVariableConfiguration")){
            data.allVariablesForScript.forEach(variableList => {
                // if(variableList.variableType == "boolean")
                // {
                //   var addToScript = `${variableList.variableType} ${variableList.variableAddFun};`;
                // }
                // else if(variableList.variableDefaultValue == undefined)
                // {
                //     var addToScript = `${variableList.variableType} ${variableList.variableAddFun};`;
                // }
                // else
                // {
                //   var addToScript = `${variableList.variableType} ${variableList.variableAddFun}="${variableList.variableDefaultValue}";`;
                // }
                if (variableList.variableDefaultValue === undefined || variableList.variableDefaultValue === "") {
                    var addToScript = `${variableList.variableType} ${variableList.variableAddFun};`;
                }
                else {
                    if (variableList.variableType === "String") {
                        var addToScript = `${variableList.variableType} ${variableList.variableAddFun}="${variableList.variableDefaultValue}";`;
                    }
                    else {
                        var addToScript = `${variableList.variableType} ${variableList.variableAddFun}=${variableList.variableDefaultValue};`;
                    }

                }
                console.log(scriptPath)
                console.log("scriptPathscriptPathscriptPathscriptPathscriptPathscriptPathscriptPathscriptPathscriptPathscriptPath")
                fs.appendFileSync(scriptPath, "\n" + addToScript);
            })
        }//variableWriting 
        else if (line.includes("Start")) 
        {
            totalArrayLength = data.allObjectData.allActitons.length;
            data.allObjectData.allActitons.forEach(scriptValue => 
            {
                if(scriptValue.Groups === "Browser Specific" 
                || scriptValue.Groups === "Explicit Wait")
                {
                pomObjectNotFunction(scriptValue) .then((message)=>{makeCommonCallForPush(message,data)})
                }
                else if(scriptValue.Groups ===  "Object Specific" 
                || scriptValue.Groups ===  "KeyBoard & Mouse" 
                || scriptValue.Groups ===  "DropDownSelection" 
                || scriptValue.Groups ===  "Labels" 
                || scriptValue.Groups ===  "Validation")
                {
                pomObjectYesFunction(scriptValue).then((reply)=>{makeCommonCallForPush(reply,data)})
                // catch(console.error)
                }
                else if(scriptValue.Groups ===  "Java Function")
                {
                javaMethodHandlingFunction(scriptValue).then((getback)=>{makeCommonCallForPush(getback,data)})
                }
                else if(scriptValue.Groups ===  "Conditions")
                {
                handlingDecisionStatment(scriptValue).then((revertBack)=>{makeCommonCallForPush(revertBack,data)})
                }
                else if(scriptValue.Groups ===  "Loopings")
                {
                loopHandelingCondition(scriptValue).then((callback)=>{makeCommonCallForPush(callback,data)})
                }
                else if(scriptValue.Groups ===  "User Function")
                {
                handlingReuseableFunction(scriptValue,data).then((reuseValue)=>{makeCommonCallForPush(reuseValue,data)})
                }
                else if(scriptValue.Groups ===  "Application Specific")
                {
                appiumCall(scriptValue).then((resp)=>{makeCommonCallForPush(resp,data)})
                }
                else if(scriptValue.Groups === "KeyBoard Keys")
                {
                keyBoardMethods(scriptValue).then((resp)=>{makeCommonCallForPush(resp,data)})
                }
                else 
                {
                // ifFunction();
                }
            });//data.allObjectData.allActitons.forEach(scriptValue => 
        }//scriptGenerating
        else 
        {
            fs.appendFileSync(scriptPath, "\n" + line, 'utf8');
        }
        });
        lr.on('end', function(err) {
            this.emit('scriptGenerated',{Mesage:'completedFromMainBody'})
            // returnFromMainBody = "completedFromMainBody";
            // callback(returnFromMainBody); 
        });//gettingBackResultToTestNgServer
        /*
        Logic Desc: this function activate for the actionList which does not require page and object;
        once the call enter the function body, again i am dividing the block based on input presence.
        if the input is from excel, handelExcelInput call triggres, and reslove the actionForObject object.
        Result: throughs a object required to generate the user script.  
         */
        var pomObjectNotFunction = (scriptValue) => new Promise((resolves,rejects)=>
        {   var actionObjForScript={};
            if(scriptValue.Input2 != undefined && scriptValue.Input2 != '' && scriptValue.Excel =="notExcel")
            {
            var scriptValueGene = `actions.${scriptValue.ActionList}("${scriptValue.Input2}");`;
            }//inputWithoutExcel
            else if(scriptValue.Input2 != undefined  && scriptValue.Input2 != '' && scriptValue.Excel =="yesExcel")
            {
            console.log("input data is from Excel");
            handelExcelInput(scriptValue).
            then((returnFromhandelExcelInput)=>{
            actionObjForScript["actionObjForScript"]=`actions.${scriptValue.ActionList}(${returnFromhandelExcelInput});`;
                console.log(returnFromhandelExcelInput);
            })
            }////inputWithExcel
            else
            {
            if(scriptValue.ReturnsValue != undefined  && scriptValue.ReturnsValue != '' )
            {
                var scriptValueGene = scriptValue.ReturnsValue+`=actions.${scriptValue.ActionList}();`;
            }
            else
            {var scriptValueGene = "actions."+scriptValue.ActionList+"();";}
            }//forReturnValue
            actionObjForScript["actionObjForScript"]=scriptValueGene;
            resolves(actionObjForScript);
            rejects(new Error());
        });//pomObjectNotFunction

        /*
        Logic Desc: this function activate for the actionList which require page and object;
        once the call enter the function body, again i am dividing the block based on input presence.
        if the input is from excel, handelExcelInput call triggres, and reslove the actionForObject object.
        here we are handling the variable through scriptValuePresent function it will resloves the object as o/p.
        Result: throughs a object required to generate the user script.  
         */
        var  pomObjectYesFunction = (scriptValue) => new Promise((resloves,rejects)=>
        {
            var actionObjForScript={};
            if(scriptValue.Input2 != undefined && scriptValue.Input2 != '' && scriptValue.Excel =="notExcel")
            {
                scriptValueInputPresent(scriptValue).
                then((replyFromscriptValueInputPresent)=>{
                actionObjForScript["actionObjForScript"]=replyFromscriptValueInputPresent;
                })
            }//// pomObjectYesFunctionif01EndDoubt
            else if(scriptValue.Input2 != undefined && scriptValue.Input2 != '' && scriptValue.Excel =="yesExcel")
            {
                console.log("input is from Excellll");
                handelExcelInput(scriptValue).
                then((returnFromhandelExcelInput)=>{
                actionObjForScript["actionObjForScript"]=`actions.${scriptValue.ActionList}(${scriptValue.PomObject},${returnFromhandelExcelInput});`;
                })

                            
            }//elseIfClose
            else
            {
                //
                if(scriptValue.PomObject != undefined && scriptValue.PomObject != '')
                {
                    if(scriptValue.ReturnsValue == undefined || scriptValue.ReturnsValue == '' )
                    {
                      var scriptValueGene = `actions.${scriptValue.ActionList}(${scriptValue.PomObject});`;
                    }
                    else
                    {
                      var scriptValueGene = scriptValue.ReturnsValue+`=actions.${scriptValue.ActionList}(${scriptValue.PomObject});`}
                }//ifWithinElse
                else
                {
                    var scriptValueGene = "actions."+scriptValue.ActionList+"();";
                }
            }//elseClose
            actionObjForScript["actionObjForScript"]=scriptValueGene;
            resloves(actionObjForScript);
            rejects(new Error());
        })////function pomObjectYesFunction


         /*
        Logic Desc: this function activate for the java function groups;
        collects all the java action generate the object and throughs it back as o/p;
        Result: throughs a object required to generate the user script.  
         */
        
        var javaMethodHandlingFunction = (scriptValue)=>new Promise((resloves,rejects)=>{
          var actionObjForScript={};
          if(scriptValue.ActionList === 'ExcelRowCount'){
              console.log("row counttttttttttttttttttttttttttttttttt");
              console.log(scriptValue)
            var scriptValueGene = scriptValue.ReturnsValue+`=javamethod.${scriptValue.ActionList}("./Excel/${scriptValue.Input2}.xlsx","Sheet1");`;
          }
          else if(scriptValue.ActionList === 'ReadTableCell'){

            console.log("input data is from Excel");
            handelExcelInput(scriptValue).
            then((returnFromhandelExcelInput)=>{
                console.log(returnFromhandelExcelInput)
            actionObjForScript["actionObjForScript"]=scriptValue.ReturnsValue+`=${returnFromhandelExcelInput};`;
            console.log(returnFromhandelExcelInput);
            })
          }
          else{
          var scriptValueGene = scriptValue.ReturnsValue+`=javamethod.${scriptValue.ActionList}(${scriptValue.Input2},${scriptValue.Input3});`;
          }
          actionObjForScript["actionObjForScript"]=scriptValueGene;
           resloves(actionObjForScript);
           rejects(new Error());
        })//javaMethodHandlingFunction
  

        /*
        Logic Desc: this function activate for the condition groups;
        collects all the condition action generate the object and throughs it back as o/p;
        here the block is divided again based on start and end condition of the actionlist;
        Result: throughs a object required to generate the user script.  
         */
        var handlingDecisionStatment = (scriptValue)=>new Promise((resloves,rejects)=>{
          var actionObjForScript={};
         if(scriptValue.ActionList === "If-Start")//||ElseIf-Start || Else-Start
         {
            var scriptValueGene = `if(${scriptValue.Input2}){`;
         }
         else if(scriptValue.ActionList === "If-End")
         {
         var scriptValueGene = `}//If-End`;
         }
         else if(scriptValue.ActionList === "Else-Start")//||ElseIf-Start || Else-Start
         {
            var scriptValueGene = `else{`;
         }
         else if(scriptValue.ActionList === "Else-End")
         {
            var scriptValueGene = `}//Else-End`;
         }
         else if(scriptValue.ActionList === "ElseIf-Start")
         {
            var scriptValueGene = `else if(${scriptValue.Input2}){`;
         }
         else if(scriptValue.ActionList === "ElseIf-End")
         {
            var scriptValueGene = `}//ElseIf-End`;
         }
         else
         {

         }
  
          // var scriptValueGene = scriptValue.ReturnsValue+`=javamethod.${scriptValue.ActionList}(${scriptValue.Input2},${scriptValue.Input3});`;
          actionObjForScript["actionObjForScript"]=scriptValueGene;
           resloves(actionObjForScript);
           rejects(new Error());
        })//handlingDecisionStatment


         /*
        Logic Desc: this function activate for the loopings groups;
        collects all the condition action generate the object and throughs it back as o/p;
        here the block is divided again based on start and end condition of the actionlist;
        Result: throughs a object required to generate the user script.  
         */
        var loopHandelingCondition = (scriptValue)=>new Promise((resloves,rejects)=>{
        var actionObjForScript={};
        if(scriptValue.ActionList === "For-Start")//||ElseIf-Start || Else-Start
         {
            var scriptValueGene = `for(${scriptValue.Input2}){`;
         }
         else if(scriptValue.ActionList === "For-End")
         {
         var scriptValueGene = `}//For-End`;
         }

         actionObjForScript["actionObjForScript"]=scriptValueGene;
           resloves(actionObjForScript);
           rejects(new Error());

        })//loopHandelingCondition


         /*
        Logic Desc: this function activate for the user Function groups;
        collects all the condition action generate the object and throughs it back as o/p;
        here we are checking the no of parameters a function contains;
        Result: throughs a object required to generate the user script.  
         */
        var handlingReuseableFunction = (scriptValue,data)=>new Promise((resloves,rejects)=>{
            var methodParams=scriptValue.Input2;
            if(methodParams === '' || methodParams === undefined){
                var demo ='';
            }
            else
            {
            var methodParams1=methodParams.split(",");
            var demo =[];
            for(i = 0;i<methodParams1.length;i++){
                if(i !=methodParams1.length-1 ){
                    const result = data.allVariablesForScript.filter( allVariables =>allVariables.variableAddFun === methodParams1[i]);
                    if(result.length !==0 )
                    {demo.push(`${methodParams1[i]}`);}
                    else{demo.push(`"${methodParams1[i]}"`);}
                }
                else if (i==methodParams1.length-1){
                    const result = data.allVariablesForScript.filter( allVariables =>allVariables.variableAddFun === methodParams1[i]);
                    if(result.length !==0 )
                    {demo.push(`${methodParams1[i]}`);}
                    else{demo.push(`"${methodParams1[i]}"`);}
                }
                else{}
            }
            }
            
              var actionObjForScript={};
              if(scriptValue.ReturnsValue == undefined || scriptValue.ReturnsValue == '' )
                    {
                        var scriptValueGene = `new ${scriptValue.ClassObject}(driver).${scriptValue.ActionList}(${demo});`;
                    }
                    else
                    {
                        var scriptValueGene = `${scriptValue.ReturnsValue} = new ${scriptValue.ClassObject}(driver).${scriptValue.ActionList}(${demo});`;
                    }
             
              actionObjForScript["actionObjForScript"]=scriptValueGene;
              resloves(actionObjForScript);
              rejects(new Error());
          })//handlingReuseableFunction


            /*
        Logic Desc: this function activate for the Application Specific Function groups;
        collects all the condition action generate the object and throughs it back as o/p;
        we are collection the devices information and apk info which are required for the appium exceution;
        Result: throughs a object required to generate the user script.  
         */

          var appiumCall = (scriptValue)=>new Promise((resloves,rejects)=>{
            var actionObjForScript={};
            var scriptValueGene = `actions.${scriptValue.ActionList}(deviceName, devicePlatform, DeviceUDID, platformVersion, implicitTimeOut, appPackage, appActivity, serverAddress);`;
             
              actionObjForScript["actionObjForScript"]=scriptValueGene;
              resloves(actionObjForScript);
              rejects(new Error());

          })

          //////////keyBoardMethods/////////


          var keyBoardMethods = (scriptValue)=>new Promise((resloves,rejects)=>{

            var actionObjForScript={};

            var scriptValueGene = `actions.${scriptValue.ActionList}(${scriptValue.PomObject});`;
             
              actionObjForScript["actionObjForScript"]=scriptValueGene;
              resloves(actionObjForScript);
              rejects(new Error());

          })

        //   keyBoardMethods

               /*
        Logic Desc: this function is mainly to group the actions in to one array
        when the length of script equal to array length i am calling one more function called conditionGrouping for 
        generating the step level action;
        Result: array of actions.  
         */

        function makeCommonCallForPush(allAactionValue,data)
        {
            actionArrayForScript.push(allAactionValue)
            if(actionArrayForScript.length === totalArrayLength ) {
                conditionGrouping(actionArrayForScript,data)
            }
        }//function makeCommonCallForPush

              /*
        Logic Desc: this function is mainly to generate the step level actions.
        if there is any actions which consists of ifStart block then we are pushing in to sub array up to loop 
        encounters the closing of end block, and search for elseif and else block.
        remaning actions are pushed to main array.
        when the ifstart and if end blocks matches sub array is pushed to main array
        Result: step level array.  
         */
        function conditionGrouping(data,yash)
        { 
            var formatted = [];
            var ifEndBlock = {
                data: [],
                starts: 0,
                ends: 0,
                elseEnds:0,
                forStarts:0,
                forEnds:0
            };
            data.forEach((i,index)=>{
                if((0 !== i.actionObjForScript.indexOf('if(') && ifEndBlock.starts === 0) && 
                (0 !== i.actionObjForScript.indexOf('for(') && ifEndBlock.forStarts === 0)){
                formatted.push([i]);
                return;
                }
                ifEndBlock.starts = 0 === i.actionObjForScript.indexOf('if') ? +1 : ifEndBlock.starts
                if(i.actionObjForScript === ('}//If-End'))
                {
                function  checkCall (check){
                if ( check.includes('else if(') === true) {
                return true;
                }
                else if ( check === 'else{'){
                return true; 
                } else{
                return false; 
                }  
                }
                if(!checkCall(data[index+1].actionObjForScript))
                {
                ifEndBlock.ends = 0 === i.actionObjForScript.indexOf('}//If-End') ? +1 : ifEndBlock.ends;
                ifEndBlock.data.push(i);
                } 
                else
                {
                ifEndBlock.data.push(i);
                }   
                }
                else if ( i.actionObjForScript === ('}//Else-End')) {
                ifEndBlock.ends =1;
                ifEndBlock.data.push(i);
                }else  {
                ifEndBlock.data.push(i);
                }

                ifEndBlock.forStarts = 0 === i.actionObjForScript.indexOf('for(') ? +1 : ifEndBlock.forStarts;
                ifEndBlock.forEnds = 0 === i.actionObjForScript.indexOf('}//For-End') ? +1 : ifEndBlock.forEnds;

                if( (ifEndBlock.starts === ifEndBlock.ends) && (ifEndBlock.forStarts === ifEndBlock.forEnds) ){
                formatted.push(ifEndBlock.data);
                ifEndBlock.data = [];
                ifEndBlock.starts = ifEndBlock.ends = 0;
                ifEndBlock.forStarts = ifEndBlock.forEnds=0;

                }
                return;
            });
            writeToFile(formatted,yash);
        }//conditionGrouping

        /*
        Logic Desc: this function is a call seperater for reusable function and normal function
    
         */
        function writeToFile(formatted,yash) 
        {
            if(yash.typeOfFunction === "reusableFunction")
            {
                writeReusFunctiontoFile(formatted,yash)
            }
            else
            {
             writeTestScriptTOFile(formatted,yash);
            }
            
        }//function writeToFile(fileData)

        
              /*
        Logic Desc: this function is mainly to generate the actual scripts in .java file.
        here we make it  constant block those are the common lines of code to be replaced 
        while generating the scripts.
        and we are looping on action list to produce the step level scripts.
        Result: writes the scripts and return the call back to the called function.  
         */
        function writeTestScriptTOFile(formatted,yash){
            formatted.forEach((i,index,array)=>{
                function callLoop(array) {
                    var b ;
                    array.forEach(function (item,index) {
                           if (index == 0) {
                              b = item.actionObjForScript+"\n";
                           } else {
                            b += item.actionObjForScript+"\n";
                           }
                    });
                    
                    return b;
                }
            if(index === array.length-1){
            // fs.appendFileSync(scriptPath,`${init}${index+1})${startBlock}${index+1}${exceptionBlock}
            // fs.appendFileSync(scriptPath,`${startBlock}${index+1}${exceptionBlock}
            fs.appendFileSync(scriptPath,`${init}${index+1})${startBlock}${index+1}${exceptionBlock}
            ${callLoop(i)}
            ${commonBlock}
            ${lastBlock}
            ${catchBlock}
           `, 'utf8');
            }
            else if(array[index][0].actionObjForScript.includes('actions.OpenApplication'))
            {
            fs.appendFileSync(scriptPath,`${startBlockAppium}${index+1}${exceptionBlockAppium}
                ${callLoop(i)}
                ${commonBlock}
                ${catchBlock}
                ` , 'utf8');
            }//only used For Appium to replace the first Method and to add devices details not for Test Ng
            else{
            fs.appendFileSync(scriptPath,`${init}${index+1})${startBlock}${index+1}${exceptionBlock}
            ${callLoop(i)}
            ${commonBlock}
            ${catchBlock}
            ` , 'utf8');
            }
            });

        }//writeTestScriptTOFile
        function writeReusFunctiontoFile(formatted,yash){
            var methodParams=yash.reusable.reuseAbleParameters;
            var methodParams1=methodParams.split(",");
            if(yash.reusable.checkBoxValue === true && yash.reusable.returnType !== ''){
                fs.appendFileSync(scriptPath,"\n"+"public "+yash.reusable.returnType+" "+yash.reusable.reuseAbleMethod+"(",'utf8');
            }
            else{ fs.appendFileSync(scriptPath,"\n"+"public void "+yash.reusable.reuseAbleMethod+"(",'utf8');}
           
            for(i = 0;i<methodParams1.length;i++){
                if(i !=methodParams1.length-1 ){
                    fs.appendFileSync(scriptPath,methodParams1[i]+",");
                }
                else if (i==methodParams1.length-1){
                    fs.appendFileSync(scriptPath,methodParams1[i]+") throws Exception\n{\n");
                }
                else{}
            }
            formatted.forEach((e)=>{
                if(e[0].actionObjForScript.includes(yash.reusable.returnVariable) && yash.reusable.returnVariable !== '')
                {  
                    console.log("return is presenttttttt")
                    var data=[];
                    var actionObjForScript={};
                    actionObjForScript["actionObjForScript"] = `return ${yash.reusable.returnVariable};`;
                    data.push(actionObjForScript);
                    formatted.push(data)
                    
                }
            })
            formatted.forEach((i,index,array)=>{
                function callLoop(array) {
                    var b ;
                    array.forEach(function (item,index) {
                           if (index == 0) {
                              b = item.actionObjForScript+"\n";
                           } else {
                            b += item.actionObjForScript+"\n";
                           }
                    });
                    return b;
                }
                // console.log(formatted);
            fs.appendFileSync(scriptPath,
            `${callLoop(i)}`, 'utf8');
            
            });

        }//writeReusFunctiontoFile
        var scriptValueInputPresent = (scriptValue) => new Promise((resloves,reject)=>{
            if(scriptValue.PomObject != undefined && scriptValue.PomObject != '' && scriptValue.Groups != 'Validation')
            {
                if(scriptValue.ReturnsValue != undefined && scriptValue.ReturnsValue != '' )
                {
                const replace = data.allVariablesForScript.filter( allVariables =>allVariables.variableAddFun === scriptValue.Input2);
                if(replace.length === 1)
                {
                var scriptValueGene = scriptValue.ReturnsValue+`=actions.${scriptValue.ActionList}(${scriptValue.PomObject},${scriptValue.Input2});`;
                }
                else{
                   if(scriptValue.ActionList.includes("ByIndex") === true){
                    var scriptValueGene = scriptValue.ReturnsValue+`=actions.${scriptValue.ActionList}(${scriptValue.PomObject},${scriptValue.Input2});`;
                   }
                  else{
                    var scriptValueGene = scriptValue.ReturnsValue+`=actions.${scriptValue.ActionList}(${scriptValue.PomObject},"${scriptValue.Input2}");`;
                  }
                }
                }
                else
                {
                const replaceIfVariablePresent = data.allVariablesForScript.filter( allVariables =>allVariables.variableAddFun === scriptValue.Input2);
                if(replaceIfVariablePresent.length === 1 ){
                var scriptValueGene = `actions.${scriptValue.ActionList}(${scriptValue.PomObject},${scriptValue.Input2});`;
                }
                else{
                    if(scriptValue.ActionList.includes("ByIndex") === true){
                        var scriptValueGene = `actions.${scriptValue.ActionList}(${scriptValue.PomObject},${scriptValue.Input2});`;
                       }
                       else{
                        var scriptValueGene = `actions.${scriptValue.ActionList}(${scriptValue.PomObject},"${scriptValue.Input2}");`;
                }
                }
                }
            }//ifClose
            else
            {
                if(scriptValue.PomObject != undefined  && scriptValue.PomObject != '')
                {
                    if(scriptValue.Input3 != undefined && scriptValue.Input3 != '')
                    {
                    var scriptValueGene = `actions.${scriptValue.ActionList}(${scriptValue.PomObject},"${scriptValue.Input2}","${scriptValue.Input3}");`;
                    }
                    else
                    {
                    var scriptValueGene = `actions.${scriptValue.ActionList}(${scriptValue.PomObject},"${scriptValue.Input2}");`;
                    }
                }//elseWithinIf
                else
                {
                    var scriptValueGene =null;
                    variableHandling(scriptValue,data,function(getBack){
                    scriptValueGene =null
                    scriptValueGene = getBack;
                    })
                }//elseWithinElse
            }//elseClose

            resloves(scriptValueGene);
            rejects(new Error());
           

    })//scriptValueInputPresent
        function variableHandling(scriptValue,data,callback)
        {
            const result = data.allVariablesForScript.filter( allVariables =>allVariables.variableAddFun === scriptValue.Input2);
            if(result.length != 0)
            {
            if(scriptValue.ActionList == "AssertEqualsForString" || scriptValue.ActionList == "AssertNotEqualsForString"  )
            {
            var scriptValueGene = `actions.${scriptValue.ActionList}(${scriptValue.Input2},"${scriptValue.Input3}");`;
            }
            else
            {
                var scriptValueGene = `actions.${scriptValue.ActionList}(${scriptValue.Input2},${scriptValue.Input3});`;
            }
            callback(scriptValueGene)
            }
            else
            {
            var scriptValueGene = `actions.${scriptValue.ActionList}("${scriptValue.Input2}","${scriptValue.Input3}");`;
            callback(scriptValueGene) 
            }
        }// function variableHandling(scriptValue,data,callback) 

        var handelExcelInput = (scriptValue) => new Promise((resloves,reject)=>{
                            var arr09 = scriptValue.Input2 .split(',');
                            var excelFilePath = './Excel/'+arr09[0]+'.xlsx';
                            var sheetNum = arr09[1];
                            if(arr09[2].includes('[')){
                                var rowNum = arr09[2].split('[')[1].split(']')[0];
                                var cellNum = arr09[3].split('[')[1].split(']')[0];
                            }
                            else
                            {
                                var rowNum = arr09[2];
                                var cellNum = arr09[3];
                            }
                            
                            var excelData = `actions.getData("${excelFilePath}","${sheetNum}",${rowNum},${cellNum})`
                            resloves(excelData)

        })

    }///mainMethod closes

}//MainClass Ends

module.exports = MainClass;