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
  ListView
} = React;

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabsBar from "../components/tabsBar";
import ContactList from "./contactList";
import ContactsView from "./contactsView";
import ContactSearch from "./contactSearch";
import { getColl, getDb } from "../db"

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/Ionicons');

var styles = StyleSheet.create({
 outerContainer: {
     flex: 1,
     flexDirection: "row"
 },
 // leftBar: {
 //     flex: 0.2,
 //     marginTop: 50
 // },
 container: {
    flex: 0.8,
    marginTop: 10,
  },
  tabView: {
    width: deviceWidth,
    padding: 0,
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 0,
    height: deviceHeight,
    padding: 0,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

export default class Contacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
    this.contactMode = 'edit';
    this.fns = Object.assign(
      {setDataSource:this.setDataSource.bind(this),goContactHome :this.goHome.bind(this)}, this.props.fns);
  }

  getInitState(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {return r1 !== r2 } });
    var dsFav = new ListView.DataSource({rowHasChanged: (r1, r2) => {return r1 !== r2 } });
    ds.cloneWithRows([]); // init to empty rows
    return {mode: 'edit', tabno: 0, dataSource : ds, favds : dsFav }
  }

  // componentDidMount(){
  //   let coll = getColl("contacts");
  //   let contacts = coll.find({});
  //   this.setState({dataSource:this.state.dataSource.cloneWithRows(contacts)});
  // }

  // setTabNumber(tabno){
  //   console.log("contacts.setTabNumber", tabno);
  //   this.setState({tabno:tabno})
  // }
  setDataSource(rows) {
      this.setState({dataSource:this.state.dataSource.cloneWithRows(rows)});
  }
  changeTab(param){
    // console.log("contacts.changedTab, pageno  ", param['i']);
    // this.setTabNumber(param['i']);
  }

  tabPressed(tabno, text){
    if (tabno === 0){
      let coll = getColl("contacts");
      let contacts = coll.find({});
      this.setState({
        dataSource : this.state.dataSource.cloneWithRows(contacts),
        tabno : tabno,
        mode : 'list',
      });
    } else if (tabno === 1) {
      let coll = getColl("contacts");
      let contacts = coll.find({favourite:true});
      this.setState({
        favds : this.state.dataSource.cloneWithRows(contacts),
        tabno : tabno,
        mode : 'fav'
      });

    } else if (tabno === 2){
      this.setState({
        tabno : tabno,
        mode : 'search'
      });
    } else {
      this.setState({mode:'add', tabno: tabno});
    }
  }

  goHome(tabno=0,filter) {

    let coll = getColl("contacts");
    // let filter = tabno == 0 ? {} : {favourite:true}
    let dscontacts = coll.find(filter);
    let favcontacts = coll.find({favourite:true})
    if (tabno === 1 ) {
      this.setState({
        tabno : tabno,
        mode : tabno === 0 ? 'list' : 'fav',
        favds : this.state.favds.cloneWithRows(favcontacts),
      });
    } else {
      this.setState({
        tabno : tabno,
        mode : tabno === 0 ? 'list' : 'fav',
      });
      // set this separately to force it to render correctly
      this.setState({
        dataSource : this.state.dataSource.cloneWithRows(dscontacts),
        // tabno : tabno,
        // mode : tabno === 0 ? 'list' : 'fav',
      });


    }

    setTimeout(()=>{
      // console.log("start gohome, tabno:",tabno,filter);
      this.refs.tabsview.goToPage(tabno);
      this.refs.tabsview.forceUpdate();
      this.tabsbar.setOpacity(tabno);
      // this.forceUpdate();
      // console.log("end gohome, tabno:",tabno,filter);
    },0);


  }

  render() {
      let editView, favView, addView, searchView;
      const {mode, tabno, dataSource, favds} = this.state;
      // console.log("contacts.render -->", this.state.mode, this.state.tabno, this.state.dataSource.rowIdentities[0]);

      if (mode === 'search') {
        searchView = <View><ContactSearch tabfns={this.fns} tabsview={this.refs.tabsview} mode={mode} tabno={tabno} /></View>
      } else if (mode === 'edit' || mode === 'list') {
        editView = <View><ContactsView  mode={mode} tabno={tabno}
          dataSource={dataSource} tabfns={this.fns} tabsview={this.refs.tabsview} /></View>
      } else if (mode === 'add') {
        addView = <ContactsView  mode={mode} tabno={tabno}
                  dataSource={dataSource} tabfns={this.fns} tabsview={this.refs.tabsview} />
      } else if (mode ==='fav') {
        favView = <View><ContactsView  mode={mode} tabno={tabno}
          dataSource={favds} tabfns={this.fns} tabsview={this.refs.tabsview} /></View>
      }

      //
      //
      //   contactView = (
      //     <ContactsView  mode={this.state.mode} tabno={this.state.tabno}
      //       dataSource={this.state.dataSource} tabfns={this.fns} tabsview={this.refs.tabsview} />
      //   )
      // }

      return (
        <View style={styles.container}>
          <ScrollableTabView ref="tabsview" onChangeTab={this.changeTab.bind(this)} tabno={this.state.tabno} initialPage={this.state.tabno}
              renderTabBar={(props) => <TabsBar  ref={(tb) => this.tabsbar=tb}
              onPress={this.tabPressed.bind(this)} />} >
          <ScrollView tabLabel="Contacts|users" style={styles.tabView}>
            <View style={styles.card}>
              {editView}
            </View>
          </ScrollView>

            <ScrollView tabLabel="Favourites|star" style={styles.tabView}>
              <View style={styles.card}>
                {favView}
              </View>
            </ScrollView>

            <ScrollView tabLabel="Search|search" style={styles.tabView}>
              <View style={styles.card}>
                {searchView}
              </View>
            </ScrollView>

            <ScrollView tabLabel="New Contact|user-plus" style={styles.tabView}>
              <View style={styles.card}>
                {addView}
              </View>
            </ScrollView>
          </ScrollableTabView>
        </View>
      )
    }
}
