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
import {LocalNumber, LocalSelect, LocalTextbox, Hidden} from "../form/localComponents";

var Icon = require('react-native-vector-icons/FontAwesome');
var dh = Dimensions.get('window').height,
    dw = Dimensions.get('window').width;

var localstyles = require("../localStyles"),
    t = require('tcomb-form-native'),
    numeral = require('numeral'),
    formstyles = _.clone(localstyles,true);

var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;

t.form.Form.i18n = {
optional: '',
required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var Form = t.form.Form;
var model = t.struct({
    internal_id : t.maybe(t.String),
    product_name : t.maybe(t.String),
    term : t.maybe(t.Number),
    premium : t.maybe(t.Number),
    initial_sa : t.maybe(t.Number),
});
var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        return (
        <View style={{flex:1, flexDirection:'column'}} >
            <View style={{flexDirection:'row',  flex: 0.5}} >
                {inputs.internal_id}
                {inputs.product_name}
            </View>
            <View style={{flexDirection:'row', flex: 0.5}} >
                {inputs.initial_sa}
                {inputs.term}
                {inputs.premium}
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
            internal_id : {
                factory : LocalTextbox,
                editable : false,
                style : {width:200},
                label : 'Product code'

            },
            product_name : {
                editable : false,
                style : { width : 400}
            },
            initial_sa : {
                factory : LocalNumber,
                style : { width : 200},
                label : 'Sum assured',
                editable : false
            },
            term : {
                factory : LocalTextbox,
                style : { width : 200},
                editable : false
            },
            premium : {
                factory : LocalNumber,
                style : { width : 200},
                editable : false
            },
        }
    }
    return options
}
var TAG = "ProposalS1PlanView.";
export default class ProposalS1PlanView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../state");
      // this.ds is for riders
      this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, secid, rowid) => {
            return _.find(data.s1, (row,index) => index === rowid );
          }
      });
      this.dsFunds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, secid, rowid) => {
            return _.find(data.s1, (row,index) => index === rowid );
          }
      });
      let row = _.assign({}, this.uistate.get().proposal.s1.quotation.policy.main );
      row.term = row.coverage_term ? row.coverage_term : row.premium_term;
      this.state = { value : row };

    }

    renderRow(data, sectionId, rowId) {
    //   console.log(TAG + "renderRow -->data, s, r", data, sectionId, rowId );
      let levelDesc = '';
      if (data.benefitLevel) {
          // get the plan desc
          let gbl = window || global || root;
          let levels = gbl.api.getBenefitLevelPlans(data.rider_id);
          let level = _.find(levels, (row) => String(row.level) === String(data.benefitLevel) )
          levelDesc = level ? level.level_desc : ''
      }

      return (
        <TouchableOpacity onPress={() => this.pressRow(rowId)}>
          <View style={{padding:15}}>
            <View style={styles.row}>

                <View style={{flex:0.2}} >
                    <Text>{data.rider_code}</Text>
                </View>
                <View style={{flex:0.4}} >
                    <Text>{data.product_name}</Text>
                </View>

                <View style={{flex:0.2}} >
                    <Text>{data.initial_sa ? formatNumber(data.initial_sa) : levelDesc }</Text>
                </View>
                <View style={{flex:0.2}} >
                    <Text>{data.prem ? formatNumber(data.prem): formatNumber(data.monthly_cor)}</Text>
                </View>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableOpacity>
      );
    }

    renderHeader() {
        return (
            <View style={{flex:1, flexDirection:"column"}} >
                <Text style={{fontSize:20,color:'#3b49ef'}}>Rider information</Text>
                <View style={[styles.section, {flexDirection:"row", justifyContent:"flex-start", padding : 5}]} >

                    <View style={{flex:0.2} } >
                        <Text style={styles.sectionText}>{"Product code"}</Text>
                    </View>

                    <View style={{flex:0.4}} >
                        <Text style={styles.sectionText}>{"Product name"}</Text>
                    </View>
                    <View style={{flex:0.22}} >
                        <Text style={styles.sectionText}>{"SA / Benefit Level"}</Text>
                    </View>
                    <View style={{flex:0.22}} >
                        <Text style={styles.sectionText}>{"Premium / Monthly Charges"}</Text>
                    </View>

                </View>
            </View>
        );
    }

    pressRow(rowId) {
      console.log(TAG + "pressRow --> rowId", rowId);
    }

    renderFundRow(data, sectionId, rowId) {
    //   console.log(TAG + "renderRow -->data, s, r", data, sectionId, rowId );
      return (
        <TouchableOpacity onPress={() => {} }>
          <View style={{padding:15}}>
            <View style={styles.row}>

                <View style={{flex:0.2}} >
                    <Text>{data.fund_code}</Text>
                </View>
                <View style={{flex:0.6}} >
                    <Text>{data.fund_name}</Text>
                </View>

                <View style={{flex:0.2}} >
                    <Text>{formatNumber(data.percentage)}</Text>
                </View>
            </View>
            <View style={styles.separator} />
          </View>
        </TouchableOpacity>
      );
    }

    renderFundHeader() {
        return (
            <View style={{flex:1, flexDirection:"column"}} >
                <Text style={{fontSize:20,color:'#3b49ef'}}>Fund information</Text>
                <View style={[styles.section, {flexDirection:"row", justifyContent:"flex-start", padding : 5}]} >

                    <View style={{flex:0.2} } >
                        <Text style={styles.sectionText}>{"Fund code"}</Text>
                    </View>

                    <View style={{flex:0.6}} >
                        <Text style={styles.sectionText}>{"Fund name"}</Text>
                    </View>

                    <View style={{flex:0.22}} >
                        <Text style={styles.sectionText}>{"Percentage"}</Text>
                    </View>

                </View>
            </View>
        );
    }



    onFormChange(values, path) {
        // console.log("onFormChange, values & path ", values, path);
    }
    saveProposal() {
        this.props.fns.saveProposal();
    }
    render() {

        Form.stylesheet = formstyles;
        let rows = this.uistate.get().proposal.s1.quotation.policy.riders,
            funds = this.uistate.get().proposal.s1.quotation.policy.funds || [];

        funds = _.filter(funds, (f) => f.percentage > 0 );
        let ids = _.map(rows,(item,index) => index ),
            fundIds = _.map(funds,(item,index) => index );

        this.ds = this.ds.cloneWithRows(rows,ids);
        this.dsFunds = this.dsFunds.cloneWithRows(funds,fundIds);
        let res = (
        <View style={{flex:1, flexDirection:"column" , paddingTop:10}} >

            <View style={{flex:0.2, flexDirection:"row", padding : 10, backgroundColor : '#6dcedb', borderRadius:20}} >
                <View style={{flexDirection:'column'}} >
                    <Text style={{fontSize:20, color: '#3b49ef', paddingLeft:10}}>Plan information</Text>
                    <Form style={{flexDirection:"row"}}
                      ref="form"
                      type={model}
                      options={optionsFactory(this)}
                      value={this.state.value}
                      onChange={this.onFormChange.bind(this)}
                    />

                </View>
            </View>

            <ScrollView style={{flex:0.2,backgroundColor: '#f6fffe', paddingTop:20, paddingLeft: 5}}>
              <ListView
                  dataSource={this.ds}
                  renderRow={ this.renderRow.bind(this) }
                  renderHeader={()=> this.renderHeader()}
                />

            </ScrollView>

            <ScrollView style={{flex:0.7,backgroundColor: '#f6fffe', paddingTop:20, paddingLeft: 5}}>
              <ListView
                  dataSource={this.dsFunds}
                  renderRow={ this.renderFundRow.bind(this) }
                  renderHeader={()=> this.renderFundHeader()}
                />

            </ScrollView>



            {/* put in an action button */}
            <View ref="actionButton" style={[styles.overlay],{left:((dw)-100), top:-(420)}}>
              <TouchableOpacity activeOpacity={0.5} onPress={()=> this.saveProposal()}
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
