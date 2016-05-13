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
} = React

var screenWidth = Dimensions.get('window').width;
var Icon = require('react-native-vector-icons/FontAwesome');

class SideMenu extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState();
      this.closeFn = null;
      // this.prepareIcons();
    }
    getInitState(){
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
        dataSource: ds.cloneWithRows(this.sideMenuRows() ),
      }
    }
    sideMenuRows(){
      return [
        "Home",
        "Contacts",
        "Quotation",
        "Proposal",
        "e-Submission",
        "Administration"
      ]
    }
    renderRow(rowData, sectionId, rowId) {
      // var imageSource = this.state.userIcon;
      // console.log("rowData, sectionId & rowId", rowData, sectionId, rowId, imageSource);

      var iconNames = ["home","user","calculator","file-text","wifi","navicon"];
      var iconName = iconNames[rowId];
      return (
        <TouchableHighlight onPress={() => this.pressRow(rowId)}>
          <View>
            <View style={styles.row}>
            <Icon style={styles.icon} name={iconName} size={30} color={"blue"} />
              <Text style={styles.text}>
                {rowData}
              </Text>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      );
    }
    pressRow(rowId) {
      console.log("SideMenu.pressRow --> rowId", rowId, typeof rowId);
      // debugger;
      //this.props.fns.parent.closeLeft();

      if (rowId === '0') {
        console.log("Navigate to home")
        this.props.fns.goHome();
      } else if (rowId === '1') {
        this.props.fns.gotoContacts();
      } else if (rowId === '2') {
        this.props.fns.gotoIllustration();
      }
    }

    render() {
      return(
        <View style={{flex:1,backgroundColor: '#F6F6F6'}}>
          <ListView
              dataSource={this.state.dataSource}
              renderRow={ (rowData,sectionId,rowId) => this.renderRow(rowData,sectionId,rowId) }
            />
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
    backgroundColor: '#CCCCCC',
  },
  icon: {
    paddingRight: 10,
    height: 64,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
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

module.exports = SideMenu;
