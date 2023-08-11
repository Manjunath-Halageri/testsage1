const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
const cmd = require('child_process');
const readline = require('readline');
var fs = require('fs');
var path = require("path");

async function getList(req, res) {
    console.log("Request to load all Machines", req.query.orgId)
    // let filePath = __dirname + '\\create.bat'
    // console.log("File Path is",filePath)

    obj = {
        "orgId": Number(req.query.orgId)
    }
    let result = await dbServer.findCondition(db.licenseDocker, obj);
    console.log(result)
    return result;

}

async function getbyId(req, res) {
    let obj = {
        "orgId": Number(req.query.orgId)
    }
    console.log("The organization ID is", req.query.orgId);
    console.log("The organization ID is", req.query.collectionId);
    let result = await dbServer.findCondition(db.organization, obj);

    var result1 = await countNumbers(req.query.collectionId);
    console.log("what Iam getting", result1)
    if (result1 != 0) {
        console.log("Valueeeeeeeeeeeeeeeeee", result1);
        result.push(result1)
    }
    return result;

}
async function startMachine(machine, collectionId) {
    console.log(machine)
    let obj1 = {
        "_id": mongojs.ObjectId(collectionId)
    }
    let result1 = await dbServer.findCondition(db.licenseDocker, obj1);

    if (result1[0].state !== "Running") {

        let machine1 = machine + "UserInfra";
        let machine2 = machine + "ExecutionInfra";

        let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
        let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
        let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

        await createFile(filePath);
        await createFile(textPath);
        await createFile(textPath2);


        let data = `@echo off\n
     docker-machine start ${machine} >> BREAK > ${textPath}`

        var result = await createExecute(filePath, data);
        if (result == "pass") {
            var dockerCommand = `@echo off\n
         docker-machine regenerate-certs --force ${machine} >> BREAK > ${textPath}`
            var regenerateIP = await createExecute(filePath, dockerCommand);
            if (regenerateIP == "pass") {
                return "sucess";
            }

        }

    }
    else {
        return "sucess";
    }

}

async function deleteContainer(name, id, imageID, machine) {
    console.log("Inside deleteContainer Service", name, id, imageID, machine)

    let obj1 = {
        "_id": mongojs.ObjectId(id)
    }
    let result2 = await dbServer.findCondition(db.licenseDocker, obj1);

    let machine1 = machine + "UserInfra";
    let machine2 = machine + "ExecutionInfra";

    let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
    let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
    let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

    await createFile(filePath);
    await createFile(textPath);
    await createFile(textPath2);


    // let filePath = __dirname + '\\create.bat'    //batch file Path
    // console.log(filePath)
    // let textPath = __dirname + '\\create.txt'   //The output from batch file will be visible in text file
    // let textPath2 = __dirname + '\\read.txt';

    let data = `@echo off\n
    @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i\n
    docker rm --force ${name} >> BREAK > ${textPath}`;

    var result = await createExecute(filePath, data);

    if (result == "pass") {
        let _id = mongojs.ObjectId(id)
        db.licenseDocker.update(
            { "_id": _id },
            {
                $pull:
                {
                    "machineDetails.0.browsers.$[].version":
                        { "NodeName": name },
                    "machineDetails.0.allConatinerName": name
                }
            },
            { multi: true }
        )

        if (result2[0].state !== "Running") {

            let data1 = `@echo off\n
        docker-machine stop ${machine} >> BREAK > ${textPath}`;

            var result1 = await createExecute(filePath, data1);
            if (result1 == "pass") {
                console.log("Machine stopped")
            }
        }
    }
    return "sucess";


}
async function updatedCollection(id) {
    let obj = {
        "_id": mongojs.ObjectId(id)
    }
    let result = await dbServer.findCondition(db.licenseDocker, obj);
    // console.log(result)
    return result;
}
function countNumbers(cid) {
    return new Promise((resolve, reject) => {
        var result1 = 0;
        db.licenseDocker.aggregate([
            { $match: { _id: mongojs.ObjectId(cid) } },
            { $unwind: "$machineDetails" },
            { $unwind: "$machineDetails.browsers" },
            { $unwind: "$machineDetails.browsers.version" },
            { $group: { _id: { "version": "$machineDetails.browsers.version.versionName" }, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } }
        ], function (err, result2) {
            console.log(result2);
            for (var i = 0; i < result2.length; i++) {
                result1 = result1 + result2[i].count;
                console.log(result1);
            }
            console.log("\n The count of browser versions \n", result1)
            resolve(result1);
        })

    });
}

async function startCreating(req, res) {
    var userData = req.body.userArray;
    let value = 5401;
    let name = 401;
    let obj1 = {
        "_id": mongojs.ObjectId(req.body.collectionId)
    }
    let id1 = req.body.collectionId;
    console.log("Now add container \n", req.body.collectionId, userData)
    let result = await dbServer.findCondition(db.licenseDocker, obj1);
    console.log(result)
    let machine = result[0].machineName;
    console.log("MACHINE NAME", machine)
    let machine1 = machine + "UserInfra";
    let machine2 = machine + "ExecutionInfra";

    let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
    let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);
    let textPath2 = path.join(__dirname, `batchfolder/${machine2}.txt`);

    await createFile(filePath);
    await createFile(textPath);
    await createFile(textPath2);
    var lastContainer = '';
    if (result[0].machineDetails[0].allConatinerName.length !== 0) {

        result[0].machineDetails[0].allConatinerName.forEach(element => {
            console.log("Each element", element);
            lastContainer = element;
        });

        let objValues = await new Promise((resolve, reject) => {
            db.licenseDocker.aggregate([
                { $match: { "_id": mongojs.ObjectId(req.body.collectionId) } },
                { $unwind: "$machineDetails" },
                { $unwind: "$machineDetails.browsers" },
                { $unwind: "$machineDetails.browsers.version" },
                { $match: { "machineDetails.browsers.version.NodeName": lastContainer } },
                { $project: { "machineDetails.browsers.version.nodePort": 1 } }
            ],
                function (err, result) {
                    if (err) { console.log(err) }

                    console.log("DB RESULT is ", result);
                    resolve(result[0].machineDetails.browsers.version);
                })
        })

        let previuosVnc = Number(objValues.nodePort)
        value = previuosVnc + 1;


    }

    // let filePath = __dirname + '\\create.bat'    //batch file Path
    // console.log(filePath)
    // let textPath = __dirname + '\\create.txt'   //The output from batch file will be visible in text file
    // let textPath2 = __dirname + '\\read.txt';

    if (result[0].state !== "Running") {

        let data = `@echo off\n 
        docker-machine start ${machine} >> BREAK > ${textPath}`

        var result1 = await createExecute(filePath, data);
        var dockerCommand = `@echo off\n
    docker-machine regenerate-certs --force ${machine} >> BREAK > ${textPath}
  `
        var regenerateIP = await createExecute(filePath, dockerCommand);

    }
    for (let i = 0; i < userData.length; i++) {
        console.log("ENTERED MAIN FOR")
        if (userData[i].browserName == "Chrome") {
            for (let count = userData[i].count; count > 0; count--) {
                console.log("ENTERED CHROME FOR")
                console.log(IPforImageRun+"//////////////******************************\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\4444444"+conatinerForImage);
                data2 = `@echo off\n
                      @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i\n
                      docker run  -d -P  -p "${value}:4444" --name chrome_${Math.floor(Math.random(1000) * Math.floor(1000))} --link hub:hub selenium/node-chrome-debug:${userData[i].dockerVersion} >> ${textPath}\n
                      docker ps -a --last 1 >> BREAK > ${textPath2}`
                var res = await createExecute(filePath, data2);
                if (res == "pass") {
                    value++;
                    // name++;

                    console.log("The ID got in chrome", id1)

                    var res = await updateChromeVersions(id1, userData[i].dockerVersion, textPath2)
                    if (res == "Updated") {
                        console.log("Updated Docker Chrome version")
                    }

                }
            }
        }
        if (userData[i].browserName == "Firefox") {
            for (let count = userData[i].count; count > 0; count--) {
                console.log("ENTERED FIREFOX FOR")
                console.log(IPforImageRun+"//////////////******************************\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\555555"+conatinerForImage);
                data3 = `@echo off\n
                      @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i\n
                      docker run -d -P -p "${value}:4444" --name firefox_${Math.floor(Math.random(1000) * Math.floor(1000))} --link hub:hub selenium/node-firefox-debug:${userData[i].dockerVersion} >> ${textPath}\n
                      docker ps -a --last 1 >> BREAK > ${textPath2}`
                var res = await createExecute(filePath, data3);
                if (res == "pass") {
                    value++;
                    // name++;
                    console.log("The ID got in Firefox", id1);
                    var res = await updateFirefoxVersions(id1, userData[i].dockerVersion, textPath2)
                    if (res == "Updated") {
                        console.log("Updated Docker Firefox version")
                    }
                }
            }
        }
    }

    if (result[0].state !== "Running") {

        let data1 = `@echo off\n
        docker-machine stop ${machine} >> BREAK > ${textPath}`;

        var result1 = await createExecute(filePath, data1);
        if (result1 == "pass") {
            console.log("Machine stopped")
        }

    }

    var updated = await updatedCollection(id1);
    console.log(req.body.collectionID)
    var count = await countNumbers(id1);
    updated.push(count);
    return (updated);
}



function createExecute(filePath, data) {
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
                        console.log(err)
                    }
                    else {
                        console.log("\n\nCommand executed sucessfully\n\n")
                        resolves("pass");
                    }
                }
                catch (err) {
                    console.log("error occured", err)
                }
            })
        })
    })
}


function updateChromeVersions(id, version, path) {
    return new Promise((resolve, reject) => {
        console.log(id, version, path)
        let actualVersion = 0;
        if (version == "3.0.1") {
            actualVersion = "56.0.2924.87";
        }
        else if (version == "3.6.0") {
            actualVersion = "62.0.3202.75";
        }
        else if (version == "3.7.1") {
            actualVersion = "62.0.3202.94";
        }
        else if(version == "3.141.59-20210929"){
            actualVersion = "94.0.4606.61";
        }
        else if(version == "3.141.59-20210913"){
            actualVersion = "93.0.4577.63";
        }
        else {
            actualVersion = "64.0.3282.119";
        }

        var array = [];
        var temp = [];
        var nodePort = 0;
        var name = "";
        var imageId = 0;
        var image = "";

        let rl = readline.createInterface({
            input: fs.createReadStream(path)
        });
        rl.on('line', function (line) {

            var new_array = line.split(" ");

            temp = new_array.filter(function (el) {
                return el != '';
            })


        });
        rl.on('close', function (line) {
            array = temp;
            console.log("KKKKKKK");
            nodePort = array[array.length - 3].substr(8, 4);
            imageId = array[0];
            image = array[1];
            name = array[array.length - 1];
            console.log("The Final Output", imageId)
            console.log("The Final Output", image)
            console.log("The Final Output", nodePort)
            console.log("The Final Output", name)
            for (let i = 0; i < array.length; i++) {


                console.log(array[i] + ":::::::::::" + i)

            }
            let _id = mongojs.ObjectId(id)


            db.licenseDocker.update({ "_id": _id, "machineDetails.0.browsers.browserName": "Chrome" },
                {
                    $push: {
                        "machineDetails.0.browsers.$.version": {
                            "versionName": actualVersion,
                            "ID": imageId,
                            "imageName": image,
                            "NodeName": name,
                            "userName": "",
                            "type": "",
                            "status": "Available",
                            "checked": false,
                            "nodePort": nodePort,
                            "noOfInstance": 0,
                            "busy": 0
                        }, "machineDetails.0.allConatinerName": name
                    }
                })
            resolve("Updated")

        });


    })
}


function updateFirefoxVersions(id, version, path) {
    return new Promise((resolve, reject) => {
        console.log(id, version, path)
        let actualVersion = 0;
        if (version == "3.2.0") {
            actualVersion = "52.0";
        }
        else {
            actualVersion = "51.0.1";
        }
        var array = [];
        var temp = [];
        var nodePort = 0;
        var name;
        var imageId;
        var image;

        let rl = readline.createInterface({
            input: fs.createReadStream(path)
        });
        rl.on('line', function (line) {

            var new_array = line.split(" ");

            temp = new_array.filter(function (el) {
                return el != '';
            })


        });
        rl.on('close', function (line) {
            array = temp;
            console.log("KKKKKKK");
            imageId = array[0];
            image = array[1];
            name = array[array.length - 1];
            nodePort = array[array.length - 3].substr(8, 4);
            console.log("The Final Output", imageId)
            console.log("The Final Output", image)
            console.log("The Final Output", nodePort)
            console.log("The Final Output", name)
            for (let i = 0; i < array.length; i++) {
                console.log(array[i] + ":::::::::::" + i)
            }
            let _id = mongojs.ObjectId(id)
            db.licenseDocker.update({ "_id": _id, "machineDetails.0.browsers.1.browserName": "Firefox" },
                {
                    $push: {
                        "machineDetails.0.browsers.1.version": {
                            "versionName": actualVersion,
                            "ID": imageId,
                            "imageName": image,
                            "NodeName": name,
                            "userName": "",
                            "type": "",
                            "status": "Available",
                            "checked": false,
                            "nodePort": nodePort,
                            "noOfInstance": 0,
                            "busy": 0
                        }, "machineDetails.0.allConatinerName": name
                    }
                })
            resolve("Updated")
        });

    })
}
function createFile(filePath) {
    return new Promise((resolve, reject) => {
        var writerStream = fs.createWriteStream(filePath)
            .on('finish', function () {

            })
            .on('error', function (err) {
                +
                    console.log(err.stack);
            });
        writerStream.end(() => {
            if (fs.existsSync(filePath)) {
                console.log("file path existed")
                resolve("pass")
            }
            else {
                console.log("file path not existed");
                reject("fail")
            }
        })
    })
}

async function startJMachine(req, res) {

    let machine = req.body.machineName;
    let machine1 = machine + "jmeterUserInfra";

    let filePath = path.join(__dirname, `batchfolder/${machine1}.bat`);
    let textPath = path.join(__dirname, `batchfolder/${machine1}.txt`);

    await createFile(filePath);
    await createFile(textPath);
    if (req.body.machineType == 'jmeterUsersMachine') {

        var containerList1 = '';
        var hubList = '';
        var nodeList = '';

        db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "machineStatus": "Starting", "state": "Starting" } });

        var dockerCommand = `@echo off\n
      docker-machine start ${machine} >> BREAK > ${textPath}`

        req.body.masterNames.forEach(element => {
            console.log("Each master", element);
            containerList1 = containerList1 + " " + element;
        });
        req.body.hubNames.forEach(element => {
            console.log("Each hub", element);
            hubList = hubList + " " + element;
        });
        req.body.nodeNames.forEach(element => {
            console.log("Each node", element);
            nodeList = nodeList + " " + element;
        });

        console.log("List of containers", containerList1);
        console.log("List of containers", hubList);
        console.log("List of containers", nodeList);
        var startMachine = await createAndExecute(filePath, dockerCommand);

        if (startMachine == "pass") {

            console.log("start ..............container")

            var dockerCommand = `@echo off\n
            docker-machine regenerate-certs --force ${machine} >> BREAK > ${textPath}
          `
            var regenerate = await createAndExecute(filePath, dockerCommand);
            if (regenerate == "pass") {
                console.log("start ........................................container2")
                var containerStart = `@echo off\n
              @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i\n
              docker start ${containerList1} >> BREAK > ${textPath}
            `;
                var startContainers = await createAndExecute(filePath, containerStart);
                if (startContainers == "pass") {
                    console.log("start ........................................container3")
                    var nodeStart = `@echo off\n
                    @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i\n
                    docker start ${hubList} ${nodeList}`

                    var startNodes = await createAndExecute(filePath, nodeStart);
                    if (startNodes == "pass") {
                        console.log("Getting IP")
                        var dockerMachineIp = `@echo off\n
                    docker-machine ip ${machine}  >> BREAK > ${textPath}`
                        var machineIP = await createAndExecute(filePath, dockerMachineIp);
                        if (machineIP == "pass") {
                            //read ip from text file
                            //assign it to an variable
                            //update the ip in collection
                            const rl = readline.createInterface({
                                input: fs.createReadStream(textPath)
                            });

                            rl.on('line', (line) => {
                                console.log(line);
                                ip = line;
                            }).on('close', () => {
                                console.log("THE IPPPPPPPPPPPPPPPPPPPPP :", ip)
                                db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "state": "Running", "machineStatus": "Started", "machineIP": ip } })
                            });
                        }
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
        db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "machineStatus": "Starting", "state": "Starting" } });

        var dockerCommand = `@echo off\n
      docker-machine start ${machine} >> BREAK > ${textPath}`

        var startMachine = await createAndExecute(filePath, dockerCommand);

        if (startMachine == "pass") {

            var dockerCommand = `@echo off\n
            docker-machine regenerate-certs --force ${machine} >> BREAK > ${textPath}
          `
            var regenerate = await createAndExecute(filePath, dockerCommand);
            if (regenerate == "pass") {
                db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "state": "Running", "machineStatus": "Started" } })
            }
        }
        else {
            console.log("Machine did not started at first set error meassage in collection");
            await db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "error": "Docker Machine not starting please contact Testsage solution team" } })
        }
        return ("pass");
    }
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
                        console.log("Hahahahahahahhahaahahahahahahha")
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

async function getJmeterList(req, res) {

    id = parseInt(req.query.orgId);

    db.licenseDocker.aggregate([
        { $match: { "machineType": "jmeterExecutionMachine", "orgId": id } },
        { $unwind: "$jmeterData" },
        {
            $project: {
                _id: 1, "organizationName": "$organizationName", "orgId": "$orgId",
                "machineType": "$jmeterData.type",
                "name": "$jmeterData.name",
                "state": "$jmeterData.state",
                "machineName": "$machineName",
                "machineState": "$state"
            }
        }
    ],
        function (err, doc) {
            console.log("nuuulll   " + doc)
            if (doc != null) {
                res.json(doc);
            } else {
                console.log(err)
                res.json(err);
            }
        })

}

async function startJmeterContainer(req, res) {
    console.log(req.body, "dettails")
    let machine = req.body.machineName
    let name = req.body.name
    let id = Number(req.body.orgId)
    console.log('id')
    console.log(machine)
    console.log(name)
    console.log(id)
    console.log('id')
    let filePath = __dirname + '\\jmeterContainerStart.bat'
    let textPath = __dirname + '\\jmeterContainerStart.txt'
    console.log("start ........................................container4")
    startData = `@echo off\n
                  @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i\n
                  docker start ${name}`
    var startResult = await createExecute(filePath, startData)
    if (startResult == "pass") {
        let SlaveIp = `@echo off\n
                    @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i
                    docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${name} >> BREAK > ${textPath}`
        var IpSres = await createAndExecute(filePath, SlaveIp);
        if (IpSres == "pass") {
            var slaveIp = await getJmeterIp(textPath);
            console.log(slaveIp, "IPIPIPIPIPIPIP")
            slaveIp = slaveIp.replace(/'/g, "")
            console.log(slaveIp, "IPIPIPIPIPIPIP2222")
            db.licenseDocker.update(
                { "orgId": id, "machineType": "jmeterExecutionMachine" },
                {
                    $set: {
                        "jmeterData.$[j].state": "Running",
                        "jmeterData.$[j].ipAddress": slaveIp
                    }
                },
                {
                    arrayFilters: [
                        {
                            "j.name": name
                        }
                    ]
                },
                function (err, doc) {
                    console.log(doc)
                    console.log(err)
                    res.json(startResult)

                }
            )
        }
    }
}

function getJmeterIp(textJmeter) {
    return new Promise((resolves, reject) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(textJmeter)
        });


        rl.on('line', (line) => {
            console.log(line, "FFFFF");
            ip = line;
        }).on('close', () => {
            resolves(ip)
        })
    })
}

async function stopJmeterContainer(req, res) {
    console.log(req.body, 'dettails')
    let machine = req.body.machineName
    let name = req.body.name
    let id = Number(req.body.orgId)
    console.log('id')
    console.log(machine)
    console.log(name)
    console.log(id)
    console.log('id')
    let filePath = __dirname + '\\jmeterContainerStop.bat'
    stopData = `@echo off\n
                  @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine}') DO @%%i\n
                  docker stop ${name}`
    var stopResult = await createExecute(filePath, stopData)
    if (stopResult == "pass") {
        db.licenseDocker.update(
            { "orgId": id, "machineType": "jmeterExecutionMachine" },
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
                        "j.name": name
                    }
                ]
            },
            function (err, doc) {
                console.log(doc)
                console.log(err)
                res.json(stopResult)

            }
        )
    }

}


async function startSecurityContainer(req, res) {
    console.log("FFFFFFFFFF", req.body)

    let collectionId = req.body._id
    console.log("FFFFFFFFFFasdasd", collectionId)
    let obj1 = {
        "_id": mongojs.ObjectId(collectionId)
    }
    let result1 = await dbServer.findCondition(db.licenseDocker, obj1);

    if (result1[0].state !== "Running") {

        let machine = req.body.machineName

        let filePath = path.join(__dirname, `batchfolder/${machine}.bat`);
        let textPath = path.join(__dirname, `batchfolder/${machine}.txt`);
        let filePath1 = path.join(__dirname, `batchfolder/${machine}1.bat`);
        let textPath1 = path.join(__dirname, `batchfolder/${machine}1.txt`);
        console.log(filePath, "KKKKKKK")
        console.log(textPath, "KKKKKKK")

        await createFile(filePath);
        await createFile(textPath);
        await createFile(filePath1);
        await createFile(textPath1);

        // await createFile(textPath2);


        let data = `@echo off\n
         docker-machine start ${machine} >> BREAK > ${textPath}`

        var result = await createExecute(filePath, data);
        if (result == "pass") {
            var dockerCommand = `@echo off\n
             docker-machine regenerate-certs --force ${machine} >> BREAK > ${textPath1}`
            var regenerateIP = await createExecute(filePath1, dockerCommand);
            if (regenerateIP == "pass") {
                db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "state": "Running" } })
                return "sucess";
            }
            else {
                db.licenseDocker.update({ "_id": mongojs.ObjectId(req.body._id) }, { $set: { "error": "Docker Machine not starting please contact Testsage solution team" } })
            }

        }

    }
    else {
        return "sucess";
    }
}

module.exports = {
    getList: getList,
    getbyId: getbyId,
    startMachine: startMachine,
    deleteContainer: deleteContainer,
    updatedCollection: updatedCollection,
    countNumbers: countNumbers,
    startCreating: startCreating,
    startJMachine: startJMachine,
    getJmeterList: getJmeterList,
    startJmeterContainer: startJmeterContainer,
    stopJmeterContainer: stopJmeterContainer
}