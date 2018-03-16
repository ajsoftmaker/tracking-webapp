package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.tracking.ApplicationContext;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/testscript")
@Produces(MediaType.APPLICATION_JSON)
public class TestScriptResource {
	private String verify;
	private String reset;
	private final Logger logger = Logger.getLogger(TestScriptResource.class.getName());

	public TestScriptResource() {
		this.verify = ApplicationContext.getInstance().getConfig().getVerify();
		this.reset = ApplicationContext.getInstance().getConfig().getReset();
	}

	@GET
	@UnitOfWork
	@Path("/verify")
	public Response findVerifyScript(@Auth TrackingUser authUser) {
		try {
			logger.info(" In findVerifyScript");
			return Response.status(Status.OK).entity(JsonUtils.getSuccessJson(verify)).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Verify Script " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Verify Script"))
					.build();
		}
	}

	@GET
	@UnitOfWork
	@Path("/reset")
	public Response findResetScript(@Auth TrackingUser authUser) {
		try {
			logger.info(" In findResetScrip");
			return Response.status(Status.OK).entity(JsonUtils.getSuccessJson(reset)).build();
		} catch (Exception e) {
			logger.severe("Unable to Find Reset Scrip " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find Reset Scrip"))
					.build();
		}
	}

}
