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
import {LocalNumber, LocalSelect, LocalTextbox, LocalDate} from "../form/localComponents";

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

var data ;
data = ['Spouse','Children','Elders','Siblings','Others' ]
var Relation = t.enums( _.zipObject( data,data ) );
data = ['Male','Female']
var Gender = t.enums( _.zipObject( data, data ))
var model = t.struct({
    name : t.String,
    percentage : t.Number,
    dob : t.maybe(t.Date),
    relation : t.maybe(Relation),
    gender : t.maybe(Gender)
});
var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'column'}} >
            <View style={{flexDirection:'row',  flex: 1, justifyContent:'flex-start'}} >
                {inputs.name}
                <View style={{paddingLeft:10}}>
                    {inputs.percentage}
                </View>
            </View>

            <View style={{flexDirection:'row',  flex: 1, justifyContent:'flex-start'}} >
                {inputs.dob}
                <View style={{paddingLeft:10}}>
                    {inputs.relation}
                </View>
                <View style={{paddingLeft:10}}>
                    {inputs.gender}
                </View>

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
            name : {
                factory : LocalTextbox,
                style : {width:400},
                error : 'This field is required',
            },
            percentage : {
                factory : LocalNumber,
                width : 80,
                error : 'This field is required',
            },
            dob : {
                factory : LocalDate,
                style : { width : 120},
                label : 'Date of birth'
            },
            relation : {
                factory : LocalSelect,
                nulloption : false,
                width : 100,
            },
            gender : {
                factory : LocalSelect,
                nulloption : false,
                width : 100,
            },
        }
    }
    return options
}
var TAG = "ProposalS1ExtraBeneficiaryView.";
export default class ProposalS1ExtraBeneficiaryView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state");
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, secid, rowid) => {
            return _.find(data.s1, (row,index) => index === rowid );
          }
      });
      this.state = { value : Object.assign({},this.uistate.get().proposal.s1_defaults.beneficiary) };
    }

    renderRow(data, sectionId, rowId) {
      console.log(TAG + "renderRow -->data, s, r", data, sectionId, rowId );
      return (
        <TouchableOpacity onPress={() => this.pressRow(rowId)}>
          <View style={{padding:15}}>
            <View style={styles.row}>

                <View style={{flex:0.32}} >
                    <Text>{data.name}</Text>
                </View>
                <View style={{flex:0.1}} >
                    <Text>{data.percentage}</Text>
                </View>

                <View style={{flex:0.18}} >
                    <Text>{moment(data.dob).format('D-M-YYYY')}</Text>
                </View>
                <View style={{flex:0.18}} >
                    <Text>{data.relation}</Text>
                </View>
                <View style={{flex:0.18}} >
                    <Text>{data.gender}</Text>
                </View>

                <View style={{flex:0.04}}>
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

                    <View style={{flex:0.3} } >
                        <Text style={styles.sectionText}>{"Name"}</Text>
                    </View>

                    <View style={{flex:0.1}} >
                        <Text style={styles.sectionText}>{"%"}</Text>
                    </View>
                    <View style={{flex:0.18}} >
                        <Text style={styles.sectionText}>{"Date of birth"}</Text>
                    </View>
                    <View style={{flex:0.18}} >
                        <Text style={styles.sectionText}>{"Relation"}</Text>
                    </View>
                    <View style={{flex:0.18} } >
                        <Text style={styles.sectionText}>{"Gender"}</Text>
                    </View>

                    <View style={{flex:0.04}} >
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </View>

                </View>
            </View>
        );
    }

    pressRow(rowId) {
      console.log(TAG + "pressRow --> rowId", rowId);
      let rows = this.uistate.get().proposal.s1.beneficiaries,
          row = rows[rowId].toJS();
      row.rowid = String(rowId); // need this for later, in case we need to save it
      this.setState({value : row})

    }
    removeRow(rowid) {
        // look at this later
        let data = this.uistate.get().proposal.s1.beneficiaries.toJS(),
            pos = _.findIndex(data, (r,index) => index === rowid);
        if (pos >= 0) {
            data.splice(pos,1); // remove the 1 row
            this.uistate.get().proposal.s1.set({beneficiaries: data});
            this.uistate.get().proposal.s1.ui.set({refresh:true});
        }
    }
    onFormChange(values, path) {
        // console.log("onFormChange, values & path ", values, path);
    }
    updateRow() {
        let values = this.refs.form.getValue();
        console.log(TAG + "addRow ---> values", values);
        if (values) {
            // check that the year is not already entered
            if (!values.name || !values.percentage || !values.dob || !values.relation || !values.gender) {
                AlertIOS.alert(
                  'Errors',
                  'Please correct the errors before adding again',
                  [
                    {text:'OK', style:"default" }
                  ]
                );
                return
            }
            let rows = _.assign([],this.uistate.get().proposal.s1.beneficiaries);
            rows.push(values); // always just add, let user remove unwanted lines
            this.uistate.get().proposal.s1.set({beneficiaries:rows}).now();
            this.uistate.get().proposal.s1.ui.set({refresh:true});
        }
    }
    saveProposal() {
        this.props.fns.saveProposal();
    }
    render() {
        Form.stylesheet = formstyles;
        let rows = this.uistate.get().proposal.s1.beneficiaries,
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
                        onPress={()=>this.updateRow()} isDisabled={false} >
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
