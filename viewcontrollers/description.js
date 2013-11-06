var http = require("http");
var wordlist = "";
var imagecollection = "";
var keyWord = "";
var Audio = "";
var Definition = ""
var Usage = "";
var Phrase = "";
var Anagrams = "";
var Images = "";
var parseString = require('xml2js').parseString;


module.exports.controller = function(app){
	app.get('/description',function(req,res){
		//console.log('Problem with request: ' + req.query.word);
		getWordDetails(res, req.query.word);
	});
};


function getWordDetails(res,value) 
{		var http = require("http");
		var options = {
			host : 'api.pearson.com',
			path : '/v2/dictionaries/entries?headword='+value+'&apikey=6pUM7idZK2khzpx31xSfUoUapA2wQbzm',
			port : 80,
			method : 'GET'
		}
		var request = http.request(options, function(response){
			var body = ""
			response.on('data', function(data) {
			  body += data;
			  wordlist = body;
			});
			response.on('end', function() {	
				wordlist = body;
				getDKImages(value,res,JSON.parse(body));
			});
		});
		request.on('error', function(e) {
		console.log('Problem with request: ' + e.message);
		});				
		request.end();
}

function getDKImages(value,res,obj) 
{		var http = require("http");
		var options = {
			host : 'api.pearson.com',
			path : '/dk/v1/images?caption='+value+'&limit=3&apikey=6pUM7idZK2khzpx31xSfUoUapA2wQbzm',
			port : 80,
			method : 'GET'
		}
		var request = http.request(options, function(response){
			var body = ""
			response.on('data', function(data) {
			  body += data;
			});
			response.on('end', function() {	
				imagecollection = JSON.parse(body);
				if(imagecollection.images.length > 0)
					getPhrases(value,res,imagecollection,obj);
				else
					getGoogleImages(value,res,obj)
					
			});
		});
		request.on('error', function(e) {
		console.log('Problem with request: ' + e.message);
		});
		request.end();
}

function getGoogleImages(value,res,obj) 
{		var http = require("http");
		var options = {
			host : 'ajax.googleapis.com',
			path : '/ajax/services/search/images?v=1.0&q='+value,
			port : 80,
			method : 'GET'
		}
		var request = http.request(options, function(response){
			var body = ""
			response.on('data', function(data) {
			  body += data;
			});
			response.on('end', function() {	
				imagecollection = JSON.parse(body);
				//console.log('Problem with request: ' + JSON.stringify(imagecollection));
				getPhrases(value,res,imagecollection,obj);
			});
		});
		request.on('error', function(e) {
		console.log('Problem with request: ' + e.message);
		});
		request.end();
}


function getPhrases(value,res,imagecollection,obj) 
{		var http = require("http");
		var options = {
			host : 'stands4.com',
			path : '/services/v2/phrases.php?uid=2167&tokenid=LL870U6UWvQIh9w&phrase='+value,
			port : 80,
			method : 'GET'
		}
		var request = http.get(options, function(response){
			var body = ""
			response.on('data', function(data) {
			  body += data;
			});
			
			response.on('end', function() {
				var phraseObj = "";
				parseString(body, function (err, result) {
					phraseObj = result;	
				});
				getAnagrams(value,res,imagecollection,obj,phraseObj)				
			});
		});
		request.on('error', function(e) {
			console.log('Problem with request: ' + e.message);
		});
		request.end();
}

function getAnagrams(value,res,imagecollection,obj,phraseObj)
{
	var http = require("http");
		var options = {
			host : 'anagramica.com',
			path : '/best/:'+value,
			port : 80,
			method : 'GET'
		}
		var request = http.get(options, function(response){
			var body = ""
			response.on('data', function(data) {
			  body += data;
			});
			
			response.on('end', function() {
				var data= JSON.parse(body);
				var letter = "";
				for (var l = 0; l < data.best.length; l++) {
					if(l == data.best.length-1)
						letter  = letter + data.best[l];
						else
						letter  = letter + data.best[l] + ","
				}
				getSynonyms(value,res,imagecollection,obj,phraseObj,letter)				
			});
		});
		request.on('error', function(e) {
			console.log('Problem with request: ' + e.message);
		});
		request.end();
}

function getSynonyms(value,res,imagecollection,obj,phraseObj,letter)
{
	var http = require("http");
		var options = {
			host : 'stands4.com',
			path : '/services/v2/syno.php?uid=2167&tokenid=LL870U6UWvQIh9w&word='+value,
			port : 80,
			method : 'GET'
		}
		var request = http.get(options, function(response){
			var body = ""
			response.on('data', function(data) {
			  body += data;
			});
			
			response.on('end', function() {
				var synonymObj = "";
				parseString(body, function (err, result) {
					synonymObj = result;	
				});
				if(Object.keys(obj).length > 0)
				{						
					for (var item = 0; item < obj.results.length; item++) {
							if(obj.results[item].headword == value)
							{	
								keyWord = obj.results[item].headword;
								Definition = obj.results[item].senses[0].definition;
								//console.log('Problem with request: ' + Definition);
								if(obj.results[item].senses[0].examples)
								{						
								Usage = obj.results[item].senses[0].examples[0].text;
								if(obj.results[item].senses[0].examples[0].audio)
								Audio = "http://api.pearson.com"+obj.results[item].senses[0].examples[0].audio[0].url;
								}
								item = obj.results.length +1;
							}
					}
				}
				//console.log('Problem with request: ' + JSON.stringify(phraseObj));
				if(phraseObj.results.result){
					Phrase = phraseObj.results.result[0].explanation
				}			
				var image = "";
				//console.log('Problem with request: ' + JSON.stringify(imagecollection));
				//console.log('Problem with request: ' + JSON.stringify(imagecollection));
				if(imagecollection.images)
				{	//console.log('if: ' + JSON.stringify(imagecollection));
					if(imagecollection.images.length > 0)
					{
						for (var l = 0; l < imagecollection.images.length; l++) {
							if(l == imagecollection.images.length-1)
							image  = image + imagecollection.images[0].url;
							else
							image  = image + imagecollection.images[0].url + ","
						}
					}
				}
				else
				{	if(imagecollection.responseData.results)
					{
						for (var l = 0; l < imagecollection.responseData.results.length; l++) 
						{	if(l == imagecollection.responseData.results.length-1)
							image  = image + imagecollection.responseData.results[l].url;
							else
							image  = image + imagecollection.responseData.results[l].url + ","
						}
					}
				}
				
				var Synonyms = "";
				var Antonyms = "";
				var speech = "";
				if(synonymObj.results.result)
				{	
						Synonyms = synonymObj.results.result[0].synonyms;
						Antonyms = synonymObj.results.result[0].antonyms;
						speech = synonymObj.results.result[0].partofspeech;
				}
					//console.log('Problem with request: ' + Synonyms);
				
				var collection = {'KeyWord':value,'Speech':speech,'Audio':Audio,'Definition':Definition,'Usage':Usage,'Phrase':Phrase,'Synonyms':Synonyms,'Antonyms':Antonyms,'Anagrams':letter,'Images':image}
				
				res.render('description/description',{data:collection})				
				
			});
		});
		request.on('error', function(e) {
			console.log('Problem with request: ' + e.message);
		});
		request.end();
}

module.exports.socket = function(socket){
	
	socket.on('message',function(data){
		socket.broadcast.emit('message',data);	
	});

	
};