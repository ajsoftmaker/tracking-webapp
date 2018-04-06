package com.tracking;

import java.util.Map;

import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;

import com.tracking.entity.Client;
import com.tracking.entity.Order;
import com.tracking.entity.Tenant;
import com.tracking.entity.TrackingUser;
import com.tracking.resources.ClientResource;
import com.tracking.resources.LoginResource;
import com.tracking.resources.TenantResource;
import com.tracking.resources.TenantsResource;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.CachingAuthenticator;
import io.dropwizard.auth.basic.BasicCredentialAuthFilter;
import io.dropwizard.auth.basic.BasicCredentials;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.db.PooledDataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.server.DefaultServerFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;

public class TrackingWebApplication extends Application<TrackingWebConfiguration> {
	private final HibernateBundle<TrackingWebConfiguration> hibernateBundle = 
            new HibernateBundle<TrackingWebConfiguration>(Client.class, Order.class, 
            		Tenant.class, TrackingUser.class){
//		Batch.class, BatchRequest.class, 
//		Course.class, CourseTests.class, Files.class, GuacDProflie.class,
//		TrackingTag.class, Student.class, StudentBatches.class, 
//		StudentTests.class, Tenant.class, Test.class ,TrackingUser.class ,CourseCount.class
           
				@Override
				public PooledDataSourceFactory getDataSourceFactory(TrackingWebConfiguration configuration) {
					return configuration.getDataSourceFactory();
				}
            };
            
    public static void main(String[] args) throws Exception {
        new TrackingWebApplication().run(args);
    }

   
    @Override
    public String getName() {
        return "Tracking";
    }

    @Override
    public void initialize(Bootstrap<TrackingWebConfiguration> bootstrap) {
        // Enable variable substitution with environment variables
        bootstrap.setConfigurationSourceProvider(
                new SubstitutingSourceProvider(
                        bootstrap.getConfigurationSourceProvider(),
                        new EnvironmentVariableSubstitutor(false)
                )
        );
        bootstrap.addBundle(new AssetsBundle("/webapp", "/", "index.html", "WebApp"));
        bootstrap.addBundle(new MigrationsBundle<TrackingWebConfiguration>() {
            @Override
            public DataSourceFactory getDataSourceFactory(TrackingWebConfiguration configuration) {
                return configuration.getDataSourceFactory();
            }
        });
        bootstrap.addBundle(hibernateBundle);
        bootstrap.addBundle(new ViewBundle<TrackingWebConfiguration>() {
            @Override
            public Map<String, Map<String, String>> getViewConfiguration(TrackingWebConfiguration configuration) {
                return configuration.getViewRendererConfiguration();
            }
        });
    }

    @Override
    public void run(TrackingWebConfiguration configuration, Environment environment) {
    	ApplicationContext.init(configuration);
    	((DefaultServerFactory) configuration.getServerFactory()).setJerseyRootPath("/api/*");
    	environment.jersey().register(RolesAllowedDynamicFeature.class);
    	environment.healthChecks().register("template", new TemplateHealthCheck());
    	
    	CachingAuthenticator<BasicCredentials, TrackingUser> cachingAuthenticator = new CachingAuthenticator<>(
    			environment.metrics(),
    			new TrackingAuthenticator(hibernateBundle.getSessionFactory()),
    			configuration.getAuthenticationCachePolicy());
    			environment.jersey().register(new AuthDynamicFeature(new BasicCredentialAuthFilter.Builder<TrackingUser>()
    			.setAuthenticator(cachingAuthenticator).setRealm("BootInfoTech").buildAuthFilter()));
    			environment.jersey().register(new AuthValueFactoryProvider.Binder<>(TrackingUser.class));
    	
    	registerLabJumpResources(configuration, environment);
      
    }

	private void registerLabJumpResources(TrackingWebConfiguration configuration,Environment environment) {
		final TrackingUserDAO ljuserDAO = new TrackingUserDAO(hibernateBundle.getSessionFactory());
//		final FileDAO fileDAO = new FileDAO(hibernateBundle.getSessionFactory());
//		final StudentDAO studentDAO = new StudentDAO(hibernateBundle.getSessionFactory());
		final TenantDAO tenantDAO = new TenantDAO(hibernateBundle.getSessionFactory());
//		final BatchRequestDAO batchRequestDAO = new BatchRequestDAO(hibernateBundle.getSessionFactory());
//		final CourseDAO courseDAO = new CourseDAO(hibernateBundle.getSessionFactory());
//		final BatchDAO batchDAO = new BatchDAO(hibernateBundle.getSessionFactory());
//		final StudentBatchesDAO studentBatchesDAO = new StudentBatchesDAO(hibernateBundle.getSessionFactory());
//		final TestDAO testDAO = new TestDAO(hibernateBundle.getSessionFactory());
//		final StudentTestsDAO studentTestsDAO = new StudentTestsDAO(hibernateBundle.getSessionFactory());
//		final GuacDProfileDAO guacDProflieDAO = new GuacDProfileDAO(hibernateBundle.getSessionFactory());
//		final CourseCountDAO courseCountDAO = new CourseCountDAO(hibernateBundle.getSessionFactory());
		final LoginResource loginRes = new LoginResource(configuration.getAdminuser(), configuration.getAdminpwd(), ljuserDAO);
		environment.jersey().register(loginRes);
		
		final ClientDAO clientDAO = new ClientDAO(hibernateBundle.getSessionFactory());
		final ClientResource clientResource = new ClientResource(clientDAO);
		environment.jersey().register(clientResource);
		final ClientsResource clientsResource = new ClientsResource(clientDAO);
		environment.jersey().register(clientsResource);
		
		final OrderDAO orderDAO = new OrderDAO(hibernateBundle.getSessionFactory());
		final OrdersResource ordersResource = new OrdersResource(orderDAO);
		environment.jersey().register(ordersResource);
		final OrderResource orderResource = new OrderResource(orderDAO);
		environment.jersey().register(orderResource);
		
//		final CoursesResource coursesResource = new CoursesResource(courseDAO ,testDAO , studentTestsDAO,tenantDAO);
//		environment.jersey().register(coursesResource);
//		final CourseResource courseResource = new CourseResource(courseDAO, configuration.getCoursefileslocation() ,fileDAO ,tenantDAO);
//		environment.jersey().register(courseResource);
		
//		final BatchesResource batchesRes = new BatchesResource(batchDAO);
//		environment.jersey().register(batchesRes);
//		final BatchResource batchRes = new BatchResource(batchDAO);
//		environment.jersey().register(batchRes);
		
//		final BatchRequestResource batchRequestRes = new BatchRequestResource(batchRequestDAO ,courseDAO ,tenantDAO);
//		environment.jersey().register(batchRequestRes);
//		final BatchRequestsResource batchRequestsRes = new BatchRequestsResource(batchRequestDAO ,courseDAO,tenantDAO);
//		environment.jersey().register(batchRequestsRes);
				
//		final StudentsResource studentsResource = new StudentsResource(studentDAO, tenantDAO, ljuserDAO);
//		environment.jersey().register(studentsResource);
//		final StudentResource studentResource = new StudentResource(studentDAO, ljuserDAO);
//		environment.jersey().register(studentResource);
		
//		final StudentBatchesResource studentBatchesResource = new StudentBatchesResource(studentBatchesDAO);
//		environment.jersey().register(studentBatchesResource);
//		final StudentBatchResource studentBatchResource = new StudentBatchResource(studentBatchesDAO);
//		environment.jersey().register(studentBatchResource);
		
//		final StudentTestsResource studentTestsResource = new StudentTestsResource(studentTestsDAO ,studentDAO);
//		environment.jersey().register(studentTestsResource);
//		final StudentTestResource studentTestResource = new StudentTestResource(studentTestsDAO);
//		environment.jersey().register(studentTestResource);
		
		final TenantResource tenantResource = new TenantResource(tenantDAO, ljuserDAO);
		environment.jersey().register(tenantResource);
		final TenantsResource tenantsResource = new TenantsResource(tenantDAO,ljuserDAO);
		environment.jersey().register(tenantsResource);
		
//		final FilesResource filesResource = new FilesResource(fileDAO);
//		environment.jersey().register(filesResource);
//		final FileResource fileResource = new FileResource(fileDAO);
//		environment.jersey().register(fileResource);
		
		
//		final GuacDProfilesResource guacDProfilesResource = new GuacDProfilesResource(guacDProflieDAO);
//		environment.jersey().register(guacDProfilesResource);
//		final GuacDProfileResource guacDProfileResource = new GuacDProfileResource(guacDProflieDAO);
//		environment.jersey().register(guacDProfileResource);
		
//		final TestsResource testsResource = new TestsResource(testDAO);
//		environment.jersey().register(testsResource);
//		final TestResource testResource = new TestResource(testDAO);
//		environment.jersey().register(testResource);
//		final TrackingUsersResource labJumpUserResource = new TrackingUsersResource(ljuserDAO, tenantDAO, studentDAO);
//		environment.jersey().register(labJumpUserResource);
		
//		final TestScriptResource testScriptResource = new TestScriptResource();
//		environment.jersey().register(testScriptResource);
		
		environment.jersey().register(MultiPartFeature.class);
		
//		final CourseCountResource courseCountResourse = new CourseCountResource(courseCountDAO);
//		environment.jersey().register(courseCountResourse);
	}
}
