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
import cblite from "../cblite"

import ProposalS2BaseMenu from "./proposal-s2-base-menu";
import ProposalS2StandardView from "./proposal-s2-standard";
import ProposalS2HealthView from "./proposal-s2-health";
import ProposalS2FamilyHistoryView from "./proposal-s2-family-history"
import ProposalS2DeclarationMenu from "./proposal-s2-declaration-menu";
import ProposalS2AuthorityView from "./proposal-s2-authority";
import ProposalS2TemporaryView from "./proposal-s2-temp-protect";
import ProposalS2PdpaView from "./proposal-s2-pdpa";
import ProposalS2DoctorView from "./proposal-s2-doctors";
import ProposalS2SignatureView from "./proposal-s2-signature";
var blobUtil = require('blob-util');

var dh = Dimensions.get('window').width;
var dw = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');
const TAG = "ProposalS2Home."
export default class ProposalS2Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        offset : new Animated.Value(0)
    };
    this.stateListener = null;
    this.uistate = require("../state");
    this.fns = Object.assign({
        gotoTab: this.gotoTab.bind(this),
        gotoView : this.gotoView.bind(this),
        saveProposal : this.saveProposal.bind(this)
    }, props.fns)
    // this.loadCurrentProposal()
  }

  componentWillMount(){
    //   console.log(TAG + "componentWillMount --->");
      this.loadCurrentProposal()
  }
  componentWillReceiveProps(props){
      this.defineListener()
      let { tabno, viewno } = this.uistate.get().proposal.s2.ui;
    //   if (tabno === 3 && viewno === 3) {
    //       debugger;
    //   }
    //   let reload = this.uistate.get().proposal.s2.ui.reload_proposal;
    //   if (reload) {
    //       this.loadCurrentProposal()
    //   }
      return
  }

  loadCurrentProposal() {
      // no need to re-read proposal, just get it from the uistate from s1
    // debugger;
    let   doc = {},
          newdoc = {},
          proposal = _.assign({}, this.uistate.get().proposal.s2.ui.proposal);


      if (proposal._id) {
          doc.s2 = {}
          doc.s2.base = _.assign({ questions : {}  },proposal.base);
          doc.s2.health = _.assign({questions : {} },proposal.health);
          doc.s2.family_hist = _.assign({ questions: {} },proposal.family_hist);
          doc.s2.pdpa = _.assign({ questions: {} },proposal.pdpa);
          doc.s2.doctor = _.assign({ questions: {} },proposal.doctor);
          doc.s2.signature = _.assign({} , proposal.signature );

          // ::TODO:: check if we have attachments, if we do have them, then loading them async

          //debugger;
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
                  this.uistate.get().proposal.s2.signature.set({photos:photos}); // load up into the app state
              })
              .catch((err) =>{
                  console.log("Unable to load photos", err);
                  self.alert("Unable to load photos : " + err)
              })
          }



          let currentUi = this.uistate.get().proposal.s2.ui;
          // load the yesno answers into the ui section for base
          if (proposal.base && proposal.base.questions) {
              let yesno = _.map(_.keys(proposal.base.questions), (q) => /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
              let stored = {}
              _.forEach(yesno, (k) => { stored[k] = proposal.base.questions[k] });
              currentUi = _.assign({}, currentUi, stored);
          } else {
              let yesno = _.map(_.keys(this.uistate.get().proposal.s2_defaults.base_questions), (q) =>
                            /^q\d+_yesno$/.test(q) ? q : null).filter((q) => q);
                let stored = {}
                _.forEach(yesno, (k) => { stored[k] = false });
                currentUi = _.assign({}, currentUi, stored);
          }

          // handle the base menu items -- look at the current ui
          let items = _.assign([], currentUi.base_menu_items);
          if (! _.isEmpty(doc.s2.doctor.questions)) {
              let pos = items.indexOf('Doctors');
              if (pos < 0) {
                  items.push('Doctors');
              }
          }
          currentUi.base_menu_items = items;

          let ph_is_la = proposal.la.name ? false : true ; // if we had saved the la name , then diff from ph
          let { tabno, viewno } = this.uistate.get().proposal.s2.ui;
          if (tabno === 3 && viewno === 3) {
            //   debugger;
              // preserve the tab & view as we are probably returning from signature page
              doc.s2.ui = _.assign({},currentUi, {refresh:false, reload_proposal: false, ph_is_la : ph_is_la });
          } else {
              doc.s2.ui = _.assign({},currentUi, {refresh:false, tabno:0, viewno:0, reload_proposal: false, ph_is_la : ph_is_la });
          }
          let section_info = {
              current_section : 2,
              section_1_ok : true, //must be since we are in section 2
              section_2_ok : proposal.status === 'S2-OK' || proposal.status === 'S3-OK' ? true : false,
              section_3_ok : proposal.status === 'S3-OK' ? true : false
          }
          this.uistate.get().proposal.ui.set(section_info);
          this.uistate.get().proposal.set({s2:doc.s2}).now();
          // more work later, depends on structure of the uistate to hold the da
      } else {
         this.alert("Unable to find proposal to load")
         return
      }
  }

  saveProposal(){

    let   proposal = this.uistate.get().proposal.s2.ui.proposal,
          s2 = this.uistate.get().proposal.s2.toJS(),
          doc = {};

      doc = _.assign({}, proposal);
      doc.base = _.assign({}, s2.base);
      doc.health = _.assign({},s2.health);
      doc.family_hist = _.assign({}, s2.family_hist);
      doc.pdpa = _.assign({}, s2.pdpa);
      doc.doctor = _.assign({}, s2.doctor);
    //   doc.signature = _.assign({}, s2.signature) ; // we store the photos separately as attachments
      doc.signature = _.assign({}, _.omit(s2.signature,['photos'])) ; // we store the photos separately as attachments

      doc.lastModified = new Date();
      // check on the status of things for s2, must have answered, base questions, health questions, and family hist
      if ( s2.base.questions.length > 0 && s2.health.questions.length > 0 && s2.family_hist.questions.length > 0) {
          doc.status = 'S2-OK'
      } // else no change in the status, whatever it was , probably S1-OK

      // 30 Mar 2016 -- extra code to handle attachements for the photos
      // for testing create something in photos
    //   s2.signature.photos = {
    //       "ph.txt" : "some simple text to test attachments"
    //   }
    //   delete doc._attachments;


    
      cblite.updateDocument(doc, doc._rev).then( (res) => {
          if (res.status === 400) {
              self.alert("Error in saving..." + res.error);
              return;
          }
          let updated = _.assign({}, doc, {'_rev': res.rev, '_id' : res.id } );

          var promises = []
          if (! _.isEmpty(s2.signature.photos)) {
                doc._attachments = {}
                _.forOwn(s2.signature.photos, (photo,key) => {
                    let att = photo; // photo.split('base64')[1];
                    promises.push(cblite.saveAttachment(updated._id, updated._rev, key, att) );
                })
          }
          if (promises.length === 0 ) {
              promises.push(new Promise((resolve,reject) => { resolve({ok:true} ) } ));
          }
          Promise.all(promises).then( (rows) => {
              console.log(TAG+"result from saving attachments", rows);
              if (updated.status === 'S2-OK' || updated.status === 'S3-OK') {
                  this.uistate.get().proposal.ui.set({section_2_ok: true}).now()
              } else {
                  this.uistate.get().proposal.ui.set({section_2_ok: false}).now()
              }
              this.uistate.get().proposal.s2.ui.set({refresh:true}).now()
              self.alert("Proposal information was saved", "Information")
          });
      })
      .catch((err) => {
          console.log("Error in updating", err)
          this.alert("Error in saving the proposal :" + err)
      })


    //   delete doc._attachments; // testing

  }

  defineListener(){
      if (this.stateListener) {
          this.stateListener.off()
      }
      this.stateListener = this.uistate.get().proposal.s2.getListener(); // listen only on s1
      let fn = (data) => {
        //   console.log("propsal-s2-home.componentDidMount ---> data.ui", data.ui)
          if (data.ui.refresh) {
            //   console.log(TAG+"componentDidMount ---> Refreshing", data)
              this.forceUpdate();
          }
      }
      this.stateListener.on("update",fn);

  }
  componentDidMount(){
      this.defineListener()
  }
  componentWillUnmount() {
      this.stateListener.off('update'); // clean up
  }
  componentDidUpdate(lastProps, lastState) {
      Animated.timing(this.state.offset, {
        duration: 500,
        toValue: 0
      }).start();
  }

  tabPressed(tabno, text){
    // console.log(TAG+"tabPressed ---------> tabno", tabno);
    let currentTab = this.uistate.get().proposal.s2.ui.tabno;
    this.uistate.get().proposal.s2.ui.set({refresh:true, tabno:tabno, viewno:0}).now();
    this.setState({offset: new Animated.Value(dh/2)});

    return

  }
  changeTab(param) {
    // let tab = param.i;
    // console.log(TAG + "changeTab -----> param :", param);
  }

  gotoTab(tabno, param ) {
    // console.log("gotoTab, param", param);
    let newstate, currentTab, currentContact;

    currentTab = this.uistate.get().proposal.s2.ui.tabno;

    this.uistate.get().proposal.s2.ui.set({refresh:true, tabno:tabno, viewno:0}).now();
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
    let {tabno, viewno} = this.uistate.get().proposal.s2.ui;
    this.uistate.get().proposal.s2.ui.set({refresh:false}).now();

    if ( tabno === 0 && viewno === 0 && vno !== 0) {
        // // we are leaving the personal tab of the policy holder
        // let values = this.refs.phbasic.refs.form.getValue();
        // // our assumption is that is there are errors, we just skip the input as the user did not explicitly save
        // if (values) {
        //     let doc = _.assign( {}, this.uistate.get().proposal.s1.ph.data, values );
        //     this.uistate.get().proposal.s1.ph.set({data:doc}).now();
        // }
    }

    if ( tabno === 3 && viewno === 3 && vno !== 3) {
    }

    this.uistate.get().proposal.s2.ui.set({refresh:true, viewno:vno}).now();

  }
  baseView(){
      let viewno = this.uistate.get().proposal.s2.ui.viewno;
      //   <ProposalS1PhLaSidemenu ref="menu" fns={this.fns}/>
      let menu = <View style={{flex:0.15}}>
                    <ProposalS2BaseMenu ref="basemenu" fns={this.fns} />
                 </View>;
      let view;
      if (viewno === 0) {
          view = <ProposalS2StandardView ref="s2standard" fns={this.fns} />
      } else {
          // for any items other than standard, we have to look at the menu items
          let menuitems = _.assign([], this.uistate.get().proposal.s2.ui.base_menu_items ),
              item = menuitems[viewno];
          if (item === 'Doctors') {
              view = <ProposalS2DoctorView ref="s2doctor" fns={this.fns} />
          }

      }
      return (
          <View style={[styles.container,{padding:0, margin:0}]}>
            {menu}
            <View style={{flex:0.85,paddingBottom:0,marginBottom:0}}>
                {view}
            </View>
          </View>
      );
  }
  healthView(){
      let viewno = this.uistate.get().proposal.s2.ui.viewno;
     let menu = <View />
      let view;
      if (viewno === 0) {
          view = <ProposalS2HealthView ref="s2health" fns={this.fns} />
      }
      return (
          <View style={[styles.container,{padding:0, margin:0}]}>
            {menu}
            <View style={{flex:1,paddingBottom:0,marginBottom:0}}>
                {view}
            </View>
          </View>
      );
  }
  familyHistView(){
      let viewno = this.uistate.get().proposal.s2.ui.viewno;
     let menu = <View />
      let view;
      if (viewno === 0) {
          view = <ProposalS2FamilyHistoryView ref="s2family" fns={this.fns} />
      }
      return (
          <View style={[styles.container,{padding:0, margin:0}]}>
            {menu}
            <View style={{flex:1,paddingBottom:0,marginBottom:0}}>
                {view}
            </View>
          </View>
      );
  }
  declarationView(){
      let viewno = this.uistate.get().proposal.s2.ui.viewno;
      let menu = <View style={{flex:0.15}}>
                  <ProposalS2DeclarationMenu ref="basemenu" fns={this.fns} />
               </View>;
      let view;
      if (viewno === 0) {
          view = <ProposalS2AuthorityView ref="s2authority" fns={this.fns} />
      } else if (viewno === 1) {
          view = <ProposalS2TemporaryView ref="s2temp" fns={this.fns} />

      } else if (viewno === 2) {
          view = <ProposalS2PdpaView ref="s2temp" fns={this.fns} />
      } else if (viewno === 3){
          view = <ProposalS2SignatureView ref="signature" fns={this.fns} />
      }

      return (
          <View style={[styles.container,{padding:0, margin:0}]}>
            {menu}
            <View style={{flex:1,paddingBottom:0,marginBottom:0}}>
                {view}
            </View>
          </View>
      );
  }

  render() {
      let [baseview, healthview, familyview, declarationview] = [<View />, <View />,<View />, <View />];
      const { tabno, ph_is_la } = this.uistate.get().proposal.s2.ui;
      const s3_ok = this.uistate.get().proposal.ui.section_3_ok;
    //   console.log(TAG+"render---> ****** tabno",tabno, this.uistate.get().proposal.s2.ui.base_menu_items);
    //   debugger;
      // decide on which view render based on tabno

      if (tabno === 0) {
               baseview = this.baseView()
      } else if (tabno === 1) {
              healthview = this.healthView()
      } else if (tabno === 2) {
              familyview = this.familyHistView()
      } else if (tabno === 3) {
              declarationview = this.declarationView()
      }
      return (
              <View style={{height:dh-400}}>
                    <Animated.View style={[styles.container, {height:dh-350, transform: [{translateY : this.state.offset }] }]} >
                      <ScrollableTabView ref="tabsview" onChangeTab={(param) => this.changeTab(param)} tabno={tabno}
                          initialPage={tabno} locked={true}
                          renderTabBar={(props) => <TabsBar  ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
                       >

                          <ScrollView tabLabel="Base form|user-md" style={[styles.tabView]}>
                            <View  style={styles.card}>
                              {baseview}
                            </View>
                          </ScrollView>
                          <ScrollView tabLabel="Health|heartbeat" style={styles.tabView}>
                            <View style={styles.card}>
                              {healthview}
                            </View>
                          </ScrollView>

                          <ScrollView tabLabel="Family History|street-view" style={styles.tabView}>
                            <View style={styles.card}>
                              {familyview}
                            </View>
                          </ScrollView>

                          <ScrollView tabLabel="Declarations|stack-exchange" style={styles.tabView}>
                            <View style={styles.card}>
                              {declarationview}
                            </View>
                          </ScrollView>

                      </ScrollableTabView>
                    </Animated.View>

                    {/* put in an action button */}
                    {s3_ok ?
                    <View ref="actionButton" style={[styles.overlay],{left:((dw)+170), top:-(dh+60)}}>
                      <TouchableOpacity activeOpacity={1} onPress={()=> console.log("aaaa")}
                        style={{}}>
                        <View style={[styles.actionButton,
                          {
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: '#6dcedb',

                          }
                        ]}>
                        <Text style={{color:'green'}}>OK</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    : <View />
                }

            </View>
        )
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
