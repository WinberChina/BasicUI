var stateArry = [];
var openTab = function(name, url, $state) {
	var parentUl = $("#tab-nav");

	/*
	 * 存在URL
	 */
	console.log(stateArry.toString());
	if (stateArry.toString().indexOf(url) > -1) {
		$('#' + url).trigger('click');
	} else {
		stateArry.push(url); // 
		/* 增加一个tab页  */
		var tabTemplate = "<li><a id='#{id}' data-toggle='tab'>#{label}</a> <span id='#{closeId}' class='navs-close'></span></li>";
		// var tabTemplate = "<li><a id='#{id}' href='#{href}' data-toggle='tab'>#{label}</a> <span class='navs-close'></span></li>";
		var li = $(tabTemplate.replace(/#\{id\}/g, url).replace(/#\{label\}/g, name).replace(/#\{closeId}/g, url + "-close"));
		parentUl.append(li);
		// console.log($("#tab-nav").html());

		/*激活当前tab */
		parentUl.children("li").each(function() {
			$(this).removeClass("active");
		});
		li.addClass("active");

		/* 为a标签绑定点击事件 */
		$('#' + url).on('click', function() {
			$state.go(url);
		});
		$('#' + url).trigger('click');
		
		/*为关闭按钮绑定事件*/
		$('#' + url + "-close").on('click', function() {
			var index;
			for(var i = 0; i < stateArry.length; i++) {
				if(stateArry[i] == url) {
					index = i;
					stateArry.splice(i, 1);
					break;
				}
			}
			
			$(this).closest("li").remove(); // 刪除tab
			
			var parentState = $state.current.data.parentState;
			if(parentState != undefined && stateArry.toString().indexOf(parentState) > -1) {
				$("#" + parentState).trigger("click");
			} else {
				if(stateArry.length == 0) {
					$state.go("dashboard");
				}
				// 移除tab后展现上一个tab
				if(index > 0) {
					$("#" + stateArry[index - 1]).trigger("click");
				} else {
					$("#" + stateArry[0]).trigger("click");
				}
			}
		});
	}
}