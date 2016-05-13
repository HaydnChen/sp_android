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
  AlertIOS
} = React;

import _ from "lodash";
import Button from 'apsl-react-native-button';
import {LocalSelect,LocalDate,LocalSegmentedControls} from "../form/localComponents";
var Icon = require('react-native-vector-icons/FontAwesome'),
    // ActionButton = require('react-native-action-button'),
    ActionButton = require("../components/ActionButton"),
    moment = require('moment'),
    t = require('tcomb-form-native'),
    localStyles = require("../localStyles");

// var customize = {
//   formGroup : {
//     normal : { flexDirection : "row"},
//     error  : { flexDirection : "row"}
//   },
//   controlLabel : {
//     normal : { width : 120 },
//     error  : { width : 120 }
//   },
//   textbox : {
//     normal : { width : 250 },
//     error  : { width : 250 }
//   }
// }
let formstyles = _.clone(localStyles,true);

// customize the styles
formstyles.controlLabel.normal.width = 120;
formstyles.controlLabel.error.width = 120;
formstyles.textbox.normal.width = 250;
formstyles.textbox.error.width = 250;
formstyles.formGroup.normal.flexDirection = "row";
formstyles.formGroup.error.flexDirection = "row";

//t.form.Form.stylesheet = formstyles;
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};

var Gender = t.enums({
  'M':'Male',
  'F':'Female'
});
var Job = t.enums({
  MGR : 'Manager',
  ACCT : 'Accountant',
  ENG : 'Engineer',
  DOC : 'Doctor',
  LAW : 'Lawyer',
  ARCH : 'Architect',
  PILOT : 'Pilot',
  IT : 'Software Engineer',
  OTHER : 'Others'
})
var ContactModel = t.struct({
  name: t.String,
  dob: t.maybe(t.Date),
  gender : t.maybe(Gender),
  smoker : t.maybe(t.Boolean),
  occupation: t.maybe(Job),
  favourite : t.Boolean
});

var ContactForm = t.form.Form;

var options = {
  //auto : "placeholders",
  // dob : {
  //   mode:"date",
  // },
  fields: {
    dob : {
      factory:LocalDate,
    },
    gender : {
      factory : LocalSegmentedControls,
      nulloption : { value : '', label : 'Choose the gender'},
      width: 250,
      height: 30,
    },
    occupation : {
      factory : LocalSelect,
      nulloption : { value : '', label : 'Choose occupation'},
      width : 250,
      height : 30,
    }
  }
}; // optional rendering options (see documentation)

export default class ContactDisplay extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState(props);
      this.form = null;
    }

    getInitState(props){
      let baserow = props.mode === 'add' ? this.newRow() : props.row;
      let row = Object.assign({}, baserow);
      // console.log("contactDisplay props in getInitState", props, row);
      return {formvals : row} ;
    }
    newRow() {
      return {
        gender : 'M',
        favourite : false,
      }

    }

    onFormChange(raw, path){
      this.refs.form.validate();
      //console.log("contactDisplay --> onFormChange, getValue ", this.refs.form.getValue() , path);
    }
    save(){
      // get the values
      // console.log("contactDisplay.save-->calling form.getValue....");
      let doc = this.refs.form.getValue();
      if (doc){

        let newDoc = Object.assign(this.props.row, doc);
        // console.log("contactDisplay.save-->doc", newDoc);
        let op = '$loki' in newDoc ? 'update' : 'insert';
        this.props.fns.gotoListView(true,newDoc,op);
        console.log("done with save",op, newDoc.smoker);
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
    remove() {
      let doc = this.refs.form.getValue();
      let msg = 'There are validation errors, removing is not allowed...';
      if (doc){
        let newDoc = Object.assign(this.props.row, doc);
        if ('$loki' in newDoc){
          AlertIOS.alert(
            'Delete','Delete this document?',
            [
              {text:'YES',onPress:()=> this.props.fns.gotoListView(true,newDoc,'remove')},
              {text:'NO',onPress:()=> {}},
            ]
          )
          return
        } else {
          msg = 'Can only remove existing contacts...'
        }
      }
      AlertIOS.alert(
        'Errors',
        msg,
        [
          {text:'OK', onPress : (txt) => console.log(txt)}
        ],
        // 'default'
      );
    }

    render(){
      const {fns, parentfns} = this.props;
      let height = Dimensions.get('window').height;
      let width = Dimensions.get('window').width;
      // let row = Object.assign({}, this.props.row);
      let baserow = this.props.mode === 'add' ? this.newRow() : this.props.row;
      let row = Object.assign({}, baserow);
      //let row = Object.assign({}, this.state.formvals);
      // <View style={{flexDirection: 'column', justifyContent:'flex-start' ,marginLeft: 20}}>
      let disabled=true;

      ContactForm.stylesheet = formstyles;
      let removeButton ;
      if (this.props.mode === 'edit' || this.props.mode === 'list' || this.props.mode === 'fav') {
          removeButton = <Button textStyle={{color:"white", fontSize:16}} style={{padding:10, width:100, height:35, backgroundColor:"rgb(231,76,60)", borderWidth:0 }}
                        onPress={()=>this.remove()} isDisabled={false} >
                            {/*<Icon name="remove" size={15} color="white" /> */}
                        &nbsp;Remove
                      </Button>;

      }

      return (
        <View style={{flexDirection: 'column', justifyContent:'flex-start' ,marginLeft: 20}}>
          <View style={{ height:10}} />
          <View style={styles.container}>
            <View>
              <ContactForm style={{flexDirection:"row", flex: 1}}
                ref="form"
                type={ContactModel}
                options={options}
                value={row}
                onChange={(raw, path)=> this.onFormChange(raw,path)}
              />
            </View>
          </View>


          <View style={{height:35, width:350 , alignSelf:'flex-start', flexDirection: 'row' , marginTop:50, marginLeft:50, justifyContent:'space-around' }} >

            <Button textStyle={{color:"white", fontSize:16}} style={{padding:10, width:100, height:35, backgroundColor:"#1acc9c", borderWidth:0 }}
              onPress={()=>this.save()} isDisabled={false} >
                  {/*<Icon name="check" size={15} color="white" />*/}
                  &nbsp;Save
            </Button>

            <Button textStyle={{color:"white", fontSize:16}} style={{padding:10, height:35, width:100, backgroundColor:"#3498db", borderWidth:0 }}
              onPress={()=>this.props.fns.gotoListView()} isDisabled={false} >
                  {/*<Icon name="undo" size={15} color="white" /> */}
                  &nbsp;Cancel
            </Button>

            {removeButton}

          </View>

        </View>

      );


      // <Icon.Button size={20} name="check" borderRadius={10} backgroundColor="#1abc9c" onPress={()=>this.save()} style={{padding:10}}>
      //   <Text style={{color:'white', fontSize:15}}> Save </Text>
      // </Icon.Button>
      // <Icon.Button size={20} borderRadius={10} name="undo" backgroundColor="#3498db" onPress={()=>this.props.fns.gotoListView()} >
      //   <Text style={{color:'white', fontSize:15}}> Cancel </Text>
      // </Icon.Button>
      //
      // <Icon.Button size={20} borderRadius={10}   color={"gray"} name="remove" backgroundColor="rgb(231,76,60)" onPress={()=>{
      //   disabled ? {} :this.remove()}}>
      //   <Text style={{color:'white', fontSize:15}}> Remove </Text>
      // </Icon.Button>

      // <ActionButton buttonColor="rgba(231,76,60,1)" position={'right'} offsetX={30} active={true} offsetY={height} >
      //           <ActionButton.Item buttonColor='#9b59b6' title="Save" onPress={() => console.log("save tapped!")}>
      //             <Icon name="check" style={styles.actionButtonIcon} />
      //           </ActionButton.Item>
      //           <ActionButton.Item buttonColor='#3498db' title="Cancel" onPress={() => console.log("cancel tapped")}>
      //             <Icon name="undo" style={styles.actionButtonIcon} />
      //           </ActionButton.Item>
      //           <ActionButton.Item buttonColor='#1abc9c' title="Remove" onPress={() => {console.log("delete tapped")}}>
      //             <Icon name="remove" style={styles.actionButtonIcon} />
      //           </ActionButton.Item>
      // </ActionButton>





    }
}
var styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FFFF',
  },
  buttonText: {
     fontSize: 18,
     color: 'white',
     alignSelf: 'center'
   },
   button: {
     height: 36,
     backgroundColor: '#48BBEC',
     borderColor: '#48BBEC',
     borderWidth: 1,
     borderRadius: 8,
     marginBottom: 10,
     alignSelf: 'stretch',
     justifyContent: 'center'
   },
   actionButtonIcon: {
       fontSize: 20,
       height: 22,
       color: 'white',
     },
})
