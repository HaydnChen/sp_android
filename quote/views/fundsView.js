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
  AlertIOS,
  TouchableHighlight,
} = React

import _ from "lodash";
import {LocalNumber} from "../../form/localComponents";
import Button from 'apsl-react-native-button';

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
var FundForm = t.form.Form;

var model = t.struct({
  code : t.String,
  name : t.String,
  percentage : t.maybe(t.Number),
});

var options = {
    fields : {
        code : {
            editable : false
        },
        name : {
            editable : false
        },
        percentage : {
            factory : LocalNumber,
        }
    }
}

var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;

export default class FundsView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../../state");
      this.state = this.getInitState();
    }

    getInitState(){
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, secid, rowid) => {
            return _.find(data.s1, (row) => row.fund_code === rowid );
          }
      });

      let main = this.uistate.get().quote.current_main,
          availableFunds = [];

    //   availableFunds = [ {fund_code: 'AER', fund_name : 'Acme Equity Fund'},{ fund_code: 'AER2', fund_name : 'Mock 2'}]

      if ( this.uistate.get().quote.policy.funds.data.length == 0) {

          if (main.internal_id) {
              let gg = window || global || root;
              availableFunds = gg.api.availableFunds(main.product_id);
          }
          let funds = _.map(availableFunds, (fund) => {
              return { fund_code : fund.fund_code, fund_name : fund.fund_name, percentage : 0.00 }
          });


        //   let identities = _.map(availableFunds,(fund) => fund.fund_code );
          this.uistate.get().quote.policy.funds.set({data: funds});
      }

      return {
        // dataSource: ds.cloneWithRows(availableFunds, identities),
        value : {
            code : '',
            name : '',
            percentage : 0.00
        }
      }
    }

    renderRow(data, sectionId, rowId) {
    //   console.log("data, s, r", data, sectionId, rowId )

      let bgcolor = 'white';
      if (this.uistate.get().quote.current_fund &&
          this.uistate.get().quote.current_fund.fund_code === rowId  && rowId !== undefined) {
          bgcolor = '#cceeff';
      }


      return (
        <TouchableHighlight onPress={() => this.pressRow(rowId)}>
          <View>
            <View style={[styles.row,{backgroundColor:bgcolor}] }>

                <View style={{flex:0.2}} >
                    <Text>{data.fund_code}</Text>
                </View>

                <View style={{flex:0.6}} >
                    <Text>{data.fund_name}</Text>
                </View>

                <View style={{flex:0.2}} >
                    <Text>{data.percentage}</Text>
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
            <View style={styles.section} >
                <Text style={styles.sectionText}> {"Available funds for " + main.product_name + " (" + main.internal_id + ")" } </Text>
            </View>
        );

    }
    onFormChange(data, path){


    }

    pressRow(rowId) {
      console.log("FundsView.pressRow --> rowId", rowId);
      let funds = this.uistate.get().quote.policy.funds.data,
          fund = _.find(funds, (f) => f.fund_code === rowId) ;

      this.uistate.get().quote.set({ current_fund : fund }).now();
      this.uistate.get().quote.policy.funds.set( { data : this.uistate.get().quote.policy.funds.data.toJS() });

      this.setState({
          value : {
              code : fund.fund_code,
              name : fund.fund_name,
              percentage : fund.percentage
          }
      });
    }
    save() {
        let values = this.refs.form.getValue();
        console.log("saveRider, values = ", values);

        // check that the input, particularly the la and initial_sa is set
        if (!values || values.percentage < 0 ) {
            AlertIOS.alert(
              'Errors',
              'Please enter the percentage for this fund...',
              [
                {text:'OK', style:"default" ,onPress : (txt) => console.log(txt)}
              ]
            );
            return;
        }
        // now to update the funds to include this percentage
        let funds = this.uistate.get().quote.policy.funds.data.toJS(),
            index = _.findIndex(funds, (f) => f.fund_code === values.code );
        funds[index].percentage = values.percentage;
        this.uistate.get().quote.policy.funds.set({data: funds});
        this.setState( { value : values})
    }

    render() {
      FundForm.stylesheet = formstyles;

      let funds = this.uistate.get().quote.policy.funds.data;
      let ids = _.map(funds,(fund) => fund.fund_code );
      this.ds = this.ds.cloneWithRows(funds, ids);
    //   console.log("FundsView.render...")

      return(

      <View style={{flex:1, flexDirection:"column"}} >


            <View style={{flex:0.1, flexDirection:"row", padding : 10}} >

                <FundForm style={{flexDirection:"row"}}
                  ref="form"
                  type={model}
                  options={options}
                  value={this.state.value}
                  onChange={this.onFormChange.bind(this)}
                />

                <View style={{paddingTop:32, paddingLeft: 20}} >
                    <Button textStyle={{color:"white", fontSize:16}}
                        style={{paddingTop:0, width:100, height:35, backgroundColor:"#3fb1ee", borderWidth:0 }}
                        onPress={()=>this.save()} isDisabled={false} >
                                  Ok
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
    padding: 10,
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
