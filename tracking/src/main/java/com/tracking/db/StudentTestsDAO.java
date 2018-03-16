package com.tracking.db;

import java.util.List;
import org.hibernate.SessionFactory;
import com.tracking.entity.StudentTests;

import io.dropwizard.hibernate.AbstractDAO;

public class StudentTestsDAO extends AbstractDAO<StudentTests> {

	public StudentTestsDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public List<StudentTests> findAll() {
		return list(namedQuery("com.tracking.entity.StudentTests.findAll"));
	}

	public StudentTests create(StudentTests studentTests) {
		return persist(studentTests);
	}

	public StudentTests findByStudentTestID(long studentID, long testID) {
		return uniqueResult(namedQuery("com.tracking.entity.StudentTests.findByStudentTestID")
				.setParameter("studentID", studentID).setParameter("testID", testID));
	}

	public List<StudentTests> findByStudentId(long studentID) {
		return list(namedQuery("com.tracking.entity.StudentTests.findByStudentID").setParameter("studentID", studentID));
	}

	public StudentTests update(StudentTests studentTests) {
		return persist(studentTests);
	}

	public List<StudentTests> findByResultWithStudentId(long studentID , String result) {
		return list(namedQuery("com.tracking.entity.StudentTests.findByResultWithStudentId")
				.setParameter("studentID", studentID)
				.setParameter("results", result));
	}

	public List<StudentTests> findByTestId(long testID) {
		return list(namedQuery("com.tracking.entity.StudentTests.findByTestId").setParameter("testID", testID));
	}

	public List<StudentTests> findByResultWithTestId(String result, long testID) {
		return list(namedQuery("com.tracking.entity.StudentTests.findByResultWithTestId").setParameter("testID", testID)
				.setParameter("results", result));
	}

}
