const apis = "https://en.wikipedia.org/w/api.php?action=query&generator=allpages&gapfrom=";
let userInput; 
const format = "&&format=json&callback=?";

let wiki;

function scrollUp() {  
  $('#inputField').animate({'padding-top': '75'}, 400);
  $('#more-button, #results').css({'display' : 'block'});
} 

function getWiki(url){ $.ajax({
        type: 'GET',
        url: url, 
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function(response){  
            var responseObj = response.query.pages;   
            var genKeys = Object.keys(response.query.pages);  
            $.each(genKeys, function(i, v){ 
              userInput = response.continue.gapcontinue;
              var title;  
              var titleOriginal;
              var titleSplit;  
              var wikiURL = "https://en.wikipedia.org/wiki/";
              var callback = "&callback=?"; 
              var extractJoin;
              var extractArr = [];
              var extractsUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=";
              title = responseObj[v].title; 
              titleOriginal = title;
              titleSplit = title.split(''); 
              for (i=0; i<titleSplit.length; i++){
                if (titleSplit[i] === ' ') {
                  titleSplit[i] = '_';
                }
                if (titleSplit[i] === "'"){
                  titleSplit[i] = '%27';
                }
              }
              title = titleSplit.join(''); 
              extractsUrl = extractsUrl + title + callback;  
              $.ajax({
                type: 'GET',
                url: extractsUrl, 
                contentType: "application/json; charset=utf-8",
                async: false,
                dataType: "json",
                success: function(res){   
                  var extractSplit = res.query.pages[v].extract.split(' ');  
                  
                  if(res.query.pages[v].extract.length > 1 && res.query.pages[v].extract.slice(0, 18) != "This is a redirect" ) { 
                    for(k=0; k<22; k++){
                      extractArr.push(extractSplit[k]);
                    } 
                    extractJoin = extractArr.join(' '); 
                  } 
                  
                  else {
                    extractJoin = "";
                  } 
                  
                  $('#results').append(
                    "<div class='article'>" +
                    "<p class='title'>" +
                    titleOriginal +  
                    "</p>" +
                    "<hr/>" + 
                    "<p class='title'>" + 
                    extractJoin + 
                    "</p>" +
                    "<a id='link' target='blank' href='" +
                      wikiURL + title +
                      "'><p class='link'>Link</p></a>" +
                    "</div>"
                  );
                  
                },
                error: function(xhr){
         
                }
              });
            }); 
        },
        error: function(xhr){
         
        }
  }); 
}
 

$('#submit').click(function(){
  $("#results").empty(); 
  userInput = $('#contact-text-message').val(); 
  wiki = apis + userInput + format;
  scrollUp();
  getWiki(wiki);
});

$('#more-button').click(function(e){
  e.preventDefault();
  wiki = apis + userInput + format;
  getWiki(wiki);
});
