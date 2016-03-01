;(function ($) {
	var __defaults = {
		prevBtn : '.prev',
		nextBtn : '.next',
		elements : '.item',
		list : '.item-list',
		switchSpeed : 400
	};


	var sliderList = [];

	$.fn.slider = function (option) {
		this.option = $.extend({}, __defaults, option || {});


		var $container = $(this);
		var prevBtnClass = this.option.prevBtn;
		var nextBtnClass = this.option.nextBtn;
		var elemClass = this.option.elements;
		var listClass = this.option.list;
		var shiftWidth = $container.outerWidth();
		var speed = this.option.switchSpeed;


		return this.each(function () {
			var that = this;

			var Slider = {
				init : function () {
					that.prevBtn = $container.find(prevBtnClass);
					that.nextBtn = $container.find(nextBtnClass);
					that.elements = $container.find(elemClass);
					that.$list = $container.find(listClass);
					that.currentIndex = 0;

					this.reCalculate();
					this.bindEvent();
				},

				reCalculate : function () {
					that.elements.each(function () {
						var oW = $(this).width();
						var oH = $(this).height();
						$(this).css({
							width : oW
						});
					});
					that.$list.css({
						position : 'absolute',
						left : 0,
						top : 0,
						width : that.elements.length * 100 + '%'
					});
				},
				bindEvent : function () {
					that.nextBtn.on('click', function () {
						if (that.currentIndex >= that.elements.length - 1) return;
						Slider.animateSlider(++that.currentIndex);
					});

					that.prevBtn.on('click', function () {
						if (that.currentIndex <= 0) return;
						
						Slider.animateSlider(--that.currentIndex);
					});
				},
				animateSlider : function (index) {
					that.$list.animate({
						left : (-index*shiftWidth) + 'px'
					}, speed, 'swing');
				}
			};


			Slider.init();

			sliderList.push(Slider);

		});
	}

})(jQuery);