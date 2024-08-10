<script setup lang="ts">
import { DeleteOutlined, FileOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { last } from 'lodash-es';
import { v4 } from 'uuid';
import { computed, PropType, Reactive, reactive, ref } from 'vue';

type UploadStaus = "ready" | "success" | "error" | "loading";
type CheckUpload = (file: File) => boolean | Promise<File>;
type FileListType = "picture" | "text";
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStaus;
  raw: File;
  resp?: any;
  url?: string;
}

const props = defineProps({
  action: {
    type: String,
    required: true
  },
  beforeUpload: {
    type: Function as PropType<CheckUpload>
  },
  drag: {
    type: Boolean,
    default: false
  },
  autoUpload: {
    type: Boolean,
    default: true
  },
  listType: {
    type: String as PropType<FileListType>,
    default: "text"
  },
  showUploadList: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["success", "error", "change"]);
const isUploading = computed(() => filesList.value.some(file => file.status === "loading"));
const fileInput = ref<null | HTMLInputElement>(null);
const filesList = ref<UploadFile[]>([]);
const isDragOver = ref(false);
const lastFileData = computed(() => {
  const lastFile = last(filesList.value);
  if (lastFile) {
    return {
      loaded: lastFile.status === "success",
      data: lastFile.resp
    }
  }
  return false;
});

const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

const removeFile = (id: string) => {
  filesList.value = filesList.value.filter(file => file.uid !== id);
}


const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  beforeUploadCheck(files);
}

const beforeUploadCheck = (files: null | FileList) => {
  if (files) {
    const uploadedFile = files[0];
    // console.log(uploadedFile)
    if (props.beforeUpload) {
      const result = props.beforeUpload(uploadedFile);
      if (result && result instanceof Promise) {
        result.then(processedFile => {
          if (processedFile instanceof File) {
            addFileToList(processedFile);
          } else {
            throw new Error("beforeUpload Promise should return File object");
          }
        }).catch((e) => console.error(e));
      } else if (result === true) {
        addFileToList(uploadedFile);
      }
    } else {
      addFileToList(uploadedFile);
    }
  }
}

const uploadFiles = () => {
  filesList.value.filter(file => file.status === "ready").forEach(readyFile => postFile(readyFile));
}

let events: { [ket: string]: (e: any) => void } = {
  "click": triggerUpload
}

const handleDrag = (e: DragEvent, over: boolean) => {
  e.preventDefault();
  isDragOver.value = over;
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  if (e.dataTransfer) {
    beforeUploadCheck(e.dataTransfer.files);
  }
}

if (props.drag) {
  events = {
    ...events,
    "dragover": (e: DragEvent) => { handleDrag(e, true) },
    "dragleave": (e: DragEvent) => { handleDrag(e, false) },
    "drop": handleDrop
  }
}

const addFileToList = (uploadFile: File) => {
  const fileObj = reactive<UploadFile>({
    uid: v4(),
    size: uploadFile.size,
    name: uploadFile.name,
    status: "ready",
    raw: uploadFile
  });
  if (props.listType === "picture") {
    try {
      fileObj.url = URL.createObjectURL(uploadFile)
    } catch (error) {
      console.error("upload File error", error);
    }
  }
  // console.log(uploadFile)
  filesList.value.push(fileObj);
  if (props.autoUpload) {
    postFile(fileObj)
  }
}

const postFile = (readyFile: UploadFile) => {
  const formData = new FormData();
  formData.append(readyFile.name, readyFile.raw);
  readyFile.status = "loading";
  axios.post(props.action, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then(resp => {
    readyFile.status = "success";
    readyFile.resp = resp.data;
    // console.log(readyFile.raw);
    emit("success", { resp: resp.data, file: readyFile, list: filesList.value });
  }).catch((e: any) => {
    readyFile.status = "error";
    emit("error", { error: e, file: readyFile, list: filesList.value });
  }).finally(() => {
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  })
}
</script>

<template>
  <div class="file-upload">
    <div v-on="events" class="upload-area" :class="{ 'is-dragouver': drag && isDragOver }">
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot name="uploaded" v-else-if="lastFileData && lastFileData.loaded" :uploadedData="lastFileData.data">
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input type="file" ref="fileInput" :style="{ display: 'none' }" @change="handleFileChange">
    <ul :class="`upload-list upload-list-${listType}`" v-if="showUploadList">
      <li :class="`uploaded-file upload-${file.status}`" v-for="file in filesList" :key="file.uid">
        <img v-if="file.url && listType === 'picture'" class="upload-list-thumbnail" :src="file.url" :alt="file.name">
        <span v-if="file.status === 'loading'" class="file-icon">
          <LoadingOutlined></LoadingOutlined>
        </span>
        <span v-else class="file-icon">
          <FileOutlined></FileOutlined>
        </span>
        <span class="filename">{{ file.name }}</span>
        <span class="delete-icon" @click="removeFile(file.uid)">
          <DeleteOutlined></DeleteOutlined>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.upload-error {
  color: red
}

div.is-dragouver {
  background-color: blue;
}

.upload-area {
  width: 300px;
  height: 300px;
  background-color: aqua;
}
</style>
