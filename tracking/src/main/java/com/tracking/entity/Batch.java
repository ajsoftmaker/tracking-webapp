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
@Table(name = "batches")
@NamedQueries({
    @NamedQuery(
            name = "com.tracking.entity.Batch.findAll",
            query = "SELECT b FROM Batch b order by id"
    ),
    @NamedQuery(
            name = "com.tracking.entity.Batch.findAllByTenant",
            query = "SELECT b FROM Batch b where b.tenantID = :tenantID order by id"
    ),
    @NamedQuery(
            name = "com.tracking.entity.Batch.findById",
            query = "SELECT b FROM Batch b where b.id = :id"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.Batch.findByBatch", 
    		query = "SELECT b FROM Batch b where b.courseID =:courseID and b.tenantID =:tenantID and b.startDate=:startDate"
    )
})

public class Batch {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "course_id", nullable = false)
	private long courseID;
	
	@Column(name = "tenant_id", nullable = false)
	private long tenantID;
	
	@Column(name = "batch_name")
	private String batchName;
	
	@Column(name = "state")
	private String batchState;
	
	@Column(name = "num_students")
	private int numStudents;

	@Column(name = "start_date")
	private String startDate;
	
	@Column(name = "end_date")
	private String endDate;
	
	@Column(name = "setup_status")
	private String batchSetupStatus;

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

	public String getBatchName() {
		return batchName;
	}

	public void setBatchName(String batchName) {
		this.batchName = batchName;
	}

	public String getBatchState() {
		return batchState;
	}

	public void setBatchState(String batchState) {
		this.batchState = batchState;
	}

	public int getNumStudents() {
		return numStudents;
	}

	public void setNumStudents(int numStudents) {
		this.numStudents = numStudents;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getBatchSetupStatus() {
		return batchSetupStatus;
	}

	public void setBatchSetupStatus(String batchSetupStatus) {
		this.batchSetupStatus = batchSetupStatus;
	}
}
