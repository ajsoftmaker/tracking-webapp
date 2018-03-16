'use strict';

angular.module('trackingWebApp')
	.controller('headerController', headerController);

function headerController($scope,$rootScope){
	
	if($rootScope.user.userRole == "superadmin") {
		document.getElementById("headerLogo").src ="/assets/images/Mylogo.png";
		
	} else {
		
		if($rootScope.encodedLogo == "Set Default Logo") {
			
			document.getElementById("headerLogo").src ="/assets/images/Mylogo.png";
		} else {
			document.getElementById("headerLogo").src ="data:image/jpeg;base64,"+$rootScope.encodedLogo;
		}
		
	}
	
	
	
}
