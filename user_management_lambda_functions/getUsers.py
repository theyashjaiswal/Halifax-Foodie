import json
from datetime import datetime
import boto3
from boto3.dynamodb.conditions import Key


def getUsers_handler(event,context):
    # requestBody = json.loads(event['body'])
    # print(requestBody)
    # userid = requestBody['userid']
    
    dynamo = boto3.resource("dynamodb")

    table = dynamo.Table('users')
    resp = table.scan()
    print(resp['Items'])
    usersObj = []
    for i in resp['Items']:
        user={
            "userid": i['userid'],
            "name": i['name'],
            "email": i['email'],
            "usertype": i['usertype'],
            "userstatus": i['userstatus'],
            "lastseen": i['lastseen']
        }
        usersObj.append(user)

    print(len(resp['Items']))
    print(usersObj)
    if (len(resp['Items']) != 0):
        return {"statusCode": 200, "headers": {"Content-Type": "application/json"}, "body": json.dumps(usersObj)}
    else:
        return {"statusCode": 400, "headers": {"Content-Type": "application/json"}, "body": "no users in the database!!"}
