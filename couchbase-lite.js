var { NativeModules } = require('react-native');
var ReactCBLite = NativeModules.ReactCBLite;

var base64 = require('base-64');

var manager = function (databaseUrl, databaseName) {
  this.authHeader = "Basic " + base64.encode(databaseUrl.split("//")[1].split('@')[0]);
  this.databaseUrl = databaseUrl;
  this.databaseName = databaseName;
};

manager.prototype = {

  /**
   * Construct a new Couchbase object given a database URL and database name
   *
   * @returns {*|promise}
   */
  createDatabase: function() {
    return this.makeRequest("PUT", this.databaseUrl + this.databaseName, null, null);
  },
  /**
    * get database information -- can use this function to just check if authorized to access the database
    * @returns {*|promise}
    */
    getDatabase: function() {
        return this.makeRequest("GET", this.databaseUrl + this.databaseName, null, null);
    },


  /**
   * Delete the database
   *
   * @returns {*|promise}
   */
  deleteDatabase: function() {
    return this.makeRequest("DELETE", this.databaseUrl + this.databaseName, null, null);
  },

  /**
   * Create a new design document with views
   *
   * @param    string designDocumentName
   * @param    object designDocumentViews
   * @return   promise
   */
  createDesignDocument: function(designDocumentName, designDocumentViews) {
    var data = {
      views: designDocumentViews
    };
    return this.makeRequest("PUT", this.databaseUrl + this.databaseName + "/_design/" + designDocumentName, {} , data);
  },

  /**
   * Get a design document and all views associated to insert
   *
   * @param    string designDocumentName
   * @return   promise
   */
  getDesignDocument: function(designDocumentName) {
    // return this.makeRequest("GET", this.databaseUrl + this.databaseName + "/" + designDocumentName);
    return this.makeRequest("GET", this.databaseUrl + this.databaseName + "/_design/" + designDocumentName);
  },

  /**
   * Query a particular database view. Options for the query ('descending', 'limit', 'startkey', 'endkey' etc.)
   * can be specified using query string parameters.  Query string values are json objects and are URL encoded within,
   * for example:
   *
   *  let options = {
   *    descending: true,
   *    startkey: [docId, {}],
   *    endkey: [docId]
   *  };
   *
   *  return queryView('design_doc_name', 'view_name', options);
   *
   * @param    string designDocumentName
   * @param    string viewName
   * @param    object queryStringParameters
   * @return   promise
   */
  queryView: function(designDocumentName, viewName, queryStringParameters) {
    var url = this.databaseUrl + this.databaseName + "/_design/" + designDocumentName + "/_view/" + viewName;

    if(queryStringParameters) {
      for(var key in queryStringParameters) {
        var value = queryStringParameters[key];
        queryStringParameters[key] = JSON.stringify(value);
      }
    }

    return this.makeRequest("GET", url, queryStringParameters);
  },

  /**
   * Create a new database document
   *
   * @param object jsonDocument
   * @returns {*|promise}
   */
  createDocument: function (jsonDocument) {
    return this.makeRequest("POST", this.databaseUrl + this.databaseName, null, jsonDocument);
  },
  /**
   * Create a new database document with key specified
   *
   * @param object jsonDocument
   * @returns {*|promise}
   */
  createDocumentWithKey: function (jsonDocument, key) {
    return this.makeRequest("PUT", this.databaseUrl + this.databaseName + "/" + key , null, jsonDocument);
  },

  /**
   * Add, update, or delete multiple documents to a database in a single request
   *
   * @param object jsonDocuments array
   * @returns {*|promise}
   */
  modifyDocuments: function (jsonDocuments) {
    return this.makeRequest("POST", this.databaseUrl + this.databaseName + '/_bulk_docs', null, {docs: jsonDocuments});
  },

  /**
   * Creates a new document or creates a new revision of an existing document
   *
   * @param object jsonDocument
   * @param string documentRevision (optional)
   * @returns {*|promise}
   */
  updateDocument: function (jsonDocument, documentRevision) {
    var options = {};
    if(documentRevision) {
        options.rev = documentRevision;
    }

    return this.makeRequest("PUT", this.databaseUrl + this.databaseName + "/" + jsonDocument._id, options, jsonDocument);

  },
  // added by yc

  saveAttachment: function (documentId, documentRevision, attachmentName, attachment,mimetype ) {
    var options = {}
    var extraOptions = { mimetype: mimetype ? mimetype : 'text/plain' }

    options.rev = documentRevision;

    return this.makeRequest("PUT", this.databaseUrl + this.databaseName + "/" + documentId + "/" + attachmentName,
    options , attachment, extraOptions);
  },
  getAttachment: function (documentId, documentRevision, attachmentName, accept) {
    var options = {},
        extraOptions = {};
    extraOptions = { accept: accept ? accept : 'text/plain', mimetype : 'text/plain'}
    // extraOptions = { accept: accept ? accept : 'text/plain'}

    options.rev = documentRevision;


    return this.makeRequest("GET", this.databaseUrl + this.databaseName + "/" + documentId + "/" + attachmentName, options, null, extraOptions);
  },
  compact: function () {
    // console.log("compaction request", this.databaseUrl + this.databaseName + "/_compact")
    return this.makeRequest("POST", this.databaseUrl + this.databaseName + "/_compact");
  },
  // end yc
  /**
   * Delete a particular document based on its id and revision
   *
   * @param documentId
   * @param documentRevision
   * @return promise
   */
  deleteDocument: function(documentId, documentRevision) {
    return this.makeRequest("DELETE", this.databaseUrl + this.databaseName + "/" + documentId, {rev: documentRevision});
  },

  /**
   * Get a document with optional revision from the database
   *
   * @param    string documentId
   * @param    string revision (optional)
   * @return   promise
   */
  getDocument: function(documentId, rev) {
    let options = {};
    if(rev) {
      options.rev = rev;
    }
    return this.makeRequest("GET", this.databaseUrl + this.databaseName + "/" + documentId, options);
  },

  /**
   * Get all documents from the database
   *
   * @returns {*|promise}
   */
  getAllDocuments: function() {
    return this.makeRequest("GET", this.databaseUrl + this.databaseName + "/_all_docs", {include_docs: true});
  },

  /**
   * Get all conflicts
   *
   * @returns {*|promise}
   */
  getAllDocumentConflicts: function() {
    return this.makeRequest("GET", this.databaseUrl + this.databaseName + "/_all_docs", {only_conflicts: true});
  },

  /**
   * Replicate in a single direction whether that be remote from local or local to remote.
   *
   * @param source
   * @param target
   * @param continuous
   * @returns {*|promise}
   */
  replicate: function(source, target, continuous) {
    var replicateUrl = this.databaseUrl + "_replicate";

    return this.makeRequest("POST", replicateUrl, {}, {
      source: source,
      target: target,
      continuous: continuous
    });
  },

  /**
   * Make a RESTful request to an endpoint while providing parameters or data or both
   *
   * @param string method
   * @param string url
   * @param object params
   * @param object data
   * @returns {*|promise}
   */
  makeRequest: function(method, url, queryStringParameters, data, extraOptions) {
    var settings = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.authHeader
      }
    };
    if (extraOptions && extraOptions.mimetype) {
        settings.headers['Content-Type'] = extraOptions.mimetype;
    }
    if (extraOptions && extraOptions.accept) {
        settings.headers['Accept'] = extraOptions.accept;
    }

    var queryString = "";

    if(queryStringParameters) {
      var parts = [];

      for(var key in queryStringParameters) {
        var value = queryStringParameters[key];
        var part = key + "=" + encodeURIComponent(value);
        parts.push(part);
      }

      if(parts.length > 0) {
          queryString = "?" + parts.join("&");
      }
    }

    var fullUrl = url + queryString;

    if (data) {
      if (extraOptions && extraOptions.raw ) {
          settings.body = data;
      } else {
          settings.body = JSON.stringify(data);
      }
    }
    // console.log(fullUrl, JSON.stringify(settings));
    return fetch(fullUrl, settings).then((res) => {
      if (res.status == 401) {
        console.warn(res);

        throw new Error("Not authorized to access '" + fullUrl + "' [" + res.status + "]");
      }
      return res.json();
    }).catch((err) => {
        throw new Error("http error for '" + fullUrl + "', caused by => " + err);
    });
},

};






module.exports = {manager, ReactCBLite};
