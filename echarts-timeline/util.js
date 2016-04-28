(function (root){
	if (!root.__cache__) root.__cache__ = {};

	root.DEBUG = true;
	var Util = {
		getCache : function (key) {
			return window.__cache__[key];
		},
		setCache : function (key, obj, force) {
			window.__cache__[key] = obj;
		},
		log : function (k,v) {
			if (root.DEBUG) {
				if (root.console && root.console.log) {
					if (!!v) {
						if (arguments.length === 2) {
							root.console.log(k, v);
						} else {
							root.console.log(arguments);
						}
					} else {
						root.console.log(k);
					}
				}
			}
		},
		clone : function (obj) {
			if (typeof obj !== 'object' || obj === null || obj === undefined) {
				return obj;
			}

			var ret = new obj.constructor();
			for (var key in obj) {
				if (obj.hasOwnProperty(key)){
					ret[key] = Util.clone(obj[key]);
				}
			}
			return ret;
		}
	};

	window.util = Util;
})(window);