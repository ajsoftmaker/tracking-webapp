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
@Table(name = "students_tests")
@NamedQueries({
    @NamedQuery(
    		name = "com.tracking.entity.StudentTests.findByStudentTestID", 
    		query = "SELECT st FROM StudentTests st where st.studentID =:studentID and st.testID =:testID"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.StudentTests.findAll", 
    		query = "SELECT st FROM StudentTests st"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.StudentTests.findByStudentID", 
    		query = "SELECT st FROM StudentTests st where st.studentID =:studentID"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.StudentTests.findByResultWithStudentId", 
    		query = "SELECT st FROM StudentTests st where st.studentID =:studentID and st.results =:results"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.StudentTests.findByTestId", 
    		query = "SELECT st FROM StudentTests st where st.testID =:testID"
    ),
    @NamedQuery(
    		name = "com.tracking.entity.StudentTests.findByResultWithTestId", 
    		query = "SELECT st FROM StudentTests st where st.testID =:testID and st.results =:results"
    )
    
    
})
public class StudentTests {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "student_id", nullable = false)
	private long studentID;
	
	@Column(name = "test_id", nullable = false)
	private long testID;
	
	@Column(name = "status")
	private String status;
	
	@Column(name = "results")
	private String results;

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

	public long getTestID() {
		return testID;
	}

	public void setTestID(long testID) {
		this.testID = testID;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getResults() {
		return results;
	}

	public void setResults(String results) {
		this.results = results;
	}
}
