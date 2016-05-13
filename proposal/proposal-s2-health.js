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
// import KeyboardHandler from "../keyboard-handler.js"

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
  q1a : t.maybe(t.Boolean),
  q1b : t.maybe(t.Boolean),
  q1c : t.maybe(t.Boolean),
  q1d : t.maybe(t.Boolean),
  q1e : t.maybe(t.Boolean),
  q1f : t.maybe(t.Boolean),
  q1g : t.maybe(t.Boolean),
  q1h : t.maybe(t.Boolean),
  q1i : t.maybe(t.Boolean),
  q1j : t.maybe(t.Boolean),
  q1k : t.maybe(t.Boolean),
  q1l : t.maybe(t.Boolean),
  q1m : t.maybe(t.Boolean),
  q2_yesno : t.maybe(t.Boolean),
  q2a1 : t.maybe(t.String),
  q2a2 : t.maybe(t.String),
  q2a3 : t.maybe(t.String),
  q2a4 : t.maybe(t.String),
  q2a5 : t.maybe(t.String),
  q2b : t.maybe(t.Boolean),
  q2c : t.maybe(t.Boolean),
  q2d : t.maybe(t.Boolean),
  q3_yesno : t.maybe(t.Boolean),
  q3a : t.maybe(t.enums({
     'Normal' : 'Normal / Spontan',
     'Caesar' : 'Operasi/Caesar',
     'Vacum'  : 'Vacum',
     'Forceps' : 'Forceps',
     'Lainnya' : 'Lainnya'
    })),
  q3a2 : t.maybe(t.String),
  q3a3 : t.maybe(t.String),
  q3b1 : t.maybe(t.String),
  q3b2 : t.maybe(t.String),
  q3c1 : t.maybe(t.String),
  q3c2 : t.maybe(t.String),
  q4  : t.maybe(t.Boolean),
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
            q1a : {factory: LocalCheckbox},
            q1b : {factory: LocalCheckbox},
            q1c : {factory: LocalCheckbox},
            q1d : {factory: LocalCheckbox},
            q1e : {factory: LocalCheckbox},
            q1f : {factory: LocalCheckbox},
            q1g : {factory: LocalCheckbox},
            q1h : {factory: LocalCheckbox},
            q1i : {factory: LocalCheckbox},
            q1j : {factory: LocalCheckbox},
            q1k : {factory: LocalCheckbox},
            q1l : {factory: LocalCheckbox},
            q1m : {factory: LocalCheckbox},
            q2_yesno : {factory: LocalCheckbox},
            q2a1 : {factory : LocalTextbox, style : {width:50},  onFocus : () => focus(self, 'q2a1') },
            q2a2 : {factory : LocalTextbox, style : {width:50},  onFocus : () => focus(self, 'q2a2')},
            q2a3 : {factory : LocalTextbox, style : {width:50},  onFocus : () => focus(self, 'q2a3')},
            q2a4 : {factory : LocalTextbox, style : {width:50},  onFocus : () => focus(self, 'q2a4')},
            q2a5 : {factory : LocalTextbox, style : {width:50},  onFocus : () => focus(self, 'q2a5')},
            q2b_yesno : {factory: LocalCheckbox},
            q2c_yesno : {factory: LocalCheckbox},
            q2d_yesno : {factory: LocalCheckbox},
            q3_yesno : {factory: LocalCheckbox},
            q2b : {factory: LocalCheckbox},
            q2c : {factory: LocalCheckbox},
            q2d : {factory: LocalCheckbox},
            q3a : {factory : LocalSelect },
            q3a2 : {factory : LocalTextbox, style : {width:150} ,  onFocus : () => focus(self, 'q3a2')},
            q3a3 : {factory : LocalTextbox, style : {width:150},  onFocus : () => focus(self, 'q3a3')},
            q3b1 : {factory : LocalTextbox, style : {width:80} ,  onFocus : () => focus(self, 'q3b1')},
            q3b2 : {factory : LocalTextbox, style : {width:80} ,  onFocus : () => focus(self, 'q3b2')},
            q3c1 : {factory : LocalTextbox, style : {width:80},  onFocus : () => focus(self, 'q3c1')},
            q3c2 : {factory : LocalTextbox, style : {width:80} ,  onFocus : () => focus(self, 'q3c2')},
            q4  : {factory: LocalCheckbox},
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

var q2 = (self,inputs) => {
    return <View style={{paddingLeft:20}}>
                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'column', flex:0.4, justifyContent:'flex-start'}}>
                            <Text style={[styles.smltext]}>
                                Usia kehamilan
                            </Text>
                    </View>
                    <View style={{flex:0.2, paddingLeft:10}}>{inputs.q2a1}</View>
                    <View style={{flex: 0.02,paddingLeft:2}}>
                        <Text style={styles.text}>bulan atau</Text>
                    </View>
                    <View style={{flex:0.2, paddingLeft:10}}>{inputs.q2a2}</View>
                    <View style={{flex: 0.02,paddingLeft:2}}>
                        <Text style={styles.text}>minggu</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'column', flex:0.4, justifyContent:'flex-start'}}>
                            <Text style={[styles.smltext]}>
                                Haid terakhir
                            </Text>
                    </View>
                    <View style={{flex:0.1, paddingLeft:10}}>{inputs.q2a3}</View>
                    <View style={{flex: 0.01,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>-</Text>
                    </View>
                    <View style={{flex:0.1, paddingLeft:10}}>{inputs.q2a4}</View>
                    <View style={{flex: 0.01,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>-</Text>
                    </View>
                    <View style={{flex:0.1, paddingLeft:10}}>{inputs.q2a5}</View>
                    <View style={{flex: 0.01,paddingLeft:2,paddingRight:5}}>
                        <Text style={styles.text}>(dd-mm-yyyy)</Text>
                    </View>

                </View>
            </View>;

}
var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        let s2 = self.uistate.get().proposal.s2;
        let [q2_yesno] = [<View />] ;
        if (self.uistate.get().proposal.s2.ui.health_q2_yesno) {
            q2_yesno = q2(self, inputs)
        }

        return (
                <View style={{height:dh}}>
                <ScrollView ref="svh" style={{flex:1, flexDirection:'column'}} >

                    <View style={{flexDirection:'column',  flex: 1}} >

                        {/* start of questions , start with q1*/}
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw-200}]}>
                                        1. Adakah anda/sedang menderita penyaki gangguan/kelainan pada :
                                    </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        a. Mata : termasuk fungsi penglihatan
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1a}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        b. Telinga, Hidung dan Tenggorokan : termasuk gangguan sinus atau fungsi
                                        pendengaran/bicara ?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1b}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        c. Paru-paru : gangguan pernafasan, batuk kepanjangan, bronchitis, asma, batuk darah,
                                        TBC, penyakit paru tahap akhir, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1c}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        d.Jantung dan Pembuluh Darah : nyeri dada, bedebar-debar, gangguan jantung atau katup
                                        jantung, demam rematik, tekanan darah tinggi/rendah, penyempitan/penyumbatan
                                        pembuluh darah, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1d}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        e. Organ dalam perut dan sistem pencernaan, gangguan maag, sakit kuning, mundah
                                        darah, hernia,sering diare, hepatitis, radang/batu kandung empedu, penyakit
                                        gangguan pankreas kronis, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1e}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        f. Hati dan Pankreas : hepatitis A, hepatitis B, hepatitis C, tumor hati,
                                        kencing manis (DM), batu empedu, penyakit dan gangguan hati & packreas lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1f}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                    g. Sistem kemih dan kelamin : sakit/nyeri saat buang air kecil, gangguan saluran
                                    kencing, kencing batu/berpasir, batu ginjal, kencing berdarah, kencing nanah, gangguan
                                    prostat, gagal ginjal, penyakit kelamin, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1g}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        h. Sistem saraf dan otot : sering pusing, pingsan, kesemutan, kelemahan alat gerak,
                                        kelumpuhan, ayan/kejang, vertigo, stroke, penurunan kesadaran, atau gangguan jiwa, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1h}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        i. Tulang Kerangka dan Kulit : gangguan tulang belakang, nyeri sendi, gangguan otot
                                        multiple sclerosis, demam rematik, patah tulang, polio, amputasi, kelainan kulit,
                                        kusta, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1i}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        j. Sistem Kelenjar dan Darah : gangguan hormon, kalenjar gondok, pembesaran
                                        kelanjar getah bening, kincing manis (DM), hemofilia, kurang darah/anemia,
                                        thalassemia, leukemia dan kelainan darah lainnya, menerima tranfusi darah,
                                        cuci darah, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1j}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        k. Sistem kekebalan dan infeksi : HIV/AIDS atau gejala komplexs yang berhubungan
                                        dengan AIDS, malaria, demam rematik, alergi,lupus, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1k}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        l. Pertumbuhan Sel: tumor, nodul kista, kanker, tahi lalat yang membesar dengan
                                        cepat, benjolan atau pertumbuhan abnormal, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1l}</View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.smltext,{width:dw-200,paddingLeft:10}]}>
                                        m. Gangguan Kesehatan lainnya yang belum disebutan di atas termasuk namun tidak
                                        terbatas pada kelainan bentuk tubuh, jenis luka apapun, kelainan/cacat fisik,
                                        kelainan/cacat bawaan, trauma kepala, lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q1m}</View>
                        </View>


                        {/* start of questions , start with q2 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw-200}]}>
                                        2. Khusus wanita. Apakah anda sedang hamil?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q2_yesno}</View>
                        </View>
                        {q2_yesno}

                        {/* start of questions , start with q2b */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row',paddingLeft:20}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw-200}]}>
                                        Untuk wanita yang pernah melahirkan, apakah anda memiliki riwayat komplikasi
                                        saat kehamilan seperti diabetes, hipertensi atau lainnya?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q2b}</View>
                        </View>
                        {/* start of questions , start with q2c */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row',paddingLeft:20}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw-200}]}>
                                        Apakah anda pernah dibertahu atau sedang mengalami kelainan rahim/indung
                                        telur atau organ, reproduksi, payudara?
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q2c}</View>
                        </View>
                        {/* start of questions , start with q2d */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row',paddingLeft:20}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw-200}]}>
                                        Apakah anda disarankan untuk periksa papsmear mammografi, biopsi, operasi
                                        payudara atau pemeriksaan kandungan lainnya? Jika ya. lampirkan copy hasil
                                        pemeriksaan atau peratan.
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q2d}</View>
                        </View>

                        {/* start of questions , start with q3 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw-200}]}>
                                        3. Khusus Tertanggung : ANAK (0-17)
                                    </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',paddingLeft:20}}>
                            <View style={{flexDirection:'column', flex:0.4, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text]}>
                                        Kelahiran secara
                                    </Text>
                            </View>
                            <View style={{flex:0.3, paddingLeft:10}}>{inputs.q3a}</View>
                        </View>
                        <View style={{flexDirection:'row',paddingLeft:20}}>
                            <View style={{flexDirection:'column', flex:0.4, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text]}>
                                        Alasan dilakukan tindakan selain normal/spontan
                                    </Text>
                            </View>
                            <View style={{flex:0.3, paddingLeft:10}}>{inputs.q3a2}</View>
                        </View>
                        <View style={{flexDirection:'row',paddingLeft:20}}>
                            <View style={{flexDirection:'column', flex:0.4, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text]}>
                                        Nama dokter & rumah sakit yang melakukan tindakan
                                    </Text>
                            </View>
                            <View style={{flex:0.3, paddingLeft:10}}>{inputs.q3a3}</View>
                        </View>

                        <View style={{flexDirection:'row',paddingLeft:10}}>
                            <View style={{flexDirection:'column', flex:0.4, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text]}>
                                        Lama kehamilan
                                    </Text>
                            </View>
                            <View style={{flex:0.3, paddingLeft:10}}>{inputs.q3b1}</View>
                            <View style={{flex: 0.02,paddingLeft:2}}>
                                <Text style={styles.text}>bulan atau</Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:10}}>{inputs.q3b2}</View>
                            <View style={{flex: 0.02,paddingLeft:2}}>
                                <Text style={styles.text}>minggu</Text>
                            </View>

                        </View>

                        <View style={{flexDirection:'row',paddingLeft:10}}>
                            <View style={{flexDirection:'column', flex:0.4, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text]}>
                                        Panjang / berat badan saat lahir
                                    </Text>
                            </View>
                            <View style={{flex:0.3, paddingLeft:10}}>{inputs.q3c1}</View>
                            <View style={{flex: 0.02,paddingLeft:2}}>
                                <Text style={styles.text}>cm</Text>
                            </View>
                            <View style={{flex:0.2, paddingLeft:10}}>{inputs.q3c2}</View>
                            <View style={{flex: 0.02,paddingLeft:2}}>
                                <Text style={styles.text}>Kgs</Text>
                            </View>
                        </View>

                        {/* start of questions , start with q4 */}
                        <View style={styles.separator} />
                        <View style={{flexDirection:'row'}}>
                            <View style={{flexDirection:'column', flex:0.9, justifyContent:'flex-start'}}>
                                    <Text style={[styles.text,{width:dw-200}]}>
                                        Apakah anda pernah/sedang mederita/mengalami kondisi berikut : kanker, alzheimer,
                                        angioplasti,........
                                    </Text>
                            </View>
                            <View style={{flex:0.1, paddingLeft:10}}>{inputs.q4}</View>
                        </View>

                    </View>

                </ScrollView>
                </View>
        );
    }
    return tmpl
}

const TAG="ProposalS2HealthView.";
export default class ProposalS2HealthView extends React.Component {
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
        this.uistate.get().proposal.s2.health.questions.set(mapp).now()
        //let vals = _.assign({}, _.pick(raw,questions))
        let vals = {refresh:true, health_q2_yesno : raw['q2_yesno']}

        // this.uistate.get().proposal.s2.ui.set({refresh:true})
        // vals.refresh = true;
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
      let doc = Object.assign( {}, this.uistate.get().proposal.s2.health.questions, values );
      this.uistate.get().proposal.s2.ui.set({refresh:false}).now()
      this.uistate.get().proposal.s2.health.set({questions:doc}).now()
      this.props.fns.saveProposal();

  }

  render(){
    Form.stylesheet = formstyles;
    let row = Object.assign( {},this.uistate.get().proposal.s2_defaults.health_questions,
                                this.uistate.get().proposal.s2.health.questions);
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
              <View ref="actionButton" style={[styles.overlay],{left:((dw)-100), top:-(-50)}}>
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
