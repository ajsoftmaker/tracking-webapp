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
@Table(name = "tenants")
@NamedQueries({ @NamedQuery(name = "com.tracking.entity.Tenant.findAll", query = "SELECT t FROM Tenant t"),
		@NamedQuery(name = "com.tracking.entity.Tenant.findById", query = "SELECT t FROM Tenant t where t.id = :id"),
		@NamedQuery(name = "com.tracking.entity.Tenant.findByTenantCode", query = "SELECT t FROM Tenant t where t.tenantCode = :tenantCode"),
		@NamedQuery(name = "com.tracking.entity.Tenant.findByEmail", query = "SELECT t FROM Tenant t where t.primaryEmail = :primaryEmail")})

public class Tenant {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "tenant_name", nullable = false)
	private String tenantName;

	@Column(name = "tenant_code", nullable = false)
	private String tenantCode;

	@Column(name = "tenant_status")
	private String tenantStatus;

	@Column(name = "pri_email")
	private String primaryEmail;

	@Column(name = "sec_email")
	private String secondaryEmail;

	@Column(name = "phonenum1")
	private String phone1;

	@Column(name = "phonenum2")
	private String phone2;

	@Column(name = "contact1_name")
	private String contact1Name;

	@Column(name = "contact2_name")
	private String contact2Name;
	
	@Column(name = "street")
	private String street;
	
	@Column(name = "landmark")
	private String landmark;
	
	@Column(name = "city")
	private String city;
	
	@Column(name = "tenant_logo")
	private byte[] tenantLogo;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTenantName() {
		return tenantName;
	}

	public void setTenantName(String tenantName) {
		this.tenantName = tenantName;
	}

	public String getTenantCode() {
		return tenantCode;
	}

	public void setTenantCode(String tenantCode) {
		this.tenantCode = tenantCode;
	}

	public String getTenantStatus() {
		return tenantStatus;
	}

	public void setTenantStatus(String tenantStatus) {
		this.tenantStatus = tenantStatus;
	}

	public String getPrimaryEmail() {
		return primaryEmail;
	}

	public void setPrimaryEmail(String primaryEmail) {
		this.primaryEmail = primaryEmail;
	}

	public String getSecondaryEmail() {
		return secondaryEmail;
	}

	public void setSecondaryEmail(String secondaryEmail) {
		this.secondaryEmail = secondaryEmail;
	}

	public String getPhone1() {
		return phone1;
	}

	public void setPhone1(String phone1) {
		this.phone1 = phone1;
	}

	public String getPhone2() {
		return phone2;
	}

	public void setPhone2(String phone2) {
		this.phone2 = phone2;
	}

	public String getContact1Name() {
		return contact1Name;
	}

	public void setContact1Name(String contact1Name) {
		this.contact1Name = contact1Name;
	}

	public String getContact2Name() {
		return contact2Name;
	}

	public void setContact2Name(String contact2Name) {
		this.contact2Name = contact2Name;
	}
	
	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getLandmark() {
		return landmark;
	}

	public void setLandmark(String landmark) {
		this.landmark = landmark;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public byte[] getTenantLogo() {
		return tenantLogo;
	}

	public void setTenantLogo(byte[] tenantLogo) {
		this.tenantLogo = tenantLogo;
	}

}
