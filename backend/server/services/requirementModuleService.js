const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var fs = require('fs');
var path = require("path");
var async = require("async");


///////////////////////////// Tree structure code starts /////////////////////////////////

async function getAllTreeStructuteData(req, res) {
    console.log(req.body)
    console.log("haaaaaaaaaaaaaaa", req.body.projectNew)
    // console.log(obj)
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

                features: { $push: { featureName: "$featureName.featureName", "requirementName": "$requirement.requirementName" } }
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

                features: { $push: { featureName: "$featureName.featureName", "requirementName": "$requirement.requirementName" } }
            },


        }
        ];




        let allModules = null;


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
            console.log("getObj              getObjgetObjgetObj")
            let unique = doc.features.filter((thing, index, self) => index === self.findIndex((t) => t.featureName === thing.featureName));
            unique.map(e => (e.children = [], e.label = e.featureName, e.data = "feature", e.expandedIcon = "fa fa-folder-open", e.collapsedIcon = "fa fa-folder"));
            doc.features.map((feature) => unique[unique.map(e => e.featureName).indexOf(feature.featureName)].children.push({ "label": feature.requirementName, "icon": "fa fa-file-word-o", "data": "script" }));
            doc.features.map((feature) => delete feature.requirementName)
            doc['children'] = unique;
            doc['label'] = doc._id;
            doc['data'] = "module";
            doc["expandedIcon"] = "fa fa-folder-open";
            doc["collapsedIcon"] = "fa fa-folder";
            delete doc._id;
            delete doc.features;
            return doc;
        }


        function duplicateCall(features, index) {
            console.log("duplicateCall ")
            //   console.log(data.map(e => e.label).indexOf(moduleId))
            console.log(features)
            console.log(index)
            console.log(data)
            features.forEach((e) => {
                let obj = {
                    children: [],
                    label: e.featureName,
                    data: 'feature',
                    expandedIcon: "fa fa-folder-open",
                    collapsedIcon: "fa fa-folder"
                }
                data[index].children.push(obj)
            });



        }

        function pushCall(modules) {
            console.log("pushcall ")

            console.log(modules._id)
            data.push({
                "label": modules._id, 'data': 'module', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children':

                    modules.features.filter((e) => (e.children = [], e.label = e.featureName, e.data = "feature", e.expandedIcon = "fa fa-folder-open", e.collapsedIcon = "fa fa-folder"))
            })
        }


        let data = null;



        function checkCall() {
            console.log("checkCall         checkCallcheckCallcheckCall")
            let bb = modulesPlusFeature.map((modules, index) => -1 !== (data.findIndex((dataModule) => dataModule.label === modules._id)) ?

                duplicateCall(modules.features, data.map(e => e.label).indexOf(modules._id)) : pushCall(modules))
            res.json(data);
        }

        async.eachSeries([
            data = doc.map((doc) => getObj(doc)),
            onlyModules.map((modules) => data.push({ "label": modules.moduleName, 'data': 'module', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children': [] })),
            checkCall()

        ],
            function (item, cb) {

                return cb();


            },
            function (err) {

                //   console.log( err);
            });



    }

    dbCall(req.body.projectNew)
    //////////// Aug-08(comment condition because we are facing projectAccess(not present in database) and userRoles problem like LEAD,MANAGER etc)//////////

    //   if (req.body.roleName == "platformAdmin" || req.body.roleName == "organization Admin" ||  (req.body.roleName == "Lead")) {
    //     db.moduleName.find({ "projectId": req.body.projectNew }, function (err, doc) {


    //         res.json(doc);
    //     })
    //     }
    //     else {


    //        elseForModule(req.body);


    //   }
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
}
///////////////////////////// Tree structure code Ends /////////////////////////////////

async function showModuleWiseData(req, res) {

    console.log("moduledataaaaaaaaa", req.query.moduleData)
    db.moduleName.find({ "moduleName": req.query.moduleData }, function (err, doc) {
        if (err) {
            throw err
        }
        else {
            res.json(doc);
        }
    })
}


async function showFeatureWise(req, res) {
    console.log("festuresssssssssssssssssss")
    console.log("features", req.query.feaId)
    db.featureName.find({ "featureName": req.query.feaId }, function (err, doc) {
        if (err) {
            throw err
        }
        else {
            res.json(doc);
        }
    })
}

async function getRequirementDetails(req, res) {

    console.log("ssssssssssssssssssssssssssssssssssssssssssssssss", req.query)
    console.log("ssssssssssssssssssssssssssssssssssssssssssssssss", req.query)
    //   var data_Array = req.params.featureData
    //   console.log("ttooooooooooo", data_Array);
    console
    var projectId = req.query.proId
    console.log(projectId)
    var moduleId = req.query.modId
    var featureId = req.query.freId
    //   console.log("madhuuuuuuuuuuuuuuuuuuuu", moduleId, featureId)

    const keyvalue = ['projectId', "moduleId", 'featureId']
    dataObj = {};
    var count = 0;
    if (featureId !== undefined) {
        console.log("lengthhhhhhhhhhhhhhhhhhhhhhhhh", keyvalue.length)
        for (var i = 0; i < 3; i++) {
            console.log(keyvalue.length)
            if (featureId !== "All") {
                dataObj[keyvalue[i]] = featureId;
            }
        }
        dataObj['moduleId'] = moduleId
    }
    else if (moduleId !== undefined) {
        for (var i = 0; i < 2; i++) {
            console.log(keyvalue.length)
            if (moduleId !== "All") {
                dataObj[keyvalue[i]] = moduleId;
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
        // console.log("iddddddddddddddddddddddddddddddddddddddddddddd", id)
        // db.testScript.find({"requirementId" :id}).count() {"requirementId" : "rID397"},{ "scriptName" :1,_id:0}


        return new Promise((resolves, reject) => {
            db.testScript.find({ "requirementId": id }, { "scriptName": 1, _id: 0 }, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("   result    resulttt    result    resulttt    ")
                    // console.log(result);
                    resolves(result);
                }
            });
        })
    }

    db.projectSelection.find({ "projectId": projectId }, function (err, projectDetails) {
        console.log("paiaiaiaaaaaaaaaaa", projectId)
        dataObj["projectId"] = projectId;
        db.requirement.find(dataObj, function (err, requirement) {
            var newArray = [];
            if (requirement.length == 0) {
                // console.log("rerrrrrrrrrrreeeeeee")
                console.log("serached result is  0 ")
                res.json(newArray);
            }

            requirement.forEach(async function (testScriptDetail) {
                console.log("ddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", testScriptDetail)
                testScriptDetail.scripts = await getCount(testScriptDetail.requirementId);
                console.log("padmaaaaaaaaaaaaaaaaaaaaaaaaaaaa", testScriptDetail.scripts)
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
}

async function displayAllModuleData(req, res) {
    console.log("getallmodulesdataaaaaaa", req.query.proId);
    let obj = [
        { $match: { "projectId": req.query.proId } },
        {
            $lookup:
            {
                from: "featureName",
                localField: "moduleId",
                foreignField: "moduleId",
                as: "featureData"
            }
        },
        { $unwind: "$featureData" },
        { $project: { "moduleName": 1, "moduleId": 1, "featureData.featureName": 1, "featureData.featureId": 1 } },
        {
            $lookup:
            {
                from: "requirement",
                localField: "featureData.featureId",
                foreignField: "featureId",
                as: "testcaseData"
            }
        },
        { $unwind: "$testcaseData" },
        {
            $project: {
                "moduleName": 1, "moduleId": 1, "featureData.featureName": 1, "featureData.featureId": 1,
                "testcaseData.requirementName": 1, "testcaseData.requirementId": 1
            }
        },
        {
            $lookup:
            {
                from: "testScript",
                localField: "testcaseData.requirementId",
                foreignField: "requirementId",
                as: "scripts"
            }
        },
        {
            $project: {
                _id: 0, "moduleName": 1, "moduleId": 1, "featureData.featureName": 1, "featureData.featureId": 1,
                "testcaseData.requirementName": 1, "testcaseData.requirementId": 1, "scripts.scriptName": 1, testcaseCount: { $size: "$scripts" }
            }
        }

    ]
    let result = await dbServer.aggregate(db.moduleName, obj)
    if (result != null) {

        res.json(result);

    } else {
        res.json(result);
    }

}
module.exports = {
    getAllTreeStructuteData: getAllTreeStructuteData,
    showModuleWiseData: showModuleWiseData,
    showFeatureWise: showFeatureWise,
    getRequirementDetails: getRequirementDetails,
    displayAllModuleData: displayAllModuleData
};