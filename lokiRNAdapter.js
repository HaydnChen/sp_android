class LokiRNAdapterError extends Error {}

const TAG = "[LokiRNAdapter]";
var fs = require('react-native-fs'),
    pako = require('pako');

// var basePath = "/Users/ycloh/" ;//fs.DocumentDirectoryPath + '/';
var basePath = fs.DocumentDirectoryPath + '/';
var window = global || window;

function lokiRNAdapter() {}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//**blob to dataURL**
function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {
        callback(e.target.result);
    }
    a.readAsDataURL(blob);
}

/* for converting Uint8Array to string and vice versa
   this could be for case where we use pako with type of Uint8Array -- refer docs for pako
*/
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 1 bytes for each char
  var bufView = new Uint16Array(buf);
  var strLen = str.length;
  for (var i=0; i < strLen;  i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function readFile(path,callback) {
    fs.readFile(path,'utf8').then( (buf)=> {

      if (buf.length === 0) { callback(''); return }
      // decompress data
      let data = buf.length === 0 ? '' : buf ;
      // let restored = JSON.parse(pako.inflate(data, { to: 'string' }));
      let restored = pako.inflate(data, { to: 'string' });
      callback(restored);


      // if (buf.length === 0) {
      //     // console.warn(TAG, "could not find database");
      //     callback('');
      // } else {
      //     callback(buf);
      // }
      // console.log("readFile, buf", buf);



      // ALTERNATIVELY

      // if (buf.length > 0) {
      //     let blob = dataURLtoBlob(buf);
      //     let reader = new FileReader();
      //
      //     reader.onloadend = (event) => {
      //       let contents = event.target.result;
      //       if (contents.length === 0) {
      //           console.warn(TAG, "could not find database");
      //           callback(null);
      //       } else {
      //           callback(contents);
      //       }
      //     }
      //     reader.readAsText(blob);
      // } else {
      //     callback(null);
      // }

    })
    .catch( (err) => {
      console.log(TAG, "error reading file", err);
      callback (new lokiRNAdapter("Unable to find file" + err.message));
    });
}

lokiRNAdapter.prototype.loadDatabase = function loadDatabase(dbname, callback) {
  let path = basePath + dbname;
   //console.log("path", path);
   // if file does not exist, create it
   fs.stat(path).then(() => {
       readFile(path, callback)
   }).catch((err) => {
       if (err.code === 260){
           fs.writeFile(path,'','utf8').then(()=> {
               readFile(path,callback)
           })
       }
   })



  // fs.readFile(path,'utf8').then( (buf)=> {
};

lokiRNAdapter.prototype.saveDatabase = function saveDatabase(dbname, dbstring, callback) {
    // console.log("saving database dbstring type", Object.prototype.toString.call(dbstring));
    // try compressing the data using pako
    let data = pako.deflate( dbstring, {to:'string'});
    // let data = pako.deflate( JSON.stringify( dbstring), {to:'string'});

    let path = basePath + dbname;
    fs.writeFile(path, data , 'utf8').then( (success) => {
        callback("ok");
     })
    .catch( (err)=> {
      console.log("lokiRNAdapter.error --> err", err);
      callback("error");
    }).done()

  // console.log(TAG, "saving database", dbstring);
  // var blob = createBlob(dbstring, "text/plain");
  // blobToDataURL(blob, (dataurl) => {
  //     console.log("blob to save", blob, Object.prototype.toString.call(dataurl));
  //     fs.writeFile(path, dataurl, 'utf8').then( (success) => {
  //         callback("ok");
  //      })
  //     .catch( (err)=> {
  //       console.log("LokiRNAdapter.error --> err", err);
  //       callback("error");
  //     }).done()
  // });

};

function createBlob(data, datatype) {
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
            throw new Error(
                "Unable to create blob" + JSON.stringify(err)
            );
        }
    }
    return blob;
}
module.exports = new lokiRNAdapter();
//exports.lokiRNAdapter = lokiRNAdapter;
