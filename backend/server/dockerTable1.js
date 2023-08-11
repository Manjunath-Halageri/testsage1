module.exports = function (app) {
  var fs = require('fs');
  var mongojs = require('mongojs');
  var bodyParser = require("body-parser");
  var cmd = require('child_process');
  var db = require('../dbDeclarations').url;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  console.log("Calling Docker server");


  console.log("Calling Docker server");


  function createBatchFile(params, fileName) {

    fs.createWriteStream(fileName);
    fs.appendFileSync(fileName, params, 'utf8');

  }

  function dbCall(type, machineName) {
    console.log("I am in db call \n\n\n")


    if (type == "insert") {

      db.dockerEnvironment.insert({
        "machine": machineName,
        "passFail": "fail"
      })





    }
    else if (type == "update") {

      db.dockerEnvironment.update({ "machine": machineName }, { $set: { 'passFail': 'fail' } }, function (err, doc) {
        if (err != null) {
          console.log("someeeeeee errrorrr pass fail ")

        }
      })

    }

    else {
      console.log("some mismatch in calling function , check parameter")

    }
  } // function db close 





  app.get('/showingMachineTable', function (req, res) {
    console.log("Machine available are ");
    db.dockerEnvironment.find({}, function (err, doc) {
      res.json(doc);

      // console.log(doc);
      console.log("table............................ok \n \n ");
      console.log("heyyyyyyyy");
      //console.log(doc)
    });

  });//aap.get

  app.post('/logOutDocker',function (req,res){
    console.log("\n\n \n\n\n\n  logout docker  are are \n\n\n\n\n");
    console.log(req.body.userName)
    console.log(req.body.password)

    ///////////////////  Manish
var containerName = "";
var temp = 0;
var index;
db.dockerEnvironment.find({ "state": "Running", "errors": "",
 "container.status": "Running" },function(err,data){
    
    //var onlyNo = data[0].container.filter(step=>step.executionStatus == 'no');
    //console.log(onlyNo);
    data[0].container.forEach(function(e,eindex,earray){  
      // if(eindex == 0){
        //console.log(e)
        if(e.status=="Running"){
          console.log(" e.status== Running")
          console.log(e)
          console.log(eindex)
          
          if(temp==0){
          index = eindex;
          console.log("seeee conatiner name is coming...............")
          console.log(e.name)
          containerName = e.name;
          console.log(e.status)
          console.log(index)
          console.log("\n\n   end ")

          console.log("stop ..............container")
    var dockerCommand = `@echo off\n
      docker stop  ${containerName}  
      `

    var file1 = __dirname + "\\Batch\\dockerStopConatiner.bat";
    fs.createWriteStream(file1);
    fs.appendFileSync(file1, dockerCommand, 'utf8');
    setTimeout(() => {
      cmd.exec(file1, (err, stdout, stderr) => {
        console.log("Container  stopped..... done");
        db.dockerEnvironment.update({
          "machine": "default",
          'container.name': containerName
        }, {
            $set: {
              'container.$.status': "Stopped"


            }
          }, function (err, doc) {
            console.log("after stopped container")
            console.log(doc)

          })


      })
    })













          }
          temp = temp+1;

        }
      })
        // index = eindex;

        //container modifier start
//       var setModifier = {$set:{}};
//  console.log(index);
//  setModifier.$set['container.'+index+".status"] = 'Stopped';
//  console.log(setModifier)
//  db.dockerEnvironment.update({ "state": "Running", "errors": "",
//  "container.executionStatus": "no" },setModifier
//          , function (err, doc) {

//            console.log("\n\n trial versioonnnnnnnnnnnnnnnnnn log out \n \n ")
// //             console.log(doc)
// //             //  console.log(doc[0].length); 
// //             //  console.log(doc.name)
// //             // console.log(doc[0].IPAddress)
// //             // console.log(doc[0].container)
// //             console.log("\n\n")

//          });

           //container modifier end


        });





///////////////////  Manish










  }) //app.post logOutDocker





  app.post('/loginDocker', function (req, res) {

    console.log("\n\n \n\n\n\n  login docker  are are \n\n\n\n\n");
    console.log(req.body.userName)
    console.log(req.body.password)

    db.loginDetails.find({ "userName": req.body.userName, "password": req.body.password, "trialOrLicense": "trial" }, function (err, doc) {
      console.log(doc)
      console.log("lengthhhhhhhhhhh of doc   " + doc.length)

      if (doc.length >= 1) { // Start a new conatiner 

       try{

        var vncString
        var dockerCommand = "";
        var conatinerForImageRun;
        var conatinerForImage;
        var doc1;
        var doc22;
        var IPforImageRun;

        db.countInc.find({}, function (err, doc1) {
          IPforImageRun = doc1[0].dockerEnvironment.imageIp;
          conatinerForImageRun = doc1[0].dockerEnvironment.iContainer;
          conatinerForImage = "conatiner" + conatinerForImageRun

          console.log(IPforImageRun+"//////////////******************************\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\11111"+conatinerForImage);
          vncString = "ok ok";

        dockerCommand = `@echo off\n
      docker run  -d -P  -p "${IPforImageRun}:4444" --name  ${conatinerForImage} --link hubContainer:hub selenium/node-chrome-debug:3.14
      docker ps -a --last 1 > ${__dirname + "\\Batch\\imageRun.txt"}
      `

     // dockerCommand = `@echo off\n
      //docker run  -d -P  -p -e HUB_HOST=hub -e HUB_PORT=4444 -e HTTP_PROXY=http://192.168.99.144:8080 -e HTTPS_PROXY=http://192.168.99.144:8080 "${IPforImageRun}:4444" --name  ${conatinerForImage} --link hubContainer:hub selenium/node-chrome-debug:3.14
     // docker ps -a --last 1 > ${__dirname + "\\Batch\\imageRun.txt"}
     // `

          var lineNo = -1;
          var file1 = __dirname + "\\Batch\\imageRun.bat";
          var file2 = __dirname + "\\Batch\\imageRun.txt";
          fs.createWriteStream(file1);
          fs.appendFileSync(file1, dockerCommand, 'utf8');


          setTimeout(() => {
            cmd.exec(file1, (err, stdout, stderr) => {
              console.log("cmd exec first time others image  ..........doule check   ")

              try {

                if (err != null) {
                  throw err;
                } else {
                  console.log("upto now there is no errr  cmd exec first time")

                }

              } catch (err) {
                console.log("errr came   ", err);

                //dbCall("update", req.body.machineName);
              }




              console.log("ruuning Image is been done ");
              fs.readFile(file2, function (err, data) {

                console.log("reading line .....docker ps -a --last 1  command ")

                try {

                  if (err != null) {
                    throw err;
                  } else {
                    console.log("upto now there is no errr   fs.readFile  file2 first time")

                  }

                } catch (err) {
                  console.log("errr came   ", err);

                 // dbCall("update", req.body.machineName);

                }

                var LineByLineReader = require('line-by-line');
                lr = new LineByLineReader(file2)
                lr.on("error", function (err) {
                  console.log("errrrrrrrrorrrrrrr.......errrrrrr")
                })
                lr.on('line', function (line) {
                  console.log(++lineNo);
                  console.log(line + "\n")
                  if (lineNo == 1) {
                    console.log(line);
                    console.log("index of 32") //94   check then proceed
                    console.log(line.indexOf("second")); //->5900/tcp
                    console.log(line.indexOf("->5900/tcp"));

                    var a = line.indexOf("->5900/tcp");



                    console.log(line.substring(a - 5, a))

                    vncString = line.substring(a - 5, a)
                    console.log(vncString);


                    db.countInc.find({}, function (err, doc1) {
                      db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $inc: { "dockerEnvironment.imageIp": 1 } })
                      db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $inc: { "dockerEnvironment.iContainer": 1 } })
                      db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $inc: { "dockerEnvironment.chromeDebug": 1 } })
                    });

            
                    var dockerObjectContainer = {
                      "name": conatinerForImage,
                      "image": "selenium/node-chrome-debug:3.141",
                      "status": "Running",
                      //"port": IPforImageRun,
                      "port": vncString,
                      "start": true,
                      "stop": false,
                      "delete": false,
                      "executionStatus":"no"

                    } //var dockerObj

                    //////////////////////////////////////////////////////

                    var dockerCommand11 = `@echo off\n
      docker ps -a > ${__dirname + "\\Batch\\dockerPsA.txt"}
        `


                    var file11 = __dirname + "\\Batch\\dockerPsA.bat";
                    var file22 = __dirname + "\\Batch\\dockerPsA.txt";

                    fs.createWriteStream(file11);
                    fs.appendFileSync(file11, dockerCommand11, 'utf8');

                    setTimeout(() => {
                      cmd.exec(file11, (err, stdout, stderr) => {


                        try {

                          if (err != null) {
                            throw err;
                          } else {
                            console.log("upto now there is no errr  cmd exe 2nd  time")

                          }

                        } catch (err) {
                          console.log("errr came   ", err);

                          //dbCall("update", req.body.machineName);

                        }


                        setTimeout(() => {
                          fs.readFile(file22, function (err, data) {
                            console.log("file readingggggg")






                            try {

                              if (err != null) {
                                throw err;
                              } else {
                                console.log("upto now there is no errr  file22 double checking 2nd  time")

                              }

                            } catch (err) {
                              console.log("errr came   ", err);

                             // dbCall("update", req.body.machineName);

                            }





                            var readline = require('readline');
                            let rl = readline.createInterface({
                              input: fs.createReadStream(file22)
                            });
                            let line_no = 0;

                            // event is emitted after each line
                            rl.on('line', function (line) {
                              line_no++;
                              console.log(line);



                              if (line.includes(conatinerForImage) == true) {
                                tempExecute2 = 1;
                                console.log("\n\n container inserted  " + "\n\n");
                                //dbCall("update", req.body.machineName);


                                db.dockerEnvironment.update({ "machine": "default" }, { $push: { container: dockerObjectContainer } }, function (err, doc) {
                                  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                                  console.log(doc)
                                  console.log("Vnc port is   " + vncString)
                                  
                                });
                                console.log("insert image run  file executed")




                                // end
                                rl.on('close', function (line) {
                                  console.log("we aree in rl closeeeeeeeeee")
                                  if (tempExecute2 == 1) {
                                    console.log("alllll is wellllll")
                                  }
                                  else {
                                    console.log("someting went wrong container not created")
                                    //dbCall("update", req.body.machineName);
                                  }
                                  console.log('Total lines : ' + line_no);

                                  fs.unlink(file1, (err) => {
                                    if (err) throw err;
                                    console.log('path/file.txt was deleted');
                                  }); //fs.unlink
                                  fs.unlink(file2, (err) => {
                                    if (err) throw err;
                                    console.log('path/file.txt was deleted');
                                  }); //fs.unlink
                                  fs.unlink(file11, (err) => {
                                    if (err) throw err;
                                    console.log('path/file.txt was deleted');
                                  }); //fs.unlink
                                  fs.unlink(file22, (err) => {
                                    if (err) throw err;
                                    console.log('path/file.txt was deleted');
                                  }); //fs.unlink
                                });  //rl.on close 
















                              }  //if
                            });// rl.on line
                          });  //fs read
                        }, 10000)


                      }); //cmd.exe
                    }, 2000) // set time out




                    /////////////////////////////////









                    //str.charAt(0);

                  }
                })




                // console.log("insert image run  file executed")
              });//fs.read fileImageRun


            });//cmd.exec


          }, 2000);




        });  //db.countInc.find({}, function (err, doc1)





















       }
       catch{
         console.log("errrrrrrrrrrrrrrrrrrr  dockerTable1.js   loginDocker URL 418")
       }





      }//if condition doc.lenth   after   db.loginDetails app 




    }) //db.loginDetails


  }); // app.loginDocker 

  // "_id" : ObjectId("5bc467021f97da1aa072a8c0"),
  // "userName" : "Admin",
  // "password" : "Admin",
  // "userId" : "U01",
  // "roleName" : "platformAdmin",
  // "trialOrLicense" : "trial"

  app.post('/showingOnlyMachineDetails', function (req, res) {
    console.log("Machine Deatils are are ");
    console.log(req.body.machineName)
    db.dockerEnvironment.find({ "machine": req.body.machineName }, function (err, doc) {
      res.json(doc);

      console.log(doc);
      console.log("machineee...........Details.................ok \n \n ");
      console.log("heyyyyyyyy");
      //console.log(doc)
    });

  });//aap.get




  //there are 7 files in create machine
  //check all if exist  and delete the same
  // check in database and if present then delete from there
  app.post('/cancelMachine', function (req, res) {
    console.log("Cancelllllllllllllll    Machineeeeeeeeeeee")
    console.log(req.body.machineName);
    console.log("1111111")






    try {
      if (fs.existsSync(__dirname + "\\Batch\\dockerCreateMachine.bat")) {
        console.log("1111112")

        //file exists
        console.log("path exists ")

        fs.unlink(__dirname + "\\Batch\\dockerCreateMachine.bat", (err) => {
          try {
            //if (err) throw err;
            console.log(' file dockerCreateMachine.bat was deleted');
            // databaseInsertionOfCreateMachine("manish","singh");

          } catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else {
        console.log("file do not exists ")
      }
    } catch (err) {
      console.error(err)
    } // 1 file 




    try {
      if (fs.existsSync(__dirname + "\\Batch\\dockerCreateMachine.bat")) {
        console.log("1111111222")

        //file exists
        console.log("path exists ")

        fs.unlink(__dirname + "\\Batch\\dockerCreatefirst.txt", (err) => {
          try {
            //if (err) throw err;
            console.log(' file dockerCreateMachine.bat was deleted');
            // databaseInsertionOfCreateMachine("manish","singh");

          } catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else {
        console.log("file do not exists ")
      }
    } catch (err) {
      console.error(err)
    } // 2 file 



    try {
      if (fs.existsSync(__dirname + "\\Batch\\machineIp.bat")) {
        console.log("11111113333")

        //file exists
        console.log("path exists ")

        fs.unlink(__dirname + "\\Batch\\dockerCreateMachine.bat", (err) => {
          try {
            //if (err) throw err;
            console.log(' file dockerCreateMachine.bat was deleted');
            // databaseInsertionOfCreateMachine("manish","singh");

          } catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else {
        console.log("file do not exists ")
      }
    } catch (err) {
      console.error(err)
    } // 3 file



    try {

      console.log("11111114444444444aaaa")
      if (fs.existsSync(__dirname + "\\Batch\\machineIp.txt")) {

        //file exists
        console.log("path exists ")
        console.log("111111144444444bbbbbbbbbbbbb")

        fs.unlink(__dirname + "\\Batch\\machineIp.txt", (err) => {
          try {
            //if (err) throw err;
            console.log(' file dockerCreateMachine.bat was deleted');
            // databaseInsertionOfCreateMachine("manish","singh");

          } catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else {
        console.log("file do not exists ")
      }
    } catch (err) {
      console.error(err)
    } // 4 file


    try {
      if (fs.existsSync(__dirname + "\\Batch\\dockerDoubleMachine.bat")) {

        //file exists
        console.log("path exists ")

        fs.unlink(__dirname + "\\Batch\\dockerDoubleMachine.bat", (err) => {
          try {
            //if (err) throw err;
            console.log(' file dockerCreateMachine.bat was deleted');
            // databaseInsertionOfCreateMachine("manish","singh");

          } catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else {
        console.log("file do not exists ")
      }
    } catch (err) {
      console.error(err)
    } // 5 file


    try {
      if (fs.existsSync(__dirname + "\\Batch\\doubleMachine.txt")) {

        //file exists
        console.log("path exists ")

        fs.unlink(__dirname + "\\Batch\\doubleMachine.txt", (err) => {
          try {
            //if (err) throw err;
            console.log(' file double machine txt was deleted');
            // databaseInsertionOfCreateMachine("manish","singh");

          } catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else {
        console.log("file do not exists ")
      }
    } catch (err) {
      console.error(err)
    } // 6th file





    db.dockerEnvironment.find({ "machine:": req.body.machineName, "passFail": "pass" }, function (err, doc) {
      try {

        db.dockerEnvironment.remove({ "machine": req.body.machineName })
        console.log(" from databse that machine")


        console.log("dbbbbbbbbbb passsssssssss")
        if (doc.length >= 1) {
          console.log("doc length = " + doc.length)
          db.dockerEnvironment.remove({ "machine": req.body.machineName }, function (err, doc) {
            console.log("databse deleted")
          })
          console.log(" from databse that machine")

          var dockerCommand = `@echo off\n
    docker-machine  rm -f  ${req.body.machineName} > ${__dirname + "\\Batch\\dockerDeleteMachine.txt"}
    `

          var file1 = __dirname + "\\Batch\\dockerDeleteMachine.bat";
          fs.createWriteStream(file1);
          fs.appendFileSync(file1, dockerCommand, 'utf8');
          setTimeout(() => {
            cmd.exec(file1, (err, stdout, stderr) => {
              console.log("Machine deleted...... done");
              db.dockerEnvironment.remove({ "machine": req.body.machineName })
              console.log(" from databse that machine")

            })
          });
        }//if (doc.length>1){

      } catch{
        console.log("some errror ")
      }


    });// db.dockerEnvironment.find({ "machine:": req.body.machineName,"passFail":"pass"





    db.dockerEnvironment.find({ "machine:": req.body.machineName, "passFail": "fail" },
      function (err, doc) {

        db.dockerEnvironment.remove({ "machine": req.body.machineName })
        console.log(" from databse that machine")


        console.log("dbbbbbbbbbbb faillllllllllll")
        try {
          console.log("doc length = " + doc.length)
          if (doc.length >= 1) {


            // db.dockerEnvironment.remove({ "machine": req.body.machineName })
            // console.log(" from databse that machine")




          }

        } catch{
          console.log("catch   some eroor")
          console.error(err)
        }
      });








  });//app.post




















  app.post('/createMachine', function (req, res) {
    console.log(req.body.machineName);
    console.log(req.body.diskSize);
    console.log(req.body.cpuCount);
    console.log(req.body.ramMemory);
    console.log("createAndInsertMachine")
    console.log("create ..............machine")
    res.json({ "status": "creating" })
    var diskSize = req.body.diskSize;
    var cpuCount = req.body.cpuCount;
    var ramMemory = req.body.ramMemory;
    var dockerCommand = `@echo off\n
        docker-machine create  -d virtualbox --virtualbox-disk-size "${req.body.diskSize}"  --virtualbox-memory "${req.body.ramMemory}"  --virtualbox-cpu-count "${req.body.cpuCount}"  ${req.body.machineName}  >> ${__dirname + "\\Batch\\dockerCreatefirst.txt"}  
        `

    var file1 = __dirname + "\\Batch\\dockerCreateMachine.bat";
    var file2 = __dirname + "\\Batch\\dockerCreatefirst.txt";


    fs.createWriteStream(file1);
    setTimeout(() => {
      fs.appendFileSync(file1, dockerCommand, 'utf8');
    }, 2000);

    setTimeout(() => {
      cmd.exec(file1, (err, stdout, stderr) => {
        console.log("Machine creation is done   first");

        try {

          if (err != null) {
            throw err;
          } else {
            console.log("upto now there is no errr  cmd exec first time")

          }

        } catch (err) {
          console.log("errr came   ", err);

          dbCall("insert", req.body.machineName);




        }
        var dockerCommand2 = `@echo off\n
      
         docker-machine ip ${req.body.machineName} >>  ${__dirname + "\\Batch\\machineIp.txt"}
        `
        var file11 = __dirname + "\\Batch\\machineIp.bat";
        var file22 = __dirname + "\\Batch\\machineIp.txt";

        fs.createWriteStream(file11);
        fs.appendFileSync(file11, dockerCommand2, 'utf8');
        setTimeout(() => {
          cmd.exec(file11, (err, stdout, stderr) => {

            try {

              if (err != null) {
                throw err;
              } else {
                console.log("upto now there is no errr  cmd exec first time")

              }

            } catch (err) {
              console.log("errr came   ", err);
              // insert Machine name & pass fail = fail 
              dbCall("insert", req.body.machineName);


            }

            console.log("running machine Ip is done ");
            doubleCheckMachineInside(req.body.machineName, req.body.ramMemory, req.body.diskSize, req.body.cpuCount, file22)
          }, 10000) //set TimeOut  for file11
        }); //cmd.exec file11
      });//cmd.exe file1
    }, 100000) //set TimeOut




  }); //app.post   create machine









  function doubleCheckMachineInside(machineName, ramMemory, diskSize, cpuCount, file22) {
    console.log("\nwe are in   doubleCheckMachineInside  function\n\n ")
    console.log(machineName)
    var dockerCommandDouble = `@echo off\n
    docker-machine ls > ${__dirname + "\\Batch\\doubleMachine.txt"}
`
    var file1 = __dirname + "\\Batch\\dockerDoubleMachine.bat";
    var file2 = __dirname + "\\Batch\\doubleMachine.txt";
    //let tempExecute2 =0;
    fs.createWriteStream(file1);
    fs.appendFileSync(file1, dockerCommandDouble, 'utf8');
    cmd.exec(file1, (err, stdout, stderr) => {
      console.log("docker-machine LS is been done ");
      // fs.readFile(file2, function (err, data) {

      try {

        if (err != null) {
          throw err;
        } else {
          console.log("upto now there is no errr  cmd exec first time")

        }

      } catch (err) {
        console.log("errr came   ", err);
        // insert Machine name & pass fail = fail 
        dbCall("insert", machineName);


      }
      console.log("file readingggggg")
      var readline = require('readline');
      let rl = readline.createInterface({
        input: fs.createReadStream(file2)
      });
      let line_no = 0;

      // event is emitted after each line
      rl.on('line', function (line) {
        line_no++;
        console.log(line);



        if ((line.includes(machineName) == true) && (line.includes("v19.03") == true)) {
          tempExecute2 = 1;
          console.log("\n\n machine create double check ....downloaded  " + "\n\n");
          //databaseInsertionOfCreateMachine("manish","singh");
          newMachineIpInsertion(machineName, ramMemory, diskSize, cpuCount, file22)
        }
      });
      // end
      rl.on('close', function (line) {
        console.log('Total lines : ' + line_no);
        fs.unlink(file2, (err) => {
          //if (err) throw err;
          console.log(' file 2 double check /path was deleted');
          // databaseInsertionOfCreateMachine("manish","singh");
        });
      });
      // fs.unlink(file2, (err) => {
      //   if (err) throw err;
      //   console.log(' file 2 double check /path was deleted');
      // });

      //}) //fs.readFile
    }); //cmd.exe
  }




  function newMachineIpInsertion(machineName, ramMemory, diskSize, cpuCount, file22) {
    console.log("databse insertion Machine Ip function is calling")
    let dockerIndex = null;
    let dockerCondition = false;
    var LineByLineReader = require('line-by-line');
    lr = new LineByLineReader(file22)
    lr.on('error', function (err) {
      // 'err' contains error object

      try {

        if (err != null) {
          throw err;
        } else {
          console.log("upto now there is no errr  cmd exec first time")

        }

      } catch (err) {
        console.log("errr came   ", err);
        // insert Machine name & pass fail = fail 
        dbCall("insert", machineName);


      }
      console.log(" error file not found " + file22)
    });
    lr.on('line', function (line) {
      let uniqueData = line.split(" ");
      console.log(uniqueData)
      console.log(uniqueData[0])
      setTimeout(() => {


        db.dockerEnvironment.find({
          "machine": machineName

        }, function (err, docTemp) {


          var docTemplen = docTemp.length;

          if (docTemplen <= 0) {


            db.dockerEnvironment.insert({
              "machine": machineName,
              "active": "",
              "driver": "virtualbox",
              "state": "Running",
              "url": `http://${uniqueData[0]}:4444`,
              "docker": "v19.03",
              "errors": "",
              "executionStatus": "no",
              "swarm": "",
              "date": new Date(),
              "IPAddress": uniqueData[0],
              "passFail": "pass",
              "container": [],
              "image": [],
              "configVersion": 3,
              "dnxProxy": true,
              "swarmHost": "tcp://0.0.0.0.3376",
              "swarmMaster": false,
              "memory": ramMemory,
              "diskSize": diskSize,
              "cpu": cpuCount


            }, function (err, doc) {

              console.log("create machine insertion done");

              //  fs.unlinkSync(file22);
              fs.unlink(file22, (err) => {
                if (err) throw err;
                console.log('path/file was deleted');
              });

              console.log('File deleted!');
            }); //db.dockerEnvironment.insert    
          }
          else {


            db.dockerEnvironment.update({
              "machine": machineName,

            }, {
                $set: {
                  "machine": machineName,
                  "active": "",
                  "driver": "virtualbox",
                  "state": "Running",
                  "url": `http://${uniqueData[0]}:4444`,
                  "docker": "v19.03.1",
                  "errors": "",
                  "executionStatus": "no",
                  "swarm": "",
                  "date": new Date(),
                  "IPAddress": uniqueData[0],
                  "passFail": "pass",
                  "container": [],
                  "image": [],
                  "configVersion": 3,
                  "dnxProxy": true,
                  "swarmHost": "tcp://0.0.0.0.3376",
                  "swarmMaster": false,
                  "memory": ramMemory,
                  "diskSize": diskSize,
                  "cpu": cpuCount
                }
              }, function (err, doc) {

              })
            // update database  like above 


            console.log("create machine insertion done");

            //  fs.unlinkSync(file22);
            fs.unlink(file22, (err) => {
              if (err) throw err;
              console.log('path/file was deleted');
            });
            //res.json({ "status": "creating" })
            console.log('File deleted!');















          }  // else 


        });  // db.dockerEnvironment.find 




      });//setTimeOut



    }) //lr.on



  }//function 










  app.post('/runImageForMachineJustForNow', function (req, res) {
    var vncString
    var dockerCommand = "";
    var conatinerForImageRun;
    var conatinerForImage;
    var doc1;
    var doc22;
    var IPforImageRun;

    db.countInc.find({}, function (err, doc1) {
      IPforImageRun = doc1[0].dockerEnvironment.imageIp;
      conatinerForImageRun = doc1[0].dockerEnvironment.iContainer;
      conatinerForImage = "conatiner" + conatinerForImageRun


      //1/5
      if (req.body.imageName == "selenium/hub") {
        console.log("imageeeeee");
        console.log(req.body.imageName)

        console.log(IPforImageRun+"//////////////******************************\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\222222"+conatinerForImage);
        dockerCommand = `@echo off\n
          @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName}') DO @%%i\n 
          docker run  -d -P  -p "4444:4444" --name hubContainer selenium/hub
          docker ps -a --last 1 > ${__dirname + "\\Batch\\imageRun.txt"}
      `
        var file1 = __dirname + "\\Batch\\imageRun.bat";
        var file2 = __dirname + "\\Batch\\imageRun.txt";
        createBatchFile(dockerCommand, file1);
        // fs.createWriteStream(file1);
        // fs.appendFileSync(file1, dockerCommand, 'utf8');





        setTimeout(() => {
          cmd.exec(file1, (err, stdout, stderr) => {
            console.log("ruuning Image is been done ");

            try {

              if (err != null) {
                throw err;
              } else {
                console.log("upto now there is no errr  cmd exec first time")

              }

            } catch (err) {
              console.log("errr came   ", err);
              dbCall("update", req.body.machineName);




            }



            fs.readFile(file2, function (err, data) {

              try {

                if (err != null) {
                  throw err;
                } else {
                  console.log("upto now there is no errr  cmd exec first time")

                }

              } catch (err) {
                console.log("errr came   ", err);

                dbCall("update", req.body.machineName);

              }



              db.countInc.find({}, function (err, doc1) {
                db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $inc: { "dockerEnvironment.imageIp": 1, "dockerEnvironment.iContainer": 1, "dockerEnvironment.seleniumHub": 1 } })
              });




              db.dockerEnvironment.update({
                "machine": req.body.machineName,
                'image.name': req.body.imageName,
              }, {
                  $set: {
                    'image.$.run': true

                  }
                }, function (err, doc) {
                  if (err != null) {
                    console.log("someeeeeee errrorrr set image run ")
                  }

                }) //
              var dockerObjectContainer = {
                "name": "hubContainer",
                "image": req.body.imageName,
                "status": "Running",
                "port": 4444,
                "start": true,
                "stop": false,
                "delete": false

              }





              /////////////////////////////////////////////////////////
              console.log("double cheking startttttttttttt")

              var dockerCommand11 = `@echo off\n
      @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName}') DO @%%i\n
      docker ps -a > ${__dirname + "\\Batch\\dockerPsA.txt"}
        `


              var file11 = __dirname + "\\Batch\\dockerPsA.bat";
              var file22 = __dirname + "\\Batch\\dockerPsA.txt";

              fs.createWriteStream(file11);
              fs.appendFileSync(file11, dockerCommand11, 'utf8');

              setTimeout(() => {
                console.log("set time out  ..........doule check   ")
                cmd.exec(file11, (err, stdout, stderr) => {
                  console.log("cmd exec time out  ..........doule check   ")


                  try {

                    if (err != null) {
                      throw err;
                    } else {
                      console.log("upto now there is no errr  cmd exec first time")

                    }

                  } catch (err) {
                    console.log("errr came   ", err);

                    dbCall("update", req.body.machineName);

                  }


                  setTimeout(() => {
                    console.log("set time out 2  ..........doule check   ")
                    fs.readFile(file22, function (err, data) {


                      try {

                        if (err != null) {
                          throw err;
                        } else {
                          console.log("upto now there is no errr  cmd exec first time")

                        }

                      } catch (err) {
                        console.log("errr came   ", err);

                        dbCall("update", req.body.machineName);

                      }
                      console.log("file readingggggg")
                      var readline = require('readline');
                      let rl = readline.createInterface({
                        input: fs.createReadStream(file22)
                      });
                      let line_no = 0;

                      // event is emitted after each line
                      rl.on('line', function (line) {
                        line_no++;
                        console.log("line no is   " + line_no)




                        if (line.includes("hubContainer") == true) {
                          console.log(line);
                          tempExecute2 = 1;
                          console.log("\n\n container inserted  " + "\n\n");
                          dbCall("update", req.body.machineName);



                          db.dockerEnvironment.update({ "machine": req.body.machineName }, { $push: { container: dockerObjectContainer } }, function (err, doc) {
                            console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                            console.log(doc)
                            console.log("Vnc port is   " + vncString)
                            db.dockerEnvironment.find({ "machine:": req.body.machineName }, function (err, doc) {
                              res.json(doc);
                            });
                          });
                          console.log("insert image run  file executed")




                          // end
                          rl.on('close', function (line) {

                            console.log("we aree in rl closeeeeeeeeee")
                            if (tempExecute2 == 1) {
                              console.log("alllll is wellllll")
                            }
                            else {
                              console.log("someting went wrong container not created")

                              dbCall("update", req.body.machineName);


                            }
                            console.log('Total lines : ' + line_no);

                            console.log('Total lines : ' + line_no);

                            fs.unlink(file1, (err) => {
                              if (err) throw err;
                              console.log('path/file.txt was deleted');
                            }); //fs.unlink
                            fs.unlink(file2, (err) => {
                              if (err) throw err;
                              console.log('path/file.txt was deleted');
                            }); //fs.unlink
                            fs.unlink(file11, (err) => {
                              if (err) throw err;
                              console.log('path/file.txt was deleted');
                            }); //fs.unlink
                            fs.unlink(file22, (err) => {
                              if (err) throw err;
                              console.log('path/file.txt was deleted');
                            }); //fs.unlink
                          });  //rl.on close 
















                        }  //if
                      });// rl.on line
                    });  //fs read

                  }, 8000) // set time out   

                }); //cmd.exe
              }, 3000) // set time out




              /////////////////////////////////







              // db.dockerEnvironment.update({ "machine": req.body.machineName }, { $push: { container: dockerObjectContainer } }, function (err, doc) {
              //   console.log(doc)
              //   db.dockerEnvironment.find({ "machine:": req.body.machineName }, function (err, doc) {
              //     res.json(doc);
              //   });
              // });
              // console.log("insert image run  file executed")
            });//fs.read fileImageRun


          });//cmd.exec
        }, 2000);


      } else {

        console.log("imageeeeee");
        console.log(req.body.imageName)
        vncString = "ok ok";
        console.log(IPforImageRun+"//////////////******************************\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\333333"+conatinerForImage);
        dockerCommand = `@echo off\n
      @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName}') DO @%%i\n
      docker run  -d -P  -p "${IPforImageRun}:4444" --name  ${conatinerForImage} --link hubContainer:hub ${req.body.imageName} 
      docker ps -a --last 1 > ${__dirname + "\\Batch\\imageRun.txt"}
      `
        var lineNo = -1;
        var file1 = __dirname + "\\Batch\\imageRun.bat";
        var file2 = __dirname + "\\Batch\\imageRun.txt";
        fs.createWriteStream(file1);
        fs.appendFileSync(file1, dockerCommand, 'utf8');


        setTimeout(() => {
          cmd.exec(file1, (err, stdout, stderr) => {
            console.log("cmd exec first time others image  ..........doule check   ")

            try {

              if (err != null) {
                throw err;
              } else {
                console.log("upto now there is no errr  cmd exec first time")

              }

            } catch (err) {
              console.log("errr came   ", err);

              dbCall("update", req.body.machineName);
            }




            console.log("ruuning Image is been done ");
            fs.readFile(file2, function (err, data) {

              console.log("reading line .....docker ps -a --last 1  command ")

              try {

                if (err != null) {
                  throw err;
                } else {
                  console.log("upto now there is no errr   fs.readFile  file2 first time")

                }

              } catch (err) {
                console.log("errr came   ", err);

                dbCall("update", req.body.machineName);

              }

              var LineByLineReader = require('line-by-line');
              lr = new LineByLineReader(file2)
              lr.on("error", function (err) {
                console.log("errrrrrrrrorrrrrrr.......errrrrrr")
              })
              lr.on('line', function (line) {
                console.log(++lineNo);
                console.log(line + "\n")
                if (lineNo == 1) {
                  console.log(line);
                  console.log("index of 32") //94   check then proceed
                  console.log(line.indexOf("second")); //->5900/tcp
                  console.log(line.indexOf("->5900/tcp"));

                  var a = line.indexOf("->5900/tcp");



                  console.log(line.substring(a - 5, a))

                  vncString = line.substring(a - 5, a)
                  console.log(vncString);


                  db.countInc.find({}, function (err, doc1) {
                    db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $inc: { "dockerEnvironment.imageIp": 1 } })
                    db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $inc: { "dockerEnvironment.iContainer": 1 } })
                    db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $inc: { "dockerEnvironment.chromeDebug": 1 } })
                  });

                  db.dockerEnvironment.update({
                    "machine": req.body.machineName,
                    'image.name': req.body.imageName,
                  }, {
                      $set: {
                        'image.$.run': true

                      }
                    }, function (err, doc) {

                    }) //
                  var dockerObjectContainer = {
                    "name": conatinerForImage,
                    "image": req.body.imageName,
                    "status": "Running",
                    //"port": IPforImageRun,
                    "port": vncString,
                    "start": true,
                    "stop": false,
                    "delete": false

                  } //var dockerObj

                  //////////////////////////////////////////////////////

                  var dockerCommand11 = `@echo off\n
      @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName}') DO @%%i\n
      docker ps -a > ${__dirname + "\\Batch\\dockerPsA.txt"}
        `


                  var file11 = __dirname + "\\Batch\\dockerPsA.bat";
                  var file22 = __dirname + "\\Batch\\dockerPsA.txt";

                  fs.createWriteStream(file11);
                  fs.appendFileSync(file11, dockerCommand11, 'utf8');

                  setTimeout(() => {
                    cmd.exec(file11, (err, stdout, stderr) => {


                      try {

                        if (err != null) {
                          throw err;
                        } else {
                          console.log("upto now there is no errr  cmd exe 2nd  time")

                        }

                      } catch (err) {
                        console.log("errr came   ", err);

                        dbCall("update", req.body.machineName);

                      }


                      setTimeout(() => {
                        fs.readFile(file22, function (err, data) {
                          console.log("file readingggggg")






                          try {

                            if (err != null) {
                              throw err;
                            } else {
                              console.log("upto now there is no errr  file22 double checking 2nd  time")

                            }

                          } catch (err) {
                            console.log("errr came   ", err);

                            dbCall("update", req.body.machineName);

                          }





                          var readline = require('readline');
                          let rl = readline.createInterface({
                            input: fs.createReadStream(file22)
                          });
                          let line_no = 0;

                          // event is emitted after each line
                          rl.on('line', function (line) {
                            line_no++;
                            console.log(line);



                            if (line.includes(conatinerForImage) == true) {
                              tempExecute2 = 1;
                              console.log("\n\n container inserted  " + "\n\n");
                              dbCall("update", req.body.machineName);


                              db.dockerEnvironment.update({ "machine": req.body.machineName }, { $push: { container: dockerObjectContainer } }, function (err, doc) {
                                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                                console.log(doc)
                                console.log("Vnc port is   " + vncString)
                                db.dockerEnvironment.find({ "machine:": req.body.machineName }, function (err, doc) {
                                  res.json(doc);
                                });
                              });
                              console.log("insert image run  file executed")




                              // end
                              rl.on('close', function (line) {
                                console.log("we aree in rl closeeeeeeeeee")
                                if (tempExecute2 == 1) {
                                  console.log("alllll is wellllll")
                                }
                                else {
                                  console.log("someting went wrong container not created")
                                  dbCall("update", req.body.machineName);
                                }
                                console.log('Total lines : ' + line_no);

                                fs.unlink(file1, (err) => {
                                  if (err) throw err;
                                  console.log('path/file.txt was deleted');
                                }); //fs.unlink
                                fs.unlink(file2, (err) => {
                                  if (err) throw err;
                                  console.log('path/file.txt was deleted');
                                }); //fs.unlink
                                fs.unlink(file11, (err) => {
                                  if (err) throw err;
                                  console.log('path/file.txt was deleted');
                                }); //fs.unlink
                                fs.unlink(file22, (err) => {
                                  if (err) throw err;
                                  console.log('path/file.txt was deleted');
                                }); //fs.unlink
                              });  //rl.on close 
















                            }  //if
                          });// rl.on line
                        });  //fs read
                      }, 10000)


                    }); //cmd.exe
                  }, 2000) // set time out




                  /////////////////////////////////









                  //str.charAt(0);

                }
              })




              // console.log("insert image run  file executed")
            });//fs.read fileImageRun


          });//cmd.exec


        }, 2000);


      } //else 

    });  //db.countInc.find({}, function (err, doc1)




  }); //runImageForMachine  url end here

































  app.post('/pullImageForMachine', function (req, res) {

    console.log("helllllllllloooo")
    console.log(req.body.machineName);
    console.log(req.body.imageName);
    console.log(req.body.tempName);

    console.log("pulling image in machine --- " + req.body.machineName)
    var temp;
    res.json({ "status": "pulling" })

    db.dockerEnvironment.find({
      "machine": req.body.machineName,
      'image.name': 'selenium/hub'
    }, function (err, doc1) {
      //res.json(doc);

      console.log("latest doc is................lenth")
      temp = doc1.length;
      console.log(doc1.length)
      //console.log(doc1)
      console.log("We are printing , latest   how many images is present in this machine")




      if (temp >= 1 || req.body.imageName == "selenium/hub") {

        //do all operation


        var dockerCommand = `@echo off\n
      @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName}') DO @%%i\n
      docker pull ${req.body.imageName} > ${__dirname + "\\Batch\\pullingImage1.txt"}
      docker  inspect ${req.body.imageName} > ${__dirname + "\\Batch\\pullingImage.json"}
        `

        var file1 = __dirname + "\\Batch\\pullingImage.bat";
        var file2 = __dirname + "\\Batch\\pullingImage.json";



        fs.createWriteStream(file1);
        setTimeout(() => {
          fs.appendFileSync(file1, dockerCommand, 'utf8');
        }, 2000);
        // res.json({ "status": "uploading" })
        setTimeout(() => {
          cmd.exec(file1, (err, stdout, stderr) => {

            try {

              if (err != null) {
                throw err;
              } else {
                console.log("upto now there is no errr  cmd exec first time")

              }

            } catch (err) {
              console.log("errr came   ", err);

              dbCall("update", req.body.machineName);




            }

            console.log("Pulling Image is been done ");

            fs.readFile(file2, function (err, data) {
              console.log("docker image Inspect Json file has been read");

              try {

                if (err != null) {
                  throw err;
                } else {
                  console.log("upto now there is no errr  cmd exec first time")

                }

              } catch (err) {
                console.log("errr came   ", err);

                dbCall("update", req.body.machineName);




              }


              console.log("machine name is " + req.body.machineName);
              console.log("image name is " + req.body.imageName);
              //console.log(jsonParsed[0].RepoTags)

              //1
              if (req.body.imageName == "selenium/hub") {
                var size = "285MB";
                var version = "3.141.59";
                var tag = "latest";
              }
              //2
              if (req.body.imageName == "selenium/node-chrome-debug:3.141") {
                var size = "888MB";
                var version = "74.0.3729";
                var tag = "latest";
              }
              //3
              if (req.body.imageName == "selenium/node-chrome-debug:3.0.1") {
                var size = "870MB";
                var version = "56.0.2924";
                var tag = "3.0.1"
              }
              //4
              if (req.body.imageName == "selenium/node-firefox-debug:3.10.0") {
                var size = "799MB";
                var version = "67.0";
                var tag = "latest";
              }
              //5
              if (req.body.imageName == "selenium/node-firefox-debug:3.0.1") {
                size = "814MB";
                version = "58.0.2";
                tag = "3.10.0";
              }

              var dockerObject = {
                "name": req.body.imageName,
                "tag": tag,
                "version": version,
                //"size": jsonParsed[0].Size,
                "size": size,
                "run": false,
                "delete": false

              }


              console.log("kuch b ni")
              console.log(req.body.machineName)
              console.log("I am here...........but when \n")


              var dockerCommand11 = `@echo off\n
            @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName}') DO @%%i\n
            docker images > ${__dirname + "\\Batch\\dockerImages.txt"}
              `

              var file11 = __dirname + "\\Batch\\dockerImages.bat";
              var file22 = __dirname + "\\Batch\\dockerImages.txt";

              fs.createWriteStream(file11);
              fs.appendFileSync(file11, dockerCommand11, 'utf8');
              setTimeout(() => {
                cmd.exec(file11, (err, stdout, stderr) => {

                  try {

                    if (err != null) {
                      throw err;
                    } else {
                      console.log("upto now there is no errr  cmd exec first time")

                    }

                  } catch (err) {
                    console.log("errr came   ", err);

                    dbCall("update", req.body.machineName);



                  }


                  fs.readFile(file22, function (err, data) {

                    try {

                      if (err != null) {
                        throw err;
                      } else {
                        console.log("upto now there is no errr  cmd exec first time")

                      }

                    } catch (err) {
                      console.log("errr came   ", err);

                      dbCall("update", req.body.machineName);




                    }

                    console.log("file readingggggg")
                    var readline = require('readline');
                    let rl = readline.createInterface({
                      input: fs.createReadStream(file22)
                    });
                    let line_no = 0;
                    let temp = 0;
                    rl.on('line', function (line) {
                      line_no++;
                      console.log(line);



                      if (line.includes(req.body.tempName) == true) {
                        temp = 1;
                        console.log("\n\n image download double check ....downloaded  " + "\n\n");
                        db.dockerEnvironment.update({ "machine": req.body.machineName }, { $set: { 'passFail': 'pass' } }, function (err, doc) { });
                        db.dockerEnvironment.update({ "machine": req.body.machineName }, { $push: { image: dockerObject } }, function (err, doc) {
                          db.dockerEnvironment.find({ "machine": req.body.machineName }, function (err, doc) {
                            // res.json(doc);
                          })
                        })


                        rl.on('close', function (line) {
                          console.log("rl.on function closed ")

                          if (temp == 1) {
                            temp = 0;
                            console.log("alllll is wellllll")
                          }
                          else {
                            console.log("someting went wrong container not created")
                            dbCall("update", req.body.machineName);
                          }




                          fs.unlink(file2, (err) => {
                            if (err) throw err;
                            console.log('path/file.txt was deleted');
                          }); //fs.unlink
                          fs.unlink(file22, (err) => {
                            if (err) throw err;
                            console.log('path/file.txt was deleted');
                          }); //fs.unlink
                          fs.unlink(file11, (err) => {
                            if (err) throw err;
                            console.log('path/file.txt was deleted');
                          }); //fs.unlink
                          fs.unlink(file1, (err) => {
                            if (err) throw err;
                            console.log('path/file.txt was deleted');
                          }); //fs.unlink
                        });





                      }  //if 

                    }); //rl.on




                  }); // fs read file


                }); // cmd exe 



              }) //set time out























            });//fs.readFile

          });//cmd.exec

        });//setTimeOut


      } //if temp>=1

      else {

        res.json({ "status": "ooops.. pull selenium/hub first" })

        dbCall("update", req.body.machineName);




        console.log("Selenium/hub is not present ");
        console.log("So, please first upload selenium Hub before other image")
      } //else


    });//db


  });//app.post





































} //module.exports = function (app) 

























