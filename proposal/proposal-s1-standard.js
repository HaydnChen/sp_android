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
  q1_height : t.Number,
  q1_weight : t.Number,
  q2_yesno : t.maybe(t.Boolean),
  q2a : t.maybe(t.String),
  q2b : t.maybe(t.String),
  q2c : t.maybe(t.String),
  q2d : t.maybe(t.String),
  q3_yesno : t.maybe(t.Boolean),
  q3a : t.maybe(t.String),
  q3b : t.maybe(t.String),
  q3c : t.maybe(t.String),
  q4_yesno : t.maybe(t.Boolean),
  q4a : t.maybe(t.String),
  q4b : t.maybe(t.String),
  q4c : t.maybe(t.String),
  q4d : t.maybe(t.String),
  q5_yesno : t.maybe(t.Boolean),
  q6_yesno : t.maybe(t.Boolean),
  q7_yesno : t.maybe(t.Boolean),
  q7a : t.maybe(t.String),
  q8_yesno : t.maybe(t.Boolean),
  q9_yesno : t.maybe(t.Boolean),
  q9a : t.maybe(t.String),
  q10_yesno : t.maybe(t.Boolean),
  q11_yesno : t.maybe(t.Boolean),
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
            q1_height : {factory : LocalNumber, style : {width:50} },
            q1_weight : {factory : LocalNumber, style : {width:50} },
            q2_yesno : {factory: LocalCheckbox},
            q3_yesno : {factory: LocalCheckbox},
            q4_yesno : {factory: LocalCheckbox},
            q5_yesno : {factory: LocalCheckbox},
            q6_yesno : {factory: LocalCheckbox},
            q7_yesno : {factory: LocalCheckbox},
            q8_yesno : {factory: LocalCheckbox},
            q9_yesno : {factory: LocalCheckbox},
            q10_yesno : {factory: LocalCheckbox},
            q11_yesno : {factory: LocalCheckbox},
            q2a : {factory : LocalTextbox, style : {width:100}, label: '' , onFocus : () => focus(self,'q2a') },
            q2b : {factory : LocalTextbox, style : {width:200} },
            q2c : {factory : LocalTextbox, style : {width:60} },
            q2d : {factory : LocalTextbox, style : {width:60} },
            q3a : {factory : LocalTextbox, style : {width:200} , onFocus : () => focus(self,'q3a') },
            q3b : {factory : LocalTextbox, style : {width:80} },
            q3c : {factory : LocalTextbox, style : {width:80} },
            q4a : {factory : LocalTextbox, style : {width:300}, onFocus : () => focus(self,'q4a') },
            q4b : {factory : LocalTextbox, style : {width:200} },
            q4c : {factory : LocalTextbox, style : {width:50} },
            q4d : {factory : LocalTextbox, style : {width:50} },
            q7a : {factory : LocalTextbox, style : {width:80} , onFocus : () => focus(self,'q7a') },
            q9a : {factory : LocalTextbox, style : {width:300}, onFocus : () => focus(self,'q9a')},
        }
    }
    return options
}

function onInputFocus(self, refName , scrollViewRefName, offset=350, ){
    setTimeout(()=>{
      let handle =   React.findNodeHandle(self.refs[refName]);
      let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(self.refs[refName]),
      //   this.props.offset, //additionalOffset
      offset,
        true
      );
    }, 50);
  }


function focus(self, refName, scrollViewRefName='container', offset=200, ){
  setTimeout(()=>{
    let handle =   React.findNodeHandle(self.refs.form.refs.input.refs[refName]);
    let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      React.findNodeHandle(handle), offset, true );
  }, 150);
}


function q2focus(e) {
    // console.log("focus",e)
    // debugger;
    onInputFocus(this.refs.form.refs.input,'q2a','sv',150);
    // this.refs.scroll.focused(this.refs.form.refs.input,'q2a')
    // this.refs.scroll.refs.scrollView.scrollTo({y:100})
    // this.refs.scroll.scrollTo({y:200})
}
function q3focus(e) {
    onInputFocus(this.refs.form.refs.input,'q3a','sv',150);
    // this.refs.scroll.focused(this.refs.form.refs.input,'q3a',this);
    //this.refs.scroll.refs.scrollView.scrollTo({y:200})
}
function q4focus(e) {
    // this.refs.scroll.focused(this.refs.form.refs.input,'q4a',this);
    onInputFocus(this.refs.form.refs.input,'q4a','sv',150);
    // this.refs.scroll.refs.scrollView.scrollTo({y:400})
}
function q7focus(e) {
    onInputFocus(this.refs.form.refs.input,'q7a','sv',150);
    // this.refs.scroll.focused(this.refs.form.refs.input,'q7a',this);
    // this.refs.scroll.inputFocused(this.refs.form.refs.input,'q2a',this);
    // this.refs.scroll.refs.scrollView.scrollTo({y:100}) }
// function q9focus(e) { this.refs.scroll.inputFocused(this.refs.form.refs.input,'q9a',this) }
}
function q9focus(e) {
    // this.refs.scroll.focused(this.refs.form.refs.input,'q9a',this);
    onInputFocus(this.refs.form.refs.input,'q9a','sv',150);

    // this.refs.scroll.refs.scrollView.scrollTo({y:150})
}

var q2 = (self,inputs) => {
    return <View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'column', flex:0.6, justifyContent:'flex-start'}}>
                            <Text style={[styles.smltext]}>
                                Sebutkan berapa yang anda mengkosumsi dalam seminggu ?
                            </Text>
                    </View>
                    <View style={{flex:0.2, paddingLeft:10}}>{inputs.q2a}</View>
                    <View style={{flex: 0.2,paddingLeft:2}}>
                        <Text style={styles.text}>ml</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'column', flex:0.15, justifyContent:'flex-start'}}>
                            <Text style={[styles.smltext]}>
                                Jenis alkohol
                            </Text>
                    </View>
                    <View style={{flex:0.3, paddingLeft:10}}>{inputs.q2b}</View>
                    <View style={{flex: 0.2,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>sudah berapa lama</Text>
                    </View>
                    <View style={{flex:0.12, paddingLeft:5}}>{inputs.q2c}</View>
                    <View style={{flex: 0.05,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>Thn</Text>
                    </View>
                    <View style={{flex:0.1, paddingLeft:5}}>{inputs.q2d}</View>
                    <View style={{flex: 0.04,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>Bln</Text>
                    </View>

                </View>
            </View>;

}
var q3 = (self,inputs) => {
    return <View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'column', flex:0.15, justifyContent:'flex-start'}}>
                            <Text style={[styles.smltext]}>
                                Jika ya, sebutkan
                            </Text>
                    </View>
                    <View style={{flex:0.22, paddingLeft:10}}>{inputs.q3a}</View>
                    <View style={{flex: 0.18,paddingLeft:2}}>
                        <Text style={styles.text}>sudah berapa lama</Text>
                    </View>
                    <View style={{flex:0.1, paddingLeft:10}}>{inputs.q3b}</View>
                    <View style={{flex: 0.05,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>Thn</Text>
                    </View>
                    <View style={{flex:0.1, paddingLeft:5}}>{inputs.q2d}</View>
                    <View style={{flex: 0.05,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>Bln</Text>
                    </View>
                </View>
            </View>;

}
var q4 = (self,inputs) => {
    return <View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'column', flex:0.4, justifyContent:'flex-start'}}>
                            <Text style={[styles.smltext]}>
                                Sebutkan diagnostik penyakit tersebut
                            </Text>
                    </View>
                    <View style={{flex:0.6, paddingLeft:10}}>{inputs.q4a}</View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'column', flex:0.18, justifyContent:'flex-start'}}>
                            <Text style={[styles.smltext]}>
                                Kapan di diagnosa
                            </Text>
                    </View>
                    <View style={{flex:0.25, paddingLeft:10}}>{inputs.q4b}</View>
                    <View style={{flex: 0.2,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>dan berapa lama pengobatan</Text>
                    </View>
                    <View style={{flex:0.08, paddingLeft:5}}>{inputs.q4c}</View>
                    <View style={{flex: 0.05,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>Thn</Text>
                    </View>
                    <View style={{flex:0.08, paddingLeft:5}}>{inputs.q4d}</View>
                    <View style={{flex: 0.05,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>Bln</Text>
                    </View>

                </View>
            </View>;

}
var q7 = (self,inputs) => {
    return <View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'column', flex:0.5, justifyContent:'flex-start'}}>
                            <Text style={[styles.smltext]}>
                                Batang sehari
                            </Text>
                    </View>
                    <View style={{flex:0.2, paddingLeft:10}}>{inputs.q7a}</View>
                </View>
            </View>;

}
var q9 = (self,inputs) => {
    return <View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'column', flex:0.3, justifyContent:'flex-start'}}>
                            <Text style={[styles.smltext]}>
                                Sebutkan nama negara :
                            </Text>
                    </View>
                    <View style={{flex:0.7, paddingLeft:10}}>{inputs.q9a}</View>
                </View>
            </View>;

}


var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        let s1 = self.uistate.get().proposal.s1;
        let [q2_yesno,q3_yesno,q4_yesno,q7_yesno,q9_yesno] = [<View />,<View />,<View />,<View />,<View />] ;
        if (self.uistate.get().proposal.s1.ui.phbase.q2_yesno) {
            q2_yesno = q2(self, inputs)
        }
        if (self.uistate.get().proposal.s1.ui.phbase.q3_yesno) {
            q3_yesno = q3(self, inputs)
        }
        if (self.uistate.get().proposal.s1.ui.phbase.q4_yesno) {
            q4_yesno = q4(self, inputs)
        }
        if (self.uistate.get().proposal.s1.ui.phbase.q7_yesno) {
            q7_yesno = q7(self, inputs)
        }
        if (self.uistate.get().proposal.s1.ui.phbase.q9_yesno) {
            q9_yesno = q9(self, inputs)
        }

        return (
                <View>
                <View style={{flex:1, flexDirection:'row', paddingBottom:300, marginBottom:300}} >

                    <View style={{flexDirection:'column',  flex: 1}} >

                        <View style={{flex:1, flexDirection:'row'}}>
                            <View style={{flex:0.7, paddingLeft:0, width:200}}>
                                <Text style={styles.text}>1. Tinggi/Berat Badan</Text>
                            </View>
                            <View style={{flex:0.1}}>{inputs.q1_height}</View>
                            <View style={{flex: 0.05,paddingLeft:2, paddingRight:5}}>
                                <Text style={styles.text}>cm</Text>
                            </View>
                            <View style={{ flex:0.1}}>{inputs.q1_weight}</View>
                            <View style={{flex: 0.05,paddingLeft:2, paddingRight:5}}>
                                <Text style={styles.text}>Kgs</Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        {/* start of questions , start with q2*/}

                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        2. Apakah anda pernah/masih mengkosumsi minuman keras/alkohol dan sejenisnya
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q2_yesno}</View>
                        </View>
                        {q2_yesno}


                        {/* question 3 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        3. Apakah anda pernah/masih mengunakan obat-obatan terlarang, narkoti atau obat penenang dan sejenisnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q3_yesno}</View>
                        </View>
                        {q3_yesno}
                        {/* question 4 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        4. Apakah anda pernah menderita sakit/melakukan/dianjurkan atau bermaksud
                                        menjalani pemeriksaan diagnostik seperti pemeriksaan darah, biopsi, endoskopi,
                                        rontgen(x-ray), MRI, EKG, USG, CT Scan dan lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q4_yesno}</View>
                        </View>
                        {q4_yesno}
                        {/* question 5 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        5. Apakah anda dalam pengawasan dokter? Jika ada lampirkan penjelasan pada kolom 5W1H.
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q5_yesno}</View>
                        </View>
                        {/* question 6 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        6. Apakah anda mempunyai gangguan mental atau fisik, gangguan dan/atau kondisi apapun yang
                                        menghambat pergerakan, penglihatan, dan atau pendengaran?
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q6_yesno}</View>
                        </View>
                        {/* question 7 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        7. Apakah anda mengkonsumsi rokok?
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q7_yesno}</View>
                        </View>
                        {q7_yesno}
                        {/* question 8 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        8. Aoakah anda melakukan atau bermaksud untuk mengikuti kegiatan atau olaraga berisiko/berbahaya
                                        seperti (mendaki gunung, dirgantara balap motor/mobil menyelam dll) atau terbang dengan pesawat yang
                                        tidak mempunyai jadual yang tetap?
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q8_yesno}</View>
                        </View>
                        {/* question 9 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        9. Apakah anda berencana untuk tinggal/pergi ke luar negeri selama >= 3 bulan dalam 12 bulan ke-depan?
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q9_yesno}</View>
                        </View>
                        {q9_yesno}
                        {/* question 10 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        10. Apakah pengajuan ansuransi ini sebagai pengganti dari pengajuan ansuransi atau polis lain?
                                        Jika ya, jelaskan dan lampirkan surat penyataan mengenai penggantian pengajuan ansuransi atau Polis lain
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q10_yesno}</View>
                        </View>

                        {/* question 11 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.8, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw*0.85-200}]}>
                                        11. Apakah pengajuan ansuransi jiwa atau kesehatan anda pernah di-tolak/di-kenakan exstra premi
                                        di-tangguhkan/dikenakan pengecualian/polis lanjutan dihentikan?
                                    </Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:0}}>{inputs.q11_yesno}</View>
                        </View>

                    </View>

                </View>
                </View>
        );
    }
    return tmpl
}

const TAG="ProposalS1StandardView.";
export default class ProposalS1StandardView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.state = {}
    this.formChange = _.debounce(this.onFormChange.bind(this), 200);
  }

  onFormChange(raw, path){
    // let result = this.refs.form.validate();
    let fname = path[0];
    let questions = _.map( _.keys(raw), (f) => /^q\d+/.test(f) ? f : null ).filter((item) => item) ;
    if (questions.indexOf(fname) >= 0 ) {
        this.uistate.get().proposal.s1.ui.set({refresh:false}).now()
        let mapp = {};
        _.forEach(questions,(q) => { mapp[q] = raw[q] } );
        this.uistate.get().proposal.s1.ph.base.questions.set(mapp).now();

        // do some handling for the extra questionnaires
        let menuitems = _.assign([],this.uistate.get().proposal.s1.ui.base_menu_items);
        if (fname === 'q5_yesno') {
            if (raw[fname]) {
                menuitems.push('Doctors');
            } else {
                let pos = menuitems.indexOf('Doctors');
                if (pos >= 0) {
                    menuitems.splice(pos,1)
                }
            }
        }

        // let vals = _.assign({}, _.pick(raw,['q2_yesno','q3_yesno','q4_yesno','q7_yesno','q9_yesno']))
        let vals = _.assign({}, _.pick(raw,questions))
        let ui = {}
        ui.refresh = true;
        ui.base_menu_items = menuitems;
        // this.uistate.get().proposal.s1.ui.set(vals).now();
        let uistate = this.uistate;

        this.uistate.get().proposal.s1.ui.phbase.set(vals).now();
        this.uistate.get().proposal.s1.ui.set(ui).now();
        // debugger;
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
      let doc = Object.assign( {}, this.uistate.get().proposal.s1.ph.base.questions, values );
      this.uistate.get().proposal.s1.ui.set({refresh:false}).now()
      this.uistate.get().proposal.s1.ph.base.set({questions:doc}).now()
      this.props.fns.saveProposal();

  }

  render(){
    Form.stylesheet = formstyles;
    let row = Object.assign( {},this.uistate.get().proposal.s1_defaults.base_questions,
                                this.uistate.get().proposal.s1.ph.base.questions);
    return (
       <View style={{flexDirection:'column', justifyContent:'flex-start', paddingBottom:0, marginBottom:0}}>
              <View style={{flexDirection: 'row' , paddingLeft: 20, height: dh-100}}>
                  <ScrollView ref="container" style={[styles.container]}>
                      <View  offset={200} style={{paddingBottom: 1}}>
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
              <View ref="actionButton" style={[styles.overlay],{left:((0.85*dw)-80), top:-(200)}}>
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
