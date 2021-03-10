<template>
  <div>
    <div
      class="mask_layer"
      id="mask_layer"
      v-show="price_mask"
      @click="price_mask = !price_mask"
    ></div>
    <shop-header></shop-header>
    <shop-bread>
      <span slot="demo">Goods</span>
    </shop-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default">Default</a>
          <a href="javascript:void(0)" class="price" @click="sort"
            >Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use></svg
          ></a>
          <a
            href="javascript:void(0)"
            class="filterby stopPop"
            @click="price_mask = !price_mask"
            >Filter by</a
          >
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div
            class="filter stopPop"
            id="filter"
            :class="{ 'filterby-show': price_mask }"
          >
            <!-- 添加filterby-show会出现菜单 -->
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd
                :class="{ cur: priceState == 'active' }"
                @click="
                  priceState = 'active';
                  page = 1;
                  getGoodlist();
                "
              >
                <a href="javascript:void(0)">All</a>
              </dd>
              <dd
                v-for="(val, index) in PriceFilter"
                :key="index"
                :class="{ cur: priceState == index }"
                @click="
                  priceState = index;
                  price_mask = false;
                  page = 1;
                  getGoodlist();
                "
              >
                <a href="javascript:void(0)"
                  >{{ val.startPrice }} - {{ val.endPrice }}</a
                >
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(val, index) in goodList" :key="index">
                  <div class="pic">
                    <a href="#" class="cur">
                      <img src="../../static/4.jpg" alt="" />
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{ val.productName }}</div>
                    <div class="price">{{ val.scalePrice }}</div>
                    <div class="btn-area">
                      <a
                        href="javascript:;"
                        class="btn btn--m"
                        @click="addCart(val.productId)"
                        >加入购物车</a
                      >
                    </div>
                  </div>
                </li>
              </ul>
              <div
                class="goodLoad"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="10"
                v-show="loadingSVG"
              >
                <img
                  src="../../static/loading-svg/loading-cylon-red.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :mdShow="mdShow" @update="update">
      <p slot="message">请登录,否则无法加入购物车</p>
      <div slot="btn">
        <a class="btn btn--m" @click="update">关闭</a>
      </div>
    </modal>
    <modal :mdShow="mdShowCart" @update="update">
      <p slot="message">加入购物车成功!!!</p>
      <div slot="btn">
        <a class="btn btn--m" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m" style="float: right" to="/cart"
          >查看购物车</router-link
        >
      </div>
    </modal>
    <shop-footer></shop-footer>
  </div>
</template>

<script>
import "@/assets/css/product.css";
import "@/assets/css/checkout.css";
import "@/assets/css/login.css";
import ShopHeader from "@/components/ShopHeader";
import ShopFooter from "@/components/ShopFooter";
import ShopBread from "@/components/ShopBread";
import Modal from "@/components/modal";
import axios from "axios";
export default {
  data() {
    return {
      mdShow: false, // 默认没有登录 modal为隐藏
      mdShowCart: false,
      loadingSVG: false,
      goodList: [],
      priceState: "active",
      price_mask: false,
      sortFlag: true, // 升序开关
      page: 1, // 页码
      pageSize: 4, // 显示多少
      busy: true, // 分页是否显示下一页  默认禁止下一页  true:禁止
      PriceFilter: [
        { startPrice: "0.00", endPrice: "100" },
        { startPrice: "100", endPrice: "500" },
        { startPrice: "500", endPrice: "1000" },
        { startPrice: "1000", endPrice: "2000" },
        { startPrice: "2000", endPrice: "5000" },
      ],
    };
  },
  components: {
    ShopHeader,
    ShopFooter,
    ShopBread,
    Modal,
  },
  mounted() {
    this.getGoodlist();
  },
  methods: {
    update() {
      this.mdShow = false;
      this.mdShowCart = false;
    },
    getGoodlist(flag) {
      this.loadingSVG = true;
      var { page, pageSize, sortFlag, priceState } = this;
      var sort = sortFlag ? 1 : -1;
      axios
        .get("goods/list", { params: { page, pageSize, sort, priceState } })
        .then((res) => {
          console.log(res);
          if (res.data.status == 0) {
            this.loadingSVG = false;
            if (flag) {
              if (res.data.result.count == 0) {
                this.busy = true;
                return;
              }
              this.goodList = this.goodList.concat(res.data.result.list);
            } else {
              this.goodList = res.data.result.list; // 数据加载第一页
              this.busy = false;
            }
          } else {
            this.goodList = [];
          }

          // console.log(res);
        });
    },
    loadMore() {
      // console.log("我执行了");
      // setTimeout(() => {
      this.page++;
      this.getGoodlist(true); // true 决定数据是否累加
      // }, 500);
    },
    addCart(id) {
      console.log(id);
      axios.post("/goods/addCart", { productId: id }).then((res) => {
        console.log(res.data);
        // alert(res.data.status == 0 ? "添加成功" : "添加失败");
        res.data.status == 0 ? (this.mdShowCart = true) : (this.mdShow = true);
      });
    },
    sort() {
      // 升降序
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodlist();
    },
  },
};
</script>

<style>
.goodLoad {
  width: 100%;
  height: 40px;
  text-align: center;
}
.mask_layer {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  z-index: 99;
}
</style>>

