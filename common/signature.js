const React = require('react-native');
const {
  Dimensions,
  StyleSheet,
  Component,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  WebView
} = React;

import _ from "lodash";
import moment from "moment";
import Button from 'apsl-react-native-button';
import WebViewBridge from 'react-native-webview-bridge';

const dh = Dimensions.get('window').height;
const dw = Dimensions.get('window').width;
var SignatureCapture = require('react-native-signature-capture');

const injectScript = `
  function webViewBridgeReady(cb) {
    //checks whether WebViewBirdge exists in global scope.
    if (window.WebViewBridge) {
      cb(window.WebViewBridge);
      return;
    }

    function handler() {
      //remove the handler from listener since we don't need it anymore
      document.removeEventListener('WebViewBridge', handler, false);
      //pass the WebViewBridge object to the callback
      cb(window.WebViewBridge);
    }

    //if WebViewBridge doesn't exist in global scope attach itself to document
    //event system. Once the code is being injected by extension, the handler will
    //be called.
    document.addEventListener('WebViewBridge', handler, false);
  }

  webViewBridgeReady(function (webViewBridge) {
    webViewBridge.onMessage = function (message) {
        var result = watermark(message);
        //webViewBridge.send(result);
    };
  });

  // end of code for the bridge some code to handle watermarking
  function watermark(base64Image) {
      var canvas=document.getElementById("canvas");
      var ctx=canvas.getContext("2d");
      var cw=canvas.width;
      var ch=canvas.height;

      var img=new Image();
      img.crossOrigin='anonymous';
      img.onload=function() {
        //   canvas.width=img.width;
        //   canvas.height=img.height;
          canvas.width=cw;
          canvas.height=ch;
          ctx.scale(0.5,0.5); // make it smaller
          ctx.drawImage(img,0,0);
          var dataURL=watermarkedDataURL(canvas, "eBaoTech - " + (new Date()).toString().substr(0,21));
          WebViewBridge.send(dataURL);
      }
      img.src="data:image/png;base64," + base64Image ;
  }
  function watermarkedDataURL(canvas,text){
    var tempCanvas=document.createElement('canvas');
    var tempCtx=tempCanvas.getContext('2d');
    var cw,ch;
    cw=tempCanvas.width=canvas.width;
    ch=tempCanvas.height=canvas.height;
    tempCtx.drawImage(canvas,0,0);
    tempCtx.font="12px verdana";
    var textWidth=tempCtx.measureText(text).width;
    tempCtx.globalAlpha=.50;
    tempCtx.fillStyle='white'
    tempCtx.fillText(text,(10),ch-20);
    tempCtx.fillStyle='black'
    tempCtx.fillText(text,(10)+2,ch-20+2);
    return(tempCanvas.toDataURL());
  }


`;

export default class Signature extends Component {
  constructor(props) {
    super(props);
    this.uistate = require("../state"); // global state
    this.state = {saved:false}
  }

  render() {

    return (
    	<View style={{justifyContent:'center', backgroundColor:'transparent'}}>

           <View style={{alignItems:'center', backgroundColor : 'white'}}>

                    <View style={{marginTop:20, marginLeft: 20,
                        justifyContent: 'center',  top: 0, width: dw-100, height: dh-250 }} >

                        <SignatureCapture
                            rotateClockwise={true}
                            square={true}
                            onSaveEvent={(data) => this.onSaveSignature(data)}/>


                    </View>
            </View>
            {/* put in a webview for doing some processing (watermark) in javascript using canvas object */}

            <View  style={{backgroundColor:'transparent', paddingTop:100 , height:100, width:100}} >
                <WebViewBridge
                        ref="webview"
                        onBridgeMessage={(data) => this.onBridgeMessage(data)}
                        injectedJavaScript={injectScript}
                        source={{html:'<html><head></head><body><canvas id="canvas" style="width:100; height:100"></canvas></body></html>'}} />
            </View>


        </View>
    );
  }
  // componentDidMount(){
  //     let state = this.uistate.get().quote;
  //     if (this.props.data.tempQuoteSignature) {
  //
  //         setTimeout(() => {
  //             console.log("Signature --> setting tempSignature");
  //             let data = this.props.data.tempQuoteSignature;
  //             console.log("signature--->sigOwner", data.substr(data.length-100), data.length)
  //             if (this.props.data.role === 'owner' ) {
  //                 state.set({signatureOwner: this.props.data.tempQuoteSignature})
  //             } else {
  //                 state.set({signatureAgent: this.props.data.tempQuoteSignature})
  //             }
  //
  //         },2000)
  //     }
  // }
  onSaveSignature(data){

      this.refs.webview.sendToBridge(data.encoded); // send to webview to enhance with watermark

  }
  componentWillUnmount() {
    //   console.log("Signature.componentWIllUmount, value for saved", this.state.saved)
      if (!this.state.saved) {
        //   console.log("Signature.componentWIllUmount ---> restoring signature")
          let state = this.uistate.get().quote;
          if (this.props.data.role === 'owner' ) {
              state.set({signatureOwner: this.props.data.tempQuoteSignature})
          } else {
              state.set({signatureAgent: this.props.data.tempQuoteSignature})
          }
      }

  }
  onBridgeMessage(msg) {
      // back from the webview , image now has a watermark
      let data = msg.split('base64,');
      if (data.length === 2) {
          if (this.props.data.onSaveSignature) {
              this.props.data.onSaveSignature(data[1], this.props.data.role)
          }
      }
      this.setState({saved:true})
      this.props.toBack();
  }
}

Signature.propTypes = {
};

Signature.defaultProps = {
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor : 'blue'
  },
  overlay: {
    position: 'absolute',
    // backgroundColor: 'transparent',
    backgroundColor: 'yellow',
    width: dw*2,
    height: dh*2
  },
});
