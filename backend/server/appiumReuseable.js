module.exports=function(app)
{
  console.log("appiumReuseable Server is Running")
  var bodyParser = require("body-parser");
  var fs = require('fs');
  var path = require("path");
  var LineByLineReader = require('line-by-line');
  var db  = require('../dbDeclarations').url;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });

  ////////////////////////Appium Reuseable////////////////////////////
    app.post('/appiumReuaseablePostAllActions',function(req,res){
       db.Reuseable.insert(req.body,function(err,doc)
       {
         res.json(doc);
       });
       appiumSearchReusable(req.body);
    });

    function appiumSearchReusable(data)
    {
        var projectName =data.projectName;
        var tempPath = "../uploads/opal/"+projectName+"/src/main/java/reusablePackage/Reusable.java";
        console.log(tempPath);
        var completePath = path.join(__dirname, tempPath);
        console.log(completePath);
        reuseableTemplateExcecuteReusable(data,completePath)
    }
    
function reuseableTemplateExcecuteReusable(data,testPath)
{
var projectName =data.projectName;
console.log(data);
console.log(testPath);
console.log("templatepathcallllllllllllll")
console.log(data.class)
var scriptClass=data.reuseableClass;
var templatePath = testPath;
console.log(data.class);
db.projectSelection.find({"projectSelection" : projectName},function(err,doc){ 
    console.log(doc[0].projectId);
    var projectId=doc[0].projectId;
var tempPath = "../uploads/opal/"+projectName+"/src/main/java/reusablePackage/"+scriptClass+".java";
console.log(tempPath+"kkkkkkkkkkkk");
// var scriptPath = "C:/Users/Opal/Desktop/integrating/29/uploads/ReusableFunction/"+scriptClass+".java";
var scriptPath = path.join(__dirname, tempPath);
console.log(scriptPath)
fs.createWriteStream(scriptPath);
lr = new LineByLineReader(templatePath);
lr.on('error', function (err) {
});
var fName="fileName"
lr.on('line', function (line) {


if(line.includes("className")){
// fs.appendFileSync(scriptPath,"\n"+"public class "+ scriptClass+"{",'utf8');
console.log(line)
var oldLine= line;
var changeString = "className"
// var scriptClass="RESEND"
var NewLine= oldLine.replace(changeString,data.reuseableClass);
console.log(NewLine)
fs.appendFileSync(scriptPath,NewLine);


}
else if(line.includes("Start"))
{
    var inObj=data.reuseableParams;
    console.log(data.reuseableParams+"data.reuseableParamsdata.reuseableParams")
    var inobj1=inObj.split(",");
   
    console.log(inobj1.length+"   len")
    fs.appendFileSync(scriptPath,"\n"+"public void "+data.reuseableMethod+"(",'utf8');
    for(i = 0;i<inobj1.length;i++){
        console.log(inobj1[i].split(" ")[inobj1[i].split(" ").length-1])
        //string a
        //int b
        if(i !=inobj1.length-1 ){
            fs.appendFileSync(scriptPath,inobj1[i]+",");
        }
       
        else if (i==inobj1.length-1){
            fs.appendFileSync(scriptPath,inobj1[i]+"){");



             data.modalData.forEach((l)=>{
                if(l.excel=="excel")
                {
                    var arr09 = l.input.split(',');
                    var excelFilePath = "./excel/"+arr09[0];
                    var sheetNum = arr09[1];
                    var rowNum = arr09[2];
                    var cellNum = arr09[3];
                    // var testNgFunctionName = "actionObject."+l.testNgKey+"(\""+l.object+"\","+"actionObject.getData(\""+excelFilePath+"\",\""+sheetNum+"\","+rowNum+","+cellNum+");";
                    fs.appendFileSync(scriptPath,"\n"+"actionObject."+l.testNgKey+"(\""+l.object+"\","+"actionObject.getData(\""+excelFilePath+"\",\""+sheetNum+"\","+rowNum+","+cellNum+");",'utf8');
                }
                else
                {

                    var conditionCheck = false;
                    for(i = 0;i<inobj1.length;i++){
                         if(conditionCheck == false && l.input != inobj1[i].split(" ")[inobj1[i].split(" ").length-1] && i === inobj1.length-1){
                            var testNgFunctionName = "actionObject."+l.testNgKey+"(\""+l.object+"\",\""+l.input+"\");";
                            fs.appendFileSync(scriptPath,"\n"+testNgFunctionName,'utf8');
                           
                        }else if(l.input === inobj1[i].split(" ")[inobj1[i].split(" ").length-1] ){
                            conditionCheck = true;
                             var testNgFunctionName = "actionObject."+l.testNgKey+"(\""+l.object+"\","+l.input+");";
                            fs.appendFileSync(scriptPath,"\n"+testNgFunctionName,'utf8');
                           
                        }

                    }                                        
                }
            
            })
        }
    }
}
else
{
fs.appendFileSync(scriptPath,"\n"+line,'utf8');
}

});

lr.on('end', function () {

db.Function.insert({"className":data.reuseableClass,"MethodName":data.reuseableMethod,"ProjectName":projectName,"projectId":projectId})

});

});

}////////////templateExcecuteReusable///////////
app.put('/update',function(req,res){
    console.log(req.body)
})

}