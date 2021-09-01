import json
import boto3
from boto3.dynamodb.conditions import Key

def getUser_handler(event, context):
    requestBody = json.loads(event['body'])
    print(requestBody)
    userid = requestBody['userid']
    
    dynamo = boto3.resource("dynamodb")

    table = dynamo.Table('users')
    resp = table.query(KeyConditionExpression=Key('userid').eq(userid))
    print(len(resp['Items']))
    print("test")
    if(len(resp['Items'])!=0):
        return {"statusCode": 200,"headers": {"Content-Type": "application/json"},"body": json.dumps(resp['Items'])}
    else:
        return {"statusCode": 400,"headers": {"Content-Type": "application/json"},"body": "userid not found!!"}