const React = require('react-native');
const Overlay = require('./overlay');
const Items = require('./items');

// yc imported Overlay2 & VibrancyView (not used)
const Overlay2 = require('react-native-animatable-overlay');
//const VibrancyView = require('react-native-blur').VibrancyView;

const {
  Dimensions,
  StyleSheet,
  Component,
  View,
  TouchableWithoutFeedback
} = React;

const window = Dimensions.get('window');

class OptionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,

      width: 0,
      height: 0,

      pageX: 0,
      pageY: 0,

      positionX: 0,
      positionY: 0,

      items: [],
      onSelect: () => { }
    };
  }

  _currentPosition(pageX, pageY) {
    // let x = pageX > window.width ? pageX % window.width : pageX ,
    //     y = pageY > window.height ? pageY % window.height : pageY ;
    // console.log("#####Optionlist updated position", pageX, pageY, window.width, window.height );
    this.setState({
      ...this.state,
      pageX,
      pageY
    });
  }

  _show(items, positionX, positionY, width, height, onSelect) {
    positionX = positionX - this.state.pageX;
    positionY = positionY - this.state.pageY;

    this.setState({
      ...this.state,
      positionX,
      positionY,
      width,
      height,
      items,
      onSelect,
      show: true
    });
  }

  _onOverlayPress() {
    const { onSelect } = this.state;
    onSelect(null, null);
	//console.log("onOverlayPress", onSelect );
    this.setState({
      ...this.state,
      show: false
    });
  }

  _onItemPress(item, value) {
    const { onSelect } = this.state;
    onSelect(item, value);
	//console.log("onItemPress", onSelect);
    this.setState({
      ...this.state,
      show: false
    });
  }

  render() {
    const {
      items,
      pageX,
      pageY,
      positionX,
      positionY,
      width,
      height,
      show
    } = this.state;

  var dh = Dimensions.get('window').height;
  var w = Dimensions.get('window').width / 2 ;
	var h = dh / 2 ;
  // debugger;

	// yc changed to use Overlay2

    return (
    	<View >

          <Overlay
            pageX={pageX+positionX}
            pageY={pageY}
            show={show}
            style={{height:2*dh, width:2*w} }
            onPress={ this._onOverlayPress.bind(this) } />

      		<Overlay2 visible={show}
            style={{backgroundColor:'transparent'}}>
  			        <Items
      	    		  items={items}
          			  width={width}
  		    	      height={height+10}
            			  positionX={pageX+width}
  		      	      positionY={pageY-height}
  		        	    show={show}
  		              onPress={ this._onItemPress.bind(this) }/>
  		    </Overlay2>
      </View>
    );


    // let px = pageX > dh ? pageX % dh : pageX
    // let position = this.props.position ? this.props.position : 'right';
    // let [ppx, ppy] = [positionX,positionY]
    //
    // if (position === 'bottom'){
    //   ppx = px - 100;
    //   ppy = positionY + height;
    //
    // }
    // console.log("pageX, pageY, width, height,positionX, positionY", pageX, pageY, width, height,positionX, positionY);
    // return (
    //   <View>
    //     <Overlay
    //       pageX={pageX+positionX}
    //       pageY={pageY}
    //       show={show}
    //       onPress={ this._onOverlayPress.bind(this) } />
    //
    //     <Items
    //       items={items}
    //       positionX={positionX-250}
    //       positionY={positionY+40}
    //       width={width}
    //       height={height+10}
    //       show={show}
    //       onPress={ this._onItemPress.bind(this) }/>
    //
    //   </View>
    // );
    //
    // return (
    //   <View>
    //     <Overlay
    //       pageX={px}
    //       pageY={pageY}
    //       show={show}
    //       onPress={ this._onOverlayPress.bind(this) }/>
    //     <Items
    //       items={items}
    //       positionX={positionX}
    //       positionY={positionY}
    //       width={width}
    //       height={height}
    //       show={show}
    //       onPress={ this._onItemPress.bind(this) }/>
    //   </View>
    // );


  }
}

OptionList.propTypes = {

};

OptionList.defaultProps = {

};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});


module.exports = OptionList;
