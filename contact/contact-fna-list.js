'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  ListView,
  ScrollView,
  AlertIOS,
} = React;

import numeral from 'numeral'
import _ from "lodash"
import moment from "moment"
// import { getColl, getDb } from "../db"
import cblite from "../cblite"

var Icon = require('react-native-vector-icons/FontAwesome');
var ActionButtonItem = require('../components/ActionButtonItem');
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;
var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;
const NO_ROWS = 'No proposals yet'
const TAG = "ContactFnaList."
export default class ContactFnaList extends React.Component {
    constructor(props){
      super(props);
      this.selectedRows = [];
      this.allIcons = {};
      this.uistate = require("../state");
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, sid, rid) =>  {
             return  _.find(data.s1, (row) => row._id === rid ) || {}
          }
      });
      this.state = { rows : []} // start with no rows
    }
    componentWillReceiveProps(props) {
        this.loadFnas()
    }

    loadFnas() {
        // let coll = getColl("proposals"),
        let currentContact = this.uistate.get().contactinfo.currentContact,
            filter,
            rows = [],
            id = currentContact._id;

        // worry about the filter, only show row if it belongs to the currentContact
        filter = (row) => row.contactId === currentContact._id;
        cblite.queryView('fnas','listFnas').then( (res) => {
            let docs = res.rows.map( (row) => {
                return filter(row.value) ? row.value : null
            }).filter((doc) => doc ); // get rid of null rows
            this.setState({ rows : docs })
        }).catch( (err) => {
            console.log("error in reading listFnas", err);
            self.alert("error in reading listFnas" + err)
            this.setState({ rows : []});
        })
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

      return (
          <View>
            <View style={styles.row}>

            <View style={{flex:0.05}}>
              { row.name === NO_ROWS ? null : selected}
            </View>
            <View style={{flex:0.95}}>
              <TouchableOpacity onPress={() => this.editFna(row,rowId)}>
                  <View style={{flexDirection:'row'}} >

                      <View style={{flex:0.2}}>
                            <Text style={[styles.text]}>
                              {row.contactName}
                            </Text>
                        </View>

                        <View style={{flex:0.1}}>
                          <Text style={[styles.text,{}]}>
                            { row.creationDate ? moment(row.creationDate).format('D-M-YYYY') : ''}
                          </Text>
                        </View>

                        <View style={{flex:0.1}}>
                          <Text style={[styles.text,{}]}>
                            { row.lastModified ? moment(row.lastModified).format('D-M-YYYY') : ''}
                          </Text>
                        </View>

                        <View style={{flex:0.1}}>
                          <Text style={[styles.text,{}]}>
                            { row.lifeAssuredData ? row.lifeAssuredData.smoker : '' }
                          </Text>
                        </View>

                        <View style={{flex:0.1}}>
                          <Text style={[styles.text,{}]}>
                            { row.lifeAssuredData ? row.lifeAssuredData.job : '' }
                          </Text>
                        </View>

                        <View style={{flex:0.1}}>
                          <Text style={[styles.text,{}]}>
                            { row.lifeAssuredData ? row.lifeAssuredData.phone : '' }
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

    renderHeader() {
        return (
        <View>
            <View style={styles.row}>
                  <View style={{flex:0.05}}>
                    <Text style={styles.headerText}>Sel</Text>
                  </View>
                  <View style={{flex:0.95, flexDirection: 'row'}}>
                      <View style={{flex:0.2}}>
                            <Text style={styles.headerText}>Contact</Text>
                      </View>
                      <View style={{flex:0.1}}>
                            <Text style={styles.headerText}>Creation Date</Text>
                      </View>
                      <View style={{flex:0.1}}>
                            <Text style={styles.headerText}>Modified Date</Text>
                      </View>
                      <View style={{flex:0.1}}>
                            <Text style={styles.headerText}>Smoker (LA)</Text>
                      </View>
                      <View style={{flex:0.1}}>
                            <Text style={styles.headerText}>Job (LA)</Text>
                      </View>
                      <View style={{flex:0.1}}>
                            <Text style={styles.headerText}>Phone (LA)</Text>
                      </View>
                  </View>
          </View>
          <View style={styles.separator} />
      </View>
      );

    }
    render() {
      let height = 50 ;//dh

      let rows = this.state.rows;
      let ids = _.map(rows,(row) => row._id ) || [];
      var ds = this.ds.cloneWithRows(rows,ids);

    //   debugger;
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
          <View ref="actionButton" style={[styles.overlay],{left:dw-100, top:-(height+60)}}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.addFna()}
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
          {/* put in an action button */}
          <View ref="actionButton" style={[styles.overlay],{left:dw-100, top:-(height+40)}}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.addQuote()}
              style={{}}>
              <View style={[styles.actionButton,
                {
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#2dd3a6',

                }
              ]}>
              <Icon name={'calculator'} size={30} color={'white'} />
              </View>
            </TouchableOpacity>
          </View>



          {/* put in an action button */}
          <View ref="actionButton" style={[styles.overlay],{left:dw-100, top:-(height+20)}}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.removeFna()}
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

    addFna() {
        console.log("add fna");

        let contact = this.uistate.get().contactinfo.currentContact;
        this.uistate.get().fna.ui.set({currentContact: contact  })
        this.props.fns.gotoFna()

    }
    addQuote() {
        console.log("add quote");

        if (this.selectedRows.length === 0) {
            this.alert("Please select a FNA to be linked to the new quotation")
            return
        }
        let fnaId = this.selectedRows[0];
        cblite.getDocument(fnaId).then(( fna) => {
            let contact = this.uistate.get().contactinfo.currentContact;
            if (contact) {
                this.uistate.get().quote.set({contact : contact, quote: null, fna: fna, tabno:0, viewno: 0, reloadQuote: true}).now()
                this.props.fns.gotoIllustration();
            }
        });
    }
    editFna(row, rowid) {

        // :: TODO ::
        let contact = this.uistate.get().contact.currentContact,
            owner = row.contactName,
            proposal;
        // need to read the proposal object
        cblite.getDocument(rowid).then((fna) => {
            this.uistate.get().fna.ui.set({currentFna: fna, owner : owner, currentContact: contact, refresh: false, loadFna:true})
            this.props.fns.gotoFna()
        })
        .catch((err) => {
            self.alert("Unable to read the selected fna" + err);
            console.log("Unable to read the selected fna", err)
        })
    }
    removeFna(){
        console.log(TAG + "removeFna --> selectedRows", this.selectedRows );

        if (this.selectedRows.length === 0 ) {
            this.alert("Please select the fna to remove")
            return
        }
        var self = this;
        var handleDelete = (txt) => {
            _.forEach(this.selectedRows, (rowid, index) => {
                cblite.getDocument(rowid).then( ( doc) => {
                    cblite.deleteDocument(doc._id, doc._rev).then( (res) => {
                            self.loadFnas();
                    })
                }).catch( (err) => {
                    console.log("Unable to read document to delete")
                })
            })
        }
        AlertIOS.alert(
          'Warning',
          'Please confirm deletion of selected rows',
          [
            {text:'Cancel', onPress : (txt) => {} },
            {text:'OK', onPress : (txt) => { handleDelete(txt) } }
          ],
        );

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
