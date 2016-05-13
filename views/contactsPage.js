'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
} = React

var screenWidth = Dimensions.get('window').width;
var Icon = require('react-native-vector-icons/FontAwesome');
var SlideMenu = require("../components/slidemenu");
var SideMenu = require("../components/sidemenu");
import ContactsView from "./contacts";
import _ from "lodash";

export default class ContactsPage extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState();
    }

    getInitState(){
      return {
      };
    }

    render(){
      let fns = _.extend({}, this.props.data.fns)
      return (
          <SlideMenu ref={(item) => { if( item) fns.parent = item;} }
            renderLeftView = {() => <SideMenu fns={fns}/>}
            renderCenterView = {() => <ContactsView fns={fns} /> }
          />
      );
    }
}

var styles = StyleSheet.create({
});
