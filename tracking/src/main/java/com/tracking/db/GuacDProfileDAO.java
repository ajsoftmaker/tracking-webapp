package com.tracking.db;

import java.util.List;

import org.hibernate.SessionFactory;

import com.tracking.entity.GuacDProflie;

import io.dropwizard.hibernate.AbstractDAO;

public class GuacDProfileDAO extends AbstractDAO<GuacDProflie> {

	public GuacDProfileDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public List<GuacDProflie> findAll() {
		return list(namedQuery("com.tracking.entity.GuacDProflie.findAll"));
	}

	public GuacDProflie create(GuacDProflie guacDProfile) {
		return persist(guacDProfile);
	}

	public void delete(long id) {
		 currentSession().delete(findById(id));;
	}

	public GuacDProflie findById(long profileId) {
		return uniqueResult(namedQuery("com.tracking.entity.GuacDProflie.findById").setParameter("id", profileId));
	}
}
