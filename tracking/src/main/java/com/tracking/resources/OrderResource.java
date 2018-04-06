package com.tracking.resources;

import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.tracking.db.ClientDAO;
import com.tracking.db.OrderDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Client;
import com.tracking.entity.Order;
import com.tracking.utils.JsonUtils;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/order")
@Produces(MediaType.APPLICATION_JSON)
public class OrderResource {
	
	private final OrderDAO orderDAO;
	private final Logger logger = Logger.getLogger(OrderResource.class.getName());

	public OrderResource(OrderDAO orderDAO) {
		this.orderDAO = orderDAO;
	}
	
	@PUT
	@UnitOfWork
	public Response updateStudent(@Auth TrackingUser authUser ,Order order) {
		try {
			logger.info(" In update Order");
			orderDAO.update(order);
			return Response.status(Status.OK).entity(JsonUtils.getSuccessJson("Order Updated Successfully")).build();
		} catch (Exception e) {
			logger.severe("Unable to Update Order " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable To Update Order")).build();
		}
	}
	

}
