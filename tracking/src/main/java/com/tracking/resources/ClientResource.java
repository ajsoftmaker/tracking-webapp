package com.tracking.resources;

import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.tracking.db.ClientDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/client")
@Produces(MediaType.APPLICATION_JSON)
public class ClientResource {
	
	private final ClientDAO clientDAO;
	private final Logger logger = Logger.getLogger(ClientResource.class.getName());

	public ClientResource(ClientDAO clientDAO) {
		this.clientDAO = clientDAO;
	}
	
	@GET
	@UnitOfWork
	@Path("/{clientid}")
	@Consumes("application/json")
	public Response findClient(@Auth TrackingUser authUser, @PathParam("clientid") long clientid) {
		try {
			logger.info(" In findTenant");
			if(authUser != null) {
				return Response.status(Status.OK).entity(JsonUtils.getJson(clientDAO.findById(clientid))).build();
			} else {
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Authorization Failed")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable to Find Tenant " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Tenant")).build();
		}
	}
	
	@GET
	@UnitOfWork
	@Path("/email/{email}")
	public Response findByEmail(@Auth TrackingUser authUser ,@PathParam("email") String email) {
		try {
			logger.info(" In find By Email");
			return Response.status(Status.OK).entity(JsonUtils.getJson(clientDAO.findByEmail(email))).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Student By Email " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Client By Email"))
					.build();
		}
	}

}
