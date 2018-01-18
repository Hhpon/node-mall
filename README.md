# 前言

### 我是一名来者广州的前端开发者，梦想成为一名全栈工程师，为了这个梦，不断在网络上探索，无意间发现了一个vue+node+moogodb的入门全栈教程，然后跟着的学习跟着做，做完后发现还不够，不满足，利用学习到的知识，加入自己的元素，继续开发后台管理系统页面。

## 技术栈

node + express + mongoose + formidable + uuid + axios + cheerio 

注：商品数据来自于爬虫

## 项目运行

#### 注:运行前确保机子安装 node（6.0.0版本以上） moogodb（3.0版本以上） 环境

### 本地环境（windows7系统）

```
git clone https://github.com/Apple-ljj/node-junmall.git

cd node-junmall

//复制node-junmall里面的db（数据库文件到D盘）
xcopy ./db d:\db /e
(F = 文件，D = 目录)? D

//导入数据库
mongorestore --drop d:\db

npm install

npm start

```
### 运行爬虫（更新商品数据）
#### 注：运行爬虫程序前，请删除数据库中的shops表，否则会导致爬虫数据重复.
```
cd bin
node webpp
正在爬取第1页...
连接MongoDB成功
成功存储第1页
正在爬取第2页,请耐心稍等...
成功存储第2页
正在爬取第3页,请耐心稍等...
成功存储第3页
....
爬取数据完成!

```


## 另外
此项目需要配套的前端运行：[前端项目传送地址](https://github.com/Apple-ljj/vue-junmall.git)。

# 效果演示

[查看demo请戳这里](http://120.78.185.163/junmall/#/)（请用chrome浏览器或者极速模式查看）

# 说明

>  如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

>  或者您可以 "follow" 一下，我会不断开源更多的有趣的项目

>  开发环境 windows7 64位  Chrome 63  nodejs 8.9.3  moogodb 3.4

>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍

>  开源爱好者交流群：18994445 (QQ群)


# 目标功能
- [x] 登录 -- 完成
- [x] 登出 -- 完成
- [x] 查看用户列表 -- 完成
- [x] 查看商品列表 -- 完成
- [x] 对商品增删改查 -- 完成
- [x] 首页轮播图设置（增删） -- 完成
- [ ] 爬虫设置 -- 努力建设中


# 项目目录

```
├── bin                                         // 启动目录
│   ├── www                                     // 启动后台项目
│   ├── webpp.js                                // 启动爬虫
├── db                                          // 数据库文件（备份）
├── models                                      // 数据库模型目录
│   ├── admins.js                               // 管理员模型
│   ├── users.js                                // 用户数据模型
│   ├── imgs.js                                 // 首页轮播图模型
│   ├── goods.js                                // 商品数据模型
│   ├── shop.js                                 // 商品数据模型(爬虫)
├── public                                      // 公共资源目录
│   ├── images                                  // 公共图片目录（上传图片的存放路径）
│   ├── javascripts                             // js目录
│   ├── stylesheets                             // css目录
├── routes                                      // 数据库模型目录
│   ├── admins.js                               // 管理员路由
│   ├── users.js                                // 用户数路由
│   ├── goods.js                                // 商品路由
│   ├── index.js                                // 这个路由暂时没用
├── views                                       // 静态视图目录
├──app.js                                       // 全局配置
├── package.json                                // 依赖文件
```
