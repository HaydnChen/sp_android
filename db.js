var adapter = require("./lokiRNAdapter");
var loki = require("./lokijs");
var api = {};

//var db = new loki('data.json',
var db = new loki('mydata.json',
  {
    autosave:false,
    autosaveInterval:1000,
    adapter:adapter,
    persistenceMethod:"adapter",
  }
);

var dboptions = {
  contacts : {
    proto: Object,
    inflate : function(src,dst){
      var prop;
      for (prop in src){
        if (prop === 'dob'){
          //debugger;
          dst.dob = src.dob ===null ? null : new Date(src.dob);
          // console.log("inflate==> src.dob", src.dob, dst.dob);
        } else {
          dst[prop] = src[prop];
        }
      }
    }
  },
  quotations: {
      proto : Object,
      inflate : function(src, dst) {
          dst = Object.assign(dst,src)
          if (src.policy && src.policy.people) {
              src.policy.people.forEach( (p,index) => {
                  p.dob = moment(p.dob, [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate()
                  dst.policy.people[index] = p;
              })
          }
          if (src.policy && src.policy.main) {
              dst.policy.main.proposal_date = moment(src.policy.main.proposal_date, [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate()
              dst.policy.main.contract_date = moment(src.policy.main.contract_date, [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate()
          }
      }
  },
  proposals: {
      proto : Object,
      inflate : function(src, dst) {
          dst = Object.assign(dst,src)
          if (src.ph && src.ph.dob) {
              dst.ph.dob = moment(src.ph.dob, [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate()
          }
          if (src.policies) {
              src.policies.forEach( (p,index) => {
                  p.policy_date = moment(p.policy_date, [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate()
                  dst.policies[index] = p;
              })
          }
        //   debugger;
          if (src.doctor && src.doctor.questions && src.doctor.questions.visit_date) {
              dst.doctor.questions.visit_date = moment(src.doctor.questions.visit_date, [ moment.ISO_8601, 'D-M-YYYY','YYYY-M-D']).toDate()
            //   console.log("dst.doctor.questions.visit_date", dst.doctor.questions.visit_date);
          }

      }
  },



}

var collectionMap = {};

var db_ready = false;

function loadDB(callback) {
  db.loadDatabase( dboptions, () => {
    let collectn;
    let collections = ["contacts", "quotations","proposals","uistate"];
    collections.forEach( (cname) => {
      collectn = db.getCollection(cname);
      if (collectn === null ){
        db.addCollection(cname);
        collectn = db.getCollection(cname);
      }
    //   console.log("loading from database, collection :", cname, collectn );
      collectionMap[cname] = collectn;
    });
    db_ready = true;
    if (callback) {
      callback("db_ready");
    }
  });
}

// var dbready = true;
// console.log("db -->", db, db.saveDatabase);
// db.saveDatabase((status) => {
//   //dbready = true;
// });


function getDb() { return db }
function getColl(cname) {
  return collectionMap[cname];
}

function uiState(data){
  let collection = getColl("uistate");
  // console.log("uiState, collection ", collection, collectionMap);
  let allrows = collection.find({}), // we can do this as we really expect it to have 1 row in the collection
      state = allrows.length > 0 ? allowrows[0] : undefined;

  if (data) {
    if (data.toJS) { data = data.toJS() }
    if (state) {
      collection.update(data);
    } else {
      collecion.insert(data);
    }
  } else {
    // trying to get the uiState
    return state ? state : null ;

  }
}


// NO LONGER USED !!! , please use getColl ----->
function getCollection(collectionName, callback) {
  // if (!dbready) {
  //   callback(null)
  //   return
  // }
  db.loadDatabase( dboptions , () => {
    var collection = db.getCollection(collectionName);
    if (collection === null) {
      collection = db.addCollection(collectionName);
    }
    callback(db, collection);
  });
}
//api = {uiState:uiState, db_ready: db_ready, getCollection:getCollection, getColl: getColl, getDb: getDb };
// export {uiState, db_ready, getCollection, getColl, getDb, loadDB }
export {uiState, db_ready, getColl, getDb, loadDB }
