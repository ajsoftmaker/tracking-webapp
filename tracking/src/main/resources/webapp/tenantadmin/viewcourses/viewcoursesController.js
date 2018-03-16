'use strict';

angular.module('trackingWebApp')
	.controller('viewcoursesController', viewcoursesController);

function viewcoursesController($scope, $rootScope, $state, $filter, dialogs, restAPIService,$timeout){
	$scope.courses = [];
	$scope.batches = [];
	$scope.favCourses = [];
	$scope.popularCourses = [];
	$scope.coursesToShow = [];
	$scope.tableHeading = "List Of Available Courses";
	
	$timeout(function () {
		 if($scope.coursesToShow.length < 10) {
			 $('#taCoursesToShowDataTable_paginate').attr("style","display:none;");
		 }
	}, 1000);
	
	getAllCourses();
	getFavCourses();
	getPoularCourses();
	
	function getAllCourses() {
		var promise1 = restAPIService.coursesService().query();
		promise1.$promise.then(
			function (response) {
				$scope.courses = response;
				$scope.coursesToShow = response;
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getFavCourses() {
		var promise1 = restAPIService.coursesTenantFavService($rootScope.user.tenant_id).query();
		promise1.$promise.then(
			function (response) {
				$scope.favCourses = response;
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getPoularCourses() {
		var promise1 = restAPIService.popularCoursesService().query();
		promise1.$promise.then(
			function (response) {
				$scope.popularCourses = response;
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	$('.link').click(function(){
	    var id = $(this).attr("rel");
	    if (id == "allcourses"){
	    	$scope.coursesToShow = $scope.courses;
	    	$scope.tableHeading = "List Of All Available Courses";
	    } else if (id == "favorites"){
	    	$scope.coursesToShow = $scope.favCourses;
	    	$scope.tableHeading = "List Of Your Favorite Courses";
	    } else {
	    	$scope.coursesToShow = $scope.popularCourses;
	    	$scope.tableHeading = "List Of Popular Courses";
	    }
	});
	
	$scope.onView = function(courseID) {
		$state.go("home.coursedetail",{ID : courseID});
	}
	
	$scope.onScheduleCourse = function(courseID){
		$state.go("home.createbatch",{ID : courseID});
	}
}
