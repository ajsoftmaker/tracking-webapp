package com.tracking.db;

import java.util.List;
import org.hibernate.SessionFactory;
import com.tracking.entity.TrackingUser;
import io.dropwizard.hibernate.AbstractDAO;

public class TrackingUserDAO extends AbstractDAO<TrackingUser> {

	public TrackingUserDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public TrackingUser create(TrackingUser user) {
		return persist(user);
	}

	public List<TrackingUser> findByLoginID(String userloginID) {
		return list(namedQuery("com.tracking.entity.TrackingUser.findByuserloginID")
				.setParameter("userloginID", userloginID));
	}

	public TrackingUser update(TrackingUser user) {
		return persist(user);
	}

	public List<TrackingUser> findByEmail(String email) {
		return list(namedQuery("com.tracking.entity.TrackingUser.findByEmail")
				.setParameter("email", email));
	}

	public TrackingUser findByEmailWithRole(String email, String role) {
		return uniqueResult(namedQuery("com.tracking.entity.TrackingUser.findByEmailWithRole")
				.setParameter("email", email).setParameter("userRole", role));

	}

	public List<TrackingUser> findStudentsByTenantID(long tenantID) {
		return list(namedQuery("com.tracking.entity.TrackingUser.findStudentsByTenantID")
				.setParameter("tenant_id", tenantID)
				.setParameter("userRole", TrackingUser.STUDENT));
	}

	public List<TrackingUser> findUserByLoginIdAndPassword(String userloginID, String password) {
		return list(namedQuery("com.tracking.entity.TrackingUser.findUserByLoginIdAndPassword")
				.setParameter("userloginID", userloginID)
				.setParameter("password",password));
	}
}
