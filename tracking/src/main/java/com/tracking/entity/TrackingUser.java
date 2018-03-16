package com.tracking.entity;

import java.security.Principal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "trackingusers")
@NamedQueries({
		@NamedQuery(name = "com.tracking.entity.TrackingUser.findByuserloginID", query = "SELECT l FROM TrackingUser l where l.userloginID = :userloginID") ,
		@NamedQuery(name = "com.tracking.entity.TrackingUser.findByEmailWithRole", query = "SELECT l FROM TrackingUser l where l.email = :email and l.userRole = :userRole") ,
		@NamedQuery(name = "com.tracking.entity.TrackingUser.findByEmail", query = "SELECT l FROM TrackingUser l where l.email = :email") ,
		@NamedQuery(name = "com.tracking.entity.TrackingUser.findStudentsByTenantID", query = "SELECT l FROM TrackingUser l where l.tenant_id = :tenant_id and l.userRole = :userRole"),
		@NamedQuery(name = "com.tracking.entity.TrackingUser.findUserByLoginIdAndPassword", query = "SELECT l FROM TrackingUser l where l.userloginID = :userloginID and l.password = :password")})
public class TrackingUser implements Principal{
	public static final String STUDENT = "student";
	public static final String TENANTADMIN = "tenantadmin";
	public static final String SUPERADMIN = "superadmin";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "user_loginID", nullable = false)
	private String userloginID;

	@Column(name = "user_pwd", nullable = false)
	private String password;

	@Column(name = "user_role", nullable = false)
	private String userRole;
	
	@Column(name = "email", nullable = false)
	private String email;
	
	@Column(name = "tenant_id", nullable = false)
	private long tenant_id;
	
	@Column(name = "status")
	private String status;

	public TrackingUser() {

	}

	public TrackingUser(String user, String pwd, String role) {
		this.userloginID = user;
		this.password = pwd;
		this.userRole = role;
		
	}

	public TrackingUser(String username) {
		this.userloginID = username;
	}

	public boolean isUserInRole(String roleToCheck) {
		return true;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getLoginID() {
		return userloginID;
	}

	public void setLoginID(String loginID) {
		this.userloginID = loginID;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUserRole() {
		return userRole;
	}

	public void setUserRole(String userRole) {
		this.userRole = userRole;
	}
	
	public void setTenant_id(long tenant_id) {
		this.tenant_id = tenant_id;
	}
	
	public long getTenant_id() {
		return tenant_id;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}

	public String getUserloginID() {
		return userloginID;
	}

	public void setUserloginID(String userloginID) {
		this.userloginID = userloginID;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String getName() {
		return this.userloginID;
	}
}
