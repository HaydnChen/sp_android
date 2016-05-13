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
import {LocalNumber, LocalSelect, LocalTextbox, LocalDate, LocalSegmentedControls} from "../form/localComponents";

var Icon = require('react-native-vector-icons/FontAwesome');
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;

var localstyles = require("../localStyles"),
    t = require('tcomb-form-native'),
    numeral = require('numeral'),
    formstyles = _.clone(localstyles,true);

var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;

formstyles.fieldset.flexDirection = "row";
t.form.Form.i18n = {
optional: '',
required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var Form = t.form.Form;

var data ;
data = ['Policyholder','Life assured' ]
var Owner = t.enums( _.zipObject( data,data ) );

var model = t.struct({
    owner : Owner,
    insurer : t.String,
    policy_no : t.Number,
    policy_date : t.maybe(t.Date),
    sum_assured : t.maybe(t.Number),
});
var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'column'}} >
            <View style={{flexDirection:'row',  flex: 1, justifyContent:'flex-start'}} >
                {inputs.owner}
                {inputs.insurer}
                {inputs.policy_no}
            </View>
            <View style={{flexDirection:'row',  flex: 1, justifyContent:'flex-start'}} >
                {inputs.policy_date}
                {inputs.sum_assured}
            </View>
        </View>
        );
    }
    return tmpl
}
var optionsFactory = (self)  => {
    let options = {
        template : layout(self),
        fields : {
            owner : {
                factory : LocalSegmentedControls,
            },
            insurer : {
                factory : LocalTextbox,
                style : { width : 150 }
            },
            policy_no : {
                factory : LocalTextbox,
                style : { width : 150 }
            },
            policy_date : {
                factory : LocalDate,
                style : { width: 150 },
            },
            sum_assured : {
                factory : LocalNumber,
                style : { width : 150 }
            },
        }
    }
    return options
}
var TAG = "ProposalS1ExtraPoliciesView.";
export default class ProposalS1ExtraPoliciesView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state");
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, secid, rowid) => {
            return _.find(data.s1, (row,index) => index === rowid );
          }
      });
      this.state = { value : Object.assign({},this.uistate.get().proposal.s1_defaults.policy) };
    }

    renderRow(data, sectionId, rowId) {
      console.log(TAG + "renderRow -->data, s, r", data, sectionId, rowId );
      return (
        <TouchableOpacity onPress={() => this.pressRow(rowId)}>
          <View style={{padding:15}}>
            <View style={styles.row}>

                <View style={{flex:0.21}} >
                    <Text>{data.owner}</Text>
                </View>
                <View style={{flex:0.2}} >
                    <Text>{data.insurer}</Text>
                </View>
                <View style={{flex:0.15}} >
                    <Text>{data.policy_no}</Text>
                </View>
                <View style={{flex:0.15}} >
                    <Text>{data.policy_date ? moment(data.policy_date).format('D-M-YYYY'):''}</Text>
                </View>
                <View style={{flex:0.2}} >
                    <Text>{formatNumber(data.sum_assured)}</Text>
                </View>

                <View style={{flex:0.06}}>
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
                <View style={[styles.section, {flexDirection:"row", justifyContent:"flex-start", padding : 15}]} >

                    <View style={{flex:0.2} } >
                        <Text style={styles.sectionText}>{"Owner"}</Text>
                    </View>

                    <View style={{flex:0.2}} >
                        <Text style={styles.sectionText}>{"Insurer"}</Text>
                    </View>
                    <View style={{flex:0.15}} >
                        <Text style={styles.sectionText}>{"Policy No"}</Text>
                    </View>
                    <View style={{flex:0.15}} >
                        <Text style={styles.sectionText}>{"Date"}</Text>
                    </View>
                    <View style={{flex:0.2} } >
                        <Text style={styles.sectionText}>{"Sum assured"}</Text>
                    </View>

                    <View style={{flex:0.06}} >
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </View>

                </View>
            </View>
        );
    }

    pressRow(rowId) {
      console.log(TAG + "pressRow --> rowId", rowId);
      let rows = this.uistate.get().proposal.s1.policies;
      let row = rows[rowId];
      this.setState({value : row})

    }
    removeRow(rowid) {
        // look at this later
        let data = this.uistate.get().proposal.s1.policies.toJS(),
            pos = _.findIndex(data, (r,index) => index === rowid);
        if (pos >= 0) {
            data.splice(pos,1); // remove the 1 row
            this.uistate.get().proposal.s1.set({policies: data});
            this.uistate.get().proposal.s1.ui.set({refresh:true});
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
            if (!values.owner || !values.insurer || !values.policy_no ) {
                this.alert('Please correct the errors before adding again')
                return
            }
            let rows = _.assign([],this.uistate.get().proposal.s1.policies);
            rows.push(values); // always just add, let user remove unwanted lines
            this.uistate.get().proposal.s1.set({policies:rows}).now();
            this.uistate.get().proposal.s1.ui.set({refresh:true});
        } else {
            this.alert("Please fix the errors (highlighted) before saving")
        }
    }
    alert(msg=null) {
        let message = msg ? msg : 'Please fix the errors, before moving to the next view'
        AlertIOS.alert(
          'Error',
          message,
          [
            {text:'OK', onPress : (txt) => console.log(txt)}
          ],
        );
    }

    saveProposal() {
        this.props.fns.saveProposal();
    }
    render() {
        Form.stylesheet = formstyles;
        let rows = this.uistate.get().proposal.s1.policies,
            ids = _.map(rows,(item,index) => index );
        this.ds = this.ds.cloneWithRows(rows,ids);
        return (
        <View style={{flex:1, flexDirection:"column"}} >

            <View style={{flex:0.15, flexDirection:"row", justifyContent:'flex-start', padding : 10}} >

                <Form style={{flexDirection:"row", flex: 0.7}}
                  ref="form"
                  type={model}
                  options={optionsFactory(this)}
                  value={this.state.value}
                  onChange={this.onFormChange.bind(this)}
                />

                <View style={{paddingTop:32, paddingLeft: 20, flex: 0.3}} >
                    <Button textStyle={{color:"white", fontSize:16}}
                        style={{paddingTop:0, width:100, height:35, backgroundColor:"rgb(150,150,200)", borderWidth:0 }}
                        onPress={()=>this.addRow()} isDisabled={false} >
                                  OK
                    </Button>
                </View>

            </View>

            <ScrollView style={{flex:0.85,backgroundColor: '#f6fffe', paddingTop:20}}>
              <ListView
                  dataSource={this.ds}
                  renderRow={ this.renderRow.bind(this) }
                  renderHeader={()=> this.renderHeader()}
                />

            </ScrollView>


            {/* put in an action button */}
            <View ref="actionButton" style={[styles.overlay],{left:((dw*0.85)-100), top:-(420)}}>
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
