<template>
  <BaseDialog>
    <template #activator="{ activatorProps }">
      <v-btn
          variant="flat"
          color="blue-darken-4"
          class="text-body-1 w-100"
          size="large"
          rounded="lg"
          v-bind="activatorProps"
      >
        Создать игру
      </v-btn>
    </template>
    <template #default="{ close }">
      <v-card>
        <v-card-title>
          <h1 class="text-h5 font-weight-bold" @click="close">
            <v-btn icon="fas fa-arrow-left-long" variant="flat"/>
            Создать игру
          </h1>
        </v-card-title>
        <v-card-item>
          <v-form @submit.prevent="handleCreate" class="d-flex flex-column">
            <v-label class="text-caption">
              Выберите фотографию для обложки
            </v-label>
            <BaseFileDrop class="mb-5" v-model="photo" @fileSelected="fileSelected"/>

            <v-label class="text-wrap"> Название</v-label>
            <v-text-field
                placeholder="Введите название игры"
                variant="outlined"
                density="comfortable"
                v-model="form.title"
            />

            <v-label class="text-wrap"> Об игре</v-label>
            <v-textarea
                placeholder="Напишите описание игры"
                variant="outlined"
                :counter="200"
                rows="3"
                density="comfortable"
                v-model="form.description"
            />

            <v-label class="text-wrap"> Город</v-label>
            <v-select
                placeholder="Город"
                :items="CITY_LIST"
                variant="outlined"
                density="comfortable"
                v-model="form.city"
            />

            <v-label class="text-wrap"> Тип игры</v-label>
            <v-select
                class="flex-grow-1 flex-shrink-0"
                placeholder="Тип игры"
                :items="GAME_TYPES"
                variant="outlined"
                density="comfortable"
                v-model="form.categ"
            />
            <v-label class="text-wrap">
              Минимальное количество игроков:
            </v-label>
            <v-text-field
                placeholder="Введите число"
                type="number"
                variant="outlined"
                density="comfortable"
                v-model="form.min_players"
            />
            
            <v-label class="text-wrap">
              Максимальное количество игроков:
            </v-label>
            <v-text-field
                placeholder="Введите число"
                type="number"
                variant="outlined"
                density="comfortable"
                v-model="form.max_players"
            />
            <div class="v-row">
              <div class="v-col">
                <v-text-field
                    prepend-inner-icon="far fa-calendar"
                    :class="$style.datetimeField"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                    v-model="scheduledDate"
                />
              </div>
              <div class="v-col">
                <v-text-field
                    prepend-inner-icon="far fa-clock"
                    :class="$style.datetimeField"
                    type="time"
                    variant="outlined"
                    density="comfortable"
                    v-model="scheduledTime"
                />
              </div>
            </div>
            <v-btn
                block
                variant="flat"
                size="large"
                rounded="lg"
                color="blue-darken-4"
                type="submit"
                class="align-self-end text-body-1 mb-4"
                :loading="isProcessing"
            >
              Создать игру
            </v-btn>
          </v-form>
        </v-card-item>
      </v-card>
    </template>
  </BaseDialog>
</template>

<script>
import {computed, ref} from "vue";
import BaseDialog from "@/components/BaseDialog.vue";
import GameService from "@/api/service/gameService";
import ProfileService from "@/api/service/profileService";
import BaseFileDrop from "@/components/BaseFileDrop.vue";
import {CITY_LIST, GAME_TYPES} from "@/constants";
import {useToastStore} from "@/store/useToastStore";

export default {
  components: {BaseFileDrop, BaseDialog},
  setup() {
    const form = ref({
      title: "",
      description: "",
      min_players: 1,
      max_players: 1,
      scheduled_time: null,
      city: null,
      type: null,
      cover_url: null,
    });

    const scheduledDate = ref(null);
    const scheduledTime = ref(null);
    const photo = ref(null);

    const dices = computed(() => [
      {icon: "fas fa-dice-one", value: 1},
      {icon: "fas fa-dice-two", value: 2},
      {icon: "fas fa-dice-three", value: 3},
      {icon: "fas fa-dice-four", value: 4},
      {icon: "fas fa-dice-five", value: 5},
      {icon: "fas fa-dice-six", value: 6},
    ]);

    const isProcessing = ref(false);

    async function handleCreate() {
      isProcessing.value = true;

      try {
        form.value.max_players = Number(form.value.max_players);
        form.value.min_players = Number(form.value.min_players);

        form.value.scheduled_time = new Date(
            `${scheduledDate.value}T${scheduledTime.value}`
        );
        const formData = new FormData();
        formData.append('photo', photo.value);
        form.value.cover_url = await ProfileService.uploadImage(formData);
        await GameService.createGame(form.value);
      } catch (e) {
        useToastStore().addToast(e.message, "error");
      } finally {
        isProcessing.value = false;
      }
    }

    return {
      form,
      dices,
      handleCreate,
      isProcessing,
      CITY_LIST,
      GAME_TYPES,
      scheduledDate,
      scheduledTime,
      photo,
    };
  },

  methods: {
    async fileSelected(file) {
      this.photo = file;
    },
  },
};
</script>

<style lang="scss" module>
.datetimeField {
  input::-webkit-calendar-picker-indicator {
    background: none;
    //display: none;
  }
}
</style>
