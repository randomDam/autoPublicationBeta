import { request } from "meteor/froatsnook:request";
import { xml2js } from 'meteor/peerlibrary:xml2js';


svgGabarit = new ReactiveVar(null)

index = 0
Meteor.methods({
  "remove-pages" : function(){Pages.remove({}); },
  "getRawImageData" : function(url){
    var result = request.getSync(url, {encoding: null});
    return result;
    //console.log('data:image/png;base64,' + new Buffer(result.body).toString('base64'))
  
  },
  "getSvgGabarit" : function(){
    var result = request.getSync('http://localhost:3000/gabaritAAA.svg', {encoding:null});
    var jsonResult = xml2js.parseStringSync(result.body);
    console.log(jsonResult);
    
    transformSvgGabarit(jsonResult);
    return jsonResult;

    
  },

  "getPdfData" : function(){
    var pagesCount = Pages.find().count();
    var pages = Pages.find({},{sort: {position: 1}}).map(function(page,indexPage){
      var nbSources = page.sources.length;

      var orientation = ""
      var ori = Math.floor(Math.random() * 2)
      if(ori == 0) orientation = "v";
      else orientation = "h";

      var gabarit = svgGabarit.get();
      var p = [];

      if(nbSources == 1){
        // Une seule source sur cette page
        var r = Math.floor((Math.random() * gabarit[orientation][1].length ))
        p.push(gabarit[orientation][1][r]);    
        console.log("1", p);
      }
      if(nbSources == 2){
        // Deux sources sur cette page
        var r = Math.floor((Math.random() * gabarit[orientation][2].length))
        p.push(gabarit[orientation][2][r][0]);    
        p.push(gabarit[orientation][2][r][1]);    
        console.log("2", p);
      }

      sources = Pages.rawData(page._id).map(function(s,i){
        x = parseFloat(p[i].x);
        y = parseFloat(p[i].y-p[i].height);
        w = parseFloat(p[i].width);
        h = parseFloat(p[i].height);

        return {
          image: s.rawData , absolutePosition: {x:x, y: y}, fit:[w,h] //width : w, height : h //, absolutePosition:[200,500] //s.content
        }
      })
      if(sources.length <= 0){
        return [ {text: "", pageBreak: 'after'} ]
      
      } else {
        if(indexPage < pagesCount) b = "after";
        else b = "";
        return [ sources , {text: "", pageBreak: b} ]
      }
    });
    

    // Define the pdf-document
    var doc = {
      pageSize : {width:567, height:794},
      content: pages
    };

    return doc;
  }
  
  
  
  
  

})


function transformSvgGabarit(result){
    var data = result.svg.g;
    var index = 0;
    _.each(data, function(layer){
      console.log(index, layer.$["inkscape:label"]);
      index++;
    });

    // {x:1, y:1, width:12, height:12}

    var o = {
      "h" : {
        "1" : [data[1].rect[0].$,data[2].rect[0].$,data[3].rect[0].$,data[4].rect[0].$],
        "2" : [[data[8].rect[0].$,data[8].rect[1].$],[data[9].rect[0].$,data[9].rect[1].$],]
      },
      "v" : {
        "1" : [data[5].rect[0].$],
        "2" : [[data[6].rect[0].$,data[6].rect[1].$],[data[7].rect[0].$,data[7].rect[1].$]]
      }
    }
    console.log(o);
    svgGabarit.set(o);




}
