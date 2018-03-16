package com.tracking.db;

import java.util.List;

import org.hibernate.SessionFactory;
import com.tracking.entity.Files;
import io.dropwizard.hibernate.AbstractDAO;

public class FileDAO extends AbstractDAO<Files> {

	public FileDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public Files create(Files file) {
		return persist(file);
	}

	public List<Files> getFilesForCourseID(String courseID) {
		return list(namedQuery("com.tracking.entity.Files.findByCourseID").setParameter("courseID", courseID));
	}

	public List<Files> findFileByCourseID(long courseID) {
		return list(namedQuery("com.tracking.entity.Files.findByCourseID").setParameter("courseID", courseID));
	}

	public List<Files> findFiles() {
		return list(namedQuery("com.tracking.entity.Files.findAll"));
	}
	
	public Files findFileByCourseIdWithFileId(long courseID , long fileID) {
		return uniqueResult(namedQuery("com.tracking.entity.Files.findFileByCourseIdWithFileId")
				.setParameter("courseID", courseID)
				.setParameter("id", fileID));
	}
	
	public void delete(long courseID , long fileID) {
		currentSession().delete(findFileByCourseIdWithFileId(courseID,fileID));
	}

}
