(function (root, doc, echarts){

	var __defaults = {
		containerId : 'main',
		requests : {
			urls : 
			},
			types : {},
			dataTypes : {}
		}
	};

	var DEBUG = true;

	function APP(){
		return new APP.prototype.init(arguments);
	}


	APP.prototype = {
		constructor ： APP,
		chartEl : null,
		init : function(options){
			this.options = $.extends({}, __defaults, options || {});
			this.chartEl = this.initChart();

			return this;
		},
		initChart: function (){
			var opt = this.options;
			var dom = document.getElementById(opt.containerId);
			var chart = echarts.init(dom);
			this.chartEl = chart;
		},
		getFile : getFileFn,
		getChartOption : function (){

		},
		render : function(json){

		},
		log : function (k, v) {

			if (DEBUG && window.console && window.console.log) {
				if (arguments.length === 2) {
					console.log(k, v);
				} else {
					console.log(k);
				}
			}
		}
	}


	function getFileFn (fileName, callback) {
		var that = this;
		if (that.cache[fileName]) {
			return that.cache[fileName];
		} else {
			var opt = that.options.requests;
			$.ajax({
				url : opt.urls[fileName],
				type : opt.requestTypes[fileName],
				dataType : opt.dataTypes[fileName],
				cache : false,
				success : function(data){
					!!callback && callback(data);
				},
				error: function () {
					that.log(arguments)
				}
			});
		}

	}


	window.APP = new APP();

})(window, document, echarts)