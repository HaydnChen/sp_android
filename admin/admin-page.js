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

import AdminHome from "./admin-home";
import _ from "lodash";
import moment from "moment"

const TAG="AdminPage."
export default class AdminPage extends React.Component {
    constructor(props){
      super(props);
      this.state = {}
    }
    render(){
      let fns = _.extend({}, this.props.data.fns)
      return (
          <AdminHome ref="adminHome" fns={fns} />

      );
    }
}
var styles = StyleSheet.create({
});
