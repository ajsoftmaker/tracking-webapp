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
@Table(name = "clients")
@NamedQueries({ @NamedQuery(name = "com.tracking.entity.Client.findAll", query = "SELECT c FROM Client c"),
		@NamedQuery(name = "com.tracking.entity.Client.findById", query = "SELECT c FROM Client c where c.id = :id"),
		@NamedQuery(name = "com.tracking.entity.Client.findByEmailPhone", query = "SELECT c FROM Client c where c.clientEmail = :clientEmail OR c.contactNumber = :contactNumber")})

public class Client {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "client_name", nullable = false)
	private String clientName;

	@Column(name = "client_street", nullable = false)
	private String clientStreet;

	@Column(name = "client_landmark")
	private String clientLandmark;

	@Column(name = "client_city")
	private String clientCity;

	@Column(name = "client_email")
	private String clientEmail;

	@Column(name = "contact_number")
	private String contactNumber;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public String getClientStreet() {
		return clientStreet;
	}

	public void setClientStreet(String clientStreet) {
		this.clientStreet = clientStreet;
	}

	public String getClientLandmark() {
		return clientLandmark;
	}

	public void setClientLandmark(String clientLandmark) {
		this.clientLandmark = clientLandmark;
	}

	public String getClientCity() {
		return clientCity;
	}

	public void setClientCity(String clientCity) {
		this.clientCity = clientCity;
	}

	public String getClientEmail() {
		return clientEmail;
	}

	public void setClientEmail(String clientEmail) {
		this.clientEmail = clientEmail;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}
}
