var React = require('react-native');
var db = require("./db");
var _uistate;
db.loadDB( ()  => {
  Globals.vars.uiState = require('./state');
  // set the spinner to vanish and say that the app is now ready
})

var Globals = {

    vars: {
        _: require('lodash'),
        moment : require('moment'),
        AppRegistry: React.AppRegistry,
        getUiState : () => { return this.uiState } ,
        uiState : null


    },
    load: function(){
        var self = this;
        var _ = self.vars._;
        _.map(self.vars, function(v,k){
            window[k] = v;
        });
        return window;
    },
    set : function(k,v ) {
        var self = this;
        self.vars[k] = v;
    }

}
module.exports = Globals;
