'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Easing,
  ListView,
  Image,
  TouchableHighlight,
} = React

var screenWidth = Dimensions.get('window').width;
var Icon = require('react-native-vector-icons/FontAwesome');

class HomeView extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState();
    }

    getInitState(){
      return {
      };
    }
    gotoContact(){
        console.log("goto Contact", this.props);
        this.props.fns.gotoContacts(this.props);
    }

    gotoQuotation(){
        console.log("goto Quoatation");
    }

    gotoProposal(){
        console.log("goto Proposal");
    }

    gotoSubmission(){
        console.log("goto Submission");
    }

    gotoAdmin(){
        console.log("goto Admin");
    }

    render(){
      return(
        <View style={styles.container}>
          <View style={styles.row}>
              <Icon.Button name="user" style={styles.icon} backgroundColor="#3b5998" onPress={(e)=>this.gotoContact(e)}>
                  Contacts
              </Icon.Button>
            </View>
            <View style={styles.row}>
              <Icon.Button name="calculator" style={styles.icon} backgroundColor="#00e08f" onPress={(e)=>this.gotoQuotation(e)}>
                  Quotation
              </Icon.Button>
            </View>

            <View style={styles.row}>
              <Icon.Button name="file-text" style={styles.icon} backgroundColor="#f05998" onPress={(e)=>this.gotoProposal(e)}>
                  Proposal
              </Icon.Button>
            </View>

          <View style={styles.row}>
              <Icon.Button name="wifi" style={styles.icon} backgroundColor="red" onPress={(e)=>this.gotoSubmission(e)}>
                  e-Submission
              </Icon.Button>
            </View>

            <View style={styles.row}>
              <Icon.Button name="navicon"  style={styles.icon} backgroundColor="blue" onPress={(e)=>this.gotoAdmin(e)}>
                  Administration
              </Icon.Button>
          </View>
        </View>
      );
    }
} // end SideMenu class

var styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingLeft: 200,
    paddingRight: 200,
    flex: 0,
  },
  icon: {
    width: 64,
    height: 64,
  },
  row: {
    padding: 10,
  },
})

module.exports = HomeView;
