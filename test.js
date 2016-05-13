var lo = require('lodash');
var data = { a:1, b: { c:3,g:{x:11,y:12}, d:{gg:2,ee:4}, ee:[2,1,22] } }


var fn = function(parent, oo) {
    var result = [];
    var reslist=[];
    var res, sorted, sorted2
    // console.log("processing object", oo)
    var arrfn = function(parent,arr) {
        var templist = [], res, wlist=[];
        var sorted2 = lo.sortBy(arr);
        sorted2.forEach(function(item,index){
            var newkey = parent + '>' + index ;
            if (lo.isArray(item)) {
                res = arrfn(newkey, item)
            } else if (lo.isPlainObject(item)) {
                res = fn(newkey , item)
            } else {
                res = [ newkey + ':' + item]
            }
            res.forEach( function(i) {
                templist.push(i)
            })
        })
        return templist;
    }

    lo.forOwn(oo, function(value,key)  {
        var newkey = parent + '>' + key ;
        if ( lo.isArray(value)) {
            reslist = arrfn(newkey, value);

            result = result.concat(reslist)

        } else if (lo.isPlainObject(value)) {
            var keys=[], values=[], sortedkeys=[];
            sorted = lo.sortBy( lo.keys(value));
            // console.log("value is object *** ", value, key, newkey, sorted)

            wlist = [];
            sorted.forEach(function(kkk){

                if (lo.isArray(value[kkk])) {
                    res = arrfn(newkey + '>' + kkk , value[kkk])
                    // console.log("result from arrfn", res);

                } else if (lo.isPlainObject(value[kkk])) {
                    // console.log("Calling another object, newkey", newkey, value[kkk])
                    res = fn(newkey + '>' + kkk , value[kkk])
                } else {
                    res = [ newkey + '>' + kkk + ':' + value[kkk]]
                }
                // console.log("value is object ---> , res for ", kkk , res);
                res.forEach( function(i) {
                    wlist.push(i)
                })
                // wlist.push(newkey +  res);
            });
            result = result.concat(wlist)

        } else {
            // console.log("value is normal", newkey, value)
            result.push( newkey + ':' + value)

        }

    })
    return result
}
console.log( lo.sortBy(fn('',data)));

    //
    //
    //
    //
    //
    // console.log("start....",oo)
    //     var key = parent + '>' + k;
    //     var res=[];
    //     if (lo.isArray(v)) {
    //         console.log("dealing with array", v)
    //         v.forEach( function(item) {
    //             if (lo.isArray(item)) {
    //                 result.push( key + ':' + String( fn(item) ) )
    //             } else if (lo.isObject(item)) {
    //
    //                 result.push( key + ':' + String( fn(item) ) )
    //             } else {
    //                 result.push( key + ':' + String(item) )
    //             }
    //         })
    //         //
    //         // result.push( String(k) + ':[' +  String(v) + ']'); v = {a:1,b:2}
    //     } else if (lo.isObject(v)) {
    //         console.log("processing object", k, v)
    //         var sorted = lo.sortBy( lo.keys(v) );
    //         var keys = [], values = [], vv=null, temp;
    //         lo.forEach(sorted, function(kk){
    //             keys.push(kk+'');
    //             vv = v[kk];
    //             if (lo.isArray(vv) || lo.isObject(vv) ) {
    //                 temp = fn(key, vv);
    //                 console.log("processing nested", vv, temp)
    //                 var wlist=[];
    //                 lo.forEach(lo.sortBy(temp), function(ii){
    //                     wlist.push(ii)
    //                 })
    //                 temp = wlist;
    //             } else { temp = v[kk] + ''}
    //             values.push(temp)
    //         })
    //         lo.forEach( lo.zip(keys,values), function(kk,vv) {
    //                 result.push( key + '>' + kk + ':' + vv )
    //         })
    //     } else {
    //         result.push(key + ':' + String(v));
    //     }
    // })
    // return result
// }
// }
// console.log( lo.sortBy(fn('>',data)));
