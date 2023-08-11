module.exports = {

yashwanth(callback){
console.log("Export Callingggggggggggggggggggggggggggggggggggggggggg")
var path = require("path");
var simplePath = path.join(__dirname, "../uploads/opal/export/MyDemoProject") 

require('simple-git')('C:\\Users\\yashwanth\\Desktop\\svn\\sprint11\\1001\\uploads\\export\\MyDemo')
.init()
.addConfig("core.safecrlf", false,(err,doc)=>{
if (err) throw err;
console.log("Configuration Updated Successfully")
})
// .removeRemote('origin',(err,res)=>{
//     console.log(res)
// })
.add('./*',(err,doc)=>{
    if(err) console.log(err)
    console.log("Files Added Successfully")
})
.commit("Exporting Script Details",(err,res)=>{
console.log(res)
console.log("Commit is Done")
})  
.addRemote('origin', 'https://github.com/yashwanthkumarkc09/oneSix.git',(err,done)=>{
        if(err) throw handelFatalError(err)
        console.log("Add Remote Completed")
    })
     .push('origin', 'master',(err,res)=>{
         if(err) throw err;
         console.log("Push is Completed")
     })
     .removeRemote('origin',(err,res)=>{})
    //  copyCheck("C:\\Users\\yashwanth\\Desktop\\svn\\sprint11\\1001\\uploads\\opal\\MyDemoProject","C:\\Users\\yashwanth\\Desktop\\svn\\sprint11\\1001\\uploads\\export");
    }
}

function copyCheck(source,dest){
    console.log("yashwanthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    var mkdirp = require('mkdirp');
    mkdirp(dest)

    // var fsCopy = require('fs-extra');

    // fsCopy.copy(source,dest,function(err,doc){
    //   if(err)console.log(err)
    //   console.log('docccccccccccccccccccccccccccccccccccccccccccccc');
    //   console.log(doc)
    // })
}
function handelFatalError(message){
    if(message.includes("fatal: remote origin already exists."))
    {
        require('simple-git')('C:\\Users\\yashwanth\\Desktop\\svn\\sprint11\\1001\\uploads\\export\\MyDemo')
        .removeRemote('origin',(err,res)=>{
        console.log("Some Error Occured Please Try Again...!!!")
        })
    }

}
process.on('unhandledRejection', (reason, promise) => {})


// .addRemote('origin', 'https://github.com/yashwanthkumarkc09/five.git')
// .push(['-u', 'origin', 'master'], () => console.log('done'));
// .add('./*',(err,doc)=>{

   // .addRemote('origin', 'https://github.com/yashwanthkumarkc09/six.git')