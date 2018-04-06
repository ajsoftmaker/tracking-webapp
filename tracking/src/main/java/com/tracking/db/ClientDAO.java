package com.tracking.db;

import java.util.List;
import javax.ws.rs.core.Response;
import org.hibernate.SessionFactory;

import com.tracking.entity.Client;

import io.dropwizard.hibernate.AbstractDAO;

public class ClientDAO extends AbstractDAO<Client> {

	public ClientDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public List<Client> findAll() {
		return list(namedQuery("com.tracking.entity.Client.findAll"));
	}

	public Response create(Client client) {
		Response response = null;
		System.out.println("IN DAO");
		Client getTenant = findByEmail(client.getClientEmail());
		if (getTenant != null) {
			response = Response.notModified("A client with this code already exists").build();
		} else {
			persist(client);
			response = Response.ok().build();
		}
		return response;
	}

	public Client findByEmailPhone(String clientEmail, String contactNumber) {
		return uniqueResult(namedQuery("com.tracking.entity.Client.findByEmailPhone")
				.setParameter("clientEmail", clientEmail)
				.setParameter("contactNumber", contactNumber));
	}
	
	public Client findByEmail(String clientEmail) {
		return uniqueResult(namedQuery("com.tracking.entity.Client.findByEmail").setParameter("clientEmail", clientEmail));
	}

	public Client update(Client client) {
		return persist(client);
	}

	public Client findById(long clientID) {
		return uniqueResult(namedQuery("com.tracking.entity.Client.findById").setParameter("id", clientID));
	}

}
