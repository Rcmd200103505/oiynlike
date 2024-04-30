<template>
  <ul class="d-flex flex-column ga-5">
    <template v-if="!isProcessing">
      <li
        v-for="item in items"
        :key="item.id"
        @click="onClickItem(item)"
        class="cursor-pointer"
      >
        <v-card class="mx-auto rounded" max-width="400">
          <v-img
            class="align-end text-white"
            height="150"
            :src="getCoverUrl(item)"
            cover
          />
          <v-card-item>
            <GameInfo :game="item" />
          </v-card-item>
        </v-card>
      </li>
    </template>
    <template v-else>
      <v-skeleton-loader
        v-for="idx in 5"
        :key="idx"
        class="mx-auto border w-100"
        max-width="400"
        type="image, article"
      />
    </template>
  </ul>
  <GameDetailsDialog
    v-model="showDialog"
    :game="currentGame"
    @update="$emit('update')"
    @close="currentGame = null"
  />
</template>

<script>
import GameInfo from "@/components/GameInfo.vue";
import GameDetailsDialog from "@/components/GameDetailsDialog.vue";
import { ref } from "vue";

export default {
  components: { GameDetailsDialog, GameInfo },
  emits: ["update"],
  props: {
    isProcessing: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const currentGame = ref(null);
    const showDialog = ref(false);

    function onClickItem(game) {
      currentGame.value = game;
      showDialog.value = true;
    }

    function getCoverUrl(item) {
      return item.cover_url
        ? item.cover_url
        : "http://161.35.19.27:8000/uploads/Frame.png";
    }

    return {
      showDialog,
      currentGame,
      onClickItem,
      getCoverUrl,
    };
  },
};
</script>
