import json
import boto3
from boto3.dynamodb.conditions import Key


def getOnlineUsers_handler(event,context):
    
    dynamo = boto3.resource("dynamodb")

    table = dynamo.Table('users')
    resp = table.scan()
    online_users = []
    for i in resp['Items']:
        if(i['userstatus']=="online"):
            online_users.append(i)
    print(online_users)
    if(len(online_users)!=0):
        return {"statusCode": 200, "headers": {"Content-Type": "application/json"},
                "body": json.dumps(online_users)}
    else:
        return {"statusCode": 400, "headers": {"Content-Type": "application/json"}, "body": "No users online"}