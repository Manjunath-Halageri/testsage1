const mongojs = require('mongojs');
var fs = require('fs');
var path = require("path");
var cmd = require('child_process');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');

async function getAllDetails(req, res) {
  console.log(req.query)
  db.loginDetails.find({ userName: req.query.userName }, function (err, doc) {
       console.log(doc)
       console.log(doc[0].projectId)
        db.projectSelection.find({ projectId: doc[0].projectId}, function (err, doc1) {
          console.log(doc1)
          res.json(doc1);
        }) 
      });
}

async function checkVaildUser(credentials) {
  credentials.statusId = 5;
  let objLogin = {};
  objLogin["userName"] = credentials.userName;
  let loginDetails = await dbServer.findCondition(db.loginDetails, objLogin);
  return loginDetails;
}

async function licenceDetails(orgId) {
  let aggregate = [
    { $match: { "orgId": orgId } },
    {
      $lookup: {
        from: "planType",
        localField: "planId",
        foreignField: "planId",
        as: "plan"
      }
    },
    {
      $project: {
        "plan.feature": 1, _id: 0,
        "plan.expiryDate": 1
      }
    }//shiva plan expiry date code
  ]



  let result = await dbServer.aggregate(db.organization, aggregate);
  return result[0].plan[0]
}

async function getMachineDetails(orgId) {
  let result = await dbServer.findCondition(db.licenseDocker, { "orgId": orgId, "machineType": "usersMachine" })
  return result[0]
}
// async function logOutUserDetails(userinfo) {
//   return await dbServer.findAndModify(
//     db.loginDetails,
//     { "_id": mongojs.ObjectId(userinfo.userId), loginActive: { $eq: true } },
//     { $set: { loginActive: false } }
//   )
// }

async function logOutUserDetails(userinfo) {
  console.log("\n123456789023456789023456789023456789034789234567\n", userinfo)//value coming
  //query giving error need to review
  return await dbServer.findAndModify(
    db.loginDetails,
    { "_id": mongojs.ObjectId(userinfo.userId), loginActive: { $eq: true } },
    { $set: { loginActive: false, "hubPort": null, "portVNC": null } }
  )
}


async function decrementLogin(userinfo) {
  return await dbServer.findAndModify(
    db.licenseDocker,
    { "_id": mongojs.ObjectId(userinfo.licenseId), noOfUserLogin: { $ne: 0 } },
    { $inc: { noOfUserLogin: -1 } }
  )

}


function deallocate(id, port, machine, userId, noOfUserLogin) {
  return new Promise((resolve, reject) => {
    let values = new Promise((resolve, reject) => {
      db.licenseDocker.aggregate([
        { $match: { "_id": mongojs.ObjectId(id) } },
        { $unwind: "$machineDetails" },
        { $unwind: "$machineDetails.browsers" },
        { $unwind: "$machineDetails.browsers.version" },
        { $match: { "machineDetails.browsers.version.hubUrlPort": port } },
        { $project: { _id: 0, "machineDetails.browsers.version.hubNmae": 1, "machineDetails.browsers.version.NodeName": 1 } }
      ], function (err, result) {
        if (err) { console.log(err) }

        console.log("DB RESULT is ", result);
        resolve(result[0].machineDetails.browsers.version);
      })
    })
    values.then(async (item) => {
      console.log(item.hubNmae, item.NodeName);
      console.log("mac ", machine)

      db.licenseDocker.update({ "_id": mongojs.ObjectId(id) }, { $pull: { "hubNames": item.hubNmae, "nodeNames": item.NodeName } })
      db.licenseDocker.update(
        { _id: mongojs.ObjectId(id) },

        { $push: { hubPort: { $each: [port], $sort: 1 } } }
      )

      if (noOfUserLogin !== 1) {

        let machine1 = machine + "UserInfra" + userId;
        let machine2 = machine + "ExecutionInfra";

        let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
        // let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
        // let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

        await createFile(filePath);
        // await createFile(textPath);
        // await createFile(textPath2);
        var dockerCommand = `@echo off\n
        @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
        docker stop ${item.hubNmae} ${item.NodeName}
      `
        var endresult = await createAndExecute(filePath, dockerCommand);
        if (endresult == "pass") {
          resolve("pass");
        }
      }
      else {
        resolve("pass")
      }
    })
  })
}


async function changeDockerStatus(userinfo) {
  console.log("Status modified to Stop")
  return await dbServer.findAndModify(
    db.licenseDocker,
    { "_id": mongojs.ObjectId(userinfo.licenseId) },
    { $set: { state: "Stopped", "scriptConfigdata.url": null, "machineDetails.0.url": null } }
  )
}
async function stopMachine(info) {
  var machine = "";
  let obj = {
    "_id": mongojs.ObjectId(info.licenseId)
  }
  let dockerDetails = await dbServer.findAndModify(db.licenseDocker, obj, { $set: { state: "Stopping" } });
  console.log("licence docker table is", dockerDetails);
  machine = dockerDetails.machineName;//Start new 
  console.log(machine, " ssssssssssss")
  let machine1 = machine + "UserInfraStop";
  let machine2 = machine + "ExecutionInfra";
  let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
  // let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
  // let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);
  await createFile(filePath);
  // await createFile(textPath);
  // await createFile(textPath2);
  var command = `@echo off\n
  docker-machine stop ${machine}
  `
  let endresult = await createAndExecute(filePath, command);
  if (endresult == "pass") {
    await changeDockerStatus(info);
    console.log("Machine stopped");
  }
  else {
    db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $set: { "error": "Error in stopping machine" } })
  }
  return ("completed")
}

function createAndExecute(filePath, data) {
  return new Promise((resolves, reject) => {
    var writerStream = fs.createWriteStream(filePath, { flags: 'w+' })
      .on('finish', function () {
        console.log("got the file");
      })
      .on('error', function (err) {
        +
          console.log(err.stack);
      });


    writerStream.write(data, function () {
      // Now the data has been written.
      console.log("Write completed.");
    })
    writerStream.end(() => {
      cmd.exec(filePath, (err, stdout, stderr) => {
        try {
          if (err) {
            throw (err)
            console.log(err)
          }
          else {
            console.log("\n\nCommand executed sucessfully\n\n")
            resolves("pass");
          }
        }
        catch (err) {
          console.log("error occured", err)
          resolves("fail")
        }
      })
    })
  })
}


function createFile(filePath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      console.log("file path existed")
      resolve("pass")
    }
    else {

      var writerStream = fs.createWriteStream(filePath)
        .on('finish', function () {

        })
        .on('error', function (err) {
          +
            console.log(err.stack);
        });
      writerStream.end(() => {
        console.log("file created");
        resolve("pass")
      })
    }

  })
}
module.exports = {
  checkVaildUser: checkVaildUser,
  licenceDetails: licenceDetails,
  logOutUserDetails: logOutUserDetails,
  decrementLogin: decrementLogin,
  changeDockerStatus: changeDockerStatus,
  stopMachine: stopMachine,
  deallocate: deallocate,
  getMachineDetails: getMachineDetails,
  getAllDetails: getAllDetails

};






