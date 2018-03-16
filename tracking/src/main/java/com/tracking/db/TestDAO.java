package com.tracking.db;

import java.util.List;
import javax.ws.rs.core.Response;
import org.hibernate.SessionFactory;

import com.tracking.entity.Test;

import io.dropwizard.hibernate.AbstractDAO;

public class TestDAO extends AbstractDAO<Test> {

	public TestDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public Response create(Test test) {
		Response response = null;
		Test getTest = findByTestName(test.getTestName());
		if (getTest != null) {
			response = Response.notModified("A test with this name already exists").build();
		} else {
			persist(test);
			response = Response.ok().build();
		}
		return response;
	}

	private Test findByTestName(String testName) {
		return uniqueResult(namedQuery("com.tracking.entity.Test.findByTenantName").setParameter("testName", testName));
	}

	public List<Test> findAll() {
		return list(namedQuery("com.tracking.entity.Test.findAll"));
	}

	public List<Test> findAllByCourseID(long courseID) {
		return list(namedQuery("com.tracking.entity.Test.findAllByCourseID").setParameter("courseID", courseID));
	}

	public Test update(Test test) {
		return persist(test);
	}
	
	private Test findById(long id) {
		return uniqueResult(namedQuery("com.tracking.entity.Test.findById").setParameter("id", id));
	}
	public void delete(long id) {
		currentSession().delete(findById(id));
	}
}
