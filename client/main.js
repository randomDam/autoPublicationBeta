import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Session.setDefault("MODE", "bob")

function populate(){
  Pages.remove({})
  _.each(Sources.find().fetch(), function(d){
    Pages.insert({position: index, sources:[d]})
    index++;
    console.log(d)
  })


}


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
