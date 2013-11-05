module.exports = function(socket){
	// var HallModel = require('mongoose').model('Hall');
	// socket.on('message',function(data){
	// 	socket.broadcast.emit('message',data);	
	// });
	require(__dirname+'/viewcontrollers/landingcontroller.js').socket(socket);
	
};