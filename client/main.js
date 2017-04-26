import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  //this.counter = new ReactiveVar(0);
  Session.set("MODE","none");
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});




Template.body.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  }
  ,
  'click #source'(event, instance) {
    // increment the counter when button is clicked
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
