<template>
  <div class="d-flex flex-column flex-grow-1">
    <div
      v-if="noGames"
      class="d-flex flex-column align-center text-center flex-grow-1 justify-center"
    >
      <!-- Контент для случая, когда нет игр -->
    </div>
    <template v-else>
      <div class="d-flex ga-5">
        <div
          v-for="filter in filters"
          :key="filter.value"
          :class="
            activeFilter === filter.value
              ? 'text-blue-darken-4'
              : 'text-grey-darken-2'
          "
          @click="activeFilter = filter.value"
        >
          {{ filter.text }}
        </div>
      </div>
      <GamesList
        class="flex-grow-1 my-5"
        :items="filteredGamecards"
        :isProcessing="isProcessing"
      />
      <GameCreateDialog />
    </template>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import GameService from "@/api/service/gameService";
import GamesList from "@/components/GamesList.vue";
import GameCreateDialog from "@/components/GameCreateDialog.vue";

export default {
  components: { GameCreateDialog, GamesList },
  setup() {
    const activeFilter = ref("all");
    const filters = computed(() => [
      {
        text: "Все",
        value: "all",
      },
      {
        text: "Активные",
        value: "active",
      },
      {
        text: "В модерации",
        value: "moderation",
      },
    ]);

    const isProcessing = ref(false);
    const loaded = ref(false);
    const gamecards = ref([]);

    const noGames = computed(() => loaded.value && !gamecards.value.length);

    async function fetchGamecards() {
      isProcessing.value = true;
      try {
        gamecards.value = (await GameService.fetchUserGamecards()) ?? [];
      } catch (e) {
        console.error(e);
      } finally {
        isProcessing.value = false;
        loaded.value = true;
      }
    }

    const filteredGamecards = computed(() => {
      if (activeFilter.value === "all") {
        return gamecards.value;
      } else {
        return gamecards.value.filter(
          (gamecard) => gamecard.status === activeFilter.value
        );
      }
    });

    onMounted(() => {
      fetchGamecards();
    });

    return {
      noGames,
      gamecards,
      isProcessing,
      activeFilter,
      filters,
      loaded,
      filteredGamecards,
    };
  },
};
</script>

<style lang="scss" scoped></style>
