import { defineStore } from "pinia";
import { v4 } from "uuid"

export interface EditorProps {
  components: ComponentData[],
  currentElement: string
}

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
