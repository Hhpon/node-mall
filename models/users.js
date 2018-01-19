var mongoose =require('mongoose')
// var Schema =mongoose.Schema; //定义表模型
var userSchema = new mongoose.Schema({
	"userId":String,
	"userName":String,
	"userPwd":String,
	"userEmail":String,
	"orderList":Array,
    "createTime":String,
	"cartList":[
		{
			"productId":String,
			"productName":String,
			"salePrice":String,
			"productImage":String,
			"checked":String,
			"productNum":String,

		}
	],
	"addressList":[
		 {
    		"addressId":String,
    		"userName":String,
    		"streetName":String,
    		"postCode":String,
    		"tel":Number,
    		"isDefault":Boolean
  		}
	],
})
module.exports = mongoose.model("user",userSchema);
