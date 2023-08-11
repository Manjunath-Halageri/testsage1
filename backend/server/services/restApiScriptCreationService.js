const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var fs = require('fs');
var path = require("path");
var LineByLineReader = require('line-by-line');
const init = `@Test(priority=`;
const startBlock = `
        public void step_`;
const fName = "className";

/*logic Description: write import statements to script file
    */
async function writeImportsToFile(info, scriptPath) {
    console.log('inside import ')
    fs.createWriteStream(scriptPath);
    // var package = `package ${info.moduleName}.${info.featureName};`;
    // fs.appendFileSync(scriptPath, package + '\n');

    console.log("\nFile Contents of file before append:",
        fs.readFileSync(scriptPath, "utf8"));

    fs.appendFileSync(scriptPath, "\n");
    // var package = `package ${info.moduleName}.${info.featureName};`;
    var package = `package ${info.ModuleId}.${info.FeatureId};`;

    fs.appendFileSync(scriptPath, package + '\n');
    // Get the file contents after the append operation
    console.log("\nFile Contents of file after append:",
        fs.readFileSync(scriptPath, "utf8"));
    res.json("Script Generated")
    return { 'status': 'completed' }
}

/*logic Description: write className, other statement to script file
    */
function writeScriptBody(info,scriptId, scriptPath, templatePath, res) {

    var actionArrayForScript = [];
    lr = new LineByLineReader(templatePath);
    lr.on('error', function (err) { });
    lr.on('line', function (line) {
        if (line.includes(fName)) {
            var oldLine = line;
            var changeString = "className";
            // var NewLine = oldLine.replace(changeString, info.fileName)
            var NewLine = oldLine.replace(changeString, scriptId)
            fs.appendFileSync(scriptPath, "\n" + NewLine);
        }
        else if (line.includes("Start")) {
            fs.appendFileSync(scriptPath, "\n" + `static Response response;` + "\n\n", 'utf8');
            info.allObjectData.allActitons.forEach(async obj => {
                let actionObjForScript = {}
                actionObjForScript["actionObjForScript"] = await genrateLineForEachAction(obj)
                actionArrayForScript.push(actionObjForScript);
                if (actionArrayForScript.length === info.allObjectData.allActitons.length) {
                    let arrOfTestCases = await groupingTestCases(actionArrayForScript);
                    writeToFile(arrOfTestCases, scriptPath);
                }
            });
        }
        else {
            fs.appendFileSync(scriptPath, "\n" + line, 'utf8')
        }
    })

    lr.on('end', function (err) {
        // console.log('check out', actionArrayForScript);
        res.json("Script Generated");
    })
}


/*logic Description: fetching the each line code for writr to script file
    */
async function genrateLineForEachAction(obj) {
    //If function becomes more complex or more number of lines(max 25 lines)
    if (obj.Input2 != undefined && obj.Input2 != '') {
        if (obj.ActionList === "statusCode") {
            // if (isNaN(obj.Input2)) {
            //     var scriptValueGene = `.${obj.ActionList}("${obj.Input2}")`
            // }else{
            //     var scriptValueGene = `.${obj.ActionList}(${obj.Input2})`
            // }
            if (obj.Excel === "yesExcel") {
                console.log("input data is from Excel");
                // var scriptValueGene = "";
                
                      var  scriptValueGene = `.${obj.ActionList}(Integer.valueOf(${handelExcelInput(obj)}))`;
                        console.log(scriptValueGene);
            } else {
                var scriptValueGene = `.${obj.ActionList}(${obj.Input2})`
            }

        }
        else if (obj.ActionList === "statusLine") {
            // var scriptValueGene = `.${obj.ActionList}("${obj.Input2} ${obj.Input3}")`
            if (obj.Excel === "yesExcel") {
                console.log("input data is from Excel");
                // var scriptValueGene = "";
                // handelExcelInput(obj).
                //     then((returnFromhandelExcelInput) => {
                //         scriptValueGene = `.${obj.ActionList}(${returnFromhandelExcelInput})`;
                //         console.log(scriptValueGene);
                //     })
                var  scriptValueGene = `.${obj.ActionList}(${handelExcelInput(obj)})`;
                console.log(scriptValueGene);
            } else {
                var scriptValueGene = `.${obj.ActionList}("${obj.Input2}")`
            }

        }
        else if (obj.ActionList === "body") {
            if (obj.Excel === "yesExcel") {
                console.log("input data is from Excel");
                var  scriptValueGene = `.${obj.ActionList}(${handelExcelInput(obj)})`;
                console.log(scriptValueGene);
            } else {
                var scriptValueGene = `.${obj.ActionList}("${obj.Input2.replace(/"/g, '\\"')}")`
            }
            // var scriptValueGene = `.${obj.ActionList}("${obj.Input2.replace(/"/g, '\\"')}")`
        }

        else if (obj.ActionList === "responseValidation" || obj.ActionList === "responseHeaderValidation" || obj.ActionList === "responseTimeValidation") {
            var validationValues = JSON.parse(obj.Input2);
            if (obj.ActionList === "responseValidation") {
                scriptValueGene = '.body(';
            } else if (obj.ActionList === "responseHeaderValidation") {
                scriptValueGene = '.header(';
            } else if (obj.ActionList === "responseTimeValidation") {
                scriptValueGene = '.time(';
            }
            // scriptValueGene = '.body(';
            var i;
            for (i = 0; i < validationValues.length; i++) {
                if (validationValues[i].type == 1) {
                    let value = +validationValues[i].values;
                    let TValue = value;
                    if (obj.ActionList === "responseTimeValidation") {
                        scriptValueGene += ``;
                    }
                    else {
                        scriptValueGene += `"${validationValues[i].jsonPath}",`;
                    }
                    // scriptValueGene += `"${validationValues[i].jsonPath}",`;
                    if (validationValues[i].not) {
                        scriptValueGene += `not(`
                    }
                    scriptValueGene += `${validationValues[i].requestMethod}(`
                    if (obj.ActionList === "responseHeaderValidation") {
                        scriptValueGene += '"';
                    }
                    else if (isNaN(value)) {
                        scriptValueGene += `"`
                    }

                    if (obj.ActionList === "responseTimeValidation") {
                        scriptValueGene += `${validationValues[i].values}L`
                    }
                    else {
                        console.log(value, typeof (value))
                        // if (value instanceof Object) {
                        //     scriptValueGene += `${validationValues[i].values.replace(/"/g, '\\"')}`
                        // }else{
                        // scriptValueGene += `${validationValues[i].values}`(?=\\)  (?!") .replace(/\//g, '\\/')
                        // }
                        if (validationValues[i].values.includes("{")) {
                            if (validationValues[i].values.includes("\\/")) {
                                console.log("value,typeof(value) \/")
                                scriptValueGene += `${validationValues[i].values.replace(/\s+/g, '').replace(/\//g, '\\/').replace(/"/g, '\\"')}`
                            } else {
                                console.log("value,typeof(value) {")
                                scriptValueGene += `${validationValues[i].values.replace(/\s+/g, '').replace(/\//g, '\\/').replace(/\//g, '\\/').replace(/"/g, '\\"')}`
                            }
                        }
                        else if (validationValues[i].values.includes("http") || !validationValues[i].values.includes('/"')) {
                            console.log("value,typeof(value) http")
                            if (validationValues[i].values.charAt(0) == '"') {
                                scriptValueGene += `${validationValues[i].values.replace(/\s+/g, '').replace(/"/g, '\\"')}`
                            } else {
                                scriptValueGene += `${validationValues[i].values}`
                            }
                        }
                        else {
                            console.log("value,typeof(value) else")
                            scriptValueGene += `${validationValues[i].values.replace(/\s+/g, '').replace(/\/(?=\\)/g, '\\/').replace(/\/(?!")/g, '\\/').replace(/"/g, '\\"')}`
                        }
                        // scriptValueGene += `${validationValues[i].values.replace(/\s+/g, '').replace(/\/(?=\\)/g, '\\/').replace(/\/(?!")/g, '\\/').replace(/"/g, '\\"')}`
                    }
                    // scriptValueGene += `${validationValues[i].values}`
                    if (obj.ActionList === "responseHeaderValidation") {
                        scriptValueGene += '"';
                    }
                    else if (isNaN(value)) {
                        scriptValueGene += `"`
                    }
                    scriptValueGene += `)`
                    if (validationValues[i].not) {
                        scriptValueGene += `)`
                    }
                }
                else if (validationValues[i].type == 2) {
                    if (obj.ActionList === "responseTimeValidation") {
                        scriptValueGene += `${validationValues[i].requestMethod}(`;
                    }
                    else {
                        scriptValueGene += `"${validationValues[i].jsonPath}", ${validationValues[i].requestMethod}(`;
                    }
                    // scriptValueGene += `"${validationValues[i].jsonPath}", ${validationValues[i].requestMethod}(`;
                    for (var j = 0; j < validationValues[i].values.length; j++) {
                        console.log(j, validationValues[i].values.length)
                        let value = +validationValues[i].values[j].value;
                        if (validationValues[i].values[j].not) {
                            scriptValueGene += `not(`;
                        }
                        if (validationValues[i].values[j].type == 3) {
                            scriptValueGene += `is(`;
                        }
                        scriptValueGene += `${validationValues[i].values[j].requestIterativeMethod}(`
                        if (obj.ActionList === "responseHeaderValidation") {
                            scriptValueGene += '"';
                        }
                        else if (isNaN(value)) {
                            scriptValueGene += `"`
                        }
                        // else if(value.trim().length === 0){
                        //     scriptValueGene += `"${value}`
                        // }
                        if (validationValues[i].values[j].type == 1) {
                            if (obj.ActionList === "responseTimeValidation") {
                                scriptValueGene += `${validationValues[i].values[j].value}L`
                            }
                            else {
                                // if (value instanceof Object) {
                                // scriptValueGene += `${validationValues[i].values[j].value.replace(/"/g, '\\"')}`
                                // }else{
                                // scriptValueGene += `${validationValues[i].values[j].value}`
                                // }
                                if (validationValues[i].values[j].value.includes("{")) {
                                    if (validationValues[i].values[j].value.includes("\\/")) {
                                        console.log("value,typeof(value) \/")
                                        scriptValueGene += `${validationValues[i].values[j].value.replace(/\s+/g, '').replace(/\//g, '\\/').replace(/"/g, '\\"')}`
                                    } else {
                                        console.log("value,typeof(value) {")
                                        scriptValueGene += `${validationValues[i].values[j].value.replace(/\s+/g, '').replace(/\//g, '\\/').replace(/\//g, '\\/').replace(/"/g, '\\"')}`
                                    }
                                    // console.log("value,typeof(value) includes")
                                    // scriptValueGene += `${validationValues[i].values[j].value.replace(/\s+/g, '').replace(/\//g, '\\/').replace(/\//g, '\\/').replace(/"/g, '\\"')}`
                                }
                                else if (validationValues[i].values[j].value.includes("http") || !validationValues[i].values.includes('/"')) {
                                    console.log("value,typeof(value) http")
                                    if (validationValues[i].values[j].value.charAt(0) == '"') {
                                        scriptValueGene += `${validationValues[i].values[j].value.replace(/\s+/g, '').replace(/"/g, '\\"')}`
                                    } else {
                                        scriptValueGene += `${validationValues[i].values[j].value}`
                                    }
                                }
                                else {
                                    console.log("value,typeof(value) else")
                                    scriptValueGene += `${validationValues[i].values[j].value.replace(/\s+/g, '').replace(/\/(?=\\)/g, '\\/').replace(/\/(?!")/g, '\\/').replace(/"/g, '\\"')}`
                                }
                                // scriptValueGene += `${validationValues[i].values[j].value.replace(/\s+/g, '').replace(/\/(?=\\)/g, '\\/').replace(/"/g, '\\"')}`
                            }
                            // scriptValueGene += `${validationValues[i].values[j].value}`
                        }
                        if (obj.ActionList === "responseHeaderValidation") {
                            scriptValueGene += '"';
                        }
                        else if (isNaN(value)) {
                            scriptValueGene += `"`
                        }
                        // else if(value.trim().length === 0){
                        //     scriptValueGene += `"`
                        // }
                        scriptValueGene += `)`

                        if (validationValues[i].values[j].type == 3) {
                            scriptValueGene += `)`;
                        }
                        if (validationValues[i].values[j].not) {
                            scriptValueGene += `)`
                        }
                        if (j != validationValues[i].values.length - 1) {
                            scriptValueGene += ',';
                        }
                    }
                    scriptValueGene += `)`;
                }
                else if (validationValues[i].type == 4) {
                    // if(obj.ActionList === "responseTimeValidation"){
                    //     scriptValueGene += `${validationValues[i].requestMethod}(`
                    // }
                    // else{
                    //     scriptValueGene += `"${validationValues[i].jsonPath}", ${validationValues[i].requestMethod}(`
                    // }
                    // scriptValueGene += `"${validationValues[i].jsonPath}", ${validationValues[i].requestMethod}(`
                    scriptValueGene += `"${validationValues[i].jsonPath}", `
                    if (validationValues[i].not) {
                        scriptValueGene += `not(`
                    }
                    scriptValueGene += `${validationValues[i].requestMethod}(`;
                    for (var j = 0; j < validationValues[i].values.length; j++) {
                        let value = +validationValues[i].values[j];
                        if (isNaN(value)) {
                            scriptValueGene += `"`
                        }
                        scriptValueGene += `${validationValues[i].values[j]}`
                        if (isNaN(value)) {
                            scriptValueGene += `"`
                        }
                        if (j != validationValues[i].values.length - 1) {
                            scriptValueGene += ',';
                        }
                    }
                    scriptValueGene += `)`
                    if (validationValues[i].not) {
                        scriptValueGene += `)`
                    }
                }
                else {
                    if (obj.ActionList === "responseTimeValidation") {
                        scriptValueGene += ``
                    }
                    else {
                        scriptValueGene += `"${validationValues[i].jsonPath}",`
                    }
                    // scriptValueGene += `"${validationValues[i].jsonPath}",`
                    if (validationValues[i].not) {
                        scriptValueGene += `not(`
                    }
                    scriptValueGene += `is(${validationValues[i].requestMethod}())`
                    if (validationValues[i].not) {
                        scriptValueGene += `)`
                    }
                }
                if (i != validationValues.length - 1) {
                    // scriptValueGene += ',';
                    if (obj.ActionList === "responseValidation") {
                        scriptValueGene += ',';
                    } else if (obj.ActionList === "responseHeaderValidation") {
                        scriptValueGene += ').and().header(';
                    } else if (obj.ActionList === "responseTimeValidation") {
                        scriptValueGene += ').and().time(';
                    }
                }
            }
            scriptValueGene += ")";
        }

        else if (obj.ActionList === "preemptiveAuthentication") {
            var scriptValueGene = `.auth()
            .preemptive()
            .basic("${obj.Input2}","${obj.Input3}")`;
        }
        else if (obj.ActionList === "contentType") {
            if (obj.Excel === "yesExcel") {
                console.log("input data is from Excel");
                var  scriptValueGene = `.${obj.ActionList}(${handelExcelInput(obj)})`;
                console.log(scriptValueGene);
            } else {
                var scriptValueGene = `.${obj.ActionList}("${obj.Input2}")`
            }
        }
        else if (obj.Excel === "yesExcel") {
            console.log("input data is from Excel");
            // var scriptValueGene = "";
            // handelExcelInput(obj).
            //     then((returnFromhandelExcelInput) => {
            //         scriptValueGene = `.${obj.ActionList}(${returnFromhandelExcelInput})`;
            //         console.log(scriptValueGene);
            //     })
            var  scriptValueGene = `.${obj.ActionList}(${handelExcelInput(obj)})`;
            console.log(scriptValueGene);
        }
        else {
            var scriptValueGene = `.${obj.ActionList}("${obj.Input2}")`
        }
    }
    else {
        if (obj.ActionList === "given") {
            var scriptValueGene = `${obj.ActionList}()`
        }
        else if (obj.ActionList === "response.body") {
            var scriptValueGene = `Reporter.log("ResponseBody:"+${obj.ActionList}().asString());`
        }
        else if (obj.ActionList === "response.headers") {
            var scriptValueGene = `Reporter.log("ResponseHeaders:"+${obj.ActionList}().toString());`
        }
        else if (obj.ActionList === "response.time") {
            var scriptValueGene = `Reporter.log("ResponseTime:"+${obj.ActionList}());`
        }
        else {
            var scriptValueGene = `.${obj.ActionList}()`
        }
    }

    return scriptValueGene;
}

function handelExcelInput (scriptValue) {
    console.log(scriptValue)
    var arr09 = scriptValue.Input2.split(',');
    var excelFilePath = './excel/' + arr09[0] + '.xlsx';
    var sheetNum = arr09[1];
    if (arr09[2].includes('[')) {
        var rowNum = arr09[2].split('[')[1].split(']')[0];
        var cellNum = arr09[3].split('[')[1].split(']')[0];
    }
    else {
        var rowNum = arr09[2];
        var cellNum = arr09[3];
    }

    var excelData = `actions.getData("${excelFilePath}","${sheetNum}",${rowNum},${cellNum})`;
    console.log(excelData)
    return excelData;

}


/*logic Description: grouping the body statements for script files
    */
async function groupingTestCases(obj) {
    console.log("inside grouping with info", obj);
    let arrayOfTestCases = [];
    let arrOfLines = [];
    obj.forEach((element, index, array) => {

        if (element.actionObjForScript.includes("given")) {
            if (index != 0) {
                arrayOfTestCases.push(arrOfLines);
                arrOfLines = [];
            }
        }
        arrOfLines.push(element);

    });
    arrayOfTestCases.push(arrOfLines);
    console.log("After grouping with info", arrayOfTestCases);
    return (arrayOfTestCases);
}


/*logic Description: write body statements to script files until last statements
    */
function callLoop(array) {
    var b;
    array.forEach(function (item, index, array) {
        if (item.actionObjForScript != `Reporter.log("ResponseBody:"+response.body().asString());` && item.actionObjForScript != `Reporter.log("ResponseHeaders:"+response.headers().toString());` && item.actionObjForScript != `Reporter.log("ResponseTime:"+response.time());`) {
            if (index == 0) {
                b = item.actionObjForScript + "\n" + "\t";
            } else if (index == array.length - 1) {
                b += item.actionObjForScript + "\n" + "\t";;
            } else {
                b += item.actionObjForScript + "\n" + "\t";
            }
        }
    });
    return b;
}

/*logic Description: write report statements to script files
    */
function callLoop1(array) {
    var b;
    var filterArray = array.filter(obj => obj.actionObjForScript == `Reporter.log("ResponseBody:"+response.body().asString());` || obj.actionObjForScript == `Reporter.log("ResponseHeaders:"+response.headers().toString());` || obj.actionObjForScript == `Reporter.log("ResponseTime:"+response.time());`)
    if (filterArray.length != 0) {
        filterArray.forEach(function (item, index, array) {
            if (index == 0) {
                b = "\t" + item.actionObjForScript + "\n" + "\t";
            } else if (index == array.length - 1) {
                b += item.actionObjForScript + "\n" + "\t";
            } else {
                b += item.actionObjForScript + "\n" + "\t";
            }
        });
    }
    else {
        b = "";
    }
    console.log(b, filterArray);
    return b;
}

function writeToFile(arrOfTestCases, scriptPath) {
    arrOfTestCases.forEach((element, index) => {
        fs.appendFileSync(scriptPath, `${init}${index + 1})${startBlock}${index + 1}() throws Exception {\n\t response=
        ${callLoop(element)}.extract().response();\n${callLoop1(element)}}
       `, 'utf8')
    });
    return;
}

// function writeToFile(arrOfTestCases, scriptPath) {
//     arrOfTestCases.forEach((element, index) => {
//         fs.appendFileSync(scriptPath, `${init}${index + 1})${startBlock}${index + 1}(){
//         ${callLoop(element)};\n}
//        `, 'utf8')
//     });
//     return;
// }

module.exports = {
    writeImportsToFile: writeImportsToFile,
    writeScriptBody: writeScriptBody

};