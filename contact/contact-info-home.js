'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  ListView,
  AlertIOS
} = React;

import _ from "lodash";
import moment from "moment";
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabsBar from "../components/tabsBar";
import { getColl, getDb } from "../db";
import ContactInfoMenu from "./contact-info-menu";
import ContactBasicView from "./contact-info-basic";
import ContactContactsView from "./contact-info-contacts";
import ContactAddressView from "./contact-info-address";
import ContactPersonalView from "./contact-info-personal";
import ContactDependentsView from "./contact-info-dependents";
import ContactQuoteList from "./contact-quote-list";
import ContactProposalList from "./contact-propsl-list";
import ContactFnaList from "./contact-fna-list";
import ContactNotesView from "./contact-info-notes";
import cblite from "../cblite"

var dh = Dimensions.get('window').width;
var dw = Dimensions.get('window').height;
var Icon = require('react-native-vector-icons/FontAwesome');

export default class ContactInfoHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        offset : new Animated.Value(0)
    };
    this.mode = 'edit';
    this.stateListener = null;
    this.uistate = require("../state");
    this.fns = Object.assign({
        gotoTab: this.gotoTab.bind(this),
        gotoView : this.gotoView.bind(this),
        saveContact : this.saveContact.bind(this)
    }, props.fns)
    // console.log("contact-info-home.constructor", this.uistate.get().contact.currentContact )
    // load the current contact whose information we are working withdrawal
    this.loadCurrentContact()

  }

  componentWillReceiveProps(props){
      this.loadCurrentContact()
    //   this.tabsbar.gotoTab(this.uistate.get().contactinfo.tabno);
    //   this.gotoTab(this.uistate.get().contactinfo.tabno);
  }

  loadCurrentContact() {
      let currentContact = this.uistate.get().contact.currentContact;
      let info = this.uistate.get().contactinfo
      let doc = _.assign({}, info.doc.basic.defaults, info.doc.personal.defaults, currentContact);
      if ( currentContact._id !== '-1') {
        //   debugger;
          doc.gender = doc.gender === 'M' ? 'Male' : doc.gender === 'F' ? 'Female' : doc.gender
          doc.contacts = doc.contacts || [];
          doc.addresses = doc.addresses || [];
          doc.dependents = doc.dependents || [];
          doc.notes = doc.notes || [];
      } else {
          // new contact
          doc = Object.assign( {}, info.doc.basic.defaults, info.doc.personal.defaults); // copy in the default values
          doc.contacts = [];
          doc.addresses = [];
          doc.dependents = [];
          doc.notes = [];
      }



    //   var db = getDb(),
    //       coll = getColl("contacts"),
    //       doc = {},
    //       newdoc = {},
    //       contact = {},
    //       id = this.uistate.get().contact.currentContact; // passed in
    //   if (id && id > 0 ) {
    //       contact = coll.get(id);
    //       contact.gender = contact.gender === 'M' ? 'Male' : contact.gender === 'F' ? 'Female' : contact.gender
    //       doc = Object.assign({}, contact);
    //       doc.contacts = doc.contacts || [];
    //       doc.addresses = doc.addresses || [];
    //       doc.dependents = doc.dependents || [];
    //       doc.notes = doc.notes || [];
      //
    //   } else if (id === -1){
    //       // new row, put in the defaults
    //       let info = this.uistate.get().contactinfo
    //       doc = Object.assign( {}, info.doc.basic.defaults, info.doc.personal.defaults);
    //       doc.contacts = [];
    //       doc.addresses = [];
    //       doc.dependents = [];
    //       doc.notes = [];
    //   }


      this.uistate.get().contactinfo.set({currentContact: doc, tabno:0, viewno:0}).now() ; // note we are updating contactinfo instead of contact
    //   this.uistate.get().contactinfo.set({currentContact: doc, viewno:0}) ; // note we are updating contactinfo instead of contact
    //   console.log("contact-info-home.loadCurrentContact", doc);
      if (Object.keys(doc).length > 0) {
          // load up the working sections as well
          let basedoc = {};
          _.forOwn(doc,(v,k,obj) => {
              if (['contacts','addresses','dependents','notes'].indexOf(k) < 0 ) {
                //   if (k === 'dob') {
                //       if (obj.dob && _.isString(obj.dob)) {
                //           basedoc[k] = moment(obj[k], [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate();
                //       } else {
                //           basedoc[k] = obj[k]
                //       }
                //   } else {
                      basedoc[k] = obj[k]
                //   }
              }
          })
          this.uistate.get().contactinfo.doc.set({data:basedoc});
          this.uistate.get().contactinfo.contacts.set({data:doc.contacts});
          this.uistate.get().contactinfo.addresses.set({data:doc.addresses});
          this.uistate.get().contactinfo.dependents.set({data:doc.dependents});
          this.uistate.get().contactinfo.notes.set({data:doc.notes});
      }
  }

  setCurrentContactToAppState(docid) {
      let prom = new Promise((resolve,reject) => {
          cblite.getDocument(docid).then((doc) => {
              let basedoc = {};
                  // load up the working sections as well
              _.forOwn(doc,(v,k,obj) => {
                  if (['contacts','addresses','dependents','notes'].indexOf(k) < 0 ) {
                          basedoc[k] = obj[k]
                  }
              })
            //   debugger;
              this.uistate.get().contactinfo.set({refresh:false}).now();
              this.uistate.get().contactinfo.doc.set({data:basedoc});
              this.uistate.get().contactinfo.contacts.set({data:doc.contacts});
              this.uistate.get().contactinfo.addresses.set({data:doc.addresses});
              this.uistate.get().contactinfo.dependents.set({data:doc.dependents});
              this.uistate.get().contactinfo.notes.set({data:doc.notes});
              this.uistate.get().contactinfo.set({refresh:true, currentContact: doc}).now();
              resolve(doc)
          })
          .catch((err) => {
            //   debugger;
              reject(err);
          })

      });
      return prom;

  }
  saveContact(){

    //   let db = getDb(),
    //       coll = getColl("contacts"),
    let   doc = this.uistate.get().contactinfo.doc.data.toJS(),
          newdoc = {};

      // assemble from working areas of uistate and update to the db
      doc.contacts = this.uistate.get().contactinfo.contacts.data || [];
      doc.addresses = this.uistate.get().contactinfo.addresses.data || [];
      doc.dependents = this.uistate.get().contactinfo.dependents.data || [];
      doc.notes = this.uistate.get().contactinfo.notes.data || [];

      newdoc = _.assign({},this.uistate.get().contactinfo.currentContact.toJS(),doc);
      newdoc.doctype = "contacts" ; // important for making sure of the document type
      newdoc.channels = ['sp'];
      newdoc.owner = 'sp'; // this should be removed once we have the agent log in
    //   console.log("newdoc", newdoc);
    // debugger;

      let self  = this;
      let updated;
      if (newdoc._id) {
          cblite.updateDocument(newdoc, newdoc._rev ).then( (res) => {
              if (res.ok) {
                  self.setCurrentContactToAppState(res.id).then( () => {
                        self.alert("Contact information was successfully saved", "Info");
                  })

              } else {
                  self.alert("Unable to save the current contact" + res );
              }
          })
          .catch((err) => console.log("Error in updating", err))
      } else {
          cblite.createDocument( newdoc).then( (res) => {
              if (res.ok) {
                  self.setCurrentContactToAppState(res.id).then(() => {
                      self.alert("Contact information was successfully saved", "Info");
                  })
              } else {
                  self.alert("Unable to save the current contact" + res );
              }
          })
          .catch((err) => console.log("Error in updating", err))
      }

    //   if ( newdoc.$loki ) {
    //       updated = coll.update(newdoc)
    //   } else {
    //       updated = coll.insert(newdoc);
    //   }
    // //   console.log("saveContact-->updated", updated);
    //   coll.flushChanges()
    //   db.saveDatabase((status) => {
    //       this.uistate.get().contact.set({refresh:false, currentContact : updated.$loki })
    //       AlertIOS.alert(
    //         'Info',
    //         'Contact information was saved...',
    //         [
    //           {text:'OK', onPress : (txt) => console.log(txt)}
    //         ],
    //         // 'default'
    //       );
    //   })
    //   this.uistate.get().contactinfo.set({refresh:true, currentContact: newdoc})
  }

  componentDidMount(){
    this.stateListener = this.uistate.get().contactinfo.getListener();
    let fn = (data) => {
        // console.log("***** -----> contact-info-home...forceupdate", data);
        if (data.refresh) {
            // console.log("***** ----> contact-info-home...updated");
            this.forceUpdate();
        }
    }
    this.stateListener.on('update', _.debounce(fn , 100) );
    // let coll = getColl('contacts')
  }
  componentWillUnmount() {
      this.stateListener.off('update'); // clean up
  }
  componentDidUpdate(lastProps, lastState) {
      Animated.timing(this.state.offset, {
        duration: 500,
        toValue: 0
      }).start();
  }

  tabPressed(tabno, text){
    let currentTabno = this.uistate.get().contactinfo.tabno;
    // can do some checking here before going to the new requested tab
    // console.log("contact-info-home.tabPressed newtab, currenttab", tabno, currentTabno)

    this.uistate.get().contactinfo.set({tabno:tabno, viewno:0}).now();
    this.setState({offset: new Animated.Value(dh)});

    return

  }
  // changeTab(param) {
  //   let tab = param.i;
  //   // console.log("quoteView.changeTab ---> tab :", tab);
  // }

  gotoTab(tabno, param ) {
    // console.log("gotoTab, param", param);
    let newstate, currentTab, currentContact;

    currentTab = this.uistate.get().contactinfo.tabno;
    // console.log("contact-info-home.gotoTab newtab, currenttab", tabno, currentTab)
    //this.uistate.get().contact.set({list_tabno:tabno}).now();
    this.tabsbar.gotoTab(tabno);
  }
  alert(msg=null, type) {
      let message = msg ? msg : 'Please fix the errors, before moving to the next view'
      let etype = type ? type : 'Error'
      AlertIOS.alert(
        etype,
        message,
        [
            {text:'OK'}
            // {text:'OK', onPress : (txt) => console.log(txt)}
        ],
        // 'default'
      );
  }
  gotoView(viewno, param ) {
    // console.log("gotoTab, param", param);
    let newstate, currentView, currentContact;
    currentView = this.uistate.get().contactinfo.viewno;
    if (currentView === 0 && viewno !== 0) {
        // any chance to save the data ?
        let values = this.refs.basic.refs.form.getValue();
        if (!values) {
            this.alert()
            return
        }
        let doc = Object.assign( {}, this.uistate.get().contactinfo.doc.data, values );
        this.uistate.get().contactinfo.set({refresh:true}).doc.set({data:doc}).now()
    } else if (currentView === 3 && viewno !== 3) {
        let values = this.refs.personal.refs.form.getValue();
        if (!values) {
            this.alert()
            return
        }
        let doc = Object.assign( {}, this.uistate.get().contactinfo.doc.data, values ); // update the values
        this.uistate.get().contactinfo.set({refresh:true}).doc.set({data:doc}).now()
    }

    this.uistate.get().contactinfo.set({viewno:viewno}).now();
  }

  contactView(){
      let viewno = this.uistate.get().contactinfo.viewno;
      let menu = <View style={{flex:0.15}}>
                    <ContactInfoMenu ref="menu" fns={this.fns}/>
                </View>;
      let view;
      if (viewno === 0) {
          view = <ContactBasicView ref="basic" fns={this.fns} />;
      } else if (viewno === 1){
          view = <ContactContactsView ref="contacts" fns={this.fns} />;
      } else if (viewno === 2) {
          view = <ContactAddressView ref="address" fns={this.fns} />;
      } else if (viewno === 3) {
          view = <ContactPersonalView ref="personal" fns={this.fns} />;
      } else if (viewno === 4) {
          view = <ContactDependentsView ref="dependents" fns={this.fns} />;
      } else if (viewno === 5) {
          view = <ContactNotesView ref="notes" fns={this.fns} />;
      }
      return (
          <View style={styles.container}>
                {menu}
            <View style={{flex:0.85}}>
                {view}
            </View>
          </View>
      );
  }
  quoteview(){
      let viewno = this.uistate.get().contactinfo.viewno; // so we have quote tab and now get the view no
      // for quote there is only 1 view i.e. the contact-quote-list view
      return <ContactQuoteList ref="qlist" fns={this.fns} />;
  }
  fnaView(){
      let viewno = this.uistate.get().contactinfo.viewno; // so we have quote tab and now get the view no
      // for quote there is only 1 view i.e. the contact-quote-list view
      return <ContactFnaList ref="fnalist" fns={this.fns} />;
  }

  changeTab(param) {
    let tab = param.i;
    console.log("quoteView.changeTab ---> tab :", tab);
    // set the opacity in the tabsbar
    this.tabsbar.setOpacity(tab);
  }


  render() {
      let [contactview, fnaview ,quoteview, proposalview] = [<View />,<View />, <View />, <View />];
      const { tabno } = this.uistate.get().contactinfo;

      // decide on which view render based on tabno
    //   debugger;
      if (tabno === 0) {
          contactview = this.contactView();
      } else if (tabno === 1) {
          fnaview = this.fnaView()
      } else if (tabno === 2) {
          quoteview = this.quoteview()
      } else if (tabno === 3) {
          proposalview = <ContactProposalList ref="plist" fns={this.fns} />;

      }
      return (

                <Animated.View style={[styles.container, { transform: [{translateY : this.state.offset }] }]} >
                  <ScrollableTabView ref="tabsview"  tabno={tabno} onChangeTab={this.changeTab.bind(this)}
                      initialPage={tabno} locked={true} tabBarPosition="top" style={{}}
                      renderTabBar={(props) => <TabsBar  tabno={tabno} ref={(tb) => this.tabsbar=tb} onPress={this.tabPressed.bind(this)} />}
                   >

                      <View tabLabel="Contacts|user" style={styles.tabView}>
                        <View  style={styles.card}>
                          {contactview}
                        </View>
                      </View>

                      <View tabLabel="      FNAs|cubes" style={styles.tabView}>
                        <View style={styles.card}>
                          {fnaview}
                        </View>
                      </View>


                      <View tabLabel="Quotations|calculator" style={styles.tabView}>
                        <View style={styles.card}>
                          {quoteview}
                        </View>
                      </View>
                      <View tabLabel="Proposals|file-text" style={styles.tabView}>
                        <View style={styles.card}>
                          {proposalview}
                        </View>
                      </View>

                  </ScrollableTabView>

                </Animated.View>


      )
    }
}


var styles = StyleSheet.create({
 // outerContainer: {
 //     flex: 1,
 //     flexDirection: "row"
 // },
 container: {
    flex: 1,
    marginTop: 0,
    flexDirection : 'row'
  },
  tabView: {
    // width: dw,
    padding: 2,
    margin: 2,
    // backgroundColor: 'rgba(0,0,0,0.01)',
    backgroundColor: 'transparent',
  },
  card: {
    borderWidth: 0,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 0,
    height: dh,
    padding: 0,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
