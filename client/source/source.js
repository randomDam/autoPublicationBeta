
Template.uploadForm.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
});

Template.uploadedFiles.onRendered(function() {
    console.log("rendered : "  +$(".mediaBloc").length);

    //organise();
    //orderItems();
});


Template.sourcesView.helpers({
  hasPages : function(){
    if(Pages.find().count()>0) return true
    return false
  },
  pages : function(){
    return Pages.find();

  },
  doneTrigger: function() {
    Meteor.defer(function() {
        //organise();
        //orderItems();
    });
    return null;
  },
  file : function(){
    return Medias.findOne({_id:this.media_id})
  }

});


//-----------------------------------------------------------------------------
// organiser et ordonner les items (media box)
//-----------------------------------------------------------------------------

Template.uploadForm.helpers({
    currentUpload: function() {
        return Template.instance().currentUpload.get();
    }
});


Template.uploadedFiles.helpers({
    uploadedFilesImages: function() {
        return Medias.find();
    },
    isSelected: function(id) {
        //console.log("id"+id);

        if (Session.get("current") == id) {
            return "selected";
        } else {
            return "";
        }
    }
});

Session.setDefault("currentSourceId", {})

Template.sourcesView.events({
    "click .edit": function(event, template){
      console.log(this)
        Session.set("currentSourceId", this.source_id);
        //Blaze.render(Template.modalEdit, $("#main")[0]);
        var modal = document.getElementById("myModal")
        modal.style.display = "block"
    }
});


fileList = null;
templateUp = null;

Template.uploadForm.events({
    'change #fileInput': function(e, template) {
        if (e.currentTarget.files && e.currentTarget.files[0]) {

            templateUp = template;

            if (e.currentTarget.files && e.currentTarget.files[0]) {
                // We upload only one file, in case
                // there was multiple files selected
                fileList = [];

                for (var i = 0; i < e.currentTarget.files.length; i++) {
                    fileList.push(e.currentTarget.files[i]);
                }

                upLoadFonction(fileList[0]);
            }
        }
    }
});


upLoadFonction = function(file) {

    if (file) {
        var uploadInstance = Medias.insert({
            file: file,
            //isBase64: true,
            streams: 'dynamic',
            chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
            templateUp.currentUpload.set(this);
        });

        uploadInstance.on('end', function(error, fileObj) {
            if (error) {
                console.log('Error during upload: ' + error.reason);
            } else {
                console.log('File "' + fileObj.name + '" successfully uploaded');
                fileList.splice(0, 1);
                console.log(fileList);
                if (fileList.length > 0) upLoadFonction(fileList[0]);
            }
            templateUp.currentUpload.set(false);
        });

        uploadInstance.start();
    }
}
