'use strict';

angular.module('trackingWebApp')
	.controller('managestudentsController', managestudentsController);

function managestudentsController($scope, $rootScope, $state, $filter, dialogs, restAPIService,$location,$timeout){
	$scope.students = [];
	$scope.numOngoingBatches = [];
	$scope.parent = true;
	var id = $rootScope.user.tenant_id;
	
	 $timeout(function () {
		 if($scope.students.length < 10) {
			 $('#taStudentsDataTable_paginate').attr("style","display:none;");
		 }
    }, 1000);
	getAllStudents();
	
	function getAllStudents() {
		var promise1 = restAPIService.studentsService().query();
		promise1.$promise.then(
			function (response) {
				$scope.students =  response;
				// get all the batches now
				var promise2 = restAPIService.studentBatchesService().query();
				promise2.$promise.then(
					function (response) {
						$scope.batches = response;
						for(var i=0; i<$scope.students.length; i++) {
							$scope.numOngoingBatches.push(0);
							for(var j=0; j<$scope.batches.length; j++) {
								if($scope.batches[j].id == $scope.students[i].id){
									$scope.numOngoingBatches[i] = $scope.numOngoingBatches[i] + 1;
								}
							}
						}
				    },
				    function(error){
				    	dialogs.error("Error", error.data.error, {'size': 'sm' });
				    }
				);
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	$scope.onEdit = function(studentID) {
		$scope.parent = false;
		$scope.mode = "edit"
		$scope.id = studentID;
		$state.go("home.tamanagestudents.taaddStudent",{studentID : studentID});
	}
	
	$scope.addNewStudent = function() {
		$scope.parent = false;
		$scope.mode = "add"
		$state.go("home.tamanagestudents.taaddStudent");
	}
	
	$scope.importStudents = function() {
		$state.go("home.taimportStudents");
	}
	
	$scope.onDisable = function(student) {
		var dlg = dialogs.confirm("Are you sure?", "Are you sure you wish to disable the login account for this student?", {'size': 'sm' });
		dlg.result.then(function(btn){
			student.studentStatus = "0";
			var promise = restAPIService.studentService(student.studentID).update(student);
			promise.$promise.then(
					function (response) {
						dialogs.notify("Success", "Student Disable Sucessfully" , {'size': 'sm' });
						$state.go('home.tamanagestudents');
				    },
				    function(error){
				    	dialogs.error("Error", error.data.error, {'size': 'sm' });
				    }
				);
		},function(btn){});		
	}
	
	$scope.onEnable = function(student) {
		var dlg = dialogs.confirm("Are you sure?", "Are you sure you wish to enable the login account for this student?", {'size': 'sm' });
		dlg.result.then(function(btn){
			student.studentStatus = "1";
			var promise = restAPIService.studentService(student.studentID).update(student);
			promise.$promise.then(
					function (response) {
						dialogs.notify("Success"," Student Enable Sucessfully ", {'size': 'sm' });
						$state.go('home.tamanagestudents');
				    },
				    function(error){
				    	dialogs.error("Error", error.data.error, {'size': 'sm' });
				    }
				);
		},function(btn){});
	}
}
