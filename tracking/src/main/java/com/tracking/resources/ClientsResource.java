package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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
public class ClientsResource {
	private final TenantDAO tenantDAO;
	private final TrackingUserDAO userDAO;
	
	private final ClientDAO clientDAO;
	private final Logger logger = Logger.getLogger(ClientsResource.class.getName());

	public ClientsResource(TenantDAO dao, TrackingUserDAO userDAO, ClientDAO clientDAO) {
		this.tenantDAO = dao;
		this.userDAO = userDAO;

		this.clientDAO = clientDAO;
	}

	@GET
	@UnitOfWork
	public Response listClients(@Auth TrackingUser authUser) {
		try {
			logger.info(" In listClients");
			return Response.status(Status.OK).entity(JsonUtils.getJson(clientDAO.findAll())).build();
		} catch (Exception e) {
			logger.severe("Unable to Find List of Clients " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find List of Clients"))
					.build();
		}
	}

	@POST
	@UnitOfWork
	public Response createClient(@Auth TrackingUser auth, Client client) {
		Response response = null;
		TrackingUser userObj;
		try {
			logger.info(" In createClient");
			return Response.status(Status.OK).entity(JsonUtils.getJson(clientDAO.create(client))).build();

		} catch (Exception e) {
			logger.severe("Unable to Create Client " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Create Client"))
					.build();
		}
	}
}
