package com.serverless.project;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.comprehend.AmazonComprehend;
import com.amazonaws.services.comprehend.AmazonComprehendClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.comprehend.ComprehendClient;

@Configuration
public class AWSConfig {

	
		@Value("${amazon.access.key}")
		private String awsAccessKey;
		
		@Value("${amazon.access.secret-key}")
		private String awsSecretKey;
		
		@Value("${amazon.region}")
		private String awsRegion;
		
		@Value("${amazon.end-point.url}")
		private String awsDynamoDBEndPoint;
		
		@Bean
		public DynamoDBMapper mapper() {
			return new DynamoDBMapper(amazonDynamoDBConfig());
			
		}
		
		@Bean
		public AmazonDynamoDB amazonDynamoDBConfig() {
			return AmazonDynamoDBClientBuilder.standard()
					.withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(awsDynamoDBEndPoint, awsRegion))
					.withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(awsAccessKey,awsSecretKey)))
					.build();
		}
		
		@Bean
		public AmazonComprehend amazonComprehendConfig() {
			 String region =  "us-east-2";
	
			 AmazonComprehend comprehendClient =
		     AmazonComprehendClientBuilder.standard()
             .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(awsAccessKey,awsSecretKey)))
             .withRegion(region)
             .build();
		    return comprehendClient;
		}
		
}
