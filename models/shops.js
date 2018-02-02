//爬虫数据模型
var mongoose = require('mongoose')
var schema = new mongoose.Schema({
    productId:String,
    productImage: String,        // 图片地址
    productName: String,      // 商品标题
    salePrice: Number,      // 商品价格
    oldprice:Number,
    sales:Number,
    productNum:Number,
    checked:String,
    classify:String,
    details:String,
    date: String,
})
module.exports = mongoose.model('Shops', schema);