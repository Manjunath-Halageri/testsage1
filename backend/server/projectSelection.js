const { json } = require('express');

module.exports = function (app) {
    var fs = require('fs');
    var mongojs = require('mongojs');
    var bodyParser = require("body-parser");
    var path = require("path");
    const rimraf = require('rimraf');
    var db = require('../dbDeclarations').url;
    const nodemailer = require('nodemailer')

    console.log("Calling projectSelection server");

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('/projectnames', function (req, res) {
        console.log("fetching the projectnames");

        db.projectSelection.find({}, function (err, doc) {
            res.json(doc);
        });
    });




    app.post('/projectdelete', function (req, res) {
        console.log("for deleting the project");
        console.log(req.body);
        // var pid = req.params.id;
        // console.log(pid + " projectid to be deleted");
        db.projectSelection.remove({ "_id": mongojs.ObjectId(req.body._id) }, function (err, doc) {
            res.json(doc);
            console.log(doc);
        });
        console.log("555555555555555555555555555555555555555555555555555555555555555555");
        var folder = `../uploads/opal/${req.body.projectSelection}`;
        console.log(folder);
        var finalFolderPath = path.join(__dirname, folder);
        // var config1 = finalFolderPath+"\\config.json";
        var config1;
        var currentConfig
        fs.readdir(finalFolderPath, function (err, files) {
            if (err) console.log(err)
            files.forEach(function (e, eindex, earray) {
                console.log(e);
                config1 = finalFolderPath + "\\config.json";
                currentConfig = finalFolderPath + "\\" + e;
                if (config1 == currentConfig) {
                    console.log("config file matched000000000000000000000000000000000000000000000000000000000")
                    console.log(currentConfig)

                }
                if (eindex == earray.length - 1) {
                    var f1 = true;
                    // console.log(fs.existsSync(currentConfig));
                    var interval = setInterval(() => {
                        console.log(finalFolderPath + '\\config.json');
                        if (fs.existsSync(finalFolderPath + '\\config.json')) {
                            console.log("yes yes yes yes yes")
                            fs.unlink(finalFolderPath + '\\config.json', function (err) {
                                console.log(currentConfig + " file delete at this place");
                                if (err) throw err;
                                // if no error, file has been deleted successfully
                                console.log('File deleted!');
                            });
                        } else {
                            console.log("no no no no no no");
                            rimraf(finalFolderPath, function (err) {
                                if (err) console.log(err)
                                console.log("directory has been deleted");
                                f1 = false
                                if (f1 == false) {
                                    clearInterval(interval);
                                }
                            })

                        }
                    }, 1000)

                }
            })
        })
        // console.log(finalFolderPath);


    });

    app.put("/editselectedProject", function (req, res) {
        console.log("for editing the project name");
        // var data1 = req.params.pdata;
        // console.log(data1);
        // var datas = data1.split(",");
        var pname = req.body.pname;
        var pid = req.body.pid;
        var oldpname = req.body.oldpname;
        var config = req.body.config;
        var file = "./uploads/opal/" + oldpname + "/config.json";
        console.log(file);
        console.log(config);
        console.log(pname + " ," + pid + " ," + config);
        db.projectSelection.update({ "_id": mongojs.ObjectId(pid) }, { $set: { "projectSelection": pname, "projectConfigdata": config } }, function (err, doc) {

            var firstline = "\"setTimeOut\"" + ":" + config.settimeOut + ",\n";
            console.log(firstline);
            var secondline = "\"defaultBrowser\"" + ":" + "\"" + config.defaultBrowser + "\"" + ",\n";
            var thridline = "\"defaultVersion\"" + ":" + "\"" + config.defaultVersion + "\"" + "\n";
            var updateConfig = fs.createWriteStream(file);
            updateConfig.write("{\n")
            updateConfig.write(firstline)
            updateConfig.write(secondline)
            updateConfig.write(thridline)
            updateConfig.write("}")
            updateConfig.end(function () {
                console.log(`done writing  ${file} `);
                console.log("./uploads/opal/" + oldpname + " oldpname");
                console.log("./uploads/opal/" + pname + " newPname");
                fs.rename("./uploads/opal/" + oldpname, "./uploads/opal/" + pname, function (err) {
                    if (err) throw err;
                    res.json(doc);
                })
                // res.json(doc);
            })
            console.log(doc)
        });
    });



    // // app.get("/getProject:pid", function (req, res) {
    // //     console.log("for getting the configdata for project");
    // //     var pid = req.params.pid;
    // //     console.log(pid);
    // //     db.projectSelection.find({ "_id": mongojs.ObjectId(pid) }, function (err, doc) {
    // //         res.json(doc);
    // //         console.log(doc);
    // //     });

    // // });

    app.get("/getdefaultConfig", function (req, res) {
        console.log("for getting the configdata for project");
        db.countInc.find({}, function (err, doc) {
            console.log(doc[0].configData);
            res.json(doc[0].configData);
        });

    });

    const transport = {
        service: "Gmail",
        auth: {
            user: "docker4441@gmail.com",
            pass: "docker_kanthi89"
        },
        tls: {
            rejectUnauthorized: false
        }

    }

    const smtpTransport = nodemailer.createTransport(transport)
    configdata = {};
    app.post('/addNewProject', function (req, res) {
        console.log(req.body);
        console.log(req.body.OrganizationName)
        configdata["settimeOut"] = req.body.orgnizationValue.setOut;
        configdata["defaultBrowser"] = req.body.orgnizationValue.defaultBrowser;
        configdata["defaultVersion"] = req.body.orgnizationValue.defaultVersion;
        configdata["Ip"] = "http://192.168.99.100:4444"

        db.countInc.find(function (err, doc1) {
            db.projectSelection.insert({
                'projectSelection': req.body.orgnizationValue.ProjectNameNew,
                'framework': req.body.orgnizationValue.framework,
                "projectId": "pID" + doc1[0].pCount,
                "projectConfigdata": configdata,
                "projectType": req.body.orgnizationValue.type,
                "Organization": req.body.OrganizationName,
                "projectAdmin": req.body.orgnizationAdminValue.Username,
                "CreatedBy": "Orgnization Admin",
                "CreatedDate": new Date()

            }, function (err, doc) {
                // res.json(doc)

                console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
                db.loginDetails.find({ "userName": { $exists: true, $eq: req.body.orgnizationAdminValue.Username } }, function (err, doc) {
                    if (doc.length == 0) {
                        console.log("gggggggggggggggggggggggg")
                        let projects = [];
                        let pro = {
                            "projectId": "pID" + doc1[0].pCount
                        }
                        projects.push(pro)
                        console.log(projects);
                        db.loginDetails.insert({
                            'Organization': req.body.OrganizationName,
                            'userName': req.body.orgnizationAdminValue.Username,
                            "password": req.body.orgnizationAdminValue.Password,
                            "projectNames": req.body.orgnizationValue.ProjectNameNew,
                            "allProjects": projects,
                            "CreatedBy": "organization Admin",
                            "roleName": "Project Admin",
                            "userId": 'u' + doc1[0].uCount,
                            "Email": req.body.orgnizationAdminValue.WorkEmail,

                        })
                    }

                    else {
                        console.log(doc[0]._id)
                        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                        db.loginDetails.update({
                            _id: mongojs.ObjectId(doc[0]._id)
                        }, {
                            $push: {
                                "allProjects": {
                                    projectId: "pID" + doc1[0].pCount,

                                }
                            },




                        }, function (err, doc) {

                        })

                    }
                })


                const options = {
                    from: "shivakumar <docker4441@gmail.com>",
                    to: req.body.orgnizationAdminValue.WorkEmail,
                    subject: "user details",
                    html: '<a>' + "Name:" + req.body.orgnizationAdminValue.Username + '</br>' +
                        "Password:" + req.body.orgnizationAdminValue.Password +

                        '</a>'




                }

                smtpTransport.sendMail(options, (err, info) => {
                    err ? console.log(err) : console.log(info);
                })

                if (req.body.orgnizationValue.framework == "Test NG") {
                    var sourcePath = '../autoScript/TestNg/testNgSolved';
                }
                else if (req.body.orgnizationValue.framework == "Appium") {
                    var sourcePath = '../autoScript/TestNg/testNgSolved';
                }
                else if (testFramework.framework == "Api") {
                    var sourcePath = '../../autoScript/RestAssuredAPI/RestAssuredAPISolved';
                }
                else {
                    var sourcePath = '';
                }

                var dirName1 = '../uploads/opal/' + req.body.orgnizationValue.ProjectNameNew;
                var filePath = '../uploads/opal/' + req.body.orgnizationValue.ProjectNameNew + "/config.json";
                let file = path.join(__dirname, filePath)
                let dirName = path.join(__dirname, dirName1)
                console.log(dirName);
                //  console.log(file);
                if (!fs.existsSync(dirName)) {
                    //  fs.mkdir(dirName);

                    fs.mkdir(dirName, function (err) {
                        if (err) {
                            console.log(err)
                        };
                    })
                    var fsCopy = require('fs-extra')
                    let source = path.join(__dirname, sourcePath)
                    console.log(source);
                    console.log(dirName);
                    let destination = path.join(dirName)
                    console.log(destination);
                    console.log("destination");
                    //var s1 = "E:/Projects/june0406/autoScript/TestNg/testNgSolved"
                    fsCopy.copy(source, destination)
                        .then(() => {
                            console.log('Copy completed!');
                            var firstline = "\"setTimeOut\"" + ":" + req.body.orgnizationValue.setOut + ",\n";
                            console.log(firstline);
                            var secondline = "\"defaultBrowser\"" + ":" + "\"" + req.body.orgnizationValue.defaultBrowser + "\"" + ",\n";
                            var thridline = "\"defaultVersion\"" + ":" + "\"" + req.body.orgnizationValue.defaultVersion + "\"" + "\n";
                            var fourthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:4444" + "\"" + "\n";
                            fs.createWriteStream(file);
                            fs.appendFileSync(file, "{ \n" + '"Timeout":\n' + "{");
                            fs.appendFileSync(file, firstline);
                            fs.appendFileSync(file, "},\n");
                            fs.appendFileSync(file, "{\n" + '"BrowserDetails":\n' + "{\n");
                            fs.appendFileSync(file, secondline);
                            fs.appendFileSync(file, thridline);
                            fs.appendFileSync(file, "}\n" + "},\n");
                            fs.appendFileSync(file, "{\n" + '"IpAdress":\n' + "{\n");
                            fs.appendFileSync(file, fourthline);
                            fs.appendFileSync(file, "}\n" + "}\n" + "}");
                        })
                        .catch(err => {
                            console.log('An error occured while copying the folder.')
                            return console.error(err)
                        })

                }
                var pCount = doc1[0].pCount + 1;
                var uCount = doc1[0].uCount + 1;
                db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $set: { "pCount": pCount, "uCount": uCount } }, function (err, doc2) {
                })
                //   })
                res.json(doc)
            })


        })


    });



}