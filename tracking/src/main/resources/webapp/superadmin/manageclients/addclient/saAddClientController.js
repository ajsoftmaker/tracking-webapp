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
			clientStreet : "",
			clientLandmark : "",
			clientCity : "",
			clientEmail : "",
			contactNumber : ""
	}
	
	if($scope.mode=="edit"){
		$scope.heading = "Edit Client";
		$scope.editMode = true;
		var id = Number($scope.id);
		var promise1 = restAPIService.clientService(id).get();
//		var promise1 = restAPIService.clientEmailService('aj@a.com').get();
		promise1.$promise.then(
			function (response) {
				console.log(response)
				$scope.client=response;
				$scope.client.contactNumber = Number($scope.client.contactNumber);
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
		$scope.client.contactNumber = $scope.client.contactNumber + "";
		if($scope.mode=="edit"){
			var promise = restAPIService.tenantService($scope.tenant.id).update($scope.client);
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
			console.log("in Add ",$scope.client)
			var promise = restAPIService.clientsService().save(null,$scope.client);
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
		if($scope.client.clientEmail != undefined) {
			if($scope.client.clientEmail.length <= 0) {
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
		if($scope.client.clientStreet != undefined) {
			if($scope.client.clientStreet.length <= 0) {
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
		if($scope.client.clientLandmark != undefined) {
			if($scope.client.clientLandmark.length <= 0) {
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
		if($scope.client.clientCity != undefined) {
			if($scope.client.clientCity.length <= 0) {
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
