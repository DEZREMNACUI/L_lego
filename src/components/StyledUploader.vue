<script setup lang="ts">
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import Uploader from './Uploader.vue';
import { commonUploadCheck } from '../helper';

const props = defineProps({
  text: {
    type: String,
    default: "上传图片"
  },
  showUploaded: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["success"]);
const handleUploadSuccess = (resp: any, file: File) => {
  // console.log(file)
  emit("success", { resp, file });
}
</script>

<template>
  <Uploader class="styled-uploader" action="http://localhost:8000/test" :showUploadList="false"
    :beforeUpload="commonUploadCheck" @success="(data) => { handleUploadSuccess(data.resp, data.file.raw) }">
    <div class="uploader-container">
      <FileImageOutlined></FileImageOutlined>
      <h4>{{ text }}</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined spin>
        </LoadingOutlined>
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded="dataProps">
      <div class="uploader-container">
        <img :src="dataProps.uploadedData.data.urls[0]" alt="1" v-if="showUploaded">
        <template v-else>
          <FileImageOutlined></FileImageOutlined>
          <h4>{{ text }}</h4>
        </template>
      </div>
    </template>
  </Uploader>
</template>

<style scoped></style>
