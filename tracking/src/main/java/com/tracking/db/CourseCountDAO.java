package com.tracking.db;

import org.hibernate.SessionFactory;
import com.tracking.entity.CourseCount;

import io.dropwizard.hibernate.AbstractDAO;

public class CourseCountDAO  extends AbstractDAO<CourseCount>{

	public CourseCountDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
		
	}
	
	public CourseCount create(CourseCount courseCount) {
		return persist(courseCount);
	}
	
	public CourseCount update(CourseCount courseCount) {
		return persist(courseCount);
	}
	
	public CourseCount findByCourseID(String courseID) {
		return uniqueResult(namedQuery("com.tracking.entity.CourseCount.findByCourseID").setParameter("courseID", courseID));
	}

}
