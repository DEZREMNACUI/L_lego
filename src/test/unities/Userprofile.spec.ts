// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, Mocked, vi } from "vitest"
import { mount, VueWrapper } from "@vue/test-utils"
import UserProfile from "../../components/UserProfile.vue"
import { createPinia, setActivePinia, Store } from 'pinia';
import { User, useUserStore } from "../../store/userStore";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
let wrapper: VueWrapper

let routesArr: string[] = [];

vi.mock("message", () => ({
  success: vi.fn()
}));
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push(url: string) {
      routesArr.push(url);
    }
  })
}));
vi.mock("ant-design-vue");
vi.useFakeTimers();

const mockComponent = {
  template: '<div><slot></slot></div>'
}
const mockComponent2 = {
  template: "<div><slot></slot><slot name='overlay'></slot></div>"
}
const globalComponents = {
  'a-button': mockComponent,
  'a-dropdown-button': mockComponent2,
  'router-link': mockComponent,
  'a-menu': mockComponent,
  'a-menu-item': mockComponent
}

let userStore: Store<string, User, {}, {}>;
describe.skip("UserProfileComponent", () => {
  // beforeEach(() => {
  //   setActivePinia(createPinia());
  // });
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    userStore = useUserStore()
    wrapper = mount(UserProfile, {
      global: {
        components: globalComponents
      }
    })
  })
  afterEach(() => {
    (message as Mocked<typeof message>).success.mockReset();
    routesArr.pop();
  });
  it("should render button when login is false", async () => {
    // console.log(wrapper.html());
    // console.log(wrapper.get("div").text());
    userStore.isLogin = false;
    expect(wrapper.get("div").text()).toBe("登录");
    await wrapper.get("div").trigger("click")
    vi.runOnlyPendingTimers();
    expect(message.success).toHaveBeenCalledTimes(1);
    expect(userStore.isLogin).toBe(true);
  });
  it("should render username when login is true", async () => {
    userStore.isLogin = true
    await wrapper.vm.$nextTick()
    await wrapper.get(".logout").trigger("click");
    expect(message.success).toHaveBeenCalledTimes(1);
    vi.runOnlyPendingTimers();
    // console.log(routesArr)
    expect(routesArr).toEqual(["/"]);
    // console.log(wrapper.html());
  });
})