<template>
  <div>
    <ChatDialog v-model="dialog" :chat="currentChat" />
    <v-text-field
      placeholder="Поиск"
      variant="solo"
      rounded="lg"
      density="compact"
      prepend-inner-icon="fas fa-magnifying-glass"
      v-model="search"
      class="mb-2"
    />
    <h1 class="text-h5 mb-4">Беседы</h1>
    <div
      v-if="isProcessing"
      class="flex-grow-1 position-absolute"
      :class="$style.spinner"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        :size="50"
      ></v-progress-circular>
    </div>
    <div v-else-if="!chats.length" class="text-center text-grey">
      {{ $t("У вас нет активных чатов") }}
    </div>
    <ul v-if="chats.length" class="d-flex flex-column ga-4">
      <li
        v-for="chat in filteredChats"
        :key="chat.id"
        class="cursor-pointer"
        @click="onClickChat(chat)"
      >
        <v-card>
          <v-card-item>
            <div class="text-h6">{{ chat.title }}</div>
            <div class="text-body-2 text-grey">
              {{ $t("Последнее сообщение") }}
            </div>
          </v-card-item>
        </v-card>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import GameService from "@/api/service/gameService";
import ChatDialog from "@/components/ChatDialog.vue";

export default {
  components: { ChatDialog },
  setup() {
    const search = ref("");
    const chats = ref([]);
    const isProcessing = ref(false);

    const filteredChats = computed(() => {
      if (!search.value.length) {
        return chats.value;
      }
      return chats.value.filter((c) =>
        c.title.toLowerCase().startsWith(search.value.toLowerCase())
      );
    });

    async function fetchChats() {
      isProcessing.value = true;

      try {
        const response = await GameService.fetchChats();
        chats.value = response.chats ?? [];
      } catch (e) {
        console.error(e);
      } finally {
        isProcessing.value = false;
      }
    }

    onMounted(() => {
      fetchChats();
    });

    const currentChat = ref(null);
    const dialog = ref(false);

    function onClickChat(chat) {
      fetchChats();
      dialog.value = true;
      currentChat.value = chat;
    }

    return {
      dialog,
      onClickChat,
      currentChat,
      search,
      isProcessing,
      chats,
      filteredChats,
    };
  },
};
</script>

<style lang="scss" module>
.spinner {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
