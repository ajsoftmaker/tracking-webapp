'use strict';

angular.module('trackingWebApp')
	.controller('addcourseController', addcourseController);

function addcourseController($scope, $rootScope, $state, dialogs, restAPIService,$location){
	$scope.form = false;
	$scope.fileList = [];
	$scope.tests = [];
	$scope.newTests = [];
	$scope.editTests = [];
	$scope.deleteTests = [];
	$scope.test={};
	$scope.newTest={};
	$scope.tenants = [];
	$scope.tenantsName = ["All"];
	$scope.tenantsCode = [""];
	$scope.index=null;
	$scope.verifyScript="";
	$scope.resetScript="";
	$scope.courseTypes = ["Objective Questions Only",
	                      "Labs Only ",
						  "Both"];
	$scope.courseTypeCodes = ["OBJ",
	                          "LAB",
	                          "MIX"];
	$scope.courseLevels = ["Foundation",
	                       "Intermediate",
						   "Advanced"];
	$scope.courseLevelCodes = ["L1",
	                           "L2",
	                           "L3"];
	$scope.labTypes = ["Practice Labs",
	                   "Skills Based Labs"];
	$scope.labTypeCodes = ["PS",
	                       "SB"];
	$scope.techPlatforms = ["VM Ware",
	                        "Windows",
	                        "Unix",
	                        "My SQL",
	                        "Oracle"];
	$scope.techPlatformCodes = ["VMW",
	                            "WIN",
	                            "UNX",
	                            "SQL",
	                            "ORC"];
	$rootScope.newCourse = {description : "",
			courseName : "",
			courseType : "",
			courseLevel : "",
			techPlatform : "",
			labType : "",
			maxClassSize : "6",
			courseID : "",
			durationDays : "",
			setupTimeDays : "" ,
			customerID : "",
			noOfTest : ""};
	$scope.ifNoLab = true;
	
	$state.go('home.samanagecourses.saaddcourse.coursedetails');
	
	
	getTenants();
	getVerifyScript();
	getResetScript();
	
	function getTenants() {
		var promise1 = restAPIService.tenantsService().query();
		promise1.$promise.then(function(response) {
			$scope.tenants = response;
			for(var i=0;i<$scope.tenants.length;i++) {
				$scope.tenantsName.push($scope.tenants[i].tenantName);
				$scope.tenantsCode.push($scope.tenants[i].tenantCode);
			}
			setCourseData()
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}
	
	function setCourseData() {
		if($scope.mode=="edit"){
			$scope.heading = "Edit Course";
			$scope.editMode = true;
			var promise1 = restAPIService.courseService($scope.id).get();
			promise1.$promise.then(
				function (response) {
					$rootScope.newCourse=response;
					$scope.onCourseTypeChange();
					var foundIndex = $.inArray($rootScope.newCourse.customerID, $scope.tenantsCode);
					$rootScope.newCourse.customerID = $scope.tenantsName[foundIndex];
					var promise2 = restAPIService.testService(response.id).query();
					promise2.$promise.then(
						function (response) {
							$scope.tests=response;
					    },
					    function(error){
					    	dialogs.error("Error", error.data.error, {'size': 'sm' });
					    }
					);
			    },
			    function(error){
			    	dialogs.error("Error", error.data.error, {'size': 'sm' });
			    }
			);
		} else {
			$scope.heading = "Add New Course";
			$scope.editMode = false;
		}
	}
	
	$scope.onCancel = function(){
		$state.reload();
	}
	
	$scope.onSubmit = function(){
		if($scope.newCourse.labType=='Skills Based Labs'){
			$rootScope.newCourse.noOfTest = $scope.newCourse.noOfTest;
		} else {
			$rootScope.newCourse.noOfTest = "";
		}
		var foundIndex = $.inArray($rootScope.newCourse.customerID, $scope.tenantsName);
		$rootScope.newCourse.customerID = $scope.tenantsCode[foundIndex];
		if($scope.mode=="edit"){
			var promise = restAPIService.courseService($scope.id).update($rootScope.newCourse);
			promise.$promise.then(
					function (response) {
						//Add new Test
						for(var i=0;i<$scope.newTests.length;i++) {
							var test1 = {};
							test1.courseID = $rootScope.newCourse.id;
							test1.description = $scope.newTests[i].description;
							test1.resetScript = $scope.newTests[i].resetScript;
							test1.testName = $scope.newTests[i].testName;
							test1.verifyScript = $scope.newTests[i].verifyScript;
							var promise3 = restAPIService.testsService().save(test1);
							promise3.$promise.then(
									function (response) {
									},
									function(error){
										dialogs.error("Error", error.data.error, {'size': 'sm' });
									}
							);
						}
						//Update Test
						for(var i=0;i<$scope.editTests.length;i++) {
							var test1 = $scope.editTests[i];
							var promise3 = restAPIService.testsService().update(test1);
							promise3.$promise.then(
									function (response) {
									},
									function(error){
										dialogs.error("Error", error.data.error, {'size': 'sm' });
									}
							);
						}
						//Delete Test
						for(var i=0;i<$scope.deleteTests.length;i++) {
							var test1 = $scope.deleteTests[i];
							var promise3 = restAPIService.testService(test1.id).remove();
							promise3.$promise.then(
									function (response) {
									},
									function(error){
										dialogs.error("Error",  error.data.error, {'size': 'sm' });
									}
							);
						}
						
						dialogs.notify("Success", "Course updated successfully", {'size': 'sm' });
						$state.go('home.samanagecourses.saaddcourse.coursefiles');
				    },
				    function(error){
				    	dialogs.error("Error", error.data.error, {'size': 'sm' });
				    }
				);
		}else{
			 generateNewCourseId();
		}
	}
	
	function generateCourseID(){
		
		var id = "";
		var foundIndex = $.inArray($rootScope.newCourse.courseLevel, $scope.courseLevels);
		id = $scope.courseLevelCodes[foundIndex];
		foundIndex = $.inArray($rootScope.newCourse.techPlatform, $scope.techPlatforms);
		id = id + "-" + $scope.techPlatformCodes[foundIndex];
		foundIndex = $.inArray($rootScope.newCourse.courseType, $scope.courseTypes);
		id = id + "-" + $scope.courseTypeCodes[foundIndex];
		if (foundIndex > 0){  // only if labs are there, get lab type
			foundIndex = $.inArray($rootScope.newCourse.labType, $scope.labTypes);
			id = id + "-" + $scope.labTypeCodes[foundIndex];
		}
		if ($scope.newCourse.customerID != ""){
			id = id + "-" + $rootScope.newCourse.customerID;
		}
		return id;
	}
	
	 function generateNewCourseId() {
		 var id;
		 var count;
		 var genId = generateCourseID();
			var promise1 = restAPIService.getCourseCountService(genId).get();
			promise1.$promise.then(
					function(response) {
						if(response.success =="isEmpty") {
							count = 1;
							 var obj = {
										"courseID":genId,
										"count":  count
								}
							 id = getIdByCount(genId,count)
							 getCourseCount(id,obj);
						} else {
							count =  response.count;
							count++;
						 var obj = {
								 	"id" :response.id,
									"courseID":genId,
									"count":  count
							}
						 
						 id =  getIdByCount(genId,count)
						 getCourseCount(id,obj);
						}
					},function(error) {
						dialogs.error("Error", error.data.error, {'size': 'sm' });
					});
			
	 }
	 
	 function getCourseCount(genId ,obj) {
		 var promise = restAPIService.courseService(genId).get();
			promise.$promise.then(
					function(response) {
						if(response.success == "isEmpty") {
							var promise1 = restAPIService.courseCountService().save(obj);
							promise1.$promise.then(
									function(response) {
										setCourseValue(genId);
									},function(error) {
										dialogs.error("Error", error.data.error, {'size': 'sm' });
									});
						} else {
							var promise1 = restAPIService.courseCountService().update(obj);
							promise1.$promise.then(
									function(response) {
										setCourseValue(genId);
									},function(error) {
										dialogs.error("Error", error.data.error, {'size': 'sm' });
									});
						}
					},function(error) {
						dialogs.error("Error", error.data.error, {'size': 'sm' });
						}
					);
	 }
	 
	 function getIdByCount(id,count){
		 var count = ""+count;
		 var countsize = count.length;
		 var pad ="0000";
		 if(countsize <= pad.length){
				 var str = ""+ count;
				 var ans = id+"-"+ pad.substring(0, pad.length - str.length) + str;
				 return ans;
			 
		 }else {
		     var pad1 ="9999"
		     var pad2 = Math.floor(Number(count)/Number(pad1));
		 	 var pad3 = Number(pad1)*pad2;
		     var str1 = ""+ (Number(count) - Number(pad3));
		 	 var ans = id+"-"+getPadValue(pad2)+pad.substring(0,pad.length - str1.length)+str1;
		 	return ans;
		      
		 }
		
	 }
	 function getPadValue(count){
		 	 var pad ="9999";
		     var x ="";
		 	 for (var i=0 ; i < count ;i++){
		      	x+=pad+"-";
		      }
		      return x;
		 }
	function setCourseValue(id) {
		$rootScope.newCourse.courseID = id;
		if($rootScope.newCourse.courseID != undefined || $rootScope.newCourse.courseID != "") {
			var promise1 = restAPIService.coursesService().save($rootScope.newCourse);
			promise1.$promise.then(
				function (response) {
					var promise2 = restAPIService.courseService($rootScope.newCourse.courseID).get();
					promise2.$promise.then(
						function (response) {
							for(var i=0;i<$scope.tests.length;i++) {
								$scope.tests[i]["courseID"] = response.id; 
								var promise3 = restAPIService.testsService().save($scope.tests[i]);
								promise3.$promise.then(
									function (response) {
								    },
								    function(error){
								    	dialogs.error("Error", error.data.error, {'size': 'sm' });
								    }
								);
							}
					    },
					    function(error){
					    	dialogs.error("Error", error.data.error, {'size': 'sm' });
					    }
					);
					dialogs.notify("Success", "Course added successfully with Course ID:"+ $rootScope.newCourse.courseID, {'size': 'sm' });
					$state.go('home.samanagecourses.saaddcourse.coursefiles');
			    },
			    function(error){
			    	if(error.status == 304) {
			    		dialogs.error("Error", "Already Course Existed ", {'size': 'sm' });
			    	} else {
			    	dialogs.error("Error", error.data.error, {'size': 'sm' });
			    	}
			    }
			);
		}
	}
	 
	$scope.onCourseTypeChange = function (){
		var foundIndex = $.inArray($rootScope.newCourse.courseType, $scope.courseTypes);
		if (foundIndex > 0){
			$scope.ifNoLab = false;
		}
		else{
			$scope.ifNoLab = true;
			$scope.form=false;
		}	
	}
	
	$scope.addNewTest = function() {
		$scope.test = $scope.newTest;
		$scope.tests.push($scope.test);
		$scope.newTests.push($scope.test);
		$scope.checkNoOfTest();
	}
	
	$scope.onDeleteTest = function(test,index) {
		var dlg = dialogs.confirm("Are you sure?", "Are you sure you wish to delete this test?", {'size': 'sm' });
		dlg.result.then(function(btn){
			$scope.tests.splice(index, 1);
			$scope.deleteTests.push(test);
			$scope.checkNoOfTest();
		},function(btn){});
	}
	
	$scope.setNewTest = function() {
		$scope.newTest = {};
		$scope.newTest.verifyScript = $scope.verifyScript;
		$scope.newTest.resetScript = $scope.resetScript;
	}
	
	$scope.onEditTest = function(test,index) {
		$scope.index = index;
		$scope.edittest = test
	}
	
	$scope.editNewTest = function(edittest) {
		$scope.editTests.push(edittest);
	}
	
	$scope.onhit = function(tenantInfo) {
		alert(tenantInfo)
	}
	
	$scope.checkNoOfTest = function() {
		if($scope.newCourse.noOfTest>$scope.tests.length && $scope.newCourse.labType=='Skills Based Labs' && $scope.ifNoLab==false) {
			$scope.form=true;
		} else {
			$scope.form=false;
		}
	}
	
	function getVerifyScript() {
		var promise1 = restAPIService.testScriptService("verify").get();
		promise1.$promise.then(function(response) {
			$scope.verifyScript=response.success;
		}, function(error) {
			dialogs.error("Error",  error.data.error, {'size' : 'sm'});
		});
	}
	
	function getResetScript() {
		var promise1 = restAPIService.testScriptService("reset").get();
		promise1.$promise.then(function(response) {
			$scope.resetScript=response.success;
		}, function(error) {
			dialogs.error("Error",  error.data.error, {'size' : 'sm'});
		});
	}
	
}
