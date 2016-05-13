'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  ListView,
  AlertIOS
} = React;

import _ from "lodash";
import moment from "moment";
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabsBar from "../components/tabsBar";
import cblite from "../cblite";
import ProposalS1PhLaSidemenu from "./proposal-s1-phla-sidemenu";
import ProposalS1PhBasicView  from "./proposal-s1-ph-basic";
import ProposalS1PhContactsView  from "./proposal-s1-ph-contacts";
import ProposalS1PhAddressView  from "./proposal-s1-ph-address";
import ProposalS1PhPersonalView  from "./proposal-s1-ph-personal";
import ProposalS1PlanView from "./proposal-s1-plan";
import ProposalS1ExtraMenu from "./proposal-s1-extra-menu";
import ProposalS1ExtraPaymentinfoView from "./proposal-s1-extra-paymentinfo";
import ProposalS1ExtraBeneficiaryView from "./proposal-s1-extra-beneficiary";
import ProposalS1ExtraOwnerView from "./proposal-s1-extra-owner";
import ProposalS1ExtraPoliciesView from "./proposal-s1-extra-policies";
import ProposalS1StandardView from "./proposal-s1-standard";
import ProposalS1PhHealthView from "./proposal-s1-ph-health";
import ProposalS1PhFamilyHistoryView from "./proposal-s1-ph-family-hist";
import ProposalS1DeclarationMenu from "./proposal-s1-declaration-menu";
import ProposalS1AuthorityView from "./proposal-s1-authority";
import ProposalS1TemporaryView from "./proposal-s1-temp-protect";
import ProposalS1PdpaView from "./proposal-s1-pdpa";
import ProposalS1DocumentsView from "./proposal-s1-documents";
import ProposalS1SignatureView from "./proposal-s1-signature";
import ProposalS1AgentReportView from "./proposal-s1-agent-report";

var dh = Dimensions.get('window').width;
var dw = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');
const TAG = "ProposalS1Home."
export default class ProposalS1Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        offset : new Animated.Value(0)
    };
    this.mode = 'edit';
    this.stateListener = null;
    this.uistate = require("../state");
    this.fns = Object.assign({
        gotoTab: this.gotoTab.bind(this),
        gotoView : this.gotoView.bind(this),
        saveProposal : this.saveProposal.bind(this),
        createProposalSubmission : this.createProposalSubmission.bind(this)
    }, props.fns)
  }

  componentWillMount(){
      this.loadCurrentProposal()
  }
  componentWillReceiveProps(props){
      if (this.uistate.get().proposal.s1.ui.updated) {
          this.loadCurrentProposal()
      }
  }

  loadCurrentProposal() {
      var doc = {},
          newdoc = {},
          updated = this.uistate.get().proposal.s1.ui.updated,
          quote = this.uistate.get().proposal.s1.ui.quote,
          proposal = this.uistate.get().proposal.s1.ui.proposal; // passed in

      if (!updated) return; // load only when the proposal has been updated, other no need

      if ( proposal ) {
        //   proposal = proposalColl.get(pid);
          console.log(TAG + " Loading proposal data .....")
          doc.s1 = {}
          doc.s1.ph = {}
          doc.s1.la = {}
          doc.s1.main = {}
          doc.s1.paymentinfo = {}
          doc.s1.owner = {}
          doc.s1.ph.data = _.omit(proposal.ph,['contacts','addresses','notes','dependents','base','health','family_hist']);
          ['contacts','addresses','notes','dependents'].forEach((item) => doc.s1.ph[item] = proposal.ph[item] || [] );
          ['base','health','family_hist'].forEach( (group) => { doc.s1.ph[group] = _.assign({}, proposal.ph[group]) })
          doc.s1.la.data = _.omit(proposal.la,['contacts','addresses','notes','dependents','base','health','family_hist']);
          ['contacts','addresses','notes','dependents'].forEach((item) => doc.s1.la[item] = proposal.la[item] || [] );
          ['base','health','family_hist'].forEach( (group) => { doc.s1.la[group] = _.assign({}, proposal.la[group]) });

        //   doc.s1.main.data = proposal.main;
        //   doc.s1.riders = proposal.riders || [];
        //   doc.s1.funds = proposal.funds || [];
          doc.s1.quotation = proposal.quotation;

          doc.s1.paymentinfo.data = proposal.paymentinfo;
          doc.s1.owner.data = proposal.owner;
          doc.s1.beneficiaries = proposal.beneficiaries || [];
          doc.s1.policies = proposal.policies || [];
          doc.s1.pdpa = _.assign( {},this.uistate.get().proposal.s1_defaults.pdpa, proposal.pdpa );
          doc.s1.signature = proposal.signature || {};
          doc.s1.agentReport = proposal.agentReport || {};

          doc.s1.documents = {};
          doc.s1.documents.data = _.assign( {},this.uistate.get().proposal.s1_defaults.documents, proposal.documents); // put in defaults first

          if ("_attachments" in proposal ) {

              let photoNames = _.keys(proposal._attachments),
                  photos = {}, promises = [];

              _.forEach(photoNames, (name) => {
                  promises.push( cblite.getAttachment(proposal._id, proposal._rev, name));
              })
              Promise.all(promises).then( (values) => {
                  _.forEach(values, (photo, index) => {
                    photos[photoNames[index]] = photo;
                  })
                  this.uistate.get().proposal.s1.documents.set({photos:photos}); // load up into the app state
              })
              .catch((err) =>{
                  console.log("Unable to load photos", err);
                  self.alert("Unable to load photos : " + err)
              })
          }



          let currentUi = _.assign({},this.uistate.get().proposal.s1.ui);
          let equal = doc.s1.la.name ? false : true ; // if we had saved the la name , then diff from ph
          ////////

          // load the yesno answers into the ui section for base -- used for show & hide
          if (proposal.ph.base && proposal.ph.base.questions) {
              let yesno = _.map(_.keys(proposal.ph.base.questions), (q) => /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
              let stored = {}
              _.forEach(yesno, (k) => { stored[k] = proposal.ph.base.questions[k] });
              currentUi = _.assign({}, currentUi, {phbase: stored });
          } else {
              let yesno = _.map(_.keys(this.uistate.get().proposal.s1_defaults.base_questions), (q) =>
                            /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
                let stored = {}
                _.forEach(yesno, (k) => { stored[k] = false });
                currentUi = _.assign({}, currentUi, {phbase: stored});
          }
          if (proposal.la.base && proposal.la.base.questions) {
              let yesno = _.map(_.keys(proposal.la.base.questions), (q) => /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
              let stored = {}
              _.forEach(yesno, (k) => { stored[k] = proposal.la.base.questions[k] });
              currentUi = _.assign({}, currentUi, {labase: stored});
          } else {
              let yesno = _.map(_.keys(this.uistate.get().proposal.s1_defaults.base_questions), (q) =>
                            /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
                let stored = {}
                _.forEach(yesno, (k) => { stored[k] = false });
                currentUi = _.assign({}, currentUi, {labase : stored });
          }


          if (proposal.ph.health && proposal.ph.health.questions) {
              let stored = {}
              let yesno = _.map(_.keys(proposal.ph.health.questions), (q) => /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
              _.forEach(yesno, (k) => { stored[k] = proposal.ph.health.questions[k]})
            //   debugger;
              currentUi = _.assign({}, currentUi, {phhealth: stored});
          } else {
              let stored = {}
              let yesno = _.map(_.keys(this.uistate.get().proposal.s1_defaults.health_question), (q) => /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
              _.forEach(yesno, (k) => { stored[k] = this.uistate.get().proposal.s1_defaults.health_question[k]})
              currentUi = _.assign({}, currentUi, {phhealth: stored});
          }

          if (proposal.la.health && proposal.la.health.questions) {
              let stored = {}
              let yesno = _.map(_.keys(proposal.la.health.questions), (q) => /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
              _.forEach(yesno, (k) => { stored[k] = proposal.la.health.questions[k]})
              currentUi = _.assign({}, currentUi, {lahealth: stored});
          } else {
              let stored = {}
              let yesno = _.map(_.keys(this.uistate.get().proposal.s1_defaults.health_question), (q) => /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
              _.forEach(yesno, (k) => { stored[k] = this.uistate.get().proposal.s1_defaults.health_question[k]})
              currentUi = _.assign({}, currentUi, {lahealth: stored});
          }

        //   if (proposal.ph.family_hist && proposal.ph.family_hist.questions) {
        //       let stored = {}
        //       let yesno = _.forOwn(proposal.ph.family_hist.questions, (v,k) => stored[k] = v );
        //     //   _.forEach(yesno, (k) => { stored[k] = proposal.ph.health.questions[k] });
        //       currentUi = _.assign({}, currentUi, {phfamily : stored });
        //   } else {
        //       let stored = {}
        //       let yesno = _.forOwn(this.uistate.get().proposal.s1_defaults.family_hist, (v,k) => stored[k] = v );
        //       currentUi = _.assign({}, currentUi, {phfamily : stored});
        //   }
          //
        //   if (proposal.la.family_hist && proposal.la.family_hist.questions) {
        //       let stored = {}
        //       let yesno = _.forOwn(proposal.la.family_hist.questions, (v,k) => stored[k] = v );
        //     //   _.forEach(yesno, (k) => { stored[k] = proposal.ph.health.questions[k] });
        //       currentUi = _.assign({}, currentUi, {lafamily : stored });
        //   } else {
        //       let stored = {}
        //       let yesno = _.forOwn(this.uistate.get().proposal.s1_defaults.family_hist, (v,k) => stored[k] = v );
        //       currentUi = _.assign({}, currentUi, {lafamily : stored });
        //   }

          // handle the base menu items -- look at the current ui
          let items = _.assign([], currentUi.ph.base_menu_items);
        //   debugger;
          if (doc.s1.ph.doctor && ! _.isEmpty(doc.s1.ph.doctor.questions)) {
              let pos = items.indexOf('Doctors');
              if (pos < 0) {
                  items.push('Doctors');
              }
          }
          currentUi = _.assign({}, currentUi, {ph: {base_menu_items : items}});

          doc.s1.ui = Object.assign({},currentUi, {refresh:false,tabno:0, viewno:0, updated: false, ph_is_la : equal, savedSignature : false });
        //   debugger;
          if (proposal.status === 'S1-OK' || proposal.status === 'S2-OK' || proposal.status === 'S3-OK') {
              this.uistate.get().proposal.ui.set({section_1_ok: true, current_section:1}).now()
          } else {
              this.uistate.get().proposal.ui.set({section_1_ok: false, current_section:1}).now()
          }
          this.uistate.get().proposal.set({s1:doc.s1}).now();

          // more work later, depends on structure of the uistate to hold the da
      } else if (quote) {
          // new proposal, use quote information to partly populate the new proposal
            let {ph, la} = this.props.data,
                freq = quote.policy.main.payment_frequency;

            doc.s1 = {}
            doc.s1.ph = {}
            doc.s1.la = {}
            doc.s1.ph.data = ph;
            doc.s1.ph.contacts = _.assign([],ph.contacts);
            doc.s1.ph.addresses = _.assign([],ph.addresses);
            // make one of the addresses, the correspondence addresses, take the 1st one
            if ( doc.s1.ph.addresses.length > 0) {
              let addr = Object.assign({},doc.s1.ph.addresses[0]);
              addr.is_correspondence = true;
              doc.s1.ph.addresses[0] = addr;
            }
            doc.s1.ph.dependents = _.assign([],ph.dependents);

            doc.s1.la.data = la;
            doc.s1.la.contacts = _.assign([],la.contacts);
            doc.s1.la.addresses = _.assign([],la.addresses);
            doc.s1.la.dependents = _.assign([],la.dependents);

            doc.s1.ph.base = { questions : {}  };
            doc.s1.ph.health = { questions : {}  };
            doc.s1.ph.family_hist = { questions : {}  };

            doc.s1.la.base = { questions : {}  };
            doc.s1.la.health = { questions : {}  };
            doc.s1.la.family_hist = { questions : {}  };

            // next is the quotation
            doc.s1.quotation = quote; // just copy the entire quotation over

            doc.s1.paymentinfo = {}
            doc.s1.paymentinfo.data = {}
            doc.s1.paymentinfo.data.premium_frequency = freq === '1' ? 'Yearly' : freq === '2' ? 'Half-yearly' : freq === '3' ? 'Quarterly'
                                                 : freq === '4' ? 'Monthly' : freq === '5' ? 'Single Payment' : '' ;
            doc.s1.owner = {}
            doc.s1.owner.data = {}
            doc.s1.beneficiary = []
            doc.s1.policies = []
            doc.s1.pdpa = _.assign( {},this.uistate.get().proposal.s1_defaults.pdpa);
            doc.s1.documents = _.assign( {},this.uistate.get().proposal.s1_defaults.documents); // put in defaults first
            doc.s1.signature = {};
            doc.s1.agentReport = {};

            let currentUi = this.uistate.get().proposal.s1.ui;
            let equal = ph._id && ph._id === la._id;

            let yesno = _.map(_.keys(this.uistate.get().proposal.s1_defaults.base_questions), (q) =>
                          /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
            let stored = {}
            _.forEach(yesno, (k) => { stored[k] = false });
            currentUi = _.assign({}, currentUi, {phbase: stored});
            currentUi = _.assign({}, currentUi, {labase : stored });

            stored = {}
            yesno = _.map(_.keys(this.uistate.get().proposal.s1_defaults.health_question), (q) => /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
            _.forEach(yesno, (k) => { stored[k] = false })
            currentUi = _.assign({}, currentUi, {phhealth: stored});
            currentUi = _.assign({}, currentUi, {lahealth: stored});


            doc.s1.ui = Object.assign({},currentUi, {refresh:true,tabno:0, viewno:0, updated: false, ph_is_la : equal, savedSignature:false });

            this.uistate.get().proposal.ui.set({section_1_ok: false, current_section:1}).now(); // where we are in proposal entry
            this.uistate.get().proposal.set({s1:doc.s1}).now();

      } else {
         this.alert("Unable to find quotation or proposal to load")
         return
      }
  }

  saveProposal(callback=null){

      let proposal = this.uistate.get().proposal.s1.ui.proposal || {},
          s1 = this.uistate.get().proposal.s1,
          doc = _.assign({}, proposal);

      doc.ph = _.assign({},doc.ph, s1.ph.data);
      doc.ph.contacts = _.assign([],doc.ph.contacts, s1.ph.contacts);
      doc.ph.addresses = _.assign([],doc.ph.addresses, s1.ph.addresses);
      doc.ph.dependents = _.assign([],doc.ph.dependents, s1.ph.dependents);
      doc.ph.notes = _.assign([],doc.ph.notes, s1.ph.notes);
      doc.ph.base = _.assign({}, doc.ph.base, s1.ph.base)
      doc.ph.health = _.assign({}, doc.ph.health, s1.ph.health)
      doc.ph.family_hist = _.assign({}, doc.ph.family_hist, s1.ph.family_hist)

      doc.la = _.assign({},doc.la, s1.la.data);
      doc.la.contacts = _.assign([],doc.la.contacts, s1.la.contacts);
      doc.la.addresses = _.assign([],doc.la.addresses, s1.la.addresses);
      doc.la.dependents = _.assign([],doc.la.dependents, s1.la.dependents);
      doc.la.notes = _.assign([],doc.la.notes, s1.la.notes);
      doc.la.base = _.assign({}, doc.la.base, s1.la.base)
      doc.la.health = _.assign({}, doc.la.health, s1.la.health.questions)
      doc.la.family_hist = _.assign({}, doc.la.family_hist, s1.la.family_hist.questions)

      doc.quotation = _.assign({}, doc.quotation, s1.quotation);

      doc.paymentinfo = _.assign({}, doc.paymentinfo, s1.paymentinfo.data);
      doc.beneficiaries = _.assign([],doc.beneficiaries, s1.beneficiaries);
      doc.owner = _.assign({}, doc.owner, s1.owner.data);
      doc.policies = _.assign([],doc.policies, s1.policies);

      doc.pdpa = _.assign({},doc.pdpa, s1.pdpa.data);
      doc.documents = _.assign({}, s1.documents.data ) ; // we store the photos separately as attachments
      doc.signature = _.assign({}, doc.signature, s1.signature);
      doc.agentReport = _.assign({}, doc.agentReport, s1.agentReport);

      doc.lastModified = new Date();
      // check on the status of things
      // the following fields must have values for s1 to be considered as complete
      let phfields = ['name','dob','gender','religion',
                      'idType','idNo','maritalStatus','jobCategory','industry','sector','salary']
      let ok = true;
      phfields.forEach((fname) => {
          if (!doc.ph[fname]) ok = false;
      })
      // to be ok, must also have at least one address that is the correspondence address
      if (doc.ph.addresses.length < 1) {
          ok = false
      } else {
          let corr = _.find(doc.ph.addresses, (add) => add.is_correspondence );
          if (!corr) ok = false;
      }
      if (ok) {
          if (doc.status === 'NEW' || !doc.status) {
              doc.status = 'S1-OK'
          } // else , we do not need to change the doc status
      } else {
          doc.status = 'NEW'
      }

      doc.doctype = 'proposals' ; // important
      doc.channels = ['sp']
      if (! doc._rev) {
          doc.creationDate = new Date();
      }
      if ( doc.signature.agentSig && doc.signature.phSig ) {
          // signed, check if signature was the same
          let savedSignature = this.uistate.get().proposal.s1.ui.savedSignature;
          if (savedSignature || !doc.signedDate) {
              doc.signedDate = new Date();
          }
      }


      let updated,
          fn = doc._rev ? cblite.updateDocument.bind(cblite) : cblite.createDocument.bind(cblite);

      fn(doc, doc._rev).then( (res) => {
            if (res.ok) {
                updated = _.assign({}, doc, {'_rev': res.rev, '_id' : res.id } );

                // photos are attachments and saved separately
                var promises = []
                if (! _.isEmpty(s1.documents.photos)) {
                      doc._attachments = {}
                      _.forOwn(s1.documents.photos, (photo,key) => {
                          let att = photo; // photo.split('base64')[1];
                          promises.push(cblite.saveAttachment(updated._id, updated._rev, key, att) );
                      })
                }
                if (promises.length === 0 ) {
                    promises.push(new Promise((resolve,reject) => { resolve({ok:true} ) } ));
                }

                Promise.all(promises).then( (rows) => {
                    console.log(TAG+"result from saving attachments", rows);

                    if (updated.status === 'S1-OK' || updated.status === 'S2-OK' || updated.status === 'S3-OK') {
                        this.uistate.get().proposal.ui.set({section_1_ok: true}).now()
                    } else if (updated.status === 'S2-OK' || updated.status === 'S3-OK') {
                        this.uistate.get().proposal.ui.set({section_2_ok: true}).now()
                    } else {
                        this.uistate.get().proposal.ui.set({section_2_ok: false}).now()
                    }
                    // this.uistate.get().proposal.s1.ui.set({refresh:true, proposal_id: newdoc.$loki}).now()
                    this.uistate.get().proposal.s1.ui.set({refresh:true, proposal: updated, updated:true}).now()
                    if (callback) {
                        callback({status: 'ok'})
                    } else {
                        this.alert("Proposal information was successfully saved", "Information")
                    }


                });


            } else {
                if (callback) {
                    callback({ status : 'ko' , error : "Unable to save proposal. " + res })
                } else {
                    this.alert("Unable to save proposal. " + res)
                }
            }


        })
        .catch((err) => {
            console.log("Error in updating", err);
            if (callback) {
                callback({ status : 'ko' ,  error : "Unable to save proposal. " + err })
            } else {
                this.alert("Unable to save proposal. " + err)
            }
        })

  }
  createProposalSubmission(submsnDoc, proposal, cb) {
      // take the updated proposal, from s1.ui.proposal and map to the proposalSubmission document
      var self = this;
      console.log("createProposalSubmission entry 1")
      cblite.createDocument( submsnDoc).then( (res) => {
        //   console.log("createProposalSubmission", res)
          if (!res.ok) {
              self.alert("Unable to submit proposal : " + res.status + " : " + res.error );
              cb({error : res.status, errorMsg : res.error, ok: false})
              return
          }
        //   console.log("created submission entry 1")
          // now to update the original proposal to status of submitted
          let prop = _.assign({}, proposal);
          prop.status = 'SUBMITTED';
          cblite.updateDocument(prop, prop._rev ).then( (res) => {
            //   console.log("updated proposal", res)
              if (res.ok) {
                  let updated = _.assign({}, prop, {'_rev': res.rev, '_id' : res.id } );
                  self.uistate.get().proposal.s1.ui.set({proposal: updated})
                  cb({ok: true})
                  return
              } else {
                  self.alert("Unable to save the current contact" + res );
                  cb({ok: false, error: res.status, errorMsg : res.error})
                  return
              }
          })
          .catch((err) => {
              console.log("Error in updating proposal", err);
              self.alert("Unable to update proposal after submission: " + err);
              cb({error : err, errorMsg : err, ok: false})
          })

      })
      .catch((err) => {
          console.log("Error in updating", err);
          self.alert("Unable to submit proposal : " + err);
          cb({error : err, errorMsg : err, ok: false})
      })



  }

  componentDidMount(){
    this.stateListener = this.uistate.get().proposal.s1.getListener(); // listen only on s1
    let fn = (data) => {
        console.log(TAG + "proposal-s1-home. componentDidMount -----> data.ui", data.ui);
        if (data.ui.refresh) {
            console.log("***** ----> proposal-s1-home...updated");
            this.forceUpdate();
        }
    }
    this.stateListener.on('update', _.debounce(fn , 100) );
  }
  componentWillUnmount() {
      this.stateListener.off('update'); // clean up
  }
  componentDidUpdate(lastProps, lastState) {
      Animated.timing(this.state.offset, {
        duration: 600,
        toValue: 0
      }).start();
  }

  tabPressed(tabno, text){
    // let currentTab = this.uistate.get().proposal.s1.ui.tabno;

    let currentTab = this.uistate.get().proposal.s1.ui.tabno;
    let currentViewNo = this.uistate.get().proposal.s1.ui.viewno;
    // can do some checking here before going to the new requested tab
    // console.log("contact-info-home.tabPressed newtab, currenttab", tabno, currentTabno)
    this.uistate.get().proposal.s1.ui.set({refresh:true, tabno:tabno, viewno:0}).now();

    let phIsLa = this.uistate.get().proposal.s1.ui.ph_is_la;
    let savePaymentInfo=false;
    if (phIsLa) {
        savePaymentInfo = currentTab === 2 && tabno !== 2 && currentViewNo === 0 ? true : false;
    } else {
        savePaymentInfo = currentTab === 3 && tabno !== 3 && currentViewNo === 0 ? true : false;
    }
    // debugger;
    if (savePaymentInfo) {
        let values = this.refs.paymentinfo.refs.form.getValue();
        // our assumption is that is there are errors, we just skip the input as the user did not explicitly save
        if (values) {
            let doc = _.assign( {}, this.uistate.get().proposal.s1.paymentinfo.data, values );
            this.uistate.get().proposal.s1.paymentinfo.set({data:doc}).now();
        }
    }

    this.setState({offset: new Animated.Value(200)});

    return

  }
  changeTab(param) {
    // let tab = param.i;
    // console.log(TAG + "changeTab -----> param :", param);
  }

  gotoTab(tabno, param ) {
    // console.log("gotoTab, param", param);
    let newstate, currentTab, currentContact;

    currentTab = this.uistate.get().proposal.s1.ui.tabno;
    this.tabsbar.gotoTab(tabno);
  }
  alert(msg=null, title="Error") {
      let message = msg ? msg : 'Please fix the errors, before moving to the next view'
      AlertIOS.alert(
        title,
        message,
        [
          {text:'OK', onPress : (txt) => console.log(txt)}
        ],
        // 'default'
      );
  }
  gotoView(vno, param ) {
    // console.log("gotoTab, param", param);
    let {tabno, viewno} = this.uistate.get().proposal.s1.ui;

    this.uistate.get().proposal.s1.ui.set({refresh:false}).now();

    if ( tabno === 0 && viewno === 0 && vno !== 0) {
        // we are leaving the personal tab of the policy holder
        let values = this.refs.phbasic.refs.form.getValue();
        // our assumption is that is there are errors, we just skip the input as the user did not explicitly save
        if (values) {
            let doc = _.assign( {}, this.uistate.get().proposal.s1.ph.data, values );
            this.uistate.get().proposal.s1.ph.set({data:doc}).now();
        }
    }

    if ( tabno === 0 && viewno === 3 && vno !== 3) {
        // we are leaving the personal tab of the policy holder
        let values = this.refs.phpersonal.refs.form.getValue();
        // our assumption is that is there are errors, we just skip the input as the user did not explicitly save
        if (values) {
            let doc = _.assign( {}, this.uistate.get().proposal.s1.ph.data, values );
            this.uistate.get().proposal.s1.ph.set({data:doc}).now();
        }
    }

    let phIsLa = this.uistate.get().proposal.s1.ui.ph_is_la;
    let savePaymentInfo=false;
    if (phIsLa) {
        savePaymentInfo = tabno === 2 && vno !== 0 && viewno === 0 ? true : false;
    } else {
        savePaymentInfo = tabno === 3 && vno !== 0 && viewno === 0 ? true : false;
    }
    // debugger;
    if (savePaymentInfo) {
        let values = this.refs.paymentinfo.refs.form.getValue();
        // our assumption is that is there are errors, we just skip the input as the user did not explicitly save
        if (values) {
            let doc = _.assign( {}, this.uistate.get().proposal.s1.paymentinfo.data, values );
            this.uistate.get().proposal.s1.paymentinfo.set({data:doc}).now();
        }
    }
    this.uistate.get().proposal.s1.ui.set({refresh:true, viewno:vno});
  }
  phView(){
      let viewno = this.uistate.get().proposal.s1.ui.viewno;
      let menu = <View style={{flex:0.15}}>
                  <ProposalS1PhLaSidemenu ref="menu" fns={this.fns}/>
              </View>;
      let view;
      if (viewno === 0) {
          view = <ProposalS1PhBasicView ref="phbasic" fns={this.fns} />;
      } else if (viewno === 1) {
          view = <ProposalS1PhContactsView ref="phcontacts" fns={this.fns} />;
      } else if (viewno === 2) {
          view = <ProposalS1PhAddressView ref="phaddress" fns={this.fns} />;
      } else if (viewno === 3) {
          view = <ProposalS1PhPersonalView ref="phpersonal" fns={this.fns} />;
      } else if (viewno === 4) {
          view = <ProposalS1StandardView ref="phuw" fns={this.fns} />;
      } else if (viewno === 5) {
          view = <ProposalS1PhHealthView ref="phhealth" fns={this.fns} />;
      } else if (viewno === 6) {
          view = <ProposalS1PhFamilyHistoryView ref="phfamhist" fns={this.fns} />;
      }

      return (
          <View style={styles.container}>
            {menu}
            <View style={{flex:0.85}}>
                {view}
            </View>
          </View>
      );
  }
  additionalView(){
      let viewno = this.uistate.get().proposal.s1.ui.viewno;
      let menu = <View style={{flex:0.15}}>
                  <ProposalS1ExtraMenu ref="menu" fns={this.fns}/>
              </View>;
      let view;
      if (viewno === 0) {
          view = <ProposalS1ExtraPaymentinfoView ref="paymentinfo" fns={this.fns} />;
      } else if (viewno === 1) {
          view = <ProposalS1ExtraBeneficiaryView ref="beneficiary" fns={this.fns} />;
      } else if (viewno === 2) {
          view = <ProposalS1ExtraOwnerView ref="owner" fns={this.fns} />;
      } else if (viewno === 3) {
          view = <ProposalS1ExtraPoliciesView ref="policies" fns={this.fns} />;
      }
      return (
          <View style={styles.container}>
            {menu}
            <View style={{flex:0.85}}>
                {view}
            </View>
          </View>
      );
  }
  declarationView() {
      let viewno = this.uistate.get().proposal.s1.ui.viewno;
      let menu = <View style={{flex:0.15}}>
                  <ProposalS1DeclarationMenu ref="declmenu" fns={this.fns}/>
              </View>;
      let view;
      if (viewno === 0) {
          view = <ProposalS1AuthorityView ref="auth" fns={this.fns} />;
      } else if (viewno === 1) {
          view = <ProposalS1TemporaryView ref="tempProtect" fns={this.fns} />;
      } else if (viewno === 2) {
          view = <ProposalS1PdpaView ref="pdpa" fns={this.fns} />;
      } else if (viewno === 3) {
          view = <ProposalS1DocumentsView ref="docs" fns={this.fns} />;
      } else if (viewno === 4) {
          view = <ProposalS1SignatureView ref="signatures" fns={this.fns} />;
      }
      return (
          <View style={styles.container}>
            {menu}
            <View style={{flex:0.85}}>
                {view}
            </View>
          </View>
      );


  }
  agentReportView() {
      let view ;
      let viewno = this.uistate.get().proposal.s1.ui.viewno;

      if (viewno === 0) {
          view = <ProposalS1AgentReportView ref="agentReport" fns={this.fns} />
      }
      return (
        <View style={{flex:1}}>{view}</View>
      );
  }


  render() {
      let [phview, laview, productview, additionalview, declarationview, agentReportView] = [<View />,<View />,<View />, <View />,<View />, <View />];
      const { tabno } = this.uistate.get().proposal.s1.ui;
      const phIsLa = this.uistate.get().proposal.s1.ui.ph_is_la;
      const s1_ok = this.uistate.get().proposal.ui.section_1_ok;
      // decide on which view render based on tabno
    //   debugger;
      if (phIsLa) {
          if (tabno === 0) {
               phview = this.phView()
          } else if (tabno === 1) {
              productview = <ProposalS1PlanView ref="propslplan" fns={this.fns} />
          } else if (tabno === 2) {
              additionalview = this.additionalView()
          } else if (tabno === 3) {
              declarationview = this.declarationView();
          } else if (tabno === 4) {
              agentReportView = this.agentReportView()
          }
      } else {
          if (tabno === 0) {
              phview = this.phView()
          } else if (tabno === 1) {
              laview = <View><Text>Life Asssured</Text></View>
          } else if (tabno === 2) {
              productview = <ProposalS1PlanView ref="propslplan" fns={this.fns} />
          } else if (tabno === 3) {
              additionalview = this.additionalView()
          } else if (tabno === 4) {
              declarationView = this.declarationView()
          } else if (tabno === 5) {
              agentReportView = this.agentReportView()
          }
      }

      // had to resort to using if then else here, the scrollable tab control cannot accept null children
      // causes things to crash, return false, null or undefined does not work
      if (phIsLa) {
              return (
                  <View style={{height:dh-300}}>
                        <Animated.View style={[styles.container, { transform: [{translateY : this.state.offset }] }]} >


                          <ScrollableTabView ref="tabsview" onChangeTab={(param) => this.changeTab(param)} tabno={tabno}
                              initialPage={tabno} locked={true}
                              renderTabBar={(props) => <TabsBar  ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
                           >

                              <ScrollView tabLabel="Pol.Holder/Assured|user" style={styles.tabView} snapToInterval={300}
                              pagingEnabled={true}>
                                <View  style={styles.card}>
                                  {phview}
                                </View>

                              </ScrollView>

                              <ScrollView tabLabel="Product info|shield" style={styles.tabView}>
                                <View style={styles.card}>
                                  {productview}
                                </View>

                              </ScrollView>

                              <ScrollView tabLabel="Additional info|file-text" style={styles.tabView}>
                                <View style={styles.card}>
                                  {additionalview}
                                </View>
                              </ScrollView>

                              <ScrollView tabLabel="Declarations|stack-exchange" style={styles.tabView} >
                                <View style={styles.card}>
                                  {declarationview}
                                </View>
                              </ScrollView>

                              <ScrollView tabLabel="Agent report|clipboard" style={styles.tabView}>
                                <View style={styles.card}>
                                  {agentReportView}
                                </View>
                              </ScrollView>


                          </ScrollableTabView>


                        </Animated.View>

                        {/* put in an action button */}
                        {s1_ok ?
                        <View ref="actionButton" style={[styles.overlay],{left:((dw)+170), top:-(dh+20)}}>
                          <TouchableOpacity activeOpacity={1} onPress={()=> console.log("aaaa")}
                            style={{}}>
                            <View style={[styles.actionButton,
                              {
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: '#6dcedb',

                              }
                            ]}>
                            { /*
                            <Icon name={'check'} size={30} color={'green'} />
                            */}
                            <Text style={{color:'green'}}>OK</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        : <View />
                    }

            </View>
              )
      } else {
          return (
              <Animated.View style={[styles.container, { transform: [{translateY : this.state.offset }] }]} >
                <ScrollableTabView ref="tabsview" onChangeTab={(param) => this.changeTab(param)} tabno={tabno}
                    initialPage={tabno}
                    renderTabBar={(props) => <TabsBar  ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
                 >

                    <View tabLabel="Policyholder|user" style={styles.tabView}>
                      <View  style={styles.card}>
                        {phview}
                      </View>
                    </View>
                    <View tabLabel="Life assured|user" style={styles.tabView}>
                      <View  style={styles.card}>
                        {laview}
                      </View>
                    </View>
                    <View tabLabel="Product info|shield" style={styles.tabView}>
                      <View style={styles.card}>
                        {productview}
                      </View>
                    </View>

                    <View tabLabel="Additional info|file-text" style={styles.tabView}>
                      <View style={styles.card}>
                        {additionalview}
                      </View>
                    </View>

                    <ScrollView tabLabel="Declarations|stack-exchange" style={styles.tabView}>
                      <View style={styles.card}>
                        {declarationview}
                      </View>
                    </ScrollView>

                    <ScrollView tabLabel="Agent report|clipboard" style={styles.tabView}>
                      <View style={styles.card}>
                        {agentConfidentialView}
                      </View>
                    </ScrollView>


                </ScrollableTabView>
              </Animated.View>
          );

      }
    }
}


var styles = StyleSheet.create({
 // outerContainer: {
 //     flex: 1,
 //     flexDirection: "row"
 // },
 overlay: {
   position: 'absolute',
   bottom: 0,
   left: 0,
   right: 0,
   top: 0,
   backgroundColor: 'transparent',
 },
 actionButton: {
   justifyContent: 'center',
   alignItems: 'center',
   flexDirection: 'row',
   paddingTop: 2,
   shadowOpacity: 0.3,
   shadowOffset: {
     width: 0, height: 1,
   },
   shadowColor: '#444',
   shadowRadius: 1,
 },

 container: {
    flex: 1,
    marginTop: 0,
    flexDirection : 'row'
  },
  tabView: {
    // width: dw,
    padding: 2,
    margin: 2,
    // backgroundColor: 'rgba(0,0,0,0.01)',
    backgroundColor: 'transparent',
  },
  card: {
    borderWidth: 0,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 0,
    height: dh,
    padding: 0,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },

});
