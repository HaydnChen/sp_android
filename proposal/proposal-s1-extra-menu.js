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
const TAG = "ProposalS1ExtraMenu.";
export default class ProposalS1ExtraMenu extends React.Component {
    constructor(props){
      super(props);
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
            dataSource: ds.cloneWithRows(this.sideMenuRows() ),
      }
      this.closeFn = null;
      this.uistate = require('../state')
    }
    sideMenuRows(){
      return [
        "Payment Info",
        "Beneficiary",
        "Beneficial Owner",
        "Other Policies",
      ]
    }
    renderRow(rowData, sectionId, rowId, viewno) {
      console.log(TAG + "renderRow", viewno);
      var iconNames = ["inr","users","user-secret","files-o"];
      var iconName = iconNames[rowId];
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
      console.log(TAG + "pressRow --> rowId", rowId, typeof rowId);

      if (rowId === '0') {
        this.props.fns.gotoView(0);
      } else if (rowId === '1') {
          this.props.fns.gotoView(1);
      } else if (rowId === '2') {
          this.props.fns.gotoView(2);
      } else if (rowId === '3') {
          this.props.fns.gotoView(3);
      }
    //   this.uistate.get().contactinfo.set({viewno:parseInt(rowId)});
      let rows = this.sideMenuRows(); //_.clone(this.sideMenuRows(),true);
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      this.setState({
          dataSource: ds.cloneWithRows(rows),
      })

    }

    render() {
      let viewno = this.uistate.get().proposal.s1.ui.viewno;
      return(
        <View>
            <View style={{flex:1,backgroundColor: 'transparent'}}>
              <ListView
                  dataSource={this.state.dataSource}
                  renderRow={ (rowData,sectionId,rowId) => this.renderRow(rowData,sectionId,rowId, viewno) }
                />
            </View>
        </View>

      );
    }
} // end SideMenu class

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
