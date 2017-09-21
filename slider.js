;(function($, window, document, undefined){
	var pluginName = "SliderImg";
	var defaults = {
		Type: 'default',    // fade淡入淡出|default左右滚动
		ShowPrevNext: true, // 是否显示下一个上一个
		ShowBtn: true,  	// 是否显示切换圆按钮
		BtnAlign: 'center', // 切换按钮位置 left|center|right
		AutoPlay: true, 	// 是否自动滚动
		TimeOut: 5    		// 自动滚动间隔时间
	}
	// 构造函数
	function SliderPlugin(element, options){
		this.element   = $(element);						// 元素本身
		this.options   = $.extend({}, defaults, options);   // 配置参数
		this._defaults = defaults;							// 备份默认配置
		this._name     = pluginName;						// 插件名称
		this.nowIndex  = 0;									// 当前显示的图片序号
		this.imgList   = this.element.find('ul > li');		// 图片列表
		this.imgWidth  = this.imgList.eq(0).outerWidth();	// 图片宽度
		this.imgNum    = this.imgList.length;				// 图片数量
		this.btnsBox   = null;								// 圆切换按钮盒子
		this.btnsWidth = 0;									// 圆切换按钮盒子宽度
		this.prevNexts = null;								// 前一个后一个按钮
		this.Interval  = null;								// 定时监听器变量
		this.init();
	}
	
	SliderPlugin.prototype = {
		init: function () {
			if (this.options.Type == 'fade') {
				$(this.element).addClass('slider-fade');
			} else {
				$(this.element).addClass('slider-default');
			}
			
			if (this.options.ShowBtn) {
				this.ShowBtn();
				this.BtnAlign();
			}
			if (this.options.ShowPrevNext) {
				this.ShowPrevNext();
			}
			if (this.options.AutoPlay) {
				this.AutoPlay();
			}
			this.ToggleImg(3);
			this.StartListen();
		},

		StartListen: function () {
			var e = this;
			if (e.options.ShowBtn) {
				e.btnsBox.find('li').on('click', function(event) { // 为圆按钮添加监听
					e.ToggleImg($.inArray(this, e.btnsBox.find('li')));
				});
			}

			if (e.options.ShowPrevNext) {
				e.prevNexts.on('click', function(event) { // 前一个后一个按钮监听
					if(/next-/.test($(this).attr('class'))) {
						e.ToggleImg(e.nowIndex + 1);
					} else {
						e.ToggleImg(e.nowIndex - 1);
					}
				});
			}

			e.element.mouseover(function(event) {
				e.StopPlay();
			}).mouseleave(function(event) {
				e.AutoPlay();
			});

			$(window).resize(function(event) {
				e.BtnAlign();
			});
		},

		ToggleImg: function (index) {
			if (index >= this.imgNum) { // 防止越界
				index = 0;
			} else if (index < 0) {
				index += this.imgNum;
			}
			this.imgList.eq(index).addClass('active').siblings('li').removeClass('active');
			if (this.btnsBox != null) {
				this.btnsBox.find('li').eq(index).addClass('active').siblings('li').removeClass('active');
			}
			this.nowIndex = index;
		},

		ShowBtn: function () {
			var e = this;
			var bottomBtn = '<ol>';
			$.each(this.imgList, function(index, val) {
				bottomBtn += '<li><a href="javascript:void(0)"></a></li>';
				e.btnsWidth += 15; // 15根据样式表中规定 固定
			});
			bottomBtn += '</ol>';
			this.element.append(bottomBtn);
			this.btnsBox = this.element.find('ol');
		},

		BtnAlign: function () {
			if (this.btnsBox == null) return false;
			var Px = 0;
			this.imgWidth = this.imgList.eq(0).outerWidth();
			switch(this.options.BtnAlign) {
				case 'left':
					Px = 15;
					break;
				case 'center':
					Px = (this.imgWidth - this.btnsWidth) / 2;
					break;
				case 'right':
					Px = this.imgWidth - this.btnsWidth - 15;
					break;
			}
			this.btnsBox.css('left', Px + 'px');
		},

		ShowPrevNext: function () {
			var pNext = '<div class="prev-page">&lt;</span></div>' + 
						'<div class="next-page">&gt;</span></div>';
			this.element.append(pNext);
			this.prevNexts = this.element.find('div[class$="-page"]');
		},

		AutoPlay: function () {
			var e = this;
			this.Interval = window.setInterval(function () {
				e.ToggleImg(e.nowIndex + 1);
			}, e.options.TimeOut*1000);
		},

		StopPlay: function () {
			clearInterval(this.Interval);
		}
	}

	$.fn[pluginName] = function (options) {
		var e = this;
		e.each(function() {
			var IdName = $(this).attr('id');
			e.data(IdName + "_" + pluginName, new SliderPlugin(this, options));
		});
		return e;
	}
})(jQuery, window, document);
