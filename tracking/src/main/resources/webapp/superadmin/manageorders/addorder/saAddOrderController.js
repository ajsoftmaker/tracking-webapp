'use strict';

angular.module('trackingWebApp')
	.controller('saAddOrderController', saAddOrderController);

function saAddOrderController($scope,$rootScope,$state,dialogs,restAPIService,$location){
//	Tracking

	$scope.fromClientNameValid = false;
	$scope.fromClientNameSuccess = false;
	$scope.fromClientNameError = false;
	$scope.fromClientNameFeedback = "";
	
	$scope.fromClientStreetValid = false;
	$scope.fromClientStreetSuccess = false;
	$scope.fromClientStreetError = false;
	$scope.fromClientStreetFeedback = "";
	
	$scope.fromClientLandmarkValid = false;
	$scope.fromClientLandmarkSuccess = false;
	$scope.fromClientLandmarkError = false;
	$scope.fromClientLandmarkFeedback = "";
	
	$scope.fromClientCityValid = false;
	$scope.fromClientCitySuccess = false;
	$scope.fromClientCityError = false;
	$scope.fromClientCityFeedback = "";
	
	$scope.fromClientEmailValid = false;
	$scope.fromClientEmailSuccess = false;
	$scope.fromClientEmailError = false;
	$scope.fromClientEmailFeedback = "";

	$scope.fromClientContactNumberValid = false;
	$scope.fromClientContactNumberSuccess = false;
	$scope.fromClientContactNumberError = false;
	$scope.fromClientContactNumberFeedback = "";
	
	$scope.fromClient={
			clientName : "",
			street : "",
			landmark : "",
			city : "",
			email : "",
			contactNumber : ""
	}
	
	$scope.order={
			status : "In transit",
			type : "Document",
			weightMode : "kg"
	};
	
	$scope.toClientNameValid = false;
	$scope.toClientNameSuccess = false;
	$scope.toClientNameError = false;
	$scope.toClientNameFeedback = "";
	
	$scope.toClientStreetValid = false;
	$scope.toClientStreetSuccess = false;
	$scope.toClientStreetError = false;
	$scope.toClientStreetFeedback = "";
	
	$scope.toClientLandmarkValid = false;
	$scope.toClientLandmarkSuccess = false;
	$scope.toClientLandmarkError = false;
	$scope.toClientLandmarkFeedback = "";
	
	$scope.toClientCityValid = false;
	$scope.toClientCitySuccess = false;
	$scope.toClientCityError = false;
	$scope.toClientCityFeedback = "";
	
	$scope.toClientEmailValid = false;
	$scope.toClientEmailSuccess = false;
	$scope.toClientEmailError = false;
	$scope.toClientEmailFeedback = "";

	$scope.toClientContactNumberValid = false;
	$scope.toClientContactNumberSuccess = false;
	$scope.toClientContactNumberError = false;
	$scope.toClientContactNumberFeedback = "";
	
	$scope.toClient={
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
		$scope.heading = "Add New Order";
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
	
	$scope.validFromClientName = function(valid){
		$scope.fromClientNameValid = valid;
		if($scope.fromClient.clientName != undefined) {
			if($scope.fromClient.clientName.length <= 0) {
				$scope.fromClientNameError = true;
				$scope.fromClientNameFeedback = "has-error has-feedback";
			} else {
				$scope.fromClientNameSuccess = true;
				$scope.fromClientNameError = false;
				$scope.fromClientNameFeedback = "has-success has-feedback";
			}
		} else {
			$scope.fromClientNameError = true;
			$scope.fromClientNameSuccess = false;
			$scope.fromClientNameFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validFromClientEmail = function(valid){
		$scope.fromClientEmailValid = valid;
		if($scope.fromClient.email != undefined) {
			if($scope.fromClient.email.length <= 0) {
				$scope.fromClientNameError = true;
				$scope.fromClientEmailFeedback = "has-error has-feedback";
			} else {
				$scope.fromClientEmailSuccess = true;
				$scope.fromClientEmailError = false;
				$scope.fromClientEmailFeedback = "has-success has-feedback";
			}
		} else {
			$scope.fromClientEmailError = true;
			$scope.fromClientEmailSuccess = false;
			$scope.fromClientEmailFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validFromContactNumber = function(valid){
		$scope.fromClientContactNumberValid = valid;
		if($scope.fromClient.contactNumber != undefined) {
			var phoneNo = ""+$scope.fromClient.contactNumber;
			if(phoneNo.length != 10 ) {
				$scope.fromClientContactNumberSuccess = false;
				$scope.fromClientContactNumberError = true;
				$scope.fromClientContactNumberFeedback = "has-error has-feedback";
				
			} else {
				$scope.fromClientContactNumberSuccess = true;
				$scope.fromClientContactNumberError = false;
				$scope.fromClientContactNumberFeedback = "has-success has-feedback";
				
			}
		} else {
			$scope.fromClientContactNumberError = true;
			$scope.fromClientContactNumberSuccess = false;
			$scope.fromClientContactNumberFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validFromStreet = function(valid){
		$scope.fromClientStreetValid = valid;
		if($scope.fromClient.street != undefined) {
			if($scope.fromClient.street.length <= 0) {
				$scope.fromClientStreetError = true;
				$scope.fromClientStreetFeedback = "has-error has-feedback";
			} else {
				$scope.fromClientStreetSuccess = true;
				$scope.fromClientStreetError = false;
				$scope.fromClientStreetFeedback = "has-success has-feedback";
			}
		} else {
			$scope.fromClientStreetError = true;
			$scope.fromClientStreetSuccess = false;
			$scope.fromClientStreetFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validFromLandmark = function(valid){
		$scope.fromClientLandmarkValid = valid;
		if($scope.fromClient.landmark != undefined) {
			if($scope.fromClient.landmark.length <= 0) {
				$scope.fromClientLandmarkSuccess = false;
				$scope.fromClientLandmarkError = true;
				$scope.fromClientLandmarkFeedback = "has-error has-feedback";
			} else {
				$scope.fromClientLandmarkSuccess = true;
				$scope.fromClientLandmarkError = false;
				$scope.fromClientLandmarkFeedback = "has-success has-feedback";
			}
		} else {
			$scope.fromClientLandmarkError = true;
			$scope.fromClientLandmarkSuccess = false;
			$scope.fromClientLandmarkFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validFromCity = function(valid){
		$scope.fromClientCityValid = valid;
		if($scope.fromClient.city != undefined) {
			if($scope.fromClient.city.length <= 0) {
				$scope.fromClientCitySuccess = false;
				$scope.fromClientCityError = true;
				$scope.fromClientCityFeedback = "has-error has-feedback";
			} else {
				$scope.fromClientCitySuccess = true;
				$scope.fromClientCityError = false;
				$scope.fromClientCityFeedback = "has-success has-feedback";
				$scope.order.location=$scope.fromClient.city
				$scope.validLocation(valid);
			}
		} else {
			$scope.fromClientCityError = true;
			$scope.fromClientCitySuccess = false;
			$scope.fromClientCityFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validToClientName = function(valid){
		$scope.toClientNameValid = valid;
		if($scope.toClient.clientName != undefined) {
			if($scope.toClient.clientName.length <= 0) {
				$scope.toClientNameError = true;
				$scope.toClientNameFeedback = "has-error has-feedback";
			} else {
				$scope.toClientNameSuccess = true;
				$scope.toClientNameError = false;
				$scope.toClientNameFeedback = "has-success has-feedback";
			}
		} else {
			$scope.toClientNameError = true;
			$scope.toClientNameSuccess = false;
			$scope.toClientNameFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validToClientEmail = function(valid){
		$scope.toClientEmailValid = valid;
		if($scope.toClient.email != undefined) {
			if($scope.toClient.email.length <= 0) {
				$scope.toClientNameError = true;
				$scope.toClientEmailFeedback = "has-error has-feedback";
			} else {
				$scope.toClientEmailSuccess = true;
				$scope.toClientEmailError = false;
				$scope.toClientEmailFeedback = "has-success has-feedback";
			}
		} else {
			$scope.toClientEmailError = true;
			$scope.toClientEmailSuccess = false;
			$scope.toClientEmailFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validToContactNumber = function(valid){
		$scope.toClientContactNumberValid = valid;
		if($scope.toClient.contactNumber != undefined) {
			var phoneNo = ""+$scope.toClient.contactNumber;
			if(phoneNo.length != 10 ) {
				$scope.toClientContactNumberSuccess = false;
				$scope.toClientContactNumberError = true;
				$scope.toClientContactNumberFeedback = "has-error has-feedback";
				
			} else {
				$scope.toClientContactNumberSuccess = true;
				$scope.toClientContactNumberError = false;
				$scope.toClientContactNumberFeedback = "has-success has-feedback";
				
			}
		} else {
			$scope.toClientContactNumberError = true;
			$scope.toClientContactNumberSuccess = false;
			$scope.toClientContactNumberFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validToStreet = function(valid){
		$scope.toClientStreetValid = valid;
		if($scope.toClient.street != undefined) {
			if($scope.toClient.street.length <= 0) {
				$scope.toClientStreetError = true;
				$scope.toClientStreetFeedback = "has-error has-feedback";
			} else {
				$scope.toClientStreetSuccess = true;
				$scope.toClientStreetError = false;
				$scope.toClientStreetFeedback = "has-success has-feedback";
			}
		} else {
			$scope.toClientStreetError = true;
			$scope.toClientStreetSuccess = false;
			$scope.toClientStreetFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validToLandmark = function(valid){
		$scope.toClientLandmarkValid = valid;
		if($scope.toClient.landmark != undefined) {
			if($scope.toClient.landmark.length <= 0) {
				$scope.toClientLandmarkSuccess = false;
				$scope.toClientLandmarkError = true;
				$scope.toClientLandmarkFeedback = "has-error has-feedback";
			} else {
				$scope.toClientLandmarkSuccess = true;
				$scope.toClientLandmarkError = false;
				$scope.toClientLandmarkFeedback = "has-success has-feedback";
			}
		} else {
			$scope.toClientLandmarkError = true;
			$scope.toClientLandmarkSuccess = false;
			$scope.toClientLandmarkFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validToCity = function(valid){
		$scope.toClientCityValid = valid;
		if($scope.toClient.city != undefined) {
			if($scope.toClient.city.length <= 0) {
				$scope.toClientCitySuccess = false;
				$scope.toClientCityError = true;
				$scope.toClientCityFeedback = "has-error has-feedback";
			} else {
				$scope.toClientCitySuccess = true;
				$scope.toClientCityError = false;
				$scope.toClientCityFeedback = "has-success has-feedback";
			}
		} else {
			$scope.toClientCityError = true;
			$scope.toClientCitySuccess = false;
			$scope.toClientCityFeedback = "has-error has-feedback"; 
		}
	}
	
	$scope.validLocation = function(valid){
		$scope.locationValid = valid;
		if($scope.order.location != undefined) {
			if($scope.order.location.length <= 0) {
				$scope.locationSuccess = false;
				$scope.locationError = true;
				$scope.orderLocationFeedback = "has-error has-feedback";
			} else {
				$scope.locationSuccess = true;
				$scope.locationError = false;
				$scope.orderLocationFeedback = "has-success has-feedback";
			}
		} else {
			$scope.toClientCityError = true;
			$scope.locationError = false;
			$scope.orderLocationFeedback = "has-error has-feedback"; 
		}
	}
	
}
