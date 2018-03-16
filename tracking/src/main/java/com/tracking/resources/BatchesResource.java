package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
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

@Path("/batches")
@Produces(MediaType.APPLICATION_JSON)
public class BatchesResource {
	private final BatchDAO batchDAO;
	private final Logger logger = Logger.getLogger(BatchesResource.class.getName());

	public BatchesResource(BatchDAO dao) {
		this.batchDAO = dao;
	}

	@GET
	@UnitOfWork
	public Response listBatches(@Auth TrackingUser authUser) {
		try{ 
			if(authUser.getId()==0){
				return Response.status(Status.OK).entity(JsonUtils.getJson( batchDAO.findAll())).build();
			} else {
				return Response.status(Status.OK).entity(JsonUtils.getJson( batchDAO.findAllByTenant(authUser.getTenant_id()))).build();
			}
		}
		catch(Exception e) {
			logger.severe("Unable to get all batches :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to get all batches")).build();
		}
	}

	@POST
	@UnitOfWork
	@Consumes("application/json")
	public Response createBatch(@Auth TrackingUser authUser , Batch batch) {
		try {
			Batch batchObj = batchDAO.findByBatch(batch.getCourseID(), batch.getTenantID(), batch.getStartDate());
			if (batchObj != null) {
				logger.warning("Batch already exists");
				return Response.status(Status.NOT_MODIFIED).entity(JsonUtils.getErrorJson("Batch already exists"))
						.build();
			} else {
				logger.info("In Create Batch");
				return Response.status(Status.OK).entity(JsonUtils.getJson(batchDAO.create(batch))).build();
			}
		} catch (Exception e) {
			logger.severe("Unable To Create Batch :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Create Batch")).build();
		}
	}
}
