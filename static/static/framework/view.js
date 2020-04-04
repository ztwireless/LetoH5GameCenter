/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "script/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function invoke() {
	ServiceJSBridge.invoke.apply(ServiceJSBridge, arguments);
}

function on() {
	ServiceJSBridge.on.apply(ServiceJSBridge, arguments);
}

function publish() {
	var args = Array.prototype.slice.call(arguments);
	args[1] = {
		data: args[1],
		options: {
			timestamp: Date.now()
		}
	};
	ServiceJSBridge.publish.apply(ServiceJSBridge, args);
}

function subscribe() {
	var args = Array.prototype.slice.call(arguments),
	    callback = args[1];
	args[1] = function (params, viewId) {
		var data = params.data,
		    options = params.options,
		    timeMark = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
		    timestamp = options && options.timestamp || 0,
		    curTime = Date.now();
		"function" == typeof callback && callback(data, viewId);
		Reporter.speedReport({
			key: "webview2AppService",
			data: data || {},
			timeMark: {
				startTime: timestamp,
				endTime: curTime,
				nativeTime: timeMark.nativeTime || 0
			}
		});
	};
	ServiceJSBridge.subscribe.apply(ServiceJSBridge, args);
}

function simulateSubscribeHandler(event, data) {
	ServiceJSBridge.subscribeHandler.apply(ServiceJSBridge, event, data, 0);
}

function invokeMethod(apiName) {
	// params
	var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
	    innerFns = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
	    params = {};

	// for every parameter, preprocess it
	// if parameter is a function, surround it with try-catch to ensure safety and remove it from parameters
	// if parameter is a string, replace USER_DATA_PATH prefix with wdfile
	for (var i in options) {
		switch (_typeof(options[i])) {
			case 'function':
				params[i] = Reporter.surroundThirdByTryCatch(options[i], "at api " + apiName + " " + i + " callback function");
				delete options[i];
				break;
			case 'string':
				if (window.__wxConfig__ && window.__wxConfig__.env) {
					var udp = window.__wxConfig__.env.USER_DATA_PATH;
					if (udp && options[i].startsWith(udp)) {
						options[i] = '' + _const2.default.LETO_FILE_SCHEMA + options[i].substring(udp.length, options[i].length);
					}
				}
				break;
		}
	}

	// for event function, wrap it with try-catch
	var sysEventFns = {};
	for (var s in innerFns) {
		"function" == typeof innerFns[s] && (sysEventFns[s] = _utils2.default.surroundByTryCatchFactory(innerFns[s], "at api " + apiName + " " + s + " callback function"));
	}

	// callback
	var callback = function callback(res) {
		// check result code
		res.errCode = res.errCode || _const2.default.RESULT_OK;
		var isOk = res.errCode == _const2.default.RESULT_OK,
		    isCancel = res.errCode == _const2.default.RESULT_CANCEL,
		    isFail = res.errCode == _const2.default.RESULT_FAIL;

		/*
   XXX: some game checks errMsg to determine api result, what the fuck?? I think
   it is wrong, very wrong. But I have to make those garbage code happy. So, set
   errMsg with a :ok suffix if result is ok.
   Meanwhile, some api name is changed when invoking so we check a special parameter
   for real api name
   */
		var realApiName = options.__apiName || apiName;
		if (isOk) {
			res.errMsg = realApiName + ':ok';
		} else if (isCancel) {
			res.errMsg = res.errMsg || realApiName + ':cancel';
		} else if (isFail) {
			res.errMsg = res.errMsg || realApiName + ':fail';
		}

		// callback
		if ("function" == typeof sysEventFns.beforeAll && sysEventFns.beforeAll(res), isOk) {
			"function" == typeof sysEventFns.beforeSuccess && sysEventFns.beforeSuccess(res), "function" == typeof params.success && params.success(res), "function" == typeof sysEventFns.afterSuccess && sysEventFns.afterSuccess(res);
		} else if (isCancel) {
			"function" == typeof params.fail && params.fail(res), "function" == typeof sysEventFns.beforeCancel && sysEventFns.beforeCancel(res), "function" == typeof params.cancel && params.cancel(res), "function" == typeof sysEventFns.afterCancel && sysEventFns.afterCancel(res);
		} else if (isFail) {
			"function" == typeof sysEventFns.beforeFail && sysEventFns.beforeFail(res), "function" == typeof params.fail && params.fail(res);
			var rt = !0;
			"function" == typeof sysEventFns.afterFail && (rt = sysEventFns.afterFail(res)), rt !== !1 && Reporter.reportIDKey({
				key: apiName + "_fail"
			});
		}
		"function" == typeof params.complete && params.complete(res), "function" == typeof sysEventFns.afterAll && sysEventFns.afterAll(res);
	};

	// now invoke or fake invoke
	if (options.__fake_result && _typeof(options.__fake_result) == 'object') {
		callback(options.__fake_result);
	} else {
		invoke(apiName, options, callback);
	}
	Reporter.reportIDKey({
		key: apiName
	});
}

/**
 * call sync api. In Leto iOS, invokeHandler is an async mechanism because evaluateJavascript
 * is asynchronous. In Leto Android, invokeHandler is sync but it should be return a json string
 * result
 */
function callSyncApi(name, params) {
	params = params || {};
	var platform = _utils2.default.getPlatform();
	var sdkMode = _utils2.default.getSDKMode();
	if (sdkMode == _const2.default.SDK_MODE_JS || platform == _const2.default.PLATFORM_ANDROID) {
		// for android, we set a sync flag in params so that native will
		// return json string result directly
		var rt = null;
		params.sync = true;
		invokeMethod(name, params, {
			beforeAll: function beforeAll(res) {
				rt = res || {};
				if (rt.platform == null) {
					rt.platform = platform;
				}
			},
			beforeSuccess: function beforeSuccess(res) {
				if (res) {
					delete res.errMsg;
				}
			}
		});
		return rt;
	} else if (platform == _const2.default.PLATFORM_IOS) {
		// for ios, use prompt so that native can intercept and return result synchronously
		var resultJson = null;
		try {
			var resultJsonStr = prompt(JSON.stringify({
				C: name,
				paramsString: JSON.stringify(params)
			}));
			resultJson = JSON.parse(resultJsonStr);
		} catch (error) {
			resultJson = {};
		}
		if (resultJson.platform != null) {
			resultJson.platform = platform;
		}
		return resultJson;
	} else {
		// TODO handle other situation
	}
}

function noop() {}

function onMethod(apiName, callback) {
	//onMethod
	on(apiName, _utils2.default.surroundByTryCatchFactory(callback, "at api " + apiName + " callback function"));
}

function beforeInvoke(apiName, params, paramTpl) {
	var res = _utils2.default.paramCheck(params, paramTpl);
	return !res || (beforeInvokeFail(apiName, params, "parameter error: " + res), !1);
}

function beforeInvokeFail(apiName) {
	var params = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
	    errMsg = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
	var fail = Reporter.surroundThirdByTryCatch(params.fail || noop, "at api " + apiName + " fail callback function"),
	    complete = Reporter.surroundThirdByTryCatch(params.complete || noop, "at api " + apiName + " complete callback function");
	fail({
		errCode: _const2.default.RESULT_FAIL,
		errMsg: errMsg
	});
	complete({
		errCode: _const2.default.RESULT_OK,
		errMsg: errMsg
	});
}

function checkUrlInConfig(apiName, url, params) {
	var path = url.replace(/\.html\?.*|\.html$/, "");
	return -1 !== __wxConfig.pages.indexOf(path) || (beforeInvokeFail(apiName, params, 'url "' + _utils2.default.removeHtmlSuffixFromUrl(url) + '" is not in app.json'), !1);
}

exports.default = {
	invoke: invoke,
	on: on,
	publish: publish,
	subscribe: subscribe,
	simulateSubscribeHandler: simulateSubscribeHandler,
	invokeMethod: invokeMethod,
	onMethod: onMethod,
	noop: noop,
	beforeInvoke: beforeInvoke,
	beforeInvokeFail: beforeInvokeFail,
	checkUrlInConfig: checkUrlInConfig,
	callSyncApi: callSyncApi
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var LetoConst = {};

Object.defineProperties(LetoConst, {
	// platforms
	PLATFORM_IOS: { value: 'ios', writable: false },
	PLATFORM_ANDROID: { value: 'android', writable: false },
	PLATFORM_DEVTOOLS: { value: 'devtools', writable: false },

	// browser types
	BROWSER_TYPE_WECHAT: { value: "wechat", writable: false },
	BROWSER_TYPE_ANDROID: { value: "androidbrowser", writable: false },
	BROWSER_TYPE_IE: { value: "ie", writable: false },
	BROWSER_TYPE_QQ_APP: { value: "qq", writable: false }, // QQ App
	BROWSER_TYPE_QQ: { value: "qqbrowser", writable: false },
	BROWSER_TYPE_MOBILE_QQ: { value: "mqqbrowser", writable: false },
	BROWSER_TYPE_UC: { value: "ucbrowser", writable: false },
	BROWSER_TYPE_360: { value: "360browser", writable: false },
	BROWSER_TYPE_BAIDU_APP: { value: "baiduboxapp", writable: false },
	BROWSER_TYPE_BAIDU: { value: "baidubrowser", writable: false },
	BROWSER_TYPE_MAXTHON: { value: "maxthon", writable: false },
	BROWSER_TYPE_OPERA: { value: "opera", writable: false },
	BROWSER_TYPE_OUPENG: { value: "oupeng", writable: false },
	BROWSER_TYPE_MIUI: { value: "miuibrowser", writable: false },
	BROWSER_TYPE_FIREFOX: { value: "firefox", writable: false },
	BROWSER_TYPE_SAFARI: { value: "safari", writable: false },
	BROWSER_TYPE_CHROME: { value: "chrome", writable: false },
	BROWSER_TYPE_LIEBAO: { value: "liebao", writable: false },
	BROWSER_TYPE_QZONE: { value: "qzone", writable: false },
	BROWSER_TYPE_SOUGOU: { value: "sogou", writable: false },
	BROWSER_TYPE_UNKNOWN: { value: "unknown", writable: false },

	// api result
	RESULT_OK: { value: 0, writable: false },
	RESULT_FAIL: { value: 1, writable: false },
	RESULT_CANCEL: { value: 2, writable: false },

	// framework running mode
	SDK_MODE_FULL: { value: 0, writable: false }, // 全leto sdk
	SDK_MODE_AD: { value: 1, writable: false }, // 只有leto ad sdk
	SDK_MODE_JS: { value: 2, writable: false }, // 无native sdk, 纯js模式

	// storage key
	LETO_CHANNEL_ID: { value: '__leto_channel_id__', writable: false },
	LETO_MGC_MOBILE: { value: '__leto_mgc_mobile__', writable: false },

	// dir
	LETO_STORE_DIR: { value: '/__store__', writable: false },
	LETO_TMP_DIR: { value: '/__tmp__', writable: false },
	LETO_SAVE_DIR: { value: '/__savedFiles__', writable: false },

	// schema
	LETO_FILE_SCHEMA: { value: 'wdfile://', writable: false },
	LETO_TMP_SCHEMA: { value: 'wdtmp://', writable: false }
});

exports.default = LetoConst;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var blobToArrayBuffer = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(blobStr) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						return _context.abrupt('return', new Promise(function (resolve, reject) {
							var fileReader = new FileReader();
							fileReader.onload = function () {
								resolve(this.result);
							};
							fileReader.readAsArrayBuffer(blobStr);
						}));

					case 1:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function blobToArrayBuffer(_x) {
		return _ref.apply(this, arguments);
	};
}();

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function surroundByTryCatchFactory(func, funcName) {
	//返回函数e
	return function () {
		try {
			return func.apply(func, arguments);
		} catch (e) {
			if ("[object Error]" === Object.prototype.toString.apply(e)) {
				if ("AppServiceSdkKnownError" == e.type) throw e;
				Reporter.errorReport({
					key: "appServiceSDKScriptError",
					error: e,
					extend: funcName
				});
			}
		}
	};
}

function throttle(fn, threshhold, scope) {
	threshhold || (threshhold = 250);
	var last = void 0,
	    deferTimer = void 0;
	return function () {
		var context = scope || this;

		var now = Date.now(),
		    args = arguments;
		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function () {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			clearTimeout(deferTimer);
			last = now;
			fn.apply(context, args);
		}
	};
}

function anyTypeToString(data) {
	//把e转成string并返回一个对象
	var dataType = Object.prototype.toString.call(data).split(" ")[1].split("]")[0];
	if ("Array" == dataType || "Object" == dataType) {
		try {
			data = JSON.stringify(data);
		} catch (e) {
			e.type = "AppServiceSdkKnownError";
			throw e;
		}
	} else {
		data = "String" == dataType || "Number" == dataType || "Boolean" == dataType ? data.toString() : "Date" == dataType ? data.getTime().toString() : "Undefined" == dataType ? "undefined" : "Null" == dataType ? "null" : "";
	}
	return {
		data: data,
		dataType: dataType
	};
}

function stringToAnyType(data, type) {
	//把e解码回来，和前面a相对应

	return data = "String" == type ? data : "Array" == type || "Object" == type ? JSON.parse(data) : "Number" == type ? parseFloat(data) : "Boolean" == type ? "true" == data : "Date" == type ? new Date(parseInt(data)) : "Undefined" == type ? void 0 : "Null" == type ? null : "";
}

function getDataType(data) {
	//get data type
	return Object.prototype.toString.call(data).split(" ")[1].split("]")[0];
}

function isObject(e) {
	return "Object" === getDataType(e);
}

function paramCheck(params, paramTpl) {
	//比较e\t
	var result,
	    name = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "parameter",
	    tplTpye = getDataType(paramTpl),
	    pType = getDataType(params);
	if (pType != tplTpye) return name + " should be " + tplTpye + " instead of " + pType + ";";
	switch (result = "", tplTpye) {
		case "Object":
			for (var i in paramTpl) {
				result += paramCheck(params[i], paramTpl[i], name + "." + i);
			}break;
		case "Array":
			if (params.length < paramTpl.length) return name + " should have at least " + paramTpl.length + " item;";
			for (var a = 0; a < paramTpl.length; ++a) {
				result += paramCheck(params[a], paramTpl[a], name + "[" + a + "]");
			}}
	return result;
}

function getRealRoute(pathname, url) {
	var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
	if (n && (url = addHTMLSuffix(url)), 0 === url.indexOf("/")) return url.substr(1);
	if (0 === url.indexOf("./")) return getRealRoute(pathname, url.substr(2), !1);
	var index,
	    urlArrLength,
	    urlArr = url.split("/");
	for (index = 0, urlArrLength = urlArr.length; index < urlArrLength && ".." === urlArr[index]; index++) {}
	urlArr.splice(0, index);
	var newUrl = urlArr.join("/"),
	    pathArr = pathname.length > 0 ? pathname.split("/") : [];
	pathArr.splice(pathArr.length - index - 1, index + 1);
	var newPathArr = pathArr.concat(urlArr);
	return newPathArr.join("/");
}

/**
 * get platform name, can be Android/iOS/devtools
 */
function getPlatform() {
	var navigator = window.NativeGlobal ? window.NativeGlobal.navigator : global.navigator;
	var userAgent = navigator.userAgent;
	if (userAgent.indexOf('Android') > -1) {
		return _const2.default.PLATFORM_ANDROID;
	} else if (/Mac OS X/.test(userAgent)) {
		return _const2.default.PLATFORM_IOS;
	} else {
		return _const2.default.PLATFORM_DEVTOOLS;
	}
}

function getSDKMode() {
	var navigator = window.NativeGlobal ? window.NativeGlobal.navigator : global.navigator;
	var ua = navigator.userAgent;
	if (/\/LetoAd\//.test(ua)) {
		return _const2.default.SDK_MODE_AD;
	} else if (/\/LetoFull\//.test(ua)) {
		return _const2.default.SDK_MODE_FULL;
	} else {
		return _const2.default.SDK_MODE_JS;
	}
}

function urlEncodeFormData(data) {
	//把对象生成queryString
	var needEncode = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
	if ("object" !== (typeof data === 'undefined' ? 'undefined' : _typeof(data))) return data;
	var tmpArr = [];
	for (var o in data) {
		if (data.hasOwnProperty(o)) {
			if (needEncode) {
				try {
					tmpArr.push(encodeURIComponent(o) + "=" + encodeURIComponent(data[o]));
				} catch (t) {
					tmpArr.push(o + "=" + data[o]);
				}
			} else {
				tmpArr.push(o + "=" + data[o]);
			}
		}
	}return tmpArr.join("&");
}

function addQueryStringToUrl(originalUrl, newParams) {
	//生成url t:param obj
	if (newParams && "string" == typeof originalUrl && "object" === (typeof newParams === 'undefined' ? 'undefined' : _typeof(newParams)) && Object.keys(newParams).length > 0) {
		var urlComponents = originalUrl.split("?"),
		    host = urlComponents[0],
		    oldParams = (urlComponents[1] || "").split("&").reduce(function (res, cur) {
			if ("string" == typeof cur && cur.length > 0) {
				var curArr = cur.split("="),
				    key = curArr[0],
				    value = curArr[1];
				res[key] = value;
			}
			return res;
		}, {}),
		    refinedNewParams = Object.keys(newParams).reduce(function (res, cur) {
			"object" === _typeof(newParams[cur]) ? res[encodeURIComponent(cur)] = encodeURIComponent(JSON.stringify(newParams[cur])) : res[encodeURIComponent(cur)] = encodeURIComponent(newParams[cur]);
			return res;
		}, {});
		return host + "?" + urlEncodeFormData(assign(oldParams, refinedNewParams));
	}
	return originalUrl;
}

function validateUrl(url) {
	return (/^(http|https):\/\/.*/i.test(url)
	);
}

function assign() {
	//endext 对象合并
	for (var argLeng = arguments.length, args = Array(argLeng), n = 0; n < argLeng; n++) {
		args[n] = arguments[n];
	}
	return args.reduce(function (res, cur) {
		for (var n in cur) {
			res[n] = cur[n];
		}
		return res;
	}, {});
}

function encodeUrlQuery(url) {
	//把url中的参数encode
	if ("string" == typeof url) {
		var urlArr = url.split("?"),
		    urlPath = urlArr[0],
		    queryParams = (urlArr[1] || "").split("&").reduce(function (res, cur) {
			if ("string" == typeof cur && cur.length > 0) {
				var curArr = cur.split("="),
				    key = curArr[0],
				    value = curArr[1];
				res[key] = value;
			}
			return res;
		}, {}),
		    urlQueryArr = [];
		for (var i in queryParams) {
			queryParams.hasOwnProperty(i) && urlQueryArr.push(i + "=" + encodeURIComponent(queryParams[i]));
		}
		return urlQueryArr.length > 0 ? urlPath + "?" + urlQueryArr.join("&") : url;
	}
	return url;
}

function addHTMLSuffix(url) {
	//给url加上。html的扩展名
	if ("string" != typeof url) throw new A("redirectTo: invalid url:" + url);
	var urlArr = url.split("?");
	urlArr[0] += ".html";
	return "undefined" != typeof urlArr[1] ? urlArr[0] + "?" + urlArr[1] : urlArr[0];
}

function extend(target, obj) {
	//t合并到e对象
	for (var n in obj) {
		target[n] = obj[n];
	}return target;
}

function buf2hex(buffer) {
	// buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), function (x) {
		return ('00' + x.toString(16)).slice(-2);
	}).join('');
}

function generateMGCTempUserId() {
	var r = window.crypto.getRandomValues(new Uint32Array(4));
	return 'mgc_' + buf2hex(r.buffer).toUpperCase();
}

function arrayBufferToBase64(buffer) {
	for (var res = "", arr = new Uint8Array(buffer), arrLeng = arr.byteLength, r = 0; r < arrLeng; r++) {
		res += String.fromCharCode(arr[r]);
	}
	return btoa(res);
}

function base64ToArrayBuffer(str) {
	for (var atobStr = atob(str), leng = atobStr.length, arr = new Uint8Array(leng), r = 0; r < leng; r++) {
		arr[r] = atobStr.charCodeAt(r);
	}return arr.buffer;
}

function textToArrayBuffer(str) {
	var enc = new TextEncoder();
	return enc.encode(str).buffer;
}

function parseData(str) {
	var result;
	if (str && typeof str === 'string') {
		try {
			result = JSON.parse(str);
		} catch (e) {
			result = {
				status: {
					code: 1,
					msg: 'PARAM_PARSE_ERROR'
				}
			};
		}
	} else {
		result = str || {};
	}
	return result;
}

function concatArrayBuffer(buffer1, buffer2) {
	var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
	tmp.set(new Uint8Array(buffer1), 0);
	tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
	return tmp.buffer;
}

function convertObjectValueToString(obj) {
	//把对象元素都转成字符串
	return Object.keys(obj).reduce(function (res, cur) {
		"string" == typeof obj[cur] ? res[cur] = obj[cur] : "number" == typeof obj[cur] ? res[cur] = obj[cur] + "" : res[cur] = Object.prototype.toString.apply(obj[cur]);
		return res;
	}, {});
}

function renameProperty(obj, oldName, newName) {
	isObject(obj) !== !1 && oldName != newName && obj.hasOwnProperty(oldName) && (obj[newName] = obj[oldName], delete obj[oldName]);
}

function toArray(arg) {
	// 把e转成array
	if (Array.isArray(arg)) {
		for (var t = 0, n = Array(arg.length); t < arg.length; t++) {
			n[t] = arg[t];
		}return n;
	}
	return Array.from(arg);
}

var words = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    btoa = btoa || function (str) {
	for (var curPosFlag, curCodeValue, text = String(str), res = "", i = 0, wordTpl = words; text.charAt(0 | i) || (wordTpl = "=", i % 1); res += wordTpl.charAt(63 & curPosFlag >> 8 - i % 1 * 8)) {
		curCodeValue = text.charCodeAt(i += .75);
		if (curCodeValue > 255) throw new Error('"btoa" failed');
		curPosFlag = curPosFlag << 8 | curCodeValue;
	}
	return res;
},
    atob = atob || function (str) {
	var text = String(str).replace(/=+$/, ""),
	    res = "";
	if (text.length % 4 === 1) throw new Error('"atob" failed');
	for (var curFlage, curValue, i = 0, a = 0; curValue = text.charAt(a++); ~curValue && (curFlage = i % 4 ? 64 * curFlage + curValue : curValue, i++ % 4) ? res += String.fromCharCode(255 & curFlage >> (-2 * i & 6)) : 0) {
		curValue = words.indexOf(curValue);
	}return res;
};

var AppServiceSdkKnownError = function (_Error) {
	_inherits(AppServiceSdkKnownError, _Error);

	function AppServiceSdkKnownError(e) {
		_classCallCheck(this, AppServiceSdkKnownError);

		var _this = _possibleConstructorReturn(this, (AppServiceSdkKnownError.__proto__ || Object.getPrototypeOf(AppServiceSdkKnownError)).call(this, "APP-SERVICE-SDK:" + e));

		_this.type = "AppServiceSdkKnownError";
		return _this;
	}

	return AppServiceSdkKnownError;
}(Error);

var Components = {
	//components
	audio: { "1.0.0": ["id", "src", "loop", "controls", "poster", "name", "author", "binderror", "bindplay", "bindpause", "bindtimeupdate", "bindended"] },
	button: {
		"1.0.0": [{ size: ["default", "mini"] }, { type: ["primary", "default", "warn"] }, "plain", "disabled", "loading", { "form-type": ["submit", "reset"] }, "hover-class", "hover-start-time", "hover-stay-time"],
		"1.1.0": [{ "open-type": ["contact"] }],
		"1.2.0": [{ "open-type": ["share"] }],
		"1.4.0": ["session-from"],
		"1.3.0": [{ "open-type": ["getUserInfo"] }]
	},
	canvas: { "1.0.0": ["canvas-id", "disable-scroll", "bindtouchstart", "bindtouchmove", "bindtouchend", "bindtouchcancel", "bindlongtap", "binderror"] },
	"checkbox-group": { "1.0.0": ["bindchange"] },
	checkbox: { "1.0.0": ["value", "disabled", "checked", "color"] },
	"contact-button": { "1.0.0": ["size", { type: ["default-dark", "default-light"] }, "session-from"] },
	"cover-view": { "1.4.0": [] },
	"cover-image": { "1.4.0": ["src"] },
	form: { "1.0.0": ["report-submit", "bindsubmit", "bindreset"], "1.2.0": ["bindautofill"] },
	icon: { "1.0.0": [{ type: ["success", "success_no_circle", "info", "warn", "waiting", "cancel", "download", "search", "clear"] }, "size", "color"] },
	image: { "1.0.0": ["src", { mode: ["scaleToFill", "aspectFit", "aspectFill", "widthFix", "top", "bottom", "center", "left", "right", "top left", "top right", "bottom left", "bottom right"] }, "binderror", "bindload"] },
	input: {
		"1.0.0": ["value", { type: ["text", "number", "idcard", "digit"] }, "password", "placeholder", "placeholder-style", "placeholder-class", "disabled", "maxlength", "cursor-spacing", "auto-focus", "focus", "bindinput", "bindfocus", "bindblur", "bindconfirm"],
		"1.1.0": [{ "confirm-type": ["send", "search", "next", "go", "done"] }, "confirm-hold"],
		"1.2.0": ["auto-fill"]
	},
	label: { "1.0.0": ["for"] },
	map: {
		"1.0.0": ["longitude", "latitude", "scale", { markers: ["id", "latitude", "longitude", "title", "iconPath", "rotate", "alpha", "width", "height"] }, "covers", { polyline: ["points", "color", "width", "dottedLine"] }, { circles: ["latitude", "longitude", "color", "fillColor", "radius", "strokeWidth"] }, { controls: ["id", "position", "iconPath", "clickable"] }, "include-points", "show-location", "bindmarkertap", "bindcontroltap", "bindregionchange", "bindtap"],
		"1.2.0": [{ markers: ["callout", "label", "anchor"] }, { polyline: ["arrowLine", "borderColor", "borderWidth"] }, "bindcallouttap"]
	},
	modal: { "1.0.0": [] },
	"movable-area": { "1.2.0": [] },
	"movable-view": { "1.2.0": ["direction", "inertia", "out-of-bounds", "x", "y", "damping", "friction"] },
	navigator: {
		"1.0.0": ["url", { "open-type": ["navigate", "redirect", "switchTab"] }, "delta", "hover-class", "hover-start-time", "hover-stay-time"],
		"1.1.0": [{ "open-type": ["reLaunch", "navigateBack"] }]
	},
	"open-data": { "1.4.0": [{ type: ["groupName"] }, "open-gid"] },
	"picker-view": { "1.0.0": ["value", "indicator-style", "bindchange"], "1.1.0": ["indicator-class"] },
	"picker-view-column": { "1.0.0": [] },
	picker: {
		"1.0.0": ["range", "range-key", "value", "bindchange", "disabled", "start", "end", { fields: ["year", "month", "day"] }, { mode: ["selector", "date", "time"] }],
		"1.2.0": ["auto-fill"],
		"1.4.0": ["bindcolumnchange", { mode: ["multiSelector", "region"] }]
	},
	progress: { "1.0.0": ["percent", "show-info", "stroke-width", "color", "activeColor", "backgroundColor", "active"] },
	"radio-group": { "1.0.0": ["bindchange"] },
	radio: { "1.0.0": ["value", "checked", "disabled", "color"] },
	"rich-text": { "1.4.0": [{ nodes: ["name", "attrs", "children"] }] },
	"scroll-view": { "1.0.0": ["scroll-x", "scroll-y", "upper-threshold", "lower-threshold", "scroll-top", "scroll-left", "scroll-into-view", "scroll-with-animation", "enable-back-to-top", "bindscrolltoupper", "bindscrolltolower", "bindscroll"] },
	slider: { "1.0.0": ["min", "max", "step", "disabled", "value", "color", "selected-color", "activeColor", "backgroundColor", "show-value", "bindchange"] },
	swiper: {
		"1.0.0": ["indicator-dots", "autoplay", "current", "interval", "duration", "circular", "vertical", "bindchange"],
		"1.1.0": ["indicator-color", "indicator-active-color"]
	},
	"swiper-item": { "1.0.0": [] },
	"switch": { "1.0.0": ["checked", { type: ["switch", "checkbox"] }, "bindchange", "color"] },
	text: { "1.0.0": [], "1.1.0": ["selectable"], "1.4.0": [{ space: ["ensp", "emsp", "nbsp"] }, "decode"] },
	textarea: {
		"1.0.0": ["value", "placeholder", "placeholder-style", "placeholder-class", "disabled", "maxlength", "auto-focus", "focus", "auto-height", "fixed", "cursor-spacing", "bindfocus", "bindblur", "bindlinechange", "bindinput", "bindconfirm"],
		"1.2.0": ["auto-fill"]
	},
	video: {
		"1.0.0": ["src", "controls", "danmu-list", "danmu-btn", "enable-danmu", "autoplay", "bindplay", "bindpause", "bindended", "bindtimeupdate", "objectFit", "poster"],
		"1.1.0": ["duration"],
		"1.4.0": ["loop", "muted", "bindfullscreenchange"]
	},
	view: { "1.0.0": ["hover-class", "hover-start-time", "hover-stay-time"] }
};
var APIs = {
	//APIS
	onAccelerometerChange: { "1.0.0": [{ callback: ["x", "y", "z"] }] },
	startAccelerometer: { "1.1.0": [] },
	stopAccelerometer: { "1.1.0": [] },
	chooseAddress: { "1.1.0": [{ success: ["userName", "postalCode", "provinceName", "cityName", "countyName", "detailInfo", "nationalCode", "telNumber"] }] },
	createAnimation: { "1.0.0": [{ object: ["duration", { timingFunction: ["linear", "ease", "ease-in", "ease-in-out", "ease-out", "step-start", "step-end"] }, "delay", "transformOrigin"] }] },
	createAudioContext: { "1.0.0": [] },
	canIUse: { "1.0.0": [] },
	login: { "1.0.0": [{ success: ["code"] }] },
	checkSession: { "1.0.0": [] },
	createMapContext: { "1.0.0": [] },
	requestPayment: { "1.0.0": [{ object: ["timeStamp", "nonceStr", "package", "signType", "paySign"] }] },
	showToast: { "1.0.0": [{ object: ["title", "icon", "duration", "mask"] }], "1.1.0": [{ object: ["image"] }] },
	showLoading: { "1.1.0": [{ object: ["title", "mask"] }] },
	hideToast: { "1.0.0": [] },
	hideLoading: { "1.1.0": [] },
	showModal: {
		"1.0.0": [{ object: ["title", "content", "showCancel", "cancelText", "cancelColor", "confirmText", "confirmColor"] }, { success: ["confirm"] }],
		"1.1.0": [{ success: ["cancel"] }]
	},
	showActionSheet: { "1.0.0": [{ object: ["itemList", "itemColor"] }, { success: ["tapIndex"] }] },
	arrayBufferToBase64: { "1.1.0": [] },
	base64ToArrayBuffer: { "1.1.0": [] },
	createVideoContext: { "1.0.0": [] },
	authorize: { "1.2.0": [{ object: ["scope"] }] },
	openBluetoothAdapter: { "1.1.0": [] },
	closeBluetoothAdapter: { "1.1.0": [] },
	getBluetoothAdapterState: { "1.1.0": [{ success: ["discovering", "available"] }] },
	onBluetoothAdapterStateChange: { "1.1.0": [{ callback: ["available", "discovering"] }] },
	startBluetoothDevicesDiscovery: { "1.1.0": [{ object: ["services", "allowDuplicatesKey", "interval"] }, { success: ["isDiscovering"] }] },
	stopBluetoothDevicesDiscovery: { "1.1.0": [] },
	getBluetoothDevices: { "1.1.0": [{ success: ["devices"] }] },
	onBluetoothDeviceFound: { "1.1.0": [{ callback: ["devices"] }] },
	getConnectedBluetoothDevices: { "1.1.0": [{ object: ["services"] }, { success: ["devices"] }] },
	createBLEConnection: { "1.1.0": [{ object: ["deviceId"] }] },
	closeBLEConnection: { "1.1.0": [{ object: ["deviceId"] }] },
	getBLEDeviceServices: { "1.1.0": [{ object: ["deviceId"] }, { success: ["services"] }] },
	getBLEDeviceCharacteristics: { "1.1.0": [{ object: ["deviceId", "serviceId"] }, { success: ["characteristics"] }] },
	readBLECharacteristicValue: { "1.1.0": [{ object: ["deviceId", "serviceId", "characteristicId"] }, { success: ["characteristic"] }] },
	writeBLECharacteristicValue: { "1.1.0": [{ object: ["deviceId", "serviceId", "characteristicId", "value"] }] },
	notifyBLECharacteristicValueChange: { "1.1.1": [{ object: ["deviceId", "serviceId", "characteristicId", "state"] }] },
	onBLEConnectionStateChange: { "1.1.1": [{ callback: ["deviceId", "connected"] }] },
	onBLECharacteristicValueChange: { "1.1.0": [{ callback: ["deviceId", "serviceId", "characteristicId", "value"] }] },
	captureScreen: { "1.4.0": [{ success: ["tempFilePath"] }] },
	addCard: { "1.1.0": [{ object: ["cardList"] }, { success: ["cardList"] }] },
	openCard: { "1.1.0": [{ object: ["cardList"] }] },
	setClipboardData: { "1.1.0": [{ object: ["data"] }] },
	getClipboardData: { "1.1.0": [{ success: ["data"] }] },
	onCompassChange: { "1.0.0": [{ callback: ["direction"] }] },
	startCompass: { "1.1.0": [] },
	stopCompass: { "1.1.0": [] },
	setStorage: { "1.0.0": [{ object: ["key", "data"] }] },
	getStorage: { "1.0.0": [{ object: ["key"] }, { success: ["data"] }] },
	getStorageSync: { "1.0.0": [] },
	getStorageInfo: { "1.0.0": [{ success: ["keys", "currentSize", "limitSize"] }] },
	removeStorage: { "1.0.0": [{ object: ["key"] }] },
	removeStorageSync: { "1.0.0": [] },
	clearStorage: { "1.0.0": [] },
	clearStorageSync: { "1.0.0": [] },
	getNetworkType: { "1.0.0": [{ success: ["networkType"] }] },
	onNetworkStatusChange: { "1.1.0": [{ callback: ["isConnected", { networkType: ["wifi", "2g", "3g", "4g", "none", "unknown"] }] }] },
	setScreenBrightness: { "1.2.0": [{ object: ["value"] }] },
	getScreenBrightness: { "1.2.0": [{ success: ["value"] }] },
	vibrateLong: { "1.2.0": [] },
	vibrateShort: { "1.2.0": [] },
	getExtConfig: { "1.1.0": [{ success: ["extConfig"] }] },
	getExtConfigSync: { "1.1.0": [] },
	saveFile: { "1.0.0": [{ object: ["tempFilePath"] }, { success: ["savedFilePath"] }] },
	getSavedFileList: { "1.0.0": [{ success: ["fileList"] }] },
	getSavedFileInfo: { "1.0.0": [{ object: ["filePath"] }, { success: ["size", "createTime"] }] },
	removeSavedFile: { "1.0.0": [{ object: ["filePath"] }] },
	openDocument: { "1.0.0": [{ object: ["filePath"] }], "1.4.0": [{ object: ["fileType"] }] },
	getBackgroundAudioManager: { "1.2.0": [] },
	getFileInfo: { "1.4.0": [{ object: ["filePath", { digestAlgorithm: ["md5", "sha1"] }] }, { success: ["size", "digest"] }] },
	startBeaconDiscovery: { "1.2.0": [{ object: ["uuids"] }] },
	stopBeaconDiscovery: { "1.2.0": [] },
	getBeacons: { "1.2.0": [{ success: ["beacons"] }] },
	onBeaconUpdate: { "1.2.0": [{ callback: ["beacons"] }] },
	onBeaconServiceChange: { "1.2.0": [{ callback: ["available", "discovering"] }] },
	getLocation: {
		"1.0.0": [{ object: ["type"] }, { success: ["latitude", "longitude", "speed", "accuracy"] }],
		"1.2.0": [{ success: ["altitude", "verticalAccuracy", "horizontalAccuracy"] }]
	},
	chooseLocation: { "1.0.0": [{ object: ["cancel"] }, { success: ["name", "address", "latitude", "longitude"] }] },
	openLocation: { "1.0.0": [{ object: ["latitude", "longitude", "scale", "name", "address"] }] },
	getBackgroundAudioPlayerState: { "1.0.0": [{ success: ["duration", "currentPosition", "status", "downloadPercent", "dataUrl"] }] },
	playBackgroundAudio: { "1.0.0": [{ object: ["dataUrl", "title", "coverImgUrl"] }] },
	pauseBackgroundAudio: { "1.0.0": [] },
	seekBackgroundAudio: { "1.0.0": [{ object: ["position"] }] },
	stopBackgroundAudio: { "1.0.0": [] },
	onBackgroundAudioPlay: { "1.0.0": [] },
	onBackgroundAudioPause: { "1.0.0": [] },
	onBackgroundAudioStop: { "1.0.0": [] },
	chooseImage: {
		"1.0.0": [{ object: ["count", "sizeType", "sourceType"] }, { success: ["tempFilePaths"] }],
		"1.2.0": [{ success: ["tempFiles"] }]
	},
	previewImage: { "1.0.0": [{ object: ["current", "urls"] }] },
	getImageInfo: { "1.0.0": [{ object: ["src"] }, { success: ["width", "height", "path"] }] },
	saveImageToPhotosAlbum: { "1.2.0": [{ object: ["filePath"] }] },
	startRecord: { "1.0.0": [{ success: ["tempFilePath"] }] },
	stopRecord: { "1.0.0": [] },
	chooseVideo: { "1.0.0": [{ object: ["sourceType", "maxDuration", "camera"] }, { success: ["tempFilePath", "duration", "size", "height", "width"] }] },
	saveVideoToPhotosAlbum: { "1.2.0": [{ object: ["filePath"] }] },
	playVoice: { "1.0.0": [{ object: ["filePath"] }] },
	pauseVoice: { "1.0.0": [] },
	stopVoice: { "1.0.0": [] },
	navigateBackMiniProgram: { "1.3.0": [{ object: ["extraData"] }] },
	navigateToMiniProgram: { "1.3.0": [{ object: ["appId", "path", "extraData", "envVersion"] }] },
	uploadFile: { "1.0.0": [{ object: ["url", "filePath", "name", "header", "formData"] }, { success: ["data", "statusCode"] }] },
	downloadFile: { "1.0.0": [{ object: ["url", "header"] }] },
	request: {
		"1.0.0": [{ object: ["url", "data", "header", { method: ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"] }, "dataType"] }, { success: ["data", "statusCode"] }],
		"1.2.0": [{ success: ["header"] }]
	},
	connectSocket: {
		"1.0.0": [{ object: ["url", "data", "header", { method: ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"] }] }],
		"1.4.0": [{ object: ["protocols"] }]
	},
	onSocketOpen: { "1.0.0": [] },
	onSocketError: { "1.0.0": [] },
	sendSocketMessage: { "1.0.0": [{ object: ["data"] }] },
	onSocketMessage: { "1.0.0": [{ callback: ["data"] }] },
	closeSocket: { "1.0.0": [], "1.4.0": [{ object: ["code", "reason"] }] },
	onSocketClose: { "1.0.0": [] },
	onUserCaptureScreen: { "1.4.0": [] },
	chooseContact: { "1.0.0": [{ success: ["phoneNumber", "displayName"] }] },
	getUserInfo: {
		"1.0.0": [{ success: ["userInfo", "rawData", "signature", "encryptedData", "iv"] }],
		"1.1.0": [{ object: ["withCredentials"] }],
		"1.4.0": [{ object: ["lang"] }]
	},
	addPhoneContact: { "1.2.0": [{ object: ["photoFilePath", "nickName", "lastName", "middleName", "firstName", "remark", "mobilePhoneNumber", "weChatNumber", "addressCountry", "addressState", "addressCity", "addressStreet", "addressPostalCode", "organization", "title", "workFaxNumber", "workPhoneNumber", "hostNumber", "email", "url", "workAddressCountry", "workAddressState", "workAddressCity", "workAddressStreet", "workAddressPostalCode", "homeFaxNumber", "homePhoneNumber", "homeAddressCountry", "homeAddressState", "homeAddressCity", "homeAddressStreet", "homeAddressPostalCode"] }] },
	makePhoneCall: { "1.0.0": [{ object: ["phoneNumber"] }] },
	stopPullDownRefresh: { "1.0.0": [] },
	scanCode: {
		"1.0.0": [{ success: ["result", "scanType", "charSet", "path"] }],
		"1.2.0": [{ object: ["onlyFromCamera"] }]
	},
	pageScrollTo: { "1.4.0": [{ object: ["scrollTop"] }] },
	setEnableDebug: { "1.4.0": [{ object: ["enableDebug"] }] },
	setKeepScreenOn: { "1.4.0": [{ object: ["keepScreenOn"] }] },
	setNavigationBarColor: { "1.4.0": [{ object: ["frontColor", "backgroundColor", "animation", "animation.duration", { "animation.timingFunc": ["linear", "easeIn", "easeOut", "easeInOut"] }] }] },
	openSetting: { "1.1.0": [{ success: ["authSetting"] }] },
	getSetting: { "1.2.0": [{ success: ["authSetting"] }] },
	showShareMenu: { "1.1.0": [{ object: ["withShareTicket"] }] },
	hideShareMenu: { "1.1.0": [] },
	updateShareMenu: { "1.2.0": [{ object: ["withShareTicket"] }], "1.4.0": [{ object: ["dynamic", "widget"] }] },
	getShareInfo: { "1.1.0": [{ object: ["shareTicket"] }, { callback: ["encryptedData", "iv"] }] },
	getSystemInfo: {
		"1.0.0": [{ success: ["model", "pixelRatio", "windowWidth", "windowHeight", "language", "version", "system", "platform"] }],
		"1.1.0": [{ success: ["screenWidth", "screenHeight", "SDKVersion"] }]
	},
	getSystemInfoSync: {
		"1.0.0": [{ return: ["model", "pixelRatio", "windowWidth", "windowHeight", "language", "version", "system", "platform"] }],
		"1.1.0": [{ return: ["screenWidth", "screenHeight", "SDKVersion"] }]
	},
	navigateTo: { "1.0.0": [{ object: ["url"] }] },
	redirectTo: { "1.0.0": [{ object: ["url"] }] },
	reLaunch: { "1.1.0": [{ object: ["url"] }] },
	switchTab: { "1.0.0": [{ object: ["url"] }] },
	navigateBack: { "1.0.0": [{ object: ["delta"] }] },
	setNavigationBarTitle: { "1.0.0": [{ object: ["title"] }] },
	showNavigationBarLoading: { "1.0.0": [] },
	hideNavigationBarLoading: { "1.0.0": [] },
	setTopBarText: { "1.4.2": [{ object: ["text"] }] },
	getWeRunData: { "1.2.0": [{ success: ["encryptedData", "iv"] }] },
	createSelectorQuery: { "1.4.0": [] },
	createCanvasContext: { "1.0.0": [] },
	canvasToTempFilePath: {
		"1.0.0": [{ object: ["canvasId"] }],
		"1.2.0": [{ object: ["x", "y", "width", "height", "destWidth", "destHeight"] }]
	},
	canvasContext: {
		"1.0.0": ["addColorStop", "arc", "beginPath", "bezierCurveTo", "clearActions", "clearRect", "closePath", "createCircularGradient", "createLinearGradient", "drawImage", "draw", "fillRect", "fillText", "fill", "lineTo", "moveTo", "quadraticCurveTo", "rect", "rotate", "save", "scale", "setFillStyle", "setFontSize", "setGlobalAlpha", "setLineCap", "setLineJoin", "setLineWidth", "setMiterLimit", "setShadow", "setStrokeStyle", "strokeRect", "stroke", "translate"],
		"1.1.0": ["setTextAlign"],
		"1.4.0": ["setTextBaseline"]
	},
	animation: { "1.0.0": ["opacity", "backgroundColor", "width", "height", "top", "left", "bottom", "right", "rotate", "rotateX", "rotateY", "rotateZ", "rotate3d", "scale", "scaleX", "scaleY", "scaleZ", "scale3d", "translate", "translateX", "translateY", "translateZ", "translate3d", "skew", "skewX", "skewY", "matrix", "matrix3d"] },
	audioContext: { "1.0.0": ["setSrc", "play", "pause", "seek"] },
	mapContext: {
		"1.0.0": ["getCenterLocation", "moveToLocation"],
		"1.2.0": ["translateMarker", "includePoints"],
		"1.4.0": ["getRegion", "getScale"]
	},
	videoContext: {
		"1.0.0": ["play", "pause", "seek", "sendDanmu"],
		"1.4.0": ["playbackRate", "requestFullScreen", "exitFullScreen"]
	},
	backgroundAudioManager: { "1.2.0": ["play", "pause", "stop", "seek", "onCanplay", "onPlay", "onPause", "onStop", "onEnded", "onTimeUpdate", "onPrev", "onNext", "onError", "onWaiting", "duration", "currentTime", "paused", "src", "startTime", "buffered", "title", "epname", "singer", "coverImgUrl", "webUrl"] },
	uploadTask: { "1.4.0": ["onProgressUpdate", "abort"] },
	downloadTask: { "1.4.0": ["onProgressUpdate", "abort"] },
	requestTask: { "1.4.0": ["abort"] },
	selectorQuery: { "1.4.0": ["select", "selectAll", "selectViewport", "exec"] },
	onBLEConnectionStateChanged: { "1.1.0": [{ callback: ["deviceId", "connected"] }] },
	notifyBLECharacteristicValueChanged: { "1.1.0": [{ object: ["deviceId", "serviceId", "characteristicId", "state"] }] },
	sendBizRedPacket: { "1.2.0": [{ object: ["timeStamp", "nonceStr", "package", "signType", "paySign"] }] }
};

//检测组件相关是否存在
function isComponentExist(params) {
	var name = params[0],
	    //组件名
	attribute = params[1],
	    //属性名
	option = params[2],
	    //组件属性可选值
	component = Components[name];
	if (!attribute) {
		return true;
	} else {
		for (var key in component) {
			for (var i = 0; i < component[key].length; i++) {
				if ("string" == typeof component[key][i] && component[key][i] == attribute) {
					return true;
				} else if (component[key][i][attribute]) {
					if (!option) {
						return true;
					} else if (component[key][i][attribute].indexOf(option) > -1) {
						return true;
					}
				}
			}
		}
		return false;
	}
}

//检测API相关是否存在
function isAPIExist(params) {
	var name = params[0],
	    //API名
	method = params[1],
	    //调用方式：有效值为return, success, object, callback
	param = params[2],
	    //组件属性可选值
	options = params[3],
	    methods = ["return", "success", "object", "callback"],
	    api = APIs[name];
	if (api) {
		if (!method) {
			return true;
		} else if (methods.indexOf(method) < 0) {
			return false;
		} else {
			for (var key in api) {
				for (var i = 0; i < key.length; i++) {
					if ("object" == _typeof(api[key][i]) && api[key][i][method]) {
						if (!param) {
							return true;
						} else {
							for (var j = 0; j < api[key][i][method].length; j++) {
								if (typeof api[key][i][method][j] == "string" && api[key][i][method][j] == param) {
									return true;
								} else if (_typeof(api[key][i][method][j]) == "object" && api[key][i][method][j][param]) {
									if (!options) {
										return true;
									} else if (api[key][i][method][j][param].indexOf(options) > -1) {
										return true;
									} else {
										return false;
									}
								}
							}
							return true;
						}
					}
				}
				return false;
			}
			return false;
		}
	} else {
		return true;
	}
}

function canIUse(params, version) {
	var name = params[0]; //API或组件名
	if (Components[name]) {
		return isComponentExist(params);
	} else if (APIs[name]) {
		return isAPIExist(params);
	} else {
		return false;
	}
}

function checkParam(e, t) {
	if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

var config = function () {
	function e(e, t) {
		for (var n = 0; n < t.length; n++) {
			var obj = t[n];
			obj.enumerable = obj.enumerable || !1, obj.configurable = !0, "value" in obj && (obj.writable = !0), Object.defineProperty(e, obj.key, obj);
		}
	}

	return function (t, n, obj) {
		return n && e(t.prototype, n), obj && e(t, obj), t;
	};
}();
var setSelect = function () {
	function e(t, n, r) {
		checkParam(this, e), this._selectorQuery = t, this._selector = n, this._single = r;
	}

	return config(e, [{
		key: "fields",
		value: function value(e, t) {
			return this._selectorQuery._push(this._selector, this._single, e, t), this._selectorQuery;
		}
	}, {
		key: "boundingClientRect",
		value: function value(e) {
			return this._selectorQuery._push(this._selector, this._single, {
				id: !0,
				dataset: !0,
				rect: !0,
				size: !0
			}, e), this._selectorQuery;
		}
	}, {
		key: "scrollOffset",
		value: function value(e) {
			return this._selectorQuery._push(this._selector, this._single, {
				id: !0,
				dataset: !0,
				scrollOffset: !0
			}, e), this._selectorQuery;
		}
	}]), e;
}();
var wxQuerySelector = function () {
	function init(t) {
		checkParam(this, init);
		this._webviewId = t;
		this._queue = [];
		this._queueCb = [];
	}

	return config(init, [{
		key: "select", value: function value(e) {
			return new setSelect(this, e, !0);
		}
	}, {
		key: "selectAll", value: function value(e) {
			return new setSelect(this, e, !1);
		}
	}, {
		key: "selectViewport", value: function value() {
			return new setSelect(this, "viewport", !0);
		}
	}, {
		key: "_push", value: function value(e, t, n, o) {
			this._queue.push({ selector: e, single: t, fields: n }), this._queueCb.push(o || null);
		}
	}, {
		key: "exec", value: function value(e) {
			var t = this;
			u(this._webviewId, this._queue, function (n) {
				var o = t._queueCb;
				n.forEach(function (e, n) {
					"function" == typeof o[n] && o[n].call(t, e);
				}), "function" == typeof e && e.call(t, n);
			});
		}
	}]), init;
}();

function transWxmlToHtml(url) {
	if ("string" != typeof url) return url;
	var urlArr = url.split("?");
	return urlArr[0] += ".html", void 0 !== urlArr[1] ? urlArr[0] + "?" + urlArr[1] : urlArr[0];
}

function removeHtmlSuffixFromUrl(url) {
	return "string" == typeof url ? -1 !== url.indexOf("?") ? url.replace(/\.html\?/, "?") : url.replace(/\.html$/, "") : url;
}

function getFontFamily(fontHandle) {
	var ttfIndex = fontHandle.lastIndexOf(".ttf");
	if (ttfIndex === -1) return fontHandle;

	var slashPos = fontHandle.lastIndexOf("/");
	var fontFamilyName = void 0;
	if (slashPos === -1) {
		fontFamilyName = fontHandle.substring(0, ttfIndex);
	} else {
		fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex);
	}
	if (fontFamilyName.indexOf(' ') !== -1) {
		fontFamilyName = '"' + fontFamilyName + '"';
	}
	return fontFamilyName;
}

function getOrCreateUserId() {
	var userId = window.__nativeLocalStorage.getItem(_const2.default.LETO_MGC_MOBILE);
	if (!userId || userId.length <= 0) {
		userId = generateMGCTempUserId();
		window.__nativeLocalStorage.setItem(_const2.default.LETO_MGC_MOBILE, userId);
	}
	return userId;
}

exports.default = {
	surroundByTryCatchFactory: surroundByTryCatchFactory,
	throttle: throttle,
	getDataType: getDataType,
	isObject: isObject,
	paramCheck: paramCheck,
	getRealRoute: getRealRoute,
	getPlatform: getPlatform,
	getSDKMode: getSDKMode,
	urlEncodeFormData: urlEncodeFormData,
	addQueryStringToUrl: addQueryStringToUrl,
	validateUrl: validateUrl,
	assign: assign,
	encodeUrlQuery: encodeUrlQuery,
	transWxmlToHtml: transWxmlToHtml,
	removeHtmlSuffixFromUrl: removeHtmlSuffixFromUrl,
	extend: extend,
	buf2hex: buf2hex,
	arrayBufferToBase64: arrayBufferToBase64,
	base64ToArrayBuffer: base64ToArrayBuffer,
	blobToArrayBuffer: blobToArrayBuffer,
	textToArrayBuffer: textToArrayBuffer,
	parseData: parseData,
	convertObjectValueToString: convertObjectValueToString,
	anyTypeToString: surroundByTryCatchFactory(anyTypeToString, "anyTypeToString"),
	stringToAnyType: surroundByTryCatchFactory(stringToAnyType, "stringToAnyType"),
	AppServiceSdkKnownError: AppServiceSdkKnownError,
	renameProperty: renameProperty,
	toArray: toArray,
	canIUse: canIUse,
	wxQuerySelector: wxQuerySelector,
	getFontFamily: getFontFamily,
	concatArrayBuffer: concatArrayBuffer,
	generateMGCTempUserId: generateMGCTempUserId,
	getOrCreateUserId: getOrCreateUserId
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// next button id
var nextButtonId = 1;

var WXButton = function () {
	function WXButton(name, params) {
		_classCallCheck(this, WXButton);

		// button name
		this.name = name;

		// buttonId is assigned in native side, js side save it and pass it back to native side
		// when calling button method
		this.buttonId = nextButtonId++;

		// button style
		this.style = params.style || {
			left: 0,
			top: 0,
			width: 100,
			height: 32,
			backgroundColor: 'ffffff',
			borderColor: '000000',
			borderWidth: 1,
			borderRadius: 6,
			textAlign: 'center',
			fontSize: 14,
			lineHeight: 16

			// button type, can be text or image
		};this.type = params.type || 'text';

		// icon, only valid when type is image
		this.icon = params.icon || 'none';

		// background image, only valid when type is image
		this.image = params.image || '';

		// text, only valid when type is text
		this.text = params.text || '';

		// init button
		_bridge2.default.callSyncApi('create' + this.name + 'Button', {
			buttonId: this.buttonId,
			style: this.style,
			type: this.type,
			icon: this.icon,
			image: this.image,
			text: this.text
		});
	}

	_createClass(WXButton, [{
		key: 'destroy',
		value: function destroy() {
			// clear callbacks
			if (window.wd) {
				window.wd.clearWXButtonTap(this.buttonId);
			}

			// destroy in native side
			_bridge2.default.invokeMethod(this.name + 'Button_destroy', { buttonId: this.buttonId });
		}
	}, {
		key: 'hide',
		value: function hide() {
			_bridge2.default.invokeMethod(this.name + 'Button_hide', { buttonId: this.buttonId });
		}
	}, {
		key: 'show',
		value: function show() {
			_bridge2.default.invokeMethod(this.name + 'Button_show', { buttonId: this.buttonId });
		}
	}, {
		key: 'onTap',
		value: function onTap(cb) {
			if (window.wd) {
				window.wd.onWXButtonTap(this.buttonId, cb);
			}
		}
	}, {
		key: 'offTap',
		value: function offTap(cb) {
			if (window.wd) {
				window.wd.offWXButtonTap(this.buttonId, cb);
			}
		}
	}]);

	return WXButton;
}();

exports.default = WXButton;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WXButton_js = function () {
	function WXButton_js(params) {
		var _this = this;

		_classCallCheck(this, WXButton_js);

		// ensure params
		params = params || {};
		params.type = params.type || 'text';
		params.text = params.text || 'Button';
		params.style = params.style || {
			left: 0,
			top: 0,
			width: 120,
			height: 40,
			borderWidth: 0,
			borderRadius: 0
		};
		params.style.backgroundColor = params.style.backgroundColor || '#fff';
		if (!params.style.backgroundColor.startsWith('#')) {
			params.style.backgroundColor = '#' + params.style.backgroundColor;
		}
		params.style.borderColor = params.style.borderColor || '#000';
		if (!params.style.borderColor.startsWith('#')) {
			params.style.borderColor = '#' + params.style.borderColor;
		}
		params.style.color = params.style.color || '#fff';
		if (!params.style.color.startsWith('#')) {
			params.style.color = '#' + params.style.color;
		}
		params.style.textAlign = params.style.textAlign || 'left';
		if (['left', 'right', 'center'].indexOf(params.style.textAlign) == -1) {
			params.style.textAlign = 'left';
		}
		params.style.fontSize = params.style.fontSize || 14;

		// init
		this.tapCallbacks = [];

		// bg image
		var bgCss = 'background: url(' + params.image + ') no-repeat;\n\t\t\tbackground-size: 100% 100%;';

		// create button div
		var doc = window.NativeGlobal.document;
		this.div = doc.createElement('div');
		this.div.style.cssText = 'position: absolute; \n\t\t\tz-index: 999; \n\t\t\tleft: ' + params.style.left + 'px; \n\t\t\ttop: ' + params.style.top + 'px; \n\t\t\twidth: ' + params.style.width + 'px;\n\t\t\theight: ' + params.style.height + 'px;\n\t\t\tbackground-color: ' + params.style.backgroundColor + ';\n\t\t\tborder: solid ' + params.style.borderColor + ';\n\t\t\tborder-width: ' + params.style.borderWidth + 'px;\n\t\t\tborder-radius: ' + params.style.borderRadius + 'px;\n\t\t\tdisplay: flex;\n\t\t\tflex-flow: row nowrap;\n\t\t\tjustify-content: center;\n\t\t\talign-items: center;\n\t\t\t' + (params.type == 'image' ? bgCss : '');
		doc.body.appendChild(this.div);

		// create content based on type
		if (params.type == 'text') {
			var textEle = doc.createElement('p');
			textEle.textContent = params.text;
			textEle.style.cssText = 'color: ' + params.style.color + ';\n\t\t\tflex-grow: 1;\n\t\t\ttext-align: ' + params.style.textAlign + ';\n\t\t\tfont-size: ' + params.style.fontSize + 'px;\n\t\t\tline-height: ' + params.style.lineHeight + 'px;';
			this.div.appendChild(textEle);
		} else {
			// icon, 对于icon样式, 简化处理
			if (params.icon) {
				var icon = doc.createElement('img');
				if (['green', 'white', 'dark', 'light'].indexOf(params.icon) == -1) {
					icon.src = params.image;
				} else {
					icon.src = '__leto__/leto_game_club.png';
				}
				icon.style.cssText = 'height: ' + params.style.height + 'px;';
				this.div.appendChild(icon);
			}
		}

		// event
		this.div.onclick = function (e) {
			window.mgc.getUserInfo({
				success: function success(res) {
					_this.tapCallbacks.forEach(function (fn) {
						fn(res);
					});
				}
			});
		};

		// hide at first
		this.hide();
	}

	_createClass(WXButton_js, [{
		key: 'hide',
		value: function hide() {
			this.div.style.display = 'none';
		}
	}, {
		key: 'show',
		value: function show() {
			this.div.style.display = 'flex';
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			var doc = window.NativeGlobal.document;
			doc.body.removeChild(this.div);
		}
	}, {
		key: 'onTap',
		value: function onTap(fn) {
			if (fn) {
				this.tapCallbacks.push(fn);
			} else {
				this.tapCallbacks.splice(0, this.tapCallbacks.length);
			}
		}
	}, {
		key: 'offTap',
		value: function offTap(fn) {
			if (fn) {
				var idx = this.tapCallbacks.indexOf(fn);
				if (idx != -1) {
					this.tapCallbacks.splice(idx, 1);
				}
			} else {
				this.tapCallbacks.splice(0, this.tapCallbacks.length);
			}
		}
	}]);

	return WXButton_js;
}();

exports.default = WXButton_js;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

  return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
}

/* harmony default export */ __webpack_exports__["a"] = (bytesToUuid);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
// module6

exports.default = {
	LOG_LIMIT: 1024,
	AppStatus: {
		FORE_GROUND: 0,
		BACK_GROUND: 1,
		LOCK: 2
	}
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// global runtime info
var Leto = {};

(function () {
	// user agent
	var ua = global.navigator.userAgent.toLowerCase();

	// is mobile device
	Leto.isMobile = /mobile|android|iphone|ipad/.test(ua);

	// platform
	Leto.isAndroid = false;
	Leto.isIOS = false;
	if (/android (\d+(?:\.\d+)+)/i.exec(ua) || /android (\d+(?:\.\d+)+)/i.exec(global.navigator.platform)) {
		Leto.isAndroid = true;
	}
	if (/(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua)) {
		Leto.isIOS = true;
	}

	// browser type
	Leto.browserType = _const2.default.BROWSER_TYPE_UNKNOWN;
	var typeReg1 = /micromessenger|mqqbrowser|sogou|qzone|liebao|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|trident|miuibrowser/i;
	var typeReg2 = /qqbrowser|qq|chrome|safari|firefox|opr|oupeng|opera/i;
	var browserTypes = typeReg1.exec(ua);
	if (!browserTypes) browserTypes = typeReg2.exec(ua);
	var browserType = browserTypes ? browserTypes[0] : _const2.default.BROWSER_TYPE_UNKNOWN;
	if (browserType === 'micromessenger') browserType = _const2.default.BROWSER_TYPE_WECHAT;else if (browserType === "safari" && Leto.isAndroid) browserType = _const2.default.BROWSER_TYPE_ANDROID;else if (browserType === "trident") browserType = _const2.default.BROWSER_TYPE_IE;else if (browserType === "360 aphone") browserType = _const2.default.BROWSER_TYPE_360;else if (browserType === "mxbrowser") browserType = _const2.default.BROWSER_TYPE_MAXTHON;else if (browserType === "opr") browserType = _const2.default.BROWSER_TYPE_OPERA;
	Leto.browserType = browserType;
})();

exports.default = Leto;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(25);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(26);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb, null, ret) },
            function(rej) { process.nextTick(callbackifyOnRejected, rej, cb) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = rng;
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
// find the complete implementation of crypto (msCrypto) on IE11.
var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

function rng() {
  if (!getRandomValues) {
    throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
  }

  return getRandomValues(rnds8);
}

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export DNS */
/* unused harmony export URL */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bytesToUuid_js__ = __webpack_require__(7);


function uuidToBytes(uuid) {
  // Note: We assume we're being passed a valid uuid string
  var bytes = [];
  uuid.replace(/[a-fA-F0-9]{2}/g, function (hex) {
    bytes.push(parseInt(hex, 16));
  });
  return bytes;
}

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  var bytes = new Array(str.length);

  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }

  return bytes;
}

var DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
var URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ __webpack_exports__["a"] = (function (name, version, hashfunc) {
  var generateUUID = function generateUUID(value, namespace, buf, offset) {
    var off = buf && offset || 0;
    if (typeof value == 'string') value = stringToBytes(value);
    if (typeof namespace == 'string') namespace = uuidToBytes(namespace);
    if (!Array.isArray(value)) throw TypeError('value must be an array of bytes');
    if (!Array.isArray(namespace) || namespace.length !== 16) throw TypeError('namespace must be uuid string or an Array of 16 byte values'); // Per 4.3

    var bytes = hashfunc(namespace.concat(value));
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      for (var idx = 0; idx < 16; ++idx) {
        buf[off + idx] = bytes[idx];
      }
    }

    return buf || Object(__WEBPACK_IMPORTED_MODULE_0__bytesToUuid_js__["a" /* default */])(bytes);
  }; // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name;
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // Canvas Context API


var _canvas = __webpack_require__(14);

var _canvas2 = _interopRequireDefault(_canvas);

var _predefinedColor = __webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function notifyCurrentRoutetoContext(url) {
	curUrl = url;
}

function isNum(e) {
	return typeof e === 'number';
}

function parseColorValue(colorStr) {
	var matchArr = null;
	if ((matchArr = /^#([0-9|A-F|a-f]{6})$/.exec(colorStr)) != null) {
		var red = parseInt(matchArr[1].slice(0, 2), 16),
		    green = parseInt(matchArr[1].slice(2, 4), 16),
		    blue = parseInt(matchArr[1].slice(4), 16);
		return [red, green, blue, 255];
	}

	if ((matchArr = /^rgb\((.+)\)$/.exec(colorStr)) != null) {
		return matchArr[1].split(',').map(function (e) {
			return parseInt(e.trim());
		}).concat(255);
	}

	if ((matchArr = /^rgba\((.+)\)$/.exec(colorStr)) != null) {
		return matchArr[1].split(',').map(function (e, t) {
			return t == 3 ? Math.floor(255 * parseFloat(e.trim())) : parseInt(e.trim());
		});
	}

	var color = colorStr.toLowerCase();

	if (_predefinedColor.predefinedColor.hasOwnProperty(color)) {
		matchArr = /^#([0-9|A-F|a-f]{6})$/.exec(_predefinedColor.predefinedColor[color]);
		var red = parseInt(matchArr[1].slice(0, 2), 16),
		    green = parseInt(matchArr[1].slice(2, 4), 16),
		    blue = parseInt(matchArr[1].slice(4), 16);
		return [red, green, blue, 255];
	}

	console.group('非法颜色: ' + colorStr);
	console.error('不支持颜色：' + colorStr);
	console.groupEnd();
}

function deepCopy(obj) {
	// 复制对象
	if (Array.isArray(obj)) {
		var res = [];
		obj.forEach(function (e) {
			res.push(deepCopy(e));
		});
		return res;
	}
	if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
		var res = {};
		for (var n in obj) {
			res[n] = deepCopy(obj[n]);
		}
		return res;
	}
	return obj;
}

var transformAndOthersAPI = ['scale', 'rotate', 'translate', 'save', 'restore'],
    drawingAPI = ['drawImage', 'fillText', 'fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect'],
    drawPathAPI = ['beginPath', 'moveTo', 'lineTo', 'rect', 'arc', 'quadraticCurveTo', 'bezierCurveTo', 'closePath'],
    styleAPI = ['setFillStyle', 'setStrokeStyle', 'setGlobalAlpha', 'setShadow', 'setFontSize', 'setLineCap', 'setLineJoin', 'setLineWidth', 'setMiterLimit'],
    curUrl = '';

var ColorStop = function () {
	function ColorStop(type, data) {
		_classCallCheck(this, ColorStop);

		this.type = type;
		this.data = data;
		this.colorStop = [];
	}

	_createClass(ColorStop, [{
		key: 'addColorStop',
		value: function addColorStop(e, t) {
			this.colorStop.push([e, parseColorValue(t)]);
		}
	}]);

	return ColorStop;
}();

var Context = function () {
	function Context(t) {
		_classCallCheck(this, Context);

		this.actions = [];
		this.path = [];
		this.canvasId = t;
	}

	_createClass(Context, [{
		key: 'getActions',
		value: function getActions() {
			var actions = deepCopy(this.actions);
			this.actions = [];
			this.path = [];
			return actions;
		}
	}, {
		key: 'clearActions',
		value: function clearActions() {
			this.actions = [];
			this.path = [];
		}
	}, {
		key: 'draw',
		value: function draw() {
			var reserve = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
			    canvasId = this.canvasId,
			    actions = deepCopy(this.actions);
			this.actions = [];
			this.path = [];
			_canvas2.default.drawCanvas({
				canvasId: canvasId,
				actions: actions,
				reserve: reserve
			});
		}
	}, {
		key: 'createLinearGradient',
		value: function createLinearGradient(e, t, n, o) {
			return new ColorStop('linear', [e, t, n, o]);
		}
	}, {
		key: 'createCircularGradient',
		value: function createCircularGradient(e, t, n) {
			return new ColorStop('radial', [e, t, n]);
		}
	}]);

	return Context;
}();

;[].concat(transformAndOthersAPI, drawingAPI).forEach(function (apiName) {
	apiName == 'fill' || apiName == 'stroke' ? Context.prototype[apiName] = function () {
		this.actions.push({
			method: apiName + 'Path',
			data: deepCopy(this.path)
		});
	} : apiName === 'fillRect' ? Context.prototype[apiName] = function (e, t, n, o) {
		this.actions.push({
			method: 'fillPath',
			data: [{
				method: 'rect',
				data: [e, t, n, o]
			}]
		});
	} : apiName === 'strokeRect' ? Context.prototype[apiName] = function (e, t, n, o) {
		this.actions.push({
			method: 'strokePath',
			data: [{
				method: 'rect',
				data: [e, t, n, o]
			}]
		});
	} : apiName == 'fillText' ? Context.prototype[apiName] = function (t, n, o) {
		this.actions.push({
			method: apiName,
			data: [t.toString(), n, o]
		});
	} : apiName == 'drawImage' ? Context.prototype[apiName] = function (t, n, o, r, a) {
		var data = isNum(r) && isNum(a) ? [t, n, o, r, a] : [t, n, o];
		this.actions.push({
			method: apiName,
			data: data
		});
	} : Context.prototype[apiName] = function () {
		this.actions.push({
			method: apiName,
			data: [].slice.apply(arguments)
		});
	};
});
drawPathAPI.forEach(function (apiName) {
	apiName == 'beginPath' ? Context.prototype[apiName] = function () {
		this.path = [];
	} : apiName == 'lineTo' ? Context.prototype.lineTo = function () {
		this.path.length == 0 ? this.path.push({
			method: 'moveTo',
			data: [].slice.apply(arguments)
		}) : this.path.push({
			method: 'lineTo',
			data: [].slice.apply(arguments)
		});
	} : Context.prototype[apiName] = function () {
		this.path.push({
			method: apiName,
			data: [].slice.apply(arguments)
		});
	};
});
styleAPI.forEach(function (apiName) {
	apiName == 'setFillStyle' || apiName == 'setStrokeStyle' ? Context.prototype[apiName] = function () {
		var params = arguments[0];
		typeof params === 'string' ? this.actions.push({
			method: apiName,
			data: ['normal', parseColorValue(params)]
		}) : (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' && params instanceof ColorStop && this.actions.push({
			method: apiName,
			data: [params.type, params.data, params.colorStop]
		});
	} : apiName === 'setGlobalAlpha' ? Context.prototype[apiName] = function () {
		var data = [].slice.apply(arguments, [0, 1]);
		data[0] = Math.floor(255 * parseFloat(data[0]));
		this.actions.push({
			method: apiName,
			data: data
		});
	} : apiName == 'setShadow' ? Context.prototype[apiName] = function () {
		var data = [].slice.apply(arguments, [0, 4]);
		data[3] = parseColorValue(data[3]);
		this.actions.push({
			method: apiName,
			data: data
		});
	} : Context.prototype[apiName] = function () {
		this.actions.push({
			method: apiName,
			data: [].slice.apply(arguments, [0, 1])
		});
	};
});

exports.default = {
	notifyCurrentRoutetoContext: notifyCurrentRoutetoContext,
	Context: Context
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _context = __webpack_require__(13);

var _context2 = _interopRequireDefault(_context);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _EventEmitter = __webpack_require__(15);

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function canvasDesString(webviewID, canvasId) {
	return webviewID + 'canvas' + canvasId;
}

function clearOldWebviewCanvas() {
	for (var key in canvasIDs) {
		if (key.indexOf(webviewID + 'canvas') == 0) {
			canvasIDs[key];
			delete canvasIDs[key];
		}
	}
}

function notifyWebviewIdtoCanvas(e) {
	webviewID = e;
}

function invokeDrawCanvas(canvasId, actions) {
	var reserve = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
	/*
 	  success = arguments[3],
 	  fail = arguments[4],
 	  complte = arguments[5],
 	  platform = utils.getPlatform();
   "ios" == platform || "android" == platform ?
 	  ServiceJSBridge.invoke("drawCanvas", {
 		  canvasId: canvasId,
 		  reserve: reserve,
 		  actions: actions
 	  },
 	  function (e) {
 		  e.errMsg && /ok/.test(e.errMsg) ?
 		  "function" == typeof success && success(e) :
 		  "function" == typeof fail && fail(e)
 		  "function" == typeof complte && complte(e)
 	  }) :
  */
	ServiceJSBridge.publish('canvas' + canvasId + 'actionsChanged', { actions: actions, reserve: reserve }, [webviewID]);
}

function drawCanvas(params) {
	var canvasId = params.canvasId,
	    actions = params.actions,
	    reserve = params.reserve,
	    success = params.success,
	    fail = params.fail,
	    complete = params.complete;
	if (canvasId && Array.isArray(actions)) {
		var key = canvasDesString(webviewID, canvasId);
		if (typeof canvasIDs[key] === 'number') {
			var canvasId = canvasIDs[key];
			invokeDrawCanvas(canvasId, actions, reserve, success, fail, complete);
		} else {
			canvasOptions[key] = canvasOptions[key] || [];
			canvasOptions[key] = canvasOptions[key].concat({
				actions: actions,
				reserve: reserve,
				success: success,
				fail: fail,
				complete: complete
			});
		}
	}
}

function canvasToTempFilePathImpl(obj) {
	ServiceJSBridge.subscribe('onCanvasToDataUrl_' + obj.canvasId, function (params) {
		var dataUrl = params.dataUrl;
		_bridge2.default.invokeMethod('base64ToTempFilePath', _utils2.default.assign({ base64Data: dataUrl }, obj), {
			beforeAll: function beforeAll(res) {
				res.errMsg = res.errMsg.replace('base64ToTempFilePath', 'canvasToTempFilePath');
			}
		});
	});
	_bridge2.default.publish('invokeCanvasToDataUrl_' + obj.canvasId, {
		canvasId: obj.canvasId
	}, [webviewID]);
}

function canvasToTempFilePath(obj) {
	if (obj.canvasId) {
		var key = canvasDesString(webviewID, obj.canvasId);
		if (typeof canvasIDs[key] === 'number') {
			obj.canvasId = canvasIDs[key];
			canvasToTempFilePathImpl(obj);
		} else {
			var res = {
				errMsg: 'canvasToTempFilePath: fail canvas is empty'
			};
			typeof obj.fail === 'function' && obj.fail(res), typeof obj.complete === 'function' && obj.complete(res);
		}
	}
}

var webviewID = (new _EventEmitter2.default.EventEmitter2(), 0),
    canvasInfo = {},
    canvasIDs = {},
    canvasOptions = {};

ServiceJSBridge.subscribe('canvasInsert', function (event, t) {
	var canvasId = event.canvasId,
	    canvasNumber = event.canvasNumber,
	    data = event.data,
	    key = canvasDesString(webviewID, canvasId);

	canvasInfo[canvasNumber] = {
		lastTouches: [],
		data: data
	};

	canvasIDs[key] = canvasIDs[key] || canvasNumber;

	Array.isArray(canvasOptions[key]) && (canvasOptions[key].forEach(function (e) {
		invokeDrawCanvas(canvasNumber, e.actions, e.reserve, e.success, e.fail, e.complete);
	}), delete canvasOptions[key]);
});

ServiceJSBridge.subscribe('canvasRemove', function (params, t) {
	var canvasId = params.canvasId,
	    canvasIndex = canvasDesString(webviewID, canvasId);
	canvasIDs[canvasIndex] && delete canvasIDs[canvasIndex];
});

var createContext = function createContext() {
	return new _context2.default.Context();
},
    createCanvasContext = function createCanvasContext(e) {
	return new _context2.default.Context(e);
};

exports.default = {
	canvasInfo: canvasInfo,
	clearOldWebviewCanvas: clearOldWebviewCanvas,
	notifyWebviewIdtoCanvas: notifyWebviewIdtoCanvas,
	drawCanvas: drawCanvas,
	canvasToTempFilePath: canvasToTempFilePath,
	createContext: createContext,
	createCanvasContext: createCanvasContext
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
	return Object.prototype.toString.call(obj) === "[object Array]";
};
var defaultMaxListeners = 10;

function init() {
	this._events = {};
	if (this._conf) {
		configure.call(this, this._conf);
	}
}

function configure(conf) {
	if (conf) {
		this._conf = conf;

		conf.delimiter && (this.delimiter = conf.delimiter);
		this._maxListeners = conf.maxListeners !== undefined ? conf.maxListeners : defaultMaxListeners;

		conf.wildcard && (this.wildcard = conf.wildcard);
		conf.newListener && (this.newListener = conf.newListener);
		conf.verboseMemoryLeak && (this.verboseMemoryLeak = conf.verboseMemoryLeak);

		if (this.wildcard) {
			this.listenerTree = {};
		}
	} else {
		this._maxListeners = defaultMaxListeners;
	}
}

function logPossibleMemoryLeak(count, eventName) {
	var errorMsg = '(node) warning: possible EventEmitter memory ' + 'leak detected. ' + count + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.';

	if (this.verboseMemoryLeak) {
		errorMsg += ' Event name: ' + eventName + '.';
	}

	if (typeof process !== 'undefined' && process.emitWarning) {
		var e = new Error(errorMsg);
		e.name = 'MaxListenersExceededWarning';
		e.emitter = this;
		e.count = count;
		process.emitWarning(e);
	} else {
		console.error(errorMsg);

		if (console.trace) {
			console.trace();
		}
	}
}

function EventEmitter(conf) {
	this._events = {};
	this.newListener = false;
	this.verboseMemoryLeak = false;
	configure.call(this, conf);
}

EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

//
// Attention, function return type now is array, always !
// It has zero elements if no any matches found and one or more
// elements (leafs) if there are matches
//
function searchListenerTree(handlers, type, tree, i) {
	if (!tree) {
		return [];
	}
	var listeners = [],
	    leaf,
	    len,
	    branch,
	    xTree,
	    xxTree,
	    isolatedBranch,
	    endReached,
	    typeLength = type.length,
	    currentType = type[i],
	    nextType = type[i + 1];
	if (i === typeLength && tree._listeners) {
		//
		// If at the end of the event(s) list and the tree has listeners
		// invoke those listeners.
		//
		if (typeof tree._listeners === 'function') {
			handlers && handlers.push(tree._listeners);
			return [tree];
		} else {
			for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
				handlers && handlers.push(tree._listeners[leaf]);
			}
			return [tree];
		}
	}

	if (currentType === '*' || currentType === '**' || tree[currentType]) {
		//
		// If the event emitted is '*' at this part
		// or there is a concrete match at this patch
		//
		if (currentType === '*') {
			for (branch in tree) {
				if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
					listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i + 1));
				}
			}
			return listeners;
		} else if (currentType === '**') {
			endReached = i + 1 === typeLength || i + 2 === typeLength && nextType === '*';
			if (endReached && tree._listeners) {
				// The next element has a _listeners, add it to the handlers.
				listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
			}

			for (branch in tree) {
				if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
					if (branch === '*' || branch === '**') {
						if (tree[branch]._listeners && !endReached) {
							listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
						}
						listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
					} else if (branch === nextType) {
						listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i + 2));
					} else {
						// No match on this one, shift into the tree but not in the type array.
						listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
					}
				}
			}
			return listeners;
		}

		listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i + 1));
	}

	xTree = tree['*'];
	if (xTree) {
		//
		// If the listener tree will allow any match for this part,
		// then recursively explore all branches of the tree
		//
		searchListenerTree(handlers, type, xTree, i + 1);
	}

	xxTree = tree['**'];
	if (xxTree) {
		if (i < typeLength) {
			if (xxTree._listeners) {
				// If we have a listener on a '**', it will catch all, so add its handler.
				searchListenerTree(handlers, type, xxTree, typeLength);
			}

			// Build arrays of matching next branches and others.
			for (branch in xxTree) {
				if (branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
					if (branch === nextType) {
						// We know the next element will match, so jump twice.
						searchListenerTree(handlers, type, xxTree[branch], i + 2);
					} else if (branch === currentType) {
						// Current node matches, move into the tree.
						searchListenerTree(handlers, type, xxTree[branch], i + 1);
					} else {
						isolatedBranch = {};
						isolatedBranch[branch] = xxTree[branch];
						searchListenerTree(handlers, type, { '**': isolatedBranch }, i + 1);
					}
				}
			}
		} else if (xxTree._listeners) {
			// We have reached the end and still on a '**'
			searchListenerTree(handlers, type, xxTree, typeLength);
		} else if (xxTree['*'] && xxTree['*']._listeners) {
			searchListenerTree(handlers, type, xxTree['*'], typeLength);
		}
	}

	return listeners;
}

function growListenerTree(type, listener) {

	type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

	//
	// Looks for two consecutive '**', if so, don't add the event at all.
	//
	for (var i = 0, len = type.length; i + 1 < len; i++) {
		if (type[i] === '**' && type[i + 1] === '**') {
			return;
		}
	}

	var tree = this.listenerTree;
	var name = type.shift();

	while (name !== undefined) {

		if (!tree[name]) {
			tree[name] = {};
		}

		tree = tree[name];

		if (type.length === 0) {

			if (!tree._listeners) {
				tree._listeners = listener;
			} else {
				if (typeof tree._listeners === 'function') {
					tree._listeners = [tree._listeners];
				}

				tree._listeners.push(listener);

				if (!tree._listeners.warned && this._maxListeners > 0 && tree._listeners.length > this._maxListeners) {
					tree._listeners.warned = true;
					logPossibleMemoryLeak.call(this, tree._listeners.length, name);
				}
			}
			return true;
		}
		name = type.shift();
	}
	return true;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.

EventEmitter.prototype.delimiter = '.';

EventEmitter.prototype.setMaxListeners = function (n) {
	if (n !== undefined) {
		this._maxListeners = n;
		if (!this._conf) this._conf = {};
		this._conf.maxListeners = n;
	}
};

EventEmitter.prototype.event = '';

EventEmitter.prototype.once = function (event, fn) {
	return this._once(event, fn, false);
};

EventEmitter.prototype.prependOnceListener = function (event, fn) {
	return this._once(event, fn, true);
};

EventEmitter.prototype._once = function (event, fn, prepend) {
	this._many(event, 1, fn, prepend);
	return this;
};

EventEmitter.prototype.many = function (event, ttl, fn) {
	return this._many(event, ttl, fn, false);
};

EventEmitter.prototype.prependMany = function (event, ttl, fn) {
	return this._many(event, ttl, fn, true);
};

EventEmitter.prototype._many = function (event, ttl, fn, prepend) {
	var self = this;

	if (typeof fn !== 'function') {
		throw new Error('many only accepts instances of Function');
	}

	function listener() {
		if (--ttl === 0) {
			self.off(event, listener);
		}
		return fn.apply(this, arguments);
	}

	listener._origin = fn;

	this._on(event, listener, prepend);

	return self;
};

EventEmitter.prototype.emit = function () {

	this._events || init.call(this);

	var type = arguments[0];

	if (type === 'newListener' && !this.newListener) {
		if (!this._events.newListener) {
			return false;
		}
	}

	var al = arguments.length;
	var args, l, i, j;
	var handler;

	if (this._all && this._all.length) {
		handler = this._all.slice();
		if (al > 3) {
			args = new Array(al);
			for (j = 0; j < al; j++) {
				args[j] = arguments[j];
			}
		}

		for (i = 0, l = handler.length; i < l; i++) {
			this.event = type;
			switch (al) {
				case 1:
					handler[i].call(this, type);
					break;
				case 2:
					handler[i].call(this, type, arguments[1]);
					break;
				case 3:
					handler[i].call(this, type, arguments[1], arguments[2]);
					break;
				default:
					handler[i].apply(this, args);
			}
		}
	}

	if (this.wildcard) {
		handler = [];
		var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
		searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	} else {
		handler = this._events[type];
		if (typeof handler === 'function') {
			this.event = type;
			switch (al) {
				case 1:
					handler.call(this);
					break;
				case 2:
					handler.call(this, arguments[1]);
					break;
				case 3:
					handler.call(this, arguments[1], arguments[2]);
					break;
				default:
					args = new Array(al - 1);
					for (j = 1; j < al; j++) {
						args[j - 1] = arguments[j];
					}handler.apply(this, args);
			}
			return true;
		} else if (handler) {
			// need to make copy of handlers because list can change in the middle
			// of emit call
			handler = handler.slice();
		}
	}

	if (handler && handler.length) {
		if (al > 3) {
			args = new Array(al - 1);
			for (j = 1; j < al; j++) {
				args[j - 1] = arguments[j];
			}
		}
		for (i = 0, l = handler.length; i < l; i++) {
			this.event = type;
			switch (al) {
				case 1:
					handler[i].call(this);
					break;
				case 2:
					handler[i].call(this, arguments[1]);
					break;
				case 3:
					handler[i].call(this, arguments[1], arguments[2]);
					break;
				default:
					handler[i].apply(this, args);
			}
		}
		return true;
	} else if (!this._all && type === 'error') {
		if (arguments[1] instanceof Error) {
			throw arguments[1]; // Unhandled 'error' event
		} else {
			throw new Error("Uncaught, unspecified 'error' event.");
		}
		return false;
	}

	return !!this._all;
};

EventEmitter.prototype.emitAsync = function () {

	this._events || init.call(this);

	var type = arguments[0];

	if (type === 'newListener' && !this.newListener) {
		if (!this._events.newListener) {
			return Promise.resolve([false]);
		}
	}

	var promises = [];

	var al = arguments.length;
	var args, l, i, j;
	var handler;

	if (this._all) {
		if (al > 3) {
			args = new Array(al);
			for (j = 1; j < al; j++) {
				args[j] = arguments[j];
			}
		}
		for (i = 0, l = this._all.length; i < l; i++) {
			this.event = type;
			switch (al) {
				case 1:
					promises.push(this._all[i].call(this, type));
					break;
				case 2:
					promises.push(this._all[i].call(this, type, arguments[1]));
					break;
				case 3:
					promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
					break;
				default:
					promises.push(this._all[i].apply(this, args));
			}
		}
	}

	if (this.wildcard) {
		handler = [];
		var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
		searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	} else {
		handler = this._events[type];
	}

	if (typeof handler === 'function') {
		this.event = type;
		switch (al) {
			case 1:
				promises.push(handler.call(this));
				break;
			case 2:
				promises.push(handler.call(this, arguments[1]));
				break;
			case 3:
				promises.push(handler.call(this, arguments[1], arguments[2]));
				break;
			default:
				args = new Array(al - 1);
				for (j = 1; j < al; j++) {
					args[j - 1] = arguments[j];
				}promises.push(handler.apply(this, args));
		}
	} else if (handler && handler.length) {
		handler = handler.slice();
		if (al > 3) {
			args = new Array(al - 1);
			for (j = 1; j < al; j++) {
				args[j - 1] = arguments[j];
			}
		}
		for (i = 0, l = handler.length; i < l; i++) {
			this.event = type;
			switch (al) {
				case 1:
					promises.push(handler[i].call(this));
					break;
				case 2:
					promises.push(handler[i].call(this, arguments[1]));
					break;
				case 3:
					promises.push(handler[i].call(this, arguments[1], arguments[2]));
					break;
				default:
					promises.push(handler[i].apply(this, args));
			}
		}
	} else if (!this._all && type === 'error') {
		if (arguments[1] instanceof Error) {
			return Promise.reject(arguments[1]); // Unhandled 'error' event
		} else {
			return Promise.reject("Uncaught, unspecified 'error' event.");
		}
	}

	return Promise.all(promises);
};

EventEmitter.prototype.on = function (type, listener) {
	return this._on(type, listener, false);
};

EventEmitter.prototype.prependListener = function (type, listener) {
	return this._on(type, listener, true);
};

EventEmitter.prototype.onAny = function (fn) {
	return this._onAny(fn, false);
};

EventEmitter.prototype.prependAny = function (fn) {
	return this._onAny(fn, true);
};

EventEmitter.prototype.addListener = EventEmitter.prototype.on;

EventEmitter.prototype._onAny = function (fn, prepend) {
	if (typeof fn !== 'function') {
		throw new Error('onAny only accepts instances of Function');
	}

	if (!this._all) {
		this._all = [];
	}

	// Add the function to the event listener collection.
	if (prepend) {
		this._all.unshift(fn);
	} else {
		this._all.push(fn);
	}

	return this;
};

EventEmitter.prototype._on = function (type, listener, prepend) {
	if (typeof type === 'function') {
		this._onAny(type, listener);
		return this;
	}

	if (typeof listener !== 'function') {
		throw new Error('on only accepts instances of Function');
	}
	this._events || init.call(this);

	// To avoid recursion in the case that type == "newListeners"! Before
	// adding it to the listeners, first emit "newListeners".
	this.emit('newListener', type, listener);

	if (this.wildcard) {
		growListenerTree.call(this, type, listener);
		return this;
	}

	if (!this._events[type]) {
		// Optimize the case of one listener. Don't need the extra array object.
		this._events[type] = listener;
	} else {
		if (typeof this._events[type] === 'function') {
			// Change to array.
			this._events[type] = [this._events[type]];
		}

		// If we've already got an array, just add
		if (prepend) {
			this._events[type].unshift(listener);
		} else {
			this._events[type].push(listener);
		}

		// Check for listener leak
		if (!this._events[type].warned && this._maxListeners > 0 && this._events[type].length > this._maxListeners) {
			this._events[type].warned = true;
			logPossibleMemoryLeak.call(this, this._events[type].length, type);
		}
	}

	return this;
};

EventEmitter.prototype.off = function (type, listener) {
	if (typeof listener !== 'function') {
		throw new Error('removeListener only takes instances of Function');
	}

	var handlers,
	    leafs = [];

	if (this.wildcard) {
		var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
		leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
	} else {
		// does not use listeners(), so no side effect of creating _events[type]
		if (!this._events[type]) return this;
		handlers = this._events[type];
		leafs.push({ _listeners: handlers });
	}

	for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
		var leaf = leafs[iLeaf];
		handlers = leaf._listeners;
		if (isArray(handlers)) {

			var position = -1;

			for (var i = 0, length = handlers.length; i < length; i++) {
				if (handlers[i] === listener || handlers[i].listener && handlers[i].listener === listener || handlers[i]._origin && handlers[i]._origin === listener) {
					position = i;
					break;
				}
			}

			if (position < 0) {
				continue;
			}

			if (this.wildcard) {
				leaf._listeners.splice(position, 1);
			} else {
				this._events[type].splice(position, 1);
			}

			if (handlers.length === 0) {
				if (this.wildcard) {
					delete leaf._listeners;
				} else {
					delete this._events[type];
				}
			}

			this.emit("removeListener", type, listener);

			return this;
		} else if (handlers === listener || handlers.listener && handlers.listener === listener || handlers._origin && handlers._origin === listener) {
			if (this.wildcard) {
				delete leaf._listeners;
			} else {
				delete this._events[type];
			}

			this.emit("removeListener", type, listener);
		}
	}

	function recursivelyGarbageCollect(root) {
		if (root === undefined) {
			return;
		}
		var keys = Object.keys(root);
		for (var i in keys) {
			var key = keys[i];
			var obj = root[key];
			if (obj instanceof Function || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== "object" || obj === null) continue;
			if (Object.keys(obj).length > 0) {
				recursivelyGarbageCollect(root[key]);
			}
			if (Object.keys(obj).length === 0) {
				delete root[key];
			}
		}
	}

	recursivelyGarbageCollect(this.listenerTree);

	return this;
};

EventEmitter.prototype.offAny = function (fn) {
	var i = 0,
	    l = 0,
	    fns;
	if (fn && this._all && this._all.length > 0) {
		fns = this._all;
		for (i = 0, l = fns.length; i < l; i++) {
			if (fn === fns[i]) {
				fns.splice(i, 1);
				this.emit("removeListenerAny", fn);
				return this;
			}
		}
	} else {
		fns = this._all;
		for (i = 0, l = fns.length; i < l; i++) {
			this.emit("removeListenerAny", fns[i]);
		}this._all = [];
	}
	return this;
};

EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

EventEmitter.prototype.removeAllListeners = function (type) {
	if (arguments.length === 0) {
		!this._events || init.call(this);
		return this;
	}

	if (this.wildcard) {
		var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
		var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

		for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
			var leaf = leafs[iLeaf];
			leaf._listeners = null;
		}
	} else if (this._events) {
		this._events[type] = null;
	}
	return this;
};

EventEmitter.prototype.listeners = function (type) {
	if (this.wildcard) {
		var handlers = [];
		var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
		searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
		return handlers;
	}

	this._events || init.call(this);

	if (!this._events[type]) this._events[type] = [];
	if (!isArray(this._events[type])) {
		this._events[type] = [this._events[type]];
	}
	return this._events[type];
};

EventEmitter.prototype.eventNames = function () {
	return Object.keys(this._events);
};

EventEmitter.prototype.listenerCount = function (type) {
	return this.listeners(type).length;
};

EventEmitter.prototype.listenersAny = function () {

	if (this._all) {
		return this._all;
	} else {
		return [];
	}
};

exports.default = EventEmitter;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// last socket, to keep compatible with wx 1.7.0

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lastSocket = null;

var SocketTask_js = function () {
	_createClass(SocketTask_js, null, [{
		key: 'getLastTask',
		value: function getLastTask() {
			return lastSocket;
		}
	}]);

	function SocketTask_js(params) {
		var _this = this;

		_classCallCheck(this, SocketTask_js);

		// save instance for last
		lastSocket = this;

		// save url
		this.url = params.url;

		// callbacks
		this.messageCallbacks = [];
		this.openCallbacks = [];
		this.errorCallbacks = [];
		this.closeCallbacks = [];

		// new socket
		this.ws = new WebSocket(this.url, 'protocolOne');
		this.ws.onopen = function (e) {
			_this.openCallbacks.forEach(function (fn) {
				// TODO header怎么获取?
				fn({
					header: {}
				});
			});
		};
		this.ws.onerror = function (e) {
			_this.errorCallbacks.forEach(function (fn) {
				fn({
					errMsg: e ? e.toString() : 'unknown error'
				});
			});
		};
		this.ws.onclose = function (e) {
			_this.closeCallbacks.forEach(function (fn) {
				fn({
					code: e.code,
					reason: e.reason
				});
			});
		};
		this.ws.onmessage = function (e) {
			_this.messageCallbacks.forEach(function (fn) {
				fn({
					data: e.data
				});
			});
		};
	}

	_createClass(SocketTask_js, [{
		key: 'close',
		value: function close(code, reason) {
			// clear first socket instance
			if (lastSocket == this) {
				lastSocket = null;
			}

			// close
			this.ws.close(code, reason);
		}
	}, {
		key: 'send',
		value: function send(params) {
			params = params || {};
			try {
				this.ws.send(params.data);
				if (params.success) {
					params.success();
				}
			} catch (e) {
				if (params.fail) {
					params.fail();
				}
			}
			if (params.complete) {
				params.complete();
			}
		}
	}, {
		key: 'onMessage',
		value: function onMessage(fn) {
			if (fn) {
				this.messageCallbacks.push(fn);
			} else {
				this.messageCallbacks.splice(0, this.messageCallbacks.length);
			}
		}
	}, {
		key: 'offMessage',
		value: function offMessage(fn) {
			if (fn) {
				var idx = this.messageCallbacks.indexOf(fn);
				if (idx != -1) {
					this.messageCallbacks.splice(idx, 1);
				}
			} else {
				this.messageCallbacks.splice(0, this.messageCallbacks.length);
			}
		}
	}, {
		key: 'onOpen',
		value: function onOpen(fn) {
			if (fn) {
				this.openCallbacks.push(fn);
			} else {
				this.openCallbacks.splice(0, this.openCallbacks.length);
			}
		}
	}, {
		key: 'offOpen',
		value: function offOpen(fn) {
			if (fn) {
				var idx = this.openCallbacks.indexOf(fn);
				if (idx != -1) {
					this.openCallbacks.splice(idx, 1);
				}
			} else {
				this.openCallbacks.splice(0, this.openCallbacks.length);
			}
		}
	}, {
		key: 'onClose',
		value: function onClose(fn) {
			if (fn) {
				this.closeCallbacks.push(fn);
			} else {
				this.closeCallbacks.splice(0, this.closeCallbacks.length);
			}
		}
	}, {
		key: 'offClose',
		value: function offClose(fn) {
			if (fn) {
				var idx = this.closeCallbacks.indexOf(fn);
				if (idx != -1) {
					this.closeCallbacks.splice(idx, 1);
				}
			} else {
				this.closeCallbacks.splice(0, this.closeCallbacks.length);
			}
		}
	}, {
		key: 'onError',
		value: function onError(fn) {
			if (fn) {
				this.errorCallbacks.push(fn);
			} else {
				this.errorCallbacks.splice(0, this.errorCallbacks.length);
			}
		}
	}, {
		key: 'offError',
		value: function offError(fn) {
			if (fn) {
				var idx = this.errorCallbacks.indexOf(fn);
				if (idx != -1) {
					this.errorCallbacks.splice(idx, 1);
				}
			} else {
				this.errorCallbacks.splice(0, this.errorCallbacks.length);
			}
		}
	}]);

	return SocketTask_js;
}();

exports.default = SocketTask_js;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var MGCScene = {};

Object.defineProperties(MGCScene, {
	MAIN: { value: 1001, writable: false }, // 发现栏小程序主入口
	TOP_SEARCH_RESULT: { value: 1005, writable: false }, // 顶部搜索框的搜索结果页
	DISCOVERY_SEARCH_RESULT: { value: 1006, writable: false }, // 发现栏小程序主入口搜索框的搜索结果页
	CHAT_SHARE: { value: 1007, writable: false }, // 单人聊天会话中的小程序消息卡片
	GROUP_SHARE: { value: 1008, writable: false }, // 群聊会话中的小程序消息卡片
	QRCODE: { value: 1011, writable: false }, // 扫描二维码
	LONG_PRESS_QRCODE: { value: 1012, writable: false }, // 长按图片识别二维码
	ALBUM_QRCODE: { value: 1013, writable: false }, // 手机相册选取二维码
	TEMPLATE: { value: 1014, writable: false }, // 小程序模版消息
	TRIAL: { value: 1017, writable: false }, // 前往体验版的入口页
	WALLET: { value: 1019, writable: false }, // 微信钱包
	PUBLIC_PROFILE: { value: 1020, writable: false }, // 公众号 profile 页相关小程序列表
	CHAT_TOP: { value: 1022, writable: false }, // 聊天顶部置顶小程序入口
	ANDROID_DESKTOP: { value: 1023, writable: false }, // 安卓系统桌面图标
	APP_PROFILE: { value: 1024, writable: false }, // 小程序 profile 页
	BAR_CODE: { value: 1025, writable: false }, // 扫描一维码
	ADJACENT_APP: { value: 1026, writable: false }, // 附近小程序列表
	USED_APP: { value: 1027, writable: false }, // 顶部搜索框搜索结果页“使用过的小程序”列表
	CARD_BAG: { value: 1028, writable: false }, // 我的卡包
	CARD_DETAIL: { value: 1029, writable: false }, // 卡券详情页
	AUTOMATION_TEST: { value: 1030, writable: false }, // 自动化测试下打开小程序
	LONG_PRESS_BARCODE: { value: 1031, writable: false }, // 长按图片识别一维码
	ALBUM_BARCODE: { value: 1032, writable: false }, // 手机相册选取一维码
	PAYMENT_RESULT: { value: 1034, writable: false }, // 微信支付完成页
	PUBLIC_MENU: { value: 1035, writable: false }, // 公众号自定义菜单
	APP_SHARE: { value: 1036, writable: false }, // App 分享消息卡片
	APP_JUMP: { value: 1037, writable: false }, // 小程序打开小程序
	APP_RETURN: { value: 1038, writable: false }, // 从另一个小程序返回
	SHAKE_TV: { value: 1039, writable: false }, // 摇电视
	FRIEND_SEARCH_RESULT: { value: 1042, writable: false }, // 添加好友搜索框的搜索结果页
	PUBLIC_TEMPLATE: { value: 1043, writable: false }, // 公众号模板消息
	SHARE_TICKET_APP: { value: 1044, writable: false }, // 带 shareTicket 的小程序消息卡片
	APP_CODE: { value: 1047, writable: false }, // 扫描小程序码
	LONG_PRESS_APP_CODE: { value: 1048, writable: false }, // 长按图片识别小程序码
	ALBUM_APP_CODE: { value: 1049, writable: false }, // 手机相册选取小程序码
	CARD_MERCHANTS: { value: 1052, writable: false }, // 卡券的适用门店列表
	SEARCH_LIST: { value: 1053, writable: false }, // 搜一搜的结果页
	SEARCH_RESULT_SHORTCUT: { value: 1054, writable: false }, // 顶部搜索框小程序快捷入口
	MUSIC_PLAYER: { value: 1056, writable: false }, // 音乐播放器菜单
	PUBLIC_ARTICLE: { value: 1058, writable: false }, // 公众号文章
	TRIAL_INVITE: { value: 1059, writable: false }, // 体验版小程序绑定邀请页
	WIFI_STATUS_BAR: { value: 1064, writable: false }, // 微信连Wifi状态栏
	PUBLIC_AD: { value: 1067, writable: false }, // 公众号文章广告
	ADJACENT_APP_AD: { value: 1068, writable: false }, // 附近小程序列表广告
	BARCODE_INCOME: { value: 1072, writable: false }, // 二维码收款页面
	CUSTOM_SERVICE_SHARE: { value: 1073, writable: false }, // 客服消息列表下发的小程序消息卡片
	PUBLIC__SHARE: { value: 1074, writable: false } // 公众号会话下发的小程序消息卡片
});

window.MGCScene = MGCScene;
exports.default = MGCScene;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(20);

__webpack_require__(9);

__webpack_require__(21);

__webpack_require__(22);

__webpack_require__(23);

__webpack_require__(27);

__webpack_require__(92);

__webpack_require__(93);

__webpack_require__(98);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 在 iOS 上，小程序的 javascript 代码是运行在 JavaScriptCore 中，是由 WKWebView 来渲染的，环境有 iOS8、iOS9、iOS10
// 在 Android 上，小程序的 javascript 代码是通过 X5 JSCore来解析，是由 X5 基于 Mobile Chrome 37 内核来渲染的
// 在 开发工具上， 小程序的 javascript 代码是运行在 nwjs 中，是由 Chrome Webview 来渲染的

!function (global) {
	// ServiceJSBridge 对象兼容层
	if (typeof logxx === 'function' && logxx('service jsbridge start'), !global.ServiceJSBridge) {
		var hasDocument = global.hasOwnProperty('document'),
		    isIOS = !1,
		    callbacks = {},
		    callbackIndex = 0,
		    defaultEventHandlers = {},
		    eventPrefix = 'custom_event_',
		    handlers = {},
		    PROTOCAL = 'leto',
		    IFRAME_PREFIX = 'hybridjsbrige_';
		if (hasDocument) {
			var userAgent = global.navigator.userAgent,
			    isAndroid = userAgent.indexOf('Android') != -1;
			isIOS = !isAndroid;
		}
		var postMessage = function postMessage(event, paramsString, callbackId, sync) {
			// if no native bridge, return
			var hasNative = !!(isIOS ? global.webkit && global.wekit.messageHandlers && global.webkit.messageHandlers.invokeHandler : window.AndroidJSCore);
			if (!hasNative) {
				return;
			}

			// postMessage
			if (isIOS) {
				global.webkit.messageHandlers.invokeHandler.postMessage({
					C: event,
					paramsString: paramsString,
					callbackId: callbackId
				});
			} else {
				var jsCoreHandleResult = AndroidJSCore.invokeHandler(event, paramsString, callbackId, sync);
				if (typeof jsCoreHandleResult !== 'undefined' && typeof callbacks[callbackId] === 'function' && jsCoreHandleResult !== '') {
					try {
						jsCoreHandleResult = JSON.parse(jsCoreHandleResult);
					} catch (e) {
						jsCoreHandleResult = {};
					}
					callbacks[callbackId](jsCoreHandleResult), delete callbacks[callbackId];
				}
			}
		},
		    createIframe = function createIframe(uri, sid) {
			var iframe = document.createElement('iframe'),
			    iframeId = IFRAME_PREFIX + sid;
			iframe.style.display = 'none';
			iframe.setAttribute('id', iframeId);
			iframe.setAttribute('frameborder', '0');
			iframe.setAttribute('src', uri);
			document.documentElement.appendChild(iframe);
			// this.messageIframe = messageIframe
		},
		    retrieveIframe = function retrieveIframe(sid) {
			var iframeId = IFRAME_PREFIX + sid,
			    iframe = document.querySelector('#' + iframeId);
			if (iframe) {
				document.documentElement.removeChild(iframe);
			}
		},
		    publishHandler = function publishHandler(event, paramsString, webviewIds) {
			// if no native bridge, return
			var hasNative = !!(isIOS ? global.webkit && global.wekit.messageHandlers && global.webkit.messageHandlers.invokeHandler : window.AndroidJSCore);
			if (!hasNative) {
				return;
			}

			// publishHandler
			isIOS ? global.webkit.messageHandlers.publishHandler.postMessage({
				event: event,
				paramsString: paramsString,
				webviewIds: webviewIds
			}) : AndroidJSCore.publishHandler(event, paramsString, webviewIds);
		},
		    invoke = function invoke(event, params, callback) {
			// postMessage
			params = params || {};
			var paramsString = JSON.stringify(params),
			    callbackId = ++callbackIndex;
			callbacks[callbackId] = callback;
			postMessage(event, paramsString, callbackId, !!params.sync);
		},
		    invokeCallbackHandler = function invokeCallbackHandler(callbackId, params) {
			// for some binary callback, we encoded binary data to base64 to avoid wrong interpret
			// so if there is a base64 field and it is true, we need decode it into a array buffer
			if (params.base64 && params.data) {
				params.data = _utils2.default.base64ToArrayBuffer(params.data);
			}

			// callback
			var callback = callbacks[callbackId];
			typeof callback === 'function' && callback(params), delete callbacks[callbackId];
			if (isIOS) retrieveIframe(callbackId);
		},
		    oldCallbackHandler = function oldCallbackHandler(data) {
			// {"bridgeParam":{"action":"call","callbackID":"1468927578039","status":{"status_code":-5,"status_reason":"'module' or 'identifier' is unsupported."}}}
			if (data) {
				if (typeof data === 'string') {
					data = _utils2.default.parseData(data);
				}
				var callbackId = data.bridgeParam.callbackID;
				// 延迟是为了避免：
				// 在 ios 中，如果 onComplete 回调中有 alert 等有阻塞作用的代码时，会导致页面“卡死”（Native UI层级覆盖导致点击无效）
				if (callbackId) {
					setTimeout(function () {
						invokeCallbackHandler(callbackId, data.param);
					}, 1);
				}
			}
		},
		    publishCallbackHandler = function publishCallbackHandler(callbackId) {
			if (isIOS) retrieveIframe(callbackId);
		},
		    on = function on(eventName, handler) {
			defaultEventHandlers[eventName] = handler;
		},
		    publish = function publish(eventName, params, webviewIds) {
			// publishHandler
			webviewIds = webviewIds || [];
			var paramsString,
			    event = eventPrefix + eventName;

			paramsString = JSON.stringify(params);
			webviewIds = JSON.stringify(webviewIds);
			publishHandler(event, paramsString, webviewIds);
		},
		    subscribe = function subscribe(eventName, handler) {
			handlers[eventPrefix + eventName] = handler;
		},
		    subscribeHandler = function subscribeHandler(eventName, data, webviewId, reportParams) {
			// 执行注册的回调
			var handler = eventName.indexOf(eventPrefix) != -1 ? handlers[eventName] : defaultEventHandlers[eventName];
			if (typeof handler === 'function') {
				handler(data, webviewId, reportParams);
			}
		};
		global.ServiceJSBridge = {
			invoke: invoke,
			invokeCallbackHandler: invokeCallbackHandler,
			oldCallbackHandler: oldCallbackHandler,
			publishCallbackHandler: publishCallbackHandler,
			on: on,
			publish: publish,
			subscribe: subscribe,
			subscribeHandler: subscribeHandler
		};
		global.ViewJSBridge = global.ServiceJSBridge;
	}
}(window);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _errorType = __webpack_require__(24);

var errorType = _interopRequireWildcard(_errorType);

var _util = __webpack_require__(10);

var _util2 = _interopRequireDefault(_util);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var jsBridge = void 0,
    bridgeName = void 0,
    logEventName = void 0;
if (typeof ServiceJSBridge !== 'undefined') {
	jsBridge = window.ServiceJSBridge;
	bridgeName = 'Service';
	logEventName = 'H5_JS_SERVICE_ERR';
} else if (typeof ViewJSBridge !== 'undefined') {
	jsBridge = window.ViewJSBridge;
	bridgeName = 'Leto';
	logEventName = 'H5_JS_VIEW_ERR';
}
if (typeof __wxConfig === 'undefined') {
	var _wxConfig = typeof __wxConfig__ !== 'undefined' && __wxConfig__ || {};
}

function onBridgeReady(fn) {
	typeof jsBridge !== 'undefined' ? fn() : document.addEventListener(bridgeName + 'JSBridgeReady', fn, !1);
}

function invoke() {
	// invoke
	var args = arguments;
	onBridgeReady(function () {
		jsBridge.invoke.apply(jsBridge, args);
	});
}

function publish() {
	// publish
	var args = arguments;
	onBridgeReady(function () {
		jsBridge.publish.apply(jsBridge, args);
	});
}

function _reportKeyValue() {
	// 以key/value的形式上报日志
	!reportKeyValues || reportKeyValues.length <= 0 || (invoke('reportKeyValue', {
		dataArray: reportKeyValues
	}), reportKeyValues = []);
}

function _reportIDKey() {
	!reportIDKeys || reportIDKeys.length <= 0 || (invoke('reportIDKey', { dataArray: reportIDKeys }), reportIDKeys = []);
}

function systemLog() {
	!systemLogs || systemLogs.length <= 0 || (invoke('systemLog', { dataArray: systemLogs }), systemLogs = []);
}

function getPlatName() {
	// get platname
	return _const2.default.PLATFORM_DEVTOOLS;
}

function safeCall(fn) {
	//
	return function () {
		try {
			return fn.apply(fn, arguments);
		} catch (e) {
			console.error('reporter error:' + e.message);
		}
	};
}

function _defindGeter(key) {
	defineObj.__defineGetter__(key, function () {
		return safeCall(utils[key]);
	});
}

var reportIDKeyLength = 1,
    reportKeyValueLengthThreshold = 20,
    systemLogLength = 50,
    submitTLThreshold = 50,
    reportKeyTLThreshold = 50,
    reportIDKeyTLThreshold = 20,
    logTLThreshold = 50,
    speedReportThreshold = 500,
    slowReportThreshold = 500,
    errorReportTemp = 3,
    errorReportSize = 3,
    slowReportLength = 3,
    errorReportLength = 50,
    slowReportValueLength = 50,
    reportKeyValues = [],
    reportIDKeys = [],
    systemLogs = [],
    reportKeyTimePreTime = 0,
    reportIDKeyPreTime = 0,
    logPreTime = 0,
    submitPreTime = 0,
    slowReportTime = 0,
    speedReportMap = {},
    errorReportMap = {},
    slowReportMap = {};
var isIOS = getPlatName() === _const2.default.PLATFORM_IOS;
var errListenerFns = function errListenerFns() {};
var utils = {
	// log report obj
	surroundThirdByTryCatch: function surroundThirdByTryCatch(fn, ext) {
		return function () {
			var res;
			try {
				var startTime = Date.now();
				res = fn.apply(fn, arguments);
				var doTime = Date.now() - startTime;
				doTime > 1e3 && utils.slowReport({
					key: 'apiCallback',
					cost: doTime,
					extend: ext
				});
			} catch (e) {
				console.log(e);
				if (e.stack) {
					console.log(e.stack);
				}
				utils.thirdErrorReport({
					error: e,
					extend: ext
				});
			}
			return res;
		};
	},
	slowReport: function slowReport(params) {
		var key = params.key,
		    cost = params.cost,
		    extend = params.extend,
		    force = params.force,
		    slowValueType = errorType.SlowValueType[key],
		    now = Date.now();
		// 指定类型 强制或上报间隔大于＝指定阀值 extend类型数不超出阀值&当前extend上报数不超出阀值
		var flag = slowValueType && (force || !(now - slowReportTime < slowReportThreshold)) && !(Object.keys(slowReportMap).length > slowReportValueLength || (slowReportMap[extend] || (slowReportMap[extend] = 0), slowReportMap[extend]++, slowReportMap[extend] > slowReportLength));
		if (flag) {
			slowReportTime = now;
			var value = cost + ',' + encodeURIComponent(extend) + ',' + slowValueType;
			utils.reportKeyValue({
				key: 'Slow',
				value: value,
				force: !0
			});
		}
	},
	speedReport: function speedReport(params) {
		var key = params.key,
		    data = params.data,
		    timeMark = params.timeMark,
		    force = params.force,
		    SpeedValueType = errorType.SpeedValueType[key],
		    now = Date.now(),
		    dataLength = 0,
		    nativeTime = timeMark.nativeTime,
		    flag = SpeedValueType && (force || !(now - (speedReportMap[SpeedValueType] || 0) < speedReportThreshold)) && timeMark.startTime && timeMark.endTime && (SpeedValueType != 1 && SpeedValueType != 2 || nativeTime);
		if (flag) {
			data && (dataLength = JSON.stringify(data).length);
			speedReportMap[SpeedValueType] = now;
			var value = SpeedValueType + ',' + timeMark.startTime + ',' + nativeTime + ',' + nativeTime + ',' + timeMark.endTime + ',' + dataLength;
			utils.reportKeyValue({
				key: 'Speed',
				value: value,
				force: true
			});
		}
	},
	reportKeyValue: function reportKeyValue(params) {
		var key = params.key,
		    value = params.value,
		    force = params.force;
		errorType.KeyValueType[key] && (!force && Date.now() - reportKeyTimePreTime < reportKeyTLThreshold || (reportKeyTimePreTime = Date.now(), reportKeyValues.push({
			key: errorType.KeyValueType[key],
			value: value
		}), reportKeyValues.length >= reportKeyValueLengthThreshold && _reportKeyValue()));
	},
	reportIDKey: function reportIDKey(params) {
		var id = params.id,
		    key = params.key,
		    force = params.force;
		errorType.IDKeyType[key] && (!force && Date.now() - reportIDKeyPreTime < reportIDKeyTLThreshold || (reportIDKeyPreTime = Date.now(), reportIDKeys.push({
			id: id || isIOS ? '356' : '358',
			key: errorType.IDKeyType[key],
			value: 1
		}), reportIDKeys.length >= reportIDKeyLength && _reportIDKey()));
	},
	thirdErrorReport: function thirdErrorReport(params) {
		var error = params.error,
		    extend = params.extend;
		console.log(error);
		utils.errorReport({
			key: 'thirdScriptError',
			error: error,
			extend: extend
		});
	},
	errorReport: function errorReport(params) {
		var data = {},
		    error = params.error || {},
		    extend = params.extend;
		data.msg = extend ? error.message + ';' + extend : error.message;
		data.stack = error.stack;
		if (errorType.ErrorType[params.key]) {
			data.key = params.key;
		} else {
			data.key = 'unknowErr';
		}
		jsBridge.publish('H5_LOG_MSG', { event: logEventName, desc: data }, [params.webviewId || '']);
	},
	log: function log(_log, debug) {
		_log && typeof _log === 'string' && (!debug && Date.now() - logPreTime < logTLThreshold || (logPreTime = Date.now(), systemLogs.push(_log + ''), systemLogs.length >= systemLogLength && systemLog()));
	},
	submit: function submit() {
		Date.now() - submitPreTime < submitTLThreshold || (submitPreTime = Date.now(), _reportIDKey(), _reportKeyValue(), systemLog());
	},
	registerErrorListener: function registerErrorListener(fn) {
		typeof fn === 'function' && (errListenerFns = fn);
	},
	unRegisterErrorListener: function unRegisterErrorListener() {
		errListenerFns = function errListenerFns() {};
	},
	triggerErrorMessage: function triggerErrorMessage(params) {
		errListenerFns(params);
	}
};
var defineObj = {};
for (var key in utils) {
	_defindGeter(key);
}

typeof window !== 'undefined' && (window.onbeforeunload = function () {
	utils.submit();
});
window.Reporter = defineObj;
module.exports = defineObj;

// custom log method
var prodMode = process.env.NODE_ENV == 'production';
window.logxx = function (msg) {
	jsBridge.publish('H5_CONSOLE_LOG', { msg: msg }, ['']);
};
if (!window.console) {
	window.console = {};
}
window.console.log = window.console.info = window.console.trace = window.console.warn = window.console.error = function () {
	if (!prodMode || window.__wxConfig__ && window.__wxConfig__.enable_log) {
		logxx(_util2.default.format.apply(this, arguments) + '\n');
	}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var IDKeyType = exports.IDKeyType = {
	login: 1,
	login_cancel: 2,
	login_fail: 3,
	request_fail: 4,
	connectSocket_fail: 5,
	closeSocket_fail: 6,
	sendSocketMessage_fail: 7,
	uploadFile_fail: 8,
	downloadFile_fail: 9,
	redirectTo_fail: 10,
	navigateTo_fail: 11,
	navigateBack_fail: 12,
	appServiceSDKScriptError: 13,
	webviewSDKScriptError: 14,
	jsEnginScriptError: 15,
	thirdScriptError: 16,
	webviewScriptError: 17,
	exparserScriptError: 18,
	startRecord: 19,
	startRecord_fail: 20,
	getLocation: 21,
	getLocation_fail: 22,
	chooseLocation: 23,
	chooseLocation_fail: 24,
	openAddress: 25,
	openAddress_fail: 26,
	openLocation: 27,
	openLocation_fail: 28,
	makePhoneCall: 29,
	makePhoneCall_fail: 30,
	operateWXData: 31,
	operateWXData_fail: 32,
	checkLogin: 33,
	checkLogin_fail: 34,
	refreshSession: 35,
	refreshSession_fail: 36,
	chooseVideo: 37,
	chooseVideo_fail: 38,
	chooseImage: 39,
	chooseImage_fail: 40,
	verifyPaymentPassword: 41,
	verifyPaymentPassword_fail: 42,
	requestPayment: 43,
	requestPayment_fail: 44,
	bindPaymentCard: 45,
	bindPaymentCard_fail: 46,
	requestPaymentToBank: 47,
	requestPaymentToBank_fail: 48,
	openDocument: 49,
	openDocument_fail: 50,
	chooseContact: 51,
	chooseContact_fail: 52,
	operateMusicPlayer: 53,
	operateMusicPlayer_fail: 54,
	getMusicPlayerState_fail: 55,
	playVoice_fail: 56,
	setNavigationBarTitle_fail: 57,
	switchTab_fail: 58,
	getImageInfo_fail: 59,
	enableCompass_fail: 60,
	enableAccelerometer_fail: 61,
	getStorage_fail: 62,
	setStorage_fail: 63,
	clearStorage_fail: 64,
	removeStorage_fail: 65,
	getStorageInfo_fail: 66,
	getStorageSync_fail: 67,
	setStorageSync_fail: 68,
	addCard_fail: 69,
	openCard_fail: 70
};
var KeyValueType = exports.KeyValueType = {
	Speed: "13544",
	Error: "13582",
	Slow: "13968"
};
var SpeedValueType = exports.SpeedValueType = {
	webview2AppService: 1,
	appService2Webview: 2,
	funcReady: 3,
	firstGetData: 4,
	firstRenderTime: 5,
	reRenderTime: 6,
	forceUpdateRenderTime: 7,
	appRoute2newPage: 8,
	newPage2pageReady: 9,
	thirdScriptRunTime: 10,
	pageframe: 11,
	WAWebview: 12
};
var SlowValueType = exports.SlowValueType = {
	apiCallback: 1,
	pageInvoke: 2
};
var ErrorType = exports.ErrorType = {
	appServiceSDKScriptError: 1,
	webviewSDKScriptError: 2,
	jsEnginScriptError: 3,
	thirdScriptError: 4,
	webviewScriptError: 5,
	exparserScriptError: 6
};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 26 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28);

__webpack_require__(91);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _fileManager = __webpack_require__(29);

var _fileManager2 = _interopRequireDefault(_fileManager);

var _fileManager_js = __webpack_require__(31);

var _fileManager_js2 = _interopRequireDefault(_fileManager_js);

var _configFlags = __webpack_require__(8);

var _configFlags2 = _interopRequireDefault(_configFlags);

var _context = __webpack_require__(13);

var _context2 = _interopRequireDefault(_context);

var _canvas = __webpack_require__(14);

var _canvas2 = _interopRequireDefault(_canvas);

var _storage = __webpack_require__(42);

var _storage2 = _interopRequireDefault(_storage);

var _downloadTask = __webpack_require__(43);

var _downloadTask2 = _interopRequireDefault(_downloadTask);

var _downloadTask_js = __webpack_require__(44);

var _downloadTask_js2 = _interopRequireDefault(_downloadTask_js);

var _uploadTask = __webpack_require__(48);

var _uploadTask2 = _interopRequireDefault(_uploadTask);

var _uploadTask_js = __webpack_require__(49);

var _uploadTask_js2 = _interopRequireDefault(_uploadTask_js);

var _requestTask = __webpack_require__(50);

var _requestTask2 = _interopRequireDefault(_requestTask);

var _requestTask_js = __webpack_require__(51);

var _requestTask_js2 = _interopRequireDefault(_requestTask_js);

var _loadSubpackage = __webpack_require__(52);

var _loadSubpackage2 = _interopRequireDefault(_loadSubpackage);

var _socketTask = __webpack_require__(53);

var _socketTask2 = _interopRequireDefault(_socketTask);

var _socketTask_js = __webpack_require__(17);

var _socketTask_js2 = _interopRequireDefault(_socketTask_js);

var _versionUpdateManager = __webpack_require__(54);

var _versionUpdateManager2 = _interopRequireDefault(_versionUpdateManager);

var _bannerAd = __webpack_require__(55);

var _bannerAd2 = _interopRequireDefault(_bannerAd);

var _rewardedVideoAd = __webpack_require__(56);

var _rewardedVideoAd2 = _interopRequireDefault(_rewardedVideoAd);

var _interstitialAd = __webpack_require__(57);

var _interstitialAd2 = _interopRequireDefault(_interstitialAd);

var _gameIcon = __webpack_require__(58);

var _gameIcon2 = _interopRequireDefault(_gameIcon);

var _gamePortal = __webpack_require__(59);

var _gamePortal2 = _interopRequireDefault(_gamePortal);

var _openDataContext = __webpack_require__(60);

var _openDataContext2 = _interopRequireDefault(_openDataContext);

var _sceneConst = __webpack_require__(18);

var _sceneConst2 = _interopRequireDefault(_sceneConst);

__webpack_require__(61);

__webpack_require__(62);

__webpack_require__(63);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

var _innerAudioContext = __webpack_require__(64);

var _innerAudioContext2 = _interopRequireDefault(_innerAudioContext);

var _backgroundAudioManager = __webpack_require__(65);

var _backgroundAudioManager2 = _interopRequireDefault(_backgroundAudioManager);

var _recorderManager = __webpack_require__(66);

var _recorderManager2 = _interopRequireDefault(_recorderManager);

var _gameClubButton = __webpack_require__(67);

var _gameClubButton2 = _interopRequireDefault(_gameClubButton);

var _userInfoButton = __webpack_require__(68);

var _userInfoButton2 = _interopRequireDefault(_userInfoButton);

var _openSettingButton = __webpack_require__(69);

var _openSettingButton2 = _interopRequireDefault(_openSettingButton);

var _feedbackButton = __webpack_require__(70);

var _feedbackButton2 = _interopRequireDefault(_feedbackButton);

var _gameClubButton_js = __webpack_require__(71);

var _gameClubButton_js2 = _interopRequireDefault(_gameClubButton_js);

var _userInfoButton_js = __webpack_require__(72);

var _userInfoButton_js2 = _interopRequireDefault(_userInfoButton_js);

var _openSettingButton_js = __webpack_require__(73);

var _openSettingButton_js2 = _interopRequireDefault(_openSettingButton_js);

var _feedbackButton_js = __webpack_require__(74);

var _feedbackButton_js2 = _interopRequireDefault(_feedbackButton_js);

var _logManager = __webpack_require__(75);

var _logManager2 = _interopRequireDefault(_logManager);

__webpack_require__(76);

var _performance = __webpack_require__(77);

var _performance2 = _interopRequireDefault(_performance);

var _mgc_api = __webpack_require__(78);

var _mgc_api2 = _interopRequireDefault(_mgc_api);

var _api_js = __webpack_require__(90);

var _api_js2 = _interopRequireDefault(_api_js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// to bind a custom api
function bindApi(item) {
	// if no name, return
	if (!item.name) {
		return;
	}

	// if already has this api, and replace flag is not set, return
	if (MGC[item.name] && !item.replace) {
		return;
	}

	// add or replace this api
	Object.defineProperty(MGC, item.name, {
		configurable: true,
		enumerable: true,
		value: _utils2.default.surroundByTryCatchFactory(function () {
			if (item.fn) {
				var _item$fn;

				return (_item$fn = item.fn).call.apply(_item$fn, [apiObj].concat(Array.prototype.slice.call(arguments)));
			} else {
				if (item.name.endsWith('Sync')) {
					return _bridge2.default.callSyncApi.apply(_bridge2.default, [item.name].concat(Array.prototype.slice.call(arguments)));
				} else {
					_bridge2.default.invokeMethod.apply(_bridge2.default, [item.name].concat(Array.prototype.slice.call(arguments)));
				}
			}
		}, 'mgc.' + item.name)
	});
}

function addApiForMGC(apiKey) {
	Object.defineProperty(MGC, apiKey, {
		configurable: true,
		enumerable: true,
		value: _utils2.default.surroundByTryCatchFactory(apiObj[apiKey], 'mgc.' + apiKey)
	});
}

function execOnReady(callback) {
	"loading" !== document.readyState ? callback() : document.addEventListener("DOMContentLoaded", callback);
}

function paramCheck(apiName, params, paramTpl) {
	var res = _utils2.default.paramCheck(params, paramTpl);
	return !res || (logErr(apiName, params, apiName + ':fail parameter error: ' + res), !1);
}

function paramCheckFail(apiName) {
	var params = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
	    errMsg = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '';
	console.error(errMsg);
	var fail = Reporter.surroundThirdByTryCatch(params.fail || emptyFn, 'at api ' + apiName + ' fail callback function');
	var complete = Reporter.surroundThirdByTryCatch(params.complete || emptyFn, 'at api ' + apiName + ' complete callback function');
	fail({
		errCode: _const2.default.RESULT_FAIL,
		errMsg: errMsg
	});
	complete({
		errCode: _const2.default.RESULT_OK,
		errMsg: errMsg
	});
}

function checkUrl(apiName, params) {
	// 判断当前页面是否在app.json里
	var matchArr = /^(.*)\.html/gi.exec(params.url);
	return !matchArr || __wxConfig__.pages.indexOf(matchArr[1]) !== -1 || (logErr(apiName, params, apiName + ':fail url not in app.json'), !1);
}

var emptyFn = function emptyFn() {},
    pageData = {},
    firstCanvas = true,
    SDKVersion = '3.1.7',
    pageEventFn = void 0,
    loadedFonts = {},
    MGC = {
	SDKVersion: SDKVersion,
	SDKMode: _utils2.default.getSDKMode(),
	appStatus: _configFlags2.default.AppStatus.FORE_GROUND,
	hanged: false,
	currUrl: '',
	curWebViewId: null,
	currentClipBoardData: null,
	loginSourceUrl: '',
	openId: '',
	unionId: ''
};

_bridge2.default.subscribe('SPECIAL_PAGE_EVENT', function (params) {
	var data = params.data,
	    eventName = params.eventName,
	    ext = params.ext,
	    webViewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	if (data && data.type == 'input' && typeof pageEventFn === 'function') {
		var res = pageEventFn({
			data: data,
			eventName: eventName,
			webviewId: webViewId
		}),
		    value = data.detail.value;
		if (ext && ext.setKeyboardValue) {
			if (res === undefined) {} else if (_utils2.default.getDataType(res) === 'Object') {
				var _params = {};
				value != res.value && (_params.value = res.value + '');
				isNaN(parseInt(res.cursor)) || (_params.cursor = parseInt(res.cursor));
				_bridge2.default.publish('setKeyboardValue', _params, [webViewId]);
			} else {
				value != res && _bridge2.default.publish('setKeyboardValue', {
					value: res + '',
					cursor: -1
				}, [webViewId]);
			}
		}
	}
});

var logErr = function logErr(apiName) {
	var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
	    errMsg = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '';
	console.error(errMsg);
	Reporter.triggerErrorMessage(errMsg);
	var fail = Reporter.surroundThirdByTryCatch(options.fail || emptyFn, 'at api ' + apiName + ' fail callback function'),
	    complete = Reporter.surroundThirdByTryCatch(options.complete || emptyFn, 'at api ' + apiName + ' complete callback function');
	fail({
		errMsg: errMsg
	});
	complete({
		errMsg: errMsg
	});
};

var apiObj = {
	// api对象
	invoke: _bridge2.default.invoke,
	on: _bridge2.default.on,
	drawCanvas: _canvas2.default.drawCanvas,
	createContext: _canvas2.default.createContext,
	createCanvasContext: _canvas2.default.createCanvasContext,
	canvasToTempFilePath: _canvas2.default.canvasToTempFilePath,
	getSDKMode: function getSDKMode() {
		return _utils2.default.getSDKMode();
	},
	getSDKModeName: function getSDKModeName() {
		switch (_utils2.default.getSDKMode()) {
			case _const2.default.SDK_MODE_FULL:
				return 'full';
			case _const2.default.SDK_MODE_AD:
				return 'ad';
			default:
				return 'js';
		}
	},

	reportIDKey: function reportIDKey(e, t) {},
	reportKeyValue: function reportKeyValue(e, t) {},
	onPullDownRefresh: function onPullDownRefresh(e) {
		console.log('onPullDownRefresh has been removed from api list');
	},
	setNavigationBarColor: function setNavigationBarColor() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		if (paramCheck('setNavigationBarColor', params, {
			frontColor: '',
			backgroundColor: ''
		})) {
			if (['#ffffff', '#000000'].indexOf(params.frontColor) === -1) {
				logErr('setNavigationBarColor', params, 'invalid frontColor "' + params.frontColor + '"');
			}

			params.frontColor === '#ffffff' ? _bridge2.default.invokeMethod('setStatusBarStyle', {
				color: 'white'
			}) : params.frontColor === '#000000' && _bridge2.default.invokeMethod('setStatusBarStyle', {
				color: 'black'
			});

			var t = Object.assign({}, params);
			delete t.alpha;
			_bridge2.default.invokeMethod('setNavigationBarColor', t);
		}
	},
	setNavigationBarTitle: function setNavigationBarTitle() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		paramCheck('setNavigationBarTitle', params, {
			title: ''
		}) && _bridge2.default.invokeMethod('setNavigationBarTitle', params);
	},
	showNavigationBarLoading: function showNavigationBarLoading(e) {
		_bridge2.default.invokeMethod('showNavigationBarLoading', e);
	},
	hideNavigationBarLoading: function hideNavigationBarLoading(e) {
		_bridge2.default.invokeMethod('hideNavigationBarLoading', e);
	},
	stopPullDownRefresh: function stopPullDownRefresh(e) {
		_bridge2.default.invokeMethod('stopPullDownRefresh', e);
	},
	createSelectorQuery: function createSelectorQuery(e) {
		// 返回一个SelectorQuery对象实例
		var t = null;
		if (e && e.page) {
			t.e.page__wxWebViewId__;
		} else {
			var n = getCurrentPages();
			t = n[n.length - 1].__wxWebviewId__;
		}
		console.log(111);
		return new _utils2.default.wxQuerySelector(t);
	},

	pageScrollTo: function pageScrollTo(param) {
		// 将页面滚动到目标位置
		var target = getCurrentPages(),
		    viewId = target[target.length - 1].__wxWebviewId__;
		if (param.hasOwnProperty('page') && param.page.hasOwnProperty('__wxWebviewId__')) {
			viewId = param.page.__wxWebviewId__;
		}

		_bridge2.default.invokeMethod('pageScrollTo', param, [viewId]);
	},
	getStorage: function getStorage(params) {
		if (paramCheck('getStorage', params, { key: '' })) {
			if (params.key == null) {
				params.fail && params.fail();
			}
			var rt = _storage2.default.getStorage(params.key);
			var res = null;
			if (rt.data === undefined) {
				res = {
					errCode: _const2.default.RESULT_FAIL,
					errMsg: 'getStorage fail: data not found'
				};
				params.fail && params.fail(res);
			} else {
				res = rt;
				params.success && params.success(res);
			}
			params.complete && params.complete(res);
		}
	},
	getStorageSync: function getStorageSync(key) {
		if (paramCheck('getStorageSync', key, '')) {
			var rt = _storage2.default.getStorage(key);
			return rt && rt.data || '';
		}
	},
	setStorage: function setStorage(params) {
		if (paramCheck('setStorage', params, { key: '' })) {
			var res = {
				errCode: _const2.default.RESULT_OK,
				errMsg: 'setStorage success'
			};
			if (params.key === undefined || params.data === undefined) {
				params.fail && params.fail(params);
			}
			_storage2.default.set(params.key, params.data);
			params.success && params.success(res);
			params.complete && params.complete(res);
		}
	},
	setStorageSync: function setStorageSync(key, value) {
		value = value || '';
		if (paramCheck('setStorageSync', key, '')) {
			_storage2.default.set(key, value);
		}
	},
	removeStorage: function removeStorage(params) {
		if (paramCheck('removeStorage', params, { key: '' })) {
			if (params.key == null) {
				params.fail && params.fail();
			}
			_storage2.default.remove(params.key);
			params.success && params.success();
			params.complete && params.complete();
		}
	},
	removeStorageSync: function removeStorageSync(key) {
		paramCheck('removeStorageSync', key, '') && _storage2.default.remove(key);
	},
	clearStorage: function clearStorage() {
		_storage2.default.clear();
	},
	clearStorageSync: function clearStorageSync() {
		_storage2.default.clear();
	},
	getStorageInfo: function getStorageInfo(params) {
		var obj = _storage2.default.info();
		params.success && params.success(obj);
		params.complete && params.complete(obj);
	},
	getStorageInfoSync: function getStorageInfoSync() {
		return _storage2.default.info();
	},
	request: function request() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		if (paramCheck('request', params, { url: '' })) {
			// validate url
			if (_utils2.default.validateUrl(params.url) === !1) {
				return logErr('request', params, 'request:fail invalid url "' + params.url + '"');
			}

			// validate data
			if (params.data === 'function') {
				return logErr('request', params, 'request:fail data should not be Function');
			}

			// validate header, if not valid, set empty
			var headerType = _utils2.default.getDataType(params.header);
			params.header = params.header || {};
			params.header = _utils2.default.convertObjectValueToString(params.header);
			if (headerType !== 'Undefined' && headerType !== 'Object') {
				console.warn('request: header must be an object');
				params.header = {};
			}
			params.header = Object.keys(params.header).reduce(function (res, cur) {
				cur.toLowerCase() === 'content-type' ? res[cur.toLowerCase()] = params.header[cur] : res[cur] = params.header[cur];
				return res;
			}, {});

			// validate method
			params.method = params.method || 'GET';
			params.method = params.method.toUpperCase();

			// set default content type
			params.dataType = params.dataType || 'json';
			params.header['content-type'] = params.header['content-type'] || 'application/json';

			// default response type
			params.responseType = params.responseType || 'text';

			// ensure data is string format
			var data = '';
			var base64 = false;
			if (params.data) {
				try {
					if (params.data instanceof ArrayBuffer) {
						data = _utils2.default.arrayBufferToBase64(params.data);
						base64 = true;
					} else if (typeof params.data !== 'string') {
						data = JSON.stringify(params.data);
					} else {
						data = params.data;
					}
				} catch (e) {}
			}

			// if get, add data as query string
			if (params.method == 'GET') {
				params.url = _utils2.default.addQueryStringToUrl(params.url, params.data);
			}

			// invoke request
			var req = {
				url: params.url,
				data: data,
				header: params.header,
				method: params.method,
				dataType: params.dataType,
				responseType: params.responseType,
				base64: base64,
				success: params.success,
				fail: params.fail,
				complete: params.complete
			};
			if (MGC.SDKMode == _const2.default.SDK_MODE_JS) {
				return new _requestTask_js2.default(req);
			} else {
				return new _requestTask2.default(req);
			}
		}
		return null;
	},
	chooseImage: function chooseImage() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		_bridge2.default.invokeMethod('chooseImage', _utils2.default.assign({
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera']
		}, params));
	},
	previewImage: function previewImage(params) {
		paramCheck('previewImage', params, { urls: [''] }) && _bridge2.default.invokeMethod('previewImage', params);
	},
	getImageInfo: function getImageInfo(params) {
		paramCheck('getImageInfo', params, { src: '' }) && (/^(http|https):\/\//.test(params.src) ? _bridge2.default.invokeMethod('downloadFile', { url: params.src }, {
			afterSuccess: function afterSuccess(res) {
				params.src = res.tempFilePath;
				_bridge2.default.invokeMethod('getImageInfo', params, {
					beforeSuccess: function beforeSuccess(rt) {
						rt.path = params.src;
					}
				});
			},
			afterFail: function afterFail() {
				logErr('getImageInfo', params, 'getImageInfo:fail download image fail');
			}
		}) : /^wdfile:\/\//.test(params.src) || /^wdtmp:\/\//.test(params.src) ? _bridge2.default.invokeMethod('getImageInfo', params, {
			beforeSuccess: function beforeSuccess(rt) {
				rt.path = params.src;
			}
		}) : (params.src = _utils2.default.getRealRoute(window.mgc.currUrl, params.src, !1), _bridge2.default.invokeMethod('getImageInfo', params, {
			beforeSuccess: function beforeSuccess(rt) {
				rt.path = params.src;
			}
		})));
	},
	startRecord: function startRecord(params) {
		;window.mgc.appStatus === _configFlags2.default.AppStatus.BACK_GROUND && window.mgc.hanged === !1 || _bridge2.default.invokeMethod('startRecord', params);
	},
	stopRecord: function stopRecord(params) {
		_bridge2.default.invokeMethod('stopRecord', params);
	},
	chooseVideo: function chooseVideo() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		params.sourceType = params.sourceType || ['album', 'camera'];
		params.camera = params.camera || ['front', 'back'];
		_bridge2.default.invokeMethod('chooseVideo', params);
	},
	getLocation: function getLocation(params) {
		if (window.mgc.appStatus != _configFlags2.default.AppStatus.BACK_GROUND && !window.mgc.hanged) {
			params.type = params.type || 'wgs84';
			_bridge2.default.invokeMethod('getLocation', params);
		}
	},
	getLocationSync: function getLocationSync(params) {
		return _bridge2.default.callSyncApi('getLocation', params);
	},
	openLocation: function openLocation() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		paramCheck('openLocation', params, { latitude: 0.1, longitude: 0.1 }) && _bridge2.default.invokeMethod('openLocation', params);
	},
	chooseLocation: function chooseLocation() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		_bridge2.default.invokeMethod('chooseLocation', params);
	},
	getNetworkType: function getNetworkType(params) {
		_bridge2.default.invokeMethod('getNetworkType', params);
	},
	getNetworkTypeSync: function getNetworkTypeSync(params) {
		return _bridge2.default.callSyncApi('getNetworkType', null);
	},
	getSystemInfo: function getSystemInfo(params) {
		var platform = _utils2.default.getPlatform();
		_bridge2.default.invokeMethod('getSystemInfo', params, {
			beforeSuccess: function beforeSuccess(rt) {
				if (rt.platform == null) {
					rt.platform = platform;
				}
			}
		});
	},
	getSystemInfoSync: function getSystemInfoSync() {
		return _bridge2.default.callSyncApi('getSystemInfo', null);
	},
	login: function login(params) {
		if (window.__wxConfig__ && window.__wxConfig__.weweb && window.__wxConfig__.weweb.loginUrl) {
			// 引导到自定义的登录页面
			if (window.__wxConfig__.weweb.loginUrl.indexOf('/') != 0) {
				window.__wxConfig__.weweb.loginUrl = '/' + window.__wxConfig__.weweb.loginUrl;
			}
			var curPages = getCurrentPages();

			window.mgc.loginSourceUrl = curPages[curPages.length - 1].__route__;
			apiObj.redirectTo({
				url: window.__wxConfig__.weweb.loginUrl
			});
		} else {
			_bridge2.default.invokeMethod('login', params);
		}
	},
	checkSession: function checkSession(params) {
		_bridge2.default.invokeMethod('checkSession', params);
	},
	authorize: function authorize(params) {
		_bridge2.default.invokeMethod('authorize', params);
	},
	getUserInfo: function getUserInfo(params) {
		_bridge2.default.invokeMethod('getUserInfo', params, {
			beforeSuccess: function beforeSuccess(res) {
				// save open id and union id in global, mgc will return
				// openId and unionId in getUserInfo result, we save it
				// in global for easy access
				if (res.userInfo) {
					window.mgc.openId = res.userInfo.openId;
					window.mgc.unionId = res.userInfo.unionId;
				}
			}
		});
	},
	addCard: function addCard(params) {
		paramCheck('addCard', params, { cardList: [] }) && _bridge2.default.invokeMethod('addCard', params);
	},
	openCard: function openCard(params) {
		paramCheck('openCard', params, { cardList: [] }) && _bridge2.default.invokeMethod('openCard', params);
	},
	saveFile: function saveFile(params) {
		paramCheck('saveFile', params, { tempFilePath: '' }) && _bridge2.default.invokeMethod('saveFile', params);
	},
	onAppRoute: function onAppRoute(callback) {
		if (window.wd) {
			window.wd.onAppRoute(callback);
		}
	},
	onAppRouteDone: function onAppRouteDone(callback) {
		if (window.wd) {
			window.wd.onAppRouteDone(callback);
		}
	},
	onAppEnterBackground: function onAppEnterBackground(callback) {
		if (window.wd) {
			window.wd.onAppEnterBackground(callback);
		}
	},
	onAppEnterForeground: function onAppEnterForeground(callback) {
		if (window.wd) {
			window.wd.onAppEnterForeground(callback);
		}
	},
	onMemoryWarning: function onMemoryWarning(callback) {
		if (window.wd) {
			window.wd.onMemoryWarning(callback);
		}
	},
	setAppData: function setAppData(data) {
		var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
		    webviewIds = arguments[2];
		arguments[3];
		options.forceUpdate = typeof options.forceUpdate !== 'undefined' && options.forceUpdate;
		if (_utils2.default.isObject(data) === !1) {
			throw new _utils2.default.AppServiceSdkKnownError('setAppData:data should be an object');
		}
		!function () {
			var hasUpdate = !1,
			    tmpData = {},
			    setCurData = function setCurData(key, value, type) {
				hasUpdate = !0;
				tmpData[key] = value;
				type === 'Array' || type === 'Object' ? pageData[key] = JSON.parse(JSON.stringify(value)) : pageData[key] = value;
			};
			for (var oKey in data) {
				var curValue = data[oKey],
				    gValue = pageData[oKey],
				    gValueType = _utils2.default.getDataType(gValue),
				    curValueType = _utils2.default.getDataType(curValue);
				gValueType !== curValueType ? setCurData(oKey, curValue, curValueType) : gValueType == 'Array' || gValueType == 'Object' ? JSON.stringify(gValue) !== JSON.stringify(curValue) && setCurData(oKey, curValue, curValueType) : gValueType == 'String' || gValueType == 'Number' || gValueType == 'Boolean' ? gValue.toString() !== curValue.toString() && setCurData(oKey, curValue, curValueType) : gValueType == 'Date' ? gValue.getTime().toString() !== curValue.getTime().toString() && setCurData(oKey, curValue, curValueType) : gValue !== curValue && setCurData(oKey, curValue, curValueType);
			}
			options.forceUpdate ? _bridge2.default.publish('appDataChange', {
				data: data,
				option: {
					timestamp: Date.now(),
					forceUpdate: !0
				}
			}, webviewIds) : hasUpdate && _bridge2.default.publish('appDataChange', {
				data: tmpData
			}, webviewIds);
		}();
	},
	onWebviewEvent: function onWebviewEvent(fn, t) {
		pageEventFn = fn;
		_bridge2.default.subscribe('PAGE_EVENT', function (params) {
			var data = params.data,
			    eventName = params.eventName,
			    webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
			fn({
				data: data,
				eventName: eventName,
				webviewId: webviewId
			});
		});
	},
	showModal: function showModal() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
		    options = {
			title: '',
			content: '',
			confirmText: '确定',
			cancelText: '取消',
			showCancel: !0,
			confirmColor: '#3CC51F',
			cancelColor: '#000000'
		};
		options = _utils2.default.extend(options, params);
		if (paramCheck('showModal', options, {
			title: '',
			content: '',
			confirmText: '',
			cancelText: '',
			confirmColor: '',
			cancelColor: ''
		})) {
			return options.confirmText.length > 4 ? void logErr('showModal', params, 'showModal:fail confirmText length should not large then 4') : options.cancelText.length > 4 ? void logErr('showModal', params, 'showModal:fail cancelText length should not large then 4') : _bridge2.default.invokeMethod('showModal', options, {
				beforeSuccess: function beforeSuccess(rt) {
					rt.confirm = Boolean(rt.confirm);
				}
			});
		}
	},
	showToast: function showToast() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
		    options = {
			duration: 1500,
			title: '',
			icon: 'success',
			mask: !1
		};
		options = _utils2.default.extend(options, params);
		delete options.image;['success', 'loading'].indexOf(options.icon) < 0 && (options.icon = 'success');
		options.duration > 1e4 && (options.duration = 1e4);
		paramCheck('showToast', options, {
			duration: 1,
			title: '',
			icon: ''
		}) && _bridge2.default.invokeMethod('showToast', options);
	},
	hideToast: function hideToast(e) {
		_bridge2.default.invokeMethod('hideToast', e);
	},
	showLoading: function showLoading() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
		    defaultArgs = { title: '', icon: 'loading', mask: !1, duration: 1e8 };
		defaultArgs = _utils2.default.extend(defaultArgs, params);
		params.image && (defaultArgs.image = _utils2.default.getRealRoute(window.mgc.currUrl, params.image, !1));
		paramCheck('showLoading', defaultArgs, {
			duration: 1,
			title: ''
		}) && _bridge2.default.invokeMethod('showToast', defaultArgs, {
			beforeAll: function beforeAll(res) {
				res.errMsg = res.errMsg.replace('showToast', 'showLoading');
			}
		});
	},
	hideLoading: function hideLoading(args) {
		_bridge2.default.invokeMethod('hideToast', args, {
			beforeAll: function beforeAll(res) {
				res.errMsg = res.errMsg.replace('hideToast', 'hideLoading');
			}
		});
	},
	showActionSheet: function showActionSheet() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
		    options = {
			itemList: [],
			itemColor: '#000000'
		};
		options = _utils2.default.extend(options, params);
		options.cancelText = '取消';
		options.cancelColor = '#000000';
		if (paramCheck('showActionSheet', options, { itemList: ['1'], itemColor: '' })) {
			return params.itemList.length > 6 ? void logErr('showActionSheet', params, 'showActionSheet:fail parameter error: itemList should not be large than 6') : _bridge2.default.invokeMethod('showActionSheet', options, {
				beforeCancel: function beforeCancel(t) {
					try {
						typeof params.success === 'function' && params.success({
							errCode: _const2.default.RESULT_OK,
							errMsg: 'showActionSheet success',
							cancel: !0
						});
					} catch (e) {
						Reporter.thirdErrorReport({
							error: e,
							extend: 'showActionSheet success callback error'
						});
					}
				}
			});
		}
	},
	getSavedFileList: function getSavedFileList() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		_bridge2.default.invokeMethod('getSavedFileList', params);
	},
	getSavedFileInfo: function getSavedFileInfo() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		paramCheck('getSavedFileInfo', params, { filePath: '' }) && _bridge2.default.invokeMethod('getSavedFileInfo', params);
	},
	getFileInfo: function getFileInfo() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		if (_bridge2.default.beforeInvoke('getFileInfo', params, { filePath: '' })) {
			if (void 0 !== params.digestAlgorithm) {
				var res = _utils2.default.paramCheck(params, { digestAlgorithm: '' });
				if (res) {
					_bridge2.default.beforeInvokeFail('getFileInfo', params, 'parameter error: ' + res);
				}
				if (['md5', 'sha1'].indexOf(params.digestAlgorithm) === -1) {
					_bridge2.default.beforeInvokeFail('getFileInfo', params, 'parameter error: invalid digestAlgorithm "' + params.digestAlgorithm + '"');
				}
			}
			_bridge2.default.invokeMethod('getFileInfo', params, {});
		}
	},
	removeSavedFile: function removeSavedFile() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		paramCheck('removeSavedFile', params, { filePath: '' }) && _bridge2.default.invokeMethod('removeSavedFile', params);
	},
	getExtConfig: function getExtConfig() {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
		setTimeout(function () {
			var res = {
				errMsg: 'getExtConfig: ok',
				extConfig: (0, apiObj.getExtConfigSync)()
			};
			typeof params.success === 'function' && params.success(res);
			typeof params.complete === 'function' && params.complete(res);
		}, 0);
	},
	getClipboardData: function getClipboardData(params) {
		_bridge2.default.invokeMethod('getClipboardData', params);
	},
	setClipboardData: function setClipboardData(params) {
		paramCheck('setClipboardData', params, { data: '' }) && _bridge2.default.invokeMethod('setClipboardData', params, {
			beforeSuccess: function beforeSuccess() {
				window.mgc.currentClipBoardData = params.data;
			}
		});
	},
	getExtConfigSync: function getExtConfigSync() {
		if (!__wxConfig__.ext) return {};
		try {
			return JSON.parse(JSON.stringify(__wxConfig__.ext));
		} catch (e) {
			return {};
		}
	},
	canIuse: function canIuse() {
		var param1 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '',
		    param2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : SDKVersion;
		if (typeof param1 !== 'string') {
			throw new _utils2.default.AppServiceSdkKnownError('canIUse: schema should be an object');
		}
		var params = param1.split('.');
		return _utils2.default.canIUse(_utils2.default.toArray(params), param2);
	},
	createCanvas: function createCanvas() {
		if (firstCanvas) {
			firstCanvas = false;
			return window.canvas;
		}
		return window.sharedCanvas;
	},
	createImage: function createImage(params) {
		// create native image, not adapter image
		var img = window.NativeGlobal.createElement.call(window.NativeGlobal.document, 'img');
		return img;
	},
	createInnerAudioContext: function createInnerAudioContext(params) {
		return new _innerAudioContext2.default();
	},
	setInnerAudioOption: function setInnerAudioOption(params) {
		_innerAudioContext2.default.options = {
			mixWithOther: typeof params.mixWithOther == 'boolean' ? params.mixWithOther : true,
			obeyMuteSwitch: typeof params.obeyMuteSwitch == 'boolean' ? params.obeyMuteSwitch : true
		};
	},
	getBackgroundAudioManager: function getBackgroundAudioManager(params) {
		var am = new _backgroundAudioManager2.default();
		return am;
	},
	getRecorderManager: function getRecorderManager(params) {
		return _recorderManager2.default.getInstance();
	},
	getAvailableAudioSources: function getAvailableAudioSources(params) {
		_bridge2.default.invokeMethod('getAvailableAudioSources', params);
	},
	onTouchStart: function onTouchStart(callback) {
		if (window.wd) {
			window.wd.onTouchStart(callback);
		}
	},
	offTouchStart: function offTouchStart(callback) {
		if (window.wd) {
			window.wd.offTouchStart(callback);
		}
	},
	onTouchMove: function onTouchMove(callback) {
		if (window.wd) {
			window.wd.onTouchMove(callback);
		}
	},
	offTouchMove: function offTouchMove(callback) {
		if (window.wd) {
			window.wd.offTouchMove(callback);
		}
	},
	onTouchEnd: function onTouchEnd(callback) {
		if (window.wd) {
			window.wd.onTouchEnd(callback);
		}
	},
	offTouchEnd: function offTouchEnd(callback) {
		if (window.wd) {
			window.wd.offTouchEnd(callback);
		}
	},
	onTouchCancel: function onTouchCancel(callback) {
		if (window.wd) {
			window.wd.onTouchCancel(callback);
		}
	},
	offTouchCancel: function offTouchCancel(callback) {
		if (window.wd) {
			window.wd.offTouchCancel(callback);
		}
	},
	updateKeyboard: function updateKeyboard(params) {
		_bridge2.default.invokeMethod('updateKeyboard', params);
	},
	showKeyboard: function showKeyboard(params) {
		_bridge2.default.invokeMethod('showKeyboard', params);
	},
	hideKeyboard: function hideKeyboard(params) {
		_bridge2.default.invokeMethod('hideKeyboard', params);
	},
	onKeyboardInput: function onKeyboardInput(callback) {
		if (window.wd) {
			window.wd.onKeyboardInput(callback);
		}
	},
	offKeyboardInput: function offKeyboardInput(callback) {
		if (window.wd) {
			window.wd.offKeyboardInput(callback);
		}
	},
	onKeyboardConfirm: function onKeyboardConfirm(callback) {
		if (window.wd) {
			window.wd.onKeyboardConfirm(callback);
		}
	},
	offKeyboardConfirm: function offKeyboardConfirm(callback) {
		if (window.wd) {
			window.wd.offKeyboardConfirm(callback);
		}
	},
	onKeyboardComplete: function onKeyboardComplete(callback) {
		if (window.wd) {
			window.wd.onKeyboardComplete(callback);
		}
	},
	offKeyboardComplete: function offKeyboardComplete(callback) {
		if (window.wd) {
			window.wd.offKeyboardComplete(callback);
		}
	},
	onLaunch: function onLaunch(callback) {
		if (window.wd) {
			window.wd.onAppLaunch(callback);
		}
	},
	offLaunch: function offLaunch(callback) {
		if (window.wd) {
			window.wd.offAppLaunch(callback);
		}
	},
	onShow: function onShow(callback) {
		if (window.wd) {
			window.wd.onAppShow(callback);
		}
	},
	offShow: function offShow(callback) {
		if (window.wd) {
			window.wd.offAppShow(callback);
		}
	},
	onAppShow: function onAppShow(callback) {
		if (window.wd) {
			window.wd.onAppShow(callback);
		}
	},
	offAppShow: function offAppShow(callback) {
		if (window.wd) {
			window.wd.offAppShow(callback);
		}
	},
	onHide: function onHide(callback) {
		if (window.wd) {
			window.wd.onAppHide(callback);
		}
	},
	offHide: function offHide(callback) {
		if (window.wd) {
			window.wd.offAppHide(callback);
		}
	},
	onAppHide: function onAppHide(callback) {
		if (window.wd) {
			window.wd.onAppHide(callback);
		}
	},
	offAppHide: function offAppHide(callback) {
		if (window.wd) {
			window.wd.offAppHide(callback);
		}
	},
	onError: function onError(callback) {
		if (window.wd) {
			window.wd.onAppError(callback);
		}
	},
	offError: function offError(callback) {
		if (window.wd) {
			window.wd.offAppError(callback);
		}
	},
	onWindowResize: function onWindowResize(callback) {
		if (window.wd) {
			window.wd.onAppWindowResize(callback);
		}
	},
	offWindowResize: function offWindowResize(callback) {
		if (window.wd) {
			window.wd.offAppWindowResize(callback);
		}
	},
	onAudioInterruptionBegin: function onAudioInterruptionBegin(callback) {
		if (window.wd) {
			window.wd.onAudioInterruptionBegin(callback);
		}
	},
	offAudioInterruptionBegin: function offAudioInterruptionBegin(callback) {
		if (window.wd) {
			window.wd.offAudioInterruptionBegin(callback);
		}
	},
	onAudioInterruptionEnd: function onAudioInterruptionEnd(callback) {
		if (window.wd) {
			window.wd.onAudioInterruptionEnd(callback);
		}
	},
	offAudioInterruptionEnd: function offAudioInterruptionEnd(callback) {
		if (window.wd) {
			window.wd.offAudioInterruptionEnd(callback);
		}
	},
	onNetworkStatusChange: function onNetworkStatusChange(callback) {
		if (window.wd) {
			window.wd.onAppNetworkStatusChange(callback);
		}
	},
	onShareAppMessage: function onShareAppMessage(callback) {
		if (window.wd) {
			window.wd.onShareAppMessage(callback);
		}
	},
	offShareAppMessage: function offShareAppMessage(callback) {
		if (window.wd) {
			window.wd.offShareAppMessage(callback);
		}
	},
	getPerformance: function getPerformance(params) {
		return _performance2.default.instance;
	},
	loadFont: function loadFont(url) {
		// get family name
		var fontFamilyName = _utils2.default.getFontFamily(url);

		// if loaded, return
		if (loadedFonts[fontFamilyName]) {
			return fontFamilyName;
		}

		// resolve font path
		url = window.mgc.getFileSystemManager().resolveUrlSync(url);

		// create a style element which contains font
		var doc = window.NativeGlobal.document;
		var fontStyle = doc.createElement("style");
		fontStyle.type = "text/css";
		var fontStr = "";
		if (isNaN(fontFamilyName - 0)) fontStr += "@font-face { font-family:" + fontFamilyName + "; src:";else fontStr += "@font-face { font-family:'" + fontFamilyName + "'; src:";
		fontStr += "url('" + url + "');";
		fontStyle.textContent = fontStr + "}";
		doc.body.appendChild(fontStyle);

		// Preload font with div
		var preloadDiv = doc.createElement("div");
		var divStyle = preloadDiv.style;
		divStyle.fontFamily = fontFamilyName;
		preloadDiv.innerHTML = ".";
		divStyle.position = "absolute";
		divStyle.left = "-100px";
		divStyle.top = "-100px";
		doc.body.appendChild(preloadDiv);

		// set as loaded
		loadedFonts[fontFamilyName] = fontStyle;

		// return
		return fontFamilyName;
	},
	getTextLineHeight: function getTextLineHeight(params) {
		// if failed, we fallback to fontSize, if no font size, fallback to fontSize default value + 4
		var res = _bridge2.default.callSyncApi('getTextLineHeight', params);
		return res.lineHeight || params.fontSize || 20;
	},
	getLaunchOptionsSync: function getLaunchOptionsSync() {
		if (window.__wxConfig__) {
			return window.__wxConfig__.appLaunchInfo;
		} else {
			return {
				scene: _sceneConst2.default.MAIN,
				query: {},
				path: '',
				isSticky: false,
				shareTicket: 'fake',
				referrerInfo: {
					appId: 'fake',
					extraData: {}
				}
			};
		}
	},
	triggerGC: function triggerGC(params) {
		_bridge2.default.invokeMethod('triggerGC', params);
	},
	exitMiniProgram: function exitMiniProgram(params) {
		_bridge2.default.invokeMethod('exitMiniProgram', params);
	},
	getBatteryInfo: function getBatteryInfo(params) {
		_bridge2.default.invokeMethod('getBatteryInfo', params);
	},
	getBatteryInfoSync: function getBatteryInfoSync(params) {
		return _bridge2.default.callSyncApi('getBatteryInfo', params);
	},
	vibrateShort: function vibrateShort(params) {
		_bridge2.default.invokeMethod('vibrateShort', params);
	},
	vibrateLong: function vibrateLong(params) {
		_bridge2.default.invokeMethod('vibrateLong', params);
	},
	getScreenBrightness: function getScreenBrightness(params) {
		_bridge2.default.invokeMethod('getScreenBrightness', params);
	},
	setScreenBrightness: function setScreenBrightness(params) {
		_bridge2.default.invokeMethod('setScreenBrightness', params);
	},
	setKeepScreenOn: function setKeepScreenOn(params) {
		_bridge2.default.invokeMethod('setKeepScreenOn', params);
	},
	onDeviceOrientationChange: function onDeviceOrientationChange(callback) {
		if (window.wd) {
			window.wd.onAppDeviceOrientationChange(callback);
		}
	},
	offDeviceOrientationChange: function offDeviceOrientationChange(callback) {
		if (window.wd) {
			window.wd.offAppDeviceOrientationChange(callback);
		}
	},
	startDeviceMotionListening: function startDeviceMotionListening(params) {
		_bridge2.default.invokeMethod('startDeviceMotionListening', params);
	},
	stopDeviceMotionListening: function stopDeviceMotionListening(params) {
		_bridge2.default.invokeMethod('stopDeviceMotionListening', params);
	},
	onDeviceMotionChange: function onDeviceMotionChange(callback) {
		if (window.wd) {
			window.wd.onAppDeviceMotionChange(callback);
		}
	},
	startAccelerometer: function startAccelerometer(params) {
		_bridge2.default.invokeMethod('startAccelerometer', params);
	},
	stopAccelerometer: function stopAccelerometer(params) {
		_bridge2.default.invokeMethod('stopAccelerometer', params);
	},
	onAccelerometerChange: function onAccelerometerChange(callback) {
		if (window.wd) {
			window.wd.onAppAccelerometerChange(callback);
		}
	},
	startCompass: function startCompass(params) {
		_bridge2.default.invokeMethod('startCompass', params);
	},
	stopCompass: function stopCompass(params) {
		_bridge2.default.invokeMethod('stopCompass', params);
	},
	onCompassChange: function onCompassChange(callback) {
		if (window.wd) {
			window.wd.onAppCompassChange(callback);
		}
	},
	startGyroscope: function startGyroscope(params) {
		_bridge2.default.invokeMethod('startGyroscope', params);
	},
	stopGyroscope: function stopGyroscope(params) {
		_bridge2.default.invokeMethod('stopGyroscope', params);
	},
	onGyroscopeChange: function onGyroscopeChange(params) {
		if (window.wd) {
			window.wd.onAppGyroscopeChange(callback);
		}
	},
	downloadFile: function downloadFile(params) {
		if (paramCheck('downloadFile', params, { url: '' })) {
			if (MGC.SDKMode == _const2.default.SDK_MODE_JS) {
				return new _downloadTask_js2.default(params);
			} else {
				return new _downloadTask2.default(params);
			}
		}
		return null;
	},
	uploadFile: function uploadFile(params) {
		if (paramCheck('uploadFile', params, { url: '', filePath: '', name: '' })) {
			_typeof(params.header) !== 'object' && typeof params.header !== 'undefined' && (console.warn('uploadFile: header must be an object'), delete params.header), _typeof(params.formData) !== 'object' && typeof params.formData !== 'undefined' && (console.warn('uploadFile: formData must be an object'), delete params.formData);

			if (MGC.SDKMode == _const2.default.SDK_MODE_JS) {
				return new _uploadTask_js2.default(params);
			} else {
				return new _uploadTask2.default(params);
			}
		}
		return null;
	},
	loadSubpackage: function loadSubpackage(params) {
		if (paramCheck('loadSubpackage', params, { name: '' })) {
			return new _loadSubpackage2.default(params);
		}
		return null;
	},

	connectSocket: function connectSocket(params) {
		if (paramCheck('connectSocket', params, { url: '' })) {
			// if header is not an object, delete it
			if (_typeof(params.header) !== 'object' && typeof params.header !== 'undefined') {
				console.warn('connectSocket: header must be an object');
				delete params.header;
			}

			// create task
			if (MGC.SDKMode == _const2.default.SDK_MODE_JS) {
				return new _socketTask_js2.default(params);
			} else {
				return _socketTask2.default.create(params);
			}
		}
		return null;
	},
	closeSocket: function closeSocket(params) {
		var task = _socketTask2.default.get(params.url);
		if (task) {
			task.close(params);
		}
	},
	sendSocketMessage: function sendSocketMessage(params) {
		var task = _socketTask2.default.get(params.url);
		if (task) {
			task.send(params);
		}
	},
	onSocketOpen: function onSocketOpen(callback) {
		var task = _socketTask2.default.get();
		if (task) {
			task.onOpen(callback);
		}
	},
	onSocketClose: function onSocketClose(callback) {
		var task = _socketTask2.default.get();
		if (task) {
			task.onClose(callback);
		}
	},
	onSocketMessage: function onSocketMessage(callback) {
		var task = _socketTask2.default.get();
		if (task) {
			task.onMessage(callback);
		}
	},
	onSocketError: function onSocketError(callback) {
		var task = _socketTask2.default.get();
		if (task) {
			task.onError(callback);
		}
	},
	getUpdateManager: function getUpdateManager() {
		return _versionUpdateManager2.default.getInstance();
	},

	createBannerAd: function createBannerAd(params) {
		return new _bannerAd2.default(params);
	},
	createRewardedVideoAd: function createRewardedVideoAd(params) {
		return new _rewardedVideoAd2.default(params);
	},
	createInterstitialAd: function createInterstitialAd(params) {
		return new _interstitialAd2.default(params);
	},
	createGameBanner: function createGameBanner(params) {
		// for game banner, we just return banner ad, they have same api
		return new _bannerAd2.default(params);
	},
	createGameIcon: function createGameIcon(params) {
		return new _gameIcon2.default(params);
	},
	createGamePortal: function createGamePortal(params) {
		return new _gamePortal2.default(params);
	},
	getOpenDataContext: function getOpenDataContext(params) {
		var ctx = new _openDataContext2.default();
		ctx.canvas = window.sharedCanvas;
		return ctx;
	},
	showShareMenu: function showShareMenu(params) {
		_bridge2.default.invokeMethod('showShareMenu', params);
	},
	updateShareMenu: function updateShareMenu(params) {
		_bridge2.default.invokeMethod('updateShareMenu', params);
	},
	hideShareMenu: function hideShareMenu(params) {
		_bridge2.default.invokeMethod('hideShareMenu', params);
	},
	shareAppMessage: function shareAppMessage(params) {
		_bridge2.default.invokeMethod('shareAppMessage', params);
	},
	getShareInfo: function getShareInfo(params) {
		_bridge2.default.invokeMethod('getShareInfo', params);
	},
	setPreferredFramesPerSecond: function setPreferredFramesPerSecond(params) {
		// TODO
	},
	createGameClubButton: function createGameClubButton(params) {
		if (MGC.SDKMode == _const2.default.SDK_MODE_JS) {
			return new _gameClubButton_js2.default(params);
		} else {
			return new _gameClubButton2.default(params);
		}
	},
	createUserInfoButton: function createUserInfoButton(params) {
		if (MGC.SDKMode == _const2.default.SDK_MODE_JS) {
			return new _userInfoButton_js2.default(params);
		} else {
			return new _userInfoButton2.default(params);
		}
	},
	createOpenSettingButton: function createOpenSettingButton(params) {
		if (MGC.SDKMode == _const2.default.SDK_MODE_JS) {
			return new _openSettingButton_js2.default(params);
		} else {
			return new _openSettingButton2.default(params);
		}
	},
	createFeedbackButton: function createFeedbackButton(params) {
		if (MGC.SDKMode == _const2.default.SDK_MODE_JS) {
			return new _feedbackButton_js2.default(params);
		} else {
			return new _feedbackButton2.default(params);
		}
	},
	getSetting: function getSetting(params) {
		_bridge2.default.invokeMethod('getSetting', params);
	},
	openSetting: function openSetting(params) {
		_bridge2.default.invokeMethod('openSetting', params);
	},
	navigateBackMiniProgram: function navigateBackMiniProgram(params) {
		_bridge2.default.invokeMethod('navigateBackMiniProgram', params);
	},

	/*
  在extraData中可以添加以下参数:
  destInGameBox: true/false, true表示目标游戏在盒子中
  */
	navigateToMiniProgram: function navigateToMiniProgram(params) {
		if (paramCheck('navigateToMiniProgram', params, { appId: '' })) {
			_bridge2.default.invokeMethod('navigateToMiniProgram', params);
		}
	},

	removeUserCloudStorage: function removeUserCloudStorage(params) {
		_bridge2.default.invokeMethod('removeUserCloudStorage', params);
	},
	setUserCloudStorage: function setUserCloudStorage(params) {
		_bridge2.default.invokeMethod('setUserCloudStorage', params);
	},
	getSharedCanvas: function getSharedCanvas(params) {
		return window.sharedCanvas;
	},

	requestMidasPayment: function requestMidasPayment(params) {
		_bridge2.default.invokeMethod('requestMidasPayment', params);
	},
	navigateToMoreMiniProgram: function navigateToMoreMiniProgram(params) {
		_bridge2.default.invokeMethod('navigateToMoreMiniProgram', params);
	},
	getGameReward: function getGameReward(params) {
		_bridge2.default.invokeMethod('getGameReward', params);
	},
	showRewardToast: function showRewardToast(params) {
		_bridge2.default.invokeMethod('showRewardToast', params);
	},
	getMenuButtonBoundingClientRect: function getMenuButtonBoundingClientRect() {
		return _bridge2.default.callSyncApi('getMenuButtonBoundingClientRect', null);
	},
	setMenuStyle: function setMenuStyle(params) {
		_bridge2.default.invokeMethod('setMenuStyle', params);
	},
	setStatusBarStyle: function setStatusBarStyle(params) {
		_bridge2.default.invokeMethod('setStatusBarStyle', params);
	},
	getLogManager: function getLogManager(params) {
		return _logManager2.default.getInstance();
	},
	setEnableDebug: function setEnableDebug(params) {
		// currently we have nothing to do with it
	}

	// custom mgc api
};Object.assign(apiObj, _mgc_api2.default);

// some api is installed for sub context or not
if (window.__clientsubcontext && typeof window.__clientsubcontext != 'undefined') {
	Object.assign(apiObj, {
		getUserCloudStorage: function getUserCloudStorage(params) {
			_bridge2.default.invokeMethod('getUserCloudStorage', params);
		},
		getGroupCloudStorage: function getGroupCloudStorage(params) {
			_bridge2.default.invokeMethod('getGroupCloudStorage', params);
		},
		getFriendCloudStorage: function getFriendCloudStorage(params) {
			_bridge2.default.invokeMethod('getFriendCloudStorage', params);
		}
	});
} else {
	Object.assign(apiObj, {
		getFileSystemManager: function getFileSystemManager(params) {
			if (MGC.SDKMode == _const2.default.SDK_MODE_JS) {
				return _fileManager_js2.default.instance;
			} else {
				return _fileManager2.default.instance;
			}
		}
	});
}

// some api is only installed for miniapp, some games(like bubblepop) check those api
// if we don't do that, those games' logic may be wrong, so take it seriously
if (!window.__wxConfig__ || !window.__wxConfig__.minigame) {
	Object.assign(apiObj, {
		redirectTo: function redirectTo(params) {
			arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
			if (paramCheck('redirectTo', params, { url: '' })) {
				params.url = _utils2.default.getRealRoute(window.mgc.currUrl, params.url);
				params.url = _utils2.default.encodeUrlQuery(params.url);
				checkUrl('redirectTo', params) && _bridge2.default.invokeMethod('redirectTo', params, {
					afterSuccess: function afterSuccess() {
						window.mgc.currUrl = params.url;
					}
				});
			}
		},
		// 关闭所有页面，打开到应用内的某个页面
		reLaunch: function reLaunch(params) {
			arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
			if (window.mgc.appStatus != _configFlags2.default.AppStatus.BACK_GROUND) {
				return paramCheckFail('reLaunch', params, 'can not invoke reLaunch in background');
			}
			if (paramCheck('reLaunch', params, { url: '' })) {
				params.url = _utils2.default.getRealRoute(window.mgc.currUrl, params.url);
				params.url = _utils2.default.encodeUrlQuery(params.url);
				checkUrl('reLaunch', params) && _bridge2.default.invokeMethod('reLaunch', params, {
					afterSuccess: function afterSuccess() {
						window.mgc.currUrl = params.url;
					},
					afterFail: function afterFail() {
						console.log('failed');
					}
				});
			}
		},
		navigateTo: function navigateTo(params) {
			arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
			if (paramCheck('navigateTo', params, { url: '' })) {
				params.url = _utils2.default.getRealRoute(window.mgc.currUrl, params.url);
				params.url = _utils2.default.encodeUrlQuery(params.url);
				checkUrl('navigateTo', params) && _bridge2.default.invokeMethod('navigateTo', params, {
					afterSuccess: function afterSuccess() {
						window.mgc.currUrl = params.url;
						_context2.default.notifyCurrentRoutetoContext(window.mgc.currUrl);
					}
				});
			}
		},
		switchTab: function switchTab() {
			var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
			if (paramCheck('switchTab', params, { url: '' })) {
				;/\?.*$/.test(params.url) && (console.warn('switchTab: url 不支持 queryString'), params.url = params.url.replace(/\?.*$/, ''));
				params.url = _utils2.default.getRealRoute(window.mgc.currUrl, params.url);
				params.url = _utils2.default.encodeUrlQuery(params.url);
				checkUrl('switchTab', params) && _bridge2.default.invokeMethod('switchTab', params, {
					afterSuccess: function afterSuccess() {
						window.mgc.currUrl = params.url;
						_context2.default.notifyCurrentRoutetoContext(window.mgc.currUrl);
					}
				});
			}
		},
		navigateBack: function navigateBack() {
			var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
			typeof params.delta !== 'number' ? params.delta = 1 : (params.delta = parseInt(params.delta), params.delta < 1 && (params.delta = 1));
			_bridge2.default.invokeMethod('navigateBack', params);
		}
	});
}

_bridge2.default.subscribe('INVOKE_METHOD', function (params, t) {
	var name = params.name,
	    args = params.args;
	apiObj[name](args, !0);
});
_bridge2.default.subscribe('WEBVIEW_ERROR_MSG', function (params, t) {
	var msg = params.msg;
	Reporter.triggerErrorMessage(msg);
});
_bridge2.default.onMethod('onKeyboardValueChange', function (params) {
	var webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
	    pValue = params.value,
	    pCursor = params.cursor;
	if (params.data && typeof pageEventFn === 'function') {
		var data = JSON.parse(params.data);
		if (data.bindinput) {
			var peRes = void 0;
			try {
				peRes = pageEventFn({
					data: {
						type: 'input',
						target: data.target,
						currentTarget: data.target,
						timeStamp: Date.now(),
						touches: [],
						detail: {
							value: params.value,
							cursor: params.cursor
						}
					},
					eventName: data.bindinput,
					webviewId: webviewId
				});
			} catch (e) {
				throw new _utils2.default.AppServiceSdkKnownError('bind key input error');
			}
			if (data.setKeyboardValue) {
				if (void 0 === peRes || peRes === null || peRes === !1) ;else if (_utils2.default.getDataType(peRes) === 'Object') {
					var opt = {
						inputId: params.inputId
					};
					pValue != peRes.value && (opt.value = peRes.value + '');
					isNaN(parseInt(peRes.cursor)) || (opt.cursor = parseInt(peRes.cursor), typeof opt.value === 'undefined' && (opt.value = pValue), opt.cursor > opt.value.length && (opt.cursor = -1));
					_bridge2.default.invokeMethod('setKeyboardValue', opt);
				} else {
					pValue != peRes && _bridge2.default.invokeMethod('setKeyboardValue', {
						value: peRes + '',
						cursor: -1,
						inputId: params.inputId
					});
				}
			}
		}
	}
	_bridge2.default.publish('setKeyboardValue', {
		value: pValue,
		cursor: pCursor,
		inputId: params.inputId
	}, [webviewId]);
});

['onVideoPlay', 'onVideoPause', 'onVideoEnded', 'onVideoTimeUpdate', 'onVideoClickFullScreenBtn', 'onVideoClickDanmuBtn'].forEach(function (eventName) {
	_bridge2.default.onMethod(eventName, function () {
		var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
		    webviewId = arguments[1],
		    bindEventName = 'bind' + eventName.substring(7).toLowerCase(),
		    dataObj = JSON.parse(params.data),
		    handlers = dataObj.handlers,
		    event = dataObj.event,
		    createdTimestamp = dataObj.createdTimestamp;
		if (handlers[bindEventName] && typeof pageEventFn === 'function') {
			var data = {
				type: bindEventName.substring(4),
				target: event.target,
				currentTarget: event.currentTarget,
				timeStamp: Date.now() - createdTimestamp,
				detail: {}
			};
			bindEventName === 'bindtimeupdate' && (data.detail = { currentTime: params.position });
			pageEventFn({
				data: data,
				eventName: handlers[bindEventName],
				webviewId: webviewId
			});
		}
	});
});
_bridge2.default.onMethod('onError', function () {
	var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	console.error('thirdScriptError', '\n', 'sdk uncaught third Error', '\n', params.message, '\n', params.stack);
});

// if not full sdk, replace some api with pure js implementation
if (MGC.SDKMode != _const2.default.SDK_MODE_FULL) {
	Object.assign(apiObj, _api_js2.default);
}

// attach all api to mgc object
for (var key in apiObj) {
	addApiForMGC(key);
}

// register custom api from leto ext config
MGC.loadExtApi = function (conf) {
	if (conf) {
		var type = _utils2.default.getDataType(conf);
		if (type == 'Array') {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = conf[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var item = _step.value;

					bindApi(item);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		} else if (type == 'Object') {
			bindApi(conf);
		}
	}
};
window.LetoExtApiConf && MGC.loadExtApi(window.LetoExtApiConf);

// env for wx, it can not be found in documentation, but I see tencent chess use it
if (window.__wxConfig__ != null) {
	if (window.__wxConfig__.env != null) {
		MGC.env = window.__wxConfig__.env;
	}
}

// replace local storage methods
if (window.localStorage != null && window.__nativeLocalStorage == null) {
	// save old localStorage methods
	window.__nativeLocalStorage = {
		setItem: window.localStorage.setItem.bind(window.localStorage),
		getItem: window.localStorage.getItem.bind(window.localStorage),
		removeItem: window.localStorage.removeItem.bind(window.localStorage),
		clear: window.localStorage.clear.bind(window.localStorage),
		key: window.localStorage.key.bind(window.localStorage)

		// replace method
	};window.localStorage.setItem = _storage2.default.set;
	window.localStorage.getItem = _storage2.default.get;
	window.localStorage.removeItem = _storage2.default.remove;
	window.localStorage.clear = _storage2.default.clear;
	window.localStorage.key = _storage2.default.key;
}

// handle touch event and forward to listeners registered with mgc api
document.addEventListener('touchstart', function (e) {
	if (window.wd) {
		window.wd.dispatchTouchStart(e);
	}
});
document.addEventListener('touchmove', function (e) {
	if (window.wd) {
		window.wd.dispatchTouchMove(e);
	}
});
document.addEventListener('touchend', function (e) {
	if (window.wd) {
		window.wd.dispatchTouchEnd(e);
	}
});
document.addEventListener('touchcancel', function (e) {
	if (window.wd) {
		window.wd.dispatchTouchCancel(e);
	}
});

// global mgc api object
window.mgc = MGC;
module.exports = MGC;

// get file system manager so that it can init something
window.mgc.getFileSystemManager();

// if pure js mode, need store something in local storage
if (window.mgc.SDKMode == _const2.default.SDK_MODE_JS) {
	_utils2.default.getOrCreateUserId();
}

execOnReady(function () {
	setTimeout(function () {
		// because single webview version can not include service-config.js, so we need a way to
		// init AppConfig in native side, we only part of info, not all, so pass them thru dom
		// content load event
		_bridge2.default.publish("DOMContentLoaded", {
			env: { USER_DATA_PATH: _const2.default.LETO_FILE_SCHEMA },
			appLaunchInfo: { scene: 1001, query: {}, referrerInfo: {} }
		});
	}, 1e2);
});

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _fileStats = __webpack_require__(30);

var _fileStats2 = _interopRequireDefault(_fileStats);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _inst = null;

var FileSystemManager = function () {
	function FileSystemManager() {
		_classCallCheck(this, FileSystemManager);
	}

	_createClass(FileSystemManager, [{
		key: 'appendFile',
		value: function appendFile(params) {
			// set default encoding
			params = params || {};
			params.encoding = params.encoding || 'utf8';

			// if data is array buffer, convert to base64 string
			// if encoding is hex, convert to bytes and encoded as base64
			if (params.data instanceof ArrayBuffer) {
				params.data = btoa(String.fromCharCode.apply(String, _toConsumableArray(new Uint8Array(params.data))));
				params.encoding = 'base64';
			} else if (params.encoding == 'hex') {
				var i8arr = new Uint8Array(params.data.match(/[\da-f]{2}/gi).map(function (h) {
					return parseInt(h, 16);
				}));
				params.data = btoa(String.fromCharCode.apply(String, _toConsumableArray(i8arr)));
				params.encoding = 'base64';
			}

			// invoke
			_bridge2.default.invokeMethod('FileSystemManager_appendFile', params);
		}
	}, {
		key: 'appendFileSync',
		value: function appendFileSync(filePath, data, encoding) {
			// set default encoding
			encoding = encoding || 'utf8';

			// if data is array buffer, convert to base64 string
			// if encoding is hex, convert to bytes and encoded as base64
			if (data instanceof ArrayBuffer) {
				data = btoa(String.fromCharCode.apply(String, _toConsumableArray(new Uint8Array(data))));
				encoding = 'base64';
			} else if (encoding == 'hex') {
				var i8arr = new Uint8Array(data.match(/[\da-f]{2}/gi).map(function (h) {
					return parseInt(h, 16);
				}));
				data = btoa(String.fromCharCode.apply(String, _toConsumableArray(i8arr)));
				encoding = 'base64';
			}

			// now call
			var res = _bridge2.default.callSyncApi('FileSystemManager_appendFileSync', {
				filePath: filePath,
				data: data,
				encoding: encoding
			});
			return res.errCode == _const2.default.RESULT_OK ? null : res.errMsg;
		}
	}, {
		key: 'access',
		value: function access(params) {
			_bridge2.default.invokeMethod('FileSystemManager_access', params);
		}
	}, {
		key: 'accessSync',
		value: function accessSync(path) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_accessSync', {
				path: path
			});
			if (res.errCode == _const2.default.RESULT_FAIL) {
				throw new Error(res.errMsg);
			}
			return res.errCode == _const2.default.RESULT_OK ? null : res.errMsg;
		}
	}, {
		key: 'copyFile',
		value: function copyFile(params) {
			_bridge2.default.invokeMethod('FileSystemManager_copyFile', params);
		}
	}, {
		key: 'copyFileSync',
		value: function copyFileSync(srcPath, destPath) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_copyFileSync', {
				srcPath: srcPath,
				destPath: destPath
			});
			return res.errCode == _const2.default.RESULT_OK ? null : res.errMsg;
		}
	}, {
		key: 'getSavedFileList',
		value: function getSavedFileList(params) {
			_bridge2.default.invokeMethod('FileSystemManager_getSavedFileList', params);
		}
	}, {
		key: 'getFileInfo',
		value: function getFileInfo(params) {
			_bridge2.default.invokeMethod('FileSystemManager_getFileInfo', params);
		}
	}, {
		key: 'mkdir',
		value: function mkdir(params) {
			_bridge2.default.invokeMethod('FileSystemManager_mkdir', params);
		}
	}, {
		key: 'mkdirSync',
		value: function mkdirSync(dirPath, recursive) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_mkdirSync', {
				dirPath: dirPath,
				recursive: recursive
			});
			return res.errCode == _const2.default.RESULT_OK ? null : res.errMsg;
		}
	}, {
		key: 'readFile',
		value: function readFile(params) {
			_bridge2.default.invokeMethod('FileSystemManager_readFile', params);
		}
	}, {
		key: 'readFileSync',
		value: function readFileSync(filePath, encoding) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_readFileSync', {
				filePath: filePath,
				encoding: encoding || ''
			});
			if (res.base64 && res.data) {
				res.data = _utils2.default.base64ToArrayBuffer(res.data);
			}
			return res.data;
		}
	}, {
		key: 'readdir',
		value: function readdir(params) {
			_bridge2.default.invokeMethod('FileSystemManager_readdir', params);
		}
	}, {
		key: 'readdirSync',
		value: function readdirSync(dirPath) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_readdirSync', {
				dirPath: dirPath
			});
			return res.files;
		}
	}, {
		key: 'rename',
		value: function rename(params) {
			_bridge2.default.invokeMethod('FileSystemManager_rename', params);
		}
	}, {
		key: 'renameSync',
		value: function renameSync(oldPath, newPath) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_renameSync', {
				oldPath: oldPath,
				newPath: newPath
			});
			return res.errCode == _const2.default.RESULT_OK ? null : res.errMsg;
		}
	}, {
		key: 'rmdir',
		value: function rmdir(params) {
			_bridge2.default.invokeMethod('FileSystemManager_rmdir', params);
		}
	}, {
		key: 'rmdirSync',
		value: function rmdirSync(dirPath) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_rmdirSync', {
				dirPath: dirPath
			});
			return res.errCode == _const2.default.RESULT_OK ? null : res.errMsg;
		}
	}, {
		key: 'removeSavedFile',
		value: function removeSavedFile(params) {
			_bridge2.default.invokeMethod('FileSystemManager_removeSavedFile', params);
		}
	}, {
		key: 'saveFile',
		value: function saveFile(params) {
			_bridge2.default.invokeMethod('FileSystemManager_saveFile', params);
		}
	}, {
		key: 'saveFileSync',
		value: function saveFileSync(tempFilePath, filePath) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_saveFileSync', {
				tempFilePath: tempFilePath,
				filePath: filePath
			});
			return res.savedFilePath;
		}
	}, {
		key: 'stat',
		value: function stat(params) {
			_bridge2.default.invokeMethod('FileSystemManager_stat', params, {
				beforeAll: function beforeAll(res) {
					if (res.stats) {
						if (params.recursive) {
							var stats = {};
							for (var key in res.stats) {
								stats[key] = _fileStats2.default.fromJson(res.stats[key]);
							}
							res.stats = stats;
						} else {
							res.stats = _fileStats2.default.fromJson(res.stats);
						}
					}
				}
			});
		}
	}, {
		key: 'statSync',
		value: function statSync(path) {
			var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var ret = _bridge2.default.callSyncApi('FileSystemManager_statSync', {
				path: path,
				recursive: recursive
			});
			if (ret.stats) {
				if (recursive) {
					var stats = {};
					for (var key in ret.stats) {
						stats[key] = _fileStats2.default.fromJson(ret.stats[key]);
					}
					return stats;
				} else {
					return _fileStats2.default.fromJson(ret.stats);
				}
			} else {
				return null;
			}
		}
	}, {
		key: 'unlink',
		value: function unlink(params) {
			_bridge2.default.invokeMethod('FileSystemManager_unlink', params);
		}
	}, {
		key: 'unlinkSync',
		value: function unlinkSync(filePath) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_unlinkSync', {
				filePath: filePath
			});
			return res.errCode == _const2.default.RESULT_OK ? null : res.errMsg;
		}
	}, {
		key: 'unzip',
		value: function unzip(params) {
			_bridge2.default.invokeMethod('FileSystemManager_unzip', params);
		}
	}, {
		key: 'writeFile',
		value: function writeFile(params) {
			// set default encoding
			params = params || {};
			params.encoding = params.encoding || 'utf8';

			// if data is array buffer, convert to base64 string
			// if encoding is hex, convert to bytes and encoded as base64
			if (params.data instanceof ArrayBuffer) {
				params.data = _utils2.default.arrayBufferToBase64(params.data);
				params.encoding = 'base64';
			} else if (params.encoding == 'hex') {
				var i8arr = new Uint8Array(params.data.match(/[\da-f]{2}/gi).map(function (h) {
					return parseInt(h, 16);
				}));
				params.data = btoa(String.fromCharCode.apply(String, _toConsumableArray(i8arr)));
				params.encoding = 'base64';
			} else if (params.encoding == 'binary') {
				params.data = unescape(params.data);
				params.encoding = 'utf8';
			}

			// invoke
			_bridge2.default.invokeMethod('FileSystemManager_writeFile', params);
		}
	}, {
		key: 'writeFileSync',
		value: function writeFileSync(filePath, data, encoding) {
			// set default encoding
			encoding = encoding || 'utf8';

			// if data is array buffer, convert to base64 string
			// if encoding is hex, convert to bytes and encoded as base64
			if (data instanceof ArrayBuffer) {
				data = btoa(String.fromCharCode.apply(String, _toConsumableArray(new Uint8Array(data))));
				encoding = 'base64';
			} else if (encoding == 'hex') {
				var i8arr = new Uint8Array(data.match(/[\da-f]{2}/gi).map(function (h) {
					return parseInt(h, 16);
				}));
				data = btoa(String.fromCharCode.apply(String, _toConsumableArray(i8arr)));
				encoding = 'base64';
			}

			// call
			var res = _bridge2.default.callSyncApi('FileSystemManager_writeFileSync', {
				filePath: filePath,
				data: data,
				encoding: encoding
			});
			return res.errCode == _const2.default.RESULT_OK ? null : res.errMsg;
		}
	}, {
		key: 'resolveUrlSync',
		value: function resolveUrlSync(filePath) {
			var res = _bridge2.default.callSyncApi('FileSystemManager_resolveUrlSync', {
				filePath: filePath
			});
			return res.url;
		}
	}], [{
		key: 'instance',
		get: function get() {
			if (!_inst) {
				_inst = new FileSystemManager();
			}
			return _inst;
		}
	}]);

	return FileSystemManager;
}();

exports.default = FileSystemManager;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var S_IFMT = 0x0170000;
var S_IFDIR = 0x0040000;
var S_IFREG = 0x0100000;

var Stats = function () {
	function Stats() {
		_classCallCheck(this, Stats);

		this.dev = 0;
		this.mode = 0;
		this.size = 0;
		this.lastAccessedTime = 0;
		this.lastModifiedTime = 0;
	}

	_createClass(Stats, [{
		key: 'isFile',
		value: function isFile() {
			return this.mode & S_IFMT == S_IFREG;
		}
	}, {
		key: 'isDirectory',
		value: function isDirectory() {
			return this.mode & S_IFMT == S_IFDIR;
		}
	}], [{
		key: 'fromJson',
		value: function fromJson(j) {
			var s = new Stats();
			s.dev = Number(j.dev);
			s.mode = Number(j.mode);
			s.size = Number(j.size);
			s.lastAccessedTime = Number(j.lastAccessedTime);
			s.lastModifiedTime = Number(j.lastModifiedTime);
			return s;
		}
	}]);

	return Stats;
}();

exports.default = Stats;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

var _indexed_db_fs = __webpack_require__(32);

var _indexed_db_fs2 = _interopRequireDefault(_indexed_db_fs);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _inst = null;

var FileSystemManager_js = function () {
	_createClass(FileSystemManager_js, null, [{
		key: 'instance',
		get: function get() {
			if (!_inst) {
				_inst = new FileSystemManager_js();
			}
			return _inst;
		}
	}]);

	function FileSystemManager_js() {
		_classCallCheck(this, FileSystemManager_js);

		this.fs = new _indexed_db_fs2.default();
	}

	_createClass(FileSystemManager_js, [{
		key: 'debug',
		value: function debug() {
			return this.fs.debug();
		}
	}, {
		key: 'appendFile',
		value: function appendFile(params) {
			params = params || {};
			this.fs.appendFile(params.filePath, params.data, params.encoding).then(function (r) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK
				};
				_bridge2.default.invokeMethod('FileSystemManager_appendFile', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_appendFile', params);
			});
		}
	}, {
		key: 'appendFileSync',
		value: function appendFileSync(filePath, data, encoding) {
			this.fs.appendFileSync(filePath, data, encoding);
		}
	}, {
		key: 'access',
		value: function access(params) {
			params = params || {};
			this.fs.access(params.path).then(function (r) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK
				};
				_bridge2.default.invokeMethod('FileSystemManager_access', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_access', params);
			});
		}
	}, {
		key: 'accessSync',
		value: function accessSync(path) {
			if (this.fs.accessSync(path)) {
				return null;
			} else {
				throw new Error('can not access ' + path);
			}
		}
	}, {
		key: 'copyFile',
		value: function copyFile(params) {
			params = params || {};
			this.fs.copyFile(params.srcPath, params.destPath).then(function (r) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK
				};
				_bridge2.default.invokeMethod('FileSystemManager_copyFile', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_copyFile', params);
			});
		}
	}, {
		key: 'copyFileSync',
		value: function copyFileSync(srcPath, destPath) {
			this.fs.copyFileSync(srcPath, destPath);
		}
	}, {
		key: 'getSavedFileList',
		value: function getSavedFileList(params) {
			var fileList = this.fs.getSavedFileList();
			params = params || {};
			params.__fake_result = {
				errCode: _const2.default.RESULT_OK,
				fileList: fileList
			};
			_bridge2.default.invokeMethod('FileSystemManager_getSavedFileList', params);
		}
	}, {
		key: 'getFileInfo',
		value: function getFileInfo(params) {
			params = params || {};
			var info = this.fs.getFileInfo(params.filePath);
			params.__fake_result = {
				errCode: _const2.default.RESULT_OK,
				size: info.size
			};
			_bridge2.default.invokeMethod('FileSystemManager_getFileInfo', params);
		}
	}, {
		key: 'mkdir',
		value: function mkdir(params) {
			params = params || {};
			this.fs.mkdir(params.dirPath, !!params.recursive).then(function (r) {
				// ok anyway
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK
				};
				_bridge2.default.invokeMethod('FileSystemManager_mkdir', params);
			}).catch(function (e) {
				// ok anyway
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_mkdir', params);
			});
		}
	}, {
		key: 'mkdirSync',
		value: function mkdirSync(dirPath, recursive) {
			this.fs.mkdirSync(dirPath, recursive);
		}
	}, {
		key: 'readFile',
		value: function readFile(params) {
			params = params || {};

			// 如果不是绝对路径, 应该在远程
			if (!params.filePath.startsWith('/')) {
				var baseUrl = window.mgc.getAppBaseUrl();
				window.mgc.request({
					url: baseUrl + '/' + params.filePath,
					responseType: 'arraybuffer',
					dataType: 'arraybuffer',
					success: function success(res) {
						// convert encoding
						var data = res.data;
						if (params.encoding !== undefined) {
							switch (params.encoding) {
								case 'hex':
									data = _utils2.default.buf2hex(data);
									break;
								case 'base64':
									data = _utils2.default.arrayBufferToBase64(data);
									break;
								case 'utf16le':
								case 'utf-16le':
								case 'ucs2':
								case 'ucs-2':
									data = String.fromCharCode.apply(null, new Uint16Array(data));
									break;
								default:
									{
										var d = new TextDecoder();
										data = d.decode(data);
										break;
									}
							}
						}

						// return
						params.__fake_result = {
							errCode: _const2.default.RESULT_OK,
							data: data
						};
						_bridge2.default.invokeMethod('FileSystemManager_readFile', params);
					},
					fail: function fail(res) {
						params.__fake_result = {
							errCode: _const2.default.RESULT_FAIL
						};
						_bridge2.default.invokeMethod('FileSystemManager_readFile', params);
					}
				});
			} else {
				this.fs.readFile(params.filePath, params.encoding, params.position, params.length).then(function (data) {
					params.__fake_result = {
						errCode: _const2.default.RESULT_OK,
						data: data
					};
					_bridge2.default.invokeMethod('FileSystemManager_readFile', params);
				}).catch(function (e) {
					params.__fake_result = {
						errCode: _const2.default.RESULT_FAIL
					};
					_bridge2.default.invokeMethod('FileSystemManager_readFile', params);
				});
			}
		}
	}, {
		key: 'readFileSync',
		value: function readFileSync(filePath, encoding, position, length) {
			return this.fs.readFileSync(filePath, encoding, position, length);
		}
	}, {
		key: 'readdir',
		value: function readdir(params) {
			params = params || {};
			this.fs.readdir(params.dirPath).then(function (r) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK,
					files: r
				};
				_bridge2.default.invokeMethod('FileSystemManager_readdir', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_readdir', params);
			});
		}
	}, {
		key: 'readdirSync',
		value: function readdirSync(dirPath) {
			return this.fs.readdirSync(dirPath);
		}
	}, {
		key: 'rename',
		value: function rename(params) {
			params = params || {};
			this.fs.rename(params.oldPath, params.newPath).then(function (r) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK
				};
				_bridge2.default.invokeMethod('FileSystemManager_rename', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_rename', params);
			});
		}
	}, {
		key: 'renameSync',
		value: function renameSync(oldPath, newPath) {
			this.fs.renameSync(oldPath, newPath);
		}
	}, {
		key: 'rmdir',
		value: function rmdir(params) {
			params = params || {};
			this.fs.rmdir(params.dirPath, !!params.recursive).then(function (r) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK
				};
				_bridge2.default.invokeMethod('FileSystemManager_rmdir', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_rmdir', params);
			});
		}
	}, {
		key: 'rmdirSync',
		value: function rmdirSync(dirPath, recursive) {
			this.fs.rmdirSync(dirPath, recursive);
		}
	}, {
		key: 'removeSavedFile',
		value: function removeSavedFile(params) {
			params = params || {};
			params.__fake_result = {
				errCode: _const2.default.RESULT_FAIL
			};
			_bridge2.default.invokeMethod('FileSystemManager_removeSavedFile', params);
		}
	}, {
		key: 'saveFile',
		value: function saveFile(params) {
			params = params || {};
			this.fs.saveFile(params.tempFilePath, params.filePath).then(function (savedFilePath) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK,
					savedFilePath: savedFilePath
				};
				_bridge2.default.invokeMethod('FileSystemManager_saveFile', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_saveFile', params);
			});
		}
	}, {
		key: 'saveFileSync',
		value: function saveFileSync(tempFilePath, filePath) {
			this.fs.saveFileSync(tempFilePath, filePath);
		}
	}, {
		key: 'stat',
		value: function stat(params) {
			params = params || {};
			this.fs.stat(params.path, params.recursive).then(function (r) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK,
					stats: r
				};
				_bridge2.default.invokeMethod('FileSystemManager_saveFile', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_saveFile', params);
			});
		}
	}, {
		key: 'statSync',
		value: function statSync(path) {
			var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			return this.fs.statSync(path, recursive);
		}
	}, {
		key: 'unlink',
		value: function unlink(params) {
			params = params || {};
			this.fs.unlink(params.filePath).then(function (r) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK
				};
				_bridge2.default.invokeMethod('FileSystemManager_unlink', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_unlink', params);
			});
		}
	}, {
		key: 'unlinkSync',
		value: function unlinkSync(filePath) {
			this.fs.unlinkSync(filePath);
		}
	}, {
		key: 'unzip',
		value: function unzip(params) {
			params = params || {};
			this.fs.unzip(params.zipFilePath, params.targetPath).then(function (r) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_OK
				};
				_bridge2.default.invokeMethod('FileSystemManager_unzip', params);
			}).catch(function (e) {
				params.__fake_result = {
					errCode: _const2.default.RESULT_FAIL
				};
				_bridge2.default.invokeMethod('FileSystemManager_unzip', params);
			});
		}
	}, {
		key: 'writeFile',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(params) {
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								params = params || {};
								this.fs.writeFile(params.filePath, params.data, params.encoding).then(function (r) {
									params.__fake_result = {
										errCode: _const2.default.RESULT_OK
									};
									_bridge2.default.invokeMethod('FileSystemManager_writeFile', params);
								}).catch(function (e) {
									params.__fake_result = {
										errCode: _const2.default.RESULT_FAIL
									};
									_bridge2.default.invokeMethod('FileSystemManager_writeFile', params);
								});

							case 2:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function writeFile(_x2) {
				return _ref.apply(this, arguments);
			}

			return writeFile;
		}()
	}, {
		key: 'writeFileSync',
		value: function writeFileSync(filePath, data, encoding) {
			return this.fs.writeFileSync(filePath, data, encoding);
		}
	}, {
		key: 'resolveUrlSync',
		value: function resolveUrlSync(filePath) {
			return filePath;
		}
	}]);

	return FileSystemManager_js;
}();

exports.default = FileSystemManager_js;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _uuid = __webpack_require__(33);

var _stats_js = __webpack_require__(40);

var _stats_js2 = _interopRequireDefault(_stats_js);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// pending async types
var PENDING_WRITE_DIR_INODE = 0; // { entry: xxx }
var PENDING_WRITE_FILE_INODE = 1; // { entry: xxx, data: xxx }
var PENDING_DELETE_DIR_INODE = 2; // { entry: xxx }
var PENDING_DELETE_FILE_INODE = 3; // { entry: xxx }

var IndexedDBFS = function () {
	function IndexedDBFS(cb) {
		var _this = this;

		_classCallCheck(this, IndexedDBFS);

		// file/nodes cache
		this.fileCache = {}; // key is path, value is array buffer
		this.keyMap = {}; // key is primary key, value is inode object
		this.nameParentMap = {}; // key is [name,parent].toString(), value is inode object
		this.parentMap = {}; // key is parent, value is array of entry

		// 同步方法需要异步同步到db, 为了不出错, 异步的操作需要按顺序来
		this.syncing = false;
		this.pendingSync = [];
		this.processingSync = [];

		// init db
		this.db = null;
		var request = window.indexedDB.open('leto_' + window.__wxConfig__.game_id);
		var needInit = false;
		request.onsuccess = function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
				var now;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								// save db
								_this.db = request.result;

								// put root record

								if (!needInit) {
									_context.next = 5;
									break;
								}

								now = Date.now();
								_context.next = 5;
								return _this._writeDirINode({
									id: '/',
									name: '/',
									parent: '.',
									mode: 0x777,
									lastAccessedTime: now,
									lastModifiedTime: now,
									dir: true,
									size: 0
								});

							case 5:

								// clear cache
								_this.fileCache = {};
								_this.keyMap = {};
								_this.nameParentMap = {};
								_this.parentMap = {};

								// preload all nodes
								_context.next = 11;
								return _this.loadAllNodes('/');

							case 11:

								// callback
								cb && cb(null);

							case 12:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, _this);
			}));

			return function (_x) {
				return _ref.apply(this, arguments);
			};
		}();
		request.onupgradeneeded = function (event) {
			_this.db = event.target.result;

			// create table
			if (!_this.db.objectStoreNames.contains('inode')) {
				needInit = true;
				var inode = _this.db.createObjectStore('inode', { keyPath: 'id' });
				inode.createIndex('idx_parent', 'parent', { unique: false });
				inode.createIndex('idx_name_parent', ['name', 'parent'], { unique: true });
				_this.db.createObjectStore('idata', { keyPath: 'id' });
			}
		};
		request.onerror = function (e) {
			// callback
			cb && cb(e);
		};
	}

	/**
  * 返回当前的内存缓存, 以便调试
  */


	_createClass(IndexedDBFS, [{
		key: 'debug',
		value: function debug() {
			return {
				fileCache: this.fileCache,
				keyMap: this.keyMap,
				nameParentMap: this.nameParentMap,
				parentMap: this.parentMap
			};
		}
	}, {
		key: '_putToCache',
		value: function _putToCache(entry, data) {
			this.keyMap[entry.id] = entry;
			this.nameParentMap[[entry.name, entry.parent]] = entry;
			var children = this.parentMap[entry.parent];
			if (!children) {
				children = this.parentMap[entry.parent] = [];
			}
			children.push(entry);
			if (data && !entry.dir) {
				this.fileCache[entry.id] = data;
			}
		}

		/**
   * 预加载所有节点, 主要是为了实现同步方法
   */

	}, {
		key: 'loadAllNodes',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(dir) {
				var _this2 = this;

				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								return _context3.abrupt('return', new Promise(function () {
									var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
										var subPathNodes, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, subPath, data;

										return regeneratorRuntime.wrap(function _callee2$(_context2) {
											while (1) {
												switch (_context2.prev = _context2.next) {
													case 0:
														_context2.next = 2;
														return _this2._getSubPathINode(dir);

													case 2:
														subPathNodes = _context2.sent;
														_iteratorNormalCompletion = true;
														_didIteratorError = false;
														_iteratorError = undefined;
														_context2.prev = 6;
														_iterator = subPathNodes[Symbol.iterator]();

													case 8:
														if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
															_context2.next = 22;
															break;
														}

														subPath = _step.value;

														// put to cache
														data = null;

														if (subPath.dir) {
															_context2.next = 15;
															break;
														}

														_context2.next = 14;
														return _this2._getFileData(subPath);

													case 14:
														data = _context2.sent;

													case 15:
														_this2._putToCache(subPath, data);

														// recursively load

														if (!subPath.dir) {
															_context2.next = 19;
															break;
														}

														_context2.next = 19;
														return _this2.loadAllNodes(subPath);

													case 19:
														_iteratorNormalCompletion = true;
														_context2.next = 8;
														break;

													case 22:
														_context2.next = 28;
														break;

													case 24:
														_context2.prev = 24;
														_context2.t0 = _context2['catch'](6);
														_didIteratorError = true;
														_iteratorError = _context2.t0;

													case 28:
														_context2.prev = 28;
														_context2.prev = 29;

														if (!_iteratorNormalCompletion && _iterator.return) {
															_iterator.return();
														}

													case 31:
														_context2.prev = 31;

														if (!_didIteratorError) {
															_context2.next = 34;
															break;
														}

														throw _iteratorError;

													case 34:
														return _context2.finish(31);

													case 35:
														return _context2.finish(28);

													case 36:
														resolve();

													case 37:
													case 'end':
														return _context2.stop();
												}
											}
										}, _callee2, _this2, [[6, 24, 28, 36], [29,, 31, 35]]);
									}));

									return function (_x3, _x4) {
										return _ref3.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function loadAllNodes(_x2) {
				return _ref2.apply(this, arguments);
			}

			return loadAllNodes;
		}()
	}, {
		key: '_doNextSync',
		value: function _doNextSync() {
			var _this3 = this;

			if (this.processingSync.length > 0) {
				var arr = this.processingSync[0];
				this.processingSync.splice(0, 1);
				switch (arr[0]) {
					case PENDING_WRITE_DIR_INODE:
						this._writeDirINode(arr[1].entry).then(function (r) {
							_this3._doNextSync();
						}).catch(function (e) {
							// TODO 这怎么办, 容错有点麻烦
						});
						break;
					case PENDING_WRITE_FILE_INODE:
						this._writeFileINode(arr[1].entry, arr[1].data).then(function (r) {
							_this3._doNextSync();
						}).catch(function (e) {
							// TODO 这怎么办, 容错有点麻烦
						});
						break;
					case PENDING_DELETE_DIR_INODE:
					case PENDING_DELETE_FILE_INODE:
						var tx = this.db.transaction(['inode', 'idata'], 'readwrite');
						this._deleteINodeRecursively(arr[1].entry, tx).then(function (r) {
							_this3._doNextSync();
						}).catch(function (e) {
							// TODO 这怎么办, 容错有点麻烦
						});
						break;
				}
			} else {
				this.syncing = false;
				this._flushSync();
			}
		}
	}, {
		key: '_flushSync',
		value: function _flushSync() {
			if (!this.syncing && this.pendingSync.length > 0) {
				var _processingSync;

				this.syncing = true;
				(_processingSync = this.processingSync).push.apply(_processingSync, _toConsumableArray(this.pendingSync));
				this.pendingSync.splice(0, this.pendingSync.length);
				this._doNextSync();
			}
		}
	}, {
		key: '_scheduleSync',
		value: function _scheduleSync(type, params) {
			this.pendingSync.push([type, params]);
			this._flushSync();
		}
	}, {
		key: '_writeDirINode',
		value: function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(name, parent) {
				var _this4 = this;

				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								return _context4.abrupt('return', new Promise(function (resolve, reject) {
									// 如果第一个参数是个object, 则认为是entry, 直接写入
									// 如果不是, 则生成entry
									var entry = null;
									if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) == 'object') {
										entry = name;
									} else {
										var now = Date.now();
										entry = {
											id: (0, _uuid.v1)(),
											name: name,
											parent: parent,
											mode: 0x777,
											lastAccessedTime: now,
											lastModifiedTime: now,
											dir: true,
											size: 0
										};
									}

									// 写入entry
									var tx = _this4.db.transaction(['inode'], 'readwrite').objectStore('inode').add(entry);
									tx.onsuccess = function (event) {
										resolve(entry);
									};
									tx.onerror = function (e) {
										reject(e);
									};
								}));

							case 1:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function _writeDirINode(_x5, _x6) {
				return _ref4.apply(this, arguments);
			}

			return _writeDirINode;
		}()
	}, {
		key: 'overwriteFileData',
		value: function () {
			var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(entry, data) {
				var _this5 = this;

				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								return _context5.abrupt('return', new Promise(function (resolve, reject) {
									var tx = _this5.db.transaction(['idata'], 'readwrite');
									var idata = tx.objectStore('idata');
									var request = idata.put({
										id: entry.id,
										data: data
									});
									request.onsuccess = function (event) {
										resolve(entry);
									};
									request.onerror = function (e) {
										reject(e);
									};
								}));

							case 1:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function overwriteFileData(_x7, _x8) {
				return _ref5.apply(this, arguments);
			}

			return overwriteFileData;
		}()

		/**
   * 写入一个文件inode, 参数也可以是 entry, data, 会自动判断. 如果第一个参数是entry, 第二个
   * 必须是array buffer
   */

	}, {
		key: '_writeFileINode',
		value: function () {
			var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(name, parent, data) {
				var _this6 = this;

				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								return _context6.abrupt('return', new Promise(function (resolve, reject) {
									// 自动适配参数
									var entry = null;
									var buf = null;
									if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) == 'object') {
										entry = name;
										buf = parent;
									} else {
										var now = Date.now();
										entry = {
											id: (0, _uuid.v1)(),
											name: name,
											parent: parent,
											mode: 0x777,
											lastAccessedTime: now,
											lastModifiedTime: now,
											dir: false,
											size: data.byteLength
										};
										buf = data;
									}

									// 写入
									var tx = _this6.db.transaction(['inode', 'idata'], 'readwrite');
									var inodeReq = tx.objectStore('inode').put(entry);
									inodeReq.onsuccess = function (event) {
										var idataReq = tx.objectStore('idata').put({
											id: entry.id,
											data: buf
										});
										idataReq.onsuccess = function (event) {
											resolve(entry.id);
										};
										idataReq.onerror = function (e) {
											reject(e);
										};
									};
									inodeReq.onerror = function (e) {
										reject(e);
									};
								}));

							case 1:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this);
			}));

			function _writeFileINode(_x9, _x10, _x11) {
				return _ref6.apply(this, arguments);
			}

			return _writeFileINode;
		}()
	}, {
		key: '_getFileData',
		value: function () {
			var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(path) {
				var _this7 = this;

				return regeneratorRuntime.wrap(function _callee8$(_context8) {
					while (1) {
						switch (_context8.prev = _context8.next) {
							case 0:
								return _context8.abrupt('return', new Promise(function () {
									var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(resolve, reject) {
										var entry, tx, idata, req;
										return regeneratorRuntime.wrap(function _callee7$(_context7) {
											while (1) {
												switch (_context7.prev = _context7.next) {
													case 0:
														if (!(typeof path == 'string')) {
															_context7.next = 6;
															break;
														}

														_context7.next = 3;
														return _this7._getPathINode(path);

													case 3:
														_context7.t0 = _context7.sent;
														_context7.next = 7;
														break;

													case 6:
														_context7.t0 = path;

													case 7:
														entry = _context7.t0;

														if (entry) {
															_context7.next = 11;
															break;
														}

														resolve(null);
														return _context7.abrupt('return');

													case 11:

														// get data
														tx = _this7.db.transaction(['idata']);
														idata = tx.objectStore('idata');
														req = idata.get(entry.id);

														req.onsuccess = function (event) {
															resolve(event.target.result.data);
														};
														req.onerror = function (e) {
															resolve(null);
														};

													case 16:
													case 'end':
														return _context7.stop();
												}
											}
										}, _callee7, _this7);
									}));

									return function (_x13, _x14) {
										return _ref8.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context8.stop();
						}
					}
				}, _callee8, this);
			}));

			function _getFileData(_x12) {
				return _ref7.apply(this, arguments);
			}

			return _getFileData;
		}()

		/**
   * 把路径格式化成数组, 排除空字符串
   */

	}, {
		key: '_normalizeSegments',
		value: function _normalizeSegments(path) {
			if (!path) {
				return [];
			} else {
				var segments = path.split('/');
				segments = segments.filter(function (seg) {
					return seg.length > 0;
				});
				return segments;
			}
		}
	}, {
		key: '_normalizePath',
		value: function _normalizePath(path) {
			var pathWithoutSchema = path;
			if (path.startsWith(_const2.default.LETO_FILE_SCHEMA)) {
				pathWithoutSchema = path.substring(_const2.default.LETO_FILE_SCHEMA.length);
			} else if (path.startsWith(_const2.default.LETO_TMP_SCHEMA)) {
				pathWithoutSchema = path.substring(_const2.default.LETO_TMP_SCHEMA.length);
			}
			if (!pathWithoutSchema.startsWith('/')) {
				pathWithoutSchema = '/' + pathWithoutSchema;
			}
			path = _const2.default.LETO_STORE_DIR + pathWithoutSchema;
			var segments = this._normalizeSegments(path);
			return '/' + segments.join('/');
		}

		/**
   * 查找某个文件的键值, 根据文件的名称和父节点key查找
   */

	}, {
		key: '_getINodeKey',
		value: function () {
			var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(name, parent) {
				var _this8 = this;

				return regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								return _context9.abrupt('return', new Promise(function (resolve, reject) {
									var tx = _this8.db.transaction(['inode']);
									var inode = tx.objectStore('inode');
									var idx = inode.index('idx_name_parent');
									var request = idx.getKey([name, parent]);
									request.onsuccess = function (event) {
										resolve(event.target.result);
									};
									request.onerror = function (e) {
										resolve(null);
									};
								}));

							case 1:
							case 'end':
								return _context9.stop();
						}
					}
				}, _callee9, this);
			}));

			function _getINodeKey(_x15, _x16) {
				return _ref9.apply(this, arguments);
			}

			return _getINodeKey;
		}()

		/**
   * 根据主键获得inode信息, 返回的对象会额外包含主键, 字段名为_key
   */

	}, {
		key: '_getINode',
		value: function () {
			var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(id) {
				var _this9 = this;

				return regeneratorRuntime.wrap(function _callee11$(_context11) {
					while (1) {
						switch (_context11.prev = _context11.next) {
							case 0:
								return _context11.abrupt('return', new Promise(function () {
									var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(resolve, reject) {
										var tx, inode, request;
										return regeneratorRuntime.wrap(function _callee10$(_context10) {
											while (1) {
												switch (_context10.prev = _context10.next) {
													case 0:
														tx = _this9.db.transaction(['inode']);
														inode = tx.objectStore('inode');
														request = inode.get(id);

														request.onsuccess = function (event) {
															resolve(event.target.result);
														};
														request.onerror = function (e) {
															resolve(null);
														};

													case 5:
													case 'end':
														return _context10.stop();
												}
											}
										}, _callee10, _this9);
									}));

									return function (_x18, _x19) {
										return _ref11.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context11.stop();
						}
					}
				}, _callee11, this);
			}));

			function _getINode(_x17) {
				return _ref10.apply(this, arguments);
			}

			return _getINode;
		}()
	}, {
		key: '_getPathINodeFromCache',
		value: function _getPathINodeFromCache(path) {
			// find inode key
			var segments = this._normalizeSegments(path);
			var parent = '/'; // '/' for root
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = segments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var seg = _step2.value;

					var key = [seg, parent];
					if (this.nameParentMap[key]) {
						parent = this.nameParentMap[key].id;
					} else {
						parent = null;
						break;
					}
				}

				// 如果找到了, parent应该大于0
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			if (!parent) {
				return null;
			}

			// return
			return this.keyMap[parent];
		}

		/**
   * 根据路径查找对应的inode, 返回的对象会额外包含主键, 字段名为_key
   */

	}, {
		key: '_getPathINode',
		value: function () {
			var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(path) {
				var _this10 = this;

				return regeneratorRuntime.wrap(function _callee13$(_context13) {
					while (1) {
						switch (_context13.prev = _context13.next) {
							case 0:
								return _context13.abrupt('return', new Promise(function () {
									var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(resolve, reject) {
										var segments, key, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, seg, tx, inode, request;

										return regeneratorRuntime.wrap(function _callee12$(_context12) {
											while (1) {
												switch (_context12.prev = _context12.next) {
													case 0:
														// find inode key
														segments = _this10._normalizeSegments(path);
														key = '/'; // '/' for root

														_iteratorNormalCompletion3 = true;
														_didIteratorError3 = false;
														_iteratorError3 = undefined;
														_context12.prev = 5;
														_iterator3 = segments[Symbol.iterator]();

													case 7:
														if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
															_context12.next = 17;
															break;
														}

														seg = _step3.value;
														_context12.next = 11;
														return _this10._getINodeKey(seg, key);

													case 11:
														key = _context12.sent;

														if (key) {
															_context12.next = 14;
															break;
														}

														return _context12.abrupt('break', 17);

													case 14:
														_iteratorNormalCompletion3 = true;
														_context12.next = 7;
														break;

													case 17:
														_context12.next = 23;
														break;

													case 19:
														_context12.prev = 19;
														_context12.t0 = _context12['catch'](5);
														_didIteratorError3 = true;
														_iteratorError3 = _context12.t0;

													case 23:
														_context12.prev = 23;
														_context12.prev = 24;

														if (!_iteratorNormalCompletion3 && _iterator3.return) {
															_iterator3.return();
														}

													case 26:
														_context12.prev = 26;

														if (!_didIteratorError3) {
															_context12.next = 29;
															break;
														}

														throw _iteratorError3;

													case 29:
														return _context12.finish(26);

													case 30:
														return _context12.finish(23);

													case 31:
														if (key) {
															_context12.next = 34;
															break;
														}

														resolve(null);
														return _context12.abrupt('return');

													case 34:

														// 得到inode
														tx = _this10.db.transaction(['inode']);
														inode = tx.objectStore('inode');
														request = inode.get(key);

														request.onsuccess = function (event) {
															resolve(event.target.result);
														};
														request.onerror = function (e) {
															resolve(null);
														};

													case 39:
													case 'end':
														return _context12.stop();
												}
											}
										}, _callee12, _this10, [[5, 19, 23, 31], [24,, 26, 30]]);
									}));

									return function (_x21, _x22) {
										return _ref13.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context13.stop();
						}
					}
				}, _callee13, this);
			}));

			function _getPathINode(_x20) {
				return _ref12.apply(this, arguments);
			}

			return _getPathINode;
		}()
	}, {
		key: '_getSubPathCountFromCache',
		value: function _getSubPathCountFromCache(path) {
			// 得到路径本身节点, 如果已经是节点了, 跳过
			var entry = typeof path == 'string' ? this._getPathINodeFromCache(path) : path;
			if (!entry) {
				return 0;
			}

			// get
			if (this.parentMap[entry.parent]) {
				return this.parentMap[entry.parent].length;
			} else {
				return 0;
			}
		}
	}, {
		key: '_getSubPathCount',
		value: function () {
			var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(path) {
				var _this11 = this;

				return regeneratorRuntime.wrap(function _callee15$(_context15) {
					while (1) {
						switch (_context15.prev = _context15.next) {
							case 0:
								return _context15.abrupt('return', new Promise(function () {
									var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(resolve, reject) {
										var entry, tx, inode, idx, req;
										return regeneratorRuntime.wrap(function _callee14$(_context14) {
											while (1) {
												switch (_context14.prev = _context14.next) {
													case 0:
														if (!(typeof path == 'string')) {
															_context14.next = 6;
															break;
														}

														_context14.next = 3;
														return _this11._getPathINode(path);

													case 3:
														_context14.t0 = _context14.sent;
														_context14.next = 7;
														break;

													case 6:
														_context14.t0 = path;

													case 7:
														entry = _context14.t0;

														if (entry) {
															_context14.next = 11;
															break;
														}

														resolve(null);
														return _context14.abrupt('return');

													case 11:

														// 查找直接子节点
														tx = _this11.db.transaction(['inode']);
														inode = tx.objectStore('inode');
														idx = inode.index('idx_parent');
														req = idx.getAllKeys(entry.id);

														req.onsuccess = function (keys) {
															resolve(keys.target.result ? keys.target.result.length : 0);
														};
														req.onerror = function (e) {
															resolve(0);
														};

													case 17:
													case 'end':
														return _context14.stop();
												}
											}
										}, _callee14, _this11);
									}));

									return function (_x24, _x25) {
										return _ref15.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context15.stop();
						}
					}
				}, _callee15, this);
			}));

			function _getSubPathCount(_x23) {
				return _ref14.apply(this, arguments);
			}

			return _getSubPathCount;
		}()
	}, {
		key: '_getSubPathINodeFromCacheRecursively',
		value: function _getSubPathINodeFromCacheRecursively(path, result) {
			var subPaths = this._getSubPathINodeFromCache(path);
			result.push.apply(result, _toConsumableArray(subPaths));
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = subPaths[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var subPath = _step4.value;

					if (subPath.dir) {
						this._getSubPathINodeFromCacheRecursively(subPath, result);
					}
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}
	}, {
		key: '_getSubPathINodeFromCache',
		value: function _getSubPathINodeFromCache(path) {
			// 得到路径本身节点, 如果已经是节点了, 跳过
			var entry = typeof path == 'string' ? this._getPathINodeFromCache(path) : path;
			if (!entry) {
				return [];
			}

			// 返回子节点
			return this.parentMap[entry.id] || [];
		}

		/**
   * 得到一个路径下的直接子路径节点, 不递归, 返回的node会附带_key
   */

	}, {
		key: '_getSubPathINode',
		value: function () {
			var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(path) {
				var _this12 = this;

				var tx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
				return regeneratorRuntime.wrap(function _callee17$(_context17) {
					while (1) {
						switch (_context17.prev = _context17.next) {
							case 0:
								return _context17.abrupt('return', new Promise(function () {
									var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(resolve, reject) {
										var entry, inode, idx, request;
										return regeneratorRuntime.wrap(function _callee16$(_context16) {
											while (1) {
												switch (_context16.prev = _context16.next) {
													case 0:
														if (!(typeof path == 'string')) {
															_context16.next = 6;
															break;
														}

														_context16.next = 3;
														return _this12._getPathINode(path);

													case 3:
														_context16.t0 = _context16.sent;
														_context16.next = 7;
														break;

													case 6:
														_context16.t0 = path;

													case 7:
														entry = _context16.t0;

														if (entry) {
															_context16.next = 11;
															break;
														}

														resolve([]);
														return _context16.abrupt('return');

													case 11:

														// 查找直接子节点
														tx = tx || _this12.db.transaction(['inode']);
														inode = tx.objectStore('inode');
														idx = inode.index('idx_parent');
														request = idx.getAll(entry.id);

														request.onsuccess = function (event) {
															resolve(event.target.result);
														};
														request.onerror = function (e) {
															resolve([]);
														};

													case 17:
													case 'end':
														return _context16.stop();
												}
											}
										}, _callee16, _this12);
									}));

									return function (_x28, _x29) {
										return _ref17.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context17.stop();
						}
					}
				}, _callee17, this);
			}));

			function _getSubPathINode(_x26) {
				return _ref16.apply(this, arguments);
			}

			return _getSubPathINode;
		}()

		/**
   * 删除一个inode, 如果inode是一个文件, 还要删除idata
   */

	}, {
		key: '_deleteINode',
		value: function () {
			var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(key, dir) {
				var _this13 = this;

				var tx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
				return regeneratorRuntime.wrap(function _callee19$(_context19) {
					while (1) {
						switch (_context19.prev = _context19.next) {
							case 0:
								return _context19.abrupt('return', new Promise(function () {
									var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(resolve, reject) {
										var inode, request;
										return regeneratorRuntime.wrap(function _callee18$(_context18) {
											while (1) {
												switch (_context18.prev = _context18.next) {
													case 0:
														tx = tx || _this13.db.transaction(['inode', 'idata'], 'readwrite');
														inode = tx.objectStore('inode');
														request = inode.delete(key);

														request.onsuccess = function (event) {
															if (!dir) {
																var idata = tx.objectStore('idata');
																var req = idata.delete(key);
																req.onsuccess = function (event) {
																	resolve(true);
																};
																req.onerror = function (e) {
																	resolve(false);
																};
															} else {
																resolve(true);
															}
														};
														request.onerror = function (e) {
															resolve(false);
														};

													case 5:
													case 'end':
														return _context18.stop();
												}
											}
										}, _callee18, _this13);
									}));

									return function (_x33, _x34) {
										return _ref19.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context19.stop();
						}
					}
				}, _callee19, this);
			}));

			function _deleteINode(_x30, _x31) {
				return _ref18.apply(this, arguments);
			}

			return _deleteINode;
		}()
	}, {
		key: '_deleteINodeRecursively',
		value: function () {
			var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(entry) {
				var tx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

				var subPathNodes, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, subPath;

				return regeneratorRuntime.wrap(function _callee20$(_context20) {
					while (1) {
						switch (_context20.prev = _context20.next) {
							case 0:
								if (!entry.dir) {
									_context20.next = 34;
									break;
								}

								_context20.next = 3;
								return this._getSubPathINode(entry, tx);

							case 3:
								subPathNodes = _context20.sent;
								_iteratorNormalCompletion5 = true;
								_didIteratorError5 = false;
								_iteratorError5 = undefined;
								_context20.prev = 7;
								_iterator5 = subPathNodes[Symbol.iterator]();

							case 9:
								if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
									_context20.next = 16;
									break;
								}

								subPath = _step5.value;
								_context20.next = 13;
								return this._deleteINodeRecursively(subPath, tx);

							case 13:
								_iteratorNormalCompletion5 = true;
								_context20.next = 9;
								break;

							case 16:
								_context20.next = 22;
								break;

							case 18:
								_context20.prev = 18;
								_context20.t0 = _context20['catch'](7);
								_didIteratorError5 = true;
								_iteratorError5 = _context20.t0;

							case 22:
								_context20.prev = 22;
								_context20.prev = 23;

								if (!_iteratorNormalCompletion5 && _iterator5.return) {
									_iterator5.return();
								}

							case 25:
								_context20.prev = 25;

								if (!_didIteratorError5) {
									_context20.next = 28;
									break;
								}

								throw _iteratorError5;

							case 28:
								return _context20.finish(25);

							case 29:
								return _context20.finish(22);

							case 30:
								_context20.next = 32;
								return this._deleteINode(entry.id, entry.dir, tx);

							case 32:
								_context20.next = 36;
								break;

							case 34:
								_context20.next = 36;
								return this._deleteINode(entry.id, entry.dir, tx);

							case 36:
							case 'end':
								return _context20.stop();
						}
					}
				}, _callee20, this, [[7, 18, 22, 30], [23,, 25, 29]]);
			}));

			function _deleteINodeRecursively(_x35) {
				return _ref20.apply(this, arguments);
			}

			return _deleteINodeRecursively;
		}()
	}, {
		key: 'mkdir',
		value: function () {
			var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(path, recursive) {
				var _this14 = this;

				return regeneratorRuntime.wrap(function _callee22$(_context22) {
					while (1) {
						switch (_context22.prev = _context22.next) {
							case 0:
								return _context22.abrupt('return', new Promise(function () {
									var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(resolve, reject) {
										return regeneratorRuntime.wrap(function _callee21$(_context21) {
											while (1) {
												switch (_context21.prev = _context21.next) {
													case 0:
														if (_this14.mkdirSync(path, !!recursive)) {
															resolve();
														} else {
															reject(new Error('Error: failed to mkdir ' + path));
														}

													case 1:
													case 'end':
														return _context21.stop();
												}
											}
										}, _callee21, _this14);
									}));

									return function (_x39, _x40) {
										return _ref22.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context22.stop();
						}
					}
				}, _callee22, this);
			}));

			function mkdir(_x37, _x38) {
				return _ref21.apply(this, arguments);
			}

			return mkdir;
		}()
	}, {
		key: 'mkdirSync',
		value: function mkdirSync(path, recursive) {
			// check
			if (!path || path.length <= 0) {
				return false;
			}

			// find deepest parent
			var segments = this._normalizeSegments(path);
			var parent = '/'; // '/' for root
			var segIdx = 0;
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = segments[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var seg = _step6.value;

					var key = [seg, parent];
					if (this.nameParentMap[key]) {
						parent = this.nameParentMap[key].id;
						segIdx++;
					} else {
						break;
					}
				}

				// 如果segIdx已经超出segments长度, 说明目录已经存在
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}

			if (segIdx >= segments.length) {
				return false;
			}

			// 如果不是递归, 但是路径不在最后一个分段, 那么无法创建
			if (!recursive && segIdx < segments.length - 1) {
				return false;
			}

			// 创建剩余的分段
			for (var i = segIdx; i < segments.length; i++) {
				// put to cache
				var now = Date.now();
				var entry = {
					id: (0, _uuid.v1)(),
					name: segments[i],
					parent: parent,
					mode: 0x777,
					lastAccessedTime: now,
					lastModifiedTime: now,
					dir: true,
					size: 0
				};
				parent = entry.id;
				this._putToCache(entry);

				// 异步写入db
				this._scheduleSync(PENDING_WRITE_DIR_INODE, { entry: entry });
			}

			// success
			return true;
		}
	}, {
		key: '_getFullPathFromCache',
		value: function _getFullPathFromCache(entry) {
			var buf = entry.name;
			while (entry.parent != '/') {
				entry = this.keyMap[entry.parent];
				buf = entry.name + '/' + buf;
			}
			buf = '/' + buf;
			return buf;
		}
	}, {
		key: '_removeFromCache',
		value: function _removeFromCache(entry) {
			delete this.keyMap[entry.id];
			delete this.nameParentMap[[entry.name, entry.parent]];
			delete this.parentMap[entry.parent];
			if (!entry.dir) {
				delete this.fileCache[entry.id];
			}
		}
	}, {
		key: '_removeFromCacheRecursively',
		value: function _removeFromCacheRecursively(entry) {
			if (entry.dir) {
				var subPathNodes = this._getSubPathINodeFromCache(entry);
				var _iteratorNormalCompletion7 = true;
				var _didIteratorError7 = false;
				var _iteratorError7 = undefined;

				try {
					for (var _iterator7 = subPathNodes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
						var subPath = _step7.value;

						this._removeFromCacheRecursively(subPath);
					}
				} catch (err) {
					_didIteratorError7 = true;
					_iteratorError7 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion7 && _iterator7.return) {
							_iterator7.return();
						}
					} finally {
						if (_didIteratorError7) {
							throw _iteratorError7;
						}
					}
				}

				this._removeFromCache(entry);
			} else {
				this._removeFromCache(entry);
			}
		}
	}, {
		key: 'rmdirSync',
		value: function rmdirSync(path, recursive) {
			// check
			path = path ? path.trim() : '';
			if (!path || path.length <= 0 || path == '/') {
				return false;
			}

			// find dir inode, ensure it is a directory
			var entry = this._getPathINodeFromCache(path);
			if (!entry || !entry.dir) {
				return false;
			}

			// get sub paths, check if it is empty
			if (!recursive) {
				var subPathCount = this._getSubPathCountFromCache(entry);
				if (subPathCount > 0) {
					return false;
				}
			}

			// start to delete
			if (recursive) {
				this._removeFromCacheRecursively(entry);
			} else {
				this._removeFromCache(entry);
			}

			// schedule sync
			this._scheduleSync(PENDING_DELETE_DIR_INODE, { entry: entry });

			// ok
			return true;
		}
	}, {
		key: 'rmdir',
		value: function () {
			var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(path, recursive) {
				var _this15 = this;

				return regeneratorRuntime.wrap(function _callee24$(_context24) {
					while (1) {
						switch (_context24.prev = _context24.next) {
							case 0:
								return _context24.abrupt('return', new Promise(function () {
									var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(resolve, reject) {
										return regeneratorRuntime.wrap(function _callee23$(_context23) {
											while (1) {
												switch (_context23.prev = _context23.next) {
													case 0:
														if (_this15.rmdirSync(path, !!recursive)) {
															resolve();
														} else {
															reject(new Error('Error: failed to delete dir: ' + path));
														}

													case 1:
													case 'end':
														return _context23.stop();
												}
											}
										}, _callee23, _this15);
									}));

									return function (_x43, _x44) {
										return _ref24.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context24.stop();
						}
					}
				}, _callee24, this);
			}));

			function rmdir(_x41, _x42) {
				return _ref23.apply(this, arguments);
			}

			return rmdir;
		}()
	}, {
		key: '_stringByDeleteLastPathComponent',
		value: function _stringByDeleteLastPathComponent(p) {
			if (typeof p == 'string') {
				var idx = p.lastIndexOf('/');
				if (idx != -1 && idx > 0) {
					p = p.substring(0, idx);
				}
			}
			return p;
		}
	}, {
		key: '_lastPathComponent',
		value: function _lastPathComponent(p) {
			if (typeof p == 'string') {
				// remove trailing /
				while (p.length > 1 && p.endsWith('/')) {
					p.substring(0, p.length - 1);
				}
				var idx = p.lastIndexOf('/');
				if (idx != -1 && idx < p.length - 1) {
					p = p.substring(idx + 1);
				}
			}
			return p;
		}
	}, {
		key: 'writeFileSync',
		value: function writeFileSync(path, data, encoding) {
			// check
			path = path ? this._normalizePath(path.trim()) : '';
			if (!path || path.length <= 0) {
				return false;
			}

			// check encoding
			encoding = encoding || 'utf8';
			var validEncoding = ["ascii", "base64", "binary", "hex", "ucs2", "ucs-2", "utf16le", "utf-16le", "utf-8", "utf8", "latin1"];
			if (validEncoding.indexOf(encoding) == -1) {
				return false;
			}

			// find inode, ensure it is a file or not exist
			var entry = this._getPathINodeFromCache(path);
			if (entry && entry.dir) {
				return false;
			}

			// find parent dir, create it if not exist
			var parentPath = this._stringByDeleteLastPathComponent(path);
			var parentEntry = this._getPathINodeFromCache(parentPath);
			if (!parentEntry) {
				// create parent folder
				if (!this.mkdirSync(parentPath, true)) {
					return false;
				}

				// get parent entry again
				parentEntry = this._getPathINodeFromCache(parentPath);
			}

			// build data
			var buf = null;
			switch (encoding) {
				case 'base64':
					if (typeof data == 'string') {
						var enc = new TextEncoder();
						buf = enc.encode(btoa(data)).buffer;
					} else if (data instanceof ArrayBuffer) {
						buf = _utils2.default.arrayBufferToBase64(data);
					}
					break;
				case 'hex':
					{
						var tmp = data;
						if (typeof data == 'string') {
							tmp = _utils2.default.textToArrayBuffer(data);
						}
						var str = _utils2.default.buf2hex(tmp);
						buf = _utils2.default.textToArrayBuffer(str);
						break;
					}
				default:
					// TODO 其它的暂时都按utf8处理, 以后再完善
					if (typeof data == 'string') {
						buf = _utils2.default.textToArrayBuffer(data);
					} else if (data instanceof ArrayBuffer) {
						buf = data;
					}
					break;
			}
			if (!buf) {
				return false;
			}

			// write inode and idata
			var now = Date.now();
			var filename = this._lastPathComponent(path);
			if (!entry) {
				entry = {
					id: (0, _uuid.v1)(),
					name: filename,
					parent: parentEntry.id,
					mode: 0x777,
					lastAccessedTime: now,
					lastModifiedTime: now,
					dir: false,
					size: buf.byteLength
				};
				this._putToCache(entry, buf);
			} else {
				// 如果文件已经存在, 更新信息
				entry.lastAccessedTime = now;
				entry.lastModifiedTime = now;
				entry.size = buf.byteLength;
				this.fileCache[entry.id] = buf;
			}

			// schedule sync
			this._scheduleSync(PENDING_WRITE_FILE_INODE, {
				entry: entry,
				data: buf
			});

			// ok
			return true;
		}
	}, {
		key: 'writeFile',
		value: function () {
			var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26(path, data, encoding) {
				var _this16 = this;

				return regeneratorRuntime.wrap(function _callee26$(_context26) {
					while (1) {
						switch (_context26.prev = _context26.next) {
							case 0:
								return _context26.abrupt('return', new Promise(function () {
									var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(resolve, reject) {
										return regeneratorRuntime.wrap(function _callee25$(_context25) {
											while (1) {
												switch (_context25.prev = _context25.next) {
													case 0:
														if (_this16.writeFileSync(path, data, encoding)) {
															resolve();
														} else {
															reject(new Error('Error: failed to write file: ' + path));
														}

													case 1:
													case 'end':
														return _context25.stop();
												}
											}
										}, _callee25, _this16);
									}));

									return function (_x48, _x49) {
										return _ref26.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context26.stop();
						}
					}
				}, _callee26, this);
			}));

			function writeFile(_x45, _x46, _x47) {
				return _ref25.apply(this, arguments);
			}

			return writeFile;
		}()
	}, {
		key: 'readFileSync',
		value: function readFileSync(path, encoding, position, length) {
			// check
			path = path ? this._normalizePath(path.trim()) : '';
			if (!path || path.length <= 0) {
				return;
			}

			// find inode, ensure it is a file
			var entry = this._getPathINodeFromCache(path);
			if (!entry || entry.dir) {
				return;
			}

			// get array buffer
			var buf = this.fileCache[entry.id];
			if (!buf) {
				return;
			}

			// check position & length
			if (position !== undefined || length !== undefined) {
				position = position || 0;
				length = length || buf.byteLength;
				buf = buf.slice(position, position + length);
			}

			// check encoding, not set means return array buffer
			if (encoding === undefined) {
				return buf;
			} else {
				switch (encoding) {
					case 'hex':
						return _utils2.default.buf2hex(buf);
					case 'base64':
						return _utils2.default.arrayBufferToBase64(buf);
					case 'utf16le':
					case 'utf-16le':
					case 'ucs2':
					case 'ucs-2':
						return String.fromCharCode.apply(null, new Uint16Array(buf));
					default:
						{
							var d = new TextDecoder();
							return d.decode(buf);
						}
				}
			}
		}
	}, {
		key: 'readFile',
		value: function () {
			var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28(filePath, encoding, position, length) {
				var _this17 = this;

				return regeneratorRuntime.wrap(function _callee28$(_context28) {
					while (1) {
						switch (_context28.prev = _context28.next) {
							case 0:
								return _context28.abrupt('return', new Promise(function () {
									var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(resolve, reject) {
										var data;
										return regeneratorRuntime.wrap(function _callee27$(_context27) {
											while (1) {
												switch (_context27.prev = _context27.next) {
													case 0:
														data = _this17.readFileSync(filePath, encoding, position, length);

														if (data) {
															resolve(data);
														} else {
															reject(new Error('Error: failed to read file: ' + filePath));
														}

													case 2:
													case 'end':
														return _context27.stop();
												}
											}
										}, _callee27, _this17);
									}));

									return function (_x54, _x55) {
										return _ref28.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context28.stop();
						}
					}
				}, _callee28, this);
			}));

			function readFile(_x50, _x51, _x52, _x53) {
				return _ref27.apply(this, arguments);
			}

			return readFile;
		}()
	}, {
		key: 'saveFile',
		value: function () {
			var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30(tempFilePath, filePath) {
				var _this18 = this;

				return regeneratorRuntime.wrap(function _callee30$(_context30) {
					while (1) {
						switch (_context30.prev = _context30.next) {
							case 0:
								return _context30.abrupt('return', new Promise(function () {
									var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29(resolve, reject) {
										var savedFilePath;
										return regeneratorRuntime.wrap(function _callee29$(_context29) {
											while (1) {
												switch (_context29.prev = _context29.next) {
													case 0:
														savedFilePath = _this18.saveFileSync(tempFilePath, filePath);

														if (savedFilePath) {
															resolve(savedFilePath);
														} else {
															reject(new Error('Error: failed to save file: ' + tempFilePath + ' -> ' + filePath));
														}

													case 2:
													case 'end':
														return _context29.stop();
												}
											}
										}, _callee29, _this18);
									}));

									return function (_x58, _x59) {
										return _ref30.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context30.stop();
						}
					}
				}, _callee30, this);
			}));

			function saveFile(_x56, _x57) {
				return _ref29.apply(this, arguments);
			}

			return saveFile;
		}()
	}, {
		key: 'saveFileSync',
		value: function saveFileSync(tempFilePath, filePath) {
			// check params
			tempFilePath = tempFilePath ? tempFilePath.trim() : '';
			filePath = filePath ? filePath.trim() : '';
			if (!tempFilePath || tempFilePath.length <= 0) {
				return null;
			}

			// if file path is not set, auto generate it
			if (!filePath || filePath.length <= 0) {
				var _filename = this._lastPathComponent(tempFilePath);
				filePath = _const2.default.LETO_SAVE_DIR + '/' + _filename;
			}

			// get temp file entry & buf
			var tempEntry = this._getPathINodeFromCache(tempFilePath);
			if (!tempEntry || tempEntry.dir) {
				return null;
			}
			var buf = this.fileCache[tempEntry.id];
			if (!buf) {
				return null;
			}

			// find dest file inode, ensure it is a file or not exist
			var entry = this._getPathINodeFromCache(filePath);
			if (entry && entry.dir) {
				return null;
			}

			// find parent dir, create it if not exist
			var parentPath = this._stringByDeleteLastPathComponent(filePath);
			var parentEntry = this._getPathINodeFromCache(parentPath);
			if (!parentEntry) {
				// create parent folder
				if (!this.mkdirSync(parentPath, true)) {
					return null;
				}

				// get parent entry again
				parentEntry = this._getPathINodeFromCache(parentPath);
			}

			// write inode and idata
			var now = Date.now();
			var filename = this._lastPathComponent(filePath);
			if (!entry) {
				entry = {
					id: (0, _uuid.v1)(),
					name: filename,
					parent: parentEntry.id,
					mode: 0x777,
					lastAccessedTime: now,
					lastModifiedTime: now,
					dir: false,
					size: buf.byteLength
				};
				this._putToCache(entry, buf);
			} else {
				// 如果文件已经存在, 更新信息
				entry.lastModifiedTime = now;
				entry.size = buf.byteLength;
				this.fileCache[entry.id] = buf;
			}

			// remove temp entry from cache
			this._removeFromCache(tempEntry);

			// sync
			this._scheduleSync(PENDING_DELETE_FILE_INODE, { entry: tempEntry });
			this._scheduleSync(PENDING_WRITE_FILE_INODE, { entry: entry, data: buf });

			// ok
			return filePath;
		}
	}, {
		key: 'unlink',
		value: function unlink(filePath) {
			var _this19 = this;

			return new Promise(function () {
				var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31(resolve, reject) {
					return regeneratorRuntime.wrap(function _callee31$(_context31) {
						while (1) {
							switch (_context31.prev = _context31.next) {
								case 0:
									if (_this19.unlinkSync(filePath)) {
										resolve();
									} else {
										reject(new Error('Error: failed to unlink file: ' + filePath));
									}

								case 1:
								case 'end':
									return _context31.stop();
							}
						}
					}, _callee31, _this19);
				}));

				return function (_x60, _x61) {
					return _ref31.apply(this, arguments);
				};
			}());
		}
	}, {
		key: 'unlinkSync',
		value: function unlinkSync(filePath) {
			// check params
			filePath = filePath ? filePath.trim() : '';
			if (!filePath || filePath.length <= 0) {
				return false;
			}

			// find file inode, ensure it is a file
			var entry = this._getPathINodeFromCache(filePath);
			if (!entry || entry.dir) {
				return false;
			}

			// remove entry from cache
			this._removeFromCache(entry);

			// sync
			this._scheduleSync(PENDING_DELETE_FILE_INODE, { entry: entry });

			// ok
			return true;
		}
	}, {
		key: 'getSavedFileList',
		value: function getSavedFileList() {
			// get sub list
			var subPaths = this._getSubPathINodeFromCacheRecursively(_const2.default.LETO_SAVE_DIR);

			// build file list
			var fileList = [];
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = subPaths[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var subPath = _step8.value;

					fileList.push({
						filePath: this._getFullPathFromCache(subPath),
						size: subPath.size,
						createTime: subPath.lastAccessedTime
					});
				}

				// return
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			return fileList;
		}
	}, {
		key: 'removeSavedFile',
		value: function removeSavedFile(filePath) {
			var _this20 = this;

			return new Promise(function (resolve, reject) {
				// check params
				filePath = filePath ? filePath.trim() : '';
				if (!filePath || filePath.length <= 0) {
					reject(new Error('fail file not exist: ' + filePath));
					return;
				}

				// 如果是一个相对路径, 改成绝对路径
				if (!filePath.startsWith('/')) {
					filePath = _const2.default.LETO_SAVE_DIR + '/' + filePath;
				}

				// find file inode, ensure it is a file
				var entry = _this20._getPathINodeFromCache(filePath);
				if (!entry) {
					reject(new Error('fail file not exist: ' + filePath));
					return;
				}
				if (entry.dir) {
					reject(new Error('fail file is a directory: ' + filePath));
					return;
				}

				// remove entry from cache
				_this20._removeFromCache(entry);

				// sync
				_this20._scheduleSync(PENDING_DELETE_FILE_INODE, { entry: entry });

				// ok
				resolve();
			});
		}
	}, {
		key: 'access',
		value: function () {
			var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33(path) {
				var _this21 = this;

				return regeneratorRuntime.wrap(function _callee33$(_context33) {
					while (1) {
						switch (_context33.prev = _context33.next) {
							case 0:
								return _context33.abrupt('return', new Promise(function () {
									var _ref33 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(resolve, reject) {
										return regeneratorRuntime.wrap(function _callee32$(_context32) {
											while (1) {
												switch (_context32.prev = _context32.next) {
													case 0:
														if (_this21.accessSync(path)) {
															resolve(true);
														} else {
															reject(new Error('Error: can not access ' + path));
														}

													case 1:
													case 'end':
														return _context32.stop();
												}
											}
										}, _callee32, _this21);
									}));

									return function (_x63, _x64) {
										return _ref33.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context33.stop();
						}
					}
				}, _callee33, this);
			}));

			function access(_x62) {
				return _ref32.apply(this, arguments);
			}

			return access;
		}()
	}, {
		key: 'accessSync',
		value: function accessSync(path) {
			// check params
			path = path ? path.trim() : '';
			if (!path || path.length <= 0) {
				return false;
			}

			// find inode
			var entry = this._getPathINodeFromCache(path);
			if (!entry) {
				return false;
			}

			// TODO 简单起见, 这里不检查mode了, 一律认为可以访问
			return true;
		}
	}, {
		key: 'appendFile',
		value: function () {
			var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(filePath, data, encoding) {
				var _this22 = this;

				return regeneratorRuntime.wrap(function _callee35$(_context35) {
					while (1) {
						switch (_context35.prev = _context35.next) {
							case 0:
								return _context35.abrupt('return', new Promise(function () {
									var _ref35 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(resolve, reject) {
										return regeneratorRuntime.wrap(function _callee34$(_context34) {
											while (1) {
												switch (_context34.prev = _context34.next) {
													case 0:
														if (_this22.appendFileSync(filePath, data, encoding)) {
															resolve(true);
														} else {
															reject(new Error('Error: can not append file to ' + filePath));
														}

													case 1:
													case 'end':
														return _context34.stop();
												}
											}
										}, _callee34, _this22);
									}));

									return function (_x68, _x69) {
										return _ref35.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context35.stop();
						}
					}
				}, _callee35, this);
			}));

			function appendFile(_x65, _x66, _x67) {
				return _ref34.apply(this, arguments);
			}

			return appendFile;
		}()
	}, {
		key: 'appendFileSync',
		value: function appendFileSync(filePath, data, encoding) {
			// check params
			filePath = filePath ? filePath.trim() : '';
			if (!filePath || filePath.length <= 0) {
				return false;
			}

			// find file inode, ensure it is a file
			var entry = this._getPathINodeFromCache(filePath);
			if (!entry || entry.dir) {
				return false;
			}

			// build data
			var buf = null;
			switch (encoding) {
				case 'base64':
					if (typeof data == 'string') {
						var enc = new TextEncoder();
						buf = enc.encode(btoa(data)).buffer;
					} else if (data instanceof ArrayBuffer) {
						buf = _utils2.default.arrayBufferToBase64(data);
					}
					break;
				case 'hex':
					{
						var tmp = data;
						if (typeof data == 'string') {
							tmp = _utils2.default.textToArrayBuffer(data);
						}
						var str = _utils2.default.buf2hex(tmp);
						buf = _utils2.default.textToArrayBuffer(str);
						break;
					}
				default:
					// TODO 其它的暂时都按utf8处理, 以后再完善
					if (typeof data == 'string') {
						buf = _utils2.default.textToArrayBuffer(data);
					} else if (data instanceof ArrayBuffer) {
						buf = data;
					}
					break;
			}
			if (!buf) {
				return false;
			}

			// concat buffer
			var oldBuf = this.fileCache[entry.id];
			var newBuf = _utils2.default.concatArrayBuffer(oldBuf, buf);

			// update entry info
			var now = Date.now();
			entry.size = newBuf.byteLength;
			entry.lastModifiedTime = now;

			// update cache
			this.fileCache[entry.id] = newBuf;

			// sync
			this._scheduleSync(PENDING_WRITE_FILE_INODE, { entry: entry, data: newBuf });

			// ok
			return true;
		}
	}, {
		key: 'copyFile',
		value: function () {
			var _ref36 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37(srcPath, destPath) {
				var _this23 = this;

				return regeneratorRuntime.wrap(function _callee37$(_context37) {
					while (1) {
						switch (_context37.prev = _context37.next) {
							case 0:
								return _context37.abrupt('return', new Promise(function () {
									var _ref37 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36(resolve, reject) {
										return regeneratorRuntime.wrap(function _callee36$(_context36) {
											while (1) {
												switch (_context36.prev = _context36.next) {
													case 0:
														if (_this23.copyFileSync(srcPath, destPath)) {
															resolve(true);
														} else {
															reject(new Error('Error: can not copy file to ' + srcPath + ' -> ' + destPath));
														}

													case 1:
													case 'end':
														return _context36.stop();
												}
											}
										}, _callee36, _this23);
									}));

									return function (_x72, _x73) {
										return _ref37.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context37.stop();
						}
					}
				}, _callee37, this);
			}));

			function copyFile(_x70, _x71) {
				return _ref36.apply(this, arguments);
			}

			return copyFile;
		}()
	}, {
		key: 'copyFileSync',
		value: function copyFileSync(srcPath, destPath) {
			// check params
			srcPath = srcPath ? srcPath.trim() : '';
			if (!srcPath || srcPath.length <= 0) {
				return false;
			}

			// find src entry
			var srcEntry = this._getPathINodeFromCache(srcPath);
			if (!srcEntry || srcEntry.dir) {
				return false;
			}
			var srcBuf = this.fileCache[srcEntry.id];
			if (!srcBuf) {
				return false;
			}

			// find dest file inode, ensure it is a file or not exist
			var entry = this._getPathINodeFromCache(destPath);
			if (entry && entry.dir) {
				return false;
			}

			// ensure dest parent exist
			var parentPath = this._stringByDeleteLastPathComponent(destPath);
			var parentEntry = this._getPathINodeFromCache(parentPath);
			if (!parentEntry) {
				// create parent folder
				if (!this.mkdirSync(parentPath, true)) {
					return false;
				}
			}

			// write inode and idata
			var dstBuf = srcBuf.slice(0, srcBuf.byteLength);
			var now = Date.now();
			var filename = this._lastPathComponent(destPath);
			if (!entry) {
				entry = {
					id: (0, _uuid.v1)(),
					name: filename,
					parent: parentEntry.id,
					mode: 0x777,
					lastAccessedTime: now,
					lastModifiedTime: now,
					dir: false,
					size: dstBuf.byteLength
				};
				this._putToCache(entry, dstBuf);
			} else {
				// 如果文件已经存在, 更新信息
				entry.lastModifiedTime = now;
				entry.size = dstBuf.byteLength;
				this.fileCache[entry.id] = dstBuf;
			}

			// sync
			this._scheduleSync(PENDING_WRITE_FILE_INODE, { entry: entry, data: dstBuf });

			// ok
			return true;
		}
	}, {
		key: 'getFileInfo',
		value: function getFileInfo(filePath) {
			// check params
			filePath = filePath ? filePath.trim() : '';
			if (!filePath || filePath.length <= 0) {
				return null;
			}

			// find file inode, ensure it is a file
			var entry = this._getPathINodeFromCache(filePath);
			if (!entry || entry.dir) {
				return null;
			}

			// return size
			return { size: entry.size };
		}
	}, {
		key: 'readdir',
		value: function () {
			var _ref38 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38(dirPath) {
				var _this24 = this;

				return regeneratorRuntime.wrap(function _callee38$(_context38) {
					while (1) {
						switch (_context38.prev = _context38.next) {
							case 0:
								return _context38.abrupt('return', new Promise(function (resolve, reject) {
									resolve(_this24.readdirSync(dirPath));
								}));

							case 1:
							case 'end':
								return _context38.stop();
						}
					}
				}, _callee38, this);
			}));

			function readdir(_x74) {
				return _ref38.apply(this, arguments);
			}

			return readdir;
		}()
	}, {
		key: 'readdirSync',
		value: function readdirSync(dirPath) {
			// check params
			dirPath = dirPath ? dirPath.trim() : '';
			if (!dirPath || dirPath.length <= 0) {
				return [];
			}

			// find file inode, ensure it is a dir
			var entry = this._getPathINodeFromCache(dirPath);
			if (!entry || !entry.dir) {
				return [];
			}

			// get sub
			var subPaths = this._getSubPathINodeFromCache(dirPath);
			var files = [];
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = subPaths[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var subPath = _step9.value;

					if (!subPath.dir) {
						files.push(subPath.name);
					}
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			return files;
		}
	}, {
		key: 'rename',
		value: function () {
			var _ref39 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee40(oldPath, newPath) {
				var _this25 = this;

				return regeneratorRuntime.wrap(function _callee40$(_context40) {
					while (1) {
						switch (_context40.prev = _context40.next) {
							case 0:
								return _context40.abrupt('return', new Promise(function () {
									var _ref40 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39(resolve, reject) {
										return regeneratorRuntime.wrap(function _callee39$(_context39) {
											while (1) {
												switch (_context39.prev = _context39.next) {
													case 0:
														if (_this25.renameSync(oldPath, newPath)) {
															resolve(true);
														} else {
															reject(new Error('Error: can not rename file: ' + oldPath + ' -> ' + newPath));
														}

													case 1:
													case 'end':
														return _context39.stop();
												}
											}
										}, _callee39, _this25);
									}));

									return function (_x77, _x78) {
										return _ref40.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context40.stop();
						}
					}
				}, _callee40, this);
			}));

			function rename(_x75, _x76) {
				return _ref39.apply(this, arguments);
			}

			return rename;
		}()
	}, {
		key: 'renameSync',
		value: function renameSync(oldPath, newPath) {
			// check params
			oldPath = oldPath ? oldPath.trim() : '';
			if (!oldPath || oldPath.length <= 0) {
				return false;
			}

			// find src entry
			var srcEntry = this._getPathINodeFromCache(oldPath);
			if (!srcEntry || srcEntry.dir) {
				return false;
			}
			var srcBuf = this.fileCache[srcEntry.id];
			if (!srcBuf) {
				return false;
			}

			// find dest file inode, ensure it is a file or not exist
			var entry = this._getPathINodeFromCache(newPath);
			if (entry && entry.dir) {
				return false;
			}

			// ensure dest parent exist
			var parentPath = this._stringByDeleteLastPathComponent(newPath);
			var parentEntry = this._getPathINodeFromCache(parentPath);
			if (!parentEntry) {
				// create parent folder
				if (!this.mkdirSync(parentPath, true)) {
					return false;
				}
			}

			// remove old entry
			this._removeFromCache(srcEntry);

			// write inode and idata
			var now = Date.now();
			var filename = this._lastPathComponent(newPath);
			if (!entry) {
				entry = {
					id: (0, _uuid.v1)(),
					name: filename,
					parent: parentEntry.id,
					mode: 0x777,
					lastAccessedTime: now,
					lastModifiedTime: now,
					dir: false,
					size: srcBuf.byteLength
				};
				this._putToCache(entry, srcBuf);
			} else {
				// 如果文件已经存在, 更新信息
				entry.lastModifiedTime = now;
				entry.size = srcBuf.byteLength;
				this.fileCache[entry.id] = srcBuf;
			}

			// sync
			this._scheduleSync(PENDING_DELETE_FILE_INODE, { entry: srcEntry });
			this._scheduleSync(PENDING_WRITE_FILE_INODE, { entry: entry, data: srcBuf });

			// ok
			return true;
		}
	}, {
		key: 'stat',
		value: function () {
			var _ref41 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee42(path, recursive) {
				var _this26 = this;

				return regeneratorRuntime.wrap(function _callee42$(_context42) {
					while (1) {
						switch (_context42.prev = _context42.next) {
							case 0:
								return _context42.abrupt('return', new Promise(function () {
									var _ref42 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee41(resolve, reject) {
										var ret;
										return regeneratorRuntime.wrap(function _callee41$(_context41) {
											while (1) {
												switch (_context41.prev = _context41.next) {
													case 0:
														ret = _this26.statSync(path, recursive);

														if (ret) {
															resolve(ret);
														} else {
															reject(new Error('Error: can not get stat: ' + path));
														}

													case 2:
													case 'end':
														return _context41.stop();
												}
											}
										}, _callee41, _this26);
									}));

									return function (_x81, _x82) {
										return _ref42.apply(this, arguments);
									};
								}()));

							case 1:
							case 'end':
								return _context42.stop();
						}
					}
				}, _callee42, this);
			}));

			function stat(_x79, _x80) {
				return _ref41.apply(this, arguments);
			}

			return stat;
		}()
	}, {
		key: 'statSync',
		value: function statSync(path, recursive) {
			// check params
			path = path ? path.trim() : '';
			if (!path || path.length <= 0) {
				return false;
			}

			// find inode, ensure it is here
			var entry = this._getPathINodeFromCache(path);
			if (!entry) {
				return false;
			}

			// if file, just return
			if (!entry.dir || !recursive) {
				var stat = new _stats_js2.default();
				stat.dir = entry.dir;
				stat.size = entry.size;
				stat.lastAccessedTime = entry.lastAccessedTime;
				stat.lastModifiedTime = entry.lastModifiedTime;
				stat.mode = entry.mode;
				return stat;
			} else {
				var stats = {};
				var subPaths = [];
				this._getSubPathINodeFromCacheRecursively(path, subPaths);
				var _iteratorNormalCompletion10 = true;
				var _didIteratorError10 = false;
				var _iteratorError10 = undefined;

				try {
					for (var _iterator10 = subPaths[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
						var subPath = _step10.value;

						var fullPath = this._getFullPathFromCache(subPath);
						var _stat = new _stats_js2.default();
						_stat.dir = subPath.dir;
						_stat.size = subPath.size;
						_stat.lastAccessedTime = subPath.lastAccessedTime;
						_stat.lastModifiedTime = subPath.lastModifiedTime;
						_stat.mode = subPath.mode;
						stats[fullPath] = _stat;
					}
				} catch (err) {
					_didIteratorError10 = true;
					_iteratorError10 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion10 && _iterator10.return) {
							_iterator10.return();
						}
					} finally {
						if (_didIteratorError10) {
							throw _iteratorError10;
						}
					}
				}

				return stats;
			}
		}
	}, {
		key: 'unzip',
		value: function () {
			var _ref43 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee43(zipFilePath, targetPath) {
				var _this27 = this;

				return regeneratorRuntime.wrap(function _callee43$(_context43) {
					while (1) {
						switch (_context43.prev = _context43.next) {
							case 0:
								return _context43.abrupt('return', new Promise(function (resolve, reject) {
									_this27.readFile(zipFilePath).then(function (data) {
										LetoJSZip.loadAsync(data).then(function (zip) {
											var files = Object.keys(zip.files);
											var c = files.length;
											files.forEach(function (filename) {
												if (!zip.files[filename].dir) {
													zip.files[filename].async('arraybuffer').then(function (b) {
														_this27.writeFile(targetPath + '/' + filename, b).then(function (r) {
															c--;
															if (c <= 0) {
																resolve();
															}
														}).catch(function (e) {
															c--;
															if (c <= 0) {
																resolve();
															}
														});
													}).catch(function (e) {
														c--;
														if (c <= 0) {
															resolve();
														}
													});
												} else {
													_this27.mkdir(targetPath + '/' + filename, true).then(function (r) {
														c--;
														if (c <= 0) {
															resolve();
														}
													}).catch(function (e) {
														c--;
														if (c <= 0) {
															resolve();
														}
													});
												}
											});
										});
									}).catch(function (e) {
										resolve();
									});
								}));

							case 1:
							case 'end':
								return _context43.stop();
						}
					}
				}, _callee43, this);
			}));

			function unzip(_x83, _x84) {
				return _ref43.apply(this, arguments);
			}

			return unzip;
		}()
	}]);

	return IndexedDBFS;
}();

exports.default = IndexedDBFS;

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__v1_js__ = __webpack_require__(34);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "v1", function() { return __WEBPACK_IMPORTED_MODULE_0__v1_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__v3_js__ = __webpack_require__(35);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "v3", function() { return __WEBPACK_IMPORTED_MODULE_1__v3_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__v4_js__ = __webpack_require__(37);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "v4", function() { return __WEBPACK_IMPORTED_MODULE_2__v4_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__v5_js__ = __webpack_require__(38);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "v5", function() { return __WEBPACK_IMPORTED_MODULE_3__v5_js__["a"]; });





/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rng_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bytesToUuid_js__ = __webpack_require__(7);

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || __WEBPACK_IMPORTED_MODULE_0__rng_js__["a" /* default */])();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : Object(__WEBPACK_IMPORTED_MODULE_1__bytesToUuid_js__["a" /* default */])(b);
}

/* harmony default export */ __webpack_exports__["a"] = (v1);

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__v35_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__md5_js__ = __webpack_require__(36);


var v3 = Object(__WEBPACK_IMPORTED_MODULE_0__v35_js__["a" /* default */])('v3', 0x30, __WEBPACK_IMPORTED_MODULE_1__md5_js__["a" /* default */]);
/* harmony default export */ __webpack_exports__["a"] = (v3);

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
 * Browser-compatible JavaScript MD5
 *
 * Modification of JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
function md5(bytes) {
  if (typeof bytes == 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Array(msg.length);

    for (var i = 0; i < msg.length; i++) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
/*
 * Convert an array of little-endian words to an array of bytes
 */


function md5ToHexEncodedArray(input) {
  var i;
  var x;
  var output = [];
  var length32 = input.length * 32;
  var hexTab = '0123456789abcdef';
  var hex;

  for (i = 0; i < length32; i += 8) {
    x = input[i >> 5] >>> i % 32 & 0xff;
    hex = parseInt(hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f), 16);
    output.push(hex);
  }

  return output;
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */


function wordsToMd5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;
  var i;
  var olda;
  var oldb;
  var oldc;
  var oldd;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/*
 * Convert an array bytes to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */


function bytesToWords(input) {
  var i;
  var output = [];
  output[(input.length >> 2) - 1] = undefined;

  for (i = 0; i < output.length; i += 1) {
    output[i] = 0;
  }

  var length8 = input.length * 8;

  for (i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 0xff) << i % 32;
  }

  return output;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */


function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}

function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}

function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}

function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/* harmony default export */ __webpack_exports__["a"] = (md5);

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rng_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bytesToUuid_js__ = __webpack_require__(7);



function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof options == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }

  options = options || {};
  var rnds = options.random || (options.rng || __WEBPACK_IMPORTED_MODULE_0__rng_js__["a" /* default */])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || Object(__WEBPACK_IMPORTED_MODULE_1__bytesToUuid_js__["a" /* default */])(rnds);
}

/* harmony default export */ __webpack_exports__["a"] = (v4);

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__v35_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sha1_js__ = __webpack_require__(39);


var v5 = Object(__WEBPACK_IMPORTED_MODULE_0__v35_js__["a" /* default */])('v5', 0x50, __WEBPACK_IMPORTED_MODULE_1__sha1_js__["a" /* default */]);
/* harmony default export */ __webpack_exports__["a"] = (v5);

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Adapted from Chris Veness' SHA1 code at
// http://www.movable-type.co.uk/scripts/sha1.html
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;

    case 1:
      return x ^ y ^ z;

    case 2:
      return x & y ^ x & z ^ y & z;

    case 3:
      return x ^ y ^ z;
  }
}

function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}

function sha1(bytes) {
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  if (typeof bytes == 'string') {
    var msg = unescape(encodeURIComponent(bytes)); // UTF8 escape

    bytes = new Array(msg.length);

    for (var i = 0; i < msg.length; i++) {
      bytes[i] = msg.charCodeAt(i);
    }
  }

  bytes.push(0x80);
  var l = bytes.length / 4 + 2;
  var N = Math.ceil(l / 16);
  var M = new Array(N);

  for (var i = 0; i < N; i++) {
    M[i] = new Array(16);

    for (var j = 0; j < 16; j++) {
      M[i][j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }
  }

  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 0xffffffff;

  for (var i = 0; i < N; i++) {
    var W = new Array(80);

    for (var t = 0; t < 16; t++) {
      W[t] = M[i][t];
    }

    for (var t = 16; t < 80; t++) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    var a = H[0];
    var b = H[1];
    var c = H[2];
    var d = H[3];
    var e = H[4];

    for (var t = 0; t < 80; t++) {
      var s = Math.floor(t / 20);
      var T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }

    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }

  return [H[0] >> 24 & 0xff, H[0] >> 16 & 0xff, H[0] >> 8 & 0xff, H[0] & 0xff, H[1] >> 24 & 0xff, H[1] >> 16 & 0xff, H[1] >> 8 & 0xff, H[1] & 0xff, H[2] >> 24 & 0xff, H[2] >> 16 & 0xff, H[2] >> 8 & 0xff, H[2] & 0xff, H[3] >> 24 & 0xff, H[3] >> 16 & 0xff, H[3] >> 8 & 0xff, H[3] & 0xff, H[4] >> 24 & 0xff, H[4] >> 16 & 0xff, H[4] >> 8 & 0xff, H[4] & 0xff];
}

/* harmony default export */ __webpack_exports__["a"] = (sha1);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stats_js = function () {
	function Stats_js() {
		_classCallCheck(this, Stats_js);

		this.mode = 0x777;
		this.size = 0;
		this.lastAccessedTime = 0;
		this.lastModifiedTime = 0;
		this.dir = false;
	}

	_createClass(Stats_js, [{
		key: 'isDirectory',
		value: function isDirectory() {
			return this.dir;
		}
	}, {
		key: 'isFile',
		value: function isFile() {
			return !this.dir;
		}
	}]);

	return Stats_js;
}();

exports.default = Stats_js;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
// module14 predefinedColor

var predefinedColor = exports.predefinedColor = {
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aqua: "#00ffff",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	black: "#000000",
	blanchedalmond: "#ffebcd",
	blue: "#0000ff",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgrey: "#a9a9a9",
	darkgreen: "#006400",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	fuchsia: "#ff00ff",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	gold: "#ffd700",
	goldenrod: "#daa520",
	gray: "#808080",
	grey: "#808080",
	green: "#008000",
	greenyellow: "#adff2f",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavender: "#e6e6fa",
	lavenderblush: "#fff0f5",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgrey: "#d3d3d3",
	lightgreen: "#90ee90",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	lime: "#00ff00",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	maroon: "#800000",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	navy: "#000080",
	oldlace: "#fdf5e6",
	olive: "#808000",
	olivedrab: "#6b8e23",
	orange: "#ffa500",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	purple: "#800080",
	rebeccapurple: "#663399",
	red: "#ff0000",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	silver: "#c0c0c0",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	teal: "#008080",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	white: "#ffffff",
	whitesmoke: "#f5f5f5",
	yellow: "#ffff00",
	yellowgreen: "#9acd32"
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 500MB
var LIMIT_SIZE = 500 * 1024;

// storage directory for current user and current app, will be
// reset after app id and user id got
var directory = '__leto_storage__';

// use user id and app id to separate storage space
var appId = null;
var userId = null;

function currentSize() {
	var total = 0;
	for (var x in localStorage) {
		var amount = localStorage[x].length * 2 / 1024;
		total += amount;
	}
	return Math.ceil(total);
}

/**
 * get mgc app info if not yet got
 */
function ensureAppInfo() {
	if (appId == null || appId.length <= 0) {
		var info = window.mgc.getAppInfoSync();
		appId = info.appId;
		userId = info.userId;
		directory = '__leto_storage_' + userId + '_' + appId + '__';
	}
}

var storage = {
	// flag indicating use native local storage implementation or not
	USE_NATIVE_STORAGE_IMPLEMENTATION: _utils2.default.getSDKMode() == _const2.default.SDK_MODE_FULL,

	set: function set(key, value) {
		if (window.localStorage == null) {
			return console.error('localStorage not supported');
		}
		ensureAppInfo();
		var str = storage.USE_NATIVE_STORAGE_IMPLEMENTATION ? _bridge2.default.callSyncApi("setStorage", { key: key, data: value }) : window.__nativeLocalStorage.getItem(directory);

		// if not native implementation, save it in local storage
		if (!storage.USE_NATIVE_STORAGE_IMPLEMENTATION) {
			var obj = str ? JSON.parse(str) : {};
			obj[key] = value;
			window.__nativeLocalStorage.setItem(directory, JSON.stringify(obj));
		}
	},
	get: function get(key) {
		/*
   按照javascript文档, getItem查不到值时要返回null, 不能返回undefined, 这很重要, 因为JSON.parse(null)没事,
   但是JSON.parse(undefined)就要出错. get方法模拟的是getItem, 所以不能返回undefined
   */
		if (window.localStorage == null) {
			return console.error('localStorage not supported');
		}
		ensureAppInfo();
		var rt = storage.USE_NATIVE_STORAGE_IMPLEMENTATION ? _bridge2.default.callSyncApi("getStorage", { key: key }) : window.__nativeLocalStorage.getItem(directory);

		// native implementation has extra fields to describe value type
		// so we need process returned result
		if (storage.USE_NATIVE_STORAGE_IMPLEMENTATION) {
			switch (rt.dataType) {
				case 'undefined':
					rt.data = null;
					break;
				case 'object':
					if (typeof rt.data == 'string') {
						try {
							rt.data = JSON.parse(rt.data);
						} catch (e) {
							rt.data = null;
						}
					}
					break;
				case 'number':
					rt.data = Number(rt.data);
					break;
				case 'boolean':
					if (typeof rt.data != 'boolean') {
						rt.data = rt.data == 'true' || Number(rt.data) != 0;
					}
					break;
				default:
					if (typeof rt.data != 'string') {
						rt.data = String(rt.data);
					}
					break;
			}
			return rt.data;
		} else {
			var obj = rt ? JSON.parse(rt) : {};
			return obj[key] != null ? obj[key] : null;
		}
	},
	getStorage: function getStorage(key) {
		/*
   getStorage是小游戏api, 他在值不存在的时候要返回undefined, 不能返回null, 不然没法触发fail回调, 例如绝世好剑OL可能就
   依赖于这个fail回调的. 好吧, 到底是我沙雕还是游戏沙雕?
   */
		var str = storage.get(key);
		return {
			data: str === null ? undefined : str
		};
	},
	remove: function remove(key) {
		if (window.localStorage == null) {
			return console.error('localStorage not supported');
		}
		ensureAppInfo();
		if (storage.USE_NATIVE_STORAGE_IMPLEMENTATION) {
			_bridge2.default.callSyncApi("removeStorage", { key: key });
		} else {
			var str = window.__nativeLocalStorage.getItem(directory);
			if (!str) return;
			var obj = JSON.parse(str);
			delete obj[key];
			window.__nativeLocalStorage.setItem(directory, JSON.stringify(obj));
		}
	},
	clear: function clear() {
		if (window.localStorage == null) {
			return console.error('localStorage not supported');
		}
		ensureAppInfo();
		if (storage.USE_NATIVE_STORAGE_IMPLEMENTATION) {
			_bridge2.default.callSyncApi("clearStorage", null);
		} else {
			window.__nativeLocalStorage.removeItem(directory);
		}
	},
	key: function key(index) {
		if (window.localStorage == null) {
			return console.error('localStorage not supported');
		}
		if (index < 0) {
			return null;
		}
		ensureAppInfo();
		var str = window.__nativeLocalStorage.getItem(directory);
		var obj = str ? JSON.parse(str) : {};
		var keys = Object.keys(obj);
		if (index >= keys.length) {
			return null;
		} else {
			return keys[index];
		}
	},
	info: function info() {
		if (window.localStorage == null) {
			return console.error('localStorage not supported');
		}
		ensureAppInfo();
		if (storage.USE_NATIVE_STORAGE_IMPLEMENTATION) {
			return _bridge2.default.callSyncApi("getStorageInfo", null);
		} else {
			var str = window.__nativeLocalStorage.getItem(directory);
			var obj = str ? JSON.parse(str) : {};
			return {
				keys: Object.keys(obj),
				limitSize: LIMIT_SIZE,
				currentSize: currentSize()
			};
		}
	}
};

exports.default = storage;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// next download id
var nextTaskId = 1;

var DownloadTask = function () {
	function DownloadTask(params) {
		_classCallCheck(this, DownloadTask);

		this.taskId = nextTaskId++;
		_bridge2.default.invokeMethod('DownloadTask_create', Object.assign(params, {
			taskId: this.taskId,
			__apiName: 'downloadFile'
		}));
	}

	_createClass(DownloadTask, [{
		key: 'onProgressUpdate',
		value: function onProgressUpdate(fn) {
			if (window.wd) {
				window.wd.onDownloadProgressUpdate(this.taskId, fn);
			}
		}
	}, {
		key: 'offProgressUpdate',
		value: function offProgressUpdate(fn) {
			if (window.wd) {
				window.wd.offDownloadProgressUpdate(this.taskId, fn);
			}
		}
	}, {
		key: 'onHeadersReceived',
		value: function onHeadersReceived(fn) {
			if (window.wd) {
				window.wd.onDownloadHeadersReceived(this.taskId, fn);
			}
		}
	}, {
		key: 'offHeadersReceived',
		value: function offHeadersReceived(fn) {
			if (window.wd) {
				window.wd.offDownloadHeadersReceived(this.taskId, fn);
			}
		}
	}, {
		key: 'abort',
		value: function abort() {
			// invoke
			_bridge2.default.invokeMethod('DownloadTask_abort', { taskId: this.taskId });
		}
	}]);

	return DownloadTask;
}();

exports.default = DownloadTask;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var md5 = __webpack_require__(45);

var DownloadTask_js = function () {
	function DownloadTask_js(params) {
		var _this = this;

		_classCallCheck(this, DownloadTask_js);

		// ensure params is not null
		this.params = params || {};

		// init member
		this.tempFilePath = params.filePath || _const2.default.LETO_TMP_DIR + '/' + md5(params.url);
		this.progressUpdateCallbacks = [];
		this.headersReceivedCallbacks = [];

		// create xhr
		this.xhr = new XMLHttpRequest();
		this.xhr.open('GET', params.url, true);
		this.xhr.responseType = 'arraybuffer';
		this.xhr.timeout = params.timeout || 0;
		if (_typeof(params.header) == 'object') {
			for (var key in params.header) {
				this.xhr.setRequestHeader(key, params.header[key]);
			}
		}
		this.xhr.onreadystatechange = function (ev) {
			if (_this.xhr.readyState == _this.xhr.HEADERS_RECEIVED) {
				// get header string
				var headers = _this.xhr.getAllResponseHeaders();
				var arr = headers ? headers.trim().split(/[\r\n]+/) : [];

				// Create a map of header names to values
				var headerMap = {};
				arr.forEach(function (line) {
					var parts = line.split(': ');
					var header = parts.shift();
					var value = parts.join(': ');
					headerMap[header] = value;
				});

				// notify
				_this.headersReceivedCallbacks.forEach(function (fn) {
					fn({ header: headerMap });
				});
			}
		};
		this.xhr.onprogress = function (ev) {
			_this.progressUpdateCallbacks.forEach(function (fn) {
				fn({
					progress: ev.lengthComputable ? ev.loaded / ev.total : 0,
					totalBytesWritten: ev.loaded,
					totalBytesExpectedToWrite: ev.total
				});
			});
		};
		this.xhr.onload = function (ev) {
			var fs = mgc.getFileSystemManager();
			fs.writeFile({
				filePath: _this.tempFilePath,
				data: _this.xhr.response,
				success: function success(res) {
					if (_this.params.success) {
						var data = {
							errCode: _const2.default.RESULT_OK,
							statusCode: _this.xhr.status
						};
						if (_this.params.filePath) {
							data.filePath = _this.params.filePath;
						} else {
							data.tempFilePath = _this.tempFilePath;
						}
						_this.params.success(data);
					}
				},
				fail: function fail(res) {
					if (_this.params.fail) {
						_this.params.fail(res);
					}
				},
				complete: function complete(res) {
					if (_this.params.complete) {
						_this.params.complete(res);
					}
				}
			});
		};
		this.xhr.onerror = function (ev) {
			if (_this.params.fail) {
				_this.params.fail({ errCode: _const2.default.RESULT_FAIL });
			}
			if (_this.params.complete) {
				_this.params.complete({ errCode: _const2.default.RESULT_FAIL });
			}
		};
		this.xhr.onabort = function (ev) {
			if (_this.params.fail) {
				_this.params.fail({ errCode: _const2.default.RESULT_FAIL });
			}
			if (_this.params.complete) {
				_this.params.complete({ errCode: _const2.default.RESULT_FAIL });
			}
		};
		this.xhr.send();
	}

	_createClass(DownloadTask_js, [{
		key: 'onProgressUpdate',
		value: function onProgressUpdate(fn) {
			this.progressUpdateCallbacks.push(fn);
		}
	}, {
		key: 'offProgressUpdate',
		value: function offProgressUpdate(fn) {
			if (fn) {
				var idx = this.progressUpdateCallbacks.indexOf(fn);
				if (idx != -1) {
					this.progressUpdateCallbacks.splice(idx, 1);
				}
			} else {
				this.progressUpdateCallbacks.splice(0, this.progressUpdateCallbacks.length);
			}
		}
	}, {
		key: 'onHeadersReceived',
		value: function onHeadersReceived(fn) {
			this.headersReceivedCallbacks.push(fn);
		}
	}, {
		key: 'offHeadersReceived',
		value: function offHeadersReceived(fn) {
			if (fn) {
				var idx = this.headersReceivedCallbacks.indexOf(fn);
				if (idx != -1) {
					this.headersReceivedCallbacks.splice(idx, 1);
				}
			} else {
				this.headersReceivedCallbacks.splice(0, this.headersReceivedCallbacks.length);
			}
		}
	}, {
		key: 'abort',
		value: function abort() {
			this.xhr.abort();
		}
	}]);

	return DownloadTask_js;
}();

exports.default = DownloadTask_js;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

(function(){
  var crypt = __webpack_require__(46),
      utf8 = __webpack_require__(16).utf8,
      isBuffer = __webpack_require__(47),
      bin = __webpack_require__(16).bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),
/* 46 */
/***/ (function(module, exports) {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),
/* 47 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// next download id
var nextTaskId = 1;

var UploadTask = function () {
	function UploadTask(params) {
		_classCallCheck(this, UploadTask);

		this.taskId = nextTaskId++;
		_bridge2.default.invokeMethod('UploadTask_create', Object.assign(params, {
			taskId: this.taskId,
			__apiName: 'uploadFile'
		}));
	}

	_createClass(UploadTask, [{
		key: 'onProgressUpdate',
		value: function onProgressUpdate(fn) {
			if (window.wd) {
				window.wd.onUploadProgressUpdate(this.taskId, fn);
			}
		}
	}, {
		key: 'offProgressUpdate',
		value: function offProgressUpdate(fn) {
			if (window.wd) {
				window.wd.offUploadProgressUpdate(this.taskId, fn);
			}
		}
	}, {
		key: 'onHeadersReceived',
		value: function onHeadersReceived(fn) {
			if (window.wd) {
				window.wd.onUploadHeadersReceived(this.taskId, fn);
			}
		}
	}, {
		key: 'offHeadersReceived',
		value: function offHeadersReceived(fn) {
			if (window.wd) {
				window.wd.offUploadHeadersReceived(this.taskId, fn);
			}
		}
	}, {
		key: 'abort',
		value: function abort() {
			// invoke
			_bridge2.default.invokeMethod('UploadTask_abort', { taskId: this.taskId });
		}
	}]);

	return UploadTask;
}();

exports.default = UploadTask;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UploadTask_js = function () {
	function UploadTask_js(params) {
		var _this = this;

		_classCallCheck(this, UploadTask_js);

		// ensure params is not null
		this.params = params || {};

		// init member
		this.progressUpdateCallbacks = [];
		this.headersReceivedCallbacks = [];

		// get file array buffer
		var file = mgc.getFileSystemManager().readFileSync(params.filePath);
		if (!file) {
			if (this.params.fail) {
				this.params.fail({ errCode: _const2.default.RESULT_FAIL });
			}
			if (this.params.complete) {
				this.params.complete({ errCode: _const2.default.RESULT_FAIL });
			}
			return;
		}

		// create form data
		var form = new FormData();
		form.set(params.name, file);
		if (params.formData && params.formData.entries) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = params.formData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var pair = _step.value;

					form.set(pair[0], pair[1]);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}

		// create xhr
		this.xhr = new XMLHttpRequest();
		this.xhr.timeout = params.timeout || 0;
		if (_typeof(params.header) == 'object') {
			for (var key in params.header) {
				this.xhr.setRequestHeader(key, params.header[key]);
			}
		}
		this.xhr.onreadystatechange = function (ev) {
			if (_this.xhr.readyState == _this.xhr.HEADERS_RECEIVED) {
				// get header string
				var headers = _this.xhr.getAllResponseHeaders();
				var arr = headers ? headers.trim().split(/[\r\n]+/) : [];

				// Create a map of header names to values
				var headerMap = {};
				arr.forEach(function (line) {
					var parts = line.split(': ');
					var header = parts.shift();
					var value = parts.join(': ');
					headerMap[header] = value;
				});

				// notify
				_this.headersReceivedCallbacks.forEach(function (fn) {
					fn({ header: headerMap });
				});
			}
		};
		this.xhr.upload.onprogress = function (ev) {
			_this.progressUpdateCallbacks.forEach(function (fn) {
				fn({
					progress: ev.lengthComputable ? ev.loaded / ev.total : 0,
					totalBytesSent: ev.loaded,
					totalBytesExpectedToSend: ev.total
				});
			});
		};
		this.xhr.onload = function (ev) {
			if (_this.params.success) {
				_this.params.success({
					errCode: _const2.default.RESULT_OK,
					data: _this.xhr.response,
					statusCode: _this.xhr.status
				});
			}
			if (_this.params.complete) {
				_this.params.complete({ errCode: _const2.default.RESULT_FAIL });
			}
		};
		this.xhr.onerror = function (ev) {
			if (_this.params.fail) {
				_this.params.fail({ errCode: _const2.default.RESULT_FAIL });
			}
			if (_this.params.complete) {
				_this.params.complete({ errCode: _const2.default.RESULT_FAIL });
			}
		};
		this.xhr.onabort = function (ev) {
			if (_this.params.fail) {
				_this.params.fail({ errCode: _const2.default.RESULT_FAIL });
			}
			if (_this.params.complete) {
				_this.params.complete({ errCode: _const2.default.RESULT_FAIL });
			}
		};
		this.xhr.open('POST', params.url);
		this.xhr.send(form);
	}

	_createClass(UploadTask_js, [{
		key: 'onProgressUpdate',
		value: function onProgressUpdate(fn) {
			this.progressUpdateCallbacks.push(fn);
		}
	}, {
		key: 'offProgressUpdate',
		value: function offProgressUpdate(fn) {
			if (fn) {
				var idx = this.progressUpdateCallbacks.indexOf(fn);
				if (idx != -1) {
					this.progressUpdateCallbacks.splice(idx, 1);
				}
			} else {
				this.progressUpdateCallbacks.splice(0, this.progressUpdateCallbacks.length);
			}
		}
	}, {
		key: 'onHeadersReceived',
		value: function onHeadersReceived(fn) {
			this.headersReceivedCallbacks.push(fn);
		}
	}, {
		key: 'offHeadersReceived',
		value: function offHeadersReceived(fn) {
			if (fn) {
				var idx = this.headersReceivedCallbacks.indexOf(fn);
				if (idx != -1) {
					this.headersReceivedCallbacks.splice(idx, 1);
				}
			} else {
				this.headersReceivedCallbacks.splice(0, this.headersReceivedCallbacks.length);
			}
		}
	}, {
		key: 'abort',
		value: function abort() {
			this.xhr.abort();
		}
	}]);

	return UploadTask_js;
}();

exports.default = UploadTask_js;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// next download id
var nextTaskId = 1;

var RequestTask = function () {
	function RequestTask(params) {
		_classCallCheck(this, RequestTask);

		this.taskId = nextTaskId++;
		_bridge2.default.invokeMethod('RequestTask_create', Object.assign(params, {
			taskId: this.taskId,
			__apiName: 'request'
		}), {
			beforeSuccess: function beforeSuccess(res) {
				if (params.dataType === 'json') {
					try {
						res.data = JSON.parse(res.data);
					} catch (e) {}
				}
				res.statusCode = parseInt(res.statusCode);
			}
		});
	}

	_createClass(RequestTask, [{
		key: 'onHeadersReceived',
		value: function onHeadersReceived(fn) {
			if (window.wd) {
				window.wd.onRequestHeadersReceived(this.taskId, fn);
			}
		}
	}, {
		key: 'offHeadersReceived',
		value: function offHeadersReceived(fn) {
			if (window.wd) {
				window.wd.offRequestHeadersReceived(this.taskId, fn);
			}
		}
	}, {
		key: 'abort',
		value: function abort() {
			// invoke
			_bridge2.default.invokeMethod('RequestTask_abort', { taskId: this.taskId });
		}
	}]);

	return RequestTask;
}();

exports.default = RequestTask;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestTask_js = function () {
	function RequestTask_js(params) {
		var _this = this;

		_classCallCheck(this, RequestTask_js);

		// ensure params
		this.params = params || {};
		params.method = params.method ? params.method.toUpperCase() : 'GET';
		params.responseType = params.responseType || 'text';
		params.dataType = params.dataType || 'json';
		params.timeout = params.timeout || 0;
		if (!params.header || _typeof(params.header) != 'object') {
			params.header = {};
		}
		for (var key in params.header) {
			params.header[key.toLowerCase()] = params.header[key];
		}
		params.header['content-type'] = params.header['content-type'] || 'application/json';
		var isForm = params.header['content-type'].indexOf('form') != -1;
		var isJson = params.header['content-type'] == 'application/json';
		var isPost = params.method == 'POST';

		// init member
		this.headerMap = {};
		this.headersReceivedCallbacks = [];

		// create xhr
		this.xhr = new XMLHttpRequest();
		this.xhr.open(params.method, params.url, true);
		this.xhr.responseType = params.responseType;
		this.xhr.timeout = params.timeout;
		for (var _key in params.header) {
			if (isPost && _key == 'content-type' || _key != 'content-type') {
				this.xhr.setRequestHeader(_key, params.header[_key]);
			}
		}
		this.xhr.onreadystatechange = function (ev) {
			if (_this.xhr.readyState == _this.xhr.HEADERS_RECEIVED) {
				// get header string
				var headers = _this.xhr.getAllResponseHeaders();
				var arr = headers ? headers.trim().split(/[\r\n]+/) : [];

				// Create a map of header names to values
				_this.headerMap = {};
				arr.forEach(function (line) {
					var parts = line.split(': ');
					var header = parts.shift();
					var value = parts.join(': ');
					_this.headerMap[header] = value;
				});

				// notify
				_this.headersReceivedCallbacks.forEach(function (fn) {
					fn({ header: _this.headerMap });
				});
			}
		};
		this.xhr.onload = function (ev) {
			// process response data
			var data = _this.xhr.response;
			if (_this.params.dataType == 'json') {
				try {
					if (data instanceof ArrayBuffer) {
						data = String.fromCharCode.apply(null, new Uint8Array(data));
					} else if (data instanceof Blob) {
						data = String.fromCharCode.apply(null, new Uint8Array(data.arrayBuffer()));
					} else {
						data = data.toString();
					}
					data = JSON.parse(data);
				} catch (e) {}
			} else {
				if (data instanceof Blob) {
					data = data.arrayBuffer();
				} else if (typeof data == 'string') {
					data = _utils2.default.textToArrayBuffer(data);
				}
			}

			// callback
			if (_this.params.success) {
				_this.params.success({
					data: data,
					statusCode: _this.xhr.status,
					header: _this.headerMap
				});
			}
			if (_this.params.complete) {
				_this.params.complete({ errCode: _const2.default.RESULT_FAIL });
			}
		};
		this.xhr.onerror = function (ev) {
			if (_this.params.fail) {
				_this.params.fail({ errCode: _const2.default.RESULT_FAIL });
			}
			if (_this.params.complete) {
				_this.params.complete({ errCode: _const2.default.RESULT_FAIL });
			}
		};
		this.xhr.onabort = function (ev) {
			if (_this.params.fail) {
				_this.params.fail({ errCode: _const2.default.RESULT_FAIL });
			}
			if (_this.params.complete) {
				_this.params.complete({ errCode: _const2.default.RESULT_FAIL });
			}
		};

		// convert data to string if data is array buffer
		if (params.data instanceof ArrayBuffer) {
			params.data = String.fromCharCode.apply(null, new Uint8Array(params.data));
		}

		// process data
		if (isPost) {
			if (_typeof(params.data) == 'object') {
				if (isForm) {
					var str = '';
					for (var _key2 in params.data) {
						if (str.length > 0) {
							str += '&';
						}
						str += encodeURIComponent(_key2) + '=' + encodeURIComponent(params.data[_key2]);
					}
					params.data = str;
				} else if (isJson) {
					params.data = JSON.stringify(params.data);
				}
			}
		}

		// send
		if (isPost && params.data) {
			this.xhr.send(params.data);
		} else {
			this.xhr.send();
		}
	}

	_createClass(RequestTask_js, [{
		key: 'onHeadersReceived',
		value: function onHeadersReceived(fn) {
			this.headersReceivedCallbacks.push(fn);
		}
	}, {
		key: 'offHeadersReceived',
		value: function offHeadersReceived(fn) {
			if (fn) {
				var idx = this.headersReceivedCallbacks.indexOf(fn);
				if (idx != -1) {
					this.headersReceivedCallbacks.splice(idx, 1);
				}
			} else {
				this.headersReceivedCallbacks.splice(0, this.headersReceivedCallbacks.length);
			}
		}
	}, {
		key: 'abort',
		value: function abort() {
			this.xhr.abort();
		}
	}]);

	return RequestTask_js;
}();

exports.default = RequestTask_js;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoadSubpackageTask = function () {
	function LoadSubpackageTask(params) {
		var _this = this;

		_classCallCheck(this, LoadSubpackageTask);

		// save task name, same as sub package name
		this.name = params.name;

		// call native api
		_bridge2.default.invokeMethod('loadSubpackage', params, {
			afterSuccess: function afterSuccess(res) {
				// remove callback
				if (window.wd) {
					window.wd.offLoadSubpackageProgressUpdate(_this.name);
				}
			}
		});
	}

	_createClass(LoadSubpackageTask, [{
		key: 'onProgressUpdate',
		value: function onProgressUpdate(fn) {
			if (window.wd) {
				window.wd.onLoadSubpackageProgressUpdate(this.name, fn);
			}
		}
	}]);

	return LoadSubpackageTask;
}();

exports.default = LoadSubpackageTask;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// key is url, value is socket task
var socketMap = {};

// pending callback to be added to first task
var pendingOpenCallbacks = [];
var pendingCloseCallbacks = [];
var pendingMessageCallbacks = [];
var pendingErrorCallbacks = [];

var SocketTask = function () {
	_createClass(SocketTask, null, [{
		key: 'create',
		value: function create(params) {
			// check if has cached task
			var task = socketMap[params.url];
			if (!task) {
				task = new SocketTask(params);
				socketMap[params.url] = task;

				// add pending callbacks
				pendingOpenCallbacks.map(function (fn) {
					task.onOpen(fn);
				});
				pendingCloseCallbacks.map(function (fn) {
					task.onClose(fn);
				});
				pendingMessageCallbacks.map(function (fn) {
					task.onMessage(fn);
				});
				pendingErrorCallbacks.map(function (fn) {
					task.onError(fn);
				});
				pendingOpenCallbacks = [];
				pendingCloseCallbacks = [];
				pendingMessageCallbacks = [];
				pendingErrorCallbacks = [];
			}
			return task;
		}
	}, {
		key: 'get',
		value: function get(url) {
			// if url is set, return cached task if has
			// if url is not set, return first task if has
			if (url) {
				if (socketMap[url]) {
					return socketMap[url];
				} else {
					return null;
				}
			} else {
				var keys = Object.keys(socketMap);
				if (keys.length > 0) {
					return socketMap[keys[0]];
				}
			}

			// return a empty task
			return new SocketTask({});
		}
	}]);

	function SocketTask(params) {
		_classCallCheck(this, SocketTask);

		this.url = params.url;

		// connect
		_bridge2.default.invokeMethod('connectSocket', params);
	}

	_createClass(SocketTask, [{
		key: 'send',
		value: function send(params) {
			// if data is arraybuffer, convert to base64
			if (typeof params.data != 'string') {
				params.data = _utils2.default.arrayBufferToBase64(params.data);
				params.base64 = true;
			}

			// invoke
			_bridge2.default.invokeMethod("SocketTask_send", Object.assign(params, {
				url: this.url
			}));
		}
	}, {
		key: 'close',
		value: function close(params) {
			var _this = this;

			_bridge2.default.invokeMethod("SocketTask_close", Object.assign(params, {
				url: this.url
			}), {
				afterSuccess: function afterSuccess(res) {
					delete socketMap[_this.url];
				}
			});
		}
	}, {
		key: 'onMessage',
		value: function onMessage(fn) {
			if (this.url) {
				if (window.wd) {
					window.wd.onAppSocketMessage(this.url, fn);
				}
			} else {
				pendingMessageCallbacks.push(fn);
			}
		}
	}, {
		key: 'onOpen',
		value: function onOpen(fn) {
			if (this.url) {
				if (window.wd) {
					window.wd.onAppSocketOpen(this.url, fn);
				}
			} else {
				pendingOpenCallbacks.push(fn);
			}
		}
	}, {
		key: 'onClose',
		value: function onClose(fn) {
			if (this.url) {
				if (window.wd) {
					window.wd.onAppSocketClose(this.url, fn);
				}
			} else {
				pendingCloseCallbacks.push(fn);
			}
		}
	}, {
		key: 'onError',
		value: function onError(fn) {
			if (this.url) {
				if (window.wd) {
					window.wd.onAppSocketError(this.url, fn);
				}
			} else {
				pendingErrorCallbacks.push(fn);
			}
		}
	}]);

	return SocketTask;
}();

exports.default = SocketTask;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _inst = null;

var VersionUpdateManager = function () {
	function VersionUpdateManager() {
		_classCallCheck(this, VersionUpdateManager);
	}

	_createClass(VersionUpdateManager, [{
		key: 'onCheckForUpdate',
		value: function onCheckForUpdate(fn) {
			if (window.wd) {
				window.wd.onAppCheckForUpdate(fn);
			}
		}
	}, {
		key: 'onUpdateReady',
		value: function onUpdateReady(fn) {
			if (window.wd) {
				window.wd.onAppUpdateReady(fn);
			}
		}
	}, {
		key: 'onUpdateFailed',
		value: function onUpdateFailed(fn) {
			if (window.wd) {
				window.wd.onAppUpdateFailed(fn);
			}
		}
	}, {
		key: 'applyUpdate',
		value: function applyUpdate() {
			_bridge2.default.invokeMethod('applyVersionUpdate', {});
		}
	}], [{
		key: 'getInstance',
		value: function getInstance() {
			if (!_inst) {
				_inst = new VersionUpdateManager();
			}
			_bridge2.default.invokeMethod('checkVersion', {});
			return _inst;
		}
	}]);

	return VersionUpdateManager;
}();

exports.default = VersionUpdateManager;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// global auto increase banner ad id
var nextAdId = 1;

var BannerAd = function () {
	function BannerAd(params) {
		_classCallCheck(this, BannerAd);

		params = params || {};
		this.style = params.style || {};
		this.adIntervals = params.adIntervals || 0;
		this.adId = nextAdId++;
		params.adId = this.adId;

		// create
		_bridge2.default.invokeMethod('BannerAd_create', params);
	}

	_createClass(BannerAd, [{
		key: 'show',
		value: function show() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('BannerAd_show', { adId: _this.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('BannerAd_hide', { adId: _this2.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('BannerAd_destroy', { adId: _this3.adId }, {
					afterSuccess: function afterSuccess() {
						// clean callbacks
						if (window.wd) {
							window.wd.clearBannerAdCallbacks(this.adId);
						}

						// resolve
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'onResize',
		value: function onResize(fn) {
			if (window.wd) {
				window.wd.onAppBannerAdResize(this.adId, fn);
			}
		}
	}, {
		key: 'offResize',
		value: function offResize(fn) {
			if (window.wd) {
				window.wd.offAppBannerAdResize(this.adId, fn);
			}
		}
	}, {
		key: 'onLoad',
		value: function onLoad(fn) {
			if (window.wd) {
				window.wd.onAppBannerAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'offLoad',
		value: function offLoad(fn) {
			if (window.wd) {
				window.wd.offAppBannerAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'onError',
		value: function onError(fn) {
			if (window.wd) {
				window.wd.onAppBannerAdError(this.adId, fn);
			}
		}
	}, {
		key: 'offError',
		value: function offError(fn) {
			if (window.wd) {
				window.wd.offAppBannerAdError(this.adId, fn);
			}
		}
	}]);

	return BannerAd;
}();

exports.default = BannerAd;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// global auto increase banner ad id
var nextAdId = 1;

var RewardedVideoAd = function () {
	function RewardedVideoAd(params) {
		_classCallCheck(this, RewardedVideoAd);

		params = params || {};
		this.adId = nextAdId++;
		params.adId = this.adId;

		_bridge2.default.invokeMethod('RewardedVideoAd_create', params);
	}

	_createClass(RewardedVideoAd, [{
		key: 'show',
		value: function show() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('RewardedVideoAd_show', { adId: _this.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'load',
		value: function load() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('RewardedVideoAd_load', { adId: _this2.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('RewardedVideoAd_destroy', { adId: _this3.adId }, {
					afterSuccess: function afterSuccess() {
						// clean callbacks
						if (window.wd) {
							window.wd.clearRewardedVideoAdCallbacks(this.adId);
						}

						// resolve
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'onClose',
		value: function onClose(fn) {
			if (window.wd) {
				window.wd.onAppRewardedVideoAdClose(this.adId, fn);
			}
		}
	}, {
		key: 'offClose',
		value: function offClose(fn) {
			if (window.wd) {
				window.wd.offAppRewardedVideoAdClose(this.adId, fn);
			}
		}
	}, {
		key: 'onLoad',
		value: function onLoad(fn) {
			if (window.wd) {
				window.wd.onAppRewardedVideoAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'offLoad',
		value: function offLoad(fn) {
			if (window.wd) {
				window.wd.offAppRewardedVideoAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'onError',
		value: function onError(fn) {
			if (window.wd) {
				window.wd.onAppRewardedVideoAdError(this.adId, fn);
			}
		}
	}, {
		key: 'offError',
		value: function offError(fn) {
			if (window.wd) {
				window.wd.offAppRewardedVideoAdError(this.adId, fn);
			}
		}
	}]);

	return RewardedVideoAd;
}();

exports.default = RewardedVideoAd;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// global auto increase banner ad id
var nextAdId = 1;

var InterstitialAd = function () {
	function InterstitialAd(params) {
		_classCallCheck(this, InterstitialAd);

		params = params || {};
		this.adId = nextAdId++;
		params.adId = this.adId;

		// create
		_bridge2.default.invokeMethod('InterstitialAd_create', params);
	}

	_createClass(InterstitialAd, [{
		key: 'destroy',
		value: function destroy() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('InterstitialAd_destroy', { adId: _this.adId }, {
					afterSuccess: function afterSuccess() {
						// clean callbacks
						if (window.wd) {
							window.wd.clearInterstitialAdCallbacks(this.adId);
						}

						// resolve
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'load',
		value: function load() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('InterstitialAd_load', { adId: _this2.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'show',
		value: function show() {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('InterstitialAd_show', { adId: _this3.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'onLoad',
		value: function onLoad(fn) {
			if (window.wd) {
				window.wd.onAppInterstitialAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'offLoad',
		value: function offLoad(fn) {
			if (window.wd) {
				window.wd.offAppInterstitialAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'onClose',
		value: function onClose(fn) {
			if (window.wd) {
				window.wd.onAppInterstitialAdClose(this.adId, fn);
			}
		}
	}, {
		key: 'offClose',
		value: function offClose(fn) {
			if (window.wd) {
				window.wd.offAppInterstitialAdClose(this.adId, fn);
			}
		}
	}, {
		key: 'onError',
		value: function onError(fn) {
			if (window.wd) {
				window.wd.onAppInterstitialAdError(this.adId, fn);
			}
		}
	}, {
		key: 'offError',
		value: function offError(fn) {
			if (window.wd) {
				window.wd.offAppInterstitialAdError(this.adId, fn);
			}
		}
	}]);

	return InterstitialAd;
}();

exports.default = InterstitialAd;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameIcon = function () {
	function GameIcon(params) {
		_classCallCheck(this, GameIcon);

		this.adUnitId = params.adUnitId || '';
		this.style = params.style || [];
		this.count = params.count || 0;

		_bridge2.default.invokeMethod('GameIcon_create', params);
	}

	_createClass(GameIcon, [{
		key: 'show',
		value: function show() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('GameIcon_show', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('GameIcon_hide', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'load',
		value: function load() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('GameIcon_load', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('GameIcon_destroy', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'onResize',
		value: function onResize(fn) {
			if (window.wd) {
				window.wd.onAppGameIconResize(fn);
			}
		}
	}, {
		key: 'offResize',
		value: function offResize(fn) {
			if (window.wd) {
				window.wd.offAppGameIconResize(fn);
			}
		}
	}, {
		key: 'onLoad',
		value: function onLoad(fn) {
			if (window.wd) {
				window.wd.onAppGameIconLoad(fn);
			}
		}
	}, {
		key: 'offLoad',
		value: function offLoad(fn) {
			if (window.wd) {
				window.wd.offAppGameIconLoad(fn);
			}
		}
	}, {
		key: 'onError',
		value: function onError(fn) {
			if (window.wd) {
				window.wd.onAppGameIconError(fn);
			}
		}
	}, {
		key: 'offError',
		value: function offError(fn) {
			if (window.wd) {
				window.wd.offAppGameIconError(fn);
			}
		}
	}]);

	return GameIcon;
}();

exports.default = GameIcon;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GamePortal = function () {
	function GamePortal(params) {
		_classCallCheck(this, GamePortal);

		this.adUnitId = params.adUnitId || '';
		this.style = params.style || [];
		this.count = params.count || 0;

		_bridge2.default.invokeMethod('GamePortal_create', params);
	}

	_createClass(GamePortal, [{
		key: 'show',
		value: function show() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('GamePortal_show', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'load',
		value: function load() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('GamePortal_load', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('GamePortal_destroy', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'onClose',
		value: function onClose(fn) {
			if (window.wd) {
				window.wd.onAppGamePortalClose(fn);
			}
		}
	}, {
		key: 'offClose',
		value: function offClose(fn) {
			if (window.wd) {
				window.wd.offAppGamePortalClose(fn);
			}
		}
	}, {
		key: 'onLoad',
		value: function onLoad(fn) {
			if (window.wd) {
				window.wd.onAppGamePortalLoad(fn);
			}
		}
	}, {
		key: 'offLoad',
		value: function offLoad(fn) {
			if (window.wd) {
				window.wd.offAppGamePortalLoad(fn);
			}
		}
	}, {
		key: 'onError',
		value: function onError(fn) {
			if (window.wd) {
				window.wd.onAppGamePortalError(fn);
			}
		}
	}, {
		key: 'offError',
		value: function offError(fn) {
			if (window.wd) {
				window.wd.offAppGamePortalError(fn);
			}
		}
	}]);

	return GamePortal;
}();

exports.default = GamePortal;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OpenDataContext = function () {
	function OpenDataContext() {
		_classCallCheck(this, OpenDataContext);

		this.canvas = null;
	}

	_createClass(OpenDataContext, [{
		key: 'postMessage',
		value: function postMessage(message) {
			// TODO how to implement this??
		}
	}]);

	return OpenDataContext;
}();

exports.default = OpenDataContext;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if ("undefined" == typeof navigator) {
	try {
		eval("const GeneratorFunction = Object.getPrototypeOf(function *() {}).constructor; const canvas = new GeneratorFunction('', 'console.log(0)'); canvas().__proto__.__proto__.next = () => {};");
	} catch (e) {}
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// rewrite Function adn SetTimeout setInterval

(function (exports) {

	__webpack_require__(0);
	/*
 	if ("undefined" != typeof Function) {
 		Function;
 		e = {},
 			Function.constructor = function () {
 			},
 			Function.prototype.constructor = function () {
 			},
 			Function = function () {
 				if (arguments.length > 0 && "return this" === arguments[arguments.length - 1])
 					return function () {
 						return e
 					}
 			},
 			Object.defineProperty(Function.constructor.__proto__, "apply", {
 				writable: !1,
 				configurable: !1,
 				value: Function.prototype.constructor.apply
 			})
 	}
 */
	// "undefined" != typeof eval && (eval = void 0),
	"undefined" != typeof navigator && !function () {
		var originalSetTimeOut = setTimeout;
		window.setTimeout = function (fn, timer) {
			if ("function" != typeof fn) {
				throw new TypeError("setTimetout expects a function as first argument but got " + (typeof fn === "undefined" ? "undefined" : _typeof(fn)) + ".");
			}
			var callback = Reporter.surroundThirdByTryCatch(fn, "at setTimeout callback function");
			return originalSetTimeOut(callback, timer);
		};
		var originalSetInterval = setInterval;
		window.setInterval = function (fn, timer) {
			if ("function" != typeof fn) {
				throw new TypeError("setInterval expects a function as first argument but got " + (typeof fn === "undefined" ? "undefined" : _typeof(fn)) + ".");
			}
			Reporter.surroundThirdByTryCatch(fn, "at setInterval callback function");
			return originalSetInterval(fn, timer);
		};
	}();
}).call(exports, function () {
	return this;
}());

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _configFlags = __webpack_require__(8);

var _configFlags2 = _interopRequireDefault(_configFlags);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//1-11 线上针对debug相关函数做处理

"undefined" != typeof __wxConfig__ && __wxConfig__.debug && _const2.default.PLATFORM_DEVTOOLS !== _utils2.default.getPlatform() && !function () {
	var logQueue = [],
	    viewIds = [],
	    consoleMethods = ["log", "warn", "error", "info", "debug"];
	consoleMethods.forEach(function (key) {
		var consoleMethod = console[key];
		console[key] = function () {
			logQueue.length > _configFlags2.default.LOG_LIMIT && logQueue.shift();
			var logArr = Array.prototype.slice.call(arguments);

			logQueue.push({
				method: key,
				log: logArr
			});

			consoleMethod.apply(console, arguments), viewIds.length > 0 && _bridge2.default.publish(key, { log: logArr }, viewIds);
		};
	});
	_bridge2.default.subscribe("DOMContentLoaded", function (n, viewId) {
		viewIds.push(viewId);
		_bridge2.default.publish("initLogs", { logs: logQueue }, [viewId]);
	});
}(), "undefined" == typeof console.group && (console.group = function () {}), "undefined" == typeof console.groupEnd && (console.groupEnd = function () {});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

var _globalDefined = __webpack_require__(9);

var _globalDefined2 = _interopRequireDefault(_globalDefined);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// buffer cache, key is partial url, value is buffer
var bufferCache = {};

// audio options
var options = {};

var InnerAudioContext = function () {
	_createClass(InnerAudioContext, null, [{
		key: 'options',
		set: function set(v) {
			options = v;
		},
		get: function get() {
			return options;
		}
	}]);

	function InnerAudioContext() {
		_classCallCheck(this, InnerAudioContext);

		// src
		this._src = '';

		// buffer
		this._buffer = null;

		// create volume
		this._volume = InnerAudioContext._context['createGain']();
		this._volume['gain'].value = 1;
		this._volume['connect'](InnerAudioContext._context['destination']);

		// loop
		this.loop = false;

		// in loading
		this._loading = false;

		// pause flag
		this._paused = true;

		// Record the currently playing Source
		this._currentSource = null;

		// other
		this.autoplay = false;
		this._currentTime = 0;
		this._duration = 0;
		this.obeyMuteSwitch = true;
		this.startTime = -1;

		// callbacks
		this._endedCallbacks = [];
		this._playCallbacks = [];
		this._pauseCallbacks = [];
		this._stopCallbacks = [];
		this._canplayCallbacks = [];
		this._errorCallbacks = [];
		this._seekedCallbacks = [];
		this._seekingCallbacks = [];
		this._waitingCallbacks = [];
		this._timeUpdateCallbacks = [];

		// ensure audio context is ok
		this._ensureContext();
	}

	_createClass(InnerAudioContext, [{
		key: '_ensureContext',
		value: function _ensureContext() {
			if (InnerAudioContext._context.state == 'suspended' && InnerAudioContext._context['resume']) {
				InnerAudioContext._context['resume']();
			} else if (InnerAudioContext._context.state == 'closed') {
				createContext();
			}
		}
	}, {
		key: 'pause',
		value: function pause() {
			if (!this._paused && this.startTime >= 0 && this._currentSource) {
				// pause
				this._stopSource(this._currentSource);
				this._currentSource = null;
				this._currentTime += InnerAudioContext._context.currentTime - this.startTime;
				this._currentTime %= this.duration;

				// save flag
				this._paused = true;

				// callback
				this._pauseCallbacks.forEach(function (fn) {
					fn();
				});
			}
		}
	}, {
		key: 'resume',
		value: function resume() {
			if (this.paused && !this._currentSource) {
				this.play(this._currentTime);
			}
		}
	}, {
		key: 'seek',
		value: function seek(position) {
			// seeking
			this._seekingCallbacks.forEach(function (fn) {
				fn();
			});

			// re-play
			this.play(position);

			// seeked
			this._seekedCallbacks.forEach(function (fn) {
				fn();
			});
		}
	}, {
		key: 'play',
		value: function play(offset) {
			// if no buffer, return
			if (!this._buffer) {
				return;
			}

			// If repeat play, you need to stop before an audio
			if (this._currentSource) {
				this._currentSource.stop(0);
			}

			// ensure audio context is ok
			this._ensureContext();

			// create a buffer source
			var audio = InnerAudioContext._context["createBufferSource"]();
			audio.buffer = this._buffer;
			audio["connect"](this._volume);
			audio.loop = this.loop;

			// set start time
			this.startTime = InnerAudioContext._context.currentTime;
			offset = offset || this.currentTime;
			this._currentTime = offset;

			// start source
			this._startSource(audio, offset);

			// set current source
			this._currentSource = audio;

			// set flag
			this._paused = false;

			// callback
			this._playCallbacks.forEach(function (fn) {
				fn();
			});
		}
	}, {
		key: '_startSource',
		value: function _startSource(audio, offset) {
			if (audio) {
				try {
					if (!this.loop) {
						if (audio.start) audio.start(0, offset, this._duration - offset);else if (audio["notoGrainOn"]) audio["noteGrainOn"](0, offset, this._duration - offset);else audio["noteOn"](0, offset, this._duration - offset);
					} else {
						if (audio.start) audio.start(0);else if (audio["notoGrainOn"]) audio["noteGrainOn"](0);else audio["noteOn"](0);
					}
				} catch (e) {}
			}
		}
	}, {
		key: '_stopSource',
		value: function _stopSource(audio) {
			if (audio && audio.stop) {
				audio.stop(0);
			}
		}
	}, {
		key: 'stop',
		value: function stop() {
			// stop, so we reset some fields
			this._currentTime = 0;
			var audio = this._currentSource;
			this._currentSource = null;
			this.startTime = -1;
			this._loading = false;
			this._paused = true;
			this._stopSource(audio);

			// callback
			this._stopCallbacks.forEach(function (fn) {
				fn();
			});
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			// stop
			this._stopSource(this._currentSource);

			// clear cache
			delete bufferCache[this._src];
			this._buffer = null;

			// reset
			this._loading = false;
			this._paused = true;
			this.startTime = -1;
			this._currentTime = 0;
			this._duration = 0;

			// clear callbacks
			this._endedCallbacks.splice(0, this._endedCallbacks.length);
			this._playCallbacks.splice(0, this._playCallbacks.length);
			this._pauseCallbacks.splice(0, this._pauseCallbacks.length);
			this._stopCallbacks.splice(0, this._stopCallbacks.length);
			this._canplayCallbacks.splice(0, this._canplayCallbacks.length);
			this._errorCallbacks.splice(0, this._errorCallbacks.length);
			this._seekedCallbacks.splice(0, this._seekedCallbacks.length);
			this._seekingCallbacks.splice(0, this._seekingCallbacks.length);
			this._waitingCallbacks.splice(0, this._waitingCallbacks.length);
			this._timeUpdateCallbacks.splice(0, this._timeUpdateCallbacks.length);
		}
	}, {
		key: '_load',
		value: function _load(url, cb) {
			// sometime it is internal format, so transform it to local url
			url = window.mgc.getFileSystemManager().resolveUrlSync(url);

			// create request, here we use original xhr
			var request = new window.NativeGlobal.XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			// Our asynchronous callback
			request.onload = function () {
				if (request._timeoutId >= 0) {
					clearTimeout(request._timeoutId);
				}
				InnerAudioContext._context['decodeAudioData'](request.response, function (buffer) {
					//success
					cb(null, buffer);
				}, function () {
					//error
					cb('decode error - ' + url);
				});
			};

			// on error
			request.onerror = function () {
				cb('request error - ' + url);
			};

			// on timeout
			if (request.ontimeout === undefined) {
				request._timeoutId = setTimeout(function () {
					request.ontimeout();
				}, request.timeout);
			}
			request.ontimeout = function () {
				cb('request timeout - ' + url);
			};

			// send request
			request.send();
		}
	}, {
		key: 'onEnded',
		value: function onEnded(cb) {
			this._endedCallbacks.push(cb);
		}
	}, {
		key: 'offEnded',
		value: function offEnded(cb) {
			var idx = this._endedCallbacks.indexOf(cb);
			if (idx != -1) {
				this._endedCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'onPlay',
		value: function onPlay(cb) {
			this._playCallbacks.push(cb);
		}
	}, {
		key: 'offPlay',
		value: function offPlay(cb) {
			var idx = this._playCallbacks.indexOf(cb);
			if (idx != -1) {
				this._playCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'onPause',
		value: function onPause(cb) {
			this._pauseCallbacks.push(cb);
		}
	}, {
		key: 'offPause',
		value: function offPause(cb) {
			var idx = this._pauseCallbacks.indexOf(cb);
			if (idx != -1) {
				this._pauseCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'onStop',
		value: function onStop(cb) {
			this._stopCallbacks.push(cb);
		}
	}, {
		key: 'offStop',
		value: function offStop(cb) {
			var idx = this._stopCallbacks.indexOf(cb);
			if (idx != -1) {
				this._stopCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'onCanplay',
		value: function onCanplay(cb) {
			this._canplayCallbacks.push(cb);
		}
	}, {
		key: 'offCanplay',
		value: function offCanplay(cb) {
			var idx = this._canplayCallbacks.indexOf(cb);
			if (idx != -1) {
				this._canplayCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'onTimeUpdate',
		value: function onTimeUpdate(cb) {
			this._timeUpdateCallbacks.push(cb);
		}
	}, {
		key: 'offTimeUpdate',
		value: function offTimeUpdate(cb) {
			var idx = this._timeUpdateCallbacks.indexOf(cb);
			if (idx != -1) {
				this._timeUpdateCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'onError',
		value: function onError(cb) {
			this._errorCallbacks.push(cb);
		}
	}, {
		key: 'offError',
		value: function offError(cb) {
			var idx = this._errorCallbacks.indexOf(cb);
			if (idx != -1) {
				this._errorCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'onSeeked',
		value: function onSeeked(cb) {
			this._seekedCallbacks.push(cb);
		}
	}, {
		key: 'offSeeked',
		value: function offSeeked(cb) {
			var idx = this._seekedCallbacks.indexOf(cb);
			if (idx != -1) {
				this._seekedCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'onSeeking',
		value: function onSeeking(cb) {
			this._seekingCallbacks.push(cb);
		}
	}, {
		key: 'offSeeking',
		value: function offSeeking(cb) {
			var idx = this._seekingCallbacks.indexOf(cb);
			if (idx != -1) {
				this._seekingCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'onWaiting',
		value: function onWaiting(cb) {
			this._waitingCallbacks.push(cb);
		}
	}, {
		key: 'offWaiting',
		value: function offWaiting(cb) {
			var idx = this._waitingCallbacks.indexOf(cb);
			if (idx != -1) {
				this._waitingCallbacks.splice(idx, 1);
			}
		}
	}, {
		key: 'buffered',
		get: function get() {
			return this._duration;
		}
	}, {
		key: 'duration',
		get: function get() {
			return this._duration;
		}
	}, {
		key: 'paused',
		get: function get() {
			return this._paused;
		}
	}, {
		key: 'currentTime',
		get: function get() {
			if (this.startTime >= 0) {
				if (this.paused) {
					return this._currentTime;
				} else {
					return (this._currentTime + InnerAudioContext._context.currentTime - this.startTime) % this.duration;
				}
			} else {
				return 0;
			}
		}
	}, {
		key: 'volume',
		get: function get() {
			return this._volume['gain'].value;
		},
		set: function set(num) {
			if (isFinite(num)) {
				this._volume['gain'].value = num;
			}
		}
	}, {
		key: 'src',
		get: function get() {
			return this._src;
		},
		set: function set(url) {
			var _this = this;

			// save url
			this._src = url;

			// load if not loaded
			var b = bufferCache[url];
			if (b) {
				// set buffer
				this._buffer = b;
				this._duration = b.duration;

				// can play callback
				this._canplayCallbacks.forEach(function (fn) {
					fn();
				});

				// play
				this.play();
			} else {
				this._loading = true;
				this._load(url, function (err, buffer) {
					// check result
					if (err) {
						// check loading flag is still true
						if (_this._loading) {
							_this._errorCallbacks.forEach(function (fn) {
								fn(err);
							});
						}
					} else {
						_this._buffer = buffer;
						_this._duration = buffer.duration;
						bufferCache[url] = buffer;

						// check loading flag is still true
						if (_this._loading) {
							// can play callback
							_this._canplayCallbacks.forEach(function (fn) {
								fn();
							});

							// play
							_this.play();
						}
					}

					// clear flag
					_this._loading = false;
				});
			}
		}
	}]);

	return InnerAudioContext;
}();

function createContext() {
	// set native context
	var context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
	InnerAudioContext._context = context;

	// check context integrity
	if (!context["createBufferSource"] || !context["createGain"] || !context["destination"] || !context["decodeAudioData"]) {
		throw 'context is incomplete';
	}

	// keep a global reference to inner audio context
	window._webAudio = InnerAudioContext;
}

(function () {
	// check if browser supports Web Audio
	// check native context
	var supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);

	// audio support info
	var support = { ONLY_ONE: false, WEB_AUDIO: supportWebAudio, DELAY_CREATE_CTX: false, ONE_SOURCE: false

		// if firefox, delay create context
	};if (_globalDefined2.default.browserType === _const2.default.BROWSER_TYPE_FIREFOX) {
		support.DELAY_CREATE_CTX = true;
		support.USE_LOADER_EVENT = 'canplay';
	}

	// if iOS, load event is different
	if (_globalDefined2.default.isIOS) {
		support.USE_LOADER_EVENT = 'loadedmetadata';
	}

	// if android and uc, use only one source
	if (_globalDefined2.default.isAndroid && _globalDefined2.default.browserType === _const2.default.BROWSER_TYPE_UC) {
		support.ONE_SOURCE = true;
	}

	// save audio support info
	window.__audioSupport = support;

	// if delay create ctx, or not delay
	if (support.DELAY_CREATE_CTX) {
		setTimeout(function () {
			createContext();
		}, 0);
	} else {
		createContext();
	}
})();

exports.default = InnerAudioContext;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BackgroundAudioManager = function () {
	function BackgroundAudioManager() {
		_classCallCheck(this, BackgroundAudioManager);

		this.src = '';
		this.startTime = 0;
		this.title = '';
		this.epname = '';
		this.singer = '';
		this.coverImgUrl = '';
		this.webUrl = '';
		this.protocol = 'http';
		this.duration = 0;
		this.currentTime = 0;
		this.paused = false;
		this.buffered = 0;
	}

	_createClass(BackgroundAudioManager, [{
		key: 'play',
		value: function play() {}
	}, {
		key: 'pause',
		value: function pause() {}
	}, {
		key: 'seek',
		value: function seek(currentTime) {}
	}, {
		key: 'stop',
		value: function stop() {}
	}, {
		key: 'onCanplay',
		value: function onCanplay(callback) {}
	}, {
		key: 'onWaiting',
		value: function onWaiting(callback) {}
	}, {
		key: 'onError',
		value: function onError(callback) {}
	}, {
		key: 'onPlay',
		value: function onPlay(callback) {}
	}, {
		key: 'onPause',
		value: function onPause(callback) {}
	}, {
		key: 'onSeeking',
		value: function onSeeking(callback) {}
	}, {
		key: 'onSeeked',
		value: function onSeeked(callback) {}
	}, {
		key: 'onEnded',
		value: function onEnded(callback) {}
	}, {
		key: 'onStop',
		value: function onStop(callback) {}
	}, {
		key: 'onTimeUpdate',
		value: function onTimeUpdate(callback) {}
	}, {
		key: 'onNext',
		value: function onNext(callback) {}
	}, {
		key: 'onPrev',
		value: function onPrev(callback) {}
	}]);

	return BackgroundAudioManager;
}();

exports.default = BackgroundAudioManager;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _inst = null;

var RecorderManager = function () {
	function RecorderManager() {
		_classCallCheck(this, RecorderManager);
	}

	_createClass(RecorderManager, [{
		key: 'start',
		value: function start(params) {
			_bridge2.default.invokeMethod('RecorderManager_start', params);
		}
	}, {
		key: 'stop',
		value: function stop() {
			_bridge2.default.invokeMethod('RecorderManager_stop', {});
		}
	}, {
		key: 'resume',
		value: function resume() {
			_bridge2.default.invokeMethod('RecorderManager_resume', {});
		}
	}, {
		key: 'pause',
		value: function pause() {
			_bridge2.default.invokeMethod('RecorderManager_pause', {});
		}
	}, {
		key: 'onStop',
		value: function onStop(callback) {
			if (window.wd) {
				window.wd.onRecorderManagerStop(callback);
			}
		}
	}, {
		key: 'onStart',
		value: function onStart(callback) {
			if (window.wd) {
				window.wd.onRecorderManagerStart(callback);
			}
		}
	}, {
		key: 'onResume',
		value: function onResume(callback) {
			if (window.wd) {
				window.wd.onRecorderManagerResume(callback);
			}
		}
	}, {
		key: 'onPause',
		value: function onPause(callback) {
			if (window.wd) {
				window.wd.onRecorderManagerPause(callback);
			}
		}
	}, {
		key: 'onInterruptionEnd',
		value: function onInterruptionEnd(callback) {
			if (window.wd) {
				window.wd.onRecorderManagerInterruptionEnd(callback);
			}
		}
	}, {
		key: 'onInterruptionBegin',
		value: function onInterruptionBegin(callback) {
			if (window.wd) {
				window.wd.onRecorderManagerInterruptionBegin(callback);
			}
		}
	}, {
		key: 'onFrameRecorded',
		value: function onFrameRecorded(callback) {
			if (window.wd) {
				window.wd.onRecorderManagerFrameRecorded(callback);
			}
		}
	}, {
		key: 'onError',
		value: function onError(callback) {
			if (window.wd) {
				window.wd.onRecorderManagerError(callback);
			}
		}
	}], [{
		key: 'getInstance',
		value: function getInstance() {
			if (!_inst) {
				_inst = new RecorderManager();
			}
			return _inst;
		}
	}]);

	return RecorderManager;
}();

exports.default = RecorderManager;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _wxButton = __webpack_require__(3);

var _wxButton2 = _interopRequireDefault(_wxButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameClubButton = function (_WXButton) {
	_inherits(GameClubButton, _WXButton);

	function GameClubButton(params) {
		_classCallCheck(this, GameClubButton);

		return _possibleConstructorReturn(this, (GameClubButton.__proto__ || Object.getPrototypeOf(GameClubButton)).call(this, 'GameClub', params));
	}

	return GameClubButton;
}(_wxButton2.default);

exports.default = GameClubButton;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _wxButton = __webpack_require__(3);

var _wxButton2 = _interopRequireDefault(_wxButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserInfoButton = function (_WXButton) {
	_inherits(UserInfoButton, _WXButton);

	function UserInfoButton(params) {
		_classCallCheck(this, UserInfoButton);

		return _possibleConstructorReturn(this, (UserInfoButton.__proto__ || Object.getPrototypeOf(UserInfoButton)).call(this, 'UserInfo', params));
	}

	return UserInfoButton;
}(_wxButton2.default);

exports.default = UserInfoButton;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _wxButton = __webpack_require__(3);

var _wxButton2 = _interopRequireDefault(_wxButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OpenSettingButton = function (_WXButton) {
	_inherits(OpenSettingButton, _WXButton);

	function OpenSettingButton(params) {
		_classCallCheck(this, OpenSettingButton);

		return _possibleConstructorReturn(this, (OpenSettingButton.__proto__ || Object.getPrototypeOf(OpenSettingButton)).call(this, 'OpenSetting', params));
	}

	return OpenSettingButton;
}(_wxButton2.default);

exports.default = OpenSettingButton;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _wxButton = __webpack_require__(3);

var _wxButton2 = _interopRequireDefault(_wxButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FeedbackButton = function (_WXButton) {
	_inherits(FeedbackButton, _WXButton);

	function FeedbackButton(params) {
		_classCallCheck(this, FeedbackButton);

		return _possibleConstructorReturn(this, (FeedbackButton.__proto__ || Object.getPrototypeOf(FeedbackButton)).call(this, 'Feedback', params));
	}

	return FeedbackButton;
}(_wxButton2.default);

exports.default = FeedbackButton;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _wxButton_js = __webpack_require__(4);

var _wxButton_js2 = _interopRequireDefault(_wxButton_js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameClubButton_js = function (_WXButton_js) {
	_inherits(GameClubButton_js, _WXButton_js);

	function GameClubButton_js(params) {
		_classCallCheck(this, GameClubButton_js);

		return _possibleConstructorReturn(this, (GameClubButton_js.__proto__ || Object.getPrototypeOf(GameClubButton_js)).call(this, params));
	}

	return GameClubButton_js;
}(_wxButton_js2.default);

exports.default = GameClubButton_js;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _wxButton_js = __webpack_require__(4);

var _wxButton_js2 = _interopRequireDefault(_wxButton_js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserInfoButton_js = function (_WXButton_js) {
	_inherits(UserInfoButton_js, _WXButton_js);

	function UserInfoButton_js(params) {
		_classCallCheck(this, UserInfoButton_js);

		return _possibleConstructorReturn(this, (UserInfoButton_js.__proto__ || Object.getPrototypeOf(UserInfoButton_js)).call(this, params));
	}

	return UserInfoButton_js;
}(_wxButton_js2.default);

exports.default = UserInfoButton_js;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _wxButton_js = __webpack_require__(4);

var _wxButton_js2 = _interopRequireDefault(_wxButton_js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OpenSettingButton_js = function (_WXButton_js) {
	_inherits(OpenSettingButton_js, _WXButton_js);

	function OpenSettingButton_js(params) {
		_classCallCheck(this, OpenSettingButton_js);

		return _possibleConstructorReturn(this, (OpenSettingButton_js.__proto__ || Object.getPrototypeOf(OpenSettingButton_js)).call(this, params));
	}

	return OpenSettingButton_js;
}(_wxButton_js2.default);

exports.default = OpenSettingButton_js;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _wxButton_js = __webpack_require__(4);

var _wxButton_js2 = _interopRequireDefault(_wxButton_js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FeedbackButton_js = function (_WXButton_js) {
	_inherits(FeedbackButton_js, _WXButton_js);

	function FeedbackButton_js(params) {
		_classCallCheck(this, FeedbackButton_js);

		return _possibleConstructorReturn(this, (FeedbackButton_js.__proto__ || Object.getPrototypeOf(FeedbackButton_js)).call(this, params));
	}

	return FeedbackButton_js;
}(_wxButton_js2.default);

exports.default = FeedbackButton_js;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(10);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _inst = null;

var LogManager = function () {
	function LogManager() {
		_classCallCheck(this, LogManager);
	}

	_createClass(LogManager, [{
		key: 'debug',
		value: function debug() {
			logxx(_util2.default.format.apply(this, arguments) + '\n');
		}
	}, {
		key: 'info',
		value: function info() {
			logxx(_util2.default.format.apply(this, arguments) + '\n');
		}
	}, {
		key: 'log',
		value: function log() {
			logxx(_util2.default.format.apply(this, arguments) + '\n');
		}
	}, {
		key: 'warn',
		value: function warn() {
			logxx(_util2.default.format.apply(this, arguments) + '\n');
		}
	}], [{
		key: 'getInstance',
		value: function getInstance() {
			if (!_inst) {
				_inst = new LogManager();
			}
			return _inst;
		}
	}]);

	return LogManager;
}();

exports.default = LogManager;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// callback array
var foregroundCallbacks = [];
var backgroundCallbacks = [];
var launchCallbacks = [];
var showCallbacks = [];
var hideCallbacks = [];
var errorCallbacks = [];
var windowResizeCallbacks = [];
var networkStatusCallbacks = [];
var deviceMotionChangeCallbacks = [];
var accelerometerChangeCallbacks = [];
var compassChangeCallbacks = [];
var gyroscopeChangeCallbacks = [];
var deviceOrientationChangeCallbacks = [];
var audioInterruptionBeginCallbacks = [];
var audioInterruptionEndCallbacks = [];
var downloadProgressUpdateCallbacks = {};
var downloadHeadersReceivedCallbacks = {};
var uploadProgressUpdateCallbacks = {};
var uploadHeadersReceivedCallbacks = {};
var requestHeadersReceivedCallbacks = {};
var memoryWarningCallbacks = [];

// app page route
var appRouteCallbacks = [];
var appRouteDoneCallbacks = [];

// key is subpackage name, value is callback array
var loadSubpackageProgressUpdateCallbacks = {};

// key is url, value is callback array
var webSocketOpenCallbacks = {};
var webSocketCloseCallbacks = {};
var webSocketMessageCallbacks = {};
var webSocketErrorCallbacks = {};

var versionCheckForUpdateCallbacks = [];
var versionUpdateReadyCallbacks = [];
var versionUpdateFailedCallbacks = [];

var bannerAdResizeCallbacks = {};
var bannerAdLoadCallbacks = {};
var bannerAdErrorCallbacks = {};

var gameIconResizeCallbacks = [];
var gameIconLoadCallbacks = [];
var gameIconErrorCallbacks = [];

var gamePortalCloseCallbacks = [];
var gamePortalLoadCallbacks = [];
var gamePortalErrorCallbacks = [];

var rewardedVideoAdLoadCallbacks = {};
var rewardedVideoAdCloseCallbacks = {};
var rewardedVideoAdErrorCallbacks = {};

var extendedAdLoadCallbacks = {};
var extendedAdCloseCallbacks = {};
var extendedAdCustomCloseCallbacks = {};
var extendedAdErrorCallbacks = {};
var extendedAdVideoCloseCallbacks = {};
var extendedAdNormalClaimCallbacks = {};

var feedAdLoadCallbacks = {};
var feedAdErrorCallbacks = {};

var interstitialAdLoadCallbacks = {};
var interstitialAdCloseCallbacks = {};
var interstitialAdErrorCallbacks = {};

var shareAppMessageCallbacks = [];

var keyboardInputCallbacks = [];
var keyboardConfirmCallbacks = [];
var keyboardCompleteCallbacks = [];

var touchStartCallbacks = [];
var touchMoveCallbacks = [];
var touchEndCallbacks = [];
var touchCancelCallbacks = [];

// button tap callback is a map, key is button id, value is callback array
var wxButtonTapCallbacks = {};

// recorder manager
var recorderManagerStartCallbacks = [];
var recorderManagerStopCallbacks = [];
var recorderManagerResumeCallbacks = [];
var recorderManagerPauseCallbacks = [];
var recorderManagerErrorCallbacks = [];
var recorderManagerInterruptionEndCallbacks = [];
var recorderManagerInterruptionBeginCallbacks = [];
var recorderManagerFrameRecordedCallbacks = [];

// challenge/ladder result, key is app id
var challengeResultCallbacks = {};
var ladderResultCallbacks = {};

// shake/bubble
var shakeAwardCallbacks = [];
var bubbleAwardCallbacks = [];

// red pack
var redPackCloseCallbacks = {};

function iterateCallbackArray(cbArr, e) {
	cbArr.forEach(function (fn) {
		try {
			fn(e);
		} catch (x) {
			logxx('event callback error at ' + x.stack);
		}
	});
}

function listenEventWithCallbackArray(ev, cbArr) {
	_bridge2.default.onMethod(ev, function (e) {
		iterateCallbackArray(cbArr, e);
	});
}

function listenEventWithCallbackMap(ev, cbMap, key, preprocess, postprocess) {
	_bridge2.default.onMethod(ev, function (e) {
		var arr = cbMap[e[key]];
		if (arr) {
			// preprocess returned data
			if (preprocess && typeof preprocess == 'function') {
				preprocess(e);
			}

			// call each
			arr.forEach(function (fn) {
				try {
					fn(e);
				} catch (x) {
					logxx('event callback error at ' + x.stack);
				}
			});

			// post process
			if (postprocess && typeof postprocess == 'function') {
				postprocess(e);
			}
		}
	});
}

// push/remove callback
var onAppEnterForeground = function onAppEnterForeground(fn) {
	foregroundCallbacks.push(fn);
};
var offAppEnterForeground = function offAppEnterForeground(fn) {
	var idx = foregroundCallbacks.indexOf(fn);
	if (idx != -1) {
		foregroundCallbacks.splice(idx, 1);
	} else if (!fn) {
		foregroundCallbacks.splice(0, foregroundCallbacks.length);
	}
};
var onAppEnterBackground = function onAppEnterBackground(fn) {
	backgroundCallbacks.push(fn);
};
var offAppEnterBackground = function offAppEnterBackground(fn) {
	var idx = backgroundCallbacks.indexOf(fn);
	if (idx != -1) {
		backgroundCallbacks.splice(idx, 1);
	} else if (!fn) {
		backgroundCallbacks.splice(0, backgroundCallbacks.length);
	}
};
var onAppLaunch = function onAppLaunch(fn) {
	launchCallbacks.push(fn);
};
var offAppLaunch = function offAppLaunch(fn) {
	var idx = launchCallbacks.indexOf(fn);
	if (idx != -1) {
		launchCallbacks.splice(idx, 1);
	} else if (!fn) {
		launchCallbacks.splice(0, launchCallbacks.length);
	}
};
var onAppShow = function onAppShow(fn) {
	showCallbacks.push(fn);
};
var offAppShow = function offAppShow(fn) {
	var idx = showCallbacks.indexOf(fn);
	if (idx != -1) {
		showCallbacks.splice(idx, 1);
	} else if (!fn) {
		showCallbacks.splice(0, showCallbacks.length);
	}
};
var onAppHide = function onAppHide(fn) {
	hideCallbacks.push(fn);
};
var offAppHide = function offAppHide(fn) {
	var idx = hideCallbacks.indexOf(fn);
	if (idx != -1) {
		hideCallbacks.splice(idx, 1);
	} else if (!fn) {
		hideCallbacks.splice(0, hideCallbacks.length);
	}
};
var onAppError = function onAppError(fn) {
	errorCallbacks.push(fn);
};
var offAppError = function offAppError(fn) {
	var idx = errorCallbacks.indexOf(fn);
	if (idx != -1) {
		errorCallbacks.splice(idx, 1);
	} else if (!fn) {
		errorCallbacks.splice(0, errorCallbacks.length);
	}
};

var onAppRoute = function onAppRoute(fn) {
	appRouteCallbacks.push(fn);
};
var onAppRouteDone = function onAppRouteDone(fn) {
	appRouteDoneCallbacks.push(fn);
};

var onMemoryWarning = function onMemoryWarning(fn) {
	memoryWarningCallbacks.push(fn);
};

var onAppWindowResize = function onAppWindowResize(fn) {
	windowResizeCallbacks.push(fn);
};
var offAppWindowResize = function offAppWindowResize(fn) {
	var idx = windowResizeCallbacks.indexOf(fn);
	if (idx != -1) {
		windowResizeCallbacks.splice(idx, 1);
	} else if (!fn) {
		windowResizeCallbacks.splice(0, windowResizeCallbacks.length);
	}
};
var onAppNetworkStatusChange = function onAppNetworkStatusChange(fn) {
	networkStatusCallbacks.push(fn);
};

var onAppGyroscopeChange = function onAppGyroscopeChange(fn) {
	gyroscopeChangeCallbacks.push(fn);
};
var onAppDeviceMotionChange = function onAppDeviceMotionChange(fn) {
	deviceMotionChangeCallbacks.push(fn);
};
var onAppAccelerometerChange = function onAppAccelerometerChange(fn) {
	accelerometerChangeCallbacks.push(fn);
};
var onAppCompassChange = function onAppCompassChange(fn) {
	compassChangeCallbacks.push(fn);
};
var onAppDeviceOrientationChange = function onAppDeviceOrientationChange(fn) {
	deviceOrientationChangeCallbacks.push(fn);
};
var offAppDeviceOrientationChange = function offAppDeviceOrientationChange(fn) {
	var idx = deviceOrientationChangeCallbacks.indexOf(fn);
	if (idx != -1) {
		deviceOrientationChangeCallbacks.splice(idx, 1);
	} else if (!fn) {
		deviceOrientationChangeCallbacks.splice(0, deviceOrientationChangeCallbacks.length);
	}
};

var onAudioInterruptionBegin = function onAudioInterruptionBegin(fn) {
	audioInterruptionBeginCallbacks.push(fn);
};
var offAudioInterruptionBegin = function offAudioInterruptionBegin(fn) {
	var idx = audioInterruptionBeginCallbacks.indexOf(fn);
	if (idx != -1) {
		audioInterruptionBeginCallbacks.splice(idx, 1);
	} else if (!fn) {
		audioInterruptionBeginCallbacks.splice(0, audioInterruptionBeginCallbacks.length);
	}
};
var onAudioInterruptionEnd = function onAudioInterruptionEnd(fn) {
	audioInterruptionEndCallbacks.push(fn);
};
var offAudioInterruptionEnd = function offAudioInterruptionEnd(fn) {
	var idx = audioInterruptionEndCallbacks.indexOf(fn);
	if (idx != -1) {
		audioInterruptionEndCallbacks.splice(idx, 1);
	} else if (!fn) {
		audioInterruptionEndCallbacks.splice(0, audioInterruptionEndCallbacks.length);
	}
};

var onUploadProgressUpdate = function onUploadProgressUpdate(taskId, fn) {
	var arr = uploadProgressUpdateCallbacks[taskId];
	if (!arr) {
		arr = [];
		uploadProgressUpdateCallbacks[taskId] = arr;
	}
	arr.push(fn);
};
var offUploadProgressUpdate = function offUploadProgressUpdate(taskId, fn) {
	var arr = uploadProgressUpdateCallbacks[taskId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		}
	}
};
var clearUploadProgressUpdate = function clearUploadProgressUpdate(taskId) {
	delete uploadProgressUpdateCallbacks[taskId];
};
var onUploadHeadersReceived = function onUploadHeadersReceived(taskId, fn) {
	var arr = uploadHeadersReceivedCallbacks[taskId];
	if (!arr) {
		arr = [];
		uploadHeadersReceivedCallbacks[taskId] = arr;
	}
	arr.push(fn);
};
var offUploadHeadersReceived = function offUploadHeadersReceived(taskId, fn) {
	var arr = uploadHeadersReceivedCallbacks[taskId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		}
	}
};
var clearUploadHeadersReceived = function clearUploadHeadersReceived(taskId) {
	delete uploadHeadersReceivedCallbacks[taskId];
};

var onRequestHeadersReceived = function onRequestHeadersReceived(taskId, fn) {
	var arr = requestHeadersReceivedCallbacks[taskId];
	if (!arr) {
		arr = [];
		requestHeadersReceivedCallbacks[taskId] = arr;
	}
	arr.push(fn);
};
var offRequestHeadersReceived = function offRequestHeadersReceived(taskId, fn) {
	var arr = requestHeadersReceivedCallbacks[taskId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		}
	}
};
var clearRequestHeadersReceived = function clearRequestHeadersReceived(taskId) {
	delete requestHeadersReceivedCallbacks[taskId];
};

var onDownloadProgressUpdate = function onDownloadProgressUpdate(taskId, fn) {
	var arr = downloadProgressUpdateCallbacks[taskId];
	if (!arr) {
		arr = [];
		downloadProgressUpdateCallbacks[taskId] = arr;
	}
	arr.push(fn);
};
var offDownloadProgressUpdate = function offDownloadProgressUpdate(taskId, fn) {
	var arr = downloadProgressUpdateCallbacks[taskId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		}
	}
};
var clearDownloadProgressUpdate = function clearDownloadProgressUpdate(taskId) {
	delete downloadProgressUpdateCallbacks[taskId];
};
var onDownloadHeadersReceived = function onDownloadHeadersReceived(taskId, fn) {
	var arr = downloadHeadersReceivedCallbacks[taskId];
	if (!arr) {
		arr = [];
		downloadHeadersReceivedCallbacks[taskId] = arr;
	}
	arr.push(fn);
};
var offDownloadHeadersReceived = function offDownloadHeadersReceived(taskId, fn) {
	var arr = downloadHeadersReceivedCallbacks[taskId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		}
	}
};
var clearDownloadHeadersReceived = function clearDownloadHeadersReceived(taskId) {
	delete downloadHeadersReceivedCallbacks[taskId];
};

var onLoadSubpackageProgressUpdate = function onLoadSubpackageProgressUpdate(name, fn) {
	var arr = loadSubpackageProgressUpdateCallbacks[name];
	if (!arr) {
		arr = [];
		loadSubpackageProgressUpdateCallbacks[name] = arr;
	}
	arr.push(fn);
};
var offLoadSubpackageProgressUpdate = function offLoadSubpackageProgressUpdate(name, fn) {
	var arr = loadSubpackageProgressUpdateCallbacks[name];
	if (arr) {
		if (fn) {
			var idx = arr.indexOf(fn);
			if (idx != -1) {
				arr.splice(idx, 1);
			}
		} else {
			arr.splice(0, arr.length);
		}
		if (arr.length <= 0) {
			delete loadSubpackageProgressUpdateCallbacks[name];
		}
	}
};

var onAppSocketOpen = function onAppSocketOpen(url, fn) {
	var arr = webSocketOpenCallbacks[url];
	if (!arr) {
		arr = [];
		webSocketOpenCallbacks[url] = arr;
	}
	if (fn) {
		arr.push(fn);
	} else {
		arr.splice(0, arr.length);
	}
};
var onAppSocketClose = function onAppSocketClose(url, fn) {
	var arr = webSocketCloseCallbacks[url];
	if (!arr) {
		arr = [];
		webSocketCloseCallbacks[url] = arr;
	}
	if (fn) {
		arr.push(fn);
	} else {
		arr.splice(0, arr.length);
	}
};
var onAppSocketMessage = function onAppSocketMessage(url, fn) {
	var arr = webSocketMessageCallbacks[url];
	if (!arr) {
		arr = [];
		webSocketMessageCallbacks[url] = arr;
	}
	if (fn) {
		arr.push(fn);
	} else {
		arr.splice(0, arr.length);
	}
};
var onAppSocketError = function onAppSocketError(url, fn) {
	var arr = webSocketErrorCallbacks[url];
	if (!arr) {
		arr = [];
		webSocketErrorCallbacks[url] = arr;
	}
	if (fn) {
		arr.push(fn);
	} else {
		arr.splice(0, arr.length);
	}
};
var clearAppSocketCallbacks = function clearAppSocketCallbacks(url) {
	delete webSocketOpenCallbacks[url];
	delete webSocketCloseCallbacks[url];
	delete webSocketMessageCallbacks[url];
	delete webSocketErrorCallbacks[url];
};

//version update manager
var onAppCheckForUpdate = function onAppCheckForUpdate(fn) {
	versionCheckForUpdateCallbacks.push(fn);
};
var onAppUpdateReady = function onAppUpdateReady(fn) {
	versionUpdateReadyCallbacks.push(fn);
};
var onAppUpdateFailed = function onAppUpdateFailed(fn) {
	versionUpdateFailedCallbacks.push(fn);
};

//Banner Ad
var onAppBannerAdResize = function onAppBannerAdResize(adId, fn) {
	var arr = bannerAdResizeCallbacks[adId];
	if (!arr) {
		arr = [];
		bannerAdResizeCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppBannerAdResize = function offAppBannerAdResize(adId, fn) {
	var arr = bannerAdResizeCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppBannerAdLoad = function onAppBannerAdLoad(adId, fn) {
	var arr = bannerAdLoadCallbacks[adId];
	if (!arr) {
		arr = [];
		bannerAdLoadCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppBannerAdLoad = function offAppBannerAdLoad(adId, fn) {
	var arr = bannerAdLoadCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppBannerAdError = function onAppBannerAdError(adId, fn) {
	var arr = bannerAdErrorCallbacks[adId];
	if (!arr) {
		arr = [];
		bannerAdErrorCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppBannerAdError = function offAppBannerAdError(adId, fn) {
	var arr = bannerAdErrorCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var clearBannerAdCallbacks = function clearBannerAdCallbacks(adId) {
	delete bannerAdErrorCallbacks[adId];
	delete bannerAdLoadCallbacks[adId];
	delete bannerAdResizeCallbacks[adId];
};

// game icon
var onAppGameIconResize = function onAppGameIconResize(fn) {
	gameIconResizeCallbacks.push(fn);
};
var offAppGameIconResize = function offAppGameIconResize(fn) {
	var idx = gameIconResizeCallbacks.indexOf(fn);
	if (idx != -1) {
		gameIconResizeCallbacks.splice(idx, 1);
	} else if (!fn) {
		gameIconResizeCallbacks.splice(0, gameIconResizeCallbacks.length);
	}
};

var onAppGameIconLoad = function onAppGameIconLoad(fn) {
	gameIconLoadCallbacks.push(fn);
};
var offAppGameIconLoad = function offAppGameIconLoad(fn) {
	var idx = gameIconLoadCallbacks.indexOf(fn);
	if (idx != -1) {
		gameIconLoadCallbacks.splice(idx, 1);
	} else if (!fn) {
		gameIconLoadCallbacks.splice(0, gameIconLoadCallbacks.length);
	}
};

var onAppGameIconError = function onAppGameIconError(fn) {
	gameIconErrorCallbacks.push(fn);
};
var offAppGameIconError = function offAppGameIconError(fn) {
	var idx = gameIconErrorCallbacks.indexOf(fn);
	if (idx != -1) {
		gameIconErrorCallbacks.splice(idx, 1);
	} else if (!fn) {
		gameIconErrorCallbacks.splice(0, gameIconErrorCallbacks.length);
	}
};

// game portal
var onAppGamePortalClose = function onAppGamePortalClose(fn) {
	gamePortalCloseCallbacks.push(fn);
};
var offAppGamePortalClose = function offAppGamePortalClose(fn) {
	var idx = gamePortalCloseCallbacks.indexOf(fn);
	if (idx != -1) {
		gamePortalCloseCallbacks.splice(idx, 1);
	} else if (!fn) {
		gamePortalCloseCallbacks.splice(0, gamePortalCloseCallbacks.length);
	}
};

var onAppGamePortalLoad = function onAppGamePortalLoad(fn) {
	gamePortalLoadCallbacks.push(fn);
};
var offAppGamePortalLoad = function offAppGamePortalLoad(fn) {
	var idx = gamePortalLoadCallbacks.indexOf(fn);
	if (idx != -1) {
		gamePortalLoadCallbacks.splice(idx, 1);
	} else if (!fn) {
		gamePortalLoadCallbacks.splice(0, gamePortalLoadCallbacks.length);
	}
};

var onAppGamePortalError = function onAppGamePortalError(fn) {
	gamePortalErrorCallbacks.push(fn);
};
var offAppGamePortalError = function offAppGamePortalError(fn) {
	var idx = gamePortalErrorCallbacks.indexOf(fn);
	if (idx != -1) {
		gamePortalErrorCallbacks.splice(idx, 1);
	} else if (!fn) {
		gamePortalErrorCallbacks.splice(0, gamePortalErrorCallbacks.length);
	}
};

// Video Ad
var onAppRewardedVideoAdLoad = function onAppRewardedVideoAdLoad(adId, fn) {
	var arr = rewardedVideoAdLoadCallbacks[adId];
	if (!arr) {
		arr = [];
		rewardedVideoAdLoadCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppRewardedVideoAdLoad = function offAppRewardedVideoAdLoad(adId, fn) {
	var arr = rewardedVideoAdLoadCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppRewardedVideoAdClose = function onAppRewardedVideoAdClose(adId, fn) {
	var arr = rewardedVideoAdCloseCallbacks[adId];
	if (!arr) {
		arr = [];
		rewardedVideoAdCloseCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppRewardedVideoAdClose = function offAppRewardedVideoAdClose(adId, fn) {
	var arr = rewardedVideoAdCloseCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppRewardedVideoAdError = function onAppRewardedVideoAdError(adId, fn) {
	var arr = rewardedVideoAdErrorCallbacks[adId];
	if (!arr) {
		arr = [];
		rewardedVideoAdErrorCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppRewardedVideoAdError = function offAppRewardedVideoAdError(adId, fn) {
	var arr = rewardedVideoAdErrorCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var clearRewardedVideoAdCallbacks = function clearRewardedVideoAdCallbacks(adId) {
	delete rewardedVideoAdLoadCallbacks[adId];
	delete rewardedVideoAdCloseCallbacks[adId];
	delete rewardedVideoAdErrorCallbacks[adId];
};

// extended ad
var onAppExtendedAdLoad = function onAppExtendedAdLoad(adId, fn) {
	var arr = extendedAdLoadCallbacks[adId];
	if (!arr) {
		arr = [];
		extendedAdLoadCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppExtendedAdLoad = function offAppExtendedAdLoad(adId, fn) {
	var arr = extendedAdLoadCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppExtendedAdClose = function onAppExtendedAdClose(adId, fn) {
	var arr = extendedAdCloseCallbacks[adId];
	if (!arr) {
		arr = [];
		extendedAdCloseCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppExtendedAdClose = function offAppExtendedAdClose(adId, fn) {
	var arr = extendedAdCloseCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppExtendedAdCustomClose = function onAppExtendedAdCustomClose(adId, fn) {
	var arr = extendedAdCustomCloseCallbacks[adId];
	if (!arr) {
		arr = [];
		extendedAdCustomCloseCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppExtendedAdCustomClose = function offAppExtendedAdCustomClose(adId, fn) {
	var arr = extendedAdCustomCloseCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppExtendedAdError = function onAppExtendedAdError(adId, fn) {
	var arr = extendedAdErrorCallbacks[adId];
	if (!arr) {
		arr = [];
		extendedAdErrorCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppExtendedAdError = function offAppExtendedAdError(adId, fn) {
	var arr = extendedAdErrorCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppExtendedAdVideoClose = function onAppExtendedAdVideoClose(adId, fn) {
	var arr = extendedAdVideoCloseCallbacks[adId];
	if (!arr) {
		arr = [];
		extendedAdVideoCloseCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppExtendedAdVideoClose = function offAppExtendedAdVideoClose(adId, fn) {
	var arr = extendedAdVideoCloseCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppExtendedAdNormalClaim = function onAppExtendedAdNormalClaim(adId, fn) {
	var arr = extendedAdNormalClaimCallbacks[adId];
	if (!arr) {
		arr = [];
		extendedAdNormalClaimCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppExtendedAdNormalClaim = function offAppExtendedAdNormalClaim(adId, fn) {
	var arr = extendedAdNormalClaimCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var clearExtendedAdCallbacks = function clearExtendedAdCallbacks(adId) {
	delete extendedAdLoadCallbacks[adId];
	delete extendedAdCloseCallbacks[adId];
	delete extendedAdCustomCloseCallbacks[adId];
	delete extendedAdErrorCallbacks[adId];
	delete extendedAdVideoCloseCallbacks[adId];
	delete extendedAdNormalClaimCallbacks[adId];
};

// feed ad
var onAppFeedAdLoad = function onAppFeedAdLoad(adId, fn) {
	var arr = feedAdLoadCallbacks[adId];
	if (!arr) {
		arr = [];
		feedAdLoadCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppFeedAdLoad = function offAppFeedAdLoad(adId, fn) {
	var arr = feedAdLoadCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppFeedAdError = function onAppFeedAdError(adId, fn) {
	var arr = feedAdErrorCallbacks[adId];
	if (!arr) {
		arr = [];
		feedAdErrorCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppFeedAdError = function offAppFeedAdError(adId, fn) {
	var arr = feedAdErrorCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var clearFeedAdCallbacks = function clearFeedAdCallbacks(adId) {
	delete feedAdLoadCallbacks[adId];
	delete feedAdErrorCallbacks[adId];
};

// Interstitial Ad
var onAppInterstitialAdLoad = function onAppInterstitialAdLoad(adId, fn) {
	var arr = interstitialAdLoadCallbacks[adId];
	if (!arr) {
		arr = [];
		interstitialAdLoadCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppInterstitialAdLoad = function offAppInterstitialAdLoad(adId, fn) {
	var arr = interstitialAdLoadCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppInterstitialAdClose = function onAppInterstitialAdClose(adId, fn) {
	var arr = interstitialAdCloseCallbacks[adId];
	if (!arr) {
		arr = [];
		interstitialAdCloseCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppInterstitialAdClose = function offAppInterstitialAdClose(adId, fn) {
	var arr = interstitialAdCloseCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var onAppInterstitialAdError = function onAppInterstitialAdError(adId, fn) {
	var arr = interstitialAdErrorCallbacks[adId];
	if (!arr) {
		arr = [];
		interstitialAdErrorCallbacks[adId] = arr;
	}
	arr.push(fn);
};
var offAppInterstitialAdError = function offAppInterstitialAdError(adId, fn) {
	var arr = interstitialAdErrorCallbacks[adId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		} else if (!fn) {
			arr.splice(0, arr.length);
		}
	}
};
var clearInterstitialAdCallbacks = function clearInterstitialAdCallbacks(adId) {
	delete interstitialAdLoadCallbacks[adId];
	delete interstitialAdCloseCallbacks[adId];
	delete interstitialAdErrorCallbacks[adId];
};

var onShareAppMessage = function onShareAppMessage(fn) {
	shareAppMessageCallbacks.push(fn);
};
var offShareAppMessage = function offShareAppMessage(fn) {
	var idx = shareAppMessageCallbacks.indexOf(fn);
	if (idx != -1) {
		shareAppMessageCallbacks.splice(idx, 1);
	} else if (!fn) {
		shareAppMessageCallbacks.splice(0, shareAppMessageCallbacks.length);
	}
};

var onKeyboardInput = function onKeyboardInput(fn) {
	keyboardInputCallbacks.push(fn);
};
var offKeyboardInput = function offKeyboardInput(fn) {
	var idx = keyboardInputCallbacks.indexOf(fn);
	if (idx != -1) {
		keyboardInputCallbacks.splice(idx, 1);
	} else if (!fn) {
		keyboardInputCallbacks.splice(0, keyboardInputCallbacks.length);
	}
};
var onKeyboardConfirm = function onKeyboardConfirm(fn) {
	keyboardConfirmCallbacks.push(fn);
};
var offKeyboardConfirm = function offKeyboardConfirm(fn) {
	var idx = keyboardConfirmCallbacks.indexOf(fn);
	if (idx != -1) {
		keyboardConfirmCallbacks.splice(idx, 1);
	} else if (!fn) {
		keyboardConfirmCallbacks.splice(0, keyboardConfirmCallbacks.length);
	}
};
var onKeyboardComplete = function onKeyboardComplete(fn) {
	keyboardCompleteCallbacks.push(fn);
};
var offKeyboardComplete = function offKeyboardComplete(fn) {
	var idx = keyboardCompleteCallbacks.indexOf(fn);
	if (idx != -1) {
		keyboardCompleteCallbacks.splice(idx, 1);
	} else if (!fn) {
		keyboardCompleteCallbacks.splice(0, keyboardCompleteCallbacks.length);
	}
};

var onTouchStart = function onTouchStart(fn) {
	touchStartCallbacks.push(fn);
};
var offTouchStart = function offTouchStart(fn) {
	// XXX: i see some game call this with callback undefined, for such situation,
	// we remove all added callbacks
	if (fn) {
		var idx = touchStartCallbacks.indexOf(fn);
		if (idx != -1) {
			touchStartCallbacks.splice(idx, 1);
		}
	} else {
		touchStartCallbacks.splice(0, touchStartCallbacks.length);
	}
};
var onTouchMove = function onTouchMove(fn) {
	touchMoveCallbacks.push(fn);
};
var offTouchMove = function offTouchMove(fn) {
	// XXX: i see some game call this with callback undefined, for such situation,
	// we remove all added callbacks
	if (fn) {
		var idx = touchMoveCallbacks.indexOf(fn);
		if (idx != -1) {
			touchMoveCallbacks.splice(idx, 1);
		}
	} else {
		touchMoveCallbacks.splice(0, touchMoveCallbacks.length);
	}
};
var onTouchEnd = function onTouchEnd(fn) {
	touchEndCallbacks.push(fn);
};
var offTouchEnd = function offTouchEnd(fn) {
	// XXX: i see some game call this with callback undefined, for such situation,
	// we remove all added callbacks
	if (fn) {
		var idx = touchEndCallbacks.indexOf(fn);
		if (idx != -1) {
			touchEndCallbacks.splice(idx, 1);
		}
	} else {
		touchEndCallbacks.splice(0, touchEndCallbacks.length);
	}
};
var onTouchCancel = function onTouchCancel(fn) {
	touchCancelCallbacks.push(fn);
};
var offTouchCancel = function offTouchCancel(fn) {
	// XXX: i see some game call this with callback undefined, for such situation,
	// we remove all added callbacks
	if (fn) {
		var idx = touchCancelCallbacks.indexOf(fn);
		if (idx != -1) {
			touchCancelCallbacks.splice(idx, 1);
		}
	} else {
		touchCancelCallbacks.splice(0, touchCancelCallbacks.length);
	}
};
var dispatchTouchStart = function dispatchTouchStart(e) {
	touchStartCallbacks.forEach(function (fn) {
		fn(e);
	});
};
var dispatchTouchMove = function dispatchTouchMove(e) {
	touchMoveCallbacks.forEach(function (fn) {
		fn(e);
	});
};
var dispatchTouchEnd = function dispatchTouchEnd(e) {
	touchEndCallbacks.forEach(function (fn) {
		fn(e);
	});
};
var dispatchTouchCancel = function dispatchTouchCancel(e) {
	touchCancelCallbacks.forEach(function (fn) {
		fn(e);
	});
};

var onWXButtonTap = function onWXButtonTap(buttonId, fn) {
	var arr = wxButtonTapCallbacks[buttonId];
	if (!arr) {
		arr = [];
		wxButtonTapCallbacks[buttonId] = arr;
	}
	arr.push(fn);
};
var offWXButtonTap = function offWXButtonTap(buttonId, fn) {
	var arr = wxButtonTapCallbacks[buttonId];
	if (arr) {
		var idx = arr.indexOf(fn);
		if (idx != -1) {
			arr.splice(idx, 1);
		}
	}
};
var clearWXButtonTap = function clearWXButtonTap(buttonId) {
	delete wxButtonTapCallbacks[buttonId];
};

var onRecorderManagerStart = function onRecorderManagerStart(fn) {
	recorderManagerStartCallbacks.push(fn);
};
var onRecorderManagerStop = function onRecorderManagerStop(fn) {
	recorderManagerStopCallbacks.push(fn);
};
var onRecorderManagerResume = function onRecorderManagerResume(fn) {
	recorderManagerResumeCallbacks.push(fn);
};
var onRecorderManagerPause = function onRecorderManagerPause(fn) {
	recorderManagerPauseCallbacks.push(fn);
};
var onRecorderManagerError = function onRecorderManagerError(fn) {
	recorderManagerErrorCallbacks.push(fn);
};
var onRecorderManagerInterruptionEnd = function onRecorderManagerInterruptionEnd(fn) {
	recorderManagerInterruptionEndCallbacks.push(fn);
};
var onRecorderManagerInterruptionBegin = function onRecorderManagerInterruptionBegin(fn) {
	recorderManagerInterruptionBeginCallbacks.push(fn);
};
var onRecorderManagerFrameRecorded = function onRecorderManagerFrameRecorded(fn) {
	recorderManagerFrameRecordedCallbacks.push(fn);
};

var onChallengeResultPlayAgain = function onChallengeResultPlayAgain(appId, fn) {
	var arr = challengeResultCallbacks[appId];
	if (!arr) {
		arr = [];
		challengeResultCallbacks[appId] = arr;
	}
	arr.push(fn);
};
var clearChallengeResultCallbacks = function clearChallengeResultCallbacks(appId) {
	delete challengeResultCallbacks[appId];
};
var onLadderResultPlayAgain = function onLadderResultPlayAgain(appId, fn) {
	var arr = ladderResultCallbacks[appId];
	if (!arr) {
		arr = [];
		ladderResultCallbacks[appId] = arr;
	}
	arr.push(fn);
};
var clearLadderResultCallbacks = function clearLadderResultCallbacks(appId) {
	delete ladderResultCallbacks[appId];
};

// shake
var onAppShakeAward = function onAppShakeAward(cb) {
	shakeAwardCallbacks.push(cb);
};
var clearShakeCallbacks = function clearShakeCallbacks() {
	shakeAwardCallbacks.splice(0, shakeAwardCallbacks.length);
};

// bubble
var onAppBubbleAward = function onAppBubbleAward(cb) {
	bubbleAwardCallbacks.push(cb);
};
var clearBubbleCallbacks = function clearBubbleCallbacks() {
	bubbleAwardCallbacks.splice(0, bubbleAwardCallbacks.length);
};

// red pack
var onAppRedPackClose = function onAppRedPackClose(redPackId, fn) {
	var arr = redPackCloseCallbacks[redPackId];
	if (!arr) {
		arr = [];
		redPackCloseCallbacks[redPackId] = arr;
	}
	arr.push(fn);
};
var offAppRedPackClose = function offAppRedPackClose(redPackId, fn) {
	var arr = redPackCloseCallbacks[redPackId];
	if (arr) {
		if (!fn) {
			delete redPackCloseCallbacks[redPackId];
		} else {
			var idx = arr.indexOf(fn);
			if (idx != -1) {
				arr.splice(idx, 1);
			}
		}
	}
};

// listen event
listenEventWithCallbackArray("onAppEnterForeground", foregroundCallbacks);
listenEventWithCallbackArray("onAppEnterBackground", backgroundCallbacks);
listenEventWithCallbackArray("onAppLaunch", launchCallbacks);
listenEventWithCallbackArray("onAppShow", showCallbacks);
listenEventWithCallbackArray("onAppHide", hideCallbacks);
listenEventWithCallbackArray("onAppError", errorCallbacks);
listenEventWithCallbackArray("onAppRoute", appRouteCallbacks);
listenEventWithCallbackArray("onAppRouteDone", appRouteDoneCallbacks);
listenEventWithCallbackArray("onMemoryWarning", memoryWarningCallbacks);
listenEventWithCallbackArray("onAppWindowResize", windowResizeCallbacks);
listenEventWithCallbackArray("onAppNetworkStatusChange", networkStatusCallbacks);
listenEventWithCallbackArray("onAppGyroscopeChange", gyroscopeChangeCallbacks);
listenEventWithCallbackArray("onAppDeviceMotionChange", deviceMotionChangeCallbacks);
listenEventWithCallbackArray("onAppAccelerometerChange", accelerometerChangeCallbacks);
listenEventWithCallbackArray("onAppCompassChange", compassChangeCallbacks);
listenEventWithCallbackArray("onAppDeviceOrientationChange", deviceOrientationChangeCallbacks);
listenEventWithCallbackArray("onAudioInterruptionBegin", audioInterruptionBeginCallbacks);
listenEventWithCallbackArray("onAudioInterruptionEnd", audioInterruptionEndCallbacks);

listenEventWithCallbackMap("onDownloadProgressUpdate", downloadProgressUpdateCallbacks, 'taskId');
listenEventWithCallbackMap("onDownloadHeadersReceived", downloadHeadersReceivedCallbacks, 'taskId');
_bridge2.default.onMethod("onDownloadTaskDone", function (e) {
	clearDownloadHeadersReceived(e.taskId);
	clearDownloadProgressUpdate(e.taskId);
});

listenEventWithCallbackMap("onUploadProgressUpdate", uploadProgressUpdateCallbacks, 'taskId');
listenEventWithCallbackMap("onUploadHeadersReceived", uploadHeadersReceivedCallbacks, 'taskId');
_bridge2.default.onMethod("onUploadTaskDone", function (e) {
	clearUploadHeadersReceived(e.taskId);
	clearUploadProgressUpdate(e.taskId);
});

listenEventWithCallbackMap("onRequestHeadersReceived", requestHeadersReceivedCallbacks, 'taskId');
_bridge2.default.onMethod("onRequestTaskDone", function (e) {
	clearRequestHeadersReceived(e.taskId);
});

listenEventWithCallbackMap("onLoadSubpackageProgressUpdate", loadSubpackageProgressUpdateCallbacks, 'name');

listenEventWithCallbackMap("onAppSocketOpen", webSocketOpenCallbacks, 'url');
listenEventWithCallbackMap("onAppSocketClose", webSocketCloseCallbacks, 'url');
listenEventWithCallbackMap("onAppSocketMessage", webSocketMessageCallbacks, 'url', function (e) {
	// if data is base64 encoded, convert it to ArrayBuffer
	if (e.base64 && e.data) {
		var binary_string = window.atob(e.data);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		e.data = bytes.buffer;
		delete e.base64;
	}
});
listenEventWithCallbackMap("onAppSocketError", webSocketErrorCallbacks, 'url');

listenEventWithCallbackArray("onAppCheckForUpdate", versionCheckForUpdateCallbacks);
listenEventWithCallbackArray("onAppUpdateReady", versionUpdateReadyCallbacks);
listenEventWithCallbackArray("onAppUpdateFailed", versionUpdateFailedCallbacks);

listenEventWithCallbackMap("onAppBannerAdResize", bannerAdResizeCallbacks, "adId");
listenEventWithCallbackMap("onAppBannerAdLoad", bannerAdLoadCallbacks, "adId");
listenEventWithCallbackMap("onAppBannerAdError", bannerAdErrorCallbacks, "adId");

listenEventWithCallbackArray("onAppGameIconResize", gameIconResizeCallbacks);
listenEventWithCallbackArray("onAppGameIconLoad", gameIconLoadCallbacks);
listenEventWithCallbackArray("onAppGameIconError", gameIconErrorCallbacks);

listenEventWithCallbackArray("onAppGamePortalClose", gamePortalCloseCallbacks);
listenEventWithCallbackArray("onAppGamePortalLoad", gamePortalLoadCallbacks);
listenEventWithCallbackArray("onAppGamePortalError", gamePortalErrorCallbacks);

listenEventWithCallbackMap("onAppRewardedVideoAdLoad", rewardedVideoAdLoadCallbacks, "adId");
listenEventWithCallbackMap("onAppRewardedVideoAdClose", rewardedVideoAdCloseCallbacks, "adId");
listenEventWithCallbackMap("onAppRewardedVideoAdError", rewardedVideoAdErrorCallbacks, "adId");

listenEventWithCallbackMap("onAppExtendedAdLoad", extendedAdLoadCallbacks, "adId");
listenEventWithCallbackMap("onAppExtendedAdClose", extendedAdCloseCallbacks, "adId");
listenEventWithCallbackMap("onAppExtendedAdCustomClose", extendedAdCustomCloseCallbacks, "adId");
listenEventWithCallbackMap("onAppExtendedAdError", extendedAdErrorCallbacks, "adId");
listenEventWithCallbackMap("onAppExtendedAdVideoClose", extendedAdVideoCloseCallbacks, "adId");
listenEventWithCallbackMap("onAppExtendedAdNormalClaim", extendedAdNormalClaimCallbacks, "adId");

listenEventWithCallbackMap("onAppFeedAdLoad", feedAdLoadCallbacks, "adId");
listenEventWithCallbackMap("onAppFeedAdError", feedAdErrorCallbacks, "adId");

listenEventWithCallbackMap("onAppInterstitialAdLoad", interstitialAdLoadCallbacks, "adId");
listenEventWithCallbackMap("onAppInterstitialAdClose", interstitialAdCloseCallbacks, "adId");
listenEventWithCallbackMap("onAppInterstitialAdError", interstitialAdErrorCallbacks, "adId");

listenEventWithCallbackArray("onShareAppMessage", shareAppMessageCallbacks);
listenEventWithCallbackArray("onKeyboardInput", keyboardInputCallbacks);
listenEventWithCallbackArray("onKeyboardConfirm", keyboardConfirmCallbacks);
listenEventWithCallbackArray("onKeyboardComplete", keyboardCompleteCallbacks);

listenEventWithCallbackMap("onWXButtonTap", wxButtonTapCallbacks, 'buttonId');

listenEventWithCallbackArray("onRecorderManagerStart", recorderManagerStartCallbacks);
listenEventWithCallbackArray("onRecorderManagerStop", recorderManagerStopCallbacks);
listenEventWithCallbackArray("onRecorderManagerResume", recorderManagerResumeCallbacks);
listenEventWithCallbackArray("onRecorderManagerPause", recorderManagerPauseCallbacks);
listenEventWithCallbackArray("onRecorderManagerError", recorderManagerErrorCallbacks);
listenEventWithCallbackArray("onRecorderManagerInterruptionBegin", recorderManagerInterruptionBeginCallbacks);
listenEventWithCallbackArray("onRecorderManagerInterruptionEnd", recorderManagerInterruptionEndCallbacks);
listenEventWithCallbackArray("onRecorderManagerFrameRecorded", recorderManagerFrameRecordedCallbacks);

listenEventWithCallbackMap("onChallengeResultPlayAgain", challengeResultCallbacks, 'appId');
listenEventWithCallbackMap("onLadderResultPlayAgain", ladderResultCallbacks, 'appId');

listenEventWithCallbackArray("onAppShakeAward", shakeAwardCallbacks);
listenEventWithCallbackArray("onAppBubbleAward", bubbleAwardCallbacks);

listenEventWithCallbackMap("onAppRedPackClose", redPackCloseCallbacks, "redPackId", null, function (e) {
	offAppRedPackClose(e['redPackId']);
});

var wd = {
	onAppEnterForeground: onAppEnterForeground,
	offAppEnterForeground: offAppEnterForeground,
	onAppEnterBackground: onAppEnterBackground,
	offAppEnterBackground: offAppEnterBackground,
	onAppLaunch: onAppLaunch,
	offAppLaunch: offAppLaunch,
	onAppShow: onAppShow,
	offAppShow: offAppShow,
	onAppHide: onAppHide,
	offAppHide: offAppHide,
	onAppError: onAppError,
	offAppError: offAppError,
	onAppRoute: onAppRoute,
	onAppRouteDone: onAppRouteDone,
	onMemoryWarning: onMemoryWarning,
	onAppWindowResize: onAppWindowResize,
	offAppWindowResize: offAppWindowResize,
	onAppNetworkStatusChange: onAppNetworkStatusChange,
	onAppGyroscopeChange: onAppGyroscopeChange,
	onAppDeviceMotionChange: onAppDeviceMotionChange,
	onAppAccelerometerChange: onAppAccelerometerChange,
	onAppCompassChange: onAppCompassChange,
	onAppDeviceOrientationChange: onAppDeviceOrientationChange,
	offAppDeviceOrientationChange: offAppDeviceOrientationChange,
	onAudioInterruptionBegin: onAudioInterruptionBegin,
	offAudioInterruptionBegin: offAudioInterruptionBegin,
	onAudioInterruptionEnd: onAudioInterruptionEnd,
	offAudioInterruptionEnd: offAudioInterruptionEnd,

	onDownloadProgressUpdate: onDownloadProgressUpdate,
	offDownloadProgressUpdate: offDownloadProgressUpdate,
	clearDownloadProgressUpdate: clearDownloadProgressUpdate,
	onDownloadHeadersReceived: onDownloadHeadersReceived,
	offDownloadHeadersReceived: offDownloadHeadersReceived,
	clearDownloadHeadersReceived: clearDownloadHeadersReceived,
	onUploadProgressUpdate: onUploadProgressUpdate,
	offUploadProgressUpdate: offUploadProgressUpdate,
	clearUploadProgressUpdate: clearUploadProgressUpdate,
	onUploadHeadersReceived: onUploadHeadersReceived,
	offUploadHeadersReceived: offUploadHeadersReceived,
	clearUploadHeadersReceived: clearUploadHeadersReceived,
	onRequestHeadersReceived: onRequestHeadersReceived,
	offRequestHeadersReceived: offRequestHeadersReceived,
	clearRequestHeadersReceived: clearRequestHeadersReceived,

	onLoadSubpackageProgressUpdate: onLoadSubpackageProgressUpdate,
	offLoadSubpackageProgressUpdate: offLoadSubpackageProgressUpdate,
	onAppSocketOpen: onAppSocketOpen,
	onAppSocketClose: onAppSocketClose,
	onAppSocketMessage: onAppSocketMessage,
	onAppSocketError: onAppSocketError,
	clearAppSocketCallbacks: clearAppSocketCallbacks,
	onAppCheckForUpdate: onAppCheckForUpdate,
	onAppUpdateReady: onAppUpdateReady,
	onAppUpdateFailed: onAppUpdateFailed,

	onAppBannerAdResize: onAppBannerAdResize,
	offAppBannerAdResize: offAppBannerAdResize,
	onAppBannerAdLoad: onAppBannerAdLoad,
	offAppBannerAdLoad: offAppBannerAdLoad,
	onAppBannerAdError: onAppBannerAdError,
	offAppBannerAdError: offAppBannerAdError,
	clearBannerAdCallbacks: clearBannerAdCallbacks,

	onAppGameIconResize: onAppGameIconResize,
	offAppGameIconResize: offAppGameIconResize,
	onAppGameIconLoad: onAppGameIconLoad,
	offAppGameIconLoad: offAppGameIconLoad,
	onAppGameIconError: onAppGameIconError,
	offAppGameIconError: offAppGameIconError,

	onAppGamePortalClose: onAppGamePortalClose,
	offAppGamePortalClose: offAppGamePortalClose,
	onAppGamePortalLoad: onAppGamePortalLoad,
	offAppGamePortalLoad: offAppGamePortalLoad,
	onAppGamePortalError: onAppGamePortalError,
	offAppGamePortalError: offAppGamePortalError,

	onAppRewardedVideoAdLoad: onAppRewardedVideoAdLoad,
	offAppRewardedVideoAdLoad: offAppRewardedVideoAdLoad,
	onAppRewardedVideoAdClose: onAppRewardedVideoAdClose,
	offAppRewardedVideoAdClose: offAppRewardedVideoAdClose,
	onAppRewardedVideoAdError: onAppRewardedVideoAdError,
	offAppRewardedVideoAdError: offAppRewardedVideoAdError,
	clearRewardedVideoAdCallbacks: clearRewardedVideoAdCallbacks,

	onAppExtendedAdLoad: onAppExtendedAdLoad,
	offAppExtendedAdLoad: offAppExtendedAdLoad,
	onAppExtendedAdClose: onAppExtendedAdClose,
	offAppExtendedAdClose: offAppExtendedAdClose,
	onAppExtendedAdCustomClose: onAppExtendedAdCustomClose,
	offAppExtendedAdCustomClose: offAppExtendedAdCustomClose,
	onAppExtendedAdError: onAppExtendedAdError,
	offAppExtendedAdError: offAppExtendedAdError,
	onAppExtendedAdVideoClose: onAppExtendedAdVideoClose,
	offAppExtendedAdVideoClose: offAppExtendedAdVideoClose,
	onAppExtendedAdNormalClaim: onAppExtendedAdNormalClaim,
	offAppExtendedAdNormalClaim: offAppExtendedAdNormalClaim,
	clearExtendedAdCallbacks: clearExtendedAdCallbacks,

	onAppFeedAdLoad: onAppFeedAdLoad,
	offAppFeedAdLoad: offAppFeedAdLoad,
	onAppFeedAdError: onAppFeedAdError,
	offAppFeedAdError: offAppFeedAdError,
	clearFeedAdCallbacks: clearFeedAdCallbacks,

	onAppInterstitialAdLoad: onAppInterstitialAdLoad,
	offAppInterstitialAdLoad: offAppInterstitialAdLoad,
	onAppInterstitialAdClose: onAppInterstitialAdClose,
	offAppInterstitialAdClose: offAppInterstitialAdClose,
	onAppInterstitialAdError: onAppInterstitialAdError,
	offAppInterstitialAdError: offAppInterstitialAdError,
	clearInterstitialAdCallbacks: clearInterstitialAdCallbacks,

	onShareAppMessage: onShareAppMessage,
	offShareAppMessage: offShareAppMessage,

	onKeyboardInput: onKeyboardInput,
	offKeyboardInput: offKeyboardInput,
	onKeyboardConfirm: onKeyboardConfirm,
	offKeyboardConfirm: offKeyboardConfirm,
	onKeyboardComplete: onKeyboardComplete,
	offKeyboardComplete: offKeyboardComplete,

	onTouchStart: onTouchStart,
	offTouchStart: offTouchStart,
	onTouchMove: onTouchMove,
	offTouchMove: offTouchMove,
	onTouchEnd: onTouchEnd,
	offTouchEnd: offTouchEnd,
	onTouchCancel: onTouchCancel,
	offTouchCancel: offTouchCancel,
	dispatchTouchStart: dispatchTouchStart,
	dispatchTouchMove: dispatchTouchMove,
	dispatchTouchEnd: dispatchTouchEnd,
	dispatchTouchCancel: dispatchTouchCancel,

	onWXButtonTap: onWXButtonTap,
	offWXButtonTap: offWXButtonTap,
	clearWXButtonTap: clearWXButtonTap,

	onRecorderManagerStart: onRecorderManagerStart,
	onRecorderManagerStop: onRecorderManagerStop,
	onRecorderManagerResume: onRecorderManagerResume,
	onRecorderManagerPause: onRecorderManagerPause,
	onRecorderManagerError: onRecorderManagerError,
	onRecorderManagerInterruptionBegin: onRecorderManagerInterruptionBegin,
	onRecorderManagerInterruptionEnd: onRecorderManagerInterruptionEnd,
	onRecorderManagerFrameRecorded: onRecorderManagerFrameRecorded,

	onChallengeResultPlayAgain: onChallengeResultPlayAgain,
	clearChallengeResultCallbacks: clearChallengeResultCallbacks,
	onLadderResultPlayAgain: onLadderResultPlayAgain,
	clearLadderResultCallbacks: clearLadderResultCallbacks,

	onAppShakeAward: onAppShakeAward,
	clearShakeCallbacks: clearShakeCallbacks,
	onAppBubbleAward: onAppBubbleAward,
	clearBubbleCallbacks: clearBubbleCallbacks,

	onAppRedPackClose: onAppRedPackClose,
	offAppRedPackClose: offAppRedPackClose
};
window.wd = wd;

// when app is hide, suspend audio context and resume it when it backs
// we add it here because we won't process it in service webview, just
// in page webview
window.wd.onAppHide(function () {
	if (window._webAudio && window._webAudio._context && window._webAudio._context.suspend) {
		window._webAudio._context['suspend']();
	}
});
window.wd.onAppShow(function () {
	if (window._webAudio && window._webAudio._context && window._webAudio._context.resume) {
		window._webAudio._context['resume']();
	}
});

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var inst = null;

var Performance = function () {
	function Performance() {
		_classCallCheck(this, Performance);
	}

	_createClass(Performance, [{
		key: 'now',
		value: function now() {
			return Date.now() * 1000;
		}
	}], [{
		key: 'instance',
		get: function get() {
			if (!inst) {
				inst = new Performance();
			}
			return inst;
		}
	}]);

	return Performance;
}();

exports.default = Performance;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _guessYouLikeGame = __webpack_require__(79);

var _guessYouLikeGame2 = _interopRequireDefault(_guessYouLikeGame);

var _topgame = __webpack_require__(80);

var _topgame2 = _interopRequireDefault(_topgame);

var _challengeResult = __webpack_require__(81);

var _challengeResult2 = _interopRequireDefault(_challengeResult);

var _ladderResult = __webpack_require__(82);

var _ladderResult2 = _interopRequireDefault(_ladderResult);

var _liveDefeat = __webpack_require__(83);

var _liveDefeat2 = _interopRequireDefault(_liveDefeat);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

var _extendedAd = __webpack_require__(84);

var _extendedAd2 = _interopRequireDefault(_extendedAd);

var _feedAd = __webpack_require__(85);

var _feedAd2 = _interopRequireDefault(_feedAd);

var _lottery = __webpack_require__(86);

var _lottery2 = _interopRequireDefault(_lottery);

var _dailyTask = __webpack_require__(87);

var _dailyTask2 = _interopRequireDefault(_dailyTask);

var _upgradeGiftIcon = __webpack_require__(88);

var _upgradeGiftIcon2 = _interopRequireDefault(_upgradeGiftIcon);

var _withdrawIcon = __webpack_require__(89);

var _withdrawIcon2 = _interopRequireDefault(_withdrawIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// red pack id
var nextRedPackId = 1;

var apiObj = {
	//////////////////////////////////////////////////////////////////////////////////
	// mgc custom api - guess you like

	createGuessYouLike: function createGuessYouLike(params) {
		return new _guessYouLikeGame2.default(params);
	},

	//////////////////////////////////////////////////////////////////////////////////
	// mgc custom api - top game

	createTopGame: function createTopGame(params) {
		return new _topgame2.default(params);
	},

	//////////////////////////////////////////////////////////////////////////////////
	// mgc custom api - leto ad support

	/**
  * 得到base url
  */
	getAppBaseUrl: function getAppBaseUrl() {
		var href = window.location.href;
		if (href.endsWith('.html')) {
			var idx = href.lastIndexOf('/');
			if (idx != -1 && idx > 0) {
				href = href.substring(0, idx);
			}
		}
		return href;
	},

	/**
  * leto ad模式下设置启动页的基础路径, 应该在__start__.html里调用
  */
	setAppBaseUrl: function setAppBaseUrl(params) {
		params = params || {};
		params.url = mgc.getAppBaseUrl();

		// call api
		_bridge2.default.invokeMethod('setAppBaseUrl', params);
	},

	/**
  * leto ad模式下设置游戏的appid, 应该在__start__.html里调用. 远程游戏的路径应该是
  * http://xxx/.../appId/__start__.html这样的模式. 不过如果appid已经被packer写入
  * 了就不用解析url了
  */
	setAppId: function setAppId(params) {
		_bridge2.default.invokeMethod('setAppId', params);
	},

	/**
  * 得到一些版本号信息: {
  *     framework_version: js框架版本
  *     leto_version: leto sdk版本
  *     app_version: 第三方app办法
  * }
  */
	getLetoVersions: function getLetoVersions(params) {
		_bridge2.default.invokeMethod('getLetoVersions', params);
	},
	getLetoVersionsSync: function getLetoVersionsSync(params) {
		return _bridge2.default.callSyncApi('getLetoVersions', params);
	},

	/**
  * 获取游戏信息
  */
	getGameInfo: function getGameInfo(params) {
		// get game id, first check it in params, if not found, fallback to __wxConfig__
		params = params || {};
		var gameId = null;
		if (params.gameId) {
			gameId = params.gameId;
		} else if (window.__wxConfig__ && window.__wxConfig__.game_id) {
			gameId = window.__wxConfig__.game_id;
		}

		// call
		params.gameId = gameId;
		_bridge2.default.invokeMethod('getGameInfo', params);
	},

	//////////////////////////////////////////////////////////////////////////////////
	// mgc custom api - not categorized

	getFrameworkVersion: function getFrameworkVersion() {
		return window.mgc.SDKVersion;
	},
	getFrameworkMode: function getFrameworkMode() {
		return window.mgc.SDKMode;
	},
	getAppInfo: function getAppInfo(params) {
		_bridge2.default.invokeMethod('getAppInfo', params);
	},
	getAppInfoSync: function getAppInfoSync() {
		return _bridge2.default.callSyncApi('getAppInfo', null);
	},
	getThirdUserInfo: function getThirdUserInfo() {
		_bridge2.default.invokeMethod('getThirdUserInfo', params);
	},
	getUserProperty: function getUserProperty(params) {
		_bridge2.default.invokeMethod('getUserProperty', params);
	},
	getThirdUserInfoSync: function getThirdUserInfoSync() {
		return _bridge2.default.callSyncApi('getThirdUserInfo', null);
	},
	compareVersion: function compareVersion(v1, v2) {
		var list1 = v1.split('.');
		var list2 = v2.split('.');
		var size = Math.min(list1.length, list2.length);
		for (var i = 0; i < size; i++) {
			var i1 = Number(list1[i]);
			var i2 = Number(list2[i]);
			if (i1 > i2) {
				return 1;
			} else if (i1 < i2) {
				return -1;
			}
		}
		if (list1.length > list2.length) {
			for (var _i = list2.length; _i < list1.length; _i++) {
				var _i2 = Number(list1[_i]);
				if (_i2 > 0) {
					return 1;
				}
			}
		} else if (list1.length < list2.length) {
			for (var _i3 = list1.length; _i3 < list2.length; _i3++) {
				var _i4 = Number(list2[_i3]);
				if (_i4 > 0) {
					return -1;
				}
			}
		}
		return 0;
	},
	postMessage: function postMessage(params) {
		/*
   params format:
   {
   	msg: [string|message name],
   	data: [string,object|custom data of message]
   */

		// to workaround old leto sdk bug, merge reported task data into a big one to avoid data loss
		if (params && params.data && params.msg == '__leto_game_info__') {
			window.__leto_game_info_data = params.data = Object.assign(window.__leto_game_info_data || {}, params.data);
		}

		// invoke
		_bridge2.default.invokeMethod('postMessage', params);
	},

	//////////////////////////////////////////////////////////////////////////////////
	// mgc custom api - extra device info

	/**
  access system info, it is platform-dependent
  returned value is string
  */
	getSystemPropertySync: function getSystemPropertySync(key) {
		return _bridge2.default.callSyncApi('getSystemProperty', {
			key: key
		}).value;
	},

	/**
  model checking
  */
	isHuaweiSync: function isHuaweiSync() {
		if (_utils2.default.getPlatform() == _const2.default.PLATFORM_IOS) {
			return false;
		} else {
			return _bridge2.default.callSyncApi('isHuawei', {}).result;
		}
	},
	isXiaomiSync: function isXiaomiSync() {
		if (_utils2.default.getPlatform() == _const2.default.PLATFORM_IOS) {
			return false;
		} else {
			return _bridge2.default.callSyncApi('isXiaomi', {}).result;
		}
	},
	isOppoSync: function isOppoSync() {
		if (_utils2.default.getPlatform() == _const2.default.PLATFORM_IOS) {
			return false;
		} else {
			return _bridge2.default.callSyncApi('isOppo', {}).result;
		}
	},
	isVivoSync: function isVivoSync() {
		if (_utils2.default.getPlatform() == _const2.default.PLATFORM_IOS) {
			return false;
		} else {
			return _bridge2.default.callSyncApi('isVivo', {}).result;
		}
	},
	isSamsungSync: function isSamsungSync() {
		if (_utils2.default.getPlatform() == _const2.default.PLATFORM_IOS) {
			return false;
		} else {
			return _bridge2.default.callSyncApi('isSamsung', {}).result;
		}
	},
	isMeizuSync: function isMeizuSync() {
		if (_utils2.default.getPlatform() == _const2.default.PLATFORM_IOS) {
			return false;
		} else {
			return _bridge2.default.callSyncApi('isMeizu', {}).result;
		}
	},

	//////////////////////////////////////////////////////////////////////////////////
	// mgc custom api - SDK behavior control

	/**
  to tune sdk behavior, for internal usage
  params:
  {
  	disableLandingPage: [boolean|true then we don't show landing page for video ad, for yike ad]
  }
  */
	setSDKSettings: function setSDKSettings(params) {
		_bridge2.default.invokeMethod('setSDKSettings', params);
	},

	//////////////////////////////////////////////////////////////////////////////////
	// mgc custom api - h5 game center

	closeH5GameCenter: function closeH5GameCenter() {
		_bridge2.default.invokeMethod('closeH5GameCenter', null);
	},
	getRecentGameList: function getRecentGameList() {
		return _bridge2.default.callSyncApi('getRecentGameList', null);
	},
	getFavoriteGameList: function getFavoriteGameList() {
		return _bridge2.default.callSyncApi('getFavoriteGameList', null);
	},
	getLocalGameCenterData: function getLocalGameCenterData() {
		return _bridge2.default.callSyncApi('getLocalGameCenterData', null);
	},
	saveGameCenterDataToLocal: function saveGameCenterDataToLocal(params) {
		// params is game center result bean
		_bridge2.default.invokeMethod('saveGameCenterDataToLocal', params);
	},

	//////////////////////////////////////////////////////////////////////////////////
	// mgc custom api - h5 competitive game center

	closeWebview: function closeWebview() {
		_bridge2.default.invokeMethod('closeWebview', null);
	},

	/**
  * open a leto web container activity
  * @param params params can be
  * {
  * 		statusBarStyle: [number|style of title bar],
  * 		url: [string|url to be opened],
  * 		query: [object|query parameters],
  * 		title: [string|webview title, if empty, title bar is hidden]
  * }
  * statusBarStyle 状态栏颜色
  * 0 白色
  * 1 绿色
  * 2 橙色
  */
	popupWebview: function popupWebview(params) {
		_bridge2.default.invokeMethod('popupWebview', params);
	},

	/**
  * reload current page, params can be:
  * {
  * 	url: [string|url to be reloaded, or empty to reload current url]
  * }
  */
	reloadWebview: function reloadWebview(params) {
		_bridge2.default.invokeMethod('reloadWebview', params);
	},

	hasLocationPermissionSync: function hasLocationPermissionSync() {
		return _bridge2.default.callSyncApi('hasLocationPermission', null).result;
	},
	getCompetitiveGameCenterData: function getCompetitiveGameCenterData(params) {
		_bridge2.default.invokeMethod('getCompetitiveGameCenterData', params);
	},
	getCompetitiveGameCenterVersion: function getCompetitiveGameCenterVersion(params) {
		_bridge2.default.invokeMethod('getCompetitiveGameCenterVersion', params);
	},
	getLocalCompetitiveGameCenterData: function getLocalCompetitiveGameCenterData(params) {
		_bridge2.default.invokeMethod('getLocalCompetitiveGameCenterData', params);
	},
	getLocalCompetitiveGameCenterDataSync: function getLocalCompetitiveGameCenterDataSync(params) {
		return _bridge2.default.callSyncApi('getLocalCompetitiveGameCenterData', params);
	},

	/**
  * encrypt params in yike way, params should be:
  * {
  * 	  plain: [string|plain string value to be encrypted]
  * }
  */
	yikeEncryptParamsSync: function yikeEncryptParamsSync(params) {
		return _bridge2.default.callSyncApi('yikeEncryptParams', params).result;
	},

	/**
  * show challenge result, no params
  * it is a sync api, it will return: {
  * {
  *    appId: [string|this game appId]
  * }
  */
	createChallengeResult: function createChallengeResult(params) {
		return new _challengeResult2.default(params);
	},
	clearChallengeResultCallbacks: function clearChallengeResultCallbacks(appId) {
		if (window.wd) {
			window.wd.clearChallengeResultCallbacks(appId);
		}
	},

	/**
  * show ladder result, no params
  * it is a sync api, it will return: {
  * {
  *    appId: [string|this game appId]
  * }
  */
	createLadderResult: function createLadderResult(params) {
		return new _ladderResult2.default(params);
	},
	clearLadderResultCallbacks: function clearLadderResultCallbacks(appId) {
		if (window.wd) {
			window.wd.clearLadderResultCallbacks(appId);
		}
	},
	showLadderToast: function showLadderToast(params) {
		_bridge2.default.invokeMethod('showLadderToast', params);
	},

	/**
  * create a live defeat view at top-left of game, no params needed
  */
	createLiveDefeat: function createLiveDefeat(params) {
		return new _liveDefeat2.default(params);
	},

	/**
  * reduce yike user coin one because of challenge game, params should be:
  * {
  * salt: [string|game salt, need apply from yike]
  * delta: [number|coin one change value]
  * }
  */
	updateYikeCoinOne: function updateYikeCoinOne(params) {
		_bridge2.default.invokeMethod('updateYikeCoinOne', params);
	},

	/**
  * display CGC recharge ui, params should be:
  * if recharge successfully, success callback will be invoked with res:
  * {
  *    coin_one: [number|yike coin one count after recharge]
  * }
  */
	showCGCRecharge: function showCGCRecharge(params) {
		_bridge2.default.invokeMethod('showCGCRecharge', params);
	},

	/**
  * display CGC profit ranking, no params needed and no response result
  */
	showCGCProfitRanking: function showCGCProfitRanking(params) {
		_bridge2.default.invokeMethod('showCGCProfitRanking', params);
	},

	//////////////////////////////////////////////////////////////////////////////////
	// mgc custom api - coin related

	/**
  * show withdraw UI
  */
	showWithdraw: function showWithdraw(params) {
		_bridge2.default.invokeMethod('showWithdraw', params);
	},

	/**
  * add coin in game, for reward
  * params: {
  * 		coin: [integer|coin to be added],
  * 		reason: [integer|why give coin, defined by game]
  * }
  */
	addCoin: function addCoin(params) {
		_bridge2.default.invokeMethod('addCoin', params);
	},

	/**
  * get coin of current user, returned data is: {
  * 		coin: [integer|user total coin],
  * 		today_receivable_coin: [integer|how many coin left user can get today],
  * 		today_received_coin: [integer|how many coin user got today already],
  * 		coin_rmb_ratio: [integer|how many coin equals 1 rmb]
  * }
  */
	getUserCoin: function getUserCoin(params) {
		_bridge2.default.invokeMethod('getUserCoin', params);
	},

	/**
  * create mgc extended ad instance
  */
	createExtendedAd: function createExtendedAd(params) {
		return new _extendedAd2.default(params);
	},

	/**
  * create mgc feed ad instance
  */
	createFeedAd: function createFeedAd(params) {
		return new _feedAd2.default(params);
	},

	/**
  create red pack lottery
  */
	createLotteryIcon: function createLotteryIcon(params) {
		return new _lottery2.default(params);
	},

	/**
  * create mgc daily task
  */
	createDailyTask: function createDailyTask(params) {
		return new _dailyTask2.default(params);
	},

	/**
  * create upgrade gift icon
  */
	createUpgradeGiftIcon: function createUpgradeGiftIcon(params) {
		return new _upgradeGiftIcon2.default(params);
	},

	/**
  * create withdraw icon
  */
	createWithdrawIcon: function createWithdrawIcon(params) {
		return new _withdrawIcon2.default(params);
	},

	/**
  * set shake cp coin event callbacks, params:
  * 1.onAward: 奖励事件回调方法, 当用户点击领取按钮时触发, 参数包含字段为
  * 		a. award_id: 想要添加的游戏奖励id
  * 		b. amount: 奖励数量, 如果游戏自行决定则不用理睬
  */
	setShakeCallbacks: function setShakeCallbacks(params) {
		// validate params
		if (!params || (typeof params === "undefined" ? "undefined" : _typeof(params)) != 'object') {
			return;
		}

		// close old callbacks, we only keep one copy
		if (window.wd) {
			window.wd.clearShakeCallbacks();
		}

		// if has onAward
		if (params.onAward && typeof params.onAward == 'function') {
			if (window.wd) {
				window.wd.onAppShakeAward(params.onAward);
			}
		}
	},

	/**
  * notify native side in-game award result, params should be:
  * {
  * 		err_msg: [string|if failed, get error message],
  * 		award_id: [string|award unique id for this game],
  * 		amount: [integer|how many award user got]
  * }
  */
	notifyShakeAwardResult: function notifyShakeAwardResult(params) {
		_bridge2.default.invokeMethod('notifyShakeAwardResult', params);
	},

	/**
  * set bubble cp coin event callbacks
  * 1.onAward: 奖励事件回调方法, 当用户点击领取按钮时触发, 参数包含字段为
  * 		a. award_id: 想要添加的游戏奖励id
  * 		b. amount: 奖励数量, 如果游戏自行决定则不用理睬
  */
	setBubbleCallbacks: function setBubbleCallbacks(params) {
		// validate params
		if (!params || (typeof params === "undefined" ? "undefined" : _typeof(params)) != 'object') {
			return;
		}

		// close old callbacks, we only keep one copy
		if (window.wd) {
			window.wd.clearBubbleCallbacks();
		}

		// if has onAward
		if (params.onAward && typeof params.onAward == 'function') {
			if (window.wd) {
				window.wd.onAppBubbleAward(params.onAward);
			}
		}
	},

	/**
  * notify native side in-game award result, params should be:
  * {
  * 		err_msg: [string|if failed, get error message],
  * 		award_id: [string|award unique id for this game],
  * 		amount: [integer|how many award user got]
  * }
  */
	notifyBubbleAwardResult: function notifyBubbleAwardResult(params) {
		_bridge2.default.invokeMethod('notifyBubbleAwardResult', params);
	},

	/**
  * set shake view at somewhere, params can be: {
  *     left: [integer|pixels relative to screen left],
  *     top: [integer|pixels relative to screen top],
  *     pinned: [boolean|if true, shake view can not be dragged]
  * }
  */
	setShakeIconPosition: function setShakeIconPosition(params) {
		_bridge2.default.invokeMethod('setShakeIconPosition', params);
	},

	/**
  * get shake float icon size, returned a object which contains: {
  *     w: [integer|width in pixels],
  *     h: [integer|height in pixels]
  * }
  */
	getShakeIconSize: function getShakeIconSize() {
		return _bridge2.default.callSyncApi('getShakeIconSize', {}).result;
	},

	/**
  * control visibility of shake float icon
  */
	setShakeIconVisible: function setShakeIconVisible(visible) {
		_bridge2.default.invokeMethod('setShakeIconVisible', { visible: visible });
	},

	// 现在他们都定向到一个api
	showPassRedPack: function showPassRedPack(params) {
		params = params || {};
		params.mode = 'PASS_REMOTE';
		mgc.showRedPack(params);
	},
	showUpgradeRedPack: function showUpgradeRedPack(params) {
		params = params || {};
		params.mode = 'UPGRADE_REMOTE';
		mgc.showRedPack(params);
	},
	showSceneRedPack: function showSceneRedPack(params) {
		params = params || {};
		params.mode = 'SCENE_REMOTE';
		mgc.showRedPack(params);
	},
	showRookieRedPack: function showRookieRedPack(params) {
		params = params || {};
		params.mode = 'ROOKIE_LOCAL_LIMIT';
		params.redPackId = nextRedPackId++;
		if (params.onClose) {
			if (window.wd) {
				window.wd.onAppRedPackClose(params.redPackId, params.onClose);
			}
		}
		_bridge2.default.invokeMethod('showRedPack', params);
	},

	/**
  * popup a red pack dialog for other event, params:
  * {
  * 	   mode: [enum string|mode]
  * 	   id: [string|升级id]
  * 	   level: [integer|关卡数, 或者升级等级数]
  *     credit: [integer|optional, credit or something like that]
  *     local_limits: [
  *         {
  *             limit: [integer|累计获得金币数]
  *             max_award: [integer|单次得场景红包金币最大值]
  *             min_award: [integer|单次得场景红包金币最小值]
  *             video_ratio: [integer|视频翻倍系数]
  *         },
  *         ...
  *     ]
  * }
  */
	showRedPack: function showRedPack(params) {
		params = params || {};
		params.levelId = params.id;
		params.redPackId = nextRedPackId++;
		if (params.local_limits) {
			params.mode = 'SCENE_LOCAL_LIMIT';
		}
		if (params.onClose) {
			if (window.wd) {
				window.wd.onAppRedPackClose(params.redPackId, params.onClose);
			}
		}
		_bridge2.default.invokeMethod('showRedPack', params);
	},

	/**
 * 显示拉活广告
 **/
	showPushAd: function showPushAd(params) {
		_bridge2.default.invokeMethod('showPushAd', params);
	}
};

exports.default = apiObj;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GuessYouLike = function () {
	function GuessYouLike(params) {
		_classCallCheck(this, GuessYouLike);

		_bridge2.default.callSyncApi('createGuessYouLike', params);
		// bridge.invokeMethod('createGuessYouLike', params)
	}

	_createClass(GuessYouLike, [{
		key: 'show',
		value: function show() {
			_bridge2.default.invokeMethod('GuessYouLike_show', {});
		}
	}, {
		key: 'hide',
		value: function hide() {
			_bridge2.default.invokeMethod('GuessYouLike_hide', {});
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			_bridge2.default.invokeMethod('GuessYouLike_destroy', {});
		}
	}]);

	return GuessYouLike;
}();

exports.default = GuessYouLike;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _EventEmitter = __webpack_require__(15);

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

var _configFlags = __webpack_require__(8);

var _configFlags2 = _interopRequireDefault(_configFlags);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _inst = null;

var nextButtonId = 1;

var TopGame = function () {
	function TopGame(params) {
		_classCallCheck(this, TopGame);

		this.buttonId = nextButtonId++;

		// button style
		this.style = params.style || {
			left: 0,
			top: 0

			// init button
		};_bridge2.default.invokeMethod('createTopGame', {
			buttonId: this.buttonId,
			style: this.style
		});
		// bridge.invokeMethod('createGuessYouLike', params)
	}

	_createClass(TopGame, [{
		key: 'show',
		value: function show() {
			_bridge2.default.invokeMethod('TopGame_show', { buttonId: this.buttonId });
		}
	}, {
		key: 'hide',
		value: function hide() {
			_bridge2.default.invokeMethod('TopGame_hide', { buttonId: this.buttonId });
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			_bridge2.default.invokeMethod('TopGame_destroy', { buttonId: this.buttonId });
		}
	}]);

	return TopGame;
}();

exports.default = TopGame;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChallengeResult = function () {
	function ChallengeResult(params) {
		_classCallCheck(this, ChallengeResult);

		this.appId = _bridge2.default.callSyncApi('ChallengeResult_create', params).appId;
	}

	/**
  * show challenge result
  * @param salt app salt, need apply from yike
  * @param score score
  */


	_createClass(ChallengeResult, [{
		key: 'show',
		value: function show(salt, score) {
			_bridge2.default.invokeMethod('ChallengeResult_show', {
				score: score,
				salt: salt
			});
		}
	}, {
		key: 'onPlayAgain',
		value: function onPlayAgain(cb) {
			if (window.wd) {
				window.wd.onChallengeResultPlayAgain(this.appId, cb);
			}
		}
	}]);

	return ChallengeResult;
}();

exports.default = ChallengeResult;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LadderResult = function () {
	function LadderResult(params) {
		_classCallCheck(this, LadderResult);

		this.appId = _bridge2.default.callSyncApi('LadderResult_create', params).appId;
	}

	/**
  * show ladder result
  * @param data data, something like { action: 'pass', score: xxx }
  */


	_createClass(LadderResult, [{
		key: 'show',
		value: function show(data) {
			_bridge2.default.invokeMethod('LadderResult_show', data);
		}

		/**
   * change again button text, by default it is play again
   */

	}, {
		key: 'setAgainButtonText',
		value: function setAgainButtonText(t) {
			_bridge2.default.invokeMethod('LadderResult_setAgainButtonText', {
				text: t
			});
		}
	}, {
		key: 'onPlayAgain',
		value: function onPlayAgain(cb) {
			if (window.wd) {
				window.wd.onLadderResultPlayAgain(this.appId, cb);
			}
		}
	}]);

	return LadderResult;
}();

exports.default = LadderResult;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * live defeat view, show how many players you already beat, placed at game top-left
 */
var LiveDefeat = function () {
	function LiveDefeat(params) {
		_classCallCheck(this, LiveDefeat);

		_bridge2.default.callSyncApi('LiveDefeat_create', params);
	}

	_createClass(LiveDefeat, [{
		key: 'show',
		value: function show() {
			_bridge2.default.invokeMethod('LiveDefeat_show', {});
		}

		/**
   * update live defeat ui with new score
   */

	}, {
		key: 'update',
		value: function update(score) {
			_bridge2.default.invokeMethod('LiveDefeat_update', {
				score: score
			});
		}
	}]);

	return LiveDefeat;
}();

exports.default = LiveDefeat;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// next unique id of coin video ad
var nextAdId = 1;

/**
 * mgc extended ad style which can get coin by video and also present an ad
 */

var ExtendedAd = function () {
	/*
  * params is {
  * 		styleId: [integer],
  * 	    pauseGame: [boolean|true means stop game],
  * 	    maxWidthHint: [integer|width hint for feed ad, mainly used for landscape mode],
  * 	    style: {
  *			icon: [string|http url or base64 url],
  * 			title: [string|title],
  * 			video_button_title: [string|video button text],
  * 			button_color: [string|aarrggbb or rrggbb color string for button],
  * 			show_my_coin: [boolean|show user total coin or not]
  * 			show_normal_button: [boolean|show normal claim button or not]
  * 			normal_button_title: [string|title of normal button, default is claim]
  * 	    }
  * }
  */
	function ExtendedAd(params) {
		_classCallCheck(this, ExtendedAd);

		this.adId = nextAdId++;
		params = params || {};
		params.adId = this.adId;
		params.styleId = params.styleId || 1;
		_bridge2.default.invokeMethod('ExtendedAd_create', params);
	}

	/*
  * params is {
  *     coin: [integer|how many coin user can get],
  *     ratio: [integer|ratio if user views video, <= 1 means can not view video],
  * 	   custom_close: [string|if ratio <= 1, video button won't show video, will trigger onCustomClose with
  * 			this value]
  *     custom_logic: [boolean|if true, native side won't do any award logic, it is up to game]
  * }
  */


	_createClass(ExtendedAd, [{
		key: 'show',
		value: function show(params) {
			params = params || {};
			params.adId = this.adId;
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('ExtendedAd_show', params, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'load',
		value: function load() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('ExtendedAd_load', { adId: _this.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('ExtendedAd_destroy', { adId: _this2.adId }, {
					afterSuccess: function afterSuccess() {
						// clean callbacks
						if (window.wd) {
							window.wd.clearExtendedAdCallbacks(this.adId);
						}

						// resolve
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'notify',
		value: function notify(action) {
			var _this3 = this;

			// if developer pass in an object, work around it
			if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) == 'object') {
				action = action.action;
			}
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('ExtendedAd_notify', { adId: _this3.adId, action: action }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'updateTitle',
		value: function updateTitle(title) {
			var params = {
				title: title,
				adId: this.adId
			};
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('ExtendedAd_updateTitle', params, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'updateVideoButtonTitle',
		value: function updateVideoButtonTitle(title) {
			var params = {
				title: title,
				adId: this.adId
			};
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('ExtendedAd_updateVideoButtonTitle', params, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'updateMyCoin',
		value: function updateMyCoin() {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('ExtendedAd_updateMyCoin', { adId: _this4.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}

		/*
   * callback arguments:
   * 1. add_coin: [integer|final coin user got]
   * 2. total_coin: [integer|total coin of user after add]
   * 3. video_viewed: [boolean|user viewed video or not]
   */

	}, {
		key: 'onClose',
		value: function onClose(fn) {
			if (window.wd) {
				window.wd.onAppExtendedAdClose(this.adId, fn);
			}
		}
	}, {
		key: 'offClose',
		value: function offClose(fn) {
			if (window.wd) {
				window.wd.offAppExtendedAdClose(this.adId, fn);
			}
		}
	}, {
		key: 'onCustomClose',
		value: function onCustomClose(fn) {
			if (window.wd) {
				window.wd.onAppExtendedAdCustomClose(this.adId, fn);
			}
		}
	}, {
		key: 'offCustomClose',
		value: function offCustomClose(fn) {
			if (window.wd) {
				window.wd.offAppExtendedAdCustomClose(this.adId, fn);
			}
		}
	}, {
		key: 'onLoad',
		value: function onLoad(fn) {
			if (window.wd) {
				window.wd.onAppExtendedAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'offLoad',
		value: function offLoad(fn) {
			if (window.wd) {
				window.wd.offAppExtendedAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'onVideoClose',
		value: function onVideoClose(fn) {
			if (window.wd) {
				window.wd.onAppExtendedAdVideoClose(this.adId, fn);
			}
		}
	}, {
		key: 'offVideoClose',
		value: function offVideoClose(fn) {
			if (window.wd) {
				window.wd.offAppExtendedAdVideoClose(this.adId, fn);
			}
		}
	}, {
		key: 'onNormalClaim',
		value: function onNormalClaim(fn) {
			if (window.wd) {
				window.wd.onAppExtendedAdNormalClaim(this.adId, fn);
			}
		}
	}, {
		key: 'offNormalClaim',
		value: function offNormalClaim(fn) {
			if (window.wd) {
				window.wd.offAppExtendedAdNormalClaim(this.adId, fn);
			}
		}
	}, {
		key: 'onError',
		value: function onError(fn) {
			if (window.wd) {
				window.wd.onAppExtendedAdError(this.adId, fn);
			}
		}
	}, {
		key: 'offError',
		value: function offError(fn) {
			if (window.wd) {
				window.wd.offAppExtendedAdError(this.adId, fn);
			}
		}
	}]);

	return ExtendedAd;
}();

// action for notify method


Object.defineProperties(ExtendedAd, {
	CLOSE_NOW: { value: 0, writable: false }, // 立刻关闭
	CAN_CLOSE: { value: 1, writable: false // 可以关闭
	} });

exports.default = ExtendedAd;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// next unique id of feed ad
var nextAdId = 1;

var FeedAd = function () {
	/*
  * params.style can has: {
  * 	  maxHeight: max pixel height of feed ad, if not set, will be default
  * 	  button_color: rrggbb or aarrggbb of button
  * }
  */
	function FeedAd(params) {
		_classCallCheck(this, FeedAd);

		this.adId = nextAdId++;
		params = params || {};
		params.adId = this.adId;
		_bridge2.default.invokeMethod('FeedAd_create', params);
	}

	/*
  * params is {
  *     gravity: [string|top or bottom],
  *     margin: [integer|spacing to top or bottom, in pixel],
  * }
  */


	_createClass(FeedAd, [{
		key: 'show',
		value: function show(params) {
			params = params || {};
			params.adId = this.adId;
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('FeedAd_show', params, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('FeedAd_hide', { adId: _this.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'load',
		value: function load() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('FeedAd_load', { adId: _this2.adId }, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('FeedAd_destroy', { adId: _this3.adId }, {
					afterSuccess: function afterSuccess() {
						// clean callbacks
						if (window.wd) {
							window.wd.clearFeedAdCallbacks(this.adId);
						}

						// resolve
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'onLoad',
		value: function onLoad(fn) {
			if (window.wd) {
				window.wd.onAppFeedAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'offLoad',
		value: function offLoad(fn) {
			if (window.wd) {
				window.wd.offAppFeedAdLoad(this.adId, fn);
			}
		}
	}, {
		key: 'onError',
		value: function onError(fn) {
			if (window.wd) {
				window.wd.onAppFeedAdError(this.adId, fn);
			}
		}
	}, {
		key: 'offError',
		value: function offError(fn) {
			if (window.wd) {
				window.wd.offAppFeedAdError(this.adId, fn);
			}
		}
	}]);

	return FeedAd;
}();

exports.default = FeedAd;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lottery = function () {
	function Lottery(params) {
		_classCallCheck(this, Lottery);

		_bridge2.default.invokeMethod('Lottery_create', params);
	}

	_createClass(Lottery, [{
		key: 'show',
		value: function show() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('Lottery_show', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('Lottery_hide', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}]);

	return Lottery;
}();

exports.default = Lottery;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DailyTask = function () {
	function DailyTask(params) {
		_classCallCheck(this, DailyTask);

		_bridge2.default.invokeMethod('DailyTask_create', params);
	}

	_createClass(DailyTask, [{
		key: 'show',
		value: function show() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('DailyTask_show', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('DailyTask_hide', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}]);

	return DailyTask;
}();

exports.default = DailyTask;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UpgradeGiftIcon = function () {
	function UpgradeGiftIcon(params) {
		_classCallCheck(this, UpgradeGiftIcon);

		// create
		_bridge2.default.invokeMethod('UpgradeGiftIcon_create', params || {});
	}

	_createClass(UpgradeGiftIcon, [{
		key: 'show',
		value: function show(params) {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('UpgradeGiftIcon_show', params || {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('UpgradeGiftIcon_hide', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'notifyUpgrade',
		value: function notifyUpgrade(params) {
			params = params || {};
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('UpgradeGiftIcon_notifyUpgrade', params, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}]);

	return UpgradeGiftIcon;
}();

exports.default = UpgradeGiftIcon;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _sceneConst = __webpack_require__(18);

var _sceneConst2 = _interopRequireDefault(_sceneConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * mgc withdraw icon float
 */
var WithdrawIcon = function () {
	function WithdrawIcon(params) {
		var _this = this;

		_classCallCheck(this, WithdrawIcon);

		this._height = 0; // in pixels
		params = params || {};
		var fn = params.success;
		params.success = function (res) {
			_this._height = res.height;
			if (fn && typeof fn == 'function') {
				fn();
			}
		};
		_bridge2.default.callSyncApi('WithdrawIcon_create', params);
	}

	_createClass(WithdrawIcon, [{
		key: 'show',
		value: function show(params) {
			params = params || {};
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('WithdrawIcon_show', params, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'hide',
		value: function hide() {
			return new Promise(function (resolve, reject) {
				_bridge2.default.invokeMethod('WithdrawIcon_hide', {}, {
					afterSuccess: function afterSuccess() {
						resolve();
					},
					afterFail: function afterFail(e) {
						reject(e);
					}
				});
			});
		}
	}, {
		key: 'height',
		get: function get() {
			return this._height;
		}
	}]);

	return WithdrawIcon;
}();

exports.default = WithdrawIcon;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

var _bridge = __webpack_require__(0);

var _bridge2 = _interopRequireDefault(_bridge);

var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _socketTask_js = __webpack_require__(17);

var _socketTask_js2 = _interopRequireDefault(_socketTask_js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// directly succeed
function simulateOK(event, params, data) {
	params = params || {};
	params.__fake_result = params.__fake_result || {};
	params.__fake_result.errCode = _const2.default.RESULT_OK;
	if (data) {
		params.__fake_result = Object.assign(params.__fake_result, data);
	}
	setTimeout(function () {
		_bridge2.default.invokeMethod(event, params);
	}, 0);
}

// directly fail
function simulateFail(event, params) {
	params = params || {};
	params.__fake_result = params.__fake_result || {};
	params.__fake_result.errCode = _const2.default.RESULT_FAIL;
	setTimeout(function () {
		_bridge2.default.invokeMethod(event, params);
	}, 0);
}

/**
 * js implementation for some api
 */
var apiObj_js = {
	login: function login(params) {
		window.mgc.request({
			url: 'http://search.mgc-games.com:8711/api/v7/wxlogin/sendcode',
			data: {
				data: JSON.stringify({
					mobile: _utils2.default.getOrCreateUserId(),
					app_id: window.__wxConfig__.game_id
				})
			},
			success: function success(res) {
				if (res.data.code != 200) {
					simulateFail('login', params);
				} else {
					simulateOK('login', params, res.data.data);
				}
			},
			fail: function fail(res) {
				simulateFail('getUserInfo', params);
			}
		});
	},
	getUserInfo: function getUserInfo(params) {
		params = params || {};
		window.mgc.request({
			url: 'http://search.mgc-games.com:8711/api/v7/wxuser/userinfo',
			data: {
				data: JSON.stringify({
					mgc_mobile: _utils2.default.getOrCreateUserId()
				})
			},
			success: function success(res) {
				if (res.data.code != 200) {
					simulateFail('getUserInfo', params);
				} else {
					simulateOK('getUserInfo', params, res.data.data);
				}
			},
			fail: function fail(res) {
				simulateFail('getUserInfo', params);
			}
		});
	},
	authorize: function authorize(params) {
		simulateOK('authorize', params);
	},
	code2Session: function code2Session(params) {
		window.mgc.request({
			url: 'http://search.mgc-games.com:8711/api/sns/jscode2session',
			data: {
				grant_type: 1,
				appid: window.__wxConfig__.game_id,
				js_code: params.code
			},
			success: function success(res) {
				if (res.data.code != 200) {
					simulateFail('code2Session', params);
				} else {
					simulateOK('code2Session', params, res.data);
				}
			},
			fail: function fail(res) {
				simulateFail('code2Session', params);
			}
		});
	},
	checkSession: function checkSession(params) {
		// XXX: 现在都让他失败, 貌似native上也这样
		simulateFail('checkSession', params);
	},
	getLetoVersions: function getLetoVersions(params) {
		simulateOK('getLetoVersions', params, window.mgc.getLetoVersionsSync());
	},
	getLetoVersionsSync: function getLetoVersionsSync(params) {
		return {
			leto_version: '3.8.7'
		};
	},
	getSystemInfo: function getSystemInfo(params) {
		var info = window.mgc.getSystemInfoSync();
		simulateOK('getSystemInfo', params, info);
	},
	getSystemInfoSync: function getSystemInfoSync(params) {
		return {
			statusBarHeight: 0,
			brand: 'Android',
			model: 'Android',
			pixelRatio: window.devicePixelRatio,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
			language: 'zh-CN',
			version: '3.8.7',
			system: 'Android 9.0',
			platform: 'android',
			fontSizeSetting: 14 * window.devicePixelRatio,
			benchmarkLevel: -1,
			albumAuthorized: true,
			cameraAuthorized: true,
			locationAuthorized: true,
			microphoneAuthorized: true,
			notificationAuthorized: true,
			notificationAlertAuthorized: true,
			notificationBadgeAuthorized: true,
			notificationSoundAuthorized: true,
			bluetoothEnabled: true,
			locationEnabled: true,
			wifiEnabled: true,
			SDKVersion: window.mgc.SDKVersion,
			imei: '__tbd__',
			isNotchUsed: false,
			isNotchScreen: false,
			notchHeight: 0,
			realScreenWidth: window.innerWidth,
			realScreenHeight: window.innerHeight,
			safeArea: {
				left: 0,
				right: window.innerWidth,
				top: 0,
				bottom: window.innerHeight,
				width: window.innerWidth,
				height: window.innerHeight
			}
		};
	},
	isMeizuSync: function isMeizuSync(params) {
		return false;
	},
	getAppInfo: function getAppInfo(params) {
		var appInfo = window.mgc.getAppInfoSync();
		simulateOK('getAppInfo', params, appInfo);
	},
	getAppInfoSync: function getAppInfoSync(params) {
		return {
			appId: window.__wxConfig__.game_id,
			channelId: window.__nativeLocalStorage.getItem(_const2.default.LETO_CHANNEL_ID),
			userId: window.__nativeLocalStorage.getItem(_const2.default.LETO_MGC_MOBILE),
			packageName: 'com.leto.game.' + window.__wxConfig__.game_id,
			appVersion: window.__wxConfig__.game_version
		};
	},
	setNavigationBarColor: function setNavigationBarColor(params) {
		simulateOK('setNavigationBarColor', params);
	},
	setNavigationBarTitle: function setNavigationBarTitle(params) {
		simulateOK('setNavigationBarTitle', params);
	},
	showNavigationBarLoading: function showNavigationBarLoading(params) {
		simulateOK('showNavigationBarLoading', params);
	},
	hideNavigationBarLoading: function hideNavigationBarLoading(params) {
		simulateOK('hideNavigationBarLoading', params);
	},
	stopPullDownRefresh: function stopPullDownRefresh(params) {
		simulateOK('stopPullDownRefresh', params);
	},
	pageScrollTo: function pageScrollTo(params) {
		simulateOK('pageScrollTo', params);
	},
	chooseImage: function chooseImage(params) {
		simulateFail('chooseImage', params);
	},
	previewImage: function previewImage(params) {
		simulateFail('previewImage', params);
	},
	getImageInfo: function getImageInfo(params) {
		simulateFail('getImageInfo', params);
	},
	startRecord: function startRecord(params) {
		simulateFail('startRecord', params);
	},
	chooseVideo: function chooseVideo(params) {
		simulateFail('chooseVideo', params);
	},
	getLocation: function getLocation(params) {
		var navigator = window.NativeGlobal ? window.NativeGlobal.navigator : global.navigator;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (loc) {
				simulateOK('getLocation', params, {
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
					speed: loc.coords.speed,
					accuracy: loc.coords.accuracy,
					altitude: loc.coords.altitude,
					verticalAccuracy: loc.coords.altitudeAccuracy,
					horizontalAccuracy: loc.coords.accuracy
				});
			}, function (e) {
				simulateFail('getLocation', params);
			});
		} else {
			simulateFail('getLocation', params);
		}
	},
	getLocationSync: function getLocationSync(params) {
		// get location can not be synchronized
		simulateFail('getLocationSync', params);
	},
	openLocation: function openLocation(params) {
		// TODO not implemented, just fail
		simulateFail('openLocation', params);
	},
	chooseLocation: function chooseLocation(params) {
		// TODO not implemented, just fail
		simulateFail('chooseLocation', params);
	},
	getNetworkType: function getNetworkType(params) {
		var nt = window.mgc.getNetworkTypeSync(params);
		simulateOK('getNetworkType', params, {
			networkType: nt
		});
	},
	getNetworkTypeSync: function getNetworkTypeSync(params) {
		var navigator = window.NativeGlobal ? window.NativeGlobal.navigator : global.navigator;
		var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		var nt = 'wifi';
		if (connection) {
			switch (connection.type) {
				case 'none':
				case 'bluetooth':
					nt = 'none';
					break;
				case 'unknown':
					nt = 'unknown';
					break;
				case 'cellular':
					nt = '4g';
					break;
			}
		}
		return nt;
	},
	addCard: function addCard(params) {
		// TODO not implemented, just fail
		simulateFail('addCard', params);
	},
	openCard: function openCard(params) {
		// TODO not implemented, just fail
		simulateFail('addCard', params);
	},
	saveFile: function saveFile(params) {
		simulateFail('saveFile', params);
	},
	showModal: function showModal(params) {
		window.alert(params.content);
		simulateOK('showModal', params);
	},
	showToast: function showToast(params) {
		// TODO not implemented, just fail
		simulateFail('showToast', params);
	},
	showLoading: function showLoading(params) {
		// TODO not implemented, just fail
		simulateFail('showLoading', params);
	},
	hideLoading: function hideLoading(params) {
		// TODO not implemented, just fail
		simulateFail('hideLoading', params);
	},
	showActionSheet: function showActionSheet(params) {
		// TODO not implemented, just fail
		simulateFail('showActionSheet', params);
	},
	getSavedFileList: function getSavedFileList(params) {
		simulateFail('getSavedFileList', params);
	},
	getSavedFileInfo: function getSavedFileInfo(params) {
		simulateFail('getSavedFileInfo', params);
	},
	getFileInfo: function getFileInfo(params) {
		simulateFail('getFileInfo', params);
	},
	removeSavedFile: function removeSavedFile(params) {
		simulateFail('removeSavedFile', params);
	},
	getClipboardData: function getClipboardData(params) {
		var navigator = window.NativeGlobal ? window.NativeGlobal.navigator : global.navigator;
		if (navigator.clipboard && navigator.clipboard.readText) {
			navigator.clipboard.readText().then(function (t) {
				simulateOK('getClipboardData', params, {
					data: t
				});
			}).catch(function (e) {
				simulateFail('getClipboardData', params);
			});
		} else {
			simulateFail('getClipboardData', params);
		}
	},
	setClipboardData: function setClipboardData(params) {
		var navigator = window.NativeGlobal ? window.NativeGlobal.navigator : global.navigator;
		if (navigator.permissions && navigator.clipboard && navigator.clipboard.writeText) {
			navigator.permissions.query({ name: "clipboard-write" }).then(function (r) {
				if (r.state == "granted" || r.state == "prompt") {
					navigator.clipboard.writeText(params.data).then(function (r) {
						simulateOK('setClipboardData', params);
					}).catch(function (e) {
						simulateFail('setClipboardData', params);
					});
				}
			}).catch(function (e) {
				simulateFail('setClipboardData', params);
			});
		} else {
			simulateFail('setClipboardData', params);
		}
	},
	getAvailableAudioSources: function getAvailableAudioSources(params) {
		simulateOK('getAvailableAudioSources', params, {
			audioSources: ['auto']
		});
	},
	updateKeyboard: function updateKeyboard(params) {
		// TODO not implemented, just fail
		simulateFail('updateKeyboard', params);
	},
	showKeyboard: function showKeyboard(params) {
		// TODO not implemented, just fail
		simulateFail('showKeyboard', params);
	},
	hideKeyboard: function hideKeyboard(params) {
		// TODO not implemented, just fail
		simulateFail('hideKeyboard', params);
	},
	getTextLineHeight: function getTextLineHeight(params) {
		// TODO not implemented
		return params.fontSize;
	},
	triggerGC: function triggerGC(params) {
		simulateOK('triggerGC', params);
	},
	exitMiniProgram: function exitMiniProgram(params) {
		window.history.go(-1);
	},
	getBatteryInfo: function getBatteryInfo(params) {
		simulateOK('getBatteryInfo', params, {
			level: 100,
			isCharging: false
		});
	},
	getBatteryInfoSync: function getBatteryInfoSync(params) {
		return {
			level: 100,
			isCharging: false
		};
	},
	vibrateShort: function vibrateShort(params) {
		var navigator = window.NativeGlobal ? window.NativeGlobal.navigator : global.navigator;
		if (navigator.vibrate) {
			navigator.vibrate(20);
		}
		simulateOK('vibrateShort', params);
	},
	vibrateLong: function vibrateLong(params) {
		var navigator = window.NativeGlobal ? window.NativeGlobal.navigator : global.navigator;
		if (navigator.vibrate) {
			navigator.vibrate(200);
		}
		simulateOK('vibrateLong', params);
	},
	getScreenBrightness: function getScreenBrightness(params) {
		var value = 1;
		if (window.screen && window.screen.mozBrightness) {
			value = window.screen.mozBrightness;
		}
		simulateOK('getScreenBrightness', params, {
			value: value
		});
	},
	setScreenBrightness: function setScreenBrightness(params) {
		params = params || {};
		var value = params.value || 1;
		if (window.screen && window.screen.mozBrightness) {
			window.screen.mozBrightness = value;
		}
		simulateOK('setScreenBrightness', params);
	},
	setKeepScreenOn: function setKeepScreenOn(params) {
		simulateFail('setKeepScreenOn', params);
	},
	startDeviceMotionListening: function startDeviceMotionListening(params) {
		// TODO not implemented
		simulateOK('startDeviceMotionListening', params);
	},
	stopDeviceMotionListening: function stopDeviceMotionListening(params) {
		// TODO not implemented
		simulateOK('stopDeviceMotionListening', params);
	},
	startAccelerometer: function startAccelerometer(params) {
		// TODO not implemented
		simulateOK('startAccelerometer', params);
	},
	stopAccelerometer: function stopAccelerometer(params) {
		// TODO not implemented
		simulateOK('stopAccelerometer', params);
	},
	startCompass: function startCompass(params) {
		// TODO not implemented
		simulateOK('startCompass', params);
	},
	stopCompass: function stopCompass(params) {
		// TODO not implemented
		simulateOK('stopCompass', params);
	},
	startGyroscope: function startGyroscope(params) {
		// TODO not implemented
		simulateOK('startGyroscope', params);
	},
	stopGyroscope: function stopGyroscope(params) {
		// TODO not implemented
		simulateOK('stopGyroscope', params);
	},
	loadSubpackage: function loadSubpackage(params) {
		simulateOK('loadSubpackage', params);
	},
	showShareMenu: function showShareMenu(params) {
		// TODO not implemented
		simulateOK('showShareMenu', params);
	},
	updateShareMenu: function updateShareMenu(params) {
		// TODO not implemented
		simulateOK('updateShareMenu', params);
	},
	hideShareMenu: function hideShareMenu(params) {
		// TODO not implemented
		simulateOK('hideShareMenu', params);
	},
	shareAppMessage: function shareAppMessage(params) {
		// TODO not implemented
		simulateOK('shareAppMessage', params);
	},
	getShareInfo: function getShareInfo(params) {
		// TODO not implemented
		simulateOK('getShareInfo', params);
	},
	getSetting: function getSetting(params) {
		simulateOK('getSetting', params, {
			authSetting: {
				"scope.userInfo": true,
				"scope.userLocation": true,
				"scope.address": true,
				"scope.invoiceTitle": true,
				"scope.werun": true,
				"scope.record": true,
				"scope.writePhotosAlbum": true,
				"scope.camera": true
			}
		});
	},
	openSetting: function openSetting(params) {
		simulateOK('openSetting', params);
	},
	navigateBackMiniProgram: function navigateBackMiniProgram(params) {
		window.history.go(-1);
	},
	navigateToMiniProgram: function navigateToMiniProgram(params) {
		// TODO how to implement this?
	},
	removeUserCloudStorage: function removeUserCloudStorage(params) {
		// TODO not implemented
		simulateFail('removeUserCloudStorage', params);
	},
	setUserCloudStorage: function setUserCloudStorage(params) {
		// TODO not implemented
		simulateFail('setUserCloudStorage', params);
	},
	requestMidasPayment: function requestMidasPayment(params) {
		// TODO not implemented
		simulateFail('requestMidasPayment', params);
	},
	navigateToMoreMiniProgram: function navigateToMoreMiniProgram(params) {
		// TODO not implemented
		simulateFail('navigateToMoreMiniProgram', params);
	},
	getGameReward: function getGameReward(params) {
		// TODO not implemented
		simulateFail('getGameReward', params);
	},
	showRewardToast: function showRewardToast(params) {
		// TODO not implemented
		simulateFail('showRewardToast', params);
	},
	getMenuButtonBoundingClientRect: function getMenuButtonBoundingClientRect(params) {
		// TODO 做一个h5实现的menu?
		simulateOK('getMenuButtonBoundingClientRect', params, {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: 0,
			height: 0
		});
	},
	setMenuStyle: function setMenuStyle(params) {
		// TODO 做一个h5实现的menu?
		simulateOK('setMenuStyle', params);
	},
	setStatusBarStyle: function setStatusBarStyle(params) {
		simulateOK('setStatusBarStyle', params);
	},
	closeSocket: function closeSocket(params) {
		params = params || {};
		var task = _socketTask_js2.default.getLastTask();
		if (task) {
			var fn = function fn(res) {
				simulateOK('closeSocket', params);
				task.offClose(fn);
			};
			task.onClose(fn);
			task.close(params.code || 1000, params.reason || '');
		} else {
			if (params.fail) {
				params.fail();
			}
			if (params.complete) {
				params.complete();
			}
		}
	},
	sendSocketMessage: function sendSocketMessage(params) {
		params = params || {};
		var task = _socketTask_js2.default.getLastTask();
		if (task) {
			task.send(params);
		} else {
			if (params.fail) {
				params.fail();
			}
			if (params.complete) {
				params.complete();
			}
		}
	},
	onSocketMessage: function onSocketMessage(callback) {
		var task = _socketTask_js2.default.getLastTask();
		if (task) {
			task.onMessage(callback);
		}
	},
	onSocketOpen: function onSocketOpen(callback) {
		var task = _socketTask_js2.default.getLastTask();
		if (task) {
			task.onOpen(callback);
		}
	},
	onSocketError: function onSocketError(callback) {
		var task = _socketTask_js2.default.getLastTask();
		if (task) {
			task.onError(callback);
		}
	},
	onSocketClose: function onSocketClose(callback) {
		var task = _socketTask_js2.default.getLastTask();
		if (task) {
			task.onClose(callback);
		}
	}
};

exports.default = apiObj_js;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// if some api is not exactly same, put it here

var customApi = {};

// adapter for wx
// XXX: some device may not have Proxy exposed to browser, maybe ES6 feature flag is not opened
// try {
// 	let proxy = new Proxy(window.mgc, {
// 		get: function(target, name) {
// 			if(typeof (target[name]) != 'function') {
// 				return target[name]
// 			} else {
// 				if(customApi[name]) {
// 					logxx(`wx custom api called: ${name}`)
// 					return customApi[name]
// 				} else {
// 					return function wrapper() {
// 						if(target[name] !== undefined) {
// 							logxx(`wx api called: ${name}`)
// 							return target[name].apply(target, arguments)
// 						} else {
// 							logxx(`wx api missed: ${name}, please implement it`)
// 						}
// 					}
// 				}
// 			}
// 		},
// 		set: function(target, name, value) {
// 			target[name] = value
// 			return true
// 		},
// 		ownKeys: function(target) {
// 			return Reflect.ownKeys(target)
// 		},
// 		defineProperty: function(target, name, descriptor) {
// 			if(typeof (target[name]) == typeof(descriptor.value)) {
// 				return Object.defineProperty(customApi, name, descriptor)
// 			}
// 			return false
// 		},
// 		getOwnPropertyDescriptor: function(target, name) {
// 			if(customApi[name]) {
// 				return Object.getOwnPropertyDescriptor(customApi, name)
// 			} else if(target[name]) {
// 				return Object.getOwnPropertyDescriptor(target, name)
// 			} else {
// 				return undefined
// 			}
// 		}
// 	})
// 	window.wx = proxy
// } catch(e) {
window.wx = window.mgc;
// }

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var statusDefineFlag = 1;
var statusRequireFlag = 2;
var statusRequiringFlag = 3;
var moduleArr = {};

var define = function define(path, fun) {
	moduleArr[path] = {
		status: statusDefineFlag,
		factory: fun
	};
};

var getPathPrefix = function getPathPrefix(pathname) {
	// 返回path
	var res = pathname.match(/(.*)\/([^\/]+)?$/);
	return res && res[1] ? res[1] : './';
};

var getRequireFun = function getRequireFun(pathname) {
	// e:path 返回相对e的require
	var pathPrefix = getPathPrefix(pathname);
	return function (path) {
		if (typeof path !== 'string') {
			throw new Error('require args must be a string');
		}
		var folderArr = [];
		var folders = (pathPrefix + '/' + path).split('/');
		var pathLength = folders.length;
		for (var i = 0; i < pathLength; ++i) {
			var folder = folders[i];
			if (folder != '' && folder != '.') {
				if (folder == '..') {
					if (folderArr.length == 0) {
						throw new Error("can't find module : " + path);
					}
					folderArr.pop();
				} else {
					i + 1 < pathLength && folders[i + 1] == '..' ? i++ : folderArr.push(folder);
				}
			}
		}
		try {
			var _pathname = folderArr.join('/');
			if (!/\.js$/.test(_pathname)) {
				_pathname += '.js';
			}
			return _require(_pathname);
		} catch (e) {
			throw e;
		}
	};
};
var _require = function _require(path) {
	// exports o
	if (typeof path !== 'string') {
		throw new Error('require args must be a string');
	}
	var moduleObj = moduleArr[path];
	logxx('require ' + path + ', and module is ' + moduleObj);
	if (!moduleObj) return {}; //throw new Error('module "' + path + '" is not defined')
	if (moduleObj.status === statusDefineFlag) {
		// we need set a requiring flag to avoid loop require
		moduleObj.status = statusRequiringFlag;
		moduleObj.exports = {};
		var factoryFun = moduleObj.factory;
		if (factoryFun) {
			factoryFun(getRequireFun(path), moduleObj, moduleObj.exports);
		}

		// now it is required
		moduleObj.status = statusRequireFlag;
	}
	return moduleObj.exports;
};

exports.define = define;
exports.require = _require;

window.define = define;
window.require = _require;
window.__WAServiceEndTime__ = Date.now();

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(2);

var _utils2 = _interopRequireDefault(_utils);

var _database = __webpack_require__(94);

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// method to generate api
function addGetterForCloud(apiKey) {
	Cloud.__defineGetter__(apiKey, function () {
		return _utils2.default.surroundByTryCatchFactory(apiObj[apiKey], 'mgc.cloud.' + apiKey);
	});
}

// api container
var Cloud = {};

// define api
var apiObj = {
	init: function init(params) {
		// TODO
	},
	database: function database(params) {
		return new _database2.default(params);
	},
	uploadFile: function uploadFile(params) {
		// TODO
	},
	downloadFile: function downloadFile(params) {
		// TODO
	},
	getTempFileURL: function getTempFileURL(params) {
		// TODO
	},
	deleteFile: function deleteFile(params) {
		// TODO
	},
	callFunction: function callFunction(params) {
		// TODO
		if (params.success) {
			params.success({
				errMsg: 'callFunction:ok',
				result: 'not implemented',
				requestID: '1'
			});
		}
	}

	// attach api to cloud object
};for (var key in apiObj) {
	addGetterForCloud(key);
}

// global mgc cloud api object
window.mgc.cloud = Cloud;
module.exports = Cloud;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _collection = __webpack_require__(95);

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** TODO empty implementation */
var Database = function () {
	function Database(params) {
		_classCallCheck(this, Database);
	}

	/**
  * 方法接受一个 name 参数，指定需引用的集合名称
  */


	_createClass(Database, [{
		key: 'collection',
		value: function collection(name) {
			return new _collection2.default(name);
		}
	}]);

	return Database;
}();

exports.default = Database;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _document = __webpack_require__(96);

var _document2 = _interopRequireDefault(_document);

var _query = __webpack_require__(97);

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** TODO empty implementation */
var Collection = function () {
	function Collection(name) {
		_classCallCheck(this, Collection);

		this.name = name;
	}

	_createClass(Collection, [{
		key: 'doc',
		value: function doc(id) {
			return new _document2.default(id);
		}
	}, {
		key: 'get',
		value: function get(options) {
			return new Promise(function (resolve, reject) {
				resolve({ data: [] });
			});
		}
	}, {
		key: 'add',
		value: function add(options) {
			return new Promise(function (resolve, reject) {
				resolve({ _id: 0 });
			});
		}
	}, {
		key: 'count',
		value: function count(options) {
			return new Promise(function (resolve, reject) {
				resolve({ total: 0 });
			});
		}
	}, {
		key: 'where',
		value: function where(rule) {
			return new _query2.default(rule);
		}
	}, {
		key: 'orderBy',
		value: function orderBy(fieldName, order) {
			return null;
		}
	}]);

	return Collection;
}();

exports.default = Collection;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** TODO empty implementation */
var Document = function () {
	function Document(id) {
		_classCallCheck(this, Document);

		this.id = id;
	}

	_createClass(Document, [{
		key: "get",
		value: function get(options) {
			return new Promise(function (resolve, reject) {
				resolve({ data: [] });
			});
		}
	}, {
		key: "update",
		value: function update(options) {
			return new Promise(function (resolve, reject) {
				resolve({
					stats: {
						updated: 0
					}
				});
			});
		}
	}, {
		key: "set",
		value: function set(options) {
			return new Promise(function (resolve, reject) {
				resolve({
					_id: 0,
					stats: {
						removed: 0,
						created: 0
					}
				});
			});
		}
	}, {
		key: "remove",
		value: function remove(options) {
			return new Promise(function (resolve, reject) {
				resolve({
					stats: {
						removed: 0
					}
				});
			});
		}
	}]);

	return Document;
}();

exports.default = Document;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Query = function Query(rule) {
	_classCallCheck(this, Query);

	this.rule = rule;
};

exports.default = Query;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(99);

// save native reference
var __global = {
	Audio: window.Audio,
	Image: window.Image,
	Canvas: window.Canvas,
	HTMLCanvasElement: window.HTMLCanvasElement,
	HTMLAudioElement: window.HTMLAudioElement,
	HTMLImageElement: window.HTMLImageElement,
	HTMLMediaElement: window.HTMLMediaElement,
	HTMLElement: window.HTMLElement,
	TouchEvent: window.TouchEvent,
	MouseEvent: window.MouseEvent,
	PointerEvent: window.PointerEvent,
	document: window.document,
	navigator: window.navigator,
	createElement: window.document.createElement,
	dispatchEvent: window.document.dispatchEvent,
	XMLHttpRequest: window.XMLHttpRequest
};
window.NativeGlobal = __global;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// we can not extends native element, so for adapter we must replace all
// or replace none. For now, we just add missing method for native

if (!window.HTMLAudioElement.prototype.destroy) {
	window.HTMLAudioElement.prototype.destroy = function () {};
}
if (!window.HTMLAudioElement.prototype.onPlay) {
	window.HTMLAudioElement.prototype.onPlay = function () {};
}
if (!window.HTMLAudioElement.prototype.onStop) {
	window.HTMLAudioElement.prototype.onStop = function () {};
}
if (!window.HTMLAudioElement.prototype.onEnded) {
	window.HTMLAudioElement.prototype.onEnded = function () {};
}
if (!window.HTMLAudioElement.prototype.onCanplay) {
	window.HTMLAudioElement.prototype.onCanplay = function () {};
}
if (!window.HTMLAudioElement.prototype.onError) {
	window.HTMLAudioElement.prototype.onError = function () {};
}
if (!window.HTMLAudioElement.prototype.seek) {
	window.HTMLAudioElement.prototype.seek = function () {};
}
if (!window.HTMLAudioElement.prototype.stop) {
	window.HTMLAudioElement.prototype.stop = function () {};
}

/***/ })
/******/ ]);