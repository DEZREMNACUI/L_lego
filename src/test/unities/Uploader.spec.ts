// @vitest-environment jsdom
import { flushPromises, mount, shallowMount, VueWrapper } from "@vue/test-utils";
import axios from "axios";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import Uploader from "../../components/Uploader.vue";

vi.mock("axios");
const mockedAxios = axios as Mocked<typeof axios>;
let wrapper: VueWrapper;
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })
const testFile2 = new File(['xyz'], 'viking.png', { type: 'image/png' })

const mockComponent = {
  template: `<div><slot></slot></div>`
};

const mockComponents = {
  'DeleteOutlined': mockComponent,
  'LoadingOutlined': mockComponent,
  'FileOutlined': mockComponent,
}

const setInputValue = (input: HTMLInputElement) => {
  const files = [testFile] as any;
  Object.defineProperty(input, "files", {
    value: files,
    writable: false
  });
}

let resolvePost: any;
let rejectPost: any;
const mockAxiosPost = () => {
  const mockPostPromise = new Promise((resolve, reject) => {
    resolvePost = resolve;
    rejectPost = reject;
  });
  // 模拟 axios.post 方法返回的值
  mockedAxios.post.mockImplementation(() => mockPostPromise);
}
describe("Uploader Component", () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: "test.url"
      }
    });
  });
  beforeEach(() => {
    mockAxiosPost();
  });
  afterEach(() => {
    mockedAxios.post.mockReset();
  });
  it("basic layout before uploading", () => {
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.get("button").text()).toBe("点击上传");
    expect(wrapper.get("input").isVisible()).toBeFalsy();
  })
  it("upload process should works fine", async () => {
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    // console.log(wrapper.html())
    await wrapper.get("input").trigger("change")
    // console.log(wrapper.html())
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.get("button").text()).toBe("正在上传");
    // console.log(wrapper.get("button").attributes())
    expect(wrapper.get("button").attributes()).toHaveProperty("disabled");
    expect(wrapper.findAll("li").length).toBe(1);
    const firstItem = wrapper.get("li:first-child");
    expect(firstItem.classes()).toContain("upload-loading");
    resolvePost({ data: { message: 'Hello, World!' } });
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("点击上传");
    expect(firstItem.classes()).toContain("upload-success");
    expect(firstItem.get(".filename").text()).toBe(testFile.name);
  });
  it("should return error text when post is rejected", async () => {
    mockedAxios.post.mockReset();
    mockedAxios.post.mockRejectedValueOnce({ error: "error" });
    await wrapper.get("input").trigger("change");
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("点击上传");

    expect(wrapper.findAll("li").length).toBe(2);
    const lastItem = wrapper.get("li:last-child");
    expect(lastItem.classes()).toContain("upload-error");
    //点击列表右侧button删除这一项
    await lastItem.get(".delete-icon").trigger("click");
    expect(wrapper.findAll("li").length).toBe(1);
  });
  it("should show the correct interface when using custom slot", async () => {
    const wrapper = mount(Uploader, {
      props: {
        action: "test.url"
      },
      slots: {
        default: `<button>Custom button</button>`,
        loading: `<div class="loading">custom loading</div>`,
        uploaded: `<template #uploaded="{uploadedData}">
          <div class="custom-loaded">{{uploadedData.url}} </div>
        </template>`
      },
      global: {
        stubs: mockComponents
      }
    });
    expect(wrapper.get("button").text()).toBe("Custom button");
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    expect(wrapper.get(".loading").text()).toBe("custom loading");
    resolvePost({
      data: {
        url: "first.url"
      }
    });
    await flushPromises();
    expect(wrapper.get(".custom-loaded").text()).toBe("first.url");
    mockAxiosPost();
    await wrapper.get("input").trigger("change");
    expect(wrapper.get(".loading").text()).toBe("custom loading");
    resolvePost({
      data: {
        url: "xyz.url"
      }
    });
    await flushPromises();
    expect(wrapper.get(".custom-loaded").text()).toBe("xyz.url");
  });
  it("before upload check", async () => {
    const callback = vi.fn();
    const checkFileSize = (file: File) => {
      if (file.size > 2) {
        callback();
        return false;
      }
      return true;
    }
    const wrapper = shallowMount(Uploader, {
      props: {
        action: "test.url",
        beforeUpload: checkFileSize
      }
    });
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    // mockedAxios.post.mockReset();
    // mockAxiosPost();
    await wrapper.get("input").trigger("change");
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(wrapper.findAll("li").length).toBe(0);
    expect(callback).toHaveBeenCalled();
  });
  it("before upload check using Promise", async () => {
    const failedPromise = (file: File) => {
      return Promise.reject("wrong type");
    }
    const successPromise = (file: File) => {
      const newFile = new File([file], "new_name.docx", { type: file.type });
      return Promise.resolve(newFile);
    }
    const successPromiseWithWrongType = (file: File) => {
      return Promise.resolve("1");
    }
    const wrapper = shallowMount(Uploader, {
      props: {
        action: "test.url",
        beforeUpload: failedPromise
      }
    });
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    setInputValue(fileInput);
    await wrapper.get("input").trigger("change");
    await flushPromises();
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(wrapper.findAll("li").length).toBe(0);
    //success promise with wrong file
    await wrapper.setProps({
      beforeUpload:successPromiseWithWrongType as any
    });
    await wrapper.get("input").trigger("change");
    await flushPromises();
    expect(mockedAxios.post).not.toHaveBeenCalled();
    //success promise with file
    mockedAxios.post.mockReset();
    mockAxiosPost();
    await wrapper.setProps({
      beforeUpload: successPromise
    });
    await wrapper.get("input").trigger("change");
    resolvePost("1");
    await flushPromises();
    expect(mockedAxios.post).toHaveBeenCalled();
    const firstItem = wrapper.get("li:first-child");
    expect(firstItem.classes()).toContain("upload-success");
    expect(firstItem.get(".filename").text()).toBe("new_name.docx");
  });
});