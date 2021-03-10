const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let productSchema = new Schema({
    "productId": String,
    "productName": String,
    "scalePrice": Number,
    "productImg": String,
    "checked": Boolean,
    "productNum": Number
})
module.exports = mongoose.model("goods", productSchema);