<template>
  <div class="form-info-field">
    <div class="form-info-field__icon" aria-hidden="true">
      <v-icon :name="resolvedIcon" />
    </div>

    <div class="form-info-field__content">
      <div v-if="label" class="form-info-field__label">
        {{ label }}
      </div>

      <div
        v-if="text"
        class="form-info-field__text"
        v-html="text"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "info",
    },
    text: {
      type: String,
      default: "",
    },
  },
  computed: {
    resolvedIcon() {
      return this.icon || "info";
    },
  },
};
</script>

<style scoped>
.form-info-field {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  border: var(--theme--border-width) solid var(--theme--border-color);
  border-radius: var(--theme--border-radius);
  background: var(--theme--background-subdued);
  color: var(--theme--foreground);
}

.form-info-field__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  color: var(--theme--primary);
}

.form-info-field__content {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.form-info-field__label {
  font-weight: 600;
  line-height: 1.4;
}

.form-info-field__text {
  line-height: 1.6;
  color: var(--theme--foreground-subdued);
}

.form-info-field__text :deep(p) {
  margin: 0 0 8px;
}

.form-info-field__text :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
