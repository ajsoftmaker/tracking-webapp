package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.tracking.db.TestDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/test/{courseID}")
@Produces(MediaType.APPLICATION_JSON)
public class TestResource {
	private final TestDAO testDAO;
	private final Logger logger = Logger.getLogger(TestResource.class.getName());

	public TestResource(TestDAO dao) {
		this.testDAO = dao;
	}

	@GET
	@UnitOfWork
	public Response listTestsByCourseID(@Auth TrackingUser authUser ,@PathParam("courseID") long courseID) {
		try {
			logger.info(" In listTestsByCourseID");
			return Response.status(Status.OK).entity(JsonUtils.getJson(testDAO.findAllByCourseID(courseID))).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Tests By CourseID " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Tests By CourseID")).build();
		}
	}

	@DELETE
	@UnitOfWork
	public Response deleteTest(@Auth TrackingUser authUser ,@PathParam("courseID") long id) {
		try {
			logger.info(" In deleteTest");
			testDAO.delete(id);
			return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Test Deleted Successfully")).build();
		} catch (Exception e) {
			logger.severe("Unable to Delete Test " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Delete Test")).build();
		}
	}

}
