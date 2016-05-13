(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "moment"], factory);
	else if(typeof exports === 'object')
		exports["engine"] = factory(require("lodash"), require("moment"));
	else
		root["engine"] = factory(root["lodash"], root["moment"]);
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

	var _api = __webpack_require__(1);

	var api = _interopRequireWildcard(_api);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	console.log("Offline engine at exported at....", new Date());
	module.exports = api;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getChargeTypes = exports.getChargePeriods = exports.getBenefitLevelPlans = exports.availableFunds = exports.validate = exports.validateRider = exports.getSIConfig = exports.availableRiders = exports.availableCurrencies = exports.getCoverageTerms = exports.getPremiumTerms = exports.getPaymentFrequencies = exports.availablePlans = exports.calcAge4Product = exports.calcAge = exports.calc = undefined;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	var _models = __webpack_require__(5);

	var models = _interopRequireWildcard(_models);

	var _roundings = __webpack_require__(20);

	var roundings = _interopRequireWildcard(_roundings);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import * as validators from "./validators";

	function calcAge(dob) {
	    var ageMethod = arguments.length <= 1 || arguments[1] === undefined ? "ALAB" : arguments[1];

	    //  default to ALAB if not provided. Can happen when we are only entering the person info and no product is selected
	    return utils.calcAge(ageMethod, dob);
	}

	function calcAge4Product(dob, product_id) {
	    if (!_lodash2.default.has(models.CONFIGS, product_id)) {
	        return calcAge(dob);
	    }
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', product_id, {});
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "age_method", { parentType: "product", parent: pdt });
	    var ageMethod = field.getValue('*', { product_id: product_id });
	    //    console.log("calcAge4Method, ageMethod", ageMethod);
	    return calcAge(dob, ageMethod);
	}

	/*
	from chrome console, call api.availablePlans() , returns a list of products objects
	*/
	function availablePlans() {
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', 0, {});
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "get_main_plans", { parentType: "policy", parent: null });
	    var plans = field.getValue({ product_id: 0 });
	    var configured = _lodash2.default.keys(models.CONFIGS).map(function (item) {
	        return parseInt(item);
	    });
	    var availablePlans = _lodash2.default.filter(plans, function (p) {
	        return _lodash2.default.includes(configured, p.product_id);
	    });
	    return availablePlans;
	}

	/* getBenefitLevelPlans , input is the product_id , output = [ {levelDesc:'Plan400', productLevel : 1, levelAmount: 600000 } ] */
	function getBenefitLevelPlans(product_id) {
	    //    debugger;
	    if (!_lodash2.default.has(models.CONFIGS, product_id)) {
	        return [];
	    }
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', product_id, {});
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "benefit_plans", { parentType: "product", parent: pdt });
	    var levels = field.getValue('*', { product_id: product_id });
	    return _lodash2.default.sortBy(levels, ['level']);
	}
	/* getAvailableFunds -- input is the main plan product_id */
	function availableFunds(product_id) {
	    // need to go to 2 separate tables , fund & product fund
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', 0, {}); // note product_0
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "funds", { parentType: "product", parent: pdt });
	    var funds = field.getValue({ product_id: 0 });
	    var fundMap = {};
	    _lodash2.default.forEach(funds, function (fund) {
	        return fundMap[fund.fund_code] = fund.fund_name;
	    });
	    var pdt2 = new models.Entity(ctx, 'product', _lodash2.default.parseInt(product_id), {}); // note product id - our required product id
	    var field2 = new models.Field(ctx, "product_funds", { parentType: "product", parent: pdt2 });
	    var wantedFunds = field2.getValue({ product_id: product_id });
	    var result = [],
	        row = undefined;
	    _lodash2.default.forEach(wantedFunds, function (fund) {
	        row = {};
	        row['fund_code'] = fund.fund_code;
	        row['fund_name'] = fundMap[row.fund_code];
	        result.push(row);
	    });
	    console.log(" availableFunds", result);
	    return result;
	}

	function availableCurrencies(product_id) {
	    // need to go to 2 separate tables , fund & product fund
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', 0, {}); // note product_0
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "currencies", { parentType: "product", parent: pdt });
	    var currencies = field.getValue({ product_id: 0 });
	    var ccyMap = {};

	    _lodash2.default.forEach(currencies, function (ccy) {
	        return ccyMap[ccy.money_id] = ccy.money_name;
	    });
	    var pdt2 = new models.Entity(ctx, 'product', _lodash2.default.parseInt(product_id), {}); // note product id - our required product id
	    var field2 = new models.Field(ctx, "product_currency", { parentType: "product", parent: pdt2 });
	    var wantedRows = field2.getValue({ product_id: product_id });
	    var result = [],
	        row = undefined;
	    //  debugger;
	    _lodash2.default.forEach(wantedRows, function (item) {
	        row = {};
	        row['money_id'] = parseInt(item.money_id);
	        row['money_name'] = ccyMap[parseInt(item.money_id)];
	        result.push(row);
	    });
	    //  console.log(" availableCurrencies", result);
	    return result;
	}

	/*
	Get the payment frequency for that is allowed for the product
	*/
	function getPaymentFrequencies( /*product_id*/product_id) {
	    if (!_lodash2.default.has(models.CONFIGS, product_id)) {
	        return [];
	    }
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', product_id, {});
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "payment_freqs", { parentType: "product", parent: pdt });
	    var freqs = field.getValue('*', { product_id: product_id });
	    // we only get the codes, so we have to provide descriptions as well
	    var freqMap = { '1': 'Yearly', '2': 'Half-yearly', '3': 'Quarterly', '4': 'Monthly', '5': 'Single Premium' };
	    var sorted = _lodash2.default.sortBy(freqs);
	    return _lodash2.default.zip(sorted, _lodash2.default.map(sorted, function (idx) {
	        return freqMap[idx];
	    })); // return a list of 2 element tuples
	}

	function getSIConfig(productId) {
	    if (_lodash2.default.has(models.CONFIGS, productId)) {
	        return Object.assign({}, models.CONFIGS[productId]);
	    } else {
	        return {};
	    }
	}

	/* Get the premium_terms */
	function getPremiumTerms(product_id) {
	    var dob = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

	    /* check if product is configured */
	    if (!_lodash2.default.has(models.CONFIGS, product_id)) {
	        return [];
	    }
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', product_id, {});
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "premium_terms", { parentType: "product", parent: pdt });
	    var terms = field.getValue('*', { product_id: product_id });
	    // will get a list of maps, each map will have period & term keys
	    var numYears = [];
	    var untilAge = [];

	    _lodash2.default.forEach(terms, function (row) {
	        if (row.period === '3') {
	            untilAge.push(row.year);
	        } else {
	            numYears.push(row.year);
	        }
	    });
	    if (untilAge.length > 0) {
	        if (_lodash2.default.isNull(dob)) {
	            // not handled -- how ? calculate years until then ?
	        } else {
	                (function () {
	                    var year = undefined;
	                    _lodash2.default.forEach(untilAge, function (age) {
	                        year = utils.toDate(dob).add(age, 'year').diff(utils.now(), 'year');
	                        numYears.push(year);
	                    });
	                })();
	            }
	    }
	    return numYears; // list of years
	}
	/* Get the coverage_terms */
	function getCoverageTerms(product_id) {
	    /* check if product is configured */
	    if (!_lodash2.default.has(models.CONFIGS, product_id)) {
	        return [];
	    }
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', product_id, {});
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "coverage_terms", { parentType: "product", parent: pdt });
	    var terms = field.getValue('*', { product_id: product_id });
	    // will get a list of maps, each map will have period & term keys

	    var rows = [];
	    _lodash2.default.forEach(terms, function (row) {
	        rows.push({ termType: row.period, year: row.year });
	    });
	    return rows;
	}
	/* Get the premium_terms */
	function getChargePeriods(product_id) {
	    /* check if product is configured */
	    if (!_lodash2.default.has(models.CONFIGS, product_id)) {
	        return [];
	    }
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', product_id, {});
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "premium_terms", { parentType: "product", parent: pdt });
	    var terms = field.getValue('*', { product_id: product_id });
	    // will get a list of maps, each map will have period & term keys
	    var rows = [];
	    _lodash2.default.forEach(terms, function (row) {
	        rows.push({ termType: row.period, year: row.year });
	    });
	    return rows;
	}

	/* Get the chargeTypes */
	function getChargeTypes(product_id) {
	    /* check if product is configured */
	    if (!_lodash2.default.has(models.CONFIGS, product_id)) {
	        return [];
	    }
	    var ctx = new models.Context({});
	    var pdt = new models.Entity(ctx, 'product', product_id, {});
	    ctx.set("product", pdt);
	    var field = new models.Field(ctx, "pay_methods", { parentType: "product", parent: pdt });
	    var terms = field.getValue('*', { product_id: product_id });
	    // will get a list of maps, each map will have period & term keys
	    var rows = [],
	        keys = [];
	    _lodash2.default.forEach(terms, function (row) {
	        if (keys.indexOf(row.charge_type) < 0) {
	            rows.push({ chargeType: row.charge_type, payMode: row.pay_mode });
	            keys.push(row.charge_type);
	        }
	    });

	    return rows;
	}

	/*
	Get the available riders given the main & riders already attached, also people info to look at the age limits
	So expect a normal input json = { policy : "products" : [ {"main".....},{"rider"....} ], "people" : [ { "Insured"....} ] }
	*/
	function availableRiders(inputjson) {
	    // validate json should be in the above structure
	    if ("policy" in inputjson) {
	        var policy = inputjson.policy;
	        if ("products" in policy && "people" in policy) {
	            var products = policy.products;
	            if (products.length > 0) {
	                var _ret2 = function () {
	                    var people = policy.people;
	                    var main = products[0];
	                    var main_product_id = main.product_id;
	                    var riders = [];
	                    _lodash2.default.forEach(products.slice(1), function (rider) {
	                        riders.push(rider.product_id);
	                    });
	                    //let la = people[ main.la ];
	                    var ctx = new models.Context({});
	                    var pdt = new models.Entity(ctx, 'product', main_product_id, {});
	                    ctx.set("product", pdt);
	                    var field = new models.Field(ctx, "attachable_riders", { parentType: "product", parent: pdt });
	                    var attachable_riders = field.getValue('*', { product_id: main_product_id });
	                    // this will be a list of maps
	                    var product0 = new models.Entity(ctx, 'product', 0, {});
	                    var mex_field = new models.Field(ctx, "mutually_exclusive_riders", { parentType: "product", parent: product0 });
	                    var dep_field = new models.Field(ctx, "dependent_riders", { parentType: "product", parent: product0 });
	                    var rider_id = undefined,
	                        attach_type = undefined,
	                        compulsory = undefined,
	                        gender = undefined;
	                    var available_riders = _lodash2.default.filter(attachable_riders, function (row) {
	                        var mex = undefined,
	                            dep = undefined,
	                            pid = undefined;
	                        pid = row.attach_id;
	                        // have to reset fields otherwise it will use cached values
	                        mex_field.reset();
	                        dep_field.reset();
	                        mex = mex_field.getValue('*', { rider_id: pid }); // use product_id = 0
	                        dep = dep_field.getValue('*', { rider_id: pid }); // for these use product_id = 0

	                        if (row.attach_type == "1" && _lodash2.default.includes(riders, pid)) {
	                            // attach only once & already attached
	                            return false;
	                        }
	                        var exclude = false;
	                        _lodash2.default.forEach(mex, function (pair) {
	                            var _pair = _slicedToArray(pair, 2);

	                            var r1 = _pair[0];
	                            var r2 = _pair[1];

	                            if (r1 === pid && _lodash2.default.includes(riders, r2)) {
	                                exclude = true;
	                            }
	                            if (r2 === pid && _lodash2.default.includes(riders, r1)) {
	                                exclude = true;
	                            }
	                        });
	                        if (exclude) {
	                            return false;
	                        }
	                        _lodash2.default.forEach(dep, function (pair) {
	                            var _pair2 = _slicedToArray(pair, 2);

	                            var r1 = _pair2[0];
	                            var r2 = _pair2[1];

	                            if (pid === r1 && !_lodash2.default.includes(riders, r2)) {
	                                exclude = true;
	                            }
	                        });
	                        if (exclude) {
	                            return false;
	                        }
	                        // by right need to check the age limit for the rider -- but can leave it to validation of the rider

	                        return true;
	                    });

	                    var field2 = new models.Field(ctx, "get_riders", { parentType: "product", parent: product0 });
	                    var riderList = field2.getValue('*', {});
	                    //let riderIds = _.pluck(riderList,'product_id');
	                    var riderIds = _lodash2.default.map(riderList, function (row) {
	                        return row.product_id;
	                    });
	                    var idx = undefined;
	                    _lodash2.default.forEach(available_riders, function (rider) {
	                        idx = riderIds.indexOf(rider.attach_id);
	                        if (idx >= 0) {
	                            rider["rider_name"] = riderList[idx].product_name;
	                            rider["rider_code"] = riderList[idx].internal_id;
	                            rider["rider_id"] = rider["attach_id"];
	                        }
	                    });
	                    var configured = _lodash2.default.keys(models.CONFIGS).map(function (item) {
	                        return parseInt(item);
	                    });
	                    return {
	                        v: _lodash2.default.filter(available_riders, function (p) {
	                            return _lodash2.default.includes(configured, p.rider_id);
	                        })
	                    };
	                }();

	                if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
	            }
	        }
	    }
	    return []; // nothing
	}

	/*
	inputjson should include the people and main, i.e. main to be validated.
	Basic validations to do are as follows:
	1. validate the SA limits
	2. validate the age limits
	3. validate the premium limits
	4. If there are funds, we should also validate the fund limits ? -- later
	5. there is no need to validate the coverage terms and premium terms as these should have been drop down lists provided to the ui
	6. also no need to check on the attachable riders as these should have been provided as drop down lists
	7. other checks relating to rtu / tot prem ratio to do later (a form of premium limit)

	So for the moment, only check for SA limit, age limit and premium limits
	Return an empty array if there are no errors, else an array of error messages
	*/
	function validate(inputjson, validatorList) {
	    if (inputjson.policy.people && inputjson.policy.people.length === 0) {
	        return ["There are no people specified in the input json "];
	    }
	    if (inputjson.policy.products && inputjson.policy.products.length > 0) {
	        var main_product_id = inputjson.policy.products[0].product_id;
	        if (!_lodash2.default.has(models.CONFIGS, main_product_id)) {
	            return ["The product requested is not configured in the system"];
	        }
	    } else {
	        return ["There are no products specified in the input json "];
	    }
	    var errors = {};
	    var ctx = new models.Context({});
	    _prepareInput(ctx, inputjson);
	    // tiggered using engine.validate(json, ['validateMain'])
	    var ordering = { main: 0, fund: 10, loading: 20, pdt: 30, r: 31, pol: 40, topup: 50, withdraw: 60 };
	    var keys = Object.keys(ordering),
	        itemlist = undefined,
	        entity = undefined,
	        k = undefined;
	    var workFields = _lodash2.default.sortBy(validatorList, function (item) {
	        itemlist = item.split(".");
	        entity = itemlist.length === 1 ? 'main' : itemlist[0];
	        k = _lodash2.default.find(keys, function (value, key) {
	            return _lodash2.default.startsWith(entity, value);
	        });
	        return ordering[k];
	    });
	    _lodash2.default.forEach(workFields, function (item, index) {
	        var errs = runValidator(ctx, item);
	        if (!_lodash2.default.isArray(errs)) {
	            errs = [errs];
	        }
	        errs = _lodash2.default.flattenDeep(errs);
	        errs = _lodash2.default.filter(errs, function (err) {
	            return err && err.length > 0;
	        });
	        console.log("** Errors for validator  ", item, errs);
	        errors[item] = errs;
	    });
	    return errors;
	}

	function validateMain(inputjson) {
	    if (inputjson.policy.people && inputjson.policy.people.length === 0) {
	        return ["There are no people specified in the input json "];
	    }
	    if (inputjson.policy.products && inputjson.policy.products.length > 0) {
	        var main_product_id = inputjson.policy.products[0].product_id;
	        if (!_lodash2.default.has(models.CONFIGS, main_product_id)) {
	            return ["The product requested is not configured in the system"];
	        }
	    } else {
	        return ["There are no products specified in the input json "];
	    }
	    /* done with basic check */
	    var errors = [];
	    var ctx = new models.Context({});
	    _prepareInput(ctx, inputjson);
	    var mainConfig = getSIConfig(ctx.get("main").product_id);
	    // console.log("validateMain--> mainConfig", mainConfig.validators.validateMain);
	    //
	    // callValidator( validatorName, ctx, requestType, opts={} )

	    // let main = ctx.get("main");
	    // // ok what do we need to check ? start with sa limit, look at sa_limit
	    // let limitRow = main.val("sa_limit");
	    // let initial_sa = main.val("initial_sa");
	    // if ( initial_sa < limitRow.insd_min_amount ) {
	    //     errors.push("The sum assured is less than the minimum required for this product");
	    // }  else if (initial_sa > limitRow.insd_max_amount ) {
	    //     errors.push("The sum assured is more than the maximum allowed for this product");
	    // }
	    // /* next look at the age limit */
	    // let entryAge = main.val("entry_age"),
	    //     ageRow = main.val("age_limit");
	    // if ( ageRow.min_insd_nb_age_unit === '1' && entryAge < ageRow.min_insd_nb_age) {
	    //     errors.push("The insured age is less than the required minimum age for this product");
	    // } else if (ageRow.max_insd_nb_age_unit === '1' && entryAge > ageRow.max_insd_nb_age) {
	    //     errors.push("The insured is older than the allowed maximum age for this product");
	    // }

	    return errors;
	}
	/*
	inputjson should include the people, main, and the riders that have been attached and also the rider to validate (not yet attached)
	riderno specifies the rider that needs to be validated
	1. Validate the sa limit
	2. Validate the age limit

	Return an empty array if there are no errors, else an array of error messages
	*/
	function validateRider(inputjson) {
	    var riderno = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

	    if (inputjson.policy.people && inputjson.policy.people.length === 0) {
	        return ["There are no people specified in the input json "];
	    }
	    if (inputjson.policy.products && inputjson.policy.products.length > 0) {
	        var main_product_id = inputjson.policy.products[0].product_id;
	        if (!_lodash2.default.has(models.CONFIGS, main_product_id)) {
	            return ["There main plan requested is not configured in the system"];
	        }
	    } else {
	        return ["There are no products specified in the input json "];
	    }
	    if (inputjson.policy.products && inputjson.policy.products.length < 2) {
	        return ["There should be at least one rider specified in the input json for validation"];
	    }
	    /* done with basic check */

	    var errors = [];
	    var ctx = new models.Context({});
	    _prepareInput(ctx, inputjson);
	    var main = ctx.get("main");
	    var ridercode = "r" + riderno; // main is always the 1st product, rider number starts from one
	    var rider = ctx.get("products")[riderno];
	    var rider_initial_sa = rider.val("initial_sa");
	    var main_initial_sa = main.val("initial_sa");
	    var saRow = rider.val("sa_limit");
	    var mainRiderSaRow = main.val("main_rider_sa_limit", '*', { rider_id: rider.val("product_id") });
	    var riderMainRatio = rider_initial_sa / main_initial_sa;

	    if (rider_initial_sa < saRow.insd_min_amount) {
	        errors.push("The sum assured is less than the minimum required for the rider");
	    } else if (rider_initial_sa > saRow.insd_max_amount) {
	        errors.push("The sum assured is more than the maximum allowed for the rider");
	    }
	    if (main_initial_sa < mainRiderSaRow.min_mast_sa_amt) {
	        errors.push("The main plan sum assured is less that the required minimum when atatching this rider");
	    }

	    if (rider_initial_sa > mainRiderSaRow.max_ath_sa_amt) {
	        errors.push("The sum assured is more the maximum allowed when attached to the main plan");
	    }
	    if (riderMainRatio < mainRiderSaRow.min_ath_sa_rate) {
	        errors.push("The sum assured rate is less than the minimum required when attached to the main plan");
	    }
	    if (riderMainRatio > mainRiderSaRow.max_ath_sa_rate) {
	        errors.push("The sum assured rate is more than the maximum allowed when attached to the main plan");
	    }
	    /* time to look at the age limits */
	    var ageRow = rider.val("age_limit"),
	        mainRiderAgeRow = main.val("main_rider_age_limit", '*', { rider_id: rider.val("product_id") }),
	        mainAge = main.val("entry_age"),
	        riderAge = rider.val("entry_age");
	    if (ageRow.min_insd_nb_age_unit === '1') {
	        if (riderAge < ageRow.min_insd_nb_age) {
	            errors.push("The age of the insured for the rider is less than the minimum allowed");
	        } else if (riderAge > ageRow.max_insd_nb_age) {
	            errors.push("The age of the insured for the rider is more than the maximum allowed");
	        }
	    }
	    if (riderAge < mainRiderAgeRow.min_ath_age) {
	        errors.push("The age of the insured for the rider is less than the minimum allowed when attached to the main plan");
	    }
	    if (riderAge > mainRiderAgeRow.max_ath_age) {
	        errors.push("The age of the insured for the rider is more than the maximum allowed when attached to the main plan");
	    }
	    if (mainAge < mainRiderAgeRow.min_ath_mast_age) {
	        errors.push("The age of the insured for the main is less than the minimum allowed when the rider is attached");
	    }
	    if (mainAge > mainRiderAgeRow.max_ath_mast_age) {
	        errors.push("The age of the insured for the main is more than the maximum allowed when the rider is attached");
	    }
	    return errors;
	}

	/*
	 from chrome console, call as follows for TEND02 i.e. product 5712
	 engine.calc(product_5712.inputjson ,svFields=["prem"],mvFields=["age_at_t", "apt", "tpp", "sbg","accsb","svg","tsv", "dbt","pol.totprem", "tot_dbt"])

	 */
	function calc(inputJson) {
	    var svFields = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	    var mvFields = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

	    /* do a quick check that there is a main product id , and there are people */
	    console.log("calc function", svFields);
	    if (inputJson.policy.people && inputJson.policy.people.length === 0) {
	        return inputJson;
	    }
	    if (inputJson.policy.products && inputJson.policy.products.length > 0) {
	        var main_product_id = inputJson.policy.products[0].product_id;
	        if (!_lodash2.default.has(models.CONFIGS, main_product_id)) {
	            return inputJson;
	        }
	    } else {
	        return inputJson;
	    }
	    /* ok, done with basic check */
	    var ctx = new models.Context({});
	    var output = _lodash2.default.clone(inputJson, true); // create a clone for the output
	    _prepareInput(ctx, inputJson);
	    var main = ctx.get("main");
	    var maxT = main.val("max_t");
	    ctx.set("current_t", "*"); // so that it is easier
	    // re-adjust the sequence of the fields, funds, before product, before policy
	    var workFields = _lodash2.default.sortBy(svFields, function (item) {
	        return item.indexOf("fund.") === 0 ? 0 : item.indexOf("pol.") === 0 ? 2 : 1;
	    });
	    _lodash2.default.forEach(workFields, function (item, index) {
	        var fieldValue = _getField(ctx, item);
	        console.log("** Value for svField item ", item, fieldValue);
	    });
	    // fund before product before policy
	    workFields = _lodash2.default.sortBy(mvFields, function (item) {
	        return item.indexOf("fund.") === 0 ? 0 : item.indexOf("pol.") === 0 ? 2 : 1;
	    });
	    _lodash2.default.forEach(workFields, function (item, index) {
	        _lodash2.default.forEach(_lodash2.default.range(1, maxT + 1), function (t) {
	            ctx.set("current_t", t);
	            var fieldValue = _getField(ctx, item, t);
	            if (t === maxT) {
	                console.log("** Value for item for t ", item, t, fieldValue);
	            }
	        });
	    });

	    _prepareOutput(output, ctx);
	    ctx = null;
	    return output;
	}
	function _prepareOutput(output, ctx) {
	    var fmter = undefined;
	    var policy = output.policy;
	    var people = policy.people;
	    var products = policy.products;
	    var funds = products.length > 0 ? products[0].funds || [] : [];
	    _lodash2.default.forOwn(ctx.get("policy").getFields(), function (f, k) {
	        // if ((f instanceof models.Field) && !f.inputField) {
	        if (f instanceof models.Field && f.fmlaField) {
	            fmter = _lodash2.default.isNull(f.format1) ? roundings['round_cents_half_up'] : roundings[f.format1]; // default is round to nearest cent
	            if (Object.keys(f.values).length > 1) {
	                policy[k] = {};
	                _lodash2.default.forOwn(f.values, function (vv, kk) {
	                    if (f.resolved[kk]) {
	                        policy[k][kk] = _lodash2.default.isNull(fmter) ? vv : _lodash2.default.isNumber(vv) ? fmter(vv) : vv;
	                    }
	                });
	            } else if ('*' in f.values && f.resolved['*']) {
	                var vv = f.values['*'];
	                policy[k] = _lodash2.default.isNull(fmter) ? vv : _lodash2.default.isNumber(vv) ? fmter(vv) : vv;
	            }
	        }
	    });
	    var product = undefined,
	        fund = undefined;
	    _lodash2.default.forEach(ctx.get("products"), function (pdt, index) {
	        product = products[index];
	        _lodash2.default.forOwn(pdt.getFields(), function (f, k) {
	            if (f instanceof models.Field && f.fmlaField) {
	                fmter = _lodash2.default.isNull(f.format1) ? roundings['round_cents_half_up'] : roundings[f.format1]; // default is round to nearest cent
	                if (Object.keys(f.values).length > 1) {
	                    product[k] = {};
	                    _lodash2.default.forOwn(f.values, function (vv, kk) {
	                        if (f.resolved[kk]) {
	                            product[k][kk] = _lodash2.default.isNull(fmter) ? vv : _lodash2.default.isNumber(vv) ? fmter(vv) : vv;
	                        }
	                    });
	                } else if ('*' in f.values && f.resolved['*']) {
	                    var vv = f.values['*'];
	                    product[k] = _lodash2.default.isNull(fmter) ? vv : _lodash2.default.isNumber(vv) ? fmter(vv) : vv;
	                }
	            }
	        });
	        if (index === 0) {
	            _lodash2.default.forEach(pdt.val("funds"), function (fnd, indx) {
	                fund = funds[indx];
	                _lodash2.default.forOwn(fnd.getFields(), function (f, key) {
	                    if (f instanceof models.Field && f.fmlaFieldField) {
	                        fmter = _lodash2.default.isNull(f.format1) ? roundings['round_cents_half_up'] : roundings[f.format1]; // default is round to nearest cent
	                        if (Object.keys(f.values).length > 1) {
	                            // multi valued fields
	                            fund[k] = {};
	                            _lodash2.default.forOwn(f.values, function (vv, kk) {
	                                if (f.resolved[kk]) {
	                                    fund[k][kk] = _lodash2.default.isNull(fmter) ? vv : _lodash2.default.isNumber(vv) ? fmter(vv) : vv;
	                                }
	                            });
	                        } else if ('*' in f.values && f.resolved['*']) {
	                            //single value field
	                            var vv = f.values['*'];
	                            fund[k] = _lodash2.default.isNull(fmter) ? vv : _lodash2.default.isNumber(vv) ? fmter(vv) : vv;
	                        }
	                    }
	                });
	            });
	        }
	    });
	    return output;
	    // console.log( "*** output", output);
	}

	function runValidator(ctx, item) {
	    var t = arguments.length <= 2 || arguments[2] === undefined ? '*' : arguments[2];

	    var pieces = item.split('.');
	    if (pieces.length === 1) {
	        pieces = ['main', item];
	    }
	    if (pieces[0].substr(0, 4).toLowerCase() === 'pdt_' || pieces[0].toLowerCase() === 'main') {
	        var _validatorName = pieces[1];
	        var product = undefined;
	        if (pieces[0].toLowerCase() === 'main') {
	            product = ctx.get("main");
	        } else {
	            (function () {
	                var pdtCode = pieces[0].substr(4);
	                var products = ctx.get("products");
	                var theProduct = _lodash2.default.filter(products, function (product) {
	                    return product.val("internal_id") === pdtCode;
	                });
	                product = theProduct.length > 0 ? theProduct[0] : null;
	            })();
	        }
	        ctx.set("product", product);
	        ctx.set("product_id", product.val("product_id"));
	        return product.validate(_validatorName);
	    } else if (/^r\d$/.test(pieces[0])) {
	        // e.g. r1.prem, pieces[0] = r1
	        var product_no = parseInt(pieces[0].split('.')[0].substr(1));
	        var product = ctx.get("products")[product_no];
	        ctx.set("product", product);
	        ctx.set("product_id", product.val("product_id"));
	        return product.validate(pieces[1]);
	    } else if (pieces[0].substr(0, 3) === 'pol') {
	        var _validatorName2 = pieces[1];
	        var policy = ctx.get("policy");
	        var main = ctx.get("main");
	        ctx.set("product", main);
	        ctx.set("product_id", main.val("product_id"));
	        return policy.validate(_validatorName2);
	    } else if (pieces[0].toLowerCase().substr(0, 4) === 'fund') {
	        var _ret4 = function () {
	            var fundCode = pieces[0].substr(4).toLowerCase();
	            var funds = ctx.get("funds");
	            var wantedFund = _lodash2.default.filter(funds, function (fund) {
	                return fund.val("fund_code") === fundCode;
	            });
	            var ffund = wantedFund.length > 0 ? wantedFund[0] : null;
	            var validatorName = pieces[1];
	            ctx.set("fund", ffund);
	            ctx.set("product", ctx.get("main"));
	            ctx.set("product_id", ctx.get("main").val("product_id"));
	            return {
	                v: ffund.validate(validatorName)
	            };
	        }();

	        if ((typeof _ret4 === "undefined" ? "undefined" : _typeof(_ret4)) === "object") return _ret4.v;
	    } else if (pieces[0].toLowerCase().substr(0, 5) === 'topup') {
	        var _ret5 = function () {
	            // syntax is topup.1 where 1 == year
	            var policy = ctx.get("policy");
	            var topups = policy.val("topups");
	            var year = parseInt(pieces[1]);
	            var wlist = _lodash2.default.filter(topups, function (atu) {
	                return atu.val("year") === year;
	            });
	            if (wlist.length > 0) {
	                var topup = wlist[0];
	                return {
	                    v: topup.validate(validatorName)
	                };
	            }
	            throw Error("Unable to locate topup validator " + validatorName);
	        }();

	        if ((typeof _ret5 === "undefined" ? "undefined" : _typeof(_ret5)) === "object") return _ret5.v;
	    } else if (pieces[0].toLowerCase().substr(0, 5) === 'withdraw') {
	        var _ret6 = function () {
	            // syntax is withdraw.1 where 1 == year
	            var policy = ctx.get("policy");
	            var topups = policy.val("withdrawals");
	            var year = parseInt(pieces[1]);
	            var wlist = _lodash2.default.filter(topups, function (atu) {
	                return atu.val("year") === year;
	            });
	            if (wlist.length > 0) {
	                var withdrawal = wlist[0];
	                return {
	                    v: withdrawal.validate(validatorName)
	                };
	            }
	            throw Error("Unable to locate withdrawal validator " + validatorName);
	        }();

	        if ((typeof _ret6 === "undefined" ? "undefined" : _typeof(_ret6)) === "object") return _ret6.v;
	    }
	}

	function _getField(ctx, item) {
	    var t = arguments.length <= 2 || arguments[2] === undefined ? '*' : arguments[2];

	    var pieces = item.split('.');
	    if (pieces.length === 1) {
	        pieces = ['main', item];
	    }
	    if (pieces[0].substr(0, 4).toLowerCase() === 'pdt_' || pieces[0].toLowerCase() === 'main') {
	        var fname = pieces[1];
	        var product = undefined;
	        if (pieces[0].toLowerCase() === 'main') {
	            product = ctx.get("main");
	        } else {
	            (function () {
	                var pdtCode = pieces[0].substr(4);
	                var products = ctx.get("products");
	                var theProduct = _lodash2.default.filter(products, function (product) {
	                    return product.val("internal_id") === pdtCode;
	                });
	                product = theProduct.length > 0 ? theProduct[0] : null;
	            })();
	        }
	        ctx.set("product", product);
	        ctx.set("product_id", product.val("product_id"));
	        // console.log("_getField", ctx.get("product_id") );
	        return product.val(fname, t);
	    } else if (/^r\d$/.test(pieces[0])) {
	        // e.g. r1.prem, pieces[0] = r1
	        var product_no = parseInt(pieces[0].split('.')[0].substr(1));
	        var product = ctx.get("products")[product_no];
	        ctx.set("product", product);
	        ctx.set("product_id", product.val("product_id"));
	        return product.val(pieces[1], t);
	    } else if (pieces[0].substr(0, 3) === 'pol') {
	        var fname = pieces[1];
	        var policy = ctx.get("policy");
	        var main = ctx.get("main");
	        ctx.set("product", main);
	        ctx.set("product_id", main.val("product_id"));
	        return policy.val(fname, t);
	    } else if (pieces[0].toLowerCase().substr(0, 4) === 'fund') {
	        var _ret8 = function () {
	            var fundCode = pieces[0].substr(4).toLowerCase();
	            var funds = ctx.get("funds");
	            var wantedFund = _lodash2.default.filter(funds, function (fund) {
	                return fund.val("fund_code") === fundCode;
	            });
	            var ffund = wantedFund.length > 0 ? wantedFund[0] : null;
	            var fname = pieces[1];
	            ctx.set("fund", ffund);
	            ctx.set("product", ctx.get("main"));
	            ctx.set("product_id", ctx.get("main").val("product_id"));
	            return {
	                v: ffund.val(fname, t)
	            };
	        }();

	        if ((typeof _ret8 === "undefined" ? "undefined" : _typeof(_ret8)) === "object") return _ret8.v;
	    }
	}
	function _prepareInput(ctx, inputJson) {
	    var input = _lodash2.default.clone(inputJson, true);

	    var policy = input.policy || {};
	    var people = policy.people || [];
	    var products = policy.products || [];
	    var topups = policy.topups || [];
	    var withdrawals = policy.withdrawals || [];
	    var fund = undefined,
	        funds = undefined,
	        main = undefined,
	        loadings = undefined;
	    funds = [];
	    loadings = [];
	    if (products.length > 0) {
	        main = products[0];
	    }
	    if (main) {
	        funds = main.funds || [];
	    }

	    var mainProductId = main.product_id;
	    var pol = new models.Entity(ctx, 'policy', mainProductId, {});
	    ctx.set("policy", pol);
	    _lodash2.default.forOwn(policy, function (v, k) {
	        if (!(k === 'people' || k === 'products' || k === "topups" || k === "withdrawals")) {
	            var f = new models.Field(ctx, k, { parentType: 'policy', parent: pol, inputField: true, value: v });
	            pol.setField(k, f);
	        } else {
	            if (k === 'topups' || k === 'withdrawals') {
	                (function () {
	                    // how do we expect the data ? [ {'year':1, amount:100000},{'year':20,'amount':203000}]
	                    var doc = undefined,
	                        ff = undefined,
	                        rows = [];
	                    var entityType = k === 'topups' ? 'topup' : 'withdrawal';
	                    _lodash2.default.forEach(v, function (row, index) {
	                        doc = new models.Entity(ctx, entityType, mainProductId, {});
	                        _lodash2.default.forOwn(row, function (vv, kk) {
	                            ff = new models.Field(ctx, k, { parentType: entityType, parent: doc, inputField: true, value: vv });
	                            doc.setField(kk, ff);
	                        });
	                        rows.push(doc);
	                    });
	                    pol.setField(k, rows); // just set it as array as it passed in from input -- array of objects
	                })();
	            }
	        }
	    });
	    var policyFields = pol.getFields();
	    if (!('topups' in policyFields)) {
	        pol.setField('topups', []);
	    }
	    if (!('withdrawals' in policyFields)) {
	        pol.setField('withdrawals', []);
	    }

	    var fnds = [];
	    _lodash2.default.forEach(funds, function (fund, index) {
	        var row = new models.Entity(ctx, 'fund', mainProductId, {});
	        _lodash2.default.forOwn(fund, function (v, k) {
	            var f = new models.Field(ctx, k, { parentType: 'fund', parent: row, inputField: true, value: v });
	            row.setField(k, f);
	        });
	        fnds.push(row);
	    });
	    ctx.set("funds", fnds);

	    var prds = [];
	    _lodash2.default.forEach(products, function (prod, i) {
	        var productId = prod.product_id;
	        var row = new models.Entity(ctx, 'product', productId, {});
	        var hasLoadings = false;
	        _lodash2.default.forOwn(prod, function (v, k) {
	            if (i === 0 && k === 'funds') {
	                row.setField("funds", fnds);
	            } else {
	                if (k === 'loadings') {
	                    (function () {
	                        hasLoadings = true;
	                        var doc = undefined,
	                            ff = undefined,
	                            loadings = [];
	                        _lodash2.default.forEach(v, function (loading, index) {
	                            doc = new models.Entity(ctx, 'loading', productId, {});
	                            _lodash2.default.forOwn(loading, function (vv, kk) {
	                                ff = new models.Field(ctx, kk, { parentType: 'loading', parent: doc, inputField: true, value: vv });
	                                doc.setField(kk, ff);
	                            });
	                            loadings.push(doc);
	                        });
	                        row.setField(k, loadings);
	                    })();
	                } else {
	                    var f = new models.Field(ctx, k, { parentType: 'product', parent: row, inputField: true, value: v });
	                    row.setField(k, f);
	                }
	            }
	        });
	        if (!hasLoadings) {
	            row.setField("loadings", []);
	        }
	        prds.push(row);
	        if (i === 0) {
	            ctx.set("main", row);
	        }
	        pol.setField("products", prds);
	        ctx.set("products", prds);
	    });

	    var ppls = [];
	    _lodash2.default.forEach(people, function (person, i) {
	        var row = new models.Entity(ctx, 'people', mainProductId, {});
	        _lodash2.default.forOwn(person, function (v, k) {
	            var f = new models.Field(ctx, k, { parentType: 'people', parent: row, inputField: true, value: v });
	            row.setField(k, f);
	        });
	        ppls.push(row);
	    });
	    pol.setField("people", ppls);
	    ctx.set("people", ppls);
	    input = null;
	    return ctx;
	}
	exports.calc = calc;
	exports.calcAge = calcAge;
	exports.calcAge4Product = calcAge4Product;
	exports.availablePlans = availablePlans;
	exports.getPaymentFrequencies = getPaymentFrequencies;
	exports.getPremiumTerms = getPremiumTerms;
	exports.getCoverageTerms = getCoverageTerms;
	exports.availableCurrencies = availableCurrencies;
	exports.availableRiders = availableRiders;
	exports.getSIConfig = getSIConfig;
	exports.validateRider = validateRider;
	exports.validate = validate;
	exports.availableFunds = availableFunds;
	exports.getBenefitLevelPlans = getBenefitLevelPlans;
	exports.getChargePeriods = getChargePeriods;
	exports.getChargeTypes = getChargeTypes;

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
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.CONFIGS = exports.DB = exports.Context = exports.Entity = exports.Field = exports.Validator = undefined;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _formulas = __webpack_require__(6);

	var formulas = _interopRequireWildcard(_formulas);

	var _commondata = __webpack_require__(13);

	var commondata = _interopRequireWildcard(_commondata);

	var _validators = __webpack_require__(14);

	var validators = _interopRequireWildcard(_validators);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// each product publishes itself as product_nnnn in the global namespace e.g. product_5712, this is CONVENTION, must follow.....
	// assume each of the products set a global product_nnnn, if using webpack, it use LibraryTarget as var, and Library to define name
	// var globals = typeof window === 'undefined' ? root : window;
	var globals = window || global || root;

	var products = _lodash2.default.keys(globals).filter(function (item) {
	    return item.indexOf("product_") >= 0;
	}).filter(function (item) {
	    return _lodash2.default.isPlainObject(globals[item]) && _lodash2.default.has(globals[item], 'product_id');
	});

	var DB = {};
	var CONFIGS = {};
	var jsons = {};
	var mod = undefined,
	    product_id = undefined,
	    code = undefined,
	    config = undefined,
	    req = undefined,
	    pid = undefined;

	_lodash2.default.forEach(products, function (key) {
	    pid = parseInt(key.split('_')[1]);
	    mod = globals[key];
	    CONFIGS[pid] = mod.config;
	    DB[pid] = {};

	    // if code exists at the product level use those, else use the ones from commondata
	    var fnames = _lodash2.default.keys(mod.code);
	    var cnames = _lodash2.default.keys(commondata);
	    var allnames = fnames.concat(cnames);
	    allnames = _lodash2.default.uniq(allnames); // make it uniq

	    _lodash2.default.forEach(allnames, function (fname) {
	        // simulate a form of inheritance, load from product (i.e. override) else load from commondata (parent)
	        if (_lodash2.default.has(mod.code, fname)) {
	            DB[pid][fname] = mod.code[fname];
	        } else {
	            DB[pid][fname] = commondata[fname];
	        }
	    });
	});

	var Field = function () {
	    function Field(ctx, fname, kw) {
	        var _this = this;

	        _classCallCheck(this, Field);

	        var parentType = _lodash2.default.isUndefined(kw.parentType) ? '' : kw.parentType;
	        var parent = _lodash2.default.isUndefined(kw.parent) ? null : kw.parent;
	        var inputField = _lodash2.default.isUndefined(kw.inputField) ? false : kw.inputField,
	            dbField = _lodash2.default.isUndefined(kw.dbField) ? false : kw.dbField,
	            fmlaField = _lodash2.default.isUndefined(kw.fmlaField) ? false : kw.fmlaField,
	            value = _lodash2.default.isUndefined(kw.value) ? undefined : kw.value;
	        this.ctx = ctx;
	        this.fname = fname;
	        this.parentType = parentType;
	        this.parent = parent;
	        this.inputField = inputField;
	        this.dbField = dbField;
	        this.fmlaField = fmlaField;
	        this.format1 = _lodash2.default.isUndefined(kw.format1) ? null : kw.format1; // only available for formula fields
	        this.format2 = _lodash2.default.isUndefined(kw.format1) ? null : kw.format2;
	        var values = undefined;
	        if (value === null) {
	            values = { '*': null };
	        } else if (_lodash2.default.isArray(value)) {
	            values = {};
	            _lodash2.default.forEach(value, function (v, index) {
	                values[index + 1] = v;
	            });
	        } else {
	            values = { '*': value };
	        }

	        this.values = values;
	        this.resolved = {};
	        _lodash2.default.forOwn(values, function (v, k) {
	            _this.resolved[k] = _lodash2.default.isUndefined(v) ? false : true;
	        });
	    }

	    _createClass(Field, [{
	        key: "setValue",
	        value: function setValue(v) {
	            var t = arguments.length <= 1 || arguments[1] === undefined ? '*' : arguments[1];

	            this.values[t] = v;
	            this.resolved[t] = _lodash2.default.isUndefined(v) ? false : true;
	            if (this.resolved[t]) {
	                if (t !== '*' && '*' in this.values) {
	                    this.resolved['*'] = false;
	                }
	            }
	        }
	    }, {
	        key: "reset",
	        value: function reset() {
	            var t = '*';
	            this.values[t] = undefined;
	            this.resolved[t] = false;
	        }
	    }, {
	        key: "getValue",
	        value: function getValue(k) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            var t = 0;
	            if (k !== 0) {
	                t = k ? k : '*';
	            }
	            var opts = _lodash2.default.extend({}, options);
	            var result = null;
	            // note : input fields are always resolved by now, since the field should be created with the values provided

	            if (this.resolved[t]) {
	                result = this.values[t];
	            } else if (this.inputField && this.resolved['*']) {
	                result = this.values['*'];
	            } else {
	                result = this.resolve(t, opts);
	            }
	            return result;
	        }
	    }, {
	        key: "resolve",
	        value: function resolve(t, opts) {
	            /*
	            order of preference
	            if pass in via opts, we should always use that
	            next is based on the parentType when the field was created, if the parent is not null
	              */
	            var policy = this.ctx.get("policy");
	            var people = this.ctx.get("people");
	            var main = this.ctx.get("main");
	            var product = this.ctx.get("product");
	            var fund = undefined;
	            if (this.parentType === "fund") {
	                fund = this.ctx.get("fund");
	            }

	            if (this.parentType === 'fund') {
	                product = this.ctx.get("main");
	                fund = this.parent;
	            } else if (this.parentType === 'product' && this.parent) {
	                product = this.parent;
	            } else if (this.parentType === 'people' && this.parent) {
	                people = this.parent;
	            } else if (this.parentType === 'policy' && this.parent) {
	                policy = this.parent;
	            }

	            if (!product) {
	                product = main;
	            } // by right should not happen, but if not set by now, then use main as product
	            if (!('product_id' in opts) && !_lodash2.default.isUndefined(product)) {
	                opts.product_id = product.val("product_id");
	            }
	            if (!('policy_year' in opts) && _lodash2.default.isNumber(t)) {
	                opts.policy_year = t;
	            }

	            var pid = 0; // defaults to product 0 i.e. common db
	            if (opts.product_id) {
	                pid = opts.product_id;
	            } else if (product && product.val("product_id")) {
	                pid = product.val("product_id");
	            } else if (this.parentType === "product" && this.parent && this.parent.product_id) {
	                pid = this.parent.product_id;
	            }

	            var dbFields = _lodash2.default.keys(DB[pid]);
	            var result = undefined;
	            if (_lodash2.default.includes(dbFields, this.fname)) {
	                var fn = DB[pid][this.fname];
	                result = fn(this.ctx, policy, people, product, fund, t, opts);
	            } else {
	                result = this.resolveFormula(policy, people, product, fund, t, opts);
	            }
	            var k = 0;
	            if (t === 0) {
	                k = 0;
	            } else {
	                k = t ? t : '*'; // * in cases where t is undefined or null
	            }
	            this.setValue(result, k); // set the value which also sets it to be resolved
	            return result;
	        }
	    }, {
	        key: "resolveFormula",
	        value: function resolveFormula(policy, people, product, fund, t, opts) {
	            var pdt = undefined;
	            if (this.parentType === 'policy') {
	                pdt = this.ctx.get("main");
	            } else {
	                pdt = product;
	            }
	            var pid = opts.product_id ? opts.product_id : product.val("product_id");
	            var config = CONFIGS[pid];
	            var fn = null;
	            if (this.fname in config) {
	                var fname = config[this.fname];
	                if (_lodash2.default.isArray(fname)) {
	                    // an array means it has the formatters configured as well, we just take the 1st value of the list
	                    fname = fname[0];
	                }
	                fn = formulas[fname];
	                if (_lodash2.default.isNull(fn)) {
	                    throw Error("Exception in class Field, unable to load formula " + this.fname + " product " + pid);
	                } else {
	                    try {
	                        return fn(this.ctx, policy, people, product, fund, t, opts);
	                    } catch (err) {
	                        console.log("ERROR:", err, fname);
	                        //                  debugger;
	                        throw err; // rethrow the error
	                    }
	                }
	            } else {
	                    return;
	                }
	        }
	    }]);

	    return Field;
	}();

	var Entity = function () {
	    function Entity(ctx, entityType, product_id) {
	        var iterable = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	        _classCallCheck(this, Entity);

	        this.fieldMap = iterable;
	        this.ctx = ctx;
	        this.entityType = entityType;
	        this.product_id = product_id;
	        this.validatorList = {};
	    }

	    _createClass(Entity, [{
	        key: "getFields",
	        value: function getFields() {
	            return this.fieldMap;
	        }
	    }, {
	        key: "getField",
	        value: function getField(k) {
	            if (k in this.fieldMap) {
	                return this.fieldMap[k];
	            } else {
	                // field has not been created, lazily create it if the field exists as a db field or calculation field
	                // let pdt = this.ctx.get("product");
	                // use main product, if current product is not set in the ctx
	                // if ( !pdt ) { pdt = this.ctx.get("main"); }
	                var _config = CONFIGS[this.product_id];
	                var fmlaFields = _lodash2.default.keys(_config);
	                var dbFields = _lodash2.default.keys(DB[this.product_id]);
	                if (_lodash2.default.includes(dbFields, k)) {
	                    var f = new Field(this.ctx, k, { parentType: this.entityType, parent: this, dbField: true });
	                    this.fieldMap[k] = f;
	                    return f;
	                } else if (_lodash2.default.includes(fmlaFields, k)) {
	                    var formatter1 = undefined,
	                        formatter2 = undefined,
	                        field = undefined;
	                    if (_lodash2.default.has(_config, k)) {
	                        field = _config[k];
	                        if (_lodash2.default.isArray(field)) {
	                            formatter1 = field[1]; // item 0 is the formula_id, which we do not use here
	                            formatter2 = field[2];
	                        }
	                    }
	                    var f = new Field(this.ctx, k, { parentType: this.entityType, parent: this, fmlaField: true, format1: formatter1, format2: formatter2 });
	                    this.fieldMap[k] = f;
	                    return f;
	                } else {
	                    // create a field that will return null since it is not a db field and also not a calculation field
	                    var f = new Field(this.ctx, k, { parentType: this.entityType, parent: this, inputField: true, value: null });
	                    this.fieldMap[k] = f;
	                    return f;
	                }
	            }
	        }
	    }, {
	        key: "val",
	        value: function val(k) {
	            var t = arguments.length <= 1 || arguments[1] === undefined ? '*' : arguments[1];
	            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            var field = this.getField(k, options);
	            var res = undefined;
	            if (field) {
	                if (field instanceof Field) {
	                    // commented out code to auto set the value of t
	                    /*
	                    if ( t === '*' && this.ctx.get("current_t") ) {
	                       t = this.ctx.get("current_t");
	                    } */
	                    res = field.getValue(t, options);
	                } else {
	                    return field;
	                }
	            }
	            return res;
	        }
	        // add in methods to access only the input field , can ?

	    }, {
	        key: "input",
	        value: function input(fname) {
	            var t = arguments.length <= 1 || arguments[1] === undefined ? '*' : arguments[1];
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            var field = this.getField(fname, opts),
	                result = undefined;

	            if (field) {
	                if (field.inputField) {
	                    result = field.getValue(t, opts);
	                } else {
	                    console.log("Not an inputField", fname, field, field.getValue(t, opts));
	                    throw Error("Not an inputfield : " + fname);
	                }
	            } else {
	                result = field;
	            }
	            return result;
	        }
	    }, {
	        key: "fmval",
	        value: function fmval(fname) {
	            var t = arguments.length <= 1 || arguments[1] === undefined ? '*' : arguments[1];
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            var field = this.getField(fname, opts),
	                result = undefined;

	            if (field) {
	                if (field.fmlaField) {
	                    result = field.getValue(t, opts);
	                } else {
	                    throw Error("Not an calculator field : " + fname);
	                }
	            } else {
	                result = field;
	            }
	            return result;
	        }
	    }, {
	        key: "dbval",
	        value: function dbval(fname) {
	            var t = arguments.length <= 1 || arguments[1] === undefined ? '*' : arguments[1];
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            var field = this.getField(fname, opts),
	                result = undefined;
	            if (field) {
	                if (field.dbField) {
	                    result = field.getValue(t, opts);
	                } else {
	                    throw Error("Not an db field : " + fname);
	                }
	            } else {
	                result = field;
	            }
	            return result;
	        }
	    }, {
	        key: "db0",
	        value: function db0(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[0];
	        }
	    }, {
	        key: "db1",
	        value: function db1(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[1];
	        }
	    }, {
	        key: "db2",
	        value: function db2(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[2];
	        }
	    }, {
	        key: "db3",
	        value: function db3(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[3];
	        }
	    }, {
	        key: "db4",
	        value: function db4(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[4];
	        }
	    }, {
	        key: "db5",
	        value: function db5(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[5];
	        }
	    }, {
	        key: "db6",
	        value: function db6(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[6];
	        }
	    }, {
	        key: "db7",
	        value: function db7(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[7];
	        }
	    }, {
	        key: "db8",
	        value: function db8(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[8];
	        }
	    }, {
	        key: "db9",
	        value: function db9(fname, t) {
	            var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            return this.dbval(fname, t, opts)[9];
	        }
	    }, {
	        key: "setField",
	        value: function setField(k, f) {
	            this.fieldMap[k] = f;
	            return;
	        }
	    }, {
	        key: "validate",
	        value: function validate(name, opts) {
	            // note : no caching of the validators and results
	            var validator = undefined;
	            if (name in this.validatorList) {
	                validator = this.validatorList[name];
	            } else {
	                validator = new Validator(this.product_id, name, this, this.ctx, _lodash2.default.extend({}, opts));
	                this.validatorList[name] = validator;
	            }

	            var result = validator.validate();
	            if (!_lodash2.default.isArray(result)) {
	                result = [result];
	            }
	            result = _lodash2.default.filter(result, function (err) {
	                return !_lodash2.default.isUndefined(err);
	            });
	            result = _lodash2.default.flatten(result);
	            return result;
	        }
	    }, {
	        key: "check",
	        value: function check(validatorName, opts) {
	            return this.validate(validatorName, opts);
	        }
	    }]);

	    return Entity;
	}();

	var Context = function () {
	    function Context() {
	        var dict = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        _classCallCheck(this, Context);

	        this.data = dict;
	        return;
	    }

	    _createClass(Context, [{
	        key: "exists",
	        value: function exists(k) {
	            return k in this.data;
	        }
	    }, {
	        key: "get",
	        value: function get(k) {
	            return this.data[k];
	        }
	    }, {
	        key: "set",
	        value: function set(k, v) {
	            this.data[k] = v;
	            return;
	        }
	    }]);

	    return Context;
	}();

	var Validator = exports.Validator = function () {
	    function Validator(productId, validatorName, parent, ctx, opts) {
	        _classCallCheck(this, Validator);

	        this.productId = productId;
	        this.validatorName = validatorName;
	        this.parent = parent;
	        this.ctx = ctx;
	        this.opts = opts;
	        this.config = CONFIGS[productId]['validators'];
	    }

	    _createClass(Validator, [{
	        key: "validate",
	        value: function validate() {
	            var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            // load the validator based on the name
	            var fullname = this.validatorName in this.config ? this.config[this.validatorName] : null;
	            var validator = fullname ? validators[fullname] : null;
	            if (!validator) return 'Unable to locate validator : ' + this.validatorName; // if the validator does not exists --> assume it will return false, assume not ok
	            return validator(this.ctx, this.parent, opts);
	        }
	    }]);

	    return Validator;
	}();

	exports.Field = Field;
	exports.Entity = Entity;
	exports.Context = Context;
	exports.DB = DB;
	exports.CONFIGS = CONFIGS;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _common = __webpack_require__(7);

	var _loop = function _loop(_key7) {
	  if (_key7 === "default") return "continue";
	  Object.defineProperty(exports, _key7, {
	    enumerable: true,
	    get: function get() {
	      return _common[_key7];
	    }
	  });
	};

	for (var _key7 in _common) {
	  var _ret = _loop(_key7);

	  if (_ret === "continue") continue;
	}

	var _premium = __webpack_require__(8);

	var _loop2 = function _loop2(_key8) {
	  if (_key8 === "default") return "continue";
	  Object.defineProperty(exports, _key8, {
	    enumerable: true,
	    get: function get() {
	      return _premium[_key8];
	    }
	  });
	};

	for (var _key8 in _premium) {
	  var _ret2 = _loop2(_key8);

	  if (_ret2 === "continue") continue;
	}

	var _death = __webpack_require__(9);

	var _loop3 = function _loop3(_key9) {
	  if (_key9 === "default") return "continue";
	  Object.defineProperty(exports, _key9, {
	    enumerable: true,
	    get: function get() {
	      return _death[_key9];
	    }
	  });
	};

	for (var _key9 in _death) {
	  var _ret3 = _loop3(_key9);

	  if (_ret3 === "continue") continue;
	}

	var _survival = __webpack_require__(10);

	var _loop4 = function _loop4(_key10) {
	  if (_key10 === "default") return "continue";
	  Object.defineProperty(exports, _key10, {
	    enumerable: true,
	    get: function get() {
	      return _survival[_key10];
	    }
	  });
	};

	for (var _key10 in _survival) {
	  var _ret4 = _loop4(_key10);

	  if (_ret4 === "continue") continue;
	}

	var _surrender = __webpack_require__(11);

	var _loop5 = function _loop5(_key11) {
	  if (_key11 === "default") return "continue";
	  Object.defineProperty(exports, _key11, {
	    enumerable: true,
	    get: function get() {
	      return _surrender[_key11];
	    }
	  });
	};

	for (var _key11 in _surrender) {
	  var _ret5 = _loop5(_key11);

	  if (_ret5 === "continue") continue;
	}

	var _ilp = __webpack_require__(12);

	var _loop6 = function _loop6(_key12) {
	  if (_key12 === "default") return "continue";
	  Object.defineProperty(exports, _key12, {
	    enumerable: true,
	    get: function get() {
	      return _ilp[_key12];
	    }
	  });
	};

	for (var _key12 in _ilp) {
	  var _ret6 = _loop6(_key12);

	  if (_ret6 === "continue") continue;
	}

	var FIXME = exports.FIXME = 'FIXME';

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.zero = zero;
	exports.proposal_start_date__01 = proposal_start_date__01;
	exports.age_method__01 = age_method__01;
	exports.max_t__0327 = max_t__0327;
	exports.max_t__01 = max_t__01;
	exports.age_at_t__01 = age_at_t__01;
	exports.age_at_t__02 = age_at_t__02;
	exports.age_at_t__03 = age_at_t__03;
	exports.tdc__01 = tdc__01;
	exports.cover_duration__01 = cover_duration__01;
	exports.cover_term__03 = cover_term__03;
	exports.cover_term__04 = cover_term__04;
	exports.cover_term__05 = cover_term__05;
	exports.cover_term__06 = cover_term__06;
	exports.coverage_term__01 = coverage_term__01;
	exports.coverage_term__02 = coverage_term__02;
	exports.maturity_age__01 = maturity_age__01;
	exports.maturity_age__02 = maturity_age__02;
	exports.maturity_age__03 = maturity_age__03;
	exports.premium_term__01 = premium_term__01;
	exports.entry_age__01 = entry_age__01;
	exports.ph_entry_age__01 = ph_entry_age__01;
	exports.sa_calculated__01 = sa_calculated__01;
	exports.sa_calculated__02 = sa_calculated__02;
	exports.sa_calculated__03 = sa_calculated__03;
	exports.sa_calculated__04 = sa_calculated__04;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function zero(ctx, policy, people, product, fund, t, factors) {
	    return 0;
	}

	function proposal_start_date__01(ctx, policy, people, product, fund, t, factors) {
	    var proposal_date = policy.val("proposal_date");
	    return (0, _moment2.default)(proposal_date, ['D-M-YYYY', 'YYYY-M-D']).subtract(1, 'month').endOf('month').add(1, 'day').format('YYYY-MM-DD');
	}
	function age_method__01(ctx, policy, people, product, fund, t, factors) {
	    var method = product.val("product_life").age_method;
	    return method === '1' ? "ANB" : method === '2' ? "ALAB" : method === '3' ? "ANMB" : method === '4' ? "ANRB" : "ANRBM";
	}
	function max_t__0327(ctx, policy, people, product, fund, t, factors) {
	    var main = ctx.get("main"),
	        row = main.val("age_limit"),
	        ageUnit = row["max_insd_nb_age_unit"],
	        age = row["max_insd_nb_age"],
	        minAge = ageUnit === "1" ? age + 5 > 40 ? age + 5 : 40 : 40,
	        ageMethod = main.val("age_method"),
	        la = people[main.val("la")],
	        dob = la.val("dob"),
	        entryAge = utils.calcAge(ageMethod, dob),
	        maxT = minAge - Math.ceil(entryAge / 5) * 5;
	    return maxT;
	}
	function max_t__01(ctx, policy, people, product, fund, t, factors) {
	    // max value of t using month as the unit, basically coverage_term * 12
	    var prem_terms = product.val("premium_terms", t, {}),
	        rows = [];
	    rows = _lodash2.default.filter(prem_terms, function (term) {
	        return term.period === '2';
	    });
	    if (rows.length === 1) {
	        return rows[0].year * 12;
	    } else {
	        throw Error("common.js->max_t__02, incorrectly configured formula, there should only be 1 record in allowable prem terms");
	    }
	}

	function age_at_t__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    var pdt = ctx.exists("product") ? ctx.get("product") : ctx.get("main"),
	        personNo = pdt.val("la"),
	        main = policy.val("products")[0],
	        ageMethod = main.val("age_method"),
	        la = people[main.val("la")],
	        dob = la.val("dob"),
	        entryAge = utils.calcAge(ageMethod, dob);
	    return entryAge + t - 1; // -1 is to offset t since it starts from 1 instead of zero
	}

	function age_at_t__02(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.val("entry_age") + t - 1;
	}

	function age_at_t__03(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    // based on t where it is the policy month

	    var ageMethod = product.val("age_method"),
	        la = people[product.val("la")],
	        workdate = utils.toDate(policy.val("proposal_start_date")),
	        birthdate = la.val("dob");

	    workdate.add(t, 'months'); // add the policy month to the proposal start date

	    var dob = _moment2.default.isMoment(birthdate) ? birthdate : utils.toDate(birthdate);
	    if (!_lodash2.default.has(dob, 'isValid')) {
	        dob = (0, _moment2.default)(dob);
	    }
	    var anniversary = dob.month() === workdate.month() && dob.day() === workdate.day() ? true : false;
	    var age = workdate.diff(dob, 'years');
	    if (ageMethod === 'ANB') {
	        age = anniversary ? age : age + 1;
	    } else if (ageMethod === 'ALAB') {
	        age = anniversary ? age - 1 : age;
	    } else {
	        age1 = workdate.diff(dob, 'years', true);
	        age = age1 - age > 0.5 ? age : age + 1;
	    }
	    return age;
	}
	function tdc__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    if (t === 0) {
	        return 0;
	    }

	    var ratea = product.val("tdc_rate_a", tt)["rate_value"],
	        rateb = product.val("tdc_rate_b", tt)["rate_value"],
	        ratec = product.val("tdc_rate_c", tt)["rate_value"];

	    return product.val("tdc", t - 1) + product.val("apt", t) * ratea * rateb * ratec;
	}
	function cover_duration__01(ctx, policy, people, product, fund) {
	    var tt = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    var main = policy.val("products")[0],
	        max_end_age = main.val("age_limit")["max_insd_nb_ex_age"],

	    //la = people[main.val("la")],
	    age = product.val("entry_age");
	    //age = la.val("age");

	    return max_end_age - age;
	}
	function cover_term__03(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return 60 - product.val("entry_age"); // 60 is specific to IADR01 and not configured in age_limit
	}
	function cover_term__04(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return 65 - product.val("entry_age"); // 75 is hard coded as it is not in age_limit
	}
	function cover_term__05(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.val("age_limit")["max_insd_nb_ex_age"] - product.val("entry_age");
	    // maturity_age is based on value stored in age_limit
	}
	function cover_term__06(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    // maximum of x years or reaches y age, so get the max from term limit
	    var terms = product.dbval("coverage_terms");
	    //    debugger;
	    var t1 = _lodash2.default.filter(terms, function (item) {
	        return item.period === '2';
	    }).map(function (item) {
	        return item.year;
	    });
	    var max_years = t1.length > 0 ? _lodash2.default.max(t1) : 999;
	    var t2 = _lodash2.default.filter(terms, function (item) {
	        return item.period === '3';
	    }).map(function (item) {
	        return item.year;
	    });
	    var max_age = t2.length > 0 ? _lodash2.default.max(t2) : 999;
	    //    console.log("max_age, max_years", max_age, max_years,t1, t2);
	    var entry_age = product.val("entry_age");
	    var duration1 = max_age && entry_age ? max_age - entry_age : 999;
	    var duration2 = max_years ? max_years : 999;
	    var duration3 = product.input("cover_age") ? product.input("cover_age") - entry_age : 999;

	    return _lodash2.default.min([duration1, duration2, duration3]);
	}

	function coverage_term__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    var main = policy.val("products")[0],
	        max_end_age = main.val("age_limit")["max_insd_nb_ex_age"],
	        age = product.val("entry_age");
	    //        la = people[main.val("la")],
	    //        age = la.val("age");

	    return max_end_age - age;

	    //    return product.val("cover_duration",t, factors);
	}
	function coverage_term__02(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    // typically used for riders, as it compares against the main cover term
	    var main = ctx.get("main");
	    var max_end_age = product.dbval("age_limit").max_insd_nb_ex_age;
	    var entry_age = product.val("entry_age");
	    var main_max_end_age = main.dbval("age_limit").max_insd_nb_ex_age;
	    var main_entry_age = main.val("entry_age");
	    var res = Math.min(main_max_end_age - main_entry_age, max_end_age - entry_age);
	    console.log("coverage_duration_02, res", res);
	    return res;
	    //    return Math.min( (main_max_end_age - main_entry_age), (max_end_age - entry_age) );
	}

	function maturity_age__01(ctx, policy, people, product, fund) {
	    var tt = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.val("age_limit")["max_insd_nb_ex_age"];
	}
	function maturity_age__02(ctx, policy, people, product, fund) {
	    var tt = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.val("entry_age") + product.val("cover_term");
	}
	function maturity_age__03(ctx, policy, people, product, fund) {
	    var tt = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.val("cover_age");
	}

	function premium_term__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.val("coverage_term"); // simply follow the coverage term
	}

	function entry_age__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    var ageMethod = product.val("age_method"),
	        la = people[product.val("la")],
	        dob = la.val("dob");

	    return utils.calcAge(ageMethod, dob);
	}
	function ph_entry_age__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    var ageMethod = product.val("age_method");
	    var ph = _lodash2.default.find(people, function (person) {
	        return person.input("is_ph");
	    });
	    if (ph) {
	        var dob = ph.val("dob");
	        return utils.calcAge(ageMethod, dob);
	    }
	    return 0;
	}

	function sa_calculated__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.val("basic_sa");
	}
	function sa_calculated__02(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.val("initial_sa");
	}
	function sa_calculated__03(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.val("initial_sa") * 50000;
	}
	function sa_calculated__04(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return product.input("initial_sa") || product.input("basic_sa");
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ap__01 = ap__01;
	exports.ap__02 = ap__02;
	exports.ap__03 = ap__03;
	exports.apt__01 = apt__01;
	exports.apt__02 = apt__02;
	exports.tpp__01 = tpp__01;
	exports.tpp__02 = tpp__02;
	exports.prem__01 = prem__01;
	exports.premium_at_t__01 = premium_at_t__01;
	exports.totprem__01 = totprem__01;
	exports.pol_apt__01 = pol_apt__01;
	exports.pol_tpp__01 = pol_tpp__01;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function ap__01(ctx, policy, people, product, fund, t, factors) {
	    var la = people[product.val("la")],
	        sa = product.val("initial_sa"),
	        sa_unit_rate = product.val("sa_unit_rate").unit_amount,
	        lsad_rate = product.val("lsad_rate").discount_rate || 0,
	        premium_rate = product.val("premium_rate").premium_rate,
	        isForeigner = la.val("is_foreigner"),
	        multiplier = isForeigner ? 1.5 : 1.0,
	        ap = undefined;
	    ap = sa / sa_unit_rate * multiplier * (premium_rate - lsad_rate);
	    return utils.roundTo(ap, 2);
	}
	function ap__02(ctx, policy, people, product, fund, t, factors) {
	    var la = people[product.val("la")],
	        sa = product.val("initial_sa"),
	        unit_rate = product.val("unit_rate").sa_unit_amount,
	        lsad_rate = product.val("lsad_rate").discount_rate || 0,
	        premium_rate = product.val("premium_rate").pr_1;

	    return sa / unit_rate * (premium_rate - lsad_rate);
	}
	function ap__03(ctx, policy, people, product, fund, t, factors) {
	    var la = people[product.val("la")],
	        sa = product.val("initial_sa"),
	        unit_rate = product.val("unit_rate").sa_unit_amount,
	        lsad_rate = product.val("lsad_rate").discount_rate || 0,
	        premium_rate = product.val("premium_rate").result_value_1; // instead of pr_1 aarrrgggg

	    return sa / unit_rate * (premium_rate - lsad_rate);
	}

	function apt__01(ctx, policy, people, product, fund, t, factors) {
	    var la = people[product.val("la")],
	        sa = product.val("initial_sa"),
	        sa_unit_rate = product.val("sa_unit_rate").unit_amount,
	        lsad_rate = product.val("lsad_rate").discount_rate || 0,
	        dob = la.val("dob"),
	        ageMethod = product.val("age_method"),
	        k = Math.floor((t + 4) / 5),
	        options = { age: utils.calcAge(ageMethod, dob) + (5 * k - 5) },
	        premium_rate = product.val("premium_rate", t, options).premium_rate,
	        isForeigner = la.val("is_foreigner"),
	        multiplier = isForeigner ? 1.5 : 1.0;

	    return utils.roundTo(sa / sa_unit_rate * multiplier * (premium_rate - lsad_rate), 0);
	    //return utils.roundTo(ap,0);
	}

	function apt__02(ctx, policy, people, product, fund, t, factors) {
	    return t > product.val("premium_term") ? 0 : product.val("ap");
	}
	function tpp__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return t === 0 ? 0 : product.val("apt", t) + product.val("tpp", t - 1);
	}
	function tpp__02(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return t === 0 ? 0 : product.val("premium_at_t", t) + product.val("tpp", t - 1);
	}

	function prem__01(ctx, policy, people, product, fund, t, factors) {
	    var modal_factor = product.val("modal_factor").charge_rate;

	    return product.val("ap") * modal_factor;
	}

	function premium_at_t__01(ctx, policy, people, product, fund, t, factors) {
	    var prem_freq = policy.input("prem_freq"),
	        premium = 0;
	    if (prem_freq === '4') {
	        premium = product.val("ap") * product.val("modal_factor").charge_rate;
	    } else {
	        // yearly, assume pay on anniversary of the proposal start date
	        premium = t % 12 === 1 ? product.val("ap") : 0;
	    }
	    return premium;
	}

	function totprem__01(ctx, policy, people, product, fund, t, factors) {
	    return _lodash2.default.sum(_lodash2.default.map(policy.val("products"), function (prd, idx) {
	        return prd.val("ap");
	    }));

	    // let products = policy.val("products");
	    // let sum = 0;
	    // _.forEach(products, (product,index) => {
	    //     sum = sum + product.val("ap");
	    // });
	    // return sum;
	}
	function pol_apt__01(ctx, policy, people, product, fund, t, factors) {
	    var tt = t ? t : 0;
	    if (tt === 0) {
	        return 0;
	    }
	    return _lodash2.default.sum(_lodash2.default.map(policy.val("products"), function (prd) {
	        return prd.val("apt", tt);
	    }));
	}

	function pol_tpp__01(ctx, policy, people, product, fund, t, factors) {
	    var tt = t ? t : 0;
	    if (tt === 0) {
	        return 0;
	    }
	    return policy.val("pol_tpp", tt - 1) + policy.val("pol_apt", tt);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.dbg__01 = dbg__01;
	exports.dbgt__01 = dbgt__01;
	exports.db__01 = db__01;
	exports.dbt__01 = dbt__01;
	exports.tot_dbt__01 = tot_dbt__01;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function dbg__01(ctx, policy, people, product, fund, t, factors) {
	    var sa = product.val("initial_sa") || 0;
	    return utils.roundTo(sa);
	}
	function dbgt__01(ctx, policy, people, product, fund, t, factors) {
	    var sa = product.val("initial_sa") || 0,
	        rate = product.val("sa_schedule", t).sa_rate || 1,
	        // no sa_schedule means multiple is 1
	    lien_rate = product.val("lien_rate", t).lien_rate || 1; // no lien rate means no lien

	    return sa * rate * lien_rate;
	}

	function db__01(ctx, policy, people, product, fund, t, factors) {
	    return product.val("dbgt") + product.val("dbng");
	}

	function dbt__01(ctx, policy, people, product, fund, t, factors) {
	    return product.val("dbgt", t) + product.val("dbng", t);
	}
	function tot_dbt__01(ctx, policy, people, product, fund, t, factors) {
	    return product.val("dbt", t) + product.val("accsb", t);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.sbg__01 = sbg__01;
	exports.accsbrate__01 = accsbrate__01;
	exports.accsb__01 = accsb__01;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function sbg__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    if (t === product.val("coverage")) {
	        return 0;
	    }

	    var unit_rate = product.val("sb_config", t).sur_amount || 0,
	        sb_rate = product.val("sb_pay", t).pay_amount || 0,
	        sa = product.val("initial_sa");

	    return sa * (sb_rate / unit_rate);
	}

	function accsbrate__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    return 0.045;
	}

	function accsb__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    if (t == 0) {
	        return 0;
	    }
	    var int_rate = product.val("accsbrate"),
	        accsb = product.val("accsb", t - 1) * (1 + product.val("accsbrate")) + product.val("sbg", t);

	    return accsb;
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.svg__01 = svg__01;
	exports.svg_at_t__01 = svg_at_t__01;
	exports.tsv__01 = tsv__01;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function svg__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    if (t === 0) {
	        return 0;
	    }

	    var row = product.val("cash_value", t),
	        cash_value = t === product.val("coverage") ? row.sv_sb : row.sv,
	        unit_rate = product.val("unit_rate", t).sa_unit_amount,
	        sa = product.val("initial_sa");

	    return sa * cash_value / unit_rate;
	}

	function svg_at_t__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    if (t === 0) {
	        return 0;
	    }

	    var rate = 0;
	    if (t > 96 && t <= 108) {
	        rate = 0.5;
	    } else if (t > 108 && t <= 999) {
	        rate = 0.8;
	    }
	    return product.val("tpp", t) * rate;
	}

	function tsv__01(ctx, policy, people, product, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	    var factors = arguments[6];

	    if (t === 0) {
	        return 0;
	    }

	    return product.val("svg", t) + product.val("accsb", t);
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.coi_at_t__01 = coi_at_t__01;
	exports.monthly_coi__01 = monthly_coi__01;
	exports.monthly_coi__02 = monthly_coi__02;
	exports.basic_cost_at_t__01 = basic_cost_at_t__01;
	exports.basic_cost_at_t__02 = basic_cost_at_t__02;
	exports.total_loadings__01 = total_loadings__01;
	exports.withdrawal_at_t__01 = withdrawal_at_t__01;
	exports.out_at_t__01 = out_at_t__01;
	exports.atu_at_t__01 = atu_at_t__01;
	exports.in_at_t__01 = in_at_t__01;
	exports.tp_at_t__01 = tp_at_t__01;
	exports.target_premium_at_t__01 = target_premium_at_t__01;
	exports.ilp_ap__10 = ilp_ap__10;
	exports.ilp_prem__10 = ilp_prem__10;
	exports.rtu_at_t__01 = rtu_at_t__01;
	exports.sp_at_t__01 = sp_at_t__01;
	exports.regular_topup_at_t__01 = regular_topup_at_t__01;
	exports.pol_fee_at_t__01 = pol_fee_at_t__01;
	exports.pol_fee_at_t__02 = pol_fee_at_t__02;
	exports.pol_fee_after_modal_factor__01 = pol_fee_after_modal_factor__01;
	exports.pol_fee_after_modal_factor__02 = pol_fee_after_modal_factor__02;
	exports.pol_fee_before_modal_factor__01 = pol_fee_before_modal_factor__01;
	exports.debt_at_t__01 = debt_at_t__01;
	exports.debt_for_t__01 = debt_for_t__01;
	exports.debt_paid_at_t__01 = debt_paid_at_t__01;
	exports.debt_repay_for_t__01 = debt_repay_for_t__01;
	exports.debt_accum_period__02 = debt_accum_period__02;
	exports.debt_repay_period__01 = debt_repay_period__01;
	exports.accum_factor__01 = accum_factor__01;
	exports.outstd_debt_at_t__01 = outstd_debt_at_t__01;
	exports.tiv_low_at_t__01 = tiv_low_at_t__01;
	exports.tiv_mid_at_t__01 = tiv_mid_at_t__01;
	exports.tiv_high_at_t__01 = tiv_high_at_t__01;
	exports.tiv_low_at_t__02 = tiv_low_at_t__02;
	exports.tiv_mid_at_t__02 = tiv_mid_at_t__02;
	exports.tiv_high_at_t__02 = tiv_high_at_t__02;
	exports.dbg_at_t__10 = dbg_at_t__10;
	exports.db_low_at_t__10 = db_low_at_t__10;
	exports.db_mid_at_t__10 = db_mid_at_t__10;
	exports.db_high_at_t__10 = db_high_at_t__10;
	exports.monthly_cor__01 = monthly_cor__01;
	exports.cor_at_t__01 = cor_at_t__01;
	exports.cor_at_t__02 = cor_at_t__02;
	exports.cor_at_t__03 = cor_at_t__03;
	exports.cor_at_t__04 = cor_at_t__04;
	exports.total_cor_at_t__01 = total_cor_at_t__01;
	exports.accum_cor_at_t__01 = accum_cor_at_t__01;
	exports.sp_premium__10 = sp_premium__10;
	exports.sp_ap__10 = sp_ap__10;
	exports.ilp_surrender_charge_at_t__01 = ilp_surrender_charge_at_t__01;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function coi_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.val("basic_cost_at_t", t, factors) + product.val("total_loadings", t, factors);
	}

	function monthly_coi__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.val("coi_at_t", 1) / 12;
	}

	function monthly_coi__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  // get the monthly modal factor -- charge_type = 4
	  return product.val("coi_at_t", 1) * product.db0("modal_factor", '*', { charge_type: '4' });
	}

	function basic_cost_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var la = people[product.val("la")],
	      sa = product.input("basic_sa"),
	      unit_rate = product.dbval("unit_rate").sa_unit_amount,
	      lsad_rate = product.db0("lsad_rate") || 0,
	      coi_rate = product.db0("coi_rate", t);

	  return sa / unit_rate * (coi_rate - lsad_rate);
	}
	function basic_cost_at_t__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var la = people[product.val("la")],
	      sa = product.fmval("sa_calculated"),
	      unit_rate = product.dbval("unit_rate").sa_unit_amount,
	      lsad_rate = product.db0("lsad_rate") || 0,
	      coi_rate = product.db0("coi_rate", t);

	  return sa / unit_rate * (coi_rate - lsad_rate);
	}

	function total_loadings__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var type = undefined,
	      rate = undefined;
	  return _lodash2.default.sum(_lodash2.default.map(product.val("loadings"), function (loading, index) {
	    rate = loading.val("rate");
	    return loading.val("type") === 'percentage' ? product.val("basic_cost_at_t", t) * rate / 100 : product.val("sa_calculated") * rate / product.dbval("unit_rate").sa_unit_amount;
	  }));
	}

	function withdrawal_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var rows = undefined;
	  rows = _lodash2.default.filter(policy.val("withdrawals"), function (row, index) {
	    return row.val("year") === t;
	  });
	  return rows.length > 0 ? rows[0].val("amount") : 0;
	}

	function out_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var rows = undefined;
	  rows = _lodash2.default.filter(policy.val("withdrawals"), function (row, index) {
	    return row.val("year") === t;
	  });
	  return rows.length > 0 ? rows[0].val("amount") : 0;
	}

	function atu_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var topups = _lodash2.default.filter(policy.val("topups"), function (topup, index) {
	    return topup.val("year") === t;
	  }),
	      alloc_rate = 1 - product.val("atu_expense_fee", t).assign_rate;

	  return topups.length > 0 ? topups[0].val("amount") * alloc_rate : 0;
	}

	function in_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var topups = _lodash2.default.filter(policy.val("topups"), function (topup, index) {
	    return topup.val("year") === t;
	  });

	  return topups.length > 0 ? topups[0].val("amount") : 0;
	}

	function tp_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  // target premium that is investable
	  var allocation_rate = 1 - product.val("tp_expense_fee", t).assign_rate;
	  return t > product.val("premium_term") ? 0 : product.input("target_premium") * product.dbval("modal_factor").charge_rate * allocation_rate;
	}
	function target_premium_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  // gross target premium amount
	  return t > product.val("premium_term") ? 0 : product.input("target_premium") * product.dbval("modal_factor").charge_rate;
	}
	function ilp_ap__10(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.val("target_premium_at_t", 1) + product.val("regular_topup_at_t", 1);
	}
	function ilp_prem__10(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.input("target_premium") + product.input("rtu");
	}

	function rtu_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  // investable rtu
	  var premium_term = product.val("premium_term"),
	      alloc_rate = 1 - product.val("rtu_expense_fee", t).assign_rate;

	  return t > premium_term ? 0 : product.input("rtu") * product.val("modal_factor").charge_rate * alloc_rate;
	}

	function sp_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  // investable single premium
	  var premium_term = 1,
	      // always 1 since we are dealing with single premium
	  alloc_rate = 1 - product.val("sp_expense_fee", t).assign_rate;
	  //  if (t < 3 ) { debugger}
	  return t > premium_term ? 0 : product.input("target_premium") * product.val("modal_factor").charge_rate * alloc_rate;
	}

	function regular_topup_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  // gross rtu
	  var premium_term = product.val("premium_term");

	  return t > premium_term ? 0 : product.input("rtu") * product.val("modal_factor").charge_rate;
	}

	function pol_fee_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.val("ilp_pol_fee_rate", t).assign_rate;
	}

	function pol_fee_at_t__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.val("ilp_pol_fee_rate", t).assign_rate * 12; // fees are monthly, we change to yearly if t is in years
	}
	function pol_fee_after_modal_factor__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.val("pol_fee_at_t", 1) * (1 / 12); //product.db0("charges_modal_factor",'*',{charge_type:"4"});
	}
	function pol_fee_after_modal_factor__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.val("pol_fee_at_t", 1) / product.db0("policy_fee_modal_factor");
	}
	function pol_fee_before_modal_factor__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.val("pol_fee_at_t", 1);
	}

	function debt_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return _lodash2.default.sum(_lodash2.default.map(_lodash2.default.range(1, t + 1), function (tt) {
	    return product.val("debt_for_t", tt);
	  }));
	}
	function debt_for_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var start = 1,
	      end = product.val("debt_accum_period");
	  return t >= start && t <= end ? product.val("pol_fee_at_t", t) + product.val("coi_at_t", t) + product.val("total_cor_at_t", t) : 0;
	}
	function debt_paid_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return _lodash2.default.sum(_lodash2.default.map(_lodash2.default.range(1, t + 1), function (tt) {
	    return product.val("debt_repay_for_t", tt);
	  }));
	}
	function debt_repay_for_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  // debt repayment starts after debt accumulation period
	  var main = ctx.get("main"),
	      start = main.val("debt_accum_period") + 1,
	      paym_period = main.val("debt_repay_period"),
	      end = start + paym_period - 1;

	  if (t >= start && t <= end) {
	    return t < end ? product.val("debt_at_t", t - 1) / paym_period : product.val("debt_at_t", t - 1) - product.val("debt_paid_at_t", t - 1);
	  }
	  return 0;
	}
	function debt_accum_period__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return 2;
	}
	function debt_repay_period__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return 2;
	}

	function accum_factor__01(ctx, policy, people, product, fund, t, factors) {
	  var freq = policy.val("prem_freq"),
	      factor = undefined;
	  factor = freq === '1' ? 12 : freq === '5' ? 12 : freq === '2' ? 9 : freq === '3' ? 7.5 : 6.5;
	  return factor;
	}
	function outstd_debt_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var debt = 0,
	      paym = 0;
	  _lodash2.default.forEach(_lodash2.default.range(1, t + 1), function (tt, index) {
	    debt += product.val("debt_for_t", tt);paym += product.val("debt_repay_for_t", tt);
	  });
	  return debt - paym;
	}

	function tiv_low_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return tiv_at_t(ctx, policy, people, product, fund, t, _lodash2.default.extend(factors, { 'rate_type': 'fund_low_rate' }));
	}
	function tiv_mid_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return tiv_at_t(ctx, policy, people, product, fund, t, _lodash2.default.extend(factors, { 'rate_type': 'fund_mid_rate' }));
	}
	function tiv_high_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return tiv_at_t(ctx, policy, people, product, fund, t, _lodash2.default.extend(factors, { 'rate_type': 'fund_high_rate' }));
	}
	function tiv_at_t(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  if (!'rate_type' in factors) {
	    throw Error("Function tiv_at_t__01, please specify the rate_type");
	  }
	  var rate_type = factors.rate_type;
	  var tiv_type = rate_type === 'fund_low_rate' ? 'tiv_low_at_t' : rate_type === 'fund_mid_rate' ? 'tiv_mid_at_t' : 'tiv_high_at_t';
	  if (t === 0) {
	    return 0;
	  }

	  var amt = 0,
	      debt_accum_period = product.val("debt_accum_period"),
	      debt_repay_period = product.val("debt_repay_period");
	  var debt_start = 1,
	      debt_end = product.val("debt_accum_period");
	  var debt_repay_start = debt_end + 1,
	      debt_repay_end = debt_repay_start + debt_repay_period - 1;

	  var intrate = product.val(rate_type, t).rate,
	      accum_factor = product.val("accum_factor"); //
	  var debt_repay = t >= debt_repay_start && t <= debt_repay_end ? product.val("debt_repay_for_t", t) : 0;
	  var charges = t >= debt_start && t <= debt_end ? 0 : (product.val("coi_at_t", t) + product.val("total_cor_at_t", t) + product.val("mac_at_t", t) + product.val("pol_fee_at_t", t) + debt_repay) * Math.pow(1 + intrate, 6.5 / 12);

	  amt += (policy.val("atu_at_t", t) + product.val(tiv_type, t - 1)) * (1 + intrate);
	  // if (t < 5 ) {debugger};
	  amt += (product.val("rtu_at_t", t) + product.val("tp_at_t", t)) * Math.pow(1 + intrate, accum_factor / 12); // need to find out more about accum factor
	  amt -= charges;
	  amt -= policy.val("withdrawal_at_t", t);
	  return amt;
	}

	function tiv_low_at_t__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return tiv_at_t__02(ctx, policy, people, product, fund, t, _lodash2.default.extend(factors, { 'rate_type': 'fund_low_rate' }));
	}
	function tiv_mid_at_t__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return tiv_at_t__02(ctx, policy, people, product, fund, t, _lodash2.default.extend(factors, { 'rate_type': 'fund_mid_rate' }));
	}
	function tiv_high_at_t__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return tiv_at_t__02(ctx, policy, people, product, fund, t, _lodash2.default.extend(factors, { 'rate_type': 'fund_high_rate' }));
	}
	function tiv_at_t__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  // used for single premium @ bni
	  if (t === 0) {
	    return 0;
	  }

	  var rate_type = factors.rate_type;
	  var tiv_type = rate_type === 'fund_low_rate' ? 'tiv_low_at_t' : rate_type === 'fund_mid_rate' ? 'tiv_mid_at_t' : 'tiv_high_at_t';
	  var amt = 0;
	  var intrate = product.val(rate_type, t).rate,
	      accum_factor = product.val("accum_factor");
	  //  let charges = ( product.val("coi_at_t",t) + product.val("total_cor_at_t",t) + product.val("pol_fee_at_t",t) )
	  //      * Math.pow((1+intrate),(6.5/12)) ;
	  var charges = (product.val("coi_at_t", t) + product.val("total_cor_at_t", t) + product.val("pol_fee_at_t", t)) * (1 + intrate);
	  //  console.log("tiv__02, charges", charges, intrate);
	  amt += (policy.val("atu_at_t", t) + product.val("sp_at_t", t) + product.val(tiv_type, t - 1)) * (1 + intrate);
	  //  amt += ( product.val("sp_at_t",t) ) *  Math.pow(( 1+intrate ) , (accum_factor/12) ); // need to find out more about accum factor
	  amt -= charges;
	  var withdraw = policy.val("withdrawal_at_t", t) - policy.val("ilp_surrender_charge_at_t", t);
	  //  amt -= policy.val("withdrawal_at_t",t);
	  amt -= withdraw;
	  return amt;
	}

	function dbg_at_t__10(ctx, policy, people, product, fund, t, factors) {
	  var sa = product.val("basic_sa") || 0,
	      lien_rate = product.val("lien_rate", t).lien_rate || 1;

	  return utils.roundTo(sa * lien_rate);
	}

	function db_low_at_t__10(ctx, policy, people, product, fund, t, factors) {
	  return product.val("tiv_low_at_t", t, factors) + product.val("dbg_at_t", t, factors);
	}
	function db_mid_at_t__10(ctx, policy, people, product, fund, t, factors) {
	  return product.val("tiv_mid_at_t", t, factors) + product.val("dbg_at_t", t, factors);
	}
	function db_high_at_t__10(ctx, policy, people, product, fund, t, factors) {
	  return product.val("tiv_high_at_t", t, factors) + product.val("dbg_at_t", t, factors);
	}
	/*

	CODE for Riders specifically

	*/
	function monthly_cor__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 1 : arguments[5];
	  var factors = arguments[6];

	  return product.val("cor_at_t", 1) * product.db0("modal_factor", '*', { charge_type: '4' });
	}

	function cor_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var rate = product.db0("premium_rateaccident", t, factors),
	      //.pr_1,
	  sa = product.input("initial_sa"),
	      loadings = product.val("total_loadings", '*', factors);
	  return t <= product.val("cover_term") ? sa * rate / 1000 + loadings : 0;
	}
	function cor_at_t__02(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  //if (t === 6) { debugger}
	  if (product.val("age_at_t", t) > product.val("coverage_age")) {
	    return 0;
	  }
	  var rate = product.db0("premium_ratereimbursement", t, factors),
	      //.pr_1,
	  inflation = product.db0("inflation_rate", t, factors),
	      //.rate,
	  loadings = product.val("total_loadings", '*', factors);
	  return rate * inflation + loadings;
	}
	function cor_at_t__03(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  if (t > product.val("cover_term", t)) {
	    return 0;
	  }
	  var rate = product.db0("premium_ratecash_benefit", t, factors),
	      // .premium_rate,
	  sa = product.input("initial_sa", t, factors),
	      loadings = product.fmval("total_loadings", 1, factors);

	  return rate * sa + loadings;
	}
	function cor_at_t__04(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  // for product with input of cover_age, we use that
	  if (product.val("cover_age")) {
	    if (product.val("age_at_t", t) > product.val("cover_age")) {
	      return 0;
	    }
	  } else {
	    if (t > product.val("cover_term"), t) {
	      return 0;
	    }
	  }
	  // please notice, input is camel case, but db requires snake case
	  if (product.input("benefitLevel")) {
	    factors.benefit_level = product.input("benefitLevel");
	  }
	  var rate = product.db0("premium_ratecash_benefit", t, factors),
	      // .premium_rate,
	  loadings = product.fmval("total_loadings", 1, factors);
	  return rate + loadings;
	}
	function total_cor_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return _lodash2.default.sum(_lodash2.default.map(policy.val("products"), function (prd, idx) {
	    return idx === 0 ? 0 : prd.val("cor_at_t", t, {});
	  }));
	}
	function accum_cor_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return t === 0 ? 0 : policy.val("accum_cor_at_t", t - 1) + policy.val("total_cor_at_t", t);
	}
	function sp_premium__10(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.input("target_premium") * product.db0("modal_factor");
	}
	function sp_ap__10(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  return product.input("target_premium");
	}

	function ilp_surrender_charge_at_t__01(ctx, policy, people, product, fund) {
	  var t = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
	  var factors = arguments[6];

	  var rate = product.db0("ilp_surrender_charge_rate", t),
	      amount = product.val("withdraw_at_t", t);
	  return amount * rate;
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.product_data = product_data;
	exports.product_life = product_life;
	exports.sa_unit_rate = sa_unit_rate;
	exports.tdc_rate_a = tdc_rate_a;
	exports.tdc_rate_b = tdc_rate_b;
	exports.tdc_rate_c = tdc_rate_c;
	exports.lsad_rate = lsad_rate;
	exports.premium_rate = premium_rate;
	exports.age_limit = age_limit;
	exports.main_rider_age_limit = main_rider_age_limit;
	exports.main_rider_sa_limit = main_rider_sa_limit;
	exports.rider_rider_sa_limit = rider_rider_sa_limit;
	exports.sa_limit = sa_limit;
	exports.premium_limit = premium_limit;
	exports.cash_value = cash_value;
	exports.charges_modal_factor = charges_modal_factor;
	exports.policy_fee_modal_factor = policy_fee_modal_factor;
	exports.modal_factor = modal_factor;
	exports.unit_rate = unit_rate;
	exports.coverage_terms = coverage_terms;
	exports.premium_terms = premium_terms;
	exports.payment_freqs = payment_freqs;
	exports.pay_methods = pay_methods;
	exports.attachable_riders = attachable_riders;
	exports.sb_config = sb_config;
	exports.sb_pay = sb_pay;
	exports.sa_schedule = sa_schedule;
	exports.lien_rate = lien_rate;
	exports.get_main_plans = get_main_plans;
	exports.funds = funds;
	exports.currencies = currencies;
	exports.product_funds = product_funds;
	exports.product_currency = product_currency;
	exports.benefit_plans = benefit_plans;
	exports.get_riders = get_riders;
	exports.mutually_exclusive_riders = mutually_exclusive_riders;
	exports.dependent_riders = dependent_riders;
	exports.sa_limit_groups = sa_limit_groups;
	exports.coi_rate = coi_rate;
	exports.fund_low_rate = fund_low_rate;
	exports.fund_mid_rate = fund_mid_rate;
	exports.fund_high_rate = fund_high_rate;
	exports.ilp_pol_fee_rate = ilp_pol_fee_rate;
	exports.atu_expense_fee = atu_expense_fee;
	exports.tp_expense_fee = tp_expense_fee;
	exports.rtu_expense_fee = rtu_expense_fee;
	exports.sp_expense_fee = sp_expense_fee;
	exports.premium_rateaccident = premium_rateaccident;
	exports.premium_ratereimbursement = premium_ratereimbursement;
	exports.benefit_level = benefit_level;
	exports.inflation_rate = inflation_rate;
	exports.premium_ratecash_benefit = premium_ratecash_benefit;
	exports.min_max_sa_multiple = min_max_sa_multiple;
	exports.ilp_surrender_charge_rate = ilp_surrender_charge_rate;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function product_data(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '0' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    return {}; // default implementation returns nothing -- code for each product needs to implement this
	}
	function _getRow(ctx, pol, ppl, pdt, fund, t, opts, tname) {
	    var stopOnMissingRow = arguments.length <= 8 || arguments[8] === undefined ? true : arguments[8];

	    var pid = _lodash2.default.has(opts, 'product_id') ? opts.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    if (tname in data) {
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, opts, stopOnMissingRow);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row;
	        }
	    }
	    return {};
	}
	function product_life(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '0' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var tname = 'product_life';
	    var opts = { product_id: pdt.val("product_id") };
	    opts = _lodash2.default.extend(opts, factors);
	    return _getRow(ctx, pol, ppl, pdt, fund, t, opts, tname);
	}

	function sa_unit_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    if ('unit_amount' in data) {
	        var table = data.unit_amount;
	        var key = utils.toKey('unit_amount', table._meta, factors);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row; //row['unit_amount']
	        }
	    } else {
	            return {};
	        }
	}
	function _tdcRate(ctx, pol, ppl, pdt, fund) {
	    var tt = arguments.length <= 5 || arguments[5] === undefined ? '0' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    if (tt === 0) {
	        return 0;
	    }
	    var pid = _lodash2.default.has(opts, 'product_id') ? opts.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    if ('tdc_pos' in data) {
	        var _opts = _lodash2.default.clone(factors, true);
	        var table = data['tdc_pos'];
	        var key = utils.toKey('tdc_pos', table._meta, _opts);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row; //row['rate_value']
	        }
	    }
	    return {};
	}
	function tdc_rate_a(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    factors.tdc_table = "A";
	    return _tdcRate(ctx, pol, ppl, pdt, fund, t, factors);
	}
	function tdc_rate_b(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    factors.tdc_table = "B";
	    return _tdcRate(ctx, pol, ppl, pdt, fund, t, factors);
	}
	function tdc_rate_c(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    factors.tdc_table = "C";
	    return _tdcRate(ctx, pol, ppl, pdt, fund, t, factors);
	}
	function lsad_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'large_sa_discount_rate';
	    if (tname in data) {
	        var _opts2 = _lodash2.default.clone(factors);
	        if (!('sa_amount' in _opts2)) {
	            _opts2['sa_amount'] = pdt.val("initial_sa");
	        }
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts2);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row; //row['discount_rate']
	        }
	    }
	    return {};
	}
	function _preparePremRateFactors(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments[6];

	    var la = ppl[pdt.val("la")];
	    var ageMethod = pdt.val("age_method");
	    var dob = la.val("dob");
	    var gender = la.val("gender").toLowerCase();
	    var smoker = la.val("smoker");
	    var jobClass = la.val("job_class");
	    var coverageTerm = pdt.val("coverage_term", t);
	    var benefitLevel = pdt.val("benefit_level", t);
	    var initialSa = pdt.val("initial_sa");
	    var saUnitRate = pdt.val("sa_unit_rate");
	    var insuredStatus = la.val("insured_status");
	    var loanRate = pdt.val("loan_rate", t);
	    var premiumTerm = pdt.val("premium_term", t);
	    return {
	        age: utils.calcAge(ageMethod, dob),
	        gender: gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
	        smoking: smoker === null ? "W" : smoker ? "Y" : "N",
	        job_class: jobClass,
	        period: coverageTerm ? parseInt(coverageTerm) * 12 : null,
	        benefit_level: benefitLevel ? benefitLevel : null,
	        amount: initialSa ? initialSa : null,
	        units: saUnitRate,
	        insured_status: insuredStatus ? insuredStatus : null,
	        loan_rate: loanRate ? loanRate : "0.0",
	        premium_year: premiumTerm ? premiumTerm : null
	    };
	}
	function premium_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = "premium_rate";
	    if (tname in data) {
	        var _opts3 = _preparePremRateFactors(ctx, pol, ppl, pdt, fund, t = '*', factors);
	        // console.log("premium_rate, opts " , opts );
	        _opts3 = _lodash2.default.extend(_opts3, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts3);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row;
	        }
	    }
	    return {};
	}
	function age_limit(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'age_limit';
	    if (tname in data) {
	        var _opts4 = {};
	        // populate the factors other than product_id
	        _opts4.charge_period = pdt.val("charge_period");
	        _opts4.charge_year = pdt.val("charge_year");
	        _opts4.coverage_period = pdt.val("coverage_period");
	        _opts4.coverage_year = pdt.val("coverage_year");
	        _opts4.pay_period = pdt.val("pay_period");
	        _opts4.pay_year = pdt.val("pay_year");
	        _opts4.end_period = pdt.val("end_period");
	        _opts4.end_year = pdt.val("end_year");
	        _opts4.charge_type = pol.val("prem_freq");
	        _opts4.sa = pdt.val("initial_sa");
	        _opts4 = _lodash2.default.extend(_opts4, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts4);
	        if (key in table) {
	            return utils.toRow(table._meta._cols, table[key]);
	        }
	    }
	    return {};
	}
	function main_rider_age_limit(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    if (!factors.rider_id && !factors.attach_id) {
	        return {};
	    } // must provide the rider_id or attach_id
	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'main_rider_age_limit';
	    if (tname in data) {
	        var _opts5 = {};
	        // populate the factors other than product_id
	        _opts5.attach_id = factors.rider_id;
	        _opts5 = _lodash2.default.extend(_opts5, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts5);
	        if (key in table) {
	            return utils.toRow(table._meta._cols, table[key]);
	        }
	    }
	    return {};
	}
	function main_rider_sa_limit(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    if (!factors.rider_id && !factors.attach_id) {
	        return {};
	    } // must provide the rider_id or attach_id
	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'main_rider_sa_limit';
	    if (tname in data) {
	        var _opts6 = {};
	        var la = ppl[pdt.val("la")];
	        var gender = la.val("gender").toLowerCase();
	        // populate the factors other than product_id
	        _opts6.attach_id = factors.rider_id;
	        _opts6.age = pdt.val("entry_age");
	        _opts6.gender = gender === 'male' ? "M" : gender === 'female' ? "F" : "W";
	        _opts6.job = '*'; // we do not have this, just default to asterisk
	        _opts6 = _lodash2.default.extend(_opts6, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts6);
	        if (key in table) {
	            return utils.toRow(table._meta._cols, table[key]);
	        }
	    }
	    return {};
	}
	function rider_rider_sa_limit(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    if (!factors.rider_id && !factors.attach_id) {
	        return {};
	    } // must provide the rider_id or attach_id
	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'rider_rider_sa_limit';
	    if (tname in data) {
	        var _opts7 = {};
	        var la = ppl[pdt.val("la")];
	        var gender = la.val("gender").toLowerCase();
	        // populate the factors other than product_id
	        _opts7.attach_id = factors.rider_id;
	        _opts7.age = pdt.val("entry_age");
	        _opts7.gender = gender === 'male' ? "M" : gender === 'female' ? "F" : "W";
	        _opts7.job = '*'; // we do not have this, just default to asterisk
	        _opts7 = _lodash2.default.extend(_opts7, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts7);
	        if (key in table) {
	            return utils.toRow(table._meta._cols, table[key]);
	        }
	    }
	    return {};
	}

	function sa_limit(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'sa_limit';
	    if (tname in data) {
	        var _opts8 = {};
	        // populate the factors other than product_id
	        var la = ppl[pdt.val("la")];
	        _opts8.pay_mode = pdt.val("payment_method");
	        _opts8.insured_status = la.val("insured_status");
	        _opts8.age_month = pdt.val("entry_age") * 12; // age in months
	        _opts8.job_cate = la.val("job_class");
	        // check to see if there is a currency in the product, if yes, use it
	        if (pdt.val("money_id")) {
	            _opts8.money_id = pdt.val("money_id");
	        }
	        _opts8 = _lodash2.default.extend(_opts8, factors); // override if specific factors are provided
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts8);
	        if (key in table) {
	            return utils.toRow(table._meta._cols, table[key]);
	        }
	    }
	    return {};
	}
	function premium_limit(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'prem_limit';
	    if (tname in data) {
	        var _opts9 = {};
	        // populate the factors other than product_id
	        var la = ppl[pdt.val("la")];
	        _opts9.pay_mode = pdt.val("payment_method");
	        _opts9.charge_type = pol.val("prem_freq");
	        // check to see if there is a currency in the product, if yes, use it
	        if (pdt.val("money_id")) {
	            _opts9.money_id = pdt.val("money_id");
	        }

	        _opts9 = _lodash2.default.extend(_opts9, factors); // override if specific factors are provided
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts9);
	        if (key in table) {
	            return utils.toRow(table._meta._cols, table[key]);
	        }
	    }
	    return {};
	}
	function cash_value(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '0' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'cash_value';
	    if (tname in data) {
	        var _opts10 = {};
	        // populate the factors other than product_id
	        var la = ppl[pdt.val("la")];
	        var ageMethod = pdt.val("age_method");
	        var dob = la.val("dob");
	        _opts10.age = utils.calcAge(ageMethod, dob);
	        _opts10.age_month = _opts10.age * 12;
	        _opts10.benefit_level = pdt.val("benefit_level") || null;
	        _opts10.charge_type = pol.val("prem_freq");
	        _opts10.gender = la.val("gender") === 'male' ? "M" : la.val("gender") === 'female' ? "F" : "W";
	        _opts10.smoking = la.val("smoker") === null ? "W" : la.val("smoker") ? "Y" : "N", _opts10.pay_year = pdt.val("pay_year");
	        _opts10.insured_category = la.val("insured_category");
	        _opts10.insured_status = la.val("insured_status");
	        _opts10.job_cate = la.val("job_class");
	        _opts10.period = pdt.val("coverage") * 12;
	        _opts10.premium_year = pdt.val("premium_term");
	        _opts10.year = t;
	        _opts10 = _lodash2.default.extend(_opts10, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts10);
	        if (key in table) {
	            return utils.toRow(table._meta._cols, table[key]);
	        }
	    }
	    return {};
	}

	function charges_modal_factor(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    factors.model_type = 3;
	    return modal_factor(ctx, pol, ppl, pdt, fund, t, factors);
	}
	function policy_fee_modal_factor(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    factors.model_type = 2;
	    return modal_factor(ctx, pol, ppl, pdt, fund, t, factors);
	}
	function modal_factor(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'model_factor';
	    if (tname in data) {
	        var _opts11 = {};
	        _opts11.charge_type = pol.val("prem_freq");
	        _opts11.model_type = 1;
	        _opts11 = _lodash2.default.extend(_opts11, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts11);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row; // use the charge_rate
	        }
	    }
	    return {};
	}

	function unit_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'product_unit_rate';
	    if (tname in data) {
	        var _opts12 = _lodash2.default.clone(factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts12);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row; // use the charge_rate
	        }
	    }
	    return {};
	}
	function coverage_terms(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var terms = data["product_allowables"]["coverage_terms"][0]; // returns a list of lists e.g. [ ['3',100], ['2',50] ]
	    var termMaps = [];
	    _lodash2.default.forEach(terms, function (value) {
	        termMaps.push({ period: value[0], year: value[1] });
	    });
	    return termMaps;
	}
	function premium_terms(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var terms = data["product_allowables"]["premium_terms"][0]; // returns a list of lists e.g. [ ['2',5], ['2',10], ['2',15] ]
	    var termMaps = [];
	    _lodash2.default.forEach(terms, function (value) {
	        termMaps.push({ period: value[0], year: value[1] });
	    });
	    return termMaps;
	}
	function payment_freqs(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var rows = data["product_allowables"]["payment_freq"][0]; // returns a list of list. each list has only 1 attribute
	    var freqs = [];
	    _lodash2.default.forEach(rows, function (value) {
	        freqs.push(value[0]);
	    });
	    return freqs;
	}

	function pay_methods(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var terms = data["product_allowables"]["pay_methods"][0]; // returns a list of lists e.g. [ ['2',5], ['2',10], ['2',15] ]
	    var rows = [];
	    _lodash2.default.forEach(terms, function (value) {
	        rows.push({ charge_type: value[0], prem_sequen: value[1], pay_mode: value[2] });
	    });
	    return rows;
	}

	function attachable_riders(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var table = data["product_allowables"]["attachable_riders"];
	    var rows = table[0];
	    var names = table[2];
	    var record = undefined;
	    var riders = _lodash2.default.map(rows, function (fields) {
	        record = {};
	        _lodash2.default.forEach(fields, function (col, index) {
	            record[names[index]] = col;
	        });
	        return record;
	    });
	    return riders;
	}
	function sb_config(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '0' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'liability_config';
	    if (tname in data) {
	        var _opts13 = { liab_id: 301 };
	        _opts13 = _lodash2.default.extend(_opts13, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts13);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row; // use the sur_amount
	        }
	    }
	    return {};
	}

	function sb_pay(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '0' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'pay_liability';
	    if (tname in data) {
	        var _opts14 = { liab_id: 301, month: t * 12 };
	        _opts14 = _lodash2.default.extend(_opts14, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts14, false);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row; // use the pay_amount
	        }
	    }
	    return {};
	}
	function sa_schedule(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '0' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'sa_schedule';
	    if (tname in data) {
	        var _opts15 = { policy_year: t };
	        _opts15 = _lodash2.default.extend(_opts15, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts15, false);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row;
	        }
	    }
	    return {};
	}
	function lien_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '0' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    var tname = 'lien_rate';
	    if (tname in data) {
	        var _opts16 = { age: pdt.val("age_at_t", t) };
	        _opts16 = _lodash2.default.extend(_opts16, factors);
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, _opts16);
	        if (key in table) {
	            return utils.toRow(table._meta._cols, table[key]);
	        }
	    }
	    return {};
	}

	/* functions for common data */

	function get_main_plans(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var data = pdt.val("product_data");
	    var table = data["product_life"];
	    var cols = table._meta._cols;
	    var products = [];
	    _lodash2.default.forOwn(table, function (data, k) {
	        if (k !== '_meta') {
	            var row = utils.toRow(cols, data);
	            row['product_id'] = _lodash2.default.parseInt(k); // include back the product_id
	            if (row.ins_type === '1') {
	                products.push(row);
	            } // only main plans
	        }
	    });
	    return products;
	}
	function funds(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var data = pdt.val("product_data");
	    var table = data["fund"],
	        funds = [];

	    if (table) {
	        (function () {
	            var cols = table._meta._cols;
	            _lodash2.default.forOwn(table, function (data, k) {
	                if (k !== '_meta') {
	                    var row = utils.toRow(cols, data);
	                    row['fund_code'] = k;
	                    funds.push(row);
	                }
	            });
	        })();
	    }
	    return funds;
	}
	function currencies(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var data = pdt.val("product_data");
	    var table = data["money"],
	        rows = [];

	    if (table) {
	        (function () {
	            var cols = table._meta._cols;
	            _lodash2.default.forOwn(table, function (data, k) {
	                if (k !== '_meta') {
	                    var row = utils.toRow(cols, data);
	                    row['money_code'] = k;
	                    rows.push(row);
	                }
	            });
	        })();
	    }
	    return rows;
	}

	function product_funds(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var data = pdt.val("product_data");
	    var table = data["product_fund"];
	    var cols = table._meta._cols;
	    var funds = [];
	    _lodash2.default.forOwn(table, function (data, k) {
	        if (k !== '_meta') {
	            var row = utils.toRow(cols, data);
	            row['fund_code'] = k.split(':')[1]; //_.parseInt(k); // include back the product_id
	            funds.push(row);
	        }
	    });
	    return funds;
	}
	function product_currency(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var data = pdt.val("product_data");
	    var table = data["product_currency"];
	    if (!table) {
	        return [];
	    }

	    var cols = table._meta._cols;
	    var rows = [];
	    _lodash2.default.forOwn(table, function (data, k) {
	        if (k !== '_meta') {
	            var row = utils.toRow(cols, data);
	            row['money_id'] = parseInt(k.split(':')[2]); //_.parseInt(k); // include back the product_id
	            rows.push(row);
	        }
	    });
	    return rows;
	}

	function benefit_plans(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var data = pdt.val("product_data");
	    var table = data["benefit_level"];
	    if (table) {
	        var _ret3 = function () {
	            var cols = table._meta._cols;
	            var rows = [];
	            _lodash2.default.forOwn(table, function (data, k) {
	                if (k !== '_meta') {
	                    var row = utils.toRow(cols, data);
	                    row['level'] = k.split(':')[1];
	                    rows.push(row);
	                }
	            });
	            return {
	                v: rows
	            };
	        }();

	        if ((typeof _ret3 === "undefined" ? "undefined" : _typeof(_ret3)) === "object") return _ret3.v;
	    } else {
	        return [];
	    }
	}

	function get_riders(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var data = pdt.val("product_data");
	    var table = data["product_life"];
	    var cols = table._meta._cols;
	    var products = [];
	    _lodash2.default.forOwn(table, function (data, k) {
	        if (k !== '_meta') {
	            var row = utils.toRow(cols, data);
	            row['product_id'] = _lodash2.default.parseInt(k); // include back the product_id
	            if (row.ins_type === '2') {
	                products.push(row);
	            }
	        }
	    });
	    return products;
	}
	function mutually_exclusive_riders(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'rider_id') ? factors.rider_id : pdt.val("product_id");
	    var data = pdt.val("product_data");
	    var table = data["rider_groups"][pid];
	    if (table) {
	        return table.mex;
	    }
	    return [];
	}
	function dependent_riders(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'rider_id') ? factors.rider_id : pdt.val("product_id");
	    var data = pdt.val("product_data");
	    var table = data["rider_groups"][pid];
	    if (table) {
	        return table.deps;
	    }
	    return [];
	}
	function sa_limit_groups(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var pid = _lodash2.default.has(factors, 'rider_id') ? factors.rider_id : pdt.val("product_id");
	    var data = pdt.val("product_data");
	    var table = data["rider_groups"][pid];
	    if (table) {
	        return table.sa_limit;
	    }
	    return [];
	}

	/*
	  The following tables were introduced when we coded the ILP products [ Jan 2016 ]

	*/

	// try to save some lines of code

	function table_data(tname, ctx, pol, ppl, pdt, fund, t, factors) {
	    var pid = _lodash2.default.has(factors, 'product_id') ? factors.product_id : pdt.val("product_id");
	    var data = pdt.val("product_data", t, { pid: pid });
	    if (tname in data) {
	        var table = data[tname];
	        var key = utils.toKey(tname, table._meta, factors);
	        if (key in table) {
	            var row = utils.toRow(table._meta._cols, table[key]);
	            return row; // use row.rate
	        }
	    }
	    return {};
	}
	function coi_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var la = ppl[pdt.val("la")],
	        gender = la.val("gender").toLowerCase();
	    var opts = _lodash2.default.extend({
	        gender: gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
	        age: pdt.val("age_at_t", t)
	    }, factors);
	    return table_data('insurance_charge_rate', ctx, pol, ppl, pdt, fund, t, opts);
	}

	function fund_low_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    return fund_performance_rate(ctx, pol, ppl, pdt, fund, t, _lodash2.default.extend(factors, { 'type': 'LOW' }));
	}
	function fund_mid_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    return fund_performance_rate(ctx, pol, ppl, pdt, fund, t, _lodash2.default.extend(factors, { 'type': 'MID' }));
	}
	function fund_high_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    return fund_performance_rate(ctx, pol, ppl, pdt, fund, t, _lodash2.default.extend(factors, { 'type': 'HIGH' }));
	}
	function fund_performance_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var opts = _lodash2.default.extend({}, factors);
	    return table_data('investment_performance', ctx, pol, ppl, pdt, fund, t, opts);
	}
	function ilp_pol_fee_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var options = {
	        policy_year: t,
	        charge_type: pol.val("prem_freq"),
	        discount_type: 0
	    };
	    if (pdt.input("money_id")) {
	        options.money_id = pdt.input("money_id");
	    }
	    var opts = _lodash2.default.extend(options, factors);
	    return table_data('policy_fee_ilp_default', ctx, pol, ppl, pdt, fund, t, opts);
	}
	function atu_expense_fee(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    return expense_fee(ctx, pol, ppl, pdt, fund, t, _lodash2.default.extend({ prem_type: 4 }, factors));
	}
	function tp_expense_fee(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    return expense_fee(ctx, pol, ppl, pdt, fund, t, _lodash2.default.extend({ prem_type: 2 }, factors));
	}
	function rtu_expense_fee(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    return expense_fee(ctx, pol, ppl, pdt, fund, t, _lodash2.default.extend({ prem_type: 3 }, factors));
	}
	function sp_expense_fee(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    return expense_fee(ctx, pol, ppl, pdt, fund, t, _lodash2.default.extend({ prem_type: 1 }, factors));
	}
	function expense_fee(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var opts = _lodash2.default.extend({
	        policy_year: t
	    }, factors);
	    return table_data('expense_fee_default', ctx, pol, ppl, pdt, fund, t, opts);
	}
	function premium_rateaccident(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var la = ppl[pdt.val("la")],
	        gender = la.val("gender").toLowerCase();
	    var opts = _lodash2.default.extend({
	        period: t,
	        job_class: la.val('job_class'),
	        gender: gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
	        age: pdt.val("age_at_t", t)
	    }, factors);
	    return table_data('premium_rateaccident', ctx, pol, ppl, pdt, fund, t, opts);
	}
	function premium_ratereimbursement(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var la = ppl[pdt.val("la")],
	        gender = la.val("gender").toLowerCase();
	    var opts = _lodash2.default.extend({
	        job_class: la.val("job_class"),
	        gender: gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
	        age: pdt.val("age_at_t", t),
	        benefit_level: pdt.val("benefit_level", t, factors).level,
	        effective_date: (0, _moment2.default)(pol.val("proposal_start_date"), ['D-M-YYYY', 'YYYY-M-D', 'D-M-YYYY HH:mm:ss', 'YYYY-M-D HH:mm:ss']).format('YYYY-MM-DD')
	    }, factors);
	    return table_data('premium_ratereimbursement', ctx, pol, ppl, pdt, fund, t, opts);
	}
	function benefit_level(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var opts = _lodash2.default.extend({
	        sa: pdt.val("initial_sa")
	    }, factors);
	    return table_data('benefit_plan_level', ctx, pol, ppl, pdt, fund, t, opts);
	}

	function inflation_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var opts = _lodash2.default.extend({ year: t }, factors);
	    return table_data('inflation_rate', ctx, pol, ppl, pdt, fund, t, opts);
	}

	function premium_ratecash_benefit(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var la = ppl[pdt.val("la")],
	        gender = la.val("gender").toLowerCase(),
	        effdate = pol.val("proposal_start_date"),
	        opts = _lodash2.default.extend({
	        gender: gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
	        age: pdt.val("age_at_t", t),
	        effective_date: (0, _moment2.default)(effdate, ['D-M-YYYY', 'YYYY-M-D', 'D-M-YYYY HH:mm:ss', 'YYYY-M-D HH:mm:ss']).format('YYYY-MM-DD'),
	        benefit_level: pdt.val("benefit_level", t, factors) || null
	    }, factors);
	    return table_data('premium_ratecash_benefit', ctx, pol, ppl, pdt, fund, t, opts);
	}
	function min_max_sa_multiple(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var la = ppl[pdt.val("la")],
	        gender = la.val("gender").toLowerCase(),
	        effdate = pol.val("proposal_start_date"),
	        opts = _lodash2.default.extend({
	        gender: gender === 'male' ? "M" : gender === 'female' ? "F" : "W",
	        age: pdt.val("entry_age"),
	        payment_frequency: pol.val("prem_freq")
	    }, factors);
	    return table_data('allowed_multiple_times_of_target_premium_unit_link', ctx, pol, ppl, pdt, fund, t, opts);
	}
	function ilp_surrender_charge_rate(ctx, pol, ppl, pdt, fund) {
	    var t = arguments.length <= 5 || arguments[5] === undefined ? '*' : arguments[5];
	    var factors = arguments.length <= 6 || arguments[6] === undefined ? {} : arguments[6];

	    var opts = _lodash2.default.extend({
	        policy_year: t
	    }, factors);
	    return table_data('surrender_charge_rate', ctx, pol, ppl, pdt, fund, t, opts);
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.noop = noop;

	var _product = __webpack_require__(15);

	var _loop = function _loop(_key6) {
	  if (_key6 === "default") return "continue";
	  Object.defineProperty(exports, _key6, {
	    enumerable: true,
	    get: function get() {
	      return _product[_key6];
	    }
	  });
	};

	for (var _key6 in _product) {
	  var _ret = _loop(_key6);

	  if (_ret === "continue") continue;
	}

	var _funds = __webpack_require__(16);

	var _loop2 = function _loop2(_key7) {
	  if (_key7 === "default") return "continue";
	  Object.defineProperty(exports, _key7, {
	    enumerable: true,
	    get: function get() {
	      return _funds[_key7];
	    }
	  });
	};

	for (var _key7 in _funds) {
	  var _ret2 = _loop2(_key7);

	  if (_ret2 === "continue") continue;
	}

	var _topups = __webpack_require__(17);

	var _loop3 = function _loop3(_key8) {
	  if (_key8 === "default") return "continue";
	  Object.defineProperty(exports, _key8, {
	    enumerable: true,
	    get: function get() {
	      return _topups[_key8];
	    }
	  });
	};

	for (var _key8 in _topups) {
	  var _ret3 = _loop3(_key8);

	  if (_ret3 === "continue") continue;
	}

	var _withdrawals = __webpack_require__(18);

	var _loop4 = function _loop4(_key9) {
	  if (_key9 === "default") return "continue";
	  Object.defineProperty(exports, _key9, {
	    enumerable: true,
	    get: function get() {
	      return _withdrawals[_key9];
	    }
	  });
	};

	for (var _key9 in _withdrawals) {
	  var _ret4 = _loop4(_key9);

	  if (_ret4 === "continue") continue;
	}

	var _loadings = __webpack_require__(19);

	var _loop5 = function _loop5(_key10) {
	  if (_key10 === "default") return "continue";
	  Object.defineProperty(exports, _key10, {
	    enumerable: true,
	    get: function get() {
	      return _loadings[_key10];
	    }
	  });
	};

	for (var _key10 in _loadings) {
	  var _ret5 = _loop5(_key10);

	  if (_ret5 === "continue") continue;
	}

	function noop(ctx, parent, opts) {
	  return;
	}
	var FIXME = exports.FIXME = 'FIXME';

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.validate_main__01 = validate_main__01;
	exports.validate_main__02 = validate_main__02;
	exports.validate_main__03 = validate_main__03;
	exports.validate_all_riders__01 = validate_all_riders__01;
	exports.validate_rider__01 = validate_rider__01;
	exports.validate_rider__02 = validate_rider__02;
	exports.validate_rider__03 = validate_rider__03;
	exports.check_sa_limit__01 = check_sa_limit__01;
	exports.check_sa_limit__02 = check_sa_limit__02;
	exports.check_prem_limit__01 = check_prem_limit__01;
	exports.check_sa_multiple__01 = check_sa_multiple__01;
	exports.check_sa_multiple__02 = check_sa_multiple__02;
	exports.check_min_max_sa_units__01 = check_min_max_sa_units__01;
	exports.check_age_limit__01 = check_age_limit__01;
	exports.check_ilp_tp_limit__01 = check_ilp_tp_limit__01;
	exports.check_ilp_rtu_limit__01 = check_ilp_rtu_limit__01;
	exports.check_ilp_min_rtu__01 = check_ilp_min_rtu__01;
	exports.check_cover_age__01 = check_cover_age__01;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _moment = __webpack_require__(3);

	var _moment2 = _interopRequireDefault(_moment);

	var _utils = __webpack_require__(4);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function validate_main__01(ctx, parent, opts) {
	    // more for traditional products
	    var errs = [];
	    errs.push(parent.validate("check_sa_limit", opts));
	    errs.push(parent.validate("check_age_limit", opts));
	    errs.push(parent.validate("check_prem_limit", opts));
	    // errs.push( parent.validate("check_ilp_tp_limit",opts));
	    // errs.push( parent.validate("check_ilp_rtu_limit",opts));
	    return errs;
	}
	function validate_main__02(ctx, parent, opts) {
	    var errs = [];
	    errs.push(parent.validate("check_sa_limit", opts));
	    errs.push(parent.validate("check_sa_multiple", opts)); // extra check for ILP products
	    errs.push(parent.validate("check_age_limit", opts));
	    errs.push(parent.validate("check_ilp_tp_limit", opts));
	    errs.push(parent.validate("check_ilp_rtu_limit", opts));
	    errs.push(parent.validate("check_ilp_min_rtu", opts));
	    return errs;
	}
	function validate_main__03(ctx, parent, opts) {
	    // for single premium ilp
	    var errs = [];
	    errs.push(parent.validate("check_sa_limit", opts));
	    errs.push(parent.validate("check_age_limit", opts));
	    errs.push(parent.validate("check_prem_limit", opts));
	    return errs;
	}
	function validate_all_riders__01(ctx, parent, opts) {
	    // should be attached to the main plan to call validation on all the riders
	    var pol = ctx.get("policy"),
	        prds = pol.val("products"),
	        riders = prds.length > 1 ? prds.slice(1) : [],
	        errs = [];

	    _lodash2.default.forEach(riders, function (rider) {
	        errs.push(rider.validate("validate_rider", {}));
	    });
	    return errs;
	}
	function validate_rider__01(ctx, parent, opts) {
	    var errs = [];
	    errs.push(parent.validate("check_sa_limit", opts));
	    errs.push(parent.validate("check_age_limit", opts));
	    errs.push(parent.validate("check_sa_multiple", opts));
	    return errs;
	}
	function validate_rider__02(ctx, parent, opts) {
	    var errs = [];
	    errs.push(parent.validate("check_sa_limit", opts));
	    errs.push(parent.validate("check_age_limit", opts));
	    errs.push(parent.validate("check_min_max_sa_units", opts));
	    return errs;
	}
	function validate_rider__03(ctx, parent, opts) {
	    var errs = [];
	    errs.push(parent.validate("check_age_limit", opts));
	    return errs;
	}

	function check_sa_limit__01(ctx, parent, opts) {
	    var product = parent;
	    var limitRow = product.val("sa_limit"),
	        sa = product.val("initial_sa") || product.val("sa_calculated");
	    if (sa < limitRow.insd_min_amount) {
	        return "The sum assured is less than the minimum required for this product";
	    } else if (sa > limitRow.insd_max_amount) {
	        return "The sum assured is more than the maximum allowed for this product";
	    }
	    return; // mean return undefined
	}
	function check_sa_limit__02(ctx, parent, opts) {
	    /* min-sa ==> if rph --> MAX ( 125% of SP, 15,000,000)
	                  if usd --> MAX ( 125% of SP , 1500 )
	    */
	    var product = parent;
	    var limitRow = product.val("sa_limit"),
	        sa = product.val("initial_sa") || product.val("sa_calculated"),
	        sp = product.input("target_premium");
	    var min = _lodash2.default.max([limitRow.insd_min_amount, sp * 1.25]);
	    // console.log("check_sa_limit--> min", limitRow.insd_min_amount, sp*1.25)
	    if (sa < min) {
	        return "The sum assured is less than the minimum required for this product (" + min + ")";
	    } else if (sa > limitRow.insd_max_amount) {
	        return "The sum assured is more than the maximum allowed for this product (" + limitRow.insd_max_amount + ")";
	    }
	    return; // mean return undefined
	}

	function check_prem_limit__01(ctx, parent, opts) {
	    var product = parent;
	    var limitRow = product.val("premium_limit"),
	        prem = product.val("prem");
	    // console.log("check_prem_limit--> min", limitRow.min_initial_prem, prem)

	    if (prem < limitRow.min_initial_prem) {
	        return "The premium is less than the minimum required for this product";
	    } else if (prem > limitRow.max_initial_prem) {
	        return "The premium is more than the maximum allowed for this product";
	    }
	    return; // mean return undefined
	}

	function check_sa_multiple__01(ctx, product, opts) {
	    var entry_age = product.val("entry_age"),
	        tp = product.val("target_premium"),

	    // min = product.val("min_max_sa_multiple").multiple_times_low,
	    // max = product.val("min_max_sa_multiple").multiple_times_high,
	    // modal_factor = product.val("modal_factor").charge_rate,
	    min = product.db0("min_max_sa_multiple"),
	        max = product.db1("min_max_sa_multiple"),
	        modal_factor = product.db0("modal_factor"),
	        sa = product.fmval("sa_calculated"),
	        max_sa = undefined,
	        min_sa = undefined,
	        err = undefined;

	    if (entry_age >= 6 && entry_age <= 17) {
	        max_sa = Math.min(300000000, max * tp * modal_factor);
	    } else {
	        max_sa = max * tp * modal_factor;
	    }
	    min_sa = min * tp * modal_factor;
	    err = sa > max_sa ? "Sum Assured is larger than the allowed maxiumum" : sa < min_sa ? "Sum Assured is smaller than the allowed minimum" : undefined;
	    return err;
	}
	function check_sa_multiple__02(ctx, product, opts) {
	    var main = ctx.get("main"),
	        sa = product.val("sa_calculated"),
	        multiple = 5,
	        // hard code, since we do not have this as a parameter
	    main_sa = main.val("sa_calculated"),
	        max_sa = main_sa * multiple;

	    if (sa > max_sa) {
	        return "Sum assured is more than the allowed maximum : " + max_sa;
	    }
	    return;
	}
	function check_min_max_sa_units__01(ctx, product, opts) {
	    var age = product.val("entry_age"),
	        pol = ctx.get("policy"),
	        people = pol.val("people"),
	        la = people[product.val("la")],
	        dob = (0, _moment2.default)(la.val("dob"), ['D-M-YYYY', 'YYYY-M-D']),
	        startDate = (0, _moment2.default)(pol.val("proposal_start_date"), ['D-M-YYYY', 'YYYY-M-D']),
	        diff = _moment2.default.duration(startDate.diff(dob)).asMonths(),
	        sa_unit = product.val("initial_sa"),
	        max_units = 0;
	    // some hard coding here as we do not have param values
	    max_units = diff < 0 || age > 61 ? 0 : age < 5 ? 5 : age <= 61 ? 10 : 0;

	    return sa_unit > max_units ? "The number of units is more than the allowed maximum " : undefined;
	}

	function check_age_limit__01(ctx, parent, opts) {
	    var product = parent,
	        entryAge = product.val("entry_age"),
	        ageRow = product.val("age_limit");

	    var people = ctx.get("people"),
	        la = people[product.val("la")],
	        dob = la.val("dob");

	    //    console.log("check_age_limit__01--> unit & value", ageRow.min_insd_nb_age_unit, ageRow.min_insd_nb_age, entryAge );

	    if (ageRow.min_insd_nb_age_unit === '5') {
	        // means min is in days e.g. 30 days -- so really no minimum
	        var cutoff = utils.toDate(dob).add(ageRow.min_insd_nb_age, 'days'),
	            today = (0, _moment2.default)();
	        if (today.isBefore(cutoff)) {
	            return "The insured must be more than " + ageRow.min_insd_nb_age + " days old";
	        }
	    }

	    if (ageRow.min_insd_nb_age_unit === '1' && entryAge < ageRow.min_insd_nb_age) {
	        return "The insured age is less than the required minimum age for this product";
	    } else if (ageRow.max_insd_nb_age_unit === '1' && entryAge > ageRow.max_insd_nb_age) {
	        return "The insured is older than the allowed maximum age for this product";
	    }
	}
	function check_ilp_tp_limit__01(ctx, parent, opts) {
	    var product = parent,
	        limitRow = product.val("premium_limit"),
	        tp = product.val("target_premium");
	    // note that the premium limit already has the payment frequency as  a factor
	    if (tp < limitRow.min_initial_prem) {
	        return "The target premium is less than the minimum required for this product";
	    } else if (tp > limitRow.max_initial_prem) {
	        return "The target premium is more than the maximum allowed for this product";
	    }
	    return; // means return undefined
	}
	function check_ilp_rtu_limit__01(ctx, parent, opts) {
	    var product = parent,
	        limitRow = product.val("premium_limit"),
	        tp = product.val("rtu");

	    if (tp < 500000) {
	        return "The regular topup is less than the minimum required for this product";
	    }
	    return; // means return undefined
	}
	function check_ilp_min_rtu__01(ctx, parent, opts) {
	    var tp = parent.val("target_premium"),
	        modal_factor = parent.val("modal_factor").charge_rate,
	        rtu = parent.val("rtu"),
	        totprem = rtu + tp * modal_factor,
	        ratio = rtu / totprem * 100,
	        limits = [50, 100, 200, 350, 500, 99999999999],
	        // hard coded as we do not have table params yet
	    percentages = [0, 10, 20, 30, 40, 50],
	        amts = undefined,
	        min_ratio = undefined;
	    //debugger;
	    amts = _lodash2.default.filter(limits, function (limit) {
	        return totprem < limit * 1000000;
	    });
	    min_ratio = amts.length === 0 ? 50 : percentages[limits.indexOf(amts[0])]; // we take the 1st one that qualifies
	    if (ratio < min_ratio) {
	        return "RTU amount is less than the required min ratio to the annual premium";
	    }
	    return; // mean return undefined
	}
	function check_cover_age__01(ctx, parent, opts) {
	    var prd = parent,
	        entryAge = prd.val("entry_age"),
	        coverTerm = prd.val("cover_term"),
	        cutoff = entryAge + coverTerm,
	        coverAge = prd.input("cover_age") || 999;

	    if (coverAge > cutoff) {
	        return "For this product, the maximum cover is until age " + cutoff;
	    }
	    return;
	}

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.validate_funds_alloc__01 = validate_funds_alloc__01;
	exports.check_fund_allocation__01 = check_fund_allocation__01;
	exports.check_min_fund_allocation__01 = check_min_fund_allocation__01;
	function validate_funds_alloc__01(ctx, parent, opts) {
	    // validator should be attached to the main plan to check on all funds
	    var errs = [],
	        tot = 0,
	        funds = ctx.get("main").val("funds");

	    _.forEach(funds, function (fund, index) {
	        tot += fund.val("allocation") * 100;
	        errs.push(fund.validate("check_fund_allocation"));
	        errs.push(fund.validate("check_min_fund_allocation"));
	    });
	    if (tot !== 100) {
	        errs.push("Combined funds allocation must be 100%");
	    }
	    return errs;
	}
	function check_fund_allocation__01(ctx, parent, opts) {
	    // validator attached to a fund, check that allocation is in multiples of 5 % (hard coded as no params exists)
	    var percent = parent.val("allocation") * 100;
	    if (percent % 5 !== 0) {
	        return "Fund (" + parent.val("fund_code") + ") allocation must be multiples of 5%";
	    }
	}
	function check_min_fund_allocation__01(ctx, parent, opts) {
	    // validator attached to a fund, min allocation is 10% -- hard coded as we do not have it in ratetables
	    var percent = parent.val("allocation") * 100;
	    if (percent < 10) {
	        return "Fund (" + parent.val("fund_code") + ") allocation must at least be 10%";
	    }
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.round_50cents = round_50cents;
	exports.round_cents_half_up = round_cents_half_up;
	exports.round_cents_up = round_cents_up;
	exports.round_cents_down = round_cents_down;
	exports.round_dollar_half_up = round_dollar_half_up;
	exports.round_dollar_up = round_dollar_up;
	exports.round_dollar_down = round_dollar_down;
	exports.round_thousand_half_up = round_thousand_half_up;

	var _lodash = __webpack_require__(2);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function round_50cents(amt) {
	    return Math.ceil(amt * 2) / 2;
	}
	function round_cents_half_up(amt) {
	    return _lodash2.default.round(amt, 2);
	}
	function round_cents_up(amt) {
	    return _lodash2.default.ceil(amt, 2);
	}
	function round_cents_down(amt) {
	    return _lodash2.default.floor(amt, 2);
	}
	function round_dollar_half_up(amt) {
	    return _lodash2.default.round(amt, 0);
	}
	function round_dollar_up(amt) {
	    return _lodash2.default.ceil(amt, 0);
	}
	function round_dollar_down(amt) {
	    return _lodash2.default.floor(amt, 0);
	}
	function round_thousand_half_up(amt) {
	    return _lodash2.default.round(amt / 1000, 0);
	}
	function _roundTo(num, dp) {
	    var n = num + 0.000000000000001;
	    return parseFloat(n.toFixed(dp));
	}

/***/ }
/******/ ])
});
;