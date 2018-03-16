'use strict';

angular.module('trackingWebApp').controller('managecoursesController',
		managecoursesController);

function managecoursesController($scope, $rootScope, $state, $filter, dialogs,
		restAPIService, $location,$timeout) {
	$scope.courses = [];
	$scope.batches = [];
	$scope.numOngoingBatchesForCourse = [];
	$scope.numScheduledBatchesForCourse = [];
	$scope.parent = true;
	
	 $timeout(function () {
		 if($scope.courses.length < 10) {
			 $('#manageCoursesDataTable_paginate').attr("style","display:none;");
		 }
    }, 1000);
	getAllCourses();

	function getAllCourses() {
		var promise1 = restAPIService.coursesService().query();
		promise1.$promise.then(
			function(response) {
				$scope.courses = response;
				getAllBatches();
				getAllBatchRequests();
				// get all the batches now
				var promise2 = restAPIService.batchesService().query();
				promise2.$promise.then(
					function(response) {
						$scope.batches = response;
						for (var i = 0; i < $scope.courses.length; i++) {
							$scope.numOngoingBatchesForCourse.push(0);
							$scope.numScheduledBatchesForCourse.push(0);
							for (var j = 0; j < $scope.batches.length; j++) {
								if ($scope.batches[j].id == $scope.courses[i].id) {
									var today = moment();
									var startDate = $scope.batches[j].startDate;
									var endDate = $scope.batches[j].endDate;
									if ((today.isAfter(startDate) || today.isSame(startDate))&& (today.isBefore(endDate) || today.isSame(endDate)))
										$scope.numOngoingBatchesForCourse[i] = $scope.numOngoingBatchesForCourse[i] + 1;
									else if (today.isBefore(startDate))
										$scope.numScheduledBatchesForCourse[i] = $scope.numScheduledBatchesForCourse[i] + 1;
								}
							}
						}
					},function(error) {
						dialogs.error("Error", error.data.error,{'size' : 'sm'});
					});
			}, function(error) {
					dialogs.error("Error", error.data.error, {'size' : 'sm'});
			});
	}

	function getAllBatches() {
		var promise1 = restAPIService.batchesService().query();
		promise1.$promise.then(function(response) {
			$scope.batches = response;
		}, function(error) {
			dialogs.error("Error",error.data.error, {'size' : 'sm'});
		});
	}

	function getAllBatchRequests() {
		var promise1 = restAPIService.batchRequestsService().query();
		promise1.$promise.then(function(response) {
			$scope.batchRequests = response;
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	$scope.onEdit = function(courseID) {
		$scope.parent = false;
		$scope.mode = "edit";
		$scope.id = courseID;
		$state.go("home.samanagecourses.saaddcourse");
	}

	$scope.addNewCourse = function() {
		$scope.parent = false;
		$scope.mode = "add";
		$state.go("home.samanagecourses.saaddcourse");
	}

	$scope.onDelete = function(courseID, id) {
		var flag = true;
		for (var i = 0; i < $scope.batches.length; i++) {
			if ($scope.batches[i].courseID == id) {
				flag = false;
			}
		}

		for (var i = 0; i < $scope.batchRequests.length; i++) {
			if ($scope.batchRequests[i].courseID == id) {
				flag = false;
			}
		}

		if (flag) {
			var dlg = dialogs.confirm("Are you sure?","Are you sure you wish to delete this course?", {'size' : 'sm'});
			dlg.result.then(function(btn) {
				var promise2 = restAPIService.courseService(courseID).remove();
				promise2.$promise.then(function(response) {
					getAllCourses();
					dialogs.notify("Success", response.success, {'size' : 'sm'});
				}, function(error) {
					dialogs.error("Error", error.data.error, {'size' : 'sm'});
				});
			}, function(btn) {
			});
		} else {
			dialogs.error("Error","Batches are ongoing so course deletion failed", {'size' : 'sm'});
		}

	}

	$scope.onView = function(courseID) {
		$state.go("home.coursedetail", {
			ID : courseID
		});
	}

}
