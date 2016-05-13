import {prepareData} from "./template-utils"
// import {getCss} from "./css"
var utils = require('../../html-utils');
import moment from "moment"

export function zlife01(result,uistate) {

    let html = utils.html;
    let ctx = prepareData(result,uistate);
    let capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    let main = result.quote.policy.products[0];

    return (
        html`<html><head>
        <style>
        tr { page-break-inside : avoid; }
        .toptable td { font-size: 0.8em;border-bottom:1px solid;}
        </style>
        </head><body>
            <h4>
            Illustrasi Manfaat
            <br>${ctx.main.product_name + " (" + ctx.main.internal_id +")"}</br>
            </h4>
            <h5>Ringkasan Proposal </h5>

            <table class="toptable" style="border:1px solid;width=100%;border-collapse:separate;border-spacing:0;">
                <col width="200">
                <col width="400">
                <col width="120">
                <col width="400">
                <tr>
                    <td>Tertangung</td>
                    <td>${ctx.mainInsured.name}</td>
                    <td>Pemegang Polis</td>
                    <td>${ctx.policyHolder.name}</td>
                </tr>
                <tr>
                    <td>Tanggal Lahir</td>
                    <td>${ moment(ctx.mainInsured.dob).format('D-M-YYYY')}</td>
                    <td>Tanggal Lahir</td>
                    <td>${moment(ctx.policyHolder.dob).format('D-M-YYYY')}</td>
                </tr>
                <tr>
                    <td>Jenis Kelamin</td>
                    <td>${ utils.capitalize(ctx.mainInsured.gender)}</td>
                    <td>Jenis Kelamin</td>
                    <td>${ utils.capitalize(ctx.policyHolder.gender)}</td>
                </tr>
                <tr>
                    <td>Usia Masuk</td>
                    <td>${ main.entry_age }</td>
                    <td>Usia Masuk</td>
                    <td>${ main.ph_entry_age }</td>
                </tr>
            </table>
            <div style="height:20px"></div>
            <table class="toptable" style="border:1px solid;width=100%;border-collapse:separate;border-spacing:0;">
                <col width="200">
                <col width="300">
                <tr>
                    <td>Masa Asuransi</td>
                    <td>${ main.premium_term + " tahun"}</td>
                </tr>
                <tr>
                    <td>Premi</td>
                    <td>${ "Rp. " + utils.formatNumber(main.premium) }</td>
                </tr>
                <tr>
                    <td>Uang Pertanggungan</td>
                    <td>${ "Rp. " + utils.formatNumber(main.initial_sa) }</td>
                </tr>


            </table>
            <br />

            <table style="border:1px solid; width=100%;border-collapse:separate;border-spacing:0;">
              <tr> ${ctx.headers.map( (header,index) => html`<th>$${header}</th>` )} </tr>
              ${ctx.data.map( (row,rowindx) => html`
                 <tr> ${row.map( col =>
                     row[0] % 2 === 0 ? html`<td style="page-break-inside:avoid;text-align: right ; font-size: 0.8em; border: 1px solid;padding:2px;"> ${col} </td>`
                                      : html`<td style="page-break-inside:avoid;text-align: right ; font-size: 0.8em; border: 1px solid;padding:2px; background-color:lightgrey;"> ${col} </td>`
                      )} </tr>`
               )}
             </table>
             <br />
             <div style="height:100px" />
             <div style="display:flex; flex-direction:row; justify-content: flex-start;">
                ${ctx.sigOwner ? `<img style="width:150px;height:120px;" src=${ctx.uriOwner} />`: ''}
                ${ctx.sigAgent ? `<img style="padding-left:50px; width:150px;height:120px;" src=${ctx.uriAgent} />` : ''}
             </div>
             <div style="display:flex; flex-direction:row; justify-content: flex-start;">
                <span style="width:150px;text-align:center">${ ctx.policyHolder ? ctx.policyHolder.name : 'Policy Owner'} </span>
                <span style="width:150px;padding-left:50px;text-align:center">Agent</span>
             </div>


             </body></html>`

    )
}
