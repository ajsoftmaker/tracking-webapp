package com.tracking.entity;

import javax.persistence.Column;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "courses")
@NamedQueries({
    @NamedQuery(
            name = "com.tracking.entity.Course.findAll",
            query = "SELECT c FROM Course c"
    ),
    @NamedQuery(
            name = "com.tracking.entity.Course.findAllByTenant",
            query = "SELECT c FROM Course c where c.customerID =:customerID OR c.customerID = ''"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.Course.findByID", 
    		query = "SELECT c FROM Course c where c.courseID =:courseID"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.Course.findID", 
    		query = "SELECT c FROM Course c where c.id =:id"
    ),@NamedQuery(
            name = "com.tracking.entity.Course.findTenantFavCourses",
            query = "SELECT DISTINCT c FROM Course c, Batch b "
            		+ "WHERE b.courseID = c.id "
            		+ "AND b.tenantID = :tenantid"
    ),
    @NamedQuery(
            name = "com.tracking.entity.Course.findPopularCourses",
            query = "SELECT DISTINCT c FROM Course c, Batch b "
            		+ "WHERE b.courseID = c.id "
    ),
    @NamedQuery(
    		name = "com.tracking.entity.Course.findByName", 
    		query = "SELECT c FROM Course c where c.courseName =:courseName"
    )
})
public class Course {
	public static enum COURSETYPE {FOUNDATION, INTERMEDIATE, ADVANCED};
    
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "course_name", nullable = false)
	private String courseName;
	
	@Column(name = "course_id", nullable = false)
	private String courseID;
	
	@Column(name = "course_type")
	private String courseType;
	
	@Column(name = "course_level")
	private String courseLevel;
	
	@Column(name = "tech_platform")
	private String techPlatform;
	
	@Column(name = "max_class_size")
	private int maxClassSize;
	
	@Column(name = "setup_time_days")
	private int setupTimeDays;
	
	@Column(name = "lab_type")
	private String labType;
	
	@Column(name = "duration_days")
	private int durationDays;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "customer_id")
	private String customerID;
	
	@Column(name = "no_of_test")
	private int noOfTest;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getCourseID() {
		return courseID;
	}

	public void setCourseID(String courseID) {
		this.courseID = courseID;
	}

	public String getCourseType() {
		return courseType;
	}

	public void setCourseType(String courseType) {
		this.courseType = courseType;
	}

	public int getMaxClassSize() {
		return maxClassSize;
	}

	public void setMaxClassSize(int maxClassSize) {
		this.maxClassSize = maxClassSize;
	}

	public int getSetupTimeDays() {
		return setupTimeDays;
	}

	public void setSetupTimeDays(int setupTimeDays) {
		this.setupTimeDays = setupTimeDays;
	}

	public int getDurationDays() {
		return durationDays;
	}

	public void setDurationDays(int durationDays) {
		this.durationDays = durationDays;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCourseLevel() {
		return courseLevel;
	}

	public void setCourseLevel(String courseLevel) {
		this.courseLevel = courseLevel;
	}

	public String getTechPlatform() {
		return techPlatform;
	}

	public void setTechPlatform(String techPlatform) {
		this.techPlatform = techPlatform;
	}

	public String getLabType() {
		return labType;
	}

	public void setLabType(String labType) {
		this.labType = labType;
	}

	public String getCustomerID() {
		return customerID;
	}

	public void setCustomerID(String customerID) {
		this.customerID = customerID;
	}

	public int getNoOfTest() {
		return noOfTest;
	}

	public void setNoOfTest(int noOfTest) {
		this.noOfTest = noOfTest;
	}

}
