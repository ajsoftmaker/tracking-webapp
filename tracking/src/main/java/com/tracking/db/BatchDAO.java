package com.tracking.db;

import java.util.List;
import org.hibernate.SessionFactory;
import com.tracking.entity.Batch;

import io.dropwizard.hibernate.AbstractDAO;

public class BatchDAO extends AbstractDAO<Batch> {

	public BatchDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}
	
	public List<Batch> findAll() {
		return list(namedQuery("com.tracking.entity.Batch.findAll"));
	}

	public Batch findById(long batchID) {
		return uniqueResult(namedQuery("com.tracking.entity.Batch.findById").setParameter("id", batchID));
	}

	public Batch findByBatch(long courseID, long tenantID, String startDate) {
		return uniqueResult(namedQuery("com.tracking.entity.Batch.findByBatch")
				.setParameter("courseID", courseID)
				.setParameter("tenantID", tenantID)
				.setParameter("startDate", startDate));
	}

	public Batch create(Batch batch) {
		return persist(batch);
	}

	public void update(Batch batch) {
		persist(batch);
	}

	public void delete(long batchID) {
		 currentSession().delete(findById(batchID));;
	}

	public List<Batch> findAllByTenant(long tenantID) {
		return list(namedQuery("com.tracking.entity.Batch.findAllByTenant").setParameter("tenantID", tenantID));
	}

}
