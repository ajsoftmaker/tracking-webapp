package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.tracking.db.FileDAO;
import com.tracking.entity.Files;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/files")
@Produces(MediaType.APPLICATION_JSON)
public class FilesResource {
	private final Logger logger = Logger.getLogger(FilesResource.class.getName());
	private final FileDAO fileDAO;

	public FilesResource(FileDAO fileDAO) {
		this.fileDAO = fileDAO;
	}

	@POST
	@UnitOfWork
	public Response createFile(@Auth TrackingUser authUser ,Files file) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(fileDAO.create(file))).build();
		} catch (Exception e) {
			logger.severe("Unable To Create File :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Create File")).build();
		}
	}

	@GET
	@UnitOfWork
	public Response findFiles(@Auth TrackingUser authUser) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(fileDAO.findFiles())).build();
		} catch (Exception e) {
			logger.severe("Unable To Find Files :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Files")).build();
		}
	}

}
