class LokiAdapterError extends Error {}

const TAG = "[LokiAdapter]";
var fs = require('react-native-fs');
var basePath = fs.DocumentDirectoryPath + '/';
var window = global || window;

class LokiAdapter {
    constructor(options) {
        this.options = options;
    }

    saveDatabase(dbname, dbstring, callback) {
        console.log(TAG, "saving database");
        let path = basePath + dbname;
        var blob = this.createBlob(dbstring, "text/plain")
        fs.writeFile(path, blob, 'utf8').then( (success) => {
            callback("ok");
        })
        .catch( (err)=> {
          console.log("LokiAdapter.error --> err", err);
          callback("error");
        })
        //
        // this._getFile(dbname,
        //     (fileEntry) => {
        //         fileEntry.createWriter(
        //             (fileWriter) => {
        //                 fileWriter.onwriteend = () => {
        //                     if (fileWriter.length === 0) {
        //                         var blob = this._createBlob(dbstring, "text/plain");
        //                         fileWriter.write(blob);
        //                         callback();
        //                     }
        //                 };
        //                 fileWriter.truncate(0);
        //
        //             },
        //             (err) => {
        //                 console.error(TAG, "error writing file", err);
        //                 throw new LokiCordovaFSAdapterError("Unable to write file" + JSON.stringify(err));
        //             }
        //         );
        //     },
        //     (err) => {
        //         console.error(TAG, "error getting file", err);
        //         throw new LokiCordovaFSAdapterError("Unable to get file" + JSON.stringify(err));
        //     }
        // );
    }

    loadDatabase(dbname,callback) {
      console.log(TAG, "loading database");
      let path = basePath + dbname;

      fs.readFile(path,'utf8').then( (buf)=> {
        let reader = new FileReader();
        reader.onloadend = (event) => {
          let contents = event.target.result;
          if (contents.length === 0) {
              console.warn(TAG, "could not find database");
              callback(null);
          } else {
              callback(contents);
          }
        }
        reader.readAsText(buf);
      })
      .catch( (err) => {
        console.log(TAG, "error reading file", err);
        callback (new LokiAdapter("Unable to find file" + err.message));
      });
    }

    // loadDatabase(dbname, callback) {
    //     console.log(TAG, "loading database");
    //     this._getFile(dbname,
    //         (fileEntry) => {
    //             fileEntry.file((file) => {
    //                 var reader = new FileReader();
    //                 reader.onloadend = (event) => {
    //                     var contents = event.target.result;
    //                     if (contents.length === 0) {
    //                         console.warn(TAG, "couldn't find database");
    //                         callback(null);
    //                     }
    //                     else {
    //                         callback(contents);
    //                     }
    //                 };
    //                 reader.readAsText(file);
    //             }, (err) => {
    //                 console.error(TAG, "error reading file", err);
    //                 callback(new LokiCordovaFSAdapterError("Unable to read file" + err.message));
    //             });
    //         },
    //         (err) => {
    //             console.error(TAG, "error getting file", err);
    //             callback(new LokiCordovaFSAdapterError("Unable to get file: " + err.message));
    //         }
    //     );
    // }
    //
    // getFile(name,handleSuccess,handleError){
    //   let path = fs.DocumentDirectoryPath + '/data.db';
    //
    //
    // }
    //
    // _getFile(name, handleSuccess, handleError) {
    //     window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
    //         (dir) => {
    //             let fileName = this.options.prefix + "__" + name;
    //             dir.getFile(fileName, {create: true}, handleSuccess, handleError);
    //         },
    //         (err) => {
    //             throw new LokiCordovaFSAdapterError(
    //                 "Unable to resolve local file system URL" + JSON.stringify(err)
    //             );
    //         }
    //     );
    // }

    // adapted from http://stackoverflow.com/questions/15293694/blob-constructor-browser-compatibility
    createBlob(data, datatype) {
        let blob;

        try {
            blob = new Blob([data], {type: datatype});
        }
        catch (err) {
            window.BlobBuilder = window.BlobBuilder ||
                    window.WebKitBlobBuilder ||
                    window.MozBlobBuilder ||
                    window.MSBlobBuilder;

            if (err.name === "TypeError" && window.BlobBuilder) {
                var bb = new window.BlobBuilder();
                bb.append(data);
                blob = bb.getBlob(datatype);
            }
            else if (err.name === "InvalidStateError") {
                // InvalidStateError (tested on FF13 WinXP)
                blob = new Blob([data], {type: datatype});
            }
            else {
                // We're screwed, blob constructor unsupported entirely
                throw new LokiCordovaFSAdapterError(
                    "Unable to create blob" + JSON.stringify(err)
                );
            }
        }
        return blob;
    }
}
var adapter = new LokiAdapter;

export default adapter;
