package com.tracking.resources;

import java.util.logging.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.tracking.db.CourseCountDAO;
import com.tracking.entity.CourseCount;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/courseCount")
@Produces(MediaType.APPLICATION_JSON)
public class CourseCountResource {
	private final Logger logger = Logger.getLogger(CourseCountResource.class.getName());
	private final CourseCountDAO courseCountDAO;
	public CourseCountResource(CourseCountDAO courseCountDAO) {
		this.courseCountDAO = courseCountDAO;
	}
	
	@POST
	@UnitOfWork
	public Response createCourseCount(@Auth TrackingUser authUser,CourseCount courseCount) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(courseCountDAO.create(courseCount))).build();
		}catch(Exception e) {
			logger.severe("Unable To Create Course Count :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Create Course Count ")).build();
		}
	}
	
	@PUT
	@UnitOfWork
	public Response updateCourseCount(@Auth TrackingUser authUser,CourseCount courseCount) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(courseCountDAO.update(courseCount))).build();
		}catch(Exception e) {
			logger.severe("Unable To Update Course Count :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Update Course Count ")).build();
		}
	}
	
	@GET
	@Path("{courseID}")
	@UnitOfWork
	public Response getCourseCount(@Auth TrackingUser authUser ,@PathParam("courseID") String courseID ) {
		try { 
			CourseCount courseCount = courseCountDAO.findByCourseID(courseID);  
			if(courseCount != null){
				return Response.status(Status.OK).entity(JsonUtils.getJson(courseCountDAO.findByCourseID(courseID))).build();
			} else {
				return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("isEmpty")).build();
			}
		} catch(Exception e) {
			logger.severe("Unable To Find Course Count :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Course Count ")).build();
		}
	}
}
