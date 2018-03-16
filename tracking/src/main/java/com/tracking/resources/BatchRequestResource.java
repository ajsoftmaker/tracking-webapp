package com.tracking.resources;

import java.util.List;
import java.util.logging.Logger;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.google.gson.JsonObject;
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

@Path("/batchrequest/{batchrequestID}")
@Produces(MediaType.APPLICATION_JSON)
public class BatchRequestResource {
private final BatchRequestDAO batchRequestDAO;
private final CourseDAO courseDAO;
private final TenantDAO tenantDAO;

	private final Logger logger = Logger.getLogger(BatchRequestResource.class.getName());
	public BatchRequestResource(BatchRequestDAO dao , CourseDAO courseDAO ,TenantDAO tenantDAO) {
		this.batchRequestDAO = dao;
		this.courseDAO = courseDAO;
		this.tenantDAO = tenantDAO;
	}
	
	@PUT
    @UnitOfWork
    public Response updateBatchRequest(@Auth TrackingUser authUser , BatchRequest batchRequest) {
		String value = null;
		try {
			Course courseObj = courseDAO.findByID(batchRequest.getCourseID());
			Tenant tenantObj = tenantDAO.findById(batchRequest.getTenantID());
			if(!batchRequest.getRequestStatus().equals("Accepted")){
				logger.info("Batch Request Declined");
				value = "Your request is declined for CourseID : " + courseObj.getCourseID()
						+ "\n\n Reason : " + batchRequest.getReason();
			}else {
				logger.info("Batch Request Accepted");
				value = "Your request is accepted for CourseID : " + courseObj.getCourseID();
			}
			
			String email = tenantObj.getPrimaryEmail();
			try {
				JsonObject jsonObj = MailUtils.getNotificationMail(email, value);
				Thread t = new Thread(new SendMail(jsonObj));
				t.start();
				batchRequestDAO.update(batchRequest);
				return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Batch Request Updated")).build();
			}catch(Exception e) {
				logger.info("Batch Request Failed To Update : "+e);
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(e.getMessage()))
						.build();
			}
        
		}
		catch(Exception e) {
			logger.severe("Batch Request Not Accepted :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Batch Request Not Accepted")).build();
		}
    }
	
	@GET
	@UnitOfWork
	public Response findBatch(@Auth TrackingUser authUser ,@PathParam("batchrequestID") long batchrequestID) {
		try {
			logger.info(" BatchRequestResource findBatch ");
			if(authUser.getId() == 0) {
				return Response.status(Status.OK).entity(JsonUtils.getJson(batchRequestDAO.findById(batchrequestID))).build();
			} else {
				List<BatchRequest> batchRequestList = batchRequestDAO.findAllByTenant(authUser.getTenant_id());
				if(batchRequestList.contains(batchRequestDAO.findById(batchrequestID))) {
					return Response.status(Status.OK).entity(JsonUtils.getJson(batchRequestDAO.findById(batchrequestID))).build();
				} else {
					return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Batch")).build();
				}
			} 
		} catch(Exception e) {
			logger.severe("Unable To Find Batch :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Batch")).build();
		}
	}
	
	@DELETE
	@UnitOfWork
	@Path("/{tenantID}/{startDate}")
	public Response deleteBatchRequest(@Auth TrackingUser authUser , @PathParam("batchrequestID") long courseID,@PathParam("tenantID") long tenantID,@PathParam("startDate") String startDate){
		try {
			logger.info("Batch Request Deleted successfully");
			batchRequestDAO.delete(courseID,tenantID,startDate);
			return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Batch Request Deleted Successfully")).build();
		}
		catch(Exception e) {
			logger.severe("Unable to Delete Batch Request :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Delete Batch Request")).build();
		}
	}
	
}
