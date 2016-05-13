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
  AlertIOS,
  ScrollView
} = React;

import _ from "lodash";
import Button from 'apsl-react-native-button';
import {LocalSelect,LocalDate,LocalSegmentedControls,LocalNumber} from "../../form/localComponents";
var Icon = require('react-native-vector-icons/FontAwesome'),
    moment = require('moment'),
    t = require('tcomb-form-native'),
    localstyles = require("../../localStyles");

var formstyles = _.clone(localstyles,true);
formstyles.formGroup.normal.flexDirection = 'column';
formstyles.formGroup.error.flexDirection = 'column';
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var MainForm = t.form.Form;

var modelFactory = (mainplan,uistate) => {
    let Globals = window || global || root,
        api = Globals.api,
        prem_terms = api.getPremiumTerms(mainplan.product_id),
        pay_freqs = api.getPaymentFrequencies(mainplan.product_id),
        currencies = api.availableCurrencies(mainplan.product_id),
        qstate = uistate.get().quote,
        model1, model2;

    let ccymapp = {}
    let ccy = _.forEach(currencies, (ccy ) => {
        let k = parseInt(ccy.money_id) , v = ccy.money_name;
            ccymapp[k] = v;
    })

    // console.log("MainView.modelFactory---> ccy", ccy);

    var peopleFn = () => {
          let people =  _.object( _.map(qstate.policy.people.data, (person,idx) => [ String(idx) , person.name])
                            .filter((p) => p[1]) ); // only if the name is defined
          return people;
        };

    var Positive = t.refinement(t.Number, function (n) {
      return n > 0;
    });

    model1 = {
      // product_code : t.maybe(t.String),
      // product_name : t.maybe(t.String),
      la            : t.enums( peopleFn() ),
      initial_sa : t.Number,
      target_premium : t.Number,
      rtu : t.Number,
      proposal_date : t.Date,
      contract_date : t.Date,
    };
    // if (pay_freqs.length === 1 && pay_freqs[0][0] === '5') {
    //     // single premium, we do not need to ask for rtu
    // } else {
    //     model1.rtu = t.Number
    // }

    model2 = {
      premium_term : ( () => {
          if (mainplan.benefit_type === '41') {
            if ( pay_freqs.length === 1 && pay_freqs[0][0] === '5') {
                return t.maybe(t.Number);
            } else {
                return Positive;
            }
          } else {
            let mapp = _.object( _.map(prem_terms, (term) => [ String(term) ,String(term)]) );
            if ( pay_freqs.length === 1 && pay_freqs[0][0] === '5') {
                return t.maybe(t.enums(mapp));
            } else {
                return t.enums(mapp);
            }
          }
      })(),
      payment_frequency : (() => t.enums( _.object(pay_freqs)))() ,
      money_id : t.maybe(t.enums(ccymapp)),
      payment_method : t.enums({
        1 : 'Cash',
        2 : 'Cheque',
        3 : 'Direct Debit'
      }),
      coverage_term : t.Number,
      premium : t.Number,
    };
    // if ( pay_freqs.length === 1 && pay_freqs[0][0] === '5') {
    //
    // } else {
    //     model2.premium_term =  ( () => {
    //         if (mainplan.benefit_type === '41') {
    //           return t.maybe(t.Number);
    //         } else {
    //           let mapp = _.object( _.map(prem_terms, (term) => [ String(term) ,String(term)]) );
    //           return t.maybe(t.enums(mapp));
    //         }
    //     })();
    // }
    // console.log("model2 --------->", model2);
    return [t.struct(model1), t.struct(model2)];

}
var optionsFactory = (mainplan,uistate, self) => {
    let Globals = window || global || root,
        api = Globals.api,
        pay_freqs = api.getPaymentFrequencies(mainplan.product_id),
        currencies = api.availableCurrencies(mainplan.product_id),
        qstate = uistate.get().quote,
        opts1, opts2,
        hidden = () => <View />;


    opts1 = {
      fields : {
        proposal_date : {
          factory : LocalDate,
        },
        contract_date : {
          factory : LocalDate,
        },
        la : {
          factory : LocalSelect,
          label   : 'Life assured'
        },
        initial_sa : {
            factory : LocalNumber,
            label : 'Sum assured',
            onFocus:()=> focus(self,'initial_sa')
            // onBlur : (e) => { self.onBlurHandling() }
        },
        target_premium : {
            factory : LocalNumber,
            onFocus:()=> focus(self,'target_premium'),
            label : 'Premium'
            // onBlur : (e) => { self.onBlurHandling() }
        },
        rtu : {
            factory : LocalNumber,
            label : 'Regular topup',
            onFocus:()=> focus(self,'rtu')
            // onBlur : (e) => { self.onBlurHandling() }
        }

      }
    };
    if (mainplan.benefit_type !== '41') {
      opts1.fields.target_premium.template = hidden;
      opts1.fields.rtu.template = hidden;
    }
    if (pay_freqs.length === 1 && pay_freqs[0][0] === '5') {
        opts1.fields.rtu.template = hidden;

    }

    opts2 = {
      fields : {
        payment_method : {
          factory : LocalSelect,
        },
        payment_frequency : {
          factory : LocalSelect,
          label : 'Payment freq.',
          nulloption : false
        },
        premium : {
          editable : false,
          factory : LocalNumber
        },
        coverage_term : {
          editable : false,
        },
        money_id: {
            label : 'Currency',
            factory : LocalSelect,
            nulloption: false
        }

      }
    };
    if (mainplan.benefit_type !== '41') {
      opts2.fields.premium_term = {
          factory : LocalSelect,
          label : 'Premium term',
      }
    } else {
      opts2.fields.premium_term = {
          factory : LocalNumber,
          label : 'Premium term',
      }

    }
    if (pay_freqs.length === 1 && pay_freqs[0][0] === '5') {
        opts2.fields.premium_term.template = hidden;
    }
    if ( currencies.length === 0 ) {
        opts2.fields.money_id.template = hidden;
        opts2.fields.money_id.label = '';
    }

    return [opts1, opts2];
}

function focus(self, refName, scrollViewRefName='container', offset=150, ){
    setTimeout(()=>{
      let handle =   React.findNodeHandle(self.refs.form0.refs.input.refs[refName]);
      let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(handle), offset, true );
    }, 150);
}

export default class MainView extends React.Component {
  constructor(props){
    super(props);
    this.state = this.getInitState(props);
    this.form0 = null;
    this.form1 = null;
    this.uistate = require("../../state");
    this.calcUL = _.debounce(this.calculateUnitLink.bind(this), 300);
    this.calcTrad = _.debounce(this.calculateTraditional.bind(this), 300);
    this.form0Change = _.debounce(this.onForm0Change.bind(this), 300);
    this.form1Change = _.debounce(this.onForm1Change.bind(this), 300);
  }

  getInitState(props) {
    return {
        mainFreqs : []
    };
  }
  onBlurHandling() {
      let main = this.uistate.get().quote.current_main;
      if (main.benefit_type === '41') {
          this.calculateUnitLink()
      } else {
          this.calculateTraditional()
      }
  }
  onForm0Change(raw, path){

    let result = this.refs.form0.validate();
    // console.log("mainView.onformchange -- errs", errs, JSON.stringify(raw));
    if (result.isValid() && ['la','initial_sa','target_premium','rtu'].indexOf(path[0]) >= 0 ){
        let main = this.uistate.get().quote.current_main;
        if (main.benefit_type === '41') {
            // this.calculateUnitLink()
            this.calcUL(); // use a debounce version of the function
        } else {
            // this.calculateTraditional();
            this.calcTrad(); // use a debounce version of the function
        }
    }
  }
  onForm1Change(raw, path){

    let result = this.refs.form1.validate();
    if (result && ['premium_term', 'payment_frequency', 'payment_method'].indexOf(path[0] >= 0 )){
        let main = this.uistate.get().quote.current_main;
        if (main.benefit_type === '41') {
            // this.calculateUnitLink()
            this.calcUL();
        } else {
            // this.calculateTraditional()
            this.calcTrad()
        }
    }

  }
  componentWillMount() {
      let main = this.uistate.get().quote.current_main;
      let gbl = window || global || root;
      let freqs = gbl.api.getPaymentFrequencies(main.product_id);
      if (freqs.length > 0) {
          this.setState({mainFreqs: freqs})
      }

      let currencies = gbl.api.availableCurrencies(main.product_id);
      if (currencies.length > 0 ) {
          this.uistate.get().quote.set({refresh:false});
          this.uistate.get().quote.policy.main.defaults.data1.set({money_id:30}).now()
      } else {
          this.uistate.get().quote.set({refresh:false});
          this.uistate.get().quote.policy.main.defaults.data1.remove('money_id');
      }
      this.uistate.get().quote.set({refresh:true}).now()

  }

  calculateTraditional() {
      let data0 = this.refs.form0.getValue(),
          data1 = this.refs.form1.getValue();

      if (!data0 || !data1) { return } // data is not complete, so just return

      let main = this.uistate.get().quote.current_main,
          gbl = window || global || root,
          qstate = this.uistate.get().quote,
          people = _.filter(qstate.policy.people.data, (p) => p.name ),
          plan = Object.assign({product_id: main.product_id, internal_id: main.internal_id}, data0, data1),
          inputjson, availableRiders, idsAvailable, result, request;

      ['la','premium_term'].forEach((f)=> plan[f] = parseInt(plan[f])); // convert back to integer, workaround

      inputjson = { policy : { people : people, products : [ plan ] , 'prem_freq' : data1.payment_frequency } }; // ::TODO::
      request = main.benefit_type === '41' ? ["monthly_coi", "cover_term"]
                                           : ["prem", "ap", "cover_term"];
      result = gbl.api.calc(inputjson, request);
      let d0 = _.clone(data0,true),
          d1 = _.clone(data1,true);


      d1.premium = result.policy.products[0].prem;
      d1.coverage_term = result.policy.products[0].cover_term;
      this.uistate.get().quote.policy.main.set( { data0: d0, data1 : d1 } ).now();
    //   this.uistate.get().quote.policy.main.set( { data1 : d1 }.now();

  }
  calculateUnitLink() {
      let data0 = this.refs.form0.getValue(),
          data1 = this.refs.form1.getValue();

      if (!data0 || !data1) { return } // data is not complete, so just return
      let d0 = _.clone(data0,true),
          d1 = _.clone(data1, true),
          main = this.uistate.get().quote.current_main,
          gbl = window || global || root,
          qstate = this.uistate.get().quote,
          people = _.filter(qstate.policy.people.data, (p) => p.name ),
          plan = Object.assign({product_id: main.product_id, internal_id: main.internal_id}, d0, d1),
          inputjson,result, request;

          ['la','premium_term'].forEach((f)=> plan[f] = parseInt(plan[f])); // convert back to integer, workaround

          inputjson = { policy : { people : people, products : [ plan ] , 'prem_freq' : '1' } }; // ::TODO::
          request = ["cover_term"]
          result = gbl.api.calc(inputjson, request);
          this.uistate.get().quote.policy.main.set({data0: d0}).now();
          d1.premium = d0.target_premium + d0.rtu; // simple calc, so just do it here instead of engine
          d1.coverage_term = result.policy.products[0].cover_term;
        //   this.uistate.get().quote.set({refresh:true}).now()
          this.uistate.get().quote.policy.main.set({data1: d1}).now();


  }

  render(){
    // assume default values is passed in via props
    // note we break into 2 forms instead of 1 form , since we have 2 vertical blocks
    MainForm.stylesheet = formstyles;
    const { plan } = this.props;

    let models = modelFactory(plan,this.uistate),
        mainState = this.uistate.get().quote.policy.main;


    let opts = optionsFactory(plan, this.uistate, this),
        data0 = _.isEmpty(mainState.data0) ? _.extend({},mainState.defaults.data0) : mainState.data0 ,
        data1 = _.isEmpty(mainState.data1) ? _.extend({},mainState.defaults.data1) : mainState.data1 ;
    // console.log("render --> defaults", mainState.defaults.data1);
    // if (currencies.length > 0 && !data1.money_id) {
    //     data1.money_id = 30
    // }
        // console.log("value of data0", JSON.stringify(data0));
        // debugger;
    return (
       <ScrollView ref="container">
      <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
          <View  style={styles.container}>
              <Text style={styles.text}>{plan.product_name + " (" + plan.internal_id + ")" }</Text>
              <View style={{paddingBottom: 1}}>
                      <MainForm style={{flexDirection:"column", flex: 1}}
                        ref={"form0"}
                        type={models[0]}
                        options={opts[0]}
                        value={ data0 }
                        onChange={(raw, path)=> this.form0Change(raw,path)}
                      />
              </View>
          </View>

          <View style={[styles.container,{paddingTop:20}]}>
              <Text style={styles.text}></Text>
              <View style={{paddingBottom: 1}}>
                      <MainForm style={{flexDirection:"column", flex: 1}}
                        ref={"form1"}
                        type={models[1]}
                        options={opts[1]}
                        value={data1}
                        onChange={(raw, path)=> this.form1Change(raw,path)}
                      />
              </View>
          </View>

      </View>
      </ScrollView>

    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop : 10,
    borderColor : 'gray',
    borderWidth : 0
  },
  text: {
    fontSize : 20,
    color : 'grey',
    paddingBottom : 10
  }
});
