// https://github.com/NilsDannemann/meteor-pdfmake


import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import { HTTP } from 'meteor/http'

Session.setDefault("MODE", "bob")

function populate(){
  //Pages.remove({})
    Meteor.call("remove-pages", function(err,res){
      console.log(err, res)
    
    
    })


}


Template.body.onRendered(function(){
  console.log("Hello from body...");
  Meteor.call("getSvgGabarit", function(error, result){
    var data = result.svg.g;
    var index = 0;
    _.each(data, function(layer){
      console.log(index, layer);
      index++;
    });

    // {x:1, y:1, width:12, height:12}

    var o = {
      "h" : {
        "1" : [data[1].rect[0].$,data[2].rect[0].$,data[3].rect[0].$,data[4].rect[0].$],
        "2" : []
      },
      "v" : {
        "1" : [data[5].rect[0].$],
        "2" : [[data[6].rect[0].$,data[6].rect[1].$],[data[7].rect[0].$,data[7].rect[1].$],[data[8].rect[0].$,data[8].rect[1].$],[data[9].rect[0].$,data[9].rect[1].$]]
      }
    }
    console.log(o);

    /*
    for(i=1 ; i < 5 ; i++){
      var d = data[i].rect[0].$;
      d.x = parseFloat(d.x);
      d.y = parseFloat(d.y);
      d.width = parseFloat(d.width);
      d.height = parseFloat(d.height);
      o.h["1"][i-1] = d
    }

    for(i=1 ; i < 5 ; i++){
      var d = data[i].rect[0].$;
      d.x = parseFloat(d.x);
      d.y = parseFloat(d.y);
      d.width = parseFloat(d.width);
      d.height = parseFloat(d.height);
      o.v["2"][i-6] = d
    }
    */

    svgGabarit.set(o);
  });

})


Template.body.events({

  'click #bob'(event, instance) {
    // increment the counter when button is clicked
    console.log("page bob!");
    Session.set("MODE","bob");
  },
  'click #about'(event, instance) {
    // increment the counter when button is clicked
    console.log("Présentation!");
    Session.set("MODE","about");
  },
  'click #source'(event, instance) {
    // increment the counter when button is clicked
        populate()
    console.log("source!");
    Session.set("MODE","source");
  },
  'click #archives'(event, instance) {
  // increment the counter when button is clicked
  console.log("archvives!");
  Session.set("MODE","archives");
},
  'click #generation'(event, instance) {
    // increment the counter when button is clicked
    console.log("generation!");
    Session.set("MODE","generation");
  }
});


Template.body.helpers({
    getMode(who){
        var r = Session.get("MODE");
        if(r==who){
            return true;
        }else{
            return false;
        }
    },
});
