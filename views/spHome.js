'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Easing,
  ListView,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  AlertIOS,
} = React

var screenWidth = Dimensions.get('window').width;
var Icon = require('react-native-vector-icons/FontAwesome');

import cblite from "../cblite"

class SPHomeView extends React.Component {
    constructor(props){
      super(props);
      this.state = this.getInitState();
      this.uistate = require('../state');

    }

    getInitState(){
      return {
      };
    }
    alert(msg=null, type) {
        let message = msg ? msg : 'Please fix the errors, before moving to the next view'
        let etype = type ? type : 'Error'
        AlertIOS.alert(
          etype,
          message,
          [
            {text:'OK', onPress : (txt) => console.log(txt)}
          ],
          // 'default'
        );
    }
    componentDidMount() {
        if (!this.uistate.get().admin.ui.currentConfig) {
            cblite.getDocument("SP-CONFIG").then( ( doc ) => {
                // console.log("spHome.componentDidMount, doc = ", JSON.stringify(doc));
                if (doc.status === 404) {
                    this.uistate.get().admin.ui.set({currentConfig : {} });
                    return
                }
                this.uistate.get().admin.ui.set({currentConfig : doc });
            }).catch( (err) => {
                this.uistate.get().admin.ui.set({currentConfig : {} });
            })
        }
    }
    gotoContact(){
        // console.log("goto Contact", this.props);
        // this.props.fns.gotoContactList(this.props)
        this.props.fns.gotoContactList()
        // this.props.fns.gotoContacts(this.props);
    }

    gotoQuotation(){
        // console.log("goto Quoatation");
        // since we are navigating from the home screen, we reset things
        this.uistate.get().quote.set({contact:null,quote:null, reloadQuote:true, tabno:0}).now()
        this.props.fns.gotoIllustration(this.props);
    }

    gotoProposal(){
        // console.log("goto Proposal");
        this.uistate.get().proposal_list.ui.set({contact:null,quote:null, proposal:null}).now()
        this.props.fns.gotoProposalList(this.props);
    }

    gotoNeedsAnalysis(){
        // console.log("goto needs analysis");
        this.props.fns.gotoFnaList(this.props);
        // this.alert("Not implemented yet !!", "Information")
    }

    gotoAdmin(){
        // console.log("goto Admin");
        if (!this.uistate.get().admin.ui.currentConfig) {
            cblite.getDocument("SP-CONFIG").then( ( doc ) => {
                if (doc.status === 404) {
                    this.uistate.get().admin.ui.set({currentConfig : {} });
                    this.props.fns.gotoAdmin(this.props);
                    return
                }
                this.uistate.get().admin.ui.set({currentConfig : doc });
                this.props.fns.gotoAdmin(this.props);
            }).catch( (err) => {
                console.log("spHome.gotoAdmin, error reading config", err);
                this.uistate.get().admin.ui.set({currentConfig : {} });
                this.props.fns.gotoAdmin(this.props);
            })

        } else {
            this.props.fns.gotoAdmin(this.props);
        }

        // this.alert("Not implemented yet !!", "Information")
    }

    render(){
      return(

        <View>

            <View style={styles.container}>

              <View >
                <TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoContact()} >
                  <View style={[styles.actionButton,
                    {
                      width: 112,
                      height: 112,
                      borderRadius: 56,
                      backgroundColor: '#1abc9c',
                    }
                  ]} >
                  <Icon name={'user'} size={40} color={'white'} />
                  <Text style={{color:"white"}}>Contact</Text>
                  </View>
                </TouchableOpacity>
              </View>


              <View >
                <TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoNeedsAnalysis()} >
                  <View style={[styles.actionButton,
                    {
                      width: 112,
                      height: 112,
                      borderRadius: 56,
                      backgroundColor: '#3498db',
                    }
                  ]} >
                  <Icon name={'cubes'} size={40} color={'white'} />
                  <Text style={{color:"white"}}>FNA</Text>
                  </View>
                </TouchableOpacity>
              </View>


              <View >
                <TouchableOpacity activeOpacity={0.5} onPress={()=> this.gotoQuotation()} >
                  <View style={[styles.actionButton,
                    {
                      width: 112,
                      height: 112,
                      borderRadius: 56,
                      backgroundColor: '#1abc9c',
                    }
                  ]} >
                  <Icon name={'calculator'} size={40} color={'white'} />
                  <Text style={{color:"white"}}>Quotation</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View >
                <TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoProposal()} >
                  <View style={[styles.actionButton,
                    {
                      width: 112,
                      height: 112,
                      borderRadius: 56,
                      backgroundColor: '#3498db',
                    }
                  ]} >
                  <Icon name={'file-text'} size={40} color={'white'} />
                  <Text style={{color:"white"}}>Proposal</Text>
                  </View>
                </TouchableOpacity>
              </View>



              <View >
                <TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoAdmin()} >
                  <View style={[styles.actionButton,
                    {
                      width: 112,
                      height: 112,
                      borderRadius: 56,
                      backgroundColor: '#dd9918',
                    }
                  ]} >
                  <Icon name={'navicon'} size={40} color={'white'} />
                  <Text style={{color:"white"}}>Admin</Text>
                  </View>
                </TouchableOpacity>
              </View>



            </View>
            {/* 2nd row */}
            <View style={styles.container2}>



            </View>



        </View>
      );


        {/*
          <View style={styles.row}>
              <Icon.Button name="user" style={styles.icon} backgroundColor="#3b5998" onPress={(e)=>this.gotoContact(e)}>
                  Contacts
              </Icon.Button>
            </View>
            <View style={styles.row}>
              <Icon.Button name="calculator" style={styles.icon} backgroundColor="#00e08f" onPress={(e)=>this.gotoQuotation(e)}>
                  Quotation
              </Icon.Button>
            </View>

            <View style={styles.row}>
              <Icon.Button name="file-text" style={styles.icon} backgroundColor="#f05998" onPress={(e)=>this.gotoProposal(e)}>
                  Proposal
              </Icon.Button>
            </View>

          <View style={styles.row}>
              <Icon.Button name="wifi" style={styles.icon} backgroundColor="#ccddee" onPress={(e)=>this.gotoSubmission(e)}>
                  e-Submission
              </Icon.Button>
            </View>

            <View style={styles.row}>
              <Icon.Button name="navicon"  style={styles.icon} backgroundColor="blue" onPress={(e)=>this.gotoAdmin(e)}>
                  Administration
              </Icon.Button>
          </View>
        </View>
      );
      */};
    }
} // end SideMenu class

var styles = StyleSheet.create({
  container: {
    paddingTop: 180,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    flexDirection : "row",
    justifyContent : "space-around",
  },

  container2: {
    paddingTop: 100,
    paddingLeft: 90,
    paddingRight: 20,
    flex: 1,
    flexDirection : "row",
    justifyContent : "flex-start",
  },

  icon: {
    width: 64,
    height: 64,
  },
  row: {
    padding: 10,
  },
  overlay: {
//    position: 'absolute',
//    bottom: 0,
//    left: 0,
//    right: 0,
//    top: 0,
    backgroundColor: 'transparent',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 2,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
  },



})

module.exports = SPHomeView;
