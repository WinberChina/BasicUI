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
MetronicApp.controller('AppController', ['$scope', '$rootScope', '$injector', function($scope, $rootScope, $injector) {
	$scope.$on('$viewContentLoaded', function() {
		Metronic.initComponents(); // init core components
		//Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
	});

	$rootScope.urlJsonArry = [];
	$rootScope.tabCounter = 0;

	$rootScope.openTab = function(tabName, tabUrl) {
		console.log($rootScope.tabCounter);
		var urlJson = {},
			parentUl = $("#tab-nav"),
			parentDiv = $("#tab-contents");

		// 判断tab页是否打开
		for (var i = 0; i < $rootScope.urlJsonArry.length; i++) {
			var jsonTemp = $rootScope.urlJsonArry[i];
			if (jsonTemp.url == tabUrl) {
				$('#' + jsonTemp.id).trigger('click');
				return;
			}
		}

		/* 增加一个tab页  */
		var tabTemplate = "<li><a id='#{id}' href='#{href}' data-toggle='tab'>#{label}</a> <span id='#{closeId}' class='navs-close'></span></li>";
		var tabId = "tab" + $rootScope.tabCounter,
			contentId = "tab-content" + $rootScope.tabCounter;
		li = $(tabTemplate.replace(/#\{id\}/g, tabId).replace(/#\{href\}/g, "#" + contentId).replace(/#\{label\}/g, tabName).replace(/#\{closeId}/g, tabId + "-close"));
		$injector.invoke(function($compile) {
			parentUl.append($compile(li)($scope));
		});
		// console.log($("#tab-nav").html());

		/*增加tab页关联内容*/
		var contentTemplate = $("<div id='" + contentId + "' class='tab-content' data-ng-include=\"'" + tabUrl + "'\"></div>");

		$injector.invoke(function($compile) {
			parentDiv.append($compile(contentTemplate)($scope));
		});
		// parentDiv.append(contentTemplate);

		// parentDiv.append("<div id='" + contentId + "' class='tab-content'></div>");
		// $("#" + contentId).load(tabUrl);
		console.log(parentDiv.html());

		/*激活当前tab */
		parentUl.children("li").each(function() {
			$(this).removeClass("active");
		});
		li.addClass("active");

		/* 为a标签绑定点击事件 */
		$('#' + tabId).on('click', function() {
			$('.tab-content').each(function() {
				$(this).hide();
			});
			$('#' + contentId).show();
		});
		
		/* 展示当前tab页  */
		$('.tab-content').each(function() {
			$(this).hide();
		});
		$('#' + contentId).show();

		/*为关闭按钮绑定事件*/
		$('#' + tabId + "-close").on('click', function() {
			$(this).closest("li").remove(); // 刪除tab
			$('#' + contentId).remove(); // 删除内容
			var index;
			for (var i = 0; i < $rootScope.urlJsonArry.length; i++) {
				var jsonTemp = $rootScope.urlJsonArry[i];
				if (jsonTemp.id == tabId) {
					index = i;
					$rootScope.urlJsonArry.splice(i, 1);
					break;
				}
			}

			// 移除tab后展现上一个tab
			if (index > 0) {
				$("#" + $rootScope.urlJsonArry[index - 1].id).trigger("click");
			} else {
				if ($rootScope.urlJsonArry.length > 0)
					$("#" + $rootScope.urlJsonArry[0].id).trigger("click");
			}
		});

		/*保存已打开tab页*/
		urlJson.id = tabId;
		urlJson.url = tabUrl;
		$rootScope.urlJsonArry.push(urlJson);

		$rootScope.tabCounter++;
	}
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
}]);

/* Tab Init */
/*MetronicApp.controller('TabController', ['$scope', '$rootScope', '$injector', function($scope, $rootScope, $injector) {

	$scope.settings = {
		isFormShow: true
	};

	//控制查询form显示
	$scope.toggleForm = function() {
		$scope.settings.isFormShow = !$scope.settings.isFormShow;
	}
}]);*/

/* Open Tree */
MetronicApp.controller('TreeModaController', ['$modal', function($rootScope, $modal) {
	$rootScope.treeModal = function(url, size) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/tree-modal.html',
			controller: 'ModalInstanceCtrl',
			size: size,
			resolve: {
				items: function() {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	}
}]);

MetronicApp.controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {
	$scope.items = items;
	$scope.selected = {
		item: $scope.items[0]
	};

	$scope.ok = function() {
		$modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});

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