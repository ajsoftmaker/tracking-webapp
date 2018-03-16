'use strict';

angular.module('trackingWebApp')
	.controller('tabatchdetailController', tabatchdetailController);

function tabatchdetailController($scope, $rootScope, $state, $filter, dialogs, restAPIService, $location, $stateParams, DTOptionsBuilder){
	$scope.batch = {};
	$scope.podCount = 2;
	$scope.students = [];
	$scope.studentBatch = [];
	$scope.assign = false;
	$scope.type = $stateParams.type;
	
	var batchID=Number($stateParams.batchID);
	if($stateParams.type=="schedule") {
		var promise1 = restAPIService.batchService(batchID).get();
		promise1.$promise.then(
			function (response) {
				$scope.batch=response;
				setBatchRecord()
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	} else {
		var promise1 = restAPIService.batchRequestService(batchID).get();
		promise1.$promise.then(
			function (response) {
				$scope.batch=response;
				setBatchRecord()
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	function setBatchRecord() {
		
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
					    	dialogs.error("Error", error.data.error, {'size': 'sm' });
					    }
					);
				}

		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}

}
