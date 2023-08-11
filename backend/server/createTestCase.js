module.exports = function (app) {
    var mongojs = require('mongojs');
    var bodyParser = require("body-parser");
    var fs = require('fs');
    var path = require("path");
    var rimraf = require("rimraf");


    //var db=mongojs('collections',['loginDetails','projectSelection','mobileApps'])
    var db = require('../dbDeclarations').url;
    var mCount = undefined
    var smId = undefined
    const treeStructureCall = require('./services/treeStructureData');


    app.post('/allModuleData', function (req, res) {
        console.log("hittinfgggggggggggggggggggggggggggggggggg")
        var source = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + req.body.moduleName
        // checking for duplicate in project
        db.moduleName.find({ "moduleName": req.body.moduleName, "projectId": req.body.projectId }, function (err, result) {

            if (result.length > 0) {
                // duplicates are present
                console.log(" duplicate is present ", req.body.moduleName);
                result[0].duplicate = true;
                res.json(result);

            } else {
                // no duplicate

                createModule(req.body)
            }
        })

        function createModule(reqBody) {
            console.log(" createModule call  ", req.body.moduleName);
            fs.mkdir(source, function (err) {
                console.log(reqBody)
                if (reqBody.exportConfig === "exportYes") {
                    var exportSource = "./uploads/export/" + req.body.projectName + "/src/test/java/" + req.body.moduleName
                    fs.mkdir(exportSource, () => { })
                }
            })

            console.log("enterrrrrrrrrcccccccccccccccc")
            db.countInc.find({}, function (err, doc) {


                mCount = doc[0].mCount
                mCount++
                smId = doc[0].moduleID
                var moduleId = smId + mCount
                console.log(moduleId + "vnnnnnnnnnnnnnnnnnnnnnnvvv")

                db.moduleName.insert({ "moduleName": req.body.moduleName, "projectId": req.body.projectId, "moduleId": moduleId }, function (err, doc) {
                    db.countInc.update({ "projectID": "pID" }, {
                        $set: {
                            "mCount": mCount
                        }
                    })
                    res.json([{ duplicate: false }]);
                });
            })
        }
    })

    var sCount = undefined
    var ssID = undefined
    app.post('/allScriptData', exportConfigCreation, function (req, res) {
        writeScriptLevelConfigData(req.body)
        var scriptFile = "./uploads/opal/" + req.body.projectName + "/src/test/java/" + "/" + req.body.moduleName + "/" + req.body.featureName + "/" + req.body.scriptName + ".java"
        fs.createWriteStream(scriptFile);
        db.countInc.find({}, function (err, doc) {
            sCount = doc[0].sCount;
            sCount++;
            ssID = doc[0].scriptID;
            var scriptId = ssID + sCount;

            var scriptConfigdata = {};
            scriptConfigdata["time"] = parseInt(req.body.time);
            scriptConfigdata["defaultBrowser"] = req.body.defaultBrowser;
            scriptConfigdata["defaultVersion"] = req.body.defaultVersion;
            scriptConfigdata["ipAddress"] = req.body.ipAddress;


            db.moduleName.find({ "moduleName": req.body.moduleName }, function (err, doc) {
                db.featureName.find({ "moduleId": doc[0].moduleId, "projectId": doc[0].projectId, "featureName": req.body.featureName }, function (err, fea) {
                    db.priority.find({ "priorityName": req.body.priority }, function (err, pri) {
                        db.type.find({ "typeName": req.body.type }, function (err, type) {
                            db.testScript.insert({
                                "moduleId": doc[0].moduleId,
                                "projectId": doc[0].projectId,
                                "featureId": fea[0].featureId,
                                "scriptName": req.body.scriptName,
                                "scriptId": scriptId,
                                "priorityId": pri[0].priorityId,
                                "typeId": type[0].typeId,
                                "requiremantName": req.body.requiremantName,
                                "scriptConfigdata": scriptConfigdata,
                                "description": req.body.description,
                                "scriptStatus": req.body.scriptStatus,
                                "requirementId": req.body.requirementId
                            },
                                function (err, scr) {
                                    db.countInc.update({ "projectID": "pID" }, { $set: { "sCount": sCount } })
                                    res.json("Success");
                                    console.log("doneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
                                })
                        })
                    })
                })
            })
        })
    })

    async function exportConfigCreation(req, res, next) {
        if (req.body.exportConfig === 'exportYes') {
            var scriptFile = "./uploads/export/" + req.body.projectName + "/src/test/java/" + "/" + req.body.moduleName + "/" + req.body.featureName + "/" + req.body.scriptName + ".java"
            let value = await fs.createWriteStream(scriptFile);
            let complete = await exportScriptLevelConfig(req.body);
            next();
        }
        else { next(); }



    }

    function exportScriptLevelConfig(scriptConfigData) {
        console.log("writeScriptLevelConfigDatawriteScriptLevelConfigData")
        var scriptFile = "./uploads/export/" + scriptConfigData.projectName + "/src/test/java/" + "/" + scriptConfigData.moduleName + "/" + scriptConfigData.featureName + "/" + scriptConfigData.scriptName + "Config" + ".json";
        fs.createWriteStream(scriptFile);
        console.log("  fs.createWriteStream(scriptFile) ");

        var firstline = "\"ImplicitWait\"" + ":\"" + scriptConfigData.time + "\"" + "\n";
        var secondline = "\"Browser\"" + ":" + "\"" + scriptConfigData.defaultBrowser + "\"" + ",\n";
        var thridline = "\"Version\"" + ":" + "\"" + scriptConfigData.defaultVersion + "\"" + "\n";
        var fourthline = "\"IP\"" + ":" + "\"" + scriptConfigData.ipAddress + "\"" + "\n";

        // setTimeout(() => {}, 0)
        setTimeout(() => {
            console.log("  executed  file ")
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, "\"BrowserDetails\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, secondline);
            fs.appendFileSync(scriptFile, thridline);
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\"Timeout\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, firstline + ",\n");
            fs.appendFileSync(scriptFile, "\"ExplicitWait\"" + ":" + "\"40\"");
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\"ScreenshotOption\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, "\"CaptureOnEveryStep\"" + ":" + "\"Yes\",\n");
            fs.appendFileSync(scriptFile, "\"CaptureOnFailure\"" + ":" + "\"Yes\"\n");
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\"ExecutionCount\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, "\"reportCount\"" + ":" + "\"100\"\n");
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\"SuiteName\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, "\"suiteName\"" + ":" + "\"Suite1\"\n");
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\n" + '"IpAddress":\n' + "{\n");
            fs.appendFileSync(scriptFile, fourthline);
            fs.appendFileSync(scriptFile, "}\n" + "\n" + "}");
        }, 1000);

    }
    function writeScriptLevelConfigData(scriptConfigData) {
        console.log("writeScriptLevelConfigDatawriteScriptLevelConfigData")
        var scriptFile = "./uploads/opal/" + scriptConfigData.projectName + "/src/test/java/" + "/" + scriptConfigData.moduleName + "/" + scriptConfigData.featureName + "/" + scriptConfigData.scriptName + "Config" + ".json";
        fs.createWriteStream(scriptFile);
        console.log("  fs.createWriteStream(scriptFile) ");

        var firstline = "\"ImplicitWait\"" + ":\"" + scriptConfigData.time + "\"" + "\n";
        var secondline = "\"Browser\"" + ":" + "\"" + scriptConfigData.defaultBrowser + "\"" + ",\n";
        var thridline = "\"Version\"" + ":" + "\"" + scriptConfigData.defaultVersion + "\"" + "\n";
        var fourthline = "\"IP\"" + ":" + "\"" + scriptConfigData.ipAddress + "\"" + "\n";

        // setTimeout(() => {}, 0)http://192.168.99.100:4444
        setTimeout(() => {
            console.log("  executed  file ")
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, "\"BrowserDetails\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, secondline);
            fs.appendFileSync(scriptFile, thridline);
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\"Timeout\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, firstline + ",\n");
            fs.appendFileSync(scriptFile, "\"ExplicitWait\"" + ":" + "\"40\"");
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\"ScreenshotOption\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, "\"CaptureOnEveryStep\"" + ":" + "\"Yes\",\n");
            fs.appendFileSync(scriptFile, "\"CaptureOnFailure\"" + ":" + "\"Yes\"\n");
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\"ExecutionCount\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, "\"reportCount\"" + ":" + "\"100\"\n");
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\"SuiteName\":\n");
            fs.appendFileSync(scriptFile, "{\n");
            fs.appendFileSync(scriptFile, "\"suiteName\"" + ":" + "\"Suite1\"\n");
            fs.appendFileSync(scriptFile, "},\n");
            fs.appendFileSync(scriptFile, "\n" + '"IpAddress":\n' + "{\n");
            fs.appendFileSync(scriptFile, fourthline);
            fs.appendFileSync(scriptFile, "}\n" + "\n" + "}");
        }, 1000);

    }
    var fCount = undefined
    var sfID = undefined
    app.post('/allFeatureData', function (req, res) {


        var featureFolder = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + "/" + req.body.moduleName + "/" + req.body.featureName



        // checking for duplicate in features in module
        db.moduleName.find({ "moduleName": req.body.moduleName, "projectId": req.body.projectId }, function (err, moduleDetails) {
            console.log(moduleDetails[0].moduleId);
            console.log(moduleDetails);
            db.featureName.find({ "moduleId": moduleDetails[0].moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName }, function (err, result) {

                if (result.length > 0) {
                    // duplicates are present
                    console.log(" duplicate is present ", req.body.featureName);
                    result[0].duplicate = true;
                    res.json(result);

                } else {
                    // no duplicate
                    console.log(" no duplicate is present ", req.body.featureName);
                    console.log(result);
                    createFeature(moduleDetails[0].moduleId, req.body)
                }
            })

        })


        function createFeature(moduleId, reqBody) {


            fs.mkdir(featureFolder, function (err) {

                console.log(reqBody)
                if (reqBody.exportConfig === "exportYes") {
                    var exportSource = "./uploads/export/" + req.body.projectName + "/src/test/java/" + "/" + req.body.moduleName + "/" + req.body.featureName
                    fs.mkdir(exportSource, () => { })
                }

            })

            var featureName = req.body.featureName

            db.countInc.find({}, function (err, doc) {


                fCount = doc[0].fCount
                fCount++

                sfID = doc[0].featureID



                var featureId = sfID + fCount




                db.featureName.insert({ "moduleId": moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName, "featureId": featureId }, function (err, doc) {

                    db.countInc.update({ "projectID": "pID" }, {
                        $set: {
                            "fCount": fCount
                        }
                    })

                    res.json([{ duplicate: false }]);






                });

            })


        }
        //})



    })

    app.get('/getSaveFromDb:project', function (req, res) {
        // console.log(this.projectId)
        // console.log("pppppppppppppppppppooooooooooooooooooo")
        db.moduleName.find({ "projectId": req.params.project }, function (err, doc) {
            res.json(doc);
            //console.log(doc)
        })
    })


    app.get('/CheckingFeaHavingTestcase:feaName', (req, res) => {
        db.featureName.find({ "featureName": req.params.feaName }, (err, doc) => {
            console.log("modulllllllllllleeeeeeeeeee", doc[0].featureId)
            db.testScript.find({ "featureId": doc[0].featureId }, (err, doc) => {
                if (err) {
                    throw err;
                }
                else {
                    res.json(doc)
                }

            })
        })
    })

    app.delete('/deleteFeature/:module/:projectName/:feaName', async function (req, res) {
        console.log("project nameeeeeeeeeeee", req.params.projectName)
        var finalPath = path.join(__dirname, '../uploads/opal/');
        var oldDirPath = req.params.projectName + "/src/test/java/" + req.params.module + '\\' + req.params.feaName
        var finaloldPathname = path.join(finalPath, oldDirPath);

        var exportPath = path.join(__dirname, '../uploads/export/');
        var exportFeaturePath = req.params.projectName + "/src/test/java/" + req.params.module + '\\' + req.params.feaName
        var finalexportPathname = path.join(exportPath, exportFeaturePath);


        await deleteFeatureDir(finaloldPathname)
        await deleteFeatureDirFromExpoert(finalexportPathname)

        var deletedResponce = await deleteFeatureFromDb(req.params.feaName)
        res.json(deletedResponce)

    })

    function deleteFeatureDir(finaloldPathname) {
        return new Promise((resolve, reject) => {
            rimraf(finaloldPathname, function (err) {
                if (err) {
                    throw err

                } else {
                    resolve("Successfully deleted the file")
                }
            })
        })
    }
    function deleteFeatureDirFromExpoert(finalexportPathname) {
        return new Promise((resolve, reject) => {
            rimraf(finalexportPathname, function (err) {
                if (err) {
                    throw err

                } else {
                    resolve("Successfully deleted the file")
                }
            })
        })
    }
    function deleteFeatureFromDb(featureName) {
        return new Promise((resolve, reject) => {
            db.featureName.find({ "featureName": featureName }, function (err, doc) {
                db.testScript.remove({ "featureId": doc[0].featureId }, function (err, fea) {
                })
                db.featureName.remove({ "featureName": featureName }, function (err, doc) {
                    if (err) {
                        throw err
                    }
                    else {
                        resolve(doc)
                    }
                })
            })
        })
    }
    app.delete('/deleteModule/:module/:projectName', async function (req, res) {
        console.log("pnamwwwwwwwwwwwwwww", req.params.projectName)
        var finalPath = path.join(__dirname, '../uploads/opal/');
        var oldDirPath = req.params.projectName + "/src/test/java/" + req.params.module;
        var finaloldPathname = path.join(finalPath, oldDirPath);

        var exportPath = path.join(__dirname, '../uploads/export/');
        var exportModulePath = req.params.projectName + "/src/test/java/" + req.params.module;
        var finalexportPathname = path.join(exportPath, exportModulePath);

        await deleteModeleDir(finaloldPathname)
        await deleteModuleDirFromExpoert(finalexportPathname)
        var deletedResponce = await deleteModuleFromDb(req.params.module)
        res.json(deletedResponce)
    })
    function deleteModeleDir(finaloldPathname) {
        return new Promise((resolve, reject) => {
            console.log(finaloldPathname)
            rimraf(finaloldPathname, function (err) {
                if (err) {
                    throw err

                } else {
                    resolve("Successfully deleted the file")
                }
            })
        })
    }
    function deleteModuleDirFromExpoert(finalexportPathname) {
        return new Promise((resolve, reject) => {
            rimraf(finalexportPathname, function (err) {
                if (err) {
                    throw err

                } else {
                    resolve("Successfully deleted the file")
                }
            })
        })
    }
    function deleteModuleFromDb(moduleName) {
        return new Promise((resolve, reject) => {
            db.moduleName.find({ "moduleName": moduleName }, function (err, doc) {
                if (doc[0].moduleId != undefined) {
                    db.testScript.remove({ "moduleId": doc[0].moduleId }, function (err, fea) {
                    })
                    db.featureName.remove({ "moduleId": doc[0].moduleId }, function (err, rem) {
                    })
                    db.moduleName.remove({ "moduleName": moduleName }, function (err, doc) {
                        if (err) {
                            throw err
                        }
                        else {
                            resolve(doc)
                        }
                    })
                }
                else {
                    resolve("no files to delete")
                }
            })
        })
    }
    app.get('/displayModulePage:module', function (req, res) {

        // console.log("pppppppppppppppppppooooooooooooooooooo")
        db.moduleName.find({ "moduleName": req.params.module }, function (err, doc) {
            res.json(doc);
            //console.log(doc)
        })
    })
    app.get('/displayFeaturePage:feature', function (req, res) {

        // console.log("pppppppppppppppppppooooooooooooooooooo")
        db.featureName.find({ "featureName": req.params.feature }, function (err, doc) {
            res.json(doc);
            //console.log(doc)
        })
    })
    app.get('/displayScriptPage:scriptName', function (req, res) {
        var scriptData = []
        db.testScript.find({ "scriptName": req.params.scriptName }, function (err, doc) {
            console.log(doc[0])
            scriptData.push(doc[0].scriptName, doc[0].description, doc[0].scriptStatus, doc[0].requiremantName, doc[0].scriptConfigdata)
            db.type.find({ "typeId": doc[0].typeId }, function (err, type) {
                scriptData.push(type[0].typeName)
                db.priority.find({ "priorityId": doc[0].priorityId }, function (err, priority) {
                    scriptData.push(priority[0].priorityName)
                    console.log(scriptData)
                    res.json(scriptData);

                })
            })

        })
        //  db.testScript.find({ "scriptName": req.params.scriptName }, function (err, doc) {
        //                                res.json(doc);



        //         })

    })
    app.get('/getScriptFromDb:feature', function (req, res) {
        db.featureName.find({ "featureName": req.params.feature }, function (err, doc) {
            db.testScript.find({ "featureId": doc[0].featureId }, function (err, data) {
                console.log(doc[0].featureId + "doc[0].featureIddoc[0].featureId")

                res.json(data)

            })
        })
    })

    app.get('/getFeatureFromDb:module', function (req, res) {
        db.moduleName.find({ "moduleName": req.params.module }, function (err, doc) {
            db.featureName.find({ "moduleId": doc[0].moduleId }, function (err, data) {

                res.json(data)

            })
        })
    })
    app.get('/etModuleDb:module', function (req, res) {


        console.log("vffffffffffffffffffff" + req.params.module)

        db.moduleName.find({ "moduleName": req.params.module }, function (err, doc) {
            res.json(doc)
        })
    })
    app.get('/conditionFeatureTree:feature', function (req, res) {


        // console.log("pppppppppppppppppppoooocooooooooooooooo"+req.params.module)

        db.featureName.find({ "featureName": req.params.feature }, function (err, doc) {
            res.json(doc)
        })
    })

    app.put('/updateModule', async function (req, res) {
        let moduleDupicateCheck = await treeStructureCall.updateModuleData(req.body.updateName)
        if (moduleDupicateCheck == null) {
            var finalPath = path.join(__dirname, '../uploads/opal/');
            var oldDirPath = req.body.projectName + "/src/test/java/" + req.body.moduleName;
            var finaloldPathname = path.join(finalPath, oldDirPath);

            var newDirPath = req.body.projectName + "/src/test/java/" + req.body.updateName;
            var finalNewPathname = path.join(finalPath, newDirPath);

            var finalExportPath = path.join(__dirname, '../uploads/export/');
            var finaloldExportPathname = path.join(finalExportPath, oldDirPath);

            var finalNewExportPath = path.join(finalExportPath, newDirPath);

            updateModuleName()
            updateModulePath(finaloldPathname, finalNewPathname)
            updateEportModulePath(finaloldExportPathname, finalNewExportPath)


        } else {
            console.log(" duplicate jmeterTestcase ");
            res.json([{ duplicate: true }]);

        }

        function updateModuleName() {
            console.log(req.body.updateName + "pppppppppppppppppppoooocooooooooooooooo" + req.body.moduleName)
            db.moduleName.update({ "moduleName": req.body.moduleName }, {
                $set: {
                    "moduleName": req.body.updateName
                }
            },
                function (err, scr) {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.json([{ duplicate: false }]);
                    }
                })
        }
        function updateModulePath(finaloldPathname, finalNewPathname) {
            const oldDirName = finaloldPathname;
            const newDirName = finalNewPathname;

            fs.rename(oldDirName, newDirName, (err) => {
                if (err) {
                    throw err;
                } else {

                    console.log("Directory of Module renamed successfully.");
                }
            });
        }
        function updateEportModulePath(finaloldExportPathname, finalNewExportPath) {
            const oldDirName = finaloldExportPathname;
            const newDirName = finalNewExportPath;

            fs.rename(oldDirName, newDirName, (err) => {
                if (err) {
                    throw err;
                } else {

                    console.log("Directory of Module renamed successfully.");
                }
            });
        }

    })
    app.put('/updateFeature', async function (req, res) {
        console.log("htttttttttttttttttttttttttttttttttttttttttttttttttttttt")
        console.log(req.body)


        let featureDupicateCheck = await treeStructureCall.updateFeatureData(req.body.updateName)
        if (featureDupicateCheck == null) {
            var finalPath = path.join(__dirname, '../uploads/opal/');
            var oldDirPath = req.body.projectName + "/src/test/java/" + req.body.moduleName + "\\" + req.body.featureName
            var finaloldPathname = path.join(finalPath, oldDirPath);

            var newDirPath = req.body.projectName + "/src/test/java/" + req.body.moduleName + "\\" + req.body.updateName;
            var finalNewPathname = path.join(finalPath, newDirPath);

            var finalExportPath = path.join(__dirname, '../uploads/export/');
            var finaloldExportPathname = path.join(finalExportPath, oldDirPath);

            var finalNewExportPath = path.join(finalExportPath, newDirPath);

            updateFeatureName()
            await updateFeaturePath(finaloldPathname, finalNewPathname)
            await updateExportFeaturePath(finaloldExportPathname, finalNewExportPath)


        } else {
            console.log(" duplicate jmeterTestcase ");
            res.json([{ duplicate: true }]);

        }

        function updateFeatureName() {

            db.featureName.update({ "featureName": req.body.featureName }, {
                $set: {
                    "featureName": req.body.updateName
                }
            }, function (err, scr) {
                if (err) {
                    throw err;
                }
                else {
                    res.json([{ duplicate: false }]);
                }
            })
        }
        function updateFeaturePath(finaloldPathname, finalNewPathname) {

            const oldDirName = finaloldPathname;
            const newDirName = finalNewPathname;

            fs.rename(oldDirName, newDirName, (err) => {
                if (err) {
                    throw err;
                } else {

                    console.log("Directory renamed successfully.");
                }
            });
        }
        function updateExportFeaturePath(finaloldExportPathname, finalNewExportPath) {
            const oldDirName = finaloldExportPathname;
            const newDirName = finalNewExportPath;

            fs.rename(oldDirName, newDirName, (err) => {
                if (err) {
                    throw err;
                } else {

                    console.log("Directory renamed successfully.");
                }
            });
        }

    })




    app.put('/updateScriptData', async function (req, res) {
        let featureDupicateCheck = await treeStructureCall.updateTestcaseData(req.body.updateName)
        if (featureDupicateCheck == null) {
            var finalPath = path.join(__dirname, '../uploads/opal/');
            var oldDirPath = req.body.projectName + "/src/test/java/" + req.body.moduleName + "\\" + req.body.featureName + '\\' + req.body.scriptName + '.java'
            var jsonOldPath = req.body.projectName + "/src/test/java/" + req.body.moduleName + "\\" + req.body.featureName + '\\' + req.body.scriptName + 'Config.json'
            var finaloldPathname = path.join(finalPath, oldDirPath);
            var finaloldJsonPathname = path.join(finalPath, jsonOldPath);

            var newDirPath = req.body.projectName + "/src/test/java/" + req.body.moduleName + "\\" + req.body.featureName + '\\' + req.body.updateName + '.java'
            var newJsonDirPath = req.body.projectName + "/src/test/java/" + req.body.moduleName + "\\" + req.body.featureName + '\\' + req.body.updateName + 'Config.json'

            var finalNewPathname = path.join(finalPath, newDirPath);
            var finalJsonNewPathname = path.join(finalPath, newJsonDirPath);


            var finalExportPath = path.join(__dirname, '../uploads/export/');
            var finaloldExportPathname = path.join(finalExportPath, oldDirPath);
            var finaloldJsonExportPathname = path.join(finalExportPath, jsonOldPath);


            var finalNewExportPath = path.join(finalExportPath, newDirPath);
            var finalJsonNewExportPath = path.join(finalExportPath, newJsonDirPath);

            testcaseUpadteFromDb()
            updateTestcasePath(finaloldPathname, finalNewPathname, finaloldJsonPathname, finalJsonNewPathname)
            var updatedData = await updateExportTeastcasePath(finaloldExportPathname, finalNewExportPath, finaloldJsonExportPathname, finalJsonNewExportPath)
            res.json(updatedData)

        } else {
            console.log(" duplicate jmeterTestcase ");
            res.json([{ duplicate: true }]);

        }
        function testcaseUpadteFromDb() {
            db.testScript.update({ "scriptName": req.body.scriptName },
                {
                    $set: {
                        "scriptName": req.body.updateName,
                        "description": req.body.description,
                        "scriptStatus": req.body.scriptStatus,
                        "requiremantName": req.body.requirementName
                    }
                },
                function (err, doc) {

                    db.type.find({ "typeName": req.body.type }, function (err, type) {

                        db.testScript.update({ "scriptName": req.body.updateName }, {
                            $set: {
                                "typeId": type[0].typeId
                            }
                        })

                    })
                    db.priority.find({ "priorityName": req.body.priority }, function (err, priority) {
                        db.testScript.update({ "scriptName": req.body.updateName }, {
                            $set: {
                                "priorityId": priority[0].priorityId
                            }
                        })

                    })
                })

        }

    })

    function updateTestcasePath(finaloldPathname, finalNewPathname, finaloldJsonPathname, finalJsonNewPathname) {
        const oldDirName = finaloldPathname;
        const newDirName = finalNewPathname;
        fs.rename(oldDirName, newDirName, (err) => {
            if (err) {
                throw err;
            } else {

                console.log("Directory renamed successfully.");
            }
        });
        fs.rename(finaloldJsonPathname, finalJsonNewPathname, (err) => {
            if (err) {
                throw err;
            } else {

                console.log("Directory Json File renamed successfully.");
            }
        });
    }
    function updateExportTeastcasePath(finaloldExportPathname, finalNewExportPath, finaloldJsonExportPathname, finalJsonNewExportPath) {
        return new Promise((resolve, reject) => {
            const oldDirName = finaloldExportPathname;
            const newDirName = finalNewExportPath;

            fs.rename(oldDirName, newDirName, (err) => {
                if (err) {
                    throw err;
                } else {

                    console.log("Directory renamed successfully.");
                }
            });
            fs.rename(finaloldJsonExportPathname, finalJsonNewExportPath, (err) => {
                if (err) {
                    throw err;
                } else {

                    console.log("Directory renamed successfully.");
                    resolve("updated")
                }
            });
        })
    }

    app.delete('/eleteScript/:module/:projectName/:feaName/:deleteScript', async function (req, res) {
        listArray = []
        var finalPath = path.join(__dirname, '../uploads/opal/');
        var opalTestFilePath = req.params.projectName + "/src/test/java/" + req.params.module + '\\' + req.params.feaName + '\\' + req.params.deleteScript + '.java'
        var opalConfigFilePath = req.params.projectName + "/src/test/java/" + req.params.module + '\\' + req.params.feaName + '\\' + req.params.deleteScript + 'Config.json'

        var finalOpalTestPath = path.join(finalPath, opalTestFilePath);
        var finalOpalConfigPath = path.join(finalPath, opalConfigFilePath);

        var exportPath = path.join(__dirname, '../uploads/export/');
        var exportTestFilePath = req.params.projectName + "/src/test/java/" + req.params.module + '\\' + req.params.feaName + '\\' + req.params.deleteScript + '.java'
        var exportConfigFilePath = req.params.projectName + "/src/test/java/" + req.params.module + '\\' + req.params.feaName + '\\' + req.params.deleteScript + 'Config.json'

        var exportTestcasePath = path.join(exportPath, exportTestFilePath);
        var exportConfigPath = path.join(exportPath, exportConfigFilePath);
        console.log(finalOpalTestPath, finalOpalConfigPath)
        console.log(exportTestcasePath, exportConfigPath)
        listArray.push(finalOpalTestPath)
        listArray.push(finalOpalConfigPath)
        listArray.push(exportTestcasePath)
        listArray.push(exportConfigPath)
        console.log(listArray)
        
        await testcaseDeleteFromDb(req.params.deleteScript)
        var dele = await deleteTestcasePath(listArray)
        console.log(dele)

        res.json(dele);

    })

    function deleteTestcasePath(finalOpalTestPath) {
        return new Promise((resolve, reject) => {
             console.log(finalOpalTestPath)
            for (var i = 0; i < finalOpalTestPath.length; i++) {
                fs.unlinkSync(finalOpalTestPath[i], (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log("Opal Directory Deleted successfully.");

                    }
                });
            resolve("deleted")
            }
        })
    }

    function testcaseDeleteFromDb(deleteScript) {
        return new Promise((resolve, reject) => {
            
            console.log("deleting from the dbbbbbbbbb")
            db.testScript.remove({ "scriptName": deleteScript }, function (err, doc) {
                if (err) {
                    throw err;
                } else {
                    resolve("deleted successFully")
                }
            })
        })
    }


}