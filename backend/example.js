const express = require('express')
const mongoose = require('mongoose');
// var db=mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
const app = express()
const port = 4000
const uri ='mongodb+srv://Manoj:jonam@123@cluster0.tjbda.mongodb.net/testingEnv?retryWrites=true&w=majority';

app.get('/', (req, res) => {
  res.send('Hello World!');
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },(err,db)=>{
    const dbo = db.db('testingEnv')
      dbo.licenseDocker.find({ "machineName": machine }, async function (err, result) {
        console.log("MACHINE STATUS IS ",result,"STATE", result[0].state)
      })
  })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

// async function main(){
//   /**
//    * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//    * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//    */
//   const uri = "mongodb+srv://Manoj:jonam@123@cluster0.tjbda.mongodb.net/testingEnv?retryWrites=true&w=majority";

//   // var mongo = require('mongodb');
//   const client = new MongoClient(uri);

//   try {
//       // Connect to the MongoDB cluster
//       await client.connect();

//       // Make the appropriate DB calls
//       await  listDatabases(client);

//   } catch (e) {
//       console.error(e);
//   } finally {
//       await client.close();
//   }
// }

// main().catch(console.error);



// const mongoose=require('mongoose');
// const uri='mongodb+srv://Manoj:jonam@123@cluster0.tjbda.mongodb.net/testingEnv?retryWrites=true&w=majority';
// const database=async()=>{
//   await mangoose.connect(uri,{useUnifiedTopology:true,useNewUrlParser:true});
//   console.log("connected!!!!!");
// }

// module.exports = { 
//   'secret': 'thisissomethingsecrete',
//   // 'database': 'mongodb://localhost:27017/collections',
//   // 'database':'mongodb+srv://Manoj:jonam@123@cluster0.tjbda.mongodb.net/testingEnv?retryWrites=true&w=majority'
//   database:database

// };
// // mongodb+srv://Manoj:<password>@cluster0.tjbda.mongodb.net/test

