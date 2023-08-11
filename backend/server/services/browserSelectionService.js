const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');

var id;
async function getTableDetails(req, res) {
  console.log("hitting releaseScopeService")
   id=parseInt(req.query.orgId);
  console.log(id,typeof(id))
  db.licenseDocker.aggregate([
    { $match: { "machineType": "executionMachine", "orgId": id,"state":"Running"} },
    { $unwind: "$machineDetails" },
    { $unwind: "$machineDetails.browsers" },
    { $unwind: "$machineDetails.browsers.version" },
    {
      $project: {
        _id: 0, "browserType": "$machineDetails.browsers.browserName",
        "browserVersion": "$machineDetails.browsers.version.versionName",
        "NodeName": "$machineDetails.browsers.version.NodeName",
        "userName": "$machineDetails.browsers.version.userName",
        "type": "$machineDetails.browsers.version.type",
        "status": "$machineDetails.browsers.version.status",
        "checked": "$machineDetails.browsers.version.checked"
      }
    }
  ],function(err,doc){
    console.log("nuuulll   " + doc)
    if (doc.length != 0) {
      var result;
      result=doc;
      result.forEach(function(e){
        e['orgId']=id;
      })
      console.log("nuuulll   " + result)
      res.json(result);
  
    } else {
      console.log("nuuulll   " + doc)
      res.json(doc);
    }
  })
  //let result = await dbServer.aggregate(db.licenseDocker, obj);
}

async function checkBrowsersStatus(req, res) {
  var data = req.body
  var statusArray = []
  data.forEach((element, index, array) => {
  db.licenseDocker.aggregate([
    { $match: { "machineType": "executionMachine", "orgId": id,} },
    { $unwind: "$machineDetails" },
    { $unwind: "$machineDetails.browsers" },
    { $match: {"machineDetails.browsers.browserName": element.browser }},
    { $unwind: "$machineDetails.browsers.version" },
    {$match :{"machineDetails.browsers.version.NodeName" : element.versionCodeName}},
    {
      $project: {
        _id: 0,
        "status": "$machineDetails.browsers.version.status",
      }
    }], function(err,doc){
      
        statusArray.push(doc)
        
        if (index === (array.length - 1)) {
          console.log("44444444444444444")
          console.log(statusArray)
          res.json(statusArray)
      }
    })
  });
}

async function blockBrowsers(req, res) {
  //to work this function we need to update mongojs version to 3.1.0
  //change in package.json mongo js version from2.5.0 to 3.1.0 and  npm install
  var data = req.body
  console.log("data")
  console.log(data)
  console.log("data")
  data.forEach((element,index,array) => {
    console.log(element.NodeName)
    //db.licenseDocker.insert({"name":"named"})
    db.licenseDocker.update(
      { "orgId": id,"machineType" : "executionMachine"},
      {
        $set: {
          "machineDetails.$[].browsers.$[].version.$[j].userName": element.userName,
          "machineDetails.$[].browsers.$[].version.$[j].checked": true,
          "machineDetails.$[].browsers.$[].version.$[j].status": "Blocked"
        }
      },
      {
        arrayFilters: [
          {
            "j.NodeName": element.NodeName
          }
        ]
      },
      function (err, doc) {
        if(err!=null){
          console.log(err)
        }else{
          console.log(doc)
        }
        if (index === (array.length - 1)) {
          res.json('blocked')
      }
      }
    )
    
  });
  //res.json('blocked')
}

async function releaseBrowsers(req, res) {
  //to work this function we need to update mongojs version to 3.1.0
  //change in package.json mongo js version from2.5.0 to 3.1.0 and  npm install
  var data = req.body
  console.log("maddddddddddddddddddddddddddddddddddddddddd")
  console.log(data)
  console.log("data")
  data.forEach((element,index,array )=> {
    console.log(element.NodeName)
    //db.licenseDocker.insert({"name":"named"})
    db.licenseDocker.update(
      { "orgId": id ,"machineType" : "executionMachine"},
      {
        $set: {
          "machineDetails.$[].browsers.$[].version.$[j].userName": "",
          "machineDetails.$[].browsers.$[].version.$[j].checked": false,
          "machineDetails.$[].browsers.$[].version.$[j].status": "available"
        }
      },
      {
        arrayFilters: [
          {
            "j.NodeName": element.NodeName
          }
        ]
      },
      function (err, doc) {
        console.log(doc)
        console.log(err)
        if (index === (array.length - 1)) {
          res.json('released')
      }
      }
    )
  });
  // res.json('released')
}

async function getPerformanceTableDetails(req, res) {
  var Id=parseInt(req.query.orgId);
  console.log(Id,typeof(Id))

  db.licenseDocker.find({ "orgId": Id, "machineType": "jmeterExecutionMachine","state":"Running" },
  function(err,doc){
    if (doc.length != 0) {
      var result;
      var finalArray=[]
      console.log(doc)
      result=doc[0].jmeterData;
      result.forEach(function(e){
        e['orgId']=Id;
        if(e.state=="Running"){
          finalArray.push(e)
        }
      })
      console.log("NotNull   " + result)
      res.json(finalArray);
  
    } else {
      console.log("nuuulll   " + doc)
      res.json(doc);
    }
  })
  // function (err, doc) {
  //     console.log(doc)
  //     res.json(doc[0].jmeterData)

  // })

}

async function blockContainers(req, res) {
  var data = req.body
  data.forEach((element,index, array) => {
    let id = Number(element.orgId)
    db.licenseDocker.update(
      { "orgId": id,"machineType" : "jmeterExecutionMachine"},
      {
        $set: {
          "jmeterData.$[j].userName": element.userName,
          "jmeterData.$[j].checked": true,
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
        if(err!=null){
          console.log(err)
        }else{
          console.log(doc)
        }
        if (index === (array.length - 1)) {
          res.json('blocked')
      }
      }
    )
    
  });
}

async function releaseContainers(req, res) {
  var data = req.body
  data.forEach((element,index, array) => {
      let id = Number(element.orgId)
    db.licenseDocker.update(
      { "orgId": id ,"machineType" : "jmeterExecutionMachine"},
      {
        $set: {
          "jmeterData.$[j].userName": "",
          "jmeterData.$[j].checked": false,
          "jmeterData.$[j].status": "available"
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
        console.log(doc,"sdasdasd")
        console.log(err,"aasdas")
        if (index === (array.length - 1)) {
          res.json('released')
      }
      }
    )
  
  });
}
module.exports = {
  getTableDetails: getTableDetails,
  blockBrowsers: blockBrowsers,
  releaseBrowsers: releaseBrowsers,
  checkBrowsersStatus: checkBrowsersStatus,
  getPerformanceTableDetails: getPerformanceTableDetails,
  blockContainers: blockContainers,
  releaseContainers: releaseContainers
};