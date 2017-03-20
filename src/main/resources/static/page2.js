$(function(){
	var layoutData = [{
		domId: 'layoutStyle1',
		dom: $('#layoutStyle1').clone()
	},
	{
		domId: 'layoutStyle2',
		dom: $('#layoutStyle2').clone()
	},
	{
		domId: 'layoutStyle3',
		dom: $('#layoutStyle3').clone()
	}];
	var contentData = [{
		title: 'daum',
		url: 'http://daum.net',
		callFunction: '2'
	},
	{
		title: 'ncsoft',
		url: 'http://ncsoft.com/',
		callFunction: '#'
	}];
	var customSave = function(data) {
		setCookie('page2', JSON.stringify(data), 1);
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
				                     .append($('<iframe></iframe>').attr({src : contentItem.url}))
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
	temp.draw(getCookie('page2'));
});