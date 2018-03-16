'use strict';

angular.module('trackingWebApp').controller('saManageClientsController',saManageClientsController);

function saManageClientsController($scope, $rootScope, $state, dialogs,
		restAPIService, $location,$timeout) {
	$scope.clientsData = [];
	$scope.parent = true;
	
	 $timeout(function () {
		 if($scope.clientsData.length < 10) {
			 $('#manageClientsDataTable_paginate').attr("style","display:none;");
		 }
    }, 1000);

	$scope.onEdit = function(client) {
		$scope.parent = false;
		$scope.mode = "edit";
		$scope.id = client.id;
		$state.go("home.samanageclients.saaddclient");
	}

	$scope.addNewClient = function() {
		$scope.parent = false;
		$scope.mode = "add";
		$state.go("home.samanageclients.saaddclient");
	}
	
	$scope.onDelete = function(client) {
		var dlg = dialogs.confirm("Are you sure?","Are you sure you wish to delete this tenant?", {'size' : 'sm'});
		dlg.result.then(function(btn) {
			var promise2 = restAPIService.tenantService(client.id).remove();
			promise2.$promise.then(function(response) {
				dialogs.notify("Success", response.success, {'size' : 'sm'});
				$state.reload();
			}, function(error) {
				dialogs.error("Error", error.data.error, {'size' : 'sm'});
			});
		}, function(btn) {
		});
	}

}
