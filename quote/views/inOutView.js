'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Easing,
  ListView,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  AlertIOS
} = React

import _ from "lodash";
import Button from 'apsl-react-native-button';
import {LocalNumber} from "../../form/localComponents";


var deviceWidth = Dimensions.get('window').width;
var Icon = require('react-native-vector-icons/FontAwesome');

var localstyles = require("../../localStyles"),
    t = require('tcomb-form-native'),
    numeral = require('numeral'),
    formstyles = _.clone(localstyles,true);


formstyles.fieldset.flexDirection = "row";
t.form.Form.i18n = {
optional: '',
required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var InOutForm = t.form.Form;

var model = t.struct({
  year : t.Number,
  in : t.maybe(t.Number),
  out : t.maybe(t.Number),
});

var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;
//var formatNumber = (number,dp=2) => Number(Number((number).replace(/,/g,'')).toFixed(dp)).toLocaleString() ;
// var formatNumber = (n,dp=0) => {
//     n = Number( (n+'').replace(/,/g,'') );
//     return n.toFixed(dp).toLocaleString()
// }

var numberTransformer = {
  format: (value) => {
    // return value;
    if ( !value ) { return value }
    let res =  formatNumber(value);
    // console.log("numberTransformer.format, value, type", value, res );
    return res;
  },
  parse: function (str) {
    // console.log("numberTransformer.parse,", str, Object.prototype.toString.call(str));
    return parseFloat( str.replace(/,/g,'') );
  }
};

var options = {
    fields : {
        year : {
            factory : LocalNumber
        },
        in : {
            factory : LocalNumber,
            label : "Topup"
        },
        out : {
            factory : LocalNumber,
            label : "Withdrawal"
        }
    }
}

export default class InOutView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../../state");
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, secid, rowid) => {
            return _.find(data.s1, (row) => row.year === rowid );
          }
      });
      this.state = this.getInitState();
    }

    getInitState(){

      return {
        value : {year :'', in : 0, out : 0}
      }
    }

    renderRow(data, sectionId, rowId) {
      console.log("data, s, r", data, sectionId, rowId );
      return (
        <TouchableHighlight onPress={() => this.pressRow(rowId)}>
          <View style={{padding:15}}>
            <View style={styles.row}>

                <View style={{flex:0.11}} >
                    <Text>{data.year}</Text>
                </View>

                <View style={{flex:0.44}} >
                    <Text>{formatNumber(data.in)}</Text>
                </View>

                <View style={{flex:0.43}} >
                    <Text>{formatNumber(data.out)}</Text>
                </View>
                <View style={{flex:0.1}}>
                    <TouchableOpacity key={rowId} onPress={() => this.removeRow(rowId)} style={[styles.tab]}>
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </TouchableOpacity>
                </View>


            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      );
    }

    renderHeader() {
        let main = this.uistate.get().quote.current_main;
        return (
            <View style={{flex:1, flexDirection:"column"}} >
                <View style={styles.section} >
                    <Text style={styles.sectionText}> {"Topups & Withdrawals"} </Text>
                </View>
                <View style={[styles.section, {flexDirection:"row", justifyContent:"flex-start", padding : 5}]} >

                    <View style={{flex:0.1} } >
                        <Text style={styles.sectionText}>{"Year"}</Text>
                    </View>
                    <View style={{flex:0.4} } >
                        <Text style={styles.sectionText}>{"Topup"}</Text>
                    </View>
                    <View style={{flex:0.4}} >
                        <Text style={styles.sectionText}>{"Withdrawal"}</Text>
                    </View>
                    <View style={{flex:0.1}} >
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </View>

                </View>
            </View>

        );

    }

    pressRow(rowId) {
      console.log("InOutView.pressRow --> rowId", rowId);


    }
    removeRow(rowid) {
        let data = this.uistate.get().quote.policy.inout.data.toJS(),
            pos = _.findIndex(data, (r) => r.year === rowid);
        if (pos >= 0) {
            data.splice(pos,1); // remove the 1 row
            this.uistate.get().quote.policy.inout.set({data:data}).now();
        }
    }

    onFormChange(values, path) {
        // console.log("onFormChange, values & path ", values, path);
    }
    addRow() {
        let values = this.refs.form.getValue();
        console.log("InoutView.add ---> values", values);
        if (values) {
            // check that the year is not already entered
            let rows = _.filter(this.uistate.get().quote.policy.inout.data, (row) => row.year === values.year );
            if (rows.length > 0) {
                AlertIOS.alert(
                  'Errors',
                  'There is already an entry for the specified year',
                  [
                    {text:'OK', style:"default" ,onPress : (txt) => console.log(txt)}
                  ]
                );
                return
            }
            if (values.in <= 0 && values.out <= 0) {
                AlertIOS.alert(
                  'Errors',
                  'Please enter the topup or withdrawal amount.',
                  [
                    {text:'OK', style:"default" }
                  ]
                );
                return
            }

            this.uistate.get().quote.policy.inout.data.push(values).now();
            this.uistate.get().quote.policy.inout.set( { data : this.uistate.get().quote.policy.inout.data.toJS() });

            // setTimeout(()=> {
            //     // updated the state, now we have to update the datasource and force the ui to refresh
            //     let rows = this.uistate.get().quote.policy.inout.data.toJS(),
            //         identities = _.map(rows,(item) => item.year );
            //     this.setState({dataSource:this.state.dataSource.cloneWithRows(rows,identities)});
            // },0);
        }
    }
    render() {

        InOutForm.stylesheet = formstyles;
        let qstate = this.uistate.get().quote,
            inout = qstate.policy.inout.data,
            ids = _.map(inout,(item) => item.year );
        this.ds = this.ds.cloneWithRows(inout,ids);


        // var inoutdata = {year:undefined, in:undefined, out:undefined};
        // let row = this.uistate.get().quote.current_inout.toJS(),
        // rowdata = _.isEmpty( row) ? this.uistate.get().quote.policy.inout.defaults : row ;
        console.log("InOutView.render, row ",  JSON.stringify(this.state.value));
        let res = (
        <View style={{flex:1, flexDirection:"column"}} >

            <View style={{flex:0.1, flexDirection:"row", padding : 10}} >

                <InOutForm style={{flexDirection:"row"}}
                  ref="form"
                  type={model}
                  options={options}
                  value={this.state.value}
                  onChange={this.onFormChange.bind(this)}
                />

                <View style={{paddingTop:32, paddingLeft: 20}} >
                    <Button textStyle={{color:"white", fontSize:16}}
                        style={{paddingTop:0, width:100, height:35, backgroundColor:"#3fb1ee", borderWidth:0 }}
                        onPress={()=>this.addRow()} isDisabled={false} >
                                  Add
                    </Button>
                </View>
            </View>

            <ScrollView style={{flex:0.9,backgroundColor: '#F6F6F6', paddingTop:20}}>
              <ListView
                  dataSource={this.ds}
                  renderRow={ this.renderRow.bind(this) }
                  renderHeader={()=> this.renderHeader()}
                />

            </ScrollView>

        </View>
        );
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
    backgroundColor: '#F6F6F6',
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
})
