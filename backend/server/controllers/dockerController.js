const licenseDockerService = require('../services/licenseDockerService');

function dockerUp(req, res) {
    console.log("\n\nData I gained are :\n\n", req.query, "\n\nORRRRRRRRRRRRR\n\n");
    // let licenseDocker = await licenseDockerService.getMachine({ orgId: userCredentials[0].orgId, machineType: "usersMachine" });
    licenseDockerService.startMachine(req, res);
    // if (await result != 0) {
    //     console.log("final output", result);
    //     res.json(result);
    // }

}
async function startManually(req, res) {
    console.log("THE RESULT IS ", req.body)
     var result = await licenseDockerService.startDocekrManually(req, res);
    // if(result!=0){
    //     console.log("final output", result);
    //     res.json(result); 
    // }
    res.json(result);
}

async function stopManually(req, res) {
    console.log("THE RESULT IS ", req.body)
    var result = await licenseDockerService.stopDocekrManually(req, res);
    if (result != 0) {
        console.log("final output", result);
        // res.json(result); 
        res.json({ msg: "success" });
    }

}
async function checkInterval(req, res) {
    var result = await licenseDockerService.findCall(req, res);
    res.json(result);
}
async function autoStopping(req, res) {
    let objAutoStop = {
        idMachine: req.query._id,
        idOrg: req.query.orgId
    }
 licenseDockerService.autoStopService(objAutoStop,res);
}

function startContainer(req, res) {
    licenseDockerService.startContainer(req, res);
}

function getTheFile(req, res) {
    licenseDockerService.getTheFile(req, res)
}
module.exports = {
    dockerUp: dockerUp,
    startManually: startManually,
    stopManually: stopManually,
    checkInterval: checkInterval,
    autoStopping: autoStopping,
    startContainer: startContainer,
    getTheFile: getTheFile
}