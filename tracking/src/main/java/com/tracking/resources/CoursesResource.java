package com.tracking.resources;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.google.gson.JsonObject;
import com.tracking.db.CourseDAO;
import com.tracking.db.StudentTestsDAO;
import com.tracking.db.TenantDAO;
import com.tracking.db.TestDAO;
import com.tracking.entity.Course;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.StudentTests;
import com.tracking.entity.Tenant;
import com.tracking.entity.Test;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/courses")
@Produces(MediaType.APPLICATION_JSON)
public class CoursesResource {
	private final Logger logger = Logger.getLogger(CoursesResource.class.getName());
	private final CourseDAO courseDAO;
	private final TestDAO testDAO;
	private final StudentTestsDAO studentTestsDAO;
	private final TenantDAO tenantDAO;

	public CoursesResource(CourseDAO courseDAO, TestDAO testDAO, StudentTestsDAO studentTestsDAO, TenantDAO tenantDAO) {
		this.courseDAO = courseDAO;
		this.testDAO = testDAO;
		this.studentTestsDAO = studentTestsDAO;
		this.tenantDAO = tenantDAO;
	}

	@GET
	@UnitOfWork
	public Response listCourses(@Auth TrackingUser authUser) {
		try {
			if(authUser.getTenant_id()==0) {
				return Response.status(Status.OK).entity(JsonUtils.getJson(courseDAO.findAll())).build();
			} else {
				Tenant tenant = tenantDAO.findById(authUser.getTenant_id());
				return Response.status(Status.OK).entity(JsonUtils.getJson(courseDAO.findAllByTenant(tenant.getTenantCode()))).build();
			}
			
		} catch(Exception e) {
			logger.severe("Unable To Get Courses List  :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get Courses List")).build();
		}
	}

	@POST
	@UnitOfWork
	@Consumes("application/json")
	public Response createCourse(@Auth TrackingUser authUser , Course course) {
		try {
			if(authUser.getId() == 0) {
				Course courseExists = courseDAO.findByCourseID(course.getCourseID());
				if (courseExists != null) {
					return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Course with this ID already exists")).build();
				}
				return Response.status(Status.OK).entity(JsonUtils.getJson(courseDAO.create(course))).build();
			} else {
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Authorization Failed")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable To Create Course  :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Create Course")).build();
		}
	}

	@GET
	@Path("/tenantFavCourses/{tenantid}")
	@UnitOfWork
	public Response getTenantFavCourses(@Auth TrackingUser authUser ,@PathParam("tenantid") long tenantid) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(courseDAO.getTenantFavCourses(tenantid))).build();
		} catch(Exception e) {
			logger.severe("Unable To Get Tenant's Favorite Courses  :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get Tenant's Favorite Courses")).build();
		}
	}

	@GET
	@Path("/popularCourses")
	@UnitOfWork
	public Response getPopularCourses(@Auth TrackingUser authUser) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(courseDAO.getPopularCourses())).build();
		} catch(Exception e) {
			logger.severe("Unable To Get Popular Courses  :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get Popular Courses")).build();
		}
	}

	@GET
	@Path("/getBarChartData")
	@UnitOfWork
	public Response getPassOrFailByCourses(@Auth TrackingUser authUser) {
		int count = 0;
		JsonObject json = new JsonObject();
		try {
			if(authUser.getTenant_id() != 0) {
				Tenant tenantObj = tenantDAO.findById(authUser.getTenant_id());
				List<Course> courseList = courseDAO.findAllByTenant(tenantObj.getTenantCode());
				int datastudentTestsListPass[] = new int[courseList.size()];
				int datastudentTestsListFail[] = new int[courseList.size()];
				for (Course course : courseList) {

					List<Test> testList = testDAO.findAllByCourseID(course.getId());
					for (Test test : testList) {
						List<StudentTests> studentTestsListPass = studentTestsDAO.findByResultWithTestId("pass",
							test.getId());

						datastudentTestsListPass[count] = datastudentTestsListPass[count] + studentTestsListPass.size();

						List<StudentTests> studentTestsListFail = studentTestsDAO.findByResultWithTestId("fail",
							test.getId());
						datastudentTestsListFail[count] = datastudentTestsListFail[count] + studentTestsListFail.size();
					}
					count++;
				}
				json.addProperty("status", Response.Status.OK.getStatusCode());
				json.addProperty("pass", Arrays.toString(datastudentTestsListPass));
				json.addProperty("fail", Arrays.toString(datastudentTestsListFail));
				return Response.status(Status.OK).entity(json.toString()).build();
			} else {
				return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Authorization Failed")).build();
			}
		} catch (Exception e) {
			logger.severe("Unable To Get Bar Graph Data :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get Bar Graph Data")).build();
		}
	}
}
