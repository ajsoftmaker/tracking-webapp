package com.tracking;

import java.util.Collections;
import java.util.Map;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.cache.CacheBuilderSpec;
import com.google.common.collect.ImmutableMap;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;

public class TrackingWebConfiguration extends Configuration {

	@Valid
	@NotNull
	private DataSourceFactory database = new DataSourceFactory();

	@NotNull
	private Map<String, Map<String, String>> viewRendererConfiguration = Collections.emptyMap();
	
	@Valid
	@NotNull
	private String adminuser;

	@Valid
	@NotNull
	private String adminpwd;

	@Valid
	@NotNull
	private String domainurl;

	@Valid
	@NotNull
	@JsonProperty("mailUsername")
	private String mailUsername;

	@Valid
	@NotNull
	@JsonProperty("mailPassword")
	private String mailPassword;
	
	@Valid
	@NotNull
	private String coursefileslocation;
	
	@Valid
	@NotNull
	@JsonProperty("gucamoleurl")
	private String gucamoleurl;
	
	@Valid
	@NotNull
	@JsonProperty("verify")
	private String verify;
	
	@Valid
	@NotNull
	@JsonProperty("reset")
	private String reset;
	
	@Valid
	@NotNull
	@JsonProperty("scriptexecuterurl")
	private String scriptexecuterurl;
	
	@Valid
	@NotNull
	@JsonProperty("mailHeader")
	private String mailHeader;
	
	@Valid
	@NotNull
	private CacheBuilderSpec authenticationCachePolicy;
	
	@JsonProperty("database")
	public DataSourceFactory getDataSourceFactory() {
		return database;
	}

	@JsonProperty("database")
	public void setDataSourceFactory(DataSourceFactory dataSourceFactory) {
		this.database = dataSourceFactory;
	}

	@JsonProperty("viewRendererConfiguration")
	public Map<String, Map<String, String>> getViewRendererConfiguration() {
		return viewRendererConfiguration;
	}

	@JsonProperty("viewRendererConfiguration")
	public void setViewRendererConfiguration(Map<String, Map<String, String>> viewRendererConfiguration) {
		final ImmutableMap.Builder<String, Map<String, String>> builder = ImmutableMap.builder();
		for (Map.Entry<String, Map<String, String>> entry : viewRendererConfiguration.entrySet()) {
			builder.put(entry.getKey(), ImmutableMap.copyOf(entry.getValue()));
		}
		this.viewRendererConfiguration = builder.build();
	}

	public DataSourceFactory getDatabase() {
		return database;
	}

	public void setDatabase(DataSourceFactory database) {
		this.database = database;
	}

	@JsonProperty("adminuser")
	public String getAdminuser() {
		return adminuser;
	}

	@JsonProperty("adminuser")
	public void setAdminuser(String adminuser) {
		this.adminuser = adminuser;
	}

	@JsonProperty("adminpwd")
	public String getAdminpwd() {
		return adminpwd;
	}

	@JsonProperty("adminpwd")
	public void setAdminpwd(String adminpwd) {
		this.adminpwd = adminpwd;
	}

	@JsonProperty("domainurl")
	public String getDomainurl() {
		return domainurl;
	}

	@JsonProperty("domainurl")
	public void setDomainurl(String domainurl) {
		this.domainurl = domainurl;
	}

	public String getMailUsername() {
		return mailUsername;
	}

	public void setMailUsername(String mailUsername) {
		this.mailUsername = mailUsername;
	}

	public String getMailPassword() {
		return mailPassword;
	}

	public void setMailPassword(String mailPassword) {
		this.mailPassword = mailPassword;
	}


	public String getVerify() {
		return verify;
	}

	public void setVerify(String verify) {
		this.verify = verify;
	}

	public String getReset() {
		return reset;
	}

	public void setReset(String reset) {
		this.reset = reset;
	}
	
	public String getScriptexecuterurl() {
		return scriptexecuterurl;
	}

	public void setScriptexecuterurl(String scriptexecuterurl) {
		this.scriptexecuterurl = scriptexecuterurl;
	}

	public String getMailHeader() {
		return mailHeader;
	}

	public void setMailHeader(String mailHeader) {
		this.mailHeader = mailHeader;
	}
	
	@JsonProperty("authenticationCachePolicy")
	public CacheBuilderSpec getAuthenticationCachePolicy() {
		return authenticationCachePolicy;
	}

	@JsonProperty("authenticationCachePolicy")
	public void setAuthenticationCachePolicy(CacheBuilderSpec cbs) {
		authenticationCachePolicy = cbs;
	}
}
