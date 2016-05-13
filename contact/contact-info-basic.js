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
  AlertIOS
} = React;

import _ from "lodash";
import moment from "moment"
import Button from 'apsl-react-native-button';
import { getColl, getDb } from "../db"
import {LocalSelect,LocalDate,LocalSegmentedControls,LocalNumber,LocalPicker, LocalCalendar } from "../form/localComponents";
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
var BasicForm = t.form.Form;
var Gender = t.enums({
  'Male':'Male',
  'Female':'Female'
});
var ContactType = t.enums({
  'Person':'Person',
  'Company':'Company'
});

var model = t.struct({
  type : ContactType,
  name: t.String,
  dob: t.maybe(t.Date),
  gender : t.maybe(Gender),
  smoker : t.Boolean,
  salutation : t.maybe(t.enums({
      'Mr.'  : 'Mr.',
      'Mrs' : 'Mrs',
      'Ms'  : 'Ms',
      'Master' : 'Master'
  }))
});

function focus(self, refName, scrollViewRefName='container', offset=100, ){
    setTimeout(()=>{
      let handle =   React.findNodeHandle(self.refs.form.refs.input.refs[refName]);
      let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(handle), offset, true );
    }, 150);
}

var optionsFactory = (self) => {
    var options = {
        template : layout(self),
        fields : {
            salutation : {
                nulloption : false,
                // factory : LocalSelect
                factory : LocalPicker,
                // title : 'Salutation'

            },
            type : {
                factory : LocalSegmentedControls,
                nulloption : { value : '', label : 'Contact type'},
                height: 37,
                label : 'Contact type'
            },
            dob : {
                // factory : LocalDate,
                factory : LocalCalendar,
                startYear : 1950,
                endYear : 2020,
                label : 'Date of birth / registration',
                onFocus:()=> focus(self,'dob'),
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
                <View style={positions}>
                    {inputs.gender}
                    {inputs.smoker}
                    {inputs.salutation}
                </View>
                {inputs.dob}
            </View>
        </View>
        );
    }
    return tmpl
}


export default class ContactBasicView extends React.Component {
  constructor(props){
    super(props);
    this.form0 = null;
    this.form1 = null;
    this.uistate = require("../state");
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
    this.state = {contactType : this.uistate.get().contactinfo.doc.data.type || 'Person'};
  }

  onFormChange(raw, path){
    // console.log("onFormChange", raw, path)
    let values = this.refs.form.validate();
    if (path[0] === 'type' && raw.type !== this.state.contactType) {
        this.uistate.get().contactinfo.set({refresh:false})
        this.uistate.get().contactinfo.doc.set({type: raw.type})
        this.uistate.get().contactinfo.set({refresh:true})
        this.setState({contactType : raw.type})
    }

  }
  saveContact(){
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
      let doc = Object.assign( {}, this.uistate.get().contactinfo.doc.data, values );
      this.uistate.get().contactinfo.set({refresh:false}).doc.set({data:doc}).now()
      this.props.fns.saveContact();
  }

  render(){
    BasicForm.stylesheet = formstyles;
    let contact = this.uistate.get().contactinfo.doc.data;
    return (
       <View style={{flexDirection:'column'}}>
              <View style={{flexDirection: 'row', justifyContent:'flex-start', paddingLeft: 20}}>
                  <ScrollView ref="container" style={styles.container}>
                      {/*<Text style={styles.text}>Basic Info</Text> */}
                      <View style={{paddingBottom: 1, height:dh}}>
                              <BasicForm style={{flexDirection:"column", flex: 1}}
                                ref={"form"}
                                type={model}
                                options={optionsFactory(this)}
                                value={ contact }
                                onChange={(raw, path)=> this.formChange(raw,path)}
                              />
                      </View>
                  </ScrollView>

              </View>
              {/* put in an action button */}
              <View ref="actionButton" style={[styles.overlay],{left:((0.85*dw)-100), top:-(dh-400)}}>
                <TouchableOpacity activeOpacity={0.5} onPress={()=> this.saveContact()}
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
    borderWidth : 0,
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
