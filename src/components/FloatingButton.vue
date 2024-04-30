<template>
  <Transition name="fade">
    <v-btn
      v-show="showScrollButton"
      class="fixed"
      :class="$style.btn"
      icon="mdi-chevron-up"
      size="small"
      @click="scrollToTop"
    />
  </Transition>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";

export default {
  setup() {
    const showScrollButton = ref(false);

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    function onScroll() {
      console.log(window.scrollY);
      showScrollButton.value = window.scrollY > 100;
    }

    onMounted(() => {
      window.addEventListener("scroll", onScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", onScroll);
    });

    return {
      scrollToTop,
      showScrollButton,
    };
  },
};
</script>

<style lang="scss" module>
.btn {
  z-index: 20;
  bottom: 10px;
  right: 10px;
}
</style>

<style lang="scss" scoped>
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
