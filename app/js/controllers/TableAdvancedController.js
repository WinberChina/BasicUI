/* Setup general page controller */
MetronicApp.controller('TableAdvancedController', ['$rootScope', '$scope', 'settings', '$modal', '$log', function($rootScope, $scope, settings, $modal, $log) {
	$scope.settings = {
		isFormShow: false
	};

	$scope.$on('$viewContentLoaded', function() {
		// initialize core components
		Metronic.initAjax();

		// set default layout mode
		$rootScope.settings.layout.pageBodySolid = false;
		$rootScope.settings.layout.pageSidebarClosed = false;
	});

	//控制查询form显示
	$scope.toggleForm = function() {
		$scope.settings.isFormShow = !$scope.settings.isFormShow;
	}

	$scope.items = ['item1', 'item2', 'item3'];

	$scope.open = function(size) {
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
	};


}]);