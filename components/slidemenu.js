'use strict'

var React = require('react-native')
var {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  Dimensions,
  Easing
} = React

// var Dimensions = require('Dimensions')
var screenWidth = Dimensions.get('window').width

var SlideMenu = React.createClass({
  componentDidMount() {
      let offset = this.props.visible ? this.props.offset : 0 // Contains the center view offset from the left edge
      //console.log("componentDidMount, offset", offset, this.center)
      this.center.setNativeProps({style:{left: offset}})
      Animated.timing(this.state.timingAnimation,{toValue:this.offset,duration:500,easing:Easing.linear}).start();
  },
  componentWillMount: function() {
    this.offset = this.props.visible ? this.props.offset : 0 // Contains the center view offset from the left edge
    this._panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // console.log("dx & dy", gestureState.dx, gestureState.dy);
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
               && Math.abs(gestureState.dx) > 10
      },
      onPanResponderGrant: (evt, gestureState) => this.left = 0,
      onPanResponderMove: (evt, gestureState) => this.moveCenterView(gestureState.dx),
      onPanResponderRelease: this.moveFinished,
      onPanResponderTerminate: this.moveFinished,
    })
  },
  getInitialState:function(){
      return {
          timingAnimation : new Animated.Value(0),
          // bounceValue : new Animated.Value(0),
      };
  },
  moveCenterView: function(left) {
    let uistate = require("../state"),
        state = uistate.get();

    if ( state.quote && state.quote.slidemenu ) {
        if (!this.center) return

        if ((this.offset + left) < 0) {
          this.left = -this.offset
        } else {
          this.left = left
        }
        // console.log("this.offset + this.left, left", this.offset + this.left, this.left)
        this.center.setNativeProps({style: {left: this.offset + this.left}})
    }

  },
  closeLeft: function(){
    this.offset = 0;
    // Animated.timing(this.state.timingAnimation,{toValue:this.offset,duration:1500,easing:Easing.elastic(1.5)}).start();
    Animated.timing(this.state.timingAnimation,{toValue:this.offset,duration:500,easing:Easing.linear}).start();
    this.center.setNativeProps({style:{left: this.offset}})

  },
  moveFinished: function() {
    if (!this.center) return

    let width = this.props.offset ? this.props.offset : 0.25

    var offset = this.offset + this.left
    // console.log("moveFinished", this.offset, this.left)

    if (this.offset === 0) {
      if (offset > screenWidth * width) {
        this.offset = screenWidth * width
      }
    } else {
    //   if (offset < screenWidth * 0.5) {
      if (offset < screenWidth * 0.90) {
        this.offset = 0
      }
    }

    // Animation.startAnimation(this.center, 400, 0, 'easeInOut', {'anchorPoint.x': 0, 'position.x': this.offset})
    // Animated.timing(this.state.timingAnimation,{toValue:this.offset,duration:1500,easing:Easing.elastic(1.5)}).start();
    // uncomment    Animated.timing(this.state.timingAnimation,{toValue:this.offset,duration:500,easing:Easing.linear}).start();
    // this.state.bounceValue.setValue(1.2);
    // Animated.spring(this.state.bounceValue, {toValue:0.9,friction:1}).start();
    this.center.setNativeProps({style:{left: this.offset}})
  },

  render: function() {
    var centerView = this.props.renderCenterView ? this.props.renderCenterView() : null;
    var leftView = this.props.renderLeftView ? this.props.renderLeftView() : null;
    // debugger;
    // if (leftView && leftView.props.fns){
    //   if (!leftView.props.fns.closeLeft) {
    //     leftView.props.fns.closeLeft = this.closeLeft;
    //   }
    // }
    // style={[styles.center, {left: this.state.timingAnimation }]}
    //style={[styles.center, { left: this.offset, transform: [{scale:this.state.bounceValue}] }]}
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.left} >
          {leftView}
        </View>
        <Animated.View
          style={[styles.center, {left: this.state.timingAnimation }]}
          ref={(center) => this.center = center}
          {...this._panGesture.panHandlers}>
          {centerView}
        </Animated.View>
      </View>
    )
  },
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  left: {
    position: 'absolute',
    top:0,
    left:0,
    bottom:0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
})

module.exports = SlideMenu
