'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Easing,
  ListView,
  Image,
  TouchableHighlight,
  TouchableOpacity
} = React

import _ from "lodash"
var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');
const TAG = "ProposalS2BaseMenu.";
export default class ProposalS2BaseMenu extends React.Component {
    constructor(props){
      super(props);
    //   let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.uistate = require('../state')
      this.state = {
            // dataSource: ds.cloneWithRows(this.sideMenuRows() ),
      }
      this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.closeFn = null;
    }
    sideMenuRows(){
        let items = _.assign([],this.uistate.get().proposal.s2.ui.base_menu_items);
        return items
    }
    renderRow(rowData, sectionId, rowId, viewno) {
    //   console.log(TAG + "renderRow", viewno);
      var iconNames = ["medkit","ambulance","plus-square","heart-o","wheelchair","hospital-o"];
      var index = parseInt(rowId) % 6;
      var iconName = iconNames[index];
      var rowno = parseInt(rowId);
      return (
        <TouchableOpacity onPress={() => this.pressRow(rowId)}>
          <View>
            <View style={viewno === rowno ? styles.currow : styles.row}>
            <Icon style={styles.icon} name={iconName} size={30} color={"#3fcdfe"} />
            <Text style={styles.text}>
              {rowData}
            </Text>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableOpacity>
      );
    }
    pressRow(rowId) {
    //   console.log(TAG + "pressRow --> rowId", rowId, typeof rowId);
      let rowid = parseInt(rowId);
      this.props.fns.gotoView(rowid);
      let rows = this.sideMenuRows(); //_.clone(this.sideMenuRows(),true);
      this.uistate.get().proposal.s2.ui.set({refresh:true}).now();
    //   var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //   this.setState({
    //       dataSource: ds.cloneWithRows(rows),
    //   })

    }

    render() {
    //   console.log(TAG + "render ----> uistate", this.uistate.get().proposal.s2.ui);
      let rows = _.assign([],this.uistate.get().proposal.s2.ui.base_menu_items);
    //   let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      let ds = this.ds.cloneWithRows(rows);
      let viewno = this.uistate.get().proposal.s2.ui.viewno;
      return(
        <View>
            <View style={{flex:1,backgroundColor: 'transparent'}}>
              <ListView
                  dataSource={ds}
                  renderRow={ (rowData,sectionId,rowId) => this.renderRow(rowData,sectionId,rowId, viewno) }
                />
            </View>
        </View>

      );
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // center: {
  //   flex: 1,
  //   backgroundColor: '#FFFFFF',
  // },
  separator: {
    height: 2,
    // backgroundColor: '#CCCCCC',
    backgroundColor: 'transparent',
  },
  icon: {
    paddingRight: 5,
    // height: 64,
    // height: 50,
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f6feff',
  },
  currow: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f6eeff',
  },

  text: {
    flex: 1,
  },
  // left: {
  //   position: 'absolute',
  //   top:0,
  //   left:0,
  //   bottom:0,
  //   right: 0,
  //   backgroundColor: '#FFFFFF',
  // },
})
