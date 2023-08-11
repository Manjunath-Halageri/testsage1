const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var path = require("path");
var fs = require('fs');
var cmd = require('child_process');
const pathForApi = './uploads/opal/';
const performance = require('perf_hooks').performance;
var rimraf = require("rimraf");
var LineByLineReader = require('line-by-line');

  /*logic Description: fetching the script from testScript collection */
async function checkIfScriptGenerated(req, res) {

    let obj = {
        "frameworkId": parseInt(req.query.frameId),
        "projectId": req.query.projectId,
        "scriptId": req.query.scriptId
    }
    let result = await dbServer.findCondition(db.testScript, obj);


    if (result.length != 0) {
        res.json(result);
    } else {
        res.json("something went wrong");
    }

}

  /*logic Description: fetching the nlp's by matching groupId in actionList and groups collection */
function getGrammar(req, res) {
    db.actionList.aggregate([
        { "$match": { frameworkId: { $eq: parseInt(req.query.frameId) } } },
        {
            "$lookup":
            {
                "from": "groups",
                "localField": "groupId",
                "foreignField": "groupId",
                "as": "result"
            }
        },
        { $unwind: "$result" }
    ], function (err, docMain) {
        if (err) throw err;
        res.json(docMain);
    })
}

  /*logic Description: writing the configurations to outside projectToRun folder Testng.xml file */
function createXml(info) {
    console.log('inside xml creation')
    let file = `${pathForApi}${info.projectName}/${info.userName}/Testng.xml`;
    //validate if path miss
    console.log(file, "pathraviman")
    var writerStream = fs.createWriteStream(file, { flags: 'w+' })
        .on('error', function (err) {
            console.log(err.stack);
        });
        // <class name="${info.moduleName}.${info.featureName}.${info.scriptName}"/>
    let content = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE suite SYSTEM "http://testng.org/testng-1.0.dtd">
    <suite name="Suite" thread-count="1" >
      <test thread-count="1" name="Test01">
        <classes>
          <class name="${info.ModuleId}.${info.FeatureId}.${info.scriptId}"/>
           </classes>
      </test> <!-- Test 01-->
    </suite> <!-- Suite -->`
    writerStream.write(content, function () {
        console.log("Write completed.");
    });

    writerStream.end(() => {
        return;
    })
}

  /*logic Description: saving or updating data into testscript collection */
async function dbInsert(dBinfo) {
    let findCondition = {
        projectId: dBinfo[0].projectId,
        frameworkId: parseInt(dBinfo[0].frameId),
        scriptName: dBinfo[0].scriptName,
        scriptId: dBinfo[0].scriptId,
        compeleteArray: { $exists: true }
    }
    let res = await dbServer.findCondition(db.testScript, findCondition)
    console.log(res.length)
    if (res.length != 0) {
        let updateCondition = {
            projectId: dBinfo[0].projectId,
            frameworkId: parseInt(dBinfo[0].frameId),
            scriptName: dBinfo[0].scriptName,
            scriptId: dBinfo[0].scriptId
        }
        let updateParams = {
            // $push: {
            //     compeleteArray: {
            //         dBinfo[1]
            //     }
            // },
            $set: {
                // 'compeleteArray.$[].allObjectData': dBinfo[1].allObjectData,
                // 'compeleteArray.$[].editDate': dBinfo[1].editDate,
                'compeleteArray':[dBinfo[1]],
                'testCaseStatus': "Manual",
                'lastAutomatedExecutionStatus': "NotExecuted"
            }
        }
        dbServer.updateOne(db.testScript, updateCondition, updateParams)
        return;

    } else {
        let updateCondition = {
            projectId: dBinfo[0].projectId,
            frameworkId: parseInt(dBinfo[0].frameId),
            scriptName: dBinfo[0].scriptName,
            scriptId: dBinfo[0].scriptId
        }
        let updateParams = {
            $set: {
                compeleteArray: dBinfo[1],
                'testCaseStatus': "Manual",
                'lastAutomatedExecutionStatus': "NotExecuted"
            }
        }
        dbServer.updateOne(db.testScript, updateCondition, updateParams)
        return;

    }

}

function apiScriptExecution(req, res) {
    var data = req.body
    suiteCreation(data, res)
}

  /*logic Description: writing the configurations to inside projectToRun folder Testng.xml file */
function suiteCreation(data, res) {
    console.log("function for creating the testng.xml ")
    var a = 1;
    var c = "Opal";
    var fullline;
    var file11data = [];
    var projectName;
    var file;
    projectName = data.projectName;
    file = "./uploads/opal/" + projectName + "/" + data.userName + "/projectToRun/Testng.xml";
    var fline = "<test name=" + "\"" + c + a + "\"\>";
    // var sline = "<classes><class name=" + "\"" + data.moduleName + '.' + data.featureName + '.' + data.scriptName + "\"\/></classes>";
    var sline = "<classes><class name=" + "\"" + data.ModuleId + '.' + data.FeatureId + '.' + data.scriptId + "\"\/></classes>";
    var lline = "</test>";
    fullline = "\n" + fline + "\n" + sline + "\n" + lline;
    file11data.push(fullline);
    arrayout = file11data.join('');
    var createFile = fs.createWriteStream(file);
    var Suite = "Suite"
    createFile.write("<?xml version='1.0' encoding='UTF-8'?>\n")
    createFile.write("<!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n")
    createFile.write("<suite name =" + "\"" + Suite + "\"" + "  thread-count=" + "\"" + 1 + "\" >");
    createFile.write(arrayout)
    createFile.write("\n")
    createFile.write("</suite>")
    createFile.end(function () {
        console.log(`done writing testng ${file} `);
        var createdXml = 'Pass';
        mvnBatchCreation(data, res)
    })
}

  /*logic Description: configuring the batch file  */
function mvnBatchCreation(data, res) {
    file = path.join(__dirname, `../../uploads/opal/${data.projectName}/${data.userName}/Mvn.bat`)
    file1 = path.join(__dirname, `../../uploads/opal/${data.projectName}/${data.userName}/Mvn.txt`)
    var projectPath = path.join(__dirname, `../../uploads/opal/${data.projectName}/${data.userName}/projectToRun`)
    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write("cd " + projectPath + " && " + "mvn clean test > " + file1)
    mvnFileCreation.end(function () {
        batchCreation = 'Pass';
        mvnExecution(data, res)
    })
}

  /*logic Description: executin the batch file */
function mvnExecution(data, res) {
    mvnexe = path.join(__dirname, `../../uploads/opal/${data.projectName}/${data.userName}/Mvn.bat`);
    var checkTestngResultsXml = path.join(__dirname, `../../uploads/opal/${data.projectName}/${data.userName}/projectToRun/target/surefire-reports/testng-results.xml`);
    cmd.exec(mvnexe, (err, stdout, stderr) => {

        console.log(" MVN batch file executed " + "\n\n");
        try {

            if (err) {
                console.log("Error:", err);
                // the following condition is to check is the error is compilation or a runtime error.
                // if below path exists then it is a runtime error,or else its a compilation error.
                if (!fs.existsSync(checkTestngResultsXml)) {
                    res.json("compilationError")
                    return;
                }else{
                    batchResult = "Pass"
                    res.json(batchResult)
                }
            }else{
                batchResult = "Pass"
                res.json(batchResult)
            }
            // if (err != null) {
            //     batchResult = "Fail"
            //     res.json(batchResult)
            //     throw err;

            // } else {
            //     batchResult = "Pass"
            //     res.json(batchResult)
            // }
        } catch (err) {
            console.log(err);
        }
    })
}

  /*logic Description: check any compilation errors store in mvn.txt file */
function compilationErrLogic(req, res) {
    var filePath = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/${req.query.userName}/Mvn.txt`);
    if (fs.existsSync(filePath)) {
        lr = new LineByLineReader(filePath);
        let capturedLines = '';
        let flag = false;
        lr.on('error', function (err) {
            // 'err' contains error object
            console.log(err);
        });

        lr.on('line', function (line) {
            // 'line' contains the current line without the trailing newline character.
            if (line.includes("[ERROR] COMPILATION ERROR :")) {
                flag = true;
            } else if (line.includes("[INFO] BUILD FAILURE")) {
                flag = false;
            }
            if (flag) {
                capturedLines = `${capturedLines}${line}\n`
            }
        });

        lr.on('end', function () {
            // All lines are read, file is closed now.
            db.testScript.update({
                "projectId": req.query.projectId,
                "scriptId": req.query.scriptId
            }, {
                $set: {
                    "testCaseStatus": "Automated",
                    "lastAutomatedExecutionStatus": "Fail"
                }
            }, (err, doc) => {
                if (err) {
                    throw err
                }
            })
            res.json(capturedLines);
        });
    }
}


function apiTestngResult(req, res) {
    var data = req.body
    checkTestngReport(data, res)
}

  /*logic Description: check testng-results.xml file is generated, then updating to script collection if not file is generated.
   if generated call another function*/
function checkTestngReport(completeObject, res) {
    var pathOfFile;
    pathOfFile = path.join(__dirname, `../../uploads/opal/${completeObject.projectName}/${completeObject.userName}/projectToRun/target/surefire-reports/testng-results.xml`);
    if (fs.existsSync(pathOfFile)) {
        console.log(" testngresults.xml file Present" + "\n\n");
        result = 'Pass1';
        convertXmlToJson(completeObject, res)
    } else {
        console.log('FIle Not present')
        result = 'Fail';
        res.json({ "message": "Fail" });
        let updateCondition = {
            scriptId: completeObject.scriptId
        }
        let updateParams = {
            $set: {
                testCaseStatus: " Automated",
                lastAutomatedExecutionStatus: "Fail"
            }
        }
        dbServer.updateOne(db.testScript, updateCondition, updateParams)
    }
}

  /*logic Description: convert the data from xml to json form and update the testscript collection 
   if generated call another function*/
function convertXmlToJson(data, res) {
    console.log("converting xml to json");
    var projectPath;
    var checkReportJson;
    projectPath = path.join(__dirname, "../../uploads/opal/" + data.projectName + "/" + data.userName + "/projectToRun")
    checkReportJson = path.join(__dirname, "../../uploads/opal/" + data.projectName + "/" + data.userName + "/projectToRun/target/surefire-reports/Report.json");
    var file = path.join(__dirname, `../../uploads/opal/xmlToJson.bat`)
    var wstream = fs.createWriteStream(file);
    wstream.on('finish', function () {
        console.log(`converting batch file finished writing   ${file}`);
    });
    wstream.write('@echo off\n');
    wstream.write(`cd ${projectPath}  &&  mvn exec:java -Dexec.mainClass=reuseablePackage.feature.XMLtoJSON `);
    wstream.end(function () {
        console.log(`done writing  ${file} `);
        var xmltoJsonFile = path.join(__dirname, "../../uploads/opal/xmlToJson.bat")
        cmd.exec(xmltoJsonFile, (error, stdout, stderr) => {
            try {
                if (error != null) {
                    throw error;
                } else {
                    if (fs.existsSync(checkReportJson)) {
                        console.info('convertXmlToJson() for converting xml to json Execution time: %dms')
                        var result11 = 'Pass';
                        reportGeneration(data, res);
                        let updateCondition = {
                            scriptId: data.scriptId
                        }
                        let updateParams = {
                            $set: {
                                testCaseStatus: " Automated",
                                lastAutomatedExecutionStatus: "Pass"
                            }
                        }
                        dbServer.updateOne(db.testScript, updateCondition, updateParams)

                    } else {
                        var result11 = 'Fail';
                        let updateCondition = {
                            scriptId: data.scriptId
                        }
                        let updateParams = {
                            $set: {
                                testCaseStatus: " Automated",
                                lastAutomatedExecutionStatus: "Fail"
                            }
                        }
                        dbServer.updateOne(db.testScript, updateCondition, updateParams)
                        res.json({ "message": result11 });
                    }
                }
            }
            catch (error) {
                var result11 = 'Fail';
            }
            console.log('result is ', result11)
        });
    });
}

  /*logic Description: fetch the data from report.json file and store in an array and send array as response
   */
function reportGeneration(data1, res) {
    var ReportJson = path.join(__dirname, `../../uploads/opal/${data1.projectName}/${data1.userName}/projectToRun/target/surefire-reports/Report.json`);
    fs.readFile(ReportJson, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        var testSteps = obj['testng-results']['suite']['test']['class']["test-method"];
        console.log(testSteps.length);
        var multipleData = [];
        if (testSteps.length == undefined) {
            var obj1 = {}
            var aryObj1=[];
            obj1["StepName"] = testSteps.name;
            obj1["StepStatus"] = testSteps.status;
            //  console.log(testSteps["reporter-output"]);
            if(testSteps["reporter-output"]!=""){
            //  console.log(testSteps["reporter-output"]["line"],testSteps["reporter-output"]["line"]=="ResponseBody:",Array.isArray(testSteps["reporter-output"]["line"])==false);
                if(testSteps["reporter-output"]["line"]=="ResponseBody:"||testSteps["reporter-output"]["line"]=="ResponseHeaders:"||testSteps["reporter-output"]["line"]=="ResponseTime:"||Array.isArray(testSteps["reporter-output"]["line"])==false){
                    aryObj1.push(testSteps["reporter-output"]["line"]);
                    obj1["reporterOutputLine"]=aryObj1;
                }else{
                    obj1["reporterOutputLine"]=testSteps["reporter-output"]["line"];
                }
            }
            if (testSteps.exception && testSteps.exception.message) {
                obj1["stepMessage"] = testSteps.exception.message;
            }
            multipleData.push(obj1);
            res.json({ "data": multipleData, "message": "Pass" })
        }
        else {
            testSteps.forEach(ele => {
                var multipleObj = {};
                var aryObj=[];
                multipleObj["StepName"] = ele.name;
                multipleObj["StepStatus"] = ele.status;
                if(ele["reporter-output"]!=""){
                    if(ele["reporter-output"]["line"]=="ResponseBody:"||ele["reporter-output"]["line"]=="ResponseHeaders:"||ele["reporter-output"]["line"]=="ResponseTime:"||Array.isArray(ele["reporter-output"]["line"])==false){
                        aryObj.push(ele["reporter-output"]["line"]);
                        multipleObj["reporterOutputLine"]=aryObj;
                    }else{
                        multipleObj["reporterOutputLine"]=ele["reporter-output"]["line"];
                    }
                }
                if (ele.exception && ele.exception.message) {
                    multipleObj["stepMessage"] = ele.exception.message;
                }
                multipleData.push(multipleObj);
            });

            res.json({ "data": multipleData, "message": "Pass" })
        }
    })
}

  /*logic Description: fetch the responseValidationMethods
    */
function getValidationMethods(req, res) {
    db.responseValidationMethods.find({}, (err, methods) => {
        if (err) throw err;
        res.json(methods);
    })
}

/*logic Description: copy the script from main project to projectToRun folder
    */
async function copyRequiredScript(info) {
    console.log('copyRequiredScript!', info.body);
    var dirName1 = '../../uploads/opal/' + info.body.projectName + '/' + info.body.userName + '/projectToRun/src/test/java';
    let javaLink = path.join(__dirname, dirName1);
    fs.mkdirSync(javaLink);
    // var dirName12 = '../../uploads/opal/' + info.body.projectName + '/' + info.body.userName + '/projectToRun/src/test/java/' + info.body.moduleName;
    // let moduleLink = path.join(__dirname, dirName12);
    // fs.mkdirSync(moduleLink);
    // var dirName13 = '../../uploads/opal/' + info.body.projectName + '/' + info.body.userName + '/projectToRun/src/test/java/' + info.body.moduleName + '/' + info.body.featureName;
    // let featureLink = path.join(__dirname, dirName13);
    // fs.mkdirSync(featureLink);
    // var dirName2 = '../../uploads/opal/' + info.body.projectName + '/' + info.body.userName + '/projectToRun/src/test/java/' + info.body.moduleName + '/' + info.body.featureName + '/' + info.body.scriptName + ".java";
    // var sourcePath = '../../uploads/opal/' + info.body.projectName + '/MainProject/src/test/java/' + info.body.moduleName + '/' + info.body.featureName + '/' + info.body.scriptName + ".java";
    var dirName12 = '../../uploads/opal/' + info.body.projectName + '/' + info.body.userName + '/projectToRun/src/test/java/' + info.body.ModuleId;
    let moduleLink = path.join(__dirname, dirName12);
    fs.mkdirSync(moduleLink);
    var dirName13 = '../../uploads/opal/' + info.body.projectName + '/' + info.body.userName + '/projectToRun/src/test/java/' + info.body.ModuleId + '/' + info.body.FeatureId;
    let featureLink = path.join(__dirname, dirName13);
    fs.mkdirSync(featureLink);
    var dirName2 = '../../uploads/opal/' + info.body.projectName + '/' + info.body.userName + '/projectToRun/src/test/java/' + info.body.ModuleId + '/' + info.body.FeatureId + '/' + info.body.scriptId + ".java";
    var sourcePath = '../../uploads/opal/' + info.body.projectName + '/MainProject/src/test/java/' + info.body.ModuleId + '/' + info.body.FeatureId + '/' + info.body.scriptId + ".java";
    var fsCopy = require('fs-extra');
    let source = path.join(__dirname, sourcePath);
    let destination = path.join(__dirname, dirName2);
    console.log(source, 'paths', destination)
    await fsCopy.copy(source, destination)
        .then(() => {
            return console.log('Copy of selected script completed!');
        })
        .catch(err => {
            console.log('An error occured while copying the folder.')
            return console.error(err)
        })
}

/*logic Description: create the dummy project and copy the content from main project to projectToRun folder
    */
async function saveDummyProject(req, res) {
    var dirName1 = './uploads/opal/' + req.query.projectName + '/' + req.query.userName;
    fs.mkdir(dirName1, function (err) {
        console.log("dummy folder created");
    })
    var dirName2 = '../../uploads/opal/' + req.query.projectName + '/' + req.query.userName + '/projectToRun';
    fs.mkdir(dirName2, function (err) {
        console.log("projectToRun folder created");
    })
    var sourcePath = '../../uploads/opal/' + req.query.projectName + '/MainProject';
    let dirName = path.join(__dirname, dirName2)
    var fsCopy = require('fs-extra')
    let source = path.join(__dirname, sourcePath)
    let destination = path.join(dirName)
    await fsCopy.copy(source, destination)
        .then(() => {
            console.log('Copy completed!');
        })
        .catch(err => {
            console.log('An error occured while copying the folder.')
            return console.error(err)
        })
    var fsDel = require('fs-extra')
    // fsDel.remove('./uploads/opal/' + req.query.projectName + '/' + req.query.userName + '/projectToRun/Excel', err => {
    //     if (err) return console.error(err)
    //     console.log('excel deleted!')
    // })
    fsDel.remove('./uploads/opal/' + req.query.projectName + '/' + req.query.userName + '/projectToRun/src/test/java', err => {
        if (err) return console.error(err)
        console.log('script deleted!')
    })
    res.json({ "message": "created" })
}

/*logic Description: delete the dummy project means projectToRun folder
    */
function deleteDummyProject(req, res) {
    console.log('deleting dummy project', req.query.projectName);
    var fsDel = require('fs-extra');
    fsDel.remove('./uploads/opal/' + req.query.projectName + '/' + req.query.userName, err => {
        if (err) return console.error(err)
        console.log('dummy project folder deleted!')
        res.json({ "message": "deleted" })
    })
}

/*logic Description: check if script if free or locked
    */
async function checkApiScriptAvailablity(req, res) {
    console.log(req.body.scriptId, "fwear")
    let obj = {
        "scriptId": req.body.scriptId
    }
    var returnedScripts = await dbServer.findCondition(db.scriptLocking, obj);
    if (returnedScripts && returnedScripts.length && returnedScripts[0].lockedBy === 'none') {
        db.scriptLocking.update({ "lockedBy": req.body.userId }, {
            $set: {
                "lockedBy": "none"
            }
        })
        db.scriptLocking.update({ "scriptId": req.body.scriptId }, {
            $set: {
                "lockedBy": req.body.userId
            }
        })
        res.json("free")
    }
    else {
        res.json(returnedScripts[0].lockedBy)
    }
}

/*logic Description: update the script locking to none if it is free
    */
function clearScript(req, res) {
    db.scriptLocking.update({ "scriptId": req.body.scriptId }, {
        $set: {
            "lockedBy": "none"
        }
    })
    res.json({ "message": "script cleared" })
}

/*logic Description: check whether script has any steps or not
    */
function checkIfScriptHasActions(returnedScripts) {
    return !!(returnedScripts && returnedScripts[0] && returnedScripts[0].compeleteArray &&
        returnedScripts[0].compeleteArray[0].allObjectData &&
        returnedScripts[0].compeleteArray[0].allObjectData.allActitons);
}

/*logic Description: check whether difference in steps in database and stepts in UI 
    */
async function checkUnsavedChanges(req, res) {
    if (req.body.scriptId && req.body.allActions) {
        let obj = {
            "scriptId": req.body.scriptId
        }
        dbServer.findCondition(db.testScript, obj).then(returnedScripts => {

            console.log(checkIfScriptHasActions(returnedScripts))
            if (checkIfScriptHasActions(returnedScripts)) {
                // Check if Actions in DB is equal to Actions to compare
                var allActionsDb = returnedScripts[0].compeleteArray[0].allObjectData.allActitons;
                var changeFlag = false;
                if (req.body.allActions.length === allActionsDb.length) {
                    for (var i = 0; i < allActionsDb.length; i++) {
                        var uiObj = req.body.allActions[i];
                        if (allActionsDb[i].nlpData !== uiObj.nlpData) {
                            changeFlag = true;
                        }
                    }
                } else {
                    changeFlag = true
                }
                res.json(changeFlag)
            } else {
                // Check if new actions are added
                // return true if new actions are added from the UI
                if (req.body.allActions.length) {
                    res.json(true)
                } else {
                    res.json(false);
                }
            }


        }, err => {
            console.log(err);
            res.json(false)
        })
    } else {
        res.json(false)
    }
}

/*logic Description: delete script after execution
    */
function deleteScriptAfterRun(req, res) {
    rimraf(path.join(__dirname, `../../uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/src/test/java`), function (err) {
        if (err) {
            console.log(err);
            res.json("fail");
        } else {
            console.log("Successfully deleted Script which ran just now in dummy projectToRun folder");
            res.json("pass");
        }
    });
}

module.exports = {
    getGrammar: getGrammar,
    createXml: createXml,
    copyRequiredScript: copyRequiredScript,
    dbInsert: dbInsert,
    checkApiScriptAvailablity: checkApiScriptAvailablity,
    apiScriptExecution: apiScriptExecution,
    apiTestngResult: apiTestngResult,
    checkIfScriptGenerated: checkIfScriptGenerated,
    getValidationMethods: getValidationMethods,
    saveDummyProject: saveDummyProject,
    deleteDummyProject: deleteDummyProject,
    clearScript: clearScript,
    checkUnsavedChanges: checkUnsavedChanges,
    deleteScriptAfterRun: deleteScriptAfterRun,
    compilationErrLogic:compilationErrLogic
};