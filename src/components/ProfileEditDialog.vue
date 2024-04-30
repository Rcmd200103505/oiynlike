<template>
  <BaseDialog v-model="dialog">
    <template #activator="{ activatorProps }">
      <v-btn
        icon="fas fa-pen"
        variant="text"
        size="small"
        color="primary"
        v-bind="activatorProps"
      />
    </template>
    <template #default="{ close }">
      <v-card>
        <v-card-title>
          <h1 class="text-h5 font-weight-bold" @click="close">
            <v-btn icon="fas fa-arrow-left-long" variant="flat" />
            Редактирование профиля
          </h1>
        </v-card-title>
        <v-card-item>
          <v-form @submit.prevent="handleSave" class="d-flex flex-column">
            <v-avatar size="130" class="mx-auto d-block mb-2">
              <v-img alt="avatar" :src="profilePic" />
            </v-avatar>
            <v-btn variant="text" size="x-small" @click="openFileInput">
              Сменить фото профиля
            </v-btn>
            <input
              type="file"
              class="d-none"
              ref="fileInput"
              accept="image/*"
              @change="handleFileInput"
            />
            <v-label>Имя</v-label>
            <v-text-field
              placeholder="Имя"
              variant="outlined"
              density="comfortable"
              v-model="form.first_name"
            />
            <v-label>Фамилия</v-label>
            <v-text-field
              placeholder="Фамилия"
              variant="outlined"
              density="comfortable"
              v-model="form.last_name"
            />
            <v-label>E-mail</v-label>
            <v-text-field
              placeholder="E-mail"
              variant="outlined"
              density="comfortable"
              v-model="form.email"
            />
            <v-label>О себе</v-label>
            <v-text-field
              placeholder="О себе"
              variant="outlined"
              density="comfortable"
              v-model="form.about_user"
            />
            <v-btn
              block
              variant="flat"
              size="large"
              rounded="lg"
              color="blue-darken-4"
              type="submit"
              class="align-self-end text-body-1"
              :loading="isProcessing"
            >
              Сохранить изменения
            </v-btn>
          </v-form>
        </v-card-item>
      </v-card>
    </template>
  </BaseDialog>
</template>

<script>
import { computed, ref } from "vue";
import BaseDialog from "@/components/BaseDialog.vue";
import { useAuthStore } from "@/store/useAuthStore";
import { storeToRefs } from "pinia";
import ProfileService from "@/api/service/profileService";
import { DEFAULT_PICTURE_SRC } from "@/constants";
import { useToastStore } from "@/store/useToastStore";

export default {
  components: { BaseDialog },
  setup() {
    const dialog = ref(false);

    const authStore = useAuthStore();
    const { user } = storeToRefs(authStore);

    const form = ref({
      first_name: user.value?.first_name ?? "",
      last_name: user.value?.last_name ?? "",
      email: user.value?.email ?? "",
      about_user: user.value?.about_user ?? "",
    });

    const isProcessing = ref(false);

    async function handleSave() {
      isProcessing.value = true;

      try {
        if (imagePreview.value) {
          const formData = new FormData();
          formData.append("photo", newPhoto.value);
          form.value.photo_url = await ProfileService.uploadImage(formData);
        }
        await ProfileService.updateProfile(form.value);
        await authStore.refreshUser();
        useToastStore().addToast("Вы успешно присоединились к игре!");
        dialog.value = false;
      } catch (e) {
        console.error(e);
      } finally {
        isProcessing.value = false;
      }
    }

    const imagePreview = ref(null);
    const fileInput = ref(null);
    const newPhoto = ref(null);

    function handleFileInput(event) {
      const file = event.target.files[0];
      newPhoto.value = file;
      previewImage(file);
    }

    function openFileInput() {
      if (fileInput.value != null) {
        fileInput.value.click();
      }
    }

    function previewImage(file) {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.value = event.target.result;
      };
      reader.readAsDataURL(file);
    }

    const profilePic = computed(() => {
      if (imagePreview.value) {
        return imagePreview.value;
      }
      if (user.value?.photo_url.length) {
        return user.value.photo_url;
      }
      return DEFAULT_PICTURE_SRC;
    });

    return {
      form,
      handleFileInput,
      handleSave,
      imagePreview,
      fileInput,
      profilePic,
      newPhoto,
      openFileInput,
      isProcessing,
      dialog,
    };
  },
};
</script>
