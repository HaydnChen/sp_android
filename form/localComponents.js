'use strict';

var React = require('react-native');
var {
  // NativeModules: {
  //     UIManager,
  // },
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  ListView,
  TextInput,
  SwitchIOS,
  Modal,
} = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var isLeap = (yr) => { return !((yr % 4) || (!(yr % 100) && (yr % 400))); }

import {Select,Option,OptionList,updatePosition} from '../components/dropdown';
import moment from 'moment';
import {SegmentedControls} from 'react-native-radio-buttons';
import _ from "lodash";
import Picker from 'react-native-picker';

const Overlay = require('react-native-animatable-overlay');

var t = require('tcomb-form-native'),
    numeral = require('numeral');

var { getTypeInfo } = require('tcomb-form-native/lib/util');

var Textbox = t.form.Textbox,
    FormSelect = t.form.Select,
    Checkbox = t.form.Checkbox;

export class LocalSegmentedControls extends FormSelect {
    constructor(props){
      super(props);
      let selected = this.getOptions().filter((opt)=> opt.value !== '');
      this.selectName = this.getLocals().path[0];
      // console.log("LocalSegmentedControls.constructor ----------> ", props);
      let initvalue =  this.getTransformer().format(props.value);
      this.state = {
        value:initvalue,
        selectedOption : initvalue
      };
      this.optionsMap = {};
      selected.forEach((opt)=> {this.optionsMap[opt.text] = opt.value} );
    }
    getValue() {
      let res = this.getTransformer().parse(this.state.value);
      // console.log("LocalSegmentedControls.getValue called........", this.state.value, res);
      return res;
    }

    getTransformer(){
      // return an object with 2 functions
      let opts = this.getOptions().filter((opt)=> opt.value !== null);
      return {
        format: (value) => {
          // console.log('LocalSegmentedControls.format-->value',value, Object.prototype.toString.call(value));
          if (t.Nil.is(value)) { return ''}
          let opt = opts.filter((o)=> o.value === value);
          let res = opt.length > 0 ? opt[0].text : '';
          // console.log('LocalSegmentedControls.format-->value',value, res, Object.prototype.toString.call(value));
          return res;
        },
        parse: (value) => {
          let opt = opts.filter((o)=> o.text === value);
          let res = opt.length > 0 ? opt[0].value : value;
          // console.log('LocalSegmentedControls.parse-->value',value, res, Object.prototype.toString.call(value));
          return res;
        }

      }
    }

    onSelected(item){
      let choices = this.getOptions().filter((opt) => opt.value !== '');
      let sel = choices.filter( (opt) => opt.text === item );
      let val = sel.length === 0 ? null : sel[0].text;
    //   console.log("onSelected item=", item);
      this.setState({value:val, selectedOption: val});
      this.getLocals().onChange(this.optionsMap[val]);
    }
    getTemplate() {
      var self = this;
      if (this.props.options.template) return this.props.options.template;

      return function(locals) {
        // console.log("LocalSegmentedControls.getTemplate....")
        var stylesheet = locals.stylesheet;
        var formGroupStyle = stylesheet.formGroup.normal;
        var controlLabelStyle = stylesheet.controlLabel.normal;
        var textboxStyle = stylesheet.textbox.normal;
        var helpBlockStyle = stylesheet.helpBlock.normal;
        var errorBlockStyle = stylesheet.errorBlock;

        if (locals.hasError) {
          formGroupStyle = stylesheet.formGroup.error;
          controlLabelStyle = stylesheet.controlLabel.error;
          textboxStyle = stylesheet.textbox.error;
          helpBlockStyle = stylesheet.helpBlock.error;
        }
        var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
        var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
        var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;
        var width = self.props.options.width ? self.props.options.width : 250;
        var height = self.props.options.height ? self.props.options.height : 30;
        var prefix = locals.path[0] ? locals.path[0] : '';
        var options = self.getOptions().filter((item)=> item.value !== '').map((opt)=> opt.text);
        return (
          <View style={formGroupStyle}>
            {label}
            <View style={{height:height, width:width , borderRadius:10}}>
              <SegmentedControls
                ref="input"
                containerBorderTint={'lightgray'}
                options={options}
                onSelection={self.onSelected.bind(self)}
                // selectedOption={self.state.selectedOption}
                selectedOption={locals.value}
              />
           </View>
         </View>
        );
      }
    }
}

var dateTransformer = {
    format: (value) => {
    //   console.log('dateTransformer.format-->value',value, Object.prototype.toString.call(value), Object.prototype.toString.call(value) === '[object Date]');
      return t.Nil.is(value) ? '' : Object.prototype.toString.call(value) === '[object Date]' ? moment(value).format('D-M-YYYY') : String(value);
    },
    parse: (value) => {
    //   console.log("LocalDateParse.parse", Object.prototype.toString.call(value))
      // console.log('dateTransformer.parse-->value',value, Object.prototype.toString.call(value));
      if (value.trim().length === 0) {
        return null;
    }
      let mom = moment(value,['D-M-YYYY','YYYY-M-D'],true);
      return mom.isValid() ? mom.toDate() : value;
    }
};

export class LocalDate extends Textbox {

  constructor(props){
    super(props);
    let val = props.value;
    if ( _.isString(val) ) {
        val = moment(val , [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate();
    }

     this.state = {
        hasError: false,
        value: this.getTransformer().format(val)
     };

    //this.state = {value:''}
  }

  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    let val = props.value;
    if ( _.isString(val) ) {
        val = moment(val , [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D'], true)
        val = val.isValid() ? val.toDate() : props.value
    }
    this.setState({value: this.getTransformer().format(val)});
  }

  // validate() {
  //   console.log("getValue from localDate", this.getValue());
  //   return super.validate()
  //   //
  //   // var result = t.validate(this.getValue(), this.props.type, this.getValidationOptions());
  //   //
  //   // this.setState({hasError: !result.isValid()});
  //   // return result;
  // }
  // getValue() {
  //   let val = this.state.value;
  //   if ( _.isString(val) ) {
  //       val = moment(val , [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate();
  //   }
  //   // return this.getTransformer().parse(this.state.value);
  //   return this.getTransformer().parse(val);
  // }


  getTransformer() {
    return dateTransformer;
  }

  onChangeText(value){
    if (value.trim().length > 0) {
      let values = value.split('-');
      // let [dd, mm, yy] = [0,0,0];
      let dd,mm,yy;
      dd = parseInt(values[0]);
      if (values.length > 1) {
        mm = parseInt(values[1]);
      }
      if (values.length > 2) {
        yy = parseInt(values[2]);
      }
      //this.setState({value:value});
      this.getLocals().onChange(value);

    }
  }
  getTemplate() {
    var self = this;
    if (this.props.options.template) return this.props.options.template;

    return function(locals) {

      var stylesheet = locals.stylesheet;
      var formGroupStyle = stylesheet.formGroup.normal;
      var controlLabelStyle = stylesheet.controlLabel.normal;
      var textboxStyle = stylesheet.textbox.normal;
      var helpBlockStyle = stylesheet.helpBlock.normal;
      var errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        textboxStyle = stylesheet.textbox.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

      if (locals.editable === false) {
        textboxStyle = stylesheet.textbox.notEditable;
      }

      var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

      var mystyle = Object.assign( {}, textboxStyle, self.props.options.style || {width:120});

      return (
        <View style={formGroupStyle}>
          {label}
          <TextInput
            ref="input"
            autoCapitalize={locals.autoCapitalize}
            autoCorrect={locals.autoCorrect}
            autoFocus={locals.autoFocus}
            bufferDelay={locals.bufferDelay}
            clearButtonMode={locals.clearButtonMode}
            editable={locals.editable}
            enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
            keyboardType={'number-pad'}
            multiline={locals.multiline}
            onBlur={locals.onBlur}
            onEndEditing={locals.onEndEditing}
            onFocus={locals.onFocus}
            onSubmitEditing={locals.onSubmitEditing}
            password={locals.password}
            placeholderTextColor={locals.placeholderTextColor}
            returnKeyType={locals.returnKeyType}
            selectTextOnFocus={locals.selectTextOnFocus}
            secureTextEntry={locals.secureTextEntry}
            selectionState={locals.selectionState}
            onChangeText={self.onChangeText.bind(self)}
            placeholder={'DD-MM-YYYY'}
            maxLength={10}
            numberOfLines={locals.numberOfLines}
            textAlign={locals.textAlign}
            textAlignVertical={locals.textAlignVertical}
            underlineColorAndroid={locals.underlineColorAndroid}
            style={mystyle}
            value={locals.value}
          />
          {help}
          {error}
        </View>
      );
      }
    }
    // keyboardType={'numbers-and-punctuation'}

}
export class LocalSelect extends FormSelect {

  constructor(props){
    super(props);
    // console.log("LocalSelect ", props.value, this.getOptions())
    let val = props.value ? props.value : this.getOptions()[0] ? this.getOptions()[0].value : null;
    if (val) {
        let init = this.getTransformer().format(String(val) ); // convert to String
        this.state = {value:init}
        // console.log("LocalSelect --> setting state", props.value, this.state, this.getOptions())
        this.selectName = this.getLocals().path[0];
    }

  }

  setPosition() {
      let position = this.props.options.position ? this.props.options.position : 'bottom';
      let width = this.props.options.width ? this.props.options.width : 250;
      let height = this.props.options.height ? this.props.options.height : 36;
      setTimeout(() => {
          updatePosition(this.optlist,true,position,width, height);
          updatePosition(this.refs["localselect"]);
      },700)
    //   console.log("LocalSelect.componentDidMount--> options******", this.optlist, width, height, position);

  }
  componentDidMount(){
          this.setPosition();
  }

  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    // only set state if a valid value
    let opt = _.find(this.getOptions(), (o) => o.value === String(props.value));
    if (opt) {
        // console.log("componentWillReceiveProps LocalSelect ---> ", props.value, this.getTransformer().format(props.value) );
        this.setState({value: this.getTransformer().format(String(props.value))});
    }
  }



  // componentDidUpdate(laststate, lastprop) {
  //     if (this.getLabel() === 'Premium term') debugger;
  // }

  getValue() {
    // console.log("LocalSelect.getValue called........", this.state.value, res);
    // if (this.getLabel() === 'Premium term') debugger;
    // basically if the state holds an value not in the options, we just take the 1st one

    // let  option = _.find(this.getOptions(), (opt) => opt.value === this.state.value );
    // if (option) {
    //     return this.getTransformer().parse(this.state.value) ;
    // } else {
    //     return this.getTransformer().parse(this.getOptions()[0].value);
    // }
    return this.getTransformer().parse(this.state.value);
    // return res;
  }


  getTransformer(){
    // return an object with 2 functions
    let opts = this.getOptions().filter((opt)=> opt.value !== null);
    let self = this;
    return {
      format: (value) => {
        //   if (self.getLabel() === 'Life assured *') { debugger;}

        // console.log('LocalSelect.format-->value',value, Object.prototype.toString.call(value));
        if (t.Nil.is(value)) { return ''}
        let opt = opts.filter((o)=> o.value === value);
        let res = opt.length > 0 ? opt[0].text : '';
        // console.log('LocalSelect.format-->value',value, res, Object.prototype.toString.call(value));
        return res;
      },
      parse: (value) => {
        // if (self.getLabel() === 'Life assured *') { debugger;}
        let opt = opts.filter((o)=> o.text === value);
        let res = opt.length > 0 ? opt[0].value : value === '' ? null : value;
        // console.log('LocalSelect.parse-->value',value, res, self.getLabel(), Object.prototype.toString.call(value));
        return res;
      }
    }
  }

  getNullOption() {
    let nullText= this.props.options.nulloption ? this.props.options.nulloption.label : "No selection";
    // return this.props.options.nullOption || {value: '', text: nullText};
    return this.props.options.nullOption || {value: '', text: nullText};
  }

  getOptions() {
    let items = super.getOptions()
    // console.log( "getOptions", this.props.options.nullOption,JSON.stringify(items) )
    if (this.props.options.nullOption === undefined) {
      items.shift();
    }
    return items;
  }


  onSelected(item){
    let choices = this.getOptions();
    let sel = choices.filter( (opt) => opt.text === item );
    let val = sel.length === 0 ? null : sel[0].value;
    this.setState({value:val});
    this.getLocals().onChange(val);
  }

  getTemplate() {
    var self = this;
    if (this.props.options.template) return this.props.options.template;

    return function(locals) {
      var stylesheet = locals.stylesheet;
      var formGroupStyle = stylesheet.formGroup.normal;
      var controlLabelStyle = stylesheet.controlLabel.normal;
      var selectStyle = stylesheet.select.normal;
      var helpBlockStyle = stylesheet.helpBlock.normal;
      var errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        selectStyle = stylesheet.select.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }
      var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;
      var width = self.props.options.width ? self.props.options.width : 250;
      var height = self.props.options.height ? self.props.options.height : 36;
      var prefix = locals.path[0] ? locals.path[0] : '';
      // console.log("getTemplate.getOptions", JSON.stringify( self.getOptions()));
      var options = self.getOptions().map( (item) => {
        return (
          <Option key={item.value}>{ item.text }</Option>
        )
      });
    //   let defvalue = self.props.options.nulloption ? self.props.options.nulloption.label : "Select a value";
      let position = self.props.options.position ? self.props.options.position : 'right';
    //   console.log("LocalSelect, controlLabel, options", controlLabelStyle, options.length, options) ;
      // <View style={{height:height}}>
    //   if (self.getLabel() === 'Life assured *') debugger;
      return (
        <View style={formGroupStyle}>
          {label}
          <View style={[selectStyle, {marginTop:0}] }>
             <Select
               width={width}
               height={height}
               ref="localselect"
               optionListRef={()=> self.optlist}
               defaultValue={self.state.value}
               onSelect={self.onSelected.bind(self)} >
                  {options}
             </Select>
             <OptionList position={position} ref={(cc) => self.optlist=cc}/>
         </View>
       </View>
      );
      }
    }

}

var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;

export class LocalNumber extends Textbox {

  getTransformer() {

      let dp = this.props.options.dp ? this.props.options.dp : 0 ;

      var numberTransformer = {
        format: (value) => {
          if ( !value ) { return value }
          let res =  formatNumber(value, dp);
        //   console.log("LocalNumber.format -->value, res", value, res, dp);
          return res;
        },
        parse: function (str) {
            //   console.log("LocalNumber.parse -->", str);
          if ( _.isString(str)) {
              return parseFloat( str.replace(/,/g,'') );
          } else { return 0 }
        }
      };
    return numberTransformer;
  }

  onChangeText(value){
    if (value.trim().length >= 0) {
      this.setState({value:value}); // this forces it to re-render & also formats the number
      this.getLocals().onChange(value); // propagates the chain back to the form onChange methods
    }
  }
  componentWillReceiveProps(props) {
   if (props.type !== this.props.type) {
     this.typeInfo = getTypeInfo(props.type);
   }
   // if (this.refs.input && this.refs.input.setNativeProps) {
   //      this.refs.input.setNativeProps({text:this.getTransformer().format(String(props.value)) });
   //      // debugger;
   //
   //  }
   // this.setState({value: this.getTransformer().format(props.value) });
    // setTimeout(() =>{
        this.setState({value: this.getTransformer().format(props.value) });
    // },10);
  }
  // componentDidUpdate(){
  //     if (this.refs.input && this.refs.input.setNativeProps) {
  //       //    this.refs.input.setNativeProps({text:this.getTransformer().format(String(props.value)) });
  //
  //   //     var nodeHandle = React.findNodeHandle(this.refs.input);
  //   //     debugger;
  //   //        KeyboardToolbar.moveCursorToLast(nodeHandle);
  //      //
  //      }
  //
  // }

  getTemplate() {
    var self = this;
    if (this.props.options.template) return this.props.options.template;

    return function(locals) {

      var stylesheet = locals.stylesheet;
      var formGroupStyle = stylesheet.formGroup.normal;
      var controlLabelStyle = stylesheet.controlLabel.normal;
      var textboxStyle = stylesheet.textbox.normal;
      var helpBlockStyle = stylesheet.helpBlock.normal;
      var errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        textboxStyle = stylesheet.textbox.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

      if (locals.editable === false) {
        textboxStyle = stylesheet.textbox.notEditable;
      }

      var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

    //   var mystyle = Object.assign( {}, textboxStyle);
      var mystyle = Object.assign( {}, textboxStyle, self.props.options.style || {width:200});
      if (self.props.options.width) mystyle.width = self.props.options.width ;
      //mystyle.width  = self.props.options.width ? self.props.options.width : 200; // unless specified in options, it is 200
      var selectText = locals.selectTextOnFocus ; //? locals.selectTextOnFocus  : true;

      return (
        <View style={formGroupStyle}>
          {label}
          <TextInput
            ref="input"
            autoCapitalize={locals.autoCapitalize}
            autoCorrect={locals.autoCorrect}
            autoFocus={locals.autoFocus}
            bufferDelay={locals.bufferDelay}
            clearButtonMode={locals.clearButtonMode}
            editable={locals.editable}
            enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
            keyboardType={'number-pad'}
            multiline={locals.multiline}
            onBlur={locals.onBlur}
            onEndEditing={locals.onEndEditing}
            onFocus={locals.onFocus}
            onSubmitEditing={locals.onSubmitEditing}
            password={locals.password}
            placeholderTextColor={locals.placeholderTextColor}
            returnKeyType={locals.returnKeyType}
            selectTextOnFocus={selectText}
            secureTextEntry={locals.secureTextEntry}
            selectionState={locals.selectionState}
            onChangeText={self.onChangeText.bind(self)}
            placeholder={locals.placeholder}
            maxLength={locals.maxLength}
            numberOfLines={locals.numberOfLines}
            textAlign={locals.textAlign}
            textAlignVertical={locals.textAlignVertical}
            underlineColorAndroid={locals.underlineColorAndroid}
            style={mystyle}
            value={locals.value + ''}
          />
          {help}
          {error}
        </View>
      );
      }
    }
}


export class LocalTextbox extends Textbox {

  getTemplate() {
    var self = this;
    if (this.props.options.template) return this.props.options.template;

    return function(locals) {

      var stylesheet = locals.stylesheet;
      var formGroupStyle = stylesheet.formGroup.normal;
      var controlLabelStyle = stylesheet.controlLabel.normal;
      var textboxStyle = stylesheet.textbox.normal;
      var helpBlockStyle = stylesheet.helpBlock.normal;
      var errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        textboxStyle = stylesheet.textbox.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

      if (locals.editable === false) {
        textboxStyle = stylesheet.textbox.notEditable;
      }

      var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

      var mystyle = Object.assign( {}, textboxStyle, self.props.options.style || {width:100});
    //   mystyle.width = 100; // yc
    //   mystyle.width  = self.props.options.width ? self.props.options.width : 100; // unless specified in options, it is 100


      return (
          <View style={formGroupStyle}>
            {label}
            <TextInput
              ref="input"
              autoCapitalize={locals.autoCapitalize}
              autoCorrect={locals.autoCorrect}
              autoFocus={locals.autoFocus}
              bufferDelay={locals.bufferDelay}
              clearButtonMode={locals.clearButtonMode}
              editable={locals.editable}
              enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
              keyboardType={locals.keyboardType}
              multiline={locals.multiline}
              onBlur={locals.onBlur}
              onEndEditing={locals.onEndEditing}
              onFocus={locals.onFocus}
              onSubmitEditing={locals.onSubmitEditing}
              password={locals.password}
              placeholderTextColor={locals.placeholderTextColor}
              returnKeyType={locals.returnKeyType}
              selectTextOnFocus={locals.selectTextOnFocus}
              secureTextEntry={locals.secureTextEntry}
              selectionState={locals.selectionState}
              onChangeText={(value) => locals.onChange(value)}
              placeholder={locals.placeholder}
              maxLength={locals.maxLength}
              numberOfLines={locals.numberOfLines}
              textAlign={locals.textAlign}
              textAlignVertical={locals.textAlignVertical}
              underlineColorAndroid={locals.underlineColorAndroid}
              style={mystyle}
              value={locals.value}
            />
            {help}
            {error}
          </View>
      );
      }
    }
}
export class Hidden extends Textbox {
    getValue() {
        return this.value;
    }

    getTemplate() {
        var self = this;
        return function(locals) {
            self.value = locals.value;
          return (
              <View>
                <TextInput
                  ref="input"
                  value={locals.value}
                  style={{left:-deviceWidth,top:-deviceHeight}}
                />
              </View>
          );
          }
    }
}

var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export class LocalCalendar extends Textbox {

  constructor(props){
    super(props);
    let val = props.value;
    if ( _.isString(val) ) {
        val = moment(val , [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate();
    }
    this.state = {
      hasError: false,
      value: this.getTransformer().format(val),
      showModal : false
    };

  }
  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    let val = props.value;
    if ( _.isString(val) ) {
        val = moment(val , [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D'], true)
        val = val.isValid() ? val.toDate() : props.value
    }
    this.setState({value: this.getTransformer().format(val)});
  }


  getTransformer(){
    // need to relook into this -- display is 2016 Mar 21, value should be a date,
    return {
      format: (value) => {
        if (t.Nil.is(value)) { return null }
        return Object.prototype.toString.call(value) === '[object Date]' ? moment(value).format('D-M-YYYY') : String(value);
      },
      parse: (value) => {
        if (!value) { return null}
         return value.trim().length === 0 ? null : moment(value,['D-M-YYYY','YYYY-M-D'],true).isValid() ?
            moment(value,['D-M-YYYY','YYYY-M-D'],true).toDate() : value ;
      }
    }
  }

  onCancel(){
     this.setState({showModal: false})
  }
  onDone(value) {
      // expect value to be a list with 3 elements e.g. ['2016', 'Sep','22'], convert to a date
    //   debugger;
      let selectedDate = moment( value.join('-'), 'YYYY-MMM-D').toDate();
      this.setState({showModal: false, value: selectedDate });
      this.getLocals().onChange(selectedDate);
  }
  toggleModal() {
      this.setState( {showModal : !this.state.showModal})
  }
  shouldComponentUpdate(nextProps, nextState) {
    var should = super.shouldComponentUpdate(nextProps,nextState);
    return should || (nextState.showModal !== this.state.showModal)
  }

  createDates(fromYear, toYear) {
      let years = {};
      _.forEach(_.range(fromYear, toYear+1), (year) => {
          years['' + year] = {}
          _.forEach( _.range(1,12+1), (month) => {
                years['' + year][MONTHS[month-1]] = []
                let numDays = [1,3,5,7,8,10,12].indexOf(month) >= 0 ? 31 : month !== 2 ? 30 : isLeap(year) ? 29 : 28 ;
                _.forEach( _.range(1,numDays+1), (day) => {
                    years['' + year][MONTHS[month-1]].push('' + day)
                })
          })
      })
      return years;
  }
  getTemplate() {
    var self = this;

    return function(locals) {
      let [dh, dw] = [deviceHeight,deviceWidth];
      var stylesheet = locals.stylesheet;
      var formGroupStyle = stylesheet.formGroup.normal;
      var controlLabelStyle = stylesheet.controlLabel.normal;
      var textboxStyle = stylesheet.textbox.normal;
      var helpBlockStyle = stylesheet.helpBlock.normal;
      var errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        textboxStyle = stylesheet.textbox.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

    //   textboxStyle = stylesheet.textbox.notEditable;

      var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;
      var width = self.props.options.width ? self.props.options.width : 250;
      var height = self.props.options.height ? self.props.options.height : 36;
      var prefix = locals.path[0] ? locals.path[0] : '';
      var mystyle = Object.assign( {}, textboxStyle, self.props.options.style || {width:120}, {backgroundColor : 'transparent'});
      var pickerBackground = self.props.options.pickerBackground ? self.props.options.pickerBackground  : '#cef4f4'
      var pickerStyle = Object.assign({}, {top: (dw-300-400), left: (dw/4) + 20 , height: 300, width:dw/2, backgroundColor:pickerBackground},
                        self.props.options.pickerStyle); // defaults unless overridden
      var title = self.props.options.title ? self.props.options.title : locals.label ? locals.label :'Select a date'
      var defaultYear = parseInt( moment().format('YYYY') )
      var startYear = self.props.options.startYear ? self.props.options.startYear : defaultYear - 3;
      var endYear = self.props.options.endYear ? self.props.options.endYear : defaultYear + 10 ;
      var data = self.createDates(startYear, endYear);
      var value = _.isDate(locals.value) ? moment(String(locals.value),[moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).format('D-M-YYYY') : locals.value;
      var value2 = locals.value ? moment(String(locals.value),[moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).format('YYYY-MMM-D').split('-') : moment().format('YYYY-MMM-D').split('-')

      return (
          <View style={formGroupStyle}>
            {label}
            <TouchableOpacity onPress={() => self.toggleModal() }>
                <TextInput
                  ref="input"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  autoFocus={false}
                  bufferDelay={locals.bufferDelay}
                  clearButtonMode={locals.clearButtonMode}
                  editable={false}
                  enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
                  keyboardType={'number-pad'}
                  multiline={locals.multiline}
                  onBlur={locals.onBlur}
                  onEndEditing={locals.onEndEditing}
                  onFocus={locals.onFocus}
                  onSubmitEditing={locals.onSubmitEditing}
                  password={locals.password}
                  placeholderTextColor={locals.placeholderTextColor}
                  returnKeyType={locals.returnKeyType}
                  selectTextOnFocus={locals.selectTextOnFocus}
                  secureTextEntry={locals.secureTextEntry}
                  selectionState={locals.selectionState}
                //   onChangeText={(value) => locals.onChange(value)}
                  placeholder={locals.placeholder}
                  maxLength={locals.maxLength}
                  numberOfLines={locals.numberOfLines}
                  textAlign={locals.textAlign}
                  textAlignVertical={locals.textAlignVertical}
                  underlineColorAndroid={locals.underlineColorAndroid}
                  style={mystyle}
                  value={value}
                />
            </TouchableOpacity>

            <Modal visible={self.state.showModal} transparent={true} animated={true} >
              <View style={{top: 0, left: 0 , backgroundColor: pickerBackground }} >
                    <Picker ref="calendar" showDuration={300} showMask={true} pickerToolBarStyle={{height:60, backgroundColor: '#5cafec'}}
                        pickerBtnStyle={{color:'white'}} pickerTitleStyle={{fontSize:20, color:'white'}}
                        style={pickerStyle}
                        pickerBtnText="Confirm" pickerCancelBtnText="Cancel" pickerTitle={title}
                        pickerData={data} selectedValue={value2}
                        onPickerCancel={()=>self.onCancel()}  onPickerDone={(val)=> self.onDone(val)} ></Picker>
                </View>
             </Modal>


          </View>

      );
      }
  }

}
export class LocalPicker extends FormSelect {

  constructor(props){
    super(props);
    let val = props.value ? props.value : this.getOptions()[0].value,
        init = this.getTransformer().format(val);
    this.state = { value : init, showModal : false }
  }

  componentWillReceiveProps(props) {
    if (props.type !== this.props.type) {
      this.typeInfo = getTypeInfo(props.type);
    }
    let opt = _.find(this.getOptions(), (o) => o.value === props.value);
    // basically , we only display the state label if the value is acceptable, errrrr.....
    if (opt) {
        this.setState({value: this.getTransformer().format(props.value)});
    }
  }

  getValue() {
    return this.getTransformer().parse(this.state.value);
  }


  getTransformer(){
    // need to relook into this
    let opts = this.getOptions().filter((opt)=> opt.value !== null);
    return {
      format: (value) => {
        if (t.Nil.is(value)) { return ''}
        let opt = opts.filter((o)=> o.value === value);
        let res = opt.length > 0 ? opt[0].text : '';
        return res;
      },
      parse: (value) => {
        let opt = opts.filter((o)=> o.text === value);
        let res = opt.length > 0 ? opt[0].value : value === '' ? null : value;
        return res;
      }
    }
  }

  getOptions() {
    let items = super.getOptions()
    if (this.props.options.nullOption === undefined) {
      items.shift();
    }
    return items;
  }
  // onChange(option) {
  //     console.log("LocalPicker.onChange, value", option );
  //   //   let choices = this.getOptions();
  //   //   let sel = choices.filter( (opt) => opt.text === item );
  //   //   let val = sel.length === 0 ? null : sel[0].value;
  //   //   this.setState({value : option.key});
  //     this.getLocals().onChange(option);
  // }
  onCancel(){
     this.setState({showModal: false})
  }
  onDone(value) {
      this.setState({showModal: false, value: value[0]});
      let option = _.find(this.getOptions(), (opt) => opt.text === value[0] ); // must find this, since we display from this list
      this.getLocals().onChange(option.value);
  }
  toggleModal() {
      this.setState( {showModal : !this.state.showModal})
  }
  shouldComponentUpdate(nextProps, nextState) {
    var should = super.shouldComponentUpdate(nextProps,nextState);
    return should || (nextState.showModal !== this.state.showModal)
  }

  getTemplate() {
    var self = this;

    return function(locals) {
      let [dh, dw] = [deviceHeight,deviceWidth];
      var stylesheet = locals.stylesheet;
      var formGroupStyle = stylesheet.formGroup.normal;
      var controlLabelStyle = stylesheet.controlLabel.normal;
      var textboxStyle = stylesheet.textbox.normal;
      var helpBlockStyle = stylesheet.helpBlock.normal;
      var errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        textboxStyle = stylesheet.textbox.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

    //   textboxStyle = stylesheet.textbox.notEditable;

      var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;
      var width = self.props.options.width ? self.props.options.width : 250;
      var height = self.props.options.height ? self.props.options.height : 36;
      var prefix = locals.path[0] ? locals.path[0] : '';
      var mystyle = Object.assign( {}, textboxStyle, self.props.options.style || {width:120}, {backgroundColor : 'transparent'});
      var pickerBackground = self.props.options.pickerBackground ? self.props.options.pickerBackground  : '#cef4f4'
      var pickerStyle = Object.assign({}, {top: (dw-300-400), left: dw/4, height: 300, width:dw/2, backgroundColor:pickerBackground},
                        self.props.options.pickerStyle); // defaults unless overridden
      var title = self.props.options.title ? self.props.options.title : locals.label ? locals.label :'Please select one'

      var data = self.getOptions().map( (item) => item.text )
      return (
          <View style={formGroupStyle}>
            {label}
            <TouchableOpacity onPress={() => self.toggleModal() }>
                <TextInput
                  ref="input"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  autoFocus={false}
                  bufferDelay={locals.bufferDelay}
                  clearButtonMode={locals.clearButtonMode}
                  editable={false}
                  enablesReturnKeyAutomatically={locals.enablesReturnKeyAutomatically}
                  keyboardType={'number-pad'}
                  multiline={locals.multiline}
                  onBlur={locals.onBlur}
                  onEndEditing={locals.onEndEditing}
                  onFocus={locals.onFocus}
                  onSubmitEditing={locals.onSubmitEditing}
                  password={locals.password}
                  placeholderTextColor={locals.placeholderTextColor}
                  returnKeyType={locals.returnKeyType}
                  selectTextOnFocus={locals.selectTextOnFocus}
                  secureTextEntry={locals.secureTextEntry}
                  selectionState={locals.selectionState}
                //   onChangeText={(value) => locals.onChange(value)}
                  placeholder={locals.placeholder}
                  maxLength={locals.maxLength}
                  numberOfLines={locals.numberOfLines}
                  textAlign={locals.textAlign}
                  textAlignVertical={locals.textAlignVertical}
                  underlineColorAndroid={locals.underlineColorAndroid}
                  style={mystyle}
                  value={locals.value}
                />
            </TouchableOpacity>

            <Modal visible={self.state.showModal} transparent={true} animated={true} >
              <View style={{top: 0, left: 0 , backgroundColor: pickerBackground }} >
                    <Picker ref="picker" showDuration={300} showMask={true} pickerToolBarStyle={{height:60, backgroundColor: '#5cafec'}}
                        pickerBtnStyle={{color:'white'}} pickerTitleStyle={{fontSize:20, color:'white'}}
                        style={pickerStyle}
                        pickerBtnText="Confirm" pickerCancelBtnText="Cancel" pickerTitle={title}
                        pickerData={data} selectedValue={locals.value}
                        onPickerCancel={()=>self.onCancel()}  onPickerDone={(val)=> self.onDone(val)} ></Picker>
                </View>
             </Modal>


          </View>

      );
      }
  }

}



export class LocalCheckbox extends Checkbox{
    getTemplate() {
        var self = this;
        return function(locals) {
            var stylesheet = locals.stylesheet;
            var formGroupStyle = stylesheet.formGroup.normal;
            var controlLabelStyle = stylesheet.controlLabel.normal;
            var checkboxStyle = stylesheet.checkbox.normal;
            var helpBlockStyle = stylesheet.helpBlock.normal;
            var errorBlockStyle = stylesheet.errorBlock;

            if (locals.hasError) {
              formGroupStyle = stylesheet.formGroup.error;
              controlLabelStyle = stylesheet.controlLabel.error;
              checkboxStyle = stylesheet.checkbox.error;
              helpBlockStyle = stylesheet.helpBlock.error;
            }

            var label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
            var help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
            var error = locals.hasError && locals.error ? <Text style={errorBlockStyle}>{locals.error}</Text> : null;

            return (
              <View style={formGroupStyle}>
                <SwitchIOS
                  ref="input"
                  disabled={locals.disabled}
                  onTintColor={locals.onTintColor}
                  thumbTintColor={locals.thumbTintColor}
                  tintColor={locals.tintColor}
                  style={checkboxStyle}
                  onValueChange={(value) => locals.onChange(value)}
                  value={locals.value}
                />
              </View>
            );
        }
    }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor : 'blue'
  },
  overlay: {
    position: 'absolute',
    // backgroundColor: 'transparent',
    backgroundColor: 'green',
    width: deviceWidth,
    height: deviceHeight
  },
});
