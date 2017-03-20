$(function(){
	var contentData = [{
		id: 'naver',
		title: '네이버',
		url: 'https://naver.com',
		callFunction: 'n'
	},
	{
		id: 'daum',
		title: '다음',
		url: 'http://daum.net',
		callFunction: '2'
	},
	{
		id: 'google',
		title: '구글',
		url: 'https://google.com',
		callFunction: 'w'
	},
	{
		id: 'ncsoft',
		title: '엔씨',
		url: 'http://ncsoft.com/',
		callFunction: '#'
	}];
	var customSave = function(data) {
		setCookie('page1', JSON.stringify(data), 1);
	};
	var customAfterSave = function(data) {
		var $realArea = $('#' + data.targetId + ' > #realArea');
		
		var contentArray = data.contents;
		for (var cIndex in contentArray) {
			var contentItem = contentArray[cIndex];
			var $div = $('<div>').attr({id: 'content-' + contentItem.id})
			                     .css({float: 'left', border: '3px solid #e01414', width: contentItem.width + 'px', height: contentItem.height + 'px'})
			                     .append($('<div>').html(contentItem.title))
			                     .append($('<iframe></iframe>').attr({src : contentItem.url}))
			                     .appendTo($realArea);
		}
		
		$realArea.show();
	};
	
	var temp = new LayoutTemplate();
	temp.setTargetId('baseArea');
	temp.setContentArray(contentData);
	temp.setSave(customSave);
	temp.setAfterSave(customAfterSave);
	temp.draw(getCookie('page1'));
});