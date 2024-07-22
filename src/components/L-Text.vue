<script setup lang="ts">
import { textDefaultProps, textStylePropNames, transfotmToComponentProps } from '../defaultProps';
import { useComponentCommon } from '../hooks/useComponentCommon';

const props = defineProps({
  ...transfotmToComponentProps(textDefaultProps),
  tag: { default: "div", type: String }
});
// const styleProps = computed(() => pick(props, textStylePropNames));
// console.log(styleProps.value)
const { styleProps, handleClick } = useComponentCommon(props, textStylePropNames);
</script>

<template>
  <component :is="tag" :style="styleProps" @click="handleClick">
    {{ text }}
  </component>
</template>

<style scoped></style> 
