package com.tracking.resources;

import java.util.logging.Logger;

import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.tracking.db.GuacDProfileDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/guacprofile/{id}")
@Produces(MediaType.APPLICATION_JSON)
public class GuacDProfileResource {
	private final Logger logger = Logger.getLogger(GuacDProfileResource.class.getName());
	private final GuacDProfileDAO guacDProfileDAO;
	
	public GuacDProfileResource(GuacDProfileDAO dao) {
		this.guacDProfileDAO = dao;
	}
	
	@DELETE
	@UnitOfWork
	public Response deleteGuacDProfile(@Auth TrackingUser authUser ,@PathParam("id") long id) {
		try {
			guacDProfileDAO.delete(id);
			logger.info("Guacamole Profile Deleted Successfully");
			return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Guacamole Profile Deleted Successfully")).build();
		} catch(Exception e) {
			logger.severe("Unable To Delete Guacamole profile" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Delete Guacamole profile")).build();
		}
	}
}
	
