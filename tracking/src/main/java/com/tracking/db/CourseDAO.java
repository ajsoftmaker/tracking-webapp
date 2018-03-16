package com.tracking.db;

import java.util.List;
import org.hibernate.SessionFactory;
import com.tracking.entity.Course;

import io.dropwizard.hibernate.AbstractDAO;

public class CourseDAO extends AbstractDAO<Course> {

	public CourseDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public List<Course> findAll() {
		return list(namedQuery("com.tracking.entity.Course.findAll"));
	}
	
	public Course create(Course course) {
		return persist(course);

	}

	public Course findByCourseID(String courseID) {
		return uniqueResult(
				namedQuery("com.tracking.entity.Course.findByID").setParameter("courseID", courseID));
	}

	public Course update(Course course) {
		return persist(course);
	}
	
	public List<Course> getTenantFavCourses(long tenantID) {
		return list(namedQuery("com.tracking.entity.Course.findTenantFavCourses").setParameter("tenantid", tenantID));
	}
	
	public List<Course> getPopularCourses() {
		return list(namedQuery("com.tracking.entity.Course.findPopularCourses"));
	}

	public void delete(String courseID) {
		currentSession().delete(findByCourseID(courseID));
	}

	public Course findByID(long courseID) {
		return uniqueResult(namedQuery("com.tracking.entity.Course.findID").setParameter("id", courseID));
	}

	public List<Course> findAllByTenant(String tenantCode) {
		return list(namedQuery("com.tracking.entity.Course.findAllByTenant").setParameter("customerID", tenantCode));
	}
}
