'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Easing,
  ListView,
  ScrollView,
  TouchableHighlight,
  AlertIOS,
  NativeModules: {
    RNHTMLtoPDF
  }
} = React

import _ from "lodash";
import moment from "moment"
import Button from 'apsl-react-native-button';
import {LocalNumber} from "../../form/localComponents";
import ModalView from "./modalView";
import PdfView from "./pdfView"
// import SignatureView from "./signatureView"
import Signature from "../../common/signature";
import * as templates from "../templates"
// import {getColl, getDb} from "../../db"
import cblite from "../../cblite";

var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');
var utils = require('../../html-utils');
var crypto = require('crypto-js');
var localstyles = require("../../localStyles"),
    t = require('tcomb-form-native'),
    numeral = require('numeral'),
    pako = require('pako'),
    formstyles = _.clone(localstyles,true);

formstyles.formGroup.normal.paddingBottom = 0;


// formstyles.formGroup.error.flexDirection = 'column';
// formstyles.fieldset.flexDirection = "row";
t.form.Form.i18n = {
optional: '',
required: '' // no extra pointers since we are only displaying
};

var PlanForm = t.form.Form;

var planModel = t.struct({
    product_code : t.String,
    product_name : t.String,
    life_assured : t.String,
    sum_assured  : t.Number,
    premium      : t.Number,
    premium_term : t.String,
    coverage_term : t.Number,
});
var planOptions = {
    fields : {
        product_code : { editable : false },
        product_name : { editable : false },
        life_assured : { editable : false },
        sum_assured : { editable : false },
        premium : { editable : false },
        premium_term : { editable : false },
        coverage_term : { editable : false },
    }
}

var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;

var options = {
    auto : 'placeholders',
    fields : {
    }
}

var TAG = "SummaryView.";
var DOCTYPE = "quotations";
export default class SummaryView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../../state"); // global state
      this.state = this.getInitState(); // local state ... in a way

      this.dsRiders = new ListView.DataSource({
          rowHasChanged: (r1, r2) => true
      });

      this.dsFunds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
      });

      this.siData = [];
      this.modalView = null;
      this.tableResult = null;
    }

    getInitState(){
        return {hash: 1 };
    }

    showIllustration() {
        //console.log("show the illustration");
    }
    renderRider(data, sec, rowid) {
        return (
            <View style={{flexDirection:"row", flex: 1, padding: 5}}>
                <View style={{flex: 0.65}} >
                    <Text>{data.rider_name}</Text>
                </View>
                <View style={{flex: 0.35}} >
                    <Text>{data.initial_sa > 0 ? formatNumber(data.initial_sa) : data.planLevel}</Text>
                </View>
            </View>
        );
    }
    renderRiderHeader(){
        return (
            <View style={{flex:1}} >
                <View style={[styles.section, {flex:1, flexDirection:"row", justifyContent:"flex-start", padding : 5}]} >

                    <View style={{flex:0.62} } >
                        <Text style={styles.sectionText}>Rider Name</Text>
                    </View>
                    <View style={{flex:0.38} } >
                        <Text style={styles.sectionText}>SA / Plan</Text>
                    </View>
                </View>
            </View>
        );

    }
    renderFundHeader(){
        return (
            <View style={{flex:1}} >
                <View style={[styles.section, {flex:1, flexDirection:"row", justifyContent:"flex-start", padding : 5}]} >

                    <View style={{flex:0.8} } >
                        <Text style={styles.sectionText}>Fund</Text>
                    </View>
                    <View style={{flex:0.25} } >
                        <Text style={styles.sectionText}>%</Text>
                    </View>
                </View>
            </View>
        );
    }
    renderFund(data, sec, rowid) {
        return (
            <View style={{flexDirection:"row", flex: 1, padding: 5}}>
                <View style={{flex: 0.8}} >
                    <Text>{data.fund_name}</Text>
                </View>
                <View style={{flex: 0.2}} >
                    <Text>{formatNumber(data.percentage)}</Text>
                </View>
            </View>
        );
    }
    checkInputComplete() {
        // check that we have all the data, particularly the fund information
        let main = this.uistate.get().quote.current_main;
        let funds  = this.uistate.get().quote.policy.funds.data;
        let percent = _.sum( _.map(funds, (fund) => fund.percentage));
        // console.log("checkInputComplete", percent);
        if (main.benefit_type === '41' && percent !== 100) {
            this.alert("Please enter the fund allocation percentages");
            this.props.fns.gotoTab(4);
            return false
        }
        return true

    }

    illustration(){
        if (this.checkInputComplete () ) {
            this.tableResult = this.prepareTableData();
            this.uistate.get().quote.set({show_modal:true}).now();
        }
    }

    generatePdf(){

        if ( !this.checkInputComplete () ) { return }

        this.tableResult = this.prepareTableData();
        this.htmlstring = this.tmpl( this.tableResult);
        // debugger;

        let pdfOptions = {
            html : this.htmlstring,
            fileName : 'test',
            directory : 'docs'

        };
        try {
            if (RNHTMLtoPDF && RNHTMLtoPDF.convert && ! this.uistate.get().quote.show_pdf) {
                console.log("RNHTML*****", RNHTMLtoPDF, RNHTMLtoPDF.convert );
                RNHTMLtoPDF.convert(pdfOptions).then((filePath) => {
                    //console.log("**** file generated at path", filePath)
                    if (filePath) {
                        this.uistate.get().quote.set({show_pdf:true, pdf_path: filePath}).now();
                    }
                });
            }
        } catch (err) {
            console.log("SummaryView, generating the pdf, some error ", err);
        }

    }
    tmpl(result) {

        let mainCode = this.uistate.get().quote.current_main.internal_id.toLowerCase(),
            templateFunc = templates[mainCode];
            return templateFunc(result, this.uistate)

    }
    // componentWillReceiveProps(props)
    //     console.log("SummaryView.componentWillReceiveProps", this.state.hash)
    //     // this has is really to force screen to redraw with new signature, still have not figured this out
    //     if (this.uistate.get().quote.tempSignature) {
    //         if (_.isNull(this.uistate.get().quote.signatureOwner)) {
    //             this.uistate.get().quote.set({refresh:false, signatureOwner: this.uistate.get().quote.tempSignature}).now()
    //         } else {
    //             this.uistate.get().quote.set({refresh:false, signatureAgent: this.uistate.get().quote.tempSignature}).now()
    //         }
    //         this.uistate.get().quote.set({tempSignature:null});
    //     }
    // //     // if (!this.uistate.get().quote.show_signature) {
    // //     //     this.setState({hash: this.state.hash+1});
    // //     // }
    // }

    // shouldComponentUpdate(props,state) {
    //     // return true;
    //     if (this.uistate.get().quote.refresh) {
    //         return true;
    //     } else {
    //         super.shouldComponentUpdate(props,state);
    //     }
    //
    // }

    render() {
        PlanForm.stylesheet = formstyles;
        // console.log("SummaryView.render, row ");
        // debugger;

        let polstate = this.uistate.get().quote.policy,
        // we have 3 blocks, block 1 -- plan info
            main = this.uistate.get().quote.current_main,
            people = this.uistate.get().quote.policy.people.data,
            plan0 = this.uistate.get().quote.policy.main.data0,
            plan1 = this.uistate.get().quote.policy.main.data1,
            riders = this.uistate.get().quote.policy.riders.data,
            funds  = this.uistate.get().quote.policy.funds.data,
            show = this.uistate.get().quote.show_modal,
            showpdf = this.uistate.get().quote.show_pdf,
            showSignature = this.uistate.get().quote.show_signature,
            planValues, ridersdata, fundsdata;

        // populate the planData
        if ( people.length > 0 && main.internal_id ) {

            let lifenum = parseInt(plan0.la),
                person = people[lifenum];

            planValues = {
                product_code : main.internal_id,
                product_name : main.product_name,
                life_assured : person.name,
                sum_assured  : formatNumber(plan0.initial_sa),
                premium      : formatNumber(plan1.premium),
                premium_term : plan1.premium_term === 0 ? 'Single' : formatNumber(plan1.premium_term),
                coverage_term : formatNumber(plan1.coverage_term)
            }
            let gbl = window || global || root,
                levels, isLevelProduct = false, levelDesc = null;
            ridersdata = _.map(this.uistate.get().quote.policy.riders.data.toJS(), (r) => {
                // get benefit plans descriptions if valid
                if (r.benefitLevel) {
                    levels = gbl.api.getBenefitLevelPlans(r.rider_id);
                    let level = _.find(levels, (row) => String(row.level) === String(r.benefitLevel) )
                    levelDesc = level ? level.level_desc : ''
                }
                let res = {rider_name: r.rider_name, initial_sa: r.initial_sa, benefitLevel : r.benefitLevel, planLevel : levelDesc };
                return res
            });
            fundsdata = _.filter(this.uistate.get().quote.policy.funds.data.toJS(), (r) => r.percentage > 0 );

        } else {
            planValues = {
                product_code : '',
                product_name : '',
                life_assured : '',
                sum_assured  : 0,
                premium      : 0,
                premium_term : 0,
                coverage_term : 0,
            };
            ridersdata = [];
            fundsdata = [];


        }
        this.dsRiders = this.dsRiders.cloneWithRows(ridersdata);
        this.dsFunds = this.dsFunds.cloneWithRows(fundsdata);

        let sigOwner =  this.uistate.get().quote.signatureOwner,
            sigAgent = this.uistate.get().quote.signatureAgent,
            hashOwner = this.uistate.get().quote.hash_owner,
            hashAgent = this.uistate.get().quote.hash_agent,
            contact_id = this.uistate.get().quote.contact_id,
            contact = this.uistate.get().quote.contact,
            uriOwner = sigOwner ? 'data:image/png;base64,' + sigOwner : null,
            uriAgent = sigAgent ? 'data:image/png;base64,' + sigAgent : null;

        // if (sigOwner) {
        //     console.log("render--->sigOwner", sigOwner.substr(sigOwner.length-100), sigOwner.length)
        // }
        // } else {
        //     debugger;
        // }

        let newOwnerHash, newAgentHash;
        // recalc the signature hashes
        if (uriOwner || uriAgent) {
            // debugger;

            // let input = this.prepareInput(),
            let data = null;
            if (uriOwner) {
                data = JSON.stringify( this.getHashData() ) +  sigOwner.substr(sigOwner.length-100);
                // console.log("SummaryView.getHashData--> data owner", data );
                newOwnerHash = crypto.SHA256(data).toString();
            }
            if (uriAgent){
                data = JSON.stringify( this.getHashData() ) + sigAgent.substr(sigAgent.length-100);
                newAgentHash = crypto.SHA256(data).toString();
            }
        }

        let validOwnerSig = hashOwner === newOwnerHash,
            validAgentSig = hashAgent === newAgentHash,
            iheight = 80;

        let agentX =  ( validAgentSig ? <View style={{height:30}} /> : <Icon name="times" color="red" size={30} /> ),
            ownerX =  ( validOwnerSig ? <View style={{height:30}} /> : <Icon name="times" color="red" size={30} /> );

        // debugger;
        let imageOwner = sigOwner ?  <View style={{flexDirection:'row'}}>
                                                {ownerX}
                                                <Image style={{width: 150, height: iheight, resizeMode: Image.resizeMode.cover,
                                                padding:0, margin: 0}} source={{ uri: uriOwner }} ></Image>
                                                </View>
                                 : <View style={{height: iheight }} /> ;


        let imageAgent = sigAgent ? <View style={{flexDirection:'row'}}>
                                            {agentX}
                                            <Image style={{width: 150, height: iheight, resizeMode: Image.resizeMode.cover,
                                             padding:0, margin: 0}} source={{uri: uriAgent}}></Image>
                                             </View>
                                    : <View style={{height: iheight  }} /> ;

        return (

        <View>

            <View style={styles.container} >

                <ScrollView style={[styles.blk,{flex:0.33}]}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{marginLeft:10, flex: 0.7}} >
                            <PlanForm
                              ref="form"
                              type={planModel}
                              options={planOptions}
                              value={planValues}
                              onChange={() => console.log("planForm changed")}
                            />
                        </View>
                        <View style={{flex:0.3}} >
                            {/* can put other stuff here, e.g. status */}
                        </View>

                    </View>
                </ScrollView>

                <View style={{flexDirection:'column', flex: 0.33}} >

                    <View style={{flexDirection:'row'}} >
                        <ScrollView style={styles.blkOthers}>
                            <View style={{marginLeft:10}} >
                              <ListView
                                  dataSource={ this.dsRiders }
                                  renderRow={ (data,sec,row) => this.renderRider(data,sec,row) }
                                  renderHeader={()=> this.renderRiderHeader()}
                                />

                            </View>
                        </ScrollView>
                        { main.benefit_type === '41' ?
                            <ScrollView style={styles.blkOthers}>
                                <View style={{marginLeft:10}} >
                                    <ListView
                                        dataSource={ this.dsFunds }
                                        renderRow={ (data,sec,row) => this.renderFund(data,sec,row) }
                                        renderHeader={()=> this.renderFundHeader()}
                                      />
                                </View>
                            </ScrollView>
                          : <View />
                        }
                    </View>
                    {/* end riders and funds */}
                    <View style={{flexDirection:'row', justifyContent:'space-around', paddingTop:30}}>
                        <View>

                            { imageOwner }
                            <Text>Policy Owner</Text>
                            <Icon.Button name="edit" backgroundColor="#3fb1ee" onPress={()=> this.signature("owner")} >
                                Tap to sign
                            </Icon.Button>

                        </View>

                        <View>

                            { imageAgent }
                            <Text>Intermediary</Text>
                            <Icon.Button name="edit" backgroundColor="#3fb1ee" onPress={()=>this.signature("agent")} >
                                Tap to sign
                            </Icon.Button>
                            {/* really to force redraw, out of screen position so it will not disturb things
                            <View><Text>{this.state.hash}</Text></View> */}

                        </View>

                    </View>

                </View>

            </View>
            <View style={{flex:1, justifyContent:'center', flexDirection:'row'}} >
                <Button textStyle={{color:"white", fontSize:16}}
                    style={{ width:dw/2, height:35, backgroundColor:"#3fb1ee", borderWidth:0 , width:150 }}
                    onPress={()=>this.illustration()} isDisabled={false} >
                              Preview
                </Button>
                { showpdf ? <View /> :
                <Button textStyle={{color:"white", fontSize:16}}
                    style={{ width:dw/2, height:35, backgroundColor:"#3fb1ee", borderWidth:0, width:150 , marginLeft:20}}
                    onPress={()=>this.generatePdf()} isDisabled={false} >
                              PDF
                </Button>
                }
                { contact ?
                    <Button textStyle={{color:"white", fontSize:16}}
                        style={{ width:dw/2, height:35, backgroundColor:"#3fb1ee", borderWidth:0, width:150 , marginLeft:20}}
                        onPress={()=>this.saveQuote()} isDisabled={false} >
                                  Save Quotation
                    </Button> : <View />
                }

            </View>

            {/* Decide whether to show modal */}
            { show ?
                <ModalView ref="modal" show={show} data={this.siData} result={this.tableResult}/> :
                <View />
            }
            { showpdf ?
                <PdfView ref="pdf" show={showpdf} config={this.siData} result={this.tableResult}/> :
                <View />

            }
            { /* showSignature ? this.sig : <View /> */}
            {/* showSignature ?
                <SignatureView closeHandler={(data) => this.closeSignatureUi(data)} ref="signature"
                oldSignature={this.wipSignature} prepareInput={this.prepareInput.bind(this)} /> :
                <View />
            */}



        </View>
        );
    }
    alert(msg=null, title="Error") {
        let message = msg ? msg : 'Please fix the errors, before moving to the next view'
        AlertIOS.alert(
          title,
          message,
          [
            {text:'OK', onPress : (txt) => console.log(txt)}
          ],
        //   'default'
        );
    }

    validSignatures() {
        // get some signature dataSource
        let sigOwner = this.uistate.get().quote.signatureOwner,
            sigAgent = this.uistate.get().quote.signatureAgent,
            hashOwner = this.uistate.get().quote.hash_owner,
            hashAgent = this.uistate.get().quote.hash_agent;


        let newOwnerHash, newAgentHash, validOwnerSig, validAgentSig,
        validSignatures = false;
        // recalc the signature hashes

        if (sigOwner && sigOwner) {
            // let input = this.prepareInput(), data;
            let data;
            data = JSON.stringify( this.getHashData() ) + sigOwner.substr(sigOwner.length - 100);
            newOwnerHash = crypto.SHA256(data).toString();

            data = JSON.stringify( this.getHashData() ) + sigAgent.substr(sigAgent.length - 100 );
            newAgentHash = crypto.SHA256(data).toString();

            validOwnerSig = hashOwner === newOwnerHash,
            validAgentSig = hashAgent === newAgentHash;
            validSignatures = validOwnerSig && validAgentSig ? true : false;

        }
        return validSignatures;
    }
    saveQuote() {
        //console.log("save quote")
        // if the contact does not exists ? how ?
        if (!this.uistate.get().quote.contact) {
            // should not happen as save button will be disabled
            return;
        }


        // assemble the data
        let qstate = this.uistate.get().quote,
            doc = {};


        if (qstate.status === 'Submitted') {
            // cannot save (change) a quotations that is already submitted
            this.alert("Cannot update submitted quotation")
            return
        }
        // let quoteTable = getColl("quotations"),
        //     contactTable = getColl("contacts"),
        //     db = getDb();

        let ph = _.find(qstate.policy.people.data, (p) => p.is_ph )
        if (qstate.quote) {
            // doc = quoteTable.get(qstate.quote_id);
            doc = _.assign({}, qstate.quote);
        }
        let plan = qstate.current_main;
        let main = Object.assign({internal_id:plan.internal_id,
            product_name: plan.product_name, product_id: plan.product_id},
            qstate.policy.main.data0, qstate.policy.main.data1);
        doc.contact_id = qstate.contact._id;
        doc.lastModified = new Date()
        doc.signatureOwner = qstate.signatureOwner;
        doc.signatureAgent = qstate.signatureAgent;
        doc.name = ph && ph.name;
        doc.status = doc.signatureOwner && doc.signatureAgent  && this.validSignatures() ? 'Signed' : 'Pending'
        doc.policy = {};
        doc.policy.prem_freq = qstate.policy.main.payment_frequency;

        let validPeople = qstate.policy.people.data.toJS().filter((p) => p.name )
        // validPeople = _.assign({},validPeople);
        // get the age of the people
        let gbl = window || global || root;
        _.forEach(validPeople, (p,index) => {
            validPeople[index].age = gbl.api.calcAge4Product(p.dob, main.product_id);
        })
        doc.policy.people = validPeople ; //qstate.policy.people.data || []
        doc.policy.main = main;
        doc.policy.riders = qstate.policy.riders.data.toJS() || []
        doc.policy.funds = qstate.policy.funds.data || []
        doc.policy.inout = qstate.policy.inout.data || []
        doc.policy.loadings = qstate.policy.loadings || [];

        // try and link the fna
        if (qstate.fna) {
            doc.fnaId = qstate.fna._id;            
        }
        // create hash to save along -- really only needed if either signature is there
        if (doc.signatureOwner) {
            doc.hash_owner = this.uistate.get().quote.hash_owner;
        }
        if (doc.signatureAgent) {
            doc.hash_agent = this.uistate.get().quote.hash_agent;
        }
        //
        // need some extra values from the product engine, so call them here
        //
        let products = [doc.policy.main, ...doc.policy.riders]
        // debugger;
        let inputjson = { policy : { people :  doc.policy.people, products : products , 'prem_freq' : qstate.policy.main.data1.payment_frequency}};
        _.forEach(products, (p,index) => {
            let coveragePeriod, coverageYear, chargePeriod, chargeYear, term, ap, prem, polFeeBefore, polFeeAfter;
            let prefix = index === 0 ? '' : 'r' + index + '.';
            let terms = gbl.api.getCoverageTerms(p.product_id);
            if (terms.length > 0) {
                term = terms[ terms.length - 1]
                p.coveragePeriod = term.termType;
                p.coverageYear = term.year;
            }
            terms = gbl.api.getChargePeriods(p.product_id);
            if (terms.length > 0) {
                term = terms[ terms.length - 1]
                p.chargePeriod = term.termType;
                p.chargeYear = term.year;
            }
            let requests = ['ap','prem','pol_fee_before_modal_factor', 'pol_fee_after_modal_factor'].map((r) => prefix + r);
            // console.log("summaryView.saveQuote---> requests", requests);
            let result = gbl.api.calc(inputjson, requests);
            p.ap = result.policy.products[index].ap || 0;
            p.prem = result.policy.products[index].prem || 0;
            p.policyFeeBefore = result.policy.products[index].pol_fee_before_modal_factor || 0;
            p.policyFeeAfter = result.policy.products[index].pol_fee_after_modal_factor || 0;
            // console.log("summaryView.saveQuote---> requests", JSON.stringify(p));
        })


        // if (doc.signatureOwner || doc.signatureAgent) {
        //     let input = this.prepareInput();
        //     doc.hash_owner = crypto.SHA256(JSON.stringify( input.inputjson ) + (doc.signatureOwner||'') ).toString();
        //     doc.hash_agent = crypto.SHA256(JSON.stringify( input.inputjson ) + (doc.signatureAgent||'') ).toString();
        // }
        doc.doctype = DOCTYPE;
        let updated;
        if (doc._rev) {
            // cblite.getDocument(doc._id).then((ddoc) => {
            //
            //     doc._rev = ddoc._rev;
                cblite.updateDocument(doc, doc._rev ).then( (res) => {
                    if (res.ok) {
                        // console.log("SaveQuote ----> res", res);
                        updated = _.assign({}, doc, {'_rev': res.rev, '_id' : res.id } ); // , { _id: res.id, _rev: res.rev });
                        self.alert("Quotation information was successfully saved", "Info")
                        this.uistate.get().quote.set({refresh:true, quote: updated, reloadQuote : true });
                    } else {
                        self.alert("Error in saving quotation", res.reason);

                    }
                })
                .catch((err) => console.log("Error in updating", err))
            // })


        } else {
            cblite.createDocument(doc, doc._rev ).then( (res) => {
                if (res.ok ) {
                    updated = _.assign({}, doc, {'_rev': res.rev, '_id' : res.id } ); // , { _id: res.id, _rev: res.rev });
                    self.alert("Quotation information was successfully saved", "Info")
                    this.uistate.get().quote.set({refresh:true, quote : updated, reloadQuote : true });
                } else {
                    self.alert("Error in saving quotation");
                }
            })
            .catch((err) => console.log("Error in updating", err))
        }



        // let newdoc;
        // if (qstate.quote_id) {
        //     newdoc = quoteTable.update(doc)
        // } else {
        //     newdoc = quoteTable.insert(doc)
        // }
        // quoteTable.flushChanges()
        // db.saveDatabase((status) => {
        //     this.uistate.get().quote.set({quote_id: newdoc.$loki})
        //     self.alert("Quotation was saved.")
        //     this.forceUpdate()
        // })



        // this.uistate.get().contactinfo.set({refresh:true, currentContact: newdoc})
    }
    // signature(role) {
    //
    //     if (role === 'owner') {
    //         // this.wipSignature = this.uistate.get().quote.signatureOwner;
    //
    //         this.uistate.get().quote.set({
    //             show_signature : true,
    //             tempSignature : this.uistate.get().quote.signatureOwner,
    //             // refresh : true,
    //             signature_data : '',
    //             signatory : role,
    //             slidemenu : false,
    //             signatureOwner : null
    //         }).now();
    //
    //     } else {
    //         // this.wipSignature = this.uistate.get().quote.signatureAgent;
    //         this.uistate.get().quote.set({
    //             show_signature : true,
    //             tempSignature : this.uistate.get().quote.signatureAgent,
    //             signature_data : '',
    //             // refresh : true,
    //             signatory : role,
    //             slidemenu : false,
    //             signatureAgent : null
    //         }).now();
    //     }
    //     // this.props.fns.toRoute({
    //     //     name : 'Signature',
    //     //     component : Signature
    //     // })
    //
    // }

    signature(role) {
        // console.log(TAG+"signature ---> role", role)

        this.uistate.get().quote.set({refresh:false, show_signature:true, reloadQuote:false}).now(); // needed so that signature will refresh after signing
        let tempSignature;
        if (role === 'owner') {
            // debugger;
            tempSignature = this.uistate.get().quote.signatureOwner;
            // this.uistate.get().quote.set({tempSignature: this.uistate.get().quote.signatureOwner}).now()
            this.uistate.get().quote.set({signatureOwner:null, refresh:true}).now()
        } else {
            tempSignature = this.uistate.get().quote.signatureAgent;
            // this.uistate.get().quote.set({tempSignature: this.uistate.get().quote.signatureAgent})
            this.uistate.get().quote.set({signatureAgent:null, refresh:true}).now()
        }
        this.props.fns.toRoute({
            name : 'Signature',
            component : Signature,
            data : {role:role, onSaveSignature : this.onSaveSignature.bind(this), tempQuoteSignature: tempSignature }
        })
        return
    }

    onSaveSignature(data, signer) {

        let newState = {refresh:true, reloadQuote : false}; // tells quoteView not to reload the quotation
        if ( data ) {
            // data = pako.deflate( dbstring, {to:'string'});
            if (signer === 'owner') {

                newState.signatureOwner = data;
                //let input = this.prepareInput(),
                let    string = JSON.stringify( this.getHashData() ) + data.substr(data.length-100);
                newState.hash_owner = crypto.SHA256(string).toString();
                // console.log("signatureView--->sigOwner", data.substr(data.length-100), data.length)
                // this.setState({hash: newState.hash_owner})
            }
            if (signer === 'agent' ) {
                newState.signatureAgent = data;
                // let input = this.prepareInput(),
                let string = JSON.stringify( this.getHashData() ) + data.substr(data.length-100);
                newState.hash_agent = crypto.SHA256(string).toString();

                // this.setState({hash: newState.hash_agent})
            }
            // newState.tempSignature = null;
        }
    //   console.log("signatureView, newState", newState)
      this.uistate.get().quote.set( newState ).now();
    //   this.forceUpdate()
    }


    closeSignatureUi(data) {
        // console.log("SummaryView--->---------> closeSignatureUi");
        // this.wipSignature = null;
        this.uistate.get().quote.set({
            show_signature:false,
            // signature_data : data,
            slidemenu : true,
        }).now();

    }

    flatten(data) {

        var fn = function(parent, oo) {
            var result = [];
            var reslist=[];
            var res, sorted, sorted2
            // console.log("processing object", oo)
            var arrfn = function(parent,arr) {
                var templist = [], res, wlist=[];
                var sorted2 = _.sortBy(arr);
                sorted2.forEach(function(item,index){
                    var newkey = parent + '>' + index ;
                    if (_.isArray(item)) {
                        res = arrfn(newkey, item)
                    } else if (_.isPlainObject(item)) {
                        res = fn(newkey , item)
                    } else {
                        res = [ newkey + ':' + item]
                    }
                    res.forEach( function(i) {
                        templist.push(i)
                    })
                })
                return templist;
            }

            _.forOwn(oo, function(value,key)  {
                var newkey = parent + '>' + key ;
                if ( _.isArray(value)) {
                    reslist = arrfn(newkey, value);

                    result = result.concat(reslist)

                } else if (_.isPlainObject(value)) {
                    var keys=[], values=[], sortedkeys=[];
                    sorted = _.sortBy( _.keys(value));
                    // console.log("value is object *** ", value, key, newkey, sorted)

                    let wlist = [];
                    sorted.forEach(function(kkk){

                        if (_.isArray(value[kkk])) {
                            res = arrfn(newkey + '>' + kkk , value[kkk])
                          //   console.log("result from arrfn", res);

                        } else if (_.isPlainObject(value[kkk])) {
                            // console.log("Calling another object, newkey", newkey, value[kkk])
                            res = fn(newkey + '>' + kkk , value[kkk])
                        } else {
                            res = [ newkey + '>' + kkk + ':' + value[kkk]]
                        }
                        // console.log("value is object ---> , res for ", kkk , res);
                        res.forEach( function(i) {
                            wlist.push(i)
                        })
                        // wlist.push(newkey +  res);
                    });
                    result = result.concat(wlist)

                } else {
                    // console.log("value is normal", newkey, value)
                    result.push( newkey + ':' + value)

                }

            })
            return result
        }
      //   debugger;
        let workdata = fn('',data);
        workdata = _.sortBy(workdata);
        workdata = workdata.join('~')
        return workdata;


    }
    getHashData(){
        // ideally this should be in the 'smart' component i.e. proposal-s2-home, but for now....
        let data = this.prepareInput()
        let json = data.inputjson;
        let people = json.policy.people;
        let prds = json.policy.products;
        // remove some additional fields added during save, otherwise cannot tally
        _.forEach(people,(p,index) => delete p.age);
        _.forEach(prds,(p,index) => {
            delete p.prem;
            delete p.ap;
            delete p.coveragePeriod;
            delete p.coverageYear;
            delete p.chargePeriod;
            delete p.chargeYear;
            delete p.polFeeAfter;
            delete p.polFeeBefore;
            delete p.money_id ; // this is causing issues for now, we fix it later
        });


        // console.log("SummaryView.getHashData--> inputjson", JSON.stringify( data.inputjson ));
        // do somethings to ensure consistency in the sequence of the hash data
        return this.flatten(data.inputjson);
    }

    prepareInput() {
        let quote = this.uistate.get().quote,
            main = quote.current_main,
            policy = quote.policy.toJS(),
            people = policy.people.data,
            plan = Object.assign({product_id:main.product_id, internal_id: main.internal_id},
                   this.uistate.get().quote.policy.main.data0,
                   this.uistate.get().quote.policy.main.data1),
            riders = policy.riders.data,
            funds  = policy.funds.data,
            inout  = policy.inout.data,
            gbl = window || global || root,
            config  = gbl.api.getSIConfig( parseInt(main.product_id)),
            topups, withdrawals,result, svFields;

        topups = _.filter(inout, (row) => row.in > 0).map((row) => { return {year: row.year, amount: row.in } });
        withdrawals = _.filter(inout, (row) => row.out > 0).map((row) => { return {year: row.year, amount: row.out } });

        // fix some discrepancy in type of sa
        if (main.benefit_type === '41') {
            plan.basic_sa = plan.initial_sa;
        }
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

        // console.log("SummaryView.prepareInput--> newPlan", JSON.stringify(newPlan));


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
    prepareTableData(){

         let input = this.prepareInput();
         let si_colnames = input.config.si_colnames,
             si_fieldnames = input.config.si_fields,
             si_colwidths = input.config.si_colwidths,
             gbl = window || global || root;

         // colwidths is optional
        //  debugger;
         if (!si_colwidths) {
             let wid = (dw-60) / si_colnames.length / (dw-60);
             si_colwidths = _.map(si_colnames, (c) => wid) ;
         }

         let main = this.uistate.get().quote.current_main,
             svFields = main.benefit_type === '41' ? ["entry_age","ph_entry_age"]
                                                   : ["entry_age","ph_entry_age","coverage", "pol.totprem"] ;
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


} // end SideMenu class

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"row",
    justifyContent:"space-around",
    paddingTop : 0,
  },
  blk : {
      flex:1 ,
    //   backgroundColor: '#358fdb',
    //   backgroundColor: 'rgba(125, 198, 181, 0.42)',
      backgroundColor: '#bbd4c1',
      height: dh-220,
      paddingTop:10,
      margin:2 ,
      borderWidth:1,
      borderColor : '#eeffee',
      borderRadius : 10
  },
  blkOthers : {
      flex:1 ,
    //   backgroundColor: 'rgba(125, 198, 181, 0.42)',
      backgroundColor: '#bbd4c1',
      height: 300,
      paddingTop:10,
      margin:2 ,
      borderWidth:1,
      borderColor : '#eeffee',
      borderRadius : 10
  },

  // center: {
  //   flex: 1,
  //   backgroundColor: '#dd2f33',
  // },
  separator: {
    height: 2,
    backgroundColor: '#CCCCCC',
  },
  icon: {
    paddingRight: 10,
    height: 64,
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'center',
    justifyContent: 'flex-start',
    // padding: 10,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1,
  },
  section: {
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'flex-start',
       padding: 2,
      //  backgroundColor: '#2196F3'
       backgroundColor: '#0296c3'
   },
   sectionText: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
})
