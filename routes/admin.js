var express = require('express');
var router = express.Router();
var Admin = require("../models/admins.js")
var User = require("../models/users.js")
var Goods = require('../models/shops')
var imgs = require("../models/imgs.js");
var mongoose = require("mongoose");
var uuidv1 = require('uuid/v1');
var uuidv4 = require('uuid/v4');
//上传图片
var formidable = require('formidable'),
  fs = require('fs'),
  TITLE = '上传测试',
  AVATAR_UPLOAD_FOLDER = '/public/images/',
  domain = "http://127.0.0.1:3000";
//admin登录接口
router.post('/login', function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  Admin.findOne(param, function (err, doc) {
    console.log(doc)
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        //cookie存储
        res.cookie("adminId", doc.userId, {
          path: '/',//存储的路劲
          maxAge: 1000 * 60 * 60//存储一个小时
        })
        res.cookie("adminName", doc.userName, {
          path: '/',//存储的路劲
          maxAge: 1000 * 60 * 60//存储一个小时
        })
        res.json({
          status: '0',
          msg: "",
          result: {
            adminName: doc.userName
          }
        })
      } else {
        res.json({
          status: '1',
          msg: "输入不正确",
          result: ''
        })
      }
    }
  })
});
//admin登出
router.post("/logout", function (req, res, next) {
  //清楚cookie
  res.cookie("adminId", "", {
    path: "/",
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: "",
    result: ""
  })
})
//用户列表数据
router.get("/userlist", function (req, res, next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let skip = (page - 1) * pageSize;
  var priceGt = '', priceLte = '';
  var adminId = req.cookies.adminId;
  console.log(adminId)
  let UserModel = User.find({}).skip(skip).limit(pageSize);
  if (adminId != undefined) {
    UserModel.exec({}, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          mag: err.message
        });
      } else {
        userlist = [];
        doc.forEach((itme) => {
          let lis = {
            userName: itme.userName,
            userEmail: itme.userEmail,
            createTime: itme.createTime
          }
          userlist.push(lis);
        })
        res.json({
          status: "0",
          msg: '',
          result: {
            count: doc.length,
            list: userlist
          }
        })
      }
    })
  } else {
    res.json({
      status: "10001",
      msg: '',
      result: '非法操作'
    })
  }
});
//订单管理接口（未完成）
router.get("/userorderlist", function (req, res, next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let skip = (page - 1) * pageSize;
  var priceGt = '', priceLte = '';
  var adminId = req.cookies.adminId;
  console.log(adminId)
  // if(shopname!==undefined){
  //     var params = {
  //       productName:{ $regex:shopname }
  //     };
  let UserModel = User.find({}).skip(skip).limit(pageSize);
  if (adminId != undefined) {
    UserModel.exec({}, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          mag: err.message
        });
      } else {
        orderList = [];
        doc.forEach((itme) => {
          if (itme.orderList.length > 0) {
            orderList.push(itme.orderList[0]);
          }
        })
        res.json({
          status: "0",
          msg: '',
          result: {
            count: orderList.length,
            list: orderList
          }
        })
      }
    })
  } else {
    res.json({
      status: "10001",
      msg: '',
      result: '非法操作'
    })
  }
});
//添加商品
router.post('/addshop', function (req, res, next) {
  var userId = req.cookies.userId,
    productName = req.body.productName,
    classify = req.body.classify,
    salePrice = req.body.salePrice;
  productImage = req.body.productImage;
  Goods.create({
    productId: uuidv4(),
    productName: productName,
    salePrice: salePrice,
    productImage: productImage,
    classify: classify,
    link: ''
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: "添加成功",
        result: ""
      })
    }
  })
})
//删除商品
router.post("/delgoods", function (req, res, next) {
  var adminId = req.cookies.adminId, productId = req.body.productId;
  if (adminId != undefined) {
    Goods.remove({
      'productId': productId
    }, function (err, doc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: "0",
          msg: '',
          result: '删除成功'
        })
      }
    })
  } else {
    res.json({
      status: "10001",
      msg: '',
      result: '非法操作'
    })
  }
})
//修改商品信息
router.post("/editgoods", function (req, res, next) {
  var adminId = req.cookies.adminId,
    productId = req.body.productId,
    productName = req.body.productName,
    classify = req.body.classify,
    salePrice = req.body.salePrice;
  productImage = req.body.productImage;
  if (adminId != undefined) {
    Goods.update({ productId: productId }, {
      "productName": productName,
      "salePrice": salePrice,
      "productImage": productImage,
      "classify": classify,
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: '0',
          msg: '',
          result: '修改成功'
        });
      }
    })
  } else {
    res.json({
      status: "10001",
      msg: '',
      result: '非法操作'
    })
  }
})
//上传图片接口
router.post('/uploader', function (req, res) {
  // console.log(req);
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = '../node-junmall' + AVATAR_UPLOAD_FOLDER;     //设置上传目录
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.locals.error = err;
      res.render('index', { title: TITLE });
      return;
    }
    var extName = '';  //后缀名
    switch (files.fulAvatar.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }
    if (extName.length == 0) {
      res.locals.error = '只支持png和jpg格式图片';
      res.render('index', { title: TITLE });
      return;
    }
    var pathName = Math.random() + '.' + extName;
    //图片写入地址；
    var newPath = form.uploadDir + pathName;
    console.log(pathName, '---------------');
    console.log(newPath, '---------------==================');

    //显示地址；
    var showUrl = domain + AVATAR_UPLOAD_FOLDER + pathName;
    fs.renameSync(files.fulAvatar.path, newPath);  //重命名
    //获取条数
    imgs.find({}).count(function (err, count) {
      //创建数据
      imgs.create({
        imgId: uuidv4(),
        imgLink: showUrl,
        imgPathName: pathName,
        imgSort: count + 1
      }, function (err, doc) {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            imgLink: showUrl
          })
        }
      })
    });
  });
});
//图片列表（轮播图）
router.get('/imglist', function (req, res) {
  imgs.find({}).sort({ 'imgSort': 1 }).exec(function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        mag: err.message
      });
    } else {
      res.json({
        status: "0",
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})
//轮播图删除接口
router.post("/delimg", function (req, res, next) {
  var adminId = req.cookies.adminId, imgId = req.body.imgId;
  if (adminId != undefined) {
    imgs.findOne({ imgId: imgId }, function (err, doc) {
      console.log(doc);
      var PathName = '../node-junmall' + AVATAR_UPLOAD_FOLDER + doc.imgPathName
      console.log(PathName);
      //删除目录文件
      fs.unlink(PathName, function (err, doc) {
        if (err) {
          res.json({
            status: "2",
            msg: '删除路径错误',
            result: ''
          })
        } else {
          imgs.remove({
            'imgId': imgId
          }, function (err, doc) {
            if (err) {
              res.json({
                status: "1",
                msg: err.message,
                result: ''
              })
            } else {
              res.json({
                status: "0",
                msg: '删除成功',
                result: ''
              })
            }
          })
        }
      });
    })
  } else {
    res.json({
      status: "10001",
      msg: '',
      result: '非法操作'
    })
  }
})
module.exports = router;