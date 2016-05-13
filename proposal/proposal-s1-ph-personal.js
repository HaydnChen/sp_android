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
import {LocalSelect,LocalDate,LocalSegmentedControls,LocalNumber, LocalTextbox} from "../form/localComponents";
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
var IdType = t.enums({
    KTP : 'KTP',
    SIM : 'SIM',
    Passport : 'Passport',
    KIMS : 'KIMS',
    KITAS : 'KITAS',
    Others : 'Others'
})

var MaritalStatus = t.enums({
    Single : 'Single',
    Married : 'Married',
    Widowed : 'Widowed'
})
var Religion = t.enums({
    Islam : 'Islam',
    Kristen : 'Kristen',
    Katolik : 'Katolik',
    Hindu : 'Hindu',
    Budha : 'Budha',
    Lain : 'Lainnya'
})
var Nationality = t.enums({
    Indonesia : 'Indonesian',
    Others : 'Others'
});
var JobCategory = t.enums({
    Wiraswasta : 'Wiraswasta',
    Pelajar : 'Pelajar',
    Pegawai : 'Pegawai swasta',
    Professional : 'Professional',
    TNI : 'TNI',
    Pensiunan : 'Pensiunan',
    Rumah_Tangga : 'Rumah Tangga',
    Pegawai_Negeri : 'Pengawai Negeri'
})
var Sector = t.enums({
    Keuangan : 'Keuangan',
    Pemasaran : 'Pemasaran',
    Tunai : 'Usaha Tunai',
    Manifaktur : 'Manifaktur & Dagagan',
    Services : 'Penyedia Jasa',
    Offshore :'Offshore company',
    Lain : 'Lainnya'
})
var Salaries = t.enums({
    '0-60'      : '< 60 Juta',
    '60-100'    : '60 - 100 Juta',
    '101-500'   : '101 - 500 Juta',
    '501-999'   : '> 500 Juta'
})
var model = t.struct({
  idType : t.maybe(IdType),
  idNo : t.maybe(t.String),
  religion : t.maybe(Religion),
  maritalStatus : t.maybe(MaritalStatus),
  nationality : t.maybe(Nationality),
  birthPlace : t.maybe(t.String),
  jobCategory : t.maybe(JobCategory),
  industry : t.maybe(t.String),
  workYears : t.maybe(t.Number),
  workMonths : t.maybe(t.Number),
  sector : t.maybe(Sector),
  salary : t.maybe(Salaries),
  rowid : t.maybe(t.String)
});

var optionsFactory = (self)  => {
    let options = {
        template : layout(self),
        fields : {
            idType : {
                factory : LocalSelect,
                width : 150,
                height : 35,
                nulloption : false
            },
            religion  : {
                factory : LocalSelect,
                height : 35,
                nulloption : false
            },
            maritalStatus : {
                factory : LocalSelect,
                height : 35,
                nulloption : false
            },
            nationality : {
                factory : LocalSelect,
                height : 35,
                nulloption : false
            },
            jobCategory : {
                factory : LocalSelect,
                height : 35,
                nulloption : false
            },
            industry : {
                factory : LocalTextbox,
                style : { width : 250 }
            },
            sector : {
                factory : LocalSelect,
                height : 35,
                nulloption : false
            },
            salary : {
                factory : LocalSelect,
                height : 35,
                nulloption : false
            },
            workYears : {
                factory : LocalNumber,
                width : 100
            },
            workMonths : {
                factory : LocalNumber,
                width : 100
            }

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
                        {inputs.idType}
                        {inputs.idNo}
                        {inputs.birthPlace}
                        {inputs.maritalStatus}
                        {inputs.religion}
                        {inputs.nationality}
                    </View>
                    <View style={{flexDirection:'column', flex: 1, paddingLeft :50 }} >
                        <View style={{flexDirection:'row'}} >
                            {inputs.workYears}
                            {inputs.workMonths}
                        </View>
                        {inputs.jobCategory}
                        {inputs.industry}
                        {inputs.sector}
                        {inputs.salary}
                    </View>
                </View>
        );
    }
    return tmpl
}

const TAG="ProposalS1PhPersonalView.";
export default class ProposalS1PhPersonalView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.state = { value : {} }
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
  }

  onFormChange(raw, path){
    let result = this.refs.form.validate();
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
      let doc = Object.assign( {}, this.uistate.get().proposal.s1.ph.data, values );
      this.uistate.get().proposal.s1.ui.set({refresh:false}).now()
      this.uistate.get().proposal.s1.ph.set({data:doc}).now()
      this.props.fns.saveProposal();

  }

  render(){
    Form.stylesheet = formstyles;
    let row = Object.assign( {},this.uistate.get().proposal.s1_defaults.ph,
                                this.uistate.get().proposal.s1.ph.data );
    return (
       <View style={{flexDirection:'column'}}>
              <View style={{flexDirection: 'row', justifyContent:'flex-start', paddingLeft: 20}}>
                  <View style={styles.container}>
                      <View style={{paddingBottom: 1}}>
                              <Form style={{flexDirection:"column", flex: 1}}
                                ref={"form"}
                                type={model}
                                options={optionsFactory(this)}
                                value={ row }
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
