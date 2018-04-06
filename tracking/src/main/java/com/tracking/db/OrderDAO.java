package com.tracking.db;

import java.util.List;
import javax.ws.rs.core.Response;
import org.hibernate.SessionFactory;
import com.tracking.entity.Order;

import io.dropwizard.hibernate.AbstractDAO;

public class OrderDAO extends AbstractDAO<Order> {

	public OrderDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public List<Order> findAll() {
		return list(namedQuery("com.tracking.entity.Order.findAll"));
	}

	public Response create(Order order) {
		Response response = null;
		persist(order);
		response = Response.ok().build();
		return response;
	}

	public Order update(Order order) {
		return persist(order);
	}

	public Order findById(long id) {
		return uniqueResult(namedQuery("com.tracking.entity.Client.findById").setParameter("id", id));
	}

}
