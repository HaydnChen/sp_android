const React = require('react-native');
const Overlay = require('react-native-animatable-overlay');

const {
  Dimensions,
  StyleSheet,
  Component,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ScrollView,
  WebView
} = React;

import _ from "lodash";
import moment from "moment";
import Button from 'apsl-react-native-button';
import WebViewBridge from 'react-native-webview-bridge';

const dh = Dimensions.get('window').height;
const dw = Dimensions.get('window').width;
var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;
var SignatureCapture = require('react-native-signature-capture');
var crypto = require('crypto-js');
var pako = require('pako');

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
            canvas.width="100";
            canvas.height="100";
            ctx.scale(0.5,0.5); // make it smaller
          ctx.drawImage(img,0,0);
          var dataURL=watermarkedDataURL(canvas, "eBaoTech - " + (new Date()).toString().substr(0,21));
          //alert("dataUrl result" + dataURL);
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
    tempCtx.font="20px verdana";
    var textWidth=tempCtx.measureText(text).width;
    // var compWidth=tempCtx.measureText(comp).width;
    tempCtx.globalAlpha=.50;
    tempCtx.fillStyle='white'
    // tempCtx.fillText(text,(cw-textWidth-10)/2,ch-20);
    tempCtx.fillText(text,(10),ch-20);
    // tempCtx.fillText(comp,(cw-compWidth-10)/2,ch-80);
    tempCtx.fillStyle='black'
    //tempCtx.fillText(text,(cw-textWidth-10)/2+2,ch-20+2);
    tempCtx.fillText(text,(10)+2,ch-20+2);
    // tempCtx.fillText(comp,(cw-compWidth-10)/2+2,ch-80+2);
    // just testing by adding tempCanvas to document
    // document.body.appendChild(tempCanvas);
    return(tempCanvas.toDataURL());
  }


`;



export default class SignatureView extends Component {
  constructor(props) {
    super(props);
    this.uistate = require("../../state");
    this.state = {}
  }

  closeModal(data){
    //   console.log("SignatureView.closeModal ..... close the pdf modal");
    let signer = this.uistate.get().quote.signatory,
        newState = {
            show_signature : false,
            slidemenu : true,
        }
        // if (data) debugger;
        if ( data ) {
            // data = pako.deflate( dbstring, {to:'string'});
            if (signer === 'owner') {
                newState.signatureOwner = data;
                let input = this.props.prepareInput(),
                    string = JSON.stringify( input.inputjson ) + data.substr(data.length-100);
                newState.hash_owner = crypto.SHA256(string).toString();
                // console.log("signatureView--->sigOwner", data.substr(data.length-10), data.length)
            }
            if (signer === 'agent' ) {
                newState.signatureAgent = data;
                let input = this.props.prepareInput(),
                    string = JSON.stringify( input.inputjson ) + data.substr(data.length-100);
                newState.hash_agent = crypto.SHA256(string).toString();
            }
            newState.tempSignature = null;
        } else {
            if (signer === 'owner') {
                newState.signatureOwner = this.uistate.get().quote.tempSignature;
            } else {
                newState.signatureAgent = this.uistate.get().quote.tempSignature;
            }

        }
      console.log("signatureView, newState", newState)
      this.uistate.get().quote.set( newState ).now();
  }

  render() {
    const { show, result } = this.props;
    // const pageX = pageY = positionX = 0;
    /*
            <Overlay visible={true} onPress={()=> {} }
                    style={{backgroundColor:'transparent'}}> */


    // debugger;
    return (
    	<View style={{justifyContent:'flex-start'}}>

            <View style={{top:-dh, backgroundColor:'green'}}>
                <TouchableWithoutFeedback style={styles.containerxx} onPress={()=> this.closeModal() }>
                    <View style={[styles.overlay, {width:dw, height:dh}]}  >
                        <Text>Overlay</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>


           <View style={{alignItems:'center', backgroundColor : 'white', top: -(dh)}}>

                                <View style={{marginTop:20, marginLeft: 10, marginRight:10, backgroundColor:'#ffff00',
                                    justifyContent: 'center',  top: 250, width: dw-60, height: dh-250 }} >


                                    <SignatureCapture
                                        rotateClockwise={false}
                                        square={false}
                                        onSaveEvent={(data) => this.onSaveSignature(data)}/>


                            </View>
                </View>

                <View  style={{backgroundColor:'white', height:100, width:100}} >
                    <WebViewBridge
                            ref="webview"
                            onBridgeMessage={(data) => this.onBridgeMessage(data)}
                            injectedJavaScript={injectScript}
                            source={{html:'<html><head></head><body><canvas id="canvas" style="width:100; height:100"></canvas></body></html>'}} />
                </View>


                </View>
    );
  }
  onBridgeMessage(msg) {
      let data = msg.split('base64,');
      if (data.length === 2) {
          this.closeModal(data[1])
      } else {
          this.closeModal()
      }
  }
  // componentDidMount() {
  //     setTimeout(() => {
  //       this.refs.webview.sendToBridge("hahaha");
  //       }, 1000);
  // }
  onSaveSignature(data){
    //   this.closeModal(data.encoded);
      this.refs.webview.sendToBridge(data.encoded)


    //   console.log(data, '*******saved signature')
  }
}

SignatureView.propTypes = {
};

SignatureView.defaultProps = {
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
    backgroundColor: 'transparent',
    // backgroundColor: 'yellow',
    width: dw,
    height: dh
  },
});
