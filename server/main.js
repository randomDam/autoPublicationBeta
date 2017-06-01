import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  if(Pages.find().count() == 0){
    Pages.insert({
      title : "Page 1",
      content : "<b>Ceci <br />est un contenu !</b>",
      css : "background-color:red;"

    })

    Pages.insert({
      title : "Page 2",
      content : "<b>Ceci <br />est un contenu !</b>",
      css : "background-color:purple;"

    })


  }
});
