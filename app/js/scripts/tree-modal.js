var TreeModal = function() {

	var handleSample = function() {
		$('#tree_2').jstree({
			// 'plugins': ["wholerow", "checkbox", "types"],
			'core': {
				"themes": {
					"responsive": false
				},
				'data': {
					"url" : "tpl/tree.json",
        			"dataType" : "json" // needed only if you do not supply JSON headers
				}
			},
			"types": {
				"default": {
					"icon": "fa fa-folder icon-state-warning icon-lg"
				},
				"file": {
					"icon": "fa fa-file icon-state-warning icon-lg"
				}
			}
		});
		
		$('#tree_2').on("changed.jstree", function(e, data) {
			console.log("The selected nodes are:");
			console.log(data.selected);
		})
	}

	return {
		//main function to initiate the module
		init: function() {
			handleSample();
		}

	};

}();