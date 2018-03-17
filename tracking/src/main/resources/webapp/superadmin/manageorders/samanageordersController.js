'use strict';

angular.module('trackingWebApp').controller('samanageordersController',samanageordersController);

function samanageordersController($scope, $rootScope, $state, dialogs,
		restAPIService, $location,$timeout) {
	$scope.tenantsData = [];
	$scope.batchData = [];
	$scope.parent = true;
	
	 $timeout(function () {
		 if($scope.tenantsData.length < 10) {
			 $('#manageTenantDataTable_paginate').attr("style","display:none;");
		 }
    }, 1000);
	
//	getBatches();
//	getTenants();
	

	$scope.onEdit = function(tenant) {
		$scope.parent = false;
		$scope.mode = "edit";
		$scope.id = tenant.id;
		$state.go("home.samanageusers.saadduser");
	}

	$scope.addNewOrder = function() {
		$scope.parent = false;
		$scope.mode = "add";
		$state.go("home.samanageorders.saaddorder");
	}

	$scope.onDisable = function(tenant) {
		
	}

	$scope.onEnable = function(tenant) {

		
	}

	

	$scope.onDelete = function(tenant) {
		
	}

	$scope.onReset = function(tenant) {
		
	}
}
