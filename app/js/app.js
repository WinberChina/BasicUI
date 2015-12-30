/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
	"ui.bootstrap",
	"oc.lazyLoad",
	"ngSanitize"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		// global configs go here
	});
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
	// this option might be handy for migrating old apps, but please don't use it
	// in new ones!
	$controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
	// supported languages
	var settings = {
		layout: {
			pageSidebarClosed: false, // sidebar menu state
			pageBodySolid: false, // solid body color state
			pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
		},
		layoutImgPath: Metronic.getAssetsPath() + 'admin/img/',
		layoutCssPath: Metronic.getAssetsPath() + 'admin/css/'
	};

	$rootScope.settings = settings;

	return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.$on('$viewContentLoaded', function() {
		Metronic.initComponents(); // init core components
		//Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
	});
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initHeader(); // init header
	});
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initSidebar(); // init sidebar
	});
	
	$scope.openTab = function(name, url) {
		$('#tab-contents').html(
		  $compile('<input type="text" ng-model="person.name" /> <input type="input" ng-model="person.age" value="{{person.age}}" /><a ng-show="$index!=0" style="color:red;" ng-click="del($index)">移除</a>'
		  )(scope));
	}
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initFooter(); // init footer
	});
}]);

/* Init global settings and run the app */
/*MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
	$rootScope.$state = $state; // state to be accessed from view
}]);*/

MetronicApp.run(["$rootScope", "settings", function($rootScope, settings) {
	
}]);