package com.tracking.resources;

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
import com.tracking.db.BatchDAO;
import com.tracking.entity.Batch;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/batch/{batchID}")
@Produces(MediaType.APPLICATION_JSON)
public class BatchResource {
	private final BatchDAO batchDAO;
	private final Logger logger = Logger.getLogger(BatchResource.class.getName());

	public BatchResource(BatchDAO dao) {
		this.batchDAO = dao;
	}

	@GET
	@UnitOfWork
	public Response findBatch(@Auth TrackingUser authUser ,@PathParam("batchID") long batchID) {
		try {
			logger.info(" In findBatch");
			return Response.status(Status.OK).entity(JsonUtils.getJson(batchDAO.findById(batchID))).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Batch :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Batch")).build();
		}
	}

	@PUT
	@UnitOfWork
	public Response updateBatch(@Auth TrackingUser authUser , Batch batch) {
		try {
			batchDAO.update(batch);
			logger.info("Batch Updated Successfully");
			return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Batch Updated Successfully")).build();
		} catch (Exception e) {
			logger.severe("Unable to Update Batch" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Update Batch")).build();
		}
	}

	@DELETE
	@UnitOfWork
	public Response deleteBatch(@Auth TrackingUser authUser ,@PathParam("batchID") long batchID) {
		try {
			batchDAO.delete(batchID);
			logger.info("Batch Deleted Successfully");
			return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Batch Deleted Successfully")).build();
		} catch (Exception e) {
			logger.severe("Unable to Delete Batch" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Delete Batch")).build();
		}
	}

}
