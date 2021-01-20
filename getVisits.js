// ------------------ Script to collect visit metrics -----------------
// Instructions:
// Create a list in your Sharepoint site where you will collect all the metrics (make sure the list has the following columns: Title, Timestamp)
// Replace BASE_URL with your Sharepoint Site URL
var BASE_URL = 'https://ishareteam3.na.xom.com/sites/EMITKL/Kejora/';
// Replace listName with the name of the list you have created
var listName = 'Visit';
// Now, you need to reference this script on the html code
// Below is how you would do it for this example
// in index.html add:
/*
<script type="text/javascript" src="js/vendor/jquery-3.1.0.min.js"></script> 
<script type="text/javascript" src="js/vendor/jquery.SPServices-2014.02.min.js"></script> 
<script type="text/javascript" src="js/getVisits.js"></script>
*/
// These are the references to this script and the libraries needed for it to run
//
// You can then connect the Sharepoint list to a Tableau Workbook and show the results
// Template available to download:
// https://tableau.na.xom.com/#/site/GSC-EMIT/views/VisitsBADA/BADAVISITS
//
// Enjoy!
//
// Powered by BADA CoP
// Buenos Aires Data & Analytics
// Community of Practice
// goto/badacop

var analyticsList = BASE_URL + "_vti_bin/ListData.svc/" + listName;

var Name = $().SPServices.SPGetCurrentUser({
  fieldName: "Name",
  debug: false
});

var Site = $().SPServices.SPGetCurrentUser({
    fieldName: "Department",
    debug: false
  });

function sendRequest(params){
    var xhr = new XMLHttpRequest();
    xhr.open(params.method,params.url,true);
    for(var header in params.headers){
        xhr.setRequestHeader(header,params.headers[header]);
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                params.success(JSON.parse(xhr.responseText));
            }else{
                params.error(JSON.parse(xhr.responseText));
            }
        }
    }
    xhr.send(JSON.stringify(params.data));
}

var now = new Date();
var isoString = now.toISOString();

sendRequest({
    method: "POST",
    url: analyticsList,
    headers: {
        "Content-Type":"application/json",
        "accept":"application/json",
    },
    data: { 
        "Title":Name.split("|")[1],
        "Timestamp":isoString,
        "Site":Site
    },
    success: function(data){ 
        //console.log("New item created!\r\nTitle: "+data.d.Title+"\r\nID: "+data.d.Id);
    },
    error: function(data){ 
		//console.log("Whoops!\r\n"+data.error.message.value); 
	}
});