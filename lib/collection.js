
//SERVEUR SIDE
var pathMedia = Meteor.absolutePath + '/medias';

// Les pages contiennent plusieurs sources
Pages = new Mongo.Collection("pages")


this.Medias = new FilesCollection({
    debug: false,
    collectionName: 'Images',
    storagePath: pathMedia,
    allowClientCode: true, // Disallow remove files from Client
    onBeforeUpload: function (file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 1024*1024*20 && /png|jpg|jpeg|txt/i.test(file.extension)) {
            console.log("TRUEEEEE");
            return true;
        } else {
            return 'Please upload image, with size equal or less than 10MB';
        }
    },
    onBeforeRemove: function () {
        return true;
    },
    onAfterUpload: function(fileRef) {
      console.log(fileRef._id)
      Sources.insert({media_id:fileRef._id,css:"",content:""});
    }
});

this.Sources = new Mongo.Collection("sources");
this.Sources.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
