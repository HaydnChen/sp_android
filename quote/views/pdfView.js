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
  ListView,
  WebView
} = React;

import _ from "lodash";
import moment from "moment";
import Button from 'apsl-react-native-button';

const dh = Dimensions.get('window').height;
const dw = Dimensions.get('window').width;
var formatNumber = (number,dp=0) => numeral(number).format("0,0" + ( dp > 0 ? "." + Array(dp+1).join('0') : '' )) ;

export default class PdfView extends Component {
  constructor(props) {
    super(props);
    this.uistate = require("../../state");
    this.state = {}
  }

  closeModal(){
      console.log("PDFView.closeModal ..... close the pdf modal");
      this.uistate.get().quote.set({show_pdf:false}).now();
  }

  componentDidMount(){
    //   debugger;
  }

  render() {
    const { show, result } = this.props;
    // const pageX = pageY = positionX = 0;
    // let result = this.props.result;
    let pdfPath = 'file://' + this.uistate.get().quote.pdf_path;
    // console.log("pdfPath", pdfPath);
    // debugger;
    // url={pdfPath}

    return (
    	<View style={{justifyContent:'center'}}>

               <View style={{alignItems:'center'}}>
              		<Overlay visible={true} onPress={()=> {} }
                            style={{backgroundColor:'transparent'}}>

                                <View style={{marginTop:20, marginLeft: 20, backgroundColor:'#ffffee',
                                    justifyContent: 'center',  width: dw-40}} >

                                    {/* put the pdf link here */}

                                    <WebView
                                              ref="webview"
                                              automaticallyAdjustContentInsets={false}
                                              style={styles.webView}
                                              source={{uri:pdfPath}}
                                              javaScriptEnabled={true}
                                              domStorageEnabled={true}
                                              decelerationRate="normal"
                                              startInLoadingState={false}
                                              scalesPageToFit={true}
                                            />

                                    <View style={{flexDirection:'row', justifyContent: 'center'}} >
                                        <Button textStyle={{color:"white", fontSize:16}}
                                            style={{ width:dw/2, height:35, marginTop: 10, marginBottom:10,
                                                backgroundColor:"#3fb1ee", borderWidth:0 }}
                                            onPress={()=>this.closeModal() } isDisabled={false} >
                                                      Close
                                        </Button>
                                    </View>


                                </View>
          		    </Overlay>
                </View>
      </View>
    );
  }
}

PdfView.propTypes = {
};

PdfView.defaultProps = {
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
    backgroundColor: 'transparent',
    // backgroundColor: 'gray',
    width: dw,
    height: dh
  },
  webView: {
   backgroundColor: '#F8FFF0',
   height: dh-100,
 },
  section: {
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'flex-start',
       padding: 2,
      //  backgroundColor: '#2196F3'
       backgroundColor: '#0296c3'
   },
   sectionText: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 2,
      backgroundColor: '#FFFFFF',
    },
    rowEven: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 2,
      backgroundColor: '#F0F8FF',
    },
    separator: {
      height: 1,
      backgroundColor: '#CCCCCC',
    },



});
