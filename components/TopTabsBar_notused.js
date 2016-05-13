'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} = React;

var Icon = require('react-native-vector-icons/FontAwesome');

var deviceWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },

  tabs: {
    height: 50,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});

var TopTabsBar = React.createClass({
  selectedTabIcons: [],
  unselectedTabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  renderTabOption(name, page) {
    var isTabActive = this.props.activeTab === page;

    var [textName, iconName] = name.split("|");

    var onPress = () => this.onnPress(textName,page);

    return (
      <TouchableOpacity key={iconName} onPress={onPress} style={[styles.tab]}>
        <Icon name={iconName} size={30} color='#3B5998' style={{width: 30, height: 30, position: 'absolute', top: 0, left: 10}}
              ref={(icon) => { this.selectedTabIcons[page] = icon }}/>
        <Icon name={iconName} size={30} color='#ccc' style={{width: 30, height: 30, position: 'absolute', top: 0, left: 10}}
              ref={(icon) => { this.unselectedTabIcons[page] = icon }}/>
        <Text style={{fontSize:10,position:"absolute",bottom:2,marginLeft:10}} >{textName}</Text>
      </TouchableOpacity>
    );
  },

  onnPress(textName,page){
    this.props.goToPage(page);
    this.forceUpdate();

  },
  componentDidMount() {
    this.setAnimationValue({value: this.props.activeTab});
    //this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
  },

  setAnimationValue({value}) {
    var currentPage = this.props.activeTab;

    this.unselectedTabIcons.forEach((icon, i) => {
      var iconRef = icon;

      if (!icon.setNativeProps && icon !== null) {
        iconRef = icon.refs.icon_image
      }

      if (value - i >= 0 && value - i <= 1) {
        iconRef.setNativeProps({style: {opacity: value - i}});
      }
      if (i - value >= 0 &&  i - value <= 1) {
        iconRef.setNativeProps({style: {opacity: i - value}});
      }

//      if (value - i >= 0 && value - i <= 1) {
//        iconRef.setNativeProps({opacity: value - i});
//      }
//      if (i - value >= 0 &&  i - value <= 1) {
//        iconRef.setNativeProps({opacity: i - value});
//      }


    });
  },

  render() {
    var numberOfTabs = this.props.tabs.length;
//    console.log("render-> value of props ",  this.props);
    var tabUnderlineStyle = {
      position: 'absolute',
      width: deviceWidth / numberOfTabs,
      height: 3,
      backgroundColor: '#3b5998',
      bottom: 0,
    };

    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, deviceWidth / numberOfTabs]
    });

    return (
      <View>
        <View style={styles.tabs}>
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>
        <Animated.View style={[tabUnderlineStyle, {left}]} />
      </View>
    );
  },
});

module.exports = TopTabsBar;
