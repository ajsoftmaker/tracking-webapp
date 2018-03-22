package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.gson.JsonObject;
import com.tracking.db.TrackingUserDAO;
import com.tracking.db.ClientDAO;
import com.tracking.db.TenantDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Client;
import com.tracking.entity.Tenant;
import com.tracking.utils.JsonUtils;
import com.tracking.utils.MailUtils;
import com.tracking.utils.SendMail;
import com.tracking.utils.Utils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/clients")
@Produces(MediaType.APPLICATION_JSON)
public class ClientResource {
	
	private final ClientDAO clientDAO;
	private final Logger logger = Logger.getLogger(ClientResource.class.getName());

	public ClientResource(ClientDAO clientDAO) {
		this.clientDAO = clientDAO;
	}

}
