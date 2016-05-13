'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
} = React

// i think we do not need the side menu here
import _ from "lodash";
import moment from "moment"
import ContactList from "./contact-list-view";
import ContactListHome from "./contact-list-home";

// var SlideMenu = require("../components/slidemenu");
// var SideMenu = require("./contact-list-menu");
var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');


export default class ContactListPage extends React.Component {
    constructor(props){
      super(props);
      this.state = {

      }
    }

    render(){
      let fns = _.extend({}, this.props.data.fns)
      return (
          <ContactListHome ref="contactlist" fns={fns} />
      );
    }
}

var styles = StyleSheet.create({
});
