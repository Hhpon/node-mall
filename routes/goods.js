 var express = require('express');
 var router =express.Router();
 var mongoose =require("mongoose");
 // var Goods =require('../models/goods')
 var Goods =require('../models/shops')//爬虫得回来的数据
 var User =require('../models/users')

 //定义router 查询商品
 router.get("/list",function(req,res,next){
    //param接受前端参数
  let page = parseInt(req.param("page"));
    var pageSize = parseInt(req.param("pageSize")),
    priceLevel= req.param("priceLevel"),
    sort = req.param("sort"),
    skip = (page-1)*pageSize,
    classifynum= req.param("classify"),
    priceGt =req.param("priceGt"),
    priceLte=req.param("priceLte"),
    shopname=req.param("shopname");
    shopid=req.param("shopid");
    //商品分类
    if(classifynum!==undefined){
      params={
        salePrice:{
          $gt:priceGt,
          $lte:priceLte,
      },
        classify:classifynum,
      }
    //筛选价格
    }else if(priceLevel!=='all'&&classifynum===undefined){
      params={
        salePrice:{
          $gt:priceGt,
          $lte:priceLte,
        }
      }
    //模糊搜索
    }else if(shopname!==undefined){
      var params = {
        productName:{ $regex:shopname }
      };
      //获取搜索条数
      Goods.find(params).count(function(err, res){counts=res});
    //根据id查询商品信息
    }else if(shopid!==undefined) {
         var params = {productId:shopid};
         console.log(shopid);
    }else{
          var params = {};
    }
    //根据id查询商品信息

    //总条数
    Goods.count(function(err, res){
      if(err){
        console.log(err)
      }else{
        counts=res
      }
    })
  // //Goods.find(params)查找所有数据 skipt跳过条数limit()获取多少跳
  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
  // //sort排序
   goodsModel.sort({"salePrice":sort})//1升序  -1降序
   goodsModel.exec({},function(err,doc){
    if (err) {
      res.json({
        status:"1",
        mag:err.message
      });
    }else{
      res.json({
        status:"0",
        msg:'',
        result:{
          counts:counts,
          count:doc.length,
          list:doc
        }
      })
    }
  })
 });
 //加入购物车
 router.post("/addCart",function(req,res,next){
  var userId = req.cookies.userId,productId=req.body.productId,num=req.body.num,shopnum=parseInt(num),checked=req.body.checked,checked;
 	//查询userId
if(userId===undefined){
      res.json({
        status:"2",
        mas:'用户未登录'
      })
      return false;
}
 	User.findOne({userId:userId},function(err,userdoc){
 		if(err){
 			res.json({
 				status:"1",
 				mas:err.message
 			})
 		}else{
      //查询到用户信息后
 			if(userdoc){
        let goodsItme =''
        userdoc.cartList.forEach(function(item){
          //判断传过来的ID存不存在
          if(item.productId==productId){
            goodsItme=item;
            item.productNum=parseInt(item.productNum)+shopnum;
          }
          // console.log(num);
        })
                 console.log(goodsItme)
        // goodsItme.productNum=num
        if(goodsItme){
            userdoc.save(function(err2,doc2){
              if(err2){
                res.json({
                  status:"1",
                  mas:err2.message
                })
              }else{
                res.json({
                  status:"0",
                  mas:'',
                  result:'成功'
                })
              }
            })
        }else{
          //通过ID查询商品表 的商品 
          Goods.findOne({productId:productId},function(err1,doc){
            if(err1){
              res.json({
                status:"1",
                mas:err1.message
              })
            }else{
              if(doc){
                doc.productNum=num;
                doc.checked=1;
                userdoc.cartList.push(doc)
                userdoc.save(function(err2,doc2){
                  console.log(doc)
                  if(err2){
                    res.json({
                      status:"1",
                      mas:err2.message
                    })
                  }else{
                    res.json({
                      status:"0",
                      mas:'',
                      result:'成功'
                    })
                  }
                })
              }
            }
          })
        }
 			}
 		}
 	})
 })

 module.exports = router;//输出router