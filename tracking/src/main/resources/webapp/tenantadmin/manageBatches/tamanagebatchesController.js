'use strict';

angular.module('trackingWebApp')
	.controller('tamanagebatchesController', tamanagebatchesController);

function tamanagebatchesController($scope, $rootScope, $state, $filter, dialogs, restAPIService,$timeout){
	$scope.batches = [];
	$scope.batcheRequests = [];
	$scope.courses = [];
	$scope.batchesDone = [];
	$scope.batchesOnGoing = [];
	
	 $timeout(function () {
		 if($scope.batcheRequests.length < 10) {
			 $('#taBatcheRequestsDataTable_paginate').attr("style","display:none;");
		 }
		 if($scope.batchesOnGoing.length < 10) {
			 $('#taBatchesOnGoingDataTable_paginate').attr("style","display:none;");
		 }
		 if($scope.batchesDone.length < 10) {
			 $('#taBatchesDoneDataTable_paginate').attr("style","display:none;");
		 }
    }, 1000);
	
	getAllCourses();
	
	if($rootScope.fromNotification){
		var promise = restAPIService.batchRequestsService().update()
		promise.$promise.then(
				function (response) {
			    },
			    function(error){
			    	dialogs.error("Error", error.data.error, {'size': 'sm' });
			    }
			);
	}
	
	function getAllCourses() {
		var promise1 = restAPIService.coursesService().query();
		promise1.$promise.then(
			function (response) {
				$scope.courses =  response;
				getBatches();
				getBatcheRequests();
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getBatches() {
		var promise1 = restAPIService.batchesService().query();
		promise1.$promise.then(
			function (response) {
				$scope.batches =  response;
				var today = new Date();
				today.setHours(0);
	    		today.setMinutes(0);
	    		today.setSeconds(0);
				for(var i=0;i<$scope.batches.length;i++){
					var endDate = parseDate($scope.batches[i].endDate);
					var days = Math.round((endDate-today)/(1000*60*60*24));
					if(days>=0){
						$scope.batchesOnGoing.push($scope.batches[i]);
					} else {
						$scope.batchesDone.push($scope.batches[i]);
					}
				}
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function getBatcheRequests() {
		var promise1 = restAPIService.batchRequestsService().query();
		promise1.$promise.then(
			function (response) {
				for(var i=0;i<response.length ; i++) {
						var today = new Date();
						if(response[i].requestStatus == "Pending") {
							$scope.batcheRequests.push(response[i]);
						} else {
							var days = Math.round((today-response[i].creationDate)/(1000*60*60*24));
								if(days <= 1  && days >=0) {
									$scope.batcheRequests.push(response[i]);
								}
							}
					
					}
		    },
		    function(error){
		    	dialogs.error("Error",error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	$scope.getCourseName = function(courseID){
		for(var i=0;i<$scope.courses.length;i++){
			if($scope.courses[i].id ==courseID){
				return $scope.courses[i].courseID+" - "+$scope.courses[i].courseName;
			}
		}
	}
	
	$scope.getDate = function(startDate,endDate) {
		var date1 = startDate.split("-");
		var date2 = endDate.split("-");
		return date1[0]+" "+date1[1]+" - "+date2[0]+" "+date2[1]+" "+date2[2];
	}
	
	$scope.singleBatch = function (id){
    	$state.go("home.tabatchdetail",{batchID : id,type : "schedule"});
    }
	
	$scope.requestBatch = function (id){
    	$state.go("home.tabatchdetail",{batchID : id,type : "request"});
    }
	
	$scope.onCancel = function(batch) {
		var dlg = dialogs.confirm("Are you sure?","Are you sure you wish to cancel this Batch?", {'size' : 'sm'});
		dlg.result.then(function(btn) {
			
			var id = batch.courseID+"/"+batch.tenantID+"/"+batch.startDate;
			var promise2 = restAPIService.batchRequestService(id).remove();
			promise2.$promise.then(function(response) {
				var promise1 = restAPIService.batchService(batch.id).remove();
				promise1.$promise.then(function(response1) {
					dialogs.notify("Success", response1.success, {'size' : 'sm'});
					$state.reload();
				}, function(error1) {
					dialogs.error("Error", error1.data.error, {'size' : 'sm'});
				});
			}, function(error) {
				dialogs.error("Error", error.data.error, {'size' : 'sm'});
			});
			
		}, function(btn) {
		});
	}
	
	function parseDate(s) {
		  var months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,
		                jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
		  var p = s.split('-');
		  return new Date(p[2], months[p[1].toLowerCase()], p[0]);
		}
}
