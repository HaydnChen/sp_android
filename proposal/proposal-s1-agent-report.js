'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  ListView,
  NetInfo,
  AlertIOS
} = React;

import _ from "lodash";
import moment from "moment"
import Button from 'apsl-react-native-button';
import {LocalSelect,LocalDate,LocalTextbox, LocalSegmentedControls,LocalNumber, LocalPicker} from "../form/localComponents";
var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;
import populateProposalSubmission from "./proposal-submission"

var ActionButtonItem = require('../components/ActionButtonItem');
var Icon = require('react-native-vector-icons/FontAwesome'),
    t = require('tcomb-form-native'),
    localstyles = require("../localStyles");

var formstyles = _.clone(localstyles,true);
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var Form = t.form.Form;
var Purpose = t.enums({
  'Protection':'Personal / Family Protection',
  'Education':'Children education',
  'Mortgage': 'Mortgaga loan',
  'Keyman': 'Business / Keyman cover',
  'Others': 'Others'
});
var modelFactory = (self) => {
    var model = t.struct({
      policyHolder : t.maybe(t.String),
      yearsKnown: t.maybe(t.Number),
      related : t.Boolean,
      annualIncome : t.maybe(t.Number),
      netWorth : t.maybe(t.Number),
      hasProsecution : t.Boolean,
      purpose : t.maybe(Purpose),
      otherFactors : t.Boolean,
      otherText : t.maybe(t.String),
      rop : t.Boolean,
      ropText : t.maybe(t.String)
    });
    return model
}

var optionsFactory = (self) => {
    var options = {
        template : layout(self),
        fields : {
            policyHolder : {
                factory : LocalTextbox,
                editable : false,
                label : '1.Name of life assured / policyholder',
                style : { width : 300 }
            },
            yearsKnown : {
                factory : LocalNumber,
                label : '2. How long have you known the life assured / policyholder'
            },
            related : {
                label : '3. Is the life assured / policyholder related to you or any other FA representative in eBaotech?'
            },
            annualIncome : {
                factory : LocalNumber,
                label : '4. Please provide estimated annual income for the life assured / policyholder',
                onFocus : () => focus(self, 'annualIncome'),

            },

            netWorth : {
                factory : LocalNumber,
                label : '5. Please provide the estimated net worth of life assured / policyholder',
                onFocus : () => focus(self, 'netWorth'),
            },
            hasProsecution : {
                label : '6. To the best of your knowledge, has the life assured / policyholder ever been prosecuted or convicted of any crime?'
            },
            purpose : {
                factory : LocalSegmentedControls,
                label : '7. Purpose of insurance',
                width : dw-100
            },
            otherFactors : {
                label : '8. Are you aware of any factors which you feel is not apparent from the application form, which could affect the underwriting / acceptance of the policy?'
            },
            otherText : {
                factory : LocalTextbox,
                multiline: true,
                style : {width:dw-200, height:100},
                onFocus : () => focus(self, 'otherText'),
                label : ''
            },
            rop : {
              label : '9. I hereby declare that this application is not intended to replace any existing policy/ies.'
            },
            ropText : {
                factory : LocalTextbox,
                multiline: true,
                style : {width:dw-200, height:100},
                onFocus : () => focus(self, 'ropText','container',120),
                label : 'Reason is because :'

            }

        }
    }

    return options
}

function focus(self, refName, scrollViewRefName='container', offset=150, ){
  setTimeout(()=>{
    let handle =   React.findNodeHandle(self.refs.form.refs.input.refs[refName]);
    let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      React.findNodeHandle(handle), offset, true );
  }, 150);
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'column'}} >
            <View style={{flexDirection:'column',  flex: 1}} >
                {inputs.policyHolder}
                {inputs.yearsKnown}
                {inputs.related}
                {inputs.annualIncome}
                {inputs.netWorth}
                {inputs.hasProsecution}
                {inputs.purpose}
                {inputs.otherFactors}
                {self.state.otherFactors ? inputs.otherText : <View />}
                {inputs.rop}
                {self.state.rop ? inputs.ropText : <View />}

            </View>

        </View>
        );
    }
    return tmpl
}
const TAG = "ProposalS1AgentReportView.";
export default class ProposalS1AgentReportView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
    // toggle the fields to show on the screen
    this.state = {
        otherFactors : false,
        rop : false,
        isSubmitting : false
    };
  }

  onFormChange(raw, path){
    console.log(TAG + "onFormChange", raw, path, raw[ path[0]] )
    let values = this.refs.form.validate();
    // let tabno = this.uistate.get().proposal.s1.ui.tabno,
    //     viewno = this.uistate.get().proposal.s1.ui.viewno;

    if (path[0] === 'otherFactors' ) {
        // if (raw[path[0]] ) {
            // console.log("onFormChanged ", path[0], raw[ path[0]], raw);
            this.setState({otherFactors: raw[path[0]]})
        // }
    }
    if (path[0] === 'rop') {
        // if (raw[path[0]] ) {
            this.setState({rop: raw[path[0]] });
        // }
    }

  }
  saveProposal(callback){
      let values = this.refs.form.getValue()
      if (!values) {
          if (callback) {
              this.alert("There are errors, please fix them first before submitting")
          } else {
              this.alert("There are errors, please fix them first before saving")
          }
          return
      }
      // we save the updated doc to uistate and savecontact will take it from there
      let doc = Object.assign( {}, this.uistate.get().proposal.s1.agentReport, values );
      this.uistate.get().proposal.s1.ui.set({refresh:false});
      this.uistate.get().proposal.s1.set({agentReport:doc}).now()
      this.props.fns.saveProposal(callback);

  }
 createProposalSubmission(cb) {
    //   console.log("createProposalSubmission....entry")
      let callback = (submissionDoc) => {

          let submissionCallback = (status) => {
              if (status.ok) {
                  cb({status:'ok'});
              } else {
                  cb({'status': 'ko'});
              }
          }

          let proposal = this.uistate.get().proposal.s1.ui.proposal;
          this.props.fns.createProposalSubmission(submissionDoc, proposal, submissionCallback);
                    
      }

      let submissionDoc = populateProposalSubmission(callback);
    //   console.log("createProposalSubmission....after creating submissionDoc")
      // for the moment, we just save it and that is considered to be submitted, delegate back to proposal-s1-home,
      // get a callback
  }
  alert(msg=null,title="Error") {
      let message = msg ? msg : 'Please fix the errors, before moving to the next view'
      AlertIOS.alert(
        title,
        message,
        [
          {text:'OK', onPress : (txt) => console.log(txt)}
        ],
        // 'default'
      );
  }
  submitProposal() {
      // define callback which will be called when the proposal is saved OK
      var self = this;
      var callback = (result) => {
          // do the submission here
        //   console.log("***SubmitProposal callback")
          if (result.status === 'ok') {
              try {
                  this.setState({isSubmitting: true});
                  // need to create a new document with docType = 'proposalSubmission'
                  let cb = (res) => {
                      if (res.status === 'ok') {
                          this.alert("Proposal was successfully saved and submitted", "Information")
                      } else {
                          this.alert("Unable to submit proposal, erorr : " + res.error)
                      }
                      this.setState({isSubmitting: false});
                  }

                  this.createProposalSubmission(cb)

              } catch (err) {
                  this.alert("Unable to submit proposal : err " + err);
              }
          } else {
              this.alert ("Unable to save proposal : error "  + result.error)
          }
      }
      // check to see if there is any network, if none, then do not bother
      NetInfo.fetch().done( (reach) => {
          if (reach === 'wifi' || reach === 'cell') {
              self.saveProposal(callback)
          } else {
              self.alert("Please check your internet connection before submitting again")
          }
      })


  }

  render(){
    Form.stylesheet = formstyles;
    let row = _.assign( {}, this.uistate.get().proposal.s1_defaults.agentReport,
        this.uistate.get().proposal.s1.agentReport );

    // latest values for these 2 fields are from state
    row.otherFactors = this.state.otherFactors;
    row.rop = this.state.rop;

    let ph = this.uistate.get().proposal.s1.ph.data;
    if (!row.policyHolder) {
        row.policyHolder = ph.name;
    }

    return (
       <View style={{flexDirection:'column'}}>
              <View style={{flexDirection: 'row', justifyContent:'flex-start', paddingLeft: 20, height:dh-100}}>
                  <ScrollView ref="container" style={styles.container}>
                      {/*<Text style={styles.text}>Basic Info</Text> */}
                      <View style={{paddingBottom: 200}}>
                              <Form style={{flexDirection:"column", flex: 1}}
                                ref={"form"}
                                type={modelFactory(this)}
                                options={optionsFactory(this)}
                                value={ row }
                                onChange={(raw, path)=> this.formChange(raw,path)}
                              />

                              <Button style={{width:dw*0.6, alignSelf: 'center', backgroundColor: '#3498db', borderColor:'white'}} textStyle={{fontSize: 18, color: 'white'}}
                                isLoading={this.state.isSubmitting} onPress={()=> {this.submitProposal()} }>
                                Submit Proposal
                              </Button>
                      </View>

                  </ScrollView>

              </View>
              {/* put in an action button */}
              <View ref="actionButton" style={[styles.overlay],{left:((dw/1)-80), top:-(220)}}>
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
