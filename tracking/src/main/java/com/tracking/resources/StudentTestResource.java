package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.tracking.db.StudentTestsDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.StudentTests;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/studenttest/{studentid}")
@Produces(MediaType.APPLICATION_JSON)
public class StudentTestResource {
	private final StudentTestsDAO studentTestsDAO;
	private final Logger logger = Logger.getLogger(StudentTestResource.class.getName());

	public StudentTestResource(StudentTestsDAO dao) {
		this.studentTestsDAO = dao;
	}

	@GET
	@UnitOfWork
	public Response listStudentTestsByStudentId(@Auth TrackingUser authUser ,@PathParam("studentid") long studentid) {
		try {
			logger.info(" In listStudentTestsByStudentId");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentTestsDAO.findByStudentId(studentid)))
					.build();
		} catch (Exception e) {
			logger.severe("Unable to Find Student Tests By StudentId " + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable to Find Student Tests By StudentId")).build();
		}
	}

	@PUT
	@UnitOfWork
	@Path("/{testid}/{results}")
	public Response updateStudentTest(@Auth TrackingUser authUser ,@PathParam("testid") long testid, @PathParam("studentid") long studentid,
			StudentTests studentTests, @PathParam("results") String results) {
		try {
			logger.info(" In updateStudentTest");
			StudentTests studentTestsObj = studentTestsDAO.findByStudentTestID(studentTests.getStudentID(),
					studentTests.getTestID());
			studentTestsObj.setStatus("Taken");
			studentTestsObj.setResults(results);
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentTestsDAO.update(studentTestsObj)))
					.build();
		} catch (Exception e) {
			logger.severe("Unable to Update Student Test " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Update Student Test"))
					.build();
		}
	}
}
