<template>
  <div
    :class="$style.dragArea"
    class="rounded-lg border-dashed cursor-pointer px-5 py-8 text-center"
    @dragover.prevent
    @dragenter.prevent
    @drop="handleDrop"
    @click="openFileInput"
  >
    <input
      type="file"
      style="display: none"
      ref="fileInput"
      accept="image/*"
      @change="handleFileInput"
    />
    <p class="text-grey-darken-1 font-weight-bold">Выберите фотографию</p>
    <div v-if="imagePreview" class="imagePreview">
      <img :src="imagePreview" alt="Selected Image" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup(props, { emit }) {
    const imagePreview = ref(null);
    const fileInput = ref(null);
    const photo = ref(null);

    function handleFileInput(event) {
      const file = event.target.files[0];
      emit('fileSelected', file);
      previewImage(file);
    }

    function previewImage(file) {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.value = event.target.result;
      };
      reader.readAsDataURL(file);
    }

    function handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      emit('fileSelected', file);
      previewImage(file);
    }

    function openFileInput() {
      if (fileInput.value != null) {
        fileInput.value.click();
      }
    }

    return {
      imagePreview,
      handleFileInput,
      handleDrop,
      openFileInput,
      fileInput,
      emit,
      photo,
    };
  },
};
</script>

<style module lang="scss">
.dragArea {
  border-color: #a6a6a6;
}
</style>
