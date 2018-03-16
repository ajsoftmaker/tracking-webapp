'use strict';

angular.module('trackingWebApp')
.controller('homeController', homeController);

function homeController ($state, $scope) {
	$scope.reportMode = localStorage.getItem("reportMode");
}