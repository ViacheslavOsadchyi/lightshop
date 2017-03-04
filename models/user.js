var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
	login: {type: String, required: true},
	email: {type: String, required: true},
	pwd: {type: String, required: true},
	role: {type: String, required: true}
});

module.exports = mongoose.model('User', schema);
