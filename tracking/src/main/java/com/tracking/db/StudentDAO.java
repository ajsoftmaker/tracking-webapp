package com.tracking.db;

import java.util.List;
import javax.ws.rs.core.Response;
import org.hibernate.SessionFactory;

import com.tracking.entity.Student;

import io.dropwizard.hibernate.AbstractDAO;

public class StudentDAO extends AbstractDAO<Student> {

	public StudentDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	public List<Student> findAll() {
		return list(namedQuery("com.tracking.core.Student.findAll"));
	}

	public Response create(Student student) {
		Response response = null;
		Student studentExists = findByStudentID(student.getStudentID());
		if (studentExists != null) {
			response = Response.notModified("A student with this ID already exists").build();
		} else {
			persist(student);
			response = Response.ok().build();
		}
		return response;
	}

	public Student findByStudentID(String studentID) {
		return uniqueResult(
				namedQuery("com.tracking.core.Student.findByStudentID").setParameter("studentID", studentID));
	}

	public Student findByID(long studentID) {
		return uniqueResult(namedQuery("com.tracking.core.Student.findByID").setParameter("id", studentID));
	}

	public Student update(Student student) {
		return persist(student);
	}

	public Student findByEmail(String email) {
		return uniqueResult(namedQuery("com.tracking.core.Student.findByEMail").setParameter("eMail", email));
	}

	public List<Student> findByTenantID(long id) {
		return list(namedQuery("com.tracking.core.Student.findByTenantID").setParameter("tenantID", id));
	}
}
