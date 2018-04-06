package com.tracking.resources;

import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.gson.JsonObject;
import com.tracking.db.TrackingUserDAO;
import com.tracking.db.TenantDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Tenant;
import com.tracking.utils.JsonUtils;
import com.tracking.utils.MailUtils;
import com.tracking.utils.SendMail;
import com.tracking.utils.Utils;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/tenants")
@Produces(MediaType.APPLICATION_JSON)
public class TenantsResource {
	private final TenantDAO tenantDAO;
	private final TrackingUserDAO userDAO;
	private final Logger logger = Logger.getLogger(TenantsResource.class.getName());

	public TenantsResource(TenantDAO dao, TrackingUserDAO userDAO) {
		this.tenantDAO = dao;
		this.userDAO = userDAO;

	}

	@GET
	@UnitOfWork
	public Response listTenants(@Auth TrackingUser authUser) {
		try {
			logger.info(" In listTenants");
			return Response.status(Status.OK).entity(JsonUtils.getJson(tenantDAO.findAll())).build();
		} catch (Exception e) {
			logger.severe("Unable to Find List of Tenants " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find List of Tenants"))
					.build();
		}
	}

	@POST
	@UnitOfWork
	public Response createTenant(@Auth TrackingUser auth, Tenant tenant) {
		Response response = null;
		TrackingUser userObj;
		try {
			logger.info(" In createTenant");
			userObj = userDAO.findByEmailWithRole(tenant.getPrimaryEmail(), TrackingUser.TENANTADMIN);
			if (userObj == null) {
				Tenant tenantObject = tenantDAO.findByEmail(tenant.getPrimaryEmail());
				if (tenantObject == null) {
					tenant.setTenantStatus("0");
					String loginId = tenant.getPrimaryEmail();
					JsonObject jsonObj = MailUtils.getActivationMail(tenant.getPrimaryEmail(), loginId,
							TrackingUser.TENANTADMIN);
					try {
//						Thread t = new Thread(new SendMail(jsonObj));
//						t.start();
						response = tenantDAO.create(tenant);
						Tenant tenantExistObject = tenantDAO.findByTenantCode(tenant.getTenantCode());
						if (response.getStatus() == 200 && tenantExistObject != null) {
							String email = tenantExistObject.getPrimaryEmail();
							TrackingUser labJumpUser = new TrackingUser();
							labJumpUser.setLoginID(loginId);
							labJumpUser.setPassword(Utils.encodeBase64("admin"));
							labJumpUser.setUserRole(TrackingUser.TENANTADMIN);
							labJumpUser.setTenant_id(tenantExistObject.getId());
							labJumpUser.setEmail(email);
							labJumpUser.setStatus("0");
							userDAO.create(labJumpUser);
							return Response.status(Status.OK)
									.entity(JsonUtils.getSuccessJson("Tenant Created Successfully")).build();
						} else {
							return Response.status(Status.BAD_REQUEST)
									.entity(JsonUtils.getErrorJson("Unable to Create Tenant")).build();
						}
					} catch (Exception e) {
						logger.info("Unable To Create Tenant : " + e);
						return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson(e.getMessage()))
								.build();
					}

				} else {
					logger.severe("Unable to Create Tenant, Tenant Already Exists");
					return Response.status(Status.BAD_REQUEST)
							.entity(JsonUtils.getErrorJson("Unable to Create Tenant, Tenant Already Exists")).build();
				}
			} else {
				logger.severe("Email already Registered. Use different Email ID");
				return Response.status(Status.BAD_REQUEST)
						.entity(JsonUtils.getErrorJson(" Email already Registered. Use different Email ID")).build();
			}

		} catch (Exception e) {
			logger.severe("Unable to Create Tenant " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Create Tenant"))
					.build();
		}
	}
}
