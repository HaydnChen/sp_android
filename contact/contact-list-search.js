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
import moment from "moment"
import Button from 'apsl-react-native-button';
import {LocalSelect,LocalDate,LocalSegmentedControls} from "../form/localComponents";
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;
var Icon = require('react-native-vector-icons/FontAwesome'),
    // ActionButton = require('react-native-action-button'),
    ActionButton = require("../components/ActionButton"),
    t = require('tcomb-form-native'),
    localStyles = require("../localStyles");


let formstyles = _.clone(localStyles,true);

formstyles.controlLabel.normal.width = 120;
formstyles.controlLabel.error.width = 120;
formstyles.textbox.normal.width = 250;
formstyles.textbox.error.width = 250;
formstyles.formGroup.normal.flexDirection = "row";
formstyles.formGroup.error.flexDirection = "row";

// t.form.Form.stylesheet = localStyles;
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};

var Gender = t.enums({
  '' : null,
  'Male':'Male',
  'Female':'Female'
});
var SearchModel = t.struct({
  name: t.maybe(t.String),
  gender : t.maybe(Gender),
});

var SearchForm = t.form.Form;

var options = {
  fields: {
    gender : {
      factory : LocalSegmentedControls,
      nulloption : { value : '', label : 'Choose the gender'},
      width: 250,
      height: 30,
    },
  }
}; // optional rendering options (see documentation)

export default class ContactListSearch extends React.Component {
    constructor(props){
      super(props);
      this.state = {};
      this.searchForm = null;
      this.uistate = require("../state")
    }

    newRow() {
      return {
        gender : null,
      }
    }
    onFormChange(raw, path){
      this.refs.searchForm.validate();
    }

    search(){
      let search = this.refs.searchForm.getValue();
      let filter = {}, filters=[];

      // build filter as a function

      let fn = (row) => {
          let condition = true;
          if (search.name && search.name.length > 0 ) {
            //   let pattern = "^"+doc.name;
              let pattern = search.name;
              let regex = new RegExp(pattern,'i'); // i for case insensitive
              condition = condition && regex.test(row.name);
          }
          if (condition && search.gender) {
              condition = condition && row.gender === search.gender
          }
          return condition;
      }



      // names that start with what was entered and case insensitive
    //   if (doc.name && doc.name.length > 0) {
    //     let pattern = "^"+doc.name;
    //     let regex = new RegExp(pattern,'i'); // i for case insensitive
    //     filter = {name : { '$regex' : regex } }
    //     filters.push(filter);
    //   }
    //   if (doc.gender) {
    //     filter = {gender : {'$eq' : doc.gender}};
    //     filters.push(filter);
    //   }
    //   if (filters.length === 0) {
    //     filter = {}
    //   } else if (filters.length === 1 ) {
    //     filter = filters[0]
    //   } else {
    //     filter = {'$and' : filters}
    //   }
    //   this.uistate.get().contact.set({filter: filter})
    this.uistate.get().contact.set({filter: fn}).now()

      this.props.fns.gotoTab(0);
      // call a function to handleSearch
    //   this.props.tabfns.goContactHome(0,filter);

    }

    render(){
      SearchForm.stylesheet = formstyles;

      const {fns, parentfns} = this.props;
    //   let height = Dimensions.get('window').height;
    //   let width = Dimensions.get('window').width;
      // let row = Object.assign({}, this.props.row);

      let row = Object.assign({}, this.newRow());
    //   let disabled=true;

      return (
        <View style={{flexDirection: 'column', justifyContent:'flex-start' ,marginLeft: 20}}>
          <View style={{ height:10}} />
          <View style={styles.container}>
            <View>
              <SearchForm style={{flexDirection:"row", flex: 1}}
                ref="searchForm"
                type={SearchModel}
                options={options}
                value={row}
                onChange={(raw, path)=> this.onFormChange(raw,path)}
              />
            </View>
          </View>


          <View style={{height:35, width:300 , alignSelf:'flex-start', flexDirection: 'row' , marginTop:50, marginLeft:50, justifyContent:'space-around' }} >

            <Button textStyle={{color:"white", fontSize:16}} style={{padding:5, width:100, height:35, backgroundColor:"#3498db", borderWidth:0 }}
              onPress={()=>this.search()} isDisabled={false} >
                  {/*<Icon name="check" size={15} color="white" /> */}
              &nbsp;Search
            </Button>

            <Button textStyle={{color:"white", fontSize:16}} style={{padding:5, height:35, width:100, backgroundColor:"#3498db", borderWidth:0 }}
              onPress={()=>this.props.fns.gotoTab(0,{})} isDisabled={false} >
                  {/*<Icon name="undo" size={15} color="white" /> */}
              &nbsp;Cancel
            </Button>

          </View>

        </View>

      );

    }
}
var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection:"row",
    flex:1,
    alignSelf: 'center',
    padding:15,
    justifyContent:'center',
    borderRadius:10

  },
  buttonIcon: {
    alignSelf: 'center',
  },
  buttonText: {
     fontSize: 18,
     color: 'white',
     alignSelf: 'center',
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
})
