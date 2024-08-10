import { defineComponent } from "vue";

export const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [Object, String],
      required: true
    }
  },
  render() {
    return this.vNode
  }
})