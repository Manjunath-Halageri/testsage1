const fs = require('fs');
const path = require('path')
const mongojs = require('mongojs');
const FileHound = require('filehound');
var LineByLineReader = require('line-by-line');
var fse = require("fs-extra");
const editJsonFile = require("edit-json-file");
var rimraf = require("rimraf");
var kill = require('tree-kill');
var cmd = require('child_process');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
const testCaseHeader = require('./createReuseAndTestCaseCoreService/importService');
const testCaseBody = require('./createReuseAndTestCaseCoreService/mainBodyService');
const testCaseBodyForAppium = require('./createReuseAndTestCaseCoreService/mainBodyServiceForAppium');
const jmxTestCaseBody = require('./createReuseAndTestCaseCoreService/jmxMainBodyService');
const testCaseClosure = require('./createReuseAndTestCaseCoreService/closureService');
const ExportMainClass = require('./createReuseAndTestCaseCoreService/exportMainBodyService');
const vncPortService = require('./vncPortService');
const { reject } = require('bluebird');
const mainClassObj = new ExportMainClass();

function getProjctFrameWork(req, res) {
    dbServer.findCondition(db.projectSelection, { projectSelection: req.query.projectName })
        .then((doc) => {
            res.json(doc);
        })
}

function getPageNameByDefaultGetCall(req, res) {
    db.objectRepository.find({ projectId: req.query.projectId }, function (err, doc) {
        res.json(doc);
    })
}

function getReusableFunctionListGetApiCall(req, res) {
    db.reuseableFunction.find({ "reuseProjectId": req.query.projectId }, (err, doc) => {
        res.json(doc)
    })
}

function getNlpGrammar(req, res) {
    db.actionList.aggregate([
        {
            "$match": {
                groupId: {$nin : ["group11", "group17"]},
                $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }]
            }
        },
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
        sendTestSageGrammarWithRD(docMain, res, req.query.projectId)
    })
}
function getZapNlpGrammar(req, res) {
    db.actionList.aggregate([
        {
            "$match": {
                groupId: { $ne: "group11" },
                $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }]
            }
        },
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
        sendTestSageGrammarWithRD(docMain, res, req.query.projectId)
    })
}

function sendTestSageGrammarWithRD(docMain, res, fetchReuse) {
    db.actionList.aggregate([
        {
            "$match": {
                "groupId": "group11",
                $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }]
            }
        },
        {
            "$lookup":
            {
                "from": "groups",
                "localField": "groupId",
                "foreignField": "groupId",
                "as": "result"
            }
        },
        { $unwind: "$result" },

        {
            "$lookup": {
                "from": "reuseableFunction",
                "localField": "actionList",
                "foreignField": "actionList",
                "as": "finalData"
            }
        },
        { $unwind: "$finalData" },
        { "$match": { "finalData.reuseProjectId": fetchReuse } }

    ], (err, doc) => {
        if (err) throw err;
        if (doc.length !== 0) {
            return res.json(docMain.concat(doc))
        }
        else {
            return res.json(docMain)
        }

    })
}

function getReusableFunctionNamesToDisplay(req, res) {

    db.reuseableFunction.find({ "reuseProjectId": req.query.projectId }, function (err, result) {
        let data = []; data = result.map((result) => ({ 'label': result.actionList, 'key': result.actionList, 'data': 'ReusableFun', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder" }))
        res.json(data);
    })
}

function checkIfReusefuncBeingUsedInScriptsBeforeDelete(req, res) {
    // We are passing value 1 as argument so that core logic can be executed in the below function in Delete scenario.
    // In update scenario , first argument is passed dynamically based on query execution.
    getScriptsUsingReusableFunction(1, req.query.projectId, req.query.reuseFunction)
        .then((scrList) => {
            res.json({ "scrList": scrList })
        })
}



function deleteReusableFunction(req, res) {

    let projectId = req.query.projectId;
    let projectName = req.query.projectName;
    let reuseFunction = req.query.reuseFunction;

    const promiseA = new Promise((resolutionFunc, rejectionFunc) => {
        db.actionList.aggregate([
            {
                "$match": {
                    "groupId": "group11",
                    $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }]
                }
            }, {
                "$lookup": {
                    "from": "reuseableFunction",
                    "localField": "actionList",
                    "foreignField": "actionList",
                    "as": "finalData"
                }
            }, { $unwind: "$finalData" },
            {
                "$match": {
                    "finalData.reuseProjectId": projectId,
                    "actionList": reuseFunction
                }
            }], function (err, doc) {

                try {
                    db.actionList.remove({
                        "_id": mongojs.ObjectId(doc[0]._id)
                    }, function (err, doc) {
                        resolutionFunc("done")
                    })
                }
                catch (error) {
                    console.log(error);
                    resolutionFunc("go ahead");
                }
            })
    });

    promiseA.then((val) => {
        db.reuseableFunction.remove({
            "reuseProjectId": projectId,
            "actionList": reuseFunction
        }, function (err, doc) {
            if (err) console.log(err);
            if (doc.deletedCount == 1) {
                res.json("Pass");
            } else {
                res.json("Fail");
            }
        })
    });

    var uploadPagePath = "./uploads/opal/" + projectName + "/MainProject/src/main/java/reuseablePackage/reuseFunction/" + `${reuseFunction}Class` + ".java";
    if (fs.existsSync(uploadPagePath)) {
        fs.unlink(uploadPagePath, function (err) {
            console.log(err)
        })
    }
}

function checkForDuplicateMethodName(req, res) {
    db.reuseableFunction.find({ "reuseProjectId": req.query.projectId, "reuseableData.reuseAbleMethod": req.query.reuseFunction }, (err, doc) => {
        if (err) console.log(err);
        if (doc.length !== 0) {
            res.json("Duplicate Method Names Are Not Allowed")
        }
        else {
            res.json("Succeess")
        }
    })
}

function checkForDuplicateMethodName2(req, res) {
    db.reuseableFunction.find({ "reuseProjectId": req.query.projectId, "reuseableData.reuseAbleMethod": req.query.reuseFunction, "_id": { $ne: mongojs.ObjectId(req.query.id) } }, (err, doc) => {
        if (err) console.log(err);
        if (doc.length !== 0) {
            res.json("Duplicate Method Names Are Not Allowed")
        }
        else {
            res.json("Succeess")
        }
    })
}

function getReuseId(req, res) {
    db.actionList.aggregate([
        {
            "$match": {
                "groupId": "group11",
                $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }]
            }
        }, {
            "$lookup": {
                "from": "reuseableFunction",
                "localField": "actionList",
                "foreignField": "actionList",
                "as": "finalData"
            }
        }, { $unwind: "$finalData" },
        {
            "$match": {
                "finalData.reuseProjectId": req.body.projectId,
                "actionList": req.body.reuseFunction
            }
        }], function (err, doc) {
            if (err) console.log(err);
            res.json(doc)
        })
}

async function deletePreviousReusableFunctionScript(req, res) {
    let value = await dbServer.findCondition(db.reuseableFunction, { "_id": mongojs.ObjectId(req.query.id) })
    console.log("kkkk ", value)
    var uploadPagePath = "./uploads/opal/" + req.query.projectName + "/MainProject/src/main/java/reuseablePackage/reuseFunction/" + `${value[0].actionList}Class` + ".java";
    if (fs.existsSync(uploadPagePath)) {
        fs.unlink(uploadPagePath, function (err) {
            if (err) {
                console.log(err);
                res.json("fail")
            }
            else {
                console.log("deleted previous script")
                res.json("done")
            }
        })
    } else {
        res.json("done")
    }
}


function createTestpostAllActions(req, res) {
    if (req.body[0].generateJmxFile) {
        createScriptForJmx(req.body[0], res);
    }
    else {
        req.body[0].allObjectData.allActitons.forEach((element099, index, array) => {
            delete req.body[0].allObjectData.allActitons[index].resulttypes09;
            delete req.body[0].allObjectData.allActitons[index].object1;
            if (index === array.length - 1) {
                insertToDb(req.body[0])
            }

        })

        /*
        Logic Desc: first check for data in complete array using script name. 
        if already there is any data in completeArray push the req.body value to completeArray
        else set to completeArray for first time
        Query: i am uisng find query to find the script is present or not.
               update query to update
        Result: success message from the query if insertion done properly else error messge
        */
        function insertToDb(body) {
            if (req.body[0].typeOfFunction === "reusableFunction") {
                seperateCallForReuseableHandling(req.body).then((value) => {
                    res.json(value)
                }
                )
            } else {
                var completeBody = [];
                console.log(body)
                completeBody.push(body);
                db.moduleName.find({ "projectId": req.body[0].projectId, "moduleName": req.body[0].moduleName }, function (err, moduleDetails) {
                    db.featureName.find({ "projectId": req.body[0].projectId, "moduleId": moduleDetails[0].moduleId, "featureName": req.body[0].featureName }, function (err, featureDetails) {
                        console.log("heyyy ", featureDetails[0].featureId)
                        db.testScript.find({ $and: [{ "featureId": featureDetails[0].featureId, "scriptName": completeBody[0].fileName }, { "compeleteArray.allObjectData.versionId": 1 }] }, function (err, doc) {
                            if (doc.length != 0) {
                                if (req.body[0].addToNewVersion) {
                                    db.testScript.update({ "featureId": featureDetails[0].featureId, scriptName: completeBody[0].fileName }, {
                                        $push: {
                                            compeleteArray: {
                                                allObjectData: completeBody[0].allObjectData,
                                                editDate: completeBody[0].editDate,
                                                editorName: completeBody[0].editorName,
                                                editComments: completeBody[0].editComments
                                            }
                                        },
                                        $set: {
                                            'compeleteArray.$.securityTesting': req.body[0].securityTesting,
                                            'lastAutomatedExecutionStatus': 'NotExecuted'
                                        }
                                    }, async function (err, doc) {
                                        if (err) { return err; }
                                        if (doc.nModified == 1) {
                                            let value = await fetchStatus(completeBody[0].fileName);
                                            res.json({ Status: "Scripts Updated Successfully", ScriptStatus: value[0].scriptStatus });
                                        }
                                    })
                                }
                                else {
                                    db.testScript.update({
                                        "featureId": featureDetails[0].featureId,
                                        scriptName: completeBody[0].fileName,
                                        'compeleteArray.allObjectData.versionId': req.body[0].allObjectData.versionId
                                    }, {
                                        $set: {
                                            'compeleteArray.$.securityTesting': req.body[0].securityTesting,
                                            'compeleteArray.$.allObjectData': req.body[0].allObjectData,
                                            'compeleteArray.$.editDate': completeBody[0].editDate,
                                            'compeleteArray.$.editorName': completeBody[0].editorName,
                                            'lastAutomatedExecutionStatus': 'NotExecuted'
                                        }
                                    }, async (err, doc) => {
                                        if (err) throw err;
                                        let value = await fetchStatus(completeBody[0].fileName);
                                        res.json({ Status: "Scripts Updated Successfully to Latest Version", ScriptStatus: value[0].scriptStatus });
                                    })
                                }
                            }
                            else {
                                db.testScript.update({ "featureId": featureDetails[0].featureId, scriptName: completeBody[0].fileName }, { $set: { compeleteArray: completeBody } }, async function (err, doc) {
                                    let value = await fetchStatus(completeBody[0].fileName);
                                    res.json({ Status: "Scripts Added Successfully", ScriptStatus: value[0].scriptStatus });
                                });
                            }
                        })
                    })
                })

            }
        }// inserting and updating the testScript value to testScript colllection
        function fetchStatus(scriptname) {
            return new Promise((resolve, reject) => {
                db.testScript.find({ scriptName: scriptname }, (err, doc) => {
                    if (err)
                        throw reject(err);
                    else resolve(doc)
                })
            })
        }
        search(req.body[0]);
        if (req.body[0].exportConfig === 'exportYes') { exportInitCall(req.body[0]) } else return;
    }
}

function seperateCallForReuseableHandling(reuseableFunctionData) {
    return new Promise((resolve, reject) => {
        var reuseScriptBody = [];
        reuseScriptBody.push(reuseableFunctionData[0].allObjectData)
        if (reuseableFunctionData[0].saveOrUpdate) {
            db.reuseableFunction.insert(
                {
                    reuseProjectId: reuseableFunctionData[0].projectid,
                    reuseProjectName: reuseableFunctionData[0].projectName,
                    reuseFileName: reuseableFunctionData[0].fileName,
                    typeOfFunction: reuseableFunctionData[0].typeOfFunction,
                    reuseableData: reuseableFunctionData[0].reusable,
                    reuseableParameterLength: reuseableFunctionData[0].reusableParameterLength,
                    reuseableScriptVariables: reuseableFunctionData[0].allVariablesForScript,
                    reuseableCompleteArray: reuseScriptBody,
                    actionList: reuseableFunctionData[0].reusable.reuseAbleMethod
                }, async function (err, doc) {
                    if (err) { return err }
                    console.log("First")
                    let value = await callReusableFuncUsingNLP(reuseableFunctionData)
                    console.log(value)
                    console.log("Third")
                    db.actionList.insert(value, (err, doc) => {
                        if (err) throw err;
                        resolve("Script Generated Successfully")
                    })

                })
        }
        else {
            updateReusableFunctionData(reuseableFunctionData).then(value => {
                resolve(value);
            })
        }
    })

}

function callReusableFuncUsingNLP(reuseableFunctionData) {
    return new Promise((reslove, reject) => {
        var reuseActionListObj = {};
        var frameworkId;
        if (reuseableFunctionData[0].framework === 'Appium') frameworkId = 1;
        else if (reuseableFunctionData[0].framework === 'Test NG') frameworkId = 2;
        else return;
        var methodName = reuseableFunctionData[0].reusable.reuseAbleMethod;
        var reuseParams = reuseableFunctionData[0].reusable.reuseAbleParameters
        reuseActionListObj["groupId"] = "group11"
        reuseActionListObj["actionList"] = methodName
        reuseActionListObj["object"] = "no"
        reuseActionListObj["inputField3"] = "no"
        reuseActionListObj["frameworkId"] = frameworkId
        if (reuseableFunctionData[0].reusable.reuseAbleParameters !== '') {
            reuseActionListObj["inputField2"] = "yes"
            if (!reuseableFunctionData[0].reusable.checkBoxValue) {
                reuseActionListObj["returnValue"] = "no"
                reuseActionListObj["nlpGrammar"] = `Call ${methodName} by Passing Parameters ${reuseParams}`
                reuseActionListObj["datatype"] = undefined
            }
            else {
                reuseActionListObj["returnValue"] = "yes"
                reuseActionListObj["nlpGrammar"] = `Call ${methodName} by Passing Parameters ${reuseParams} and store into variable V1`;
                reuseActionListObj["datatype"] = reuseableFunctionData[0].reusable.returnType
            }

        }
        else {
            reuseActionListObj["inputField2"] = "no"
            if (!reuseableFunctionData[0].reusable.checkBoxValue) {
                reuseActionListObj["returnValue"] = "no"
                reuseActionListObj["nlpGrammar"] = `Call ${methodName}`
                reuseActionListObj["datatype"] = undefined
            }
            else {
                reuseActionListObj["returnValue"] = "yes"
                reuseActionListObj["nlpGrammar"] = `Call ${methodName} and store into variable V1`;
                reuseActionListObj["datatype"] = reuseableFunctionData[0].reusable.returnType
            }
        }
        reslove(reuseActionListObj)
    })
}


function updateReusableFunctionData(reuseData) {
    return new Promise(async (resolve, reject) => {
        let value = await callReusableFuncUsingNLP(reuseData);
        db.actionList.update({ "_id": mongojs.ObjectId(reuseData[0].actionId) },
            {
                $set: {
                    actionList: value.actionList,
                    inputField2: value.inputField2,
                    returnValue: value.returnValue,
                    nlpGrammar: value.nlpGrammar,
                    datatype: value.datatype
                }
            }, function (err, doc) {
                if (err) { return err; }
                updateReusebleFunctionCollection(reuseData);
                var promiseA = getScriptsUsingReusableFunction(doc.nModified, reuseData[0].projectid, reuseData[0].previousMethodNameforupdate)
                promiseA.then((scriptList) => {
                    let needToNotifyUser = false;
                    if (scriptList.length != 0) {
                        needToNotifyUser = true;
                    }
                    resolve({
                        "updating": "done111",
                        "needToNotifyUser": needToNotifyUser,
                        "scriptList": scriptList
                    })
                })
            })
    })
}

function updateReusebleFunctionCollection(reuseData) {
    var reuseScriptBody = [];
    reuseScriptBody.push(reuseData[0].allObjectData);
    db.reuseableFunction.update({ "_id": mongojs.ObjectId(reuseData[0].mongoObjectId) },
        {
            $set:
            {
                reuseableCompleteArray: reuseScriptBody,
                reuseableScriptVariables: reuseData[0].allVariablesForScript,
                reuseableData: reuseData[0].reusable,
                actionList: reuseData[0].reusable.reuseAbleMethod,
                reuseableParameterLength: reuseData[0].reusableParameterLength,
                reuseFileName: reuseData[0].fileName
            }
        }, function (err, doc) {
            if (err) console.log(err);
            return;
        })
}

function getScriptsUsingReusableFunction(nModified, projectId, actionList) {
    return new Promise((resolve, reject) => {
        var scriptList = [];
        if (nModified === 1) {
            db.testScript.find({
                "projectId": projectId
            }, function (err, doc) {
                if (doc.length != 0) {
                    for (let i = 0; i < doc.length; i++) {
                        // Here compeleteArray may or maynot be present hence tryCatch block.
                        try {
                            for (let index = 0; index < doc[i].compeleteArray[0].allObjectData.allActitons.length; index++) {
                                const element = doc[i].compeleteArray[0].allObjectData.allActitons[index];
                                if (element.Groups == "User Function" && element.ActionList == actionList) {
                                    scriptList.push(doc[i].scriptName)
                                    break;
                                }
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    resolve(scriptList);
                } else {
                    resolve(scriptList);
                }
            })
        }
        else {
            resolve(scriptList);
        }
    })
}


/*
  Logic Desc:fetching the template from the autoScript based on the framework selected.
  Result: gives the template as output;
   */
function search(data) {
    if (data.typeOfFunction === "reusableFunction") {
        var tempPath = "../../autoScript/testNgTemplate/Reuseable.java";
    }
    else if (data.framework === 'Appium') {
        var tempPath = "../../autoScript/testNgTemplate/appiumMainTemplate.java";

    }
    else if(data.securityTesting === true){
        var tempPath = "../../autoScript/testNgTemplate/testngMainTemplatezap.java";
    }
    else {
        var tempPath = "../../autoScript/testNgTemplate/testngMainTemplate.java";
    }

    var completePath = path.join(__dirname, tempPath);
    console.log(completePath)
    templateExcecute(completePath, data);

}// getting the templatePath

function createScriptForJmx(data, res) {
    var tempPath = "../../autoScript/testNgTemplate/testngMainTemplateJmx.java";
    var templatePath = path.join(__dirname, tempPath);

    var scriptPath09 = `../../uploads/opal/${data.projectName}/MainProject/src/test/java/${data.moduleId}/${data.featureId}/${data.scriptId}Jmx.java`;
    var scriptPath = path.join(__dirname, scriptPath09);

    fs.open(scriptPath, 'w', (err, file) => {
        if (err) {
            throw err;
        }
        testCaseHeader.scriptHeaderImports(data, templatePath, scriptPath, function (returnValue) {
            if (returnValue === "completedFromImport") {
                jmxTestCaseBody.jmx1(data, templatePath, scriptPath, function (returnFromMainBody) {
                    if (returnFromMainBody === "completedFromMainBody") {
                        testCaseClosure.url2(function (response) {
                            console.log(response);
                            fs.close(file, (err) => {
                                if (err) {
                                    throw err;
                                }
                                res.json({ Status: "JMX Generated Successfully" })
                            })
                        });
                    }
                })
            }
        });
        console.log("File is created.");
    });
}

function exportInitCall(data) {
    if (data.typeOfFunction === "reusableFunction") {
        var tempPath = "../../autoScript/testNgTemplate/Reuseable.java";
    }
    else if (data.framework === 'Appium') {
        var tempPath = "../../autoScript/testNgTemplate/appiumMainTemplate.java";

    }
    else {
        var tempPath = "../../autoScript/testNgTemplate/testngMainTemplate.java";
    }

    var completePath = path.join(__dirname, tempPath);
    templateExcecuteForExport(completePath, data);

}

/*
Logic Desc:to get the path to store the testScript.all the scripts are stored in their respective module feature and
in selected script having .java extension, if the type of function is reuseable 
the script are stored in the reusablePackage inside reuseFunction folder.
it gives an relative path use path.join(__dirname with relative path) to convert it absolute path.
Result: gives the relative path to store the script;
*/
function templateExcecute(testPath, data) {

    var templatePath = testPath;
    if (data.typeOfFunction === "reusableFunction") {

        var scriptPath09 = `../../uploads/opal/${data.projectName}/MainProject/src/main/java/reuseablePackage/reuseFunction/${data.reusable.reuseAbleMethod}Class.java`;
    }
    else {
        var scriptPath09 = `../../uploads/opal/${data.projectName}/MainProject/src/test/java/${data.moduleId}/${data.featureId}/${data.scriptId}.java`;
    }

    var scriptPath = path.join(__dirname, scriptPath09);
    // fs.createWriteStream(scriptPath);
    trail(data, templatePath, scriptPath)


}
function templateExcecuteForExport(testPath, data) {
    var templatePath = testPath;
    if (data.typeOfFunction === "reusableFunction") {
        var scriptPath09 = `../../uploads/export/${data.projectName}/src/main/java/reuseablePackage/reuseFunction/${data.reusable.reuseAbleMethod}Class.java`;
    }
    else {
        var scriptPath09 = `../../uploads/export/${data.projectName}/src/test/java/${data.moduleId}/${data.featureId}/${data.scriptId}.java`;
    }
    // var scriptPath09 = `../uploads/export/${data.projectName}/src/test/java/${data.moduleName}/${data.featureName}/${data.fileName}.java`;
    var scriptPath = path.join(__dirname, scriptPath09);
    // fs.createWriteStream(scriptPath);
    trailExport(data, templatePath, scriptPath)

}

/*
Logic Desc: trail function is a call seperate function for writing header,body and clouser code.
it consits of three inner function namely:
1) scriptHeader: to write all the header code which required to run the scripts and adds dependency like pom.
2) url1: its consits of main logic which will going to write the body of the scripts in step level format;\
          intial it will change the class name to selected script name, and writes the body code.
          function is divided in  too many sub function based on the groups each group has its own logic 
          for script building.
3) url2: its an closing function don't have any logic just confirms the script generation completeion.
Result: get the callback from the each function on checking the callback value i am trigerring the next function.
 */
function trail(data, templatePath, scriptPath) {
    if (data.framework === "Appium") {
        // The fs.open() method returns a file descriptor as a second parameter of the callback method. 
        // The w flag ensures that the file is created if it doesn't already exist. If the file already exists,
        //  fs.open() overwrites it and removes all its content.
        fs.open(scriptPath, 'w', (err, file) => {
            if (err) {
                throw err;
            }
            testCaseHeader.scriptHeaderImports(data, templatePath, scriptPath, function (returnValue) {
                if (returnValue === "completedFromImport") {
                    testCaseBodyForAppium.url1(data, templatePath, scriptPath, function (returnFromMainBody) {
                        if (returnFromMainBody === "completedFromMainBody") {
                            testCaseClosure.url2(function (response) {
                                console.log(response);
                                fs.close(file, (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                            });
                        }
                    })
                }
            });
            console.log("File is created.");
        });
    }
    else {
        // The fs.open() method returns a file descriptor as a second parameter of the callback method. 
        // The w flag ensures that the file is created if it doesn't already exist. If the file already exists,
        //  fs.open() overwrites it and removes all its content.
        fs.open(scriptPath, 'w', (err, file) => {
            if (err) {
                throw err;
            }
            testCaseHeader.scriptHeaderImports(data, templatePath, scriptPath, function (returnValue) {
                if (returnValue === "completedFromImport") {
                    testCaseBody.url1(data, templatePath, scriptPath, function (returnFromMainBody) {
                        if (returnFromMainBody === "completedFromMainBody") {
                            testCaseClosure.url2(function (response) {
                                console.log(response);
                                fs.close(file, (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                })
                            });
                        }
                    })
                }
            });
            console.log("File is created.");
        });
    }
}

function trailExport(data, templatePath, scriptPath) {
    fs.open(scriptPath, 'w', (err, file) => {
        if (err) {
            throw err;
        }
        testCaseHeader.scriptHeaderImports(data, templatePath, scriptPath, function (returnValue) {
            if (returnValue === "completedFromImport") {
                mainClassObj.on('scriptGenerated', (args) => {
                    if (args.Mesage === 'completedFromMainBody') {
                        testCaseClosure.url2(function (response) {
                            console.log(response);
                            fs.close(file, (err) => {
                                if (err) {
                                    throw err;
                                }

                            })
                        });
                    }
                })
                mainClassObj.mainMethod(data, templatePath, scriptPath)
            }
        });

    })

}

function getbrowser(req, res) {
    db.browsers.find({}, function (err, doc) {
        res.json(doc);
    });
}

function createUserFolder(req) {
    var tempPath = `../../uploads/opal/${req.query.projectName}/${req.query.userName}`;
    var completePath = path.join(__dirname, tempPath);
    try {
        if (!fs.existsSync(completePath)) {
            fs.mkdirSync(completePath)
        }
    } catch (err) {
        console.error(err)
    }

}

function createProjectToRunFolder(req) {
    var tempPath = `../../uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun`;
    var completePath = path.join(__dirname, tempPath);
    try {
        if (!fs.existsSync(completePath)) {
            fs.mkdirSync(completePath)
        }
    } catch (err) {
        console.error(err)
    }
}

// Inside username folder,the below function will Copy content of MainProject folder except Scripts, Excel, suites and jmxFiles folder into 
// projectToRun folder inside username folder. 
function copyRequiredContentIntoProjectToRunFolder(req, res) {
    let promiseArr = [];
    var tempPath = `../../uploads/opal/${req.query.projectName}/MainProject`;
    var directory = path.join(__dirname, tempPath);
    fs.readdirSync(directory).forEach(file => {
        if (file != "jmxFiles") {
            if (file != "Excel") {
                if (file != "suites") {
                    promiseArr.push(new Promise((resolve, reject) => {
                        if (file != "src") {
                            fse.copy(`./uploads/opal/${req.query.projectName}/MainProject/${file}`, `./uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/${file}`, function (err) {
                                if (err) {
                                    reject(err)
                                    // return console.error(err)
                                } else {
                                    resolve('copy completed')
                                }
                            });
                        } else {
                            fse.copy(`./uploads/opal/${req.query.projectName}/MainProject/${file}/main`, `./uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/${file}/main`, function (err) {
                                if (err) {
                                    reject(err)
                                    // return console.error(err)
                                } else {
                                    resolve('copy completed')
                                }
                            });

                        }
                    }))
                }
            }
        }
    });

    Promise.all(promiseArr).then((result) => {
        res.json("pass");
    }).catch((err) => {
        rimraf(`./uploads/opal/${req.query.projectName}/${req.query.userName}`, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully deleted a directory");
            }
            res.json("fail");
        });

    })
}


// function copyRequiredContentIntoProjectToRunFolder(req, res) {
//     //let promiseArr = [];
//     var tempPath = `../../uploads/opal/${req.query.projectName}/MainProject`;
//     var directory = path.join(__dirname, tempPath);
//     fs.readdirSync(directory).forEach((file, index) => {
//         if (file != "jmxFiles") {
//             if (file != "Excel") {
//                     if (file != "src") {
//                         fse.copy(`./uploads/opal/${req.query.projectName}/MainProject/${file}`, `./uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/${file}`, function (err) {
//                             if (err) {
//                                 res.json("fail");
//                                 // return console.error(err)
//                             }
//                         });
//                     } else {
//                         fse.copy(`./uploads/opal/${req.query.projectName}/MainProject/${file}/main`, `./uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/${file}/main`, function (err) {
//                             if (err) {
//                                 res.json("fail");
//                                 // return console.error(err)
//                             }
//                         });

//                     }
//             }
//         }
//         if(index==directory.length-1){
//             res.json("pass")
//         }
//     });
// }

function importPriority(req, res) {
    db.priority.find({}, function (err, doc) {
        res.json(doc);
    })
}

function importType(req, res) {
    db.type.find({}, function (err, doc) {
        res.json(doc);
    })
}

function getUploadedApkName(req, res) {
    db.uploadedApkInfo.find({}, function (err, doc) {
        res.json(doc);
    })
}

function viewVersionHistoryGetCall(req, res) {
    db.testScript.aggregate([
        {
            $match: {
                "projectId": req.query.projectId,
                "scriptId": req.query.scriptId
            }
        },
        { $unwind: '$compeleteArray' },
        { $group: { _id: { version: '$compeleteArray.allObjectData.versionId', editorName: '$compeleteArray.editorName', editedDate: '$compeleteArray.editDate', comments: '$compeleteArray.editComments' } } },
        { $project: { "_id": 0, VersionId: "$_id.version", EditedBy: '$_id.editorName', EditedOn: '$_id.editedDate', Commments: '$_id.comments' } },
        { $sort: { 'VersionId': 1 } }
    ], (err, doc) => {
        if (err) throw err;
        else res.json(doc)
    })
}

function deleteDummyProject(req, res) {

    fse.remove(`./uploads/opal/${req.query.projectName}/${req.query.userName}`)
        .then(() => {
            console.log('success!')
            res.json("pass");
        })
        .catch(err => {
            console.error(err)
            res.json("fail")
        })

}

function resetLockNUnlockParameters(req, res) {
    db.loginDetails.update(
        { "projectId": req.query.projectId, "userName": req.query.userName },
        { $set: { "selectedScript": "none" } }, (err, doc) => {
            if (err) {
                console.log(err);
                res.json("Something went wrong while resetting the database!!!");
            } else {
                res.json("Reset successfull!");
            }
        }
    )
}

function checkIfScriptFree(req, res) {
    dbServer.findCondition(db.testScript, { "projectId": req.query.projectId, "scriptId": req.query.scriptId })
        .then((doc) => {
            if (doc[0]["lockedBy"] == "none" || doc[0]["lockedBy"] == req.query.userId) {
                dbUpdateReuse(req, res);
            } else {
                db.loginDetails.find({
                    "userId": doc[0]["lockedBy"],
                    "projectId": req.query.projectId
                }, (err, doc1) => {
                    if (doc1[0]["selectedScript"] == req.query.scriptId) {
                        res.json({ "beingUsedBy": doc1[0]["userName"] });
                    } else {
                        dbUpdateReuse(req, res);
                    }
                })
            }
        })
}

function dbUpdateReuse(req, res) {
    let promiseArr = [];

    let proA = new Promise((resolve, reject) => {
        db.testScript.update(
            { "projectId": req.query.projectId, "scriptId": req.query.scriptId },
            { $set: { "lockedBy": req.query.userId } }, (err, doc) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve("Done updated");
                }
            }
        )
    })
    promiseArr.push(proA);

    let proB = new Promise((resolve, reject) => {
        db.loginDetails.update(
            { "projectId": req.query.projectId, "userId": req.query.userId },
            { $set: { "selectedScript": req.query.scriptId } }, (err, doc) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve("Done updated");
                }
            }
        )
    })
    promiseArr.push(proB);

    Promise.all(promiseArr)
        .then(() => {
            res.json({ "beingUsedBy": "lockedNow" });
        })
        .catch(() => {
            res.json("Something went wrong while Updating database!!!");
        })

}

function fetchMultipleStepDataPostCall(req, res) {
    db.actionList.aggregate([
        {
            "$match": {
                $and: [
                    { "object": "yes" },
                    { "defaultObjectType": { $in: [req.query.objectDataValue] } }
                ]
            }
        },
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

    ], async (err, doc) => {
        if (err) { console.log(err) }
        else {
            await res.json(doc)
        }
    })
}

function saveVariableCall(req, res) {
    db.testScript.update({ scriptId: req.body.scriptIdForVariableSave },
        { $set: { scriptVariableArray: req.body.allVaraiableInfo } },
        function (err, doc) {
            res.json(doc);
        });
}

function getVersionIdCount(req, res) {
    db.testScript.find({
        $and: [{ scriptName: req.query.scriptName },
        { "compeleteArray.allObjectData.versionId": { $exists: true, $eq: 1 } }]
    },
        function (err, doc) {
            res.json(doc)
        })
}

function insertExcelFilesArray(req, res) {
    let excelFileArray = [];
    let steps = req.body.steps.allActitons;
    let filterArr = steps.filter((step) => step["Excel"] == "yesExcel");
    excelFileArray = filterArr.map(element => element["Input2"].split(",")[0] + ".xlsx")
    let uniqueExcelFileArr = [...new Set(excelFileArray)]//use a Set to remove duplicates from an array

    db.testScript.update({
        "projectId": req.body.projectId,
        "scriptName": req.body.scriptName
    }, {
        $set: {
            "excelFilesUsed": uniqueExcelFileArr
        }
    }, (err, doc) => {
        if (err) {
            console.log(err)
            res.json("fail");
        } else {
            res.json("done");
        }

    })

}

async function copyScript(req) {

    let promiseArr = [];
    let result;
    console.log("heyyyyy ", req.query.jmxGen)
    if (req.query.jmxGen) {
        ["Jmx.java", "Config.json"].forEach((value) => {
            promiseArr.push(new Promise((resolve, reject) => {
                fse.copy(`./uploads/opal/${req.query.projectName}/MainProject/src/test/java/${req.query.moduleId}/${req.query.featureId}/${req.query.scriptId}${value}`,
                    `./uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/src/test/java/${req.query.moduleId}/${req.query.featureId}/${req.query.scriptId}${value}`, (err) => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        } else {
                            console.log("inside", value)
                            resolve('copy completed')

                        }
                    })

            }))
        })

    }
    else {
        [".java", "Config.json"].forEach((value) => {
            promiseArr.push(new Promise((resolve, reject) => {
                fse.copy(`./uploads/opal/${req.query.projectName}/MainProject/src/test/java/${req.query.moduleId}/${req.query.featureId}/${req.query.scriptId}${value}`,
                    `./uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/src/test/java/${req.query.moduleId}/${req.query.featureId}/${req.query.scriptId}${value}`, (err) => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        } else {
                            console.log("inside", value)
                            resolve('copy completed')

                        }
                    })

            }))
        })
    }



    await Promise.all(promiseArr).then((data) => {
        result = "pass"
    }).catch((err) => {
        result = "fail"
    })

    return result;


}

async function copyExcelFiles(req, res) {
    let promiseArr = [];
    // let doc = await dbServer.findOne(db.testScript, { "projectId": req.query.projectId, "scriptName": req.query.scriptName });
    // let excelFileArray = doc["excelFilesUsed"];
    // if (excelFileArray.length == 0) {
    //     res.json("No copying needed");
    //     return;
    // }
    var tempPath = `../../uploads/opal/${req.query.projectName}/MainProject/Excel`;
    var directory = path.join(__dirname, tempPath);
    fs.readdirSync(directory).forEach(file => {
        promiseArr.push(new Promise((resolve, reject) => {
            fse.copy(`./uploads/opal/${req.query.projectName}/MainProject/Excel/${file}`, `./uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/Excel/${file}`, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve('copy completed')
                }
            });
        }))
    })

    Promise.all(promiseArr).then((result) => {
        res.json("copy completed")
    }).catch((err) => {
        console.log(err)
        res.json("copying of excel files failed")
    })

}

async function generateBatchNXmlFile(req, res) {
    let fileBatch = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/${req.body.userName}/scriptExection.bat`)
    let batchContent = `@echo off\n
    cd ${path.join(__dirname, `../../uploads/opal/${req.body.projectName}/${req.body.userName}/projectToRun`)}  && mvn clean install > ${path.join(__dirname, `../../uploads/opal/${req.body.projectName}/${req.body.userName}/scriptExection.txt`)}`

    let promiseArr = [];
    promiseArr.push(toWriteToFile(fileBatch, batchContent));

    if (req.body.generateJmxFile) {
        let xmlfile = `./uploads/opal/${req.body.projectName}/${req.body.userName}/projectToRun/testng.xml`;
        let xmlExportfile = `./uploads/export/${req.body.projectName}/testng.xml`;
        let xmlContent = `<?xml version='1.0' encoding='UTF-8'?>\n
    <!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n
    <suite name="Suite">\n
    <test thread-count="5" name="Test">\n
    <classes>\n
    <class name="${req.body.moduleId}.${req.body.featureId}.${req.body.scriptId}Jmx"/>\n
    </classes>\n
    </test>\n
    </suite>`
        promiseArr.push(toWriteToFile(xmlfile, xmlContent));
        await editConfigFile(req);
    }
    else {
        let xmlfile = `./uploads/opal/${req.body.projectName}/${req.body.userName}/projectToRun/testng.xml`;
        let xmlExportfile = `./uploads/export/${req.body.projectName}/testng.xml`;
        let xmlContent = `<?xml version='1.0' encoding='UTF-8'?>\n
    <!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n
    <suite name="Suite">\n
    <test thread-count="5" name="Test">\n
    <classes>\n
    <class name="${req.body.moduleId}.${req.body.featureId}.${req.body.scriptId}"/>\n
    </classes>\n
    </test>\n
    </suite>`
        promiseArr.push(toWriteToFile(xmlfile, xmlContent));
    }

    // if (req.body.exportConfig === 'exportYes') {
    //     promiseArr.push(toWriteToFile(xmlExportfile, xmlContent));
    // }
    Promise.all(promiseArr).then(() => {
        res.json("doc")
    }).catch()

}

async function editConfigFile(req) {
    var orgNum = Number(req.body.orgId);

    var user = await new Promise((resolve, reject) => {
        db.loginDetails.find({ _id: mongojs.ObjectId(req.body.userId), "orgId": orgNum }, function (err, res) {
            if (err) { console.log("ERROR:", err); }
            console.log("RESULT:", res, res[0].portVNC);
            let portObj = {
                "hub": res[0].masterHubPort
            }
            resolve(portObj);
        });
    })

    var machine = await new Promise((resolve, reject) => {
        db.licenseDocker.find({ "machineType": "jmeterUsersMachine", "orgId": orgNum }, function (err, res) {
            if (err) { console.log("ERROR:", err); }
            console.log("RESULT:", res, res[0].machineIP);
            resolve(res[0].machineIP);
        });
    })

    var waiting = await new Promise((resolve, reject) => {

        var config = `../../uploads/opal/${req.body.projectName}/${req.body.userName}/projectToRun/src/test/java/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}Config.json`;
        var finalConfig = path.join(__dirname, config);
        console.log(finalConfig)
        var configFile = editJsonFile(finalConfig);
        configFile.set("IpAddress.IP", `http://${machine}:${user.hub}`);
        configFile.set("BrowserDetails.Browser", "Chrome");
        configFile.set("BrowserDetails.Version", "92.0.4515.159");
        configFile.set("ScriptName.scriptName", req.body.scriptId)
        configFile.save();
        console.log("updated config file data");
        resolve("pass");
    })
    console.log("first");
    console.log("THE VALUES ARE", machine, user, waiting)
}

function toWriteToFile(filePath, fileContent) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
                console.error(err)
                reject(err);
            } else {
                resolve("Done")
            }
        })
    })
}

function dockerIpAddressPortCall(req, res) {
    console.log("The info Iam getting here is ", req.body)
    var data09 = req.body;
    (async function changeIpPort(data09) {
        console.log(data09)
        var orgNum = Number(req.body.orgId);
        const lineReplace = require('line-replace');
        // var file;
        // const files = FileHound.create()
        //     .paths('../../uploads/opal/dockerExcecutionDependency/app')
        //     .match('ui*')
        //     .find()
        //     .then(files => {
        //         files.forEach(file => {
        //             console.log("File found Anil", file)
        //         });
        //         if (file == 'ui.js.tmp') {
        //             fs.rename('../../uploads/opal/dockerExcecutionDependency/app/ui.js.tmp', 'ui.js', (err) => {
        //                 if (err) throw err;
        //                 console.log('Rename complete!')
        //             });
        //         }
        //         else { return }
        //     });
        // C:\testsage\backend\uploads\dockerExcecutionDependency
        // let dockerPath09 = "../../uploads/dockerExcecutionDependency/app/ui.js"
        let dockerPath09 = "../../../UI/uploads/dockerExcecutionDependency/app/ui.js"
        let dockerFilePath = path.join(__dirname, dockerPath09);
        console.log("File path 1", dockerFilePath)

        var user = await new Promise((resolve, reject) => {
            console.log(req.body.userId+"//////////////////////////////////////////////////////////////////////"+orgNum)
            db.loginDetails.find({ _id: mongojs.ObjectId(req.body.userId), "orgId": orgNum }, function (err, res) {
                if (err) { console.log("ERROR:", err); }
                console.log("RESULT:", res, res[0].portVNC);
                let portObj = {
                    vnc: res[0].portVNC,
                    "hub": res[0].hubPort
                }
                resolve(portObj);
            });
        })

        var machine = await new Promise((resolve, reject) => {
            db.licenseDocker.find({ _id: mongojs.ObjectId(req.body.licenseId), "orgId": orgNum }, function (err, res) {
                if (err) { console.log("ERROR:", err); }
                console.log("RESULT:", res, res[0].machineDetails[0].url);
                resolve(res[0].machineDetails[0].url);
            });
        })

        var waiting = await new Promise((resolve, reject) => {
            db.licenseDocker.aggregate([
                { $match: { "_id": mongojs.ObjectId(req.body.licenseId), "orgId": orgNum } },
                { $unwind: "$machineDetails" },
                { $unwind: "$machineDetails.browsers" },
                { $unwind: "$machineDetails.browsers.version" },
                { $match: { "machineDetails.browsers.version.hubUrlPort": user.hub } },
                { $project: { _id: 0, "machineDetails.browsers.version.versionName": 1, "machineDetails.browsers.browserName": 1, "machineDetails.browsers.version.zapPort": 1} }
            ], function (err, res) {
                if (err) { console.log("ERROR:", err) }
                console.log("AGGRIGATE RESULT: ", res, res[0].machineDetails.browsers.browserName, res[0].machineDetails.browsers.version.versionName)
                var config = `../../uploads/opal/${req.body.projectName}/${req.body.userName}/projectToRun/src/test/java/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}Config.json`;
                var finalConfig = path.join(__dirname, config);
                var zapPort = res[0].machineDetails.browsers.version.zapPort;
                console.log(finalConfig)
                var configFile = editJsonFile(finalConfig);
                configFile.set("IpAddress.IP", `http://${machine}:${user.hub}`);
                configFile.set("ZapIPAddress.IP", `http://${machine}:${zapPort}`);
                configFile.set("BrowserDetails.Browser", res[0].machineDetails.browsers.browserName);
                configFile.set("BrowserDetails.Version", res[0].machineDetails.browsers.version.versionName);
                configFile.set('ProjectName.projectName', req.body.projectName);
                configFile.set('ExecutionType.type', "Main");
                configFile.save();
                console.log("updated config file data");
                resolve("pass");
            });
        })


        console.log("second");
        console.log("THE VALUES ARE", machine, user, waiting)
        var replace = `const host = "${machine}";const port = "${user.vnc}";password = "secret";`;

        // console.log("License Docker ID: ",req.body.licenseId)
        // let userPort = await vncPortService.fetchPort(req.body)
        // console.log("PORT NUMBER IS",userPort[0].vncPorts[0].port)
        // let assignPort= await vncPortService.assignPort(req.body,userPort)
        // let disablePort= await vncPortService.disablePort(req.body,userPort)
        // console.log(userPort[0].vncPorts[0].port)

        // var replace = `const host = "192.168.99.100";const port = "32768";password = "secret";`;
        lineReplace({
            file: dockerFilePath,
            line: 980,
            text: replace,
            addNewLine: true,
            callback: onReplace
        })

        function onReplace({ file, line, text, replacedText }) {
            console.log(file);
            res.json("success")
        }
    })(data09);
}

async function startScriptExecutionCall(req, res) {
    if (await req.body.jmxGen) {
        fs.rename(`./uploads/opal/${req.body.projectName}/${req.body.userName}/projectToRun/src/test/java/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}Config.json`, `./uploads/opal/${req.body.projectName}/${req.body.userName}/projectToRun/src/test/java/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}JmxConfig.json`, function (err, data) {
            if (err)
                console.log(err)
        })
    }
    var checkTestngResultsXml = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/${req.body.userName}/projectToRun/target/surefire-reports/testng-results.xml`);
    var childP = cmd.exec(path.join(__dirname, `../../uploads/opal/${req.body.projectName}/${req.body.userName}/scriptExection.bat`), (err, stdout, stderr) => {
        if (err) {
            console.log("Error:", err);
            // the following condition is to check is the error is compilation or a runtime error.
            // if below path exists then it is a runtime error,or else its a compilation error.
            if (!fs.existsSync(checkTestngResultsXml)) {
                res.json("compilationError")
                return;
            }
        }
        // if (req.body.jmxGen) {
        //     fs.unlink(path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/src/test/java/${req.body.moduleName}/${req.body.featureName}/${req.body.scriptName}Jmx.java`), function (err) {
        //         if (err) {
        //             console.log(err);
        //             res.json("fail");
        //         }
        //     });
        // }
        console.log("Batch/scriptExection.bat batch file executed " + "\n\n")
        res.json("Script Executed");
    })
    console.log("processIDDDDDD::: ", childP.pid);
    db.testScript.update({
        "projectId":req.body.projectId,
        "scriptId": req.body.scriptId
    }, {
        $set: {
            "processId": childP.pid
        }
    }, (err, doc) => {
        if (err) {
            throw err
        }
    })
}


function deleteScriptAfterRun(req, res) {
    rimraf(path.join(__dirname, `../../uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/src/test`), function (err) {
        if (err) {
            console.log(err);
            res.json("fail");
        } else {
            rimraf(path.join(__dirname, `../../uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/Excel`), function (err) {
                if (err) {
                    console.log(err);
                    res.json("fail");
                } else {

                    console.log("Successfully deleted Script which ran just now in dummy projectToRun folder");
                    res.json("pass");
                }
            });
        }
    });
}

function compilationErrLogic(req, res) {
    var filePath = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/${req.query.userName}/scriptExection.txt`);
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
                "scriptName": req.query.scriptName
            }, {
                $set: {
                    "scriptStatus": "Automated",
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

function convertXmlToJson(req, res) {
    let userId = req.query.userId;
    let licenseId = req.query.licenseId;
    let obj = {
        "userId": userId,
        "licenseId": licenseId
    }
    var file = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/${req.query.userName}/xmlToJson.bat`);
    var projectPath = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun`);
    var checkReportJson = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/target/surefire-reports/Report.json`);
    var wstream = fs.createWriteStream(file);
    wstream.on('finish', function () {
        console.log(`finished writing   ${file}`);
    });
    wstream.write('@echo off\n');
    wstream.write(`cd ${projectPath}  &&  mvn exec:java -Dexec.mainClass=reuseablePackage.feature.XMLtoJSON `);
    // on Node.js older than 0.10, add cb to end()
    wstream.end(function () {
        console.log(`done writing  ${file} `);
        console.log("createdfile and executing cmd /Batch/xmlToJson.bat ")
        // cmd.exec(__dirname + "/Batch/xmlToJson.bat");
        cmd.exec(file, (error, stdout, stderr) => {
            try {
                if (error != null) {
                    throw error;
                } else {
                    if (fs.existsSync(checkReportJson)) {
                        console.log('report.json file created');
                        res.json({ 'status': 'pass' });
                    } else {
                        res.json({ 'status': 'fail' });
                    }
                }
            }
            catch (error) {
                res.json({ 'status': 'fail' });
            }
        });
    });
    // releasePort(obj);// caling relaese function BY ANIL

}

//release function called here by ANIL
async function releasePort(obj) {
    console.log("###############Inside release Port function##########################")
    console.log(obj.userId, obj.licenseId)
    let releaseUserPort = await vncPortService.releaseAssignedPort(obj)
    console.log("Releasing PORT :", releaseUserPort.port)
    let enablePort = await vncPortService.enablePort(obj, releaseUserPort)
}

function extractInfoFromJson(req, res) {
    var ReportJson = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/${req.query.userName}/projectToRun/target/surefire-reports/Report.json`);
    fs.readFile(ReportJson, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        updateScriptStatusNLastAutoExecutionStatus(obj, req.query.projectId, req.query.scriptName);

        var testSteps = obj['testng-results']['suite']['test']['class']["test-method"];
        let flag = true;
        //Map works as For-Each loop but note:In Every iteration u have to return a value,and it will automatically pushes that value into array .Output will be array of objects or values
        let report = testSteps.map(stepDetails)
        //Once A step is failed, Next steps will not be executed.But by default we get NoSuchSessionExecption and Status as Fail.So we are making Status as 'Not Executed'. 
        report = report.map(failToNotExecuted)
        function failToNotExecuted(step) {
            if (flag) {
                if (step.status == "FAIL") {
                    flag = false;
                }
                return step;
            } else {
                step['status'] = 'Not Executed';
                step['message'] = '';
                return step;
            }
        }
        // we have a default step_0 in every script ,so deleting it in order to avoid confusion.
        report.splice(0, 1);
        res.json(report);
    })
}

let exceptionInfoFromDB = null;

db.exceptionInfo.find({}, function (err, doc) {//exceptionInfo collection contains exception and its english like statements.
    exceptionInfoFromDB = doc;
})

//In here, we form object which contains info corresponding to each step and add extra info which we want display to user .
function stepDetails(step) {
    var testStepsInfo = {};
    if (step.status === 'PASS') {
        testStepsInfo['name'] = step.name;
        testStepsInfo['status'] = step.status;
        testStepsInfo['message'] = 'Executed Successfully';
        return testStepsInfo;

    } else if (step.status === 'FAIL') {
        flag = false;
        testStepsInfo['name'] = step.name;
        testStepsInfo['status'] = step.status;
        testStepsInfo['exception'] = step.exception.class.split(".")[3];
        for (let index = 0; index < exceptionInfoFromDB.length; index++) {
            if (testStepsInfo['exception'] === exceptionInfoFromDB[index].exception) {
                testStepsInfo['message'] = exceptionInfoFromDB[index].message;
                break;
            }
        }
        return testStepsInfo;
    } else {
        console.log(" other than pass and fail")
    }
}

function updateScriptStatusNLastAutoExecutionStatus(info, proId, scriptName) {
    if (info["testng-results"]["failed"] == 0 && info["testng-results"]["skipped"] == 0) {
        //IF part == Script ran successfully
        db.testScript.update({
            "projectId": proId,
            "scriptName": scriptName
        }, {
            $set: {
                "scriptStatus": "Automated",
                "lastAutomatedExecutionStatus": "Pass"
            }
        }, (err, doc) => {
            if (err) {
                throw err
            }
        })
    } else {
        //else part == Script failed successfully
        db.testScript.update({
            "projectId": proId,
            "scriptName": scriptName
        }, {
            $set: {
                "scriptStatus": "Automated",
                "lastAutomatedExecutionStatus": "Fail"
            }
        }, (err, doc) => {
            if (err) {
                throw err
            }
        })
    }

}

function displayBlockDevices(req, res) {
    console.log(new Date(req.query.todayDate))
    db.blockDevices.aggregate([
        {
            "$match": {
                "UserId": req.query.UserId,
                $and: [
                    { "FromTime": { $lte: req.query.currentTime } },
                    { "ToTime": { $gt: req.query.currentTime } }
                ]
            }
        },
        {
            "$lookup":
            {
                "from": "devices",
                "localField": "DeviceId",
                "foreignField": "DevicesId",
                "as": "result"
            }
        },
        { $unwind: "$result" },
        { $match: { "result.uploadedApkName": req.query.apkNameToFetch } }


    ],
        function (err, doc) {
            res.json(doc)
        })
}

function generateTestNgForAppium(req, res) {

    let file = `./uploads/opal/${req.body.appiumProject.projectName}/${req.body.appiumProject.userName}/projectToRun/testng.xml`;
    //fs.createWriteStream(file);
    let fileBatch = path.join(__dirname, `../../uploads/opal/${req.body.appiumProject.projectName}/${req.body.appiumProject.userName}/scriptExection.bat`)


    // let fileBatch = __dirname + "\\Batch\\scriptExection.bat";
    //fs.createWriteStream(fileBatch);
    var config = `../../uploads/opal/${req.body.appiumProject.projectName}/${req.body.appiumProject.userName}/projectToRun/src/test/java/${req.body.appiumProject.moduleName}/${req.body.appiumProject.featureName}/${req.body.appiumProject.scriptName}Config.json`;
    var finalConfig = path.join(__dirname, config);
    console.log(finalConfig)
    var configFile = editJsonFile(finalConfig);
    configFile.set('ProjectName.projectName', req.body.appiumProject.projectName);
    configFile.set('ExecutionType.type', "Main");
    configFile.save();
    console.log("updated config file data");

    console.log(req.body.testNgXmlData.result)
    fs.writeFile(file, `<?xml version='1.0' encoding='UTF-8'?>\n
    <!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n
    <suite name="Suite" verbose="1" parallel="tests">\n
    <test thread-count="5" name="Test">\n
    <parameter name="deviceName" value="${req.body.testNgXmlData.result.DevicesName}"/>\n
    <parameter name="DeviceID" value="${req.body.testNgXmlData.result.DevicesId}"/>\n
    <parameter name="devicePlatform" value="Android"/>\n
    <parameter name="appPackage" value="${req.body.testNgXmlData.result.packageName}"/>\n
    <parameter name="appActivity" value="${req.body.testNgXmlData.result.packageActivity}"/>\n
    <parameter name="platformVersion" value="${req.body.testNgXmlData.result.DevicesVersion}"/>\n
    <parameter name="serverAddress" value="0.0.0.0:4723"/>\n
    <classes>\n
    <class name="${req.body.appiumProject.moduleName}.${req.body.appiumProject.featureName}.${req.body.appiumProject.scriptName}"/>\n
    </classes>\n
    </test>\n
    </suite>` , 'utf8', (err) => {
        batchFileCreationForExcecution(req.body.appiumProject.projectName, req.body.appiumProject.userName, fileBatch, function (getMyValue) {
            console.log(getMyValue)
            if (getMyValue === "completedBatchCreation") {
                res.json(["success"]);
                runBatchFile(fileBatch);
            }
        });
    })
}

function batchFileCreationForExcecution(batchCreationProjectName, batchCreationuserName, fileBatch, callback) {
    let batchContent = `@echo off\n
    cd ${path.join(__dirname, `../../uploads/opal/${batchCreationProjectName}/${batchCreationuserName}/projectToRun`)}  && mvn clean install > ${path.join(__dirname, `../../uploads/opal/${batchCreationProjectName}/${batchCreationuserName}/scriptExection.txt`)}`
    // fs.appendFileSync(fileBatch, `@echo off\n
    // cd ${path.join(__dirname, "../uploads/opal/" + batchCreationProjectName)}  && mvn clean install > ${__dirname}\\Batch\\scriptExection.txt`, 'utf8');
    //fs.appendFileSync(fileBatch, batchContent, 'utf8');
    fs.writeFile(fileBatch, batchContent, 'utf8', (err) => {
        returnValue = "completedBatchCreation";
        callback(returnValue);
    })

}

function runBatchFile(fileBatch) {
    cmd.exec(fileBatch, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Batch/scriptExection.bat batch file executed " + "\n\n")
        }
    })

    //  The below code is crashing the server for some unknown reason. So just comment below code to avoid 
    //  server crashing if needed.
    let appiumDependencyPath1 = "../../batchFiles/scrcpy.bat";
    let appiumDependencyPath2 = path.join(__dirname, appiumDependencyPath1);
    require('child_process').exec(appiumDependencyPath2, function (err, stdout, stderr) {
        if (err) {
            return console.log(err);
        }
    });
}

function getGrouprsAutoServiceCall(req, res) {
    db.groups.find({ $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }] }, function (err, doc) {
        console.log(doc)
        res.json(doc);
    })
}

function displayModulePage(req, res) {
    db.moduleName.find({ "moduleName": req.query.moduleName }, function (err, doc) {
        res.json(doc);
    })
}

function displayFeaturePage(req, res) {
    db.featureName.find({ "featureName": req.query.featureName }, function (err, doc) {
        res.json(doc);
    })
}

function deleteScript(req, res) {
    db.testScript.find({ "scriptName": req.query.scriptName, "projectId": req.query.projectId }, function (err, doc) {
        if (doc[0].scriptId != undefined) {

            db.testScript.remove({ "scriptId": doc[0].scriptId }, function (err, fea) {
            })
            db.jmxFiles.remove({ "jmxFileName": req.query.scriptName, "featureId": doc[0].featureId }, function (err, fea) {
            })
            db.testsuite.update({ "SelectedScripts.scriptId": doc[0].scriptId },
                { $pull: { 'SelectedScripts': { 'scriptId': doc[0].scriptId } } },
                { multi: true }, function (err, mod) {
                })
            db.release.update({ "releaseData.scriptId": doc[0].scriptId },
                { $pull: { 'releaseData': { 'scriptId': doc[0].scriptId } } },
                { multi: true }, function (err, mod) {
                    var uploadPagePath = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/MainProject/src/test/java/${doc[0].moduleId}/${doc[0].featureId}/${doc[0].scriptId}.java`)
                    var uploadPagePath1 = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/MainProject/src/test/java/${doc[0].moduleId}/${doc[0].featureId}/${doc[0].scriptId}Config.json`)
                    console.log(uploadPagePath)
                    if (fs.existsSync(uploadPagePath)) {
                        fs.unlink(uploadPagePath, function (err) {
                            if (err) {
                                console.log("Error1" + err)
                            }
                            else {
                                fs.unlink(uploadPagePath1, function (err) {
                                    console.log("Error2 ", err)
                                })
                                console.log("Script Deleted!!")
                                res.json(mod)
                            }
                        })
                    }
                    else {
                        res.json(mod)
                    }
                })


        } else {
            res.json(doc);
        }

    })
}

function deleteFeature(req, res) {
    db.featureName.find({ "featureName": req.query.featureName, "projectId": req.query.projectId }, function (err, doc) {
        if (doc[0].featureId != undefined) {

            db.testScript.remove({ "featureId": doc[0].featureId }, function (err, fea) {
            })
            db.jmxFiles.remove({ "featureId": doc[0].featureId }, function (err, fea) {
            })
            db.featureName.remove({ "featureId": doc[0].featureId }, function (err, rem) {
            })
            db.requirement.remove({ "featureId": doc[0].featureId }, function (err, mod) {
            })
            db.testsuite.update({ "SelectedScripts.featureId": doc[0].featureId },
                { $pull: { 'SelectedScripts': { 'featureId': doc[0].featureId } } },
                { multi: true }, function (err, mod) {
                })
            db.release.update({ "releaseData.featureId": doc[0].featureId },
                { $pull: { 'releaseData': { 'featureId': doc[0].featureId } } },
                { multi: true }, function (err, mod) {
                    var file = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/MainProject/src/test/java/${doc[0].moduleId}/${doc[0].featureId}`)
                    fse.remove(file, (err) => {
                        try {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log('feature folder deleted!')
                                res.json(mod);

                            }
                        }
                        catch (err) {
                            console.log('Error while delete' + err);
                            res.json(mod);
                        }
                    })
                })


        } else {
            res.json(doc);
        }

    })
}

function deleteModule(req, res) {
    db.moduleName.find({ "moduleName": req.query.moduleName, "projectId": req.query.projectId }, function (err, doc) {
        if (doc[0].moduleId != undefined) {

            db.testScript.remove({ "moduleId": doc[0].moduleId }, function (err, fea) {
            })
            db.jmxFiles.remove({ "moduleId": doc[0].moduleId }, function (err, fea) {
            })
            db.featureName.remove({ "moduleId": doc[0].moduleId }, function (err, rem) {
            })
            db.moduleName.remove({ "moduleId": doc[0].moduleId }, function (err, mod) {
            })
            db.requirement.remove({ "moduleId": doc[0].moduleId }, function (err, mod) {
            })
            db.testsuite.update({ "SelectedScripts.moduleId": doc[0].moduleId },
                { $pull: { 'SelectedScripts': { 'moduleId': doc[0].moduleId } } },
                { multi: true }, function (err, mod) {
                })
            db.release.update({ "releaseData.moduleId": doc[0].moduleId },
                { $pull: { 'releaseData': { 'moduleId': doc[0].moduleId } } },
                { multi: true }, function (err, mod) {
                    var file = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/MainProject/src/test/java/${doc[0].moduleId}`)
                    fse.remove(file, (err) => {
                        try {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log('module folder deleted!')
                                res.json(mod);

                            }
                        }
                        catch (err) {
                            console.log('Error while delete' + err);
                            res.json(mod);
                        }
                    })
                })


        } else {
            res.json(doc);
        }

    })
}

function checkPageUpdate(req, res) {
    db.objectRepository.find({
        $and: [{ "projectId": req.query.projectId },
        { "pageUpdate": true }]
    }, (err, doc) => {
        res.json(doc)
    })
}

function getUpdatedObject(req, res) {
    db.objectRepository.aggregate(
        {
            "$match": {
                "projectId": req.query.projectId,
                "pageName": req.query.pageName,
                "pageUpdate": true
            }
        },
        { "$unwind": "$objectName" },
        { $match: { "objectName.newObjectAdded": true } },
        (err, doc) => {
            res.json(doc)
        })
}

function pageUsedCall(req, res) {
    db.testScript.aggregate([{
        $match: {
            "projectId": req.query.projectId, "compeleteArray.allObjectData.allActitons.Page": req.query.pageName
        }
    }], (err, doc) => {
        if (err) console.log(err);
        res.json(doc)
    })
}

async function addToStepsCall(req, res) {
    req.body.scriptInfo.map(async (ele, ind, arr) => {
        let allActions = await logicForScriptAdd(ele.compeleteArray, req)
        db.testScript.update({
            $and: [
                { "projectId": ele.projectId }, { "scriptId": ele.scriptId }]
        },
            { $set: { 'compeleteArray.0.allObjectData.allActitons': allActions } }, (err, doc) => {
                if (err) console.log(err);
                if (arr.length - 1 === ind) {
                    res.json("Script Updated Successfully")
                }
            })
    })
}

function logicForScriptAdd(data, req) {
    return new Promise((resloves, reject) => {
        data.map((elem, indd, array) => {
            for (let r = 0; r < req.body.stepsInfo.length; r++) {
                elem.allObjectData.allActitons.push(req.body.stepsInfo[r])
                // elem.allObjectData.allActitons.splice(req.body.stepsInfo[r].ObjectSequence - 1, 0, req.body.stepsInfo[r])
                // elem.allObjectData.allActitons.forEach((ee, ii, aa) => {
                //     if (ii > req.body.stepsInfo[r].ObjectSequence - 1) {
                //         ee.ObjectSequence = ee.ObjectSequence + 1
                //     }
                // })
            }
            resloves(elem.allObjectData.allActitons)
        })
    })
}

function displayScriptPage(req, res) {
    var scriptData = []
    db.testScript.find({ "scriptId": req.query.scriptId }, function (err, doc) {
        scriptData.push(doc[0].scriptName, doc[0].description, doc[0].scriptStatus, doc[0].requiremantName, doc[0].scriptConfigdata)
        db.type.find({ "typeId": doc[0].typeId }, function (err, type) {
            scriptData.push(type[0].typeName)
            db.priority.find({ "priorityId": doc[0].priorityId }, function (err, priority) {
                scriptData.push(priority[0].priorityName)
                res.json(scriptData);
            })
        })
    })
}

function updateScriptData(req, res) {
    db.testScript.update({
        "projectId": req.body.projectId,
        "scriptId": req.body.scriptId
    },
        {
            $set: {
                "scriptName": req.body.updateName,
                "description": req.body.description,
                "scriptStatus": req.body.scriptStatus,
                "requiremantName": req.body.requirementName,
                "requirementId": req.body.requirementId,
                "scriptConfigdata.time": req.body.time,
                "scriptConfigdata.defaultBrowser": req.body.defaultBrowser,
                "scriptConfigdata.defaultVersion": req.body.defaultVersion,
                "scriptConfigdata.ipAddress": req.body.ipAddress

            }
        },
        function (err, doc) {
            db.type.find({ "typeName": req.body.type }, function (err, type) {
                db.testScript.update({ "scriptName": req.body.updateName }, {
                    $set: {
                        "typeId": type[0].typeId
                    }
                })
            })
            db.priority.find({ "priorityName": req.body.priority }, function (err, priority) {
                db.testScript.update({ "scriptName": req.body.updateName }, {
                    $set: {
                        "priorityId": priority[0].priorityId
                    }
                })
            })

            db.testsuite.update({ 'SelectedScripts.scriptId': req.body.scriptId }, {
                $set: { 'SelectedScripts.$[elem].scriptName': req.body.updateName }
            },
                {
                    multi: true,
                    arrayFilters: [{ 'elem.scriptId': req.body.scriptId }]
                }, function (err, doc) {
                    db.release.update({ 'releaseData.scriptId': req.body.scriptId }, {
                        $set: { 'releaseData.$[elem].scriptName': req.body.updateName }
                    },
                        {
                            multi: true,
                            arrayFilters: [{ 'elem.scriptId': req.body.scriptId }]
                        }, function (err, doc) {
                            db.jmxFiles.update({ 'jmxFileId': req.body.scriptId }, {
                                $set: { 'jmxFileName': req.body.updateName }
                            }, { multi: true }, function (err, doc) {
                                res.json("done");
                            })
                        })
                })

        })
}

function updateConfigFile(updateConfigPath, infoObj) {
    li = new LineByLineReader(updateConfigPath);
    var editedLine = '';
    li.on('error', function (err) { });
    li.on('line', function (lineNum) {
        if (lineNum.includes("\"Browser\":")) {
            let oldLine = lineNum;
            let NewLine = oldLine.replace(oldLine, "\"Browser\"" + ":" + "\"" + infoObj.defaultBrowser + "\"" + ",");
            editedLine += NewLine + "\n"
        }
        else if (lineNum.includes("Version")) {
            let oldLine = lineNum;
            let NewLine = oldLine.replace(oldLine, "\"Version\"" + ":" + "\"" + infoObj.defaultVersion + "\"");
            editedLine += NewLine + "\n"
        }
        else if (lineNum.includes("ImplicitWait")) {
            let oldLine = lineNum;
            let NewLine = oldLine.replace(oldLine, "\"ImplicitWait\"" + ":\"" + infoObj.time + "\"");
            editedLine += NewLine + "\n"
        }
        else if (lineNum.includes("IP")) {
            let oldLine = lineNum;
            let NewLine = oldLine.replace(oldLine, "\"IP\"" + ":" + "\"" + infoObj.ipAddress + "\"");
            editedLine += NewLine + "\n"
        }
        else {
            editedLine += lineNum + "\n"
        }
    })
    li.on('end', function () {
        fs.writeFile(updateConfigPath, editedLine, function (err) {
        });
    });
}

function allModuleData(req, res) {

    // checking for duplicate in project
    db.moduleName.find({ "moduleName": req.body.moduleName, "projectId": req.body.projectId }, function (err, result) {

        if (result.length > 0) {
            // duplicates are present
            console.log(" duplicate is present ", req.body.moduleName);
            result[0].duplicate = true;
            res.json(result);
        } else {
            // no duplicate
            createModule(req.body)
        }
    })

    function createModule(reqBody) {
        console.log(" createModule call  ", req.body.moduleName);

        db.countInc.find({}, function (err, doc) {
            mCount = doc[0].mCount
            mCount++
            smId = doc[0].moduleID
            var moduleId = smId + mCount
            db.moduleName.insert({ "moduleName": req.body.moduleName, "projectId": req.body.projectId, "moduleId": moduleId }, function (err, doc) {
                db.countInc.update({ "projectID": "pID" }, {
                    $set: {
                        "mCount": mCount
                    }
                }, function (err, doc1) {
                    var source = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + moduleId
                    var source2 = "./uploads/opal/" + req.body.projectName + "/MainProject/jmxFiles/" + moduleId
                    fs.mkdir(source, function (err) {
                        if (reqBody.exportConfig === "exportYes") {
                            var exportSource = "./uploads/export/" + req.body.projectName + "/src/test/java/" + moduleId
                            fs.mkdir(exportSource, () => { })
                        }
                    })
                    fs.mkdir(source2, () => {
                        console.log("createddd")
                    })
                })
                res.json([{ duplicate: false }]);
            });

        })
    }
}

function updateModule(req, res) {
    db.moduleName.update({ "moduleId": req.body.moduleId, "moduleName": req.body.moduleName }, {
        $set: {
            "moduleName": req.body.updateName
        }
    }, function (err, doc) {
        db.testScript.update({ "moduleId": req.body.moduleId }, {
            $set: {
                "compeleteArray.$.moduleName": req.body.updateName
            }
        }, { multi: true }, function (err, doc) {
            db.testsuite.update({ 'SelectedScripts.moduleId': req.body.moduleId }, {
                $set: { 'SelectedScripts.$[elem].moduleName': req.body.updateName }
            },
                {
                    multi: true,
                    arrayFilters: [{ 'elem.moduleId': req.body.moduleId }]
                }, function (err, doc) {
                    db.release.update({ 'releaseData.moduleId': req.body.moduleId }, {
                        $set: { 'releaseData.$[elem].moduleName': req.body.updateName }
                    },
                        {
                            multi: true,
                            arrayFilters: [{ 'elem.moduleId': req.body.moduleId }]
                        }, function (err, doc) {
                            res.json(doc)
                        })
                })
        })
    })
}

function updateFeature(req, res) {
    db.featureName.update({ "featureId": req.body.featureId, "featureName": req.body.featureName }, {
        $set: {
            "featureName": req.body.updateName
        }
    }, function (err, doc) {
        db.testScript.update({ "featureId": req.body.featureId }, {
            $set: {
                "compeleteArray.$.featureName": req.body.updateName
            }
        }, { multi: true }, function (err, doc) {
            db.testsuite.update({ 'SelectedScripts.featureId': req.body.featureId }, {
                $set: { 'SelectedScripts.$[elem].featureName': req.body.updateName }
            },
                {
                    multi: true,
                    arrayFilters: [{ 'elem.featureId': req.body.featureId }]
                }, function (err, doc) {
                    db.release.update({ 'releaseData.featureId': req.body.featureId }, {
                        $set: { 'releaseData.$[elem].featureName': req.body.updateName }
                    },
                        {
                            multi: true,
                            arrayFilters: [{ 'elem.featureId': req.body.featureId }]
                        }, function (err, doc) {
                            res.json(doc)
                        })
                })
        })
    })
}

function allFeatureData(req, res) {
    var featureFolder = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + "/" + req.body.moduleName + "/" + req.body.featureName
    var featureFolder2 = "./uploads/opal/" + req.body.projectName + "/MainProject/jmxFiles/" + "/" + req.body.moduleName + "/" + req.body.featureName
    // checking for duplicate in features in module
    db.moduleName.find({ "moduleName": req.body.moduleName, "projectId": req.body.projectId }, function (err, moduleDetails) {
        console.log(moduleDetails[0].moduleId);
        console.log(moduleDetails);
        db.featureName.find({ "moduleId": moduleDetails[0].moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName }, function (err, result) {
            if (result.length > 0) {
                // duplicates are present
                result[0].duplicate = true;
                res.json(result);
            } else {
                // no duplicate
                createFeature(moduleDetails[0].moduleId, req.body)
            }
        })
    })

    function createFeature(moduleId, reqBody) {
        fs.mkdir(featureFolder, function (err) {
            if (reqBody.exportConfig === "exportYes") {
                var exportSource = "./uploads/export/" + req.body.projectName + "/src/test/java/" + "/" + req.body.moduleName + "/" + req.body.featureName
                fs.mkdir(exportSource, () => { })
            }
        })
        fs.mkdir(featureFolder2, () => { })
        db.countInc.find({}, function (err, doc) {
            fCount = doc[0].fCount
            fCount++
            sfID = doc[0].featureID
            var featureId = sfID + fCount
            db.featureName.insert({ "moduleId": moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName, "featureId": featureId }, function (err, doc) {
                db.countInc.update({ "projectID": "pID" }, {
                    $set: {
                        "fCount": fCount
                    }
                }, function (err, doc1) {
                    var featureFolder = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + "/" + moduleId + "/" + featureId
                    var featureFolder2 = "./uploads/opal/" + req.body.projectName + "/MainProject/jmxFiles/" + "/" + moduleId + "/" + featureId
                    fs.mkdir(featureFolder, function (err) {
                        if (reqBody.exportConfig === "exportYes") {
                            var exportSource = "./uploads/export/" + req.body.projectName + "/src/test/java/" + "/" + moduleId + "/" + featureId
                            fs.mkdir(exportSource, () => { })
                        }
                    })
                    fs.mkdir(featureFolder2, () => { })
                })
                res.json([{ duplicate: false }]);
            });
        })
    }
}

function allScriptData(req, res) {

    db.countInc.find({}, function (err, doc) {
        sCount = doc[0].sCount;
        sCount++;
        ssID = doc[0].scriptID;
        var scriptId = ssID + sCount;
        db.moduleName.find({ "moduleName": req.body.moduleName, "projectId": req.body.projectId }, function (err, moduleDetails) {
            db.featureName.find({ "moduleId": moduleDetails[0].moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName }, function (err, featureDetails) {
                db.testScript.find({ "moduleId": moduleDetails[0].moduleId, "projectId": req.body.projectId, "featureId": featureDetails[0].featureId, "scriptName": req.body.scriptName }, function (err, scriptDetails) {
                    if (scriptDetails.length > 0) {
                        // duplicates are present
                        scriptDetails[0].duplicate = true;
                        res.json(scriptDetails);
                    } else {
                        // no duplicate
                        exportConfigCreation(req, moduleDetails[0].moduleId, featureDetails[0].featureId, scriptId)
                        writeScriptLevelConfigData(req.body, moduleDetails[0].moduleId, featureDetails[0].featureId, scriptId)
                        var scriptFile = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + "/" + moduleDetails[0].moduleId + "/" + featureDetails[0].featureId + "/" + scriptId + ".java"
                        var writerStream = fs.createWriteStream(scriptFile, { flags: 'w+' });
                        writerStream.end();
                        var scriptConfigdata = {};
                        scriptConfigdata["time"] = parseInt(req.body.time);
                        scriptConfigdata["defaultBrowser"] = req.body.defaultBrowser;
                        scriptConfigdata["defaultVersion"] = req.body.defaultVersion;
                        scriptConfigdata["ipAddress"] = req.body.ipAddress;

                        db.moduleName.find({ "moduleName": req.body.moduleName, "projectId": req.body.projectId }, function (err, doc) {
                            db.featureName.find({ "moduleId": doc[0].moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName }, function (err, fea) {
                                db.priority.find({ "priorityName": req.body.priority }, function (err, pri) {
                                    db.type.find({ "typeName": req.body.type }, function (err, type) {
                                        db.testScript.insert({
                                            "moduleId": doc[0].moduleId,
                                            "projectId": doc[0].projectId,
                                            "featureId": fea[0].featureId,
                                            "scriptName": req.body.scriptName,
                                            "scriptId": scriptId,
                                            "priorityId": pri[0].priorityId,
                                            "typeId": type[0].typeId,
                                            "requiremantName": req.body.requiremantName,
                                            "scriptConfigdata": scriptConfigdata,
                                            "description": req.body.description,
                                            "scriptStatus": req.body.scriptStatus,
                                            "requirementId": req.body.requirementId,
                                            "lastAutomatedExecutionStatus": req.body.lastAutomatedExecutionStatus,
                                            "lockedBy": "none",
                                            "status": "not executed",
                                            "jmxFile": false
                                        },
                                            function (err, scr) {
                                                db.countInc.update({ "projectID": "pID" }, { $set: { "sCount": sCount } })
                                                res.json([{ duplicate: false, scriptId: scriptId }]);
                                            })
                                    })
                                })
                            })
                        })
                    }
                })

            })
        })
    })
}

function exportConfigCreation(req, moduleId, featureId, scriptId) {
    if (req.body.exportConfig === 'exportYes') {
        var scriptFile = "./uploads/export/" + req.body.projectName + "/src/test/java/" + "/" + moduleId + "/" + featureId + "/" + scriptId + ".java"
        fs.createWriteStream(scriptFile);
        exportScriptLevelConfig(req.body, moduleId, featureId, scriptId);
    }
    else { }
}

function exportScriptLevelConfig(scriptConfigData, moduleId, featureId, scriptId) {
    var scriptFile = "./uploads/export/" + scriptConfigData.projectName + "/src/test/java/" + "/" + moduleId + "/" + featureId + "/" + scriptId + "Config" + ".json";
    var writerStream = fs.createWriteStream(scriptFile, { flags: 'w+' });

    var firstline = "\"ImplicitWait\"" + ":\"" + scriptConfigData.time + "\"" + "\n";
    var secondline = "\"Browser\"" + ":" + "\"" + scriptConfigData.defaultBrowser + "\"" + ",\n";
    var thridline = "\"Version\"" + ":" + "\"" + scriptConfigData.defaultVersion + "\"" + "\n";
    var fourthline = "\"IP\"" + ":" + "\"" + scriptConfigData.ipAddress + "\"" + "\n";

    setTimeout(() => {
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, "\"BrowserDetails\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, secondline);
        fs.appendFileSync(scriptFile, thridline);
        fs.appendFileSync(scriptFile, "},\n");
        fs.appendFileSync(scriptFile, "\"Timeout\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, firstline + ",\n");
        fs.appendFileSync(scriptFile, "\"ExplicitWait\"" + ":" + "\"40\"");
        fs.appendFileSync(scriptFile, "},\n");
        fs.appendFileSync(scriptFile, "\"ScreenshotOption\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, "\"CaptureOnEveryStep\"" + ":" + "\"Yes\",\n");
        fs.appendFileSync(scriptFile, "\"CaptureOnFailure\"" + ":" + "\"Yes\"\n");
        fs.appendFileSync(scriptFile, "},\n");
        fs.appendFileSync(scriptFile, "\"ExecutionCount\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, "\"reportCount\"" + ":" + "\"100\"\n");
        fs.appendFileSync(scriptFile, "},\n");
        fs.appendFileSync(scriptFile, "\"SuiteName\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, "\"suiteName\"" + ":" + "\"Suite1\"\n");
        fs.appendFileSync(scriptFile, "},\n");
        fs.appendFileSync(scriptFile, "\n" + '"IpAddress":\n' + "{\n");
        fs.appendFileSync(scriptFile, fourthline);
        fs.appendFileSync(scriptFile, "}\n" + "\n" + "}");
        writerStream.end();
    }, 1000);
}

function writeScriptLevelConfigData(scriptConfigData, moduleId, featureId, scriptId) {
    var scriptFile = "./uploads/opal/" + scriptConfigData.projectName + "/MainProject/src/test/java/" + "/" + moduleId + "/" + featureId + "/" + scriptId + "Config" + ".json";
    var writerStream = fs.createWriteStream(scriptFile);

    var firstline = "\"ImplicitWait\"" + ":\"" + scriptConfigData.time + "\"" + "\n";
    var secondline = "\"Browser\"" + ":" + "\"" + scriptConfigData.defaultBrowser + "\"" + ",\n";
    var thridline = "\"Version\"" + ":" + "\"" + scriptConfigData.defaultVersion + "\"" + "\n";
    var fourthline = "\"IP\"" + ":" + "\"" + scriptConfigData.ipAddress + "\"" + "\n";
    var fifthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:8080"  + "\"" + "\n";

    // setTimeout(() => {}, 0)http://192.168.99.100:4444
    setTimeout(() => {
        console.log("  executed  file ")
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, "\"BrowserDetails\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, secondline);
        fs.appendFileSync(scriptFile, thridline);
        fs.appendFileSync(scriptFile, "},\n");
        fs.appendFileSync(scriptFile, "\"Timeout\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, firstline + ",\n");
        fs.appendFileSync(scriptFile, "\"ExplicitWait\"" + ":" + "\"40\"");
        fs.appendFileSync(scriptFile, "},\n");
        fs.appendFileSync(scriptFile, "\"ScreenshotOption\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, "\"CaptureOnEveryStep\"" + ":" + "\"Yes\",\n");
        fs.appendFileSync(scriptFile, "\"CaptureOnFailure\"" + ":" + "\"Yes\"\n");
        fs.appendFileSync(scriptFile, "},\n");
        fs.appendFileSync(scriptFile, "\"ExecutionCount\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, "\"reportCount\"" + ":" + "\"100\"\n");
        fs.appendFileSync(scriptFile, "},\n");
        fs.appendFileSync(scriptFile, "\"SuiteName\":\n");
        fs.appendFileSync(scriptFile, "{\n");
        fs.appendFileSync(scriptFile, "\"suiteName\"" + ":" + "\"Suite1\"\n");
        fs.appendFileSync(scriptFile, "},\n");

        fs.appendFileSync(scriptFile, "\n" + '"ZapIPAddress":\n' + "{\n");
        fs.appendFileSync(scriptFile, fifthline);
        fs.appendFileSync(scriptFile, "},\n");

        fs.appendFileSync(scriptFile, "\n" + '"IpAddress":\n' + "{\n");
        fs.appendFileSync(scriptFile, fourthline);
        fs.appendFileSync(scriptFile, "}\n" + "\n" + "}");
        writerStream.end();
    }, 1000);
}

function getModuleFromDb(req, res) {
    db.moduleName.find({ "moduleName": req.query.moduleName }, function (err, doc) {
        res.json(doc)
    })
}

function getFeatureFromDb(req, res) {
    db.featureName.find({ "featureId":req.query.featureId,"featureName": req.query.featureName }, function (err, doc) {
        res.json(doc)
    })
}

function getScriptId(req, res) {
    db.testScript.find({ scriptName: req.query.scriptName }, function (err, doc) {
        res.json(doc)
    })
}

function checkForNlpOrNot(req, res) {
    db.testScript.find({ "scriptId": req.query.scriptId },
        {
            compeleteArray:
                { $elemMatch: { "allObjectData.allActitons.0.nlpData": "itsFromAutomation" } }
        }, (err, doc) => {
            try {
                if (doc[0].compeleteArray !== undefined) {
                    return res.json("Not Generated From NLP");
                }
                else {
                    return res.json("Generated From NLP");
                }
            }
            catch {
                console.log("Unexected Error" + err)
            }
        })
}

function getActionListOnGroupIdServiceCall(req, res) {
    if (req.query.groupId !== 'group11') {
        db.actionList.find({ groupId: req.query.groupId }, function (err, doc) {
            res.json(doc);
        })
    }
    else if (req.query.groupId === 'group11') {
        db.reuseableFunction.find({ reuseProjectId: req.query.projectId }, function (err, doc) {
            res.json(doc)
        })
    }
}

function getTestScriptconfigScriptLevel(req, res) {
    db.testScript.find({
        "projectId": req.query.projectId,
        "scriptName": req.query.scriptName
    }, function (err, doc) {
        if (doc.length == 0) {
            res.json(false);
        } else {
            res.json(doc);
        }
    });
}

function getprojectconfigScriptLevel(req, res) {
    db.projectSelection.find({ "projectId": req.query.projectId }, function (err, doc) {
        res.json(doc[0].projectConfigdata);
    });
}

function versions(req, res) {
    db.browsers.find({
        'browserName': req.query.browserName
    }, function (err, doc) {
        res.json(doc);
    });
}

function getVaraiableByDefault(req, res) {
    db.testScript.find({ scriptId: req.query.scriptId }, function (err, doc) {
        res.json(doc)
    })
}

function getTestCaseForEdit(req, res) {
    db.testScript.find({ scriptId: req.query.scriptId }, function (err, doc) {
        res.json(doc);
    })
}

function getActionMethodOnActionListGetCall(req, res) {
    db.actionList.find({ actionList: req.query.actionList }, function (err, doc) {
        res.json(doc);
    })
}

var getObjectsBasedOnProjectId = (proId) => new Promise((resolve, reject) => {
    // function getObjectsBasedOnProjectId(proId) {
    db.objectRepository.find({ "projectId": proId }, function (err, doc) {
        resolve(doc);
    })
})

function allInputs(req, res) {

    var objFilteredBasedOnProjectId = new Array();
    getObjectsBasedOnProjectId(req.body.projectId).then((result) => {
        objFilteredBasedOnProjectId = result;

        var pushObject12 = [];
        var count = 0;
        alAction = {}
        compeleteArray = [];
        var allDataSend = []
        var actionName;
        var actionTestNg;

        //to check whether test case name title given by user is as same as test case name title present in excel sheet
        if (req.body.resultRows[req.body.inputExcel.testValue - 1][0] == req.body.inputExcel.name) {
            var firstTestCaseNameStepCol = req.body.inputExcel.value;//test case steps column 
            let alpbbCatch = [
                {
                    "letter": "A",
                    "index": 0
                },
                {
                    "letter": "B",
                    "index": 1
                },
                {
                    "letter": "C",
                    "index": 2
                },
                {
                    "letter": "D",
                    "index": 3
                },
                {
                    "letter": "E",
                    "index": 4
                },
                {
                    "letter": "F",
                    "index": 5
                },
                {
                    "letter": "G",
                    "index": 6
                },
                {
                    "letter": "H",
                    "index": 7
                },
                {
                    "letter": "I",
                    "index": 8
                },
                {
                    "letter": "J",
                    "index": 9
                },
                {
                    "letter": "K",
                    "index": 10
                },
                {
                    "letter": "L",
                    "index": 11
                },

                {
                    "letter": "M",
                    "index": 12
                },
                {
                    "letter": "N",
                    "index": 13
                },
                {
                    "letter": "O",
                    "index": 14
                },
                {
                    "letter": "P",
                    "index": 15
                },
                {
                    "letter": "Q",
                    "index": 16
                },
                {
                    "letter": "R",
                    "index": 17
                },
                {
                    "letter": "S",
                    "index": 18
                },
                {
                    "letter": "T",
                    "index": 19
                },
                {
                    "letter": "U",
                    "index": 20
                },
                {
                    "letter": "V",
                    "index": 21
                },
                {
                    "letter": "W",
                    "index": 21
                },
                {
                    "letter": "X",
                    "index": 23
                },
                {
                    "letter": "Y",
                    "index": 24
                },
                {
                    "letter": "Z",
                    "index": 25
                },

            ]
            let booksByStoreID = alpbbCatch.filter(
                alphabet => alphabet.letter === firstTestCaseNameStepCol.toUpperCase());
            console.log(booksByStoreID[0].index);
            firstTestCaseNameStepCol = booksByStoreID[0].index;//we assign index version of alphabet example: b -> 1 (check above array of objects )  )
            // console.log(req.body.resultRows.length);
            console.log(" vijsyeye staat   lettter");

            let iamStarting = null;
            let iamEnding = null;

            let stepDifferenceValue = 7;
            let nextStepStartingPoint = null;
            let firstTestCase = true;
            var allTests = req.body.inputExcel.testStep.split(",")
            let stepNameWritten = allTests[0] - 1;
            console.log(stepNameWritten);
            let textDataLocation = allTests[1];

            let booksByStoreSteps = alpbbCatch.filter(
                alphabet => alphabet.letter === textDataLocation.toUpperCase());
            textDataLocation = booksByStoreSteps[0].index;

            let allTests01 = req.body.inputExcel.testData.split(",")
            let inputDataLocation = allTests01[1];
            let booksByStoreinputs = alpbbCatch.filter(
                alphabet => alphabet.letter === inputDataLocation.toUpperCase());
            inputDataLocation = booksByStoreinputs[0].index;


            var firstTestCaseNameStepRow = req.body.inputExcel.testValue - 1; //Test case name title row 
            console.log(firstTestCaseNameStepRow);
            // var firstTestCaseNameStepCol = req.body.inputExcel.value;
            console.log(firstTestCaseNameStepCol);

            let testCaseNameField = null;
            finalALl444 = [];
            finalALl123 = [];
            newSteps123 = [];
            newSteps444 = [];
            allDataSend = [];
            let testcase1;
            let testcase2;

            let headerDataSteps = req.body.resultRows[stepNameWritten - 1][textDataLocation]; //Assigning test steps header name which is "TestStep" in our example
            let headerDataInput = req.body.resultRows[stepNameWritten - 1][textDataLocation + 1]//Assigning test data header name which is "Test Data" in our example

            let testCase1 = req.body.resultRows[firstTestCaseNameStepRow][firstTestCaseNameStepCol] // assigning Test case name which is "Project First" in our example
            console.log(testCase1 + "kkkkkkkkkkkkkkkkkkkkk");
            var finalALl = []


            testCaseNameField = req.body.resultRows[firstTestCaseNameStepRow][firstTestCaseNameStepCol] // assigning Test case name which is "Project First" in our example

            let lastTestCaseEnd = req.body.resultRows.length - 1; //Last row index of the array

            //iterating over Array of rows obtained from excel sheet using /readExcelRows api
            req.body.resultRows.forEach((execlRowData, index) => {

                //why use foreach when we have for loop?


                if (execlRowData.length == 0) {

                    iamEnding = true;
                    firstTestCase = false;

                } else if (iamEnding == true) {
                    iamEnding = false;
                    iamStarting = true;
                    count++;

                    if (count == 2) {
                        testcase1 = testCaseNameField;
                        validationCall('close', execlRowData, testCaseNameField)
                    }


                    nextStepStartingPoint = index + stepDifferenceValue;


                    endObject("ended", null, testCaseNameField)
                    testCaseNameField = execlRowData[1];
                    // db.countInc.find(function(err,doc){
                    //     // console.log(doc);
                    //     newScriptId=doc[0].sCount;
                    //     // console.log(newScriptId)
                    //     updateMine(doc)

                    //  })



                } else if (iamStarting == true && nextStepStartingPoint === index + 1) {
                    pushObject12 = [];

                    iamStarting = false;

                } else if (firstTestCase == false && nextStepStartingPoint <= index + 1) {
                    makeObject("started", startReadingSteps("started", testCaseNameField, execlRowData), testCaseNameField)



                    if (count == 1) {

                        validationCall('second', execlRowData, testCaseNameField)

                    }


                } else if (firstTestCase == true && stepNameWritten <= index) {

                    // console.log(testCaseNameField);
                    testcase2 = testCaseNameField;


                    validationCall("first", execlRowData, testCaseNameField)
                    makeObject("started", startReadingSteps("started", testCaseNameField, execlRowData), testCaseNameField)

                }


                //dont mix with first if conditions////
                if (lastTestCaseEnd == index) {

                    endObject("ended", null, testCaseNameField)
                    // db.countInc.find(function(err,doc){
                    //     // console.log(doc);
                    //     newScriptId=doc[0].sCount;
                    //     console.log(newScriptId)
                    //     updateMine(doc)

                    //  })


                }

            });
            //
            function validationCall(condition, execlRowData, testCaseName) {
                // console.log("   execlRowData   execlRowData");

                if (condition == 'first') {
                    console.log("heyyyyyyyyyyyyyyyyyyyyyyy")
                    var alSteps = {}
                    alSteps["steps1"] = execlRowData[1];
                    alSteps["testData"] = execlRowData[2];
                    newSteps123.push(alSteps);
                    console.log(newSteps123)


                } else if (condition == 'second') {
                    var alSteps = {}
                    alSteps["steps1"] = execlRowData[1];
                    alSteps["testData"] = execlRowData[2];
                    newSteps444.push(alSteps)
                } else {

                    var allInputs = {
                        "testCaseNameHeading": req.body.inputExcel.name,
                        "allSteps": newSteps123,
                        "testCaseName": testcase2,
                        "headStep": headerDataSteps,
                        "headData": headerDataInput
                    }
                    allDataSend.push(allInputs);
                    var allInputs = {
                        "testCaseNameHeading": req.body.inputExcel.name,
                        "allSteps": newSteps444,
                        "testCaseName": testcase1,
                        "headStep": headerDataSteps,
                        "headData": headerDataInput
                    }
                    allDataSend.push(allInputs);
                    console.log(allDataSend)
                    res.json(allDataSend);
                }

            }// used to show user whether functions are reading data from Excel sheet in a right way or not. 
            //(In other words,Info required for Table confirmation popup which comes up after clicking on the save button
            // is generated in validationCall()
            function updateScriptId(id) {
                console.log(' iddd ', id)
                db.countInc.update({ "projectID": "pID" }, { $set: { "sCount": Number(id) } })
            }

            function createConfigFile(info, scriptName) {
                console.log("writeScriptLevelConfigDatawriteScriptLevelConfigData")
                var scriptFile = "./uploads/opal/" + info.projectName + "/MainProject/src/test/java/" + "/" + info.moduleName + "/" + info.featureName + "/" + scriptName + "Config" + ".json";
                fs.createWriteStream(scriptFile);
                console.log("  fs.createWriteStream(scriptFile) ");

                var firstline = "\"ImplicitWait\"" + ":\"" + info.projectConfig.settimeOut + "\"" + "\n";
                var secondline = "\"Browser\"" + ":" + "\"" + info.projectConfig.defaultBrowser + "\"" + ",\n";
                var thridline = "\"Version\"" + ":" + "\"" + info.projectConfig.defaultVersion + "\"" + "\n";
                var fourthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:4444" + "\"" + "\n";

                // setTimeout(() => {}, 0)
                setTimeout(() => {
                    console.log("  executed  file ")
                    fs.appendFileSync(scriptFile, "{\n");
                    fs.appendFileSync(scriptFile, "\"BrowserDetails\":\n");
                    fs.appendFileSync(scriptFile, "{\n");
                    fs.appendFileSync(scriptFile, secondline);
                    fs.appendFileSync(scriptFile, thridline);
                    fs.appendFileSync(scriptFile, "},\n");
                    fs.appendFileSync(scriptFile, "\"Timeout\":\n");
                    fs.appendFileSync(scriptFile, "{\n");
                    fs.appendFileSync(scriptFile, firstline + ",\n");
                    fs.appendFileSync(scriptFile, "\"ExplicitWait\"" + ":" + "\"40\"");
                    fs.appendFileSync(scriptFile, "},\n");
                    fs.appendFileSync(scriptFile, "\"ScreenshotOption\":\n");
                    fs.appendFileSync(scriptFile, "{\n");
                    fs.appendFileSync(scriptFile, "\"CaptureOnEveryStep\"" + ":" + "\"Yes\",\n");
                    fs.appendFileSync(scriptFile, "\"CaptureOnFailure\"" + ":" + "\"Yes\"\n");
                    fs.appendFileSync(scriptFile, "},\n");
                    fs.appendFileSync(scriptFile, "\"ExecutionCount\":\n");
                    fs.appendFileSync(scriptFile, "{\n");
                    fs.appendFileSync(scriptFile, "\"reportCount\"" + ":" + "\"100\"\n");
                    fs.appendFileSync(scriptFile, "},\n");
                    fs.appendFileSync(scriptFile, "\"SuiteName\":\n");
                    fs.appendFileSync(scriptFile, "{\n");
                    fs.appendFileSync(scriptFile, "\"suiteName\"" + ":" + "\"Suite1\"\n");
                    fs.appendFileSync(scriptFile, "},\n");
                    fs.appendFileSync(scriptFile, "\n" + '"IpAddress":\n' + "{\n");
                    fs.appendFileSync(scriptFile, fourthline);
                    fs.appendFileSync(scriptFile, "}\n" + "\n" + "}");
                }, 1000);
                var scriptFile1 = "./uploads/opal/" + info.projectName + "/MainProject/src/test/java/" + "/" + info.moduleName + "/" + info.featureName + "/" + scriptName + ".java"
                fs.createWriteStream(scriptFile1);

            }

            function endObject(condition, obj, testCaseNameField) {
                console.log(newScriptId);
                newScriptId++
                db.testScript.insert({
                    "scriptName": testCaseNameField,
                    "projectId": req.body.projectId,
                    "moduleId": req.body.moduleId,
                    "featureId": req.body.featureId,
                    "scriptId": "sID" + newScriptId,
                    "priorityId": "p01",
                    "typeId": "t01",
                    "scriptConfigdata": {
                        "time": Number(req.body.projectConfig.settimeOut),
                        "defaultBrowser": req.body.projectConfig.defaultBrowser,
                        "defaultVersion": req.body.projectConfig.defaultVersion
                    },
                    "description": "Imported from excel",
                    // "scriptId":"567",
                    "compeleteArray": [{
                        "allObjectData": {
                            versionId: 1,
                            allActitons: pushObject12
                        }
                    }]
                })
                updateScriptId(newScriptId)
                createConfigFile(req.body, testCaseNameField)

            }//whole script info object will be created and inserted into DB.
            function makeObject(condition, obj, testCaseNameField) {
                console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
                if (obj.object === undefined) {
                    console.log("ccccccccccccccccccccccc")
                    console.log(obj);
                    obj.object = {}
                    obj.object.objName = '';
                    obj.object.pageName = '';
                    obj.object.pom = '';
                }
                if (condition == "started") {
                    var scriptConfigdata = {};
                    scriptConfigdata["Action"] = obj.actions.actionName;
                    scriptConfigdata["ActionList"] = obj.actions.actionName;
                    scriptConfigdata["Input2"] = obj.inputs;
                    scriptConfigdata["Input3"] = "";
                    scriptConfigdata["Object"] = obj.object.objName;
                    scriptConfigdata["Excel"] = "notExcel";
                    scriptConfigdata["ReturnsValue"] = "";
                    scriptConfigdata["Page"] = obj.object.pageName;
                    scriptConfigdata["PomObject"] = obj.object.pom;
                    scriptConfigdata["nlpData"] = "itsFromAutomation";


                    scriptConfigdata["classObject"] = "";
                    scriptConfigdata["classFile"] = "";
                    scriptConfigdata["finalWord"] = "";
                    scriptConfigdata["type"] = "Actions";
                    scriptConfigdata["Groups"] = obj.actions.actionTestNg;
                    pushObject12.push(scriptConfigdata)

                } else if (condition == "ended") {


                }

            }//creates object which contain info regarding each test case step 
            function startReadingSteps(condition, testCaseName, rowData) {
                return {
                    "inputs": findingInputs(rowData[inputDataLocation]),
                    "actions": findingActions(rowData[textDataLocation]),
                    "object": findingObject(rowData[textDataLocation]),

                }

            }
            function findingObject(objectText) {
                // let returnValue = null;
                let oneObject;
                let pName = "";
                let pom = "";
                MatchWordsData.forEach((element, index, array) => {

                    if (element.words != undefined && objectText.toLowerCase().includes(element.words) == true) {

                        var array2 = objectText.toLowerCase().split(/(\s+)/).filter(function (e) { // splits at spaces
                            return e.trim().length > 0;
                        });
                        var positionConnectingWord = array2.findIndex(x => x == array2.filter(e => connectingParameters.includes(e))[0])

                        if (positionConnectingWord != -1) {
                            oneObject1 = array2[positionConnectingWord + 1];
                            console.log('qazwsx')
                            oneObject = objectMatchingWithDb(oneObject1)
                            console.log(oneObject)


                            // console.log(oneObject + " objjj");
                            //return oneObject;
                            //  returnValue = oneObject;
                        } else {
                            var positionNonConnectingWord = array2.findIndex(x => x == array2.filter(e => objectCreationParameters.includes(e))[0])
                            if (positionNonConnectingWord != -1) {

                                oneObject1 = array2[positionNonConnectingWord + 1];

                                console.log('qazwsx')
                                oneObject = objectMatchingWithDb(oneObject1)

                            }

                        }
                    }
                });
                return oneObject;

                function objectMatchingWithDb(reqObject) {

                    let c = objFilteredBasedOnProjectId.filter((element, index, array) => {

                        var d = element.objectName.filter(mycall);

                        if (d.length > 0) {


                            // try {

                            if (d[0].pName == element.pageName) {
                                element.data = d[0];
                                return element
                            }
                        }

                        function mycall(ele, ind, array) {
                            console.log('vijay', ele.objectName, reqObject);
                            if (ele.objectName.toLowerCase() == reqObject.toLowerCase()) {
                                ele.pName = element.pageName
                                return ele;
                            }
                        }
                    })

                    if (c.length > 0) {

                        return {
                            "objName": c[0].data.objectName,
                            "pageName": c[0].data.pName,
                            "pom": c[0].data.pomObject
                        }

                    } else {
                        return {
                            "objName": "",
                            "pageName": "",
                            "pom": ""
                        }
                    }
                }

            } ////////Closing thr objects Function

            function findingActions(actionText) {
                actionCollectionData.forEach(element => {
                    if (element.words != undefined && actionText.toLowerCase().includes(element.words) == true) {
                        actionName = element.allMethod.actionList;
                        actionTestNg = element.allResult[0].groupName;
                    }

                })

                assertionCollectionData.forEach(element => {
                    if (element.matchKeyWord != undefined && actionText.toLowerCase().includes(element.matchKeyWord) == true) {

                        actionName = element.actions;
                        actionTestNg = element.testNgKey;

                        console.log(element.actions);
                        console.log(element.testNgKey);

                    }

                });
                return {
                    "actionName": actionName,
                    "actionTestNg": actionTestNg
                };

            } //////////////Closing the Function action

            function findingInputs(inputText) {
                if (inputText) { //Reading  the test data
                    var inputs = inputText.split("=")[1];
                    return inputs
                }
            } /////////closing the   Input Function

        }
    })
}

async function checkMachine(req, res) {

    let details = {
        orgId: Number(req.query.orgId),
        machineType: "usersMachine"
    }
    let licenseDockerInfo = await dbServer.findCondition(db.licenseDocker, details);
    res.json(licenseDockerInfo);
}

async function checkJMachine(req, res) {

    let details = {
        orgId: Number(req.query.orgId),
        machineType: "jmeterUsersMachine"
    }
    let licenseDockerInfo = await dbServer.findCondition(db.licenseDocker, details);
    res.json(licenseDockerInfo);
}

async function jsonConversion(req, res) {
    console.log("starts jsonConversion")
    console.log(req.body)
    var userpath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/${req.body.userName}`)
    console.log(userpath)
    if (fs.existsSync(userpath)) {
        console.log("UserPath  folder already exists");
    }
    else {
        console.log('UserPath folder does not exist')
        fs.mkdir(userpath, function (err) {
            console.log("UserPath folder created");
        })
    }
    var actual = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/actual_test`)
    if (fs.existsSync(actual)) {
        console.log("actual  folder already exists");
        var responsedata = await copyActual(req)
        console.log(responsedata)
    }
    else {
        console.log('actual folder does not exist')
        fs.mkdir(actual, async function (err) {
            console.log("actual folder created");
            var responsedata = await copyActual(req)
            console.log(responsedata)
        })
    }
    var csv = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/csv`)
    if (!fs.existsSync(csv)) {
        fs.mkdir(csv, async function (err) {
            console.log("csv folder created");
        })
    }
    var responsedata1 = await jmxTojson(req)
    console.log(responsedata1)
    var responsedata2 = await updateDb(req)
    console.log(responsedata2)
    res.json(responsedata2)


}

async function copyActual(req) {
    return new Promise((resolve, reject) => {
        [".jmx"].forEach((value) => {
            fse.copy(`./uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test/${req.body.scriptId}.jmx`,
                `./uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/actual_test/${req.body.scriptId}.jmx`, (err) => {
                    if (err) {
                        console.log(err);
                        resolve('Fail', err);
                    } else {
                        console.log("inside", value)
                        resolve('copy completed')

                    }
                })
        })
    })
}

async function jmxTojson(req) {
    return new Promise((resolve, reject) => {


        console.log("starts jmxTojson")
        var projectPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject`)
        var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/${req.body.userName}/jmxTojson.bat`)
        console.log(file, "\n jmxTojson conversion")
        var source = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test/${req.body.scriptId}.jmx`)
        var destination = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test/${req.body.scriptId}.json`)
        var wstream = fs.createWriteStream(file);
        wstream.on('finish', function () {
            console.log(`converting batch file finished writing   ${file}`);
        });
        wstream.write('@echo off\n');
        wstream.write(`cd ${projectPath}  &&  mvn exec:java -Dexec.mainClass=reuseablePackage.feature.jmxTojson -Dexec.args="'${source}' '${destination}'" `);
        wstream.end(function () {
            console.log(`done writing  ${file} `);
            console.log(`createdfile and executing cmd ${file} `)
            cmd.exec(file, (error, stdout, stderr) => {
                try {
                    if (error != null) {
                        throw error;
                    } else {
                        if (fs.existsSync(destination)) {
                            console.log(`${req.body.jmxFileName}.json file created`);
                            var result = 'Pass';
                            resolve(result);
                        } else {
                            var result = 'Fail';
                            console.log("error " + error);
                            resolve(result);
                            console.log(`${req.body.jmxFileName}.json file is not present still`)
                        }
                    }
                }
                catch (error) {
                    var result = 'Fail';
                    console.log(" error  " + error);
                    resolve(result);
                }
            });
        });
    })
}

async function updateDb(req) {
    return new Promise((resolve, reject) => {
        var convertedJson = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test/${req.body.scriptId}.json`)
        fs.readFile(convertedJson, 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);

            var bool = obj.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.boolProp
            console.log(bool)
            var boolpro =
                [
                    {
                        "-name": "ThreadGroup.scheduler",
                        "#text": "false"
                    },
                    {
                        "-name": "ThreadGroup.same_user_on_next_iteration",
                        "#text": "true"
                    },
                    {
                        "-name": "ThreadGroup.delayedStart",
                        "#text": "false"
                    }
                ]

            obj.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.boolProp = boolpro
            // var bool = obj.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.boolProp
            // console.log(bool)

            var element = obj.jmeterTestPlan.hashTree.hashTree.hashTree[1]['#item'].Arguments.collectionProp.elementProp
            console.log(element, element.length)
            if (element.length == undefined) {
                var elementpro = [
                    element
                ]
                obj.jmeterTestPlan.hashTree.hashTree.hashTree[1]['#item'].Arguments.collectionProp.elementProp = elementpro
                // var element = obj.jmeterTestPlan.hashTree.hashTree.hashTree[1]['#item'].Arguments.collectionProp.elementProp
                // console.log(element, element.length)
            }

            var element1 = obj.jmeterTestPlan.hashTree.hashTree.HeaderManager.collectionProp.elementProp
            //console.log(element, element.length)
            if (element1.length == undefined) {
                var elementpro = [
                    element1
                ]
                obj.jmeterTestPlan.hashTree.hashTree.HeaderManager.collectionProp.elementProp = elementpro
                // var element = obj.jmeterTestPlan.hashTree.hashTree.hashTree[1]['#item'].Arguments.collectionProp.elementProp
                // console.log(element, element.length)
            }

            var samplerProxy = obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].hashTree.HTTPSamplerProxy
            if (samplerProxy.length == undefined) {
                obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].hashTree.HTTPSamplerProxy = [];
                obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].hashTree.HTTPSamplerProxy.push(samplerProxy)

            }

            var hashTree = obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].hashTree.hashTree
            console.log(hashTree)
            var hastrree = {
                "#item": {
                    hashTree
                }
            }
            console.log(hastrree)
            obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].hashTree.HTTPSamplerProxy.push(hastrree)
            delete obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].hashTree.hashTree;

            var transactionController = obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController
            if (transactionController.length == undefined) {
                var hashTree = [];
                hashTree.push(obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].hashTree);
                obj.jmeterTestPlan.hashTree.hashTree.hashTree[14] = {
                    "TransactionController": []
                }
                var newElement = {
                    "#item": {
                        hashTree
                    }
                }
                obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController.push(transactionController)
                obj.jmeterTestPlan.hashTree.hashTree.hashTree[14].TransactionController.push(newElement)
            }

            var int = obj.jmeterTestPlan.hashTree.hashTree.hashTree[3]['#item'].ConfigTestElement.intProp
            console.log(int)
            var intpro =
                [
                    {
                        "-name": "HTTPSampler.concurrentPool",
                        "#text": "6"
                    },

                    {
                        "-name": "HTTPSampler.connect_timeout",
                        "#text": "0"
                    },

                    {
                        "-name": "HTTPSampler.response_timeout",
                        "#text": "0"
                    }
                ]

            obj.jmeterTestPlan.hashTree.hashTree.hashTree[3]['#item'].ConfigTestElement.intProp = intpro

            db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
                {
                    $set: {
                        'features': obj
                    }
                },
                (err, doc) => {
                    console.log(doc);
                    if (err) {
                        console.log('ERROR   ', err);
                        throw err;
                    }
                    else {
                        resolve("updated")
                    }
                })
        })

    })
}

async function assignContainer(req, res) {
    let obj = {
        "userId": req.query.userId
    }
    let userInfo = await dbServer.findCondition(db.loginDetails, obj);

    if (await userInfo[0].masterHubPort == null) {

        let details = {
            orgId: Number(req.query.orgId),
            machineType: "jmeterUsersMachine"
        }

        let licenseDockerInfo = await dbServer.findCondition(db.licenseDocker, details);
        let _id = licenseDockerInfo[0]._id;
        let userId = req.query.userId;


        let array = await new Promise((resolve, reject) => {
            var arr = licenseDockerInfo[0].hubPort;
            resolve(arr);
        });

        let sorted = await new Promise((resolve, reject) => {
            console.log("ARRAY VALUE", array)
            var arr = array.sort((a, b) => {
                return a - b;
            })
            resolve(arr);
        });
        let reversed = await new Promise((resolve, reject) => {
            console.log("SORTED", sorted);
            var arr = sorted.reverse();
            resolve(arr);

        });
        let port = await new Promise((resolve, reject) => {
            console.log("REVERSED", reversed)
            var arr = reversed.pop()
            resolve(arr)
        })
        console.log("The final port is", port)

        let masterNameReverse = await new Promise((resolve, reject) => {
            var arr = licenseDockerInfo[0].masterContainers.reverse();
            resolve(arr);

        });
        let masterName = await new Promise((resolve, reject) => {
            var val = masterNameReverse.pop();
            resolve(val)
        })

        console.log("master Valllll", masterName)
        let nodeName = await new Promise((resolve, reject) => {
            db.licenseDocker.aggregate([{ $match: { "_id": mongojs.ObjectId(licenseDockerInfo[0]._id), "orgId": licenseDockerInfo[0].orgId } },
            { $unwind: "$browsers" },
            { $match: { "browsers.hubUrlPort": port } },
            { $project: { _id: 0, "browsers.NodeName": 1 } }],
                function (err, result) {
                    if (err) { console.log(err) }

                    console.log("DB RESULT is ", result);
                    resolve(result[0].browsers.NodeName);
                })
        })

        db.loginDetails.update({ "userId": userId }, { $set: { "masterHubPort": port, "masterNode": nodeName, "masterName": masterName } },)
        db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $pop: { "hubPort": -1, "masterContainers": -1 } });
        res.json({})
    }
    else {
        res.json({})
    }
}

async function removeJmxScript(req, res) {
    db.testScript.update({ "moduleId": req.body.moduleId, "featureId": req.body.featureId, "scriptId": req.body.scriptId },
        {
            $set: {
                'jmxFile': false, 'status': 'not executed'
            }
        },
        (err, doc) => {
            db.jmxFiles.find({ "moduleId": req.body.moduleId, "featureId": req.body.featureId, "jmxFileName": req.body.jmxFileName },
                function (err, doc1) {
                    if (doc1[0].jmxFileId !== undefined) {
                        db.jmxFiles.remove({ "jmxFileId": doc1[0].jmxFileId },
                            async (err, doc2) => {
                                var resData = await removeJmxFolder(req)
                                console.log(resData)
                                res.json(resData)
                            })
                    }
                })
        })
}

async function removeJmxFolder(req) {
    var folder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}`)
    fse.remove(folder, (err) => {
        try {
            if (err) {
                throw err;
            }
            else {
                console.log('jmx folder deleted!')
                return "pass"
            }
        }
        catch (err) {
            console.log('Error while remove' + err);
            return "fail"
        }
    })
}

var exitBatchCreation = (req, file, res) => new Promise(async (resolve, reject) => {
    let objj = {
        'projectId': req.body.projectId,
        'scriptId': req.body.scriptId
    }
    let resultprocess = await dbServer.findCondition(db.testScript, objj)
    console.log("processIdddddddddd:::: ", resultprocess[0].processId)
    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write("taskkill/F /PID " + resultprocess[0].processId + "\n")
    mvnFileCreation.write("pause")

    mvnFileCreation.end(function () {
        console.log(`done writing mvn batch  ${file} `);
        resolve('done')
    })
})

var executeExitFile = (req, file, res) => new Promise(async (resolve, reject) => {

    cmd.exec(file, (err, stdout, stderr) => {
        console.log(" Exit batch file executed " + "\n\n");
        try {
            if (err != null) {
                console.log('1')
                batchResult = "Fail"
                resolve(batchResult)
                throw err;
            }
            else {
                //console.log(stdout);
                console.log('2')
                batchResult = "Pass"

                resolve(batchResult)
            }
        } catch (err) {
            console.log('3')
            console.log('Fail at mvnExecution()')
        }

    })
    resolve("batchResult")
})

async function stopScriptExecution(req, res) {
    console.log("KKKKKKKKKKSSSSSSSSSSSSSSSSSSSS")
    let details = {
        projectId:req.body.projectId,
        scriptId:req.body.scriptId
    }
    let scriptInfo = await dbServer.findCondition(db.testScript, details);
    console.log("JJJJJ ", scriptInfo[0]);
    kill(scriptInfo[0].processId,(err)=>{
        console.log("Uuuuuuuuuuuuuuuuuuuuuuuuuuu ");
        console.log(err);
    })
    res.json({})
}


///////////////////////////////////////////view console///////////////////////////////////
function viewConsoleLogic(req, res) {
    var filePath = path.join(
      __dirname,
      `../../uploads/opal/${req.query.projectName}/${req.query.userName}/scriptExection.txt`
    );
    if (fs.existsSync(filePath)) {
      lr = new LineByLineReader(filePath);
      let capturedLines = "";
  
      lr.on("error", function (err) {
        // 'err' contains error object
        console.log(err);
      });
  
      lr.on("line", function (line) {
        capturedLines = `${capturedLines}*${line}`;
      });
  
      lr.on("end", function () {
        capturedLinessplit = capturedLines.split("*");
        res.json(capturedLinessplit);
      });
    }
  }
  
  //////////////////////////////////////////view console ends///////////////////////////////

module.exports = {
    getProjctFrameWork: getProjctFrameWork,
    getPageNameByDefaultGetCall: getPageNameByDefaultGetCall,
    getReusableFunctionListGetApiCall: getReusableFunctionListGetApiCall,
    getNlpGrammar: getNlpGrammar,
    getZapNlpGrammar: getZapNlpGrammar,
    getReusableFunctionNamesToDisplay: getReusableFunctionNamesToDisplay,
    checkIfReusefuncBeingUsedInScriptsBeforeDelete: checkIfReusefuncBeingUsedInScriptsBeforeDelete,
    deleteReusableFunction: deleteReusableFunction,
    checkForDuplicateMethodName: checkForDuplicateMethodName,
    deletePreviousReusableFunctionScript: deletePreviousReusableFunctionScript,
    createTestpostAllActions: createTestpostAllActions,
    getbrowser: getbrowser,
    createUserFolder: createUserFolder,
    createProjectToRunFolder: createProjectToRunFolder,
    copyRequiredContentIntoProjectToRunFolder: copyRequiredContentIntoProjectToRunFolder,
    importPriority: importPriority,
    importType: importType,
    getUploadedApkName: getUploadedApkName,
    viewVersionHistoryGetCall: viewVersionHistoryGetCall,
    deleteDummyProject: deleteDummyProject,
    resetLockNUnlockParameters: resetLockNUnlockParameters,
    checkIfScriptFree: checkIfScriptFree,
    fetchMultipleStepDataPostCall: fetchMultipleStepDataPostCall,
    saveVariableCall: saveVariableCall,
    getVersionIdCount: getVersionIdCount,
    insertExcelFilesArray: insertExcelFilesArray,
    copyScript: copyScript,
    copyExcelFiles: copyExcelFiles,
    generateBatchNXmlFile: generateBatchNXmlFile,
    dockerIpAddressPortCall: dockerIpAddressPortCall,
    startScriptExecutionCall: startScriptExecutionCall,
    deleteScriptAfterRun: deleteScriptAfterRun,
    compilationErrLogic: compilationErrLogic,
    convertXmlToJson: convertXmlToJson,
    extractInfoFromJson: extractInfoFromJson,
    displayBlockDevices: displayBlockDevices,
    generateTestNgForAppium: generateTestNgForAppium,
    getGrouprsAutoServiceCall: getGrouprsAutoServiceCall,
    displayModulePage: displayModulePage,
    deleteFeature: deleteFeature,
    deleteModule: deleteModule,
    checkPageUpdate: checkPageUpdate,
    getUpdatedObject: getUpdatedObject,
    pageUsedCall: pageUsedCall,
    addToStepsCall: addToStepsCall,
    displayScriptPage: displayScriptPage,
    updateScriptData: updateScriptData,
    allModuleData: allModuleData,
    updateModule: updateModule,
    updateFeature: updateFeature,
    allFeatureData: allFeatureData,
    allScriptData: allScriptData,
    getModuleFromDb: getModuleFromDb,
    getFeatureFromDb: getFeatureFromDb,
    getScriptId: getScriptId,
    checkForNlpOrNot: checkForNlpOrNot,
    getActionListOnGroupIdServiceCall: getActionListOnGroupIdServiceCall,
    getTestScriptconfigScriptLevel: getTestScriptconfigScriptLevel,
    getprojectconfigScriptLevel: getprojectconfigScriptLevel,
    versions: versions,
    getVaraiableByDefault: getVaraiableByDefault,
    getTestCaseForEdit: getTestCaseForEdit,
    getActionMethodOnActionListGetCall: getActionMethodOnActionListGetCall,
    allInputs: allInputs,
    checkMachine: checkMachine,
    checkJMachine: checkJMachine,
    getReuseId: getReuseId,
    jsonConversion, jsonConversion,
    checkForDuplicateMethodName2: checkForDuplicateMethodName2,
    assignContainer: assignContainer,
    removeJmxScript: removeJmxScript,
    deleteScript: deleteScript,
    displayFeaturePage: displayFeaturePage,
    exitBatchCreation: exitBatchCreation,
    executeExitFile: executeExitFile,
    stopScriptExecution:stopScriptExecution,
    viewConsoleLogic:viewConsoleLogic,
}