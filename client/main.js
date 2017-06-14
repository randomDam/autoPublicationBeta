import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

function populate(){
  Pages.remove({})
  _.each(Sources.find().fetch(), function(d){
    Pages.insert({position: index, sources:[d]})
    index++;
    console.log(d)
  })
  

}


Template.body.events({

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
