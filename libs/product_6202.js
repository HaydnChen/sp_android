(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "moment"], factory);
	else if(typeof exports === 'object')
		exports["product_6202"] = factory(require("lodash"), require("moment"));
	else
		root["product_6202"] = factory(root["lodash"], root["moment"]);
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

	console.log("Product 6202 is ready...");
	var exps = { product_id: 6202, code: code, inputjson: inputjson, config: config };

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
	    "6202:0:0:9999:0:0:9999:0:0:0:0:9999:0:0:0.0:0:N:0:1": [28000, "1", 40, 75, 999, 999, 85, 999, 80, "1", 0, 999, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "1", 18, "1", 9999, 999, 0, "2016-04-21 00:00:00", "2016-04-21 00:00:00", "0", 1422],
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
	      "_key_product_id": [["6202", "*"]],
	      "_key_sa": [["0.0", "9.99999999999e+11"]],
	      "_key_special_auth": [["1", "*"]],
	      "_keys": [["product_id", "int"], ["charge_period", "str"], ["charge_year", "int"], ["charge_year_max", "int"], ["coverage_period", "str"], ["coverage_year", "int"], ["coverage_year_max", "int"], ["pay_period", "str"], ["pay_year", "int"], ["end_period", "str"], ["end_year", "int"], ["end_year_max", "int"], ["pay_ensure", "int"], ["charge_type", "str"], ["sa", "num"], ["pay_mode", "int"], ["gender", "str"], ["insured_status", "str"], ["special_auth", "int"]]
	    }
	  },
	  "benefit_level": {
	    "6202:1": ["Plan 350", 20000.0],
	    "6202:2": ["Plan 500", 25000.0],
	    "6202:3": ["Plan 750", 30000.0],
	    "6202:4": ["Plan 1500", 50000.0],
	    "6202:5": ["Plan 2000", 75000.0],
	    "6202:6": ["Plan 3750", 150000.0],
	    "6202:7": ["Plan 5000", 200000.0],
	    "_meta": {
	      "_cols": ["level_desc", "level_amount"],
	      "_coltypes": ["str", "num"],
	      "_key_level": [["1", "*"], ["2", "*"], ["3", "*"], ["4", "*"], ["5", "*"], ["6", "*"], ["7", "*"]],
	      "_key_product_id": [["6202", "*"]],
	      "_keys": [["product_id", "int"], ["level", "str"]]
	    }
	  },
	  "cash_bonus_rate": {},
	  "cash_value": {},
	  "liability_config": {},
	  "model_factor": {
	    "6202:*:1:1:*": [1.0],
	    "6202:*:4:1:*": [0.095],
	    "_meta": {
	      "_cols": ["charge_rate"],
	      "_coltypes": ["num"],
	      "_key_charge_type": [["1", "*"], ["4", "*"]],
	      "_key_master_id": [["*", "*"]],
	      "_key_model_type": [["1", "*"]],
	      "_key_pay_mode": [["*", "*"]],
	      "_key_product_id": [["6202", "*"]],
	      "_keys": [["product_id", "int"], ["master_id", "int"], ["charge_type", "str"], ["model_type", "int"], ["pay_mode", "int"]]
	    }
	  },
	  "pay_liability": {},
	  "prem_limit": {},
	  "premium_ratecash_benefit": {
	    "6202:F:40:1": [12214200.0],
	    "6202:F:40:2": [16931400.0],
	    "6202:F:40:3": [25397100.0],
	    "6202:F:40:4": [50793800.0],
	    "6202:F:40:5": [67725100.0],
	    "6202:F:40:6": [125700200.0],
	    "6202:F:40:7": [169312000.0],
	    "6202:F:41:1": [12214200.0],
	    "6202:F:41:2": [16931400.0],
	    "6202:F:41:3": [25397100.0],
	    "6202:F:41:4": [50793800.0],
	    "6202:F:41:5": [67725100.0],
	    "6202:F:41:6": [125700200.0],
	    "6202:F:41:7": [169312000.0],
	    "6202:F:42:1": [12214200.0],
	    "6202:F:42:2": [16931400.0],
	    "6202:F:42:3": [25397100.0],
	    "6202:F:42:4": [50793800.0],
	    "6202:F:42:5": [67725100.0],
	    "6202:F:42:6": [125700200.0],
	    "6202:F:42:7": [169312000.0],
	    "6202:F:43:1": [12214200.0],
	    "6202:F:43:2": [16931400.0],
	    "6202:F:43:3": [25397100.0],
	    "6202:F:43:4": [50793800.0],
	    "6202:F:43:5": [67725100.0],
	    "6202:F:43:6": [125700200.0],
	    "6202:F:43:7": [169312000.0],
	    "6202:F:44:1": [12214200.0],
	    "6202:F:44:2": [16931400.0],
	    "6202:F:44:3": [25397100.0],
	    "6202:F:44:4": [50793800.0],
	    "6202:F:44:5": [67725100.0],
	    "6202:F:44:6": [125700200.0],
	    "6202:F:44:7": [169312000.0],
	    "6202:F:45:1": [12214200.0],
	    "6202:F:45:2": [16931400.0],
	    "6202:F:45:3": [25397100.0],
	    "6202:F:45:4": [50793800.0],
	    "6202:F:45:5": [67725100.0],
	    "6202:F:45:6": [125700200.0],
	    "6202:F:45:7": [169312000.0],
	    "6202:F:46:1": [12214200.0],
	    "6202:F:46:2": [16931400.0],
	    "6202:F:46:3": [25397100.0],
	    "6202:F:46:4": [50793800.0],
	    "6202:F:46:5": [67725100.0],
	    "6202:F:46:6": [125700200.0],
	    "6202:F:46:7": [169312000.0],
	    "6202:F:47:1": [12214200.0],
	    "6202:F:47:2": [16931400.0],
	    "6202:F:47:3": [25397100.0],
	    "6202:F:47:4": [50793800.0],
	    "6202:F:47:5": [67725100.0],
	    "6202:F:47:6": [125700200.0],
	    "6202:F:47:7": [169312000.0],
	    "6202:F:48:1": [12214200.0],
	    "6202:F:48:2": [16931400.0],
	    "6202:F:48:3": [25397100.0],
	    "6202:F:48:4": [50793800.0],
	    "6202:F:48:5": [67725100.0],
	    "6202:F:48:6": [125700200.0],
	    "6202:F:48:7": [169312000.0],
	    "6202:F:49:1": [12214200.0],
	    "6202:F:49:2": [16931400.0],
	    "6202:F:49:3": [25397100.0],
	    "6202:F:49:4": [50793800.0],
	    "6202:F:49:5": [67725100.0],
	    "6202:F:49:6": [125700200.0],
	    "6202:F:49:7": [169312000.0],
	    "6202:F:50:1": [12214200.0],
	    "6202:F:50:2": [16931400.0],
	    "6202:F:50:3": [25397100.0],
	    "6202:F:50:4": [50793800.0],
	    "6202:F:50:5": [67725100.0],
	    "6202:F:50:6": [125700200.0],
	    "6202:F:50:7": [169312000.0],
	    "6202:F:51:1": [12214200.0],
	    "6202:F:51:2": [16931400.0],
	    "6202:F:51:3": [25397100.0],
	    "6202:F:51:4": [50793800.0],
	    "6202:F:51:5": [67725100.0],
	    "6202:F:51:6": [125700200.0],
	    "6202:F:51:7": [169312000.0],
	    "6202:F:52:1": [12214200.0],
	    "6202:F:52:2": [16931400.0],
	    "6202:F:52:3": [25397100.0],
	    "6202:F:52:4": [50793800.0],
	    "6202:F:52:5": [67725100.0],
	    "6202:F:52:6": [125700200.0],
	    "6202:F:52:7": [169312000.0],
	    "6202:F:53:1": [12214200.0],
	    "6202:F:53:2": [16931400.0],
	    "6202:F:53:3": [25397100.0],
	    "6202:F:53:4": [50793800.0],
	    "6202:F:53:5": [67725100.0],
	    "6202:F:53:6": [125700200.0],
	    "6202:F:53:7": [169312000.0],
	    "6202:F:54:1": [12214200.0],
	    "6202:F:54:2": [16931400.0],
	    "6202:F:54:3": [25397100.0],
	    "6202:F:54:4": [50793800.0],
	    "6202:F:54:5": [67725100.0],
	    "6202:F:54:6": [125700200.0],
	    "6202:F:54:7": [169312000.0],
	    "6202:F:55:1": [12214200.0],
	    "6202:F:55:2": [16931400.0],
	    "6202:F:55:3": [25397100.0],
	    "6202:F:55:4": [50793800.0],
	    "6202:F:55:5": [67725100.0],
	    "6202:F:55:6": [125700200.0],
	    "6202:F:55:7": [169312000.0],
	    "6202:F:56:1": [13994000.0],
	    "6202:F:56:2": [19385700.0],
	    "6202:F:56:3": [29078300.0],
	    "6202:F:56:4": [58156400.0],
	    "6202:F:56:5": [77541900.0],
	    "6202:F:56:6": [144106600.0],
	    "6202:F:56:7": [193854300.0],
	    "6202:F:57:1": [13994000.0],
	    "6202:F:57:2": [19385700.0],
	    "6202:F:57:3": [29078300.0],
	    "6202:F:57:4": [58156400.0],
	    "6202:F:57:5": [77541900.0],
	    "6202:F:57:6": [144106600.0],
	    "6202:F:57:7": [193854300.0],
	    "6202:F:58:1": [13994000.0],
	    "6202:F:58:2": [19385700.0],
	    "6202:F:58:3": [29078300.0],
	    "6202:F:58:4": [58156400.0],
	    "6202:F:58:5": [77541900.0],
	    "6202:F:58:6": [144106600.0],
	    "6202:F:58:7": [193854300.0],
	    "6202:F:59:1": [13994000.0],
	    "6202:F:59:2": [19385700.0],
	    "6202:F:59:3": [29078300.0],
	    "6202:F:59:4": [58156400.0],
	    "6202:F:59:5": [77541900.0],
	    "6202:F:59:6": [144106600.0],
	    "6202:F:59:7": [193854300.0],
	    "6202:F:60:1": [13994000.0],
	    "6202:F:60:2": [19385700.0],
	    "6202:F:60:3": [29078300.0],
	    "6202:F:60:4": [58156400.0],
	    "6202:F:60:5": [77541900.0],
	    "6202:F:60:6": [144106600.0],
	    "6202:F:60:7": [193854300.0],
	    "6202:F:61:1": [15890500.0],
	    "6202:F:61:2": [22000900.0],
	    "6202:F:61:3": [33001100.0],
	    "6202:F:61:4": [66001900.0],
	    "6202:F:61:5": [88002500.0],
	    "6202:F:61:6": [163720500.0],
	    "6202:F:61:7": [220005700.0],
	    "6202:F:62:1": [15890500.0],
	    "6202:F:62:2": [22000900.0],
	    "6202:F:62:3": [33001100.0],
	    "6202:F:62:4": [66001900.0],
	    "6202:F:62:5": [88002500.0],
	    "6202:F:62:6": [163720500.0],
	    "6202:F:62:7": [220005700.0],
	    "6202:F:63:1": [15890500.0],
	    "6202:F:63:2": [22000900.0],
	    "6202:F:63:3": [33001100.0],
	    "6202:F:63:4": [66001900.0],
	    "6202:F:63:5": [88002500.0],
	    "6202:F:63:6": [163720500.0],
	    "6202:F:63:7": [220005700.0],
	    "6202:F:64:1": [15890500.0],
	    "6202:F:64:2": [22000900.0],
	    "6202:F:64:3": [33001100.0],
	    "6202:F:64:4": [66001900.0],
	    "6202:F:64:5": [88002500.0],
	    "6202:F:64:6": [163720500.0],
	    "6202:F:64:7": [220005700.0],
	    "6202:F:65:1": [15890500.0],
	    "6202:F:65:2": [22000900.0],
	    "6202:F:65:3": [33001100.0],
	    "6202:F:65:4": [66001900.0],
	    "6202:F:65:5": [88002500.0],
	    "6202:F:65:6": [163720500.0],
	    "6202:F:65:7": [220005700.0],
	    "6202:F:66:1": [17903800.0],
	    "6202:F:66:2": [24776800.0],
	    "6202:F:66:3": [37165300.0],
	    "6202:F:66:4": [74330100.0],
	    "6202:F:66:5": [99106700.0],
	    "6202:F:66:6": [184540900.0],
	    "6202:F:66:7": [247766500.0],
	    "6202:F:67:1": [17903800.0],
	    "6202:F:67:2": [24776800.0],
	    "6202:F:67:3": [37165300.0],
	    "6202:F:67:4": [74330100.0],
	    "6202:F:67:5": [99106700.0],
	    "6202:F:67:6": [184540900.0],
	    "6202:F:67:7": [247766500.0],
	    "6202:F:68:1": [17903800.0],
	    "6202:F:68:2": [24776800.0],
	    "6202:F:68:3": [37165300.0],
	    "6202:F:68:4": [74330100.0],
	    "6202:F:68:5": [99106700.0],
	    "6202:F:68:6": [184540900.0],
	    "6202:F:68:7": [247766500.0],
	    "6202:F:69:1": [17903800.0],
	    "6202:F:69:2": [24776800.0],
	    "6202:F:69:3": [37165300.0],
	    "6202:F:69:4": [74330100.0],
	    "6202:F:69:5": [99106700.0],
	    "6202:F:69:6": [184540900.0],
	    "6202:F:69:7": [247766500.0],
	    "6202:F:70:1": [17903800.0],
	    "6202:F:70:2": [24776800.0],
	    "6202:F:70:3": [37165300.0],
	    "6202:F:70:4": [74330100.0],
	    "6202:F:70:5": [99106700.0],
	    "6202:F:70:6": [184540900.0],
	    "6202:F:70:7": [247766500.0],
	    "6202:F:71:1": [20033700.0],
	    "6202:F:71:2": [27713700.0],
	    "6202:F:71:3": [41570600.0],
	    "6202:F:71:4": [83141000.0],
	    "6202:F:71:5": [110854600.0],
	    "6202:F:71:6": [206568400.0],
	    "6202:F:71:7": [277136500.0],
	    "6202:F:72:1": [20033700.0],
	    "6202:F:72:2": [27713700.0],
	    "6202:F:72:3": [41570600.0],
	    "6202:F:72:4": [83141000.0],
	    "6202:F:72:5": [110854600.0],
	    "6202:F:72:6": [206568400.0],
	    "6202:F:72:7": [277136500.0],
	    "6202:F:73:1": [20033700.0],
	    "6202:F:73:2": [27713700.0],
	    "6202:F:73:3": [41570600.0],
	    "6202:F:73:4": [83141000.0],
	    "6202:F:73:5": [110854600.0],
	    "6202:F:73:6": [206568400.0],
	    "6202:F:73:7": [277136500.0],
	    "6202:F:74:1": [20033700.0],
	    "6202:F:74:2": [27713700.0],
	    "6202:F:74:3": [41570600.0],
	    "6202:F:74:4": [83141000.0],
	    "6202:F:74:5": [110854600.0],
	    "6202:F:74:6": [206568400.0],
	    "6202:F:74:7": [277136500.0],
	    "6202:F:75:1": [20033700.0],
	    "6202:F:75:2": [27713700.0],
	    "6202:F:75:3": [41570600.0],
	    "6202:F:75:4": [83141000.0],
	    "6202:F:75:5": [110854600.0],
	    "6202:F:75:6": [206568400.0],
	    "6202:F:75:7": [277136500.0],
	    "6202:M:40:1": [11103800.0],
	    "6202:M:40:2": [15392200.0],
	    "6202:M:40:3": [23088300.0],
	    "6202:M:40:4": [46176200.0],
	    "6202:M:40:5": [61568300.0],
	    "6202:M:40:6": [114272900.0],
	    "6202:M:40:7": [153920000.0],
	    "6202:M:41:1": [11103800.0],
	    "6202:M:41:2": [15392200.0],
	    "6202:M:41:3": [23088300.0],
	    "6202:M:41:4": [46176200.0],
	    "6202:M:41:5": [61568300.0],
	    "6202:M:41:6": [114272900.0],
	    "6202:M:41:7": [153920000.0],
	    "6202:M:42:1": [11103800.0],
	    "6202:M:42:2": [15392200.0],
	    "6202:M:42:3": [23088300.0],
	    "6202:M:42:4": [46176200.0],
	    "6202:M:42:5": [61568300.0],
	    "6202:M:42:6": [114272900.0],
	    "6202:M:42:7": [153920000.0],
	    "6202:M:43:1": [11103800.0],
	    "6202:M:43:2": [15392200.0],
	    "6202:M:43:3": [23088300.0],
	    "6202:M:43:4": [46176200.0],
	    "6202:M:43:5": [61568300.0],
	    "6202:M:43:6": [114272900.0],
	    "6202:M:43:7": [153920000.0],
	    "6202:M:44:1": [11103800.0],
	    "6202:M:44:2": [15392200.0],
	    "6202:M:44:3": [23088300.0],
	    "6202:M:44:4": [46176200.0],
	    "6202:M:44:5": [61568300.0],
	    "6202:M:44:6": [114272900.0],
	    "6202:M:44:7": [153920000.0],
	    "6202:M:45:1": [11103800.0],
	    "6202:M:45:2": [15392200.0],
	    "6202:M:45:3": [23088300.0],
	    "6202:M:45:4": [46176200.0],
	    "6202:M:45:5": [61568300.0],
	    "6202:M:45:6": [114272900.0],
	    "6202:M:45:7": [153920000.0],
	    "6202:M:46:1": [11103800.0],
	    "6202:M:46:2": [15392200.0],
	    "6202:M:46:3": [23088300.0],
	    "6202:M:46:4": [46176200.0],
	    "6202:M:46:5": [61568300.0],
	    "6202:M:46:6": [114272900.0],
	    "6202:M:46:7": [153920000.0],
	    "6202:M:47:1": [11103800.0],
	    "6202:M:47:2": [15392200.0],
	    "6202:M:47:3": [23088300.0],
	    "6202:M:47:4": [46176200.0],
	    "6202:M:47:5": [61568300.0],
	    "6202:M:47:6": [114272900.0],
	    "6202:M:47:7": [153920000.0],
	    "6202:M:48:1": [11103800.0],
	    "6202:M:48:2": [15392200.0],
	    "6202:M:48:3": [23088300.0],
	    "6202:M:48:4": [46176200.0],
	    "6202:M:48:5": [61568300.0],
	    "6202:M:48:6": [114272900.0],
	    "6202:M:48:7": [153920000.0],
	    "6202:M:49:1": [11103800.0],
	    "6202:M:49:2": [15392200.0],
	    "6202:M:49:3": [23088300.0],
	    "6202:M:49:4": [46176200.0],
	    "6202:M:49:5": [61568300.0],
	    "6202:M:49:6": [114272900.0],
	    "6202:M:49:7": [153920000.0],
	    "6202:M:50:1": [11103800.0],
	    "6202:M:50:2": [15392200.0],
	    "6202:M:50:3": [23088300.0],
	    "6202:M:50:4": [46176200.0],
	    "6202:M:50:5": [61568300.0],
	    "6202:M:50:6": [114272900.0],
	    "6202:M:50:7": [153920000.0],
	    "6202:M:51:1": [11103800.0],
	    "6202:M:51:2": [15392200.0],
	    "6202:M:51:3": [23088300.0],
	    "6202:M:51:4": [46176200.0],
	    "6202:M:51:5": [61568300.0],
	    "6202:M:51:6": [114272900.0],
	    "6202:M:51:7": [153920000.0],
	    "6202:M:52:1": [11103800.0],
	    "6202:M:52:2": [15392200.0],
	    "6202:M:52:3": [23088300.0],
	    "6202:M:52:4": [46176200.0],
	    "6202:M:52:5": [61568300.0],
	    "6202:M:52:6": [114272900.0],
	    "6202:M:52:7": [153920000.0],
	    "6202:M:53:1": [11103800.0],
	    "6202:M:53:2": [15392200.0],
	    "6202:M:53:3": [23088300.0],
	    "6202:M:53:4": [46176200.0],
	    "6202:M:53:5": [61568300.0],
	    "6202:M:53:6": [114272900.0],
	    "6202:M:53:7": [153920000.0],
	    "6202:M:54:1": [11103800.0],
	    "6202:M:54:2": [15392200.0],
	    "6202:M:54:3": [23088300.0],
	    "6202:M:54:4": [46176200.0],
	    "6202:M:54:5": [61568300.0],
	    "6202:M:54:6": [114272900.0],
	    "6202:M:54:7": [153920000.0],
	    "6202:M:55:1": [11103800.0],
	    "6202:M:55:2": [15392200.0],
	    "6202:M:55:3": [23088300.0],
	    "6202:M:55:4": [46176200.0],
	    "6202:M:55:5": [61568300.0],
	    "6202:M:55:6": [114272900.0],
	    "6202:M:55:7": [153920000.0],
	    "6202:M:56:1": [12721800.0],
	    "6202:M:56:2": [17623400.0],
	    "6202:M:56:3": [26434800.0],
	    "6202:M:56:4": [52869500.0],
	    "6202:M:56:5": [70492600.0],
	    "6202:M:56:6": [131006000.0],
	    "6202:M:56:7": [176231200.0],
	    "6202:M:57:1": [12721800.0],
	    "6202:M:57:2": [17623400.0],
	    "6202:M:57:3": [26434800.0],
	    "6202:M:57:4": [52869500.0],
	    "6202:M:57:5": [70492600.0],
	    "6202:M:57:6": [131006000.0],
	    "6202:M:57:7": [176231200.0],
	    "6202:M:58:1": [12721800.0],
	    "6202:M:58:2": [17623400.0],
	    "6202:M:58:3": [26434800.0],
	    "6202:M:58:4": [52869500.0],
	    "6202:M:58:5": [70492600.0],
	    "6202:M:58:6": [131006000.0],
	    "6202:M:58:7": [176231200.0],
	    "6202:M:59:1": [12721800.0],
	    "6202:M:59:2": [17623400.0],
	    "6202:M:59:3": [26434800.0],
	    "6202:M:59:4": [52869500.0],
	    "6202:M:59:5": [70492600.0],
	    "6202:M:59:6": [131006000.0],
	    "6202:M:59:7": [176231200.0],
	    "6202:M:60:1": [12721800.0],
	    "6202:M:60:2": [17623400.0],
	    "6202:M:60:3": [26434800.0],
	    "6202:M:60:4": [52869500.0],
	    "6202:M:60:5": [70492600.0],
	    "6202:M:60:6": [131006000.0],
	    "6202:M:60:7": [176231200.0],
	    "6202:M:61:1": [14445900.0],
	    "6202:M:61:2": [20000800.0],
	    "6202:M:61:3": [30001000.0],
	    "6202:M:61:4": [60001700.0],
	    "6202:M:61:5": [80002300.0],
	    "6202:M:61:6": [148836800.0],
	    "6202:M:61:7": [200005200.0],
	    "6202:M:62:1": [14445900.0],
	    "6202:M:62:2": [20000800.0],
	    "6202:M:62:3": [30001000.0],
	    "6202:M:62:4": [60001700.0],
	    "6202:M:62:5": [80002300.0],
	    "6202:M:62:6": [148836800.0],
	    "6202:M:62:7": [200005200.0],
	    "6202:M:63:1": [14445900.0],
	    "6202:M:63:2": [20000800.0],
	    "6202:M:63:3": [30001000.0],
	    "6202:M:63:4": [60001700.0],
	    "6202:M:63:5": [80002300.0],
	    "6202:M:63:6": [148836800.0],
	    "6202:M:63:7": [200005200.0],
	    "6202:M:64:1": [14445900.0],
	    "6202:M:64:2": [20000800.0],
	    "6202:M:64:3": [30001000.0],
	    "6202:M:64:4": [60001700.0],
	    "6202:M:64:5": [80002300.0],
	    "6202:M:64:6": [148836800.0],
	    "6202:M:64:7": [200005200.0],
	    "6202:M:65:1": [14445900.0],
	    "6202:M:65:2": [20000800.0],
	    "6202:M:65:3": [30001000.0],
	    "6202:M:65:4": [60001700.0],
	    "6202:M:65:5": [80002300.0],
	    "6202:M:65:6": [148836800.0],
	    "6202:M:65:7": [200005200.0],
	    "6202:M:66:1": [16276200.0],
	    "6202:M:66:2": [22524400.0],
	    "6202:M:66:3": [33786600.0],
	    "6202:M:66:4": [67572800.0],
	    "6202:M:66:5": [90097000.0],
	    "6202:M:66:6": [167764500.0],
	    "6202:M:66:7": [225242300.0],
	    "6202:M:67:1": [16276200.0],
	    "6202:M:67:2": [22524400.0],
	    "6202:M:67:3": [33786600.0],
	    "6202:M:67:4": [67572800.0],
	    "6202:M:67:5": [90097000.0],
	    "6202:M:67:6": [167764500.0],
	    "6202:M:67:7": [225242300.0],
	    "6202:M:68:1": [16276200.0],
	    "6202:M:68:2": [22524400.0],
	    "6202:M:68:3": [33786600.0],
	    "6202:M:68:4": [67572800.0],
	    "6202:M:68:5": [90097000.0],
	    "6202:M:68:6": [167764500.0],
	    "6202:M:68:7": [225242300.0],
	    "6202:M:69:1": [16276200.0],
	    "6202:M:69:2": [22524400.0],
	    "6202:M:69:3": [33786600.0],
	    "6202:M:69:4": [67572800.0],
	    "6202:M:69:5": [90097000.0],
	    "6202:M:69:6": [167764500.0],
	    "6202:M:69:7": [225242300.0],
	    "6202:M:70:1": [16276200.0],
	    "6202:M:70:2": [22524400.0],
	    "6202:M:70:3": [33786600.0],
	    "6202:M:70:4": [67572800.0],
	    "6202:M:70:5": [90097000.0],
	    "6202:M:70:6": [167764500.0],
	    "6202:M:70:7": [225242300.0],
	    "6202:M:71:1": [18212500.0],
	    "6202:M:71:2": [25194300.0],
	    "6202:M:71:3": [37791500.0],
	    "6202:M:71:4": [75582700.0],
	    "6202:M:71:5": [100776900.0],
	    "6202:M:71:6": [187789500.0],
	    "6202:M:71:7": [251942300.0],
	    "6202:M:72:1": [18212500.0],
	    "6202:M:72:2": [25194300.0],
	    "6202:M:72:3": [37791500.0],
	    "6202:M:72:4": [75582700.0],
	    "6202:M:72:5": [100776900.0],
	    "6202:M:72:6": [187789500.0],
	    "6202:M:72:7": [251942300.0],
	    "6202:M:73:1": [18212500.0],
	    "6202:M:73:2": [25194300.0],
	    "6202:M:73:3": [37791500.0],
	    "6202:M:73:4": [75582700.0],
	    "6202:M:73:5": [100776900.0],
	    "6202:M:73:6": [187789500.0],
	    "6202:M:73:7": [251942300.0],
	    "6202:M:74:1": [18212500.0],
	    "6202:M:74:2": [25194300.0],
	    "6202:M:74:3": [37791500.0],
	    "6202:M:74:4": [75582700.0],
	    "6202:M:74:5": [100776900.0],
	    "6202:M:74:6": [187789500.0],
	    "6202:M:74:7": [251942300.0],
	    "6202:M:75:1": [18212500.0],
	    "6202:M:75:2": [25194300.0],
	    "6202:M:75:3": [37791500.0],
	    "6202:M:75:4": [75582700.0],
	    "6202:M:75:5": [100776900.0],
	    "6202:M:75:6": [187789500.0],
	    "6202:M:75:7": [251942300.0],
	    "_meta": {
	      "_cols": ["premium_rate"],
	      "_coltypes": ["num"],
	      "_key_age": [["65", "*"], ["66", "*"], ["67", "*"], ["68", "*"], ["69", "*"], ["70", "*"], ["71", "*"], ["72", "*"], ["73", "*"], ["74", "*"], ["40", "*"], ["41", "*"], ["42", "*"], ["43", "*"], ["44", "*"], ["45", "*"], ["46", "*"], ["47", "*"], ["48", "*"], ["49", "*"], ["50", "*"], ["51", "*"], ["52", "*"], ["53", "*"], ["54", "*"], ["55", "*"], ["56", "*"], ["57", "*"], ["58", "*"], ["59", "*"], ["60", "*"], ["61", "*"], ["62", "*"], ["63", "*"], ["64", "*"], ["75", "*"]],
	      "_key_benefit_level": [["1", "*"], ["2", "*"], ["3", "*"], ["4", "*"], ["5", "*"], ["6", "*"], ["7", "*"]],
	      "_key_gender": [["F", "*"], ["M", "*"]],
	      "_key_product_id": [["6202", "*"]],
	      "_keys": [["product_id", "int"], ["gender", "str"], ["age", "int"], ["benefit_level", "str"]]
	    }
	  },
	  "prod_fund_prem_limit": {},
	  "product_allowables": {
	    "attachable_riders": [[], ["int", "str", "str", "str"], ["attach_id", "attach_type", "attach_compulsory", "gender"]],
	    "bonus_options": [[], ["str"], ["mode_id"]],
	    "coverage_terms": [[["2", 1], ["2", 2], ["2", 3], ["2", 4], ["2", 5], ["2", 6], ["2", 7], ["2", 8], ["2", 9], ["2", 10], ["2", 11], ["2", 12], ["2", 13], ["2", 14], ["2", 15], ["2", 16], ["2", 17], ["2", 18], ["2", 19], ["2", 20], ["3", 85]], ["str", "int"], ["coverage_period", "coverage_year"]],
	    "currencies": [[[4], [30]], ["int"], ["money_id"]],
	    "funds": [[], ["str"], ["fund_code"]],
	    "organizations": [[[101]], ["int"], ["organ_id"]],
	    "pay_methods": [[["4", "0", 9]], ["str", "str", "int"], ["charge_type", "prem_sequen", "pay_mode"]],
	    "payment_freq": [[["1"], ["4"]], ["str"], ["charge_type"]],
	    "premium_terms": [[["2", 1], ["2", 2], ["2", 3], ["2", 4], ["2", 5], ["2", 6], ["2", 7], ["2", 8], ["2", 9], ["2", 10], ["2", 11], ["2", 12], ["2", 13], ["2", 14], ["2", 15], ["2", 16], ["2", 17], ["2", 18], ["2", 19], ["2", 20], ["3", 85]], ["str", "int"], ["charge_period", "charge_year"]],
	    "qualifications": [[[2]], ["int"], ["test_type_id"]],
	    "strategies": [[["0", 0]], ["str", "int"], ["strategy_code", "tariff_type"]],
	    "survival_options": [[], ["str"], ["survival_option"]]
	  },
	  "product_charge_list": {},
	  "product_currency": {
	    "6202:101:30:2": [401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "EBAO1001", "2016-04-21 00:00:00", "2016-04-21 00:00:00"],
	    "6202:101:4:2": [401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "EBAO1001", "2016-04-21 00:00:00", "2016-04-21 00:00:00"],
	    "_meta": {
	      "_cols": ["recorder_id", "insert_time", "updater_id", "update_time", "entity_fund", "insert_timestamp", "update_timestamp"],
	      "_coltypes": ["int", "dtm", "int", "dtm", "str", "dtm", "dtm"],
	      "_key_entity_fund_type": [["2", "*"]],
	      "_key_money_id": [["4", "*"], ["30", "*"]],
	      "_key_organ_id": [["101", "*"]],
	      "_key_product_id": [["6202", "*"]],
	      "_keys": [["product_id", "int"], ["organ_id", "int"], ["money_id", "int"], ["entity_fund_type", "str"]]
	    }
	  },
	  "product_fund": {},
	  "product_life": {
	    "6202": [1, "Hospital Cash Plan", "HCP", "HCP", "", "3", "2", "0", "1", "N", "", "2000-01-01 00:00:00", "", 0.0, 0.0, 0.0, 9999, 9999999999.0, "Y", "", "N", "N", "", "23", "0", "3", "0", 0.0, "Y", "", 0.0, "N", "H1", "1", "1", "2", "", "1", "N", "Y", "N", "Y", 0, 401, "2016-04-26 11:34:34", "", 0, "0", "N", "", "1", "N", "N", 30, "0", "0", "8", "2", "4", "N", "N", "N", "N", 9999, "1", 9999, 9999, 0.0, 0.0, 0, 99, "", "Pro Senior Health - Hospital Cash Plan", "N", 9999999999.0, "0", "N", "N", "1", "N", "N", "N", "Y", "2000-01-01 00:00:00", 12, "N", 0.0, "N", "0", "N", "N", "N", "N", "N", 0, "N", "N", "N", 0.0, "N", "N", 0, 0.0, 0, "N", "N", "Y", "N", "4", "N", "N", "1", 0, "N", "", 0, "2", "0", "N", 0, 0, 0, "N", 0, "0", "0", "", "2", "0", "2", "N", "N", "N", 0.0, "Y", "N", "5", 0, "N", "N", 0.0, 0.0, "0", "N", "N", 0, "", "N", "0", "9", "N", 0, 0, 0, 0, "N", "N", "N", "N", 0, "N", "N", 0, "N", "N", 0, "N", "0", 1.0, 1, 0, 0, 0, "2016-04-21 00:00:00", "2016-04-26 11:34:34", "2016-04-21 00:00:00", "2016-04-21 00:00:00", 401, 401, "", 0.0, 0.0, "", "", "", "", 0, "", "", "", 0, "", "", 0, "", 0, 0, "", 0.0, "", 0, 0.0, 0, 0.0, 0.0, 0, "", "", "", "", 0, "", "", 0, "", "", 1, 1, 1e+16, 1, 0.0, 1e+16],
	    "_meta": {
	      "_cols": ["organ_id", "product_name", "product_abbr", "internal_id", "hospital_type", "unit_flag", "ins_type", "ally", "individual_group", "value", "exception", "start_date", "end_date", "life_rate", "sudden_rate", "ill_rate", "em", "check_amount", "pregnant_insured", "underwrite_class", "attachable", "insure_month", "duty", "benefit_type", "target_type", "period_type", "underwrite_job", "actuary_rate", "table_prem", "ss_claim_formula", "min_claim_amount", "mortagage", "initial_id", "section_cal_type", "period_cal_type", "age_base", "bonus_cal_type", "premium_define", "regu_to_single", "sa_accum", "universal_prem", "checked", "insert_person", "updater_id", "update_time", "sys_lock_time", "sys_locker_id", "sys_lock_status", "pseudo", "policyholder", "prem_table", "comm_amount", "uw_manual", "base_money", "gst_indicator", "stamp_indicator", "plan_type", "age_method", "rn_date_type", "follow_discnt", "defer_period", "waiver", "waiver_benefit", "max_switch_times", "switch_period_unit", "max_swit_in_times", "max_swit_out_times", "min_sur_value", "min_remain_value", "min_defer_period", "max_defer_period", "product_name_2", "feature_desc", "payer_wop", "max_waiv_prem_ann", "gurnt_period_type", "receipt_indi", "full_declare", "ph_la_relation", "hth_full_declare", "advan_program", "uw_jet", "backdate_indi", "start_backdate", "backdate_period", "postdate_indi", "max_comp_commi", "dopp_indi", "policy_section", "conversion_priv", "purc_new_pol", "la_change", "stand_alone_rider", "partial_withdraw", "invest_delay", "cash_bonus_indi", "rev_bonus_indi", "tml_bonus_indi", "tml_bonus_int_rate", "bereavement_indi", "stand_life_indi", "non_lap_period", "switch_fee", "free_switch_times", "incr_prem_permit", "surr_charge_indi", "special_discnt", "apilp_indi", "backdate_unit", "topup_permit", "reg_topup_permit", "gurnt_period_unit", "gurnt_period", "hi_pol_fee_indi", "free_switch_unit", "free_switch_period", "par_non_ilp", "stampduty_option", "ladr_indi", "bonus_vest_year_clm", "bonus_vest_year_surr", "cb_vest_year", "is_net_invest", "gsv_vest_year", "phd_rate_cate", "ri_calc_basis", "ri_calc_formula", "ri_renewal_freq", "ri_factor_table_code", "ri_age_base", "asset_share", "gja_indi", "gsc_indi", "apilp_k", "uptoage_indi", "spouse_prod_indi", "benefit_freq_indi", "risk_aggr_formula", "prem_change_notice", "aurp_specific_terms", "waiver_interest_rate", "db_base_clm", "bucket_filling_option", "follow_commision", "formula_driven", "value_unit_amount", "value_cal_type", "comm_start_dd_indi", "fin_prod_indicator", "ra_object", "reg_part_witdr_per", "bucket_fill_option_ad", "pld_grace_period", "lapse_method", "free_witdr_times", "spouse_waiver", "pers_annu_tax_term", "full_prepayment", "self_confirm", "wait_days_af_lapse", "editable", "has_flexible_period", "flexible_period", "first_of_month", "indx_indi", "indx_year", "auto_backdate_indi", "family_type", "model_factor_rate_an", "invest_delay_option", "lock_in_period_option", "lock_in_period", "invest_freelook_option", "insert_timestamp", "update_timestamp", "insert_date", "insert_time", "updated_by", "inserted_by", "add_permit", "admin_charge", "annuity_surr_fac", "apl_permit", "assignment_indi", "auto_reduce_paidup", "auto_reinstmt_indi", "auto_reinstmt_period", "bonus_encash", "decrease_permit", "eta_permit", "eta_product_id", "free_look_follow", "free_look_indi", "free_look_period", "grace_follow", "grace_period", "grace_period_add", "loan_permit", "max_loan_rate", "max_reins_peri_unit", "max_reins_period", "min_add_amount", "min_add_units", "min_loan_amt", "min_sur_amount", "min_sur_units", "overdue_int_indi", "permit_prs", "prefer_life_indi", "prem_vouch_permit", "prem_vouch_rate", "reduce_paidup", "renew", "rup_product_id", "special_revival_permit", "surr_permit", "topup_start_year", "partial_withdraw_start_year", "max_sur_value", "reg_part_witdr_start_year", "reg_part_witdr_min_amount", "reg_part_witdr_max_amount"],
	      "_coltypes": ["int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "dtm", "num", "num", "num", "int", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "int", "dtm", "dtm", "int", "str", "str", "str", "str", "str", "str", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "int", "int", "num", "num", "int", "int", "str", "str", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "int", "str", "num", "str", "str", "str", "str", "str", "str", "str", "int", "str", "str", "str", "num", "str", "str", "int", "num", "int", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "str", "int", "str", "str", "str", "int", "int", "int", "str", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "str", "int", "str", "str", "num", "num", "str", "str", "str", "int", "str", "str", "str", "str", "str", "int", "int", "int", "int", "str", "str", "str", "str", "int", "str", "str", "int", "str", "str", "int", "str", "str", "num", "int", "int", "int", "int", "dtm", "dtm", "dtm", "dtm", "int", "int", "str", "num", "num", "str", "str", "str", "str", "int", "str", "str", "str", "int", "str", "str", "int", "str", "int", "int", "str", "num", "str", "int", "num", "int", "num", "num", "int", "str", "str", "str", "str", "int", "str", "str", "int", "str", "str", "int", "int", "num", "int", "num", "num"],
	      "_key_product_id": [["6202", "*"]],
	      "_keys": [["product_id", "int"]]
	    }
	  },
	  "product_sa_limit": {
	    "6202:0:*:*:0:0:0": [20000.0, 500000.0, 0, 99999, 0, 99999],
	    "_meta": {
	      "_cols": ["insd_min_amount", "insd_max_amount", "premium_min_factor", "premium_max_factor", "income_min_factor", "income_max_factor"],
	      "_coltypes": ["num", "num", "num", "num", "num", "num"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_gender": [["*", "*"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job": [["*", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["6202", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["age_month", "num"], ["gender", "str"], ["job", "str"], ["insured_status", "str"], ["pay_mode", "int"], ["special_auth", "int"]]
	    }
	  },
	  "product_unit_rate": {
	    "6202": [1, 0, 0, 0, 0, 0, 0, 0],
	    "_meta": {
	      "_cols": ["sa_unit_amount", "em_unit_amount", "cash_value_unit_amount", "mort_unit_amount", "rev_bonus_unit_amount", "cash_bonus_unit_amount", "tml_bonus_unit_amount", "premium_unit_amount"],
	      "_coltypes": ["int", "int", "int", "int", "int", "int", "int", "int"],
	      "_key_product_id": [["6202", "*"]],
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
	    "6202:0:0:0:0:0": [110238, "1", 20000.0, 500000.0, 401, "2016-04-21 00:00:00", 401, "2016-04-21 00:00:00", "0", 30, "2016-04-21 00:00:00", "2016-04-21 00:00:00", 1422],
	    "_meta": {
	      "_cols": ["list_id", "limit_unit", "insd_min_amount", "insd_max_amount", "recorder_id", "insert_time", "updater_id", "update_time", "declaration_type", "money_id", "insert_timestamp", "update_timestamp", "product_version_id"],
	      "_coltypes": ["int", "str", "num", "num", "int", "dtm", "int", "dtm", "str", "int", "dtm", "dtm", "int"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job_cate": [["0", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["6202", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["pay_mode", "int"], ["insured_status", "str"], ["age_month", "int"], ["job_cate", "int"], ["special_auth", "int"]]
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
	        "proposal_date": "15-02-2016",
	        "proposal_start_date": "01-02-2016",
	        "pay_method": "cash",
	        "prem_freq": "5",
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
	            "target_premium": 120000000,
	            "basic_sa": 2500000000,
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
	        }, { "product_id": 6202,
	            "internal_id": "HCP",
	            "benefitLevel": 1,
	            "la": 0,
	            "cover_age": 60
	        }],
	        "topups": [{ year: 10, amount: 0 }],
	        "withdrawals": [{ year: 3, amount: 0 }]

	    }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    internal_id: "HCP",
	    age_method: "age_method__01",
	    max_t: "zero",
	    cover_term: "cover_term__06",
	    cover_duration: "cover_term__06",
	    maturity_age: "maturity_age__03",
	    age_at_t: "age_at_t__02",
	    entry_age: "entry_age__01",
	    cor_at_t: "cor_at_t__04",
	    total_cor: "zero",
	    monthly_cor: "monthly_cor__01",
	    monthly_coi: "zero",
	    basic_cost: "zero",
	    total_loadings: "total_loadings__01",
	    tiv_low_at_t: "zero",
	    tiv_mid_at_t: "zero",
	    tiv_high_at_t: "zero",
	    atu_at_t: "zero",
	    rtu_at_t: "zero",
	    tp_at_t: "zero",
	    pol_fee_at_t: "zero",
	    mac_at_t: "zero",
	    withdrawal_at_t: "zero",
	    debt_at_t: "zero",
	    debt_for_t: "zero",
	    debt_paid_at_t: "zero",
	    debt_repay_for_t: "zero",
	    debt_accum_period: "zero",
	    debt_repay_period: "zero",
	    outstd_debt_at_t: "zero",
	    accum_factor: "zero",
	    sa_calculated: "zero",
	    prem: "zero",
	    ap: "zero",
	    apt: "zero",
	    tpp: "zero",
	    totprem: "zero",
	    pol_apt: "zero",
	    pol_tpp: "zero",
	    db: "zero",
	    dbg: "zero",
	    dbng: "zero",
	    dbt_low: "zero",
	    dbt_mid: "zero",
	    dbt_high: "zero",
	    dbgt: "zero",
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
	        validate_rider: 'validate_rider__03',
	        check_sa_limit: 'check_sa_limit__01',
	        check_age_limit: 'check_age_limit__01',
	        check_sa_multiple: 'noop',
	        check_min_max_sa_units: 'noop',
	        check_cover_age: "check_cover_age__01"

	    },
	    input: { "la": "int", "benefit_level": "num" },
	    si_colnames: [],
	    si_fields: []

	};

/***/ }
/******/ ])
});
;