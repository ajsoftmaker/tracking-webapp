package com.tracking;

public class ApplicationContext {

	private static ApplicationContext instance = null;
	private TrackingWebConfiguration config;

	private ApplicationContext(TrackingWebConfiguration config) {
		this.config = config;
	}

	public static ApplicationContext init(TrackingWebConfiguration config) {
		instance = new ApplicationContext(config);
		return getInstance();
	}

	public static ApplicationContext getInstance() {
		if (instance == null) {
			throw new RuntimeException("Application Context is not initialized !");
		}

		return instance;
	}

	public TrackingWebConfiguration getConfig() {
		return config;
	}

}
