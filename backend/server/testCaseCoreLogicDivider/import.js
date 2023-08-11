module.exports = {
    /*
    Logic Desc: the function is used to generate the all the dependencies required to run the scripts;
    depedency may contains package, pom etc.i am using the line read by line module to read the tempalate and replace
    the content.
    query: no;
    Result: after adding the content. throughs the return value as = "completedFromImport" 
     */
        scriptHeaderImports(data,templatePath,scriptPath,callback) {
            let returnValue;
            var LineByLineReader = require('line-by-line');
            var fs = require('fs');
            lr = new LineByLineReader(templatePath);
            lr.on('error', function(err) {});
            lr.on('open', function(err) {
             if(data. typeOfFunction !== 'reusableFunction'){
                var package = `package ${data.moduleName}.${data.featureName};`;
             }
            else{ var package = `package reuseablePackage.reuseFunction;`} 
            fs.appendFileSync(scriptPath, "\n" + package);
            var unique_array = []
            data.allObjectData.allActitons.forEach((functionData) => 
            {
            if(unique_array.indexOf(functionData.Page) == -1 && functionData.Page != "" && functionData.Page != undefined && functionData.Page != null )
            {
            unique_array.push(functionData.Page);
            var importPomPage = "import pom."+functionData.Page+";";
            fs.appendFileSync(scriptPath, "\n" + importPomPage);
            }//removing array duplicates
            if (functionData.Groups == "User Function") 
            {
            fs.appendFileSync(scriptPath, "\n" + "import reuseablePackage.reuseFunction." + functionData.ClassObject + ";");
            }
            })//data.allObjectData.allActitons
            });//lr.on('open', function(err)
            lr.on('end', function(err) {
                returnValue = "completedFromImport";
                callback(returnValue); 
            })
        }//scriptHeaderImports
}