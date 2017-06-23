var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing users into DynamoDB. Please wait.");

var params = {
    TableName: "user",
    Item: {
        "title": "developer",
        "device": "123432"
    }
};

docClient.put(params, function (err, data) {
    if (err) {
        console.error("Unable to add user", params.Item.title, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("PutItem succeeded:", params.Item.title);
    }
});