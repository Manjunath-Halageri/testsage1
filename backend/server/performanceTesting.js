module.exports = function (app) {
    var mongojs = require('mongojs');
    var bodyParser = require("body-parser");
    var multer = require('multer');
    const exec = require('child_process');
    var cmd = require('child_process');
    var fs = require('fs');
    var path = require("path");
    var LineReader = require('line-by-line');
    var db = require('../dbDeclarations').url;
    var async = require("async");
    var Promise = require('bluebird')
    const { clearInterval } = require('timers');
    var request = require('request');

    const treeStructureCall = require('./services/treeStructureData');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


    var storage = multer.diskStorage({

        filename: function (req, file, cb) {
            cb(null, file.originalname);
            // console.log("file.originalnamfile.originalnamefile.originalname", file.originalname)
            // console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", file.fieldname)
            console.log(JSON.stringify(req.body, null, 3));



        },
        destination: async function (req, file, cb) {
            // console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", file.fieldname)
            var dir = path.join(__dirname, '../uploads/opal/jmeterFiles/');
            var finalPathname = path.join(dir, file.fieldname);
            var testcaseDir = await makedirectory(finalPathname)
            await actualDirectory(testcaseDir, cb)
            await trailDirectory(testcaseDir, file)
        }

    });

    function makedirectory(testcaseDir) {
        return new Promise((resolve, reject) => {
            fs.mkdir(testcaseDir, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    resolve(testcaseDir)
                }
            })


        })

    }
    function actualDirectory(testcaseDir, cb) {
        return new Promise((resolve, reject) => {
            var acutalPath = testcaseDir + '\\' + 'actual' + '\\';

            fs.mkdir(acutalPath, (err) => {
                if (err) {
                    return console.error(err);
                }
                cb(null, acutalPath);
                resolve("uploded")
            });

        })

    }
    function trailDirectory(testcaseDir, file) {
        return new Promise((resolve, reject) => {
            var dirtrailPath = testcaseDir + '\\' + 'trail'
            var acutalPath = testcaseDir + '\\' + 'actual' + '\\' + file.originalname;
            var trailPath = testcaseDir + '\\' + 'trail' + '\\' + file.originalname
            fs.mkdir(dirtrailPath, (err) => {
                fs.copyFile(acutalPath, trailPath, (err) => {
                    if (err) throw err;
                    console.log('source.txt was copied to destination.txt');
                    resolve("copied")
                });
            });

        })

    }

    var upload = multer(
        {
            limits: {
                fieldNameSize: 100,
                fileSize: 60000000
            },
            storage: storage

        });

    app.post("/saveFile", upload.any(), function (req, res) {
        res.send(req.files);
    });


    app.get('/checkingDuplicateTestcase:testcaseName', async (req, res) => {
        let moduleDupicateCheck = await treeStructureCall.getJmeterName(req.params.testcaseName)
        if (moduleDupicateCheck == null) {
            res.json([{ duplicate: false }])

        } else {
            console.log(" duplicate jmeterTestcase ");
            res.json([{ duplicate: true }]);

        }
    })

    app.get("/getTrailTestcase:trailTestcase", (req, res) => {
        console.log("tessssssssssssssssssssssssssssssssss", req.params.trailTestcase)
        db.performanceTest.find({ "projectId": req.params.trailTestcase },
            function (err, doc) {
                if (err) {
                    throw err;
                }
                else {
                    res.json(doc)
                }
            })

    })


    ///////////////////////////////trailTecaseEditFileData///////////////////////////////////////

    app.get('/editTrailTestcaseFile:fileName', async (req, res) => {
        var fileNamesData = req.params.fileName;
        var f = fileNamesData.split(',')
        var finalResult = await ForLoops(f)
        res.json(finalResult)

    })
    async function ForLoops(f) {
        var for1Data = await firstForLoopCall(f)
        console.log("firstForLoopCall", for1Data)
        var for2Data = await secondForCall(for1Data)
        console.log("secondForCall", for2Data)
        var for3Data = await thirdForCall(for2Data)
        console.log("thirdForCall", for3Data)
        return for3Data
    }
    function firstForLoopCall(f) {
        return new Promise((resolve, reject) => {
            console.log(f)
            x = []
            for (var i = 0; i < f.length; i++) {
                var z = f[i].split('+')
                var testcaseName = z[0]
                var fileName = z[1]
                var obj = {
                    "testcase": testcaseName,
                    "fileName": fileName
                }
                x.push(obj)
            }
            resolve(x);

        })
    }
    function secondForCall(x) {
        return new Promise((resolve, reject) => {
            console.log("ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc", x)
            y = []
            for (var i = 0; i < x.length; i++) {
                console.log(x[i].testcase)
                var finalPath = path.join(__dirname, '../uploads/opal/jmeterFiles/');
                var finalPathname = path.join(finalPath, x[i].testcase);
                var finalPathData = finalPathname + '\\' + "trail" + "\\" + x[i].fileName;
                console.log("finalPathDatafinalPathDatafinalPathDatafinalPathData", finalPathData)
                y.push(finalPathData)

            }
            console.log("secondForCallsecondForCallsecondForCallsecondForCall", x)
            resolve(y);

        })
    }
    async function thirdForCall(allpaths) {
        responseData = []
        var res;
        for (var i = 0; i < allpaths.length; i++) {
            res = await readingFileData(allpaths[i])
            responseData.push(res)
        }
        return responseData;

    }

    function readingFileData(eachFilePath) {
        return new Promise((resolve, reject) => {
            var responseArray = {};
            lr = new LineReader(eachFilePath);
            lr.on('error', function (err) {
                console.log("error in reading the file");
            });
            lr.on('line', function (line) {

                if (line.includes('LoopController.loops')) {
                    Iteration = line.split('>')[1].split('</stringProp')[0];
                }
                if (line.includes('ThreadGroup.num_threads')) {
                    users = line.split('>')[1].split('</stringProp')[0];
                    responseArray = {
                        "users": users,
                        "iteration": Iteration
                    }
                }
            })
            lr.on('end', function () {

                resolve(responseArray)
            })

        })
    }
    ///////////////////////////////////////End of reading file////////////////////////////////////


    ///////////////////////////////ActialTecaseEditFileData///////////////////////////////////////

    app.get('/editActualTestcaseFile:fileName', async (req, res) => {
        var fileNamesData = req.params.fileName;
        var f = fileNamesData.split(',')
        var actualfinalResult = await actualForLoops(f)
        res.json(actualfinalResult)

    })
    async function actualForLoops(f) {
        var actualfor1Data = await actualfirstForLoopCall(f)

        var actualfor2Data = await actualsecondForCall(actualfor1Data)
        console.log("actualsecondForCall  data", actualfor2Data)
        var actualfor3Data = await actualthirdForCall(actualfor2Data)

        console.log("actualthirdForCall", actualfor3Data)

        return actualfor3Data
    }
    function actualfirstForLoopCall(f) {
        return new Promise((resolve, reject) => {
            console.log("actualfirstForLoopCallactualfirstForLoopCall ffffff", f)
            x = []
            for (var i = 0; i < f.length; i++) {
                var z = f[i].split('+')
                var testcaseName = z[0]
                var fileName = z[1]
                var obj = {
                    "testcase": testcaseName,
                    "fileName": fileName
                }
                x.push(obj)
            }
            resolve(x);

        })
    }
    function actualsecondForCall(x) {
        return new Promise((resolve, reject) => {
            console.log("Actuallllllllll  ccccccccccccccccccccccccccccccccccccc", x)
            z = []
            for (var i = 0; i < x.length; i++) {
                console.log(x[i].testcase)
                var finalPath = path.join(__dirname, '../uploads/opal/jmeterFiles/');
                var finalPathname = path.join(finalPath, x[i].testcase);
                var finalPathData = finalPathname + '\\' + "actual" + "\\" + x[i].fileName;
                console.log("finalPathDatafinalPathDatafinalPathDatafinalPathData", finalPathData)
                z.push(finalPathData)

            }
            console.log(" actualllllllll secondForCallsecondForCallsecondForCallsecondForCall", z)
            resolve(z);

        })
    }
    async function actualthirdForCall(actualfor2Data) {
        console.log("firstttttttttttt actualllllllll ", actualfor2Data)
        actualResponseData = []
        var res;
        for (var i = 0; i < actualfor2Data.length; i++) {
            console.log(actualfor2Data[i])
            res = await actualreadingFileData(actualfor2Data[i])
            actualResponseData.push(res)
            console.log("actualllllllllll actualResponseData", actualResponseData)
        }
        return actualResponseData;

        var res;
        for (var i = 0; i < allpaths.length; i++) {
            res = await readingFileData(allpaths[i])
            responseData.push(res)
        }
        return responseData;

    }

    function actualreadingFileData(eachFilePathData) {
        console.log("fileredaing ", eachFilePathData)
        return new Promise((resolve, reject) => {
            var actualresponseArray = {};
            lr = new LineReader(eachFilePathData);
            lr.on('error', function (err) {
                console.log("error in reading the file");
            });
            lr.on('line', function (line) {

                if (line.includes('LoopController.loops')) {
                    Iteration = line.split('>')[1].split('</stringProp')[0];
                }
                if (line.includes('ThreadGroup.num_threads')) {
                    users = line.split('>')[1].split('</stringProp')[0];
                }
                if (line.includes('ThreadGroup.ramp_time')) {
                    rampup = line.split('>')[1].split('</stringProp')[0];

                }
                if (line.includes('ThreadGroup.duration')) {
                    duration = line.split('>')[1].split('</stringProp')[0];

                    actualresponseArray = {
                        "users": users,
                        "iteration": Iteration,
                        "rampup": rampup,
                        "duration": duration,
                    }
                }
            })
            lr.on('end', function () {

                resolve(actualresponseArray)
            })

        })
    }
    ///////////////////////////////////////End of reading file////////////////////////////////////
    var jCount = undefined
    var jID = undefined
    app.post('/saveTestcase', async function (req, res) {
        db.countInc.find({}, async function (err, doc) {
            jCount = doc[0].jCount;
            jCount++;
            jID = doc[0].jmeterTestcaseID;
            var jmeterTestcaseId = jID + jCount;
            console.log(jmeterTestcaseId)
            var dir = path.join(__dirname, '../uploads/opal/jmeterFiles/');
            var actualPath = path.join(dir, req.body.testcaseName);
            var finalActualPath = actualPath + '\\' + "actual" + "\\" + req.body.fileName;
            var finaltrailPath = actualPath + '\\' + "trail" + "\\" + req.body.fileName
            db.performanceTest.insert({
                "projectId": req.body.projectId,
                "jmeterTestcaseName": req.body.testcaseName,
                "jmeterTestcaseId": jmeterTestcaseId,
                "jmeterActualTestcasePath": finalActualPath,
                "jmeterTrailTestcasePath": finaltrailPath,
                "jmeterfileName": req.body.fileName,
                "status": ''
            },
                function (err, scr) {
                    if (err) {
                        throw err;
                    }
                    else {
                        db.countInc.update({ "projectID": "pID" }, { $set: { "jCount": jCount } }, (err, doc) => {
                            if (err) throw err;
                            res.json(doc);

                        })
                    }
                })
        })
    })
    app.get("/getAllTestcases:pid", (req, res) => {
        console.log("madhuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", req.params.pid)
        // db.performanceTest.find({"projectId": req.params.pid, "trailTest": {$exists: false}}, function (err, doc) {

        db.performanceTest.find({ "projectId": req.params.pid }, function (err, doc) {
            console.log(doc)
            res.json(doc);
        })
    })

    app.get("/editTestcaseName:data", (req, res) => {
        db.performanceTest.find({ "jmeterTestcaseName": req.params.data },
            function (err, doc) {
                console.log(doc)
                res.json(doc);
            })

    })
    app.put("/updateTestcaseData", async (req, res) => {
        console.log(req.body);
        let jmeterTestcaseDupicate = await treeStructureCall.getJmeterUpdateName(req.body.newtescaseName)
        if (jmeterTestcaseDupicate == null) {
            console.log(" ok jmeterTestcase ");


            var finalPath = path.join(__dirname, '../uploads/opal/jmeterFiles/');
            var finalPathname = path.join(finalPath, req.body.newtescaseName);
            var oldPath = path.join(__dirname, '../uploads/opal/jmeterFiles/');
            var oldDirPath = path.join(oldPath, req.body.oldTestcase);


            var actualPth = finalPathname + '\\' + "actual" + '\\' + req.body.fileName;
            var trailPath = finalPathname + '\\' + "trail" + '\\' + req.body.fileName;

            console.log("pathhhhhhhhhhhhhhhhhhhhhhhhh", actualPth, trailPath)

            console.log(oldDirPath, finalPathname)


            jmeternameUpdate(actualPth, trailPath)
            updatePath(oldDirPath, finalPathname)

        } else {
            console.log(" duplicate jmeterTestcase ");
            res.json([{ duplicate: true }]);

        }
        console.log(req.params.data)
        function jmeternameUpdate(actualPth, trailPath) {

            console.log(actualPth, trailPath)
            // updatePath(oldTestcasepath, editedPath)
            db.performanceTest.update({ "jmeterTestcaseName": req.body.oldTestcase },
                {
                    $set: {
                        'jmeterTestcaseName': req.body.newtescaseName,
                        "jmeterActualTestcasePath": actualPth,
                        "jmeterTrailTestcasePath": trailPath
                    }
                },
                function (err, scr) {
                    if (err) {
                        throw err;
                    }
                    else {
                        if (err) throw err;
                        res.json([{ duplicate: false }]);
                    }
                })
        }
        function updatePath(oldDirPath, finalPathname) {
            console.log(oldDirPath, finalPathname)

            const oldDirName = oldDirPath;
            const newDirName = finalPathname;

            fs.rename(oldDirName, newDirName, (err) => {
                if (err) {
                    throw err;
                } else {

                    console.log("Directory renamed successfully.");
                }
            });
        }
    })



    var rimraf = require("rimraf");

    app.delete("/deleteSelectedFile:fileNames", (req, res) => {
        var testcaseName = req.params.fileNames.split(',')[0];
        var fileNames = req.params.fileNames.split(',')[1];
        console.log(testcaseName)
        console.log(fileNames)
        delefunctionCall(testcaseName, fileNames)
        async function delefunctionCall(testcaseName, fileNames) {
            var dbDateDelete = await dbDateDocument(testcaseName, fileNames)
            var deleteFiles = await deleteTestcaseFolder(fileNames)
            res.json(deleteFiles)
        }
    })
    function dbDateDocument(testcaseName) {
        return new Promise((resolve, reject) => {
            db.performanceTest.remove({ "jmeterTestcaseId": testcaseName },
                function (err, doc) {
                    console.log(doc)
                    resolve(doc)

                })
        })

    }
    function deleteTestcaseFolder(fileNames) {
        return new Promise((resolve, reject) => {
            console.log(fileNames)
            var finalPath = path.join(__dirname, '../uploads/opal/jmeterFiles/');
            console.log(finalPath);
            var finalPathname = path.join(finalPath, fileNames);
            console.log(finalPathname);

            rimraf(finalPathname, function (err) {
                if (err) {
                    throw err
                } else {
                    resolve("Successfully deleted the file")
                }
            })

        })

    }

    // function deleteFile(fileNames) {

    // }


    app.get('/editTestcaseData:fileName', (req, res) => {
        console.log(req.params.fileName);

        var finalPath = path.join(__dirname, '../uploads/opal/jmeterFiles/');
        console.log(finalPath);
        var finalPathname = path.join(finalPath, req.params.fileName);

        lr = new LineReader(finalPathname);
        lr.on('error', function (err) {
            console.log("error in reading the file");
        });
        lr.on('line', function (line) {
            if (line.includes('ThreadGroup.num_threads')) {
                load = line.split('>')[1].split('</stringProp')[0];


            }
            if (line.includes('ThreadGroup.ramp_time')) {
                rampup = line.split('>')[1].split('</stringProp')[0];

            }
            if (line.includes('ThreadGroup.duration')) {
                duration = line.split('>')[1].split('</stringProp')[0];

                var data = {
                    "load": load,
                    "rampup": rampup,
                    "duration": duration,
                }
                res.send(data);


            }
        })
        lr.on('end', function () {

        })
    })

    app.get('/getActualTestcases:pId', (req, res) => {
        console.log("tonttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt", req.params.pId)
        db.performanceTest.find({ "projectId": req.params.pId, "trailTest": { $exists: false } }, function (err, doc) {
            console.log(doc)
            res.json(doc);
        })
    })

    app.get('/checkStatus:eee', (req, res) => {
        console.log(req.params.eee)
        var reqData = req.params.eee
        console.log(reqData + "wwwwwwwwww")
        db.performanceTest.find({ "jmeterTestcaseId": "4" },
            function (err, doc) {
                if (err) {
                    console.log("sdfsfafa")
                    throw err;
                }
                else {
                    console.log("enered")
                    console.log(doc)
                    res.json(doc)
                }
            })
    })



    app.post('/ExecutionCall', (req, res) => {
        var needData = req.body
        console.log('q111111111111111111111111111111')
        console.log(needData)
        directActual = needData.directActual
        jmeterTestcaseId = needData.jmeterTestcaseId
        testcaseFolderName = needData.jmeterTestcaseName
        
        type = needData.type
        if (type == "Actual") {
            fileData = needData.jmeterActualTestcasePath.split("actual")[1]
        fileData1 = fileData.split('\\')[1]
        fileName = fileData1.split('.')[0]
        executeFile = "../uploads/opal/jmeterFiles/" + testcaseFolderName + "/actual" + "/" + fileName + ".jmx"
        executeFilePath = path.join(__dirname, executeFile);
        resultFIle = "../uploads/opal/jmeterFiles/" + testcaseFolderName + "/actual" + "/" + fileName + ".csv"
        resultFIlePath = path.join(__dirname, resultFIle);
        htmlfile = resultFIlePath.split(".")[0]
        var filePath = ("jmeter -n -t " + executeFilePath + " -l " + resultFIlePath + " -e -o " + htmlfile)
        if (fs.existsSync(htmlfile)) {
            rimraf(htmlfile, function () { console.log("removed Html"); });

        }
        else {
            console.log("html file not present")
        }
        creatingGraph(req,res)
       // console.log(res)
        }
        else{
            console.log(needData.jmeterTestcasePath)
        fileData = needData.jmeterTrailTestcasePath.split("trail")[1]
        fileData1 = fileData.split('\\')[1]
        fileName = fileData1.split('.')[0]
        executeFile = "../uploads/opal/jmeterFiles/" + testcaseFolderName + "/trail" + "/" + fileName + ".jmx"
        executeFilePath = path.join(__dirname, executeFile);
        resultFIle = "../uploads/opal/jmeterFiles/" + testcaseFolderName + "/trail" + "/" + fileName + ".csv"
        resultFIlePath = path.join(__dirname, resultFIle);
        htmlfile = resultFIlePath.split(".")[0]
        var filePath = ("jmeter -n -t " + executeFilePath + " -l " + resultFIlePath)
        }
       
        console.log('1111111111111111111111')
        console.log(executeFilePath)
        console.log('22222222222222222222')
        console.log(resultFIlePath)
        if (fs.existsSync(resultFIlePath)) {
            fs.unlink(resultFIlePath, function (err) {
                if (err) console.log(err);
                console.log("csv file deleted");
            })

        }
        else {
            console.log("csv file not present")
        }
        // if (type == "Actual") {
        //     var filePath = ("jmeter -n -t " + executeFilePath + " -l " + resultFIlePath + " -e -o " + htmlfile)
        //     if (fs.existsSync(htmlfile)) {
        //         rimraf(htmlfile, function () { console.log("removed Html"); });

        //     }
        //     else {
        //         console.log("html file not present")
        //     }
        // }
        // else {
        //     var filePath = ("jmeter -n -t " + executeFilePath + " -l " + resultFIlePath)

        // }
        file = path.join(__dirname, `../apache-jmeter-5.3/bin/ExecutionTest.bat`)
        var mvnFileCreation = fs.createWriteStream(file);
        mvnFileCreation.write("@echo off\n")
        mvnFileCreation.write(filePath)
        cmd.exec(file, (err, stdout, stderr) => {

        })
    //  ravi =  setInterval(() => {
    //     const influx = new Influx.InfluxDB({
    //         host: 'localhost',
    //         database: 'testdbnine',
    
    //     })
    //     influx.query(
    //         `select * from jmeter`
    //         )
    //         .catch(err=>{
    //         console.log(err);
    //         })
    //         .then(results=>{
    //             console.log(results)
    //         });
    //    }, 10000);
        setTimeout(() => {
            if (fs.existsSync(resultFIlePath)) {
                checkCSVfile(resultFIlePath, type, directActual,jmeterTestcaseId, res)
           //     clearInterval(ravi)
            }
        }, 40000);
    })

    function checkCSVfile(resultFIlePath, type, directActual,jmeterTestcaseId, res) {
        console.log("hitted")
        console.log(directActual)
        var resultData = []
        var responseNumber
        var XLSX = require('xlsx');
        var workbook = XLSX.readFile(resultFIlePath);
        var sheet_name_list = workbook.SheetNames;
        data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var totalData = data
        var statusData = true
        for (i = 0; i < totalData.length; i++) {
            console.log(totalData[i].success + "," + totalData[i].failureMessage)

            if (totalData[i].success == "false") {
                resultData[i] = "FAIL" + "(" + totalData[i].failureMessage + ")"
                statusData = false;
            }
            else {
                resultData[i] = "PASS"
            }
        }
        if (type == "Actual") {

            console.log("gdasfsdfsdf")
            db.countInc.find({
                "projectID": "pID"
            }, function (err, doc) {
                responseNumber = doc[0].jmeterCount
                db.countInc.findAndModify({
                    query: { "projectID": "pID" },
                    update: { $inc: { "jmeterCount": 1 } },
                    new: true
                }, function (err, doc) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("count incremented")
                    }
                })
                console.log(responseNumber)
                res.json(responseNumber)
            })

        }
        else {
            if (statusData == false) {
                testStatus = "FAIL"
            }
            else {
                testStatus = "PASS"
            }

            
            db.performanceTest.update({ "jmeterTestcaseId": jmeterTestcaseId },
                {
                    $set:
                    {
                        "status": testStatus
                    }
                }, function (err, doc1) {
                    if (err) console.log(err)
                    console.log("Status updated");
                })
            if (directActual == true) {
                res.json(testStatus)
            }
            else {
                console.log('2e3113424141342343524523q4')
                console.log(resultData)
                res.json(resultData)
            }
        }
    }

    app.post('/checkHtml', (req, res) => {
        var Pathdata = req.body
        fileData = Pathdata.jmeterActualTestcasePath.split('actual')[1]
        fileData1 = fileData.split('\\')[1]
        fileName = fileData1.split('.')[0]
        folderName = Pathdata.jmeterTestcaseName
        resultFIle = "../uploads/opal/jmeterFiles/" + folderName + "/" + "/actual" + "/" + fileName + "/" + "index.html"
        resultFIlePath = path.join(__dirname, resultFIle)
        file = path.join(__dirname, "../uploads/opal/jmeterFiles/" + folderName + "/" + "actual/Htmltrigger.bat")
        var mvnFileCreation = fs.createWriteStream(file);
        mvnFileCreation.write("@echo off\n")
        mvnFileCreation.write(resultFIlePath)
        mvnFileCreation.write("\n")
        mvnFileCreation.write("start /B\n")
        
        cmd.exec(file, (err, stdout, stderr) => {
            console.log(err)
        })
        res.json("PASS")
    })

   function creatingGraph(req,res){
    var options = {
        'method': 'POST',
        'url': 'http://localhost:3000/api/datasources',
        'headers': {
          'Authorization': 'Basic YWRtaW46YWRtaW4=',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"name":"GraphOne",
        "user": "InfluxDB-2",
        "password": "admin",
        "type":"influxdb",
        "url":"http://localhost:8086","access":"proxy",
        "database": "testdbthirteen",
        "basicAuth":false})
      
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        console.log("1"+response.body.message)
       // setTimeout(() => {
           // res.json("PASS")
            
        // }, 5000);
        
      });


var options1 = {
    'method': 'POST',
    'url': 'http://localhost:3000/api/dashboards/db',
    'headers': {
      'Authorization': 'Basic YWRtaW46YWRtaW4=',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
"meta": {
    "type": "db",
    "canSave": true,
    "canEdit": true,
    "canAdmin": true,
    "canStar": true,
    "slug": "oneGraph",
    "url": null,
    "createdBy": "admin",
    "version": 0,
    "hasAcl": false,
    "isFolder": false,
    "folderId": 0,
    "folderTitle": "General",
    "folderUrl": "",
    "provisioned": false
},
"dashboard": {
    "annotations": {
        "list": [
            {
                "builtIn": 1,
                "datasource": "-- Grafana --",
                "enable": true,
                "hide": true,
                "iconColor": "rgba(0, 211, 255, 1)",
                "name": "Annotations & Alerts",
                "type": "dashboard"
            },
            {
                "datasource": "GraphOne",
                "enable": true,
                "iconColor": "rgb(23, 255, 0)",
                "name": "Test Start",
                "query": "SELECT * FROM testStartEnd WHERE type='started'",
                "tagsColumn": "type",
                "titleColumn": "testName"
            },
            {
                "datasource": "GraphOne",
                "enable": true,
                "iconColor": "rgba(255, 96, 96, 1)",
                "name": "Test End",
                "query": "SELECT * FROM testStartEnd WHERE type='finished'",
                "tagsColumn": "type",
                "titleColumn": "testName"
            }
        ]
    },
    "description": "This dashboard shows live load test metrics provided by JMeter.",
    "editable": true,
    "gnetId": 1152,
    "graphTooltip": 1,
    "id": null,
    "iteration": 1602579323502,
    "links": [],
    "panels": [
        {
            "content": "<h3 style=\"text-align: center;\"><em>The following panels show aggregated metrics for <span style=\"color: #00ccff;\"><strong>all requests</strong></span></em></h3>",
            "editable": true,
            "error": false,
            "gridPos": {
                "h": 5,
                "w": 4,
                "x": 0,
                "y": 0
            },
            "height": "180",
            "id": 25,
            "links": [],
            "mode": "html",
            "title": "",
            "transparent": true,
            "type": "text"
        },
        {
            "cacheTimeout": null,
            "colorBackground": false,
            "colorValue": false,
            "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
            ],
            "datasource": "GraphOne",
            "editable": true,
            "error": false,
            "format": "none",
            "gauge": {
                "maxValue": 100,
                "minValue": 0,
                "show": false,
                "thresholdLabels": false,
                "thresholdMarkers": true
            },
            "gridPos": {
                "h": 3,
                "w": 4,
                "x": 4,
                "y": 0
            },
            "height": "120",
            "id": 14,
            "interval": null,
            "links": [],
            "mappingType": 1,
            "mappingTypes": [
                {
                    "name": "value to text",
                    "value": 1
                },
                {
                    "name": "range to text",
                    "value": 2
                }
            ],
            "maxDataPoints": 100,
            "nullPointMode": "connected",
            "nullText": null,
            "postfix": "",
            "postfixFontSize": "50%",
            "prefix": "",
            "prefixFontSize": "50%",
            "rangeMaps": [
                {
                    "from": "null",
                    "text": "N/A",
                    "to": "null"
                }
            ],
            "sparkline": {
                "fillColor": "rgba(31, 118, 189, 0.18)",
                "full": false,
                "lineColor": "rgb(31, 120, 193)",
                "show": false
            },
            "tableColumn": "",
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "count"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": "",
            "title": "Active Users",
            "transparent": true,
            "type": "singlestat",
            "valueFontSize": "80%",
            "valueMaps": [
                {
                    "op": "=",
                    "text": "N/A",
                    "value": "null"
                }
            ],
            "valueName": "current"
        },
        {
            "cacheTimeout": null,
            "colorBackground": false,
            "colorValue": false,
            "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
            ],
            "datasource": "GraphOne",
            "decimals": 1,
            "editable": true,
            "error": false,
            "format": "ops",
            "gauge": {
                "maxValue": 100,
                "minValue": 0,
                "show": false,
                "thresholdLabels": false,
                "thresholdMarkers": true
            },
            "gridPos": {
                "h": 3,
                "w": 4,
                "x": 8,
                "y": 0
            },
            "height": "120",
            "id": 17,
            "interval": null,
            "links": [],
            "mappingType": 1,
            "mappingTypes": [
                {
                    "name": "value to text",
                    "value": 1
                },
                {
                    "name": "range to text",
                    "value": 2
                }
            ],
            "maxDataPoints": 100,
            "nullPointMode": "connected",
            "nullText": null,
            "postfix": "",
            "postfixFontSize": "30%",
            "prefix": "",
            "prefixFontSize": "50%",
            "rangeMaps": [
                {
                    "from": "null",
                    "text": "N/A",
                    "to": "null"
                }
            ],
            "sparkline": {
                "fillColor": "rgba(31, 118, 189, 0.18)",
                "full": false,
                "lineColor": "rgb(31, 120, 193)",
                "show": false
            },
            "tableColumn": "",
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "count"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": "",
            "title": "Overall Throughput",
            "transparent": true,
            "type": "singlestat",
            "valueFontSize": "80%",
            "valueMaps": [
                {
                    "op": "=",
                    "text": "N/A",
                    "value": "null"
                }
            ],
            "valueName": "current"
        },
        {
            "cacheTimeout": null,
            "colorBackground": false,
            "colorValue": false,
            "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
            ],
            "datasource": "GraphOne",
            "decimals": 1,
            "editable": true,
            "error": false,
            "format": "percentunit",
            "gauge": {
                "maxValue": 1,
                "minValue": null,
                "show": true,
                "thresholdLabels": false,
                "thresholdMarkers": true
            },
            "gridPos": {
                "h": 5,
                "w": 4,
                "x": 12,
                "y": 0
            },
            "height": "180",
            "id": 18,
            "interval": null,
            "links": [],
            "mappingType": 1,
            "mappingTypes": [
                {
                    "name": "value to text",
                    "value": 1
                },
                {
                    "name": "range to text",
                    "value": 2
                }
            ],
            "maxDataPoints": 100,
            "nullPointMode": "connected",
            "nullText": null,
            "postfix": "",
            "postfixFontSize": "30%",
            "prefix": "",
            "prefixFontSize": "50%",
            "rangeMaps": [
                {
                    "from": "null",
                    "text": "N/A",
                    "to": "null"
                }
            ],
            "sparkline": {
                "fillColor": "rgba(31, 118, 189, 0.18)",
                "full": false,
                "lineColor": "rgb(31, 120, 193)",
                "show": false
            },
            "tableColumn": "",
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "meanAT"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": "-1,-1",
            "title": "Success Rate",
            "transparent": true,
            "type": "singlestat",
            "valueFontSize": "80%",
            "valueMaps": [
                {
                    "op": "=",
                    "text": "N/A",
                    "value": "null"
                }
            ],
            "valueName": "current"
        },
        {
            "cacheTimeout": null,
            "colorBackground": false,
            "colorValue": false,
            "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
            ],
            "datasource": "GraphOne",
            "decimals": 0,
            "editable": true,
            "error": false,
            "format": "none",
            "gauge": {
                "maxValue": 100,
                "minValue": 0,
                "show": false,
                "thresholdLabels": false,
                "thresholdMarkers": true
            },
            "gridPos": {
                "h": 3,
                "w": 4,
                "x": 16,
                "y": 0
            },
            "height": "120",
            "id": 20,
            "interval": null,
            "links": [],
            "mappingType": 1,
            "mappingTypes": [
                {
                    "name": "value to text",
                    "value": 1
                },
                {
                    "name": "range to text",
                    "value": 2
                }
            ],
            "maxDataPoints": 100,
            "nullPointMode": "connected",
            "nullText": null,
            "postfix": "",
            "postfixFontSize": "30%",
            "prefix": "",
            "prefixFontSize": "50%",
            "rangeMaps": [
                {
                    "from": "null",
                    "text": "N/A",
                    "to": "null"
                }
            ],
            "sparkline": {
                "fillColor": "rgba(31, 118, 189, 0.18)",
                "full": false,
                "lineColor": "rgb(31, 120, 193)",
                "show": false
            },
            "tableColumn": "",
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "hit"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": "",
            "title": "Request Count",
            "transparent": true,
            "type": "singlestat",
            "valueFontSize": "80%",
            "valueMaps": [
                {
                    "op": "=",
                    "text": "N/A",
                    "value": "null"
                }
            ],
            "valueName": "current"
        },
        {
            "cacheTimeout": null,
            "colorBackground": false,
            "colorValue": false,
            "colors": [
                "rgb(109, 109, 109)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(126, 0, 0, 0.9)"
            ],
            "datasource": "GraphOne",
            "decimals": 2,
            "editable": true,
            "error": false,
            "format": "percentunit",
            "gauge": {
                "maxValue": 1,
                "minValue": null,
                "show": true,
                "thresholdLabels": false,
                "thresholdMarkers": true
            },
            "gridPos": {
                "h": 5,
                "w": 4,
                "x": 20,
                "y": 0
            },
            "height": "180",
            "id": 21,
            "interval": null,
            "links": [],
            "mappingType": 1,
            "mappingTypes": [
                {
                    "name": "value to text",
                    "value": 1
                },
                {
                    "name": "range to text",
                    "value": 2
                }
            ],
            "maxDataPoints": 100,
            "nullPointMode": "connected",
            "nullText": null,
            "postfix": "",
            "postfixFontSize": "30%",
            "prefix": "",
            "prefixFontSize": "50%",
            "rangeMaps": [
                {
                    "from": "null",
                    "text": "N/A",
                    "to": "null"
                }
            ],
            "sparkline": {
                "fillColor": "rgba(31, 118, 189, 0.18)",
                "full": false,
                "lineColor": "rgb(31, 120, 193)",
                "show": false
            },
            "tableColumn": "",
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "countError"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": "0.01,0.1",
            "title": "Error Rate",
            "transparent": true,
            "type": "singlestat",
            "valueFontSize": "80%",
            "valueMaps": [
                {
                    "op": "=",
                    "text": "N/A",
                    "value": "null"
                }
            ],
            "valueName": "current"
        },
        {
            "aliasColors": {},
            "bars": false,
            "dashLength": 10,
            "dashes": false,
            "datasource": "GraphOne",
            "editable": true,
            "error": false,
            "fill": 1,
            "grid": {},
            "gridPos": {
                "h": 8,
                "w": 24,
                "x": 0,
                "y": 5
            },
            "height": "300",
            "id": 6,
            "legend": {
                "avg": false,
                "current": false,
                "max": false,
                "min": false,
                "show": true,
                "total": false,
                "values": false
            },
            "lines": true,
            "linewidth": 1,
            "links": [],
            "nullPointMode": "null",
            "percentage": false,
            "pointradius": 5,
            "points": false,
            "renderer": "flot",
            "seriesOverrides": [
                {
                    "alias": "Throughput",
                    "yaxis": 2
                }
            ],
            "spaceLength": 10,
            "stack": false,
            "steppedLine": false,
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "maxAT"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": [],
            "timeFrom": null,
            "timeRegions": [],
            "timeShift": null,
            "title": "Load",
            "tooltip": {
                "msResolution": false,
                "shared": true,
                "sort": 0,
                "value_type": "individual"
            },
            "type": "graph",
            "xaxis": {
                "buckets": null,
                "mode": "time",
                "name": null,
                "show": true,
                "values": []
            },
            "yaxes": [
                {
                    "format": "short",
                    "label": null,
                    "logBase": 1,
                    "max": null,
                    "min": null,
                    "show": true
                },
                {
                    "format": "ops",
                    "label": "",
                    "logBase": 1,
                    "max": null,
                    "min": null,
                    "show": true
                }
            ],
            "yaxis": {
                "align": false,
                "alignLevel": null
            }
        },
        {
            "columns": [],
            "datasource": "GraphOne",
            "editable": true,
            "error": false,
            "fontSize": "80%",
            "gridPos": {
                "h": 8,
                "w": 24,
                "x": 0,
                "y": 13
            },
            "height": "300",
            "id": 9,
            "links": [],
            "pageSize": 10,
            "scroll": true,
            "showHeader": true,
            "sort": {
                "col": 0,
                "desc": true
            },
            "styles": [
                {
                    "dateFormat": "YYYY-MM-DD HH:mm:ss",
                    "pattern": "Time",
                    "type": "date"
                },
                {
                    "colorMode": "cell",
                    "colors": [
                        "rgba(0, 0, 0, 0)",
                        "rgba(183, 84, 26, 0.89)",
                        "rgba(245, 54, 54, 0.9)"
                    ],
                    "decimals": 2,
                    "pattern": "Error Rate",
                    "thresholds": [
                        "0.00000001",
                        "0.01"
                    ],
                    "type": "number",
                    "unit": "percentunit"
                },
                {
                    "colorMode": null,
                    "colors": [
                        "rgba(50, 172, 45, 0.97)",
                        "rgba(237, 129, 40, 0.89)",
                        "rgba(245, 54, 54, 0.9)"
                    ],
                    "dateFormat": "YYYY-MM-DD HH:mm:ss",
                    "decimals": 2,
                    "pattern": "/.*/",
                    "thresholds": [
                        "0.01",
                        "0.05"
                    ],
                    "type": "number",
                    "unit": "short"
                }
            ],
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "count"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "title": "Metrics Overview",
            "transform": "timeseries_to_rows",
            "transparent": false,
            "type": "table"
        },
        {
            "content": "<h3 style=\"text-align: center;\"><em>The following panels show request-specific metrics for the request <span style=\"color: #00ccff;\"><strong>\"[[request]]\"</strong></span></em></h3>",
            "editable": true,
            "error": false,
            "gridPos": {
                "h": 3,
                "w": 24,
                "x": 0,
                "y": 21
            },
            "height": "110",
            "id": 23,
            "links": [],
            "mode": "html",
            "title": "",
            "transparent": true,
            "type": "text"
        },
        {
            "aliasColors": {},
            "bars": false,
            "dashLength": 10,
            "dashes": false,
            "datasource": "GraphOne",
            "editable": true,
            "error": false,
            "fill": 1,
            "grid": {},
            "gridPos": {
                "h": 8,
                "w": 12,
                "x": 0,
                "y": 24
            },
            "height": "300px",
            "id": 7,
            "legend": {
                "alignAsTable": true,
                "avg": true,
                "current": true,
                "max": true,
                "min": true,
                "show": true,
                "total": false,
                "values": true
            },
            "lines": true,
            "linewidth": 1,
            "links": [],
            "nullPointMode": "connected",
            "percentage": false,
            "pointradius": 5,
            "points": false,
            "renderer": "flot",
            "seriesOverrides": [],
            "spaceLength": 10,
            "stack": false,
            "steppedLine": false,
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "meanAT"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": [],
            "timeFrom": null,
            "timeRegions": [],
            "timeShift": null,
            "title": "Throughput",
            "tooltip": {
                "msResolution": false,
                "shared": true,
                "sort": 0,
                "value_type": "individual"
            },
            "type": "graph",
            "xaxis": {
                "buckets": null,
                "mode": "time",
                "name": null,
                "show": true,
                "values": []
            },
            "yaxes": [
                {
                    "format": "ops",
                    "label": "",
                    "logBase": 1,
                    "max": null,
                    "min": null,
                    "show": true
                },
                {
                    "format": "short",
                    "label": null,
                    "logBase": 1,
                    "max": null,
                    "min": null,
                    "show": true
                }
            ],
            "yaxis": {
                "align": false,
                "alignLevel": null
            }
        },
        {
            "cacheTimeout": null,
            "colorBackground": false,
            "colorValue": false,
            "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(61, 165, 30, 0.97)"
            ],
            "datasource": "GraphOne",
            "editable": true,
            "error": false,
            "format": "percentunit",
            "gauge": {
                "maxValue": 1,
                "minValue": 0,
                "show": true,
                "thresholdLabels": false,
                "thresholdMarkers": true
            },
            "gridPos": {
                "h": 5,
                "w": 4,
                "x": 12,
                "y": 24
            },
            "height": "180",
            "id": 12,
            "interval": null,
            "links": [],
            "mappingType": 1,
            "mappingTypes": [
                {
                    "name": "value to text",
                    "value": 1
                },
                {
                    "name": "range to text",
                    "value": 2
                }
            ],
            "maxDataPoints": 100,
            "nullPointMode": "connected",
            "nullText": null,
            "postfix": "",
            "postfixFontSize": "50%",
            "prefix": "",
            "prefixFontSize": "50%",
            "rangeMaps": [
                {
                    "from": "null",
                    "text": "N/A",
                    "to": "null"
                }
            ],
            "sparkline": {
                "fillColor": "rgba(31, 118, 189, 0.18)",
                "full": false,
                "lineColor": "rgb(31, 120, 193)",
                "show": false
            },
            "tableColumn": "",
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "meanAT"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": "-1,-1",
            "title": "Success Rate",
            "transparent": true,
            "type": "singlestat",
            "valueFontSize": "80%",
            "valueMaps": [
                {
                    "op": "=",
                    "text": "N/A",
                    "value": "null"
                }
            ],
            "valueName": "current"
        },
        {
            "cacheTimeout": null,
            "colorBackground": false,
            "colorValue": false,
            "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(4, 106, 0, 0.97)"
            ],
            "datasource": "GraphOne",
            "editable": true,
            "error": false,
            "format": "none",
            "gauge": {
                "maxValue": 100,
                "minValue": 0,
                "show": false,
                "thresholdLabels": false,
                "thresholdMarkers": true
            },
            "gridPos": {
                "h": 4,
                "w": 4,
                "x": 16,
                "y": 24
            },
            "height": "160",
            "id": 3,
            "interval": null,
            "links": [],
            "mappingType": 1,
            "mappingTypes": [
                {
                    "name": "value to text",
                    "value": 1
                },
                {
                    "name": "range to text",
                    "value": 2
                }
            ],
            "maxDataPoints": 100,
            "nullPointMode": "connected",
            "nullText": null,
            "postfix": "",
            "postfixFontSize": "50%",
            "prefix": "",
            "prefixFontSize": "50%",
            "rangeMaps": [
                {
                    "from": "null",
                    "text": "N/A",
                    "to": "null"
                }
            ],
            "sparkline": {
                "fillColor": "rgba(31, 118, 189, 0.18)",
                "full": false,
                "lineColor": "rgb(31, 120, 193)",
                "show": false
            },
            "tableColumn": "",
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "hit"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": "",
            "title": "Request Count",
            "transparent": true,
            "type": "singlestat",
            "valueFontSize": "80%",
            "valueMaps": [
                {
                    "op": "=",
                    "text": "N/A",
                    "value": "null"
                }
            ],
            "valueName": "current"
        },
        {
            "cacheTimeout": null,
            "colorBackground": false,
            "colorValue": false,
            "colors": [
                "rgb(100, 100, 100)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(150, 20, 20, 0.9)"
            ],
            "datasource": "GraphOne",
            "decimals": 2,
            "editable": true,
            "error": false,
            "format": "percentunit",
            "gauge": {
                "maxValue": 1,
                "minValue": 0,
                "show": true,
                "thresholdLabels": false,
                "thresholdMarkers": true
            },
            "gridPos": {
                "h": 5,
                "w": 4,
                "x": 20,
                "y": 24
            },
            "height": "180",
            "id": 5,
            "interval": null,
            "links": [],
            "mappingType": 1,
            "mappingTypes": [
                {
                    "name": "value to text",
                    "value": 1
                },
                {
                    "name": "range to text",
                    "value": 2
                }
            ],
            "maxDataPoints": 100,
            "nullPointMode": "connected",
            "nullText": null,
            "postfix": "",
            "postfixFontSize": "50%",
            "prefix": "",
            "prefixFontSize": "50%",
            "rangeMaps": [
                {
                    "from": "null",
                    "text": "N/A",
                    "to": "null"
                }
            ],
            "sparkline": {
                "fillColor": "rgba(31, 118, 189, 0.18)",
                "full": false,
                "lineColor": "rgb(31, 120, 193)",
                "show": false
            },
            "tableColumn": "",
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "countError"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": "0.01,0.1",
            "title": "Error Rate",
            "transparent": true,
            "type": "singlestat",
            "valueFontSize": "80%",
            "valueMaps": [
                {
                    "op": "=",
                    "text": "N/A",
                    "value": "null"
                }
            ],
            "valueName": "current"
        },
        {
            "aliasColors": {
                "95 perc": "#F9934E",
                "99 perc": "#E24D42",
                "Max": "#BF1B00"
            },
            "bars": false,
            "dashLength": 10,
            "dashes": false,
            "datasource": "GraphOne",
            "editable": true,
            "error": false,
            "fill": 3,
            "grid": {},
            "gridPos": {
                "h": 8,
                "w": 12,
                "x": 12,
                "y": 29
            },
            "height": "300",
            "id": 1,
            "legend": {
                "alignAsTable": false,
                "avg": false,
                "current": false,
                "max": false,
                "min": false,
                "show": true,
                "total": false,
                "values": false
            },
            "lines": true,
            "linewidth": 1,
            "links": [],
            "nullPointMode": "null",
            "percentage": false,
            "pointradius": 5,
            "points": false,
            "renderer": "flot",
            "seriesOverrides": [
                {
                    "alias": "Mean",
                    "zindex": 3
                },
                {
                    "alias": "90 perc",
                    "zindex": 2
                },
                {
                    "alias": "95 perc",
                    "zindex": 1
                },
                {
                    "alias": "99 perc",
                    "zindex": 0
                },
                {
                    "alias": "Max",
                    "zindex": -1
                }
            ],
            "spaceLength": 10,
            "stack": false,
            "steppedLine": false,
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "hit"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": [],
            "timeFrom": null,
            "timeRegions": [],
            "timeShift": null,
            "title": "Response Times",
            "tooltip": {
                "msResolution": true,
                "shared": true,
                "sort": 0,
                "value_type": "individual"
            },
            "type": "graph",
            "xaxis": {
                "buckets": null,
                "mode": "time",
                "name": null,
                "show": true,
                "values": []
            },
            "yaxes": [
                {
                    "format": "ms",
                    "label": null,
                    "logBase": 1,
                    "max": null,
                    "min": null,
                    "show": true
                },
                {
                    "format": "short",
                    "label": null,
                    "logBase": 1,
                    "max": null,
                    "min": null,
                    "show": true
                }
            ],
            "yaxis": {
                "align": false,
                "alignLevel": null
            }
        },
        {
            "content": "",
            "editable": true,
            "error": false,
            "gridPos": {
                "h": 3,
                "w": 12,
                "x": 0,
                "y": 32
            },
            "height": "110",
            "id": 24,
            "links": [],
            "mode": "markdown",
            "title": "",
            "transparent": true,
            "type": "text"
        },
        {
            "aliasColors": {},
            "bars": false,
            "dashLength": 10,
            "dashes": false,
            "datasource": "GraphOne",
            "editable": true,
            "error": false,
            "fill": 1,
            "grid": {},
            "gridPos": {
                "h": 8,
                "w": 12,
                "x": 0,
                "y": 35
            },
            "height": "300",
            "id": 11,
            "legend": {
                "alignAsTable": true,
                "avg": true,
                "current": true,
                "max": true,
                "min": true,
                "show": true,
                "total": false,
                "values": true
            },
            "lines": true,
            "linewidth": 2,
            "links": [],
            "nullPointMode": "connected",
            "percentage": false,
            "pointradius": 5,
            "points": false,
            "renderer": "flot",
            "seriesOverrides": [],
            "spaceLength": 10,
            "stack": false,
            "steppedLine": false,
            "targets": [
                {
                    "groupBy": [
                        {
                            "params": [
                                "$__interval"
                            ],
                            "type": "time"
                        },
                        {
                            "params": [
                                "null"
                            ],
                            "type": "fill"
                        }
                    ],
                    "measurement": "jmeter",
                    "orderByTime": "ASC",
                    "policy": "default",
                    "refId": "A",
                    "resultFormat": "time_series",
                    "select": [
                        [
                            {
                                "params": [
                                    "countError"
                                ],
                                "type": "field"
                            },
                            {
                                "params": [],
                                "type": "mean"
                            }
                        ]
                    ],
                    "tags": [
                        {
                            "key": "application",
                            "operator": "=",
                            "value": "94"
                        }
                    ]
                }
            ],
            "thresholds": [],
            "timeFrom": null,
            "timeRegions": [],
            "timeShift": null,
            "title": "Error Rate",
            "tooltip": {
                "msResolution": false,
                "shared": true,
                "sort": 0,
                "value_type": "cumulative"
            },
            "type": "graph",
            "xaxis": {
                "buckets": null,
                "mode": "time",
                "name": null,
                "show": true,
                "values": []
            },
            "yaxes": [
                {
                    "format": "short",
                    "label": "errors / s",
                    "logBase": 1,
                    "max": null,
                    "min": "0",
                    "show": true
                },
                {
                    "format": "short",
                    "label": "",
                    "logBase": 1,
                    "max": null,
                    "min": null,
                    "show": true
                }
            ],
            "yaxis": {
                "align": false,
                "alignLevel": null
            }
        }
    ],
    "refresh": "5s",
    "schemaVersion": 16,
    "style": "dark",
    "tags": [],
    "templating": {
        "list": [
            {
                "allValue": null,
                "current": {},
                "datasource": "GraphOne",
                "definition": "",
                "hide": 0,
                "includeAll": false,
                "label": "Request",
                "multi": false,
                "name": "request",
                "options": [],
                "query": "SHOW TAG VALUES FROM \"requestsRaw\" WITH KEY = \"requestName\"",
                "refresh": 1,
                "regex": "",
                "skipUrlSync": false,
                "sort": 0,
                "tagValuesQuery": null,
                "tags": [],
                "tagsQuery": null,
                "type": "query",
                "useTags": false
            },
            {
                "allValue": null,
                "auto": false,
                "current": {
                    "tags": [],
                    "text": "1m",
                    "value": "60"
                },
                "datasource": null,
                "hide": 0,
                "includeAll": false,
                "label": "Aggregation Interval",
                "multi": false,
                "name": "aggregation",
                "options": [
                    {
                        "selected": false,
                        "text": "1s",
                        "value": "1"
                    },
                    {
                        "selected": false,
                        "text": "10s",
                        "value": "10"
                    },
                    {
                        "selected": false,
                        "text": "30s",
                        "value": "30"
                    },
                    {
                        "selected": true,
                        "text": "1m",
                        "value": "60"
                    },
                    {
                        "selected": false,
                        "text": "10m",
                        "value": "600"
                    },
                    {
                        "selected": false,
                        "text": "30m",
                        "value": "1800"
                    },
                    {
                        "selected": false,
                        "text": "1h",
                        "value": "3600"
                    }
                ],
                "query": "1,10,30,60,600,1800,3600",
                "refresh": 0,
                "skipUrlSync": false,
                "type": "custom"
            }
        ]
    },
    "time": {
        "from": "now-1d/d",
        "to": "now-1d/d"
    },
    "timepicker": {
        "refresh_intervals": [
            "5s",
            "10s",
            "30s",
            "1m",
            "5m",
            "15m",
            "30m",
            "1h",
            "2h",
            "1d"
        ],
        "time_options": [
            "5m",
            "15m",
            "1h",
            "6h",
            "12h",
            "24h",
            "2d",
            "7d",
            "30d"
        ]
    },
    "timezone": "browser",
    "title": "oneGraph",
    "uid": null,
    "version": 0
}
})
    }

    request(options1, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
   
      });
    }
    
    
    
    
    app.put('/updateJmxFileData', async (req, res) => {
        console.log(req.body)
        var completeTestcaseData = req.body
        var responsedata = await executeOneByOne(completeTestcaseData)
        console.log(responsedata)
        res.json(responsedata)

    })

    async function executeOneByOne(testcaseData) {
        console.log("madhuuuuuuuuuuuuuuuuuu", testcaseData)
        var load = testcaseData.users
        var rampupTime = testcaseData.rampup
        var duration = testcaseData.duration
        var finalPath = testcaseData.jmeterActualTestcasePath
        await firstCallTrigger(load, finalPath)
        await secondCallTrigger(rampupTime, finalPath)
        var for3Data = await thirdCallTrigger(duration, finalPath)
        return for3Data
    }

    async function firstCallTrigger(load, finalPath) {
        return new Promise((resolve, reject) => {
            lr = new LineReader(finalPath);

            lr.on('error', function (err) {
                console.log("error in reading the file");
            });

            lr.on('line', function (line) {
                if (line.includes('ThreadGroup.num_threads')) {
                    lineNumber = line.split('>')[1].split('</stringProp')[0];
                    console.log(lineNumber)

                    fs.readFile(finalPath, "utf8", (err, data) => {

                        stringdata = '<stringProp name="ThreadGroup.num_threads">' + "" + load
                        console.log(stringdata)

                        data1 = '<stringProp name="ThreadGroup.num_threads">' + '' + lineNumber;
                        newValue = data.replace(data1, stringdata);

                        fs.writeFile(finalPath, newValue, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("The file was saved ThreadGroup.num_threads!");



                        });
                    })
                }
            })
            lr.on('end', function () {
                resolve("update complted")
            })


        })
    }
    async function secondCallTrigger(rampupTime, finalPath) {
        return new Promise((resolve, reject) => {
            lr = new LineReader(finalPath);

            lr.on('error', function (err) {
                console.log("error in reading the file");
            });

            lr.on('line', function (line) {
                if (line.includes('ThreadGroup.ramp_time')) {
                    lineNumber = line.split('>')[1].split('</stringProp')[0];
                    console.log(lineNumber)

                    fs.readFile(finalPath, "utf8", (err, data) => {

                        stringdata = '<stringProp name="ThreadGroup.ramp_time">' + "" + rampupTime
                        console.log(stringdata)

                        data1 = '<stringProp name="ThreadGroup.ramp_time">' + '' + lineNumber;
                        newValue = data.replace(data1, stringdata);

                        fs.writeFile(finalPath, newValue, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("The file was saved ThreadGroup.ramp_time!");



                        });
                    })
                }
            })
            lr.on('end', function () {
                resolve("update complted")
            })


        })
    }
    async function thirdCallTrigger(duration, finalPath) {
        return new Promise((resolve, reject) => {
            lr = new LineReader(finalPath);

            lr.on('error', function (err) {
                console.log("error in reading the file");
            });

            lr.on('line', function (line) {
                if (line.includes('ThreadGroup.duration')) {
                    lineNumber = line.split('>')[1].split('</stringProp')[0];
                    console.log(lineNumber)

                    fs.readFile(finalPath, "utf8", (err, data) => {

                        console.log(lineNumber)

                        stringdata = '<stringProp name="ThreadGroup.duration">' + "" + duration
                        console.log(stringdata)

                        data1 = '<stringProp name="ThreadGroup.duration">' + '' + lineNumber;
                        newValue = data.replace(data1, stringdata);

                        fs.writeFile(finalPath, newValue, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("The file was saved! ThreadGroup.duration");
                        });
                    })
                }
            })
            lr.on('end', function () {
                resolve("update completed")
            })


        })
    }
}
