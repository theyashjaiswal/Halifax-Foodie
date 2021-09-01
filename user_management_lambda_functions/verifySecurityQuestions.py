import json
import boto3
from boto3.dynamodb.conditions import Key

def verifySecurityQuestions_handler(event,context):
    requestBody = json.loads(event['body'])
    userid = requestBody['userid']
    question1 = requestBody['question1']
    answer1 = requestBody['answer1']
    question2 = requestBody['question2']
    answer2 = requestBody['answer2']

    verification_status=False
    
    dynamo = boto3.resource("dynamodb")

    table = dynamo.Table('users')
    resp = table.query(KeyConditionExpression=Key('userid').eq(userid))
    print(resp)

    if (len(resp['Items']) != 0):
        dbresponsequestion1 = resp['Items'][0]['question1']
        dbresponsequestion2 = resp['Items'][0]['question2']
        dbanswer1 = resp['Items'][0]['answer1']
        dbanswer2 = resp['Items'][0]['answer2']
        if(dbresponsequestion1 == question1 and dbresponsequestion2 == question2):
            if(dbanswer1 == answer1 and dbanswer2 == answer2):
                return {"statusCode": 200,"headers": {"Content-Type": "application/json"},"body": "verified"}
            else:
                return {"statusCode": 400,"headers": {"Content-Type": "application/json"},"body": "verification failed!!"}
        else:
            return {"statusCode": 400,"headers": {"Content-Type": "application/json"},"body": "verification failed!!"}
        print(verification_status)

    else:
        return {"statusCode": 400,"headers": {"Content-Type": "application/json"},"body": "user not found!!"}
    
    
    
    
