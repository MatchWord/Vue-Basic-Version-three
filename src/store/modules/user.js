// api
import { login, logout, getInfo } from "@/api/user";
// cookie
import { getToken, setToken, removeToken } from "@/utils/auth";
// router
import { resetRouter } from "@/router";
// 是否使用api
import { USE_API } from "@/config/BasicConfig";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  roles: []
};

const mutations = {
  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  // 设置用户名
  SET_NAME: (state, name) => {
    state.name = name;
  },
  // 设置头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  // 设置角色
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
};

const actions = {
  // 用户登陆
  login({ commit }, userInfo) {
    // 使用接口
    if (USE_API.isUseApi) {
      return new Promise((resolve, reject) => {
        // 登陆接口
        login(userInfo).then(response => {
            commit("SET_TOKEN", response.token);
            setToken(response.token);
            resolve();
          }).catch(error => {
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        // 直接登陆
        const token = 'eyJzdWIiOiIxIiwiaXNzIjoiemh'
        commit("SET_TOKEN", token);
        setToken(token);
        resolve();
      }).catch(error => {
        reject(error);
      })
    }
    
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    // 使用接口
    if (USE_API.isUseApi) {
      return new Promise((resolve, reject) => {
        const params = {
          token: state.token
        }
        getInfo(params).then(response => {
            if (!response) {
              reject("验证失败，请重新登录。");
            }
            // 不存在角色，默认创建
            if (!response.roles) {
              response.roles = ['admin', 'user']
            }
            // 角色必须是非空数组
            if (!response.roles || response.roles.length <= 0) {
              reject('getinfo:角色必须是非空数组！')
            }
            commit('SET_ROLES', response.roles)
            commit('SET_NAME', response.name)
            commit('SET_AVATAR', response.avatar)
            resolve(response)
          }).catch(error => {
            reject(error)
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        let response = {}
        response.roles = ['admin', 'user']
        response.name = '帅哥'
        response.avatar = ''
        commit('SET_ROLES', response.roles)
        commit('SET_NAME', response.name)
        commit('SET_AVATAR', response.avatar)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    }
  },

  // 用户退出登陆
  logout({ commit, state }) {
    // 使用接口
    if (USE_API.isUseApi) {
      return new Promise((resolve, reject) => {
        const params = {
          token: state.token
        }
        logout(params).then(() => {
            commit("SET_TOKEN", "");
            commit('SET_ROLES', [])
            removeToken();
            resetRouter();
            resolve();
          }).catch(error => {
            reject(error);
          });
      });
    } else {
      commit("SET_TOKEN", "");
      commit('SET_ROLES', [])
      removeToken();
      resetRouter();
    }
    
  },

  // 删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit('SET_ROLES', [])
      removeToken();
      resolve();
    });
  },

  // 动态修改权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'
      commit('SET_TOKEN', token)
      setToken(token)
      // 获取用户信息
      const { roles } = await dispatch('getInfo')
      resetRouter()
      // 基于角色生成可访问的路由映射
      const accessRoutes = await dispatch('routesPermission/generateRoutes', roles, { root: true })
      // 动态添加可访问的路由
      router.addRoutes(accessRoutes)
      resolve()
    })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
