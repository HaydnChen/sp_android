'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Animated,
  ListView,
  ScrollView,
  NativeModules: {
    UIManager,
  },

} = React;



// var t = require('tcomb-form-native');
var Icon = require('react-native-vector-icons/FontAwesome');

import { getColl } from "../db"
var ActionButtonItem = require('../components/ActionButtonItem');

export default class ContactList extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState();
      this.pageY = 0;
      this.pageX = 0;
      this.selectedRows = [];
      this.allIcons = {};
    }

    componentDidMount() {
      let coll = getColl("contacts");
      let contacts = coll.find({});
      if (contacts.length === 0) {
        contacts.push( {'name':'No contacts found'})
      }
      this.props.fns.updateDS(contacts);


    }
    // componentWillReceiveProps(){
    //   const handle = React.findNodeHandle(this.refs.actionButton);
    //   setTimeout(() => {
    //     UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
    //       this.pageX = pageX;
    //       this.pageY = pageY;
    //       if (true) {
    //         console.log("willReceiveProps",x, y, width, height, pageX, pageY);
    //       }
    //     })
    //   });
    //
    //
    // }

    getInitState(){
      // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      return {
      }
    }
    setOpacity(rowId) {
      let icon = this.allIcons[rowId];
      let matches = this.selectedRows.filter((item) => item === rowId);
      if (matches.length === 1) {
        let index = this.selectedRows.indexOf(matches[0]);
        this.selectedRows.splice(index,1);
        icon.setNativeProps({style: {opacity: 1}});

      } else {
        this.selectedRows.push(rowId);
        icon.setNativeProps({style: {opacity: 0}});
      }
      // now change the opacity

      // console.log("selectedRow -->", this.selectedRows);
      // debugger;

    }

    componentDidUpdate(){
      // console.log("Component Did Update, selected rows", this.selectedRows);

    }
    renderRow(row, sectionId, rowId) {
      //console.log("render row of listview", row.name);
      let selected =
          <TouchableOpacity key={rowId} onPress={() => this.setOpacity(rowId)} style={[styles.tab]}>

            <Icon name={'check-square-o'} size={20} color='#3B5998' style={{width: 30, height: 30, position: 'absolute', top: 0, left: 10}}
                  ref={(icon) => {  }}/>

            <Icon name={'square-o'} size={20} color='#ccc' style={{width: 30, height: 30, position: 'absolute', top: 0, left: 10}}
                  ref={(icon) => { this.allIcons[rowId] = icon  } }/>


          </TouchableOpacity>


      return (
          <View>
            <View style={styles.row}>

            <View style={{flex:0.05}}>
              {selected}
            </View>


            <View style={{flex:0.95}}>
              <TouchableHighlight onPress={() => this.pressRow(row,rowId)}>
                  <View style={{flexDirection:'row'}} >

                      <View style={{flex:0.1}}>
                            <Text style={[styles.text]}>
                              {row.name}
                            </Text>
                        </View>

                        <View style={{flex:0.4}}>
                          <Text style={[styles.text,{}]}>
                            {row.gender === 'M' ? 'Male' : row.gender ? 'Female' : ''}
                          </Text>
                        </View>

                  </View>
              </TouchableHighlight>
            </View>

            </View>

            <View style={styles.separator} />
          </View>
      );


      // return (
      //   <TouchableHighlight onPress={() => this.pressRow(row,rowId)}>
      //     <View>
      //       <View style={styles.row}>
      //         <Text style={styles.text}>
      //           {row.name}
      //         </Text>
      //       </View>
      //       <View style={styles.separator} />
      //       <View style={styles.separator} />
      //     </View>
      //   </TouchableHighlight>
      // );
    }

    pressRow(row, rowId) {
      console.log("ContactList.pressRow-->row", row, row.smoker);
      let coll = getColl("contacts");
      let doc = coll.get( row.$loki)

      this.props.fns.gotoDetailView(doc);
    }

    render() {
      let dh = Dimensions.get('window').height,
          dw = Dimensions.get('window').width;
          let h = this.props.tabno === 0 ? dh/2 - 50 : (dh/2)- 50;
          // console.log("contactList.render ---> dh, h, this.pageY:", dh, h, this.pageY, this.props.tabno);

      return(
        <View style={{height: (dh-100)}} >

        <ScrollView style={{}}>
            <View style={styles.container}>
              <ListView
                  dataSource={this.props.ds}
                  renderRow={ (rowData,sectionId,rowId) => this.renderRow(rowData,sectionId,rowId) }
                />
            </View>

          </ScrollView>


          <View ref="actionButton" style={[styles.overlay],{left:dw-120, top:-(h)}}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>console.log("quotation")}
              style={{}}>
              <View style={[styles.actionButton,
                {
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#3498db',

                }
              ]}>
              <Icon name={'calculator'} size={30} color={'white'} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.overlay],{left:dw-120, top:-(h)+20}}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>console.log("hello")}
              style={{}}>
              <View style={[styles.actionButton,
                {
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#1abc9c',
                }
              ]}>
              <Icon name={'flag'} size={30} color={'white'} />
              </View>
            </TouchableOpacity>
          </View>


        </View>

      );
    }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    marginTop: 0
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  // icon: {
  //   paddingRight: 10,
  //   height: 64,
  // },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#F6F6F6',
    flex:1
  },
  text: {
    //flex: 1,
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
  actionBarPos: {
    backgroundColor: 'transparent',
    position: 'absolute',
    // left:530,
    // bottom:530
  },
  actionBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
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



})
