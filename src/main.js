import Vue from 'vue'
import App from './App.vue'
import router from './router'
import lazyload from 'vue-lazyload'
import infiniteScroll from "vue-infinite-scroll"   // 分页懒加载
import { currency } from "./util/currency";
import Vuex from "vuex"
Vue.config.productionTip = false
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    nickName: "",   // 登录名称
    cartCount: 0    // 购物车数量
  },
  mutations: {
    updateUserInfo(state, nickName) {
      state.nickName = nickName
    },
    updateCartCount(state, cartCount) {
      state.cartCount += cartCount
    }
  }
})
Vue.use(infiniteScroll)
Vue.use(lazyload, {
  loading: "/static/loading-svg/loading-balls.svg"
})
Vue.filter("guo", currency)   // 全局过滤器
new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
