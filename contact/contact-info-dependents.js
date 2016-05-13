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
import {LocalNumber, LocalSelect, LocalTextbox, LocalSegmentedControls, LocalDate, LocalCalendar} from "../form/localComponents";


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
var Gender = t.enums({
    'Male' : 'Male',
    'Female' : 'Female'
})
var RelType = t.enums({
    'Spouse' : 'Spouse',
    'Son' : 'Son',
    'Daughter' : 'Daughter',
    'Father' : 'Father',
    'Mother' : 'Mother',
    'Others' : 'Others'
})
var model = t.struct({
    name : t.String,
    gender : Gender,
    relation : RelType,
    smoker : t.maybe(t.Boolean),
    dob : t.maybe(t.Date),
});
var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'column',  flex: 0.6}} >
                {inputs.name}
                {inputs.gender}
                {inputs.relation}
            </View>
            <View style={{flexDirection:'column', flex: 0.4, paddingLeft :50 }} >
                {inputs.smoker}
                {inputs.dob}
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
            name : {
                factory : LocalTextbox,
                error : 'This field is required',
                style : { width : 400}
            },
            gender : {
              factory : LocalSegmentedControls,
              nulloption : { value : '', label : 'Gender'},
              height: 37,
              error : 'This field is required',
            },
            relation : {
                factory : LocalSelect,
                // position: 'top',
                nulloption : false,
                height : 35,
                error : 'This field is required',
            },
            dob : {
                factory : LocalCalendar,
                startYear : 1950,
                endYear : 2020,
                style : {width: 150},
                label : 'Date of birth'
            },
        }
    }
    return options
}
var TAG = "ContactDependentsView.";
export default class ContactDependentsView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state");
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, secid, rowid) => {
            return _.find(data.s1, (row,index) => index === rowid );
          }
      });
      this.state = { value : this.uistate.get().contactinfo.dependents.defaults.toJS() }
    }

    renderRow(data, sectionId, rowId) {
    //   console.log(TAG + "renderRow -->data, s, r", data, sectionId, rowId );
      return (
        <TouchableOpacity onPress={() => this.pressRow(rowId)}>
          <View style={{padding:15}}>
            <View style={styles.row}>

                <View style={{flex:0.31}} >
                    <Text>{data.name}</Text>
                </View>

                <View style={{flex:0.1}} >
                    <Text>{data.gender}</Text>
                </View>
                <View style={{flex:0.15}} >
                    <Text>{data.relation}</Text>
                </View>

                <View style={{flex:0.1}} >
                    <Text>{data.smoker ? 'Yes' : 'No'}</Text>
                </View>
                <View style={{flex:0.1}} >
                    <Text>{data.dob ? moment(data.dob).format('D-M-YYYY') : ''}</Text>
                </View>
                <View style={{flex:0.04}}>
                    <TouchableOpacity key={rowId} onPress={() => this.removeRow(rowId)} style={[styles.tab]}>
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableOpacity>
      );
    }

    renderHeader() {
        let contact = this.uistate.get().contactinfo.currentContact;
        return (
            <View style={{flex:1, flexDirection:"column"}} >
                {/*<View style={styles.section} >
                    <Text style={styles.sectionText}> {"Relations of " + contact.name } </Text>
                </View> */}
                <View style={[styles.section, {flexDirection:"row", justifyContent:"flex-start", padding : 5}]} >

                    <View style={{flex:0.3} } >
                        <Text style={styles.sectionText}>{"Name"}</Text>
                    </View>
                    <View style={{flex:0.1} } >
                        <Text style={styles.sectionText}>{"Gender"}</Text>
                    </View>

                    <View style={{flex:0.15}} >
                        <Text style={styles.sectionText}>{"Relation"}</Text>
                    </View>
                    <View style={{flex:0.1}} >
                        <Text style={styles.sectionText}>{"Smoker"}</Text>
                    </View>
                    <View style={{flex:0.1}} >
                        <Text style={styles.sectionText}>{"Dob"}</Text>
                    </View>

                    <View style={{flex:0.05}} >
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </View>

                </View>
            </View>
        );
    }

    pressRow(rowId) {
      console.log(TAG + "pressRow --> rowId", rowId);
      let rows = this.uistate.get().contactinfo.dependents.data,
          row = _.find(rows, (r,index) => index === rowId);

      row = row ? row : {}
      this.setState({value : row})



    }
    removeRow(rowid) {
        // look at this later

        let data = this.uistate.get().contactinfo.dependents.data.toJS(),
            pos = _.findIndex(data, (r,idx) => idx === rowid);
        if (pos >= 0) {
            data.splice(pos,1); // remove the 1 row
            this.uistate.get().contactinfo.set({refresh:true})
                .dependents.set({data:data}).now();
        }
    }

    onFormChange(values, path) {
        // console.log("onFormChange, values & path ", values, path);
    }
    addRow() {
        let values = this.refs.form.getValue();
        console.log(TAG + "addRow ---> values", values);
        if (values) {
            // check that the year is not already entered
            if (!values.name || !values.gender || !values.relation) {
                AlertIOS.alert(
                  'Errors',
                  'Please correct the errors before adding again',
                  [
                    {text:'OK', style:"default" }
                  ]
                );
                return
            }
            let rows = this.uistate.get().contactinfo.dependents.data.toJS()
            rows.push(values);
            this.uistate.get().contactinfo.set({refresh:true})
                                          .dependents.set({data:rows}).now()
        } else {
            self.alert("Please fix errors before continuing")
        }
    }
    saveContact() {
        this.props.fns.saveContact();
    }
    alert(msg=null, type) {
        let message = msg ? msg : 'Please fix the errors, before moving to the next view'
        let etype = type ? type : 'Error'
        AlertIOS.alert(
          etype,
          message,
          [
            {text:'OK', onPress : (txt) => console.log(txt)}
          ],
          // 'default'
        );
    }

    render() {

        Form.stylesheet = formstyles;
        let contact = this.uistate.get().contactinfo.currentContact;
        let rows = this.uistate.get().contactinfo.dependents.data,
            ids = _.map(rows,(item,idx) => idx );
        this.ds = this.ds.cloneWithRows(rows,ids);

        // console.log(TAG + "render, row ",  JSON.stringify(this.state.value));
        let res = (
        <View style={{flex:1, flexDirection:"column"}} >

            <View style={{flex:0.25, flexDirection:"row", padding : 10}} >

                <Form style={{flexDirection:"row"}}
                  ref="form"
                  type={model}
                  options={optionsFactory(this)}
                  value={this.state.value}
                  onChange={this.onFormChange.bind(this)}
                />

                <View style={{paddingTop:32, paddingLeft: 20}} >
                    <Button textStyle={{color:"white", fontSize:16}}
                        style={{paddingTop:0, width:100, height:35, backgroundColor:"rgb(150,150,200)", borderWidth:0 }}
                        onPress={()=>this.addRow()} isDisabled={false} >
                                  OK
                    </Button>
                </View>

            </View>

            <ScrollView style={{flex:0.75,backgroundColor: '#f6fffe', paddingTop:20}}>
              <ListView
                  dataSource={this.ds}
                  renderRow={ this.renderRow.bind(this) }
                  renderHeader={()=> this.renderHeader()}
                />

            </ScrollView>




            {/* put in an action button */}
            <View ref="actionButton" style={[styles.overlay],{left:((dw*0.85)-100), top:-(400)}}>
              <TouchableOpacity activeOpacity={0.5} onPress={()=> this.saveContact()}
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
