'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  AlertIOS
} = React

import _ from "lodash";
import moment from "moment";
import Button from 'apsl-react-native-button';
import {LocalNumber, LocalSelect, LocalPicker,LocalTextbox, LocalSegmentedControls, LocalDate, LocalCalendar} from "../form/localComponents";

var Icon = require('react-native-vector-icons/FontAwesome');
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;

var localstyles = require("../localStyles"),
    t = require('tcomb-form-native'),
    numeral = require('numeral'),
    formstyles = _.clone(localstyles,true);

formstyles.fieldset.flexDirection = "row";
t.form.Form.i18n = {
optional: '',
required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var Form = t.form.Form;

var AgeBand = t.enums({
    '2' : '< 35 Tahun',
    '1' : '35 - 55 Tahun',
    '0' : '> 55 Tahun'
})
var DependentsBand = t.enums({
    '2.0' : 'Tidak Ada',
    '2.1' : '1 - 3 orange',
    '2.2' : '> 4 orang',
})
var InvestorBand = t.enums({
    '2' : 'Saya seorang investor yang aktif dan berpengetahuan',
    '1' : 'Saya memiliki sedikit pengetahuan tentang investasi',
    '0' : 'Saya tidak memiliki pengetahuan tentang investasi',
})
var RiskBand = t.enums({
    '2' : 'Ya, Pastinya',
    '1' : 'Mungkin/Netral',
    '0' : 'Tidak',
})
var TimeBand = t.enums({
    '2' : '>10 tahun',
    '1' : '5 - 10 tahun',
    '0' : '<5 tahun',
})
var DepositBand = t.enums({
    '2' : 'IDR 500.000.000',
    '1' : 'IDR 200.000.000 - IDR 500.000.000',
    '0' : '200.000.000',
})
var ConfidenceBand = t.enums({
    '2' : 'Sangat yakin',
    '1' : 'Bisa saja',
    '0' : 'Tidak yakin',
})


var modelFactory = (self) => {
    let model = t.struct({
        ageBand : t.maybe(AgeBand),
        dependentsBand : t.maybe(DependentsBand),
        investorBand : t.maybe(InvestorBand),
        riskBand : t.maybe(RiskBand),
        timeBand : t.maybe(TimeBand),
        depositBand : t.maybe(DepositBand),
        confidenceBand : t.maybe(ConfidenceBand),
        totalScore : t.maybe(t.Number),
        riskResult : t.maybe(t.String),
    });
    return model
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'column',  flex: 0.9}} >
                <View style={{flexDirection:'row'}}>
                    {inputs.ageBand}
                    <View style={{paddingLeft:10, paddingRight:10}} />
                    {inputs.dependentsBand}
                </View>
                {inputs.investorBand}
                {inputs.riskBand}
                {inputs.timeBand}
                {inputs.depositBand}
                {inputs.confidenceBand}

                <View style={{flexDirection:'row'}}>
                    {inputs.totalScore}
                    <View style={{paddingLeft:10, paddingRight:10}} />
                    <Text style={{paddingTop:30}}>{inputs.riskResult.props.value}</Text>
                </View>

            </View>

        </View>
        );
    }
    return tmpl
}

var optionsFactory = (self)  => {
    let options = {
        template : layout(self),
        fields : {
            ageBand : {
                factory : LocalPicker,
                label : 'Berapa usia Anda?',

            },
            dependentsBand : {
                factory : LocalPicker,
                label : 'Berapa banyak orang yang saat ini Anda topang hidupnya?',
            },
            investorBand : {
                factory : LocalPicker,
                label : 'Bagaimana Anda menggambarkan diri Anda sebagai investor?',
                style : {width:500}
            },
            riskBand : {
                factory : LocalPicker,
                label : 'Maukah anda menerima resiko yang lebih tinggi demi mencapai potensi pengembalian yang lebih tinggi juga?',
                style : {width:500}
            },
            timeBand : {
                factory : LocalPicker,
                label : 'Jangka waktu pengembalian investasi seperti apa yang paling cocok dengan kebutuhan anda?',
                style : {width:500}
            },
            depositBand : {
                factory : LocalPicker,
                label : 'Jika anda ingin melakukan deposit lum sum, berapa jumlah maksimum dana yang anda sediakan untuk diinvestasikan?',
                style : {width:500}
            },
            confidenceBand : {
                factory : LocalPicker,
                label : 'Seberapa yakin anda mampu membuat keputusan keuangan yang sehat?',
                style : {width:500}
            },
            totalScore : {
                factory : LocalNumber,
                label : 'Jumlah Anda',
                editable: false
            },
            riskResult : {
                label : 'Hasil kesimpulan Anda adalah :',
                factory : LocalTextbox,
                style : {height: 100, width : dw - 400}
            }

        }
    }
    return options
}
var TAG = "FnaRiskProfileView.";
export default class FnaRiskProfileView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state");
      let row = _.assign({}, this.uistate.get().fna_defaults.riskProfile, this.uistate.get().fna.riskProfile.data );
      this.state = {value : row }
      this.formChange = _.debounce(this.onFormChange.bind(this), 300);

    }

    onFormChange(values, path) {
        console.log("onFormChange, values & path ", values, path);
        let f = path[0];
        let vals = this.refs.form.getValue();
        if (!vals) {
            let errors = this.refs.form.validate();
            let msgs = error.errors.map( (err) => '[' + err.path[0] + '] :' + err.message) ,
                msg = msgs.join(". ");
            this.alert("Please fix errors :" + msg );
            return
        }
        let total = _.sum( ['ageBand','dependentsBand','investorBand','riskBand','timeBand','depositBand','confidenceBand'].map((key) => {
            return parseInt(values[key]);
        }) );
        let risk = total <= 6 ? 'Anda seorang investor KONSERVATIF,toleransi resiko anda rendah'
            : total <= 10 ? 'Anda seorang investor MODERAT; \nAnda adalah investor yang stabil dan lebih memilih strategi investasi yang seimbang'
            : 'Anda seorang investor AGRESIF. \nAnda adalah investor yang bersedia mentolerir tingkat resiko yang lebih tinggi untuk meningkatkan \npotensi pertumbuhan aset anda.';

        let vv = _.assign({},vals);
        vv.totalScore = total;
        vv.riskResult = risk;

        this.setState({value:vv});


    }
    saveFna() {
        let values = this.refs.form.getValue()
        if (!values) {
            let errors = this.refs.form.validate();
            let msgs = error.errors.map( (err) => '[' + err.path[0] + '] :' + err.message) ,
                msg = msgs.join(". ");
            this.alert("Please fix errors :" + msg );
            return
        }
        // we save the updated doc to uistate and savecontact will take it from there
        let doc = Object.assign( {}, this.uistate.get().fna.riskProfile.data, values );
        this.uistate.get().fna.ui.set({refresh:false}).now()
        this.uistate.get().fna.riskProfile.set({data:doc}).now()
        this.uistate.get().fna.ui.set({refresh:true, loadFna: false}).now()
        this.props.fns.saveFna();
    }

    alert(msg=null, type="Error") {
        let message = msg ? msg : 'Please fix the errors, before moving to the next view'
        AlertIOS.alert(
          type,
          message,
          [
            {text:'OK', onPress : (txt) => console.log(txt)}
          ],
        );
    }

    render() {

        Form.stylesheet = formstyles;
        let contact = this.uistate.get().fna.ui.currentContact;
        // let row = _.assign({}, this.uistate.get().fna_defaults.riskProfile, this.uistate.get().fna.riskProfile.data );
        console.log(TAG + "render, row ",  JSON.stringify(this.state.value));
        return (

                <View style={{flexDirection:'column', justifyContent:'flex-start', paddingBottom:0, marginBottom:0}}>
                       <View style={{flexDirection: 'row' , paddingLeft: 20 ,height:dh-100 }}>
                           <ScrollView ref="container" style={[styles.container]}>
                               <View offset={200} style={{paddingBottom: 200}}>
                                    <Form style={{flexDirection:"row"}}
                                      ref="form"
                                      type={modelFactory(this)}
                                      options={optionsFactory(this)}
                                      value={ this.state.value }
                                      onChange={(raw, path)=> this.formChange(raw,path)}
                                    />
                            </View>
                        </ScrollView>
                    </View>

                {/* put in an action button */}
                <View ref="actionButton" style={[styles.overlay],{left:((dw)-100), top:-(150) }}>
                  <TouchableOpacity activeOpacity={0.5} onPress={()=> this.saveFna()}
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
            {/* end of action button */}

        </View>
        );
    }
} // end SideMenu class

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // center: {
  //   flex: 1,
  //   backgroundColor: '#FFFFFF',
  // },
  separator: {
    height: 2,
    backgroundColor: '#CCCCCC',
  },
  icon: {
    paddingRight: 10,
    height: 64,
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'center',
    justifyContent: 'flex-start',
    // padding: 10,
    // backgroundColor: '#F6F6F6',
    backgroundColor: 'transparent',
  },
  text: {
    flex: 1,
  },
  section: {
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'flex-start',
       padding: 2,
      //  backgroundColor: '#2196F3'
       backgroundColor: '#0296c3'
   },
   sectionText: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
    // overlay: {
    //   position: 'absolute',
    //   bottom: 0,
    //   left: 0,
    //   right: 0,
    //   top: 0,
    //   backgroundColor: 'transparent',
    // },
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

})
