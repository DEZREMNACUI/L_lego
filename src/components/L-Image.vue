<script setup lang="ts">
import { imageDefaultProps, imageStylePropsNames, transformToComponentProps } from '../defaultProps';
import { useComponentCommon } from '../hooks/useComponentCommon';

// const defaultProps = transformToComponentProps(imageDefaultProps);
const props = defineProps({
  // ...defaultProps
  ...transformToComponentProps(imageDefaultProps)
});
const { styleProps, handleClick } = useComponentCommon(props, imageStylePropsNames);
</script>

<template>
  <img class="l-image-component" @click.prevent="handleClick" :src="src" alt="1" :style="styleProps as any">
</template>

<style scoped></style>
