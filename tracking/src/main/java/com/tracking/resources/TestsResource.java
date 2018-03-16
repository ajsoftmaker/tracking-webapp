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
import com.tracking.db.TestDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Test;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/tests")
@Produces(MediaType.APPLICATION_JSON)
public class TestsResource {
	private final TestDAO testDAO;
	private final Logger logger = Logger.getLogger(TestsResource.class.getName());

	public TestsResource(TestDAO dao) {
		this.testDAO = dao;
	}

	@GET
	@UnitOfWork
	public Response listTests(@Auth TrackingUser authUser) {
		try {
			logger.info(" In listTests");
			return Response.status(Status.OK).entity(JsonUtils.getJson(testDAO.findAll())).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Tests " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Tests")).build();
		}
	}

	@POST
	@UnitOfWork
	public Response createTest(@Auth TrackingUser authUser ,Test test) {
		try {
			logger.info(" In createTest");
			return Response.status(Status.OK).entity(JsonUtils.getJson(testDAO.create(test))).build();
		} catch (Exception e) {
			logger.severe("Unable to Create Test " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Create Test")).build();
		}
	}

	@PUT
	@UnitOfWork
	public Response updateTest(@Auth TrackingUser authUser ,Test test) {
		try {
			logger.info(" In updateTest");
			return Response.status(Status.OK).entity(JsonUtils.getJson(testDAO.update(test))).build();
		} catch (Exception e) {
			logger.severe("Unable to Update Test " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Update Test")).build();
		}
	}

}
