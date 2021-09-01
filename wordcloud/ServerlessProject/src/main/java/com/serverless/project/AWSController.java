package com.serverless.project;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/Feedback")
public class AWSController {
	
	@Autowired
	private AWSRepository dao;
	
	@Autowired
	private ComprehendData comdata;
	
	@PostMapping("/SubmitReviews")
	public String insertIntoDB(@RequestBody HashMap<String,String> feedback) {
		
		FeedbackModel fb = new FeedbackModel();
		fb.setFoodItemName(feedback.get("FoodItemName"));
		fb.setFeedback(feedback.get("Feedback"));
		fb.setResturantName(feedback.get("ResturantName"));
		
		dao.insert(fb);
		return "Successful operation";
	}
	
	 @GetMapping("/GetWordCloudData")
	  public String retrieveFromDB() {
	    String feedbackFromDB = dao.retrieve();
	    String feedback = comdata.sendData(feedbackFromDB);
	    return feedback;
	  }
	

}
