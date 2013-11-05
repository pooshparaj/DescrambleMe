module.exports.controller = function(app){

	app.get('/challenge',function(req,res){
		res.render('twoPlayer/index',{title: "This is Two Player Index!"});
	});
	
	app.get('/search', function (req, res){
		var searchText = req.query.searchText;
		console.log(req.query.searchText);
		getWordDetails(searchText, res);
	});
};
function getWordDetails(value, res) {
	var http = require("http");
  var options = {
		host : 'api.pearson.com',
		path : '/v2/dictionaries/entries?search='+value+'&apikey=6pUM7idZK2khzpx31xSfUoUapA2wQbzm',
		port : 80,
		method : 'GET'
	}

	var request = http.request(options, function(response){
		var body = ""
		response.on('data', function(data) {
			body += data;
		});
		response.on('end', function() {
			res.jsonp(JSON.parse(body));	
			//res.render('description/description',{data:JSON.parse(body)});
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