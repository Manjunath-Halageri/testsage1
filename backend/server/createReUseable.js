module.exports = function (app) {
    var bodyParser = require("body-parser");
    var fs = require('fs');
    var path = require("path");
    var LineByLineReader = require('line-by-line');
    var db = require('../dbDeclarations').url;
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


    app.get('/getact', function (req, res) {
        db.Actions.find(function (err, doc) {
            res.json(doc);

        })
    })

    app.get('/getObjectName', function (req, res) {
        db.objectRepository.find(function (err, doc) {
            res.json(doc);
        })
    })


    app.get('/getbrowsePath:actbrowser', function (req, res) {
        var nameAct = req.params.actbrowser
        db.Actions.find({ "actions": nameAct }, function (err, doc) {
            res.json(doc);
        })
    })

    app.post('/Saveparameters', function (req, res) {
        db.Reuseable.insert(req.body, function (err, doc) {
            res.json(doc);
        });
        searchReusable(req.body);
    })

    function searchReusable(data) {
        var tempPath = "../autoScript/testNgTemplate/Reuseable.java";
        var completePath = path.join(__dirname, tempPath);
        templateExcecuteReusable(data, completePath)
    }




    function templateExcecuteReusable(data, testPath) {
        var projectName = data.projectName;
        var scriptClass = data.reuseableClass;
        var templatePath = testPath;
        console.log(data.class);

        db.projectSelection.find({ "projectSelection": projectName }, function (err, doc) {
            console.log(doc[0].projectId);
            var projectId = doc[0].projectId;
            var tempPath = "../uploads/opal/" + projectName + "/src/main/java/reuseablePackage/feature/" + scriptClass + ".java";
            var scriptPath = path.join(__dirname, tempPath);
            console.log(scriptPath)
            fs.createWriteStream(scriptPath);
            lr = new LineByLineReader(templatePath);
            lr.on('error', function (err) {
            });
            var fName = "fileName"
            lr.on('line', function (line) {
                var inObj = data.reuseableParams;
                var inobj1 = inObj.split(",");
                var inxpath = inobj1[0];
                var ininput = inobj1[1];

                if (line.includes("className")) {
                    // fs.appendFileSync(scriptPath,"\n"+"public class "+ scriptClass+"{",'utf8');
                    console.log(line)
                    var oldLine = line;
                    var changeString = "className"
                    // var scriptClass="RESEND"
                    var NewLine = oldLine.replace(changeString, data.reuseableClass);
                    console.log(NewLine)
                    fs.appendFileSync(scriptPath, NewLine);

                }

                else if (line.includes("methodName")) {
                    console.log(line)
                    var oldLine = line;
                    var changeString = "methodName"
                    // var scriptClass="RESEND"
                    var NewLine = oldLine.replace(changeString, data.reuseableMethod)

                    console.log(NewLine)
                    var NewLine = oldLine.replace(changeString, data.reuseableMethod)
                    var changeString1 = "Object"
                    var NewLine1 = NewLine.replace(changeString1, inxpath)
                    var changeString2 = "input"
                    var NewLine2 = NewLine1.replace(changeString2, ininput)
                    console.log(NewLine2)
                    fs.appendFileSync(scriptPath, NewLine2);
                }
                else if (line.includes("Start")) {
                    var inObj = data.reuseableParams;
                    console.log(data.reuseableParams + "data.reuseableParamsdata.reuseableParams")
                    var inobj1 = inObj.split(",");

                    console.log(inobj1.length + "   len");
                    console.log(data.modalData);
                    console.log(data.modalData[0].action);
                    fs.appendFileSync(scriptPath, "\n" + "public void " + data.reuseableMethod + "(", 'utf8');
                    for (i = 0; i < inobj1.length; i++) {
                        console.log(inobj1[i].split(" ")[inobj1[i].split(" ").length - 1])
                        //string a
                        //int b
                        if (i != inobj1.length - 1) {
                            fs.appendFileSync(scriptPath, inobj1[i] + ",");
                        }

                        else if (i == inobj1.length - 1) {
                            if (data.modalData[0].action == "launchBrowser") {
                                fs.appendFileSync(scriptPath, inobj1[i] + ") throws MalformedURLException {");
                            }
                            else {
                                fs.appendFileSync(scriptPath, inobj1[i] + "){");
                            }




                            data.modalData.forEach((l) => {
                                if (l.excel == "excel") {
                                    console.log("insideee Excellllllll")
                                    var arr09 = l.input.split(',');
                                    var excelFilePath = "C:/Users/Opal/Desktop/svn/workingCode/excel/" + arr09[0];
                                    var sheetNum = arr09[1];
                                    var rowNum = arr09[2];
                                    var cellNum = arr09[3];
                                    if (l.object == undefined || l.object == '') {
                                        fs.appendFileSync(scriptPath, "\n" + "actionObject." + l.testNgKey + "(" + "actionObject.getData(\"" + excelFilePath + "\",\"" + sheetNum + "\"," + rowNum + "," + cellNum + "));", 'utf8');
                                    }
                                    else {
                                        // var testNgFunctionName = "actionObject."+l.testNgKey+"(\""+l.object+"\","+"actionObject.getData(\""+excelFilePath+"\",\""+sheetNum+"\","+rowNum+","+cellNum+");";
                                        fs.appendFileSync(scriptPath, "\n" + "actionObject." + l.testNgKey + "(\"" + l.objectValue + "\"," + "actionObject.getData(\"" + excelFilePath + "\",\"" + sheetNum + "\"," + rowNum + "," + cellNum + "));", 'utf8');
                                    }
                                }
                                else {

                                    var conditionCheck = false;
                                    for (i = 0; i < inobj1.length; i++) {
                                        if (conditionCheck == false && l.input != inobj1[i].split(" ")[inobj1[i].split(" ").length - 1] && i === inobj1.length - 1) {
                                            console.log("only one parametrrrrrrrrrrrrrifffffffffffff")
                                            var testNgFunctionName = "actionObject." + l.testNgKey + "(\"" + l.objectValue + "\",\"" + l.input + "\");";
                                            fs.appendFileSync(scriptPath, "\n" + testNgFunctionName, 'utf8');

                                        } else if (l.input === inobj1[i].split(" ")[inobj1[i].split(" ").length - 1]) {
                                            console.log("only one parametrrrrrrrrrrrrrelseeeeeeeeeeee")
                                            conditionCheck = true;
                                            //yashwanth
                                            if (l.object == undefined || l.object == null || l.object == '' || l.object == "Not Assigned Object") {
                                                console.log("inside iffffff")
                                                var testNgFunctionName = "actionObject." + l.testNgKey + "(" + l.input + ");";
                                                fs.appendFileSync(scriptPath, "\n" + testNgFunctionName, 'utf8');
                                            }
                                            else {
                                                console.log("inside elseeeeeeee")
                                                var testNgFunctionName = "actionObject." + l.testNgKey + "(\"" + l.objectValue + "\"," + l.input + ");";
                                                fs.appendFileSync(scriptPath, "\n" + testNgFunctionName, 'utf8');
                                            }


                                        }

                                    }
                                }

                            })
                        }
                    }
                }
                else {
                    fs.appendFileSync(scriptPath, "\n" + line, 'utf8');
                }

            });

            lr.on('end', function () {

                db.Function.insert({ "className": data.reuseableClass, "MethodName": data.reuseableMethod, "ProjectName": projectName, "projectId": projectId })

            });

        });

    }////////////templateExcecuteReusable///////////
    app.get('/getExcelFile', function (req, res) {

        console.log(" vijay checking ", req.query.projectName)
        var excelFile = [];
        const Filehound = require('filehound');
        Filehound.create()
            .ext('xlsx')
            .paths(`./uploads/opal/${req.query.projectName}/MainProject/Excel/`)
            .find((err, file) => {
                if (err) return console.error("handle err", err);
                file.forEach((n, i) => {
                    var excelObj = {};
                    excelObj['label'] = path.basename(n).split('.')[0]
                    excelFile.push(excelObj)
                    var p = path.basename(n);
                    if (file.length - 1 == i) {
                        res.json(excelFile)
                    }
                })
            })
    })


    function search() {
        const Filehound = require('filehound');
        Filehound.create()
            .ext('xlsx')
            .paths("./excel")
            .find((err, file) => {
                // res.json(file)
                var excelFile = [];
                console.log(file)
                if (err) return console.error("handle err", err);
                file.forEach((n, i) => {
                    excelFile.push(path.basename(n, '.xlsx'))
                    var p = path.basename(n);
                    console.log(excelFile)
                    console.log(i)
                    if (file.length - 1 == i) {
                        console.log(excelFile)
                        // res.json(excelFile)
                    }
                })
            })
    }
    // search();



}
