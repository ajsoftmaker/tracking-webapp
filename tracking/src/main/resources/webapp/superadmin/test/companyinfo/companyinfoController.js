'use strict';

angular.module('trackingWebApp').controller('companyinfoController',companyinfoController);

function companyinfoController($scope, $rootScope, $state, $filter, dialogs,restAPIService, $location,$timeout,$window) {
	$scope.companyGainers = [];
	$scope.companyLoosers = [];
	
	$scope.carouselTimer = 2000;
	  $scope.slides = [
	    {
	      image: 'http://p.motionelements.com/stock-video/business/me2125201-stock-market-hd-a0005.jpg',
	      cap: 'Caption goes here',
	      link : 'http://profit.ndtv.com/market/domestic-index-nse_nifty'
	    },
	    {
	      image: 'http://il8.picdn.net/shutterstock/videos/4021198/thumb/1.jpg',
	      cap: 'Caption goes here',
	      link : 'http://www.moneycontrol.com/nifty/nse/nifty-live'
	    },
	    {
	      image: 'http://p.motionelements.com/stock-video/business/me2185958-stock-market-blue-loopable-business-background-hd-a0180.jpg',
	      cap: 'Caption goes here',
	      link : 'https://www.google.com/finance'
	    }
	  ];
	  
	$scope.markets =[
	                {title:"Advance/Decline",value:8.678},
	                {title:"Breadth ratio",value:28.678},
	                {title:"Trim",value:30654},
	                {title:"Tick",value:30678},
	                {title:"Some Ratio",value:28.678}
	                ];
	$scope.allCompany =[
		            {name:"Adani Ports",current:12345,value:0.25},
		            {name:"TCS",current:6542,value:-2},
		            {name:"Yes Bank",current:97678,value:1},
		            {name:"Infosys",current:8032,value:-3},
		            {name:"Reddy Labs",current:6842,value:4},
		            {name:"Adani",current:12345,value:-0.5},
		            {name:"HDFC",current:6542,value:0.6},
		            {name:"IBM",current:97678,value:-0.7},
		            {name:"VLab",current:8032,value:-0.8},
		            {name:"I9",current:6842,value:1.2},
		            {name:"GO",current:6842,value:2.2},
		            {name:"GO+",current:6842,value:-2.2}
		            ];
	$scope.sectors =[
		            {title:"Engery",value:8.67},
		            {title:"industrials",value:28.67},
		            {title:"Basic Material",value:-3.04},
		            {title:"Healthcare",value:3.78},
		            {title:"Technology",value:-28.78}
		            ];
	
	for(var i=0;i<$scope.allCompany.length;i++) {
		if($scope.allCompany[i].value>0) {
			$scope.companyGainers.push($scope.allCompany[i]);
		} else {
			$scope.companyLoosers.push($scope.allCompany[i]);
		}
	}
	
	 $timeout(function () {
		 if($scope.allCompany.length < 10) {
			 $('#taStudentListDataTable_paginate').attr("style","display:none;");
		 }
    }, 1000);
	$scope.dirty = {};
	function suggest_state(term) {
		var q = term.toLowerCase().trim();
		var results = [];
		// Find first 10 states that start with `term`.
		for (var i = 0; i < $scope.allCompany.length && results.length < 10; i++) {
			var state = $scope.allCompany[i].name;
			if (state.toLowerCase().indexOf(q) > -1)
				results.push({
					label : state,
					value : state
				});
		}
		return results;
	}

	$scope.autocomplete_options = {
		suggest : suggest_state
	};
	
	$scope.openNewTab = function() {
		$window.open('http://profit.ndtv.com/market/domestic-index-nse_nifty', '_blank');
	}
	
	$scope.openNewTab1 = function() {
		$window.open('http://profit.ndtv.com/market/domestic-index-nse_nifty', '_blank');
	}
	$scope.openNewTab2 = function() {
		$window.open('http://www.moneycontrol.com/nifty/nse/nifty-live', '_blank');
	}
	$scope.openNewTab3 = function() {
		$window.open('https://www.google.com/finance', '_blank');
	}
	
	$scope.openNewTabForImage = function(url) {
		$window.open(url, '_blank');
	}
	
}
