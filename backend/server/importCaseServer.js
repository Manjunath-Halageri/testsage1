module.exports = function (app) {
    var bodyParser = require("body-parser");
    var multer = require('multer');
    var fs = require('fs');
    var path = require("path");
    var LineByLineReader = require('line-by-line');
    var db = require('../dbDeclarations').url;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    console.log("IMPORT TEST server is running");
    var Promise = require('bluebird')
    var fs = require('fs');


    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /////////////////////////  Written By Shivanand//////////////////


    var storage = multer.diskStorage({

        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
        destination: function (req, file, cb) {
            var storedPath = "../uploads/importExcel/";
            var finalStoredPath = path.join(__dirname, storedPath)
            var newDestination = finalStoredPath;
            cb(null, newDestination);
        }
    });

    var upload = multer(
        {
            dest: "uploads/",
            limits: {
                fieldNameSize: 100,
                fileSize: 60000000
            },
            storage: storage
        });

    app.post("/readExcelData", upload.any(), function (req, res) {

        console.log("readExcelData");
        res.send(req.files);
        console.log(req.files[0].filename)
        var XLSX = require('xlsx');
        var tempPath = "../uploads/allExcel/" + req.files[0].filename;
        var scriptPath = path.join(__dirname, tempPath);
        var workbook = XLSX.readFile(scriptPath);
        //       var workbook = XLSX.readFile(__dirname +'/uploads'+ req.files[0].filename);  
        var sheet_name_list = workbook.SheetNames;
        data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        console.log(data)

        excelDataCall(data)

    });





    var db = require('../dbDeclarations').url;
    var actionCollectionData = [];
    var assertionCollectionData = [];
    var objectCreationParameters = [];
    var connectingParameters = [];
    var assertionParameters = [];
    //const getCollection = require('./getCollectionsData');
    const getCollection = function (collection, callback) {
        collection.find({}).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else if (result.length > 0) {
                callback(result);
            }
        });
    }




    db.MatchKeyWord.aggregate([
        {
            $lookup:
            {
                from: "Actions",
                localField: "actions",
                foreignField: "actions",
                as: "allMethod"
            }
        },
        { $project: { "allMethod": 1, "words": 1 } },
        { $unwind: "$allMethod" }
    ], function (err, ruslt) {

        // console.log(ruslt);

        actionCollectionData = ruslt;




    })


    getCollection(db.Actions, function (result) {

        //actionCollectionData = result;
    })
    getCollection(db.countInc, function (result) {

        objectCreationParameters = result[0].objectCreationParameters;
        connectingParameters = result[0].connectingParameters;
        assertionParameters = result[0].assertionParameters;
    })

    getCollection(db.assertions, function (result) {
        assertionCollectionData = result;


    })

    var excelDataCall = function (data) {


        var line3 = data;
        var testCaseSteps = 'Test Step';
        var fileName = "NewJava.java"
        fs.createWriteStream(fileName);
       // console.log("started excel");

        // actionCreation()
        // assertionActionCreation()
        // objectCreation()
        // fileCreate(line3)
        // process.nextTick(() => headerData(fileName));
        //    process.nextTick(() => actionCreation());
        //    process.nextTick(() => assertionActionCreation());
        //    process.nextTick(() =>    objectCreation());
        //headerData(fileName);
        actionCreation();
        assertionActionCreation();
        objectCreation();

        setImmediate(() => headerData(fileName, line3));





        function actionCreation() {
           // console.log("  actionCreation()  ")




            for (var key in line3) {

                actionCollectionData.forEach(element => {
                    //console.log("enter foreachhhhhhhhhh"); 
                    //console.log(element.allMethod.testNgMethod)

                    // console.log(actionCollectionData[element].allMethod);
                    if (element.allMethod.matchKeyWord != undefined && line3[key][testCaseSteps].toLowerCase().includes(element.words) == true) {
                        line3[key].actions = element.allMethod.testNgMethod;
                       // console.log(element.allMethod.testNgMethod);
                        line3[key].parameters = element.allMethod.parameters;

                        //    console.log(line3);
                    }
                });
                //}
            }
        }

        function assertionActionCreation() {
           // console.log(" assertionActionCreation()  called");

          
            for (var key in line3) {

              

                assertionCollectionData.forEach(element => {

                    // console.log(line3[key][testCaseSteps].toLowerCase())
                    // console.log(typeof (element.matchKeyWord))
                   

                    if (element.matchKeyWord != undefined && line3[key][testCaseSteps].toLowerCase().includes(element.matchKeyWord) == true) {

                       
                        line3[key].actions = element.testNgMethod;


                        line3[key].parameters = element.parameters;
                    }

                });
            }
        }
        // for object creation 
        function objectCreation() {
            console.log("  objectCreation()     ");
            for (var key in line3) {
                var array2 = line3[key][testCaseSteps].toLowerCase().split(/(\s+)/).filter(function (e) {
                    return e.trim().length > 0;
                });
                var positionConnectingWord = array2.findIndex(x => x == array2.filter(e => connectingParameters.includes(e))[0])
                //console.log(c);
                if (positionConnectingWord != -1) {
                    line3[key].object = array2[positionConnectingWord + 1];
                    // console.log(line3[key].object)
                    //console.log("object is "+array2[c+1]);

                } else {
                    //console.log("test   "+  array2.filter(e =>   objectCreationParameters.includes(e))[0])
                    var positionNonConnectingWord = array2.findIndex(x => x == array2.filter(e => objectCreationParameters.includes(e))[0])
                    if (positionNonConnectingWord != -1) {
                        line3[key].object = array2[positionNonConnectingWord + 1];
                        //console.log(line3[key].object);
                        // console.log("ooooooooo")
                        //console.log(line3[key]);
                        //console.log(" no connecting object is "+array2[c2+1]);
                    } else {
                        //console.log(array2);
                    }
                    // connecting is not present                           
                }
            }
        }





    }


    function headerData(fileName, line3) {

        var tempPath = "../autoScript/testNgTemplate/testngMainTemplate.java";


       // console.log(tempPath);
        var completePath = path.join(__dirname, tempPath);

        templateRead(fileName, completePath, line3)




    }

    function templateRead(fileName, testPath, line3) {
        var fileName = "importJava";
        var tempPath = "../uploads/opal/" + fileName + ".java";
        var scriptPath = path.join(__dirname, tempPath);
       // console.log(scriptPath);

        lr = new LineByLineReader(testPath);
        lr.on('error', function (err) {
        });

        lr.on('line', function (line) {
           // console.log(line);

            if (line.includes("fileName")) {

              //  console.log(line)
                var oldLine = line;
                var changeString = "fileName";

                var NewLine = oldLine.replace(changeString, fileName);
              //  console.log(NewLine);

                fs.appendFileSync(scriptPath, "\n" + NewLine);


            }
            else if (line.includes("Start")) {

                fileCreate(line3, scriptPath)
            }
            else {
                fs.appendFileSync(scriptPath, "\n" + line, 'utf8');
            }
        });



    }


    function fileCreate(line3, fileName) {
        console.log("  fileCreate(line3)  ")

        //console.log(line3)




        line3.forEach(element => {


           // console.log(element.actions);

            if (element.parameters == 1) {


                if (element.Input != undefined) {
                   // console.log("  fileCreate(line3)  " + element.actions.split("(")[0] + fileName)
                    fs.appendFileSync(fileName, element.actions.split("(")[0] + "(" + element.Input.split("=")[1] + ")" + '\n');
                } else {

                    fs.appendFileSync(fileName, element.actions.split("(")[0] + "(" + element.object + ")" + '\n');

                }


            } else {


                fs.appendFileSync(fileName, element.actions.split("(")[0] + "(" + element.object + "," + element.Input.split("=")[1] + ")" + '\n');



            }


            lr.on('end', function () {






            });

        });


        excelPostData(line3);


    }

    function excelPostData(line3) {
        var allDataExcel = [];

        line3.forEach(element => {



            if (element.parameters == 1) {



                if (element.Input != undefined) {
                    var inputAll = element.Input.split("=")[1]
                    // console.log(element.Input.split("=")[1])
                } else {

                }
            }
            else {
                inputAll = element.Input.split("=")[1]
            }

            //  console.log(element.Test Step);
            var actionAllData = {}

            actionAllData["action"] = element.actions.split("(")[0];
            //  action["testStep"]=element.Test Step;
            actionAllData["Input"] = inputAll;
            actionAllData["object"] = element.object;
            allDataExcel.push(actionAllData);
            //  console.log(allDataExcel)
        })




        db.importDataExcel.insert({ allDataExcel })
    }




    app.get('/readImportData',function(req,res){
        db.importDataExcel.find(function(err,doc){ 
        res.json(doc);
        //console.log(doc)
        })
        });






}





