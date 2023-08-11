const envOs = require('../../serverConfigs/index').envOs;
const cmd = require('child_process');
var fs = require('fs');
const fse = require('fs-extra');
var path = require("path");
console.log(envOs)



function fileCreation(command, filePath) {
    if (envOs == "Windows") {
        console.log("INSIDE WINDOWS OS")
        var data = `@echo off\n
            ${command}
            `

        return fileWrite(data, filePath + ".bat")
    }
    else {
        var data = `#!/bin/sh 
        sudo -i ${data} 
        `
        return fileWrite(data)
    }
}

function fileWrite(data, filePath) {
    console.log("\n\nINSIDE WRITE FILE \n\n")
    return new Promise((resolves, reject) => {
        var writerStream = fs.createWriteStream(filePath, { flags: 'w+' })
            .on('finish', function () {
                console.log("got the file");
            })
            .on('error', function (err) {
                +
                    console.log(err.stack);
            });


        writerStream.write(data, function () {
            // Now the data has been written.
            console.log("Write completed.");
        });





        // Mark the end of file
        writerStream.end(() => {
            console.log(" file returned");
            resolves({ condition: "completed" })
        })

    })

}
async function batchExecution(path) {
    return new Promise((resolves, reject) => {
        console.log("In batchExecution page" + path)
        cmd.exec(path + ".bat", (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                resolves({ condition: "Failed" })

            }
            else {
                console.log("Finally Executed");
                resolves({ condition: "completed" })
            }
        })
    })

}









module.exports = {
    fileCreation: fileCreation,
    batchExecution: batchExecution
};