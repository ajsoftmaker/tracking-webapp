package com.tracking.utils;

import java.util.Properties;
import java.util.logging.Logger;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.ws.rs.WebApplicationException;

import com.google.gson.JsonObject;
import com.tracking.ApplicationContext;

public class SendMail implements Runnable {
	private final Logger logger = Logger.getLogger(SendMail.class.getName());
	private String sendTo;
	private String subject;
	private String body;

	public SendMail(JsonObject jsonObject) {
		try {
			this.sendTo = jsonObject.get("sendTo").getAsString();
			this.subject = jsonObject.get("subject").getAsString();
			this.body = jsonObject.get("body").getAsString();
		} catch (Exception e) {
			logger.severe(" Unable to send mail " + e);
			throw new IllegalArgumentException(e);
		}
	}

	@Override
	public void run() {

		String username = ApplicationContext.getInstance().getConfig().getMailUsername();
		String password = ApplicationContext.getInstance().getConfig().getMailPassword();

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});

		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(username));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(sendTo));
			message.setSubject(subject);
			message.setText(body);

			Transport.send(message);

		} catch (MessagingException e) {
			logger.severe(" Unable to send mail " + e);
			throw new WebApplicationException("Unable to send mail , Couldn't connect to host ");
		}

	}

}
