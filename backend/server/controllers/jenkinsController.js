const jenkinsService = require('../services/jenkinsService');
const loginDetailsService = require('../services/loginDetailsService');
const Email = require('../services/mailIntegrationService');
const emailObj = new Email();
const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const _db = mongojs(dataBase, []);

//http://localhost:2111/jenkinsApi/Api:opal,pID354491,u311,$2b$08$ezRI8TQC3O8XtDqYIXeIP..s96VuW/HvnS7Ioshnf9hvJXupvU/Gq,suID8

async function jenkins(req, res) {
    console.log("jenkins call hitted")
    console.log("hitting 1", req.url)

    var blockData = req.url.split('/Api:')[1].split(',');
    console.log(blockData)
    var blockJenkins = false

    let object = {
        projectId: blockData[1],
        userName: blockData[2],
        password: blockData[3],
        suiteId: blockData[4],
        token: blockData[5],
    }
    console.log(object, "console.log(object)")
    let fetchJenkinsEmailResp = await fetchJenkinsEmail(object);
    var sendEmail = {}
    // let object = {
    //     projectId: "pID354491",
    //     userId: "u311",
    //     password: "$2b$08$ezRI8TQC3O8XtDqYIXeIP..s96VuW/HvnS7Ioshnf9hvJXupvU/Gq",
    //     suiteId: "suID8"
    // };

    let result = await jenkinsService.getAllUserEmailId(object);
    let resultAdmin = await jenkinsService.getAdminEmailId(object);
    let resultProjSuite = await jenkinsService.getProjectWithSuite(object);

    sendEmail['userEmail'] = result[0].Email

    if (result !== "Project Id False")
        sendEmail['adminEmail'] = resultAdmin[0].Email


    if (result === "User Not Found") {
        console.log("Send mail to Project Admin and test sage support")
        console.log(sendEmail.adminEmail)
        let AdminSage = {}
        AdminSage["emailArray"] = sendEmail.adminEmail;
        let runningStatus = `Please login with valid projectId`;
        let message = `ProjectId Invalid`
        emailObj.sendEmail(AdminSage, runningStatus, message)
        return;
    }



    else if (object.password !== result[0].password) {
        // console.log(data1)
        console.log("Send Mail")//UserPassword Mismatch send Email to User Mail
        console.log(sendEmail.userEmail);
        let userMail = {}
        userMail["emailArray"] = sendEmail.userEmail;
        let runningStatus = `Please login with valid Password`;
        let message = `Password Invalid`
        emailObj.sendEmail(userMail, runningStatus, message)
        return;
    }

    else if (resultProjSuite === "ProWithSuite Invalid") {
        console.log("Send Mail To Test Sage")//Project and Suite  Mismatch send Test Sage

        return;

    }
    else {
        console.log("Valid send mail to All")
        console.log(sendEmail);

        let jenkinsUser = await loginDetailsService.checkVaildUser(object)
        console.log(object)
        if (jenkinsUser.length !== 0) {
            console.log("pass came")
            let data = (object.password == jenkinsUser[0].password)
            // let data = await bcrypt.compare(object.password, jenkinsUser[0].password)
            if (data) {
                console.log("valid block")
                let expiry = await loginDetailsService.licenceDetails(jenkinsUser[0].orgId);
                console.log(expiry);
                jenkinsUser[0].expiry = expiry.expiryDate;
                console.log(jenkinsUser)
                console.log(jenkinsUser[0].orgId)
                let expiryDate = expiry.expiryDate;

                let today = new Date();
                console.log(today)
                if (expiryDate > today) {
                    console.log("plan open")

                    let result = await jenkinsService.getNames(object);
                    console.log("result came")
                    console.log(result)
                    console.log(result[0].projectName)
                    console.log(result[0].testsuitename)
                    SuiteName = result[0].testsuitename;

                    let result1 = await jenkinsService.checkSuiteName(SuiteName);
                    console.log("result1 came")
                    console.log(result1)
                    console.log(result1[0].testsuitename)

                    completeObject = result1;

                    let result2 = await jenkinsService.suiteFolder(completeObject);
                    console.log("Folder there")
                    console.log(result2)

                    let result3 = await jenkinsService.scripts(completeObject)
                    console.log("Scripts are there")
                    console.log(result3)

                    let suiteObjects = await jenkinsService.suiteObj(object)
                    console.log("objects cameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",suiteObjects)
                    console.log("oneeeee", suiteObjects[0].SelectedScripts)
                    console.log(suiteObjects)
                    suiteObjects.sendEmail

                    let folder1 = await jenkinsService.checkDockerRunning(suiteObjects)
                    console.log(folder1[0].state, "kkkkkkklllllllllllloooooooooooooooo9999")

                    if (folder1[0].state == "Running") {
                        console.log("folder hittingggggggg")

                        let folder2 = await jenkinsService.checkStatusBrowsers(suiteObjects)
                        console.log(folder2[0], "hitting folder222222222333333333")
                        console.log("folder2.forEach(")
                        let rcb = folder2
                        console.log(rcb)
                        let adults = rcb.filter(person => person[0].status == "Running");
                        console.log("some steps are failed")
                        console.log(adults)
                        if (adults.length == 0) {

                            console.log("blockJenkins == false")

                            let folder3 = await jenkinsService.updateStatusBrowser(suiteObjects)
                            console.log(folder3, "result cameeeeeeeeeeeeeee")


                            sendEmail = fetchJenkinsEmailResp
                            let result5 = await jenkinsService.makeObject(suiteObjects, sendEmail)
                            console.log("result55555555555555555555555", result5)
                            res.json(result5)
                            // return;
                            res.end()
                        }

                        else if (adults.length !== 0) {
                            console.log("outside if", fetchJenkinsEmailResp)

                            if (fetchJenkinsEmailResp.success) {
                                console.log("outside if")

                                console.log(fetchJenkinsEmailResp.message)
                                sendEmail['userEmail'] = result[0].Email

                                let userMail = {

                                    emailArray: fetchJenkinsEmailResp.message,

                                }
                                console.log(userMail)
                                sendEmail['userEmail'] = result[0].Email
                                let runningStatus = `Please change Browser status`;
                                let message = `Change Browser Status`
                                emailObj.sendEmail(userMail, runningStatus, message)
                                return;
                            }
                            else {
                                console.log("Unable to Send Mail's");
                            }
                        }
                    } 
                    else {
                        let userMail = {}
                        userMail["emailArray"] = sendEmail.userEmail;
                        let runningStatus = `Your Docker machine is Stopped..Please change status`;
                        let message = `Change Docker status`
                        emailObj.sendEmail(userMail, runningStatus, message)
                    }

                } 
                else {
                    console.log("plan close")
                    res.json({ message: `Sorry your plan has  been  Expired...!!! Please contact Test Sage team for further Assistance` });
                    return;

                }

            }
            else console.log("Invalid Password")
            res.json({ message: 'Invalid Password' })
        }
        else console.log("Invalid UserName")
        res.json({ message: 'Invalid UserName' })
    }
}

function fetchJenkinsEmail(data) {
    return new Promise((resolve, reject) => {
        try {

            _db.collection('jenkins').find({ projectId: data.projectId, suiteId: data.suiteId }, (err, doc) => {
                if (err) {
                    console.log("if")
                    resolve({ success: false })
                }
                else if (doc.length > 0) {
                    console.log("else if")

                    resolve({ success: true, message: doc[0].email })

                    console.log(doc)

                }
                else {
                    console.log("else")

                    resolve({ success: false })
                }
            })

        } catch (error) {
            console.log("catch", error)


            resolve({ success: false })

        }
    })
}


// jenkins()


module.exports = {

    jenkins: jenkins
}