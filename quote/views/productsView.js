'use strict'

var React = require('react-native')
var {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Easing,
  ListView,
  TouchableHighlight,
} = React

var deviceWidth = Dimensions.get('window').width;
var Icon = require('react-native-vector-icons/FontAwesome');

export default class ProductsView extends React.Component {
    constructor(props){
      super(props);
      this.uistate = require("../../state");
      this.state = this.getInitState();
    }
    getInitState(){
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2 ,
          sectionHeaderHasChanged: (s1,s2) => s1 !== s2 ,
          getSectionHeaderData : (data,s) => s ,
          getRowData: (data, s, r) => data[s][r]
        });
      let {data, sections, rows} = this.getListData();
      return {
        dataSource: ds.cloneWithRowsAndSections(data, sections, rows),
      }
    }

    getListData(){
        let Global = window || global || root ,
            result = { data : {} , sections : [], rows:[]},
            plans = Global.api.availablePlans(),
            sectionid, pos;
        this.planMap = {};
        plans.forEach( (main) => {
            sectionid = main.benefit_type === '41' ? 'Unit Link' : 'Traditional' ;
            pos = result.sections.indexOf(sectionid);

            if (pos < 0) {
                result.sections.push(sectionid);
                result.rows.push([]); // initialize an empty list for this section
                result.data[sectionid] = {};
                pos = result.sections.length - 1;
            }
            result.rows[pos].push(main.internal_id);
            result.data[sectionid][main.internal_id] = main.product_name + ' (' + main.internal_id + ')';;
            this.planMap[main.internal_id] = main;
        });
        return result;
    }

    componentDidMount() {
        console.log("productsView.componentDidMount ");
    }
    renderRow(data, sectionId, rowId) {

      let currentMain = this.uistate.get().quote.current_main, bgcolor='white';
      if (currentMain.internal_id === rowId) {
          bgcolor = '#cceeff';
      }
    //   console.log("bgcolor **", bgcolor, data, rowId)
      return (
        <TouchableHighlight onPress={() => this.pressRow(rowId)}>
          <View>
            <View style={[styles.row,{backgroundColor:bgcolor}] }>

              <Text>{data}</Text>

            </View>
            <View style={styles.separator} />
          </View>
        </TouchableHighlight>
      );
    }
    renderSectionHeader(sectionData, sectionId) {
        return (
            <View style={styles.section} >
                <Text style={styles.sectionText}> {sectionId} </Text>
            </View>
        );

    }

    pressRow(rowId) {
      console.log("ProductsView.pressRow --> rowId", rowId, this.planMap[rowId]);

      this.props.fns.gotoTab(2, this.planMap[rowId]);
      // if (rowId === '0') {
      //   console.log("Navigate to home")
      //   this.props.fns.goHome();
      // } else if (rowId === '1') {
      //   this.props.fns.gotoContacts();
      // } else if (rowId === '2') {
      //   this.props.fns.gotoIllustration();
      // }
    }
    // renderRow={ (rowData,sectionId,rowId) => this.renderRow(rowData,sectionId,rowId) }

    render() {
    //   let currentMain = this.uistate.get().quote.current_main,
    //       heading;
    //   if (currentMain.internal_id) {
    //       heading = "Product selection - currently select"
    //   }

      return(
        <View style={{flex:1,backgroundColor: '#F6F6F6', paddingTop:20}}>
          <Text style={{fontSize:16}}>Products Selection</Text>

          <ListView
              dataSource={this.state.dataSource}
              renderRow={ this.renderRow.bind(this) }
              renderSectionHeader={ (sectionData, sectionId) => this.renderSectionHeader(sectionData, sectionId) }
            />
        </View>
      );
    }
} // end SideMenu class

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // center: {
  //   flex: 1,
  //   backgroundColor: '#FFFFFF',
  // },
  separator: {
    height: 2,
    backgroundColor: '#CCCCCC',
  },
  icon: {
    paddingRight: 10,
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
  section: {
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'flex-start',
       padding: 6,
      //  backgroundColor: '#2196F3'
       backgroundColor: '#0296c3'
   },
   sectionText: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
  // left: {
  //   position: 'absolute',
  //   top:0,
  //   left:0,
  //   bottom:0,
  //   right: 0,
  //   backgroundColor: '#FFFFFF',
  // },
})
