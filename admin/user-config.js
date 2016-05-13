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

var modelFactory = (self) => {
    var model = t.struct({
      agentCode : t.String,
      agentName: t.String,
      organId : t.String,
    });
    return model;
}

function focus(self, refName, scrollViewRefName='container', offset=150, ){
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
            agentCode : {label : 'Agent #', autoCorrect: false, autoCapitalize: "none",
                        onFocus : () => focus(self, 'agentCode')  },
            agentName : {label : 'Agent Name', autoCorrect: false,autoCapitalize: "none",
                        onFocus : () => focus(self, 'agentName')  },
            organId : {label : 'Organization Code', autoCorrect: false,autoCapitalize: "none",
                        onFocus : () => focus(self, 'organId')  },

        }
    }
    return options
}
var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'column',  flex: 1}} >
                {inputs.agentCode}
                {inputs.agentName}
                {inputs.organId}
            </View>
        </View>
        );
    }
    return tmpl
}

const TAG = "UserConfigView.";
export default class UserConfigView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
    let data = _.assign({}, this.uistate.get().admin_defaults.userConfig, this.uistate.get().admin.userConfig.data);
    this.state = { value : data };
  }
  componentDidMount() {
      console.log(TAG+"componentDidMount");
  }

  onFormChange(raw, path){
      let values = this.refs.form.getValue();
      if (values) {
          let data = this.state.value;
          data[ path[0]] = raw[ path[0]];
          this.setState({value:data});
      }
  }
  alert(msg=null, type) {
      let message = msg ? msg : 'Please fix the errors, before moving to the next view'
      let etype = type ? type : 'Error'
      AlertIOS.alert(
        etype,
        message,
        [
            {text:'OK'}
        ],
      );
  }

  saveConfig(){
      let values = this.refs.form.getValue();
      if (!values) {
          let error = this.refs.form.validate();
          let msgs = error.errors.map( (err) => '[' + err.path[0] + '] :' + err.message) ,
              msg = msgs.join(". ");
          this.alert("Please fix errors :" + msg );
          return
      }
      let doc = Object.assign( {}, this.uistate.get().admin.userConfig.data, values );
      this.uistate.get().admin.ui.set({refresh:false});
      this.uistate.get().admin.userConfig.set({data:doc}).now()
      this.props.fns.saveConfig();
  }

  render(){
    BasicForm.stylesheet = formstyles;
    return (
       <View style={{flexDirection:'column'}}>
              <View style={{flexDirection: 'row', justifyContent:'flex-start', paddingLeft: 20}}>
                  <ScrollView ref="container" style={styles.container}>
                      {/*<Text style={styles.text}>Basic Info</Text> */}
                      <View style={{paddingBottom: 1, height:dh}}>
                              <BasicForm style={{flexDirection:"column", flex: 1}}
                                ref={"form"}
                                type={modelFactory(this)}
                                options={optionsFactory(this)}
                                value={ this.state.value }
                                onChange={(raw, path)=> this.formChange(raw,path)}
                              />
                      </View>
                  </ScrollView>

              </View>
              {/* put in an action button */}
              <View ref="actionButton" style={[styles.overlay],{left:((dw)-100), top:-(dh/2)}}>
                <TouchableOpacity activeOpacity={0.5} onPress={()=> this.saveConfig()}
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
