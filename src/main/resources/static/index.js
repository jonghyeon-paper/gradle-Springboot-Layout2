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
	
	var temp = new LayoutTemplate();
	temp.setTargetId('baseArea');
	temp.setContentArray(contentData);
	temp.draw();
});