(function(){
}());

var LayoutTemplate = function() {
	
	/* ********************************* default ******************************** */
	/*
	┌────target(div)─────────────────────────────────────────────────────────────────
	│ ┌────real area(div)──  ┌────view area(div)──  ┌────customize area(div)──────────
	│ │ customizeButton      │ viewButton           │ ┌─layout(div)─  ┌─content(div)───
	│ │                      │                      │ │               │ insertButton
	│ │                      │                      │ │               │ 
	 */
	
	// real area dom
	var $customizeButton = $('<button>').attr({type: 'button', id: 'customizeButton'})
	                                    .html('CUSTOMIZE MODE');
	
	var $realArea = $('<div>').attr({id : 'realArea'})
	                          .css({float: 'left', width: '100%', height: '100%'})
	                          .append($customizeButton);
	
	// view area dom
	var $viewButton = $('<button>').attr({type: 'button', id: 'viewButton'})
	                               .html('VIEW MODE');
	
	var $viewArea = $('<div>').attr({id : 'viewArea'})
	                          .css({float: 'left', width: '60%', height: '100%', display : 'none'})
	                          .append($viewButton);
	
	// customize area dom
	var $layoutArea = $('<div>').attr({id : 'layoutArea'})
	                            .css({float : 'left', border : 'solid 1px black', width: '49%', height : '100%', display: 'none'})
	                            .append($('<div>').html('레이아웃'));
	
	var $insertButton = $('<button>').attr({type: 'button', id: 'insertbutton'})
	                                 .html(' << ');
	
	var $dataArea = $('<div>').attr({id : 'dataArea'})
	                          .css({float : 'left', border : 'solid 1px black', width: '49%', height : '100%', display: 'none'})
	                          .append($('<div>').html('컨텐츠'))
	                          .append($insertButton);
	
	var $customizeArea = $('<div>').css({float: 'left', width: '40%', height: '100%', disalay: 'none'})
	                               .append($layoutArea)
	                               .append($dataArea);
	
	// customize area event bind
	$customizeArea.find('#insertbutton').on('click', function(){
		var $targetLayout = $viewArea.find('div[class*=on]');
		var $targetContent = $dataArea.find('li[class*=on]');
		
		if ($targetLayout.length > 0 && $targetContent.length > 0) {
			var $div = $('<div>').html($targetContent.data('data').title)
			                     .append($('<button>').attr({type : 'button'}).html('X').on('click', function() {addContentData($(this).parent().data('data')); $(this).parent().remove();}))
			                     .data('data', $targetContent.data('data'));
			$targetLayout.append($div);
			
			$targetContent.remove();
		}
	});
	
	// real area event bind
	$realArea.find('#customizeButton').on('click', function() {
		// 뷰, 사용자정의 영역 컨트롤
		$customizeArea.show();
		$layoutArea.show();
		$dataArea.show();
		$viewArea.show();
		$realArea.hide();
	});
	
	// view area event bind
	$viewArea.find('#viewButton').on('click', function(){
		// 리얼영역 리셋
		$realArea.find('div').remove();
		
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
	
	// 레이아웃 데이터를 그린다.
	var drawLayoutData = function() {
		if (layoutArray.length < 1) {
			return false;
		} 
		
		var $layoutUl = $('<ul>');
		for (var i = 0; i < layoutArray.length; i++) {
			$layoutUl.append($('<li>').html(layoutArray[i].domId)
			                          .attr({id: layoutArray[i].domId})
			                          .data('data', layoutArray[i]) // json 데이터(데이터를 보려면 string으로 변환해서 속성으로 추가하면 됨)
			                );
		}
		$layoutArea.append($layoutUl);
		
		$layoutUl.find('li').on('click', function() {
			if ($(this).hasClass('on')) {
				$(this).removeClass('on').css({'background-color' : ''});
			} else {
				$layoutUl.find('li').removeClass('on').css({'background-color' : ''});
				
				$(this).addClass('on').css({'background-color' : 'yellow'});
				
				applyLayout($(this).data('data'));
			}
		});
	};
	
	// 레이아웃 dom을 view영역에 적용한다.
	var applyLayout = function(data) {
		// data는 json객체
		resetViewArea();
		resetDataArea();
		
		var $layoutDom = data.dom.clone().show().appendTo($viewArea);
		
		$layoutDom.find('div[id^=section]').sortable();
		
		$layoutDom.find('div[id^=section]').on('click', function() {
			if ($(this).hasClass('on')) {
				$(this).removeClass('on').css({'background-color' : ''});
			} else {
				$layoutDom.find('div[id^=section]').removeClass('on').css({'background-color' : ''});
				
				$(this).addClass('on').css({'background-color' : '#babcfb'})
			}
		});
	};
	
	// 컨텐츠 데이터를 그린다.
	var drawConetentData = function() {
		if (contentArray.length < 1) {
			return false;
		} 
		
		var $contentUl = $('<ul>');
		for (var i = 0; i < contentArray.length; i++) {
			$contentUl.append($('<li>').html(contentArray[i].title)
			                           .attr({id: contentArray[i].title})
			                           .data('data', contentArray[i]) // json 데이터(데이터를 보려면 string으로 변환해서 속성으로 추가하면 됨)
			                 );
		}
		$dataArea.append($contentUl);
		
		$contentUl.on('click', 'li', function() {
			if ($(this).hasClass('on')) {
				$(this).removeClass('on').css({'background-color' : ''});
			} else {
				$contentUl.find('li').removeClass('on').css({'background-color' : ''});
				
				$(this).addClass('on').css({'background-color' : 'yellow'});
			}
		});
	};
	
	// 컨텐츠 데이터를 추가한다.
	var addContentData = function(data) {
		$dataArea.find('ul').append($('<li>').html(data.title).data('data', data));
	};
	
	// view영역을 초기화 한다.
	var resetViewArea = function() {
		$viewArea.find('div[id^=layoutStyle]').remove();
	}
	
	// data영역을 초기화 한다.
	var resetDataArea = function() {
		$dataArea.find('ul').remove();
		drawConetentData();
	}
	
	// 사용자정의 데이터 저장
	var saveCustomizeData = function() {
		var layoutSection = [];
		$viewArea.find('div[id^=section]').each(function(){
			var contentList = [];
			$(this).find('div').each(function(){
				contentList.push($(this).data('data'));
			});
			
			layoutSection.push({sectionId : $(this).attr('id'), contentList : contentList});
		});
		
		layoutTemplateInformation = {
				targetId : targetId,
				layout : {
					styleId : $viewArea.find('div[id^=layoutStyle]').attr('id'),
					section : layoutSection
				}
		};
		
		console.log(JSON.stringify(layoutTemplateInformation));
	};
	
	var drawLayoutTemplate = function() {
		drawLayoutData();
		drawConetentData();
		
		$('#' + targetId).append($realArea)
		                 .append($viewArea)
		                 .append($customizeArea);
	};
	
	var drawDataLayoutTemplate = function() {
		
		var layoutInfo = layoutTemplateInformation.layout;
		
		// (뷰영역 적용)레이아웃 선택
		$layoutArea.find('ul > li[id=' + layoutInfo.styleId + ']').click();
		
		var sectionArray = layoutInfo.section;
		for (var sIndex in sectionArray) {
			var sectionItem = sectionArray[sIndex];
			
			// (뷰영역 적용)레이아웃 > 섹션 선택
			$viewArea.find('div[id=' + sectionItem.sectionId + ']').click();
			
			var contentArray = sectionItem.contentList;
			for (var cIndex in contentArray) {
				var contentItem = contentArray[cIndex];
				
				// (뷰영역 적용)레이아웃 > 섹션 > 컨텐츠 선택
				$dataArea.find('ul > li[id=' + contentItem.title + ']').click();
				// (뷰영역 적용)레이아웃 > 섹션 > 컨텐츠 > 컨텐츠 적용
				$customizeArea.find('#insertbutton').click();
			}
		}
		
		// 사용자정의 함수로 데이터 후처리
		if (afterSaveFunction !== null) {
			afterSaveFunction.call(this, layoutTemplateInformation);
		}
	};
	
	/* ********************************* process ******************************** */
	
	// variable
	var targetId = null;
	var layoutArray = [];
	var contentArray = [];
	var saveFunction = null;
	var afterSaveFunction = null;
	
	var layoutTemplateInformation = {};
	
	this.setTargetId = function(divId) {
		targetId = divId;
	};
	
	this.setLayoutArray = function(data) {
		layoutArray = data;
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