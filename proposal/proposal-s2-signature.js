'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Animated,
  ListView,
  Image,
  ScrollView,
  AlertIOS
} = React;

import _ from "lodash";
import moment from "moment"
import Button from 'apsl-react-native-button';
import * as Custom from  "../form/localComponents";
import * as utils from "../common/utils"
import Signature from "../common/signature";
var dw = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;
var crypto = require('crypto-js');
import Camera from 'react-native-camera';
var RNFS = require('react-native-fs');

var ActionButtonItem = require('../components/ActionButtonItem');
var Icon = require('react-native-vector-icons/FontAwesome'),
    t = require('tcomb-form-native'),
    localstyles = require("../localStyles");

var formstyles = _.clone(localstyles,true);
formstyles.formGroup.normal.flexDirection = 'row';
formstyles.formGroup.error.flexDirection = 'row';
t.form.Form.i18n = {
  optional: '',
  required: ' *' // inverting the behaviour: adding a postfix to the required fields
};
var Form = t.form.Form;

var modelFactory = (self) => {
    let mapp = {
        phIdentification : t.Boolean,
        laIdentification : t.Boolean,
        creditCard : t.Boolean,
        fna : t.Boolean,
        signLocation : t.String,
        phSig : t.maybe(t.String),
        laSig : t.maybe(t.String),
        guardianSig : t.maybe(t.String),
        agentSig : t.maybe(t.String)
     }
    var viewModel = t.struct(mapp);
    return viewModel
}
var optionsFactory = (self)  => {
    let options = {
        template : layout(self),
        auto : 'none',
        fields : {
            phIdentification: {factory: Custom.LocalCheckbox},
            laIdentification: {factory: Custom.LocalCheckbox},
            creditCard: {factory: Custom.LocalCheckbox},
            signLocation : {onFocus: () => utils.kbHandler(self,"signLocation","container","form",150) },
            fna: {factory: Custom.LocalCheckbox},
            phSig : {factory: Custom.Hidden},
            agentSig : {factory: Custom.Hidden},

        }
    }
    return options
}

var layout = (self) => {
    let tmpl = (locals) => {
        let inputs = locals.inputs;
        let photos = self.uistate.get().proposal.s2.signature.photos || {};

        return (
            <View style={{height: dh/2, flex:1, flexDirection:'column', justifyContent:'flex-start'}} >
                {/* Checklist questions & signature */}
                <View style={{flexDirection:'row', flex: 0.1, justifyContent:'flex-start', paddingBottom:10, paddingTop:10}} >
                    <View style={{flex:0.7, width:(dw*0.85)/2}}>
                        <Text style={styles.text}>Copy of poicyholder identification </Text>
                    </View>

                    <View style={{flex:0.15}}>
                        {inputs.phIdentification}
                    </View>

                    <View style={{flex:0.15}}>
                        <Icon.Button name="edit" backgroundColor="#3498db" onPress={()=>self.takePhoto("phId")} >
                            Take Photo
                        </Icon.Button>
                    </View>

                    <View style={{flex:0.15, paddingLeft:20}}>
                        <Image style={{width: 150, height: 60, resizeMode: Image.resizeMode.cover,
                        padding:0, margin: 0}} source={{ uri: photos['phId'] }} ></Image>
                    </View>

                </View>


                <View style={styles.separator} />
                <View style={{flexDirection:'row', flex: 0.1, paddingBottom:10, paddingTop:10}} >
                    <View style={{flex:0.7, width:(dw*0.85)/2, marginBottom:5, paddingBottom:5}}>
                        <Text style={styles.text}>Copy of life assured identification </Text>
                    </View>
                    <View style={{flex:0.15}}>
                        {inputs.laIdentification}
                    </View>
                    <View style={{flex:0.15}}>
                        <Icon.Button name="edit" backgroundColor="#3498db" onPress={()=>self.takePhoto("laId")} >
                            Take Photo
                        </Icon.Button>
                    </View>
                    <View style={{flex:0.15, paddingLeft:20}}>
                        <Image style={{width: 150, height: 60, resizeMode: Image.resizeMode.cover,
                        padding:0, margin: 0}} source={{ uri: photos['laId'] }} ></Image>
                    </View>

                </View>

                <View style={styles.separator} />
                <View style={{flexDirection:'row', flex: 0.1, paddingBottom:10, paddingTop:10}} >
                    <View style={{flex:0.7, width:(dw*0.85)/2}}>
                        <Text style={styles.text}>Copy of credit card </Text>
                    </View>
                    <View style={{flex:0.15}}>
                        {inputs.creditCard}
                    </View>
                    <View style={{flex:0.15}}>
                        <Icon.Button name="edit" backgroundColor="#3498db" onPress={()=>self.takePhoto("creditCard")} >
                            Take Photo
                        </Icon.Button>
                    </View>
                    <View style={{flex:0.15, paddingLeft:20}}>
                        <Image style={{width: 150, height: 60, resizeMode: Image.resizeMode.cover,
                        padding:0, margin: 0}} source={{ uri: photos['creditCard'] }} ></Image>
                    </View>

                </View>

                <View style={styles.separator} />
                <View style={{flexDirection:'row', flex: 0.1, paddingBottom:10, paddingTop:10}} >
                <View style={{flex:0.7, width:(dw*0.85)/2}}>
                        <Text style={styles.text}>Copy of financial needs analysis </Text>
                    </View>
                    <View style={{flex:0.15}}>
                        {inputs.fna}
                    </View>
                    <View style={{flex:0.15}}>
                        <Icon.Button name="edit" backgroundColor="#3498db" onPress={()=>self.takePhoto("fna")} >
                            Take Photo
                        </Icon.Button>
                    </View>
                    <View style={{flex:0.15, paddingLeft:20}}>
                        <Image style={{width: 150, height: 60, resizeMode: Image.resizeMode.cover,
                        padding:0, margin: 0}} source={{ uri: photos['fna'] }} ></Image>
                    </View>

                </View>

                {/* we now need a row for the location where the signatures are done */}
                <View style={styles.separator} />
                <View style={{flexDirection:"row", flex: 0.1, paddingBottom:10, paddingTop:10 }}>
                    <View style={{flex:0.5}}><Text style={styles.text}>Ditandatangani di</Text></View>
                    <View style={{flex:0.5, paddingLeft:10 }}>{inputs.signLocation}</View>
                </View>

            </View>
        );
    }
    return tmpl
}

const TAG="ProposalS2SignatureView.";
export default class ProposalS2SignatureView extends React.Component {
  constructor(props){
    super(props);
    this.uistate = require("../state");
    this.state = {showCamera : false, currentPhotoKey : null }
    this.formChange = _.debounce(this.onFormChange.bind(this), 300);

  }

  onFormChange(raw, path){
      //presumably, no validation required, we just save the values, in reality, may need to filter this
      let uistate = this.uistate;
      let fname = path[0];
      let questions = ['phIdentification', 'laIdentification', 'creditCard','fna','signLocation', 'phSig', 'agentSig']
      if (questions.indexOf(fname) >= 0 ) {
          this.uistate.get().proposal.s2.ui.set({refresh:false}).now()
          let mapp = {};
          _.forEach(questions,(q) => { mapp[q] = raw[q] } );
          this.uistate.get().proposal.s2.signature.set(mapp).now()
          console.log(TAG+"onFormChange---> uistate", this.uistate.get().proposal.s2.signature);
          let vals = {refresh:true}
          this.uistate.get().proposal.s2.ui.set(vals).now();
      }
  }
  alert(msg=null, title="Error") {
      let message = msg ? msg : 'Please fix the errors, before moving to the next view'
      AlertIOS.alert(
        title,
        message,
        [
          {text:'OK', onPress : (txt) => console.log(txt)}
        ],
      );
  }
  saveProposal(){
      let values = this.refs.form.getValue()
      if (!values) {
          this.alert('Please fix errors and try saving again');
          return
      }
      // later ::TODO::
    //   debugger;

      this.props.fns.saveProposal()

  }
  flatten(data) {

      var fn = function(parent, oo) {
          var result = [];
          var reslist=[];
          var res, sorted, sorted2
          // console.log("processing object", oo)
          var arrfn = function(parent,arr) {
              var templist = [], res, wlist=[];
              var sorted2 = _.sortBy(arr);
              sorted2.forEach(function(item,index){
                  var newkey = parent + '>' + index ;
                  if (_.isArray(item)) {
                      res = arrfn(newkey, item)
                  } else if (_.isPlainObject(item)) {
                      res = fn(newkey , item)
                  } else {
                      res = [ newkey + ':' + item]
                  }
                  res.forEach( function(i) {
                      templist.push(i)
                  })
              })
              return templist;
          }

          _.forOwn(oo, function(value,key)  {
              var newkey = parent + '>' + key ;
              if ( _.isArray(value)) {
                  reslist = arrfn(newkey, value);

                  result = result.concat(reslist)

              } else if (_.isPlainObject(value)) {
                  var keys=[], values=[], sortedkeys=[];
                  sorted = _.sortBy( _.keys(value));
                  // console.log("value is object *** ", value, key, newkey, sorted)

                  let wlist = [];
                  sorted.forEach(function(kkk){

                      if (_.isArray(value[kkk])) {
                          res = arrfn(newkey + '>' + kkk , value[kkk])
                        //   console.log("result from arrfn", res);

                      } else if (_.isPlainObject(value[kkk])) {
                          // console.log("Calling another object, newkey", newkey, value[kkk])
                          res = fn(newkey + '>' + kkk , value[kkk])
                      } else {
                          res = [ newkey + '>' + kkk + ':' + value[kkk]]
                      }
                      // console.log("value is object ---> , res for ", kkk , res);
                      res.forEach( function(i) {
                          wlist.push(i)
                      })
                      // wlist.push(newkey +  res);
                  });
                  result = result.concat(wlist)

              } else {
                  // console.log("value is normal", newkey, value)
                  result.push( newkey + ':' + value)

              }

          })
          return result
      }
    //   debugger;
      let workdata = fn('',data);
      workdata = _.sortBy(workdata);
      workdata = workdata.join('~')
      return workdata;


  }
  getHashData(){
      // ideally this should be in the 'smart' component i.e. proposal-s2-home, but for now....

      let s1 = _.omit( this.uistate.get().proposal.s1, ['ui'])
      let s2 = _.omit( this.uistate.get().proposal.s2, ['ui','signature'])
      let data = _.assign({}, s1,s2);
      // do somethings to ensure consistency in the sequence of the hash data
      let flatdata = this.flatten(data);
    //   debugger;
    //   console.log(TAG+"getHashData---> flatdata",flatdata);
      return flatdata;
  }
  takePhoto(key){
      console.log(TAG + "takePhone --> key", key);
      this.setState({showCamera:true, currentPhotoKey:key})


  }

  componentWillUnmount(){
      // clean up & delete jpg files
      console.log(TAG+"componentWillUnmount --> cleaning up jpg files")
      var path = RNFS.DocumentDirectoryPath;
      RNFS.readDir(path).then((files) => {
          _.forEach(files, (file) => {
              const { name, path, size } = file;
              if (name.endsWith(".jpg")) {
                  // now we delete them
                  RNFS.unlink(path).then((result) => {
                      console.log("Deletion of file ", name, result)
                  })
              }
          })
      })
      .catch((err) => {
          console.error("Error in reading/deleting files", err)
      })


  }


  render(){
    Form.stylesheet = formstyles;

    let row = Object.assign( {},this.uistate.get().proposal.s2_defaults.signature,
                                this.uistate.get().proposal.s2.signature);


    // let sigPh = this.uistate.get().proposal.s2.signature.phSig,
    //     sigAgent = this.uistate.get().proposal.s2.signature.agentSig,
    //     hashPh = this.uistate.get().proposal.s2.signature.phHash,
    //     hashAgent = this.uistate.get().proposal.s2.signature.agentHash,
    //     uriPh = sigPh ? 'data:image/png;base64,' + sigPh : '',
    //     uriAgent = sigAgent ? 'data:image/png;base64,' + sigAgent : '';

    let sigPh = row.phSig,
        sigAgent = row.agentSig,
        hashPh = row.phHash,
        hashAgent = row.agentHash,
        uriPh = sigPh ? 'data:image/png;base64,' + sigPh : '',
        uriAgent = sigAgent ? 'data:image/png;base64,' + sigAgent : '';

    let newPhHash, newAgentHash;

    if (sigPh || sigAgent) {
        let hashdata ;
        if (sigPh) {
            hashdata = this.getHashData()  + sigPh.substr(sigPh.length-100);
            newPhHash = crypto.SHA256(hashdata).toString();
        }
        if (sigAgent){
            hashdata = this.getHashData() + sigAgent.substr(sigAgent.length-100);
            newAgentHash = crypto.SHA256(hashdata).toString();
        }
    }


    let validPhSig = hashPh === newPhHash,
        validAgentSig = hashAgent === newAgentHash,
        iheight = 80;


    if (sigAgent) console.log("SignAgent last 100 bytes & length ", sigAgent.substr(sigAgent.length-100), newAgentHash, sigAgent.length )

    let agentX =  ( validAgentSig ? <View style={{height:30}} /> : <Icon name="times" color="red" size={30} /> ),
        phX =  ( validPhSig ? <View style={{height:30}} /> : <Icon name="times" color="red" size={30} /> );

    let imagePh = sigPh ?  <View style={{flexDirection:'row'}}>
                                            {phX}
                                            <Image style={{width: 150, height: iheight, resizeMode: Image.resizeMode.cover,
                                            padding:0, margin: 0}} source={{ uri: uriPh }} ></Image>
                                            </View>
                             : <View style={{height: iheight }} /> ;


    let imageAgent = sigAgent ? <View style={{flexDirection:'row'}}>
                                        {agentX}
                                        <Image style={{width: 150, height: iheight, resizeMode: Image.resizeMode.cover,
                                         padding:0, margin: 0}} source={{uri: uriAgent}}></Image>
                                         </View>
                                : <View style={{height: iheight  }} /> ;



    return (
       <View style={{flexDirection:'column', justifyContent:'flex-start', paddingBottom:0, marginBottom:0}}>

         { !this.state.showCamera ?
              <View style={{flexDirection: 'row' , paddingLeft: 20}}>
                  <View style={[styles.container]}>
                      <ScrollView ref="container" style={{paddingBottom: 1}}>
                              <Form style={{flexDirection:"column", flex: 1}}
                                ref={"form"}
                                type={modelFactory(this)}
                                options={optionsFactory(this)}
                                value={ row }
                                onChange={(raw, path)=> this.formChange(raw,path)}
                              />

                              {/* display the signatures here */}
                              <View style={{flexDirection:'row', justifyContent:'flex-start', paddingTop:10}}>
                                  <View style={{paddingLeft:50, paddingRight:50}}>

                                      { imagePh }
                                      <Text style={styles.text}>Policyholder</Text>
                                      <Icon.Button name="edit" backgroundColor="#3fb1ee" onPress={()=> this.signature("ph")} >
                                          Tap to sign
                                      </Icon.Button>

                                  </View>

                                  <View style={{paddingLeft:50, paddingRight:50}}>

                                      { imageAgent }
                                      <Text style={styles.text}>Intermediary</Text>
                                      <Icon.Button name="edit" backgroundColor="#3fb1ee" onPress={()=>this.signature("agent")} >
                                          Tap to sign
                                      </Icon.Button>

                                  </View>

                              </View>

                            {/* end of signatures */}

                      </ScrollView>
                  </View>
              </View>

              : <View /> }

              {/* put in an action button */}
              <View ref="actionButton" style={[styles.overlay],{left:((dw*0.85)-80), top:-100}}>
                <TouchableOpacity activeOpacity={0.5} onPress={()=> this.saveProposal()}
                  style={{}}>
                  <View style={[styles.actionButton,
                    {
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: '#3498db',

                    }
                  ]}>
                  <Icon name={'check'} size={30} color={'white'} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* do we show the camera ? */}
              { this.state.showCamera ?
                  <Camera
                    ref={(cam) => {
                      this.camera = cam;
                    }}
                    captureTarget={Camera.constants.CaptureTarget.disk}
                    captureQuality={Camera.constants.CaptureQuality.low }
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}>
                    <View style={styles.buttonBar}>
                            <TouchableHighlight style={styles.button} onPress={()=> this.capturePhoto()}>
                                <Text style={styles.buttonText}>Capture</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.button} onPress={() => this.closeCamera()}>
                                <Text style={styles.buttonText}>Exit</Text>
                            </TouchableHighlight>
                        </View>
                  </Camera>
                :  <View />

              }


       </View>

    );
  }
  capturePhoto() {
      var self = this;
      this.camera.capture()
        .then((data) => {
            RNFS.readFile(data,'base64').then((buf) => {

                // console.log("read phone file as base64", buf.length, buf.substr(0,100))
                RNFS.unlink(data).then((result) => {
                    // cleaned file
                })

                let photo = 'data:image/jpg;base64,' + buf;
                let photos = self.uistate.get().proposal.s2.signature.photos ? self.uistate.get().proposal.s2.signature.photos.toJS() : {},
                    key = self.state.currentPhotoKey;
                photos[key] = photo;

                // console.log(TAG+"capturePhoto---> key", key, photo.length)
                self.uistate.get().proposal.s2.ui.set({refresh:false});
                self.uistate.get().proposal.s2.signature.set({photos:photos});
                self.setState({currentPhotoKey:null});

                // show a thumbnail of the image

            })
            .catch((err) => {
                console.log("Unable to process file", err)
            })

            console.log("*******", data.length, data, this.state.currentPhotoKey )
            // more processing later on -- one step at a time
            this.setState({showCamera:false})
        })
        .catch(err => console.error("*******ERROR " , err));


  }

  closeCamera() {
      this.setState({showCamera:false, currentPhotoKey:null})
  }

  onSaveSignature(sig, role) {
      // save this into the correct placeholders
      this.flatData = this.getHashData()
      let hashdata = this.flatData + sig.substr(sig.length-100) ,
          hash = crypto.SHA256(hashdata).toString();
      console.log(TAG+"onSignatureSave ---> role", role, sig.substr(sig.length-100), hash);

      this.tempSigAgent = null;
      this.tempSigPh = null;
      if (role === 'ph') {
          this.uistate.get().proposal.s2.signature.set({phSig: sig, phHash : hash})
      } else if (role === 'agent') {
          this.uistate.get().proposal.s2.signature.set({agentSig:sig, agentHash : hash})
      }


  }

  signature(role) {
      console.log(TAG+"signature ---> role", role)
      // have to save some of data on the screen, otherwise will lose the information
      let values = this.refs.form.getValue();
      if (!values) {
          this.alert("Please fix errors before going to signature page");
          return
      }
      this.uistate.get().proposal.s2.ui.set({refresh:true})
      this.props.fns.toRoute({
          name : 'Signature',
          component : Signature,
          data : {role:role, onSaveSignature : this.onSaveSignature.bind(this)}
      })
      return
  }

}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop : 10,
    borderColor : 'grey',
    borderWidth : 0
  },
  text: {
    fontSize : 18,
    color : 'grey',
    paddingTop : 10,
},
smltext: {
  fontSize : 17,
  color : 'grey',
  paddingTop : 10,
  // width : (dw*0.85) - 100
},
separator: {
  height: 2,
  width : dw,
  backgroundColor: '#CCCCCC',
},
actionButton: {
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  paddingTop: 2,
  shadowOpacity: 0.3,
  shadowOffset: {
    width: 0, height: 1,
  },
  shadowColor: '#444',
  shadowRadius: 1,
},
preview: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: Dimensions.get('window').height-300,
  width: Dimensions.get('window').width - 100
},
capture: {
  flex: 0,
  backgroundColor: '#fff',
  borderRadius: 5,
  color: '#000',
  padding: 10,
  margin: 40
},
buttonBar: {
       flexDirection: "row",
       position: "absolute",
       bottom: 25,
       right: 0,
       left: 0,
       justifyContent: "center"
   },
   button: {
       padding: 10,
    //    color: "#FFFFFF",
       borderWidth: 1,
       borderColor: "#FFFFFF",
       margin: 5
   },
   buttonText: {
    //    color: "#FFFFFF"
   }


});
