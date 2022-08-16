// db.dealerdev.find({"CP_ID":"CP1005"},{"ID":1})

// { "_id" : ObjectId("62f3972321c7050b3ca9eef5"), "ID" : 10006 } //dealer ID
// { "_id" : ObjectId("62fb21e7cab74e9139bc1532"), "ID" : 10014 }
// { "_id" : ObjectId("62fb6bb72645ab18bc9f756c"), "ID" : 10001 }

// db.leadTable.find({'_id': { $in: [10001]}})


db.leadTable.find({'dealer_id': { $in: [10001, 10014, 10006]}}).count()
db.leadTable.aggregate({messages:{$elemMatch:{sender_type: "CUSTOMER"}}, {'dealer_id': { $in: [10001, 10014, 10006]}}).count()
db.leadTable.find({'dealer_id': { $in: [10001, 10014, 10006]},messages:{$elemMatch: {sender_type: "CUSTOMER"}}}).count()
const noResponse = await db.collection('leadTable').find({'dealer_id': { $in: [10001, 10014, 10006]},$and: [{"messages.sender_type": {$ne: "CUSTOMER"}}, {"messages": {$ne: []}}, {"messages.sender_type": {$ne: "\""}}, {dealer_id: { $eq: event.data.ID}}]}).count()



const totalLead = await db.collection('leadTable').find({dealer_id: event.data.ID}).count()
const response = await db.collection('leadTable').find({messages:{$elemMatch: {sender_type: "CUSTOMER"}}, { $in: [10001, 10014, 10006]}}).count()
const noResponse = await db.collection('leadTable').find({$and: [{"messages.sender_type": {$ne: "CUSTOMER"}}, {"messages": {$ne: []}}, {"messages.sender_type": {$ne: "\""}}, {dealer_id: { $eq: event.data.ID}}]}).count()
const botResponse = await db.collection('leadTable').find({'dealer_id': { $in: [10001, 10014, 10006]},"messages":{"$elemMatch": {"sender_type" : "BOT"}}, dealer_id: event.data.ID}).count()

const allModel = await db.collection('leadTable').aggregate([
           {
               $match : {
                   messages: {
                       $elemMatch: {sender_type: "BOT"}
                   },
                   'dealer_id': { $in: [10001, 10014, 10006]}
               }
           },
           {
               $group: {
                   "_id": "$vehicle_info.vehicle_details.model",
                   "count": {
                       "$sum": 1
                   }
               }
           },{
               $project:{
                   "count": "$count",
                   "percent": {$multiply:[{$divide:["$count",totalLead]},100]}
               }
           }
       ]).toArray();

const allStatus = await db.collection('leadTable').aggregate([
           {
               $match : {
                   messages: {
                       $elemMatch: {sender_type: "BOT"}
                   },
                   'dealer_id': { $in: [10001, 10014, 10006]}
               }
           },
           {
               $group: {
                   "_id": "$status",
                   "count": {
                       "$sum": 1
                   }
               }
           }
       ]).toArray();
       
       
const vehiclebyYear = await db.collection('leadTable').aggregate([
   {
       $match : {
           messages: {
               $elemMatch: {sender_type: "BOT"}
           },
           'dealer_id': { $in: [10001, 10014, 10006]}
       }
   },
   {
       $group:{
           "_id":"$vehicle_info.vehicle_details.year",
           "count":{
               "$sum":1
               
           }
           
       }
       
   },
   {
       $project:{
           "count": "$count",
           "percent": {
               $multiply: [{$divide: ["$count", totalLead]}, 100]
           }
       }
   },
   {
       $sort:{
           "_id":1
       }
       
   }
   ]).toArray()
   

const result = {
   statusCode: 200,
   body: {data: {
           totalLead: totalLead, 
           customerResponded: response, 
           customerNoResponded: noResponse,  
           botResponse,
           carModel: allModel ,  
           status: allStatus, 
           vehicleByYear: vehiclebyYear,
   }},
}
return result



db.leadTable.find({messages:{$elemMatch:{sender_type: "CUSTOMER"}}, $in:[10001, 10014, 10006]}).count()