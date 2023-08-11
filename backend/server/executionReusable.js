var mongojs = require('mongojs');
const editJsonFile = require("edit-json-file");
var db = require('../dbDeclarations').url;
var path = require("path");
var cmd = require('child_process');
var fs = require('fs');
var LineReader = require('line-by-line');
const fse = require('fs-extra');
const trackingService = require('./services/trackingService');
var machineIdHere;
var timer;
var timer2 = true;
var batchResult;

var getAvailableMachines = (data1) => new Promise((resolves, reject) => {
    //getting available machines to run scripts where status is "no"
    console.log("getting the available machines");
    var completeObject = data1;
    var machineName;
    // console.log(completeObject)
    var start = new Date()
    var hrstart = process.hrtime()
    //vijay commented
    // if(completeObject[0].type == 'execution' || completeObject[0].type == 'schedule'){
    //     machineName = 'default';
    //     // machineName = 'machine2';
    // }
    // if(completeObject[0].type == 'exception' || completeObject[0].type == 'schedulerException'){
    //     machineName = 'machine2';
    // }
    let data;
    var gotAns = false;
    db.dockerEnvironment.find({ "state": "Running", "errors": "", "executionStatus": "no" }
        , function (err, doc) {
            if (doc.length != 0) {
                //  console.log(data[0]._id);  
                var end = new Date() - start;
                hrend = process.hrtime(hrstart)
                console.info('getAvailableMachines() Execution time: %dms', end)
                // console.log("getAvailableMachines function Completed (hr): %ds %dms "+ hrend[0], hrend[1] / 1000000);
                resolves(doc);
            } else {
                console.log("no machines got");
                resolves(doc);
            }
        });
})


var getRunCount = (data) => new Promise((resolves, reject) => {
    //inserting runno in reports
    console.log("calling the report document inserting run no");

    var completeObject = data;
    var start = new Date()
    var hrstart = process.hrtime()
    var reportNo;
    var stringReportNo;
    db.countInc.find({}, function (err, doc1) {
        reportNo = doc1[0].runCount;
        stringReportNo = reportNo.toString();
        db.reports.find({ "Run": stringReportNo }, function (err, doc) {
            if (doc.length == 0) {
                //if executing scripts manually
                if (completeObject[0].type == 'execution') {

                    db.reports.insert({
                        'Run': stringReportNo, "executionType": "execution", "suiteName": '', "totalScripts": '', "startedAt": '', "endedAt": '',
                        "summary": [], "totalExceptionHandling": 1, "exceptionOption": '', "projectId": '', "releaseVersion": ''
                    }, function (err, doc) {
                    })
                }
                else if (completeObject[0].type == 'jenkins') {

                    db.reports.insert({
                        'Run': stringReportNo, "executionType": "jenkins", "suiteName": '', "totalScripts": '', "startedAt": '', "endedAt": '',
                        "summary": [], "totalExceptionHandling": 1, "exceptionOption": '', "projectId": '', "releaseVersion": ''
                    }, function (err, doc) {
                    })
                }
                else {
                    //if scripts are scheduled
                    db.reports.insert({
                        'Run': stringReportNo, "executionType": "schedule", "suiteName": '', "totalScripts": '', "startedAt": '', "endedAt": '',
                        "summary": [], "totalExceptionHandling": 1, "scheduleName": '', "schedule": [], "exceptionOption": '',
                        "projectId": '', "releaseVersion": ''
                    }, function (err, doc) {

                    });

                }
            }
        })
        completeObject.forEach(function (e) {
            e['runNumber'] = stringReportNo;
        })
        var end = new Date() - start;
        hrend = process.hrtime(hrstart)
        resolves(completeObject);
    });
    db.countInc.findAndModify({
        query: { "projectID": "pID" },
        update: { $inc: { "runCount": 1 } },
        new: true
    }, function (err, doc) {
        console.log('incremented')
    })

})

// var suiteCreation=(data)=>new Promise((resolve,reject)=>{
//     console.log("function for creating the testng.xml ")
//     var start = new Date()
//     var hrstart = process.hrtime()
//     //  console.log(data);
//     var a = 1;
//     var i, l;
//     var c = "Opal";
//     var filedata = [];
//     var fullline;
//     var file11data = [];
//     var n = "Node";
//     var projectName;
//     var file;
//     var mainPath ;
//     projectName = data[0].projectname;
//     if (data[0].type == 'execution') {
//         file = "./uploads/opal/" + projectName + "/suites/" + data[0].suite + "/testng.xml";
//     }
//     else if (data[0].type == 'exception') {
//         // file = "./uploads/opal/" + projectName + "/suites/" + data[0].suite + "/testng.xml";
//         file = "./uploads/opal/" + data[0].projectName + "/suites/exceptionHandler/" + data[0].createdCopySuite + "/testng.xml"
//     }
//     else if(data[0].type == 'schedulerException'){
//         file = "./uploads/opal/" + data[0].projectName + "/suites/Scheduler/schedulerExceptionHandler/" + data[0].createdCopySchedule + "/testng.xml"
//     }
//     else {
//         console.log(data[0].scheduleName)
//         console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
//         file = "./uploads/opal/" + data[0].projectName + "/suites/Scheduler/" + data[0].scheduleName + "/testng.xml"
//         data[0].moduleName = data[0].allScripts[0].moduleName;
//         data[0].fetaureName = data[0].allScripts[0].fetaureName;
//         data[0].scriptName = data[0].allScripts[0].scriptName;
//         data[0].suiteName = data[0].testSuite
//     }
//     console.log("file path");
//     console.log(file)
//     // mainPath = path.join(__dirname,file);
//     console.log("new path is here");
//     console.log(mainPath);
//     fs.createWriteStream(file);
//     for (i = 0; i <= data.length - 1; i++) {
//         var mname = data[i].moduleName;
//         var fname = data[i].fetaureName;
//         var fline = "<test name=" + "\"" + c + a + "\"\>";
//         var par = "<parameter name=" + "\"" + n + "\"\ " + "value=" + "\"" + data[i].IPAddress + "\"\/>";
//         var sline = "<classes><class name=" + "\"" + data[i].moduleName + '.' + data[i].fetaureName + '.' + data[i].scriptName + "\"\/></classes>";
//         var lline = "</test>";
//         fullline = "\n" + fline + "\n" + par + "\n" + sline + "\n" + lline;
//         file11data.push(fullline);
//         arrayout = file11data.join('');
//         if (i == 0) {
//             fs.appendFileSync(file, "<?xml version='1.0' encoding='UTF-8'?>" + "\n", 'utf8');
//             fs.appendFileSync(file, "<!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>" + "\n", 'utf8');
//             var suiteName
//             if (data[i].type == 'execution') {
//                 suiteName = data[0].suite;
//             } else if (data[i].type == 'exception') {
//                 suiteName = data[0].createdCopySuite;
//             }
//             else {
//                 suiteName = data[0].scheduleName;  
//             }
//             fs.appendFileSync(file, "<suite name=" + "\"" + suiteName + "\"" + ">");
//         }
//         if (i == data.length - 1) {
//             fs.appendFileSync(file, arrayout + "\n");
//             resolve("creation completed")
//         }
//         a++;
//     }
//     fs.appendFileSync(file, "</suite>");
//     var end = new Date() - start;
//         hrend = process.hrtime(hrstart)
//         console.info('suiteCreation() Execution time: %dms', end)
//         // console.log("suiteCreation function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);

// })

var suiteCreation = (data) => new Promise((resolve, reject) => {
    //creating testng.xml file for running mvn 
    console.log("function for creating the testng.xml ")
    console.log(data)
    console.log(data[0].allScripts)
    var parallelcheck = data[0].parallelExecution
    if (parallelcheck == true) {
        noOfBrowserscheck = data[0].noOfBrowsers;
    }
    else {
        noOfBrowserscheck = 1;
    }

    var start = new Date()
    var hrstart = process.hrtime()
    var a = 1;
    var i, l;
    var c = "Opal";
    var filedata = [];
    var fullline;
    var file11data = [];
    var n = "Node";
    var projectName;
    var file;
    var mainPath;
    projectName = data[0].projectname;
    if (data[0].type == 'execution') {
        file = "./uploads/opal/" + projectName + "/suites/" + data[0].suite + "/testng.xml";
    }
    else if (data[0].type == 'exception') {
        file = "./uploads/opal/" + data[0].projectName + "/suites/exceptionHandler" + data[0].mainRunNumber + "/" + data[0].createdCopySuite + "/testng.xml"
    }
    else if (data[0].type == 'schedulerException') {
        file = "./uploads/opal/" + data[0].projectName + "/suites/Scheduler/schedulerExceptionHandler/" + data[0].createdCopySchedule + "/testng.xml"
    }
    else {
        file = "./uploads/opal/" + data[0].projectName + "/suites/Scheduler/" + data[0].scheduleName + "/testng.xml"
        data[0].moduleName = data[0].allScripts[0].moduleName;
        data[0].fetaureName = data[0].allScripts[0].fetaureName;
        data[0].scriptName = data[0].allScripts[0].scriptName;
        data[0].suiteName = data[0].testSuite
    }

    for (i = 0; i <= data.length - 1; i++) {
        var mname = data[i].moduleName;
        var fname = data[i].fetaureName;
        var fline = "<test name=" + "\"" + c + a + "\"\>";
        var par = "<parameter name=" + "\"" + n + "\"\ " + "value=" + "\"" + data[i].IPAddress + "\"\/>";
        var sline = "<classes><class name=" + "\"" + data[i].moduleName + '.' + data[i].fetaureName + '.' + data[i].scriptName + "\"\/></classes>";
        var lline = "</test>";
        fullline = "\n" + fline + "\n" + par + "\n" + sline + "\n" + lline;
        file11data.push(fullline);
        arrayout = file11data.join('');
        if (i == 0) {
            // fs.appendFileSync(file, "<?xml version='1.0' encoding='UTF-8'?>" + "\n", 'utf8');
            // fs.appendFileSync(file, "<!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>" + "\n", 'utf8');
            var createFile = fs.createWriteStream(file);
            createFile.write("<?xml version='1.0' encoding='UTF-8'?>\n")
            createFile.write("<!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n")
            var suiteName
            if (data[i].type == 'execution') {
                suiteName = data[0].suite;
            } else if (data[i].type == 'exception') {
                suiteName = data[0].createdCopySuite;
            }
            else {
                suiteName = data[0].scheduleName;
            }
            // fs.appendFileSync(file, "<suite name=" + "\"" + suiteName + "\"" + ">");
            // thread-count="2" name="Suite" parallel="tests"
            var tests = "tests"
            createFile.write("<suite thread-count=" + "\"" + noOfBrowserscheck + "\"" + "  name=" + "\"" + suiteName + "\"" + " parallel=" + "\"" + tests + "\"" + " >");
        }
        if (i == data.length - 1) {
            // fs.appendFileSync(file, arrayout + "\n");
            createFile.write(arrayout)
            createFile.write("\n")
            createFile.write("</suite>")
            createFile.end(function () {
                console.log(`done writing testng ${file} `);
                var createdXml = 'Pass';
                resolve(createdXml)
                //    var interval = setInterval(()=>{
                //     if(fs.existsSync(file)){
                //         var createdXml = 'Pass';
                //         resolve(createdXml)
                //     }else{
                //         suiteCreation(data);
                //     }
                //    },4000) 

            })
            // 
        }
        a++;
    }
    // fs.appendFileSync(file, "</suite>");

    var end = new Date() - start;
    hrend = process.hrtime(hrstart)
    console.info('suiteCreation() testng.xml Execution time: %dms', end)
    // console.log("suiteCreation function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);

})


var getIpAddress = () => new Promise((resolve, reject) => {
    console.log("executing the Ip address call");
    var start = new Date()
    var hrstart = process.hrtime()
    var newPath = __dirname;
    cmd.exec(__dirname + "/Batch/IpAddress.bat", (err, stdout, stderr) => {
        lR = new LineReader(__dirname + "/Batch/IpAddress.txt")
        lR.on('error', function (err) {
            console.log("Ip address file reading error");
        });
        lR.on('line', function (line) {
            if (line.includes("Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)") == true) {
                tempExecute = 1;
                console.log(" executing  docker Ip Address is on  " + "\n\n");
            }
        })//lr
    })//cmd
    var end = new Date() - start;
    hrend = process.hrtime(hrstart)
    console.info('getIpAddress() Execution time: %dms', end)
    // console.log("getIpAddress function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);
    resolve("updated Ip address batch file");
}) //end of IpAddress()

var mvnBatchCreation = (data) => new Promise((resolve, reject) => {
    console.log("coming mvnBatch")
    //creating mvn batch file for executing
    var myData = data;
    var batchCreation;
    console.log("mvn batch creation ");
    var start = new Date()
    var hrstart = process.hrtime()
    //var file = __dirname + "\\Batch\\"+data[0].suite+".bat";
    var type = data[0].type;
    if (data[0].type == 'execution') {
        file = path.join(__dirname, `../uploads/opal/${data[0].projectname}/suites/${data[0].suite}.bat`)
        filetxt = path.join(__dirname, `../uploads/opal/${data[0].projectname}/suites/${data[0].suite}.txt`)
        var projectPath = path.join(__dirname, `../uploads/opal/${data[0].projectname}/suites/${data[0].suite}`)
    }
    else if (data[0].type == 'exception') {
        file = path.join(__dirname, `../uploads/opal/${data[0].projectName}/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}.bat`)
        filetxt = path.join(__dirname, `../uploads/opal/${data[0].projectName}/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}.txt`)
        var projectPath = path.join(__dirname, `../uploads/opal/${data[0].projectName}/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}`)
    }
    else if (data[0].type == 'schedulerException') {
        file = path.join(__dirname, `../uploads/opal/${data[0].projectName}/suites/Scheduler/schedulerExceptionHandler/${data[0].createdCopySchedule}.bat`)
        filetxt = path.join(__dirname, `../uploads/opal/${data[0].projectName}/suites/Scheduler/schedulerExceptionHandler/${data[0].createdCopySchedule}.txt`)
        var projectPath = path.join(__dirname, `../uploads/opal/${data[0].projectName}/suites/Scheduler/schedulerExceptionHandler/${data[0].createdCopySchedule}`)
    }
    else {
        file = path.join(__dirname, `../uploads/opal/${data[0].projectName}/suites/Scheduler/${data[0].scheduleName}.bat`)
        filetxt = path.join(__dirname, `../uploads/opal/${data[0].projectName}/suites/Scheduler/${data[0].scheduleName}.txt`)
        var projectPath = path.join(__dirname, `../uploads/opal/${data[0].projectName}/suites/Scheduler/${data[0].scheduleName}`)

    }
    myData.forEach(function (m, mindex, mArray) {

        if (mindex == mArray.length - 1) {
            // fs.appendFileSync(file, "@echo off" + "\n", 'utf8');
            // fs.appendFileSync(file, "cd " + projectPath + " && " + "mvn clean install  > " + __dirname + "\\Batch\\Mvn.txt" + "\n", 'utf8');
            var mvnFileCreation = fs.createWriteStream(file);
            mvnFileCreation.write("@echo off\n")
            mvnFileCreation.write("cd " + projectPath + " && " + "mvn clean install  > " + filetxt )
            mvnFileCreation.end(function () {
                console.log(`done writing mvn batch  ${file} `);
                batchCreation = 'Pass';


                //vijay insertion code

                db.mvnStatus.insert({ status: "started" }, function (err, doc) {
                    // console.log(doc);
                    // let data = {
                    //     id:doc._id,

                    // }
                    data[0].mvnStatusId = doc._id;
                    mvnExecution(data,file);
                    resolve(doc._id);

                })

            })
            var end = new Date() - start;
            hrend = process.hrtime(hrstart)
            console.info('mvnBatchCreation() Execution time: %dms', end)
            // console.log("mvnBatchCreation function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);

        }
    })

})

// var mvnExecution=(data)=>new Promise((resolve,reject)=>{
//     console.log("executing the mvn batch file for executing the suite 0000000000000000000000000000000000000000000000");
//     // console.log(data);
//     var start = new Date()

//     var hrstart = process.hrtime()
//     cmd.exec(__dirname + "\\Batch\\Mvn.bat", (err, stdout, stderr) => {
//         console.log(" MVN batch file executed " + "\n\n");
//         if (err) {
//             throw err;
//           }
//           console.log(stdout);
//         batchResult = "Pass";
//         // callback(batchResult);
//         var end = new Date() - start;
//             hrend = process.hrtime(hrstart)
//             console.info('mvnExecution() Execution time: %dms', end)
//             // console.log("mvnBatchCreation function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);
//         resolve(batchResult);
//     })

// })

function mvnExecution(data,file) {
    //executing mvn batch file for executing suite
    console.log("executing the mvn batch file for executing the suite ");
    // console.log(data);
    var start = new Date()
    var hrstart = process.hrtime()
    cmd.exec(file, (err, stdout, stderr) => {
        console.log(" MVN batch file executed " + "\n\n");


        try {

            if (err != null) {
                throw err;
            } else {
                console.log(stdout);
                batchResult = "Pass";
                // callback(batchResult);
                var end = new Date() - start;
                hrend = process.hrtime(hrstart)
                console.info('mvnExecution() Execution time: %dms', end)

            }

        } catch (err) {
            console.log("data[0].mvnStatusId    ", err);
            // console.log(data);
            // console.log(data[0].mvnStatusId);
            // console.log(data[0].machineID);
            db.mvnStatus.update({ "_id": mongojs.ObjectId(data[0].mvnStatusId) }, { $set: { "status": "compilationError" } })

            db.dockerEnvironment.update({ "_id": mongojs.ObjectId(data[0].machineID) }, { $set: { "executionStatus": "no" } })


        }

        // console.log("mvnBatchCreation function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);
        // resolve(batchResult);
    })

}

var updateDockerStatus = (data) => new Promise((resolves, reject) => {
    //updating docker status to yes
    var start = new Date()
    var hrstart = process.hrtime()
    console.log("update ing the docker machine status " + data[0].machineID)
    machineIdHere = data[0].machineID;
    db.dockerEnvironment.update({ "_id": mongojs.ObjectId(machineIdHere) }, { $set: { "executionStatus": "yes" } }, function (err, doc) {
        var end = new Date() - start;
        hrend = process.hrtime(hrstart)
        console.info('updateDockerStatus() Execution time: %dms', end);
        // console.log("updateDockerStatus function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);
        resolves(doc);
    })
})

var updateScriptConfig = (data) => new Promise((resolves, rejects) => {
    //updating script config in suite folder to selected config
    console.log("calling the function for config file editing");
    var start = new Date()
    var hrstart = process.hrtime()
    for (let r = 0; r <= data.length - 1; r++) {
        var config;
        var finalConfig;
        var configFile;
        if (data[0].type === 'execution') {
            // var config = "../uploads/opal/" + data[r].projectname + "/suites/" + data[r].suite + "/src/test/java/" + data[r].moduleName + "/" + data[r].fetaureName + "/" + data[r].scriptName + "Config.json";
            var config = `../uploads/opal/${data[r].projectname}/suites/${data[r].suite}/src/test/java/${data[r].moduleName}/${data[r].fetaureName}/${data[r].scriptName}Config.json`;
            var finalConfig = path.join(__dirname, config);
            console.log(finalConfig)
            var configFile = editJsonFile(finalConfig);
            configFile.set("IpAddress.IP", `http://${data[r].IPAddress}:4444`);
            configFile.set("BrowserDetails.BrowserType", data[r].browser);
            configFile.set("BrowserDetails.Version", data[r].Version);
            configFile.set("ExecutionCount.reportCount", data[r].runNumber);
            configFile.set('SuiteName.suiteName', data[r].suite);
            configFile.save();
            console.log("updated config file data");
        }
        else if (data[0].type == "schedule") {
            for (p = 0; p <= data[0].allScripts - 1; p++) {
                config = `../uploads/opal/${data[r].projectName}/suites/Scheduler/${data[r].scheduleName}/src/test/java/${data[r].allScripts[0].moduleName}/${data[r].allScripts[0].fetaureName}/${data[r].allScripts[0].scriptName}Config.json`;
                console.log(config);

                finalConfig = path.join(__dirname, config);
                configFile = editJsonFile(finalConfig);
                configFile.set("IpAddress.IP", `http://${IPAddress}:4444`);
                configFile.set("BrowserDetails.BrowserType", data[r].allScripts[p].browser);
                configFile.set("BrowserDetails.Version", data[r].allScripts[p].Version);
                configFile.set("ExecutionCount.reportCount", runNumber);
                configFile.set('SuiteName.suiteName', data[r].scheduleName);
                // console.log(configFile);
                configFile.save();

            }

        }

        else if (data[0].type == "jenkins") {
            console.log("update coming")
            for (p = 0; p <= data[0].allScripts - 1; p++) {
                config = `../uploads/opal/${data[r].projectName}/suites/Jenkins/${data[r].testSuite}/src/test/java/${data[r].allScripts[0].moduleName}/${data[r].allScripts[0].fetaureName}/${data[r].allScripts[0].scriptName}Config.json`;
                console.log(config);

                finalConfig = path.join(__dirname, config);
                configFile = editJsonFile(finalConfig);
                configFile.set("IpAddress.IP", `http://${IPAddress}:4444`);
                configFile.set("BrowserDetails.BrowserType", data[r].allScripts[p].browser);
                configFile.set("BrowserDetails.Version", data[r].allScripts[p].Version);
                configFile.set("ExecutionCount.reportCount", runNumber);
                configFile.set('SuiteName.suiteName', data[r].testSuite);
                // console.log(configFile);
                configFile.save();

            }

        }

    }
    var end = new Date() - start;
    hrend = process.hrtime(hrstart)
    console.info('updateScriptConfig() Execution time: %dms', end)
    // console.log("updateScriptConfig function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);
    resolves("script config updated")
})

//function for checking the presence of testng-report.xml file
var checkTestngReport = (completeObject) => new Promise((resolve, reject) => {
    //checking for testng xml file
    // console.log("Checking the presence of testng-report.xml");
    var start = new Date()
    var hrstart = process.hrtime()
    var pathOfFile;
    var result;
    timer2 = true;
    let e = completeObject[0];
    if (e.type == 'execution') {
        pathOfFile = path.join(__dirname, `../uploads/opal/${e.projectname}/suites/${e.suite}/target/surefire-reports/testng-results.xml`);

    } else if (e.type === 'exception') {
        pathOfFile = path.join(__dirname, `../uploads/opal/${e.projectName}/suites/exceptionHandler${e.mainRunNumber}/${e.createdCopySuite}/target/surefire-reports/testng-results.xml`);
    } else if (e.type === 'schedule') {
        pathOfFile = path.join(__dirname, `../uploads/opal/${e.projectName}/suites/Scheduler/${e.scheduleName}/target/surefire-reports/testng-results.xml`);

    } else {
        pathOfFile = path.join(__dirname, `../uploads/opal/${e.projectName}/suites/Scheduler/schedulerExceptionHandler/${e.createdCopySchedule}/target/surefire-reports/testng-results.xml`);
    }
    if (fs.existsSync(pathOfFile)) {
        console.log(" testngresults.xml file Present" + "\n\n");
        result = 'Pass1';

        var end = new Date() - start;
        hrend = process.hrtime(hrstart)
        console.info('checking for xml file () Execution time: %dms', end);
        // var file = __dirname + "\\Batch\\xmlToJson.bat";
        // fs.createWriteStream(file);
        // setTimeout(() => {
        //     db.mvnStatus.remove({ "_id": mongojs.ObjectId(completeObject[0].mvnStatusId) })
        // }, 15000);

        resolve(result);
    } else {

        // db.mvnStatus.find()
        db.mvnStatus.findOne({ "_id": mongojs.ObjectId(completeObject[0].mvnStatusId) }, function (err, doc) {


            // console.log('Error 1 Error 1 Error 1 Error 1 Error 1 Error 1 Error 1 Error 1 Error 1 Error 1 Error 1 ')
            //   console.log(doc.status);
            if (doc.status === "compilationError") {
                result = "compilationError";
                // setTimeout(() => {
                //     db.mvnStatus.remove({ "_id": mongojs.ObjectId(completeObject[0].mvnStatusId) })
                // }, 15000);
                resolve(result)
            } else {
                result = 'Fail';
                resolve(result);
            }
            //  console.log(" iam not present in xml file ")

        })

    } //else closer

})//end of checkTestngReport()


//function for converting the report.xml to report.json
var convertXmlToJson = (data) => new Promise((resolve, reject) => {
    //convert testngresult.xml file to reports.json with batch file
    var execution = false;
    timer = true;
    console.log("updating docker status to no")
    var start = new Date()
    var hrstart = process.hrtime()
    var machineId = data[0].machineID;
    db.dockerEnvironment.update({ "_id": mongojs.ObjectId(machineId) }, { $set: { "executionStatus": "no" } })

    console.log("converting xml to json");
    // console.log(machineIdHere);
    var file = __dirname + "\\Batch\\xmlToJson.bat";
    var projectPath;
    var result11;
    var checkReportJson;
    var start1 = new Date()
    var hrstart1 = process.hrtime()
    //  fs.createWriteStream(file);

    // fs.appendFileSync(file, "@echo off" + "\n", 'utf8');
    // fs.appendFileSync(file, "cd " + projectPath + " && " + " mvn exec:java -Dexec.mainClass=reuseablePackage.feature.XMLtoJSON " + "\n", 'utf8');

    var end1 = new Date() - start1;
    // hrend = process.hrtime(hrstart)
    console.info('creating the batch file  for converting xml to json Execution time: %dms', end1)

    if (data[0].type === 'execution') {
        projectPath = path.join(__dirname, "../uploads/opal/" + data[0].projectname + "/suites/" + data[0].suite)
        checkReportJson = path.join(__dirname, "../uploads/opal/" + data[0].projectname + "/suites/" + data[0].suite + "/target/surefire-reports/Report.json");
    }
    else if (data[0].type === 'exception') {
        projectPath = path.join(__dirname, "../uploads/opal/" + data[0].projectName + "/suites/exceptionhandler" + data[0].mainRunNumber + "/" + data[0].createdCopySuite)
        //+ "/target/surefire-reports/testng-results.xml"
        machineIdHere = data[0].machineID;
        // console.log("docker machine Id");
        // console.log(machineIdHere);
        checkReportJson = path.join(__dirname, "../uploads/opal/" + data[0].projectName + "/suites/exceptionHandler" + data[0].mainRunNumber + "/" + data[0].createdCopySuite + "/target/surefire-reports/Report.json");
    }
    else if (data[0].type == "schedule") {
        projectPath = path.join(__dirname, "../uploads/opal/" + data[0].projectName + "/suites/Scheduler/" + data[0].scheduleName)
        checkReportJson = path.join(__dirname, "../uploads/opal/" + data[0].projectName + "/suites/Scheduler/" + data[0].scheduleName + "/target/surefire-reports/Report.json");

    }
    else {
        projectPath = path.join(__dirname, "../uploads/opal/" + data[0].projectName + "/suites/Scheduler/schedulerExceptionHandler/" + data[0].createdCopySchedule)
        checkReportJson = path.join(__dirname, "../uploads/opal/" + data[0].projectName + "/suites/Scheduler/schedulerExceptionHandler/" + data[0].createdCopySchedule + "/target/surefire-reports/Report.json");

    }

    // setTimeout(() => {
    //     fs.appendFileSync(file, "@echo off" + "\n", 'utf8');
    //     fs.appendFileSync(file, "cd " + projectPath + " && " + " mvn exec:java -Dexec.mainClass=reuseablePackage.feature.XMLtoJSON " + "\n", 'utf8');
    //     cmd.exec(__dirname + "/Batch/xmlToJson.bat");
    //     // result11 = 'Pass';    
    //     execution = true;
    // }, 1000)
    var file = __dirname + "\\Batch\\xmlToJson.bat";


    // var tempFile = fs.createWriteStream(file);
    // tempFile.on('open', function(fd) {

    //     fs.appendFileSync(file, "@echo off" + "\n", 'utf8');
    //     fs.appendFileSync(file, "cd " + projectPath + " && " + " mvn exec:java -Dexec.mainClass=reuseablePackage.feature.XMLtoJSON " + "\n", 'utf8');
    //     tempFile.end();
    //     console.log("creating file and adding data")
    // }).on('end',function() {
    //     console.log("createdfile and executing cmd /Batch/xmlToJson.bat ")
    //     cmd.exec(__dirname + "/Batch/xmlToJson.bat");
    //         // result11 = 'Pass';    
    //         execution = true;
    // })
    var wstream = fs.createWriteStream(file);
    wstream.on('finish', function () {
        console.log(`converting batch file finished writing   ${file}`);
        // console.log('value is:', memStore.foo.toString());
    });
    wstream.write('@echo off\n');
    wstream.write(`cd ${projectPath}  &&  mvn exec:java -Dexec.mainClass=reuseablePackage.feature.XMLtoJSON `);
    // on Node.js older than 0.10, add cb to end()
    wstream.end(function () {
        console.log(`done writing  ${file} `);
        console.log("createdfile and executing cmd /Batch/xmlToJson.bat ")
        // cmd.exec(__dirname + "/Batch/xmlToJson.bat");
        cmd.exec(__dirname + "/Batch/xmlToJson.bat", (error, stdout, stderr) => {
            // if (error) {
            // // //   throw error;
            //  console.log(error);

            // }
            try {
                // throw error;
                if (error != null) {
                    throw error;
                } else {
                    if (fs.existsSync(checkReportJson)) {
                        console.log("fs.existsSync(checkReportJson) has already exsist there");
                        var end = new Date() - start;
                        //   hrend = process.hrtime(hrstart)
                        console.info('convertXmlToJson() for converting xml to json Execution time: %dms', end)
                        var result11 = 'Pass';
                        resolve(result11);
                    } else {
                        var result11 = 'Fail';
                        console.log(" eeeeeeeeeeeee   " + error);
                        resolve(result11);
                        console.log("fs.existsSync(checkReportJson) report.json file is not present still")
                    }
                }
                console.log("errrrrr " + error);
            }
            catch (error) {
                var result11 = 'Fail';
                console.log(" eeeeeeeeeeeee   " + error);
                resolve(result11);
            }
            execution = true;
            // console.log(stdout);


        });
        // result11 = 'Pass';    

    });

    // http.request(url, function(res) {
    //     res.on('data', function(chunk) {
    //         tempFile.write(chunk);
    //     }).on('end', function() {
    //         tempFile.end();
    //         fs.renameSync(tempFile.path, filepath);
    //         return callback(filepath);
    //     });
    // });
    //  })
    // setTimeout(() => {
    //     fs.appendFileSync(file, "@echo off" + "\n", 'utf8');
    //     fs.appendFileSync(file, "cd " + projectPath + " && " + " mvn exec:java -Dexec.mainClass=reuseablePackage.feature.XMLtoJSON " + "\n", 'utf8');
    //     cmd.exec(__dirname + "/Batch/xmlToJson.bat");
    //     // result11 = 'Pass';    
    //     execution = true;
    // }, 1000)


    // if(execution == true){
    // var interval = setInterval(() => {
    //     console.log("interval interval interval");
    //     // console.log(checkReportJson);
    //     if (fs.existsSync(checkReportJson)) {
    //         console.log("report.json file is present" + "\n\n");
    //       var result11 = 'Pass';
    //       var end = new Date() - start;
    //       hrend = process.hrtime(hrstart)
    //       console.info('convertXmlToJson() for converting xml to json Execution time: %dms', end)
    //         resolve(result11);
    //         // callback(result11)
    //         timer = false;
    //     } else {
    //         // result11 = 'Fail';
    //         console.log("report.json file is not present")
    //     }
    //     if (timer == false) {
    //         clearInterval(interval);
    //         // callback(result11)
    //     }
    // }, 1000);


}) // End of convertXmlToJson()


//functio for reports generation
// var result;
// var totalScripts;  //vijay commented on 12/09
var reportGeneration = (data1) => new Promise((resolve, reject) => {
    //inserting data into reports database collection
    console.log("generating data for reports"+ data1[0].runNumber);
    console.log(data1)
    var result;
    var totalScripts;// vijay added on 12/09
    var start = new Date()
    var hrstart = process.hrtime()
    var convertedJson
    var projectName;
    var projectRunCount;
    var jenkinsRunCount
    projectRunCount = data1[0].runNumber


    if (data1[0].type === 'execution') {
        convertedJson = path.join(__dirname, "../uploads/opal/" + data1[0].projectname + "/suites/" + data1[0].suite + "/target/surefire-reports/Report.json")
        projectName = data1[0].projectname;

        db.reports.update({ "Run": projectRunCount }, { $set: { "projectId": data1[0].prid, "releaseVersion": data1[0].selectedRelease } }, function (err, doc) {
            if (err) console.log(err)
            else console.log(doc)
        })

    }
    if (data1[0].type === 'schedule') {
        convertedJson = path.join(__dirname, "../uploads/opal/" + data1[0].projectName + "/suites/Scheduler/" + data1[0].scheduleName + "/target/surefire-reports/Report.json")
        // console.log(convertedJson);
        projectName = data1[0].projectname;

        db.reports.update({ "Run": projectRunCount }, { $set: { "projectId": data1[0].projectId, "releaseVersion": data1[0].selectedRelease } }, function (err, doc) {
            if (err) console.log(err)
            else console.log(doc)
        })

    }
    if (data1[0].type === 'jenkins') {
        convertedJson = path.join(__dirname, "../uploads/opal/" + data1[0].projectName + "/suites/Jenkins/" + data1[0].testSuite + "/target/surefire-reports/Report.json")
        // console.log(convertedJson);
        console.log("Gurururuurururuuru")
        db.reports.update({ "Run": projectRunCount }, { $set: { "projectId": data1[0].projectId } }, function (err, doc) {
            if (err) console.log(err)
            else console.log(doc)
        })

    }

    fs.readFile(convertedJson, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        var totalCounts = obj["testng-results"];

        var suiteLevel = obj["testng-results"]["suite"];
        var executedRunCount;
        var scriptStatus11;
        var startedAt;
        var endedAt;
        var suiteName = suiteLevel.name;
        var Duration;
        var stepstarted;
        var scriptStatus;
        // var scriptName;
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
        console.log("counting how many scripts are present in the suite");
        console.log(testLevel.length);
        console.log(data1[0].requirementId);
        console.log(data1[0].requirementName);
        totalScripts = testLevel.length;
        if (testLevel.length == undefined) {
            var singleScript = obj['testng-results']['suite']['test']['class']
            var filename = singleScript.name;
            var a = filename.split('.');
            var moduleName = a[0];
            var featureName = a[1];
            var scriptName = a[2];
            var requirementId = data1[0].requirementId;
            var requirementName = data1[0].requirementName;
            var executedRunCount;
            var singleTestMethod = singleScript["test-method"];
            if (singleTestMethod.length == undefined) {
                console.log("when only one step is their in the script");
                let adults = singleTestMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');
                // console.log("some steps are failed")
                // console.log(adults)
                if (adults.length == 0) {
                    scriptStatus = "Pass";
                    
                    console.log("no status failed")
                } else {
                    scriptStatus = 'Fail';
                    console.log("some are failed");
                }

                db.testsuite.update({
                    "PID" : data1[0].prid,
                    "testsuitename" : suiteName,
                    "SelectedScripts.scriptName" : scriptName

                },
                {
                    $set: { "SelectedScripts.$.scriptStatus": scriptStatus,
                            "SelectedScripts.$.executionType": "Automated"
                }
                },function (err, doc) {
                    console.log("Updated ScriptStatus")
                })

                db.countInc.find({
                    "projectID": "pID"

                },
                    function (err, doc) {
                        var executedRunCount = doc[0].runCount;
                        this.latestRunCount = executedRunCount

                        db.reports.insert({
                            'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'Run': projectRunCount, 'startedAt': startedAt, "endedAt": endedAt, scriptStatus: scriptStatus,
                            "suiteName": suiteName, 'projectName': projectName, 'requirementName':data1[0].requirementName, "requirementId":data1[0].requirementId
                        }, function (err, doc) {

                        });

                    });
                db.countInc.findAndModify({
                    query: { "projectID": "pID" },
                    update: { $inc: { "runCount": 0 } },
                    new: true
                }, function (err, doc) {
                    var miniResult = {
                        'status': "Pass",
                        "reportNumber": projectRunCount
                    };
                    // res.json([{ 'status': executedRunCount }])
                    result = miniResult;
                    // callback(result)
                    resolve(result);
                })

            }//test-method is object;

            else {
                console.log("multiple steps in the scripts");
                singleTestMethod = checkFailStep(singleTestMethod);
                singleTestMethod.forEach(function (step, index, Array) {

                    let adults = singleTestMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');

                    if (adults.length == 0) {
                        scriptStatus = "Pass";
                        console.log("no status failed")
                    } else {
                        scriptStatus = 'Fail';
                        console.log("some are failed");
                    }
                    db.testsuite.update({
                        "PID" : data1[0].prid,
                        "testsuitename" : suiteName,
                        "SelectedScripts.scriptName" : scriptName
    
                    },
                    {
                        $set: { "SelectedScripts.$.scriptStatus": scriptStatus,
                        "SelectedScripts.$.executionType": "Automated"
                    }
                    },function (err, doc) {
                        console.log("Updated ScriptStatus")
                    })
                    if (index == Array.length - 1) {

                        var executedRunCount;
                        db.countInc.find({
                            "projectID": "pID"

                        },
                            function (err, doc) {
                                executedRunCount = doc[0].runCount;
                                var stringRunCount = projectRunCount.toString();
                               
                                if (data1[0].exceptionOption == true) {
                                    var projectName = data1[0].projectName
                                    var requirementId = data1[0].requirementId;
                                    var requirementName = data1[0].requirementName;
                                    if (data1[0].type == 'execution') {
                                        db.reports.update({ "Run": stringRunCount },
                                            {
                                                $push: {
                                                    "manual": {
                                                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                        "suiteName": suiteName, 'projectName': projectName, 'requirementName':requirementName, 'requirementId':requirementId
                                                    }
                                                },
                                                $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName }
                                            }, function (err, doc) {
                                                if (err) console.log(err)
                                                console.log("update the report");

                                            })
                                    }
                                  else  if (data1[0].type == 'jenkins') {
                                        db.reports.update({ "Run": stringRunCount },
                                            {
                                                $push: {
                                                    "manual": {
                                                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                        "suiteName": suiteName, 'projectName': projectName
                                                    }
                                                },
                                                $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName }
                                            }, function (err, doc) {
                                                if (err) console.log(err)
                                                console.log("update the report");

                                            })
                                    }
                                    else {
                                        console.log("for schedule insertion")
                                        // console.log(data1);
                                        var projectName = data1[0].projectName;
                                        var requirementIdd = data1[0].allScripts;
                                    var requirementNamee = data1[0].allScripts;
                                    requirementIde = requirementIdd[0].requirementId
                                    requirementNamer = requirementNamee[0].requirementName
                                        console.log(projectName);
                                        db.reports.update({ "Run": stringRunCount },
                                            {
                                                $push: {
                                                    "manual": {
                                                        'scheduleName': data1[0].scheduleName,
                                                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                        "suiteName": suiteName, "projectName": projectName,'requirementName':requirementName, 'requirementId':requirementId
                                                    }
                                                },
                                                $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName },
                                            }, function (err, doc) {
                                                if (err) console.log(err);
                                                console.log("updated the collection");
                                                // console.log(doc);
                                            });

                                    }

                                } else {
                                    var projectName = data1[0].projectName;
                                    
                                    if (data1[0].type == 'execution') {
                                        var requirementId = data1[0].requirementId;
                                    var requirementName = data1[0].requirementName;
                                        var summaryReportNum = stringRunCount + "_" + 'Summary';
                                        db.reports.update({ "Run": stringRunCount },
                                            {
                                                $push: {
                                                    "summary": {
                                                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                        "suiteName": suiteName, 'projectName': projectName, "summaryReportNum": summaryReportNum, 'requirementName':requirementName, 'requirementId':requirementId
                                                    }
                                                },
                                                $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": false, 'projectName': projectName }
                                            }, function (err, doc) {
                                                if (err) console.log(err)
                                                console.log("update the report");

                                            })
                                        // summaryReport(reportsDetails,callback);
                                    } else {
                                        var summaryReportNum = stringRunCount + "_" + 'Summary';
                                        var requirementIdd = data1[0].allScripts;
                                    var requirementNamee = data1[0].allScripts;
                                    requirementIde = requirementIdd[0].requirementId
                                    requirementNamer = requirementNamee[0].requirementName
                                    console.log('SSSSSSSSSSSSSSSSSSSSSDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDAAAAAAAAAAAAAAAAAAAAAAAAAAA')
                                    console.log(requirementIde)
                                    console.log(requirementNamer)
                                        db.reports.update({ "Run": stringRunCount },
                                            {
                                                $push: {
                                                    "summary": {
                                                        'scheduleName': data1[0].scheduleName,
                                                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                        "suiteName": suiteName, "summaryReportNum": summaryReportNum, "projectName": projectName,'requirementName':requirementNamer, 'requirementId':requirementIde
                                                    }
                                                },
                                                $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": false, 'projectName': projectName },
                                            }, function (err, doc) {
                                                if (err) console.log(err);
                                                console.log("updated the collection");
                                                //console.log(doc);
                                            });

                                    }
                                }

                                db.countInc.findAndModify({
                                    query: { "projectID": "pID" },
                                    update: { $inc: { "runCount": 0 } },
                                    new: true
                                }, function (err, doc) {

                                    // res.json([{ 'status': executedRunCount }])
                                    var miniResult = {
                                        'status': "Pass",
                                        "reportNumber": projectRunCount.toString()
                                    };
                                    resolve(miniResult);
                                });

                            });

                    }//if

                }) //for each of test-method


            }//else

        } //end of single script
        else {
            console.log("for multiple scripts in the suite");

            var executedRunCount;
            testLevel.forEach(function (e, index, Array) {
                scriptStartedAt = e["started-at"];
                scriptEndedAt = e["finished-at"];
                scriptDuration = e["duration-ms"];
                var filename = e.class.name;
                var a = filename.split('.');
                var moduleName = a[0];
                var featureName = a[1];
                var scriptName = a[2];
                var scriptStatus;
                var executedRunCount;
                var testMethod = e.class['test-method'];
                var requirementId
                var requirementName
                testMethod = checkFailStep(testMethod)
                data1.forEach(function (r){
                    
                    if(r.moduleName == moduleName && r.fetaureName == featureName && r.scriptName == scriptName){
                        console.log("RRRRRRRRRRRRRREEEEEEEEEEEEEEEEEESSSSSSSSSSSSSSSSSTTTTTTTTTT") 
                        console.log(r.moduleName)
                        console.log(moduleName)
                        console.log(r.fetaureName)
                        console.log(featureName)
                        
                        requirementId = r.requirementId
                         requirementName = r.requirementName
                         console.log(requirementId)
                        console.log(requirementName)
                    }
                
                })
                testMethod.forEach(function (step) {
                    
                    let adults = testMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');
                    // console.log("some steps are failed")
                    // console.log(adults)
                    if (adults.length == 0) {
                        scriptStatus = "Pass";
                        console.log("no status failed")
                    } else {
                        scriptStatus = 'Fail';
                        console.log("some are failed");
                    }
                    db.testsuite.update({
                        "PID" : data1[0].prid,
                        "testsuitename" : suiteName,
                        "SelectedScripts.scriptName" : scriptName
    
                    },
                    {
                        $set: { "SelectedScripts.$.scriptStatus": scriptStatus,
                        "SelectedScripts.$.executionType": "Automated"
                    }
                    },function (err, doc) {
                        console.log("Updated ScriptStatus")
                    })

                }) //for each of test-method
                db.countInc.find({
                    "projectID": "pID"

                },
                    function (err, doc) {

                        executedRunCount = doc[0].runCount;
                        var stringRunCount = projectRunCount.toString();
                        console.log("string run number " + stringRunCount);
                        if (data1[0].exceptionOption == true) {
                            var projectName = data1[0].projectName
                            if (data1[0].type === 'execution') {
                                db.reports.update({ "Run": stringRunCount },
                                    {
                                        $push: {
                                            "manual": {
                                                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": testMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                "suiteName": suiteName, "projectName": projectName, 'requirementName':requirementName, 'requirementId':requirementId
                                            }
                                        },
                                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName },
                                    }, function (err, doc) {
                                        if (err) console.log(err);
                                        console.log("updated the collection");
                                    });
                            }
                           else if (data1[0].type == 'jenkins') {
                                db.reports.update({ "Run": stringRunCount },
                                    {
                                        $push: {
                                            "manual": {
                                                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                "suiteName": suiteName, 'projectName': projectName
                                            }
                                        },
                                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName }
                                    }, function (err, doc) {
                                        if (err) console.log(err)
                                        console.log("update the report");

                                    })
                            }
                            else {
                                console.log("when execution is scheduled and exception option is true 6666666666666666666666666666666666666666666666666")
                                db.reports.update({ "Run": stringRunCount },
                                    {
                                        $push: {
                                            "manual": {
                                                'scheduleName': data1[0].scheduleName,
                                                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": testMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                "suiteName": suiteName, "projectName": projectName
                                            }
                                        },
                                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName },
                                    }, function (err, doc) {
                                        if (err) console.log(err);
                                        console.log("updated the collection");
                                        // console.log(doc);
                                    });

                            }
                        }//if exception is selected
                        else {
                            var projectName = data1[0].projectName;
                            if (data1[0].type === 'execution') {

                                var summaryReportNum = stringRunCount + "_" + 'Summary';
                                db.reports.update({ "Run": stringRunCount },
                                    {
                                        $push: {
                                            "summary": {
                                                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": testMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                "suiteName": suiteName, 'summaryReportNum': summaryReportNum, "projectName": projectName, 'requirementName':requirementName, 'requirementId':requirementId
                                            }
                                        },
                                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": false, 'projectName': projectName },
                                    }, function (err, doc) {
                                        if (err) console.log(err);
                                        console.log("updated the collection");
                                        // console.log(doc);
                                    });
                            } else {
                                var summaryReportNum = stringRunCount + "_" + 'Summary';
                                db.reports.update({ "Run": stringRunCount },
                                    {
                                        $push: {
                                            "summary": {
                                                'scheduleName': data1[0].scheduleName,
                                                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": testMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                                                "suiteName": suiteName, 'summaryReportNum': summaryReportNum, "projectName": projectName
                                            }
                                        },
                                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": false, 'projectName': projectName },
                                    }, function (err, doc) {
                                        if (err) console.log(err);
                                        console.log("updated the collection");
                                        // console.log(doc);
                                    });
                            }
                        }

                        if (index == Array.length - 1) {

                            console.log(" update report ");
                            db.countInc.findAndModify({
                                query: { "projectID": "pID" },
                                update: { $inc: { "runCount": 0 } },
                                new: true
                            }, function (err, docs) {
                                var miniResult = {
                                    'status': "Pass",
                                    "reportNumber": projectRunCount.toString()
                                };
                                // result = miniResult;
                                // console.log(miniResult)
                                var end = new Date() - start;
                                // hrend = process.hrtime(hrstart)
                                console.info('reportGenearation() for Execution time: %dms', end)
                                // callback(result)
                                resolve(miniResult);
                            })

                        }//if

                    });

            }) //for each for testLevel

        }//else
    })
    if (data1[0].type == 'execution') {
        trackingService.removeData(projectRunCount, data1[0].prid);

    }
    if (data1[0].type == 'schedule') {
        console.log('RRRRRRRRRRRAAAAAAAAAAAAAAAAAA')
        console.log(projectRunCount)
        console.log(data1[0].projectId)
        trackingService.removeData(projectRunCount, data1[0].projectId);

    }
}) //End of reportGeneration()



function checkFailStep(step) {
    var flag = true;
    return step.map(changeToNotExecuted)
    function changeToNotExecuted(steps) {
        if (flag) {
            if (steps.status == "FAIL") {
                flag = false;
            }
            return steps;
        } else {
            steps['status'] = 'Not Executed';
            return steps;
        }
    }
}
var copyResult;
var createDuplicate = (data) => new Promise((resolve, reject) => {
    console.log("my" + data)
    console.log("hello" + data)
    //if execution is exception handling creating creating suite_1 folder 
    console.log("in create duplicate function")
    var destination1
    data.forEach(function (e) {
        if (e.type == 'exception') {
            destination1 = '../uploads/opal/' + e.projectName + "/suites/" + "exceptionHandler" + e.mainRunNumber;
        }
        else if (e.type == 'schedule') {
            destination1 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Scheduler";
        }
        else if (e.type == 'jenkins') {
            console.log("finding")
            destination1 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Jenkins";
        }
        else {
            console.log("schedulerException handling");
            destination1 = '../uploads/opal/' + data[0].projectName + "/suites/Scheduler/" + "schedulerExceptionHandler";
        }
    })
    console.log(destination1);
    var finaldestination1 = path.join(__dirname, destination1)
    var fs = require('fs');
    if (!fs.existsSync(finaldestination1)) {
        console.log("trying for folder creation");
        fs.mkdirSync(finaldestination1);
        resolve("created folder")
    }//creating exceptionHandler folder
    else {
        console.log("exceptionHandler folder already exists");
        resolve("created folder")
    }//if exception folder already exists

})//end of create duplicate

//for creating the suite folder
var createSuiteFolder = (data) => new Promise((resolve, reject) => {
    var destination2
    data.forEach(function (e) {
        if (data[0].type == 'exception') {
            destination2 = '../uploads/opal/' + e.projectName + "/suites/" + "exceptionHandler" + e.mainRunNumber + "/" + e.createdCopySuite;
            e['createdCopySuite'] = e.suiteName + "_1";
        }
        else if (data[0].type == "schedule") {

            destination2 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Scheduler/" + data[0].scheduleName;


        }
        else if (data[0].type == "jenkins") {
            console.log("KANTHI22222222222222222222")
            console.log(data[0].testsuitename)
            console.log(data[0].testSuite)

            destination2 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Jenkins/" + data[0].testSuite;


        }
        else {
            destination2 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Scheduler/schedulerExceptionHandler/" + data[0].createdCopySchedule;
        }
    })
    var finaldestination2 = path.join(__dirname, destination2);
    if (!fs.existsSync(finaldestination2)) {
        // fs.mkdirSync(finaldestination2)
        console.log("trying to create a copysuite folder ");
        fs.mkdirSync(finaldestination2)
        resolve("suite folder created")
    }//creating copy suite
    else {
        console.log("suite folder already exists");
        resolve("suite folder created")
    }//if copy suite already exists;

})//end of suite folder

//function to copy the source to destination
// var copySuite=(data)=>new Promise((resolve,reject)=>{
//     console.log("for copy call");
//     var finalSourcePath;
//     var sourcePath;
//     var destination2;
//     data.forEach(function (e) {

//         if (data[0].type == 'exception') {
//             sourcePath = '../uploads/opal/' + e.projectName + "/suites/" + e.suiteName;
//             destination2 = '../uploads/opal/' + e.projectName + "/suites/" + "exceptionHandler/" + e.createdCopySuite;
//         }
//         else if (data[0].type == "schedule") {
//             sourcePath = '../uploads/opal/' + data[0].projectName + "/suites/" + data[0].testSuite;
//             destination2 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Scheduler/" + data[0].scheduleName;
//         }
//         else {
//             sourcePath = '../uploads/opal/' + data[0].projectName + "/suites/Scheduler/" + data[0].suiteName;
//             destination2 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Scheduler/schedulerExceptionHandler/" + data[0].createdCopySchedule;
//         }
//     })
//     finalSourcePath = path.join(__dirname, sourcePath);
//     var finaldestination2 = path.join(__dirname, destination2);
//     var fsCopy = require("fs-extra");
//     console.log("finalSourcePath finalSourcePath")
//     console.log(finalSourcePath);
//     console.log("finaldestination2 finaldestination2 finaldestination2")
//     console.log(finaldestination2)
//     fsCopy.copy(finalSourcePath, finaldestination2)
//         .then(() => {
//             console.log('Copy completed!');
//             copyResult = true;
//             resolve(copyResult)
//         })
//         .catch(err => {
//             console.log('An error occured while copying the folder.')
//             copyResult = true;
//             resolve(copyResult)
//         })
// })//end of copy folder

//new copysuite code below
var copySuite = (data) => new Promise((resolve, reject) => {
    //copying suite to suite_1 folder in exception handler
    var finalSourcePath;
    var sourcePath;
    var destination2;
    data.forEach(function (e) {

        if (data[0].type == 'exception') {
            sourcePath = '../uploads/opal/' + e.projectName + "/suites/" + e.suiteName;
            destination2 = '../uploads/opal/' + e.projectName + "/suites/" + "exceptionHandler" + e.mainRunNumber + "/" + e.createdCopySuite + '/';
        }
        else if (data[0].type == "schedule") {
            sourcePath = '../uploads/opal/' + data[0].projectName + "/suites/" + data[0].testSuite;
            destination2 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Scheduler/" + data[0].scheduleName + '/';
        }
        else if (data[0].type == "jenkins") {
            console.log("copying")
            sourcePath = '../uploads/opal/' + data[0].projectName + "/suites/" + data[0].testSuite;
            destination2 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Jenkins/" + data[0].testSuite + '/';
        }
        else {
            sourcePath = '../uploads/opal/' + data[0].projectName + "/suites/Scheduler/" + data[0].suiteName;
            destination2 = '../uploads/opal/' + data[0].projectName + "/suites/" + "Scheduler/schedulerExceptionHandler/" + data[0].createdCopySchedule + '/';
        }
    })
    finalSourcePath = path.join(__dirname, sourcePath);
    var finaldestination2 = path.join(__dirname, destination2);
    var fsCopy = require("fs-extra");
    var fs = require("fs");
    var screenPath = finalSourcePath + "/Screenshot";
    var videoPath = finalSourcePath + "/Videos";
    var target = finalSourcePath + "/target";
    var screen1 = finaldestination2 + "/Screenshot/EachStepScreenshot";
    var screen2 = finaldestination2 + "/Screenshot/FailedScreenshot";
    var deleteTestng = finaldestination2 + "testng.xml";
    var myCheck;
    fs.readdir(finalSourcePath, function (err, files) {
        if (err) console.log(err);
        files.forEach(function (f, findex, flength) {
            //  console.log(findex,flength)
            var requiredPath = finalSourcePath + "/" + files[findex];

            if (screenPath == requiredPath || videoPath == requiredPath || target == requiredPath || deleteTestng == requiredPath) {
                if (screenPath == requiredPath) {
                    // console.log(requiredPath)
                    if (fs.existsSync(finaldestination2 + "Screenshot")) {
                        //    console.log("elloo"); 
                    } else {
                        // console.log("aaaaa");
                        fs.mkdirSync(finaldestination2 + "Screenshot")
                        fs.mkdirSync(screen1);
                        fs.mkdirSync(screen2);
                    }
                }
                if (videoPath == requiredPath) {
                    if (fs.existsSync(finaldestination2 + "Videos")) {

                    } else {
                        fs.mkdirSync(finaldestination2 + "Videos");
                    }
                }
            } else {
                // console.log("get heree it is matching or not")
                myCheck = fs.lstatSync(finalSourcePath + "/" + files[findex]).isDirectory()
                // console.log("777777777777777777777777777777")
                // console.log(myCheck)
                if (fs.existsSync(finaldestination2 + "/" + files[findex])) {

                    fsCopy.copy(requiredPath, finaldestination2 + files[findex])
                        .then(() => {

                        })
                        .catch(err => {
                            copyResult = true;
                            resolve(copyResult)
                        })
                    if (findex == flength.length - 1) {
                        console.log("folders are present");
                        console.log("you can call you function here at last");
                        copyResult = true;
                        resolve(copyResult)
                    }

                } else {
                    //   console.log("11111111111111111111111111")
                    //   console.log(myCheck)
                    if (myCheck == true) {
                        fs.mkdirSync(finaldestination2 + "/" + files[findex])
                        if (fs.existsSync(finaldestination2 + "/" + files[findex])) {

                            fsCopy.copy(requiredPath, finaldestination2 + files[findex])
                                .then(() => {

                                })
                                .catch(err => {
                                    copyResult = true;
                                    resolve(copyResult)
                                })
                            if (findex == flength.length - 1) {
                                console.log("you can call you function here at last");
                                copyResult = true;
                                resolve(copyResult)
                            }
                        } else {
                            console.log("unable to copy the folder");
                        }
                    }//checking path
                    else {
                        console.log("direct files")
                        // console.log(requiredPath)
                        var content = fs.readFileSync(requiredPath, 'utf8')
                        // console.log(content);
                        fs.writeFile(finaldestination2 + "/" + files[findex], content, function (err, doc) {
                            if (err) console.log(err);
                            console.log("created");
                        })
                    }
                }

            }

        })
    })

})//end of copy folder


// var reportsDetails = {
//     "reportNum": '302',
//     'executionOption': false
// }
// summaryReport(reportsDetails,function(){

// })
// function for creating the summary report
function summaryReport(details, callback) {
    console.log("for creating the summary report");
    var summary = [];
    var completeManual = [];
    var completeException = [];
    var totalexceptionCount;
    var summaryReportNum;
    var executionStatus = [];
    var detailsOfReports = details;
    db.reports.find({ "Run": details.reportNum }, function (err, doc) {
        completeManual = doc[0].manual;
        completeException = doc[0].exception;
        totalexceptionCount = doc[0].totalExceptionHandling;
        if (details.executionOption == true) {
            var onlyPassed = completeManual.filter(scripts => scripts.scriptStatus == 'Pass')
            onlyPassed.forEach(function (e) {
                summary.push(e)
            })

            for (let i = 1; i <= totalexceptionCount; i++) {
                var exceptionRun = details.reportNum + '_' + i;
                summaryReportNum = details.reportNum + '_' + 'Summary';
                if (i == totalexceptionCount) {

                    var firstException = completeException.filter(scripts => scripts.exceptionRunCount == exceptionRun)

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
        }//if condition
        else {
            // var exceptionRun = details.reportNum+'_'+i;
            summaryReportNum = details.reportNum + '_' + 'Summary';
            var onlyPassed = completeManual.filter(scripts => scripts.scriptStatus == 'Pass' || scripts.scriptStatus == "Fail")
            onlyPassed.forEach(function (e) {
                summary.push(e)
            })
        }
        executionStatus['status'] = true;
        executionStatus['runNo'] = details.reportNum;
        summary.forEach(function (e) {
            e['summaryReportNum'] = summaryReportNum;
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
                // console.log(doc1);
                callback(executionStatus)
            })

        //    console.log(summary);
    })
}
// end of summary report



module.exports = {

    getAvailableMachines: getAvailableMachines,
    getRunCount: getRunCount,
    suiteCreation: suiteCreation,
    getIpAddress: getIpAddress,
    mvnBatchCreation: mvnBatchCreation,
    updateDockerStatus: updateDockerStatus,
    updateScriptConfig: updateScriptConfig,
    mvnExecution: mvnExecution,
    checkTestngReport: checkTestngReport,
    convertXmlToJson: convertXmlToJson,
    reportGeneration: reportGeneration,
    createDuplicate: createDuplicate,
    copySuite: copySuite,
    createSuiteFolder: createSuiteFolder,
    summaryReport: summaryReport
}