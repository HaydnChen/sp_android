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
  AlertIOS,
  NativeModules: {
    UIManager,
  },
} = React;


import { getColl, getDb } from "../db";
import cblite from "../cblite";
import _ from "lodash"

var Icon = require('react-native-vector-icons/FontAwesome');
var ActionButtonItem = require('../components/ActionButtonItem');
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;
const NO_ROWS = 'No contacts found';
const TAG = "ContactList.";
export default class ContactList extends React.Component {
    constructor(props){
      super(props);
      this.pageY = 0;
      this.pageX = 0;
      this.selectedRows = [];
      this.allIcons = {};
      this.uistate = require("../state");
    //   this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {return r1 !== r2 } });
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, sid, rid) =>  {
             return  _.find(data.s1, (row, index) => row._id === rid ) || {}
          }
      });
      this.state = {rows : []}
    }
    // loadContacts() {
    //     let coll = getColl("contacts");
    //     let filter = this.uistate.get().contact.filter;
    //     let rows = coll.find(filter);
    //     // alternative code to read from cblite
    //
    //     return rows ;
    // }

    loadRows() {
        let filter = this.uistate.get().contact.filter ? this.uistate.get().contact.filter : (doc) => doc ;
        // console.log(TAG+"loadRows ....")
        cblite.queryView('contacts','listContacts').then( (res) => {
            // get the docs into the correct format
            let docs = res.rows.map( (row) => {
                if (filter(row.value)) {
                    return row.value;
                }
            }).filter((doc) => doc )
            this.setState({ rows : docs })

        }).catch( (err) => {
            console.log("error in reading listContacts", err)
        })
    }

    componentWillMount() {
        this.loadRows()
    }

    componentWillReceiveProps() {
        this.loadRows()
    }

    setSelected(rowId) {
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

    }

    renderRow(row, sectionId, rowId) {
      //console.log("render row of listview", row.name);
      let selected =
          <TouchableOpacity key={rowId} onPress={() => this.setSelected(rowId)} style={[styles.tab]}>

            <Icon name={'check-square-o'} size={20} color='#3B5998' style={{width: 30, height: 30, position: 'absolute', top: 0, left: 10}}
                  ref={(icon) => {  }}/>

            <Icon name={'square-o'} size={20} color='#ccc' style={{width: 30, height: 30, position: 'absolute', top: 0, left: 10}}
                  ref={(icon) => { this.allIcons[rowId] = icon  } }/>
          </TouchableOpacity>

      let contacts = row && row.contacts ? row.contacts.map( (p) => p.value ) : []
      return (
          <View>
            <View style={styles.row}>

            <View style={{flex:0.05}}>
              { row.name === 'No contacts found' ? null : selected}
            </View>
            <View style={{flex:0.95}}>
              <TouchableOpacity onPress={() => this.onRowTapped(row,rowId)}>
                  <View style={{flexDirection:'row'}} >

                      <View style={{flex:0.4}}>
                            <Text style={[styles.text]}>
                              {row.name}
                            </Text>
                        </View>

                        <View style={{flex:0.1}}>
                          <Text style={[styles.text,{}]}>
                            { row.gender}
                            {/*row.gender === 'M' ? 'Male' : row.gender ? 'Female' : ''*/}
                          </Text>
                        </View>

                        <View style={{flex:0.5}}>
                          <Text style={[styles.text,{}]}>
                            { contacts.join(', ') }
                            {/*row.gender === 'M' ? 'Male' : row.gender ? 'Female' : ''*/}
                          </Text>
                        </View>

                  </View>
              </TouchableOpacity>
            </View>
            </View>
            <View style={styles.separator} />
          </View>
      );
    }

    onRowTapped(row, rowId) {
    //   this.uistate.get().contact.set({currentContact: row.$loki})
      this.uistate.get().contact.set({currentContact: row})
    //   this.uistate.get().contactinfo.set({ currentContact:row })
      this.props.fns.gotoContactDetail()
    }
    newContact() {
        this.uistate.get().contact.set({currentContact: {_id: '-1'} })
        this.props.fns.gotoContactDetail()

    }
    newFna() {

        let contactId = this.selectedRows[0];
        cblite.getDocument(contactId).then(( contact) => {
            this.uistate.get().fna.ui.set({currentContact: contact  })
            this.props.fns.gotoFna()
        });
    }


    alert(msg=null,title="Error") {
        let message = msg ? msg : 'Please fix the errors, before moving to the next view'
        AlertIOS.alert(
          title,
          message,
          [
            {text:'OK', onPress : (txt) => console.log(txt)}
          ],
        //   'default'
        );

    }
    removeContact() {

        // are there any selected ?
        if (this.selectedRows.length === 0 ) {
            this.alert("Please select the contact to remove")
            return
        }
        var self = this;
        var handleDelete = (txt) => {
            _.forEach(this.selectedRows, (rowid) => {
                cblite.getDocument(rowid).then( ( doc) => {
                    cblite.deleteDocument(doc._id, doc._rev).then( (res) => {
                        this.loadRows();
                        // this.forceUpdate()
                    })
                }).catch( (err) => {
                    console.log("Unable to read document to delete")
                })
            })

            // let coll = getColl("contacts"),
            //     db = getDb();

            // debugger;
            // _.forEach(this.selectedRows, (rowid) => {
            //     let docc = coll.get(rowid);
            //     if (docc) {
            //         coll.remove(docc);
            //     }
            // })
            // coll.flushChanges()
            // db.saveDatabase((status) => {
            //     self.alert("Successfully deleted the selected contacts")
            //     this.forceUpdate();
            // })
        }

        AlertIOS.alert(
          'Warning',
          'Please confirm deletion of selected rows',
          [
            {text:'Cancel', onPress : (txt) => {} },
            {text:'OK', onPress : (txt) => { handleDelete(txt) } }
          ],
        //   'default'
        );
    }
    renderHeader() {
        return (
        <View>
            <View style={styles.row}>

                      <View style={{flex:0.05}}>
                        <Text style={styles.headerText}>Sel</Text>
                      </View>
                      <View style={{flex:0.95, flexDirection: 'row'}}>
                          <View style={{flex:0.4}}>
                                <Text style={styles.headerText}>Name </Text>
                          </View>
                          <View style={{flex:0.1}}>
                                <Text style={styles.headerText}>Gender</Text>
                          </View>
                          <View style={{flex:0.5}}>
                                <Text style={styles.headerText}>Contacts</Text>
                          </View>
                      </View>
          </View>
          <View style={styles.separator} />
      </View>
      );

    }
    render() {
      let height = 50 ;//dh
    //   let rows = this.loadContacts();
      let rows = this.state.rows;

      if (rows.length === 0) {
        rows.push( {'name' : NO_ROWS, _id : 0})
      }
      let ids = _.map(rows,(row, index) => row._id ) || [];
      var ds = this.ds.cloneWithRows(rows,ids);

    //   var ds = this.ds.cloneWithRows(rows);

      return(
        <View style={{height: (dh-100)}} >

        <ScrollView style={{}}>
            <View style={styles.container}>
              <ListView
                  dataSource={ds}
                  renderRow={ (rowData,sectionId,rowId) => this.renderRow(rowData,sectionId,rowId) }
                  renderHeader={ () => this.renderHeader()}
                />
            </View>

          </ScrollView>
          {/* put in an action button */}
          <View ref="actionButton" style={[styles.overlay],{left:dw-100, top:-(height+150)}}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.newContact()}
              style={{}}>
              <View style={[styles.actionButton,
                {
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#3498db',

                }
              ]}>
              <Icon name={'plus'} size={30} color={'white'} />
              </View>
            </TouchableOpacity>
          </View>
          {/* put in button to create a new FNA */}
          <View ref="actionButton" style={[styles.overlay],{left:dw-100, top:-(height+130)}}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.newFna()}
              style={{}}>
              <View style={[styles.actionButton,
                {
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#2dd3a6',

                }
              ]}>
              <Icon name={'cubes'} size={30} color={'white'} />
              </View>
            </TouchableOpacity>
          </View>


          {/* put in an action button */}
          <View ref="actionButton" style={[styles.overlay],{left:dw-100, top:-(height+110)}}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.removeContact()}
              style={{}}>
              <View style={[styles.actionButton,
                {
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#ff2222',

                }
              ]}>
              <Icon name={'minus'} size={30} color={'white'} />
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
    // backgroundColor: '#F6F6F6',
    backgroundColor: '#FFFFFF',
    marginTop: 0
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    // backgroundColor: '#F6F6F6',
    backgroundColor: '#FFFFFF',
    flex:1,
    width: dw
  },
  text: {
    //flex: 1,
  },
  headerText: {
    color : 'blue'
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
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
