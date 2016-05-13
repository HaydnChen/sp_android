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

// var SlideMenu = require("../components/slidemenu");
// var ContactInfoMenu = require("./contact-info-menu");

import ProposalS1Home from "./proposal-s1-home";
import _ from "lodash";
import moment from "moment"

export default class ProposalS1Page extends React.Component {
    constructor(props){
      super(props);
      this.state = {}
    }

    render(){
      let fns = _.extend({}, this.props.data.fns)
      return (
          <ProposalS1Home ref="s1" fns={fns} data={this.props.data}/>
      );
    }
}

var styles = StyleSheet.create({
});
