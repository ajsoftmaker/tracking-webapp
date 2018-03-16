'use strict';

angular.module('trackingWebApp')
	.directive('headerDirective', headerDirective);
			
function headerDirective(){

	var header = {};
	header.templateUrl = 'header/header.html';
	header.restrict = 'E';
	header.controller = headerController;

	return header;
}

