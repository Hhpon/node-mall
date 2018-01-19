var axios = require('axios')//请求模块
var cheerio = require('cheerio')//网页解析 JQ抓取
var mongoose = require('mongoose')//mongoose模块
var Shop = require('../models/shop')//引入数据库模型
var uuidgo = require('uuid/v4');//生成唯一ID
var url = 'http://www.mianfei.net/?r=q&p='//爬虫地址
var i = 0;   // 从第一页开始
mongoose.Promise = global.Promise;
//修改数据库 连接地址  没有表他会自动创建 爬完后 复制shop模型到自己的node里面 修改引入即可
mongoose.connect('mongodb://127.0.0.1:27017/db_demo', {useMongoClient: true});
var connection = mongoose.connection;
connection.once('open', () => {
    console.log('连接MongoDB成功')
})
connection.on('error', () => {
    console.log('连接错误')
})
// 每次保存一页的数据。
var saveData = (docs, page) => {
    return new Promise((resolve, reject) => {
        Shop.insertMany(docs, (err) => {
            if( err ) {
                i--;
                reject(err);
                return console.log(`第${page}页保存失败`);
            }
            console.log(`成功存储第${page}页`);
            resolve();
        })
    })
}
var spider = () => {
    i++;
    var docs = [];
    console.log(`正在爬取第${i}页，请耐心稍等...`);
    axios.get(`${url}${i}`)
    .then(async res => {
        if( res.status === 200 ) {
            var $ = cheerio.load(res.data);
            if( $('.js-count').length == 0 ) return console.log('爬取数据完成!');
            $('.js-count').each(function (el) {
                var  productId=uuidgo();//生成唯一的ID
                var title = $(this).find('.title a').text().trim();//爬去商品标题
                var img = $(this).find('img').data('original') ? $(this).find('img').data('original') : $(this).find('img').attr('src');//爬去商品图片
                var link = 'http://www.mianfei.net'+$(this).find('.img a').attr('href');//爬取商品对应的连接
                var price = ($(this).find('.amount').text());//爬取商品价格
                //分类
                if(title.indexOf('女装')!=-1||title.indexOf('女')!=-1){
                    classify='女装'
                }else if(title.indexOf('男装')!=-1||title.indexOf('男')!=-1){
                    classify='男装'
                }else if(title.indexOf('鞋')!=-1){
                    classify='鞋子'
                }else if(title.indexOf('机')!=-1||title.indexOf('表')!=-1){
                    classify='数码'
                }else if(title.indexOf('提包')!=-1||title.indexOf('双肩包')!=-1||title.indexOf('单肩包')!=-1){
                    classify='包箱'
                }else if(title.indexOf('糕')!=-1||title.indexOf('食')!=-1||title.indexOf('茶')!=-1||title.indexOf('水果')!=-1||title.indexOf('g')!=-1||title.indexOf('特产')!=-1){
                    classify='食物'
                }
                else{
                    classify='其他'
                }
                // 把数据保存到docs数组
                docs.push({
                    productId:productId,
                    productImage: img || '',
                    productName: title || '',
                    link: link || '',
                    salePrice: price|| 88,
                    classify:classify
                })

            })      
            // 保存到MongoDB
            await saveData(docs, i);
            spider();
        }
    })
    .catch(e => {
        console.log('爬取出错或超时');
        spider();
    })
}
spider();
