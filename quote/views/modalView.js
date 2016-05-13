const React = require('react-native');
const Overlay = require('react-native-animatable-overlay');

const {
  Dimensions,
  StyleSheet,
  Component,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ScrollView,
  ListView,
} = React;

import _ from "lodash";
import moment from "moment";
import Button from 'apsl-react-native-button';

const dh = Dimensions.get('window').height;
const dw = Dimensions.get('window').width;
var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;

export default class ModalView extends Component {
  constructor(props) {
    super(props);
    this.uistate = require("../../state");
    this.dsTable = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2 ,
    })
    this.state = {
      show: false,

      width: 0,
      height: 0,

    //   pageX: 0,
    //   pageY: 0,
      //
    //   positionX: 0,
    //   positionY: 0,

      onSelect: () => { }
    };
  }

  _onOverlayPress() {
    const { onSelect } = this.state;
    onSelect(null, null);
    this.setState({
      ...this.state,
      show: false
    });
  }

  closeModal(){
      console.log("close the modal");
      this.uistate.get().quote.set({show_modal:false}).now();
  }

  // prepareTableData(){
  //
  //     let quote = this.uistate.get().quote,
  //         main = quote.current_main,
  //         policy = quote.policy,
  //         people = policy.people.data,
  //         plan = Object.assign({product_id:main.product_id, internal_id: main.internal_id},
  //                this.uistate.get().quote.policy.main.data0,
  //                this.uistate.get().quote.policy.main.data1),
  //         riders = policy.riders.data,
  //         funds  = policy.funds.data,
  //         inout  = policy.inout.data,
  //         gbl = window || global || root,
  //         config  = gbl.api.getSIConfig( parseInt(main.product_id)),
  //         si_colnames = config.si_colnames,
  //         si_fieldnames = config.si_fields,
  //         si_colwidths = config.si_colwidths,
  //         topups, withdrawals,result, svFields;
  //
  //     // colwidths is optional
  //     if (!si_colwidths) {
  //         let wid = (dw-60) / si_colnames.length / (dw-60);
  //         si_colwidths = _.map(si_colnames, (c) => wid) ;
  //     }
  //     topups = _.filter(inout, (row) => row.in > 0).map((row) => { return {year: row.year, amount: row.in } });
  //     withdrawals = _.filter(inout, (row) => row.out > 0).map((row) => { return {year: row.year, amount: row.out } });
  //     // fix some discrepancy is type of sa
  //     if (main.benefit_type === '41') {
  //         plan.basic_sa = plan.initial_sa;
  //     }
  //     ['proposal_date','contract_date'].forEach((f)=> policy[f] = moment(policy[f])); // convert back to integer, workaround
  //     ['la','premium_term'].forEach((f)=> plan[f] = parseInt(plan[f])); // convert back to integer, workaround
  //
  //     let peoplelist = _.map(people, (person) => {
  //         let row = {}
  //         _.forOwn(person,(v,k,obj) => {
  //             row[k] = k === 'dob' ? moment(v).format('YYYY-M-D') : v ;
  //         });
  //         return row;
  //     }) ;
  //
  //     // we only want these few fields, other fields can cause the calculation to assume it is already calculated and thus not recalc
  //     let doc;
  //     let riderlist = _.map(riders, (rider) => {
  //          doc = {  product_id: rider.product_id, internal_id: rider.product_code, initial_sa : rider.initial_sa,
  //                   la : parseInt(rider.la) }
  //          if (rider.cover_term && _.isNumber(rider.cover_term)) doc.cover_term = rider.cover_term;
  //          return doc;
  //     })
  //
  //     let  inputjson = {
  //             policy :
  //               { people : peoplelist,
  //                 products : [plan, ...riderlist] ,
  //                 funds : funds,
  //                 topups : topups,
  //                 withdrawals : withdrawals,
  //                 prem_freq : plan.payment_frequency ,
  //                 proposal_start_date : moment(plan.contract_date).format("D-M-YYYY"),
  //                 proposal_date : moment(plan.proposal_date).format("D-M-YYYY")
  //               }
  //      };
  //      svFields = main.benefit_type === '41' ? [] : ["coverage", "pol.totprem"] ;
  //      result = gbl.api.calc(inputjson, svFields , si_fieldnames );
  //      let si_data = [],row, field_value,
  //          mainrow = result.policy.products[0];
  //          pol = result.policy;
  //
  //    _.forEach( _.range(1,mainrow.max_t+1), (t) => {
  //        row = [];
  //        _.forEach( si_fieldnames, (fname) => {
  //            if (fname === 't') {
  //                row.push(t);
  //            } else {
  //                fname = fname.split('.').length === 2 ? fname.split('.')[1] : fname ;
  //                field_value = _.isUndefined(mainrow[fname]) ? pol[fname] : mainrow[fname] ;
  //                if ( ! _.isUndefined( field_value )) {
  //                    row.push( formatNumber( field_value[t]) );
  //                }
  //            }
  //        });
  //        si_data.push(row);
  //    });
  //    return { columns: si_fieldnames, data : si_data, headers : si_colnames, colwidths : si_colwidths };
  //
  // }
  renderHeader(columns, widths) {
    let headers = _.map(columns, (c,index) => {
        return (<View key={'h'+index} style={{flex:widths[index]}}><Text style={[styles.sectionText,{textAlign:'right'}]}>{c}</Text></View>);

    })

    return (
          <View>
              <View style={[styles.section,{flexDirection:'row', justifyContent:'space-around'}]} >
                {headers}
              </View>
          </View>
      );
  }
  renderRow(data,section, rowId, widths) {
    //   let wid = (dw-60) / data.length / (dw-60) * 0.9 ;

      let columns = _.map(data, (col,index) => {
          let text = <Text style={{textAlign:'right'}}>{ parseInt(col) >= 0 ? formatNumber( col ): '***' }</Text>;
        //   text.onResponderTerminationRequest = () => false;
        //  return  (<View key={'row'+index} style={{flex: widths[index]}}><Text>{ parseInt(col) >= 0 ? formatNumber( col ): '***' }</Text></View>)
         return  (<View key={'row'+index} style={{flex: widths[index]}}>{text}</View>)

        //   return index < 2 ?
        //     (<View key={'row'+index} style={{flex:0.05}}><Text>{ formatNumber( col )}</Text></View>)
        //     :  (<View key={'row'+index} style={{flex:wid}}><Text>{ parseInt(col) >= 0 ? formatNumber( col ): '***'}</Text></View>)
      });
    //   console.log("ModalView.renderRow ==> data.t", data)
      return (
          <TouchableHighlight onPress={() => console.log("selected row pressed")}>
            <View>
              <View style={ data[0] % 2 === 0 ? styles.rowEven : styles.row }>
                {columns}
              </View>
              <View style={styles.separator} />
            </View>
          </TouchableHighlight>

      );
  }

  render() {
    const { show } = this.props;
    // const pageX = pageY = positionX = 0;
    // console.log("ModalView.render ---> value of show", show);
    // let result = this.prepareTableData();
    let result = this.props.result;
    this.dsTable = this.dsTable.cloneWithRows(result.data);
    return (
    	<View style={{justifyContent:'center', top: 100}}>

            {
                <View>
                <TouchableWithoutFeedback style={styles.container} onPress={()=> this.closeModal() }>
                    <View style={[styles.overlay, {top:-dh, left:0, width:dw, height:dh}]}  />
                </TouchableWithoutFeedback>
                </View>
             }
               <View style={{alignItems:'center'}}>
              		<Overlay visible={show} onPress={()=> {} }
                            style={{backgroundColor:'transparent'}}>
                                <View style={{marginTop:20, marginLeft: 20, backgroundColor:'#ffffee', justifyContent: 'center',  width: dw-40}} >

                                    <View style={{backgroundColor:'grey'}}>{this.renderHeader(result.headers,result.colwidths)}</View>

                                    <ScrollView style={{height:dh-130}}>
                                      <ListView
                                          dataSource={this.dsTable}
                                          renderRow={ (data, sid, rid) => this.renderRow(data, sid, rid, result.colwidths) }
                                        //   renderSectionHeader={()=> this.renderHeader(result.headers, result.colwidths)}
                                        />
                                    </ScrollView>

                                    <View style={{flexDirection:'row', justifyContent: 'center'}} >
                                        <Button textStyle={{color:"white", fontSize:16}}
                                            style={{ width:dw/2, height:35, marginTop: 10, marginBottom:10,
                                                backgroundColor:"#3fb1ee", borderWidth:0 }}
                                            onPress={()=>this.closeModal() } isDisabled={false} >
                                                      Close
                                        </Button>
                                    </View>


                                </View>
          		    </Overlay>
                </View>
      </View>
    );
  }
}

ModalView.propTypes = {
};

ModalView.defaultProps = {
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
    // backgroundColor: 'gray',
    width: dw,
    height: dh
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
    row: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 2,
      backgroundColor: '#FFFFFF',
    },
    rowEven: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 2,
      backgroundColor: '#F0F8FF',
    },
    separator: {
      height: 1,
      backgroundColor: '#CCCCCC',
    },



});
