var express = require('express');
const asyncHandler = require('express-async-handler');
var app = express();
/*************************************************************************/

var exampleConfig = require('./exampleConfig');
var fs = require('fs');
var zd = require('./lib/client');

var client = zd.createClient({
  username:  exampleConfig.auth.username,
  token:     exampleConfig.auth.token,
  remoteUri: exampleConfig.auth.remoteUri
});

/**********************************************************************/

app.use(express.static('public'))

app.get('/index.html',function(req,res) {
    res.sendFile(__dirname+"/"+'index.html');
})

/*************************************************************/

app.get('/express_get',asyncHandler(async (req, res, next) => {
	
   response ={
       inout : req.query.inout,
	   time : req.query.time,
	   from: req.query.from,
       to: req.query.to,
	   // Id_requ: req.query.Id_requ,
	   Id_agent: req.query.Id_agent,
	   spent: req.query.spent,
	   qualifId: req.query.qualifId
	   
   };	
	
/*************************************************************/
	
    res.end(JSON.stringify(response));
	
	var inout=JSON.parse(JSON.stringify(response.inout));
	console.log(inout);
	
	var time=JSON.parse(JSON.stringify(response.time));
	console.log(time);
	
	var from=JSON.parse(JSON.stringify(response.from));
	console.log(from);
	
	var to=JSON.parse(JSON.stringify(response.to));
	console.log(to);
	
	// var Id_requ=JSON.parse(JSON.stringify(response.Id_requ));
	// console.log(Id_requ);
	
	var Id_agent=JSON.parse(JSON.stringify(response.Id_agent));
	console.log(Id_agent);
	
	var spent=JSON.parse(JSON.stringify(response.spent));
	console.log(spent);
	
	var qualifId=JSON.parse(JSON.stringify(response.qualifId));
	console.log(qualifId);
	
	var qualif;
	
if(inout == 1)	
{
	// var phone = +15135557611;
	// var phone = +212611223344;
	// var test = body.concat( qualif );
	var query_phone = "role:end-user phone:"+from;
	console.log("inout == 1");
}
else
{
	var query_phone = "role:end-user phone:"+to;
	console.log("inout == 2");
}
	
	var query_external = "role:agent external_id:"+Id_agent;


/***************************************************************/
	
	if (qualifId == 2) 
	{
		 qualif = "Contacts non argumentés";
	}
	else 
	{
		 qualif = "indisponible";
	}
	
/*************************************************************/

client.search.query(query_external, function (err, req, result_external) {
  if (err) {
    console.log(err);	
    return;
  }
  
	if (JSON.stringify(result_external) === '[]')
		{
			var myArray = [378196941193,378196941373,378197100133,378197100153];  
			
			var Id_agent=myArray[Math.floor(Math.random() * myArray.length)]; 
			console.log("Id_agent false");
			
		}
	else
		{
			var val_external = JSON.parse(JSON.stringify(result_external));
			var Id_agent =val_external[0].id; 	
			console.log("Id_agent true");
		
		}
  	

	/*************************************************/
	
	
client.search.query(query_phone, function (err, req, result_phone) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(JSON.stringify(result_phone, null, 2, true));

	var val_phone = JSON.parse(JSON.stringify(result_phone));
	
	/******************* from doit etre correct **********************************/
	
	
	if (JSON.stringify(result_phone) === '[]')
		{
			console.log("OK");

	var ticket = {
					  "ticket":
						{
							"via_id": 45,
							"subject":" Appel : " + from,
							"requester_id": 377836120974,
							"assignee_id": Id_agent,
							"custom_fields": [{"id": 360017192714, "value": qualif}],
							"voice_comment": {
								"from": from,
								"to": to,
								"recording_url": "",
								"started_at": time,
								"call_duration": spent,
								"answered_by_id": Id_agent
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

		}
		
	/*************************************************/
			
	else
		{
			console.log("KO");
			console.log(Id_agent);
			var Id_requ =val_phone[0].id; 

			if( inout == 1)	
				{
					var ticket = {
								  "ticket":
									{
										"via_id": 45,
										"subject":" Appel : " + from,
										"requester_id": Id_requ,
										"assignee_id": Id_agent,
										"custom_fields": [{"id": 360017192714, "value": qualif}],
										"voice_comment": {
											"from": from,
											"to": to,
											"recording_url": "",
											"started_at": time,
											"call_duration": spent,
											"answered_by_id": Id_agent
															}
									}
								}; 
				}
			else
				{
					var ticket = {
								  "ticket":
									{
										"via_id": 46,
										"subject":" Appel : " + to,
										"requester_id": Id_requ,
										"assignee_id": Id_agent,
										"custom_fields": [{"id": 360017192714, "value": qualif}],
										"voice_comment": {
											"from": from,
											"to": to,
											"recording_url": "",
											"started_at": time,
											"call_duration": spent,
											"answered_by_id": Id_agent
															}
									}
								}; 	
				}
  
			client.tickets.create(ticket,  function(err, req, result) {
			  if (err) return handleError(err);
			  console.log(JSON.stringify(result, null, 2, true));
			});

			function handleError(err) {
				console.log(err);
				process.exit(-1);
			}

}
});
});

/*****************************************************************/
}));

var server = app.listen(8000,function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App running on http://127.0.0.1:8000')
})

