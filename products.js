var glob = window || global || root;
import lodash from "lodash";
import moment from "moment";
// var productList = [0];
// import _ from "lodash";
glob.lodash = lodash;
glob.moment = moment;

// glob.product_0 = require('product_0');
//glob.engine = require('engine');

// let prdName;
// productList.forEach( (prd) => {
//     prdName = './libs/product_' + prd;
//     glob[prdName] = require(prdName);
// });

glob.product_0 = require('./libs/product_0');
glob.product_4671 = require('./libs/product_4671');
glob.product_5712 = require('./libs/product_5712');
glob.product_5716 = require('./libs/product_5716');
glob.product_5013 = require('./libs/product_5013');
glob.product_5742 = require('./libs/product_5742');
glob.product_5722 = require('./libs/product_5722');
glob.product_6000 = require('./libs/product_6000');
glob.product_6201 = require('./libs/product_6201');
glob.product_6202 = require('./libs/product_6202');

glob.api = require('./libs/engine');
