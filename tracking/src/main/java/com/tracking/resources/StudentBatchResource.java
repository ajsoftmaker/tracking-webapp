package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.tracking.db.StudentBatchesDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/studentbatch/{batchId}")
@Produces(MediaType.APPLICATION_JSON)
public class StudentBatchResource {
	private final StudentBatchesDAO studentBatchesDAO;
	private final Logger logger = Logger.getLogger(StudentBatchResource.class.getName());

	public StudentBatchResource(StudentBatchesDAO studentBatchesDAO) {
		this.studentBatchesDAO = studentBatchesDAO;
	}

	@GET
	@UnitOfWork
	public Response listStudentBatches(@Auth TrackingUser authUser ,@PathParam("batchId") long batchId) {
		try {
			logger.info(" In listStudentBatches");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentBatchesDAO.findAllByBatchID(batchId)))
					.build();
		} catch (Exception e) {
			logger.severe("Unable to Find Student Batch " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Student Batch"))
					.build();
		}
	}

	@GET
	@UnitOfWork
	@Path("/student")
	public Response listStudentBatch(@Auth TrackingUser authUser ,@PathParam("batchId") String studentId) {
		try {
			logger.info(" In listStudentBatch");
			String str[] = studentId.split("/");
			return Response.status(Status.OK)
					.entity(JsonUtils.getJson(studentBatchesDAO.findAllByStudentID(Long.parseLong(str[0])))).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Student Batch " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Student Batch"))
					.build();
		}
	}

	@GET
	@UnitOfWork
	@Path("/{studentID}")
	public Response getSpecificStudentBatch(@Auth TrackingUser authUser ,@PathParam("batchId") long batchID,
			@PathParam("studentID") long studentID) {
		try {
			logger.info(" In getSpecificStudentBatch");
			return Response.status(Status.OK)
					.entity(JsonUtils.getJson(studentBatchesDAO.getByBatchIDStudentID(batchID, studentID))).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Specific Student Batch " + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable to Find Specific Student Batch")).build();
		}
	}
}
