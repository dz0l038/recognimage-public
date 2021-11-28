var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB();

let imageTable = "Image-***-dev";
let matchTable = "Match-***-dev";
if (process.env.ENV === 'prod') {
  // Set prod env
  console.log("Prod env")
  imageTable = "Image-***-prod";
  matchTable = "Match-***-prod";
}

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.post('/images', function (req, res) {
  if (!req.body.folderId) return
  let folderId = req.body.folderId;
  let nextToken = req.body.nextToken;
  let search = req.body.search
  let perpage = 50;

  if (req.body.perpage) perpage = req.body.perpage;

  if (!search || search === '') {
    // Get all pictures
    let paramsGetAllImages = {
      ExpressionAttributeValues: {
        ':folderId': { S: folderId },
      },
      ExpressionAttributeNames: { '#k': 'key', '#n': 'name' },
      IndexName: "ByFolder",
      KeyConditionExpression: 'folderId = :folderId',
      ProjectionExpression: '#k, #n',
      TableName: imageTable,
      Limit: perpage,
      ExclusiveStartKey: nextToken,
    };
    ddb.query(paramsGetAllImages, function (err, data) {
      if (err) {
        console.log(err);
        res.status(400).send(`Fail getting images: ${err.message}`);
      }
      else {
        console.log(data)
        res.json({ success: 'Succeed to get images', url: req.url, body: data })
      }
    })
  } else {
    // Matches based on search
    let paramsGetMatchImages = {
      ExpressionAttributeValues: {
        ':folderId': { S: folderId },
        ':search': { S: 'public#' + search },
      },
      ExpressionAttributeNames: { '#k': 'key', '#n': 'name', '#sortKey': 'online#match#name#date' },
      IndexName: "ByMatch",
      KeyConditionExpression: 'folderId = :folderId and begins_with(#sortKey, :search)',
      ProjectionExpression: '#k, #n',
      TableName: matchTable,
      Limit: perpage,
      ExclusiveStartKey: nextToken,
    };
    ddb.query(paramsGetMatchImages, function (err, data) {
      if (err) {
        console.log(err);
        res.status(400).send(`Fail getting images: ${err.message}`);
      }
      else {
        console.log(data)
        res.json({ success: 'Succeed to get images', url: req.url, body: data })
      }
    })
  }
});


// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
