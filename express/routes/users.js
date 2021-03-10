var express = require('express');
var router = express.Router();
var User = require("../models/user")
require("../util/util")
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('我执行了');
});
// router.post("/login", (req, res, next) => {
router.post('/login', function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd,
  }; // 定义查询条件
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          // 配置
          path: "/",   // 设置cookie的有效范围
          maxAge: 1000 * 60 * 3600,// 过期时间
        })
        res.cookie("userName", doc.userName, {
          // 配置
          path: "/",   // 设置cookie的有效范围
          maxAge: 1000 * 60 * 3600,// 过期时间
        })
        res.json({
          status: 0,
          mes: '',
          result: {
            userName: doc.userName
          }
        })
      } else {
        res.json({
          status: 1,
          msg: "无此用户",
        })
      }
    }
  })
})
router.get("/checkLogin", (req, res, next) => {
  if (req.cookies.userId) {   // 如果检测到id,把userName给前端
    res.json({
      status: 0,
      mes: "",
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: 1,
      mes: "未登录",

    })
  }
})
// 退出接口
router.post('/logout', (req, res, next) => {
  res.cookie("userId", '', {
    path: "/",
    maxAge: -1
  })
  res.cookie("userName", '', {
    path: "/",
    maxAge: -1
  })
  res.json({
    status: 0,
    mes: ''
  })
})

// 查询购物车接口
router.get("/cartList", (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        mes: err.message
      })
    } else {
      if (doc) {
        res.json({
          status: 0,
          result: doc.cartList
        })
      } else {
        res.json({
          status: 1,
          mes: "无此用户"
        })
      }

    }
  })
})
// 删除购物车商品接口\
router.get("/delProduct", (req, res, next) => {
  var userId = req.cookies.userId;
  var productId = req.param("productId");
  var param = {
    userId: userId,
    cartList: { $elemMatch: { productId: productId } }
  }
  // User.find(param, (err, doc) => {
  //   if (err) {
  //     res.json({
  //       status: 1,
  //       mes: err.message
  //     })
  //   } else {
  //     res.json({
  //       status: 0,
  //       result: doc
  //     })
  //   }
  // })
  User.update({
    userId: userId
    // $pull是更新里的一个删除方法
  }, { $pull: { "cartList": { "productId": productId } } }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        mes: err.message
      })
    } else {
      res.json({
        status: 0,
        mes: "success"
      })
    }
  })
})
//  跟新购物车数量
router.post("/cartEdit", (req, res, next) => {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  console.log(checked)
  User.update(
    { userId: userId, "cartList.productId": productId },
    { "cartList.$.productNum": productNum, "cartList.$.checked": checked },  // $占位符

    (err, doc) => {
      if (err) {
        res.json({
          status: 1,
          mes: err.message
        })
      } else {
        res.json({
          status: 0,
          mes: "success"
        })
      }
    }
  )
})

// 购物车全选接口
router.post("/checkAll", (req, res, next) => {
  var userId = req.cookies.userId;
  var checkAll = req.body.checkAll;
  User.findOne({ userId }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        mes: err.message
      })
    } else {
      if (doc) {
        doc.cartList.map(val => {
          val.checked = checkAll;
        })
        doc.save((err2, doc1) => {
          if (err2) {
            res.json({
              status: 1,
              mes: err2.message
            })
          } else {
            res.json({
              status: 0,
              mes: "success"
            })
          }
        });
      } else {
        res.json({
          status: 1,
          mes: err.message
        })
      }
    }
  })
})
// 创建用户地址列表
router.get("/addressList", (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({ userId }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        mes: err.message
      })
    } else {
      res.json({
        status: 0,
        result: doc.addressList
      })
    }
  })
})
// 改变默认地址
router.post("/setAddress", (req, res, next) => {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  User.findOne({ userId }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        mes: err.message
      })
    } else {
      var addressList = doc.addressList;
      addressList.map(val => {
        val.isDefault = false;
        if (val.addressId == addressId) {
          val.isDefault = true;
        }

      })
      doc.save((err1) => {
        if (err1) {
          res.json({
            status: 1,
            mes: err1.message
          })
        } else {
          res.json({
            status: 0,
            mes: "success"
          })
        }
      });

    }
  })
})
// 增加地址
router.post("/addAddress", (req, res, next) => {
  var userId = req.cookies.userId;
  console.log(req.body)
  User.findOne({
    userId
  }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        mes: err.message
      })
    } else {
      doc.addressList.push(req.body);
      doc.save((err1) => {
        if (err1) {
          res.json({
            status: 1,
            mes: err1.message
          })
        } else {
          res.json({
            status: 0,
            mes: "success"
          })
        }
      })
    }
  })

})
// 删除地址
router.post("/delAddress", (req, res, next) => {
  var userId = req.cookies.userId;
  var addressId = req.param("addressId");
  User.update(
    { userId },
    { $pull: { "addressList": { addressId } } },
    (err, doc) => {
      if (err) {
        res.json({
          status: 1,
          mes: err.message
        })
      } else {
        res.json({
          status: 0,
          mes: "success"
        })
      }
    }
  )
})


// 订单生成
router.post("/payMent", (req, res) => {
  var userId = req.cookies.userId;
  var orderTotal = req.body.orderTotal;
  var addressId = req.body.addressId;
  User.findOne({ userId }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        mes: err.message
      })
    } else {
      var address = '', goodList = [];
      doc.addressList.forEach(val => {
        if (addressId == val.addressId) {
          address = val;
        }
      })
      goodList = doc.cartList.filter(val => val.checked);
      doc.cartList.forEach((item, index) => {
        if (item.checked) {
          delete doc.cartList[index]
        }
      })
      doc.cartList = doc.cartList.filter(val => val);
      var platform = "332";  // 平台码
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      var sysDate = new Date().Format("yyyyMMddhhmmss");
      var createDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
      var orderId = platform + r1 + sysDate + r2;
      var order = {
        "orderId": orderId,
        "orderTotal": orderTotal,
        "addressInfo": address,
        "goodsList": goodList,
        "orderStatus": "1",
        "createDate": createDate
      }
      doc.orderList.push(order);
      doc.save((err1) => {
        if (err1) {
          res.json({
            status: 1,
            mes: err1.message
          })
        } else {
          res.json({
            status: 0,
            mes: "sucess",
            result: {
              orderId,
              orderTotal
            }
          })
        }
      })
    }
  })

})

router.get("/orderTotal", (req, res) => {
  var userId = req.cookies.userId;
  var orderId = req.param("orderId");
  User.findOne({ userId }, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        mes: err1.message
      })
    } else {
      var data = doc.orderList.filter(val => val.orderId == orderId);
      console.log(data)
      res.json({
        status: 0,
        result: data[0].orderTotal
      })
    }
  })
})
module.exports = router;
