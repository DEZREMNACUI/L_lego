// @vitest-environment jsdom
import { beforeAll, beforeEach, describe, expect, it } from "vitest"
import ColorPicker from "../../components/ColorPicker.vue"
import { mount, VueWrapper } from "@vue/test-utils";
import rgbHex from "rgb-hex";

const defaultColors = ['#ffffff', '#f5222d', '#fa541c', '#fadb14', '#52c41a', '#1890ff', '#722ed1', '#8c8c8c', '#000000', '']

let wrapper: VueWrapper
describe.skip("ColorPickerComponent", () => {
  beforeAll(() => {
    wrapper = mount(ColorPicker, {
      props: {
        value: "#ffffff"
      }
    });
  });
  it("should render correct interface", () => {
    // <div><input></div>
    // <ul class="picked-color-list">
    // <li class="item-0" or class="transparent-back">
    // <div></div>
    // </li></ul>

    // 测试左侧是否为 input，类型和值是否正确
    expect(wrapper.find("input").exists()).toBeTruthy();
    const input = wrapper.get("input").element;
    expect(input.type).toEqual("color");
    expect(input.value).toEqual(defaultColors[0]);
    // 测试右侧是否有颜色的列表
    expect(wrapper.findAll(".picked-color-list li").length).toBe(defaultColors.length);
    // 检查一个元素的 css backgroundColor属性是否相等对应的颜色
    const firstItem = wrapper.get(".picked-color-list li:first-child div").element as HTMLElement;
    expect("#" + rgbHex(firstItem.style.backgroundColor)).toBe(defaultColors[0]);
    //检查最后一个元素是否有特殊类名
    const lastItem = wrapper.get(".picked-color-list li:last-child div").element as HTMLElement;
    expect(lastItem.classList.contains("transparent-back")).toBeTruthy;
  });

  it("should send the correct event when changing input", async () => {
    const blackHex = "#000000";
    const input = wrapper.get("input")
    await input.setValue(blackHex);
    expect(wrapper.emitted()).toHaveProperty("change");
    const emits = wrapper.emitted("change");
    expect(emits![0]).toEqual([blackHex]);
  })

  it('should send the correct event when clicking the color list', async () => {
    // 测试点击右侧颜色列表以后，是否发送对应的值
    const firstItem = wrapper.get('li:first-child div')
    firstItem.trigger('click')
    const events = wrapper.emitted('change')
    // console.log(events);
    expect(events![1]).toEqual([defaultColors[0]])
  })
});