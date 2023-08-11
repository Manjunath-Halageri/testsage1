const autoCorrectionService = require('../services/autoCorrectionService');


async function fetchExceptionSuites(req, res) {
    var result = await autoCorrectionService.fetchExceptionSuites(req, res);

}


async function fetchFixedScripts(req, res) {
    var result = await autoCorrectionService.fetchFixedScripts(req, res);

}

async function mergeScripts(req, res) {
    var result = await autoCorrectionService.mergeScripts(req, res);

}

module.exports = {
    fetchExceptionSuites: fetchExceptionSuites,
    fetchFixedScripts: fetchFixedScripts,
    mergeScripts: mergeScripts
}