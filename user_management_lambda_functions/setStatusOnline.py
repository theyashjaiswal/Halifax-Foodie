import json
from datetime import datetime
import boto3
from boto3.dynamodb.conditions import Key

def setStatusOnline_handler(event,context):
    requestBody = json.loads(event['body'])
    print(requestBody)
    userid = requestBody['userid']

    dynamo = boto3.resource("dynamodb")

    table = dynamo.Table('users')
    current_timestamp = str(datetime.now())
    
    resp = table.query(KeyConditionExpression=Key('userid').eq(userid))
    
    
    if (len(resp['Items']) != 0):
        resp2 = table.update_item(Key={'userid': userid},UpdateExpression="set userstatus = :g, lastseen = :h",
        ExpressionAttributeValues={
                ':g': "online",':h': current_timestamp
            },
        ReturnValues="UPDATED_NEW")
        return {"statusCode": 201, "headers": {"Content-Type": "application/json"},
                "body": "user status set as online!"}
    else:
        return {"statusCode": 400, "headers": {"Content-Type": "application/json"}, "body": "user not found!"}
 
    