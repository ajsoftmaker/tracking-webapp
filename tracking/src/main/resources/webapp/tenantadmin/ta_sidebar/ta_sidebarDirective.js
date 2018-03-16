'use strict';

angular.module('trackingWebApp')
  .directive('taSidebarDirective', taSidebarDirective);

function taSidebarDirective() {
	
	var sidebar = {};
	sidebar.templateUrl = 'tenantadmin/ta_sidebar/ta_sidebar.html';
	sidebar.restrict = 'E';
	sidebar.controller = taSidebarController;
	
	return sidebar;
}