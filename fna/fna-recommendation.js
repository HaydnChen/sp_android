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

var modelFactory = (self) => {
    let model = t.struct({
        evaluation : t.maybe(t.String),
        totalFinNeeds : t.maybe(t.String),
        recommendation : t.maybe(t.String),
        premiumAndTime : t.maybe(t.String),
        reason : t.maybe(t.String),
    });
    return model
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'column',  flex: 1}} >
                {inputs.evaluation}
                {inputs.totalFinNeeds}
                {inputs.recommendation}
                {inputs.premiumAndTime}
                {inputs.reason}
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
            evaluation : {
                factory : LocalTextbox,
                label : 'Evaluasi',
                multiline : true,
                style : { width : dw - 400, height: 80}
            },
            totalFinNeeds : {
                factory : LocalTextbox,
                label : 'Total kebutuhan Financial',
                multiline : true,
                style : { width : dw - 400, height: 80}
            },
            recommendation : {
                factory : LocalTextbox,
                label : 'Rekomendasi Produk',
                multiline : true,
                onFocus : () => focus(self, 'recommendation'),
                style : { width : dw - 400, height: 80}
            },
            premiumAndTime : {
                factory : LocalTextbox,
                label : 'Jumlah Premi dan jangka waktu',
                multiline : true,
                onFocus : () => focus(self, 'premiumAndTime'),
                style : { width : dw - 400, height: 80}
            },
            reason : {
                factory : LocalTextbox,
                label : 'Alasan',
                onFocus : () => focus(self, 'reason'),
                multiline : true,
                style : { width : dw - 400, height: 80}
            },
        }
    }
    return options
}
function focus(self, refName, scrollViewRefName='container', offset=150, ){
  setTimeout(()=>{
    let handle =   React.findNodeHandle(self.refs.form.refs.input.refs[refName]);
    let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      React.findNodeHandle(handle), offset, true );
  }, 150);
}

var TAG = "FnaRecommendationView.";
export default class FnaRecommendationView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state");
      this.state = {}
      this.formChange = _.debounce(this.onFormChange.bind(this), 300);
    }
    onFormChange(values, path) {
        console.log("onFormChange, values & path ", values, path);
        let f = path[0];

    }
    saveFna() {
        let vals = this.refs.form.getValue();
        if (!vals) {
            let errors = this.refs.form.validate();
            let msgs = error.errors.map( (err) => '[' + err.path[0] + '] :' + err.message) ,
                msg = msgs.join(". ");
            this.alert("Please fix errors :" + msg );
            return
        }
        // we save the updated doc to uistate and savecontact will take it from there
        let doc = Object.assign( {}, this.uistate.get().fna.recommendations.data, vals );
        this.uistate.get().fna.ui.set({refresh:false}).now()
        this.uistate.get().fna.recommendations.set({data:doc}).now()
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
        let row = _.assign({}, this.uistate.get().fna_defaults.recommendations, this.uistate.get().fna.recommendations.data );

        console.log(TAG + "render, row ",  JSON.stringify(row));
        let res = (
            <View style={{flexDirection:'column', justifyContent:'flex-start', paddingBottom:0, marginBottom:0}}>
                   <View style={{flexDirection: 'row' , paddingLeft: 20 ,height:dh-100 }}>
                       <ScrollView ref="container" style={[styles.container]}>
                           <View style={{paddingBottom: 200}}>


                            <Form style={{flexDirection:"row"}}
                              ref="form"
                              type={modelFactory(this)}
                              options={optionsFactory(this)}
                              value={ row }
                              onChange={(raw, path)=> this.formChange(raw,path)}
                            />

                            </View>
                        </ScrollView>
                    </View>

            {/* put in an action button */}
            <View ref="actionButton" style={[styles.overlay],{left:((dw)-100), top:(-200) }}>
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
        // <Text style={{color:'white'}}>Save</Text>

        // if (this.state.value.in === '3000') { debugger}
        return res;
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
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      backgroundColor: 'transparent',
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

})
