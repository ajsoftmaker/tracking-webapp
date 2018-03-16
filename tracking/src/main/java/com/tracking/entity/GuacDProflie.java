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
@Table(name = "guacd_profiles")
@NamedQueries({
    @NamedQuery(
            name = "com.tracking.entity.GuacDProflie.findAll",
            query = "SELECT g FROM GuacDProflie g"
    ),
    @NamedQuery(
            name = "com.tracking.entity.GuacDProflie.findById",
            query = "SELECT g FROM GuacDProflie g where g.id =:id"
    )
})

public class GuacDProflie {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "guac_name", nullable = false)
	private String guacName;
	
	@Column(name = "url", nullable = false)
	private String url;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getGuacName() {
		return guacName;
	}

	public void setGuacName(String guacName) {
		this.guacName = guacName;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
}
