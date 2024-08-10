import { h, VNode } from "vue";
import { TextComponentProps } from "./defaultProps"
export interface PropToForm {
  component: string;
  value?: string;
  subComponent?: string;
  options?: { value: any, text: string | VNode }[]
  extraProps?: { [key: string]: any };
  text?: string;
  initialTransform?: (v: any) => any,
  afterTransform?: (v: any) => any,
  valueProp?: string,
  eventName?: string
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm
}

const fontFamilyArr = [{ text: '宋体', value: '"SimSun","STSong"' },
{ text: '黑体', value: '"SimHei","STHeiti"' },
{ text: '楷体', value: '"KaiTi","STKaiti"' },
{ text: '仿宋', value: '"FangSong","STFangsong"' },];
const fontFamilyOptions = fontFamilyArr.map((font) => ({
  value: font.value,
  text: h("span", { style: { fontFamily: font.value } }, font.text)
}));

export const mapPropsToForms: PropsToForms = {
  text: {
    component: "a-textarea",
    extraProps: {
      row: 3
    },
    text: "文本",
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    component: "a-input-number",
    text: "字号",
    initialTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e ? `${e}px` : ""
  },
  lineHeight: {
    component: "a-slider",
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    text: "行高",
    initialTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString()
  },
  textAlign: {
    component: "a-radio-group",
    subComponent: "a-radio-button",
    text: "对齐",
    options: [
      { value: "left", text: "左" },
      { value: "center", text: "中" },
      { value: "right", text: "右" }
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体',
    options: [
      { text: "无", value: "" },
      ...fontFamilyOptions
    ]
  },
  color:{
    component:"color-picker",
    text:"字体颜色"
  }
}
