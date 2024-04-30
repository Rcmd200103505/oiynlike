<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-5">
      <h1 class="text-h5 font-weight-bold">Профиль</h1>
      <v-btn
        icon="fas fa-arrow-right-from-bracket"
        variant="text"
        @click="handleLogout"
      />
    </div>
    <v-avatar size="130" class="mx-auto d-block mb-2">
      <v-img alt="profile pic" :src="profilePic"></v-img>
    </v-avatar>
    <h2 class="text-h5 font-weight-bold text-center">{{ userFullname }}</h2>
    <div class="d-flex justify-space-between align-center">
      <h4 class="text-blue-darken-4 font-weight-bold text-h6">О себе</h4>
      <ProfileEditDialog />
    </div>
    <p v-if="user?.about_user.length > 0">{{ user.about_user }}</p>
    <p v-else class="text-grey-darken-2">Нет описания пользователя</p>
    <h4 class="my-4 text-blue-darken-4 font-weight-bold text-h6">Игры</h4>
    <div v-if="!gamecards.length" class="text-grey text-body-2">
      Вы пока не создавали свои игры
    </div>
    <ul v-else class="d-flex flex-column ga-3">
      <li
        v-for="game in gamecards"
        :key="game.id"
        class="cursor-pointer"
        @click="onClickItem(game)"
      >
        <v-card elevation="2">
          <v-card-item>
            <div class="text-blue-darken-4 mb-3 text-h6 font-weight-bold">
              {{ game.title }}
            </div>
            <div class="d-flex align-center">
              <div class="d-flex align-center mr-4">
                <v-icon icon="far fa-calendar" color="primary" />
                <span class="ml-2 text-body-2">{{
                  DateUtil.formatDate(game.scheduled_time)
                }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="fas fa-earth-americas" color="primary" />
                <span class="ml-2 text-body-2">{{ game.city }}</span>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </li>
    </ul>
    <h4 class="my-4 text-blue-darken-4 font-weight-bold text-h6">Настройки</h4>
    <div class="text-body-1 font-weight-bold">
      <RouterLink to="/lang" class="text-black text-decoration-none">
        Сменить язык
      </RouterLink>
    </div>
  </div>
  <GameDetailsDialog
    v-model="showDialog"
    :game="currentGame"
    @update="$emit('update')"
    @close="currentGame = null"
  />
</template>

<script>
import { useAuthStore } from "@/store/useAuthStore";
import { storeToRefs } from "pinia";
import ProfileEditDialog from "@/components/ProfileEditDialog.vue";
import { useRouter } from "vue-router";
import { DEFAULT_PICTURE_SRC } from "@/constants";
import { computed, onMounted, ref } from "vue";
import GameService from "@/api/service/gameService";
import GameDetailsDialog from "@/components/GameDetailsDialog.vue";
import DateUtil from "@/utils/DateUtil";

export default {
  computed: {
    DateUtil() {
      return DateUtil;
    },
  },
  components: { GameDetailsDialog, ProfileEditDialog },
  setup() {
    const authStore = useAuthStore();
    const { user, userFullname } = storeToRefs(authStore);
    const router = useRouter();

    function handleLogout() {
      authStore.logout();
      router.push("/auth");
    }

    const gamecards = ref([]);

    async function fetchGamecards() {
      try {
        gamecards.value = (await GameService.fetchUserGamecards()) ?? [];
      } catch (e) {
        console.error(e);
      }
    }

    onMounted(() => {
      fetchGamecards();
    });

    const currentGame = ref(null);
    const showDialog = ref(false);

    function onClickItem(game) {
      currentGame.value = game;
      showDialog.value = true;
    }

    const profilePic = computed(() => {
      if (user.value?.photo_url.length) {
        return user.value.photo_url;
      }
      return DEFAULT_PICTURE_SRC;
    });

    return {
      profilePic,
      user,
      currentGame,
      showDialog,
      onClickItem,
      gamecards,
      userFullname,
      handleLogout,
      DEFAULT_PICTURE_SRC,
    };
  },
};
</script>
