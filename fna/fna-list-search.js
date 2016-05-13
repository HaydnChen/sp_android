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
import { LocalSelect, LocalDate, LocalSegmentedControls, LocalCalendar } from "../form/localComponents";
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;
var Icon = require('react-native-vector-icons/FontAwesome'),
    // ActionButton = require('react-native-action-button'),
    ActionButton = require("../components/ActionButton"),
    t = require('tcomb-form-native'),
    localStyles = require("../localStyles");


let formstyles = _.clone(localStyles,true);
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var SearchForm = t.form.Form;

var modelFactory = (self) => {

    let model = t.struct({
      contactName: t.maybe(t.String),
      fromDate : t.maybe(t.Date),
      toDate : t.maybe(t.Date),
    });
    return model;
}

var optionsFactory = (self) => {

    var options = {
      fields: {
        contactName : {
            label : 'Contact Name'
        },
        fromDate : {
            factory : LocalCalendar,
            startYear : 2000,
            endYear : 2020,
            label : 'From Date'
        },
        toDate : {
            factory : LocalCalendar,
            startYear : 2000,
            endYear : 2020,
            label : 'To Date'
        },
      }
    }; // optional rendering options (see documentation)
    return options;

}

const TAG = "FnaListSearch."
export default class FnaListSearch extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state")
      this.state = { contactName : '', fromDate : '', toDate : ''};
      this.searchForm = null;
    }

    newRow() {
      return { contactName : '', fromDate : '', toDate : ''};
    }
    toDate(s) {
        let dd = moment(s,['D-M-YYYY','YYYY-M-D', 'YYYY-M-D HH:mm', 'YYYY-M-D HH:mm:ss',
                           'D-M-YY HH:mm:ss','D-M-YY HH:mm', 'YYYY-MM-DDTHH:mm:ss.SSSSZ'],true)
        return dd.isValid() ? dd : _.isDate(s) ? moment(s) : null;
    }
    search(){
      let doc = this.refs.searchForm.getValue();
      let filter = {}, filters=[], date1, date2;
      // names that start with what was entered and case insensitive
      let fn = (row) => {
          let condition = true;
          if (doc.contactName && doc.contactName.length > 0 ) {
              let pattern = doc.contactName;
              let regex = new RegExp(pattern,'i'); // i for case insensitive
              condition = condition && regex.test(row.contactName);
          }
          if (condition && doc.fromDate) {
              date1 = this.toDate(doc.fromDate);
              date2 = this.toDate(row.creationDate);
              condition = condition && date2 >= date1
          }
          if (condition && doc.toDate) {
              date1 = this.toDate(doc.toDate);
              date2 = this.toDate(row.creationDate);
              condition = condition && date2 <= date1
          }
          return condition;
      }
      this.uistate.get().fnaList.ui.set({filter: fn}).now()
      this.props.fns.gotoTab(0);

    }

    render(){
      SearchForm.stylesheet = formstyles;

      const {fns, parentfns} = this.props;
      let row = Object.assign({}, this.newRow());

      return (
        <View style={{flexDirection: 'column', justifyContent:'flex-start' ,marginLeft: 20}}>
          <View style={{ height:10}} />
          <View style={styles.container}>
            <View>
              <SearchForm style={{flexDirection:"row", flex: 1}}
                ref="searchForm"
                type={modelFactory(this)}
                options={optionsFactory(this)}
                value={row}
              />
            </View>
          </View>


          <View style={{height:35, width:300 , alignSelf:'flex-start', flexDirection: 'row' , marginTop:50, marginLeft:50, justifyContent:'space-around' }} >

            <Button textStyle={{color:"white", fontSize:16}} style={{padding:5, width:100, height:35, backgroundColor:"#3498db", borderWidth:0 }}
              onPress={()=>this.search()} isDisabled={false} >
                  {/*<Icon name="check" size={15} color="white" /> */}
              &nbsp;Search
            </Button>

            <Button textStyle={{color:"white", fontSize:16}} style={{paddingLeft: 10, padding:5, height:35, width:100, backgroundColor:"#3498db", borderWidth:0 }}
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
