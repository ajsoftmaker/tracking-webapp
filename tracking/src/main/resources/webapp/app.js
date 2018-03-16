'use strict';

var labjumpWebApp = angular.module(
		'trackingWebApp',
		[ 'ui.calendar','angularMoment','ui.router', 'ui.bootstrap', 'datatables', 'ngResource', 'ngTable',
				'ngTableResizableColumns', 'ngBootstrap', 'ngMessages','MassAutoComplete',
				'ngSanitize', 'dialogs.main', 'eqRestAPIs', 'angular-loading-bar','checklist-model','chart.js'])
		.config(config)
		.controller('appController', function($location,$http,$rootScope) {
			var path = $location.path();
			if (path.match(/activate/g) == null && path.match(/resetpassword/g) == null ) {
				if($http.defaults.headers.common.Authorization == null || $http.defaults.headers.common.Authorization == undefined) {
					if(localStorage.getItem("rootScope") !=null || localStorage.getItem("rootScope") != undefined) {
						$http.defaults.headers.common.Authorization = localStorage.getItem("rootScope");
						$rootScope.apiUrl="api/"
						localStorage.removeItem("rootScope");
					}else {
						window.location.href = "#/login";
					}
				}
			}
		});

function config($stateProvider, $urlRouterProvider) {
	
	$stateProvider.state('main', {
		url : '/main',
		templateUrl : 'main/main.html',
		controller : "mainController",
	}).state('login', {
		url : '/login',
		templateUrl : 'login/login.html',
		controller : "loginController"
	}).state('multipleId', {
		url : '/login/multipleid',
		templateUrl : 'login/multipleID/multipleID.html',
		controller : "multipleIDController"
	}).state('activate', {
		url : '/activate/:userkey',
		templateUrl : 'login/activate/activate.html',
		controller : "activateController"
	}).state('forgot', {
		url : '/forgot',
		templateUrl : 'login/forgot/forgot.html',
		controller : "forgotController"
	}).state('resetpassword', {
		url : '/resetpassword/:resetKey',
		templateUrl : 'login/resetpassword/resetpassword.html',
		controller : "resetPasswordController"
	}).state('home', {
		url : '/home',
		templateUrl : 'home/home.html',
		controller : "homeController"
	}).state('home.coursedetail', {
		templateUrl : 'coursedetail/viewcoursedetail.html',
		url : '/coursedetail/:ID',
		controller : "viewcoursedetailController"
	}).state('home.batchdetails', {
		templateUrl : 'batchdetails/viewbatchdetails.html',
		url : '/batchdetails/:batchID',
		controller : "viewbatchdetailsController"
	})
	
	// ------------ SUPER ADMIN WORKFLOW ---------------
	.state('home.sadashboard', {
		templateUrl : 'superadmin/sa_dashboard/sa_dashboard.html',
		url : '/sadashboard',
		controller : "saDashboardController"
	}).state('home.samanagetenants', {
		templateUrl : 'superadmin/managetenants/managetenants.html',
		url : '/managetenants',
		controller : "managetenantsController"
	}).state('home.samanagetenants.saaddtenant', {
		templateUrl : 'superadmin/managetenants/addtenant/addtenant.html',
		url : '/addtenant',
		controller : "addtenantController"
	}).state('home.samanagecourses', {
		templateUrl : 'superadmin/managecourses/managecourses.html',
		url : '/managecourses',
		controller : "managecoursesController"
	}).state('home.samanagecourses.saaddcourse', {
		templateUrl : 'superadmin/managecourses/addcourse/addcourse.html',
		url : '/addcourse',
		controller : "addcourseController"
	}).state('home.samanagecourses.saaddcourse.coursedetails', {
		templateUrl : 'superadmin/managecourses/addcourse/coursedetails.html',
		url : '/coursedetails',
		controller : "addcourseController"
	}).state('home.samanagecourses.saaddcourse.coursefiles', {
		templateUrl : 'superadmin/managecourses/addcourse/coursefiles.html',
		url : '/coursefiles',
		controller : "coursefilesController"
	}).state('home.samanagebatches', {
		templateUrl : 'superadmin/managebatches/samanagebatches.html',
		url : '/samanagebatches',
		controller : "samanagebatchesController"
	}).state('home.sasinglebatch', {
		templateUrl : 'superadmin/managebatches/sasinglebatch.html',
		url : '/sasinglebatch/:batchID',
		controller : "sasinglebatchController"
	}).state('home.saguacDProfile', {
		templateUrl : 'superadmin/manageguac/saguacDProfile.html',
		url : '/saguacDProfile',
		controller : "saguacDProfileController"
	})
	//Aarogyadan
	.state('home.samanagevolunteer', {
		templateUrl : 'superadmin/managevolunteer/samanagevolunteer.html',
		url : '/samanagevolunteer',
		controller : "samanagevolunteerController"
	}).state('home.samanagevolunteer.saaddvolunteer', {
		templateUrl : 'superadmin/managevolunteer/addvolunteer/addvolunteer.html',
		url : '/addvolunteer',
		controller : "addvolunteerController"
	})
	
	//Tracking
	.state('home.samanageusers', {
		templateUrl : 'superadmin/manageusers/manageusers.html',
		url : '/samanageusers',
		controller : "manageusersController"
	}).state('home.samanageusers.saadduser', {
		templateUrl : 'superadmin/manageusers/adduser/adduser.html',
		url : '/saadduser',
		controller : "adduserController"
	})
	
	.state('home.samanageorders', {
		templateUrl : 'superadmin/manageorders/manageorders.html',
		url : '/samanageorders',
		controller : "manageordersController"
	}).state('home.samanageorders.saaddorder', {
		templateUrl : 'superadmin/manageorders/addorder/saAddorder.html',
		url : '/saddorder',
		controller : "saAddOrderController"
	})
	
	.state('home.samanageclients', {
		templateUrl : 'superadmin/manageclients/saManageClients.html',
		url : '/samanageclients',
		controller : "saManageClientsController"
	}).state('home.samanageclients.saaddclient', {
		templateUrl : 'superadmin/manageclients/addclient/saAddClient.html',
		url : '/saaddclient',
		controller : "saAddClientController"
	})
	
	.state('home.samanagereports', {
		templateUrl : 'superadmin/managereports/managereports.html',
		url : '/samanagereports',
		controller : "managereportsController"
	})
	
	
	.state('home.tamanageorders', {
		templateUrl : 'tenantadmin/manageorders/manageorders.html',
		url : '/manageorders',
		controller : "manageordersController"
	}).state('home.tamanageorders.taaddorder', {
		templateUrl : 'tenantadmin/manageorders/addorder/addorder.html',
		url : '/addorder',
		controller : "addorderController"
	})
	
	.state('home.tamanageclients', {
		templateUrl : 'tenantadmin/manageclients/manageclients.html',
		url : '/manageclients',
		controller : "manageclientsController"
	}).state('home.tamanageclients.taaddclient', {
		templateUrl : 'tenantadmin/manageclients/addclient/addclient.html',
		url : '/taaddclient',
		controller : "addclientController"
	})
	
	.state('home.tamanagereports', {
		templateUrl : 'tenantadmin/managereports/managereports.html',
		url : '/managereports',
		controller : "managereportsController"
	})
	
//	Tracking End
	
	// ------------ Anagram ---------------
	.state('home.test', {
		templateUrl : 'superadmin/test/test.html',
		url : '/test',
		controller : "testController"
	}).state('home.companyInfo', {
		templateUrl : 'superadmin/testcompanyinfo/companyinfo.html',
		url : '/companyInformation',
		controller : "companyinfoController"
	})
	
	// ------------ TENANT ADMIN WORKFLOW ---------------
	.state('home.tadashboard', {
		templateUrl : 'tenantadmin/ta_dashboard/ta_dashboard.html',
		url : '/tadashboard',
		controller : "taDashboardController"
	}).state('home.tamanagestudents', {
		templateUrl : 'tenantadmin/managestudents/managestudents.html',
		url : '/managestudents',
		controller : "managestudentsController"
	}).state('home.tamanagestudents.taaddStudent', {
		templateUrl : 'tenantadmin/managestudents/addstudent/addstudent.html',
		url : '/addstudent/:studentID',
		controller : "addstudentController"
	}).state('home.taimportStudents', {
		templateUrl : 'tenantadmin/managestudents/importstudents/importstudents.html',
		url : '/managestudents/importStudents',
		controller : "importstudentsController"
	}).state('home.taviewcourses', {
		templateUrl : 'tenantadmin/viewcourses/viewcourses.html',
		url : '/viewcourses',
		controller : "viewcoursesController"
	}).state('home.createbatch', {
		templateUrl : 'tenantadmin/createbatch/createbatch.html',
		url : '/createbatch/:ID',
		controller : "createbatchController"
	}).state('home.createbatch.importbatchstudents', {
		templateUrl : 'tenantadmin/createbatch/importbatchstudents/importbatchstudents.html',
		url : '/importbatchstudents',
		controller : "importbatchstudentsController"
	}).state('home.tamanagebatches', {
		templateUrl : 'tenantadmin/manageBatches/tamanagebatches.html',
		url : '/tamanagebatches',
		controller : "tamanagebatchesController"
	}).state('home.tabatchdetail', {
		templateUrl : 'tenantadmin/manageBatches/batchdetail/tabatchdetail.html',
		url : '/tamanagebatches/tabatchdetail/:batchID/:type',
		controller : "tabatchdetailController"
	}).state('home.tadetails', {
		templateUrl : 'tenantadmin/details/tenantDetail.html',
		url : '/tenantDetail',
		controller : "tenantDetailController"
	})
//	.state('home.tamanagereports', {
//		templateUrl : 'tenantadmin/manageReports/tamanagereports.html',
//		url : '/tamanagereports',
//		controller : "tamanagereportsController"
//	}).state('home.taviewreports', {
//		templateUrl : 'tenantadmin/manageReports/viewreports/taviewreports.html',
//		url : '/tamanagereports/taviewreports/:type',
//		controller : "taviewreportsController"
//	}).state('home.tabatchreports', {
//		templateUrl : 'tenantadmin/manageReports/viewreports/taviewbatchreports.html',
//		url : '/tamanagereports/taviewbatchreports/:type',
//		controller : "taviewbatchreportsController"
//	})
	
	// --------------- STUDENT WORKFLOW ------------------
	.state('home.stdashboard', {
		templateUrl : 'student/st_dashboard/st_dashboard.html',
		url : '/stdashboard',
		controller : "stDashboardController"
	}).state('home.stbatches', {
		templateUrl : 'student/stbatches/stbatches.html',
		url : '/stbatches',
		controller : "stbatchesController"
	}).state('home.stcontinuebatch', {
		templateUrl : 'student/stbatches/stcontinuebatch.html',
		url : '/stcontinuebatch/:batchID/:courseID/:studentID',
		controller : "stcontinuebatchController"
	}).state('home.stviewcourses', {
		templateUrl : 'student/viewcourses_stud/viewcourses_stud.html',
		url : '/viewcoursesStudent',
		controller : "viewcourses_studController"
	})
}
