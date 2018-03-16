'use strict';

var myapp = angular.module('trackingWebApp')
	.controller('importstudentsController', importstudentsController);

function importstudentsController($scope, $rootScope, $state, $filter, dialogs, restAPIService,$timeout){
	$scope.content = null;
	$scope.upload = true;
	$scope.step1 = true;
	$scope.step="Step 1 : Select CSV File";
	$scope.students = [];
	$scope.studentDuplicate = [];
	$scope.studentImport = [];
	$scope.jasonCSV=[];
	var id = $rootScope.user.tenant_id;
	$timeout(function () {
		 if($scope.studentDuplicate.length < 10) {
			 $('#taStudentDuplicateDataTable_paginate').attr("style","display:none;");
		 }
		 if($scope.studentImport.length < 10) {
			 $('#taStudentImportDataTable_paginate').attr("style","display:none;");
		 }
	}, 1000);
	
	$scope.onCancel = function() {
		$state.go("home.tamanagestudents");
	}
	
	$scope.onUpload = function() {
		
		var fileData = $scope.content.split("\n")
		var inComment = false;
		var key = [];
		for(var i=0;i<fileData.length-1;i++){
			if(fileData[i].indexOf("/*") > -1 || inComment == true) {
				inComment = true;
				if(fileData[i].indexOf("*/") > -1) {
					inComment = false;
				}
			} else {
				if(key.length == 0) {
					key = fileData[i].split(",");
				} else {
					var data = fileData[i].split(",");
					if(data.length>2){
						var temp ={};
						for( var j=0;j<key.length;j++) {
							temp[key[j]]=data[j];	
						}
						temp["tenantID"] = $rootScope.user.tenant_id;
						temp["studentStatus"] = "1";
						$scope.jasonCSV.push(temp);
					}
				}
			}
		}
		
		var count = 0;
		if(key.indexOf("studentName")>-1){
			if(key.indexOf("studentID")>-1){
				if(key.indexOf("eMail")>-1){
					count = 3;
					if(key.indexOf("phoneNum")>-1){
						count++;
					}
					if(key.indexOf("additionalInfo")>-1){
						count++;
					}
				}
			}
		}
		
		if(count == key.length) {
			var promise1 = restAPIService.studentsService().query();
			promise1.$promise.then(
				function (response) {
					$scope.students=response;
				},
			    function(error){
			    	dialogs.error("Error", error.data.error, {'size': 'sm' });
			    }
			);
			var promise1 = restAPIService.studentsAllService().query();
			promise1.$promise.then(
				function (response) {
					$scope.allStudents=response;
					for(var i=0;i<$scope.jasonCSV.length;i++) {
						$scope.data = [];
						$scope.data = $scope.jasonCSV[i];
						var duplicate = false;
						for(var j=0;j<$scope.allStudents.length;j++) {
							if($scope.allStudents[j].studentID==$scope.data.studentID) {
								$scope.data.error = "Conflicts with existing ID"
								$scope.studentDuplicate.push($scope.data);
								duplicate = true;
								break;
							}
							if($scope.allStudents[j].eMail==$scope.data.eMail) {
								$scope.data.error = "Conflicts with existing email"
								$scope.studentDuplicate.push($scope.data);
								duplicate = true;
								break;
							}
						}
						if(duplicate==false) {
							if($scope.data.studentName==""||$scope.data.studentID==""||$scope.data.eMail==""||$scope.data.studentID==undefined||$scope.data.studentName==undefined||$scope.data.eMail==undefined){
								$scope.data.error = "Incomplete Details"
								$scope.studentDuplicate.push($scope.data);
							} else {
								$scope.studentImport.push($scope.data);
							}
						}
					}
				},
			    function(error){
			    	dialogs.error("Error", error.data.error, {'size': 'sm' });
			    }
			);
			$scope.step1 = false;
			$scope.step="Step 2 : Review and Submit";
		} else {
			dialogs.error("Error", "400 Student details are invalid", {'size': 'sm' });
		}
		
	}
	
	$scope.showContent = function($fileContent){
        $scope.content = $fileContent;
        $scope.upload =false;
    };
    
    $scope.onImport = function() {
    	var flag = true
    	var count = 0;
    	for(var i=0;i<$scope.studentImport.length;i++){
    		var promise1 = restAPIService.studentsService().save($scope.studentImport[i]);
			promise1.$promise.then(
				function (response) {
					count++;
					if(count == $scope.studentImport.length) {
			    		dialogs.notify("Success", response.success, {'size': 'sm' });
						$state.go("home.tamanagestudents");
			    	}
			    },
			    function(error){
			    	flag=false;
			    	dialogs.error("Error", error.data.error, {'size': 'sm' });
			    }
			);
    	}
    	
    	if(flag == false) {
    		dialogs.notify("Success", "Failed to add students", {'size': 'sm' });
    	}
    }
   
}

myapp.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
                
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});
