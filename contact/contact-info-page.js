'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
} = React

var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');

// i think we do not need the side menu here

var SlideMenu = require("../components/slidemenu");
var ContactInfoMenu = require("./contact-info-menu");

import ContactInfoHome from "./contact-info-home";
import _ from "lodash";
import moment from "moment"

export default class ContactInfoPage extends React.Component {
    constructor(props){
      super(props);
      this.state = {

      }
    }

    // {/*
    // <View style={{flex:1, flexDirection:'row'}}>
    //   <View style={{flex:0.15}}>
    //       <ContactInfoMenu fns={fns} />
    //   </View>
    //   <View style={{flex:0.85}}>
    //       <ContactInfoHome fns={fns} />
    //   </View>
    // </View>
    // */}


    render(){
      let fns = _.extend({}, this.props.data.fns)
      return (
          <ContactInfoHome ref="contactinfo" fns={fns} />

      );
    }
}

var styles = StyleSheet.create({
});
