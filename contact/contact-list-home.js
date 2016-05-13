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
import ContactList from "./contact-list-view";
import ContactListSearch from "./contact-list-search";
import { getColl, getDb } from "../db";

var dh = Dimensions.get('window').width;
var dw = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');

export default class ContactListHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        offset : new Animated.Value(0)
    };
    this.mode = 'edit';
    this.stateListener = null;
    this.uistate = require("../state");

    let fns = {
      gotoTab : this.gotoTab.bind(this),
    }
    // this.fns = _.extend({},fns, props.fns)
    this.fns = Object.assign(fns, props.fns)
  }

  componentDidMount(){
    this.stateListener = this.uistate.get().contact.getListener();
    let fn = (data) => this.forceUpdate() ;
    this.stateListener.on('update', _.debounce(fn , 100) );

  }
  componentWillUnmount() {
      this.stateListener.off('update'); // clean up
  }
  componentDidUpdate(lastProps, lastState) {
      Animated.timing(this.state.offset, {
        duration: 800,
        toValue: 0
      }).start();
  }

  tabPressed(tabno, text){
    let currentTabno = this.uistate.get().contact.list_tabno;
    // can do some checking here before going to the new requested tab

    this.uistate.get().contact.set({list_tabno:tabno}).now();
    this.setState({offset: new Animated.Value(dh)});

    return

  }
  // changeTab(param) {
  //   let tab = param.i;
  //   // console.log("quoteView.changeTab ---> tab :", tab);
  // }

  gotoTab(tabno, param ) {
    // console.log("gotoTab, param", param);
    let newstate, currentTab, currentContact;

    currentTab = this.uistate.get().contact.list_tabno;
    currentContact = this.uistate.get().quote.current_contact;

    //this.uistate.get().contact.set({list_tabno:tabno}).now();
    this.tabsbar.gotoTab(tabno);
  }

  render() {
      let [listview,searchview] = [null, null];
      const { list_tabno } = this.uistate.get().contact;

      // decide on which view render based on tabno
      if (list_tabno === 0) {
          listview = <ContactList ref="list" fns={this.fns} />
      } else if (list_tabno === 1) {
          searchview = <ContactListSearch ref="search" fns={this.fns} />
      }
      return (
        <Animated.View style={[styles.container, { transform: [{translateY : this.state.offset }] }]} >

          <ScrollableTabView ref="tabsview" onChangeTab={(param) => console.log("changeTab",param)} tabno={list_tabno}
              initialPage={list_tabno} locked={true}
              renderTabBar={(props) => <TabsBar  ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
           >

              <ScrollView tabLabel="Contacts|user" style={styles.tabView}>
                <View  style={styles.card}>
                  {listview}
                </View>
              </ScrollView>

              <View tabLabel="Search|search" style={styles.tabView}>
                <View style={styles.card}>
                  {searchview}
                </View>
              </View>

          </ScrollableTabView>

        </Animated.View>
      )
    }
}


var styles = StyleSheet.create({
 // outerContainer: {
 //     flex: 1,
 //     flexDirection: "row"
 // },
 container: {
    flex: 0.8,
    marginTop: 10,
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
