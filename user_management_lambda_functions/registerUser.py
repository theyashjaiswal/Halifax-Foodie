import json
import boto3
from boto3.dynamodb.conditions import Key

def registerUser_handler(event, context):
    requestBody = json.loads(event['body'])

    userid = requestBody['userid']
    usertype = requestBody['usertype']
    email = requestBody['email']
    name = requestBody['name']
    question1 = requestBody['question1']
    answer1 = requestBody['answer1']
    question2 = requestBody['question2']
    answer2 = requestBody['answer2']
    userstatus = "offline"

    dynamo = boto3.resource("dynamodb")

    table = dynamo.Table('users')
    resp = table.query(KeyConditionExpression=Key('userid').eq(userid))
    print(resp)

    if (len(resp['Items']) != 0):
        return {"statusCode": 400, "headers": {"Content-Type": "application/json"}, "body": "user already exits!!"}

    else:
        table.put_item(
            Item={"userid": userid, "usertype": usertype, "email": email, "name": name, "question1": question1,
                  "answer1": answer1, "question2": question2, "answer2": answer2, "userstatus":userstatus,"lastseen":""})
        return {"statusCode": 200, "headers": {"Content-Type": "application/json"},
                "body": "user created successfully!!"}