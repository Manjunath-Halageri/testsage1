
var fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var mongojs = require('mongojs');
var db = require('../../dbDeclarations').url;
var path = require("path");
var cmd = require('child_process');    
var LineByLineReader = require('line-by-line');   
var readline = require('linebyline');
const replace = require('replace-in-file'); 
function findCall(collection, obj) {
   
    return new Promise((resolves, reject) => {

        collection.find(obj, function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
             
                resolves(result);
            }
        });
    })

} 
function handlingUiException(data,callback) 
    {  
        //finding pom object to change
        console.log('changing pom function')
        console.log(data.lineNumber)
        var findPomClassName = (data) => new Promise ((resolve,reject)=>{
            var navigateToPom = `../../uploads/opal/${data.projectName}/MainProject/suites/exceptionHandler${data.mainRunNumber}/${data.createdCopySuite}/src/test/java/${data.moduleId}/${data.featureId}/${data.scriptId}.java`;
            var completePathCheck = path.join(__dirname, navigateToPom);
            console.log('FFFFFFFFFFFFFFFFFFFFFFFFF')
            console.log(completePathCheck)
            rl = readline(completePathCheck);
            rl.on('line', async function (line, lineCount) {
                if(lineCount == data.lineNumber)
                {
                    try {
                   let pageName = line.trim().split('new')[1].split('(')[0]; 
        
                    let objectPageName = pageName.trim();
                    let projectid = data.projectId
        let objects = await findCall(db.objectRepository, {'pageName':objectPageName,'projectId':projectid});
     /*   let pageName009;
      if(objects[0].objectName[0].objectType=='Textarea'){
        pageName009 = line.trim().split('new')[1].split('(')[1].split(').')[1].split(',')[0]; 
      }else{
        pageName009 = line.trim().split('new')[1].split('(')[1].split(').')[1].split(')')[0]; 
      }*/
    //  let pageName008 = line.trim().split('new')[1].split('(')[1].split(').')[1].split(',')[0];
    let pageName008 = line.trim().split('new')[1].split('(')[1].split(').')[1];
     let pageName009;
     console.log(pageName008,pageName008.includes("\""),pageName008.includes(","))
     if(pageName008.includes(",")){
        pageName009=pageName008.split(',')[0];
     }else{
        pageName009=pageName008.split(')')[0];
     }
        return callAtOnce(objects[0],pageName009,objectPageName,data.mainRunNumber)
                } catch (error) {
                       console.log(" unable to find the exeception");
                       callback({'status':'fail',
                    'error':error,
                   'exceptionStatusId': data.exceptionStatusId
                })
                }
                }
            })//classNameReplace
        // var findPomClassName = (data) => new Promise ((resolve,reject)=>{
        //     var navigateToPom = `../../uploads/opal/${data.projectName}/MainProject/suites/exceptionHandler/${data.createdCopySuite}/src/test/java/${data.moduleName}/${data.fetaureName}/${data.scriptName}.java`;
        //     var completePathCheck = path.join(__dirname, navigateToPom);
        //     rl = readline(completePathCheck);
        //     rl.on('line', function (line, lineCount) {
        //         if(lineCount == data.lineNumber)
        //         {
        //             console.log(line)
        //             let pageName = line.trim().split('new')[1].split('(')[0]; 
        //             let pageName009 = line.trim().split('new')[1].split('(')[1].split(').')[1].split(')')[0]; 
        //             let objectPageName = pageName.trim();
        //             db.objectRepository.find({pageName:objectPageName
        //             //     $and:[{pageName:objectPageName},
        //             // {'objectName.attributes':{$elemMatch: { "locators": "id", "value": "loginBtn1"}}}
        //             // ]
        //          },function(err,doc){
        //             console.log("return callAtOnce(doc[0])return callAtOnce(doc[0])return callAtOnce(doc[0])return callAtOnce(doc[0])return callAtOnce(doc[0])return callAtOnce(doc[0])")
        //                 if(err){return console.log('Error'+err)}
        //                 // console.log(doc[0],pageName009,objectPageName)
        //                return callAtOnce(doc[0],pageName009,objectPageName,data.mainRunNumber)
        //             })
        //         }
        //     })//classNameReplace
            rl.on('end', function (end) {
            })
            rl.on('error', function (err) {
                console.log(err)
                console.log("something went wrong while editing the script");
            });

        })
        var findAndChangePom = (pomDoc,pageName009) => new Promise((reslove,reject)=>{
            var domPath = `../../uploads/opal/${data.projectName}/MainProject/suites/exceptionHandler${data.mainRunNumber}/${data.createdCopySuite}/src/main/java/dom/${data.scriptId}.html`;
            var completeDomPath =  path.join(__dirname, domPath)
            console.log(completeDomPath)
            fs.readFile(completeDomPath, 'utf8', function(err, data) {  
                if (err) throw err;
                const dom = new JSDOM(data);
                function getElementIdsByText(search) {
                    dom.window.document.querySelectorAll
                    var elements = dom.window.document.querySelectorAll("[id]");
                    // const elementsByArr=Array.prototype.map.call(elements,el=>el.id);
                    // console.log(elementsByArr)
                    var ids = [];
                    elements.forEach(function(element) {
                        //console.log(element.textContent)
                      if (element.textContent === search) {
                          console.log(element.textContent,search)
                        ids.push(element.id);
                    }else if(element.value==search){
                        console.log(element.textContent,search)
                        ids.push(element.id);
                    }
                    });
                    // elementsByArr.forEach(function(element) {
                    //     if (element === search) {
                    //       ids.push(element);
                    //   }
                    //   });
                    return ids;
                }

                let lengthCheck =  pomDoc.objectName.length -1 ;
                pomDoc.objectName.forEach((element,index )=> {
                    let matchFound = false;
                    console.log(element.objectName,pageName009,element.objectName === pageName009)
                    if(element.objectName === pageName009){
                         
                        element.attributes.forEach(e => {         
                            if(e.locators === 'text'){
                                matchFound = true;
                                console.log(e.value)
                                // let aa =  getElementIdsByText(e.value)
                                // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                                // console.log(aa)
                              reslove(getElementIdsByText(e.value))
                              //reslove(aa)
                            }
                        });
                    }
                   if ( lengthCheck === index  && matchFound === false ) {
                       reslove([])
                   }
                   
                }); 

                // pomDoc.objectName.forEach(element => {
                //     if(element.objectName === pageName009)
                //     element.attributes.forEach(e => {         
                //     if(e.locators === 'text'){
                //       reslove(getElementIdsByText(e.value))
                //     }
                //     });
                //   });  
            });
        })
        function callAtOnce(pomDoc,pageName009,objectPageName,runNo)
        {

            console.log('Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 ')
            console.log(pomDoc,"mainRunNumber",pageName009," mainRunNumber",objectPageName," mainRunNumber",runNo," mainRunNumber mainRunNumber mainRunNumber "+ runNo)
            //previous function before avoiding the pom updation here.till 6/8/19
        // findAndChangePom(pomDoc,pageName009).then((message)=>{
        //     console.log(message)
        //     pomDoc.objectName.forEach(element => {
        //         if(element.objectName === pageName009)
        //         {
        //         element.attributes.forEach((el,index) => {
        //         if(el.locators === 'id'){
        //             db.objectRepository.update({
        //                 $and:[
        //                     {pageName:objectPageName},
        //                     {'objectName.objectName': pageName009},
        //                     {'objectName.attributes':{$elemMatch: {"locators": 'id'}}}
        //                 ]},
        //                 {"$set": {[`objectName.$.attributes.${index}.value`] : message[0]}},
        //                 // {"$set": { "objectName.$.attributes.2.value" :message[0]}},
        //                  function(err,doc){
        //                 if(err) console.log('Error'+err);
        //                 var pomPath = `../../uploads/opal/${data.projectName}/MainProject/suites/exceptionHandler/${data.createdCopySuite}/src/main/java/pom/${objectPageName}.java`;
        //                 var completePomPath =  path.join(__dirname, pomPath)
        //                 return updatePom(completePomPath,message[0],el.value)
        //                 })
        //         }
        //         });
        //        }
        //       });
        // })
            //end of above function

            //new code added below on 6/8/19

            findAndChangePom(pomDoc,pageName009).then((message)=>{
                console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM')
                console.log(message)
                if (message.length!= 0) {
                    
              
                pomDoc.objectName.forEach(element => {
                    if(element.objectName === pageName009)
                    {
                    element.attributes.forEach((el,index) => {
                    if(el.locators === 'id'){
                        var ExceptionObjectData = {
                            'pageName' : objectPageName,
                            'objectName' : pageName009,
                            'index' : index,
                            'correctValue' : message[0]
                        }
                        // db.objectRepository.update({
                        //     $and:[
                        //         {pageName:objectPageName},
                        //         {'objectName.objectName': pageName009},
                        //         {'objectName.attributes':{$elemMatch: {"locators": 'id'}}}
                        //     ]},
                        //     {"$set": {[`objectName.$.attributes.${index}.value`] : message[0]}},
                        //     // {"$set": { "objectName.$.attributes.2.value" :message[0]}},
                        //      function(err,doc){
                        //     if(err) console.log('Error'+err);
                        //     var pomPath = `../../uploads/opal/${data.projectName}/MainProject/suites/exceptionHandler/${data.createdCopySuite}/src/main/java/pom/${objectPageName}.java`;
                        //     var completePomPath =  path.join(__dirname, pomPath)
                        //     return updatePom(completePomPath,message[0],el.value)
                        //     })
                        db.reports.update({"Run":runNo},{$set : {"exceptionObjectData" : ExceptionObjectData}},function(err,doc){
                            if(err)console.log(err)
                           // console.log(doc);
                            var pomPath = `../../uploads/opal/${data.projectName}/MainProject/suites/exceptionHandler${data.mainRunNumber}/${data.createdCopySuite}/src/main/java/pom/${objectPageName}.java`;
                            var completePomPath =  path.join(__dirname, pomPath)
                            return updatePom(completePomPath,message[0],el.value)
                        })
                    }
                    });
                   }
                  });

                } else {
                    console.log(" not able to auto-correct");
                    callback({'status':'fail',

                    'exceptionStatusId': data.exceptionStatusId})
                }
            })

            // findAndChangePom(pomDoc,pageName009).then((message)=>{
            //     console.log('closuer of Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 Error 2 ')
            //     console.log(message)
            //     pomDoc.objectName.forEach(element => {
            //         if(element.objectName === pageName009)
            //         {
            //         element.attributes.forEach((el,index) => {
            //         if(el.locators === 'id'){
            //             var ExceptionObjectData = {
            //                 'pageName' : objectPageName,
            //                 'objectName' : pageName009,
            //                 'index' : index,
            //                 'correctValue' : message[0]
            //             }
            //             // db.objectRepository.update({
            //             //     $and:[
            //             //         {pageName:objectPageName},
            //             //         {'objectName.objectName': pageName009},
            //             //         {'objectName.attributes':{$elemMatch: {"locators": 'id'}}}
            //             //     ]},
            //             //     {"$set": {[`objectName.$.attributes.${index}.value`] : message[0]}},
            //             //     // {"$set": { "objectName.$.attributes.2.value" :message[0]}},
            //             //      function(err,doc){
            //             //     if(err) console.log('Error'+err);
            //             //     var pomPath = `../../uploads/opal/${data.projectName}/MainProject/suites/exceptionHandler/${data.createdCopySuite}/src/main/java/pom/${objectPageName}.java`;
            //             //     var completePomPath =  path.join(__dirname, pomPath)
            //             //     return updatePom(completePomPath,message[0],el.value)
            //             //     })
            //             db.reports.update({"Run":runNo},{$set : {"exceptionObjectData" : ExceptionObjectData}},function(err,doc){
            //                 if(err)console.log(err)
            //                 console.log(doc);
            //                 var pomPath = `../../uploads/opal/${data.projectName}/MainProject/suites/exceptionHandler/${data.createdCopySuite}/src/main/java/pom/${objectPageName}.java`;
            //                 var completePomPath =  path.join(__dirname, pomPath)
            //                 return updatePom(completePomPath,message[0],el.value)
            //             })
            //         }
            //         });
            //        }
            //       });
            // })

    }
        function updatePom(templatePath,pomId,pomDoc)
        {
           console.log(pomDoc+"pomDocpomDocpomDocpomDocpomDoc")
           console.log(pomId+"pomIdpomIdpomIdpomIdpomIdpomIdpomId")
           console.log("pageName009pageName009pageName009pageName009pageName009pageName009pageName009pageName009")
                const options = {
                files: templatePath,
                from: pomDoc,
                to: pomId,
                };
                replace(options)
                .then(results => {
                console.log('Replacement results:', results);
                callback({'status':'pass',  'exceptionStatusId': data.exceptionStatusId})
                })
                .catch(error => {
                console.error('Error occurred:', error);
                });
        }

    findPomClassName(data).then(()=>{})
    }

module.exports = {
 handlingUiException: handlingUiException
}
