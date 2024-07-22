<script setup lang="ts">
import { v4 } from 'uuid';
import { ComponentData } from '../store/editorStore';
import LText from './L-Text.vue';
import { TextComponentProps } from '../defaultProps';
defineProps({
  list: {
    type: Array as any as any[],
    require: true
  }
});
const emit = defineEmits(["on-item-click"]);

const onItemClick = (props: Partial<TextComponentProps>) => {
  const componentData: ComponentData = {
    name: "LText",
    id: v4(),
    props:{
      ...props,
      // position:"relative"
    }
  }
  emit("on-item-click", componentData);
}
</script>

<template>
  <div>
    <div v-for="(item, index) in list" :key="index" @click="onItemClick(item)">
      <LText v-bind="{...item,position:'relative'}"></LText>
    </div>
  </div>
</template>

<style scoped></style>
