package com.tracking.db;

import java.util.List;
import org.hibernate.SessionFactory;
import com.tracking.entity.BatchRequest;

import io.dropwizard.hibernate.AbstractDAO;

public class BatchRequestDAO extends AbstractDAO<BatchRequest> {

	public BatchRequestDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public List<BatchRequest> findAll() {
		return list(namedQuery("com.tracking.entity.BatchRequest.findAll"));
	}

	public BatchRequest create(BatchRequest batchRequest) {
		return persist(batchRequest);
	}

	public BatchRequest findByBatchRequest(long courseID, long tenantID, String startDate) {
		return uniqueResult(namedQuery("com.tracking.entity.BatchRequest.findByBatchRequest")
				.setParameter("courseID", courseID)
				.setParameter("tenantID", tenantID)
				.setParameter("startDate", startDate));
	}

	public void update(BatchRequest batchRequest) {
		persist(batchRequest);
	}

	public BatchRequest findById(long batchrequestID) {
		return uniqueResult(namedQuery("com.tracking.entity.BatchRequest.findById").setParameter("id", batchrequestID));
	}

	public void delete(long courseID, long tenantID, String startDate) {
		 currentSession().delete(findByBatchRequest(courseID,tenantID,startDate));
	}

	public List<BatchRequest> findAllByTenant(long tenantID) {
		return list(namedQuery("com.tracking.entity.BatchRequest.findAllByTenant").setParameter("tenantID", tenantID));
	}
	public List<BatchRequest> findByRequestStatus(long tenantID ,String requestStatus) {
		return list(namedQuery("com.tracking.entity.BatchRequest.findByRequestStatus")
				.setParameter("tenantID", tenantID)
				.setParameter("requestStatus", requestStatus));
	}

	public void updateAllNotification() {
		 currentSession().getNamedQuery("com.tracking.entity.BatchRequest.allBatchRequestNotification").executeUpdate();
	}

	public void updateAllNotificationByTenant(long tenantID) {
		currentSession().getNamedQuery("com.tracking.entity.BatchRequest.allBatchRequestNotificationByTenant")
		.setLong("tenantID", tenantID).executeUpdate();
	}

}
