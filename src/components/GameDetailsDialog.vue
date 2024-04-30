<template>
  <BaseDialog v-model="dialog">
    <template #default="{ close }">
      <v-card v-if="game">
        <v-card-title>
          <h1 class="text-h5 font-weight-bold" @click="close">
            <v-btn icon="fas fa-arrow-left-long" variant="flat" />
            Информация об игре
          </h1>
        </v-card-title>
        <v-card-text
          class="d-flex flex-column flex-grow-1 justify-space-between pb-4"
        >
          <div>
            <GameInfo :game="game" show-description />
          </div>
          <v-btn
            v-if="isJoinButtonShown"
            variant="flat"
            color="blue-darken-4"
            rounded="lg"
            size="large"
            class="text-body-2 w-100"
            :loading="isProcessing"
            @click="handleJoin"
          >
            Присоединиться
          </v-btn>
        </v-card-text>
      </v-card>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "@/components/BaseDialog.vue";
import GameInfo from "@/components/GameInfo.vue";
import { computed, ref, watch } from "vue";
import { useToastStore } from "@/store/useToastStore";
import GameService from "@/api/service/gameService";
import { useAuthStore } from "@/store/useAuthStore";

export default {
  components: { BaseDialog, GameInfo },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    game: {
      type: Object,
    },
  },
  emits: ["update", "update:modelValue", "close"],
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const dialog = ref(false);
    const isProcessing = ref(false);

    const isJoinButtonShown = computed(() => {
      return (
        props.game?.host_user.user_id !== authStore.user.id &&
        !props.game?.matched_players.find(
          (p) => p.user_id === authStore.user.id
        )
      );
    });

    watch(
      () => dialog.value,
      (newV) => {
        emit("update:modelValue", newV);
        if (!newV) {
          emit("close");
        }
      }
    );

    watch(
      () => props.modelValue,
      (newV) => {
        dialog.value = newV;
      }
    );

    const handleJoin = async () => {
      isProcessing.value = true;

      try {
        await GameService.joinGame(props.game.id);
        useToastStore().addToast("Вы успешно присоединились к игре!");
        dialog.value = false;
        emit("update");
      } catch (e) {
        useToastStore().addToast("Не удалось присоединиться к игре", "error");
      } finally {
        isProcessing.value = false;
      }
    };

    return { isJoinButtonShown, handleJoin, isProcessing, dialog };
  },
};
</script>

<style lang="scss" scoped></style>
