'use strict';

angular.module('trackingWebApp')
  .directive('stSidebarDirective', stSidebarDirective);

function stSidebarDirective() {
	
	var sidebar = {};
	sidebar.templateUrl = 'student/st_sidebar/st_sidebar.html';
	sidebar.restrict = 'E';
	sidebar.controller = stSidebarController;
	
	return sidebar;
}