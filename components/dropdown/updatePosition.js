const React = require('react-native');

const {
  NativeModules: {
    UIManager,
  },
  Dimensions

} = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

module.exports = function (ref, debug=false, position='right', wid=200, hgt=30) {
  const handle = React.findNodeHandle(ref);
  setTimeout(() => {

    if (!handle) return;

    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      let xx = pageX > deviceHeight ? pageX % deviceHeight : pageX,
          yy = pageY > deviceHeight ? pageY % deviceHeight : pageY;

      // if (debug) {
        // console.log(x, y, width, height, pageX, pageY, position, deviceHeight, deviceWidth, xx-wid, pageY+y );
    //   }

      if (position === 'right') {
	      ref._currentPosition(xx, yy);
	  } else if (position === 'top'){
	  	  ref._currentPosition(xx-wid, yy - ( y + (hgt*4) - 20 ));
	  } else if (position === 'bottom'){
          ref._currentPosition(xx-wid, yy+y);

	  } else if (position === 'left') {
	      // console.log("updatePosition --> pageX, width, ref", xx, width, ref.state.width);
	  	  ref._currentPosition(xx-(wid*2), yy);
	  }
    });
    }, 0);
};
