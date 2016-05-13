(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "moment"], factory);
	else if(typeof exports === 'object')
		exports["product_5013"] = factory(require("lodash"), require("moment"));
	else
		root["product_5013"] = factory(root["lodash"], root["moment"]);
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

	console.log("Product 5013 is ready...");
	var exps = { product_id: 5013, code: code, inputjson: inputjson, config: config };

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

	// ILP code the functions here first -- since it does layered loading of code

	/*    
	export function coi_rate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    let pid = _.has(factors,'product_id') ? factors.product_id : pdt.val("product_id");
	    let data = pdt.val("product_data", t, { pid : pid } );
	    let tname = 'insurance_charge_rate';
	    if (tname in data ) {
	        let opts = {};
	        let la = ppl[pdt.val("la")];   
	        let gender = la.val("gender").toLowerCase();
	        opts.gender = gender === 'male' ? "M" : gender === 'female' ? "F" : "W"
	        opts.age = pdt.val("age_at_t",t);
	        opts = _.extend(opts,factors);
	        let table = data[tname];
	        let key = utils.toKey(tname, table._meta, opts);
	        if ( key in table) {
	            let row = utils.toRow(table._meta._cols, table[key]);
	            return row ; // use row.result_value_1 for the rate
	        } 
	    } 
	    return {};
	}

	export function fund_low_rate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    return fund_performance_rate( ctx, pol, ppl, pdt, fund, t, _.extend(factors,{'type':'LOW'}) );
	}
	export function fund_mid_rate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    return fund_performance_rate( ctx, pol, ppl, pdt, fund, t, _.extend(factors,{'type':'MID'}) );
	}
	export function fund_high_rate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    return fund_performance_rate( ctx, pol, ppl, pdt, fund, t, _.extend(factors,{'type':'HIGH'}) );
	}
	function fund_performance_rate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    let pid = _.has(factors,'product_id') ? factors.product_id : pdt.val("product_id");
	    let data = pdt.val("product_data", t, { pid : pid } );
	    let tname = 'investment_performance';
	    if (tname in data ) {
	        let opts = {};
	        if (!('type' in factors)) { opts.type = 'LOW'; } // default
	        opts = _.extend(opts,factors);
	        let table = data[tname];
	        let key = utils.toKey(tname, table._meta, opts);
	        if ( key in table) {
	            let row = utils.toRow(table._meta._cols, table[key]);
	            return row ; // use row.rate
	        } 
	    } 
	    return {};
	}

	export function ilp_pol_fee_rate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    let pid = _.has(factors,'product_id') ? factors.product_id : pdt.val("product_id");
	    let data = pdt.val("product_data", t, { pid : pid } );
	    let tname = 'policy_fee_ilp_default';
	    if (tname in data ) {
	        let opts = {};
	        opts.product_id = pid;
	        opts.policy_year = t;
	        opts.charge_type = pol.val("prem_freq") ;
	        opts.discount_type = '0';        
	        opts = _.extend(opts,factors);
	        let table = data[tname];
	        let key = utils.toKey(tname, table._meta, opts);
	        if ( key in table) {
	            let row = utils.toRow(table._meta._cols, table[key]);
	            return row ; // use row.assign_rate
	        } 
	    } 
	    return {};
	}
	    
	export function atu_expense_fee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    return expense_fee(ctx,pol,ppl,pdt,fund,t,_.extend({prem_type:4},factors))
	}
	export function tp_expense_fee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    return expense_fee(ctx,pol,ppl,pdt,fund,t,_.extend({prem_type:2},factors))
	}
	export function rtu_expense_fee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    return expense_fee(ctx,pol,ppl,pdt,fund,t,_.extend({prem_type:3},factors))
	}
	export function sp_expense_fee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    return expense_fee(ctx,pol,ppl,pdt,fund,t,_.extend({prem_type:1},factors))
	}
	        
	function expense_fee( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    let pid = _.has(factors,'product_id') ? factors.product_id : pdt.val("product_id");
	    let data = pdt.val("product_data", t, { pid : pid } );
	    let tname = 'expense_fee_default';
	    if (tname in data ) {
	        let opts = {};
	        opts.policy_year = t;
	        opts = _.extend(opts,factors);
	        let table = data[tname];
	        let key = utils.toKey(tname, table._meta, opts);
	        if ( key in table) {
	            let row = utils.toRow(table._meta._cols, table[key]);
	            return row ; // use row.assign_rate
	        } 
	    } 
	    return {};
	}

	export function premium_rateaccident( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    let pid = _.has(factors,'product_id') ? factors.product_id : pdt.val("product_id");
	    let data = pdt.val("product_data", t, { pid : pid } );
	    let tname = 'premium_rateaccident';
	    let la = ppl[pdt.val("la")];
	    let gender = la.val("gender").toLowerCase();
	    if (tname in data ) {
	        let opts = {};
	        opts.period = t;
	        opts.job_class = la.val("job_class");
	        opts.gender = gender === 'male' ? "M" : gender === 'female' ? "F" : "W";
	        opts.age = pdt.val("age_at_t",t);
	        opts = _.extend(opts,factors);        
	        let table = data[tname];
	        let key = utils.toKey(tname, table._meta, opts);
	        if ( key in table) {
	            let row = utils.toRow(table._meta._cols, table[key]);
	            return row ; // use row.assign_rate
	        } 
	    } 
	    return {};
	}
	   */

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

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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
	                            console.log("*** utils.js toKey--> unable to set the key value for tableName ", tableName, "key=", key, "factor=", factors);
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
	    "5013:0:0:9999:0:0:9999:0:0:0:0:9999:0:0:0.0:0:N:0:0": [10011, "1", 16, 59, 999, 999, 999, 100, 100, 999, 999, "1", 0, 999, 999, "1", 0, 999, 400, "2008-05-09 00:00:00", 400, "2008-05-09 00:00:00", "1", 0, "1", "1", 9999, 999],
	    "_meta": {
	      "_cols": ["list_id", "min_insd_nb_age_unit", "min_insd_nb_age", "max_insd_nb_age", "max_insd_rn_age", "max_insd_nb_pu_age", "max_insd_rn_pu_age", "max_insd_nb_ex_age", "max_insd_rn_ex_age", "max_ph_nb_age", "max_ph_rn_age", "min_ji_nb_age_unit", "min_ji_nb_age", "max_ji_nb_age", "max_ji_rn_age", "min_topup_age_unit", "min_topup_age", "max_topup_age", "recorder_id", "insert_time", "updater_id", "update_time", "max_insd_nb_age_unit", "min_ph_nb_age", "max_ji_nb_age_unit", "max_topup_age_unit", "pay_year_max", "max_deferment_age"],
	      "_coltypes": ["int", "str", "int", "int", "int", "int", "int", "int", "int", "int", "int", "str", "int", "int", "int", "str", "int", "int", "int", "dtm", "int", "dtm", "str", "int", "str", "str", "int", "int"],
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
	      "_key_product_id": [["5013", "*"]],
	      "_key_sa": [["0.0", "9999999999.0"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["charge_period", "str"], ["charge_year", "int"], ["charge_year_max", "int"], ["coverage_period", "str"], ["coverage_year", "int"], ["coverage_year_max", "int"], ["pay_period", "str"], ["pay_year", "int"], ["end_period", "str"], ["end_year", "int"], ["end_year_max", "int"], ["pay_ensure", "int"], ["charge_type", "str"], ["sa", "num"], ["pay_mode", "int"], ["gender", "str"], ["insured_status", "str"], ["special_auth", "int"]]
	    }
	  },
	  "cash_bonus_rate": {},
	  "cash_value": {},
	  "deduction_rate_of_ud_riderdefault": {
	    "5013:5001:1": [0.0],
	    "5013:5001:26": [1.0],
	    "5013:5001:86": [1.0],
	    "5013:5017:1": [1.0],
	    "5013:5017:26": [1.0],
	    "5013:5017:86": [1.0],
	    "5013:5047:1": [1.0],
	    "5013:5047:26": [1.0],
	    "5013:5047:86": [1.0],
	    "5013:5461:1": [0.0],
	    "5013:5461:26": [1.0],
	    "5013:5461:86": [1.0],
	    "5013:5659:1": [1.0],
	    "5013:5659:26": [1.0],
	    "5013:5659:86": [1.0],
	    "5013:5663:1": [1.0],
	    "5013:5663:26": [1.0],
	    "5013:5663:86": [1.0],
	    "5013:5665:1": [1.0],
	    "5013:5665:26": [1.0],
	    "5013:5665:86": [1.0],
	    "5013:5674:1": [1.0],
	    "5013:5674:26": [1.0],
	    "5013:5674:86": [1.0],
	    "5013:5722:1": [1.0],
	    "5013:5722:26": [1.0],
	    "5013:5722:86": [1.0],
	    "5013:5803:1": [1.0],
	    "5013:5803:26": [1.0],
	    "5013:5803:86": [1.0],
	    "_meta": {
	      "_cols": ["deduct rate"],
	      "_coltypes": ["num"],
	      "_key_policy month": [["1", "25"], ["26", "85"], ["86", "1189"]],
	      "_key_product attached": [["5001", "*"], ["5047", "*"], ["5659", "*"], ["5663", "*"], ["5665", "*"], ["5722", "*"], ["5803", "*"], ["5017", "*"], ["5461", "*"], ["5674", "*"]],
	      "_key_product_id": [["5013", "*"]],
	      "_keys": [["product_id", "int"], ["product attached", "int"], ["policy month", "int"]]
	    }
	  },
	  "liability_config": {},
	  "model_factor": {
	    "5013:4:1:*": [12.0, 12.0],
	    "5013:4:2:*": [12.0, 12.0],
	    "5013:4:3:*": [12.0, 12.0],
	    "_meta": {
	      "_cols": ["charge_rate", "charge_rate_div"],
	      "_coltypes": ["num", "num"],
	      "_key_charge_type": [["4", "*"]],
	      "_key_model_type": [["2", "*"], ["3", "*"], ["1", "*"]],
	      "_key_pay_mode": [["*", "*"]],
	      "_key_product_id": [["5013", "*"]],
	      "_keys": [["product_id", "int"], ["charge_type", "str"], ["model_type", "int"], ["pay_mode", "int"]]
	    }
	  },
	  "pay_liability": {},
	  "prem_limit": {
	    "5013:0:0": [3012, 0.0, 100000000000000.0, 0.0, 100000000000000.0, 0.0, 0.0, 0.0, 0.0, 400, "2005-05-15 00:00:00", 400, "2005-05-15 00:00:00", 0, 999, 0.0, 0.0, 0],
	    "_meta": {
	      "_cols": ["list_id", "min_initial_prem", "max_initial_prem", "min_subseq_prem", "max_subseq_prem", "min_incremnt_prem", "min_regu_topup_prem", "min_regu_topup_incr", "min_ad_topup_prem", "recorder_id", "insert_time", "updater_id", "update_time", "min_age", "max_age", "min_decremnt_prem", "min_regu_topup_decr", "special_auth"],
	      "_coltypes": ["int", "num", "num", "num", "num", "num", "num", "num", "num", "int", "dtm", "int", "dtm", "int", "int", "num", "num", "int"],
	      "_key_charge_type": [["0", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["5013", "*"]],
	      "_keys": [["product_id", "int"], ["pay_mode", "int"], ["charge_type", "str"]]
	    }
	  },
	  "premium_rateaccident": {
	    "5013:1:*:*:999:*:*": [0.9],
	    "5013:2:*:*:999:*:*": [1.2],
	    "5013:3:*:*:999:*:*": [1.5],
	    "_meta": {
	      "_cols": ["pr_1"],
	      "_coltypes": ["num"],
	      "_key_age": [["999", "*"]],
	      "_key_benefit_level": [["*", "*"]],
	      "_key_gender": [["*", "*"]],
	      "_key_job_class": [["2", "*"], ["3", "*"], ["1", "*"]],
	      "_key_period": [["*", "*"]],
	      "_key_premium_year": [["*", "*"]],
	      "_key_product_id": [["5013", "*"]],
	      "_keys": [["product_id", "int"], ["job_class", "int"], ["premium_year", "int"], ["period", "int"], ["age", "int"], ["gender", "str"], ["benefit_level", "int"]]
	    }
	  },
	  "prod_fund_prem_limit": {},
	  "product_allowables": {
	    "attachable_riders": [[], ["int", "str", "str", "str"], ["attach_id", "attach_type", "attach_compulsory", "gender"]],
	    "bonus_options": [[], ["int"], ["mode_id"]],
	    "coverage_terms": [[["3", 60]], ["str", "int"], ["coverage_period", "coverage_year"]],
	    "currencies": [[[30]], ["int"], ["money_id"]],
	    "funds": [[], ["str"], ["fund_code"]],
	    "organizations": [[[101]], ["int"], ["organ_id"]],
	    "pay_methods": [[["0", "0", 9]], ["str", "str", "int"], ["charge_type", "prem_sequen", "pay_mode"]],
	    "payment_freq": [[["4"]], ["str"], ["charge_type"]],
	    "premium_terms": [[["3", 60]], ["str", "int"], ["charge_period", "charge_year"]],
	    "qualifications": [[[0], [1]], ["int"], ["test_type_id"]],
	    "strategies": [[], ["str", "int"], ["strategy_code", "tariff_type"]],
	    "survival_options": [[], ["str"], ["survival_option"]]
	  },
	  "product_charge_list": {},
	  "product_fund": {},
	  "product_life": {
	    "5013": [1, "Accidental Death Rider", "AD1", "IADR01", "", "2", "2", "0", "1", "N", "", "2000-01-01 00:00:00", "2999-01-01 00:00:00", 0.0, 0.0, 0.0, 9999, 9999999999.0, "N", "Y", "", "N", "N", "", "31", "0", "3", "3", "0", "Y", "N", "N", 0.0, "Y", "", "N", 0.0, 0.0, 0, 0, 0.0, "N", "AD1", "1", "1", "2", "", "1", "N", "Y", "N", "N", "Y", 400, "2005-11-17 00:00:00", 5153367, "2015-01-24 00:00:00", "", 0, "0", "N", "N", 0, 0, "", "1", "N", "N", "N", "N", "N", "N", "N", 30, "0", "1", "1", 45, "Y", "2", "4", "N", "N", "N", 0, "N", 0.0, "N", "N", "0", 9999, "1", 9999, 9999, 0, 0, 0.0, 0.0, 0, 99, "0", "ACCIDENT BENEFIT)", "Accidental Death Rider For Regular Premium Link", "N", 9999999999.0, "2", "N", "N", "N", "1", "N", "N", "N", "Y", "2004-01-01 00:00:00", 999, "N", 0.0, "N", "0", "Y", "N", "N", "0", "N", "N", "Y", "Y", 0.0, "N", "N", 0, "N", "N", "N", 0, 0.0, "N", 2, "N", 30, "N", 0, 0.0, 0, 1.0, 999, "N", "1", "N", "N", "N", "1", "N", "N", "1", 0, "N", 0, "N", 0, 0.0, "N", "0", 999, "Y", "Y", "", 0, "4", "N", 0.0, "N", "N", "0", "N", 0, 0, 0, "N", "N", "0", 0, "0", "3", 0, "2", "0", "2", "N", "N", "N", 0.0, "N", "N", "0", 0, "N", "N", 0.0, 0.0, "0", "N", "N", 0, "0", "N", "0", "9", 0.0, "N", 0, 0, 1, 0, "N", "N", "N", "N", 0, "Y", "N", 0, "Y", "N", "0", 0, "N", 0, "Y", "N", 0, "N", 2, "N"],
	    "_meta": {
	      "_cols": ["organ_id", "product_name", "product_abbr", "internal_id", "hospital_type", "unit_flag", "ins_type", "ally", "individual_group", "value", "exception", "start_date", "end_date", "life_rate", "sudden_rate", "ill_rate", "em", "check_amount", "renew", "pregnant_insured", "underwrite_class", "attachable", "insure_month", "duty", "benefit_type", "target_type", "period_type", "underwrite_job", "surr_permit", "add_permit", "apl_permit", "loan_permit", "actuary_rate", "table_prem", "ss_claim_formula", "reduce_paidup", "min_sur_amount", "min_add_amount", "min_add_units", "min_sur_units", "min_claim_amount", "mortagage", "initial_id", "section_cal_type", "period_cal_type", "age_base", "bonus_cal_type", "premium_define", "regu_to_single", "sa_accum", "universal_prem", "guarantee_renew", "checked", "insert_person", "insert_date", "updater_id", "update_time", "sys_lock_time", "sys_locker_id", "sys_lock_status", "pseudo", "permit_prs", "prs_unit_amount", "prs_formula", "policyholder", "prem_table", "related_type_prem2", "related_prem2", "fee_year_prem2", "age_prem2", "gender_prem2", "comm_amount", "uw_manual", "base_money", "gst_indicator", "stamp_indicator", "plan_type", "grace_period", "grace_follow", "age_method", "rn_date_type", "follow_discnt", "large_sa_discnt", "prem_vouch_permit", "prem_vouch_rate", "defer_period", "joint_adjust_rate", "waiver", "waiver_benefit", "waiver_basis", "max_switch_times", "switch_period_unit", "max_swit_in_times", "max_swit_out_times", "rup_product_id", "eta_product_id", "min_sur_value", "min_remain_value", "min_defer_period", "max_defer_period", "switch_method", "product_name_2", "feature_desc", "payer_wop", "max_waiv_prem_ann", "gurnt_period_type", "receipt_indi", "proof_age", "full_declare", "ph_la_relation", "hth_full_declare", "advan_program", "uw_jet", "backdate_indi", "start_backdate", "backdate_period", "postdate_indi", "max_comp_commi", "dopp_indi", "policy_section", "assignment_indi", "conversion_priv", "purc_new_pol", "unexpire_rate_meth", "bonus_encash", "la_change", "free_look_indi", "free_look_follow", "admin_charge", "stand_alone_rider", "partial_withdraw", "invest_delay", "cash_bonus_indi", "rev_bonus_indi", "tml_bonus_indi", "eta_endo_prod", "tml_bonus_int_rate", "bereavement_indi", "max_reins_period", "eta_permit", "free_look_period", "stand_life_indi", "non_lap_period", "switch_fee", "free_switch_times", "max_gib_rate", "max_gib_age", "incr_prem_permit", "max_reins_peri_unit", "surr_charge_indi", "special_discnt", "apilp_indi", "backdate_unit", "topup_permit", "reg_topup_permit", "gurnt_period_unit", "gurnt_period", "hi_pol_fee_indi", "grace_period_add", "overdue_int_indi", "eta_term_prod", "annuity_surr_fac", "annuity_notice_indi", "annuity_notice_unit", "annuity_notice_period", "decrease_permit", "prefer_life_indi", "free_switch_unit", "free_switch_period", "par_non_ilp", "gib_permit", "max_loan_rate", "matu_loan_permit", "special_revival_permit", "stampduty_option", "ladr_indi", "bonus_vest_year_clm", "bonus_vest_year_surr", "cb_vest_year", "is_net_invest", "auto_reduce_paidup", "after_eta_option", "gsv_vest_year", "phd_rate_cate", "ri_calc_basis", "ri_calc_formula", "ri_renewal_freq", "ri_factor_table_code", "ri_age_base", "asset_share", "gja_indi", "gsc_indi", "apilp_k", "uptoage_indi", "spouse_prod_indi", "benefit_freq_indi", "risk_aggr_formula", "prem_change_notice", "aurp_specific_terms", "waiver_interest_rate", "db_base_clm", "bucket_filling_option", "follow_commision", "formula_driven", "value_unit_amount", "value_cal_type", "comm_start_dd_indi", "fin_prod_indicator", "ra_object", "min_loan_amt", "reg_part_witdr_per", "bucket_fill_option_ad", "pld_grace_period", "lapse_method", "free_witdr_times", "spouse_waiver", "pers_annu_tax_term", "full_prepayment", "self_confirm", "wait_days_af_lapse", "editable", "has_flexible_period", "flexible_period", "first_of_month", "forward_allowed", "period_type_for_forward", "max_period_for_forward", "indx_indi", "indx_year", "auto_backdate_indi", "is_gio", "max_exercise_time", "is_debt", "product_indicator", "simplify_uw"],
	      "_coltypes": ["int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "dtm", "num", "num", "num", "int", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "str", "num", "num", "int", "int", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "dtm", "int", "dtm", "dtm", "int", "str", "str", "str", "int", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "str", "str", "int", "str", "str", "str", "str", "str", "str", "int", "str", "num", "str", "str", "str", "int", "str", "int", "int", "int", "int", "num", "num", "int", "int", "str", "str", "str", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "int", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "int", "str", "str", "str", "int", "num", "str", "int", "str", "int", "str", "int", "num", "int", "num", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "int", "str", "int", "num", "str", "str", "int", "str", "str", "str", "int", "str", "str", "num", "str", "str", "str", "str", "int", "int", "int", "str", "str", "str", "int", "str", "str", "int", "str", "str", "str", "str", "str", "str", "num", "str", "str", "str", "int", "str", "str", "num", "num", "str", "str", "str", "int", "str", "str", "str", "str", "num", "str", "int", "int", "int", "int", "str", "str", "str", "str", "int", "str", "str", "int", "str", "str", "str", "int", "str", "int", "str", "str", "int", "str", "int", "str"],
	      "_key_product_id": [["5013", "*"]],
	      "_keys": [["product_id", "int"]]
	    }
	  },
	  "product_sa_limit": {
	    "5013:0:*:*:0:0:0": [10000000.0, 2000000000.0, 0, 99999, 0, 99999],
	    "_meta": {
	      "_cols": ["insd_min_amount", "insd_max_amount", "premium_min_factor", "premium_max_factor", "income_min_factor", "income_max_factor"],
	      "_coltypes": ["num", "num", "num", "num", "num", "num"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_gender": [["*", "*"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job": [["*", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["5013", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["age_month", "num"], ["gender", "str"], ["job", "str"], ["insured_status", "str"], ["pay_mode", "int"], ["special_auth", "int"]]
	    }
	  },
	  "product_unit_rate": {
	    "5013": [1000, 1000, 0, 0, 0, 0, 0, 0],
	    "_meta": {
	      "_cols": ["sa_unit_amount", "em_unit_amount", "cash_value_unit_amount", "mort_unit_amount", "rev_bonus_unit_amount", "cash_bonus_unit_amount", "tml_bonus_unit_amount", "premium_unit_amount"],
	      "_coltypes": ["int", "int", "int", "int", "int", "int", "int", "int"],
	      "_key_product_id": [["5013", "*"]],
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
	    "5013:0:0:0:0:0": [3011, "1", 10000000.0, 2000000000.0, 400, "2005-05-15 00:00:00", 400, "2010-08-09 00:00:00", "0", 0],
	    "_meta": {
	      "_cols": ["list_id", "limit_unit", "insd_min_amount", "insd_max_amount", "recorder_id", "insert_time", "updater_id", "update_time", "declaration_type", "max_sa_per_life"],
	      "_coltypes": ["int", "str", "num", "num", "int", "dtm", "int", "dtm", "str", "int"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job_cate": [["0", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["5013", "*"]],
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
	        "proposal_date": "13-01-2016",
	        "proposal_start_date": "01-01-2016",
	        "pay_method": "cash",
	        "prem_freq": "4",
	        "people": [{ "name": "Insured",
	            "dob": "13-12-1982",
	            "gender": "male",
	            "job_class": 1,
	            "age": 33
	        }, { "name": "Policyholder",
	            "dob": "07-07-1980",
	            "gender": "male",
	            "job_class": 1,
	            "age": 35
	        }, { "name": "Spouse",
	            "dob": "13-12-1967",
	            "gender": "female",
	            "job_class": 1,
	            "age": 48
	        }],
	        "products": [{ "product_id": 5722,
	            "internal_id": "IFLE03",
	            "target_premium": 300000,
	            "rtu": 500000,
	            "basic_sa": 250000000,
	            "la": 0,
	            "premium_term": 10,
	            "funds": [{ "fund_code": "AER",
	                "fund_name": "ACE Rupiah Equity Fund",
	                "allocation": 0.10
	            }, { "fund_code": "AER2",
	                "fund_name": "ACE Rupiah Equity Fund 2",
	                "allocation": 0.40
	            }, { "fund_code": "AER3",
	                "fund_name": "ACE Rupiah Equity Fund 3",
	                "allocation": 0.25
	            }, { "fund_code": "AER4",
	                "fund_name": "ACE Rupiah Equity Fund 4",
	                "allocation": 0.25
	            }],
	            "loadings": [{ "type": "amount", "rate": 0.2 }]
	        }, { "product_id": 5013,
	            "internal_id": "IADR01",
	            "initial_sa": 20000000,
	            "la": 0
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
	    internal_id: "IADR01",
	    proposal_start_date: "proposal_start_date__01",
	    age_method: "age_method__01",
	    max_t: "zero",
	    cover_term: "cover_term__03",
	    cover_duration: "cover_duration__01",
	    maturity_age: "maturity_age__02",
	    age_at_t: "age_at_t__02",
	    entry_age: "entry_age__01",
	    cor_at_t: "cor_at_t__01",
	    total_cor: "total_cor__01",
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
	    prem: "zero",
	    sa_calculated: "sa_calculated__02",
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
	        validate_rider: 'validate_rider__01',
	        check_sa_limit: 'check_sa_limit__01',
	        check_age_limit: 'check_age_limit__01',
	        check_sa_multiple: 'check_sa_multiple__02',
	        check_prem_limit: 'noop'

	    },
	    input: { "la": "int", "initial_sa": "num", "pay_mode": "str", "coverage_term": "int" },
	    si_colnames: ["Year", "Age", "Annual Premium", "Acc Premium", "SB", "Acc SB", "Gtd Cash Value", "Tot Cash Value", "Death Benefit", "Total Death Benefit"],
	    si_fields: ['t', 'age_at_t', 'pol.pol_apt', 'pol.pol_tpp', 'sbg', "accsb", "svg", "tsv", "dbt", "tot_dbt"]

	};

/***/ }
/******/ ])
});
;