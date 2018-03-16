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
import com.tracking.db.TrackingUserDAO;
import com.tracking.db.StudentDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Student;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/student/{studentid}")
@Produces(MediaType.APPLICATION_JSON)
public class StudentResource {
	private final StudentDAO studentDAO;
	private final TrackingUserDAO userDAO;
	private final Logger logger = Logger.getLogger(StudentResource.class.getName());

	public StudentResource(StudentDAO studentDAO, TrackingUserDAO userDAO) {
		this.studentDAO = studentDAO;
		this.userDAO = userDAO;
	}

	@GET
	@UnitOfWork
	public Response findStudent(@Auth TrackingUser authUser ,@PathParam("studentid") String studentid) {
		try {
			logger.info(" In FindStudent");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentDAO.findByStudentID(studentid))).build();
		} catch (Exception e) {
			logger.severe("Unable To Find Student " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Student")).build();
		}
	}

	@GET
	@UnitOfWork
	@Path("/id")
	public Response findByID(@Auth TrackingUser authUser ,@PathParam("studentid") long studentid) {
		try {
			logger.info(" In findByID");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentDAO.findByID(studentid))).build();
		} catch (Exception e) {
			logger.severe("Unable To Find Student By Id " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Student By Id"))
					.build();
		}
	}

	@GET
	@UnitOfWork
	@Path("/email")
	public Response findByEmail(@Auth TrackingUser authUser ,@PathParam("studentid") String email) {
		try {
			logger.info(" In findByEmail");
			return Response.status(Status.OK).entity(JsonUtils.getJson(studentDAO.findByEmail(email))).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Student By Email " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Student By Email"))
					.build();
		}
	}

	@PUT
	@UnitOfWork
	public Response updateStudent(@Auth TrackingUser authUser ,Student student) {
		try {
			logger.info(" In updateStudent");
			TrackingUser userObj = userDAO.findByEmailWithRole(student.geteMail(), TrackingUser.STUDENT);
			if (!student.getStudentStatus().equals("0") || !userObj.getStatus().equals(student.getStudentStatus())) {
				studentDAO.update(student);
				userObj.setStatus(student.getStudentStatus());
				userDAO.update(userObj);
				return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Student Updated Successfully"))
							.build();
			} else {
				logger.severe("Student not updated since account is disabled");
				return Response.status(Status.BAD_REQUEST)
						.entity(JsonUtils.getErrorJson("Student not updated since account is disabled")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable to Update Student " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Update Student"))
					.build();
		}
	}
}
