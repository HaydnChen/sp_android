(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "moment"], factory);
	else if(typeof exports === 'object')
		exports["product_5722"] = factory(require("lodash"), require("moment"));
	else
		root["product_5722"] = factory(root["lodash"], root["moment"]);
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

	console.log("Product 5722 is ready...");
	var exps = { product_id: 5722, code: code, inputjson: inputjson, config: config };

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

	"use strict";module.exports={"admin_surrender_charge":{"5722:30:179":[50000.0],"5722:30:206":[50000.0],"_meta":{"_cols":["charge_rate"],"_coltypes":["num"],"_key_money_id":[["30","*"]],"_key_product_id":[["5722","*"]],"_key_withdraw_type":[["179","*"],["206","*"]],"_keys":[["product_id","int"],["money_id","int"],["withdraw_type","int"]]}},"age_limit":{"5722:2:0:100:3:0:100:0:0:0:0:100:0:0:0.0:0:N:0:0":[25236,"5",30,66,100,100,100,100,100,999,999,"1",0,999,999,"1",0,999,400,"2014-07-03 00:00:00",400,"2014-12-27 00:00:00","1",0,"1","1",100,100],"_meta":{"_cols":["list_id","min_insd_nb_age_unit","min_insd_nb_age","max_insd_nb_age","max_insd_rn_age","max_insd_nb_pu_age","max_insd_rn_pu_age","max_insd_nb_ex_age","max_insd_rn_ex_age","max_ph_nb_age","max_ph_rn_age","min_ji_nb_age_unit","min_ji_nb_age","max_ji_nb_age","max_ji_rn_age","min_topup_age_unit","min_topup_age","max_topup_age","recorder_id","insert_time","updater_id","update_time","max_insd_nb_age_unit","min_ph_nb_age","max_ji_nb_age_unit","max_topup_age_unit","pay_year_max","max_deferment_age"],"_coltypes":["int","str","int","int","int","int","int","int","int","int","int","str","int","int","int","str","int","int","int","dtm","int","dtm","str","int","str","str","int","int"],"_key_charge_period":[["2","*"]],"_key_charge_type":[["0","*"]],"_key_charge_year":[["0","*"]],"_key_charge_year_max":[["100","*"]],"_key_coverage_period":[["3","*"]],"_key_coverage_year":[["0","*"]],"_key_coverage_year_max":[["100","*"]],"_key_end_period":[["0","*"]],"_key_end_year":[["0","*"]],"_key_end_year_max":[["100","*"]],"_key_gender":[["N","*"]],"_key_insured_status":[["0","*"]],"_key_pay_ensure":[["0","*"]],"_key_pay_mode":[["0","*"]],"_key_pay_period":[["0","*"]],"_key_pay_year":[["0","*"]],"_key_product_id":[["5722","*"]],"_key_sa":[["0.0","9999999999.0"]],"_key_special_auth":[["0","*"]],"_keys":[["product_id","int"],["charge_period","str"],["charge_year","int"],["charge_year_max","int"],["coverage_period","str"],["coverage_year","int"],["coverage_year_max","int"],["pay_period","str"],["pay_year","int"],["end_period","str"],["end_year","int"],["end_year_max","int"],["pay_ensure","int"],["charge_type","str"],["sa","num"],["pay_mode","int"],["gender","str"],["insured_status","str"],["special_auth","int"]]}},"allowed_multiple_times_of_target_premium_unit_link":{"5722:0:*:*:*":[5.0,10000.0],"5722:16:*:*:*":[5.0,10000.0],"5722:21:*:*:*":[5.0,10000.0],"5722:26:*:*:*":[5.0,10000.0],"5722:31:*:*:*":[5.0,10000.0],"5722:36:*:*:*":[5.0,10000.0],"5722:41:*:*:*":[5.0,10000.0],"5722:46:*:*:*":[5.0,10000.0],"5722:51:*:*:*":[5.0,10000.0],"5722:56:*:*:*":[5.0,10000.0],"5722:61:*:*:*":[5.0,10000.0],"5722:66:*:*:*":[5.0,10000.0],"_meta":{"_cols":["multiple_times_low","multiple_times_high"],"_coltypes":["num","num"],"_key_age":[["31","35"],["21","25"],["16","20"],["51","55"],["36","40"],["26","30"],["66","70"],["41","45"],["46","50"],["56","60"],["61","65"],["0","15"]],"_key_gender":[["*","*"]],"_key_payment_frequency":[["*","*"]],"_key_product_id":[["5722","*"]],"_key_special_input":[["*","*"]],"_keys":[["product_id","int"],["age","int"],["gender","str"],["payment_frequency","str"],["special_input","str"]]}},"cash_bonus_rate":{},"cash_value":{},"deduction_rate_for_coi":{"5722:1:~":[1.0],"5722:3:1":[1.0],"5722:3:~":[1.0],"5722:8:1":[0.9],"5722:8:~":[1.0],"_meta":{"_cols":["rate"],"_coltypes":["num"],"_key_discount_type":[["1","*"],["~","*"]],"_key_policy_year":[["8","999"],["1","2"],["3","7"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["policy_year","int"],["discount_type","str"]]}},"em_fee_rate":{"5722:*:F:0:*":[1.38],"5722:*:F:10:*":[1.38],"5722:*:F:11:*":[1.38],"5722:*:F:12:*":[1.38],"5722:*:F:13:*":[1.38],"5722:*:F:14:*":[1.38],"5722:*:F:15:*":[1.38],"5722:*:F:16:*":[1.38],"5722:*:F:17:*":[1.38],"5722:*:F:18:*":[1.38],"5722:*:F:19:*":[1.53],"5722:*:F:1:*":[1.38],"5722:*:F:20:*":[1.71],"5722:*:F:21:*":[1.86],"5722:*:F:22:*":[1.96],"5722:*:F:23:*":[2.02],"5722:*:F:24:*":[2.05],"5722:*:F:25:*":[2.04],"5722:*:F:26:*":[2.02],"5722:*:F:27:*":[1.97],"5722:*:F:28:*":[1.93],"5722:*:F:29:*":[1.91],"5722:*:F:2:*":[1.38],"5722:*:F:30:*":[1.9],"5722:*:F:31:*":[1.9],"5722:*:F:32:*":[1.91],"5722:*:F:33:*":[1.92],"5722:*:F:34:*":[1.93],"5722:*:F:35:*":[1.97],"5722:*:F:36:*":[2.02],"5722:*:F:37:*":[2.11],"5722:*:F:38:*":[2.23],"5722:*:F:39:*":[2.37],"5722:*:F:3:*":[1.38],"5722:*:F:40:*":[2.54],"5722:*:F:41:*":[2.72],"5722:*:F:42:*":[2.91],"5722:*:F:43:*":[3.09],"5722:*:F:44:*":[3.28],"5722:*:F:45:*":[3.51],"5722:*:F:46:*":[3.77],"5722:*:F:47:*":[4.1],"5722:*:F:48:*":[4.5],"5722:*:F:49:*":[4.88],"5722:*:F:4:*":[1.38],"5722:*:F:50:*":[5.33],"5722:*:F:51:*":[5.85],"5722:*:F:52:*":[6.39],"5722:*:F:53:*":[6.93],"5722:*:F:54:*":[7.43],"5722:*:F:55:*":[7.85],"5722:*:F:56:*":[8.18],"5722:*:F:57:*":[8.45],"5722:*:F:58:*":[8.75],"5722:*:F:59:*":[9.51],"5722:*:F:5:*":[1.38],"5722:*:F:60:*":[10.47],"5722:*:F:61:*":[11.65],"5722:*:F:62:*":[12.99],"5722:*:F:63:*":[14.37],"5722:*:F:64:*":[15.8],"5722:*:F:65:*":[17.37],"5722:*:F:66:*":[19.09],"5722:*:F:67:*":[20.98],"5722:*:F:68:*":[23.06],"5722:*:F:69:*":[25.34],"5722:*:F:6:*":[1.38],"5722:*:F:70:*":[27.28],"5722:*:F:71:*":[29.37],"5722:*:F:72:*":[31.59],"5722:*:F:73:*":[33.95],"5722:*:F:74:*":[36.47],"5722:*:F:75:*":[39.16],"5722:*:F:76:*":[42.01],"5722:*:F:77:*":[45.03],"5722:*:F:78:*":[48.23],"5722:*:F:79:*":[51.61],"5722:*:F:7:*":[1.38],"5722:*:F:80:*":[56.6],"5722:*:F:81:*":[62.04],"5722:*:F:82:*":[67.99],"5722:*:F:83:*":[74.48],"5722:*:F:84:*":[81.55],"5722:*:F:85:*":[89.25],"5722:*:F:86:*":[97.63],"5722:*:F:87:*":[106.73],"5722:*:F:88:*":[116.61],"5722:*:F:89:*":[127.32],"5722:*:F:8:*":[1.38],"5722:*:F:90:*":[138.9],"5722:*:F:91:*":[151.42],"5722:*:F:92:*":[164.91],"5722:*:F:93:*":[179.44],"5722:*:F:94:*":[195.04],"5722:*:F:95:*":[211.75],"5722:*:F:96:*":[229.6],"5722:*:F:97:*":[248.61],"5722:*:F:98:*":[268.79],"5722:*:F:99:*":[290.14],"5722:*:F:9:*":[1.38],"5722:*:M:0:*":[1.38],"5722:*:M:10:*":[1.38],"5722:*:M:11:*":[1.38],"5722:*:M:12:*":[1.38],"5722:*:M:13:*":[1.38],"5722:*:M:14:*":[1.38],"5722:*:M:15:*":[1.53],"5722:*:M:16:*":[1.71],"5722:*:M:17:*":[1.86],"5722:*:M:18:*":[1.96],"5722:*:M:19:*":[2.02],"5722:*:M:1:*":[1.38],"5722:*:M:20:*":[2.05],"5722:*:M:21:*":[2.04],"5722:*:M:22:*":[2.02],"5722:*:M:23:*":[1.97],"5722:*:M:24:*":[1.93],"5722:*:M:25:*":[1.91],"5722:*:M:26:*":[1.9],"5722:*:M:27:*":[1.9],"5722:*:M:28:*":[1.91],"5722:*:M:29:*":[1.92],"5722:*:M:2:*":[1.38],"5722:*:M:30:*":[1.93],"5722:*:M:31:*":[1.97],"5722:*:M:32:*":[2.02],"5722:*:M:33:*":[2.11],"5722:*:M:34:*":[2.23],"5722:*:M:35:*":[2.37],"5722:*:M:36:*":[2.54],"5722:*:M:37:*":[2.72],"5722:*:M:38:*":[2.91],"5722:*:M:39:*":[3.09],"5722:*:M:3:*":[1.38],"5722:*:M:40:*":[3.28],"5722:*:M:41:*":[3.51],"5722:*:M:42:*":[3.77],"5722:*:M:43:*":[4.1],"5722:*:M:44:*":[4.5],"5722:*:M:45:*":[4.88],"5722:*:M:46:*":[5.33],"5722:*:M:47:*":[5.85],"5722:*:M:48:*":[6.39],"5722:*:M:49:*":[6.93],"5722:*:M:4:*":[1.38],"5722:*:M:50:*":[7.43],"5722:*:M:51:*":[7.85],"5722:*:M:52:*":[8.18],"5722:*:M:53:*":[8.45],"5722:*:M:54:*":[8.75],"5722:*:M:55:*":[9.51],"5722:*:M:56:*":[10.47],"5722:*:M:57:*":[11.65],"5722:*:M:58:*":[12.99],"5722:*:M:59:*":[14.37],"5722:*:M:5:*":[1.38],"5722:*:M:60:*":[15.8],"5722:*:M:61:*":[17.37],"5722:*:M:62:*":[19.09],"5722:*:M:63:*":[20.98],"5722:*:M:64:*":[23.06],"5722:*:M:65:*":[25.34],"5722:*:M:66:*":[27.28],"5722:*:M:67:*":[29.37],"5722:*:M:68:*":[31.59],"5722:*:M:69:*":[33.95],"5722:*:M:6:*":[1.38],"5722:*:M:70:*":[36.47],"5722:*:M:71:*":[39.16],"5722:*:M:72:*":[42.01],"5722:*:M:73:*":[45.03],"5722:*:M:74:*":[48.23],"5722:*:M:75:*":[51.61],"5722:*:M:76:*":[56.6],"5722:*:M:77:*":[62.04],"5722:*:M:78:*":[67.99],"5722:*:M:79:*":[74.48],"5722:*:M:7:*":[1.38],"5722:*:M:80:*":[81.55],"5722:*:M:81:*":[89.25],"5722:*:M:82:*":[97.63],"5722:*:M:83:*":[106.73],"5722:*:M:84:*":[116.61],"5722:*:M:85:*":[127.32],"5722:*:M:86:*":[138.9],"5722:*:M:87:*":[151.42],"5722:*:M:88:*":[164.91],"5722:*:M:89:*":[179.44],"5722:*:M:8:*":[1.38],"5722:*:M:90:*":[195.04],"5722:*:M:91:*":[211.75],"5722:*:M:92:*":[229.6],"5722:*:M:93:*":[248.61],"5722:*:M:94:*":[268.79],"5722:*:M:95:*":[290.14],"5722:*:M:96:*":[312.65],"5722:*:M:97:*":[336.26],"5722:*:M:98:*":[360.92],"5722:*:M:99:*":[386.53],"5722:*:M:9:*":[1.38],"_meta":{"_cols":["assign_amount"],"_coltypes":["num"],"_key_age":[["69","*"],["56","*"],["46","*"],["78","*"],["28","*"],["27","*"],["10","*"],["1","*"],["34","*"],["79","*"],["81","*"],["37","*"],["83","*"],["19","*"],["22","*"],["68","*"],["44","*"],["96","*"],["87","*"],["88","*"],["16","*"],["2","*"],["13","*"],["80","*"],["89","*"],["15","*"],["90","*"],["14","*"],["12","*"],["71","*"],["75","*"],["39","*"],["50","*"],["0","*"],["36","*"],["76","*"],["11","*"],["95","*"],["9","*"],["45","*"],["66","*"],["63","*"],["74","*"],["5","*"],["97","*"],["72","*"],["48","*"],["7","*"],["59","*"],["57","*"],["99","*"],["8","*"],["30","*"],["40","*"],["29","*"],["84","*"],["91","*"],["55","*"],["70","*"],["52","*"],["20","*"],["31","*"],["60","*"],["62","*"],["54","*"],["94","*"],["85","*"],["6","*"],["32","*"],["24","*"],["23","*"],["21","*"],["73","*"],["93","*"],["4","*"],["49","*"],["47","*"],["18","*"],["86","*"],["42","*"],["67","*"],["41","*"],["51","*"],["43","*"],["26","*"],["25","*"],["58","*"],["64","*"],["98","*"],["82","*"],["61","*"],["35","*"],["92","*"],["38","*"],["3","*"],["17","*"],["53","*"],["65","*"],["33","*"],["77","*"]],"_key_em_value":[["*","*"]],"_key_gender":[["F","*"],["M","*"]],"_key_premium_year":[["*","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["premium_year","int"],["gender","str"],["age","int"],["em_value","int"]]}},"expense_fee_default":{"5722:2:0:1:*":[1.0],"5722:2:0:2:*":[1.0],"5722:2:0:3:*":[0.4],"5722:2:0:4:*":[0.0],"5722:3:0:1:*":[0.05],"5722:3:0:2:*":[0.05],"5722:3:0:3:*":[0.05],"5722:3:0:4:*":[0.05],"5722:4:0:1:*":[0.05],"5722:4:0:2:*":[0.05],"5722:4:0:3:*":[0.05],"5722:4:0:4:*":[0.05],"_meta":{"_cols":["assign_rate"],"_coltypes":["num"],"_key_discount_type":[["0","*"]],"_key_policy_year":[["1","1"],["4","999"],["2","2"],["3","3"]],"_key_prem_type":[["4","*"],["3","*"],["2","*"]],"_key_premium":[["*","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["prem_type","str"],["discount_type","str"],["policy_year","int"],["premium","num"]]}},"free_look_charge":{"5722:*":[150000.0],"_meta":{"_cols":["charge_rate"],"_coltypes":["num"],"_key_money_id":[["*","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["money_id","int"]]}},"insurance_charge_rate":{"5722:0:F:*:*:*:1900-01-01":[1.38],"5722:0:M:*:*:*:1900-01-01":[1.38],"5722:10:F:*:*:*:1900-01-01":[1.38],"5722:10:M:*:*:*:1900-01-01":[1.38],"5722:11:F:*:*:*:1900-01-01":[1.38],"5722:11:M:*:*:*:1900-01-01":[1.38],"5722:12:F:*:*:*:1900-01-01":[1.38],"5722:12:M:*:*:*:1900-01-01":[1.38],"5722:13:F:*:*:*:1900-01-01":[1.38],"5722:13:M:*:*:*:1900-01-01":[1.38],"5722:14:F:*:*:*:1900-01-01":[1.38],"5722:14:M:*:*:*:1900-01-01":[1.38],"5722:15:F:*:*:*:1900-01-01":[1.38],"5722:15:M:*:*:*:1900-01-01":[1.53],"5722:16:F:*:*:*:1900-01-01":[1.38],"5722:16:M:*:*:*:1900-01-01":[1.71],"5722:17:F:*:*:*:1900-01-01":[1.38],"5722:17:M:*:*:*:1900-01-01":[1.86],"5722:18:F:*:*:*:1900-01-01":[1.38],"5722:18:M:*:*:*:1900-01-01":[1.96],"5722:19:F:*:*:*:1900-01-01":[1.53],"5722:19:M:*:*:*:1900-01-01":[2.02],"5722:1:F:*:*:*:1900-01-01":[1.38],"5722:1:M:*:*:*:1900-01-01":[1.38],"5722:20:F:*:*:*:1900-01-01":[1.71],"5722:20:M:*:*:*:1900-01-01":[2.05],"5722:21:F:*:*:*:1900-01-01":[1.86],"5722:21:M:*:*:*:1900-01-01":[2.04],"5722:22:F:*:*:*:1900-01-01":[1.96],"5722:22:M:*:*:*:1900-01-01":[2.02],"5722:23:F:*:*:*:1900-01-01":[2.02],"5722:23:M:*:*:*:1900-01-01":[1.97],"5722:24:F:*:*:*:1900-01-01":[2.05],"5722:24:M:*:*:*:1900-01-01":[1.93],"5722:25:F:*:*:*:1900-01-01":[2.04],"5722:25:M:*:*:*:1900-01-01":[1.91],"5722:26:F:*:*:*:1900-01-01":[2.02],"5722:26:M:*:*:*:1900-01-01":[1.9],"5722:27:F:*:*:*:1900-01-01":[1.97],"5722:27:M:*:*:*:1900-01-01":[1.9],"5722:28:F:*:*:*:1900-01-01":[1.93],"5722:28:M:*:*:*:1900-01-01":[1.91],"5722:29:F:*:*:*:1900-01-01":[1.91],"5722:29:M:*:*:*:1900-01-01":[1.92],"5722:2:F:*:*:*:1900-01-01":[1.38],"5722:2:M:*:*:*:1900-01-01":[1.38],"5722:30:F:*:*:*:1900-01-01":[1.9],"5722:30:M:*:*:*:1900-01-01":[1.93],"5722:31:F:*:*:*:1900-01-01":[1.9],"5722:31:M:*:*:*:1900-01-01":[1.97],"5722:32:F:*:*:*:1900-01-01":[1.91],"5722:32:M:*:*:*:1900-01-01":[2.02],"5722:33:F:*:*:*:1900-01-01":[1.92],"5722:33:M:*:*:*:1900-01-01":[2.11],"5722:34:F:*:*:*:1900-01-01":[1.93],"5722:34:M:*:*:*:1900-01-01":[2.23],"5722:35:F:*:*:*:1900-01-01":[1.97],"5722:35:M:*:*:*:1900-01-01":[2.37],"5722:36:F:*:*:*:1900-01-01":[2.02],"5722:36:M:*:*:*:1900-01-01":[2.54],"5722:37:F:*:*:*:1900-01-01":[2.11],"5722:37:M:*:*:*:1900-01-01":[2.72],"5722:38:F:*:*:*:1900-01-01":[2.23],"5722:38:M:*:*:*:1900-01-01":[2.91],"5722:39:F:*:*:*:1900-01-01":[2.37],"5722:39:M:*:*:*:1900-01-01":[3.09],"5722:3:F:*:*:*:1900-01-01":[1.38],"5722:3:M:*:*:*:1900-01-01":[1.38],"5722:40:F:*:*:*:1900-01-01":[2.54],"5722:40:M:*:*:*:1900-01-01":[3.28],"5722:41:F:*:*:*:1900-01-01":[2.72],"5722:41:M:*:*:*:1900-01-01":[3.51],"5722:42:F:*:*:*:1900-01-01":[2.91],"5722:42:M:*:*:*:1900-01-01":[3.77],"5722:43:F:*:*:*:1900-01-01":[3.09],"5722:43:M:*:*:*:1900-01-01":[4.1],"5722:44:F:*:*:*:1900-01-01":[3.28],"5722:44:M:*:*:*:1900-01-01":[4.5],"5722:45:F:*:*:*:1900-01-01":[3.51],"5722:45:M:*:*:*:1900-01-01":[4.88],"5722:46:F:*:*:*:1900-01-01":[3.77],"5722:46:M:*:*:*:1900-01-01":[5.33],"5722:47:F:*:*:*:1900-01-01":[4.1],"5722:47:M:*:*:*:1900-01-01":[5.85],"5722:48:F:*:*:*:1900-01-01":[4.5],"5722:48:M:*:*:*:1900-01-01":[6.39],"5722:49:F:*:*:*:1900-01-01":[4.88],"5722:49:M:*:*:*:1900-01-01":[6.93],"5722:4:F:*:*:*:1900-01-01":[1.38],"5722:4:M:*:*:*:1900-01-01":[1.38],"5722:50:F:*:*:*:1900-01-01":[5.33],"5722:50:M:*:*:*:1900-01-01":[7.43],"5722:51:F:*:*:*:1900-01-01":[5.85],"5722:51:M:*:*:*:1900-01-01":[7.85],"5722:52:F:*:*:*:1900-01-01":[6.39],"5722:52:M:*:*:*:1900-01-01":[8.18],"5722:53:F:*:*:*:1900-01-01":[6.93],"5722:53:M:*:*:*:1900-01-01":[8.45],"5722:54:F:*:*:*:1900-01-01":[7.43],"5722:54:M:*:*:*:1900-01-01":[8.75],"5722:55:F:*:*:*:1900-01-01":[7.85],"5722:55:M:*:*:*:1900-01-01":[9.51],"5722:56:F:*:*:*:1900-01-01":[8.18],"5722:56:M:*:*:*:1900-01-01":[10.47],"5722:57:F:*:*:*:1900-01-01":[8.45],"5722:57:M:*:*:*:1900-01-01":[11.65],"5722:58:F:*:*:*:1900-01-01":[8.75],"5722:58:M:*:*:*:1900-01-01":[12.99],"5722:59:F:*:*:*:1900-01-01":[9.51],"5722:59:M:*:*:*:1900-01-01":[14.37],"5722:5:F:*:*:*:1900-01-01":[1.38],"5722:5:M:*:*:*:1900-01-01":[1.38],"5722:60:F:*:*:*:1900-01-01":[10.47],"5722:60:M:*:*:*:1900-01-01":[15.8],"5722:61:F:*:*:*:1900-01-01":[11.65],"5722:61:M:*:*:*:1900-01-01":[17.37],"5722:62:F:*:*:*:1900-01-01":[12.99],"5722:62:M:*:*:*:1900-01-01":[19.09],"5722:63:F:*:*:*:1900-01-01":[14.37],"5722:63:M:*:*:*:1900-01-01":[20.98],"5722:64:F:*:*:*:1900-01-01":[15.8],"5722:64:M:*:*:*:1900-01-01":[23.06],"5722:65:F:*:*:*:1900-01-01":[17.37],"5722:65:M:*:*:*:1900-01-01":[25.34],"5722:66:F:*:*:*:1900-01-01":[19.09],"5722:66:M:*:*:*:1900-01-01":[27.28],"5722:67:F:*:*:*:1900-01-01":[20.98],"5722:67:M:*:*:*:1900-01-01":[29.37],"5722:68:F:*:*:*:1900-01-01":[23.06],"5722:68:M:*:*:*:1900-01-01":[31.59],"5722:69:F:*:*:*:1900-01-01":[25.34],"5722:69:M:*:*:*:1900-01-01":[33.95],"5722:6:F:*:*:*:1900-01-01":[1.38],"5722:6:M:*:*:*:1900-01-01":[1.38],"5722:70:F:*:*:*:1900-01-01":[27.28],"5722:70:M:*:*:*:1900-01-01":[36.47],"5722:71:F:*:*:*:1900-01-01":[29.37],"5722:71:M:*:*:*:1900-01-01":[39.16],"5722:72:F:*:*:*:1900-01-01":[31.59],"5722:72:M:*:*:*:1900-01-01":[42.01],"5722:73:F:*:*:*:1900-01-01":[33.95],"5722:73:M:*:*:*:1900-01-01":[45.03],"5722:74:F:*:*:*:1900-01-01":[36.47],"5722:74:M:*:*:*:1900-01-01":[48.23],"5722:75:F:*:*:*:1900-01-01":[39.16],"5722:75:M:*:*:*:1900-01-01":[51.61],"5722:76:F:*:*:*:1900-01-01":[42.01],"5722:76:M:*:*:*:1900-01-01":[56.6],"5722:77:F:*:*:*:1900-01-01":[45.03],"5722:77:M:*:*:*:1900-01-01":[62.04],"5722:78:F:*:*:*:1900-01-01":[48.23],"5722:78:M:*:*:*:1900-01-01":[67.99],"5722:79:F:*:*:*:1900-01-01":[51.61],"5722:79:M:*:*:*:1900-01-01":[74.48],"5722:7:F:*:*:*:1900-01-01":[1.38],"5722:7:M:*:*:*:1900-01-01":[1.38],"5722:80:F:*:*:*:1900-01-01":[56.6],"5722:80:M:*:*:*:1900-01-01":[81.55],"5722:81:F:*:*:*:1900-01-01":[62.04],"5722:81:M:*:*:*:1900-01-01":[89.25],"5722:82:F:*:*:*:1900-01-01":[67.99],"5722:82:M:*:*:*:1900-01-01":[97.63],"5722:83:F:*:*:*:1900-01-01":[74.48],"5722:83:M:*:*:*:1900-01-01":[106.73],"5722:84:F:*:*:*:1900-01-01":[81.55],"5722:84:M:*:*:*:1900-01-01":[116.61],"5722:85:F:*:*:*:1900-01-01":[89.25],"5722:85:M:*:*:*:1900-01-01":[127.32],"5722:86:F:*:*:*:1900-01-01":[97.63],"5722:86:M:*:*:*:1900-01-01":[138.9],"5722:87:F:*:*:*:1900-01-01":[106.73],"5722:87:M:*:*:*:1900-01-01":[151.42],"5722:88:F:*:*:*:1900-01-01":[116.61],"5722:88:M:*:*:*:1900-01-01":[164.91],"5722:89:F:*:*:*:1900-01-01":[127.32],"5722:89:M:*:*:*:1900-01-01":[179.44],"5722:8:F:*:*:*:1900-01-01":[1.38],"5722:8:M:*:*:*:1900-01-01":[1.38],"5722:90:F:*:*:*:1900-01-01":[138.9],"5722:90:M:*:*:*:1900-01-01":[195.04],"5722:91:F:*:*:*:1900-01-01":[151.42],"5722:91:M:*:*:*:1900-01-01":[211.75],"5722:92:F:*:*:*:1900-01-01":[164.91],"5722:92:M:*:*:*:1900-01-01":[229.6],"5722:93:F:*:*:*:1900-01-01":[179.44],"5722:93:M:*:*:*:1900-01-01":[248.61],"5722:94:F:*:*:*:1900-01-01":[195.04],"5722:94:M:*:*:*:1900-01-01":[268.79],"5722:95:F:*:*:*:1900-01-01":[211.75],"5722:95:M:*:*:*:1900-01-01":[290.14],"5722:96:F:*:*:*:1900-01-01":[229.6],"5722:96:M:*:*:*:1900-01-01":[312.65],"5722:97:F:*:*:*:1900-01-01":[248.61],"5722:97:M:*:*:*:1900-01-01":[336.26],"5722:98:F:*:*:*:1900-01-01":[268.79],"5722:98:M:*:*:*:1900-01-01":[360.92],"5722:99:F:*:*:*:1900-01-01":[290.14],"5722:99:M:*:*:*:1900-01-01":[386.53],"5722:9:F:*:*:*:1900-01-01":[1.38],"5722:9:M:*:*:*:1900-01-01":[1.38],"_meta":{"_cols":["result_value_1"],"_coltypes":["num"],"_key_age":[["44","*"],["87","*"],["65","*"],["66","*"],["86","*"],["41","*"],["42","*"],["43","*"],["4","*"],["40","*"],["35","*"],["37","*"],["32","*"],["31","*"],["36","*"],["33","*"],["34","*"],["38","*"],["39","*"],["47","*"],["48","*"],["67","*"],["88","*"],["49","*"],["5","*"],["68","*"],["89","*"],["9","*"],["50","*"],["51","*"],["52","*"],["69","*"],["7","*"],["90","*"],["53","*"],["70","*"],["71","*"],["72","*"],["91","*"],["92","*"],["93","*"],["74","*"],["75","*"],["96","*"],["97","*"],["54","*"],["55","*"],["73","*"],["94","*"],["95","*"],["56","*"],["29","*"],["3","*"],["30","*"],["16","*"],["98","*"],["57","*"],["58","*"],["76","*"],["99","*"],["59","*"],["77","*"],["78","*"],["79","*"],["6","*"],["60","*"],["8","*"],["80","*"],["10","*"],["17","*"],["18","*"],["19","*"],["2","*"],["20","*"],["0","*"],["21","*"],["1","*"],["22","*"],["23","*"],["11","*"],["12","*"],["13","*"],["24","*"],["25","*"],["14","*"],["26","*"],["15","*"],["27","*"],["28","*"],["81","*"],["82","*"],["83","*"],["61","*"],["45","*"],["46","*"],["62","*"],["84","*"],["85","*"],["63","*"],["64","*"]],"_key_discount_type":[["*","*"]],"_key_effective_date":[["1900-01-01","9999-09-09"]],"_key_gender":[["F","*"],["M","*"]],"_key_policy_year":[["*","*"]],"_key_product_id":[["5722","*"]],"_key_smoking_indi":[["*","*"]],"_keys":[["product_id","int"],["age","int"],["gender","str"],["smoking_indi","str"],["policy_year","int"],["discount_type","str"],["effective_date","dtm"]]}},"investment_performance":{"5722:HIGH":[0.18],"5722:LOW":[0.06],"5722:MID":[0.12],"_meta":{"_cols":["rate"],"_coltypes":["num"],"_key_product_id":[["5722","*"]],"_key_type":[["LOW","*"],["MID","*"],["HIGH","*"]],"_keys":[["product_id","int"],["type","str"]]}},"liability_config":{"5722:303":["N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N",0,"N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","2014-07-03 00:00:00","2014-07-03 00:00:00",1,10414,1021,"N","N",1],"_meta":{"_cols":["pay_period","pay_month","pay_age1","pay_age2","pay_end_period","pay_end_year","pay_pay_ensure","pay_pay_type","pay_premium_year","liab_prem_year","liab_period","liab_charge_type","liab_gender","liab_age","liab_month","liab_liab_age","liab_bene_level","liab_pay_ensure","wait_days","surgery_type","sickroom_type","hospital_speci","hospital_type","relation_s","claim_cnt","once_except","once_pay_rate","once_per_pay_limit","year_except","year_per_pay_limit","coverage_except","coverage_per_pay_limit","life_pay_limit","day_per_pay_limit","month_per_pay_limit","pay_age","hospital_owner","hospital_time","pay_amount","insert_time","update_time","sur_amount","list_id","sur_formula","liab_job_class","pay_low_prem","formula_indi"],"_coltypes":["str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","int","str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","str","dtm","dtm","int","int","int","str","str","int"],"_key_liab_id":[["303","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["liab_id","int"]]}},"lien_rate":{"5712:0":[0.2],"5712:2":[0.4],"5712:3":[0.6],"5712:4":[0.8],"5712:5":[1.0],"_meta":{"_cols":["lien_rate"],"_coltypes":["num"],"_key_age":[["0","1"],["2","2"],["3","3"],["4","4"],["5","100"]],"_key_product_id":[["5712","*"]],"_keys":[["product_id","int"],["age","int"]]}},"main_rider_age_limit":{"5722:5004":[0,999,0,999],"5722:5005":[0,999,0,999],"5722:5006":[0,999,0,999],"5722:5007":[0,999,0,999],"5722:5009":[0,999,0,999],"5722:5010":[0,999,0,999],"5722:5012":[0,999,0,999],"5722:5013":[0,999,0,999],"5722:5015":[0,999,0,999],"5722:5721":[0,999,0,999],"5722:5740":[0,999,0,999],"5722:5741":[0,999,0,999],"5722:5742":[0,999,0,999],"5722:5743":[0,999,0,999],"5722:5744":[0,999,0,999],"_meta":{"_cols":["min_ath_age","max_ath_age","min_ath_mast_age","max_ath_mast_age"],"_coltypes":["int","int","int","int"],"_key_attach_id":[["5004","*"],["5005","*"],["5006","*"],["5007","*"],["5009","*"],["5010","*"],["5012","*"],["5013","*"],["5015","*"],["5721","*"],["5740","*"],["5741","*"],["5742","*"],["5743","*"],["5744","*"]],"_key_master_id":[["5722","*"]],"_keys":[["master_id","int"],["attach_id","int"]]}},"main_rider_sa_limit":{"5722:5004:0:N:*":[0.0,9999.0,1e+16,0.0,9999.0,"W",0,999999999999],"5722:5005:0:N:*":[0.0,9999.0,1e+16,0.0,9999.0,"W",0,999999999999],"5722:5006:0:N:*":[0.0,9999.0,1e+16,0.0,9999.0,"W",0,999999999999],"5722:5007:0:N:*":[0.0,9999.0,1e+16,0.0,9999.0,"W",0,999999999999],"5722:5009:0:N:*":[0.0,9999.0,1e+16,0.0,9999.0,"W",0,999999999999],"5722:5010:0:N:*":[0.0,9999.0,1e+16,0.0,9999.0,"W",0,999999999999],"5722:5012:0:N:*":[0.0,9999.0,1e+16,0.0,9999.0,"W",0,999999999999],"5722:5013:0:N:*":[0.0,9999.0,1e+16,0.0,9999.0,"W",0,999999999999],"5722:5015:0:N:*":[0.0,9999.0,1e+16,0.0,9999.0,"W",0,999999999999],"5722:5721:0:N:*":[0.0,9.0,1e+16,0.0,9.0,"W",0,999999999999],"5722:5740:0:N:*":[0.0,9.0,1e+16,0.0,9.0,"W",0,999999999999],"5722:5741:0:N:*":[0.0,9.0,1e+16,0.0,9.0,"W",0,999999999999],"5722:5742:0:N:*":[0.0,9.0,1e+16,0.0,9.0,"W",0,999999999999],"5722:5743:0:N:*":[0.0,9.0,1e+16,0.0,9.0,"W",0,999999999999],"5722:5744:0:N:*":[0.0,9.0,1e+16,0.0,9.0,"W",0,999999999999],"_meta":{"_cols":["min_ath_sa_rate","max_ath_sa_rate","max_ath_sa_amt","min_mast_sa_amt","total_over_rate","no_equal","min_ath_mast_sa_amt","max_ath_mast_sa_amt"],"_coltypes":["num","num","num","num","num","str","num","num"],"_key_age":[["0","999"]],"_key_attach_id":[["5004","*"],["5005","*"],["5006","*"],["5007","*"],["5009","*"],["5010","*"],["5012","*"],["5013","*"],["5015","*"],["5721","*"],["5740","*"],["5741","*"],["5742","*"],["5743","*"],["5744","*"]],"_key_gender":[["N","*"]],"_key_job":[["*","*"]],"_key_master_id":[["5722","*"]],"_keys":[["master_id","int"],["attach_id","int"],["age","num"],["gender","str"],["job","str"]]}},"model_factor":{"5722:1:1:*":[1.0,1.0],"5722:1:2:*":[1.0,1.0],"5722:1:3:*":[1.0,1.0],"5722:2:1:*":[2.0,2.0],"5722:2:2:*":[2.0,2.0],"5722:2:3:*":[2.0,2.0],"5722:3:1:*":[4.0,4.0],"5722:3:2:*":[4.0,4.0],"5722:3:3:*":[4.0,4.0],"5722:4:1:*":[12.0,12.0],"5722:4:2:*":[12.0,12.0],"5722:4:3:*":[12.0,12.0],"_meta":{"_cols":["charge_rate","charge_rate_div"],"_coltypes":["num","num"],"_key_charge_type":[["3","*"],["1","*"],["2","*"],["4","*"]],"_key_model_type":[["2","*"],["3","*"],["1","*"]],"_key_pay_mode":[["*","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["charge_type","str"],["model_type","int"],["pay_mode","int"]]}},"pay_liability":{"5722:303:9999:0:0:999:999:0.0:0:0:0:0":[1000.0],"_meta":{"_cols":["pay_amount"],"_coltypes":["num"],"_key_age1":[["999","*"]],"_key_age2":[["999","*"]],"_key_end_period":[["0","*"]],"_key_end_year":[["0","*"]],"_key_liab_id":[["303","*"]],"_key_month":[["9999","*"]],"_key_pay_ensure":[["0","*"]],"_key_pay_type":[["0","*"]],"_key_period":[["0","*"]],"_key_prem":[["0.0","1e+14"]],"_key_premium_year":[["0","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["liab_id","int"],["month","int"],["period","int"],["premium_year","int"],["age1","int"],["age2","int"],["prem","num"],["end_period","str"],["end_year","int"],["pay_ensure","int"],["pay_type","str"]]}},"policy_fee_ilp_default":{"5722:*:1:1:0":[360000.0],"5722:*:1:2:0":[360000.0],"5722:*:1:3:0":[420000.0],"5722:*:1:4:0":[480000.0],"_meta":{"_cols":["assign_rate"],"_coltypes":["num"],"_key_charge_type":[["2","*"],["4","*"],["1","*"],["3","*"]],"_key_discount_type":[["0","*"]],"_key_fund_code":[["*","*"]],"_key_policy year":[["1","999"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["fund_code","str"],["policy year","int"],["charge_type","int"],["discount_type","str"]]}},"prem_limit":{"5722:0:1":[24320,2400000.0,100000000000000.0,2400000.0,100000000000000.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0,999,0.0,0.0,0],"5722:0:2":[24321,1200000.0,100000000000000.0,1200000.0,100000000000000.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0,999,0.0,0.0,0],"5722:0:3":[24322,600000.0,100000000000000.0,600000.0,100000000000000.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0,999,0.0,0.0,0],"5722:0:4":[24323,200000.0,100000000000000.0,200000.0,100000000000000.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0,999,0.0,0.0,0],"_meta":{"_cols":["list_id","min_initial_prem","max_initial_prem","min_subseq_prem","max_subseq_prem","min_incremnt_prem","min_regu_topup_prem","min_regu_topup_incr","min_ad_topup_prem","recorder_id","insert_time","updater_id","update_time","min_age","max_age","min_decremnt_prem","min_regu_topup_decr","special_auth"],"_coltypes":["int","num","num","num","num","num","num","num","num","int","dtm","int","dtm","int","int","num","num","int"],"_key_charge_type":[["1","*"],["2","*"],["3","*"],["4","*"]],"_key_pay_mode":[["0","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["pay_mode","int"],["charge_type","str"]]}},"prod_fund_prem_limit":{"5722:AER2:0:0":[0.0,100000000000000.0,0.0,100000000000000.0,0.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0],"5722:AER3:0:0":[0.0,100000000000000.0,0.0,100000000000000.0,0.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0],"5722:AER4:0:0":[0.0,100000000000000.0,0.0,100000000000000.0,0.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0],"5722:AER:0:0":[0.0,100000000000000.0,0.0,100000000000000.0,0.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0],"5722:AFR:0:0":[0.0,100000000000000.0,0.0,100000000000000.0,0.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0],"5722:AMMR:0:0":[0.0,100000000000000.0,0.0,100000000000000.0,0.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0],"5722:AMR:0:0":[0.0,100000000000000.0,0.0,100000000000000.0,0.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0],"5722:ASBR:0:0":[0.0,100000000000000.0,0.0,100000000000000.0,0.0,0.0,0.0,0.0,500000.0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0],"_meta":{"_cols":["min_initial_prem","max_initial_prem","min_subseq_prem","max_subseq_prem","min_incremnt_prem","min_decremnt_prem","min_regu_topup_prem","min_regu_topup_incr","min_ad_topup_prem","recorder_id","insert_time","updater_id","update_time","min_regu_topup_decr"],"_coltypes":["num","num","num","num","num","num","num","num","num","int","dtm","int","dtm","num"],"_key_charge_type":[["0","*"]],"_key_fund_code":[["AER","*"],["AER2","*"],["AER3","*"],["AER4","*"],["AFR","*"],["AMMR","*"],["AMR","*"],["ASBR","*"]],"_key_pay_mode":[["0","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["fund_code","str"],["pay_mode","int"],["charge_type","str"]]}},"product_allowables":{"attachable_riders":[[[5004,"1","0","N"],[5005,"1","0","N"],[5006,"1","0","N"],[5007,"1","0","N"],[5009,"1","0","N"],[5010,"1","0","N"],[5012,"1","0","N"],[5013,"1","0","N"],[5015,"1","0","N"],[5721,"1","0","N"],[5740,"1","0","N"],[5741,"1","0","N"],[5742,"1","0","N"],[5743,"1","0","N"],[5744,"1","0","N"]],["int","str","str","str"],["attach_id","attach_type","attach_compulsory","gender"]],"bonus_options":[[],["int"],["mode_id"]],"coverage_terms":[[["3",100]],["str","int"],["coverage_period","coverage_year"]],"currencies":[[[30]],["int"],["money_id"]],"funds":[[["AER"],["AER2"],["AER3"],["AER4"],["AFR"],["AMMR"],["AMR"],["ASBR"]],["str"],["fund_code"]],"organizations":[[[101]],["int"],["organ_id"]],"pay_methods":[[["1","0",1],["1","0",2],["1","0",3],["1","0",15],["1","0",22],["1","0",23],["1","0",30],["1","0",33],["1","0",80],["1","0",92],["1","0",93],["1","0",94],["1","0",96],["1","0",97],["2","0",1],["2","0",2],["2","0",3],["2","0",15],["2","0",22],["2","0",23],["2","0",30],["2","0",33],["2","0",80],["2","0",92],["2","0",93],["2","0",94],["2","0",96],["2","0",97],["3","0",1],["3","0",2],["3","0",3],["3","0",15],["3","0",22],["3","0",23],["3","0",30],["3","0",33],["3","0",80],["3","0",92],["3","0",93],["3","0",94],["3","0",96],["3","0",97],["4","0",1],["4","0",2],["4","0",3],["4","0",15],["4","0",22],["4","0",23],["4","0",30],["4","0",33],["4","0",80],["4","0",92],["4","0",93],["4","0",94],["4","0",96],["4","0",97]],["str","str","int"],["charge_type","prem_sequen","pay_mode"]],"payment_freq":[[["3"],["1"],["4"],["2"]],["str"],["charge_type"]],"premium_terms":[[["2",3],["2",4],["2",5],["2",6],["2",7],["2",8],["2",9],["2",10],["2",11],["2",12],["2",13],["2",14],["2",15],["2",16],["2",17],["2",18],["2",19],["2",20],["2",21],["2",22],["2",23],["2",24],["2",25],["2",26],["2",27],["2",28],["2",29],["2",30],["2",31],["2",32],["2",33],["2",34],["2",35],["2",36],["2",37],["2",38],["2",39],["2",40],["2",41],["2",42],["2",43],["2",44],["2",45],["2",46],["2",47],["2",48],["2",49],["2",50],["2",51],["2",52],["2",53],["2",54],["2",55],["2",56],["2",57],["2",58],["2",59],["2",60],["2",61],["2",62],["2",63],["2",64],["2",65],["2",66],["2",67],["2",68],["2",69],["2",70],["2",71],["2",72],["2",73],["2",74],["2",75],["2",76],["2",77],["2",78],["2",79],["2",80],["2",81],["2",82],["2",83],["2",84],["2",85],["2",86],["2",87],["2",88],["2",89],["2",90],["2",91],["2",92],["2",93],["2",94],["2",95],["2",96],["2",97],["2",98],["2",99]],["str","int"],["charge_period","charge_year"]],"qualifications":[[[1]],["int"],["test_type_id"]],"strategies":[[["0",0]],["str","int"],["strategy_code","tariff_type"]],"survival_options":[[],["str"],["survival_option"]]},"product_charge_list":{"5722:1":["6","0","TSTPK_000000001000726",0,0,"0",1,"N",1213,"N"],"5722:15":["9","0","CRSPK_100000000000294",1,0,"5",1,"N",1214,"N"],"5722:17":["6","0","TSTPK_100000000000344",0,0,"0",1,"N",1215,"N"],"5722:4":["1","0","TSTPK_000000001000920",1,0,"0",1,"N",1216,"N"],"5722:5":["3","0","TSTPK_100000000000282",1,3,"4",1,"N",1217,"N"],"5722:6":["3","0","TSTPK_100000000000278",1,1,"4",1,"N",1218,"N"],"5722:8":["6","0","TSTPK_000000001002940",0,0,"5",1,"N",1219,"N"],"5722:9":["3","0","TSTPK_000000001003249",1,2,"4",1,"N",1220,"N"],"_meta":{"_cols":["fee_source","fee_base","formula_id","deduct_mode","deduct_order","deduct_frequency","calc_base","calc_base_same_tiv","list_id","follow_prem_frequency"],"_coltypes":["str","str","str","int","int","str","int","str","int","str"],"_key_charge_code":[["1","*"],["15","*"],["17","*"],["4","*"],["5","*"],["6","*"],["8","*"],["9","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["charge_code","str"]]}},"product_fund":{"5722:AER":[0,0,1000000,0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0,"1",9999,9999,0,"0",0,"0",0,0,0,1,"0",1],"5722:AER2":[0,0,1000000,0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0,"1",9999,9999,0,"0",0,"0",0,0,0,1,"0",1],"5722:AER3":[0,0,1000000,0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0,"1",9999,9999,0,"0",0,"0",0,0,0,1,"0",1],"5722:AER4":[0,0,1000000,0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0,"1",9999,9999,0,"0",0,"0",0,0,0,1,"0",1],"5722:AFR":[0,0,1000000,0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0,"1",9999,9999,0,"0",0,"0",0,0,0,1,"0",1],"5722:AMMR":[0,0,1000000,0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0,"1",9999,9999,0,"0",0,"0",0,0,0,1,"0",1],"5722:AMR":[0,0,1000000,0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0,"1",9999,9999,0,"0",0,"0",0,0,0,1,"0",1],"5722:ASBR":[0,0,1000000,0,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00",0.0,"1",9999,9999,0,"0",0,"0",0,0,0,1,"0",1],"_meta":{"_cols":["min_sur_val","min_sur_remain_val","min_swit_out_val","min_swit_remain_val","recorder_id","insert_time","updater_id","update_time","switch_fee_percnt","switch_period_unit","max_swit_in_times","max_swit_out_times","max_sur_val","settle_rate_period_unit","settle_year_type","settle_freq","settle_month","settle_day","settle_method","guaranteed_rate_option","settle_simple_compound","bonus_settle_type"],"_coltypes":["int","int","int","int","int","dtm","int","dtm","num","str","int","int","int","str","int","str","int","int","int","int","str","int"],"_key_fund_code":[["AER","*"],["AER2","*"],["AER3","*"],["AER4","*"],["AFR","*"],["AMMR","*"],["AMR","*"],["ASBR","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["fund_code","str"]]}},"product_life":{"5722":[1,"ABC FLEXIBLE UNIT LINK","IFLE03","IFLE03","","0","1","0","1","N","","1999-01-01 00:00:00","3999-01-01 00:00:00",0.0,0.0,0.0,9999,9999999999.0,"N","Y","","N","N","","41","0","3","0","0","Y","N","N",0.0,"Y","","N",0.0,0.0,0,0,0.0,"N","RPULA","1","1","2","","1","N","Y","N","N","Y",400,"2014-07-03 00:00:00",401,"2015-02-10 00:00:00","",0,"0","N","N",0,0,"","1","N","N","N","N","N","N","N",30,"0","1","1",45,"N","2","4","N","N","N",0,"N",0.0,"N","N","0",9999,"1",9999,9999,0,0,1000000.0,5000000.0,0,99,"1","","Regular Premium ILP Front-End Load","N",9999999999.0,"2","N","N","N","1","N","N","N","Y","",65,"N",0.0,"N","0","Y","N","N","0","N","N","Y","Y",0.0,"N","Y",0,"N","N","N",0,0.0,"N",2,"N",30,"N",24,50000.0,2,1.0,999,"Y","1","Y","N","N","5","Y","Y","1",0,"N",0,"N",0,0.0,"N","1",0,"Y","N","1",1,"4","N",0.0,"N","N","3","N",0,0,0,"Y","N","0",0,"0","0",0,"2","0","2","N","N","N",0.0,"N","N","0",0,"N","N",0.0,0.0,"3","N","N",0,"","N","0","9",0.0,"N",1,45,2,2,"N","N","N","N",21,"Y","N",0,"Y","N","0",0,"N",0,"Y","N",0,"Y",2,"N"],"_meta":{"_cols":["organ_id","product_name","product_abbr","internal_id","hospital_type","unit_flag","ins_type","ally","individual_group","value","exception","start_date","end_date","life_rate","sudden_rate","ill_rate","em","check_amount","renew","pregnant_insured","underwrite_class","attachable","insure_month","duty","benefit_type","target_type","period_type","underwrite_job","surr_permit","add_permit","apl_permit","loan_permit","actuary_rate","table_prem","ss_claim_formula","reduce_paidup","min_sur_amount","min_add_amount","min_add_units","min_sur_units","min_claim_amount","mortagage","initial_id","section_cal_type","period_cal_type","age_base","bonus_cal_type","premium_define","regu_to_single","sa_accum","universal_prem","guarantee_renew","checked","insert_person","insert_date","updater_id","update_time","sys_lock_time","sys_locker_id","sys_lock_status","pseudo","permit_prs","prs_unit_amount","prs_formula","policyholder","prem_table","related_type_prem2","related_prem2","fee_year_prem2","age_prem2","gender_prem2","comm_amount","uw_manual","base_money","gst_indicator","stamp_indicator","plan_type","grace_period","grace_follow","age_method","rn_date_type","follow_discnt","large_sa_discnt","prem_vouch_permit","prem_vouch_rate","defer_period","joint_adjust_rate","waiver","waiver_benefit","waiver_basis","max_switch_times","switch_period_unit","max_swit_in_times","max_swit_out_times","rup_product_id","eta_product_id","min_sur_value","min_remain_value","min_defer_period","max_defer_period","switch_method","product_name_2","feature_desc","payer_wop","max_waiv_prem_ann","gurnt_period_type","receipt_indi","proof_age","full_declare","ph_la_relation","hth_full_declare","advan_program","uw_jet","backdate_indi","start_backdate","backdate_period","postdate_indi","max_comp_commi","dopp_indi","policy_section","assignment_indi","conversion_priv","purc_new_pol","unexpire_rate_meth","bonus_encash","la_change","free_look_indi","free_look_follow","admin_charge","stand_alone_rider","partial_withdraw","invest_delay","cash_bonus_indi","rev_bonus_indi","tml_bonus_indi","eta_endo_prod","tml_bonus_int_rate","bereavement_indi","max_reins_period","eta_permit","free_look_period","stand_life_indi","non_lap_period","switch_fee","free_switch_times","max_gib_rate","max_gib_age","incr_prem_permit","max_reins_peri_unit","surr_charge_indi","special_discnt","apilp_indi","backdate_unit","topup_permit","reg_topup_permit","gurnt_period_unit","gurnt_period","hi_pol_fee_indi","grace_period_add","overdue_int_indi","eta_term_prod","annuity_surr_fac","annuity_notice_indi","annuity_notice_unit","annuity_notice_period","decrease_permit","prefer_life_indi","free_switch_unit","free_switch_period","par_non_ilp","gib_permit","max_loan_rate","matu_loan_permit","special_revival_permit","stampduty_option","ladr_indi","bonus_vest_year_clm","bonus_vest_year_surr","cb_vest_year","is_net_invest","auto_reduce_paidup","after_eta_option","gsv_vest_year","phd_rate_cate","ri_calc_basis","ri_calc_formula","ri_renewal_freq","ri_factor_table_code","ri_age_base","asset_share","gja_indi","gsc_indi","apilp_k","uptoage_indi","spouse_prod_indi","benefit_freq_indi","risk_aggr_formula","prem_change_notice","aurp_specific_terms","waiver_interest_rate","db_base_clm","bucket_filling_option","follow_commision","formula_driven","value_unit_amount","value_cal_type","comm_start_dd_indi","fin_prod_indicator","ra_object","min_loan_amt","reg_part_witdr_per","bucket_fill_option_ad","pld_grace_period","lapse_method","free_witdr_times","spouse_waiver","pers_annu_tax_term","full_prepayment","self_confirm","wait_days_af_lapse","editable","has_flexible_period","flexible_period","first_of_month","forward_allowed","period_type_for_forward","max_period_for_forward","indx_indi","indx_year","auto_backdate_indi","is_gio","max_exercise_time","is_debt","product_indicator","simplify_uw"],"_coltypes":["int","str","str","str","str","str","str","str","str","str","str","dtm","dtm","num","num","num","int","num","str","str","str","str","str","str","str","str","str","str","str","str","str","str","num","str","str","str","num","num","int","int","num","str","str","str","str","str","str","str","str","str","str","str","str","int","dtm","int","dtm","dtm","int","str","str","str","int","int","str","str","str","str","str","str","str","str","str","int","str","str","str","int","str","str","str","str","str","str","int","str","num","str","str","str","int","str","int","int","int","int","num","num","int","int","str","str","str","str","num","str","str","str","str","str","str","str","str","str","dtm","int","str","num","str","str","str","str","str","str","str","str","str","str","num","str","str","int","str","str","str","int","num","str","int","str","int","str","int","num","int","num","int","str","str","str","str","str","str","str","str","str","int","str","int","str","int","num","str","str","int","str","str","str","int","str","str","num","str","str","str","str","int","int","int","str","str","str","int","str","str","int","str","str","str","str","str","str","num","str","str","str","int","str","str","num","num","str","str","str","int","str","str","str","str","num","str","int","int","int","int","str","str","str","str","int","str","str","int","str","str","str","int","str","int","str","str","int","str","int","str"],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"]]}},"product_sa_limit":{"5722:0:*:*:0:0:0":[0.0,1e+16,0,99999,0,99999],"_meta":{"_cols":["insd_min_amount","insd_max_amount","premium_min_factor","premium_max_factor","income_min_factor","income_max_factor"],"_coltypes":["num","num","num","num","num","num"],"_key_age_month":[["0","9999"]],"_key_gender":[["*","*"]],"_key_insured_status":[["0","*"]],"_key_job":[["*","*"]],"_key_pay_mode":[["0","*"]],"_key_product_id":[["5722","*"]],"_key_special_auth":[["0","*"]],"_keys":[["product_id","int"],["age_month","num"],["gender","str"],["job","str"],["insured_status","str"],["pay_mode","int"],["special_auth","int"]]}},"product_unit_rate":{"5722":[1000,1000,0,1000,0,0,0,0],"_meta":{"_cols":["sa_unit_amount","em_unit_amount","cash_value_unit_amount","mort_unit_amount","rev_bonus_unit_amount","cash_bonus_unit_amount","tml_bonus_unit_amount","premium_unit_amount"],"_coltypes":["int","int","int","int","int","int","int","int"],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"]]}},"rev_bonus_rate":{},"rider_rider_sa_limit":{"_meta":{"_cols":["min_ath_sa_rate","max_ath_sa_rate","max_ath_sa_amt","min_mast_sa_amt","total_over_rate","no_equal"],"_coltypes":["num","num","num","num","num","str"],"_key_age":[],"_key_attach_id":[],"_key_gender":[],"_key_job":[],"_key_master_id":[],"_keys":[["master_id","int"],["attach_id","int"],["age","num"],["gender","str"],["job","str"]]}},"sa_limit":{"5722:0:0:0:0:0":[103637,"1",0.0,1e+16,400,"2014-07-03 00:00:00",400,"2014-07-03 00:00:00","0",0],"_meta":{"_cols":["list_id","limit_unit","insd_min_amount","insd_max_amount","recorder_id","insert_time","updater_id","update_time","declaration_type","max_sa_per_life"],"_coltypes":["int","str","num","num","int","dtm","int","dtm","str","int"],"_key_age_month":[["0","9999"]],"_key_insured_status":[["0","*"]],"_key_job_cate":[["0","*"]],"_key_pay_mode":[["0","*"]],"_key_product_id":[["5722","*"]],"_key_special_auth":[["0","*"]],"_keys":[["product_id","int"],["pay_mode","int"],["insured_status","str"],["age_month","int"],["job_cate","int"],["special_auth","int"]]}},"surrender_charge_rate":{"5722:*:0":[50000.0],"5722:*:1":[30000.0],"_meta":{"_cols":["surrender charge"],"_coltypes":["num"],"_key_discount_type":[["1","*"],["0","*"]],"_key_policy year":[["*","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["policy year","int"],["discount_type","str"]]}},"switch_fee_rate":{"5722:*:0":[50000,0.001],"5722:*:1":[30000,0.001],"_meta":{"_cols":["switch fee amount","switch fee rate"],"_coltypes":["int","num"],"_key_discount_type":[["1","*"],["0","*"]],"_key_fund code":[["*","*"]],"_key_product_id":[["5722","*"]],"_keys":[["product_id","int"],["fund code","str"],["discount_type","str"]]}},"tml_bonus_rate":{}};

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
	            "dob": "13-12-1986",
	            "gender": "male",
	            "job_class": 1,
	            "age": 33
	        }, { "name": "Policyholder",
	            "dob": "07-07-1980",
	            "gender": "male",
	            "age": 35
	        }, { "name": "Spouse",
	            "dob": "13-12-1967",
	            "gender": "female",
	            "age": 48
	        }],
	        "products": [{ "product_id": 5722,
	            "internal_id": "IFLE03",
	            "target_premium": 3000000,
	            "rtu": 5000000,
	            "basic_sa": 250000000,
	            "la": 0,
	            "premium_term": 10,
	            "funds": [{ "fund_code": "AER",
	                "fund_name": "ACE Rupiah Equity Fund",
	                "allocation": 0.25
	            }, { "fund_code": "AER2",
	                "fund_name": "ACE Rupiah Equity Fund 2",
	                "allocation": 0.25
	            }, { "fund_code": "AER3",
	                "fund_name": "ACE Rupiah Equity Fund 3",
	                "allocation": 0.25
	            }, { "fund_code": "AER4",
	                "fund_name": "ACE Rupiah Equity Fund 4",
	                "allocation": 0.25
	            }],
	            "loadings": [{ "type": "amount", "rate": 0.2 }]
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
	                           internal_id: "IFLE03",
	                           proposal_start_date: "proposal_start_date__01",
	                           age_method: "age_method__01",
	                           max_t: "coverage_term__01",
	                           cover_term: "coverage_term__01",
	                           cover_duration: "cover_duration__01",
	                           maturity_age: "maturity_age__01",
	                           age_at_t: "age_at_t__01",
	                           entry_age: "entry_age__01",
	                           ph_entry_age: "ph_entry_age__01",
	                           coi_at_t: "coi_at_t__01",
	                           coi: "coi__01",
	                           monthly_cor: "zero",
	                           monthly_coi: "monthly_coi__01",
	                           basic_cost_at_t: "basic_cost_at_t__01",
	                           total_loadings: "total_loadings__01",
	                           //    pol_fee_after_modal_factor : "pol_fee_after_modal_factor__02",
	                           //    pol_fee_before_modal_factor : "pol_fee_before_modal_factor__01",   
	                           pol_fee_after_modal_factor: "zero",
	                           pol_fee_before_modal_factor: "zero",
	                           tiv_low_at_t: ["tiv_low_at_t__01", "round_thousand_half_up"],
	                           tiv_mid_at_t: ["tiv_mid_at_t__01", "round_thousand_half_up"],
	                           tiv_high_at_t: ["tiv_high_at_t__01", "round_thousand_half_up"],
	                           atu_at_t: ["atu_at_t__01", "round_thousand_half_up"],
	                           in_at_t: ["in_at_t__01", "round_thousand_half_up"],
	                           rtu_at_t: ["rtu_at_t__01", "round_thousand_half_up"],
	                           regular_topup_at_t: ["regular_topup_at_t__01", "round_thousand_half_up"],
	                           tp_at_t: ["tp_at_t__01", "round_thousand_half_up"],
	                           target_premium_at_t: ["target_premium_at_t__01", "round_thousand_half_up"],
	                           pol_fee_at_t: "pol_fee_at_t__01",
	                           mac_at_t: "zero",
	                           cor_at_t: "zero",
	                           total_cor_at_t: "total_cor_at_t__01",
	                           accum_cor_at_t: "accum_cor_at_t__01",
	                           withdrawal_at_t: ["withdrawal_at_t__01", "round_thousand_half_up"],
	                           out_at_t: ["out_at_t__01", "round_thousand_half_up"],
	                           debt_at_t: ["debt_at_t__01", "round_thousand_half_up"],
	                           debt_for_t: "debt_for_t__01",
	                           debt_paid_at_t: ["debt_paid_at_t__01", "round_thousand_half_up"],
	                           debt_repay_for_t: "debt_repay_for_t__01",
	                           debt_accum_period: "debt_accum_period__02",
	                           debt_repay_period: "debt_repay_period__01",
	                           outstd_debt_at_t: "outstd_debt_at_t__01",
	                           accum_factor: "accum_factor__01",
	                           prem: "ilp_prem__10",
	                           sa_calculated: "sa_calculated__01",
	                           ap: "ilp_ap__10",
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
	                           tot_dbt: ["tot_dbt__01", "round_dollar_half_up"],
	                           tb: "zero",
	                           cb: "zero",
	                           acccb: "zero",
	                           rb: "zero",
	                           accrb: "zero",
	                           sbg: "zero",
	                           accsb: "zero",
	                           accsbrate: "zero",
	                           svg: "zero",
	                           tsv: ["tsv__01", "round_dollar_half_up"],
	                           mbg: "zero",
	                           tiv: "zero",
	                           tdc: "zero",
	                           eod: "zero",
	                           validators: {
	                                                      validate_main: 'validate_main__02',
	                                                      validate_all_riders: 'validate_all_riders__01',
	                                                      validate_rider: 'validate_rider__01',
	                                                      check_sa_limit: 'check_sa_limit__01',
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
	                           input: { proposal_date: 'date', contract_date: 'date', la: 'str', initial_sa: "num",
	                                                      target_prem: "num", rtu: "num", premium_term: "num",
	                                                      payment_frequency: "str", payment_method: "int" },
	                           si_colnames: ["Year", "Age", "Target Prem", "RTU", "Topup", "Withdrl", "TIV-low", "TIV-mid", "TIV-high", "Death-low", "Death-mid", "Death-high"],
	                           si_fields: ['t', 'age_at_t', 'target_premium_at_t', 'regular_topup_at_t', 'in_at_t', "out_at_t", "tiv_low_at_t", "tiv_mid_at_t", "tiv_high_at_t", "db_low_at_t", "db_mid_at_t", "db_high_at_t"],
	                           si_colwidths: [0.05, 0.05, 0.08, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.1, 0.1]

	};

/***/ }
/******/ ])
});
;