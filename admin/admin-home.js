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
import ServerConfigView from "./server-config";
import UserConfigView from "./user-config";

import cblite from "../cblite"

var dh = Dimensions.get('window').width;
var dw = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');

const TAG="AdminHome.";
export default class AdminHome extends React.Component {
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
        saveConfig : this.saveConfig.bind(this)
    }, props.fns)
    this.loadConfig()

  }

  componentWillReceiveProps(props){
      this.loadConfig()
  }

  loadConfig() {

    //   debugger;
      if (! this.uistate.get().admin.ui.loadConfig) { return }

      let currentConfig = this.uistate.get().admin.ui.currentConfig;
      let state = this.uistate.get()
      let serverDefaults = _.assign({}, state.admin_defaults.serverConfig);
      let userDefaults =  _.assign({}, state.admin_defaults.userConfig);

      // in case the currentConfig is not set, use the defaults
      let userConfig = _.assign({}, userDefaults, currentConfig.userConfig),
          serverConfig = _.assign({}, serverDefaults, currentConfig.serverConfig);

      this.uistate.get().admin.set({userConfig: { data: userConfig }, serverConfig: { data : serverConfig} }).now();
      this.uistate.get().admin.ui.set({loadConfig : false, refresh : false, tabno : 0, viewno : 0 }).now() ; // already loaded, so no need to reload
  }

  saveConfig(){

        let admin = this.uistate.get().admin,
            doc = _.assign({}, admin.ui.currentConfig); // starting point is the loaded config

        // updated information
        doc.userConfig = _.assign({} , admin.userConfig.data );
        doc.serverConfig = _.assign({}, admin.serverConfig.data );

        doc.doctype = "config" ; // important for making sure of the document type
        doc.channels = ['sp'];
        doc.owner = 'sp'; // this should be removed once we have the agent log in

        let self  = this;
        let updated;
        if (doc._rev) {
          cblite.updateDocument(doc, doc._rev ).then( (res) => {
              if (res.ok) {
                    self.alert("Configuration information was successfully saved", "Info");
                    updated = _.assign({}, doc, {'_rev': res.rev, '_id' : res.id } );
                    this.uistate.get().admin.ui.set({loadConfig:true, refresh: true, currentConfig: updated});

              } else {
                  self.alert("Unable to save the current contact" + res );
              }
          })
          .catch((err) => console.log("Error in updating", err))
        } else {
          cblite.createDocumentWithKey( doc, 'SP-CONFIG').then( (res) => {
              if (res.ok) {
                  self.alert("Configuration information was successfully saved", "Info");
                  updated = _.assign({}, doc, {'_rev': res.rev, '_id' : res.id } );
                  this.uistate.get().admin.ui.set({loadConfig:true, refresh: true, currentConfig: updated });
              } else {
                  self.alert("Unable to save the current contact" + res );
              }
          })
          .catch((err) => console.log("Error in updating", err))
        }
  }

  componentDidMount(){
    this.stateListener = this.uistate.get().admin.getListener();
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

    let currentTabno = this.uistate.get().admin.ui.tabno;
    // can do some checking here before going to the new requested tab
    if (currentTabno === 0 && tabno !== 0) {
        // leaving serverConfig
        let values = this.refs.serverConfig.refs.form.getValue();
        if (!values) {
            let error = this.refs.serverConfig.refs.form.validate();
            // this.refs.serverConfig.refs.form.refs.input.refs.serverUrl.validate();
            let msgs = error.errors.map( (err) => '[' + err.path[0] + '] :' + err.message) ,
                msg = msgs.join(". ");
            console.log("errors in serverConfig", error)
            this.alert("Please fix errors :" + msg );
            return false
        }
        this.uistate.get().admin.serverConfig.set({data: values}).now();

        // let doc = Object.assign( {}, this.uistate.get().admin.serverConfig.data, values );
        // this.uistate.get().admin.serverConfig.set({data:doc}).now();

    }
    if (currentTabno === 1 && tabno !== 1) {
        // leaving serverConfig
        let values = this.refs.userConfig.refs.form.getValue();
        if (!values) {
            let error = this.refs.userConfig.refs.form.validate();
            console.log("errors in userConfig", error)
            this.alert("Please fix errors (red)");
            return false
        }
        this.uistate.get().admin.userConfig.set({data: values}).now();
    }

    this.uistate.get().admin.ui.set({tabno:tabno, viewno:0, refresh: true}).now();
    this.setState({offset: new Animated.Value(dh)});

    return

  }
  gotoTab(tabno, param ) {
    let newstate, currentTabno, currentContact;

    currentTabno = this.uistate.get().admin.ui.tabno;

    this.tabsbar.gotoTab(tabno);
  }
  alert(msg=null, type) {
      let message = msg ? msg : 'Please fix the errors, before moving to the next view'
      let etype = type ? type : 'Error'
      AlertIOS.alert(
        etype,
        message,
        [
            {text:'OK'}
        ],
      );
  }
  gotoView(viewno, param ) {
    // console.log("gotoTab, param", param);
    let newstate, currentView;
    currentView = this.uistate.get().admin.ui.viewno;

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

    this.uistate.get().admin.ui.set({viewno:viewno, refresh:true}).now();
  }

  serverView(){
      let viewno = this.uistate.get().admin.ui.viewno;
      return <ServerConfigView ref="serverConfig" fns={this.fns} />;
  }
  userView(){
      let viewno = this.uistate.get().admin.ui.viewno; // so we have quote tab and now get the view no
      // for quote there is only 1 view i.e. the contact-quote-list view
      console.log(TAG+"userView....")
      return <UserConfigView ref="userConfig" fns={this.fns} />;
  }

  render() {
      let [serverView, userView] = [<View />];
      const { tabno } = this.uistate.get().admin.ui;

      if (tabno === 0) {
          serverView = this.serverView();
      } else if (tabno === 1) {
          userView = this.userView();
      }
      return (

          <View style={{height:dh-400}}>
                <Animated.View style={[styles.container, { height:dh-350, transform: [{translateY : this.state.offset }] }]} >
                  <ScrollableTabView ref="tabsview"  tabno={tabno}
                      initialPage={tabno} locked={true} tabBarPosition="top" style={{}}
                      renderTabBar={(props) => <TabsBar  tabno={tabno} ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
                   >

                      <View tabLabel="Server|gear" style={styles.tabView}>
                        <View  style={styles.card}>
                          {serverView}
                        </View>
                      </View>

                      <View tabLabel="User|user" style={styles.tabView}>
                        <View style={styles.card}>
                          {userView}
                        </View>
                      </View>

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
