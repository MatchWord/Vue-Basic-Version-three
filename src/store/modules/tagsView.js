const state = {
  visitedViews: [], // 访问视图
  cachedViews: [] // 缓存视图
}
const mutations = {
  // 添加访问视图列表
  ADD_VISITED_VIEW: (state, view) => {
    // 访问当前路由存在，不添加
    if (state.visitedViews.some(v => v.path === view.path)) return
    // 添加当前视图所有信息
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || '无名'
      })
    )
  },
  // 添加缓存视图列表
  ADD_CACHED_VIEW: (state, view) => {
    // 缓存视图列表存在，不添加
    if (state.cachedViews.includes(view.name)) return
    // 当前路由设置不缓存，不添加
    if (!view.meta.noCache) {
      // 添加当前视图名称
      state.cachedViews.push(view.name)
    }
  },
  // 删除访问视图列表的当前视图
  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
   // 删除缓存视图列表的当前视图
  DEL_CACHED_VIEW: (state, view) => {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews.splice(index, 1)
        break
      }
    }
  },
  // 删除访问视图列表中的不是当前访问的视图列表
  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  // 删除缓存视图列表中的不是当前访问的视图列表
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews = state.cachedViews.slice(index, index + 1)
        break
      }
    }
  },
  // 清空访问视图列表中所有列表（除了默认）
  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  // 清空缓存视图列表中所有列表
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },
  // 更新访问视图列表中所有列表
  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  },
  // 拖拽视图
  DRAGED_VIEWS (state, views) {
    state.visitedViews = views
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  // 删除访问视图和缓存视图中的各一条
  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  // 删除访问视图中的一条
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  // 删除缓存视图中的一条
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  // 删除访问视图和缓存视图（除了当前的和默认的）其他所有列表
  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  // 删除访问视图（除了当前的和默认的）其他所有列表
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  // 删除缓存视图（除了当前的）其他所有列表
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },
  // 清空所有视图（包括访问视图和缓存视图）
  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  // 清空所有访问视图（除去默认和当前）
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  // 清空所有缓存视图
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },
  // 更新访问视图
  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  },
   // 拖拽视图
  dragedViews ({commit}, views) {
    return new Promise((resolve, reject) => {
      commit('DRAGED_VIEWS', views)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}