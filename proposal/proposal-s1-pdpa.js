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
     pdpa_ok : t.maybe(t.Boolean)
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
        auto : 'none',
        fields : {
            pdpa_ok : {factory: LocalCheckbox},
        }
    }
    return options
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        let s1 = self.uistate.get().proposal.s1;

        return (
                <View style={{height:dh}}>
                <View style={{flex:1, flexDirection:'column'}} >

                    <View style={{flexDirection:'column',  flex: 1}} >
                        {/* start of questions , start with q1*/}
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.85, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:(dw*0.85)-200}]}>
                                    Sekiranya Penanggung, dalam rangka memperluas jaringan usahanya, bermaksud memberikan
                                    dan/atau menyampaikan informasi peribadi, saya/kami kepada pihak lain sebagai mitra
                                    dari penanggung, dengan memahami tujuan dan konsekuensinya, saya menyatakan saya/kami
                                    tidak keberatan dan besedia untuk setiap saat untuk menerima informasi produk dan jasa
                                    keuangan yang di-sampaikan oleh mitra penanggung baik melalui surat, telepon,
                                    maupan media lainnya.
                                    </Text>
                            </View>
                            <View style={{flex:0.15, paddingLeft:0}}>{inputs.pdpa_ok}</View>
                        </View>

                    </View>

                </View>
                </View>
        );
    }
    return tmpl
}

const TAG="ProposalS1PdpaView.";
export default class ProposalS1PdpaView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.state = {}
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
  }

  onFormChange(raw, path){
      let fname = path[0];
      let questions = ['pdpa_ok']
      // if (['q2_yesno','q3_yesno','q4_yesno','q4_yesno','q7_yesno','q9_yesno'].indexOf(fname) >= 0 ) {
      if (questions.indexOf(fname) >= 0 ) {
          this.uistate.get().proposal.s1.ui.set({refresh:false}).now()
          let mapp = {};
          _.forEach(questions,(q) => { mapp[q] = raw[q] } );
          this.uistate.get().proposal.s1.pdpa.questions.set(mapp).now()
          let vals = {refresh:true}
          this.uistate.get().proposal.s1.ui.set(vals).now();
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
      let doc = Object.assign( {}, this.uistate.get().proposal.s1.pdpa.questions, values );
      this.uistate.get().proposal.s1.ui.set({refresh:false}).now()
      this.uistate.get().proposal.s1.pdpa.set({questions:doc}).now()
      this.props.fns.saveProposal();
  }

  render(){
    Form.stylesheet = formstyles;
    let row = Object.assign( {},this.uistate.get().proposal.s1_defaults.pdpa,
                                this.uistate.get().proposal.s1.pdpa.questions);
    return (
       <View style={{flexDirection:'column', justifyContent:'flex-start', paddingBottom:0, marginBottom:0}}>
              <View style={{flexDirection: 'row' , paddingLeft: 20, height: dh-100 }}>
                  <ScrollView style={[styles.container]}>
                      <View offset={200} style={{paddingBottom: 100}}>
                              <Form style={{flexDirection:"column", flex: 1}}
                                ref={"form"}
                                type={modelFactory(this)}
                                options={optionsFactory(this)}
                                value={ row }
                                onChange={(raw, path)=> this.formChange(raw,path)}
                              />
                      </View>
                  </ScrollView>
              </View>
              {/* put in an action button */}
              <View ref="actionButton" style={[styles.overlay],{left:((dw*0.85)-80), top:-(200)}}>
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
