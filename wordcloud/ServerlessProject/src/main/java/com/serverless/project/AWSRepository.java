package com.serverless.project;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedScanList;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;

@Repository
public class AWSRepository {
	
	@Autowired
	public DynamoDBMapper mapper;
	
	@Autowired
	public AmazonDynamoDB client;

	
	ScanRequest scanRequest = new ScanRequest().withTableName("CustomerFeedback");

	public void insert(FeedbackModel feedback) {
	
		mapper.save(feedback);
	}
	

	public String retrieve() {
		ScanResult result = client.scan(scanRequest);
		String str = "";
		for (Map<String, AttributeValue> item : result.getItems()){
		    System.out.println(item);
		    
		    str = str + item.get("feedback").toString();
		    
		}
		
		System.out.println("Final :" + str);
		
		return str;
	
	}
	


}
