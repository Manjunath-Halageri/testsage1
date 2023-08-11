

const mongojs = require('mongojs');
var bodyParser = require("body-parser");

const dataBase = require('../../serverConfigs/db').database;
const db =  mongojs(dataBase, []);

function findAll(collection) {

  return  new Promise((resolves,reject)=> {
        collection.find(function (err, result) {
            if (err) {
                console.log(err);
            } else if (result.length > 0) {
                resolves(result);
            }
        });
})

}

function findOne(collection,obj) {
    return  new Promise((resolves,reject)=> {
          collection.findOne(obj,function (err, result) {
              if (err) {
                  console.log(err);
              }else{
              //  console.log(result);
                  resolves(result);
              }
          });
  })
  
  }
  function findCondition(collection,obj) {
   console.log("  findCondition   findCondition ")
   console.log(collection);
   console.log(obj);
       return  new Promise((resolves,reject)=> {
             collection.find(obj,function (err, result) {
                 if (err) {
                     console.log(err);
                 }else{
                    // console.log(result,"\n\nBY ANIL\n\n")
                     resolves(result);
                 }
             });
     })
     
     }

     function createCondition(collection,obj) {
         console.log("getttinggggggggggggg")
   
        return  new Promise((resolves,reject)=> {
              collection.insert(obj,function (err, result) {
                  if (err) {
                      console.log(err);
                  }else{
              
                      resolves(result);
                  }
              });
      })
      
      }
     function updateOne(collection,updateCondition,updateParams) {
   
        return  new Promise((resolves,reject)=> {
              collection.update(updateCondition,updateParams,function (err, result) {
                  if (err) {
                      console.log(err);
                  }else{
              
                      resolves(result);
                  }
              });
      })
      
      }
      function aggregate(collection,obj) {
        return  new Promise((resolves,reject)=> {
              collection.aggregate(obj,function (err, result) {
                  if (err) {
                    reject(err);
                  }else{
                    //   console.log("*************************",result)
                      resolves(result);
                  }
              });
      })
      
      }
      function updateAll(collection,updateCondition,updateParams) {
         
   
        return  new Promise((resolves,reject)=> {
              collection.update(updateCondition,updateParams,{multi:true},function (err, result) {
                  if (err) {
                      console.log(err);
                  }else{
              
                      resolves(result);
                  }
              });
      })
      
      }




      function   findAndModify(collection,query,update) {
    
        return  new Promise((resolves,reject)=> {
           
            collection.findAndModify( {query:query,update:update},function (err, result) {
                if (err) {
                    console.log(err);
                }else{
                    resolves(result);
                }
            });
    })
    
       }



       function findConditionWithSort(collection, obj, sort) {
        console.log("  findCondition   findCondition ")
        console.log(collection);
        console.log(obj);
        return new Promise((resolves, reject) => {
            collection.find(obj, sort, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
    
                    resolves(result);
                }
            });
        })
    
    }
    







//    function   findAndModify(collection,modifyCondition) {
    
//     return  new Promise((resolves,reject)=> {
       
//         collection.findAndModify( {query: { },update:modifyCondition},function (err, result) {
//             if (err) {
//                 console.log(err);
//             }else{
       
//                 resolves(result);
//             }
//         });
// })

//    }
  

//       var now = Date.now(),
//       oneDay = ( 1000  60  60 * 24 ),
//       today = new Date( now - ( now % oneDay ) ),
//       tomorrow = new Date( today.valueOf() + oneDay );
//       console.log( today);
//       console.log(   tomorrow );
//       console.log(   new Date());
//       var start = new Date();
// start.setHours(0,0,0,0);

// var end = new Date();
// end.setHours(23,59,59,999);
// db.organization.find({endDate: {$gte: start, $lt: end}},
//     function (err,doc) {
//       console.log(doc)
//         if(doc.length !=0){
//    db.organization.update({endDate: {$gte: start, $lt: end}},{$set:{ "statusId" : 02}}, { multi : true },
//     function (err,doc1) {
//         if(doc1.nModified >= 1){
//           console.log(doc1)
//             for(i=0;i<=doc.length-1;i++){
//                 console.log(doc[i].orgId)
        
//            db.loginDetails.update({"orgId" :doc[i].orgId },{$set:{"userStatus" : 02}}, { multi : true },
//            function (err,doc2){
//               console.log(doc2)
//            })
//         }
//     }
//         else{
//             console.log("else")
           
//         }
        
//     })
    
  
//         }
//         else{
//             console.log("2019-09-15T07:21:42.877Z")
//         }
        
        
//     })
// db.organization.update({endDate: {$gte: start, $lt: end}},{$set:{  "statusId" : 111}}, { multi : true },

//   function (err,doc) {
//       console.log(doc)
      
//   })
  
module.exports = {
    findOne: findOne,
    findAll: findAll,
    findAndModify:findAndModify,
    findCondition:findCondition,
    updateOne:updateOne,
    updateAll:updateAll,
    createCondition:createCondition,
    aggregate : aggregate,
    findConditionWithSort:findConditionWithSort
//     dataBaseCall:dataBaseCall
    // updateAll:updateAll,
  };