const AWS = require('aws-sdk')
const uuid = require('uuid/v4')
const ddb = new AWS.DynamoDB();

// Table parameters
let planTable = "Plan-***-dev";
let folderTable = "Folder-***-dev";
if (process.env.ENV === 'prod') {
  // Set prod env
  console.log("Prod env")
  planTable = "Plan-***-prod";
  folderTable = "Folder-***-prod";
}

exports.handler = (event, context, callback) => {
  console.log(event);
  const newPlanId = "TestPlan-" + uuid();
  const newPaymentId = "TestPayment-" + uuid();
  const newFolderId = "TestFolder-" + uuid();
  const maxUpload = 50;
  const date = new Date().toISOString();
  const userSub = event.request.userAttributes.sub;
  const offset = 6;
  let endDate = new Date();
  endDate.setMonth(endDate.getMonth() + offset);
  const folderName = "Test project";

  let paramsPlan = {
    TableName: planTable,
    Item: {
      "id": { "S": newPlanId },
      "paymentId": { "S": newPaymentId },
      "folderId": { "S": newFolderId },
      "maxUpload": { "N": maxUpload.toString() },
      "usedUpload": { "N": "0" },
      "createDate": { "S": date },
      "endDate": { "S": endDate.toISOString() },
      "user": { "S": userSub },
    }
  };
  console.log(paramsPlan)
  ddb.putItem(paramsPlan, function (err, data) {
    if (err) {
      console.log("Error", err);
      callback(`Error creating plan: ${err.message}`)
    } else {
      // Create the folder entry on the db
      let paramsFolder = {
        TableName: folderTable,
        Item: {
          "id": { "S": newFolderId },
          "owner": { "S": userSub },
          "planId": { "S": newPlanId },
          "title": { "S": folderName },
          "online": { "S": "public" },
          "created": { "S": date },
          "publicKey": { "S": uuid() },
        }
      };
      console.log(paramsFolder)
      ddb.putItem(paramsFolder, function (err, data) {
        if (err) {
          console.log("Error", err);
          callback(`Error creating folder: ${err.message}`)
        } else {
          callback(null, event)
        }
      })
    }
  })
}