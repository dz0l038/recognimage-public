var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var ddb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient()
const rekognition = new AWS.Rekognition();

let planTable = "Plan-***-dev";
let imageTable = "Image-***-dev";
if (process.env.ENV === 'prod') {
  // Set prod env
  console.log("Prod env")
  planTable = "Plan-***-prod";
  imageTable = "Image-***-prod";
}

exports.handler = async (event, context, callback) => { //eslint-disable-line
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  const eventName = event.Records[0].eventName;
  const bucket = event.Records[0].s3.bucket.name; //eslint-disable-line
  let key = event.Records[0].s3.object.key.replace('%3A', ':'); //eslint-disable-line
  const imgSize = event.Records[0].s3.object.size;
  const maxSize = 5000000; // More that 5Mb images would be rejected
  const filename = key.split('.').slice(0, -1).join('.');

  console.log(eventName)
  // If an image is removed
  if (eventName === "ObjectRemoved:Delete") {

  }

  // If an image is add
  if (eventName === "ObjectCreated:Put") {
    console.log("put event")
    // Check if the size the image or if it is a thumbnail
    console.log(filename)
    if (filename.endsWith('-thumbnail')) {
      console.log('Image is a thumbnail')
      callback(null, "Image is a thumbnail")
      return
    }
    if (imgSize > maxSize) {
      // Image is too big -> remove it
      removeImageS3(key, bucket);
      callback(Error("Fail: image too big"))
      return
    }
    else {
      // Check if the user can upload new images
      let planItem = await canBeAdded(key, bucket);
      if (planItem) {
        console.log("The image can be analysed")
        // Analyse
        let rekognitionResult = await launchRecognition(key, bucket)
        console.log(rekognitionResult)
        await putImageDB(key, bucket, rekognitionResult);
        await updatePlan(key, bucket);
      }
      else {
        callback("Fail, not enough credit or time", null)
      }
    }
  }

  console.log(`Bucket: ${bucket}`, `Key: ${key}`);
};

function removeImageS3(key, bucket) {
  let params = { Bucket: bucket, Key: key };

  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      return false
    }
    else {
      console.log("Image deleted from s3")
      return true
    }
  });
}

async function canBeAdded(key, bucket) {
  // Get the folder name from the key
  let folderId = key.split('/')[2];
  // Get the corresponding plan
  let paramsGetPlan = {
    ExpressionAttributeValues: {
      ':folderId': { S: folderId },
    },
    IndexName: "ByFolder",
    KeyConditionExpression: 'folderId = :folderId',
    ProjectionExpression: 'id, folderId, maxUpload, usedUpload, endDate',
    TableName: planTable
  };
  return new Promise((resolve, reject) => {
    ddb.query(paramsGetPlan, function (err, data) {
      if (err) {
        console.log(err);
        resolve(false);
      }
      else {
        const maxUpload = parseInt(data.Items[0].maxUpload.N);
        const usedUpload = parseInt(data.Items[0].usedUpload.N);
        const endDate = new Date(data.Items[0].endDate.S);
        const currentDate = new Date();
        if (maxUpload >= usedUpload && endDate >= currentDate) {
          // We can analyse
          resolve(data.Items[0]);
        } else {
          resolve(false);
        }
      }
    })
  });

}

function getPlan(key, bucket) {
  // Get the folder name from the key
  let folderId = key.split('/')[2];
  // Get the corresponding plan
  let paramsGetPlan = {
    ExpressionAttributeValues: {
      ':folderId': { S: folderId },
    },
    IndexName: "ByFolder",
    KeyConditionExpression: 'folderId = :folderId',
    ProjectionExpression: 'id, folderId, maxUpload, usedUpload, endDate',
    TableName: planTable
  };
  return ddb.query(paramsGetPlan).promise()
}

function removeImageDB(key, bucket) {

}

async function updatePlan(key, bucket) {
  let dataPlan = await getPlan(key, bucket)
  if (!dataPlan) return
  let planItem = dataPlan.Items[0];
  let newUsedUpload = parseInt(parseInt(planItem.usedUpload.N) + 1);
  var params = {
    TableName: planTable,
    Key: {
      "id": planItem.id.S},
    UpdateExpression: "set usedUpload = :r",
    ExpressionAttributeValues: {
      ":r": newUsedUpload,
    },
    ReturnValues: "UPDATED_NEW"
  };

  console.log("Updating the item...");
  return docClient.update(params, function (err, data) {
    if (err) {
      console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
  }).promise();
}

function putImageDB(key, bucket, analysisResult) {
  let folderId = key.split('/')[2];
  let name = key.split('/').pop();
  let isAnalyse = analysisResult ? true : false;
  let online = 'public';
  let date = new Date().toISOString();
  let owner = key.split('/')[3];
  var params = {
    TableName: imageTable,
    Item: {
      key: { S: key },
      folderId: { S: folderId },
      name: { S: name },
      isAnalyse: { BOOL: isAnalyse },
      analysisResult: { S: JSON.stringify(analysisResult) },
      online: { S: online },
      date: { S: date },
      owner: { S: owner },
    }
  };

  // Call DynamoDB to add the item to the table
  return ddb.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  }).promise();
}

function launchRecognition(key, bucket) {
  let params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  };

  return rekognition.detectText(params).promise()
}