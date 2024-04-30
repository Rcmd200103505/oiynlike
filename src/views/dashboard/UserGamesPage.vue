<template>
  <div class="d-flex flex-column flex-grow-1">
    <div
      v-if="noGames"
      class="d-flex flex-column align-center text-center flex-grow-1 justify-center"
    >
      <img
        :src="require('@/assets/images/no-games.svg')"
        alt="no games"
        width="100"
      />
      <h2 class="text-h5">
        У вас пока нет <br />
        своих игр
      </h2>
      <p class="text-body-2 text-grey-darken-1 my-4">
        Стань инициатором своей собственной игры! Создавай прямо сейчас!
      </p>
      <GameCreateDialog />
    </div>
    <template v-else>
      <div class="d-flex ga-5 mt-3">
        <div
          v-for="filter in filters"
          :key="filter.value"
          class="cursor-pointer"
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
        @update="fetchGamecards"
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
      fetchGamecards,
    };
  },
};
</script>

<style lang="scss" scoped></style>
