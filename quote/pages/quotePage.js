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
var SlideMenu = require("../../components/slidemenu");
var SideMenu = require("../../components/sidemenu");
import QuoteView from "../views/quoteView";
import _ from "lodash";

export default class QuotePage extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState();
      this.slideMenuFlag = true;
    }
    getInitState(){
      return {
      };
    }
    render(){
        /*
        <SlideMenu ref={(item) => { if( item) fns.parent = item;} }
            renderLeftView = {() => <SideMenu fns={fns}/>}
            renderCenterView = {() => <QuoteView data={data} /> }
          />
          */

      let fns = _.extend({}, this.props.data.fns)
      let data = Object.assign( {}, this.props.data)
      return (
          <QuoteView data={data} />
      );
    }
}

var styles = StyleSheet.create({
});
