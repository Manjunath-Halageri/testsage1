// Before final 

module.exports = function (app) {
  var fs = require('fs');
  var bodyParser = require("body-parser");
  var cmd = require('child_process');
  var LineByLineReader = require('line-by-line');
  var db = require('../dbDeclarations').url;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  console.log("Calling Docker server");

  app.post('/startMachine', function (req, res) {



    console.log(req.body.machineName);

    console.log("start ..............machine")
    var dockerCommand = `@echo off\n
      docker-machine start  ${req.body.machineName}\n
      docker-machine ip ${req.body.machineName} > ${__dirname + "\\Batch\\dockerStartIpMachine.txt"}
      
      `

    var file1 = __dirname + "\\Batch\\dockerStartMachine.bat";
    var file2 = __dirname + "\\Batch\\dockerStartIpMachine.txt";

    fs.createWriteStream(file1);
    fs.appendFileSync(file1, dockerCommand, 'utf8');
    setTimeout(() => {
      cmd.exec(file1, (err, stdout, stderr) => {
        console.log("Machine started...... done");

        lr = new LineByLineReader(file2)
        lr.on('error', function (err) {
          // 'err' contains error object
          console.log(" error rr rr rr ")
        });
        lr.on('line', function (line) {
          console.log("threeeeeeeeeeeeeee")
          console.log(line)
          var url = "http://" + line + ":" + "4444"
          console.log(url)
          db.dockerEnvironment.update({ "machine": req.body.machineName }, { $set: { "state": "Running", "url": url, "IPAddress": line } }, function (err, doc) {
            if (err) { return err; }
            console.log(doc);
            console.log("Databse updated to start machine ")
          })


        });//lr.on ('line',)


      })//cmd
    })//set time out
  });





  app.post('/stopMachine', function (req, res) {


    console.log("26thhhhhhhhhh   june")
    console.log(req.body.machineName);

    console.log("stop ..............machine")
    var dockerCommand = `@echo off\n
    docker-machine stop  ${req.body.machineName} > ${__dirname + "\\Batch\\dockerStopMachine.txt"}
    `

    var file1 = __dirname + "\\Batch\\dockerStopMachine.bat";
    fs.createWriteStream(file1);
    fs.appendFileSync(file1, dockerCommand, 'utf8');
    setTimeout(() => {
      cmd.exec(file1, (err, stdout, stderr) => {
        console.log("Machine stopped...... done");
        db.dockerEnvironment.update({ "machine": req.body.machineName }, { $set: { "state": "Stopped", "url": "" } }, function (err, doc) {
          if (err) { return err; }
          console.log(doc);
          console.log("Databse updated to stop machine ")
        })

      })
    })
  });





  // db.countInc.update({"projectID":"pID"},{$set:{ "fCount":finalfCount,"sCount":finalsCount,
  // "pCount":finalpCount,"mCount":finalmCount}})









  app.post('/deleteMachine', function (req, res) {



    console.log(req.body.machineName);

    console.log("delete ......nowww........machine")
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
    })
  });









  // Containerrrrrrrrrrrrrrrrrrrrrrrrrrrrrr  Containerrrrrrr




  app.post('/startContainer', function (req, res) {



    console.log(req.body.machineName);
    console.log(req.body.containerName);
    req.body.machineName = req.body.machineName;
    req.body.containerName = req.body.containerName;

    console.log("start ..............container")
    var dockerCommand = `@echo off\n
    @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName}') DO @%%i\n
      docker start  ${req.body.containerName}\n 
      docker inspect  ${req.body.containerName} > ${__dirname + "\\Batch\\dockerStartConatiner.json"}
      
      `

    var file1 = __dirname + "\\Batch\\dockerStartConatiner.bat";
    var file2 = __dirname + "\\Batch\\dockerStartConatiner.json";
    fs.createWriteStream(file1);
    fs.appendFileSync(file1, dockerCommand, 'utf8');
    setTimeout(() => {
      cmd.exec(file1, (err, stdout, stderr) => {
        console.log("Container  started...... done");
        fs.readFile(file2,'utf-8',function (err,data) {
          if(err)console.log("err in reading file");
          console.log("docker container Inspect Json file has been read");
          
          console.log("conatiner name is " + req.body.containerName);
          //console.log(jsonParsed[0].State);

          // var repoPlusTags = jsonParsed[0].State.Status;
          // console.log(repoPlusTags);
          var a = `jsonParsed[0].HostConfig.PortBindings.4444/tcp[0].HostPort;`
          var repoPlusTags2 = a;
          //console.log(repoPlusTags2);
          db.dockerEnvironment.update({
            "machine": req.body.machineName,
            'container.name': req.body.containerName
          }, {
              $set: {
                'container.$.status': "Running"


              }
            }, function (err, doc) {
              console.log("after start container")
              console.log(doc)

            })





        })
// console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
// console.log(manish)




      })
    })
  });




  app.post('/stopContainer', function (req, res) {


    console.log(req.body.machineName);
    console.log(req.body.containerName);

    console.log("stop ..............container")
    var dockerCommand = `@echo off\n
    @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName} ') DO @%%i\n
      docker stop  ${req.body.containerName}  
      `

    var file1 = __dirname + "\\Batch\\dockerStopConatiner.bat";
    fs.createWriteStream(file1);
    fs.appendFileSync(file1, dockerCommand, 'utf8');
    setTimeout(() => {
      cmd.exec(file1, (err, stdout, stderr) => {
        console.log("Container  stopped..... done");
        db.dockerEnvironment.update({
          "machine": req.body.machineName,
          'container.name': req.body.containerName
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
  });



  app.post('/cancelUploadImage', function (req, res) {

    
    console.log(req.body.machineName);
    console.log(req.body.imageName);
    
    console.log(req.body.tempName);


    try {
      if (fs.existsSync( __dirname + "\\Batch\\pullingImage1.txt")) {
        console.log("1111112")

        //file exists
        console.log("path exists ")
      
        fs.unlink(__dirname + "\\Batch\\pullingImage1.txt", (err) => {
          try { 
          //if (err) throw err;
          console.log(' file dockerCreateMachine.bat was deleted');
          // databaseInsertionOfCreateMachine("manish","singh");

          }catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else{
        console.log("file do not exists ")
      }
    } catch(err) {
      console.error(err)
    } // 1 file 
    

    
    try {
      if (fs.existsSync( __dirname + "\\Batch\\pullingImage.bat")) {
        console.log("1111112")

        //file exists
        console.log("path exists ")
      
        fs.unlink(__dirname + "\\Batch\\pullingImage.bat", (err) => {
          try { 
          //if (err) throw err;
          console.log(' file dockerCreateMachine.bat was deleted');
          // databaseInsertionOfCreateMachine("manish","singh");

          }catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else{
        console.log("file do not exists ")
      }
    } catch(err) {
      console.error(err)
    } // 2 file
    
    
    
    try {
      if (fs.existsSync(  __dirname + "\\Batch\\pullingImage.json")) {
        console.log("1111112")

        //file exists
        console.log("path exists ")
      
        fs.unlink( __dirname + "\\Batch\\pullingImage.json", (err) => {
          try { 
          //if (err) throw err;
          console.log(' file pull image .bat was deleted');
          // databaseInsertionOfCreateMachine("manish","singh");

          }catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else{
        console.log("file do not exists ")
      }
    } catch(err) {
      console.error(err)
    } // 3 file 


    
    try {
      if (fs.existsSync( __dirname + "\\Batch\\dockerImages.bat")) {
        console.log("1111112")

        //file exists
        console.log("path exists ")
      
        fs.unlink(__dirname + "\\Batch\\dockerImages.bat", (err) => {
          try { 
          //if (err) throw err;
          console.log(' file dockerCreateMachine.bat was deleted');
          // databaseInsertionOfCreateMachine("manish","singh");

          }catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else{
        console.log("file do not exists ")
      }
    } catch(err) {
      console.error(err)
    } // 4 file
    
    
    try {
      if (fs.existsSync(  __dirname + "\\Batch\\dockerImages.txt")) {
        console.log("1111112")

        //file exists
        console.log("path exists ")
      
        fs.unlink( __dirname + "\\Batch\\dockerImages.txt", (err) => {
          try { 
          //if (err) throw err;
          console.log(' file dockerCreateMachine.bat was deleted');
          // databaseInsertionOfCreateMachine("manish","singh");

          }catch{
            console.log("while deleting some eroor")
            console.log(err)
          }
        });


      }
      else{
        console.log("file do not exists ")
      }
    } catch(err) {
      console.error(err)
    } // 5 file 

    

    
    db.dockerEnvironment.find({
      "machine": req.body.machineName,
      'image.name': req.body.imageName
    }, function (err, doc1) {

      try { 
      if(doc1.length>=1) { 
    
   
    console.log(req.body.machineName);
    console.log(req.body.imageName);

    console.log("delete ..............image ...functionality")
    var dockerCommand = `@echo off\n
    @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName} ') DO @%%i\n
      docker rmi -f  ${req.body.imageName}  
      `

      var file1 = __dirname + "\\Batch\\dockerDeleteImage.bat";
        fs.createWriteStream(file1);
        fs.appendFileSync(file1, dockerCommand, 'utf8');
        setTimeout(() => {
          cmd.exec(file1, (err, stdout, stderr) => {
            console.log("image  deleted...... done");
            //db.dockerEnvironment.remove({ "machine": req.body.machineName })
            //db.dockerEnvironment.update({"machine" : "machine5"},{"$pull":{"container":{"name":req.body.containerName}}})

            db.dockerEnvironment.update({ "machine": req.body.machineName },
              { "$pull": { "image": { "name": req.body.imageName } } })
            console.log("image  deleted...... done from databse ");
            


          })
        })
      } //if 
    }catch{
      console.log("Someeee erorrrrrr might hahve came " + err)
    }

    });
    




  })//app.post cancel upload image 















  app.post('/deleteContainer', function (req, res) {
   


    

    console.log(req.body.machineName);
    console.log(req.body.containerName);

    console.log("delete ..............container")


    

    var dockerCommand = `@echo off\n
      @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName} ') DO @%%i\n
        docker rm -f  ${req.body.containerName}  
        `

    var file1 = __dirname + "\\Batch\\dockerDeleteConatiner.bat";
    fs.createWriteStream(file1);
    fs.appendFileSync(file1, dockerCommand, 'utf8');
    setTimeout(() => {
      cmd.exec(file1, (err, stdout, stderr) => {
        console.log("Container  deleted...... done");

        db.dockerEnvironment.update({ "machine": req.body.machineName },
          { "$pull": { "container": { "name": req.body.containerName } } })
        console.log("conatiener  deleted...... done from databse ");



    

      }) //cmd.exec
    })  //set.timeOut
  });




  app.post('/waitingImage', function (req, res) {
    console.log("I am in uploading image URL ..machine name & image is ");
    console.log(req.body.machineName);
    console.log(req.body.imageName);


    db.dockerEnvironment.find({
      "machine": req.body.machineName,
      'passFail': "pass"
    }, function (err, doc11) {


      if (doc11.length >= 1) {

        console.log("allll opertaion from here ")





        db.dockerEnvironment.find({
          "machine": req.body.machineName,
          'image.name': req.body.imageName
        }, function (err, doc) {


          console.log("length  ....uploading image is ");
          //res.json(doc);
          console.log("doc is................")
          if (doc.length >= 1) {
            console.log("hip hip huray imageeeeeee ")
            res.json({ "status": "pulled" })

          }
          else {
            console.log("oooops ,   still not created ")
            res.json({ "status": "pulling" })

          }
          //console.log(doc)
        }); // db.dockerEnvironment  close 


      } //if  below     db.dockerEnvironement not fail   condtion 
      else {

        res.json({ "status": "unexpectedError" })

      }
    });  //    db.dockerEnvironement not fail   condtion 

  })


  app.post('/waitingMachine', function (req, res) {

    console.log("I am in waiting machine URL  and  machineName is " + req.body.machineName);

    db.dockerEnvironment.find({
      "machine": req.body.machineName,
      "passFail": "fail"
    }, function (err, doc11) {
      //res.json(doc);
      console.log("waiting Machine db query working ")
      var temp1 = doc11.length;
      //console.log("length  ....waiting machine is " + temp1);
      if (temp1 <= 0) {





        db.dockerEnvironment.find({
          "machine": req.body.machineName,
          "passFail": "pass"
        }, function (err, doc1) {
          //res.json(doc);
          console.log("waiting Machine db query working ")
          var temp = doc1.length;
          console.log("length  ....waiting machine is " + temp);
          if (temp >= 1) {
            console.log("hip hip huray ")
            res.json({ "status": "created" })

          }
          else {
            console.log("oooops ,   still not created ")
            res.json({ "status": "creating" })

          }
        });  //db.dockerEnvironment
      }
      else {
        res.json({ "status": "fail" })

      }
    });


  })  //app.post





  app.post('/deleteImage', function (req, res) {


    console.log(req.body.machineName);
    console.log(req.body.imageName);

    console.log("delete ..............image ...functionality")
    var dockerCommand = `@echo off\n
    @FOR /f "tokens=*" %%i IN ('docker-machine env ${req.body.machineName} ') DO @%%i\n
      docker rmi -f  ${req.body.imageName}  
      `

      var file1 = __dirname + "\\Batch\\dockerDeleteImage.bat";
        fs.createWriteStream(file1);
        fs.appendFileSync(file1, dockerCommand, 'utf8');
        setTimeout(() => {
          cmd.exec(file1, (err, stdout, stderr) => {
            console.log("image  deleted...... done");
            //db.dockerEnvironment.remove({ "machine": req.body.machineName })
            //db.dockerEnvironment.update({"machine" : "machine5"},{"$pull":{"container":{"name":req.body.containerName}}})

            db.dockerEnvironment.update({ "machine": req.body.machineName },
              { "$pull": { "image": { "name": req.body.imageName } } })
            console.log("image  deleted...... done from databse ");
            


          })
        })
      })










}//module.export 
