package com.tracking.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "batch_requests")
@NamedQueries({
    @NamedQuery(
            name = "com.tracking.entity.BatchRequest.findAll",
            query = "SELECT br FROM BatchRequest br"
    ),
    @NamedQuery(
            name = "com.tracking.entity.BatchRequest.findAllByTenant",
            query = "SELECT br FROM BatchRequest br where br.tenantID =:tenantID"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.BatchRequest.findByBatchRequest", 
    		query = "SELECT br FROM BatchRequest br where br.courseID =:courseID and br.tenantID =:tenantID and br.startDate=:startDate"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.BatchRequest.findById", 
    		query = "SELECT br FROM BatchRequest br where br.id =:id"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.BatchRequest.allBatchRequestNotification", 
    		query = "UPDATE BatchRequest set notification = '1' where notification = '0'"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.BatchRequest.allBatchRequestNotificationByTenant", 
    		query = "UPDATE BatchRequest set notification='2' where tenantID =:tenantID AND notification = '1'"
    ),
    @NamedQuery(
            name = "com.tracking.entity.BatchRequest.findByRequestStatus",
            query = "SELECT br FROM BatchRequest br where br.tenantID =:tenantID AND br.requestStatus =:requestStatus"
    )
})

public class BatchRequest {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "course_id", nullable = false)
	private long courseID;
	
	@Column(name = "tenant_id", nullable = false)
	private long tenantID;
	
	@Column(name = "num_students")
	private long numStudents;
	
	@Column(name = "students_id_list")
	private String studentsIDList;

	@Column(name = "start_date")
	private String startDate;
	
	@Column(name = "request_status")
	private String requestStatus;
	
	@Column(name = "reason")
	private String reason;
	
	@Column(name = "creation_date")
	private Date creationDate;
	
	@Column(name = "notification")
	private int notification;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getCourseID() {
		return courseID;
	}

	public void setCourseID(long courseID) {
		this.courseID = courseID;
	}

	public long getTenantID() {
		return tenantID;
	}

	public void setTenantID(long tenantID) {
		this.tenantID = tenantID;
	}

	public long getNumStudents() {
		return numStudents;
	}

	public void setNumStudents(long numStudents) {
		this.numStudents = numStudents;
	}

	public String getStudentsIDList() {
		return studentsIDList;
	}

	public void setStudentsIDList(String studentsIDList) {
		this.studentsIDList = studentsIDList;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getRequestStatus() {
		return requestStatus;
	}

	public void setRequestStatus(String requestStatus) {
		this.requestStatus = requestStatus;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public int getNotification() {
		return notification;
	}

	public void setNotification(int notification) {
		this.notification = notification;
	}

}
