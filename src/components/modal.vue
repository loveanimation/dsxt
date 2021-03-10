<template>
  <div>
    <div
      class="md-modal modal-msg md-modal-transition"
      v-bind:class="{ 'md-show': mdShow }"
    >
      <div class="md-modal-inner">
        <div class="md-top">
          <!-- <div class="md-title">Login in</div> -->
          <button class="md-close" @click="update">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="login-wrap">
            <slot name="btn"></slot>
          </div>
        </div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="md-overlay" v-show="mdShow" @click="update"></div>
  </div>
</template>

<script>
// 模态框
export default {
  props: {
    mdShow: Boolean,
  },
  methods: {
    update() {
      this.$emit("update");
    },
  },
};
</script>

<style  scoped>
</style>