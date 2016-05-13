// import {manager, ReactCBLite} from 'react-native-couchbase-lite';
// import {manager, ReactCBLite} from './rn-cblite';
import {manager, ReactCBLite} from './couchbase-lite';

ReactCBLite.init(5984, 'admin', 'pass', e => {
    console.log('initialized');
});
var database = new manager('http://admin:pass@localhost:5984/', 'sp');
//var backup = new manager('http://admin:pass@localhost:5984/', 'sp2');
// var remote = 'http://admin:admin@172.25.15.135:5984/sp';
//var remote = 'http://admin:admin@127.0.0.1:8984/sp';
var remote = 'http://admin:admin@127.0.0.1:5984/sp';
var dbPromise, designPromise;
var gbl = window || global || root;
gbl.dbmanager = manager;
// debugger;

var contactViews = {
    listContacts : {
        "map" : function(doc) {
                    if (doc && doc.doctype === 'contacts') {
                        emit(doc._id, doc);
                    }
        }.toString()
    }
}
var quotationViews = {
    listQuotes : {
        "map" : function(doc) {
                    if (doc && doc.doctype === 'quotations') {
                        emit(doc._id, doc);
                    }
        }.toString()
    }
}
var proposalViews = {
    listProposals : {
        "map" : function(doc) {
                    if (doc && doc.doctype === 'proposals') {
                        emit(doc._id, doc);
                    }
        }.toString()
    }
}
var fnaViews = {
    listFnas : {
        "map" : function(doc) {
                    if (doc && doc.doctype === 'fna') {
                        emit(doc._id, doc);
                    }
        }.toString()
    }
}


function init() {
    // console.log("cblite...init");
    database.makeRequest("GET", database.databaseUrl + "_all_dbs").then((response) => {
        // var promises = [], dbs = [database, backup];
        // if (response.indexOf("sp") < 0 ) {
        //     promises.push( database.createDatabase() );
        // } else {
        //     promises.push({'ok': 1});
        // }
        // if (response.indexOf("sp2") < 0 ) {
        //     promises.push( backup.createDatabase() );
        // } else {
        //     promises.push({'ok': 1});
        // }
        var dbPromise;
        if ((response.indexOf("sp") < 0 )) {
            dbPromise = database.createDatabase()
        } else {
            dbPromise = new Promise((resolve,reject) => {
                resolve({ "ok" : "Exists"})
            })
        }


        dbPromise.then((res) => {
            if ('ok' in res || (res.status === 412)  ) {
                // contacts views
                database.getDesignDocument("contacts").then((res) => {
                    if (res.status === 404) {
                        database.createDesignDocument("contacts", contactViews).then ((res) => {
                            console.log("Created design documents for contacts", res)
                        })
                    }
                })
                // quotation views
                database.getDesignDocument("quotations").then((res) => {
                    if (res.status === 404) {
                        database.createDesignDocument("quotations", quotationViews).then ((res) => {
                            console.log("Created design document for quotations", res)
                        })
                    }
                })
                .catch( (err) => {
                    console.log("unable to find design document for quotations", err)
                })

                // proposal views
                database.getDesignDocument("proposals").then((res) => {
                    if (res.status === 404) {
                        database.createDesignDocument("proposals", proposalViews).then ((res) => {
                            console.log("Created design document for proposals", res)
                        })
                    }
                })
                .catch( (err) => {
                    console.log("Unable to find design document for proposals", err)
                })

                // proposal views
                database.getDesignDocument("fnas").then((res) => {
                    console.log("get design document for fnas", res);
                    if (res.status === 404) {
                        database.createDesignDocument("fnas", fnaViews).then ((res) => {
                            console.log("Created design document for fna", res)
                        })
                    }
                })
                .catch( (err) => {
                    console.log("Unable to find design document for fna", err)
                })


            }
            // do compaction, try to allow time for creation of the views
            var sysConfig = {}
            setTimeout(() => {
                database.compact().then((res) => {
                    console.log("Compaction result", res);
                    database.getDocument("SP-CONFIG").then( ( doc ) => {
                        if (doc.status === 404) {
                            // sysConfig = {};
                            return
                        }
                        if (!res.ok) {
                            return
                        }

                        // let credentials = { username: 'admin', password : 'admin' }
                        let credentials = { username: doc.serverConfig.userid, password : doc.serverConfig.password }
                        let settings = {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            name: credentials.username,
                            password: credentials.password
                          })
                        };


                        let parts = doc.serverConfig.serverUrl.split('//');
                        let url = parts[0] + '//' + credentials.username + ':' + credentials.password + '@' + parts[1];
                        if (url.endsWith('/')) {
                            url = url.substr(0, url.length-1);
                        }
                        let session = url + '/_session';
                        remote = url + '/sp'
                        console.log("cblite---> session", session)
                        // fetch(    'http://admin:admin@127.0.0.1:8984/_session', settings)
                        fetch( session, settings)
                          .then((res) => {
                            console.log("remoteSession, res", res.status, res);
                            // debugger;
                            switch (res.status) {
                              case 200:
                                // start the replication , after getting the session
                                database.replicate('sp', remote, true);
                                database.replicate(remote, 'sp', true)
                                .then((resp) => {
                                    console.log("remote -> sp ", resp);
                                });
                                break;
                              default:
                                break;
                            }
                        })
                        .catch((err) => {
                            console.log("err", err);
                        });

                    }).catch( (err) => {
                        console.log("err", err);
                        // sysConfig = {}
                    })


                    // do some work to replicate this encrypted database

                    // we can replicate the database if we want to see the contents of database sp which is encrypted

                    // database.replicate('sp', 'sp2', false).then((resp) =>{
                    //     console.log("Replication done");
                    // });

                    // database.replicate('sp', remote, true);

                })
            },100);

        })
        .catch((reason) => {
            console.log("Error in creating/opening database", reason);
            throw reason;
        })
    })
    .catch((reason) => {
        console.log("Error in getting database information", reason);
        throw reason;
    })

}
setTimeout(() => {init()}, 700 ); // run with delay, allow time for couchbase database to load up

module.exports = database;
