import Vue from 'vue'
import Router from "vue-router";
import GoodsList from "@/view/GoodsList"
Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'goods-list',
            component: GoodsList
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import("@/view/cart")
        },
        {
            path: '/address',
            name: 'address',
            component: () => import("@/view/address")
        },
        {
            path: '/orderConfrim',
            name: 'orderConfrim',
            component: () => import("@/view/orderConfrim")
        },
        {
            path: '/orderSuccess',
            name: 'orderSuccess',
            component: () => import("@/view/orderSuccess")
        },
    ]
})