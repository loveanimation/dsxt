var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var good = require("../models/goods_model")
mongoose.connect("mongodb://127.0.0.1/project")
mongoose.connection.on("connect", () => {
    console.log("mongoDb connected success!");
})
mongoose.connection.on("error", () => {
    console.log("mongoDb err!");
})
mongoose.connection.on("disconnected", () => {
    console.log("mongoDb connected dis!");
})

router.get('/list', (req, res, next) => {
    // res.send("Goods")
    let page = parseInt(req.param('page'));
    let pageSize = parseInt(req.param('pageSize'));  // 每页显示的条数
    let sort = req.param('sort');   // 获取排序,1为升序,-1降序
    let priceLevel = req.param("priceState");
    let priceMax = '';
    let priceMin = '';
    let skip = (page - 1) * pageSize;   // 开始条数
    if (priceLevel != "active") {
        switch (priceLevel) {
            case '0': priceMin = 0;
                priceMax = 100;
                break;
            case '1': priceMin = 100;
                priceMax = 500;
                break;
            case '2': priceMin = 500;
                priceMax = 1000;
                break;
            case '3': priceMin = 1000;
                priceMax = 2000;
                break;
            case '4': priceMin = 2000;
                priceMax = 5000;
                break;
        }
        var params = {
            scalePrice: {
                $gt: priceMin,
                $lte: priceMax  // 小于等于
            }
        };    // 查询条件
    } else {
        var params = {};    // 查询条件
    }
    // console.log(priceMax, priceMin)

    let goodModel = good.find(params).skip(skip).limit(pageSize);
    goodModel.sort({ 'scalePrice': sort })
    goodModel.exec((err, doc) => {

        if (err) {
            res.json({
                status: 1,   // 状态码
                message: err.message
            })
        } else {
            res.json({
                status: 0,
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    }
    )
    // good.find({}, (err, doc) => {
    //     if (err) {
    //         res.json({
    //             status: 1,   // 状态码
    //             message: err.message
    //         })
    //     } else {
    //         res.json({
    //             status: 0,
    //             result: {
    //                 count: doc.length,
    //                 list: doc
    //             }
    //         })
    //     }
    // });
})
// router.get('/addCart', (req, res, next) => {
router.post('/addCart', (req, res, next) => {
    var userId = "100000077";  // 假设已经登录
    // var productId = req.param("productId")
    var productId = req.body.productId;

    var User = require("../models/user");   // 导入模型
    User.findOne({ userId: userId }, (err, docs) => {
        if (!err) {
            // console.log(docs)
            if (docs) {
                var dataOnly = true;   // 购物车中是否有次商品true是没有
                docs.cartList.forEach(item => {
                    if (item.productId == productId) {
                        dataOnly = false; // 已经有此商品
                        item.productNum++;
                        docs.save((error, doc) => {   // 文档保存
                            if (error) {
                                res.json({
                                    status: 1,
                                    mes: error.message
                                })
                            } else {
                                res.json({
                                    status: 0,
                                    mes: '',
                                    result: "success"
                                })
                            }
                        })
                    }
                })
                if (dataOnly) {
                    console.log(productId)
                    good.findOne({ productId: productId }, (err3, doc) => {
                        if (err3) {
                            res.json({
                                status: 1,
                                mes: err3.message
                            })
                        } else {

                            doc.productNum = 1;   // 默认购买一个
                            doc.checked = true;    // 默认选中
                            docs.cartList.push(doc);
                            docs.save((err4, doc4) => {
                                if (err4) {
                                    res.json({
                                        status: 1,
                                        mes: '',
                                        result: err4.message
                                    })
                                } else {
                                    res.json({
                                        status: 0,
                                        mes: '',
                                        result: "success"
                                    })
                                }
                            })
                        }
                    })
                }
            }
        } else {
            res.json({
                status: 1,
                mes: err.message
            })
        }
    })
})
module.exports = router;
