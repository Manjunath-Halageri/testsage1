const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var path = require("path");
var fs = require('fs');
var cmd = require('child_process');
var rimraf = require("rimraf");
var fse = require('fs-extra');

async function getSuiteDetails(req, res) {
    var projectId = req.query.projectId;
    db.testsuite.find({ 'PID': projectId }, function (err, doc) {
        res.json(doc);
    });
}

async function getDefaultConfigDetails(req, res) {
    var projectId = req.query.projectId;
    db.projectSelection.find({ "projectId": projectId }, function (err, doc) {
        res.json(doc[0].projectConfigdata);
    });
}

async function getFrameworkDetails(req, res) {
    var projectId = req.query.projectId;
    db.projectSelection.find({ "projectId": projectId }, function (err, doc) {
        res.json(doc);
    });
}

async function getReleaseDetails(req, res) {
    var pid = req.query.projectId;
    db.release.find({ "projectId": pid, "status": "Active" }, function (err, doc) {
        if (err) throw err
        res.json(doc)
    })
}

async function popUpEditDetails(req, res) {
    var suiteId = req.query.suiteId;
    db.testsuite.find({ "_id": mongojs.ObjectId(suiteId) }, function (err, doc) {
        res.json(doc[0].suiteConfigdata);
    });
}

async function suiteConfigDetails(req, res) {
    var pname = req.query.projectName;
    db.projectSelection.find({ "projectSelection": pname }, function (err, doc) {
        res.json(doc[0].projectConfigdata);

    });
}

async function fetchExceptionsuitesDetails(req, res) {
    var projectId = req.query.projectId
    db.testsuite.find({ "PID": projectId }, function (err, result) {
        let data = []; data = result.map((result) => ({ 'label': result.testsuitename,"suiteID": result.suiteId, 'data': 'suites', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder" }))
        res.json(data);
    })
}


async function editSuiteDetails(req, res) {
    var projectId = req.query.projectId
    var suiteName = req.query.suiteName
    db.testsuite.find({ "PID": projectId, "testsuitename": suiteName }, function (err, result) {
        res.json(result)
    })
}

async function getBrowsersDetails(req, res) {
    var orgId = Number(req.query.orgId)
    db.licenseDocker.aggregate([
        { $match: { "machineType": "executionMachine", "orgId": orgId, } },
        { $unwind: "$machineDetails" },
        { $unwind: "$machineDetails.browsers" },
        { $unwind: "$machineDetails.browsers.version" },
        {
            $project: {
                _id: 0, "browserType": "$machineDetails.browsers.browserName",
                "browserVersion": "$machineDetails.browsers.version.versionName"
            }
        }], function (err, doc) {
            let chromeVersionsArray = []
            let FireFoxVersionsArray = []
            versionsArray = []
            if (doc.length == 0) {
                res.json(doc)
            }
            doc.forEach((element, index, array) => {
                let obj1 = {}
                let obj2 = {}
                if (element.browserType == 'Chrome') {
                    obj1["versionName"] = element.browserVersion;
                    chromeVersionsArray.push(obj1)
                }
                else if (element.browserType == 'Firefox') {
                    obj2["versionName"] = element.browserVersion;
                    FireFoxVersionsArray.push(obj2)
                }
                if (index === (array.length - 1)) {
                    let obj3 = {}
                    let obj4 = {}
                    obj3['browserName'] = 'Chrome'
                    obj3['version'] = chromeVersionsArray
                    obj4['browserName'] = 'FireFox'
                    obj4['version'] = FireFoxVersionsArray
                    versionsArray.push(obj3)
                    versionsArray.push(obj4)
                    res.json(versionsArray)
                }
            });
        })
}

async function getVersionDetails(req, res) {
    var ver = req.query.browser;
    var orgId = Number(req.query.orgId)
    if (ver == "FireFox") {
        ver = 'Firefox'
    }
    db.licenseDocker.aggregate([
        { $match: { "machineType": "executionMachine", "orgId": orgId, } },
        { $unwind: "$machineDetails" },
        { $unwind: "$machineDetails.browsers" },
        { $match: { "machineDetails.browsers.browserName": ver } },
        { $unwind: "$machineDetails.browsers.version" },
        {
            $project: {
                _id: 0, "version": "$machineDetails.browsers.version",
                "browserVersion": "$machineDetails.browsers.version.versionName",
            }
        }], function (err, doc) {
            let chromeVersionsArray = []
            versionsArray = []
            if (doc.length == 0) {
                res.json(doc)
            }
            else {
                doc.forEach((element, index, array) => {
                    let obj1 = {}
                    obj1["versionName"] = element.browserVersion;
                    obj1["versionCodeName"] = element.versionCodeName;
                    obj1["status"] = element.status;
                    chromeVersionsArray.push(obj1)
                    if (index === (array.length - 1)) {
                        let obj3 = {}
                        obj3['browserName'] = ver
                        obj3['version'] = chromeVersionsArray
                        versionsArray.push(obj3)
                        res.json(versionsArray)
                    }
                });
            }
        })
}

async function createApiSuite(req, sourcePath, dirName, finalSuitePath, res) {
    var suitename = req.body.suite;
    var des = req.body.desc;
    var project = req.body.pname;
    var Id = req.body.pid;
    var releaseId = req.body.releaseId;
    var suiteconfig = ''
    var suitecount

    db.countInc.find({ "suiteID": "suID" }, function (err, doc) {
        suitecount = doc[0].suiteCount
    })
    db.testsuite.find({ "projectName": project, "testsuitename": { $exists: true, $eq: suitename } }, function (err, doc) {
        if (doc.length == 0) {
            db.countInc.findAndModify({
                query: { "suiteID": "suID" },
                update: { $inc: { "suiteCount": 1 } },
                new: true
            },
                function (err, doc) {
                    db.testsuite.insert({
                        'testsuitename': suitename, 'Description': des, "projectName": project, "PID": Id,
                        "suiteId": "suID" + suitecount, "releaseVersion": releaseId
                    }, function (err, doc) {
                        backEndSuiteCreation(finalSuitePath, dirName, sourcePath, suiteconfig, project, suitename, res);
                    });
                });
        }
        else {
            res.json([{ "status": "Error" }]);
        }
    })
}

async function createWebSuite(req, sourcePath, dirName, finalSuitePath, res) {

    var suitename = req.body.suite;
    var des = req.body.desc;
    var project = req.body.pname;
    var Id = req.body.pid;
    var suiteconfig = req.body.config;
    var releaseId = req.body.releaseId;
    var suitecount
    db.countInc.find({ "suiteID": "suID" }, function (err, doc) {
        suitecount = doc[0].suiteCount
    })
    db.testsuite.find({ "projectName": project, "testsuitename": { $exists: true, $eq: suitename } }, function (err, doc) {
        if (doc.length == 0) {
            db.countInc.findAndModify({
                query: { "suiteID": "suID" },
                update: { $inc: { "suiteCount": 1 } },
                new: true
            },
                function (err, doc) {

                    db.testsuite.insert({
                        'testsuitename': suitename, 'Description': des, "projectName": project, "PID": Id,
                        "suiteId": "suID" + suitecount, "suiteConfigdata": suiteconfig, "releaseVersion": releaseId,"lockedBy": "none"
                    }, function (err, doc) {
                        createSuitesFolder(req);
                        createSuiteNameFolder(req)
                        backEndSuiteCreation(req,finalSuitePath, dirName, sourcePath, suiteconfig, project, suitename, res);
                        // if (fs.existsSync(finalSuitePath)) {
                        //     console.log("suites present")
                        // } else {
                        //     console.log("suites not present");
                        //     fs.mkdir(finalSuitePath, function (err) {
                        //         if (err) console.log(err)
                        //         console.log("creating suite path");
                        //         backEndSuiteCreation(req,finalSuitePath, dirName, sourcePath, suiteconfig, project, suitename, res);
                        //     });
                        // }
                        
                    });
                });
        }
        else {
            res.json("duplicates");
        }
    })
}

function createSuitesFolder(req) {
    var tempPath = `../../uploads/opal/${req.body.pname}/MainProject/suites`;
    var completePath = path.join(__dirname, tempPath);
    try {
        if (!fs.existsSync(completePath)) {
            fs.mkdirSync(completePath)
        }else{
            console.log("suites present")
        }
    } catch (err) {
        console.error(err)
    }

}

function createSuiteNameFolder(req) {
    var tempPath = `../../uploads/opal/${req.body.pname}/MainProject/suites/${req.body.suite}`;
    var completePath = path.join(__dirname, tempPath);
    try {
        if (!fs.existsSync(completePath)) {
            fs.mkdirSync(completePath)
        }
    } catch (err) {
        console.error(err)
    }
}

function backEndSuiteCreation(req,suitePath, destination, source, suiteconfig, projectName, suitename, res) {
console.log("backEndSuiteCreation")
// Inside username folder,the below function will Copy content of MainProject folder except Scripts, Excel, suites and jmxFiles folder into 
// projectToRun folder inside username folder. 
    let promiseArr = [];
    var tempPath = `../../uploads/opal/${req.body.pname}/MainProject`;
    var directory = path.join(__dirname, tempPath);
console.log(directory)
    fs.readdirSync(directory).forEach(file => {
        if (file != "jmxFiles") {
                if (file != "suites") {
                    promiseArr.push(new Promise((resolve, reject) => {
                        if (file != "src") {
                            fse.copy(`./uploads/opal/${req.body.pname}/MainProject/${file}`, `./uploads/opal/${req.body.pname}/MainProject/suites/${req.body.suite}/${file}`, function (err) {
                                if (err) {
                                    reject(err)
                                    // return console.error(err)
                                } else {
                                    resolve('copy completed')
                                }
                            });
                        } else {
                            fse.copy(`./uploads/opal/${req.body.pname}/MainProject/${file}/main`, `./uploads/opal/${req.body.pname}/MainProject/suites/${req.body.suite}/${file}/main`, function (err) {
                                if (err) {
                                    reject(err)
                                    // return console.error(err)
                                } else {
                                    resolve('copy completed')
                                }
                            });
                            // try {
                            //     var tempPath = `../../uploads/opal/${req.body.pname}/suites/${req.body.suite}/src/test`;
                            //     var test = path.join(__dirname, tempPath);
                            //     console.log("backEndSuiteCreation",test)
                            //     if (!fs.existsSync(test)) {
                            //         fs.mkdirSync(test)
                            //         resolve('copy completed')
                            //     }
                            // } catch (err) {
                            //     console.error(err)
                            // }
                        }
                    }))
                }
        }
    });

    Promise.all(promiseArr).then((result) => {
        res.json("pass");
    }).catch((err) => {
        // rimraf(`./uploads/opal/${req.query.pname}/${req.query.userName}`, function (err) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log("Successfully deleted a directory");
        //     }
            res.json("fail");
        // });

    })
    // if (fs.existsSync(suitePath)) {
    //     console.log("suite Folder present")
    // } else {
    //     console.log("suite Folder not present");
    //     fs.mkdir(suitePath, function (err) {
    //         if (err) console.log(err)
    //         console.log("created suite folder");
    //     });
    // }
    
    // if (!fs.existsSync(destination)) {
    //     var dirName1 = path.join(__dirname, destination);
    //     var sourcePath1 = path.join(__dirname, source);
    //     var fsCopy = require('fs-extra')
    //     let source1 = path.resolve(__dirname, sourcePath1)
    //     let destination1 = path.resolve(__dirname, dirName1)
    //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //     console.log(sourcePath1)
    //     console.log(dirName1)
    //     console.log(source1)
    //     console.log(destination1)
    //     console.log('("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")')
    //     if (fs.existsSync(destination1)) {
    //     } else {
    //         fs.mkdir(destination1, function (err) {
    //             if (err) console.log(err)
    //             console.log("created the folder " + destination1);
    //         });
    //     }
    //     fs.readdir(source1, function (err, list) {
    //         if (err) console.log(" error with scan ");
    //         // console.log(" error with scan ",list);
    //         // if (list.splice(0,1)) {
    //          let listArray=   list.filter(function(value, index, arr){ 
    //                 return value!="jmxFiles"&&value!="suites";
    //             });
    //             listArray.forEach(function (e, eindex, earray) {
    //             var sourceCopy = source1 + "\\" + e;
    //             var skippedFolder1 = source1 + "\\src";
    //             var skippedFolder2 = source1 + "\\target";
    //             var destCopy = destination1 + "\\" + e;
    //             if (sourceCopy == skippedFolder1 || sourceCopy == skippedFolder2) {
    //                 if (sourceCopy == skippedFolder2) {
    //                     if (fs.existsSync(destination1 + "\\target")) {
    //                     } else {
    //                         fs.mkdir(destination1 + "\\target", function (err) {
    //                             if (err) console.log(err)
    //                             console.log("created a target folder")
    //                         });
    //                     }
    //                 }
    //                 if (sourceCopy == skippedFolder1) {
    //                     if (fs.existsSync(destination1 + "\\src")) {
    //                         if (fs.existsSync(destination1 + "\\src\\main")) {
    //                         } else {
    //                             console.log("1111")
    //                             fs.mkdir(destination1 + "\\src\\main", function (err) {
    //                                 if (err) console.log(err)
    //                                 console.log("creating the main folder")
    //                             });
    //                             fsCopy.copy(source1 + "\\src\\main", destination1 + "\\src\\main")
    //                                 .then(() => {
    //                                 })
    //                                 .catch(err => {
    //                                     console.log("err while copying")
    //                                 })
    //                         }
    //                         if (fs.existsSync(destination1 + "\\src\\test")) {
    //                         } else {
    //                             fs.mkdir(destination1 + "\\src\\test", function (err) {
    //                                 if (err) console.log(err)
    //                                 console.log("created a test")
    //                             })
    //                         }
    //                     } else {
    //                         fs.mkdir(destination1 + "\\src", function (err) {
    //                             if (err) console.log(err)
    //                             console.log("created a src");
    //                         });
    //                         if (fs.existsSync(destination1 + "\\src\\main")) {
    //                             fs.mkdir(destination1 + "\\src\\test", function (err) {
    //                                 if (err) console.log(err)
    //                                 console.log("created a test");
    //                             });
    //                         } else {
    //                             console.log("insede else");
    //                             var mainPath = destination1 + "\\src\\main";
    //                             var testPath = destination1 + "\\src\\test"
    //                             fs.mkdir(mainPath, function (err) {
    //                                 if (err) console.log(err)
    //                                 console.log("created a main")
    //                             })
    //                             fs.mkdir(testPath, function (err) {
    //                                 if (err) console.log(err)
    //                                 console.log("created a test fodler")
    //                             });
    //                             fsCopy.copy(source1 + "\\src\\main", destination1 + "\\src\\main")
    //                                 .then(() => {
    //                                 })
    //                                 .catch(err => {
    //                                     console.log("err while copying")
    //                                 })
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 var fileState = fs.lstatSync(sourceCopy).isDirectory();
    //                 if (fileState == true) {
    //                     if (!fs.existsSync(destCopy)) {
    //                         fs.mkdir(destCopy, function (err) {
    //                             if (err) console.log(err)
    //                             console.log("created destination folder to copy");
    //                         });
    //                         fsCopy.copy(sourceCopy, destCopy, function (err) {
    //                             if (err) console.log(err)
    //                             console.log("copy completed");
    //                         })
    //                     } else {
    //                         fsCopy.copy(sourceCopy, destCopy)
    //                             .then(() => {

    //                             })
    //                             .catch(err => {
    //                                 console.log('An error occured while copying the folder.')
    //                                 return console.error(err)
    //                             })
    //                     }
    //                 } else {
    //                     var content = fs.readFileSync(sourceCopy, 'utf8')
    //                     fs.writeFile(destCopy, content, function (err) {
    //                         if (err) console.log(err);
    //                     })
    //                 }
    //             }
    //             if (eindex == earray.length - 1) {
    //                 if (suiteconfig == '') {
    //                     res.json([{ "status": "Pass" }]);
    //                 }
    //                 else {
    //                     suitecon(suiteconfig, project, suitename, res);
    //                 }
    //             }
    //         })
    //     //}

    //     })
    // }

}

function suitecon(con, pname, suite, res) {
    var file = '../../uploads/opal/' + pname + '/MainProject/suites/' + suite + '/config.json';
    var file1 = path.join(__dirname, file);
    
    if (fs.existsSync(file1)) {
        console.log(fs.existsSync(file1))
        fs.unlink(file1, function (err) {
            console.log(err)
            console.log("Unlinked")
            
        })
    }
    res.json([{ "status": "Pass" }]);
    // var firstline = "\"setTimeOut\"" + ":" + con.settimeOut + ",\n";
    // var secondline = "\"defaultBrowser\"" + ":" + "\"" + con.defaultBrowser + "\"" + ",\n";
    // var thridline = "\"defaultVersion\"" + ":" + "\"" + con.defaultVersion + "\"" + "\n";
    // var fourthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:4444" + "\"" + "\n";
    // fs.createWriteStream(file1);
    // fs.appendFileSync(file1, "{ \n" + '"Timeout":\n' + "{");
    // fs.appendFileSync(file1, firstline);
    // fs.appendFileSync(file1, "},\n");
    // fs.appendFileSync(file1, "{\n" + '"BrowserDetails":\n' + "{\n");
    // fs.appendFileSync(file1, secondline);
    // fs.appendFileSync(file1, thridline);
    // fs.appendFileSync(file1, "}\n" + "},\n");
    // fs.appendFileSync(file1, "{\n" + '"IpAdress":\n' + "{\n");
    // fs.appendFileSync(file1, fourthline);
    // fs.appendFileSync(file1, "}\n" + "}\n" + "}");
    
}

async function DeleteSuite(req, res) {
    var suitename = req.body.suite;
    var projectname = req.body.projectName;
    db.testsuite.remove({ "projectName": projectname, "testsuitename": suitename }, function (err, doc) {
        deleteSuite(req,res)
        res.json(doc);
    })
}


function deleteSuite(req,res) {
    var suitename = req.body.suite;
    var projectname = req.body.projectName;
    console.log('deleting suite',suitename,projectname );
    var fsDel = require('fs-extra');
   var file= path.join(__dirname,'../../uploads/opal/' + projectname + '/MainProject/suites/' +suitename);
   console.log(file)
  
    fsDel.remove(file , (err) => {
        try {
        if (err) {
            throw err;
        }
        else{
            console.log('suite folder deleted!')
        }
    }
    catch (err) {
        console.log('Error while renaming'+err);
       }
    })
}

//    function webSuiteupdate(req, editfile, suitepath1, res) {
    var webSuiteupdate = (req, editfile, suitepath1, res) => new Promise((resolve, reject) => {
    var suite = req.body.suite;
    var des = req.body.desc;
    var Id = req.body.sId;
    var sconfig = req.body.config;
   console.log('updating config.json')
    // db.testsuite.update({ "_id": mongojs.ObjectId(Id) },
    //     { $set: { "testsuitename": suite, "Description": des, "suiteConfigdata": sconfig } }, function (err, doc) {
            if (fs.existsSync(suitepath1)) {
                try{
                      fs.createWriteStream(editfile);
                // fs.appendFileSync(editfile, "{\n");
                var firstline = "\"setTimeOut\"" + ":" + sconfig.settimeOut + ",\n";
                var secondline = "\"defaultBrowser\"" + ":" + "\"" + sconfig.defaultBrowser + "\"" + ",\n";
                var thridline = "\"defaultVersion\"" + ":" + "\"" + sconfig.defaultVersion + "\"" + "\n";
                var fourthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:4444" + "\"" + "\n";
                fs.appendFileSync(editfile, "{ \n" + '"Timeout":\n' + "{");
                fs.appendFileSync(editfile, firstline);
                fs.appendFileSync(editfile, "},\n");
                fs.appendFileSync(editfile, "{\n" + '"BrowserDetails":\n' + "{\n");
                fs.appendFileSync(editfile, secondline);
                fs.appendFileSync(editfile, thridline);
                fs.appendFileSync(editfile, "}\n" + "},\n");
                fs.appendFileSync(editfile, "{\n" + '"IpAdress":\n' + "{\n");
                fs.appendFileSync(editfile, fourthline);
                fs.appendFileSync(editfile, "}\n" + "}\n" + "}");
               // fs.appendFileSync(editfile, "}");
               batchResult = "Pass" 
               console.log(batchResult)
            //    res.json(batchResult)
                }
                catch(err){
                    console.log('Fail at updateConfig'+'\n'+err);
                    batchResult = "Fail" 
                    console.log(batchResult)
                    //  res.json(batchResult)
                   
                }
                resolve(batchResult)
            }
           
            // res.json(doc);
        // });
})

//async function updateSuite(req,data,projectname,suitesPath1,suite1,suitename,editfile,suitepath1, res) {
    async function updateSuite(req,data,suitepath1,suite1, res) {
        // let  file = path.join(__dirname, `../../uploads/opal/${projectname}/MainProject/suites/Rename.bat`)
        // console.log(file+"\n"+suitesPath1)
        var suite = req.body.suite;
        var des = req.body.desc;
        var Id = req.body._Id;
        var sconfig = req.body.config;
        const oldDirName = suitepath1;
         const newDirName = suite1;
         var dataObj = {}
         if(!req.body.compare){
            fs.rename(oldDirName, newDirName, (err) => {
                try{
                   if (err) {
                       batchResult = "Fail" 
                       res.json(batchResult)
                        throw err;
                    } else {
                        console.log("Directory renamed successfully.");
                        console.log(data.frameworkId,data.suite,data.pid)
                    db.testsuite.update({ "_id": mongojs.ObjectId(Id) },
                     { $set: { "testsuitename": suite, "Description": des, "suiteConfigdata": sconfig } }, function (err, doc) {
                   });
                   batchResult = "Pass" 
                     res.json(batchResult)
                     console.info('suite updated in DB')
                    }
                   //  fs.stat(newDirName, (err, stats) => {
                   //     if (err) throw err;
                   //     console.log(`stats: ${JSON.stringify(stats)}`);
                   //   });
                }catch(err){
                   console.log('Error while renaming'+err);
                }
               
           });
         }else{
         db.testsuite.find({ "projectName":  req.body.pname, "testsuitename": { $exists: true, $eq: req.body.suite } }, function (err, doc) {
            if (doc.length != 0) {
                res.json("duplicates");
            }else{
         fs.rename(oldDirName, newDirName, (err) => {
             try{
                if (err) {
                    batchResult = "Fail" 
                    res.json(batchResult)
                     throw err;
                 } else {
                     console.log("Directory renamed successfully.");
                     console.log(data.frameworkId,data.suite,data.pid)
                 db.testsuite.update({ "_id": mongojs.ObjectId(Id) },
                  { $set: { "testsuitename": suite, "Description": des, "suiteConfigdata": sconfig } }, function (err, doc) {
                });
                batchResult = "Pass" 
                  res.json(batchResult)
                  console.info('suite updated in DB')
                 }
                //  fs.stat(newDirName, (err, stats) => {
                //     if (err) throw err;
                //     console.log(`stats: ${JSON.stringify(stats)}`);
                //   });
             }catch(err){
                console.log('Error while renaming'+err);
             }
            
        });
    }
    })
}
       // createRenBatch(req,data,projectname,file,suitesPath1,suite1,suitename,editfile,suitepath1,res);
      }
  function createRenBatch (req,data,projectname,file,suitesPath1,suite1,suitename,editfile,suitepath1,res) {
    var myData = data;
    // console.log(myData.length)
    var renFileCreation = fs.createWriteStream(file);
    renFileCreation.write("@echo off\n")
    renFileCreation.write("cd " + suitesPath1 + " && " + "ren"+" "+"\"" + suite1 + "\""+" "+"\"" + suitename + "\"")
    renFileCreation.end(function () {
      console.log(`done writing ren batch  ${file} `);
      batchCreation = 'Pass';
      console.info('renBatchCreation() Execution time: %dms')
      executeRen(req,data,projectname,editfile,suitepath1,res)
    })
  }
  function executeRen(req,data,projectname, editfile,suitepath1,res) {
    var suite = req.body.suite;
    var des = req.body.desc;
    var Id = req.body.sId;
    var sconfig = req.body.config;
    renexe  = path.join(__dirname, `../../uploads/opal/${projectname}/MainProject/suites/Rename.bat`)
    console.log(renexe)
    cmd.exec(renexe, (err, stdout, stderr) => {
      console.log(" Rename batch file starts execution " + "\n");
      try {
        if (err!=null) {
          batchResult = "Fail" 
          res.json(batchResult)
          throw err;
        }
        else {
            console.log(data.frameworkId,data.suite,data.pid)
          console.info('renExecution() Executed')
          db.testsuite.update({ "_id": mongojs.ObjectId(Id) },
          { $set: { "testsuitename": suite, "Description": des, "suiteConfigdata": sconfig } }, function (err, doc) {
        });
        batchResult = "Pass" 
        // setTimeout(() => {
        //     webSuiteupdate(req,  editfile,suitepath1,res)
        // }, 1000);
        
          res.json(batchResult)
      }
      
      } catch (err) {
        console.log('Fail at renExecution()'+'\n'+err);
      }
    })  
  }



  async function suiteEditCall(req,data,projectname,suitepath1,suite1,suitename, res) {
    // let  file = path.join(__dirname, `../../uploads/opal/${projectname}/MainProject/suites/Rename.bat`)
    // console.log(file+"\n"+suitepath1)
     const oldDirName = suitepath1;
     const newDirName = suite1;
    fs.rename(oldDirName, newDirName, (err) => {
         if (err) {
            batchResult = "Fail" 
            res.json(batchResult)
             throw err;
         } else {
             console.log("Directory renamed successfully.");
             console.log(data.frameworkId,data.suite1,data.pid)
                db.testsuite.update({ "testsuitename":data.suite1,"PID":data.pid }
                ,{$set:{ "testsuitename": data.suite, "Description": data.desc}},function (err, doc) {
                console.log("Sucessfully stored in DB")
              })
              batchResult = "Pass" 
              res.json(batchResult)
          console.info('suite updated in DB')
         }
     });
    //renBatchCreation(req,data,projectname,file,suitepath1,suite1,suitename,res);
  }
  
  //creating batch file in suites folder and writing the required path and it for execution
  function renBatchCreation (req,data,projectname,file,suitepath1,suite1,suitename,res) {
        var myData = data;
        // console.log(myData.length)
        var renFileCreation = fs.createWriteStream(file);
        renFileCreation.write("@echo off\n")
        renFileCreation.write("cd " + suitepath1 + " && " + "ren"+" "+"\"" + suite1 + "\""+" "+"\"" + suitename + "\"")
        renFileCreation.end(function () {
          console.log(`done writing ren batch  ${file} `);
          batchCreation = 'Pass';
          console.info('renBatchCreation() Execution time: %dms')
          renExecution(req,data,projectname,res)
        })
      }
  



  //executing ren batchfile in suites folder 
  function renExecution(req,data,projectname,res) {
    renexe  = path.join(__dirname, `../../uploads/opal/${projectname}/MainProject/suites/Rename.bat`)
    console.log(renexe)
    cmd.exec(renexe, (err, stdout, stderr) => {
      console.log(" Rename batch file starts execution " + "\n");
      try {
        if (err!=null) {
          batchResult = "Fail" 
          res.json(batchResult)
          throw err;
        }
        else {
            console.log(data.frameworkId,data.suite1,data.pid)
                db.testsuite.update({ "testsuitename":data.suite1,"PID":data.pid }
                ,{$set:{ "testsuitename": data.suite, "Description": data.desc}},function (err, doc) {
                console.log(doc+"\n"+"Sucessfully stored in DB")
              })
              batchResult = "Pass" 
              res.json(batchResult)
          console.info('renExecution() Executed')
        // batchResult = "Pass" 
        //   res.json(batchResult)
      }
      
      } catch (err) {
        console.log('Fail at renExecution()'+'\n'+err);
      }
    })
  }


async function copyFromSuiteDetails(req, res) {
    var data = req.body;
    var suitename = data.suite
    var copyFromSuite = data.suiteName
    var projectId = data.projectidRelease
    var Description = data.des
    framework = data.framework
    var suiteCounter
    var projectName
    db.testsuite.find({ "PID": projectId, "testsuitename": { $exists: true, $eq: suitename } }, function (err, doc) {

        if (doc.length == 0) {
            db.countInc.find({ "suiteID": "suID" }, function (err, doc) {
                suiteCounter = "suiteId" + doc[0].suiteCount
            })

            db.countInc.findAndModify({
                query: { "suiteID": "suID" },
                update: { $inc: { "suiteCount": 1 } },
                new: true
            },
                function (err, doc1) {
                    db.testsuite.find({ "PID": projectId, "testsuitename": copyFromSuite },
                        function (err, doc2) {

                            db.testsuite.insert({
                                'testsuitename': suitename, 'Description': Description, "projectName": doc2[0].projectName,
                                "PID": projectId, "suiteId": suiteCounter, "releaseVersion": doc2[0].releaseVersion,
                                "suiteConfigdata": doc2[0].suiteConfigdata, "SelectedScripts": doc2[0].SelectedScripts,"lockedBy": "none"
                            }, function (err, doc) {

                                // if (framework == "Api") {
                                //     var copyFromsuitePath = '../../uploads/opal/' + doc2[0].projectName + "/MainProject/suites/" + copyFromSuite;
                                //     var finalcopyFromsuitePath = path.join(__dirname, copyFromsuitePath);
                                //     var copyTosuitePath = '../../uploads/opal/' + doc2[0].projectName + "/MainProject/suites/" + suitename;
                                //     var finalcopyTosuitePath = path.join(__dirname, copyTosuitePath);
                                // }
                                // else {
                                    var copyFromsuitePath = '../../uploads/opal/' + doc2[0].projectName + "/MainProject/suites/" + copyFromSuite;
                                    var finalcopyFromsuitePath = path.join(__dirname, copyFromsuitePath);
                                    var copyTosuitePath = '../../uploads/opal/' + doc2[0].projectName + "/MainProject/suites/" + suitename;
                                    var finalcopyTosuitePath = path.join(__dirname, copyTosuitePath);
                               // }
                                backEndCopySuiteCreation(finalcopyFromsuitePath, finalcopyTosuitePath, res);

                            });
                        })


                })
        }
        else {
            res.json([{ "status": "Error" }]);
        }
    })
}


function backEndCopySuiteCreation(finalcopyFromsuitePath, finalcopyTosuitePath, res) {
    var fsCopy = require('fs-extra')
    fs.mkdir(finalcopyTosuitePath, function (err) {
        if (err) console.log(err)
    });
    fsCopy.copy(finalcopyFromsuitePath, finalcopyTosuitePath, function (err) {
        if (err) console.log(err)
        console.log("copy completed");
        res.json([{ "status": "Pass" }])
    })
}

function checkIfSuiteLocked(req, res) {
    db.testsuite.find({ "PID": req.query.projectId, "testsuitename": req.query.suiteName }, function (err, doc) {
        console.log(doc)
        if(doc[0].lockedBy=="none"){
            res.json("free");
        }else{
            db.loginDetails.find({
                "userId": doc[0]["lockedBy"],
                "projectId": req.query.projectId
            }, (err, doc1) => {
                res.json({ "beingUsedBy": doc1[0]["userName"] });
            })
        }
    });
}
module.exports = {
    getBrowsersDetails: getBrowsersDetails,
    getVersionDetails: getVersionDetails,
    getSuiteDetails: getSuiteDetails,
    getDefaultConfigDetails: getDefaultConfigDetails,
    getFrameworkDetails: getFrameworkDetails,
    getReleaseDetails: getReleaseDetails,
    createApiSuite: createApiSuite,
    createWebSuite: createWebSuite,
    DeleteSuite: DeleteSuite,
      updateSuite: updateSuite,
     webSuiteupdate:webSuiteupdate,
    popUpEditDetails: popUpEditDetails,
    suiteConfigDetails: suiteConfigDetails,
    fetchExceptionsuitesDetails: fetchExceptionsuitesDetails,
    editSuiteDetails: editSuiteDetails,
    copyFromSuiteDetails: copyFromSuiteDetails,
    suiteEditCall:suiteEditCall,
    checkIfSuiteLocked:checkIfSuiteLocked
}