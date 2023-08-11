const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var fs = require('fs');
var fsCopy = require('fs-extra');
var path = require("path");
var mkdirp = require('mkdirp');
const editJsonFile = require("edit-json-file");
var cmd = require('child_process');
var LineReader = require('line-by-line');
const fse = require('fs-extra');
const exec = require('child_process');
const readline = require('readline');
const Email = require('./mailIntegrationService');
const emailObj = new Email();
const treeStructureCall = require('./treeStructureData');
var rimraf = require("rimraf");
const { response } = require('express');
var async = require("async");
// const { sys } = require('typescript');
// const { cosh } = require('core-js/fn/number');
// const { forEach } = require('core-js/fn/array');
// const { promise } = require('protractor');
// const { resolve, reject } = require('bluebird');
// const Influx = require('influx');
var LineByLineReader = require('line-by-line');
const xml2js = require("xml2js");



async function getModulesToDisplay(req, res) {
    console.log(req.query.projectId);

    function aggregateCall(collection, obj) {
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
        { $unwind: "$featureName" },
        {
            "$lookup":
            {
                "from": "jmxFiles",
                "localField": "featureName.featureId",
                "foreignField": "featureId",
                "as": "jmxFiles"
            }
        },

        {
            $match: {
                "jmxFiles.featureId": { "$exists": false }

            }
        },
        {
            $group: {
                _id: "$moduleName",

                features: { $push: { featureName: "$featureName.featureName", "jmxFileName": "$jmxFiles.jmxFileName", "jmxFileId": "$jmxFiles.jmxFileId", featureId: "$featureName.featureId", moduleId: "$featureName.moduleId" } }
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
                "from": "jmxFiles",
                "localField": "featureName.featureId",
                "foreignField": "featureId",
                "as": "jmxFiles"
            }
        },
        { $unwind: "$jmxFiles" },
        {
            $group: {
                _id: "$moduleName",

                features: { $push: { featureName: "$featureName.featureName", "jmxFileName": "$jmxFiles.jmxFileName", "jmxFileId": "$jmxFiles.jmxFileId", "moduleId": "$jmxFiles.moduleId", "featureId": "$jmxFiles.featureId", "status": "$jmxFiles.status" } }
            },
        }
        ];
        let onlyModules = await aggregateCall(db.moduleName, agg);
        let modulesPlusFeature = await aggregateCall(db.moduleName, agg2);
        let doc = await aggregateCall(db.moduleName, agg3);
        console.log("REsult", onlyModules, modulesPlusFeature, doc)
        function getObj(doc) {
            let unique = doc.features.filter((thing, index, self) => index === self.findIndex((t) => t.featureName === thing.featureName));
            unique.map(e => (e.children = [], e.label = e.featureName, e.key=e.featureName, e.data = "feature", e.expandedIcon = "fa fa-folder-open", e.collapsedIcon = "fa fa-folder"));
            doc.features.map((feature) => unique[unique.map(e => e.featureName).indexOf(feature.featureName)].children.push({ "label": feature.jmxFileName, "key":feature.jmxFileName, "jmxFileId": feature.jmxFileId, "moduleId": feature.moduleId, "featureId": feature.featureId, "status": feature.status, "icon": "fa fa-file-word-o", "data": "script" }));
            doc.features.map((feature) => delete feature.jmxFileName)
            doc.features.map((feature) => delete feature.status)
            doc['children'] = unique;
            doc['label'] = doc._id;
            doc['data'] = "module";
            doc['key']= doc._id;
            doc["expandedIcon"] = "fa fa-folder-open";
            doc["collapsedIcon"] = "fa fa-folder";
            doc['moduleId'] = doc.features[0].moduleId;
            delete doc._id;
            delete doc.features;
            return doc;
        }


        function duplicateCall(features, index) {
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
            console.log(modules._id)
            data.push({
                "label": modules._id, 'data': 'module', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children':
                    modules.features.filter((e) => (e.children = [], e.label = e.featureName, e.data = "feature", e.expandedIcon = "fa fa-folder-open", e.collapsedIcon = "fa fa-folder"))
            })
        }
        let data = null;

        function checkCall() {

            res.json(data);
        }

        async.eachSeries([
            data = doc.map((doc) => getObj(doc)),
            checkCall()

        ],
            function (item, cb) {
                return cb();
            },
            function (err) {
            });
    }

    dbCall(req.query.projectId)
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
            allModules.push(doc[0].projectAccess[i].modlues[j].moduleId);
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

async function checkForDuplicate(req, res) {
    console.log(req.body)
    db.jmxFiles.find({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
        (err, doc) => {
            console.log(doc);
            if (err) console.log(err);
            if (doc.length !== 0) {
                res.json("Duplicate  Are Not Allowed")
            }
            else {
                res.json("success")
            }
        })
}

async function getJmxData(req, res) {
    console.log(req.query)
    db.jmxFiles.find({ "projectId": req.query.projectId, "jmxFileId": req.query.jmxFileId, "moduleId": req.query.moduleId, "featureId": req.query.featureId },
        (err, doc) => {
            console.log(doc);
            if (err) console.log(err);
            res.json(doc)
        })
}

async function jsonConversionAndValidate(req, res) {
    console.log("starts jsonConversionAndValidate")
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
    var responsedata1 = await jmxTojson(req)
    console.log(responsedata1)
    var responsedata2 = await checkFile(req)
    console.log(responsedata2)
    res.json(responsedata2)
}

async function checkFile(req) {
    return new Promise((resolve, reject) => {
        var convertedJson = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}/trail_test/${req.body.jmxFileName}.json`)
        fs.readFile(convertedJson, 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);
            if(obj.jmeterTestPlan.hashTree.hashTree.length!=undefined){
                resolve("SavedTool");
            }else if(obj.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.elementProp==undefined){
                resolve("SavedTool");
            }else{
                resolve("Not SavedTool")
            }
        })
    })
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

    var actual = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}/actual_test`)
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
    var responsedata1 = await jmxTojson(req)
    console.log(responsedata1)
    var responsedata2 = await updateDb(req)
    console.log(responsedata2)
    res.json(responsedata2)


}

async function copyActual(req) {
    return new Promise((resolve, reject) => {
        [".jmx"].forEach((value) => {
            fse.copy(`./uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}/trail_test/${req.body.jmxFileName}.jmx`,
                `./uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}/actual_test/${req.body.jmxFileName}.jmx`, (err) => {
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
        var source = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}/trail_test/${req.body.jmxFileName}.jmx`)
        var destination = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}/trail_test/${req.body.jmxFileName}.json`)
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
        var convertedJson = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}/trail_test/${req.body.jmxFileName}.json`)
        fs.readFile(convertedJson, 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);
            // if(obj.jmeterTestPlan.hashTree.hashTree.length!=undefined){
            //     resolve("SavedTool");
            // }else if(obj.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.elementProp==undefined){
            //     resolve("SavedTool");
            // }else{

            // console.log(obj.jmeterTestPlan.hashTree.hashTree.length)
            // console.log(obj.jmeterTestPlan.hashTree.hashTree.hashTree[13]['#item'].ThreadGroup.elementProp)
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
            if (element.length == undefined) {
                var elementpro = [
                    element
                ]
                obj.jmeterTestPlan.hashTree.hashTree.hashTree[1]['#item'].Arguments.collectionProp.elementProp = elementpro
            }

            var element1 = obj.jmeterTestPlan.hashTree.hashTree.HeaderManager.collectionProp.elementProp
            if (element1.length == undefined) {
                var elementpro = [
                    element1
                ]
                obj.jmeterTestPlan.hashTree.hashTree.HeaderManager.collectionProp.elementProp = elementpro
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

            db.countInc.find({}, async function (err, doc) {
                // console.log("count",doc) 
                jCount = doc[0].jCount;
                jCount++;
                jID = doc[0].jmxFileID;
                var jmeterTestcaseId = jID + jCount;
                console.log(jmeterTestcaseId)

                db.jmxFiles.insert({
                    "moduleId": req.body.moduleId,
                    "projectId": req.body.projectId,
                    "featureId": req.body.featureId,
                    "jmxFileName": req.body.jmxFileName,
                    "jmxFileId": jmeterTestcaseId,
                    "features": obj,
                    "status": "PASS",
                    "CSVFileName": [],
                    "Listener": "notcreated",
                    "ResultTree": []
                },
                    function (err, scr) {
                        if (err) {
                            throw err;
                        }
                        else {
                            db.countInc.update({ "projectID": "pID" }, { $set: { "jCount": jCount } }, (err, doc) => {
                                if (err) throw err;
                                resolve("updated")
                            })
                        }
                    })
            })

        })

    })
}


async function jmxConversion(req, res) {
    console.log("starts jmxConversion")
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
    var responseData1 = await updateDocument(req)
    console.log(responseData1)
    var responseData2 = await updateFile(req)
    console.log(responseData2)
    var responseData3 = await jsonTojmx(req)
    console.log(responseData3)
    res.json([{ "jsonTojmx": responseData3 }])
    console.log("end jmxConversion")
}

async function updateFile(req) {
    return new Promise((resolve, reject) => {
        console.log("starts updateFile")
        var data = JSON.stringify(req.body.features)
        var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}.json`)
        console.log(file);
        var wstream = fs.createWriteStream(file);
        wstream.on('finish', function () {
            console.log(`json file writing finished  ${file}`);
        });
        wstream.write(data);
        wstream.end(function () {
            console.log(`done writing  ${file} `);
            resolve("updateFile success")
        });
    })
}

async function jsonTojmx(req) {
    return new Promise((resolve, reject) => {
        console.log("starts jsonTojmx")
        var projectPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject`)
        var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/${req.body.userName}/jsonTojmx.bat`)
        console.log(file, "\n jsonTojmx conversion")
        var source = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}.json`)
        var destination = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}.jmx`)
        var wstream = fs.createWriteStream(file);
        wstream.on('finish', function () {
            console.log(`converting batch file finished writing   ${file}`);
        });
        wstream.write('@echo off\n');
        wstream.write(`cd ${projectPath}  &&  mvn exec:java -Dexec.mainClass=reuseablePackage.feature.jsonTojmx -Dexec.args="'${source}' '${destination}'" `);
        wstream.end(function () {
            console.log(`done writing  ${file} `);
            console.log(`createdfile and executing cmd ${file} `)
            cmd.exec(file, (error, stdout, stderr) => {
                try {
                    if (error != null) {
                        throw error;
                    } else {
                        if (fs.existsSync(destination)) {
                            console.log(`${req.body.jmxFileName}.jmx file created`);
                            var result = 'Pass';
                            resolve(result);
                        } else {
                            var result = 'Fail';
                            console.log("error " + error);
                            resolve(result);
                            console.log(`${req.body.jmxFileName}.jmx file is not present still`)
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

async function updateDocument(req) {
    return new Promise((resolve, reject) => {
        if (req.body.resultTree) {
            db.jmxFiles.find({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
                function (err, doc) {
                    if (doc[0].Listener == 'notcreated') {
                        db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
                            {
                                $set: {
                                    'Listener': 'created'
                                }
                            })
                    }
                })
        }
        else {
            db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
                {
                    $set: {
                        'Listener': 'notcreated'
                    }
                })
        }
        db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
            {
                $set: {
                    'features': req.body.features, "CSVFileName": req.body.csvFileNames
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
}

async function checkForCSVDuplicate(req, res) {
    console.log(req.body)
    db.jmxFiles.find({ "projectId": req.body.projectId, "CSVFileName": req.body.CSVFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId, "jmxFileName": req.body.jmxFileName },
        (err, doc) => {
            console.log(doc);
            if (err) console.log(err);
            if (doc.length !== 0) {
                res.json("Duplicate  Are Not Allowed")
            }
            else {
                res.json("success")
            }
        })
}

async function deleteCSVFile(req, res) {
    console.log(req.body)
    var dbCSVDelete = await deleteCSVFileName(req)
    var deleteCSVFile = await deleteCSVFiles(req)
    res.json(deleteCSVFile)

}

function deleteCSVFileName(req) {
    return new Promise((resolve, reject) => {
        db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
            {
                $pull: {
                    "CSVFileName": req.body.CSVFileName.trim()
                }
            },
            function (err, doc) {
                console.log("deleteCSVFileName")
                resolve("deleted")
            })
    })

}

function deleteCSVFiles(req) {
    return new Promise((resolve, reject) => {
        var finalPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}/csv/${req.body.CSVFileName}.csv`);
        console.log(finalPath);
        // var finalPathname = path.join(finalPath, tescaseName);
        // console.log(finalPathname);

        rimraf(finalPath, function (err) {
            if (err) {
                throw err
            } else {
                console.log("Successfully deleted the CSV file!!")
                resolve("Successfully deleted the CSV file!!")
            }
        })

    })

}

async function copyScriptsToMaster(req, res) {
    console.log("BBBBBBB", req.body)
    var orgNum = Number(req.body.orgId);

    let userVal = await dbServer.findCondition(db.loginDetails, { _id: mongojs.ObjectId(req.body.userId) })
    let orgVal = await dbServer.findCondition(db.licenseDocker, { "machineType": "jmeterUsersMachine", "orgId": orgNum })

    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trailJmeter.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test`)
    var copyFile = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test/${req.body.scriptId}.jmx`)
    console.log(file)
    console.log(folderPath)
    console.log(copyFile)
    var master = userVal[0].masterName
    var machineName = orgVal[0].machineName
    console.log("maaaaaaaaaa", master)
    console.log(machineName)
    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
    mvnFileCreation.write("cd " + folderPath + " && docker cp " + copyFile + " " + master + ":/jmeter/apache-jmeter-3.3/bin/" + req.body.scriptId + ".jmx")
    mvnFileCreation.end(function () {
        cmd.exec(file, (err, stdout, stderr) => {
            console.log(" MVN batch file executing " + "\n\n");
            try {

                if (err != null) {
                    throw err;
                } else {
                    batchResult = "Pass";
                    res.json(batchResult)
                }

            } catch (err) {
                console.log("Error", err);
                batchResult = "Fail";
                res.json(batchResult)
            }
        })
    })
}

async function trailCallExecution(req, res) {
    console.log("JJJJJJJJJ", req.body)
    var orgNum = Number(req.body.orgId);

    let userVal = await dbServer.findCondition(db.loginDetails, { _id: mongojs.ObjectId(req.body.userId) })
    let orgVal = await dbServer.findCondition(db.licenseDocker, { "machineType": "jmeterUsersMachine", "orgId": orgNum })

    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trailJmeterExec.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test`)
    var master = userVal[0].masterName
    var machineName = orgVal[0].machineName
    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
    mvnFileCreation.write("cd " + folderPath + " && docker exec " + master + " jmeter -n -t /jmeter/apache-jmeter-3.3/bin/" + req.body.scriptId + ".jmx" + " -l /jmeter/apache-jmeter-3.3/bin/" + req.body.scriptId + ".csv")
    mvnFileCreation.end(function () {
        cmd.exec(file, (err, stdout, stderr) => {
            console.log(" MVN batch file executingjjjjjjj " + "\n\n");
            try {

                if (err != null) {
                    throw err;
                } else {
                    batchResult = "Pass";
                    res.json(batchResult)
                }

            } catch (err) {
                console.log("Error", err);
                batchResult = "Fail";
                res.json(batchResult)
            }
        })
    })
}

async function copyResultsToLocal(req, res) {

    var orgNum = Number(req.body.orgId);

    let userVal = await dbServer.findCondition(db.loginDetails, { _id: mongojs.ObjectId(req.body.userId) })
    let orgVal = await dbServer.findCondition(db.licenseDocker, { "machineType": "jmeterUsersMachine", "orgId": orgNum })

    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trailJmetercopy.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test`)
    var copyFile = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test/${req.body.scriptId}.csv`)

    console.log(file)
    console.log(folderPath)
    console.log(copyFile)
    var master = userVal[0].masterName
    var machineName = orgVal[0].machineName
    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
    //docker cp master:/jmeter/apache-jmeter-3.3/bin/simple.csv D:/simple.csv
    mvnFileCreation.write("cd " + folderPath + " && docker cp " + master + ":/jmeter/apache-jmeter-3.3/bin/" + req.body.scriptId + ".csv ./" + req.body.scriptId + ".csv")
    mvnFileCreation.end(function () {
        cmd.exec(file, (err, stdout, stderr) => {
            console.log(" MVN batch file executing " + "\n\n");
            try {

                if (err != null) {
                    throw err;
                } else {
                    batchResult = "Pass";
                    res.json(batchResult)
                }

            } catch (err) {
                console.log("Error", err);
                batchResult = "Fail";
                res.json(batchResult)
            }
        })
    })
}

async function deleteInDocker(req, res) {
    var orgNum = Number(req.body.orgId);

    let userVal = await dbServer.findCondition(db.loginDetails, { _id: mongojs.ObjectId(req.body.userId) })
    let orgVal = await dbServer.findCondition(db.licenseDocker, { "machineType": "jmeterUsersMachine", "orgId": orgNum })

    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trailDelete.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test`)
    var copyFile = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}/trail_test/${req.body.scriptId}.csv`)

    console.log(file)
    console.log(folderPath)
    console.log(copyFile)
    //docker exec master rm -rf /jmeter/apache-jmeter-3.3/bin/resultfolser /jmeter/apache-jmeter-3.3/bin/testth.csv
    var master = userVal[0].masterName
    var machineName = orgVal[0].machineName
    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
    //docker cp master:/jmeter/apache-jmeter-3.3/bin/simple.csv D:/simple.csv

    mvnFileCreation.write("cd " + folderPath + " && docker exec " + master + " rm -rf /jmeter/apache-jmeter-3.3/bin/" + req.body.scriptId + ".jmx" + " /jmeter/apache-jmeter-3.3/bin/" + req.body.scriptId + ".csv")

    mvnFileCreation.end(function () {
        cmd.exec(file, (err, stdout, stderr) => {
            console.log(" MVN batch file executing " + "\n\n");
            try {

                if (err != null) {
                    throw err;
                } else {
                    batchResult = "Pass";
                    res.json(batchResult)
                }

            } catch (err) {
                console.log("Error", err);
                batchResult = "Fail";
                res.json(batchResult)
            }
        })
    })
}

async function convertCsvToJson(req, res) {
    var resultData = []
    var resultFIle = "../../uploads/opal/" + req.body.projectName + "/MainProject/jmxFiles/" + req.body.moduleId + "/" + req.body.featureId + "/" + req.body.scriptId + "/trail_test/" + req.body.scriptId + ".csv"
    resultFIlePath = path.join(__dirname, resultFIle);
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile(resultFIlePath);
    var sheet_name_list = workbook.SheetNames;
    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var totalData = data
    var statusData = true
    for (i = 0; i < totalData.length; i++) {
        if (totalData[i].success == "false") {
            resultData[i] = {
                status: "FAIL",
                label: totalData[i].label,
                response: totalData[i].responseMessage
            }
            statusData = false;
        }
        else {
            resultData[i] = {
                status: "PASS",
                label: totalData[i].label,
                response: totalData[i].responseMessage
            }
        }
        if (i == totalData.length - 1) {
            if (statusData == false) {
                testStatus = "FAIL"
            }
            else {
                testStatus = "PASS"
            }
            if (req.body.uploadedJMX == true) {
                let result = {
                    "status": testStatus,
                    "resultData": resultData
                }
                res.json(result)
            }
            else {
                db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
                    {
                        $set:
                        {
                            "status": testStatus
                        }
                    }, function (err, doc1) {
                        if (err) console.log(err)
                        console.log("Status updated");
                        db.testScript.update({ "projectId": req.body.projectId, "scriptName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId, "scriptId": req.body.scriptId },
                            {
                                $set: {
                                    "status": testStatus
                                }
                            }, function (err, doc2) {
                                if (err) console.log(err)
                                console.log("TEstScript Updated")
                                res.json(resultData)
                            })
                    })
            }

        }
    }
}

async function execMasterDetails(req, res) {
    var orgId = Number(req.query.orgId)
    var userName = req.query.userName
    var type = req.query.type
    console.log("userName")
    console.log(orgId)
    console.log(userName)
    console.log(type)
    console.log("userName")
    db.licenseDocker.aggregate([
        { $match: { "machineType": "jmeterExecutionMachine", "orgId": orgId, } },
        { $unwind: "$jmeterData" },
        // { $match: { "jmeterData.type" : "master", "orgId": orgId, } },
        // { $unwind: "$jmeterData.masters" },
        { $match: { "jmeterData.state": 'Running', "jmeterData.type": type } },
        {
            $project: {
                _id: 0, "name": "$jmeterData.name",
                "ipAddress": "$jmeterData.ipAddress",
                "type": "$jmeterData.type",
                "status": "$jmeterData.status",
                "state": "$jmeterData.state",
                "userName": "$jmeterData.userName",
                "machineName": "$machineName"
            }
        }], function (err, doc) {
            console.log(doc, "MASTTTTTTTTTTTTTTTTTTTTDDDDDDDDDDD")
            res.json(doc)
        })
}

async function execSlaveDetails(req, res) {
    var orgId = Number(req.query.orgId)
    var userName = req.query.userName
    var type = req.query.type
    console.log("userName")
    console.log(orgId)
    console.log(userName)
    console.log(type)
    console.log("userName")
    db.licenseDocker.aggregate([
        { $match: { "machineType": "jmeterExecutionMachine", "orgId": orgId, } },
        { $unwind: "$jmeterData" },
        //{ $unwind: "$jmeterData.slaves" },
        { $match: { "jmeterData.state": 'Running', "jmeterData.type": type } },
        {
            $project: {
                _id: 0, "name": "$jmeterData.name",
                "ipAddress": "$jmeterData.ipAddress",
                "type": "$jmeterData.type",
                "status": "$jmeterData.status",
                "state": "$jmeterData.state",
                "userName": "$jmeterData.userName",
                "machineName": "$machineName"
            }
        }], function (err, doc) {
            console.log(doc, "MASTTTTTTTTTTTTTTTTTTTT")
            res.json(doc)
        })
}

async function checkDockerStatus(req, res) {
    var orgId = Number(req.query.orgId)
    db.licenseDocker.find({ "orgId": orgId, "machineType": "jmeterExecutionMachine" },
        function (err, doc) {
            console.log(doc)
            res.json(doc)
        })
}

async function changeToRunningStatus(req, res) {

    var orgId = Number(req.body.orgId)
    var dataMaster = req.body.masterDetails
    db.licenseDocker.update(
        { "orgId": orgId, "machineType": "jmeterExecutionMachine", "jmeterData.type": "master" },
        {
            $set: {
                "jmeterData.$[j].status": "Running"
            }
        },
        {
            arrayFilters: [
                {
                    "j.name": dataMaster.name
                }
            ]
        },
        function (err, doc) {
            console.log(doc)
            console.log(err)
            res.json("updated")

        }
    )
    req.body.slaveDetails.forEach(element => {
        db.licenseDocker.update(
            { "orgId": orgId, "machineType": "jmeterExecutionMachine", "jmeterData.type": "slave" },
            {
                $set: {
                    "jmeterData.$[j].status": "Running"
                }
            },
            {
                arrayFilters: [
                    {
                        "j.name": element.name
                    }
                ]
            },
            function (err, doc) {
                console.log(doc)
                console.log(err)

            }
        )
    })
}

async function changeToBlockedStatus(req, res) {
    var dataMaster = req.body.masterDetails
    var orgId = Number(req.body.orgId)

    db.licenseDocker.update(
        { "orgId": orgId, "machineType": "jmeterExecutionMachine", "jmeterData.type": "master" },
        {
            $set: {
                "jmeterData.$[j].status": "Blocked"
            }
        },
        {
            arrayFilters: [
                {
                    "j.name": dataMaster.name
                }
            ]
        },
        function (err, doc) {
            console.log(doc)
            console.log(err)
            res.json("updated")

        }
    )
    req.body.slaveDetails.forEach(element => {
        db.licenseDocker.update(
            { "orgId": orgId, "machineType": "jmeterExecutionMachine", "jmeterData.type": "slave" },
            {
                $set: {
                    "jmeterData.$[j].status": "Blocked"
                }
            },
            {
                arrayFilters: [
                    {
                        "j.name": element.name
                    }
                ]
            },
            function (err, doc) {
                console.log(doc)
                console.log(err)

            }
        )
    })
}

async function copyScriptsToExecutionMaster(req, res) {

    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actualJmeter.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test`)
    var copyFile = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}.jmx`)


    console.log(file)
    console.log(folderPath)
    console.log(copyFile)
    var master = req.body.masterDetails.name
    var machineName = req.body.masterDetails.machineName
    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
    mvnFileCreation.write("cd " + folderPath + " && docker cp " + copyFile + " " + master + ":/jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".jmx")
    mvnFileCreation.end(function () {
        cmd.exec(file, (err, stdout, stderr) => {
            console.log(" MVN batch file executing " + "\n\n");
            try {

                if (err != null) {
                    throw err;
                } else {
                    db.jmxFiles.find({ "jmxFileId": req.body.jmxFileId },
                        async function (err, doc) {
                            if (await doc[0].CSVFileName.length !== 0) {
                                let result = await copyCSVFolder(req, res)
                            }
                            else {
                                batchResult = "Pass";
                                res.json(batchResult)
                            }
                        })
                }

            } catch (err) {
                console.log("Error", err);
                batchResult = "Fail";
                res.json(batchResult)
            }
        })
    })
}

async function copyCSVFolder(req, res) {

    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actualJmeter.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}`)
    var copyFolder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/csv`)

    console.log(file)
    console.log(folderPath)
    console.log(copyFolder)
    //var slave = req.body.slaveDetails[0].name
    var machineName = req.body.masterDetails.machineName
    for (let k = 0; k <= req.body.slaveDetails.length - 1; k++) {
        let data = `@echo off\n
        @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n
        cd ${folderPath} && docker cp ${copyFolder} ${req.body.slaveDetails[k].name}:/jmeter/apache-jmeter-3.3/bin/`
        var result = await createAndExecute(file, data, req.body.slaveDetails.length - 1, k, res);
        console.log(result)
    }
    // var mvnFileCreation = fs.createWriteStream(file);
    // mvnFileCreation.write("@echo off\n")
    // mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
    // mvnFileCreation.write("cd " + folderPath + " && docker cp " + copyFolder + " " + slave + ":/jmeter/apache-jmeter-3.3/bin/")
    // mvnFileCreation.end(function () {
    //     cmd.exec(file, (err, stdout, stderr) => {
    //         console.log(" MVN batch file executingggg " + "\n\n");
    //         try {

    //             if (err != null) {
    //                 throw err;
    //             } else {
    //                 res.json("Pass")
    //             }

    //         } catch (err) {
    //             res.json("Fail")
    //         }
    //     })
    // })
}

function createAndExecute(filePath, data, arrayLength, k, res) {
    return new Promise((resolves, reject) => {
        var writerStream = fs.createWriteStream(filePath, { flags: 'w+' })
            .on('finish', function () {
                console.log("got the file");
            })
            .on('error', function (err) {
                +
                    console.log(err.stack);
            });


        writerStream.write(data, function () {
            // Now the data has been written.
            console.log("Write completed.");
        })
        writerStream.end(() => {
            cmd.exec(filePath, (err, stdout, stderr) => {
                try {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("\n\nCommand executed sucessfully\n\n")
                        if (arrayLength == k) {
                            res.json("Pass")
                        } else {
                            resolves("pass");
                        }
                        // resolves("pass");
                    }
                }
                catch (err) {
                    console.log("error occured", err)
                    if (arrayLength == k) {
                        res.json("Fail")
                    } else {
                        resolves("Fail");
                    }
                }
            })
        })
    })
}


async function callExecution(req, res) {
    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actualJmeterExec.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test`)
    var copyFile = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}.jmx`)
    var master = req.body.masterDetails.name
    var machineName = req.body.masterDetails.machineName
    console.log(req.body.slaveDetails)
    var slavearray = []
    var slaveData = req.body.slaveDetails
    for (var i = 0; i <= slaveData.length - 1; i++) {
        var slavearr = ''
        slavearr = slaveData[i].ipAddress
        slavearray.push(slavearr)
    }
    slavearray = slavearray.toString();

    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)                                                                                                                            //-e -o /jmeter/apache-jmeter-3.3/bin/resultfolser
    mvnFileCreation.write("cd " + folderPath + " && docker exec " + master + " jmeter -Jmode=Standard -n -t /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".jmx " + " -R" + slavearray + " > " + req.body.jmxFileId + ".txt" + " -l /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".csv" + " -e -o /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId)
    mvnFileCreation.end(function () {
        cmd.exec(file, (err, stdout, stderr) => {
            console.log(" MVN batch file executingjjjjjjj " + "\n\n");
            try {

                if (err != null) {
                    throw err;
                } else {
                    batchResult = "Pass";
                    res.json(batchResult)
                }

            } catch (err) {
                console.log("Error", err);
                batchResult = "Fail";
                res.json(batchResult)
            }
        })
    })
}

async function copyExecutionResultsToLocal(req, res) {


    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actualJmetercopy.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test`)
    var copyFile = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}.csv`)
    var responseData = await createJmxreportsfolder(req)
    console.log(responseData)

    console.log(file)
    console.log(folderPath)
    console.log(copyFile)
    var master = req.body.masterDetails.name
    var machineName = req.body.masterDetails.machineName
    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
    //docker cp master:/jmeter/apache-jmeter-3.3/bin/simple.csv D:/simple.csv
    mvnFileCreation.write("cd " + folderPath + " && docker cp " + master + ":/jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".csv ./" + req.body.jmxFileId + ".csv")
    mvnFileCreation.end(function () {
        cmd.exec(file, (err, stdout, stderr) => {
            console.log(" MVN batch file executing " + "\n\n");
            try {

                if (err != null) {
                    throw err;
                } else {
                    db.jmxFiles.find({ "jmxFileId": req.body.jmxFileId },
                        async function (err, doc) {
                            if (await doc[0].Listener !== 'notcreated') {
                                let result1 = await copyXmlFileToLocal(req);
                                if (result1 == 'Pass') {
                                    let result2 = await convertXmltoJson(req, res);
                                }
                                else {
                                    res.json("Pass")
                                }
                            }
                            else {
                                batchResult = "Pass";
                                res.json(batchResult)
                            }
                        })
                }

            } catch (err) {
                console.log("Error", err);
                batchResult = "Fail";
                res.json(batchResult)
            }
        })
    })
}

async function copyXmlFileToLocal(req) {
    return new Promise((resolve, reject) => {
        console.log("start copyXmlFileToLocal")
        var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actualJmetercopyXML.bat`)
        var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test`)
        console.log(file)
        console.log(folderPath)
        var master = req.body.masterDetails.name
        var machineName = req.body.masterDetails.machineName
        var mvnFileCreation = fs.createWriteStream(file);
        mvnFileCreation.write("@echo off\n")
        mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
        mvnFileCreation.write("cd " + folderPath + " && docker cp " + master + ":/jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".xml ./" + req.body.jmxFileId + ".xml")
        mvnFileCreation.end(function () {
            cmd.exec(file, (err, stdout, stderr) => {
                console.log("batch file executing " + "\n\n");
                try {
                    if (err != null) {
                        throw err;
                    } else {
                        batchResult = "Pass";
                        resolve(batchResult)
                    }
                    console.log("end copyXmlFileToLocal")
                } catch (err) {
                    console.log("Error", err);
                    batchResult = "Fail";
                    resolve(batchResult)
                }
            })
        })

    })
}

async function convertXmltoJson(req, res) {
    //  return new Promise((resolve, reject) => {
    console.log("starts convertXmltoJson")
    var projectPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject`)
    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/${req.body.userName}/convertXmltoJson.bat`)
    console.log(file, "\n convertXmltoJson conversion")
    var source = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}.xml`)
    var destination = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/viewResultTree.json`)
    var wstream = fs.createWriteStream(file);
    wstream.on('finish', function () {
        console.log(`converting batch file finished writing   ${file}`);
    });
    wstream.write('@echo off\n');
    wstream.write('set _JAVA_OPTIONS=-Xms1g -Xmx8g\n');
    wstream.write(`cd ${projectPath}  &&  mvn exec:java -Dexec.mainClass=reuseablePackage.feature.xmlTojsonConversion -Dexec.args="'${source}' '${destination}'" `);
    wstream.end(function () {
        console.log(`done writing  ${file} `);
        console.log(`createdfile and executing cmd ${file} `)
        cmd.exec(file, (error, stdout, stderr) => {
            console.log(stdout)
            try {
                if (error != null) {
                    throw error;
                } else {
                    if (fs.existsSync(destination)) {
                        console.log(`viewResultTree.json file available`);
                        db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId, "jmxFileId": req.body.jmxFileId },
                            {
                                $set:
                                {
                                    "Listener": "executed"
                                }
                            }, function (err, doc1) {
                                if (err) console.log(err)
                                console.log("jmxFiles updated..")
                                var result = 'Pass';
                                res.json(result);
                            })
                    } else {
                        var result = 'Fail';
                        console.log("error " + error);
                        res.json(result);
                        console.log(`viewResultTree.json file is not present still`)
                    }
                }
            }
            catch (error) {
                var result = 'Fail';
                console.log(" error  " + error);
                res.json(result);
            }
        });
    });
    //   })
}

async function readJsonFile(req, res) {
    db.jmxFiles.find({ "jmxFileId": req.body.jmxFileId },
        function (err, doc) {
            if (doc[0].Listener == 'executed') {
                var convertedJson = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/viewResultTree.json`)
                fs.readFile(convertedJson, 'utf8', function (err, data) {
                    try {
                        if (err != null) {
                            throw err;
                        } else {
                    var obj = JSON.parse(data);
                            var result = 'Pass';
                            res.json(obj);
                        }
                    }
                    catch (err) {
                        var result = 'Fail';
                        console.log(" error  " + err);
                        res.json(result);
                    }
                })
            }
            else {
                res.json(doc[0].Listener)
            }
        })
}

async function readTreeJsonFile(req, res) {
    console.log("readTreeJsonFile");
    var convertedJson = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}/actual_test/viewResultTree/${req.body.reportId}.json`)
    if (fs.existsSync(convertedJson)) {
        fs.readFile(convertedJson, 'utf8', function (err, data) {
            var obj = JSON.parse(data);
            try {
                if (err != null) {
                    throw err;
                } else {
                    var result = 'Pass';
                    res.json(obj);
                }
            }
            catch (err) {
                var result = 'Fail';
                console.log(" error  " + err);
                res.json(result);
            }
        })
    } else {
        var result = 'Fail';
        res.json(result);
        console.log(`${req.body.reportId}.json file is not present still`)
    }


}

async function createJmxreportsfolder(req) {
    return new Promise((resolve, reject) => {
        console.log("start createJmxreportsfolder")

        var date = new Date();
        //console.log("date"+date);
        var myDate = date.toISOString().split("T")[0];
        console.log("myDate" + myDate);
        var myTime = date.toLocaleString("en-IN").split(",")[1].replace(" ", "").replace(" ", "");
        // myTime = myTime.replace(":", ";").replace(":", ";");
        myTime = req.body.time.replace(":", ";").replace(" ", "");
        var jmxReportId = req.body.jmxFileName + "_" + myDate + "_" + myTime;
        console.log("myTime" + req.body.time);
        console.log(jmxReportId)
        var time = date.toLocaleString("en-IN").split(",")[1].replace(" ", "");
        console.log(time)
        var jmxReportFolder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${jmxReportId}`)
        console.log(jmxReportFolder);
        db.jmxReports.insert({
            "orgId": req.body.orgId,
            "moduleId": req.body.moduleId,
            "projectId": req.body.projectId,
            "featureId": req.body.featureId,
            "jmxFileName": req.body.jmxFileName,
            "jmxFileId": req.body.jmxFileId,
            "projectName": req.body.projectName,
            "moduleName": req.body.moduleName,
            "featureName": req.body.featureName,
            "jmxReportId": jmxReportId,
            "date": myDate,
            "time": req.body.time
        },
            function (err, scr) {
                if (err) {
                    throw err;
                }
                else {
                    db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
                        {
                            $set:
                            {
                                "jmxReportId": jmxReportId, "date": myDate, "time": req.body.time
                            }
                        }, function (err, doc1) {
                            if (err) console.log(err)
                            console.log("jmxReports inserted")
                        })

                }
            })
        if (fs.existsSync(jmxReportFolder)) {
            console.log("jmxReports  folder already exists");
        }
        else {
            console.log('jmxReports folder does not exist')
            fs.mkdir(jmxReportFolder, function (err) {
                console.log("jmxReports folder created");
                if (fs.existsSync(jmxReportFolder)) {
                    console.log("jmxReports  available");
                    resolve(jmxReportFolder)
                }
            })
        }
        // var time = date.toLocaleString("en-IN").split(",")[1].replace(" ", "");
        // console.log(time)
        console.log("end createJmxreportsfolder")
    })
}

async function copyExecutionHTMLResultsToLocal(req, res) {
    return new Promise((resolve, reject) => {

        var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actualJmetercopyHTML.bat`)
        var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test`)
        var copyFile = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}.csv`)

        var master = req.body.masterDetails.name
        var machineName = req.body.masterDetails.machineName
        var mvnFileCreation = fs.createWriteStream(file);
        mvnFileCreation.write("@echo off\n")
        mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
        mvnFileCreation.write(`docker cp ${master}:/jmeter/apache-jmeter-3.3/bin/${req.body.jmxFileId} ${folderPath}`)
        mvnFileCreation.end(function () {
            cmd.exec(file, (err, stdout, stderr) => {
                console.log(" MVN batch file executing copyExecutionHTMLResultsToLocal" + "\n\n");
                try {

                    if (err != null) {
                        throw err;
                    } else {
                        console.log("jmxReports inserted")
                        batchResult = "Pass";
                        resolve(batchResult)
                    }

                } catch (err) {
                    console.log("Error", err);
                    batchResult = "Fail";
                    resolve(batchResult)
                }
            })
        })
    })
}

async function deleteInDockerContainer(req, res) {

    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actualDelete.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test`)
    var copyFile = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}.csv`)


    console.log(file)
    console.log(folderPath)
    console.log(copyFile)
    var command = '';
    var master = req.body.masterDetails.name
    var machineName = req.body.masterDetails.machineName
    db.jmxFiles.find({ "jmxFileId": req.body.jmxFileId }, function (err, doc) {
        var mvnFileCreation = fs.createWriteStream(file);
        mvnFileCreation.write("@echo off\n")
        mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
        if (doc[0].Listener == 'executed') {
            command = "cd " + folderPath + " && docker exec " + master + " rm -rf /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".jmx" + " /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".csv" + " /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + " /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".xml";
            mvnFileCreation.write(command)

        }
        else {
            command = "cd " + folderPath + " && docker exec " + master + " rm -rf /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".jmx" + " /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId + ".csv" + " /jmeter/apache-jmeter-3.3/bin/" + req.body.jmxFileId;
            mvnFileCreation.write(command)
        }
        mvnFileCreation.end(function () {
            cmd.exec(file, (err, stdout, stderr) => {
                console.log(" MVN batch file executing " + "\n\n");
                try {

                    if (err != null) {
                        throw err;
                    } else {
                        db.jmxFiles.find({ "jmxFileId": req.body.jmxFileId },
                            async function (err, doc) {
                                if (await doc[0].CSVFileName.length !== 0) {
                                    let result = await deleteCSVFolder(req, res)
                                }
                                else {
                                    batchResult = "Pass";
                                    res.json(batchResult)
                                }
                            })
                    }

                } catch (err) {
                    console.log("Error", err);
                    batchResult = "Fail";
                    res.json(batchResult)
                }
            })
        })
    })
}

async function deleteCSVFolder(req, res) {

    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actualJmeter.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}`)

    console.log(file)
    console.log(folderPath)
    //var slave = req.body.slaveDetails[0].name
    var machineName = req.body.masterDetails.machineName
    for (let k = 0; k <= req.body.slaveDetails.length - 1; k++) {
        let data = `@echo off\n
        @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n
        cd ${folderPath} && docker exec ${req.body.slaveDetails[k].name} rm -rf /jmeter/apache-jmeter-3.3/bin/csv`
        var result = await createAndExecute(file, data, req.body.slaveDetails.length - 1, k, res);
    }
    // var mvnFileCreation = fs.createWriteStream(file);
    // mvnFileCreation.write("@echo off\n")
    // mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
    // mvnFileCreation.write("cd " + folderPath + " && docker exec " + slave + " rm -rf /jmeter/apache-jmeter-3.3/bin/csv")
    // mvnFileCreation.end(function () {
    //     cmd.exec(file, (err, stdout, stderr) => {
    //         console.log(" MVN batch file executingggg " + "\n\n");
    //         try {

    //             if (err != null) {
    //                 throw err;
    //             } else {
    //                 res.json("Pass")
    //             }

    //         } catch (err) {
    //             res.json("Fail")
    //         }
    //     })
    // })
}
async function checkHtml(req, res) {
    let promiseArr = [];
    var resultFIle = `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxReportId}/${req.body.jmxFileId}`
    resultFIlePath = path.join(__dirname, resultFIle)
    console.log(resultFIlePath)
    if (!fs.existsSync(resultFIlePath)) {
        res.json("FAIL")
    }
    else {
        var userNameFolder = '../../../UI/uploads/performanceResults/' + req.body.userName
        var userNameFolderPath = path.join(__dirname, userNameFolder)
        if (fs.existsSync(userNameFolderPath)) {
            console.log("userNameFolderPath  folder already exists");
        }
        else {
            console.log('userNameFolderPath folder does not exist')
            fs.mkdir(userNameFolderPath, function (err) {
                console.log("userNameFolderPath folder created");
            })
        }

        var scriptFolder = '../../../UI/uploads/performanceResults/' + req.body.userName + '/' + req.body.jmxFileId
        var scriptFolderPath = path.join(__dirname, scriptFolder)
        if (fs.existsSync(scriptFolderPath)) {
            console.log("scriptFolderPath  folder already exists");
        }
        else {
            console.log('scriptFolderPath folder does not exist')
            fs.mkdir(scriptFolderPath, function (err) {
                console.log("scriptFolderPath folder created");
            })
        }
        fs.readdirSync(resultFIlePath).forEach(file => {
            promiseArr.push(new Promise((resolve, reject) => {
                fse.copy(`./uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxReportId}/${req.body.jmxFileId}/${file}`, scriptFolderPath + "/" + file, function (err) {
                    if (err) {
                        console.log("ERRORRR:", err)
                        reject(err)
                        // return console.error(err)
                    } else {
                        resolve("Copy Completed")
                    }
                })
            }))
        })

        Promise.all(promiseArr).then((result) => {
            res.json("PASS");
        }).catch((err) => {
            res.json("FAIL")
        })
    }

}

async function deleteTrailFolder(req, res) {
    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}`)
    console.log(file)
    fse.remove(file, (err) => {
        try {
            if (err) {
                throw err;
            }
            else {
                console.log('trail folder deleted!')
                res.json("PASS")
            }
        }
        catch (err) {
            console.log('Error while remove' + err);
            res.json("FAIL")
        }
    })
}

function removeUserFolder(req, res) {
    var folder = path.join(__dirname, `../../../UI/uploads/performanceResults/${req.body.userName}`)
    fse.remove(folder, (err) => {
        try {
            if (err) {
                throw err;
            }
            else {
                console.log('user folder deleted!')
                res.json("PASS")
            }
        }
        catch (err) {
            console.log('Error while remove' + err);
            res.json("FAIL")
        }
    })
}


async function getjmxReportDetails(req, res) {
    console.log("getjmxReportDetails")
    var id = Number(req.query.orgId);
    //console.log(id, typeof (id))
    if (req.query.date == 'false') {
        db.jmxReports.aggregate([
            { $match: { "orgId": id, "projectId": req.query.projectId, "projectName": req.query.projectName, "jmxFileId": req.query.jmxFileId, "moduleId": req.query.moduleId, "featureId": req.query.featureId } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    _id: 1, "orgId": "$orgId",
                    "jmxFileName": "$jmxFileName",
                    "jmxReportId": "$jmxReportId",
                    "projectName": "$projectName",
                    "date": "$date",
                    "time": "$time",
                    "moduleName": "$moduleName",
                    "featureName": "$featureName",
                    "projectId": "$projectId",
                    "moduleId": "$moduleId",
                    "featureId": "$featureId",
                    "status": "$status"
                }
            }
        ],
            function (err, doc) {
                if (err) {
                    throw err;
                }
                else {
                    console.log("if jmxReports Details")
                    res.json(doc)
                }
            })
    }
    else {
        db.jmxReports.aggregate([
            { $match: { "orgId": id, "projectId": req.query.projectId, "projectName": req.query.projectName, "jmxFileId": req.query.jmxFileId, "moduleId": req.query.moduleId, "featureId": req.query.featureId, "date": req.query.date } },
            { $sort: { _id: -1 } },
            {
                $project: {
                    _id: 1, "orgId": "$orgId",
                    "jmxFileName": "$jmxFileName",
                    "jmxReportId": "$jmxReportId",
                    "projectName": "$projectName",
                    "date": "$date",
                    "time": "$time",
                    "moduleName": "$moduleName",
                    "featureName": "$featureName",
                    "projectId": "$projectId",
                    "moduleId": "$moduleId",
                    "featureId": "$featureId",
                    "status": "$status"
                }
            }
        ],
            function (err, doc) {
                if (err) {
                    throw err;
                }
                else {
                    console.log("else jmxReports Details")
                    res.json(doc)
                }
            })
    }

}

async function getViewReultDetails(req, res) {
    console.log("getViewReultDetails")
    // var id = Number(req.query.orgId);
    if (req.query.date == 'false') {
        db.jmxFiles.aggregate([
            { $match: { "projectId": req.query.projectId, "jmxFileId": req.query.jmxFileId, "moduleId": req.query.moduleId, "featureId": req.query.featureId } },
            { $unwind: "$ResultTree" },
            {
                $project: {
                    _id: 0,
                    "jmxFileName": "$jmxFileName",
                    "jmxReportId": "$ResultTree.jmxReportId",
                    "projectName": "$projectName",
                    "date": "$ResultTree.date",
                    "time": "$ResultTree.time",
                    "projectId": "$projectId",
                    "moduleId": "$moduleId",
                    "featureId": "$featureId"
                }
            }
        ],
            function (err, doc) {
                if (err) {
                    throw err;
                }
                else {
                    console.log("if getViewReultDetails")
                    res.json(doc)
                }
            })
    }
    else {
        db.jmxFiles.aggregate([
            { $match: { "projectId": req.query.projectId, "jmxFileId": req.query.jmxFileId, "moduleId": req.query.moduleId, "featureId": req.query.featureId } },
            { $unwind: "$ResultTree" },
            { $match: { "ResultTree.date": req.query.date } },
            {
                $project: {
                    _id: 0,
                    "jmxFileName": "$jmxFileName",
                    "jmxReportId": "$ResultTree.jmxReportId",
                    "projectName": "$projectName",
                    "date": "$ResultTree.date",
                    "time": "$ResultTree.time",
                    "projectId": "$projectId",
                    "moduleId": "$moduleId",
                    "featureId": "$featureId"
                }
            }
        ],
            function (err, doc) {
                if (err) {
                    throw err;
                }
                else {
                    console.log("else getViewReultDetails")
                    res.json(doc)
                }
            })
    }

}

function removeJmxReport(req, res) {
    var folder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxReportId}`);
    console.log(folder)
    if (!fs.existsSync(folder)) {
        console.log("jmxReports not available");
        res.json("FAIL")
    } else {
        db.jmxReports.remove({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId, "jmxReportId": req.body.jmxReportId, "date": req.body.date },
            function (err, doc) {
                console.log("delete JmxReport", doc)
                fse.remove(folder, (err) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log('JmxReport folder deleted!')
                            res.json("PASS")
                        }
                    }
                    catch (err) {
                        console.log('Error while remove' + err);
                        res.json("FAIL")
                    }
                })
            })
    }

}

async function convertActualCsvToJson(req, res) {

    console.log('convertActualCsvToJson', req.body.projectName)
    //console.log(req.body)
    var resultData = []
    var resultFIle = "../../uploads/opal/" + req.body.projectName + "/MainProject/jmxFiles/" + req.body.moduleId + "/" + req.body.featureId + "/" + req.body.jmxFileId + "/actual_test/" + req.body.jmxFileId + ".csv"
    resultFIlePath = path.join(__dirname, resultFIle);
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile(resultFIlePath);
    var sheet_name_list = workbook.SheetNames;
    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var totalData = data
    var statusData = true
    for (i = 0; i < totalData.length; i++) {
        if (totalData[i].success == "false") {
            resultData[i] = {
                status: "FAIL",
                label: totalData[i].label,
                response: totalData[i].responseMessage
            }
            statusData = false;
        }
        else {
            resultData[i] = {
                status: "PASS",
                label: totalData[i].label,
                response: totalData[i].responseMessage
            }
        }
        if (i == totalData.length - 1) {
            if (statusData == false) {
                testStatus = "FAIL"
            }
            else {
                testStatus = "PASS"
            }
            db.jmxFiles.find({ "projectId": req.body.projectId, "jmxFileId": req.body.jmxFileId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
                (err, doc) => {
                    console.log(doc);
                    if (err) console.log(err);
                    db.jmxReports.update({ "projectId": doc[0].projectId, "jmxFileName": doc[0].jmxFileName, "moduleId": doc[0].moduleId, "featureId": doc[0].featureId, "jmxReportId": doc[0].jmxReportId, "date": doc[0].date },
                        {
                            $set:
                            {
                                "status": testStatus
                            }
                        }, function (err, doc1) {
                            if (err) console.log(err)
                            res.json(doc[0])
                        })
                })

        }
    }

}

async function removeFolderDb(req, res) {
    db.jmxFiles.find({ "projectId": req.body.projectId, "jmxFileId": req.body.jmxFileId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
        (err, doc) => {
            console.log(doc);
            if (err) console.log(err);
            var folder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${doc[0].jmxReportId}`);
            console.log(folder)
            if (!fs.existsSync(folder)) {
                console.log("jmxReports not available");
                res.json("FAIL")
            } else {
                db.jmxReports.remove({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId, "jmxReportId": doc[0].jmxReportId, "date": doc[0].date },
                    function (err, doc) {
                        console.log("delete JmxReport", doc)
                        fse.remove(folder, (err) => {
                            try {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    console.log('JmxReport folder deleted!')
                                    res.json("PASS")
                                }
                            }
                            catch (err) {
                                console.log('Error while remove' + err);
                                res.json("FAIL")
                            }
                        })
                    })
            }
        })
}
async function copyHTMLResultsToFolder(req, res) {
    let promiseArr = [];
    db.jmxFiles.find({ "projectId": req.body.projectId, "jmxFileId": req.body.jmxFileId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
        (err, doc) => {
            //console.log(doc);
            if (err) console.log(err);
            var jmxReportFolder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${doc[0].jmxReportId}/${req.body.jmxFileId}`)
            console.log(jmxReportFolder);
            if (fs.existsSync(jmxReportFolder)) {
                console.log("Reports  available");
            } else {
                console.log('ReportFolder folder does not exist')
                fs.mkdir(jmxReportFolder, function (err) {
                    console.log("ReportFolder folder created");
                })
            }
            var resultFIle = `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}`
            resultFIlePath = path.join(__dirname, resultFIle)
            fs.readdirSync(resultFIlePath).forEach(file => {
                promiseArr.push(new Promise((resolve, reject) => {
                    fse.copy(`./uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}/${file}`, jmxReportFolder + "/" + file, function (err) {
                        if (err) {
                            console.log("ERRORRR:", err)
                            reject(err)
                            // return console.error(err)
                        } else {
                            resolve("Copy Completed")
                        }
                    })
                }))
            })

            Promise.all(promiseArr).then((result) => {
                console.log(result)
                var folder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}`);
                fse.remove(folder, (err) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log('report folder deleted!')
                            res.json("Pass")
                        }
                    }
                    catch (err) {
                        console.log('Error while remove' + err);
                        res.json("Fail")
                    }
                })
                // res.json("Pass");
            }).catch((err) => {
                res.json("Fail")
            })
        })
}

async function stopExecution(req, res) {

    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/stopexecution.bat`)
    var folderPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}`)

    console.log(file)
    console.log(folderPath)
    var master = req.body.masterDetails.name
    var machineName = req.body.masterDetails.machineName
    var mvnFileCreation = fs.createWriteStream(file);
    mvnFileCreation.write("@echo off\n")
    mvnFileCreation.write(` @FOR /f "tokens=*" %%i IN ('docker-machine env ${machineName}') DO @%%i\n`)
    mvnFileCreation.write("cd " + folderPath + " && docker exec " + master + "  /jmeter/apache-jmeter-3.3/bin/stoptest.sh")
    mvnFileCreation.end(function () {
        cmd.exec(file, (err, stdout, stderr) => {
            console.log(" MVN batch file executingggg " + "\n\n");
            try {

                if (err != null) {
                    throw err;
                } else {
                    console.log("stoptest Pass")
                    res.json("Pass")
                }

            } catch (err) {
                console.log("Error stoptest", err)
                res.json("Fail")
            }
        })
    })
}

async function readLogs(req, res) {
    console.log("readtxtFile");
    var convertedJson = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/${req.body.jmxFileId}.txt`)

    if (fs.existsSync(convertedJson)) {
        lr = new LineByLineReader(convertedJson);
        let endRun = false;
        let capturedLines1 = '';
        let capturedFinal = '';
        let text = '';
        var temp = [];
        var new_array = [];
        var new_array1 = [];
        lr.on('error', function (err) {
            // 'err' contains error object
            console.log(err);
        });

        lr.on('line', function (line) {
            // 'line' contains the current line without the trailing newline character.
            if (line.includes("summary ")) {
                temp = [];
                new_array = [];
                new_array1 = [];
                text = '';
                new_array = line.split(" ");
                temp = new_array.filter(function (el) {
                    return el != '';
                })
                for (let i = 13; i < temp.length; i++) {
                    new_array1.push(temp[i]);
                }
                //   console.log(temp[13],temp.length)
                //   console.log(new_array1)
                text = new_array1.join(' ');
                //text=text.replaceAll(","," 	");
                capturedFinal = `${capturedFinal}${text}\n`
            }
            if (line.includes("... end of run")) {
                capturedFinal = `${capturedFinal}${line}\n`
                //capturedLines = `${capturedLines}${line}\n`
                endRun = true;
            }
        });

        lr.on('end', function () {
            // All lines are read, file is closed now.
            // console.log(text)
            res.json({ capturedFinal, endRun });
        });
    }

}

async function saveResultData(req, res) {
    console.log("saveResultData");
    db.jmxFiles.find({ "projectId": req.body.projectId, "jmxFileId": req.body.jmxFileId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
        async (err, doc) => {
            // console.log(doc);
            if (err) console.log(err);
            var folder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/ViewResultTree`);
            console.log(folder)
            if (fs.existsSync(folder)) {
                console.log("ViewResultTree available");
                let result = await SaveResultTree(req, doc);
                console.log(result)
                res.json(result)
            } else {
                console.log('ViewResultTree folder does not exist')
                fs.mkdir(folder, async function (err) {
                    console.log("ViewResultTree folder created");
                    if (fs.existsSync(folder)) {
                        console.log("ViewResultTree  available");
                        let result = await SaveResultTree(req, doc);
                        console.log(result)
                        res.json(result)
                    }
                })

            }
        })
}

async function SaveResultTree(req, doc) {
    return new Promise((resolve, reject) => {
        ["viewResultTree.json"].forEach((value) => {
            fse.copy(`./uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/viewResultTree.json`,
                `./uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/ViewResultTree/${doc[0].jmxReportId}.json`, (err) => {
                    if (err) {
                        console.log(err);
                        resolve('Fail', err);
                    } else {
                        db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileName": req.body.jmxFileName, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
                        {
                            $push: {
                                "ResultTree": {
                                    "jmxReportId": doc[0].jmxReportId,
                                    "date": doc[0].date,
                                    "time": doc[0].time
                                }
                            }
                        }, function (err, doc1) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log("inside", value)
                            resolve('copy completed')
                            console.log("jmxReports inserted")
                            }
                        })
                        
                    }
                })
        })
    })
}

function removeTreeReport(req, res) {
    var file = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleId}/${req.body.featureId}/${req.body.jmxFileId}/actual_test/viewResultTree/${req.body.reportId}.json`);
    console.log(file)
    if (!fs.existsSync(file)) {
        console.log("removeTreeReport not available");
        res.json("FAIL")
    } else {
        db.jmxFiles.update({ "projectId": req.body.projectId, "jmxFileId": req.body.jmxFileId, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
            {
                $pull: {
                    "ResultTree": {
                        "jmxReportId": req.body.reportId.trim()
                    }
                }
            },
            function (err, doc) {
                console.log("delete removeTreeReport", doc)
                fse.remove(file, (err) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log('removeTreeReport file deleted!')
                            res.json("PASS")
                        }
                    }
                    catch (err) {
                        console.log('Error while remove' + err);
                        res.json("FAIL")
                    }
                })
            })
    }

}

async function removeJmxFile(req, res) {
    console.log("removeJmxFile");
    var folder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}/${req.body.featureName}/${req.body.jmxFileName}`);
    console.log(folder)
    db.jmxFiles.remove({ "projectId": req.body.projectId, "jmxFileId": req.body.jmxFileId, "moduleId": req.body.moduleId, "featureId": req.body.featureId },
        function (err, doc) {
            console.log("delete jmxFile", doc)
            fse.remove(folder, (err) => {
                try {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log('jmxFile folder deleted!')
                        res.json("PASS")
                    }
                }
                catch (err) {
                    console.log('Error while remove' + err);
                    res.json("FAIL")
                }
            })
        })
}

async function removeJmxModule(req, res) {
    console.log("removeJmxModule");
    var folder = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/jmxFiles/${req.body.moduleName}`);
    console.log(folder)
    db.jmxFiles.remove({ "projectId": req.body.projectId,"moduleId": req.body.moduleId },
        function (err, doc) {
            console.log("delete jmxFiles DB", doc)
            fse.remove(folder, (err) => {
                try {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log('jmxFiles Module folder deleted!')
                        res.json("PASS")
                    }
                }
                catch (err) {
                    console.log('Error while remove' + err);
                    res.json("FAIL")
                }
            })
        })
}

// async function xmlTojson(req, res) {
//     console.log(`xmlTojson `);
//     var xml = `C:/Users/raviteja/Desktop/performance-test-case/BlazeDemo.xml`;
//     var json = `C:/Users/raviteja/Desktop/performance-test-case/BlazeDemo.json`;
//     fs.readFile(xml, 'utf8', function (err, xmldata) {
//         // var obj = JSON.parse(data);
//         try {
//             if (err != null) {
//                 throw err;
//             } else {
//                 xml2js.parseString(xmldata, function (err, results) {

//                     // parsing to json
//                     let data = JSON.stringify(results, null);
//                     var obj = JSON.parse(data);
//                     res.json(obj);
//                     // try {
//                     //     fs.writeFileSync(json, data)
//                     //     // var obj = JSON.parse(data);
//                     //     res.json(data);
//                     // } catch (err) {
//                     //     console.error(err)
//                     //     res.json(err);
//                     // }
//                 });
//             }
//         }
//         catch (err) {
//             var result = 'Fail';
//             console.log(" error  " + err);
//             res.json(result);
//         }
//     })

// }

module.exports = {
    getModulesToDisplay: getModulesToDisplay,
    checkForDuplicate: checkForDuplicate,
    getJmxData: getJmxData,
    jsonConversion: jsonConversion,
    jmxConversion: jmxConversion,
    checkForCSVDuplicate: checkForCSVDuplicate,
    deleteCSVFile: deleteCSVFile,
    copyScriptsToMaster: copyScriptsToMaster,
    trailCallExecution: trailCallExecution,
    copyResultsToLocal: copyResultsToLocal,
    deleteInDocker: deleteInDocker,
    convertCsvToJson: convertCsvToJson,
    execMasterDetails: execMasterDetails,
    execSlaveDetails: execSlaveDetails,
    checkDockerStatus: checkDockerStatus,
    changeToRunningStatus: changeToRunningStatus,
    copyScriptsToExecutionMaster: copyScriptsToExecutionMaster,
    callExecution: callExecution,
    copyExecutionResultsToLocal: copyExecutionResultsToLocal,
    copyExecutionHTMLResultsToLocal: copyExecutionHTMLResultsToLocal,
    deleteInDockerContainer: deleteInDockerContainer,
    changeToBlockedStatus: changeToBlockedStatus,
    checkHtml: checkHtml,
    deleteTrailFolder: deleteTrailFolder,
    removeUserFolder: removeUserFolder,
    getjmxReportDetails: getjmxReportDetails,
    removeJmxReport: removeJmxReport,
    convertActualCsvToJson: convertActualCsvToJson,
    removeFolderDb: removeFolderDb,
    copyHTMLResultsToFolder: copyHTMLResultsToFolder,
    readJsonFile: readJsonFile,
    stopExecution: stopExecution,
    readLogs: readLogs,
    saveResultData: saveResultData,
    getViewReultDetails: getViewReultDetails,
    readTreeJsonFile: readTreeJsonFile,
    removeTreeReport: removeTreeReport,
    removeJmxFile: removeJmxFile,
    jsonConversionAndValidate:jsonConversionAndValidate,
    removeJmxModule:removeJmxModule
    // xmlTojson: xmlTojson
}