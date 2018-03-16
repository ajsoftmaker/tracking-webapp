package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.gson.JsonObject;
import com.tracking.ApplicationContext;
import com.tracking.db.BatchRequestDAO;
import com.tracking.db.CourseDAO;
import com.tracking.db.TenantDAO;
import com.tracking.entity.BatchRequest;
import com.tracking.entity.Course;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Tenant;
import com.tracking.utils.JsonUtils;
import com.tracking.utils.MailUtils;
import com.tracking.utils.SendMail;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/batchrequests")
@Produces(MediaType.APPLICATION_JSON)
public class BatchRequestsResource {
	private final Logger logger = Logger.getLogger(BatchRequestsResource.class.getName());
	private final BatchRequestDAO batchRequestDAO;
	private final CourseDAO courseDAO;
	private final TenantDAO tenantDAO;

	public BatchRequestsResource(BatchRequestDAO dao, CourseDAO courseDAO, TenantDAO tenantDAO) {
		this.batchRequestDAO = dao;
		this.courseDAO = courseDAO;
		this.tenantDAO = tenantDAO;
	}

	@GET
	@UnitOfWork
	public Response listBatchRequests(@Auth TrackingUser authUser) {
		try {
			if(authUser.getTenant_id()==0) {
				return Response.status(Status.OK).entity(JsonUtils.getJson(batchRequestDAO.findAll())).build();
			} else {
				return Response.status(Status.OK).entity(JsonUtils.getJson(batchRequestDAO.findAllByTenant(authUser.getTenant_id()))).build();
			}
			
		} catch (Exception e) {
			logger.severe("Unable To Get Batch Requests :" + e);
			return Response.status(Status.FOUND).entity(JsonUtils.getErrorJson("Unable To Get Batch Requests")).build();
		}
	}

	@POST
	@UnitOfWork
	@Consumes("application/json")
	public Response createBatchRequest(@Auth TrackingUser authUser , BatchRequest batchRequest) {
		String email = ApplicationContext.getInstance().getConfig().getMailUsername();
		if (email == null || email == "") {
			logger.severe("Unable To Create Batch Request - No User Name");
			return Response.status(Status.BAD_REQUEST)
					.entity(JsonUtils.getErrorJson("Unable To Create Batch Request - No User Name")).build();
		}
		try {
			Course courseObj = courseDAO.findByID(batchRequest.getCourseID());
			Tenant tenantObj = tenantDAO.findById(batchRequest.getTenantID());

			String value = "You got a Batch Request with CourseID : " + courseObj.getCourseID() + ", from : "
					+ tenantObj.getTenantName() + " (" + tenantObj.getPrimaryEmail() + ")"
					+ "\n\n Kindly login your account and process the request.";

			BatchRequest batchRequestObj = batchRequestDAO.findByBatchRequest(batchRequest.getCourseID(),
					batchRequest.getTenantID(), batchRequest.getStartDate());
			if (batchRequestObj != null) {
				logger.warning("Batch Already Scheduled");
				return Response.status(Status.FOUND).entity(JsonUtils.getErrorJson("Batch Already Scheduled")).build();
			} else {
				try {
					JsonObject jsonObj = MailUtils.getNotificationMail(email, value);
					Thread t = new Thread(new SendMail(jsonObj));
					t.start();
					logger.info("Batch Request Sent");
					batchRequestDAO.create(batchRequest);
					return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Batch Request Sent")).build();
				} catch(Exception e) {
					logger.info("Batch Request Failed :"+e);
					return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(e.getMessage()))
							.build();
				}
			}
		} catch (Exception e) {
			logger.severe("Unable To Send Batch Request :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Send Batch Request"))
					.build();
		}
	}
	
	@GET
	@Path("/{requestStatus}")
	@UnitOfWork
	public Response listBatchRequestsByRequestStatus(@Auth TrackingUser authUser ,@PathParam("requestStatus") String requestStatus) {
		try {
				if(authUser.getId()!= 0) {
					return Response.status(Status.OK).entity(JsonUtils.getJson(batchRequestDAO.findByRequestStatus(authUser.getTenant_id(),requestStatus))).build();
				}else {
					return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get Batch Requests")).build();
				}
			} catch(Exception e) {
				logger.severe("Unable To get Batch Requests By Request Status:" + e);
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get Batch Requests")).build();
		}
	}
	
	@PUT
    @UnitOfWork
    public Response updateBatchRequest(@Auth TrackingUser authUser) {
		try {
			if(authUser.getTenant_id()==0) {
				batchRequestDAO.updateAllNotification();
				return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("All notifications of Batch Requests updated successfully")).build();
			} else {
				batchRequestDAO.updateAllNotificationByTenant(authUser.getTenant_id());
				return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("All notifications of Batch Requests updated successfully")).build();
			}
			
		} catch (Exception e) {
			logger.severe("Unable To update notifications of Batch Requests :" + e);
			return Response.status(Status.FOUND).entity(JsonUtils.getErrorJson("You are not valid user")).build();
		}
    }
}
