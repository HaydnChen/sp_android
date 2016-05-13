'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  AlertIOS,
  DatePickerIOS,
  Modal,
  Dimensions
} = React

// var screenWidth = Dimensions.get('window').width;
var dh = Dimensions.get('window').height;
var dw = Dimensions.get('window').width;
var isLeap = (yr) => { return !((yr % 4) || (!(yr % 100) && (yr % 400))); }

var Icon = require('react-native-vector-icons/FontAwesome');
var SlideMenu = require("../components/slidemenu");
var SideMenu = require("../components/sidemenu");
var HomeView = require("./home");
import Contacts from "./contacts";
import ContactsPage from "./contactsPage";
import ContactListPage from "../contact/contact-list-page";
import ContactInfoPage from "../contact/contact-info-page";
import ProposalListPage from "../proposal/proposal-list-page"
import ProposalS1Page from "../proposal/proposal-s1-page"
import ProposalS2Page from "../proposal/proposal-s2-page"
import QuotePage from "../quote/pages/quotePage";
import SPHomeView from "./spHome";
import AdminPage from "../admin/admin-page";
import FnaPage from "../fna/fna-page";
import FnaListPage from "../fna/fna-list-page";

import _ from 'lodash';
var db = require('../db');
import cblite from "../cblite"
//var globals = require('../globals').load();
var UiState = require("../state");
var Icon = require('react-native-vector-icons/FontAwesome');
import Picker from 'react-native-picker';
import Button from 'apsl-react-native-button';
//import Calendar from 'react-native-calendar'

import Camera from 'react-native-camera';
var RNFS = require('react-native-fs');

var glob = window || global || root;
    glob.blobUtil = require('blob-util');

var alert = (msg=null) => {
    let message = msg ? msg : 'Please fix the errors, before moving to the next view'
    AlertIOS.alert(
      'Error',
      message,
      [
        {text:'OK', onPress : (txt) => console.log(txt)}
      ],
    );
}

class ContactInfoTitle extends React.Component {
    render() {
        let contact = UiState.get().contact.currentContact;
        // contact = null;
        // if (cid) {
        //     let coll = db.getColl("contacts");
        //     contact = coll.get(cid);
        // }
        return (
            <Text style={{textAlign: 'center' , fontSize:20, color: 'white', fontWeight:'bold'}}> { contact.name ? "Contact : " + contact.name : 'New Contact'} </Text>
        );
    }
}
class FnaTitle extends React.Component {
    render() {
        let contact = UiState.get().fna.ui.currentContact;
        // debugger;
        return (
            <Text style={{textAlign: 'center' , fontSize:20, color: 'white', fontWeight:'bold'}}> { contact  && contact.name ? "FNA for " + contact.name : 'FNA'} </Text>
        );
    }
}

class QuotationTitle extends React.Component {
    render() {
        let contact = UiState.get().contact.currentContact;
        return (
            <Text style={{textAlign: 'center' , fontSize:20, color: 'white', fontWeight:'bold'}}>
                { contact ? "Quotation for " + contact.name : 'Quotation'}
            </Text>
        );
    }
}
class ProposalS1Title extends React.Component {
    render() {
        let contact, product, main, quote;
        // debugger;
        if (UiState.get().proposal.s1.ui.proposal) {
            main = UiState.get().proposal.s1.ui.proposal.quotation.policy.main;
            contact = UiState.get().proposal.s1.ui.proposal.ph;
            product = main.product_name;
        } else {
            quote = UiState.get().proposal.s1.ui.quote;
            contact = UiState.get().proposal.s1.ui.contact;
            if (quote) {
                product = quote.policy.main.product_name || '';
            } else {
                product = '';
            }
        }
        if (! contact) {
            contact = {}
        }

            // status = UiState.get().proposal.ui.section_1_ok,
        // contact = null;
        // debugger;
        // if (cid) {
        //     let coll = db.getColl("contacts");
        //     contact = coll.get(cid);
        // }
        // <Text style={{textAlign: 'center' , fontSize:14, color: 'white', fontWeight:'bold', padding: 0}}>
        // (Section 1 of 2)
        // </Text>
        return (
            <View style={{flex:1, flexDirection:"column"}}>
                <View>
                    <Text style={{textAlign: 'center' , fontSize:18, color: 'white', fontWeight:'bold', paddingBottom:5}}>
                        { contact.name ? "Proposal for " + contact.name : 'Proposal Information' }
                    </Text>
                    {product ?
                    <View>
                        <Text style={{textAlign: 'center' , fontSize:14, color: 'white', fontWeight:'bold', padding: 0}}>
                         {"(" + product + ")"}
                        </Text>
                    </View>
                    : <View /> }
                </View>
            </View>
        );
    }
}
class ProposalS2Title extends React.Component {
    render() {
        let cid = UiState.get().proposal.s1.ui.contact_id,
            status = UiState.get().proposal.ui.section_1_ok,
        contact = null;
        // debugger;
        if (cid) {
            let coll = db.getColl("contacts");
            contact = coll.get(cid);
        }
        return (
            <View style={{flex:1, flexDirection:"column"}}>
                <View>
                    <Text style={{textAlign: 'center' , fontSize:18, color: 'white', fontWeight:'bold', paddingBottom:5}}>
                        { contact ? "Proposal for " + contact.name : 'Proposal Information' }
                    </Text>
                    <Text style={{textAlign: 'center' , fontSize:14, color: 'white', fontWeight:'bold', padding: 0}}>
                    (Section 2 of 2)
                    </Text>
                </View>
            </View>
        );
    }
}
class ProposalS3Title extends React.Component {
    render() {
        let cid = UiState.get().proposal.s1.ui.contact_id,
            status = UiState.get().proposal.ui.section_1_ok,
        contact = null;
        // debugger;
        if (cid) {
            let coll = db.getColl("contacts");
            contact = coll.get(cid);
        }
        return (
            <View style={{flex:1, flexDirection:"column"}}>
                <View>
                    <Text style={{textAlign: 'center' , fontSize:18, color: 'white', fontWeight:'bold', paddingBottom:5}}>
                        { contact ? "Proposal for " + contact.name : 'Proposal Information' }
                    </Text>
                    <Text style={{textAlign: 'center' , fontSize:14, color: 'white', fontWeight:'bold', padding: 0}}>
                    (Section 3 of 3)
                    </Text>
                </View>
            </View>
        );
    }
}

function logger(param) {
   let innerfn = function(target, name, { value: fn, configurable, enumerable }) {
    return {
        configurable,
        enumerable,
        get() {
            const boundfn = function() {
                console.log(`Logging ${name} before call ${JSON.stringify(arguments)} -- passed params ${param}`)
                let result = fn.apply(this, arguments);
                console.log(`Logging ${name} after call`, result)
                return result
            }

            // Object.defineProperty(this, name, {
            //   configurable: true,
            //   writable: true,
            //   enumerable: false,
            //   value: boundfn
            // });

            return boundfn;
          },
        // set(val) {
        //     Object.defineProperty(this, name, {
        //       configurable: true,
        //       writable: true,
        //       enumerable: true,
        //       value: val
        //     });
        // }
     }
 }
 return innerfn
}



class Dummy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showModal : false}

    }
    open() {
        this.refs.picker.toggle()
    }

    // @logger()
    openModal(msg) {
        console.log("show modal msg", msg)
        this.setState({showModal: !this.state.showModal})
        return "return value"
    }
    showCamera() {
        this.setState({showModal: true})
    }
    componentDidMount(){
        //delete jpg files
        var path = RNFS.DocumentDirectoryPath;
        RNFS.readDir(path).then((files) => {
            _.forEach(files, (file) => {
                const { name, path, size } = file;
                if (name.endsWith(".jpg")) {
                    // now we delete them
                    RNFS.unlink(path).then((result) => {
                        console.log("Deletion ", result)
                    })
                }

            })

        })
        .catch((err) => {
            console.log("Error in reading directory", err)

        })


    }

    onDone(val) {

        console.log("value on done", val);
        this.setState({showModal:false})
    }
    onCancel() {
        this.setState({showModal:false})
    }
    // render() {
    //     var customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    //     return (
    //         <View style={{}}>
    //         <Modal visible={this.state.showModal} transparent={true} animated={true}>
    //           <View style={{top: 0, left: 0, flex: 1, height:400, top: 100, backgroundColor:'yellow' }} >
    //
    //
    //
    //                 <Calendar ref="cal"
    //                           scrollEnabled={true}
    //                           showControls={true}
    //                           titleFormat={'MMMM YYYY'}
    //                           prevButtonText={'Prev'}
    //                           nextButtonText={'Next'}
    //                           dayHeadings={customDayHeadings}
    //                           onDateSelect={(date) => console.log("Selected date", date) }
    //                           onTouchPrev={() => console.log('Back TOUCH')}
    //                           onTouchNext={() => console.log('Forward TOUCH')}
    //                           onSwipePrev={() => console.log('Back SWIPE')}
    //                           onSwipeNext={() => console.log('Forward SWIPE')}/>
    //
    //                 <Button onPress={() => this.onCancel() }>Close</Button>
    //             </View>
    //          </Modal>
    //
    //          <Button textStyle={{color:"white", fontSize:16}} style={{padding:10, width:100, height:35, backgroundColor:"#1acc9c", borderWidth:0 }}
    //            onPress={()=>this.openModal()} isDisabled={false} >
    //                {/*<Icon name="check" size={15} color="white" /> */}
    //            Show Modal
    //          </Button>
    //
    //
    //         </View>
    //
    //     );
    // }

    createData() {

        // return ['one','two','three']
        let MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        let years = {};
        let yr = moment().year()
        _.forEach(_.range(yr-5,yr+20+1), (year) => {
            years['' + year] = {}
            _.forEach( _.range(1,12+1), (month) => {
                  years['' + year][MONTHS[month-1]] = []
                  let numDays = [1,3,5,7,8,10,12].indexOf(month) >= 0 ? 31 : month !== 2 ? 30 : isLeap(year) ? 29 : 28 ;
                  _.forEach( _.range(1,numDays+1), (day) => {
                      years['' + year][MONTHS[month-1]].push('' + day)
                  })
            })
        })
        // debugger;
        // console.log("data", years)
        return years;


    }
    // render() {
    //     var today = new Date();
    //     var self = this;
    //     var data = this.createData()
    //     var title = "Date Picker"
    //     var pickerStyle = Object.assign({}, {top: (dw-300-400), left: dw/4, height: 300, width:dw/2, backgroundColor:'#f0ffff'} )
    //
    //     return (
    //         <View style={{}}>
    //         <Modal visible={this.state.showModal} transparent={true} animated={true} style={{}}>
    //           <View style={{ top: 0, left: 0 }} >
    //
    //           <Picker ref="picker" showDuration={300} showMask={true} pickerToolBarStyle={{height:60, backgroundColor: '#5cafec'}}
    //               pickerBtnStyle={{color:'white'}} pickerTitleStyle={{fontSize:20, color:'white'}}
    //               pickerBtnText="Confirm" pickerCancelBtnText="Cancel" pickerTitle={title}
    //               pickerData={data} selectedValue={['2016','Mar','22']} style={pickerStyle}
    //               onPickerCancel={()=>self.onCancel()}  onPickerDone={(val)=> self.onDone(val)} ></Picker>
    //
    //             </View>
    //          </Modal>
    //
    //          <Button textStyle={{color:"white", fontSize:16}} style={{padding:10, width:100, height:35, backgroundColor:"#1acc9c", borderWidth:0 }}
    //            onPress={()=>this.openModal("Hello")} isDisabled={false} >
    //                {/*<Icon name="check" size={15} color="white" /> */}
    //            Show Modal
    //          </Button>
    //
    //
    //         </View>
    //
    //     );
    // }

    render() {
      return (
        <View style={styles.container}>
         { this.state.showModal ?
             <Camera
               ref={(cam) => {
                 this.camera = cam;
               }}
               captureTarget={Camera.constants.CaptureTarget.disk}
               captureQuality={Camera.constants.CaptureQuality.low }
               style={styles.preview}
               aspect={Camera.constants.Aspect.fill}>
               <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
               <Text style={styles.capture} onPress={this.onDone.bind(this)}>[Exit]</Text>
             </Camera>
           :  <View>
                     <Button textStyle={{color:"white", fontSize:16}} style={{padding:10, width:100, height:35, backgroundColor:"#1acc9c", borderWidth:0 }}
                          onPress={()=>this.showCamera("Hello")} isDisabled={false} >
                          Camera
                        </Button>
                </View>


         }
        </View>
      );
    }

    takePicture() {
      this.camera.capture()
        .then((data) => {
            RNFS.readFile(data,'base64').then((buf) => {
                console.log("read phone file as base64", buf.length, buf.substr(0,100))
                RNFS.unlink(data).then((result) => {
                    console.log("Deleting file", data, result[0], result[1])
                })
            })
            .catch((err) => {
                console.log("Unable to move file", err)
            })

            console.log("*******", data.length, data )
            this.setState({showModal:false})
        })
        .catch(err => console.error("*******ERROR " , err));
    }




}
class NextSectionS1 extends React.Component {

    nextProposalSection() {
        const {current_section, section_1_ok, section_2_ok, section_3_ok } = UiState.get().proposal.ui;
        // console.log("NextSection --> current_section, s1_ok", current_section, section_1_ok, this.props);
            if (section_1_ok) {
                let proposal = _.assign({},UiState.get().proposal.s1.ui.proposal);
                if (proposal._id) {
                    UiState.get().proposal.s2.ui.set({refresh:false, tabno:0, proposal:proposal}).now()
                    this.props.toRoute({
                        name : "Proposal Detail (Section 2 of 3)",
                        component : ProposalS2Page,
                        // rightCorner : NextSectionS2,
                        titleComponent : ProposalS2Title,
                        data : Object.assign({}, {fns: this.props})
                    });
                }

            } else {
                alert("Please complete this section before moving to the next section")
                return
            }
    }

    render() {
        return (
        <TouchableOpacity onPress={() => this.nextProposalSection()}>

            <View style={{flexDirection:"row", paddingRight: 10}}>
                <Text style={{fontSize:16, top:2, color:"#fefefe", paddingRight:10}}>Next Section</Text>
                <Icon name={"chevron-right"} size={20} color="#fff" style={styles.backButton} />
            </View>
        </TouchableOpacity>
        );
    }
}
class NextSectionS2 extends React.Component {

    nextProposalSection() {
        const {current_section, section_1_ok, section_2_ok, section_3_ok } = UiState.get().proposal.ui;
        if (section_2_ok) {

            // update with the proposal id that we are using
            let proposal_id = UiState.get().proposal.s1.ui.proposal_id;
            if (proposal_id > 0) {
                UiState.get().proposal.s2.ui.set({refresh:false, proposal_id:proposal_id}).now()
                this.props.toRoute({
                    name : "Proposal Detail (Section 2 of 3)",
                    component : ProposalS2Page,
                    rightCorner : NextSection,
                    titleComponent : ProposalS2Title,
                    data : Object.assign({}, {fns: this.props})
                });

            }

        } else {
            alert("Please complete this section before moving to the next section")
            return
        }
    }

    render() {
        return (
        <TouchableOpacity onPress={() => this.nextProposalSection()}>

            <View style={{flexDirection:"row", paddingRight: 10}}>
                <Text style={{fontSize:16, top:2, color:"#fefefe", paddingRight:10}}>Next Section</Text>
                <Icon name={"chevron-right"} size={20} color="#fff" style={styles.backButton} />
            </View>
        </TouchableOpacity>
        );
    }
}


class HomePage extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState();

      let fns = this.createFunctionsMap(props);
      fns.toRoute = props.toRoute;

      // this.fns = { gotoContacts: gotoContacts, gotoIllustration: gotoIllustration, toRoute: props.toRoute };
      this.fns = fns;
      this.uistate = {};

    }

    getInitState(){
      return {
      };
    }

    createFunctionsMap(props){
      let fns = {}

      fns.gotoContactList = (params) => {
        props.toRoute({
          name : "Contacts",
          component : ContactListPage,
        //   data : _.extend(params||{}, fns)
          data : Object.assign({}, {fns: fns}, params)
        });
      };
      fns.gotoContactDetail = (params) => {
        props.toRoute({
          name : "Contact Info",
          component : ContactInfoPage,
          titleComponent : ContactInfoTitle,
          data : Object.assign({}, {fns: fns}, params)
        });
      };

      fns.gotoProposalList = (params) => {
        props.toRoute({
          name : "Proposals",
          component : ProposalListPage,
          data : Object.assign({}, {fns: fns}, params)
        });
      };
      fns.gotoProposal = (params) => {
        props.toRoute({
          name : "Proposal Detail (Section 1 of 3)",
          component : ProposalS1Page,
        //   rightCorner : NextSectionS1,
          titleComponent : ProposalS1Title,
          data : Object.assign({}, {fns: fns}, params)
        });
      };

      fns.gotoContacts = (params) => {
        props.toRoute({
          name : "Contact",
          component : ContactsPage,
          data : Object.assign({}, {fns: fns}, params)
        });
      };
      fns.gotoIllustration = (params) => {
        props.toRoute({
          name : "Illustration",
          component : QuotePage,
          titleComponent : QuotationTitle,
          data : Object.assign({}, {fns: fns}, params)
        });
      };

      fns.gotoAdmin = (params) => {
        props.toRoute({
          name : "Administration",
          component : AdminPage,
          data : Object.assign({}, {fns: fns}, params)
        });
      };

      fns.gotoFna = (params) => {
        props.toRoute({
          name : "FNA",
          component : FnaPage,
          titleComponent : FnaTitle,
          data : Object.assign({}, {fns: fns}, params)
        });
      };
      fns.gotoFnaList = (params) => {
        props.toRoute({
          name : "FNA Listing",
          component : FnaListPage,
          data : Object.assign({}, {fns: fns}, params)
        });
      };


      //
    //   fns.gotoFinancialNeedsAnalysis = (params) => {
    //     props.toRoute({
    //       name : "Financial Needs Analysis",
    //       component : FinancialNeedsAnalysisPage,
    //       data : Object.assign({}, {fns: fns}, params)
    //     });
    //   };


      fns.goHome = (params) => {
        props.reset();
        // props.toRoute({
        //   name : "Home",
        //   component : HomePage,
        //   data : _.extend(params||{}, fns)
        // });
      }

      return fns;

    }
    componentDidMount(){
    //     // could put in code to call a spinner to tell the user that we are loding the db
        // db.loadDB( ()  => {
        //   this.uistate = require('../state');
        //   // set the spinner to vanish and say that the app is now ready
        //   // require('../globals').set("uistate", this.uiState);
        // });
        var cbl = cblite;
        // insert some rows
        // cbl.createDocument( {"doctype":"contacts", "name": "ycloh",  "gender":"Male",  "type": "Person"} ).then( (res) => {
            // cbl.getAllDocuments().then( (res) => {
            //
            //     let docs = res.rows.map( (row) => {
            //         return row.doc;
            //     })
            //     _.forEach(docs, (doc) => {
            //         console.log("doc", doc)
            //         if ( doc._id.startsWith('_design') ) {
            //             console.log("required doc", doc);
            //             cbl.deleteDocument(doc._id, doc._rev).then( (res) => {
            //                 console.log("Deleted document", doc._id);
            //             })
            //         }
            //     })
            //     // debugger;
            //     // console.log("all docs", docs );
            // })
            // cbl.getDesignDocument("contacts").then( (res) => {
            //     console.log("getDesignDocument, res", res);
            // })
            //
            // cbl.queryView("contacts","listContacts").then( (res) => {
            //     console.log("results from queryViuew", res);
            //     // debugger;
            // })


        // })



        // var Global = window || global || root ;
        // let plans =  Global.api.availablePlans();
        // console.log("Global.api", Global.api.availablePlans());
        // debugger;

    }

    render(){

        /*
        <SlideMenu ref={(item) => { if(item) fns.parent = item; } }
          renderLeftView = {() => <SideMenu uistate={this.uiState} fns={fns} />}
          renderCenterView = {() => <SPHomeView uistate={this.uiState} fns={fns} /> }
        /> */
    // var db2 = database; // use with debuger to check on the api for couchbase-lite
    //
    // db2.makeRequest("GET",db2.databaseUrl + "_all_dbs").then( (res) => console.log("databases", res));
    // var pp = db2.makeRequest("HEAD", db2.databaseUrl + "contacts").then( (res) => console.log(res)).catch((err) => console.log("err",err));

      let fns = _.extend({}, this.fns)
    //   return (
    //       <Dummy />
    //   )

      return (
          <SPHomeView uistate={this.uiState} fns={fns} />
      );
    }
} // end SideMenu class

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1,
  },
  left: {
    position: 'absolute',
    top:0,
    left:0,
    bottom:0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }

})



module.exports = HomePage;
