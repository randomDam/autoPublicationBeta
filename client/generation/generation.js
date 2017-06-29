
PrintElemById = function(elem){
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    //mywindow.document.write('<h1>' + document.title  + '</h1>');

    var data = document.getElementById(elem).innerHTML;
    mywindow.document.write(data);
    console.log(data);

    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

printPage = function(){
    $('#page1').printElement();
}

docDefinition = new ReactiveVar();

Template.generation.onRendered(function(){
  console.log("Hello from generation...");



})

Template.stats.helpers({
  nbPage(){
    return Pages.find().count() +1;
  },
  nbSources(){
  
    return Sources.find().count();
  }
});





Template.generation.helpers({
  pdfDocument : function(){
    return pdfMake.createPdf(docDefinition.get()).open();
  }


})

data = new ReactiveVar([])

Template.generation.events({
  'click .myButton1' : function(){
    Meteor.call("getPdfData", function(error, result){
      pdfMake.createPdf(result).getDataUrl(function(outDoc) {
        document.getElementById('pdfV').src = outDoc;
      });
    
    })
  },
  'click .myButton': function() {
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
        p.push(gabarit["h"][1][r]);    
        console.log("1", orientation, p);
      }
      if(nbSources == 2){
        // Deux sources sur cette page
        var r = Math.floor((Math.random() * gabarit[orientation][2].length))
        p.push(gabarit[orientation][2][r][0]);    
        p.push(gabarit[orientation][2][r][1]);    
        console.log("2", p);
      }

      sources = Pages.rawData(page._id).map(function(s,i){
        x = Math.abs(parseFloat(p[i].x));
        y = Math.abs(parseFloat(p[i].y-p[i].height));
        w = Math.abs(parseFloat(p[i].width));
        h = Math.abs(parseFloat(p[i].height));

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
      compress: false,
      // footer: function(currentPage, pageCount) { return currentPage.toString() + ' de ' + pageCount; },
      // header: function(currentPage, pageCount) {
      //   // you can apply any logic and return any valid pdfmake element
      //   return { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' };
      // },
      content: pages
    };

    // Start the pdf-generation process
    //pdfMake.createPdf(doc).open();
    //docDefinition.set(doc)

    pdfMake.createPdf(doc).getDataUrl(function(outDoc) {
      document.getElementById('pdfV').src = outDoc;
    });
  }
});
