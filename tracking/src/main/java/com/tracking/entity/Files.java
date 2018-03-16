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
@Table(name = "files")
@NamedQueries({
    @NamedQuery(
    		name = "com.tracking.entity.Files.findByCourseID", 
    		query = "SELECT f FROM Files f WHERE f.courseID =:courseID"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.Files.findAll", 
    		query = "SELECT f FROM Files f"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.Files.findFileByCourseIdWithFileId", 
    		query = "SELECT f FROM Files f where  f.courseID = :courseID AND f.id = :id"
    )
})
public class Files {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "file_name", nullable = false)
	private String fileName;
	
	@Column(name = "mode", nullable = false)
	private String mode;
	
	@Column(name = "course_id", nullable = false)
	private long courseID;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public long getCourseID() {
		return courseID;
	}

	public void setCourseID(long courseID) {
		this.courseID = courseID;
	}

}
