'use strict';

angular.module('trackingWebApp')
	.controller('addstudentController', addstudentController);

function addstudentController($scope, $rootScope, $state, $filter, dialogs, restAPIService,$location,$stateParams){
	$scope.studentNameValid = false;
	$scope.studentIDValid = false;
	$scope.eMailValid = false;
	$scope.studentNameSuccess = false;
	$scope.studentNameError = false;
	$scope.studentNameFeedback = "";
	$scope.studentIDSuccess = false;
	$scope.studentIDError = false;
	$scope.studentIDFeedback = "";
	$scope.studentEmailSuccess = false;
	$scope.studentEmailError = false;
	$scope.studentEmailFeedback = "";
	$scope.studentPhoneNumSuccess = false;
	$scope.studentPhoneNumError = false;
	$scope.studentPhoneNumFeedback = "";
	$scope.studentAdditionalInfoSuccess = false;
	$scope.studentAdditionalInfoError = false;
	$scope.studentAdditionalInfoFeedback = "";

	$scope.student = {
					studentName : "",
					studentID : "",
					studentStatus : "0",
					tenantID : $rootScope.user.tenant_id,
					eMail : "",
					phoneNum : "",
					additionalInfo : ""
					};
		
	if($scope.mode=="edit") {
		$scope.editMode = true;
		$scope.heading = "Edit Student";
		var promise1 = restAPIService.studentService($stateParams.studentID).get();
		promise1.$promise.then(
			function (response) {
				$scope.student=response;
				$scope.student.phoneNum = Number($scope.student.phoneNum);
				$scope.studentRePassword=$scope.student.studentPassword
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	} else {
		$scope.editMode = false;
		$scope.heading = "Add New Student";
	}
	
	$scope.onCancel = function() {
		$state.reload();
	}
	
	$scope.onSave = function() {
		if($scope.mode=="edit") {
			var promise = restAPIService.studentService($scope.id).update($scope.student);
			promise.$promise.then(
					function (response) {
						dialogs.notify("Success", response.success, {'size': 'sm' });
						$state.reload();
				    },
				    function(error){
				    	dialogs.error("Error", error.data.error, {'size': 'sm' });
				    }
				);
		} else {
			var promise1 = restAPIService.studentsService().save($scope.student);
			promise1.$promise.then(
				function (response) {
					dialogs.notify("Success", response.success, {'size': 'sm' });
					$state.reload();
			    },
			    function(error){
			    	dialogs.error("Error", error.data.error, {'size': 'sm' });
			    	
			    }
			);
		}
	}
	
	$scope.validStudentName = function (valid) {
		$scope.studentNameValid = valid;
		if($scope.student.studentName != undefined) {
			if($scope.student.studentName.length <= 0) {
				$scope.studentNameError = true;
				$scope.studentNameFeedback = "has-error has-feedback";
			} else {
				$scope.studentNameSuccess = true;
				$scope.studentNameError = false;
				$scope.studentNameFeedback = "has-success has-feedback";
			}
		} else {
			$scope.studentNameError = true;
			$scope.studentNameSuccess = false;
			$scope.studentNameFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validStudentID = function (valid) {
		$scope.studentIDValid = valid;
		if($scope.student.studentID != undefined) {
			if($scope.student.studentID.length <= 0) {
				$scope.studentIDError = true;
				$scope.studentIDSuccess = false;
				$scope.studentIDFeedback = "has-error has-feedback";
			} else {
				$scope.studentIDSuccess = true;
				$scope.studentIDError = false;
				$scope.studentIDFeedback = "has-success has-feedback";
			}
		} else {
			$scope.studentIDError = true;
			$scope.studentIDSuccess = false;
			$scope.studentIDFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.valideMail = function (valid) {
		$scope.eMailValid = valid;
		if(valid == true) {
			$scope.studentEmailSuccess = false;
			$scope.studentEmailError = true;
			$scope.studentEmailFeedback = "has-error has-feedback";
		} else {
			$scope.studentEmailError = false;
			$scope.studentEmailSuccess = true;
			$scope.studentEmailFeedback = "has-success has-feedback";
		}
	}
	
	$scope.validPhoneNum = function (valid) {
		if(valid == true) {
			$scope.studentPhoneNumSuccess = false;
			$scope.studentPhoneNumError = true;
			$scope.studentPhoneNumFeedback = "has-error has-feedback";
		} else {
			$scope.studentPhoneNumSuccess = false;
			$scope.studentPhoneNumError = false;
			$scope.studentPhoneNumFeedback = "";
		}
		if($scope.student.phoneNum != undefined) {
			var phoneNo = ""+$scope.student.phoneNum;
			if(phoneNo.length != 10 ) {
				$scope.studentPhoneNumSuccess = false;
				$scope.studentPhoneNumError = true;
				$scope.studentPhoneNumFeedback = "has-error has-feedback";
			} else {
				$scope.studentPhoneNumSuccess = true;
				$scope.studentPhoneNumError = false;
				$scope.studentPhoneNumFeedback = "has-success has-feedback";
			}
		} 
	}
	
	$scope.validAdditionalInfo = function (valid) {
		if($scope.student.additionalInfo.length == 0) {
			$scope.studentAdditionalInfoSuccess = false;
			$scope.studentAdditionalInfoError = false;
			$scope.studentAdditionalInfoFeedback = "";
		} else {
			$scope.studentAdditionalInfoSuccess = true;
			$scope.studentAdditionalInfoError = false;
			$scope.studentAdditionalInfoFeedback = "has-success has-feedback";
		}
	}
	
}
