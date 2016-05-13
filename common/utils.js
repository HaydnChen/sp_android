const React = require('react-native');
const { StyleSheet, Dimensions } = React;

import numeral from "numeral"


var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;
const dh = Dimensions.get('window').height;
const dw = Dimensions.get('window').width;
var isLeap = (yr) => { return !((yr % 4) || (!(yr % 100) && (yr % 400))); }
var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']


function kbHandler(self, refName, scrollViewRefName='container', formName="form", offset=100, ){
    // assumes some conventions i.e. form must be called form
    setTimeout(()=>{
      let handle =   React.findNodeHandle(self.refs[formName].refs.input.refs[refName]);
      let scrollResponder=self.refs[scrollViewRefName].getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(handle), offset, true );
    }, 150);
}

function actionButton(iconName,iconSize=30, iconColor="white", bgColor="#3498db") {
    return (
        <View ref="actionButton" style={[styles.overlay],{left:((0.85*dw)-100), top:-(dh-400)}}>
          <TouchableOpacity activeOpacity={0.5} onPress={()=> this.saveContact()}
            style={{}}>
            <View style={[styles.actionButton,
              {
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: bgColor,
              }
            ]}>
            <Icon name={iconName} size={iconSize} color={iconColor} />
            </View>
          </TouchableOpacity>
        </View>

    );
}






var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop : 10,
    borderColor : 'grey',
    borderWidth : 0,
  },
  text: {
    fontSize : 20,
    color : 'grey',
    paddingBottom : 10
},
actionButton: {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  paddingTop: 2,
  shadowOpacity: 0.3,
  shadowOffset: {
    width: 0, height: 1,
  },
  shadowColor: '#444',
  shadowRadius: 1,
},

});




export {
    formatNumber,
    dh,
    dw,
    isLeap,
    kbHandler,
    actionButton
}
