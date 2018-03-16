package com.tracking.utils;

import com.google.gson.JsonObject;
import com.tracking.ApplicationContext;

public class MailUtils {

	public static JsonObject getActivationMail(String email , String loginId , String role) {
		String url = ApplicationContext.getInstance().getConfig().getDomainurl();
		String strEncoded = Utils.encodeBase64(email + "_" + System.currentTimeMillis() +"_" + role);
		String mailHeader = ApplicationContext.getInstance().getConfig().getMailHeader();
		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("sendTo", email);
		jsonObject.addProperty("subject", "["+ mailHeader +"] Verify your email address");

		String emailBody = "Hi, " + "We want to verify that you are indeed '" + email
				+ "'. Verifying this address will "
				+ "make your account active. If you wish to continue, please follow the link below : \n\n" + url
				+ "/#/activate/" + strEncoded
				+"\n\n Your Login ID : " + loginId
				+"\n Kindly use this Login ID for login "
				+ "\n\n If you did not request verification, you can ignore this email.";
		jsonObject.addProperty("body", emailBody);

		return jsonObject;
	}

	public static JsonObject getForgotPasswordMail(String email , String loginId , String role) {
		String url = ApplicationContext.getInstance().getConfig().getDomainurl();
		String strEncoded = Utils.encodeBase64(email + "_" + System.currentTimeMillis()+"_"+role);
		String mailHeader = ApplicationContext.getInstance().getConfig().getMailHeader();

		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("sendTo", email);
		jsonObject.addProperty("subject",  "["+ mailHeader +"] Forgot password ?");

		String emailBody = "Hi, " + "Click the link below to reset your password : \n\n" + url
				+ "/#/resetpassword/" + strEncoded
				+"\n\n Your Login ID : " + loginId
				+ "\n\n If you did not request password change, you can ignore this email.";
		jsonObject.addProperty("body", emailBody);

		return jsonObject;
	}
	
	public static JsonObject getNotificationMail(String email , String value ) {
		JsonObject jsonObject = new JsonObject();
		jsonObject.addProperty("sendTo", email);
		String mailHeader = ApplicationContext.getInstance().getConfig().getMailHeader();
		jsonObject.addProperty("subject",  "["+ mailHeader +"] Notification email");
		String emailBody = "Hi, "+ value;
		jsonObject.addProperty("body", emailBody);
		
		return jsonObject;
	}
}
