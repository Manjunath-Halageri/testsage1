module.exports = function (app) {
    var mongojs = require('mongojs');
    var async = require("async");
    var db = require('../dbDeclarations').url;
    const treeStructureCall = require('./services/treeStructureData');
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('/displayrequirementPage:clickedScript', async function (req, res) {

        console.log("one", req.params.clickedScript.split(',')[1])
        db.featureName.find({ "featureName": req.params.clickedScript.split(',')[1] }, (err, doc) => {
            if (err) throw err;
            console.log(doc)
            console.log(req.params.clickedScript.split(',')[0])

            db.requirement.find({
                $and:
                    [
                        { "projectId": doc[0].projectId },
                        { "moduleId": doc[0].moduleId },
                        { "featureId": doc[0].featureId },
                        { "requirementName": req.params.clickedScript.split(',')[2] }


                    ]
            }, function (err, doc) {
                if (err) throw err;
                res.json(doc);
                console.log(doc)
            })
        })

    })
    app.post('/jmlDataPost', (req, res) => {
        db.mm.insert({
            "dddd": req.body
        })

    })

    var rCount = undefined
    var rrID = undefined
    app.post('/DescriptionDatatodb', async function (req, res) {
        db.countInc.find({}, function (err, doc) {
            rCount = doc[0].rCount;
            rCount++;
            rrID = doc[0].requirementId;
            var requirementId = rrID + rCount;
            db.moduleName.find({ "moduleName": req.body.moduleName, 'projectId': req.body.projectId }, function (err, doc) {
                db.featureName.find({ "moduleId": doc[0].moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName }, async function (err, fea) {
                    let requirementDupicate = await treeStructureCall.getRequirement(doc[0].moduleId, fea[0].featureId, req.body.requirementName, req.body.projectId)
                    if (requirementDupicate == null) {
                        requirementInsert()

                    } else {
                        res.json([{ duplicate: true }]);

                    }

                    function requirementInsert() {
                        db.requirement.insert({
                            "moduleId": doc[0].moduleId,
                            "projectId": req.body.projectId,
                            "featureId": fea[0].featureId,
                            "requirementName": req.body.requirementName,
                            "requirementId": requirementId,
                            "status": req.body.requirementstatus,
                            "priority": req.body.requirementpriority,
                            "type": req.body.requirementtype,
                            "Assigned": req.body.requirementassigned,
                            "description": req.body.descriptiondata,
                            "Release": req.body.requirementrelease
                        },
                            function (err, scr) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    db.countInc.update({ "projectID": "pID" }, { $set: { "rCount": rCount } }, (err, doc) => {
                                        if (err) throw err;
                                        //res.json("Success");

                                        res.json([{ duplicate: false }]);
                                    })
                                }
                            })
                    }

                })
            })
        })
    });




    app.get('/getRequirementFields', (req, res) => {
        db.RequirementFields.find({}, (err, doc) => {
            res.json(doc);

        })
    })

    app.get('/requirementDbNames:ggggg', function (req, res) {
        db.requirement.find({
            "moduleId": req.params.ggggg.split(',')[0],
            "featureId": req.params.ggggg.split(',')[1],
            "projectId": req.params.ggggg.split(',')[2]
        }, function (err, doc) {
            res.json(doc);
        })
    })

    app.get('/EditdisplayModulePage', function (req, res) {
        db.Reqmodule.find({ "moduleName": req.params.moduleName }, function (err, doc) {
            res.json(doc);
        })
    })
    app.get('/searchAllModuleData:moduleData', function (req, res) {
        var moduleData = req.params.moduleData;
        var data_Array = moduleData.split(",");
        var projectFolder = data_Array[0];
        var moduleId = data_Array[1];
        db.projectSelection.find({ "projectSelection": projectFolder }, function (err, doc) {
            if (moduleId == "All") {
                db.featureName.find({ "projectId": doc[0].projectId }, function (err, doc) {
                    console.log(doc)
                    res.json(doc)
                })

            }
            else {
                db.featureName.find({ "moduleId": moduleId, "projectId": doc[0].projectId }, function (err, doc) {
                    console.log(doc)
                    res.json(doc)
                })

            }
        })
    })

    app.get('/featureData:featureData', function (req, res) {
        var data_Array = req.params.featureData.split(',')
        var projectName = data_Array[0];
        const keyvalue = ['projectId', "moduleId", 'featureId']
        dataObj = {}

        for (var i = 1; i < 3; i++) {
            if (data_Array[i] !== "All") {
                dataObj[keyvalue[i]] = data_Array[i];
            }
        }
        db.projectSelection.find({ "projectSelection": projectName }, function (err, projectDetails) {
            dataObj["projectId"] = projectDetails[0].projectId;
            db.requirement.find(dataObj
                , function (err, requirement) {
                    console.log(" inside cdata");
                    res.json(requirement)
                })
        })
    })

    app.get('/getRequirementDetails:featureData', function (req, res) {
        var data_Array = req.params.featureData.split(',');
        var projectId = data_Array[0]
        console.log(projectId);
        const keyvalue = ['projectId', "moduleId", 'featureId']
        dataObj = {};
        var count = 0;
        if (data_Array[2] !== undefined) {
            for (var i = 0; i < 3; i++) {
                console.log(keyvalue.length)
                if (data_Array[i] !== "All") {
                    dataObj[keyvalue[i]] = data_Array[i];
                }
            }
        }
        else if (data_Array[1] !== undefined) {
            for (var i = 0; i < 2; i++) {
                console.log(keyvalue.length)
                if (data_Array[i] !== "All") {
                    dataObj[keyvalue[i]] = data_Array[i];
                }
            }
        }
        else {
            for (var i = 0; i < 1; i++) {
                console.log(keyvalue.length)
                if (data_Array[i] !== "All") {
                    dataObj[keyvalue[i]] = data_Array[i];
                }
            }
        }



        async function getCount(id) {
            return new Promise((resolves, reject) => {
                db.testScript.find({ "requirementId": id }, { "scriptName": 1, _id: 0 }, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("   result    resulttt    result    resulttt    ")
                        resolves(result);
                    }
                });
            })
        }

        db.projectSelection.find({ "projectId": projectId }, function (err, projectDetails) {
            dataObj["projectId"] = projectId;
            db.requirement.find(dataObj, function (err, requirement) {
                var newArray = [];
                if (requirement.length == 0) {
                    console.log("serached result is  0 ")
                    res.json(newArray);
                }

                requirement.forEach(async function (testScriptDetail) {
                    testScriptDetail.scripts = await getCount(testScriptDetail.requirementId);
                    db.featureName.find({ "featureId": testScriptDetail.featureId, "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, featureDetails) {
                        db.moduleName.find({ "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, moduleDetails) {
                            obj = {}
                            obj['moduleName'] = moduleDetails[0].moduleName;
                            obj['featureName'] = featureDetails[0].featureName;
                            obj['requirementName'] = testScriptDetail.requirementName;
                            obj['count'] = testScriptDetail.scripts.length;
                            console.log(testScriptDetail.scripts.length)
                            obj['scripts'] = testScriptDetail.scripts;
                            newArray.push(obj)
                            // console.log(requirement.length)
                            if (count === (requirement.length - 1)) {
                                console.log("serached result is  not zero ")
                                res.json(newArray);
                            }
                            count++;
                            // console.log(count)
                        });
                    })
                })




            })
        })
    })

    app.put('/updateRequirementData', function (req, res) {
        db.requirement.update({ "_id": mongojs.ObjectId(req.body._id) },
            {
                $set: {
                    "requirementName": req.body.requirementName,
                    "status": req.body.requirementstatus,
                    "priority": req.body.requirementpriority,
                    "type": req.body.requirementtype,
                    "Assigned": req.body.requirementassigned,
                    "description": req.body.descriptiondata,
                    "Release": req.body.requirementrelease

                }
            }, (err, doc) => {
                if (err) throw err;
                else {
                    console.log(doc)
                    res.json(doc)
                }
            }
        )

    })
    app.delete('/deleterequirement:deleteScript', function (req, res) {
        db.requirement.remove({ "requirementName": req.params.deleteScript }, function (err, doc) {
            if (err) {
                throw err
            }
            else {
                res.json(doc);
            }
        })
    })

    app.post('/getstructuredata', function (req, res) {
        function aggregateCall(collection, obj) {
            console.log('calling findOne');
            return new Promise((resolves, reject) => {

                collection.aggregate(obj, function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {

                        resolves(result);
                    }
                });
            })

        }

        async function dbCall(project) {


            let agg = [{ $match: { "projectId": project } },
            {
                "$lookup":
                {
                    "from": "featureName",
                    "localField": "moduleId",
                    "foreignField": "moduleId",
                    "as": "featureName"
                }
            },
            { $match: { "featureName.featureId": { "$exists": false } } }
            ];

            let agg2 = [{ $match: { "projectId": project } },
            {
                "$lookup":
                {
                    "from": "featureName",
                    "localField": "moduleId",
                    "foreignField": "moduleId",
                    "as": "featureName"
                }
            },
            //  { $match: { "featureName.featureId" : {"$exists":false} } }
            { $unwind: "$featureName" },
            {
                "$lookup":
                {
                    "from": "requirement",
                    "localField": "featureName.featureId",
                    "foreignField": "featureId",
                    "as": "requirement"
                }
            },

            {
                $match: {
                    "requirement.featureId": { "$exists": false }

                }
            },
            {
                $group: {
                    _id: "$moduleName",

                    features: { $push: { featureName: "$featureName.featureName", "requirementName": "$requirement.requirementName", "requirementId": "$requirement.requirementId", "moduleId":"$featureName.moduleId","featureId":"$featureName.featureId" } }
                }
            }


            ];
            let agg3 = [{ $match: { "projectId": project } },
            {
                "$lookup":
                {
                    "from": "featureName",
                    "localField": "moduleId",
                    "foreignField": "moduleId",
                    "as": "featureName"
                }
            },
            { $unwind: "$featureName" },
            {
                "$lookup":
                {
                    "from": "requirement",
                    "localField": "featureName.featureId",
                    "foreignField": "featureId",
                    "as": "requirement"
                }
            },
            { $unwind: "$requirement" },
            {
                $group: {
                    _id: "$moduleName",

                    features: { $push: { featureName: "$featureName.featureName", "requirementName": "$requirement.requirementName",  "moduleId":"$requirement.moduleId", "featureId":"$requirement.featureId" } }
                },
            }
            ];

            let onlyModules = await aggregateCall(db.moduleName, agg);
            console.log(" onlyModules ")
            console.log(onlyModules)
            let modulesPlusFeature = await aggregateCall(db.moduleName, agg2);
            console.log("  modulesPlusFeature")
            console.log(modulesPlusFeature)
            let doc = await aggregateCall(db.moduleName, agg3);
            console.log("  doc  doc doc  modulesPlusFeature")
            console.log(doc)


            function getObj(doc) {
                let unique = doc.features.filter((thing, index, self) => index === self.findIndex((t) => t.featureName === thing.featureName));
                unique.map(e => (e.children = [], e.label = e.featureName, e.data = "feature", e.expandedIcon = "fa fa-folder-open", e.collapsedIcon = "fa fa-folder"));
                doc.features.map((feature) => unique[unique.map(e => e.featureName).indexOf(feature.featureName)].children.push({ "label": feature.requirementName, "requirementId": feature.requirementId, "icon": "fa fa-file-word-o", "data": "script" }));
                doc.features.map((feature) => delete feature.requirementName)
                doc['children'] = unique;
                doc['label'] = doc._id;
                doc['data'] = "module";
                doc['moduleId'] = doc.features[0].moduleId
                doc["expandedIcon"] = "fa fa-folder-open";
                doc["collapsedIcon"] = "fa fa-folder";
                delete doc._id;
                delete doc.features;
                return doc;
            }


            function duplicateCall(features, index) {
                console.log(features)
                console.log(index)
                console.log(data)
                features.forEach((e) => {
                    let obj = {
                        children: [],
                        label: e.featureName,
                        data: 'feature',
                        featureId: e.featureId,
                        expandedIcon: "fa fa-folder-open",
                        collapsedIcon: "fa fa-folder"
                    }
                    data[index].children.push(obj)
                });



            }

            function pushCall(modules) {
                data.push({
                    "label": modules._id, 'data': 'module', "moduleId":modules.features[0].moduleId, "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children':

                        modules.features.filter((e) => (e.children = [], e.label = e.featureName, e.data = "feature", e.expandedIcon = "fa fa-folder-open", e.collapsedIcon = "fa fa-folder"))
                })
            }


            let data = null;



            function checkCall() {
                let bb = modulesPlusFeature.map((modules, index) => -1 !== (data.findIndex((dataModule) => dataModule.label === modules._id)) ?
                    duplicateCall(modules.features, data.map(e => e.label).indexOf(modules._id)) : pushCall(modules))
                res.json(data);
            }

            async.eachSeries([
                data = doc.map((doc) => getObj(doc)),
                onlyModules.map((modules) => data.push({ "label": modules.moduleName, 'moduleId':modules.moduleId, 'data': 'module', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children': [] })),
                checkCall()

            ],
                function (item, cb) {

                    return cb();


                },
                function (err) {
                    console.log(err);
                });



        }

        dbCall(req.body.projectNew)
        ////////// FOR FINDING MODULES WHEN NOT SPECIFIED  MODULES IN DB///////////
        function elseForModule(allResult) {
            console.log(allResult)
            db.loginDetails.find({ $and: [{ "userId": allResult.userId }, { "roleName": allResult.roleName }] }, function (err, doc) {
                console.log(doc)
                for (i = 0; i <= doc[0].projectAccess.length - 1; i++) {
                    if (doc[0].projectAccess[i].projectId === allResult.projectNew) {
                        if (doc[0].projectAccess[i].modlues == undefined) {
                            db.moduleName.find({ "projectId": allResult.projectNew }, function (err, doc) {
                                console.log(doc);
                                res.json(doc);
                            })
                        }

                        else {
                            elseAgainSubModules(doc)

                        }
                    }
                }
            })
        }
        ////////// FOR FINDING MODULES WHEN  SPECIFIED  MODULES IN DB///////////
        function elseAgainSubModules(doc) {
            var allModules = [];
            for (j = 0; j <= doc[0].projectAccess[i].modlues.length - 1; j++) {
                allModules.push(doc[0].projectAccess[i].modlues[j].moduleId)
                console.log(allModules);

            }

            db.moduleName.find({
                moduleId: {
                    $in: allModules
                }
            }, function (err, doc) {
                console.log(doc);

                res.json(doc);
            })
            allModules = [];
        }

    })

    app.get('/showModuleWise:mod', function (req, res) {
        db.moduleName.find({ "moduleName": req.params.mod }, function (err, doc) {
            console.log(doc)
            res.json(doc);
        })
    })
    app.get('/showFeatureWise:fea', function (req, res) {
        db.featureName.find({ "featureName": req.params.fea }, function (err, doc) {
            res.json(doc);
        })
    })

    app.get('/checkReqmappedToTestcase:reqName', (req, res) => {
        db.testScript.find({ "requiremantName": req.params.reqName }, (err, doc) => {
            if (err) {
                throw err;
            }
            else {
                res.json(doc)
            }

        })
    })
    app.get('/CheckingModHavingFeature:modName', (req, res) => {
        db.moduleName.find({ "moduleName": req.params.modName }, (err, doc) => {
            db.featureName.find({ "moduleId": doc[0].moduleId }, (err, doc) => {
                if (err) {
                    throw err;
                }
                else {
                    res.json(doc)
                }

            })
        })
    })

    app.get('/CheckingFeaHavingRequirement:feaName', (req, res) => {
        db.featureName.find({ "featureName": req.params.feaName }, (err, doc) => {
            db.requirement.find({ "featureId": doc[0].featureId }, (err, doc) => {
                if (err) {
                    throw err;
                }
                else {
                    res.json(doc)
                }
            })
        })
    })
}