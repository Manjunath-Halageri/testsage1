module.exports = function (app) {
    var mongojs = require('mongojs');
    var bodyParser = require("body-parser");
    var fs = require('fs');
    var path = require("path");
    var async = require("async");
    var multer = require('multer');
    var db = require('../dbDeclarations').url;
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


    console.log("FILE A DEFECT is working ")

    app.get('/getbrowserFields', (req, res) => {
        db.browsers.find({}, (err, doc) => {
            res.json(doc);

        })
    })

    app.get('/getDefectConfigDetails', (req, res) => {
        db.defectConfig.find({}, (err, doc) => {
            res.json(doc);
        })
    })

    app.get('/getReleaseDetails', (req, res) => {
        db.release.find({}, (err, doc) => {
            res.json(doc);
        })
    })

    // app.get('/getModuleFields:projectName', (req, res) => {
    //     console.log("enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
    //     console.log("one" + req.params.projectName)
    //     db.projectSelection.find({ "projectSelection": req.params.projectName }, (err, doc) => {
    //         console.log(doc[0].projectId)
    //         var projectId = doc[0].projectId;
    //         db.moduleName.find({ "projectId": projectId }, (err, doc) => {
    //             console.log(doc);
    //             res.json(doc);
    //         })
    //     })
    // })

    app.post('/defectDetails', function (req, res) {
        // console.log("madhusudaaaaaaaaaaaaaaaaaaaaaaaaannnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
        // console.log(req.body);
        db.countInc.find({}, function (err, doc) {

            dCount = Number(doc[0].dCount);
            dCount++;
            console.log(dCount)
            dID = doc[0].defectId;
            console.log(dID)
            var defectId = dID + dCount;
            db.defectDetails.insert({
                "projectId": req.body.projectId,
                "defectId": defectId,
                "moduleId": req.body.moduleId,
                "featureId": req.body.featureId,
                "scriptId": req.body.scriptId,
                "date": req.body.date,
                "priorityId": req.body.priorityId,
                "severityId": req.body.severityId,
                "osId": req.body.osId,
                "assignedTo": req.body.assignedTo,
                "qaContact": req.body.qaContact,
                "browserVersion": req.body.browserVersion,
                "browserName": req.body.browserName,
                "summary": req.body.summary,
                "description": req.body.description,
                "time": req.body.time,
                "releaseId": req.body.releaseId,
                "deviceId": req.body.deviceId,
                "statusId": req.body.statusId,
                "screenshot": req.body.screenShotPath,
                "video": req.body.videoPath
            }, (err, doc1) => {
                res.json(doc1);
                db.countInc.update({ dCount: doc[0].dCount },
                    {
                        $set: { dCount: doc[0].dCount + 1 }
                    }, (err, doc) => {
                        if (err) throw err;
                        console.log(doc)
                    })
            })

        })
    })

    app.post('/updateDefectDetails', function (req, res) {
        console.log("manishshshshhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
        console.log(req.body)
        // db.defectDetails.find({}, function (err, doc1) {
        // db.defectDetails.update({ "_id": mongojs.ObjectId(doc1[0]._id)},{  
        db.defectDetails.update({ "defectId": req.body.defectId }, {
            $set: {
                "projectId": req.body.projectId,
                "defectId": req.body.defectId,
                "moduleId": req.body.moduleId,
                "featureId": req.body.featureId,
                "scriptId": req.body.scriptId,
                "date": req.body.date,
                "priorityId": req.body.priorityId,
                "severityId": req.body.severityId,
                "osId": req.body.osId,
                "assignedTo": req.body.assignedTo,
                "qaContact": req.body.qaContact,
                "browserVersion": req.body.browserVersion,
                "browserName": req.body.browserName,
                "summary": req.body.summary,
                "description": req.body.description,
                "time": req.body.time,
                "releaseId": req.body.releaseId,
                "deviceId": req.body.deviceId,
                "statusId": req.body.statusId,
                "screenshot": req.body.screenShotPath,
                "video": req.body.videoPath
            }
        }, (err, doc) => {
            res.json(doc);


            console.log(doc)


        }) //db.
        // db.defectDetails.find({}, function (err, doc1) {
    });

    app.get('/defectDetailQuick:defectId', function (req, res) {
        console.log("defectDetailQuickdefectDetailQuickdefectDetailQuickdefectDetailQuickdefectDetailQuick")

        console.log(req.params.defectId)
        db.defectDetails.find({ "defectId": req.params.defectId }, (err, doc) => {
            db.defectConfig.aggregate(
                [
                    { $unwind: "$status" },
                    { $unwind: "$severity" },
                    { $unwind: "$defectPriority" },

                    {
                        $match: {
                            $and: [
                                { "status.statusId": parseInt(doc[0].statusId) },
                                { "severity.severityId": parseInt(doc[0].severityId) },
                                { "defectPriority.priorityId": parseInt(doc[0].priorityId) }
                            ]
                        }
                    },
                    { $project: { "_id": 0, device: 0, assignedTo: 0, qaContact: 0, os: 0 } }


                ], function (err, doc1) {
                    if (err) throw err;
                    else{
                        doc[0].status = doc1[0].status.status;
                        doc[0].priority = doc1[0].defectPriority.priorityName;
                        doc[0].severity = doc1[0].severity.severityName;
                        console.log(doc)
                        res.json(doc)
                    }
                    

                }

            )
        })

    })

    app.get('/editDefectDetail:defectId', function (req, res) {
        console.log("defectDetailQuickdefectDetailQuickdefectDetailQuickdefectDetailQuickdefectDetailQuick")

        console.log(req.params.defectId)
        db.defectDetails.find({ "defectId": req.params.defectId }, (err, doc) => {
            res.json(doc)
            console.log(doc)
        })
    })


    app.get('/searchFeaturesData:featureData', function (req, res) {
        var data_Array = req.params.featureData.split(',')

        console.log(data_Array[0])
        var projectName = data_Array[0]

        const keyvalue = ['projectId', "moduleId", 'featureId']
        dataObj = {}

        for (var i = 1; i < 3; i++) {
            if (data_Array[i] !== "All") {
                dataObj[keyvalue[i]] = data_Array[i];
            }
        }

        dataObj["projectId"] = projectName;
        console.log("pppppppppppppppoooooooooooooooooooooooooo")

        db.testScript.find(dataObj


            , function (err, requirement) {
                console.log(dataObj)
                console.log(" inside cdata");
                console.log(data_Array)
                console.log(requirement)
                console.log(" inside cdata");
                res.json(requirement)
            })
        // })
    })

    app.get('/ScriptDetails:ss', function (req, res) {
        console.log("vickkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkyyyyyyyyyyyyyyyyy")

        var data = req.params.ss;
        console.log(data)
        var data_Array = data.split(",");
        var moduleId = data_Array[0];
        var featureId = data_Array[1];
        var projectSelection = data_Array[2];
        var type = data_Array[3];
        var priority = data_Array[4];
        // const keyvalue = ["moduleId", 'featureId', 'projectSelection']
        const keyvalue = ["moduleId", 'featureId', 'projectSelection', 'priorityId', 'severityId', 'statusId']
        var count = 0;

        dataObj = {}

        for (var i = 0; i < 6; i++) {
            //  All
            if (data_Array[i] !== "undefined") {
                console.log(data_Array[i])
                dataObj[keyvalue[i]] = data_Array[i];
                console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",dataObj)
            }

            if (i == 4) {

                db.projectSelection.find({ "projectSelection": projectSelection }, function (err, projectDetails) {
                    // console.log(projectDetails[0].projectId);
                    // console.log("  before delete")
                    // console.log(dataObj)
                    delete dataObj.projectSelection;
                    dataObj["projectId"] = projectDetails[0].projectId;
                    db.defectDetails.find(dataObj
                        , function (err, testScriptDetails) {
                            // console.log(" inside cdata");
                            console.log(testScriptDetails)
                            var newArray = [];
                            if (testScriptDetails.length == 0) {
                                // console.log("rerrrrrrrrrrreeeeeee")
                                console.log("serached result is  0 ")

                                res.json(newArray);
                            }

                            testScriptDetails.forEach(function (testScriptDetail) {
                                db.featureName.find({ "featureId": testScriptDetail.featureId, "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, featureDetails) {
                                    db.moduleName.find({ "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, moduleDetails) {
                                        // db.defectConfig.find({ "priorityId": testScriptDetail.priorityId,}, function (err, Details) {
                                        obj = {}
                                        obj['defectId'] = testScriptDetail.defectId;
                                        obj['qaContact'] = testScriptDetail.qaContact;
                                        obj['priority'] = testScriptDetail.priority;
                                        obj['summary'] = testScriptDetail.summary;
                                        obj['severity'] = testScriptDetail.severity;
                                        console.log(testScriptDetail.priority)
                                        // console.log("aaaaaaaaaaaaaaaa",testScriptDetail.statusId)
                                        // console.log("testScriptDetail.severity", testScriptDetail.severity)
                                        // console.log("(testScriptDetail.priorityId",testScriptDetail.priorityId)
                                        if (testScriptDetail.statusId == 1) {
                                            obj['status'] = "open"
                                        }
                                        else if (testScriptDetail.statusId == 2) {
                                            obj['status'] = "fixed"
                                        }
                                        else if (testScriptDetail.statusId == 3) {
                                            obj['status'] = "ready for testing"
                                        }
                                        else if (testScriptDetail.statusId == 4) {
                                            obj['status'] = "closed"
                                        }
                                        else if (testScriptDetail.statusId == 5) {
                                            obj['status'] = "reopen"
                                        }

                                        if (testScriptDetail.severityId == 1) {
                                            obj['severity'] = "Blocker"
                                        }
                                        else if (testScriptDetail.severityId == 2) {
                                            obj['severity'] = "Critical"
                                        }
                                        else if (testScriptDetail.severityId == 3) {
                                            obj['severity'] = "Major"
                                        }
                                        else if (testScriptDetail.severityId == 4) {
                                            obj['severity'] = "Minor"
                                        }
                                        else if (testScriptDetail.severityId == 5) {
                                            obj['severity'] = "Normal"
                                        }
                                        else if (testScriptDetail.severityId == 6) {
                                            obj['severity'] = "Trivial"
                                        }
                                        else if (testScriptDetail.severityId == 7) {
                                            obj['severity'] = "Enhancement"
                                        }
                                        if (testScriptDetail.priorityId == 1) {
                                            obj['priority'] = "P1"
                                        }
                                        else if (testScriptDetail.priorityId == 2) {
                                            obj['priority'] = "P2"
                                        }
                                        else if (testScriptDetail.priorityId == 3) {
                                            obj['priority'] = "P3"
                                        }

                                        else if (testScriptDetail.priorityId == 4) {
                                            obj['priority'] = "P4"
                                        }

                                        console.log("madhuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", obj)
                                        newArray.push(obj)
                                        if (count === (testScriptDetails.length - 1)) {
                                            console.log("serached result is  not zero ")
                                            res.json(newArray);
                                        }
                                        count++;
                                        // });
                                    });
                                })
                            })


                        })
                })

            }

        }

})

    var storage = multer.diskStorage({

        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
        destination: function (req, file, cb) {

            var dir = path.join(__dirname, '../uploads/opal/defectScreenshots/');;

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            else {
                var newDestination = path.join(__dirname, '../uploads/opal/defectScreenshots/');
                cb(null, newDestination);
            }

        }
    });

    var upload = multer(
        {
            dest: "../uploads/opal/defectScreenshots/",
            limits: {
                fieldNameSize: 100,
                fileSize: 60000000
            },
            storage: storage
        });

    app.post("/saveScreenShots", upload.any(), function (req, res) {
        console.log("madhiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",req.files)

        res.send(req.files);
    });


    //upload video call
    var storage = multer.diskStorage({
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
        destination: function (req, file, cb) {
            var dir = path.join(__dirname, '../uploads/opal/defectVideos/');

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            else {
                var newDestination = path.join(__dirname, '../uploads/opal/defectVideos/');
                cb(null, newDestination);
            }
            
        }
    });

    var uploadVideo = multer(
        {
            dest: "../uploads/opal/defectVideos/",
            limits: {
                fieldNameSize: 100,
                fileSize: 60000000
            },
            storage: storage
        });

    app.post("/saveManualVideos", uploadVideo.any(), function (req, res) {
        console.log(req.files)
        res.send(req.files);
    })
    //end of video call
}