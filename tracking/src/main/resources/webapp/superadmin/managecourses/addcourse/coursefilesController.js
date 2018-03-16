'use strict';

angular.module('trackingWebApp').controller('coursefilesController',
		coursefilesController);

function coursefilesController($scope, $rootScope, $state, dialogs,
		restAPIService) {
	getFilesByCourseId();
	$scope.$parent.heading = "Upload files for course";
	$scope.fileList = [];
	$scope.mode = {
					name : 'view'
					}
	$scope.existingFileList =[];
	function getFilesForCourse() {
		var promise = restAPIService.courseFilesService($scope.newCourse.id).query();
		promise.$promise.then(function(response) {
			$scope.fileList = response;
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}

	$scope.onFileSelect = function() {

		if ('files' in fileLoader) {
			if (fileLoader.files.length > 0) {
				for (var i = 0; i < fileLoader.files.length; i++) {
					var file = fileLoader.files[i];
					if ('name' in file) {
						var fileToAdd = {
							fileName : file.name,
							fileContent : file,
						}
						$scope.fileList.push(fileToAdd);
						$scope.$apply();
					}
				}
			}
		}
	}

	$scope.onUploadFiles = function() {
		var uploadPdfCount = 0;
		for (var i = 0; i < $scope.fileList.length; i++) {
			var fd = new FormData();
			var content = $scope.fileList[i].fileContent;
			if (content !== null && content !== undefined && content !== '') {
				fd.append('coursefiles', content);
			}
			var promise1 = restAPIService.courseFilesService($scope.newCourse.courseID, 'view').save(fd);
			promise1.$promise.then(function(response) {
				uploadPdfCount++;
				if (uploadPdfCount == $scope.fileList.length) {
					dialogs.notify("Success", response.success, {'size' : 'sm'});
					$state.reload();
				}
			}, function(error) {
				dialogs.error("Error", error.data.error, {'size' : 'sm'});
			});
		}

	}

	$scope.onDeleteFile = function(index) {
		$scope.fileList.splice(index, 1);
	}
	
	function getFilesByCourseId () {
		var promise = restAPIService.uploadedFileListService($scope.newCourse.courseID).get();
		promise.$promise.then(function(response) {
			var promise1 = restAPIService.fileService(response.id).query();
			promise1.$promise.then(function(response) {
				$scope.existingFileList = response;
			}, function(error) {
				dialogs.error("Error", error.data.error, {'size' : 'sm'});
			});
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
		
	}
	
	$scope.onDeleteUploadedFile = function(courseID,fileID) {
		var promise = restAPIService.deleteUploadedFileService(courseID,fileID).remove();
		promise.$promise.then(function(response) {
			dialogs.notify("Success", response.success, {'size' : 'sm'});
			$state.reload();
		}, function(error) {
			dialogs.error("Error", error.data.error, {'size' : 'sm'});
		});
	}
}
