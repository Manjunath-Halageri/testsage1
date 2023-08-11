const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
var fs = require('fs');
const multer = require('multer')
var path = require("path");

async function getAllModuleData(req, res) {
    db.projectSelection.find({ "projectSelection": req.query.pName }, (err, doc) => {
        var projectId = doc[0].projectId;
        db.moduleName.find({ "projectId": projectId }, (err, doc) => {
            res.json(doc);
        })
    })
}

async function getbrowserFields(req, res) {
    db.browsers.find({}, (err, doc) => {
        res.json(doc);
    })
}

async function getDefectConfigDetails(req, res) {
    db.defectConfig.find({}, (err, doc) => {
        if (err) {
            throw err
        } else {
            res.json(doc);
        }
    })
}

async function getReleaseDetails(req, res) {
    db.projectSelection.find({ "projectSelection": req.query.pName }, (err, doc) => {
        var projectId = doc[0].projectId;
        db.release.find({ "projectId": projectId }, (err, doc) => {
            if (err) {
                throw err
            } else {
                res.json(doc);
            }
        })
    })
}

async function updateDefect(req, res) {
    db.defectDetails.update({ "defectId": req.body.defectId }, {
        $set: {
            "projectId": req.body.projectId,
            "defectId": req.body.defectId,
            "moduleId": req.body.defectForm.moduleId,
            "featureId": req.body.defectForm.featureId,
            "scriptId": req.body.defectForm.scriptId,
            "date": req.body.defectForm.date,
            "priorityId": req.body.defectForm.priorityId,
            "severityId": req.body.defectForm.severityId,
            "osId": req.body.defectForm.osId,
            "assignedTo": req.body.defectForm.assignedTo,
            "qaContact": req.body.defectForm.qaContact,
            "browserVersion": req.body.defectForm.browserVersion,
            "browserName": req.body.defectForm.browserName,
            "summary": req.body.defectForm.summary,
            "description": req.body.defectForm.description,
            "time": req.body.defectForm.time,
            "releaseId": req.body.defectForm.releaseId,
            "deviceId": req.body.defectForm.deviceId,
            "statusId": req.body.defectForm.statusId,
            "screenshot": req.body.screenShotPath,
            "video": req.body.videoPath
        }
    }, (err, doc) => {
        if (err) {
            throw err
        } else {
            res.json(doc);
        }

    })

}

async function submitDefectDetails(req, res) {
    console.log(req.body)
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
            "moduleId": req.body.defectForm.moduleId,
            "featureId": req.body.defectForm.featureId,
            "scriptId": req.body.defectForm.scriptId,
            "date": req.body.defectForm.date,
            "priorityId": req.body.defectForm.priorityId,
            "severityId": req.body.defectForm.severityId,
            "osId": req.body.defectForm.osId,
            "assignedTo": req.body.defectForm.assignedTo,
            "qaContact": req.body.defectForm.qaContact,
            "browserVersion": req.body.defectForm.browserVersion,
            "browserName": req.body.defectForm.browserName,
            "summary": req.body.defectForm.summary,
            "description": req.body.defectForm.description,
            "time": req.body.defectForm.time,
            "releaseId": req.body.defectForm.releaseId,
            "deviceId": req.body.defectForm.deviceId,
            "statusId": req.body.defectForm.statusId,
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
}

async function searchModule(req, res) {
    console.log("piddddddddddddddddddddddddddddddd", req.query.projectId)
    db.featureName.find({ "moduleId": req.query.moduleId, "projectId": req.query.projectId }, function (err, doc) {
        // console.log(doc)
        res.json(doc)
    })

}

async function searchFeaturesData(req, res) {
    console.log("piddddddddddddddddddddddddddddddd", req.query.projectId)

    db.testScript.find({ "projectId": req.query.projectId, "moduleId": req.query.moduleId, "featureId": req.query.featureId }, function (err, doc) {
        res.json(doc)
    })

}

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        console.log("ddddddddddddddddddddddddddddddddd", file.originalname)
        cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
        var dir = path.join(__dirname, '../../uploads/opal/defectVideos/');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        else {
            var newDestination = path.join(__dirname, '../../uploads/opal/defectVideos/');
            cb(null, newDestination);
        }

    }
});

const upload = multer({
    dest: "../../uploads/opal/defectScreenshots/",
    limits: {
        fieldNameSize: 100,
        fileSize: 60000000
    },
    storage: storage
})

function makeFileRequest(req, res) {
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj", req.body)
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send("Something went wrong!");
        }
        res.send(req.file);
    })

}






//////////////////////////////////////////////search a defect code starts //////////////////////////////

async function testScriptDetails(req, res) {

    console.log(req.query)
    var data_Array = req.query.alaData.split(",");
    var moduleId = data_Array[0];
    var featureId = data_Array[1];
    var projectSelection = data_Array[2];
    var type = data_Array[3];
    var priority = data_Array[4];
    const keyvalue = ["moduleId", 'featureId', 'projectSelection', 'priorityId', 'severityId', 'statusId']
    var count = 0;

    dataObj = {}

    for (var i = 0; i < 6; i++) {
        //  All
        if (data_Array[i] !== "undefined") {
            dataObj[keyvalue[i]] = data_Array[i];
        }

        if (i == 4) {

            db.projectSelection.find({ "projectSelection": projectSelection }, function (err, projectDetails) {

                delete dataObj.projectSelection;
                dataObj["projectId"] = projectDetails[0].projectId;
                db.defectDetails.find(dataObj
                    , function (err, testScriptDetails) {
                        console.log(testScriptDetails)
                        var newArray = [];
                        if (testScriptDetails.length == 0) {
                            console.log("serached result is  0 ")

                            res.json(newArray);
                        }

                        testScriptDetails.forEach(function (testScriptDetail) {
                            db.featureName.find({ "featureId": testScriptDetail.featureId, "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, featureDetails) {
                                db.moduleName.find({ "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, moduleDetails) {
                                    obj = {}
                                    obj['defectId'] = testScriptDetail.defectId;
                                    obj['qaContact'] = testScriptDetail.qaContact;
                                    obj['priority'] = testScriptDetail.priority;
                                    obj['summary'] = testScriptDetail.summary;
                                    obj['severity'] = testScriptDetail.severity;
                                    console.log(testScriptDetail.priority)
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
}

async function singleDefectDetail(req, res) {
    console.log("piddddddddddddddddddddddddddddddd", req.query.defectId)
    db.defectDetails.find({ "defectId": req.query.defectId }, (err, doc) => {
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
                else {
                    doc[0].status = doc1[0].status.status;
                    doc[0].priority = doc1[0].defectPriority.priorityName;
                    doc[0].severity = doc1[0].severity.severityName;
                    console.log(doc)
                    res.json(doc)
                }


            }

        )
    })

}

async function editDefectDetail(req, res) {

    console.log("defectDetailQuickdefectDetailQuickdefectDetailQuickdefectDetailQuickdefectDetailQuick")

    console.log(req.query.defectId)
    db.defectDetails.find({ "defectId": req.query.defectId }, (err, doc) => {
        if (err) {
            throw err
        } else {
            res.json(doc)
        }
    })
}
module.exports = {
    getAllModuleData: getAllModuleData,
    getbrowserFields: getbrowserFields,
    getDefectConfigDetails: getDefectConfigDetails,
    getReleaseDetails: getReleaseDetails,
    updateDefect: updateDefect,
    searchModule: searchModule,
    searchFeaturesData: searchFeaturesData,
    submitDefectDetails: submitDefectDetails,
    makeFileRequest: makeFileRequest,


    testScriptDetails: testScriptDetails,
    singleDefectDetail: singleDefectDetail,
    editDefectDetail: editDefectDetail
};