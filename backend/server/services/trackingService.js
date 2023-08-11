const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var fs = require('fs');
var cmd = require('child_process');
const Email = require('./mailIntegrationService');
  const emailObj = new Email();

async function getTracking(req, res) {
  var obj={};
  if(req.query.roleName=="Lead"||req.query.roleName=="Manager"){
    obj={"projectId":req.query.projectId}
  }else{
    obj={"projectId":req.query.projectId,"userId":req.query.userId}
  }
  db.tracking.find(obj, function (err, doc) {
    if (doc.length != 0) {
      res.json(doc);

    } else {
      console.log('fail')
      res.json("fail")
    }
  });

}
async function insertData(object, runCount, time) {
  if(object[0].emailArray.length!= 0){
   emailArray = object[0].emailArray
  }
  else{
    emailArray = null
  }
  
  var insertingData
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  totalScripts = object.length
  db.reports.find({ "projectId": object[0].prid, "suiteName": object[0].suite }).sort({ _id: -1 },
    function (err, doc) {
      if (doc.length != 0) {
        let lastExecutedStart = new Date(doc[0].startedAt)
        let lastExecutedEnd = new Date(doc[0].endedAt)
        let datestart = lastExecutedStart.getDate()
        let dateend = lastExecutedEnd.getDate()
        totalDate = dateend - datestart
        totalHours = Math.abs(lastExecutedEnd.getHours() - lastExecutedStart.getHours())
        totalMinutes = Math.abs(lastExecutedEnd.getMinutes() - lastExecutedStart.getMinutes())
        totalSeconds = Math.abs(lastExecutedEnd.getSeconds() - lastExecutedStart.getSeconds())
        estimated = (totalHours * 60 * 60) + (totalMinutes * 60) + 60
      }
      else {
        estimated = totalScripts * 60
        totalDate = 0;
      }
      let timet = hours + '-' + minutes + '-' + seconds
      if (object[0].type == "schedule") {
        totalScripts1 = object[0].allScripts.length
        estimated1 = totalScripts1 * 60
        var scheduledScripts = object[0].allScripts
        insertingData = {
          'projectId': object[0].projectId,
          'RunNo': runCount,
          'Type': object[0].type,
          'TotalTestcases': object[0].allScripts.length,
          'SuiteName': object[0].testSuite,
          'ExecutedCount': 0,
          'TimeTaken': timet,
          'estimated': estimated1,
          'pendingCount': '',
          'PassCount': '',
          'FailCount': '',
          'times': '',
          'passPercentage': '',
          'failPercentage': '',
          "totalDate": totalDate,
          'Testcases': scheduledScripts.map(function (elem) {
            return {
              scriptId: elem.scriptId,
              scriptName: elem.scriptName,
              status: '',
              processId:''
            }
          })
        }
      }
      else {
        insertingData = {
          'projectId': object[0].prid,
          'RunNo': runCount,
          'Type': object[0].type,
          'TotalTestcases': object.length,
          'SuiteName': object[0].suite,
          'ExecutedCount': 0,
          'pendingCount': '',
          'PassCount': '',
          'FailCount': '',
          'TimeTaken': timet,
          'estimated': estimated,
          'times': '',
          'passPercentage': '',
          'failPercentage': '',
          'email':emailArray,
          "totalDate": totalDate,
          'Testcases': object.map(function (elem) {
            return {
              scriptId: elem.scriptId,
              scriptName: elem.scriptName,
              status: '',
              processId:''
            }
          })
        }
      }

      dbServer.createCondition(db.tracking, insertingData);
    })
}

  var insertTracking = (object) => new Promise((resolve, reject) => {
    console.log("insertTracking")
  if(object[0].emailArray.length!= 0){
   emailArray = object[0].emailArray
  }
  else{
    emailArray = null
  }
  let time = new Date();
  var insertingData
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  totalScripts = object.length
  db.reports.find({ "projectId": object[0].prid, "suiteName": object[0].suite }).sort({ _id: -1 },
    function (err, doc) {
      if (doc.length != 0) {
        let lastExecutedStart = new Date(doc[0].startedAt)
        let lastExecutedEnd = new Date(doc[0].endedAt)
        let datestart = lastExecutedStart.getDate()
        let dateend = lastExecutedEnd.getDate()
        totalDate = dateend - datestart
        totalHours = Math.abs(lastExecutedEnd.getHours() - lastExecutedStart.getHours())
        totalMinutes = Math.abs(lastExecutedEnd.getMinutes() - lastExecutedStart.getMinutes())
        totalSeconds = Math.abs(lastExecutedEnd.getSeconds() - lastExecutedStart.getSeconds())
        estimated = (totalHours * 60 * 60) + (totalMinutes * 60) + 60
      }
      else {
        estimated = totalScripts * 60
        totalDate = 0;
      }
      let timet = hours + '-' + minutes + '-' + seconds
        insertingData = {
          'projectId': object[0].prid,
          'suiteId':object[0].suiteId,
          'status':"Initializing please wait",
          'Type': object[0].type,
          'TotalTestcases': object.length,
          'SuiteName': object[0].suite,
          'ExecutedCount': 0,
          'pendingCount': 0,
          'PassCount': 0,
          'FailCount': 0,
          'TimeTaken': timet,
          'estimated': estimated,
          'times': '',
          'passPercentage': 0,
          'failPercentage': 0,
          'email':emailArray,
          "totalDate": totalDate,
          "executingBy": object[0].Roles.userName,
          "userId": object[0].Roles.userId,
          'Testcases': object.map(function (elem) {
            return {
              scriptId: elem.scriptId,
              scriptName: elem.scriptName,
              status: '',
              processId:''
            }
          })
        }
      dbServer.createCondition(db.tracking, insertingData);
      resolve("Inserted into Tracking")
    })
  })



async function removeData(RunNo, projectId) {
  console.log(RunNo, projectId)
  db.tracking.remove({ "RunNo": RunNo, "projectId": projectId });

}

async function inctime(projectId, RunNo,res) {

  db.countInc.find({},function(err,doc){
     console.log(doc[0].thresholdExit)
     failThreshold = doc[0].thresholdExit
   })
let sendEmailOnce = true
 var inctime=  setInterval(() => {
    db.tracking.find({ "RunNo": RunNo, "projectId": projectId }, function (err, doc) {
      if (doc.length != 0) {
        let pending = doc[0].TotalTestcases - doc[0].ExecutedCount
        let emailData = doc[0].email
        db.tracking.update({ "RunNo": RunNo, "projectId": projectId }, {
          $set:
          {
            "pendingCount": pending
          }
        }
        )
        db.tracking.aggregate([
          {$match:{"RunNo" : RunNo,"projectId" : projectId}},
          { $unwind: "$Testcases" },
          {
            $group: {
              _id: projectId, count: { $sum: 1 },
              Pass: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: ["$Testcases.status", "PASS"]
                    },
                    then: 1,
                    else: 0
                  }
                }
              },
              Fail: {
                $sum: {

                  $cond: {
                    if: {
                      $eq: ["$Testcases.status", "FAIL"]
                    },
                    then: 1,
                    else: 0
                  }
                }
              }
            }
          },
          {
            $project: {
              Fail: 1, Pass: 1,
              "passPercent": { $multiply: [{ $divide: ["$Pass", "$count"] }, 100] },
              "failPercent": { $multiply: [{ $divide: ["$Fail", "$count"] }, 100] }
            }
          }
        ],
          function (err, doc) {
            if (doc.length != 0) {
            passCount = doc[0].Pass
            failCount = doc[0].Fail

            passPercentage = doc[0].passPercent
            failPercentage = doc[0].failPercent
            console.log(passPercentage,failPercentage)
            if(failPercentage >= failThreshold && sendEmailOnce == true){
              console.log(failPercentage)
              console.log(failThreshold)
              sendEmailOnce = false
            failEmailSend(emailData,failPercentage,RunNo)
           
            }
            db.tracking.update({ "RunNo": RunNo, "projectId": projectId }, {
              $set:
              {
                "PassCount": passCount,
                "FailCount": failCount,
                "passPercentage": passPercentage,
                "failPercentage": failPercentage
              }
            } ,function (err, doc) {
              console.log(doc)
              console.log(err)
              // if(doc.nModified==1)
              // {
              // clearInterval(inctime)
              // }   
            }
            )
            db.tracking.find({ "RunNo": RunNo, "projectId": projectId }, 
            function (err, doc) {
              //console.log(doc[0])
                if(doc[0].Testcases.length==doc[0].TotalTestcases){
                let adults =doc[0].Testcases.filter(person => person.status === "FAIL" || person.status === "PASS");
                if(adults.length==doc[0].Testcases.length)
                {
                  clearInterval(inctime)
                }
             }
            })
          }
          }
        )
      }
      else {
        clearInterval(inctime)
      }
    })

  }, 1000*5);
}
async function failEmailSend(emailData,fail,runNo){ 
    var emailDoc = {}
    emailDoc["emailArray"] = emailData;
    // emailDoc.push(emailArray)
  runningStatus = 'Execution with runNo' + " "+runNo +" "+ 'has reached the threshold fail percentage of'+ " " + fail + " " +'so please check'
   message = 'Threshold Fail Percentage alert'
  emailObj.sendEmail(emailDoc, runningStatus, message)
}
// async function insertChildPid(childPid,RunNo) {
//   updateCondition = {
//     "Run": RunNo
//   }
//   updateParams = {
//     $set:
//     {
//       "childPid": childPid
//     }
//   }
//   dbServer.updateAll(db.reports, updateCondition, updateParams)
  
  
// }

// @echo off

// taskkill/F /IM java.exe

// pause
var exitBatchCreation = (req,file,res) => new Promise(async(resolve, reject) => {
  let objj = {
    'projectId':req.body.projectId,
  }
 let resultprocess = await dbServer.findCondition(db.tracking,objj)
      var mvnFileCreation = fs.createWriteStream(file);
      mvnFileCreation.write("@echo off\n")
      mvnFileCreation.write("taskkill/F /PID " + resultprocess[0].Testcases[0].processId +"\n")
      mvnFileCreation.write("pause")
      
      mvnFileCreation.end(function () {
        console.log(`done writing mvn batch  ${file} `);
        resolve('done')
      })
})
// async function exitBatchCreation(req,file,res) {
  
// }
var executeExitFile = (req,file,res) => new Promise(async(resolve, reject) => {
  
  cmd.exec(file, (err, stdout, stderr) => {
    console.log(" Exit batch file executed " + "\n\n");
    try {
      if (err != null) {
        console.log('1')
        batchResult = "Fail"
        resolve(batchResult)
        throw err;
      }
      else {
        //console.log(stdout);
        console.log('2')
        batchResult = "Pass"
        
        resolve(batchResult)
      }
    } catch (err) {
      console.log('3')
      console.log('Fail at mvnExecution()')
    }
   
  })
  console.log(req.body.RunNo, req.body.projectId )
  db.tracking.remove({ "RunNo": req.body.RunNo, "projectId": req.body.projectId },
  function (err, doc) {
      console.log("delete tracking DB", doc)
   
          try {
              if (err) {
                  throw err;
              }
              else {
                db.reports.remove({ "Run": req.body.RunNo },
                function (err, doc) {
                  console.log('reports  file deleted!',doc)
                })
              }
          }
          catch (err) {
              console.log('Error while remove' + err);
              
          }
      
  })
  //db.tracking.remove({ "RunNo": req.body.RunNo, "projectId": req.body.projectId });
  //db.reports.remove({ "Run": req.body.RunNo });
  console.log(req.body.emailArray, req.body.userName);
  let completedStatus = `Your Scripts Execution Stopped by   ${req.body.userName} with Suite of ${req.body.suiteName} `;
  let message = `Automated Test Suite Execution Stopped!!`;
  emailObj.sendEmail(req.body, completedStatus, message)
  resolve("batchResult")
})

async function getThresholdPercentage(req,res) {
let resultprocess = await dbServer.findAll(db.countInc)
res.json(resultprocess[0].thresholdExit)
}

var updateTrackStatus = (data,status) => new Promise((resolve, reject) => {
  console.log("updateTrackStatus",status)
  db.tracking.update({ "projectId": data[0].prid, "SuiteName": data[0].suite,"suiteId":data[0].suiteId },
  {
    $set: {
      "status": `${status}`,
    }
  },
    function (err, doc) {
      if(err)console.log(err)
      else console.log(doc)
      resolve("Updated Status")
    })
})

module.exports = {

  getTracking: getTracking,
  insertData: insertData,
  removeData: removeData,
  inctime: inctime,
  exitBatchCreation: exitBatchCreation,
  executeExitFile:executeExitFile,
  getThresholdPercentage: getThresholdPercentage,

  insertTracking:insertTracking,
  updateTrackStatus:updateTrackStatus
};