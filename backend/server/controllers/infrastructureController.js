const infrastructureService = require('../services/infrastructureService');

async function getMachinesList(req, res) {
    console.log("Inside Lodaing all Machines", req.query);
    var result = await infrastructureService.getList(req, res);
    res.json(result);

}
async function getPerticularOrg(req, res) {
    console.log("Inside controller---->>>", req.query)
    var result = await infrastructureService.getbyId(req, res);
    res.json(result);
}
async function rmContainer(req, res) {

    console.log("Inside rmContainer ====>>>", req.body)
    var result = await infrastructureService.startMachine(req.body.machine, req.body.collectionID);
    if (result == "sucess") {
        console.log("Machine started")
        var result1 = await infrastructureService.deleteContainer(req.body.imageName, req.body.collectionID, req.body.imageID, req.body.machine);
        var result2 = await infrastructureService.updatedCollection(req.body.collectionID)
        var result3 = await infrastructureService.countNumbers(req.body.collectionID);
        result2.push(result3);
        if (result2.length != 0) {
            console.log(result2)
            res.json(result2)
        }

    }

}

async function runContainer(req, res) {
    var endResult = await infrastructureService.startCreating(req, res);
    if (endResult == "sucess") {
        var result2 = await infrastructureService.updatedCollection(req.body.collectionID);
        if (result2 != 0) {
            console.log(req.body.collectionID)
            var result3 = await infrastructureService.countNumbers(req.body.collectionID);
            result2.push(result3);
        }

    }
    console.log("yyyyyyyyyy ", endResult)
    res.json(endResult);
}

async function startJMachine(req, res) {
    var result = await infrastructureService.startJMachine(req, res);
    res.json(result)
}

async function getJmeterMachinesList(req, res) {
    console.log("Inside Lodaing all JmeterMachines", req.query);
    var result = await infrastructureService.getJmeterList(req, res);
    // res.json(result);

}

async function startJmeterContainer(req, res) {
    var startResult = await infrastructureService.startJmeterContainer(req, res);
}

async function stopJmeterContainer(req, res) {
    var stopResult = await infrastructureService.stopJmeterContainer(req, res);
}

module.exports = {
    getMachinesList: getMachinesList,
    getPerticularOrg: getPerticularOrg,
    rmContainer: rmContainer,
    runContainer: runContainer,
    startJMachine: startJMachine,
    getJmeterMachinesList: getJmeterMachinesList,
    startJmeterContainer: startJmeterContainer,
    stopJmeterContainer: stopJmeterContainer
}