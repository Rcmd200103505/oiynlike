<template>
  <RecommendedGamesFilter
    class="position-sticky bg-white pt-5 w-100"
    :class="$style.sticky"
  />
  <GamesList
    :items="gamecards"
    :isProcessing="isProcessing"
    @update="fetchGamecards"
  />
  <FloatingButton />
</template>

<script>
import GamesList from "@/components/GamesList.vue";
import RecommendedGamesFilter from "@/components/RecommendedGamesFilter.vue";
import { onMounted, ref } from "vue";
import GameService from "@/api/service/gameService";
import FloatingButton from "@/components/FloatingButton.vue";

export default {
  components: { FloatingButton, RecommendedGamesFilter, GamesList },
  setup() {
    const isProcessing = ref(false);
    const gamecards = ref([]);

    async function fetchGamecards() {
      isProcessing.value = true;
      try {
        gamecards.value = await GameService.fetchRecommendedGamecards();
      } catch (e) {
        console.error(e);
      } finally {
        isProcessing.value = false;
      }
    }

    onMounted(() => {
      fetchGamecards();
    });

    return {
      gamecards,
      isProcessing,
      fetchGamecards,
    };
  },
};
</script>

<style lang="scss" module>
.sticky {
  z-index: 10;
  top: -24px;
  left: -24px;
}
</style>
