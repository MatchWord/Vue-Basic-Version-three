import Cookies from "js-cookie";

const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : true, // 菜单是否展开
    withoutAnimation: false // 是否有动画
  },
  device: "desktop", // 设备类型
  size: Cookies.get('size') || 'medium' // 文本大小
};

const mutations = {
  // 设置左侧菜单开关以及动画
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  // 关闭左侧菜单开关以及动画
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  // 设置设备类型
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  // 设置文本大小
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
};

const actions = {
  // 设置左侧菜单开关以及动画
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  // 关闭左侧菜单开关以及动画
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  // 设置设备类型
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  // 设置文本大小
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
