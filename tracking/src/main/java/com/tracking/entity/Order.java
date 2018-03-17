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
@Table(name = "orders")
@NamedQueries({ @NamedQuery(name = "com.tracking.entity.Order.findAll", query = "SELECT o FROM Order o"),
		@NamedQuery(name = "com.tracking.entity.Order.findById", query = "SELECT o FROM Order o where o.id = :id")})

public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "order_type", nullable = false)
	private String orderType;

	@Column(name = "order_status", nullable = false)
	private String orderStatus;

	@Column(name = "order_location")
	private String orderLocation;

	@Column(name = "order_weight_mode")
	private String orderWeightMode;

	@Column(name = "order_weight")
	private String orderWeight;

	@Column(name = "order_from", nullable = false)
	private long orderFrom;
	
	@Column(name = "order_to")
	private long orderTo;
	
	@Column(name = "trackingusers_id")
	private long trackingusers_id;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getOrderType() {
		return orderType;
	}

	public void setOrderType(String orderType) {
		this.orderType = orderType;
	}

	public String getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(String orderStatus) {
		this.orderStatus = orderStatus;
	}

	public String getOrderLocation() {
		return orderLocation;
	}

	public void setOrderLocation(String orderLocation) {
		this.orderLocation = orderLocation;
	}

	public String getOrderWeightMode() {
		return orderWeightMode;
	}

	public void setOrderWeightMode(String orderWeightMode) {
		this.orderWeightMode = orderWeightMode;
	}

	public String getOrderWeight() {
		return orderWeight;
	}

	public void setOrderWeight(String orderWeight) {
		this.orderWeight = orderWeight;
	}

	public long getOrderFrom() {
		return orderFrom;
	}

	public void setOrderFrom(long orderFrom) {
		this.orderFrom = orderFrom;
	}

	public long getOrderTo() {
		return orderTo;
	}

	public void setOrderTo(long orderTo) {
		this.orderTo = orderTo;
	}

	public long getTrackingusers_id() {
		return trackingusers_id;
	}

	public void setTrackingusers_id(long trackingusers_id) {
		this.trackingusers_id = trackingusers_id;
	}

}
