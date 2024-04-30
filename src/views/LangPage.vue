<template>
  <h1 class="text-h5 font-weight-bold">
    <v-btn icon="fas fa-arrow-left-long" variant="flat" to="/profile" />
    Сменя языка
  </h1>
  <div class="d-flex flex-column flex-grow-1 justify-space-between pb-4">
    <v-radio-group v-model="$i18n.locale">
      <v-radio color="primary" label="Русский" value="ru" />
      <v-radio color="primary" label="English" value="en" />
      <v-radio color="primary" label="Қазақ" value="kz" />
    </v-radio-group>
  </div>
</template>

<script>
export default {
  setup() {},
};
</script>
