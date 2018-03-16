'use strict';

angular.module('eqRestAPIs', []).factory('restAPIService', restAPIService);

function restAPIService($resource, $rootScope, $http) {

	return {
		loginService : loginService,
		superAdminService : superAdminService,
		coursesService : coursesService,
		getPassOrFailByCoursesService : getPassOrFailByCoursesService,
		popularCoursesService : popularCoursesService,
		coursesTenantFavService : coursesTenantFavService,
		courseService : courseService,
		courseFilesService : courseFilesService,
		uploadedFileListService : uploadedFileListService,
		batchesService : batchesService,
		batchService : batchService,
		batchRequestsService : batchRequestsService,
		batchRequestService : batchRequestService,
		tenantsService : tenantsService,
		tenantService : tenantService,
		logoService : logoService,
		tenantResetService : tenantResetService,
		studentsService : studentsService,
		studentsAllService : studentsAllService,
		studentService : studentService,
		studentBatchesService : studentBatchesService,
		studentBatchService : studentBatchService,
		uniqueStudentBatchService : uniqueStudentBatchService,
		studentTestsService : studentTestsService,
		studentTestsByResultService : studentTestsByResultService,
		studentTestsServiceByTestId : studentTestsServiceByTestId,
		studentTestsServiceByResultWithTestId : studentTestsServiceByResultWithTestId,
		studentTestService : studentTestService,
		studentTestByIDService : studentTestByIDService,
		testsService : testsService,
		testService : testService,
		testScriptService : testScriptService,
		activateService : activateService,
		updatePasswordService : updatePasswordService,
		findEmailService : findEmailService,
		updatePasswordEmailService : updatePasswordEmailService,
		forgotPasswordService : forgotPasswordService,
		labjumpUsersByLoginIdService : labjumpUsersByLoginIdService,
		filesService : filesService,
		fileService : fileService,
		deleteUploadedFileService : deleteUploadedFileService,
		profilesService : profilesService,
		profileService : profileService,
		scriptExecuterService : scriptExecuterService,
		podsService : podsService,
		machinesService : machinesService,
		connectMachineService : connectMachineService,
		batchRequestsByRequestStatusService : batchRequestsByRequestStatusService,
		courseCountService : courseCountService,
		getCourseCountService : getCourseCountService,
		downloadFileService : downloadFileService
		
	}

	function loginService(username, pwd ,role) {
		var url = $rootScope.apiUrl + "login";
		return $resource(url);
	}
	
	function superAdminService() {
		var url = $rootScope.apiUrl + "login/superadmin";
		return $resource(url);
	}

	function coursesService() {
		var url = $rootScope.apiUrl + "courses";
		return $resource(url);
	}
	
	function getPassOrFailByCoursesService() {
		var url = $rootScope.apiUrl + "courses/getBarChartData";
		return $resource(url);
	}
	
	function popularCoursesService() {
		var url = $rootScope.apiUrl + "courses/popularCourses";
		return $resource(url);
	}
	
	function coursesTenantFavService(tenantid) {
		var url = $rootScope.apiUrl + "courses/tenantFavCourses/" + tenantid;
		return $resource(url);
	}

	function courseService(courseID) {
		var url = $rootScope.apiUrl + "course/" + courseID;
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			},
			'get' : {
				method : 'GET'
			}
		});
	}

	function courseFilesService(courseID ,mode) {
		var url = $rootScope.apiUrl + "course/" + courseID + "/files/" + mode;
		return $resource(url, null, {
			'save' : {
				method : 'POST',
				transformRequest :function(data) {
				    if (data === undefined)
				        return data;
				      var fd = new FormData();
				      angular.forEach(data, function(value, key) {
				        if (value instanceof FileList) {
				          if (value.length == 1) {
				            fd.append(key, value[0]);
				          } else {
				            angular.forEach(value, function(file, index) {
				              fd.append(key + '_' + index, file);
				            });
				          }
				        } else {
				          fd.append(key, value);
				        }
				      });
				      return fd;
				    },
				headers : {
					'Content-Type' : undefined,
					enctype : 'multipart/form-data'
				}
			}
		});
	}
	
	function uploadedFileListService(courseID) {
		var url = $rootScope.apiUrl + "course/" + courseID;
		return $resource(url);
	}

	function batchesService() {
		var url = $rootScope.apiUrl + "batches";
		return $resource(url);
	}
	
	function batchService(id) {
		var url = $rootScope.apiUrl + "batch/"+id;
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			}
		});
	}
	
	function batchRequestsService() {
		var url = $rootScope.apiUrl + "batchrequests";
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			}
		});
	}
	
	function batchRequestService(id) {
		var url = $rootScope.apiUrl + "batchrequest/"+id;
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			}
		});
	}

	function tenantsService() {
		var url = $rootScope.apiUrl + "tenants";
		return $resource(url);
	}
	
	function tenantService(id) {
		var url = $rootScope.apiUrl + "tenant/" + id;
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			},
			'get' : {
				method : 'GET'
			}
		});
	}
	
	function logoService(id) {
		var url = $rootScope.apiUrl + "tenant/" + id + "/logo";
		return $resource(url, null, {
			'save' : {
				method : 'POST',
				transformRequest :function(data) {
				    if (data === undefined)
				        return data;
				      var fd = new FormData();
				      angular.forEach(data, function(value, key) {
				        if (value instanceof FileList) {
				          if (value.length == 1) {
				            fd.append(key, value[0]);
				          } else {
				            angular.forEach(value, function(file, index) {
				              fd.append(key + '_' + index, file);
				            });
				          }
				        } else {
				          fd.append(key, value);
				        }
				      });

				      return fd;
				    },
				headers : {
					'Content-Type' : undefined,
					enctype : 'multipart/form-data'
				}
			},
			get : {
			method : 'GET'
			}
		});
	}
	
	function tenantResetService(id) {
		var url = $rootScope.apiUrl + "tenant/" + id +"/reset";
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			}
		});
	}

	function studentsService() {
		var url = $rootScope.apiUrl + "students";
		return $resource(url);
	}
	
	function studentsAllService() {
		var url = $rootScope.apiUrl + "students/all";
		return $resource(url);
	}
	
	function studentService(studentID) {
		var url = $rootScope.apiUrl + "student/" + studentID;
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			}
		});
	}

	function studentBatchesService() {
		var url = $rootScope.apiUrl + "studentbatches";
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			}
		});
	}
	
	function studentBatchService(id) {
		var url = $rootScope.apiUrl + "studentbatch/"+id;
		return $resource(url);
	}
	
	function uniqueStudentBatchService(batchID, studentID) {
		var url = $rootScope.apiUrl + "studentbatch/" + batchID + "/" + studentID;
		return $resource(url);
	}

	function studentTestsService() {
		var url = $rootScope.apiUrl + "studenttests";
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			}
		});
	}
	
	function studentTestsByResultService(result) {
		var url = $rootScope.apiUrl + "studenttests/"+result;
		return $resource(url);
	}
	
	function studentTestsServiceByTestId(id) {
		var url = $rootScope.apiUrl + "studenttests/"+id +"/test";
		return $resource(url);
	}
	
	function studentTestsServiceByResultWithTestId(result , id) {
		var url = $rootScope.apiUrl + "studenttests/"+id+"/test/"+result;
	}
	
	function studentTestService(id) {
		var url = $rootScope.apiUrl + "studenttest/"+id;
		return $resource(url);
	}
	
	function studentTestByIDService(studentid,testid,result) {
		var url = $rootScope.apiUrl + "studenttest/" + studentid +"/"+testid+"/"+result;
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			}
		});
	}

	function testsService() {
		var url = $rootScope.apiUrl + "tests";
		return $resource(url, null, {
			'update' : {
				method : 'PUT'
			}
		});
	}
	
	function testService(courseID) {
		var url = $rootScope.apiUrl + "test/" + courseID;
		return $resource(url);
	}
	
	function testScriptService(type) {
		var url = $rootScope.apiUrl + "testscript/"+type;
		return $resource(url);
	}

	function activateService() {
		var url = $rootScope.apiUrl + "labjumpusers/activate";
		return $resource(url);
	}
	
	function updatePasswordService() {
		var url = $rootScope.apiUrl + "labjumpusers/updatepassword";
		return $resource(url);
	}

	function findEmailService(email) {
		var url = $rootScope.apiUrl + "labjumpusers/email/" + email;
		return $resource(url);
	}
	
	function updatePasswordEmailService(email) {
		var url = $rootScope.apiUrl + "labjumpusers/updatepassword/" + email;
		return $resource(url);
	}

	function forgotPasswordService(email,role) {
		var url = $rootScope.apiUrl + "labjumpusers/forgotpassword/" + email+"/"+role;
		return $resource(url);
	}

	function labjumpUsersByLoginIdService(loginId , password) {
		var url = $rootScope.apiUrl + "labjumpusers/"+loginId+"/"+password;
		return $resource(url);
	}
	
	function filesService() {
		var url = $rootScope.apiUrl + "files";
		return $resource(url);
	}
	
	function fileService(courseID) {
		var url = $rootScope.apiUrl + "file/"+courseID;
		return $resource(url);
	}
	
	function deleteUploadedFileService(courseID,FileID) {
		var url = $rootScope.apiUrl + "file/" + courseID +"/"+FileID;
		return $resource(url);
	}
	
	function profilesService() {
		var url = $rootScope.apiUrl + "guacprofiles";
		return $resource(url);
	}
	
	function profileService(id) {
		var url = $rootScope.apiUrl + "guacprofile/"+id;
		return $resource(url);
	}
	
	function scriptExecuterService(filename) {
		var url = $rootScope.apiUrl + "scriptexecute/"+filename;
		return $resource(url);
	}
	
	function podsService(id) {
		var url = $rootScope.apiUrl + "guacamole/connectiongroups/"+id;
		return $resource(url);
	}
	
	function machinesService(profileID, connectionGroupID){
		var url = $rootScope.apiUrl + "guacamole/connections/" + profileID + "/" + connectionGroupID;
		return $resource(url);
	}
	
	function connectMachineService(profileID, machineID){
		var url = $rootScope.apiUrl + "guacamole/connect/" + profileID + "/" + machineID;
		return $resource(url, null, {
			get: {
		        method: 'GET',
		        transformResponse: function(data, headers){
		            var response = {}
		            response.data = data;
		            response.headers = headers();
		            return response;
		        }
			}
		});
	}
	
	function batchRequestsByRequestStatusService(requestStatus) {
		var url = $rootScope.apiUrl + "batchrequests/" +requestStatus ;
		return $resource(url);
	}
	
	function courseCountService() {
		var url = $rootScope.apiUrl + "courseCount" ;
		return $resource(url,null,{
			'update' : {
				method : 'PUT'
			}
		});
	}
	function getCourseCountService(courseID) {
		var url = $rootScope.apiUrl + "courseCount/" +courseID;
		return $resource(url);
	}
	
	function downloadFileService(courseID ,fileName) {
		var url = $rootScope.apiUrl + "course/" + courseID + "/download/" + fileName;
		return $resource(url);
	}
}