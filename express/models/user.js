var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [{
        "productImg": String,
        "scalePrice": Number,
        "productName": String,
        "productId": String,
        "productNum": Number,
        "checked": Boolean
    }],
    "addressList": [{
        "addressId": String,
        "userName": String,
        "streetName": String,
        "postCode": String,
        "tel": String,
        "isDefault": Boolean
    }]
})
module.exports = mongoose.model("user", userSchema)