const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');

var fs = require('fs');
const readline = require('readline');
var cmd = require('child_process');
var path = require("path");

// async function startMachine(req, res) {
//   console.log("get machine hitted ")
//   console.log(req.query, res.query)
//   console.log("I ma here in get machine ")
//   let details = {
//     orgId: Number(req.query.orgId),
//     machineType: "usersMachine"
//   }

//   let licenseDockerInfo = await dbServer.findCondition(db.licenseDocker, details);
//   console.log(licenseDockerInfo);

//   let obj = {
//     _id: mongojs.ObjectId(req.query.userId)
//   }

//   let userInfo = await dbServer.findCondition(db.loginDetails, obj);
//   console.log("user details", userInfo);
//   console.log("\n", userInfo[0].loginActive, licenseDockerInfo[0].noOfUserLogin, "\n\n OR \n\n")

//   if (userInfo[0].loginActive == false && licenseDockerInfo[0].noOfUserLogin < licenseDockerInfo[0].totalNoOfUser) {
//     console.log("1st")
//     console.log("I am in if condition.....start machine 1  ")
//     if (licenseDockerInfo[0].noOfUserLogin == 0) {
//       console.log("2nd")
//       console.log("I am in if condition.....start machine 2  ")
//       let result = await startDockerMachine(licenseDockerInfo[0]._id, userInfo[0].orgId, userInfo[0].userId, licenseDockerInfo[0].machineDetails[0].machine, licenseDockerInfo[0].machineDetails[0].allConatinerName)

//     } else {
//       console.log("3rd")
//       console.log("  no of user login is already 1....just increase total number by 1  ")
//       await updateNoOfLogin(userInfo[0]._id)

//     }
//   }
//   let result = await dbServer.findCondition(db.licenseDocker, details);
//   let result1 = await dbServer.findCondition(db.loginDetails, obj);

//   result.push(await result1)
//   return (await result);
// }

async function startMachine(req, res) {

  console.log("get machine hitted ")
  console.log(req.query)
  console.log("I ma here in get machine ")
  let details = {
    orgId: Number(req.query.orgId),
    machineType: "usersMachine"
  }

  let licenseDockerInfo = await dbServer.findCondition(db.licenseDocker, details);
  console.log("first", licenseDockerInfo);
  console.log("PORTS=====>", licenseDockerInfo[0].hubPort, licenseDockerInfo[0]._id);


  let array = await new Promise((resolve, reject) => {
    var arr = licenseDockerInfo[0].hubPort;
    resolve(arr);
  });

  let sorted = await new Promise((resolve, reject) => {
    console.log("ARRAY VALUE", array)
    var arr = array.sort((a, b) => {
      return a - b;
    })
    resolve(arr);
  });
  let reversed = await new Promise((resolve, reject) => {
    console.log("SORTED", sorted);
    var arr = sorted.reverse();
    resolve(arr);

  });
  let port = await new Promise((resolve, reject) => {
    console.log("REVERSED", reversed)
    var arr = reversed.pop()
    resolve(arr)
  })
  console.log("The final port is", port)

  let obj = {
    _id: mongojs.ObjectId(req.query.userId)
  }

  let userInfo = await dbServer.findCondition(db.loginDetails, obj);
  console.log("user details", userInfo);
  console.log("\n", userInfo[0].loginActive, licenseDockerInfo[0].noOfUserLogin, licenseDockerInfo[0].totalNoOfUser, "\n\n OR \n\n");

  if (userInfo[0].loginActive == false && licenseDockerInfo[0].noOfUserLogin < licenseDockerInfo[0].totalNoOfUser) {

    let objValues = await new Promise((resolve, reject) => {
      db.licenseDocker.aggregate([
        { $match: { "_id": mongojs.ObjectId(licenseDockerInfo[0]._id), "orgId": licenseDockerInfo[0].orgId } },
        { $unwind: "$machineDetails" },
        { $unwind: "$machineDetails.browsers" },
        { $unwind: "$machineDetails.browsers.version" },
        { $match: { "machineDetails.browsers.version.hubUrlPort": port } },
        { $project: { _id: 0, "machineDetails.browsers.version.hubNmae": 1, "machineDetails.browsers.version.vncPort": 1, "machineDetails.browsers.version.NodeName": 1 } }
      ],
        function (err, result) {
          if (err) { console.log(err) }

          console.log("DB RESULT is ", result);
          resolve(result[0].machineDetails.browsers.version);
        })
    })

    console.log("Processing values", objValues);
    //pass obtained array to start machine 

    console.log("1st")
    console.log("I am in if condition.....start machine 1 ");
    db.licenseDocker.update({ "_id": mongojs.ObjectId(licenseDockerInfo[0]._id) }, { $inc: { "noOfUserLogin": 1 } });
    db.loginDetails.update({ "userId": userInfo[0].userId }, { $set: { "loginActive": true } })
    let result = await dbServer.findCondition(db.licenseDocker, details);
    let result1 = await dbServer.findCondition(db.loginDetails, obj);

    result.push(await result1)
    res.json(result)

    if (licenseDockerInfo[0].noOfUserLogin == 0) {
      console.log("2nd")
      console.log("I am in if condition.....start machine 2 ");
      let result = await startDockerMachine(licenseDockerInfo[0]._id, userInfo[0].userId, userInfo[0].userId, licenseDockerInfo[0].machineDetails[0].machine, objValues, port)//node names ==> licenseDockerInfo[0].machineDetails[0].allConatinerName 
    }
  }
  else {
    let result = await dbServer.findCondition(db.licenseDocker, details);
    let result1 = await dbServer.findCondition(db.loginDetails, obj);

    result.push(await result1)
    res.json(result)
  }
}


function startNextHub(_id, orgId, userId, machine, values, port) {
  return new Promise(async (resolves, reject) => {
    console.log(orgId)
    console.log(machine)

    let machine1 = machine + "UserInfra" + userId;
    let machine2 = machine + "ExecutionInfra";

    let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
    let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
    let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

    await createFile(filePath);
    await createFile(textPath);
    await createFile(textPath2);
    console.log("start ........................................container5")
    var dockerCommand = `@echo off\n
        @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
        docker start ${values.hubNmae} ${values.NodeName} >> BREAK > ${textPath}
        `
    var dockerCommand1 = `@echo off\n
        @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
        docker ps --filter "name=${values.NodeName}" >> BREAK > ${textPath}
          `
    var endresult = await createAndExecute(filePath, dockerCommand);
    if (endresult == "pass") {
      var containerDetails = await createAndExecute(filePath, dockerCommand1);
      if (containerDetails == "pass") {
        var array = [];
        var temp = [];
        var vncPort = 0;

        let rl = readline.createInterface({
          input: fs.createReadStream(textPath)
        });
        rl.on('line', function (line) {
          var new_array = line.split(" ");
          temp = new_array.filter(function (el) {
            return el != '';
          })
        });
        rl.on('close', function (line) {
          array = temp;
          vncPort = array[array.length - 2].substr(8, 5);
          console.log("KKKKKKK ", vncPort);
          db.loginDetails.update({ "userId": userId }, { $set: { "hubPort": port, "portVNC": vncPort } })
          db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $pop: { "hubPort": -1 } });
          db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $push: { "hubNames": values.hubNmae, "nodeNames": values.NodeName } })
          resolves("pass");
        });
      }
    }
    else {
      resolve("pass");
    }
  })
}

async function startContainer(req, res) {
  let obj = {
    "userId": req.query.userId
  }
  let userInfo = await dbServer.findCondition(db.loginDetails, obj);
  
  if (await userInfo[0].hubPort == null) {

    let details = {
      orgId: Number(req.query.orgId),
      machineType: "usersMachine"
    }

    let licenseDockerInfo = await dbServer.findCondition(db.licenseDocker, details);
    let _id = licenseDockerInfo[0]._id;
    let userId = req.query.userId;
    let machine = licenseDockerInfo[0].machineDetails[0].machine;



    let array = await new Promise((resolve, reject) => {
      var arr = licenseDockerInfo[0].hubPort;
      resolve(arr);
    });

    let sorted = await new Promise((resolve, reject) => {
      console.log("ARRAY VALUE", array)
      var arr = array.sort((a, b) => {
        return a - b;
      })
      resolve(arr);
    });
    let reversed = await new Promise((resolve, reject) => {
      console.log("SORTED", sorted);
      var arr = sorted.reverse();
      resolve(arr);

    });
    let port = await new Promise((resolve, reject) => {
      console.log("REVERSED", reversed)
      var arr = reversed.pop()
      resolve(arr)
    })
    console.log("The final port is", port)

    let values = await new Promise((resolve, reject) => {
      db.licenseDocker.aggregate([
        { $match: { "_id": mongojs.ObjectId(licenseDockerInfo[0]._id), "orgId": licenseDockerInfo[0].orgId } },
        { $unwind: "$machineDetails" },
        { $unwind: "$machineDetails.browsers" },
        { $unwind: "$machineDetails.browsers.version" },
        { $match: { "machineDetails.browsers.version.hubUrlPort": port } },
        { $project: { _id: 0, "machineDetails.browsers.version.hubNmae": 1, "machineDetails.browsers.version.vncPort": 1, "machineDetails.browsers.version.NodeName": 1, "machineDetails.browsers.version.zapName": 1 } }
      ],
        function (err, result) {
          if (err) { console.log(err) }

          console.log("DB RESULT is ", result);
          resolve(result[0].machineDetails.browsers.version);
        })
    })

    let machine1 = machine + "UserInfra" + userId;
    let machine2 = machine + "ExecutionInfra";

    let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
    let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
    let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

    await createFile(filePath);
    await createFile(textPath);
    await createFile(textPath2);

    let scriptobj={
      "scriptId": userInfo[0].selectedScript
    }
  
    let scriptInfo = await dbServer.findCondition(db.testScript, scriptobj); 
    if(scriptInfo[0].compeleteArray[scriptInfo[0].compeleteArray.length-1].securityTesting == true){
    var dockerCommand = `@echo off\n
          @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
          docker start ${values.hubNmae} ${values.NodeName} ${values.zapName} >> BREAK > ${textPath}
          `
    var dockerCommand1 = `@echo off\n
          @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
          docker ps --filter "name=${values.NodeName}" >> BREAK > ${textPath}
            `
    var dockerCommand2 = `@echo off\n
          @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
          docker ps --filter "name=${values.zapName}" >> BREAK > ${textPath}
            `
    var endresult = await createAndExecute(filePath, dockerCommand);
    if (endresult == "pass") {
      var containerDetails = await createAndExecute(filePath, dockerCommand1);
      if (containerDetails == "pass") {
        var array1 = [];
        var temp = [];
        var vncPort = 0;

        let rl = readline.createInterface({
          input: fs.createReadStream(textPath)
        });
        rl.on('line', function (line) {
          var new_array = line.split(" ");
          temp = new_array.filter(function (el) {
            return el != '';
          })
        });
        rl.on('close', function (line) {
          array1 = temp;
          vncPort = array1[array1.length - 2].substr(8, 5);
          console.log("KKKKKKK ", vncPort);
          db.loginDetails.update({ "userId": userId }, { $set: { "hubPort": port, "portVNC": vncPort } })
          db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $pop: { "hubPort": -1 } });
          db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $push: { "hubNames": values.hubNmae, "nodeNames": values.NodeName } });
        });
      
    while(zaphealthy != "(healthy)"){
      var zapcontainerHealth = await createAndExecute(filePath, dockerCommand2);
      console.log("zap info executed"+zapcontainerHealth);
      if (zapcontainerHealth == "pass") {
        console.log("zap info pass")
        
        var array2 = [];
        var temp2 = [];
        var zaphealthy;

        let r2 = readline.createInterface({
          input: fs.createReadStream(textPath)
        });
        r2.on('line', function (line) {
          var new_array1 = line.split(" ");
          console.log(line);
          temp2 = new_array1.filter(function (el) {
            return el != '';
          })
        });
        r2.on('close', function (line) {
          array2 = temp2;
          zaphealthy = array2[array2.length - 3];
          console.log(zaphealthy);
        });
      }
      else{
        console.log("zap info fail");
      }
    }
    res.json({});
  }
  }
  }
  else{
    var dockerCommand = `@echo off\n
    @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
    docker start ${values.hubNmae} ${values.NodeName} >> BREAK > ${textPath}
    `
    var dockerCommand1 = `@echo off\n
    @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
    docker ps --filter "name=${values.NodeName}" >> BREAK > ${textPath}
      `
    var endresult = await createAndExecute(filePath, dockerCommand);
    if (endresult == "pass") {
    var containerDetails = await createAndExecute(filePath, dockerCommand1);
    if (containerDetails == "pass") {
     var array1 = [];
     var temp = [];
     var vncPort = 0;

     let rl = readline.createInterface({
     input: fs.createReadStream(textPath)
   });
  rl.on('line', function (line) {
    var new_array = line.split(" ");
    temp = new_array.filter(function (el) {
      return el != '';
    })
  });
  rl.on('close', function (line) {
    array1 = temp;
    vncPort = array1[array1.length - 2].substr(8, 5);
    console.log("KKKKKKK ", vncPort);
    db.loginDetails.update({ "userId": userId }, { $set: { "hubPort": port, "portVNC": vncPort } })
    db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $pop: { "hubPort": -1 } });
    db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $push: { "hubNames": values.hubNmae, "nodeNames": values.NodeName } });
    res.json({})
  });
}
}
  }
  }
  else {
    res.json({})
  }
}

async function getTheFile(req, res) {
  let details = {
    orgId: Number(req.query.orgId),
    machineType: "jmeterUsersMachine"
  }
  let userInfo = await dbServer.findCondition(db.loginDetails, { userId: req.query.userId })

  let licenseDockerInfo = await dbServer.findCondition(db.licenseDocker, details);
  let machine = licenseDockerInfo[0].machineName


  var jmxfiles = `../../uploads/opal/${req.query.projectName}/MainProject/jmxFiles/`;
  var jmxfilesPath = path.join(__dirname, jmxfiles);
  var modulepath = `../../uploads/opal/${req.query.projectName}/MainProject/jmxFiles/${req.query.moduleId}/`;
  var modulePath = path.join(__dirname, modulepath);
  if (!fs.existsSync(modulePath)) {
    fs.mkdir(modulePath, function (err) {
      console.log("modulePath folder created");
    })
  }
  var featurepath = `../../uploads/opal/${req.query.projectName}/MainProject/jmxFiles/${req.query.moduleId}/${req.query.featureId}/`;
  var featurePath = path.join(__dirname, featurepath);
  if (!fs.existsSync(featurePath)) {
    fs.mkdir(featurePath, function (err) {
      console.log("featurePath folder created");
    })
  }
  var jmxfileNameFolder = `../../uploads/opal/${req.query.projectName}/MainProject/jmxFiles/${req.query.moduleId}/${req.query.featureId}/${req.query.scriptId}`;
  var jmxfileNameFolderPath = path.join(__dirname, jmxfileNameFolder);
  if (!fs.existsSync(jmxfileNameFolderPath)) {
    fs.mkdir(jmxfileNameFolderPath, function (err) {
      console.log("jmxfileNameFolderPath folder created");
    })
  }
  var trailFileNameFolder = `../../uploads/opal/${req.query.projectName}/MainProject/jmxFiles/${req.query.moduleId}/${req.query.featureId}/${req.query.scriptId}/trail_test`;
  var trailFileNameFolderPath = path.join(__dirname, trailFileNameFolder);
  if (!fs.existsSync(trailFileNameFolderPath)) {
    fs.mkdir(trailFileNameFolderPath, function (err) {
      console.log("trailFileNameFolderPath folder created");
    })
  }

  let filePath = path.join(__dirname, `batchfolder/${machine}.bat`);
  await createFile(filePath);
  var dockerCommand = `@echo off\n
          @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
          docker cp ${userInfo[0].masterNode}:/home/seluser/Downloads/${req.query.scriptId}.jmx ${trailFileNameFolderPath}`

  var removeFile = `@echo off\n
    @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
    docker exec ${userInfo[0].masterNode} rm -rf /home/seluser/Downloads/${req.query.scriptId}.jmx`

  var copyFile = await createAndExecute(filePath, dockerCommand);
  if (copyFile == "pass") {
    var rmFile = await createAndExecute(filePath, removeFile);
    db.jmxFiles.find({ "moduleId": req.query.moduleId, "projectId": req.query.projectId, "featureId": req.query.featureId, "jmxFileName": req.query.scriptName }, function (err, result1) {
      if (result1.length > 0) {
        // duplicates are present
      } else {
        // no duplicate
        db.jmxFiles.insert({
          "moduleId": req.query.moduleId,
          "projectId": req.query.projectId,
          "featureId": req.query.featureId,
          "jmxFileName": req.query.scriptName,
          "jmxFileId": req.query.scriptId,
          "status": "not executed",
          "CSVFileName": [],
          "Listener": "notcreated"
        },
          function (err, scr) {
          })
      }
    })
    if (rmFile == "pass") {
      res.json("pass")
    }
    else {
      res.json("fail")
    }
  }
  else {
    res.json("fail")
  }

}




function startDockerMachine(_id, orgId, userId, machine, values, port) {
  return new Promise(async (resolves, reject) => {
    db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $set: { "state": "Starting", "machineStatus": "Starting" } })
    var ip = 0;
    // var containerList = "";
    console.log("I am hereeeeeeeeeeeee   ......start Docker machine ")
    console.log(orgId)
    console.log(machine)


    let machine1 = machine + "UserInfra";
    let machine2 = machine + "ExecutionInfra";

    let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
    let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
    let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

    await createFile(filePath);
    await createFile(textPath);
    await createFile(textPath2);

    console.log("Starting............................")
    var dockerCommand = `@echo off\n
    docker-machine start  ${machine} >> BREAK > ${textPath}\n 
    docker-machine ls  >> BREAK > ${textPath2}
  `


    var endResult = await createAndExecute(filePath, dockerCommand);
    if (endResult == "pass") {
      console.log("Started............................")
      var dockerCommand = `@echo off\n
      docker-machine regenerate-certs --force ${machine} >> BREAK > ${textPath}
    `
      var regenerateIP = await createAndExecute(filePath, dockerCommand);
      if (regenerateIP == "pass") {

        var dockerMachineIp = `@echo off\n
          docker-machine ip ${machine}  >> BREAK > ${textPath2}
          `
        var machineIP = await createAndExecute(filePath, dockerMachineIp);
        if (machineIP == "pass") {
          //read ip from text file
          //assign it to an variable
          //update the ip in collection
          const rl = readline.createInterface({
            input: fs.createReadStream(textPath2)
          });


          rl.on('line', (line) => {
            console.log(line);
            ip = line;
          }).on('close', () => {
            console.log("THE IPPPPPPPPPPPPPPPPPPPPP :", ip)
            db.licenseDocker.findAndModify({
              query: { "_id": mongojs.ObjectId(_id), "scriptConfigdata.url": { $eq: null } },
              update: {
                $set:
                {
                  "scriptConfigdata.url": `http://${ip}:4444`,
                  "machineDetails.0.url": `${ip}`
                }
              }
            }, (err, doc) => {
              db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $set: { "state": "Running", "machineStatus": "Started" } })
              resolves("pass");
              console.log("Infrastructure is up & ready to use");
            })
          });

        }
        // //////////////////////////////////////////////////
      }
      else {
        db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $set: { "machineStatus": "machine did not start" } })
        console.log("Not Started...............")
      }

    }
    else {
      console.log("Not Started............................")
      db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $set: { "machineStatus": "machine did not start" } })
      resolves("pass");
    }


  })
} //main function 



async function busyToFree(obj2) {

  console.log("scripts  length  .............")
  console.log(obj2.idLicenseDocker)
  console.log(obj2.data)
  let obj = {}
  obj = {
    scriptsNew: obj2.data,
    idLicenseDocker: obj2.idLicenseDocker
  }

  let tempReturn = 0;
  let mySet = new Set()
  let values = []

  for (i = 0, j = 0; i < obj.scriptsNew.length; i++) {

    let obj2 = {
      browser: obj.scriptsNew[i].browser,
      versionName: obj.scriptsNew[i].versionName,
      noOfBrowsers: obj.scriptsNew[i].noOfBrowsers

    }

    values.push(obj2)

  }

  console.log("up to here   .............in decraese function")

  const unique = []

  const duplicates1 = values.filter(o => {
    if (unique.find(i => i.browser === o.browser && i.versionName === o.versionName)) {
      return true
      //console.log("it returned true ")
    }
    unique.push(o)
  })
  console.log(unique.length)

  console.log(unique)
  console.log("valuessssssssss filterrrrrrrrrr  uniqueeeeeeeeeeeeeeee  decrease function")
  //let licenseDocker = await licenseDockerService.getMachine({"_id": mongojs.ObjectId(obj.idLicenseDocker)});
  console.log(obj.idLicenseDocker)
  let licenseDocker = await dbServer.findCondition(db.licenseDocker, { "_id": mongojs.ObjectId(obj.idLicenseDocker) });
  console.log(licenseDocker[0].machineDetails[0].browsers.length)
  console.log("unique   length isssssss calingggggggggggggggggg    decrease function")
  console.log(unique.length)




  for (temp = 0; temp < unique.length; temp++) {
    console.log(temp)
    console.log(unique[temp].browser)
    console.log(unique[temp].versionName)
    console.log(unique[temp].noOfBrowsers)










    let temp2 = 0
    while (temp2 < licenseDocker[0].machineDetails[0].browsers.length) {
      console.log(licenseDocker[0].machineDetails[0].browsers[temp2].browserName)
      console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version)

      if (licenseDocker[0].machineDetails[0].browsers[temp2].browserName == unique[temp].browser) {
        console.log("browser is same   decrease function ")
        console.log("number of instance in Browser   decrease function  ")
        console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version.length)

        let temp3 = 0;
        while (temp3 < licenseDocker[0].machineDetails[0].browsers[temp2].version.length) {
          if (licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].versionName == unique[temp].versionName) {
            console.log("Version is same   decrease function")
            console.log(" total number of instance  and busy ...see   below  decrease function  ")
            console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].noOfInstance)
            console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].busy)
            let availableBrowser = 0;
            availableBrowser = licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].busy;

            console.log("User input .....number of instance to decrease   ")
            console.log(unique[temp].noOfBrowsers)

            if (unique[temp].noOfBrowsers <= availableBrowser) {

              console.log("mongo id  ", obj.idLicenseDocker)
              console.log("no of instance to decrease   ", unique[temp].noOfBrowsers)
              db.licenseDocker.update({ "_id": mongojs.ObjectId(obj.idLicenseDocker) },
                { $inc: { [`machineDetails.0.browsers.${temp2}.version.${temp3}.busy`]: -unique[temp].noOfBrowsers } }, (err, doc) => {
                  if (err) console.log(err)
                  console.log(doc)
                })
              //  console.log("All condition satisfied ")
              //  console.log("All condition browser name , instance and number  ")
              //  console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].versionName)
              //  console.log(licenseDocker[0].machineDetails[0].browsers[temp2].browserName)
              //  console.log(temp2)
              //  console.log(temp3)
              console.log("enddddddddd   decreased ..............\n\n\n\n")
              //return "browser is  available and everything went good"
              tempReturn = 1;

              break;

            }
            else {
              console.log("Number of instance requested to decrease cant be done since it will go in negative")
              console.log("reqested is  " + unique[temp].noOfBrowsers)
              console.log("Available is     " + availableBrowser)
              tempReturn = -1;
              //return "browser is not available"

              break;

            }

          }
          temp3 = temp3 + 1;

        }



      }

      temp2 = temp2 + 1

    }


  }

  if (tempReturn == 1) {
    return "true   evrything went gooood"
  } else {
    return "False   browser can't be decraese  "
  }
  //busyToFree end 

}




async function availableToBusy(obj) {
  //console.log(obj)
  //let licenseDocker = await dbServer.findCondition(db.licenseDocker, details);
  console.log(" \n\n \n\n \n\n manish login license docker service.js  \n\n ")
  console.log("manish proj       manish(noOfbrowser,browser,version) ")
  console.log(" write code to increase browser busy ....in database ")
  console.log("scripts  length  .............")
  //console.log(obj.scriptsNew); //idLicenseDocker
  //console.log(obj.idLicenseDocker);

  //console.log(obj.scriptsNew.length)
  // obj2 = {}
  // return condition checking 
  let tempReturn = 0;
  let mySet = new Set()
  let values = []

  for (i = 0, j = 0; i < obj.scriptsNew.length; i++) {

    let obj2 = {
      browser: obj.scriptsNew[i].browser,
      versionName: obj.scriptsNew[i].versionName,
      noOfBrowsers: obj.scriptsNew[i].noOfBrowsers

    }

    values.push(obj2)

  }



  const unique = []

  const duplicates1 = values.filter(o => {
    if (unique.find(i => i.browser === o.browser && i.versionName === o.versionName)) {
      return true
      //console.log("it returned true ")
    }
    unique.push(o)
  })

  console.log(unique.length)

  console.log(unique)
  console.log("valuessssssssss filterrrrrrrrrr  uniqueeeeeeeeeeeeeeee")


  let licenseDocker = await dbServer.findCondition(db.licenseDocker, { "_id": mongojs.ObjectId(obj.idLicenseDocker) });
  console.log(licenseDocker[0].machineDetails[0].browsers.length)
  console.log("unique   length isssssss calingggggggggggggggggg")
  console.log(unique.length)






  for (temp = 0; temp < unique.length; temp++) {
    console.log(temp)
    console.log(unique[temp].browser)
    console.log(unique[temp].versionName)
    console.log(unique[temp].noOfBrowsers)









    console.log("////////////////Work from here on Tuesday....browser busy get it from Angular/////////////////////")
    let temp2 = 0
    while (temp2 < licenseDocker[0].machineDetails[0].browsers.length) {
      //licenseDocker[0].machineDetails[0].browsers[temp2].browserName
      console.log("We are in While looooop ")


      console.log(licenseDocker[0].machineDetails[0].browsers[temp2].browserName)

      console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version)

      if (licenseDocker[0].machineDetails[0].browsers[temp2].browserName == unique[temp].browser) {
        console.log("browser is same ")
        console.log("number of instance in Browser   ")
        console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version.length)

        let temp3 = 0;
        while (temp3 < licenseDocker[0].machineDetails[0].browsers[temp2].version.length) {
          if (licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].versionName == unique[temp].versionName) {
            console.log("Version is same ")
            console.log(" total number of instance  and busy ...see   below  ")
            console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].noOfInstance)
            console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].busy)
            let availableBrowser = 0;
            availableBrowser = licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].noOfInstance - licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].busy;

            console.log("User input .....number of instance ")
            console.log(unique[temp].noOfBrowsers)

            if (unique[temp].noOfBrowsers <= availableBrowser) {

              console.log("mongo id  ", obj.idLicenseDocker)
              console.log("no of instance   ", unique[temp].noOfBrowsers)
              db.licenseDocker.update({ "_id": mongojs.ObjectId(obj.idLicenseDocker) },
                { $inc: { [`machineDetails.0.browsers.${temp2}.version.${temp3}.busy`]: unique[temp].noOfBrowsers } }, (err, doc) => {
                  if (err) console.log(err)
                  console.log(doc)
                })
              //  console.log("All condition satisfied ")
              //  console.log("All condition browser name , instance and number  ")
              //  console.log(licenseDocker[0].machineDetails[0].browsers[temp2].version[temp3].versionName)
              //  console.log(licenseDocker[0].machineDetails[0].browsers[temp2].browserName)
              //  console.log(temp2)
              //  console.log(temp3)
              //  console.log("mmmmmmmmmmmmmmmmmmaaaaaniiiisssssssshhhhhhhhh")
              //return "browser is  available and everything went good"
              tempReturn = 1;
              break;

            }
            else {
              console.log("Number of instance requested by user is not available at this time")
              console.log("reqested is  " + unique[temp].noOfBrowsers)
              console.log("Available is     " + availableBrowser)
              tempReturn = -1;
              //return "browser is not available"

              break;

            }

          }
          temp3 = temp3 + 1;

        }

      }
      temp2 = temp2 + 1
    }
  }

  if (tempReturn == 1) {
    return "true   evrything went gooood"
  } else {
    return "False   browser is not available "
  }
}  // availableToBusy




async function isBrowswerIsfree(details) {

  console.log("Browser is  available are  license docker service  ");
  //console.log(details)
  let licenseDocker = await licenseDockerService.getMachine({ details });


  noOfBrowserAvialbale = licenseDocker[0].scriptConfigdata.totalInstanceForCreateTestCase - licenseDocker[0].scriptConfigdata.busyInstanceForCreateTestCase
  console.log(" Vijay Browser is  available are ");
  return (noOfBrowserAvialbale)
}

async function testCaseBrowserTotalNoIncreaseBy1(details) {
  console.log("BrowserTotalNoIncreaseBy1    is JS Service  file license Docker  ")

  let licenseDocker = await licenseDockerService.getMachine({ details });


  noOfBrowserAvialbale = licenseDocker[0].scriptConfigdata.totalInstanceForCreateTestCase - licenseDocker[0].scriptConfigdata.busyInstanceForCreateTestCase

  if (noOfBrowserAvialbale < licenseDocker[0].scriptConfigdata.totalInstanceForCreateTestCase) {
    console.log(" Browser  INcrease   By1  ")
    // I have to change here 
    db.licenseDocker.update({ "_id": ObjectId("5e05b02653cf7d44dda31daf") },
      {
        "$inc": { "scriptConfigdata": { "busyInstanceForCreateTestCase": 1 } }
      })
    console.log(" Vijay +1 available are ");
  }
  return noOfBrowserAvialbale

}

async function testCaseBrowserTotalNoDecreaseBy1(details) {
  console.log("BrowserTotalNoDEcreaseBy1    is JS Service  file license Docker  ")

  let licenseDocker = await licenseDockerService.getMachine({ details });


  noOfBrowserAvialbale = licenseDocker[0].scriptConfigdata.totalInstanceForCreateTestCase - licenseDocker[0].scriptConfigdata.busyInstanceForCreateTestCase

  if (noOfBrowserAvialbale >= 1) {
    console.log(" Browser  decrease    By1  ")

    db.licenseDocker.update({ "_id": ObjectId("5e05b02653cf7d44dda31daf") },
      {
        "$inc": { "scriptConfigdata": { "busyInstanceForCreateTestCase": -1 } }
      })
    console.log(" Vijay -1 available are ");
  }
}

async function updateNoOfLogin(_id) {
  db.licenseDocker.update({ "_id": mongojs.ObjectId(_id) }, { $inc: { "noOfUserLogin": 1 } })
  // db.loginDetails.update({ "userId":userId }, { $set: { "loginActive": true } })
  return true;
}

async function userLoginActive(uid, password) {
  let log = db.loginDetils.find({ "userId:": "U00" })
  console.log(log)
  log = log[0].loginActive
  console.log("login active is not ", log)
  return log

}
async function startDocekrManually(req, res) {
  console.log("The resulting data", req.body)
  // let batchFile = __dirname + '\\start.bat';
  // let textFile = __dirname + '\\start.txt';
  var ip = 0;
  let machine = req.body.machineName;

  let machine1 = machine + "UserInfra";
  let machine2 = machine + "ExecutionInfra";

  let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
  let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
  let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

  await createFile(filePath);
  await createFile(textPath);
  await createFile(textPath2);

  if (req.body.machineType === "usersMachine") {

    var containerList1 = '';

    db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "machineStatus": "Started" } });
    var dockerCommand = `@echo off\n
      docker-machine start ${machine} >> BREAK > ${textPath}\n 
      docker-machine ls >> BREAK > ${textPath}
    `
    req.body.hubNames.forEach(element => {
      console.log("Each hub", element);
      containerList1 = containerList1 + " " + element;
    });

    req.body.nodeNames.forEach(element => {
      console.log("Each node", element);
      containerList1 = containerList1 + " " + element;
    });
    console.log("List of containers", containerList1);
    var startMachine = await createAndExecute(filePath, dockerCommand);

    if (startMachine == "pass") {

      console.log("start ..............container")

      var dockerCommand = `@echo off\n
      docker-machine regenerate-certs --force ${machine} >> BREAK > ${textPath}
    `
      var regenerate = await createAndExecute(filePath, dockerCommand);
      if (regenerate == "pass") {
        var containerStart = `@echo off\n
        @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i\n
        docker start ${containerList1} >> BREAK > ${textPath}
      `;
        var startContainers = await createAndExecute(filePath, containerStart);
        if (startContainers == "pass") {
          var dockerMachineIp = `@echo off\n
          docker-machine ip ${machine} >> BREAK > ${textPath}
        `;
          var machineIP = await createAndExecute(filePath, dockerMachineIp);
          if (machineIP == "pass") {
            db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "state": "Running" } })
            const rl = readline.createInterface({
              input: fs.createReadStream(textPath)
            });
            rl.on('line', (line) => {
              console.log(line);
              ip = line;
            }).on('close', () => {
              console.log("THE IPPPPPPPPPPPPPPPPPPPPP :", ip)
              db.licenseDocker.findAndModify({
                query: { "_id": mongojs.ObjectId(req.body._id), "scriptConfigdata.url": { $eq: null } },
                update: {
                  $set:
                  {
                    "scriptConfigdata.url": `http://${ip}:4444`,
                    "machineDetails.0.url": `${ip}`
                  }
                }
              }, (err, doc) => {
                console.log("Infrastructure is up & ready to use", doc);
              })

            });
          }
        }
      }
    }
    else {
      console.log("Machine did not started at first set error meassage in collection");
      await db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "error": "Docker Machine not starting please contact Testsage solution team" } })
    }
    return ("pass");

  }
  else {

    var containerList = '';
    // console.log("!!!!!!!", req.body._id, "!!!!!", req.body.machineDetails[0].allConatinerName, "22222", req.body.machineName);
    db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "machineStatus": "Started", "check": true } });
    var dockerCommand = `@echo off\n
    docker-machine start ${machine} >> BREAK > ${textPath}\n 
    docker-machine ls >> BREAK > ${textPath}
  `
    req.body.machineDetails[0].allConatinerName.forEach(element => {
      console.log("Each element", element);
      containerList = containerList + " " + element;
    });
    console.log("List of containers", containerList);
    var startMachine = await createAndExecute(filePath, dockerCommand);
    if (startMachine == "pass") {

      console.log("start ..............container")

      var dockerCommand = `@echo off\n
      docker-machine regenerate-certs --force ${machine} >> BREAK > ${textPath}
    `
      var regenerate = await createAndExecute(filePath, dockerCommand);
      if (regenerate == "pass") {
        var containerStart = `@echo off\n
        @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i\n
        docker start hub ${containerList} >> BREAK > ${textPath}
      `;
        var startContainers = await createAndExecute(filePath, containerStart);
        if (startContainers == "pass") {
          var dockerMachineIp = `@echo off\n
          docker-machine ip ${machine} >> BREAK > ${textPath}
        `;
          var machineIP = await createAndExecute(filePath, dockerMachineIp);
          if (machineIP == "pass") {
            db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "state": "Running" } })
            const rl = readline.createInterface({
              input: fs.createReadStream(textPath)
            });
            rl.on('line', (line) => {
              console.log(line);
              ip = line;
            }).on('close', () => {
              console.log("THE IPPPPPPPPPPPPPPPPPPPPP :", ip)
              db.licenseDocker.findAndModify({
                query: { "_id": mongojs.ObjectId(req.body._id), "scriptConfigdata.url": { $eq: null } },
                update: {
                  $set:
                  {
                    "scriptConfigdata.url": `http://${ip}:4444`,
                    "machineDetails.0.url": `http://${ip}:4444`,
                    "error": ""
                  }
                }
              }, (err, doc) => {
                console.log("Infrastructure is up & ready to use", doc);
              })

            });
          }
        }
      }
      else {
        console.log("Not Started..................")
        await db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "error": "Docker Machine not starting please contact Testsage solution team" } })
      }
    }
    else {
      console.log("Machine did not started at first set error meassage in collection");
      await db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "error": "Docker Machine not starting please contact Testsage solution team" } })
    }
    return ("pass");
  }

}

async function stopDocekrManually(req, res) {
  console.log("The resulting data", req.body)

  var machine = req.body.machineName;

  let machine1 = machine + "UserInfra";
  let machine2 = machine + "ExecutionInfra";

  let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
  let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
  let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

  db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "machineStatus": "Stopping" } });

  await createFile(filePath);
  await createFile(textPath);
  await createFile(textPath2);

  var dockerCommand = `@echo off\n
    docker-Machine stop ${machine} >> BREAK > ${textPath}
  `;

  var stopMachine = await createAndExecute(filePath, dockerCommand);
  if (stopMachine == "pass") {
    if (req.body.machineType == "jmeterExecutionMachine") {
      db.licenseDocker.update(
        { "_id": mongojs.ObjectId(req.body._id), "machineType": "jmeterExecutionMachine" },
        {
          $set: {
            "jmeterData.$[j].state": "Stopped",
            "jmeterData.$[j].userName": "",
            "jmeterData.$[j].status": "available"
          }
        },
        {
          arrayFilters: [
            {
              "j.state": "Running"
            }
          ]
        },
        function (err, doc) {
          console.log(doc)
          console.log(err)
        }
      )
    }
    db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "state": "Stopped", "scriptConfigdata.url": null, "machineDetails.0.url": null, "machineStatus": "Stopped" } });
  }
  else {

    console.log("ERROR IN stopping Docker Machine please try ");

  }
  return ("pass");
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
            //console.log(err)
          }
          else if (stderr) {
            console.log("Failed..!!!!")
            resolves("fail")
          }
          else {
            console.log("\n\nCommand executed sucessfully\n\n")
            resolves("pass");
          }
        }
        catch (err) {
          console.log("error occured", err)
          resolves("fail");
        }
      })
    })
  })
}

function findCall(req, res) {
  // console.log("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", req);
  let details = {
    "_id": mongojs.ObjectId(req.query._id)
  }
  return dbServer.findCondition(db.licenseDocker, details);
}

async function autoStopService(info, res) {
  console.log("INFORMATION ARE ", info.idMachine, info.idOrg, info.idOrg)

  var document = [];
  let doc;
  console.log("type of ##########", typeof (info.idOrg))
  let dbCheck = new Promise((resolve, reject) => {
    db.licenseDocker.aggregate([
      { $match: { _id: mongojs.ObjectId(info.idMachine), "machineType": "executionMachine", "orgId": parseInt(info.idOrg) } },
      { $unwind: "$machineDetails" },
      { $unwind: "$machineDetails.browsers" },
      { $unwind: "$machineDetails.browsers.version" },
      { $match: { "machineDetails.browsers.version.status": "Running" } },
      { $project: { _id: 0, "machineDetails.browsers.version.status": 1 } }
    ], function (err, result) {
      console.log("IF ERROR ERROR:", err);
      console.log("AGGRIGATE RESULT IS", result);
      resolve(result);
    });
  });
  // db.getCollection('licenseDocker').aggregate([
  //   { $match: { _id: ObjectId("60066c06d3aa2c38c84f3240"), "orgId": 60 } },
  //   { $unwind: "$machineDetails" },
  //   { $unwind: "$machineDetails.browsers" },
  //   { $unwind: "$machineDetails.browsers.version" },
  //   { $match: { "machineDetails.browsers.version.status": "Running" } },
  //   { $project: { _id: 0, "machineDetails.browsers.version.status": 1 } }
  // ])

  dbCheck.then(async function (value) {
    var containerList = '';
    console.log("The value of document are", value, "LENGTH ISSSSSSSSSSS", value.length);


    let dbGetInfo = new Promise((resolve, reject) => {
      db.licenseDocker.find({ "_id": mongojs.ObjectId(info.idMachine) }, function (err, res) {
        console.log("The id ", res);
        res[0].machineDetails[0].allConatinerName.forEach(element => {
          console.log("Each element", element);
          containerList = containerList + " " + element;
        });
        resolve(res);
      });
    });

    dbGetInfo.then(async function (secondValue) {
      console.log("DB FIND RESULT:", secondValue, containerList);

      var machine = secondValue[0].machineName;
      if (value.length != 0) {
        console.log("if any one is running Exit loop");
        res.json("Fail");
      }
      else {
        console.log("INSIDE ELSSSSSSSSSSSSSSSSSEEEEEEEEEEEEEEEE");

        // let filePath = __dirname + '\\createExecution.bat'; //batch file Path
        // console.log(filePath);
        // let textPath = __dirname + '\\createExecution.txt'; //The output from batch file will be visible in text file
        // let textPath2 = __dirname + '\\readExecution.txt';

        let machine1 = machine + "UserInfra";
        let machine2 = machine + "ExecutionInfra";

        let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
        let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
        let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

        await createFile(filePath);
        await createFile(textPath);
        await createFile(textPath2);

        dockerCommand = `@echo off\n
            @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
            docker stop hub ${containerList} >> BREAK > ${textPath}
          `;

        var stopContainer = await createAndExecute(filePath, dockerCommand);
        if (stopContainer == "pass") {
          db.licenseDocker.update({ "_id": mongojs.ObjectId(secondValue[0]._id) }, { $set: { "state": "Stopped", "scriptConfigdata.url": null, "machineDetails.0.url": null } });
          var dockerCommand = `@echo off\n
              docker-Machine stop ${machine} >> BREAK > ${textPath}
            `;

          var stopMachine = await createAndExecute(filePath, dockerCommand);
          res.json("Pass");

        }
        else {

          console.log("ERROR IN stopping Docker Machine please try ");
          res.json("Fail");
        }
      }
    });
  });
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

  startMachine: startMachine,
  startDockerMachine: startDockerMachine,
  updateNoOfLogin: updateNoOfLogin,
  userLoginActive: userLoginActive,
  testCaseBrowserTotalNoIncreaseBy1: testCaseBrowserTotalNoIncreaseBy1,
  testCaseBrowserTotalNoDecreaseBy1: testCaseBrowserTotalNoDecreaseBy1,
  isBrowswerIsfree: isBrowswerIsfree,
  availableToBusy: availableToBusy,
  busyToFree: busyToFree,
  startDocekrManually: startDocekrManually,
  stopDocekrManually: stopDocekrManually,
  findCall: findCall,
  autoStopService: autoStopService,
  startContainer: startContainer,
  getTheFile: getTheFile
};





