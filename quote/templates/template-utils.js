import _ from "lodash"
var pako = require('pako')

export function prepareData(result,uistate) {
    let ctx = {},
        qstate = uistate.get().quote;

    ctx.headers = result.headers;
    ctx.widths = result.colwidths;
    ctx.cols = result.columns;
    ctx.data =result.data;
    ctx.quote = result.quote;
    ctx.main = qstate.current_main;
    ctx.data0 = qstate.policy.main.data0;
    ctx.data1 = qstate.policy.main.data1;
    ctx.plan = Object.assign({product_id: ctx.main.product_id, internal_id: ctx.main.internal_id},ctx.data0, ctx.data1);
    ctx.people = qstate.policy.people.data;
    ctx.riders = qstate.policy.riders.data.toJS();
    ctx.funds = qstate.policy.funds.data.toJS();
    ctx.inouts = qstate.policy.inout.data.toJS();
    ctx.sigOwner = qstate.signatureOwner;
    ctx.sigAgent = qstate.signatureAgent;
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
