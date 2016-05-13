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

import _ from "lodash";
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
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    // paddingBottom: 20
  },
});

export default class TabsBar extends React.Component {
    constructor(props) {
      super(props);
      this.selectedTabIcons = [];
      this.unselectedTabIcons = [];
      this.state = this.getInitState();
      this.currentPage = 0; //yc
    }

    getInitState(){
      return {};
    }

    renderTabOption(name, page) {
      var isTabActive = this.props.activeTab === page;
      var numberOfTabs = this.props.tabs.length;
      var [ textName, iconName ] = name.split('|');
      var textLeft = textName.length / 2;
    //   debugger;
      return (
        <TouchableOpacity key={textName} onPress={() => this.onPress(textName,page)} style={[styles.tab]}>
        <View style={styles.tab} >
              <Icon name={iconName} size={30} color='#3B5998' style={{width: 38, height: 30, position: 'absolute', top: 0, left: 10}}
                    ref={(icon) => { this.selectedTabIcons[page] = icon }}/>

              <Icon name={iconName} size={30} color='#ccc' style={{width: 38, height: 30, position: 'absolute', top: 0, left: 10}}
                    ref={(icon) => { this.unselectedTabIcons[page] = icon }}/>

              <Text style={{fontSize:12 , position:"absolute", bottom:2 , marginLeft:0, left: -textLeft }} >{textName}</Text>

      </View>
        </TouchableOpacity>
      );
    }
    onPress(textName, page){
    //   console.log("TabsBar.onPress ------> page", page, textName);
      let res, ok = true;
      this.currentPage = page;
      if (this.props.onPress) {
          res = this.props.onPress(page, textName);
        //   ok = res === undefined ? true : false;
          ok = res === undefined ? true : res;
          if (!ok) return; // ignore
      }
      if (ok) {
        setTimeout(()=>{
          this.props.goToPage(page);
          this.setOpacity(page);
          // this.forceUpdate();
        },0);
      }
    }

    gotoTab(tabno) {
    let res, ok = true;
      this.currentPage = tabno;
      if (this.props.onPress) {
          res = this.props.onPress(tabno);
          ok = res === undefined ? true : false;
      }
      if (ok) {

          setTimeout(()=>{
            this.props.goToPage(tabno);
            // this.forceUpdate();
          },0);
          this.setOpacity(tabno);
      }
    }
    // resetTab(tabno) {
    //     let res, ok = true;
    //       this.currentPage = tabno;
    //       if (this.props.onPress) {
    //           res = this.props.onPress(tabno);
    //           ok = res === undefined ? true : false;
    //       }
    //       if (ok) {
    //
    //           setTimeout(()=>{
    //             // this.props.goToPage(tabno);
    //             // this.forceUpdate();
    //           },0);
    //           this.setOpacity(tabno);
    //       }
    // }

    setOpacity(page){
      let iconRef;

      let tab = _.isUndefined(this.props.tabno) ? page : this.props.tabno ;

      this.unselectedTabIcons.forEach((icon, i) => {
        iconRef = icon;
        if (icon !== null && !icon.setNativeProps) {
          console.log("resetting iconref");
          iconRef = icon.refs.icon_image
        }
        if (tab === i ) {
          // set opacity to 0
        //   console.log("setting iconref page opacity----> 0 --> ", tab, this.props.tabno, iconRef);
          if (iconRef) {
              iconRef.setNativeProps({style: {opacity: 0}});
          }
        } else {
            // console.log("setting iconref page opacity---> 1 --> ", tab, this.props.tabno, iconRef);
            if (iconRef) {
                iconRef.setNativeProps({style: {opacity: 1}});
            }
        }

        // console.log("setOpacity-->iconRef.nativeProps ", iconRef);

      });

    }
    componentDidMount() {

      this.setAnimationValue({value: this.props.activeTab});
      this.setOpacity(this.props.activeTab);
      // this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
    }

    setAnimationValue({value}) {

      var currentPage = this.props.activeTab;
      this.unselectedTabIcons.forEach((icon, i) => {
        var iconRef = icon;
        if (!icon.setNativeProps && icon !== null) {
          iconRef = icon.refs.icon_image
        }

        // if (this.currentPage - i >= 0 && this.currentPage - i <= 1) {
        //   iconRef.setNativeProps({style: {opacity: this.currentPage - i}});
        // }
        // if (i - this.currentPage >= 0 &&  i - this.currentPage <= 1) {
        //   iconRef.setNativeProps({style: {opacity: i - this.currentPage}});
        // }

        if (value - i >= 0 && value - i <= 1) {
          iconRef.setNativeProps({style: {opacity: value - i}});
        }
        if (i - value >= 0 &&  i - value <= 1) {
          iconRef.setNativeProps({style: {opacity: i - value}});
        }


      });

    }
    componentWillUpdate(){
        this.setOpacity(this.props.activeTab);
    }

    render() {
      var numberOfTabs = this.props.tabs.length;
      var tabUnderlineStyle = {
        position: 'absolute',
        width: deviceWidth / numberOfTabs,
        height: 5,
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
    }
}

TabsBar.propType = {
  goToPage: React.PropTypes.func,
  activeTab: React.PropTypes.number,
  tabs: React.PropTypes.array
}
