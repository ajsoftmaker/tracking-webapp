package com.tracking.auth;

import org.hibernate.SessionFactory;

import java.util.Optional;
import java.util.logging.Logger;

import com.tracking.entity.TrackingUser;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.Authenticator;
import io.dropwizard.auth.basic.BasicCredentials;

public class TrackingAuthenticator implements Authenticator<BasicCredentials, TrackingUser> {
	private SessionFactory factory = null;
	private final Logger logger = Logger.getLogger(TrackingAuthenticator.class.getName());

	public TrackingAuthenticator(SessionFactory factory) {
		this.factory = factory;
		
	}

	@Override
	public Optional<TrackingUser> authenticate(BasicCredentials credentials) throws AuthenticationException {

		try {
			String token = credentials.getUsername();
			TrackingUser userObj = JwtToken.decryptPayload(token);
			return Optional.of(userObj);

		} catch (Exception e) {
			logger.info("Unable to authenticate user :" + e);
		}
		return Optional.empty();
	}
}
