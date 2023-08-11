module.exports = function (app) {
 
  const db = require('../dbDeclarations').url;
  app.get('/getTestScriptDetails:ss', function (req, res) {

    var data = req.params.ss;
    var data_Array = data.split(",");
    var moduleId = data_Array[0];
    var featureId = data_Array[1];
    var type = data_Array[2];
    var priority = data_Array[3];
    var projectId = data_Array[4];
    var releaseId = data_Array[5];
    var framework = data_Array[6];
    const keyvalue = ["moduleId",'featureId','typeId','priorityId',"projectId"]
    const keyvalue1 =  ["releaseData.moduleId",'releaseData.featureId','releaseData.typeId','releaseData.priorityId',"projectId"]
    console.log(moduleId,featureId,type,priority,projectId,releaseId,framework)             
    var count = 0;

    dataObj = {}

    for (var i = 0; i < 5; i++) {
      if (data_Array[i] !== "undefined") {

        if (releaseId !== "undefined"){
        dataObj[keyvalue1[i]] = data_Array[i];
        }
        else {
          dataObj[keyvalue[i]] = data_Array[i];
        }

      }
      

      if (i == 4) {
           dataObj["projectId"] = projectId;
          if(releaseId !== 'undefined'){
            db.release.aggregate([
              {$match:{"releaseVersion" : releaseId,"projectId" : projectId}},
              {$unwind:"$releaseData"},
              {$match:dataObj},
              {$project:
                {
                  featureId:"$releaseData.featureId",
              moduleId:"$releaseData.moduleId",
              typeId:"$releaseData.typeId",
              priorityId:"$releaseData.priorityId",
              moduleName:"$releaseData.moduleName",
              featureName:"$releaseData.featureName",
              scriptName:"$releaseData.scriptName",
              type1:"$releaseData.type",
              scriptId:"$releaseData.scriptId",
              priority:"$releaseData.priority",
              checkbox:"$releaseData.checkbox",
              requiremantName:"$releaseData.requirementName",
              requirementId:"$releaseData.requirementId",
              manualStepDetails:"$releaseData.manualStepDetails"
              ,_id:0
            }}
            ]
            ,function(err,doc){
              console.log(doc)
                res.json(doc)
            })
              
          }
          else{
           // console.log(dataObj)
          db.testScript.find(dataObj
            , function (err, testScriptDetails) {
              //console.log("testscript",testScriptDetails)
              var newArray = [];
              testScriptDetails= testScriptDetails.filter(function(value, index, arr){ 
                return value.compeleteArray!=undefined;
                  });
              if (testScriptDetails.length == 0) {
                console.log("serached result is  0 ")
                res.json(newArray);
              }
              
              testScriptDetails.forEach(function (testScriptDetail) {
                db.featureName.find({ "featureId": testScriptDetail.featureId, "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, featureDetails) {
                  db.moduleName.find({ "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, moduleDetails) {
                    //console.log("feature",featureDetails)
                    //console.log("module",moduleDetails)
                    obj = {}
if(framework == 'Test NG'){
                    testScriptDetail.compeleteArray.forEach(function (s, sindex, sarray) {
                      var scriptNlpData = [];
                      if (sindex == sarray.length - 1) {
                        s.allObjectData.allActitons.forEach(function (a, aindex, array) {
                          let stepData = {
                            'action': a.Action,
                            "nlp": a.nlpData,
                            "status": "NotExecuted",
                            "started-at" : "",
                            "comment" : "",
                            "name" : "step_0"+aindex,
                            "reporter-output" : {
                                  "line" : [ 
                                      "chrome", 
                                      "74.66", 
                                      "", 
                                      ""
                                  ]
                              },
                            "finished-at" : "",
                            "screenShot" : "",
                            "video" : ""
                          }

                          scriptNlpData.push(stepData);
                        })
                        obj['manualStepDetails'] = scriptNlpData
      
                      }
                    })

                  }
                    obj[ "featureId"] =  testScriptDetail.featureId;
                    obj[ "moduleId"] =  testScriptDetail.moduleId;
                    obj[ "typeId"] =  testScriptDetail.typeId;
                    obj[ "priorityId"] =  testScriptDetail.priorityId ;
                    obj['moduleName'] = moduleDetails[0].moduleName;
                    obj['featureName'] = featureDetails[0].featureName;
                    obj['lineNum'] = testScriptDetail.lineNum;
                    obj['scriptName'] = testScriptDetail.scriptName;
                    obj['scriptId'] = testScriptDetail.scriptId;
                    obj['requirementName'] = testScriptDetail.requiremantName;
                    obj['requirementId'] = testScriptDetail.requirementId;
                    obj['time'] = testScriptDetail.time;

                    if (testScriptDetail.typeId == "t01") {
                      obj['type1'] = "Positive"
                    }
                    else if (testScriptDetail.typeId == "t02") {
                      obj['type1'] = "Negative"
                    }
                    if (testScriptDetail.priorityId == "p02") {
                      obj['priority'] = "P2"
                    }
                    else if (testScriptDetail.priorityId == "p03") {
                      obj['priority'] = "P3"
                    }
                    else if (testScriptDetail.priorityId == "p01") {
                      obj['priority'] = "P1"
                    }
                    else if (testScriptDetail.priorityId == "p04") {
                      obj['priority'] = "P4"
                    }
                    newArray.push(obj)
                    if (count === (testScriptDetails.length - 1)) {
                      console.log("serached result is  not zero ")
                      res.json(newArray);
                    }
                    count++;
                  });
                })
              })


            })
          }

      }

    }

  })


  app.get('/TestScriptDetailsAtExecution:ss', function (req, res) {
    var data = req.params.ss;
    var data_Array = data.split(",");
    var moduleId = data_Array[0];
    var featureId = data_Array[1];
    var type = data_Array[2];
    var priority = data_Array[3];
    var projectId = data_Array[4];
    var selectedSuite = data_Array[5];
    var framework = data_Array[6];
    var userrole = data_Array[7];
    var username = data_Array[8];
    var typeExecution = data_Array[9]
    var status1 = data_Array[10]
    var status2 = data_Array[11]
    var status3 = data_Array[12]
    const keyvalue = ["moduleId",'featureId','typeId','priorityId',"projectId"]
                        
    var count = 0;
    var count1 = 0;
    var count2 = 0;
    dataObj = {}
  
    for (var i = 0; i < 5; i++) {
      if (data_Array[i] !== "All") {

        dataObj[keyvalue[i]] = data_Array[i];
        
      }
      

      if (i == 4) {
            
          db.testScript.find(dataObj

            
            , function (err, testScriptDetails) {
              var newArray = [];
              var finalArray = [];
              if (testScriptDetails.length == 0) {
                console.log("serached result is  0 ")
                res.json(newArray);
              }

              testScriptDetails.forEach(function (testScriptDetail) {
                db.featureName.find({ "featureId": testScriptDetail.featureId, "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, featureDetails) {
                  db.moduleName.find({ "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, moduleDetails) {
                    obj = {}

                    obj[ "featureId"] =  testScriptDetail.featureId;
                    obj[ "moduleId"] =  testScriptDetail.moduleId;
                    obj[ "typeId"] =  testScriptDetail.typeId;
                    obj[ "priorityId"] =  testScriptDetail.priorityId ;
                    obj['moduleName'] = moduleDetails[0].moduleName;
                    obj['fetaureName'] = featureDetails[0].featureName;
                    obj['lineNum'] = testScriptDetail.lineNum;
                    obj['scriptName'] = testScriptDetail.scriptName;
                    obj['scriptId'] = testScriptDetail.scriptId;
                    obj['requirementName'] = testScriptDetail.requiremantName;
                    obj['requirementId'] = testScriptDetail.requirementId;
                    if(framework == "Test NG"){
                    obj['check'] = "false";
                    }
                    else{
                      obj['check'] = "true";
                    }
                    obj['browser'] = "";
                    obj['Version'] = "";
                    obj['time'] = testScriptDetail.time;

                    if (testScriptDetail.typeId == "t01") {
                      obj['type1'] = "Positive"
                    }
                    else if (testScriptDetail.typeId == "t02") {
                      obj['type1'] = "Negative"
                    }
                    if (testScriptDetail.priorityId == "p02") {
                      obj['priority'] = "P2"
                    }
                    else if (testScriptDetail.priorityId == "p03") {
                      obj['priority'] = "P3"
                    }
                    else if (testScriptDetail.priorityId == "p01") {
                      obj['priority'] = "P1"
                    }
                    else if (testScriptDetail.priorityId == "p04") {
                      obj['priority'] = "P4"
                    }

                    newArray.push(obj)
                    if (count === (testScriptDetails.length - 1)) {
                      
                      console.log("serached result is  not zero ")
                     if(userrole == 'Execution Engineer'){
                      newArray.forEach(element => {
                        db.testsuite.aggregate([
                          {$match:{"testsuitename" : selectedSuite}},
                          {$unwind:"$SelectedScripts"},
                          {$match:{"SelectedScripts.scriptName" : element.scriptName,
                          "SelectedScripts.role":userrole,
                          "SelectedScripts.tester":username
                        }},
                          {$project:
                                          {
                                        "scriptName":"$SelectedScripts.scriptName",
                                        "scriptStatus":"$SelectedScripts.scriptStatus",
                                        "manualStepDetails":"$SelectedScripts.manualStepDetails",
                                        "tester":"$SelectedScripts.tester",
                                        "testcaseStatus":"$SelectedScripts.testcaseStatus",
                                        "testcaseType":"$SelectedScripts.testcaseType",
                                        "executionType":"$SelectedScripts.executionType",
                                        _id:0
                                      }}
                          ],function(err,doc){
                            if(doc.length !== 0){
                              count1++
                              if( doc[0].scriptStatus == status1 || doc[0].scriptStatus == status2 || doc[0].scriptStatus == status3){
                                console.log("Entered")
                                element.scriptStatus = doc[0].scriptStatus
                                element.executionType = doc[0].executionType
                                element.testcaseStatus = doc[0].testcaseStatus
                                element.testcaseType = doc[0].testcaseType
                                element.tester = doc[0].tester
                                element.manualStepDetails = doc[0].manualStepDetails
                                finalArray.push(element) 
                              }
                              else if((status1 == "undefined" || status1 == "") && status2 == undefined && status3 == undefined){
                                element.scriptStatus = doc[0].scriptStatus
                                element.executionType = doc[0].executionType
                                element.tester = doc[0].tester
                                element.testcaseStatus = doc[0].testcaseStatus
                                element.testcaseType = doc[0].testcaseType
                                element.manualStepDetails = doc[0].manualStepDetails
                                finalArray.push(element)
                                console.log(finalArray)
                              }
                              
                            }
                            else{
                              count2++
                              console.log("not present")
                            }
                            if((count1 + count2) === (newArray.length)){
                             console.log('final')
                             console.log(finalArray)
                              res.json(finalArray);
                              }
                          })
                        })
                        }
else if(typeExecution == "Automated"){
  newArray.forEach(element => {
                        console.log("element.scriptName")
                        db.testsuite.aggregate([
                          {$match:{"testsuitename" : selectedSuite}},
                          {$unwind:"$SelectedScripts"},
                          {$match:{"SelectedScripts.scriptName" : element.scriptName,"SelectedScripts.testcaseType":typeExecution}},
                          {$project:
                                          {
                                        "scriptName":"$SelectedScripts.scriptName",
                                        "scriptStatus":"$SelectedScripts.scriptStatus",
                                        "manualStepDetails":"$SelectedScripts.manualStepDetails",
                                        "tester":"$SelectedScripts.tester",
                                        "testcaseStatus":"$SelectedScripts.testcaseStatus",
                                        "testcaseType":"$SelectedScripts.testcaseType",
                                        "executionType":"$SelectedScripts.executionType",
                                        
                                        _id:0
                                      }}
                          ],function(err,doc){
                            if(doc.length !== 0){
                              count1++
                              if( doc[0].scriptStatus == status1 || doc[0].scriptStatus == status2 || doc[0].scriptStatus == status3){
            
                                element.scriptStatus = doc[0].scriptStatus
                                element.tester = doc[0].tester
                                element.executionType = doc[0].executionType
                                element.testcaseStatus = doc[0].testcaseStatus
                                element.testcaseType = doc[0].testcaseType
                                element.manualStepDetails = doc[0].manualStepDetails
                                finalArray.push(element) 
                              }
                              else if((status1 == "undefined" || status1 == undefined || status1 == "") && status2 == undefined && status3 == undefined){
                            
                                element.scriptStatus = doc[0].scriptStatus
                                element.executionType = doc[0].executionType
                                element.tester = doc[0].tester
                                element.testcaseStatus = doc[0].testcaseStatus
                                element.testcaseType = doc[0].testcaseType
                                element.manualStepDetails = doc[0].manualStepDetails
                                finalArray.push(element)
                                console.log(finalArray)
                              }
                              
                            }
                            else{
                              count2++
                              console.log("not present")
                            }
                            if((count1 + count2) === (newArray.length)){
                             console.log('final')
                             console.log(finalArray)
                              res.json(finalArray);
                              }
                          })
                      });
                       }
                       else if(typeExecution == "Manual"){
                        newArray.forEach(element => {
                                              console.log("element.scriptName")
                                              db.testsuite.aggregate([
                                                {$match:{"testsuitename" : selectedSuite}},
                                                {$unwind:"$SelectedScripts"},
                                                {$match:{"SelectedScripts.scriptName" : element.scriptName,"SelectedScripts.testcaseType":typeExecution}},
                                                {$project:
                                                                {
                                                              "scriptName":"$SelectedScripts.scriptName",
                                                              "scriptStatus":"$SelectedScripts.scriptStatus",
                                                              "manualStepDetails":"$SelectedScripts.manualStepDetails",
                                                              "tester":"$SelectedScripts.tester",
                                                              "testcaseStatus":"$SelectedScripts.testcaseStatus",
                                                              "testcaseType":"$SelectedScripts.testcaseType",
                                                              "executionType":"$SelectedScripts.executionType",
                                                              
                                                              _id:0
                                                            }}
                                                ],function(err,doc){
                                                  if(doc.length !== 0){
                                                    count1++
                                                    if( doc[0].scriptStatus == status1 || doc[0].scriptStatus == status2 || doc[0].scriptStatus == status3){
                                  
                                                      element.scriptStatus = doc[0].scriptStatus
                                                      element.tester = doc[0].tester
                                                      element.executionType = doc[0].executionType
                                                      element.testcaseStatus = doc[0].testcaseStatus
                                                      element.testcaseType = doc[0].testcaseType
                                                      element.manualStepDetails = doc[0].manualStepDetails
                                                      finalArray.push(element) 
                                                    }
                                                    else if((status1 == "undefined" || status1 == undefined || status1 == "") && status2 == undefined && status3 == undefined){
                                                  
                                                      element.scriptStatus = doc[0].scriptStatus
                                                      element.executionType = doc[0].executionType
                                                      element.tester = doc[0].tester
                                                      element.testcaseStatus = doc[0].testcaseStatus
                                                      element.testcaseType = doc[0].testcaseType
                                                      element.manualStepDetails = doc[0].manualStepDetails
                                                      finalArray.push(element)
                                                      console.log(finalArray)
                                                    }
                                                    
                                                  }
                                                  else{
                                                    count2++
                                                    console.log("not present")
                                                  }
                                                  if((count1 + count2) === (newArray.length)){
                                                   console.log('final')
                                                   console.log(finalArray)
                                                    res.json(finalArray);
                                                    }
                                                })
                                            });
                                             }



                       else {
                        newArray.forEach(element => {
                                              console.log("element.scriptName")
                                              db.testsuite.aggregate([
                                                {$match:{"testsuitename" : selectedSuite}},
                                                {$unwind:"$SelectedScripts"},
                                                {$match:{"SelectedScripts.scriptName" : element.scriptName}},
                                                {$project:
                                                                {
                                                              "scriptName":"$SelectedScripts.scriptName",
                                                              "scriptStatus":"$SelectedScripts.scriptStatus",
                                                              "manualStepDetails":"$SelectedScripts.manualStepDetails",
                                                              "tester":"$SelectedScripts.tester",
                                                              "testcaseStatus":"$SelectedScripts.testcaseStatus",
                                                              "testcaseType":"$SelectedScripts.testcaseType",
                                                              "executionType":"$SelectedScripts.executionType",
                                                              
                                                              _id:0
                                                            }}
                                                ],function(err,doc){
                                                  if(doc.length !== 0){
                                                    count1++
                                                    if( doc[0].scriptStatus == status1 || doc[0].scriptStatus == status2 || doc[0].scriptStatus == status3){
                                           
                                                      element.scriptStatus = doc[0].scriptStatus
                                                      element.tester = doc[0].tester
                                                      element.executionType = doc[0].executionType
                                                      element.testcaseStatus = doc[0].testcaseStatus
                                                      element.testcaseType = doc[0].testcaseType
                                                      element.manualStepDetails = doc[0].manualStepDetails
                                                      finalArray.push(element) 
                                                    }
                                                    else if((status1 == "undefined" || status1 == undefined || status1 == "") && status2 == undefined && status3 == undefined){
                                                   
                                                      element.scriptStatus = doc[0].scriptStatus
                                                      element.executionType = doc[0].executionType
                                                      element.tester = doc[0].tester
                                                      element.testcaseStatus = doc[0].testcaseStatus
                                                      element.testcaseType = doc[0].testcaseType
                                                      element.manualStepDetails = doc[0].manualStepDetails
                                                      finalArray.push(element)
                                                      console.log(finalArray)
                                                    }
                                                    
                                                  }
                                                  else{
                                                    count2++
                                                    console.log("not present")
                                                  }
                                                  if((count1 + count2) === (newArray.length)){
                                                   console.log('final')
                                                   console.log(finalArray)
                                                    res.json(finalArray);
                                                    }
                                                })
                                            });
                                             }
                    }
                   
                    count++;
                  });
                })
              })

            })
      }

    }
  })

  app.get('/getmodulebasedonrelease:obj', function (req, res){
    var firstree = req.params.obj;
    var firstreearray = firstree.split(",");
     var moduleId = firstreearray[0]
    var projectId = firstreearray[1]
      if (moduleId == "All") {
        db.featureName.find({ "projectId": projectId }, function (err, doc) {
          res.json(doc)
        })
  
      }
      else {
        db.featureName.find({ "moduleId": moduleId, "projectId": projectId }, function (err, doc) {
          res.json(doc)
        })
  
      }
  })



  app.get('/rrrrrrrrrrrrrrrrrr:obj1', function (req, res){
    console.log('ravi')
    var firstre = req.params.obj1
    var firstrearray = firstre.split(",");
      projectId = firstrearray[1]
      releaseVersion = firstrearray[2]
      moduleId = firstrearray[0]
      if (moduleId == "All") {
     db.release.aggregate([
        {$match:{"releaseVersion" : releaseVersion,"projectId" : projectId}},
        {$unwind:"$releaseData"},
        {$project:
          {
        featureId:"$releaseData.featureId",
                  moduleId:"$releaseData.moduleId",
                  featureName:"$releaseData.featureName",
          }}
      ],function(err,doc){
        console.log(doc)
        res.json(doc)
    })
      }
    
        else {
          db.release.aggregate([
            {$match:{"releaseVersion" : releaseVersion,"projectId" : projectId}},
            {$unwind:"$releaseData"},
            {$match:{"releaseData.moduleId":moduleId}},
            {$project:
              {
            featureId:"$releaseData.featureId",
            moduleId:"$releaseData.moduleId",
             featureName:"$releaseData.featureName",
              }}
          ],function(err,doc){
            console.log(doc)
            res.json(doc)
        })
         
    
        }
    
    })


    app.get('/ssssss:obj2', function (req, res){
      var firstreee = req.params.obj2
      var firstreeearray = firstreee.split(',');
      projectId = firstreeearray[0]
      releaseVersion = firstreeearray[1]
    if(releaseVersion !=='undefined'){
      db.release.aggregate([
        {$match:{"releaseVersion" : releaseVersion,"projectId" : projectId}},
        {$unwind:"$releaseData"},
        {$project:
          {
        moduleId:"$releaseData.moduleId",
        moduleName:"$releaseData.moduleName",
          }}
      ],function(err,doc){
        unique = doc.filter((set => f => !set.has(f.moduleName) && set.add(f.moduleName))(new Set));
        res.json(unique)
    })
    }
    else{
      db.moduleName.find({ "projectId": projectId }, function (err, doc) {
        res.json(doc);
        console.log(doc)
      })
    }
    
    })



    app.get('/getSuiteModules:obj2', function (req, res){
      var firstreee = req.params.obj2
      var firstreeearray = firstreee.split(',');
      projectId = firstreeearray[0]
      selectedSuite = firstreeearray[1]
      db.testsuite.aggregate([
        {$match:{"testsuitename" : selectedSuite,"PID" : projectId}},
        {$unwind:"$SelectedScripts"},
        {$project:
          {
        moduleId:"$SelectedScripts.moduleId",
        moduleName:"$SelectedScripts.moduleName",
          }}
      ],function(err,doc){
        unique = doc.filter((set => f => !set.has(f.moduleName) && set.add(f.moduleName))(new Set));
        res.json(unique)
    })
    
    })


}

