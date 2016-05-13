'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  AlertIOS
} = React

import _ from "lodash";
import moment from "moment";
import Button from 'apsl-react-native-button';
import {LocalNumber, LocalSelect, LocalTextbox} from "../form/localComponents";


var Icon = require('react-native-vector-icons/FontAwesome');
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;

var localstyles = require("../localStyles"),
    t = require('tcomb-form-native'),
    numeral = require('numeral'),
    formstyles = _.clone(localstyles,true);

formstyles.fieldset.flexDirection = "row";
t.form.Form.i18n = {
optional: '',
required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var Form = t.form.Form;
var ContactType = t.enums({
    'Email' : 'Email',
    'Mobile': 'Mobile',
    'Phone': 'Phone'
});

var model = t.struct({
    iden : t.String,
    type : ContactType,
    value : t.String
});
var options = {
    // template : layout,
    fields : {
        iden : {
            factory : LocalTextbox,
            label : 'Identifer',
            autoCapitalize : 'none',
            error : 'This field is required',
            style : { width : 100}
        },
        type : {
            factory : LocalSelect,
            nulloption : false,
            height : 35,
            error : 'This field is required',
            // position : 'top'
        },
        value : {
            factory : LocalTextbox,
            style : {width : 300},
            autoCapitalize : 'none',
            error : 'This field is required'
        },
    }
}
var TAG = "ProposalS1PhContactsView.";
export default class ProposalS1PhContactsView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state");
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, secid, rowid) => {
            return _.find(data.s1, (row) => row.iden === rowid );
          }
      });
      this.state = { value : { iden:null, type : 'Mobile', value : null }}
    }


    renderRow(data, sectionId, rowId) {
      console.log(TAG + "renderRow -->data, s, r", data, sectionId, rowId );
      return (
        <TouchableOpacity onPress={() => this.pressRow(rowId)}>
          <View style={{padding:15}}>
            <View style={styles.row}>

                <View style={{flex:0.11}} >
                    <Text>{data.iden}</Text>
                </View>

                <View style={{flex:0.44}} >
                    <Text>{data.type}</Text>
                </View>

                <View style={{flex:0.43}} >
                    <Text>{data.value}</Text>
                </View>
                <View style={{flex:0.1}}>
                    <TouchableOpacity key={rowId} onPress={() => this.removeRow(rowId)} style={[styles.tab]}>
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableOpacity>
      );
    }

    renderHeader() {
        return (
            <View style={{flex:1, flexDirection:"column"}} >
                <View style={[styles.section, {flexDirection:"row", justifyContent:"flex-start", padding : 5}]} >

                    <View style={{flex:0.1} } >
                        <Text style={styles.sectionText}>{"Identifier"}</Text>
                    </View>
                    <View style={{flex:0.4} } >
                        <Text style={styles.sectionText}>{"Type"}</Text>
                    </View>
                    <View style={{flex:0.4}} >
                        <Text style={styles.sectionText}>{"Value"}</Text>
                    </View>
                    <View style={{flex:0.1}} >
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </View>
                </View>
            </View>
        );
    }

    pressRow(rowId) {
      console.log(TAG + "pressRow --> rowId", rowId);
    }
    removeRow(rowid) {
        let data = this.uistate.get().proposal.s1.ph.contacts.toJS(),
            pos = _.findIndex(data, (r) => r.iden === rowid);
        if (pos >= 0) {
            data.splice(pos,1); // remove the 1 row
            this.uistate.get().proposal.s1.ui.set({refresh:true});
            this.uistate.get().proposal.s1.ph.set({contacts:data});
        }
    }

    onFormChange(values, path) {
        // console.log("onFormChange, values & path ", values, path);
    }
    addRow() {
        let values = this.refs.form.getValue();
        console.log(TAG + "addRow ---> values", values);
        if (values) {
            // check that the year is not already entered
            if (!values.iden  || !values.type || !values.value) {
                AlertIOS.alert(
                  'Errors',
                  'Please correct the errors before adding again',
                  [
                    {text:'OK', style:"default" }
                  ]
                );
                return
            }
            let rows = _.assign([],this.uistate.get().proposal.s1.ph.contacts)
            console.log("rows=", rows);
            rows.push(values);
            this.uistate.get().proposal.s1.ph.set({contacts:rows});
            this.uistate.get().proposal.s1.ui.set({refresh:true});
        }
    }
    saveProposal() {
        this.props.fns.saveProposal();

    }
    render() {

        Form.stylesheet = formstyles;
        let rows = this.uistate.get().proposal.s1.ph.contacts || [] ,
            ids = _.map(rows,(item) => item.iden );
        this.ds = this.ds.cloneWithRows(rows,ids);
        // console.log(TAG + "render, row ",  JSON.stringify(this.state.value));

        let res = (
        <View style={{flex:1, flexDirection:"column"}} >

            <View style={{flex:0.1, flexDirection:"row", padding : 10}} >

                <Form style={{flexDirection:"row"}}
                  ref="form"
                  type={model}
                  options={options}
                  value={this.state.value}
                  onChange={this.onFormChange.bind(this)}
                />

                <View style={{paddingTop:32, paddingLeft: 20}} >
                    <Button textStyle={{color:"white", fontSize:16}}
                        style={{paddingTop:0, width:100, height:35, backgroundColor:"rgb(150,150,200)", borderWidth:0 }}
                        onPress={()=>this.addRow()} isDisabled={false} >
                                  Add
                    </Button>
                </View>

            </View>

            <ScrollView style={{flex:0.9,backgroundColor: '#f6fffe', paddingTop:20}}>
              <ListView
                  dataSource={this.ds}
                  renderRow={ this.renderRow.bind(this) }
                  renderHeader={()=> this.renderHeader()}
                />

            </ScrollView>


            {/* put in an action button */}
            <View ref="actionButton" style={[styles.overlay],{left:((dw*0.85)-100), top:-(450)}}>
              <TouchableOpacity activeOpacity={0.5} onPress={()=> this.saveProposal()}
                style={{}}>
                <View style={[styles.actionButton,
                  {
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: '#3498db',

                  }
                ]}>
                <Icon name={'check'} size={30} color={'white'} />
                </View>
              </TouchableOpacity>
            </View>
            {/* end of action button */}

        </View>
        );

        return res;
    }
} // end SideMenu class

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    // justifyContent: 'center',
    justifyContent: 'flex-start',
    // padding: 10,
    // backgroundColor: '#F6F6F6',
    backgroundColor: 'transparent',
  },
  text: {
    flex: 1,
  },
  section: {
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'flex-start',
       padding: 2,
      //  backgroundColor: '#2196F3'
       backgroundColor: '#0296c3'
   },
   sectionText: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
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
