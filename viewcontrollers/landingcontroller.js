module.exports.controller = function(app){

	app.get('/',function(req,res){

		res.render('landing/index',{title: "Descramble ME!"});
	});

	app.get('/site/randomwords',function(req,res){
		var http=require('http');
		var WordNikApiKey="f39b86fc25aa35637620607a6760b9d5445b072c27b33304e";
		var GetValue="minCorpusCount=10000&minDictionaryCount=20&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun,verb,adjective,definite-article,conjunction&limit=25&maxLength=7&api_key="+WordNikApiKey;
		var options = {
  			host: 'api.wordnik.com',
  			port:'80',
  			path: '/v4/words.json/randomWords?'+GetValue
 
		};
		var reques = http.request(options, function(response) {
			  response.setEncoding('utf8');
			 var outputData = "";
	  		response.on('data', function (chunk) {
	  			outputData += chunk;
				 
  			});
  			response.on('end',function(chunk){
  				data=JSON.parse(outputData);
  				res.render('api/randomword',{title:data});
  			});

		});
		
		reques.end();

	});



};

module.exports.socket = function(socket){
	
	socket.on('message',function(data){
		socket.broadcast.emit('message',data);	
	});

	
};