'use strict';

angular.module('trackingWebApp')
	.controller('sasinglebatchController', sasinglebatchController);

function sasinglebatchController($scope, $rootScope, $state, $filter, dialogs, restAPIService, $location, $stateParams, DTOptionsBuilder){
	$scope.batch = {};
	$scope.guacamoleProfiles=[];
	$scope.podCount = 2;
	$scope.pod = [];
	$scope.students = [];
	$scope.studentBatch = [];
	$scope.getpods=true;
	$scope.assign = false;
	$scope.profileID = null;
	$scope.cancelBatch = true;
	
	var promise = restAPIService.profilesService().query();
	promise.$promise.then(
		function (response) {
			$scope.guacamoleProfiles = response;
	    },
	    function(error){
	    	dialogs.error("Error", error.status + " " + error.statusText, {'size': 'sm' });
	    }
	);
	
	var batchID=Number($stateParams.batchID);
	var promise1 = restAPIService.batchService(batchID).get();
	promise1.$promise.then(
		function (response) {
			$scope.batch=response;
//			if($scope.batch.batchState=="Setup Pending") {
//				$scope.pod = [];
//			}
			var today = new Date();
    		today.setHours(0);
    		today.setMinutes(0);
    		today.setSeconds(0);
    		var endDate = parseDate($scope.batch.endDate);
    		var days = Math.round((endDate-today)/(1000*60*60*24));
    		if(days>=0){
    			var startDate = parseDate($scope.batch.startDate);
        		days = Math.round((startDate-today)/(1000*60*60*24));
    			if(days <= 6) {
    				$scope.cancelBatch = false;
        		} else {
        			$scope.cancelBatch = true;
        		}
    		} else {
    			$scope.cancelBatch = false;
    		}
			
			var promise2 = restAPIService.courseService($scope.batch.courseID+"/id").get();
			promise2.$promise.then(
				function (response) {
					$scope.course=response;
			    },
			    function(error){
			    	dialogs.error("Error", error.data.error, {'size': 'sm' });
			    }
			);
			
			var promise2 = restAPIService.tenantService($scope.batch.tenantID).get();
			promise2.$promise.then(
				function (response) {
					$scope.tenant=response;
			    },
			    function(error){
			    	dialogs.error("Error", error.data.error, {'size': 'sm' });
			    }
			);
			
			var promise2 = restAPIService.studentBatchService($scope.batch.id).query();
			promise2.$promise.then(
				function (response) {
					$scope.studentBatch = response;
					var tempArrayData = [];
					for(var i=0;i<$scope.studentBatch.length;i++) {
						var promise = restAPIService.studentService($scope.studentBatch[i].studentID+"/id").get();
						promise.$promise.then(
							function (response1) {
								response1.podName = "None"
								for(var j=0;j<$scope.studentBatch.length;j++) {
									if(response1.id==$scope.studentBatch[j].studentID) {
										response1.podName = $scope.studentBatch[j].podName;
									}
								}
								$scope.students.push(response1);
						    },
						    function(error){
						    	dialogs.error("Error",error.data.error, {'size': 'sm' });
						    }
						);
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
	
	$scope.onAssign = function(podCount) {
		
		for(var j=0;j<$scope.students.length;j++) {
			$scope.students[j].podName = "None";
		}
		var count = 0;
		for(var i=0;i<$scope.students.length && count<$scope.pod.length;) {
			for(var j=0;j<podCount && i<$scope.students.length;j++) {
				$scope.students[i].podName = $scope.pod[count]["connectionGroupName"];
				$scope.students[i].podId = $scope.pod[count]["connectionGroupId"];
				i++;
			}
			count++;
		}
		$scope.assign = true;
		for(var i=0;i<$scope.students.length;i++) {
			if($scope.students[i].podName=="None") {
				$scope.assign = false;
				for(var j=0;j<$scope.students.length;j++) {
					$scope.students[j].podName = "None";
				}
				dialogs.error("Assignment Incomplete", "The assignment could not be made as not enough pods are available, Please provision all the pods required and try again.", {'size': 'sm' });
			}
		}
	}
	
	$scope.onSaveAssignment = function() {
		for(var i=0;i<$scope.students.length;i++) {
			for(var j=0;j<$scope.studentBatch.length;j++) {
				if($scope.studentBatch[j]["studentID"] == $scope.students[i].id) {
					$scope.studentBatch[j]["podName"] = $scope.students[i].podName;
					$scope.studentBatch[j]["podId"] = $scope.students[i].podId;
					$scope.studentBatch[j]["guacProfileId"] = $scope.profileID;
				}
			}

			for(var j=0;j<$scope.studentBatch.length;j++) {
				var promise = restAPIService.studentBatchesService().update($scope.studentBatch[j]);
				promise.$promise.then(
					function (response) {
						$scope.batch.batchState = "Ready";
						var promise = restAPIService.batchService($scope.batch.id).update($scope.batch);
						promise.$promise.then(
								function (response) {
									
							    },
							    function(error){
							    	dialogs.error("Error", error.data.error, {'size': 'sm' });
							    }
							);
					},function(error){
						dialogs.error("Error", error.data.error, {'size': 'sm' });
					}
				);
			}
			
		}
		
		dialogs.notify("Success", "Pods Assigned Successfully", {'size': 'sm' });
		$state.go("home.samanagebatches")
	}
	
	$scope.cancelBatchSuperAdmin = function() {
		var dlg = dialogs.confirm("Are you sure?","Are you sure you wish to cancel this Batch?", {'size' : 'sm'});
		dlg.result.then(function(btn) {
			var id = $scope.batch.courseID+"/"+$scope.batch.tenantID+"/"+$scope.batch.startDate;
			var promise2 = restAPIService.batchRequestService(id).remove();
			promise2.$promise.then(function(response) {
				var promise1 = restAPIService.batchService(batchID).remove();
				promise1.$promise.then(function(response1) {
					dialogs.notify("Success", response1.success, {'size' : 'sm'});
					$state.go("home.samanagebatches")
				}, function(error1) {
					dialogs.error("Error", error1.data.error, {'size' : 'sm'});
				});
			}, function(error) {
				dialogs.error("Error", error.data.error, {'size' : 'sm'});
			});
			
		}, function(btn) {
		});
	}
	
	$scope.onSelectProfile = function(selectedProfile) {
		$scope.profileID = selectedProfile.id;
		if($scope.batch.batchState=="Setup Pending") {
			var promise = restAPIService.podsService($scope.profileID).get();
			promise.$promise.then(
					function (response) {
					$scope.pod = JSON.parse(response.success);
					$scope.getpods=false;
					},
					function(error){
						dialogs.error("Error", error.data.error + " ,Please Add valid Guacamole Url", {'size': 'sm' });
					}
			);
		}
	}
	
	function parseDate(s) {
		var months = {
			jan : 0,
			feb : 1,
			mar : 2,
			apr : 3,
			may : 4,
			jun : 5,
			jul : 6,
			aug : 7,
			sep : 8,
			oct : 9,
			nov : 10,
			dec : 11
		};
		var p = s.split('-');
		return new Date(p[2], months[p[1].toLowerCase()], p[0]);
	}
}
