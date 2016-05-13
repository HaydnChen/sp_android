'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  Animated,
  ListView
} = React;

// var t = require('tcomb-form-native');
var Icon = require('react-native-vector-icons/Ionicons');
import ContactList from "./contactList";
import ContactDisplay from "./contactDisplay"
//import { getCollection, getColl, getDb } from "../db"
import { getColl, getDb } from "../db"

export default class ContactsView extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState(props);
      this.fns = {
        gotoListView : this.gotoListView.bind(this),
        gotoDetailView : this.gotoDetailView.bind(this),
        updateDS : this.updateDS.bind(this)
      }
      this.currentRow = {};
      // this.dataSource = props.dataSource;
    }
    getInitState(props) {
      // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {return r1 !== r2 } });
      // ds.cloneWithRows([])
      let ds = props.dataSource;
      return {
        showView :'list',
        mode : props.mode,
        //dataSource: ds
      }
    }
    gotoListView(refresh=false,doc,op){
      if (this.props.mode === 'add' || this.state.showView !== "list") {
        if (refresh) {
          this.updateDocAndRefresh(doc,op);

        } else {
          // next 2 calls are simulating a press of the tab bar
          console.log("Simulate pressing on a tab bar", this.props.mode);
          let tab = this.props.mode === 'add' ? 0 : this.props.tabno;
          this.setState({showView:"list"});
          this.props.tabfns.goContactHome(tab,{});
        }
      }

    }
    updateDocAndRefresh(doc,op) {
      let db = getDb(),
          coll = getColl("contacts");

          if (op === 'update') {
            coll.update(doc);
          } else if (op === 'insert'){
            coll.insert(doc);
          } else {
            coll.remove(doc);
          }
          coll.flushChanges();
          db.saveDatabase((status)=>{

            // let userlist = coll.find({}); // get all
            // let contacts = userlist.map((doc,index) => doc );
            // if (contacts.length === 0 && op !== 'insert') {
            //   contacts.push( {'name':'No contacts found'})
            // }

            // if (op === 'insert') {
            //     // debugger;
            //
            //     this.setState({
            //       // dataSource: this.props.dataSource.cloneWithRows(contacts),
            //       showView: "list"
            //
            //     });
            //     // this.props.tabfns.setDataSource(contacts);
            //     // this.props.tabfns.tabPressed(0);
            //     // this.props.tabsview.goToPage(0);
            //
            // } else {
            //   this.setState({
            //     // dataSource: this.props.dataSource.cloneWithRows(contacts),
            //     showView: "list"
            //   });
            //   this.props.tabfns.setDataSource(contacts);
            // }

              console.log("Simulate pressing on a tab bar after a SAVE", this.props.tabno);

              let tab = this.props.mode === 'add' ? 0 : this.props.tabno;
              this.setState({showView:"list"});
              this.props.tabfns.goContactHome(tab,{});

          });
    }
    gotoDetailView(row, mode='edit'){
      console.log("gotoDetailView", mode, this.state.showView);
      if (this.state.showView !== "detail") {
        this.currentRow = row;
        this.setState({showView:"detail"});
      }
      // this.props.tabsview.goToPage(0);
    }
    updateDS(rows){
      // console.log("contactsView.updateDS-->rows",rows, this.state);
      //let newdata = rows.slice();
      this.props.tabfns.setDataSource(rows);
    }

    render(){
      var view ;

      // console.log("contactsView.render, state, props :", this.state.showView, this.props.mode);
      let mode = this.props.mode ;
      if (mode === 'add' || this.state.showView === 'detail') {
        view = <ContactDisplay fns={this.fns} mode={mode} parentfns={this.props.fns} row={this.currentRow} ds={this.props.dataSource} />
      } else {
        view = <ContactList fns={this.fns} parentfns={this.props.fns} ds={this.props.dataSource} tabno={this.props.tabno}/>;
      }

      return (
        <View>
          {view}
        </View>
      );
    }
}
