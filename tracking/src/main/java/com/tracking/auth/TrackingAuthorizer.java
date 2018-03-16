package com.tracking.auth;

import com.tracking.entity.TrackingUser;

import io.dropwizard.auth.Authorizer;

public class TrackingAuthorizer implements Authorizer<TrackingUser> {

    @Override
    public boolean authorize(TrackingUser user, String role) {
    	if (user.isUserInRole(role))
			return true;

		return false;
    }
}
