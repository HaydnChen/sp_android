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
import KeyboardHandler from "../keyboard-handler.js"

var ActionButtonItem = require('../components/ActionButtonItem');
var Icon = require('react-native-vector-icons/FontAwesome'),
    t = require('tcomb-form-native'),
    localstyles = require("../localStyles");

var formstyles = _.clone(localstyles,true);
formstyles.formGroup.normal.flexDirection = 'row';
formstyles.formGroup.error.flexDirection = 'row';
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var Form = t.form.Form;

var modelDef = (self) => {
 let mapp = {
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

    }
    return options
}

// function focus(self, ref) {
//     onInputFocus(self.refs.form.refs.input,ref,'svh',150);
// }
// function onInputFocus(self, refName , scrollViewRefName, offset=50, ){
//     setTimeout(()=>{
//       let handle =   React.findNodeHandle(self.refs[refName]);
//       let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
//       scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
//         React.findNodeHandle(self.refs[refName]),
//       //   this.props.offset, //additionalOffset
//       offset,
//         true
//       );
//   }, 150);
// }

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        let s1 = self.uistate.get().proposal.s1;

        return (
                <View style={{height:dh}}>
                <View  style={{flex:1, flexDirection:'column'}} >

                    <View style={{flexDirection:'column',  flex: 1}} >
                        {/* start of questions , start with q1*/}
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:1, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw*0.85-200}]}>
                                    1. Penanggung akan memberikan manfaat berupa santunan sebagimana tercantum
                                    di bawah ini apabila calun tertanggung meninggal dunia sebelum tanggal pernerbitan
                                    Polis ("Perlindungan Asuransi Sementara") dengan ketentuan :
                                    </Text>
                            </View>
                        </View>
                        <View style={{paddingLeft: 10, flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:1, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                    - SPAJ telah dilengkapi dan ditandatangani olen calon pemegang polis dan calon tertanggung
                                    </Text>
                            </View>
                        </View>
                        <View style={{paddingLeft: 10, flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:1, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                    - Premi pertama telah dibayar lunas dan telah diterima serta tercatat dengain baik oleh
                                    penanggung
                                    </Text>
                            </View>
                        </View>
                        <View style={{paddingLeft: 10, flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:1, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                    - Seluruh hasil pemeriksaan kesehatan dan dokumen terkait lainnya yang
                                    dipersyaratkan dari calon tertanggung telah diterima dan dinyatakan lengkap
                                    oleh penanggung; dan
                                    </Text>
                            </View>
                        </View>
                        <View style={{paddingLeft: 10, flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:1, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                    - Calon tertanggung memenuhi kriteria untuk dapat diasuransikan oleh penanggung
                                    </Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:1, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw*0.85-200}]}>
                                    2. Santunan tidak akan dibayarkan jika calon.........
                                    </Text>
                            </View>
                        </View>

                    </View>

                </View>
                </View>
        );
    }
    return tmpl
}

const TAG="ProposalS1TemporaryView.";
export default class ProposalS1TemporaryView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.state = {}
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
  }

  onFormChange(raw, path){
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
  }

  render(){
    Form.stylesheet = formstyles;
    let row = {} ; //Object.assign( {},this.uistate.get().proposal.s1_defaults.family_hist,
                    //            this.uistate.get().proposal.s2.family_hist.questions);
    return (
       <View style={{flexDirection:'column', justifyContent:'flex-start', paddingBottom:0, marginBottom:0}}>
              <View style={{flexDirection: 'row' , paddingLeft: 20}}>
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
