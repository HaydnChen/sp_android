'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  ListView,
  AlertIOS
} = React;

import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabsBar from "../../components/tabsBar";
import { getColl, getDb } from "../../db";
import cblite from "../../cblite";
import _ from "lodash";
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');
// var globals = require("../../globals");
import PeopleView from "./peopleView";
import ProductsView from "./productsView";
import MainView from "./mainView";
import RidersView from "./ridersView";
import FundsView from "./fundsView";
import InOutView from "./inOutView";
import SummaryView from "./summaryView";
import {LocalSelect,LocalDate,LocalSegmentedControls,LocalNumber} from "../../form/localComponents";

var dateFormats = ['D-M-YYYY','YYYY-M-D', 'YYYY-M-D HH:mm', 'YYYY-M-D HH:mm:ss',
                   'D-M-YY HH:mm:ss','D-M-YY HH:mm', 'YYYY-MM-DDTHH:mm:ss.SSSSZ']


const TAG = "QuoteView.";
export default class QuoteView extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
    this.mode = 'edit';
    this.stateListener = null;
    this.currentMain = undefined;
    this.uistate = require("../../state");

    // this.fns = Object.assign(
    //   {setDataSource:this.setDataSource.bind(this),goHome :this.goHome.bind(this)}, this.props.fns);
    // look at the fns passing a bit later on

    this.fns = {
      gotoTab : this.gotoTab.bind(this),
    }
    this.fns = Object.assign({}, this.fns, this.props.data.fns)
    return
  }

  loadQuotation(quote) {
    //   let coll = getColl("quotations"),
    //       row = coll.get(pk),
    // debugger;
    if (!this.uistate.get().quote.reloadQuote) return ; // exit if we have already loadded before
    // console.log("loadQuotation")
    let   row = quote,
          uistate = {
              refresh : true,
            //   tabno : 0,
              current_rider : {},
              current_fund : {},
              step : 0,
              offset : new Animated.Value(0),
              show_modal : false,
              show_signature : false,
              show_pdf : false,
              signatory : null,
              signatureOwner : row.signatureOwner,
              signatureAgent : row.signatureAgent,
              hash_owner : row.hash_owner,
              hash_agent : row.hash_agent,
              pdf_path : null,
              slidemenu : true,
              status : row.status,
              lastModified : row.lastModified,
              contact_id : row.contact_id,
              quote : row,
          };

    //   debugger;
      let main = row.policy.main,
          main0 = {
              plan_code: main.plan_code,
              plan_name : main.plan_name,
              proposal_date : moment(main.proposal_date,dateFormats).toDate(),
              contract_date : moment(main.contract_date, dateFormats).toDate(),
              la         : main.la,
              initial_sa : main.initial_sa,
              target_premium : main.target_premium,
              rtu : main.rtu
          },
          main1 = {
              premium_term : main.premium_term,
              payment_frequency : main.payment_frequency,
              payment_method : main.payment_method,
              coverage_term : main.coverage_term,
              premium : main.premium,
              money_id : main.money_id || 30
          }
      // have to fix some dates
      // need to get the product data and save it to quote.currentMain
      let gbl = window || global || root ,
          plans = gbl.api.availablePlans();

      let plan = _.find(plans, (p) => p.internal_id === main.internal_id);

      if (plan) {
          this.uistate.get().quote.set({current_main:plan}).now()
      }

      let pol = {
          people : {
              data : row.policy.people || []
          },
          main : {
              data0 : main0,
              data1 : main1
          },
          riders : {
              data : row.policy.riders || []
          },
          funds :  {
              data : row.policy.funds || []
          },
          inout : {
              data : row.policy.inout || []
          },
          loadings : {
              data : row.policy.loadings || []
          }
      };
      let current = this.uistate.get().quote.policy;
      uistate.policy = _.merge({}, current, pol);
      if (pol.funds.data.length === 0) {
          uistate.policy.funds.data=[]
      }
      if (pol.inout.data.length === 0) {
          uistate.policy.inout.data=[]
      }
      if (pol.loadings.data.length === 0) {
          uistate.policy.loadings.data=[]
      }



    //   uistate.policy = _.assign({}, current, pol);


    //   this.uistate.get().quote.set({refresh:false}).policy.main.set({ data0: main0, data1: main1 })
    //   this.uistate.get().quote.set({refresh:false}).policy.riders.set({data: row.policy.riders || []})
    //   this.uistate.get().quote.set({refresh:false}).policy.funds.set({data: row.policy.funds || [] })
    //   this.uistate.get().quote.set({refresh:false}).policy.inout.set({data: row.policy.inout || [] })
    //   this.uistate.get().quote.set({refresh:false}).policy.loadings.set({data:row.policy.loadings || [] })
    //   this.uistate.get().quote.set({refresh:false}).policy.people.set({data: row.policy.people || [] })
      this.uistate.get().quote.set(uistate).now() ;

  }
  createQuote(contact) {
      // start by pulling out the contact record
    //   debugger;
    //   console.log("**** createQuote", this.uistate.get().quote.tabno, this.uistate.get().quote.reloadQuote );
      if (!this.uistate.get().quote.reloadQuote) return ; // exit if we have already loadded before
      let uistate = {
              refresh : true, // impt
              tabno : 0 , // force it to start from beginning
              current_main : {},
              current_rider : {},
              current_fund : {},
              step : 0,
              offset : new Animated.Value(0),
              show_modal : false,
              show_signature : false,
              show_pdf : false,
              signatory : null,
              signatureOwner : null,
              signatureAgent : null,
              pdf_path : null,
              slidemenu : true,
              status : 'Pending',
              lastModified : null,
              contact : contact,
              quote : null,
              reloadQuote : false // we do not reload
      };
      // with contact only , we can only populate the people page
      let p1 = _.omit(contact, ['contacts','addresses','dependents','notes']),
          p2 = {}, p3 = {};
      p1.rel2Ph = 'Self';
      if (contact.dependents && contact.dependents.length > 0 ) {
          // take the 1st 2 dependents across
          p2 = Object.assign({}, contact.dependents[0]);
          p2.rel2Ph = p2.relation;
          if (contact.dependents.length > 1) {
              p3 = Object.assign({}, contact.dependents[1]);
              p3.rel2Ph = p3.relation;
          }
      }

      let current = this.uistate.get().quote.policy;
      uistate.policy = _.assign({}, current);
      this.uistate.get().quote.set(uistate).policy.people.set({data: [p1,p2,p3]}).now();
  }

  getInitState(){
    return {
        offset : new Animated.Value(0) , // start with zero, i.e. we do not animate, leave it to navigator animation
    };
  }
  defineListener(){
      if (this.stateListener) {
          this.stateListener.off()
      }
      this.stateListener = this.uistate.get().quote.getListener(); // listen only on s1
      let fn = (data) => {
          if (data.refresh) {
              this.forceUpdate();
          }
      }
      this.stateListener.on('update', _.debounce(fn , 100) );
    //   this.stateListener.on("update",fn);

  }

  componentDidMount(){
      this.defineListener()
    // var self = this;
    // let qstate = this.uistate.get().quote;
    // // console.log("QuoteView.componentDidMount, uistate", this.uistate);
    // this.stateListener = qstate.getListener();
    // let fn = (data) => {
    //     console.log("forceupdate", data.refresh);
    //     if ('refresh' in data && data.refresh) {
    //         self.forceUpdate()
    //     }
    // };
    // this.stateListener.on('update', _.debounce(fn , 100) );
    //
    // // did we get the parseInt
    // console.log("QuoteView,fns.parent", this.props.data.fns.parent);

  }
  componentWillUnmount() {
      this.stateListener.off('update'); // clean up

  }
  componentDidUpdate(lastProps, lastState) {
      Animated.timing(this.state.offset, {
        duration: 500,
        toValue: 0
      }).start();

  }

  prepData() {
      let qstate = this.uistate.get().quote;
      if (qstate.quote) {
          this.loadQuotation(qstate.quote)
      } else if (qstate.contact) {
          this.createQuote(qstate.contact)
      } else {
          let uistate = {
              refresh : true,
              current_main : {},
              current_rider : {},
              current_fund : {},
              step : 0,
              offset : new Animated.Value(0),
              show_modal : false,
              show_signature : false,
              show_pdf : false,
              signatory : null,
              signatureOwner : null,
              signatureAgent : null,
              pdf_path : null,
              slidemenu : true,
              status : 'Pending',
              lastModified : null,
              contact : null,
              quote : null,
          };
          let pol = {
              people  :   { data : [{},{},{}] },
              main    :   { data0 : {}, data1 : {} },
              riders  :   { data : [] },
              funds   :   { data : [] },
              inout   :   { data : [] },
              loadings :  { data : [] }
          },
          current = this.uistate.get().quote.policy;
          uistate.policy = _.merge({}, current, pol);
          uistate.policy.people = pol.people;          
          this.uistate.get().quote.set(uistate).now();
      }
  }

  componentWillReceiveProps(props) {
      let reload = this.uistate.get().quote.reloadQuote;
    //   console.log(TAG+"componentWillReceiveProps", reload)
      this.defineListener()
      if (reload) {
          this.prepData()
      } else {
          this.uistate.get().quote.set({reload:true, refresh:true}); //reset
        //   this.uistate.get().quote.set({refresh:false}); //reset
      }
  }
  componentWillMount(){
      let reload = this.uistate.get().quote.reloadQuote;
    //   console.log(TAG+"componentWillMount", reload)
      if (typeof reload !== 'undefined' && reload) {
          this.prepData()
      } else {
          this.uistate.get().quote.set({reload:true, refresh:true}); //reset
      }
  }

  tabPressed(tabno, text){
    // console.log("tabbar , selected :", tabno, text);
    // good time to check on whether data is ok, before allowing it to go to next page

    let qstate = this.uistate.get().quote,
        currentTabno = qstate.tabno,
        main  = qstate.current_main;

    if (currentTabno === 0 && tabno !== 0) {
        // navigating away from people tab, check that people info has been entered
        // how to get hold of information ??
        let curdata = this.uistate.get().quote.policy.people.data;
        let p0 = Object.assign({}, curdata[0],this.refs.people.refs.p0.refs.form0.getValue() ),
            p1 = Object.assign({}, curdata[1],this.refs.people.refs.p1.refs.form1.getValue() ),
            p2 = Object.assign({}, curdata[2],this.refs.people.refs.p2.refs.form2.getValue() );

        if ( !p0 && !p1 && !p2) {
            AlertIOS.alert(
              'Errors',
              'Please enter details for at least one person...',
              [
                {text:'OK', style:"default" ,onPress : (txt) => console.log(txt)}
              ]
            );
            _.forEach([0,1,2], (fno) => {
                _.forEach( this.refs.people.refs['p'+fno].refs['form'+fno].refs.input.refs, (c) => {
                    c.removeErrors()
                });
            });
            return false;
        } else {
            // save the people info into the global state
            this.uistate.get().quote.policy.people.set({data: [ p0 || {} , p1 || {}  , p2 || {} ]}).now();
            _.forEach([0,1,2], (fno) => {
                _.forEach( this.refs.people.refs['p'+fno].refs['form'+fno].refs.input.refs, (c) => {
                    c.removeErrors()
                });
            });
        }

    }

    // if going to tab 2 (main), must have selected the current_main
    if (tabno === 2 && !this.uistate.get().quote.current_main.internal_id) {
        AlertIOS.alert(
          'Errors',
          'Please select the main product before moving to the main tab...',
          [
            {text:'OK', style:"default" ,onPress : (txt) => console.log(txt)}
          ]
        );
        return false;

    }

    if (currentTabno === 2 && tabno !== 2) { // leaving plan/main tab
        let data0 = this.refs.main.refs.form0.getValue();
        let data1 = this.refs.main.refs.form1.getValue();
        // debugger;
        if ( !data0 || !data1) {
            AlertIOS.alert(
              'Errors',
              'Please fix errors before leaving plan information page...',
              [
                {text:'OK', style:"default" ,onPress : (txt) => console.log(txt)}
              ]
            );
            return false;

        } else {
            // let maindata = Object.assign({}, data0, data1),
            // hook into product engine to do some validations, prepare the input

            let plan = Object.assign({product_id:main.product_id, internal_id: main.internal_id}, data0, data1 );
            let inputjson = this.prepareInput(plan);
            let gbl = window || global || root ;
            let result = gbl.api.validate(inputjson,['validate_main']);
            let msg = '';
            //console.log("result", result);
            let errorList = result.validate_main;
            if (errorList && errorList.length > 0 ){
                msg = errorList.join(' .');
                this.alert(msg);
                return false;


            } else {
                this.uistate.get().quote.policy.main.set({
                    data0: data0,
                    data1: data1
                }).now();
            }



            // console.log("leaving tab 2 ", JSON.stringify(this.uistate.get().quote.policy.main.data0),
            //    JSON.stringify(this.uistate.get().quote.policy.main.data1) )
        }


    }
    // if (currentTabno === 4 && tabno !== 4) { // leaving plan/main tab
    //     console.log("leaving tab 4 ", JSON.stringify(this.uistate.get().quote.policy.main.data0),
    //        JSON.stringify(this.uistate.get().quote.policy.main.data1) )
    //
    // }

    // check for ilp stuff

    if (main.benefit_type === '41') {
        if (currentTabno === 4) { // leaving the funds view
            let funds = this.uistate.get().quote.policy.funds.data.toJS(),
                tot = _.sum ( _.map(funds, (f) => f.percentage ));

            if (tot > 0 && tot !== 100) {

                AlertIOS.alert(
                  'Errors',
                  'The allocation percentages must add up to 100...',
                  [
                    {text:'OK', style:"default" ,onPress : (txt) => console.log(txt)}
                  ]
                );
                return false;

            }
        }
    }

    // if (tabno === 1) { return false } // example of a way to prevent it from navigating to the tab
    // change the state and it will re-render, change something in the uistate.get().quote, e.g. selectedView
    let newstate;

    newstate = this.uistate.get().quote.set({tabno:tabno}).now();
    setTimeout(()=>{
        this.setState({offset: new Animated.Value(deviceHeight)});
    },0);

    return

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

  changeTab(param) {
    let tab = param.i;
    // console.log("quoteView.changeTab ---> tab :", tab);
    // set the opacity in the tabsbar
    this.tabsbar.setOpacity(tab);
  }

  gotoTab(tabno, param ) {
    // console.log("gotoTab, param", param);
    let newstate, currentTab, currentMain;

    // if (tabno === 2 && ! param ) { return } // do nothing if selected plan is not passed in if going to tab 2

    currentTab = this.uistate.get().quote.tabno;
    currentMain = this.uistate.get().quote.current_main;

    if (currentTab === 1 && tabno === 2 && param ) {

        this.currentMain = param ;
        if (param.internal_id === currentMain.internal_id) {
            newstate = this.uistate.get().quote.set({tabno:tabno, current_main : this.currentMain}).now();
        } else {
            // change in main plan, reset a few things
            this.uistate.get().quote.set({tabno:tabno, current_main : this.currentMain}).now();
            this.uistate.get().quote.policy.main.set({data0 : {}, data1:{}}).now();
            this.uistate.get().quote.policy.riders.set({data:[]}).now();
            this.uistate.get().quote.policy.funds.set({data:[]}).now();
            this.uistate.get().quote.policy.inout.set({data:[]}).now();

        }

    } else {
        newstate = this.uistate.get().quote.set({tabno:tabno}).now();
    }
    this.tabsbar.gotoTab(tabno);
  }

  prepareInput( inputPlan=null) {
      let quote = this.uistate.get().quote,
          main = quote.current_main,
          policy = quote.policy.toJS(),
          people = policy.people.data,
          plan = inputPlan ? inputPlan :
                Object.assign({product_id:main.product_id, internal_id: main.internal_id},
                    this.uistate.get().quote.policy.main.data0,
                    this.uistate.get().quote.policy.main.data1
                ),
          riders = policy.riders.data || [],
          funds  = policy.funds.data || [],
          inout  = policy.inout.data || [] ,
          gbl = window || global || root,
        //   config  = gbl.api.getSIConfig( parseInt(main.product_id)),
          topups, withdrawals,result, svFields;

      topups = _.filter(inout, (row) => row.in > 0).map((row) => { return {year: row.year, amount: row.in } });
      withdrawals = _.filter(inout, (row) => row.out > 0).map((row) => { return {year: row.year, amount: row.out } });
      // fix some discrepancy in type of sa
      if (main.benefit_type === '41') {
          plan.basic_sa = plan.initial_sa;
      }
      ['proposal_date','contract_date'].forEach((f)=> policy[f] = moment(plan[f])); // convert back to moment object, workaround
      ['la','premium_term'].forEach((f)=> plan[f] = parseInt(plan[f])); // convert back to integer, workaround

      let peoplelist = _.map(people, (person) => {
          let row = {}
          _.forOwn(person,(v,k,obj) => {
              row[k] = k === 'dob' ? moment(v).format('YYYY-M-D') : v ;
          });
          return row;
      }) ;
      // we only want these few fields, other fields can cause the calculation to assume it is already calculated and thus not recalc
      let doc;
      let riderlist = _.map(riders, (rider) => {
           doc = {
               product_id: rider.product_id,
               internal_id: rider.product_code,
               initial_sa : rider.initial_sa,
               la : parseInt(rider.la)
           }
           if (rider.cover_term && _.isNumber(rider.cover_term)) doc.cover_term = rider.cover_term;
           if (rider.benfitLevel) doc.benefitLevel = rider.benefitLevel;
           return doc;
      });

      // we need the seq of the plan to be ordered to guarantee equality
      let sortedKeys = _.sortBy( _.keys(plan)),
          newPlan = {};
      _.forEach(sortedKeys, (k) => newPlan[k] = plan[k]);

      let  inputjson = {
              policy :
                { people : peoplelist,
                  products : [newPlan, ...riderlist] ,
                  funds : funds,
                  topups : topups,
                  withdrawals : withdrawals,
                  prem_freq : plan.payment_frequency ,
                  proposal_start_date : moment(plan.contract_date).format("D-M-YYYY"),
                  proposal_date : moment(plan.proposal_date).format("D-M-YYYY")
                }
       };

       return inputjson

  }

  render() {
      let qstate = this.uistate.get().quote,
          peopleView = null,
          productsView = null,
          mainView = null,
          ridersView = null,
          fundsView = null,
          insOutsView = null,
          summaryView = null,
          currentMain = this.uistate.get().quote.current_main ;

      let ilpfund , ilpinout ;

      const { viewname, tabno, current_main } = qstate;
      // decide on which view render based on tabno
      if (tabno === 0) {
          peopleView = <PeopleView ref="people" fns={this.fns} />
      } else if (tabno === 1) {
          productsView = <ProductsView ref="products" fns={this.fns} />
      } else if (tabno === 2) {
          mainView = <MainView ref="main" fns={this.fns} plan={current_main} />
      } else if (tabno === 3) {
          ridersView = <RidersView ref="riders" fns={this.fns} plan={current_main} />
      }

      if ( currentMain.internal_id && currentMain.benefit_type === '41' ) {
          // might need to redo , as tabno changes depending if ilp or otherwise, need a flag or check number of tabs
            if ( tabno === 4) {
                ilpfund =
                  <ScrollView tabLabel="Funds|usd" style={styles.tabView}>
                    <View style={styles.card}>
                      <FundsView ref="funds" fns={this.fns} />
                    </View>
                  </ScrollView>;
            } else {
                ilpfund =
                  <ScrollView tabLabel="Funds|usd" style={styles.tabView}>
                    <View style={styles.card}>
                    </View>
                  </ScrollView>;
            };


            if (tabno === 5 ) {
                ilpinout =
                  <ScrollView tabLabel="In & Out|arrows" style={styles.tabView}>
                    <View style={styles.card}>
                      <InOutView ref="inout" fns={this.fns} />
                    </View>
                  </ScrollView>;
            } else {
                ilpinout =
                  <ScrollView tabLabel="In & Out|arrows" style={styles.tabView}>
                    <View style={styles.card}>
                    </View>
                  </ScrollView>;
            };

            if (tabno === 6 ) {
                summaryView = <SummaryView ref="summary" fns={this.fns} />;
            }


      } else {
          if (tabno === 4) {
              summaryView = <SummaryView ref="summary" fns={this.fns} />;
          }
      }

    //   console.log("QuoteView.render, state changed --> tabno", tabno, currentMain.internal_id );


     if (currentMain.internal_id && currentMain.benefit_type === '41') {
      return (
        <Animated.View style={[styles.container, { transform: [{translateY : this.state.offset }] }]} >

          <ScrollableTabView ref="tabsview" onChangeTab={this.changeTab.bind(this)} tabno={tabno} initialPage={tabno}
              locked={true}
              renderTabBar={(props) => <TabsBar  ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
           >

          <View tabLabel="People|users" style={styles.tabView}>
            <View  style={styles.card}>
              {peopleView}
            </View>
          </View>

          <ScrollView tabLabel="Products|umbrella" style={styles.tabView}>
            <View style={styles.card}>
              {productsView}
            </View>
          </ScrollView>

          <ScrollView tabLabel="Main|shield" style={styles.tabView}>
            <View style={styles.card}>
                {mainView}
            </View>
          </ScrollView>

            <ScrollView tabLabel="Riders|list-ul" style={styles.tabView}>
              <View style={styles.card}>
                {ridersView}
              </View>
            </ScrollView>

            {ilpfund}

            {ilpinout}

            <ScrollView tabLabel="Summary|thumbs-up" style={styles.tabView}>
              <View style={styles.card}>
                {summaryView}
              </View>
            </ScrollView>

          </ScrollableTabView>

        </Animated.View>
      )
  } else {

      return (
        <Animated.View style={[styles.container, { transform: [{translateY : this.state.offset }] }]} >

          <ScrollableTabView ref="tabsview" onChangeTab={this.changeTab.bind(this)} tabno={tabno} initialPage={tabno}
              locked={true}
              renderTabBar={(props) => <TabsBar  ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
           >

          <View tabLabel="People|users" style={styles.tabView}>
            <View  style={styles.card}>
              {peopleView}
            </View>
          </View>

          <ScrollView tabLabel="Products|umbrella" style={styles.tabView}>
            <View style={styles.card}>
              {productsView}
            </View>
          </ScrollView>

          <ScrollView tabLabel="Main|shield" style={styles.tabView}>
            <View style={styles.card}>
                {mainView}
            </View>
          </ScrollView>

            <ScrollView tabLabel="Riders|list-ul" style={styles.tabView}>
              <View style={styles.card}>
                {ridersView}
              </View>
            </ScrollView>

            <ScrollView tabLabel="Summary|thumbs-up" style={styles.tabView}>
              <View style={styles.card}>
                {summaryView}
              </View>
            </ScrollView>

          </ScrollableTabView>

        </Animated.View>
      )

  }
    }
}


var styles = StyleSheet.create({
 outerContainer: {
     flex: 1,
     flexDirection: "row"
 },
 container: {
    flex: 0.8,
    marginTop: 10,
  },
  tabView: {
    width: deviceWidth,
    padding: 2,
    margin: 2,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 0,
    height: deviceHeight,
    padding: 0,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
