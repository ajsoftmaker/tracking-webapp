'use strict';

angular.module('trackingWebApp').controller('stcontinuebatchController',
		stcontinuebatchController);

function stcontinuebatchController($scope, $stateParams, $rootScope, $state,
		$filter, dialogs, restAPIService, DTOptionsBuilder, $location,$window,$timeout) {

	$scope.batch = null;
	$scope.course = null;
	$scope.machines = null;
	$scope.studentTests = [];
	$scope.testsStatus = [];
	$scope.files = [];
	$scope.takeATest = false;
	$scope.activeTabNumber = 1;
	$scope.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('paging', false).withOption('searching', false)
			.withOption('bInfo', false).withOption('orderable', false);

	getStudentCourseDetails();
	getStudentTestDetails();
	getCourseFileDetails();
	getStudentMachines();
	
	$timeout(function () {
		 if($scope.studentTests.length < 10) {
			 $('#stStudentTestsDataTable_paginate').attr("style","display:none;");
		 }
   }, 1000);
	function getStudentTestDetails() {
		 
		var promise1 = restAPIService.studentTestService($rootScope.user.studentID).query();
		promise1.$promise.then(function(response) {
			$scope.testsStatus = response;
		}, function(error) {
			dialogs.error("Error", error.data.error , {'size' : 'sm'});
		});
	}

	function getStudentCourseDetails() {
		 
		var promise1 = restAPIService.batchService($stateParams.batchID).get();
		promise1.$promise.then(function(response) {
			$scope.batch = response;
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});

		var promise1 = restAPIService.courseService($stateParams.courseID + "/id").get();
		promise1.$promise.then(function(response) {
			$scope.course = response;
			getCourseTests($scope.course.id);
		}, function(error) {
			dialogs.error("Error", error.data.error , {'size' : 'sm'});
		});
	}

	function getCourseFileDetails() {
		 
		var promise2 = restAPIService.fileService($stateParams.courseID).query();
		promise2.$promise.then(function(response) {
			$scope.files = response;
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	function getCourseTests(id) {
		 
		var promise1 = restAPIService.testService(id).query();
		promise1.$promise.then(function(response3) {
			$scope.studentTests = response3;
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	function getStudentMachines() {
		// first get the pod name and guacd profile
		var promise = restAPIService.uniqueStudentBatchService($stateParams.batchID, $stateParams.studentID).get();
		promise.$promise.then(function(response) {
			$scope.thisStudentThisBatch = response;
			// now get all the machines in this pod
			getMachinesForPod();
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	function getMachinesForPod() {
		var promise = restAPIService.machinesService($scope.thisStudentThisBatch.guacProfileId,$scope.thisStudentThisBatch.podId).get();
		promise.$promise.then(function(response) {
			$scope.machines = JSON.parse(response.success);
		}, function(error) {
			
			dialogs.error("Error",error.data.error, {'size' : 'sm'});
		});
	}

	$scope.onTakeTest = function(studentTest) {
		 
		$scope.takeTest = studentTest;
		$scope.setTab(0);
		$scope.takeATest = true;
	}

	$scope.onResetTest = function(takeTest) {
		 
		if (takeTest.resetScript != undefined || takeTest.resetScript != ""
				|| takeTest.resetScript != null) {
			var promise1 = restAPIService.scriptExecuterService(takeTest.resetScript).get();
			promise1.$promise.then(function(response) {
				if (response.exitValue != 0) {
					dialogs.error("Error", "Reset UnSuccessfuly", {'size' : 'sm'});
				} else {
					dialogs.notify("Success", "Reset Successfuly", {'size' : 'sm'});
					$state.reload()
				}
			}, function(error) {
				dialogs.error("Error",error.data.error, {'size' : 'sm'});
			});
		} else {
			dialogs.error("Error", "Script value is Empty", {'size' : 'sm'});
		}
	}

	$scope.onVerifyTest = function(test) {
		 
		var data = null
		for (var i = 0; i < $scope.testsStatus.length; i++) {
			if (test.id == $scope.testsStatus[i].testID) {
				data = $scope.testsStatus[i]
			}
		}
		if (test.verifyScript != undefined || test.verifyScript != ""
				|| test.verifyScript != null) {
			var promise1 = restAPIService.scriptExecuterService(test.verifyScript).get();
			promise1.$promise.then(function(response) {
				
				if (response.exitValue != 0) {
					dialogs.error("Error", "Result Fail", {'size' : 'sm'});
					var promise = restAPIService.studentTestByIDService($rootScope.user.studentID, test.id, "fail").update(data);
					promise.$promise.then(function(response) {
						$state.reload()
					}, function(error) {
						dialogs.error("Error", error.data.error, {'size' : 'sm'});
					});
				} else {
					dialogs.notify("Success", "Script Run successfully", {'size' : 'sm'});
					var promise = restAPIService.studentTestByIDService($rootScope.user.studentID, test.id, "pass").update(data);
					promise.$promise.then(function(response) {
						 
						$state.reload()
					}, function(error) {
						dialogs.error("Error", error.data.error, {'size' : 'sm'});
					});
				}
				
				
			}, function(error) {
				dialogs.error("Error", error.data.error, {'size' : 'sm'});
			});
		} else {
			dialogs.error("Error", "Script value is Empty", {'size' : 'sm'});
		}
	}

	$scope.onBack = function() {
		$scope.takeATest = false;
		$scope.setTab(4);
	}

	$scope.setTab = function(tabId) {
		$scope.activeTabNumber = tabId;
	};

	$scope.isSet = function(tabId) {
		return $scope.activeTabNumber === tabId;
	};

	$scope.getTestResult = function(testID) {
		for (var i = 0; i < $scope.testsStatus.length; i++) {
			if (testID == $scope.testsStatus[i].testID) {
				if($scope.testsStatus[i].status=='Not Taken') {
					return $scope.testsStatus[i].status
				} else {
					return $scope.testsStatus[i].results
				}
				
			}
		}
	};

	$scope.getStudenttest = function(testID) {

	}
	
	$scope.connectMachine = function(machine) {
		var promise = restAPIService.connectMachineService($scope.thisStudentThisBatch.guacProfileId, machine.connectionId).get();
		promise.$promise.then(function(response) {
			$scope.machineURL = response.headers.url;
			$window.open($scope.machineURL, '_blank');
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}
	
	$scope.onFileDownload = "/api/course/"+$stateParams.courseID+"/download/";
}
