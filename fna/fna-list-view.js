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


import cblite from "../cblite"
import _ from "lodash"
import numeral from "numeral";

var Icon = require('react-native-vector-icons/FontAwesome');
var ActionButtonItem = require('../components/ActionButtonItem');
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;


var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;

const NO_ROWS = 'No FNAs found';
const TAG = "FnaListView."
export default class FnaListView extends React.Component {
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
    componentWillMount() {
        this.loadFnas()
    }

    componentWillReceiveProps() {
        this.loadFnas()
    }

    loadFnas(){
        let filter = _.isFunction(this.uistate.get().fnaList.ui.filter) ? this.uistate.get().fnaList.ui.filter : (doc) => doc;
        cblite.queryView('fnas','listFnas').then( (res) => {
            // get the docs into the correct format
            let docs = res.rows.map( (row) => {
                if (filter(row.value)) {
                    return row.value;
                }
            }).filter((doc) => doc )
            this.setState({ rows : docs })
        }).catch( (err) => {
            console.log(TAG + "loadFnas : error in reading FNAs", err)
            this.alert(TAG + "loadFnas : error in reading FNAs" + err)
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
              { row.contactName === NO_ROWS ? null : selected}
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

    editFna(row, rowId) {

        let owner = row.contactName,
            proposal;
        // need to read the proposal object
        cblite.getDocument(rowId).then((fna) => {
            // use the contactId to get the contact
            cblite.getDocument(fna.contactId).then((contact) => {
                this.uistate.get().fna.ui.set({currentFna: fna, owner : owner, currentContact: contact, refresh: false, loadFna:true})
                this.props.fns.gotoFna()
            });
        })
        .catch((err) => {
            self.alert("Unable to read the selected fna" + err);
            console.log("Unable to read the selected fna", err)
        })
    }
    alert(msg=null, title="Error") {
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
    removeFna() {
        // are there any selected ?
        if (this.selectedRows.length === 0 ) {
            this.alert("Please select the FNA to remove")
            return
        }

        var self = this;
        var handleDelete = (txt) => {
            _.forEach(this.selectedRows, (rowid) => {
                cblite.getDocument(rowid).then( ( doc) => {
                    cblite.deleteDocument(doc._id, doc._rev).then( (res) => {
                        self.loadFnas();
                        // self.forceUpdate()
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
    //   let rows = this.loadProposals();
      let rows = this.state.rows;
      if (rows.length === 0) {
        rows.push( {'contactName' : NO_ROWS, _id: 0})
      }
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
          <View ref="actionButton" style={[styles.overlay],{left:dw-100, top:-(height+130)}}>
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
