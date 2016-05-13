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

import numeral from 'numeral'
import _ from "lodash"
import moment from "moment"
import { getColl, getDb } from "../db"
import cblite from "../cblite"

var Icon = require('react-native-vector-icons/FontAwesome');
var ActionButtonItem = require('../components/ActionButtonItem');
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;
var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;
const NO_ROWS = 'No quotations yet';
const TAG = "ContactQuoteList.";
export default class ContactQuoteList extends React.Component {
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

    this.state = {rows : []}
    }
    loadRows() {
        let currentContact = this.uistate.get().contactinfo.currentContact,
            filter = (row) => row.contact_id === currentContact._id;

        cblite.queryView('quotations','listQuotes').then( (res) => {
            let docs = res.rows.map( (row) => {
                return filter(row.value) ? row.value : null
            }).filter((doc) => doc)
            this.setState({ rows : docs })
        }).catch( (err) => {
            console.log("error in reading listContacts", err)
        })


    }
    componentWillReceiveProps(props) {
        let rows = this.loadRows();
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

      let main = row && row.policy && row.policy.main || {};
      return (
          <View>
            <View style={styles.row}>

            <View style={{flex:0.05}}>
              { row.name === NO_ROWS ? null : selected}
            </View>
            <View style={{flex:0.95}}>
              <TouchableOpacity onPress={() => this.editQuote(row,rowId)}>
                  <View style={{flexDirection:'row'}} >

                      <View style={{flex:0.2}}>
                            <Text style={[styles.text]}>
                              {row.name}
                            </Text>
                        </View>

                        <View style={{flex:0.1}}>
                          <Text style={[styles.text,{}]}>
                            { row.lastModified ? moment(row.lastModified).format('D-M-YYYY') : ''}
                          </Text>
                        </View>

                        <View style={{flex:0.2}}>
                          <Text style={[styles.text,{}]}>
                            { main.product_name }
                          </Text>
                        </View>

                        <View style={{flex:0.2}}>
                          <Text style={[styles.text,{}]}>
                            { main.initial_sa ? formatNumber(main.initial_sa) : '' }
                          </Text>
                        </View>

                        <View style={{flex:0.2}}>
                          <Text style={[styles.text,{}]}>
                            { main.premium ? formatNumber(main.premium) : '' }
                          </Text>
                        </View>

                        <View style={{flex:0.06}}>
                          <Text style={[styles.text,{}]}>
                            { row.status }
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
                            <Text style={styles.headerText}>Name </Text>
                      </View>
                      <View style={{flex:0.1}}>
                            <Text style={styles.headerText}>Date</Text>
                      </View>
                      <View style={{flex:0.2}}>
                            <Text style={styles.headerText}>Plan</Text>
                      </View>
                      <View style={{flex:0.2}}>
                            <Text style={styles.headerText}>SA</Text>
                      </View>
                      <View style={{flex:0.2}}>
                            <Text style={styles.headerText}>Premium</Text>
                      </View>
                      <View style={{flex:0.05}}>
                            <Text style={styles.headerText}>Status</Text>
                      </View>
                  </View>
          </View>
          <View style={styles.separator} />
      </View>
      );

    }
    render() {
      let height = 50 ;//dh

    //   let rows = this.loadQuotes();
    let rows = this.state.rows;
      let ids = _.map(rows,(row) => row._id ) || [];
      var ds = this.ds.cloneWithRows(rows,ids);

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
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.addQuote()}
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
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.addProposal()}
              style={{}}>
              <View style={[styles.actionButton,
                {
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#2dd3a6',

                }
              ]}>
              <Icon name={'file-text'} size={30} color={'white'} />
              </View>
            </TouchableOpacity>
          </View>

          {/* put in an action button */}
          <View ref="actionButton" style={[styles.overlay],{left:dw-100, top:-(height+20)}}>
            <TouchableOpacity activeOpacity={0.5} onPress={()=>this.removeQuote()}
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
    addQuote() {
        console.log("addQuote")
        // debugger;
        let contact = this.uistate.get().contactinfo.currentContact;
        if (contact) {
            this.uistate.get().quote.set({contact : contact, quote: null, fna: null, tabno:0, reloadQuote: true}).now()
            this.props.fns.gotoIllustration();
        }
    }
    editQuote(row, rowid) {
        // let contact_id = this.uistate.get().contact.currentContact,
        // let contact_id = this.uistate.get().contact.currentContact._id,
        //     quote_id = rowid;
        let contact = this.uistate.get().contactinfo.currentContact,
            quote = row;
        // this.uistate.get().quote.set({quote_id: quote_id, contact_id: contact_id, refresh: false}).now()
        this.uistate.get().quote.set({quote: quote, contact: contact, refresh: false, tabno: 0, reloadQuote: true}).now()
        this.props.fns.gotoIllustration()
    }
    removeQuote(){
        console.log("remove quote", this.selectedRows );

        if (this.selectedRows.length === 0 ) {
            this.alert("Please select the quotation to remove")
            return
        }
        var self = this;
        var handleDelete = (txt) => {
            _.forEach(this.selectedRows, (rowid, index) => {
                cblite.getDocument(rowid).then( ( doc) => {
                    cblite.deleteDocument(doc._id, doc._rev).then( (res) => {
                        // if (index+1 === self.selectedRows.length) {
                            // self.forceUpdate()
                            self.loadRows();

                        // }
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
        //   'default'
        );

    }

    addProposal() {
        console.log(TAG + "add proposal", this.selectedRows );


        if (this.selectedRows.length === 0) {
            this.alert("Please select a quotation to be linked to the new proposal")
            return
        }
        // let coll = getColl("quotations"),
        let quote_id = this.selectedRows[0];
        cblite.getDocument(quote_id).then(( quote) => {

            // let row = coll.get(quote_id);
            if (quote && quote.status !== 'Signed') {
                this.alert("Please sign the quotation before creating the new proposal", "Information");
                return
            }
            let contact = this.uistate.get().contactinfo.currentContact;
            // having problems with async calls to db , so doing the code here to collect
            // information about the ph and la, so that we do not trigger the screen until we are ready, i.e.
            // read all the necesary data from the db.....to be continued
            let people = quote.policy.people,
                ph = _.find(people, (p) => p.is_ph ),
                mainInsured = parseInt(quote.policy.main.la),
                la = people[mainInsured];

            // read the contact data for the ph & la , if we have their ids to get latest data
            let promises = [], persons = [ph,la];
            _.forEach([ph,la], (p, index) => {
                if (p._id) {
                    promises.push( cblite.getDocument(p._id) )
                } else {
                    promises.push( new Promise((resolve,reject) => { resolve({}) } ))
                }
            });
            // console.log("promises****", promises);
            Promise.all(promises).then( (rows) => {
                _.forEach(rows,(row,index) => {
                    let p = _.assign({}, row, persons[index] );
                    if (index === 0){
                        ph = p
                    } else {
                        la = p
                    }
                })
                this.uistate.get().proposal.s1.ui.set({
                    contact: contact,
                    quote: quote,
                    proposal : null,
                    updated : true, // needed to force it to load
                    tabno : 0, viewno : 0,
                }).now()
                this.props.fns.gotoProposal({ph:ph,la:la});

            });


        })
        .catch((err) => {
            console.log("Unable to retrieve selected quote for conversion", err);
            self.alert("Unable to retrieve selected quote for conversion", err);
        })

        // check that quotation has been signed
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
