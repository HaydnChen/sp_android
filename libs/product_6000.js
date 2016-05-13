(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "moment"], factory);
	else if(typeof exports === 'object')
		exports["product_6000"] = factory(require("lodash"), require("moment"));
	else
		root["product_6000"] = factory(root["lodash"], root["moment"]);
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

	console.log("Product 6000 is ready...");
	var exps = { product_id: 6000, code: code, inputjson: inputjson, config: config };

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
	    var dd = (0, _moment2.default)(s, ['DD-MM-YYYY', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH:mm:ss', 'DD-MM-YY HH:mm:ss', 'DD-MM-YY HH:mm'], true);
	    return dd.isValid() ? dd : _lodash2.default.isDate(s) ? (0, _moment2.default)(s) : null;
	}

	function toRow(cols, values) {
	    var row = {};
	    _lodash2.default.zip(cols, values).forEach(function (item, index) {
	        var _item = _slicedToArray(item, 2);

	        var k = _item[0];
	        var v = _item[1];

	        row[k] = v;
	        row[index] = v; // to allow access by db0, db1,....
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
	                    var deflt = undefined;
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
	                            //throw Error("utils.js toKey -->Unable to set key value " + tableName, key );
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
	    "6000:2:0:9999:0:100:9999:0:0:0:0:9999:0:0:0.0:0:N:0:0": [25229, "5", 30, 65, 100, 100, 100, 100, 100, 999, 999, "1", 0, 999, 999, "1", 0, 999, 400, "2014-06-06 00:00:00", 400, "2014-06-06 00:00:00", "1", 0, "1", "1", 9999, 999],
	    "_meta": {
	      "_cols": ["list_id", "min_insd_nb_age_unit", "min_insd_nb_age", "max_insd_nb_age", "max_insd_rn_age", "max_insd_nb_pu_age", "max_insd_rn_pu_age", "max_insd_nb_ex_age", "max_insd_rn_ex_age", "max_ph_nb_age", "max_ph_rn_age", "min_ji_nb_age_unit", "min_ji_nb_age", "max_ji_nb_age", "max_ji_rn_age", "min_topup_age_unit", "min_topup_age", "max_topup_age", "recorder_id", "insert_time", "updater_id", "update_time", "max_insd_nb_age_unit", "min_ph_nb_age", "max_ji_nb_age_unit", "max_topup_age_unit", "pay_year_max", "max_deferment_age"],
	      "_coltypes": ["int", "str", "int", "int", "int", "int", "int", "int", "int", "int", "int", "str", "int", "int", "int", "str", "int", "int", "int", "dtm", "int", "dtm", "str", "int", "str", "str", "int", "int"],
	      "_key_charge_period": [["2", "*"]],
	      "_key_charge_type": [["0", "*"]],
	      "_key_charge_year": [["0", "*"]],
	      "_key_charge_year_max": [["9999", "*"]],
	      "_key_coverage_period": [["0", "*"]],
	      "_key_coverage_year": [["100", "*"]],
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
	      "_key_product_id": [["6000", "*"]],
	      "_key_sa": [["0.0", "9999999999.0"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["charge_period", "str"], ["charge_year", "int"], ["charge_year_max", "int"], ["coverage_period", "str"], ["coverage_year", "int"], ["coverage_year_max", "int"], ["pay_period", "str"], ["pay_year", "int"], ["end_period", "str"], ["end_year", "int"], ["end_year_max", "int"], ["pay_ensure", "int"], ["charge_type", "str"], ["sa", "num"], ["pay_mode", "int"], ["gender", "str"], ["insured_status", "str"], ["special_auth", "int"]]
	    }
	  },
	  "cash_bonus_rate": {},
	  "cash_value": {},
	  "free_look_charge": {
	    "6000:*": [999.0],
	    "_meta": {
	      "_cols": ["charge_rate"],
	      "_coltypes": ["num"],
	      "_key_money_id": [["*", "*"]],
	      "_key_product_id": [["6000", "*"]],
	      "_keys": [["product_id", "int"], ["money_id", "int"]]
	    }
	  },
	  "large_sa_discount_rate": {
	    "6000:0:*": [0.0, 0],
	    "6000:100000001:*": [0.0, 0],
	    "6000:250000001:*": [0.0, 0],
	    "_meta": {
	      "_cols": ["discount_rate", "min_amount"],
	      "_coltypes": ["num", "int"],
	      "_key_product_id": [["6000", "*"]],
	      "_key_sa_amount": [["0", "100000000"], ["100000001", "250000000"], ["250000001", "1000000000000000000"]],
	      "_key_unit_amount": [["*", "*"]],
	      "_keys": [["product_id", "int"], ["sa_amount", "num"], ["unit_amount", "int"]]
	    }
	  },
	  "liability_config": {
	    "6000:303": ["N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", 0, "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "2014-06-06 00:00:00", "2014-06-06 00:00:00", 100, 10413, 1021, "N", "N", 1],
	    "_meta": {
	      "_cols": ["pay_period", "pay_month", "pay_age1", "pay_age2", "pay_end_period", "pay_end_year", "pay_pay_ensure", "pay_pay_type", "pay_premium_year", "liab_prem_year", "liab_period", "liab_charge_type", "liab_gender", "liab_age", "liab_month", "liab_liab_age", "liab_bene_level", "liab_pay_ensure", "wait_days", "surgery_type", "sickroom_type", "hospital_speci", "hospital_type", "relation_s", "claim_cnt", "once_except", "once_pay_rate", "once_per_pay_limit", "year_except", "year_per_pay_limit", "coverage_except", "coverage_per_pay_limit", "life_pay_limit", "day_per_pay_limit", "month_per_pay_limit", "pay_age", "hospital_owner", "hospital_time", "pay_amount", "insert_time", "update_time", "sur_amount", "list_id", "sur_formula", "liab_job_class", "pay_low_prem", "formula_indi"],
	      "_coltypes": ["str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "dtm", "int", "int", "int", "str", "str", "int"],
	      "_key_liab_id": [["303", "*"]],
	      "_key_product_id": [["6000", "*"]],
	      "_keys": [["product_id", "int"], ["liab_id", "int"]]
	    }
	  },
	  "lien_rate": {
	    "6000:0": [1.0],
	    "_meta": {
	      "_cols": ["lien_rate"],
	      "_coltypes": ["num"],
	      "_key_age": [["0", "100"]],
	      "_key_product_id": [["6000", "*"]],
	      "_keys": [["product_id", "int"], ["age", "int"]]
	    }
	  },
	  "model_factor": {
	    "6000:1:1:*": [1.0, 1.0],
	    "6000:4:1:*": [0.09, 1.0],
	    "_meta": {
	      "_cols": ["charge_rate", "charge_rate_div"],
	      "_coltypes": ["num", "num"],
	      "_key_charge_type": [["4", "*"], ["1", "*"]],
	      "_key_model_type": [["1", "*"]],
	      "_key_pay_mode": [["*", "*"]],
	      "_key_product_id": [["6000", "*"]],
	      "_keys": [["product_id", "int"], ["charge_type", "str"], ["model_type", "int"], ["pay_mode", "int"]]
	    }
	  },
	  "pay_liability": {
	    "6000:303:9999:0:0:999:999:0.0:0:0:0:0": [1000.0],
	    "_meta": {
	      "_cols": ["pay_amount"],
	      "_coltypes": ["num"],
	      "_key_age1": [["999", "*"]],
	      "_key_age2": [["999", "*"]],
	      "_key_end_period": [["0", "*"]],
	      "_key_end_year": [["0", "*"]],
	      "_key_liab_id": [["303", "*"]],
	      "_key_month": [["9999", "*"]],
	      "_key_pay_ensure": [["0", "*"]],
	      "_key_pay_type": [["0", "*"]],
	      "_key_period": [["0", "*"]],
	      "_key_prem": [["0.0", "1e+14"]],
	      "_key_premium_year": [["0", "*"]],
	      "_key_product_id": [["6000", "*"]],
	      "_keys": [["product_id", "int"], ["liab_id", "int"], ["month", "int"], ["period", "int"], ["premium_year", "int"], ["age1", "int"], ["age2", "int"], ["prem", "num"], ["end_period", "str"], ["end_year", "int"], ["pay_ensure", "int"], ["pay_type", "str"]]
	    }
	  },
	  "prem_limit": {
	    "6000:1:0:0:0": [24311, 1080000.0, 9999999999.0, 1080000.0, 9999999999.0, 0.0, 0.0, 0.0, 0.0, 400, "2014-06-06 00:00:00", 400, "2014-06-06 00:00:00", 0.0, 0.0],
	    "6000:4:0:0:0": [24314, 100000.0, 9999999999.0, 100000.0, 9999999999.0, 0.0, 0.0, 0.0, 0.0, 400, "2014-06-06 00:00:00", 400, "2014-06-06 00:00:00", 0.0, 0.0],
	    "_meta": {
	      "_cols": ["list_id", "min_initial_prem", "max_initial_prem", "min_subseq_prem", "max_subseq_prem", "min_incremnt_prem", "min_regu_topup_prem", "min_regu_topup_incr", "min_ad_topup_prem", "recorder_id", "insert_time", "updater_id", "update_time", "min_decremnt_prem", "min_regu_topup_decr"],
	      "_coltypes": ["int", "num", "num", "num", "num", "num", "num", "num", "num", "int", "dtm", "int", "dtm", "num", "num"],
	      "_key_age": [["0", "999"]],
	      "_key_charge_type": [["1", "*"], ["4", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["6000", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["charge_type", "str"], ["age", "int"], ["pay_mode", "int"], ["special_auth", "int"]]
	    }
	  },
	  "premium_rate": {
	    "6000:*:0:F:*:1990-01-01": [0.03],
	    "6000:*:0:M:*:1990-01-01": [0.01],
	    "6000:*:31:F:*:1990-01-01": [0.04],
	    "6000:*:31:M:*:1990-01-01": [0.02],
	    "_meta": {
	      "_cols": ["pr_1"],
	      "_coltypes": ["num"],
	      "_key_age": [["0", "30"], ["31", "99"]],
	      "_key_effective_date": [["1990-01-01", "9999-09-09"]],
	      "_key_gender": [["M", "*"], ["F", "*"]],
	      "_key_premium_year": [["*", "*"]],
	      "_key_product_id": [["6000", "*"]],
	      "_key_smoking_indi": [["*", "*"]],
	      "_keys": [["product_id", "int"], ["premium_year", "int"], ["age", "int"], ["gender", "str"], ["smoking_indi", "str"], ["effective_date", "dtm"]]
	    }
	  },
	  "prod_fund_prem_limit": {},
	  "product_allowables": {
	    "attachable_riders": [[], ["int", "str", "str", "str"], ["attach_id", "attach_type", "attach_compulsory", "gender"]],
	    "bonus_options": [[], ["int"], ["mode_id"]],
	    "coverage_terms": [[["3", 100]], ["str", "int"], ["coverage_period", "coverage_year"]],
	    "currencies": [[[30]], ["int"], ["money_id"]],
	    "funds": [[], ["str"], ["fund_code"]],
	    "organizations": [[[101]], ["int"], ["organ_id"]],
	    "pay_methods": [[["1", "0", 1], ["1", "0", 2], ["1", "0", 3], ["1", "0", 15], ["1", "0", 22], ["1", "0", 23], ["1", "0", 30], ["1", "0", 33], ["1", "0", 80], ["1", "0", 92], ["1", "0", 93], ["1", "0", 94], ["1", "0", 96], ["1", "0", 97], ["4", "0", 1], ["4", "0", 2], ["4", "0", 3], ["4", "0", 15], ["4", "0", 22], ["4", "0", 23], ["4", "0", 30], ["4", "0", 33], ["4", "0", 80], ["4", "0", 92], ["4", "0", 93], ["4", "0", 94], ["4", "0", 96], ["4", "0", 97]], ["str", "str", "int"], ["charge_type", "prem_sequen", "pay_mode"]],
	    "payment_freq": [[["4"], ["1"]], ["str"], ["charge_type"]],
	    "premium_terms": [[["2", 10]], ["str", "int"], ["charge_period", "charge_year"]],
	    "qualifications": [[[0]], ["int"], ["test_type_id"]],
	    "strategies": [[], ["str", "int"], ["strategy_code", "tariff_type"]],
	    "survival_options": [[], ["str"], ["survival_option"]]
	  },
	  "product_charge_list": {},
	  "product_currency": {
	    "6000:101:30:2": [400, "2014-06-06 00:00:00", 400, "2014-06-06 00:00:00", "EBAO2000"],
	    "_meta": {
	      "_cols": ["recorder_id", "insert_time", "updater_id", "update_time", "entity_fund"],
	      "_coltypes": ["int", "dtm", "int", "dtm", "str"],
	      "_key_entity_fund_type": [["2", "*"]],
	      "_key_money_id": [["30", "*"]],
	      "_key_organ_id": [["101", "*"]],
	      "_key_product_id": [["6000", "*"]],
	      "_keys": [["product_id", "int"], ["organ_id", "int"], ["money_id", "int"], ["entity_fund_type", "str"]]
	    }
	  },
	  "product_fund": {},
	  "product_life": {
	    "6000": [1, "Zurich Term Life", "WHL", "ZLIFE01", "", "2", "1", "0", "1", "Y", "", "1999-01-01 00:00:00", "2999-09-09 00:00:00", 0.0, 0.0, 0.0, 9999, 9999999999.0, "Y", "Y", "", "N", "N", "", "13", "0", "0", "0", "1", "Y", "Y", "Y", 0.0, "Y", "", "Y", 0.0, 0.0, 0, 0, 0.0, "N", "who", "1", "1", "1", "", "0", "N", "Y", "N", "N", "Y", 400, "2014-06-06 00:00:00", 401, "2015-05-05 00:00:00", "", 0, "0", "N", "N", 0, 0, "", "1", "N", "N", "N", "N", "N", "N", "Y", 30, "0", "2", "16", 45, "N", "2", "4", "N", "Y", "N", 0, "N", 0.0, "N", "N", "0", 9999, "1", 9999, 9999, 4818, 0, 0.0, 0.0, 0, 99, "0", "", "Whole Life", "N", 9999999999.0, "0", "N", "N", "N", "1", "N", "N", "N", "Y", "", 999, "N", 0.0, "N", "0", "N", "N", "N", "1", "N", "N", "Y", "Y", 0.0, "N", "N", 0, "N", "N", "N", 0, 0.0, "N", 2, "N", 30, "N", 0, 0.0, 9999, 1.0, 999, "N", "1", "N", "N", "N", "1", "N", "N", "1", 0, "N", 0, "Y", 0, 0.0, "N", "1", 0, "Y", "N", "", 0, "2", "N", 0.8, "N", "Y", "3", "N", 0, 0, 0, "N", "N", "0", 0, "0", "0", 0, "2", "0", "2", "N", "N", "N", 0.0, "N", "N", "0", 0, "N", "N", 0.0, 0.0, "0", "N", "N", 0, "", "N", "0", "9", 0.0, "N", 0, 0, 1, 0, "N", "N", "N", "N", 0, "Y", "N", 0, "Y", "N", "0", 0, "N", 0, "Y", "N", 0, "N", 0, "N"],
	    "_meta": {
	      "_cols": ["organ_id", "product_name", "product_abbr", "internal_id", "hospital_type", "unit_flag", "ins_type", "ally", "individual_group", "value", "exception", "start_date", "end_date", "life_rate", "sudden_rate", "ill_rate", "em", "check_amount", "renew", "pregnant_insured", "underwrite_class", "attachable", "insure_month", "duty", "benefit_type", "target_type", "period_type", "underwrite_job", "surr_permit", "add_permit", "apl_permit", "loan_permit", "actuary_rate", "table_prem", "ss_claim_formula", "reduce_paidup", "min_sur_amount", "min_add_amount", "min_add_units", "min_sur_units", "min_claim_amount", "mortagage", "initial_id", "section_cal_type", "period_cal_type", "age_base", "bonus_cal_type", "premium_define", "regu_to_single", "sa_accum", "universal_prem", "guarantee_renew", "checked", "insert_person", "insert_date", "updater_id", "update_time", "sys_lock_time", "sys_locker_id", "sys_lock_status", "pseudo", "permit_prs", "prs_unit_amount", "prs_formula", "policyholder", "prem_table", "related_type_prem2", "related_prem2", "fee_year_prem2", "age_prem2", "gender_prem2", "comm_amount", "uw_manual", "base_money", "gst_indicator", "stamp_indicator", "plan_type", "grace_period", "grace_follow", "age_method", "rn_date_type", "follow_discnt", "large_sa_discnt", "prem_vouch_permit", "prem_vouch_rate", "defer_period", "joint_adjust_rate", "waiver", "waiver_benefit", "waiver_basis", "max_switch_times", "switch_period_unit", "max_swit_in_times", "max_swit_out_times", "rup_product_id", "eta_product_id", "min_sur_value", "min_remain_value", "min_defer_period", "max_defer_period", "switch_method", "product_name_2", "feature_desc", "payer_wop", "max_waiv_prem_ann", "gurnt_period_type", "receipt_indi", "proof_age", "full_declare", "ph_la_relation", "hth_full_declare", "advan_program", "uw_jet", "backdate_indi", "start_backdate", "backdate_period", "postdate_indi", "max_comp_commi", "dopp_indi", "policy_section", "assignment_indi", "conversion_priv", "purc_new_pol", "unexpire_rate_meth", "bonus_encash", "la_change", "free_look_indi", "free_look_follow", "admin_charge", "stand_alone_rider", "partial_withdraw", "invest_delay", "cash_bonus_indi", "rev_bonus_indi", "tml_bonus_indi", "eta_endo_prod", "tml_bonus_int_rate", "bereavement_indi", "max_reins_period", "eta_permit", "free_look_period", "stand_life_indi", "non_lap_period", "switch_fee", "free_switch_times", "max_gib_rate", "max_gib_age", "incr_prem_permit", "max_reins_peri_unit", "surr_charge_indi", "special_discnt", "apilp_indi", "backdate_unit", "topup_permit", "reg_topup_permit", "gurnt_period_unit", "gurnt_period", "hi_pol_fee_indi", "grace_period_add", "overdue_int_indi", "eta_term_prod", "annuity_surr_fac", "annuity_notice_indi", "annuity_notice_unit", "annuity_notice_period", "decrease_permit", "prefer_life_indi", "free_switch_unit", "free_switch_period", "par_non_ilp", "gib_permit", "max_loan_rate", "matu_loan_permit", "special_revival_permit", "stampduty_option", "ladr_indi", "bonus_vest_year_clm", "bonus_vest_year_surr", "cb_vest_year", "is_net_invest", "auto_reduce_paidup", "after_eta_option", "gsv_vest_year", "phd_rate_cate", "ri_calc_basis", "ri_calc_formula", "ri_renewal_freq", "ri_factor_table_code", "ri_age_base", "asset_share", "gja_indi", "gsc_indi", "apilp_k", "uptoage_indi", "spouse_prod_indi", "benefit_freq_indi", "risk_aggr_formula", "prem_change_notice", "aurp_specific_terms", "waiver_interest_rate", "db_base_clm", "bucket_filling_option", "follow_commision", "formula_driven", "value_unit_amount", "value_cal_type", "comm_start_dd_indi", "fin_prod_indicator", "ra_object", "min_loan_amt", "reg_part_witdr_per", "bucket_fill_option_ad", "pld_grace_period", "lapse_method", "free_witdr_times", "spouse_waiver", "pers_annu_tax_term", "full_prepayment", "self_confirm", "wait_days_af_lapse", "editable", "has_flexible_period", "flexible_period", "first_of_month", "forward_allowed", "period_type_for_forward", "max_period_for_forward", "indx_indi", "indx_year", "auto_backdate_indi", "is_gio", "max_exercise_time", "is_debt", "product_indicator", "simplify_uw"],
	      "_coltypes": ["int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "dtm", "num", "num", "num", "int", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "str", "num", "num", "int", "int", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "dtm", "int", "dtm", "dtm", "int", "str", "str", "str", "int", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "str", "str", "int", "str", "str", "str", "str", "str", "str", "int", "str", "num", "str", "str", "str", "int", "str", "int", "int", "int", "int", "num", "num", "int", "int", "str", "str", "str", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "int", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "int", "str", "str", "str", "int", "num", "str", "int", "str", "int", "str", "int", "num", "int", "num", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "int", "str", "int", "num", "str", "str", "int", "str", "str", "str", "int", "str", "str", "num", "str", "str", "str", "str", "int", "int", "int", "str", "str", "str", "int", "str", "str", "int", "str", "str", "str", "str", "str", "str", "num", "str", "str", "str", "int", "str", "str", "num", "num", "str", "str", "str", "int", "str", "str", "str", "str", "num", "str", "int", "int", "int", "int", "str", "str", "str", "str", "int", "str", "str", "int", "str", "str", "str", "int", "str", "int", "str", "str", "int", "str", "int", "str"],
	      "_key_product_id": [["6000", "*"]],
	      "_keys": [["product_id", "int"]]
	    }
	  },
	  "product_sa_limit": {
	    "6000:0:*:*:0:0:0": [0.0, 9999999999.0, 0, 99999, 0, 99999],
	    "_meta": {
	      "_cols": ["insd_min_amount", "insd_max_amount", "premium_min_factor", "premium_max_factor", "income_min_factor", "income_max_factor"],
	      "_coltypes": ["num", "num", "num", "num", "num", "num"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_gender": [["*", "*"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job": [["*", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["6000", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["age_month", "num"], ["gender", "str"], ["job", "str"], ["insured_status", "str"], ["pay_mode", "int"], ["special_auth", "int"]]
	    }
	  },
	  "product_unit_rate": {
	    "6000": [1, 1000, 1000, 0, 0, 0, 0, 1],
	    "_meta": {
	      "_cols": ["sa_unit_amount", "em_unit_amount", "cash_value_unit_amount", "mort_unit_amount", "rev_bonus_unit_amount", "cash_bonus_unit_amount", "tml_bonus_unit_amount", "premium_unit_amount"],
	      "_coltypes": ["int", "int", "int", "int", "int", "int", "int", "int"],
	      "_key_product_id": [["6000", "*"]],
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
	    "6000:0:0:0:0:0": [103631, "1", 0.0, 9999999999.0, 400, "2014-06-06 00:00:00", 400, "2014-06-06 00:00:00", "0", 0],
	    "_meta": {
	      "_cols": ["list_id", "limit_unit", "insd_min_amount", "insd_max_amount", "recorder_id", "insert_time", "updater_id", "update_time", "declaration_type", "max_sa_per_life"],
	      "_coltypes": ["int", "str", "num", "num", "int", "dtm", "int", "dtm", "str", "int"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job_cate": [["0", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["6000", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["pay_mode", "int"], ["insured_status", "str"], ["age_month", "int"], ["job_cate", "int"], ["special_auth", "int"]]
	    }
	  },
	  "sa_schedule": {
	    "6000:0": [1.0],
	    "_meta": {
	      "_cols": ["sa_rate"],
	      "_coltypes": ["num"],
	      "_key_policy_year": [["0", "100"]],
	      "_key_product_id": [["6000", "*"]],
	      "_keys": [["product_id", "int"], ["policy_year", "int"]]
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
	        "proposal_date": "19-03-2016",
	        "proposal_start_date": "01-03-2016",
	        "pay_method": "cash",
	        "prem_freq": "1",
	        "people": [{ "name": "Insured",
	            "dob": "12-03-1986",
	            "gender": "male",
	            "job_class": 1,
	            "age": 29,
	            "is_ph": true
	        }, { "name": "Policyholder",
	            "dob": "12-03-1982",
	            "gender": "male",
	            "age": 33,
	            "is_ph": false
	        }, { "name": "Spouse",
	            "dob": "12-03-1985",
	            "gender": "female",
	            "age": 30,
	            "is_ph": false
	        }],
	        "products": [{ "product_id": 6000,
	            "internal_id": "ZLIFE01",
	            "initial_sa": 150000000,
	            "la": 0
	        }]

	    }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    age_method: "age_method__01",
	    max_t: "max_t__01",
	    coverage: "coverage_term__01",
	    cover_duration: "cover_duration__01",
	    cover_term: "cover_duration__01",
	    age_at_t: "age_at_t__03",
	    entry_age: "entry_age__01",
	    ph_entry_age: "ph_entry_age__01",
	    pol_fee_at_t: "zero",
	    pol_fee_after_modal_factor: "zero",
	    pol_fee_before_modal_factor: "zero",
	    prem: "prem__01",
	    prem_term: "prem_term__01",
	    ap: "ap__02",
	    apt: "apt__02",
	    premium_at_t: "premium_at_t__01",
	    tpp: "tpp__02",
	    totprem: "totprem__01",
	    pol_apt: "pol_apt__01",
	    pol_tpp: "pol_tpp__01",
	    db: "zero",
	    dbg: "zero",
	    dbng: "zero",
	    dbt: "dbt__01",
	    dbgt: "dbgt__01",
	    dbngt: "zero",
	    tot_dbt: ["tot_dbt__01", "round_dollar_half_up"],
	    tb: "zero",
	    cb: "zero",
	    acccb: "zero",
	    rb: "zero",
	    accrb: "zero",
	    sbg: "zero",
	    accsb: "zero",
	    accsbrate: "accsbrate__01",
	    svg_at_t: "svg_at_t__01",
	    tsv: "tsv__01",
	    mbg: "zero",
	    tiv: "zero",
	    tdc: "zero",
	    eod: "zero",
	    pirr: [0.00, 0.00],
	    validators: {
	        validate_main: 'validate_main__01',
	        validate_all_riders: 'validate_all_riders__01',
	        validate_rider: 'validate_rider__01',
	        check_sa_limit: 'check_sa_limit__01',
	        check_age_limit: 'check_age_limit__01',
	        check_prem_limit: 'check_prem_limit__01'
	    },

	    //                    validate_premiums     : 'validate_premiums__01',
	    input: { "la": "int", "initial_sa": "num", "pay_mode": "str", "coverage_term": "int" },
	    si_colnames: ["Month", "Age", "Premium", "Premium Paid", "Death Benefit", "Surrender Value"],
	    si_fields: ['t', 'age_at_t', 'premium_at_t', 'tpp', 'dbt', 'svg_at_t'],
	    si_colwidths: [0.05, 0.05, 0.1, 0.1, 0.1, 0.1, 0.1]

	};

/***/ }
/******/ ])
});
;