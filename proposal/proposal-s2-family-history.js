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
  q1 : t.maybe(t.Boolean),
  q2 : t.maybe(t.String),
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
            q1 : {factory: LocalCheckbox},
            q2 : {factory: LocalTextbox, multiline:true, style:{width:dw-200, height:200}},
        }
    }
    return options
}

function focus(self, ref) {
    onInputFocus(self.refs.form.refs.input,ref,'svh',150);
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
                <ScrollView ref="svf" style={{flex:1, flexDirection:'column'}} >

                    <View style={{flexDirection:'column',  flex: 1}} >
                        {/* start of questions , start with q1*/}
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw-200}]}>
                                        1. Apakah ada diantara anggota, keluarga anda (orang tua, anak, saudara kandung)
                                        menderita kelainan jantung koroner, stroke, diabetes melitus, kanker atau penyakit
                                        keturunan lainnya? Jika ya, jelaskan siapa (hubungan keluarga) diagnosa, kondisi
                                        kesehatan saat ini (jika masih hidup), penyebab kemation (jika suda meninggal dunia)
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1}</View>
                        </View>

                        <View style={styles.separator} />

                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw-200}]}>
                                        Apabila ada informasi lain yang belum dicantumkan pada pertanyaan di atas atau
                                        pertanyaan di atas yang dijawab ya, jelaskan dengan menggunakan 5W+1H (Apa, Kapan
                                        , Dimana, Mengapa, Siapa dan Bagaimana)
                                    </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                            {inputs.q2}
                            </View>
                        </View>

                    </View>

                </ScrollView>
                </View>
        );
    }
    return tmpl
}

const TAG="ProposalS2FamilyHistoryView.";
export default class ProposalS2FamilyHistoryView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.state = {}
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
  }

  onFormChange(raw, path){
    // let result = this.refs.form.validate();
    let fname = path[0];
    let questions = _.map( _.keys(raw), (f) => /^q\d+/.test(f) ? f : null ).filter((item) => item) ;
    // if (['q2_yesno','q3_yesno','q4_yesno','q4_yesno','q7_yesno','q9_yesno'].indexOf(fname) >= 0 ) {
    if (questions.indexOf(fname) >= 0 ) {
        this.uistate.get().proposal.s2.ui.set({refresh:false}).now()
        let mapp = {};
        _.forEach(questions,(q) => { mapp[q] = raw[q] } );
        this.uistate.get().proposal.s2.family_hist.questions.set(mapp).now()
        //let vals = _.assign({}, _.pick(raw,questions))
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
      let doc = Object.assign( {}, this.uistate.get().proposal.s2.family_hist.questions, values );
      this.uistate.get().proposal.s2.ui.set({refresh:false}).now()
      this.uistate.get().proposal.s2.family_hist.set({questions:doc}).now()
      this.props.fns.saveProposal();

  }

  render(){
    Form.stylesheet = formstyles;
    let row = Object.assign( {},this.uistate.get().proposal.s2_defaults.family_hist,
                                this.uistate.get().proposal.s2.family_hist.questions);
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
              {/* put in an action button */}
              <View ref="actionButton" style={[styles.overlay],{left:((dw)-100), top:-(450)}}>
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
