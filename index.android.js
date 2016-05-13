/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
require('regenerator/runtime');
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Router from 'react-native-simple-router';
var HomePage = require("./views/HomePage");
var BackButton = require("./components/backButton");
var firstRoute = {
  name: 'Home',
  component: HomePage,
  // leftCorner: AddPeople
};
var db = require('./db');
class SPApp extends Component {
  constructor(props){
    super(props);
    this.router = null;
    // can we link in the engine and the products, just to test first
    require('./products')
  }
  render() {
    return (
      <Router ref={(router) => {this.router=router;}}
        firstRoute={firstRoute}
        headerStyle={styles.header}
        backButtonComponent={BackButton}
      />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#5cafec'
  }
});

AppRegistry.registerComponent('sp_android', () => SPApp);
