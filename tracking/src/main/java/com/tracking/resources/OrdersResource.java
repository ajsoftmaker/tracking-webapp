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

import com.tracking.db.ClientDAO;
import com.tracking.db.OrderDAO;
import com.tracking.entity.TrackingUser;
import com.tracking.entity.Client;
import com.tracking.entity.Order;
import com.tracking.utils.JsonUtils;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;

@Path("/orders")
@Produces(MediaType.APPLICATION_JSON)
public class OrdersResource {
	
	private final OrderDAO orderDAO;
	private final Logger logger = Logger.getLogger(OrdersResource.class.getName());

	public OrdersResource(OrderDAO orderDAO) {
		this.orderDAO = orderDAO;
	}

	@GET
	@UnitOfWork
	public Response listOrders(@Auth TrackingUser authUser) {
		try {
			logger.info(" In list Orders");
			return Response.status(Status.OK).entity(JsonUtils.getJson(orderDAO.findAll())).build();
		} catch (Exception e) {
			logger.severe("Unable to Find List of Orders " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Find List of Orders"))
					.build();
		}
	}

	@POST
	@UnitOfWork
	public Response createOrder(@Auth TrackingUser auth, Order order) {
		try {
			logger.info(" In create Order");
			
			order.setTenantId(1);
			System.out.println(order);
			return Response.status(Status.OK).entity(JsonUtils.getJson(orderDAO.create(order))).build();

		} catch (Exception e) {
			logger.severe("Unable to Create Order " + e);
			return Response.status(Status.BAD_REQUEST).entity(JsonUtils.getErrorJson("Unable to Create Order"))
					.build();
		}
	}
	
}
