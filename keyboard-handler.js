/**
 * Handle resizing enclosed View and scrolling to input
 * Usage:
 *    <KeyboardHandler ref='kh' offset={50}>
 *      <View>
 *        ...
 *        <TextInput ref='username'
 *          onFocus={()=>this.refs.kh.inputFocused(this,'username')}/>
 *        ...
 *      </View>
 *    </KeyboardHandler>
 *
 *  offset is optional and defaults to 34
 *  Any other specified props will be passed on to ScrollView
 */
'use strict';

var React=require('react-native');
var {
  ScrollView,
  View,
  NativeModules: {
    UIManager,
  },
  DeviceEventEmitter,
  Dimensions
}=React;

var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;


var myprops={
  offset:34,
}
var KeyboardHandler=React.createClass({
  propTypes:{
    offset: React.PropTypes.number,
  },
  getDefaultProps(){
    return myprops;
  },
  getInitialState(){
    DeviceEventEmitter.addListener('keyboardDidShow',(frames)=>{
        console.log("keyboardDidShow", frames.endCoordinates.height);
      if (!frames.endCoordinates) return;
      setTimeout(()=> {
        //   this.setState({keyboardSpace: frames.endCoordinates.height});
      },100)
    });
    DeviceEventEmitter.addListener('keyboardWillHide',(frames)=>{
        setTimeout(()=> {
            // this.setState({keyboardSpace: 0});
        },100)
    });

    this.scrollviewProps={
      automaticallyAdjustContentInsets:true,
      scrollEventThrottle:200,
    };
    // pass on any props we don't own to ScrollView
    Object.keys(this.props).filter((n)=>{return n!='children'})
    .forEach((e)=>{if(!myprops[e])this.scrollviewProps[e]=this.props[e]});

    return {
      keyboardSpace:0,
    };
  },
  render(){
    return (
      <ScrollView ref='scrollView' {...this.scrollviewProps}>
        {this.props.children}
        <View style={{height:this.state.keyboardSpace}}></View>
      </ScrollView>
    );
  },
  focused(_this,refName){
      setTimeout(()=>{
        let handle =   React.findNodeHandle(_this.refs[refName]);
        // console.log("focused", handle, this.props.offset);
        // let scrollResponder=self.refs.scroll.refs.scrollView.getScrollResponder();
        // let scrollResponder=this.refs.scrollView.getScrollResponder(); // original code
        // assumes the layout defines the scrollview as sv

        let scrollResponder=_this.refs.sv.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          React.findNodeHandle(_this.refs[refName]),
          this.props.offset, //additionalOffset
          true
        );
    }, 50);
  },
  // inputFocused(_this,refName, self){
  //
  //     const handle = React.findNodeHandle(_this.refs[refName]);
  //     const node = React.findNodeHandle( self.refs.scroll.refs.scrollView )
  //     setTimeout(()=> {
  //         if (!handle) return;
  //         UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
  //             UIManager.measure(node, (xx, yy, wwidth, hheight, ppageX, ppageY) => {
  //                 console.log("Scroll", hheight, pageY, ppageY);
  //
  //                 let pos = pageY - ppageY
  //                 console.log("pos, gap, ppageY+pos", pos, ppageY +pos, pageY-pos);
  //                 pos = pageY - pos > 0 ? pageY-pos : 0 ;
  //               //   pos = ppageY + pos;
  //               //   if (pageY > 300) {
  //               //       if (ppageY < 0) {
  //               //           pos = (-1 * ppageY) + 133 + 200
  //               //       } else {
  //               //           pos = 0
  //               //       }
  //                     self.refs.scroll.refs.scrollView.scrollTo({y:pos});
  //               //   }
  //               //   let pos = pageY < 300 ? 0 : 200;
  //
  //             });
  //
  //
  //           //   let slf = self;
  //           // //   debugger;
  //           //   console.log("KH", x, y, width, height, pageX, pageY, dh);
  //           //   let pos = pageY < 400 ? pageY-200 : pageY-150;
  //           //   self.refs.scroll.refs.scrollView.scrollTo({y:pos});
  //         });
  //
  //
  //     },50);
  //   //   let scrollResponder=this.refs.scrollView.getScrollResponder();
  //   //   scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
  //   //     React.findNodeHandle(_this.refs[refName]),
  //   //     this.props.offset, //additionalOffset
  //   //     true
  //   //   );
  //   // }, 50);
  // }
}) // KeyboardHandler

module.exports=KeyboardHandler;
