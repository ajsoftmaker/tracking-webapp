package com.tracking.resources;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.logging.Logger;
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

import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;

import com.tracking.db.CourseDAO;
import com.tracking.db.FileDAO;
import com.tracking.db.TenantDAO;
import com.tracking.entity.Course;
import com.tracking.entity.Files;
import com.tracking.entity.TrackingUser;
import com.tracking.utils.JsonUtils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/course/{courseid}")
@Produces(MediaType.APPLICATION_JSON)
public class CourseResource {
	private final Logger logger = Logger.getLogger(CourseResource.class.getName());
	private final CourseDAO courseDAO;
	private final String courseFilesLocation;
	private final FileDAO fileDAO;
	public CourseResource(CourseDAO courseDAO, String filesLocation, FileDAO fileDAO ,TenantDAO tenantDAO) {
		this.courseDAO = courseDAO;
		this.courseFilesLocation = filesLocation;
		this.fileDAO = fileDAO;
	}

	@GET
	@UnitOfWork
	public Response findCourse(@Auth TrackingUser authUser ,@PathParam("courseid") String courseid) {
		try {
			logger.info("Find Course");
			Course course = courseDAO.findByCourseID(courseid);
			if(course !=null) {
				return Response.status(Status.OK).entity(JsonUtils.getJson(course)).build();
			} else {
				return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("isEmpty")).build();
			}
		} catch(Exception e) {
			logger.severe("Unable To Find Course :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Course")).build();
		}
	}

	@GET
	@UnitOfWork
	@Path("/id")
	public Response findID(@Auth TrackingUser authUser ,@PathParam("courseid") String courseid) {
		try {
			String str[] = courseid.split("/");
			return  Response.status(Status.OK).entity(JsonUtils.getJson(courseDAO.findByID(Long.parseLong(str[0])))).build();
		} catch (Exception e) {
			logger.severe("Unable To Find Course By ID :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Find Course By ID")).build();
		}
	}

	@PUT
	@UnitOfWork
	public Response updateCourse(@Auth TrackingUser authUser ,Course course) {
		try{
			return Response.status(Status.OK).entity(JsonUtils.getJson(courseDAO.update(course))).build();
		}catch (Exception e) {
			logger.severe("Unable To Update Course :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Update Course ")).build();
		}
	}

	@DELETE
	@UnitOfWork
	public Response deleteCourse(@Auth TrackingUser authUser ,@PathParam("courseid") String courseid) {
		try {
		courseDAO.delete(courseid);
		return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Course Deleted Successfully")).build();
		}
		catch (Exception e) {
			logger.severe("Unable To Delete Course :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Delete Course")).build();
		}
	}

	@POST
	@UnitOfWork
	@Path("/files/{mode}")
	public Response uploadFiles(@Auth TrackingUser authUser ,@PathParam("courseid") String courseID, FormDataMultiPart multiPart,
			@PathParam("mode") String mode) {
		try {
			// fetch file stream, save in physical location
			// making directory for storing newly uploaded file
			String path = this.courseFilesLocation + File.separator + courseID;
			File f = new File(path);
			if (!f.exists()) {
				f.mkdirs();
			}
			List<FormDataBodyPart> bodyParts = multiPart.getFields("coursefiles");
			String fileName = null;
			for (FormDataBodyPart part : bodyParts) {
				InputStream is = part.getValueAs(InputStream.class);
				fileName = part.getFormDataContentDisposition().getFileName();
				String fileNameWithPath = path + File.separator + fileName;
				// write the inputStream to file in a physical location
				try {
					OutputStream outputStream = new FileOutputStream(new File(fileNameWithPath));
					int read = 0;
					byte[] bytes = new byte[1024];

					while ((read = is.read(bytes)) != -1) {
						outputStream.write(bytes, 0, read);
					}
					outputStream.flush();
					outputStream.close();
				} catch (FileNotFoundException e) {
					logger.severe("File Not Found :" + e);
					return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(e.getMessage())).build();
				} catch (IOException e) {
					logger.severe("IOException :" + e);
					return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(e.getMessage())).build();
				}
				// make entries in database
				if (fileName != null) {
					Files fileobj = new Files();
					fileobj.setFileName(fileName);
					Course courseObj = courseDAO.findByCourseID(courseID);
					fileobj.setCourseID(courseObj.getId());
					fileobj.setMode(mode);
					fileDAO.create(fileobj);
					logger.info("Files Uploaded Successfully");
					return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Files Uploaded Successfully")).build();
					
				}
			}

		} catch (Exception ex) {
			logger.severe("Unable To Upload Files :" + ex);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(ex.getMessage())).build();
		}
		return null;
	}

	@GET
	@UnitOfWork
	@Path("/files")
	public Response getFilesForCourse(@Auth TrackingUser authUser ,@PathParam("courseid") String courseID) {
		try {
			return Response.status(Status.OK).entity(JsonUtils.getJson(fileDAO.getFilesForCourseID(courseID))).build();
		}catch(Exception e) {
			logger.severe("Unable To Get Files for Course  :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Get Files for Course")).build();
		}
	}
	
	@GET
	@UnitOfWork
	@Path("/download/{filename}")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response downloadFiles(@PathParam("courseid") long courseID,@PathParam("filename") String fileName) {
		
		try {
			Course courseObj =  courseDAO.findByID(courseID);
				if(courseObj !=null) {
					String course_ID = courseObj.getCourseID();
					String path = this.courseFilesLocation + File.separatorChar + course_ID + File.separatorChar + fileName;
					File file = new File(path);
						if(file.exists()) {
							return Response.ok(file, MediaType.APPLICATION_OCTET_STREAM)
									.header("Content-Disposition", "attachment; filename=\"" + fileName + "\"").build();
			
						} else {
							return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(" File Not Available At This Moment "))
							.build();
						}
				} else {
					return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(" File Is Not Available For This Course "))
							.build();
				}
				
		} catch (Exception e) {
			logger.severe("Unable To Download File :" + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(" Unable To Download File "))
					.build();
		}
	}
}
