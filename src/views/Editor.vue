<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ComponentData, EditorProps, useEditorStore } from '../store/editorStore';
import LText from '../components/L-Text.vue';
import ComponentList from '../components/ComponentList.vue';
import { defaultTextTemplates } from '../defaultTemplateDefaults';
import EditorWrapper from '../components/EditorWrapper.vue';
import PropsTable from '../components/PropsTable.vue';
import { TextComponentProps } from '../defaultProps';
import { Input } from 'ant-design-vue';
const editorStore = useEditorStore();
const { components, currentElement, getCurrentElement } = storeToRefs(editorStore);
const addItem = (component: ComponentData) => {
  editorStore.components.push(component);
}
const deleteItem = (component: ComponentData) => {
  const index = editorStore.components.indexOf(component);
  editorStore.components.splice(index, 1);
}

const setActive = (id: string) => {
  currentElement.value = id;
}

const handleChange = (e: { key: any, value: any }) => {
  // console.log(e);
  getCurrentElement.value!.props[e.key] = e.value;
}

</script>
<script lang="ts">
export default {
  components: {
    LText,
    "a-input": Input
  }
}
</script>

<template>
  <a-layout>
    <a-layout-header :style="{ background: 'white' }">
      L_lego
    </a-layout-header>
  </a-layout>
  <a-layout>
    <a-layout-sider width="300" :style="{ background: 'white' }">
      <div>
        <ComponentList :list="defaultTextTemplates" @on-item-click="addItem"></ComponentList>
      </div>
    </a-layout-sider>
    <a-layout-content>
      <a-layout>
        <div class="relative">
          <EditorWrapper v-for="component in components" :key="component.id" :id="component.id" @set-active="setActive"
            :active="currentElement === component.id">
            <component v-bind="{ ...component.props, position: 'relative' }" :is="component.name" />
            <button @click="deleteItem(component)">删除</button>
          </EditorWrapper>
        </div>
      </a-layout>
    </a-layout-content>
    <a-layout-sider width="300" :style="{ background: 'white' }">
      组件属性
      <PropsTable v-if="getCurrentElement" :props="(getCurrentElement.props as TextComponentProps)"
        @change="handleChange"></PropsTable>
      <pre>
        {{ getCurrentElement?.props }}
      </pre>
    </a-layout-sider>
  </a-layout>
  <a-layout>
    <a-layout-footer>
      footer
    </a-layout-footer>
  </a-layout>
</template>

<style scoped></style>
