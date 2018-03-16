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
@Table(name = "tests")
@NamedQueries({
    @NamedQuery(
            name = "com.tracking.entity.Test.findAll",
            query = "SELECT t FROM Test t"
    ),
    @NamedQuery(
            name = "com.tracking.entity.Test.findByTenantName",
            query = "SELECT t FROM Test t where t.testName = :testName"
    ),
    @NamedQuery(
            name = "com.tracking.entity.Test.findById",
            query = "SELECT t FROM Test t where t.id = :id"
    ),
    @NamedQuery(
            name = "com.tracking.entity.Test.findAllByCourseID",
            query = "SELECT t FROM Test t where t.courseID = :courseID"
    )
})
public class Test {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "course_id", nullable = false)
	private long courseID;
	
	@Column(name = "test_name", nullable = false)
	private String testName;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "reset_script")
	private String resetScript;
	
	@Column(name = "verify_script")
	private String verifyScript;

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

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getResetScript() {
		return resetScript;
	}

	public void setResetScript(String resetScript) {
		this.resetScript = resetScript;
	}

	public String getVerifyScript() {
		return verifyScript;
	}

	public void setVerifyScript(String verifyScript) {
		this.verifyScript = verifyScript;
	}
}
