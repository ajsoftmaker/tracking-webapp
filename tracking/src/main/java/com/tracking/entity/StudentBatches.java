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
@Table(name = "students_batches")
@NamedQueries({
	@NamedQuery(
            name = "com.tracking.entity.StudentBatches.findAll",
            query = "SELECT stb FROM StudentBatches stb order by id"
    ),
    @NamedQuery(
            name = "com.tracking.entity.StudentBatches.findAllByBatchID",
            query = "SELECT stb FROM StudentBatches stb where stb.batchID=:batchID"
    ),
    @NamedQuery(
            name = "com.tracking.entity.StudentBatches.findAllByStudentID",
            query = "SELECT stb FROM StudentBatches stb where stb.studentID=:studentID"
    ),
    @NamedQuery(
            name = "com.tracking.entity.StudentBatches.getByBatchIDStudentID",
            query = "SELECT stb FROM StudentBatches stb "
            		+ "WHERE stb.studentID=:studentid AND stb.batchID=:batchid"
    )
})
public class StudentBatches {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "student_id", nullable = false)
	private long studentID;
	
	@Column(name = "batch_id", nullable = false)
	private long batchID;
	
	@Column(name = "status", nullable = false)
	private String status;
	
	@Column(name = "pod_name")
	private String podName;
	
	@Column(name = "pod_id")
	private Long podId;
	
	@Column(name = "guac_profile_id")
	private Long guacProfileId;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getStudentID() {
		return studentID;
	}

	public void setStudentID(long studentID) {
		this.studentID = studentID;
	}

	public long getBatchID() {
		return batchID;
	}

	public void setBatchID(long batchID) {
		this.batchID = batchID;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getPodName() {
		return podName;
	}

	public void setPodName(String podName) {
		this.podName = podName;
	}

	public Long getGuacProfileId() {
		return guacProfileId;
	}

	public void setGuacProfileId(Long guacProfileId) {
		this.guacProfileId = guacProfileId;
	}

	public Long getPodId() {
		return podId;
	}

	public void setPodId(Long podId) {
		this.podId = podId;
	}

}
