module.exports = function (app) {

    var mongojs = require('mongojs');
    var bodyParser = require("body-parser");
    var multer = require('multer');
    var fs = require('fs');
    var path = require("path");
    var db = require('../dbDeclarations').url;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    console.log("Manual Server is running");
    var Promise = require('bluebird')
    var fs = require('fs');


    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    const getCollection = function (collection, callback) {
        collection.find({}).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else if (result.length > 0) {
                callback(result);
            }
        });
    }

    getCollection(db.MatchKeyWord, function (result) {

        MatchWordsData = result;

    })

    getCollection(db.countInc, function (result) {

        objectCreationParameters = result[0].objectCreationParameters;

        connectingParameters = result[0].connectingParameters;
        assertionParameters = result[0].assertionParameters;
    })

    getCollection(db.assertions, function (result) {
        assertionCollectionData = result;


    })
    getCollection(db.countInc, function (result) {
        newScriptId = result[0].sCount;


    })
    // var objFilteredBasedOnProjectId = new Array();
    var getObjectsBasedOnProjectId = (proId) => new Promise((resolve, reject) => {
        // function getObjectsBasedOnProjectId(proId) {
        db.objectRepository.find({ "projectId": proId }, function (err, doc) {
            resolve(doc);
        })
    })

    ////////////// POST REQUEST  &  MATCHING & COMBINING WORDS& FINAL WORDS////////////////
    app.post('/manualTest', function (req, res) {
        var allDataCase = req.body;

        for (var key in allDataCase) {

            MatchWordsData.forEach(element => {


                if (element.actions == allDataCase[key].actions) {
                    allDataCase[key].words = element.words;

                    allDataCase[key].finalWord = element.finalWord;


                }
            });
        }

        mappingObjects(allDataCase)
    })

    ////////////// Loop for Asiging the input to Objects/////////////
    function mappingObjects(allResult) {
        allResult.forEach(result => {
            if (result.object == undefined) {

                result.object = result.input.split(".")[1];
                console.log(result.object)
            }

            if (result.actions == "sendKeys") {

                result.object = "valid" + "  " + result.object + " " + "in" + " " + result.object;
            }



            console.log(result.words + " " + result.object + " " + result.finalWord);

            if (result.input == undefined) {

                result.input = "";
            }




        })





        excelDisplay(allResult)
    }


    //////////// For Displaying in Excel////////////////////
    function excelDisplay(allResult) {

        var data = '';
        var allHeader = "Sl No" + "\t" + "Test Step" + "\t" + "Input" + "\n";
        fs.appendFileSync('Filename1.xls', allHeader);

        for (var i = 0; i < allResult.length; i++) {

            data = data + (i + 1) + '\t' + allResult[i].words + ' ' + allResult[i].object + ' ' + allResult[i].finalWord + '\t' + allResult[i].input + '\n';
        }


        fs.appendFileSync('Filename1.xls', data);

        //  fs.appendFileSync('Filename1.xls', data, (err) => {
        //      if (err) throw err;
        //      console.log('File created');
        //  });
    }




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


    actionCollectionData = [];


    db.MatchKeyWord.aggregate([
        {
            $lookup:
            {
                from: "actionList",
                localField: "actions",
                foreignField: "actionList",
                as: "allMethod"
            }
        },
        { $project: { "allMethod": 1, "words": 1 } },
        { $unwind: "$allMethod" },
        {
            $lookup:
            {
                from: "groups",
                localField: "allMethod.groupId",
                foreignField: "groupId",
                as: "allResult"
            }
        },
        { $project: { "allMethod.actionList": 1, "words": 1, "allResult.groupName": 1 } },
    ]
        , function (err, ruslt) {
            // console.log("macha");

            //  console.log(ruslt);


            actionCollectionData = ruslt;
        })



    // db.MatchKeyWord.aggregate([
    //     {
    //         $lookup:
    //         {
    //             from: "Actions",
    //             localField: "actions",
    //             foreignField: "actions",
    //             as: "allMethod"
    //         }
    //     },
    //     { $project: { "allMethod": 1, "words": 1 } },
    //     { $unwind: "$allMethod" }
    // ], function (err, ruslt) {

    //      console.log(ruslt);
    //      console.log("ruslffffffffffffffffffffffffffffffffffft");

    //     actionCollectionData = ruslt;





    // })






    app.post("/readExcelRows", upload.any(), function (req, res) {
        // console.log(req.params.inputs);
        console.log("readExcelRows");
        // res.send(req.files);
        console.log(req.files[0].filename)
        var XLSX = require('xlsx');
        var tempPath = "../uploads/importExcel/" + req.files[0].filename;
        var scriptPath = path.join(__dirname, tempPath);
        var workbook = XLSX.readFile(scriptPath);
        //       var workbook = XLSX.readFile(__dirname +'/uploads'+ req.files[0].filename);  
        var sheet_name_list = workbook.SheetNames;
        data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        console.log(data.length);



        workbook = XLSX.readFile(scriptPath, { sheetRows: 100 })
        let sheetsList = workbook.SheetNames;
        var sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
            header: 1,

            blankrows: true
        });
        res.json(sheetData);



    });//Reads excel sheet and converts it into array of rows


    // //fetching project config data
    // function proConfig(proId){
    //     console.log('inside proconfig')
    // db.projectSelection.find({"projectId":proId},function(err,doc){
    //     console.log(doc)
    //     projectConfigData=doc[0].projectConfigdata
    //  })
    // }

    ////////////////////////Start  Displaying  Scripts//////////////////////
    var allActitons = [];
    var allActitons1 = [];
    var editCTCase;
    alAction = {}
    compeleteArray = [];
    var allCol = [];
    var allrow = [];
    var allDataSend = []
    var projectConfigData;
    app.post('/allInputs', function (req, res) {


        //     proConfig(req.body.projectId)
        console.log('machahahah')
        //    console.log(projectConfigData)
        var objFilteredBasedOnProjectId = new Array();
        console.log(objFilteredBasedOnProjectId.length, "      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ")
        getObjectsBasedOnProjectId(req.body.projectId).then((result) => {
            objFilteredBasedOnProjectId = result;

            var pushObject12 = [];
            var count = 0;
            var allActitons1 = [];
            var editCTCase;
            alAction = {}
            compeleteArray = [];
            var allCol = [];
            var allrow = [];
            var allDataSend = []
            var collectCase = false;
            var allActitons = [];
            var pushObject = [];
            var actionName;
            var actionTestNg;
            var oneObject;

            //to check whether test case name title given by user is as same as test case name title present in excel sheet
            if (req.body.resultRows[req.body.inputExcel.testValue - 1][0] == req.body.inputExcel.name) {
                let givenAlphabet = 'D';
                var firstTestCaseNameStepCol = req.body.inputExcel.value;//test case steps column 
                let alpbbCatch = [


                    {
                        "letter": "A",
                        "index": 0
                    },
                    {
                        "letter": "B",
                        "index": 1
                    },
                    {
                        "letter": "C",
                        "index": 2
                    },
                    {
                        "letter": "D",
                        "index": 3
                    },
                    {
                        "letter": "E",
                        "index": 4
                    },
                    {
                        "letter": "F",
                        "index": 5
                    },
                    {
                        "letter": "G",
                        "index": 6
                    },
                    {
                        "letter": "H",
                        "index": 7
                    },
                    {
                        "letter": "I",
                        "index": 8
                    },
                    {
                        "letter": "J",
                        "index": 9
                    },
                    {
                        "letter": "K",
                        "index": 10
                    },
                    {
                        "letter": "L",
                        "index": 11
                    },

                    {
                        "letter": "M",
                        "index": 12
                    },
                    {
                        "letter": "N",
                        "index": 13
                    },
                    {
                        "letter": "O",
                        "index": 14
                    },
                    {
                        "letter": "P",
                        "index": 15
                    },
                    {
                        "letter": "Q",
                        "index": 16
                    },
                    {
                        "letter": "R",
                        "index": 17
                    },
                    {
                        "letter": "S",
                        "index": 18
                    },
                    {
                        "letter": "T",
                        "index": 19
                    },
                    {
                        "letter": "U",
                        "index": 20
                    },
                    {
                        "letter": "V",
                        "index": 21
                    },
                    {
                        "letter": "W",
                        "index": 21
                    },
                    {
                        "letter": "X",
                        "index": 23
                    },
                    {
                        "letter": "Y",
                        "index": 24
                    },
                    {
                        "letter": "Z",
                        "index": 25
                    },

                ]
                let booksByStoreID = alpbbCatch.filter(
                    alphabet => alphabet.letter === firstTestCaseNameStepCol.toUpperCase());
                console.log(booksByStoreID[0].index);
                firstTestCaseNameStepCol = booksByStoreID[0].index;//we assign index version of alphabet example: b -> 1 (check above array of objects )  )
                // console.log(req.body.resultRows.length);
                console.log(" vijsyeye staat   lettter");

                let iamStarting = null;
                let iamEnding = null;

                let stepDifferenceValue = 7;
                let nextStepStartingPoint = null;
                let firstTestCase = true;
                var allTests = req.body.inputExcel.testStep.split(",")
                let stepNameWritten = allTests[0] - 1;
                console.log(stepNameWritten);
                var stepRow = stepNameWritten;
                let textDataLocation = allTests[1];

                let booksByStoreSteps = alpbbCatch.filter(
                    alphabet => alphabet.letter === textDataLocation.toUpperCase());
                textDataLocation = booksByStoreSteps[0].index;


                let inputDataLocation = req.body.inputExcel.testData;
                let booksByStoreinputs = alpbbCatch.filter(
                    alphabet => alphabet.letter === inputDataLocation.toUpperCase());
                inputDataLocation = booksByStoreinputs[0].index;


                var firstTestCaseNameStepRow = req.body.inputExcel.testValue - 1; //Test case name title row 
                console.log(firstTestCaseNameStepRow);
                // var firstTestCaseNameStepCol = req.body.inputExcel.value;
                console.log(firstTestCaseNameStepCol);

                let testCaseNameField = null;
                let finalTestCase = {};
                let allInputs = [];
                let allInputs1 = [];
                finalALl444 = [];
                finalALl123 = [];
                newSteps123 = [];
                newSteps444 = [];
                allDataSend = [];
                let testcase1;
                let testcase2;



                let headerDataSteps = req.body.resultRows[stepNameWritten - 1][textDataLocation]; //Assigning test steps header name which is "TestStep" in our example
                let headerDataInput = req.body.resultRows[stepNameWritten - 1][textDataLocation + 1]//Assigning test data header name which is "Test Data" in our example

                let testCase1 = req.body.resultRows[firstTestCaseNameStepRow][firstTestCaseNameStepCol] // assigning Test case name which is "Project First" in our example
                console.log(testCase1 + "kkkkkkkkkkkkkkkkkkkkk");
                var finalALl = []


                testCaseNameField = req.body.resultRows[firstTestCaseNameStepRow][firstTestCaseNameStepCol] // assigning Test case name which is "Project First" in our example

                let lastTestCaseEnd = req.body.resultRows.length - 1; //Last row index of the array

                //iterating over Array of rows obtained from excel sheet using /readExcelRows api
                req.body.resultRows.forEach((execlRowData, index) => {

                    //why use foreach when we have for loop?


                    if (execlRowData.length == 0) {

                        iamEnding = true;
                        firstTestCase = false;

                    } else if (iamEnding == true) {
                        iamEnding = false;
                        iamStarting = true;
                        count++;

                        if (count == 2) {
                            testcase1 = testCaseNameField;
                            validationCall('close', execlRowData, testCaseNameField)
                        }


                        nextStepStartingPoint = index + stepDifferenceValue;


                        endObject("ended", null, testCaseNameField)
                        testCaseNameField = execlRowData[1];
                        // db.countInc.find(function(err,doc){
                        //     // console.log(doc);
                        //     newScriptId=doc[0].sCount;
                        //     // console.log(newScriptId)
                        //     updateMine(doc)

                        //  })



                    } else if (iamStarting == true && nextStepStartingPoint === index + 1) {
                        pushObject12 = [];

                        iamStarting = false;

                    } else if (firstTestCase == false && nextStepStartingPoint <= index + 1) {
                        makeObject("started", startReadingSteps("started", testCaseNameField, execlRowData), testCaseNameField)



                        if (count == 1) {

                            validationCall('second', execlRowData, testCaseNameField)

                        }


                    } else if (firstTestCase == true && stepNameWritten <= index) {

                        // console.log(testCaseNameField);
                        testcase2 = testCaseNameField;


                        validationCall("first", execlRowData, testCaseNameField)
                        makeObject("started", startReadingSteps("started", testCaseNameField, execlRowData), testCaseNameField)

                    }


                    //dont mix with first if conditions////
                    if (lastTestCaseEnd == index) {

                        endObject("ended", null, testCaseNameField)
                        // db.countInc.find(function(err,doc){
                        //     // console.log(doc);
                        //     newScriptId=doc[0].sCount;
                        //     console.log(newScriptId)
                        //     updateMine(doc)

                        //  })


                    }

                });
                //
                function validationCall(condition, execlRowData, testCaseName) {
                    // console.log("   execlRowData   execlRowData");


                    if (condition == 'first') {
                        var alSteps = {}
                        alSteps["steps1"] = execlRowData[1];
                        alSteps["testData"] = execlRowData[2];
                        newSteps123.push(alSteps);


                    } else if (condition == 'second') {


                        var alSteps = {}
                        alSteps["steps1"] = execlRowData[1];
                        alSteps["testData"] = execlRowData[2];
                        newSteps444.push(alSteps)


                    } else {

                        var allInputs = {
                            "testCaseNameHeading": req.body.inputExcel.name,
                            "allSteps": newSteps123,
                            "testCaseName": testcase2,
                            "headStep": headerDataSteps,
                            "headData": headerDataInput
                        }
                        allDataSend.push(allInputs);
                        var allInputs = {
                            "testCaseNameHeading": req.body.inputExcel.name,
                            "allSteps": newSteps444,
                            "testCaseName": testcase1,
                            "headStep": headerDataSteps,
                            "headData": headerDataInput
                        }
                        allDataSend.push(allInputs);


                        res.json(allDataSend);
                    }

                }// used to show user whether functions are reading data from Excel sheet in a right way or not. 
                //(In other words,Info required for Table confirmation popup which comes up after clicking on the save button
                // is generated in validationCall()


                let scriptId = 56;
                function getScriptId() {

                    db.countInc.find(function (err, doc) {

                        newScriptId = doc[0].sCount;
                        scriptId = doc[0].sCount;
                        console.log("   scriptId    scriptId ", scriptId)
                        //  updateMine(doc)

                    })
                    setTimeout(() => {
                        console.log("hhhhh hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                        return scriptId;

                    }, 1000);


                }

                function updateScriptId(id) {
                    console.log(' iddd ', id)
                    db.countInc.update({ "projectID": "pID" }, { $set: { "sCount": Number(id) } })


                }

                function createConfigFile(info, scriptName) {
                    console.log("writeScriptLevelConfigDatawriteScriptLevelConfigData")
                    var scriptFile = "./uploads/opal/" + info.projectName + "/src/test/java/" + "/" + info.moduleName + "/" + info.featureName + "/" + scriptName + "Config" + ".json";
                    fs.createWriteStream(scriptFile);
                    console.log("  fs.createWriteStream(scriptFile) ");

                    var firstline = "\"ImplicitWait\"" + ":\"" + info.projectConfig.settimeOut + "\"" + "\n";
                    var secondline = "\"Browser\"" + ":" + "\"" + info.projectConfig.defaultBrowser + "\"" + ",\n";
                    var thridline = "\"Version\"" + ":" + "\"" + info.projectConfig.defaultVersion + "\"" + "\n";
                    var fourthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:4444" + "\"" + "\n";

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
                    var scriptFile1 = "./uploads/opal/" + info.projectName + "/src/test/java/" + "/" + info.moduleName + "/" + info.featureName + "/" + scriptName + ".java"
                    fs.createWriteStream(scriptFile1);

                }

                function endObject(condition, obj, testCaseNameField) {
                    console.log(newScriptId);
                    newScriptId++
                    db.testScript.insert({
                        "scriptName": testCaseNameField,
                        "projectId": req.body.projectId,
                        "moduleId": req.body.moduleId,
                        "featureId": req.body.featureId,
                        "scriptId": "sID" + newScriptId,
                        "priorityId": "p01",
                        "typeId": "t01",
                        "scriptConfigdata": {
                            "time": Number(req.body.projectConfig.settimeOut),
                            "defaultBrowser": req.body.projectConfig.defaultBrowser,
                            "defaultVersion": req.body.projectConfig.defaultVersion
                        },
                        "description": "Imported from excel",
                        // "scriptId":"567",
                        "compeleteArray": [{
                            "allObjectData": {
                                versionId: 1,
                                allActitons: pushObject12
                            }
                        }]
                    })
                    updateScriptId(newScriptId)
                    createConfigFile(req.body, testCaseNameField)
                    // ,function (doc,err) {


                    // })




                    // getScriptId(function(callback) {
                    //     console.log(callback,'caller');
                    //     db.testScript.insert({
                    //         "scriptName": testCaseNameField,
                    //         "projectId": req.body.projectId,
                    //         "moduleId": req.body.moduleId,
                    //         "featureId": req.body.featureId,
                    //       //  "scriptId":newScriptId,
                    //         "scriptId":callback,
                    //         "compeleteArray": [{
                    //             "allObjectData": {
                    //                 versionId: 1,
                    //                 allActitons: pushObject12
                    //             }
                    //         }]
                    //     })
                    // })


                    //})

                }//whole script info object will be created and inserted into DB.


                function updateMine(doc1) {
                    var nextInc = doc1[0].sCount + 1;
                    console.log(nextInc + "ftftftftft");
                    db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $set: { "sCount": nextInc } }, function (err, doc2) {

                    })
                }
                //validationCall(execlRowData)


                function makeObject(condition, obj, testCaseNameField) {


                    if (obj.object === undefined) {
                        console.log("ccccccccccccccccccccccc")
                        console.log(obj);
                        obj.object = {}
                        obj.object.objName = '';
                        obj.object.pageName = '';
                        obj.object.pom = '';
                    }

                    if (condition == "started") {
                        var scriptConfigdata = {};
                        scriptConfigdata["Action"] = obj.actions.actionName;
                        scriptConfigdata["ActionList"] = obj.actions.actionName;
                        scriptConfigdata["Input2"] = obj.inputs;
                        scriptConfigdata["Input3"] = "";
                        scriptConfigdata["Object"] = obj.object.objName;
                        scriptConfigdata["Excel"] = "notExcel";
                        scriptConfigdata["ReturnsValue"] = "";
                        scriptConfigdata["Page"] = obj.object.pageName;
                        scriptConfigdata["PomObject"] = obj.object.pom;
                        scriptConfigdata["nlpData"] = "itsFromAutomation";


                        scriptConfigdata["classObject"] = "";
                        scriptConfigdata["classFile"] = "";
                        scriptConfigdata["finalWord"] = "";
                        scriptConfigdata["type"] = "Actions";
                        scriptConfigdata["Groups"] = obj.actions.actionTestNg;
                        pushObject12.push(scriptConfigdata)



                    } else if (condition == "ended") {


                    }




                }//creates object which contain info regarding each test case step 


                function startReadingSteps(condition, testCaseName, rowData) {

                    return {
                        "inputs": findingInputs(rowData[inputDataLocation]),
                        "actions": findingActions(rowData[textDataLocation]),
                        "object": findingObject(rowData[textDataLocation]),

                    }

                }

                function findingObject(objectText) {
                    // let returnValue = null;
                    let oneObject;
                    let pName = "";
                    let pom = "";
                    MatchWordsData.forEach((element, index, array) => {

                        if (element.words != undefined && objectText.toLowerCase().includes(element.words) == true) {

                            var array2 = objectText.toLowerCase().split(/(\s+)/).filter(function (e) { // splits at spaces
                                return e.trim().length > 0;
                            });
                            var positionConnectingWord = array2.findIndex(x => x == array2.filter(e => connectingParameters.includes(e))[0])

                            if (positionConnectingWord != -1) {
                                oneObject1 = array2[positionConnectingWord + 1];
                                console.log('qazwsx')
                                oneObject = objectMatchingWithDb(oneObject1)
                                console.log(oneObject)


                                // console.log(oneObject + " objjj");
                                //return oneObject;
                                //  returnValue = oneObject;
                            } else {
                                var positionNonConnectingWord = array2.findIndex(x => x == array2.filter(e => objectCreationParameters.includes(e))[0])
                                if (positionNonConnectingWord != -1) {

                                    oneObject1 = array2[positionNonConnectingWord + 1];

                                    console.log('qazwsx')
                                    oneObject = objectMatchingWithDb(oneObject1)
                                    console.log(oneObject)

                                    // console.log(oneObject + " objjj");
                                    // returnValue = oneObject;

                                }
                                //  else {

                                // }

                            }




                        }


                    });

                    return oneObject;
                    // console.log('mic check')
                    // console.log(objFilteredBasedOnProjectId)

                    function objectMatchingWithDb(reqObject) {
                        
                        let c = objFilteredBasedOnProjectId.filter((element, index, array) => {

                            var d = element.objectName.filter(mycall);
                            
                            if (d.length > 0) {


                                // try {
                                    
                                    if (d[0].pName == element.pageName) {
                                        element.data = d[0];
                                        return element
                                    }
                                // } catch (error) {
                                    // console.log(error)

                                    // element.data = [{
                                    //     objectName:'',
                                    //     pName:'',
                                    //     pomObject:''
                                    // }]

                                    //  return element;
                                }
                            



                            function mycall(ele, ind, array) {
                                console.log('vijay', ele.objectName, reqObject);
                                //console.log(reqObject)
                                if (ele.objectName.toLowerCase() == reqObject.toLowerCase()) {
                                    console.log("agggggggg")
                                    //   pName = element.pageName;
                                    // pom = ele.pomObject;
                                    // return {
                                    //     "objName": reqObject,
                                    //     "pageName": pName,
                                    //     "pom": pom
                                    // }
                                    ele.pName = element.pageName
                                    return ele;
                                }
                                // else{
                                //     return ; 
                                // }
                            }



                        })

                        if (c.length > 0) {
                            
                            return {
                                "objName": c[0].data.objectName,
                                "pageName": c[0].data.pName,
                                "pom": c[0].data.pomObject
                            }

                        } else {
                            return {
                                "objName": "",
                                "pageName": "",
                                "pom": ""
                            }
                        }

                        // for (let index = 0; index < c.length; index++) {
                        //     try{
                        //         if (c[i].data.objectName!=='' || c[i].data.objectName!== undefined ){
                        //             return {

                        //                 "objName": c[i].data.objectName,
                        //                 "pageName": c[i].data.pName,
                        //                 "pom": c[i].data.pomObject
                        //             }

                        //         } 
                        //     }
                        //     catch(error){
                        //         // console.log(error);
                        //     }
                        // }
                        // return{
                        //         "objName": "",
                        //         "pageName": "",
                        //         "pom":""
                        // }

                    }

                    // objFilteredBasedOnProjectId.map((pages,index) => )
                    //    objFilteredBasedOnProjectId.forEach(pageNames)
                    //    function pageNames(page,index) {
                    //     page.objectName.filter(objectNames)
                    //    }
                    //    function objectNames(object,index) {
                    //      if (object.objectName === reqObject ) {
                    //       //  pName = object.pageName;
                    //         pom = object.pomObject;

                    //      }
                    //    }





                    //  }
                    // return oneObject;

                } ////////Closing thr objects Function

                function findingActions(actionText) {
                    //  console.log(actionText);
                    //  console.log(actionCollectionData[0].allResult);

                    actionCollectionData.forEach(element => {
                        // if (element.allMethod.matchKeyWord != undefined && actionText.toLowerCase().includes(element.words) == true) {
                        // console.log(actionCollectionData[0].allResult.groupName);

                        if (element.words != undefined && actionText.toLowerCase().includes(element.words) == true) {

                            // console.log(element.allMethod.actionList);
                            // console.log(element.allResult[0].groupName);

                            actionName = element.allMethod.actionList;
                            actionTestNg = element.allResult[0].groupName;

                            // var hw = actionName+w 




                        }

                    })

                    assertionCollectionData.forEach(element => {
                        if (element.matchKeyWord != undefined && actionText.toLowerCase().includes(element.matchKeyWord) == true) {

                            actionName = element.actions;
                            actionTestNg = element.testNgKey;

                            console.log(element.actions);
                            console.log(element.testNgKey);

                        }

                    });
                    return {
                        "actionName": actionName,
                        "actionTestNg": actionTestNg
                    };

                } //////////////Closing the Function action

                function findingInputs(inputText) {

                    if (inputText) { //Reading  the test data

                        var inputs = inputText.split("=")[1];
                        //  console.log(inputs);

                        return inputs
                    }



                } /////////closing the   Input Function


            }

        })

    })








    // app.post('/allInputs', function (req, res) {
    //     var pushObject12 = [];
    //     var count = 0;
    //     var allActitons1 = [];
    //     var editCTCase;
    //     alAction = {}
    //     compeleteArray = [];
    //     var allCol = [];
    //     var allrow = [];
    //     var allDataSend = []
    //     var collectCase = false;
    //     var allActitons = [];
    //     var pushObject = [];
    //     var actionName;
    //     var actionTestNg;
    //     var oneObject;  

    //     if (req.body.resultRows[req.body.inputExcel.testValue-1][0] == req.body.inputExcel.name) {
    //         let givenAlphabet = 'D';
    //         var firstTestCaseNameStepCol = req.body.inputExcel.value;
    //   let  alpbbCatch =[


    //         { "letter":"A","index" :0},
    //         { "letter":"B","index" :1},
    //         { "letter":"C","index" :2},
    //         { "letter":"D","index" :3},
    //         { "letter":"E","index" :4},
    //         { "letter":"F","index" :5},
    //         { "letter":"G","index" :6},
    //         { "letter":"H","index" :7},
    //         { "letter":"I","index" :8},
    //         { "letter":"J","index" :9},
    //         { "letter":"K","index" :10},
    //         { "letter":"L","index" :11},

    //         { "letter":"M","index" :12},
    //         { "letter":"N","index" :13},
    //         { "letter":"O","index" :14},
    //         { "letter":"P","index" :15},
    //         { "letter":"Q","index" :16},
    //         { "letter":"R","index" :17},
    //         { "letter":"S","index" :18},
    //         { "letter":"T","index" :19},
    //         { "letter":"U","index" :20},
    //         { "letter":"V","index" :21},
    //         { "letter":"W","index" :21},
    //         { "letter":"X","index" :23},
    //         { "letter":"Y","index" :24},
    //         { "letter":"Z","index" :25},

    //     ]
    //     let booksByStoreID = alpbbCatch.filter(
    //         alphabet => alphabet.letter === firstTestCaseNameStepCol.toUpperCase());
    //      console.log( booksByStoreID[0].index);
    //      firstTestCaseNameStepCol=booksByStoreID[0].index;
    //         // console.log(req.body.resultRows.length);
    //         console.log(" vijsyeye staat   lettter");

    //         let iamStarting = null;
    //         let iamEnding = null;

    //         let stepDifferenceValue = 7;
    //         let nextStepStartingPoint = null;
    //         let firstTestCase = true;
    //         var allTests = req.body.inputExcel.testStep.split(",")
    //         let stepNameWritten = allTests[0]-1;
    //         console.log(stepNameWritten);
    //         var stepRow=stepNameWritten;
    //         let textDataLocation = allTests[1];

    //         let booksByStoreSteps = alpbbCatch.filter(
    //             alphabet => alphabet.letter === textDataLocation.toUpperCase());
    //             textDataLocation=booksByStoreSteps[0].index;


    //         let inputDataLocation = req.body.inputExcel.testData;
    //         let booksByStoreinputs = alpbbCatch.filter(
    //             alphabet => alphabet.letter === inputDataLocation.toUpperCase());
    //             inputDataLocation=booksByStoreinputs[0].index;


    //         var firstTestCaseNameStepRow = req.body.inputExcel.testValue-1;
    //         console.log(firstTestCaseNameStepRow);
    //         // var firstTestCaseNameStepCol = req.body.inputExcel.value;
    //         console.log(firstTestCaseNameStepCol);

    //         let testCaseNameField = null;
    //         let finalTestCase={};
    //         let allInputs=[];
    //         let allInputs1=[];
    //         finalALl444=[];
    //         finalALl123=[];
    //         newSteps123=[];
    //         newSteps444=[];
    //         allDataSend=[];
    //         let testcase1;
    //         let testcase2;

    //         let headerDataSteps = req.body.resultRows[stepNameWritten -1][textDataLocation];
    //         let headerDataInput = req.body.resultRows[stepNameWritten -1][textDataLocation+1]

    //         let testCase1=req.body.resultRows[firstTestCaseNameStepRow][firstTestCaseNameStepCol]
    //         console.log(testCase1+"kkkkkkkkkkkkkkkkkkkkk");
    //         var finalALl=[]


    //         testCaseNameField = req.body.resultRows[firstTestCaseNameStepRow][firstTestCaseNameStepCol]

    //         let lastTestCaseEnd = req.body.resultRows.length - 1;
    //         req.body.resultRows.forEach((execlRowData, index) => {




    //             if (execlRowData.length == 0) {

    //                 iamEnding = true;
    //                 firstTestCase = false;

    //             } else if (iamEnding == true) {
    //                 iamEnding = false;
    //                 iamStarting = true;
    //                 count++;

    //                 if(count == 2){
    //                      testcase1=testCaseNameField;
    //                     validationCall('close',execlRowData,testCaseNameField)
    //                 }


    //                 nextStepStartingPoint = index + stepDifferenceValue;


    //                 endObject("ended", null, testCaseNameField)
    //                 testCaseNameField = execlRowData[1];


    //             } else if (iamStarting == true && nextStepStartingPoint === index + 1) {
    //                 pushObject12 = [];

    //                 iamStarting = false;

    //             } else if (firstTestCase == false && nextStepStartingPoint <= index + 1) {
    //                 makeObject("started", startReadingSteps("started", testCaseNameField, execlRowData), testCaseNameField)



    //                 if(count==1){

    //                     validationCall('second',execlRowData,testCaseNameField)

    //                 }


    //             } else if (firstTestCase == true && stepNameWritten <= index) {

    //                 console.log(testCaseNameField);
    //                    testcase2=testCaseNameField;


    //                 validationCall("first",execlRowData,testCaseNameField)
    //                 makeObject("started", startReadingSteps("started", testCaseNameField, execlRowData), testCaseNameField)

    //             }


    //             //dont mix with first if conditions////
    //             if (lastTestCaseEnd == index) {
    //                 endObject("ended", null, testCaseNameField)

    //             }

    //         });

    //         function validationCall(condition,execlRowData,testCaseName){
    //            // console.log("   execlRowData   execlRowData");


    //             if(condition == 'first'){
    //                 var alSteps={}
    //                 alSteps["steps1"]=execlRowData[1];
    //                 alSteps["testData"]=execlRowData[2];
    //                 newSteps123.push(alSteps);


    //             }else if(condition == 'second'){


    //                 var alSteps={}
    //                 alSteps["steps1"]=execlRowData[1];
    //                 alSteps["testData"]=execlRowData[2];
    //                 newSteps444.push(alSteps)


    //             }else{

    //                var  allInputs={
    //                     "testCaseNameHeading":req.body.inputExcel.name,
    //                     "allSteps":newSteps123,
    //                     "testCaseName":testcase2,
    //                     "headStep":headerDataSteps,
    //                     "headData":headerDataInput
    //                 }
    //                 allDataSend.push(allInputs);
    //                 var  allInputs={
    //                     "testCaseNameHeading":req.body.inputExcel.name,
    //                     "allSteps":newSteps444,
    //                     "testCaseName":testcase1,
    //                     "headStep":headerDataSteps,
    //                     "headData":headerDataInput
    //                 }
    //                 allDataSend.push(allInputs);


    //                 res.json(allDataSend);
    //             }




    //         }


    //         function endObject(condition, obj, testCaseNameField) {


    //             db.testScript.insert({
    //                 "scriptName": testCaseNameField, "projectId": req.body.projectId,
    //                 "moduleId": req.body.moduleId, "featureId": req.body.featureId,
    //                 "compeleteArray": [{
    //                     "allObjectData": {
    //                         versionId: 1,
    //                         allActitons: pushObject12
    //                     }
    //                 }]
    //             })


    //         }
    //         //validationCall(execlRowData)


    //         function makeObject(condition, obj, testCaseNameField) {


    //             if (condition == "started") {
    //                 var scriptConfigdata = {};
    //                 scriptConfigdata["actions"] = obj.actions.actionName;
    //                 scriptConfigdata["input"] = obj.inputs;
    //                 scriptConfigdata["object"] = obj.object;
    //                 scriptConfigdata["excel"] = "";
    //                 scriptConfigdata["pageName"] = "";
    //                 scriptConfigdata["classObject"] = "";
    //                 scriptConfigdata["classFile"] = "";
    //                 scriptConfigdata["finalWord"] = "";
    //                 scriptConfigdata["type"] = "Actions";
    //                 scriptConfigdata["testNgKey"] = obj.actions.actionTestNg;
    //                 pushObject12.push(scriptConfigdata)


    //             } else if (condition == "ended") {


    //             }






    //         }


    //         function startReadingSteps(condition, testCaseName, rowData) {

    //             return {
    //                 "inputs": findingInputs(rowData[inputDataLocation]), "actions": findingActions(rowData[textDataLocation])
    //                 , "object": findingObject(rowData[textDataLocation])
    //             }

    //         }

    //         function findingObject(objectText) {
    //             // let returnValue = null;
    //             let oneObject;
    //             MatchWordsData.forEach((element, index, array) => {

    //                 if (element.words != undefined && objectText.toLowerCase().includes(element.words) == true) {

    //                     var array2 = objectText.toLowerCase().split(/(\s+)/).filter(function (e) {
    //                         return e.trim().length > 0;
    //                     });
    //                     var positionConnectingWord = array2.findIndex(x => x == array2.filter(e => connectingParameters.includes(e))[0])

    //                     if (positionConnectingWord != -1) {
    //                         oneObject = array2[positionConnectingWord + 1];
    //                         // console.log(oneObject + " objjj");
    //                         //return oneObject;
    //                         //  returnValue = oneObject;
    //                     } else {
    //                         var positionNonConnectingWord = array2.findIndex(x => x == array2.filter(e => objectCreationParameters.includes(e))[0])
    //                         if (positionNonConnectingWord != -1) {
    //                             ;
    //                             oneObject = array2[positionNonConnectingWord + 1];


    //                             // console.log(oneObject + " objjj");
    //                             // returnValue = oneObject;

    //                         } else {

    //                         }

    //                     }




    //                 }


    //             });
    //             return oneObject;

    //         }////////Closing thr objects Function

    //         function findingActions(actionText) {
    //              //console.log(actionText);
    //             //  console.log(actionCollectionData);

    //             actionCollectionData.forEach(element => {


    //                 if (element.allMethod.matchKeyWord != undefined && actionText.toLowerCase().includes(element.words) == true) {

    //                     console.log(element.allMethod.actions);
    //                     console.log(element.allMethod.testNgKey);

    //                     actionName = element.allMethod.actions;
    //                     actionTestNg = element.allMethod.testNgKey;

    //                     // var hw = actionName+w 





    //                 }

    //             })

    //             assertionCollectionData.forEach(element => {
    //                 if (element.matchKeyWord != undefined && actionText.toLowerCase().includes(element.matchKeyWord) == true) {

    //                     actionName = element.actions;
    //                     actionTestNg = element.testNgKey;

    //                     console.log(element.allMethod.actions);
    //                     console.log(element.allMethod.testNgKey);

    //                 }

    //             });
    //             return { "actionName": actionName, "actionTestNg": actionTestNg };

    //         }//////////////Closing the Function action

    //         function findingInputs(inputText) {

    //             if (inputText) {  //Reading  the test data

    //                 var inputs = inputText.split("=")[1];
    //                 //  console.log(inputs);

    //                 return inputs
    //             }



    //         }/////////closing the   Input Function


    //     }







    // })



}





