'use strict';

angular.module('trackingWebApp').controller('samanagebatchesController',
		samanagebatchesController);

function samanagebatchesController($scope, $rootScope, $state, $filter, dialogs, restAPIService, $timeout, $stateParams) {
	$scope.numRequests = 0;
	$scope.batches = [];
	$scope.ongoingBatches = [];
	$scope.nextWeekBatches = [];
	$scope.futureBatches = [];
	$scope.batchRequests = [];
	$scope.batchesDone = [];

	getAllTenants();
	
	$timeout(function () {
		 
		 if($scope.ongoingBatches.length < 10) {
			 $('#saOngoingBatchesDataTable_paginate').attr("style","display:none;");
		 }
		 if($scope.nextWeekBatches.length < 10) {
			 $('#saNextWeekBatchesDataTable_paginate').attr("style","display:none;");
		 }
		 if($scope.futureBatches.length < 10) {
			 $('#saFutureBatchesDataTable_paginate').attr("style","display:none;");
		 }
		 if($scope.batchesDone.length < 10) {
			 $('#saBatchesDoneDataTable_paginate').attr("style","display:none;");
		 }
   }, 2000);

	function getAllTenants() {
		var promise1 = restAPIService.tenantsService().query();
		promise1.$promise.then(function(response) {
			$scope.tenants = response;
			getAllCourses();
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	function getAllCourses() {
		var promise1 = restAPIService.coursesService().query();
		promise1.$promise.then(function(response) {
			$scope.courses = response;
			getAllBatches();
			getAllBatchRequests();
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	// show the scheduled batches by default - this sends a "click" event to the link
	$timeout(function() {
		angular.element('#scheduled-link').triggerHandler('click');
	}, 0);

	function getAllBatches() {
		var promise1 = restAPIService.batchesService().query();
		promise1.$promise.then(function(response) {
			$scope.batches = response;
			groupBatchesByTimeline();
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	function groupBatchesByTimeline() {
		for (var j = 0; j < $scope.batches.length; j++) {
			var today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			var endDate = parseDate($scope.batches[j].endDate);
			//ongoing this week
			var days = Math.round((endDate - today) / (1000 * 60 * 60 * 24));
			if (days >= 0) {
				var startDate = parseDate($scope.batches[j].startDate);
				//ongoing this week
				days = Math.round((startDate - today) / (1000 * 60 * 60 * 24));
				if (days <= 6) {
					$scope.ongoingBatches.push($scope.batches[j]);
				}
				// next week
				else if (days >= 7 && days <= 13) {
					$scope.nextWeekBatches.push($scope.batches[j]);
				}
				// beyond
				else {
					$scope.futureBatches.push($scope.batches[j]);
				}
			} else {
				$scope.batchesDone.push($scope.batches[j]);
			}

		}
	}

	function parseDate(s) {
		var months = {jan : 0,feb : 1,mar : 2,apr : 3,may : 4,jun : 5,jul : 6,
			aug : 7,sep : 8,oct : 9,nov : 10,dec : 11};
		var p = s.split('-');
		return new Date(p[2], months[p[1].toLowerCase()], p[0]);
	}

	function getAllBatchRequests() {
		var promise1 = restAPIService.batchRequestsService().query();
		promise1.$promise.then(function(response) {
			$scope.batchRequests = [];
			for (var i = 0; i < response.length; i++) {
				if (response[i].requestStatus == "Pending") {
					$scope.batchRequests.push(response[i]);
				}
			}
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	$scope.singleBatch = function(id) {
		$state.go("home.sasinglebatch", {batchID : id});
	}

	$('.link').click(function() {
		var id = $(this).attr("rel");
		var otherid = "";
		if (id == "scheduled"){
			otherid = "newrequests"
		} else {
			otherid = "scheduled"
		}	
		var toHide = document.getElementById(otherid);
		toHide.style.display = 'none';
		var toShow = document.getElementById(id);
		toShow.style.display = 'inline';
		if ($rootScope.fromNotification) {
			var toHide = document.getElementById("scheduled");
			toHide.style.display = 'none';
			var toShow = document.getElementById("newrequests");
			toShow.style.display = 'inline';
			$rootScope.fromNotification = false;
			updateBatchRequestsNotification();
		}
	});

	function updateBatchRequestsNotification() {
		var promise = restAPIService.batchRequestsService().update()
		promise.$promise.then(function(response) {
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	$scope.onAccepted = function(request, status) {
		$scope.batchRequest = request;
		var numberOfDaysToAdd = 0;
		var noOfStudent = 0;
		for (var i = 0; i < $scope.courses.length; i++) {
			if ($scope.courses[i].id == $scope.batchRequest.courseID) {
				numberOfDaysToAdd = $scope.courses[i].durationDays;
				noOfStudent = $scope.courses[i].maxClassSize;
			}
		}
		$scope.mydate = parseDate($scope.batchRequest.startDate);
		$scope.newdate = $scope.mydate.setDate($scope.mydate.getDate() + Number(numberOfDaysToAdd));
		var endDate = new Date($scope.newdate);
		;
		var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
				"Sep", "Oct", "Nov", "Dec" ];
		$scope.batch = {};
		$scope.batch.courseID = $scope.batchRequest.courseID;
		$scope.batch.tenantID = $scope.batchRequest.tenantID;
		$scope.batch.batchState = "Setup Pending";
		$scope.batch.numStudents = noOfStudent;
		$scope.batch.startDate = $scope.batchRequest.startDate;
		$scope.batch.endDate = "" + endDate.getDate() + "-" + months[endDate.getMonth()] + "-" + endDate.getFullYear();
		$scope.batch.batchSetupStatus = status;
		$scope.batch.batchName = "" + $scope.mydate.getFullYear()
				+ $scope.mydate.getMonth() + $scope.mydate.getDate() + "_"
				+ $scope.batchRequest.courseID + "_"
				+ $scope.batchRequest.tenantID;

		$scope.batchRequest.requestStatus = status;
		$scope.batchRequest.creationDate = new Date();
		var promise = restAPIService.batchRequestService($scope.batchRequest.id).update($scope.batchRequest);
		promise.$promise.then(function(response) {
			getAllBatches();
			batchServiceAccepted();
			updateBatchRequestsNotification();
			dialogs.notify("Success", "Batch Request Accepted Successfully", {'size' : 'sm'});
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});

	}

	function batchServiceAccepted() {
		getAllBatchRequests();
		var promise = restAPIService.batchesService().save(null, $scope.batch);
		promise.$promise.then(function(response) {
			var studentsIDList = $scope.batchRequest.studentsIDList.split(",");
			for (var i = 0; i < studentsIDList.length; i++) {
				if (studentsIDList[i].length > 0) {
					var studentBatche = {};
					studentBatche.studentID = studentsIDList[i];
					studentBatche.batchID = response.id;
					studentBatche.status = "";
					studentBatche.guacProfileId = null;
					var promise = restAPIService.studentBatchesService().save(null, studentBatche);
					promise.$promise.then(function(response) {
						$state.reload();
					}, function(error) {
						dialogs.error("Error", error.data.error, {'size' : 'sm'});
					});
				}
			}
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}
	$scope.getRequest = function(request) {
		$scope.batch = request;
	}

	$scope.onDeclined = function(status, reason) {
		$scope.batchRequest = $scope.batch;
		$scope.batchRequest.reason = reason;
		$scope.batchRequest.requestStatus = status;
		$scope.batchRequest.creationDate = new Date();
		var promise = restAPIService.batchRequestService($scope.batchRequest.id).update($scope.batchRequest);
		promise.$promise.then(function(response) {
			getAllBatchRequests();
			dialogs.notify("Success", "Batch Request Rejected Successfully", {'size' : 'sm'});
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	$scope.getCourseName = function(courseID) {
		for (var i = 0; i < $scope.courses.length; i++) {
			if ($scope.courses[i].id == courseID) {
				return $scope.courses[i].courseName;
			}
		}
	}

	$scope.getCourseID = function(courseID) {
		for (var i = 0; i < $scope.courses.length; i++) {
			if ($scope.courses[i].id == courseID) {
				return $scope.courses[i].courseID;
			}
		}
	}

	$scope.getCompanyName = function(tenantID) {
		for (var i = 0; i < $scope.tenants.length; i++) {
			if (tenantID == $scope.tenants[i].id)
				return $scope.tenants[i].tenantName;
		}
	}

	function parseDate(s) {
		var months = {jan : 0,feb : 1,mar : 2,apr : 3,may : 4,jun : 5,
			jul : 6,aug : 7,sep : 8,oct : 9,nov : 10,dec : 11
		};
		var p = s.split('-');
		return new Date(p[2], months[p[1].toLowerCase()], p[0]);
	}

	$scope.getDate = function(startDate, endDate) {
		var date1 = startDate.split("-");
		var date2 = endDate.split("-");
		return date1[0] + " " + date1[1] + " - " + date2[0] + " " + date2[1] + " " + date2[2];
	}
}
