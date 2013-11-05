var http = require("http");
var wordlist = "";
var imagecollection = "";
var keyWord = "";
var Audio = "";
var Definition = ""
var Usage = "";
var Phrase = "";
var Synonyms="";
var Anagrams = "";
var Images = "";
var parseString = require('xml2js').parseString;


module.exports.controller = function(app){
	app.get('/description',function(req,res){
		getWordDetails(res, "compute");
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
				
				keyWord = obj.results[0].headword;
				Definition = obj.results[0].senses[0].definition;
				if(obj.results[0].senses[0].examples)
				{						
					Usage = obj.results[0].senses[0].examples[0].text;
					if(obj.results[0].senses[0].examples[0].audio)
						Audio = obj.results[0].senses[0].examples[0].audio[0].url;
				}
				var image = "";
				if(imagecollection.length != null)
				image = imagecollection.images[0].url+","+imagecollection.images[1].url+","+imagecollection.images[2].url			

				var collection = {'KeyWord':keyWord,'Audio':Audio,'Definition':Definition,'Usage':Usage,'Phrase':phraseObj.results.result[0].example,'Synonyms':Synonyms, 'Anagrams':Anagrams,'Images':image}
				
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