# Code Reference:
# https://www.analyticsvidhya.com/blog/2020/07/read-and-update-google-spreadsheets-with-python/

import boto3
import gspread
from oauth2client.service_account import ServiceAccountCredentials

def getOrders():
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table('orders')
    resp = table.scan()
    orders = []
        for i in resp['Items']:
            order={
                "order_id": i['orderid'],
                "user_id": i['userid'],
                "food_item": i['foodid'],
                "price": i['price'],
                "ordered_at": i['createdat'],
            }
            orders.append(order)
    return orders

#define scope
scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']

# add credentials to the account
creds = ServiceAccountCredentials.from_json_keyfile_name('credentials.json', scope)

# authorize the client
client = gspread.authorize(creds)

#open sheet
sheet = client.open('HalifaxFoodie')
sheet_instance = sheet.get_worksheet(0)

#get data
orders = getOrders()

#add data
sheet_instance.insert_rows(orders)