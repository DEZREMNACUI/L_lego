<script setup lang="ts">
import { computed, defineComponent, PropType, VNode } from 'vue';
import { TextComponentProps } from '../defaultProps';
import { reduce } from 'lodash-es';
import { mapPropsToForms } from '../propsMap';
import { Input, InputNumber, RadioButton, RadioGroup, Select, SelectOption, Slider, Textarea } from 'ant-design-vue';
import { RenderVnode } from './RenderVnode';
import ColorPicker from './ColorPicker.vue';

interface FormProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  valueProp: string;
  eventName: string;
  events: { [key: string]: (e: any) => void };
}


const props = defineProps({
  props: {
    type: Object as PropType<TextComponentProps>,
    required: true
  }
});

const emit = defineEmits(["change"]);

const finalProps = computed(() => reduce(props.props, (result, value, key) => {
  const newKey = key as keyof TextComponentProps;
  const item = mapPropsToForms[newKey];
  if (item) {
    const { valueProp = "value", eventName = "change", initialTransform, afterTransform } = item
    valueProp;
    const newItem: FormProps = {
      ...item,
      value: initialTransform ? initialTransform(value) : value,
      valueProp,
      eventName,
      events: {
        [eventName]: (e: any) => {
          emit("change", { key, value: afterTransform ? afterTransform(e) : e });
        }
      }
    }
    // item.value = item.initialTransform ? item.initialTransform(value) : value;
    // item.valueProp = item.valueProp ? item.valueProp : "value";
    result[newKey] = newItem;
  }
  return result
}, {} as { [key: string]: FormProps }));



</script>

<script lang="ts">
export default defineComponent({
  components: {
    "a-input": Input,
    "a-input-number": InputNumber,
    "a-slider": Slider,
    "a-textarea": Textarea,
    "a-radio-group": RadioGroup,
    "a-radio-button": RadioButton,
    "a-select": Select,
    "a-select-option": SelectOption,
    "color-picker":ColorPicker
  }
})
</script>
<template>
  <div>
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span>{{ value?.text }}</span>
      <div>
        <component :is="value?.component" :[value.valueProp]="value?.value" v-bind="value?.extraProps"
          v-on="value.events">
          <template v-if="value?.options">
            <component :is="value.subComponent" v-for="(option, key) in value.options" :key="key" :value="option.value">
              <!-- {{ option.text }} -->
              <render-vnode :v-node="option.text"></render-vnode>
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
