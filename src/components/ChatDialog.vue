<template>
  <BaseDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #default="{ close }">
      <v-card>
        <v-card-title>
          <h1 class="text-h5 font-weight-bold" @click="close">
            <v-btn icon="fas fa-arrow-left-long" variant="flat" />
            {{ chat.title }}
          </h1>
        </v-card-title>
        <v-card-item class="flex-grow-1 d-block">
          <ul class="d-flex flex-column ga-5">
            <li
              v-for="message in messages"
              :key="message.created_at"
              class="w-100 d-flex"
              :class="{
                'justify-end': message.sender.user_id === authStore.user.id,
              }"
            >
              <div
                :class="
                  message.sender.user_id === authStore.user.id ? 'pl-4' : 'pr-4'
                "
              >
                <div
                  class="text-grey text-body-2"
                  :class="{
                    'text-end': message.sender.user_id === authStore.user.id,
                  }"
                >
                  {{
                    message.sender.first_name + " " + message.sender.last_name
                  }}
                </div>
                <div
                  class="pa-2 rounded-lg"
                  :class="
                    message.sender.user_id === authStore.user.id
                      ? 'bg-blue-darken-2'
                      : 'bg-blue-grey-lighten-5'
                  "
                >
                  {{ message.content }}
                </div>
                <div
                  class="text-grey text-body-2"
                  :class="{
                    'text-end': message.sender.user_id === authStore.user.id,
                  }"
                >
                  {{ DateUtil.formatDate(message.created_at) }}
                </div>
              </div>
            </li>
          </ul>
        </v-card-item>
        <v-card-actions>
          <v-text-field
            placeholder="Ваше сообщение"
            variant="solo"
            rounded="lg"
            density="compact"
            prepend-inner-icon="fas fa-magnifying-glass"
            v-model="text"
            hide-details
            class="mr-2"
          />
          <v-btn
            color="primary"
            icon="fas fa-paper-plane"
            variant="flat"
            @click="sendMessage"
          />
        </v-card-actions>
      </v-card>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/BaseDialog.vue";
import { ref, watch, toRefs } from "vue";
import { useAuthStore } from "@/store/useAuthStore";
import { pusher } from "@/utils/pusher";
import DateUtil from "../utils/DateUtil";
import GameService from "@/api/service/gameService";

export default {
  computed: {
    DateUtil() {
      return DateUtil;
    },
  },
  components: { BaseDialog },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    chat: {
      type: Object,
    },
  },
  emits: ["update:modelValue"],
  setup(props) {
    const authStore = useAuthStore();
    const messages = ref([]);

    watch(
      () => props.chat,
      () => {
        messages.value = props.chat.messages.slice();
      }
    );

    const { chat } = toRefs(props);
    // Watch for changes to the chat prop
    watch(chat, (newChat, oldChat) => {
      console.log('chat prop changed:', newChat, oldChat);
      const gameChatChannel = pusher.subscribe("game-chat-" + props.chat?.id);
      gameChatChannel.bind("new-message", function (data) {
        console.log("New Message:", data);
        messages.value.push(data);
      });
    });

    const userNotificationsChannel = pusher.subscribe(
      "user-notifications-" + authStore.user.id
    );
    userNotificationsChannel.bind("new-notification", function (data) {
      console.log("New Notification:", data);
    });

    const text = ref("");

    async function sendMessage() {
      await GameService.sendMessage(props.chat.id, text.value);
      text.value = "";
    }

    return {
      sendMessage,
      text,
      messages,
      authStore,
    };
  },
};
</script>
