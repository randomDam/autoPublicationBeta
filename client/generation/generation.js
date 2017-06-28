
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






Template.generation.helpers({
  pdfDocument : function(){
    return pdfMake.createPdf(docDefinition.get()).open();
  }


})
/*
   {
         // if you specify width, image will scale proportionally
         //       image: 'data:image/jpeg;base64,...encodedContent...',
         //             width: 150
         //                 },
*/

data = new ReactiveVar([])

Template.generation.events({
  'click .myButton': function() {

    var pages = Pages.find().map(function(page){
      var p = [];
      var nbSources = page.sources.length;
      if(nbSources == 1){
        // Une seule source sur cette page
        var r = Math.floor((Math.random() * 3))
        p.push(svgGabarit.get().h[1][r]);    
      }
      if(nbSources == 2){
        // Deux sources sur cette page
        var r = Math.floor((Math.random() * 3))
        p.push(svgGabarit.get().v[2][r][0]);    
        p.push(svgGabarit.get().v[2][r][1]);    
      }
      sources = Pages.rawData(page._id).map(function(s,i){
        x = parseFloat(p[i].x);
        y = parseFloat(p[i].y-p[i].height);
        w = parseFloat(p[i].width);
        h = parseFloat(p[i].height);

        return {
          image: s.rawData , absolutePosition: {x:x, y: y}, width : w, height : h //, absolutePosition:[200,500] //s.content
        }
      })
      return [
        {text: "A", absolutePosition : {x:53.14,y:646.67}},
        sources ,
        {text: page._id, pageBreak: 'after'}
      ]
    });
    

    // Define the pdf-document
    var doc = {
      pageSize : {width:567, height:794},
      content: pages
    };

    // Start the pdf-generation process
    //pdfMake.createPdf(docDefinition).open();
    //docDefinition.set(doc)
    pdfMake.createPdf(doc).getDataUrl(function(outDoc) {
      document.getElementById('pdfV').src = outDoc;
    });
  }
});
