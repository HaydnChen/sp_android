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
        childEducation : t.maybe(t.Number),
        pension : t.maybe(t.Number),
        warisan : t.maybe(t.Number),
        lifeStyle : t.maybe(t.Number),
        priorityEducation : t.maybe(Priority),
        priorityPension : t.maybe(Priority),
        priorityLifeStyle : t.maybe(Priority),
        priorityWarisan : t.maybe(Priority),
    });
    return model
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'column',  flex: 0.6}} >
                <View style={{flexDirection:'row'}}>
                    {inputs.childEducation}
                    <View style={{paddingLeft:5, paddingRight:5}} />
                    {inputs.priorityEducation}
                </View>
                {/* row 2 */}
                <View style={{flexDirection:'row'}}>
                    {inputs.pension}
                    <View style={{paddingLeft:5, paddingRight:5}} />
                    {inputs.priorityPension}
                </View>
                {/* row 3 */}
                <View style={{flexDirection:'row'}}>
                    {inputs.warisan}
                    <View style={{paddingLeft:5, paddingRight:5}} />
                    {inputs.priorityWarisan}

                </View>
                {/* row 4 */}
                <View style={{flexDirection:'row'}}>
                    {inputs.lifeStyle}
                    <View style={{paddingLeft:5, paddingRight:5}} />
                    {inputs.priorityLifeStyle}
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
            childEducation : {
                factory : LocalNumber,
                label : 'Dana pendidikan untuk anak',
                style : { width : 250}

            },
            pension : {
                factory : LocalNumber,
                label : 'Dana Pensiun',
                style : { width : 250},
            },
            warisan : {
                factory : LocalNumber,
                label : 'Warisan',
                style : { width : 250},
            },
            lifeStyle : {
                factory : LocalNumber,
                label : 'Gaya Hidup',
                style : { width : 250},
                onFocus : () => focus(self, 'lifeStyle'),

            },
            priorityEducation : {
                factory : LocalPicker,
                label : 'Priority',
            },
            priorityPension : {
                factory : LocalPicker,
                label : 'Priority',
            },
            priorityLifeStyle : {
                factory : LocalPicker,
                label : 'Priority',
            },
            priorityWarisan : {
                factory : LocalPicker,
                label : 'Priority',
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


var TAG = "FnaOthersView.";
export default class FnaOthersView extends React.Component {
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
        let values = this.refs.form.getValue()
        if (!values) {
            this.alert("Please fix errors before saving again")
            return
        }
        // we save the updated doc to uistate and savecontact will take it from there
        let doc = Object.assign( {}, this.uistate.get().fna.otherNeeds.data, values );
        this.uistate.get().fna.ui.set({refresh:false}).now()
        this.uistate.get().fna.otherNeeds.set({data:doc}).now()
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
        let row = _.assign({}, this.uistate.get().fna_defaults.otherNeeds, this.uistate.get().fna.otherNeeds.data );

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
            <View ref="actionButton" style={[styles.overlay],{left:((dw)-100), top:(-300) }}>
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