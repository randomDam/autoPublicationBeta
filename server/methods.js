import { request } from "meteor/froatsnook:request";
import { xml2js } from 'meteor/peerlibrary:xml2js';
index = 0
Meteor.methods({
  "remove-pages" : function(){ },
  "getRawImageData" : function(url){
    var result = request.getSync(url, {encoding: null});
    return result;
    //console.log('data:image/png;base64,' + new Buffer(result.body).toString('base64'))
  
  },
  "getSvgGabarit" : function(){
    var result = request.getSync('http://localhost:3000/gabaritAAA.svg', {encoding:null});
    var jsonResult = xml2js.parseStringSync(result.body);
    console.log(jsonResult);
    return jsonResult;

    
  }
})
