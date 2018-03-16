'use strict';

angular.module('trackingWebApp')
	.controller('saguacDProfileController', saguacDProfileController);

function saguacDProfileController($scope, $rootScope, $state, $filter, dialogs, restAPIService, $timeout){
	$scope.profiles = [];
	$scope.profile = {};
	
	getAllProfiles();
	
	 $timeout(function () {
		 if($scope.profiles.length < 10) {
			 $('#saProfilesDataTable_paginate').attr("style","display:none;");
		 }
    }, 1000);
	 
	function getAllProfiles() {
		var promise1 = restAPIService.profilesService().query();
		promise1.$promise.then(
			function (response) {
				$scope.profiles =  response;
		    },
		    function(error){
		    	dialogs.error("Error", error.data.error, {'size': 'sm' });
		    }
		);
	}
	
	$scope.addNewprofile = function() {
		var promise = restAPIService.profilesService().save(null,$scope.profile);
		promise.$promise.then(
				function (response) {
					dialogs.notify("Success", "Profile added successfully", {'size': 'sm' });
					$scope.profile = {};
					getAllProfiles();
				},
				function (error) {
					dialogs.error("Error", error.data.error, {'size': 'sm' });
				}
		);
	}
	
	$scope.onDelete = function(id) {
		var dlg = dialogs.confirm("Are you sure?", "Are you wish to delete this Profile?", {'size': 'sm' });
		dlg.result.then(function(btn){
			var promise = restAPIService.profileService(id).remove();
			promise.$promise.then(
					function (response) {
//						dialogs.notify("Success", "Profile deleted successfully", {'size': 'sm' }); response.success
						getAllProfiles();
					},
					function(error){
						dialogs.error("Error", error.data.error, {'size': 'sm' });
					}
			);
		},function(btn){});
	}
	
	$scope.onTest = function(profileId) {
		var promise = restAPIService.podsService(profileId).get();
		promise.$promise.then(
				function (response) {
					dialogs.notify("Success", "Test Success", {'size': 'sm' });
				},
				function(error){
					dialogs.error("Error", error.data.error, {'size': 'sm' });
				}
		);
	}
}
