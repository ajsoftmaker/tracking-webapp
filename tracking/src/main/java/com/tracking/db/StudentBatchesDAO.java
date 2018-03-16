package com.tracking.db;

import java.util.List;
import org.hibernate.SessionFactory;
import com.tracking.entity.StudentBatches;

import io.dropwizard.hibernate.AbstractDAO;

public class StudentBatchesDAO extends AbstractDAO<StudentBatches> {

	public StudentBatchesDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public List<StudentBatches> findAll() {
		return list(namedQuery("com.tracking.entity.StudentBatches.findAll"));
	}

	public List<StudentBatches> findAllByBatchID(long batchID) {
		return list(namedQuery("com.tracking.entity.StudentBatches.findAllByBatchID").setParameter("batchID", batchID));
	}

	public StudentBatches create(StudentBatches studentBatches) {
		return persist(studentBatches);
	}

	public StudentBatches update(StudentBatches studentBatches) {
		return persist(studentBatches);
	}

	public List<StudentBatches> findAllByStudentID(long studentID) {
		return list(namedQuery("com.tracking.entity.StudentBatches.findAllByStudentID").setParameter("studentID",
				studentID));
	}

	public StudentBatches getByBatchIDStudentID(long batchID, long studentID) {
		return uniqueResult(namedQuery("com.tracking.entity.StudentBatches.getByBatchIDStudentID")
				.setParameter("batchid", batchID).setParameter("studentid", studentID));
	}

}
