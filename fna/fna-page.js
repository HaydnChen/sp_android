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

import FnaHome from "./fna-home";
import _ from "lodash";
import moment from "moment"

const TAG="AdminPage."
export default class FnaPage extends React.Component {
    constructor(props){
      super(props);
      this.state = {}
    }
    render(){
      let fns = _.extend({}, this.props.data.fns)
      return (
          <FnaHome ref="fnaHome" fns={fns} />

      );
    }
}
var styles = StyleSheet.create({
});
