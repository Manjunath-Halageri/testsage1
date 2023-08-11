const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');


async function fetchPort(userInfo) {
    console.log("inside fetch port")
    return await dbServer.findConditionWithSort(
        db.licenseDocker,
        { "_id": mongojs.ObjectId(userInfo.licenseId), "vncPorts.available": true }, { "vncPorts.$": 1 }

    )
}

async function assignPort(userInfo, portInfo) {
    console.log("######ASSIGN port ",portInfo[0].vncPorts[0].port," to", userInfo.userId,"######" )
    return await dbServer.findAndModify(
        db.loginDetails,
        { "_id": mongojs.ObjectId(userInfo.userId), $and: [{ loginActive: { $eq: true } }, { port: { $eq: null } }] },
        { $set: { port: portInfo[0].vncPorts[0].port } }
    )

}

async function disablePort(userInfo, portInfo) {

   console.log("Disable the Port:",portInfo[0].vncPorts[0].port)
    return await dbServer.updateOne(
        db.licenseDocker,
        { "_id": mongojs.ObjectId(userInfo.licenseId), "vncPorts.port": portInfo[0].vncPorts[0].port },
        { $set: { "vncPorts.$.available": false } }
    )

}
async function releaseAssignedPort(userInfo) {
  
    // { "_id": mongojs.ObjectId(userInfo.userId), $and: [{ loginActive: { $eq: true } }, { port: { $ne: null } }] }
   return await dbServer.findAndModify(
        db.loginDetails,
        { "_id": mongojs.ObjectId(userInfo.userId),  port: { $ne: null } },
        { $set: { port: null } }
    )

}
async function enablePort(userInfo, portInfo) {

    console.log("Enable the Port :", portInfo.port)

    return await dbServer.updateOne(
        db.licenseDocker,
        { "_id": mongojs.ObjectId(userInfo.licenseId), "vncPorts.port": portInfo.port },
        { $set: { "vncPorts.$.available": true } }
    )

}







module.exports = {
    fetchPort: fetchPort,
    assignPort: assignPort,
    disablePort: disablePort,
    releaseAssignedPort:releaseAssignedPort,
    enablePort:enablePort
}