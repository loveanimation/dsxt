<template>
  <div>
    <shop-header></shop-header>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li class="cur"><span>Make</span> payment</li>
          <li class="cur"><span>Order</span> confirmation</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic">
          <img src="../../static/ok-2.png" alt="" />
        </div>
        <div class="order-create-main">
          <h3>Congratulations! <br />Your order is under processing!</h3>
          <p>
            <span>Order ID：{{ orderId }}</span>
            <span>Order total：{{ orderTotal }}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link to="/cart" class="btn btn--m">Cart List</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link to="/" class="btn btn--m">Goods List</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ShopFooter />
  </div>
</template>
<script>
import ShopHeader from "@/components/ShopHeader";
import ShopFooter from "@/components/ShopFooter";

import axios from "axios";
export default {
  components: {
    ShopHeader,
    ShopFooter,
  },
  data() {
    return {
      orderId: "",
      orderTotal: "",
    };
  },
  mounted() {
    // console.log(this.$route.query);
    var orderId = this.$route.query.orderId;
    this.orderId = orderId;
    axios.get("/users/orderTotal", { params: { orderId } }).then((res) => {
      if (res.data.status == 0) {
        this.orderTotal = res.data.result;
      }
    });
  },
};
</script>
