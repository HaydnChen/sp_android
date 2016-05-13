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
  AlertIOS
} = React;

import _ from "lodash";
import moment from "moment"
import Button from 'apsl-react-native-button';
import {LocalSelect,LocalDate,LocalTextbox, LocalSegmentedControls,LocalNumber, LocalPicker} from "../form/localComponents";
var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;

var ActionButtonItem = require('../components/ActionButtonItem');
var Icon = require('react-native-vector-icons/FontAwesome'),
    t = require('tcomb-form-native'),
    localstyles = require("../localStyles");

var formstyles = _.clone(localstyles,true);
// formstyles.formGroup.normal.flexDirection = 'column';
// formstyles.formGroup.error.flexDirection = 'column';
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var Form = t.form.Form;
var FreqType = t.enums({
  '1':'Yearly',
  '2':'Half-yearly',
  '3': 'Quarterly',
  '4': 'Monthly',
  '5': 'Single'
});
var PaymentMethod = t.enums({
    'Cash' : 'Cash',
    'Credit card' : 'Credit card',
    'Bank transfer' : 'Bank transfer',
    'Direct debit' : 'Direct debit',
});
var Payee = t.enums({
    'Policyholder' : 'Policyholder',
    'Life assured' : 'Life assured',
    'Others' : 'Others'
});
var FundSource = t.enums({
    'Salary' : 'Salary',
    'Investment' : 'Investment',
    'Inheritance' : 'Inheritance',
    'Profit' : 'Profit',
    'Others' : 'Others'
})

var Currency = t.enums({
    'Rph' : 'Rupiah',
    'USD' : 'US Dollar'
})
var modelFactory = (self) => {
    var model = t.struct({
      payment_frequency : FreqType,
      payment_method: PaymentMethod,
      payee: Payee,
      fund_source : t.maybe(FundSource),
      bank : t.maybe(t.String),
      branch : t.maybe(t.String),
      acc_owner : t.maybe(t.String),
      acc_no : t.maybe(t.String),
      currency : t.maybe(Currency)
    });
    if (self.state.show_payee_others) {
        model.payee_others = t.maybe(t.String)
    }
    if (self.state.show_fund_source_others) {
        model.fund_source_others = t.maybe(t.String)
     }
    return model
}

var optionsFactory = (self) => {
    var options = {
        template : layout(self),
        fields : {
            payment_frequency : {
                nulloption : false,
                factory : LocalSelect,
            },
            payment_method : {
                nulloption : false,
                factory : LocalSelect,
            },
            payee : {
                nulloption : false,
                factory : LocalSelect
            },
            fund_source : {
                nulloption : false,
                factory : LocalSelect,
                label : 'Source of funds'
            },

            bank : {
                factory : LocalTextbox,
                style : {width:250},
                label : 'Bank'
            },
            branch : {
                factory : LocalTextbox,
                style : {width:250},
                label : 'Branch'
            },
            acc_owner : {
                factory : LocalTextbox,
                style : {width:250},
                label : 'Owner'
            },
            acc_no : {
                factory : LocalTextbox,
                style : {width:150},
                label : 'Account No.'
            },
            currency : {
              factory : LocalSegmentedControls,
              nulloption : { value : '', label : 'Currency'},
              height: 37,
            },

        }
    }
    if (self.state.show_payee_others) {
        options.fields.payee_others = { label : 'Description'}
    }
    if (self.state.show_fund_source_others) {
        options.fields.fund_source_others = { label : 'Description'}
    }

    return options
}
var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        // move these fields offscreen if it is a company so that it cannot be seen
        // let positions = self.state.contactType === 'Company' ? {left:-dw} : {};
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'column',  flex: 0.5}} >
                {inputs.payment_frequency}
                {inputs.payment_method}
                <View style={{flexDirection:'row'}}>
                    {inputs.payee}
                    {self.state.show_payee_others ? input.payee_others : null}
                </View>
                <View style={{flexDirection:'row'}}>
                    {inputs.fund_source}
                    {self.state.show_fund_source_others ? input.fund_source_others : null}
                </View>
            </View>

            <View style={{flexDirection:'column',  flex: 0.5, paddingLeft: 100}} >
                {inputs.bank}
                {inputs.branch}
                {inputs.acc_owner}
                {inputs.acc_no}
                {inputs.currency}
            </View>

        </View>
        );
    }
    return tmpl
}
const TAG = "ProposalS1ExtraPaymentinfoView.";
export default class ProposalS1ExtraPaymentinfoView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
    // toggle the fields to show on the screen
    this.state = {
        show_payee_others : false,
        show_fund_source_others : false,
    };
  }

  onFormChange(raw, path){
    console.log(TAG + "onFormChange", raw, path)
    let values = this.refs.form.validate();
    let tabno = this.uistate.get().proposal.s1.ui.tabno,
        viewno = this.uistate.get().proposal.s1.ui.viewno;

    if (path[0] === 'payee' ) {
        if (raw[path[0]] === 'Others'  && !this.state.show_payee_others) {
            this.setState({show_payee_others:true})
        } else if (raw[path[0]] !== 'Others'  && this.state.show_payee_others) {
            this.setState({show_payee_others:false})
        }
    }
    if (path[0] === 'fund_source') {
        if (raw[path[0]] === 'Others'  && !this.state.show_fund_source_others) {
            this.setState({show_fund_source_others:true})
        } else if (raw[path[0]] !== 'Others'  && this.state.show_fund_source_others) {
            this.setState({show_fund_source_others:false})
        }
    }

  }
  saveProposal(){
      let values = this.refs.form.getValue()
      if (!values) {
          AlertIOS.alert(
            'Errors',
            'Please fix errors and try saving again...',
            [
              {text:'OK', onPress : (txt) => console.log(txt)}
            ],
          );
          return
      }
      // we save the updated doc to uistate and savecontact will take it from there
      let doc = Object.assign( {}, this.uistate.get().proposal.s1.paymentinfo.data, values );
      this.uistate.get().proposal.s1.ui.set({refresh:false});
      this.uistate.get().proposal.s1.paymentinfo.set({data:doc}).now()
      this.props.fns.saveProposal();
  }

  render(){
    Form.stylesheet = formstyles;
    let paymentinfo = _.assign( {}, this.uistate.get().proposal.s1_defaults.paymentinfo,
        this.uistate.get().proposal.s1.paymentinfo.data );
    return (
       <View style={{flexDirection:'column'}}>
              <View style={{flexDirection: 'row', justifyContent:'flex-start', paddingLeft: 20}}>
                  <View style={styles.container}>
                      {/*<Text style={styles.text}>Basic Info</Text> */}
                      <View style={{paddingBottom: 1}}>
                              <Form style={{flexDirection:"column", flex: 1}}
                                ref={"form"}
                                type={modelFactory(this)}
                                options={optionsFactory(this)}
                                value={ paymentinfo }
                                onChange={(raw, path)=> this.formChange(raw,path)}
                              />
                      </View>
                  </View>

              </View>
              {/* put in an action button */}
              <View ref="actionButton" style={[styles.overlay],{left:((0.85*dw)-100), top:-(50)}}>
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
                  {/*<Text style={{color:'white'}}>Save</Text> */}
                  <Icon name={'check'} size={30} color={'white'} />
                  </View>
                </TouchableOpacity>
              </View>
       </View>

    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop : 10,
    borderColor : 'grey',
    borderWidth : 0
  },
  text: {
    fontSize : 20,
    color : 'grey',
    paddingBottom : 10
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

});
