package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.tracking.db.StudentBatchesDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.StudentBatches;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/studentbatches")
@Produces(MediaType.APPLICATION_JSON)
public class StudentBatchesResource {
	private final StudentBatchesDAO studentBatchesDAO;
	private final Logger logger = Logger.getLogger(StudentBatchesResource.class.getName());

	public StudentBatchesResource(StudentBatchesDAO studentBatchesDAO) {
		this.studentBatchesDAO = studentBatchesDAO;
	}

	@GET
	@UnitOfWork
	public Response listStudentBatches(@Auth TrackingUser authUser) {
		try {
			logger.info(" In listStudentBatches");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentBatchesDAO.findAll())).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Student Batches " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Student Batches"))
					.build();
		}
	}

	@POST
	@UnitOfWork
	@Consumes("application/json")
	public Response createStudentBatche(@Auth TrackingUser authUser ,StudentBatches studentBatches) {
		try {
			logger.info(" In createStudentBatche");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentBatchesDAO.create(studentBatches)))
					.build();
		} catch (Exception e) {
			logger.severe("Unable to Create Student Batches " + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable to Create Student Batches")).build();
		}
	}

	@PUT
	@UnitOfWork
	public Response updateCourse(@Auth TrackingUser authUser ,StudentBatches studentBatches) {
		try {
			logger.info(" In updateCourse");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentBatchesDAO.update(studentBatches)))
					.build();
		} catch (Exception e) {
			logger.severe("Unable to Update Student Batches " + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable to Update Student Batches")).build();
		}
	}
}
