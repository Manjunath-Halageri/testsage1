const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');

var fs = require('fs');
var path = require("path");
const fse = require('fs-extra');


async function getForEdit(req, res) {
  var id = req.query.selectedSechdule;
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    db.scheduleList.find({ "_id": mongojs.ObjectId(id) }, function (err, doc) {
      res.json(doc);
      console.log(doc);

    });
}

async function deletesechdule(req, res) {
  console.log("deletesechdule",req.query);
    var folder = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/MainProject/suites/Scheduler/${req.query.scheduleName}`);
    console.log(folder)
    db.scheduleList.remove({  "_id": mongojs.ObjectId(req.query._id),"projectId": req.query.projectId },
        function (err, doc) {
            console.log("deletesechdule DB", doc)
            fse.remove(folder, (err) => {
                try {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log('Schedule folder deleted!')
                        res.json("PASS")
                    }
                }
                catch (err) {
                    console.log('Error while remove' + err);
                    res.json("FAIL")
                }
            })
        })
    // db.scheduleList.update({
    //   "_id": mongojs.ObjectId(req.query.SechduleDelete)
    // }, {
    //   $pull: {
    //     "status": {
    //       "statusMain": "yetToStart"
    //     }
    //   }
    // }, function (err, doc) {
    //   res.json(doc)
    // })
}

async function getAllyetToStart(req, res) {
  // db.scheduleList.find({"projectId":req.query.projectId,"status.statusMain": "yetToStart" },
  //  { 'status.$': 1, "scheduleName": 1, "scheduleType": 1, "time": 1 }, function (err, doc) {
  //   res.json(doc);
  // });
  db.scheduleList.aggregate([
    { $match: {"projectId":req.query.projectId }},
    { $unwind: "$status" },
    { $match: { "status.statusMain": "yetToStart" } },
     { 
      $project: { 
        _id: 1,"scheduleName":"$scheduleName","desc":"$description","testSuite":"$testSuite","endDate":"$endDate","weekName" : "$weekName",
        "weekend" : "$weekend","type":"$type", "scheduleType":"$scheduleType","time":"$time",'status':'$status',"hourly":"$hourly",
        'projectName':'$projectName',"projectId":"$projectId","machineStatus":"$machineStatus"
     }
       }
  ],
      function (err, doc) {
      res.json(doc);
    });
}

async function updateEditData(req, res) {
  console.log("shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
  console.log(req.body.status[0].startDate)

  db.scheduleList.update({
    "_id": mongojs.ObjectId(req.body._id),
    "status.statusMain": "yetToStart"
  }, {
    $set: {
      "scheduleName": req.body.scheduleName,
      "description": req.body.description,
      "endDate": req.body.endDate,
      "time": req.body.time,
      "weekName": req.body.weekName,
      "hourly": req.body.weekName,
      'status.$.startDate': new Date(req.body.status[0].startDate),

    }
  }, function (err, doc) {
    console.log(doc)
    res.json(doc)
  })
}

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
async function updateSchedule(req, res) {
var status = [];
  console.log('req.body updateSchedule')
  console.log(req.body)
  console.log('req.body updateSchedule',req.body.data["status"].startDate)
  
      var startDate=new Date(req.body.data["status"].startDate);
  if (req.body.data.weekName == undefined) {
    var d = new Date(req.body.data["status"].startDate);
    var dayName = days[d.getDay()];
    req.body.data.weekName = dayName;
    console.log(req.body.data.weekName);
  }
  if(req.body.data.scheduleType=="Weekly"){
     startDate = new Date(req.body.data["status"].startDate)
    const endDate =new Date(req.body.data.endDate)
    // console.log(req.body.data.startDate,req.body.data.endDate)
    // console.log(startDate,endDate)
    if(startDate.getTime()!=endDate.getTime()){
        let i = 0;
while (i < 7 && startDate <= endDate) {
  console.log(startDate,endDate)
let date = new Date(startDate.toISOString());
let day = date.toLocaleString('en-IN', {weekday: 'long'});
  console.log(day,req.body.data.weekName)
if(day== req.body.data.weekName){
  // console.log(day)
  // console.log(startDate.toISOString())
  break;
}else{
  startDate.setDate(startDate.getDate() + 1);
}
i++;
    }
    }

}
    // var obj = {};
    // obj["statusMain"] = "yetToStart";
    // // obj["startDate"] = startDate.toISOString()
    // obj["startDate"] = startDate
    // obj["time"] = req.body.data["status"].time
    // status.push(obj);
    db.scheduleList.update(
      {$and:[
    {
      "_id": mongojs.ObjectId(req.body.data._id)
    },
    { "status" : { $elemMatch : { "statusMain":"yetToStart","startDate" :new Date( req.body.startDate), "time" :req.body.time } }},
  ]},
     {
      $set: {
        "description": req.body.data.desc,
        "type": req.body.type,
        "endDate": req.body.data.endDate,
        "scheduleType": req.body.data.scheduleType,
        "time": req.body.data["status"].time,
        "weekName": req.body.data.weekName,
        "hourly": req.body.data.hourly,
        "weekend": req.body.data.weekend,
        'status.$.startDate':new Date( req.body.data["status"].startDate),
        'status.$.time' :req.body.data["status"].time 
      }
    }
   
   ,function (err, doc) {
      console.log(doc)
      res.json(doc)
    })
    
  }
        


async function getInProgress(req, res) {
db.scheduleList.find({"projectId":req.query.projectId, "status.statusMain": "inProgress" }, { 'status.$': 1, "scheduleName": 1, "scheduleType": 1, "time": 1 }, function (err, doc) {
  res.json(doc);
});
  
}

async function getAllComplted(req, res) {
    db.scheduleList.aggregate([
      { $match: {"projectId":req.query.projectId }},
      { $unwind: "$status" },
      { $match: { "status.statusMain": "completed" } },
       { 
        $project: { 
          _id: 1,"scheduleName":"$scheduleName","scheduleType":"$scheduleType","time":"$time",'status':'$status'
       }
         }
    ],
        function (err, doc) {
        res.json(doc);
      });
  // db.scheduleList.find(
  // {"projectId":req.query.projectId, "status.statusMain": "completed" },
  //  { 'status.$': 1, "scheduleName": 1, "scheduleType": 1, "time": 1 }, function (err, doc) {
  //   res.json(doc);
  // });
}


module.exports = {
  getForEdit: getForEdit,
  deletesechdule : deletesechdule,
  getAllyetToStart : getAllyetToStart,
  updateEditData : updateEditData,
  getInProgress : getInProgress,
  getAllComplted : getAllComplted,
  updateSchedule:updateSchedule
}

