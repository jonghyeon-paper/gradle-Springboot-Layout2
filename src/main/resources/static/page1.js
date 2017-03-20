$(function(){
	var layoutData = [{
		domId: 'layoutStyle1',
		dom: $('#layoutStyle1').clone()
	}, {
		domId: 'layoutStyle2',
		dom: $('#layoutStyle2').clone()
	}];
	var contentData = [{
		title: 'naver',
		url: 'https://naver.com',
		callFunction: 'n'
	},
	{
		title: 'daum',
		url: 'http://daum.net',
		callFunction: '2'
	},
	{
		title: 'google',
		url: 'https://google.com',
		callFunction: 'w'
	},
	{
		title: 'ncsoft',
		url: 'http://ncsoft.com/',
		callFunction: '#'
	}];
	var customSave = function(data) {
		setCookie('page1', JSON.stringify(data), 1);
	};
	var customAfterSave = function(data) {
		var layoutInfo = data.layout;
		
		var $layoutDom = null;
		for (var index in layoutData) {
			var item = layoutData[index];
			if (item.domId === layoutInfo.styleId) {
				$layoutDom = item.dom.clone();
				break;
			}
		}
		
		if ($layoutDom === null) {
			return;
		}
		
		var sectionArray = layoutInfo.section;
		for (var sIndex in sectionArray) {
			var sectionItem = sectionArray[sIndex];
			
			var $section = $layoutDom.find('#' + sectionItem.sectionId)
			
			var contentArray = sectionItem.contentList;
			for (var cIndex in contentArray) {
				var contentItem = contentArray[cIndex];
				var $div = $('<div>').append($('<div>').html(contentItem.title))
				                     .append($('<iframe></iframe>').attr({src : contentItem.url, width: '400', height: '300'}))
				                     .appendTo($section);
			}
		}
		
		$layoutDom.appendTo($('#' + data.targetId + ' > #realArea')).show();
	};
	
	var temp = new LayoutTemplate();
	temp.setTargetId('baseArea');
	temp.setLayoutArray(layoutData);
	temp.setContentArray(contentData);
	temp.setSave(customSave);
	temp.setAfterSave(customAfterSave);
	temp.draw(getCookie('page1'));
});