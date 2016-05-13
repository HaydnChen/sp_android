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
import moment from "moment";
import Button from 'apsl-react-native-button';
import {LocalNumber,LocalSelect,LocalTextbox} from "../../form/localComponents";

var deviceWidth = Dimensions.get('window').width;
var Icon = require('react-native-vector-icons/FontAwesome');
var localstyles = require("../../localStyles"),
    t = require('tcomb-form-native'),
    numeral = require('numeral'),
    formstyles = _.clone(localstyles,true);


formstyles.formGroup.normal.flexDirection = 'column';
formstyles.formGroup.error.flexDirection = 'column';
formstyles.fieldset.flexDirection = "row";
t.form.Form.i18n = {
optional: '',
required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var RiderForm = t.form.Form;

var modelFactory = (uistate, self) => {

    var peopleFn = () => {
          return _.object( _.map(uistate.get().quote.policy.people.data, (person,idx) => [ String(idx) , person.name])
                            .filter((p) => p[1]) ); // only if the name is defined
        };

    var Positive = t.refinement(t.Number, function (n) {
      return n > 0;
    });

    // get the availableBenefitLevels for the product
    let state = self.uistate.get().quote;
    let gbl = window || global || root,
        main = self.uistate.get().quote.current_main,
        rider = self.uistate.get().quote.current_rider,
        levels = {};
    self.benefitLevels = [];
    if (rider) {
        self.benefitLevels = gbl.api.getBenefitLevelPlans(rider.rider_id); // rows should be like [ {productLevel:1, levelDesc:'Plan750', levelAmount : 500000},....]
        _.forEach(self.benefitLevels, (row) => {
            levels[row.level] = row.level_desc;
       })
    }
    let isLevelProduct = self.benefitLevels.length > 0 ;
    // if (self.benefitLevels.length > 0) {debugger}

    var model = {
      product_code : t.String,
      product_name : t.String,
      la           : t.enums( peopleFn() ),
    //   initial_sa : t.maybe(Positive),
    //   benefitLevel : t.maybe(BenefitLevel),
    //   cover_age  : t.Number
    }
    if (isLevelProduct) {
        model.benefitLevel = t.maybe( t.enums(levels) );
    } else {
        model.initial_sa = t.maybe(t.Number)
    }
    if (state.current_rider && (state.current_rider.rider_code === 'IHSR05' || state.current_rider.rider_code === 'HCP')) {
        model.cover_age = t.maybe(t.Number)
    }

    return t.struct(model);
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        let state = self.uistate.get().quote;
        if ( _.isNull(this.benefitLevels)) {
            let rider = self.uistate.get().quote.current_rider;
            let gbl = window || global || root;
            if (rider) {
                self.benefitLevels = gbl.api.getBenefitLevelPlans(rider.rider_id); // rows should be like [ {productLevel:1, levelDesc:'Plan750', levelAmount : 500000},....]
            } else {
                self.benefitLevels = []
            }
        }
        let isLevelProduct = self.benefitLevels.length > 0 ;
        let hasCoverAge = state.current_rider ? state.current_rider.rider_code === 'IHSR05' || state.current_rider.rider_code === 'HCP' : false;

        return (
        <View style={{flex:1, flexDirection:'row'}} >
            <View style={{flex:0.10, flexDirection:'column'}}>
                {inputs.product_code}
            </View>
            <View style={{flex:0.23, flexDirection:'column'}}>
                {inputs.product_name}
            </View>
            <View style={{flex:0.22 , flexDirection:'column'}}>
                {inputs.la}
            </View>

            <View style={{flex: hasCoverAge ? 0.15 : 0.25, flexDirection:'column'}} >
                {isLevelProduct ? inputs.benefitLevel : inputs.initial_sa }
            </View>

            <View style={{flex: hasCoverAge ? 0.1 : 0.01, flexDirection:'column'}}>
                {hasCoverAge ? inputs.cover_age : <View /> }
            </View>
        </View>
        );
    }
    return tmpl
}

var optionsFactory = (uistate, self) => {
    let selected = uistate.get().quote.current_rider,
        hidden = () => <View />,
        opts = {
            template : layout(self),
            fields : {
                product_code : {
                    factory  : LocalTextbox,
                    editable : false,

                },
                product_name : {
                    factory  : LocalTextbox,
                    style    : { width: 250 },
                    editable : false,
                },
                la : {
                  factory : LocalSelect,
                  label    : 'Life assured',
                  height : 35,
                  nullOption : { text : 'No selection' , value : '' }
                },
                initial_sa : {
                    factory : LocalNumber,
                    label : 'Sum assured',
                    width : 150
                },
                cover_age : {
                    factory : LocalNumber,
                    width : 80,
                    label : 'Till age',
                },
                benefitLevel : {
                    factory : LocalSelect,
                    label : 'Plan type',
                    width : 120
                }
            }
        };
    // if ((!selected) || selected.rider_code !== 'IHSR05') {
    //   opts.fields.cover_age.template = hidden;
    // }
    return opts;
}
var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;


export default class RidersView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../../state");
      this.state = this.getInitState();
      this.currentMain = this.uistate.get().quote.current_main;
      this.selectedRows = [];
      this.allIcons = {};
      this.dsSelected = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, sid, rid) =>  {
             return  _.find(data.s1, (row,index) => index === rid )
          }
      });
      this.benefitLevels = null;
    }

    getInitState(){
      let dsAvailable = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          getRowData: (data, sid, rid) => {
            //   console.log("** getRowData", data.s1, rid);
            return _.find(data.s1, (row,index) => index === rid );
          }
      });

      let main = this.uistate.get().quote.current_main,
          riders = this.uistate.get().quote.policy.riders.data.toJS(),
          availableRiders = [];

      if (main.internal_id) {
          let gg = window || global || root,
              inputjson = { policy : { people :  [], products : [main, ...riders]}};

          availableRiders = gg.api.availableRiders(inputjson);
      }
      let availableIds = _.map(availableRiders,(rider,index) => index) || [],
          selectedIds = _.map(riders,(rider,index) => index ) || [];

      let valuedata = {product_code :undefined, product_name : undefined, initial_sa : '', cover_age : ''};
      this.availableRiders = availableRiders; // save for later use
      // selected riders should be stored in state
    //   debugger;
      return {
        availableDataSource: dsAvailable.cloneWithRows(availableRiders, availableIds),
        value : valuedata,
        selected : '',
      }
    }

    // code not used at the moment

    // setOpacity(rowId) {
    //   let icon = this.allIcons[rowId];
    //   let matches = this.selectedRows.filter((item) => item === rowId);
    //   if (matches.length === 1) {
    //     let index = this.selectedRows.indexOf(matches[0]);
    //     this.selectedRows.splice(index,1);
    //     icon.setNativeProps({style: {opacity: 1}});
    //     this.setState({selected : ''})
    //
    //   } else {
    //     this.selectedRows.push(rowId);
    //     icon.setNativeProps({style: {opacity: 0}});
    //     this.setState({selected: rowId});
    //   }
    //
    // }

    renderAvailableRow(data, sectionId, rowId) {
        // console.log(">>>>>>renderAvailableRow", rowId, data);

      let bgcolor = 'white';
      if (this.uistate.get().quote.current_index && this.uistate.get().quote.current_index == rowId ) {
        //   let current = _.find(this.availableRiders, (r,index) => index === rowId );
        //   if (current)
        //   this.uistate.get().quote.current_rider.rider_code === rowId  && rowId !== undefined) {
          bgcolor = '#cceeff';
      }
    //   if (this.uistate.get().quote.current_rider &&
    //       this.uistate.get().quote.current_rider.rider_code === rowId  && rowId !== undefined) {
    //       bgcolor = '#cceeff';
    //   }

    //   let selected =
    //       <TouchableOpacity key={rowId} onPress={() => this.setOpacity(rowId)} style={[styles.tab]}>
      //
    //         <Icon name={'check-square-o'} size={20} color='#3B5998' style={{width: 30, height: 30, position: 'absolute', top: 0, left: 10}}
    //               ref={(icon) => {  }}/>
      //
    //         <Icon name={'square-o'} size={20} color='#ccc' style={{width: 30, height: 30, position: 'absolute', top: 0, left: 10}}
    //               ref={(icon) => { this.allIcons[rowId] = icon  } }/>
      //
      //
    //       </TouchableOpacity>;


      return (
        <TouchableHighlight onPress={() => this.pressRow(rowId)}>
          <View>
            <View style={[styles.row,{backgroundColor:bgcolor}] }>


                <View style={{flex:0.2}} >
                    <Text>{data.rider_code}</Text>
                </View>

                <View style={{flex:0.7}} >
                    <Text>{data.rider_name}</Text>
                </View>

            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      );
    }


    renderSelectedRow(data, sectionId, rowId) {
        let main = this.uistate.get().quote.current_main;
        if ( main.benefit_type === '41') {
            return this.renderUnitLinkRow(data, sectionId, rowId);
        } else {
            return this.renderTraditionalRow(data, sectionId, rowId);
        }
    }

    renderUnitLinkRow(data,sectionId,rowId) {
        // have to call the engine to get some data
      return (
        <TouchableHighlight onPress={() => console.log("selected row pressed")}>
          <View>
            <View style={ styles.row }>

                <View style={{flex:0.15}} >
                    <Text>{data.rider_code}</Text>
                </View>

                <View style={{flex:0.43}} >
                    <Text>{data.rider_name}</Text>
                </View>

                <View style={{flex:0.14}} >
                    <Text>{formatNumber(data.monthly_cor)}</Text>
                </View>
                <View style={{flex:0.14}} >
                    <Text>{formatNumber(data.maturity_age)}</Text>
                </View>

                <View style={{flex:0.14}}>
                    <TouchableOpacity key={rowId} onPress={() => this.removeRider(rowId)} style={[styles.tab]}>
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </TouchableOpacity>
              </View>

            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      );
    }
    renderTraditionalRow(data,sectionId,rowId) {
        return (
          <TouchableHighlight onPress={() => console.log("selected row pressed")}>
            <View>
              <View style={ styles.row }>

                  <View style={{flex:0.1}} >
                      <Text>{data.rider_code}</Text>
                  </View>

                  <View style={{flex:0.4}} >
                      <Text>{data.rider_name}</Text>
                  </View>

                  <View style={{flex:0.15}} >
                      <Text>{formatNumber(data.prem)}</Text>
                  </View>
                  <View style={{flex:0.15}} >
                      <Text>{formatNumber(data.ap)}</Text>
                  </View>
                  <View style={{flex:0.15,}} >
                      <Text>{formatNumber(data.premium_term)}</Text>
                  </View>

                  <View style={{flex:0.05}}>
                      <TouchableOpacity key={rowId} onPress={() => this.removeRider(rowId)} style={[styles.tab]}>
                          <Icon name={'trash'} size={20} color='#3B5998' />
                      </TouchableOpacity>
                </View>

              </View>
              <View style={styles.separator} />
            </View>
          </TouchableHighlight>
        );
    }

    renderAvailableHeader() {
        let main = this.uistate.get().quote.current_main;
        // <Text style={styles.sectionText}>{"Selected : " + this.state.selected} </Text>
        return (
            <View style={styles.section} >
                <Text style={styles.sectionText}> {"Available Riders for " + main.product_name + " (" + main.internal_id + ")" } </Text>
            </View>
        );
    }
    renderSelectedHeader() {
        let main = this.uistate.get().quote.current_main, header2;
        // <View style={[styles.section, {flexDirection:"row", justifyContent:"flex-start", padding : 5}]} >
        if (main.benefit_type === '41') {
            header2 = (
                <View style={[styles.section, {flexDirection:"row", justifyContent:"flex-start", paddingLeft : 10}]} >
                    <View style={{flex:0.15} } >
                        <Text style={styles.sectionText}>Code</Text>
                    </View>
                    <View style={{flex:0.4} } >
                        <Text style={styles.sectionText}>Description</Text>
                    </View>
                    <View style={{flex:0.15}} >
                        <Text style={styles.sectionText}>Monthly charges</Text>
                    </View>
                    <View style={{flex:0.15}} >
                        <Text style={styles.sectionText}>Cover end age</Text>
                    </View>
                    <View style={{flex:0.15}} >
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </View>
                </View>
            )
        } else {
            header2 = (
                <View style={[styles.section, {flexDirection:"row", justifyContent:"flex-start", paddingLeft : 10}]} >
                    <View style={{flex:0.1} } >
                        <Text style={styles.sectionText}>Code</Text>
                    </View>
                    <View style={{flex:0.38} } >
                        <Text style={styles.sectionText}>Description</Text>
                    </View>
                    <View style={{flex:0.14}} >
                        <Text style={styles.sectionText}>Premium</Text>
                    </View>
                    <View style={{flex:0.14}} >
                        <Text style={styles.sectionText}>Annual Premium</Text>
                    </View>
                    <View style={{flex:0.16}} >
                        <Text style={styles.sectionText}>Premium term</Text>
                    </View>
                    <View style={{flex:0.05}} >
                        <Icon name={'trash'} size={20} color='#3B5998' />
                    </View>
                </View>
            )
        }
        return (
            <View>
                {/*
                <View style={styles.section} >
                    <Text style={styles.sectionText}> Selected Riders  </Text>
                </View>
                */}
                <View style={{}} >
                    <Text style={{fontSize:20}}> Selected Riders  </Text>
                </View>

                {header2}
            </View>
        );
    }


    pressRow(rowId) {
    //   console.log("RidersView.pressRow --> rowId", rowId);
    //   let current = _.find(this.availableRiders, (r) => r.rider_code === rowId );
      let current = _.find(this.availableRiders, (r,index) => index === rowId );
      this.uistate.get().quote.set({ current_rider : current, current_index : rowId }).now();

      // workaround to force it to re-render the rows -- clone the datasource

      let _ds = JSON.parse(JSON.stringify(this.availableRiders));
    //   let identities = _.map(this.availableRiders,(rider) => rider.rider_code );
      let identities = _.map(this.availableRiders,(rider,index) => index );
      // set the value as well, what should the default value for cover_age ?
      // get from engine , entry_age + cover_term
      var cover_age = 0;
      if (['HCP','IHSR05'].indexOf(current.rider_code) >= 0 ) {

          let inputjson = { policy : {
              people : this.uistate.get().quote.policy.people.data,
              products : [ {
                  product_id : current.rider_id,
                  internal_id : current.rider_code,
                  la : 0
              }]
          } };
          let gbl = window || global || root;
          try {
              let res = gbl.api.calc(inputjson, ['cover_term','entry_age']);
              cover_age = res.policy.products[0].cover_term + res.policy.products[0].entry_age;
          } catch (e) {
              cover_age = 0;
          }
      }
      this.setState({
          availableDataSource : this.state.availableDataSource.cloneWithRows(_ds, identities),
          value : {
              product_code : current.rider_code,
              product_name : current.rider_name,
              la : '0',
              initial_sa   : 0,
              cover_age    : cover_age
          }
      });

    }

    onFormChange(data, path) {
        // console.log("onformchange, data & path ", data, path);
        // console.log("onFormChange, data, path",data, path, data[ path[0]]);
        var cover_age = 0;
        if (path[0] === 'la') {
            var current = this.uistate.get().quote.current_rider;

            if (['HCP','IHSR05'].indexOf(current.rider_code) >= 0 ) {

                let inputjson = { policy : {
                    people : this.uistate.get().quote.policy.people.data,
                    products : [ {
                        product_id : current.rider_id,
                        internal_id : current.rider_code,
                        la : data[ path[0] ]
                    }]
                } };
                let gbl = window || global || root;
                try {
                    let res = gbl.api.calc(inputjson, ['cover_term','entry_age']);
                    cover_age = res.policy.products[0].cover_term + res.policy.products[0].entry_age;
                } catch (e) {
                    cover_age = 0;
                }
            }

        }

        let state = {} ;
        _.forOwn(data, (v, k) => state[k] = v);

        if (cover_age > 0) {
            state.cover_age =  cover_age;
        }
        // state[path[0]] = data[ path[0]];
        // console.log("onFormChange, state", state)
        this.setState({value: state} )

    }

    removeRider(rowId) {
        console.log( `removing rider with id ${rowId}`);
        let riders = this.uistate.get().quote.policy.riders.data.toJS(),
            gbl = window || global || root,
            main = this.uistate.get().quote.current_main;

        // _.remove(riders, (rider) => rider.rider_code === rowId );
        _.remove(riders, (rider,index) => index === rowId );

        let inputjson = { policy : { people :  [], products : [main, ...riders]}},
            availableRiders = gbl.api.availableRiders(inputjson),
            // idsAvailable = _.map(availableRiders,(rider) => rider.rider_code );
            idsAvailable = _.map(availableRiders,(rider,index) => index );

        this.availableRiders = availableRiders;
        this.setState({
            availableDataSource : this.state.availableDataSource.cloneWithRows(this.availableRiders, idsAvailable),
            value : {
                product_code : '',
                product_name : '',
                la           : '',
                initial_sa   : '',
                cover_age    : ''
            }

        });
        this.uistate.get().quote.set({current_rider:null, current_index: null}).now();
        this.uistate.get().quote.policy.riders.set({data: riders}).now();
    }
    alert(msg=null, title="Error") {
        let message = msg ? msg : 'Please fix the errors, before moving to the next view'
        AlertIOS.alert(
          title,
          message,
          [
            {text:'OK', onPress : (txt) => console.log(txt)}
          ],
        //   'default'
        );
    }

    saveRider() {
        let values = this.refs.form.getValue();
        // console.log("saveRider, values = ", values);

        // check that the input, particularly the la and initial_sa is set
        if (!values || values.initial_sa <= 0 || values.la === '' ) {
            this.alert( 'Please fix errors before saving the rider...' );
        }
        // we need to check the available riders again... and set the availableRiders,
        // we need to set the selected riders, by saving it to uistate, and also force rendering of selectedRiders,
        // we also need to clear the input form
        if ( values && this.uistate.get().quote.current_main ) {

            let main = this.uistate.get().quote.current_main,
                riders = this.uistate.get().quote.policy.riders.data.toJS() || [] ,
                available = _.find(this.availableRiders, (r) => r.rider_code == values.product_code ),
                newRider = Object.assign( {}, available, values),
                gbl = window || global || root,
                qstate = this.uistate.get().quote,
                people = qstate.policy.people.data,
                inputjson, availableRiders, idsAvailable, result,
                data0 = qstate.policy.main.data0,
                data1 = qstate.policy.main.data1,
                plan = Object.assign({product_id:main.product_id, internal_id: main.internal_id},data0, data1),
                request, rno, rider;

            ['la','premium_term'].forEach((f)=> plan[f] = parseInt(plan[f]));
            let proposal_date = moment(plan.proposal_date).format("D-M-YYYY"),
                proposal_start_date = moment(plan.contract_date).format("D-M-YYYY"),
                prem_freq = plan.payment_frequency;

            // get the benefit levels , sa if required
            if (values.benefitLevel) {
                let benefitLevels = gbl.api.getBenefitLevelPlans(newRider.rider_id); // rows should be like [ {productLevel:1, levelDesc:'Plan750', levelAmount : 500000},....]
                let level = _.find(benefitLevels, (item, index) => item.level === values.benefitLevel);
                newRider.initial_sa = level ? level.level_amount : 50000; // hard code to 50 k just in case for testing
            }
            newRider.product_id = newRider.rider_id;
            let ppl = _.filter(people, (p) => p.name );
            riders.push(newRider);
            inputjson = { policy : { people : ppl, products : [plan, ...riders] ,
                'prem_freq' : prem_freq , proposal_start_date : proposal_start_date, proposal_date : proposal_date
             } };

            // _.forEach(inputjson.policy.people,(p,index) => {
            //     // fix format of dob ?
            //
            // })
            rider = riders.length ;
            rno = 'r' + rider + ".";

            // call engine for some validations first, check the age_limit, sum_assured...
            let validators = [];
            if ('la' in values) { validators.push ( rno + 'check_age_limit')}
            if ('initial_sa' in values) { validators.push ( rno + 'check_sa_limit')}
            let errors = gbl.api.validate(inputjson,validators);
            let allErrors = [];
            _.forOwn(errors, (v,k) => {
                allErrors = allErrors.concat(v)
            })
            // console.log("Save Rider -->", validators, errors, allErrors);
            if (allErrors.length > 0 ) {
                    let msg = allErrors.join('. ')
                    this.alert(msg);
                    return;
            }

            // set request for calculation
            request = main.benefit_type === '41' ? [rno+"monthly_cor", rno+"maturity_age"]
                                                 : [rno+"prem", rno+"ap", rno+"premium_term"];
            // debugger;
            result = gbl.api.calc(inputjson, request);

            Object.assign(newRider, result.policy.products[rider]);

            // availableRiders = gbl.api.availableRiders(inputjson),
            // idsAvailable = _.map(availableRiders,(rider) => rider.rider_code );




                // do some extra work, to calculate some values for the rider just added
                // if traditional, we calculate the prem, ap, and premium term
                // if unit link, we calculate the maturity_age, cor_at_t for t = 1,


                // let riderIds = _.pluck( riders.available_riders, 'rider_id' );
                // let idx = riderIds.indexOf( parseInt(row.rider_id)); // must find it
                // row['rider_name'] = riders.available_riders[idx].rider_name;
                // row['rider_code'] = riders.available_riders[idx].rider_code;
                // let person = row.la ? parseInt(row.la) : 0; // assume 0 , should not happen
                // row['la_name'] = prospects.data[person].name;
                // row.initial_sa = parseFloat( row.initial_sa.trim().replace(/,/g,'') || '0' ); // convert back to float
                //
                // // now for the big elephant , prem & annual_premium, needs to call the engine to calculate
                // let prd = {};
                // prd.product_id = row.rider_id;
                // prd.internal_id = row.rider_code;
                // prd.la = parseInt( row.la );
                // prd.initial_sa = row.initial_sa;
                //
                // let las = prospects.data;
                // let inputjson = { policy : {people : las, products: [ prd ], 'prem_freq' : main.data.prem_freq   } }
                // let result = engine.calc( inputjson, ["prem","ap","premium_term"] ); // calculate the prem, annual premium & premium term
                // // retrieve the results
                // row.premium = result.policy.products[0].prem ;
                // row.annual_premium = result.policy.products[0].ap;
                // row.premium_term = result.policy.products[0].premium_term ;
                //
                // let rows = [...riders.data];
                // rows.push(row);
                // this.setAvailableRiders( rows );
                //




            // riders.push(newRider);
            //
            // let gbl = window || global || root,
            //     inputjson = { policy : { people :  [], products : [main, ...riders]}};

            this.availableRiders = gbl.api.availableRiders(inputjson);
            // idsAvailable = _.map(this.availableRiders,(rider) => rider.rider_code );
            idsAvailable = _.map(this.availableRiders,(rider,index) => index );

            this.setState({
                availableDataSource : this.state.availableDataSource.cloneWithRows(this.availableRiders, idsAvailable),
                value : {
                    product_code : '',
                    product_name : '',
                    la           : '',
                    initial_sa   : '',
                    cover_age    : ''
                }
            });
            this.uistate.get().quote.policy.riders.set({data:riders}).now();
        }
    }

    render() {
      RiderForm.stylesheet = formstyles;
    //   console.log("RidersView.render....")
      let data = this.uistate.get().quote.policy.riders.data,
        //   ids = _.map(data, (r) => r.rider_code );
          ids = _.map(data, (r,index) => index );

      this.dsSelected = this.dsSelected.cloneWithRows(data,ids);

    let modelInfo = modelFactory(this.uistate,this);
    let optionInfo = optionsFactory(this.uistate,this);

    //console.log("value of value", this.state.value, JSON.stringify(this.state.value))

    // debugger;

      return(
        <View style={{flex:1, flexDirection:"column"}} >

            <View style={{flex:0.1 , paddingRight : 5}} >

              <View style={{flex:1, flexDirection : 'row'}} >

                    <View style={{flex:0.92}}>

                        <RiderForm style={{flexDirection:"row"}}
                          ref="form"
                          type={modelInfo}
                          options={optionInfo}
                          value={this.state.value}
                          onChange={this.onFormChange.bind(this)}
                        />

                    </View>

                    <View style={{paddingTop:32, paddingLeft: 2, flex: 0.08 }} >
                        <Button textStyle={{color:"white", fontSize:16}}
                            style={{paddingTop:0, width:80, height:35, backgroundColor:"#3fb1ee", borderWidth:0 }}
                            onPress={()=>this.saveRider()} isDisabled={false} >
                                      Ok
                        </Button>
                    </View>

              </View>

             </View>

            <ScrollView style={{ flex:0.2, backgroundColor: '#F6F6F6', paddingTop:20}}>
              <ListView style={{}}
                  dataSource={this.state.availableDataSource}
                  renderRow={ (data, sid, rid) => this.renderAvailableRow(data, sid, rid) }
                  renderHeader={()=> this.renderAvailableHeader()}
                />
            </ScrollView>

            <ScrollView style={{flex:0.2,backgroundColor: '#F6F6F6', paddingTop:20}}>
              <ListView style={{}}
                  dataSource={this.dsSelected}
                  renderRow={ (data, sid, rid) => this.renderSelectedRow(data, sid, rid) }
                  renderHeader={()=> this.renderSelectedHeader()}
                />
            </ScrollView>
            <View style={{flex:0.5}} />

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
