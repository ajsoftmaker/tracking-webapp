package com.tracking.guac.connector;

import java.net.URI;
import java.util.logging.Logger;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response.Status;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class GetConnectionGroups {
	private static final Logger logger = Logger.getLogger(GetConnectionGroups.class.getName());
	private CloseableHttpClient httpclient;
	private String url = null;

	public GetConnectionGroups(String str) {
		this.url = str.concat("guac-connector/api/connectiongroups");
		this.httpclient = HttpClients.createDefault();
	}

	public String Execute() {
		String entity = "";
		try {
			logger.info("Guac- URL : " + url);
			URI uri = new URI(url);
			httpclient = HttpClients.createDefault();
			HttpGet httpGet = new HttpGet(uri);

			CloseableHttpResponse response = httpclient.execute(httpGet);
			entity = EntityUtils.toString(response.getEntity());
			Integer errorCode = response.getStatusLine().getStatusCode();

			if (errorCode == 200) {
				logger.info(entity);
				return entity;
			} else {
				logger.warning("Failed to get groups from guacamole profile. Reason: " + entity);
				 throw new WebApplicationException(Status.BAD_REQUEST);
			}
		} catch (Exception ex) {
			 logger.info("Failed to get groups from guacamole profile. Reason: " + ex);
			 throw new WebApplicationException(ex.getMessage(), Status.BAD_REQUEST);
		}

	}

}
