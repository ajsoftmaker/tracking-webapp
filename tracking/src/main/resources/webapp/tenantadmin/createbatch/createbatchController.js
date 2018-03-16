'use strict';

angular.module('trackingWebApp')
	.controller('createbatchController', createbatchController);

function createbatchController($scope, $rootScope, $state, $filter, dialogs, restAPIService, $location, $stateParams,$timeout){
	$scope.course = {};
	$scope.studentList = [];
	$scope.students = [];
	$scope.studentsList = [];
	$scope.currentDate = new Date();
	$scope.startDate = $scope.currentDate;
	$scope.importStudent = false;
	var courseID = $stateParams.ID;
	
	 $timeout(function () {
		 if($scope.studentsList.length < 10) {
			 $('#taStudentListDataTable_paginate').attr("style","display:none;");
		 }
    }, 1000);
	$scope.dirty = {};
	function suggest_state(term) {
		var q = term.toLowerCase().trim();
		var results = [];
		// Find first 10 states that start with `term`.
		for (var i = 0; i < $scope.studentsList.length && results.length < 10; i++) {
			var state = $scope.studentsList[i];
			if (state.toLowerCase().indexOf(q) > -1)
				results.push({
					label : state,
					value : state
				});
		}
		return results;
	}

	$scope.autocomplete_options = {
		suggest : suggest_state
	};
	
	getAllStudents();
	
	var promise1 = restAPIService.courseService(courseID).get();
	promise1.$promise.then(
		function (response) {
			$scope.course=response;
	    },
	    function(error){
	    	dialogs.error("Error", error.data.error, {'size': 'sm' });
	    }
	);
	
	$scope.onStartDate = function(startDate) {
		$scope.startDate = startDate;
	}

	$scope.onRequest = function() {
		
		if ($scope.studentList.length < 1) {
			dialogs.notify("Warning", "You must select at least one student", {'size': 'sm' });
			$state.reload();
			return;
		}
		var months=["Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		$scope.batchRequest = new Object();
		$scope.batchRequest.courseID = $scope.course.id;
		$scope.batchRequest.tenantID = $rootScope.user.tenant_id;
		$scope.batchRequest.numStudents = $scope.studentList.length;
		$scope.batchRequest.studentsIDList = "";
		$scope.batchRequest.startDate = ""+$scope.startDate.getDate()+"-"+months[$scope.startDate.getMonth()]+"-"+$scope.startDate.getFullYear();
		$scope.batchRequest.requestStatus = "Pending";
		$scope.batchRequest.reason = "";
		
		for(var i=0;i<$scope.studentList.length;i++) {
			if (i != 0){
				$scope.batchRequest.studentsIDList += ",";
			}
			$scope.batchRequest.studentsIDList += $scope.studentList[i]["id"]; 
		}
		$scope.batchRequest.creationDate = new Date();
		var promise1 = restAPIService.batchRequestsService().save($scope.batchRequest);
		promise1.$promise.then(
			function (response) {
				dialogs.notify("Success", response.success, {'size': 'sm' });
				$state.go("home.taviewcourses");
		    },
		    function(error){
		    	dialogs.error("Error",error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getAllStudents() {
		var promise1 = restAPIService.studentsService().query();
		promise1.$promise.then(
			function (response) {
				$scope.studentsList = [];
				$scope.students =  response;
				for(var i=0;i<$scope.students.length;i++){
					$scope.studentsList.push($scope.students[i].studentID+":"+$scope.students[i].studentName)
				} 
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	$scope.onChange = function(studentInfo) {
		$scope.studentInfo=studentInfo;
	}
	
	$scope.onAdd = function(studentValue) {
		$scope.studentInfo = studentValue;
		var student = $scope.studentInfo.split(":");
		for(var i=0;i<$scope.students.length;i++){
			if($scope.students[i].studentID == student[0]) {
				$scope.studentList.push($scope.students[i]);
				var index = $scope.studentsList.indexOf($scope.studentInfo);
				$scope.studentsList.splice(index,1);
			}
		}
		$scope.dirty = {};
	}
	
	$scope.onImport = function() {
		$scope.importStudent = true;
		var months=["Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		$scope.batchRequest = new Object();
		$scope.batchRequest.courseID = $scope.course.id;
		$scope.batchRequest.tenantID = $rootScope.user.tenant_id;
		$scope.batchRequest.numStudents = $scope.studentList.length;
		$scope.batchRequest.studentsIDList = "";
		$scope.batchRequest.startDate = ""+$scope.startDate.getDate()+"-"+months[$scope.startDate.getMonth()]+"-"+$scope.startDate.getFullYear();
		$scope.batchRequest.requestStatus = "Pending";
		$scope.batchRequest.reason = "";
		$state.go('home.createbatch.importbatchstudents');
	}
	
	$scope.onDelete = function(student) {
		$scope.studentsList.push(student.studentID+":"+student.studentName)
		var index = $scope.studentList.indexOf(student);
		$scope.studentList.splice(index,1);
	}
	
	$scope.onCancel = function (){
		$state.go("home.taviewcourses");
	}
}
