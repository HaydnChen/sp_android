var React = require('react-native')
var {
  NativeModules: {
    RNHTMLtoPDF
  }
} = React


import _ from "lodash";
import moment from "moment";
import uistate from "../state";
import numeral from "numeral";
import * as templates from "../quote/templates"
var RNFS = require('react-native-fs');

var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;

function toDate(s) {
    let dd = moment(s,['D-M-YYYY','YYYY-M-D', 'YYYY-M-D HH:mm', 'YYYY-M-D HH:mm:ss',
                       'D-M-YY HH:mm:ss','D-M-YY HH:mm', 'YYYY-MM-DDTHH:mm:ss.SSSSZ'],true)
    return dd.isValid() ? dd : _.isDate(s) ? moment(s) : null;
}

export default function populateProposalSubmission(cb) {
    let proposal = uistate.get().proposal.s1.ui.proposal;
    if (!proposal) { return }
    // we need some information from userConfig
    let currentConfig = uistate.get().admin.ui.currentConfig;

    let gbl = window || global || root;
    let doc = {}
    let policy = {}
    policy.proposal = doc;
    policy.producerId = currentConfig.userConfig.agentCode ;
    policy.doctype = 'proposalSubmission';
    policy.documentType = 'proposalRequest';
    policy.submissionStatus = 0; // not submitted
    policy.errorMessages = [];
    policy.creationDate = new Date();

    doc.status = 11 ; // fixed has special meaning in NB
    doc.organId = currentConfig.userConfig.organId;
    doc.moneyId = proposal.quotation.policy.main.money_id || 30; //
    doc.applyDate = proposal.creationDate; // already in string format
    doc.validateDate = proposal.creationDate;
    doc.isPackage = "N";
    doc.submitChannel = "4";
    doc.esignStatus = 2;
    doc.planOrder = 1;
    doc.selectedIndi = "Y";
    doc.totalFreqPremium = 0; // need to work this out
    doc.assessIndi = 'N'
    doc.insureds = [];
    doc.policyHolders = [];
    doc.prospects = []

    let people = proposal.quotation.policy.people;
    _.forEach(people, (person,index) => {
        let p = {}
        p.prospectIndex = index;
        let rel = person.rel2Ph;
        p.relationToPh = rel === 'Self' ? 999 : rel === 'Spouse' ? 2 : rel === 'Son' ? 15 : rel === 'Daughter' ? 16 : rel === 'Mother' ? 14 : 6;
        p.smoking = person.smoker ? "Y" : "N";
        p.phIndi = person.is_ph ? "Y" : "N";
        p.birthDate = person.dob;
        p.gender = person.gender === "Male" ? "M" : "F";
        doc.insureds.push(p);

        if (person.is_ph) {
            let ph = {}
            ph.prospectIndex = index;
            doc.policyHolders.push(ph);
        }
        // prospects

        let pp = {}, pty = {};
        if (person.is_ph ) {
            pty = proposal.ph;
        } else {
            let dob1 = toDate(person.dob).format("YYYY-MM-DD"),
                dob2 = toDate(proposal.ph.dob).format("YYYY-MM-DD"),
                dob3 = toDate(proposal.la.dob).format("YYYY-MM-DD");
            pty = dob1 === dob2 ? proposal.ph : dob1 === dob3 ? proposal.la : {}; // cannot find mean no extra info
            if (!pty.base) {
                pty.base = { questions : {}}
            }
        }
        pty = _.merge({}, person, pty);
        // debugger;
        pp.producerId = currentConfig.userConfig.agentCode || "10634";

        pp.height = pty.base.questions.q1_height;
        pp.weight = pty.base.questions.q1_weight;
        pp.birthday = pty.dob;
        pp.certiType = pty.idType === 'Passport' ? 3 : 9; // only passport or others
        pp.certiCode = pty.idNo || '000'; // default something if undefined
        pp.gender = pty.gender === 'Male' ? "M" : "F";
        pp.age = pty.age || 0; // todo :: capture it during the quotation ?
        pp.lastName = pty.name;
        pp.firstName = ''
        let email = _.find(pty.contacts,(c) => { c.type === 'Email'})
        pp.email = email ? email.value : null;
        pp.jobCateId = 2;// hard code for now parseInt(pty.job_class); // not sure if the same , will do for the moment
        pp.addresses = [];
        _.forEach(pty.addresses, (add,index) => {
            let adr = {}
            adr.address1 = add.line1;
            adr.address2 = add.line2;
            adr.city = add.city;
            adr.postCode = add.postcode;
            adr.state = add.state;
            let cntry = add.country.toLowerCase();
            adr.countryCode = cntry === 'indonesia' ? "76" : cntry === 'singapore' ? "165" : cntry === 'malaysia' ? "107" : null;

            let adrType = add.type === 'Home' ? "1" : add.type === 'Work' ? "3" : add.type === "Business" ? "2" : "1";
            let address = { addressType : adrType, address : adr}
            pp.addresses.push(address);
        })
        let nty = pty.nationality;
        pp.nationality =  nty === 'Indonesian' ? "87" : nty === 'Malaysian' ?  "114" : nty === 'Singaporean' ? "SI" : "87";
        let ms = pty.maritalStatus;
        pp.marriageId = ms === 'Single' ? "2" : ms === 'Married' ? "1" : ms === "Widowed" ? "4" : "6";
        pp.smoking = pty.smoker ? "Y" : "N";
        pp.members = []
        pp.title = pty.salutation === 'Mr.' ? "2" : pty.salutation === 'Mrs' ? "1" : pty.salutation === 'Ms' ? "5" : "6";
        pp.contactStatus = "Prospect";
        pp.completeness = "N";
        pp.proofAge = "N";
        pp.contactUpdateIndi = "0"
        pp.quoteQuestionnaires = []

        doc.prospects.push(pp);
    });

    doc.proposalDocumentInfos = [] ; // for the moment  , we leave this as empty
    doc.extraMortalities = [];
    doc.quotationComments = [];
    doc.payments = [];
    doc.policyAccounts = [];
    doc.payerAccounts = [];

    doc.payFrequency = proposal.quotation.policy.main.payment_frequency; // use the one in quotationProducts
    doc.beneficiarys = []; // we can populate this
    // start looking at the products -- quoteProducts
    doc.quotationProducts = [];
    // var riders = [];

    let prods = [ proposal.quotation.policy.main , ...proposal.quotation.policy.riders ]
    _.forEach(prods, (product, index)  => {
        let prd = {};
        // if (index === 0 && prods.length > 1) {
        //     riders = gbl.api.availableRiders({ policy: { people:[], products: [ {product_id:prods[0].product_id} ] }})
        // }
        prd.sa = product.initial_sa || product.basic_sa || 20000;
        prd.unit = product.benefitLevel ? 1 : null,
        prd.productId = product.product_id;
        prd.liabilities = [];
        prd.chargePeriod = product.chargePeriod;
        prd.chargeYear = product.chargeYear;
        prd.coveragePeriod = product.coveragePeriod;
        prd.coverageYear = product.coverageYear;
        prd.coverageTerm = product.coverage_term;
        prd.premiumTerm = product.premium_term;
        prd.benefitLevel = product.benefitLevel;
        prd.interestRate = 0;

        let method = proposal.paymentinfo.payment_method;
        prd.payMode = method === 'Cash' ? 1 : method === "Credit Card" ? 30 : method === 'Bank Transfer' ? 34 : 3;
        prd.payMode = 1 ; // override to use "1" for the poc
        prd.countWay = "3";
        prd.benefitInsureds = [];
        let person = people[parseInt(product.la)];
        let ins = {};
        ins.jobClass = person.job_class;
        ins.entryAge = person.age;
        ins.orderId = 1;
        ins.issuredIndex = parseInt(product.la);
        prd.benefitInsureds.push( ins);
        prd.payFrequency = product.payment_frequency;

        if (!product.payment_frequency) {
            let rows = gbl.api.getChargeTypes(product.product_id);
            if (rows.length > 0 ) {
                prd.payFrequency = rows[0].chargeType;
                if (index > 0 ) {
                    prd.payMode = rows[0].payMode;
                }
            }
        }

        prd.expenseRate = null;
        prd.applyDate = proposal.creationDate;
        prd.validateDate = proposal.creationDate;
        prd.payPlans = [];
        prd.waivedSa = 0;
        prd.basicPremRate = null;
        prd.waiver = "N";
        prd.distributionMethod = null;
        prd.immInvestment = null;
        prd.payNext = prd.payMode;
        prd.hpsExemption = null;
        prd.basePlan = product.product_name;
        prd.masterProductIndex = index === 0 ? null : 0;

        if (index === 0 ) {
            prd.ilpInvestRates = [];
            _.forEach(proposal.quotation.policy.funds, (fund,idx) => {
                if (fund.percentage > 0) {
                    let alloc = {}
                    alloc.premType = product.payment_frequency === "5" ? "1" : "2";
                    alloc.fundCode = fund.fund_code;
                    alloc.assignRate = fund.percentage / 100;
                    prd.ilpInvestRates.push(alloc);
                }
            })

            prd.ilpAddInvests = [];
            _.forEach(proposal.quotation.policy.inout, (mvt,idx) => {
                    let m = {}
                    m.addPremType = "1"; // adhoc
                    m.addYear = mvt.year;
                    m.addPeriod = 1;
                    m.addPrem = mvt.in ? mvt.in : -1 * mvt.out;
                    prd.ilpAddInvests.push(m);
            })

        }
        // now deal with the premium amounts
        prd.stdPremBf = product.ap;
        prd.stdPremAf = product.prem;
        prd.discountPrem = product.prem;
        prd.policyFeeBf = product.policyFeeBefore;
        prd.policyFeeAf = product.policyFeeAfter;
        prd.policyFeeAn = product.policyFeeBefore;
        prd.grossPremAf = product.policyFeeAfter + prd.discountPrem;
        // prd.extraPremBf = 0;
        // prd.extraPremAf = 0;
        prd.totalPremAf = prd.grossPremAf; //prd.extraPremAf;
        prd.annualPrem = product.ap;

        doc.quotationProducts.push(prd);

    });
    doc.payerAccounts = [];
    let acc = {};
    let method = proposal.paymentinfo.payment_method;
    acc.payMode = method === 'Cash' ? 1 : method === "Credit Card" ? 30 : method === 'Bank Transfer' ? 34 : 3;
    acc.payMode = 1 ; // hard code for the moment
    acc.payNext = acc.payMode;
    acc.payerProspectIndex = 0; // hard code for the moment
    doc.payerAccounts.push(acc);


    // try and generate a pdf and save as part of the document, convert to base64
    // debugger;
    let promise = generatePdf(proposal);
    // console.log("proposalSubmission record", policy);
    // throw Error("testing error")
    promise.then((buf) => {
        policy.pdf = buf;
        cb(policy);
    })
    .catch((err) => {
        policy.pdf = null;
        cb(policy)
    })

    // console.log("populateProposalSubmission--> policy", policy);
    return
}

function generatePdf(proposal){

    let tableResult = prepareTableData(proposal);
    let htmlstring = tmpl( proposal, tableResult);
    // debugger;

    let pdfOptions = {
        html : htmlstring,
        fileName : 'test',
        directory : 'docs'

    };
    let promise = new Promise((resolve,reject) => {
        try {
            if (RNHTMLtoPDF && RNHTMLtoPDF.convert ) {
                console.log("ProposalSubmission --> RNHTML*****", RNHTMLtoPDF, RNHTMLtoPDF.convert );
                RNHTMLtoPDF.convert(pdfOptions).then((filePath) => {
                    console.log("**** file generated at path", filePath)
                    // debugger;
                    if (filePath) {
                        RNFS.readFile(filePath,'base64').then((buf) => {
                            // console.log("**** base64 buffer", buf)
                            resolve(buf)
                        });
                    } else {
                        resolve('')
                    }
                });
            } else { resolve('')}
        } catch (err) {
            console.log("SummaryView, generating the pdf, some error ", err);
            resolve("SummaryView, generating the pdf, some error " +  err)
        }

    });
    return promise;



}
function tmpl(proposal,result) {

    let mainCode = proposal.quotation.policy.main.internal_id.toLowerCase(),
        templateFunc = templates[mainCode];
        return templateFunc(result, uistate, prepareContext(proposal,result))
}

function prepareContext(proposal, result) {
    let ctx = {},
        quote = proposal.quotation;

    ctx.headers = result.headers;
    ctx.widths = result.colwidths;
    ctx.cols = result.columns;
    ctx.data =result.data;
    ctx.quote = result.quote;
    ctx.main = quote.policy.main;
    ctx.plan = ctx.main;
    ctx.people = quote.policy.people;
    ctx.riders = quote.policy.riders;
    ctx.funds = quote.policy.funds;
    ctx.inouts = quote.policy.inout;
    ctx.sigOwner = quote.signatureOwner;
    ctx.sigAgent = quote.signatureAgent;
    ctx.uriOwner = ctx.sigOwner ? 'data:image/png;base64,' + ctx.sigOwner : '' ;
    ctx.uriAgent = ctx.sigAgent ? 'data:image/png;base64,' + ctx.sigAgent : '' ;
    ctx.proposal_date = moment(ctx.plan.proposal_date).format("D-M-YYYY");
    ctx.proposal_start_date = moment(ctx.plan.contract_date).format("D-M-YYYY");
    ctx.prem_freq = ctx.plan.payment_frequency;

    ctx.topups = _.filter(ctx.inouts, (row) => row.in > 0).map((row) => { return {year: row.year, amount: row.in } });
    ctx.withdrawals = _.filter(ctx.inouts, (row) => row.out > 0).map((row) => { return {year: row.year, amount: row.out } });
    ctx.policyHolder = _.find(ctx.people, (person) => person.is_ph);
    ctx.mainInsured = ctx.people[ parseInt(ctx.plan.la) ];
    return ctx

}



function prepareInput(proposal) {
    let quote = proposal.quotation,
        main = _.assign({}, quote.policy.main),
        policy = quote.policy.toJS(),
        people = policy.people,
        plan = _.assign({}, quote.policy.main),
        riders = policy.riders,
        funds  = policy.funds,
        inout  = policy.inout,
        gbl = window || global || root,
        config  = gbl.api.getSIConfig( parseInt(main.product_id)),
        topups, withdrawals,result, svFields;

    topups = _.filter(inout, (row) => row.in > 0).map((row) => { return {year: row.year, amount: row.in } });
    withdrawals = _.filter(inout, (row) => row.out > 0).map((row) => { return {year: row.year, amount: row.out } });

    plan.basic_sa = plan.initial_sa;
    ['proposal_date','contract_date'].forEach((f)=> policy[f] = moment(plan[f])); // convert back to moment object, workaround
    ['la','premium_term'].forEach((f)=> plan[f] = parseInt(plan[f])); // convert back to integer, workaround

    let peoplelist = _.map(people, (person) => {
        let row = {}
        _.forOwn(person,(v,k,obj) => {
            row[k] = k === 'dob' ? moment(v).format('YYYY-M-D') : v ;
        });
        return row;
    }) ;

    // we only want these few fields, other fields can cause the calculation to assume it is already calculated and thus not recalc
    let doc;
    let riderlist = _.map(riders, (rider) => {
         doc = {  product_id: rider.product_id, internal_id: rider.product_code, initial_sa : rider.initial_sa,
                  la : parseInt(rider.la) }
         if (rider.cover_term && _.isNumber(rider.cover_term)) doc.cover_term = rider.cover_term;
         if (rider.benfitLevel) doc.benefitLevel = rider.benefitLevel;
         return doc;
    });

    // we need the seq of the plan to be ordered to guarantee equality
    let sortedKeys = _.sortBy( _.keys(plan)),
        newPlan = {};
    _.forEach(sortedKeys, (k) => newPlan[k] = plan[k]);

    let  inputjson = {
            policy :
              {
                people : peoplelist,
                products : [newPlan, ...riderlist] ,
                funds : funds,
                topups : topups,
                withdrawals : withdrawals,
                prem_freq : plan.payment_frequency ,
                proposal_start_date : moment(plan.contract_date).format("D-M-YYYY"),
                proposal_date : moment(plan.proposal_date).format("D-M-YYYY")
              }
     };

     return { config : config, inputjson : inputjson }

}
function prepareTableData(proposal){

     let input = prepareInput(proposal);
     let si_colnames = input.config.si_colnames,
         si_fieldnames = input.config.si_fields,
         si_colwidths = input.config.si_colwidths,
         gbl = window || global || root;

     let quote = proposal.quotation;
     let main = quote.policy.main;

     if (!si_colwidths) {
         let wid = (dw-60) / si_colnames.length / (dw-60);
         si_colwidths = _.map(si_colnames, (c) => wid) ;
     }

    //  let main = this.uistate.get().quote.current_main,
    //  let  svFields = main.benefit_type === '41' ? ["entry_age","ph_entry_age"]
    //                                            : ["entry_age","ph_entry_age","coverage", "pol.totprem"] ;

    let  svFields = ["entry_age","ph_entry_age","coverage", "pol.totprem"] ;
    let result = gbl.api.calc(input.inputjson, svFields , si_fieldnames );

     let si_data = [],row, field_value,
         mainrow = result.policy.products[0],
         pol = result.policy;

   _.forEach( _.range(1,mainrow.max_t+1), (t) => {
       row = [];
       _.forEach( si_fieldnames, (fname) => {
           if (fname === 't') {
               row.push(t);
           } else {
               fname = fname.split('.').length === 2 ? fname.split('.')[1] : fname ;
               field_value = _.isUndefined(mainrow[fname]) ? pol[fname] : mainrow[fname] ;
               if ( ! _.isUndefined( field_value )) {
                   row.push( formatNumber( field_value[t]) );
               }
           }
       });
       si_data.push(row);
   });
   return { quote : result, columns: si_fieldnames, data : si_data, headers : si_colnames, colwidths : si_colwidths };

}
