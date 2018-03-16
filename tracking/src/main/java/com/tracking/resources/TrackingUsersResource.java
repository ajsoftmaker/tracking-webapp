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

import io.dropwizard.hibernate.UnitOfWork;

@Path("/labjumpusers")
public class TrackingUsersResource {
	private final Logger logger = Logger.getLogger(TrackingUsersResource.class.getName());
	private final TrackingUserDAO userDAO;
	private final TenantDAO tenantDAO;
	private final StudentDAO studentDAO;

	public TrackingUsersResource(TrackingUserDAO userDAO, TenantDAO tenantDAO, StudentDAO studentDAO) {

		this.userDAO = userDAO;
		this.tenantDAO = tenantDAO;
		this.studentDAO = studentDAO;

	}

	@POST
	@Path("activate")
	@UnitOfWork
	public Response activateUser(TrackingUser user) {
		TrackingUser userObj;
		Tenant tenantObj;
		Student studentObj;
		try {
			userObj = userDAO.findByEmailWithRole(user.getEmail(), user.getUserRole());
			if (userObj == null) {
				logger.severe("User Not Present. Please Register");
				return Response.status(Status.BAD_REQUEST)
						.entity(JsonUtils.getErrorJson("User Not Present. Please Register")).build();
			} else {
				userObj.setPassword(user.getPassword());
				if (userObj.getStatus().equals("0")) {
					userObj.setStatus("1");
					if (userObj.getUserRole().equals(TrackingUser.TENANTADMIN)) {
						tenantObj = tenantDAO.findByEmail(user.getEmail());
						if (tenantObj != null) {
							tenantObj.setTenantStatus("1");
							tenantDAO.update(tenantObj);
							userDAO.update(userObj);
							logger.info("Passowrd Reset Successfully : TENANTADMIN");
							return Response.status(Status.OK)
									.entity(JsonUtils.getSuccessJson("Passowrd Reset Successfully")).build();

						}
					} else if (userObj.getUserRole().equals(TrackingUser.STUDENT)) {
						studentObj = studentDAO.findByEmail(user.getEmail());
						if (studentObj != null) {
							studentObj.setStudentStatus("1");
							studentDAO.update(studentObj);
							userDAO.update(userObj);
							logger.info("Passowrd Reset Successfully : STUDENT");
							return Response.status(Status.OK)
									.entity(JsonUtils.getSuccessJson("Passowrd Reset Successfully")).build();
						}
					}
				} else {
					logger.warning("User Already Activated");
					return Response.status(Status.FOUND).entity(JsonUtils.getErrorJson("User Already Activated"))
							.build();
				}
			}
		} catch (Exception e) {
			logger.severe("Unable To Activate User :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Activate User"))
					.build();

		}
		return null;
	}

	@POST
	@Path("email/{email}")
	@UnitOfWork
	public Response getEmail(@PathParam("email") String email) {
		TrackingUser userObj;
		String userEmail = Utils.decodeBase64(email).split("_")[0];
		String role = Utils.decodeBase64(email).split("_")[2];
		try {
			userObj = userDAO.findByEmailWithRole(userEmail, role);
			if (userObj != null) {
				if (userObj.getStatus().equals("1")) {
					return Response.status(Status.FOUND).entity(JsonUtils.getErrorJson("User is Already Registered"))
							.build();
				} else {
					return Response.status(Status.OK).entity(JsonUtils.getJson(userObj)).build();
				}

			} else {
				return Response.status(Status.BAD_REQUEST)
						.entity(JsonUtils.getErrorJson("User Not Present. Please Register")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable To Get Email :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get Email")).build();
		}

	}

	@GET
	@Path("forgotpassword/{email}/{role}")
	@UnitOfWork
	public Response forgotPassword(@PathParam("email") String email, @PathParam("role") String role) {

		try {
			TrackingUser userObj = userDAO.findByEmailWithRole(email, role);
			if (userObj != null) {
				Tenant tenantObject = tenantDAO.findByEmail(email);
				Student studentObject = studentDAO.findByEmail(email);
				if (tenantObject == null && studentObject == null) {

					return Response.status(Status.BAD_REQUEST)
							.entity(JsonUtils.getErrorJson("User Not Present. Please Register")).build();
				} else {
					if (tenantObject != null) {

						if (tenantObject.getTenantStatus().equals("1")) {
							JsonObject jsonObject = MailUtils.getForgotPasswordMail(email, userObj.getLoginID(), role);
							Thread t = new Thread(new SendMail(jsonObject));
							t.start();
							return Response.ok().build();
						} else {
							return Response.status(Status.BAD_REQUEST)
									.entity(JsonUtils
											.getErrorJson("Account is Not Activated. Please Activate Your Account"))
									.build();
						}

					} else  {

						if (studentObject.getStudentStatus().equals("1")) {

							JsonObject jsonObject = MailUtils.getForgotPasswordMail(email, userObj.getLoginID(), role);
							Thread t = new Thread(new SendMail(jsonObject));
							t.start();
							return Response.ok().build();
						} else {
							return Response.status(Status.BAD_REQUEST)
									.entity(JsonUtils
											.getErrorJson("Account is Not Activated. Please Activate Your Account"))
									.build();
						}
					} 

				}
			}
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("User Not Present. Please Register")).build();
		} catch (Exception e) {
			logger.severe("Forgot Password:" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(e.getMessage())).build();
		}

	}

	@GET
	@Path("email/{email}")
	@UnitOfWork
	public Response findEmail(@PathParam("email") String email) {
		List<TrackingUser> userObjList;
		try {
			userObjList = userDAO.findByEmail(email);
			if (userObjList.size() != 0) {
				return Response.status(Status.OK).entity(JsonUtils.getJson(userObjList)).build();

			} else {
				logger.severe("Unable To Find Email");
				return Response.status(Status.BAD_REQUEST)
						.entity(JsonUtils.getErrorJson("User Not Present. Please Register")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable To Find Email:" + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable To Find Email, Kindly Enter Valid Email")).build();
		}

	}

	@POST
	@Path("updatepassword")
	@UnitOfWork
	public Response updatePassword(TrackingUser user) {

		try {
			List<TrackingUser> userObjList = userDAO.findByEmail(user.getEmail());
			for (TrackingUser userObj : userObjList) {

				if (userObj != null) {
					userObj.setPassword(user.getPassword());
					userDAO.update(userObj);

				} else {
					return Response.status(Status.BAD_REQUEST)
							.entity(JsonUtils.getErrorJson("User Not Present. Please Register")).build();
				}
			}

			return Response.ok(JsonUtils.getSuccessJson("Successfully Updated")).build();
		} catch (Exception e) {
			logger.severe("Unable To Update Password :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Update Password"))
					.build();
		}
	}

	@POST
	@Path("updatepassword/{email}")
	@UnitOfWork
	@Produces(MediaType.APPLICATION_JSON)
	public Response getEmailForUpdatePassword(@PathParam("email") String email) {

		String userEmail = Utils.decodeBase64(email).split("_")[0];
		String role = Utils.decodeBase64(email).split("_")[2];
		try {
			if (userEmail != null) {

				JsonObject object = new JsonObject();
				object.addProperty("userEmail", userEmail);
				object.addProperty("role", role);
				logger.info(" Email Decoded Properly ");
				return Response.status(Status.OK).entity(object.toString()).build();
			} else {
				logger.severe(" Email Not Decoded Properly");
				return Response.status(Status.BAD_REQUEST)
						.entity(JsonUtils.getErrorJson(" Email Not Decoded Properly")).build();
			}

		} catch (Exception e) {
			logger.severe(" Email Not Decoded Properly" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(e.getMessage())).build();
		}
	}

	@GET
	@Path("/{loginId}/{password}")
	@UnitOfWork
	public Response findByLoginId(@PathParam("loginId") String loginId, @PathParam("password") String password) {
		List<TrackingUser> userObjList;
		try {
			userObjList = userDAO.findUserByLoginIdAndPassword(loginId, password);
			if (userObjList.size() != 0) {
				return Response.status(Status.OK).entity(JsonUtils.getJson(userObjList)).build();

			} else {
				return Response.status(Status.BAD_REQUEST)
						.entity(JsonUtils.getErrorJson("User Name / Password is Not Valid")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable To Find By Login Id. " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(e.getMessage())).build();
		}

	}

}
