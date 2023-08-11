const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
var adb = require('adbkit');
var client = adb.createClient();
var cmd = require('child_process');
var Promise = require('bluebird')
var fs = require('fs');
var path = require("path");

function unBlockApi(req, res) {
  db.blockDevices.find(
    {
      "Date": new Date(req.query.Date),
      "UserId": req.query.UserId,
    }, function (err, doc) {
      res.json(doc)
    })
}

function multipleDevUnblock(req, res) {
  var currentTime = req.query.currentTime
  var UserId = req.query.UserId
  db.blockDevices.aggregate([
    {
      "$match": {
        "UserId": UserId,
        $and: [
          { "FromTime": { $lte: currentTime } },
          { "ToTime": { $gt: currentTime } }
        ]
      }
    },
    {
      "$lookup":
      {
        "from": "devices",
        "localField": "DeviceId",
        "foreignField": "DevicesId",
        "as": "result"
      }
    },
    { $unwind: "$result" },
  ], function (err, doc) {
    console.log(doc)
    res.json(doc)
  })
}

function checkBlockedDevice(req, res) {
  db.blockDevices.find(
    {
      "DeviceId": req.query.DeviceId,
      "Date": new Date(req.query.todayDate)
    },
    function (err, doc) {
      res.json(doc)
    })
}

function blockDevice(req, res) {
  var DevicesId = req.body.DeviceId;
  var convertedDate = new Date(req.body.todayDate);
  var CurrentTime = req.body.FromTime;
  var ToTime = req.body.ToTime;
  var UserId = req.body.UserId;
  var UserName = req.body.UserName;
  db.blockDevices.insert({ "DeviceId": DevicesId, "Date": convertedDate, "FromTime": CurrentTime, "ToTime": ToTime, "UserId": UserId, "UserName": UserName },
    function (err, doc) {
      if (doc.length != 0) {
        res.json(doc);
      }
    })
}

function postDevicesName(req, res) {
  listDevices(res);
}

/*
  Logic Desc: listDevices  is a function which will get connected info of system like
  device id, model number,android version.
  here i am creating a virtual adb shell to run adb command, once i get a out put from the respecive 
  command i am storing it to database finally.
  Query: insert;
  Output: if data inserted successfullly positive response 
          else error
   */
function listDevices(res) {
  client.listDevices()
    .then(function (devices) {
      return Promise.map(devices, function (device) {
        return client.shell(device.id, 'getprop ro.product.model')
          .then(adb.util.readAll)
          .then(function (output) {
            var devicesname = output.toString().trim()
            return client.shell(device.id, 'getprop ro.build.version.release')
              .then(adb.util.readAll)
              .then(function (output) {
                var devicesVersion = output.toString().trim()
                return insert(device.id, devicesname, devicesVersion, res)
              })
          })
      })
    })
    .then(function () {
      db.devices.find({}, function (err, doc) {
        if (doc.length !== 0) {
          res.json(doc);
          // runBatchFile();
        }
      })
    })
    .catch(function (err) {
      console.error('Something went wrong:', err.stack)
    })

}//function listDevices()

function insert(devicesid, devicesname, devicesVersion, res) {
  db.devices.findAndModify({
    query: { "DevicesId": devicesid },
    update: {
      $setOnInsert: {
        "DevicesName": devicesname,
        "DevicesVersion": devicesVersion
      }
    },
    new: true,
    upsert: true
  },
    function (error, doc) {
    });
}

function installApk(req, res) {
  var devicesId = req.body.deviceId;
  var apkpath = req.body.apkPath;
  var uploadedApkName = req.body.uplodedApkName;
  client.install(devicesId, apkpath)
    .then(function () {
      getApkInfoWithAppActivity(apkpath, devicesId, uploadedApkName);
      res.json(devicesId)
    })
    .catch(function (err) {
      console.error('Something went wrong:', err.stack)
    })
}

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
function getApkInfoWithAppActivity(appPath, devicesId, uploadedApkName) {
    var appInfoPath = path.join(__dirname, '../appFolder/appInfoFile.txt')
    var batchFileExce = path.join(__dirname, '../appFolder/appInfoFile.bat')
  var dockerCommand = `@echo off\n
            aapt dumb badging ${appPath}  > ${appInfoPath}`
  //var batchFileExce = __dirname + "\\appFolder\\appInfoFile.bat";
  fs.createWriteStream(batchFileExce);
  fs.appendFileSync(batchFileExce, dockerCommand, 'utf8');
  cmd.exec(batchFileExce, (err, stdout, stderr) => {
    return com_package_finder(`${appInfoPath}`, devicesId, uploadedApkName);
  })
}

var array = [];
function com_package_finder(readFilePath, devicesId, uploadedApkName) {
  var LineByLineReader = require('line-by-line');
  var fs = require('fs');
  lr = new LineByLineReader(readFilePath);
  lr.on('error', function (err) { })

  var obj09 = {};
  lr.on('line', function (line) {
    if (line.includes("package")) {
      line.split('\'')[1];
      obj09["packageName"] = line.split('\'')[1];
    }
    else if (line.includes("launchable-activity:")) {
      obj09["packageActivity"] = line.split('\'')[1];
      array.push(obj09);
    }
  });
  lr.on('end', function () {
    dbcall(array, devicesId, uploadedApkName)
  });
}


function dbcall(array, devicesId, uploadedApkName) {
  db.devices.find({ "DevicesId": devicesId }, function (error, doc) {
    if (doc.length !== 0) {
      db.devices.update({ DevicesId: devicesId }, {
        $set: {
          "uploadedApkName": uploadedApkName,
          "packageName": array[0].packageName,
          "packageActivity": array[0].packageActivity
        }
      },
        function (err, doc) {
          if (err) { console.log("Error :" + err.message) }
          else { console.log(doc) }
        });
    }
  });
}

module.exports = {
  unBlockApi: unBlockApi,
  multipleDevUnblock: multipleDevUnblock,
  checkBlockedDevice: checkBlockedDevice,
  blockDevice: blockDevice,
  postDevicesName: postDevicesName,
  installApk: installApk
};