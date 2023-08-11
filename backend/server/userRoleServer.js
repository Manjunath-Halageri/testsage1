module.exports = function (app) {
    var bodyParser = require("body-parser");
    var db = require('../dbDeclarations').url;
    var async = require("async");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));


    let userDetails = null
    let planDetails = null
    const getCollection = function (collection, callback) {
        collection.find({}).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else if (result.length > 0) {
                callback(result);
            }
        });
    }

    getCollection(db.userRoles, function (result) {
        userDetails = result;
    })


    getCollection(db.planType, function (result) {
        planDetails = result;
    })

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    console.log("Calling USERROLE SERVER");

    function userPermissions(role, planId, page) {
        let userRoles = userDetails.filter(element => {
            if (element.roleName === role) {
                return element;
            }
        })
        console.log("check here", planId, userRoles);

        let features = planDetails.filter(element => {
            if (element.planId === planId) {
                return element;
            }
        })
        if (features[0].feature[4].condition == true && userRoles[0].mainFunctions[1].mainPages[0].SchedulerList == true) {
            userRoles[0].mainFunctions[1].mainPages[0].SchedulerList = true
        }
        else {
            userRoles[0].mainFunctions[1].mainPages[0].SchedulerList = false
        }
        if (features[0].feature[8].condition == true && userRoles[0].mainFunctions[1].mainPages[0].AutoCorrection == true) {
            userRoles[0].mainFunctions[1].mainPages[0].AutoCorrection = true
        }
        else {
            userRoles[0].mainFunctions[1].mainPages[0].AutoCorrection = false
        }
        if (features[0].feature[8].condition == true && userRoles[0].mainFunctions[1].mainPages[0].browserSelection == true) {
            userRoles[0].mainFunctions[1].mainPages[0].browserSelection = true
        }
        else {
            userRoles[0].mainFunctions[1].mainPages[0].browserSelection = false
        }
        if (features[0].feature[8].condition == true && userRoles[0].mainFunctions[1].mainPages[0].tracking == true) {
            userRoles[0].mainFunctions[1].mainPages[0].tracking = true
        }
        else {
            userRoles[0].mainFunctions[1].mainPages[0].tracking = false
        }
        if (features[0].feature[1].condition == true && userRoles[0].permissions[8].access[0].automationKeyWords == true) {
            userRoles[0].permissions[8].access[0].automationKeyWords = true
        }
        else {
            userRoles[0].permissions[8].access[0].automationKeyWords = false
        }
        if (features[0].feature[8].condition && userRoles[0].permissions[10].access[0].exceptionHandling == true) {
            userRoles[0].permissions[10].access[0].exceptionHandling = true
        }
        else {
            userRoles[0].permissions[10].access[0].exceptionHandling = false
        }
        if (features[0].feature[4].condition && userRoles[0].permissions[10].access[0].scheduler == true) {
            userRoles[0].permissions[10].access[0].scheduler = true
        }
        else {
            userRoles[0].permissions[10].access[0].scheduler = false
        }
        if (features[0].feature[3].condition && userRoles[0].permissions[10].access[0].manual == true) {
            userRoles[0].permissions[10].access[0].manual = true
        }
        else {
            userRoles[0].permissions[10].access[0].manual = false
        }
        if (features[0].feature[3].condition && userRoles[0].permissions[13].access[0].manual == true) {
            userRoles[0].permissions[13].access[0].manual = true
        }
        else {
            userRoles[0].permissions[13].access[0].manual = false
        }
        if (features[0].feature[4].condition && userRoles[0].permissions[13].access[0].scheduler == true) {
            userRoles[0].permissions[13].access[0].scheduler = true
        }
        else {
            userRoles[0].permissions[13].access[0].scheduler = false
        }
        if (page === null) {
            console.log("userRoles2", userRoles[0].mainFunctions[1].mainPages[0].SchedulerList)
            return userRoles
        } else {
            for (i = 0; i <= userRoles[0].permissions.length - 1; i++) {
                if (userRoles[0].permissions[i].pageName === page) {
                    console.log("userRoles else",userRoles[0].permissions[i].pageName,page)
                    return userRoles[0].permissions[i].access
                }
            }
        }
    }

    app.get('/getModules', function (req, res) {
        console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm2');
        let userRoles = userPermissions(req.query.roleName, 2, null)
        console.log("callll gettt");
        console.log(userRoles)
        res.json(userRoles)
    });


    allProjects = [];

    //////////////////////// DISPLAYING THE ALL PROJECTS///////////////////////////////    
    app.post('/getProjetsAll', function (req, res) {
        if (req.body.roleName == "platformAdmin" || req.body.roleName == "organization Admin") {
            db.projectSelection.find(function (err, doc) {
                res.json(doc);
            })
        }
        else {
            db.loginDetails.find({ "userName": req.body.userName }, function (err, doc) {
                for (i = 0; i <= doc.length - 1; i++) {
                    allProjects.push(doc[i].projectId);
                }
                db.projectSelection.find({
                    projectId: {
                        $in: allProjects
                    }
                }, function (err, doc) {

                    res.json(doc);
                })
                allProjects = []
            })

        }
    })
    //////////////////////// DISPLAYING THE ALL PERMISSIONS///////////////////////////////
    app.post('/getPermissions', function (req, res) {
        let permissions = userPermissions(req.body.roleName, 2, req.body.pageName);
        res.json(permissions);
    });

    //////////////////////// DISPLAYING THE MODULES///////////////////////////////

    //////////////////////// DISPLAYING THE MODULES///////////////////////////////
    app.post('/displayModulePageShiva', function (req, res) {



        function aggregateCall(collection, obj) {
            return new Promise((resolves, reject) => {
                collection.aggregate(obj, function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {

                        resolves(result);
                    }
                });
            })

        }


        async function dbCall(project) {
            let agg = [{ $match: { "projectId": project } },
            {
                "$lookup":
                {
                    "from": "featureName",
                    "localField": "moduleId",
                    "foreignField": "moduleId",
                    "as": "featureName"
                }
            },
            { $match: { "featureName.featureId": { "$exists": false } } }
            ];

            let agg2 = [{ $match: { "projectId": project } },
            {
                "$lookup":
                {
                    "from": "featureName",
                    "localField": "moduleId",
                    "foreignField": "moduleId",
                    "as": "featureName"
                }
            },
            { $unwind: "$featureName" },
            {
                "$lookup":
                {
                    "from": "testScript",
                    "localField": "featureName.featureId",
                    "foreignField": "featureId",
                    "as": "testScript"
                }
            },

            {
                $match: {
                    "testScript.featureId": { "$exists": false }

                }
            },
            {
                $group: {
                    _id: "$moduleName",

                    features: { $push: { featureName: "$featureName.featureName", "scriptName": "$testScript.scriptName", "scriptId": "$testScript.scriptId", "moduleId":"$featureName.moduleId","featureId":"$featureName.featureId" } }
                }
            }


            ];
            let agg3 = [{ $match: { "projectId": project } },
            {
                "$lookup":
                {
                    "from": "featureName",
                    "localField": "moduleId",
                    "foreignField": "moduleId",
                    "as": "featureName"
                }
            },
            { $unwind: "$featureName" },
            {
                "$lookup":
                {
                    "from": "testScript",
                    "localField": "featureName.featureId",
                    "foreignField": "featureId",
                    "as": "testScript"
                }
            },
            { $unwind: "$testScript" },
            {
                $group: {
                    _id: "$moduleName",

                    features: { $push: { featureName: "$featureName.featureName", "scriptName": "$testScript.scriptName", "scriptId": "$testScript.scriptId", "moduleId":"$testScript.moduleId", "featureId":"$testScript.featureId", "status":"$testScript.status" } }
                },
            }
            ];
            let onlyModules = await aggregateCall(db.moduleName, agg);
            let modulesPlusFeature = await aggregateCall(db.moduleName, agg2);
            let doc = await aggregateCall(db.moduleName, agg3);
            function getObj(doc) {
                let unique = doc.features.filter((thing, index, self) => index === self.findIndex((t) => t.featureName === thing.featureName));
                unique.map(e => (e.children = [], e.label = e.featureName, e.key=e.featureName, e.data = "feature", e.expandedIcon = "fa fa-folder-open", e.collapsedIcon = "fa fa-folder"));
                doc.features.map((feature) => unique[unique.map(e => e.featureName).indexOf(feature.featureName)].children.push({ "label": feature.scriptName, "key":feature.scriptName, "scriptId": feature.scriptId, "status":feature.status, "icon": "fa fa-file-word-o", "data": "script"}));
                doc.features.map((feature) => delete feature.scriptName)
                doc.features.map((feature) => delete feature.status)
                doc['children'] = unique;
                doc['label'] = doc._id;
                doc['data'] = "module";
                doc['moduleId'] = doc.features[0].moduleId
                doc['key'] = doc._id;
                doc["expandedIcon"] = "fa fa-folder-open";
                doc["collapsedIcon"] = "fa fa-folder";
                delete doc._id;
                delete doc.features;
                return doc;
            }


            function duplicateCall(features, index) {
                features.forEach((e) => {
                    let obj = {
                        children: [],
                        label: e.featureName,
                        data: 'feature',
                        featureId: e.featureId,
                        expandedIcon: "fa fa-folder-open",
                        collapsedIcon: "fa fa-folder"
                    }
                    data[index].children.push(obj)
                });
            }

            function pushCall(modules) {
                console.log(modules._id)
                data.push({
                    "label": modules._id, 'data': 'module', "moduleId":modules.features[0].moduleId, "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children':
                        modules.features.filter((e) => (e.children = [], e.label = e.featureName, e.data = "feature", e.expandedIcon = "fa fa-folder-open", e.collapsedIcon = "fa fa-folder"))
                })
            }
            let data = null;

            function checkCall() {
                let bb = modulesPlusFeature.map((modules, index) => -1 !== (data.findIndex((dataModule) => dataModule.label === modules._id)) ?

                    duplicateCall(modules.features, data.map(e => e.label).indexOf(modules._id)) : pushCall(modules))
                res.json(data);
            }

            async.eachSeries([
                data = doc.map((doc) => getObj(doc)),
                onlyModules.map((modules) => data.push({ "label": modules.moduleName, 'moduleId':modules.moduleId, 'data': 'module', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children': [] })),
                checkCall()

            ],
                function (item, cb) {
                    return cb();
                },
                function (err) {
                });
        }

        dbCall(req.body.projectNew)
        function elseForModule(allResult) {
            console.log(allResult)
            db.loginDetails.find({ $and: [{ "userId": allResult.userId }, { "roleName": allResult.roleName }] }, function (err, doc) {
                console.log(doc)
                for (i = 0; i <= doc[0].projectAccess.length - 1; i++) {
                    if (doc[0].projectAccess[i].projectId === allResult.projectNew) {
                        if (doc[0].projectAccess[i].modlues == undefined) {
                            db.moduleName.find({ "projectId": allResult.projectNew }, function (err, doc) {
                                console.log(doc);
                                res.json(doc);
                            })
                        }

                        else {
                            elseAgainSubModules(doc)

                        }
                    }
                }
            })
        }
        ////////// FOR FINDING MODULES WHEN  SPECIFIED  MODULES IN DB///////////
        function elseAgainSubModules(doc) {
            var allModules = [];
            for (j = 0; j <= doc[0].projectAccess[i].modlues.length - 1; j++) {
                allModules.push(doc[0].projectAccess[i].modlues[j].moduleId);
            }

            db.moduleName.find({
                moduleId: {
                    $in: allModules
                }
            }, function (err, doc) {
                console.log(doc);

                res.json(doc);
            })
            allModules = [];
        }
    })
}
