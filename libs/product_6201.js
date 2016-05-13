(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "moment"], factory);
	else if(typeof exports === 'object')
		exports["product_6201"] = factory(require("lodash"), require("moment"));
	else
		root["product_6201"] = factory(root["lodash"], root["moment"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _data = __webpack_require__(1);

	var code = _interopRequireWildcard(_data);

	var _inputjson = __webpack_require__(6);

	var inputjson = _interopRequireWildcard(_inputjson);

	var _product_config = __webpack_require__(7);

	var config = _interopRequireWildcard(_product_config);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	console.log("Product 6201 is ready...");
	var exps = { product_id: 6201, code: code, inputjson: inputjson, config: config };

	module.exports = exps;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.product_data = product_data;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	var _product_data = __webpack_require__(5);

	var data = _interopRequireWildcard(_product_data);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function product_data(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '0' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    return data;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.now = now;
	exports.calcAge = calcAge;
	exports.toDate = toDate;
	exports.toRow = toRow;
	exports.roundTo = roundTo;
	exports.toKey = toKey;
	exports.buildKeys = buildKeys;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function now() {
	    return (0, _moment2.default)();
	}

	function calcAge(ageMethod, birthdate) {

	    var today = now();
	    var dob = _moment2.default.isMoment(birthdate) ? birthdate : toDate(birthdate);
	    if (!_lodash2.default.has(dob, 'isValid')) {
	        dob = (0, _moment2.default)(dob);
	    }
	    var anniversary = dob.month() === today.month() && dob.day() === today.day() ? true : false;
	    var age = today.diff(dob, 'years');
	    if (ageMethod === 'ANB') {
	        age = anniversary ? age : age + 1;
	    } else if (ageMethod === 'ALAB') {
	        age = anniversary ? age - 1 : age;
	    } else {
	        age1 = today.diff(dob, 'years', true);
	        age = age1 - age > 0.5 ? age : age + 1;
	    }
	    return age;
	}

	function toDate(s) {
	    var dd = (0, _moment2.default)(s, ['D-M-YYYY', 'YYYY-M-D', 'YYYY-M-D HH:mm', 'YYYY-M-D HH:mm:ss', 'D-M-YY HH:mm:ss', 'D-M-YY HH:mm', 'YYYY-MM-DDTHH:mm:ss.SSSSZ'], true);
	    return dd.isValid() ? dd : _lodash2.default.isDate(s) ? (0, _moment2.default)(s) : null;
	}

	function toRow(cols, values) {
	    var row = {};
	    _lodash2.default.zip(cols, values).forEach(function (item, index) {
	        var _item = _slicedToArray(item, 2);

	        var k = _item[0];
	        var v = _item[1];

	        row[k] = v;
	        if (index < 10) {
	            row[index] = v; // to allow access by db0, db1,....
	        }
	    });
	    return row;
	}

	function roundTo(num, dp) {
	    var n = num + 0.000000000000001;
	    return parseFloat(n.toFixed(dp));
	}

	function toKey(tableName, meta, factors) {
	    var stopOnError = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	    var tableKeys = meta._keys;
	    var keyList = [];
	    tableKeys.forEach(function (itm) {
	        var _itm = _slicedToArray(itm, 2);

	        var key = _itm[0];
	        var dataType = _itm[1];

	        var factor = factors[key];
	        var k = '_key_' + key;
	        var valueList = meta[k]; // get list of possible values for this key
	        var gotIt = false;

	        if (valueList.length === 1 && (_lodash2.default.isUndefined(factor) || _lodash2.default.isNull(factor))) {
	            keyList.push(valueList[0][0]);
	        } else {
	            for (var i = 0; i < valueList.length; i++) {
	                var item = valueList[i];

	                var _item2 = _slicedToArray(item, 2);

	                var lowstr = _item2[0];
	                var highstr = _item2[1];

	                var low = lowstr;
	                var high = highstr;
	                if (dataType === 'int') {
	                    low = parseInt(low);
	                    high = high === '*' ? high : parseInt(high);
	                    factor = parseInt(factor);
	                } else if (dataType === 'number') {
	                    low = parseFloat(low);
	                    high = high === '*' ? high : parseFloat(high);
	                    factor = parseFloat(factor);
	                } else if (dataType === 'str') {
	                    if (typeof factor !== 'string') {
	                        factor = '' + factor; // convert to string
	                    }
	                }
	                if (high === '*') {
	                    if (factor === low) {
	                        keyList.push(lowstr);
	                        gotIt = true;
	                        break;
	                    }
	                } else {
	                    if (factor >= low && factor <= high) {
	                        keyList.push(lowstr);
	                        gotIt = true;
	                        break;
	                    }
	                }
	            }
	            if (!gotIt) {
	                if (valueList.length === 1) {
	                    keyList.push(valueList[0][0]);
	                } else {
	                    // try and use a default value
	                    var deflt = void 0;
	                    if (key == 'gender') {
	                        deflt = _lodash2.default.find(valueList, function (item) {
	                            return item === 'N';
	                        });
	                        if (deflt) {
	                            keyList.push('N');
	                        }
	                    } else if (key === 'smoking') {
	                        deflt = _lodash2.default.find(valueList, function (item) {
	                            return item === 'W';
	                        });
	                        if (deflt) {
	                            keyList.push('W');
	                        }
	                    } else {

	                        deflt = _lodash2.default.find(valueList, function (item, idx) {
	                            return item === '*';
	                        });
	                        if (deflt) {
	                            keyList.push('*');
	                        }
	                    }
	                    if (_lodash2.default.isUndefined(deflt)) {
	                        if (stopOnError) {
	                            console.log("*** utils.js toKey--> unable to set the key value for ", tableName, key, factors);
	                            //                            debugger;
	                            throw Error("utils.js toKey -->Unable to set key value " + tableName, key, factors);
	                        }
	                    }
	                }
	            }
	        }
	    });
	    return keyList.join(':');
	}

	function buildKeys(tableName, meta, factors) {
	    var stopOnError = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

	    var tableKeys = meta._keys;
	    var keyList = [],
	        allKeys = [];

	    tableKeys.forEach(function (itm) {
	        var _itm2 = _slicedToArray(itm, 2);

	        var key = _itm2[0];
	        var dataType = _itm2[1];

	        var factor = factors[key];
	        var k = '_key_' + key;
	        var valueList = meta[k]; // get list of possible values for this key
	        var gotIt = false;

	        if (valueList.length === 1 && (_lodash2.default.isUndefined(factor) || _lodash2.default.isNull(factor))) {
	            keyList.push(valueList[0][0]);
	        } else {

	            for (var i = 0; i < valueList.length; i++) {
	                var item = valueList[i];

	                var _item3 = _slicedToArray(item, 2);

	                var lowstr = _item3[0];
	                var highstr = _item3[1];

	                var low = lowstr;
	                var high = highstr;
	                if (dataType === 'int') {
	                    low = parseInt(low);
	                    high = high === '*' ? high : parseInt(high);
	                    factor = parseInt(factor);
	                } else if (dataType === 'number') {
	                    low = parseFloat(low);
	                    high = high === '*' ? high : parseFloat(high);
	                    factor = parseFloat(factor);
	                } else if (dataType === 'str') {
	                    if (typeof factor !== 'string') {
	                        factor = '' + factor; // convert to string
	                    }
	                }
	                if (high === '*') {
	                    if (factor === low) {
	                        keyList.push(lowstr);
	                        gotIt = true;
	                        break;
	                    }
	                } else {
	                    if (factor >= low && factor <= high) {
	                        keyList.push(lowstr);
	                        gotIt = true;
	                        break;
	                    }
	                }
	            }
	            if (!gotIt) {
	                if (valueList.length === 1) {
	                    keyList.push(valueList[0][0]);
	                } else {
	                    // try and use a default value
	                    var deflt = void 0;
	                    if (key == 'gender') {
	                        deflt = _lodash2.default.find(valueList, function (item) {
	                            return item === 'N';
	                        });
	                        if (deflt) {
	                            keyList.push('N');
	                        }
	                    } else if (key === 'smoking') {
	                        deflt = _lodash2.default.find(valueList, function (item) {
	                            return item === 'W';
	                        });
	                        if (deflt) {
	                            keyList.push('W');
	                        }
	                    } else {

	                        deflt = _lodash2.default.find(valueList, function (item, idx) {
	                            return item === '*';
	                        });
	                        if (deflt) {
	                            keyList.push('*');
	                        }
	                    }
	                    if (_lodash2.default.isUndefined(deflt)) {
	                        if (stopOnError) {
	                            console.log("*** utils.js toKey--> unable to set the key value for ", tableName, key, factors);
	                            debugger;
	                            throw Error("utils.js toKey -->Unable to set key value " + tableName, key);
	                        }
	                    }
	                }
	            }
	        }
	    });
	    return keyList.join(':');
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  "age_limit": {
	    "6201:0:0:9999:0:0:9999:0:0:0:0:9999:0:0:0.0:0:N:0:1": [27999, "5", 30, 65, 999, 999, 999, 999, 80, "1", 0, 999, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "1", 18, "1", 9999, 999, 0, "2016-04-21 00:00:00", "2016-04-21 00:00:00", "0", 1421],
	    "_meta": {
	      "_cols": ["list_id", "min_insd_nb_age_unit", "min_insd_nb_age", "max_insd_nb_age", "max_insd_rn_age", "max_insd_nb_pu_age", "max_insd_nb_ex_age", "max_insd_rn_ex_age", "max_ph_nb_age", "min_ji_nb_age_unit", "min_ji_nb_age", "max_ji_nb_age", "recorder_id", "insert_time", "updater_id", "update_time", "max_insd_nb_age_unit", "min_ph_nb_age", "max_ji_nb_age_unit", "pay_year_max", "max_deferment_age", "min_deferment_age", "insert_timestamp", "update_timestamp", "benefit_level", "product_version_id"],
	      "_coltypes": ["int", "str", "int", "int", "int", "int", "int", "int", "int", "str", "int", "int", "int", "dtm", "int", "dtm", "str", "int", "str", "int", "int", "int", "dtm", "dtm", "str", "int"],
	      "_key_charge_period": [["0", "*"]],
	      "_key_charge_type": [["0", "*"]],
	      "_key_charge_year": [["0", "*"]],
	      "_key_charge_year_max": [["9999", "*"]],
	      "_key_coverage_period": [["0", "*"]],
	      "_key_coverage_year": [["0", "*"]],
	      "_key_coverage_year_max": [["9999", "*"]],
	      "_key_end_period": [["0", "*"]],
	      "_key_end_year": [["0", "*"]],
	      "_key_end_year_max": [["9999", "*"]],
	      "_key_gender": [["N", "*"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_pay_ensure": [["0", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_pay_period": [["0", "*"]],
	      "_key_pay_year": [["0", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_key_sa": [["0.0", "9.99999999999e+11"]],
	      "_key_special_auth": [["1", "*"]],
	      "_keys": [["product_id", "int"], ["charge_period", "str"], ["charge_year", "int"], ["charge_year_max", "int"], ["coverage_period", "str"], ["coverage_year", "int"], ["coverage_year_max", "int"], ["pay_period", "str"], ["pay_year", "int"], ["end_period", "str"], ["end_year", "int"], ["end_year_max", "int"], ["pay_ensure", "int"], ["charge_type", "str"], ["sa", "num"], ["pay_mode", "int"], ["gender", "str"], ["insured_status", "str"], ["special_auth", "int"]]
	    }
	  },
	  "cash_bonus_rate": {},
	  "cash_value": {},
	  "expense_fee_default": {
	    "6201:1:*:1:0": [0.0],
	    "6201:4:*:1:0": [0.05],
	    "_meta": {
	      "_cols": ["assign_rate"],
	      "_coltypes": ["num"],
	      "_key_discount_type": [["*", "*"]],
	      "_key_policy_year": [["1", "999"]],
	      "_key_prem_type": [["1", "*"], ["4", "*"]],
	      "_key_premium": [["0", "99999999999999"]],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"], ["prem_type", "str"], ["discount_type", "str"], ["policy_year", "int"], ["premium", "num"]]
	    }
	  },
	  "insurance_charge_rate": {
	    "6201:0:*:*:*:*:1900-01-01": [3.78],
	    "6201:100:*:*:*:*:1900-01-01": [554.94],
	    "6201:10:*:*:*:*:1900-01-01": [0.971],
	    "6201:11:*:*:*:*:1900-01-01": [0.971],
	    "6201:12:*:*:*:*:1900-01-01": [0.971],
	    "6201:13:*:*:*:*:1900-01-01": [0.971],
	    "6201:14:*:*:*:*:1900-01-01": [1.04],
	    "6201:15:*:*:*:*:1900-01-01": [1.2],
	    "6201:16:*:*:*:*:1900-01-01": [1.371],
	    "6201:17:*:*:*:*:1900-01-01": [1.511],
	    "6201:18:*:*:*:*:1900-01-01": [1.62],
	    "6201:19:*:*:*:*:1900-01-01": [1.691],
	    "6201:1:*:*:*:*:1900-01-01": [0.971],
	    "6201:20:*:*:*:*:1900-01-01": [1.691],
	    "6201:21:*:*:*:*:1900-01-01": [1.691],
	    "6201:22:*:*:*:*:1900-01-01": [1.691],
	    "6201:23:*:*:*:*:1900-01-01": [1.691],
	    "6201:24:*:*:*:*:1900-01-01": [1.691],
	    "6201:25:*:*:*:*:1900-01-01": [1.691],
	    "6201:26:*:*:*:*:1900-01-01": [1.691],
	    "6201:27:*:*:*:*:1900-01-01": [1.691],
	    "6201:28:*:*:*:*:1900-01-01": [1.691],
	    "6201:29:*:*:*:*:1900-01-01": [1.691],
	    "6201:2:*:*:*:*:1900-01-01": [0.971],
	    "6201:30:*:*:*:*:1900-01-01": [1.691],
	    "6201:31:*:*:*:*:1900-01-01": [1.691],
	    "6201:32:*:*:*:*:1900-01-01": [1.691],
	    "6201:33:*:*:*:*:1900-01-01": [1.731],
	    "6201:34:*:*:*:*:1900-01-01": [1.831],
	    "6201:35:*:*:*:*:1900-01-01": [1.931],
	    "6201:36:*:*:*:*:1900-01-01": [2.06],
	    "6201:37:*:*:*:*:1900-01-01": [2.22],
	    "6201:38:*:*:*:*:1900-01-01": [2.371],
	    "6201:39:*:*:*:*:1900-01-01": [2.52],
	    "6201:3:*:*:*:*:1900-01-01": [0.971],
	    "6201:40:*:*:*:*:1900-01-01": [2.68],
	    "6201:41:*:*:*:*:1900-01-01": [2.851],
	    "6201:42:*:*:*:*:1900-01-01": [3.051],
	    "6201:43:*:*:*:*:1900-01-01": [3.3],
	    "6201:44:*:*:*:*:1900-01-01": [3.591],
	    "6201:45:*:*:*:*:1900-01-01": [3.98],
	    "6201:46:*:*:*:*:1900-01-01": [4.46],
	    "6201:47:*:*:*:*:1900-01-01": [5.051],
	    "6201:48:*:*:*:*:1900-01-01": [5.711],
	    "6201:49:*:*:*:*:1900-01-01": [6.431],
	    "6201:4:*:*:*:*:1900-01-01": [0.971],
	    "6201:50:*:*:*:*:1900-01-01": [7.171],
	    "6201:51:*:*:*:*:1900-01-01": [7.471],
	    "6201:52:*:*:*:*:1900-01-01": [8.12],
	    "6201:53:*:*:*:*:1900-01-01": [8.72],
	    "6201:54:*:*:*:*:1900-01-01": [9.351],
	    "6201:55:*:*:*:*:1900-01-01": [10.091],
	    "6201:56:*:*:*:*:1900-01-01": [11.04],
	    "6201:57:*:*:*:*:1900-01-01": [12.231],
	    "6201:58:*:*:*:*:1900-01-01": [13.66],
	    "6201:59:*:*:*:*:1900-01-01": [15.22],
	    "6201:5:*:*:*:*:1900-01-01": [0.971],
	    "6201:60:*:*:*:*:1900-01-01": [16.731],
	    "6201:61:*:*:*:*:1900-01-01": [18.391],
	    "6201:62:*:*:*:*:1900-01-01": [20.22],
	    "6201:63:*:*:*:*:1900-01-01": [22.22],
	    "6201:64:*:*:*:*:1900-01-01": [24.42],
	    "6201:65:*:*:*:*:1900-01-01": [26.84],
	    "6201:66:*:*:*:*:1900-01-01": [29.48],
	    "6201:67:*:*:*:*:1900-01-01": [32.391],
	    "6201:68:*:*:*:*:1900-01-01": [35.591],
	    "6201:69:*:*:*:*:1900-01-01": [39.091],
	    "6201:6:*:*:*:*:1900-01-01": [0.971],
	    "6201:70:*:*:*:*:1900-01-01": [42.931],
	    "6201:71:*:*:*:*:1900-01-01": [47.14],
	    "6201:72:*:*:*:*:1900-01-01": [51.751],
	    "6201:73:*:*:*:*:1900-01-01": [56.8],
	    "6201:74:*:*:*:*:1900-01-01": [62.331],
	    "6201:75:*:*:*:*:1900-01-01": [68.38],
	    "6201:76:*:*:*:*:1900-01-01": [74.991],
	    "6201:77:*:*:*:*:1900-01-01": [82.231],
	    "6201:78:*:*:*:*:1900-01-01": [90.131],
	    "6201:79:*:*:*:*:1900-01-01": [98.751],
	    "6201:7:*:*:*:*:1900-01-01": [0.971],
	    "6201:80:*:*:*:*:1900-01-01": [108.151],
	    "6201:81:*:*:*:*:1900-01-01": [118.391],
	    "6201:82:*:*:*:*:1900-01-01": [129.54],
	    "6201:83:*:*:*:*:1900-01-01": [141.66],
	    "6201:84:*:*:*:*:1900-01-01": [154.831],
	    "6201:85:*:*:*:*:1900-01-01": [169.1],
	    "6201:86:*:*:*:*:1900-01-01": [184.56],
	    "6201:87:*:*:*:*:1900-01-01": [201.28],
	    "6201:88:*:*:*:*:1900-01-01": [219.331],
	    "6201:89:*:*:*:*:1900-01-01": [238.771],
	    "6201:8:*:*:*:*:1900-01-01": [0.971],
	    "6201:90:*:*:*:*:1900-01-01": [259.68],
	    "6201:91:*:*:*:*:1900-01-01": [282.1],
	    "6201:92:*:*:*:*:1900-01-01": [306.09],
	    "6201:93:*:*:*:*:1900-01-01": [331.68],
	    "6201:94:*:*:*:*:1900-01-01": [358.9],
	    "6201:95:*:*:*:*:1900-01-01": [387.74],
	    "6201:96:*:*:*:*:1900-01-01": [418.21],
	    "6201:97:*:*:*:*:1900-01-01": [450.26],
	    "6201:98:*:*:*:*:1900-01-01": [483.8],
	    "6201:99:*:*:*:*:1900-01-01": [518.74],
	    "6201:9:*:*:*:*:1900-01-01": [0.971],
	    "_meta": {
	      "_cols": ["result_value_1"],
	      "_coltypes": ["num"],
	      "_key_age": [["90", "*"], ["65", "*"], ["56", "*"], ["55", "*"], ["51", "*"], ["47", "*"], ["45", "*"], ["27", "*"], ["15", "*"], ["9", "*"], ["72", "*"], ["71", "*"], ["70", "*"], ["66", "*"], ["49", "*"], ["42", "*"], ["38", "*"], ["37", "*"], ["30", "*"], ["25", "*"], ["2", "*"], ["12", "*"], ["11", "*"], ["94", "*"], ["93", "*"], ["92", "*"], ["88", "*"], ["67", "*"], ["57", "*"], ["44", "*"], ["40", "*"], ["28", "*"], ["22", "*"], ["21", "*"], ["20", "*"], ["17", "*"], ["1", "*"], ["87", "*"], ["78", "*"], ["61", "*"], ["41", "*"], ["33", "*"], ["31", "*"], ["26", "*"], ["18", "*"], ["100", "*"], ["91", "*"], ["86", "*"], ["80", "*"], ["79", "*"], ["77", "*"], ["7", "*"], ["63", "*"], ["60", "*"], ["50", "*"], ["29", "*"], ["23", "*"], ["13", "*"], ["10", "*"], ["0", "*"], ["99", "*"], ["96", "*"], ["89", "*"], ["85", "*"], ["84", "*"], ["68", "*"], ["62", "*"], ["59", "*"], ["58", "*"], ["53", "*"], ["52", "*"], ["48", "*"], ["43", "*"], ["35", "*"], ["95", "*"], ["83", "*"], ["8", "*"], ["75", "*"], ["74", "*"], ["4", "*"], ["39", "*"], ["32", "*"], ["3", "*"], ["24", "*"], ["19", "*"], ["14", "*"], ["98", "*"], ["97", "*"], ["82", "*"], ["81", "*"], ["76", "*"], ["73", "*"], ["69", "*"], ["64", "*"], ["6", "*"], ["54", "*"], ["5", "*"], ["46", "*"], ["36", "*"], ["34", "*"], ["16", "*"]],
	      "_key_discount_type": [["*", "*"]],
	      "_key_effective_date": [["1900-01-01", "2099-12-31"]],
	      "_key_gender": [["*", "*"]],
	      "_key_policy_year": [["*", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_key_smoking_indi": [["*", "*"]],
	      "_keys": [["product_id", "int"], ["age", "int"], ["gender", "str"], ["smoking_indi", "str"], ["policy_year", "int"], ["discount_type", "str"], ["effective_date", "dtm"]]
	    }
	  },
	  "investment_performance": {
	    "6201:HIGH": [0.08],
	    "6201:LOW": [0.04],
	    "6201:MID": [0.06],
	    "_meta": {
	      "_cols": ["rate"],
	      "_coltypes": ["num"],
	      "_key_product_id": [["6201", "*"]],
	      "_key_type": [["LOW", "*"], ["MID", "*"], ["HIGH", "*"]],
	      "_keys": [["product_id", "int"], ["type", "str"]]
	    }
	  },
	  "liability_config": {
	    "6201:303": ["N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", 0, "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "2016-04-21 00:00:00", "2016-04-21 00:00:00", 0, 14220, "N", "N", 1421],
	    "_meta": {
	      "_cols": ["pay_period", "pay_month", "pay_age1", "pay_age2", "pay_end_period", "pay_end_year", "pay_pay_ensure", "pay_pay_type", "pay_premium_year", "liab_prem_year", "liab_period", "liab_charge_type", "liab_gender", "liab_age", "liab_month", "liab_liab_age", "liab_bene_level", "liab_pay_ensure", "wait_days", "surgery_type", "sickroom_type", "hospital_speci", "hospital_type", "relation_s", "claim_cnt", "once_except", "once_pay_rate", "once_per_pay_limit", "year_except", "year_per_pay_limit", "coverage_except", "coverage_per_pay_limit", "life_pay_limit", "day_per_pay_limit", "month_per_pay_limit", "pay_age", "hospital_owner", "hospital_time", "pay_amount", "insert_time", "update_time", "sur_amount", "list_id", "liab_job_class", "pay_low_prem", "product_version_id"],
	      "_coltypes": ["str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "dtm", "int", "int", "str", "str", "int"],
	      "_key_liab_id": [["303", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"], ["liab_id", "int"]]
	    }
	  },
	  "main_rider_age_limit": {
	    "6201:6202": [0, 999, 0, 999],
	    "_meta": {
	      "_cols": ["min_ath_age", "max_ath_age", "min_ath_mast_age", "max_ath_mast_age"],
	      "_coltypes": ["int", "int", "int", "int"],
	      "_key_attach_id": [["6202", "*"]],
	      "_key_master_id": [["6201", "*"]],
	      "_keys": [["master_id", "int"], ["attach_id", "int"]]
	    }
	  },
	  "main_rider_sa_limit": {
	    "6201:6202:0:N:*": [0.0, 99.99, 9999999999.0, 0.0, 99.99, "Y", 0, 999999999999],
	    "_meta": {
	      "_cols": ["min_ath_sa_rate", "max_ath_sa_rate", "max_ath_sa_amt", "min_mast_sa_amt", "total_over_rate", "no_equal", "min_ath_mast_sa_amt", "max_ath_mast_sa_amt"],
	      "_coltypes": ["num", "num", "num", "num", "num", "str", "num", "num"],
	      "_key_age": [["0", "999"]],
	      "_key_attach_id": [["6202", "*"]],
	      "_key_gender": [["N", "*"]],
	      "_key_job": [["*", "*"]],
	      "_key_master_id": [["6201", "*"]],
	      "_keys": [["master_id", "int"], ["attach_id", "int"], ["age", "num"], ["gender", "str"], ["job", "str"]]
	    }
	  },
	  "model_factor": {
	    "6201:*:1:3:*": [1.0],
	    "6201:*:4:3:*": [0.095],
	    "6201:*:5:1:*": [1.0],
	    "_meta": {
	      "_cols": ["charge_rate"],
	      "_coltypes": ["num"],
	      "_key_charge_type": [["1", "*"], ["4", "*"], ["5", "*"]],
	      "_key_master_id": [["*", "*"]],
	      "_key_model_type": [["3", "*"], ["1", "*"]],
	      "_key_pay_mode": [["*", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"], ["master_id", "int"], ["charge_type", "str"], ["model_type", "int"], ["pay_mode", "int"]]
	    }
	  },
	  "pay_liability": {},
	  "policy_fee_ilp_default": {
	    "6201:30:*:0:4:*": [25000.0],
	    "6201:4:*:0:4:*": [2.5],
	    "_meta": {
	      "_cols": ["assign_rate"],
	      "_coltypes": ["num"],
	      "_key_charge_type": [["4", "*"]],
	      "_key_discount_type": [["*", "*"]],
	      "_key_fund_code": [["*", "*"]],
	      "_key_money_id": [["30", "*"], ["4", "*"]],
	      "_key_policy_year": [["0", "999"]],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"], ["money_id", "int"], ["fund_code", "str"], ["policy_year", "int"], ["charge_type", "int"], ["discount_type", "str"]]
	    }
	  },
	  "prem_limit": {
	    "6201:0:0:0:0:30": [25576, 10000000.0, 1e+16, 0.0, 1e+16, 0.0, 0.0, 0.0, 1000000.0, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", 0.0, 0.0, "2016-04-21 00:00:00", "2016-04-21 00:00:00", 1421, 1e+16, 1e+16, "0", 0],
	    "6201:0:0:0:0:4": [25577, 1000.0, 1e+16, 0.0, 1e+16, 0.0, 0.0, 0.0, 100.0, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", 0.0, 0.0, "2016-04-21 00:00:00", "2016-04-21 00:00:00", 1421, 1e+16, 1e+16, "0", 0],
	    "_meta": {
	      "_cols": ["list_id", "min_initial_prem", "max_initial_prem", "min_subseq_prem", "max_subseq_prem", "min_incremnt_prem", "min_regu_topup_prem", "min_regu_topup_incr", "min_ad_topup_prem", "recorder_id", "insert_time", "updater_id", "update_time", "min_decremnt_prem", "min_regu_topup_decr", "insert_timestamp", "update_timestamp", "product_version_id", "max_regu_topup_prem", "max_ad_topup_prem", "charge_period", "charge_year"],
	      "_coltypes": ["int", "num", "num", "num", "num", "num", "num", "num", "num", "int", "dtm", "int", "dtm", "num", "num", "dtm", "dtm", "int", "num", "num", "str", "int"],
	      "_key_age": [["0", "999"]],
	      "_key_charge_type": [["0", "*"]],
	      "_key_money_id": [["4", "*"], ["30", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["charge_type", "str"], ["age", "int"], ["pay_mode", "int"], ["special_auth", "int"], ["money_id", "int"]]
	    }
	  },
	  "prod_fund_prem_limit": {},
	  "product_allowables": {
	    "attachable_riders": [[[6202, "2", "0", "N"]], ["int", "str", "str", "str"], ["attach_id", "attach_type", "attach_compulsory", "gender"]],
	    "bonus_options": [[], ["str"], ["mode_id"]],
	    "coverage_terms": [[["3", 100]], ["str", "int"], ["coverage_period", "coverage_year"]],
	    "currencies": [[[4], [30]], ["int"], ["money_id"]],
	    "funds": [[["RF1"], ["RF2"], ["UF1"], ["UF2"]], ["str"], ["fund_code"]],
	    "organizations": [[[101]], ["int"], ["organ_id"]],
	    "pay_methods": [[["5", "0", 1], ["5", "0", 2], ["5", "0", 3], ["5", "0", 30]], ["str", "str", "int"], ["charge_type", "prem_sequen", "pay_mode"]],
	    "payment_freq": [[["5"]], ["str"], ["charge_type"]],
	    "premium_terms": [[["1", 0]], ["str", "int"], ["charge_period", "charge_year"]],
	    "qualifications": [[[0]], ["int"], ["test_type_id"]],
	    "strategies": [[], ["str", "int"], ["strategy_code", "tariff_type"]],
	    "survival_options": [[], ["str"], ["survival_option"]]
	  },
	  "product_charge_list": {
	    "6201:1": ["6", "0", "TSTPK_000000001000843", 0, 0, "0", 1, "N", 2665, "N"],
	    "6201:4": ["1", "0", "TSTPK_000000001000920", 0, 1, "0", 1, "N", 2662, "Y"],
	    "6201:5": ["3", "0", "PRUMY_100000000004516", 1, 4, "4", 1, "N", 2661, "N"],
	    "6201:6": ["3", "0", "TSTPK_000000001002881", 1, 2, "4", 1, "N", 2666, "N"],
	    "6201:9": ["3", "0", "TSTPK_000000001003248", 1, 3, "4", 1, "N", 2663, "N"],
	    "_meta": {
	      "_cols": ["fee_source", "fee_base", "formula_id", "deduct_mode", "deduct_order", "deduct_frequency", "calc_base", "calc_base_same_tiv", "list_id", "follow_prem_frequency"],
	      "_coltypes": ["str", "str", "str", "int", "int", "str", "int", "str", "int", "str"],
	      "_key_charge_code": [["1", "*"], ["4", "*"], ["5", "*"], ["6", "*"], ["9", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"], ["charge_code", "str"]]
	    }
	  },
	  "product_currency": {
	    "6201:101:30:4": [401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "EBAO3002", "2016-04-21 00:00:00", "2016-04-21 00:00:00"],
	    "6201:101:4:4": [401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "EBAO3002", "2016-04-21 00:00:00", "2016-04-21 00:00:00"],
	    "_meta": {
	      "_cols": ["recorder_id", "insert_time", "updater_id", "update_time", "entity_fund", "insert_timestamp", "update_timestamp"],
	      "_coltypes": ["int", "dtm", "int", "dtm", "str", "dtm", "dtm"],
	      "_key_entity_fund_type": [["4", "*"]],
	      "_key_money_id": [["4", "*"], ["30", "*"]],
	      "_key_organ_id": [["101", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"], ["organ_id", "int"], ["money_id", "int"], ["entity_fund_type", "str"]]
	    }
	  },
	  "product_fund": {
	    "6201:RF1": [1000000, 5000000, 1000000, 1000000, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "1", 9999, 9999, 0, "0", 0, "0", 0, 0, 0, 1, "0", 1, "2016-04-21 00:00:00", "2016-04-21 00:00:00"],
	    "6201:RF2": [1000000, 5000000, 1000000, 1000000, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "1", 9999, 9999, 0, "0", 0, "0", 0, 0, 0, 1, "0", 1, "2016-04-21 00:00:00", "2016-04-21 00:00:00"],
	    "6201:UF1": [100, 500, 100, 100, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "1", 9999, 9999, 0, "0", 0, "0", 0, 0, 0, 1, "0", 1, "2016-04-21 00:00:00", "2016-04-21 00:00:00"],
	    "6201:UF2": [100, 500, 100, 100, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "1", 9999, 9999, 0, "0", 0, "0", 0, 0, 0, 1, "0", 1, "2016-04-21 00:00:00", "2016-04-21 00:00:00"],
	    "_meta": {
	      "_cols": ["min_sur_val", "min_sur_remain_val", "min_swit_out_val", "min_swit_remain_val", "recorder_id", "insert_time", "updater_id", "update_time", "switch_period_unit", "max_swit_in_times", "max_swit_out_times", "max_sur_val", "settle_rate_period_unit", "settle_year_type", "settle_freq", "settle_month", "settle_day", "settle_method", "guaranteed_rate_option", "settle_simple_compound", "bonus_settle_type", "insert_timestamp", "update_timestamp"],
	      "_coltypes": ["int", "int", "int", "int", "int", "dtm", "int", "dtm", "str", "int", "int", "int", "str", "int", "str", "int", "int", "int", "int", "str", "int", "dtm", "dtm"],
	      "_key_fund_code": [["RF1", "*"], ["RF2", "*"], ["UF1", "*"], ["UF2", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"], ["fund_code", "str"]]
	    }
	  },
	  "product_life": {
	    "6201": [1, "Maksima Pro", "MPRO", "MPRO", "", "0", "1", "0", "1", "N", "", "2000-11-07 00:00:00", "", 0.0, 0.0, 0.0, 9999, 9999999999.0, "Y", "", "N", "N", "", "41", "0", "4", "1", 0.0, "Y", "", 0.0, "N", "HYEND", "1", "1", "2", "", "1", "N", "Y", "Y", "Y", 0, 401, "2016-04-26 14:15:21", "", 0, "0", "N", "", "1", "N", "N", 30, "0", "0", "16", "2", "4", "N", "Y", "N", "N", 9999, "1", 9999, 9999, 0.0, 0.0, 0, 99, "", "Maksima Pro", "N", 9999999999.0, "0", "N", "N", "1", "N", "N", "N", "N", "", 1, "N", 0.0, "N", "0", "N", "N", "N", "N", "Y", 0, "N", "N", "N", 0.0, "N", "N", 0, 0.0, 2, "N", "N", "N", "N", "1", "Y", "N", "1", 0, "N", "1", 1, "3", "0", "N", 0, 0, 0, "Y", 0, "0", "3", "CRSPK_100000000000618", "2", "R11", "2", "N", "N", "N", 0.0, "N", "N", "0", 0, "N", "N", 0.0, 0.0, "0", "N", "N", 0, "", "N", "0", "9", "N", 2, 60, 2, 0, "N", "N", "N", "N", 0, "Y", "N", 0, "N", "N", 0, "N", "0", 1.0, 1, 0, 0, 3, "2016-04-21 00:00:00", "2016-04-26 14:15:21", "2016-04-21 00:00:00", "2016-04-21 00:00:00", 401, 401, "", 0.0, 0.0, "", "", "", "", 0, "", "", "", 0, "", "", 0, "", 0, 0, "", 0.0, "", 0, 0.0, 0, 0.0, 0.0, 0, "", "", "", "", 0, "", "", 0, "", "", 1, 1, 1e+16, 1, 0.0, 1e+16],
	    "_meta": {
	      "_cols": ["organ_id", "product_name", "product_abbr", "internal_id", "hospital_type", "unit_flag", "ins_type", "ally", "individual_group", "value", "exception", "start_date", "end_date", "life_rate", "sudden_rate", "ill_rate", "em", "check_amount", "pregnant_insured", "underwrite_class", "attachable", "insure_month", "duty", "benefit_type", "target_type", "period_type", "underwrite_job", "actuary_rate", "table_prem", "ss_claim_formula", "min_claim_amount", "mortagage", "initial_id", "section_cal_type", "period_cal_type", "age_base", "bonus_cal_type", "premium_define", "regu_to_single", "sa_accum", "universal_prem", "checked", "insert_person", "updater_id", "update_time", "sys_lock_time", "sys_locker_id", "sys_lock_status", "pseudo", "policyholder", "prem_table", "comm_amount", "uw_manual", "base_money", "gst_indicator", "stamp_indicator", "plan_type", "age_method", "rn_date_type", "follow_discnt", "defer_period", "waiver", "waiver_benefit", "max_switch_times", "switch_period_unit", "max_swit_in_times", "max_swit_out_times", "min_sur_value", "min_remain_value", "min_defer_period", "max_defer_period", "product_name_2", "feature_desc", "payer_wop", "max_waiv_prem_ann", "gurnt_period_type", "receipt_indi", "full_declare", "ph_la_relation", "hth_full_declare", "advan_program", "uw_jet", "backdate_indi", "start_backdate", "backdate_period", "postdate_indi", "max_comp_commi", "dopp_indi", "policy_section", "conversion_priv", "purc_new_pol", "la_change", "stand_alone_rider", "partial_withdraw", "invest_delay", "cash_bonus_indi", "rev_bonus_indi", "tml_bonus_indi", "tml_bonus_int_rate", "bereavement_indi", "stand_life_indi", "non_lap_period", "switch_fee", "free_switch_times", "incr_prem_permit", "surr_charge_indi", "special_discnt", "apilp_indi", "backdate_unit", "topup_permit", "reg_topup_permit", "gurnt_period_unit", "gurnt_period", "hi_pol_fee_indi", "free_switch_unit", "free_switch_period", "par_non_ilp", "stampduty_option", "ladr_indi", "bonus_vest_year_clm", "bonus_vest_year_surr", "cb_vest_year", "is_net_invest", "gsv_vest_year", "phd_rate_cate", "ri_calc_basis", "ri_calc_formula", "ri_renewal_freq", "ri_factor_table_code", "ri_age_base", "asset_share", "gja_indi", "gsc_indi", "apilp_k", "uptoage_indi", "spouse_prod_indi", "benefit_freq_indi", "risk_aggr_formula", "prem_change_notice", "aurp_specific_terms", "waiver_interest_rate", "db_base_clm", "bucket_filling_option", "follow_commision", "formula_driven", "value_unit_amount", "value_cal_type", "comm_start_dd_indi", "fin_prod_indicator", "ra_object", "reg_part_witdr_per", "bucket_fill_option_ad", "pld_grace_period", "lapse_method", "free_witdr_times", "spouse_waiver", "pers_annu_tax_term", "full_prepayment", "self_confirm", "wait_days_af_lapse", "editable", "has_flexible_period", "flexible_period", "first_of_month", "indx_indi", "indx_year", "auto_backdate_indi", "family_type", "model_factor_rate_an", "invest_delay_option", "lock_in_period_option", "lock_in_period", "invest_freelook_option", "insert_timestamp", "update_timestamp", "insert_date", "insert_time", "updated_by", "inserted_by", "add_permit", "admin_charge", "annuity_surr_fac", "apl_permit", "assignment_indi", "auto_reduce_paidup", "auto_reinstmt_indi", "auto_reinstmt_period", "bonus_encash", "decrease_permit", "eta_permit", "eta_product_id", "free_look_follow", "free_look_indi", "free_look_period", "grace_follow", "grace_period", "grace_period_add", "loan_permit", "max_loan_rate", "max_reins_peri_unit", "max_reins_period", "min_add_amount", "min_add_units", "min_loan_amt", "min_sur_amount", "min_sur_units", "overdue_int_indi", "permit_prs", "prefer_life_indi", "prem_vouch_permit", "prem_vouch_rate", "reduce_paidup", "renew", "rup_product_id", "special_revival_permit", "surr_permit", "topup_start_year", "partial_withdraw_start_year", "max_sur_value", "reg_part_witdr_start_year", "reg_part_witdr_min_amount", "reg_part_witdr_max_amount"],
	      "_coltypes": ["int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "dtm", "num", "num", "num", "int", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "int", "dtm", "dtm", "int", "str", "str", "str", "str", "str", "str", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "int", "int", "num", "num", "int", "int", "str", "str", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "int", "str", "num", "str", "str", "str", "str", "str", "str", "str", "int", "str", "str", "str", "num", "str", "str", "int", "num", "int", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "str", "int", "str", "str", "str", "int", "int", "int", "str", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "str", "int", "str", "str", "num", "num", "str", "str", "str", "int", "str", "str", "str", "str", "str", "int", "int", "int", "int", "str", "str", "str", "str", "int", "str", "str", "int", "str", "str", "int", "str", "str", "num", "int", "int", "int", "int", "dtm", "dtm", "dtm", "dtm", "int", "int", "str", "num", "num", "str", "str", "str", "str", "int", "str", "str", "str", "int", "str", "str", "int", "str", "int", "int", "str", "num", "str", "int", "num", "int", "num", "num", "int", "str", "str", "str", "str", "int", "str", "str", "int", "str", "str", "int", "int", "num", "int", "num", "num"],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"]]
	    }
	  },
	  "product_sa_limit": {
	    "6201:0:*:*:0:0:0:30": [15000000.0, 1e+16, 0, 99999, 0, 99999],
	    "6201:0:*:*:0:0:0:4": [1500.0, 1e+16, 0, 99999, 0, 99999],
	    "_meta": {
	      "_cols": ["insd_min_amount", "insd_max_amount", "premium_min_factor", "premium_max_factor", "income_min_factor", "income_max_factor"],
	      "_coltypes": ["num", "num", "num", "num", "num", "num"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_gender": [["*", "*"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job": [["*", "*"]],
	      "_key_money_id": [["4", "*"], ["30", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["age_month", "num"], ["gender", "str"], ["job", "str"], ["insured_status", "str"], ["pay_mode", "int"], ["special_auth", "int"], ["money_id", "int"]]
	    }
	  },
	  "product_unit_rate": {
	    "6201": [1000, 0, 0, 1000, 0, 0, 0, 1000],
	    "_meta": {
	      "_cols": ["sa_unit_amount", "em_unit_amount", "cash_value_unit_amount", "mort_unit_amount", "rev_bonus_unit_amount", "cash_bonus_unit_amount", "tml_bonus_unit_amount", "premium_unit_amount"],
	      "_coltypes": ["int", "int", "int", "int", "int", "int", "int", "int"],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"]]
	    }
	  },
	  "rev_bonus_rate": {},
	  "rider_rider_sa_limit": {
	    "_meta": {
	      "_cols": ["min_ath_sa_rate", "max_ath_sa_rate", "max_ath_sa_amt", "min_mast_sa_amt", "total_over_rate", "no_equal"],
	      "_coltypes": ["num", "num", "num", "num", "num", "str"],
	      "_key_age": [],
	      "_key_attach_id": [],
	      "_key_gender": [],
	      "_key_job": [],
	      "_key_master_id": [],
	      "_keys": [["master_id", "int"], ["attach_id", "int"], ["age", "num"], ["gender", "str"], ["job", "str"]]
	    }
	  },
	  "sa_limit": {
	    "6201:0:0:0:0:0:30": [110237, "1", 15000000.0, 1e+16, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "0", "2016-04-21 00:00:00", "2016-04-21 00:00:00", 1421],
	    "6201:0:0:0:0:0:4": [110236, "1", 1500.0, 1e+16, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "0", "2016-04-21 00:00:00", "2016-04-21 00:00:00", 1421],
	    "_meta": {
	      "_cols": ["list_id", "limit_unit", "insd_min_amount", "insd_max_amount", "recorder_id", "insert_time", "updater_id", "update_time", "declaration_type", "insert_timestamp", "update_timestamp", "product_version_id"],
	      "_coltypes": ["int", "str", "num", "num", "int", "dtm", "int", "dtm", "str", "dtm", "dtm", "int"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job_cate": [["0", "*"]],
	      "_key_money_id": [["4", "*"], ["30", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["6201", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["pay_mode", "int"], ["insured_status", "str"], ["age_month", "int"], ["job_cate", "int"], ["special_auth", "int"], ["money_id", "int"]]
	    }
	  },
	  "surrender_charge_rate": {
	    "6201:0:*": [0.03],
	    "6201:3:*": [0.0],
	    "_meta": {
	      "_cols": ["surrender_charge"],
	      "_coltypes": ["num"],
	      "_key_discount_type": [["*", "*"]],
	      "_key_policy_year": [["0", "3"], ["3", "999"]],
	      "_key_product_id": [["6201", "*"]],
	      "_keys": [["product_id", "int"], ["policy_year", "int"], ["discount_type", "str"]]
	    }
	  },
	  "tml_bonus_rate": {}
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    "policy": {
	        "proposal_date": "13-04-2016",
	        "proposal_start_date": "01-04-2016",
	        "pay_method": "cash",
	        "prem_freq": "5", // single premium
	        "people": [{ "name": "Insured",
	            "dob": "13-02-1972",
	            "gender": "male",
	            "job_class": 1,
	            "age": 43
	        }, { "name": "Policyholder",
	            "dob": "13-02-1972",
	            "gender": "male",
	            "age": 43,
	            "is_ph": true
	        }, { "name": "Spouse",
	            "dob": "13-12-1977",
	            "gender": "female",
	            "age": 38
	        }],
	        "products": [{ "product_id": 6201,
	            "internal_id": "MPRO",
	            "target_premium": 300000000,
	            "basic_sa": 250000000,
	            "money_id": 30,
	            "la": 0,
	            "funds": [{ "fund_code": "RF1",
	                "fund_name": "Rupiah Fund 1",
	                "allocation": 0.6
	            }, { "fund_code": "RF2",
	                "fund_name": "Rupiah Fund 2",
	                "allocation": 0.4
	            }],
	            "loadings": [{ "type": "amount", "rate": 0 }]
	        }],
	        "topups": [{ year: 10, amount: 600000 }],
	        "withdrawals": [{ year: 10, amount: 100000 }]
	    }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	                           internal_id: "MPRO",
	                           proposal_start_date: "proposal_start_date__01",
	                           age_method: "age_method__01",
	                           max_t: "cover_term__06",
	                           cover_term: "cover_term__06",
	                           cover_duration: "cover_term__06",
	                           maturity_age: "maturity_age__02",
	                           age_at_t: "age_at_t__02",
	                           entry_age: "entry_age__01",
	                           ph_entry_age: "ph_entry_age__01",
	                           coi_at_t: "coi_at_t__01",
	                           coi: "zero",
	                           monthly_cor: "zero",
	                           monthly_coi: "monthly_coi__02",
	                           basic_cost_at_t: "basic_cost_at_t__02",
	                           total_loadings: "total_loadings__01",
	                           tiv_low_at_t: ["tiv_low_at_t__02", "round_thousand_half_up"],
	                           tiv_mid_at_t: ["tiv_mid_at_t__02", "round_thousand_half_up"],
	                           tiv_high_at_t: ["tiv_high_at_t__02", "round_thousand_half_up"],
	                           atu_at_t: ["atu_at_t__01", "round_thousand_half_up"],
	                           in_at_t: ["in_at_t__01", "round_thousand_half_up"],
	                           rtu_at_t: "zero",
	                           regular_topup_at_t: "zero",
	                           tp_at_t: "zero",
	                           target_premium_at_t: "zero",
	                           sp_at_t: "sp_at_t__01",
	                           pol_fee_at_t: "pol_fee_at_t__02",
	                           //    pol_fee_after_modal_factor : "pol_fee_after_modal_factor__01",
	                           //    pol_fee_before_modal_factor : "pol_fee_before_modal_factor__01",
	                           pol_fee_after_modal_factor: "zero",
	                           pol_fee_before_modal_factor: "zero",
	                           mac_at_t: "zero",
	                           cor_at_t: "zero",
	                           total_cor_at_t: "total_cor_at_t__01",
	                           accum_cor_at_t: "accum_cor_at_t__01",
	                           withdraw_at_t: "withdrawal_at_t__01",
	                           withdrawal_at_t: ["withdrawal_at_t__01", "round_thousand_half_up"],
	                           ilp_surrender_charge_at_t: "ilp_surrender_charge_at_t__01",
	                           out_at_t: ["out_at_t__01", "round_thousand_half_up"],
	                           debt_at_t: "zero",
	                           debt_for_t: "zero",
	                           debt_paid_at_t: "zero",
	                           debt_repay_for_t: "zero",
	                           debt_accum_period: "zero",
	                           debt_repay_period: "zero",
	                           outstd_debt_at_t: "zero",
	                           accum_factor: "accum_factor__01",
	                           prem: "sp_premium__10",
	                           sa_calculated: "sa_calculated__04",
	                           ap: "sp_ap__10",
	                           apt: "zero",
	                           tpp: "zero",
	                           totprem: "zero",
	                           pol_apt: "zero",
	                           pol_tpp: "zero",
	                           db: "zero",
	                           dbg: "zero",
	                           dbng: "zero",
	                           db_low_at_t: ["db_low_at_t__10", "round_thousand_half_up"],
	                           db_mid_at_t: ["db_mid_at_t__10", "round_thousand_half_up"],
	                           db_high_at_t: ["db_high_at_t__10", "round_thousand_half_up"],
	                           dbg_at_t: ["dbg_at_t__10", "round_thousand_half_up"],
	                           tot_dbt: "zero",
	                           tb: "zero",
	                           cb: "zero",
	                           acccb: "zero",
	                           rb: "zero",
	                           accrb: "zero",
	                           sbg: "zero",
	                           accsb: "zero",
	                           accsbrate: "zero",
	                           svg: "zero",
	                           tsv: "zero",
	                           mbg: "zero",
	                           tiv: "zero",
	                           tdc: "zero",
	                           eod: "zero",
	                           validators: {
	                                                      validate_main: 'validate_main__03',
	                                                      validate_all_riders: 'validate_all_riders__01',
	                                                      validate_rider: 'validate_rider__01',
	                                                      check_sa_limit: 'check_sa_limit__02',
	                                                      check_age_limit: 'check_age_limit__01',
	                                                      validate_funds_alloc: 'validate_funds_alloc__01',
	                                                      check_fund_allocation: 'check_fund_allocation__01',
	                                                      check_min_fund_allocation: 'check_min_fund_allocation__01',
	                                                      validate_premiums: 'validate_premiums__01',
	                                                      check_ilp_tp_limit: 'check_ilp_tp_limit__01',
	                                                      check_ilp_rtu_limit: 'check_ilp_rtu_limit__01',
	                                                      check_sa_multiple: 'check_sa_multiple__01',
	                                                      check_ilp_min_rtu: 'check_ilp_min_rtu__01',
	                                                      check_prem_limit: 'check_prem_limit__01'
	                           },
	                           input: { proposal_date: 'date', contract_date: 'date', la: 'str', basic_sa: "num",
	                                                      target_premium: "num", money_id: "num",
	                                                      payment_frequency: "str", payment_method: "int" },
	                           si_colnames: ["Year", "Age", "Topup", "Withdrl", "TIV-low", "TIV-mid", "TIV-high", "Death-low", "Death-mid", "Death-high"],
	                           si_fields: ['t', 'age_at_t', 'in_at_t', "out_at_t", "tiv_low_at_t", "tiv_mid_at_t", "tiv_high_at_t", "db_low_at_t", "db_mid_at_t", "db_high_at_t"],
	                           si_colwidths: [0.05, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.1, 0.1]

	};

/***/ }
/******/ ])
});
;