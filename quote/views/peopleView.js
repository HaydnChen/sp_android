'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Animated,
  ListView,
  ScrollView,
  AlertIOS
} = React;

import _ from "lodash";
import Button from 'apsl-react-native-button';
import {LocalSelect,LocalDate,LocalSegmentedControls} from "../../form/localComponents";
var Icon = require('react-native-vector-icons/FontAwesome'),
    moment = require('moment'),
    t = require('tcomb-form-native'),
    localstyles = require("../../localStyles");

var formstyles = _.clone(localstyles,true);
formstyles.formGroup.normal.flexDirection = 'column';
formstyles.formGroup.normal.padding = 0;
formstyles.formGroup.error.flexDirection = 'column';
formstyles.formGroup.error.padding = 0;
// t.form.Form.stylesheet = tstyles; // tell tcomb to use mystyle
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};

var Gender = t.enums({
  'Male':'Male',
  'Female':'Female'
});
var OccupationClass = t.enums({
  '1' : "Class 1",
  '2' : "Class 2",
  '3' : "Class 3"
});
var IncomeBand = t.enums({
  '1' : '0 - 25,000,000',
  '2' : '25,000,000 - 50,000,000',
  '3' : '50,000,000 - 100,000,000',
  '4' : '> 100,000,000'
})

var RelationType = t.enums({
    'Spouse' : 'Spouse',
    'Self' : 'Self',
    'Son' : 'Son',
    'Daughter' : 'Daughter',
    'Father' : 'Father',
    'Mother' : 'Mother',
    'Others' : 'Others'
})

var PersonModel = t.struct({
  name: t.String,
  dob: t.Date,
  gender : Gender,
  smoker : t.Boolean,
  job_class: OccupationClass,
  rel2Ph : t.maybe(RelationType),
  income_band : t.maybe(IncomeBand),
  is_ph : t.maybe(t.Boolean),
});

var PersonForm = t.form.Form;

var options = {
  fields: {
    dob : {
      factory:LocalDate,
      label : 'Date of birth',
      style : {width:150}
    },
    gender : {
      factory : LocalSegmentedControls,
      nulloption : { value : '', label : 'Gender of person'},
      // width: 250,
      height: 37,
    },
    job_class : {
      factory : LocalSelect,
      nulloption : { value : '', label : 'Occupation Class'},
      position : 'bottom',
      label : 'Occ. Class',
      // width : 250,
      height : 40,
    },
    income_band : {
      factory : LocalSelect,
      nulloption : { value : '', label : 'Income'},
      position : 'top',
      // width : 250,
      height : 40,
    },
    is_ph : {
      label : 'PolicyHolder?'
    },
    rel2Ph : {
        factory : LocalSelect,
        nulloption : { value : '', label : 'Relation'},
        label : 'Relation to Policyholder',
        position : 'bottom',
        height : 40,
    }

  }
}; // optional rendering options (see documentation)

class PersonView extends React.Component {
  constructor(props){
    super(props);
    this.state = this.getInitState(props);
    this.form = null;
  }
  getInitState(props) {
    return {};
  }
  onFormChange(data, path){
    // console.log("PeopleView.onFormChange --> data, path ", data, path);
    let form = "form" + this.props.pno;
    this.refs[form].validate();
    if ( path[0] === 'name' && data.dob === '') {
        // check to see if dob is blank clear them since we are editing the name field
            this.refs[form].refs.input.refs.dob.removeErrors();
    }
    // this.refs.form.validate();
  }
  render(){
    // assume default values is passed in via props
    PersonForm.stylesheet = formstyles;
    return (
      <ScrollView style={styles.container}>
        <View>
          <PersonForm style={{flexDirection:"column", flex: 1}}
            ref={"form" + this.props.pno }
            type={PersonModel}
            options={options}
            value={this.props.data}
            onChange={(raw, path)=> this.onFormChange(raw,path)}
          />
        </View>
      </ScrollView>
  );
  }
}

export default class PeopleView extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState(props);
      this.form = null;
      this.fns = {
        save : this.save.bind(this),

      };
      this.uistate = require("../../state");

    }
    getInitState(props){
      return {}
    }
    componentDidMount(){
      this.peopleState = this.uistate.get().quote.policy.people;
    //   this.refs.p0.refs.form0.getComponent('name').refs.input.focus();
    }
    save(form,pno){
      // save a person
      let doc = form.getValue();
      if (doc && pno){
        // ? should updating of state be done here, or perhaps in a reactions.js
        let person = this.peopleState;
        let updatedPerson = Object.assign(person, doc);
        this.peopleState.splice(pno,1,updatedPerson); // remove the old, put back the updated
        // console.log("PeopleView.save --> saved pno",pno);
      } else {
        AlertIOS.alert(
          'Errors',
          'Please fix errors, before saving...',
          [
            {text:'OK', onPress : (txt) => console.log(txt)}
          ],
        //   'default'
        );
      }
    }
    render(){
      const {fns, parentfns} = this.props;
      let peopleState = this.uistate.get().quote.policy.people,
          p0 = _.isEmpty(peopleState.data[0]) ? Object.assign({},peopleState.person) : Object.assign({},peopleState.data[0]),
          p1 = _.isEmpty(peopleState.data[1]) ? Object.assign({},peopleState.person) : Object.assign({},peopleState.data[1]),
          p2 = _.isEmpty(peopleState.data[2]) ? Object.assign({},peopleState.person) : Object.assign({},peopleState.data[2]);

        [p0,p1,p2].map((person) => {
            if ( person.dob && Object.prototype.toString.call(person.dob) === "[object String]" ) {
                person.dob = moment(person.dob, [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate()
            }
        })

        if (!(p0.is_ph || p1.is_ph || p2.is_ph)) {
          p0.is_ph = true; // set p0 as policyholder is no one is entered as policyholder
        }

      // create 3 person views and render them
      return (
        <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
            <View style={styles.container}>
                <Text style={styles.text}>First Person</Text>
                <View style={{paddingBottom: 1}}>
                    <PersonView ref="p0" fns={this.fns} data={p0} pno={0} />
                </View>
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Second Person</Text>
                <View style={{paddingBottom: 1}}>
                    <PersonView ref="p1" fns={this.fns} data={p1} pno={1} />
                </View>
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Third Person</Text>
                <View style={{paddingBottom: 1}}>
                    <PersonView ref="p2" fns={this.fns} data={p2} pno={2} />
                </View>
            </View>

        </View>

      );
    }
}
var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop : 5,
    borderColor : 'gray',
    borderWidth : 0
  },
  text: {
    fontSize : 20,
    color : 'grey'
  }
});
