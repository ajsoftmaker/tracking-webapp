package com.tracking.dto;

public class TrackingUserDTO {
	
	
	private String userloginID;

	
	private String password;

	
	private String userRole;
	
	
	private String email;
	
	
	private long tenant_id;
	
	
	private String status;
	
	
	private String token;


	public String getUserloginID() {
		return userloginID;
	}


	public void setUserloginID(String userloginID) {
		this.userloginID = userloginID;
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


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public long getTenant_id() {
		return tenant_id;
	}


	public void setTenant_id(long tenant_id) {
		this.tenant_id = tenant_id;
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public String getToken() {
		return token;
	}


	public void setToken(String token) {
		this.token = token;
	}
	
	
	
}
