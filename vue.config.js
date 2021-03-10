// const route = require("./express")
module.exports = {
    lintOnSave: true,
    devServer: {
        open: true,  // 是否自动打开浏览器
        proxy: "http://localhost:3000"
        // before(route) {
        //     var appData = require("./data/goods.json");
        //     route.get('/api/goods', (req, res) => {
        //         res.json({
        //             // 给客户端的数据
        //             goodslist: appData
        //         })
        //     })
        // }
    }

}