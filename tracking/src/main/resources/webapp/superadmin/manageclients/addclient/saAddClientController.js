'use strict';

angular.module('trackingWebApp')
	.controller('saAddClientController', saAddClientController);

function saAddClientController($scope,$rootScope,$state,dialogs,restAPIService,$location){
//	Tracking

	$scope.clientNameValid = false;
	$scope.clientNameSuccess = false;
	$scope.clientNameError = false;
	$scope.clientNameFeedback = "";
	
	$scope.clientStreetValid = false;
	$scope.clientStreetSuccess = false;
	$scope.clientStreetError = false;
	$scope.clientStreetFeedback = "";
	
	$scope.clientLandmarkValid = false;
	$scope.clientLandmarkSuccess = false;
	$scope.clientLandmarkError = false;
	$scope.clientLandmarkFeedback = "";
	
	$scope.clientCityValid = false;
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
	
	$scope.addClient = function() {
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
	
	$scope.cancelAddClient = function() {
		$state.reload();
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
	
	$scope.validContactNumber = function(valid){
		$scope.clientContactNumberValid = valid;
		if($scope.client.contactNumber != undefined) {
			var phoneNo = ""+$scope.client.contactNumber;
			if(phoneNo.length != 10 ) {
				$scope.clientContactNumberSuccess = false;
				$scope.clientContactNumberError = true;
				$scope.clientContactNumberFeedback = "has-error has-feedback";
				
			} else {
				$scope.clientContactNumberSuccess = true;
				$scope.clientContactNumberError = false;
				$scope.clientContactNumberFeedback = "has-success has-feedback";
				
			}
		} else {
			$scope.clientContactNumberError = true;
			$scope.clientContactNumberSuccess = false;
			$scope.clientContactNumberFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validStreet = function(valid){
		$scope.clientStreetValid = valid;
		if($scope.client.street != undefined) {
			if($scope.client.street.length <= 0) {
				$scope.clientStreetError = true;
				$scope.clientStreetFeedback = "has-error has-feedback";
			} else {
				$scope.clientStreetSuccess = true;
				$scope.clientStreetError = false;
				$scope.clientStreetFeedback = "has-success has-feedback";
			}
		} else {
			$scope.clientStreetError = true;
			$scope.clientStreetSuccess = false;
			$scope.clientStreetFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validLandmark = function(valid){
		$scope.clientLandmarkValid = valid;
		if($scope.client.landmark != undefined) {
			if($scope.client.landmark.length <= 0) {
				$scope.clientLandmarkSuccess = false;
				$scope.clientLandmarkError = true;
				$scope.clientLandmarkFeedback = "has-error has-feedback";
			} else {
				$scope.clientLandmarkSuccess = true;
				$scope.clientLandmarkError = false;
				$scope.clientLandmarkFeedback = "has-success has-feedback";
			}
		} else {
			$scope.clientLandmarkError = true;
			$scope.clientLandmarkSuccess = false;
			$scope.clientLandmarkFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validCity = function(valid){
		$scope.clientCityValid = valid;
		if($scope.client.city != undefined) {
			if($scope.client.city.length <= 0) {
				$scope.clientCitySuccess = false;
				$scope.clientCityError = true;
				$scope.clientCityFeedback = "has-error has-feedback";
			} else {
				$scope.clientCitySuccess = true;
				$scope.clientCityError = false;
				$scope.clientCityFeedback = "has-success has-feedback";
			}
		} else {
			$scope.clientCityError = true;
			$scope.clientCitySuccess = false;
			$scope.clientCityFeedback = "has-error has-feedback"; 
		}
	}
	
}
