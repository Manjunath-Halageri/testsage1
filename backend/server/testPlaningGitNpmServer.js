module.exports=function(app){
    var mongojs=require('mongojs');
    
   // var db=mongojs('collections',[])
    var db  = require('../dbDeclarations').url;
   
    const Filehound=require('filehound');

    var fs = require('fs')
    var rimraf = require('rimraf');
    const path=require('path');




    //var ff=" https://github.com/TeamPlatform/OPALCypressProject.git"

// //ff.split('')
//  var gg=path.basename(ff).split(".git")
 
//  console.log(gg[0])
//path.dirname(ff).split('\\').pop()


app.post('/gitClone',function(req,res)
{

console.log("hgh"+req.body.gitClone)
var gitHubName=path.basename(req.body.gitClone).split(".git")
//var gg=path.basename(ff)
 
 console.log(gitHubName[0])
var searchPath=__dirname+"/uploads/"+gitHubName[0]
    if(fs.existsSync(searchPath)){
        console.log("is thereee eeee")
        

const Filehound = require('filehound');
Filehound.create()
 
.ext('bat')
.match('gitClone.bat')
.path("./batchFiles")
.find((err,htmlFiles)=>
{
//console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhh")
//console.log(htmlFiles)
var gitPath = ".\\"+htmlFiles;
console.log(gitPath+"oppwwwwwwwwwww");

 var stream = fs.createWriteStream(gitPath);

stream.write("@echo off\n")
stream.write("cd "+"./uploads  &&"+" git clone "+req.body.gitClone )

console.log(gitPath+"yyyyyyyyyyyyyy")
require('child_process').exec(gitPath, (err, stdout, stderr) => 
{
if (err) throw err;
//console.log(stdout, stderr); 
 console.log("fdgljfHAgDCHJASLGFLH")
//res.json({"result":"Git Clone Is Succesffully Imported"})  
res.json("Git Clone Is Succesffully Imported") 
}); 





})
}//if end

else{
 res.json("Please Change Github Name") 
}
 
})


app.post('/npmInstall',function(req,res)
{
db.countInc.find({},function(err,doc){
proID=doc[0].projectID
pCount=doc[0].pCount
mCount=doc[0].mCount
fCount=doc[0].fCount
sCount=doc[0].sCount
smId=doc[0].moduleID
sfID=doc[0].featureID
ssID=doc[0].scriptID

//console.log(pCount+"uiiiii"+mCount+"jj"+fCount+"pp"+sCount)

})
//db.projectSelection.insert({"projectSelection":"test","projectId":"pID10"})
//console.log("hgh"+req.body.npmPath)
var finalcypressProjectName=""
var cypressProjectName=req.body.npmPath.split('\\')
//console.log(cypressProjectName+"cccccccccccccc")
finalcypressProjectName=cypressProjectName[0]
var searchPath=__dirname+"/uploads/"+finalcypressProjectName+"/node_modules"
    if(fs.existsSync(searchPath)){

const Filehound = require('filehound');
Filehound.create()

.ext('bat')
.match('npmInstall.bat')
.path("./batchFiles")
.find((err,htmlFiles)=>
{
//console.log(htmlFiles)
var npmPath = ".\\"+htmlFiles;
console.log(npmPath+"oppwwwwwwwwwww");
var stream = fs.createWriteStream(npmPath);
stream.write("@echo off\n")
stream.write("cd "+"./uploads/"+req.body.npmPath+" && npm install" )



require('child_process').exec(npmPath, (err, stdout, stderr) => 
{
if (err) throw err;
console.log(stdout, stderr);
pCount++
pID=proID+pCount

db.projectSelection.insert({"projectSelection":finalcypressProjectName,"projectId":pID,"framework":"Cypress"})


console.log("jhjhjhjhjjjjjjjjj")
res.json("Npm Completed") 
console.log("tttttt")
deleteCypressFile(req.body.npmPath,finalcypressProjectName,pID,mCount,fCount,sCount, smId, sfID, ssID)


}); 



})


    }//if end
    else{

        res.json("node_modules already present in your Project") 
    }

})



var deleteCypressFile=function(npmPath,finalcypressProjectName,pID,mCount,fCount,sCount, smId, sfID, ssID){
var CypJson="./uploads/"+npmPath+"/cypress.json"
var deleteCypressFolder="./uploads/"+npmPath+"/cypress"
var destination="./uploads/"+npmPath+"/node_modules/.bin/cypress"


var copyCypressJson="./uploads/"+npmPath+"/node_modules/.bin/cypress.json"


fs.unlink(destination,function(err){
if(err) return console.log(err);
//console.log("wwwwwww"+npmPath)

console.log(finalcypressProjectName+"ggggggggggggg")
copyCypressFolder(npmPath,destination,finalcypressProjectName,deleteCypressFolder,CypJson,copyCypressJson,pID,mCount,fCount,sCount, smId, sfID, ssID)
console.log('file deleted successfully');

});
}


var copyCypressFolder=function(copySourcePath,cypressFolderPath,finalcypressProjectName,deleteCypressFolder,CypJson,copyCypressJson,pID,mCount,fCount,sCount, smId, sfID, ssID){
// db.countInc.find({},function(err,doc){
// proID=doc[0].projectID
// pCount=doc[0].pCount
// mCount=doc[0].mCount
// fCount=doc[0].fCount
// sCount=doc[0].sCount
// smId=doc[0].moduleID
// sfID=doc[0].featureID
// ssID=doc[0].scriptID

// console.log(pCount+"uiiiii"+mCount+"jj"+fCount+"pp"+sCount)

// })

var ncp = require('ncp').ncp;

ncp.limit = 16;
var source="./uploads/"+copySourcePath+"/cypress"
//var CypJson="./uploads/"+copySourcePath+"/cypress.json"

fs.mkdir(cypressFolderPath,function(err){
//console.log("wwwwuryrtrhrhrhhhh")

ncp(source, cypressFolderPath, function (err) {
if (err) {
return console.error(err);
}
fs.copyFile(CypJson,copyCypressJson , (err) => {
if (err) throw err;
//console.log('source.txt was copied to destination.txt');
console.log(deleteCypressFolder+"deleteeeee")
//fs.createReadStream(CypJson).pipe(fs.createWriteStream(cypressFolderPath));
fs.unlink(CypJson)
rimraf(deleteCypressFolder, function () { console.log('done'); }); 
//fs.unlink(deleteCypressFolder)
});



cypressDbCreation(cypressFolderPath,pID,mCount,fCount,sCount, smId, sfID, ssID,finalcypressProjectName)

console.log('done!');



});
})


}



//var eceLast=0

var cypressDbCreation= function(cypressFolderPath,pID,mCount,fCount,sCount, smId, sfID, ssID,finalcypressProjectName){
var insertModuleName = []
var cypressArrayFilesCheck=[]
var cypressProjectName=cypressFolderPath.split("/")
console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqtrrrrrrrrrrrrrrrrrrrrrrrrr")
//console.log(cypressFolderPath)
// pCount++
// pID=proID+pCount

// db.projectSelection.insert({"projectSelection":finalcypressProjectName,"projectId":pID,"framework":"Cypress"})
// //console.log("call ssssssss")

var cypressModuleName=[]
//var cypressArrayFilesCheck=[]
const searchFilehound = require('filehound');
searchFilehound.create()
.ext('js')
.paths(cypressFolderPath)
.find((err, htmlFiles) => {

//console.log(htmlFiles)
htmlFiles.forEach(function(file,index) {
//console.log(index)
// htmlFiles.length--
// console.log(htmlFiles.length)
var LineReader = require('line-by-line');
lR = new LineReader(file)

lR.on('error', function (err) {
console.log("eeeeeeee") 
});

lR.on('line', function (line) {


if(line.includes(" it('") === true){


if(cypressArrayFilesCheck.includes(file)===false){

//console.log(htmlFiles.length-cypressArrayFilesCheck.length)

cypressArrayFilesCheck.push(file)
//console.log(path.dirname(cypressArrayFilesCheck[cypressArrayFilesCheck.length-1]).length)

path.basename(cypressArrayFilesCheck[cypressArrayFilesCheck.length-1])
//console.log(path.basename(cypressArrayFilesCheck[cypressArrayFilesCheck.length-1]))
//console.log(path.dirname(cypressArrayFilesCheck[cypressArrayFilesCheck.length-1]))
var cypressModule=path.dirname(cypressArrayFilesCheck[cypressArrayFilesCheck.length-1]).split('\\').pop()

//var featureName=path.basename(cypressArrayFilesCheck[cypressArrayFilesCheck.length-1],'.js')





//db.featureName.insert({"featureName":featureName,"featureId":fID,"projectId":pID}) 




if(cypressModuleName.includes(cypressModule)===false){
//console.log("33333333")
//console.log(mCount+"bbbbbbbbbbbb")

mCount++ 

//console.log(mCount+"uuuuubbbbbbbbbbbb"+cypressModule)
//console.log(fCount+"aaa")

mId=smId+mCount
//insertModuleName = 
insertModuleName.push({"moduleName":cypressModule,"moduleId":mId,"projectId":pID})
//console.log(insertModuleName)
// db.moduleName.insert({"moduleName":cypressModule,"moduleId":mId,"projectId":pID})
cypressModuleName.push(path.dirname(cypressArrayFilesCheck[cypressArrayFilesCheck.length-1]).split('\\').pop())
//console.log(testNgModuleName) 
// fCount++

}




}
// else{
// eceLast++
// }
//cypressScriptsCreation(cypressArrayFilesCheck[cypressArrayFilesCheck.length-1],fID,mId,pID,ssID,sCount)
}



})

lR.on('end', function () {

if(index === htmlFiles.length -1){
//console.log(index+" iam done ")
//console.log(insertModuleName)

insertModuleName.forEach((obj,index) =>{
console.log(insertModuleName)
//db.moduleName.insert(obj)

db.moduleName.insert(obj ,function(err,doc)
{
//res.json(doc);
//console.log("wweeeeeeeeee")
console.log(doc)


// console.log(index+" iam done ")
if(index === insertModuleName.length -1){
console.log(index+" iam done ")
setTimeout(function() {
cypressFeatureNameDbs(pID,cypressArrayFilesCheck,fCount) 
},5000)

}

});

})
// var obj=JSON.parse(insertModuleName)


//console.log(insertModuleName.length) 

}

});



})//end


})


}//end of testng functio
  var cypressFeatureNameDbs=function(pID,cypressArrayFilesCheck,fCount){
   //console.log(typeof(cypressArrayFilesCheck.length)+"llll")
  //console.log(path.basename(cypressArrayFilesCheck[i],'.js'))
  var dd=""
  //console.log("hhhhpppppppp"+pID)
  db.moduleName.find({"projectId":pID},function(err,doc){
  console.log(doc.length+"tyyyy")
    
  cypressArrayFilesCheck.forEach(function(cypressFile) {
  
  doc.forEach(function(docFile) {
    //console.log(docFile.moduleName+"PPPPPP")
    //console.log(path.dirname(cypressFile).split('\\').pop()+"           "+docFile.moduleName)
       if(path.dirname(cypressFile).split('\\').pop()===docFile.moduleName){
   // console.log(path.dirname(cypressFile).split('\\').pop()+"1111"+docFile.moduleName)
    ///console.log(docFile.moduleName)
    //console.log(fCount)
      fCount++
  
   fID=sfID+fCount
   //dd=docFile.moduleId
   db.featureName.insert({"featureName":path.basename(cypressFile,'.js'),"featureId":fID,"moduleId":docFile.moduleId,"projectId":docFile.projectId})
  cypressScriptsCreation(cypressFile,pID,docFile.moduleId,fID,cypressArrayFilesCheck)
  }
  
  })
   
  
  })
  
  
  // console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"+doc.length)
  
  //    for(var j=0;j<cypressArrayFilesCheck.length;j++){
  //     for(var i=0;i<doc.length;i++){
  //   console.log(doc[i].moduleName+"mmmmmmmmmmmmmmmm")
     
  // console.log(path.dirname(cypressArrayFilesCheck[j]).split('\\').pop())
  //       if(path.dirname(cypressArrayFilesCheck[j]).split('\\').pop()==doc[i].moduleName){
  //     fCount++
  // console.log(doc[i].moduleName+"ffffffff")
  //  fID=sfID+fCount
  //  dd=doc[i].moduleId
  //  db.featureName.insert({"featureName":path.basename(cypressArrayFilesCheck[j],'.js'),"featureId":fID,"moduleId":doc[i].moduleId,"projectId":doc[i].projectId})
  // }
  //  }
  
  
  
  //  cypressScriptsCreation(cypressArrayFilesCheck[j],pID,dd,fID,cypressArrayFilesCheck)
  
  // }
   })
  
  }
  
  
  
  
  
  
  
  
  
  var cypressLength=1;
  
  //var sCount=1
  var cypressScriptsCreation=function(cypressFolderPath,pID,dd,fID,cypressArrayFilesCheck){
   // for(var c=0;c<=cypressArrayFilesCheck.length-1;c++) {
  var scriptLineInc=0
   
  //console.log("000000000000000000000000"+pID)
    
    var Line = require('line-by-line');
   lScript = new Line(cypressFolderPath)
   
     lScript .on('error', function (err) {
      console.log("eeeeeeee")  
      });
      
      lScript.on('line', function (line) {
        //console.log(sCount+"rrrrrrr")
         
           
          if(line.includes(" it('") == true){
           // console.log("wswwwwwwwww")
       
            sCount++ 
            //console.log(sCount+"wswwwwwwwww")
  
    sID=ssID+sCount
  
     scriptLineInc++
      var scriptLinePath=line.split(",")
  var onlyScriptPath=scriptLinePath[0].split("it(")
  var finalCypressScript=onlyScriptPath[1].replace("'","").replace("'","")
      
  db.testScript.insert({"scriptName":finalCypressScript,"featureId":fID,"moduleId":dd,"scriptId":sID,"lineNum":scriptLineInc,"projectId":pID})
  //.log(res[2])
  
  //}
  // }
  // }
  // })
  
  }
  else{
     scriptLineInc++
  }
  //}
  //}
  })
   // }
  
     lScript.on('end', function () {
        
    console.log(cypressLength+"jjjjjjj")
  console.log(cypressArrayFilesCheck.length)
          if(cypressLength===cypressArrayFilesCheck.length){
            console.log("eendddddd2222222222222222222222")
            cypressLength=0;
            // filesLength=0;
            cypressArrayFilesCheck=[]
           cypressFolderPath=[]
           console.log(fID)
              var fFCount=fID.split("fID")
              var finalfCount=parseInt(fFCount[1])
            
             //console.log("uuuuuu"+fCount) 
              var fMCount=dd.split("mID")
               var finalmCount=parseInt(fMCount[1])
              var fPCount=pID.split("pID")
               var finalpCount=parseInt(fPCount[1])
               //console.log(sID)
              var fSCount=sID.split("sID")
               var finalsCount=parseInt(fSCount[1])
   
  // setTimeout(function() {
        db.countInc.update({"projectID":"pID"},{$set:{ "fCount":finalfCount,"sCount":finalsCount,
      "pCount":finalpCount,"mCount":finalmCount}})
      // },10000)
      //console.log("  end end  Scenario  true "+finalfCount+"L"+finalsCount+"L"+finalpCount+"L"+finalmCount)      
     }
  cypressLength++
  
    
      });
  
  
  
  
   }
  





}//end module