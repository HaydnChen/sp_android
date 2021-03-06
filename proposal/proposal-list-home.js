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
import ProposalList from "./proposal-list-view";
import ProposalListSearch from "./proposal-list-search";
var dh = Dimensions.get('window').width;
var dw = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');

const TAG = "ProposalListHome."
export default class ProposalListHome extends React.Component {
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
    this.fns = Object.assign(fns, props.fns)
  }

  componentDidMount(){
    this.stateListener = this.uistate.get().proposal.getListener();
    let fn = (data) => this.forceUpdate() ;
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
    let currentTabno = this.uistate.get().proposal_list.ui.tabno;

    this.uistate.get().proposal_list.ui.set({tabno:tabno}).now();
    this.setState({offset: new Animated.Value(dh/2)});

    return

  }
  // changeTab(param) {
  //   let tab = param.i;
  //   // console.log("quoteView.changeTab ---> tab :", tab);
  // }

  gotoTab(nextTabno, param ) {
    // console.log("gotoTab, param", param);
    let { tabno, proposal_id} = this.uistate.get().proposal_list.ui;

    this.tabsbar.gotoTab(nextTabno);
  }

  render() {
      let [listview,searchview] = [null, null];
      const { tabno } = this.uistate.get().proposal_list.ui;

      // decide on which view render based on tabno
      if (tabno === 0) {
          listview = <ProposalList ref="proplist" fns={this.fns} />
      } else if (tabno === 1) {
          searchview = <ProposalListSearch ref="propsearch" fns={this.fns} />
      }
      return (
        <Animated.View style={[styles.container, { transform: [{translateY : this.state.offset }] }]} >

          <ScrollableTabView ref="tabsview" onChangeTab={(param) => console.log("changeTab",param)} tabno={tabno}
              initialPage={tabno} locked={true}
              renderTabBar={(props) => <TabsBar  ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
           >

              <ScrollView tabLabel="Proposals|file-text" style={styles.tabView}>
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
