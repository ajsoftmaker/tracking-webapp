package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.google.gson.JsonObject;
import com.tracking.db.TrackingUserDAO;
import com.tracking.db.StudentDAO;
import com.tracking.db.TenantDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Student;
import com.tracking.entity.Tenant;
import com.tracking.utils.JsonUtils;
import com.tracking.utils.MailUtils;
import com.tracking.utils.SendMail;
import com.tracking.utils.Utils;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/students")
@Produces(MediaType.APPLICATION_JSON)
public class StudentsResource {
	private final StudentDAO studentDAO;
	private final TenantDAO tenantDAO;
	private final TrackingUserDAO userDAO;
	private final Logger logger = Logger.getLogger(StudentsResource.class.getName());

	public StudentsResource(StudentDAO studentDAO, TenantDAO tenantDAO, TrackingUserDAO userDAO) {
		this.studentDAO = studentDAO;
		this.tenantDAO = tenantDAO;
		this.userDAO = userDAO;
	}

	@GET
	@UnitOfWork
	public Response listStudents(@Auth TrackingUser auth ) {
		try {
				logger.info(" In listStudents");
				if(auth.getId()== 0) {
					return Response.status(Status.OK).entity(JsonUtils.getJson(studentDAO.findAll())).build();
				}else {
					return Response.status(Status.OK).entity(JsonUtils.getJson(studentDAO.findByTenantID(auth.getTenant_id()))).build();
				}
		} catch (Exception e) {
			logger.severe("Unable to Find Students " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Students"))
					.build();
		}
	}
	
	@GET
	@Path("/all")
	@UnitOfWork
	public Response listAllStudents(@Auth TrackingUser auth ) {
		try {
				logger.info(" In listStudents");
				return Response.status(Status.OK).entity(JsonUtils.getJson(studentDAO.findAll())).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Students " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Students"))
					.build();
		}
	}

	@POST
	@UnitOfWork
	public Response createStudent(@Auth TrackingUser auth ,Student student) {
		Response response = null;
		TrackingUser userObj;
		try {
			logger.info(" In createStudent");
			userObj = userDAO.findByEmailWithRole(student.geteMail(), TrackingUser.STUDENT);
			if (userObj == null) {
				Student studentObject = studentDAO.findByEmail(student.geteMail());
				if (studentObject == null) {
					student.setStudentStatus("1");
					response = studentDAO.create(student);
					Student studentExistObject = studentDAO.findByStudentID(student.getStudentID());
					if (response.getStatus() == 200 && studentExistObject !=null) {
						String email = studentExistObject.geteMail();
						Long tenantId = studentExistObject.getTenantID();
						String loginId = email;
						TrackingUser labJumpUser = new TrackingUser();
						labJumpUser.setLoginID(loginId);
						labJumpUser.setUserRole(TrackingUser.STUDENT);
						labJumpUser.setTenant_id(tenantId);
						labJumpUser.setEmail(email);
						Tenant tenantObj = tenantDAO.findByEmail(email);
						if (tenantObj != null) {
							TrackingUser existingTenant = userDAO.findByEmailWithRole(email, TrackingUser.TENANTADMIN);
							labJumpUser.setPassword(existingTenant.getPassword());
							labJumpUser.setStatus("1");
							userDAO.create(labJumpUser);
							return Response.status(Status.OK)
									.entity(JsonUtils.getSuccessJson("Student Added Sucessfully")).build();
						}
						labJumpUser.setStatus("0");
						labJumpUser.setPassword(Utils.encodeBase64("admin"));
						try {
							JsonObject jsonObj = MailUtils.getActivationMail(email, loginId, TrackingUser.STUDENT);
							Thread t = new Thread(new SendMail(jsonObj));
							t.start();
							userDAO.create(labJumpUser);
							return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Student Added Sucessfully"))
								.build();
						}catch(Exception e) {
							logger.info("Failed To Create Student : "+e);
							return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(e.getMessage()))
									.build();
						}
					} else {
						logger.severe(" Student ID Already Exists");
						return Response.status(Status.BAD_REQUEST)
								.entity(JsonUtils.getErrorJson("Student ID Already Exists")).build();
					}
				} else {
					logger.severe("User is Already Registered");
					return Response.status(Status.BAD_REQUEST)
							.entity(JsonUtils.getErrorJson("User is Already Registered")).build();
				}
			} else {
				logger.severe("Email already Registered. Use different Email ID");
				return Response.status(Status.BAD_REQUEST)
						.entity(JsonUtils.getErrorJson("Email already Registered. Use different Email ID")).build();
			}

		} catch (Exception e) {
			logger.severe(" Unable to Create Student " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Create Student"))
					.build();
		}
	}
}
