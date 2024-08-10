import { defineStore } from "pinia";
import { v4 } from "uuid"

export interface EditorProps {
  components: ComponentData[],
  currentElement: string
}

export interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}

export interface PageData {
  id?: number;
  props?: PageProps;
  title?: string;
  desc?: string;
  coverImg?: string;
  uuid?: string;
  setting?: { [key: string]: any };
  isTemplate?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  author?: string;
  copiedCount?: number;
  status?: number;
  user? : {
    gender: string;
    nickName: string;
    picture: string;
    userName: string;
  };
}

// export interface ComponentData {
//   // 这个元素的 属性，属性请详见下面
//   props: Partial<AllComponentProps>;
//   // id，uuid v4 生成
//   id: string;
//   // 业务组件库名称 l-text，l-image 等等 
//   name: 'l-text' | 'l-image' | 'l-shape';
//   // 图层是否隐藏
//   isHidden?: boolean;
//   // 图层是否锁定
//   isLocked?: boolean;
//   // 图层名称
//   layerName?: string;
// }

export interface ComponentData {
  props: { [key: string]: any }
  id: string,
  name: string
}

export const testComponents: ComponentData[] = [
  { props: { text: "hello", fontSize: "60px", color: "red", lineHeight: "1", textAlign: "left", fontFamily: "" }, id: v4(), name: "LText" },
  { props: { text: "123", fontSize: "30px", fontWeight: "bold" }, id: v4(), name: "LText", }
]

export const useEditorStore = defineStore("editor", {
  state: (): EditorProps => {
    return {
      components: testComponents,
      currentElement: ""
    }
  },
  getters: {
    getCurrentElement: (state) => { return state.components.find((component) => component.id === state.currentElement) }
  }
});
