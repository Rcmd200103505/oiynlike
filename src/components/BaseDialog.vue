<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="activator" :activatorProps="activatorProps" />
    </template>
    <slot :close="close" />
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    function close() {
      emit("update:modelValue", false);
    }

    return {
      close,
    };
  },
};
</script>
