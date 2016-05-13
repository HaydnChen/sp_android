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
import {LocalSelect,LocalDate,LocalSegmentedControls,LocalNumber} from "../form/localComponents";
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
var Gender = t.enums({
  'Male':'Male',
  'Female':'Female'
});
var ContactType = t.enums({
  'Person':'Person',
  'Company':'Company'
});

var modelFactory = (self) => {
    var model = t.struct({
      type : ContactType,
      name: t.String,
      dob: t.maybe(t.Date),
      gender : t.maybe(Gender),
      smoker : t.Boolean,
      salutation : t.maybe(t.enums({
          'Mr'  : 'Mr.',
          'Mrs' : 'Mrs',
          'Ms'  : 'Ms',
          'Master' : 'Master'
      }))
    });
    return model
}

var optionsFactory = (self) => {
    var options = {
        template : layout(self),
        fields : {
            salutation : {
                nulloption : false,
                factory : LocalSelect
            },
            type : {
                factory : LocalSegmentedControls,
                nulloption : { value : '', label : 'Contact type'},
                height: 37,
                label : 'Contact type'
            },
            dob : {
                factory : LocalDate,
                label : 'Date of birth / registration',
            },
            gender : {
              factory : LocalSegmentedControls,
              nulloption : { value : '', label : 'Gender of person'},
              height: 37,
            },

        }
    }
    return options
}
var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        // move these fields offscreen if it is a company so that it cannot be seen
        let positions = self.state.contactType === 'Company' ? {left:-dw} : {};
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'column',  flex: 1}} >
                {inputs.type}
                {inputs.name}
                {inputs.dob}
                <View style={positions}>
                    {inputs.gender}
                    {inputs.smoker}
                    {inputs.salutation}
                </View>
            </View>
        </View>
        );
    }
    return tmpl
}
const TAG = "ProposalS1PhBasicView.";
export default class ProposalS1PhBasicView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
    // toggle the fields to show on the screen
    this.state = {
        phContactType : this.uistate.get().proposal.s1.ph.data.type || 'Person',
        laContactType : this.uistate.get().proposal.s1.la.data.type || 'Person'
    };
  }

  onFormChange(raw, path){
    console.log(TAG + "onFormChange", raw, path)
    let values = this.refs.form.validate();
    let tabno = this.uistate.get().proposal.s1.ui.tabno,
        viewno = this.uistate.get().proposal.s1.ui.viewno;

    if (path[0] === 'type' ) {
        if (tabno === 0  && viewno === 0) {
            this.setState({ phContactType : raw.type})
        } else if (tabno === 1 && viewno === 0) {
            this.setState({ laContactType : raw.type})
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
            // 'default'
          );
          return
      }
      // we save the updated doc to uistate and savecontact will take it from there
      let doc = Object.assign( {}, this.uistate.get().proposal.s1.ph.data, values );
      this.uistate.get().proposal.s1.ui.set({refresh:false});
      this.uistate.get().proposal.s1.ph.set({data:doc}).now()
      this.props.fns.saveProposal();
  }

  render(){
    Form.stylesheet = formstyles;
    let proposal = this.uistate.get().proposal.s1.ph.data;
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
                                value={ proposal }
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
