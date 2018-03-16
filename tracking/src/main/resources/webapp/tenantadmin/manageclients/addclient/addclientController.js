'use strict';

angular.module('trackingWebApp')
	.controller('addclientController', addclientController);

function addclientController($scope,$rootScope,$state,dialogs,restAPIService,$location){
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
	
//	Tracking

	$scope.clientNameValid = false;
	$scope.clientNameSuccess = false;
	$scope.clientNameError = false;
	$scope.clientNameFeedback = "";
	
	$scope.clientStreetValid = false;
	$scope.clientStreetSuccess = false;
	$scope.clientStreetError = false;
	$scope.clientStreetFeedback = "";
	
	$scope.landmarkValid = false;
	$scope.clientLandmarkSuccess = false;
	$scope.clientLandmarkError = false;
	$scope.clientLandmarkFeedback = "";
	
	$scope.cityValid = false;
	$scope.clientCitySuccess = false;
	$scope.clientCityError = false;
	$scope.clientCityFeedback = "";
	
	$scope.clientEmailValid = false;
	$scope.clientEmailSuccess = false;
	$scope.clientEmailError = false;
	$scope.clientEmailFeedback = "";

	$scope.clientContactNumberValid = false;
	$scope.clientContactNumberSuccess = false;
	$scope.clientContactNumberError = false;
	$scope.clientContactNumberFeedback = "";
	
	
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
	$scope.client={
			clientName : "",
			street : "",
			landmark : "",
			city : "",
			email : "",
			contactNumber : ""
	}
	
	if($scope.mode=="edit"){
		$scope.heading = "Edit Client";
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
		$scope.heading = "Add New Client";
		$scope.editMode = false;
	}
	
	$scope.addUser = function() {
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
	
	$scope.cancelAddUser = function() {
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
	
	$scope.validClientName = function(valid){
		$scope.clientNameValid = valid;
		if($scope.client.clientName != undefined) {
			if($scope.client.clientName.length <= 0) {
				$scope.clientNameError = true;
				$scope.clientNameFeedback = "has-error has-feedback";
			} else {
				$scope.clientNameSuccess = true;
				$scope.clientNameError = false;
				$scope.clientNameFeedback = "has-success has-feedback";
			}
		} else {
			$scope.clientNameError = true;
			$scope.clientNameSuccess = false;
			$scope.clientNameFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validClientEmail = function(valid){
		$scope.clientEmailValid = valid;
		if($scope.client.email != undefined) {
			if($scope.client.email.length <= 0) {
				$scope.clientNameError = true;
				$scope.clientEmailFeedback = "has-error has-feedback";
			} else {
				$scope.clientEmailSuccess = true;
				$scope.clientEmailError = false;
				$scope.clientEmailFeedback = "has-success has-feedback";
			}
		} else {
			$scope.clientEmailError = true;
			$scope.clientEmailSuccess = false;
			$scope.clientEmailFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validLandmark = function(valid){
		$scope.landmarkValid = valid;
		if($scope.tenant.landmark != undefined) {
			if($scope.tenant.landmark.length <= 0) {
				$scope.tenantLandmarkSuccess = false;
				$scope.tenantLandmarkError = true;
				$scope.tennatLandmarkFeedback = "has-error has-feedback";
			} else {
				$scope.tenantLandmarkSuccess = true;
				$scope.tenantLandmarkError = false;
				$scope.tennatLandmarkFeedback = "has-success has-feedback";
			}
		} else {
			$scope.tenantLandmarkError = true;
			$scope.tenantLandmarkSuccess = false;
			$scope.tennatLandmarkFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validCity = function(valid){
		$scope.cityValid = valid;
		if($scope.tenant.landmark != undefined) {
			if($scope.tenant.landmark.length <= 0) {
				$scope.tenantCitySuccess = false;
				$scope.tenantCityError = true;
				$scope.tennatCityFeedback = "has-error has-feedback";
			} else {
				$scope.tenantCitySuccess = true;
				$scope.tenantCityError = false;
				$scope.tennatCityFeedback = "has-success has-feedback";
			}
		} else {
			$scope.tenantCityError = true;
			$scope.tenantCitySuccess = false;
			$scope.tennatCityFeedback = "has-error has-feedback"; 
		}
	}
	
}
