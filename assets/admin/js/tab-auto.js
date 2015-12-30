var urlJsonArry = [],
 	tabCounter = 0;
var openTab = function(tabName, tabUrl, $compile, $scope) {
	var urlJson = {},
		parentUl = $("#tab-nav"),
		parentDiv = $("#tab-contents");
		
	// 判断tab页是否打开
	for(var i = 0; i < urlJsonArry.length; i++) {
		var jsonTemp = urlJsonArry[i];
		if(jsonTemp.url == tabUrl) {
			$('#' + jsonTemp.id).trigger('click');
			return;
		}
	}
	
	/* 增加一个tab页  */
	var tabTemplate = "<li><a id='#{id}' href='#{href}' data-toggle='tab'>#{label}</a> <span id='#{closeId}' class='navs-close'></span></li>";
	var tabId = "tab" + tabCounter,
		contentId = "tab-content" + tabCounter;
		li = $(tabTemplate.replace(/#\{id\}/g, tabId).replace(/#\{href\}/g, "#" + contentId).replace(/#\{label\}/g, tabName).replace(/#\{closeId}/g, tabId + "-close"));
	parentUl.append(li);
	// console.log($("#tab-nav").html());
	
	/*增加tab页关联内容*/
	var contentTemplate = "<div class='tab-content' data-ng-include=\"'views/dashboard.html'\"></div>";
	$compile(contentTemplate)($scope);
	parentDiv.append(contentTemplate);
	
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
	$('#' + tabId).trigger('click');
	
	/*为关闭按钮绑定事件*/
	$('#' + tabId + "-close").on('click', function() {
		$(this).closest("li").remove(); // 刪除tab
		$('#' + contentId).remove(); // 删除内容
		var index;
		for(var i = 0; i < urlJsonArry.length; i++) {
			var jsonTemp = urlJsonArry[i];
			if(jsonTemp.id == tabId) {
				index = i;
				urlJsonArry.splice(i, 1);
				break;
			}
		}
		
		// 移除tab后展现上一个tab
		if(index > 0) {
			$("#" + urlJsonArry[index - 1].id).trigger("click");
		} else {
			if(urlJsonArry.length > 0) 
				$("#" + urlJsonArry[0].id).trigger("click");
		}
	});
	
	/*保存已打开tab页*/
	urlJson.id = tabId;
	urlJson.url = tabUrl;
	urlJsonArry.push(urlJson);
	
	tabCounter++;
	
	console.log(urlJsonArry);
}