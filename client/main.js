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
