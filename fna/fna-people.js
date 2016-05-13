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
    'LifeAssured' : 'LifeAssured'
});

var modelFactory = (self) => {
    let model = t.struct({
        name : t.maybe(t.String),
        gender : t.maybe(Gender),
        relation : t.maybe(RelType),
        dob : t.maybe(t.Date),
        age : t.maybe(t.Number),
    });
    return model
}
var mf2 = (self) => {
    let model = t.struct({
        phone : t.maybe(t.String),
        job : t.maybe(t.String),
        smoker : t.maybe(t.Boolean),
        address1: t.maybe(t.String),
        address2: t.maybe(t.String),
    });
    return model
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'row',  flex: 1}} >
                {inputs.name}
                {inputs.gender}
                {inputs.relation}
                {inputs.dob}
                {inputs.age}
            </View>
        </View>
        );
    }
    return tmpl
}
var layout2 = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flexDirection:'column',  flex: 0.4, paddingLeft:30, paddingRight:30}} >
                <View style={{paddingTop:20}} />
                {inputs.phone}
                {inputs.job}
                {inputs.smoker}
            </View>
            <View style={{flexDirection:'column',  flex: 0.5}} >
                <View style={{paddingTop:20}} />
                {inputs.address1}
                {inputs.address2}
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
                style : { width : 250}
            },
            gender : {
              factory : LocalSegmentedControls,
              nulloption : { value : '', label : 'Gender'},
              height: 40,
              width : 150
            },
            relation : {
                factory : LocalSelect,
                nulloption : false,
                height : 35,
                width : 150,
                error : 'This field is required',
            },
            dob : {
                factory : LocalCalendar,
                startYear : 1950,
                endYear : 2020,
                style : {width: 150},
                label : 'Date of birth'
            },
            age : {
                factory : LocalTextbox,
                style : {width: 80},
                label : 'Age',
                // editable : false,
            },
        }
    }
    return options
}
var of2 = (self)  => {
    let options = {
        template : layout2(self),
        fields : {
            phone : {
                factory : LocalTextbox,
                label : 'Nomor telepon (tertanggung)',
                onFocus : () => focus(self, 'phone'),
                style : { width : 200}

            },
            job : {
                label : 'Perkerjaan (tertanggung)',
                factory : LocalTextbox,
                onFocus : () => focus(self, 'job'),
                style : { width : 200}
            },
            smoker : {
                // factory : LocalSegmentedControls,
                // nulloption : false,
                height : 35,
                label : 'Merokok (tertanggung)',
                error : 'This field is required',
            },
            address1 : {
                factory : LocalTextbox,
                style : { width : 300},
                onFocus : () => focus(self, 'address1'),
                label : 'Alamat'
            },
            address2 : {
                factory : LocalTextbox,
                onFocus : () => focus(self, 'address2'),
                style : { width : 300},
                label : 'Address Line 2'
            },
        }
    }
    return options
}

function focus(self, refName, scrollViewRefName='container', offset=150, ){
  setTimeout(()=>{
    let handle =   React.findNodeHandle(self.refs.form.refs.input.refs[refName]);
    let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
    console.log("focus, handle & scrollResponder", handle, scrollResponder);
    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      React.findNodeHandle(handle), offset, true );
  }, 150);
}


var TAG = "FnaPeopleView.";
export default class FnaPeopleView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state");
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, secid, rowid) => {
            return _.find(data.s1, (row,index) => index === rowid );
          }
      });
      let row2 = _.assign({},this.uistate.get().fna.personalData.data);
      this.state = {
          value : {
              name : '',
              relation : 'Spouse',
              gender : 'Male',
              dob : null,
              age : null
          },
          value2 : row2
      }
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
                    <Text>{data.dob ? moment(data.dob).format('D-M-YYYY') : ''}</Text>
                </View>
                <View style={{flex:0.1}} >
                    <Text>{data.age}</Text>
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
                        <Text style={styles.sectionText}>{"Dob"}</Text>
                    </View>
                    <View style={{flex:0.1}} >
                        <Text style={styles.sectionText}>{"Age"}</Text>
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
      let rows = this.uistate.get().fna.personalData.people,
          row = _.find(rows, (r,index) => index === rowId);

      row = row ? row : {}
      this.setState({value : row})
    }
    removeRow(rowid) {
        // look at this later

        let data = this.uistate.get().fna.personalData.people.toJS(),
            pos = _.findIndex(data, (r,idx) => idx === rowid);
        if (pos >= 0) {
            data.splice(pos,1); // remove the 1 row
            this.uistate.get().fna.personalData.set({people:data}).now()
            this.uistate.get().fna.ui.set({refresh:true}).now();
        }
    }

    onFormChange(values, path) {
        // console.log("onFormChange, values & path ", values, path);
    }
    onForm2Change(values, path) {
        // console.log("onFormChange, values & path ", values, path);
        let vals = this.refs.form.getValue();
        if (!vals) {
            let errors = this.refs.form.validate();
            let msgs = error.errors.map( (err) => '[' + err.path[0] + '] :' + err.message) ,
                msg = msgs.join(". ");
            this.alert("Please fix errors :" + msg );
            return
        }
        this.setState({value2:vals});

    }
    addRow() {
        let values = this.refs.form2.getValue();
        console.log(TAG + "addRow ---> values", values);
        if (values) {
            // check that the year is not already entered
            if (!values.name || !values.gender || !values.relation || !values.dob) {
                this.alert("Please correct the errors before adding again");
                return
            }
            let rows = this.uistate.get().fna.personalData.people.toJS()
            rows.push(values);
            this.uistate.get().fna.personalData.set({people:rows}).now();
            this.uistate.get().fna.ui.set({refresh:true, loadFna : false});
        } else {
            this.alert("Please fix errors before continuing")
        }
    }

    saveFna() {
        let values = this.refs.form.getValue()
        if (!values) {
            this.alert("Please fix errors before saving again")
            return
        }
        // we save the updated doc to uistate and savecontact will take it from there
        let doc = Object.assign( {}, this.uistate.get().fna.personalData.data, values );
        this.uistate.get().fna.ui.set({refresh:false}).now()
        this.uistate.get().fna.personalData.set({data:doc}).now()
        this.uistate.get().fna.ui.set({refresh:true}).now()
        this.props.fns.saveFna();
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
        );
    }

    render() {

        Form.stylesheet = formstyles;
        let contact = this.uistate.get().fna.ui.currentContact;
        let rows = this.uistate.get().fna.personalData.people,
            ids = _.map(rows,(item,idx) => idx );
        this.ds = this.ds.cloneWithRows(rows,ids);
        // have to populate the states value2


        // console.log(TAG + "render, row ",  JSON.stringify(this.state.value));

        // <View style={{flex:1, flexDirection:"column"}} >
        //
        //     <View style={{flex:0.1, flexDirection:"row", padding : 10}} >


        let res = (

            <View style={{flexDirection:'column', justifyContent:'flex-start', paddingBottom:0, marginBottom:0}}>
                   <View style={{flexDirection: 'row' , paddingLeft: 0 ,height:dh-100 }}>
                       <ScrollView ref="container" style={[styles.container]}>
                       <View style={{flex:1, flexDirection:'column'}}>

                           <View style={{flex:0.4, height:180}}>
                               <View style={{backgroundColor: '#f6fffe', paddingTop:20}}>
                                 <ListView
                                     dataSource={this.ds}
                                     renderRow={ this.renderRow.bind(this) }
                                     renderHeader={()=> this.renderHeader()}
                                   />

                               </View>
                           </View>

                           <View style={styles.separator} />

                           <View style={{paddingBottom: 0, flex: 0.1, flexDirection:'row'}}>

                               <View style={{flex:0.92}}>
                                    <Form style={{flexDirection:"row"}}
                                      ref="form2"
                                      type={modelFactory(this)}
                                      options={optionsFactory(this)}
                                      value={this.state.value}
                                      onChange={this.onFormChange.bind(this)}
                                    />
                                </View>
                                <View style={{paddingTop:32, paddingLeft: 20, flex:0.1}} >
                                    <Button textStyle={{color:"white", fontSize:16}}
                                        style={{paddingTop:0, width:100, height:35, backgroundColor:"#2196F3", borderWidth:0 }}
                                        onPress={()=>this.addRow()} isDisabled={false} >
                                                  OK
                                    </Button>
                                </View>

                            </View>

                            <View style={styles.separator} />


                    <View style={{paddingBottom: 200, flex: 0.4}}>
                        <Form style={{flexDirection:"row"}}
                          ref="form"
                          type={mf2(this)}
                          options={of2(this)}
                          value={this.state.value2}
                          onChange={this.onForm2Change.bind(this)}
                        />
                    </View>
                </View>
                </ScrollView>
            </View>




            {/* put in an action button */}
            <View ref="actionButton" style={[styles.overlay],{left:((dw)-100), top:-(200) }}>
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
