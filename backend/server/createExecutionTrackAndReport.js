
var mongojs = require('mongojs');
var db = require('../dbDeclarations').url;
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require("path");
var cmd = require('child_process');
const vncPortService = require('./services/vncPortService');

let exceptionInfoFromDB = null;

db.exceptionInfo.find({}, function (err, doc) {//exceptionInfo collection contains exception and its english like statements.
    exceptionInfoFromDB = doc;
})


function deletePreviousXmlFile(req, res) {
    let filePath = path.join(__dirname, `../uploads/opal/${req.params.proName}/target/surefire-reports/testng-results.xml`);
    try {
        fs.unlinkSync(filePath);//Deleting Previous xml file 
        res.json({ 'status': 'pass' });
        //file removed
    } catch (err) {
        console.error(err)
        res.json({ 'status': 'pass' });
    }

}

function checkNewlyCreatedXmlExixts(req, res) {
    let filePath = path.join(__dirname, `../uploads/opal/${req.params.proName}/target/surefire-reports/testng-results.xml`);
    if (fs.existsSync(filePath)) {
        res.json({ 'status': 'pass' });
    } else {
        res.json({ 'status': 'fail' });
    }

}

function convertXmlToJson(req, res) {
    console.log("Finallyyyyyyyyyyy")
    console.log(req.query)
    let userId=req.query.userId;
    let licenseId=req.query.licenseId;
    let obj = {
        "userId":userId,
        "licenseId":licenseId
        
    }
    var file = __dirname + "\\Batch\\xmlToJson.bat";
    var projectPath = path.join(__dirname, `../uploads/opal/${req.query.projectName}`);
    var checkReportJson = path.join(__dirname, `../uploads/opal/${req.query.projectName}/target/surefire-reports/Report.json`);
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
        cmd.exec(__dirname + "/Batch/xmlToJson.bat", (error, stdout, stderr) => {
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
    releasePort(obj);// caling relaese function BY ANIL
}

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




function extractInfoFromJson(req, res) {
    var ReportJson = path.join(__dirname, `../uploads/opal/${req.params.proName}/target/surefire-reports/Report.json`);
    fs.readFile(ReportJson, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
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
//release function called here by ANIL
async function releasePort(obj) {
    console.log("###############Inside release Port function##########################")
    console.log(obj.userId,obj.licenseId)
    let releaseUserPort = await vncPortService.releaseAssignedPort(obj)
    console.log("Releasing PORT :",releaseUserPort.port)
    let enablePort= await vncPortService.enablePort(obj,releaseUserPort)
}


module.exports = {
    deletePreviousXmlFile: deletePreviousXmlFile,
    checkNewlyCreatedXmlExixts: checkNewlyCreatedXmlExixts,
    convertXmlToJson: convertXmlToJson,
    extractInfoFromJson: extractInfoFromJson
}