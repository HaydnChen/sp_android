(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "moment"], factory);
	else if(typeof exports === 'object')
		exports["product_5742"] = factory(require("lodash"), require("moment"));
	else
		root["product_5742"] = factory(root["lodash"], root["moment"]);
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

	console.log("Product 5742 is ready...");
	var exps = { product_id: 5742, code: code, inputjson: inputjson, config: config };

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
	export function premium_ratereimbursement( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    let pid = _.has(factors,'product_id') ? factors.product_id : pdt.val("product_id");
	    let data = pdt.val("product_data", t, { pid : pid } );
	    let tname = 'premium_ratereimbursement';
	    let la = ppl[pdt.val("la")];
	    let gender = la.val("gender").toLowerCase();
	    if (tname in data ) {
	        let opts = {};
	        opts.job_class = la.val("job_class");
	        opts.gender = gender === 'male' ? "M" : gender === 'female' ? "F" : "W";
	        opts.age = pdt.val("age_at_t",t);
	        opts.benefit_level = pdt.val("benefit_level",t,factors).level;
	        opts.effective_date = pol.val("proposal_start_date");
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
	export function benefit_level( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    let pid = _.has(factors,'product_id') ? factors.product_id : pdt.val("product_id");
	    let data = pdt.val("product_data", t, { pid : pid } );
	    let tname = 'benefit_plan_level';
	    let la = ppl[pdt.val("la")];
	    let gender = la.val("gender").toLowerCase();
	    if (tname in data ) {
	        let opts = {};
	        opts.sa = pdt.val("initial_sa",t,factors);
	        opts = _.extend(opts,factors);        
	        let table = data[tname];
	        let key = utils.toKey(tname, table._meta, opts);
	        if ( key in table) {
	            let row = utils.toRow(table._meta._cols, table[key]);
	            return row ; // use row.level
	        } 
	    } 
	    return {};
	}    
	export function inflation_rate( ctx, pol, ppl, pdt, fund, t='*',factors={} ) {     
	    let opts = _.extend({year:t},factors);        
	    return table_data('inflation_rate', ctx, pol, ppl, pdt, fund,t,opts);
	}        
	    
	function table_data( tname, ctx, pol, ppl, pdt, fund, t , factors) { 
	    let pid = _.has(factors,'product_id') ? factors.product_id : pdt.val("product_id");
	    let data = pdt.val("product_data", t, { pid : pid } );
	    if (tname in data ) {
	        let table = data[tname];
	        let key = utils.toKey(tname, table._meta, factors);
	        if ( key in table) {
	            let row = utils.toRow(table._meta._cols, table[key]);
	            return row ; // use row.rate
	        } 
	    } 
	    return {};
	}            
	export function premium_ratecash_benefit( ctx, pol, ppl, pdt, fund, t='*',factors={} ) { 
	    let effdate = pol.val("proposal_start_date"), 
	        la = ppl[ pdt.val("la")],
	        gender = la.val("gender").toLowerCase(),
	        age = pdt.val("age_at_t",t),
	        level = pdt.val("benefit_level",t,factors).level;
	        effdate = moment(effdate,['D-M-YYYY','YYYY-M-D','D-M-YYYY HH:mm:ss','YYYY-M-D HH:mm:ss']).format('YYYY-MM-DD');        
	    
	        let opts = _.extend({
	            gender:gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
	            age: age,
	//            benefit_level: level,
	            effective_date: effdate });
	    
	    return table_data('premium_ratecash_benefit', ctx, pol, ppl, pdt, fund,t,opts);
	    
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
	    "5742:0:0:9999:0:0:9999:0:0:0:0:9999:0:0:0.0:0:N:0:0": [25256, "4", 6, 60, 999, 999, 999, 65, 100, 999, 999, "1", 0, 999, 999, "1", 0, 999, 400, "2014-11-12 00:00:00", 400, "2014-11-12 00:00:00", "1", 0, "1", "1", 9999, 999],
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
	      "_key_product_id": [["5742", "*"]],
	      "_key_sa": [["0.0", "9999999999.0"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["charge_period", "str"], ["charge_year", "int"], ["charge_year_max", "int"], ["coverage_period", "str"], ["coverage_year", "int"], ["coverage_year_max", "int"], ["pay_period", "str"], ["pay_year", "int"], ["end_period", "str"], ["end_year", "int"], ["end_year_max", "int"], ["pay_ensure", "int"], ["charge_type", "str"], ["sa", "num"], ["pay_mode", "int"], ["gender", "str"], ["insured_status", "str"], ["special_auth", "int"]]
	    }
	  },
	  "cash_bonus_rate": {},
	  "cash_value": {},
	  "deduction_rate_of_ud_riderdefault": {
	    "5742:5001:1": [1.0],
	    "5742:5001:26": [1.0],
	    "5742:5001:86": [1.0],
	    "5742:5002:1": [1.0],
	    "5742:5002:26": [1.0],
	    "5742:5002:86": [1.0],
	    "5742:5017:1": [1.0],
	    "5742:5017:26": [1.0],
	    "5742:5017:86": [1.0],
	    "5742:5047:1": [1.0],
	    "5742:5047:26": [1.0],
	    "5742:5047:86": [1.0],
	    "5742:5461:1": [1.0],
	    "5742:5461:26": [1.0],
	    "5742:5461:86": [1.0],
	    "5742:5659:1": [1.0],
	    "5742:5659:26": [1.0],
	    "5742:5659:86": [1.0],
	    "5742:5722:1": [1.0],
	    "5742:5722:26": [1.0],
	    "5742:5722:86": [1.0],
	    "5742:5803:1": [1.0],
	    "5742:5803:26": [1.0],
	    "5742:5803:86": [1.0],
	    "_meta": {
	      "_cols": ["deduct rate"],
	      "_coltypes": ["num"],
	      "_key_policy month": [["1", "25"], ["26", "85"], ["86", "1189"]],
	      "_key_product attached": [["5722", "*"], ["5017", "*"], ["5002", "*"], ["5803", "*"], ["5001", "*"], ["5047", "*"], ["5461", "*"], ["5659", "*"]],
	      "_key_product_id": [["5742", "*"]],
	      "_keys": [["product_id", "int"], ["product attached", "int"], ["policy month", "int"]]
	    }
	  },
	  "liability_config": {},
	  "model_factor": {
	    "5742:4:1:*": [12.0, 12.0],
	    "5742:4:2:*": [12.0, 12.0],
	    "5742:4:3:*": [12.0, 12.0],
	    "_meta": {
	      "_cols": ["charge_rate", "charge_rate_div"],
	      "_coltypes": ["num", "num"],
	      "_key_charge_type": [["4", "*"]],
	      "_key_model_type": [["3", "*"], ["1", "*"], ["2", "*"]],
	      "_key_pay_mode": [["*", "*"]],
	      "_key_product_id": [["5742", "*"]],
	      "_keys": [["product_id", "int"], ["charge_type", "str"], ["model_type", "int"], ["pay_mode", "int"]]
	    }
	  },
	  "pay_liability": {},
	  "prem_limit": {
	    "5742:0:0": [24346, 0.0, 100000000000000.0, 0.0, 100000000000000.0, 0.0, 0.0, 0.0, 0.0, 400, "2014-11-12 00:00:00", 400, "2014-11-12 00:00:00", 0, 999, 0.0, 0.0, 0],
	    "_meta": {
	      "_cols": ["list_id", "min_initial_prem", "max_initial_prem", "min_subseq_prem", "max_subseq_prem", "min_incremnt_prem", "min_regu_topup_prem", "min_regu_topup_incr", "min_ad_topup_prem", "recorder_id", "insert_time", "updater_id", "update_time", "min_age", "max_age", "min_decremnt_prem", "min_regu_topup_decr", "special_auth"],
	      "_coltypes": ["int", "num", "num", "num", "num", "num", "num", "num", "num", "int", "dtm", "int", "dtm", "int", "int", "num", "num", "int"],
	      "_key_charge_type": [["0", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["5742", "*"]],
	      "_keys": [["product_id", "int"], ["pay_mode", "int"], ["charge_type", "str"]]
	    }
	  },
	  "premium_ratecash_benefit": {
	    "5742:F:0:*:1900-01-01": [24000.0],
	    "5742:F:0:*:2011-02-01": [32000.0],
	    "5742:F:10:*:1900-01-01": [24000.0],
	    "5742:F:10:*:2011-02-01": [32000.0],
	    "5742:F:11:*:1900-01-01": [24000.0],
	    "5742:F:11:*:2011-02-01": [32000.0],
	    "5742:F:12:*:1900-01-01": [24000.0],
	    "5742:F:12:*:2011-02-01": [32000.0],
	    "5742:F:13:*:1900-01-01": [24000.0],
	    "5742:F:13:*:2011-02-01": [32000.0],
	    "5742:F:14:*:1900-01-01": [24000.0],
	    "5742:F:14:*:2011-02-01": [32000.0],
	    "5742:F:15:*:1900-01-01": [24000.0],
	    "5742:F:15:*:2011-02-01": [32000.0],
	    "5742:F:16:*:1900-01-01": [24000.0],
	    "5742:F:16:*:2011-02-01": [32000.0],
	    "5742:F:17:*:1900-01-01": [24000.0],
	    "5742:F:17:*:2011-02-01": [32000.0],
	    "5742:F:18:*:1900-01-01": [24000.0],
	    "5742:F:18:*:2011-02-01": [32000.0],
	    "5742:F:19:*:1900-01-01": [24000.0],
	    "5742:F:19:*:2011-02-01": [32000.0],
	    "5742:F:1:*:1900-01-01": [24000.0],
	    "5742:F:1:*:2011-02-01": [32000.0],
	    "5742:F:20:*:1900-01-01": [24000.0],
	    "5742:F:20:*:2011-02-01": [32000.0],
	    "5742:F:21:*:1900-01-01": [24000.0],
	    "5742:F:21:*:2011-02-01": [32000.0],
	    "5742:F:22:*:1900-01-01": [24000.0],
	    "5742:F:22:*:2011-02-01": [32000.0],
	    "5742:F:23:*:1900-01-01": [24000.0],
	    "5742:F:23:*:2011-02-01": [32000.0],
	    "5742:F:24:*:1900-01-01": [24000.0],
	    "5742:F:24:*:2011-02-01": [32000.0],
	    "5742:F:25:*:1900-01-01": [55000.0],
	    "5742:F:25:*:2011-02-01": [72000.0],
	    "5742:F:26:*:1900-01-01": [55000.0],
	    "5742:F:26:*:2011-02-01": [72000.0],
	    "5742:F:27:*:1900-01-01": [55000.0],
	    "5742:F:27:*:2011-02-01": [72000.0],
	    "5742:F:28:*:1900-01-01": [55000.0],
	    "5742:F:28:*:2011-02-01": [72000.0],
	    "5742:F:29:*:1900-01-01": [55000.0],
	    "5742:F:29:*:2011-02-01": [72000.0],
	    "5742:F:2:*:1900-01-01": [24000.0],
	    "5742:F:2:*:2011-02-01": [32000.0],
	    "5742:F:30:*:1900-01-01": [55000.0],
	    "5742:F:30:*:2011-02-01": [72000.0],
	    "5742:F:31:*:1900-01-01": [55000.0],
	    "5742:F:31:*:2011-02-01": [72000.0],
	    "5742:F:32:*:1900-01-01": [55000.0],
	    "5742:F:32:*:2011-02-01": [72000.0],
	    "5742:F:33:*:1900-01-01": [55000.0],
	    "5742:F:33:*:2011-02-01": [72000.0],
	    "5742:F:34:*:1900-01-01": [55000.0],
	    "5742:F:34:*:2011-02-01": [72000.0],
	    "5742:F:35:*:1900-01-01": [55000.0],
	    "5742:F:35:*:2011-02-01": [72000.0],
	    "5742:F:36:*:1900-01-01": [55000.0],
	    "5742:F:36:*:2011-02-01": [72000.0],
	    "5742:F:37:*:1900-01-01": [55000.0],
	    "5742:F:37:*:2011-02-01": [72000.0],
	    "5742:F:38:*:1900-01-01": [55000.0],
	    "5742:F:38:*:2011-02-01": [72000.0],
	    "5742:F:39:*:1900-01-01": [55000.0],
	    "5742:F:39:*:2011-02-01": [72000.0],
	    "5742:F:3:*:1900-01-01": [24000.0],
	    "5742:F:3:*:2011-02-01": [32000.0],
	    "5742:F:40:*:1900-01-01": [55000.0],
	    "5742:F:40:*:2011-02-01": [72000.0],
	    "5742:F:41:*:1900-01-01": [55000.0],
	    "5742:F:41:*:2011-02-01": [72000.0],
	    "5742:F:42:*:1900-01-01": [55000.0],
	    "5742:F:42:*:2011-02-01": [72000.0],
	    "5742:F:43:*:1900-01-01": [55000.0],
	    "5742:F:43:*:2011-02-01": [72000.0],
	    "5742:F:44:*:1900-01-01": [55000.0],
	    "5742:F:44:*:2011-02-01": [72000.0],
	    "5742:F:45:*:1900-01-01": [62000.0],
	    "5742:F:45:*:2011-02-01": [81000.0],
	    "5742:F:46:*:1900-01-01": [62000.0],
	    "5742:F:46:*:2011-02-01": [81000.0],
	    "5742:F:47:*:1900-01-01": [62000.0],
	    "5742:F:47:*:2011-02-01": [81000.0],
	    "5742:F:48:*:1900-01-01": [62000.0],
	    "5742:F:48:*:2011-02-01": [81000.0],
	    "5742:F:49:*:1900-01-01": [62000.0],
	    "5742:F:49:*:2011-02-01": [81000.0],
	    "5742:F:4:*:1900-01-01": [24000.0],
	    "5742:F:4:*:2011-02-01": [32000.0],
	    "5742:F:50:*:1900-01-01": [74000.0],
	    "5742:F:50:*:2011-02-01": [97000.0],
	    "5742:F:51:*:1900-01-01": [74000.0],
	    "5742:F:51:*:2011-02-01": [97000.0],
	    "5742:F:52:*:1900-01-01": [74000.0],
	    "5742:F:52:*:2011-02-01": [97000.0],
	    "5742:F:53:*:1900-01-01": [74000.0],
	    "5742:F:53:*:2011-02-01": [97000.0],
	    "5742:F:54:*:1900-01-01": [74000.0],
	    "5742:F:54:*:2011-02-01": [97000.0],
	    "5742:F:55:*:1900-01-01": [86000.0],
	    "5742:F:55:*:2011-02-01": [112000.0],
	    "5742:F:56:*:1900-01-01": [86000.0],
	    "5742:F:56:*:2011-02-01": [112000.0],
	    "5742:F:57:*:1900-01-01": [86000.0],
	    "5742:F:57:*:2011-02-01": [112000.0],
	    "5742:F:58:*:1900-01-01": [86000.0],
	    "5742:F:58:*:2011-02-01": [112000.0],
	    "5742:F:59:*:1900-01-01": [86000.0],
	    "5742:F:59:*:2011-02-01": [112000.0],
	    "5742:F:5:*:1900-01-01": [24000.0],
	    "5742:F:5:*:2011-02-01": [32000.0],
	    "5742:F:60:*:1900-01-01": [149000.0],
	    "5742:F:60:*:2011-02-01": [194000.0],
	    "5742:F:61:*:1900-01-01": [149000.0],
	    "5742:F:61:*:2011-02-01": [194000.0],
	    "5742:F:62:*:1900-01-01": [149000.0],
	    "5742:F:62:*:2011-02-01": [194000.0],
	    "5742:F:63:*:1900-01-01": [149000.0],
	    "5742:F:63:*:2011-02-01": [194000.0],
	    "5742:F:64:*:1900-01-01": [149000.0],
	    "5742:F:64:*:2011-02-01": [194000.0],
	    "5742:F:6:*:1900-01-01": [24000.0],
	    "5742:F:6:*:2011-02-01": [32000.0],
	    "5742:F:7:*:1900-01-01": [24000.0],
	    "5742:F:7:*:2011-02-01": [32000.0],
	    "5742:F:8:*:1900-01-01": [24000.0],
	    "5742:F:8:*:2011-02-01": [32000.0],
	    "5742:F:9:*:1900-01-01": [24000.0],
	    "5742:F:9:*:2011-02-01": [32000.0],
	    "5742:M:0:*:1900-01-01": [24000.0],
	    "5742:M:0:*:2011-02-01": [32000.0],
	    "5742:M:10:*:1900-01-01": [24000.0],
	    "5742:M:10:*:2011-02-01": [32000.0],
	    "5742:M:11:*:1900-01-01": [24000.0],
	    "5742:M:11:*:2011-02-01": [32000.0],
	    "5742:M:12:*:1900-01-01": [24000.0],
	    "5742:M:12:*:2011-02-01": [32000.0],
	    "5742:M:13:*:1900-01-01": [24000.0],
	    "5742:M:13:*:2011-02-01": [32000.0],
	    "5742:M:14:*:1900-01-01": [24000.0],
	    "5742:M:14:*:2011-02-01": [32000.0],
	    "5742:M:15:*:1900-01-01": [24000.0],
	    "5742:M:15:*:2011-02-01": [32000.0],
	    "5742:M:16:*:1900-01-01": [24000.0],
	    "5742:M:16:*:2011-02-01": [32000.0],
	    "5742:M:17:*:1900-01-01": [24000.0],
	    "5742:M:17:*:2011-02-01": [32000.0],
	    "5742:M:18:*:1900-01-01": [24000.0],
	    "5742:M:18:*:2011-02-01": [32000.0],
	    "5742:M:19:*:1900-01-01": [24000.0],
	    "5742:M:19:*:2011-02-01": [32000.0],
	    "5742:M:1:*:1900-01-01": [24000.0],
	    "5742:M:1:*:2011-02-01": [32000.0],
	    "5742:M:20:*:1900-01-01": [24000.0],
	    "5742:M:20:*:2011-02-01": [32000.0],
	    "5742:M:21:*:1900-01-01": [24000.0],
	    "5742:M:21:*:2011-02-01": [32000.0],
	    "5742:M:22:*:1900-01-01": [24000.0],
	    "5742:M:22:*:2011-02-01": [32000.0],
	    "5742:M:23:*:1900-01-01": [24000.0],
	    "5742:M:23:*:2011-02-01": [32000.0],
	    "5742:M:24:*:1900-01-01": [24000.0],
	    "5742:M:24:*:2011-02-01": [32000.0],
	    "5742:M:25:*:1900-01-01": [48000.0],
	    "5742:M:25:*:2011-02-01": [63000.0],
	    "5742:M:26:*:1900-01-01": [48000.0],
	    "5742:M:26:*:2011-02-01": [63000.0],
	    "5742:M:27:*:1900-01-01": [48000.0],
	    "5742:M:27:*:2011-02-01": [63000.0],
	    "5742:M:28:*:1900-01-01": [48000.0],
	    "5742:M:28:*:2011-02-01": [63000.0],
	    "5742:M:29:*:1900-01-01": [48000.0],
	    "5742:M:29:*:2011-02-01": [63000.0],
	    "5742:M:2:*:1900-01-01": [24000.0],
	    "5742:M:2:*:2011-02-01": [32000.0],
	    "5742:M:30:*:1900-01-01": [48000.0],
	    "5742:M:30:*:2011-02-01": [63000.0],
	    "5742:M:31:*:1900-01-01": [48000.0],
	    "5742:M:31:*:2011-02-01": [63000.0],
	    "5742:M:32:*:1900-01-01": [48000.0],
	    "5742:M:32:*:2011-02-01": [63000.0],
	    "5742:M:33:*:1900-01-01": [48000.0],
	    "5742:M:33:*:2011-02-01": [63000.0],
	    "5742:M:34:*:1900-01-01": [48000.0],
	    "5742:M:34:*:2011-02-01": [63000.0],
	    "5742:M:35:*:1900-01-01": [48000.0],
	    "5742:M:35:*:2011-02-01": [63000.0],
	    "5742:M:36:*:1900-01-01": [48000.0],
	    "5742:M:36:*:2011-02-01": [63000.0],
	    "5742:M:37:*:1900-01-01": [48000.0],
	    "5742:M:37:*:2011-02-01": [63000.0],
	    "5742:M:38:*:1900-01-01": [48000.0],
	    "5742:M:38:*:2011-02-01": [63000.0],
	    "5742:M:39:*:1900-01-01": [48000.0],
	    "5742:M:39:*:2011-02-01": [63000.0],
	    "5742:M:3:*:1900-01-01": [24000.0],
	    "5742:M:3:*:2011-02-01": [32000.0],
	    "5742:M:40:*:1900-01-01": [48000.0],
	    "5742:M:40:*:2011-02-01": [63000.0],
	    "5742:M:41:*:1900-01-01": [48000.0],
	    "5742:M:41:*:2011-02-01": [63000.0],
	    "5742:M:42:*:1900-01-01": [48000.0],
	    "5742:M:42:*:2011-02-01": [63000.0],
	    "5742:M:43:*:1900-01-01": [48000.0],
	    "5742:M:43:*:2011-02-01": [63000.0],
	    "5742:M:44:*:1900-01-01": [48000.0],
	    "5742:M:44:*:2011-02-01": [63000.0],
	    "5742:M:45:*:1900-01-01": [62000.0],
	    "5742:M:45:*:2011-02-01": [81000.0],
	    "5742:M:46:*:1900-01-01": [62000.0],
	    "5742:M:46:*:2011-02-01": [81000.0],
	    "5742:M:47:*:1900-01-01": [62000.0],
	    "5742:M:47:*:2011-02-01": [81000.0],
	    "5742:M:48:*:1900-01-01": [62000.0],
	    "5742:M:48:*:2011-02-01": [81000.0],
	    "5742:M:49:*:1900-01-01": [62000.0],
	    "5742:M:49:*:2011-02-01": [81000.0],
	    "5742:M:4:*:1900-01-01": [24000.0],
	    "5742:M:4:*:2011-02-01": [32000.0],
	    "5742:M:50:*:1900-01-01": [74000.0],
	    "5742:M:50:*:2011-02-01": [97000.0],
	    "5742:M:51:*:1900-01-01": [74000.0],
	    "5742:M:51:*:2011-02-01": [97000.0],
	    "5742:M:52:*:1900-01-01": [74000.0],
	    "5742:M:52:*:2011-02-01": [97000.0],
	    "5742:M:53:*:1900-01-01": [74000.0],
	    "5742:M:53:*:2011-02-01": [97000.0],
	    "5742:M:54:*:1900-01-01": [74000.0],
	    "5742:M:54:*:2011-02-01": [97000.0],
	    "5742:M:55:*:1900-01-01": [86000.0],
	    "5742:M:55:*:2011-02-01": [112000.0],
	    "5742:M:56:*:1900-01-01": [86000.0],
	    "5742:M:56:*:2011-02-01": [112000.0],
	    "5742:M:57:*:1900-01-01": [86000.0],
	    "5742:M:57:*:2011-02-01": [112000.0],
	    "5742:M:58:*:1900-01-01": [86000.0],
	    "5742:M:58:*:2011-02-01": [112000.0],
	    "5742:M:59:*:1900-01-01": [86000.0],
	    "5742:M:59:*:2011-02-01": [112000.0],
	    "5742:M:5:*:1900-01-01": [24000.0],
	    "5742:M:5:*:2011-02-01": [32000.0],
	    "5742:M:60:*:1900-01-01": [149000.0],
	    "5742:M:60:*:2011-02-01": [194000.0],
	    "5742:M:61:*:1900-01-01": [149000.0],
	    "5742:M:61:*:2011-02-01": [194000.0],
	    "5742:M:62:*:1900-01-01": [149000.0],
	    "5742:M:62:*:2011-02-01": [194000.0],
	    "5742:M:63:*:1900-01-01": [149000.0],
	    "5742:M:63:*:2011-02-01": [194000.0],
	    "5742:M:64:*:1900-01-01": [149000.0],
	    "5742:M:64:*:2011-02-01": [194000.0],
	    "5742:M:6:*:1900-01-01": [24000.0],
	    "5742:M:6:*:2011-02-01": [32000.0],
	    "5742:M:7:*:1900-01-01": [24000.0],
	    "5742:M:7:*:2011-02-01": [32000.0],
	    "5742:M:8:*:1900-01-01": [24000.0],
	    "5742:M:8:*:2011-02-01": [32000.0],
	    "5742:M:9:*:1900-01-01": [24000.0],
	    "5742:M:9:*:2011-02-01": [32000.0],
	    "_meta": {
	      "_cols": ["premium_rate"],
	      "_coltypes": ["num"],
	      "_key_age": [["35", "*"], ["16", "*"], ["13", "*"], ["7", "*"], ["44", "*"], ["0", "*"], ["30", "*"], ["28", "*"], ["45", "*"], ["17", "*"], ["33", "*"], ["23", "*"], ["46", "*"], ["39", "*"], ["52", "*"], ["12", "*"], ["5", "*"], ["55", "*"], ["47", "*"], ["42", "*"], ["21", "*"], ["19", "*"], ["1", "*"], ["58", "*"], ["25", "*"], ["37", "*"], ["51", "*"], ["50", "*"], ["63", "*"], ["61", "*"], ["31", "*"], ["14", "*"], ["34", "*"], ["40", "*"], ["6", "*"], ["22", "*"], ["48", "*"], ["9", "*"], ["11", "*"], ["27", "*"], ["41", "*"], ["3", "*"], ["43", "*"], ["53", "*"], ["26", "*"], ["18", "*"], ["24", "*"], ["64", "*"], ["29", "*"], ["59", "*"], ["60", "*"], ["56", "*"], ["62", "*"], ["54", "*"], ["49", "*"], ["10", "*"], ["38", "*"], ["20", "*"], ["4", "*"], ["57", "*"], ["2", "*"], ["8", "*"], ["32", "*"], ["36", "*"], ["15", "*"]],
	      "_key_benefit_level": [["*", "*"]],
	      "_key_effective_date": [["2011-02-01", "2999-12-01"], ["1900-01-01", "2011-02-01"]],
	      "_key_gender": [["F", "*"], ["M", "*"]],
	      "_key_product_id": [["5742", "*"]],
	      "_keys": [["product_id", "int"], ["gender", "str"], ["age", "int"], ["benefit_level", "str"], ["effective_date", "dtm"]]
	    }
	  },
	  "prod_fund_prem_limit": {},
	  "product_allowables": {
	    "attachable_riders": [[], ["int", "str", "str", "str"], ["attach_id", "attach_type", "attach_compulsory", "gender"]],
	    "bonus_options": [[], ["int"], ["mode_id"]],
	    "coverage_terms": [[["3", 65]], ["str", "int"], ["coverage_period", "coverage_year"]],
	    "currencies": [[[30]], ["int"], ["money_id"]],
	    "funds": [[], ["str"], ["fund_code"]],
	    "organizations": [[[101]], ["int"], ["organ_id"]],
	    "pay_methods": [[["0", "0", 9], ["1", "0", 92], ["1", "0", 93], ["1", "0", 94], ["1", "0", 96], ["1", "0", 97], ["2", "0", 92], ["2", "0", 93], ["2", "0", 94], ["2", "0", 96], ["2", "0", 97], ["3", "0", 92], ["3", "0", 93], ["3", "0", 94], ["3", "0", 96], ["3", "0", 97], ["4", "0", 92], ["4", "0", 93], ["4", "0", 94], ["4", "0", 96], ["4", "0", 97]], ["str", "str", "int"], ["charge_type", "prem_sequen", "pay_mode"]],
	    "payment_freq": [[["4"]], ["str"], ["charge_type"]],
	    "premium_terms": [[["3", 65]], ["str", "int"], ["charge_period", "charge_year"]],
	    "qualifications": [[[1]], ["int"], ["test_type_id"]],
	    "strategies": [[], ["str", "int"], ["strategy_code", "tariff_type"]],
	    "survival_options": [[], ["str"], ["survival_option"]]
	  },
	  "product_charge_list": {},
	  "product_fund": {},
	  "product_life": {
	    "5742": [1, "Hospital Cash Rider", "HC", "IHCU05", "", "1", "2", "0", "1", "N", "", "2000-01-01 00:00:00", "2999-01-01 00:00:00", 0.0, 0.0, 0.0, 9999, 9999999999.0, "N", "Y", "", "N", "N", "", "23", "0", "3", "0", "0", "Y", "N", "N", 0.0, "Y", "", "N", 0.0, 0.0, 0, 0, 0.0, "N", "HC", "1", "1", "2", "", "1", "N", "Y", "N", "N", "Y", 400, "2014-11-12 00:00:00", 5153367, "2015-01-24 00:00:00", "", 0, "0", "N", "N", 0, 0, "", "1", "N", "N", "N", "N", "N", "N", "N", 30, "0", "1", "8", 45, "Y", "2", "8", "N", "N", "N", 0, "N", 0.0, "N", "N", "0", 9999, "1", 9999, 9999, 0, 0, 0.0, 0.0, 0, 99, "0", "", "Hospital Cash Plan - ILP", "N", 9999999999.0, "2", "N", "N", "Y", "1", "Y", "N", "N", "Y", "2004-01-01 00:00:00", 999, "N", 0.0, "N", "0", "N", "N", "N", "0", "N", "N", "Y", "Y", 0.0, "N", "N", 0, "N", "N", "N", 0, 0.0, "N", 2, "N", 30, "N", 0, 0.0, 9999, 1.0, 999, "N", "1", "N", "N", "N", "1", "N", "N", "1", 0, "N", 0, "N", 0, 0.0, "N", "0", 999, "Y", "N", "", 0, "4", "N", 0.0, "N", "N", "0", "N", 0, 0, 0, "N", "Y", "0", 0, "0", "0", 0, "2", "0", "2", "N", "N", "N", 0.0, "N", "N", "0", 0, "N", "N", 0.0, 0.0, "0", "N", "N", 0, "", "N", "0", "9", 0.0, "N", 0, 0, 1, 0, "N", "N", "N", "N", 0, "Y", "N", 0, "Y", "N", "0", 0, "N", 0, "Y", "N", 0, "N", 2, "N"],
	    "_meta": {
	      "_cols": ["organ_id", "product_name", "product_abbr", "internal_id", "hospital_type", "unit_flag", "ins_type", "ally", "individual_group", "value", "exception", "start_date", "end_date", "life_rate", "sudden_rate", "ill_rate", "em", "check_amount", "renew", "pregnant_insured", "underwrite_class", "attachable", "insure_month", "duty", "benefit_type", "target_type", "period_type", "underwrite_job", "surr_permit", "add_permit", "apl_permit", "loan_permit", "actuary_rate", "table_prem", "ss_claim_formula", "reduce_paidup", "min_sur_amount", "min_add_amount", "min_add_units", "min_sur_units", "min_claim_amount", "mortagage", "initial_id", "section_cal_type", "period_cal_type", "age_base", "bonus_cal_type", "premium_define", "regu_to_single", "sa_accum", "universal_prem", "guarantee_renew", "checked", "insert_person", "insert_date", "updater_id", "update_time", "sys_lock_time", "sys_locker_id", "sys_lock_status", "pseudo", "permit_prs", "prs_unit_amount", "prs_formula", "policyholder", "prem_table", "related_type_prem2", "related_prem2", "fee_year_prem2", "age_prem2", "gender_prem2", "comm_amount", "uw_manual", "base_money", "gst_indicator", "stamp_indicator", "plan_type", "grace_period", "grace_follow", "age_method", "rn_date_type", "follow_discnt", "large_sa_discnt", "prem_vouch_permit", "prem_vouch_rate", "defer_period", "joint_adjust_rate", "waiver", "waiver_benefit", "waiver_basis", "max_switch_times", "switch_period_unit", "max_swit_in_times", "max_swit_out_times", "rup_product_id", "eta_product_id", "min_sur_value", "min_remain_value", "min_defer_period", "max_defer_period", "switch_method", "product_name_2", "feature_desc", "payer_wop", "max_waiv_prem_ann", "gurnt_period_type", "receipt_indi", "proof_age", "full_declare", "ph_la_relation", "hth_full_declare", "advan_program", "uw_jet", "backdate_indi", "start_backdate", "backdate_period", "postdate_indi", "max_comp_commi", "dopp_indi", "policy_section", "assignment_indi", "conversion_priv", "purc_new_pol", "unexpire_rate_meth", "bonus_encash", "la_change", "free_look_indi", "free_look_follow", "admin_charge", "stand_alone_rider", "partial_withdraw", "invest_delay", "cash_bonus_indi", "rev_bonus_indi", "tml_bonus_indi", "eta_endo_prod", "tml_bonus_int_rate", "bereavement_indi", "max_reins_period", "eta_permit", "free_look_period", "stand_life_indi", "non_lap_period", "switch_fee", "free_switch_times", "max_gib_rate", "max_gib_age", "incr_prem_permit", "max_reins_peri_unit", "surr_charge_indi", "special_discnt", "apilp_indi", "backdate_unit", "topup_permit", "reg_topup_permit", "gurnt_period_unit", "gurnt_period", "hi_pol_fee_indi", "grace_period_add", "overdue_int_indi", "eta_term_prod", "annuity_surr_fac", "annuity_notice_indi", "annuity_notice_unit", "annuity_notice_period", "decrease_permit", "prefer_life_indi", "free_switch_unit", "free_switch_period", "par_non_ilp", "gib_permit", "max_loan_rate", "matu_loan_permit", "special_revival_permit", "stampduty_option", "ladr_indi", "bonus_vest_year_clm", "bonus_vest_year_surr", "cb_vest_year", "is_net_invest", "auto_reduce_paidup", "after_eta_option", "gsv_vest_year", "phd_rate_cate", "ri_calc_basis", "ri_calc_formula", "ri_renewal_freq", "ri_factor_table_code", "ri_age_base", "asset_share", "gja_indi", "gsc_indi", "apilp_k", "uptoage_indi", "spouse_prod_indi", "benefit_freq_indi", "risk_aggr_formula", "prem_change_notice", "aurp_specific_terms", "waiver_interest_rate", "db_base_clm", "bucket_filling_option", "follow_commision", "formula_driven", "value_unit_amount", "value_cal_type", "comm_start_dd_indi", "fin_prod_indicator", "ra_object", "min_loan_amt", "reg_part_witdr_per", "bucket_fill_option_ad", "pld_grace_period", "lapse_method", "free_witdr_times", "spouse_waiver", "pers_annu_tax_term", "full_prepayment", "self_confirm", "wait_days_af_lapse", "editable", "has_flexible_period", "flexible_period", "first_of_month", "forward_allowed", "period_type_for_forward", "max_period_for_forward", "indx_indi", "indx_year", "auto_backdate_indi", "is_gio", "max_exercise_time", "is_debt", "product_indicator", "simplify_uw"],
	      "_coltypes": ["int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "dtm", "num", "num", "num", "int", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "str", "num", "num", "int", "int", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "dtm", "int", "dtm", "dtm", "int", "str", "str", "str", "int", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "str", "str", "int", "str", "str", "str", "str", "str", "str", "int", "str", "num", "str", "str", "str", "int", "str", "int", "int", "int", "int", "num", "num", "int", "int", "str", "str", "str", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "dtm", "int", "str", "num", "str", "str", "str", "str", "str", "str", "str", "str", "str", "str", "num", "str", "str", "int", "str", "str", "str", "int", "num", "str", "int", "str", "int", "str", "int", "num", "int", "num", "int", "str", "str", "str", "str", "str", "str", "str", "str", "str", "int", "str", "int", "str", "int", "num", "str", "str", "int", "str", "str", "str", "int", "str", "str", "num", "str", "str", "str", "str", "int", "int", "int", "str", "str", "str", "int", "str", "str", "int", "str", "str", "str", "str", "str", "str", "num", "str", "str", "str", "int", "str", "str", "num", "num", "str", "str", "str", "int", "str", "str", "str", "str", "num", "str", "int", "int", "int", "int", "str", "str", "str", "str", "int", "str", "str", "int", "str", "str", "str", "int", "str", "int", "str", "str", "int", "str", "int", "str"],
	      "_key_product_id": [["5742", "*"]],
	      "_keys": [["product_id", "int"]]
	    }
	  },
	  "product_sa_limit": {
	    "5742:0:*:*:0:0:0": [0.0, 1e+16, 0, 99999, 0, 99999],
	    "_meta": {
	      "_cols": ["insd_min_amount", "insd_max_amount", "premium_min_factor", "premium_max_factor", "income_min_factor", "income_max_factor"],
	      "_coltypes": ["num", "num", "num", "num", "num", "num"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_gender": [["*", "*"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job": [["*", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["5742", "*"]],
	      "_key_special_auth": [["0", "*"]],
	      "_keys": [["product_id", "int"], ["age_month", "num"], ["gender", "str"], ["job", "str"], ["insured_status", "str"], ["pay_mode", "int"], ["special_auth", "int"]]
	    }
	  },
	  "product_unit_rate": {
	    "5742": [1000, 1000, 0, 0, 0, 0, 0, 0],
	    "_meta": {
	      "_cols": ["sa_unit_amount", "em_unit_amount", "cash_value_unit_amount", "mort_unit_amount", "rev_bonus_unit_amount", "cash_bonus_unit_amount", "tml_bonus_unit_amount", "premium_unit_amount"],
	      "_coltypes": ["int", "int", "int", "int", "int", "int", "int", "int"],
	      "_key_product_id": [["5742", "*"]],
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
	    "5742:0:0:0:0:0": [103657, "1", 0.0, 1e+16, 400, "2014-11-12 00:00:00", 400, "2014-11-12 00:00:00", "0", 0],
	    "_meta": {
	      "_cols": ["list_id", "limit_unit", "insd_min_amount", "insd_max_amount", "recorder_id", "insert_time", "updater_id", "update_time", "declaration_type", "max_sa_per_life"],
	      "_coltypes": ["int", "str", "num", "num", "int", "dtm", "int", "dtm", "str", "int"],
	      "_key_age_month": [["0", "9999"]],
	      "_key_insured_status": [["0", "*"]],
	      "_key_job_cate": [["0", "*"]],
	      "_key_pay_mode": [["0", "*"]],
	      "_key_product_id": [["5742", "*"]],
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
	        "prem_freq": "1",
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
	            "loadings": [{ "type": "amount", "rate": 0 }]
	        }, { "product_id": 5013,
	            "internal_id": "IADR01",
	            "initial_sa": 20000000,
	            "la": 0
	        }, { "product_id": 5742,
	            "internal_id": "IHCU05",
	            "initial_sa": 5,
	            "la": 0
	        }],
	        "topups": [{ year: 10, amount: 0 }],
	        "withdrawals": [{ year: 10, amount: 0 }]

	    }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    internal_id: "IHSR05",
	    age_method: "age_method__01",
	    max_t: "zero",
	    cover_term: "cover_term__05",
	    cover_duration: "cover_duration__01",
	    maturity_age: "maturity_age__02",
	    age_at_t: "age_at_t__02",
	    entry_age: "entry_age__01",
	    cor_at_t: "cor_at_t__03",
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
	    sa_calculated: "sa_calculated__03",
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
	        validate_rider: 'validate_rider__02',
	        check_sa_limit: 'check_sa_limit__01',
	        check_age_limit: 'check_age_limit__01',
	        check_sa_multiple: 'noop',
	        check_min_max_sa_units: 'check_min_max_sa_units__01'
	    },
	    input: { "la": "int", "initial_sa": "num", "pay_mode": "str", "coverage_term": "int" },
	    si_colnames: ["Year", "Age", "Annual Premium", "Acc Premium", "SB", "Acc SB", "Gtd Cash Value", "Tot Cash Value", "Death Benefit", "Total Death Benefit"],
	    si_fields: ['t', 'age_at_t', 'pol.pol_apt', 'pol.pol_tpp', 'sbg', "accsb", "svg", "tsv", "dbt", "tot_dbt"]

	};

/***/ }
/******/ ])
});
;