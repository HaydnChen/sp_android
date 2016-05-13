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

var modelFactory = (self) => {
    var model = t.struct({
      has_owner : t.Boolean
    });
    return model
}

var optionsFactory = (self) => {
    var options = {
        template : layout(self),
        fields : {
            has_owner : {
                label : 'Apakah dalam pengajuan ansuransi ini terdapat Beneficial Owner?'
            },
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
                {inputs.has_owner}
            </View>
        </View>
        );
    }
    return tmpl
}
const TAG = "ProposalS1ExtraOwnerView.";
export default class ProposalS1ExtraOwnerView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);
    // toggle the fields to show on the screen
    this.state = {
    };
  }

  onFormChange(raw, path){
    console.log(TAG + "onFormChange", raw, path)
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
      let doc = Object.assign( {}, this.uistate.get().proposal.s1.owner.data, values );
      this.uistate.get().proposal.s1.ui.set({refresh:false});
      this.uistate.get().proposal.s1.owner.set({data:doc}).now()
      this.props.fns.saveProposal();
  }

  render(){
    Form.stylesheet = formstyles;
    let proposal = _.assign({},this.uistate.get().proposal.s1.owner.data);
    return (
       <View style={{flexDirection:'column'}}>
              <View style={{flexDirection: 'row', paddingLeft: 20}}>
                  <View style={styles.container} >
                      <View style={{flex:1, flexDirection:'column', flexWrap:'wrap', alignItems:'flex-start'}} >
                      <Text style={[styles.text]}>
                      Beneficial Owner adalah pihak ketiga selain calon tertanggung, calon pemegang polis,
                      </Text>
                      <Text style={[styles.text]}>
                      yang melakukan pembayaran premi, yang memiliki dana, mengendali transaksi pemegang polis,
                      </Text>
                      <Text style={[styles.text]}>
                      yang memberi kuasa dan/atau yang melakukan pengendalian atas pemegang polis melalui badan
                      </Text>
                      <Text style={[styles.text, {marginBottom:20}]}>
                      hukum atau perjanjian
                      </Text>
                      </View>

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
    fontSize : 18,
    color : 'grey',
    paddingBottom : 3
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
