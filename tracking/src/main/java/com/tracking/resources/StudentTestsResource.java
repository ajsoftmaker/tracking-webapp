package com.tracking.resources;

import java.util.List;
import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.tracking.db.StudentDAO;
import com.tracking.db.StudentTestsDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Student;
import com.tracking.entity.StudentTests;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/studenttests")
@Produces(MediaType.APPLICATION_JSON)
public class StudentTestsResource {
	private final StudentTestsDAO studentTestsDAO;
	private final StudentDAO studentDAO;
	private final Logger logger = Logger.getLogger(StudentTestsResource.class.getName());

	public StudentTestsResource(StudentTestsDAO dao ,StudentDAO studentDAO) {
		this.studentTestsDAO = dao;
		this.studentDAO = studentDAO;
	}

	@GET
	@UnitOfWork
	public Response listStudentTests(@Auth TrackingUser authUser) {
		try {
			logger.info(" In listStudentTests");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentTestsDAO.findAll())).build();
		} catch (Exception e) {
			logger.severe("Unable to Find List of Student Tests " + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable to Find List of Student Tests")).build();
		}
	}

	@POST
	@UnitOfWork
	public Response createStudentTest(@Auth TrackingUser authUser ,StudentTests studentTests) {
		try {
			logger.info(" In createStudentTest");
			StudentTests studentTests2 = studentTestsDAO.findByStudentTestID(studentTests.getStudentID(),
					studentTests.getTestID());
			if (studentTests2 != null) {
				logger.severe("This  Student Test Already Exists");
				return Response.status(Status.BAD_REQUEST)
						.entity(JsonUtils.getErrorJson("This  Student Test Already Exists")).build();
			} else {
				return Response.status(Status.OK).entity(JsonUtils.getJson(studentTestsDAO.create(studentTests)))
						.build();
			}
		} catch (Exception e) {
			logger.severe("Unable to Create Student Test " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Create Student Test"))
					.build();
		}
	}

	@GET
	@Path("/{result}")
	@UnitOfWork
	public Response getStudentTestsByResult(@Auth TrackingUser authUser, @PathParam("result") String result) {
		List<StudentTests> studentTestsList = null ;
		int getStudentTestsByResultValue = 0;
		try {
			logger.info(" In listStudentTestsByResult");
			if(authUser.getId() == 0){
				return Response.status(Status.OK).entity(JsonUtils.getSuccessJson(""+getStudentTestsByResultValue)).build();
			}
			else {
				List<Student> studentList = studentDAO.findByTenantID(authUser.getTenant_id());
				for(Student student : studentList) {
					long studentId = student.getId();
					studentTestsList = studentTestsDAO.findByResultWithStudentId(studentId, result);
					getStudentTestsByResultValue = getStudentTestsByResultValue +studentTestsList.size();
				}
			
				return Response.status(Status.OK).entity(JsonUtils.getSuccessJson(""+getStudentTestsByResultValue)).build();
			}
		} catch (Exception e) {
			logger.severe("Unable to Find Student Test By Result " + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable to Find Student Test By Result")).build();
		}
	}

	@GET
	@Path("/{testid}/test")
	@UnitOfWork
	public Response listsStudentTestsByTestId(@Auth TrackingUser authUser ,@PathParam("testid") long testid) {
		try {
			logger.info(" In listsStudentTestsByTestId");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentTestsDAO.findByTestId(testid))).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Student Test By TestID " + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable to Find Student Test By TestID")).build();
		}
	}

	@GET
	@Path("/{testid}/test/{result}")
	@UnitOfWork
	public Response listStudentTestsByResultWithTestId(@Auth TrackingUser authUser ,@PathParam("result") String result,
			@PathParam("testid") long testid) {
		try {
			logger.info(" In listStudentTestsByResultWithTestId");
			return Response.status(Status.OK)
					.entity(JsonUtils.getJson(studentTestsDAO.findByResultWithTestId(result, testid))).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Student Test By Result with TestID " + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable to Find Student Test By Result with TestID")).build();
		}
	}
}
