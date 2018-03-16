package com.tracking.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "students")
@NamedQueries({
	@NamedQuery(
            name = "com.tracking.core.Student.findAll",
            query = "SELECT s FROM Student s"
    ),
    @NamedQuery(
    		name = "com.tracking.core.Student.findByStudentID", 
    		query = "SELECT s FROM Student s where studentID =:studentID"
    ),
    @NamedQuery(
    		name = "com.tracking.core.Student.findByID", 
    		query = "SELECT s FROM Student s where id =:id"
    ),
    @NamedQuery(
    		name = "com.tracking.core.Student.findByEMail", 
    		query = "SELECT s FROM Student s where eMail =:eMail"
    ),
    @NamedQuery(
    		name = "com.tracking.core.Student.findByTenantID", 
    		query = "SELECT s FROM Student s where tenantID =:tenantID"
    )
})
public class Student {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "student_name", nullable = false)
	private String studentName;
	
	@Column(name = "student_id", nullable = false)
	private String studentID;

	@Column(name = "status")
	private String studentStatus;
	
	@Column(name = "tenant_id", nullable = false)
	private long tenantID;
	
	@Column(name = "email")
	private String eMail;
	
	@Column(name = "phonenum")
	private String phoneNum;
	
	@Column(name = "additional_info")
	private String additionalInfo;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public String getStudentID() {
		return studentID;
	}

	public void setStudentID(String studentID) {
		this.studentID = studentID;
	}

	public String getStudentStatus() {
		return studentStatus;
	}

	public void setStudentStatus(String studentStatus) {
		this.studentStatus = studentStatus;
	}

	public long getTenantID() {
		return tenantID;
	}

	public void setTenantID(long tenantID) {
		this.tenantID = tenantID;
	}

	public String getAdditionalInfo() {
		return additionalInfo;
	}

	public void setAdditionalInfo(String additioalInfo) {
		this.additionalInfo = additioalInfo;
	}

	public String geteMail() {
		return eMail;
	}

	public void seteMail(String eMail) {
		this.eMail = eMail;
	}

	public String getPhoneNum() {
		return phoneNum;
	}

	public void setPhoneNum(String phoneNum) {
		this.phoneNum = phoneNum;
	}
}
