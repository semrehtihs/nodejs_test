var express = require('express');
var app = express();

/*****************************************************************************************************************/
var exampleConfig = require('./exampleConfig');
var fs = require('fs');
var zd = require('./lib/client');

var client = zd.createClient({
  username:  exampleConfig.auth.username,
  token:     exampleConfig.auth.token,
  remoteUri: exampleConfig.auth.remoteUri
});

/****************************************************************************************************************/

app.use(express.static('public'))

app.get('/index.html',function(req,res) {
    res.sendFile(__dirname+"/"+'index.html');
    
})

app.get('/express_get',function(req,res) {
	
	/****************************************************************************************************************/
	
   response ={
       startDate : req.query.startDate,
       Comment: req.query.Comment,
	   yphone: req.query.yphone,
	   Id: req.query.Id,
	   dure: req.query.dure,
	   qualifId: req.query.qualifId
	   
   };
   
   /******************************************************************************************************************/
   
   
    console.log(response);
	
    res.end(JSON.stringify(response));
	
	var subject=JSON.parse(JSON.stringify(response.startDate));
	console.log(subject);
	
	var body=JSON.parse(JSON.stringify(response.Comment));
	console.log(body);
	
	var Id=JSON.parse(JSON.stringify(response.Id));
	console.log(Id);

	var qualifId=JSON.parse(JSON.stringify(response.qualifId));
	console.log(qualifId);
	
	var dure=JSON.parse(JSON.stringify(response.dure));
	console.log(dure);
	
	var yphone=JSON.parse(JSON.stringify(response.yphone));
	console.log(yphone);
	
	var qualif;
	
	if (qualifId == 2) 
	{
		 qualif = "Contacts non argumentés";
	}
	else if (qualifId == 3) 
	{
		 qualif = "Transfert à Ulteam";
	} 
	else 
	{
		 qualif = "indisponible";
	}
	

	// var phone = +15135557611;
	var phone = +212611223344;

	var query = "role:end-user phone:"+phone;
	
	// var test = body.concat( qualif );
	
	
	/*****************************************************************************************************************/
	
client.search.query(query, function (err, req, result) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(JSON.stringify(result, null, 2, true));

	// var val = JSON.parse(JSON.stringify(result));
	// var Id =val[0].id ; 
	
	var ticket = {
  "ticket":
    {
    	"via_id": 45,
		"subject":" Appel : " + yphone,
		"description": yphone,
		"requester_id": Id,
		"custom_fields": [{"id": 360017192714, "value": qualif}],
		"voice_comment": {
      		"from": yphone,
      		"to": "+33554650236",
      		"recording_url": "",
      		"started_at": subject,
      		"call_duration": dure,
			"answered_by_id": 373737357953
    						}
    }
}; 
  
client.tickets.create(ticket,  function(err, req, result) {
  if (err) return handleError(err);
  console.log(JSON.stringify(result, null, 2, true));
});

function handleError(err) {
    console.log(err);
    process.exit(-1);
}

		});

/*********************************************************************************************************************/
	
	

})

var server = app.listen(8000,function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App running on http://127.0.0.1:8000')
})
