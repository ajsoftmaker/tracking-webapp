package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.tracking.db.GuacDProfileDAO;
import com.tracking.entity.GuacDProflie;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/guacprofiles")
@Produces(MediaType.APPLICATION_JSON)
public class GuacDProfilesResource {
	private final Logger logger = Logger.getLogger(GuacDProfilesResource.class.getName());
	private final GuacDProfileDAO guacDProfileDAO;

	public GuacDProfilesResource(GuacDProfileDAO dao) {
		this.guacDProfileDAO = dao;
	}

	@GET
	@UnitOfWork
	public Response getGuacDProfileList(@Auth TrackingUser authUser) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(guacDProfileDAO.findAll())).build();
		} catch (Exception e) {
			logger.severe("Unable To Get GuacDProfile :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get GuacDProfile"))
					.build();
		}
	}

	@POST
	@UnitOfWork
	public Response createGuacDProfile(@Auth TrackingUser authUser ,GuacDProflie guacDProfile) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(guacDProfileDAO.create(guacDProfile))).build();
		} catch (Exception e) {
			logger.severe("Unable To Create GuacDProfile :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Create GuacDProfile")).build();
		}
	}

}
