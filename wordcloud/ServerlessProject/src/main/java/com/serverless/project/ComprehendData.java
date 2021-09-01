package com.serverless.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.amazonaws.services.comprehend.AmazonComprehend;
import com.amazonaws.services.comprehend.model.DetectKeyPhrasesRequest;
import com.amazonaws.services.comprehend.model.DetectKeyPhrasesResult;
import com.amazonaws.services.comprehend.model.KeyPhrase;



@Component
public class ComprehendData {

	@Autowired
	public AmazonComprehend comprehendClient;
	
	public String sendData(String text) {

        System.out.println("Calling DetectKeyPhrases");
        DetectKeyPhrasesRequest detectKeyPhrasesRequest = new DetectKeyPhrasesRequest().withText(text)
                                                                                       .withLanguageCode("en");
        DetectKeyPhrasesResult detectKeyPhrasesResult = comprehendClient.detectKeyPhrases(detectKeyPhrasesRequest);
    //    detectKeyPhrasesResult.getKeyPhrases().forEach(System.out::println);
        
     //   detectKeyPhrasesResult.getKeyPhrases().get(0)); 
        
        String finalFeedback = "";
        
        for(KeyPhrase var: detectKeyPhrasesResult.getKeyPhrases()) {
        	System.out.println(var);
        	 finalFeedback = finalFeedback + var.getText() + " ";
        }
        
        
        System.out.println(finalFeedback );
        System.out.println("End of DetectKeyPhrases\n");
        
        return finalFeedback;
        
        
        
		
	}

}
