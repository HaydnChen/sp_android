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

var Priority = t.enums({
    'Low' : 'Low',
    'Medium' : 'Medium',
    'High' : 'High'
})
var modelFactory = (self) => {
    let model = t.struct({
        monthlyExpense : t.maybe(t.Number),
        yearlyExpense : t.maybe(t.Number),
        depositInterest : t.maybe(t.Number),
        protectionNeeds : t.maybe(t.Number),
        lifeCover : t.maybe(t.Number),
        ciCover : t.maybe(t.Number),
        accidentCover : t.maybe(t.Number),
        healthCover : t.maybe(t.Number),
        totalCover : t.maybe(t.Number),
        shortfall : t.maybe(t.Number),
        priorityLife : t.maybe(Priority),
        priorityCi : t.maybe(Priority),
        priorityAccident : t.maybe(Priority),
        priorityHealth : t.maybe(Priority),
    });
    return model
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'column',  flex: 0.4}} >
                {inputs.monthlyExpense}
                {inputs.yearlyExpense}
                {inputs.depositInterest}
                {/*<View style={[styles.separator,{width:300}]} /> */}
                {inputs.protectionNeeds}
            </View>

            <View style={{flexDirection:'column',  flex: 0.6}} >
                <View style={{flexDirection:'row'}}>
                    {inputs.lifeCover}
                    <View style={{paddingLeft:5, paddingRight:5}} />
                    {inputs.priorityLife}
                </View>
                {/* row 2 */}
                <View style={{flexDirection:'row'}}>
                    {inputs.ciCover}
                    <View style={{paddingLeft:5, paddingRight:5}} />
                    {inputs.priorityCi}
                </View>
                {/* row 3 */}
                <View style={{flexDirection:'row'}}>
                    {inputs.accidentCover}
                    <View style={{paddingLeft:5, paddingRight:5}} />
                    {inputs.priorityAccident}

                </View>
                {/* row 4 */}
                <View style={{flexDirection:'row'}}>
                    {inputs.healthCover}
                    <View style={{paddingLeft:5, paddingRight:5}} />
                    {inputs.priorityHealth}
                </View>
                {/* row 5 */}
                <View style={{flexDirection:'row'}}>
                    {inputs.totalCover}
                </View>
                {/* row 6 */}
                <View style={{flexDirection:'row'}}>
                    {inputs.shortfall}
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
            monthlyExpense : {
                factory : LocalNumber,
                style : { width : 250}
            },
            yearlyExpense : {
                factory : LocalNumber,
                style : { width : 250},
                editable : false,
            },
            depositInterest : {
                factory : LocalNumber,
                style : { width : 250},
                dp: 2
            },
            protectionNeeds : {
                factory : LocalNumber,
                style : { width : 250},
                editable : false,
            },
            lifeCover : {
                factory : LocalNumber,
                style : { width : 250},
            },
            ciCover : {
                factory : LocalNumber,
                style : { width : 250},
            },
            accidentCover : {
                factory : LocalNumber,
                style : { width : 250},
            },
            healthCover : {
                factory : LocalNumber,
                style : { width : 250},
            },
            totalCover : {
                factory : LocalNumber,
                style : { width : 250},
                editable : false,
            },
            shortfall : {
                factory : LocalNumber,
                style : { width : 250},
                editable : false,
            },
            priorityLife : {
                factory : LocalPicker,
                label : 'Priority',
                // width : 100,
            },
            priorityCi : {
                factory : LocalPicker,
                label : 'Priority',
                // width : 100,
            },
            priorityAccident : {
                factory : LocalPicker,
                label : 'Priority',
                // width : 100,
            },
            priorityHealth : {
                factory : LocalPicker,
                label : 'Priority',
                // width : 100,
            },
        }
    }
    return options
}
var TAG = "FnaProtectionView.";
export default class FnaProtectionView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state");
      this.state = {
          value : {
              monthlyExpense : 0,
              yearlyExpense : 0,
              depositInterest : 0.12,
          },
      }
      this.formChange = _.debounce(this.onFormChange.bind(this), 300);

    }


    onFormChange(values, path) {
        console.log("onFormChange, values & path ", values, path);
        let f = path[0];
        if (f === 'monthlyExpense') {
            // calculate the monthly expenseRate
            let monthly, rate, yearly, protection = 0;
            let ci, accident, health, life, total, shortfall;

            monthly = parseFloat( String(values[f]).replace(/,/g,'') );
            yearly = monthly * 12 ;
            rate = values['depositInterest'];
            if (rate) {
                protection = yearly / rate ;
            }
            ci = parseFloat( String(values['ciCover']).replace(/,/g,'') );
            accident = parseFloat( String(values['accidentCover']).replace(/,/g,'') );
            health = parseFloat( String(values['healthCover']).replace(/,/g,'') );
            life = parseFloat( String(values['lifeCover']).replace(/,/g,'') );
            total = ci + accident + health + life;
            shortfall = total - protection;

            let data = {
                yearlyExpense: yearly,
                protectionNeeds : protection,
                totalCover : total,
                shortfall : shortfall,
                monthlyExpense : values[f]
            }

            this.uistate.get().fna.protectionNeeds.data.set(data).now();

        }
        if (['ciCover','accidentCover','healthCover','lifeCover'].indexOf(f) >= 0) {
            let ci, accident, health, life, total, protection, shortfall;
            ci = parseFloat( String(values['ciCover']).replace(/,/g,'') );
            accident = parseFloat( String(values['accidentCover']).replace(/,/g,'') );
            health = parseFloat( String(values['healthCover']).replace(/,/g,'') );
            life = parseFloat( String(values['lifeCover']).replace(/,/g,'') );
            protection = parseFloat( String(values['protectionNeeds']).replace(/,/g,'') );
            total = ci + accident + health + life;
            shortfall = total - protection;
            let data = {
                ciCover : ci,
                lifeCover : life,
                accidentCover : accident,
                healthCover : health,
                shortfall : shortfall,
                totalCover : total
            }
            let curData = this.uistate.get().fna.protectionNeeds.data.toJS();
            data = _.assign({}, curData, data);
            this.uistate.get().fna.protectionNeeds.data.set(data).now();

        }


    }
    saveFna() {
        let values = this.refs.form.getValue()
        if (!values) {
            this.alert("Please fix errors before saving again")
            return
        }
        // we save the updated doc to uistate and savecontact will take it from there
        let doc = Object.assign( {}, this.uistate.get().fna.protectionNeeds.data, values );
        this.uistate.get().fna.ui.set({refresh:false}).now()
        this.uistate.get().fna.protectionNeeds.set({data:doc}).now()
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
        let row = _.assign({}, this.uistate.get().fna_defaults.protectionNeeds, this.uistate.get().fna.protectionNeeds.data );
        // console.log(TAG + "render, row ",  JSON.stringify(this.state.value));
        let res = (
        <View style={{flex:1, flexDirection:"column"}} >

            <View style={{flex:0.9, flexDirection:"row", padding : 10}} >

                <Form style={{flexDirection:"row"}}
                  ref="form"
                  type={modelFactory(this)}
                  options={optionsFactory(this)}
                  value={ row }
                  onChange={(raw, path)=> this.formChange(raw,path)}
                />

            </View>

            {/* put in an action button */}
            <View ref="actionButton" style={[styles.overlay],{left:((dw)-100), top:(-dh+300) }}>
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
