<template>
  <div class="d-flex justify-space-between align-center mb-3">
    <div class="text-blue-darken-4 text-body-1 font-weight-bold">
      {{ game.title }}
    </div>
    <div class="text-grey-darken-2 text-caption">#{{ game.category }}</div>
  </div>
  <div class="d-flex justify-space-between align-center">
    <div class="d-flex align-center">
      <v-icon icon="far fa-calendar" color="primary" />
      <span class="ml-2 text-body-2">{{ date }}</span>
    </div>
    <div class="d-flex align-center">
      <v-icon icon="fas fa-earth-americas" color="primary" />
      <span class="ml-2 text-body-2">{{ game.city }}</span>
    </div>
  </div>
  <div :class="status.class" class="text-body-2 my-2">{{ status.title }}</div>
  <div v-if="showDescription" class="my-2">
    <div class="text-blue-darken-4 text-body-1 font-weight-bold">Об игре</div>
    <div class="elevation-2 text-body-2 pa-3 rounded-lg mt-2">
      {{ game.description }}
    </div>
  </div>
  <div class="text-body-2 mb-4">
    Максимальное кол-во игроков: {{ game.max_players }}
  </div>
  <div
    v-if="!showDescription"
    class="d-flex align-center justify-space-between"
  >
    <div v-if="game.matched_players.length" class="d-flex align-center">
      <v-avatar
        v-for="player in playersPreview"
        :key="player.user_id"
        color="blue-darken-4"
        size="35"
      >
        <v-img v-if="player.photo_url?.length" :src="player.photo_url" />
        <span v-else class="text-body-2">
          {{ player.first_name[0] + player.last_name[0] }}
        </span>
      </v-avatar>
      <span v-if="playersCount" class="text-body-2">
        + {{ playersCount }} игроков
      </span>
    </div>
    <span v-else class="text-body-2"> Нет игроков </span>
    <slot name="join" :game="game" />
  </div>
  <div v-else class="v-row">
    <v-col cols="4" class="text-center">
      <v-avatar color="blue-darken-4" size="70" class="mx-auto d-block">
        <v-img :src="game.host_user.photo_url || DEFAULT_PICTURE_SRC" />
      </v-avatar>
      <div class="text-body-2 mt-1">
        {{ game.host_user.first_name + " " + game.host_user.last_name }}
      </div>
      <div class="text-caption text-grey">Создатель</div>
    </v-col>
    <v-col v-for="player in playersPreview" :key="player.user_id" cols="4">
      <v-avatar color="blue-darken-4" size="70" class="mx-auto d-block">
        <v-img :src="player.photo_url || DEFAULT_PICTURE_SRC" />
      </v-avatar>
      <div class="text-body-2 mt-1">
        {{ player.first_name + " " + player.last_name }}
      </div>
      <div class="text-caption text-grey text-center">Игрок</div>
    </v-col>
  </div>
</template>

<script>
import { computed } from "vue";
import DateUtil from "@/utils/DateUtil";
import { DEFAULT_PICTURE_SRC } from "@/constants";

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
    showDescription: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const date = computed(() => DateUtil.formatDate(props.game.scheduled_time));

    const playersPreview = computed(() =>
      props.game.matched_players.slice(0, 3)
    );

    const playersCount = computed(() =>
      props.game.matched_players.length > 3
        ? props.game.matched_players.length - 3
        : 0
    );

    const status = computed(() => {
      if (props.game.status === "active") {
        return { class: "text-green", title: "Активная" };
      } else if (props.game.status === "moderation") {
        return { class: "text-warning", title: "В модерации" };
      }

      return { title: "Неактивная" };
    });

    return { date, status, playersPreview, playersCount, DEFAULT_PICTURE_SRC };
  },
};
</script>
