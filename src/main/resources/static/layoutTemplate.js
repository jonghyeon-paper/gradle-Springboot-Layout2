(function(){
}());

var LayoutTemplate = function() {
	
	/* ********************************* default ******************************** */
	/*
	┌────target(div)─────────────────────────────────────────────────────────────────
	│ ┌────real area(div)──  ┌────view area(div)──  ┌────customize area(div)──────────
	│ │ customizeButton      │ viewButton           │ ┌─content(div)───
	│ │                      │                      │ │ insertButton
	│ │                      │                      │ │                
	 */
	
	// real area dom
	var $customizeButton = $('<button>').attr({type: 'button', id: 'customizeButton'})
	                                    .html('CUSTOMIZE MODE');
	
	var $realArea = $('<div>').attr({id : 'realArea'})
	                          .css({float: 'left', width: '100%', height: '100%'})
	                          .append($('<div>').append($customizeButton));
	
	// view area dom
	var $viewButton = $('<button>').attr({type: 'button', id: 'viewButton'})
	                               .html('VIEW MODE');
	
	var $viewArea = $('<div>').attr({id : 'viewArea'})
	                          .css({float: 'left', width: '80%', height: '100%', display : 'none'})
	                          .append($('<div>').append($viewButton));
	
	// customize area dom
	var $insertButton = $('<button>').attr({type: 'button', id: 'insertbutton'})
	                                 .html(' << ');
	
	var $dataArea = $('<div>').attr({id : 'dataArea'})
	                          .css({float : 'left', border : 'solid 1px black', width: '100%', height : '100%', display: 'none'})
	                          .append($insertButton);
	
	var $customizeArea = $('<div>').attr({id: 'customizeArea'})
	                               .css({float: 'left', width: '20%', height: '100%', disalay: 'none'})
	                               .append($dataArea);
	
	// customize area event bind
	$customizeArea.find('#insertbutton').on('click', function(){
		var $targetContent = $dataArea.find('li[class*=on]');
		
		if ($targetContent.length > 0) {
			$targetContent.each(function(){
				var $div = $('<div>').attr({id: 'content-' + $(this).data('data').id})
				                     .css({float: 'left', border: '1px solid #dddddd', width: '250px', height: '250px'})
				                     .html($(this).data('data').title)
				                     .append($('<button>').attr({type : 'button'}).html('X').on('click', function() {addContentData($(this).parent().data('data')); $(this).parent().remove();}))
				                     .data('data', $(this).data('data'));
				
				$div.resizable({
					grid: [50, 50]
				});
				
				$viewArea.append($div);
				
				$(this).remove();
			});
			
		}
	});
	
	// real area event bind
	$realArea.find('#customizeButton').on('click', function() {
		// 뷰, 사용자정의 영역 컨트롤
		$customizeArea.show();
		$dataArea.show();
		$viewArea.show();
		$realArea.hide();
	});
	
	// view area event bind
	$viewArea.find('#viewButton').on('click', function(){
		// 리얼영역 리셋
		$realArea.find('> div[id^=content-]').remove();
		
		// 뷰, 사용자정의 영역 컨트롤
		$customizeArea.hide();
		$viewArea.hide();
		$realArea.show();

		// 사용자정의 데이터 저장
		saveCustomizeData();
		
		// 사용자정의 함수로 데이터 저장
		if (saveFunction !== null) {
			saveFunction.call(this, layoutTemplateInformation);
		}
		
		// 사용자정의 함수로 데이터 후처리
		if (afterSaveFunction !== null) {
			afterSaveFunction.call(this, layoutTemplateInformation);
		}
	});
	
	/* ********************************* function ******************************** */
	
	// 컨텐츠 데이터를 그린다.
	var drawConetentData = function() {
		if (contentArray.length < 1) {
			return false;
		} 
		
		var $contentUl = $('<ul>');
		for (var i = 0; i < contentArray.length; i++) {
			$contentUl.append($('<li>').html(contentArray[i].title)
			                           .attr({id: 'content-' + contentArray[i].id})
			                           .data('data', contentArray[i]) // json 데이터(데이터를 보려면 string으로 변환해서 속성으로 추가하면 됨)
			                 );
		}
		$dataArea.append($contentUl);
		
		$contentUl.on('click', 'li', function() {
			if ($(this).hasClass('on')) {
				$(this).removeClass('on').css({'background-color' : ''});
			} else {
				$(this).addClass('on').css({'background-color' : 'yellow'});
			}
		});
	};
	
	// 컨텐츠 데이터를 추가한다.
	var addContentData = function(data) {
		$dataArea.find('ul').append($('<li>').attr({id: 'content-' + data.id})
		                                     .html(data.title)
		                                     .data('data', data)
		                           );
	};
	
	// 사용자정의 데이터 저장
	var saveCustomizeData = function() {
		var contentList = [];
		$viewArea.find('div[id^=content-]').each(function(){
			var temp = $(this).data('data');
			temp.width = $(this).outerWidth();
			temp.height = $(this).outerHeight();
			
			contentList.push($(this).data('data'));
		});
		
		layoutTemplateInformation = {
				targetId : targetId,
				contents : contentList
		};
		
		console.log(JSON.stringify(layoutTemplateInformation));
	};
	
	var drawLayoutTemplate = function() {
		drawConetentData();
		
		$viewArea.sortable();
		
		$('#' + targetId).append($realArea)
		                 .append($viewArea)
		                 .append($customizeArea);
	};
	
	var drawDataLayoutTemplate = function() {
		console.log(JSON.stringify(layoutTemplateInformation));
		var contentArray = layoutTemplateInformation.contents;
		for (var cIndex in contentArray) {
			var contentItem = contentArray[cIndex];
			
			// (뷰영역 적용) 컨텐츠 선택
			$dataArea.find('ul > li[id=content-' + contentItem.id + ']').click();
		}
		// (뷰영역 적용) 컨텐츠 > 컨텐츠 적용
		$customizeArea.find('#insertbutton').click();
		
		// 사용자정의 함수로 데이터 후처리
		if (afterSaveFunction !== null) {
			afterSaveFunction.call(this, layoutTemplateInformation);
		}
	};
	
	/* ********************************* process ******************************** */
	
	// variable
	var targetId = null;
	var contentArray = [];
	var saveFunction = null;
	var afterSaveFunction = function(data) {
		var $realArea = $('#' + data.targetId + ' > #realArea');
		
		var contentArray = data.contents;
		for (var cIndex in contentArray) {
			var contentItem = contentArray[cIndex];
			var $div = $('<div>').attr({id: 'content-' + contentItem.id})
			                     .css({float: 'left', border: '1px solid #dddddd', width: contentItem.width + 'px', height: contentItem.height + 'px'})
			                     .append($('<div>').html(contentItem.title))
			                     .append($('<iframe></iframe>').attr({src : contentItem.url}))
			                     .appendTo($realArea);
		}
		
		$realArea.show();
	};
	
	var layoutTemplateInformation = {};
	
	this.setTargetId = function(divId) {
		targetId = divId;
	};
	
	this.setContentArray = function(data) {
		contentArray = data;
	};
	
	this.setSave = function(func) {
		if (typeof func === 'function') {
			saveFunction = func;
		}
	};
	
	this.setAfterSave = function(func) {
		if (typeof func === 'function') {
			afterSaveFunction = func;
		}
	};
	
	this.getLayoutTemplateData = function() {
		return layoutTemplateInformation;
	};
	
	this.draw = function(data) {
		drawLayoutTemplate();
		
		if (data !== null && data !== undefined && data !== '') {
			layoutTemplateInformation = JSON.parse(data);
			drawDataLayoutTemplate();
		}
	};
	
	return this;
};

/////////////////////////////////////////////////////////////////////////////

function getAllCookies() {
	var result = '';
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		result += cookies[i] + '<br>';
	}
	return result;
}

function getCookie(name) {
	var result = '';
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		if (cookies[i].indexOf(name) > -1) {
			return cookies[i].replace(name + '=', '');
		}
	}
	return result;
}

var setCookie = function(name, value, expiredays) {
	var todayDate = new Date();
	if (expiredays == null) {
		expiredays = 30;
	}
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie = name + '=' + value + '; path=/; expires=' + todayDate.toGMTString() + ';';
}