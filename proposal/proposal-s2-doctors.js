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
  AlertIOS
} = React;

import _ from "lodash";
import moment from "moment"
import Button from 'apsl-react-native-button';
import {LocalSelect,LocalDate,LocalSegmentedControls,LocalNumber, LocalTextbox, LocalCheckbox} from "../form/localComponents";
var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;

var ActionButtonItem = require('../components/ActionButtonItem');
var Icon = require('react-native-vector-icons/FontAwesome'),
    t = require('tcomb-form-native'),
    localstyles = require("../localStyles");

var formstyles = _.clone(localstyles,true);
// formstyles.formGroup.normal.flexDirection = 'row';
// formstyles.formGroup.error.flexDirection = 'row';
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var Form = t.form.Form;

var modelDef = (self) => {
 let mapp = {
     visit_date : t.maybe(t.Date),
     treatment : t.maybe(t.String),
     reason : t.maybe(t.String),
     doctor : t.maybe(t.String),
     hospital : t.maybe(t.String),
  }
  return mapp
}
var modelFactory = (self) => {
    var model = t.struct(modelDef(self));
    return model
}
var optionsFactory = (self)  => {
    let model = modelDef(self);

    let options = {
        template : layout(self),
        // auto : 'none',
        fields : {
            visit_date : {factory: LocalDate, label:'Date of recent visit'},
            treatment : {factory: LocalTextbox, style:{width:500}, onFocus:()=> focus(self,'treatment') },
            reason : {factory: LocalTextbox, style:{width:500}, onFocus:()=> focus(self,'reason') },
            doctor : {factory: LocalTextbox, style:{width:500}, onFocus:()=> focus(self,'doctor') },
            hospital : {factory: LocalTextbox, label:"Hospital / Clinic",style:{width:500}, onFocus:()=> focus(self,'hospital') },
        }
    }
    return options
}

function focus(self, ref) {
    onInputFocus(self.refs.form.refs.input,ref,'svdoctor',150);
}
function onInputFocus(self, refName , scrollViewRefName, offset=50, ){
    setTimeout(()=>{
      let handle =   React.findNodeHandle(self.refs[refName]);
      let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(self.refs[refName]),
      //   this.props.offset, //additionalOffset
      offset,
        true
      );
  }, 150);
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        let s2 = self.uistate.get().proposal.s2;

        return (
                <View style={{height:dh}}>
                <ScrollView ref="svdoctor" style={{flex:1, flexDirection:'column'}} >

                    <View style={{flexDirection:'column',  flex: 1}} >
                    {inputs.visit_date}
                    {inputs.treatment}
                    {inputs.reason}
                    {inputs.doctor}
                    {inputs.hospital}
                    </View>

                </ScrollView>
                </View>
        );
    }
    return tmpl
}

const TAG="ProposalS2DoctorView.";
export default class ProposalS2DoctorView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.state = {}
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
  }

  onFormChange(raw, path){
      let fname = path[0];
      let questions = ['visit_date', 'treatment', 'reason', 'doctor','hospital']
      // if (['q2_yesno','q3_yesno','q4_yesno','q4_yesno','q7_yesno','q9_yesno'].indexOf(fname) >= 0 ) {
      if (questions.indexOf(fname) >= 0 ) {
          this.uistate.get().proposal.s2.ui.set({refresh:false}).now()
          let mapp = {};
          _.forEach(questions,(q) => { mapp[q] = raw[q] } );
          this.uistate.get().proposal.s2.doctor.questions.set(mapp).now()
          let vals = {refresh:true}
          this.uistate.get().proposal.s2.ui.set(vals).now();
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
      //   'default'
      );
  }
  saveProposal(){
      let values = this.refs.form.getValue()
      if (!values) {
          this.alert('Please fix errors and try saving again');
          return
      }
      // do some work later --
      let doc = Object.assign( {}, this.uistate.get().proposal.s2.doctor.questions, values );
      this.uistate.get().proposal.s2.ui.set({refresh:false}).now()
      this.uistate.get().proposal.s2.doctor.set({questions:doc}).now()
      this.props.fns.saveProposal();
  }

  render(){
    Form.stylesheet = formstyles;
    let row = Object.assign( {},this.uistate.get().proposal.s2_defaults.doctor,
                                this.uistate.get().proposal.s2.doctor.questions);
    return (
       <View style={{flexDirection:'column', justifyContent:'flex-start', paddingBottom:0, marginBottom:0}}>
              <ScrollView style={{flexDirection: 'row' , paddingLeft: 20}}>
                  <View style={[styles.container]}>
                      <ScrollView offset={200} style={{paddingBottom: 1}}>
                              <Form style={{flexDirection:"column", flex: 1}}
                                ref={"form"}
                                type={modelFactory(this)}
                                options={optionsFactory(this)}
                                value={ row }
                                onChange={(raw, path)=> this.formChange(raw,path)}
                              />
                      </ScrollView>
                  </View>
              </ScrollView>
              {/* put in an action button */}
              <View ref="actionButton" style={[styles.overlay],{left:((dw*0.85)-80), top:-(dh/2)}}>
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
    fontSize : 18,
    color : 'grey',
    paddingTop : 10,
},
smltext: {
  fontSize : 17,
  color : 'grey',
  paddingTop : 10,
  // width : (dw*0.85) - 100
},
separator: {
  height: 2,
  width : dw,
  backgroundColor: '#CCCCCC',
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
