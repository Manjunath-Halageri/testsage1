module.exports = function (app) {
    console.log("connected testlink Serverrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
    var TestlinkConnect = require("testlink-connect");
    var key = "8b35ad47bd6baccbe1428d283604ef24";
    var url = "http://localhost/testlink/lib/api/xmlrpc/v1/xmlrpc.php";
    var tc = new TestlinkConnect(key, url);

    tc.getTestLinkVersion(function (callback) {
        console.log(callback);
    });//shows the test link is connecetd


    /* Logic Desc: for getting projects that are present in the dev key,
       Output: gives the complete details of project.
    */

    tc.getProjects(function (projects) { console.log(projects); });

    // getting projects enddddd///////


    /*Logic Desc: to get the testPlanId, pass project id as parameter
     which will be outPut of getProjects().
     Output: gives the testPlan id as output with some other info.
     */
    obj099 = { devKey: "8b35ad47bd6baccbe1428d283604ef24", testprojectid: "8" }

    // getting testplaniddddddddd endddddddddd////////



    // Logic Desc: pass the object value to reportTCResult() 
    // function  it will update the testcase result wrt to testcaseexternal id.
    // and will through the success message or fialure messsage if any

    var objExternal = {
        user: "Admin",
        testplanid: "9",
        buildid: "3",
        testcaseexternalid: "KC-5",
        notes: "Demo To Vijay",
        status: "p",
        overwrite: "true"
    };
    tc.reportTCResult(objExternal, function (callback) { console.log(callback); });

    // tc.getProjectTestPlans(devKey, projectid)(key);


}

