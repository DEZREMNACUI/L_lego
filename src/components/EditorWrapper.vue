<script setup lang="ts">
defineProps({
  id: {
    type: String,
    require: true
  },
  active: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["set-active"]);
const onItemClick = (id: string) => {
  emit("set-active", id);
}
</script>

<template>
  <div @click=" onItemClick(id as string)" class="edit-wrapper" :class="{ active: active }">
    <slot></slot>
  </div>
</template>

<style scoped>
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
</style>
