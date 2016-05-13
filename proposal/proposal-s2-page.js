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

import ProposalS2Home from "./proposal-s2-home";
import _ from "lodash";
import moment from "moment"

export default class ProposalS2Page extends React.Component {
    constructor(props){
      super(props);
      this.state = {}
    }

    render(){
      let fns = _.extend({}, this.props.data.fns)
      return (
          <ProposalS2Home ref="s2" fns={fns} />
      );
    }
}

var styles = StyleSheet.create({
});
