module.exports = function (app) {
    var fs = require('fs');
    var Promise = require('promise');
    var mongojs = require('mongojs');
    var bodyParser = require("body-parser");
    var LineReader = require('line-by-line');
    var path = require("path");
    var mkdirp = require('mkdirp');
    var db = require('../dbDeclarations').url;
    const editJsonFile = require("edit-json-file");
    var executionReusable = require('./executionReusable');
    const handlingUiExp = require('./exceptionHandling/handlingUiException');
    var _ = require('lodash');
    var machineId = null;
    var async = require("async");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));


    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    data = null;
    var mainExceptionDetails = [];

    app.get('/exceptionStatusCall', function (req, res) {
        //Exception status call for displaying result in UI
        var exceptionDetails = {
            'reportNum': req.query.reportNum,
            'projectName': req.query.projectName,
            'exceptionStatusId': req.query.exceptionStatusId
        }
        db.exceptionStatus.findOne({ "_id": mongojs.ObjectId(exceptionDetails.exceptionStatusId) }, function (err, doc) {
            res.json(doc);
            if (doc.status == 'fail') {
                summaryReport(exceptionDetails)
            }
        })
    })

    app.post('/exceptionHandlingCall', function (req, res) {
        // Exception handling starting call with projectName, projectId, runNo 
        console.log('Exception handling call started')
        var runDetails = req.body;
        console.log('Exception handling call started')
        db.exceptionStatus.insert({ status: "started" }, function (err, doc) {
            //Adding exception statusId in runDetails
            runDetails.exceptionStatusId = doc._id;
            console.log('Exception handling call started' + runDetails)
            res.json(runDetails);
            checkReport(runDetails, res)
        })

    })

    function checkReport(data, res) {
        var mainExceptionDetails = [];
        //Based on run number fetching details of report
        console.log("for fetching the report number details" + data);
        db.reports.find({ 'Run': data.run }, function (err, doc) {
            fetchOnlyFailed(doc[0].manual, data, res)
        })
    }

    function fetchOnlyFailed(scrtiptData, data, res) {
        //checking if any step in the script is failed and fetching failed scripts
        console.log("for fetching only the failed scripts from the result" + data);
        var failedDetails = scrtiptData.filter(script => script.scriptStatus === 'Fail');
        if (failedDetails.length != 0) {
            createExceptionObject(failedDetails, data.projectname, data.projectId, data.exceptionStatusId, res)
        } else {
            //if any step is not failed then calling summary report to update
            console.log('no status is failed in script')
            var exceptionDetails = {
                'reportNum': data.run,
                'projectName': data.projectname,
                'exceptionStatusId': data.exceptionStatusId
            }
            db.exceptionStatus.update({ "_id": mongojs.ObjectId(data.exceptionStatusId) }, { $set: { "status": "inProgress", message: " No Exceptions found" } })

            summaryReport(exceptionDetails)
        }

    }

    function createExceptionObject(failedScripts, pName, projectId, exceptionStatusId, res) {
        //creating object for complete details of failed scripts
        console.log('creating complete object for failed scripts' + pName + projectId)
        var projectName = pName;
        mainExceptionDetails = []
        failedScripts.forEach(function (a, aindex, aarray) {
            var number = 1;
            var reportExceptionDetails = {
                'projectName': projectName,
                "projectId": projectId,
                'moduleName': a.Module,
                'fetaureName': a.FeatureName,
                'suiteName': a.suiteName,
                'scriptName': a.Testcase,
                'scriptDetails': a.scriptDetails,
                'mainRunNumber': a.Run,
                'createdCopySuite': a.suiteName + "_" + number,
                'exceptionName': '',
                'lineNumber': null,
                'exceptionRunNumber': null,
                'machineID': null,
                'IPAddress': null,
                'action': '',
                'addAt': '',
                'changeAt': '',
                'iterationCount': 1,
                'operationmsg': '',
                'type': 'exception',
                'exceptionStatusId': exceptionStatusId
            }
            mainExceptionDetails.push(reportExceptionDetails);
            if (aindex == aarray.length - 1) {
                fecthException(mainExceptionDetails, res);
            }

        })
    }

    async function fecthException(completeObject, res) {
        //here fetching exception name and writing it into a txt file

        let failureCondition = await completeObject.map(checkStepStatus)[0]
        if (await failureCondition === "fileNotPresent") {
            console.log(" lets terminate exception handling ");

        }


        var indexVal = null;
        async function checkStepStatus(scriptSteps, ind) {
            indexVal = ind;
            console.log(scriptSteps.scriptName, indexVal)

            let scriptNotPresent = await scriptSteps.scriptDetails.map(failAndException);

            for (let index = 0; index < scriptNotPresent.length; index++) {


                if (await scriptNotPresent[index] === "fileNotPresent")
                    return await scriptNotPresent[index];

            }

        }


        async function failAndException(steps) {
            //checking if step status is fail then checking if it is 'NoSuchElementException'

            if (steps.status === 'FAIL') {
                console.log(steps.status)
                steps['exceptionName'] = steps.exception.class.split('.')[3];

                if (steps['exceptionName'] === "NoSuchElementException") {
                    completeObject[indexVal].exceptionName = steps['exceptionName'];
                    console.log(completeObject[indexVal].exceptionName, "aff")
                    //if exception is 'NoSuchElementException' then writing it in txt file in suite
                    let result = await writeStackTrace(steps.exception['full-stacktrace'], {
                        projectName: completeObject[indexVal].projectName,
                        suiteName: completeObject[indexVal].suiteName,
                        scriptName: completeObject[indexVal].scriptName,
                    })

                    if (result.status === "fileIsCreated") {
                        //if txt file is created then call readscript
                        readScript(completeObject, res)


                    }
                    else {
                        //if file is created then send result as file not present
                        console.log("not created file", result);

                        return "fileNotPresent";

                    }
                }

                else {
                    //if exception is not "NoSuchElementException" then terminate
                    console.log(" lets terminate exception handling we  got other then  NoSuchElementException ");

                }
            }
        }



    }
    var writeStackTrace = (stack, script) => new Promise((resolve, reject) => {
        //writing Exception error completely in txt file in suite location 
        console.log("for write the stack into the file");
        var fullStackTrace = stack;

        fs.writeFile("./uploads/opal/" + script.projectName + "/suites/" + script.suiteName + "/" + script.scriptName + ".exception.txt", fullStackTrace, function (err) {
            if (err) {
                //if any error occured throw error
                console.log(err);
                resolve({ status: "fileNotCreated" })
            } else {
                //resolve that file creaetd
                resolve({ status: "fileIsCreated" })
            }

        });

    })

    function readScript(scripts, res) {
        console.log("for reading the script");
        //Reading txt file and fetching line no
        var lineNumber;
        scripts.forEach(function (e, eindex, earray) {
            lr = new LineReader("./uploads/opal/" + e.projectName + "/suites/" + e.suiteName + "/" + e.scriptName + ".exception.txt");
            lr.on('error', function (err) {
                console.log("error in reading the file");
            });
            lr.on('line', function (line) {
                if (line.includes(e.scriptName)) {
                    lineNumber = line.split(':')[1].split(')')[0];
                    e['lineNumber'] = lineNumber;
                }
            })
            lr.on('end', function () {
                if (eindex == earray.length - 1) {
                    createArray(scripts, res)
                }

            })
        })
    }

    function createArray(scripts, res) {
        // after getting lineno calling fetchaction function
        firstTime = 1;
        scripts.forEach(function (f, findex, farray) {
            if (f.lineNumber != null) {
                if (findex == farray.length - 1) {
                    console.log("for calling fetchAction function" + f.lineNumber);
                    fetchAction(scripts, res);
                }
            } else {
                var runDetails = {
                    'projectname': f.projectName,
                    'projectId': f.projectId,
                    'run': f.mainRunNumber,
                    'exceptionStatusId': f.exceptionStatusId
                }
                checkReport(runDetails, res);

            }

        })
    }


    function fetchAction(scriptsData, res) {
        //fetching actions for obtained exception
        console.log("for fetching the action for exceptions");

        scriptsData.forEach(function (s, sindex, sarray) {
            db.exceptionHandler.find({ 'exceptionName': s.exceptionName }, function (err, doc) {
                //checking if any action in exceptionHandler db for matching obtained exception 
                if (doc.length != 0) {
                    doc[0].actionToBePerformed.forEach(function (d) {

                        if (d.iteration == s.iterationCount) {
                            s['action'] = d.action;
                            s['addAt'] = d.addAt;
                            s['changeAt'] = d.changeAt;
                            s['iterationCount'] = d.iteration;
                            s['operationmsg'] = d.msg
                        } else {
                            console.log("iteration count doesn't match");
                        }
                    })


                    if (sindex == sarray.length - 1) {
                        //creating Exception handler folder  
                        executionReusable.createDuplicate(scriptsData).then((result) => {
                            //creating suite_1 folder in exception folder
                            executionReusable.createSuiteFolder(scriptsData).then((result) => {
                                //copying suite folder to suite_1 folder
                                executionReusable.copySuite(scriptsData).then((result) => {
                                    setTimeout(() => {
                                        removeUnfailedScript(scriptsData)
                                    }, 3000);
                                })
                            })
                        })
                    }
                }
                else {


                }
            })

        })
    }

    function removeUnfailedScript(scriptArray) {
        //removing unfailed scripts from suite_1 folder
        console.log("for correcting the scripts")
        var newArray = [];
        var onlyFailed = [];
        var dirContent = [];
        var scriptName;
        var scriptConfig;
        scriptArray.forEach(function (c) {
            scriptName = c.scriptName + ".java";
            scriptConfig = c.scriptName + "Config.json";
            onlyFailed.push(scriptName, scriptConfig);
        })
        var sourceSuite = `../uploads/opal/${scriptArray[0].projectName}/suites/exceptionHandler${scriptArray[0].mainRunNumber}/${scriptArray[0].createdCopySuite}/src/test/java/${scriptArray[0].moduleName}/${scriptArray[0].fetaureName}/`
        var finalSourcePath = path.join(__dirname, sourceSuite);
        fs.readdir(finalSourcePath, function (err, files) {
            if (err) console.log(err);
            files.forEach(function (file) {
                dirContent.push(file);
            })
            newArray = dirContent.filter(function (e1) {
                return !onlyFailed.includes(e1);
            });
            if (newArray.length != 0) {
                newArray.forEach(function (a, aindex, aarray) {
                    var deleteFile = sourceSuite + a;
                    var deleteFinal = path.join(__dirname, deleteFile);
                    fs.unlink(deleteFinal, function (err) {
                        if (err) console.log(err)
                        console.log("file deleted");
                        if (aindex == aarray.length - 1) {
                            correctScripts(scriptArray)
                        }
                    })
                })
            } else {
                correctScripts(scriptArray)
            }
        })
    }

    function correctScripts(scripts) {
        //for correcting the scripts i,e changeat script or change at config or change at pom
        console.log("function for correcting the scripts");


        scripts.forEach(function (e, eindex, earray) {
            var script1;
            var script2;
            if (e.changeAt == 'Script') {
                changeScript(scripts, function (result) {
                    conditionCheck(eindex, earray.length, result);

                })
                // 

            }
            else if (e.changeAt == 'Config') {
                increaseImplicit(scripts, function (result) {
                    conditionCheck(eindex, earray.length, result);
                })

            }
            else if (e.changeAt == 'Pom') {
                //here calling handlingUiException server file for handling pom error
                console.log("calling function for handling the ui exception")
                handlingUiExp.handlingUiException(e, function (resultFromUiException) {
                    console.log(resultFromUiException)
                    if (resultFromUiException.status == 'pass') {
                        conditionCheck(eindex, earray.length, scripts);

                    } else {
                        db.exceptionStatus.update({ "_id": mongojs.ObjectId(resultFromUiException.exceptionStatusId) }, { $set: { "status": "fail" } })
                    }
                })

            }
            else {

            }

        })

    }

    function conditionCheck(index, length, scripts) {
        if (index + 1 == length) {
            merger(scripts);
        }
    }
    function merger(script1) {
        console.log("completedScripts completedScripts completedScripts")
        script1.forEach(function (e, eindex, earray) {
            if (eindex == earray.length - 1) {
                executionReusable.getAvailableMachines(script1).then((result) => {
                    changeConfig(script1, result);
                })
            }
        })


    }

    function changeScript(scripts, callback) {
        //changing at script 
        console.log("for correcting the respective script error");
        scripts.forEach(function (script, scriptIndex, scriptLength) {
            if (script.changeAt == 'Script') {
                console.log("At the script level modification");
                var lineNumber = script.lineNumber;
                var action = script.action;
                var path12 = '../uploads/opal/' + script.projectName + "/suites/exceptionHandler" + script.mainRunNumber + "/" + script.createdCopySuite + "/src/test/java/" + script.moduleName + "/" + script.fetaureName + "/" + script.scriptName + ".java";
                var pathToEditFile = path.join(__dirname, path12);
                var insertLine = require('insert-line')
                var readline = require('linebyline'),
                    rl = readline(pathToEditFile);
                rl.on('line', function (line, lineCount) {
                    var newLine;
                    if (script.addAt == "Before") {
                        newLine = lineNumber - 1;
                    } else if (script.addAt == 'After') {
                        newLine = lineNumber + 1;
                    } else {
                        newLine = lineNumber;
                    }
                    if (lineCount === newLine) {
                        insertLine(pathToEditFile).content('\n').at(newLine)
                        insertLine(pathToEditFile).content(action).at(newLine).then(function (err) {
                            var content = fs.readFileSync(pathToEditFile, 'utf8')
                        });

                    }

                })
                    .on('end', function (end) {
                        console.log("called at end");
                        if (scriptIndex == scriptLength.length - 1) {
                            console.log("callback")
                            callback(scripts);
                        }

                    })
                    .on('error', function (err) {
                        console.log(err)
                        console.log("something went wrong while editing the script");
                    });
            }


        })
    }


    function increaseImplicit(scripts, callback) {
        //increasing time at config file of script
        console.log("for handling the time out exception");
        scripts.forEach(function (e, eindex, earray) {
            if (e.changeAt == 'Config') {
                var filePath;
                var increment = 60;
                var newTimeOut;
                var newTimeOutString;
                filePath = `./uploads/opal/${e.projectname}/suites/exceptionHandler${e.mainRunNumber}/${e.createdCopySuite}/src/test/java/${e.moduleName}/${e.fetaureName}/${e.scriptName}Config.json`;
                console.log(filePath)
                const fs = require('fs');
                let completeFile = fs.readFileSync(filePath);
                let student = JSON.parse(completeFile);
                var presentTimeOut = parseInt(student.Timeout.ImplicitWait);
                newTimeOut = presentTimeOut + increment;
                newTimeOutString = newTimeOut.toString();
                var configFile = editJsonFile(filePath);
                configFile.set('Timeout.ImplicitWait', newTimeOutString);
                configFile.save();
                if (eindex == earray.length - 1) {
                    callback(scripts);
                }
            }
        })
    }



    function changeConfig(scriptData, machineDetails) {
        //changing config for further execution of the scripts
        console.log("for changing the config of scripts");
        scriptData.forEach(function (s, sindex, sarray) {
            s['machineID'] = machineDetails[0]._id;
            s['IPAddress'] = machineDetails[0].IPAddress;
            var exceptionNum = s.mainRunNumber + "_" + 1;
            s['exceptionRunNumber'] = exceptionNum
            var config = `../uploads/opal/${s.projectName}/suites/exceptionHandler${s.mainRunNumber}/${s.createdCopySuite}/src/test/java/${s.moduleName}/${s.fetaureName}/${s.scriptName}Config.json`;
            var finalConfig = path.join(__dirname, config);
            var configFile = editJsonFile(finalConfig);
            configFile.set("ExecutionCount.reportCount", exceptionNum);
            configFile.set('SuiteName.suiteName', s.createdCopySuite);
            configFile.set("IpAddress.IP", `http://${s.IPAddress}:4444`);
            configFile.save();
            if (sindex == sarray.length - 1) {
                //creating testng file in suitecreation for execution
                executionReusable.suiteCreation(scriptData).then((created) => {
                    console.log("suite creation call")
                    executionReusable.getIpAddress().then((message) => {
                        console.log("getting IP address")
                        //updating docker status to no
                        executionReusable.updateDockerStatus(scriptData).then((result) => {
                            console.log("changing the docker status")
                            //creating mvn batch file and executing it for testng xml file
                            executionReusable.mvnBatchCreation(scriptData).then((creationResult) => {
                                console.log("batch file creation");
                                scriptData[0].mvnStatusId = creationResult;
                                setTimeout(() => {
                                    convertXml(scriptData);

                                }, 5000)

                            })
                        })
                    })
                })
            }
        })
    }

    function convertXml(scriptData) {
        //converting got xml file to Report.json file 
        console.log("for converting the xml to json");
        var scripts = scriptData;
        var interval = setInterval(() => {
            executionReusable.checkTestngReport(scripts).then((xmlCheck) => {
                if (xmlCheck == 'Pass1') {
                    clearInterval(interval);
                    executionReusable.convertXmlToJson(scripts).then((jsonCheck) => {
                        console.log("checking for json file")
                        console.log("Report json is present");
                        callReport(scripts);
                    })

                }
            })
        }, 3000);

    }


    function callReport(data) {
        console.log("Calling the reports method for inserting the reports into DB");
        setTimeout(() => {
            duplicateReport(data);

        }, 1000);
    }


    function duplicateReport(data) {
        // for getting report.json required data to insert in db
        console.log("data for inserting the reportrs in the DB")
        reportNumber = data[0].exceptionRunNumber;
        var executedRunCount = data[0].mainRunNumber;
        var projectName = data[0].projectName;

        var exceptionStatusId = data[0].exceptionStatusId
        console.log(projectName);
        var executionType = data[0].type;
        var exceptionHandledResult = {};
        var exceptionHandledResultArray = [];
        var completeExceptionResult = [];
        var exceptionScriptDetails = [];
        data.forEach(function (s, sindex, sarray) {
            var details = {
                'exceptionName': s.exceptionName,
                'actionAdded': s.action,
                'scriptName': s.scriptName,
                'operationmsg': s.operationmsg
            }
            exceptionScriptDetails.push(details);

        })
        exceptionHandledResultArray = _.uniqBy(exceptionScriptDetails, 'scriptName');
        console.log("filtered array after removing the duplicates");
        //getting required data from reports.json file to insert in db
        var convertedJson = path.join(__dirname, "../uploads/opal/" + data[0].projectName + "/suites/exceptionHandler" + data[0].mainRunNumber + "/" + data[0].createdCopySuite + "/target/surefire-reports/Report.json")
        if (fs.existsSync(convertedJson)) {


            fs.readFile(convertedJson, 'utf8', function (err, data) {
                if (err) throw err;
                obj = JSON.parse(data);
                var totalCounts = obj["testng-results"];
                var suiteLevel = obj["testng-results"]["suite"];
                var scriptStatus11;
                var startedAt;
                var endedAt;
                var suiteName = suiteLevel.name;
                var Duration;
                var stepstarted;
                var scriptStatus;
                var scriptStartedAt;
                var scriptEndedAt;
                var scriptPassed = 0;
                var scriptFailed = 0;

                for (let key in suiteLevel) {
                    if (key == 'started-at') {
                        startedAt = suiteLevel[key];
                    }
                    if (key == 'finished-at') {
                        endedAt = suiteLevel[key];
                    }
                    if (key == 'duration-ms') {
                        Duration = suiteLevel[key];
                    }
                }
                var testLevel = obj['testng-results']['suite']['test']
                if (testLevel.length == undefined) {
                    var singleScript = obj['testng-results']['suite']['test']['class']
                    var filename = singleScript.name;
                    var a = filename.split('.');
                    var moduleName = a[0];
                    var featureName = a[1];
                    var scriptName = a[2];
                    var singleTestMethod = singleScript["test-method"];
                    if (singleTestMethod.length == undefined) {
                        let adults = singleTestMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');
                        if (adults.length == 0) {
                            scriptStatus = "Pass";
                            console.log("no status failed")
                        } else {
                            scriptStatus = 'Fail';
                            console.log("some are failed");
                        }
                        this.latestRunCount = executedRunCount
                        var exception = {
                            'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'exceptionRunCount': reportNumber, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                            "suiteName": suiteName, 'Run': executedRunCount, 'projectName': projectName, "executionType": executionType
                        }

                        completeExceptionResult.push(exception);
                        db.reports.update({ "Run": executedRunCount },
                            { $set: { exception: completeExceptionResult } }
                            , function (err, doc) {
                                if (err) console.log(err)
                            })

                        var executionDetails = {
                            'reportNum': executedRunCount,
                            'exceptionStatusId': exceptionStatusId

                        }
                    }

                    else {
                        singleTestMethod.forEach(function (step, index, array) {

                            let adults = singleTestMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');

                            if (adults.length == 0) {
                                scriptStatus = "Pass";
                                console.log("no status failed")
                            } else {
                                scriptStatus = 'Fail';
                                console.log("some are failed");
                            }

                            if (index == array.length - 1) {

                                console.log("how many times insertion is taking place")
                                var exception = {
                                    'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'exceptionRunCount': reportNumber, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                    "suiteName": suiteName, 'exceptionDetails': exceptionHandledResultArray, 'Run': executedRunCount, 'projectName': projectName, "executionType": executionType
                                }
                                completeExceptionResult.push(exception);
                                db.reports.update({ "Run": executedRunCount },
                                    { $set: { exception: completeExceptionResult } }
                                    , function (err, doc) {
                                        if (err) console.log(err)
                                        summaryReport(executionDetails);
                                    })

                                var executionDetails = {
                                    'reportNum': executedRunCount,
                                    'exceptionStatusId': exceptionStatusId
                                }

                            }//if

                        }) //for each of test-method

                    }//else

                } //end of single script
                else {
                    //if we have more scripts in suite 
                    console.log("when there are two or more script's in the suite");
                    testLevel.forEach(function (e, eindex, eArray) {
                        scriptStartedAt = e["started-at"];
                        scriptEndedAt = e["finished-at"];
                        scriptDuration = e["duration-ms"];
                        var filename = e.class.name;
                        var a = filename.split('.');
                        var moduleName = a[0];
                        var featureName = a[1];
                        var scriptName = a[2];
                        var scriptStatus;
                        var testMethod = e.class['test-method'];
                        testMethod.forEach(function (step) {
                            let adults = testMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');
                            if (adults.length == 0) {
                                scriptStatus = "Pass";
                                console.log("no status failed")
                            } else {
                                scriptStatus = 'Fail';
                                console.log("some are failed");
                            }
                        }) //for each of test-method
                        console.log("multiple  script");
                        var exception = {
                            'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": testMethod, 'exceptionRunCount': reportNumber, 'startedAt': startedAt, "endedAt": endedAt, scriptStatus: scriptStatus,
                            "suiteName": suiteName, 'exceptionDetails': exceptionHandledResultArray, 'Run': executedRunCount, 'projectName': projectName, "executionType": executionType
                        }
                        completeExceptionResult.push(exception);
                        console.log("weather both the script are present while inserting or not")
                        if (eindex == eArray.length - 1) {
                            db.reports.update({ "Run": executedRunCount },
                                { $set: { exception: completeExceptionResult } }
                                , function (err, doc) {
                                    if (err) console.log(err)
                                    var executionDetails = {
                                        'reportNum': executedRunCount,
                                        'exceptionStatusId': exceptionStatusId
                                    }
                                    summaryReport(executionDetails);
                                })


                        }
                    }) //for each for testLevel

                }//else
            })
        }
    }//end of duplicateReport()

    function summaryReport(details) {
        //inserting data into summary in reports db
        var summary = [];
        var completeManual = [];
        var completeException = [];
        var totalexceptionCount;
        var summaryReportNum;
        var executionStatus = [];
        db.reports.find({ "Run": details.reportNum }, function (err, doc) {

            completeManual = doc[0].manual;
            completeException = doc[0].exception;
            totalexceptionCount = doc[0].totalExceptionHandling;
            if (completeException != undefined) {
                var onlyPassed = completeManual.filter(scripts => scripts.scriptStatus == 'Pass')
                onlyPassed.forEach(function (e) {
                    summary.push(e)
                })

                for (let i = 1; i <= totalexceptionCount; i++) {
                    var exceptionRun = details.reportNum + '_' + i;
                    summaryReportNum = details.reportNum + '_' + 'Summary';
                    if (i == totalexceptionCount) {
                        console.log("completeException completeException ");
                        var firstException = completeException.filter(scripts => scripts.exceptionRunCount == exceptionRun)
                        console.log("if condition")
                        var firstPassed = firstException.filter(firstIteration => firstIteration.scriptStatus == 'Pass' || firstIteration.scriptStatus == "Fail")
                        firstPassed.forEach(function (f) {
                            summary.push(f);
                        })
                    } else {

                        var firstException = completeException.filter(scripts => scripts.exceptionRunCount == exceptionRun)
                        var firstPassed = firstException.filter(firstIteration => firstIteration.scriptStatus == 'Pass')
                        firstPassed.forEach(function (f) {
                            summary.push(f);
                        })
                    }
                }//for loop
            } else {
                var onlyPassed = completeManual.filter(scripts => scripts.scriptStatus == 'Pass')
                onlyPassed.forEach(function (e) {
                    summary.push(e)
                })
                summaryReportNum = details.reportNum + '_' + 'Summary';
            }
            summary.forEach(function (e) {
                e['summaryReportNum'] = summaryReportNum;
                e['projectName'] = details.projectName;
            })

            db.reports.update({ "Run": details.reportNum },
                {
                    $set:
                    {
                        "summary": summary
                    }
                }, function (err, doc1) {
                    if (err) console.log(err)
                    console.log("updated the summary report");
                    db.exceptionStatus.update({ "_id": mongojs.ObjectId(details.exceptionStatusId) }, { $set: { "status": "pass" } })

                })
        })
    }


}