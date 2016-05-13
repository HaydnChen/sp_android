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
import FnaPeopleView from "./fna-people";
import FnaProtectionView from "./fna-protection-needs";
import FnaOthersView from "./fna-other-needs";
import FnaRiskProfileView from "./fna-risk-profile";
import FnaRecommendationView from "./fna-recommendation";

import cblite from "../cblite"

var dh = Dimensions.get('window').width;
var dw = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');

const TAG="FnaHome.";
export default class FnaHome extends React.Component {
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
        saveFna : this.saveFna.bind(this)
    }, props.fns)
    this.loadFna()

  }

  componentWillReceiveProps(props){
      this.loadFna()
  }

  loadFna() {

    //   debugger;
      if (! this.uistate.get().fna.ui.loadFna) { return }

      this.uistate.get().fna.ui.set({refresh: false}).now();

      let currentFna = this.uistate.get().fna.ui.currentFna;
      if (currentFna) {
          this.uistate.get().fna.personalData.set({data: currentFna.lifeAssuredData}).now();
          this.uistate.get().fna.personalData.set({people:currentFna.people}).now();
          this.uistate.get().fna.protectionNeeds.set({data: currentFna.protectionNeeds}).now();
          this.uistate.get().fna.otherNeeds.set({data: currentFna.otherNeeds}).now();
          this.uistate.get().fna.riskProfile.set({data: currentFna.riskProfile}).now();
          this.uistate.get().fna.recommendations.set({data: currentFna.recommendations}).now();
      }

      this.uistate.get().fna.ui.set({refresh: true, reloadFna: false, tabno : 0, viewno : 0 }).now();

  }

  saveFna(){

        let fna = this.uistate.get().fna,
            contact = this.uistate.get().fna.ui.currentContact,
            doc = _.assign({}, fna.ui.currentFna); // starting point is the loaded fna

        // to do -- have to decide on how to store the data
        doc.lifeAssuredData = _.assign({} ,fna.personalData.data );
        doc.people = _.assign([], fna.personalData.people)
        // data on protection Needs
        doc.protectionNeeds = fna.protectionNeeds.data;
        doc.otherNeeds = fna.otherNeeds.data;
        doc.riskProfile = fna.riskProfile.data;
        doc.recommendations = fna.recommendations.data;

        doc.contactId = contact._id;
        doc.contactName = contact.name;
        if (!doc._rev) {
            doc.creationDate = new Date();
        }
        doc.lastModified = new Date();

        doc.doctype = "fna" ; // important for making sure of the document type
        doc.channels = ['sp'];
        doc.owner = 'sp'; // this should be removed once we have the agent log in

        let self  = this;
        let updated;
        if (doc._rev) {
          cblite.updateDocument(doc, doc._rev ).then( (res) => {
              if (res.ok) {
                    self.alert("FNA information was successfully saved", "Info");
                    updated = _.assign({}, doc, {'_rev': res.rev, '_id' : res.id } );
                    this.uistate.get().fna.ui.set({loadFna:true, refresh: true, currentFna: updated});

              } else {
                  self.alert("Unable to save the current FNA" + res );
              }
          })
          .catch((err) => console.log("Error in updating", err))
        } else {
          cblite.createDocument( doc ).then( (res) => {
              if (res.ok) {
                  self.alert("FNA information was successfully saved", "Info");
                  updated = _.assign({}, doc, {'_rev': res.rev, '_id' : res.id } );
                  this.uistate.get().fna.ui.set({loadFna:true, refresh: true, currentFna: updated });
              } else {
                  self.alert("Unable to save the current FNA" + res );
              }
          })
          .catch((err) => console.log("Error in updating", err))
        }
  }

  componentDidMount(){
    this.stateListener = this.uistate.get().fna.getListener();
    let fn = (data) => {
        if (data.ui.refresh) {
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
        duration: 500,
        toValue: 0
      }).start();
  }

  tabPressed(tabno, text){

    let currentTabno = this.uistate.get().fna.ui.tabno;
    // can do some checking here before going to the new requested tab
    // if (currentTabno === 0 && tabno !== 0) {
    //     // leaving 1st tab -- any validations ?
    //
    //     let values = this.refs.serverConfig.refs.form.getValue();
    //     if (!values) {
    //         let error = this.refs.serverConfig.refs.form.validate();
    //         // this.refs.serverConfig.refs.form.refs.input.refs.serverUrl.validate();
    //         let msgs = error.errors.map( (err) => '[' + err.path[0] + '] :' + err.message) ,
    //             msg = msgs.join(". ");
    //         console.log("errors in serverConfig", error)
    //         this.alert("Please fix errors :" + msg );
    //         return false
    //     }
    //     this.uistate.get().admin.serverConfig.set({data: values}).now();
    // }
    // if (currentTabno === 1 && tabno !== 1) {
    //     // leaving serverConfig
    //     let values = this.refs.userConfig.refs.form.getValue();
    //     if (!values) {
    //         let error = this.refs.userConfig.refs.form.validate();
    //         console.log("errors in userConfig", error)
    //         this.alert("Please fix errors (red)");
    //         return false
    //     }
    //     this.uistate.get().admin.userConfig.set({data: values}).now();
    // }

    this.uistate.get().fna.ui.set({tabno : tabno, viewno : 0, refresh: true, loadFna : false}).now();
    this.setState({offset: new Animated.Value(dh)});

    return

  }
  gotoTab(tabno, param ) {
    let newstate, currentTabno, currentContact;

    currentTabno = this.uistate.get().admin.ui.tabno;

    this.tabsbar.gotoTab(tabno);
  }
  alert(msg=null, type="Error") {
      let message = msg ? msg : 'Please fix the errors, before moving to the next view'
      AlertIOS.alert(
        type,
        message,
        [
            {text:'OK'}
        ],
      );
  }
  gotoView(viewno, param ) {
    // console.log("gotoTab, param", param);
    let newstate, currentView;
    currentView = this.uistate.get().fna.ui.viewno;

    // if (currentView === 0 && viewno !== 0) {
    //     // any chance to save the data ?
    //     let values = this.refs.serverConfig.refs.form.getValue();
    //     if (!values) {
    //         this.alert("Please fix the errors (red)")
    //         return
    //     }
    //     let doc = Object.assign( {}, this.uistate.get().admin.serverConfig.data, values );
    //     this.uistate.get().admin.serverConfig.set({data:doc}).now();
    // } else if (currentView === 3 && viewno !== 3) {
    //     let values = this.refs.userConfig.refs.form.getValue();
    //     if (!values) {
    //         this.alert("Please fix the errors (red)")
    //         return
    //     }
    //     let doc = Object.assign( {}, this.uistate.get().admin.userConfigdoc.data, values ); // update the values
    //     this.uistate.get().admin.userConfig.set({data:doc}).now();
    // }

    this.uistate.get().fna.ui.set({viewno:viewno, refresh:true, loadFna : false }).now();
  }

  personalView(){
      let viewno = this.uistate.get().fna.ui.viewno;
      return <FnaPeopleView ref="personaData" fns={this.fns} />;
  }
  protectionNeedsView(){
      let viewno = this.uistate.get().fna.ui.viewno;
      return <FnaProtectionView ref="protectionNeeds" fns={this.fns} />;
  }
  otherNeedsView(){
      let viewno = this.uistate.get().fna.ui.viewno;
      return <FnaOthersView ref="otherNeeds" fns={this.fns} />;
  }
  riskProfileView(){
      let viewno = this.uistate.get().fna.ui.viewno;
      return <FnaRiskProfileView ref="riskProfile" fns={this.fns} />;
  }
  recommendationsView(){
      let viewno = this.uistate.get().fna.ui.viewno;
      return <FnaRecommendationView ref="recommendation" fns={this.fns} />;
  }



  render() {
      let [personal, protectionNeeds, otherNeeds, riskProfile, recommendations] = [<View />,<View />,<View />,<View />,<View />];
      const { tabno } = this.uistate.get().fna.ui;

      if (tabno === 0) {
          personal = this.personalView();
      } else if (tabno === 1) {
          protectionNeeds = this.protectionNeedsView();
      } else if (tabno === 2) {
          otherNeeds = this.otherNeedsView();
      } else if (tabno === 3) {
          riskProfile = this.riskProfileView();
      } else if (tabno === 4) {
          recommendations = this.recommendationsView();
      }
      return (

          <View style={{height:dh-300}}>
                <Animated.View style={[styles.container, { height:dh-300, transform: [{translateY : this.state.offset }] }]} >
                  <ScrollableTabView ref="tabsview"  tabno={tabno}
                      initialPage={tabno} locked={true} tabBarPosition="top" style={{}}
                      renderTabBar={(props) => <TabsBar  tabno={tabno} ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
                   >

                      <ScrollView tabLabel="Personal Info.|users" style={styles.tabView}>
                        <View  style={styles.card}>
                          {personal}
                        </View>
                      </ScrollView>

                      <ScrollView tabLabel="Protection Needs|shield" style={styles.tabView}>
                        <View style={styles.card}>
                          {protectionNeeds}
                        </View>
                      </ScrollView>

                      <ScrollView tabLabel="Other Needs|th" style={styles.tabView}>
                        <View style={styles.card}>
                          {otherNeeds}
                        </View>
                      </ScrollView>

                      <ScrollView tabLabel="Risk Profile|dashboard" style={styles.tabView}>
                        <View style={styles.card}>
                          {riskProfile}
                        </View>
                      </ScrollView>

                      <ScrollView tabLabel="Recommendation|balance-scale" style={styles.tabView}>
                        <View style={styles.card}>
                          {recommendations}
                        </View>
                      </ScrollView>



                  </ScrollableTabView>

                </Animated.View>
            </View>

      )
    }
}


var styles = StyleSheet.create({
 container: {
    flex: 1,
    marginTop: 0,
    flexDirection : 'row'
  },
  tabView: {
    padding: 2,
    margin: 2,
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
