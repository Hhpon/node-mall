var mongoose =require('mongoose')
var userSchema = new mongoose.Schema({
	"userId":String,
	"userName":String,
	"userPwd":String,
	"userEmail":String,
})
module.exports = mongoose.model("admin",userSchema);
