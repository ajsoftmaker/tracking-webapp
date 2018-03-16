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

public class GetConnections {
	private static final Logger logger = Logger.getLogger(GetConnections.class.getName());
	private CloseableHttpClient httpclient;
	private String url = null;

	public GetConnections(String str) {
		this.url = str.concat("guac-connector/api/connections");
		this.httpclient = HttpClients.createDefault();
	}
	
	public GetConnections(String str, String connectiongroupId) {
		this.url = str.concat("guac-connector/api/connections/").concat(connectiongroupId);
		this.httpclient = HttpClients.createDefault();
	}

	public String Execute() {
		String entity = "";
		try {
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
				logger.warning("Failed to get connections from guacamole profile. Reason: " + entity);
				throw new WebApplicationException(Status.BAD_REQUEST);
			}
		} catch (Exception ex) {
			logger.info("Failed to get connections from guacamole profile. Reason: " + ex);
			throw new WebApplicationException(ex.getMessage(), Status.BAD_REQUEST);
		}

	}

}
