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
// import ProposalList from "./proposal-list-view";
import ProposalListHome from "./proposal-list-home";

var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');

export default class ProposalListPage extends React.Component {
    constructor(props){
      super(props);
      this.state = {
      }
    }

    render(){
      let fns = _.extend({}, this.props.data.fns)
      return (
          <ProposalListHome ref="proposallist" fns={fns} />
      );
    }
}

var styles = StyleSheet.create({
});
