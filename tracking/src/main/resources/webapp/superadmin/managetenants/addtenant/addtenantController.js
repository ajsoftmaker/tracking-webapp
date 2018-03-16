'use strict';

angular.module('trackingWebApp')
	.controller('addtenantController', addtenantController);

function addtenantController($scope,$rootScope,$state,dialogs,restAPIService,$location){
	$scope.tenantNameValid = false;
	$scope.primaryEmailValid = false;
	$scope.phone1Valid = false;
	$scope.contact1NameValid = false;
	$scope.tenantCodeValid = false;
	$scope.tenantNameSuccess = false;
	$scope.tenantNameError = false;
	$scope.tennatNameFeedback = "";
	$scope.tenantEmailSuccess = false;
	$scope.tenantEmailError = false;
	$scope.tennatEmailFeedback = "";
	$scope.tenantPhone1Success = false;
	$scope.tenantPhone1Error = false;
	$scope.tennatPhone1Feedback = "";
	$scope.tenantContact1NameSuccess = false;
	$scope.tenantContact1NameError = false;
	$scope.tennatContact1NameFeedback = "";
	$scope.tenantCodeSuccess = false;
	$scope.tenantCodeError = false;
	$scope.tennatCodeFeedback = "";
	$scope.tenantSecondaryEmailSuccess = false;
	$scope.tenantSecondaryEmailError = false;
	$scope.tenantSecondaryEmailFeedback = "";
	$scope.tenantPhone2Success = false;
	$scope.tenantPhone2Error = false;
	$scope.tennatPhone2Feedback = "";
	$scope.tenantContact2NameSuccess = false;
	$scope.tenantContact2NameError = false;
	$scope.tennatContact2NameFeedback = "";
	$scope.tenant={
					tenantName : "",
					primaryEmail : "",
					phone1 : "",
					contact1Name : "",
					contact2Name : "",
					tenantCode : "",
					secondaryEmail : "",
					phone2 : "",
					tenantStatus : "0"
					}
	
	if($scope.mode=="edit"){
		$scope.heading = "Edit Tenant";
		$scope.editMode = true;
		var id = Number($scope.id);
		var promise1 = restAPIService.tenantService(id).get();
		promise1.$promise.then(
			function (response) {
				$scope.tenant=response;
				$scope.tenantRePassword = $scope.tenant.tenantPassword
				$scope.tenant.phone1 = Number($scope.tenant.phone1)
				if($scope.tenant.phone2)
					$scope.tenant.phone2 = Number($scope.tenant.phone2)
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	} else {
		$scope.heading = "Add New Tenant";
		$scope.editMode = false;
	}
	
	$scope.addTenant = function() {
		if($scope.mode=="edit"){
			var promise = restAPIService.tenantService($scope.tenant.id).update($scope.tenant);
			promise.$promise.then(
					function (response) {
						dialogs.notify("Success", response.success, {'size': 'sm' });
						$state.reload();
				    },
				    function(error){
				    	dialogs.error("Error", error.data.error, {'size': 'sm' });
				    }
				);
		}else{
			var promise = restAPIService.tenantsService().save(null,$scope.tenant);
			promise.$promise.then(
					function (response) {
						dialogs.notify("Success", response.success, {'size': 'sm' });
						$state.reload();
					},
					function (error) {
						dialogs.error("Error", error.data.error, {'size': 'sm' });
					}
			);
		}
	}
	
	$scope.cancelAddTenant = function() {
		$state.reload();
	}

	$scope.validTenantName = function(valid){
		$scope.tenantNameValid = valid;
		if($scope.tenant.tenantName != undefined) {
			if($scope.tenant.tenantName.length <= 0) {
				$scope.tenantNameError = true;
				$scope.tennatNameFeedback = "has-error has-feedback";
			} else {
				$scope.tenantNameSuccess = true;
				$scope.tenantNameError = false;
				$scope.tennatNameFeedback = "has-success has-feedback";
			}
		} else {
			$scope.tenantNameError = true;
			$scope.tenantNameSuccess = false;
			$scope.tennatNameFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validPrimaryEmail = function(valid){
		$scope.primaryEmailValid = valid;
		if(valid == true) {
			$scope.tenantEmailSuccess = false;
			$scope.tenantEmailError = true;
			$scope.tennatEmailFeedback = "has-error has-feedback";
		} else {
			$scope.tenantEmailError = false;
			$scope.tenantEmailSuccess = true;
			$scope.tennatEmailFeedback = "has-success has-feedback";
		}
	}
	
	$scope.validPhone1 = function(valid){
		$scope.phone1Valid = valid;
		if($scope.tenant.phone1 != undefined) {
			var phoneNo = ""+$scope.tenant.phone1;
			if(phoneNo.length != 10 ) {
				$scope.tenantPhone1Success = false;
				$scope.tenantPhone1Error = true;
				$scope.tennatPhone1Feedback = "has-error has-feedback";
				
			} else {
				$scope.tenantPhone1Success = true;
				$scope.tenantPhone1Error = false;
				$scope.tennatPhone1Feedback = "has-success has-feedback";
				
			}
		} else {
			$scope.tenantPhone1Error = true;
			$scope.tenantPhone1Success = false;
			$scope.tennatPhone1Feedback = "has-error has-feedback"; 
		}
		
	}
	
	$scope.validContact1Name = function(valid){
		$scope.contact1NameValid = valid;
		if($scope.tenant.contact1Name != undefined) {
			if($scope.tenant.contact1Name.length <= 0) {
				$scope.tenantContact1NameSuccess = false;
				$scope.tenantContact1NameError = true;
				$scope.tennatContact1NameFeedback = "has-error has-feedback";
			} else {
				$scope.tenantContact1NameSuccess = true;
				$scope.tenantContact1NameError = false;
				$scope.tennatContact1NameFeedback = "has-success has-feedback";
			}
		} else {
			$scope.tenantContact1NameError = true;
			$scope.tenantContact1NameSuccess = false;
			$scope.tennatContact1NameFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validTenantCode = function(valid){
		$scope.tenantCodeValid = valid;
		if($scope.tenant.tenantCode != undefined) {
			if($scope.tenant.tenantCode.length <= 0) {
				$scope.tenantCodeError = true;
				$scope.tennatCodeFeedback = "has-error has-feedback";
			} else {
				$scope.tenantCodeSuccess = true;
				$scope.tenantCodeError = false;
				$scope.tennatCodeFeedback = "has-success has-feedback";
			}
		} else {
			$scope.tenantCodeError = true;
			$scope.tenantCodeSuccess = false;
			$scope.tennatCodeFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validSecondaryEmail = function(valid){
		if($scope.tenant.secondaryEmail != undefined) {
			if(valid == true) {
				$scope.tenantSecondaryEmailSuccess = false;
				$scope.tenantSecondaryEmailError = true;
				$scope.tenantSecondaryEmailFeedback = "has-error has-feedback";
			} else {
				$scope.tenantSecondaryEmailError = false;
				$scope.tenantSecondaryEmailSuccess = true;
				$scope.tenantSecondaryEmailFeedback = "has-success has-feedback";
			}
			if($scope.tenant.secondaryEmail.length == 0) {
				$scope.tenantSecondaryEmailSuccess = false;
				$scope.tenantSecondaryEmailError = false;
				$scope.tenantSecondaryEmailFeedback = "";
			}
		}
		else {
			$scope.tenantSecondaryEmailSuccess = false;
			$scope.tenantSecondaryEmailError = true;
			$scope.tenantSecondaryEmailFeedback = "has-error has-feedback";
		}
	
	}
	
	$scope.validPhone2 = function(valid){
		if(valid == true) {
			$scope.tenantPhone2Success = false;
			$scope.tenantPhone2Error = true;
			$scope.tennatPhone2Feedback = "has-error has-feedback";
		} else {
			$scope.tenantPhone2Success = false;
			$scope.tenantPhone2Error = false;
			$scope.tennatPhone2Feedback = "";
		}
		if($scope.tenant.phone2 != undefined) {
			var phoneNo = ""+$scope.tenant.phone2;
			if(phoneNo.length != 10 ) {
				$scope.tenantPhone2Success = false;
				$scope.tenantPhone2Error = true;
				$scope.tennatPhone2Feedback = "has-error has-feedback";
			} else {
				$scope.tenantPhone2Success = true;
				$scope.tenantPhone2Error = false;
				$scope.tennatPhone2Feedback = "has-success has-feedback";
			}
		} 
	}
	
	$scope.validContact2Name = function(valid){
			if($scope.tenant.contact2Name.length == 0) {
				$scope.tenantContact2NameSuccess = false;
				$scope.tenantContact2NameError = false;
				$scope.tennatContact2NameFeedback = "";
			} else {
				$scope.tenantContact2NameSuccess = true;
				$scope.tenantContact2NameError = false;
				$scope.tennatContact2NameFeedback = "has-success has-feedback";
			}
		
	}
}
