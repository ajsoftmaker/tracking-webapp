package com.tracking.resources;

import java.io.InputStream;
import java.util.Base64;
import java.util.List;
import java.util.logging.Logger;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import com.tracking.db.TrackingUserDAO;
import com.tracking.db.StudentDAO;
import com.tracking.db.TenantDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Student;
import com.tracking.entity.Tenant;
import com.tracking.utils.JsonUtils;
import com.tracking.utils.Utils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/tenant/{tenantid}")
@Produces(MediaType.APPLICATION_JSON)
public class TenantResource {
	private final TenantDAO tenantDAO;
	private final TrackingUserDAO userDAO;
	private final StudentDAO studentDAO;
	private final Logger logger = Logger.getLogger(TenantResource.class.getName());

	public TenantResource(TenantDAO dao, TrackingUserDAO userDAO, StudentDAO studentDAO) {
		this.tenantDAO = dao;
		this.userDAO = userDAO;
		this.studentDAO = studentDAO;
	}

	@GET
	@UnitOfWork
	public Response findTenant(@Auth TrackingUser authUser, @PathParam("tenantid") long tenantid) {
		try {
			logger.info(" In findTenant");
			if(authUser != null) {
				return Response.status(Status.OK).entity(JsonUtils.getJson(tenantDAO.findById(tenantid))).build();
			} else {
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Authorization Failed")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable to Find Tenant " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Tenant")).build();
		}
	}

	@DELETE
	@UnitOfWork
	public Response deleteTenant(@Auth TrackingUser authUser , @PathParam("tenantid") long tenantid) {
		try {
			logger.info(" In deleteTenant");
			if(authUser .getId() == 0) {
				tenantDAO.delete(tenantid);
				return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Tenant Deleted Successfully")).build();
			}else {
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Authorization Failed")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable to Delete Tenant " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Delete Tenant"))
					.build();
		}
	}

	@PUT
	@UnitOfWork
	public Response updateTenant(@Auth TrackingUser authUser , Tenant tenant) {
		try {
			logger.info(" In updateTenant");
			if(authUser.getId() == 0) {
				TrackingUser userObj = userDAO.findByEmailWithRole(tenant.getPrimaryEmail(), TrackingUser.TENANTADMIN);
			// if there is change in the status (enabled/disabled)
					if (tenant.getTenantStatus() != userObj.getStatus()) {
						tenantDAO.update(tenant);
				// change the login status in labjumpusers for this tenant admin
						userObj.setStatus(tenant.getTenantStatus());
						userDAO.update(userObj);
				// also change status of all the students for this tenant
						List<TrackingUser> listOfStudents = userDAO.findStudentsByTenantID(tenant.getId());
						for (int i = 0; i < listOfStudents.size(); i++) {
					// first update the labjumpuser entry for this student
							TrackingUser user = listOfStudents.get(i);
							user.setStatus(tenant.getTenantStatus());
							userDAO.update(user);
					// now update the student's entry in the students table
							Student student = studentDAO.findByEmail(user.getEmail());
							student.setStudentStatus(tenant.getTenantStatus());
							studentDAO.update(student);
						}
						return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Tenant updated successfully"))
						.build();
					} else {
						logger.severe("Unable to Update Tenant");
						return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Update Tenant"))
						.build();
					}
			} else {
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Authorization Failed")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable to Update Tenant " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Update Tenant"))
					.build();
		}
	}

	@POST
	@Path("/logo")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@UnitOfWork
	@Produces(MediaType.APPLICATION_JSON)
	public Response addLogo(@Auth TrackingUser authUser ,@PathParam("tenantid") long tenantid, @FormDataParam("logofile") InputStream is,
			@FormDataParam("logofile") FormDataContentDisposition fileDetail) {
		try {
			logger.info(" In addLogo");
			if(authUser != null) {
				if (fileDetail.getFileName() != null) {
					Tenant tenantObj = null;
					byte[] imageByteValue = IOUtils.toByteArray(is);
					tenantObj = tenantDAO.findById(tenantid);
					tenantObj.setTenantLogo(imageByteValue);
					return Response.status(Status.OK).entity(JsonUtils.getJson(tenantDAO.update(tenantObj))).build();
				} else {
					logger.severe("Unable to Add Logo");
					return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Add Logo")).build();
				}
			} else {
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Authorization Failed , Unable to Add Logo")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable to Add Logo " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Add Logo")).build();
		}
	}

	@GET
	@Path("/logo")
	@UnitOfWork
	public Response getLogo(@Auth TrackingUser authUser ,@PathParam("tenantid") long tenantid) {
		try {
			logger.info(" In getLogo");
			if(authUser != null) {
				Tenant tenantObj = null;
				tenantObj = tenantDAO.findById(tenantid);
				byte[] imageByteValue = tenantObj.getTenantLogo();
				if (imageByteValue == null) {
					return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Set Default Logo")).build();
				}
				String image = new String(Base64.getEncoder().encode(imageByteValue));
				return Response.status(Status.ACCEPTED).entity(JsonUtils.getSuccessJson(image)).build();
			} else {
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Authorization Failed , Unable To Get Logo")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable to get Logo " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get Logo")).build();
		}
	}

	@PUT
	@Path("/reset")
	@UnitOfWork
	public Response resetTenant(@Auth TrackingUser authUser ,@PathParam("tenantid") long tenantid) {
		try {
			logger.info(" In resetTenant");
			if(authUser.getId() == 0) {
				Tenant tenantObj = tenantDAO.findById(tenantid);
				List<TrackingUser> labjumpUserList = userDAO.findByEmail(tenantObj.getPrimaryEmail());
				for (TrackingUser labJumpUser : labjumpUserList) {
					labJumpUser.setPassword(Utils.encodeBase64("admin"));
					userDAO.update(labJumpUser);
				}
				return Response.status(Status.OK)
					.entity(JsonUtils.getSuccessJson(
							"Password reset successfully to - \"admin\""))
					.build();
			} else {
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Authorization Failed")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable to Reset Tenant Password" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Reset Tenant Password")).build();
		}
	}
}
