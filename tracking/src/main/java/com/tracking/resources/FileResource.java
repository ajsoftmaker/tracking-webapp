package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.tracking.db.FileDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/file/{courseid}")
@Produces(MediaType.APPLICATION_JSON)
public class FileResource {
	private final Logger logger = Logger.getLogger(FileResource.class.getName());
	private final FileDAO fileDAO;

	public FileResource(FileDAO fileDAO) {
		this.fileDAO = fileDAO;
	}

	@GET
	@UnitOfWork
	public Response findFileByCourseID(@Auth TrackingUser authUser ,@PathParam("courseid") long courseid) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(fileDAO.findFileByCourseID(courseid))).build();
		} catch (Exception e) {
			logger.severe("Unable To Find File By CourseID  :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find File By CourseID"))
					.build();
		}
	}

	@DELETE
	@Path("/{fileid}")
	@UnitOfWork
	public Response deleteFile(@Auth TrackingUser authUser ,@PathParam("courseid") long courseid, @PathParam("fileid") long fileid) {
		try {
			fileDAO.delete(courseid, fileid);
			logger.info("File Deleted Successfully");
			return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("File Deleted Successfully")).build();
		} catch (Exception e) {
			logger.severe("Unable To Delete File :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Delete File")).build();
		}
	}

}
