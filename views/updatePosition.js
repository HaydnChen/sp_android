const React = require('react-native');

const {
  NativeModules: {
    UIManager,
  },
  Dimensions

} = React;

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;


module.exports = function (ref, debug=false, position='right', wid=200, hgt=40) {
  const handle = React.findNodeHandle(ref);
  setTimeout(() => {
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      if (debug) {
        console.log(x, y, width, height, pageX, pageY, position, deviceHeight, deviceWidth);
      }
      let xx = pageX > deviceHeight ? pageX % deviceHeight : pageX ;

      if (position === 'right') {
	      ref._currentPosition(xx, pageY);
	  } else if (position === 'top'){
	  	  ref._currentPosition(xx-wid, pageY-( y + (hgt*4) + 10 ));
	  } else if (position === 'bottom'){
	  	  ref._currentPosition(xx-wid, pageY+hgt+y);

	  } else if (position === 'left') {
	      // console.log("updatePosition --> pageX, width, ref", xx, width, ref.state.width);
	  	  ref._currentPosition(xx-(wid*2), pageY);
	  }
    });

  }, 0);
};
