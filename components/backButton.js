'use strict';

var React = require('react-native');

var {
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
  Text
} = React;


var styles = StyleSheet.create({
  backButton: {
    width: 20,
    height: 17,
    marginLeft: 5,
    marginTop: 3,
    marginRight: 3
  }
});
var Icon = require('react-native-vector-icons/FontAwesome');

var BackButton = React.createClass({
  render() {
    return (
      <View style={{flexDirection:"row", padding:0}}>
        <Icon name={"chevron-left"} size={20} color="#fff" style={styles.backButton} />
        <Text style={{fontSize:16, top:2, color:"#fefefe" }}>Back</Text>
      </View>
    )
  }
});


module.exports = BackButton;
