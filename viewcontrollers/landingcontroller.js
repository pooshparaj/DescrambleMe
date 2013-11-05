module.exports.controller = function(app){

	app.get('/',function(req,res){
		res.render('landing/index',{title: "Descramble ME!"});
	});



};

module.exports.socket = function(socket){
	
	socket.on('message',function(data){
		socket.broadcast.emit('message',data);	
	});

	
};