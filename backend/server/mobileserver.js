module.exports=function(app)
{
  var bodyParser = require("body-parser");
  var fs = require('fs');
  var path = require("path");
  var multer = require('multer');
  var cmd = require('child_process');
 var db  = require('../dbDeclarations').url;
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  console.log("Mobile lab server running...");
  var Promise = require('bluebird')
  var adb = require('adbkit')
  var client = adb.createClient()
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  //////////////////////////////////////////
  var storage = multer.diskStorage({

    filename: function (req, file, cb) {
    cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
    var newDestination = __dirname+'/appFolder/'
      cb(null, newDestination);
      }
    });

  var upload = multer(
    { 
        dest: "appFolder/",
        limits: {
            fieldNameSize: 100,
            fileSize: 60000000
        },
        storage: storage
        });


        

  app.post("/shivaa", upload.any(),function(req, res) {
    res.send(req.files);
    console.log(req.files)
    db.uploadedApkInfo.findAndModify({
      query: {apkName:req.files[0].originalname},
      update: {$setOnInsert:{apkName : req.files[0].originalname}},
      new: true,
      upsert: true},function(err,doc){
        if(err){console.log(err)}
      });
    // db.uploadedApkInfo.insert({apkName:req.files[0].originalname});
    
});


  client.trackDevices()
  .then(function(tracker) {
  tracker.on('add', function(device) {
  console.log('Device %s was plugged in', device.id);
  })
  tracker.on('remove', function(device) {
  console.log('Device %s was unplugged', device.id);
  db.devices.remove({"DevicesId":device.id},{function(err,doc){
  console.log(doc);
  }})
  })
  tracker.on('end', function() {
  console.log('Tracking stopped')
  })
  })
  .catch(function(err) {
  console.error('Something went wrong:', err.stack)
  })//client.trackDevices()

  app.get('/mobileAppsDetails',function(req,res){
  db.devices.find({},function(err,doc){
  if(doc.length !== 0)
  {
    res.json(doc);
  }
  })
  })

  // runBatchFile();

    function runBatchFile(){
    let appiumDependencyPath1 = "../batchFiles/scrcpy.bat" ;
    let appiumDependencyPath2 = path.join(__dirname, appiumDependencyPath1);
  require('child_process').exec(appiumDependencyPath2, function (err, stdout, stderr) {
  
    if (err) 
    {
    return console.log(err);
    }
    });
  
  }
  
  app.get('/checkBlockedDevice:blockeDtails',function(req,res){
    var blockDevice=req.params.blockeDtails;
    var blockDevice=blockDevice.split(',')
    var DevicesId=blockDevice[0];
    var CurrentTime=blockDevice[1];
    var ToTime=blockDevice[2];
    var checkDate = blockDevice[3];
    db.blockDevices.aggregate(
      {$match:{
        "DeviceId":DevicesId,
        "Date": new Date(checkDate)
           }
           }
        ,function(err,doc){
          console.log(doc)
          console.log(doc.length)
          res.json(doc)    
       })
  })
  
  app.post('/blockDevice:devicedata',function(req,res){
    var blockData = req.params.devicedata;
    var blockData=blockData.split(',')
    var DevicesId=blockData[0];
    var convertedDate = new Date(blockData[1]);
    var CurrentTime=blockData[2];
    var ToTime=blockData[3];
    var UserId=blockData[4];
    var UserName=blockData[5];
    db.blockDevices.insert({"DeviceId":DevicesId,"Date":convertedDate,"FromTime":CurrentTime,"ToTime":ToTime,"UserId":UserId,"UserName":UserName},function(err,doc){
    if(doc.length !=0){
      res.json(doc);
    }
   
    })
    });
    
    app.get('/getTimeCalendar',function(req,res){
      db.timeCalendar.find({},function(err,doc){
        res.json(doc)
      })
    })

  app.post('/postDevicesName',function(req,res)
  {
      listDevices(res);
  })

  /*
  Logic Desc: listDevices  is a function which will get connected info of system like
  device id, model number,android version.
  here i am creating a virtual adb shell to run adb command, once i get a out put from the respecive 
  command i am storing it to database finally.
  Query: insert;
  Output: if data inserted successfullly positive response 
          else error
   */
  function listDevices(res)
  {
    client.listDevices()
    .then(function(devices) {
    return Promise.map(devices, function(device) {
    return client.shell(device.id, 'getprop ro.product.model')
    .then(adb.util.readAll)
    .then(function(output) {
    var devicesname=output.toString().trim()
    return client.shell(device.id,'getprop ro.build.version.release')
    .then(adb.util.readAll)
    .then(function(output){
      var devicesVersion=output.toString().trim()
      return insert(device.id,devicesname,devicesVersion,res)
    })
    })
    })
    })
    .then(function() {
    db.devices.find({},function(err,doc){
      if(doc.length !== 0)
      {
        res.json(doc);
        // runBatchFile();
      }
    })
    })
    .catch(function(err) {
    console.error('Something went wrong:', err.stack)
    }) 

  }//function listDevices()

  function insert(devicesid,devicesname,devicesVersion,res)
  {
    db.devices.findAndModify({ 
      query: {"DevicesId":devicesid},
      update: {$setOnInsert: {"DevicesName":devicesname,
                              "DevicesVersion":devicesVersion}},
      new: true,
      upsert: true},
      function(error,doc){
    });
  }

app.get('/unBlockApi:myparam',function(req,res){
  var paramsDetails=req.params.myparam;
  var arr = paramsDetails.split(',');
  var UserId=arr[0];
  var currentTime = arr[1];
  var todayDate=arr[2];
  db.blockDevices.aggregate(
    {$match:{
      "Date": new Date(todayDate),
       "UserId":UserId,
         }},function(err,doc){
           res.json(doc)
  })
})
app.get('/multipleDevUnblock:multipleParam',function(req,res){
  var multipleparamsDetails=req.params.multipleParam;
  var arr = multipleparamsDetails.split(',');
  var deviceId=arr[0];
  var currentTime = arr[1];
  var UserId=arr[2];
  db.blockDevices.aggregate([
    {"$match":{
     "UserId":UserId,
    $and:[
       {"FromTime":{$lte:currentTime}},
       {"ToTime":  {$gt:currentTime}}
       ]
       }},
       {"$lookup": 
       {
       "from": "devices",
      "localField":"DeviceId",
       "foreignField":"DevicesId",
       "as": "result"
       }},
        { $unwind: "$result" },

       
   ],function(err,doc){
     console.log(doc)
     res.json(doc)
   })

})//

/*
  Logic Desc: this function is mainly to insert the apk in the selected devices,
  here also i am creating virtual adb shell to run the install command
  Output: if apk install successfullly positive response 
          else error
   */
    app.post('/installapk',function(req,res){
      var devicesId = req.body.deviceId;
      var apkpath = req.body.apkPath;
      var uploadedApkName = req.body.uplodedApkName;
 
      client.install(devicesId, apkpath)
      .then(function() {
        getApkInfoWithAppActivity(apkpath,devicesId,uploadedApkName);
      res.json(devicesId)
      })
      .catch(function(err) {
      console.error('Something went wrong:', err.stack)
    })
     
    
    })//installapk



    /*
  Logic Desc: this function is to get the apk information once apk installed successfully then this function 
  is trigred.
  here i am running a batch command to get apk package information and app activity info.
  and this info is stored in a file named appInfoFile.txt and using line read by line module i am getting 
  package and appActivity info.
  after that same info is updated wrt to devicesId in devices collection
  Query: insert;
  Output: if data inserted successfullly positive response 
          else error
   */
    function getApkInfoWithAppActivity(appPath,devicesId,uploadedApkName){
      var dockerCommand = `@echo off\n
      aapt dumb badging ${appPath}  > ${__dirname + "\\appFolder\\appInfoFile.txt"}`
      var batchFileExce = __dirname + "\\appFolder\\appInfoFile.bat";
      fs.createWriteStream(batchFileExce);
      fs.appendFileSync(batchFileExce, dockerCommand, 'utf8');
      cmd.exec(batchFileExce, (err, stdout, stderr) => {
        return com_package_finder(`${__dirname + "\\appFolder\\appInfoFile.txt"}`,devicesId,uploadedApkName);
      })
    }
    
    var array=[];
    function com_package_finder(readFilePath,devicesId,uploadedApkName)
   {
  var LineByLineReader = require('line-by-line');
            var fs = require('fs');
            lr = new LineByLineReader(readFilePath);
            lr.on('error', function(err) {})
            
            var obj09={};
            lr.on('line', function(line) {
              if(line.includes("package"))
              {
                line.split('\'')[1];
                   obj09["packageName"] = line.split('\'')[1];
              }
              else if(line.includes("launchable-activity:")){
                obj09["packageActivity"]=line.split('\'')[1];
                 array.push(obj09); 
              }
             
            });
            lr.on('end', function () {
              dbcall(array,devicesId,uploadedApkName)
              });
            
            

}


 function dbcall(array,devicesId,uploadedApkName){
   db.devices.find({"DevicesId":devicesId},function(error,doc){
   if(doc.length !== 0){
    db.devices.update({DevicesId:devicesId},{$set:{
      "uploadedApkName":uploadedApkName,
      "packageName" : array[0].packageName,
      "packageActivity" : array[0].packageActivity
      
    }},
   function(err,doc){
     if(err) {console.log("Error :"+err.message)}
     else {console.log(doc)}
  });
   }
  });
 }



}//module exports