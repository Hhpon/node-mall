var mongoose =require('mongoose')
var Schema =mongoose.Schema; //定义表模型
var produtSchema= new Schema({
	"productId":String,
	"productName":String,
	"salePrice":Number,
	"productNum":Number,
	"checked":String,
	"productImage":String
})
//导出produtSchema到goods表
module.exports=mongoose.model('good',produtSchema)