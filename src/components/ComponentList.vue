<script setup lang="ts">
import { v4 } from 'uuid';
import { ComponentData } from '../store/editorStore';
import LText from './L-Text.vue';
import { imageDefaultProps, TextComponentProps } from '../defaultProps';
import StyledUploader from './StyledUploader.vue';
import { RespUploadData } from '../store/respTypes';
import { message } from 'ant-design-vue';
import { getImageDimensions } from '../helper';
defineProps({
  list: {
    type: Array as any as any[],
    require: true
  },
});
const emit = defineEmits(["on-item-click"]);

const onItemClick = (props: Partial<TextComponentProps>) => {
  const componentData: ComponentData = {
    name: "LText",
    id: v4(),
    props: {
      ...props,
      // position:"relative"
    }
  }
  emit("on-item-click", componentData);
}

const onImageUploaded = (data: { resp: RespUploadData; file: File }) => {
  const {  file } = data;
  const componentData: ComponentData = {
    name: "l-image",
    id: v4(),
    props: {
      ...imageDefaultProps
    }
  }
  message.success("上传成功");
  // console.log(file);
  // componentData.props.src = resp.data.urls[0];
  componentData.props.src = URL.createObjectURL(file);
  // console.log(componentData.props.src);
  getImageDimensions(file).then(({ width }) => {
    const maxWidth = 373;
    componentData.props.width = ((width > maxWidth) ? maxWidth : width) + "px";
    emit("on-item-click", componentData);
  })
  // const { resp, file } = data;
  // const componentData:ComponentData = {
  //   name:"l-text",
  //   id:v4(),
  //   props:
  // }
}
</script>

<template>
  <div>
    <div v-for="(item, index) in list" :key="index" @click="onItemClick(item)">
      <LText v-bind="{ ...item, position: 'relative' }"></LText>
    </div>
  </div>
  <StyledUploader @success="onImageUploaded"></StyledUploader>
</template>

<style scoped></style>
